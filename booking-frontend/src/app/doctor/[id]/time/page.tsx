'use client';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';

const timesMorning = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];
const timesAfternoon = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function TimeSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const date = searchParams.get('date');

  const [selectedTime, setSelectedTime] = useState('');

  const handleConfirm = () => {
    if (selectedTime) {
      router.push(`/confirm?doctorId=${id}&date=${date}&time=${selectedTime}`);
    }
  };

  const TimeButton = ({ time }) => (
    <button
      onClick={() => setSelectedTime(time)}
      className={`w-20 h-10 rounded-lg border text-sm ${
        selectedTime === time
          ? 'border-blue-500 bg-blue-100'
          : 'border-gray-300 hover:bg-gray-100'
      }`}
    >
      {time}
    </button>
  );

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">選擇時段</h2>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <span>🌅</span>
          <span className="ml-2 font-medium">上午</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {timesMorning.map((time) => (
            <TimeButton key={time} time={time} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span>🌇</span>
          <span className="ml-2 font-medium">下午</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {timesAfternoon.map((time) => (
            <TimeButton key={time} time={time} />
          ))}
        </div>
      </div>

      <button
        disabled={!selectedTime}
        onClick={handleConfirm}
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-300"
      >
        確認
      </button>
    </div>
  );
}
