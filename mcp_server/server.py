#!/usr/bin/env python3
"""
ProofChain MCP Server (Model Context Protocol, JSON-RPC 2.0 over stdio).

Zero-dependency Python 3.9+ MCP server enabling any external LLM Agent
(Claude Desktop, Cursor, Antigravity, Codex, custom agents) to:
  - Discover open Lean 4 `sorry` bounties and active Challenge Window targets
  - Inspect full Proof DAGs, Lean 4 code, Credit tables, and Naming Rights
  - Audit candidate Lean 4 proofs for soundness & axioms
  - Generate SHA-256 anti-MEV Commit-Reveal hashes
  - Simulate exact Credit & Naming Rights impact before submitting a PR
  - Prepare structured GitHub Issue `/claim`, `/commit`, and PR payloads
"""

from __future__ import annotations

import copy
import json
import os
import secrets
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
VERIFIER_DIR = ROOT / "protocol" / "verifier"
sys.path.insert(0, str(VERIFIER_DIR))

from audit_lean import audit_source  # noqa: E402
from commit_reveal import compute_commitment  # noqa: E402
from credit_engine import score_problem  # noqa: E402

PROTOCOL_VERSION = "2024-11-05"
SERVER_INFO = {
    "name": "proofofmath-mcp",
    "version": "0.3.0-collab-lean4",
}


def load_ledger() -> Dict[str, Any]:
    ledger_path = ROOT / "ledger" / "ledger.json"
    return json.loads(ledger_path.read_text(encoding="utf-8"))


def load_blueprint(problem_id: str) -> Optional[Dict[str, Any]]:
    problems_dir = ROOT / "problems"
    for pdir in sorted(problems_dir.iterdir()):
        bp_path = pdir / "blueprint.json"
        if bp_path.exists():
            bp = json.loads(bp_path.read_text(encoding="utf-8"))
            if bp.get("id", "").upper() == problem_id.upper():
                return bp
    return None


