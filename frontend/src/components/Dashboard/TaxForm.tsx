import React from 'react';
import { 
  Calculator, 
  Home, 
  PiggyBank, 
  Heart, 
  GraduationCap, 
  Gift, 
  ChevronDown, 
  RefreshCw,
  Check,
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { TaxFormData } from '../../api';

interface TaxFormProps {
  formData: TaxFormData;
  onChange: (field: keyof TaxFormData, value: number | string) => void;
  onCalculate: () => void;
  onReset: () => void;
  onOpenScanner?: () => void;
  isCalculating: boolean;
  showAdvanced: boolean;
  setShowAdvanced: (val: boolean) => void;
}

export const TaxForm: React.FC<TaxFormProps> = ({
  formData,
  onChange,
  onCalculate,
  onReset,
  onOpenScanner,
  isCalculating,
  showAdvanced,
  setShowAdvanced,
}) => {
  const handleNumChange = (field: keyof TaxFormData, val: string) => {
    const raw = val.replace(/,/g, '');
    const num = Math.max(0, parseFloat(raw) || 0);
    onChange(field, num);
  };

  // Inline Validation Warnings
  const warnings = {
    section80C: formData.section80C > 150000 ? 'Section 80C deduction is legally capped at ₹1,50,000' : null,
    section80D: formData.section80D > 100000 ? 'Section 80D deduction cannot exceed ₹1,00,000' : null,
    hra: formData.income > 0 && formData.hra > formData.income * 0.5 ? 'HRA exemption cannot exceed 50% of income' : null,
    homeLoanInterest: formData.homeLoanInterest > 200000 ? 'Section 24(b) interest is capped at ₹2,00,000' : null,
  };

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-6 sm:p-7 border border-[#E7E2D7] dark:border-[#26304A] shadow-sm transition-colors duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-[#E7E2D7] dark:border-[#26304A] gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#8B5CF6]/10 rounded-xl text-[#7C3AED] dark:text-[#8B5CF6]">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Step 1: Your Income & Deductions</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#0B1020] text-slate-500">
                FY 2025-26
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8]">Enter values manually or let the scanner auto-fill</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {onOpenScanner && (
            <button
              type="button"
              onClick={onOpenScanner}
              className="py-2 px-3.5 rounded-xl border border-dashed border-[#8B5CF6] bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#8B5CF6] flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 shadow-sm group"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] dark:text-[#8B5CF6] group-hover:rotate-12 transition-transform" />
              <span>Auto-Scan Payslip / Form 16</span>
            </button>
          )}
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#8B5CF6] flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#0B1020]"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="space-y-5 text-xs">
        {/* Core Inputs Grid (3 cols on desktop, 2 on tablet, 1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gross Income */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block font-semibold text-slate-700 dark:text-[#A5B0C8] mb-1.5 flex items-center justify-between">
              <span>Annual Gross Income (CTC)</span>
              <span className="text-xs text-[#0D9488] dark:text-[#2DD4BF] font-mono font-bold">
                ₹{formData.income.toLocaleString('en-IN')}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono">₹</span>
              <input
                type="number"
                value={formData.income || ''}
                onChange={(e) => handleNumChange('income', e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] transition-all font-mono text-sm font-semibold"
                placeholder="e.g. 1200000"
              />
            </div>
          </div>

          {/* Section 80C */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700 dark:text-[#A5B0C8] flex items-center gap-1.5">
                <PiggyBank className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
                <span>Section 80C (PPF, ELSS, EPF)</span>
              </label>
              <button
                type="button"
                onClick={() => onChange('section80C', 150000)}
                className="text-[10px] font-bold text-[#7C3AED] dark:text-[#8B5CF6] hover:underline"
              >
                [Max ₹1.5L]
              </button>
            </div>
            <input
              type="number"
              value={formData.section80C || ''}
              onChange={(e) => handleNumChange('section80C', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono text-sm"
              placeholder="0"
            />
            {warnings.section80C && (
              <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-1 font-medium">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>{warnings.section80C}</span>
              </div>
            )}
          </div>

          {/* HRA */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#A5B0C8] mb-1.5 flex items-center gap-1">
              <Home className="h-3.5 w-3.5 text-blue-400" /> HRA Rent Exemption
            </label>
            <input
              type="number"
              value={formData.hra || ''}
              onChange={(e) => handleNumChange('hra', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono text-sm"
              placeholder="0"
            />
            {warnings.hra && (
              <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>Max 50% income</span>
              </div>
            )}
          </div>

          {/* 80D Health Insurance */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#A5B0C8] mb-1.5 flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-[#FB7185]" /> 80D Health Insurance
            </label>
            <input
              type="number"
              value={formData.section80D || ''}
              onChange={(e) => handleNumChange('section80D', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono text-sm"
              placeholder="0"
            />
            {warnings.section80D && (
              <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>Max ₹1,00,000</span>
              </div>
            )}
          </div>

          {/* Home Loan Interest (24b) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#A5B0C8] mb-1.5">
              Home Loan Interest (Sec 24b)
            </label>
            <input
              type="number"
              value={formData.homeLoanInterest || ''}
              onChange={(e) => handleNumChange('homeLoanInterest', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono text-sm"
              placeholder="0"
            />
            {warnings.homeLoanInterest && (
              <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-1">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span>Max ₹2,00,000</span>
              </div>
            )}
          </div>

          {/* Edu Loan (80E) */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-[#A5B0C8] mb-1.5 flex items-center gap-1">
              <GraduationCap className="h-3.5 w-3.5 text-amber-400" /> Education Loan (80E)
            </label>
            <input
              type="number"
              value={formData.educationLoan || ''}
              onChange={(e) => handleNumChange('educationLoan', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white focus:outline-none focus:border-[#8B5CF6] font-mono text-sm"
              placeholder="0"
            />
          </div>
        </div>

        {/* Additional Deductions: Bordered row, rotating chevron, 250ms slide-open */}
        <div className="rounded-xl border border-[#E7E2D7] dark:border-[#26304A] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-3 text-xs font-semibold text-[#7C3AED] dark:text-[#8B5CF6] bg-[#FAF8F5]/50 dark:bg-[#0B1020]/50 hover:bg-slate-100 dark:hover:bg-[#0B1020] transition-colors"
          >
            <span>Additional Deductions (80U, 80EEB, 80G, 80QQB)</span>
            <ChevronDown className={`h-4 w-4 transform transition-transform duration-[250ms] ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>

          <div 
            className={`transition-all duration-[250ms] ease-in-out overflow-hidden ${
              showAdvanced ? 'max-h-80 p-3 border-t border-[#E7E2D7] dark:border-[#26304A]' : 'max-h-0'
            }`}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-slate-500 dark:text-[#A5B0C8] mb-1">Section 80U Disability Status</label>
                <select
                  value={formData.section80U || 'none'}
                  onChange={(e) => onChange('section80U', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#E7E2D7] dark:border-[#26304A] bg-white dark:bg-[#131A2E] text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="none">None</option>
                  <option value="standard">Standard Disability (₹75,000)</option>
                  <option value="severe">Severe Disability (₹1,25,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 dark:text-[#A5B0C8] mb-1">EV Loan (80EEB)</label>
                  <input
                    type="number"
                    value={formData.evLoanInterest || ''}
                    onChange={(e) => handleNumChange('evLoanInterest', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E2D7] dark:border-[#26304A] bg-white dark:bg-[#131A2E] text-slate-800 dark:text-slate-200 outline-none font-mono"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-[#A5B0C8] mb-1">Charity (80G)</label>
                  <input
                    type="number"
                    value={formData.donations || ''}
                    onChange={(e) => handleNumChange('donations', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E7E2D7] dark:border-[#26304A] bg-white dark:bg-[#131A2E] text-slate-800 dark:text-slate-200 outline-none font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solid violet button, 48px, 12px radius, soft glow, auto width desktop, with live updated state */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-[#0D9488] dark:text-[#2DD4BF] font-semibold">
            <Check className="h-3.5 w-3.5" />
            <span>Updated just now</span>
          </div>

          <button
            onClick={onCalculate}
            disabled={!formData.income}
            style={{ height: '48px', borderRadius: '12px' }}
            className="w-full sm:w-auto px-6 font-bold text-white bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] dark:hover:bg-[#7C3AED] shadow-[0_4px_14px_rgba(139,92,246,0.25)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.35)] transition-all flex items-center justify-center gap-2 self-end shrink-0 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isCalculating ? 'animate-spin text-white' : 'text-white/80'}`} />
            <span>Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
