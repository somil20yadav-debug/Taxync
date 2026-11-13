import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, LineChart as LineIcon, CheckCircle } from 'lucide-react';
import { TaxResult, TaxFormData } from '../../api';

interface TaxAnalyticsProps {
  taxResult: TaxResult | null;
  formData: TaxFormData;
}

export const TaxAnalytics: React.FC<TaxAnalyticsProps> = ({ taxResult, formData }) => {
  const [activeTab, setActiveTab] = useState<'bars' | 'donut' | 'curve'>('bars');
  const [timeframe, setTimeframe] = useState<'annual' | 'monthly'>('annual');

  if (!taxResult) return null;

  const divisor = timeframe === 'monthly' ? 12 : 1;
  const oldTax = Math.round(taxResult.old_regime_tax / divisor);
  const newTax = Math.round(taxResult.new_regime_tax / divisor);
  const maxTax = Math.max(oldTax, newTax, 1);

  // The LOWER tax must win!
  const isOldWinner = oldTax < newTax;
  const isNewWinner = newTax < oldTax;
  const savings = Math.abs(oldTax - newTax);

  const oldHeightPct = Math.max(12, Math.round((oldTax / maxTax) * 100));
  const newHeightPct = Math.max(12, Math.round((newTax / maxTax) * 100));

  // Donut slices
  const totalDeductions = (
    (formData.section80C || 0) +
    (formData.section80D || 0) +
    (formData.hra || 0) +
    (formData.homeLoanInterest || 0) +
    50000 // standard deduction
  ) / divisor;

  const taxableIncome = Math.max(0, (formData.income / divisor) - totalDeductions);
  const taxPayable = isNewWinner ? newTax : oldTax;

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-6 border border-[#E7E2D7] dark:border-[#26304A] shadow-sm transition-colors duration-300">
      {/* Header with 3 Graph Tabs & Timeframe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E7E2D7] dark:border-[#26304A] gap-3">
        {/* Graph Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0B1020] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('bars')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'bars'
                ? 'bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Comparison</span>
          </button>
          <button
            onClick={() => setActiveTab('donut')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'donut'
                ? 'bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PieIcon className="h-3.5 w-3.5" />
            <span>Deductions</span>
          </button>
          <button
            onClick={() => setActiveTab('curve')}
            className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'curve'
                ? 'bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LineIcon className="h-3.5 w-3.5" />
            <span>Tax Curve</span>
          </button>
        </div>

        {/* Timeframe Toggle */}
        <div className="bg-slate-100 dark:bg-[#0B1020] p-1 rounded-xl flex text-xs self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('annual')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              timeframe === 'annual' 
                ? 'bg-white dark:bg-[#131A2E] shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500'
            }`}
          >
            Annual
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              timeframe === 'monthly' 
                ? 'bg-white dark:bg-[#131A2E] shadow-sm text-slate-900 dark:text-white' 
                : 'text-slate-500'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Tab 1: Bars with Value Labels, Savings between Bars & Winner Mint Glow */}
      {activeTab === 'bars' && (
        <div className="pt-2">
          {/* Break-even indicator */}
          <div className="text-center mb-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-[#A5B0C8] bg-[#FAF8F5] dark:bg-[#0B1020] px-3 py-1 rounded-full border border-[#E7E2D7] dark:border-slate-800">
              Break-Even Point: Total deductions of ~₹3.75 Lakhs balances both regimes
            </span>
          </div>

          <div className="h-52 flex items-end justify-center gap-8 sm:gap-16 px-4 relative">
            {/* Old Regime Bar */}
            <div className="flex flex-col items-center flex-1 max-w-[110px] h-full justify-end">
              {/* Value label above bar */}
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mb-2">
                ₹{oldTax.toLocaleString('en-IN')}
              </span>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${oldHeightPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className={`w-full rounded-t-xl transition-all ${
                  isOldWinner
                    ? 'bg-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.45)]'
                    : 'bg-[#FB7185]'
                }`}
              />

              <div className="mt-3 text-center">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Old Regime</span>
                {isOldWinner && (
                  <span className="text-[10px] font-black text-[#0D9488] dark:text-[#2DD4BF] uppercase">WINNER</span>
                )}
              </div>
            </div>

            {/* Savings shown between bars */}
            <div className="flex flex-col items-center justify-center pb-12">
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-slate-800 text-center shadow-sm">
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Difference</span>
                <span className="text-xs font-mono font-black text-[#0D9488] dark:text-[#2DD4BF]">
                  ₹{savings.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* New Regime Bar */}
            <div className="flex flex-col items-center flex-1 max-w-[110px] h-full justify-end">
              {/* Value label above bar */}
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200 mb-2">
                ₹{newTax.toLocaleString('en-IN')}
              </span>

              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${newHeightPct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className={`w-full rounded-t-xl transition-all ${
                  isNewWinner
                    ? 'bg-[#2DD4BF] shadow-[0_0_20px_rgba(45,212,191,0.45)]'
                    : 'bg-[#FB7185]'
                }`}
              />

              <div className="mt-3 text-center">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">New Regime</span>
                {isNewWinner && (
                  <span className="text-[10px] font-black text-[#0D9488] dark:text-[#2DD4BF] uppercase">WINNER</span>
                )}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-3 border-t border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-center gap-6 text-[11px] text-slate-500 dark:text-[#A5B0C8]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] shadow-sm shadow-[#2DD4BF]" />
              <span>Lower Tax Winner (Mint)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
              <span>Higher Tax Liability (Rose)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Interactive SVG Donut Draw-On */}
      {activeTab === 'donut' && (
        <div className="py-4 flex flex-col sm:flex-row items-center justify-around gap-6">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-[#0B1020]" />
              {/* Deductions Slice */}
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                stroke="#2DD4BF"
                strokeWidth="12"
                strokeDasharray="238.7"
                initial={{ strokeDashoffset: 238.7 }}
                animate={{ strokeDashoffset: 238.7 * (1 - Math.min(1, totalDeductions / (formData.income || 1))) }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Deductions</span>
              <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                ₹{Math.round(totalDeductions).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2DD4BF]" />
              <span className="text-slate-600 dark:text-[#A5B0C8]">Total Deductions Claimed:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">₹{Math.round(totalDeductions).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
              <span className="text-slate-600 dark:text-[#A5B0C8]">Net Taxable Base:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">₹{Math.round(taxableIncome).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FB7185]" />
              <span className="text-slate-600 dark:text-[#A5B0C8]">Final Optimal Tax:</span>
              <span className="font-bold font-mono text-slate-900 dark:text-white">₹{taxPayable.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive SVG Micro-Curves with Scrubber Needle */}
      {activeTab === 'curve' && (
        <div className="py-2 text-xs space-y-4">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF]" /> New Regime (FY 25-26)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" /> Old Regime
              </span>
            </div>
            <span className="text-[10px] text-slate-400">
              Interactive Cross-Over Curve (₹4L - ₹32L)
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-56 bg-[#FAF8F5] dark:bg-[#0B1020] rounded-2xl p-4 border border-[#E7E2D7] dark:border-[#26304A] overflow-hidden group">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="mintGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" strokeDasharray="3 3" className="text-slate-200 dark:text-slate-800" />

              {/* Old Regime Curve (Violet) */}
              <motion.path
                d="M 0 150 Q 150 145, 230 115 T 500 20"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* New Regime Curve (Mint - flat up to 12L due to 87A rebate, then climbs gentler) */}
              <motion.path
                d="M 0 150 L 187 150 Q 250 140, 340 100 T 500 45"
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              />

              {/* ₹12L Zero-Tax Horizon Marker */}
              <line x1="187" y1="10" x2="187" y2="150" stroke="#2DD4BF" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

              {/* Current Income Scrubber Indicator */}
              {(() => {
                const clampedInc = Math.min(3200000, Math.max(400000, formData.income || 1200000));
                const scrubberX = Math.round(((clampedInc - 400000) / (3200000 - 400000)) * 500);
                return (
                  <g>
                    <line x1={scrubberX} y1="0" x2={scrubberX} y2="155" stroke="#FFFFFF" strokeWidth="2" className="drop-shadow-md" />
                    <circle cx={scrubberX} cy="148" r="5" fill="#2DD4BF" stroke="#FFFFFF" strokeWidth="2" />
                  </g>
                );
              })()}
            </svg>

            {/* Income Labels Along Bottom */}
            <div className="absolute bottom-1 left-4 right-4 flex justify-between text-[9px] font-mono text-slate-400 pointer-events-none">
              <span>₹4 Lakhs</span>
              <span className="text-[#0D9488] dark:text-[#2DD4BF] font-bold">₹12 Lakhs (87A Zero-Tax)</span>
              <span>₹20 Lakhs</span>
              <span>₹32 Lakhs</span>
            </div>

            {/* Dynamic Floating Callout */}
            <div className="absolute top-3 right-4 bg-white/90 dark:bg-[#131A2E]/90 backdrop-blur-md p-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] shadow-md text-[11px] pointer-events-none">
              <span className="text-slate-500 dark:text-[#A5B0C8] block text-[9px] uppercase font-bold">Current CTC Position</span>
              <div className="font-mono font-bold text-slate-900 dark:text-white">
                ₹{formData.income.toLocaleString('en-IN')}
                <span className={`ml-1.5 text-[10px] ${isNewWinner ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-[#8B5CF6]'}`}>
                  ({isNewWinner ? 'New Regime Wins' : 'Old Regime Wins'})
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-[#A5B0C8]">
              💡 <strong>Key Takeaway:</strong> Under the Finance Act 2025, New Regime stays at <strong>₹0 tax</strong> all the way up to ₹12 Lakhs. Old regime only matches if deductions exceed ₹4.25 Lakhs.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
