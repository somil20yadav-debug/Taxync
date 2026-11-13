import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookMarked, 
  Info, 
  ChevronDown, 
  Sparkles, 
  Coins, 
  ShieldCheck,
  TrendingUp,
  FileText,
  Building,
  Heart,
  GraduationCap,
  Zap,
  HelpCircle
} from 'lucide-react';

interface TaxLawItem {
  id: string;
  section: string;
  title: string;
  category: 'Capital Gains' | 'Investment' | 'Health' | 'Housing' | 'Education' | 'Salary Allowances';
  humanExplanation: string;
  realWorldExample: string;
  maxLimit: string;
  maxTaxSaved: string;
  appliesTo: 'Old Regime Only' | 'Both Regimes' | 'New Regime Only';
}

const TAX_LIBRARY: TaxLawItem[] = [
  // 1. CAPITAL GAINS
  {
    id: '112a',
    section: 'Section 112A',
    title: 'Long-Term Capital Gains (LTCG) on Equity & Mutual Funds',
    category: 'Capital Gains',
    humanExplanation: 'Profits from listed equity shares and equity mutual funds held for more than 12 months. Taxed at 12.5% strictly on gains exceeding ₹1,25,000 per financial year (Budget 2024 revised).',
    realWorldExample: 'Aman sells equity mutual fund units held for 2 years and makes a profit of ₹2,00,000. The first ₹1,25,000 is completely TAX-FREE. The remaining ₹75,000 is taxed at 12.5% = ₹9,375 total tax.',
    maxLimit: '₹1,25,000 Exemption / Year',
    maxTaxSaved: '₹15,625 Tax-Free Benefit',
    appliesTo: 'Both Regimes',
  },
  {
    id: '111a',
    section: 'Section 111A',
    title: 'Short-Term Capital Gains (STCG) on Equity & Stocks',
    category: 'Capital Gains',
    humanExplanation: 'Profits from equity shares or equity funds held for less than 12 months. Taxed at a flat concessional rate of 20% regardless of your personal income tax bracket.',
    realWorldExample: 'Priya buys shares for ₹1,00,000 and sells them after 4 months for ₹1,50,000 (profit of ₹50,000). She pays a flat 20% STCG tax = ₹10,000, even if her salary falls in the 30% tax bracket.',
    maxLimit: 'No Upper Limit',
    maxTaxSaved: '10% vs 30% Slab Rate',
    appliesTo: 'Both Regimes',
  },
  {
    id: 'tlh',
    section: 'Tax-Loss Harvesting',
    title: 'Year-End Capital Gains Offsetting Strategy',
    category: 'Capital Gains',
    humanExplanation: 'Selling loss-making stocks or funds before March 31 to offset against realized capital gains. Short-term losses can offset both STCG and LTCG, reducing total tax liability to zero.',
    realWorldExample: 'Vikram realized ₹1,00,000 in short-term profit. He also has an unrealized loss of ₹60,000 in another stock. By booking that loss before March 31, his taxable net gain drops to ₹40,000, saving ₹12,000 in tax.',
    maxLimit: 'Carry forward up to 8 years',
    maxTaxSaved: 'Dynamic Tax Deduction',
    appliesTo: 'Both Regimes',
  },
  {
    id: '50aa',
    section: 'Section 50AA',
    title: 'Debt Mutual Funds & Fixed Deposits Taxation',
    category: 'Capital Gains',
    humanExplanation: 'Specified mutual funds having less than 35% in domestic equities are treated as short-term capital gains and taxed at your applicable personal income tax slab rate.',
    realWorldExample: 'Karan earns ₹15 LPA (in 20% slab) and makes ₹50,000 profit from a Liquid Debt Fund. That ₹50,000 is added directly to his annual taxable income and taxed at his slab rate.',
    maxLimit: 'Taxed at Slab Rate',
    maxTaxSaved: 'Indexed under pre-2023',
    appliesTo: 'Both Regimes',
  },
  {
    id: '54f',
    section: 'Section 54F',
    title: 'Capital Gains Exemption on Long-Term Asset Sale',
    category: 'Capital Gains',
    humanExplanation: 'Exemption from LTCG tax on sale of any capital asset (land, commercial property, shares, gold) if net sale proceeds are reinvested into purchasing or constructing a residential house.',
    realWorldExample: 'Ananya sells ancestral land and realizes ₹50 Lakhs LTCG. By purchasing a residential apartment within 2 years, her entire ₹50 Lakhs capital gain is 100% tax-free under Section 54F.',
    maxLimit: 'Capped at ₹10 Crores (Budget 2023)',
    maxTaxSaved: '100% Capital Gains Relief',
    appliesTo: 'Both Regimes',
  },
  {
    id: '54ec',
    section: 'Section 54EC',
    title: 'Capital Gains Tax-Saving Bonds (NHAI / REC / PFC)',
    category: 'Capital Gains',
    humanExplanation: 'Exemption on long-term capital gains arising from the sale of land or building if invested within 6 months into notified government infrastructure bonds having a 5-year lock-in.',
    realWorldExample: 'Ramesh sells a commercial plot with ₹40 Lakhs long-term capital gain. He invests ₹40 Lakhs into NHAI 54EC bonds within 6 months, avoiding ₹5 Lakhs in capital gains tax.',
    maxLimit: '₹50,00,000 per financial year',
    maxTaxSaved: 'Up to ₹6,25,000 (at 12.5%)',
    appliesTo: 'Both Regimes',
  },

  // 2. INVESTMENT & RETIREMENT
  {
    id: '80c',
    section: 'Section 80C',
    title: 'Life Insurance, PPF, ELSS, EPF, Home Loan Principal',
    category: 'Investment',
    humanExplanation: 'The most widely used tax shelter. Invest in Public Provident Fund, Equity Linked Saving Schemes (ELSS), EPF, or term life insurance to directly reduce gross taxable income.',
    realWorldExample: 'Rohan earns ₹15 LPA under Old Regime. He deposits ₹1.5L across PPF and ELSS. His taxable income reduces from ₹15L to ₹13.5L, directly saving ₹46,800 in cash taxes.',
    maxLimit: '₹1,50,000 per year',
    maxTaxSaved: 'Up to ₹46,800',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80ccd1b',
    section: 'Section 80CCD(1B)',
    title: 'National Pension System (NPS) Tier-1 Additional Relief',
    category: 'Investment',
    humanExplanation: 'An exclusive ₹50,000 deduction strictly OVER AND ABOVE the ₹1.5L Section 80C ceiling for investing in the government NPS retirement pension fund.',
    realWorldExample: 'Sneha maxes out 80C with ₹1.5L, and additionally contributes ₹50,000 to NPS Tier-1. In the 30% tax bracket, this extra deposit saves her an additional ₹15,600 in tax.',
    maxLimit: '₹50,000 per year',
    maxTaxSaved: 'Up to ₹15,600',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80ccd2',
    section: 'Section 80CCD(2)',
    title: 'Employer Contribution to Corporate NPS (Available in Both Regimes!)',
    category: 'Investment',
    humanExplanation: 'Contribution by your employer to your NPS account (up to 14% of basic salary for government, 10% for private companies). Crucially, this deduction is ALLOWED IN BOTH OLD AND NEW REGIMES!',
    realWorldExample: 'Aditya asks his company to restructure ₹1,00,000 of his CTC into Corporate NPS. In the New Regime, this ₹1,00,000 is deducted from taxable salary, saving him ₹20,000+ in tax.',
    maxLimit: 'Up to 14% of Basic Salary',
    maxTaxSaved: 'Up to ₹93,600 (30% slab)',
    appliesTo: 'Both Regimes',
  },
  {
    id: '87a',
    section: 'Section 87A',
    title: 'Full Tax Rebate for Salaried Individuals (FY 2025-26)',
    category: 'Investment',
    humanExplanation: 'Under the New Regime (FY 2025-26), anyone earning a taxable income up to ₹12,00,000 pays ZERO tax thanks to the enhanced ₹60,000 Section 87A rebate.',
    realWorldExample: 'Raj earns ₹12,00,000 CTC. With the ₹75,000 standard deduction, his taxable income is ₹11.25L. The calculated slab tax is ₹52,500. Section 87A gives a ₹52,500 credit, making final tax ₹0!',
    maxLimit: '₹12,00,000 Tax-Free Base',
    maxTaxSaved: '100% Tax Waiver (₹60,000)',
    appliesTo: 'Both Regimes',
  },
  {
    id: '80tta_ttb',
    section: 'Section 80TTA / 80TTB',
    title: 'Savings Account & Senior Citizen Bank Deposit Interest',
    category: 'Investment',
    humanExplanation: 'Deduction on interest earned from savings bank accounts (up to ₹10,000 under 80TTA for individuals). For senior citizens, Section 80TTB allows up to ₹50,000 interest from savings AND fixed deposits.',
    realWorldExample: 'Suresh earns ₹8,500 interest from his SBI savings account. Under Section 80TTA, the entire ₹8,500 is completely tax-free.',
    maxLimit: '₹10,000 (General) / ₹50,000 (Seniors)',
    maxTaxSaved: 'Up to ₹15,600',
    appliesTo: 'Old Regime Only',
  },

  // 3. HOUSING & PROPERTY
  {
    id: '10_13a',
    section: 'Section 10(13A)',
    title: 'House Rent Allowance (HRA) Exemption',
    category: 'Housing',
    humanExplanation: 'Exemption on actual rent paid if living in rented accommodation. Calculated as the least of: actual HRA received, 50% basic salary (metro) or 40% (non-metro), or rent paid minus 10% basic.',
    realWorldExample: 'Deepak earns basic salary ₹60,000/mo and pays ₹25,000/mo rent in Bengaluru (Metro). His eligible HRA exemption calculates to ₹19,000/mo (₹2,28,000/year tax-free).',
    maxLimit: 'Least of 3 Legal Limits',
    maxTaxSaved: 'Up to ₹1,00,000+',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '24b',
    section: 'Section 24(b)',
    title: 'Home Loan Interest on Self-Occupied House',
    category: 'Housing',
    humanExplanation: 'Deduction for interest portion repaid on a housing loan taken to purchase or construct a self-occupied residential property.',
    realWorldExample: 'Sunil pays ₹2.4 Lakhs in interest towards his housing loan this financial year. Under Section 24(b), he deducts the statutory maximum of ₹2,00,000, saving ₹62,400 in tax.',
    maxLimit: '₹2,00,000 per year',
    maxTaxSaved: 'Up to ₹62,400',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80eea',
    section: 'Section 80EEA',
    title: 'First-Time Homebuyer Affordable Housing Interest',
    category: 'Housing',
    humanExplanation: 'Additional deduction of up to ₹1,50,000 on home loan interest strictly over and above the ₹2,00,000 limit of Section 24(b) for first-time buyers of affordable housing (stamp value up to ₹45L).',
    realWorldExample: 'Gaurav bought his first flat and pays ₹3,20,000 interest. He claims ₹2,00,000 under Section 24(b) and the remaining ₹1,20,000 under Section 80EEA, claiming ₹3.2L total deduction!',
    maxLimit: '₹1,50,000 additional relief',
    maxTaxSaved: 'Up to ₹46,800',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80gg',
    section: 'Section 80GG',
    title: 'Rent Paid Deduction when HRA is NOT Provided',
    category: 'Housing',
    humanExplanation: 'Designed for freelancers, self-employed consultants, or employees who do NOT receive House Rent Allowance from their employer but pay rent for their residence.',
    realWorldExample: 'Divya is a freelance designer paying ₹18,000/month rent. Her clients do not provide HRA. Under Section 80GG, she claims up to ₹5,000/month (₹60,000/year) as a tax deduction.',
    maxLimit: '₹60,000 per year (₹5,000/mo)',
    maxTaxSaved: 'Up to ₹18,720',
    appliesTo: 'Old Regime Only',
  },

  // 4. HEALTH & FAMILY
  {
    id: '80d',
    section: 'Section 80D',
    title: 'Health Insurance Premiums & Preventive Health Checkups',
    category: 'Health',
    humanExplanation: 'Premiums paid for Mediclaim for self, spouse, and kids (up to ₹25,000) plus parents (up to ₹50,000 if senior citizens). Includes ₹5,000 for annual health checkups.',
    realWorldExample: 'Amit pays ₹22,000 health insurance for his family and ₹45,000 for his senior citizen father. He claims ₹67,000 under Section 80D, saving ₹20,904 in tax.',
    maxLimit: '₹25,000 to ₹1,00,000',
    maxTaxSaved: 'Up to ₹31,200',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80dd',
    section: 'Section 80DD',
    title: 'Maintenance & Medical Treatment of Disabled Dependent',
    category: 'Health',
    humanExplanation: 'Fixed deduction for expenses incurred on medical treatment, training, rehabilitation, or specialized insurance for a dependent family member with a disability.',
    realWorldExample: 'Manish supports his sibling who has an 80% severe disability certificate. He claims a flat statutory deduction of ₹1,25,000 without submitting individual hospital bills.',
    maxLimit: '₹75,000 (Standard) / ₹1,25,000 (Severe)',
    maxTaxSaved: 'Up to ₹39,000',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80ddb',
    section: 'Section 80DDB',
    title: 'Medical Treatment for Specified Critical Illnesses',
    category: 'Health',
    humanExplanation: 'Deduction for actual medical expenses incurred for treatment of specified diseases (Cancer, Chronic Renal Failure, Parkinson’s, Neurological diseases) for self or dependents.',
    realWorldExample: 'Nitin spends ₹1,40,000 on chemotherapy for his senior citizen mother. Under Section 80DDB, he claims the maximum allowable deduction of ₹1,00,000, saving ₹31,200 in tax.',
    maxLimit: '₹40,000 (General) / ₹1,00,000 (Seniors)',
    maxTaxSaved: 'Up to ₹31,200',
    appliesTo: 'Old Regime Only',
  },

  // 5. EDUCATION & GREEN
  {
    id: '80e',
    section: 'Section 80E',
    title: 'Higher Education Loan Interest Deduction',
    category: 'Education',
    humanExplanation: '100% tax deduction on the full interest repaid on an education loan for higher studies (India or abroad) for self, spouse, or children for up to 8 consecutive financial years.',
    realWorldExample: 'Meera took an education loan for her Masters abroad. This year she paid ₹1,20,000 in interest. The entire ₹1,20,000 is 100% tax-deductible with no upper cap!',
    maxLimit: 'No Upper Ceiling (100% Interest)',
    maxTaxSaved: '100% of Interest Paid',
    appliesTo: 'Old Regime Only',
  },
  {
    id: '80eeb',
    section: 'Section 80EEB',
    title: 'Electric Vehicle (EV) Loan Interest Deduction',
    category: 'Education',
    humanExplanation: 'Tax deduction on interest paid on a loan taken to purchase an electric four-wheeler or two-wheeler for personal use, incentivizing green mobility.',
    realWorldExample: 'Kunal takes a car loan to purchase a Tata Nexon EV. He pays ₹85,000 in interest during the financial year. Under Section 80EEB, he deducts the full ₹85,000 from his taxable income.',
    maxLimit: '₹1,50,000 per financial year',
    maxTaxSaved: 'Up to ₹46,800',
    appliesTo: 'Old Regime Only',
  },

  // 6. SALARY ALLOWANCES & EXEMPTIONS
  {
    id: '16_ia',
    section: 'Section 16(ia)',
    title: 'Standard Deduction for Salaried Employees',
    category: 'Salary Allowances',
    humanExplanation: 'Automatic statutory deduction available to all salaried taxpayers without requiring any investment proof, bills, or rent receipts. Enhanced to ₹75,000 in Budget 2024 for New Regime.',
    realWorldExample: 'An employee earning ₹10 LPA under New Regime automatically has their taxable salary reduced to ₹9,25,000 without submitting a single document to HR.',
    maxLimit: '₹75,000 (New) / ₹50,000 (Old)',
    maxTaxSaved: 'Flat Tax Base Reduction',
    appliesTo: 'Both Regimes',
  },
  {
    id: '10_10',
    section: 'Section 10(10)',
    title: 'Gratuity Exemption on Retirement or Resignation',
    category: 'Salary Allowances',
    humanExplanation: 'Gratuity received by an employee on retirement, resignation, or superannuation after completing 5 continuous years of service is completely exempt from tax up to ₹20 Lakhs.',
    realWorldExample: 'After 12 years of corporate service, Tarun resigns and receives ₹14 Lakhs gratuity from his employer. Under Section 10(10), the entire ₹14 Lakhs is 100% tax-free.',
    maxLimit: '₹20,00,000 Lifetime Limit',
    maxTaxSaved: 'Up to ₹6,24,000',
    appliesTo: 'Both Regimes',
  },
  {
    id: '80g',
    section: 'Section 80G',
    title: 'Donations to Charitable Relief Funds & NGOs',
    category: 'Salary Allowances',
    humanExplanation: 'Tax deduction on donations made to approved charitable trusts, PM National Relief Fund, or scientific research organizations. Eligible for 50% or 100% deduction.',
    realWorldExample: 'Pooja donates ₹50,000 via online banking to the Prime Minister’s National Relief Fund. Under Section 80G (100% category), she claims the entire ₹50,000 as a deduction.',
    maxLimit: 'Up to 10% of Adjusted Gross Income',
    maxTaxSaved: 'Up to ₹15,600',
    appliesTo: 'Old Regime Only',
  },
];

