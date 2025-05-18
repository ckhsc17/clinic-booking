"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import PatientSearch from "@/components/PatientSearch";
import ScheduleTable from "@/components/ScheduleTable";
import AddPatientModal from "@/components/AddPatientModal";
import ReservationTable from "@/components/ReservationTable";
import { patientHistory, reservationRequests } from "@/lib/mockdata";

type Patient = {
  id: number;
  name: string;
  lastVisit: string;
  condition: string;
  notes: string;
};

type Reservation = {
  id: number;
  patientName: string;
  type: "Consultation" | "Appointment" | "Operation";
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Rejected";
};

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>(patientHistory || []);
  const [searchResults, setSearchResults] = useState<Patient[]>(patients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>(reservationRequests || []);

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

  const handleReservationAction = (id: number, action: "confirm" | "reject") => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, status: action === "confirm" ? "Confirmed" : "Rejected" } : res
    ));
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
        <main className="p-6 relative">
          {successMessage && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fade">
              {successMessage}
            </div>
          )}
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Clinic Admin Dashboard</h1>

          {/* Patient Search Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Patient History</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Patient
              </button>
            </div>
            <PatientSearch patients={patients} onSearch={handleSearchResults} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults?.length > 0 ? (
                searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-gray-600">Last Visit: {patient.lastVisit}</p>
                    <p className="text-gray-600">Condition: {patient.condition}</p>
                    <p className="text-gray-500 text-sm mt-2">{patient.notes}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No patients found.</p>
              )}
            </div>
          </section>

          {/* Today's Operations Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Today's Operations</h2>
            <ScheduleTable />
          </section>

          {/* Reservation Requests Section */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Reservation Requests</h2>
            <ReservationTable reservations={reservations} onAction={handleReservationAction} />
          </section>
        </main>
      </div>
      {isModalOpen && (
        <AddPatientModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPatient={addPatient}
        />
      )}
    </div>
  );
}