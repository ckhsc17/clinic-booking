'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from "@/components/Sidebar";

// Define Doctor interface
interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

const DoctorsPage: React.FC = () => {
  // State for doctors, loading, and error
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors');
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.statusText}`);
        }
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching doctors:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Our Doctors</h1>
        
        {/* Error State */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center">Loading doctors...</div>
        ) : doctors.length === 0 ? (
          <div className="text-center">No doctors available.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold">{doctor.name}</h2>
                <p className="text-gray-600 mb-4">{doctor.specialty}</p>
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  View Schedule
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsPage;