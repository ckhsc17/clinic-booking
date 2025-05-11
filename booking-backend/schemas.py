# schema.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class PatientBase(BaseModel):
    name: str
    gender: str
    birthdate: date
    phone: str
    email: EmailStr
    address: str
    role: str

class PatientCreate(PatientBase):
    user_id: str
class PatientRecordResponse(BaseModel):
    last_visit_time: Optional[str]
    last_treatment: Optional[str]
    medication_left: Optional[str]
class DoctorBase(BaseModel):
    name: str
    specialty: str
    phone: str
    email: EmailStr
    license_no: str

class DoctorCreate(DoctorBase): pass

class DoctorAvailabilityCreate(BaseModel):
    doctor_id: int
    available_start: datetime
    available_end: datetime
    is_bookable: Optional[bool] = True

class TreatmentCreate(BaseModel):
    name: str
    description: str
    price: float
    duration_min: int

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float

class MedicineCreate(BaseModel):
    name: str
    description: str
    amount: str

class AppointmentCreate(BaseModel):
    user_id: str
    doctor_id: int
    treatment_id: int
    appointment_time: datetime
    status: str
    notes: Optional[str] = None

class BillingCreate(BaseModel):
    appointment_id: int
    amount: float
    paid: bool
    payment_date: date
    payment_method: str

class TreatmentRecordCreate(BaseModel):
    appointment_id: int
    notes: str
    date_performed: date
    outcome: str

class PurchaseCreate(BaseModel):
    user_id: str
    treatment_id: int
    total_quantity: float
    remaining_quantity: float
    purchase_date: date

class TreatmentMedicineUsageCreate(BaseModel):
    record_id: int
    medicine_id: int
    used_amount: float

# --- 輸入資料模型 ---
class BookingInfo(BaseModel):
    user_name: str
    treatment: str
    start_time: str  # e.g. '2025-04-22T15:00:00+08:00'
    end_time: str    # e.g. '2025-04-22T15:30:00+08:00'
    note: str = ""