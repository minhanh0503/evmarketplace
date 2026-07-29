const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/chatbot`;

export async function sendChatMessage(message) {
  const response = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to reach the chatbot");
  }

  return response.json();
}