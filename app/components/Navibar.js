export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="font-bold text-lg">Bus Booking</h1>
      <div className="space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/buses" className="hover:underline">Buses</a>
        <a href="/bookings" className="hover:underline">My Bookings</a>
      </div>
    </nav>
  );
}
