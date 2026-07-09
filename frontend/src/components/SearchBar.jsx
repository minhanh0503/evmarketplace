export default function SearchBar({ filters, setFilters, onSearch }) {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      keyword: e.target.value,
    });
  };

  return (
    <div className="flex w-full max-w-3xl mx-auto gap-3 my-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search by make or model..."
          value={filters.keyword}
          onChange={handleChange}
          className="
            w-full
            px-5 py-3
            rounded-xl
            border border-gray-300
            shadow-sm
            text-gray-800
            placeholder-gray-400
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-transparent
            transition
          "
        />
      </div>

      <button
        onClick={onSearch}
        className="
          px-6 py-3
          rounded-xl
          bg-blue-600
          text-white
          font-semibold
          shadow-md
          hover:bg-blue-700
          active:scale-95
          transition
        "
      >
        Search
      </button>
    </div>
  );
}
