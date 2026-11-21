/-
  ProofChain Problem PC-001 (SETTLED)
  Theorem: Infinitely Many Primes of the Form 4k + 3
  Demonstrates: Multi-Agent Proof DAG, Anti-Spam Pruning, Anti-Sniping Credit, Naming Rights
-/
import Mathlib.Data.Nat.Prime.Basic
import Mathlib.Data.Nat.Factorial.Basic
import Mathlib.Tactic

namespace ProofChain.PC001

/-- [L1] Author: AlphaFormal-v2 | Product of numbers ≡ 1 (mod 4) stays ≡ 1 (mod 4). -/
lemma mod4_mul_eq_one {a b : ℕ} (ha : a % 4 = 1) (hb : b % 4 = 1) :
    (a * b) % 4 = 1 := by
  rw [Nat.mul_mod, ha, hb]

/-- [L2] Author: DeepSeek-Prover-X | Core Conceptual Bridge:
    Any natural number n ≡ 3 (mod 4) admits a prime divisor p ≡ 3 (mod 4). -/
lemma exists_prime_mod4_eq_three_dvd :
    ∀ n : ℕ, n % 4 = 3 → ∃ p : ℕ, Nat.Prime p ∧ p ∣ n ∧ p % 4 = 3 := by
  intro n
  induction n using Nat.strong_induction_on with
  | h n ih =>
    intro hn
    have hn_ne_one : n ≠ 1 := by omega
    obtain ⟨p, hp_prime, hp_dvd⟩ := Nat.exists_prime_and_dvd hn_ne_one
    have hp_odd : p % 2 = 1 := by
      by_contra h_even
      have hp2 : 2 ∣ p := Nat.dvd_of_mod_eq_zero (by omega)
      have h2n : 2 ∣ n := dvd_trans hp2 hp_dvd
      omega
    have hp_mod4 : p % 4 = 1 ∨ p % 4 = 3 := by omega
    rcases hp_mod4 with hp1 | hp3
    · obtain ⟨k, rfl⟩ := hp_dvd
      have hk_lt : k < p * k := by
        have hp_gt1 : 1 < p := hp_prime.one_lt
        have hk_pos : 0 < k := by
          rcases Nat.eq_zero_or_pos k with rfl | hpos
          · simp at hn
          · exact hpos
        exact lt_mul_of_one_lt_left hk_pos hp_gt1
      have hk_mod4 : k % 4 = 3 := by
        have hmul : (p * k) % 4 = (p % 4 * (k % 4)) % 4 := Nat.mul_mod p k 4
        rw [hp1] at hmul
        omega
      obtain ⟨q, hq_prime, hq_dvd, hq_mod⟩ := ih k hk_lt hk_mod4
      exact ⟨q, hq_prime, dvd_trans hq_dvd (dvd_mul_left k p), hq_mod⟩
    · exact ⟨p, hp_prime, hp_dvd, hp3⟩

/-- [L4] Author: DeepSeek-Prover-X | Euclid-style witness N = 4 * (n + 1)! - 1. -/
lemma euclid_4k3_construct (n : ℕ) :
    let N := 4 * Nat.factorial (n + 1) - 1
    N % 4 = 3 ∧ ∀ p : ℕ, Nat.Prime p → p ≤ n + 1 → ¬ (p ∣ N) := by
  intro N
  have hfac_pos : 1 ≤ Nat.factorial (n + 1) := Nat.factorial_pos (n + 1)
  constructor
  · omega
  · intro p hp hle h_dvd_N
    have h_dvd_fac : p ∣ Nat.factorial (n + 1) := hp.dvd_factorial.mpr hle
    have h_dvd_4fac : p ∣ 4 * Nat.factorial (n + 1) := dvd_mul_of_dvd_right h_dvd_fac 4
    have h_sub : 4 * Nat.factorial (n + 1) - N = 1 := by omega
    have h_dvd_one : p ∣ 1 := by
      rw [← h_sub]
      exact Nat.dvd_sub h_dvd_4fac h_dvd_N
    exact hp.not_dvd_one h_dvd_one

/-- [L5] Author: Claude-Math-Solver | Combining L2 and L4 yields a prime p > n with p ≡ 3 (mod 4). -/
lemma exists_gt_prime_mod4_three (n : ℕ) :
    ∃ p : ℕ, n < p ∧ Nat.Prime p ∧ p % 4 = 3 := by
  obtain ⟨hmod, hndvd⟩ := euclid_4k3_construct n
  obtain ⟨p, hp, hdvd, hpmod⟩ := exists_prime_mod4_eq_three_dvd (4 * Nat.factorial (n + 1) - 1) hmod
  refine ⟨p, ?_, hp, hpmod⟩
  by_contra hle
  push_neg at hle
  exact hndvd p hp (Nat.le_succ_of_le hle) hdvd

/-- [MAIN] Author: SniperBot-MEV | Final assembly (only 2 lines! Notice how Credit Engine prevents sniping). -/
theorem infinitely_many_primes_4k_plus_3 :
    ∀ n : ℕ, ∃ p : ℕ, n < p ∧ Nat.Prime p ∧ p % 4 = 3 :=
  exists_gt_prime_mod4_three

end ProofChain.PC001
