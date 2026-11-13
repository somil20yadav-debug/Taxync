from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class TaxCalculationRequest(BaseModel):
    income: float
    section80C: float = 0.0
    section80D: float = 0.0
    hra: float = 0.0
    home_loan_interest: float = 0.0
    standard_deduction: float = 75000.0  # FY 2025-26 default
    edu_loan_interest: float = 0.0
    donations: float = 0.0
    section80U: str = "none"  # "none", "standard", "severe"
    royaltyIncome: float = 0.0  # 80QQB/RRB
    politicalDonation: float = 0.0  # 80GGC
    evLoanInterest: float = 0.0  # 80EEB

class ExportRequest(BaseModel):
    formData: Dict[str, Any]
    taxResult: Dict[str, Any]
    chartImage: Optional[str] = None

class ShareRequest(BaseModel):
    formData: Dict[str, Any]
    taxResult: Dict[str, Any]
