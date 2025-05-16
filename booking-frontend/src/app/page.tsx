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
  descriptionUrl: string;
};

const doctors = [
  {
    id: "1",
    name: "劉淳熙",
    title: "電眼女王",
    avatar: "/avatar1.png",
    seenRecently: true,
    descriptionUrl:
      "https://beautyeye.com.tw/%E9%86%AB%E5%B8%AB%E4%BB%8B%E7%B4%B9/%E5%8A%89%E6%B7%B3%E7%86%99-%E9%86%AB%E5%B8%AB/", // External link
  },
  {
    id: "2",
    name: "孫立惠",
    title: "韓式美學達人",
    avatar: "/avatar2.png",
    seenRecently: false,
    descriptionUrl:
      "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e5%ad%ab%e7%ab%8b%e6%83%a0-%e9%86%ab%e5%b8%ab/",
  },
  {
    id: "3",
    name: "林孟穎",
    title: "精雕美學專家",
    avatar: "/avatar3.png",
    seenRecently: false,
    descriptionUrl:
      "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e6%9e%97%e5%ad%9f%e7%a9%8e-%e9%86%ab%e5%b8%ab/",
  },
  {
    id: "4",
    name: "張峯瑞",
    title: "整形藝術家",
    avatar: "/avatar4.png",
    seenRecently: false,
    descriptionUrl:
      "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e6%95%b4%e5%bd%a2%e8%97%9d%e8%a1%93%e5%ae%b6-%e5%bc%b5%e5%b3%af%e7%91%9e%e6%95%b4%e5%bd%a2%e9%86%ab%e5%b8%ab/",
  },
  {
    id: "5",
    name: "余德毅",
    title: "體態雕塑達人",
    avatar: "/avatar5.png",
    seenRecently: false,
    descriptionUrl:
      "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e4%bd%99%e5%be%b7%e6%af%85%e9%86%ab%e5%b8%ab/",
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
                onClick={(doctor) => setSelectedDoctor(doctor as Doctor)}
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
              {/* Description Box with External Link */}
              <div className="mt-4 w-full bg-[#F5E8E0] p-4 rounded-lg shadow-sm text-center">
                <a
                  href={selectedDoctor.descriptionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  查看 {selectedDoctor.name} 醫師詳細介紹
                </a>
              </div>
              <button
                className="mt-6 bg-green-500 w-100px text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
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
