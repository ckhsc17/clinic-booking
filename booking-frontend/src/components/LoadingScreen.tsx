"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // loading animation
  useEffect(() => {
    const duration = 3000; // 3 秒
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);

      if (pct < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  // draw pie
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 5;
    const angle = progress * 2 * Math.PI;

    ctx.clearRect(0, 0, size, size);

    // 背景圈
    ctx.beginPath();
    ctx.fillStyle = "#f2e0d1";
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    // 扇形（白色）
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.fillStyle = "#ffffff";
    ctx.arc(center, center, radius, -Math.PI / 2, angle - Math.PI / 2);
    ctx.closePath();
    ctx.fill();
  }, [progress]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-colors duration-[3000ms]"
      style={{
        backgroundColor: `rgba(242, 224, 209, ${1 - progress})`,
      }}
    >
      {/* logo image */}
      <Image
        src="/loadingLogo.png"
        alt="logo"
        width={250}
        height={130}
        style={{
          filter: `invert(${progress})`, // 模擬白→卡其色轉換
          transition: "filter 3s ease",
        }}
      />

      {/* 圓形進度動畫 */}
      <canvas
        ref={canvasRef}
        width={80}
        height={80}
        className="mt-6"
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}
