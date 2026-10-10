def test_signup_and_login_flow(client):
    # 1. Signup
    signup_payload = {
        "email": "barber.boss@example.com",
        "password": "Password123!",
        "full_name": "Vikram Singh",
        "phone": "+91 98765 43210",
        "salon_name": "Vikram Luxury Barbershop"
    }
    res = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "owner"
    assert data["salon_id"] is not None
    token = data["access_token"]

    # 2. Duplicate Signup Rejected
    res_dup = client.post("/api/v1/auth/signup", json=signup_payload)
    assert res_dup.status_code == 400
    assert "already exists" in res_dup.json()["detail"]

    # 3. Login
    login_payload = {
        "email": "barber.boss@example.com",
        "password": "Password123!"
    }
    res_login = client.post("/api/v1/auth/login", json=login_payload)
    assert res_login.status_code == 200
    login_data = res_login.json()
    assert "access_token" in login_data
    assert login_data["role"] == "owner"

    # 4. Login with bad password
    bad_login = client.post("/api/v1/auth/login", json={
        "email": "barber.boss@example.com",
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401

    # 5. Access /me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    me_data = me_res.json()
    assert me_data["email"] == "barber.boss@example.com"
    assert len(me_data["salons"]) == 1
