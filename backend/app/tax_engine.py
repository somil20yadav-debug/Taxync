from typing import Dict, Any, List
from app.models import TaxCalculationRequest

def calculate_advanced_deductions(req: TaxCalculationRequest) -> float:
    """Calculates specific Old Regime deductions with legal caps."""
    sec_80u = 125000.0 if req.section80U == "severe" else (75000.0 if req.section80U == "standard" else 0.0)
    royalty = min(req.royaltyIncome, 300000.0)
    political = min(req.politicalDonation, req.income)
    ev_loan = min(req.evLoanInterest, 150000.0)
    return sec_80u + royalty + political + ev_loan

def calculate_old_regime_tax(income: float, total_deductions: float | dict = 0.0) -> float:
    """
    Old Regime Tax calculation:
    - Standard deduction: ₹50,000 for salaried individuals
    - Slabs: 0-2.5L: Nil, 2.5-5L: 5%, 5-10L: 20%, >10L: 30%
    - Section 87A rebate: If taxable income <= ₹5,00,000, tax liability is 0
    - Health & Education Cess: 4%
    """
    ded_amount = sum(total_deductions.values()) if isinstance(total_deductions, dict) else float(total_deductions)
    taxable = max(0.0, income - ded_amount)

    if taxable <= 500000.0:
        return 0.0

    slabs = [(1000000.0, 0.30), (500000.0, 0.20), (250000.0, 0.05)]
    tax = 0.0
    rem = taxable
    for threshold, rate in slabs:
        if rem > threshold:
            tax += (rem - threshold) * rate
            rem = threshold

    return float(round(tax * 1.04))

def calculate_new_regime_tax(income: float, standard_deduction: float = 75000.0) -> float:
    """
    New Regime Tax calculation (Budget FY 2025-26):
    - Standard deduction: ₹75,000
    - Slabs: 0-4L: Nil, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, >24L: 30%
    - Sec 87A rebate: Tax free up to ₹12,00,000 taxable income (max rebate ₹60,000)
    - Health & Education Cess: 4%
    """
    taxable = max(0.0, income - standard_deduction)
    if taxable <= 1200000.0:
        return 0.0

    slabs = [
        (2400000.0, 0.30),
        (2000000.0, 0.25),
        (1600000.0, 0.20),
        (1200000.0, 0.15),
        (800000.0, 0.10),
        (400000.0, 0.05),
    ]
    tax = 0.0
    rem = taxable
    for threshold, rate in slabs:
        if rem > threshold:
            tax += (rem - threshold) * rate
            rem = threshold

    return float(round(tax * 1.04))

def generate_suggestions(req: TaxCalculationRequest, deductions: Dict[str, float], is_new_winner: bool, savings: float) -> tuple[List[str], List[str]]:
    """Generates dynamic, highly personalized, mathematically precise tax advice."""
    action_items = []
    wealth_tips = []
    income = req.income
    total_ded = sum(deductions.values())
    slab_rate = 0.312 if income > 1500000 else (0.208 if income > 1000000 else 0.104)

    # 1. Section 87A Zero-Tax Threshold Check
    if income <= 1200000:
        action_items.append(f"At ₹{income:,.0f} CTC, you qualify for 100% tax rebate under Section 87A (New Regime). You pay ₹0 tax without needing to lock funds in 3-year ELSS or 15-year PPF.")
        wealth_tips.append("Take advantage of the ₹12L New Regime zero-tax window by investing freely in high-growth equity mutual funds without lock-in.")
    elif is_new_winner:
        # Calculate exactly how much additional deduction is required to beat New Regime
        deduction_gap = max(0, round(savings / slab_rate))
        action_items.append(f"New Regime is your clear winner, saving ₹{savings:,.0f}. To make Old Regime break-even, you would need an extra ₹{deduction_gap:,.0f} in eligible deductions (HRA rent or Home Loan Section 24b).")
    else:
        action_items.append(f"Your extensive deduction claims (₹{total_ded:,.0f}) beat the New Regime slabs, securing you an effective ₹{savings:,.0f} tax advantage in Old Regime.")

    # 2. Corporate NPS 80CCD(2) with exact calculated rupee impact
    corp_nps_est = round((income * 0.45) * 0.10) # 10% of estimated basic
    corp_nps_tax_shield = round(corp_nps_est * slab_rate)
    action_items.append(f"Corporate NPS (Sec 80CCD(2)): Request your HR to restructure ₹{corp_nps_est:,.0f}/yr into Employer NPS to legally shield ₹{corp_nps_tax_shield:,.0f} extra tax under both regimes.")

    # 3. Specific unutilized limits
    if req.section80C < 150000 and not (income <= 1200000 and is_new_winner):
        rem_80c = 150000 - req.section80C
        action_items.append(f"Section 80C Headroom: Depositing ₹{rem_80c:,.0f} before March 31 shields an additional ₹{round(rem_80c * slab_rate):,.0f} in tax under Old Regime.")

    if req.section80D < 25000 and not (income <= 1200000 and is_new_winner):
        rem_80d = 25000 - req.section80D
        action_items.append(f"Section 80D Health: Claim ₹{rem_80d:,.0f} unutilized balance (includes up to ₹5,000 for preventive health checkups).")

    # 4. Wealth Compounding Strategy
    if savings > 0:
        wealth_15yr = round((savings / 12) * ((pow(1 + 0.01, 180) - 1) / 0.01) * 1.01)
        wealth_tips.append(f"Direct your ₹{round(savings / 12):,.0f}/mo tax savings into a Nifty 50 Index SIP. In 15 years @ 12% CAGR, this compounds to ~₹{(wealth_15yr / 100000):,.1f} Lakhs in pure wealth.")

    return action_items[:4], wealth_tips

