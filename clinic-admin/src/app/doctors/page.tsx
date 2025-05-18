"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

type Doctor = {
  id: number;
  name: string;
};

export default function Doctors() {
  const doctors: Doctor[] = [
    { id: 1, name: "Dr. Alice Thompson" },
    { id: 2, name: "Dr. Mark Evans" },
    { id: 3, name: "Dr. Linda Hayes" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctors</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Doctor Name</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <tr key={doctor.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{doctor.name}</td>
                      <td className="py-2 px-4 border-b">
                        <Link
                          href={`/doctors/${doctor.id}`}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                          View Schedule
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 px-4 text-center text-gray-500">
                      No doctors available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}