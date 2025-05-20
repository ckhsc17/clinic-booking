"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

type TimeSlot = {
  date: string;
  time: string;
  status: "available" | "booked" | "unavailable" | "past";
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
  const [selectedDay, setSelectedDay] = useState(new Date("2025-05-19"));
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date("2025-05-19"));
  const [schedule, setSchedule] = useState<TimeSlot[][]>([]);
  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!doctor) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const currentDateTime = new Date("2025-05-20T11:57:00-05:00"); // 11:57 AM CST, May 20, 2025
    const weekSchedule: TimeSlot[][] = [];
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(selectedWeekStart);
      date.setDate(selectedWeekStart.getDate() + dayOffset);
      const dateStr = date.toISOString().split("T")[0];
      const daySlots: TimeSlot[] = [];
      for (let hour = 11; hour <= 20; hour++) {
        const time = hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;
        const slotDateTime = new Date(`${dateStr}T${time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
        let status: "available" | "booked" | "unavailable" | "past" = "available";

        // Check if the slot is in the past
        if (slotDateTime < currentDateTime) {
          status = "past";
        } else {
          // Specific rules for booked and unavailable slots
          const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Weekends: mark 1:00 PM to 3:00 PM as booked, 8:00 PM as unavailable
            if (hour >= 13 && hour <= 15) {
              status = "booked";
            } else if (hour === 20) {
              status = "unavailable";
            }
          } else {
            // Weekdays: mark 12:00 PM and 5:00 PM as booked, 7:00 PM as unavailable
            if (hour === 12 || hour === 17) {
              status = "booked";
            } else if (hour === 19) {
              status = "unavailable";
            }
          }
        }
        daySlots.push({ date: dateStr, time, status });
      }
      weekSchedule.push(daySlots);
    }
    setSchedule(weekSchedule);
    setIsLoading(false);
  }, [doctor, selectedWeekStart]);

  const isPastTime = (date: string, time: string): boolean => {
    const slotDateTime = new Date(`${date}T${time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
    const currentDateTime = new Date("2025-05-20T11:57:00-05:00");
    return slotDateTime < currentDateTime;
  };

  const handleWeekChange = (offset: number) => {
    const newWeekStart = new Date(selectedWeekStart);
    newWeekStart.setDate(selectedWeekStart.getDate() + offset * 7);
    setSelectedWeekStart(newWeekStart);
    setSelectedDay(newWeekStart);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDay(new Date(date));
    const newWeekStart = new Date(date);
    newWeekStart.setDate(date.getDate() - (date.getDay() || 7) + 1);
    setSelectedWeekStart(newWeekStart);
  };

  const handleEdit = (slot: TimeSlot) => {
    if (isPastTime(slot.date, slot.time) || slot.status === "unavailable") return;
    setEditSlot({ ...slot });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editSlot && editSlot.date && editSlot.time && editSlot.status) {
      const slotDateTime = new Date(`${editSlot.date}T${editSlot.time.replace(" AM", ":00").replace(" PM", ":00")}-05:00`);
      const currentDateTime = new Date("2025-05-20T11:57:00-05:00");
      if (slotDateTime < currentDateTime) {
        alert("Cannot edit times in the past.");
        return;
      }
      setSchedule((prev) =>
        prev.map((day, i) =>
          day[0].date === editSlot.date
            ? day.map((t) =>
                t.date === editSlot.date && t.time === editSlot.time
                  ? { ...t, status: editSlot.status }
                  : t
              )
            : day
        )
      );
      setIsModalOpen(false);
      setEditSlot(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditSlot(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editSlot) {
      setEditSlot({ ...editSlot, status: e.target.value as "available" | "booked" | "unavailable" });
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

  const days = [];
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(selectedWeekStart);
    date.setDate(selectedWeekStart.getDate() + dayOffset);
    days.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      fullDate: date.toISOString().split("T")[0],
    });
  }

  const timeLabels = [
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
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
          <div className="mb-6 flex items-center justify-center space-x-2">
            <button
              onClick={() => handleWeekChange(-1)}
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
            >
              &lt;
            </button>
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => handleDayClick(new Date(day.fullDate))}
                className={`cursor-pointer px-3 py-2 rounded ${
                  day.fullDate === selectedDay.toISOString().split("T")[0]
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <div className="text-xs">{day.day}</div>
                <div className="text-lg font-bold">{day.date}</div>
              </div>
            ))}
            <button
              onClick={() => handleWeekChange(1)}
              className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400"
            >
              &gt;
            </button>
          </div>
          <div className="flex-1">
            {days
              .filter((day) => day.fullDate === selectedDay.toISOString().split("T")[0])
              .map((day, dayIndex) => {
                const daySlots = schedule[days.findIndex((d) => d.fullDate === day.fullDate)];
                return (
                  <div key={dayIndex} className="mb-2">
                    <div className="text-center font-bold text-gray-800 mb-2">{day.day} {day.date}</div>
                    <div className="flex flex-col">
                      {daySlots.map((slot, slotIndex) => {
                        const backgroundColor =
                          slot.status === "past"
                            ? "#d3d3d3" // Gray for past
                            : slot.status === "booked"
                            ? "#ffff00" // Yellow for booked
                            : slot.status === "unavailable"
                            ? "#ff0000" // Red for unavailable
                            : "#90ee90"; // Green for available
                        return (
                          <div key={slotIndex} className="flex items-center">
                            <div className="w-20 text-center text-sm font-medium text-gray-800 bg-gray-200 border-b border-gray-300 h-12 flex items-center justify-center">
                              {timeLabels[slotIndex]}
                            </div>
                            <div
                              className={`flex-1 h-12 border-b border-gray-300 ${
                                slot.status === "available" || slot.status === "booked" || slot.status === "unavailable" ? "cursor-pointer hover:opacity-80" : ""
                              }`}
                              style={{ backgroundColor }}
                              onClick={() => (slot.status === "available" || slot.status === "booked" || slot.status === "unavailable") && handleEdit(slot)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
          {isModalOpen && editSlot && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Edit Time Slot</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date: {editSlot.date}</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time: {editSlot.time}</label>
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      id="status"
                      value={editSlot.status}
                      onChange={handleInputChange}
                      className="border p-2 rounded w-full"
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
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