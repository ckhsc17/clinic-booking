"use client";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";

const doctorData: Record<
  string,
  {
    name: string;
    avatar: string;
    lastVisit: string;
    tags: string[];
  }
> = {
  "1": {
    name: "劉淳熙",
    avatar: "/avatar1.png",
    lastVisit: "5 天前",
    tags: ["抽脂", "眼皮"],
  },
  "2": {
    name: "孫立惠",
    avatar: "/avatar2.jpg",
    lastVisit: "12 天前",
    tags: ["電波", "音波"],
  },
  "3": {
    name: "林孟穎",
    avatar: "/avatar3.jpg",
    lastVisit: "2 天前",
    tags: ["眼袋"],
  },
  "4": {
    name: "張峯瑞",
    avatar: "/avatar4.jpg",
    lastVisit: "20 天前",
    tags: ["隆鼻"],
  },
  "5": {
    name: "余德毅",
    avatar: "/avatar5.jpg",
    lastVisit: "8 天前",
    tags: ["體雕"],
  },
};

export default function DoctorDetailPage() {
  const router = useRouter();

  const rawId = useParams().id;
  const doctorId = Array.isArray(rawId) ? rawId[0] : rawId;

  if (!doctorId) return <div>找不到醫師資料</div>;

  const doctor = doctorData[doctorId];

  if (!doctor) return <div>找不到醫師資料</div>;

  if (!doctor) return <div>找不到醫師資料</div>;

  return (
    <Modal onClose={() => router.back()}>
      <div className="text-center">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-24 h-24 mx-auto rounded-full"
        />
        <h2 className="text-lg font-semibold mt-4">{doctor.name}</h2>
        <p className="text-sm text-gray-500 mb-2">
          上次就診：{doctor.lastVisit}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {doctor.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          onClick={() => router.push(`/doctor/${doctorId}/schedule`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          預約
        </button>
      </div>
    </Modal>
  );
}
