# routers/appointments.py

from fastapi import APIRouter, HTTPException, Query
from uuid import uuid4
from supabase_client import supabase
from schemas import AppointmentCreate, PatientRecordResponse

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

@router.get("/patients/records", response_model=PatientRecordResponse)
async def get_patient_record(user_id: str = Query(..., description="LINE UserId")):
    # 查詢最近一次完成的 Appointment
    appointments = supabase.table("appointments")\
        .select("appointment_id, appointment_time, treatment_id")\
        .eq("user_id", user_id)\
        .eq("status", "Completed")\
        .order("appointment_time", desc=True)\
        .limit(1).execute()

    if not appointments.data:
        return PatientRecordResponse(
            last_visit_time=None,
            last_treatment=None,
            medication_left="尚無紀錄"
        )

    latest = appointments.data[0]
    appointment_time = latest["appointment_time"]
    treatment_id = latest["treatment_id"]

    # 查詢 treatment 名稱
    treatment_name = "未知"
    if treatment_id is not None:
        treatment = supabase.table("treatments")\
            .select("name")\
            .eq("treatment_id", treatment_id)\
            .single().execute()
        if treatment.data:
            treatment_name = treatment.data["name"]

    # 查詢 purchases 中該 user_id 的最近一筆療程購買紀錄
    purchases = supabase.table("purchases")\
        .select("treatment_id, remaining_quantity")\
        .eq("user_id", user_id)\
        .order("purchase_date", desc=True)\
        .limit(1).execute()

    medication_info = "尚無療程購買紀錄"
    if purchases.data:
        pur = purchases.data[0]
        treat_name_resp = supabase.table("treatments")\
            .select("name")\
            .eq("treatment_id", pur["treatment_id"])\
            .single().execute()
        if treat_name_resp.data:
            medication_info = f"{treat_name_resp.data['name']} 剩餘 {pur['remaining_quantity']}"

    return PatientRecordResponse(
        last_visit_time=appointment_time,
        last_treatment=treatment_name,
        medication_left=medication_info
    )