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