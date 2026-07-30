const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/identity`;

const TOKEN_KEY = "ev_token";
const USER_KEY = "ev_user";

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function saveSession({ token, userId, email, role }) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ userId, email, role })
  );
}

export async function register({ firstName, lastName, email, password }) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function login({ email, password }) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (data.success && data.token) {
    saveSession({
      token: data.token,
      userId: data.userId,
      email: data.email,
      role: data.role,
    });
  }

  return data;
}

export async function logout() {
  const token = getStoredToken();

  if (token) {
    try {
      await fetch(`${API_URL}/logout?token=${encodeURIComponent(token)}`, {
        method: "POST",
      });
    } catch {
      // Still clear local session even if the request fails
    }
  }

  clearSession();
  return { success: true, message: "Logout successful." };
}

export async function validateSession() {
  const token = getStoredToken();
  if (!token) return { valid: false };

  try {
    const response = await fetch(
      `${API_URL}/validate?token=${encodeURIComponent(token)}`
    );
    const data = await response.json();
    if (!data.valid) clearSession();
    return data;
  } catch {
    return { valid: false };
  }
}