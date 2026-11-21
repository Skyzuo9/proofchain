/-
  ProofChain Problem PC-005 (TIER 1 · SETTLED BENCHMARK)
  Theorem: Ramsey Number R(3, 3) = 6 (Exact Upper & Lower Bounds)
  Demonstrates: Bidirectional Combinatorial Proof DAG (Constructive C₅ Witness + Pigeonhole Upper Bound)
-/
import Mathlib.Tactic

namespace ProofChain.PC005

/-- [R1] Author: AlphaFormal-v2 | Explicit C₅ 2-coloring on Fin 5 avoiding monochromatic triangles. -/
def c5Color (i j : Fin 5) : Bool :=
  let d := (i.val + 5 - j.val) % 5
  d == 1 || d == 4

lemma c5_symm (i j : Fin 5) : c5Color i j = c5Color j i := by
  revert i j
  decide

lemma ramsey_3_3_lower_5 :
    ∀ i j k : Fin 5, i < j → j < k →
      ¬ (c5Color i j = c5Color j k ∧ c5Color j k = c5Color i k) := by
  decide

/-- [R2] Author: DeepSeek-Prover-X | Pigeonhole on 5 boolean edges from vertex 0:
    Among 5 neighbors, at least 3 receive the same color. -/
lemma pigeonhole_five_bools (b1 b2 b3 b4 b5 : Bool) :
    ∃ b : Bool,
      (b1 = b ∧ b2 = b ∧ b3 = b) ∨ (b1 = b ∧ b2 = b ∧ b4 = b) ∨ (b1 = b ∧ b2 = b ∧ b5 = b) ∨
      (b1 = b ∧ b3 = b ∧ b4 = b) ∨ (b1 = b ∧ b3 = b ∧ b5 = b) ∨ (b1 = b ∧ b4 = b ∧ b5 = b) ∨
      (b2 = b ∧ b3 = b ∧ b4 = b) ∨ (b2 = b ∧ b3 = b ∧ b5 = b) ∨ (b2 = b ∧ b4 = b ∧ b5 = b) ∨
      (b3 = b ∧ b4 = b ∧ b5 = b) := by
  cases b1 <;> cases b2 <;> cases b3 <;> cases b4 <;> cases b5 <;> decide

/-- [R3] Author: Gemini-Proof-Ultra | Triangle forcing from 3 same-colored neighbors of vertex 0. -/
lemma triangle_from_three_neighbors (c : Fin 6 → Fin 6 → Bool)
    (hsym : ∀ x y, c x y = c y x)
    (u v w : Fin 6) (hu : 0 < u) (hv : u < v) (hw : v < w) (b : Bool)
    (h1 : c 0 u = b) (h2 : c 0 v = b) (h3 : c 0 w = b) :
    ∃ x y z : Fin 6, x < y ∧ y < z ∧ c x y = c y z ∧ c y z = c x z := by
  by_cases huv : c u v = b
  · exact ⟨0, u, v, hu, hv, by rw [h1, huv], by rw [huv, h2]⟩
  · by_cases hvw : c v w = b
    · exact ⟨0, v, w, lt_trans hu hv, hw, by rw [h2, hvw], by rw [hvw, h3]⟩
    · by_cases huw : c u w = b
      · exact ⟨0, u, w, hu, lt_trans hv hw, by rw [h1, huw], by rw [huw, h3]⟩
      · have e1 : c u v = !b := by cases h : c u v <;> cases b <;> simp_all
        have e2 : c v w = !b := by cases h : c v w <;> cases b <;> simp_all
        have e3 : c u w = !b := by cases h : c u w <;> cases b <;> simp_all
        exact ⟨u, v, w, hv, hw, by rw [e1, e2], by rw [e2, e3]⟩

/-- [MAIN] Author: Claude-Math-Solver | Every symmetric 2-coloring of K₆ contains a monochromatic K₃. -/
theorem ramsey_3_3_upper_6 (c : Fin 6 → Fin 6 → Bool)
    (hsym : ∀ x y, c x y = c y x) :
    ∃ x y z : Fin 6, x < y ∧ y < z ∧ c x y = c y z ∧ c y z = c x z := by
  obtain ⟨b, h⟩ := pigeonhole_five_bools (c 0 1) (c 0 2) (c 0 3) (c 0 4) (c 0 5)
  rcases h with ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ |
                ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩ | ⟨h1, h2, h3⟩
  · exact triangle_from_three_neighbors c hsym 1 2 3 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 1 2 4 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 1 2 5 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 1 3 4 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 1 3 5 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 1 4 5 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 2 3 4 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 2 3 5 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 2 4 5 (by decide) (by decide) (by decide) b h1 h2 h3
  · exact triangle_from_three_neighbors c hsym 3 4 5 (by decide) (by decide) (by decide) b h1 h2 h3

end ProofChain.PC005
