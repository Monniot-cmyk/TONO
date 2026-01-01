document.getElementById('modoTeatroBtn').addEventListener('click', function() {
    const contenedor = document.getElementById('juego1');
    
    // Guardamos las dimensiones originales
    const anchoOriginal = contenedor.offsetWidth;
    const altoOriginal = contenedor.offsetHeight;
    
    // Calculamos la proporción original
    const proporcion = altoOriginal / anchoOriginal;
    
    // Establecemos el nuevo tamaño basado en el ancho de la ventana
    const nuevoAncho = window.innerWidth * 0.8; // Usamos un 80% del ancho de la ventana
    const nuevoAlto = nuevoAncho * proporcion; // Mantenemos la misma proporción

    // Aplicamos los nuevos valores al contenedor
    contenedor.style.width = `${nuevoAncho}px`;
    contenedor.style.height = `${nuevoAlto}px`;
});
