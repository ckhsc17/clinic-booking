from uuid import uuid4
from fastapi import HTTPException
from .model import AppointmentInfo, PatientInfo, Appointment
from supabase_client import supabase

# Simulated database for appointments
appointments = {}

def create_appointment(info: AppointmentInfo):
    new_id = str(uuid4())
    appointments[new_id] = Appointment(id=new_id, **info.dict())
    return appointments[new_id]

def get_appointment(appointment_id: str):
    if appointment_id in appointments:
        return appointments[appointment_id]
    raise HTTPException(status_code=404, detail="Appointment not found")

def update_appointment(appointment_id: str, info: AppointmentInfo):
    if appointment_id not in appointments:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointments[appointment_id] = Appointment(id=appointment_id, **info.dict())
    return appointments[appointment_id]

def delete_appointment(appointment_id: str):
    if appointment_id in appointments:
        del appointments[appointment_id]
        return {"message": "Appointment deleted"}
    raise HTTPException(status_code=404, detail="Appointment not found")

def create_patient(info: PatientInfo):
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
