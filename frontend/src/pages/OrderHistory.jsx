import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getOrdersByUser } from "../services/OrderService";
import { getStoredUser } from "../services/AuthService";

export default function OrderHistory() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const userId =
    location.state?.userId?.toString() || storedUser?.userId?.toString() || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError("");
      const data = await getOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
             bg-white border border-gray-200 text-gray-700 font-medium text-sm
             shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
             transition-all duration-200"
          >
            Back to home
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Order History
          </h1>
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-600 mb-4">
              Please sign in to view your order history.
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
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl 
             bg-white border border-gray-200 text-gray-700 font-medium text-sm
             shadow-sm hover:shadow-md hover:bg-gray-50 hover:text-gray-900
             transition-all duration-200"
        >
          Back to home
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
        {storedUser?.email && (
          <p className="text-sm text-gray-500 mb-6">
            Signed in as {storedUser.email}
          </p>
        )}

        {loading && <p className="text-gray-600">Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && orders.length === 0 && (
          <p className="text-gray-600">You have no past orders yet.</p>
        )}

        <ul className="space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <p className="font-medium">Order #{o.id}</p>
                <span
                  className={`text-sm font-semibold ${
                    o.status === "CONFIRMED" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {o.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Total: ${o.totalAmount} ·{" "}
                {new Date(o.orderDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
