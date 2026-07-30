import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkout } from "../services/OrderService";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(location.state?.userId || "");

  const [billingName, setBillingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid =
    userId.trim() &&
    billingName.trim() &&
    shippingAddress.trim() &&
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

      setCardNumber("");
      setCardExpiry("");
      setCardCvv("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
    return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {!order && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-6">
            {/* User ID — placeholder until real login/session exists */}
            <div>
              <label className="text-xs uppercase text-gray-500 font-semibold">
                User ID
              </label>
              <input
                type="text"
                placeholder="Enter your user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Billing information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Billing Information
              </h2>
              <label className="text-xs uppercase text-gray-500 font-semibold">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Shipping information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Shipping Information
              </h2>
              <label className="text-xs uppercase text-gray-500 font-semibold">
                Shipping Address
              </label>
              <input
                type="text"
                placeholder="123 Main St, Toronto, ON"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Payment information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Payment Information
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Your card number is never stored — you'll need to enter it
                again for future orders.
              </p>

              <label className="text-xs uppercase text-gray-500 font-semibold">
                Card Number
              </label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-xs uppercase text-gray-500 font-semibold">
                    Expiry (MM/YY)
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

            <button
              onClick={() => navigate("/cart")}
              className="text-gray-600 hover:underline"
            >
              Back to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}