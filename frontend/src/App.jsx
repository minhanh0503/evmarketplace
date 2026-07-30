import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TestDrive from "./pages/TestDrive";
import CarDetails from "./pages/CarDetails";
import HotDeals from "./pages/HotDeals";
import ChatWidget from "./components/ChatWidget";
import LoanCalculator from "./pages/LoanCalculator";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import OrderHistory from "./pages/OrderHistory";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hot-deals" element={<HotDeals />} />
        <Route path="/vehicles/:id" element={<CarDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/test-drive/:vehicleId" element={<TestDrive />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/loan-calculator/:vehicleId" element={<LoanCalculator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<OrderHistory />} />
      </Routes>
      <ChatWidget />
    </>
  );
}