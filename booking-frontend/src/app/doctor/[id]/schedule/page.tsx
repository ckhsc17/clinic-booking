"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DatePicker from "@/components/DatePicker";

export default function SchedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E9E2] to-[#f5e9e2] flex flex-col items-center relative p-0 pt-0">
      <div className="w-full bg-[#d4b7a5] text-white py-3 flex items-center justify-start px-4 shadow-md relative">
        {/* 返回按鈕 */}
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 border bg-[#e2cec0] border-white rounded-full hover:bg-white hover:text-[#d4b7a5] transition text-lg font-bold shadow hover:scale-105"
        >
          ← 返回
        </button>

        {/* 標題 */}
        <h2 className="absolute left-1/2 transform -translate-x-1/2 text-[25px] font-semibold">
          目前正在選擇日期
        </h2>
      </div>

      <div className="relative flex flex-col items-center mt-32">
        {/* 月曆 */}
        <div className="calendar-container scale-[1.35]	">
          <DatePicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {/* 確認按鈕 */}
          <button
            onClick={() =>
              router.push(`/doctor/${id}/time?date=${selectedDate}`)
            }
            disabled={!selectedDate}
            className={`mt-4 py-2 rounded-full w-full max-w-[320px] transition text-white ${
              selectedDate
                ? "bg-green-500 hover:bg-green-600 transition cursor-pointer"
                : "bg-[#e3cec0] cursor-not-allowed"
            }`}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}