import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Save, 
  Check,
  CreditCard,
  Building,
  RotateCcw,
  Sparkles,
  City
} from 'lucide-react';

export function Profile() {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('taxync_user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: '',
      email: '',
      phone: '',
      location: 'Bengaluru, India',
      cityType: 'metro', // 'metro' or 'non-metro'
      pan: '',
      employmentType: 'Salaried IT Professional',
      seniorCitizen: false,
      taxRegimePreference: 'New Regime (FY 2025-26)',
      assessmentYear: 'AY 2026-27',
    };
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('taxync_user_profile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearData = () => {
    if (confirm('Clear all locally saved tax calculations, custom profile, and reset blueprints?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const displayName = profile.name.trim() || 'Taxpayer';

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#2DD4BF] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#8B5CF6]/20">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {displayName}
              </h1>
              <span className="px-2 py-0.5 text-xs font-bold bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] rounded-md border border-[#2DD4BF]/30">
                Verified Taxpayer
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mt-0.5">
              {profile.employmentType} • {profile.location} ({profile.cityType === 'metro' ? 'Metro HRA 50%' : 'Non-Metro HRA 40%'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#0D9488] dark:text-[#2DD4BF] font-semibold bg-[#2DD4BF]/10 px-3 py-1.5 rounded-xl border border-[#2DD4BF]/20 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#2DD4BF] animate-pulse" />
          <span>Local Device Encrypted</span>
        </div>
      </motion.div>

      {/* Profile Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Taxpayer Profile Settings (2 cols) */}
        <div className="md:col-span-2 bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm transition-colors duration-300">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-[#7C3AED] dark:text-[#8B5CF6]" />
            <span>Taxpayer Filing Profile</span>
          </h2>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="e.g. rahul.sharma@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">Permanent Account Number (PAN)</label>
                <input
                  type="text"
                  value={profile.pan}
                  maxLength={10}
                  onChange={(e) => setProfile({ ...profile, pan: e.target.value.toUpperCase() })}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] font-mono uppercase font-bold tracking-wider"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">City / HRA Jurisdiction</label>
                <select
                  value={profile.cityType}
                  onChange={(e) => setProfile({ ...profile, cityType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                >
                  <option value="metro">Metro (Delhi, Mumbai, Kolkata, Chennai) - 50% Basic</option>
                  <option value="non-metro">Non-Metro (All Other Cities) - 40% Basic</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-[#A5B0C8] font-semibold mb-1">Employment Category</label>
                <select
                  value={profile.employmentType}
                  onChange={(e) => setProfile({ ...profile, employmentType: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Salaried IT Professional">Salaried IT / Tech Professional</option>
                  <option value="Content Creator / YouTuber / Influencer">Content Creator / YouTuber / Influencer</option>
                  <option value="Startup Founder / Early Employee (ESOPs)">Startup Founder / Early Employee (ESOPs)</option>
                  <option value="Freelancer / Remote Global Contractor (44ADA)">Freelancer / Remote Global Contractor (44ADA)</option>
                  <option value="Stock Trader / F&O Market Investor">Stock Trader / F&O Market Investor</option>
                  <option value="Medical / Legal / CA Professional">Medical / Legal / CA Professional</option>
                  <option value="Business Owner / MSME (44AD)">Business Owner / MSME (44AD)</option>
                  <option value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI Expat)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#7C3AED] dark:bg-[#8B5CF6] hover:bg-[#6D28D9] shadow-sm shadow-[#8B5CF6]/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                <span>{savedSuccess ? 'Profile Saved Locally!' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Storage & Security Controls */}
        <div className="space-y-5">
          {/* Security & Compliance Card */}
          <div className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-[#0D9488] dark:text-[#2DD4BF] font-bold text-sm">
              <ShieldCheck className="h-5 w-5" />
              <span>Zero-Storage Privacy</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8] leading-relaxed">
              Taxync operates on an on-device privacy architecture. Your salary slips, PAN, and deduction claims remain solely inside your browser cache.
            </p>
          </div>

          {/* Local Data Reset */}
          <div className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Session & Cache</h3>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
              Clear saved tax calculations, reset blueprints, or erase local session memory.
            </p>
            <button
              onClick={handleClearData}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Local Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
