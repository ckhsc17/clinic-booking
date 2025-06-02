"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

type Appointment = {
  id: number;
  patientName: string;
  type: string;
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rescheduleId, setRescheduleId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  // Handle confirm, deny, cancel, reschedule actions
  const handleAction = async (
    id: number,
    action: "confirm" | "deny" | "cancel" | "reschedule",
    newDateTime?: { date: string; time: string }
  ) => {
    try {
      let endpoint = "";
      let method = "POST";
      let body = null;

      if (action === "confirm") {
        endpoint = `http://localhost:8000/api/appointments/${id}/confirm`;
      } else if (action === "deny") {
        endpoint = `http://localhost:8000/api/appointments/${id}/deny`;
      } else if (action === "cancel") {
        endpoint = `http://localhost:8000/api/appointments/${id}/cancel`;
      } else if (action === "reschedule" && newDateTime) {
        endpoint = `http://localhost:8000/api/appointments/${id}/reschedule`;
        body = JSON.stringify(newDateTime);
      }

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} appointment`);
      }

      // Refresh appointments
      const updatedResponse = await fetch("http://localhost:8000/api/appointments");
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setAppointments(updatedData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

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
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {/* Create Appointment Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Appointment</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const appointment = {
                  patient_id: formData.get("patient_id"),
                  doctor_id: parseInt(formData.get("doctor_id") as string),
                  treatment_id: parseInt(formData.get("treatment_id") as string),
                  appointment_time: `${formData.get("date")}T${formData.get("time")}:00Z`,
                  status: "Pending",
                  notes: formData.get("notes") || null,
                };
                try {
                  const response = await fetch("http://localhost:8000/api/create_appointments", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(appointment),
                  });
                  if (!response.ok) {
                    throw new Error("Failed to create appointment");
                  }
                  // Refresh appointments
                  const updatedResponse = await fetch("http://localhost:8000/api/appointments");
                  if (updatedResponse.ok) {
                    setAppointments(await updatedResponse.json());
                  }
                } catch (err) {
                  setError(err.message);
                }
              }}
              className="flex flex-col space-y-4 max-w-md"
            >
              <input name="patient_id" placeholder="Patient ID" className="border p-2 rounded" required />
              <input name="doctor_id" type="number" placeholder="Doctor ID" className="border p-2 rounded" required />
              <input name="treatment_id" type="number" placeholder="Treatment ID" className="border p-2 rounded" required />
              <input name="date" type="date" className="border p-2 rounded" required />
              <input name="time" type="time" className="border p-2 rounded" required />
              <textarea name="notes" placeholder="Notes" className="border p-2 rounded"></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
              >
                Create Appointment
              </button>
            </form>
          </div>
          {/* Appointment Table */}
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