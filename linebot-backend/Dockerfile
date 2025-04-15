# backend/Dockerfile
FROM python:3.8.16-slim

# 設定工作目錄
WORKDIR /linebot-backend

# 複製需求與程式
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 設定環境變數（可選）
ENV FLASK_APP=test.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

# 開放 port 5000 給外部訪問
EXPOSE 8080

# 若使用 .env，可以用 docker run -v 掛進來
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
#CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]