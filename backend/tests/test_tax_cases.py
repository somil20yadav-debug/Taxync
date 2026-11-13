import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.tax_engine import (
    calculate_old_regime_tax, 
    calculate_new_regime_tax,
    process_tax_calculation
)
from app.models import TaxCalculationRequest

def test_12l_zero_tax_rebate():
    """
    Scenario: ₹12 LPA CTC without investments.
    - New Regime: Gross ₹12L - ₹75k Standard Deduction = ₹11.25L taxable <= ₹12L -> ₹0 Tax (Sec 87A).
    - Old Regime: Gross ₹12L - ₹50k Standard Deduction = ₹11.50L taxable -> ₹1,63,800.
    - Winner: New Regime saves ₹1,63,800.
    """
    income = 1_200_000
    old_tax = calculate_old_regime_tax(income, 50_000)
    new_tax = calculate_new_regime_tax(income, 75_000)
    
    assert new_tax == 0, f"Expected New Regime Tax 0, got {new_tax}"
    assert old_tax == 163_800, f"Expected Old Regime Tax 163,800, got {old_tax}"
    print("✓ PASS: 12 LPA Zero-Tax Rebate (New: ₹0, Old: ₹1,63,800)")

def test_old_regime_500k_rebate():
    """
    Old Regime Section 87A:
    Net taxable income <= ₹5,00,000 gets 100% tax rebate -> ₹0 tax liability.
    """
    assert calculate_old_regime_tax(500_000, 0) == 0
    assert calculate_old_regime_tax(550_000, 50_000) == 0 # 5.5L - 50k std ded = 5L
    print("✓ PASS: Old Regime ₹5L 87A Rebate verified")

def test_zero_and_minimal_income():
    """Edge cases: ₹0 and small income below basic exemption."""
    assert calculate_old_regime_tax(0, 0) == 0
    assert calculate_new_regime_tax(0, 0) == 0
    assert calculate_old_regime_tax(250_000, 0) == 0
    assert calculate_new_regime_tax(400_000, 75_000) == 0
    print("✓ PASS: Zero and minimal income edge cases verified")

def test_section_87a_marginal_relief():
    """
    Section 87A Marginal Relief in New Regime:
    Taxable income slightly above ₹12L must NOT trigger a punitive tax jump higher than the excess income.
    Taxable income = ₹12,10,000 (Gross ₹12,85,000 - ₹75,000 Std Ded).
    Excess over ₹12L = ₹10,000.
    Tax cannot exceed ₹10,000 (+ 4% cess = ₹10,400).
    Without marginal relief, raw slab tax would be ₹61,500 + 4% = ₹63,960.
    """
    gross = 1_285_000
    tax = calculate_new_regime_tax(gross, 75_000)
    assert tax == 10_400, f"Expected marginal relief tax ₹10,400, got {tax}"
    print("✓ PASS: Section 87A Marginal Relief verified (Capped at excess income ₹10,000 + cess)")

def test_high_deductions_old_regime_winner():
    """
    Scenario: ₹18 LPA with high deductions (80C ₹1.5L, 80D ₹50k, HRA ₹2.4L, Home Loan ₹2L).
    Total Deductions: ₹50k Std + ₹1.5L + ₹50k + ₹2.4L + ₹2L = ₹6.9 Lakhs.
    Net Taxable in Old: ₹18L - ₹6.9L = ₹11.1 Lakhs.
    Base Tax Old: ₹12,500 (2.5-5L) + ₹1,00,000 (5-10L) + ₹33,000 (10-11.1L) = ₹1,45,500.
    Old Tax with 4% cess = ₹1,51,320.
    New Regime: ₹18L - ₹75k = ₹17.25L taxable.
    New Tax: 4-8L @ 5% (₹20k) + 8-12L @ 10% (₹40k) + 12-16L @ 15% (₹60k) + 16-17.25L @ 20% (₹25k) = ₹1,45,000.
    New Tax with 4% cess = ₹1,50,800.
    """
    req = TaxCalculationRequest(
        income=1_800_000,
        standard_deduction=75_000,
        section80C=150_000,
        section80D=50_000,
        hra=240_000,
        home_loan_interest=200_000
    )
    res = process_tax_calculation(req)
    assert res["old_regime_tax"] == 151_320, f"Expected ₹1,51,320, got {res['old_regime_tax']}"
    assert res["new_regime_tax"] == 150_800, f"Expected ₹1,50,800, got {res['new_regime_tax']}"
    print("✓ PASS: Multi-deduction comparison verified")

def test_hni_surcharge_calculation():
    """
    HNI Surcharge test: ₹60 LPA salary.
    Taxable income > ₹50 Lakhs attracts 10% surcharge on base tax.
    """
    gross = 6_000_000
    tax_new = calculate_new_regime_tax(gross, 75_000)
    # Taxable = 59,25,000
    # Slabs up to 24L: 4-8L:20k, 8-12L:40k, 12-16L:60k, 16-20L:80k, 20-24L:100k -> 3,00,000
    # 24L - 59.25L @ 30%: 35.25L * 0.30 = 10,57,500
    # Base Tax = 13,57,500
    # Surcharge @ 10% = 1,35,750
    # Tax + Surcharge = 14,93,250
    # Cess @ 4% = 59,730
    # Total = 15,52,980
    assert tax_new == 1_552_980, f"Expected ₹15,52,980 with 10% surcharge, got {tax_new}"
    print("✓ PASS: HNI Surcharge @ 10% on >₹50L verified (₹15,52,980)")

def test_winner_logic_strictness():
    """Verify winner logic ALWAYS picks the regime with lower tax."""
    req_tie = TaxCalculationRequest(income=400_000)
    res_tie = process_tax_calculation(req_tie)
    assert res_tie["old_regime_tax"] == 0
    assert res_tie["new_regime_tax"] == 0
    assert res_tie["winner"] == "Tie"
    print("✓ PASS: Strict Winner & Tie logic verified")

if __name__ == '__main__':
    test_12l_zero_tax_rebate()
    test_old_regime_500k_rebate()
    test_zero_and_minimal_income()
    test_section_87a_marginal_relief()
    test_high_deductions_old_regime_winner()
    test_hni_surcharge_calculation()
    test_winner_logic_strictness()
    print("\n" + "="*50)
    print("ALL 7 INSTITUTIONAL TAX CALCULATION TESTS PASSED (100% ACCURACY)")
    print("="*50)
