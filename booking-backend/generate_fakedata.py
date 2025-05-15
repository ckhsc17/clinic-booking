from faker import Faker
from sqlalchemy import create_engine, Column, Integer, String, Date, DateTime, DECIMAL, Boolean, Text, ForeignKey, CheckConstraint, VARCHAR
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
import random
from datetime import timedelta, datetime
import csv

fake = Faker('zh_TW')

def write_csv(filename, fieldnames, rows):
    with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
# Generate Patients
patients = []
for _ in range(100):
    patients.append({
        'user_id': fake.uuid4(),
        'name': fake.name(),
        'gender': random.choice(['男', '女']),
        'birthdate': fake.date_of_birth(minimum_age=18, maximum_age=65).isoformat(),
        'phone': fake.phone_number(),
        'email': fake.email(),
        'address': fake.address(),
        'role': random.choice(['VIP', 'Normal'])
    })
write_csv('patients.csv', patients[0].keys(), patients)

# Generate Doctors
doctors = []
for i in range(1, 7):
    doctors.append({
        'doctor_id': i,
        'name': fake.name(),
        'specialty': random.choice(['皮膚科', '整形外科', '醫美']),
        'phone': fake.phone_number(),
        'email': fake.email(),
        'license_no': fake.uuid4()
    })
write_csv('doctors.csv', doctors[0].keys(), doctors)

doctor_availabilities = []
availability_id = 1
for doctor in doctors:
    # 每位醫師生成 5 個可預約時段
    for _ in range(5):
        start_datetime = fake.date_time_between(start_date='now', end_date='+30d')
        end_datetime = start_datetime + timedelta(minutes=random.choice([30, 60, 90]))
        doctor_availabilities.append({
            'availability_id': availability_id,
            'doctor_id': doctor['doctor_id'],
            'available_start': start_datetime.isoformat(),
            'available_end': end_datetime.isoformat(),
            'is_bookable': random.choice([True, True, True, False])  # 大部分時間是可預約
        })
        availability_id += 1
write_csv('doctor_availabilities.csv', doctor_availabilities[0].keys(), doctor_availabilities)

services = []
service_names = ['雙眼皮手術', '隆鼻手術', '拉皮手術', '玻尿酸豐唇', '電波拉皮', '脂肪移植', '微整瘦臉', '雷射除斑', '肉毒桿菌注射', '皮秒雷射']

for i, service_name in enumerate(service_names, start=1):
    services.append({
        'service_id': i,
        'name': service_name,
        'description': fake.text(max_nb_chars=150),
        'price': round(random.uniform(5000, 80000), 2)
    })
write_csv('services.csv', services[0].keys(), services)

# Generate Treatments
treatments = []
for i in range(1, 6):
    treatments.append({
        'treatment_id': i,
        'name': fake.word() + ' 療程',
        'description': fake.text(max_nb_chars=200),
        'price': round(random.uniform(1000, 50000), 2),
        'duration_min': random.randint(30, 120)
    })
write_csv('treatments.csv', treatments[0].keys(), treatments)

# Generate Medicines
medicines = []
for i in range(1, 6):
    medicines.append({
        'medicine_id': i,
        'name': fake.word() + ' 藥品',
        'description': fake.text(max_nb_chars=100),
        'amount': random.choice(['1ml', '500mg', '一顆'])
    })
write_csv('medicines.csv', medicines[0].keys(), medicines)

# Generate Appointments
appointments = []
for i in range(1, 23):
    appointments.append({
        'appointment_id': i,
        'user_id': random.choice(patients)['user_id'],
        'doctor_id': random.choice(doctors)['doctor_id'],
        'treatment_id': random.choice(treatments)['treatment_id'],
        'appointment_time': fake.date_time_this_year().isoformat(),
        'status': random.choice(['Pending', 'Confirmed', 'Completed', 'Cancelled']),
        'notes': fake.text(max_nb_chars=100)
    })
write_csv('appointments.csv', appointments[0].keys(), appointments)

# Generate Billing
billings = []
for i, appointment in enumerate(appointments, 1):
    billings.append({
        'bill_id': i,
        'appointment_id': appointment['appointment_id'],
        'amount': round(random.uniform(1000, 50000), 2),
        'paid': random.choice([True, False]),
        'payment_date': fake.date_this_year().isoformat(),
        'payment_method': random.choice(['Credit Card', 'Cash', 'LINE Pay'])
    })
write_csv('billing.csv', billings[0].keys(), billings)

# Generate Treatment Records (only for Completed)
treatment_records = []
record_id_counter = 1
for appointment in appointments:
    if appointment['status'] == 'Completed':
        treatment_records.append({
            'record_id': record_id_counter,
            'appointment_id': appointment['appointment_id'],
            'notes': fake.text(max_nb_chars=100),
            'date_performed': fake.date_this_year().isoformat(),
            'outcome': random.choice(['良好', '一般', '需要回診'])
        })
        record_id_counter += 1
write_csv('treatment_records.csv', treatment_records[0].keys(), treatment_records)

# Generate Purchases
unique_pairs = set()
purchases = []

while len(purchases) < 10:  # 你要產 10 筆資料
    user_id = random.choice(patients)['user_id']
    treatment_id = random.choice(treatments)['treatment_id']
    pair = (user_id, treatment_id)

    if pair not in unique_pairs:
        unique_pairs.add(pair)
        purchases.append({
            'user_id': user_id,
            'treatment_id': treatment_id,
            'total_quantity': round(random.uniform(1.0, 10.0), 2),
            'remaining_quantity': round(random.uniform(0.0, 5.0), 2),
            'purchase_date': fake.date_this_year().isoformat()
        })

# 寫出 CSV
write_csv('purchases.csv', purchases[0].keys(), purchases)

# Generate Treatment Medicine Usage (related to Treatment Records)
treatment_medicine_usage = []
usage_id_counter = 1
for record in treatment_records:
    treatment_medicine_usage.append({
        'usage_id': usage_id_counter,
        'record_id': record['record_id'],
        'medicine_id': random.choice(medicines)['medicine_id'],
        'used_amount': round(random.uniform(0.5, 2.0), 2)
    })
    usage_id_counter += 1
write_csv('treatment_medicine_usage.csv', treatment_medicine_usage[0].keys(), treatment_medicine_usage)

print("CSV files generated successfully!")