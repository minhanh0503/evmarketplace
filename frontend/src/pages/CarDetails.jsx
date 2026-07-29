import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById } from "../services/VehicleService";
import Car360Viewer from "../components/Car360View";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;

        // Fetch vehicle by ID from your Spring Boot backend
        const data = await getVehicleById(id);
        setVehicle(data);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600 font-medium">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6">
        <p className="text-red-500 font-semibold mb-4">
          {error || "Vehicle not found."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Calculate pricing based on Java BigDecimal response
  const originalPrice = Number(vehicle.price) || 0;
  const discountAmount = Number(vehicle.discount) || 0;
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          Back to listings
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-[600px] bg-gray-100">
            {vehicle.images?.length > 0 ? (
              <Car360Viewer
                images={vehicle.images.map((img) => img.imageUrl)}
              />
            ) : vehicle.imageUrl ? (
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white mt-8 rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-start">
            <div>
              <span
                className="
              text-xs font-semibold uppercase
              text-blue-600 bg-blue-50
              px-3 py-1 rounded-full
            "
              >
                {vehicle.condition}
              </span>

              <h1
                className="
              text-4xl font-bold
              text-gray-900 mt-4
            "
              >
                {vehicle.make} {vehicle.model}
              </h1>

              <p className="text-gray-500 mt-2">
                {vehicle.year} • {vehicle.color}
              </p>
            </div>

            <div className="text-right">
              <p
                className="
              text-4xl font-extrabold
              text-gray-900
            "
              >
                ${finalPrice.toLocaleString()}
              </p>

              {discountAmount > 0 && (
                <div>
                  <p
                    className="
                  line-through 
                  text-gray-400
                "
                  >
                    ${originalPrice.toLocaleString()}
                  </p>

                  <p
                    className="
                  text-green-600 
                  font-semibold
                "
                  >
                    Save ${discountAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="
        bg-white mt-8
        rounded-3xl
        shadow-sm
        border border-gray-100
        p-8
      "
        >
          <h2
            className="
          text-2xl font-bold
          mb-6
        "
          >
            Vehicle Specifications
          </h2>

          <div
            className="
          grid grid-cols-2
          md:grid-cols-4
          gap-6
        "
          >
            <Specification
              title="Mileage"
              value={`${vehicle.mileage?.toLocaleString()} miles`}
            />

            <Specification title="VIN" value={vehicle.vin} />

            <Specification title="Color" value={vehicle.color} />

            <Specification title="Condition" value={vehicle.condition} />
          </div>
        </div>

        <button
          onClick={() => navigate(`/test-drive/${vehicle.id}`)}
          className="
          mt-8
          w-full
          bg-gray-950
          text-white
          py-4
          rounded-2xl
          font-semibold
          text-lg
          hover:bg-blue-600
          transition
        "
        >
          Book a Test Drive TODAY
        </button>
      </div>
    </div>
  );
  function Specification({ title, value }) {
    return (
      <div>
        <p className="text-xs uppercase text-gray-500">{title}</p>

        <p
          className="
        mt-1
        font-semibold
        text-gray-900
        break-all
      "
        >
          {value}
        </p>
      </div>
    );
  }
}
