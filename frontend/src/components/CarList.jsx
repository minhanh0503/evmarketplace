import CarCard from "./CarCard";

export default function CarList({ vehicles }) {
  if (vehicles.length === 0) {
    return <p>No vehicles found.</p>;
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Available Electric Vehicles
        </h2>

        <span className="text-gray-500">{vehicles.length} vehicles found</span>
      </div>

      {/* Vehicle Grid */}
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4
          gap-8
        "
      >
        {vehicles.map((vehicle) => (
          <CarCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
