// ✅ Next.js 預約表單頁面：/app/booking/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const doctors = [
  { name: "陳醫師", schedule: [13, 14, 15, 16, 17] },
  { name: "林醫師", schedule: [18, 19, 20, 21] },
];

const treatments = ["玻尿酸注射", "皮秒雷射", "音波拉提"];

export default function BookingPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [treatment, setTreatment] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [availableTimes, setAvailableTimes] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const found = doctors.find((d) => d.name === doctor);
    setAvailableTimes(found ? found.schedule : []);
    setSelectedTime(null);
  }, [doctor]);

  const handleSubmit = async () => {
    if (!name || !phone || !doctor || !treatment || !date || selectedTime === null) {
      alert("請完整填寫預約資料");
      return;
    }
    const datetime = new Date(date);
    datetime.setHours(selectedTime, 0, 0, 0);

    const res = await fetch("http://localhost:8000/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone,
        treatment,
        datetime: datetime.toISOString(),
      }),
    });

    const data = await res.json();
    alert(data.message);
    if (data.eventLink) window.open(data.eventLink, "_blank");
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">預約療程</h1>

      <div className="mb-4">
        <label className="block">姓名</label>
        <input className="border w-full p-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block">手機</label>
        <input className="border w-full p-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="mb-4">
        <label className="block">選擇醫師</label>
        <select className="border w-full p-2" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
          <option value="">請選擇</option>
          {doctors.map((d) => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block">選擇療程</label>
        <select className="border w-full p-2" value={treatment} onChange={(e) => setTreatment(e.target.value)}>
          <option value="">請選擇</option>
          {treatments.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block">選擇日期</label>
        <DatePicker selected={date} onChange={(d) => setDate(d)} className="border w-full p-2" />
      </div>

      {doctor && date && (
        <div className="mb-4">
          <label className="block">選擇時段</label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((hour) => (
              <button
                key={hour}
                onClick={() => setSelectedTime(hour)}
                className={`border p-2 rounded ${selectedTime === hour ? "bg-green-200" : ""}`}
              >
                {hour}:00
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">確認預約</button>
    </div>
  );
}
