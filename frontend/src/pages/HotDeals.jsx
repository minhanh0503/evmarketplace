import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarList from "../components/CarList";
import { getHotDeals } from "../services/VehicleService";

export default function HotDeals() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadHotDeals = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getHotDeals();
        setVehicles(data);
      } catch (err) {
        console.error("Hot deals error:", err);
        setError(err.message || "Failed to load hot deals");
      } finally {
        setLoading(false);
      }
    };

    loadHotDeals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <p className="text-gray-600 font-medium">Loading hot deals...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-500 mb-2">
          Limited-time offers
        </p>
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
          Hot Deals
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Electric vehicles with special discounts — save more on your next EV.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to all vehicles
        </button>
      </div>

      {error && (
        <p className="text-center text-red-500 font-medium mb-6">{error}</p>
      )}

      {!error && vehicles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No hot deals available right now.</p>
          <p className="text-gray-400 mt-2 text-sm">
            Check back soon or browse the full catalogue.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-5 py-2.5 bg-gray-950 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
          >
            Browse all vehicles
          </button>
        </div>
      ) : (
        <CarList vehicles={vehicles} />
      )}
    </div>
  );
}