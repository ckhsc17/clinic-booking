"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type Appointment = {
  date: string;
  doctor: string;
  reason: string;
};

type Patient = {
  id: number;
  name: string;
  role: "Normal" | "VIP";
  gender: "Male" | "Female" | "Other";
  lastVisit: string;
  phoneNumber: string;
  email: string;
  birthdate: string;
  appointments: Appointment[];
};

export default function PatientProfile() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const data = searchParams.get("data");
  const patient: Patient = data ? JSON.parse(data) : null;
  console.log(patient);

  //const patient = patients.find((p) => p.id === Number(id));
  const isAdmin = true; // Simulated admin check; adjust based on your auth logic
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: patient?.phoneNumber || "",
    email: patient?.email || "",
    birthdate: patient?.birthdate || "",
    role: patient?.role || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      phoneNumber: patient?.phoneNumber || "",
      email: patient?.email || "",
      birthdate: patient?.birthdate || "",
      role: patient?.role || "",
    });
  };


  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/patients/update_info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: patient.id,
          name: patient.name,
          phone: formData.phoneNumber,
          email: formData.email,
          birthdate: formData.birthdate,
          role: formData.role,
        }),
      });

      if (!res.ok) throw new Error("Failed to update patient info");
      const result = await res.json();
      alert(result.message);
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Update failed.");
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient Not Found</h1>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{patient.name}'s Profile</h1>
            <button
              onClick={() => router.push("/patients")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
            >
              Back to Patients
            </button>
          </div>

          {/* Patient Information */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Patient ID</p>
                <p className="text-lg">{patient.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Phone Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange(e, "phoneNumber")}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-lg">{patient.phoneNumber}</p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-lg">{patient.email}</p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Birthdate</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => handleInputChange(e, "birthdate")}
                    className="border p-2 rounded w-full"
                    min="1900-01-01"
                    max="2025-05-18"
                  />
                ) : (
                  <p className="text-lg">{patient.birthdate}</p>
                )}
              </div>
              <div>
                <p className="text-gray-600">Last Visit</p>
                <p className="text-lg">{patient.lastVisit ? patient.lastVisit : "No Visits Yet"}</p>
              </div>
              <div>
                <p className="text-gray-600">Role</p>
                <p className="text-lg">{patient.role}</p>
              </div>
            </div>
            {isAdmin && (
              <div className="mt-4">
                {isEditing ? (
                  <div className="flex space-x-2">
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
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Appointment History */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Appointment History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Doctor</th>
                    <th className="py-3 px-6 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.appointments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-3 px-6 text-center">No appointments yet</td>
                    </tr>
                  ) : (
                    patient.appointments.map((appointment, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6">{appointment.date}</td>
                        <td className="py-3 px-6">{appointment.doctor}</td>
                        <td className="py-3 px-6">{appointment.reason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}