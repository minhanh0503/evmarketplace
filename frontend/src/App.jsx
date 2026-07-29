import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import TestDrive from "./pages/TestDrive";
import CarDetails from "./pages/CarDetails";
import ChatWidget from "./components/ChatWidget";
import LoanCalculator from "./pages/LoanCalculator";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles/:id" element={<CarDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/test-drive/:vehicleId" element={<TestDrive />} />
        <Route path="/loan-calculator" element={<LoanCalculator />} />
        <Route path="/loan-calculator/:vehicleId" element={<LoanCalculator />} />
      </Routes>
      <ChatWidget />
    </>
  );
}