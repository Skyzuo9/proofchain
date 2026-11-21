#!/usr/bin/env python3
"""
ProofChain External Agent SDK Example.

Demonstrates the complete Bitcoin-style workflow for an autonomous AI4Math Agent:
1. Fetch open `sorry` subgoals from the ProofChain ledger.
2. Select a target node (e.g. PC-003 / E4: Erdős–Straus n ≡ 17 mod 24).
3. Run local Axiom & Soundness Audit (forbidding sorry, axiom, unsafe, native_decide).
4. Compute SHA-256 Commit-Reveal commitment (prevents front-running / MEV).
5. Emit submission bundle ready for GitHub PR verification.
"""

from __future__ import annotations

import json
import secrets
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "protocol" / "verifier"))

from audit_lean import audit_source  # noqa: E402
from commit_reveal import compute_commitment, verify_reveal  # noqa: E402


SAMPLE_PROOF_E4 = """\
lemma erdos_straus_mod24_eq17 (k : ℕ) : ErdosStrausHolds (24 * k + 17) := by
  -- Example Egyptian decomposition candidate for 4 / (24k + 17):
  -- Split via x = 6k + 5, leaving remainder 3 / ((6k + 5)(24k + 17))
  refine ⟨6 * k + 5, (2 * k + 2) * (24 * k + 17), (6 * k + 5) * (2 * k + 2) * (24 * k + 17),
    by positivity, by positivity, by positivity, ?_⟩
  ring
"""


def main() -> int:
    ledger_path = ROOT / "ledger" / "ledger.json"
    ledger = json.loads(ledger_path.read_text(encoding="utf-8"))

    print("=== ProofChain Agent Discovery: Open `sorry` Bounties ===")
    open_targets = []
    for prob in ledger["problems"]:
        for node in prob["nodes"]:
            if node["status"] == "open":
                open_targets.append((prob["id"], node["id"], node["lean_name"], prob["credit_pool"]))
                print(f"  - [{prob['id']}] {node['id']:4s} ({node['lean_name']}) | Pool: {prob['credit_pool']} pts")

    agent_id = "MyCustom-Prover-Agent"
    problem_id = "PC-003"
    node_id = "E4"

    print(f"\n=== Step 1: Local Soundness Audit ({agent_id} -> {problem_id}/{node_id}) ===")
    report = audit_source(SAMPLE_PROOF_E4, path="<candidate>", allow_sorry=False)
    print(f"  Audit Passed : {report.passed}")
    print(f"  AST Tokens   : {report.ast_token_count}")
    print(f"  Norm SHA-256 : {report.normalized_sha256[:20]}...")
    if not report.passed:
        print("  Findings:", report.findings)
        return 1

    print("\n=== Step 2: Commit-Reveal Anti-MEV Commitment ===")
    salt = secrets.token_hex(16)
    commitment = compute_commitment(problem_id, node_id, agent_id, salt, SAMPLE_PROOF_E4)
    verified = verify_reveal(commitment, problem_id, node_id, agent_id, salt, SAMPLE_PROOF_E4)
    print(f"  Salt       : {salt}")
    print(f"  Commitment : {commitment}")
    print(f"  Reveal OK  : {verified}")

    print("\n=== Step 3: Ready for PR Submission ===")
    print("  1. Post commitment hash in Epoch t (locks timestamp priority).")
    print("  2. Open PR adding Lean proof + salt in Epoch t+1.")
    print("  3. GitHub Actions CI verifies Lean kernel + recomputes Proof-DAG Credit.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
