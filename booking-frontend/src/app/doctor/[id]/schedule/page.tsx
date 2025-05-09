'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DatePicker from '@/components/DatePicker';

export default function SchedulePage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-lg font-semibold mb-4">選擇日期</h2>
      <DatePicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      {selectedDate && (
        <button
          onClick={() => router.push(`/doctor/${id}/time?date=${selectedDate}`)}
          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded"
        >
          確認
        </button>
      )}
    </div>
  );
}
