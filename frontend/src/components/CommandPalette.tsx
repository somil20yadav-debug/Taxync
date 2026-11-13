import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  TrendingUp,
  FileSpreadsheet,
  BookMarked,
  UserCircle,
  FileText,
  Moon,
  Sun,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Zap,
  CornerDownLeft,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PaletteItem {
  id: string;
  category: 'Navigation' | 'Actions' | 'Tax Benchmarks' | 'Tax Laws';
  title: string;
  subtitle: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openCommandPalette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openCommandPalette', handleCustomOpen);
    };
  }, []);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      category: 'Navigation',
      title: 'Tax Dashboard',
      subtitle: 'Compare Old vs New Regimes, calculate taxes and deductions',
      icon: LayoutDashboard,
      keywords: ['dashboard', 'home', 'calculate', 'regime', 'income'],
      action: () => {
        navigate('/');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-investments',
      category: 'Navigation',
      title: 'Invest & SWP Compounding Hub',
      subtitle: 'Simulate SIP wealth creation and retirement SWP longevity',
      icon: TrendingUp,
      keywords: ['sip', 'swp', 'invest', 'wealth', 'retirement', 'mutual fund', 'compounding'],
      action: () => {
        navigate('/investments');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-reports',
      category: 'Navigation',
      title: 'Reports Hub & HR Declaration',
      subtitle: 'Download Excel sheets and 1-click email declaration to HR',
      icon: FileSpreadsheet,
      keywords: ['reports', 'excel', 'hr', 'declaration', 'export', 'download'],
      action: () => {
        navigate('/reports');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-library',
      category: 'Navigation',
      title: 'Tax Law Library (22 Sections)',
      subtitle: 'Explore Indian tax laws, 112A LTCG, 87A rebate, and case studies',
      icon: BookMarked,
      keywords: ['library', 'laws', 'sections', 'rules', 'ltcg', 'stcg', '87a', '80c'],
      action: () => {
        navigate('/library');
        setIsOpen(false);
      }
    },
    {
      id: 'nav-profile',
      category: 'Navigation',
      title: 'Taxpayer Profile & Settings',
      subtitle: 'Update your name, designation, and filing parameters',
      icon: UserCircle,
      keywords: ['profile', 'user', 'settings', 'name', 'account'],
      action: () => {
        navigate('/profile');
        setIsOpen(false);
      }
    },

    // Actions
    {
      id: 'act-payslip',
      category: 'Actions',
      title: 'Scan Payslip / Form 16 (PDF)',
      subtitle: 'Auto-extract salary and deductions with zero typing',
      icon: FileText,
      keywords: ['scan', 'payslip', 'form 16', 'pdf', 'upload', 'extract'],
      action: () => {
        navigate('/');
        setIsOpen(false);
        setTimeout(() => window.dispatchEvent(new CustomEvent('openPayslipScanner')), 200);
      }
    },
    {
      id: 'act-theme',
      category: 'Actions',
      title: `Toggle Theme (Currently ${theme === 'dark' ? 'Dark' : 'Light'})`,
      subtitle: 'Switch between Dark (#0B1020) and Light Linen themes',
      icon: theme === 'dark' ? Sun : Moon,
      keywords: ['theme', 'dark', 'light', 'mode', 'color'],
      action: () => {
        toggleTheme();
        setIsOpen(false);
      }
    },

    // Tax Benchmarks
    {
      id: 'bench-zero',
      category: 'Tax Benchmarks',
      title: '₹12 Lakh Zero-Tax Blueprint',
      subtitle: 'Test 100% tax-free income via Section 87A New Regime rebate',
      icon: Sparkles,
      keywords: ['zero tax', '12 lakh', '12l', 'rebate', '87a'],
      action: () => {
        navigate('/');
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('loadScenario', { detail: 'zero' }));
      }
    },
    {
      id: 'bench-mid',
      category: 'Tax Benchmarks',
      title: 'Mid-Level Professional (₹15 LPA)',
      subtitle: 'Balanced HRA & 80C deductions scenario',
      icon: ShieldCheck,
      keywords: ['15 lpa', 'mid level', 'scenario'],
      action: () => {
        navigate('/');
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('loadScenario', { detail: 'mid' }));
      }
    },
    {
      id: 'bench-lead',
      category: 'Tax Benchmarks',
      title: 'Senior Tech Lead (₹32 LPA)',
      subtitle: 'High 30% tax bracket aggressive deduction optimization',
      icon: Zap,
      keywords: ['32 lpa', 'tech lead', 'high bracket', 'scenario'],
      action: () => {
        navigate('/');
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent('loadScenario', { detail: 'lead' }));
      }
    },

    // Tax Laws Quick Jump
    {
      id: 'law-112a',
      category: 'Tax Laws',
      title: 'Section 112A: LTCG on Equity (12.5%)',
      subtitle: '₹1.25 Lakh annual exemption limit (Budget 2024 update)',
      icon: BookMarked,
      keywords: ['112a', 'ltcg', 'long term capital gains', 'stocks', 'mutual funds'],
      action: () => {
        navigate('/library');
        setIsOpen(false);
      }
    },
    {
      id: 'law-87a',
      category: 'Tax Laws',
      title: 'Section 87A: Tax Rebate up to ₹12 Lakhs',
      subtitle: 'Zero tax payable up to ₹12 Lakhs taxable income in New Regime',
      icon: CheckCircle,
      keywords: ['87a', 'rebate', 'zero tax', 'new regime'],
      action: () => {
        navigate('/library');
        setIsOpen(false);
      }
    },
    {
      id: 'law-harvesting',
      category: 'Tax Laws',
      title: 'Tax-Loss Harvesting Strategies',
      subtitle: 'Offset short-term and long-term gains legally before March 31',
      icon: TrendingUp,
      keywords: ['loss harvesting', 'tax loss', 'offset gains', 'march 31'],
      action: () => {
        navigate('/library');
        setIsOpen(false);
      }
    }
  ];

  // Filtering
  const cleanQ = query.trim().toLowerCase();
  const filteredItems = cleanQ === ''
    ? items
    : items.filter((item) => {
        return (
          item.title.toLowerCase().includes(cleanQ) ||
          item.subtitle.toLowerCase().includes(cleanQ) ||
          item.category.toLowerCase().includes(cleanQ) ||
          item.keywords.some((k) => k.includes(cleanQ))
        );
      });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredItems[selectedIndex];
      if (current) current.action();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-[#131A2E] border border-[#E7E2D7] dark:border-[#26304A] rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[75vh]"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search sections, actions, scenarios, or tax laws..."
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400 shadow-xs">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div 
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="overflow-y-auto flex-1 p-2 space-y-1"
          >
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-[#A5B0C8] text-sm">
                No matching results found for "{query}".
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => item.action()}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1A233A]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          isSelected
                            ? 'bg-[#8B5CF6] text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-[#1A233A] text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {isSelected && (
                        <div className="flex items-center text-[10px] text-[#7C3AED] dark:text-[#8B5CF6] font-semibold gap-1">
                          <span>Select</span>
                          <CornerDownLeft className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-2.5 px-4 bg-slate-50 dark:bg-[#0E1528] border-t border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1 bg-white dark:bg-[#1A233A] rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">↑</kbd>
                <kbd className="px-1 bg-white dark:bg-[#1A233A] rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 bg-white dark:bg-[#1A233A] rounded border border-slate-300 dark:border-slate-700 font-mono text-[9px]">↵</kbd>
                <span>Open</span>
              </span>
            </div>
            <span className="font-semibold text-[#0D9488] dark:text-[#2DD4BF]">
              Taxync Quick Command
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
