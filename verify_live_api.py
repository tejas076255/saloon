import httpx

base = 'http://127.0.0.1:8000/api/v1'

print("--- Testing Live SalonDesk API Flow ---")

# 1. Signup
signup_res = httpx.post(f'{base}/auth/signup', json={
    'email': 'verify.owner2@salondesk.io',
    'password': 'Password123!',
    'full_name': 'Aarav Singhania',
    'salon_name': 'The Royale Barber Studio'
})
assert signup_res.status_code == 200, signup_res.text
signup = signup_res.json()
token = signup['access_token']
salon_id = signup['salon_id']
headers = {'Authorization': f'Bearer {token}'}
print(f"[PASS] Salon created: {salon_id} for user {signup['user']['full_name']}")

# 2. Get Seeded Services
services = httpx.get(f'{base}/services', headers=headers).json()
print(f"[PASS] Seeded Services: {len(services)} services available")
assert len(services) > 0

# 3. Create Customer
cust = httpx.post(f'{base}/customers', json={
    'name': 'Devendra Mehta',
    'phone': '+91 98200 99887',
    'preferences': 'Low fade with texture, allergic to menthol'
}, headers=headers).json()
print(f"[PASS] Customer created: {cust['name']} ({cust['phone']})")

# 4. Create POS Invoice with 18% Tax and UPI payment
service = services[0]
inv_res = httpx.post(f'{base}/invoices', json={
    'customer_id': cust['id'],
    'customer_name': cust['name'],
    'customer_phone': cust['phone'],
    'idempotency_key': 'test-idem-key-live-2',
    'items': [{
        'item_type': 'service',
        'service_id': service['id'],
        'name': service['name'],
        'quantity': 1,
        'unit_price': service['price']
    }],
    'discount_type': 'fixed',
    'discount_value': 0.0,
    'payments': [{
        'amount': round(service['price'] * 1.18, 2),
        'payment_method': 'UPI',
        'reference_id': 'UPI-REF-TEST-8899'
    }]
}, headers=headers)
assert inv_res.status_code == 201, inv_res.text
inv = inv_res.json()
print(f"[PASS] Invoice Generated: {inv['invoice_number']} | Total: Rs.{inv['total_amount']} | Status: {inv['status']}")
assert inv['status'] == 'PAID'

# 5. Check Daily Report
rep = httpx.get(f'{base}/reports/daily', headers=headers).json()
print(f"[PASS] Daily Report: Gross Billed Rs.{rep['gross_billed']} | Net Sales Rs.{rep['net_sales']} | Invoices: {rep['invoice_count']}")
assert rep['invoice_count'] >= 1
assert rep['gross_billed'] > 0

# 6. Check PDF Receipt Generation
pdf_res = httpx.get(f"{base}/invoices/{inv['id']}/pdf", headers=headers)
assert pdf_res.status_code == 200
assert len(pdf_res.content) > 1000
print(f"[PASS] PDF Receipt Download: {len(pdf_res.content)} bytes generated cleanly")

# 7. Check Subscription Status
sub = httpx.get(f'{base}/subscriptions/current', headers=headers).json()
print(f"[PASS] Subscription: {sub['plan_name']} | Status: {sub['status']} | Dev Mode Sandbox: {sub['is_dev_mode']}")
assert sub['status'] == 'trial'

print("\n--- ALL LIVE VERTICAL SLICES VERIFIED AND PASSING 100%! ---")
