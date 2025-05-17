# routers/doctors.py

from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import DoctorAvailabilityResponse, DoctorAvailabilityOut
from datetime import datetime

router = APIRouter(tags=["Doctors"])

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

@router.get("/available-times", response_model=DoctorAvailabilityResponse)
async def get_doctor_available_times(name: str = Query(..., description="Doctor's name")):
    # Step 1: 查 doctor_id
    doctor_resp = supabase.table("doctors").select("doctor_id").eq("name", name).maybe_single().execute()
    if not doctor_resp or not doctor_resp.data:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor_id = doctor_resp.data["doctor_id"]

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
        doctor_name=name,
        available_times=[
            DoctorAvailabilityOut(start=interval[0], end=interval[1])
            for interval in final_available
        ]
    )
