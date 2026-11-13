import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Lightbulb, CalendarClock, ShieldCheck, ArrowRight } from 'lucide-react';
import { TaxAdvisor } from './TaxAdvisor';
import { March31ActionPlan } from './March31ActionPlan';
import { TaxFormData, TaxResult } from '../../api';

interface TaxInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'advisor' | 'march31';
  onTabChange: (tab: 'advisor' | 'march31') => void;
  formData: TaxFormData;
  taxResult: TaxResult | null;
  onUpdateField: (field: keyof TaxFormData, value: number) => void;
}

export const TaxInsightsDrawer: React.FC<TaxInsightsDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  formData,
  taxResult,
  onUpdateField,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Slide-Over Drawer from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[540px] bg-white dark:bg-[#131A2E] border-l border-[#E7E2D7] dark:border-[#26304A] shadow-2xl z-50 flex flex-col transition-colors duration-300 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between bg-slate-50/50 dark:bg-[#0B1020]/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#2DD4BF] text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Planning & Optimization Suite
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
                    Personalized recommendations & statutory deadlines
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A233A] transition-all"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-header Tab Switcher */}
            <div className="p-3 bg-slate-100/60 dark:bg-[#0E1528] border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTabChange('advisor')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'advisor'
                    ? 'bg-white dark:bg-[#131A2E] text-[#7C3AED] dark:text-[#8B5CF6] shadow-sm border border-[#E7E2D7] dark:border-[#26304A]'
                    : 'text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Lightbulb className="h-3.5 w-3.5" />
                <span>Strategic Advisor</span>
              </button>

              <button
                type="button"
                onClick={() => onTabChange('march31')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'march31'
                    ? 'bg-white dark:bg-[#131A2E] text-[#7C3AED] dark:text-[#8B5CF6] shadow-sm border border-[#E7E2D7] dark:border-[#26304A]'
                    : 'text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarClock className="h-3.5 w-3.5" />
                <span>March 31 Action Plan</span>
              </button>
            </div>

            {/* Scrollable Drawer Body */}
            <div 
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'advisor' && (
                  <motion.div
                    key="tab-advisor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TaxAdvisor taxResult={taxResult} />
                  </motion.div>
                )}

                {activeTab === 'march31' && (
                  <motion.div
                    key="tab-march31"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <March31ActionPlan
                      formData={formData}
                      taxResult={taxResult}
                      onUpdateField={onUpdateField}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 dark:bg-[#0E1528] border-t border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#0D9488] dark:text-[#2DD4BF]" />
                <span>FY 2025–26 Tax Planning Suite</span>
              </span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                ESC to close
              </kbd>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
