from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
import requests
import os
from dotenv import load_dotenv

app = FastAPI(
    title="愛惟美診所",
    description="一個用於管理預約系統的 LINE Bot 後端服務（無 SDK 版）。",
    version="1.0.0"
)

# 載入 .env 環境變數
load_dotenv()

CHANNEL_ACCESS_TOKEN = os.getenv("CHANNEL_ACCESS_TOKEN")
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {CHANNEL_ACCESS_TOKEN}"
}

@app.get("/")
def root():
    return {"status": "歡迎使用 LINE Bot 後端服務（純 requests）"}

@app.post("/callback")
async def callback(request: Request):
    body = await request.json()
    print("📦 接收到 webhook:", body)

    events = body.get("events", [])
    for event in events:
        if event.get("type") == "message" and event["message"].get("type") == "text":
            user_id = event["source"]["userId"]
            user_msg = event["message"]["text"]
            reply_token = event["replyToken"]

            if user_msg in ["預約", "預約療程", "我要預約"]:
                payload = {
                    "replyToken": reply_token,
                    "messages": [
                        {
                            "type": "flex",
                            "altText": "立即預約療程",
                            "contents": {
                                "type": "bubble",
                                "hero": {
                                    "type": "image",
                                    "url": "https://your-clinic.com/logo.png",
                                    "size": "full",
                                    "aspectRatio": "20:13",
                                    "aspectMode": "cover"
                                },
                                "body": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "contents": [
                                        {
                                            "type": "text",
                                            "text": "歡迎預約療程",
                                            "weight": "bold",
                                            "size": "xl"
                                        },
                                        {
                                            "type": "text",
                                            "text": "立即線上預約，專人為您服務",
                                            "size": "sm",
                                            "color": "#999999",
                                            "margin": "md"
                                        }
                                    ]
                                },
                                "footer": {
                                    "type": "box",
                                    "layout": "vertical",
                                    "spacing": "sm",
                                    "contents": [
                                        {
                                            "type": "button",
                                            "style": "primary",
                                            "action": {
                                                "type": "uri",
                                                "label": "立即預約",
                                                "uri": "https://your-nextjs-frontend.com/booking"
                                            }
                                        }
                                    ],
                                    "flex": 0
                                }
                            }
                        }
                    ]
                }
            else:
                payload = {
                    "replyToken": reply_token,
                    "messages": [
                        {
                            "type": "text",
                            "text": "您好，請輸入「預約」來開始預約療程 💆‍♀️"
                        }
                    ]
                }

            requests.post("https://api.line.me/v2/bot/message/reply", headers=HEADERS, json=payload)

    return PlainTextResponse("OK", status_code=200)
