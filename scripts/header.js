//  Selecciona el elemento vacio de <header></header>
const header = document.querySelector("header");






//  SECTION 1: LOGO 
const sectionLogo = document.createElement("section");

const linkLogo = document.createElement("a");
linkLogo.href = "/index.html"; // enlace a la página principal

const imgLogo = document.createElement("img");
imgLogo.src = ""; // RUTA DEL LOGO HAY QUE ACTUALIZARLO CUANDO TENGAMOS LAS IMAGENES
imgLogo.alt = "Logo de la pAgina";

linkLogo.appendChild(imgLogo);
sectionLogo.appendChild(linkLogo);







// SECTION 2: TITULO + BOTON MENU
const sectionTitle = document.createElement("section");

const h1 = document.createElement("h1");
h1.textContent = "PAGINA CHULA PIRULA   QUE CARGA DESDE JS"; // titulo del sitio
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
  { texto: "Login", href: "/html/profile/login.html", estado: "guest" },
  { texto: "Registrarse", href: "/html/profile/register.html", estado: "guest" },
  { texto: "Ver perfil", href: "/html/profile/profile.html", estado: "user" },
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



// FUNCIONALIDAD DE CERRAR SESIÓN 
const logout = document.getElementById("logout");
if (logout) {
  logout.addEventListener("click", e => {
    e.preventDefault();
    localStorage.removeItem("userLogged");
    location.reload();
  });
}
