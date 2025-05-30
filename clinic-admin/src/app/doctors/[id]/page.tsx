'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from "@/components/Sidebar";

// Define interfaces for the data
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
  const params = useParams();
  const id = params?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format ISO time to readable format
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Fetch doctor details and schedule
  useEffect(() => {
    if (!id || typeof id !== 'string') {
      setError('Invalid or missing doctor ID');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const doctorId = parseInt(id);
        if (isNaN(doctorId)) {
          throw new Error(`Invalid doctor ID: ${id}`);
        }

        console.log("Fetching doctor details for ID:", doctorId);
        // Fetch doctor details
        const doctorResponse = await fetch(`http://127.0.0.1:8000/api/doctors/${doctorId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!doctorResponse.ok) {
          const errorText = await doctorResponse.text();
          throw new Error(`Failed to fetch doctor: ${doctorResponse.statusText} - ${errorText}`);
        }
        const doctorData: Doctor = await doctorResponse.json();
        setDoctor(doctorData);

        console.log("Fetching schedule for doctor_id:", doctorId);
        const scheduleUrl = `http://127.0.0.1:8000/api/doctors/availability?doctor_id=${doctorId}`;
        console.log("Schedule request URL:", scheduleUrl);
        // Fetch doctor schedule
        const scheduleResponse = await fetch(scheduleUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!scheduleResponse.ok) {
          const errorText = await scheduleResponse.text();
          throw new Error(`Failed to fetch schedule: ${scheduleResponse.statusText} - ${errorText}`);
        }
        const scheduleData: DoctorAvailabilityResponse = await scheduleResponse.json();

        // Transform schedule data into displayable time slots
        const slots: TimeSlot[] = scheduleData.available_times.map((slot) => ({
          time: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
          status: slot.is_bookable ? 'available' : 'unavailable',
        }));
        setSchedules(slots);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {/* Doctor Name */}
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          {isLoading ? 'Loading...' : doctor ? `${doctor.name}'s Schedule` : 'Doctor Not Found'}
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Schedule Display */}
        {isLoading ? (
          <div className="text-center text-gray-600">Loading schedule...</div>
        ) : schedules.length === 0 ? (
          <div className="text-center text-gray-600">No available time slots.</div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Available Time Slots</h2>
            <div className="space-y-3">
              {schedules.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <span className="text-gray-800 font-medium">{slot.time}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      slot.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {slot.status.charAt(0).toUpperCase() + slot.status.slice(1)}
                  </span>
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