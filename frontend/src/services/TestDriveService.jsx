const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/test-drives`;

// Returns available LocalDateTime slots for a vehicle as an array of ISO strings
export async function getAvailableSlots(vehicleId) {
  const response = await fetch(`${API_URL}/slots/${vehicleId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch available slots");
  }

  return response.json();
}

// Books a test drive. Throws on 409 (slot conflict) with the backend's error message.
export async function bookTestDrive(userId, vehicleId, bookingDateTime) {
  const response = await fetch(`${API_URL}/book`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, vehicleId, bookingDateTime }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Failed to book test drive");
  }

  return response.json();
}

export async function cancelBooking(bookingId) {
  const response = await fetch(`${API_URL}/cancel/${bookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.error || "Failed to cancel booking");
  }

  return response.json();
}

// Returns all bookings (CONFIRMED and CANCELLED) for a user
export async function getUserBookings(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return response.json();
}
