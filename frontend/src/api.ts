// Centralized API service for Tax Dashboard
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface TaxFormData {
  income: number;
  standardDeduction: number;
  section80C: number;
  hra: number;
  section80D: number;
  homeLoanInterest: number;
  educationLoan: number;
  donations: number;
  section80U?: string;
  royaltyIncome?: number;
  politicalDonation?: number;
  evLoanInterest?: number;
}

export interface TaxResult {
  old_regime_tax: number;
  new_regime_tax: number;
  savings: number;
  suggestions?: string[];
  optimization_score?: number;
  optimization_suggestions?: Array<{
    title: string;
    description: string;
    potential_savings: number;
    action_type: string;
  }>;
  [key: string]: any;
}

export interface CalculationData {
  formData: TaxFormData;
  result: TaxResult;
  timestamp: string;
}

// Calculate tax with form data
export const calculateTax = async (formData: TaxFormData): Promise<TaxResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculate-tax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        income: formData.income,
        section80C: formData.section80C,
        section80D: formData.section80D,
        hra: formData.hra,
        home_loan_interest: formData.homeLoanInterest,
        standard_deduction: formData.standardDeduction,
        edu_loan_interest: formData.educationLoan,
        donations: formData.donations,
        section80U: formData.section80U || 'none',
        royaltyIncome: formData.royaltyIncome || 0,
        politicalDonation: formData.politicalDonation || 0,
        evLoanInterest: formData.evLoanInterest || 0,
      }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        const err = await response.json();
        detail = err?.detail || JSON.stringify(err);
      } catch (_) {
        try {
          detail = await response.text();
        } catch (_) {
          detail = response.statusText;
        }
      }
      throw new Error(`API ${response.status}: ${detail}`);
    }

    const result = await response.json();

    const calculationData: CalculationData = {
      formData,
      result,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('lastTaxCalculation', JSON.stringify(calculationData));

    return result;
  } catch (error) {
    console.error('Calculate tax error:', error);
    throw error;
  }
};

// Get last calculation
export const getLastCalculation = async (): Promise<CalculationData | null> => {
  const stored = localStorage.getItem('lastTaxCalculation');
  return stored ? JSON.parse(stored) : null;
};

// Export PDF report
export const exportPDF = async (formData: TaxFormData, taxResult: TaxResult, chartImage?: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/export/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: {
          income: formData.income,
          section80C: formData.section80C,
          section80D: formData.section80D,
          hra: formData.hra,
          home_loan_interest: formData.homeLoanInterest,
          standard_deduction: formData.standardDeduction,
          edu_loan_interest: formData.educationLoan,
          donations: formData.donations,
        },
        taxResult,
        chartImage,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'tax-comparison-report.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Export PDF error:', error);
    throw error;
  }
};

// Export Excel report
export const exportExcel = async (formData: TaxFormData, taxResult: TaxResult): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/export/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: {
          income: formData.income,
          section80C: formData.section80C,
          section80D: formData.section80D,
          hra: formData.hra,
          home_loan_interest: formData.homeLoanInterest,
          standard_deduction: formData.standardDeduction,
          edu_loan_interest: formData.educationLoan,
          donations: formData.donations,
        },
        taxResult,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'tax-comparison-report.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Export Excel error:', error);
    throw error;
  }
};

// Create a shareable link for a report
export const createShareableLink = async (formData: TaxFormData, taxResult: TaxResult): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData, taxResult }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create shareable link.');
    }
    const data = await response.json();
    return `${window.location.origin}/shared-report/${data.reportId}`;
  } catch (error) {
    console.error('Create share link error:', error);
    throw error;
  }
};

export const getSharedReport = async (reportId: string): Promise<CalculationData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/share/${reportId}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch shared report.');
    }
    return await response.json();
  } catch (error) {
    console.error('Get shared report error:', error);
    throw error;
  }
};
