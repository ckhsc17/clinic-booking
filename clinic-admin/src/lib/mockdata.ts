export const patientHistory = [
  {
    id: 1,
    name: "John Doe",
    lastVisit: "2025-04-10",
    condition: "Hypertension",
    notes: "Follow-up required in 3 months. BP: 140/90.",
  },
  {
    id: 2,
    name: "Emily Carter",
    lastVisit: "2025-05-01",
    condition: "Diabetes Type 2",
    notes: "Prescribed metformin. Monitor blood sugar levels.",
  },
  {
    id: 3,
    name: "Michael Brown",
    lastVisit: "2025-03-15",
    condition: "Asthma",
    notes: "Inhaler refilled. Avoid allergens.",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    lastVisit: "2025-05-10",
    condition: "Migraine",
    notes: "Prescribed triptans. Advised to reduce screen time.",
  },
  {
    id: 5,
    name: "David Lee",
    lastVisit: "2025-02-20",
    condition: "Back Pain",
    notes: "Recommended physical therapy. Follow-up in 6 weeks.",
  },
];

export const doctorSchedules = [
  {
    id: 1,
    doctor: "Dr. Alice Thompson",
    date: "2025-05-17",
    time: "09:00 AM",
    status: "Completed",
  },
  {
    id: 2,
    doctor: "Dr. Mark Evans",
    date: "2025-05-17",
    time: "02:00 PM",
    status: "Completed",
  },
  {
    id: 3,
    doctor: "Dr. Susan Patel",
    date: "2025-05-17",
    time: "04:00 PM",
    status: "Scheduled",
  },
  {
    id: 4,
    doctor: "Dr. Robert Kim",
    date: "2025-05-18",
    time: "10:00 AM",
    status: "Scheduled",
  },
  {
    id: 5,
    doctor: "Dr. Linda Hayes",
    date: "2025-05-18",
    time: "01:30 PM",
    status: "Scheduled",
  },
  {
    id: 6,
    doctor: "Dr. Alice Thompson",
    date: "2025-05-16",
    time: "11:00 AM",
    status: "Cancelled",
  },
];

export const reservationRequests = [
  {
    id: 1,
    patientName: "John Doe",
    type: "Consultation",
    date: "2025-05-18",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 2,
    patientName: "Emily Carter",
    type: "Appointment",
    date: "2025-05-19",
    time: "09:00 AM",
    status: "Pending",
  },
  {
    id: 3,
    patientName: "Michael Brown",
    type: "Operation",
    date: "2025-05-20",
    time: "02:00 PM",
    status: "Pending",
  },
];