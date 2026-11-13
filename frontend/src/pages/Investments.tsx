import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Coins, 
  PiggyBank, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  RotateCcw,
  Clock,
  Layers,
  HelpCircle,
  Lightbulb,
  Shield,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Investments() {
  const [activeTab, setActiveTab] = useState<'sip' | 'swp'>('sip');

  // SIP / Lumpsum State
  const [investmentType, setInvestmentType] = useState<'sip' | 'lump'>('sip');
  const [sipAmount, setSipAmount] = useState<number>(15000);
  const [lumpAmount, setLumpAmount] = useState<number>(500000);
  const [years, setYears] = useState<number>(15);
  const [returnRate, setReturnRate] = useState<number>(12); // Nifty 50 CAGR

  // Cross-Page Dashboard Tax Savings Sync
  const [syncedData, setSyncedData] = useState<{
    annualSavings: number;
    recommendedMonthlySIP: number;
    annualGross: number;
    bestRegime: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('taxync_savings_surplus');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [appliedSync, setAppliedSync] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('taxync_savings_surplus');
        if (saved) setSyncedData(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener('savingsSurplusUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('savingsSurplusUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleApplySyncedSavings = () => {
    if (!syncedData) return;
    setInvestmentType('sip');
    setActiveTab('sip');
    setSipAmount(syncedData.recommendedMonthlySIP);
    setAppliedSync(true);
    setTimeout(() => setAppliedSync(false), 3000);
  };

  // SWP State (Systematic Withdrawal Plan)
  const [initialCorpus, setInitialCorpus] = useState<number>(10000000); // 1 Crore
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(60000); // 60k/mo
  const [swpGrowthRate, setSwpGrowthRate] = useState<number>(9); // 9% conservative hybrid
  const [swpYears, setSwpYears] = useState<number>(25);

  // --- SIP Calculations ---
  // Monthly SIP FV = P * [((1 + i)^n - 1) / i] * (1 + i)
  const monthlyRate = returnRate / 12 / 100;
  const totalMonths = years * 12;
  
  let totalInvested = 0;
  let futureValue = 0;

  if (investmentType === 'sip') {
    totalInvested = sipAmount * totalMonths;
    if (monthlyRate > 0) {
      futureValue = Math.round(
        sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
      );
    } else {
      futureValue = totalInvested;
    }
  } else {
    totalInvested = lumpAmount;
    futureValue = Math.round(lumpAmount * Math.pow(1 + returnRate / 100, years));
  }

  const wealthGain = Math.max(0, futureValue - totalInvested);
  const profitPercentage = totalInvested > 0 ? ((wealthGain / totalInvested) * 100).toFixed(0) : '0';

  const inCrores = (futureValue / 10000000).toFixed(2);
  const inLakhs = (futureValue / 100000).toFixed(1);

  // --- SWP Calculations ---
  // Simulate month by month
  let remainingCorpus = initialCorpus;
  let totalWithdrawn = 0;
  const swpMonthlyRate = swpGrowthRate / 12 / 100;
  let depletedMonth = -1;

  for (let m = 1; m <= swpYears * 12; m++) {
    const interest = remainingCorpus * swpMonthlyRate;
    remainingCorpus = remainingCorpus + interest - monthlyWithdrawal;
    totalWithdrawn += monthlyWithdrawal;

    if (remainingCorpus <= 0 && depletedMonth === -1) {
      depletedMonth = m;
      remainingCorpus = 0;
      break;
    }
  }

  const isCorpusPerpetual = remainingCorpus > initialCorpus;
  const swpYearsLasted = depletedMonth > 0 ? (depletedMonth / 12).toFixed(1) : `${swpYears}+`;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] rounded-2xl shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Investment & Wealth Engine</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6] border border-[#8B5CF6]/30 rounded-md">
                Compounding Lab
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mt-0.5">
              Simulate monthly SIP accumulation or passive income Systematic Withdrawal Plans (SWP).
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0B1020] p-1 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sip')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'sip'
                ? 'bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SIP & Lumpsum
          </button>
          <button
            onClick={() => setActiveTab('swp')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              activeTab === 'swp'
                ? 'bg-white dark:bg-[#131A2E] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            SWP (Pension / Payout)
          </button>
        </div>
      </motion.div>

      {/* Dynamic Cross-Page Sync Alert from Dashboard */}
      {syncedData && syncedData.annualSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 via-[#2DD4BF]/15 to-transparent border border-[#8B5CF6]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#8B5CF6] text-white shrink-0 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase text-[#7C3AED] dark:text-[#8B5CF6]">
                  Live Taxync Bridge
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/30">
                  Save ₹{syncedData.annualSavings.toLocaleString('en-IN')} in {syncedData.bestRegime}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                Invest your ₹{Math.round(syncedData.annualSavings / 12).toLocaleString('en-IN')}/mo tax savings directly into SIP to compound long-term wealth without touching your salary.
              </p>
            </div>
          </div>

          <button
            onClick={handleApplySyncedSavings}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
          >
            {appliedSync ? (
              <>
                <ShieldCheck className="h-4 w-4 text-[#2DD4BF]" />
                <span>Applied ₹{syncedData.recommendedMonthlySIP.toLocaleString('en-IN')}/mo!</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 text-[#2DD4BF]" />
                <span>Auto-Invest ₹{syncedData.recommendedMonthlySIP.toLocaleString('en-IN')}/mo</span>
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* TAB 1: SIP & LUMPSUM ACCUMULATION */}
      {activeTab === 'sip' && (
        <div className="space-y-6">
          {/* Main Calculator Card */}
          <div className="bg-white dark:bg-[#131A2E] p-6 sm:p-7 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-6 transition-colors duration-300">
            {/* Type Selector (Monthly SIP vs Lumpsum) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D7] dark:border-[#26304A]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInvestmentType('sip')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    investmentType === 'sip'
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-[#0B1020] text-slate-600 dark:text-[#A5B0C8]'
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  onClick={() => setInvestmentType('lump')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    investmentType === 'lump'
                      ? 'bg-[#8B5CF6] text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-[#0B1020] text-slate-600 dark:text-[#A5B0C8]'
                  }`}
                >
                  One-Time Lumpsum
                </button>
              </div>

              <span className="text-[11px] text-slate-500 dark:text-[#A5B0C8] font-medium hidden sm:inline">
                {investmentType === 'sip' ? 'Disciplined Monthly Wealth' : 'Single Investment Horizon'}
              </span>
            </div>

            {/* Inputs & Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
              {/* Left Column: Sliders & Form (7 cols) */}
              <div className="lg:col-span-7 space-y-5 text-xs">
                {/* Amount Input with Quick Chips */}
                <div className="space-y-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700 dark:text-[#A5B0C8]">
                      {investmentType === 'sip' ? 'Monthly SIP Amount' : 'One-Time Lumpsum Amount'}
                    </span>
                    <span className="font-mono text-base font-bold text-[#0D9488] dark:text-[#2DD4BF]">
                      ₹{(investmentType === 'sip' ? sipAmount : lumpAmount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 font-mono text-slate-400">₹</span>
                    <input
                      type="number"
                      value={investmentType === 'sip' ? sipAmount : lumpAmount}
                      onChange={(e) => {
                        const val = Math.max(0, Number(e.target.value));
                        if (investmentType === 'sip') setSipAmount(val);
                        else setLumpAmount(val);
                      }}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white font-mono text-sm font-bold outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  {/* Quick-Fill Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(investmentType === 'sip' ? [5000, 10000, 15000, 25000, 50000] : [100000, 250000, 500000, 1000000]).map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          if (investmentType === 'sip') setSipAmount(chip);
                          else setLumpAmount(chip);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-[#0B1020] text-slate-600 dark:text-[#A5B0C8] hover:text-[#8B5CF6] border border-[#E7E2D7] dark:border-[#26304A] transition-all"
                      >
                        {chip >= 100000 ? `₹${chip / 100000} Lakh` : `₹${chip.toLocaleString('en-IN')}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700 dark:text-[#A5B0C8]">Time Horizon</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">{years} Years</span>
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
                    <span>10 yrs</span>
                    <span>20 yrs</span>
                    <span>30 yrs</span>
                  </div>
                </div>

                {/* CAGR Expected Return Slider + Presets */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700 dark:text-[#A5B0C8]">Expected Annual Return (CAGR)</span>
                    <span className="font-mono text-[#0D9488] dark:text-[#2DD4BF] font-bold">{returnRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="18"
                    step="0.5"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #2DD4BF 0%, #2DD4BF ${((returnRate - 6) / 12) * 100}%, rgba(148, 163, 184, 0.2) ${((returnRate - 6) / 12) * 100}%, rgba(148, 163, 184, 0.2) 100%)`
                    }}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#2DD4BF] transition-all"
                  />

                  {/* Asset Class Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { label: '7% (PPF / FD)', rate: 7, icon: Shield },
                      { label: '12% (Nifty 50)', rate: 12, icon: TrendingUp },
                      { label: '15% (Active Equity)', rate: 15, icon: Rocket },
                    ].map((p) => {
                      const IconComp = p.icon;
                      return (
                        <button
                          key={p.rate}
                          type="button"
                          onClick={() => setReturnRate(p.rate)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${
                            returnRate === p.rate
                              ? 'bg-[#2DD4BF]/20 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/40'
                              : 'bg-slate-100 dark:bg-[#0B1020] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                        >
                          <IconComp className="h-3 w-3" />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Result Card (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#131A2E] text-white p-6 rounded-2xl border border-[#26304A] shadow-xl space-y-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Projected Maturity Corpus ({years} Yrs)
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-[#2DD4BF] mt-1">
                    {futureValue >= 10000000 ? `₹${inCrores} Crores` : `₹${inLakhs} Lakhs`}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Pure profit of <span className="text-white font-bold">₹{wealthGain.toLocaleString('en-IN')}</span> (+{profitPercentage}%)
                  </p>
                </div>

                {/* 2-Tone Ratio Bar: Out-of-pocket vs Market Wealth */}
                <div className="space-y-1.5">
                  <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-[#8B5CF6] h-full" 
                      style={{ width: `${Math.max(5, (totalInvested / (futureValue || 1)) * 100)}%` }} 
                      title="Total Invested"
                    />
                    <div 
                      className="bg-[#2DD4BF] h-full flex-1" 
                      title="Market Profit"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-[#8B5CF6] font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                      Invested: ₹{totalInvested.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[#2DD4BF] font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />
                      Profit: ₹{wealthGain.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Capital Gains Tax Tip */}
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-[#2DD4BF] shrink-0" />
                    <span>₹1.25 Lakh/year is tax-free under Sec 112A</span>
                  </span>
                  <Link to="/library" className="text-[#8B5CF6] hover:underline font-bold">
                    View Rules →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Life Milestones Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                period: '5 Years',
                badge: 'Early Milestone',
                title: 'Downpayment & Emergency Fund',
                amount: Math.round(investmentType === 'sip' ? sipAmount * ((Math.pow(1 + monthlyRate, 60) - 1) / monthlyRate) * (1 + monthlyRate) : lumpAmount * Math.pow(1 + returnRate / 100, 5)),
              },
              {
                period: '15 Years',
                badge: 'Growth Milestone',
                title: 'Higher Education / Real Estate',
                amount: Math.round(investmentType === 'sip' ? sipAmount * ((Math.pow(1 + monthlyRate, 180) - 1) / monthlyRate) * (1 + monthlyRate) : lumpAmount * Math.pow(1 + returnRate / 100, 15)),
              },
              {
                period: '25 Years',
                badge: 'Financial Freedom',
                title: 'Perpetual Retirement Independence',
                amount: Math.round(investmentType === 'sip' ? sipAmount * ((Math.pow(1 + monthlyRate, 300) - 1) / monthlyRate) * (1 + monthlyRate) : lumpAmount * Math.pow(1 + returnRate / 100, 25)),
              },
            ].map((m, idx) => (
              <div key={idx} className="bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-[#A5B0C8]">{m.period}</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6]">
                    {m.badge}
                  </span>
                </div>
                <div className="text-xl font-black font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                  ₹{(m.amount >= 10000000 ? (m.amount / 10000000).toFixed(2) + ' Cr' : (m.amount / 100000).toFixed(1) + ' L')}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8]">{m.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SWP (SYSTEMATIC WITHDRAWAL PLAN) */}
      {activeTab === 'swp' && (
        <div className="bg-white dark:bg-[#131A2E] p-6 sm:p-7 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-6 transition-colors duration-300">
          <div className="space-y-1 pb-4 border-b border-[#E7E2D7] dark:border-[#26304A]">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Systematic Withdrawal Plan (SWP) Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
              Simulate regular monthly payouts from your corpus while your remaining balance continues compounding.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5 text-xs">
              {/* Total Corpus */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 dark:text-[#A5B0C8]">Total Initial Corpus</span>
                  <span className="font-mono text-[#0D9488] dark:text-[#2DD4BF] font-bold">
                    ₹{(initialCorpus / 10000000).toFixed(2)} Crores
                  </span>
                </div>
                <input
                  type="number"
                  value={initialCorpus}
                  onChange={(e) => setInitialCorpus(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white font-mono text-sm font-bold outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Monthly Withdrawal Desired */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 dark:text-[#A5B0C8]">Desired Monthly Payout (Pension)</span>
                  <span className="font-mono text-[#7C3AED] dark:text-[#8B5CF6] font-bold">
                    ₹{monthlyWithdrawal.toLocaleString('en-IN')}/mo
                  </span>
                </div>
                <input
                  type="number"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white font-mono text-sm font-bold outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Portfolio Growth Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-700 dark:text-[#A5B0C8]">Conservative Hybrid Growth Rate</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{swpGrowthRate}%</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="14"
                  step="0.5"
                  value={swpGrowthRate}
                  onChange={(e) => setSwpGrowthRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 dark:bg-[#0B1020] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>6% (Debt Heavy)</span>
                  <span>9% (Conservative Hybrid)</span>
                  <span>14% (Aggressive)</span>
                </div>
              </div>
            </div>

            {/* SWP Verdict Card (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#131A2E] text-white p-6 rounded-2xl border border-[#26304A] shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Corpus Longevity Verdict
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#2DD4BF] mt-1 font-mono">
                  {isCorpusPerpetual ? 'Never Depletes (Perpetual)' : `Lasts ${swpYearsLasted} Years`}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {isCorpusPerpetual 
                    ? `Your portfolio earns more in annual interest than your ₹${(monthlyWithdrawal * 12).toLocaleString('en-IN')} annual withdrawal. Your wealth continues growing forever!`
                    : `At this withdrawal rate, your corpus will support your monthly pension for ${swpYearsLasted} years before reaching zero.`}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Payouts Received:</span>
                  <span className="font-mono font-bold text-white">₹{totalWithdrawn.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Remaining Balance:</span>
                  <span className="font-mono font-bold text-[#2DD4BF]">₹{Math.round(remainingCorpus).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
