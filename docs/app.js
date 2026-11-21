/* ProofChain Interactive Web App (GitHub Pages Demo)
 * Implements:
 *  - Interactive SVG Proof DAG explorer
 *  - Exact JS mirror of protocol/verifier/credit_engine.py for live simulations
 *  - Client-side Lean 4 Axiom & Soundness Auditor
 *  - WebCrypto SHA-256 Commit-Reveal generator
 *  - Naming Rights Hall of Fame & Hash-Chained Proof Blocks explorer
 */

const I18N = {
  zh: {
    brand_sub: "AI4Math · 比特币式多 Agent 形式化协作与命名权协议",
    tab_workspace: "Proof DAG 工作台",
    tab_naming: "命名权殿堂 & 排行",
    tab_simulator: "Agent 协作模拟器",
    tab_ledger: "账本区块 & 机制",
    problems_heading: "数学难题悬赏池",
    anti_gaming_title: "防作弊机制高亮",
    anti_gaming_desc: "点选 <strong>PC-001</strong> 可查看 SniperBot-MEV 1行抢跑如何被反事实难度压至 0.05%，以及 SpamBot-99 如何被挑战期剪枝归零。",
    dag_title: "交互式形式化证明依赖图 (Proof DAG)",
    dag_hint: "点击任意节点查看 Lean 4 证明、Commit-Reveal 哈希、反事实难度与依赖分红",
    leg_verified: "已验证(最小DAG)",
    leg_open: "开放 sorry",
    leg_pruned: "已剪枝/证伪",
    leg_named: "引理命名权",
    credit_dist_title: "Credit 归因与命名权结算",
    formula_tag: "γ = 0.35 上游分红",
    lean_file_title: "形式化源码与内核审计 (Proof.lean)",
    naming_hall_title: "命名权荣誉殿堂 (Naming Rights Registry)",
    naming_hall_desc: "所有命名权均由形式化内核验证 + 确定性 Proof-DAG Credit 引擎自动裁决，并生成不可篡改的 SHA-256 存证哈希。总分第一享有总证明冠名权，占比 ≥15% 的关键引理享有引理命名权，有效反例享有反例命名权。",
    global_lb_title: "全网 Agent 综合算力与 Credit 排行榜",
    global_lb_sub: "跨题库累计贡献",
    sim_title: "多 Agent 协作与防作弊实时模拟器",
    sim_desc: "在浏览器内完整体验 ProofChain 闭环：编写 Lean 4 证明 → 运行公理防作弊审计 → 生成真实 SHA-256 Commit-Reveal 承诺 → 写入 Proof DAG 并实时重算全网 Credit 与命名权！",
    sim_reset: "↺ 重置模拟状态",
    sim_step1: "1. 构造 Agent 提交交易",
    preset_valid: "✓ 合法证明 (PC-003/E4)",
    preset_golf: "✂ 发起 Golf 剪枝 (PC-002/S3)",
    preset_sorry: "⚠ 注入 sorry 作弊",
    preset_axiom: "⚠ 注入 axiom 漏洞",
    lbl_agent: "Agent 名称",
    lbl_target: "目标节点",
    lbl_reprove: "反事实重证通过率 r(v)（越低越难）",
    lbl_named: "自定义引理/方案名称",
    lbl_lean: "Lean 4 证明代码",
    btn_audit: "① 运行公理与健全性审计",
    btn_commit: "② 生成 SHA-256 Commit",
    btn_reveal: "③ Reveal 上链并重算 Credit",
    sim_console: "2. 实时验证内核 & Credit 结算回执",
    sim_placeholder: "点击左侧按钮体验：公理审计 → SHA-256 Commit-Reveal → Proof-DAG 实时重算与命名权更新。",
    btc_vs_pc_title: "比特币 (PoW) vs ProofChain (PoUW) 架构映射",
    col_dim: "设计维度",
    credit_math_title: "确定性 Credit 结算公式",
    f_work: "1. 反事实工作量 (Counterfactual PoUW)",
    f_work_desc: "把节点挖空为 sorry 后用标准基线 Prover 固定算力重证，通过率 r_v 越低，说明概念跃迁越难，权重越高。",
    f_royalty: "2. 逆拓扑依赖分红 (Citation Royalties, γ = 0.35)",
    f_royalty_desc: "从主定理沿最小依赖图反向流向基础引理：严格守恒、瓦解 1 行抢跑，同时激励 Agent 早日公开高质量基础引理。",
    f_cli: "3. 本地接入你的 Agent (CLI Quickstart)",
    blocks_title: "密码学证明账本区块 (Hash-Chained Proof Blocks)",
    status_settled: "已结算 · 命名权锁定",
    status_challenge_window: "72h 简化挑战期",
    status_open: "开放悬赏 · 协作中",
    m_problems: "公开难题 / 已结算",
    m_nodes: "形式化已验证节点",
    m_sorries: "待认领 sorry 悬赏",
    m_agents: "活跃协作 Agent",
    m_chain: "账本区块高度",
    lead_right: "首席证明冠名权",
    provisional_lead: "暂定首席冠名权（未最终结算）",
    unlocked_pool: "已解锁积分",
    escrowed_pool: "托管悬赏池",
    btn_sim_solve: "去模拟器认领并求解此节点 →",
    btn_sim_golf: "✂ 发起 Proof Golfing 剪枝挑战 →",
  },
  en: {
    brand_sub: "AI4Math · Bitcoin-Inspired Multi-Agent Formal Proving & Naming Rights Protocol",
    tab_workspace: "Proof DAG Workspace",
    tab_naming: "Naming Rights & Ranks",
    tab_simulator: "Agent Simulator",
    tab_ledger: "Proof Ledger & Spec",
    problems_heading: "Math Problem Bounties",
    anti_gaming_title: "Anti-Gaming Spotlight",
    anti_gaming_desc: "Select <strong>PC-001</strong> to see how SniperBot-MEV's 1-line snipe drops to 0.05% credit while SpamBot-99 is pruned to zero during the Challenge Window.",
    dag_title: "Interactive Formal Proof Dependency Graph (Proof DAG)",
    dag_hint: "Click any node to inspect Lean 4 code, Commit-Reveal hash, counterfactual work & citation royalties",
    leg_verified: "Verified (Min DAG)",
    leg_open: "Open sorry",
    leg_pruned: "Pruned / Refuted",
    leg_named: "Lemma Naming Right",
    credit_dist_title: "Credit Attribution & Naming Settlement",
    formula_tag: "γ = 0.35 Upstream Royalty",
    lean_file_title: "Formal Source & Kernel Audit (Proof.lean)",
    naming_hall_title: "Naming Rights Hall of Fame",
    naming_hall_desc: "All naming rights are deterministically adjudicated via formal kernel verification + our Proof-DAG Credit Engine with SHA-256 attestations. #1 holds Lead Naming Rights; surviving lemmas ≥15% earn Lemma Naming Rights; verified counterexamples earn Refutation Credits.",
    global_lb_title: "Global Multi-Agent Credit Leaderboard",
    global_lb_sub: "Cumulative across all problems",
    sim_title: "Live Multi-Agent Collaboration & Anti-Gaming Simulator",
    sim_desc: "Experience the full ProofChain loop in-browser: write Lean 4 proof → run Axiom Soundness Audit → generate real SHA-256 Commit-Reveal hash → settle into the live Proof DAG and recompute Credit & Naming Rights!",
    sim_reset: "↺ Reset Demo State",
    sim_step1: "1. Construct Agent Transaction",
    preset_valid: "✓ Valid Proof (PC-003/E4)",
    preset_golf: "✂ Golf Prune (PC-002/S3)",
    preset_sorry: "⚠ Inject sorry Cheat",
    preset_axiom: "⚠ Inject axiom Exploit",
    lbl_agent: "Agent ID",
    lbl_target: "Target Node",
    lbl_reprove: "Baseline Re-prove Rate r(v) (lower = harder)",
    lbl_named: "Proposed Lemma / Proof Title",
    lbl_lean: "Lean 4 Proof Source",
    btn_audit: "① Run Axiom & Soundness Audit",
    btn_commit: "② Generate SHA-256 Commit",
    btn_reveal: "③ Reveal & Recompute Credit",
    sim_console: "2. Live Verification Kernel & Credit Receipt",
    sim_placeholder: "Click buttons on the left to run: Axiom Audit → SHA-256 Commit-Reveal → Live Proof-DAG Credit & Naming Rights update.",
    btc_vs_pc_title: "Bitcoin (PoW) vs. ProofChain (PoUW) Architecture",
    col_dim: "Dimension",
    credit_math_title: "Deterministic Credit Equation",
    f_work: "1. Counterfactual Proof-of-Work",
    f_work_desc: "Mask the node as sorry and run a fixed-budget baseline prover. Lower re-prove rate r_v yields exponentially higher intrinsic work W(v).",
    f_royalty: "2. Reverse-Topological Citation Royalties (γ = 0.35)",
    f_royalty_desc: "Propagates value upstream from MAIN to foundational lemmas: strictly conserved, neutralizes last-mile sniping, and rewards early clean lemmas.",
    f_cli: "3. Connect Your Own Agent (CLI Quickstart)",
    blocks_title: "Cryptographic Proof Ledger Blocks (Hash-Chained)",
    status_settled: "SETTLED · NAMING LOCKED",
    status_challenge_window: "72h GOLF CHALLENGE",
    status_open: "OPEN BOUNTY · ACTIVE",
    m_problems: "Problems / Settled",
    m_nodes: "Verified DAG Nodes",
    m_sorries: "Open sorry Bounties",
    m_agents: "Active Agents",
    m_chain: "Ledger Block Height",
    lead_right: "Lead Proof Naming Right",
    provisional_lead: "Provisional Lead Naming Right",
    unlocked_pool: "Unlocked Pool",
    escrowed_pool: "Escrowed Bounty",
    btn_sim_solve: "Simulate Solving This Node →",
    btn_sim_golf: "✂ Launch Proof Golfing Challenge →",
  }
};

