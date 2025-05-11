# linebot-backend/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from linebot import LineBotApi
from linebot.models import TextSendMessage
from dotenv import load_dotenv
from schemas import PushRequest
import requests
import os
import json

# 初始化
app = FastAPI(
    title="愛惟美診所 LINE Bot",
    description="包含 webhook 接收與推播功能。",
    version="1.1.0"
)

# 載入環境變數
load_dotenv()
CHANNEL_ACCESS_TOKEN = os.getenv("CHANNEL_ACCESS_TOKEN").strip()
line_bot_api = LineBotApi(CHANNEL_ACCESS_TOKEN)

HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {CHANNEL_ACCESS_TOKEN}"
}

# ✅ webhook 接收訊息
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


# ✅ 提供 /push API 被其他服務（如 booking）呼叫
@app.post("/push")
def push_message(data: PushRequest):
    try:
        line_bot_api.push_message(data.user_id, TextSendMessage(text=data.message))
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"status": "LINE bot is running."}
