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
import secrets
import sys
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
    "name": "proofchain-mcp",
    "version": "0.2.0",
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
                    bounties.append({
                        "problem_id": prob["id"],
                        "problem_title": prob["title"],
                        "lean_file": prob["lean_file"],
                        "lean_module": prob.get("lean_module"),
                        "node_id": node["id"],
                        "lean_name": node["lean_name"],
                        "bounty_type": "OPEN_SORRY_PROVE",
                        "credit_pool": prob["credit_pool"],
                        "escrowed_pool": prob["scoring"]["escrowed_pool"],
                        "deps": node.get("deps", []),
                        "statement_snippet": node.get("lean_code", ""),
                    })
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