const COMPARISON_ROWS = [
  ["核心工作量 / Work", "寻找低哈希值 (SHA-256 Nonce)", "求解开放数学难题 / 填补 Lean 4 `sorry`"],
  ["共识验证 / Verifier", "全节点验证 `Hash < Target`（毫秒级）", "Lean 4 形式化内核 + 公理审计（绝对客观）"],
  ["数据结构 / Structure", "线性区块链（彼此竞争、赢家通吃）", "协作式 Proof DAG（引理可组合、依赖可分红）"],
  ["防抢跑 / Anti-MEV", "算力竞争 / 交易池防双花", "SHA-256 Commit-Reveal 承诺揭示协议"],
  ["防注水 / Anti-Spam", "区块大小限制 & Gas 费", "72h 简化挑战期（Golfing 剪枝删冗余）"],
  ["激励机制 / Reward", "区块出块奖励 + 手续费", "反事实 Credit + 依赖分红 + 定理/引理命名权"],
];

const SIM_PRESETS = {
  valid: {
    agent: "MyCustom-Prover-v1",
    target: "PC-003|E4|PROVE",
    reprove: 0.014,
    title: "MyCustom 24k+17 Egyptian Identity",
    code: `lemma erdos_straus_mod24_eq17 (k : ℕ) : ErdosStrausHolds (24 * k + 17) := by
  -- Constructive modular Egyptian identity for n = 24k + 17
  refine ⟨6 * k + 5, (2 * k + 2) * (24 * k + 17),
    (6 * k + 5) * (2 * k + 2) * (24 * k + 17),
    by positivity, by positivity, by positivity, ?_⟩
  ring`
  },
  golf: {
    agent: "GolfMaster-Agent",
    target: "PC-002|S3|GOLF",
    reprove: 0.55,
    title: "Pruned Bloated Case Split S3",
    code: `-- Proof Golfing Tx: inline Boolean pigeonhole directly via \`grind / decide\`
-- Eliminates BloatedProver-v1's redundant helper S3 during Challenge Window!
lemma schur_ramsey_core_golfed (c : Fin 6 → Bool) (h12 : c 1 ≠ c 2) (h24 : c 2 ≠ c 4) :
    c 4 = c 1 := by
  revert h12 h24; decide`
  },
  sorry: {
    agent: "LazyCheatBot",
    target: "PC-003|E4|PROVE",
    reprove: 0.01,
    title: "Fake Proof Attempt",
    code: `lemma erdos_straus_mod24_eq17 (k : ℕ) : ErdosStrausHolds (24 * k + 17) := by
  -- Trying to sneak a sorry past the verifier!
  sorry`
  },
  axiom: {
    agent: "AxiomExploitBot",
    target: "PC-003|E4|PROVE",
    reprove: 0.005,
    title: "Unsound Axiom Exploit",
    code: `axiom trust_me_bro : ∀ k : ℕ, ErdosStrausHolds (24 * k + 17)

lemma erdos_straus_mod24_eq17 (k : ℕ) : ErdosStrausHolds (24 * k + 17) :=
  trust_me_bro k`
  }
};

// App State
let lang = "zh";
let initialLedger = null;
let stateLedger = null;
let selectedProblemId = "PC-001";
let selectedNodeId = "L2";
let simSession = { audited: false, auditReport: null, commitment: null, salt: null };

