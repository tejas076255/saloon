from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, require_roles, SalonContext
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter()


@router.get("", response_model=List[ProductResponse])
def get_products(
    active_only: bool = True,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.salon_id == context.salon_id)
    if active_only:
        query = query.filter(Product.is_active == True)
    return query.order_by(Product.name.asc()).all()


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    prod_in: ProductCreate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    product = Product(
        salon_id=context.salon_id,
        name=prod_in.name.strip(),
        sku=prod_in.sku,
        barcode=prod_in.barcode,
        price=prod_in.price,
        cost_price=prod_in.cost_price or 0.0,
        stock_quantity=prod_in.stock_quantity or 0,
        low_stock_threshold=prod_in.low_stock_threshold or 5,
        is_active=prod_in.is_active if prod_in.is_active is not None else True
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    prod_in: ProductUpdate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.salon_id == context.salon_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    data = prod_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product
