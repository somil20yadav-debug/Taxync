# TAXYNC

An institutional-grade Indian tax planning and wealth compounding web platform built for Financial Year 2025–26 (Assessment Year 2026–27), reflecting all Union Budget 2024–25 direct tax provisions.

---

## Overview

TAXYNC enables salaried taxpayers, tech professionals, and creators to navigate India's dual tax regime framework with mathematical precision. It compares the Old and New tax regimes, tracks fiscal deadlines, simulates appraisal growth, and models long-term compounding by investing tax savings.

---

## Core Capabilities

- **Dual-Regime Assessment Engine**: Computes exact liability under Old Regime (with Chapter VI-A deductions) versus New Regime (Section 115BAC with enhanced ₹75,000 standard deduction and Section 87A rebate covering up to ₹12 Lakhs).
- **Interactive Appraisal Simulator**: Test expected salary increments (0%–50%) and surplus deduction allocations directly beneath the calculator.
- **Monthly Net Take-Home Breakdown**: Converts annual CTC into monthly payroll figures: Gross Monthly minus Employee PF, Professional Tax, and TDS.
- **March 31 Action Plan**: Live countdown tracker detecting unused headroom across Section 80C, 80D, 80CCD(1B) NPS, and Section 112A equity harvesting.
- **Investment Compounding Hub**: Cross-page synchronization directing annual tax savings into equity SIP compounding or retirement SWP longevity simulations.
- **Client-Side Document Parsing**: Client-side parsing of salary slips and Form 16 PDFs with zero server transmission.
- **Audit Spreadsheet Generation**: Server-side Excel generation using OpenPyXL with formatted tables and live formulas.
- **Global Command Palette (`Ctrl + K`)**: Quick keyboard navigation across calculation benchmarks, legal sections, and tools.

---

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lenis Scroll Engine
- **Backend**: Python 3.11+, FastAPI, Uvicorn, Pydantic v2
- **Document Services**: OpenPyXL (Excel), ReportLab (PDF)

---

## Local Development

### 1. Backend Service
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

The web dashboard runs at `http://localhost:5173` and the API runs at `http://127.0.0.1:8000`.

---

## Automated Verification

The core calculation logic is verified against official Income Tax Department test scenarios:

```bash
cd backend
python tests/test_tax_cases.py
```
