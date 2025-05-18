"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import PatientSearch from "@/components/PatientSearch";

type Patient = {
  id: number;
  name: string;
  role: "Normal" | "VIP";
  gender: "Male" | "Female" | "Other";
  lastVisit: string;
};

const patients: Patient[] = [
  { id: 1, name: "John Doe", role: "Normal", gender: "Male", lastVisit: "2025-05-18" },
  { id: 2, name: "Jane Smith", role: "VIP", gender: "Female", lastVisit: "2025-05-17" },
  { id: 3, name: "Alex Johnson", role: "Normal", gender: "Other", lastVisit: "2025-05-16" },
];

export default function PatientsPage() {
  const router = useRouter();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  const handlePatientClick = (id: number) => {
    router.push(`/patients/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Patients</h1>
          <PatientSearch patients={patients} onSearch={setFilteredPatients} />
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Patient ID</th>
                  <th className="py-3 px-6 text-left">Role</th>
                  <th className="py-3 px-6 text-left">Gender</th>
                  <th className="py-3 px-6 text-left">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td
                      className="py-3 px-6 text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      {patient.name}
                    </td>
                    <td className="py-3 px-6">{patient.id}</td>
                    <td className="py-3 px-6">{patient.role}</td>
                    <td className="py-3 px-6">{patient.gender}</td>
                    <td className="py-3 px-6">{patient.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}