# models.py
from sqlalchemy import Column, String, Integer, Date, Text, Boolean, DECIMAL, ForeignKey, DateTime, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Patient(Base):
    __tablename__ = "Patients"
    user_id = Column(String(50), primary_key=True)
    name = Column(String(100))
    gender = Column(String(10))
    birthdate = Column(Date)
    phone = Column(String(20))
    email = Column(String(100))
    address = Column(String(255))
    role = Column(String(10), CheckConstraint("role IN ('VIP', 'Normal')"))

class Doctor(Base):
    __tablename__ = "Doctors"
    doctor_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    specialty = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    license_no = Column(String(50))

class DoctorAvailability(Base):
    __tablename__ = "Doctor_Availability"
    availability_id = Column(Integer, primary_key=True, autoincrement=True)
    doctor_id = Column(Integer, ForeignKey("Doctors.doctor_id"))
    available_start = Column(DateTime)
    available_end = Column(DateTime)
    is_bookable = Column(Boolean, default=True)

class Treatment(Base):
    __tablename__ = "Treatments"
    treatment_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    description = Column(Text)
    price = Column(DECIMAL(10, 2))
    duration_min = Column(Integer)

class Service(Base):
    __tablename__ = "Services"
    service_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    description = Column(String(200))
    price = Column(DECIMAL(10, 2))

class Medicine(Base):
    __tablename__ = "Medicines"
    medicine_id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100))
    description = Column(Text)
    amount = Column(String(50))

class Appointment(Base):
    __tablename__ = "Appointments"
    appointment_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(50), ForeignKey("Patients.user_id"))
    doctor_id = Column(Integer, ForeignKey("Doctors.doctor_id"))
    treatment_id = Column(Integer, ForeignKey("Treatments.treatment_id"))
    appointment_time = Column(DateTime)
    status = Column(String(50), CheckConstraint("status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')"))
    notes = Column(Text)

class Billing(Base):
    __tablename__ = "Billing"
    bill_id = Column(Integer, primary_key=True, autoincrement=True)
    appointment_id = Column(Integer, ForeignKey("Appointments.appointment_id"))
    amount = Column(DECIMAL(10, 2))
    paid = Column(Boolean)
    payment_date = Column(Date)
    payment_method = Column(String(50))

class TreatmentRecord(Base):
    __tablename__ = "Treatment_Records"
    record_id = Column(Integer, primary_key=True, autoincrement=True)
    appointment_id = Column(Integer, ForeignKey("Appointments.appointment_id"))
    notes = Column(Text)
    date_performed = Column(Date)
    outcome = Column(Text)

class Purchase(Base):
    __tablename__ = "Purchases"
    user_id = Column(String(50), ForeignKey("Patients.user_id"), primary_key=True)
    treatment_id = Column(Integer, ForeignKey("Treatments.treatment_id"), primary_key=True)
    total_quantity = Column(DECIMAL(10, 2))
    remaining_quantity = Column(DECIMAL(10, 2))
    purchase_date = Column(Date)

class TreatmentMedicineUsage(Base):
    __tablename__ = "Treatment_Medicine_Usage"
    usage_id = Column(Integer, primary_key=True, autoincrement=True)
    record_id = Column(Integer, ForeignKey("Treatment_Records.record_id"))
    medicine_id = Column(Integer, ForeignKey("Medicines.medicine_id"))
    used_amount = Column(DECIMAL(10, 2))
