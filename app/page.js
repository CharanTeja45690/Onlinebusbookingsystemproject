import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <section className="text-center mt-20">
        <h1 className="text-4xl font-bold">Welcome to Bus Booking System</h1>
        <p className="mt-4 text-gray-600">Book your journey easily and quickly</p>
        <a href="/buses" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded">
          View Buses
        </a>
      </section>
    </main>
  );
}
