# routers/appointments.py

from fastapi import APIRouter, HTTPException
from uuid import uuid4
from supabase_client import supabase
from schemas import AppointmentCreate

# import calendar.py
from calendar import create_event_from_booking

router = APIRouter(tags=["Appointments"])

@router.post("/appointments")
async def create_appointment(info: AppointmentCreate):
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
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save appointment info to database")
    
    return {"status": "success", "appointment_id": new_id}

