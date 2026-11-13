import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response

from app.models import TaxCalculationRequest, ExportRequest, ShareRequest
from app.tax_engine import process_tax_calculation, calculate_old_regime_tax, calculate_new_regime_tax
from app.export_service import generate_pdf_report, generate_excel_report
from app.storage import set_cache, get_cache

app = FastAPI(title="Taxync API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "online", "app": "Taxync API", "version": "2.0.0"}

@app.post("/calculate-tax")
async def calculate_tax(request: TaxCalculationRequest):
    try:
        return process_tax_calculation(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export/pdf")
async def export_pdf(request: ExportRequest):
    try:
        pdf_buf = generate_pdf_report(request.formData, request.taxResult, request.chartImage)
        return StreamingResponse(
            pdf_buf,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=Taxync_Report_{datetime.now().year}.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF export failed: {e}")

@app.post("/export/excel")
async def export_excel(request: ExportRequest):
    try:
        excel_buf = generate_excel_report(request.formData, request.taxResult)
        return Response(
            content=excel_buf.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": f"attachment; filename=Taxync_Report_{datetime.now().year}.xlsx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Excel export failed: {e}")

@app.post("/share")
async def create_share_link(request: ShareRequest):
    report_id = str(uuid.uuid4())
    payload = {
        "formData": request.formData,
        "taxResult": request.taxResult,
        "createdAt": datetime.utcnow().isoformat()
    }
    set_cache(f"report:{report_id}", payload, ttl_seconds=86400)
    return {"reportId": report_id}

@app.get("/share/{report_id}")
async def fetch_shared_report(report_id: str):
    data = get_cache(f"report:{report_id}")
    if not data:
        raise HTTPException(status_code=404, detail="Shared report expired or not found.")
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
