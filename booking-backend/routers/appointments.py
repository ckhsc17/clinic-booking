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
    # 根據doctor_id查doctor_name，根據treatment_id查treatment_name
    doctor_resp = supabase.table("doctors").select("name").eq("doctor_id", info.doctor_id).execute()
    if not doctor_resp.data:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor_name = doctor_resp.data[0]["name"]
    treatment_resp = supabase.table("treatments").select("name").eq("treatment_id", info.treatment_id).execute()
    if not treatment_resp.data:
        raise HTTPException(status_code=404, detail="Treatment not found")
    treatment_name = treatment_resp.data[0]["name"]    

    # Step 1: 建立 Google Calendar 活動，取得 event_id
    booking_info = BookingInfo(
        doctor_name=doctor_name,
        start_time=info.appointment_time.isoformat(),
        end_time=(info.appointment_time + info.treatment_duration).isoformat(),
        treatment=treatment_name,
        note=info.notes
    )

    try:
        event_id = create_event_from_booking(booking_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Google Calendar event: {str(e)}")
   

    # Step 2: 儲存預約資訊到 appointments 表格
    response = supabase.table("appointments").insert({
        #"appointment_id": new_id,
        "patient_id": info.patient_id,
        "doctor_id": info.doctor_id,
        "treatment_id": info.treatment_id,
        "appointment_time": info.appointment_time.isoformat(),
        "status": info.status,
        "notes": info.notes,
        "event_id": event_id
    }).execute()

    # Step 3: 更新對應 availability 的 is_bookable 為 false
    # 查找符合時間區間的那筆 Doctor_Availability

    supabase.table("doctor_availability").update({
        "is_bookable": False
    }).eq("doctor_id", info.doctor_id).lte("available_start", info.appointment_time.isoformat()).gte("available_end", info.appointment_time.isoformat()).execute()

 
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save appointment info to database")
    
    return {"status": "success"}

