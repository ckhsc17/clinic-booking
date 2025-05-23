# services/calendar.py

from google.oauth2 import service_account
from googleapiclient.discovery import build
from datetime import datetime
from schemas import BookingInfo
import os

# Google Calendar 設定
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'clinicbooking-456701-de23520b55e4.json'
CALENDAR_ID = os.getenv("CALENDAR_ID", "primary")

# 授權與初始化 Calendar API 客戶端
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES
)
calendar_service = build('calendar', 'v3', credentials=credentials)

# ✅ 使用 BookingInfo 封裝的建立事件函式
def create_event_from_booking(info: BookingInfo) -> str:
    try:
        start_time = datetime.fromisoformat(info.start_time)
        end_time = datetime.fromisoformat(info.end_time)

        event = {
            'summary': f"{info.treatment} - {info.doctor_name}",
            'description': info.note,
            'location': '愛惟美診所',
            'start': {'dateTime': start_time.isoformat(), 'timeZone': 'Asia/Taipei'},
            'end': {'dateTime': end_time.isoformat(), 'timeZone': 'Asia/Taipei'},
        }

        result = calendar_service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
        return result.get("id")

    except Exception as e:
        raise RuntimeError(f"建立 Google Calendar 活動失敗：{str(e)}")

def delete_event(event_id: str) -> None:
    try:
        calendar_service.events().delete(calendarId=CALENDAR_ID, eventId=event_id).execute()
    except Exception as e:
        raise RuntimeError(f"刪除 Google Calendar 活動失敗：{str(e)}")

def update_event(event_id: str, info: BookingInfo) -> None:
    try:
        start_time = datetime.fromisoformat(info.start_time)
        end_time = datetime.fromisoformat(info.end_time)

        event = {
            'summary': f"{info.treatment} - {info.user_name}",
            'description': info.note,
            'location': '愛惟美診所',
            'start': {'dateTime': start_time.isoformat(), 'timeZone': 'Asia/Taipei'},
            'end': {'dateTime': end_time.isoformat(), 'timeZone': 'Asia/Taipei'},
        }

        calendar_service.events().update(
            calendarId=CALENDAR_ID,
            eventId=event_id,
            body=event
        ).execute()

    except Exception as e:
        raise RuntimeError(f"更新 Google Calendar 活動失敗：{str(e)}")
