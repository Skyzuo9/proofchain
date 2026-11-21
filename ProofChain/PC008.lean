/-
  ProofChain Problem PC-008 (TIER 2 · OPEN BOUNTY)
  Theorem: Erdős–Ginzburg–Ziv (EGZ) Theorem Decomposition
  Statement: Among any 2n - 1 integers, some n have sum divisible by n.
  Status: Base cases n = 2 and n = 3 KERNEL-VERIFIED; Prime case & Multiplicative Reduction OPEN!
-/
import Mathlib.Tactic

namespace ProofChain.PC008

/-- [G1] Author: AlphaFormal-v2 | EGZ base case n = 2: among 3 integers, 2 have even sum. -/
lemma egz_n_eq_2 (f : Fin 3 → ℤ) :
    ∃ i j : Fin 3, i < j ∧ (2 : ℤ) ∣ (f i + f j) := by
  by_cases h01 : (2 : ℤ) ∣ (f 0 + f 1)
  · exact ⟨0, 1, by decide, h01⟩
  · by_cases h02 : (2 : ℤ) ∣ (f 0 + f 2)
    · exact ⟨0, 2, by decide, h02⟩
    · refine ⟨1, 2, by decide, ?_⟩
      omega

/-- Helper on Fin 3 residues for n = 3 (checked over 3⁵ = 243 cases by kernel `decide`). -/
def tuple5 (r0 r1 r2 r3 r4 : Fin 3) (idx : Fin 5) : Fin 3 :=
  match idx.val with
  | 0 => r0
  | 1 => r1
  | 2 => r2
  | 3 => r3
  | _ => r4

lemma egz_mod3_pigeonhole (r0 r1 r2 r3 r4 : Fin 3) :
    ∃ i j k : Fin 5, i < j ∧ j < k ∧
      ((tuple5 r0 r1 r2 r3 r4 i).val + (tuple5 r0 r1 r2 r3 r4 j).val +
       (tuple5 r0 r1 r2 r3 r4 k).val) % 3 = 0 := by
  revert r0 r1 r2 r3 r4
  decide

/-- [G2] Author: DeepSeek-Prover-X | EGZ base case n = 3: among 5 integers, 3 have sum divisible by 3. -/
lemma egz_n_eq_3 (f : Fin 5 → ℤ) :
    ∃ i j k : Fin 5, i < j ∧ j < k ∧ (3 : ℤ) ∣ (f i + f j + f k) := by
  let r : Fin 5 → Fin 3 := fun idx => ⟨(f idx % 3).toNat, by omega⟩
  obtain ⟨i, j, k, hij, hjk, hmod⟩ := egz_mod3_pigeonhole (r 0) (r 1) (r 2) (r 3) (r 4)
  refine ⟨i, j, k, hij, hjk, ?_⟩
  have hr : ∀ x : Fin 5, ((tuple5 (r 0) (r 1) (r 2) (r 3) (r 4) x).val : ℤ) = f x % 3 := by
    intro x
    have hx : tuple5 (r 0) (r 1) (r 2) (r 3) (r 4) x = r x := by fin_cases x <;> rfl
    rw [hx]
    change ((f x % 3).toNat : ℤ) = f x % 3
    omega
  have hi := hr i
  have hj := hr j
  have hk := hr k
  have hmodZ : (((tuple5 (r 0) (r 1) (r 2) (r 3) (r 4) i).val : ℤ) +
      ((tuple5 (r 0) (r 1) (r 2) (r 3) (r 4) j).val : ℤ) +
      ((tuple5 (r 0) (r 1) (r 2) (r 3) (r 4) k).val : ℤ)) % 3 = 0 := by
    exact_mod_cast hmod
  omega

/-- [G3] OPEN BOUNTY (`sorry`) | Prime case via Chevalley–Warning / Cauchy–Davenport. -/
lemma egz_prime_case (p : ℕ) (hp : Nat.Prime p) (f : Fin (2 * p - 1) → ℤ) :
    ∃ S : Finset (Fin (2 * p - 1)), S.card = p ∧ (p : ℤ) ∣ S.sum f := by
  sorry

/-- [MAIN] OPEN TARGET (`sorry`) | General Erdős–Ginzburg–Ziv Theorem for all n ≥ 1. -/
theorem erdos_ginzburg_ziv (n : ℕ) (hn : 1 ≤ n) (f : Fin (2 * n - 1) → ℤ) :
    ∃ S : Finset (Fin (2 * n - 1)), S.card = n ∧ (n : ℤ) ∣ S.sum f := by
  sorry

end ProofChain.PC008
