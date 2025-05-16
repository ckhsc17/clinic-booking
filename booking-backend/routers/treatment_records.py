from fastapi import APIRouter, HTTPException, Query
from supabase_client import supabase
from schemas import TreatmentRecordCreate
from schemas import TreatmentRecordResponse

router = APIRouter(tags=["Treatment Records"])

@router.post("/treatment_records")
async def create_treatment_record(info: TreatmentRecordCreate):
    response = supabase.table("treatment_records").insert({
        "appointment_id": info.appointment_id,
        "notes": info.notes,
        "date_performed": info.date_performed,
        "outcome": info.outcome,
    }).execute()

    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to insert treatment record")
    
    return {
        "status": "success",
        "record_id": response.data[0]["record_id"]
    }

# @router.get("/treatment_records", response_model=TreatmentRecordResponse)
# async def get_treatment_record(appointment_id: str = Query(..., description="Appointment ID")):
#     # Step 1: Check if the appointment exists
#     appointment_check = supabase.table("appointments")\
#         .select("appointment_id")\
#         .eq("appointment_id", appointment_id)\
#         .maybe_single()\
#         .execute()

#     if not appointment_check.data:
#         raise HTTPException(status_code=404, detail="Appointment not found")

#     # Step 2: Get the treatment record
#     treatment_record = supabase.table("treatment_records")\
#         .select("*")\
#         .eq("appointment_id", appointment_id)\
#         .maybe_single()\
#         .execute()

#     if not treatment_record.data:
#         raise HTTPException(status_code=404, detail="Treatment record not found")

#     return TreatmentRecordResponse(**treatment_record.data[0])