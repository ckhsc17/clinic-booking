"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

type AvailableTime = {
  start: string;
  end: string;
  is_bookable: boolean;
};

// 🔧 日期轉 YYYY-MM-DD（解決時區對不上問題）
function formatDateYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [dateHourMap, setDateHourMap] = useState<Record<string, number[]>>({});
  const [selectableDates, setSelectableDates] = useState<Set<string>>(
    new Set()
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // 1) on mount, fetch 所有可預約資料
  useEffect(() => {
    const doctorId = parseInt(id);
    if (isNaN(doctorId)) {
      console.error("Invalid doctor ID");
      return;
    }
    const patientId = localStorage.getItem("line_id");
    console.log("patientId:", patientId)

    fetch(
      `https://booking-backend-prod-260019038661.asia-east1.run.app/api/doctors/availability?doctor_id=${doctorId}&patient_id=${patientId}`
    )
      .then((res) => res.json())
      .then((data: { available_times: AvailableTime[] }) => {
        console.log("Fetched data:", data);

        const map: Record<string, Set<number>> = {};
        data.available_times.forEach((slot) => {
          if (!slot.is_bookable) return;

          const start = new Date(slot.start);
          const end = new Date(slot.end);

          const day = formatDateYMD(start);
          if (!map[day]) map[day] = new Set();

          const current = new Date(start);
          while (current < end) {
            const hour = current.getHours();
            if (hour >= 11 && hour <= 20) {
              map[day].add(hour);
            }
            current.setHours(current.getHours() + 1);
          }
        });

        const finalMap: Record<string, number[]> = {};
        Object.entries(map).forEach(([day, hourSet]) => {
          finalMap[day] = Array.from(hourSet).sort((a, b) => a - b);
        });

        setDateHourMap(finalMap);
        setSelectableDates(new Set(Object.keys(finalMap)));
      })
      .catch(console.error);
  }, [id]);

  // 2) 選日期後載入時段
  useEffect(() => {
    if (!selectedDate) {
      setAvailableHours([]);
      setSelectedHour(null);
      return;
    }
    const day = formatDateYMD(selectedDate);
    console.log("🔎 選取日期:", day);
    console.log("📅 可選日期 map keys:", Object.keys(dateHourMap));

    setAvailableHours(dateHourMap[day] || []);
    setSelectedHour(null);
  }, [selectedDate, dateHourMap]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (!selectedDate || selectedHour === null) return;
    const dateStr = formatDateYMD(selectedDate);
    router.push(
      `/confirm?doctorId=${id}&date=${dateStr}&time=${selectedHour}:00`
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5e9e2]">
      {/* header */}
      <div className="w-full bg-[#d4b7a5] text-white py-3 flex items-center px-4 shadow-md relative">
        <button
          onClick={() => router.push("/doctor/[id]/")}
          className="px-6 py-3 bg-[#e2cec0] border border-white rounded-full text-lg font-bold hover:bg-white hover:text-[#d4b7a5] transition"
        >
          ← 返回
        </button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[25px] font-semibold">
          選擇日期與時段
        </h2>
      </div>

      {/* calendar + time slots */}
      <div className="w-full max-w-md px-4 mt-8">
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
          selectableDates={selectableDates}
        />

        {/* 時段列表 */}
        <div className="mt-6 w-full max-w-md space-y-2">
          {Array.from({ length: 10 }, (_, i) => i + 11).map((hour) => {
            const isAvailable = availableHours.includes(hour);
            const isSelected = selectedHour === hour;
            return (
              <button
                key={hour}
                onClick={() => isAvailable && setSelectedHour(hour)}
                disabled={!isAvailable}
                className={`
                  w-full py-4 rounded-lg text-lg font-medium text-center transition
                  ${
                    isAvailable
                      ? isSelected
                        ? "bg-green-500 text-white"
                        : "bg-white text-black hover:bg-[#f0e6dd]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                {hour}:00
              </button>
            );
          })}
        </div>

        {/* 確認按鈕 */}
        <button
          disabled={!selectedDate || selectedHour === null}
          onClick={handleConfirm}
          className={`
            mt-6 w-full py-3 rounded-full text-lg font-semibold text-white transition
            ${
              selectedDate && selectedHour !== null
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[#e3cec0] cursor-not-allowed"
            }
          `}
        >
          確認
        </button>
      </div>
    </div>
  );
}
