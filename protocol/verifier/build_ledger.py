#!/usr/bin/env python3
"""
ProofChain Ledger & Website Data Builder.

1. Audits all problem Lean 4 files with `audit_lean.py`.
2. Runs the deterministic `credit_engine.py` on every problem blueprint.
3. Chains verified problem blocks with SHA-256 block hashes (Bitcoin-inspired Proof Ledger).
4. Aggregates global Agent leaderboard & Naming Rights Registry.
5. Writes `ledger/ledger.json` and `docs/data/ledger.json`.
"""

from __future__ import annotations

import hashlib
import json
import sys
from collections import defaultdict
from dataclasses import asdict
from pathlib import Path
from typing import Any, Dict, List

from audit_lean import audit_source
from commit_reveal import compute_commitment
from credit_engine import score_problem

ROOT = Path(__file__).resolve().parents[2]
PROBLEMS_DIR = ROOT / "problems"
LEDGER_OUT = ROOT / "ledger" / "ledger.json"
DOCS_DATA_OUT = ROOT / "docs" / "data" / "ledger.json"


def sha256_json(obj: Any) -> str:
    canonical = json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))
    return "0x" + hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def build_all() -> Dict[str, Any]:
    problem_dirs = sorted(p for p in PROBLEMS_DIR.iterdir() if p.is_dir() and (p / "blueprint.json").exists())
    if not problem_dirs:
        raise RuntimeError(f"No problem blueprints found in {PROBLEMS_DIR}")

    compiled_problems: List[Dict[str, Any]] = []
    blocks: List[Dict[str, Any]] = []
    global_agents: Dict[str, Dict[str, Any]] = defaultdict(
        lambda: {
            "agent": "",
            "total_credit": 0.0,
            "proof_work": 0.0,
            "royalties": 0.0,
            "hygiene": 0.0,
            "verified_nodes": 0,
            "lead_naming_rights": 0,
            "lemma_naming_rights": 0,
            "counterexamples": 0,
            "problems": [],
        }
    )
    naming_registry: List[Dict[str, Any]] = []

    prev_hash = "0x" + "0" * 64
    block_height = 0

    # Genesis Block
    genesis_payload = {
        "height": 0,
        "type": "GENESIS",
        "timestamp": "2026-11-01T00:00:00Z",
        "prev_hash": prev_hash,
        "message": "ProofChain Genesis: Proof-of-Useful-Work for Multi-Agent Formal Mathematics",
    }
    genesis_hash = sha256_json(genesis_payload)
    blocks.append({**genesis_payload, "block_hash": genesis_hash})
    prev_hash = genesis_hash

    for pdir in problem_dirs:
        bp = json.loads((pdir / "blueprint.json").read_text(encoding="utf-8"))
        lean_path = pdir / "Proof.lean"
        lean_source = lean_path.read_text(encoding="utf-8") if lean_path.exists() else ""
        allow_sorry = bp.get("status") != "settled" and bp.get("status") != "challenge_window"

        audit_report = audit_source(lean_source, path=str(lean_path.relative_to(ROOT)), allow_sorry=allow_sorry)
        if not audit_report.passed:
            raise RuntimeError(
                f"Audit FAILED for {bp['id']} ({lean_path}): {[asdict(f) for f in audit_report.findings]}"
            )

        # Compute deterministic commit-reveal hashes for every node with lean_code
        for node in bp.get("nodes", []):
            if node.get("lean_code") and node.get("salt") and node.get("author"):
                node["commitment_hash"] = compute_commitment(
                    bp["id"], node["id"], node["author"], node["salt"], node["lean_code"]
                )

        scoring = score_problem(bp)

        # Aggregate global agent stats
        for entry in scoring["leaderboard"]:
            a = entry["agent"]
            ga = global_agents[a]
            ga["agent"] = a
            ga["total_credit"] = round(ga["total_credit"] + entry["total_credit"], 2)
            ga["proof_work"] = round(ga["proof_work"] + entry["proof_work"], 2)
            ga["royalties"] = round(ga["royalties"] + entry["royalties"], 2)
            ga["hygiene"] = round(ga["hygiene"] + entry["hygiene"], 2)
            if bp["id"] not in ga["problems"]:
                ga["problems"].append(bp["id"])

        for node in bp.get("nodes", []):
            if node.get("status") in ("verified", "golfed") and node.get("author"):
                a = node["author"]
                global_agents[a]["agent"] = a
                global_agents[a]["verified_nodes"] += 1

        # Naming rights registry
        nr = scoring["naming_rights"]
        if nr["lead"]:
            lead = nr["lead"]
            if lead["status"] == "FINALIZED":
                global_agents[lead["holder"]]["lead_naming_rights"] += 1
            naming_registry.append({
                "kind": "THEOREM_LEAD",
                "status": lead["status"],
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "holder": lead["holder"],
                "title": lead["proposed_name"],
                "credit": lead["credit"],
                "share_pct": lead["share_pct"],
                "certificate_hash": sha256_json({
                    "kind": "THEOREM_LEAD",
                    "problem": bp["id"],
                    "holder": lead["holder"],
                    "lean_sha256": audit_report.normalized_sha256,
                }),
            })

        for lm in nr["lemmas"]:
            if bp.get("status") == "settled":
                global_agents[lm["holder"]]["lemma_naming_rights"] += 1
            naming_registry.append({
                "kind": "LEMMA",
                "status": "FINALIZED" if bp.get("status") == "settled" else "PROVISIONAL",
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "node_id": lm["node_id"],
                "lean_name": lm["lean_name"],
                "holder": lm["holder"],
                "title": lm["named_title"],
                "credit": lm["credit"],
                "share_pct": lm["share_pct"],
                "certificate_hash": sha256_json({
                    "kind": "LEMMA",
                    "problem": bp["id"],
                    "node": lm["node_id"],
                    "holder": lm["holder"],
                }),
            })

        for cx in nr["counterexamples"]:
            global_agents[cx["holder"]]["counterexamples"] += 1
            naming_registry.append({
                "kind": "COUNTEREXAMPLE",
                "status": "FINALIZED",
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "node_id": cx["node_id"],
                "lean_name": cx["lean_name"],
                "holder": cx["holder"],
                "title": cx["named_title"],
                "credit": cx["credit"],
                "share_pct": round((cx["credit"] / bp.get("credit_pool", 1000.0)) * 100.0, 2),
                "certificate_hash": sha256_json({
                    "kind": "COUNTEREXAMPLE",
                    "problem": bp["id"],
                    "node": cx["node_id"],
                    "holder": cx["holder"],
                }),
            })

        # Create Proof Block
        block_height += 1
        block_payload = {
            "height": block_height,
            "type": f"PROBLEM_{bp['status'].upper()}",
            "problem_id": bp["id"],
            "timestamp": bp.get("updated_at", "2026-11-21T00:00:00Z"),
            "prev_hash": prev_hash,
            "lean_normalized_sha256": audit_report.normalized_sha256,
            "ast_tokens": audit_report.ast_token_count,
            "sorry_count": audit_report.sorry_count,
            "minimal_dag_size": len(scoring["minimal_dag_nodes"]),
            "lead_agent": nr["lead"]["holder"] if nr["lead"] else None,
            "credit_merkle_root": sha256_json(scoring["leaderboard"]),
        }
        block_hash = sha256_json(block_payload)
        blocks.append({**block_payload, "block_hash": block_hash})
        prev_hash = block_hash

        compiled_problems.append({
            **bp,
            "lean_file": str(lean_path.relative_to(ROOT)),
            "lean_source": lean_source,
            "audit": asdict(audit_report),
            "scoring": scoring,
            "block_hash": block_hash,
            "block_height": block_height,
        })

    global_leaderboard = sorted(
        global_agents.values(),
        key=lambda x: (-x["total_credit"], -x["lead_naming_rights"], x["agent"]),
    )

    total_nodes = sum(len(p["nodes"]) for p in compiled_problems)
    verified_nodes = sum(
        1 for p in compiled_problems for n in p["nodes"] if n.get("status") in ("verified", "golfed")
    )
    open_sorries = sum(
        1 for p in compiled_problems for n in p["nodes"] if n.get("status") == "open"
    )
    pruned_or_refuted = sum(
        1 for p in compiled_problems for n in p["nodes"] if n.get("status") in ("pruned", "refuted")
    )

    ledger = {
        "protocol": "ProofChain",
        "version": "0.1.0-demo",
        "generated_at": "2026-11-21T08:00:00Z",
        "stats": {
            "total_problems": len(compiled_problems),
            "settled_problems": sum(1 for p in compiled_problems if p["status"] == "settled"),
            "active_agents": len(global_leaderboard),
            "total_dag_nodes": total_nodes,
            "verified_nodes": verified_nodes,
            "open_sorries": open_sorries,
            "pruned_or_refuted": pruned_or_refuted,
            "chain_height": block_height,
            "chain_tip": prev_hash,
        },
        "problems": compiled_problems,
        "global_leaderboard": global_leaderboard,
        "naming_registry": naming_registry,
        "blocks": list(reversed(blocks)),
    }

    LEDGER_OUT.parent.mkdir(parents=True, exist_ok=True)
    DOCS_DATA_OUT.parent.mkdir(parents=True, exist_ok=True)

    serialized = json.dumps(ledger, indent=2, ensure_ascii=False)
    LEDGER_OUT.write_text(serialized + "\n", encoding="utf-8")
    DOCS_DATA_OUT.write_text(serialized + "\n", encoding="utf-8")
    print(f"[OK] Built ledger ({len(compiled_problems)} problems, {len(blocks)} blocks, {len(global_leaderboard)} agents)")
    print(f"     -> {LEDGER_OUT}")
    print(f"     -> {DOCS_DATA_OUT}")
    return ledger


if __name__ == "__main__":
    try:
        build_all()
    except Exception as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        raise SystemExit(1)
