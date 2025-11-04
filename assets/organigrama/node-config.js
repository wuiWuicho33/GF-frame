window.addEventListener('DOMContentLoaded', () => {
    const dropdownWrapper = document.querySelector('.dropdown-wrapper');
    const dropdownBtn = document.getElementById('dropdownBtn');
    const dropdownList = document.querySelector('.dropdown-list');
    const checkboxes = dropdownList.querySelectorAll('input[type="checkbox"]');
    const saveBtn = document.getElementById('saveBtn');

    // Inicializa la visibilidad por defecto (debe coincidir con el HTML)
    window.visibleNodeFields = ['photo', 'name', 'role']; 

    // ------------------------------------------
    // 1. Lógica del Dropdown (Mostrar/Ocultar)
    // ------------------------------------------
    dropdownBtn.addEventListener('click', (e) => {
        dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
        e.stopPropagation();
    });

    // Cerrar dropdown si se hace clic fuera
    document.addEventListener('click', (e) => {
        if (dropdownList && !dropdownWrapper.contains(e.target) && dropdownList.style.display === 'block') {
            dropdownList.style.display = 'none';
        }
    });


    // ------------------------------------------
    // 2. Lógica de Cambio de Visibilidad (Solo actualiza el estado y habilita GUARDAR)
    // ------------------------------------------

    // Función que recalcula la lista visible y habilita el botón Guardar
    function handleCheckboxChange() {
        // 1. Recalcular las claves visibles a partir de los checkboxes
        window.visibleNodeFields = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.key);

        // 2. Habilitar el botón Guardar (¡esto es todo lo que hace!)
        saveBtn.disabled = false;
        // *** AJUSTE: Eliminada la línea que cambiaba el texto.
        // saveBtn.textContent = "Guardar Cambios"; 
    }
    
    // ------------------------------------------
    // 3. Funciones de Control de Estado (Comunicación con diagram.js)
    // ------------------------------------------
    
    /**
     * @description Expuesta para diagram.js. Se llama al pulsar "Editar".
     * Activa los listeners para que los cambios en el select habiliten el botón Guardar.
     */
    window.setupVisibilityChangeTracking = function() {
        // Asegurar que el estado inicial de los checkboxes refleje window.visibleNodeFields
        checkboxes.forEach(cb => {
            const isChecked = window.visibleNodeFields.includes(cb.dataset.key);
            cb.checked = isChecked;
            
            // Limpiar y volver a adjuntar el listener de cambio
            cb.removeEventListener('change', handleCheckboxChange); 
            cb.addEventListener('change', handleCheckboxChange);
        });
    }

    /**
     * @description Expuesta para diagram.js. Se llama al pulsar "Cancelar".
     * Revierte la variable global y el estado visual de los checkboxes al valor original.
     * @param {string[]} originalKeys - El array de campos visibles antes de la edición.
     */
    window.revertVisibilityState = function(originalKeys) {
        window.visibleNodeFields = originalKeys;
        
        // Actualizar el estado visual de los checkboxes
        checkboxes.forEach(cb => {
            const isChecked = originalKeys.includes(cb.dataset.key);
            cb.checked = isChecked;
        });
    }
});