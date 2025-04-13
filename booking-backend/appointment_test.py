from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from uuid import uuid4

app = FastAPI()

# 模擬資料庫
appointments = {}

# 建立資料模型
class Appointment(BaseModel):
    id: str
    user_id: str
    service: str
    date: str

class AppointmentCreate(BaseModel):
    user_id: str
    service: str
    date: str

@app.get("/appointments", response_model=List[Appointment])
def get_appointments():
    return list(appointments.values())

@app.get("/appointments/{appointment_id}", response_model=Appointment)
def get_appointment(appointment_id: str):
    if appointment_id in appointments:
        return appointments[appointment_id]
    raise HTTPException(status_code=404, detail="Appointment not found")

@app.post("/appointments", response_model=Appointment)
def create_appointment(data: AppointmentCreate):
    appointment_id = str(uuid4())
    appointment = Appointment(id=appointment_id, **data.dict())
    appointments[appointment_id] = appointment
    return appointment

@app.put("/appointments/{appointment_id}", response_model=Appointment)
def update_appointment(appointment_id: str, data: AppointmentCreate):
    if appointment_id not in appointments:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment = Appointment(id=appointment_id, **data.dict())
    appointments[appointment_id] = appointment
    return appointment

@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: str):
    if appointment_id in appointments:
        del appointments[appointment_id]
        return {"message": "Appointment deleted"}
    raise HTTPException(status_code=404, detail="Appointment not found")
