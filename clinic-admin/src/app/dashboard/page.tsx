import DashboardCard from "@/components/DashboardCard";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Clinic Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard title="Total Appointments" value="120" />
            <DashboardCard title="Active Patients" value="85" />
            <DashboardCard title="Pending Requests" value="15" />
          </div>
        </main>
      </div>
    </div>
  );
}