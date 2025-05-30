'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from "@/components/Sidebar";

// Define interfaces for schedule data
interface TimeSlot {
  time: string;
  status: 'available' | 'unavailable';
}

interface Availability {
  start: string; // ISO format, e.g., "2025-05-18T11:00:00Z"
  end: string;
  is_bookable: boolean;
}

interface DoctorAvailabilityResponse {
  doctor_id: number;
  available_times: Availability[];
}

interface Doctor {
  id: number;
  name: string;
}

const DoctorSchedulePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // Get the doctor ID from the URL

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format ISO time to readable format
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Fetch doctor details and availability
  useEffect(() => {
    if (!id) return;

    const fetchDoctorAndSchedule = async () => {
      setIsLoading(true);
      try {
        // Fetch doctor details
        const doctorResponse = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`);
        if (!doctorResponse.ok) {
          throw new Error(`Failed to fetch doctor: ${doctorResponse.statusText}`);
        }
        const doctorData = await doctorResponse.json();
        setDoctor(doctorData);

        // Fetch doctor availability
        const scheduleResponse = await fetch(`http://127.0.0.1:8000/api/doctors/available_times?doctor_id=${id}`);
        if (!scheduleResponse.ok) {
          throw new Error(`Failed to fetch schedule: ${scheduleResponse.statusText}`);
        }
        const scheduleData: DoctorAvailabilityResponse = await scheduleResponse.json();

        // Transform the availability data into time slots
        const slots: TimeSlot[] = scheduleData.available_times.map((availability) => ({
          time: `${formatTime(availability.start)} - ${formatTime(availability.end)}`,
          status: availability.is_bookable ? 'available' : 'unavailable',
        }));
        setSchedules(slots);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorAndSchedule();
  }, [id]);

  if (!id) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">{doctor ? `${doctor.name}'s Schedule` : 'Doctor Schedule'}</h1>

        {/* Error State */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center">Loading schedule...</div>
        ) : schedules.length === 0 ? (
          <div className="text-center">No schedule available.</div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
            <div className="space-y-2">
              {schedules.map((slot, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="w-32">{slot.time}</span>
                  <div
                    className={`flex-1 p-2 rounded ${
                      slot.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                  >
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedulePage;