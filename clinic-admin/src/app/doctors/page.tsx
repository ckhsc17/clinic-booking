"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type Doctor = {
  id: number;
  name: string;
  availableTimes: { date: string; time: string }[];
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      name: "Dr. Alice Thompson",
      availableTimes: [
        { date: "2025-05-18", time: "09:00 AM" },
        { date: "2025-05-19", time: "10:00 AM" },
      ],
    },
    {
      id: 2,
      name: "Dr. Mark Evans",
      availableTimes: [
        { date: "2025-05-18", time: "02:00 PM" },
        { date: "2025-05-20", time: "01:00 PM" },
      ],
    },
  ]);

  const [newTime, setNewTime] = useState({ doctorId: 0, date: "", time: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTime = (doctorId: number) => {
    setNewTime({ doctorId, date: "", time: "" });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (newTime.date && newTime.time) {
      setDoctors(doctors.map(doctor =>
        doctor.id === newTime.doctorId
          ? { ...doctor, availableTimes: [...doctor.availableTimes, { date: newTime.date, time: newTime.time }] }
          : doctor
      ));
      setIsModalOpen(false);
      setNewTime({ doctorId: 0, date: "", time: "" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewTime({ doctorId: 0, date: "", time: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewTime({ ...newTime, [field]: e.target.value });
  };

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
                  <th className="py-2 px-4 border-b">Available Times</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.length > 0 ? (
                  doctors.map((doctor) =>
                    doctor.availableTimes.map((timeSlot, index) => (
                      <tr key={`${doctor.id}-${index}`} className="hover:bg-gray-100">
                        {index === 0 && (
                          <>
                            <td rowSpan={doctor.availableTimes.length} className="py-2 px-4 border-b">{doctor.name}</td>
                            <td className="py-2 px-4 border-b">{`${timeSlot.date} ${timeSlot.time}`}</td>
                            {index === 0 && (
                              <td rowSpan={doctor.availableTimes.length} className="py-2 px-4 border-b">
                                <button
                                  onClick={() => handleAddTime(doctor.id)}
                                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                                >
                                  Add Time
                                </button>
                              </td>
                            )}
                          </>
                        )}
                        {index > 0 && <td className="py-2 px-4 border-b">{`${timeSlot.date} ${timeSlot.time}`}</td>}
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-center text-gray-500">
                      No doctors available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Add Available Time</h2>
                <div className="space-y-4">
                  <input
                    type="date"
                    value={newTime.date}
                    onChange={(e) => handleInputChange(e, "date")}
                    className="border p-2 rounded w-full"
                    placeholder="Date"
                  />
                  <input
                    type="time"
                    value={newTime.time}
                    onChange={(e) => handleInputChange(e, "time")}
                    className="border p-2 rounded w-full"
                    placeholder="Time"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}