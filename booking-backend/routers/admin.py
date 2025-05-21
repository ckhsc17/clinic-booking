from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import PatientCreate, AppointmentStatusUpdate, DoctorAvailabilityCreate, DoctorAvailabilityDelete, DoctorAvailabilityOut, DoctorAvailabilityResponse, PatientRoleUpdate
from schemas import DrugRemainingCreate, DrugRemainingUpdate, DrugRemainingDelete, DrugRemainingResponse
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

# 藥品剩餘量
# 建立資料
@router.post("/drug_remain/create")
async def create_drug_remain(info: DrugRemainingCreate):
    # Step 1: 確認病人是否存在
    check_patient = supabase.table("patients")\
        .select("user_id")\
        .eq("user_id", info.user_id)\
        .maybe_single()\
        .execute()

    if not check_patient or not check_patient.data:
        raise HTTPException(status_code=400, detail=f"user_id '{info.user_id}' not found in patients")

    # Step 2: 檢查該 user_id + medicine_id 是否已存在
    check_dup = supabase.table("drug_remain")\
        .select("user_id", "medicine_id")\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .maybe_single()\
        .execute()

    if check_dup or check_dup.data:
        raise HTTPException(status_code=400, detail="This drug record already exists. Consider using update instead.")

    # Step 3: 寫入資料
    response = supabase.table("drug_remain").insert({
        "user_id": info.user_id,
        "medicine_id": info.medicine_id,
        "remaining_quantity": info.remaining_quantity,
        "unit": info.unit
    }).execute()

    if not response or not response.data:
        raise HTTPException(status_code=500, detail="Failed to create drug record")

    return {"status": "success", "message": "Drug record created"}


# 更新資料
@router.patch("/drug_remain/increase")
async def increase_drug_remain(info: DrugRemainingUpdate):
    # 先查舊資料
    record = supabase.table("drug_remain")\
        .select("remaining_quantity")\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .maybe_single()\
        .execute()

    if not record or not record.data:
        raise HTTPException(status_code=404, detail="Drug record not found")
    
    new_quantity = record.data["remaining_quantity"] + info.remaining_quantity

    # 更新資料
    response = supabase.table("drug_remain")\
        .update({"remaining_quantity": new_quantity})\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .execute()

    return {"status": "success", "message": f"Remaining quantity increased to {new_quantity}"}

@router.patch("/drug_remain/decrease")
async def decrease_drug_remain(info: DrugRemainingUpdate):
    record = supabase.table("drug_remain")\
        .select("remaining_quantity")\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .maybe_single()\
        .execute()

    if not record or not record.data:
        raise HTTPException(status_code=404, detail="Drug record not found")
    
    current = record.data["remaining_quantity"]
    if info.remaining_quantity > current:
        raise HTTPException(status_code=400, detail="Not enough remaining quantity")

    new_quantity = current - info.remaining_quantity

    response = supabase.table("drug_remain")\
        .update({"remaining_quantity": new_quantity})\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .execute()

    return {"status": "success", "message": f"Remaining quantity decreased to {new_quantity}"}

# 刪除資料
@router.delete("/drug_remain/delete")
async def delete_drug_remain(info: DrugRemainingDelete):
    response = supabase.table("drug_remain")\
        .delete()\
        .eq("user_id", info.user_id)\
        .eq("medicine_id", info.medicine_id)\
        .execute()

    if not response or not response.data:
        raise HTTPException(status_code=404, detail="Drug record not found or already deleted")

    return {"status": "success", "message": "Drug record deleted"}


# 病人資料
# 更新
@router.patch("/patients/role")
async def update_patient_role(info: PatientRoleUpdate):
    response = supabase.table("patients")\
        .update({"role": info.role})\
        .eq("name", info.name)\
        .eq("phone", info.phone)\
        .execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Patient not found or update failed")
    
    return {"status": "success", "message": f"Patient role updated to {info.role}"}


# 設定預約狀態
@router.patch("/appointments/update")
async def update_appointment_status(info: AppointmentStatusUpdate):
    response = supabase.table("appointments")\
        .update({"status": info.status})\
        .eq("appointment_id", info.appointment_id)\
        .execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update appointment status")
    return {"status": "success"}
