import { useEffect, useMemo, useState } from "react";

/**
 * Client-side vehicle configurator.
 * Calls onTotalChange(totalNumber) whenever the estimated total changes
 * so the parent can add-to-cart at the customized price.
 */
const PAINT = [
  { id: "stock", label: "Factory color", price: 0 },
  { id: "pearl", label: "Pearl White", price: 1200 },
  { id: "midnight", label: "Midnight Black", price: 900 },
  { id: "racing", label: "Racing Red", price: 1500 },
  { id: "silver", label: "Liquid Silver", price: 800 },
];

const WHEELS = [
  { id: "stock", label: "Standard 18\"", price: 0 },
  { id: "aero", label: "Aero 19\"", price: 1100 },
  { id: "sport", label: "Sport 20\"", price: 2200 },
  { id: "carbon", label: "Carbon Fiber 21\"", price: 4500 },
];

const INTERIOR = [
  { id: "stock", label: "Cloth", price: 0 },
  { id: "vegan", label: "Vegan Leather", price: 1800 },
  { id: "premium", label: "Premium Leather", price: 3200 },
  { id: "carbon", label: "Carbon + Alcantara", price: 5100 },
];

const PACKS = [
  { id: "none", label: "None", price: 0 },
  { id: "autopilot", label: "Driver Assist", price: 4000 },
  { id: "full", label: "Full Self-Drive Prep", price: 8000 },
  { id: "performance", label: "Performance Pack", price: 6500 },
];

function OptionGroup({ title, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-2">
        {title}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`
                text-left px-4 py-3 rounded-xl border transition
                ${
                  selected
                    ? "border-gray-950 bg-gray-950 text-white"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"
                }
              `}
            >
              <span className="font-medium block">{opt.label}</span>
              <span
                className={`text-sm ${selected ? "text-gray-300" : "text-gray-500"}`}
              >
                {opt.price === 0 ? "Included" : `+$${opt.price.toLocaleString()}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function VehicleCustomizer({ basePrice, onTotalChange }) {
  const [paint, setPaint] = useState("stock");
  const [wheels, setWheels] = useState("stock");
  const [interior, setInterior] = useState("stock");
  const [pack, setPack] = useState("none");

  const base = Number(basePrice) || 0;

  const breakdown = useMemo(() => {
    const p = PAINT.find((x) => x.id === paint);
    const w = WHEELS.find((x) => x.id === wheels);
    const i = INTERIOR.find((x) => x.id === interior);
    const k = PACKS.find((x) => x.id === pack);
    const extras =
      (p?.price || 0) + (w?.price || 0) + (i?.price || 0) + (k?.price || 0);
    return {
      paint: p,
      wheels: w,
      interior: i,
      pack: k,
      extras,
      total: base + extras,
    };
  }, [paint, wheels, interior, pack, base]);

  useEffect(() => {
    if (typeof onTotalChange === "function") {
      onTotalChange(breakdown.total);
    }
  }, [breakdown.total, onTotalChange]);

  return (
    <div className="bg-white mt-8 rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customize this vehicle</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Build your configuration — cart uses this estimated total.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase text-gray-500 font-semibold">Estimated total</p>
          <p className="text-3xl font-bold text-gray-900">
            ${breakdown.total.toLocaleString()}
          </p>
          {breakdown.extras > 0 && (
            <p className="text-sm text-gray-500">
              Base ${base.toLocaleString()} + options $
              {breakdown.extras.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <OptionGroup title="Paint" options={PAINT} value={paint} onChange={setPaint} />
        <OptionGroup title="Wheels" options={WHEELS} value={wheels} onChange={setWheels} />
        <OptionGroup
          title="Interior"
          options={INTERIOR}
          value={interior}
          onChange={setInterior}
        />
        <OptionGroup title="Packages" options={PACKS} value={pack} onChange={setPack} />
      </div>

      <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900 mb-1">Your build</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Paint: {breakdown.paint?.label}</li>
          <li>Wheels: {breakdown.wheels?.label}</li>
          <li>Interior: {breakdown.interior?.label}</li>
          <li>Package: {breakdown.pack?.label}</li>
        </ul>
      </div>
    </div>
  );
}