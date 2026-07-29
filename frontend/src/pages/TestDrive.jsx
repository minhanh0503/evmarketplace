import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAvailableSlots,
  bookTestDrive,
  cancelBooking,
  getUserBookings,
} from "../services/TestDriveService";

// TODO: replace with the authenticated user's ID once Kiana's Identity
// Service is integrated. Using a manually-entered ID as a placeholder,
// same pattern as Cart.jsx, since login/session handling doesn't exist yet.
export default function TestDrive() {
  const { vehicleId } = useParams();

  const [userId, setUserId] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookings, setBookings] = useState([]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  const handleBook = async () => {
    if (!userId) {
      setError("Please enter your user ID first.");
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
      setError("");
      await cancelBooking(bookingId);
      await loadBookings();
      await loadSlots();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatSlot = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Book a Test Drive
      </h1>
      <p className="text-gray-600 mb-6">Vehicle ID: {vehicleId}</p>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={loadBookings}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          View My Bookings
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>

        {loadingSlots && <p className="text-gray-600">Loading slots...</p>}

        {!loadingSlots && slots.length === 0 && (
          <p className="text-gray-600">
            No available slots for this vehicle right now.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {slots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedSlot(slot)}
              className={`px-3 py-2 rounded border text-sm ${
                selectedSlot === slot
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
              }`}
            >
              {formatSlot(slot)}
            </button>
          ))}
        </div>

        <button
          onClick={handleBook}
          disabled={booking || !selectedSlot}
          className="bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {booking ? "Booking..." : "Confirm Booking"}
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

        {bookings.length === 0 && (
          <p className="text-gray-600">
            No bookings loaded yet. Enter your user ID above and click
            &quot;View My Bookings&quot;.
          </p>
        )}

        <ul className="space-y-3">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded"
            >
              <div>
                <p className="font-medium">
                  Vehicle {b.vehicleId} &middot; {formatSlot(b.bookingDateTime)}
                </p>
                <p
                  className={`text-sm ${
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
                  className="text-red-600 text-sm hover:underline"
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
