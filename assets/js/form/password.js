/* =====================
# PASSWORD
===================== */  
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Función para mostrar/ocultar el ojito según si hay texto
function updateToggleVisibility() {
  if (passwordInput.value.length > 0) {
    togglePassword.style.display = 'block';
  } else {
    togglePassword.style.display = 'none';
    // Asegurar que vuelva al estado 'fa-eye' si estaba en 'fa-eye-slash'
    togglePassword.classList.add("fa-eye");
    togglePassword.classList.remove("fa-eye-slash");
  }
}

// Inicialmente oculto
updateToggleVisibility();

// Mostrar/ocultar mientras se escribe
passwordInput.addEventListener("input", updateToggleVisibility);

// Alternar visibilidad de contraseña al hacer click
togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.getAttribute("type") === "password";
  passwordInput.setAttribute("type", isPassword ? "text" : "password");

  // Cambiar entre fa-eye y fa-eye-slash
  togglePassword.classList.toggle("fa-eye");
  togglePassword.classList.toggle("fa-eye-slash");
});
