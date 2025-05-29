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

// 1. 把 medicines 寫死在前端
const MEDICINES = [
  { id: 1, name: "人員藥品", amount: "10ml" },
  { id: 2, name: "行業藥品", amount: "15ml" },
  { id: 3, name: "系統藥品", amount: "20ml" },
  { id: 4, name: "重要藥品", amount: "1ml" },
  { id: 5, name: "提供藥品", amount: "500mg" },
];

export default function Treatments() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [editTreatmentId, setEditTreatmentId] = useState<number | null>(null);
  // 注意：medications 現在只保留 drug/name 與 usage
  const [editedMedications, setEditedMedications] = useState<
    Record<number, { drug: string; usage: string }[]>
  >({});
  // 新增藥品只要選藥名稱，usage 預設用 MEDICINES 裡的 amount
  const [newMedication, setNewMedication] = useState<{ drug: string; usage: string }>({
    drug: "",
    usage: "",
  });

  useEffect(() => {
    // 這裡保持你原本的 fetch
    fetch("http://localhost:8000/api/treatments")
      .then((r) => r.json())
      .then((data: Treatment[]) => setTreatments(data))
      .catch(console.error);
  }, []);

  const handleEdit = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({
      [id]: [...(treatments.find((t) => t.id === id)!.medications)],
    });
  };

  const handleAddMedication = (id: number) => {
    setEditTreatmentId(id);
    setEditedMedications({
      [id]: [...(editedMedications[id] || treatments.find((t) => t.id === id)!.medications)],
    });
    setNewMedication({ drug: "", usage: "" });
  };

  const handleMedicationChange = (
    index: number,
    field: "drug" | "usage",
    value: string,
    id: number
  ) => {
    const updated = (editedMedications[id] || []).map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    setEditedMedications({ ...editedMedications, [id]: updated });
  };

  const addNewMedication = (id: number) => {
    if (!newMedication.drug) return;
    // 找到 amount
    const found = MEDICINES.find((m) => m.name === newMedication.drug);
    const usage = found ? found.amount : "";
    const updated = [
      ...(editedMedications[id] || treatments.find((t) => t.id === id)!.medications),
      { drug: newMedication.drug, usage },
    ];
    setEditedMedications({ ...editedMedications, [id]: updated });
    setNewMedication({ drug: "", usage: "" });
  };

  const handleSave = (id: number) => {
    setTreatments((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, medications: editedMedications[id] || t.medications } : t
      )
    );
    setEditTreatmentId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>, field: "drug") => {
    setNewMedication({ drug: e.target.value, usage: "" });
  };

  const handleCancel = () => {
    setEditTreatmentId(null);
    setNewMedication({ drug: "", usage: "" });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-3xl font-bold mb-8">Treatments</h1>
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Patient</th>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Drug</th>
                <th className="px-4 py-2">Usage</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {treatments.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    No treatments
                  </td>
                </tr>
              )}
              {treatments.map((t) => {
                const meds = t.medications.length
                  ? t.medications
                  : [{ drug: "", usage: "" }];
                return meds.map((med, idx) => (
                  <tr key={`${t.id}-${idx}`} className="hover:bg-gray-50">
                    {idx === 0 && (
                      <>
                        <td rowSpan={meds.length} className="border px-2 py-1">
                          {t.id}
                        </td>
                        <td rowSpan={meds.length} className="border px-2 py-1">
                          {t.treatmentName}
                        </td>
                        <td rowSpan={meds.length} className="border px-2 py-1">
                          {t.patientName}
                        </td>
                        <td rowSpan={meds.length} className="border px-2 py-1">
                          {t.doctorName}
                        </td>
                        <td rowSpan={meds.length} className="border px-2 py-1">
                          {new Date(t.date).toLocaleString()}
                        </td>
                      </>
                    )}
                    <td className="border px-2 py-1">{med.drug}</td>
                    <td className="border px-2 py-1">{med.usage}</td>
                    {idx === 0 && (
                      <td rowSpan={meds.length} className="border px-2 py-1">
                        <button
                          onClick={() => handleEdit(t.id)}
                          className="mr-2 px-2 py-1 bg-blue-600 text-white rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAddMedication(t.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                        >
                          Add
                        </button>
                      </td>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>

        {/* 編輯 / 新增 Modal */}
        {editTreatmentId !== null && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">
              <h2 className="text-xl font-semibold">Edit / Add Medications</h2>

              {/* 既有藥品 */}
              {(editedMedications[editTreatmentId] || []).map((med, i) => (
                <div key={i} className="flex space-x-2">
                  <select
                    value={med.drug}
                    onChange={(e) => handleMedicationChange(i, "drug", e.target.value, editTreatmentId)}
                    className="flex-1 border p-2 rounded"
                  >
                    <option value="">Select drug</option>
                    {MEDICINES.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.amount})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={med.usage}
                    onChange={(e) => handleMedicationChange(i, "usage", e.target.value, editTreatmentId)}
                    className="flex-1 border p-2 rounded"
                    placeholder="Usage"
                  />
                </div>
              ))}

              {/* 新增區塊 */}
              <div className="flex space-x-2">
                <select
                  value={newMedication.drug}
                  onChange={(e) => handleInputChange(e as any, "drug")}
                  className="flex-1 border p-2 rounded"
                >
                  <option value="">Select drug</option>
                  {MEDICINES.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name} ({m.amount})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => addNewMedication(editTreatmentId)}
                  className="px-3 bg-green-600 text-white rounded"
                >
                  + Add
                </button>
              </div>

              {/* Control */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleSave(editTreatmentId)}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
