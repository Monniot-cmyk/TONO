const contenedorJuego = document.getElementById("contenedorJuego");
contenedorJuego.style.width = document.body.offsetWidth*0.66 +"px";
contenedorJuego.style.height = document.body.offsetHeight*0.66 +"px";

// contenedorJuego.style.width = window.innerWidth*0.66 +"px";
// contenedorJuego.style.height = window.innerWidth*0.3 +"px";

let teatroActivo = false;

document.getElementById('modoTeatroBtn').addEventListener('click', function() {
    // let cambiarFooter = document.querySelector("footer");
    if(!teatroActivo) {
        teatroActivo = true;
        // cambiarFooter.style.display = "none";
        contenedorJuego.style.width = document.body.offsetWidth*0.75 +"px";
        contenedorJuego.style.height = document.body.offsetHeight*0.75 +"px";
    } else {
        teatroActivo = false;
        // cambiarFooter.style.display = "flex";
        contenedorJuego.style.width = document.body.offsetWidth*0.66 +"px";
        contenedorJuego.style.height = document.body.offsetHeight*0.66 +"px";
    }
});