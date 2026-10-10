import bcrypt

salt = bcrypt.gensalt(12)
hashed = bcrypt.hashpw(b'Admin@123', salt).decode()
with open('seed_admin.sql', 'w', encoding='utf-8') as f:
    f.write(f"INSERT OR REPLACE INTO users (id, email, hashed_password, full_name, phone, is_active, is_superuser, created_at, updated_at) VALUES ('admin-user-001', 'admin@salondesk.com', '{hashed}', 'SalonDesk Super Admin', '+91 99887 76655', 1, 1, '2026-10-10 00:00:00', '2026-10-10 00:00:00');\n")
    f.write("INSERT OR REPLACE INTO salon_members (id, salon_id, user_id, role, is_active, created_at) VALUES ('admin-mem-001', '1ae686e1-f1eb-46e6-97f8-c306f3ca2f26', 'admin-user-001', 'owner', 1, '2026-10-10 00:00:00');\n")
print('Generated seed_admin.sql')
