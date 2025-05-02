import pandas as pd
import random
from faker import Faker
from datetime import datetime

fake = Faker("zh_TW")
random.seed(42)

def generate_patients(n=50):
    return [{
        "patient_id": i + 1,
        "name": fake.name(),
        "gender": random.choice(["Male", "Female"]),
        "birthdate": fake.date_of_birth(minimum_age=18, maximum_age=80),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "address": fake.address().replace("\n", ", ")
    } for i in range(n)]

def generate_doctors(n=10):
    return [{
        "doctor_id": i + 1,
        "name": fake.name(),
        "specialty": random.choice(["隆乳", "皮膚", "臉", "身體"]),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "license_no": f"D{fake.random_number(digits=6, fix_len=True)}"
    } for i in range(n)]

def generate_treatments():
    return [
        {"treatment_id": 1, "name": "因波拉皮", "description": "拉你的皮", "price": 800, "duration_min": 30},
        {"treatment_id": 2, "name": "隆乳", "description": "讓奶變大", "price": 1500, "duration_min": 60},
        {"treatment_id": 3, "name": "割雙眼皮", "description": "割雙眼皮", "price": 1200, "duration_min": 45}
    ]

def generate_appointments(patients, doctors, treatments, n=50):
    return [{
        "appointment_id": i + 1,
        "patient_id": random.choice(patients)["patient_id"],
        "doctor_id": random.choice(doctors)["doctor_id"],
        "treatment_id": random.choice(treatments)["treatment_id"],
        "appointment_time": fake.date_time_between(start_date="-1y", end_date="+1y"),
        "status": random.choice(["Scheduled", "Completed", "Cancelled"]),
        "notes": fake.sentence()
    } for i in range(n)]

def generate_billing(appointments, treatments):
    return [{
        "bill_id": i + 1,
        "appointment_id": a["appointment_id"],
        "amount": next(t["price"] for t in treatments if t["treatment_id"] == a["treatment_id"]),
        "paid": random.choice([True, False]),
        "payment_date": fake.date_this_year() if random.random() > 0.3 else None,
        "payment_method": random.choice(["Cash", "Credit Card", "Mobile Pay"]) if random.random() > 0.3 else None
    } for i, a in enumerate(appointments)]

def generate_treatment_records(appointments):
    return [{
        "record_id": i + 1,
        "appointment_id": a["appointment_id"],
        "notes": fake.sentence(),
        "date_performed": a["appointment_time"].date() if a["status"] == "Completed" else None,
        "outcome": random.choice(["正常", "需追蹤", "改善中"]) if a["status"] == "Completed" else None
    } for i, a in enumerate(appointments)]

# Main script
patients = generate_patients()
doctors = generate_doctors()
treatments = generate_treatments()
appointments = generate_appointments(patients, doctors, treatments)
billing = generate_billing(appointments, treatments)
treatment_records = generate_treatment_records(appointments)

dfs = {
    "patients": pd.DataFrame(patients),
    "doctors": pd.DataFrame(doctors),
    "treatments": pd.DataFrame(treatments),
    "appointments": pd.DataFrame(appointments),
    "billing": pd.DataFrame(billing),
    "treatment_records": pd.DataFrame(treatment_records),
}

for name, df in dfs.items():
    df.to_csv(f"{name}.csv", index=False)

print("OK！")




