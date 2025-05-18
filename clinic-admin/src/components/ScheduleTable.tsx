"use client";

import { useState } from "react";

type Schedule = {
  id: number;
  doctor: string;
  patientName: string;
  date: string;
  time: string;
  task: "Consultance" | "Appointment" | "Procedure";
  status: "Scheduled" | "Completed" | "Cancelled";
};

export default function ScheduleTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: 1, doctor: "Dr. Alice Thompson", patientName: "John Doe", date: "2025-05-18", time: "10:00 AM", task: "Consultance", status: "Scheduled" },
    { id: 2, doctor: "Dr. Linda Hayes", patientName: "Emily Carter", date: "2025-05-18", time: "01:30 PM", task: "Procedure", status: "Scheduled" },
  ]);

  const updateStatus = (id: number, newStatus: Schedule["status"]) => {
    setSchedules(schedules.map(schedule =>
      schedule.id === id ? { ...schedule, status: newStatus } : schedule
    ));
  };

  // Filter for today's date (May 18, 2025)
  const todaySchedules = schedules.filter(schedule => schedule.date === "2025-05-18");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Doctor</th>
            <th className="py-2 px-4 border-b">Patient Name</th>
            <th className="py-2 px-4 border-b">Task</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todaySchedules.length > 0 ? (
            todaySchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{schedule.doctor}</td>
                <td className="py-2 px-4 border-b">{schedule.patientName}</td>
                <td className="py-2 px-4 border-b">{schedule.task}</td>
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
              <td colSpan={6} className="py-2 px-4 text-center text-gray-500">
                No operations scheduled for today.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}