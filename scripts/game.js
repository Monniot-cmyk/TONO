// Control de pantalla completa
let isFS = false;
const contenedor = document.getElementById("contenedorJuego");

function pantallaCompleta() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        teatroActivo = false;
        // cambiarFooter.style.display = "flex";
        contenedorJuego.style.width = document.body.offsetWidth*0.66 +"px";
        contenedorJuego.style.height = document.body.offsetHeight*0.66 +"px";
    }
});