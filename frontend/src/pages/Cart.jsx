import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCart, removeCartItem } from "../services/CartService";
import { getStoredUser } from "../services/AuthService";
import {
  calculateCheckoutAmounts,
  formatCurrency,
} from "../utils/pricing";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [userId] = useState(
    () =>
      location.state?.userId?.toString() ||
      storedUser?.userId?.toString() ||
      "",
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

  const { subtotal, hst, total } =
    calculateCheckoutAmounts(cartItems);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
              bg-white border border-gray-200 text-gray-700 font-medium text-sm
              shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
              transition-all duration-200"
          >
            Continue Shopping
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shopping Cart
          </h1>

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
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-white border border-gray-200 text-gray-700 font-medium text-sm
            shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
            transition-all duration-200"
        >
          Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>

        {storedUser?.email && (
          <p className="text-sm text-gray-500 mb-6">
            Signed in as {storedUser.email}
          </p>
        )}

        {loading && <p>Loading cart...</p>}

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {!loading && cartItems.length === 0 && (
          <p className="text-gray-600">Your cart is empty.</p>
        )}

        <ul className="space-y-3">
          {cartItems.map((item) => {
            const vehicle = item.vehicle;

            return (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white p-4 rounded-xl shadow gap-4"
              >
                <div className="flex items-center gap-4 flex-1">
                  {vehicle?.imageUrl && (
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  <div>
                    <p className="font-semibold text-gray-900">
                      {vehicle
                        ? `${vehicle.make} ${vehicle.model} (${vehicle.year})`
                        : `Vehicle ID: ${item.vehicleId}`}
                    </p>

                    {vehicle?.color && (
                      <p className="text-sm text-gray-500">
                        {vehicle.color}
                      </p>
                    )}

                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} ×{" "}
                      {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:underline whitespace-nowrap"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>

        {cartItems.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-6">
            <div className="w-full max-w-sm space-y-2 rounded-xl bg-white p-4 shadow">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>HST (13%)</span>
                <span>{formatCurrency(hst)}</span>
              </div>

              <div className="flex justify-between border-t pt-2 text-xl font-semibold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    userId,
                    subtotal,
                    hst,
                    total,
                  },
                })
              }
              className="bg-gray-950 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}