document.addEventListener('DOMContentLoaded', () => {
    // Configuración
    const TAMANO_REJILLA = 12;
    const COLORES = ['#bac851', '#154958', '#f59a68', '#f48092'];
    const VELOCIDADES = [0.02, 0.03, 0.04, 0.05]; // Velocidades reducidas
    
    // Estado del Juego
    let rejilla = []; 
    let entidadesActivas = []; 
    let reproduciendo = true;
    let contextoAudio = null;
    let masterGain = null;
    let colorArrastrado = 0; 
    let contadorId = 0;

    // Elementos del DOM
    const contenedorJuego = document.getElementById('juego2');
    const notificacion = document.getElementById('notificacion');
    const modalSubida = document.getElementById('modalSubida');
    const overlay = document.getElementById('overlayInicio');

    // Inicializar Contexto de Audio
    function iniciarAudio() {
        if (!contextoAudio) {
            try {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
                masterGain = contextoAudio.createGain();
                masterGain.gain.value = 0.5;
                masterGain.connect(contextoAudio.destination);
                console.log("AudioContext inicializado");
            } catch (e) {
                console.error("No se pudo iniciar AudioContext", e);
            }
        }
        if (contextoAudio && contextoAudio.state === 'suspended') {
            contextoAudio.resume().then(() => console.log("AudioContext resumido"));
        }
        if (overlay) overlay.style.display = 'none';
    }

    // Activar audio en overlay
    if (overlay) {
        overlay.addEventListener('click', iniciarAudio);
    }

    // Inicialización
    function iniciar() {
        crearRejilla();
        configurarEventos();
        requestAnimationFrame(actualizar);
    }

    // Sistema de Rejilla
    function crearRejilla() {
        let html = '';
        rejilla = [];

        for (let y = 0; y < TAMANO_REJILLA; y++) {
            const fila = [];
            for (let x = 0; x < TAMANO_REJILLA; x++) {
                fila.push({
                    direccion: 1 // 0:arriba, 1:derecha, 2:abajo, 3:izquierda
                });

                html += `
                    <div class="cell" data-x="${x}" data-y="${y}">
                        <div class="arrow">→</div>
                    </div>
                `;
            }
            rejilla.push(fila);
        }
        
        contenedorJuego.innerHTML = html;
    }

    // Configuración de Eventos
    function configurarEventos() {
        contenedorJuego.addEventListener('click', (e) => {
            const celda = e.target.closest('.cell');
            if (celda && !e.target.classList.contains('entity')) {
                rotarFlecha(parseInt(celda.dataset.x), parseInt(celda.dataset.y));
            }
        });

        contenedorJuego.addEventListener('dragover', (e) => e.preventDefault());
        
        contenedorJuego.addEventListener('drop', (e) => {
            e.preventDefault();
            const celda = e.target.closest('.cell');
            if (celda) {
                const color = isNaN(colorArrastrado) ? 0 : colorArrastrado;
                crearEntidad(parseInt(celda.dataset.x), parseInt(celda.dataset.y), color);
            }
        });

        contenedorJuego.addEventListener('contextmenu', (e) => {
            if (e.target.classList.contains('entity')) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                eliminarEntidad(id);
            }
        });

        document.querySelectorAll('.palette-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const idx = parseInt(e.target.dataset.colorIndex);
                if (!isNaN(idx)) {
                    colorArrastrado = idx;
                }
            });
        });

        const btnLimpiar = document.getElementById('btnLimpiar');
        if (btnLimpiar) btnLimpiar.onclick = limpiarTablero;

        const btnSubir = document.getElementById('btnSubir');
        if (btnSubir) btnSubir.onclick = () => modalSubida.classList.add('active');
        
        const btnCancelar = document.getElementById('btnCancelarSubida');
        if (btnCancelar) btnCancelar.onclick = () => modalSubida.classList.remove('active');
        
        const btnConfirmar = document.getElementById('btnConfirmarSubida');
        if (btnConfirmar) btnConfirmar.onclick = confirmarSubida;
    }

    // Lógica del Juego
    function rotarFlecha(x, y) {
        if (rejilla[y] && rejilla[y][x]) {
            const celdaDatos = rejilla[y][x];
            celdaDatos.direccion = (celdaDatos.direccion + 1) % 4;
            actualizarVisualFlecha(x, y, celdaDatos.direccion);
        }
    }

    function actualizarVisualFlecha(x, y, direccion) {
        const flechas = ['↑', '→', '↓', '←'];
        const celda = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (celda) {
            const flechaEl = celda.querySelector('.arrow');
            if (flechaEl) flechaEl.textContent = flechas[direccion];
        }
    }

    function crearEntidad(x, y, colorIndex) {
        if (isNaN(x) || isNaN(y)) return;

        const id = contadorId++;
        const celdaDatos = rejilla[y][x];
        const colorIdx = parseInt(colorIndex) % 4;
        
        const entidadEl = document.createElement('div');
        entidadEl.className = `entity color-${colorIdx + 1}`;
        entidadEl.dataset.id = id;
        entidadEl.dataset.colorIndex = colorIdx;
        
        const tamanoCelda = 600 / TAMANO_REJILLA;
        entidadEl.style.width = `${tamanoCelda * 0.7}px`;
        entidadEl.style.height = `${tamanoCelda * 0.7}px`;
        entidadEl.style.left = `${x * tamanoCelda + tamanoCelda * 0.15}px`;
        entidadEl.style.top = `${y * tamanoCelda + tamanoCelda * 0.15}px`;
        
        contenedorJuego.appendChild(entidadEl);

        entidadesActivas.push({
            id: id,
            x: x,
            y: y,
            exactX: x,
            exactY: y,
            dir: celdaDatos.direccion,
            color: colorIdx,
            velocidad: VELOCIDADES[colorIdx],
            elemento: entidadEl,
            giroRealizado: true // Ya está alineado al inicio
        });

        tocarNota(colorIdx, y);
        activarVisual(entidadEl);
    }

    function eliminarEntidad(id) {
        const index = entidadesActivas.findIndex(e => e.id === id);
        if (index !== -1) {
            if (entidadesActivas[index].elemento) {
                entidadesActivas[index].elemento.remove();
            }
            entidadesActivas.splice(index, 1);
        }
    }

    function limpiarTablero() {
        entidadesActivas.forEach(e => {
            if (e.elemento) e.elemento.remove();
        });
        entidadesActivas = [];
        mostrarNotificacion("Tablero limpiado");
    }

    function actualizar() {
        if (!reproduciendo) {
            requestAnimationFrame(actualizar);
            return;
        }

        const dirs = [
            { x: 0, y: -1 }, 
            { x: 1, y: 0 },  
            { x: 0, y: 1 },  
            { x: -1, y: 0 }  
        ];

        const tamanoCelda = 600 / TAMANO_REJILLA;

        entidadesActivas.forEach(entidad => {
            const movimiento = dirs[entidad.dir];
            entidad.exactX += movimiento.x * entidad.velocidad;
            entidad.exactY += movimiento.y * entidad.velocidad;

            // Wrap
            if (entidad.exactX < 0) entidad.exactX = TAMANO_REJILLA - 0.01;
            if (entidad.exactX >= TAMANO_REJILLA) entidad.exactX = 0;
            if (entidad.exactY < 0) entidad.exactY = TAMANO_REJILLA - 0.01;
            if (entidad.exactY >= TAMANO_REJILLA) entidad.exactY = 0;

            const nuevoX = Math.floor(entidad.exactX);
            const nuevoY = Math.floor(entidad.exactY);

            // Lógica de Giro en el Centro
            // Centro de la celda actual es x.5, y.5
            // Si estamos cerca del centro, actualizamos dirección
            const centroX = Math.floor(entidad.exactX) + 0.5;
            const centroY = Math.floor(entidad.exactY) + 0.5;
            const distCentro = Math.sqrt(Math.pow(entidad.exactX - centroX, 2) + Math.pow(entidad.exactY - centroY, 2));

            if (distCentro < entidad.velocidad && !entidad.giroRealizado) {
                // Estamos en el centro, leer dirección de la celda actual
                if (rejilla[nuevoY] && rejilla[nuevoY][nuevoX]) {
                    const celda = rejilla[nuevoY][nuevoX];
                    entidad.dir = celda.direccion;
                    entidad.giroRealizado = true;
                    
                    // Ajustar posición exacta al centro para evitar deriva
                    // Pero solo en el eje perpendicular al movimiento?
                    // Mejor dejarlo fluido
                }
            }

            // Detectar cambio de celda (para resetear flag de giro y sonido)
            if (nuevoX !== entidad.x || nuevoY !== entidad.y) {
                entidad.x = nuevoX;
                entidad.y = nuevoY;
                entidad.giroRealizado = false; // Permitir nuevo giro en nueva celda
                
                // Sonido al entrar
                tocarNota(entidad.color, nuevoY);
                activarVisual(entidad.elemento);
            }

            if (entidad.elemento) {
                entidad.elemento.style.left = `${entidad.exactX * tamanoCelda + tamanoCelda * 0.15}px`;
                entidad.elemento.style.top = `${entidad.exactY * tamanoCelda + tamanoCelda * 0.15}px`;
            }
        });

        requestAnimationFrame(actualizar);
    }

    function activarVisual(elemento) {
        if (!elemento) return;
        elemento.classList.remove('pulse');
        void elemento.offsetWidth;
        elemento.classList.add('pulse');
    }

    function tocarNota(indiceColor, posY) {
        if (!contextoAudio || !masterGain) return;
        
        const idx = isNaN(indiceColor) ? 0 : parseInt(indiceColor);

        try {
            const osc = contextoAudio.createOscillator();
            const ganancia = contextoAudio.createGain();
            
            osc.connect(ganancia);
            ganancia.connect(masterGain);

            const freqBase = 220; 
            const escala = [1, 9/8, 5/4, 3/2, 5/3, 2];
            const grado = Math.max(0, TAMANO_REJILLA - 1 - posY);
            const octava = Math.floor(grado / 5);
            const nota = grado % 5;
            const frecuencia = freqBase * escala[nota] * Math.pow(2, octava);
            
            osc.frequency.value = frecuencia;

            const t = contextoAudio.currentTime;

            switch(idx) {
                case 0: // Sine
                    osc.type = 'sine';
                    ganancia.gain.setValueAtTime(0, t);
                    ganancia.gain.linearRampToValueAtTime(0.5, t + 0.02);
                    ganancia.gain.linearRampToValueAtTime(0, t + 0.3);
                    osc.stop(t + 0.3);
                    break;

                case 1: // Triangle
                    osc.type = 'triangle';
                    ganancia.gain.setValueAtTime(0, t);
                    ganancia.gain.linearRampToValueAtTime(0.3, t + 0.05);
                    ganancia.gain.linearRampToValueAtTime(0, t + 0.5);
                    osc.stop(t + 0.5);
                    break;

                case 2: // Square
                    osc.type = 'square';
                    ganancia.gain.setValueAtTime(0, t);
                    ganancia.gain.linearRampToValueAtTime(0.2, t + 0.02);
                    ganancia.gain.linearRampToValueAtTime(0, t + 0.2);
                    osc.stop(t + 0.2);
                    break;

                case 3: // Sawtooth
                    osc.type = 'sawtooth';
                    ganancia.gain.setValueAtTime(0, t);
                    ganancia.gain.linearRampToValueAtTime(0.1, t + 0.02);
                    ganancia.gain.linearRampToValueAtTime(0, t + 0.4);
                    osc.stop(t + 0.4);
                    break;
            }

            osc.start(t);
        } catch (e) {
            console.error("Error tocando nota:", e);
        }
    }

    function confirmarSubida() {
        const nombre = document.getElementById('nombreBeat').value;
        const genero = document.getElementById('generoBeat').value;
        if (nombre) {
            simularSubida(nombre, genero);
            modalSubida.classList.remove('active');
        } else {
            alert('Por favor ponle un nombre a tu creación');
        }
    }

    function simularSubida(nombre, genero) {
        setTimeout(() => {
            console.log(`Subiendo ${nombre} [${genero}]...`);
            mostrarNotificacion(`¡Ritmo "${nombre}" subido correctamente a la categoría ${genero}!`);
        }, 1000);
    }

    function mostrarNotificacion(mensaje) {
        notificacion.textContent = mensaje;
        notificacion.classList.add('show');
        setTimeout(() => notificacion.classList.remove('show'), 3000);
    }

    iniciar();
});
