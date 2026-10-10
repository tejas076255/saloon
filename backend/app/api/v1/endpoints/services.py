from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, require_roles, SalonContext
from app.models.service import Service, ServiceCategory
from app.schemas.service import (
    ServiceCreate, ServiceUpdate, ServiceResponse,
    ServiceCategoryCreate, ServiceCategoryResponse
)

router = APIRouter()


@router.get("/categories", response_model=List[ServiceCategoryResponse])
def get_categories(
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    categories = db.query(ServiceCategory).filter(
        ServiceCategory.salon_id == context.salon_id
    ).order_by(ServiceCategory.display_order.asc(), ServiceCategory.name.asc()).all()
    return categories


@router.post("/categories", response_model=ServiceCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    cat_in: ServiceCategoryCreate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    cat = ServiceCategory(
        salon_id=context.salon_id,
        name=cat_in.name.strip(),
        description=cat_in.description,
        icon=cat_in.icon or "scissors",
        display_order=cat_in.display_order or 0
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.get("", response_model=List[ServiceResponse])
def get_services(
    category_id: Optional[str] = None,
    active_only: bool = True,
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    query = db.query(Service).filter(Service.salon_id == context.salon_id)
    if active_only:
        query = query.filter(Service.is_active == True)
    if category_id:
        query = query.filter(Service.category_id == category_id)
        
    services = query.order_by(Service.name.asc()).all()
    return services


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    service = Service(
        salon_id=context.salon_id,
        category_id=service_in.category_id,
        name=service_in.name.strip(),
        description=service_in.description,
        price=service_in.price,
        duration_minutes=service_in.duration_minutes or 30,
        is_active=service_in.is_active if service_in.is_active is not None else True
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.patch("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: str,
    service_in: ServiceUpdate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    service = db.query(Service).filter(
        Service.id == service_id,
        Service.salon_id == context.salon_id
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    data = service_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(service, field, val)

    db.commit()
    db.refresh(service)
    return service
