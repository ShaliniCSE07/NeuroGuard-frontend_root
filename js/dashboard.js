const loadBtn = document.getElementById("loadBtn");
const statusMsg = document.getElementById("statusMsg");

loadBtn.addEventListener("click", loadDashboard);
window.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
  const userId = document.getElementById("userIdInput").value.trim() || "U001";
  statusMsg.textContent = "Loading…";
  try {
    const data = await fetchDashboard(userId);
    renderDashboard(data);
    statusMsg.textContent = `Loaded ${data.total_sessions} sessions for ${userId}`;
  } catch (err) {
    statusMsg.textContent = `Error: ${err.message}`;
    console.error(err);
  }
}

function renderDashboard(data) {
  renderSummary(data);
  renderRadar(data.radar);
  renderRecommendations(data.recommendations);
  renderHistory(data.results);
  renderTrendChart(data.results);
}

function renderSummary(data) {
  document.getElementById("statSessions").textContent = data.total_sessions;

  const severities = Object.values(data.radar.games)
    .map(g => g.severity)
    .filter(Boolean);
  const worst = severities.includes("attention")
    ? "attention"
    : severities.includes("watch")
    ? "watch"
    : severities.length
    ? "stable"
    : "–";
    
  const severityEl = document.getElementById("statSeverity");
  severityEl.textContent = worst.toUpperCase();
  
  // Remove the old inline red/green colors so the CSS can take over beautifully
  severityEl.style.color = ""; 
  severityEl.style.fontSize = "";

  const flags = Object.values(data.radar.games).flatMap(g => g.flags || []);
  document.getElementById("statFlags").textContent = flags.length;
}

function renderRadar(radar) {
  const container = document.getElementById("radarContainer");
  container.innerHTML = "";
  const games = Object.entries(radar.games || {});
  if (!games.length) {
    container.textContent = "No data yet.";
    return;
  }
  for (const [gameType, analysis] of games) {
    const div = document.createElement("div");
    div.className = "radar-game";

    if (analysis.status !== "ok") {
      div.innerHTML = `<div class="radar-title">${prettyGame(gameType)}
        <span class="badge watch">insufficient data</span></div>
        <div class="change-list"><span>Play at least 3 sessions to see change analysis.</span></div>`;
      container.appendChild(div);
      continue;
    }

    const c = analysis.changes_pct;
    div.innerHTML = `
      <div class="radar-title">${prettyGame(gameType)}
        <span class="badge ${analysis.severity}">${analysis.severity}</span>
      </div>
      <div class="change-list">
        <span class="${c.score < 0 ? 'down' : 'up'}">Score: ${c.score > 0 ? '+' : ''}${c.score}%</span>
        <span class="${c.accuracy < 0 ? 'down' : 'up'}">Accuracy: ${c.accuracy > 0 ? '+' : ''}${c.accuracy}%</span>
        <span class="${c.time_taken > 0 ? 'down' : 'up'}">Time: ${c.time_taken > 0 ? '+' : ''}${c.time_taken}%</span>
        <span class="${c.mistakes > 0 ? 'down' : 'up'}">Mistakes: ${c.mistakes > 0 ? '+' : ''}${c.mistakes}%</span>
      </div>
      <p>${analysis.message}</p>
    `;
    container.appendChild(div);
  }
}

function renderRecommendations(recs) {
  const list = document.getElementById("recommendationsList");
  list.innerHTML = "";
  if (!recs || !recs.length) {
    list.innerHTML = "<li>No recommendations yet.</li>";
    return;
  }
  recs.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${prettyGame(r.game_type)}:</strong> ${r.recommendation}
      <br/><small>${r.reason}</small>`;
    list.appendChild(li);
  });
}

function renderHistory(results) {
  const tbody = document.querySelector("#historyTable tbody");
  tbody.innerHTML = "";
  [...results].reverse().forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(r.timestamp).toLocaleString()}</td>
      <td>${prettyGame(r.game_type)}</td>
      <td>${r.score}</td>
      <td>${r.accuracy}%</td>
      <td>${r.time_taken}</td>
      <td>${r.mistakes}</td>
    `;
    tbody.appendChild(tr);
  });
}

function prettyGame(g) {
  return g.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}