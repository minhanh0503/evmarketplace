const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/vehicles`;

export async function searchVehicles(filters = {}) {

    const params = new URLSearchParams();

    if (filters.keyword) {
        params.append("keyword", filters.keyword);
    }

    if (filters.make) {
        params.append("make", filters.make);
    }

    if (filters.condition) {
        params.append("condition", filters.condition);
    }

    if (filters.year) {
        params.append("year", filters.year);
    }

    if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice);
    }

    if (filters.mileage) {
        params.append("mileage", filters.mileage);
    }

    if (filters.sort) {
        params.append("sort", filters.sort);
    }


    const response = await fetch(
        `${API_URL}/search?${params.toString()}`
    );


    if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
    }


    return response.json();
}


// Get all vehicles
export async function getAllVehicles() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
    }

    return response.json();
}


// Get vehicle by ID
export async function getVehicleById(id) {

    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Vehicle not found");
    }

    return response.json();
}


// Add vehicle
export async function createVehicle(vehicle) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(vehicle)
    });

    if (!response.ok) {
        throw new Error("Failed to create vehicle");
    }

    return response.json();
}


// Delete vehicle
export async function deleteVehicle(id) {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Failed to delete vehicle");
    }
}

// Get hot deals (vehicles with discount > 0)
export async function getHotDeals() {
  const response = await fetch(`${API_URL}/hot-deals`);

  if (!response.ok) {
    throw new Error("Failed to fetch hot deals");
  }

  return response.json();
}