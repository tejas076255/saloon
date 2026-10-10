from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, SalonContext
from app.models.customer import Customer
from app.models.invoice import Invoice
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.schemas.invoice import InvoiceResponse

router = APIRouter()


@router.get("", response_model=List[CustomerResponse])
def get_customers(
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    query = db.query(Customer).filter(Customer.salon_id == context.salon_id)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Customer.name.ilike(search_fmt),
                Customer.phone.ilike(search_fmt),
                Customer.email.ilike(search_fmt)
            )
        )
    customers = query.order_by(Customer.name.asc()).offset(skip).limit(limit).all()
    return customers


@router.post("", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    customer_in: CustomerCreate,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    # Check for duplicate phone in this specific salon if phone is provided
    if customer_in.phone:
        existing = db.query(Customer).filter(
            Customer.salon_id == context.salon_id,
            Customer.phone == customer_in.phone.strip()
        ).first()
        if existing:
            return existing

    customer = Customer(
        salon_id=context.salon_id,
        name=customer_in.name.strip(),
        phone=customer_in.phone.strip() if customer_in.phone else None,
        email=customer_in.email.strip() if customer_in.email else None,
        gender=customer_in.gender,
        notes=customer_in.notes,
        preferences=customer_in.preferences
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


@router.get("/{customer_id}")
def get_customer_details(
    customer_id: str,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.salon_id == context.salon_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found in this salon")

    # Invoices history
    invoices = db.query(Invoice).filter(
        Invoice.customer_id == customer_id,
        Invoice.salon_id == context.salon_id
    ).order_by(desc(Invoice.created_at)).limit(20).all()

    return {
        "customer": CustomerResponse.model_validate(customer),
        "invoices": [InvoiceResponse.model_validate(inv) for inv in invoices]
    }


@router.patch("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: str,
    customer_in: CustomerUpdate,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id,
        Customer.salon_id == context.salon_id
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found in this salon")

    update_data = customer_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(customer, field, val)

    db.commit()
    db.refresh(customer)
    return customer
