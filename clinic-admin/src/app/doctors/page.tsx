'use client';

import React, { useState } from 'react';
import Sidebar from "@/components/Sidebar";

// Define types for time slot status and structure
type TimeSlotStatus = 'available' | 'booked' | 'unavailable';

interface TimeSlot {
  time: string;
  status: TimeSlotStatus;
}

interface DaySchedule {
  date: number;
  slots: TimeSlot[];
}

// Doctor ID to name mapping
const doctorMap: { [key: number]: string } = {
  1: 'Dr. Alice Thompson',
  2: 'Dr. Mark Evans',
  3: 'Dr. Linda Hayes',
};

// Function to generate time slots from 11 AM to 8 PM (18 slots, 30-minute intervals)
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  let hour = 11;
  let minute = 0;

  for (let i = 0; i < 18; i++) {
    const time = `${hour}:${minute === 0 ? '00' : '30'} ${hour >= 12 ? 'PM' : 'AM'}`;
    slots.push({ time, status: 'available' });

    minute += 30;
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }
    if (hour === 12) hour = 12; // Handle noon correctly
    if (hour > 12) hour = hour - 12; // Convert to 12-hour format
  }
  return slots;
};

// Initial schedule for 7 days starting from May 18, 2025
const initialSchedule: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
  date: 18 + i,
  slots: generateTimeSlots(),
}));

interface DoctorScheduleProps {
  doctorId: number;
}

const DoctorSchedule: React.FC<DoctorScheduleProps> = ({ doctorId }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [selectedDay, setSelectedDay] = useState<number>(20); // Default to May 20

  // Function to change the status of a time slot
  const changeSlotStatus = (dayIndex: number, slotIndex: number, newStatus: TimeSlotStatus) => {
    setSchedule((prevSchedule) => {
      const newSchedule = [...prevSchedule];
      newSchedule[dayIndex].slots[slotIndex].status = newStatus;
      return newSchedule;
    });
  };

  // Handle day selection
  const handleDayClick = (date: number) => {
    setSelectedDay(date);
  };

  // Get the schedule for the selected day
  const selectedDaySchedule = schedule.find((day) => day.date === selectedDay);

  // Get doctor name from ID
  const doctorName = doctorMap[doctorId] || 'Unknown Doctor';

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-4">
        {/* Doctor Name Header */}
        <h1 className="text-2xl font-bold mb-4">{doctorName}'s Schedule</h1>

        {/* Date Bar */}
        <div className="flex justify-between items-center mb-4">
          <button className="text-xl">&lt;</button>
          <div className="flex space-x-2">
            {schedule.map((day) => (
              <button
                key={day.date}
                onClick={() => handleDayClick(day.date)}
                className={`px-4 py-2 rounded ${
                  selectedDay === day.date ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.date - 18]}</div>
                <div>{day.date}</div>
              </button>
            ))}
          </div>
          <button className="text-xl">&gt;</button>
        </div>

        {/* Timeline for Selected Day */}
        <div className="mt-4">
          <h2 className="text-lg font-bold mb-2">Schedule for May {selectedDay}, 2025</h2>
          <div className="space-y-2">
            {selectedDaySchedule?.slots.map((slot, slotIndex) => (
              <div key={slot.time} className="flex items-center space-x-2">
                <span className="w-24">{slot.time}</span>
                <div
                  className={`flex-1 p-2 rounded ${
                    slot.status === 'available'
                      ? 'bg-green-500'
                      : slot.status === 'booked'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  } text-white`}
                >
                  {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                </div>
                <select
                  value={slot.status}
                  onChange={(e) =>
                    changeSlotStatus(
                      schedule.findIndex((day) => day.date === selectedDay),
                      slotIndex,
                      e.target.value as TimeSlotStatus
                    )
                  }
                  className="p-1 rounded border"
                >
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;