'use client';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';

const timesMorning = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'];
const timesAfternoon = ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

type TimeButtonProps = {
  time: string;
};




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

  const TimeButton = ({ time }: TimeButtonProps) => (
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">選擇時段</h2>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl">🌅</span>
              <span className="ml-3 text-lg font-semibold text-gray-700">上午</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {timesMorning.map((time) => (
                <TimeButton key={time} time={time} />
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-4">
              <span className="text-2xl">🌇</span>
              <span className="ml-3 text-lg font-semibold text-gray-700">下午</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {timesAfternoon.map((time) => (
                <TimeButton key={time} time={time} />
              ))}
            </div>
          </div>
        </div>

        <button
          disabled={!selectedTime}
          onClick={handleConfirm}
          className={`mt-8 w-full py-3 rounded-full text-white font-semibold transition-all duration-200 transform ${
            selectedTime
              ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          確認
        </button>
      </div>
    </div>
  );
}