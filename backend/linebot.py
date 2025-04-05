from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from linebot import LineBotApi, WebhookHandler
from linebot.models import (
    MessageEvent, TextMessage, FlexSendMessage
)
import json
import os

app = FastAPI()

line_bot_api = LineBotApi("你的 Channel Access Token")
handler = WebhookHandler("你的 Channel Secret")

@app.post("/callback")
async def callback(request: Request):
    signature = request.headers["X-Line-Signature"]
    body = await request.body()
    body = body.decode("utf-8")

    try:
        handler.handle(body, signature)
    except Exception as e:
        print("handle error:", e)
        return PlainTextResponse("Bad Request", status_code=400)

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
        )
        line_bot_api.reply_message(event.reply_token, flex_message)
    else:
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text="您好，請輸入「預約」來開始預約療程 💆‍♀️")
        )
