import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkout } from "../services/OrderService";
import { formatCurrency } from "../utils/pricing";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(location.state?.userId || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const checkoutPreview = location.state;

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

      {checkoutPreview?.subtotal != null && !order && (
        <div className="mb-6 max-w-md space-y-2 rounded bg-white p-6 shadow">
          <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>{formatCurrency(checkoutPreview.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>HST (13%)</span>
            <span>{formatCurrency(checkoutPreview.hst)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-xl font-semibold">
            <span>Total</span>
            <span>{formatCurrency(checkoutPreview.total)}</span>
          </div>
        </div>
      )}

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
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotalAmount)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>HST (13%)</span>
              <span>{formatCurrency(order.hstAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
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