const CATEGORIES = ['All', 'Capital Gains', 'Investment', 'Housing', 'Health', 'Education', 'Salary Allowances'];

export function Library() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExample = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const filteredLaws = TAX_LIBRARY.filter((law) => {
    const matchesCategory = selectedCategory === 'All' || law.category === selectedCategory;
    const matchesSearch = 
      law.section.toLowerCase().includes(search.toLowerCase()) ||
      law.title.toLowerCase().includes(search.toLowerCase()) ||
      law.humanExplanation.toLowerCase().includes(search.toLowerCase()) ||
      law.realWorldExample.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm transition-colors duration-300"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#8B5CF6]/10 text-[#7C3AED] dark:text-[#8B5CF6] rounded-xl shadow-sm">
            <BookMarked className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Comprehensive Tax & Capital Gains Library</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mt-0.5">
              Authoritative, plain-English breakdown of all Indian Income Tax exemptions, legal limits, and practical calculation examples.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by section or keyword (e.g. 112A, 80C, HRA, NPS, Gratuity, 80D)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A] bg-[#FAF8F5] dark:bg-[#0B1020] text-xs text-slate-900 dark:text-white outline-none focus:border-[#8B5CF6] transition-all font-medium"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-[#7C3AED] dark:bg-[#8B5CF6] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#0B1020] text-slate-600 dark:text-[#A5B0C8] hover:text-slate-900 dark:hover:text-white border border-transparent dark:border-[#26304A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#A5B0C8] px-1">
        <span>Showing <strong>{filteredLaws.length}</strong> tax laws & allowances</span>
        <span>Click <strong>ℹ️ Practical Example</strong> for case studies</span>
      </div>

      {/* Cards Grid (Smooth, zero jerk) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredLaws.map((item) => {
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col justify-between hover:border-[#8B5CF6]/50 transition-colors duration-200 space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-slate-100 dark:bg-[#0B1020] text-[#7C3AED] dark:text-[#8B5CF6] font-mono border border-[#E7E2D7] dark:border-[#26304A]">
                    {item.section}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    item.appliesTo === 'Both Regimes'
                      ? 'bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] border border-[#2DD4BF]/30'
                      : item.appliesTo === 'New Regime Only'
                      ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                      : 'bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6] border border-[#8B5CF6]/30'
                  }`}>
                    {item.appliesTo}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-[#A5B0C8] mt-2.5 leading-relaxed font-normal">
                  {item.humanExplanation}
                </p>

                {/* Example Toggle Button (ℹ️ Real-Life Example) */}
                <div className="mt-3.5">
                  <button
                    type="button"
                    onClick={() => toggleExample(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-[#FAF8F5] dark:bg-[#0B1020] text-[#7C3AED] dark:text-[#8B5CF6] border border-[#E7E2D7] dark:border-[#26304A] hover:border-[#8B5CF6] transition-all"
                  >
                    <Info className="h-3.5 w-3.5" />
                    <span>{isExpanded ? 'Hide Practical Case Study' : 'Show Practical Case Study'}</span>
                    <ChevronDown className={`h-3 w-3 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="p-3.5 rounded-xl bg-[#2DD4BF]/5 border border-[#2DD4BF]/25 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-[#0D9488] dark:text-[#2DD4BF] block tracking-wider">
                            💡 Real-World Numerical Example
                          </span>
                          <p className="text-[11px] leading-relaxed">
                            {item.realWorldExample}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-[#26304A] flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Statutory Limit</div>
                  <div className="font-bold text-slate-900 dark:text-white font-mono">{item.maxLimit}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#0D9488] dark:text-[#2DD4BF] uppercase font-semibold">Max Relief</div>
                  <div className="font-bold text-[#0D9488] dark:text-[#2DD4BF] font-mono">{item.maxTaxSaved}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
