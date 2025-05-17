"use client";

import { useState } from "react";
import { doctorSchedules } from "@/lib/mockdata";

type Schedule = {
  id: number;
  doctor: string;
  date: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState<Schedule[]>(doctorSchedules || []);

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
          {schedules.map((schedule) => (
            <tr key={schedule.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{schedule.doctor}</td>
              <td className="py-2 px-4 border-b">{schedule.date}</td>
              <td className="py-2 px-4 border-b">{schedule.time}</td>
              <td className="py-2 px-4 border-b">{schedule.status}</td>
              <td className="py-2 px-4 border-b">
                {schedule.status === "Scheduled" && (
                  <button
                    onClick={() => updateStatus(schedule.id, "Completed")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
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
          ))}
        </tbody>
      </table>
    </div>
  );
}