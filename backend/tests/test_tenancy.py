def test_multi_tenant_isolation(client):
    # 1. Create Salon A (Owner A)
    res_a = client.post("/api/v1/auth/signup", json={
        "email": "owner_a@example.com",
        "password": "PasswordA123!",
        "full_name": "Salon A Owner",
        "salon_name": "Royale Barber Club"
    })
    assert res_a.status_code == 200
    token_a = res_a.json()["access_token"]
    salon_a_id = res_a.json()["salon_id"]

    # 2. Create Salon B (Owner B)
    res_b = client.post("/api/v1/auth/signup", json={
        "email": "owner_b@example.com",
        "password": "PasswordB123!",
        "full_name": "Salon B Owner",
        "salon_name": "Velvet Touch Parlour"
    })
    assert res_b.status_code == 200
    token_b = res_b.json()["access_token"]
    salon_b_id = res_b.json()["salon_id"]

    assert salon_a_id != salon_b_id

    # 3. Owner A creates a customer in Salon A
    cust_res = client.post(
        "/api/v1/customers",
        json={"name": "Rajesh Kumar", "phone": "9999911111", "notes": "VIP client for Salon A"},
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert cust_res.status_code == 201
    cust_a_id = cust_res.json()["id"]

    # 4. Owner B queries customers -> MUST NOT SEE Rajesh Kumar
    custs_b = client.get(
        "/api/v1/customers",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert custs_b.status_code == 200
    cust_names = [c["name"] for c in custs_b.json()]
    assert "Rajesh Kumar" not in cust_names

    # 5. Owner B attempts to forge header X-Salon-Id to access Salon A -> 403 Forbidden!
    forged_req = client.get(
        "/api/v1/customers",
        headers={
            "Authorization": f"Bearer {token_b}",
            "X-Salon-Id": salon_a_id
        }
    )
    assert forged_req.status_code == 403
    assert "Access forbidden" in forged_req.json()["detail"]

    # 6. Owner B directly requests Customer A by ID -> 404 / Cannot find in Salon B
    direct_req = client.get(
        f"/api/v1/customers/{cust_a_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert direct_req.status_code == 404