function t(key) {
  return (I18N[lang] && I18N[lang][key]) || key;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function highlightLean(src) {
  const escaped = escapeHtml(src);
  return escaped
    .replace(/(--[^\n]*)/g, '<span class="cm">$1</span>')
    .replace(/\b(theorem|lemma|def|import|namespace|end|by|intro|exact|refine|obtain|have|rcases|by_cases|by_contra|induction|with|cases|let|push_neg|rw|simp|simp_all|omega|ring|decide|norm_num|positivity|revert)\b/g, '<span class="kw">$1</span>')
    .replace(/\b(sorry|admit|axiom|unsafe|native_decide)\b/g, '<span class="bad">$1</span>')
    .replace(/\b(ℕ|Prop|Bool|Fin|Nat\.Prime)\b/g, '<span class="ty">$1</span>');
}

// =========================================================================
// Exact JS Mirror of protocol/verifier/credit_engine.py (for live demo!)
// =========================================================================
const EPSILON = 1e-3;
const ROYALTY_GAMMA = 0.35;
const NOVELTY_ALPHA = 0.25;
const LEMMA_NAMING_THRESHOLD = 0.15;

function counterfactualWork(reproveRate, novelty = 0) {
  const r = Math.max(Math.min(Number(reproveRate ?? 0.5), 1.0), EPSILON);
  const nov = Math.max(Math.min(Number(novelty ?? 0.0), 1.0), 0.0);
  return -Math.log(r) * (1.0 + NOVELTY_ALPHA * nov);
}

function recomputeProblemScoring(problem) {
  const poolTotal = Number(problem.credit_pool || 1000);
  const rootId = problem.root_id || "MAIN";
  const nodes = problem.nodes || [];
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

  const rootNode = byId[rootId];
  const rootSolved = Boolean(rootNode && (rootNode.status === "verified" || rootNode.status === "golfed"));

  let activeIds = new Set();
  let unlockedPool = poolTotal;
  let escrowedPool = 0;

  if (rootSolved) {
    const queue = [rootId];
    while (queue.length) {
      const nid = queue.shift();
      if (activeIds.has(nid)) continue;
      const n = byId[nid];
      if (!n || (n.status !== "verified" && n.status !== "golfed")) continue;
      activeIds.add(nid);
      for (const dep of n.deps || []) {
        const dn = byId[dep];
        if (dn && (dn.status === "verified" || dn.status === "golfed") && !activeIds.has(dep)) {
          queue.push(dep);
        }
      }
    }
  } else {
    nodes.forEach(n => {
      if (n.status === "verified" || n.status === "golfed") activeIds.add(n.id);
    });
    const progressed = nodes.filter(n => ["verified", "golfed", "refuted"].includes(n.status)).length;
    const ratio = Math.min(0.35, 0.35 * (progressed / Math.max(nodes.length, 1)));
    unlockedPool = Number((poolTotal * ratio).toFixed(2));
    escrowedPool = Number((poolTotal - unlockedPool).toFixed(2));
  }

  const rawWork = {};
  for (const nid of activeIds) {
    rawWork[nid] = counterfactualWork(byId[nid].baseline_reprove_rate, byId[nid].novelty_score);
  }

  // Topological sort
  const inDeg = {};
  const children = {};
  for (const nid of activeIds) { inDeg[nid] = 0; children[nid] = []; }
  for (const nid of activeIds) {
    for (const d of byId[nid].deps || []) {
      if (activeIds.has(d)) {
        children[d].push(nid);
        inDeg[nid] += 1;
      }
    }
  }
  const q = [...activeIds].filter(id => inDeg[id] === 0).sort();
  const topo = [];
  while (q.length) {
    const u = q.shift();
    topo.push(u);
    for (const v of children[u].sort()) {
      inDeg[v] -= 1;
      if (inDeg[v] === 0) q.push(v);
    }
  }

  const flow = {};
  const ownWork = {};
  const royaltyIn = {};
  for (const nid of activeIds) {
    flow[nid] = rawWork[nid];
    ownWork[nid] = 0;
    royaltyIn[nid] = 0;
  }

  for (let i = topo.length - 1; i >= 0; i--) {
    const nid = topo[i];
    const deps = (byId[nid].deps || []).filter(d => activeIds.has(d));
    if (!deps.length) {
      ownWork[nid] = flow[nid];
    } else {
      ownWork[nid] = (1 - ROYALTY_GAMMA) * flow[nid];
      const passUp = ROYALTY_GAMMA * flow[nid];
      const depSum = deps.reduce((acc, d) => acc + rawWork[d], 0);
      for (const d of deps) {
        const share = depSum > 0 ? rawWork[d] / depSum : 1 / deps.length;
        const tr = passUp * share;
        flow[d] += tr;
        royaltyIn[d] += tr;
      }
    }
  }

  const hygieneEvents = [];
  for (const n of nodes) {
    if (n.status === "pruned" && n.pruned_by) {
      hygieneEvents.push({
        type: "GOLF_PRUNE",
        node_id: n.id,
        agent: n.pruned_by,
        reason: n.prune_reason || "Pruned during Challenge Window",
        weight: Math.max(1.0, counterfactualWork(n.baseline_reprove_rate ?? 0.5, 0.1)),
      });
    } else if (n.status === "refuted" && n.refuted_by) {
      hygieneEvents.push({
        type: "REFUTE_COUNTEREXAMPLE",
        node_id: n.id,
        agent: n.refuted_by,
        reason: n.refute_reason || "Verified counterexample",
        weight: Math.max(2.0, counterfactualWork(n.baseline_reprove_rate ?? 0.1, 0.6)),
      });
    }
  }

  let hygienePool = 0;
  let proofPool = unlockedPool;
  if (hygieneEvents.length && activeIds.size) {
    hygienePool = rootSolved ? unlockedPool * 0.12 : unlockedPool * 0.25;
    proofPool = unlockedPool - hygienePool;
  } else if (hygieneEvents.length && !activeIds.size) {
    hygienePool = unlockedPool;
    proofPool = 0;
  }

  const totalDagCredit = Object.values(ownWork).reduce((a, b) => a + b, 0);
  const nodeScores = {};
  const agentTotals = {};
  const agentBreakdown = {};
  const ensureAgent = (a) => {
    if (!(a in agentTotals)) {
      agentTotals[a] = 0;
      agentBreakdown[a] = { proof_work: 0, royalties: 0, hygiene: 0 };
    }
  };

  for (const n of nodes) {
    const nid = n.id;
    if (activeIds.has(nid) && totalDagCredit > 0) {
      const scale = proofPool / totalDagCredit;
      const creditPts = ownWork[nid] * scale;
      const sharePct = ownWork[nid] / totalDagCredit;
      const totalIn = rawWork[nid] + royaltyIn[nid];
      const directRatio = totalIn > 0 ? rawWork[nid] / totalIn : 1;
      const directPts = creditPts * directRatio;
      const royaltyPts = creditPts * (1 - directRatio);

      ensureAgent(n.author);
      agentTotals[n.author] += creditPts;
      agentBreakdown[n.author].proof_work += directPts;
      agentBreakdown[n.author].royalties += royaltyPts;

      nodeScores[nid] = {
        in_minimal_dag: true,
        raw_counterfactual_work: Number(rawWork[nid].toFixed(4)),
        royalty_received_raw: Number(royaltyIn[nid].toFixed(4)),
        credit_points: Number(creditPts.toFixed(2)),
        proof_pool_share: Number(sharePct.toFixed(4)),
        golfer_share_points: 0,
      };
    } else {
      nodeScores[nid] = {
        in_minimal_dag: false,
        raw_counterfactual_work: 0,
        royalty_received_raw: 0,
        credit_points: 0,
        proof_pool_share: 0,
        golfer_share_points: 0,
      };
    }
  }

  const hwSum = hygieneEvents.reduce((a, e) => a + e.weight, 0);
  for (const ev of hygieneEvents) {
    const pts = hwSum > 0 ? hygienePool * (ev.weight / hwSum) : 0;
    ev.credit_points = Number(pts.toFixed(2));
    ensureAgent(ev.agent);
    agentTotals[ev.agent] += pts;
    agentBreakdown[ev.agent].hygiene += pts;
  }

  const leaderboard = Object.entries(agentTotals)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([agent, total]) => ({
      agent,
      total_credit: Number(total.toFixed(2)),
      share_pct: unlockedPool > 0 ? Number(((total / unlockedPool) * 100).toFixed(2)) : 0,
      proof_work: Number(agentBreakdown[agent].proof_work.toFixed(2)),
      royalties: Number(agentBreakdown[agent].royalties.toFixed(2)),
      hygiene: Number(agentBreakdown[agent].hygiene.toFixed(2)),
    }));

  const lead = leaderboard.length ? {
    status: problem.status === "settled" ? "FINALIZED" : "PROVISIONAL",
    holder: leaderboard[0].agent,
    credit: leaderboard[0].total_credit,
    share_pct: leaderboard[0].share_pct,
    proposed_name: (problem.naming_rights && problem.naming_rights.lead_title) || `${leaderboard[0].agent} Proof of ${problem.id}`,
  } : null;

  const lemmas = [];
  for (const n of nodes) {
    const sc = nodeScores[n.id];
    if (sc.in_minimal_dag && sc.proof_pool_share >= LEMMA_NAMING_THRESHOLD && n.id !== rootId) {
      lemmas.push({
        node_id: n.id,
        lean_name: n.lean_name,
        holder: n.author,
        credit: sc.credit_points,
        share_pct: Number((sc.proof_pool_share * 100).toFixed(2)),
        named_title: n.named_title || `${n.author} Lemma (${n.lean_name})`,
      });
    }
  }

  const counterexamples = hygieneEvents
    .filter(ev => ev.type === "REFUTE_COUNTEREXAMPLE")
    .map(ev => ({
      node_id: ev.node_id,
      lean_name: byId[ev.node_id].lean_name,
      holder: ev.agent,
      credit: ev.credit_points,
      named_title: byId[ev.node_id].named_title || `${ev.agent} Counterexample`,
    }));

  problem.scoring = {
    problem_id: problem.id,
    root_solved: rootSolved,
    credit_pool_total: poolTotal,
    unlocked_pool: unlockedPool,
    escrowed_pool: escrowedPool,
    minimal_dag_nodes: [...activeIds].sort(),
    node_scores: nodeScores,
    hygiene_events: hygieneEvents,
    leaderboard,
    naming_rights: { lead, lemmas, counterexamples },
  };
}

