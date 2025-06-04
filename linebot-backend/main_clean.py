# linebot-backend/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from linebot import LineBotApi
from linebot.models import (
    TextSendMessage,
    QuickReply,
    QuickReplyButton,
    MessageAction,
    FlexSendMessage,
    URIAction,
    ButtonComponent, 
    BoxComponent, 
    TextComponent
)

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

@app.post("/callback")
async def callback(request: Request):
    body = await request.json()
    print("📩 Webhook body:", body)

    events = body.get("events", [])
    for event in events:
        if event.get("type") == "message" and event["message"].get("type") == "text":
            await handle_text_message(event)
    
    return PlainTextResponse("OK", status_code=200)
