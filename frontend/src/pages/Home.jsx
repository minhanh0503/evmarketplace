import { useEffect, useState } from "react";
import CarList from "../components/CarList";
import CarFilter from "../components/CarFilter";
import SearchBar from "../components/SearchBar";
import { searchVehicles } from "../services/VehicleService";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <p>Loading vehicles...</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1
          className="
          text-5xl
          font-bold
          text-gray-900
          tracking-tight
        "
        >
          Explore Electric Vehicles
        </h1>

        <p
          className="
          mt-3
          text-lg
          text-gray-600
        "
        >
          Discover, compare, and find your perfect electric car.
        </p>
      </div>

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
  );
}
