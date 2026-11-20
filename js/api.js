const API_BASE = "http://localhost:5000/api";

async function fetchDashboard(userId) {
  const res = await fetch(`${API_BASE}/dashboard/${userId}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function postGameResult(result) {
  const res = await fetch(`${API_BASE}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  return res.json();
}