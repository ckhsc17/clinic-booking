"use client";
import { Suspense } from "react";
import LineRedirect from "@/components/LineRedirect";

export default function HomePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">載入中...</p>}>
      <LineRedirect />
    </Suspense>
  );
}