import sqlite3

con = sqlite3.connect('backend/salondesk.db')
cur = con.cursor()

tables_order = [
    'salons', 'users', 'salon_members', 'customers',
    'service_categories', 'services', 'products',
    'subscriptions', 'audit_logs', 'invoices',
    'invoice_items', 'payments'
]

with open('d1_migration.sql', 'w', encoding='utf-8') as f:
    f.write('-- Cloudflare D1 Schema and Seed for SalonDesk SaaS\n')
    f.write('PRAGMA foreign_keys = OFF;\n\n')
    
    for t in tables_order:
        sql = cur.execute(f"SELECT sql FROM sqlite_master WHERE type='table' AND name='{t}'").fetchone()
        if sql:
            create_sql = sql[0].replace('CREATE TABLE', 'CREATE TABLE IF NOT EXISTS')
            f.write(f'{create_sql};\n\n')
            
    # Indexes
    indexes = cur.execute("SELECT sql FROM sqlite_master WHERE type='index' AND sql IS NOT NULL").fetchall()
    for idx in indexes:
        idx_sql = idx[0].replace('CREATE INDEX', 'CREATE INDEX IF NOT EXISTS').replace('CREATE UNIQUE INDEX', 'CREATE UNIQUE INDEX IF NOT EXISTS')
        f.write(f'{idx_sql};\n')
        
    f.write('\n-- Seed data\n')
    for t in tables_order:
        cur.execute(f'SELECT * FROM {t}')
        rows = cur.fetchall()
        if not rows:
            continue
        cols = [d[0] for d in cur.description]
        col_names = ', '.join([f'"{c}"' for c in cols])
        for r in rows:
            vals = []
            for v in r:
                if v is None:
                    vals.append('NULL')
                elif isinstance(v, (int, float)):
                    vals.append(str(v))
                else:
                    escaped = str(v).replace("'", "''")
                    vals.append(f"'{escaped}'")
            val_str = ', '.join(vals)
            f.write(f'INSERT OR REPLACE INTO {t} ({col_names}) VALUES ({val_str});\n')

print('d1_migration.sql generated successfully!')
