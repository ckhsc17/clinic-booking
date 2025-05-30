'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from "@/components/Sidebar";

// Define Doctor interface
interface Doctor {
  id: number;
  name: string;
  specialty: string;
}

// Mock doctor data (to be replaced with backend API call)
const doctors: Doctor[] = [
  { id: 1, name: 'Dr. Alice Thompson', specialty: 'Cardiology' },
  { id: 2, name: 'Dr. Mark Evans', specialty: 'Neurology' },
  { id: 3, name: 'Dr. Linda Hayes', specialty: 'Pediatrics' },
  { id: 4, name: 'Dr. James Wilson', specialty: 'Orthopedics' },
  { id: 5, name: 'Dr. Sarah Chen', specialty: 'Dermatology' },
];

const DoctorsPage: React.FC = () => {
  // State for loading (for future API integration)
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for future API call
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      // Future API call would go here
      // const response = await fetch('/api/doctors');
      // const data = await response.json();
      // return data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use effect for fetching doctors (uncomment when API is ready)
  // useEffect(() => {
  //   fetchDoctors();
  // }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Our Doctors</h1>
        
        {/* Loading State */}
        {isLoading ? (
          <div className="text-center">Loading doctors...</div>
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