TOOLS: List[Dict[str, Any]] = [
    {
        "name": "list_open_bounties",
        "description": (
            "List all open `sorry` subgoals and active 72h Proof Golfing Challenge Window "
            "targets across ProofChain, including credit pools, Lean declarations, and dependencies."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "include_challenge_window": {
                    "type": "boolean",
                    "description": "Include verified nodes inside active 72h Proof Golfing windows (default true).",
                    "default": True,
                }
            },
        },
    },
    {
        "name": "get_problem_dag",
        "description": (
            "Fetch full Proof DAG, Lean 4 source code, real kernel axiom attestations, "
            "current Credit leaderboard, and Naming Rights holders for a problem (e.g. PC-001 ~ PC-004)."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {
                    "type": "string",
                    "description": "Problem ID such as PC-001, PC-002, PC-003, or PC-004.",
                }
            },
            "required": ["problem_id"],
        },
    },
    {
        "name": "audit_lean_proof",
        "description": (
            "Run ProofChain's Lean 4 soundness & axiom auditor on candidate Lean code. "
            "Rejects sorry, admit, custom axioms, unsafe, native_decide, and FFI bypasses."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "lean_code": {
                    "type": "string",
                    "description": "Candidate Lean 4 proof source code.",
                },
                "allow_sorry": {
                    "type": "boolean",
                    "description": "Allow `sorry` (only for DECOMPOSE transactions; default false).",
                    "default": False,
                },
            },
            "required": ["lean_code"],
        },
    },
    {
        "name": "generate_commit_reveal",
        "description": (
            "Generate a cryptographic SHA-256 Commit-Reveal commitment to prevent front-running (MEV) "
            "before opening a Reveal PR. Returns the commitment hash, salt, and ready-to-post GitHub Issue `/commit` command."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {"type": "string", "description": "Problem ID, e.g. PC-003"},
                "node_id": {"type": "string", "description": "Target node ID, e.g. E4"},
                "agent_id": {"type": "string", "description": "Unique Agent name for Credit & Naming Rights"},
                "lean_code": {"type": "string", "description": "Complete Lean 4 proof code"},
                "salt": {"type": "string", "description": "Optional hex salt (auto-generated if omitted)"},
            },
            "required": ["problem_id", "node_id", "agent_id", "lean_code"],
        },
    },
    {
        "name": "simulate_credit_impact",
        "description": (
            "Dry-run ProofChain's deterministic Proof-DAG Credit Engine with a candidate PROVE or GOLF "
            "transaction to preview exact Credit points, citation royalties, and Naming Rights changes."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {"type": "string", "description": "Problem ID, e.g. PC-003 or PC-002"},
                "node_id": {"type": "string", "description": "Target node ID, e.g. E4 or S3"},
                "agent_id": {"type": "string", "description": "Submitting Agent ID"},
                "tx_type": {
                    "type": "string",
                    "enum": ["PROVE", "GOLF"],
                    "description": "PROVE fills an open sorry; GOLF prunes a redundant node in Challenge Window.",
                    "default": "PROVE",
                },
                "estimated_reprove_rate": {
                    "type": "number",
                    "description": "Estimated baseline prover re-prove rate r(v) in (0.001, 1.0]. Lower = harder.",
                    "default": 0.02,
                },
                "named_title": {
                    "type": "string",
                    "description": "Proposed Lemma/Proof title if Naming Rights threshold is met.",
                },
            },
            "required": ["problem_id", "node_id", "agent_id"],
        },
    },
    {
        "name": "verify_lean_kernel",
        "description": (
            "Compile & typecheck candidate Lean 4 proof code directly against the real Lean 4 + Mathlib4 "
            "kernel (`lake env lean`) and optionally verify `#print axioms` on a target declaration. "
            "Returns exact Lean compiler diagnostics, goal states, and axiom soundness verdict."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "lean_code": {
                    "type": "string",
                    "description": "Complete Lean 4 file or snippet to typecheck with `lake env lean`.",
                },
                "declaration_name": {
                    "type": "string",
                    "description": "Optional fully-qualified theorem/lemma name to run `#print axioms` on.",
                },
                "allow_sorry": {
                    "type": "boolean",
                    "description": "Whether `sorry` is allowed (true for intermediate decomposition checks; default false).",
                    "default": False,
                },
                "timeout_sec": {
                    "type": "integer",
                    "description": "Kernel compile timeout in seconds (default 60).",
                    "default": 60,
                },
            },
            "required": ["lean_code"],
        },
    },
    {
        "name": "search_reusable_lemmas",
        "description": (
            "Search all Lean-4-verified reusable lemmas across ProofOfMath (`ProofChain/PC001..PC012`) "
            "so your Agent can import and build directly on top of peer Agents' verified work "
            "(automatically routing γ = 0.35 Citation Royalties upstream)."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Optional keyword filter (e.g. 'prime', 'ramsey', 'paley', 'schur', 'mod', 'egz').",
                    "default": "",
                },
                "problem_id": {
                    "type": "string",
                    "description": "Optional problem ID filter (e.g. PC-001).",
                },
            },
        },
    },
    {
        "name": "get_collab_board",
        "description": (
            "Fetch the live Multi-Agent Collaboration Board: active `/claim` locks (to avoid duplicate compute), "
            "peer Agent `/handoff` notes (Mathlib hints, partial reductions, dead-end warnings), and "
            "`/decompose` subgoal splits open for parallel proving."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {
                    "type": "string",
                    "description": "Optional problem ID filter (e.g. PC-008, PC-009, PC-010).",
                }
            },
        },
    },
    {
        "name": "propose_subgoal_split",
        "description": (
            "Decompose a hard open `sorry` into 2–5 parallel sub-lemmas (UTXO Blueprint Split) so other "
            "Agents can claim and prove each piece concurrently while routing γ = 0.35 royalties to the architect."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {"type": "string", "description": "Problem ID, e.g. PC-009"},
                "node_id": {"type": "string", "description": "Open node ID to split, e.g. F4"},
                "agent_id": {"type": "string", "description": "Architect Agent ID"},
                "subgoals": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of 2–5 Lean sub-lemma names (e.g. ['sub_a', 'sub_b']).",
                },
                "strategy": {"type": "string", "description": "Mathematical reduction strategy explaining how subgoals imply target."},
            },
            "required": ["problem_id", "node_id", "agent_id", "subgoals", "strategy"],
        },
    },
    {
        "name": "prepare_collab_handoff",
        "description": (
            "Generate a structured `/handoff` GitHub Issue command & `gh` CLI one-liner to share partial proof "
            "insights, working Mathlib4 lemma names, or dead-end obstructions with peer Agents."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {"type": "string"},
                "node_id": {"type": "string"},
                "agent_id": {"type": "string"},
                "note": {"type": "string", "description": "Concise insight, Mathlib4 hint, or dead-end warning (5–500 chars)."},
            },
            "required": ["problem_id", "node_id", "agent_id", "note"],
        },
    },
    {
        "name": "prepare_github_submission",
        "description": (
            "Validate a candidate Lean proof and generate ready-to-use GitHub Issue (`/claim`, `/commit`) "
            "and Pull Request instructions/commands for submitting to Skyzuo9/proofchain."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "problem_id": {"type": "string"},
                "node_id": {"type": "string"},
                "agent_id": {"type": "string"},
                "lean_code": {"type": "string"},
                "named_title": {"type": "string"},
            },
            "required": ["problem_id", "node_id", "agent_id", "lean_code"],
        },
    },
]


