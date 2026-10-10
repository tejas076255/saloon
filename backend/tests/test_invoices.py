def test_invoice_financial_calculations_and_history(client):
    # 1. Signup owner
    res = client.post("/api/v1/auth/signup", json={
        "email": "billing.tester@example.com",
        "password": "Password123!",
        "full_name": "Karan Sharma",
        "salon_name": "Karan Studio"
    })
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create customer
    cust_res = client.post(
        "/api/v1/customers",
        json={"name": "Aman Verma", "phone": "9820012345"},
        headers=headers
    )
    customer_id = cust_res.json()["id"]

    # 3. Create invoice with 2 items, 10% discount, 18% GST, split payment (Cash ₹500 + UPI ₹200)
    # Item 1: 500 * 1 = 500
    # Item 2: 300 * 2 = 600
    # Subtotal = 1100.00
    # 10% discount = 110.00
    # Taxable = 990.00
    # Tax @ 18% = 178.20
    # Total = 1168.20
    # Payments = 500 + 200 = 700.00
    # Balance = 468.20
    # Status = PARTIAL
    inv_payload = {
        "customer_id": customer_id,
        "customer_name": "Aman Verma",
        "customer_phone": "9820012345",
        "idempotency_key": "unique-idemp-001",
        "items": [
            {"item_type": "service", "name": "Beard Styling", "quantity": 1, "unit_price": 500.0},
            {"item_type": "service", "name": "Head Massage", "quantity": 2, "unit_price": 300.0}
        ],
        "discount_type": "percent",
        "discount_value": 10.0,
        "tax_rate": 18.0,
        "payments": [
            {"amount": 500.0, "payment_method": "CASH"},
            {"amount": 200.0, "payment_method": "UPI", "reference_id": "UPI-REF-9988"}
        ],
        "notes": "Wedding grooming package"
    }

    inv_res = client.post("/api/v1/invoices", json=inv_payload, headers=headers)
    assert inv_res.status_code == 201, inv_res.text
    inv = inv_res.json()

    assert inv["subtotal"] == 1100.0
    assert inv["discount_amount"] == 110.0
    assert inv["tax_amount"] == 178.20
    assert inv["total_amount"] == 1168.20
    assert inv["paid_amount"] == 700.0
    assert inv["balance_amount"] == 468.20
    assert inv["status"] == "PARTIAL"
    assert inv["invoice_number"].startswith("INV-")

    invoice_id = inv["id"]

    # 4. Test Idempotency: re-submitting with identical idempotency key returns same invoice without duplicating
    dup_res = client.post("/api/v1/invoices", json=inv_payload, headers=headers)
    assert dup_res.status_code == 201
    assert dup_res.json()["id"] == invoice_id
    assert dup_res.json()["invoice_number"] == inv["invoice_number"]

    # 5. Customer visit count & spent updated
    cust_updated = client.get(f"/api/v1/customers/{customer_id}", headers=headers).json()["customer"]
    assert cust_updated["total_visits"] == 1
    assert cust_updated["total_spent"] == 1168.20

    # 6. Test PDF Receipt endpoint
    pdf_res = client.get(f"/api/v1/invoices/{invoice_id}/pdf", headers=headers)
    assert pdf_res.status_code == 200
    assert pdf_res.headers["content-type"] == "application/pdf"
    assert len(pdf_res.content) > 1000  # Generated valid PDF bytes

    # 7. Test Refund
    ref_res = client.post(f"/api/v1/invoices/{invoice_id}/refund", json={"reason": "Customer dissatisfied"}, headers=headers)
    assert ref_res.status_code == 200
    assert ref_res.json()["status"] == "REFUNDED"
