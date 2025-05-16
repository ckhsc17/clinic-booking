"use client";
import { useRouter, useParams } from "next/navigation";
import Modal from "@/components/Modal";
import { desc } from "framer-motion/client";
import { de } from "date-fns/locale";

const doctorData: Record<
  string,
  {
    name: string;
    avatar: string;
    lastVisit: string;
    tags: string[];
    descriptionLink: string;
  }
> = {
  "1": {
    name: "劉淳熙",
    avatar: "/avatar1.png",
    lastVisit: "5天前",
    tags: ["#抽脂", "#眼皮"],
    descriptionLink: "https://beautyeye.com.tw/%E9%86%AB%E5%B8%AB%E4%BB%8B%E7%B4%B9/%E5%8A%89%E6%B7%B3%E7%86%99-%E9%86%AB%E5%B8%AB/",

  },
  "2": {
    name: "孫立惠",
    avatar: "/avatar2.jpg",
    lastVisit: "10天前",
    tags: ["#拉皮", "#隆鼻"],
    descriptionLink: "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e5%ad%ab%e7%ab%8b%e6%83%a0-%e9%86%ab%e5%b8%ab/",
  },
  "3": {
    name: "林孟穎",
    avatar: "/avatar3.jpg",
    lastVisit: "20天前",
    tags: ["#拉皮", "#隆鼻"],
    descriptionLink: "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e6%9e%97%e5%ad%9f%e7%a9%8e-%e9%86%ab%e5%b8%ab/",
  },
  "4": {
    name: "張峯瑞",
    avatar: "/avatar4.jpg",
    lastVisit: "90天前",
    tags: ["#拉皮", "#隆鼻"],
    descriptionLink: "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e6%95%b4%e5%bd%a2%e8%97%9d%e8%a1%93%e5%ae%b6-%e5%bc%b5%e5%b3%af%e7%91%9e%e6%95%b4%e5%bd%a2%e9%86%ab%e5%b8%ab/",
  },
  "5": {
    name: "余德毅",
    avatar: "/avatar5.jpg",
    lastVisit: "1000天前",
    tags: ["#拉皮", "#隆鼻"],
    descriptionLink: "https://beautyeye.com.tw/%e9%86%ab%e5%b8%ab%e4%bb%8b%e7%b4%b9/%e4%bd%99%e5%be%b7%e6%af%85%e9%86%ab%e5%b8%ab/",
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
