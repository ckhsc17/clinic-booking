"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

type Treatment = {
  id: number;
  patientName: string;
  patientId: number;
  doctorName: string;
  doctorId: number;
  date: string;
  medications: { drug: string; drugId: number; usage: string }[];
};

export default function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([
    {
      id: 1,
      patientName: "John Doe",
      patientId: 1,
      doctorName: "Dr. Alice Thompson",
      doctorId: 1,
      date: "2025-05-18",
      medications: [
        { drug: "Aspirin", drugId: 101, usage: "500 mg" },
        { drug: "Paracetamol", drugId: 102, usage: "1000 mg" },
      ],
    },
    {
      id: 2,
      patientName: "Emily Carter",
      patientId: 2,
      doctorName: "Dr. Mark Evans",
      doctorId: 2,
      date: "2025-05-17",
      medications: [{ drug: "Ibuprofen", drugId: 103, usage: "400 mg" }],
    },
  ]);

  const [editTreatmentId, setEditTreatmentId] = useState<number | null>(null);
  const [newMedication, setNewMedication] = useState({ drug: "", drugId: 0, usage: "" });
  const [editedMedications, setEditedMedications] = useState<{ [key: number]: { drug: string; drugId: number; usage: string }[] }>({});

  const handleEdit = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({ [id]: [...treatments.find(t => t.id === id)!.medications] });
  };

  const handleAddMedication = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({ [id]: [...(editedMedications[id] || treatments.find(t => t.id === id)!.medications)] });
    setNewMedication({ drug: "", drugId: 0, usage: "" });
  };

  const handleSave = (id: number) => {
    setTreatments(treatments.map(t =>
      t.id === id ? { ...t, medications: editedMedications[id] || t.medications } : t
    ));
    setEditTreatmentId(null);
  };

  const handleCancel = () => {
    setEditTreatmentId(null);
    setNewMedication({ drug: "", drugId: 0, usage: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewMedication({ ...newMedication, [field]: e.target.value });
  };

  const handleMedicationChange = (index: number, field: string, value: string, id: number) => {
    const updatedMeds = editedMedications[id]?.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    ) || [];
    setEditedMedications({ ...editedMedications, [id]: updatedMeds });
  };

  const addNewMedication = (id: number) => {
    if (newMedication.drug && newMedication.usage) {
      const updatedMeds = [...(editedMedications[id] || treatments.find(t => t.id === id)!.medications), newMedication];
      setEditedMedications({ ...editedMedications, [id]: updatedMeds });
      setNewMedication({ drug: "", drugId: 0, usage: "" });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Treatments</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 border-b">Treatment ID</th>
                  <th className="py-2 px-4 border-b">Patient Name</th>
                  <th className="py-2 px-4 border-b">Patient ID</th>
                  <th className="py-2 px-4 border-b">Doctor Name</th>
                  <th className="py-2 px-4 border-b">Doctor ID</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Drug</th>
                  <th className="py-2 px-4 border-b">Drug ID</th>
                  <th className="py-2 px-4 border-b">Usage (mg/ml)</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length > 0 ? (
                  treatments.map((treatment) =>
                    treatment.medications.map((med, index) => (
                      <tr key={`${treatment.id}-${index}`} className="hover:bg-gray-100">
                        {index === 0 && (
                          <>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.id}</td>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.patientName}</td>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.patientId}</td>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.doctorName}</td>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.doctorId}</td>
                            <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.date}</td>
                          </>
                        )}
                        <td className="py-2 px-4 border-b">{med.drug}</td>
                        <td className="py-2 px-4 border-b">{med.drugId}</td>
                        <td className="py-2 px-4 border-b">{med.usage}</td>
                        {index === 0 && (
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">
                            <button
                              onClick={() => handleEdit(treatment.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 mr-2 transition duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAddMedication(treatment.id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                            >
                              Add
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )
                ) : (
                  <tr>
                    <td colSpan={10} className="py-2 px-4 text-center text-gray-500">
                      No treatments available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {editTreatmentId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Edit/Add Medications</h2>
                <div className="space-y-4">
                  {(editedMedications[editTreatmentId] || []).map((med, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={med.drug}
                        onChange={(e) => handleMedicationChange(index, "drug", e.target.value, editTreatmentId!)}
                        className="border p-2 rounded w-1/3"
                        placeholder="Drug"
                      />
                      <input
                        type="number"
                        value={med.drugId}
                        onChange={(e) => handleMedicationChange(index, "drugId", e.target.value, editTreatmentId!)}
                        className="border p-2 rounded w-1/6"
                        placeholder="Drug ID"
                      />
                      <input
                        type="text"
                        value={med.usage}
                        onChange={(e) => handleMedicationChange(index, "usage", e.target.value, editTreatmentId!)}
                        className="border p-2 rounded w-1/3"
                        placeholder="Usage (mg/ml)"
                      />
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMedication.drug}
                      onChange={(e) => handleInputChange(e, "drug")}
                      className="border p-2 rounded w-1/3"
                      placeholder="New Drug"
                    />
                    <input
                      type="number"
                      value={newMedication.drugId}
                      onChange={(e) => handleInputChange(e, "drugId")}
                      className="border p-2 rounded w-1/6"
                      placeholder="New Drug ID"
                    />
                    <input
                      type="text"
                      value={newMedication.usage}
                      onChange={(e) => handleInputChange(e, "usage")}
                      className="border p-2 rounded w-1/3"
                      placeholder="New Usage (mg/ml)"
                    />
                    <button
                      onClick={() => addNewMedication(editTreatmentId!)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                      Add Medication
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleSave(editTreatmentId!)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
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