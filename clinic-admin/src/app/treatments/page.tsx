"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";

type Treatment = {
  id: number;
  treatmentName: string;
  patientName: string;
  doctorName: string;
  date: string;
  medications: { drug: string; usage: string }[];
};

export default function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/treatments");
        if (!res.ok) throw new Error("Failed to fetch treatments");
        const data: Treatment[] = await res.json();
        console.log(data);
        setTreatments(data);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      }
    };

    fetchTreatments();
  }, []);

  const [editTreatmentId, setEditTreatmentId] = useState<number | null>(null);
  const [newMedication, setNewMedication] = useState<{ drug: string; usage: string }>({ drug: "", usage: "" });
  const [editedMedications, setEditedMedications] = useState<Record<number, { drug: string; usage: string }[]>>({});

  const handleEdit = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({
      [id]: [...(treatments.find(t => t.id === id)!.medications)],
    });
  };

  const handleAddMedication = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({
      [id]: [...(editedMedications[id] || treatments.find(t => t.id === id)!.medications)],
    });
    setNewMedication({ drug: "", usage: "" });
  };

  const handleSave = (id: number) => {
    setTreatments(treatments.map(t =>
      t.id === id ? { ...t, medications: editedMedications[id] || t.medications } : t
    ));
    setEditTreatmentId(null);
  };

  const handleCancel = () => {
    setEditTreatmentId(null);
    setNewMedication({ drug: "", usage: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: "drug" | "usage") => {
    setNewMedication({ ...newMedication, [field]: e.target.value });
  };

  const handleMedicationChange = (index: number, field: "drug" | "usage", value: string, id: number) => {
    const updated = (editedMedications[id] || []).map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setEditedMedications({ ...editedMedications, [id]: updated });
  };

  const addNewMedication = (id: number) => {
    if (newMedication.drug && newMedication.usage) {
      const updated = [...(editedMedications[id] || treatments.find(t => t.id === id)!.medications), newMedication];
      setEditedMedications({ ...editedMedications, [id]: updated });
      setNewMedication({ drug: "", usage: "" });
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
                  <th className="py-2 px-4 border-b">Treatment Name</th>
                  <th className="py-2 px-4 border-b">Patient Name</th>
                  <th className="py-2 px-4 border-b">Doctor Name</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Drug</th>
                  <th className="py-2 px-4 border-b">Usage</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.length > 0 ? treatments.map(treatment =>
                  treatment.medications.map((med, idx) => (
                    <tr key={`${treatment.id}-${idx}`} className="hover:bg-gray-100">
                      {idx === 0 && (
                        <>
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.id}</td>
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.treatmentName}</td>
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.patientName}</td>
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.doctorName}</td>
                          <td rowSpan={treatment.medications.length} className="py-2 px-4 border-b">{treatment.date}</td>
                        </>
                      )}
                      <td className="py-2 px-4 border-b">{med.drug}</td>
                      <td className="py-2 px-4 border-b">{med.usage}</td>
                      {idx === 0 && (
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
                ) : (
                  <tr>
                    <td colSpan={8} className="py-2 px-4 text-center text-gray-500">
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
                  {/* 已有藥品 */}
                  {(editedMedications[editTreatmentId] || []).map((med, idx) => (
                    <div key={idx} className="flex space-x-2">
                      <input
                        type="text"
                        value={med.drug}
                        onChange={e => handleMedicationChange(idx, "drug", e.target.value, editTreatmentId!)}
                        className="border p-2 rounded w-1/2"
                        placeholder="Drug"
                      />
                      <input
                        type="text"
                        value={med.usage}
                        onChange={e => handleMedicationChange(idx, "usage", e.target.value, editTreatmentId!)}
                        className="border p-2 rounded w-1/2"
                        placeholder="Usage"
                      />
                    </div>
                  ))}

                  {/* 新增藥品 */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMedication.drug}
                      onChange={e => handleInputChange(e, "drug")}
                      className="border p-2 rounded w-1/2"
                      placeholder="New Drug"
                    />
                    <input
                      type="text"
                      value={newMedication.usage}
                      onChange={e => handleInputChange(e, "usage")}
                      className="border p-2 rounded w-1/2"
                      placeholder="New Usage"
                    />
                    <button
                      onClick={() => addNewMedication(editTreatmentId!)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                    >
                      Add
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
