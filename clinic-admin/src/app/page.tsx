"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleAdminYes = () => {
    router.push("/dashboard");
  };

  const handleAdminNo = () => {
    setMessage("Access denied. Only admins can enter the system.");
    setTimeout(() => {
      window.location.href = "https://youtube.com"; // Replace with desired URL or remove
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-bg">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Clinic Logo"
            width={150}
            height={50}
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center text-cyan-700">Clinic Admin Login</h1>
        <p className="text-center mb-6 text-gray-600">是否為愛惟美診所授權操作人員？</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAdminYes}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Yes
          </button>
          <button
            onClick={handleAdminNo}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            No
          </button>
        </div>
        {message && (
          <p className="mt-6 text-center text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}