import { useState } from 'react';

interface PatientSearchProps {
  patients: Patient[];
  onSearch: (results: Patient[]) => void;
}

export default function PatientSearch({ patients, onSearch }: PatientSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const filtered = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    onSearch(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch(patients);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search patients"
        className="w-full p-2 border rounded mb-4"
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