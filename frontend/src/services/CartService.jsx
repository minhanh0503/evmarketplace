const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/orders`;

export async function getCart(userId) {
  const response = await fetch(`${API_URL}/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch cart");
  }
  return response.json();
}

export async function addToCart(userId, vehicleId, quantity) {
  const response = await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, vehicleId, quantity }),
  });

  if (!response.ok) {
    throw new Error("Failed to add item to cart");
  }

  return response.json();
}

export async function removeCartItem(cartItemId) {
  const response = await fetch(`${API_URL}/remove/${cartItemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to remove cart item");
  }
}

export async function clearCart(userId) {
  const response = await fetch(`${API_URL}/clear/${userId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear cart");
  }
}