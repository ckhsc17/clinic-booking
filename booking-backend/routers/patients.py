# routers/patients.py

from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import PatientCreate
from schemas import PatientRecordResponse

router = APIRouter(tags=["Patients"])

from fastapi import APIRouter, HTTPException, Query
from schemas import PatientRecordResponse

router = APIRouter()

@router.get("/patients/records", response_model=PatientRecordResponse)
async def get_patient_record(
    user_id: str = Query(..., description="LINE UserId")
):
    # 1️⃣ 確認病患存在（以 patient_id 欄位儲存 LINE user_id）
    patient_res = supabase.table("patients") \
        .select("patient_id") \
        .eq("patient_id", user_id) \
        .maybe_single() \
        .execute()
    if not patient_res or not patient_res.data:
        raise HTTPException(status_code=404, detail="User not found")

    # 2️⃣ 撈最近一次完成 (status='completed') 的 appointment
    #.eq("status", "completed") \
    appt_res = supabase.table("appointments") \
        .select("appointment_id, appointment_time, treatment_id") \
        .eq("patient_id", user_id) \
        .order("appointment_time", desc=True) \
        .limit(1) \
        .execute()

    # 若從未就診
    if not appt_res or not appt_res.data:
        return PatientRecordResponse(
            last_visit_time=None,
            last_treatment=None,
            medication_left="尚無就診紀錄"
        )

    latest = appt_res.data[0]
    appointment_time = latest["appointment_time"]
    treatment_id = latest.get("treatment_id")

    # 3️⃣ 查該 treatment 名稱
    treatment_name = "未知"
    if treatment_id is not None:
        tr_res = supabase.table("treatments") \
            .select("name") \
            .eq("treatment_id", treatment_id) \
            .single() \
            .execute()
        if tr_res and tr_res.data:
            treatment_name = tr_res.data["name"]

    # 4️⃣ 查 drug_remain 取剩餘藥量
    rem_res = supabase.table("drug_remain") \
        .select("medicine_id, remaining_quantity, unit") \
        .eq("user_id", user_id) \
        .execute()
    print(rem_res)

    medication_left = "尚無藥物剩餘紀錄"
    if rem_res and rem_res.data:
        remains = rem_res.data
        # 抓所有 medicine_id
        med_ids = [r["medicine_id"] for r in remains]
        med_map = {}
        if med_ids:
            meds_res = supabase.table("medicines") \
                .select("medicine_id, name") \
                .in_("medicine_id", med_ids) \
                .execute()
            for m in meds_res.data or []:
                med_map[m["medicine_id"]] = m["name"]

        # 組合成「品名: 數量 + 單位」
        parts = [
            f"{med_map.get(r['medicine_id'], 'Unknown')}: {r['remaining_quantity']}{r.get('unit','')}"
            for r in remains
        ]
        medication_left = "；".join(parts)

    return PatientRecordResponse(
        last_visit_time=appointment_time,
        last_treatment=treatment_name,
        medication_left=medication_left
    )
