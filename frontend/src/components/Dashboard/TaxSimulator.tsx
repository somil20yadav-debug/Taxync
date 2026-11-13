import React, { useState } from 'react';
import { Sliders, TrendingUp, Sparkles } from 'lucide-react';
import { TaxResult, TaxFormData } from '../../api';
import { AnimatedCounter } from '../AnimatedCounter';

interface TaxSimulatorProps {
  formData: TaxFormData;
  taxResult: TaxResult | null;
}

export const TaxSimulator: React.FC<TaxSimulatorProps> = ({ formData, taxResult }) => {
  const [hikePercentage, setHikePercentage] = useState(10);
  const [extraInvestment, setExtraInvestment] = useState(50000);

  if (!taxResult || !formData.income) return null;

  const projectedIncome = Math.round(formData.income * (1 + hikePercentage / 100));
  const taxSavedWithExtra = Math.round(extraInvestment * 0.20); // 20% slab estimation

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-6 border border-[#E7E2D7] dark:border-slate-800 shadow-sm space-y-5 transition-colors duration-200">
      <div className="flex items-center space-x-3 pb-3 border-b border-[#E7E2D7] dark:border-slate-800">
        <div className="p-2.5 bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#8B5CF6] rounded-xl">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>'What If?' Tax Projection Simulator</span>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-full flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> Interactive
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Simulate salary increments and strategic deductions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Hike Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Expected Appraisal: {hikePercentage}%</span>
            <span className="text-[#7C3AED] dark:text-[#8B5CF6] font-mono font-bold">
              ₹{projectedIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            value={hikePercentage}
            onChange={(e) => setHikePercentage(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(hikePercentage / 50) * 100}%, rgba(148, 163, 184, 0.2) ${(hikePercentage / 50) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6] transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0% (Same)</span>
            <span>25% (Hike)</span>
            <span>50% (Promo)</span>
          </div>
        </div>

        {/* Extra Investment Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-400">Additional Investment (NPS/ELSS)</span>
            <span className="text-[#0D9488] dark:text-[#2DD4BF] font-mono font-bold">
              ₹{extraInvestment.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200000"
            step="5000"
            value={extraInvestment}
            onChange={(e) => setExtraInvestment(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #2DD4BF 0%, #2DD4BF ${(extraInvestment / 200000) * 100}%, rgba(148, 163, 184, 0.2) ${(extraInvestment / 200000) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>₹0</span>
            <span>₹1,00,000</span>
            <span>₹2,00,000</span>
          </div>
        </div>
      </div>

      {/* Projection Summary Pill */}
      <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-500">Projected CTC: </span>
          <span className="font-bold text-slate-900 dark:text-white font-mono">₹{projectedIncome.toLocaleString('en-IN')}</span>
          <span className="text-slate-400 ml-2 font-mono">(+₹{(projectedIncome - formData.income).toLocaleString('en-IN')})</span>
        </div>
        <div className="text-[#0D9488] dark:text-[#2DD4BF] font-bold flex items-center gap-1 font-mono">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Potential Additional Savings: <AnimatedCounter value={taxSavedWithExtra} />/yr</span>
        </div>
      </div>
    </div>
  );
};
