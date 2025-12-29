//  Selecciona el elemento vacio de <header></header>
const header = document.querySelector("header");






//  SECTION 1: LOGO 
const sectionLogo = document.createElement("section");

const linkLogo = document.createElement("a");
linkLogo.href = "/index.html";
//Este tremendisimo cristo de aqui es mi logo vectorial en formato texto, que es lo que necesito para poder
//Poner el efecto de neon sobre el logo
//RUBEN POR DIOS QUE ME HE HECHO UN LOGO VECTORIAL ME MEREZCO EL SOBRESALIENTE
const svgLogo = `
<svg viewBox="0 0 2048 2048" xmlns="http://www.w3.org/2000/svg" class="logo">
  <g>
    <!-- Glow exterior más difuso -->
    <path
      class="logo-shape"
      d="m 600.9069,2000.1713 c -71.34845,-19.1585 -138.15483,-57.062 -196.6977,-102.1218 -46.03443,-35.4322 -84.3139,-81.0893 -117.21524,-128.9653 -24.41764,-35.531 -47.59225,-79.3826 -58.16984,-115.5177 -26.97981,-80.5003 -37.13759,-152.5922 -32.32434,-219.8885 2.06003,-40.5755 9.41904,-80.7409 19.6879,-120 21.86953,-86.3561 50.40379,-134.8211 95.724,-188.9675 62.77342,-74.9987 143.3215,-140.72374 234.3042,-176.6048 95.78982,-37.77685 205.05495,-45.5433 307.19514,-32.4987 50.4362,6.44134 95.75514,25.45601 141.5,44.1216 17.50348,7.14208 49.70858,26.63897 50.49788,25.81478 1.0788,-1.12655 1.7323,-705.96845 0.6556,-707.04545 -161.02805,-1.61564 -322.08131,-1.48606 -483.11977,-1.81996 -2.31011,-15.08832 0.66319,-240.962193 1.5994,-242.125913 389.43995,-3.174309 778.91417,-2.147485 1168.36687,-0.874091 2.4392,80.959484 1.8243,162.007314 2,243.000004 l -443,1 c 1.3039,195.68757 3.7957,1370.41913 1.579,1369.04883 -92.7097,-162.954 -191.7147,-331.4579 -197.5479,-342.0488 -13.9834,-26.1799 -29.7398,-51.1153 -47.5015,-74.9063 -3.24,-4.8362 -10.012,-12.2698 -27.0296,-29.2952 -22.87973,-22.8902 -27.99822,-27.8287 -44.26608,-38.7985 -32.48152,-21.903 -66.88005,-43.6568 -104.94997,-52.9018 -71.19545,-17.2892 -147.72455,-15.337 -219.78393,-2.1023 -19.71402,3.6207 -38.16265,12.7614 -56,21.9037 -25.58896,13.1153 -50.1493,28.6797 -72.41867,46.8698 -20.86879,17.0461 -39.87147,36.5945 -56.58492,57.7306 -16.25625,20.5579 -31.77243,42.3481 -41.94993,66.5 -21.0291,49.9034 -36.17663,103.8712 -37.80398,158 -1.48509,49.3969 11.31855,98.7425 25.7749,146 2.89124,9.4514 7.30827,18.4216 12.06331,27.0864 16.24411,29.6005 33.9446,58.825 55.91929,84.4604 17.97944,20.9746 37.95417,41.0053 61.29792,55.779 48.34107,30.5939 101.73246,60.326 158.72627,65.2806 88.40168,7.685 182.36128,-14.2418 259.97581,-57.2523 44.71388,-24.7784 55.88978,-39.7083 107.36448,-109.5106 9.338,13.2547 104.8569,153.5718 112.4371,165.2219 -1.3534,2.5289 -35.6157,36.6543 -40.3016,40.3602 -41.37,39.4786 -89.1211,71.8772 -140.99998,94.4191 -54.92875,23.8671 -115.31236,35.4146 -174.94919,40.9152 -74.44734,6.8667 -151.84941,9.1221 -224.05493,-10.2666 z"
       fill="none" stroke="#8fa63f" stroke-width="80" opacity="0.15"/>


    <!-- Glow verde medio -->
    <path
      class="logo-shape"
      d="m 600.9069,2000.1713 c -71.34845,-19.1585 -138.15483,-57.062 -196.6977,-102.1218 -46.03443,-35.4322 -84.3139,-81.0893 -117.21524,-128.9653 -24.41764,-35.531 -47.59225,-79.3826 -58.16984,-115.5177 -26.97981,-80.5003 -37.13759,-152.5922 -32.32434,-219.8885 2.06003,-40.5755 9.41904,-80.7409 19.6879,-120 21.86953,-86.3561 50.40379,-134.8211 95.724,-188.9675 62.77342,-74.9987 143.3215,-140.72374 234.3042,-176.6048 95.78982,-37.77685 205.05495,-45.5433 307.19514,-32.4987 50.4362,6.44134 95.75514,25.45601 141.5,44.1216 17.50348,7.14208 49.70858,26.63897 50.49788,25.81478 1.0788,-1.12655 1.7323,-705.96845 0.6556,-707.04545 -161.02805,-1.61564 -322.08131,-1.48606 -483.11977,-1.81996 -2.31011,-15.08832 0.66319,-240.962193 1.5994,-242.125913 389.43995,-3.174309 778.91417,-2.147485 1168.36687,-0.874091 2.4392,80.959484 1.8243,162.007314 2,243.000004 l -443,1 c 1.3039,195.68757 3.7957,1370.41913 1.579,1369.04883 -92.7097,-162.954 -191.7147,-331.4579 -197.5479,-342.0488 -13.9834,-26.1799 -29.7398,-51.1153 -47.5015,-74.9063 -3.24,-4.8362 -10.012,-12.2698 -27.0296,-29.2952 -22.87973,-22.8902 -27.99822,-27.8287 -44.26608,-38.7985 -32.48152,-21.903 -66.88005,-43.6568 -104.94997,-52.9018 -71.19545,-17.2892 -147.72455,-15.337 -219.78393,-2.1023 -19.71402,3.6207 -38.16265,12.7614 -56,21.9037 -25.58896,13.1153 -50.1493,28.6797 -72.41867,46.8698 -20.86879,17.0461 -39.87147,36.5945 -56.58492,57.7306 -16.25625,20.5579 -31.77243,42.3481 -41.94993,66.5 -21.0291,49.9034 -36.17663,103.8712 -37.80398,158 -1.48509,49.3969 11.31855,98.7425 25.7749,146 2.89124,9.4514 7.30827,18.4216 12.06331,27.0864 16.24411,29.6005 33.9446,58.825 55.91929,84.4604 17.97944,20.9746 37.95417,41.0053 61.29792,55.779 48.34107,30.5939 101.73246,60.326 158.72627,65.2806 88.40168,7.685 182.36128,-14.2418 259.97581,-57.2523 44.71388,-24.7784 55.88978,-39.7083 107.36448,-109.5106 9.338,13.2547 104.8569,153.5718 112.4371,165.2219 -1.3534,2.5289 -35.6157,36.6543 -40.3016,40.3602 -41.37,39.4786 -89.1211,71.8772 -140.99998,94.4191 -54.92875,23.8671 -115.31236,35.4146 -174.94919,40.9152 -74.44734,6.8667 -151.84941,9.1221 -224.05493,-10.2666 z"
      fill="none" stroke="#a6b54f" stroke-width="50" opacity="0.35"/>

    <!-- Glow verde claro más cercano -->
    <path
      class="logo-shape"
      d="m 600.9069,2000.1713 c -71.34845,-19.1585 -138.15483,-57.062 -196.6977,-102.1218 -46.03443,-35.4322 -84.3139,-81.0893 -117.21524,-128.9653 -24.41764,-35.531 -47.59225,-79.3826 -58.16984,-115.5177 -26.97981,-80.5003 -37.13759,-152.5922 -32.32434,-219.8885 2.06003,-40.5755 9.41904,-80.7409 19.6879,-120 21.86953,-86.3561 50.40379,-134.8211 95.724,-188.9675 62.77342,-74.9987 143.3215,-140.72374 234.3042,-176.6048 95.78982,-37.77685 205.05495,-45.5433 307.19514,-32.4987 50.4362,6.44134 95.75514,25.45601 141.5,44.1216 17.50348,7.14208 49.70858,26.63897 50.49788,25.81478 1.0788,-1.12655 1.7323,-705.96845 0.6556,-707.04545 -161.02805,-1.61564 -322.08131,-1.48606 -483.11977,-1.81996 -2.31011,-15.08832 0.66319,-240.962193 1.5994,-242.125913 389.43995,-3.174309 778.91417,-2.147485 1168.36687,-0.874091 2.4392,80.959484 1.8243,162.007314 2,243.000004 l -443,1 c 1.3039,195.68757 3.7957,1370.41913 1.579,1369.04883 -92.7097,-162.954 -191.7147,-331.4579 -197.5479,-342.0488 -13.9834,-26.1799 -29.7398,-51.1153 -47.5015,-74.9063 -3.24,-4.8362 -10.012,-12.2698 -27.0296,-29.2952 -22.87973,-22.8902 -27.99822,-27.8287 -44.26608,-38.7985 -32.48152,-21.903 -66.88005,-43.6568 -104.94997,-52.9018 -71.19545,-17.2892 -147.72455,-15.337 -219.78393,-2.1023 -19.71402,3.6207 -38.16265,12.7614 -56,21.9037 -25.58896,13.1153 -50.1493,28.6797 -72.41867,46.8698 -20.86879,17.0461 -39.87147,36.5945 -56.58492,57.7306 -16.25625,20.5579 -31.77243,42.3481 -41.94993,66.5 -21.0291,49.9034 -36.17663,103.8712 -37.80398,158 -1.48509,49.3969 11.31855,98.7425 25.7749,146 2.89124,9.4514 7.30827,18.4216 12.06331,27.0864 16.24411,29.6005 33.9446,58.825 55.91929,84.4604 17.97944,20.9746 37.95417,41.0053 61.29792,55.779 48.34107,30.5939 101.73246,60.326 158.72627,65.2806 88.40168,7.685 182.36128,-14.2418 259.97581,-57.2523 44.71388,-24.7784 55.88978,-39.7083 107.36448,-109.5106 9.338,13.2547 104.8569,153.5718 112.4371,165.2219 -1.3534,2.5289 -35.6157,36.6543 -40.3016,40.3602 -41.37,39.4786 -89.1211,71.8772 -140.99998,94.4191 -54.92875,23.8671 -115.31236,35.4146 -174.94919,40.9152 -74.44734,6.8667 -151.84941,9.1221 -224.05493,-10.2666 z"
      fill="none" stroke="#c0d647" stroke-width="30" opacity="0.5"/>
    <!-- Logo base -->
    <path
      class="logo-shape"
      d="m 600.9069,2000.1713 c -71.34845,-19.1585 -138.15483,-57.062 -196.6977,-102.1218 -46.03443,-35.4322 -84.3139,-81.0893 -117.21524,-128.9653 -24.41764,-35.531 -47.59225,-79.3826 -58.16984,-115.5177 -26.97981,-80.5003 -37.13759,-152.5922 -32.32434,-219.8885 2.06003,-40.5755 9.41904,-80.7409 19.6879,-120 21.86953,-86.3561 50.40379,-134.8211 95.724,-188.9675 62.77342,-74.9987 143.3215,-140.72374 234.3042,-176.6048 95.78982,-37.77685 205.05495,-45.5433 307.19514,-32.4987 50.4362,6.44134 95.75514,25.45601 141.5,44.1216 17.50348,7.14208 49.70858,26.63897 50.49788,25.81478 1.0788,-1.12655 1.7323,-705.96845 0.6556,-707.04545 -161.02805,-1.61564 -322.08131,-1.48606 -483.11977,-1.81996 -2.31011,-15.08832 0.66319,-240.962193 1.5994,-242.125913 389.43995,-3.174309 778.91417,-2.147485 1168.36687,-0.874091 2.4392,80.959484 1.8243,162.007314 2,243.000004 l -443,1 c 1.3039,195.68757 3.7957,1370.41913 1.579,1369.04883 -92.7097,-162.954 -191.7147,-331.4579 -197.5479,-342.0488 -13.9834,-26.1799 -29.7398,-51.1153 -47.5015,-74.9063 -3.24,-4.8362 -10.012,-12.2698 -27.0296,-29.2952 -22.87973,-22.8902 -27.99822,-27.8287 -44.26608,-38.7985 -32.48152,-21.903 -66.88005,-43.6568 -104.94997,-52.9018 -71.19545,-17.2892 -147.72455,-15.337 -219.78393,-2.1023 -19.71402,3.6207 -38.16265,12.7614 -56,21.9037 -25.58896,13.1153 -50.1493,28.6797 -72.41867,46.8698 -20.86879,17.0461 -39.87147,36.5945 -56.58492,57.7306 -16.25625,20.5579 -31.77243,42.3481 -41.94993,66.5 -21.0291,49.9034 -36.17663,103.8712 -37.80398,158 -1.48509,49.3969 11.31855,98.7425 25.7749,146 2.89124,9.4514 7.30827,18.4216 12.06331,27.0864 16.24411,29.6005 33.9446,58.825 55.91929,84.4604 17.97944,20.9746 37.95417,41.0053 61.29792,55.779 48.34107,30.5939 101.73246,60.326 158.72627,65.2806 88.40168,7.685 182.36128,-14.2418 259.97581,-57.2523 44.71388,-24.7784 55.88978,-39.7083 107.36448,-109.5106 9.338,13.2547 104.8569,153.5718 112.4371,165.2219 -1.3534,2.5289 -35.6157,36.6543 -40.3016,40.3602 -41.37,39.4786 -89.1211,71.8772 -140.99998,94.4191 -54.92875,23.8671 -115.31236,35.4146 -174.94919,40.9152 -74.44734,6.8667 -151.84941,9.1221 -224.05493,-10.2666 z"
      fill="#f8ffff"/>
  </g>
</svg>
`;
linkLogo.innerHTML = svgLogo;
sectionLogo.appendChild(linkLogo);
header.appendChild(sectionLogo);






