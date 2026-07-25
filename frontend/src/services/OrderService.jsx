const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/orders`;

export async function checkout(userId) {
  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error("Checkout failed");
  }

  return response.json();
}

export async function getOrder(orderId) {
  const response = await fetch(`${API_URL}/${orderId}`);
  if (!response.ok) {
    throw new Error("Order not found");
  }
  return response.json();
}

export async function getOrdersByUser(userId) {
  const response = await fetch(`${API_URL}/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}