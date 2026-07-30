import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarList from "../components/CarList";
import CarFilter from "../components/CarFilter";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import { searchVehicles, getHotDeals } from "../services/VehicleService";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    make: "",
    condition: "",
    year: "",
    maxPrice: "",
    mileage: "",
    sort: "",
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchVehicles(filters);
      setVehicles(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
    getHotDeals()
      .then((data) => setHotDeals(data.slice(0, 4))) // top 4 deals
      .catch((err) => console.error("Hot deals error:", err));
  }, []);

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tight">
            Explore Electric Vehicles
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Discover, compare, and find your perfect electric car.
          </p>
        </div>

        {/* Hot Deals strip */}
        {hotDeals.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
                  Limited-time offers
                </p>
                <h2 className="text-3xl font-bold text-gray-900">Hot Deals</h2>
              </div>
              <button
                onClick={() => navigate("/hot-deals")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                View all deals →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotDeals.map((vehicle) => (
                <CarCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}

        <SearchBar
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
        />

        <CarFilter
          filters={filters}
          setFilters={setFilters}
          onFilter={handleSearch}
        />

        <CarList vehicles={vehicles} />
      </div>
    </div>
  );
}
