import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { getCart, removeCartItem } from "../services/CartService";
import { getStoredUser } from "../services/AuthService";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  // Prefer route state, then logged-in session
  const [userId] = useState(
    () =>
      location.state?.userId?.toString() ||
      storedUser?.userId?.toString() ||
      ""
  );
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCart = async (id = userId) => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const data = await getCart(id);
      setCartItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadCart(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

  // Not signed in — prompt them to log in
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              Please sign in to view your cart.
            </p>
            <Link
              to="/login"
              className="inline-block bg-gray-950 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        {storedUser?.email && (
          <p className="text-sm text-gray-500 mb-6">
            Signed in as {storedUser.email}
          </p>
        )}

        {loading && <p>Loading cart...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && cartItems.length === 0 && (
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
              className="bg-gray-950 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}