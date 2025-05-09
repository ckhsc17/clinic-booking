import Link from "next/link";

export default function DoctorCard({ doctor }) {
  return (
    <Link href={`/doctor/${doctor.id}`}>
      <div className="flex items-center p-4 border rounded-4xl bg-white shadow hover:bg-blue-50 cursor-pointer transition overflow-hidden mb-6">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-24 h-24 rounded-full mr-4 object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{doctor.name}</h3>
          <p className="text-blue-500">{doctor.title}</p>
        </div>
      </div>
    </Link>
  );
}
