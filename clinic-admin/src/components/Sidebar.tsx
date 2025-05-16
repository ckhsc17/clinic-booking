import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/appointments" className="text-blue-600 hover:underline">
              Appointments
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/patients" className="text-blue-600 hover:underline">
              Patients
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}