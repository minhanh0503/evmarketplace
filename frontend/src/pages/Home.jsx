import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CarList from "../components/CarList";
import CarFilter from "../components/CarFilter";
import SearchBar from "../components/SearchBar";
import CarCard from "../components/CarCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "../styles/swiper.css";
import "swiper/css";
import "swiper/css/navigation";
import { searchVehicles, getHotDeals } from "../services/VehicleService";
import { useCompare } from "../contexts/CompareContext";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [compareVehicles, setCompareVehicles] = useState([]);
  const navigate = useNavigate();

  const { handleCompare, compareVehicles, removeCompar, clearCompare } = useCompare();
  const [filters, setFilters] = useState({
    keyword: "",
    make: "",
    condition: "",
    year: "",
    maxPrice: "",
    mileage: "",
    sort: "",
    bodyType: "",
    hasAccidentHistory: "",
  });

  const resetFilters = () => {
    setFilters({
      condition: "",
      make: "",
      year: "",
      maxPrice: "",
      mileage: "",
      sort: "",
      bodyType: "",
      hasAccidentHistory: "",
    });
  };
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
      // .then((data) => setHotDeals(data.slice(0, 4))) // top 4 deals
      .then((data) => setHotDeals(data))
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
            <div
              className="
              bg-gradient-to-r 
              from-orange-50 
              to-amber-50
              rounded-3xl
              p-8
              mb-12
              "
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
                    Limited-time offers
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Hot Deals
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/hot-deals")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
             bg-white border border-gray-200 text-blue-700 font-medium text-sm
             shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
             transition-all duration-200"
                >
                  View all deals
                </button>
              </div>

              {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {hotDeals.map((vehicle) => (
                  <CarCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div> */}
              <div className="max-w-7xl mx-auto mb-12 hot-deals-section">
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={24}
                  slidesPerView={1}
                  centerInsufficientSlides={true}
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                >
                  {hotDeals.map((vehicle) => (
                    <SwiperSlide key={vehicle.id}>
                      <CarCard
                        vehicle={vehicle}
                        onCompare={handleCompare}
                        isCompared={compareVehicles.some(
                          (v) => v.id === vehicle.id,
                        )}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        )}

        <div
          className="
          bg-white rounded-3xl 
          shadow-sm border border-gray-100
          p-6 mb-10
          "
        >
          <SearchBar
            filters={filters}
            setFilters={setFilters}
            onSearch={handleSearch}
          />

          <CarFilter
            filters={filters}
            setFilters={setFilters}
            onFilter={handleSearch}
            onReset={resetFilters}
          />
        </div>

        <CarList
          vehicles={vehicles}
          onCompare={handleCompare}
          compareVehicles={compareVehicles}
        />
        {compareVehicles.length > 0 && (
          <div
            className="
              fixed bottom-6 left-1/2 -translate-x-1/2
              bg-white border border-gray-200
              rounded-2xl shadow-xl
              p-5
              w-[420px]
              z-50
            "
          >
            <h3 className="font-semibold text-lg mb-4">Compare Vehicles</h3>

            <div className="space-y-3">
              {compareVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <span className="font-medium">
                    {vehicle.make} {vehicle.model}
                  </span>

                  <button
                    onClick={() => removeCompare(vehicle.id)}
                    className="
                    w-8 h-8
                    rounded-full
                    text-gray-500
                    hover:bg-red-100
                    hover:text-red-600
                    transition
                  "
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button
              disabled={compareVehicles.length < 2}
              onClick={() => {
                navigate("/compare", {
                  state: {
                    vehicles: compareVehicles,
                  },
                });
                clearCompare();
              }}
              className={`mt-5 w-full py-3 rounded-xl font-semibold transition
                ${
                  compareVehicles.length === 2
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              Compare Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
