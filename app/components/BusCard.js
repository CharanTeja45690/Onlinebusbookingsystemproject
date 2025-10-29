export default function BusCard({ bus }) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h2 className="font-semibold text-lg">{bus.name}</h2>
      <p>{bus.source} → {bus.destination}</p>
      <p>Departure: {new Date(bus.departure).toLocaleString()}</p>
      <a
        href={`/buses/${bus.id}`}
        className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        View Seats
      </a>
    </div>
  );
}
