window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('myModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');
  const closeBtn = document.getElementById('modalClose');

  // Áreas simuladas
  const areas = [
    "Tecnologías de la Información",
    "Finanzas",
    "Recursos Humanos",
    "Marketing",
    "Operaciones",
    "Ventas",
    "Logística"
  ];

  // Función para generar número de 4 cifras
  function generarNumeroEmpleado() {
    return Math.floor(1000 + Math.random() * 9000); // 1000 - 9999
  }

  // Función para generar sueldo simulado
  function generarSueldo() {
    const sueldo = Math.floor(15000 + Math.random() * 35000); // $15,000 - $50,000
    return sueldo.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }

  function showModal(nodeData) {
    // Datos dinámicos
    const numeroEmpleado = generarNumeroEmpleado();
    const area = areas[Math.floor(Math.random() * areas.length)];
    const sueldo = generarSueldo();

    // Título fijo
    title.textContent = "Datos del empleado";

    // Información detallada en el body
    body.innerHTML = `
      <p><strong>Nombre:</strong> ${nodeData.name}</p>
      <p><strong>Cargo:</strong> ${nodeData.role}</p>
      <p><strong>No. Empleado:</strong> ${numeroEmpleado}</p>
      <p><strong>Área:</strong> ${area}</p>
      <p><strong>Sueldo:</strong> ${sueldo}</p>
    `;

    overlay.style.display = 'block';
    modal.style.display = 'block';
  }

  function closeModal() {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  window.showModal = showModal; // Exponer global
});
