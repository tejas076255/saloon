from datetime import datetime, date, time, timezone, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from app.models.invoice import Invoice, InvoiceItem
from app.models.payment import Payment
from app.schemas.report import DailyReportResponse, SalesReportResponse, ServiceSalesStat


class ReportService:
    @staticmethod
    def get_daily_report(db: Session, salon_id: str, target_date: date) -> DailyReportResponse:
        start_dt = datetime.combine(target_date, time.min)
        end_dt = datetime.combine(target_date, time.max)

        # Invoices created on this day
        invoices = db.query(Invoice).filter(
            Invoice.salon_id == salon_id,
            Invoice.created_at >= start_dt,
            Invoice.created_at <= end_dt
        ).all()

        gross_billed = 0.0
        discounts = 0.0
        refunds = 0.0
        outstanding_balances = 0.0
        invoice_count = 0

        for inv in invoices:
            if inv.status == "CANCELLED":
                continue
            if inv.status == "REFUNDED":
                refunds += inv.paid_amount
                continue
            gross_billed += inv.total_amount
            discounts += inv.discount_amount
            outstanding_balances += inv.balance_amount
            invoice_count += 1

        gross_billed = round(gross_billed, 2)
        discounts = round(discounts, 2)
        refunds = round(refunds, 2)
        outstanding_balances = round(outstanding_balances, 2)
        net_sales = max(0.0, round(gross_billed - discounts - refunds, 2))

        # Payments collected on this day
        payments = db.query(Payment).filter(
            Payment.salon_id == salon_id,
            Payment.created_at >= start_dt,
            Payment.created_at <= end_dt
        ).all()

        cash_collected = 0.0
        upi_collected = 0.0
        card_collected = 0.0

        for p in payments:
            amt = float(p.amount)
            method = p.payment_method.upper()
            if "CASH" in method:
                cash_collected += amt
            elif "UPI" in method:
                upi_collected += amt
            elif "CARD" in method:
                card_collected += amt
            else:
                cash_collected += amt  # default

        cash_collected = round(cash_collected, 2)
        upi_collected = round(upi_collected, 2)
        card_collected = round(card_collected, 2)
        payments_collected = round(cash_collected + upi_collected + card_collected, 2)

        # Top services on this day
        service_stats = db.query(
            InvoiceItem.name,
            func.count(InvoiceItem.id).label("cnt"),
            func.sum(InvoiceItem.subtotal).label("rev")
        ).join(Invoice, Invoice.id == InvoiceItem.invoice_id).filter(
            Invoice.salon_id == salon_id,
            Invoice.created_at >= start_dt,
            Invoice.created_at <= end_dt,
            Invoice.status != "CANCELLED"
        ).group_by(InvoiceItem.name).order_by(func.sum(InvoiceItem.subtotal).desc()).limit(5).all()

        popular_services = [
            ServiceSalesStat(
                name=stat[0],
                count=int(stat[1]),
                revenue=round(float(stat[2] or 0.0), 2)
            ) for stat in service_stats
        ]

        return DailyReportResponse(
            date=target_date.isoformat(),
            gross_billed=gross_billed,
            discounts=discounts,
            refunds=refunds,
            net_sales=net_sales,
            payments_collected=payments_collected,
            outstanding_balances=outstanding_balances,
            cash_collected=cash_collected,
            upi_collected=upi_collected,
            card_collected=card_collected,
            invoice_count=invoice_count,
            popular_services=popular_services
        )

    @staticmethod
    def get_sales_report(db: Session, salon_id: str, start_date: date, end_date: date) -> SalesReportResponse:
        daily_breakdown = []
        curr = start_date
        total_gross = 0.0
        total_disc = 0.0
        total_ref = 0.0
        total_paid = 0.0
        total_out = 0.0
        total_invs = 0
        total_cash = 0.0
        total_upi = 0.0
        total_card = 0.0

        while curr <= end_date:
            day_rep = ReportService.get_daily_report(db, salon_id, curr)
            daily_breakdown.append(day_rep)
            total_gross += day_rep.gross_billed
            total_disc += day_rep.discounts
            total_ref += day_rep.refunds
            total_paid += day_rep.payments_collected
            total_out += day_rep.outstanding_balances
            total_invs += day_rep.invoice_count
            total_cash += day_rep.cash_collected
            total_upi += day_rep.upi_collected
            total_card += day_rep.card_collected
            curr += timedelta(days=1)

        total_net = max(0.0, round(total_gross - total_disc - total_ref, 2))

        # Overall top services in range
        start_dt = datetime.combine(start_date, time.min)
        end_dt = datetime.combine(end_date, time.max)
        top_services_query = db.query(
            InvoiceItem.name,
            func.count(InvoiceItem.id).label("cnt"),
            func.sum(InvoiceItem.subtotal).label("rev")
        ).join(Invoice, Invoice.id == InvoiceItem.invoice_id).filter(
            Invoice.salon_id == salon_id,
            Invoice.created_at >= start_dt,
            Invoice.created_at <= end_dt,
            Invoice.status != "CANCELLED"
        ).group_by(InvoiceItem.name).order_by(func.sum(InvoiceItem.subtotal).desc()).limit(10).all()

        top_services = [
            ServiceSalesStat(
                name=stat[0],
                count=int(stat[1]),
                revenue=round(float(stat[2] or 0.0), 2)
            ) for stat in top_services_query
        ]

        return SalesReportResponse(
            start_date=start_date.isoformat(),
            end_date=end_date.isoformat(),
            total_gross_billed=round(total_gross, 2),
            total_discounts=round(total_disc, 2),
            total_refunds=round(total_ref, 2),
            total_net_sales=total_net,
            total_payments_collected=round(total_paid, 2),
            total_outstanding=round(total_out, 2),
            total_invoices=total_invs,
            payment_methods_breakdown={
                "Cash": round(total_cash, 2),
                "UPI": round(total_upi, 2),
                "Card": round(total_card, 2),
            },
            top_services=top_services,
            daily_breakdown=daily_breakdown
        )
