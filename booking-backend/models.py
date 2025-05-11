from pydantic import BaseModel

class Appointment(BaseModel):
    id: str
    user_id: str
    service: str
    date: str

class AppointmentCreate(BaseModel):
    user_id: str
    service: str
    date: str

class PatientInfo(BaseModel):
    name: str
    gender: str
    birthdate: str
    phone: str
    email: str
    address: str

class AppointmentInfo(BaseModel):
    patient_id: str
    doctor_id: str
    treatment: str
    appointment_time: str
    status: str
    notes: str

class BookingInfo(BaseModel):
    user_name: str
    treatment: str
    start_time: str
    end_time: str
    notes: str

class BookingRequest(BaseModel):
    name: str
    phone: str
    treatment: str
    datetime: str  # ISO format
