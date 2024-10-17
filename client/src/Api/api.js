const API_URL = "http://localhost:5000/api/auth";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
}

export async function loginVictim(credentials) {
  const response = await fetch(`${API_URL}/login-victim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}

export async function registerVictim(credentials) {
  const response = await fetch(`${API_URL}/register-victim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}

export async function loginVolunteer(credentials) {
  const response = await fetch(`${API_URL}/login-volunteer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}

export async function registerVolunteer(credentials) {
  const response = await fetch(`${API_URL}/register-volunteer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}
