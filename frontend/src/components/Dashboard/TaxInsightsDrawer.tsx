import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, CalendarClock, ShieldCheck } from 'lucide-react';
import { TaxAdvisor } from './TaxAdvisor';
import { March31ActionPlan } from './March31ActionPlan';
import { TaxFormData, TaxResult } from '../../api';

interface TaxInsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDrawer: 'advisor' | 'march31' | null;
  formData: TaxFormData;
  taxResult: TaxResult | null;
  onUpdateField: (field: keyof TaxFormData, value: number) => void;
}

export const TaxInsightsDrawer: React.FC<TaxInsightsDrawerProps> = ({
  isOpen,
  onClose,
  activeDrawer,
  formData,
  taxResult,
  onUpdateField,
}) => {
  // ESC key listener to quickly dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (typeof document === 'undefined') return null;

  const isAdvisor = activeDrawer === 'advisor';
  const isMarch31 = activeDrawer === 'march31';

  return createPortal(
    <AnimatePresence>
      {isOpen && activeDrawer && (
        <>
          {/* Backdrop: Absolute full viewport cover at z-[100] */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] transition-opacity"
          />

          {/* Slide-Over Drawer: Absolute right edge from top-0 to bottom-0 with z-[101] */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] bg-white dark:bg-[#131A2E] border-l border-[#E7E2D7] dark:border-[#26304A] shadow-2xl z-[101] flex flex-col transition-colors duration-200 overflow-hidden"
          >
            {/* Header: Clean, single header specific to the clicked item */}
            <div className="px-5 py-4 border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between bg-[#FAF8F5]/80 dark:bg-[#0B1020]/60 shrink-0">
              <div className="flex items-center gap-3">
                {isAdvisor ? (
                  <div className="p-2.5 rounded-xl bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6]">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isAdvisor ? 'Strategic Tax Advisor' : 'March 31 Action Plan'}
                    </h3>
                    {isMarch31 && (
                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        139 Days Left
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
                    {isAdvisor 
                      ? 'Actionable steps to legally minimize tax' 
                      : 'Statutory compliance & deduction cutoff checklist'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A233A] transition-all"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Body: Pure content with no secondary tabs or duplicate headers */}
            <div 
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4"
            >
              {isAdvisor && (
                <TaxAdvisor taxResult={taxResult} hideHeader={true} />
              )}

              {isMarch31 && (
                <March31ActionPlan
                  formData={formData}
                  taxResult={taxResult}
                  onUpdateField={onUpdateField}
                  hideHeader={true}
                />
              )}
            </div>

            {/* Drawer Footer */}
            <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#0E1528] border-t border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-[#0D9488] dark:text-[#2DD4BF]" />
                <span>{isAdvisor ? 'AI Optimization Engine' : 'Statutory Deadlines'}</span>
              </span>
              <kbd className="px-2 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-400">
                ESC to close
              </kbd>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
