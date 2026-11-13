# TAXYNC — Intelligent Indian Tax Regime Optimizer & Wealth Compounding Engine

An institutional-grade, full-stack FinTech web application for Indian salaried professionals and creators to analyze, optimize, and project income tax liabilities under **FY 2025–26 (AY 2026–27)**.

---

## Key Highlights

- **Real-Time Regime Comparator**: Precise tax liability calculations contrasting Old vs. New Tax Regimes (incorporating Budget 2024–25 enhancements and Section 87A full tax rebate up to ₹12 Lakhs).
- **Interactive Appraisal Simulator**: Test expected compensation hikes (0%–50%) and surplus investments directly beneath the calculation engine.
- **Monthly Net Take-Home Ledger**: Detailed waterfall breakdown from gross annual CTC to 1st-of-the-month bank credit (accounting for EPF, Professional Tax, and TDS).
- **March 31 Action Plan**: Live countdown tracker detecting headroom across Section 80C, 80D, NPS Tier-1 (80CCD(1B)), and Section 112A equity harvesting.
- **Investment Compounding Hub**: Cross-page synchronization routing tax savings surplus into systematic mutual fund accumulation (SIP) and retirement drawdown longevity (SWP).
- **Client-Side Document Parsing**: Extract salary parameters directly from Form 16 / payslip PDFs with zero external server exposure.
- **Dynamic Excel Models**: Instant generation of multi-tab formatted workbooks (`.xlsx`) via OpenPyXL.
- **Universal Command Palette (`Ctrl + K`)**: Instant keyboard navigation across calculation benchmarks, legal sections, and filing tools.

---

## System Architecture

```
                       ┌───────────────────────────────┐
                       │     React 18 + TypeScript     │
                       │     (Vite + Tailwind CSS)     │
                       └──────────────┬────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
      [ Lenis Physics ]      [ Client PDF Engine ]   [ LocalStorage Bus ]
      Smooth inertial        Instant client-side      Cross-page state
      momentum scroll        payslip extraction       synchronization
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │ HTTP / JSON
                                      ▼
                       ┌───────────────────────────────┐
                       │      FastAPI Backend (Py)     │
                       │     Asynchronous REST API     │
                       └──────────────┬────────────────┘
                                      │
              ┌───────────────────────┴───────────────────────┐
              ▼                                               ▼
     [ Pure Tax Engine ]                            [ Document Services ]
   Budget 2024-25 Slabs,                          OpenPyXL Spreadsheet Engine,
   Sec 87A Rebate, Cess 4%                        ReportLab PDF Generation
```

---

## Technology Stack

### Frontend
- **Framework**: React 18, TypeScript, Vite
- **Styling & UI**: Tailwind CSS, Lucide Icons, Custom Fintech Mint Palette
- **Animation & Physics**: Framer Motion, Lenis Smooth Scroll

### Backend
- **Engine**: Python 3.11+, FastAPI, Uvicorn
- **Validation**: Pydantic v2
- **Document Generation**: OpenPyXL (Excel), ReportLab (PDF)

---

## Local Setup & Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+ and pip

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## Verified Tax Test Suite

The core calculation logic is validated against official `incometax.gov.in` test scenarios:

```bash
cd backend
python tests/test_tax_cases.py
```