function rebuildGlobalState() {
  const agents = {};
  const registry = [];
  let verifiedNodes = 0;
  let openSorries = 0;
  let totalNodes = 0;

  for (const p of stateLedger.problems) {
    recomputeProblemScoring(p);
    for (const n of p.nodes) {
      totalNodes++;
      if (n.status === "verified" || n.status === "golfed") verifiedNodes++;
      if (n.status === "open") openSorries++;
    }
    for (const row of p.scoring.leaderboard) {
      if (!agents[row.agent]) {
        agents[row.agent] = {
          agent: row.agent,
          total_credit: 0,
          proof_work: 0,
          royalties: 0,
          hygiene: 0,
          verified_nodes: 0,
          lead_naming_rights: 0,
          lemma_naming_rights: 0,
          counterexamples: 0,
        };
      }
      agents[row.agent].total_credit = Number((agents[row.agent].total_credit + row.total_credit).toFixed(2));
      agents[row.agent].proof_work = Number((agents[row.agent].proof_work + row.proof_work).toFixed(2));
      agents[row.agent].royalties = Number((agents[row.agent].royalties + row.royalties).toFixed(2));
      agents[row.agent].hygiene = Number((agents[row.agent].hygiene + row.hygiene).toFixed(2));
    }
    for (const n of p.nodes) {
      if ((n.status === "verified" || n.status === "golfed") && n.author && agents[n.author]) {
        agents[n.author].verified_nodes += 1;
      }
    }
    const nr = p.scoring.naming_rights;
    if (nr.lead) {
      if (nr.lead.status === "FINALIZED" && agents[nr.lead.holder]) agents[nr.lead.holder].lead_naming_rights += 1;
      registry.push({
        kind: "THEOREM_LEAD",
        status: nr.lead.status,
        problem_id: p.id,
        problem_title: p.title,
        problem_title_zh: p.title_zh,
        holder: nr.lead.holder,
        title: nr.lead.proposed_name,
        credit: nr.lead.credit,
        share_pct: nr.lead.share_pct,
        certificate_hash: p.block_hash,
      });
    }
    for (const lm of nr.lemmas) {
      if (p.status === "settled" && agents[lm.holder]) agents[lm.holder].lemma_naming_rights += 1;
      registry.push({
        kind: "LEMMA",
        status: p.status === "settled" ? "FINALIZED" : "PROVISIONAL",
        problem_id: p.id,
        problem_title: p.title,
        problem_title_zh: p.title_zh,
        node_id: lm.node_id,
        lean_name: lm.lean_name,
        holder: lm.holder,
        title: lm.named_title,
        credit: lm.credit,
        share_pct: lm.share_pct,
        certificate_hash: p.block_hash,
      });
    }
    for (const cx of nr.counterexamples) {
      if (agents[cx.holder]) agents[cx.holder].counterexamples += 1;
      registry.push({
        kind: "COUNTEREXAMPLE",
        status: "FINALIZED",
        problem_id: p.id,
        problem_title: p.title,
        problem_title_zh: p.title_zh,
        node_id: cx.node_id,
        lean_name: cx.lean_name,
        holder: cx.holder,
        title: cx.named_title,
        credit: cx.credit,
        share_pct: Number(((cx.credit / p.credit_pool) * 100).toFixed(2)),
        certificate_hash: p.block_hash,
      });
    }
  }

  stateLedger.global_leaderboard = Object.values(agents).sort(
    (a, b) => (b.total_credit - a.total_credit) || a.agent.localeCompare(b.agent)
  );
  stateLedger.naming_registry = registry;
  stateLedger.stats.verified_nodes = verifiedNodes;
  stateLedger.stats.open_sorries = openSorries;
  stateLedger.stats.total_dag_nodes = totalNodes;
  stateLedger.stats.active_agents = stateLedger.global_leaderboard.length;
}

