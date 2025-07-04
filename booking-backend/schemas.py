# schema.py
from pydantic import BaseModel, EmailStr, Field, constr
from typing import Optional, List
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
class PatientRoleUpdate(BaseModel):
    name: str
    phone: str
    role: str = Field(..., pattern=r"^(VIP|Normal)$")

class PatientUpdateInfo(BaseModel):
    id: int  # 用 patient_id 作為唯一識別
    name: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    birthdate: Optional[str]  # yyyy-mm-dd
    role: Optional[str]
class DoctorBase(BaseModel):
    name: str
    specialty: str
    phone: str
    email: EmailStr
    license_no: str

class DoctorCreate(DoctorBase): pass

class DoctorAvailabilityCreate(BaseModel):
    doctor_id: Optional[int]
    available_start: datetime
    available_end: datetime
    is_bookable: Optional[bool] = True
class DoctorAvailabilityOut(BaseModel):
    start: datetime
    end: datetime
    is_bookable: bool
class DoctorAvailabilityResponse(BaseModel):
    doctor_id: Optional[int]
    doctor_name: Optional[str]
    available_times: List[DoctorAvailabilityOut]
class DoctorAvailabilityDelete(BaseModel):
    doctor_id: int
    available_start: datetime
    available_end: datetime

class ServiceCreate(BaseModel):
    name: str
    description: str
    price: float

class MedicineCreate(BaseModel):
    name: str
    description: str
    amount: str

class AppointmentCreate(BaseModel):
    patient_id: str
    doctor_id: int
    treatment_id: int
    appointment_time: datetime
    status: str = "Pending"
    notes: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    appointment_id: int
    status: str

class BillingCreate(BaseModel):
    appointment_id: int
    amount: float
    paid: bool
    payment_date: date
    payment_method: str

class TreatmentCreate(BaseModel):
    name: str
    description: str
    price: float
    duration_min: int
class TreatmentRecordCreate(BaseModel):
    appointment_id: int
    notes: str
    date_performed: date
    outcome: str
class TreatmentRecordResponse(BaseModel):
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

class DrugRemainingCreate(BaseModel):
    user_id: str
    medicine_id: int
    remaining_quantity: int
    unit: str
class DrugRemainingResponse(BaseModel):
    user_id: str
    medicine_id: int
    remaining_quantity: int
    unit: str
class DrugRemainingUpdate(BaseModel):
    user_id: str
    medicine_id: int
    remaining_quantity: int
class DrugRemainingDelete(BaseModel):
    user_id: str
    medicine_id: int
    remaining_quantity: int
    unit: str

# --- 輸入資料模型 ---
class BookingInfo(BaseModel):
    doctor_name: str
    treatment: str
    start_time: str  # e.g. '2025-04-22T15:00:00+08:00'
    end_time: str    # e.g. '2025-04-22T15:30:00+08:00'
    note: Optional[str] = None

# Add to schemas.py
class RescheduleData(BaseModel):
    date: str  # e.g., "2025-05-15"
    time: str  # e.g., "10:00"