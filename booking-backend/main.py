# 📦 FastAPI Backend Sample

from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

from fastapi import HTTPException
from supabase_client import supabase
from uuid import uuid4
import uvicorn

app = FastAPI(
    title="愛惟美診所預約系統",
    description="一個用於管理預約系統的後端服務。",
    version="1.0.0"
)

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
SERVICE_ACCOUNT_FILE = '.secrets/clinicbooking-456701-2a94b2bc683d.json'
CALENDAR_ID = '013a6e4dfe869895b7d585e7f2529930cafe13554c8991f616a415cdecdc355b@group.calendar.google.com'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

calendar_service = build('calendar', 'v3', credentials=credentials)

# data settings
# database settings
class PatientInfo(BaseModel):
    name: str
    gender: str
    birthdate: str
    phone: str
    email: str
    address: str
    
class AppointmentInfo(BaseModel):
    patient_id: str
    doctor_id: str
    treatment: str
    appointment_time: str
    status: str
    notes: str
    
class BookingInfo(BaseModel):
    user_name: str
    treatment: str
    start_time: str
    end_time: str
    notes: str

# google calendar settings
class BookingRequest(BaseModel):
    name: str
    phone: str
    treatment: str
    datetime: str  # ISO format

@app.get("/")
async def root():
    return {"status": "愛惟美診所預約系統運行中"}

@app.post("/book")
async def book_treatment(data: BookingRequest):
    # Parse and validate datetime
    start_time = datetime.fromisoformat(data.datetime)
    end_time = start_time + timedelta(minutes=120) # Assuming 2 hours for treatment
    if start_time < datetime.now():
        return {"error": "預約時間必須在未來"}
    if start_time.hour < 9 or start_time.hour > 17:
        return {"error": "預約時間必須在診所營業時間內（09:00 - 17:00）"}
    if start_time.weekday() >= 5:
        return {"error": "預約時間必須在工作日（週一至週五）"}

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

@app.post("/create_patient")
async def create_patient(info: PatientInfo):
    response_id = supabase.table("patients").select("patient_id").order("patient_id", desc=True).limit(1).execute()

    if not response_id.data:
        raise HTTPException(status_code=500, detail="Failed to get max patient_id")

    max_patient_id = response_id.data[0]['patient_id'] if response_id.data else 0
    new_patient_id = max_patient_id + 1  # 新的 patient_id 是最大值加 1
    
    response = supabase.table("patients").insert({
        "patient_id": new_patient_id,
        "name": info.name,
        "gender": info.gender,
        "birthdate": info.birthdate,
        "phone": info.phone,
        "email": info.email,
        "address": info.address,
    }).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save patient info to database")
    
    return {"status": "success", "patient_id": new_patient_id}

# --- 建立 預約資料 ---
@app.post("/create_appointment")
async def create_appointment(info: AppointmentInfo):
    new_id = str(uuid4())
    response = supabase.table("appointments").insert({
        "id": new_id,
        "patient_id": info.patient_id,
        "doctor_id": info.doctor_id,
        "treatment_id": info.treatment_id,
        "appointment_time": info.appointment_time,
        "status": info.status,
        "notes": info.notes
    }).execute()
    
    # if response.status_code != 201:
    #     raise HTTPException(status_code=500, detail="Failed to save appointment info to database")
    
    return {"status": "success", "appointment_id": new_id}