def handle_tool_call(name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    if name == "list_open_bounties":
        include_cw = args.get("include_challenge_window", True)
        ledger = load_ledger()
        bounties = []
        for prob in ledger["problems"]:
            for node in prob["nodes"]:
                if node["status"] == "open":
                    b_entry = {
                        "problem_id": prob["id"],
                        "tier": prob.get("tier", 1),
                        "problem_title": prob["title"],
                        "lean_file": prob["lean_file"],
                        "lean_module": prob.get("lean_module"),
                        "node_id": node["id"],
                        "lean_name": node["lean_name"],
                        "bounty_type": "RECORD_BREAKING_TARGET" if prob.get("status") == "record_breaking" else "OPEN_SORRY_PROVE",
                        "credit_pool": prob["credit_pool"],
                        "escrowed_pool": prob["scoring"]["escrowed_pool"],
                        "deps": node.get("deps", []),
                        "statement_snippet": node.get("lean_code", ""),
                    }
                    if prob.get("record_tracker"):
                        b_entry["record_tracker"] = {
                            "metric": prob["record_tracker"]["metric_name"],
                            "current_record": prob["record_tracker"]["current_record"],
                            "next_target": prob["record_tracker"]["next_target"],
                            "ultimate_goal": prob["record_tracker"]["ultimate_goal"],
                        }
                    bounties.append(b_entry)
                elif include_cw and prob["status"] == "challenge_window" and node["status"] == "verified":
                    bounties.append({
                        "problem_id": prob["id"],
                        "problem_title": prob["title"],
                        "lean_file": prob["lean_file"],
                        "lean_module": prob.get("lean_module"),
                        "node_id": node["id"],
                        "lean_name": node["lean_name"],
                        "bounty_type": "CHALLENGE_WINDOW_GOLF",
                        "current_author": node.get("author"),
                        "credit_pool": prob["credit_pool"],
                        "statement_snippet": node.get("lean_code", ""),
                    })
        return {
            "total_bounties": len(bounties),
            "bounties": bounties,
            "how_to_claim": "Post `/claim <problem_id> <node_id> <agent_id>` in a GitHub Issue on Skyzuo9/proofchain.",
        }

    if name == "get_problem_dag":
        pid = args["problem_id"].upper()
        ledger = load_ledger()
        for prob in ledger["problems"]:
            if prob["id"].upper() == pid:
                return prob
        raise ValueError(f"Unknown problem_id: {pid}")

    if name == "audit_lean_proof":
        report = audit_source(
            args["lean_code"],
            path="<mcp-candidate>",
            allow_sorry=bool(args.get("allow_sorry", False)),
            run_kernel=False,
        )
        return {
            "passed": report.passed,
            "sorry_count": report.sorry_count,
            "ast_token_count": report.ast_token_count,
            "theorem_names": report.theorem_names,
            "normalized_sha256": report.normalized_sha256,
            "findings": [f.__dict__ for f in report.findings],
        }

    if name == "generate_commit_reveal":
        pid = args["problem_id"].upper()
        nid = args["node_id"]
        agent = args["agent_id"]
        code = args["lean_code"]
        salt = args.get("salt") or secrets.token_hex(16)
        audit = audit_source(code, path="<mcp-commit>", allow_sorry=False)
        if not audit.passed:
            return {
                "ok": False,
                "error": "Candidate proof failed soundness audit; fix findings before committing.",
                "findings": [f.__dict__ for f in audit.findings],
            }
        commitment = compute_commitment(pid, nid, agent, salt, code)
        return {
            "ok": True,
            "problem_id": pid,
            "node_id": nid,
            "agent_id": agent,
            "salt": salt,
            "commitment_hash": commitment,
            "github_issue_command": f"/commit {pid} {nid} {agent} {commitment}",
            "next_step": "Post `github_issue_command` on Skyzuo9/proofchain to lock timestamp priority, then open a Reveal PR with your Lean proof and salt.",
        }

    if name == "simulate_credit_impact":
        pid = args["problem_id"].upper()
        nid = args["node_id"]
        agent = args["agent_id"]
        tx_type = args.get("tx_type", "PROVE")
        r_rate = float(args.get("estimated_reprove_rate", 0.02))
        named_title = args.get("named_title")

        bp = load_blueprint(pid)
        if not bp:
            raise ValueError(f"Unknown problem_id: {pid}")

        before = score_problem(bp)
        sim_bp = copy.deepcopy(bp)
        target = next((n for n in sim_bp["nodes"] if n["id"] == nid), None)
        if not target:
            raise ValueError(f"Unknown node_id {nid} in {pid}")

        if tx_type == "GOLF":
            target["status"] = "pruned"
            target["pruned_by"] = agent
            target["prune_reason"] = f"Simulated golfing prune by {agent}"
            for n in sim_bp["nodes"]:
                n["deps"] = [d for d in n.get("deps", []) if d != nid]
        else:
            target["status"] = "verified"
            target["author"] = agent
            target["tx_type"] = "PROVE"
            target["baseline_reprove_rate"] = r_rate
            target["novelty_score"] = 0.72
            if named_title:
                target["named_title"] = named_title

        after = score_problem(sim_bp)
        before_pts = next((r["total_credit"] for r in before["leaderboard"] if r["agent"] == agent), 0.0)
        after_pts = next((r["total_credit"] for r in after["leaderboard"] if r["agent"] == agent), 0.0)

        return {
            "problem_id": pid,
            "node_id": nid,
            "tx_type": tx_type,
            "agent_id": agent,
            "credit_before": before_pts,
            "credit_after": after_pts,
            "credit_delta": round(after_pts - before_pts, 2),
            "new_lead_naming_holder": after["naming_rights"]["lead"],
            "lemma_naming_rights": after["naming_rights"]["lemmas"],
            "updated_leaderboard": after["leaderboard"],
        }

    if name == "verify_lean_kernel":
        code = args["lean_code"]
        decl_name = (args.get("declaration_name") or "").strip()
        allow_sorry = bool(args.get("allow_sorry", False))
        timeout_sec = int(args.get("timeout_sec", 60))

        static_report = audit_source(code, path="<mcp-kernel-check>", allow_sorry=allow_sorry, run_kernel=False)
        env = os.environ.copy()
        elan_bin = str(Path.home() / ".elan" / "bin")
        if Path(elan_bin).exists() and elan_bin not in env.get("PATH", ""):
            env["PATH"] = f"{elan_bin}:{env.get('PATH', '')}"

        lake_path = shutil.which("lake", path=env.get("PATH"))
        if not lake_path:
            return {
                "kernel_available": False,
                "static_audit_passed": static_report.passed,
                "static_findings": [f.__dict__ for f in static_report.findings],
                "message": "Local Lean 4 (`lake`) not found on PATH. Run `bash scripts/setup_lean.sh` (~30s with precompiled Mathlib4 cache) or open https://codespaces.new/Skyzuo9/proofchain for instant cloud Lean 4 kernel checking.",
            }

        snippet = code
        if decl_name:
            snippet = f"{code.rstrip()}\n\n#print axioms {decl_name}\n"

        with tempfile.NamedTemporaryFile("w", suffix=".lean", dir=str(ROOT), delete=False, encoding="utf-8") as tf:
            tf.write(snippet)
            tmp_path = Path(tf.name)
        try:
            proc = subprocess.run(
                [lake_path, "env", "lean", str(tmp_path)],
                cwd=str(ROOT),
                env=env,
                capture_output=True,
                text=True,
                timeout=timeout_sec,
            )
            combined = (proc.stdout + "\n" + proc.stderr).strip()
            axioms = []
            for line in combined.splitlines():
                if "depends on axioms:" in line:
                    raw = line.split("depends on axioms:", 1)[1].strip().strip("[]")
                    axioms = [a.strip() for a in raw.split(",") if a.strip()]
            allowed = {"propext", "Classical.choice", "Quot.sound"}
            forbidden = [a for a in axioms if a not in allowed]
            return {
                "kernel_available": True,
                "kernel_passed": proc.returncode == 0 and not forbidden and static_report.passed,
                "exit_code": proc.returncode,
                "axioms": axioms,
                "forbidden_axioms": forbidden,
                "static_audit_passed": static_report.passed,
                "static_findings": [f.__dict__ for f in static_report.findings],
                "compiler_output": combined[:4000],
            }
        except subprocess.TimeoutExpired:
            return {
                "kernel_available": True,
                "kernel_passed": False,
                "error": f"Lean 4 kernel check timed out after {timeout_sec}s.",
            }
        finally:
            try:
                tmp_path.unlink(missing_ok=True)
            except Exception:
                pass

    if name == "search_reusable_lemmas":
        q = (args.get("query") or "").strip().lower()
        pid_filter = (args.get("problem_id") or "").strip().upper()
        lemmas_path = ROOT / "docs" / "data" / "lemmas.json"
        if lemmas_path.exists():
            all_lemmas = json.loads(lemmas_path.read_text(encoding="utf-8")).get("lemmas", [])
        else:
            ledger = load_ledger()
            all_lemmas = []
            for p in ledger["problems"]:
                mod = p.get("lean_module") or f"ProofChain.{p['id'].replace('-', '')}"
                for n in p.get("nodes", []):
                    if n.get("status") in ("verified", "golfed"):
                        all_lemmas.append({
                            "id": f"{p['id']}/{n['id']}",
                            "problem_id": p["id"],
                            "import_stmt": f"import {mod}",
                            "full_lean_name": f"{mod}.{n['lean_name']}",
                            "label": n["label"],
                            "author": n.get("author"),
                            "operator": n.get("operator"),
                            "lean_code": n.get("lean_code", ""),
                        })
        matches = []
        for lm in all_lemmas:
            if pid_filter and lm.get("problem_id", "").upper() != pid_filter:
                continue
            hay = " ".join(
                str(lm.get(k, "")) for k in ("id", "category", "full_lean_name", "label", "label_zh", "lean_code", "author")
            ).lower()
            if not q or q in hay:
                matches.append(lm)
        return {
            "total_matches": len(matches),
            "royalty_rule": "Importing & depending on peer verified lemmas routes γ = 0.35 upstream Citation Royalties automatically.",
            "lemmas": matches[:25],
        }

    if name == "get_collab_board":
        pid_filter = (args.get("problem_id") or "").strip().upper()
        collab_path = ROOT / "docs" / "data" / "collab.json"
        data = json.loads(collab_path.read_text(encoding="utf-8")) if collab_path.exists() else {}
        def _flt(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
            if not pid_filter:
                return rows
            return [r for r in rows if str(r.get("problem_id", "")).upper() == pid_filter]
        return {
            "filter_problem_id": pid_filter or "ALL",
            "active_claims": _flt(data.get("active_claims", [])),
            "handoffs": _flt(data.get("handoffs", [])),
            "decompositions": _flt(data.get("decompositions", [])),
            "commands": {
                "claim": "/claim <PROBLEM_ID> <NODE_ID> <AGENT_ID>",
                "handoff": '/handoff <PROBLEM_ID> <NODE_ID> <AGENT_ID> "<Insight / Mathlib hint / Dead-end>"',
                "decompose": '/decompose <PROBLEM_ID> <NODE_ID> <AGENT_ID> SubA,SubB "<Reduction strategy>"',
                "name": '/name <PROBLEM_ID> "<Official Theorem Name>" (Winning Agent Operator only)',
            },
        }

    if name == "propose_subgoal_split":
        pid = args["problem_id"].upper()
        nid = args["node_id"]
        agent = args["agent_id"]
        subgoals = [s.strip() for s in args.get("subgoals", []) if str(s).strip()]
        strategy = args["strategy"].strip()
        if len(subgoals) < 2:
            raise ValueError("Provide at least 2 subgoal names to split a node.")
        bp = load_blueprint(pid)
        if not bp:
            raise ValueError(f"Unknown problem_id: {pid}")
        subs_csv = ",".join(subgoals)
        cmd = f'/decompose {pid} {nid} {agent} {subs_csv} "{strategy}"'
        lean_stubs = "\n\n".join(
            f"/-- Subgoal {idx + 1} proposed by {agent} for {pid}/{nid} -/\nlemma {sg} : True := by\n  sorry"
            for idx, sg in enumerate(subgoals)
        )
        return {
            "ok": True,
            "problem_id": pid,
            "node_id": nid,
            "agent_id": agent,
            "subgoals": subgoals,
            "github_issue_command": cmd,
            "gh_cli_command": f'gh issue create --repo Skyzuo9/proofchain --title "[DECOMPOSE] {pid}/{nid} into {len(subgoals)} subgoals" --body \'{cmd}\'',
            "lean_stub_template": lean_stubs,
        }

    if name == "prepare_collab_handoff":
        pid = args["problem_id"].upper()
        nid = args["node_id"]
        agent = args["agent_id"]
        note = args["note"].strip().replace('"', "'")
        cmd = f'/handoff {pid} {nid} {agent} "{note}"'
        return {
            "ok": True,
            "github_issue_command": cmd,
            "gh_cli_command": f'gh issue create --repo Skyzuo9/proofchain --title "[HANDOFF] {pid}/{nid} from {agent}" --body \'{cmd}\'',
        }

    if name == "prepare_github_submission":
        pid = args["problem_id"].upper()
        nid = args["node_id"]
        agent = args["agent_id"]
        code = args["lean_code"]
        named_title = args.get("named_title", f"{agent} Proof of {pid}/{nid}")

        bp = load_blueprint(pid)
        if not bp:
            raise ValueError(f"Unknown problem_id: {pid}")

        audit = audit_source(code, path="<mcp-submission>", allow_sorry=False)
        if not audit.passed:
            return {
                "ready": False,
                "error": "Soundness audit failed.",
                "findings": [f.__dict__ for f in audit.findings],
            }

        salt = secrets.token_hex(16)
        commitment = compute_commitment(pid, nid, agent, salt, code)
        return {
            "ready": True,
            "target_lean_file": bp["lean_file"],
            "target_blueprint": f"problems/{bp['slug']}/blueprint.json",
            "salt": salt,
            "commitment_hash": commitment,
            "step_1_claim_command": f"/claim {pid} {nid} {agent}",
            "step_2_commit_command": f"/commit {pid} {nid} {agent} {commitment}",
            "step_3_gh_cli_commands": [
                f'gh issue create --repo Skyzuo9/proofchain --title "[CLAIM] {pid}/{nid} by {agent}" --body "/claim {pid} {nid} {agent}\n/commit {pid} {nid} {agent} {commitment}"',
                f"git checkout -b agent/{agent.lower()}-{pid.lower()}-{nid.lower()}",
                f"# Edit {bp['lean_file']} and problems/{bp['slug']}/blueprint.json (include salt={salt}, named_title='{named_title}')",
                "lake build && python3 protocol/verifier/verify_axioms.py",
                f'gh pr create --repo Skyzuo9/proofchain --title "[REVEAL] {pid}/{nid}: {named_title}" --body "Agent: {agent}\\nProblem: {pid}\\nNode: {nid}\\nCommitment: {commitment}\\nSalt: {salt}"',
            ],
        }

    raise ValueError(f"Unknown tool: {name}")


def handle_resource_read(uri: str) -> str:
    if uri == "proofchain://ledger":
        return (ROOT / "ledger" / "ledger.json").read_text(encoding="utf-8")
    if uri == "proofchain://spec":
        return (ROOT / "protocol" / "SPEC.md").read_text(encoding="utf-8")
    if uri == "proofchain://lemmas":
        return (ROOT / "docs" / "data" / "lemmas.json").read_text(encoding="utf-8")
    if uri == "proofchain://collab":
        return (ROOT / "docs" / "data" / "collab.json").read_text(encoding="utf-8")
    if uri == "proofchain://leaderboard":
        ledger = load_ledger()
        return json.dumps(
            {
                "global_leaderboard": ledger["global_leaderboard"],
                "naming_registry": ledger["naming_registry"],
            },
            indent=2,
            ensure_ascii=False,
        )
    raise ValueError(f"Unknown resource URI: {uri}")


def process_request(msg: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    method = msg.get("method")
    req_id = msg.get("id")
    params = msg.get("params") or {}

    # Notifications have no id and expect no response
    if req_id is None:
        return None

    try:
        if method == "initialize":
            result = {
                "protocolVersion": PROTOCOL_VERSION,
                "capabilities": {
                    "tools": {"listChanged": False},
                    "resources": {"subscribe": False, "listChanged": False},
                },
                "serverInfo": SERVER_INFO,
            }
        elif method == "ping":
            result = {}
        elif method == "tools/list":
            result = {"tools": TOOLS}
        elif method == "tools/call":
            tool_name = params.get("name")
            tool_args = params.get("arguments") or {}
            output = handle_tool_call(tool_name, tool_args)
            result = {
                "content": [
                    {
                        "type": "text",
                        "text": json.dumps(output, indent=2, ensure_ascii=False),
                    }
                ],
                "isError": False,
            }
        elif method == "resources/list":
            result = {
                "resources": [
                    {"uri": "proofchain://ledger", "name": "ProofChain Cryptographic Ledger", "mimeType": "application/json"},
                    {"uri": "proofchain://leaderboard", "name": "Global Agent Leaderboard & Naming Rights", "mimeType": "application/json"},
                    {"uri": "proofchain://spec", "name": "ProofChain Protocol Specification", "mimeType": "text/markdown"},
                ]
            }
        elif method == "resources/read":
            uri = params.get("uri", "")
            text = handle_resource_read(uri)
            mime = "text/markdown" if uri.endswith("spec") else "application/json"
            result = {"contents": [{"uri": uri, "mimeType": mime, "text": text}]}
        else:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method not found: {method}"},
            }

        return {"jsonrpc": "2.0", "id": req_id, "result": result}
    except Exception as exc:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "error": {"code": -32000, "message": str(exc)},
        }


def main() -> int:
    for raw_line in sys.stdin:
        line = raw_line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError as exc:
            resp = {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": f"Parse error: {exc}"}}
            sys.stdout.write(json.dumps(resp) + "\n")
            sys.stdout.flush()
            continue

        resp = process_request(msg)
        if resp is not None:
            sys.stdout.write(json.dumps(resp, ensure_ascii=False) + "\n")
            sys.stdout.flush()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
