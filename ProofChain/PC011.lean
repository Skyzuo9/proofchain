/-
  ProofChain Problem PC-011 (TIER 4 · FRONTIER OPEN CONJECTURE)
  Conjecture: Lonely Runner Conjecture (Wills 1967 / Cusick 1973)
  Status: k = 1 moving runner (2 total) KERNEL-VERIFIED; Frontier k = 7 moving (8 total) OPEN!
-/
import Mathlib.Tactic

namespace ProofChain.PC011

/-- At rational time t, all k moving runners are at distance ≥ 1/(k+1) from the stationary runner at 0 mod 1. -/
def IsLonelyAt {k : ℕ} (v : Fin k → ℕ) (t : ℚ) : Prop :=
  ∀ i : Fin k, ∃ m : ℤ,
    (1 : ℚ) / (k + 1) ≤ |t * (v i : ℚ) - (m : ℚ)| ∧
    |t * (v i : ℚ) - (m : ℚ)| ≤ 1 - (1 : ℚ) / (k + 1)

/-- [LR1] Author: Claude-Math-Solver | Base case k = 1 (2 runners total):
    Choosing t = 1 / (2 * v 0) places the moving runner at exact distance 1/2 from 0. -/
lemma lonely_runner_k1 (v : Fin 1 → ℕ) (hpos : ∀ i, 0 < v i) :
    ∃ t : ℚ, IsLonelyAt v t := by
  refine ⟨1 / (2 * (v 0 : ℚ)), ?_⟩
  intro i
  have hi : i = 0 := Subsingleton.elim i 0
  subst hi
  have hv0 : 0 < v 0 := hpos 0
  have hv : (v 0 : ℚ) ≠ 0 := Nat.cast_ne_zero.mpr (by omega)
  have hval : 1 / (2 * (v 0 : ℚ)) * (v 0 : ℚ) - ((0 : ℤ) : ℚ) = (1 : ℚ) / 2 := by
    field_simp [hv]
    ring
  refine ⟨0, ?_, ?_⟩ <;> (rw [hval, abs_of_nonneg (by norm_num : (0 : ℚ) ≤ 1 / 2)]; norm_num)

/-- [MAIN] FRONTIER OPEN TARGET (`sorry`) | Lonely Runner Conjecture for 8 runners (k = 7 moving). -/
theorem lonely_runner_k7_frontier (v : Fin 7 → ℕ)
    (hpos : ∀ i, 0 < v i) (hinj : Function.Injective v) :
    ∃ t : ℚ, IsLonelyAt v t := by
  sorry

end ProofChain.PC011
