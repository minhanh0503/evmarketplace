import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkout } from "../services/OrderService";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(location.state?.userId || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await checkout(userId);
      setOrder(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={handlePlaceOrder}
          disabled={!userId || loading}
          className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Placing order..." : "Place Order"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {order && (
        <div className="bg-white p-6 rounded shadow max-w-md">
          <p className="font-semibold mb-2">
            Order #{order.id} — Status: {order.status}
          </p>
          <p className="text-gray-700 mb-4">Total: ${order.totalAmount}</p>
          {order.status === "DENIED" && (
            <p className="text-red-600">
              Credit Card Authorization Failed. Your cart has been kept so you
              can try again.
            </p>
          )}
          <button
            onClick={() => navigate("/cart")}
            className="text-gray-600 hover:underline"
          >
            Back to Cart
          </button>
        </div>
      )}
    </div>
  );
}