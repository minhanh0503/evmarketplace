import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById, getAllVehicles } from "../services/VehicleService";
import { addToCart } from "../services/CartService";
import Car360Viewer from "../components/Car360View";
import CarCard from "../components/CarCard";
import {
  getReviewsByVehicleId,
  getAverageRating,
  createVehicleReview,
} from "../services/ReviewService";
import { getStoredUser } from "../services/AuthService";
import VehicleCustomizer from "../components/VehicleCustomizer";
import { useCompare } from "../contexts/CompareContext";

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [customTotal, setCustomTotal] = useState(null);

  const {
    handleCompare,
    compareVehicles,
    removeCompare,
    clearCompare,
  } = useCompare();

  const loadReviews = async () => {
    if (!id) return;
    const reviewData = await getReviewsByVehicleId(id);
    setReviews(reviewData);
    const avg = await getAverageRating(id);
    setAverageRating(avg);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!reviewerName.trim() || !comment.trim()) {
      setReviewError("Please enter your name and a comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      await createVehicleReview({
        vehicleId: Number(id),
        reviewerName: reviewerName.trim(),
        rating: Number(rating),
        comment: comment.trim(),
      });
      setReviewSuccess("Review submitted.");
      setReviewerName("");
      setRating(5);
      setComment("");
      await loadReviews();
    } catch (err) {
      console.error(err);
      setReviewError(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = async () => {
    const stored = getStoredUser();
    const userId = stored?.userId?.toString();

    if (!userId) {
      alert("Please sign in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      const priceToUse =
        customTotal != null ? customTotal : Number(vehicle.price);
      await addToCart(userId, vehicle.id, 1, priceToUse);
      navigate("/cart", { state: { userId } });
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Could not add this vehicle to your cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const data = await getVehicleById(id);
        setVehicle(data);
        const reviewData = await getReviewsByVehicleId(id);
        setReviews(reviewData);
        const ratingVal = await getAverageRating(id);
        setAverageRating(ratingVal);
        const allVehicles = await getAllVehicles();
        const similar = allVehicles
          .filter((v) => v.id !== Number(id))
          .filter((v) => v.make === data.make || v.condition === data.condition)
          .slice(0, 4);

        setSimilarVehicles(similar);
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

  const originalPrice = Number(vehicle.price) || 0;
  const discountAmount = Number(vehicle.discount) || 0;
  const finalPrice = originalPrice - discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
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

        <div className="mt-4 flex items-center gap-2">
          <div className="text-yellow-500 text-lg">
            {"⭐".repeat(Math.round(averageRating) || 0)}
          </div>
          <span className="font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500">({reviews.length} Reviews)</span>
        </div>

        <div className="bg-white mt-8 rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {vehicle.condition}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mt-4">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-gray-500 mt-2">
                {vehicle.year} • {vehicle.color}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-extrabold text-gray-900">
                ${finalPrice.toLocaleString()}
              </p>
              {discountAmount > 0 && (
                <div>
                  <p className="line-through text-gray-400">
                    ${originalPrice.toLocaleString()}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Save ${discountAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white mt-8 rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold mb-6">Vehicle Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Specification
              title="Mileage"
              value={`${vehicle.mileage?.toLocaleString()} miles`}
            />
            <Specification title="VIN" value={vehicle.vin} />
            <Specification title="Color" value={vehicle.color} />
            <Specification title="Condition" value={vehicle.condition} />
          </div>
          {vehicle.hasAccidentHistory ? (
            <div className="bg-red-50 border border-red-100 mt-8 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-red-700 mb-2">
                Vehicle History Report
              </h3>
              <p className="text-red-600">{vehicle.accidentHistoryDetails}</p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-100 mt-8 rounded-3xl p-8">
              <p className="text-green-700 font-semibold">
                No reported accidents or damage on record.
              </p>
            </div>
          )}
        </div>

        <div className="bg-white mt-8 rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <span className="text-gray-500">{reviews.length} Reviews</span>
          </div>

          <form
            onSubmit={handleSubmitReview}
            className="mb-10 pb-8 border-b border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Write a review
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                >
                  <option value={5}>5 – Excellent</option>
                  <option value={4}>4 – Good</option>
                  <option value={3}>3 – Average</option>
                  <option value={2}>2 – Poor</option>
                  <option value={1}>1 – Terrible</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                placeholder="Share your experience with this vehicle..."
              />
            </div>
            {reviewError && (
              <p className="text-sm text-red-500 mb-3">{reviewError}</p>
            )}
            {reviewSuccess && (
              <p className="text-sm text-green-600 mb-3">{reviewSuccess}</p>
            )}
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-gray-950 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 disabled:opacity-60 transition"
            >
              {submittingReview ? "Submitting..." : "Submit review"}
            </button>
          </form>

          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Review
                key={review.id}
                name={review.reviewerName}
                rating={review.rating}
                comment={review.comment}
              />
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>

        <VehicleCustomizer
          basePrice={finalPrice}
          onTotalChange={setCustomTotal}
        />

        <button
          onClick={() => handleCompare(vehicle)}
          disabled={compareVehicles?.some((v) => v.id === vehicle.id)}
          className={`
            mt-8 w-full py-4 rounded-2xl font-semibold text-lg transition
            ${
              compareVehicles?.some((v) => v.id === vehicle.id)
                ? "bg-green-50 text-green-700 border border-green-300 cursor-default"
                : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {compareVehicles?.some((v) => v.id === vehicle.id)
            ? "✓ Added to Compare"
            : "Compare Vehicle"}
        </button>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          className="mt-8 w-full bg-gray-950 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {addingToCart ? "Adding..." : "Add to Cart"}
        </button>

        <button
          onClick={() => navigate(`/test-drive/${vehicle.id}`)}
          className="mt-8 w-full bg-gray-950 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition"
        >
          Book a Test Drive TODAY
        </button>

        <button
          onClick={() => navigate(`/loan-calculator/${vehicle.id}`)}
          className="mt-4 w-full bg-gray-950 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition"
        >
          Estimate Monthly Payment
        </button>

        <h2 className="text-2xl font-bold mt-10 mb-6">Similar Vehicles</h2>
        {similarVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarVehicles.map((v) => (
              <CarCard
                key={v.id}
                vehicle={v}
                onCompare={handleCompare}
                isCompared={compareVehicles?.some((c) => c.id === v.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No similar vehicles available.</p>
        )}

        {compareVehicles?.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-2xl shadow-xl p-5 w-[420px] z-50">
            <h3 className="font-semibold text-lg mb-4">Compare Vehicles</h3>
            <div className="space-y-3">
              {compareVehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
                >
                  <span className="font-medium">
                    {v.make} {v.model}
                  </span>
                  <button
                    onClick={() => removeCompare(v.id)}
                    className="w-8 h-8 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition"
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
                  state: { vehicles: compareVehicles },
                });
                clearCompare();
              }}
              className={`mt-5 w-full py-3 rounded-xl font-semibold transition ${
                compareVehicles.length === 2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Compare Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Specification({ title, value }) {
  return (
    <div>
      <p className="text-xs uppercase text-gray-500">{title}</p>
      <p className="mt-1 font-semibold text-gray-900 break-all">{value}</p>
    </div>
  );
}

function Review({ name, rating, comment }) {
  return (
    <div className="border-b py-6 last:border-none">
      <div className="flex justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-yellow-500">{"⭐".repeat(rating)}</span>
      </div>
      <p className="mt-3 text-gray-600">{comment}</p>
    </div>
  );
}