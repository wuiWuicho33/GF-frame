/* =====================
# THEME TOGGLE
===================== */  

const toggleTheme = () => {
  document.body.classList.toggle('dark-mode');
};

// Ejemplo con botón
document.getElementById('theme-btn').addEventListener('click', toggleTheme);
