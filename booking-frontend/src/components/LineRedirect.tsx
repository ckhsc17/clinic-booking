"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LineRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //const lineId = "abc351519"; // 測試用，正式版可改為 searchParams.get("line_id");
    const lineId = searchParams.get("user_id");

    if (!lineId) {
      console.error("No line user id provided.");
      setLoading(false);
      return;
    }

    console.log("uesr line id = ", lineId);

    fetch(`https://booking-backend-prod-260019038661.asia-east1.run.app/api/patients/records?user_id=${lineId}`)
      .then((res) => res.json())
      .then((data) => {
        const isMember = data.isMember;
        localStorage.setItem("isMember", String(isMember));
        router.replace(isMember ? `/doctor` : `/consult?line_id=${lineId}`);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, [searchParams, router]);

  if (loading) {
    return <p className="text-center mt-10">載入中...</p>;
  }

  return <p className="text-center mt-10 text-red-600">載入失敗，請稍後再試。</p>;
}
