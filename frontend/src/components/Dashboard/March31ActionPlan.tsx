import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarClock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Check, 
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TaxFormData, TaxResult } from '../../api';

interface March31ActionPlanProps {
  formData: TaxFormData;
  taxResult: TaxResult | null;
  onUpdateField: (field: keyof TaxFormData, value: number) => void;
  hideHeader?: boolean;
}

export const March31ActionPlan: React.FC<March31ActionPlanProps> = ({
  formData,
  taxResult,
  onUpdateField,
  hideHeader = false
}) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('taxync_march31_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate days remaining to March 31
  const today = new Date();
  const currentYear = today.getFullYear();
  // Target March 31 of current FY
  const targetYear = today.getMonth() > 2 ? currentYear + 1 : currentYear;
  const deadline = new Date(targetYear, 2, 31, 23, 59, 59); // Month is 0-indexed: 2 = March
  const diffTime = Math.max(0, deadline.getTime() - today.getTime());
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const toggleTask = (taskId: string) => {
    const updated = { ...completedTasks, [taskId]: !completedTasks[taskId] };
    setCompletedTasks(updated);
    try {
      localStorage.setItem('taxync_march31_tasks', JSON.stringify(updated));
    } catch (e) {}
  };

  const c80Gap = Math.max(0, 150000 - (Number(formData.section80C) || 0));
  const d80Gap = Math.max(0, 25000 - (Number(formData.section80D) || 0));
  const hraClaimed = Number(formData.hra) || 0;

  // Approximate tax slab rate for savings estimates
  const estimatedSlabRate = (formData.income || 0) > 1500000 ? 0.312 : (formData.income || 0) > 1000000 ? 0.208 : 0.104;

  const tasks = [
    {
      id: 'task-80c',
      title: 'Maximize Section 80C Investment Ceiling',
      category: 'Deduction',
      isUrgent: c80Gap > 0,
      description: c80Gap > 0 
        ? `You have ₹${c80Gap.toLocaleString()} unutilized headroom. Investing in ELSS (3-yr lock-in) or PPF saves up to ₹${Math.round(c80Gap * estimatedSlabRate).toLocaleString()} in Old Regime tax.`
        : 'Section 80C limit (₹1.50 Lakh) fully utilized. No further deposit required.',
      actionLabel: c80Gap > 0 ? `+ Top-up to ₹1.5L` : undefined,
      onAction: () => onUpdateField('section80C', 150000)
    },
    {
      id: 'task-80d',
      title: 'Health Insurance & Medical Checkup (80D)',
      category: 'Health',
      isUrgent: d80Gap > 0,
      description: d80Gap > 0
        ? `You have ₹${d80Gap.toLocaleString()} left under Section 80D. Includes up to ₹5,000 for preventive annual health checkups for self & spouse.`
        : 'Section 80D baseline (₹25,000) claimed.',
      actionLabel: d80Gap > 0 ? `+ Claim ₹25k Limit` : undefined,
      onAction: () => onUpdateField('section80D', 25000)
    },
    {
      id: 'task-nps',
      title: 'Section 80CCD(1B) Tier-1 NPS Contribution',
      category: 'Retirement',
      isUrgent: true,
      description: `Invest up to ₹50,000 exclusively in NPS Tier-1 (over & above Section 80C). Shields ₹15,600 tax in the 30% slab while compounding for retirement.`,
      actionLabel: undefined,
      onAction: undefined
    },
    {
      id: 'task-hra',
      title: 'HRA Rent Receipts & Landlord PAN Submission',
      category: 'Payroll',
      isUrgent: hraClaimed > 100000,
      description: hraClaimed > 100000
        ? `Annual rent claimed is ₹${hraClaimed.toLocaleString()}. As rent exceeds ₹1 Lakh/yr, HR mandatory compliance requires Landlord's PAN and all 12 monthly rent receipts before employer cutoff.`
        : 'Submit rent agreement and rent payment receipts to employer HR portal to prevent excess TDS deduction in February/March payroll.',
      actionLabel: undefined,
      onAction: undefined
    },
    {
      id: 'task-harvest',
      title: 'Harvest ₹1.25 Lakh Tax-Free LTCG (Section 112A)',
      category: 'Capital Gains',
      isUrgent: true,
      description: `Budget 2024 offers ₹1,25,000 annual tax exemption on Long Term Capital Gains from equity & equity mutual funds. Sell and repurchase eligible holdings before March 31 to reset acquisition cost tax-free.`,
      actionLabel: undefined,
      onAction: undefined
    }
  ];

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => completedTasks[t.id]).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const taskList = (
    <div className="space-y-3 pt-2">
      {/* Mini Progress bar if hideHeader */}
      {hideHeader && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1528] border border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between gap-3 mb-2">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {totalTasks} Completed
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#A5B0C8]">
              {progressPercent}% Tax Readiness
            </div>
          </div>
          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#2DD4BF] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {tasks.map((task) => {
        const isDone = !!completedTasks[task.id];
        return (
          <div
            key={task.id}
            className={`p-3.5 rounded-xl border transition-all duration-200 ${
              isDone
                ? 'bg-slate-50/60 dark:bg-slate-900/40 border-[#E7E2D7] dark:border-[#26304A] opacity-75'
                : 'bg-white dark:bg-[#131A2E] border-[#E7E2D7] dark:border-[#26304A] shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className={`mt-0.5 p-1 rounded-lg transition-all ${
                  isDone
                    ? 'bg-[#2DD4BF] text-slate-900'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
                aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold ${
                      isDone
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#0B1020] text-slate-500">
                      {task.category}
                    </span>
                    {task.isUrgent && !isDone && (
                      <span className="text-[9px] uppercase tracking-wider font-black px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] leading-relaxed">
                  {task.description}
                </p>

                {task.actionLabel && !isDone && (
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={task.onAction}
                      className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#8B5CF6] hover:bg-[#8B5CF6]/20 text-[10px] font-bold inline-flex items-center gap-1 transition-all"
                    >
                      <span>{task.actionLabel}</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  if (hideHeader) {
    return taskList;
  }

  return (
    <div className="bg-white dark:bg-[#131A2E] rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] p-5 sm:p-6 shadow-sm transition-all duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2D7] dark:border-[#26304A]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
            <CalendarClock className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                March 31 Tax-Saving Action Plan
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {daysRemaining} Days Left
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mt-0.5">
              Actionable checklist to eliminate last-minute February & March salary TDS shock
            </p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {totalTasks} Completed
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#A5B0C8]">
              {progressPercent}% Tax Readiness
            </div>
          </div>
          <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#8B5CF6] to-[#2DD4BF] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all ml-1"
            aria-label="Toggle section"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Task List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {taskList}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
