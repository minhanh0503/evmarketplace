import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCart, removeCartItem } from "../services/CartService";

// TODO: replace with the authenticated user's ID once Kiana's Identity
// Service is integrated. Using a manually-entered ID as a placeholder
// since login/session handling doesn't exist yet.
export default function Cart() {
  const location = useLocation();
  const [userId, setUserId] = useState(location.state?.userId || "");
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.userId) {
      loadCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const data = await getCart(userId);
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={loadCart}
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Load Cart
        </button>
      </div>

      {loading && <p>Loading cart...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && cartItems.length === 0 && userId && (
        <p className="text-gray-600">Your cart is empty.</p>
      )}

      <ul className="space-y-3">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <div>
              <p className="font-medium">Vehicle ID: {item.vehicleId}</p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity} × ${item.unitPrice}
              </p>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
          <button
            onClick={() => navigate("/checkout", { state: { userId } })}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}