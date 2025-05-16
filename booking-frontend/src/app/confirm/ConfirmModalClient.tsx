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
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      router.push('/');
    }, 3500);
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
  const niceDate = formatDate(date);

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
            確認預約 {niceDate} {time} {doctorName}醫師？
          </p>
          <button
            onClick={handleConfirm}
            className="mt-4 w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transform hover:scale-101 transition duration-200"
          >
            確認
          </button>
        </div>
      )}
    </Modal>
  );
}
