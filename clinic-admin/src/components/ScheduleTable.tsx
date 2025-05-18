"use client";

import { useState } from "react";

type Schedule = {
  id: number;
  doctor: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, doctor: "Dr. Alice Thompson", date: "2025-05-17", time: "09:00 AM", status: "Completed" },
    { id: 2, doctor: "Dr. Mark Evans", date: "2025-05-17", time: "02:00 PM", status: "Completed" },
    { id: 3, doctor: "Dr. Susan Patel", date: "2025-05-17", time: "04:00 PM", status: "Scheduled" },
    { id: 4, doctor: "Dr. Robert Kim", date: "2025-05-18", time: "10:00 AM", status: "Scheduled" },
    { id: 5, doctor: "Dr. Linda Hayes", date: "2025-05-18", time: "01:30 PM", status: "Scheduled" },
    { id: 6, doctor: "Dr. Alice Thompson", date: "2025-05-16", time: "11:00 AM", status: "Cancelled" },
  ]);

  const updateStatus = (id: number, newStatus: Schedule["status"]) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { ...schedule, status: newStatus } : schedule
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Doctor</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.length > 0 ? (
            schedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{schedule.doctor}</td>
                <td className="py-2 px-4 border-b">{schedule.date}</td>
                <td className="py-2 px-4 border-b">{schedule.time}</td>
                <td className="py-2 px-4 border-b">{schedule.status}</td>
                <td className="py-2 px-4 border-b">
                  {schedule.status === "Scheduled" && (
                    <button
                      onClick={() => updateStatus(schedule.id, "Completed")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                      Mark Completed
                    </button>
                  )}
                  {schedule.status === "Completed" && (
                    <span className="text-green-600">Completed</span>
                  )}
                  {schedule.status === "Cancelled" && (
                    <span className="text-red-600">Cancelled</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-2 px-4 text-center text-gray-500">
                No schedules available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}