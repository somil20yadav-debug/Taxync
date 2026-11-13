import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Share2, 
  Check, 
  Award, 
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { TaxResult, TaxFormData, createShareableLink } from '../../api';
import { AnimatedCounter } from '../AnimatedCounter';
import { SalaryBreakdownModal } from './SalaryBreakdownModal';

interface TaxSummaryCardsProps {
  taxResult: TaxResult | null;
  formData: TaxFormData;
}

export const TaxSummaryCards: React.FC<TaxSummaryCardsProps> = ({ taxResult, formData }) => {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSalaryModal, setShowSalaryModal] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (!taxResult) {
    return (
      <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-8 border border-[#E7E2D7] dark:border-[#26304A] text-center shadow-sm">
        <div className="w-14 h-14 mx-auto mb-3 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center text-[#7C3AED] dark:text-[#8B5CF6]">
          <TrendingUp className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Calculate to Compare Regimes</h3>
        <p className="text-slate-500 dark:text-[#A5B0C8] text-xs max-w-sm mx-auto mt-1">
          Enter your income details on the left to see live tax calculations and savings advice.
        </p>
      </div>
    );
  }

  const income = formData.income || 1;
  const oldTax = taxResult.old_regime_tax;
  const newTax = taxResult.new_regime_tax;

  // WINNER LOGIC: The LOWER tax MUST win!
  const isNewWinner = newTax < oldTax;
  const isOldWinner = oldTax < newTax;
  const isTie = oldTax === newTax;
  const savings = Math.abs(oldTax - newTax);

  // Monthly In-Hand Cash
  const winningTax = isNewWinner ? newTax : oldTax;
  const monthlyGross = Math.round(income / 12);
  const monthlyTax = Math.round(winningTax / 12);
  const monthlyTakeHome = Math.max(0, monthlyGross - monthlyTax);

  // Section 87A Full Rebate Flag
  const isZeroTax = winningTax === 0 && income > 0;

  const handleShare = async () => {
    try {
      setSharing(true);
      const url = await createShareableLink(formData, taxResult);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to create share link:', err);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. HIERARCHY: VERDICT IS THE BIGGEST (Gradient used strictly here) */}
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#8B5CF6] to-[#2DD4BF] text-white shadow-lg shadow-[#8B5CF6]/15"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-sm">
                Verdict
              </span>
              {isZeroTax && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0D9488]/40 border border-white/30 text-white flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-200" /> Section 87A: 100% Tax-Free
                </span>
              )}
            </div>

            {/* Verdict Number */}
            <div className="text-3xl sm:text-4xl font-black tracking-tight">
              {isTie ? (
                'Equal Tax Liability'
              ) : (
                <>
                  Save <AnimatedCounter value={savings} className="font-mono" /> with {isNewWinner ? 'New Regime' : 'Old Regime'}
                </>
              )}
            </div>

            <p className="text-xs text-white/90 max-w-lg leading-relaxed">
              {isTie && 'Both regimes result in the exact same tax output based on your deduction entries.'}
              {isNewWinner && (
                isZeroTax 
                  ? 'Your net taxable income is within the ₹12L threshold, wiping out 100% of tax liability via Section 87A rebate.' 
                  : 'Lower tax slabs and the enhanced ₹75,000 standard deduction make the New Regime more economical.'
              )}
              {isOldWinner && 'Your substantial deduction claims (80C, 80D, HRA, Home Loan) beat the New Regime slabs.'}
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 shrink-0">
            {/* Monthly Take-Home Pill (Interactive) */}
            <button
              onClick={() => setShowSalaryModal(true)}
              className="bg-white/15 hover:bg-white/25 transition-all backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-right group active:scale-95"
              title="Click to view detailed monthly payslip breakdown"
            >
              <div className="text-[10px] text-white/80 font-medium flex items-center justify-end gap-1">
                <Wallet className="h-3 w-3" />
                <span>Net Monthly In-Hand</span>
                <span className="text-[9px] bg-white/20 px-1 rounded text-white group-hover:bg-white group-hover:text-slate-900 transition-colors">Breakdown ↗</span>
              </div>
              <div className="text-base font-black font-mono">
                ₹{monthlyTakeHome.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-white/80">/mo</span>
              </div>
            </button>

            <button
              onClick={handleShare}
              disabled={sharing}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-white/95 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 self-start sm:self-auto active:scale-95"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#0D9488]" /> : <Share2 className="h-3.5 w-3.5 text-[#7C3AED]" />}
              <span>{copied ? 'Link Copied!' : sharing ? 'Creating...' : 'Share Report'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. THE TWO REGIME CARDS (Winner has Mint border & WINNER badge; loser has Rose border) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Old Regime Card */}
        <motion.div
          layout
          onMouseMove={handleMouseMove}
          className={`p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-[#131A2E] shadow-sm relative overflow-hidden group ${
            isOldWinner 
              ? 'border-[#2DD4BF] ring-2 ring-[#2DD4BF]/25 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
              : 'border-[#E7E2D7] dark:border-[#26304A]'
          }`}
        >
          {/* Subtle Ambient Mouse Spotlight */}
          <div 
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.08), transparent 70%)`
            }}
          />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-[#A5B0C8] uppercase tracking-wider">
              Old Regime
            </span>
            <AnimatePresence>
              {isOldWinner && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" /> WINNER
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-2xl font-black font-mono mb-1 text-slate-900 dark:text-white">
            <AnimatedCounter 
              value={oldTax} 
              className={isOldWinner ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-[#FB7185]'}
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-[#A5B0C8]">
            Effective Rate: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{((oldTax / income) * 100).toFixed(1)}%</span>
            <span className="mx-1.5">•</span>
            Std Ded: <span className="font-mono">₹50,000</span>
          </div>
        </motion.div>

        {/* New Regime Card */}
        <motion.div
          layout
          onMouseMove={handleMouseMove}
          className={`p-5 rounded-2xl border transition-all duration-300 bg-white dark:bg-[#131A2E] shadow-sm relative overflow-hidden group ${
            isNewWinner 
              ? 'border-[#2DD4BF] ring-2 ring-[#2DD4BF]/25 shadow-[0_0_20px_rgba(45,212,191,0.2)]' 
              : 'border-[#E7E2D7] dark:border-[#26304A]'
          }`}
        >
          {/* Subtle Ambient Mouse Spotlight */}
          <div 
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
            style={{
              background: `radial-gradient(220px circle at ${mousePos.x}px ${mousePos.y}px, rgba(45, 212, 191, 0.08), transparent 70%)`
            }}
          />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-[#A5B0C8] uppercase tracking-wider">
              New Regime (FY 2025-26)
            </span>
            <AnimatePresence>
              {isNewWinner && (
                <motion.span
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 flex items-center gap-1"
                >
                  <CheckCircle className="h-3 w-3" /> WINNER
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="text-2xl font-black font-mono mb-1 text-slate-900 dark:text-white">
            <AnimatedCounter 
              value={newTax} 
              className={isNewWinner ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-[#FB7185]'}
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-[#A5B0C8]">
            Effective Rate: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{((newTax / income) * 100).toFixed(1)}%</span>
            <span className="mx-1.5">•</span>
            Std Ded: <span className="font-mono">₹75,000</span>
          </div>
        </motion.div>
      </div>

      {/* 3. DEDUCTION USAGE: "Used ₹X of ₹Y deductions" */}
      <div className="p-4 bg-white dark:bg-[#131A2E] rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#8B5CF6] rounded-xl">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 dark:text-[#A5B0C8] font-medium">Eligible Deduction Utilization</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              Used ₹{(taxResult.used_deductions || 0).toLocaleString('en-IN')} of ₹{(taxResult.target_deductions || 500000).toLocaleString('en-IN')} eligible
            </div>
          </div>
        </div>
        <div className="w-28 bg-slate-100 dark:bg-[#0B1020] h-2.5 rounded-full overflow-hidden border border-[#E7E2D7] dark:border-slate-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(5, taxResult.optimization_score || 0))}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-[#2DD4BF] h-full rounded-full"
          />
        </div>
      </div>
      {/* 4. SALARY BREAKDOWN MODAL */}
      <SalaryBreakdownModal
        isOpen={showSalaryModal}
        onClose={() => setShowSalaryModal(false)}
        annualIncome={income}
        annualTax={winningTax}
        regimeName={isNewWinner ? 'New Regime' : 'Old Regime'}
      />
    </div>
  );
};
