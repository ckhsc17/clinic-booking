-- 病人表格，使用 LINE UserId 作為主鍵，並加入 role 欄位
CREATE TABLE Patients (
    user_id VARCHAR(50) PRIMARY KEY,  -- LINE UserId
    name VARCHAR(100),
    gender VARCHAR(10),
    birthdate DATE,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    role VARCHAR(10) CHECK (role IN ('VIP', 'Normal'))
);

-- 醫師表格，加入可用時段表
CREATE TABLE Doctors (
    doctor_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    specialty VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    license_no VARCHAR(50)
);

-- 醫師可預約的時段表（多對多）
CREATE TABLE Doctor_Availability (
    availability_id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT,
    available_start DATETIME,
    available_end DATETIME,
    is_bookable BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id)
);

-- 療程表（如玻尿酸注射、皮秒等）
CREATE TABLE Treatments (
    treatment_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    duration_min INT
);

-- 服務表（屬於一次性的手術/療程，與 Treatment 區分開）
CREATE TABLE Services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description VARCHAR(200),
    price DECIMAL(10, 2)
);

-- 藥品表
CREATE TABLE Medicines (
    medicine_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    description TEXT,
    amount VARCHAR(50) -- 如 "1ml", "500mg", "一顆"
);

-- 預約表
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(50),
    doctor_id INT,
    treatment_id INT,
    appointment_time DATETIME,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES Patients(user_id),
    FOREIGN KEY (doctor_id) REFERENCES Doctors(doctor_id),
    FOREIGN KEY (treatment_id) REFERENCES Treatments(treatment_id)
);

-- 帳單表
CREATE TABLE Billing (
    bill_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    amount DECIMAL(10, 2),
    paid BOOLEAN,
    payment_date DATE,
    payment_method VARCHAR(50),
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

-- 療程紀錄表
CREATE TABLE Treatment_Records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    notes TEXT,
    date_performed DATE,
    outcome TEXT,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id)
);

-- 課程購買紀錄（針對非一次性的療程，如玻尿酸購買 ml 數）
CREATE TABLE Purchases (
    user_id VARCHAR(50),
    treatment_id INT,
    total_quantity DECIMAL(10, 2), -- 例如 2.0 ml
    remaining_quantity DECIMAL(10, 2),
    purchase_date DATE,
    PRIMARY KEY (user_id, treatment_id),
    FOREIGN KEY (user_id) REFERENCES Patients(user_id),
    FOREIGN KEY (treatment_id) REFERENCES Treatments(treatment_id)
);

CREATE TABLE Treatment_Medicine_Usage (
    usage_id INT PRIMARY KEY AUTO_INCREMENT,
    record_id INT,               -- 對應到 Treatment_Records
    medicine_id INT,
    used_amount DECIMAL(10, 2), -- e.g. 0.5 ml
    FOREIGN KEY (record_id) REFERENCES Treatment_Records(record_id),
    FOREIGN KEY (medicine_id) REFERENCES Medicines(medicine_id)
);
