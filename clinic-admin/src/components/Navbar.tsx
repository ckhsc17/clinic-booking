export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Clinic Admin</h1>
        <div>
          <button className="mr-4">Profile</button>
          <button>Logout</button>
        </div>
      </div>
    </nav>
  );
}