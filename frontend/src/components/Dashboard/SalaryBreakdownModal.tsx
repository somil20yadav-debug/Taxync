import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  HelpCircle, 
  IndianRupee, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Wallet, 
  X,
  CreditCard,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface SalaryBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  annualIncome: number;
  annualTax: number;
  regimeName: string;
}

export const SalaryBreakdownModal: React.FC<SalaryBreakdownModalProps> = ({
  isOpen,
  onClose,
  annualIncome,
  annualTax,
  regimeName
}) => {
  const [epfType, setEpfType] = useState<'statutory' | 'actual'>('statutory');

  if (!isOpen) return null;

  const monthlyGross = Math.round(annualIncome / 12);
  const monthlyTax = Math.round(annualTax / 12);
  const monthlyPT = 200; // Flat ₹200/mo across major states (KA, MH, etc.)

  // Basic salary is typically 40% to 50% of CTC
  const estimatedBasic = Math.round(monthlyGross * 0.45);
  // EPF: Statutory cap is ₹1,800/mo (12% of 15,000) or Actual 12% of Basic
  const monthlyEPF = epfType === 'statutory' ? 1800 : Math.round(estimatedBasic * 0.12);

  const totalDeductions = monthlyEPF + monthlyPT + monthlyTax;
  const netInHand = Math.max(0, monthlyGross - totalDeductions);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25 }}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#131A2E] border border-[#E7E2D7] dark:border-[#26304A] rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1020]/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF]">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Monthly Bank Credit Breakdown
                </h3>
                <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
                  From Annual CTC to 1st of the month salary credit
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* EPF Preference Selector */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/70 dark:bg-[#0B1020]/60 border border-[#E7E2D7] dark:border-[#26304A]">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Employee PF (EPF) Scheme:
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setEpfType('statutory')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    epfType === 'statutory'
                      ? 'bg-white dark:bg-[#131A2E] text-[#7C3AED] dark:text-[#8B5CF6] shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Statutory (₹1,800/mo)
                </button>
                <button
                  onClick={() => setEpfType('actual')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    epfType === 'actual'
                      ? 'bg-white dark:bg-[#131A2E] text-[#7C3AED] dark:text-[#8B5CF6] shadow-xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  12% of Basic
                </button>
              </div>
            </div>

            {/* Waterfall Ledger Breakdown */}
            <div className="space-y-3 font-mono text-xs">
              {/* Gross CTC */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#0B1020]/40">
                <span className="font-sans font-medium text-slate-600 dark:text-slate-400">
                  Gross Monthly CTC (₹{(annualIncome / 100000).toFixed(1)} LPA ÷ 12)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  + ₹{monthlyGross.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Deductions Sub-block */}
              <div className="pl-3 border-l-2 border-rose-300 dark:border-rose-800 space-y-2">
                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                  <span className="font-sans">
                    Employee PF Contribution (12%)
                  </span>
                  <span>- ₹{monthlyEPF.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                  <span className="font-sans">
                    Professional Tax (PT)
                  </span>
                  <span>- ₹{monthlyPT.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                  <span className="font-sans">
                    Income Tax (TDS under {regimeName})
                  </span>
                  <span>- ₹{monthlyTax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Net In-Hand Highlight Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-[#2DD4BF]/15 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-sans font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Net Take-Home Bank Credit
                  </div>
                  <div className="text-[10px] font-sans text-slate-500 dark:text-[#A5B0C8] mt-0.5">
                    Amount credited to salary account on 1st of month
                  </div>
                </div>
                <div className="text-xl font-black text-emerald-600 dark:text-[#2DD4BF]">
                  ₹{netInHand.toLocaleString('en-IN')}
                  <span className="text-xs font-normal">/mo</span>
                </div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="p-3 bg-slate-50 dark:bg-[#0B1020]/60 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] text-[11px] text-slate-600 dark:text-[#A5B0C8] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-[#8B5CF6] shrink-0 mt-0.5" />
              <span>
                <strong>Why is this less than CTC ÷ 12?</strong> In India, CTC includes employer PF match, gratuity accrual, and variable performance bonuses not paid in monthly payroll.
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
