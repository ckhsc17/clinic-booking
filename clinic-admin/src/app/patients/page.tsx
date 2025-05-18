"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PatientSearch from "@/components/PatientSearch";
import AddPatientModal from "@/components/AddPatientModal";
import { patientHistory } from "@/lib/mockdata";

type Patient = {
  id: number;
  name: string;
  lastVisit: string;
  condition: string;
  notes: string;
};

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(patientHistory || []);
  const [searchResults, setSearchResults] = useState<Patient[]>(patients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSearchResults = (results: Patient[]) => {
    setSearchResults(results || patients);
  };

  const addPatient = (newPatient: { name: string; notes: string }) => {
    const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1;
    const patientWithId: Patient = {
      id: newId,
      name: newPatient.name,
      lastVisit: "",
      condition: "",
      notes: newPatient.notes,
    };
    const updatedPatients = [...patients, patientWithId];
    setPatients(updatedPatients);
    setSearchResults(updatedPatients);
    setIsModalOpen(false);
    setSuccessMessage("Successfully added patient!");
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Patients</h1>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Patient List</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Patient
              </button>
            </div>
            <PatientSearch patients={patients} onSearch={handleSearchResults} />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Last Visit</th>
                  <th className="py-2 px-4 border-b">Condition</th>
                  <th className="py-2 px-4 border-b">Notes</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{patient.name}</td>
                      <td className="py-2 px-4 border-b">{patient.lastVisit || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{patient.condition || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{patient.notes || "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-2 px-4 text-center text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {successMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade">
              {successMessage}
            </div>
          )}
          {isModalOpen && (
            <AddPatientModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddPatient={addPatient}
            />
          )}
        </main>
      </div>
    </div>
  );
}