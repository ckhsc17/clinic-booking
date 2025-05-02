# 操作方式
## booking-backend
cd 到 booking-backend 資料夾
python -m venv .venv
pip install -r requirements.txt
uvicorn main:app --reload

## booking-frontend
cd 到 booking-frontend 資料夾
npm install
npm run dev


psql postgresql://postgres.mqqbkcdnpnuvwhjlqnbf:aaaaqwe1237414aaaa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

SELECT *
FROM appointments
WHERE appointment_time = '2025-10-25 07:31:31';


