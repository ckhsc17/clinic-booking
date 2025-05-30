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

# Add endpoint to fetch all doctors
@router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    try:
        response = supabase.table("doctors").select("doctor_id, name, specialty").execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="No doctors found")
        
        # Map Supabase response to the Doctor model
        doctors = [
            {"id": doctor["doctor_id"], "name": doctor["name"], "specialty": doctor["specialty"]}
            for doctor in response.data
        ]
        return doctors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctors: {str(e)}")

# Add endpoint to fetch a single doctor by ID
@router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: int):
    try:
        response = supabase.table("doctors").select("doctor_id, name, specialty").eq("doctor_id", doctor_id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        doctor = response.data
        return {"id": doctor["doctor_id"], "name": doctor["name"], "specialty": doctor["specialty"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctor: {str(e)}")

@router.get("/doctors/available_times", response_model=DoctorAvailabilityResponse)
async def get_doctor_available_times(doctor_id: int = Query(..., description="Doctor's id")):
    # Step 2: 查詢所有時間（含可與不可預約）
    time_resp = supabase.table("doctor_availability")\
        .select("available_start, available_end, is_bookable")\
        .eq("doctor_id", doctor_id)\
        .order("available_start")\
        .execute()

    all_data = time_resp.data
    available_intervals = []
    unavailable_intervals = []

    for row in all_data:
        start = datetime.fromisoformat(row["available_start"])
        end = datetime.fromisoformat(row["available_end"])
        if row["is_bookable"]:
            available_intervals.append((start, end))
        else:
            unavailable_intervals.append((start, end))

    # Step 3: 計算最終可用時間
    final_available = subtract_unavailable(available_intervals, unavailable_intervals)

    return DoctorAvailabilityResponse(
        doctor_id=doctor_id,
        available_times=[
            DoctorAvailabilityOut(start=interval[0], end=interval[1], is_bookable=True)
            for interval in final_available
        ]
    )