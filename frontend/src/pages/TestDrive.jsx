import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import TestDriveCalendar from "../components/TestDriveCalendar";
import { getStoredUser } from "../services/AuthService";

import {
  getAvailableSlots,
  bookTestDrive,
  cancelBooking,
  getUserBookings,
} from "../services/TestDriveService";

export default function TestDrive() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [userId] = useState(
    () => storedUser?.userId?.toString() || ""
  );
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadSlots = async () => {
    try {
      setLoadingSlots(true);
      setError("");
      const data = await getAvailableSlots(vehicleId);
      setSlots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSlots(false);
    }
  };

  const loadBookings = async () => {
    if (!userId) return;
    try {
      const data = await getUserBookings(userId);
      setBookings(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSlots();
    if (userId) loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId, userId]);

  const handleBook = async () => {
    if (!userId) {
      setError("Please sign in first.");
      return;
    }
    if (!selectedSlot) {
      setError("Please select a time slot.");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccessMessage("");
      await bookTestDrive(userId, vehicleId, selectedSlot);
      setSuccessMessage("Test drive booked successfully!");
      setSelectedSlot(null);
      await loadSlots();
      await loadBookings();
    } catch (err) {
      // Covers the 409 Conflict case if another user books the same slot
      // first (Isolation.SERIALIZABLE guarantees the backend catches this).
      setError(err.message);
      await loadSlots();
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setSuccessMessage("Booking cancelled.");
      await loadSlots();
      await loadBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatSlot = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
             bg-white border border-gray-200 text-gray-700 font-medium text-sm
             shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
             transition-all duration-200"        >
          Back
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Book a Test Drive</h1>
          <p className="text-gray-500 mt-2">
            Schedule your test drive and experience this vehicle in person.
          </p>
          <div className="mt-5 inline-flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">
            Vehicle ID: {vehicleId}
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-5 py-3 mb-6">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 rounded-xl px-5 py-3 mb-6">
            {successMessage}
          </div>
        )}

        {/* Customer Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-5">Customer Information</h2>

          {userId ? (
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <p className="flex-1 text-sm text-gray-600 py-3">
                Signed in as{" "}
                <span className="font-semibold text-gray-900">
                  {storedUser?.email || `user #${userId}`}
                </span>
                . Bookings will use your account.
              </p>
              <button
                onClick={loadBookings}
                className="bg-gray-950 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition"
              >
                View My Bookings
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <p className="text-gray-600 text-sm">
                You need to be signed in to book a test drive.
              </p>
              <Link
                to="/login"
                className="bg-gray-950 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition text-sm font-medium"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>

        {/* Calendar / slots */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-5">Pick a time</h2>
          {loadingSlots ? (
            <p className="text-gray-500">Loading available slots...</p>
          ) : (
            <TestDriveCalendar
              slots={slots}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
          )}

          <button
            onClick={handleBook}
            disabled={!userId || !selectedSlot || booking}
            className="mt-6 w-full bg-gray-950 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {booking ? "Booking..." : "Confirm Test Drive"}
          </button>
        </div>

        {/* Previous Bookings */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-gray-500">
              {userId
                ? 'No bookings yet. Choose a slot and click "Confirm Test Drive".'
                : "Sign in to see your bookings."}
            </p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="flex justify-between items-center bg-gray-50 rounded-2xl p-5"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      Vehicle {b.vehicleId}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatSlot(b.bookingDateTime)}
                    </p>
                    <p
                      className={`text-sm mt-2 font-medium ${
                        b.status === "CONFIRMED"
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {b.status}
                    </p>
                  </div>

                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
