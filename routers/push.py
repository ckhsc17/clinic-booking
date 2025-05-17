from fastapi import FastAPI, HTTPException
from linebot import LineBotApi
from linebot.models import TextSendMessage
from schemas import PushRequest  # ← 從 schemas 匯入
import os

app = FastAPI()
line_bot_api = LineBotApi(os.getenv("LINE_CHANNEL_ACCESS_TOKEN"))

@app.post("/push")
def push_message(data: PushRequest):
    try:
        line_bot_api.push_message(data.user_id, TextSendMessage(text=data.message))
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
