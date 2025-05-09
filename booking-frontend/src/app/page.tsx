'use client';
import { useState } from 'react';
import DoctorCard from '@/components/DoctorCard';
import Modal from '@/components/Modal';

const doctors = [
  { id: '1', name: '劉淳熙', title: '電眼女王', avatar: '/avatar1.png', seenRecently: true },
  { id: '2', name: '孫立惠', title: '韓式美學達人', avatar: '/avatar2.jpg', seenRecently: false },
  { id: '3', name: '林孟穎', title: '精雕美學專家', avatar: '/avatar3.jpg', seenRecently: false },
  { id: '4', name: '張峯瑞', title: '整形藝術家', avatar: '/avatar4.jpg', seenRecently: false },
  { id: '5', name: '余德毅', title: '體態雕塑達人', avatar: '/avatar5.jpg', seenRecently: false },
];

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <div className="p-6">
      {showWelcome && (
        <Modal onClose={() => setShowWelcome(false)}>
          <h2 className="text-xl font-semibold text-black">歡迎 OOO</h2>
          <p className="text-black">請選擇預約醫師。</p>
        </Modal>
      )}
      <div className="space-y-10">
        {doctors
          .sort((a, b) => (b.seenRecently ? 1 : 0) - (a.seenRecently ? 1 : 0))
          .map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
      </div>
    </div>
  );
}
