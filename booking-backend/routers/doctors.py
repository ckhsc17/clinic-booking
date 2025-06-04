# routers/doctors.py

from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import DoctorAvailabilityResponse, DoctorAvailabilityOut
from datetime import datetime, date, timedelta
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(tags=["Doctors"])

# Define a Pydantic model for the doctor data
class Doctor(BaseModel):
    id: int
    name: str
    specialty: str

# Endpoint to fetch doctor availability
@router.get("/doctors/availability", response_model=DoctorAvailabilityResponse)
async def get_doctor_available_times(
    doctor_id: int = Query(..., description="Doctor's id"),
    patient_id: str = Query(..., description="LINE user ID"),
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)")
):
    print(f"Fetching availability for doctor_id: {doctor_id}, start_date: {start_date}, end_date: {end_date}")

    try:
        # 查詢使用者角色
        role_resp = supabase.table("patients")\
            .select("role")\
            .eq("patient_id", patient_id)\
            .single()\
            .execute()

        if role_resp.data is None:
            raise HTTPException(status_code=404, detail="User not found")

        role = role_resp.data["role"]
        print(f"使用者角色: {role}")

        # 設定最大查詢範圍
        today = date.today()
        if role == "Normal":
            max_end_date = today + timedelta(weeks=2)
        elif role == "VIP":
            max_end_date = today + timedelta(weeks=8)
        else:
            raise HTTPException(status_code=400, detail="Invalid role in DB")

        # end_date 超出上限就強制調整
        if end_date is None or end_date > max_end_date:
            end_date = max_end_date

        # 構建查詢
        query = supabase.table("doctor_availability")\
            .select("available_start, available_end, is_bookable")\
            .eq("doctor_id", doctor_id)

        if start_date:
            start_datetime = datetime.combine(start_date, datetime.min.time())
            start_datetime_utc = start_datetime - timedelta(hours=6)
            query = query.gte("available_start", start_datetime_utc.isoformat() + "Z")

        if end_date:
            end_datetime = datetime.combine(end_date, datetime.max.time())
            end_datetime_utc = end_datetime - timedelta(hours=6)
            query = query.lte("available_end", end_datetime_utc.isoformat() + "Z")

        time_resp = query.order("available_start").execute()
        all_data = time_resp.data or []

        available_times = [
            DoctorAvailabilityOut(
                start=datetime.fromisoformat(row["available_start"]),
                end=datetime.fromisoformat(row["available_end"]),
                is_bookable=row["is_bookable"]
            )
            for row in all_data
        ]

        return DoctorAvailabilityResponse(
            doctor_id=doctor_id,
            available_times=available_times
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching availability: {str(e)}")
    
# Endpoint to fetch all doctors
@router.get("/doctors", response_model=List[Doctor])
async def get_doctors():
    print("Fetching all doctors")
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

# Endpoint to fetch a single doctor by ID
@router.get("/doctors/{doctor_id}", response_model=Doctor)
async def get_doctor(doctor_id: int):
    print(f"Fetching doctor with ID: {doctor_id}")
    try:
        response = supabase.table("doctors").select("doctor_id, name, specialty").eq("doctor_id", doctor_id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Doctor not found")
        
        doctor = response.data
        return {"id": doctor["doctor_id"], "name": doctor["name"], "specialty": doctor["specialty"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching doctor: {str(e)}")