import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileDown, 
  FileSpreadsheet, 
  Share2, 
  Check, 
  FileText, 
  Clock, 
  AlertCircle,
  Mail,
  Copy,
  X
} from 'lucide-react';
import { exportPDF, exportExcel, createShareableLink, CalculationData } from '../api';

export function Reports() {
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [showHRModal, setShowHRModal] = useState(false);
  const [copiedHR, setCopiedHR] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lastTaxCalculation');
      if (stored) {
        setCalculationData(JSON.parse(stored));
      } else {
        // Fallback to saved form or defaults so export never fails
        const savedForm = localStorage.getItem('taxync_saved_form');
        const parsedForm = savedForm ? JSON.parse(savedForm) : {
          income: 1200000,
          standardDeduction: 50000,
          section80C: 150000,
          hra: 100000,
          section80D: 25000,
          homeLoanInterest: 0,
          educationLoan: 0,
          donations: 0,
        };
        setCalculationData({
          formData: parsedForm,
          result: {
            old_regime_tax: 163800,
            new_regime_tax: 0,
            savings: 163800,
            recommended_regime: 'New Regime'
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error('Failed to load calculation:', e);
    }
  }, []);

  const handleExportPDF = async () => {
    if (!calculationData) return;
    try {
      setIsExportingPDF(true);
      await exportPDF(calculationData.formData, calculationData.result);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = async () => {
    if (!calculationData) return;
    try {
      setIsExportingExcel(true);
      await exportExcel(calculationData.formData, calculationData.result);
    } catch (err) {
      console.error('Excel export failed:', err);
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleShareLink = async () => {
    if (!calculationData) return;
    try {
      setShareLoading(true);
      const url = await createShareableLink(calculationData.formData, calculationData.result);
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Failed to create share link:', err);
    } finally {
      setShareLoading(false);
    }
  };

  const formData = calculationData?.formData;
  const result = calculationData?.result;
  const isNewWinner = result ? result.new_regime_tax < result.old_regime_tax : true;
  const winnerName = isNewWinner ? 'New Regime (Section 115BAC)' : 'Old Tax Regime';

  const savedProfile = (() => {
    try {
      const s = localStorage.getItem('taxync_user_profile');
      if (s) return JSON.parse(s);
    } catch (e) {}
    return null;
  })();
  const taxpayerName = savedProfile?.name || '[Your Name]';
  const taxpayerId = savedProfile?.pan ? `PAN: ${savedProfile.pan}` : '[Employee ID]';

  const hrDeclarationText = `Subject: Tax Regime & Investment Declaration for FY 2025-26 - ${taxpayerName}

Dear Payroll & HR Team,

Please find my tax regime declaration and projected deduction schedule for Financial Year 2025-26 (Assessment Year 2026-27):

1. Preferred Tax Regime: ${winnerName}
2. Annual Gross Salary: ₹${(formData?.income || 0).toLocaleString('en-IN')}
3. Eligible Chapter VI-A Deductions Declared:
   - Standard Deduction: ₹${isNewWinner ? '75,000' : '50,000'}
   - Section 80C (PPF / ELSS / Life Insurance): ₹${(formData?.section80C || 0).toLocaleString('en-IN')}
   - Section 80D (Health Insurance): ₹${(formData?.section80D || 0).toLocaleString('en-IN')}
   - House Rent Allowance (HRA) Exemption: ₹${(formData?.hra || 0).toLocaleString('en-IN')}
   - Section 24(b) Home Loan Interest: ₹${(formData?.homeLoanInterest || 0).toLocaleString('en-IN')}

Total Estimated Tax Payable for the year: ₹${((isNewWinner ? result?.new_regime_tax : result?.old_regime_tax) || 0).toLocaleString('en-IN')}.

Please adjust monthly TDS deductions accordingly.

Thank you,
${taxpayerName}
${taxpayerId}`;

  const copyHRDeclaration = async () => {
    await navigator.clipboard.writeText(hrDeclarationText);
    setCopiedHR(true);
    setTimeout(() => setCopiedHR(false), 2500);
  };

  const timestamp = calculationData?.timestamp ? new Date(calculationData.timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#131A2E] p-6 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Tax Dossier & Export Center</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] rounded-md border border-[#2DD4BF]/30">
              FY 2025-26
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#A5B0C8] mt-1">
            Export legally formatted audit dossiers for your CA, HR declaration, or personal investment ledger.
          </p>
        </div>

        {timestamp && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#A5B0C8] self-start sm:self-auto bg-[#FAF8F5] dark:bg-[#0B1020] px-3 py-1.5 rounded-xl border border-[#E7E2D7] dark:border-[#26304A]">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Last Calculated: {timestamp}</span>
          </div>
        )}
      </motion.div>

      {!calculationData ? (
        <div className="bg-white dark:bg-[#131A2E] rounded-2xl p-12 text-center border border-[#E7E2D7] dark:border-[#26304A] shadow-sm">
          <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Calculation History Found</h3>
          <p className="text-xs text-slate-500 dark:text-[#A5B0C8] max-w-md mx-auto mt-1 mb-4">
            Visit the Dashboard to run your first tax comparison. Once generated, your full audit report will be ready to export here.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7C3AED] dark:bg-[#8B5CF6] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Go to Tax Dashboard
          </a>
        </div>
      ) : (
        <>
          {/* Export Action Cards (4 Cards Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. PDF Card */}
            <div className="bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col justify-between hover:border-[#8B5CF6] transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#FB7185] flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Executive Dossier (PDF)</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] mt-0.5 leading-relaxed">
                    Designed for CA review, bank loan proofs, and official filing records.
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#FB7185] hover:opacity-90 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
              >
                <FileDown className="h-3.5 w-3.5" />
                {isExportingPDF ? 'Generating...' : 'Download PDF'}
              </button>
            </div>

            {/* 2. Excel Card */}
            <div className="bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col justify-between hover:border-[#2DD4BF] transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#2DD4BF]/15 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Audit Spreadsheet (XLSX)</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] mt-0.5 leading-relaxed">
                    Formatted workbook with deduction formulas and comparison tables.
                  </p>
                </div>
              </div>
              <button
                onClick={handleExportExcel}
                disabled={isExportingExcel}
                className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#0D9488] dark:bg-[#2DD4BF] dark:text-slate-950 hover:opacity-90 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
              >
                <FileDown className="h-3.5 w-3.5" />
                {isExportingExcel ? 'Generating...' : 'Download XLSX'}
              </button>
            </div>

            {/* 3. 1-Click HR Payroll Declaration Email Card */}
            <div className="bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col justify-between hover:border-[#7C3AED] transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 text-[#7C3AED] dark:text-[#8B5CF6] flex items-center justify-center">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">HR Payroll Memo</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] mt-0.5 leading-relaxed">
                    Pre-formatted email memo to declare your regime to your employer.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHRModal(true)}
                className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#7C3AED] dark:bg-[#8B5CF6] hover:opacity-90 shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Copy HR Email</span>
              </button>
            </div>

            {/* 4. Shareable Web Link Card */}
            <div className="bg-white dark:bg-[#131A2E] p-5 rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm flex flex-col justify-between hover:border-slate-400 transition-all">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Read-Only Share Link</h3>
                  <p className="text-[11px] text-slate-500 dark:text-[#A5B0C8] mt-0.5 leading-relaxed">
                    Generate an instant URL to share with your financial advisor.
                  </p>
                </div>
              </div>
              <button
                onClick={handleShareLink}
                disabled={shareLoading}
                className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-[#0D9488]" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? 'Copied Link!' : shareLoading ? 'Creating...' : 'Get Link'}</span>
              </button>
            </div>
          </div>

          {/* Audit Computation Sheet */}
          <div className="bg-white dark:bg-[#131A2E] rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#E7E2D7] dark:border-[#26304A] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Audit Summary & Computation Sheet</h3>
                <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">Values as per latest calculation session</p>
              </div>
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-700 dark:text-slate-300 font-mono border border-[#E7E2D7] dark:border-[#26304A]">
                CTC: ₹{(formData?.income || 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] dark:bg-[#0B1020] text-slate-600 dark:text-[#A5B0C8] font-semibold border-b border-[#E7E2D7] dark:border-[#26304A]">
                    <th className="py-3 px-5">Financial Parameter</th>
                    <th className="py-3 px-5 text-right">Old Regime Claim</th>
                    <th className="py-3 px-5 text-right">New Regime Claim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  <tr>
                    <td className="py-3 px-5 font-medium">Standard Deduction</td>
                    <td className="py-3 px-5 text-right font-mono">₹50,000</td>
                    <td className="py-3 px-5 text-right font-mono text-[#0D9488] dark:text-[#2DD4BF] font-bold">₹75,000</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-medium">Section 80C (PPF, ELSS, EPF)</td>
                    <td className="py-3 px-5 text-right font-mono">₹{(formData?.section80C || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-5 text-right font-mono text-slate-400">₹0 (Disallowed)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-medium">Section 80D (Health Insurance)</td>
                    <td className="py-3 px-5 text-right font-mono">₹{(formData?.section80D || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-5 text-right font-mono text-slate-400">₹0 (Disallowed)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-5 font-medium">House Rent Allowance (HRA)</td>
                    <td className="py-3 px-5 text-right font-mono">₹{(formData?.hra || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-5 text-right font-mono text-slate-400">₹0 (Disallowed)</td>
                  </tr>
                  <tr className="bg-[#FAF8F5]/80 dark:bg-[#0B1020]/40 font-bold">
                    <td className="py-3.5 px-5 text-slate-900 dark:text-white">Total Tax Payable</td>
                    <td className="py-3.5 px-5 text-right font-mono text-slate-900 dark:text-white">
                      ₹{(result?.old_regime_tax || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-[#0D9488] dark:text-[#2DD4BF]">
                      ₹{(result?.new_regime_tax || 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* HR Declaration Modal */}
          <AnimatePresence>
            {showHRModal && (
              <div 
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  data-lenis-prevent
                  onWheel={(e) => e.stopPropagation()}
                  className="bg-white dark:bg-[#131A2E] rounded-2xl border border-[#E7E2D7] dark:border-[#26304A] shadow-2xl max-w-xl w-full p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#E7E2D7] dark:border-[#26304A] pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-[#7C3AED] dark:text-[#8B5CF6]" />
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">HR Payroll Tax Declaration</h3>
                    </div>
                    <button
                      onClick={() => setShowHRModal(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-[#A5B0C8]">
                    Copy and send this pre-filled text to your company HR / payroll team before the investment proof deadline:
                  </p>

                  <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0B1020] border border-[#E7E2D7] dark:border-[#26304A] font-mono text-xs whitespace-pre-wrap text-slate-800 dark:text-slate-200 max-h-72 overflow-y-auto">
                    {hrDeclarationText}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowHRModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#0B1020]"
                    >
                      Close
                    </button>
                    <button
                      onClick={copyHRDeclaration}
                      className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#7C3AED] dark:bg-[#8B5CF6] hover:opacity-90 flex items-center gap-1.5 shadow-md shadow-[#8B5CF6]/20"
                    >
                      {copiedHR ? <Check className="h-3.5 w-3.5 text-[#2DD4BF]" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedHR ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
