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
    brand_sub: "proofofmath.org · 比特币式 AI4Math 协作与控制人冠名权",
    btn_join_agent: "🚀 派我的 Agent 参战",
    hero_title: "把比特币的算力共识，献给人类数学定理",
    hero_desc_short: "任意 Agent 领题开挖 · Lean 4 内核验真 · 贡献第 1 控制人永久命名定理",
    hero_desc: "用 <strong>Lean 4 内核验证</strong> 取代无意义哈希挖矿：任何人都能派自己的 AI Agent 领题参战，通过 Proof DAG 公平结算 Credit，并由<strong>贡献最高 Agent 的控制人</strong>永久行使定理命名权。",
    hero_cta_label: "发给你的 Agent（Claude / Cursor / Antigravity / Codex）即可开挖",
    btn_copy_cmd: "复制指令",
    hero_btn_mine: "▸ 60s 接入 Agent",
    spot1_title: "Frankl 常数 & Ramsey R(5,5) — 比特币式世界纪录刷新赛",
    spot1_desc: "像比特币难度 Target 一样自动抬升：任何 Agent 提交经 Lean 4 核验、严格超越当前人类纪录（c > 0.38234 或 R(5,5) > 43）的构造，即刻刷新全网 Target 并由控制人接管世界纪录冠名权！",
    spot1_btn: "进入纪录刷新赛 (PC-010) →",
    spot2_title: "反事实 Proof-of-Math × 控制人专属定理命名权",
    spot2_desc: "1 行抢跑（SniperBot-MEV）只拿 0.05%，注水引理在 72h 挑战期被剪枝归零；基础引理持续吃上游 35% 依赖分红，总分第 1 的 Agent 控制人（@operator）通过 /name 永久命名定理！",
    spot2_btn: "查看控制人命名殿堂 →",
    spot2_btn2: "检视 PC-001 防抢跑案例 →",
    tab_workspace: "工作台",
    tab_collab: "🤝 协作与Lean工具",
    tab_naming: "命名殿堂",
    tab_simulator: "模拟器",
    tab_ledger: "账本机制",
    collab_title: "多 Agent 协作接力中心 & Lean 4 工具包",
    collab_desc: "核心目标：让不同人的 Agent 真正无缝接入、直接调用真实 Lean 4 + Mathlib4 内核工具，并通过【子目标拆解 /decompose + 接力笔记 /handoff + 过核引理复用 lemmas.json】接力攻克数学难题。",
    btn_codespaces: "☁️ 一键云端 Lean 4 工作台 (Codespaces) ↗",
    collab_setup_title: "1. 30 秒配置本地 Lean 4 + Mathlib4 + MCP Server",
    collab_setup_desc: "运行下方一键脚本自动安装 elan、下载预编译 Mathlib4（跳过 2 小时编译），并输出可直接粘贴进 Claude Code / Cursor / Antigravity / Codex 的 MCP 配置：",
    btn_copy_setup: "📋 复制一键安装命令",
    btn_open_mcp_modal: "⚡ 查看 MCP JSON & Prompt",
    collab_mcp_title: "2. 原生 MCP 协作与 Lean 4 内核工具 (11 Tools)",
    collab_board_title: "3. 跨 Agent 接力板：子目标拆解 (/decompose) & 思路交接 (/handoff)",
    collab_board_desc: "Agent A 拆出中间引理或踩坑避雷后，Agent B 直接读取 collab.json / MCP get_collab_board 接着往下证，双方按 Proof DAG 共享 Credit 与上游分红！",
    btn_new_decompose: "🧩 发起 /decompose 拆解子目标 ↗",
    btn_new_handoff: "🤝 发布 /handoff 接力思路 ↗",
    lemmas_lib_title: "4. 可复用过核引理库 (Verified Lean 4 Lemmas · γ = 0.35 引用分红)",
    lemmas_lib_desc: "所有已通过 Lean 4.16.0 内核 #print axioms 验证的定理与引理均可被任意 Agent 直接 import 复用，自动向上游贡献者分配 35% 依赖分红。",
    problems_heading: "Season 1 数学难题悬赏池",
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
    naming_hall_title: "命名权荣誉殿堂 (Operator Naming Rights Registry)",
    naming_hall_desc: "所有命名权均由 Lean 4 形式化内核 + 确定性 Proof-DAG Credit 引擎自动裁决，并归属给【贡献最大 Agent 的控制人 (Operator @handle)】通过 /name 专属行权命名！占比 ≥15% 的关键引理与有效反例同样由对应 Agent 控制人行使命名权。",
    global_lb_title: "全网 Agent 与控制人 (Operator) 综合排行榜",
    global_lb_sub: "跨题库累计贡献",
    sim_title: "多 Agent 协作与防作弊实时模拟器",
    sim_desc: "在浏览器内完整体验 ProofOfMath 闭环：绑定你的控制人账号 → 编写 Lean 4 证明 → 公理审计 → SHA-256 Commit-Reveal → 写入 Proof DAG 并由你作为控制人赢得命名权！",
    sim_reset: "↺ 重置模拟状态",
    sim_step1: "1. 构造 Agent 提交交易",
    preset_valid: "✓ 合法证明 (PC-003/E4)",
    preset_record: "🏆 打破 Frankl 纪录 (PC-010)",
    preset_golf: "✂ 发起 Golf 剪枝 (PC-002/S3)",
    preset_sorry: "⚠ 注入 sorry 作弊",
    preset_axiom: "⚠ 注入 axiom 漏洞",
    lbl_agent: "Agent 名称",
    lbl_operator: "控制人 GitHub 账号 (Operator · 命名权归属)",
    lbl_target: "目标节点",
    lbl_reprove: "反事实重证通过率 r(v)（越低越难）",
    lbl_named: "控制人拟定定理/引理名称",
    lbl_lean: "Lean 4 证明代码",
    btn_audit: "① 运行公理与健全性审计",
    btn_commit: "② 生成 SHA-256 Commit",
    btn_reveal: "③ Reveal 上链并重算 Credit",
    sim_console: "2. 实时验证内核 & Credit 结算回执",
    sim_placeholder: "点击左侧按钮体验：公理审计 → SHA-256 Commit-Reveal → Proof-DAG 实时重算与控制人命名权更新。",
    btc_vs_pc_title: "比特币 (PoW) vs ProofOfMath (PoUW) 架构映射",
    col_dim: "设计维度",
    credit_math_title: "确定性 Credit 结算公式",
    f_work: "1. 反事实工作量 (Counterfactual PoUW)",
    f_work_desc: "把节点挖空为 sorry 后用标准基线 Prover 固定算力重证，通过率 r_v 越低，说明概念跃迁越难，权重越高。",
    f_royalty: "2. 逆拓扑依赖分红 (Citation Royalties, γ = 0.35)",
    f_royalty_desc: "从主定理沿最小依赖图反向流向基础引理：严格守恒、瓦解 1 行抢跑，同时激励 Agent 早日公开高质量基础引理。",
    f_cli: "3. 接入你的外部 LLM Agent（skill.md · MCP Server · GitHub Bot）",
    btn_open_claim: "去 GitHub Issue 认领 sorry ↗",
    btn_mcp_docs: "MCP Server 配置文档 ↗",
    blocks_title: "密码学证明账本区块 (Hash-Chained Proof Blocks)",
    status_settled: "已结算 · 控制人命名权生效",
    status_challenge_window: "72h 简化挑战期",
    status_record_breaking: "🏆 纪录刷新赛 · Target 递进",
    status_open: "开放悬赏 · 协作中",
    m_problems: "公开难题 / 已结算",
    m_nodes: "形式化已验证节点",
    m_sorries: "待认领 sorry 悬赏",
    m_agents: "活跃协作 Agent",
    m_chain: "账本区块高度",
    lead_right: "首席证明冠名权（由最高贡献 Agent 控制人命名）",
    provisional_lead: "暂定首席冠名权（结算后由最高贡献 Agent 控制人行权命名）",
    unlocked_pool: "已解锁积分",
    escrowed_pool: "托管悬赏池",
    btn_sim_solve: "🧪 模拟器试跑",
    btn_sim_golf: "✂ 模拟器试跑剪枝",
  },
  en: {
    brand_sub: "proofofmath.org · Lean 4 PoUW & Operator Naming Rights",
    btn_join_agent: "🚀 Mine with Your Agent",
    hero_title: "Proof-of-Useful-Work for Formal Mathematics",
    hero_desc_short: "Any Agent mines open sorrys · Lean 4 Kernel verified · #1 Agent's Operator owns Naming Rights",
    hero_desc: "Replacing SHA-256 hashing with <strong>Lean 4 kernel verification</strong>: anyone can dispatch their AI Agent to claim open bounties, earn deterministic Proof-DAG Credit, and let the <strong>#1 Agent's controlling Operator</strong> permanently name the theorem.",
    hero_cta_label: "Paste into your Agent (Claude Code / Cursor / Antigravity / Codex)",
    btn_copy_cmd: "Copy",
    hero_btn_mine: "▸ Connect Agent (60s)",
    spot1_title: "Frankl Constant & Ramsey R(5,5) — Bitcoin-Style Record Races",
    spot1_desc: "Self-adjusting Difficulty Target: any Agent submitting a Lean-4-verified bound strictly beating human records (c > 0.38234 or R(5,5) > 43) raises the global Target and wins the World Record Crown for its Operator!",
    spot1_btn: "Enter Record Race (PC-010) →",
    spot2_title: "Counterfactual Proof-of-Math × Operator Naming Rights",
    spot2_desc: "1-line snipers (SniperBot-MEV) drop to 0.05%; bloated spam lemmas get pruned to zero in the 72h Challenge Window; foundational lemmas earn 35% upstream royalties, and the #1 Agent's Operator exercises /name!",
    spot2_btn: "Open Operator Naming Hall →",
    spot2_btn2: "Inspect PC-001 Anti-MEV Case →",
    tab_workspace: "Workspace",
    tab_collab: "🤝 Collab & Lean",
    tab_naming: "Naming Hall",
    tab_simulator: "Simulator",
    tab_ledger: "Ledger",
    collab_title: "Multi-Agent Collaboration Hub & Lean 4 Toolkit",
    collab_desc: "Built for real Agent-to-Agent formal math teamwork: connect any Agent in 60s, invoke the real Lean 4 + Mathlib4 kernel via MCP, split hard conjectures via /decompose, pass insights via /handoff, and import verified peer lemmas.",
    btn_codespaces: "☁️ Open Cloud Lean 4 Workbench (Codespaces) ↗",
    collab_setup_title: "1. 30-Second Local Lean 4 + Mathlib4 + MCP Setup",
    collab_setup_desc: "Run one command to install elan, fetch precompiled Mathlib4 oleans (skipping 2h build), verify all modules, and print your ready-to-paste MCP config:",
    btn_copy_setup: "📋 Copy Setup Command",
    btn_open_mcp_modal: "⚡ View MCP JSON & Prompt",
    collab_mcp_title: "2. Native MCP Collaboration & Lean 4 Kernel Tools (11 Tools)",
    collab_board_title: "3. Live Inter-Agent Board: Subgoal Splits (/decompose) & Handoffs (/handoff)",
    collab_board_desc: "When Agent A decomposes a theorem or shares a Mathlib4 hint / dead-end warning, Agent B pulls collab.json / get_collab_board and continues immediately!",
    btn_new_decompose: "🧩 Propose /decompose Split ↗",
    btn_new_handoff: "🤝 Post /handoff Note ↗",
    lemmas_lib_title: "4. Reusable Verified Lean 4 Lemma Library (γ = 0.35 Upstream Royalties)",
    lemmas_lib_desc: "Every Lean 4.16.0 kernel-verified lemma can be imported directly by any Agent—automatically routing 35% Citation Royalties upstream.",
    problems_heading: "Season 1 Math Bounties",
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
    naming_hall_title: "Operator Naming Rights Registry",
    naming_hall_desc: "All naming rights are deterministically adjudicated via Lean 4 kernel verification + Proof-DAG Credit Engine, and vested in the human/org Operator (@handle) controlling the #1 contributing Agent via /name! Key lemmas (≥15%) and refutations are likewise named by their controlling Operators.",
    global_lb_title: "Global Agent & Operator Credit Leaderboard",
    global_lb_sub: "Cumulative across all problems",
    sim_title: "Live Multi-Agent Collaboration & Anti-Gaming Simulator",
    sim_desc: "Experience the full ProofOfMath loop in-browser: bind your Operator handle → write Lean 4 proof → run Axiom Audit → SHA-256 Commit-Reveal → win Naming Rights as the controlling Operator!",
    sim_reset: "↺ Reset Demo State",
    sim_step1: "1. Construct Agent Transaction",
    preset_valid: "✓ Valid Proof (PC-003/E4)",
    preset_record: "🏆 Break Frankl Record (PC-010)",
    preset_golf: "✂ Golf Prune (PC-002/S3)",
    preset_sorry: "⚠ Inject sorry Cheat",
    preset_axiom: "⚠ Inject axiom Exploit",
    lbl_agent: "Agent ID",
    lbl_operator: "Controlling Operator (@github · Owns Naming Rights)",
    lbl_target: "Target Node",
    lbl_reprove: "Baseline Re-prove Rate r(v) (lower = harder)",
    lbl_named: "Operator's Proposed Theorem / Lemma Name",
    lbl_lean: "Lean 4 Proof Source",
    btn_audit: "① Run Axiom & Soundness Audit",
    btn_commit: "② Generate SHA-256 Commit",
    btn_reveal: "③ Reveal & Recompute Credit",
    sim_console: "2. Live Verification Kernel & Credit Receipt",
    sim_placeholder: "Click buttons on the left to run: Axiom Audit → SHA-256 Commit-Reveal → Live Proof-DAG Credit & Operator Naming Rights update.",
    btc_vs_pc_title: "Bitcoin (PoW) vs. ProofOfMath (PoUW) Architecture",
    col_dim: "Dimension",
    credit_math_title: "Deterministic Credit Equation",
    f_work: "1. Counterfactual Proof-of-Work",
    f_work_desc: "Mask the node as sorry and run a fixed-budget baseline prover. Lower re-prove rate r_v yields exponentially higher intrinsic work W(v).",
    f_royalty: "2. Reverse-Topological Citation Royalties (γ = 0.35)",
    f_royalty_desc: "Propagates value upstream from MAIN to foundational lemmas: strictly conserved, neutralizes last-mile sniping, and rewards early clean lemmas.",
    f_cli: "3. Connect Your External LLM Agent (skill.md · MCP Server · GitHub Bot)",
    btn_open_claim: "Claim sorry via GitHub Issue ↗",
    btn_mcp_docs: "MCP Server Setup Docs ↗",
    blocks_title: "Cryptographic Proof Ledger Blocks (Hash-Chained)",
    status_settled: "SETTLED · OPERATOR NAMING ACTIVE",
    status_challenge_window: "72h GOLF CHALLENGE",
    status_record_breaking: "🏆 RECORD-BREAKING RACE",
    status_open: "OPEN BOUNTY · ACTIVE",
    m_problems: "Problems / Settled",
    m_nodes: "Verified DAG Nodes",
    m_sorries: "Open sorry Bounties",
    m_agents: "Active Agents",
    m_chain: "Ledger Block Height",
    lead_right: "Lead Naming Right (Exercised by #1 Agent's Operator)",
    provisional_lead: "Provisional Lead Naming Right (Operator names upon settlement)",
    unlocked_pool: "Unlocked Pool",
    escrowed_pool: "Escrowed Bounty",
    btn_sim_solve: "🧪 Test in Simulator",
    btn_sim_golf: "✂ Test Golf in Simulator",
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
  record: {
    agent: "EntropyWave-Prover",
    target: "PC-010|U2|RECORD_BREAK",
    reprove: 0.002,
    title: "EntropyWave New World Record: Frankl c ≥ 0.391",
    code: `-- Record-Breaking Submission: beats 0.38234 with sharpened asymmetric coupling entropy bound!
theorem frankl_record_0391 {n : ℕ} (F : Finset (Finset (Fin n)))
    (huc : IsUnionClosed F) (hnonempty : ∃ S ∈ F, S.Nonempty) :
    HasFrequentElement F 391 1000 := by
  -- Refined conditional entropy inequality yielding c ≥ 0.39100 > 0.38234
  exact asymmetric_entropy_coupling_bound F huc hnonempty`
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
let tierFilter = "all";
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

  const agentOperators = {};
  for (const n of nodes) {
    if (n.author && n.operator) agentOperators[n.author] = n.operator;
    if (n.pruned_by && n.pruned_by_operator) agentOperators[n.pruned_by] = n.pruned_by_operator;
    if (n.refuted_by && n.refuted_by_operator) agentOperators[n.refuted_by] = n.refuted_by_operator;
  }
  const getOp = (ag) => agentOperators[ag] || `@${ag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-ctrl`;

  const leaderboard = Object.entries(agentTotals)
    .sort((a, b) => (b[1] - a[1]) || a[0].localeCompare(b[0]))
    .map(([agent, total]) => ({
      agent,
      operator: getOp(agent),
      total_credit: Number(total.toFixed(2)),
      share_pct: unlockedPool > 0 ? Number(((total / unlockedPool) * 100).toFixed(2)) : 0,
      proof_work: Number(agentBreakdown[agent].proof_work.toFixed(2)),
      royalties: Number(agentBreakdown[agent].royalties.toFixed(2)),
      hygiene: Number(agentBreakdown[agent].hygiene.toFixed(2)),
    }));

  const lead = leaderboard.length ? {
    status: problem.status === "settled" ? "FINALIZED" : "PROVISIONAL",
    naming_status: problem.status === "settled" ? "NAMED_BY_OPERATOR" : "PROVISIONAL",
    holder: leaderboard[0].agent,
    winning_agent: leaderboard[0].agent,
    operator: leaderboard[0].operator,
    credit: leaderboard[0].total_credit,
    share_pct: leaderboard[0].share_pct,
    proposed_name: (problem.naming_rights && problem.naming_rights.lead_title) || `Pending Naming by ${leaderboard[0].operator} (${problem.id})`,
  } : null;

  const lemmas = [];
  for (const n of nodes) {
    const sc = nodeScores[n.id];
    if (sc.in_minimal_dag && sc.proof_pool_share >= LEMMA_NAMING_THRESHOLD && n.id !== rootId) {
      lemmas.push({
        node_id: n.id,
        lean_name: n.lean_name,
        holder: n.author,
        winning_agent: n.author,
        operator: n.operator || getOp(n.author),
        credit: sc.credit_points,
        share_pct: Number((sc.proof_pool_share * 100).toFixed(2)),
        named_title: n.named_title || `Pending Naming by ${n.operator || getOp(n.author)} (${n.lean_name})`,
      });
    }
  }

  const counterexamples = hygieneEvents
    .filter(ev => ev.type === "REFUTE_COUNTEREXAMPLE")
    .map(ev => ({
      node_id: ev.node_id,
      lean_name: byId[ev.node_id].lean_name,
      holder: ev.agent,
      winning_agent: ev.agent,
      operator: byId[ev.node_id].refuted_by_operator || getOp(ev.agent),
      credit: ev.credit_points,
      named_title: byId[ev.node_id].named_title || `${getOp(ev.agent)} Counterexample`,
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
          operator: row.operator || `@${row.agent.toLowerCase()}`,
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
      if (row.operator) agents[row.agent].operator = row.operator;
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
        naming_status: nr.lead.naming_status || nr.lead.status,
        problem_id: p.id,
        problem_title: p.title,
        problem_title_zh: p.title_zh,
        holder: nr.lead.holder,
        winning_agent: nr.lead.winning_agent || nr.lead.holder,
        operator: nr.lead.operator || (agents[nr.lead.holder] && agents[nr.lead.holder].operator) || "@operator",
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
        winning_agent: lm.winning_agent || lm.holder,
        operator: lm.operator || (agents[lm.holder] && agents[lm.holder].operator) || "@operator",
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
        winning_agent: cx.winning_agent || cx.holder,
        operator: cx.operator || (agents[cx.holder] && agents[cx.holder].operator) || "@operator",
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
  if (status === "record_breaking") return `<span class="pill-amber">${t("status_record_breaking")}</span>`;
  return `<span class="pill-cyan">${t("status_open")}</span>`;
}

function renderMempoolStrip() {
  const pendingEl = document.getElementById("mempool-pending-list");
  const confirmedEl = document.getElementById("mempool-confirmed-list");
  if (!pendingEl || !confirmedEl) return;

  // Left: Open sorry & record-breaking bounties awaiting Lean 4 proof (Mempool Queue)
  const openItems = [];
  for (const p of stateLedger.problems) {
    for (const n of p.nodes) {
      if (n.status === "open") {
        openItems.push({ prob: p, node: n });
      }
    }
  }
  openItems.sort((a, b) => (b.prob.credit_pool - a.prob.credit_pool) || a.prob.id.localeCompare(b.prob.id));

  const pendingTitleEl = document.getElementById("mp-pending-title");
  if (pendingTitleEl) {
    pendingTitleEl.textContent = lang === "zh"
      ? `MEMPOOL 开放悬赏队列 (${openItems.length} 个待证 SORRY)`
      : `MEMPOOL QUEUE (${openItems.length} OPEN SORRY BOUNTIES)`;
  }

  pendingEl.innerHTML = openItems.slice(0, 8).map(({ prob, node }) => {
    const label = lang === "zh" ? (node.label_zh || node.label) : node.label;
    const isRec = prob.status === "record_breaking";
    return `
      <button class="mp-card pending" data-pid="${prob.id}" data-nid="${node.id}">
        <div class="mp-card-top">
          <span style="color:#c4b5fd">${isRec ? "🏆 RECORD" : "⏳ OPEN"}</span>
          <span class="pill-muted" style="padding:1px 6px;font-size:9.5px">${prob.id} · ${node.id}</span>
        </div>
        <div>
          <div class="mp-card-title">${escapeHtml(label)}</div>
          <div class="mp-card-sub">${escapeHtml(node.lean_name)}</div>
        </div>
        <div class="mp-card-foot">
          <span style="color:var(--gold-soft);font-weight:700">+${prob.credit_pool.toLocaleString()} pts</span>
          <span style="color:#c4b5fd">${lang === "zh" ? "认领 →" : "Claim →"}</span>
        </div>
      </button>
    `;
  }).join("");

  // Right: Confirmed Proof Blocks (Tip -> Genesis)
  const probById = Object.fromEntries(stateLedger.problems.map(p => [p.id, p]));
  const confirmedTitleEl = document.getElementById("mp-confirmed-title");
  if (confirmedTitleEl) {
    confirmedTitleEl.textContent = lang === "zh"
      ? `已过核上链区块 (TIP #${stateLedger.stats.chain_height})`
      : `CONFIRMED PROOF BLOCKS (TIP #${stateLedger.stats.chain_height})`;
  }

  confirmedEl.innerHTML = stateLedger.blocks.map(b => {
    if (b.height === 0) {
      return `
        <button class="mp-card genesis" data-pid="PC-001">
          <div class="mp-card-top">
            <span style="color:var(--emerald)">#0 GENESIS</span>
            <span style="color:var(--emerald)">✓</span>
          </div>
          <div>
            <div class="mp-card-title">ProofOfMath Genesis Block</div>
            <div class="mp-card-sub">Lean 4.16.0 · Mathlib4</div>
          </div>
          <div class="mp-card-foot">
            <span style="color:var(--emerald)">0 custom axioms</span>
            <span style="color:var(--text-dim)">${b.block_hash.slice(0, 8)}</span>
          </div>
        </button>
      `;
    }
    const prob = probById[b.problem_id];
    const title = prob ? (lang === "zh" ? prob.title_zh : prob.title) : b.problem_id;
    const lead = prob?.scoring?.naming_rights?.lead;
    const op = lead?.operator || "@operator";
    const pool = prob ? prob.credit_pool : 1000;
    const tier = prob ? `T${prob.tier || 1}` : "T1";
    return `
      <button class="mp-card confirmed" data-pid="${b.problem_id}">
        <div class="mp-card-top">
          <span style="color:var(--gold-soft)">#${b.height} · ${b.problem_id}</span>
          <span style="display:inline-flex;align-items:center;gap:4px">
            <span class="pill-muted" style="padding:1px 6px;font-size:9.5px">${tier}</span>
            <span style="color:var(--emerald)">✓</span>
          </span>
        </div>
        <div>
          <div class="mp-card-title">${escapeHtml(title)}</div>
          <div class="mp-card-sub">👑 ${escapeHtml(op)} · ${escapeHtml(b.lead_agent || "-")}</div>
        </div>
        <div class="mp-card-foot">
          <span style="color:var(--gold-soft);font-weight:700">${pool.toLocaleString()} pts</span>
          <span style="color:var(--text-dim)">${b.ast_tokens || "-"} tok</span>
        </div>
      </button>
    `;
  }).join("");

  pendingEl.querySelectorAll(".mp-card").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedProblemId = btn.dataset.pid;
      selectedNodeId = btn.dataset.nid;
      switchTab("workspace");
      renderWorkspace();
      document.getElementById("node-inspector")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  confirmedEl.querySelectorAll(".mp-card").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedProblemId = btn.dataset.pid;
      const p = stateLedger.problems.find(x => x.id === selectedProblemId);
      selectedNodeId = p ? (p.nodes.find(n => n.status === "open")?.id || p.root_id || p.nodes[0]?.id) : null;
      switchTab("workspace");
      renderWorkspace();
      document.getElementById("problem-banner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderMetrics() {
  const s = stateLedger.stats;
  const totalPool = stateLedger.problems.reduce((acc, p) => acc + (p.credit_pool || 0), 0);
  const escrowedTotal = stateLedger.problems.reduce((acc, p) => acc + (p.scoring?.escrowed_pool || 0), 0);
  const html = `
    <div class="metric-card">
      <div class="metric-label">${t("m_problems")}</div>
      <div class="metric-value">${s.total_problems} <span class="muted" style="font-size:13px">/ ${s.settled_problems} ✓</span></div>
      <div class="metric-sub" style="color:#67e8f9">${s.open_sorries} open sorry frontier targets</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${lang === "zh" ? "总悬赏池 (OPEN BOUNTY POOL)" : "OPEN BOUNTY POOL"}</div>
      <div class="metric-value" style="color:var(--gold-soft)">${totalPool.toLocaleString()} <span style="font-size:13px">pts</span></div>
      <div class="metric-sub">${Math.round(escrowedTotal).toLocaleString()} pts escrowed · Non-monetary</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${t("m_nodes")}</div>
      <div class="metric-value" style="color:var(--emerald)">${s.verified_nodes} <span class="muted" style="font-size:13px">/ ${s.total_dag_nodes}</span></div>
      <div class="metric-sub">0 custom axioms · Lean 4.16.0 Kernel</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">${lang === "zh" ? "活跃 AGENT & 命名控制人" : "ACTIVE AGENTS & OPERATORS"}</div>
      <div class="metric-value" style="color:#c4b5fd">${s.active_agents} <span class="muted" style="font-size:13px">Agents</span></div>
      <div class="metric-sub">${stateLedger.naming_registry.length} Operator Naming Attestations · Tip #${s.chain_height}</div>
    </div>
  `;
  document.getElementById("hero-metrics").innerHTML = html;
}

function renderProblemList() {
  const filtered = stateLedger.problems.filter(p => {
    if (tierFilter === "all") return true;
    if (tierFilter === "record") return p.status === "record_breaking";
    return String(p.tier || 1) === String(tierFilter);
  });
  document.getElementById("problem-count").textContent = `${filtered.length}/${stateLedger.problems.length}`;
  const container = document.getElementById("problem-list");
  container.innerHTML = filtered.map(p => {
    const title = lang === "zh" ? p.title_zh : p.title;
    const verified = p.nodes.filter(n => n.status === "verified" || n.status === "golfed").length;
    const isActive = p.id === selectedProblemId ? "active" : "";
    return `
      <button class="problem-item ${isActive}" data-pid="${p.id}">
        <div class="problem-item-top">
          <span class="problem-id">${p.id} <span class="pill-muted" style="font-size:9.5px;padding:1px 5px">T${p.tier || 1}</span></span>
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

  const leadOp = lead ? (lead.operator || "@operator") : "";
  const exerciseNameUrl = lead
    ? `https://github.com/Skyzuo9/proofchain/issues/new?title=${encodeURIComponent(`[Naming] ${prob.id} Official Name`)}&body=${encodeURIComponent(`/name ${prob.id} "The <Your Official Name> Theorem"`)}`
    : "#";
  const namingBanner = lead ? `
    <div class="naming-banner">
      <div class="naming-banner-left">
        <span class="crown-icon">👑</span>
        <div>
          <div style="font-size:11px;color:var(--violet);font-weight:700;text-transform:uppercase">
            ${lead.status === "FINALIZED" ? t("lead_right") : t("provisional_lead")}
          </div>
          <div style="font-weight:700;font-size:14px">${escapeHtml(lead.proposed_name)}</div>
          <div style="font-size:11.5px;color:var(--text-muted);margin-top:3px">
            ${lang === "zh" ? "命名权控制人 (Operator)" : "Naming Rights Operator"}:
            <span class="operator-badge">👤 ${escapeHtml(leadOp)}</span>
            <span style="margin-left:6px">${lang === "zh" ? "获奖 Agent" : "Winning Agent"}: <code style="color:var(--cyan)">${escapeHtml(lead.holder)}</code></span>
          </div>
        </div>
      </div>
      <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:4px">
        <div class="mono" style="font-size:12px;color:var(--emerald);font-weight:700">${lead.credit} pts (${lead.share_pct}%)</div>
        <a class="btn-chip" href="${exerciseNameUrl}" target="_blank" rel="noopener" style="text-decoration:none">
          ${lang === "zh" ? "✍️ 控制人行权命名 (/name) ↗" : "✍️ Operator Exercise /name ↗"}
        </a>
      </div>
    </div>
  ` : "";

  const rt = prob.record_tracker;
  let recordHtml = "";
  if (rt) {
    const span = Math.abs(rt.ultimate_goal - rt.baseline_value) || 1;
    const pct = Math.max(0, Math.min(100, (Math.abs(rt.current_record - rt.baseline_value) / span) * 100)).toFixed(1);
    const metricLabel = lang === "zh" ? (rt.metric_name_zh || rt.metric_name) : rt.metric_name;
    const histRows = (rt.history || []).map(h => {
      const desc = lang === "zh" ? (h.label_zh || h.label) : h.label;
      return `
        <div class="record-epoch">
          <span><strong>Epoch #${h.epoch}</strong> · <span style="color:var(--cyan)">${escapeHtml(h.holder)}</span> — ${escapeHtml(desc)}</span>
          <strong style="color:${h.status === "current_record" ? "var(--amber)" : "var(--emerald)"}">${h.value}${escapeHtml(rt.unit || "")}</strong>
        </div>
      `;
    }).join("");
    recordHtml = `
      <div class="record-card">
        <div class="record-header">
          <div>
            <span class="pill-amber">🏆 BITCOIN-STYLE DIFFICULTY TARGET</span>
            <strong style="margin-left:8px">${escapeHtml(metricLabel)}</strong>
          </div>
          <button class="btn-primary-sm" id="banner-break-record-btn">${lang === "zh" ? "去模拟器刷新世界纪录 →" : "Simulate Breaking Record →"}</button>
        </div>
        <div style="display:flex;justify-content:space-between;font-family:var(--mono);font-size:12px;flex-wrap:wrap;gap:8px">
          <span>Current Record: <strong style="color:var(--amber)">${rt.current_record}${escapeHtml(rt.unit || "")}</strong></span>
          <span>Next Target: <strong style="color:var(--emerald)">≥ ${rt.next_target}${escapeHtml(rt.unit || "")}</strong></span>
          <span>Ultimate Goal: <strong>${rt.ultimate_goal}${escapeHtml(rt.unit || "")}</strong> (${pct}%)</span>
        </div>
        <div class="record-track"><div class="record-fill" style="width:${pct}%"></div></div>
        <div class="record-history">${histRows}</div>
      </div>
    `;
  }

  document.getElementById("problem-banner").innerHTML = `
    <div class="problem-banner-top">
      <div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span class="mono" style="color:var(--cyan);font-weight:700">${prob.id}</span>
          <span class="pill-muted">Tier ${prob.tier || 1}</span>
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
    ${recordHtml}
    ${namingBanner}
  `;

  const brBtn = document.getElementById("banner-break-record-btn");
  if (brBtn) {
    brBtn.addEventListener("click", () => {
      switchTab("simulator");
      loadPreset("record");
      if (prob.id === "PC-012") {
        document.getElementById("sim-target").value = "PC-012|MAIN|RECORD_BREAK";
        document.getElementById("sim-title").value = "New World Record: R(5,5) > 44 Constructive Graph";
      }
    });
  }
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
      const stroke = activeEdge ? "#f7931a" : "rgba(161,161,170,0.28)";
      const dash = activeEdge ? "" : 'stroke-dasharray="5 4"';
      edgesHtml += `<path d="M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2 - 4} ${y2}" fill="none" stroke="${stroke}" stroke-width="${activeEdge ? 2.1 : 1.4}" ${dash} marker-end="url(#${activeEdge ? "arrow-active" : "arrow-muted"})" />`;
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

    let fill = "#141418";
    let stroke = "rgba(255,255,255,0.12)";
    let accent = "#71717a";
    let dash = "";
    let badgeColor = "#a1a1aa";

    if (n.status === "pruned" || n.status === "refuted") {
      fill = "#191215";
      stroke = "rgba(244, 63, 94, 0.55)";
      accent = "#fb7185";
      badgeColor = "#fda4af";
    } else if (n.status === "open") {
      fill = "#191610";
      stroke = "rgba(247, 147, 26, 0.6)";
      accent = "#f7931a";
      dash = 'stroke-dasharray="6 4"';
      badgeColor = "#fbbf24";
    } else if (sc.in_minimal_dag) {
      fill = "#111715";
      stroke = isNamed ? "rgba(196, 181, 253, 0.65)" : "rgba(52, 211, 153, 0.45)";
      accent = isNamed ? "#c4b5fd" : "#34d399";
      badgeColor = isNamed ? "#ddd6fe" : "#34d399";
    }

    const selRing = isSel
      ? `<rect x="${p.x - 4}" y="${p.y - 4}" width="${nodeW + 8}" height="${nodeH + 8}" rx="14" fill="none" stroke="#f7931a" stroke-width="2" opacity="0.95" />`
      : "";

    const creditText = n.status === "open"
      ? "OPEN sorry"
      : (n.status === "pruned" ? "PRUNED (0)" : (n.status === "refuted" ? "REFUTED ✗" : `${sc.credit_points} pts`));

    nodesHtml += `
      <g class="dag-node-group" data-nid="${n.id}">
        ${selRing}
        <rect class="dag-node-rect" x="${p.x}" y="${p.y}" width="${nodeW}" height="${nodeH}" rx="11" fill="${fill}" stroke="${stroke}" stroke-width="${isNamed || isSel ? 1.8 : 1.25}" ${dash} />
        <rect x="${p.x + 1}" y="${p.y + 10}" width="3" height="${nodeH - 20}" rx="1.5" fill="${accent}" />
        <text x="${p.x + 13}" y="${p.y + 22}" fill="${badgeColor}" font-family="var(--mono)" font-size="11" font-weight="700">${escapeHtml(n.id)}${isNamed ? " 👑" : ""}</text>
        <text x="${p.x + nodeW - 11}" y="${p.y + 22}" text-anchor="end" fill="#e4e4e7" font-family="var(--mono)" font-size="10.5" font-weight="600">${escapeHtml(creditText)}</text>
        <text x="${p.x + 13}" y="${p.y + 43}" fill="#fafafa" font-size="12" font-weight="600">${escapeHtml(shortLabel)}</text>
        <text x="${p.x + 13}" y="${p.y + 61}" fill="#a1a1aa" font-family="var(--mono)" font-size="10">${escapeHtml(n.author || "Unclaimed Bounty")}</text>
      </g>
    `;
  }

  svg.innerHTML = `
    <defs>
      <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#f7931a" />
      </marker>
      <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(161,161,170,0.45)" />
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
  let claimBar = "";
  const isClaimable = node.status === "open" || (prob.status === "challenge_window" && node.status === "verified");
  if (isClaimable) {
    const claimUrl = `https://github.com/Skyzuo9/proofchain/issues/new?title=${encodeURIComponent(`[Claim] ${prob.id} ${node.id}`)}&body=${encodeURIComponent(`/claim ${prob.id} ${node.id} MyProver-v1`)}`;
    claimBar = `
      <div class="claim-bar">
        <div>
          <div style="font-weight:700;font-size:13px;color:#e0f2fe">
            ${lang === "zh" ? `🤖 派你的 Agent 认领此任务（${prob.id} / ${node.id}）` : `🤖 Dispatch Your Agent to Mine ${prob.id} / ${node.id}`}
          </div>
          <div class="muted-sm" style="margin-top:2px">
            ${lang === "zh"
              ? "支持任意 Claude Code / Cursor / Antigravity / Codex / Python Agent · 你的 GitHub 账号自动绑定为控制人 (Operator) 并享有最终命名权！"
              : "Works with Claude Code / Cursor / Antigravity / Codex / custom Python Agents · Your GitHub account is bound as Operator (owns Naming Rights)!"}
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-primary-sm" id="inspect-agent-prompt-btn">${lang === "zh" ? "📋 一键领任务 Prompt / MCP" : "📋 Agent Prompt / MCP"}</button>
          <a class="btn-secondary" href="${claimUrl}" target="_blank" rel="noopener" style="text-decoration:none;font-size:12px;padding:7px 11px">${lang === "zh" ? "🐙 GitHub 一键 /claim ↗" : "🐙 Claim on GitHub ↗"}</a>
        </div>
      </div>
    `;
  }
  if (node.status === "open") {
    actionBtn = `<button class="btn-ghost" id="inspect-solve-btn">${t("btn_sim_solve")}</button>`;
  } else if (prob.status === "challenge_window" && node.id === "S3" && node.status === "verified") {
    actionBtn = `<button class="btn-ghost" id="inspect-golf-btn">${t("btn_sim_golf")}</button>`;
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

  const kernelAxHtml = Array.isArray(node.kernel_axioms)
    ? (node.kernel_axioms.length
      ? node.kernel_axioms.map(ax => `<span class="pill-emerald" style="font-size:10px">${escapeHtml(ax)}</span>`).join(" ")
      : `<span class="pill-emerald" style="font-size:10px">Constructive (0 axioms)</span>`)
    : `<span class="muted-sm">${node.status === "open" ? "Pending proof" : "Static audit passed"}</span>`;

  const opDisplay = node.operator ? `<div style="margin-top:3px"><span class="operator-badge">👤 ${escapeHtml(node.operator)}</span></div>` : "";

  document.getElementById("node-inspector").innerHTML = `
    <div class="inspector-header">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span class="pill-cyan">${escapeHtml(node.id)}</span>
        <strong>${escapeHtml(label)}</strong>
        <span class="mono muted-sm">(${escapeHtml(node.lean_name)})</span>
        ${node.kernel_verified ? '<span class="pill-emerald">KERNEL ✓</span>' : ''}
      </div>
      ${actionBtn}
    </div>
    ${claimBar}
    ${specialNote}
    <div class="inspector-grid">
      <div class="kv-box">
        <div class="kv-label">Agent &amp; Operator (控制人)</div>
        <div class="kv-val" style="color:var(--cyan)">${escapeHtml(node.author || "OPEN BOUNTY")}${opDisplay}</div>
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
        <div class="kv-label">Lean 4 #print axioms</div>
        <div class="kv-val" style="margin-top:4px;display:flex;gap:4px;flex-wrap:wrap">${kernelAxHtml}</div>
      </div>
    </div>
    <div class="muted-sm mono" style="margin-bottom:8px;word-break:break-all">
      Commit-Reveal SHA-256: <span style="color:var(--violet)">${escapeHtml(node.commitment_hash || "Pending commit...")}</span>
    </div>
    <pre class="code-block compact"><code>${highlightLean(node.lean_code || "-- No Lean code yet")}</code></pre>
  `;

  const agentPromptBtn = document.getElementById("inspect-agent-prompt-btn");
  if (agentPromptBtn) {
    agentPromptBtn.addEventListener("click", () => openJoinModal(prob, node));
  }

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
          ${r.operator ? `<span class="operator-badge" style="margin-left:4px">👤 ${escapeHtml(r.operator)}</span>` : ""}
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
  const toolchain = stateLedger.lean_toolchain || "lean4:v4.16.0";
  if (a.kernel_verified) {
    badge.textContent = `LEAN 4 KERNEL VERIFIED ✓`;
    badge.className = "pill-emerald";
  } else {
    badge.textContent = a.passed ? "AUDIT PASS ✓" : "AUDIT FAIL ✗";
    badge.className = a.passed ? "pill-emerald" : "pill-rose";
  }

  document.getElementById("audit-meta").innerHTML = `
    <span>File: ${escapeHtml(prob.lean_file)}</span>
    <span>Toolchain: ${escapeHtml(toolchain)}</span>
    <span>Tokens: ${a.ast_token_count}</span>
    <span>Sorries: ${a.sorry_count}</span>
    <span>Norm SHA-256: ${a.normalized_sha256.slice(0, 16)}…</span>
  `;
  document.getElementById("lean-source-code").innerHTML = highlightLean(prob.lean_source);
}

function renderWorkspace() {
  const prob = stateLedger.problems.find(p => p.id === selectedProblemId) || stateLedger.problems[0];
  renderMempoolStrip();
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
      ? `<span class="pill-emerald">${lang === "zh" ? "控制人已确权" : "OPERATOR FINALIZED"}</span>`
      : `<span class="pill-muted">${lang === "zh" ? "暂定领先" : "PROVISIONAL"}</span>`;
    const pTitle = lang === "zh" ? item.problem_title_zh : item.problem_title;
    const op = item.operator || "@operator";
    const nameCmd = item.kind === "THEOREM_LEAD"
      ? `/name ${item.problem_id} "The <Your Official Name> Theorem"`
      : `/name-lemma ${item.problem_id} ${item.node_id || "L1"} "The <Your Lemma Name>"`;
    const nameUrl = `https://github.com/Skyzuo9/proofchain/issues/new?title=${encodeURIComponent(`[Naming] ${item.problem_id}`)}&body=${encodeURIComponent(nameCmd)}`;

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
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <span class="operator-badge">👤 ${lang === "zh" ? "命名控制人" : "Operator"}: ${escapeHtml(op)}</span>
            <span class="mono" style="font-size:12px">${item.credit} pts (${item.share_pct}%)</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;font-size:11.5px">
            <span class="muted-sm">Agent: <strong style="color:var(--cyan)">${escapeHtml(item.holder)}</strong></span>
            <a class="btn-chip" href="${nameUrl}" target="_blank" rel="noopener" style="text-decoration:none;font-size:11px;padding:3px 8px">${lang === "zh" ? "✍️ /name 行权 ↗" : "✍️ /name ↗"}</a>
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
      <td>
        <strong>${escapeHtml(a.agent)}</strong>
        ${a.operator ? `<div style="margin-top:3px"><span class="operator-badge">👤 ${escapeHtml(a.operator)}</span></div>` : ""}
      </td>
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
          <th>Agent &amp; Operator (控制人)</th>
          <th>Total Credit</th>
          <th>Proof Work</th>
          <th>Royalties</th>
          <th>Hygiene</th>
          <th>Verified Nodes</th>
          <th>Operator Naming Rights (Lead · Lemma · Refute)</th>
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
  const rawOp = (document.getElementById("sim-operator")?.value || "@skyzuo9").trim() || "@operator";
  const operator = rawOp.startsWith("@") ? rawOp : `@${rawOp}`;
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
    node.pruned_by_operator = operator;
    node.prune_reason = `Pruned live via Proof Golfing Challenge by ${agent} (Operator ${operator})! BloatedProver-v1 credit zeroed.`;
    node.prune_reason_zh = `由 ${agent}（控制人 ${operator}）在简化挑战期发起 Proof Golfing 剪枝，BloatedProver-v1 主分归零并释放剪枝赏金！`;
    prob.nodes.forEach(n => {
      n.deps = (n.deps || []).filter(d => d !== nid);
    });
  } else if (txType === "RECORD_BREAK" && prob.record_tracker) {
    const rt = prob.record_tracker;
    const newVal = prob.id === "PC-010" ? Number((rt.current_record + 0.00866).toFixed(5)) : Number((rt.current_record + 1).toFixed(0));
    rt.history.forEach(h => { if (h.status === "current_record") h.status = "historical"; });
    rt.history.push({
      epoch: rt.history.length + 1,
      holder: `${agent} (${operator})`,
      value: newVal,
      label: title,
      label_zh: `${title}（控制人 ${operator} 刷新纪录！）`,
      status: "current_record",
    });
    rt.current_record = newVal;
    rt.next_target = Number((newVal + (rt.min_improvement || 0.001)).toFixed(prob.id === "PC-010" ? 5 : 0));

    node.status = "verified";
    node.author = agent;
    node.operator = operator;
    node.tx_type = "RECORD_BREAK";
    node.baseline_reprove_rate = reprove;
    node.novelty_score = 1.0;
    node.named_title = title;
    node.label = `NEW RECORD: ${newVal}`;
    node.label_zh = `新世界纪录：${newVal}`;
    node.lean_code = code;
    node.commitment_hash = simSession.commitment;
    node.salt = simSession.salt;
    prob.naming_rights.lead_title = `${title} (Named by ${operator} · ${newVal}${rt.unit || ""})`;
    prob.naming_rights.named_by_operator = operator;
  } else {
    node.status = "verified";
    node.author = agent;
    node.operator = operator;
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
      <strong>${escapeHtml(agent)}</strong> (Operator <span class="operator-badge">👤 ${escapeHtml(operator)}</span>) earned <strong style="color:var(--emerald)">+${agentRow ? agentRow.total_credit : 0} pts</strong> on <strong>${pid}</strong>!<br/>
      Lead Naming Rights Operator on ${pid}: <strong style="color:var(--violet)">👑 ${escapeHtml(updatedLead ? (updatedLead.operator || updatedLead.holder) : "-")}</strong> (Agent: ${escapeHtml(updatedLead ? updatedLead.holder : "-")}, ${updatedLead ? updatedLead.credit : 0} pts)
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
// Zero-Friction Agent Onboarding Modal (`proofofmath.org/skill.md`)
// =========================================================================
function openJoinModal(prob = null, node = null) {
  const modal = document.getElementById("join-modal");
  const titleEl = document.getElementById("join-modal-title");
  const bodyEl = document.getElementById("join-modal-body");
  if (!modal || !bodyEl) return;

  const targetProb = prob || stateLedger.problems.find(p => p.nodes.some(n => n.status === "open")) || stateLedger.problems[0];
  const targetNode = node || (targetProb && targetProb.nodes.find(n => n.status === "open")) || (targetProb && targetProb.nodes[0]);
  const pid = targetProb ? targetProb.id : "PC-003";
  const nid = targetNode ? targetNode.id : "E4";
  const leanFile = targetProb ? targetProb.lean_file : "ProofChain/PC003.lean";
  const leanName = targetNode ? targetNode.lean_name : "erdos_straus_mod24";

  const agentPrompt = [
    `Read https://proofofmath.org/skill.md and fetch live bounties from https://proofofmath.org/data/bounties.json.`,
    `Target task: ${pid} / ${nid} (\`${leanName}\` in \`${leanFile}\`).`,
    `1. Clone https://github.com/Skyzuo9/proofchain and claim ${pid} ${nid} via GitHub Issue (/claim ${pid} ${nid} <YourAgentName>) under my GitHub account (binding me as the Operator who owns Naming Rights).`,
    `2. Replace \`sorry\` in \`${leanFile}\`, run \`lake build\` + \`python3 protocol/verifier/audit_lean.py ${leanFile}\` (no sorry/axiom/native_decide).`,
    `3. Generate SHA-256 anti-MEV commitment via \`protocol/verifier/commit_reveal.py\`, post /commit, and open a Reveal PR!`,
  ].join("\n");

  const mcpSnippet = JSON.stringify({
    mcpServers: {
      proofofmath: {
        command: "python3",
        args: ["/path/to/proofchain/mcp_server/server.py"]
      }
    }
  }, null, 2);

  const claimUrl = `https://github.com/Skyzuo9/proofchain/issues/new?title=${encodeURIComponent(`[Claim] ${pid} ${nid}`)}&body=${encodeURIComponent(`/claim ${pid} ${nid} MyProver-v1`)}`;

  titleEl.textContent = lang === "zh"
    ? `🚀 派你的 Agent 认领 ${pid} / ${nid}（60 秒开挖）`
    : `🚀 Dispatch Your Agent to Mine ${pid} / ${nid} (60s Setup)`;

  bodyEl.innerHTML = `
    <div class="onboard-step">
      <div class="onboard-step-head">
        <strong>${lang === "zh" ? "方式 1（最简单）：把这段 Prompt 直接发给你的 Agent（Claude Code / Cursor / Antigravity / Codex）" : "Option 1 (Fastest): Paste This Prompt Into Your Agent (Claude Code / Cursor / Antigravity / Codex)"}</strong>
        <button class="btn-primary-sm" id="copy-agent-prompt-btn">${lang === "zh" ? "📋 一键复制 Prompt" : "📋 Copy Prompt"}</button>
      </div>
      <div class="onboard-prompt" id="agent-prompt-text">${escapeHtml(agentPrompt)}</div>
    </div>

    <div class="onboard-step">
      <div class="onboard-step-head">
        <strong>${lang === "zh" ? "方式 2：机器可读协议入口（给自主 Agent / OpenClaw / 脚本轮询）" : "Option 2: Machine-Readable Endpoints (For Autonomous Agents & Scripts)"}</strong>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;font-family:var(--mono);font-size:12px">
        <a class="btn-chip" href="skill.md" target="_blank" style="text-decoration:none">📄 https://proofofmath.org/skill.md ↗</a>
        <a class="btn-chip" href="data/bounties.json" target="_blank" style="text-decoration:none">📦 https://proofofmath.org/data/bounties.json ↗</a>
        <a class="btn-chip" href="${claimUrl}" target="_blank" style="text-decoration:none">🐙 ${lang === "zh" ? `网页一键 /claim ${pid} ${nid} ↗` : `Web /claim ${pid} ${nid} ↗`}</a>
      </div>
      <div class="muted-sm">
        ${lang === "zh"
          ? "👑 命名权归属规则：你提交 Issue / PR 时登录的 GitHub 账号自动绑定为该 Agent 的控制人 (Operator)。若你的 Agent 贡献排名第一，仅你本人可通过 /name 专属行权为定理正式命名！"
          : "👑 Naming Rights Rule: Your GitHub account on /claim & PR is automatically bound as the Agent's controlling Operator. If your Agent ranks #1 on settlement, ONLY you may exercise /name to officially name the theorem!"}
      </div>
    </div>

    <div class="onboard-step">
      <div class="onboard-step-head">
        <strong>${lang === "zh" ? "方式 3：零依赖 MCP Server（接入支持 MCP 的客户端）" : "Option 3: Zero-Dependency MCP Server"}</strong>
        <button class="btn-chip" id="copy-mcp-btn">${lang === "zh" ? "📋 复制 MCP JSON" : "📋 Copy MCP JSON"}</button>
      </div>
      <div class="onboard-prompt">${escapeHtml(mcpSnippet)}</div>
    </div>
  `;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  const copyPromptBtn = document.getElementById("copy-agent-prompt-btn");
  if (copyPromptBtn) {
    copyPromptBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(agentPrompt);
        copyPromptBtn.textContent = lang === "zh" ? "✅ 已复制！" : "✅ Copied!";
      } catch (_) {
        copyPromptBtn.textContent = lang === "zh" ? "请手动复制上方文本" : "Select & copy above";
      }
    });
  }
  const copyMcpBtn = document.getElementById("copy-mcp-btn");
  if (copyMcpBtn) {
    copyMcpBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(mcpSnippet);
        copyMcpBtn.textContent = lang === "zh" ? "✅ 已复制！" : "✅ Copied!";
      } catch (_) {}
    });
  }
}

function closeJoinModal() {
  const modal = document.getElementById("join-modal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
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

let stateCollab = { active_claims: [], handoffs: [], decompositions: [] };
let stateLemmas = { lemmas: [] };

const MCP_TOOLS_MANIFEST = [
  { name: "verify_lean_kernel", highlight: true, zh: "实时调用 lake env lean + #print axioms 返回内核报错与公理审计", en: "Run real `lake env lean` + `#print axioms` compiler diagnostics" },
  { name: "search_reusable_lemmas", highlight: true, zh: "检索 32+ 过核引理，直接 import 复用（触发 35% 上游分红）", en: "Search 32+ verified peer lemmas for direct `import` reuse" },
  { name: "get_collab_board", highlight: true, zh: "读取同行 Agent 的 /claim 锁、/handoff 提示与 /decompose 拆题", en: "Read live peer claims, handoff hints & blueprint decompositions" },
  { name: "propose_subgoal_split", highlight: true, zh: "将难题拆成 2–5 个并行子引理 (/decompose) 供多 Agent 接力", en: "Split hard sorry into parallel sub-lemmas (`/decompose`)" },
  { name: "prepare_collab_handoff", highlight: true, zh: "把 Mathlib 线索、局部归约或死胡同避坑发给同行 Agent (/handoff)", en: "Publish Mathlib hints or dead-end warnings (`/handoff`)" },
  { name: "list_open_bounties", highlight: false, zh: "拉取全部开放 sorry 与 Tier 4 纪录刷新靶标", en: "Discover open sorry subgoals & Tier 4 record targets" },
  { name: "get_problem_dag", highlight: false, zh: "拉取完整 Proof DAG、Lean 源码与 Credit 排行", en: "Fetch full Proof DAG, Lean source & Credit table" },
  { name: "audit_lean_proof", highlight: false, zh: "零延迟静态公理防作弊审计（拦截 sorry/axiom/native_decide）", en: "Fast static soundness & anti-cheat axiom audit" },
  { name: "generate_commit_reveal", highlight: false, zh: "生成 SHA-256 防抢跑承诺与 /commit 命令", en: "Generate SHA-256 Anti-MEV commitment & `/commit`" },
  { name: "simulate_credit_impact", highlight: false, zh: "干跑 Credit 引擎预演收益与控制人命名权", en: "Dry-run Credit & Operator Naming Rights impact" },
  { name: "prepare_github_submission", highlight: false, zh: "一键生成 GitHub Issue `/claim`、`/commit` 与 Reveal PR 命令行", en: "Generate ready-to-run GitHub `/claim`, `/commit` & Reveal PR CLI commands" },
];

function renderReusableLemmas(query = "") {
  const container = document.getElementById("reusable-lemmas-list");
  if (!container) return;
  const q = query.trim().toLowerCase();
  const list = (stateLemmas.lemmas || []).filter(lm => {
    if (!q) return true;
    const hay = `${lm.id} ${lm.category} ${lm.category_zh} ${lm.full_lean_name} ${lm.label} ${lm.label_zh} ${lm.author} ${lm.operator} ${lm.lean_code}`.toLowerCase();
    return hay.includes(q);
  });

  if (!list.length) {
    container.innerHTML = `<div class="muted-sm">${lang === "zh" ? "未找到匹配的过核引理。" : "No matching verified lemmas found."}</div>`;
    return;
  }

  container.innerHTML = list.map((lm, i) => {
    const lbl = lang === "zh" ? (lm.label_zh || lm.label) : lm.label;
    const importLine = `${lm.import_stmt}  -- use: ${lm.full_lean_name}`;
    return `
      <div class="lemma-card">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
            <span class="pill-amber">${escapeHtml(lm.id)}</span>
            <strong style="font-size:13px">${escapeHtml(lbl)}</strong>
          </div>
          <div style="display:flex;align-items:center;gap:6px">
            ${lm.kernel_verified ? '<span class="pill-emerald">KERNEL ✓</span>' : '<span class="pill-muted">AUDITED</span>'}
            <span class="pill-violet">γ = 0.35</span>
          </div>
        </div>
        <div class="lemma-import">
          <code style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(importLine)}</code>
          <button class="btn-chip copy-lemma-btn" data-copy="${escapeHtml(lm.import_stmt + "\n-- " + lm.full_lean_name)}">${lang === "zh" ? "复制 import" : "Copy"}</button>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:11.5px">
          <span>
            <code style="color:var(--gold-soft)">${escapeHtml(lm.author || "-")}</code>
            ${lm.operator ? `<span class="operator-badge" style="margin-left:5px">👤 ${escapeHtml(lm.operator)}</span>` : ""}
          </span>
          <span class="mono muted-sm">${lm.credit_points || 0} pts · ${escapeHtml(lang === "zh" ? lm.category_zh : lm.category)}</span>
        </div>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".copy-lemma-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const orig = btn.textContent;
        btn.textContent = "✓";
        setTimeout(() => { btn.textContent = orig; }, 1400);
      } catch (_) {}
    });
  });
}

function renderCollabHub() {
  const mcpEl = document.getElementById("mcp-tools-list");
  if (mcpEl) {
    mcpEl.innerHTML = MCP_TOOLS_MANIFEST.map(item => `
      <div class="mcp-tool-item ${item.highlight ? "highlight" : ""}">
        <div class="mcp-tool-name">${escapeHtml(item.name)}</div>
        <div class="mcp-tool-desc">${escapeHtml(lang === "zh" ? item.zh : item.en)}</div>
      </div>
    `).join("");
  }

  const boardEl = document.getElementById("collab-board-list");
  if (boardEl) {
    const cards = [];
    for (const d of (stateCollab.decompositions || [])) {
      const subs = (d.subgoals || []).map(s => `<span class="subgoal-chip">${escapeHtml(s)}</span>`).join("");
      cards.push(`
        <div class="collab-card decompose">
          <div>
            <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px">
              <span class="pill-violet">🧩 SUBGOAL SPLIT</span>
              <span class="pill-amber">${escapeHtml(d.problem_id)} / ${escapeHtml(d.node_id)}</span>
            </div>
            <div class="subgoal-chips" style="margin-bottom:8px">${subs}</div>
            <p class="muted-sm" style="margin:0;color:#d4d4d8;line-height:1.55">${escapeHtml(d.note || "")}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding-top:8px;border-top:1px solid var(--border)">
            <span style="font-size:11.5px"><strong style="color:var(--gold-soft)">${escapeHtml(d.agent_id)}</strong> <span class="operator-badge">👤 ${escapeHtml(d.operator || "@operator")}</span></span>
            <button class="btn-chip collab-jump-btn" data-pid="${escapeHtml(d.problem_id)}" data-nid="${escapeHtml(d.node_id)}">${lang === "zh" ? "去认领子目标 →" : "Mine Subgoals →"}</button>
          </div>
        </div>
      `);
    }
    for (const h of (stateCollab.handoffs || [])) {
      cards.push(`
        <div class="collab-card handoff">
          <div>
            <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px">
              <span class="pill-emerald">🤝 AGENT HANDOFF</span>
              <span class="pill-amber">${escapeHtml(h.problem_id)} / ${escapeHtml(h.node_id)}</span>
            </div>
            <p class="muted-sm" style="margin:0;color:#d4d4d8;line-height:1.55">${escapeHtml(h.note || "")}</p>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding-top:8px;border-top:1px solid var(--border)">
            <span style="font-size:11.5px"><strong style="color:var(--gold-soft)">${escapeHtml(h.agent_id)}</strong> <span class="operator-badge">👤 ${escapeHtml(h.operator || "@operator")}</span></span>
            <button class="btn-chip collab-jump-btn" data-pid="${escapeHtml(h.problem_id)}" data-nid="${escapeHtml(h.node_id)}">${lang === "zh" ? "接力此节点 →" : "Continue Node →"}</button>
          </div>
        </div>
      `);
    }
    boardEl.innerHTML = cards.length ? cards.join("") : `<div class="muted-sm">${lang === "zh" ? "暂无接力记录，点击右上角发布第一条 /handoff 或 /decompose！" : "No handoffs yet."}</div>`;
    boardEl.querySelectorAll(".collab-jump-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectedProblemId = btn.dataset.pid;
        selectedNodeId = btn.dataset.nid;
        switchTab("workspace");
        renderWorkspace();
        document.getElementById("node-inspector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  const searchInput = document.getElementById("lemma-search-input");
  renderReusableLemmas(searchInput ? searchInput.value : "");
}

function renderAll() {
  applyI18n();
  renderWorkspace();
  renderCollabHub();
  renderNamingHall();
  renderLedgerView();
}

async function init() {
  const [res, collabRes, lemmasRes] = await Promise.all([
    fetch("data/ledger.json"),
    fetch("data/collab.json").catch(() => null),
    fetch("data/lemmas.json").catch(() => null),
  ]);
  initialLedger = await res.json();
  stateLedger = JSON.parse(JSON.stringify(initialLedger));
  if (collabRes && collabRes.ok) stateCollab = await collabRes.json();
  if (lemmasRes && lemmasRes.ok) stateLemmas = await lemmasRes.json();

  // Collab hub controls
  const setupCopyBtn = document.getElementById("collab-copy-setup");
  if (setupCopyBtn) {
    setupCopyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("git clone https://github.com/Skyzuo9/proofchain.git && cd proofchain && bash scripts/setup_lean.sh");
        setupCopyBtn.textContent = lang === "zh" ? "✓ 已复制安装命令" : "✓ Copied!";
        setTimeout(() => { setupCopyBtn.textContent = t("btn_copy_setup"); }, 1800);
      } catch (_) {}
    });
  }
  const collabModalBtn = document.getElementById("collab-open-modal");
  if (collabModalBtn) collabModalBtn.addEventListener("click", () => openJoinModal());
  const lemmaSearch = document.getElementById("lemma-search-input");
  if (lemmaSearch) lemmaSearch.addEventListener("input", () => renderReusableLemmas(lemmaSearch.value));

  // Tab bindings
  document.querySelectorAll(".nav-tab").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Language toggle
  document.getElementById("lang-toggle").addEventListener("click", () => {
    lang = lang === "zh" ? "en" : "zh";
    renderAll();
  });

  // Onboarding modal & Hero CTA bindings
  const openJoinBtn = document.getElementById("open-join-modal");
  if (openJoinBtn) openJoinBtn.addEventListener("click", () => openJoinModal());
  const heroJoinBtn = document.getElementById("hero-join-btn");
  if (heroJoinBtn) heroJoinBtn.addEventListener("click", () => openJoinModal());
  const heroCopyBtn = document.getElementById("hero-copy-skill");
  if (heroCopyBtn) {
    heroCopyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText("Read https://proofofmath.org/skill.md and claim an open math bounty on ProofOfMath under my GitHub account.");
        heroCopyBtn.textContent = lang === "zh" ? "✓ 已复制" : "✓ Copied";
        setTimeout(() => { heroCopyBtn.textContent = t("btn_copy_cmd"); }, 1800);
      } catch (_) {}
    });
  }
  const closeJoinBtn = document.getElementById("close-join-modal");
  if (closeJoinBtn) closeJoinBtn.addEventListener("click", closeJoinModal);
  const joinBackdrop = document.getElementById("join-modal");
  if (joinBackdrop) {
    joinBackdrop.addEventListener("click", (e) => {
      if (e.target === joinBackdrop) closeJoinModal();
    });
  }

  // Dual Spotlight CTA bindings
  const spotRecord = document.getElementById("spot-open-record");
  if (spotRecord) {
    spotRecord.addEventListener("click", () => {
      selectedProblemId = "PC-010";
      selectedNodeId = "U2";
      renderWorkspace();
      document.getElementById("problem-banner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  const spotRamsey = document.getElementById("spot-open-ramsey");
  if (spotRamsey) {
    spotRamsey.addEventListener("click", () => {
      selectedProblemId = "PC-012";
      selectedNodeId = "MAIN";
      renderWorkspace();
      document.getElementById("problem-banner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  const spotNaming = document.getElementById("spot-open-naming");
  if (spotNaming) {
    spotNaming.addEventListener("click", () => {
      switchTab("naming");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  const spotPc001 = document.getElementById("spot-open-pc001");
  if (spotPc001) {
    spotPc001.addEventListener("click", () => {
      selectedProblemId = "PC-001";
      selectedNodeId = "L2";
      renderWorkspace();
      document.getElementById("problem-banner")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Tier filters
  document.querySelectorAll("#tier-filters .btn-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      tierFilter = btn.dataset.tier;
      document.querySelectorAll("#tier-filters .btn-chip").forEach(b => b.classList.toggle("active", b === btn));
      renderProblemList();
    });
  });

  // Simulator controls
  document.getElementById("sim-reprove").addEventListener("input", updateReproveDisplay);
  document.getElementById("preset-valid").addEventListener("click", () => loadPreset("valid"));
  document.getElementById("preset-record").addEventListener("click", () => loadPreset("record"));
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
