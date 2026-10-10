from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, salons, customers, services, products, invoices, reports, subscriptions
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profiles"])
api_router.include_router(salons.router, prefix="/salons", tags=["Salon Workspaces"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(services.router, prefix="/services", tags=["Services & Catalog"])
api_router.include_router(products.router, prefix="/products", tags=["Retail Products"])
api_router.include_router(invoices.router, prefix="/invoices", tags=["POS Invoicing & Billing"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Analytics"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["SaaS Subscriptions"])
