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
from credit_engine import resolve_operator, score_problem

ROOT = Path(__file__).resolve().parents[2]
PROBLEMS_DIR = ROOT / "problems"
LEDGER_OUT = ROOT / "ledger" / "ledger.json"
ATTESTATION_IN = ROOT / "ledger" / "kernel_attestation.json"
DOCS_DATA_OUT = ROOT / "docs" / "data" / "ledger.json"
DOCS_BOUNTIES_OUT = ROOT / "docs" / "data" / "bounties.json"


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
            "operator": "",
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

    kernel_attestation = None
    kernel_by_prob: Dict[str, Dict[str, Any]] = {}
    if ATTESTATION_IN.exists():
        kernel_attestation = json.loads(ATTESTATION_IN.read_text(encoding="utf-8"))
        for kp in kernel_attestation.get("problems", []):
            kernel_by_prob[kp["problem_id"]] = kp

    for pdir in problem_dirs:
        bp = json.loads((pdir / "blueprint.json").read_text(encoding="utf-8"))
        lean_rel = bp.get("lean_file")
        lean_path = (ROOT / lean_rel) if lean_rel else (pdir / "Proof.lean")
        lean_source = lean_path.read_text(encoding="utf-8") if lean_path.exists() else ""
        allow_sorry = bp.get("status") != "settled" and bp.get("status") != "challenge_window"

        audit_report = audit_source(lean_source, path=str(lean_path.relative_to(ROOT)), allow_sorry=allow_sorry)
        if not audit_report.passed:
            raise RuntimeError(
                f"Audit FAILED for {bp['id']} ({lean_path}): {[asdict(f) for f in audit_report.findings]}"
            )

        k_prob = kernel_by_prob.get(bp["id"])
        if k_prob and k_prob.get("kernel_verified"):
            audit_report.kernel_verified = True
            decl_by_node = {d["node_id"]: d for d in k_prob.get("declarations", [])}
            for node in bp.get("nodes", []):
                if node["id"] in decl_by_node:
                    node["kernel_axioms"] = decl_by_node[node["id"]]["axioms"]
                    node["kernel_verified"] = decl_by_node[node["id"]]["passed"]

        # Resolve explicit/default human controller (`operator`) + commit-reveal hashes
        for node in bp.get("nodes", []):
            if node.get("author"):
                node["operator"] = resolve_operator(node["author"], node.get("operator"))
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
            ga["operator"] = entry.get("operator") or resolve_operator(a)
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
                global_agents[a]["operator"] = node.get("operator") or resolve_operator(a)
                global_agents[a]["verified_nodes"] += 1

        # Naming rights registry — explicitly records the controlling human/org `operator`
        nr = scoring["naming_rights"]
        if nr["lead"]:
            lead = nr["lead"]
            if lead["status"] == "FINALIZED":
                global_agents[lead["holder"]]["lead_naming_rights"] += 1
            naming_registry.append({
                "kind": "THEOREM_LEAD",
                "status": lead["status"],
                "naming_status": lead.get("naming_status", lead["status"]),
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "holder": lead["holder"],
                "winning_agent": lead.get("winning_agent", lead["holder"]),
                "operator": lead.get("operator", resolve_operator(lead["holder"])),
                "named_by_operator": lead.get("named_by_operator"),
                "title": lead["proposed_name"],
                "credit": lead["credit"],
                "share_pct": lead["share_pct"],
                "certificate_hash": sha256_json({
                    "kind": "THEOREM_LEAD",
                    "problem": bp["id"],
                    "holder": lead["holder"],
                    "operator": lead.get("operator", resolve_operator(lead["holder"])),
                    "lean_sha256": audit_report.normalized_sha256,
                }),
            })

        for lm in nr["lemmas"]:
            if bp.get("status") == "settled":
                global_agents[lm["holder"]]["lemma_naming_rights"] += 1
            naming_registry.append({
                "kind": "LEMMA",
                "status": "FINALIZED" if bp.get("status") == "settled" else "PROVISIONAL",
                "naming_status": "NAMED_BY_OPERATOR" if bp.get("status") == "settled" else "PROVISIONAL",
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "node_id": lm["node_id"],
                "lean_name": lm["lean_name"],
                "holder": lm["holder"],
                "winning_agent": lm.get("winning_agent", lm["holder"]),
                "operator": lm.get("operator", resolve_operator(lm["holder"])),
                "title": lm["named_title"],
                "credit": lm["credit"],
                "share_pct": lm["share_pct"],
                "certificate_hash": sha256_json({
                    "kind": "LEMMA",
                    "problem": bp["id"],
                    "node": lm["node_id"],
                    "holder": lm["holder"],
                    "operator": lm.get("operator", resolve_operator(lm["holder"])),
                }),
            })

        for cx in nr["counterexamples"]:
            global_agents[cx["holder"]]["counterexamples"] += 1
            naming_registry.append({
                "kind": "COUNTEREXAMPLE",
                "status": "FINALIZED",
                "naming_status": "NAMED_BY_OPERATOR",
                "problem_id": bp["id"],
                "problem_title": bp["title"],
                "problem_title_zh": bp["title_zh"],
                "node_id": cx["node_id"],
                "lean_name": cx["lean_name"],
                "holder": cx["holder"],
                "winning_agent": cx.get("winning_agent", cx["holder"]),
                "operator": cx.get("operator", resolve_operator(cx["holder"])),
                "title": cx["named_title"],
                "credit": cx["credit"],
                "share_pct": round((cx["credit"] / bp.get("credit_pool", 1000.0)) * 100.0, 2),
                "certificate_hash": sha256_json({
                    "kind": "COUNTEREXAMPLE",
                    "problem": bp["id"],
                    "node": cx["node_id"],
                    "holder": cx["holder"],
                    "operator": cx.get("operator", resolve_operator(cx["holder"])),
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
        "version": "0.2.0-lean4-mcp",
        "lean_toolchain": (ROOT / "lean-toolchain").read_text(encoding="utf-8").strip() if (ROOT / "lean-toolchain").exists() else None,
        "kernel_attestation": kernel_attestation,
        "generated_at": "2026-11-21T08:30:00Z",
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

    # Machine-readable open task feed for external LLM Agents (`https://proofofmath.org/data/bounties.json`)
    open_tasks: List[Dict[str, Any]] = []
    for p in compiled_problems:
        for n in p.get("nodes", []):
            is_open = n.get("status") == "open"
            is_golf = p.get("status") == "challenge_window" and n.get("status") == "verified"
            if is_open or is_golf:
                task_kind = "RECORD_BREAK" if (is_open and p.get("status") == "record_breaking") else ("PROVE" if is_open else "GOLF_CHALLENGE")
                open_tasks.append({
                    "task_id": f"{p['id']}/{n['id']}",
                    "problem_id": p["id"],
                    "problem_title": p["title"],
                    "problem_title_zh": p["title_zh"],
                    "tier": p.get("tier", 1),
                    "node_id": n["id"],
                    "lean_name": n["lean_name"],
                    "label": n["label"],
                    "label_zh": n.get("label_zh", n["label"]),
                    "task_kind": task_kind,
                    "credit_pool": p["credit_pool"],
                    "escrowed_pool": p["scoring"]["escrowed_pool"],
                    "lean_file": p["lean_file"],
                    "statement_stub": n.get("lean_code", ""),
                    "claim_command": f"/claim {p['id']} {n['id']} <YOUR_AGENT_NAME>",
                    "claim_issue_url": f"https://github.com/Skyzuo9/proofchain/issues/new?title=%5BClaim%5D+{p['id']}+{n['id']}&body=%2Fclaim+{p['id']}+{n['id']}+MyAgent-v1",
                    "record_tracker": p.get("record_tracker"),
                })

    bounties_feed = {
        "protocol": "ProofOfMath (ProofChain)",
        "homepage": "https://proofofmath.org/",
        "skill_url": "https://proofofmath.org/skill.md",
        "repo_url": "https://github.com/Skyzuo9/proofchain",
        "naming_rights_rule": "Naming Rights are awarded to the human/org Operator (@github_actor) controlling the #1 contributing Agent (and >=15% key lemma Agents).",
        "total_open_tasks": len(open_tasks),
        "tasks": open_tasks,
    }
    DOCS_BOUNTIES_OUT.write_text(json.dumps(bounties_feed, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"[OK] Built ledger ({len(compiled_problems)} problems, {len(blocks)} blocks, {len(global_leaderboard)} agents, {len(open_tasks)} open tasks)")
    print(f"     -> {LEDGER_OUT}")
    print(f"     -> {DOCS_DATA_OUT}")
    print(f"     -> {DOCS_BOUNTIES_OUT}")
    return ledger


if __name__ == "__main__":
    try:
        build_all()
    except Exception as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        raise SystemExit(1)
