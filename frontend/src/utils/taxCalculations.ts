export interface TaxInput {
  income: number;
  deductions: number;
}

export interface TaxResult {
  oldRegimeTax: number;
  newRegimeTax: number;
  savings: number;
  oldRegimeBreakdown: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
  newRegimeBreakdown: {
    taxableIncome: number;
    tax: number;
    effectiveRate: number;
  };
}

export function calculateTax(input: TaxInput): TaxResult {
  const { income, deductions } = input;
  
  // Old Regime: allow standard deduction + 80C/80D/etc. via aggregated deductions
  const oldRegimeTax = calculateOldRegimeTax(income, deductions);
  
  // New Regime: standard deduction only (₹50,000 by default)
  const newRegimeTax = calculateNewRegimeTax(income, 50000);
  
  const savings = oldRegimeTax - newRegimeTax;
  
  return {
    oldRegimeTax,
    newRegimeTax,
    savings,
    oldRegimeBreakdown: {
      taxableIncome: Math.max(0, income - deductions),
      tax: oldRegimeTax,
      effectiveRate: income > 0 ? (oldRegimeTax / income) * 100 : 0
    },
    newRegimeBreakdown: {
      taxableIncome: Math.max(0, income - 50000),
      tax: newRegimeTax,
      effectiveRate: income > 0 ? (newRegimeTax / income) * 100 : 0
    }
  };
}

/**
 * Old Regime (FY 2025-26) with deductions
 * - Standard deduction: ₹50,000 for salaried
 * - Slabs: 0–2.5L: 0%, 2.5–5L: 5%, 5–10L: 20%, 10L+: 30%
 * - Section 87A rebate: 100% tax rebate if taxable <= ₹5,00,000
 * - Applies 4% cess at the end and rounds to nearest integer
 */
export function calculateOldRegimeTax(income: number, totalDeductions: number): number {
  const taxableIncome = Math.max(0, (income || 0) - (totalDeductions || 0));
  if (taxableIncome <= 500000) return 0;
  const tax = computeOldRegimeSlabTax(taxableIncome);
  return Math.round(tax * 1.04);
}

/**
 * New Regime (FY 2025-26) with standard deduction
 * - Standard deduction: ₹75,000
 * - Slabs: 0-4L: Nil, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, >24L: 30%
 * - Sec 87A rebate: Tax free up to ₹12,00,000 taxable income
 * - Marginal relief: Capped if income slightly exceeds ₹12,00,000
 * - Applies 4% cess at the end and rounds to nearest integer
 */
export function calculateNewRegimeTax(income: number, standardDeduction: number = 75000): number {
  const taxableIncome = Math.max(0, (income || 0) - (standardDeduction || 0));
  if (taxableIncome <= 1200000) return 0;
  let tax = computeNewRegimeSlabTax(taxableIncome);
  
  // Section 87A Marginal Relief
  const excess = taxableIncome - 1200000;
  if (tax > excess) {
    tax = excess;
  }
  
  return Math.round(tax * 1.04);
}

// Internal helpers: slab-wise computation without cess/rounding
function computeOldRegimeSlabTax(taxableIncome: number): number {
  if (taxableIncome <= 250000) return 0;
  if (taxableIncome <= 500000) return (taxableIncome - 250000) * 0.05;
  if (taxableIncome <= 1000000) return 12500 + (taxableIncome - 500000) * 0.20;
  return 112500 + (taxableIncome - 1000000) * 0.30;
}

function computeNewRegimeSlabTax(taxableIncome: number): number {
  const slabs = [
    { threshold: 2400000, rate: 0.30 },
    { threshold: 2000000, rate: 0.25 },
    { threshold: 1600000, rate: 0.20 },
    { threshold: 1200000, rate: 0.15 },
    { threshold: 800000, rate: 0.10 },
    { threshold: 400000, rate: 0.05 },
  ];
  let tax = 0;
  let rem = taxableIncome;
  for (const s of slabs) {
    if (rem > s.threshold) {
      tax += (rem - s.threshold) * s.rate;
      rem = s.threshold;
    }
  }
  return tax;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}