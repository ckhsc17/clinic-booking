"use client";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Reservation {
  id: number;
  patientName: string;
  type: "Consultation" | "Appointment" | "Operation";
  date: string;
  time: string;
  status: "Pending" | "Confirmed" | "Rejected";
}

interface ReservationRequestProps {
  reservation: Reservation;
  onAction: (id: number, action: "confirm" | "reject") => void;
}

export default function ReservationRequest({ reservation, onAction }: ReservationRequestProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{reservation.patientName}</h3>
        <p className="text-gray-600">Type: {reservation.type}</p>
        <p className="text-gray-600">Date: {reservation.date}</p>
        <p className="text-gray-600">Time: {reservation.time}</p>
        <p className="text-gray-700 font-medium">Status: {reservation.status}</p>
      </div>
      {reservation.status === "Pending" && (
        <div className="flex space-x-4">
          <button
            onClick={() => onAction(reservation.id, "confirm")}
            className="text-green-500 hover:text-green-700"
            title="Confirm"
          >
            <FaCheckCircle size={24} />
          </button>
          <button
            onClick={() => onAction(reservation.id, "reject")}
            className="text-red-500 hover:text-red-700"
            title="Reject"
          >
            <FaTimesCircle size={24} />
          </button>
        </div>
      )}
    </div>
  );
}