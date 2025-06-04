# routers/appointments.py

from fastapi import APIRouter, HTTPException
from supabase_client import supabase
from schemas import AppointmentCreate, BookingInfo, AppointmentStatusUpdate
from datetime import datetime, timedelta
from services.calendar import create_event_from_booking
from pydantic import BaseModel

router = APIRouter(tags=["Appointments"])

class RescheduleData(BaseModel):
    date: str  # e.g., "2025-05-15"
    time: str  # e.g., "10:00"

def update_doctor_availability_after_booking(info):
    appointment_time = info.appointment_time
    next_hour = appointment_time + timedelta(hours=1)

    # 1. 查找包含預約時段的 availability row
    res = supabase.table("doctor_availability")\
        .select("*")\
        .eq("doctor_id", info.doctor_id)\
        .lte("available_start", appointment_time.isoformat())\
        .gt("available_end", appointment_time.isoformat())\
        .maybe_single()\
        .execute()

    if not res.data:
        raise HTTPException(status_code=404, detail="預約時間不在可用區段內")

    row = res.data
    print("row:", row)
    start = row["available_start"]
    end = row["available_end"]
    row_id = row["availability_id"]
    print("row_id:", row_id)
    print("start:", start)
    print("end:", end)
    print("appointment_time:", appointment_time)
    print("next_hour:", next_hour)

    start_dt = datetime.fromisoformat(start)
    end_dt = datetime.fromisoformat(end)

    inserts = []

    # 2. 根據預約時間的位置進行處理
    if appointment_time == start_dt and next_hour == end_dt:
        # 剛好佔滿整段 → 直接刪除該筆
        print("case: 剛好佔滿整段")
        supabase.table("doctor_availability")\
            .update({"is_bookable": False})\
            .eq("availability_id", row_id).execute()


    elif appointment_time == start_dt:
        # 預約是段首 → 更新 start
        print("case: 預約是段首")
        supabase.table("doctor_availability")\
            .update({"available_start": next_hour.isoformat()})\
            .eq("availability_id", row_id).execute()

    elif next_hour == end_dt:
        # 預約是段尾 → 更新 end
        print("case: 預約是段尾")
        supabase.table("doctor_availability")\
            .update({"available_end": appointment_time.isoformat()})\
            .eq("availability_id", row_id).execute()

    else:
        # 預約在中段 → 分裂為兩段
        supabase.table("doctor_availability").delete().eq("availability_id", row_id).execute()
        inserts = [
            {
                "doctor_id": info.doctor_id,
                "available_start": start,
                "available_end": appointment_time.isoformat()
            },
            {
                "doctor_id": info.doctor_id,
                "available_start": next_hour.isoformat(),
                "available_end": end
            }
        ]
        supabase.table("doctor_availability").insert(inserts).execute()
    


@router.post("/create_appointments")
async def create_appointment(info: AppointmentCreate):
    doctor_resp = supabase.table("doctors").select("name").eq("doctor_id", info.doctor_id).execute()
    if not doctor_resp or not doctor_resp.data:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor_name = doctor_resp.data[0]["name"]
    treatment_resp = supabase.table("treatments").select("name").eq("treatment_id", info.treatment_id).execute()
    if not treatment_resp or not treatment_resp.data:
        raise HTTPException(status_code=404, detail="Treatment not found")
    treatment_name = treatment_resp.data[0]["name"]

    print(f"Doctor Name: {doctor_name}, Treatment Name: {treatment_name}")

    # Create Google Calendar event
    booking_info = BookingInfo(
        doctor_name=doctor_name,
        treatment=treatment_name,
        start_time=info.appointment_time.isoformat(),
        end_time=(info.appointment_time + timedelta(hours=1)).isoformat(),
        note=info.notes
    )

    #try:
    #    event_id = create_event_from_booking(booking_info)
    #except Exception as e:
    #    raise HTTPException(status_code=500, detail=f"Failed to create Google Calendar event: {str(e)}")

    response = supabase.table("appointments").insert({
        "patient_id": info.patient_id,
        "doctor_id": info.doctor_id,
        "treatment_id": info.treatment_id,
        "appointment_time": info.appointment_time.isoformat(),
        "status": info.status,
        "notes": info.notes,
        #"event_id": event_id
    }).execute()

    print("before")
    update_doctor_availability_after_booking(info)
    print("after")

    #supabase.table("doctor_availability").update({
    #    "is_bookable": False
    #}).eq("doctor_id", info.doctor_id).lte("available_start", info.appointment_time.isoformat()).gte("available_end", info.appointment_time.isoformat()).execute()

    if not response or not response.data:
        raise HTTPException(status_code=500, detail="Failed to save appointment info to database")

    return {"status": "success"}

