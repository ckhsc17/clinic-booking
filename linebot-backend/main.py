from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
import requests
import os
from dotenv import load_dotenv

app = FastAPI(
    title="愛惟美診所 Echo Bot",
    description="使用 FastAPI 與 requests 自行實作的 LINE Echo Bot。",
    version="1.0.0"
)

# 載入 .env 環境變數
load_dotenv()
CHANNEL_ACCESS_TOKEN = os.getenv("CHANNEL_ACCESS_TOKEN").strip()

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {CHANNEL_ACCESS_TOKEN}"
}

@app.get("/")
def root():
    return {"status": "Echo bot is running."}

@app.post("/callback")
async def callback(request: Request):
    body = await request.json()
    print("📩 Webhook body:", body)

    events = body.get("events", [])
    for event in events:
        if event.get("type") == "message" and event["message"].get("type") == "text":
            reply_token = event["replyToken"]
            user_msg = event["message"]["text"]

            echo_payload = {
                "replyToken": reply_token,
                "messages": [
                    {
                        "type": "text",
                        "text": f"你說了：{user_msg}"
                    }
                ]
            }

            r = requests.post("https://api.line.me/v2/bot/message/reply", headers=HEADERS, json=echo_payload)
            print(f"🟢 回傳狀態：{r.status_code} | 回應訊息：{r.text}")

    return PlainTextResponse("OK", status_code=200)
