from faker import Faker
import pandas as pd
import random
from datetime import datetime, timedelta

fake = Faker("zh_TW")

# 模擬資料數量
NUM_PATIENTS = 100
NUM_DOCTORS = 7
NUM_TREATMENTS = 7
NUM_MEDICINES = 5

# 病人資料
patients = []
for _ in range(NUM_PATIENTS):
    patients.append({
        "user_id": fake.uuid4(),
        "name": fake.name(),
        "gender": random.choice(["男", "女"]),
        "birthdate": fake.date_of_birth(minimum_age=18, maximum_age=65),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "address": fake.address().replace('\n', ' '),
        "role": random.choice(["VIP", "Normal"]),
        "membership": random.choice(["True", "False"])
    })
pd.DataFrame(patients).to_csv("patients.csv", index=False)

# 醫師資料
doctors = []
for _ in range(NUM_DOCTORS):
    doctors.append({
        "doctor_id": None,  # 若需自動編號可留空或用 range
        "name": fake.name(),
        "specialty": random.choice(["皮膚科", "整形外科", "美容醫學"]),
        "phone": fake.phone_number(),
        "email": fake.email(),
        "license_no": fake.bothify(text='??#####')
    })
df_doctors = pd.DataFrame(doctors)
df_doctors["doctor_id"] = range(1, len(df_doctors) + 1)
df_doctors.to_csv("doctors.csv", index=False)

# 療程資料
treatments = []
for _ in range(NUM_TREATMENTS):
    treatments.append({
        "treatment_id": None,
        "name": fake.word() + "療程",
        "description": fake.text(max_nb_chars=100),
        "price": round(random.uniform(1000, 20000), 2),
        "duration_min": random.choice([30, 45, 60])
    })
df_treatments = pd.DataFrame(treatments)
df_treatments["treatment_id"] = range(1, len(df_treatments) + 1)
df_treatments.to_csv("treatments.csv", index=False)

# 藥品資料
medicines = []
for _ in range(NUM_MEDICINES):
    medicines.append({
        "medicine_id": None,
        "name": fake.word() + "藥品",
        "description": fake.text(max_nb_chars=50),
        "amount": random.choice(["1ml", "500mg", "一顆", "10ml"])
    })
df_medicines = pd.DataFrame(medicines)
df_medicines["medicine_id"] = range(1, len(df_medicines) + 1)
df_medicines.to_csv("medicines.csv", index=False)

# 醫師可預約時段
doctor_availabilities = []
availability_id = 1
        
for doctor in doctors:
    for _ in range(5):
        # 隨機選一個日期（今天到 30 天後）
        random_date = fake.date_between(start_date='today', end_date='+30d')
        
        # 隨機選擇時長（60、120、180分鐘）
        duration_minutes = random.choice([60, 120, 180])
        duration_hours = duration_minutes // 60

        # 可開始的最晚小時（例如，若 duration=3 小時，最晚是 17:00 開始）
        latest_start_hour = 20 - duration_hours

        # 隨機選擇一個合法的開始小時
        start_hour = random.randint(10, latest_start_hour)

        # 組合成 datetime 物件
        start_datetime = datetime.combine(random_date, datetime.min.time()).replace(hour=start_hour)
        end_datetime = start_datetime + timedelta(minutes=duration_minutes)

        doctor_availabilities.append({
            'availability_id': availability_id,
            'doctor_id': doctor,
            'available_start': start_datetime.isoformat(),
            'available_end': end_datetime.isoformat(),
            'is_bookable': random.choice([True, True, True, False])
        })
        availability_id += 1
df_availability = pd.DataFrame(doctor_availabilities)
df_availability["availability_id"] = range(1, len(df_availability) + 1)
df_availability.to_csv("doctor_availability.csv", index=False)


# 模擬預約資料（Appointments）
appointments = []
for i in range(20):
    patient = random.choice(patients)
    doctor = random.choice(doctors)
    treatment = random.choice(treatments)
    appt_time = fake.date_time_between(start_date="+1d", end_date="+15d")
    status = random.choice(['Pending', 'Completed', 'Cancelled'])
    appointments.append({
        "appointment_id": i + 1,
        "user_id": patient["user_id"],
        "doctor_id": df_doctors.sample(1)["doctor_id"].values[0],
        "treatment_id": df_treatments.sample(1)["treatment_id"].values[0],
        "appointment_time": appt_time,
        "status": status,
        "notes": fake.sentence(nb_words=6)
    })
df_appointments = pd.DataFrame(appointments)
df_appointments.to_csv("appointments.csv", index=False)

# 模擬帳單資料（Billing）
billing = []
for appt in df_appointments.itertuples():
    if appt.status == "Cancelled":
        continue
    billing.append({
        "bill_id": len(billing) + 1,
        "appointment_id": appt.appointment_id,
        "amount": round(random.uniform(2000, 25000), 2),
        "paid": random.choice([True, False]),
        "payment_date": fake.date_between(start_date='-10d', end_date='today') if random.choice([True, False]) else None,
        "payment_method": random.choice(["現金", "信用卡", "轉帳", "Line Pay"])
    })
df_billing = pd.DataFrame(billing)
df_billing.to_csv("billing.csv", index=False)

# 模擬藥品餘量（drug_remain）
drug_remain = []
for _ in range(20):
    user = random.choice(patients)
    med_id = df_medicines.sample(1)["medicine_id"].values[0]
    remain_qty = random.randint(1, 10)
    drug_remain.append({
        "user_id": user["user_id"],
        "medicine_id": med_id,
        "remaining_quantity": remain_qty
    })
df_drug_remain = pd.DataFrame(drug_remain).drop_duplicates(subset=["user_id", "medicine_id"])
df_drug_remain.to_csv("drug_remain.csv", index=False)

print("CSV files generated successfully!")