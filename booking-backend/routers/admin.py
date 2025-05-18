from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from schemas import DoctorAvailabilityCreate, DoctorAvailabilityResponse, AppointmentStatusUpdate
from datetime import datetime

router = APIRouter(tags=["Admin"])

# 設定醫生可預約時間
# @router.post("/doctor-availability")
# async def set_doctor_availability(info: DoctorAvailabilityCreate):
#     response = supabase.table("doctor_availability").insert(info.dict()).execute()
#     if not response.data:
#         raise HTTPException(status_code=500, detail="Failed to set doctor availability")
#     return {"status": "success"}

# 設定patient藥劑購買量、消耗量


# 設定預約狀態
@router.patch("/appointments/{appointment_id}")
async def update_appointment_status(appointment_id: int, info: AppointmentStatusUpdate):
    response = supabase.table("appointments")\
        .update({"status": info.status})\
        .eq("appointment_id", appointment_id)\
        .execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update appointment status")
    return {"status": "success"}


