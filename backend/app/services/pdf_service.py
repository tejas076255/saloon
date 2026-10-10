import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from app.models.invoice import Invoice
from app.models.salon import Salon


class PDFService:
    @staticmethod
    def generate_invoice_pdf(invoice: Invoice, salon: Salon) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'InvoiceTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#1e1b4b")  # Deep indigo
        )
        
        subtitle_style = ParagraphStyle(
            'InvoiceSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#4b5563")
        )
        
        header_text = f"<b>{salon.name.upper()}</b><br/>{salon.tagline or 'Luxury Salon & Spa'}<br/>{salon.address or ''} {salon.city or ''}<br/>Phone: {salon.phone or 'N/A'}"
        
        elements = []
        elements.append(Paragraph(salon.name, title_style))
        elements.append(Paragraph(header_text, subtitle_style))
        elements.append(Spacer(1, 15))
        
        # Invoice metadata table
        inv_date = invoice.created_at.strftime("%d %b %Y, %I:%M %p")
        meta_data = [
            [
                Paragraph(f"<b>INVOICE TO:</b><br/>{invoice.customer_name}<br/>Phone: {invoice.customer_phone or 'Walk-in'}", subtitle_style),
                Paragraph(f"<b>INVOICE NO:</b> {invoice.invoice_number}<br/><b>DATE:</b> {inv_date}<br/><b>STATUS:</b> {invoice.status}", subtitle_style)
            ]
        ]
        meta_table = Table(meta_data, colWidths=[270, 270])
        meta_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 15))
        
        # Items Table
        table_data = [["Item / Service", "Type", "Qty", "Price", "Amount"]]
        for item in invoice.items:
            table_data.append([
                item.name,
                item.item_type.capitalize(),
                str(item.quantity),
                f"{salon.currency}{item.unit_price:.2f}",
                f"{salon.currency}{item.subtotal:.2f}"
            ])
            
        col_widths = [220, 80, 50, 90, 100]
        items_table = Table(table_data, colWidths=col_widths)
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#312e81")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
            ('TOPPADDING', (0, 0), (-1, 0), 6),
            ('ALIGN', (2, 0), (-1, -1), 'RIGHT'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e5e7eb")),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f9fafb")]),
            ('TOPPADDING', (0, 1), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ]))
        elements.append(items_table)
        elements.append(Spacer(1, 15))
        
        # Financial summary table
        curr = salon.currency
        summary_data = [
            ["Subtotal:", f"{curr}{invoice.subtotal:.2f}"],
            ["Discount:", f"-{curr}{invoice.discount_amount:.2f}"],
            [f"{salon.tax_name} ({invoice.tax_rate}%):", f"{curr}{invoice.tax_amount:.2f}"],
            ["Total Billed:", f"{curr}{invoice.total_amount:.2f}"],
            ["Paid Amount:", f"{curr}{invoice.paid_amount:.2f}"],
            ["Balance Due:", f"{curr}{invoice.balance_amount:.2f}"],
        ]
        
        summary_table = Table(summary_data, colWidths=[440, 100])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 3), (-1, 3), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 3), (-1, 3), 11),
            ('LINEABOVE', (0, 3), (1, 3), 1, colors.HexColor("#312e81")),
            ('LINEBELOW', (0, 3), (1, 3), 1, colors.HexColor("#312e81")),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor("#dc2626") if invoice.balance_amount > 0 else colors.HexColor("#16a34a")),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 25))
        
        # Footer
        footer_style = ParagraphStyle(
            'InvoiceFooter',
            parent=styles['Normal'],
            fontName='Helvetica-Oblique',
            fontSize=9,
            alignment=1,
            textColor=colors.HexColor("#6b7280")
        )
        elements.append(Paragraph("Thank you for visiting SalonDesk! We appreciate your patronage.", footer_style))
        elements.append(Paragraph("This is a computer-generated tax invoice.", footer_style))
        
        doc.build(elements)
        buffer.seek(0)
        return buffer.getvalue()
