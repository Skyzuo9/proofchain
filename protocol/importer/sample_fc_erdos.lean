/-
  Sample fixture matching `google-deepmind/formal-conjectures` format
  Used to verify `import_formal_conjectures.py` end-to-end.
-/
import Mathlib.Tactic

namespace FormalConjectures.ErdosSample

/--
Erdős Problem #1 (Sample): Every subset A ⊆ {1..N} with all subset sums distinct
satisfies |A| ≤ log₂ N + O(1).
-/
@[category research open, AMS 05 11]
theorem erdos_1_distinct_subset_sums (N : ℕ) (A : Finset ℕ)
    (hsub : ∀ a ∈ A, 1 ≤ a ∧ a ≤ N)
    (hdist : ∀ S T : Finset ℕ, S ⊆ A → T ⊆ A → S.sum id = T.sum id → S = T) :
    2 ^ A.card ≤ N * A.card + 1 := by
  sorry

end FormalConjectures.ErdosSample
