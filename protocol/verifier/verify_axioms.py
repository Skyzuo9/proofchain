#!/usr/bin/env python3
"""
ProofChain Real Lean 4 Kernel `#print axioms` Auditor.

Invokes `lake env lean` on generated `#print axioms` scripts for every verified
or refuted declaration across all problem blueprints.

Strictly enforces that every claimed proof depends ONLY on standard Lean 4 /
Mathlib foundational axioms:
    ALLOWED_AXIOMS = {"propext", "Classical.choice", "Quot.sound"}

Rejects `sorryAx`, `Lean.ofReduceBool`, `Lean.trustCompiler`, or any custom axiom!
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Set

ROOT = Path(__file__).resolve().parents[2]
PROBLEMS_DIR = ROOT / "problems"
ATTESTATION_OUT = ROOT / "ledger" / "kernel_attestation.json"

ALLOWED_AXIOMS: Set[str] = {"propext", "Classical.choice", "Quot.sound"}

RE_DEPENDS = re.compile(r"'([^']+)'\s+depends on axioms:\s*\[([^\]]*)\]")
RE_NO_AXIOMS = re.compile(r"'([^']+)'\s+does not depend on any axioms")


def verify_problem_axioms(blueprint: Dict[str, Any]) -> Dict[str, Any]:
    module = blueprint["lean_module"]
    checked_nodes = [
        n for n in blueprint.get("nodes", [])
        if n.get("status") in ("verified", "golfed", "refuted")
    ]

    if not checked_nodes:
        return {
            "problem_id": blueprint["id"],
            "lean_module": module,
            "kernel_verified": True,
            "declarations": [],
            "errors": [],
        }

    lines = [f"import {module}", ""]
    expected_full_names: Dict[str, Dict[str, Any]] = {}
    for node in checked_nodes:
        full_name = f"{module}.{node['lean_name']}"
        expected_full_names[full_name] = node
        lines.append(f"#print axioms {full_name}")

    check_source = "\n".join(lines) + "\n"

    with tempfile.NamedTemporaryFile("w", suffix=".lean", dir=ROOT, delete=False, encoding="utf-8") as tf:
        tf.write(check_source)
        tmp_path = Path(tf.name)

    try:
        proc = subprocess.run(
            ["lake", "env", "lean", str(tmp_path)],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=180,
        )
    finally:
        tmp_path.unlink(missing_ok=True)

    combined = (proc.stdout + "\n" + proc.stderr).strip()
    found_axioms: Dict[str, List[str]] = {}

    for line in combined.splitlines():
        m_dep = RE_DEPENDS.search(line)
        if m_dep:
            name = m_dep.group(1).strip()
            raw_list = m_dep.group(2).strip()
            axs = [a.strip() for a in raw_list.split(",") if a.strip()]
            found_axioms[name] = axs
            continue
        m_none = RE_NO_AXIOMS.search(line)
        if m_none:
            name = m_none.group(1).strip()
            found_axioms[name] = []

    declarations: List[Dict[str, Any]] = []
    errors: List[str] = []

    if proc.returncode != 0:
        errors.append(f"Lean kernel exited with code {proc.returncode}: {combined[:400]}")

    for full_name, node in expected_full_names.items():
        if full_name not in found_axioms:
            errors.append(f"Declaration not found or failed to compile: {full_name}")
            declarations.append({
                "node_id": node["id"],
                "full_name": full_name,
                "status": node["status"],
                "axioms": [],
                "forbidden_axioms": ["MISSING_DECLARATION"],
                "passed": False,
            })
            continue

        axs = found_axioms[full_name]
        forbidden = [a for a in axs if a not in ALLOWED_AXIOMS]
        passed = len(forbidden) == 0 and proc.returncode == 0
        if forbidden:
            errors.append(f"{full_name} uses forbidden axiom(s): {forbidden}")
        declarations.append({
            "node_id": node["id"],
            "full_name": full_name,
            "status": node["status"],
            "axioms": axs,
            "forbidden_axioms": forbidden,
            "passed": passed,
        })

    return {
        "problem_id": blueprint["id"],
        "lean_module": module,
        "kernel_verified": len(errors) == 0,
        "declarations": declarations,
        "errors": errors,
    }


def format_markdown(attestation: Dict[str, Any]) -> str:
    lines = [
        f"### Lean 4 Kernel `#print axioms` Audit (`{attestation['toolchain']}`)",
        "",
        "| Problem | Node | Declaration | Kernel Axioms | Result |",
        "|---|---|---|---|---|",
    ]
    for prob in attestation["problems"]:
        for decl in prob["declarations"]:
            ax_str = ", ".join(f"`{a}`" for a in decl["axioms"]) if decl["axioms"] else "_(none — constructive)_"
            icon = "✅ PASS" if decl["passed"] else f"❌ FAIL ({', '.join(decl['forbidden_axioms'])})"
            lines.append(
                f"| `{prob['problem_id']}` | `{decl['node_id']}` | `{decl['full_name']}` | {ax_str} | {icon} |"
            )
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Run real Lean 4 kernel `#print axioms` audit")
    parser.add_argument("--markdown", action="store_true", help="Print Markdown summary table")
    parser.add_argument("--out", default=str(ATTESTATION_OUT), help="Output JSON attestation file path")
    args = parser.parse_args()

    if not shutil.which("lake"):
        print("Error: `lake` binary not found in PATH. Install Lean 4 via `elan` first.", file=sys.stderr)
        return 2

    toolchain = (ROOT / "lean-toolchain").read_text(encoding="utf-8").strip()
    problem_dirs = sorted(p for p in PROBLEMS_DIR.iterdir() if p.is_dir() and (p / "blueprint.json").exists())

    results: List[Dict[str, Any]] = []
    all_passed = True
    for pdir in problem_dirs:
        bp = json.loads((pdir / "blueprint.json").read_text(encoding="utf-8"))
        res = verify_problem_axioms(bp)
        results.append(res)
        if not res["kernel_verified"]:
            all_passed = False

    attestation = {
        "toolchain": toolchain,
        "allowed_axioms": sorted(ALLOWED_AXIOMS),
        "verified_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "all_passed": all_passed,
        "problems": results,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(attestation, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if args.markdown:
        print(format_markdown(attestation))
    else:
        status = "PASS" if all_passed else "FAIL"
        print(f"[KERNEL AXIOM AUDIT: {status}] toolchain={toolchain}")
        for r in results:
            print(f"  {r['problem_id']} ({r['lean_module']}): {'OK' if r['kernel_verified'] else 'FAILED'}")
            for d in r["declarations"]:
                print(f"    - {d['node_id']:4s} {d['full_name']} -> {d['axioms']}")
            for err in r["errors"]:
                print(f"    ! {err}")

    return 0 if all_passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
