"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

type AvailableTime = {
  start: string;
  end: string;
  is_bookable: boolean;
};

export default function SchedulePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // map: { "2025-05-23": [11,12,13...], ... }
  const [dateHourMap, setDateHourMap] = useState<Record<string, number[]>>({});
  const [selectableDates, setSelectableDates] = useState<Set<string>>(new Set());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableHours, setAvailableHours] = useState<number[]>([]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  // 1) on mount, fetch all available times and build dateHourMap
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/available_times?doctor_id=${id}`)
      .then((res) => res.json())

      .then((data: { available_times: AvailableTime[] }) => {
        console.log("Fetched data:", data);
        const map: Record<string, Set<number>> = {};
        data.available_times.forEach((slot) => {
          if (!slot.is_bookable) return;
          const d = new Date(slot.start);
          const day = d.toISOString().split("T")[0];
          const h = d.getHours();
          // 只顯示 11~20 點
          if (h < 11 || h > 20) return;
          if (!map[day]) map[day] = new Set();
          map[day].add(h);
        });
        const hourMap: Record<string, number[]> = {};
        Object.entries(map).forEach(([day, hours]) => {
          hourMap[day] = Array.from(hours).sort((a, b) => a - b);
        });
        setDateHourMap(hourMap);
        setSelectableDates(new Set(Object.keys(hourMap)));
      })
      .catch(console.error);
  }, [id]);

  // 2) 當選擇日期時，更新 availableHours
  useEffect(() => {
    if (!selectedDate) {
      setAvailableHours([]);
      setSelectedHour(null);
      return;
    }
    const day = selectedDate.toISOString().split("T")[0];
    setAvailableHours(dateHourMap[day] || []);
    setSelectedHour(null);
  }, [selectedDate, dateHourMap]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
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

        {/* 時段列表：寬度和 calendar 一致，文字置中 */}
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
                  ${isAvailable
                    ? isSelected
                      ? "bg-green-500 text-white"
                      : "bg-white text-black hover:bg-[#f0e6dd]"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"}
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
            ${selectedDate && selectedHour !== null
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#e3cec0] cursor-not-allowed"}
          `}
        >
          確認
        </button>
      </div>
    </div>
  );
}
