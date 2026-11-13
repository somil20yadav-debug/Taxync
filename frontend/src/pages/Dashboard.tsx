import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTax as apiCalculateTax, exportPDF, TaxFormData, TaxResult } from '../api';
import { OnboardingWizard } from '../components/OnboardingWizard';
import { TaxForm } from '../components/Dashboard/TaxForm';
import { TaxSummaryCards } from '../components/Dashboard/TaxSummaryCards';
import { TaxAnalytics } from '../components/Dashboard/TaxAnalytics';
import { TaxAdvisor } from '../components/Dashboard/TaxAdvisor';
import { TaxSimulator } from '../components/Dashboard/TaxSimulator';
import { PayslipScannerDrawer } from '../components/Dashboard/PayslipScannerDrawer';
import { WealthCompoundingCard } from '../components/Dashboard/WealthCompoundingCard';
import { March31ActionPlan } from '../components/Dashboard/March31ActionPlan';
import { 
  Sun, 
  Moon, 
  ChevronDown, 
  Sparkles, 
  Check, 
  Download, 
  Wallet,
  ArrowUp,
  FileText
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const INITIAL_FORM: TaxFormData = {
  income: 1200000,
  standardDeduction: 50000,
  section80C: 150000,
  hra: 100000,
  section80D: 25000,
  homeLoanInterest: 0,
  educationLoan: 0,
  donations: 0,
  section80U: 'none',
  royaltyIncome: 0,
  politicalDonation: 0,
  evLoanInterest: 0,
};

const SCENARIOS = [
  {
    id: 'fresher',
    tag: 'Early Career',
    title: 'Fresh Graduate',
    subtitle: '₹6.5 LPA • 100% Tax Free via Section 87A',
    data: { income: 650000, standardDeduction: 50000, section80C: 50000, hra: 60000, section80D: 10000, homeLoanInterest: 0 },
  },
  {
    id: 'mid',
    tag: 'Growth Phase',
    title: 'Mid-Level Professional',
    subtitle: '₹15 LPA • Balanced HRA & 80C deductions',
    data: { income: 1500000, standardDeduction: 50000, section80C: 150000, hra: 180000, section80D: 25000, homeLoanInterest: 150000 },
  },
  {
    id: 'lead',
    tag: 'High Bracket',
    title: 'Senior Tech Lead',
    subtitle: '₹32 LPA • Aggressive 30% slab optimization',
    data: { income: 3200000, standardDeduction: 50000, section80C: 150000, hra: 300000, section80D: 50000, homeLoanInterest: 200000, donations: 50000 },
  },
  {
    id: 'zero',
    tag: 'Legal Benchmark',
    title: '₹12L Zero-Tax Test',
    subtitle: '₹12 LPA • Demonstrating Section 87A rebate power',
    data: { income: 1200000, standardDeduction: 50000, section80C: 0, hra: 0, section80D: 0, homeLoanInterest: 0 },
  },
];

export const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState<TaxFormData>(() => {
    try {
      const saved = localStorage.getItem('taxync_saved_form');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FORM;
  });
  const [taxResult, setTaxResult] = useState<TaxResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [showFloatingHUD, setShowFloatingHUD] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState<'advisor' | 'march31'>('advisor');

  const scenarioDropdownRef = useRef<HTMLDivElement>(null);

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    return localStorage.getItem('hasSeenOnboarding') === 'true';
  });

  // Close custom scenario dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (scenarioDropdownRef.current && !scenarioDropdownRef.current.contains(e.target as Node)) {
        setShowScenarioMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Listen for scroll in main container to toggle signature floating HUD
  useEffect(() => {
    const mainEl = document.querySelector('main');
    const handleScroll = (e: any) => {
      const scrollPos = e.target.scrollTop || window.scrollY || 0;
      setShowFloatingHUD(scrollPos > 280);
    };

    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
      return () => mainEl.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleFormChange = (field: keyof TaxFormData, value: number | string) => {
    setSelectedScenarioId(null);
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    try {
      localStorage.setItem('taxync_saved_form', JSON.stringify(updated));
    } catch (e) {}
    runCalculation(updated);
  };

  const runCalculation = async (dataToUse = formData) => {
    try {
      setIsCalculating(true);
      const res = await apiCalculateTax(dataToUse);
      setTaxResult(res);

      // Cross-page Data Sync: Persist savings & surplus for the /investments engine
      try {
        const annualSavings = Math.abs(res.old_regime_tax - res.new_regime_tax);
        const bestRegime = res.new_regime_tax <= res.old_regime_tax ? 'New Regime' : 'Old Regime';
        const monthlySip = Math.max(1000, Math.round((annualSavings / 12) / 500) * 500);
        localStorage.setItem('taxync_savings_surplus', JSON.stringify({
          annualSavings,
          recommendedMonthlySIP: monthlySip,
          annualGross: dataToUse.income,
          bestRegime,
          oldTax: res.old_regime_tax,
          newTax: res.new_regime_tax,
          updatedAt: Date.now()
        }));
        window.dispatchEvent(new Event('savingsSurplusUpdated'));
      } catch (e) {}
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplyExtracted = (extracted: Partial<TaxFormData>) => {
    setSelectedScenarioId(null);
    const updated = { ...formData, ...extracted };
    setFormData(updated);
    try {
      localStorage.setItem('taxync_saved_form', JSON.stringify(updated));
    } catch (e) {}
    runCalculation(updated);
  };

  const handleScenarioSelect = (scenario: typeof SCENARIOS[0]) => {
    setSelectedScenarioId(scenario.id);
    setShowScenarioMenu(false);
    const updated = { ...INITIAL_FORM, ...scenario.data };
    setFormData(updated);
    try {
      localStorage.setItem('taxync_saved_form', JSON.stringify(updated));
    } catch (e) {}
    runCalculation(updated);
  };

  const handleReset = () => {
    setSelectedScenarioId(null);
    setFormData(INITIAL_FORM);
    try {
      localStorage.removeItem('taxync_saved_form');
    } catch (e) {}
    runCalculation(INITIAL_FORM);
  };

  const handleQuickExport = async () => {
    if (!taxResult) return;
    try {
      setIsExportingPDF(true);
      await exportPDF(formData, taxResult);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  useEffect(() => {
    runCalculation(formData);

    const handleScannerOpen = () => setIsScannerOpen(true);
    const handleLoadScenario = (e: any) => {
      const targetId = e.detail;
      const found = SCENARIOS.find(s => s.id === targetId);
      if (found) {
        handleScenarioSelect(found);
      }
    };

    window.addEventListener('openPayslipScanner', handleScannerOpen);
    window.addEventListener('loadScenario', handleLoadScenario);
    return () => {
      window.removeEventListener('openPayslipScanner', handleScannerOpen);
      window.removeEventListener('loadScenario', handleLoadScenario);
    };
  }, []);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => setShowOnboarding(true), 600);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]);

  const handleOnboardingComplete = (data: any) => {
    if (data.income) {
      const updated = { ...formData, income: Number(data.income) };
      setFormData(updated);
      runCalculation(updated);
    }
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const isNewWinner = taxResult ? taxResult.new_regime_tax < taxResult.old_regime_tax : true;
  const winnerName = isNewWinner ? 'New Regime' : 'Old Regime';
  const savingsAbs = taxResult ? Math.abs(taxResult.old_regime_tax - taxResult.new_regime_tax) : 0;
  const bestTax = taxResult ? Math.min(taxResult.old_regime_tax, taxResult.new_regime_tax) : 0;
  const monthlyInHand = Math.max(0, Math.round((formData.income - bestTax) / 12));

  return (
    <div className="w-full px-5 sm:px-8 lg:px-10 py-6 space-y-6 relative overflow-x-hidden">
      {/* 1. Taxync Signature Floating "Verdict HUD" (Heads-Up Display) */}
      <AnimatePresence>
        {showFloatingHUD && taxResult && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-20 left-4 right-4 z-30 max-w-3xl mx-auto bg-white/95 dark:bg-[#131A2E]/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-xl flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] animate-pulse shrink-0" />
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">
                  {winnerName} saves ₹{savingsAbs.toLocaleString('en-IN')}
                </span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="hidden sm:inline font-mono font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
                  ₹{monthlyInHand.toLocaleString('en-IN')}/mo In-Hand
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleQuickExport}
                disabled={isExportingPDF}
                className="px-3 py-1.5 rounded-xl bg-[#7C3AED] dark:bg-[#8B5CF6] text-white hover:bg-[#6D28D9] text-[11px] font-bold shadow-sm transition-all flex items-center gap-1 active:scale-95 disabled:opacity-50"
              >
                <Download className="h-3 w-3" />
                <span>{isExportingPDF ? 'Exporting...' : 'PDF'}</span>
              </button>
              <button
                onClick={() => {
                  const mainEl = document.querySelector('main');
                  if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0B1020]"
                title="Back to Top"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top Header with Custom Animated Scenario Switcher (No OS select) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm transition-colors duration-300"
      >
        {/* Title & Badge (Zero clipping, fully padded) */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Taxync Dashboard
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 rounded-md">
              FY 2025-26
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
            Real-time tax regime optimization & take-home analyzer
          </p>
        </div>

        {/* Actions: Custom Animated Scenario Pill & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Custom Scenario Dropdown Pill */}
          <div className="relative" ref={scenarioDropdownRef}>
            <button
              type="button"
              onClick={() => setShowScenarioMenu(!showScenarioMenu)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-800 dark:text-slate-200 border border-[#E7E2D7] dark:border-[#26304A] hover:border-[#8B5CF6] transition-all flex items-center gap-2 active:scale-95 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#7C3AED] dark:text-[#8B5CF6]" />
              <span>
                {selectedScenarioId 
                  ? SCENARIOS.find(s => s.id === selectedScenarioId)?.title 
                  : 'Try a Blueprint'}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transform transition-transform duration-200 ${showScenarioMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Animated Glass Popover Menu */}
            <AnimatePresence>
              {showScenarioMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#131A2E] rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-2xl p-1.5 z-50 divide-y divide-slate-100 dark:divide-slate-800/80"
                >
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select a Tax Profile
                  </div>
                  <div className="space-y-1 pt-1">
                    {SCENARIOS.map((sc) => {
                      const isSelected = selectedScenarioId === sc.id;
                      return (
                        <button
                          key={sc.id}
                          type="button"
                          onClick={() => handleScenarioSelect(sc)}
                          className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start justify-between gap-2 ${
                            isSelected 
                              ? 'bg-[#2DD4BF]/10 text-slate-900 dark:text-white border border-[#2DD4BF]/30' 
                              : 'hover:bg-[#FAF8F5] dark:hover:bg-[#0B1020] text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">{sc.title}</span>
                              <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {sc.tag}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] mt-0.5">
                              {sc.subtitle}
                            </p>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-[#0D9488] dark:text-[#2DD4BF] shrink-0 mt-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 3. Linear Full-Width Narrative Flow: One Section After Another (Zero Side Gaps) */}
      <div className="max-w-5xl mx-auto space-y-7">
        {/* Step 1: Input Parameters & Auto-Scan */}
        <section>
          <TaxForm
            formData={formData}
            onChange={handleFormChange}
            onCalculate={() => runCalculation(formData)}
            onReset={handleReset}
            onOpenScanner={() => setIsScannerOpen(true)}
            isCalculating={isCalculating}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
        </section>

        {/* 'What If?' Salary Appraisal Simulator (Directly below calculator) */}
        <section>
          <TaxSimulator formData={formData} taxResult={taxResult} />
        </section>

        {/* Step 2: The Tax Verdict & Regime Slabs */}
        <section>
          <TaxSummaryCards taxResult={taxResult} formData={formData} />
        </section>

        {/* Step 3: Visual Analytics (Comparison Bars, Deductions Donut, Slabs) - Right below Verdict */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <TaxAnalytics taxResult={taxResult} formData={formData} />
        </motion.section>

        {/* Step 4: Compact Action & Insights Hub (Tabbed to prevent excessive vertical scrolling) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-white/70 dark:bg-[#131A2E]/70 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveInsightTab('advisor')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeInsightTab === 'advisor'
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                💡 Strategic Tax Advisor
              </button>
              <button
                type="button"
                onClick={() => setActiveInsightTab('march31')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeInsightTab === 'march31'
                    ? 'bg-[#8B5CF6] text-white shadow-sm'
                    : 'text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ⚡ March 31 Action Plan
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Planning & Optimization Roadmap
            </span>
          </div>

          <AnimatePresence mode="wait">
            {activeInsightTab === 'advisor' && (
              <motion.div
                key="advisor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TaxAdvisor taxResult={taxResult} />
              </motion.div>
            )}

            {activeInsightTab === 'march31' && (
              <motion.div
                key="march31"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <March31ActionPlan 
                  formData={formData} 
                  taxResult={taxResult} 
                  onUpdateField={(field, val) => handleFormChange(field, val)} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Step 5: The Silent Wealth Gap (Compounding Opportunity Cost) */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <WealthCompoundingCard annualSavings={taxResult?.savings || 0} />
        </motion.section>
      </div>

      {/* Slide-Over Payslip Scanner Drawer */}
      <PayslipScannerDrawer
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onApplyExtracted={handleApplyExtracted}
      />

      <OnboardingWizard
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    </div>
  );
};
