from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.dependencies.auth import get_current_salon_context, require_roles, SalonContext
from app.models.subscription import Subscription
from app.models.audit import AuditLog
from app.schemas.subscription import SubscriptionResponse, PlanTier, PlanChangeRequest

router = APIRouter()

AVAILABLE_PLANS = [
    PlanTier(
        id="starter",
        name="Starter Plan",
        price_inr=299.0,
        billing_cycle="monthly",
        tagline="Essential tools for single-chair barbers and boutique stylists",
        features=[
            "Up to 2 Staff accounts",
            "Unlimited quick billing & receipts",
            "Customer records & preferences",
            "Daily sales summary",
            "WhatsApp receipt sharing"
        ],
        max_staff=2,
        max_invoices_per_month=300,
        is_popular=False
    ),
    PlanTier(
        id="pro",
        name="Pro Growth",
        price_inr=699.0,
        billing_cycle="monthly",
        tagline="Our most popular plan for busy salons and grooming studios",
        features=[
            "Up to 6 Staff accounts",
            "Unlimited billing & invoices",
            "Automated PDF tax receipts",
            "Inventory & retail stock tracking",
            "Full analytics, charts & CSV exports",
            "Multi-device POS mode"
        ],
        max_staff=6,
        max_invoices_per_month=2000,
        is_popular=True
    ),
    PlanTier(
        id="business",
        name="Business Elite",
        price_inr=1299.0,
        billing_cycle="monthly",
        tagline="For multi-chair luxury salons and fast-scaling franchises",
        features=[
            "Unlimited staff accounts",
            "Unlimited monthly invoices",
            "Advanced audit logs & security",
            "Multi-tax / GST compliant invoicing",
            "Priority 24/7 dedicated support",
            "Custom thermal receipt templates"
        ],
        max_staff=999,
        max_invoices_per_month=999999,
        is_popular=False
    )
]


@router.get("/current", response_model=SubscriptionResponse)
def get_current_subscription(
    context: SalonContext = Depends(get_current_salon_context),
    db: Session = Depends(get_db)
):
    sub = db.query(Subscription).filter(Subscription.salon_id == context.salon_id).first()
    if not sub:
        # Create default trial subscription if missing
        sub = Subscription(
            salon_id=context.salon_id,
            plan_id="pro",
            plan_name="Pro Growth",
            status="trial",
            amount=699.0,
            is_dev_mode=True
        )
        db.add(sub)
        db.commit()
        db.refresh(sub)

    now = datetime.now(timezone.utc)
    # Ensure current_period_end is timezone aware
    end_dt = sub.current_period_end
    if end_dt.tzinfo is None:
        end_dt = end_dt.replace(tzinfo=timezone.utc)
    delta = end_dt - now
    days_left = max(0, delta.days)

    return SubscriptionResponse(
        id=sub.id,
        salon_id=sub.salon_id,
        plan_id=sub.plan_id,
        plan_name=sub.plan_name,
        status=sub.status,
        billing_cycle=sub.billing_cycle,
        amount=sub.amount,
        current_period_start=sub.current_period_start,
        current_period_end=sub.current_period_end,
        is_dev_mode=sub.is_dev_mode,
        max_staff=sub.max_staff,
        max_invoices_per_month=sub.max_invoices_per_month,
        days_remaining=days_left,
        available_plans=AVAILABLE_PLANS
    )


@router.post("/upgrade", response_model=SubscriptionResponse)
def change_subscription_plan(
    plan_in: PlanChangeRequest,
    context: SalonContext = Depends(require_roles(["owner"])),
    db: Session = Depends(get_db)
):
    target_tier = next((p for p in AVAILABLE_PLANS if p.id == plan_in.plan_id), None)
    if not target_tier:
        raise HTTPException(status_code=400, detail="Invalid plan identifier")

    sub = db.query(Subscription).filter(Subscription.salon_id == context.salon_id).first()
    if not sub:
        sub = Subscription(salon_id=context.salon_id)
        db.add(sub)

    sub.plan_id = target_tier.id
    sub.plan_name = target_tier.name
    sub.amount = target_tier.price_inr
    sub.status = "active"
    sub.billing_cycle = plan_in.billing_cycle or "monthly"
    sub.current_period_start = datetime.now(timezone.utc)
    sub.current_period_end = datetime.now(timezone.utc) + timedelta(days=30)
    sub.max_staff = target_tier.max_staff
    sub.max_invoices_per_month = target_tier.max_invoices_per_month
    sub.is_dev_mode = True  # Clearly indicates development mode simulation

    audit = AuditLog(
        salon_id=context.salon_id,
        user_id=context.user.id,
        action="SUBSCRIPTION_UPDATED",
        resource_type="subscription",
        resource_id=sub.id,
        details=f"Upgraded to {target_tier.name} (₹{target_tier.price_inr}/mo) [Dev Mode Sandbox]"
    )
    db.add(audit)

    db.commit()
    db.refresh(sub)

    return get_current_subscription(context=context, db=db)
