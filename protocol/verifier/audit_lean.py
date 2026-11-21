#!/usr/bin/env python3
"""
ProofChain Lean 4 Axiom & Soundness Auditor.

Performs:
1. Static soundness checks (forbidding sorry, admit, custom axioms, unsafe/extern/native_decide).
2. Comment-stripping & AST-style normalization for prompt-injection-resistant hashing/scoring.
3. Optional Lean 4 compiler check if `lean` / `lake` is installed in the environment.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import List, Optional, Tuple


FORBIDDEN_PATTERNS: List[Tuple[str, str, str]] = [
    ("SORRY", r"\bsorry\b", "Incomplete proof token `sorry` is forbidden in verified submissions."),
    ("ADMIT", r"\badmit\b", "Incomplete proof token `admit` is forbidden in verified submissions."),
    ("CUSTOM_AXIOM", r"^\s*axiom\b", "Custom `axiom` declarations are forbidden."),
    ("UNSAFE_DECL", r"\bunsafe\b", "`unsafe` definitions/casts bypass soundness."),
    ("IMPLEMENTED_BY", r"@\[\s*implemented_by\b", "`@[implemented_by]` can bypass kernel checking."),
    ("EXTERN_ATTR", r"@\[\s*extern\b", "`@[extern]` FFI declarations are forbidden."),
    ("NATIVE_DECIDE", r"\bnative_decide\b", "`native_decide` trusts compiler reduction outside kernel."),
    ("OF_REDUCE_BOOL", r"\bLean\.ofReduceBool\b", "`Lean.ofReduceBool` is forbidden."),
    ("CSIMP_BYPASS", r"@\[\s*csimp\b", "`@[csimp]` runtime substitution is forbidden."),
]


@dataclass
class AuditFinding:
    code: str
    line: int
    message: str
    snippet: str


@dataclass
class AuditReport:
    path: str
    passed: bool
    kernel_verified: bool
    allow_sorry: bool
    sorry_count: int
    theorem_names: List[str]
    normalized_sha256: str
    ast_token_count: int
    findings: List[AuditFinding]
    kernel_output: Optional[str] = None


def strip_lean_comments(source: str) -> str:
    """Strip `-- ...` line comments and nested `/- ... -/` block comments while keeping newlines."""
    result: List[str] = []
    i = 0
    n = len(source)
    block_depth = 0
    in_string = False

    while i < n:
        ch = source[i]
        nxt = source[i + 1] if i + 1 < n else ""

        if block_depth > 0:
            if ch == "/" and nxt == "-":
                block_depth += 1
                i += 2
            elif ch == "-" and nxt == "/":
                block_depth -= 1
                i += 2
            else:
                if ch == "\n":
                    result.append("\n")
                i += 1
            continue

        if in_string:
            result.append(ch)
            if ch == "\\" and i + 1 < n:
                result.append(nxt)
                i += 2
                continue
            if ch == '"':
                in_string = False
            i += 1
            continue

        if ch == '"':
            in_string = True
            result.append(ch)
            i += 1
            continue

        if ch == "/" and nxt == "-":
            block_depth = 1
            i += 2
            continue

        if ch == "-" and nxt == "-":
            while i < n and source[i] != "\n":
                i += 1
            continue

        result.append(ch)
        i += 1

    return "".join(result)


def normalize_lean_code(source: str) -> str:
    """Strip comments and normalize whitespace for deterministic hashing & anti-injection."""
    cleaned = strip_lean_comments(source)
    lines = [re.sub(r"\s+", " ", line).strip() for line in cleaned.splitlines()]
    return "\n".join(line for line in lines if line)


def audit_source(source: str, path: str = "<memory>", allow_sorry: bool = False, run_kernel: bool = False) -> AuditReport:
    stripped = strip_lean_comments(source)
    lines = stripped.splitlines()
    findings: List[AuditFinding] = []
    sorry_count = 0

    for idx, line in enumerate(lines, start=1):
        for code, pattern, message in FORBIDDEN_PATTERNS:
            if re.search(pattern, line):
                if code == "SORRY":
                    sorry_count += len(re.findall(pattern, line))
                    if allow_sorry:
                        continue
                findings.append(AuditFinding(code=code, line=idx, message=message, snippet=line.strip()[:120]))

    theorem_names = re.findall(r"^\s*(?:theorem|lemma|def)\s+([A-Za-z_][A-Za-z0-9_']*)", stripped, flags=re.MULTILINE)
    normalized = normalize_lean_code(source)
    digest = hashlib.sha256(normalized.encode("utf-8")).hexdigest()
    tokens = re.findall(r"[A-Za-z_][A-Za-z0-9_']*|\d+|[^\s]", normalized)

    kernel_verified = False
    kernel_output = None

    if run_kernel and shutil.which("lean") and path != "<memory>" and not findings:
        proc = subprocess.run(
            ["lean", path],
            capture_output=True,
            text=True,
            timeout=120,
        )
        kernel_output = (proc.stdout + "\n" + proc.stderr).strip()
        if proc.returncode == 0:
            kernel_verified = True
        else:
            findings.append(
                AuditFinding(
                    code="KERNEL_ERROR",
                    line=0,
                    message="Lean kernel verification failed.",
                    snippet=kernel_output[:240],
                )
            )

    return AuditReport(
        path=path,
        passed=len(findings) == 0,
        kernel_verified=kernel_verified,
        allow_sorry=allow_sorry,
        sorry_count=sorry_count,
        theorem_names=theorem_names,
        normalized_sha256=digest,
        ast_token_count=len(tokens),
        findings=findings,
        kernel_output=kernel_output,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="ProofChain Lean 4 Axiom & Soundness Auditor")
    parser.add_argument("file", help="Path to Lean 4 source file")
    parser.add_argument("--allow-sorry", action="store_true", help="Allow `sorry` (for open/partial problem blueprints)")
    parser.add_argument("--kernel", action="store_true", help="Invoke local `lean` binary if available")
    parser.add_argument("--json", action="store_true", dest="as_json", help="Emit JSON output")
    args = parser.parse_args()

    file_path = Path(args.file)
    if not file_path.exists():
        print(f"Error: file not found: {file_path}", file=sys.stderr)
        return 2

    report = audit_source(
        file_path.read_text(encoding="utf-8"),
        path=str(file_path),
        allow_sorry=args.allow_sorry,
        run_kernel=args.kernel,
    )

    if args.as_json:
        print(json.dumps(asdict(report), indent=2, ensure_ascii=False))
    else:
        status = "PASS" if report.passed else "FAIL"
        print(f"[{status}] {report.path}")
        print(f"  Declarations : {', '.join(report.theorem_names) or '(none)'}")
        print(f"  AST Tokens   : {report.ast_token_count}")
        print(f"  Sorry Count  : {report.sorry_count}")
        print(f"  Norm SHA-256 : {report.normalized_sha256[:16]}...")
        for f in report.findings:
            print(f"  - [{f.code}] line {f.line}: {f.message} :: {f.snippet}")

    return 0 if report.passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
