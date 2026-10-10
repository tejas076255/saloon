from datetime import datetime, timezone
import uuid
import random
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.invoice import Invoice, InvoiceItem
from app.models.payment import Payment
from app.models.customer import Customer
from app.models.product import Product
from app.models.service import Service
from app.models.audit import AuditLog
from app.models.salon import Salon
from app.schemas.invoice import InvoiceCreate, PaymentCreate


class InvoiceService:
    @staticmethod
    def generate_invoice_number(db: Session, salon_id: str) -> str:
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        count = db.query(func.count(Invoice.id)).filter(
            Invoice.salon_id == salon_id
        ).scalar() or 0
        seq = count + 1
        return f"INV-{date_str}-{seq:04d}"

    @staticmethod
    def create_invoice(
        db: Session,
        salon: Salon,
        invoice_in: InvoiceCreate,
        user_id: str
    ) -> Invoice:
        # 1. Idempotency Check: Prevent duplicate submissions
        if invoice_in.idempotency_key:
            existing = db.query(Invoice).filter(
                Invoice.salon_id == salon.id,
                Invoice.idempotency_key == invoice_in.idempotency_key
            ).first()
            if existing:
                return existing

        # 2. Strict Financial Calculations on Backend
        subtotal = 0.0
        calculated_items = []

        for item in invoice_in.items:
            unit_price = float(item.unit_price)
            if unit_price < 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Item unit price cannot be negative: {item.name}"
                )
            if item.quantity <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Item quantity must be at least 1: {item.name}"
                )
                
            item_subtotal = round(unit_price * item.quantity, 2)
            subtotal += item_subtotal

            # Basic inventory stock check & deduction if retail product
            if item.item_type == "product" and item.product_id:
                prod = db.query(Product).filter(
                    Product.id == item.product_id,
                    Product.salon_id == salon.id
                ).first()
                if prod:
                    prod.stock_quantity = max(0, prod.stock_quantity - item.quantity)

            calculated_items.append({
                "item_type": item.item_type,
                "service_id": item.service_id,
                "product_id": item.product_id,
                "name": item.name,
                "quantity": item.quantity,
                "unit_price": unit_price,
                "subtotal": item_subtotal
            })

        subtotal = round(subtotal, 2)

        # 3. Calculate Discount
        discount_amount = 0.0
        discount_value = float(invoice_in.discount_value)
        if invoice_in.discount_type == "percent":
            if discount_value > 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Percentage discount cannot exceed 100%"
                )
            discount_amount = round(subtotal * (discount_value / 100.0), 2)
        else:  # fixed
            if discount_value > subtotal:
                discount_amount = subtotal
            else:
                discount_amount = round(discount_value, 2)

        # 4. Calculate Taxes
        taxable_amount = max(0.0, round(subtotal - discount_amount, 2))
        effective_tax_rate = invoice_in.tax_rate if invoice_in.tax_rate is not None else salon.tax_rate
        tax_amount = round(taxable_amount * (effective_tax_rate / 100.0), 2)
        total_amount = round(taxable_amount + tax_amount, 2)

        # 5. Calculate Payments
        total_paid = 0.0
        payment_records = []
        for p in invoice_in.payments:
            pay_amt = float(p.amount)
            if pay_amt <= 0:
                continue
            total_paid += pay_amt
            payment_records.append(p)

        total_paid = round(total_paid, 2)
        balance_amount = max(0.0, round(total_amount - total_paid, 2))

        # Status definition
        if balance_amount == 0.0 and total_amount > 0:
            inv_status = "PAID"
        elif total_paid > 0:
            inv_status = "PARTIAL"
        else:
            inv_status = "UNPAID"

        # 6. Generate Unique Invoice Number
        invoice_number = InvoiceService.generate_invoice_number(db, salon.id)

        # 7. Create Invoice
        invoice = Invoice(
            salon_id=salon.id,
            customer_id=invoice_in.customer_id,
            customer_name=invoice_in.customer_name,
            customer_phone=invoice_in.customer_phone,
            invoice_number=invoice_number,
            idempotency_key=invoice_in.idempotency_key,
            subtotal=subtotal,
            discount_type=invoice_in.discount_type,
            discount_value=discount_value,
            discount_amount=discount_amount,
            tax_rate=effective_tax_rate,
            tax_amount=tax_amount,
            total_amount=total_amount,
            paid_amount=total_paid,
            balance_amount=balance_amount,
            status=inv_status,
            notes=invoice_in.notes,
            created_by_id=user_id,
        )
        db.add(invoice)
        db.flush()  # Populates invoice.id

        # 8. Create Invoice Items
        for ci in calculated_items:
            db_item = InvoiceItem(
                invoice_id=invoice.id,
                item_type=ci["item_type"],
                service_id=ci["service_id"],
                product_id=ci["product_id"],
                name=ci["name"],
                quantity=ci["quantity"],
                unit_price=ci["unit_price"],
                subtotal=ci["subtotal"]
            )
            db.add(db_item)

        # 9. Create Payments (with clear non-verified indicator for manual entries)
        for pr in payment_records:
            db_payment = Payment(
                salon_id=salon.id,
                invoice_id=invoice.id,
                amount=pr.amount,
                payment_method=pr.payment_method.upper(),
                reference_id=pr.reference_id,
                is_verified=False,  # Clearly not auto-verified unless gateway webhook
                notes=pr.notes
            )
            db.add(db_payment)

        # 10. Update Customer Stats if registered customer
        if invoice_in.customer_id:
            customer = db.query(Customer).filter(
                Customer.id == invoice_in.customer_id,
                Customer.salon_id == salon.id
            ).first()
            if customer:
                customer.total_visits = (customer.total_visits or 0) + 1
                customer.total_spent = round((customer.total_spent or 0.0) + total_amount, 2)
                customer.last_visit_at = datetime.now(timezone.utc)

        # 11. Audit Log
        audit = AuditLog(
            salon_id=salon.id,
            user_id=user_id,
            action="INVOICE_CREATED",
            resource_type="invoice",
            resource_id=invoice.id,
            details=f"Created {invoice_number} for {invoice.customer_name} total: ₹{total_amount}"
        )
        db.add(audit)

        db.commit()
        db.refresh(invoice)
        return invoice

    @staticmethod
    def cancel_invoice(db: Session, salon_id: str, invoice_id: str, user_id: str, reason: str = "") -> Invoice:
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.salon_id == salon_id
        ).first()
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        if invoice.status == "CANCELLED":
            raise HTTPException(status_code=400, detail="Invoice is already cancelled")

        invoice.status = "CANCELLED"
        audit = AuditLog(
            salon_id=salon_id,
            user_id=user_id,
            action="INVOICE_CANCELLED",
            resource_type="invoice",
            resource_id=invoice.id,
            details=f"Cancelled {invoice.invoice_number}. Reason: {reason}"
        )
        db.add(audit)
        db.commit()
        db.refresh(invoice)
        return invoice

    @staticmethod
    def refund_invoice(db: Session, salon_id: str, invoice_id: str, user_id: str, reason: str = "") -> Invoice:
        invoice = db.query(Invoice).filter(
            Invoice.id == invoice_id,
            Invoice.salon_id == salon_id
        ).first()
        if not invoice:
            raise HTTPException(status_code=404, detail="Invoice not found")
        if invoice.status == "REFUNDED":
            raise HTTPException(status_code=400, detail="Invoice is already refunded")

        invoice.status = "REFUNDED"
        audit = AuditLog(
            salon_id=salon_id,
            user_id=user_id,
            action="REFUND_ISSUED",
            resource_type="invoice",
            resource_id=invoice.id,
            details=f"Refunded {invoice.invoice_number}. Amount: ₹{invoice.paid_amount}. Reason: {reason}"
        )
        db.add(audit)
        db.commit()
        db.refresh(invoice)
        return invoice
