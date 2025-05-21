# linebot-backend/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import PlainTextResponse
from linebot import LineBotApi
from linebot.models import (
    TextSendMessage,
    QuickReply,
    QuickReplyButton,
    MessageAction,
    FlexSendMessage  
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
            if user_msg == "我要預約":
                #取得line user id
                user_id = event["source"]["userId"]
                print("使用者 ID:", user_id)
                message = TextSendMessage(text="請點擊下方連結進行預約：\nhttps://booking-frontend-staging-260019038661.asia-east1.run.app?user_id="+user_id)
                line_bot_api.reply_message(reply_token, message)
                return PlainTextResponse("OK", status_code=200)
            
            if user_msg == "服務說明":
                quick_reply = QuickReply(items=[
                    QuickReplyButton(action=MessageAction(label="眼整形", text="眼整形")),
                    QuickReplyButton(action=MessageAction(label="臉部整形", text="臉部整形")),
                    QuickReplyButton(action=MessageAction(label="身體雕塑", text="身體雕塑")),
                    QuickReplyButton(action=MessageAction(label="微整注射", text="微整注射")),
                    QuickReplyButton(action=MessageAction(label="雷射光療", text="雷射光療")),
                    ])
                message = TextSendMessage(text="請選擇您想了解的手術項目：",quick_reply=quick_reply)

                line_bot_api.reply_message(reply_token, message)
                return PlainTextResponse("OK", status_code=200)
                
                
            elif user_msg == "臉部整形":
                flex_message = FlexSendMessage(
                    alt_text="臉部整形服務介紹",
                    contents={
                        "type": "bubble",
                        "hero": {
                            "type": "image",
                            "url": "https://i.pinimg.com/736x/2a/7a/22/2a7a224d8d9bf710a41e3733f0f202f7.jpg",
                            "size": "full",
                            "aspectRatio": "16:9",
                            "aspectMode": "cover"
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "spacing": "md",
                            "contents": [
                                {
                                    "type": "text",
                                    "text": "👤 臉部整形",
                                    "weight": "bold",
                                    "size": "xl"
                                },
                                {
                                    "type": "text",
                                    "text": "改善五官比例、提升整體臉部輪廓",
                                    "size": "sm",
                                    "wrap": True,
                                    "color": "#666666"
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {"type": "text", "text": "💰 價格", "flex": 1, "size": "sm"},
                                        {"type": "text", "text": "約 NT$80,000 起", "flex": 4, "size": "sm", "color": "#111111"}
                                    ]
                                },
                                {
                                    "type": "box",
                                    "layout": "baseline",
                                    "spacing": "sm",
                                    "contents": [
                                        {"type": "text", "text": "⏱️ 時間", "flex": 1, "size": "sm"},
                                        {"type": "text", "text": "約 2～4 小時，恢復期約 1～2 週", "flex": 4, "size": "sm", "wrap": True, "color": "#111111"}
                                    ]
                                }
                            ]
                        },
                        "footer": {
                            "type": "box",
                            "layout": "horizontal",
                            "spacing": "sm",
                            "contents": [
                                {
                                    "type": "button",
                                    "style": "primary",
                                    "height": "sm",
                                    "action": {
                                        "type": "uri",
                                        "label": "預約諮詢",
                                        "uri": "https://beautyeye.com.tw/"
                                    }
                                }
                            ],
                            "flex": 0
                        }
                    }
                )
                line_bot_api.reply_message(reply_token, flex_message)
                return PlainTextResponse("OK", status_code=200)


            elif user_msg == "眼整形":
                detail_msg = (
                    "👁️ 眼整形\n\n"
                    "📌 簡介：針對眼部進行調整，例如雙眼皮手術、開眼頭、眼袋移除等，讓雙眼更有神、更有精神。\n"
                    "💰 價格：NT$30,000 起\n"
                    "⏱️ 手術時間：約 1 小時，術後可當日返家"
                )
                line_bot_api.reply_message(reply_token, TextSendMessage(text=detail_msg))
                return PlainTextResponse("OK", status_code=200)
                
            elif user_msg == "身體雕塑":
                detail_msg = (
                    "🏋️‍♀️ 身體雕塑\n\n"
                    "📌 簡介：透過抽脂、自體脂肪移植、緊實療程等，改善局部脂肪堆積與體態曲線。\n"
                    "💰 價格：約 NT$50,000 起\n"
                    "⏱️ 手術時間：約 2 小時，恢復期約 1～2 週"
                )
                line_bot_api.reply_message(reply_token, TextSendMessage(text=detail_msg))
                return PlainTextResponse("OK", status_code=200)

            elif user_msg == "微整注射":
                detail_msg = (
                    "💉 微整注射\n\n"
                    "📌 簡介：如玻尿酸、肉毒桿菌等注射，可改善皺紋、豐唇、修飾輪廓，見效快且幾乎無恢復期。\n"
                    "💰 價格：NT$6,000 起\n"
                    "⏱️ 手術時間：約 15～30 分鐘，當天可正常活動"
                )
                line_bot_api.reply_message(reply_token, TextSendMessage(text=detail_msg))
                return PlainTextResponse("OK", status_code=200)

            elif user_msg == "雷射光療":
                detail_msg = (
                    "🔆 雷射光療\n\n"
                    "📌 簡介：用雷射技術改善痘疤、斑點、毛孔粗大等膚況，促進肌膚更新與亮白。\n"
                    "💰 價格：NT$3,000 起／次\n"
                    "⏱️ 手術時間：約 30 分鐘，依療程次數調整"
                )
                line_bot_api.reply_message(reply_token, TextSendMessage(text=detail_msg))
                return PlainTextResponse("OK", status_code=200)


            elif user_msg == "查詢紀錄":
                print("收到查詢紀錄請求")
                user_id = event["source"]["userId"]
                print("使用者 ID:", user_id)

                try:
                    # 呼叫自己的 server backend API
                    resp = requests.get(
                        f"https://booking-backend-prod-260019038661.asia-east1.run.app/api/patients/records",
                        params={"user_id": user_id},
                        timeout=5
                    )

                    if resp.status_code == 404:
                        print("🔍 使用者不存在，建立預設資料中...")
                        
                        # 1. 查詢使用者 LINE 資料
                        profile = line_bot_api.get_profile(user_id)
                        user_name = profile.display_name
                        
                        # 2. 呼叫 booking backend 新增病人
                        patient_resp = requests.post(
                            "https://booking-backend-prod-xxx.run.app/api/patients",
                            json={
                                "user_id": user_id,
                                "name": user_name,
                                "gender": "",
                                "birthdate": "",
                                "phone": "",
                                "email": "",
                                "address": "",
                                "role": "Normal"
                            }
                        )
                        
                    elif resp.status_code == 200:
                        record = resp.json()
                        print("查詢紀錄成功：", record)
                        msg = (
                            f"📋 上次就診紀錄：\n"
                            f"- 🕒 就診時間：{record['last_visit_time']}\n"
                            f"- 🩺 看診項目：{record['last_treatment']}\n"
                            f"- 💊 藥劑剩餘：{record['medication_left']}"
                        )
                    else:
                        print("❌ 查詢失敗，狀態碼：", resp.status_code)
                        print("❌ 查詢失敗，回應內容：", resp.text)
                        msg = "⚠️ 查詢失敗，請稍後再試。"

                except Exception as e:
                    print("❌ 查詢錯誤：", e)
                    msg = "⚠️ 系統錯誤，請稍後再試。"

                reply_payload = {
                    "replyToken": reply_token,
                    "messages": [{"type": "text", "text": msg}]
                }
                r = requests.post("https://api.line.me/v2/bot/message/reply", headers=HEADERS, json=reply_payload)
                return PlainTextResponse("OK", status_code=200)

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
