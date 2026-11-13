import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  BookMarked, 
  UserCircle, 
  Sun, 
  Moon, 
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Coins,
  Search
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const appName = import.meta.env.VITE_APP_NAME || 'TAXYNC';

  const [userName, setUserName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('taxync_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) return parsed.name;
      }
    } catch (e) {}
    return 'Taxpayer';
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const saved = localStorage.getItem('taxync_user_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.name) setUserName(parsed.name);
        }
      } catch (e) {}
    };

    window.addEventListener('profileUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (name.slice(0, 2)).toUpperCase() || 'TX';
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invest & SWP', href: '/investments', icon: TrendingUp },
    { name: 'Reports Hub', href: '/reports', icon: FileSpreadsheet },
    { name: 'Tax Library', href: '/library', icon: BookMarked },
  ];

  return (
    <>
      {/* 1. TOP HEADER (Sticky, Glassmorphic on Desktop & Mobile) */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#131A2E]/90 backdrop-blur-md border-b border-[#E7E2D7] dark:border-[#26304A] transition-colors duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand & Compliance Badge */}
          <div className="flex items-center space-x-3 shrink-0">
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#2DD4BF] flex items-center justify-center shadow-md shadow-[#8B5CF6]/20 text-white font-black text-base shrink-0 group-hover:scale-105 transition-transform">
                TX
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                  {appName}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30 rounded">
                  PRO
                </span>
              </div>
            </NavLink>

            <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-[#26304A] text-[10px] text-slate-600 dark:text-[#A5B0C8] font-semibold">
              <ShieldCheck className="h-3 w-3 text-[#0D9488] dark:text-[#2DD4BF]" />
              <span>FY 2025-26</span>
            </span>
          </div>

          {/* Center: Desktop Navigation Pills (Stripe/Vercel Style) */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100/70 dark:bg-[#0B1020]/60 p-1 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A]">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`relative px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="topNavPill"
                      className="absolute inset-0 bg-white dark:bg-[#131A2E] rounded-xl shadow-sm border border-[#E7E2D7] dark:border-[#26304A]"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right: Search / Cmd+K + Theme Toggle + Profile Pill */}
          <div className="flex items-center space-x-2">
            {/* Quick Command Palette Button */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openCommandPalette'))}
              aria-label="Open command palette"
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-[#26304A] text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm text-xs"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden lg:inline text-[11px] font-medium">Quick Jump</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl bg-white dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-[#26304A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 shadow-sm"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>

            {/* Profile Pill (Web Standard Top-Right) */}
            <NavLink
              to="/profile"
              className={`flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all active:scale-95 shadow-sm ${
                location.pathname === '/profile'
                  ? 'bg-[#2DD4BF]/10 border-[#2DD4BF]/40 text-[#0D9488] dark:text-[#2DD4BF]'
                  : 'bg-white dark:bg-[#0B1020] border-[#E7E2D7] dark:border-[#26304A] text-slate-700 dark:text-slate-200 hover:border-[#8B5CF6]/50'
              }`}
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {getInitials(userName)}
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <span className="font-bold text-slate-900 dark:text-white block text-[11px] truncate max-w-[120px]">
                  {userName}
                </span>
                <span className="text-[9px] text-[#0D9488] dark:text-[#2DD4BF] font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] inline-block animate-pulse" />
                  Salaried Filing
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </header>

      {/* 2. MOBILE PHONE CHROME BOTTOM TAB BAR (One-Thumb Ergonomics) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FAF8F5]/95 dark:bg-[#131A2E]/95 backdrop-blur-lg border-t border-[#E7E2D7] dark:border-[#26304A] px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { name: 'Dashboard', href: '/', icon: LayoutDashboard },
          { name: 'Invest', href: '/investments', icon: TrendingUp },
          { name: 'Reports', href: '/reports', icon: FileSpreadsheet },
          { name: 'Library', href: '/library', icon: BookMarked },
          { name: 'Profile', href: '/profile', icon: UserCircle },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0D9488] dark:text-[#2DD4BF] font-bold'
                  : 'text-slate-500 dark:text-[#A5B0C8]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
