"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { reservationRequests } from "@/lib/mockdata";

type Appointment = {
  id: number;
  patientName: string;
  type: "Consultation" | "Appointment" | "Operation";
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    ...reservationRequests,
    { id: 4, patientName: "Sarah Wilson", type: "Appointment", date: "2025-05-18", time: "11:00 AM", status: "Completed" },
    { id: 5, patientName: "David Lee", type: "Consultation", date: "2025-05-17", time: "03:00 PM", status: "Cancelled" },
  ]);

  const handleAction = (id: number, action: "confirm" | "deny" | "cancel" | "reschedule", newDateTime?: { date: string; time: string }) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id
          ? {
              ...appt,
              status:
                action === "confirm"
                  ? "Confirmed"
                  : action === "deny"
                  ? "Cancelled"
                  : action === "cancel"
                  ? "Cancelled"
                  : appt.status,
              ...(newDateTime && { date: newDateTime.date, time: newDateTime.time }),
            }
          : appt
      )
    );
  };

  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const handleReschedule = (id: number) => {
    setRescheduleId(id);
  };

  const confirmReschedule = (id: number) => {
    if (newDate && newTime) {
      handleAction(id, "reschedule", { date: newDate, time: newTime });
      setRescheduleId(null);
      setNewDate("");
      setNewTime("");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Appointments</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Patient Name</th>
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Time</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{appointment.patientName}</td>
                      <td className="py-2 px-4 border-b">{appointment.type}</td>
                      <td className="py-2 px-4 border-b">{appointment.date}</td>
                      <td className="py-2 px-4 border-b">{appointment.time}</td>
                      <td className="py-2 px-4 border-b">
                        {appointment.status === "Confirmed" && (
                          <span className="text-green-600 font-medium">Confirmed</span>
                        )}
                        {appointment.status === "Completed" && (
                          <span className="text-green-600 font-medium">Completed</span>
                        )}
                        {appointment.status === "Cancelled" && (
                          <span className="text-red-600 font-medium">Cancelled</span>
                        )}
                        {appointment.status === "Pending" && (
                          <span className="text-yellow-600 font-medium">Pending</span>
                        )}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {appointment.status === "Pending" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAction(appointment.id, "confirm")}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleAction(appointment.id, "deny")}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                            >
                              Deny
                            </button>
                            <button
                              onClick={() => handleReschedule(appointment.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                        {appointment.status === "Confirmed" && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAction(appointment.id, "cancel")}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReschedule(appointment.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                            >
                              Reschedule
                            </button>
                          </div>
                        )}
                        {(appointment.status === "Completed" || appointment.status === "Cancelled") && (
                          <span className="text-gray-600">No actions available</span>
                        )}
                        {rescheduleId === appointment.id && (
                          <div className="mt-2 flex space-x-2">
                            <input
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                              className="border p-1 rounded"
                            />
                            <input
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                              className="border p-1 rounded"
                            />
                            <button
                              onClick={() => confirmReschedule(appointment.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setRescheduleId(null)}
                              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-2 px-4 text-center text-gray-500">
                      No appointments available.
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