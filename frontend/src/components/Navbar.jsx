import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoredUser, logout } from "../services/AuthService";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getStoredUser());

  // Re-read session on every route change (login/logout/register navigate)
  // and when the window regains focus.
  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  useEffect(() => {
    const onFocus = () => setUser(getStoredUser());
    const onStorage = () => setUser(getStoredUser());
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="font-bold text-gray-900 tracking-tight text-lg hover:text-blue-600 transition"
        >
          EV Marketplace
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3 text-sm font-medium">
          <Link
            to="/"
            className="px-2 py-1.5 text-gray-600 hover:text-gray-900 rounded-md"
          >
            Vehicles
          </Link>
          <Link
            to="/hot-deals"
            className="px-2 py-1.5 text-gray-600 hover:text-gray-900 rounded-md"
          >
            Hot Deals
          </Link>
          <Link
            to="/loan-calculator"
            className="px-2 py-1.5 text-gray-600 hover:text-gray-900 rounded-md hidden sm:inline"
          >
            Loan Calc
          </Link>
          <Link
            to="/cart"
            className="px-2 py-1.5 text-gray-600 hover:text-gray-900 rounded-md"
          >
            Cart
          </Link>

          {user ? (
            <div className="flex items-center gap-2 ml-1">
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-800 border border-green-200 px-2.5 py-1 text-xs font-medium max-w-[180px]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                <span className="truncate">{user.email}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-gray-950 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-2 py-1.5 text-gray-600 hover:text-gray-900 rounded-md"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="ml-1 bg-gray-950 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}