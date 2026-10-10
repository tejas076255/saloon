import io
import csv
from datetime import date, datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, SalonContext
from app.models.invoice import Invoice
from app.schemas.report import DailyReportResponse, SalesReportResponse
from app.services.report_service import ReportService

router = APIRouter()


@router.get("/daily", response_model=DailyReportResponse)
def get_daily_report(
    report_date: Optional[date] = None,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    target = report_date or datetime.now(timezone.utc).date()
    return ReportService.get_daily_report(db, context.salon_id, target)


@router.get("/sales", response_model=SalesReportResponse)
def get_sales_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    today = datetime.now(timezone.utc).date()
    end = end_date or today
    start = start_date or (end - timedelta(days=6))  # 7-day default

    return ReportService.get_sales_report(db, context.salon_id, start, end)


@router.get("/export")
def export_invoices_csv(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice).filter(Invoice.salon_id == context.salon_id)
    if start_date:
        query = query.filter(Invoice.created_at >= datetime.combine(start_date, datetime.min.time()))
    if end_date:
        query = query.filter(Invoice.created_at <= datetime.combine(end_date, datetime.max.time()))

    invoices = query.order_by(Invoice.created_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Invoice Number", "Date", "Customer Name", "Customer Phone",
        "Subtotal", "Discount", "Tax", "Total Billed", "Paid", "Balance", "Status"
    ])

    for inv in invoices:
        writer.writerow([
            inv.invoice_number,
            inv.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            inv.customer_name,
            inv.customer_phone or "",
            f"{inv.subtotal:.2f}",
            f"{inv.discount_amount:.2f}",
            f"{inv.tax_amount:.2f}",
            f"{inv.total_amount:.2f}",
            f"{inv.paid_amount:.2f}",
            f"{inv.balance_amount:.2f}",
            inv.status
        ])

    csv_content = output.getvalue()
    filename = f"salondesk-sales-{datetime.now().strftime('%Y%m%d')}.csv"

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
