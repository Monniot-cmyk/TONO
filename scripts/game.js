// Control de pantalla completa
let isFS = false;
const contenedor = document.getElementById("contenedorJuego");

function pantallaCompleta() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        contenedor.requestFullscreen();
    }
}

// Al final he tenido que añadir un event listener porque se rompia al usar la tecla ESC
document.addEventListener("fullscreenchange", () => {
    isFS = !!document.fullscreenElement;
});