import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVehicleById } from "../services/VehicleService";

export default function LoanCalculator() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loadingVehicle, setLoadingVehicle] = useState(!!vehicleId);

  const [price, setPrice] = useState(35000);
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [aprPercent, setAprPercent] = useState(6.5);
  const [termMonths, setTermMonths] = useState(60);

  useEffect(() => {
    if (!vehicleId) return;

    const fetchVehicle = async () => {
      try {
        setLoadingVehicle(true);
        const data = await getVehicleById(vehicleId);
        setVehicle(data);

        const finalPrice =
          (Number(data.price) || 0) - (Number(data.discount) || 0);
        setPrice(finalPrice);
      } catch (err) {
        console.error("Error fetching vehicle for loan calculator:", err);
      } finally {
        setLoadingVehicle(false);
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const principal = Math.max(price - downPayment - tradeIn, 0);
  const monthlyRate = aprPercent / 100 / 12;
  const n = Number(termMonths) || 1;

  const monthlyPayment =
    monthlyRate === 0
      ? principal / n
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
        (Math.pow(1 + monthlyRate, n) - 1);

  const totalPaid = monthlyPayment * n;
  const totalInterest = totalPaid - principal;

  const money = (num) =>
    (Number.isFinite(num) ? num : 0).toLocaleString(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          {vehicleId ? "Back to vehicle" : "Back"}
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Loan Calculator
          </h1>

          {vehicleId && (
            <p className="text-gray-500 mt-2">
              {loadingVehicle
                ? "Loading vehicle price..."
                : vehicle
                ? `Estimating for ${vehicle.make} ${vehicle.model} (${vehicle.year})`
                : "Vehicle not found — using manual price entry."}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Field
              label="Vehicle Price"
              value={price}
              onChange={setPrice}
              prefix="$"
            />
            <Field
              label="Down Payment"
              value={downPayment}
              onChange={setDownPayment}
              prefix="$"
            />
            <Field
              label="Trade-In Value"
              value={tradeIn}
              onChange={setTradeIn}
              prefix="$"
            />
            <Field
              label="Interest Rate (APR)"
              value={aprPercent}
              onChange={setAprPercent}
              suffix="%"
              step="0.1"
            />

            <div>
              <label className="text-xs uppercase text-gray-500 font-semibold">
                Loan Term
              </label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={24}>24 months</option>
                <option value={36}>36 months</option>
                <option value={48}>48 months</option>
                <option value={60}>60 months</option>
                <option value={72}>72 months</option>
                <option value={84}>84 months</option>
              </select>
            </div>
          </div>

          <div className="mt-10 bg-gray-950 rounded-2xl p-8 text-white">
            <p className="text-sm uppercase text-gray-300 font-semibold">
              Estimated Monthly Payment
            </p>
            <p className="text-5xl font-extrabold mt-2">
              {money(monthlyPayment)}
              <span className="text-lg font-medium text-gray-300">/mo</span>
            </p>

            <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
              <div>
                <p className="text-gray-400">Loan Amount</p>
                <p className="font-semibold text-lg">{money(principal)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Interest</p>
                <p className="font-semibold text-lg">{money(totalInterest)}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            This estimate is for informational purposes only and does not
            constitute a loan offer. Actual rates and terms depend on credit
            approval.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, prefix, suffix, step = "1" }) {
  return (
    <div>
      <label className="text-xs uppercase text-gray-500 font-semibold">
        {label}
      </label>
      <div className="mt-1 flex items-center border border-gray-200 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
        {prefix && <span className="text-gray-400 mr-1">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full outline-none text-lg font-semibold text-gray-900"
        />
        {suffix && <span className="text-gray-400 ml-1">{suffix}</span>}
      </div>
    </div>
  );
}