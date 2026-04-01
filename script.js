/**
 * Cleaned Energy Dashboard Script
 * Fixed: duplicates, error handling, modularity
 */

document.addEventListener('DOMContentLoaded', function() {
  initMap();
  initCharts();
  initGauges();
});

function initMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement || typeof L === 'undefined') {
    console.warn('Map not initialized: missing element or Leaflet');
    return;
  }

  const map = L.map('map').setView([12.97, 77.59], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const markers = [
    [12.97, 77.59],
    [12.96, 77.58],
    [12.95, 77.60]
  ];
  markers.forEach(coord => L.marker(coord).addTo(map));
}

function initCharts() {
  const charts = [
    {
      id: 'weeklyChart',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        { data: [40, 80, 150, 120, 60, 50], backgroundColor: '#22c55e', borderRadius: 6 },
        { data: [60, 70, 90, 110, 40, 60], backgroundColor: '#3b82f6', borderRadius: 6 }
      ]
    },
    {
      id: 'energyChart',
      labels: ['01', '02', '03', '04', '05', '06', '07'],
      datasets: [
        { data: [80, 100, 120, 140, 160, 180, 200], backgroundColor: '#22c55e' },
        { data: [90, 70, 150, 110, 130, 120, 140], backgroundColor: '#3b82f6' }
      ]
    }
  ];

  charts.forEach(chartConfig => {
    const canvas = document.getElementById(chartConfig.id);
    if (!canvas || typeof Chart === 'undefined') {
      console.warn(`Chart ${chartConfig.id} not initialized`);
      return;
    }
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: chartConfig.labels,
        datasets: chartConfig.datasets
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  });
}

function initGauges() {
  const gauges = document.querySelectorAll('.gauge');
  if (gauges.length === 0) return;

  const circumference = 502; // 2 * π * 80

  gauges.forEach(g => {
    const val = parseFloat(g.dataset.value) || 0;
    if (val < 0 || val > 100) return;

    const offset = circumference - (circumference * val / 100);
    const rotation = val * 1.8;

    const svg = `
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" stroke="#e5e7eb" stroke-width="15" fill="none"/>
        <circle cx="100" cy="100" r="80"
          stroke="url(#grad)"
          stroke-width="15"
          stroke-linecap="round"
          fill="none"
          stroke-dasharray="${circumference}"
          stroke-dashoffset="${offset}"
          transform="rotate(-90 100 100)"
          pathLength="1"/>
        <line x1="100" y1="100" x2="100" y2="30"
          stroke="#0f172a"
          stroke-width="4"
          stroke-linecap="round"
          transform="rotate(${rotation} 100 100)"/>

        <defs>
          <linearGradient id="grad">
            <stop offset="0%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#3b82f6"/>
          </linearGradient>
        </defs>
      </svg>
    `;
    g.innerHTML = svg;
  });
}
