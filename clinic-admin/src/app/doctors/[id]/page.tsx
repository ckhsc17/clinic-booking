"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type TimeSlot = {
  date: string;
  time: string;
  available: boolean;
};

type Doctor = {
  id: number;
  name: string;
  availableTimes: TimeSlot[];
};

export default function DoctorSchedule() {
  const { id } = useParams();
  const router = useRouter();

  const doctors: Doctor[] = [
    { id: 1, name: "Dr. Alice Thompson", availableTimes: [] },
    { id: 2, name: "Dr. Mark Evans", availableTimes: [] },
    { id: 3, name: "Dr. Linda Hayes", availableTimes: [] },
  ];

  const doctor = doctors.find((d) => d.id === Number(id));
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!doctor) {
      setIsLoading(false);
      return;
    }
    const startDate = new Date("2025-05-19"); // Monday, May 19, 2025
    const endDate = new Date("2025-05-24"); // Saturday, May 24, 2025
    const times = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      for (let hour = 11; hour <= 20; hour++) {
        const time = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
        const dateStr = d.toISOString().split("T")[0];
        const slotDateTime = new Date(`${dateStr}T${time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
        const currentDateTime = new Date("2025-05-19T00:08:00-05:00"); // 12:08 AM CST, May 19, 2025
        times.push({
          date: dateStr,
          time: time,
          available: slotDateTime >= currentDateTime,
        });
      }
    }
    setAvailableTimes(times);
    setIsLoading(false);
  }, [doctor]);

  const isPastTime = (date: string, time: string): boolean => {
    const slotDateTime = new Date(`${date}T${time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
    const currentDateTime = new Date("2025-05-19T00:08:00-05:00");
    return slotDateTime < currentDateTime;
  };

  const handleEdit = (slot: TimeSlot) => {
    if (isPastTime(slot.date, slot.time)) return;
    setEditSlot({ ...slot });
    setIsModalOpen(true);
  };

  const handleAddNewSlot = () => {
    setEditSlot({ date: "", time: "", available: true });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editSlot && editSlot.date && editSlot.time) {
      const slotDateTime = new Date(`${editSlot.date}T${editSlot.time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
      const currentDateTime = new Date("2025-05-19T00:08:00-05:00");
      if (slotDateTime < currentDateTime) {
        alert("Cannot add or edit times in the past.");
        return;
      }
      if (editSlot.date === "" || editSlot.time === "") {
        // New slot being added
        setAvailableTimes([...availableTimes, { date: editSlot.date, time: editSlot.time, available: true }]);
      } else {
        // Editing existing slot
        setAvailableTimes(availableTimes.map((t) =>
          t.date === editSlot.date && t.time === editSlot.time
            ? { ...t, date: editSlot.date, time: editSlot.time, available: true }
            : t
        ));
      }
      setIsModalOpen(false);
      setEditSlot(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditSlot(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (editSlot) {
      setEditSlot({ ...editSlot, [field]: e.target.value });
    }
  };

  if (!doctor) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Doctor Not Found</h1>
          </main>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">{doctor.name}'s Schedule</h1>
            <p>Loading schedule...</p>
          </main>
        </div>
      </div>
    );
  }

  const days = [
    { name: "Monday", date: "2025-05-19" },
    { name: "Tuesday", date: "2025-05-20" },
    { name: "Wednesday", date: "2025-05-21" },
    { name: "Thursday", date: "2025-05-22" },
    { name: "Friday", date: "2025-05-23" },
    { name: "Saturday", date: "2025-05-24" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">{doctor.name}'s Schedule</h1>
            <button
              onClick={() => router.push("/doctors")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition duration-200"
            >
              Back to Doctors
            </button>
          </div>
          <div className="mb-4">
            <button
              onClick={handleAddNewSlot}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Add New Slot
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-4">
              <div className="col-span-1 font-bold text-center">Time</div>
              {days.map((day) => (
                <div key={day.name} className="col-span-1 font-bold text-center">
                  {day.name}<br/>{new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              ))}
              {["11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map((time) => (
                <>
                  <div key={time} className="col-span-1 text-center">{time}</div>
                  {days.map((day) => {
                    const slot = availableTimes.find((s) => s.time === time && s.date === day.date);
                    const isSlotPast = slot ? isPastTime(slot.date, slot.time) : false;
                    return (
                      <div
                        key={`${day.name}-${time}`}
                        className={`col-span-1 p-2 border rounded ${
                          slot && !isSlotPast ? "bg-green-100 hover:bg-opacity-80 cursor-pointer" : "bg-red-100"
                        }`}
                        onClick={() => slot && !isSlotPast && handleEdit(slot)}
                      >
                        {slot ? (isSlotPast ? "Past" : "Available") : "N/A"}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
          {isModalOpen && editSlot && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">
                  {editSlot.date === "" ? "Add New Time Slot" : "Edit Time Slot"}
                </h2>
                <div className="space-y-4">
                  <input
                    type="date"
                    value={editSlot.date}
                    onChange={(e) => handleInputChange(e, "date")}
                    className="border p-2 rounded w-full"
                    placeholder="Date"
                  />
                  <input
                    type="time"
                    value={editSlot.time}
                    onChange={(e) => handleInputChange(e, "time")}
                    className="border p-2 rounded w-full"
                    placeholder="Time"
                  />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
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
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}