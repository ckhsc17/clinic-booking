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
    start_date: Optional[date] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="End date (YYYY-MM-DD)")
):
    print(f"Fetching availability for doctor_id: {doctor_id}, start_date: {start_date}, end_date: {end_date}")

    try:
        # Build the Supabase query
        query = supabase.table("doctor_availability")\
            .select("available_start, available_end, is_bookable")\
            .eq("doctor_id", doctor_id)

        # Apply date range filters if provided, adjusting for timezone
        if start_date:
            start_datetime = datetime.combine(start_date, datetime.min.time())  # Start of day in local time
            # Adjust to UTC (CST is UTC-6)
            start_datetime_utc = start_datetime - timedelta(hours=6)
            query = query.gte("available_start", start_datetime_utc.isoformat() + "Z")

        if end_date:
            end_datetime = datetime.combine(end_date, datetime.max.time())  # End of day in local time
            # Adjust to UTC (CST is UTC-6)
            end_datetime_utc = end_datetime - timedelta(hours=6)
            query = query.lte("available_end", end_datetime_utc.isoformat() + "Z")

        # Execute the query
        time_resp = query.order("available_start").execute()

        all_data = time_resp.data
        if not all_data:
            return DoctorAvailabilityResponse(doctor_id=doctor_id, available_times=[])

        # Return all time slots (both available and unavailable) within the range
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