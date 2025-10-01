// ====== 1. Gráfica de Barras ======
const ctxBar = document.getElementById('barChart').getContext('2d');
new Chart(ctxBar, {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [{
      label: 'Ventas ($)',
      data: [1200, 1900, 3000, 2500, 3200, 4000],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

// ====== 2. Gráfica de Líneas ======
const ctxLine = document.getElementById('lineChart').getContext('2d');
new Chart(ctxLine, {
  type: 'line',
  data: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [{
      label: 'Usuarios Activos',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.3,
      fill: true
    }]
  },
  options: { responsive: true }
});

// ====== 3. Gráfica de Pastel ======
const ctxPie = document.getElementById('pieChart').getContext('2d');
new Chart(ctxPie, {
  type: 'pie',
  data: {
    labels: ['Chrome', 'Firefox', 'Edge', 'Safari', 'Otros'],
    datasets: [{
      label: 'Navegadores',
      data: [60, 15, 10, 10, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ]
    }]
  },
  options: { responsive: true }
});

// ====== 4. Gráfica de Radar ======
const ctxRadar = document.getElementById('radarChart').getContext('2d');
new Chart(ctxRadar, {
  type: 'radar',
  data: {
    labels: ['Fuerza', 'Velocidad', 'Resistencia', 'Agilidad', 'Técnica'],
    datasets: [{
      label: 'Jugador A',
      data: [65, 59, 90, 81, 56],
      fill: true,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointBackgroundColor: 'rgba(255, 99, 132, 1)'
    }, {
      label: 'Jugador B',
      data: [28, 48, 40, 19, 96],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)'
    }]
  },
  options: { responsive: true }
});

// ====== 5. Gráfica Polar ======
const ctxPolar = document.getElementById('polarChart').getContext('2d');
new Chart(ctxPolar, {
  type: 'polarArea',
  data: {
    labels: ['Rojo', 'Azul', 'Amarillo', 'Verde', 'Morado'],
    datasets: [{
      label: 'Colores',
      data: [11, 16, 7, 3, 14],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ]
    }]
  },
  options: { responsive: true }
});

// ====== 6. Gráfica Dona ======
const ctxDoughnut = document.getElementById('doughnutChart').getContext('2d');
new Chart(ctxDoughnut, {
  type: 'doughnut',
  data: {
    labels: ['Rojo', 'Azul', 'Amarillo'],
    datasets: [{
      label: 'Colores',
      data: [300, 50, 100],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ]
    }]
  },
  options: { responsive: true }
});

// ====== 7. Gráfica de Burbuja ======
const ctxBubble = document.getElementById('bubbleChart').getContext('2d');
new Chart(ctxBubble, {
  type: 'bubble',
  data: {
    datasets: [{
      label: 'Burbujas',
      data: [
        {x: 10, y: 20, r: 15},
        {x: 25, y: 10, r: 10},
        {x: 40, y: 25, r: 20},
        {x: 20, y: 30, r: 8}
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  }
});

// ====== 8. Gráfica de Dispersión ======
const ctxScatter = document.getElementById('scatterChart').getContext('2d');
new Chart(ctxScatter, {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Puntos de datos',
      data: [
        {x: -10, y: 0},
        {x: -5, y: 5},
        {x: 0, y: 10},
        {x: 5, y: 5},
        {x: 10, y: 0}
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.8)'
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: { type: 'linear', position: 'bottom' }
    }
  }
});

// ====== 9. Gráfica Mixta (Barras + Línea) ======
const ctxMixed = document.getElementById('mixedChart').getContext('2d');
new Chart(ctxMixed, {
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        type: 'bar',
        label: 'Ventas',
        data: [200, 300, 400, 500, 600],
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      },
      {
        type: 'line',
        label: 'Promedio',
        data: [250, 320, 420, 480, 580],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        fill: false
      }
    ]
  },
  options: { responsive: true }
});
