import { useNavigate } from "react-router-dom";

export default function CarCard({ vehicle }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        overflow-hidden
        border
        border-gray-200/80
        flex
        flex-col
        h-full
      "
    >
      {/* Vehicle Image Container - Uses aspect-video (16:9) to standardise sizes */}
      <div className="relative w-full aspect-video bg-gray-100 overflow-hidden">
        <img
          src={
            vehicle.imageUrl ||
            "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop"
          }
          alt={`${vehicle.make} ${vehicle.model}`}
          className="
            w-full
            h-full
            object-cover
            object-center
            transition-transform
            duration-500
            hover:scale-105
          "
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-gray-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium tracking-wide uppercase">
            {vehicle.condition}
          </span>
        </div>

        {vehicle.discount > 0 && (
          <span
            className="
              absolute
              top-3
              right-3
              bg-rose-500
              text-white
              px-2.5
              py-1
              rounded-md
              text-xs
              font-bold
            "
          >
            {vehicle.discount}% OFF
          </span>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Make, Model & Year */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
              {vehicle.make}{" "}
              <span className="text-gray-600 font-semibold">
                {vehicle.model}
              </span>
            </h3>
            <span className="text-sm font-semibold text-gray-400 shrink-0">
              {vehicle.year}
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-2xl font-black text-gray-900">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Mileage
              </span>
              <span className="font-semibold text-gray-700 mt-0.5">
                {vehicle.mileage.toLocaleString()} km
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Color
              </span>
              <span className="font-semibold text-gray-700 mt-0.5 capitalize">
                {vehicle.color}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleViewDetails}
          className="
            mt-6
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
    </div>
  );
}
