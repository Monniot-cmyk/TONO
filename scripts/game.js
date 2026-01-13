// Cosas de pantalla completa
var isFS = false;
const contenedor = document.getElementById("contenedorJuego");

function pantallaCompleta() {
    if (isFS) {
        document.exitFullscreen();
        isFS = false;
    } else {
        if (contenedor.requestFullscreen) {
            contenedor.requestFullscreen();
        } else if (contenedor.webkitRequestFullscreen) {
            // Por si es Safari
            contenedor.webkitRequestFullscreen();
        } else if (contenedor.msRequestFullscreen) {
            // Para navegadores chusta
            contenedor.msRequestFullscreen();
        }
        isFS = true;
    }
}