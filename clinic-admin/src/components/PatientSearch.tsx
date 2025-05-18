"use client";

import { useState, useEffect } from 'react';

interface PatientSearchProps {
  patients: Patient[] | undefined;
  onSearch: (results: Patient[]) => void;
}

type Patient = {
  id: number;
  name: string;
  lastVisit: string;
  condition: string;
  notes: string;
};

export default function PatientSearch({ patients, onSearch }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (!patients) {
      onSearch([]);
      return;
    }
    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    onSearch(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (patients) {
      onSearch(patients);
    } else {
      onSearch([]);
    }
  };

  // Ensure searchTerm is only set on the client to avoid hydration mismatch
  useEffect(() => {
    setSearchTerm(''); // Explicitly set to empty string on client mount
  }, []);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search patients"
        className="w-full p-2 border rounded mb-4"
        data-skip-hydration="true" // Optional: Custom attribute to verify hydration behavior
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
    </div>
  );
}