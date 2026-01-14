
// Modal para el login


// Overlay para oscurecer el resto de la página
const overlay = document.createElement("div");
overlay.id = "loginOverlay";

// Modal
const loginModal = document.createElement("div");
loginModal.id = "loginModal";

loginModal.innerHTML = `
  <h2>Iniciar sesión</h2>
  <form id="loginForm">
    <input type="text" id="user" placeholder="Usuario" required>
    <input type="password" id="pass" placeholder="Contraseña" required>
    <button type="submit">Entrar</button>
  </form>
`;

overlay.appendChild(loginModal);
document.body.appendChild(overlay);

// Abrir modal
const loginLink = [...enlaces].find(e => e.textContent === "Login");
loginLink.addEventListener("click", e => {
  e.preventDefault();
  overlay.classList.add("mostrar");
});

// Cerrar al hacer click fuera
overlay.addEventListener("click", e => {
  if (e.target === overlay) overlay.classList.remove("mostrar");
});

// LOGIN - Guardar datos completos

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const userInput = document.getElementById("user").value;

  // Simulación login: datos mínimos
const usuarioData = {
  nombre: userInput,   
  usuario: userInput,
  email: "Sin email registrado",
  intereses: []
};

localStorage.setItem("usuarioActivo", JSON.stringify(usuarioData));
localStorage.setItem("userLogged", "true");

  overlay.classList.remove("mostrar");
  location.reload();
});


// LOGOUT

const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("userLogged");
    localStorage.removeItem("usuarioActivo");
    location.reload();
  });
}



// // Modal para el login --------------------
// // Overlay para oscurecer el resto de la página
// const overlay = document.createElement("div");
// overlay.id = "loginOverlay";

// // Modal
// const loginModal = document.createElement("div");
// loginModal.id = "loginModal";

// loginModal.innerHTML = `
//   <h2>Iniciar sesión</h2>
//   <form id="loginForm">
//     <input type="text" id="user" placeholder="Usuario" required>
//     <input type="password" id="pass" placeholder="Contraseña" required>
//     <button type="submit">Entrar</button>
//   </form>
// `;

// overlay.appendChild(loginModal);
// document.body.appendChild(overlay);

// // Abrir modal
// const loginLink = [...enlaces].find(e => e.textContent === "Login");

// loginLink.addEventListener("click", e => {
//   e.preventDefault();
//   overlay.classList.add("mostrar");
// });

// // Cerrar al hacer click fuera
// overlay.addEventListener("click", e => {
//   if (e.target === overlay) {
//     overlay.classList.remove("mostrar");
//   }
// });


// // Fingimos el login: cambian los botones

// const loginForm = document.getElementById("loginForm");

// loginForm.addEventListener("submit", e => {
//   e.preventDefault();

//   const userInput = document.getElementById("user").value;

//   // Simulación de login correcto
//   localStorage.setItem("userLogged", "true");
//   localStorage.setItem("userName", userInput);

//   overlay.classList.remove("mostrar");

//   // Recargar para actualizar estado
//   location.reload();
// });

// // FUNCIONALIDAD DE CERRAR SESIÓN 
// const logout = document.getElementById("logout");
// if (logout) {
//   logout.addEventListener("click", e => {
//     e.preventDefault();
//     localStorage.removeItem("userLogged");
//     localStorage.removeItem("userName");
//     location.reload();
//   });
// }