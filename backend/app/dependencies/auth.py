from typing import Optional, List
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_token
from app.models.user import User, SalonMember
from app.models.salon import Salon

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
        
    payload = decode_token(token)
    if not payload:
        raise credentials_exception
        
    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise credentials_exception
        
    return user


class SalonContext:
    def __init__(self, salon: Salon, member: SalonMember, user: User):
        self.salon = salon
        self.member = member
        self.user = user
        self.salon_id = salon.id
        self.role = member.role


def get_current_salon_context(
    x_salon_id: Optional[str] = Header(None, alias="X-Salon-Id"),
    token: Optional[str] = Depends(oauth2_scheme),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SalonContext:
    """
    Enforces strict tenant isolation.
    Extracts targeted salon_id from token or header, then verifies user is an authorized member.
    Never trusts client-supplied salon_id without checking membership!
    """
    target_salon_id = x_salon_id
    
    if not target_salon_id and token:
        payload = decode_token(token)
        if payload:
            target_salon_id = payload.get("salon_id")

    # If no specific salon requested, default to the user's first active membership
    if not target_salon_id:
        membership = db.query(SalonMember).filter(
            SalonMember.user_id == user.id,
            SalonMember.is_active == True
        ).first()
    else:
        membership = db.query(SalonMember).filter(
            SalonMember.salon_id == target_salon_id,
            SalonMember.user_id == user.id,
            SalonMember.is_active == True
        ).first()

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You do not have active membership in this salon workspace"
        )
        
    salon = db.query(Salon).filter(Salon.id == membership.salon_id, Salon.is_active == True).first()
    if not salon:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Salon workspace not found or deactivated"
        )
        
    return SalonContext(salon=salon, member=membership, user=user)


def require_roles(allowed_roles: List[str]):
    def role_checker(context: SalonContext = Depends(get_current_salon_context)) -> SalonContext:
        if context.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action requires one of the following roles: {', '.join(allowed_roles)}"
            )
        return context
    return role_checker
