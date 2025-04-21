# ✅ FastAPI + Google Calendar (服務帳戶) 整合範例

from fastapi import FastAPI
from pydantic import BaseModel
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os

# --- Google Calendar 基本設定 ---
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = './.secrets/credentials.json'  # 這是你下載的服務帳戶金鑰

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)

calendar_service = build('calendar', 'v3', credentials=credentials)
calendar_id = 'primary'  # 或是你的診所日曆 ID

# --- FastAPI 初始化 ---
app = FastAPI(title="診所預約整合 API")

# --- 輸入資料模型 ---
class BookingInfo(BaseModel):
    user_name: str
    treatment: str
    start_time: str  # e.g. '2025-04-22T15:00:00+08:00'
    end_time: str    # e.g. '2025-04-22T15:30:00+08:00'
    note: str = ""

# --- 建立 Google Calendar 活動 ---
def create_event(data: BookingInfo):
    event = {
        'summary': f'{data.treatment} - {data.user_name}',
        'location': '愛惟美診所',
        'description': data.note,
        'start': {
            'dateTime': data.start_time,
            'timeZone': 'Asia/Taipei',
        },
        'end': {
            'dateTime': data.end_time,
            'timeZone': 'Asia/Taipei',
        },
    }
    event_result = calendar_service.events().insert(calendarId=calendar_id, body=event).execute()
    return event_result.get("id")

# --- FastAPI 路由：新增預約 ---
@app.post("/create_booking")
async def book_event(info: BookingInfo):
    event_id = create_event(info)
    return {"status": "success", "calendar_event_id": event_id}
