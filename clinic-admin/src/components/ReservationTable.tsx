"use client";

import { useState } from "react";

interface Reservation {
  id: number;
  patientName: string;
  type: "Consultation" | "Appointment" | "Operation";
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Rejected";
}

interface ReservationTableProps {
  reservations: Reservation[] | undefined;
  onAction: (id: number, action: "confirm" | "reject") => void;
}

export default function ReservationTable({ reservations = [], onAction }: ReservationTableProps) {
  const [localReservations, setLocalReservations] = useState<Reservation[]>(reservations);

  const updateStatus = (id: number, newStatus: "Confirmed" | "Rejected") => {
    const updatedReservations = localReservations.map(res =>
      res.id === id ? { ...res, status: newStatus } : res
    );
    setLocalReservations(updatedReservations);
    onAction(id, newStatus === "Confirmed" ? "confirm" : "reject");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border-b">Patient Name</th>
            <th className="py-2 px-4 border-b">Type</th>
            <th className="py-2 px-4 border-b">Date</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {localReservations.length > 0 ? (
            localReservations.map((reservation) => (
              <tr key={reservation.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{reservation.patientName}</td>
                <td className="py-2 px-4 border-b">{reservation.type}</td>
                <td className="py-2 px-4 border-b">{reservation.date}</td>
                <td className="py-2 px-4 border-b">{reservation.time}</td>
                <td className="py-2 px-4 border-b">
                  {reservation.status === "Confirmed" && (
                    <span className="text-green-600 font-medium">Confirmed</span>
                  )}
                  {reservation.status === "Rejected" && (
                    <span className="text-red-600 font-medium">Rejected</span>
                  )}
                  {reservation.status === "Pending" && (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </td>
                <td className="py-2 px-4 border-b">
                  {reservation.status === "Pending" && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => updateStatus(reservation.id, "Confirmed")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                        title="Confirm"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(reservation.id, "Rejected")}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
                        title="Reject"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-2 px-4 text-center text-gray-500">
                No reservation requests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}