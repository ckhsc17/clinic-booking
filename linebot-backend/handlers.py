from linebot.models import *
from fastapi.responses import PlainTextResponse
import requests

async def handle_text_message(event):
    user_msg = event["message"]["text"]
    reply_token = event["replyToken"]

    if user_msg == "我要預約":
        await handle_booking(event, reply_token)
    elif user_msg == "取消預約":
        await handle_cancel(event, reply_token)
    elif user_msg == "服務說明":
        await handle_service_intro(event, reply_token)
    elif user_msg == "臉部整形":
        await handle_face_surgery(event, reply_token)
    elif user_msg == "眼整形":
        await handle_eye_surgery(event, reply_token)
    elif user_msg == "身體雕塑":
        await handle_body_sculpting(event, reply_token)
    elif user_msg == "微整注射":
        await handle_injection(event, reply_token)
    elif user_msg == "雷射光療":
        await handle_laser_therapy(event, reply_token)
    elif user_msg == "查詢紀錄":
        await handle_query_records(event, reply_token)
    else:
        await handle_echo(event, reply_token)

async def handle_booking(event, reply_token):
    user_id = event["source"]["userId"]
    flex_message = FlexSendMessage(
        alt_text="預約選項",
        contents={...}  # 原始 bubble 簡化略
    )
    line_bot_api.reply_message(reply_token, flex_message)

async def handle_cancel(event, reply_token):
    flex_cancel = FlexSendMessage(
        alt_text="取消預約資訊",
        contents={...}
    )
    line_bot_api.reply_message(reply_token, flex_cancel)

async def handle_service_intro(event, reply_token):
    quick_reply = QuickReply(items=[...])
    message = TextSendMessage(text="請選擇您想了解的手術項目：", quick_reply=quick_reply)
    line_bot_api.reply_message(reply_token, message)

# 更多 handler: handle_face_surgery, handle_eye_surgery, ...
