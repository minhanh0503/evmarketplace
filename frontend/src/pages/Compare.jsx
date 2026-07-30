import { useLocation, useNavigate } from "react-router-dom";
import { useCompare } from "../contexts/CompareContext";
export default function Compare() {
  const location = useLocation();
  const navigate = useNavigate();

  const vehicles = location.state?.vehicles || [];
  const { compareVehicles } = useCompare();

  if (vehicles.length !== 2) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Select two vehicles to compare
        </h2>

        <button
          onClick={() => navigate("/")}
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-xl
            hover:bg-blue-700
          "
        >
          Back to Vehicles
        </button>
      </div>
    );
  }

  const [car1, car2] = vehicles;

  const specs = [
    {
      label: "Price",
      value1: `$${Number(car1.price).toLocaleString()}`,
      value2: `$${Number(car2.price).toLocaleString()}`,
    },
    {
      label: "Year",
      value1: car1.year,
      value2: car2.year,
    },
    {
      label: "Mileage",
      value1: `${car1.mileage.toLocaleString()} km`,
      value2: `${car2.mileage.toLocaleString()} km`,
    },
    {
      label: "Condition",
      value1: car1.condition,
      value2: car2.condition,
    },
    {
      label: "Color",
      value1: car1.color,
      value2: car2.color,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
             bg-white border border-gray-200 text-gray-700 font-medium text-sm
             shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
             transition-all duration-200"
        >
          Back to listings
        </button>

        <h1 className="text-4xl font-bold text-center mb-10">
          Compare Vehicles
        </h1>

        {/* Vehicle Header */}
        <div
          className="
          grid
          grid-cols-3
          gap-6
          bg-white
          rounded-3xl
          shadow-sm
          p-6
        "
        >
          <div></div>
          {[car1, car2].map((car) => (
            <div key={car.id} className="text-center">
              <img
                src={
                  car.imageUrl ||
                  "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop"
                }
                alt={`${car.make} ${car.model}`}
                className="
                    w-full
                    h-48
                    object-cover
                    rounded-2xl
                "
              />

              <h2
                className="
                    mt-4
                    text-xl
                    font-bold
                    text-gray-900
                "
              >
                {car.make} {car.model}
              </h2>

              <p className="text-gray-500 mb-4">{car.year}</p>

              <button
                onClick={() => navigate(`/vehicles/${car.id}`)}
                className="
                    w-full
                    bg-gray-950
                    text-white
                    py-3
                    rounded-xl
                    text-sm
                    font-semibold
                    hover:bg-blue-600
                    active:scale-[0.98]
                    transition-all
                    duration-200
                "
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div
          className="
            mt-6
            bg-white
            rounded-3xl
            shadow-sm
            overflow-hidden
          "
        >
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="
                grid
                grid-cols-3
                border-b
                last:border-none
                py-5
                px-6
              "
            >
              <div
                className="
                font-semibold
                text-gray-500
              "
              >
                {spec.label}
              </div>

              <div
                className="
                text-center
                font-semibold
              "
              >
                {spec.value1}
              </div>
              <div
                className="
                text-center
                font-semibold
              "
              >
                {spec.value2}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
