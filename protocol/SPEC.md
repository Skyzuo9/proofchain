# ProofChain Protocol Specification (v0.1-demo)

> **Bitcoin-inspired Proof-of-Useful-Work (PoUW) for Collaborative Multi-Agent Formal Mathematics.**

## 1. Core Thesis

Bitcoin aligns untrusted global compute around a single asymmetry: **finding a valid hash is hard, verifying it is instant and objective**.

Formal mathematics (Lean 4 / Coq / Isabelle) exhibits the same asymmetry—except the work is **permanently useful mathematical knowledge**:
- **Mining = Proof Search**: Agents collaborate on a shared Proof DAG of open mathematical conjectures and `sorry`-marked subgoals.
- **Consensus = Proof Kernel**: A deterministic formal verifier checks every contribution trustlessly (no human oracle required for correctness).
- **Block Reward = Credit & Naming Rights**: Verified contributors earn mathematically computed Credit and permanent, cryptographically attested **Naming Rights** over theorems, lemmas, constructions, and counterexamples.

---

## 2. Proof DAG & Transaction Types

Unlike Bitcoin's linear block chain, mathematical discovery is compositional and forms a **Directed Acyclic Graph (Proof DAG)** $G = (V, E)$, where an edge $u \to v$ means node $v$ depends on lemma $u$.

Agents interact with a problem's Proof DAG via four transaction types:

| Tx Type | Description | Verification Rule |
|---|---|---|
| `DECOMPOSE` | Split an open `sorry` target into sub-lemmas plus a verified reduction proof | Reduction compiles with only declared sub-lemma `sorry`s |
| `PROVE` | Fill an open `sorry` node with a complete formal proof | Compiles with 0 `sorry`, passes Axiom Audit |
| `REFUTE` | Submit a formal counterexample disproving an open subgoal/conjecture | Compiles with `¬ statement`, passes Axiom Audit |
| `GOLF` | Delete redundant lemmas or shorten an existing proof during the Challenge Window | Compiles cleanly, preserves target theorem signature, AST size reduced > 25% or node removed |

---

## 3. Anti-Gaming & Security Guarantees

### 3.1 Strict Axiom & Soundness Audit (`audit_lean.py`)
Every Lean 4 submission must pass static and kernel checks forbidding:
- `sorry`, `admit`
- Custom `axiom`, `constant`, `opaque` declarations
- Unsound or meta bypasses (`unsafe`, `implemented_by`, `extern`, `native_decide`, `Lean.ofReduceBool`)
- Only standard Mathlib foundations (`propext`, `Classical.choice`, `Quot.sound`) are permitted.

### 3.2 Anti-Front-Running: Commit-Reveal (`commit_reveal.py`)
To prevent mempool sniping (MEV), agents submit proofs in two phases:
1. **Commit**: Publish `commitment = SHA256(problem_id || node_id || agent_id || salt || normalized_lean_code)` in epoch $t$.
2. **Reveal**: Publish `(salt, lean_code)` in epoch $t+1$. The verifier checks the hash match before accepting timestamp priority.

### 3.3 Proof Golfing Challenge Window
Once the root theorem (`MAIN`) compiles with zero `sorry`s, the problem enters a **72-hour Challenge Window** (analogous to Optimistic Rollups):
- Any agent can submit a `GOLF` transaction pruning unused/redundant lemmas or compressing bloated proofs.
- Pruned nodes drop to `0` main credit, and the golfing agent earns a **Pruning Bounty**—directly eliminating lemma-spamming attacks.

---

## 4. Deterministic Proof-DAG Credit Engine (`credit_engine.py`)

When a problem settles, Credit is computed strictly over the **Minimal Dependency Sub-DAG** $G^* = (V^*, E^*)$ reachable from `MAIN`:

1. **Counterfactual Proof-of-Work Score** $W(v)$:
   Each surviving node $v \in V^*$ is evaluated by masking its proof as `sorry` and running a standardized baseline prover with fixed compute budget $B$ to measure re-prove rate $r(v) \in [0, 1]$:
   $$W(v) = -\ln(\max(r(v), 10^{-3})) \cdot (1 + 0.25 \cdot \nu(v))$$
   where $\nu(v) \in [0, 1]$ is the AST-anonymized conceptual novelty score (comments & identifiers stripped to prevent prompt injection).
   - Routine 2-line tactic finishes ($r \approx 0.98$) receive $W \approx 0.02$.
   - Hard conceptual leaps ($r \approx 0.005$) receive $W \approx 5.30$.

2. **Reverse-Topological Citation Royalties ($\gamma = 0.35$)**:
   Iterating over $V^*$ in reverse topological order (from `MAIN` back to foundational leaves):
   - Initialize `flow[v] = W(v)`.
   - If `v` has surviving dependencies $D(v) \subseteq V^*$:
     - `v` retains $(1 - \gamma) \cdot \text{flow}[v]$.
     - `v` transfers $\gamma \cdot \text{flow}[v]$ upstream to $d \in D(v)$, split proportionally to $W(d)$.
   - Leaf lemmas ($D(v) = \emptyset$) retain $100\%$ of `flow[v]`.

   This strictly conserves total work ($\sum \text{credit}[v] = \sum W(v)$), neutralizes last-mile sniping, and incentivizes publishing clean, reusable lemmas early.

3. **Side Bounties (`REFUTE` & `GOLF`)**:
   Verified counterexamples that prune dead branches and verified golfing reductions receive dedicated bonus credit from the problem's Hygiene Pool (10% of total pool).

---

## 5. Naming Rights Allocation (命名权分配)

Upon settlement, a cryptographic **Proof Block** (hash-chained to the previous block) is appended to `ledger/ledger.json`:
1. **Lead Theorem / Proof Naming Right (总证明冠名权)**: Awarded to the #1 Agent by total Credit on the problem.
2. **Lemma Naming Rights (引理冠名权)**: Awarded to the author of every surviving lemma in $G^*$ whose normalized Credit share $\ge 15\%$, permanently naming that lemma in the formal library.
3. **Counterexample & Discovery Credit**: Agents who submit verified `REFUTE` nodes retain naming attribution for their counterexample construction.
