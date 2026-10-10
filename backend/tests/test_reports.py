from datetime import datetime, timezone

def test_daily_and_sales_reports(client):
    # 1. Signup owner
    res = client.post("/api/v1/auth/signup", json={
        "email": "report.analyst@example.com",
        "password": "Password123!",
        "full_name": "Rohan Deshmukh",
        "salon_name": "Rohan Salons"
    })
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create 2 invoices with Cash and UPI payments
    inv1_payload = {
        "customer_name": "Pooja Hegde",
        "items": [
            {"item_type": "service", "name": "Balayage Hair Color", "quantity": 1, "unit_price": 2500.0}
        ],
        "discount_type": "fixed",
        "discount_value": 0.0,
        "tax_rate": 0.0,
        "payments": [{"amount": 2500.0, "payment_method": "UPI"}]
    }
    client.post("/api/v1/invoices", json=inv1_payload, headers=headers)

    inv2_payload = {
        "customer_name": "Siddharth Malhotra",
        "items": [
            {"item_type": "service", "name": "Deep Conditioning", "quantity": 1, "unit_price": 1000.0}
        ],
        "discount_type": "fixed",
        "discount_value": 100.0,
        "tax_rate": 0.0,
        "payments": [{"amount": 900.0, "payment_method": "CASH"}]
    }
    client.post("/api/v1/invoices", json=inv2_payload, headers=headers)

    # 3. Get Daily Report
    today_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    daily_res = client.get(f"/api/v1/reports/daily?report_date={today_str}", headers=headers)
    assert daily_res.status_code == 200, daily_res.text
    daily = daily_res.json()

    assert daily["invoice_count"] == 2
    assert daily["gross_billed"] == 3400.0  # 2500 + 900
    assert daily["discounts"] == 100.0
    assert daily["payments_collected"] == 3400.0  # 2500 UPI + 900 CASH
    assert daily["upi_collected"] == 2500.0
    assert daily["cash_collected"] == 900.0
    assert len(daily["popular_services"]) >= 1

    # 4. Get Sales Range Report
    sales_res = client.get(f"/api/v1/reports/sales?start_date={today_str}&end_date={today_str}", headers=headers)
    assert sales_res.status_code == 200
    sales = sales_res.json()
    assert sales["total_invoices"] == 2
    assert sales["payment_methods_breakdown"]["UPI"] == 2500.0
    assert sales["payment_methods_breakdown"]["Cash"] == 900.0

    # 5. CSV Export
    csv_res = client.get(f"/api/v1/reports/export?start_date={today_str}&end_date={today_str}", headers=headers)
    assert csv_res.status_code == 200
    assert "text/csv" in csv_res.headers["content-type"]
    assert "Invoice Number,Date,Customer Name" in csv_res.text
    assert "Pooja Hegde" in csv_res.text
