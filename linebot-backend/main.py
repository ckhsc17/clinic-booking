from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from linebot.exceptions import InvalidSignatureError
from linebot import LineBotApi, WebhookHandler
from linebot.models import (
    MessageEvent, TextMessage, FlexSendMessage
)
import json
import os
from dotenv import load_dotenv

import hmac, hashlib, base64

app = FastAPI(
    title="愛惟美診所",
    description="一個用於管理預約系統linebot後端服務。",
    version="1.0.0"
)

# 讀取 .env 檔案；本地測試使用
# 如果有多個.env檔他怎麼知道要讀哪一個？
load_dotenv()

# 使用環境變數
channel_id = os.getenv("CHANNEL_ID")
channel_secret = os.getenv("CHANNEL_SECRET")
channel_access_token = os.getenv("CHANNEL_ACCESS_TOKEN")

print(f"Channel ID: {channel_id}")
print(f"Channel Secret: {channel_secret}")
print(f"Channel Access Token: {channel_access_token}")

line_bot_api = LineBotApi(channel_access_token)
handler = WebhookHandler(channel_secret)

@app.get("/")
def root():
    return {"status": "welcome to the clinic booking LINE bot backend"}

@app.post("/callback")
async def callback(request: Request):
    signature = request.headers.get("X-Line-Signature")
    body = await request.body()
    body_str = body.decode("utf-8")

    try:
        handler.handle(body_str, signature)
    except InvalidSignatureError:
        print("❌ 簽章驗證失敗")
        return PlainTextResponse("Invalid signature", status_code=400)
    except Exception as e:
        print("❌ 發生例外錯誤:", e)
        return PlainTextResponse("Error", status_code=400)

    return PlainTextResponse("OK", status_code=200)

@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    if event.message.text in ["預約", "預約療程", "我要預約"]:
        flex_message = FlexSendMessage(
            alt_text="立即預約療程",
            contents={
                "type": "bubble",
                "hero": {
                    "type": "image",
                    #"url": "https://your-clinic.com/logo.png",
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
                                #"uri": "https://your-nextjs-frontend.com/booking"
                            }
                        }
                    ],
                    "flex": 0
                }
            }
        )
        line_bot_api.reply_message(event.reply_token, flex_message)
    else:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="您好，請輸入「預約」來開始預約療程 💆‍♀️")
        )
