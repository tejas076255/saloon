from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, require_roles, SalonContext, get_current_user
from app.models.salon import Salon
from app.models.user import User, SalonMember
from app.schemas.salon import SalonResponse, SalonUpdate

router = APIRouter()


@router.get("/current", response_model=SalonResponse)
def get_current_salon(context: SalonContext = Depends(get_current_salon_context)):
    salon = context.salon
    resp = SalonResponse(
        id=salon.id,
        name=salon.name,
        slug=salon.slug,
        tagline=salon.tagline,
        phone=salon.phone,
        email=salon.email,
        address=salon.address,
        city=salon.city,
        currency=salon.currency,
        tax_rate=salon.tax_rate,
        tax_name=salon.tax_name,
        timezone=salon.timezone,
        is_active=salon.is_active,
        created_at=salon.created_at,
        role=context.role
    )
    return resp


@router.patch("/current", response_model=SalonResponse)
def update_current_salon(
    salon_in: SalonUpdate,
    context: SalonContext = Depends(require_roles(["owner", "manager"])),
    db: Session = Depends(get_db)
):
    salon = context.salon
    update_data = salon_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(salon, field, value)

    db.commit()
    db.refresh(salon)
    
    return SalonResponse(
        id=salon.id,
        name=salon.name,
        slug=salon.slug,
        tagline=salon.tagline,
        phone=salon.phone,
        email=salon.email,
        address=salon.address,
        city=salon.city,
        currency=salon.currency,
        tax_rate=salon.tax_rate,
        tax_name=salon.tax_name,
        timezone=salon.timezone,
        is_active=salon.is_active,
        created_at=salon.created_at,
        role=context.role
    )


@router.get("/members")
def get_salon_members(
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    members = db.query(SalonMember, User).join(User, User.id == SalonMember.user_id).filter(
        SalonMember.salon_id == context.salon_id,
        SalonMember.is_active == True
    ).all()

    result = []
    for member, user in members:
        result.append({
            "id": member.id,
            "user_id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": member.role,
            "created_at": member.created_at
        })
    return result
