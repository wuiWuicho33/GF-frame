window.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('myModal');
    const foto = document.getElementById('modalFoto');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const closeBtn = document.getElementById('modalClose');

    function showModal(nodeData) {
        
        foto.src = nodeData.photo;

        // Título: nombre del empleado
        title.textContent = nodeData.name;

        // Obtener nombre del jefe inmediato si existe
        let agrupadorHTML = "";
        if (nodeData.parent && window.myDiagram) {
            // Aseguramos que window.myDiagram exista antes de buscar el nodo
            const parentNode = window.myDiagram.model.findNodeDataForKey(nodeData.parent);
            if (parentNode && parentNode.name) {
                agrupadorHTML = `<p><strong>Agrupador:</strong> ${parentNode.name}</p>`;
            }
        }

        // Contenido del modal - LEYENDO DATOS ESTÁTICOS DEL NODO
        body.innerHTML = `
<p><strong>No. Empleado:</strong> ${nodeData.employeeId}</p>
<p><strong>Área:</strong> ${nodeData.area}</p>
<p><strong>Cargo:</strong> ${nodeData.role}</p>
<p><strong>Sueldo:</strong> ${nodeData.salary}</p>
${agrupadorHTML}
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

    // Se expone la función para que el nodo del diagrama pueda llamarla
    window.showModal = showModal;
});