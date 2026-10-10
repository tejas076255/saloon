from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, require_roles, SalonContext
from app.models.invoice import Invoice
from app.schemas.invoice import (
    InvoiceCreate, InvoiceResponse, InvoiceActionRequest
)
from app.services.invoice_service import InvoiceService
from app.services.pdf_service import PDFService

router = APIRouter()


@router.post("", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
def create_invoice(
    invoice_in: InvoiceCreate,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    """
    Creates a new invoice with backend financial calculation verification,
    split payments, stock deduction, and duplicate prevention.
    """
    invoice = InvoiceService.create_invoice(
        db=db,
        salon=context.salon,
        invoice_in=invoice_in,
        user_id=context.user.id
    )
    return invoice


@router.get("", response_model=List[InvoiceResponse])
def get_invoices(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    query = db.query(Invoice).filter(Invoice.salon_id == context.salon_id)
    if status_filter:
        query = query.filter(Invoice.status == status_filter.upper())
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Invoice.invoice_number.ilike(search_fmt),
                Invoice.customer_name.ilike(search_fmt),
                Invoice.customer_phone.ilike(search_fmt)
            )
        )
    invoices = query.order_by(desc(Invoice.created_at)).offset(skip).limit(limit).all()
    return invoices


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: str,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.salon_id == context.salon_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("/{invoice_id}/cancel", response_model=InvoiceResponse)
def cancel_invoice(
    invoice_id: str,
    action: InvoiceActionRequest = InvoiceActionRequest(),
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    invoice = InvoiceService.cancel_invoice(
        db=db,
        salon_id=context.salon_id,
        invoice_id=invoice_id,
        user_id=context.user.id,
        reason=action.reason or ""
    )
    return invoice


@router.post("/{invoice_id}/refund", response_model=InvoiceResponse)
def refund_invoice(
    invoice_id: str,
    action: InvoiceActionRequest = InvoiceActionRequest(),
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    invoice = InvoiceService.refund_invoice(
        db=db,
        salon_id=context.salon_id,
        invoice_id=invoice_id,
        user_id=context.user.id,
        reason=action.reason or ""
    )
    return invoice


@router.get("/{invoice_id}/pdf")
def download_invoice_pdf(
    invoice_id: str,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    invoice = db.query(Invoice).filter(
        Invoice.id == invoice_id,
        Invoice.salon_id == context.salon_id
    ).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")

    pdf_bytes = PDFService.generate_invoice_pdf(invoice, context.salon)
    filename = f"{invoice.invoice_number}.pdf"
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
