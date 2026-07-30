import React from "react";

export default function CarFilter({ filters, setFilters, onFilter, onReset }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const selectStyle = `
    w-full
    px-3 py-2
    rounded-lg
    border border-gray-300
    bg-white
    text-gray-700
    shadow-sm
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
    focus:border-transparent
    transition
  `;

  return (
    <div className="bg-white rounded-2xl shadow-md p-3 my-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Vehicles</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
        <select
          name="condition"
          value={filters.condition}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">All Conditions</option>
          <option value="NEW">New</option>
          <option value="USED">Used</option>
        </select>

        <select
          name="make"
          value={filters.make}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">All Makes</option>
          <option value="Tesla">Tesla</option>
          <option value="Hyundai">Hyundai</option>
          <option value="BMW">BMW</option>
          <option value="Volkswagen">Volkswagen</option>
          <option value="Kia">Kia</option>
          <option value="Porsche">Porsche</option>
        </select>

        <select
          name="year"
          value={filters.year}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">All Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">All Prices</option>
          <option value="30000">Under $30,000</option>
          <option value="40000">Under $40,000</option>
          <option value="50000">Under $50,000</option>
          <option value="50000">Under $50,000</option>
        </select>

        <select
          name="mileage"
          value={filters.mileage}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">All Mileages</option>
          <option value="10000">Under 10,000 km</option>
          <option value="20000">Under 20,000 km</option>
          <option value="30000">Under 30,000 km</option>
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={selectStyle}
        >
          <option value="">Sort By</option>
          <option value="mileageAsc">Mileage: Low to High</option>
          <option value="mileageDesc">Mileage: High to Low</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="yearDesc">Year: New to Old</option>
        </select>
      </div>

      <button
        onClick={onFilter}
        className="
          mt-2
          w-full sm:w-auto
          px-3 py-2
          rounded-lg
          bg-blue-600
          text-white
          font-semibold
          shadow-md
          hover:bg-blue-700
          active:scale-95
          transition
        "
      >
        Apply Filters
      </button>
      <button
        onClick={onReset}
        className="
          w-full sm:w-auto
          px-3 py-2
          rounded-lg
          ml-5
          bg-gray-200
          text-gray-700
          font-semibold
          shadow-md
          hover:bg-gray-300
          active:scale-95
          transition
        "
      >
        Reset Filters
      </button>
    </div>
  );
}