// SECTION 2: TITULO + BOTON MENU
const sectionTitle = document.createElement("section");

const h1 = document.createElement("h1");
h1.textContent = "TONO";
sectionTitle.appendChild(h1);

//  boton para desplegar menu
const btnMenu = document.createElement("button");
btnMenu.id = "btnMenu";
btnMenu.textContent = "▼";
sectionTitle.appendChild(btnMenu);








// SECTION 3: CUENTA / LOGIN 
const sectionAccount = document.createElement("section");

const accountButton = document.createElement("button");
accountButton.id = "btnCuenta";

const accountImg = document.createElement("img");
accountImg.src = ""; // icono usuario, QUEDA PONERLO
accountImg.alt = "Mi cuenta";

accountButton.appendChild(accountImg);
accountButton.appendChild(document.createTextNode(" Mi Cuenta"));

// Contenedor de opciones de cuenta
const opcionesCuenta = document.createElement("div");
opcionesCuenta.id = "opcionesCuenta";

// Opciones según estado (guest = no logueado, user = logueado)
const linksCuenta = [
  { texto: "Login", href: "html/profile/login.html", estado: "guest" },
  { texto: "Registrarse", href: "html/profile/register.html", estado: "guest" },
  { texto: "Ver perfil", href: "html/profile/profile.html", estado: "user" },
  { texto: "Cerrar sesión", href: "#", estado: "user", id: "logout" }
];

