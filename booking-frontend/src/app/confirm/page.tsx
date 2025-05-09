'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/components/Modal';

const doctorData = {
  '1': { name: '陳醫師' },
  '2': { name: '林醫師' },
  // 可以再擴充其他醫師
};

export default function ConfirmPage() {
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
    }, 1500);
  };

  // 格式化日期字串（從 ISO 或 Date 轉成 yyyy-mm-dd）
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const doctorName = doctorData[doctorId]?.name || `醫師 ${doctorId}`;
  const niceDate = formatDate(date);

  return (
    <Modal onClose={() => router.push('/')}>
      {confirmed ? (
        <h2 className="text-lg font-semibold text-green-600">預約成功！</h2>
      ) : (
        <div>
          <p className="mb-4 text-gray-800 text-center">
            確認預約 {niceDate} {time} 與 {doctorName}？
          </p>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            確認
          </button>
        </div>
      )}
    </Modal>
  );
}
