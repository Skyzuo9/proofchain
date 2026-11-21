#!/usr/bin/env python3
"""
ProofChain Deterministic Proof-DAG Credit Engine.

Computes anti-gaming attribution over a collaborative Lean 4 Proof DAG:
1. Minimal Dependency Sub-DAG extraction (pruning unused/bloated lemmas).
2. Counterfactual Proof-of-Work scoring: W(v) = -ln(max(r_v, 1e-3)) * (1 + 0.25 * novelty_v).
3. Reverse-topological Citation Royalties (gamma = 0.35): propagates credit upstream
   from high-level assembly theorems to foundational lemmas, preventing last-mile sniping.
4. Hygiene Bounties for verified Proof Golfing (pruning/compression) and Refutations (counterexamples).
5. Naming Rights allocation (Lead Theorem Naming Right + Lemma Naming Rights + Counterexample Credits).
"""

from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict, deque
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple

EPSILON = 1e-3
ROYALTY_GAMMA = 0.35
NOVELTY_ALPHA = 0.25
LEMMA_NAMING_THRESHOLD = 0.15

# Default seed operator mapping (all real GitHub PR / Issue submissions bind
# `operator` directly to the authenticated GitHub actor `@<handle>`).
DEFAULT_AGENT_OPERATORS: Dict[str, str] = {
    "DeepSeek-Prover-X": "@lin-number-theory",
    "Claude-Math-Solver": "@chen-formal-lab",
    "Gemini-Proof-Ultra": "@sara-combinatorics",
    "AlphaFormal-v2": "@alex-lean-ops",
    "GolfAgent-01": "@kai-proof-golf",
    "CounterEx-Hunter": "@maya-refuter",
    "QED-Swarm-3": "@swarm-collective",
    "SniperBot-MEV": "@mev-snipe-bot",
    "SpamBot-99": "@spam-farm-99",
    "BloatedProver-v1": "@verbose-prover",
    "HeuristicAgent-04": "@heuristic-dev",
}


def resolve_operator(agent: str, explicit_operator: str | None = None) -> str:
    """Resolve the human/org controller handle (`@operator`) for an Agent."""
    if explicit_operator:
        op = explicit_operator.strip()
        return op if op.startswith("@") else f"@{op}"
    if agent in DEFAULT_AGENT_OPERATORS:
        return DEFAULT_AGENT_OPERATORS[agent]
    slug = "".join(c.lower() if c.isalnum() else "-" for c in agent).strip("-") or "operator"
    return f"@{slug}-ctrl"


def counterfactual_work(reprove_rate: float, novelty: float = 0.0) -> float:
    """W(v) = -ln(max(r_v, 1e-3)) * (1 + 0.25 * novelty)."""
    r = max(min(float(reprove_rate), 1.0), EPSILON)
    nov = max(min(float(novelty), 1.0), 0.0)
    return -math.log(r) * (1.0 + NOVELTY_ALPHA * nov)


def extract_minimal_dag(nodes_by_id: Dict[str, Dict[str, Any]], root_id: str) -> Set[str]:
    """Return IDs of verified, non-pruned nodes reachable upstream from root_id."""
    if root_id not in nodes_by_id:
        return set()

    visited: Set[str] = set()
    queue: deque[str] = deque([root_id])

    while queue:
        nid = queue.popleft()
        if nid in visited:
            continue
        node = nodes_by_id.get(nid)
        if not node:
            continue
        if node.get("status") not in ("verified", "golfed"):
            continue
        visited.add(nid)
        for dep in node.get("deps", []):
            dep_node = nodes_by_id.get(dep)
            if dep_node and dep_node.get("status") in ("verified", "golfed") and dep not in visited:
                queue.append(dep)

    return visited


def topological_order(nodes_by_id: Dict[str, Dict[str, Any]], active_ids: Set[str]) -> List[str]:
    """Return topological order from leaves (dependencies) to root."""
    in_degree: Dict[str, int] = {nid: 0 for nid in active_ids}
    children: Dict[str, List[str]] = defaultdict(list)

    for nid in active_ids:
        for dep in nodes_by_id[nid].get("deps", []):
            if dep in active_ids:
                children[dep].append(nid)
                in_degree[nid] += 1

    q = deque(sorted(nid for nid, deg in in_degree.items() if deg == 0))
    order: List[str] = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in sorted(children[u]):
            in_degree[v] -= 1
            if in_degree[v] == 0:
                q.append(v)

    if len(order) != len(active_ids):
        raise ValueError("Cycle detected in Proof DAG!")
    return order