// Crea los enlaces
linksCuenta.forEach(opcion => {
  const a = document.createElement("a");
  a.textContent = opcion.texto;
  a.href = opcion.href;
  if (opcion.id) a.id = opcion.id;
  a.dataset.estado = opcion.estado;
  opcionesCuenta.appendChild(a);
});

sectionAccount.appendChild(accountButton);
sectionAccount.appendChild(opcionesCuenta);







//  NAV: MENÚ DE JUEGOS
const nav = document.createElement("nav");
const ul = document.createElement("ul");

const juegos = [
  { texto: "Juego 1", href: "/html/games/game1.html" },
  { texto: "Juego 2", href: "/html/games/game2.html" },
  { texto: "Juego 3", href: "/html/games/game3.html" }
];

juegos.forEach(juego => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.textContent = juego.texto;
  a.href = juego.href;
  li.appendChild(a);
  ul.appendChild(li);
});

nav.appendChild(ul);



// MONTAJE FINAL DEL HEADER 
header.appendChild(sectionLogo);
header.appendChild(sectionTitle);
header.appendChild(sectionAccount);
header.appendChild(nav);




// FUNCIONALIDAD DEL BOTÓN DE CUENTA 
accountButton.addEventListener("click", () => {
  opcionesCuenta.classList.toggle("mostrar");
});




//  FUNCIONALIDAD DEL BOTON DE MENU
btnMenu.addEventListener("click", () => {
  nav.classList.toggle("mostrar");
});

//  CONTROL DE ESTADO DE USUARIO (simulado por que no hay backend)
const isLogged = localStorage.getItem("userLogged") === "true";
document.body.classList.add(isLogged ? "user" : "guest");

//  VISIBILIDAD DE OPCIONES SEGÚN ESTADO 
const enlaces = opcionesCuenta.querySelectorAll("a");

enlaces.forEach(enlace => {
  const estado = enlace.dataset.estado;
  if ((isLogged && estado === "user") || (!isLogged && estado === "guest")) {
    enlace.style.display = "block";
  } else {
    enlace.style.display = "none";
  }
});


// Modal para el login --------------------
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
  if (e.target === overlay) {
    overlay.classList.remove("mostrar");
  }
});


// Fingimos el login: cambian los botones

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", e => {
  e.preventDefault();

  // Simulación de login correcto
  localStorage.setItem("userLogged", "true");

  overlay.classList.remove("mostrar");

  // Recargar para actualizar estado
  location.reload();
});

// FUNCIONALIDAD DE CERRAR SESIÓN 
const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("userLogged");
    location.reload();
  });
}

