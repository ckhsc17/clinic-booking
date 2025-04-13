# backend/Dockerfile
FROM python:3.8.16-slim

# 設定工作目錄
WORKDIR /linebot-backend

# 複製需求與程式
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 若使用 .env，可以用 docker run -v 掛進來
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