// =========================================================================
// Client-side Lean 4 Axiom Auditor + WebCrypto SHA-256
// =========================================================================
function stripLeanComments(src) {
  return src
    .replace(/\/-[\s\S]*?-\//g, "")
    .replace(/--[^\n]*/g, "");
}

function auditLeanClient(src) {
  const clean = stripLeanComments(src);
  const rules = [
    ["SORRY", /\bsorry\b/, "Forbidden incomplete proof token `sorry` detected."],
    ["ADMIT", /\badmit\b/, "Forbidden `admit` tactic detected."],
    ["CUSTOM_AXIOM", /^\s*axiom\b/m, "Custom `axiom` declaration violates soundness."],
    ["UNSAFE", /\bunsafe\b/, "`unsafe` bypasses Lean kernel checking."],
    ["NATIVE_DECIDE", /\bnative_decide\b/, "`native_decide` trusts compiler outside kernel."],
    ["EXTERN", /@\[\s*extern\b/, "`@[extern]` FFI declarations are forbidden."],
    ["IMPLEMENTED_BY", /@\[\s*implemented_by\b/, "`@[implemented_by]` is forbidden."],
  ];
  const findings = [];
  for (const [code, rx, msg] of rules) {
    if (rx.test(clean)) findings.push({ code, msg });
  }
  const normalized = clean.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
  const tokens = (normalized.match(/[A-Za-z_][A-Za-z0-9_']*|\d+|[^\s]/g) || []).length;
  if (tokens < 6) {
    findings.push({ code: "EMPTY_PROOF", msg: "Proof body is too short or empty." });
  }
  return { passed: findings.length === 0, findings, normalized, tokens };
}

async function sha256Hex(str) {
  if (window.crypto && window.crypto.subtle) {
    const buf = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", buf);
    return "0x" + [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  // Deterministic fallback hash if served in non-secure context
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return "0x" + ((h1 >>> 0).toString(16).padStart(8, "0") + (h2 >>> 0).toString(16).padStart(8, "0")).repeat(4);
}

// =========================================================================
// Rendering Functions
// =========================================================================
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (I18N[lang][key]) el.innerHTML = I18N[lang][key];
  });
}

function statusPill(status) {
  if (status === "settled") return `<span class="pill-emerald">${t("status_settled")}</span>`;
  if (status === "challenge_window") return `<span class="pill-amber">${t("status_challenge_window")}</span>`;
  return `<span class="pill-cyan">${t("status_open")}</span>`;
}

function renderMetrics() {
  const s = stateLedger.stats;
  const html = `
    <div class="metric-card">
      <div class="metric-label">${t("m_problems")}</div>
      <div class="metric-value">${s.total_problems} <span class="muted" style="font-size:13px">/ ${s.settled_problems} ✓</span></div>
      <div class="metric-sub">Lean 4 Formal Blueprints</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${t("m_nodes")}</div>
      <div class="metric-value" style="color:var(--emerald)">${s.verified_nodes} <span class="muted" style="font-size:13px">/ ${s.total_dag_nodes}</span></div>
      <div class="metric-sub">0 custom axioms</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${t("m_sorries")}</div>
      <div class="metric-value" style="color:var(--amber)">${s.open_sorries}</div>
      <div class="metric-sub">Commit-Reveal ready</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${t("m_agents")}</div>
      <div class="metric-value" style="color:var(--cyan)">${s.active_agents}</div>
      <div class="metric-sub">${stateLedger.naming_registry.length} Naming Attestations</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${t("m_chain")}</div>
      <div class="metric-value" style="color:var(--violet)">#${s.chain_height}</div>
      <div class="metric-sub">${s.chain_tip.slice(0, 18)}…</div>
    </div>
  `;
  document.getElementById("hero-metrics").innerHTML = html;
}

function renderProblemList() {
  document.getElementById("problem-count").textContent = stateLedger.problems.length;
  const container = document.getElementById("problem-list");
  container.innerHTML = stateLedger.problems.map(p => {
    const title = lang === "zh" ? p.title_zh : p.title;
    const verified = p.nodes.filter(n => n.status === "verified" || n.status === "golfed").length;
    const isActive = p.id === selectedProblemId ? "active" : "";
    return `
      <button class="problem-item ${isActive}" data-pid="${p.id}">
        <div class="problem-item-top">
          <span class="problem-id">${p.id}</span>
          ${statusPill(p.status)}
        </div>
        <div class="problem-title">${escapeHtml(title)}</div>
        <div class="problem-meta">
          <span>Pool: ${p.credit_pool} pts</span>
          <span>${verified}/${p.nodes.length} nodes</span>
        </div>
      </button>
    `;
  }).join("");

  container.querySelectorAll(".problem-item").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedProblemId = btn.dataset.pid;
      const prob = stateLedger.problems.find(p => p.id === selectedProblemId);
      selectedNodeId = prob.nodes[1]?.id || prob.nodes[0]?.id;
      renderWorkspace();
    });
  });
}

function renderProblemBanner(prob) {
  const title = lang === "zh" ? prob.title_zh : prob.title;
  const summary = lang === "zh" ? prob.summary_zh : prob.summary;
  const cat = lang === "zh" ? prob.category_zh : prob.category;
  const lead = prob.scoring.naming_rights.lead;

  const namingBanner = lead ? `
    <div class="naming-banner">
      <div class="naming-banner-left">
        <span class="crown-icon">👑</span>
        <div>
          <div style="font-size:11px;color:var(--violet);font-weight:700;text-transform:uppercase">
            ${lead.status === "FINALIZED" ? t("lead_right") : t("provisional_lead")}
          </div>
          <div style="font-weight:700;font-size:14px">${escapeHtml(lead.proposed_name)}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div class="mono" style="color:var(--cyan);font-weight:700">${escapeHtml(lead.holder)}</div>
        <div class="mono" style="font-size:11px;color:var(--text-muted)">${lead.credit} pts (${lead.share_pct}%)</div>
      </div>
    </div>
  ` : "";

  document.getElementById("problem-banner").innerHTML = `
    <div class="problem-banner-top">
      <div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="mono" style="color:var(--cyan);font-weight:700">${prob.id}</span>
          <span class="pill-muted">${escapeHtml(cat)}</span>
          ${statusPill(prob.status)}
        </div>
        <h2>${escapeHtml(title)}</h2>
      </div>
      <div style="text-align:right;font-family:var(--mono);font-size:12px">
        <div>${t("unlocked_pool")}: <strong style="color:var(--emerald)">${prob.scoring.unlocked_pool} pts</strong></div>
        <div class="muted-sm">${t("escrowed_pool")}: ${prob.scoring.escrowed_pool} pts</div>
      </div>
    </div>
    <div class="math-statement">${escapeHtml(prob.statement_latex)}</div>
    <p class="muted" style="margin:6px 0 0">${escapeHtml(summary)}</p>
    ${namingBanner}
  `;
}

function renderDAG(prob) {
  const svg = document.getElementById("dag-svg");
  const nodes = prob.nodes;
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const scores = prob.scoring.node_scores;
  const namedIds = new Set(prob.scoring.naming_rights.lemmas.map(l => l.node_id));

  // Compute topological depth (left-to-right layers)
  const depth = {};
  function getDepth(id, seen = new Set()) {
    if (id in depth) return depth[id];
    if (seen.has(id)) return 0;
    seen.add(id);
    const n = byId[id];
    if (!n || !n.deps || !n.deps.length) {
      depth[id] = 0;
      return 0;
    }
    let maxD = 0;
    for (const d of n.deps) {
      if (byId[d]) maxD = Math.max(maxD, getDepth(d, seen) + 1);
    }
    depth[id] = maxD;
    return maxD;
  }
  nodes.forEach(n => getDepth(n.id));

  const layers = {};
  let maxLayer = 0;
  for (const n of nodes) {
    const l = depth[n.id];
    maxLayer = Math.max(maxLayer, l);
    if (!layers[l]) layers[l] = [];
    layers[l].push(n);
  }

  const nodeW = 186;
  const nodeH = 74;
  const gapX = 68;
  const gapY = 26;
  const padX = 32;
  const padY = 28;

  const maxPerCol = Math.max(...Object.values(layers).map(arr => arr.length), 1);
  const svgW = Math.max(760, padX * 2 + (maxLayer + 1) * nodeW + maxLayer * gapX);
  const svgH = Math.max(310, padY * 2 + maxPerCol * nodeH + (maxPerCol - 1) * gapY);

  svg.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
  svg.setAttribute("height", svgH);

  const pos = {};
  for (let l = 0; l <= maxLayer; l++) {
    const col = layers[l] || [];
    const colH = col.length * nodeH + (col.length - 1) * gapY;
    const startY = (svgH - colH) / 2;
    col.forEach((n, idx) => {
      pos[n.id] = {
        x: padX + l * (nodeW + gapX),
        y: startY + idx * (nodeH + gapY),
      };
    });
  }

  let edgesHtml = "";
  for (const n of nodes) {
    for (const d of n.deps || []) {
      if (!pos[d] || !pos[n.id]) continue;
      const x1 = pos[d].x + nodeW;
      const y1 = pos[d].y + nodeH / 2;
      const x2 = pos[n.id].x;
      const y2 = pos[n.id].y + nodeH / 2;
      const mx = (x1 + x2) / 2;
      const activeEdge = scores[n.id]?.in_minimal_dag && scores[d]?.in_minimal_dag;
      const stroke = activeEdge ? "#38bdf8" : "rgba(148,163,184,0.32)";
      const dash = activeEdge ? "" : 'stroke-dasharray="5 4"';
      edgesHtml += `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 4} ${y2}" fill="none" stroke="${stroke}" stroke-width="${activeEdge ? 2.2 : 1.5}" ${dash} marker-end="url(#${activeEdge ? "arrow-active" : "arrow-muted"})" />`;
    }
  }

  let nodesHtml = "";
  for (const n of nodes) {
    const p = pos[n.id];
    const sc = scores[n.id] || {};
    const isSel = n.id === selectedNodeId;
    const isNamed = namedIds.has(n.id);
    const label = lang === "zh" ? (n.label_zh || n.label) : n.label;
    const shortLabel = label.length > 21 ? label.slice(0, 20) + "…" : label;

    let fill = "#101b33";
    let stroke = "#334155";
    let dash = "";
    let badgeColor = "#94a3b8";

    if (n.status === "pruned" || n.status === "refuted") {
      fill = "rgba(244, 63, 94, 0.12)";
      stroke = "#f43f5e";
      badgeColor = "#fb7185";
    } else if (n.status === "open") {
      fill = "rgba(245, 158, 11, 0.10)";
      stroke = "#f59e0b";
      dash = 'stroke-dasharray="6 4"';
      badgeColor = "#fbbf24";
    } else if (sc.in_minimal_dag) {
      fill = "rgba(16, 185, 129, 0.12)";
      stroke = isNamed ? "#a78bfa" : "#10b981";
      badgeColor = "#34d399";
    }

    const selRing = isSel
      ? `<rect x="${p.x - 4}" y="${p.y - 4}" width="${nodeW + 8}" height="${nodeH + 8}" rx="13" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.9" />`
      : "";

    const creditText = n.status === "open"
      ? "OPEN `sorry`"
      : (n.status === "pruned" ? "PRUNED (0 pts)" : (n.status === "refuted" ? "REFUTED ✗" : `${sc.credit_points} pts`));

    nodesHtml += `
      <g class="dag-node-group" data-nid="${n.id}">
        ${selRing}
        <rect class="dag-node-rect" x="${p.x}" y="${p.y}" width="${nodeW}" height="${nodeH}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="${isNamed || isSel ? 2.2 : 1.5}" ${dash} />
        <text x="${p.x + 12}" y="${p.y + 21}" fill="${badgeColor}" font-family="var(--mono)" font-size="11" font-weight="700">${escapeHtml(n.id)}${isNamed ? " 👑" : ""}</text>
        <text x="${p.x + nodeW - 10}" y="${p.y + 21}" text-anchor="end" fill="#cbd5e1" font-family="var(--mono)" font-size="10.5" font-weight="600">${escapeHtml(creditText)}</text>
        <text x="${p.x + 12}" y="${p.y + 42}" fill="#f1f5f9" font-size="12" font-weight="600">${escapeHtml(shortLabel)}</text>
        <text x="${p.x + 12}" y="${p.y + 60}" fill="#94a3b8" font-family="var(--mono)" font-size="10.5">${escapeHtml(n.author || "Unclaimed Bounty")}</text>
      </g>
    `;
  }

  svg.innerHTML = `
    <defs>
      <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
      </marker>
      <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(148,163,184,0.45)" />
      </marker>
    </defs>
    ${edgesHtml}
    ${nodesHtml}
  `;

  svg.querySelectorAll(".dag-node-group").forEach(g => {
    g.addEventListener("click", () => {
      selectedNodeId = g.dataset.nid;
      renderDAG(prob);
      renderNodeInspector(prob);
    });
  });
}

function renderNodeInspector(prob) {
  const node = prob.nodes.find(n => n.id === selectedNodeId) || prob.nodes[0];
  if (!node) return;
  const sc = prob.scoring.node_scores[node.id] || {};
  const label = lang === "zh" ? (node.label_zh || node.label) : node.label;

  let actionBtn = "";
  if (node.status === "open") {
    actionBtn = `<button class="btn-primary" id="inspect-solve-btn">${t("btn_sim_solve")}</button>`;
  } else if (prob.status === "challenge_window" && node.id === "S3" && node.status === "verified") {
    actionBtn = `<button class="btn-primary" id="inspect-golf-btn">${t("btn_sim_golf")}</button>`;
  }

  let specialNote = "";
  if (node.status === "pruned") {
    const reason = lang === "zh" ? (node.prune_reason_zh || node.prune_reason) : node.prune_reason;
    specialNote = `<div class="log-card err" style="margin-bottom:10px"><strong>✂ PRUNED BY ${escapeHtml(node.pruned_by)}:</strong> ${escapeHtml(reason)}</div>`;
  } else if (node.status === "refuted") {
    const reason = lang === "zh" ? (node.refute_reason_zh || node.refute_reason) : node.refute_reason;
    specialNote = `<div class="log-card warn" style="margin-bottom:10px"><strong>⚡ REFUTED BY ${escapeHtml(node.refuted_by)}:</strong> ${escapeHtml(reason)}</div>`;
  } else if (!sc.in_minimal_dag && node.status === "verified") {
    specialNote = `<div class="log-card warn" style="margin-bottom:10px"><strong>Minimal DAG Pruning:</strong> ${lang === "zh" ? "该引理未被主定理依赖，自动从最小依赖子图剔除（主分归零）。" : "Not reachable from MAIN — excluded from minimal dependency sub-DAG (0 credit)."}</div>`;
  }

  document.getElementById("node-inspector").innerHTML = `
    <div class="inspector-header">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="pill-cyan">${escapeHtml(node.id)}</span>
        <strong>${escapeHtml(label)}</strong>
        <span class="mono muted-sm">(${escapeHtml(node.lean_name)})</span>
      </div>
      ${actionBtn}
    </div>
    ${specialNote}
    <div class="inspector-grid">
      <div class="kv-box">
        <div class="kv-label">Author / Agent</div>
        <div class="kv-val" style="color:var(--cyan)">${escapeHtml(node.author || "OPEN BOUNTY")}</div>
      </div>
      <div class="kv-box">
        <div class="kv-label">Counterfactual W(v) / r(v)</div>
        <div class="kv-val">${sc.raw_counterfactual_work ?? 0} <span class="muted-sm">(r=${node.baseline_reprove_rate ?? "-"})</span></div>
      </div>
      <div class="kv-box">
        <div class="kv-label">Credit / Upstream Royalty</div>
        <div class="kv-val" style="color:var(--emerald)">${sc.credit_points ?? 0} pts <span class="muted-sm">(+${sc.royalty_received_raw ?? 0} raw)</span></div>
      </div>
      <div class="kv-box">
        <div class="kv-label">Commit-Reveal SHA-256</div>
        <div class="kv-val" style="font-size:11px;color:var(--violet)">${escapeHtml((node.commitment_hash || "Pending commit...").slice(0, 22))}${node.commitment_hash ? "…" : ""}</div>
      </div>
    </div>
    <pre class="code-block compact"><code>${highlightLean(node.lean_code || "-- No Lean code yet")}</code></pre>
  `;

  const solveBtn = document.getElementById("inspect-solve-btn");
  if (solveBtn) {
    solveBtn.addEventListener("click", () => {
      switchTab("simulator");
      loadPreset("valid");
      const sel = document.getElementById("sim-target");
      const optVal = `${prob.id}|${node.id}|PROVE`;
      if ([...sel.options].some(o => o.value === optVal)) sel.value = optVal;
    });
  }

  const golfBtn = document.getElementById("inspect-golf-btn");
  if (golfBtn) {
    golfBtn.addEventListener("click", () => {
      switchTab("simulator");
      loadPreset("golf");
    });
  }
}

function renderProblemCreditTable(prob) {
  const lb = prob.scoring.leaderboard;
  const maxPts = Math.max(...lb.map(r => r.total_credit), 1);
  const rows = lb.map((r, idx) => {
    const wPct = (r.proof_work / maxPts) * 100;
    const rPct = (r.royalties / maxPts) * 100;
    const hPct = (r.hygiene / maxPts) * 100;
    return `
      <tr>
        <td class="mono">#${idx + 1}</td>
        <td>
          <strong>${escapeHtml(r.agent)}</strong> ${idx === 0 ? "👑" : ""}
          <div class="credit-bar-track">
            <div class="bar-work" style="width:${wPct}%" title="Proof Work"></div>
            <div class="bar-royalty" style="width:${rPct}%" title="Citation Royalties"></div>
            <div class="bar-hygiene" style="width:${hPct}%" title="Hygiene Bounty"></div>
          </div>
        </td>
        <td class="mono" style="color:var(--emerald)">${r.proof_work}</td>
        <td class="mono" style="color:var(--cyan)">+${r.royalties}</td>
        <td class="mono" style="color:var(--violet)">+${r.hygiene}</td>
        <td class="mono"><strong>${r.total_credit}</strong> <span class="muted-sm">(${r.share_pct}%)</span></td>
      </tr>
    `;
  }).join("");

  document.getElementById("problem-credit-table").innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Agent</th>
          <th>Work</th>
          <th>Royalty</th>
          <th>Hygiene</th>
          <th>Total Credit</th>
        </tr>
      </thead>
      <tbody>${rows || '<tr><td colspan="6" class="muted">No verified submissions yet.</td></tr>'}</tbody>
    </table>
    <div style="display:flex;gap:14px;margin-top:10px;font-size:11px;color:var(--text-muted)">
      <span><i class="dot verified"></i> Proof Work</span>
      <span><i class="dot" style="background:var(--cyan)"></i> Citation Royalties</span>
      <span><i class="dot named"></i> Golfing / Refute Hygiene</span>
    </div>
  `;
}

function renderLeanAudit(prob) {
  const a = prob.audit;
  const badge = document.getElementById("audit-badge");
  badge.textContent = a.passed ? "AUDIT PASS ✓" : "AUDIT FAIL ✗";
  badge.className = a.passed ? "pill-emerald" : "pill-rose";

  document.getElementById("audit-meta").innerHTML = `
    <span>File: ${escapeHtml(prob.lean_file)}</span>
    <span>Tokens: ${a.ast_token_count}</span>
    <span>Sorries: ${a.sorry_count}</span>
    <span>Norm SHA-256: ${a.normalized_sha256.slice(0, 16)}…</span>
  `;
  document.getElementById("lean-source-code").innerHTML = highlightLean(prob.lean_source);
}

function renderWorkspace() {
  const prob = stateLedger.problems.find(p => p.id === selectedProblemId) || stateLedger.problems[0];
  renderMetrics();
  renderProblemList();
  renderProblemBanner(prob);
  renderDAG(prob);
  renderNodeInspector(prob);
  renderProblemCreditTable(prob);
  renderLeanAudit(prob);
}

function renderNamingHall() {
  const cards = stateLedger.naming_registry.map(item => {
    const cls = item.kind === "THEOREM_LEAD" ? "lead" : (item.kind === "COUNTEREXAMPLE" ? "counterexample" : "");
    const kindBadge = item.kind === "THEOREM_LEAD"
      ? `<span class="pill-amber">👑 THEOREM LEAD</span>`
      : (item.kind === "COUNTEREXAMPLE"
        ? `<span class="pill-rose">⚡ COUNTEREXAMPLE</span>`
        : `<span class="pill-violet">◆ LEMMA RIGHT</span>`);
    const stBadge = item.status === "FINALIZED"
      ? `<span class="pill-emerald">FINALIZED</span>`
      : `<span class="pill-muted">PROVISIONAL</span>`;
    const pTitle = lang === "zh" ? item.problem_title_zh : item.problem_title;

    return `
      <div class="cert-card ${cls}">
        <div>
          <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px">
            ${kindBadge}
            ${stBadge}
          </div>
          <div class="cert-title">${escapeHtml(item.title)}</div>
          <div class="muted-sm" style="margin-top:4px">${escapeHtml(item.problem_id)} · ${escapeHtml(pTitle)}</div>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span class="cert-holder">${escapeHtml(item.holder)}</span>
            <span class="mono" style="font-size:12px">${item.credit} pts (${item.share_pct}%)</span>
          </div>
          <div class="cert-hash">Attestation: ${escapeHtml(item.certificate_hash.slice(0, 38))}…</div>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("naming-cards").innerHTML = cards;

  const glbRows = stateLedger.global_leaderboard.map((a, idx) => `
    <tr>
      <td class="mono">#${idx + 1}</td>
      <td><strong>${escapeHtml(a.agent)}</strong></td>
      <td class="mono" style="color:var(--emerald);font-weight:700">${a.total_credit}</td>
      <td class="mono">${a.proof_work}</td>
      <td class="mono" style="color:var(--cyan)">+${a.royalties}</td>
      <td class="mono" style="color:var(--violet)">+${a.hygiene}</td>
      <td class="mono">${a.verified_nodes}</td>
      <td class="mono">👑 ${a.lead_naming_rights} · ◆ ${a.lemma_naming_rights} · ⚡ ${a.counterexamples}</td>
    </tr>
  `).join("");

  document.getElementById("global-leaderboard").innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Agent</th>
          <th>Total Credit</th>
          <th>Proof Work</th>
          <th>Royalties</th>
          <th>Hygiene</th>
          <th>Verified Nodes</th>
          <th>Naming Rights (Lead · Lemma · Refute)</th>
        </tr>
      </thead>
      <tbody>${glbRows}</tbody>
    </table>
  `;
}

function renderLedgerView() {
  document.getElementById("comparison-body").innerHTML = COMPARISON_ROWS.map(([d, b, p]) => `
    <tr>
      <td><strong>${escapeHtml(d)}</strong></td>
      <td class="muted">${escapeHtml(b)}</td>
      <td style="color:#e0f2fe">${escapeHtml(p)}</td>
    </tr>
  `).join("");

  document.getElementById("blocks-list").innerHTML = stateLedger.blocks.map(b => `
    <div class="block-item">
      <div>
        <div class="block-height">#${b.height}</div>
        <span class="pill-muted">${escapeHtml(b.type)}</span>
      </div>
      <div class="block-hashes">
        <div><strong>Block Hash:</strong> <span style="color:var(--cyan)">${escapeHtml(b.block_hash)}</span></div>
        <div><strong>Prev Hash :</strong> ${escapeHtml(b.prev_hash)}</div>
        ${b.problem_id ? `<div><strong>Problem   :</strong> ${escapeHtml(b.problem_id)} · Lead: <span style="color:var(--emerald)">${escapeHtml(b.lead_agent || "-")}</span> · Min DAG: ${b.minimal_dag_size} nodes</div>` : `<div>${escapeHtml(b.message)}</div>`}
      </div>
      <div class="mono muted-sm">${escapeHtml((b.timestamp || "").replace("T", " ").replace("Z", " UTC"))}</div>
    </div>
  `).join("");
}

// =========================================================================
// Simulator Logic
// =========================================================================
function updateReproveDisplay() {
  const val = Number(document.getElementById("sim-reprove").value);
  const w = counterfactualWork(val, 0.7).toFixed(2);
  document.getElementById("sim-reprove-val").textContent = `${val.toFixed(3)} (W ≈ ${w})`;
}

function loadPreset(key) {
  const p = SIM_PRESETS[key];
  if (!p) return;
  document.getElementById("sim-agent").value = p.agent;
  document.getElementById("sim-target").value = p.target;
  document.getElementById("sim-reprove").value = p.reprove;
  document.getElementById("sim-title").value = p.title;
  document.getElementById("sim-code").value = p.code;
  updateReproveDisplay();
  simSession = { audited: false, auditReport: null, commitment: null, salt: null };
  setSimStatus("READY", "pill-muted");
}

function setSimStatus(text, cls) {
  const pill = document.getElementById("sim-status-pill");
  pill.textContent = text;
  pill.className = cls;
}

function appendSimLog(html, cls = "") {
  const out = document.getElementById("sim-output");
  if (out.querySelector("p.muted")) out.innerHTML = "";
  const div = document.createElement("div");
  div.className = `log-card ${cls}`;
  div.innerHTML = html;
  out.prepend(div);
}

async function handleAudit() {
  const code = document.getElementById("sim-code").value;
  const report = auditLeanClient(code);
  simSession.audited = report.passed;
  simSession.auditReport = report;
  simSession.commitment = null;

  if (report.passed) {
    setSimStatus("AUDIT PASS ✓", "pill-emerald");
    appendSimLog(`
      <strong>① Lean 4 Axiom & Soundness Audit PASSED ✓</strong>
      <div class="muted-sm mono">AST Tokens: ${report.tokens} · 0 sorry · 0 custom axioms · 0 unsafe bypasses</div>
    `, "ok");
  } else {
    setSimStatus("AUDIT REJECTED ✗", "pill-rose");
    const list = report.findings.map(f => `<li><code>[${f.code}]</code> ${escapeHtml(f.msg)}</li>`).join("");
    appendSimLog(`
      <strong>① Soundness Audit REJECTED ✗</strong>
      <ul style="margin:6px 0 0 18px;padding:0;color:#fda4af">${list}</ul>
    `, "err");
  }
}

async function handleCommit() {
  if (!simSession.audited) {
    await handleAudit();
    if (!simSession.audited) return;
  }
  const agent = document.getElementById("sim-agent").value.trim() || "Anon-Agent";
  const [pid, nid] = document.getElementById("sim-target").value.split("|");
  const salt = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
  const payload = `${pid}|${nid}|${agent}|${salt}|${simSession.auditReport.normalized}`;
  const hash = await sha256Hex(payload);

  simSession.salt = salt;
  simSession.commitment = hash;
  setSimStatus("COMMITTED (EPOCH t)", "pill-cyan");
  appendSimLog(`
    <strong>② Commit-Reveal Locked (Anti-MEV Priority)</strong>
    <div class="mono muted-sm" style="word-break:break-all">
      Target: ${pid}/${nid} · Agent: ${escapeHtml(agent)}<br/>
      Salt  : ${salt}<br/>
      SHA256: <span style="color:var(--cyan)">${hash}</span>
    </div>
  `);
}

async function handleReveal() {
  if (!simSession.commitment) {
    await handleCommit();
    if (!simSession.commitment) return;
  }
  const agent = document.getElementById("sim-agent").value.trim() || "Anon-Agent";
  const [pid, nid, txType] = document.getElementById("sim-target").value.split("|");
  const reprove = Number(document.getElementById("sim-reprove").value);
  const title = document.getElementById("sim-title").value.trim() || `${agent} Contribution`;
  const code = document.getElementById("sim-code").value;

  const prob = stateLedger.problems.find(p => p.id === pid);
  const node = prob && prob.nodes.find(n => n.id === nid);
  if (!prob || !node) return;

  if (txType === "GOLF") {
    node.status = "pruned";
    node.pruned_by = agent;
    node.prune_reason = `Pruned live via Proof Golfing Challenge by ${agent}! BloatedProver-v1 credit zeroed.`;
    node.prune_reason_zh = `由 ${agent} 在简化挑战期发起 Proof Golfing 剪枝，BloatedProver-v1 主分归零并释放剪枝赏金！`;
    // Remove dependency on S3 from S4 and MAIN so minimal DAG stays valid!
    prob.nodes.forEach(n => {
      n.deps = (n.deps || []).filter(d => d !== nid);
    });
  } else {
    node.status = "verified";
    node.author = agent;
    node.tx_type = "PROVE";
    node.baseline_reprove_rate = reprove;
    node.novelty_score = 0.72;
    node.named_title = title;
    node.label = title;
    node.label_zh = title;
    node.lean_code = code;
    node.commitment_hash = simSession.commitment;
    node.salt = simSession.salt;
  }

  // Append a live Proof Block
  const newHeight = stateLedger.stats.chain_height + 1;
  const newBlockHash = await sha256Hex(`${stateLedger.stats.chain_tip}|${pid}|${nid}|${agent}|${Date.now()}`);
  stateLedger.stats.chain_height = newHeight;
  stateLedger.stats.chain_tip = newBlockHash;
  prob.block_hash = newBlockHash;

  rebuildGlobalState();

  const updatedLead = prob.scoring.naming_rights.lead;
  const agentRow = prob.scoring.leaderboard.find(r => r.agent === agent);

  stateLedger.blocks.unshift({
    height: newHeight,
    type: `LIVE_${txType}`,
    problem_id: pid,
    timestamp: new Date().toISOString().slice(0, 19) + "Z",
    prev_hash: stateLedger.blocks[0].block_hash,
    block_hash: newBlockHash,
    minimal_dag_size: prob.scoring.minimal_dag_nodes.length,
    lead_agent: updatedLead ? updatedLead.holder : agent,
  });

  setSimStatus("SETTLED ON DAG ✓", "pill-emerald");
  appendSimLog(`
    <strong>③ Reveal Verified & Proof DAG Recomputed! (Block #${newHeight})</strong>
    <div style="margin-top:6px">
      <strong>${escapeHtml(agent)}</strong> earned <strong style="color:var(--emerald)">+${agentRow ? agentRow.total_credit : 0} pts</strong> on <strong>${pid}</strong>!<br/>
      Current Lead Naming Holder on ${pid}: <strong style="color:var(--violet)">👑 ${escapeHtml(updatedLead ? updatedLead.holder : "-")} (${updatedLead ? updatedLead.credit : 0} pts)</strong>
    </div>
    <div style="margin-top:8px">
      <button class="btn-chip" id="jump-to-dag-btn">View Updated Proof DAG (${pid}) →</button>
    </div>
  `, "ok");

  renderAll();
  const jumpBtn = document.getElementById("jump-to-dag-btn");
  if (jumpBtn) {
    jumpBtn.addEventListener("click", () => {
      selectedProblemId = pid;
      selectedNodeId = nid;
      switchTab("workspace");
      renderWorkspace();
    });
  }
}

// =========================================================================
// Navigation & Bootstrap
// =========================================================================
function switchTab(tabName) {
  document.querySelectorAll(".nav-tab").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-view").forEach(v => {
    v.classList.toggle("active", v.id === `view-${tabName}`);
  });
}

function renderAll() {
  applyI18n();
  renderWorkspace();
  renderNamingHall();
  renderLedgerView();
}

async function init() {
  const res = await fetch("data/ledger.json");
  initialLedger = await res.json();
  stateLedger = JSON.parse(JSON.stringify(initialLedger));

  // Tab bindings
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Language toggle
  document.getElementById("lang-toggle").addEventListener("click", () => {
    lang = lang === "zh" ? "en" : "zh";
    renderAll();
  });

  // Simulator controls
  document.getElementById("sim-reprove").addEventListener("input", updateReproveDisplay);
  document.getElementById("preset-valid").addEventListener("click", () => loadPreset("valid"));
  document.getElementById("preset-golf").addEventListener("click", () => loadPreset("golf"));
  document.getElementById("preset-cheat-sorry").addEventListener("click", () => loadPreset("sorry"));
  document.getElementById("preset-cheat-axiom").addEventListener("click", () => loadPreset("axiom"));
  document.getElementById("btn-audit").addEventListener("click", handleAudit);
  document.getElementById("btn-commit").addEventListener("click", handleCommit);
  document.getElementById("btn-reveal").addEventListener("click", handleReveal);
  document.getElementById("sim-reset-btn").addEventListener("click", () => {
    stateLedger = JSON.parse(JSON.stringify(initialLedger));
    document.getElementById("sim-output").innerHTML = `<p class="muted">${t("sim_placeholder")}</p>`;
    loadPreset("valid");
    renderAll();
  });

  loadPreset("valid");
  renderAll();
}

init().catch(err => {
  console.error(err);
  document.body.innerHTML = `<div style="padding:40px;color:#fda4af;font-family:monospace">Failed to load ledger.json: ${escapeHtml(err.message)}</div>`;
});
