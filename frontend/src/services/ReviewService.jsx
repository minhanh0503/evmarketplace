const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/vehicle-reviews`;


// Get reviews for a specific vehicle
export async function getReviewsByVehicleId(vehicleId) {

    const response = await fetch(
        `${API_URL}/vehicle/${vehicleId}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch vehicle reviews");
    }

    return response.json();
}



// Get average rating for a vehicle
export async function getAverageRating(vehicleId) {

    const response = await fetch(
        `${API_URL}/vehicle/${vehicleId}/rating`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch average rating");
    }

    return response.json();
}



// Create a review
export async function createVehicleReview(review) {

    const response = await fetch(
        API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        }
    );


    if (!response.ok) {
        throw new Error("Failed to create review");
    }


    return response.json();
}



// Delete review
export async function deleteVehicleReview(id) {

    const response = await fetch(
        `${API_URL}/${id}`,
        {
            method: "DELETE"
        }
    );


    if (!response.ok) {
        throw new Error("Failed to delete review");
    }
}