#!/usr/bin/env python3
"""
ProofChain Automated Importer for `google-deepmind/formal-conjectures`.

Parses Lean 4 files containing `@[category ...]`, `@[AMS ...]`, docstrings, and
`theorem ... := by sorry` declarations from:
  1. A local file (`--file`)
  2. A local checkout of `google-deepmind/formal-conjectures` (`--local-dir`)
  3. Live GitHub raw URL (`--github-path FormalConjectures/ErdosProblems/1.lean`)

Generates ProofChain-compatible `problems/<slug>/blueprint.json` + Lean 4 module stubs.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[2]
RAW_BASE = "https://raw.githubusercontent.com/google-deepmind/formal-conjectures/main"

AMS_MAP: Dict[str, tuple[str, str]] = {
    "05": ("Combinatorics", "组合数学"),
    "11": ("Number Theory", "数论"),
    "12": ("Field Theory & Polynomials", "域论与多项式"),
    "20": ("Group Theory", "群论"),
    "26": ("Real Analysis", "实分析"),
    "30": ("Complex Analysis", "复分析"),
    "42": ("Harmonic Analysis", "调和分析"),
    "52": ("Discrete Geometry", "离散几何"),
    "60": ("Probability Theory", "概率论"),
}

RE_CATEGORY = re.compile(r"\bcategory\s+([^,\]]+)")
RE_AMS = re.compile(r"\bAMS\s+([^,\]]+)")
RE_DOC = re.compile(r"/--([\s\S]*?)-/")
RE_THEOREM = re.compile(
    r"(?P<attrs>(?:@\[[^\]]+\]\s*)*)(?:theorem|lemma)\s+(?P<name>[A-Za-z_][A-Za-z0-9_']*)\s*(?P<sig>[\s\S]*?):=\s*by\s*(?P<body>sorry\b|[\s\S]*?)(?=\n(?:@\[|/--|theorem|lemma|def|end\b)|\Z)"
)


def parse_formal_conjecture_source(source: str, source_ref: str) -> Dict[str, Any]:
    """Extract category, AMS codes, docstring, and theorem declarations from a formal-conjectures Lean file."""
    categories = [m.group(1).strip() for m in RE_CATEGORY.finditer(source)]
    ams_codes: List[str] = []
    for m in RE_AMS.finditer(source):
        ams_codes.extend(re.findall(r"\d+", m.group(1)))

    docstrings = [re.sub(r"\s+", " ", m.group(1)).strip() for m in RE_DOC.finditer(source)]
    theorems: List[Dict[str, Any]] = []

    for m in RE_THEOREM.finditer(source):
        attrs = m.group("attrs") or ""
        name = m.group("name").strip()
        sig = re.sub(r"\s+", " ", (m.group("sig") or "").strip())
        body = (m.group("body") or "").strip()
        is_open = bool(re.search(r"\bsorry\b", body))
        local_cat_m = RE_CATEGORY.search(attrs)
        local_cat = local_cat_m.group(1).strip() if local_cat_m else (categories[0] if categories else "research open")
        theorems.append({
            "lean_name": name,
            "signature": sig,
            "is_open": is_open,
            "category_attr": local_cat,
            "snippet": f"theorem {name} {sig} := by {'sorry' if is_open else '...'}",
        })

    primary_ams = ams_codes[0] if ams_codes else "11"
    cat_en, cat_zh = AMS_MAP.get(primary_ams, ("Open Conjecture", "开放猜想"))
    is_research_open = any("open" in c.lower() for c in categories) or any(t["is_open"] for t in theorems)

    return {
        "source_ref": source_ref,
        "categories": categories,
        "ams_codes": sorted(set(ams_codes)),
        "category_en": cat_en,
        "category_zh": cat_zh,
        "is_research_open": is_research_open,
        "summary": docstrings[0] if docstrings else f"Imported from google-deepmind/formal-conjectures ({source_ref}).",
        "theorems": theorems,
    }


def to_blueprint(parsed: Dict[str, Any], problem_id: str, slug: str, tier: int = 4, pool: int = 5000) -> Dict[str, Any]:
    module_suffix = problem_id.replace("-", "")
    lean_module = f"ProofChain.{module_suffix}"
    lean_file = f"ProofChain/{module_suffix}.lean"

    nodes: List[Dict[str, Any]] = []
    thms = parsed["theorems"]
    if not thms:
        raise ValueError(f"No theorems found in {parsed['source_ref']}")

    for idx, thm in enumerate(thms):
        is_last = idx == len(thms) - 1
        nid = "MAIN" if is_last else f"C{idx + 1}"
        deps = [f"C{i + 1}" for i in range(idx)] if is_last and idx > 0 else []
        nodes.append({
            "id": nid,
            "lean_name": thm["lean_name"],
            "label": f"{'OPEN: ' if thm['is_open'] else ''}{thm['lean_name']}",
            "label_zh": f"{'悬赏中：' if thm['is_open'] else ''}{thm['lean_name']}",
            "author": None if thm["is_open"] else "formal-conjectures-import",
            "tx_type": "OPEN" if thm["is_open"] else "PROVE",
            "status": "open" if thm["is_open"] else "verified",
            "deps": deps,
            "baseline_reprove_rate": 0.002 if thm["is_open"] else 0.5,
            "novelty_score": 0.95 if thm["is_open"] else 0.2,
            "lean_code": thm["snippet"],
        })

    return {
        "id": problem_id,
        "slug": slug,
        "tier": tier,
        "lean_module": lean_module,
        "lean_file": lean_file,
        "upstream_source": f"google-deepmind/formal-conjectures:{parsed['source_ref']}",
        "ams_codes": parsed["ams_codes"],
        "title": f"Formal Conjecture: {thms[-1]['lean_name']}",
        "title_zh": f"前沿形式化猜想：{thms[-1]['lean_name']}",
        "category": parsed["category_en"],
        "category_zh": parsed["category_zh"],
        "difficulty": f"Tier {tier} · Formal Conjectures Import",
        "difficulty_zh": f"Tier {tier} · 自动导入开放猜想",
        "status": "open" if parsed["is_research_open"] else "settled",
        "credit_pool": pool,
        "root_id": "MAIN",
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "summary": parsed["summary"],
        "summary_zh": f"从 google-deepmind/formal-conjectures 导入：{parsed['summary']}",
        "statement_latex": thms[-1]["signature"][:220],
        "naming_rights": {
            "lead_title": f"Lead Discovery & Formalization Right for {thms[-1]['lean_name']}"
        },
        "nodes": nodes,
    }


def fetch_github_raw(rel_path: str) -> str:
    url = f"{RAW_BASE}/{rel_path.lstrip('/')}"
    with urllib.request.urlopen(url, timeout=20) as resp:
        return resp.read().decode("utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Import Lean 4 open conjectures from google-deepmind/formal-conjectures")
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--file", help="Path to a local formal-conjectures .lean file")
    src.add_argument("--local-dir", help="Path to a local directory of formal-conjectures .lean files")
    src.add_argument("--github-path", help="Relative path inside google-deepmind/formal-conjectures (e.g. FormalConjectures/ErdosProblems/1.lean)")

    parser.add_argument("--start-id", type=int, default=13, help="Starting PC-XXX numeric ID (default 13 -> PC-013)")
    parser.add_argument("--only-open", action="store_true", help="Skip files without open `sorry` theorems")
    parser.add_argument("--limit", type=int, default=10, help="Max files to import in --local-dir mode")
    parser.add_argument("--tier", type=int, default=4, help="Assigned ProofChain Tier (1-4)")
    parser.add_argument("--pool", type=int, default=5000, help="Default credit pool")
    parser.add_argument("--write", action="store_true", help="Write generated blueprints into problems/ (default: dry-run JSON stdout)")
    args = parser.parse_args()

    inputs: List[tuple[str, str]] = []
    if args.file:
        p = Path(args.file)
        inputs.append((p.name, p.read_text(encoding="utf-8")))
    elif args.github_path:
        inputs.append((args.github_path, fetch_github_raw(args.github_path)))
    elif args.local_dir:
        d = Path(args.local_dir)
        for fp in sorted(d.rglob("*.lean")):
            inputs.append((str(fp.relative_to(d)), fp.read_text(encoding="utf-8")))
            if len(inputs) >= args.limit:
                break

    generated: List[Dict[str, Any]] = []
    next_id = args.start_id

    for ref, content in inputs:
        parsed = parse_formal_conjecture_source(content, ref)
        if args.only_open and not parsed["is_research_open"]:
            continue
        if not parsed["theorems"]:
            continue

        pid = f"PC-{next_id:03d}"
        safe_stem = re.sub(r"[^a-z0-9]+", "_", Path(ref).stem.lower()).strip("_")
        slug = f"pc{next_id:03d}_{safe_stem}"
        bp = to_blueprint(parsed, pid, slug, tier=args.tier, pool=args.pool)
        generated.append(bp)

        if args.write:
            out_dir = ROOT / "problems" / slug
            out_dir.mkdir(parents=True, exist_ok=True)
            (out_dir / "blueprint.json").write_text(json.dumps(bp, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            print(f"[IMPORTED] {pid} -> problems/{slug}/blueprint.json ({len(bp['nodes'])} nodes)")
        next_id += 1

    if not args.write:
        print(json.dumps({"imported_count": len(generated), "blueprints": generated}, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
