// components/ConsultForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const timeSlots = [
  "早上 10:00–12:00",
  "下午 13:00–17:00",
  "晚上 18:00–20:00",
  "皆可（不指定時段）",
];

const consultItems = [
  "眼整形",
  "臉部整形",
  "身體雕塑",
  "微整注射",
  "雷射光療",
  "其他",
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  time: string;
  items: string[];
  message: string;
  photo: File | null;
};

export default function ConsultForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    time: "",
    items: [],
    message: "",
    photo: null,
  });
  const [isMember, setIsMember] = useState(false);

  // 🚀 範例 fetch 判斷是否為會員
  useEffect(() => {
    setIsMember(true);
    // fetch("/api/check-first-time")
    //   .then((res) => res.json())
    //   .then((data) => setIsMember(data.isMember));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheck = (item: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.includes(item)
        ? prev.items.filter((i) => i !== item)
        : [...prev.items, item],
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, photo: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      if (key === "items") {
        formData.append("items", JSON.stringify(form.items));
      } else if (key === "photo" && form.photo) {
        formData.append("photo", form.photo);
      } else {
        const value = form[key as keyof FormData];
        if (typeof value === "string") {
          formData.append(key, value);
        }
      }
    }
    await fetch("/api/submit-consult", {
      method: "POST",
      body: formData,
    });
    alert("表單送出成功！");
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#fbe9e5] p-8 rounded-lg shadow">
      <h2 className="text-3xl font-bold text-center text-[#7c6c4f] mb-2">
        預約表單
      </h2>
      <p className="text-center font-semibold text-gray-700 mb-6">
        線上諮詢 歡迎傳照片至官方客服
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="姓名"
          value={form.name}
          onChange={handleChange}
          className="p-3 bg-[#fff5e5] border rounded w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="電話"
          value={form.phone}
          onChange={handleChange}
          className="p-3 bg-[#fff5e5] border rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="p-3 bg-[#fff5e5] border rounded w-full"
        />
        <select
          name="time"
          value={form.time}
          onChange={handleChange}
          className="p-3 bg-[#fff5e5] border rounded w-full"
        >
          <option value="">希望預約時段</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
        <div className="col-span-1 md:col-span-2">
          <p className="mb-2 font-semibold text-gray-700">諮詢項目</p>
          <div className="grid grid-cols-2 gap-2">
            {consultItems.map((item) => (
              <label key={item} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.items.includes(item)}
                  onChange={() => handleCheck(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="您的其他要求或建議"
          className="col-span-1 md:col-span-2 p-3 bg-[#fff5e5] border rounded w-full min-h-[100px]"
        />
        <div className="col-span-1 md:col-span-2">
          <label className="block font-medium text-gray-700 mb-2">
            上傳照片
          </label>
          <input type="file" onChange={handlePhotoChange} />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleSubmit}
          className="bg-[#bfae9c] text-white px-6 py-2 rounded hover:bg-[#a08f7e]"
        >
          送出
        </button>

        {isMember ? (
          <button
            onClick={() => router.push("/doctor/[id]/")}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            醫師預約
          </button>
        ) : (
          <button
            className="px-6 py-2 rounded bg-gray-300 text-white cursor-not-allowed"
            disabled
          >
            醫師預約（限會員）
          </button>
        )}
      </div>
    </div>
  );
}