@router.get("/appointments")
async def get_appointments():
    response = supabase.table("appointments").select("*").execute()
    if not response or not response.data:
        return []

    appointments = []
    for appt in response.data:
        patient_resp = supabase.table("patients").select("name").eq("patient_id", appt["patient_id"]).execute()
        treatment_resp = supabase.table("treatments").select("name").eq("treatment_id", appt["treatment_id"]).execute()

        patient_name = patient_resp.data[0]["name"] if patient_resp and patient_resp.data else "Unknown"
        treatment_name = treatment_resp.data[0]["name"] if treatment_resp and treatment_resp.data else "Unknown"

        appt_time = datetime.fromisoformat(appt["appointment_time"].replace("Z", "+00:00"))

        appointments.append({
            "id": appt["appointment_id"],
            "patientName": patient_name,
            "type": treatment_name,
            "date": appt_time.strftime("%Y-%m-%d"),
            "time": appt_time.strftime("%I:%M %p"),
            "status": appt["status"]
        })

    return appointments

@router.post("/appointments/{id}/confirm")
async def confirm_appointment(id: int):
    # Fetch current appointment to check status
    response = supabase.table("appointments").select("status").eq("appointment_id", id).execute()
    if not response or not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    current_status = response.data[0]["status"]
    if current_status not in ["Pending", "Confirmed"]:  # Only allow transition from Pending
        raise HTTPException(status_code=400, detail="Cannot confirm an appointment that is not Pending")

    update_response = supabase.table("appointments").update({"status": "Confirmed"}).eq("appointment_id", id).execute()
    if not update_response or not update_response.data:
        raise HTTPException(status_code=500, detail="Failed to confirm appointment")
    return {"status": "success"}

@router.post("/appointments/{id}/deny")
async def deny_appointment(id: int):
    # Fetch current appointment to check status
    response = supabase.table("appointments").select("*").eq("appointment_id", id).execute()
    if not response or not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appt = response.data[0]
    if appt["status"] not in ["Pending", "Confirmed"]:  # Only allow transition from Pending or Confirmed
        raise HTTPException(status_code=400, detail="Cannot deny an appointment that is not Pending or Confirmed")

    supabase.table("appointments").update({"status": "Cancelled"}).eq("appointment_id", id).execute()
    
    supabase.table("doctor_availability").update({
        "is_bookable": True
    }).eq("doctor_id", appt["doctor_id"]).lte("available_start", appt["appointment_time"]).gte("available_end", appt["appointment_time"]).execute()
    
    return {"status": "success"}

@router.post("/appointments/{id}/cancel")
async def cancel_appointment(id: int):
    response = supabase.table("appointments").select("*").eq("appointment_id", id).execute()
    if not response or not response.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appt = response.data[0]
    if appt["status"] not in ["Confirmed"]:  # Only allow cancellation from Confirmed
        raise HTTPException(status_code=400, detail="Cannot cancel an appointment that is not Confirmed")

    supabase.table("appointments").update({"status": "Cancelled"}).eq("appointment_id", id).execute()
    
    supabase.table("doctor_availability").update({
        "is_bookable": True
    }).eq("doctor_id", appt["doctor_id"]).lte("available_start", appt["appointment_time"]).gte("available_end", appt["appointment_time"]).execute()
    
    return {"status": "success"}

@router.post("/appointments/{id}/reschedule")
async def reschedule_appointment(id: int, data: RescheduleData):
    appt_resp = supabase.table("appointments").select("*").eq("appointment_id", id).execute()
    if not appt_resp or not appt_resp.data:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt = appt_resp.data[0]

    doctor_resp = supabase.table("doctors").select("name").eq("doctor_id", appt["doctor_id"]).execute()
    treatment_resp = supabase.table("treatments").select("name").eq("treatment_id", appt["treatment_id"]).execute()
    doctor_name = doctor_resp.data[0]["name"] if doctor_resp and doctor_resp.data else "Unknown"
    treatment_name = treatment_resp.data[0]["name"] if treatment_resp and treatment_resp.data else "Unknown"

    new_time = datetime.fromisoformat(f"{data.date}T{data.time}:00+00:00")
    booking_info = BookingInfo(
        doctor_name=doctor_name,
        treatment=treatment_name,
        start_time=new_time.isoformat(),
        end_time=(new_time + timedelta(hours=1)).isoformat(),
        note=apt["notes"]
    )

    try:
        event_id = create_event_from_booking(booking_info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create Google Calendar event: {str(e)}")

    response = supabase.table("appointments").update({
        "appointment_time": new_time.isoformat(),
        "event_id": event_id
    }).eq("appointment_id", id).execute()

    if not response or not response.data:
        raise HTTPException(status_code=500, detail="Failed to reschedule appointment")

    supabase.table("doctor_availability").update({
        "is_bookable": True
    }).eq("doctor_id", appt["doctor_id"]).lte("available_start", appt["appointment_time"]).gte("available_end", appt["appointment_time"]).execute()

    supabase.table("doctor_availability").update({
        "is_bookable": False
    }).eq("doctor_id", appt["doctor_id"]).lte("available_start", new_time.isoformat()).gte("available_end", new_time.isoformat()).execute()

    return {"status": "success"}