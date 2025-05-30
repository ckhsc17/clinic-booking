# routers/doctors.py

from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import DoctorAvailabilityResponse, DoctorAvailabilityOut
from datetime import datetime
from pydantic import BaseModel
from typing import List

router = APIRouter(tags=["Doctors"])

# Define a Pydantic model for the doctor data
class Doctor(BaseModel):
    id: int
    name: str
    specialty: str

# 工具函式：從可預約時間中扣除不可預約時間
def subtract_unavailable(available_intervals, unavailable_intervals):
    result = []

    for a_start, a_end in available_intervals:
        current_start = a_start

        for u_start, u_end in unavailable_intervals:
            if u_end <= current_start or u_start >= a_end:
                continue  # 不重疊

            if u_start <= current_start < u_end:
                current_start = max(current_start, u_end)
            elif current_start < u_start < a_end:
                result.append((current_start, u_start))
                current_start = max(current_start, u_end)

        if current_start < a_end:
            result.append((current_start, a_end))

    return result

# Endpoint to fetch doctor availability (place before dynamic route)
@router.get("/doctors/availability", response_model=DoctorAvailabilityResponse)
async def get_doctor_available_times(doctor_id: int = Query(..., description="Doctor's id")):
    print(f"Fetching availability for doctor_id: {doctor_id}")  # Debug log
    
    try:
        # Query availability data
        time_resp = supabase.table("doctor_availability")\
            .select("available_start, available_end, is_bookable")\
            .eq("doctor_id", doctor_id)\
            .order("available_start")\
            .execute()

        all_data = time_resp.data
        if not all_data:
            raise HTTPException(status_code=404, detail=f"No availability data found for doctor_id {doctor_id}")

        available_intervals = []
        unavailable_intervals = []

        for row in all_data:
            start = datetime.fromisoformat(row["available_start"])
            end = datetime.fromisoformat(row["available_end"])
            if row["is_bookable"]:
                available_intervals.append((start, end))
            else:
                unavailable_intervals.append((start, end))

        # Calculate final available times
        final_available = subtract_unavailable(available_intervals, unavailable_intervals)

        return DoctorAvailabilityResponse(
            doctor_id=doctor_id,
            available_times=[
                DoctorAvailabilityOut(start=interval[0], end=interval[1], is_bookable=True)
                for interval in final_available
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching availability: {str(e)}")

# Endpoint to fetch all doctors
@router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    print("Fetching all doctors")  # Debug log
    try:
        response = supabase.table("doctors").select("doctor_id, name, specialty").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No doctors found")
        
        doctors = [
            {"id": doctor["doctor_id"], "name": doctor["name"], "specialty": doctor["specialty"]}
            for doctor in response.data
        ]
        return doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctors: {str(e)}")

# Endpoint to fetch a single doctor by ID (place after static routes)
@router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: int):
    print(f"Fetching doctor with ID: {doctor_id}")  # Debug log
    try:
        response = supabase.table("doctors").select("doctor_id, name, specialty").eq("doctor_id", doctor_id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        doctor = response.data
        return {"id": doctor["doctor_id"], "name": doctor["name"], "specialty": doctor["specialty"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctor: {str(e)}")