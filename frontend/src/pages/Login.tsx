import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Sun, 
  Moon,
  Zap,
  Building2
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const appName = import.meta.env.VITE_APP_NAME || 'TAXYNC';

  const performLogin = (targetEmail: string, targetPass: string) => {
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (targetEmail && targetPass) {
        localStorage.setItem('isLoggedIn', 'true');
        // Ensure user profile has proper structure
        try {
          const existing = localStorage.getItem('taxync_user_profile');
          if (!existing) {
            localStorage.setItem(
              'taxync_user_profile',
              JSON.stringify({
                name: 'Demo Taxpayer',
                email: targetEmail,
                filingStatus: 'Salaried Individual',
                preferredRegime: 'new'
              })
            );
            window.dispatchEvent(new Event('profileUpdated'));
          }
        } catch (e) {}

        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError('Please enter valid credentials');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleOneClickDemo = () => {
    setEmail('demo@taxync.com');
    setPassword('demo123');
    performLogin('demo@taxync.com', 'demo123');
  };

  return (
    <div className="relative min-h-screen bg-[#F5F2EB] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-300">
      {/* 1. Animated Ambient Glowing Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Violet Ambient Orb */}
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/15 blur-3xl"
        />
        {/* Mint Ambient Orb */}
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#2DD4BF]/20 dark:bg-[#2DD4BF]/15 blur-3xl"
        />
        {/* Subtle Geometric Background Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-20" />
      </div>

      {/* Top Bar Actions: Home Link & Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2.5 rounded-xl bg-white/80 dark:bg-[#131A2E]/80 backdrop-blur-md border border-[#E7E2D7] dark:border-[#26304A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
        </button>
      </div>

      <div className="relative w-full max-w-md z-10 my-8">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          {/* Animated Logo Shield */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#2DD4BF] text-white shadow-xl shadow-[#8B5CF6]/25 font-black text-xl mb-3 cursor-pointer"
          >
            TX
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {appName}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30">
              PRO
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A5B0C8] max-w-xs mx-auto">
            Indian Tax Regime Optimization & Wealth Compounding Engine (FY 2025–26)
          </p>

          {/* Micro Feature Pills */}
          <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 dark:bg-[#131A2E]/70 border border-[#E7E2D7] dark:border-[#26304A] text-slate-600 dark:text-[#A5B0C8] shadow-xs">
              <ShieldCheck className="h-3 w-3 text-[#2DD4BF]" /> Section 87A: ₹12L Zero-Tax
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/70 dark:bg-[#131A2E]/70 border border-[#E7E2D7] dark:border-[#26304A] text-slate-600 dark:text-[#A5B0C8] shadow-xs">
              <TrendingUp className="h-3 w-3 text-[#8B5CF6]" /> SIP & SWP Lab
            </span>
          </div>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/90 dark:bg-[#131A2E]/90 backdrop-blur-xl rounded-3xl shadow-xl border border-[#E7E2D7] dark:border-[#26304A] p-6 sm:p-8"
        >
          {/* Quick Demo Login Action */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleOneClickDemo}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/15 via-[#2DD4BF]/15 to-[#8B5CF6]/15 hover:from-[#8B5CF6]/25 hover:to-[#2DD4BF]/25 border border-[#8B5CF6]/30 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98] group"
            >
              <Zap className="h-4 w-4 text-[#7C3AED] dark:text-[#8B5CF6] group-hover:scale-110 transition-transform" />
              <span>1-Click Instant Demo Access</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#8B5CF6]">
                Instant
              </span>
            </button>
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-[#E7E2D7] dark:border-[#26304A] w-full" />
              <span className="bg-white dark:bg-[#131A2E] px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
                or sign in with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0B1020]/70 border border-[#E7E2D7] dark:border-[#26304A] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('demo@taxync.com');
                    setPassword('demo123');
                  }}
                  className="text-[11px] font-semibold text-[#7C3AED] dark:text-[#8B5CF6] hover:underline"
                >
                  Fill demo credentials
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0B1020]/70 border border-[#E7E2D7] dark:border-[#26304A] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-[#8B5CF6]/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center pt-4 border-t border-[#E7E2D7] dark:border-[#26304A]">
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#7C3AED] dark:text-[#8B5CF6] hover:underline font-bold">
                Create free account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Bottom Trust & Compliance Note */}
        <div className="text-center mt-6 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#2DD4BF]" />
          <span>Client-side private calculation • Zero salary data transmitted externally</span>
        </div>
      </div>

      {/* 2. Rich Animated Success State Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white dark:bg-[#131A2E] border border-[#E7E2D7] dark:border-[#26304A] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              {/* Concentric Ripple Rings */}
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-[#2DD4BF]/30"
                />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2DD4BF] to-[#0D9488] flex items-center justify-center text-white shadow-lg shadow-[#2DD4BF]/30 relative z-10"
                >
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </motion.div>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Authentication Successful
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mb-4">
                Loading your FY 2025–26 Tax Portfolio...
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#2DD4BF] h-full rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
