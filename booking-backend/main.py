# 📦 FastAPI Backend Sample

from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build
import uvicorn

app = FastAPI()

# CORS settings (for connecting with Next.js frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Calendar settings
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'your-credentials.json'
CALENDAR_ID = 'your_calendar_id@group.calendar.google.com'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

calendar_service = build('calendar', 'v3', credentials=credentials)

class BookingRequest(BaseModel):
    name: str
    phone: str
    treatment: str
    datetime: str  # ISO format

@app.post("/book")
async def book_treatment(data: BookingRequest):
    # Parse and validate datetime
    start_time = datetime.fromisoformat(data.datetime)
    end_time = start_time + timedelta(minutes=30)

    event = {
        'summary': f"{data.treatment} - {data.name}",
        'description': f"Phone: {data.phone}",
        'start': {
            'dateTime': start_time.isoformat(),
            'timeZone': 'Asia/Taipei',
        },
        'end': {
            'dateTime': end_time.isoformat(),
            'timeZone': 'Asia/Taipei',
        },
    }

    created_event = calendar_service.events().insert(calendarId=CALENDAR_ID, body=event).execute()
    return {"message": "Booking successful", "eventLink": created_event.get('htmlLink')}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
