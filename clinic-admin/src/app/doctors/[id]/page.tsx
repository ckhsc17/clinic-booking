'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import { DateRangePicker } from 'react-date-range';
import { addDays, format, subHours } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// Define interfaces for the data
interface TimeSlot {
  time: string;
  status: 'available' | 'unavailable';
  date: string;
}

interface Availability {
  start: string;
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

interface DateRange {
  startDate: Date;
  endDate: Date;
  key: string;
}

const DoctorSchedulePage: React.FC = () => {
  const params = useParams();
  const id = params?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [schedules, setSchedules] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange[]>([
    {
      startDate: new Date('2025-05-30T00:00:00-06:00'), // Today at midnight CST
      endDate: addDays(new Date('2025-05-30T00:00:00-06:00'), 6), // One week from today
      key: 'selection',
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Format ISO time to readable format (local time)
  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);
    // Adjust UTC to CST (UTC-6)
    const localDate = subHours(date, 6);
    let hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Extract date for grouping (local time)
  const extractDate = (isoTime: string) => {
    const date = new Date(isoTime);
    // Adjust UTC to CST (UTC-6)
    const localDate = subHours(date, 6);
    return format(localDate, 'yyyy-MM-dd');
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
        const startDateStr = format(dateRange[0].startDate, 'yyyy-MM-dd');
        const endDateStr = format(dateRange[0].endDate, 'yyyy-MM-dd');
        const scheduleUrl = `http://127.0.0.1:8000/api/doctors/availability?doctor_id=${doctorId}&start_date=${startDateStr}&end_date=${endDateStr}`;
        console.log("Schedule request URL:", scheduleUrl);
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
        console.log("Schedule response:", scheduleData);

        const slots: TimeSlot[] = scheduleData.available_times.map((slot) => ({
          time: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
          status: slot.is_bookable ? 'available' : 'unavailable',
          date: extractDate(slot.start),
        }));
        console.log("Transformed schedules:", slots);
        setSchedules(slots);
      } catch (err) {
        setError(err.message);
        console.error('Fetch error details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, dateRange]);

  // Group schedules by date
  const groupedSchedules = schedules.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as { [key: string]: TimeSlot[] });

  const sortedDates = Object.keys(groupedSchedules).sort();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          {isLoading ? 'Loading...' : doctor ? `${doctor.name}'s Schedule` : 'Doctor Not Found'}
        </h1>
        <div className="mb-6">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {showDatePicker ? 'Hide Date Picker' : 'Select Date Range'}
          </button>
          {showDatePicker && (
            <div className="mt-2">
              <DateRangePicker
                onChange={(item) => setDateRange([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={dateRange}
                direction="horizontal"
              />
            </div>
          )}
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="text-center text-gray-600">Loading schedule...</div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center text-gray-600">No available or unavailable time slots for the selected range.</div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </h2>
                <div className="space-y-3">
                  {groupedSchedules[date].map((slot, index) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedulePage;