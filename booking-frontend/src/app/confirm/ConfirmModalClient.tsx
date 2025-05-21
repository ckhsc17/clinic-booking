'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/components/Modal';

const doctorData: Record<string, { name: string }> = {
  "1": { name: "劉淳熙" },
  "2": { name: "孫立惠" },
  "3": { name: "林孟穎" },
  "4": { name: "張峯瑞" },
  "5": { name: "余德毅" },
};

export default function ConfirmModalClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const userId = localStorage.getItem('user_id');
  const treatmentId = 1; // 這裡可以根據實際情況設置，待處理
  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    console.log('handleConfirm clicked');
    if (!doctorId || !date || !time || !userId) {
      console.log('缺少必要參數');
      console.log('userId:', userId);
      setError("缺少必要參數");
      return;
    }
    console.log('具備必要參數，開始預約');
    console.log('doctorId:', doctorId);
    console.log('date:', date);
    console.log('time:', time);
    console.log('userId:', userId);

    setLoading(true);
    setError(null);

    // 組成 ISO 8601 時間字串
    // 如果 time 已經是 "14:00"，再補 ":00" 變成 "14:00:00"
    const appointmentTime = `${date}T${time}${time.length === 5 ? ':00' : ''}`;

    const payload = {
      patient_id: userId,
      doctor_id: Number(doctorId),
      treatment_id: treatmentId,
      appointment_time: appointmentTime,
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/create_appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.detail || res.statusText);
      }

      // 成功
      console.log('預約成功');
      const data = await res.json();
      console.log('預約資料:', data);
      setConfirmed(true);
      // 1.5s 後導回首頁
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || '發生未知錯誤');
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const id = doctorId ?? '';
  const doctorName = (doctorData as Record<string, { name: string }>)[id]?.name || `醫師 ${id}`;
  const timeStamp = formatDate(date);

  return (
    <Modal onClose={() => router.push('/')} showCloseButton={false}>
      {confirmed ? (
        <div className="flex flex-col items-center justify-center">
          <svg
            className="w-20 h-20 text-green-500 animate-checkmark mb-4"
            viewBox="0 0 52 52"
          >
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="opacity-20"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              d="M14 27l7 7 16-16"
            />
          </svg>
          <h2 className="text-xl font-bold text-green-600 mb-2">預約成功！</h2>
          <p className="text-gray-600">我們已收到您的預約申請</p>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-800 text-center">
            確認預約 {timeStamp} {time} {doctorName}醫師？
          </p>
          <button
            onClick={handleConfirm}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transform hover:scale-101 transition duration-200"
          >
            確認
          </button>
          <button
            onClick={() => router.push('/doctor/[id]')}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transform hover:scale-101 transition duration-200"
          >
            取消
          </button>
        </div>
      )}
    </Modal>
  );
}
