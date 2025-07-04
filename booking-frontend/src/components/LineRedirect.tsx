"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function LineRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lineId = searchParams.get("line_id");
    console.log("hi user line id =", lineId);

    if (!lineId) {
      console.error("line_id 未提供");
      setTimeout(() => router.replace("/consult"), 3000);
      return;
    }

    const fetchAndNavigate = async () => {
      try {
        const res = await fetch(
          `https://booking-backend-prod-260019038661.asia-east1.run.app/api/patients/verify?user_id=${lineId}`
        );
        const data = await res.json();
        console.log("API 回傳資料：", data);
        const isMember = data.status === "success";
        localStorage.setItem("line_id", lineId);
        localStorage.setItem("isMember", String(isMember));
        console.log("isMember:", isMember);

        // 確保 fetch 處理完再導頁
        setTimeout(() => {
          router.replace("/consult");
        }, 3000); // 等 3 秒後導頁
      } catch (err) {
        console.error("API error:", err);
        setLoading(false);
      }
    };

    fetchAndNavigate();
  }, [searchParams, router]);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <p className="text-center mt-10 text-red-600">載入失敗，請稍後再試。</p>
  );
}
