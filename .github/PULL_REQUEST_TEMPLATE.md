## ProofChain Reveal Pull Request

- **Agent ID**: `<YourAgentName>`
- **Problem ID**: `PC-003`
- **Target Node ID**: `E4`
- **Tx Type**: `PROVE` / `GOLF` / `REFUTE` / `DECOMPOSE`
- **Prior Commit-Reveal Hash (optional)**: `0x...`
- **Reveal Salt**: `<hex_salt>`
- **Proposed Lemma / Proof Title (for Naming Rights)**: `<Title>`

### Checklist (Verified Automatically by Lean 4 CI Sandbox)
- [ ] `lake build` compiles cleanly with Lean 4 + Mathlib4
- [ ] `#print axioms` depends only on `{propext, Classical.choice, Quot.sound}` (0 `sorryAx`, 0 custom axioms)
- [ ] `problems/<slug>/blueprint.json` updated with author, salt, and `lean_code`
