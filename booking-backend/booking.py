# ✅ FastAPI + Google Calendar (服務帳戶) 整合範例

from fastapi import FastAPI
from pydantic import BaseModel
from google.oauth2 import service_account
from googleapiclient.discovery import build
import os
from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from uuid import uuid4

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
# 病人資料
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
    treatment_id: str
    appointment_time: str  # e.g. "2025-05-10T15:00:00"
    status: str
    notes: str = ""

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

# --- 建立 病人資料 ---
@app.post("/create_patient")
async def create_patient(info: PatientInfo):
    new_id = str(uuid4())
    reponse = supabase.table("patients").insert({
        "id": new_id,
        "name": info.name,
        "gender": info.gender,
        "birthdate": info.birthdate,
        "phone": info.phone,
        "email": info.email,
        "address": info.address,
    }).execute()
    return {"status": "success", "patient_id": new_id}

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


# --- FastAPI 路由：新增預約 ---
@app.post("/create_booking")
async def book_event(info: BookingInfo):
    event_id = create_event(info)
    
    response = supabase.table("bookings").insert({
        "user_name": info.user_name,
        "treatment": info.treatment,
        "start_time": info.start_time,
        "end_time": info.end_time,
        "note": info.note,
        "event_id": event_id
    }).execute()
    
    if response.status_code != 201:
        raise HTTPException(status_code=500, detail="Failed to save booking info to database")
    
    return {"status": "success", "calendar_event_id": event_id}

