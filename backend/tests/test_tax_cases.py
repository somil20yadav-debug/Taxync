import sys
if '' not in sys.path:
    sys.path.insert(0, '')

from app.tax_engine import calculate_old_regime_tax, calculate_new_regime_tax

def test_12l_no_deductions_incometax_gov_in():
    """
    Official Test against incometax.gov.in for FY 2025-26:
    Gross Income: ₹12,00,000 with no deductions claimed.
    
    Old Regime:
    - Gross Income: ₹12,00,000
    - Standard deduction: ₹50,000
    - Net Taxable Income: ₹11,50,000
    - Slabs:
      0 - 2,50,000: Nil
      2,50,000 - 5,00,000 @ 5%: ₹12,500
      5,00,000 - 10,00,000 @ 20%: ₹1,00,000
      10,00,000 - 11,50,000 @ 30%: ₹45,000
      Base Tax = ₹1,57,500
      Health & Education Cess @ 4% = ₹6,300
      Total Old Regime Tax = ₹1,63,800
    
    New Regime:
    - Gross Income: ₹12,00,000
    - Standard deduction: ₹75,000
    - Net Taxable Income: ₹11,25,000
    - Because Net Taxable Income <= ₹12,00,000, Section 87A rebate covers 100% tax
    - Total New Regime Tax = ₹0
    """
    income = 1_200_000
    old_tax = calculate_old_regime_tax(income, 50_000)
    new_tax = calculate_new_regime_tax(income, 75_000)
    
    assert new_tax == 0, f"Expected New Regime Tax 0, got {new_tax}"
    assert old_tax == 163_800, f"Expected Old Regime Tax 163,800, got {old_tax}"
    print("PASS: test_12l_no_deductions_incometax_gov_in (New=₹0, Old=₹1,63,800)")

def test_old_regime_rebate_500k():
    assert calculate_old_regime_tax(500_000, 0) == 0

def test_zero_income():
    assert calculate_old_regime_tax(0, 0) == 0
    assert calculate_new_regime_tax(0, 0) == 0

if __name__ == '__main__':
    test_12l_no_deductions_incometax_gov_in()
    test_old_regime_rebate_500k()
    test_zero_income()
    print("\nAll income tax tests verified against official tax rules!")
