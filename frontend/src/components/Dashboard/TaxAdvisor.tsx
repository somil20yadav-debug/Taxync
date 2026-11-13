import React from 'react';
import { Lightbulb, TrendingUp, CheckCircle2 } from 'lucide-react';
import { TaxResult } from '../../api';

interface TaxAdvisorProps {
  taxResult: TaxResult | null;
}

export const TaxAdvisor: React.FC<TaxAdvisorProps> = ({ taxResult }) => {
  if (!taxResult) return null;

  const suggestions = taxResult.optimization_suggestions || taxResult.suggestions || [];
  const investmentTips = taxResult.investment_suggestions || [];

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-6 border border-[#E7E2D7] dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-200">
      <div className="flex items-center space-x-3 pb-3 border-b border-[#E7E2D7] dark:border-slate-800">
        <div className="p-2.5 bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#8B5CF6] rounded-xl">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Strategic Tax Advisor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Actionable steps to legally minimize tax</p>
        </div>
      </div>

      {/* Actionable Deductions Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Optimization Roadmap
          </div>
          <div className="grid grid-cols-1 gap-2">
            {suggestions.map((item: any, idx: number) => {
              const text = typeof item === 'string' ? item : item.description || item.title;
              return (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-slate-800 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#0D9488] dark:text-[#2DD4BF] mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Wealth Creation Tips */}
      {investmentTips.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#E7E2D7] dark:border-slate-800">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#2DD4BF]" /> Wealth Creation Strategy
          </div>
          <div className="grid grid-cols-1 gap-2">
            {investmentTips.map((tip: string, idx: number) => (
              <div 
                key={idx}
                className="p-3 rounded-xl bg-[#2DD4BF]/5 border border-[#2DD4BF]/20 text-xs text-slate-700 dark:text-slate-300"
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
