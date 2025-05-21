# routers/appointments.py

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from supabase_client import supabase
from schemas import AppointmentCreate, BookingInfo

# import calendar.py
from services.calendar import create_event_from_booking

router = APIRouter(tags=["Appointments"])

@router.post("/create_appointments")
async def create_appointment(info: AppointmentCreate):
    #new_id = str(uuid4())

    response = supabase.table("appointments").insert({
        #"appointment_id": new_id,
        "patient_id": info.patient_id,
        "doctor_id": info.doctor_id,
        "treatment_id": info.treatment_id,
        "appointment_time": info.appointment_time.isoformat(),
        "status": info.status,
        "notes": info.notes
    }).execute()

    # Step 2: 更新對應 availability 的 is_bookable 為 false
    # 查找符合時間區間的那筆 Doctor_Availability

    supabase.table("doctor_availability").update({
        "is_bookable": False
    }).eq("doctor_id", info.doctor_id).lte("available_start", info.appointment_time.isoformat()).gte("available_end", info.appointment_time.isoformat()).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save appointment info to database")
    
    return {"status": "success"}

