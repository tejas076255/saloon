import re
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, SalonMember
from app.models.salon import Salon
from app.models.subscription import Subscription
from app.models.service import ServiceCategory, Service
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse
from app.dependencies.auth import get_current_user

router = APIRouter()


def slugify(text: str) -> str:
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')


@router.post("/signup", response_model=Token)
def signup(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists"
        )

    # 1. Create User
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone
    )
    db.add(new_user)
    db.flush()

    # 2. Create Salon Workspace
    salon_name = user_in.salon_name or f"{user_in.full_name}'s Salon"
    base_slug = slugify(salon_name)
    slug = base_slug
    idx = 1
    while db.query(Salon).filter(Salon.slug == slug).first():
        slug = f"{base_slug}-{idx}"
        idx += 1

    salon = Salon(
        name=salon_name,
        slug=slug,
        phone=user_in.phone,
        email=user_in.email,
        currency="₹",
        tax_rate=18.0,
        tax_name="GST"
    )
    db.add(salon)
    db.flush()

    # 3. Create Owner Membership
    member = SalonMember(
        salon_id=salon.id,
        user_id=new_user.id,
        role="owner"
    )
    db.add(member)

    # 4. Initialize 14-day Pro Trial Subscription
    sub = Subscription(
        salon_id=salon.id,
        plan_id="pro",
        plan_name="Pro Growth",
        status="trial",
        amount=699.0,
        is_dev_mode=True
    )
    db.add(sub)

    # 5. Seed default starter service categories and common services
    hair_cat = ServiceCategory(salon_id=salon.id, name="Hair Styling & Cut", icon="scissors", display_order=1)
    beard_cat = ServiceCategory(salon_id=salon.id, name="Beard & Shave", icon="sparkles", display_order=2)
    facial_cat = ServiceCategory(salon_id=salon.id, name="Facial & Spa", icon="smile", display_order=3)
    db.add_all([hair_cat, beard_cat, facial_cat])
    db.flush()

    starter_services = [
        Service(salon_id=salon.id, category_id=hair_cat.id, name="Executive Haircut & Wash", price=350.0, duration_minutes=35),
        Service(salon_id=salon.id, category_id=hair_cat.id, name="Classic Fade & Styling", price=250.0, duration_minutes=30),
        Service(salon_id=salon.id, category_id=beard_cat.id, name="Royal Beard Trim & Hot Towel", price=200.0, duration_minutes=25),
        Service(salon_id=salon.id, category_id=facial_cat.id, name="Hydra Glow Express Facial", price=850.0, duration_minutes=45),
        Service(salon_id=salon.id, category_id=hair_cat.id, name="Keratin Hair Treatment", price=1800.0, duration_minutes=60),
    ]
    db.add_all(starter_services)

    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id, salon_id=salon.id, role="owner")
    return {
        "access_token": token,
        "token_type": "bearer",
        "salon_id": salon.id,
        "role": "owner",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "phone": new_user.phone
        }
    }


@router.post("/login", response_model=Token)
def login(login_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_in.email).first()
    if not user or not user.hashed_password or not verify_password(login_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Find primary membership
    member = db.query(SalonMember).filter(SalonMember.user_id == user.id, SalonMember.is_active == True).first()
    salon_id = member.salon_id if member else None
    role = member.role if member else "staff"

    token = create_access_token(subject=user.id, salon_id=salon_id, role=role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "salon_id": salon_id,
        "role": role,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone
        }
    }


@router.get("/me")
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memberships = db.query(SalonMember).filter(SalonMember.user_id == user.id, SalonMember.is_active == True).all()
    salons_info = []
    for m in memberships:
        s = db.query(Salon).filter(Salon.id == m.salon_id).first()
        if s:
            salons_info.append({
                "id": s.id,
                "name": s.name,
                "slug": s.slug,
                "role": m.role
            })

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "salons": salons_info
    }
