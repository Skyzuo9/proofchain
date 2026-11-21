#!/usr/bin/env python3
"""
ProofChain Commit-Reveal Anti-Front-Running CLI.

Prevents MEV / mempool sniping by binding an agent's proof submission to a
cryptographic commitment before revealing the Lean 4 proof source.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import secrets
import sys
from pathlib import Path

from audit_lean import normalize_lean_code


def compute_commitment(problem_id: str, node_id: str, agent_id: str, salt: str, lean_code: str) -> str:
    """Compute canonical SHA-256 commitment over normalized Lean code."""
    normalized = normalize_lean_code(lean_code)
    payload = f"{problem_id}|{node_id}|{agent_id}|{salt}|{normalized}"
    return "0x" + hashlib.sha256(payload.encode("utf-8")).hexdigest()


def verify_reveal(commitment: str, problem_id: str, node_id: str, agent_id: str, salt: str, lean_code: str) -> bool:
    expected = compute_commitment(problem_id, node_id, agent_id, salt, lean_code)
    return secrets.compare_digest(commitment.lower(), expected.lower())


def main() -> int:
    parser = argparse.ArgumentParser(description="ProofChain Commit-Reveal Tool")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_commit = sub.add_parser("commit", help="Generate a cryptographic proof commitment")
    p_commit.add_argument("--problem", required=True, help="Problem ID, e.g. PC-001")
    p_commit.add_argument("--node", required=True, help="Node ID, e.g. L2")
    p_commit.add_argument("--agent", required=True, help="Agent ID, e.g. DeepSeek-Prover-X")
    p_commit.add_argument("--file", required=True, help="Path to Lean proof file")
    p_commit.add_argument("--salt", default=None, help="Optional hex salt (auto-generated if omitted)")

    p_verify = sub.add_parser("verify", help="Verify a revealed proof against a commitment")
    p_verify.add_argument("--commitment", required=True, help="0x-prefixed SHA-256 commitment")
    p_verify.add_argument("--problem", required=True)
    p_verify.add_argument("--node", required=True)
    p_verify.add_argument("--agent", required=True)
    p_verify.add_argument("--salt", required=True)
    p_verify.add_argument("--file", required=True)

    args = parser.parse_args()
    lean_code = Path(args.file).read_text(encoding="utf-8")

    if args.cmd == "commit":
        salt = args.salt or secrets.token_hex(16)
        commitment = compute_commitment(args.problem, args.node, args.agent, salt, lean_code)
        print(json.dumps({
            "problem_id": args.problem,
            "node_id": args.node,
            "agent_id": args.agent,
            "salt": salt,
            "commitment": commitment,
        }, indent=2))
        return 0

    ok = verify_reveal(args.commitment, args.problem, args.node, args.agent, args.salt, lean_code)
    print(json.dumps({"verified": ok, "commitment": args.commitment}, indent=2))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
