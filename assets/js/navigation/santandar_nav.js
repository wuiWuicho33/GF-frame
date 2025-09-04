/* =====================
# STANDAR NAV
===================== */  
// JavaScript para la funcionalidad del navbar

// Función para manejar el toggler en dispositivos móviles
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarMenu = document.querySelector('.navbar-menu');

// Función para alternar la visibilidad del menú
navbarToggler.addEventListener('click', () => {
  navbarMenu.classList.toggle('active');
});

// Función para manejar el menú desplegable en dispositivos móviles
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.dropdown-toggle');
  const menu = dropdown.querySelector('.dropdown-menu');

  // Mostrar el menú desplegable al hacer clic en el enlace
  toggle.addEventListener('click', (e) => {
    e.preventDefault();  // Evitar que el enlace navegue
    menu.classList.toggle('active');
  });
});

// Cerrar el menú desplegable si se hace clic fuera del dropdown
document.addEventListener('click', (e) => {
  dropdowns.forEach(dropdown => {
    const menu = dropdown.querySelector('.dropdown-menu');
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    // Si se hace clic fuera del dropdown, cerramos el menú
    if (!dropdown.contains(e.target) && menu.classList.contains('active')) {
      menu.classList.remove('active');
    }
  });
});


// Este estracto de código es para cerrar el navbar cuando se hace clic en un enlace del menú en vista móvil
const navbarLinks = document.querySelectorAll('.navbar-link');

navbarLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Verificar si el navbar-menu está activo y cerrarlo si es así
    if (navbarMenu.classList.contains('active')) {
      navbarMenu.classList.remove('active');
    }
  });
});

