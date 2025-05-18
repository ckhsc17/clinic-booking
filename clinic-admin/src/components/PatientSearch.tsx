"use client";

import { useState } from "react";

export default function PatientSearch({ patients, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(patients.filter((patient) =>
      patient.name.toLowerCase().includes(e.target.value.toLowerCase())
    ));
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        className="border p-2 rounded w-full mb-4"
        placeholder="Search patients..."
      />
    </div>
  );
}