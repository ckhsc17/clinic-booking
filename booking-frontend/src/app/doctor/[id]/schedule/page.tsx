"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

type AvailableTime = {
  start: string;
  end: string;
};

const doctorData: Record<string, { name: string }> = {
  "1": { name: "劉淳熙" },
  "2": { name: "孫立惠" },
  "3": { name: "林孟穎" },
  "4": { name: "張峯瑞" },
  "5": { name: "余德毅" },
};

export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [selectableDates, setSelectableDates] = useState<Set<string>>(new Set());

  /*
  // ✅ 當選取日期後，自動更新可用時段
  useEffect(() => {
    if (!selectedDate) return;
    // const dateStr = selectedDate.toISOString().split("T")[0];
    fetch(`https://booking-backend-prod-260019038661.asia-east1.run.app/api/available_times?doctor_name=${doctorData[id]?.name}`)
      .then((res) => res.json())
      .then((data) => {
        const dateHourMap: Record<string, number[]> = {};
        // const filteredHours: number[] = [];

        data.available_times.forEach((slot: AvailableTime) => {
          const dateObj = new Date(slot.start);
          const dateKey = dateObj.toISOString().split("T")[0];
          const hour = dateObj.getHours();

          if (hour >= 11 && hour <= 20) {
            if (!dateHourMap[dateKey]) dateHourMap[dateKey] = [];
            dateHourMap[dateKey].push(hour);
          }
        });

        const dayStr = selectedDate.toISOString().split("T")[0];
        const hours = dateHourMap[dayStr] ?? [];
        setAvailableHours(hours);
      });
  }, [selectedDate, id]);
  */

  // ✅ 第一次載入時：計算所有有任一可預約時段的日期
  useEffect(() => {
    const doctorName = doctorData[id]?.name;
    if (!doctorName) return;

    fetch(`https://booking-backend-prod-260019038661.asia-east1.run.app/api/available_times?doctor_name=${encodeURIComponent(doctorName)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const map: Record<string, Set<number>> = {};
        data.available_times.forEach((slot: AvailableTime) => {
          const date = new Date(slot.start);
          const dayStr = date.toISOString().split("T")[0];
          const hour = date.getHours();
          if (hour >= 11 && hour <= 20) {
            if (!map[dayStr]) map[dayStr] = new Set();
            map[dayStr].add(hour);
          }
        });

        const eligible = Object.keys(map).filter((day) => map[day].size > 0);
        setSelectableDates(new Set(eligible));
      });
  }, [id]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedHour(null);
  };

  const handleConfirm = () => {
    if (!selectedDate || selectedHour === null) return;
    const dateStr = selectedDate.toISOString().split("T")[0];
    router.push(
      `/confirm?doctorId=${id}&date=${dateStr}&time=${selectedHour}:00`
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#f5e9e2]">
      <div className="w-full bg-[#d4b7a5] text-white py-3 flex items-center justify-start px-4 shadow-md relative">
        <button
          onClick={() => router.push("/doctor/[id]/")}
          className="px-6 py-3 border bg-[#e2cec0] border-white rounded-full hover:bg-white hover:text-[#d4b7a5] transition text-lg font-bold shadow hover:scale-105"
        >
          ← 返回
        </button>
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[25px] font-semibold">
          選擇日期與時段
        </h2>
      </div>

      {/* 月曆與時段按鈕 */}
      <div className="calendar-container scale-[1.35] origin-top w-full max-w-[360px] px-4 flex flex-col items-center mt-8">
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={handleDateChange}
          selectableDates={selectableDates}
        />

        {/* 時段按鈕 */}
        <div className="grid grid-cols-5 gap-3 mt-6">
          {Array.from({ length: 10 }, (_, i) => {
            const hour = i + 11;
            const disabled = !selectedDate || !availableHours.includes(hour);
            const selected = selectedHour === hour;

            return (
              <button
                key={hour}
                onClick={() => setSelectedHour(hour)}
                disabled={disabled}
                className={`w-12 h-12 rounded-full text-white text-sm font-semibold shadow ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : selected
                    ? "bg-green-500"
                    : "bg-[#d4b7a5] hover:bg-[#c8a68a]"
                }`}
              >
                {hour}
              </button>
            );
          })}
        </div>

        {/* 確認 */}
        <button
          disabled={!selectedDate || selectedHour === null}
          onClick={handleConfirm}
          className={`mt-6 py-2 w-full rounded-full text-white text-lg font-semibold transition ${
            selectedDate && selectedHour !== null
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#e3cec0] cursor-not-allowed"
          }`}
        >
          確認
        </button>
      </div>
    </div>
  );
}
