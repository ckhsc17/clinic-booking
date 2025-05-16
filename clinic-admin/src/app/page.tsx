"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Clinic Admin Login</h1>
        <p className="text-center mb-6 text-gray-600">Are you an admin?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleAdminYes}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
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