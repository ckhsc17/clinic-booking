"use client";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";

const doctorData = {
  "1": {
    name: "陳醫師",
    avatar: "/avatar1.png",
    lastVisit: "5天前",
    tags: ["#抽脂", "#眼皮"],
  },
  "2": {
    name: "林醫師",
    avatar: "/avatar2.jpg",
    lastVisit: "10天前",
    tags: ["#拉皮", "#隆鼻"],
  },
};

export default function DoctorDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const doctor = doctorData[id];

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
          onClick={() => router.push(`/doctor/${id}/schedule`)}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          預約
        </button>
      </div>
    </Modal>
  );
}
