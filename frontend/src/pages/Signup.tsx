import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const appName = import.meta.env.VITE_APP_NAME || 'TAXYNC';

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Save profile state
    setTimeout(() => {
      if (formData.name && formData.email && formData.password) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem(
          'taxync_user_profile',
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            filingStatus: 'Salaried Individual',
            preferredRegime: 'new'
          })
        );
        window.dispatchEvent(new Event('profileUpdated'));

        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 1200);
      } else {
        setError('Please fill in all fields');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-[#F5F2EB] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-300">
      {/* 1. Animated Ambient Glowing Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/15 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -50, 40, 0],
            y: [0, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#2DD4BF]/20 dark:bg-[#2DD4BF]/15 blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#8B5CF6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-20" />
      </div>

      {/* Top Bar Actions: Theme Toggle */}
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
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#2DD4BF] text-white shadow-xl shadow-[#8B5CF6]/25 font-black text-xl mb-3 cursor-pointer"
          >
            TX
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create Your Account
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#A5B0C8] max-w-xs mx-auto">
            Get instant access to {appName}'s real-time tax optimizer & wealth calculator
          </p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white/90 dark:bg-[#131A2E]/90 backdrop-blur-xl rounded-3xl shadow-xl border border-[#E7E2D7] dark:border-[#26304A] p-6 sm:p-8"
        >
          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  placeholder="Rahul Sharma"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0B1020]/70 border border-[#E7E2D7] dark:border-[#26304A] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  placeholder="rahul@company.com"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0B1020]/70 border border-[#E7E2D7] dark:border-[#26304A] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  placeholder="At least 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm bg-slate-50/70 dark:bg-[#0B1020]/70 border border-[#E7E2D7] dark:border-[#26304A] rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center pt-4 border-t border-[#E7E2D7] dark:border-[#26304A]">
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#7C3AED] dark:text-[#8B5CF6] hover:underline font-bold">
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
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
              <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.8 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full bg-[#2DD4BF]/30"
                />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2DD4BF] to-[#0D9488] flex items-center justify-center text-white shadow-lg shadow-[#2DD4BF]/30 relative z-10">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Account Created!
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mb-4">
                Setting up your personalized dashboard...
              </p>

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
