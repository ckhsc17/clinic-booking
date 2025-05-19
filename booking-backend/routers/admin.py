from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import PatientCreate, AppointmentStatusUpdate, DoctorAvailabilityCreate, DoctorAvailabilityDelete, DoctorAvailabilityOut, DoctorAvailabilityResponse
from datetime import datetime

router = APIRouter(tags=["Admin"])

# 新增客人
@router.post("/patients/create")
async def create_patient(info: PatientCreate):
    response_id = supabase.table("patients").select("patient_id").order("patient_id", desc=True).limit(1).execute()

    if not response_id.data:
        raise HTTPException(status_code=500, detail="Failed to get max patient_id")

    max_patient_id = response_id.data[0]['patient_id'] if response_id.data else 0
    new_patient_id = max_patient_id + 1
    
    response = supabase.table("patients").insert({
        "patient_id": new_patient_id,
        "name": info.name,
        "gender": info.gender,
        "birthdate": info.birthdate,
        "phone": info.phone,
        "email": info.email,
        "address": info.address,
    }).execute()
    
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to save patient info to database")
    
    return {"status": "success", "patient_id": new_patient_id}

# 設定醫生可預約時間
# 新增
@router.post("/availability/create")
async def create_doctor_availability(info: DoctorAvailabilityCreate):
    response_id = supabase.table("doctor_availability")\
        .select("availability_id")\
        .order("availability_id", desc=True)\
        .limit(1).execute()

    if not response_id.data:
        raise HTTPException(status_code=500, detail="Failed to get max availability_id")
    
    max_id = response_id.data[0]["availability_id"] if response_id.data else 0
    new_id = max_id + 1

    response = supabase.table("doctor_availability").insert({
        "availability_id": new_id,
        "doctor_id": info.doctor_id,
        "available_start": info.available_start.isoformat(),
        "available_end": info.available_end.isoformat(),
        "is_bookable": info.is_bookable
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to insert doctor availability")

    return {
        "status": "success",
        "availability_id": response.data[0]["availability_id"]
    }

# 更新
@router.patch("/availability/delete")
async def disable_doctor_availability(info: DoctorAvailabilityDelete):
    response = supabase.table("doctor_availability")\
        .update({"is_bookable": False})\
        .eq("doctor_id", info.doctor_id)\
        .eq("available_start", info.available_start.isoformat())\
        .eq("available_end", info.available_end.isoformat())\
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Matching availability not found")
    
    return {"status": "success", "message": "Availability set to unbookable"}

# 刪除
@router.delete("/availability/remove")
async def remove_doctor_availability(info: DoctorAvailabilityDelete):
    response = supabase.table("doctor_availability")\
        .delete()\
        .eq("doctor_id", info.doctor_id)\
        .eq("available_start", info.available_start.isoformat())\
        .eq("available_end", info.available_end.isoformat())\
        .execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="No matching availability to delete")

    return {"status": "success", "message": "Availability removed"}

# 回傳
@router.get("/admin_get_doctor_available_times", response_model=DoctorAvailabilityResponse)
async def get_raw_doctor_availability(name: str = Query(..., description="Doctor's name")):
    print("hi from get_raw_doctor_availability")
    # Step 1: 找出 doctor_id
    doctor_resp = supabase.table("doctors")\
        .select("doctor_id")\
        .eq("name", name)\
        .maybe_single()\
        .execute()

    if not doctor_resp or not doctor_resp.data:
        raise HTTPException(status_code=404, detail="Doctor not found")

    doctor_id = doctor_resp.data["doctor_id"] 
    time_resp = supabase.table("doctor_availability")\
        .select("available_start, available_end", "is_bookable")\
        .eq("doctor_id", doctor_id)\
        .order("available_start")\
        .execute()

    #time_resp = supabase.table("doctor_availability").select("*").execute()

    all_data = time_resp.data
    print("all_data:", all_data)   

    return DoctorAvailabilityResponse(
        doctor_name=name,
        available_times=[
            DoctorAvailabilityOut(
                start=datetime.fromisoformat(row["available_start"]),
                end=datetime.fromisoformat(row["available_end"]),
                is_bookable=row["is_bookable"]
            )
            for row in all_data
        ]
    )

# 設定patient藥劑購買量、消耗量


# 設定預約狀態
@router.patch("/appointments/update")
async def update_appointment_status(appointment_id: int, info: AppointmentStatusUpdate):
    response = supabase.table("appointments")\
        .update({"status": info.status})\
        .eq("appointment_id", appointment_id)\
        .execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update appointment status")
    return {"status": "success"}
