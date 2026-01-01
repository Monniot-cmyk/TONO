// Por algun motivo esto estaba crasheando con las constantes del header, asi que 
// la solucion ha sido encapsularlo en una funcion propia por que asi las 
// variables y constantes tienen un ambito local y no chocan con nada
(function () {

const footer = document.querySelector("footer");


//    SECTION 1 · LOGO DE LA PÁGINA
const sectionLogo = document.createElement("section");

const imgLogo = document.createElement("img");
imgLogo.src = "img/logoVerde.svg"; // cuando este la imagen ponemos el logo bien
imgLogo.alt = "logo de la pagina";

sectionLogo.appendChild(imgLogo);





//    SECTION 2 · AUTORES

const sectionAutores = document.createElement("section");

const h4Autores = document.createElement("h4");
h4Autores.textContent = "Autores";

const ulAutores = document.createElement("ul");

const autores = [
  "Sergio Buz Egido",
  "Anais Carreño Monniot",
  "Rebeca Miguel Sancho",
  "Luis Rubio Hernandez"
];

// Crea un <li> por cada autor
autores.forEach(nombre => {
  const li = document.createElement("li");
  li.textContent = nombre;
  ulAutores.appendChild(li);
});

sectionAutores.appendChild(h4Autores);
sectionAutores.appendChild(ulAutores);







//    SECTION 3 · CONTENIDOS DE LA PÁGINA

const sectionContenidos = document.createElement("section");

const h4Contenidos = document.createElement("h4");
h4Contenidos.textContent = "Contenidos de la página";

const ulContenidos = document.createElement("ul");

const enlacesContenido = [
  { texto: "Página principal", href: "index.html" },
  { texto: "Login", href: "html/profile/login.html" },
  { texto: "Registrarse", href: "html/profile/register.html" },
  { texto: "Juego 1", href: "html/games/game1.html" },
  { texto: "Juego 2", href: "html/games/game2.html" },
  { texto: "Juego 3", href: "html/games/game3.html" },
  { texto: "Resultados", href: "html/stats/stats.html" }
];

// Crea <li><a></a></li> por cada enlace
enlacesContenido.forEach(item => {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.textContent = item.texto;
  a.href = item.href;

  li.appendChild(a);
  ulContenidos.appendChild(li);
});

sectionContenidos.appendChild(h4Contenidos);
sectionContenidos.appendChild(ulContenidos);






//    SECTION 4 · MÁS INFORMACIÓN

const sectionInfo = document.createElement("section");

const h4Info = document.createElement("h4");
h4Info.textContent = "Más Información";

const ulInfo = document.createElement("ul");

const enlacesInfo = [
  { texto: "Política de cookies", href: "#" },
  { texto: "Repositorio en GitHub", href: "#" }
];

enlacesInfo.forEach(item => {
  const li = document.createElement("li");
  const a = document.createElement("a");

  a.textContent = item.texto;
  a.href = item.href;

  li.appendChild(a);
  ulInfo.appendChild(li);
});

sectionInfo.appendChild(h4Info);
sectionInfo.appendChild(ulInfo);





//    MONTAJE FINAL DEL FOOTER

footer.appendChild(sectionLogo);
footer.appendChild(sectionAutores);
footer.appendChild(sectionContenidos);
footer.appendChild(sectionInfo);
})();