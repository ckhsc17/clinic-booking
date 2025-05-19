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
  phoneNumber: string;
  email: string;
  birthdate: string;
  appointments: { date: string; doctor: string; reason: string }[];
};

const initialPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Normal",
    gender: "Male",
    lastVisit: "2025-05-18",
    phoneNumber: "123-456-7890",
    email: "john.doe@example.com",
    birthdate: "1990-01-15",
    appointments: [
      { date: "2025-05-18", doctor: "Dr. Alice Thompson", reason: "Routine Checkup" },
      { date: "2025-05-10", doctor: "Dr. Mark Evans", reason: "Flu Symptoms" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "VIP",
    gender: "Female",
    lastVisit: "2025-05-17",
    phoneNumber: "234-567-8901",
    email: "jane.smith@example.com",
    birthdate: "1985-03-22",
    appointments: [
      { date: "2025-05-17", doctor: "Dr. Linda Hayes", reason: "Annual Physical" },
    ],
  },
  {
    id: 3,
    name: "Alex Johnson",
    role: "Normal",
    gender: "Other",
    lastVisit: "2025-05-16",
    phoneNumber: "345-678-9012",
    email: "alex.johnson@example.com",
    birthdate: "1995-07-30",
    appointments: [
      { date: "2025-05-16", doctor: "Dr. Alice Thompson", reason: "Allergy Testing" },
    ],
  },
];

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    id: 0,
    name: "",
    role: "Normal" as "Normal" | "VIP",
    gender: "Male" as "Male" | "Female" | "Other",
    lastVisit: "No Visits Yet",
    phoneNumber: "",
    email: "",
    birthdate: "",
    appointments: [] as { date: string; doctor: string; reason: string }[],
  });

  const handlePatientClick = (id: number) => {
    router.push(`/patients/${id}`);
  };

  const handleAddPatient = () => {
    setIsModalOpen(true);
    const nextId = Math.max(...patients.map(p => p.id), 0) + 1;
    setNewPatient({
      id: nextId,
      name: "",
      role: "Normal",
      gender: "Male",
      lastVisit: "No Visits Yet",
      phoneNumber: "",
      email: "",
      birthdate: "",
      appointments: [],
    });
  };

  const handleSaveNewPatient = () => {
    if (newPatient.name && newPatient.phoneNumber && newPatient.email && newPatient.birthdate) {
      const currentDate = new Date("2025-05-19T01:27:00-05:00"); // 01:27 AM CST, May 19, 2025
      const birthdateDate = new Date(newPatient.birthdate);
      if (birthdateDate >= currentDate) {
        alert("Birthdate must be in the past.");
        return;
      }
      const updatedPatients = [...patients, newPatient];
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
      setIsModalOpen(false);
    } else {
      alert("Please fill in all required fields (Name, Phone Number, Email, and Birthdate are mandatory).");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: string) => {
    const value = field === "role" || field === "gender" ? e.target.value as ("Normal" | "VIP" | "Male" | "Female" | "Other") : e.target.value;
    setNewPatient({ ...newPatient, [field]: value });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Patients</h1>
          <div className="mb-4 flex justify-between items-center">
            <PatientSearch patients={patients} onSearch={setFilteredPatients} />
            <button
              onClick={handleAddPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Add Patient
            </button>
          </div>
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
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className="border p-2 rounded w-full"
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    value={newPatient.id}
                    onChange={(e) => handleInputChange(e, "id")}
                    className="border p-2 rounded w-full"
                    placeholder="Patient ID"
                    disabled
                  />
                  <select
                    value={newPatient.role}
                    onChange={(e) => handleInputChange(e, "role")}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Normal">Normal</option>
                    <option value="VIP">VIP</option>
                  </select>
                  <select
                    value={newPatient.gender}
                    onChange={(e) => handleInputChange(e, "gender")}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="tel"
                    value={newPatient.phoneNumber}
                    onChange={(e) => handleInputChange(e, "phoneNumber")}
                    className="border p-2 rounded w-full"
                    placeholder="Phone Number"
                  />
                  <input
                    type="email"
                    value={newPatient.email}
                    onChange={(e) => handleInputChange(e, "email")}
                    className="border p-2 rounded w-full"
                    placeholder="Email Address"
                  />
                  <input
                    type="date"
                    value={newPatient.birthdate}
                    onChange={(e) => handleInputChange(e, "birthdate")}
                    className="border p-2 rounded w-full"
                    placeholder="Birthdate"
                    min="1900-01-01"
                    max="2025-05-18" // One day before current date
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={handleSaveNewPatient}
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