def process_tax_calculation(req: TaxCalculationRequest) -> Dict[str, Any]:
    """Orchestrates full tax evaluation with corrected Old vs New deductions and winner logic."""
    adv_ded = calculate_advanced_deductions(req)
    
    # Old Regime Standard Deduction is ₹50,000 (New Regime is ₹75,000)
    old_std_deduction = 50000.0

    # Old Regime deductions breakdown
    old_deductions = {
        "standard_deduction": old_std_deduction,
        "section80C": min(req.section80C, 150000.0),
        "section80D": min(req.section80D, 100000.0),
        "hra": min(req.hra, req.income * 0.5),  # HRA capped at 50% max
        "home_loan_interest": min(req.home_loan_interest, 200000.0),
        "edu_loan_interest": req.edu_loan_interest,
        "donations": req.donations,
        "advanced_deductions": adv_ded,
    }
    
    total_old_deductions = sum(old_deductions.values())
    old_tax = calculate_old_regime_tax(req.income, total_old_deductions)
    new_tax = calculate_new_regime_tax(req.income, req.standard_deduction)

    # WINNER LOGIC: The LOWER tax MUST win!
    # Savings is the positive difference saved by choosing the winner.
    if new_tax < old_tax:
        winner = "New Regime"
        savings = old_tax - new_tax
        comparison = f"New Regime saves ₹{savings:,.0f} compared to Old Regime."
        is_new_winner = True
    elif old_tax < new_tax:
        winner = "Old Regime"
        savings = new_tax - old_tax
        comparison = f"Old Regime saves ₹{savings:,.0f} compared to New Regime."
        is_new_winner = False
    else:
        winner = "Tie"
        savings = 0.0
        comparison = "Both regimes result in the exact same tax liability."
        is_new_winner = False

    # Used deductions vs total eligible (80C 1.5L + 80D 1L + HRA 50% + HomeLoan 2L + Std 50k)
    max_deduction_target = 150000.0 + 75000.0 + 200000.0 + 50000.0 + min(req.income * 0.4, 250000.0)
    used_amount = total_old_deductions
    score = min(100, max(0, round((used_amount / max_deduction_target) * 100)))

    suggestions, wealth_tips = generate_suggestions(req, old_deductions, is_new_winner, savings)

    return {
        "old_regime_tax": round(old_tax),
        "new_regime_tax": round(new_tax),
        "savings": round(savings),
        "winner": winner,
        "regime_comparison": comparison,
        "optimization_suggestions": suggestions,
        "optimization_score": score,
        "used_deductions": round(used_amount),
        "target_deductions": round(max_deduction_target),
        "investment_suggestions": wealth_tips,
        "deductions_breakdown": old_deductions,
    }
