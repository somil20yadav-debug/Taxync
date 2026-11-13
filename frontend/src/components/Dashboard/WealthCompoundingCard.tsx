import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sparkles, Coins, HelpCircle } from 'lucide-react';
import { AnimatedCounter } from '../AnimatedCounter';

interface WealthCompoundingCardProps {
  annualSavings: number;
}

export const WealthCompoundingCard: React.FC<WealthCompoundingCardProps> = ({ annualSavings }) => {
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(12); // 12% Nifty 50 historical average

  if (!annualSavings || annualSavings <= 0) return null;

  // Future Value of Ordinary Annuity: P * [((1 + r)^n - 1) / r]
  const r = rate / 100;
  const futureWealth = Math.round(annualSavings * ((Math.pow(1 + r, years) - 1) / r));
  const totalInvested = annualSavings * years;
  const wealthGain = futureWealth - totalInvested;

  const inCrores = (futureWealth / 10000000).toFixed(2);
  const inLakhs = (futureWealth / 100000).toFixed(1);

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-6 border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-5 transition-colors duration-300">
      <div className="flex items-center space-x-3 pb-3 border-b border-[#E7E2D7] dark:border-[#26304A]">
        <div className="p-2.5 bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] rounded-xl">
          <Coins className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <span>The Silent Wealth Gap</span>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6] rounded-full">
              Opportunity Cost
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
            What happens if you invest your annual tax savings instead of losing it?
          </p>
        </div>
      </div>

      {/* Hero Compounded Value Display */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-[#131A2E] text-white border border-[#26304A] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Compounded Wealth ({years} Years @ {rate}% CAGR)
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-[#2DD4BF] mt-0.5">
            {futureWealth >= 10000000 ? `₹${inCrores} Crores` : `₹${inLakhs} Lakhs`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Investing ₹{annualSavings.toLocaleString('en-IN')}/year creates <span className="text-white font-semibold">₹{(wealthGain).toLocaleString('en-IN')} in pure profit</span>.
          </p>
        </div>

        <div className="text-right sm:border-l sm:border-slate-800 sm:pl-5 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Invested</span>
          <span className="text-sm font-bold font-mono text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        {/* Years Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-600 dark:text-[#A5B0C8]">Time Horizon</span>
            <span className="font-mono text-[#7C3AED] dark:text-[#8B5CF6] font-bold">{years} Years</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${((years - 1) / 29) * 100}%, rgba(148, 163, 184, 0.2) ${((years - 1) / 29) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#8B5CF6] transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>1 yr</span>
            <span>15 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Expected CAGR Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-semibold">
            <span className="text-slate-600 dark:text-[#A5B0C8]">Expected Annual Return (CAGR)</span>
            <span className="font-mono text-[#0D9488] dark:text-[#2DD4BF] font-bold">{rate}% (CAGR)</span>
          </div>
          <input
            type="range"
            min="6"
            max="18"
            step="0.5"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #2DD4BF 0%, #2DD4BF ${((rate - 6) / 12) * 100}%, rgba(148, 163, 184, 0.2) ${((rate - 6) / 12) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] transition-all"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>6% (FD/PPF)</span>
            <span>12% (Nifty Index)</span>
            <span>18% (Mid/Small Cap)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
