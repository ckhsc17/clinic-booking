import psycopg2

"""psql postgresql://postgres.mqqbkcdnpnuvwhjlqnbf:aaaaqwe1237414aaaa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
    postgresql://postgres.mqqbkcdnpnuvwhjlqnbf:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
"""
# 連線資訊
conn = psycopg2.connect(
    dbname='postgres',
    user='postgres.mqqbkcdnpnuvwhjlqnbf',
    password='aaaaqwe1237414aaaa',
    host='aws-0-ap-southeast-1.pooler.supabase.com',
    port='6543',
    sslmode='disable'
)

# 建立游標
cur = conn.cursor()

cur.execute("""
    SELECT *
    FROM appointments
    WHERE appointment_time >= %s
      AND appointment_time <  %s;
""", ('2025-10-25 00:00:00', '2025-10-26 00:00:00'))

# 抓取並輸出結果
rows = cur.fetchall()
for row in rows:
    print(row)

# 關閉
cur.close()
conn.close()
