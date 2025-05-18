from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import patients, appointments, treatment_records, doctors, admin

app = FastAPI(title="愛惟美診所預約系統", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(treatment_records.router, prefix="/api")
app.include_router(doctors.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
async def root():
    return {"status": "診所 API 正常運行"}
