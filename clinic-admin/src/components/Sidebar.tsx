"use client";

import Link from "next/link";
import { FaHome, FaCalendarAlt, FaUser, FaPills, FaUserMd } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Clinic Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <FaHome className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/appointments"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <FaCalendarAlt className="mr-3" />
              Appointments
            </Link>
          </li>
          <li>
            <Link
              href="/patients"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <FaUser className="mr-3" />
              Patients
            </Link>
          </li>
          <li>
            <Link
              href="/treatments"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <FaPills className="mr-3" />
              Treatments
            </Link>
          </li>
          <li>
            <Link
              href="/doctors"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition"
            >
              <FaUserMd className="mr-3" />
              Doctors
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}