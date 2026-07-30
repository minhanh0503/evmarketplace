import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getOrdersByUser } from "../services/OrderService";

export default function OrderHistory() {
  const location = useLocation();
  const [userId, setUserId] = useState(location.state?.userId || "");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      setError("");
      const data = await getOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (location.state?.userId) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order History</h1>
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Enter your user ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button
          onClick={loadOrders}
          className="bg-gray-950 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Load Orders
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="bg-white p-4 rounded shadow">
            <p className="font-medium">
              Order #{o.id} — {o.status}
            </p>
            <p className="text-sm text-gray-600">
              Total: ${o.totalAmount} ·{" "}
              {new Date(o.orderDate).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}