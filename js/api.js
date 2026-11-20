const API_BASE = "https://neuroguard-backend-1.onrender.com/api";

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