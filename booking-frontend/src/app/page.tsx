"use client";
import { useState } from "react";
import DoctorCard from "@/components/DoctorCard";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";

type Doctor = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  seenRecently: boolean;
};

const doctors = [
  {
    id: "1",
    name: "劉淳熙",
    title: "電眼女王",
    avatar: "/avatar1.png",
    seenRecently: true,
  },
  {
    id: "2",
    name: "孫立惠",
    title: "韓式美學達人",
    avatar: "/avatar2.png",
    seenRecently: false,
  },
  {
    id: "3",
    name: "林孟穎",
    title: "精雕美學專家",
    avatar: "/avatar3.png",
    seenRecently: false,
  },
  {
    id: "4",
    name: "張峯瑞",
    title: "整形藝術家",
    avatar: "/avatar4.png",
    seenRecently: false,
  },
  {
    id: "5",
    name: "余德毅",
    title: "體態雕塑達人",
    avatar: "/avatar5.png",
    seenRecently: false,
  },
];

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FDF3EF]">
      {/* 頂部 LOGO */}
      <div className="w-full bg-[#d4b7a5] py-3 flex justify-center shadow-md">
        <img
          src="/logo.png"
          alt="愛惟美診所 Logo"
          className="h-20 object-contain"
        />
      </div>

      <div className="p-6">
        {showWelcome && (
          <Modal onClose={() => setShowWelcome(false)} showCloseButton={false}>
            <h2 className="text-xl font-semibold text-black">歡迎 OOO</h2>
            <p className="text-black">🍆請選擇預約醫師🍆</p>
            <button
              className="mt-4 w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transform hover:scale-101 transition duration-200"
              onClick={() => setShowWelcome(false)}
            >
              開始預約
            </button>
          </Modal>
        )}
        <div className="space-y-10">
          {doctors
            .sort((a, b) => (b.seenRecently ? 1 : 0) - (a.seenRecently ? 1 : 0))
            .map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onClick={setSelectedDoctor}
              />
            ))}
        </div>
        {selectedDoctor && (
          <Modal onClose={() => setSelectedDoctor(null)}>
            <div className="flex flex-col items-center">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.name}
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
              <h2 className="text-4xl mb-2 font-semibold text-[#D1B6A1]">
                {selectedDoctor.name}
              </h2>
              <p className="text-gray-500">上次就診：5天前</p>
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  #抽脂
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  #眼皮
                </span>
              </div>
              <button
                className="mt-6 bg-green-500 w-100px text-white px-6 py-2 rounded-full hover:bg-green-600 transition" //hover:scale-101 transition duration-200
                onClick={() => {
                  router.push(`/doctor/${selectedDoctor.id}/schedule`);
                }}
              >
                預約
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
