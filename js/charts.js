let trendChartInstance = null;

function renderTrendChart(results) {
  const ctx = document.getElementById("trendChart").getContext("2d");
  const labels = results.map((r, i) => `S${i + 1}`);
  const scores = results.map(r => r.score);
  const accuracy = results.map(r => r.accuracy);
  const timeTaken = results.map(r => r.time_taken);

  if (trendChartInstance) trendChartInstance.destroy();

  trendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Score",
          data: scores,
          borderColor: "#3f51b5",
          backgroundColor: "rgba(63,81,181,0.15)",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Accuracy (%)",
          data: accuracy,
          borderColor: "#16a34a",
          tension: 0.3,
        },
        {
          label: "Time (s)",
          data: timeTaken,
          borderColor: "#f59e0b",
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom" } },
      scales: { y: { beginAtZero: true } },
    },
  });
}