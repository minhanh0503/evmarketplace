import { createContext, useContext, useState } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareVehicles, setCompareVehicles] = useState([]);

  const handleCompare = (vehicle) => {
    setCompareVehicles((prev) => {
      // remove vehicle
      if (prev.some((v) => v.id === vehicle.id)) {
        return prev.filter((v) => v.id !== vehicle.id);
      }

      // limit 2
      if (prev.length >= 2) {
        alert("You can compare only 2 vehicles.");
        return prev;
      }

      return [...prev, vehicle];
    });
  };

  const removeCompare = (id) => {
    setCompareVehicles((prev) => prev.filter((vehicle) => vehicle.id !== id));
  };
  const clearCompare = () => {
    setCompareVehicles([]);
  };

  // const handleCompare = (vehicle) => {
  //     // Already selected
  //     if (compareVehicles.some((v) => v.id === vehicle.id)) return;

  //     // compare 2 vehicles
  //     if (compareVehicles.length >= 2) {
  //       alert("You can compare up to 2 vehicles.");
  //       return;
  //     }

  //     setCompareVehicles([...compareVehicles, vehicle]);
  //   };
  return (
    <CompareContext.Provider
      value={{
        compareVehicles,
        handleCompare,
        removeCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
