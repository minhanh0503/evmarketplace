import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { checkout } from "../services/OrderService";
import { getStoredUser } from "../services/AuthService";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const userId =
    location.state?.userId?.toString() ||
    storedUser?.userId?.toString() ||
    "";

  const [billingName, setBillingName] = useState(
    storedUser
      ? [storedUser.firstName, storedUser.lastName].filter(Boolean).join(" ")
      : ""
  );
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveShippingAddress = sameAsBilling
    ? billingAddress
    : shippingAddress;

  const isFormValid =
    userId.trim() &&
    billingName.trim() &&
    billingAddress.trim() &&
    effectiveShippingAddress.trim() &&
    cardNumber.replace(/\s/g, "").length >= 13 &&
    cardExpiry.trim() &&
    cardCvv.trim().length >= 3;

  const handlePlaceOrder = async () => {
    if (!isFormValid) {
      setError("Please fill in all billing, shipping, and payment fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Billing/shipping/card details are collected here to satisfy the
      // checkout use case (UC-P2/UC-P3), but only userId is ever sent to
      // the backend. The card number is never transmitted or stored —
      // per the assignment's security requirement, the visitor must type
      // it in each time, but it is discarded client-side immediately
      // after this call.
      const result = await checkout(userId);
      setOrder(result);
    } catch (err) {
      setError(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              Please sign in to complete checkout.
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
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/cart")}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        {storedUser?.email && (
          <p className="text-sm text-gray-500 mb-6">
            Signed in as {storedUser.email}
          </p>
        )}

        {!order && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Billing Information
              </h2>

              <label className="text-xs uppercase text-gray-500 font-semibold">
                Billing name
              </label>
              <input
                type="text"
                placeholder="Full name on card"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <label className="text-xs uppercase text-gray-500 font-semibold mt-4 block">
                Billing address
              </label>
              <input
                type="text"
                placeholder="Street, city, postal code"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Shipping Information
                </h2>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="rounded border-gray-300 focus:ring-blue-500"
                  />
                  Same as billing
                </label>
              </div>

              {!sameAsBilling && (
                <>
                  <label className="text-xs uppercase text-gray-500 font-semibold">
                    Shipping address
                  </label>
                  <input
                    type="text"
                    placeholder="Street, city, postal code"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
            </div>

            <div>
              <label className="text-xs uppercase text-gray-500 font-semibold">
                Card number
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase text-gray-500 font-semibold">
                  Expiry
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  maxLength={5}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs uppercase text-gray-500 font-semibold">
                  CVV
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  maxLength={4}
                  className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              onClick={handlePlaceOrder}
              disabled={!isFormValid || loading}
              className="w-full bg-gray-950 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Placing order..." : "Confirm Order"}
            </button>
          </div>
        )}

        {order && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <p className="font-semibold mb-2 text-xl">
              Order #{order.id} — Status: {order.status}
            </p>
            <p className="text-gray-700 mb-4">Total: ${order.totalAmount}</p>

            {order.status === "CONFIRMED" && (
              <p className="text-green-600 font-semibold mb-4">
                Order Successfully Completed.
              </p>
            )}

            {order.status === "DENIED" && (
              <p className="text-red-600 font-semibold mb-4">
                Credit Card Authorization Failed. Your cart has been kept so
                you can try again.
              </p>
            )}

            {order.status === "CONFIRMED" && (
              <div className="border border-gray-200 rounded-2xl p-6 mt-4 mb-4 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-4">Order Receipt</h3>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>
                    <span className="font-medium text-gray-900">Order ID:</span>{" "}
                    #{order.id}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Date:</span>{" "}
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Billed to:</span>{" "}
                    {billingName}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Billing address:</span>{" "}
                    {billingAddress}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">Shipping address:</span>{" "}
                    {effectiveShippingAddress}
                  </p>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm py-1"
                      >
                        <span>
                          {item.vehicle
                            ? `${item.vehicle.make} ${item.vehicle.model} (${item.vehicle.year})`
                            : `Vehicle ID: ${item.vehicleId}`}{" "}
                          × {item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span>${Number(order.totalAmount).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="mt-4 text-sm text-blue-600 hover:underline"
                >
                  Print receipt
                </button>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/cart")}
                className="text-gray-600 hover:underline"
              >
                Back to Cart
              </button>
              <button
                onClick={() => navigate("/orders", { state: { userId } })}
                className="text-gray-600 hover:underline"
              >
                View Order History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}