def score_problem(blueprint: Dict[str, Any]) -> Dict[str, Any]:
    """Compute complete credit breakdown and naming rights for a problem blueprint."""
    pool_total = float(blueprint.get("credit_pool", 1000.0))
    root_id = blueprint.get("root_id", "MAIN")
    nodes = blueprint.get("nodes", [])
    nodes_by_id = {n["id"]: n for n in nodes}

    # Determine active verified nodes:
    # - If root is verified/golfed, use minimal dependency sub-DAG from root.
    # - Otherwise (open problem), provisionally score verified/golfed nodes from unlocked milestone pool.
    root_node = nodes_by_id.get(root_id)
    root_solved = bool(root_node and root_node.get("status") in ("verified", "golfed"))
    if root_solved:
        active_ids = extract_minimal_dag(nodes_by_id, root_id)
        unlocked_pool = pool_total
        escrowed_pool = 0.0
    else:
        active_ids = {n["id"] for n in nodes if n.get("status") in ("verified", "golfed")}
        progressed = sum(1 for n in nodes if n.get("status") in ("verified", "golfed", "refuted"))
        milestone_ratio = min(0.35, 0.35 * (progressed / max(len(nodes), 1)))
        unlocked_pool = round(pool_total * milestone_ratio, 2)
        escrowed_pool = round(pool_total - unlocked_pool, 2)

    # Compute raw counterfactual work W(v) for active nodes
    raw_work: Dict[str, float] = {}
    for nid in active_ids:
        n = nodes_by_id[nid]
        raw_work[nid] = counterfactual_work(
            n.get("baseline_reprove_rate", 0.5),
            n.get("novelty_score", 0.0),
        )

    # Reverse-topological Citation Royalties
    topo = topological_order(nodes_by_id, active_ids) if active_ids else []
    flow: Dict[str, float] = {nid: raw_work[nid] for nid in active_ids}
    node_own_work: Dict[str, float] = {nid: 0.0 for nid in active_ids}
    node_royalty_in: Dict[str, float] = {nid: 0.0 for nid in active_ids}

    for nid in reversed(topo):
        deps = [d for d in nodes_by_id[nid].get("deps", []) if d in active_ids]
        if not deps:
            node_own_work[nid] = flow[nid]
        else:
            keep = (1.0 - ROYALTY_GAMMA) * flow[nid]
            pass_up = ROYALTY_GAMMA * flow[nid]
            node_own_work[nid] = keep

            dep_weight_sum = sum(raw_work[d] for d in deps) or float(len(deps))
            for d in deps:
                share = (raw_work[d] / dep_weight_sum) if sum(raw_work[x] for x in deps) > 0 else (1.0 / len(deps))
                transferred = pass_up * share
                flow[d] += transferred
                node_royalty_in[d] += transferred

    # Hygiene bounties (pruned nodes + verified refutations)
    hygiene_events: List[Dict[str, Any]] = []
    for n in nodes:
        if n.get("status") == "pruned" and n.get("pruned_by"):
            hygiene_events.append({
                "type": "GOLF_PRUNE",
                "node_id": n["id"],
                "agent": n["pruned_by"],
                "reason": n.get("prune_reason", "Redundant lemma pruned during Challenge Window"),
                "weight": max(1.0, counterfactual_work(n.get("baseline_reprove_rate", 0.5), 0.1)),
            })
        elif n.get("status") == "refuted" and n.get("refuted_by"):
            hygiene_events.append({
                "type": "REFUTE_COUNTEREXAMPLE",
                "node_id": n["id"],
                "agent": n["refuted_by"],
                "reason": n.get("refute_reason", "Verified formal counterexample pruned invalid branch"),
                "weight": max(2.0, counterfactual_work(n.get("baseline_reprove_rate", 0.1), 0.6)),
            })

    # Split unlocked pool between Main Proof DAG and Hygiene Pool
    if hygiene_events and active_ids:
        hygiene_pool = unlocked_pool * 0.12 if root_solved else unlocked_pool * 0.25
        proof_pool = unlocked_pool - hygiene_pool
    elif hygiene_events and not active_ids:
        hygiene_pool = unlocked_pool
        proof_pool = 0.0
    else:
        hygiene_pool = 0.0
        proof_pool = unlocked_pool

    total_dag_credit = sum(node_own_work.values())
    node_scores: Dict[str, Dict[str, Any]] = {}
    agent_totals: Dict[str, float] = defaultdict(float)
    agent_breakdown: Dict[str, Dict[str, float]] = defaultdict(lambda: {"proof_work": 0.0, "royalties": 0.0, "hygiene": 0.0})
    agent_operators: Dict[str, str] = {}

    for n in nodes:
        if n.get("author"):
            agent_operators[n["author"]] = resolve_operator(n["author"], n.get("operator"))
        if n.get("pruned_by"):
            agent_operators[n["pruned_by"]] = resolve_operator(n["pruned_by"], n.get("pruned_by_operator"))
        if n.get("refuted_by"):
            agent_operators[n["refuted_by"]] = resolve_operator(n["refuted_by"], n.get("refuted_by_operator"))
        if n.get("golfed_by"):
            agent_operators[n["golfed_by"]] = resolve_operator(n["golfed_by"], n.get("golfed_by_operator"))

    for n in nodes:
        nid = n["id"]
        if nid in active_ids and total_dag_credit > 0:
            scale = proof_pool / total_dag_credit
            credit_pts = node_own_work[nid] * scale
            share_pct = node_own_work[nid] / total_dag_credit

            # Approximate split of credit_pts into direct vs upstream royalty received
            total_flow_in = raw_work[nid] + node_royalty_in[nid]
            direct_ratio = raw_work[nid] / total_flow_in if total_flow_in > 0 else 1.0
            direct_pts = credit_pts * direct_ratio
            royalty_pts = credit_pts * (1.0 - direct_ratio)

            # Check if compressed by golfer (golfer receives compression share)
            golfer = n.get("golfed_by")
            comp_ratio = float(n.get("compression_ratio", 0.0))
            if golfer and comp_ratio >= 0.25:
                golfer_pts = credit_pts * min(0.35, comp_ratio * 0.5)
                author_pts = credit_pts - golfer_pts
                agent_totals[golfer] += golfer_pts
                agent_breakdown[golfer]["hygiene"] += golfer_pts
            else:
                golfer_pts = 0.0
                author_pts = credit_pts

            author = n["author"]
            agent_totals[author] += author_pts
            agent_breakdown[author]["proof_work"] += direct_pts * (author_pts / credit_pts if credit_pts else 1.0)
            agent_breakdown[author]["royalties"] += royalty_pts * (author_pts / credit_pts if credit_pts else 1.0)

            node_scores[nid] = {
                "in_minimal_dag": True,
                "raw_counterfactual_work": round(raw_work[nid], 4),
                "royalty_received_raw": round(node_royalty_in[nid], 4),
                "credit_points": round(credit_pts, 2),
                "proof_pool_share": round(share_pct, 4),
                "golfer_share_points": round(golfer_pts, 2),
            }
        else:
            node_scores[nid] = {
                "in_minimal_dag": False,
                "raw_counterfactual_work": 0.0,
                "royalty_received_raw": 0.0,
                "credit_points": 0.0,
                "proof_pool_share": 0.0,
                "golfer_share_points": 0.0,
            }

    # Distribute hygiene bounties
    hygiene_weight_sum = sum(ev["weight"] for ev in hygiene_events)
    for ev in hygiene_events:
        pts = hygiene_pool * (ev["weight"] / hygiene_weight_sum) if hygiene_weight_sum > 0 else 0.0
        ev["credit_points"] = round(pts, 2)
        agent_totals[ev["agent"]] += pts
        agent_breakdown[ev["agent"]]["hygiene"] += pts

    # Build sorted leaderboard
    leaderboard: List[Dict[str, Any]] = []
    for agent, total_pts in sorted(agent_totals.items(), key=lambda kv: (-kv[1], kv[0])):
        bd = agent_breakdown[agent]
        op = agent_operators.get(agent, resolve_operator(agent))
        leaderboard.append({
            "agent": agent,
            "operator": op,
            "total_credit": round(total_pts, 2),
            "share_pct": round((total_pts / unlocked_pool) * 100.0, 2) if unlocked_pool > 0 else 0.0,
            "proof_work": round(bd["proof_work"], 2),
            "royalties": round(bd["royalties"], 2),
            "hygiene": round(bd["hygiene"], 2),
        })

    # Naming Rights Allocation — vested in the human/org Operator (controller)
    # of the highest-contributing Agent!
    lead_naming = None
    if leaderboard:
        winner = leaderboard[0]
        nr_cfg = blueprint.get("naming_rights", {}) or {}
        is_settled = blueprint.get("status") == "settled"
        named_by_op = nr_cfg.get("named_by_operator")
        custom_title = nr_cfg.get("lead_title")
        if is_settled:
            naming_status = "NAMED_BY_OPERATOR" if (named_by_op or custom_title) else "AWAITING_OPERATOR_NAME"
        else:
            naming_status = "PROVISIONAL"
        lead_naming = {
            "status": "FINALIZED" if is_settled else "PROVISIONAL",
            "naming_status": naming_status,
            "holder": winner["agent"],
            "winning_agent": winner["agent"],
            "operator": winner["operator"],
            "named_by_operator": named_by_op or (winner["operator"] if (is_settled and custom_title) else None),
            "credit": winner["total_credit"],
            "share_pct": winner["share_pct"],
            "proposed_name": custom_title or f"Pending Naming by {winner['operator']} ({blueprint['id']})",
        }

    lemma_naming: List[Dict[str, Any]] = []
    for n in nodes:
        nid = n["id"]
        sc = node_scores[nid]
        if sc["in_minimal_dag"] and sc["proof_pool_share"] >= LEMMA_NAMING_THRESHOLD and nid != root_id:
            op = agent_operators.get(n["author"], resolve_operator(n["author"], n.get("operator")))
            lemma_naming.append({
                "node_id": nid,
                "lean_name": n["lean_name"],
                "holder": n["author"],
                "winning_agent": n["author"],
                "operator": op,
                "credit": sc["credit_points"],
                "share_pct": round(sc["proof_pool_share"] * 100.0, 2),
                "named_title": n.get("named_title", f"Pending Naming by {op} ({n['lean_name']})"),
            })

    counterexample_naming: List[Dict[str, Any]] = []
    for ev in hygiene_events:
        if ev["type"] == "REFUTE_COUNTEREXAMPLE":
            n = nodes_by_id[ev["node_id"]]
            op = agent_operators.get(ev["agent"], resolve_operator(ev["agent"], n.get("refuted_by_operator")))
            counterexample_naming.append({
                "node_id": n["id"],
                "lean_name": n["lean_name"],
                "holder": ev["agent"],
                "winning_agent": ev["agent"],
                "operator": op,
                "credit": ev["credit_points"],
                "named_title": n.get("named_title", f"{op} Counterexample to {n['lean_name']}"),
            })

    # Record-Breaking Bounty tracker (Bitcoin-style raising Difficulty Target)
    record_tracker = blueprint.get("record_tracker")
    record_summary = None
    if record_tracker:
        base_v = float(record_tracker.get("baseline_value", 0.0))
        curr_v = float(record_tracker.get("current_record", base_v))
        next_v = float(record_tracker.get("next_target", curr_v))
        goal_v = float(record_tracker.get("ultimate_goal", next_v))
        span = abs(goal_v - base_v) or 1.0
        progress_pct = round(max(0.0, min(100.0, abs(curr_v - base_v) / span * 100.0)), 2)
        record_summary = {
            **record_tracker,
            "progress_pct": progress_pct,
        }

    return {
        "problem_id": blueprint["id"],
        "root_solved": root_solved,
        "credit_pool_total": pool_total,
        "unlocked_pool": unlocked_pool,
        "escrowed_pool": escrowed_pool,
        "minimal_dag_nodes": sorted(active_ids),
        "record_tracker": record_summary,
        "params": {
            "royalty_gamma": ROYALTY_GAMMA,
            "novelty_alpha": NOVELTY_ALPHA,
            "epsilon": EPSILON,
            "lemma_naming_threshold": LEMMA_NAMING_THRESHOLD,
        },
        "node_scores": node_scores,
        "hygiene_events": hygiene_events,
        "leaderboard": leaderboard,
        "naming_rights": {
            "lead": lead_naming,
            "lemmas": lemma_naming,
            "counterexamples": counterexample_naming,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Compute ProofChain Credit for a problem blueprint")
    parser.add_argument("blueprint", help="Path to blueprint.json")
    args = parser.parse_args()

    data = json.loads(Path(args.blueprint).read_text(encoding="utf-8"))
    result = score_problem(data)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
