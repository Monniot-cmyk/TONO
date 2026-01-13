// --- Configuración ---
const CONFIGURACION = [
    // Fila 2: Teclas Blancas
    { tecla: 'a', etiqueta: 'A', x: 10, y: 50, frec: 261.63, tipo: 'tono' },
    { tecla: 's', etiqueta: 'S', x: 20, y: 50, frec: 293.66, tipo: 'tono' },
    { tecla: 'd', etiqueta: 'D', x: 30, y: 50, frec: 329.63, tipo: 'tono' },
    { tecla: 'f', etiqueta: 'F', x: 40, y: 50, frec: 349.23, tipo: 'tono' },
    { tecla: 'g', etiqueta: 'G', x: 50, y: 50, frec: 392.00, tipo: 'tono' },
    { tecla: 'h', etiqueta: 'H', x: 60, y: 50, frec: 440.00, tipo: 'tono' },
    { tecla: 'j', etiqueta: 'J', x: 70, y: 50, frec: 493.88, tipo: 'tono' },
    { tecla: 'k', etiqueta: 'K', x: 80, y: 50, frec: 523.25, tipo: 'tono' },
    { tecla: 'l', etiqueta: 'L', x: 90, y: 50, frec: 587.33, tipo: 'tono' },

    // Fila 1: Teclas Negras
    { tecla: 'w', etiqueta: 'W', x: 15, y: 30, frec: 277.18, tipo: 'tono' },
    { tecla: 'e', etiqueta: 'E', x: 25, y: 30, frec: 311.13, tipo: 'tono' },
    { tecla: 't', etiqueta: 'T', x: 45, y: 30, frec: 369.99, tipo: 'tono' },
    { tecla: 'y', etiqueta: 'Y', x: 55, y: 30, frec: 415.30, tipo: 'tono' },
    { tecla: 'u', etiqueta: 'U', x: 65, y: 30, frec: 466.16, tipo: 'tono' },
    { tecla: 'o', etiqueta: 'O', x: 85, y: 30, frec: 554.37, tipo: 'tono' },
    { tecla: 'p', etiqueta: 'P', x: 95, y: 30, frec: 622.25, tipo: 'tono' },

    // Fila 3: Ritmos
    { tecla: 'z', etiqueta: 'Z', x: 15, y: 75, tipo: 'kick' },
    { tecla: 'x', etiqueta: 'X', x: 25, y: 75, tipo: 'snare' },
    { tecla: 'c', etiqueta: 'C', x: 35, y: 75, tipo: 'hihat' },
    { tecla: 'v', etiqueta: 'V', x: 45, y: 75, tipo: 'tom' },
    { tecla: 'b', etiqueta: 'B', x: 55, y: 75, tipo: 'clap' },
    { tecla: 'n', etiqueta: 'N', x: 65, y: 75, tipo: 'crash' },
    { tecla: 'm', etiqueta: 'M', x: 75, y: 75, tipo: 'hihat' }
];

// --- Motor de Audio ---
const MotorAudio = {
    ctx: null,
    ganancia: null,
    iniciar() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.ganancia = this.ctx.createGain();
            this.ganancia.gain.value = 0.5;
            this.ganancia.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    reproducir(tipo, frec) {
        this.iniciar();
        const t = this.ctx.currentTime;
        
        if (tipo === 'tono') {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.frequency.value = frec;
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 1);
            osc.connect(g);
            g.connect(this.ganancia);
            osc.start(t);
            osc.stop(t + 1);
        } else if (tipo === 'kick') {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
            g.gain.setValueAtTime(1, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
            osc.connect(g);
            g.connect(this.ganancia);
            osc.start(t);
            osc.stop(t + 0.5);
        } else if (tipo === 'snare') {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.type = 'triangle';
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(g);
            g.connect(this.ganancia);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (tipo === 'tom') {
            const osc = this.ctx.createOscillator();
            const g = this.ctx.createGain();
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
            osc.connect(g);
            g.connect(this.ganancia);
            osc.start(t);
            osc.stop(t + 0.2);
        } else if (tipo === 'clap') {
            const tamanoBuffer = this.ctx.sampleRate * 0.2;
            const buffer = this.ctx.createBuffer(1, tamanoBuffer, this.ctx.sampleRate);
            const datos = buffer.getChannelData(0);
            for(let i=0; i<tamanoBuffer; i++) datos[i] = (Math.random() * 2 - 1) * 0.5;
            
            const fuente = this.ctx.createBufferSource();
            fuente.buffer = buffer;
            
            const filtro = this.ctx.createBiquadFilter();
            filtro.type = 'bandpass';
            filtro.frequency.value = 1000;
            filtro.Q.value = 1;

            const g = this.ctx.createGain();
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
            
            fuente.connect(filtro);
            filtro.connect(g);
            g.connect(this.ganancia);
            fuente.start(t);
        } else if (tipo === 'crash') {
            const tamanoBuffer = this.ctx.sampleRate * 1.5;
            const buffer = this.ctx.createBuffer(1, tamanoBuffer, this.ctx.sampleRate);
            const datos = buffer.getChannelData(0);
            for(let i=0; i<tamanoBuffer; i++) datos[i] = (Math.random() * 2 - 1) * 0.5;
            
            const fuente = this.ctx.createBufferSource();
            fuente.buffer = buffer;
            
            const filtro = this.ctx.createBiquadFilter();
            filtro.type = 'highpass';
            filtro.frequency.value = 2000;

            const g = this.ctx.createGain();
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
            
            fuente.connect(filtro);
            filtro.connect(g);
            g.connect(this.ganancia);
            fuente.start(t);
        } else {
            // Hi-hat (por defecto)
            const tamanoBuffer = this.ctx.sampleRate * 0.1;
            const buffer = this.ctx.createBuffer(1, tamanoBuffer, this.ctx.sampleRate);
            const datos = buffer.getChannelData(0);
            for(let i=0; i<tamanoBuffer; i++) datos[i] = Math.random() * 2 - 1;
            
            const fuente = this.ctx.createBufferSource();
            fuente.buffer = buffer;
            
            const filtro = this.ctx.createBiquadFilter();
            filtro.type = 'highpass';
            filtro.frequency.value = 5000;

            const g = this.ctx.createGain();
            g.gain.setValueAtTime(0.3, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.05);
            
            fuente.connect(filtro);
            filtro.connect(g);
            g.connect(this.ganancia);
            fuente.start(t);
        }
    }
};

// --- Lógica del Juego ---
const Estado = {
    grabando: false,
    reproduciendo: false,
    inicioBucle: 0,
    notas: [], // { tecla, tiempo }
    duracion: 8000
};

// --- Configuración de UI ---
const capaInterfaz = document.getElementById('ui-layer');
const capaChispas = document.getElementById('sparks-layer');
const barraProgreso = document.getElementById('progress-bar');
const btnReproducir = document.getElementById('btn-play');
const btnGrabar = document.getElementById('btn-rec');
const btnLimpiar = document.getElementById('btn-clear');
const btnSubir = document.getElementById('btn-upload');
const interruptorInterfaz = document.getElementById('toggle-ui');
const instrucciones = document.getElementById('instructions');
const modalSubida = document.querySelector('.game1modal'); // Selector actualizado
const formularioSubida = document.getElementById('upload-form');
const btnCancelarSubida = document.getElementById('btn-cancel-upload');
const notificacion = document.getElementById('toast');

// Renderizar Teclas
const elementosTecla = {};
CONFIGURACION.forEach(c => {
    const el = document.createElement('div');
    el.className = 'key-label';
    el.style.left = c.x + '%';
    el.style.top = c.y + '%';
    el.innerHTML = `
        <div class="key-char" style="${c.tipo === 'tono' && c.tecla.match(/[wetyuop]/) ? 'font-size: 1.5rem' : ''}">${c.etiqueta}</div>
        <div class="key-sound">${c.tipo === 'tono' ? '' : c.tipo}</div>
    `;
    capaInterfaz.appendChild(el);
    elementosTecla[c.tecla] = el;
});

// --- Interacción ---
function activar(tecla, esReproduccion = false) {
    const config = CONFIGURACION.find(c => c.tecla === tecla);
    if (!config) return;

    // Audio
    MotorAudio.reproducir(config.tipo, config.frec);

    // Visual
    const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    crearChispa(config.x, config.y, color);

    // Retroalimentación UI
    if (elementosTecla[tecla]) {
        const el = elementosTecla[tecla];
        el.classList.add('key-active');
        el.querySelector('.key-char').style.color = color;
        el.querySelector('.key-char').style.textShadow = `0 0 20px ${color}`;
        setTimeout(() => {
            el.classList.remove('key-active');
            el.querySelector('.key-char').style.color = '';
            el.querySelector('.key-char').style.textShadow = '';
        }, 100);
    }

    // Grabación
    if (Estado.grabando && !esReproduccion) {
        const tiempo = (Date.now() - Estado.inicioBucle) % Estado.duracion;
        Estado.notas.push({ tecla, tiempo });
    }
}

function crearChispa(x, y, color) {
    const chispa = document.createElement('div');
    chispa.className = 'spark';
    chispa.style.left = x + '%';
    chispa.style.top = y + '%';

    const estallido = document.createElement('div');
    estallido.className = 'spark-burst';
    estallido.style.backgroundColor = color;
    chispa.appendChild(estallido);

    for (let i = 0; i < 8; i++) {
        const p = document.createElement('div');
        p.className = 'spark-particle';
        p.style.backgroundColor = color;
        const angulo = (i / 8) * Math.PI * 2;
        const dist = 100;
        p.style.setProperty('--tx', Math.cos(angulo) * dist + 'px');
        p.style.setProperty('--ty', Math.sin(angulo) * dist + 'px');
        chispa.appendChild(p);
    }

    capaChispas.appendChild(chispa);
    setTimeout(() => chispa.remove(), 600);
}

// --- Motor de Bucle ---
let idBucle;
function bucle() {
    if (!Estado.reproduciendo && !Estado.grabando) {
        barraProgreso.style.width = '0%';
        return;
    }

    const ahora = Date.now();
    const tiempo = (ahora - Estado.inicioBucle) % Estado.duracion;
    barraProgreso.style.width = (tiempo / Estado.duracion * 100) + '%';

    if (Estado.reproduciendo) {
        const ventana = 20; 
        Estado.notas.forEach(nota => {
            const dif = tiempo - nota.tiempo;
            if (dif >= 0 && dif < ventana) {
                activar(nota.tecla, true);
            }
        });
    }

    idBucle = requestAnimationFrame(bucle);
}

// --- Oyentes de Eventos ---
window.addEventListener('keydown', e => {
    if (e.repeat) return;
    activar(e.key.toLowerCase());
});

btnReproducir.addEventListener('click', () => {
    if (Estado.reproduciendo) {
        Estado.reproduciendo = false;
        Estado.grabando = false;
        btnReproducir.textContent = 'PLAY';
        btnReproducir.classList.remove('active');
        btnGrabar.classList.remove('recording');
        btnGrabar.textContent = 'REC LOOP';
        cancelAnimationFrame(idBucle);
    } else {
        Estado.reproduciendo = true;
        Estado.inicioBucle = Date.now();
        btnReproducir.textContent = 'STOP';
        btnReproducir.classList.add('active');
        bucle();
    }
});

btnGrabar.addEventListener('click', () => {
    if (Estado.grabando) {
        Estado.grabando = false;
        Estado.reproduciendo = true;
        btnGrabar.classList.remove('recording');
        btnGrabar.textContent = 'REC LOOP';
    } else {
        Estado.grabando = true;
        Estado.reproduciendo = true;
        if (!Estado.reproduciendo) Estado.inicioBucle = Date.now();
        btnGrabar.classList.add('recording');
        btnGrabar.textContent = 'RECORDING...';
        btnReproducir.textContent = 'STOP';
        btnReproducir.classList.add('active');
        bucle();
    }
});

btnLimpiar.addEventListener('click', () => {
    Estado.notas = [];
    Estado.reproduciendo = false;
    Estado.grabando = false;
    btnReproducir.textContent = 'PLAY';
    btnReproducir.classList.remove('active');
    btnGrabar.classList.remove('recording');
    btnGrabar.textContent = 'REC LOOP';
    barraProgreso.style.width = '0%';
    cancelAnimationFrame(idBucle);
});

// Alternar Interfaz
interruptorInterfaz.addEventListener('change', (e) => {
    const visible = e.target.checked;
    capaInterfaz.classList.toggle('hidden', !visible);
    instrucciones.classList.toggle('hidden', !visible);
});

// Lógica de Subida
btnSubir.addEventListener('click', () => {
    modalSubida.classList.remove('hidden');
});

btnCancelarSubida.addEventListener('click', () => {
    modalSubida.classList.add('hidden');
});

formularioSubida.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('beat-name').value;
    const categoria = document.getElementById('beat-category').value;
    
    // Simular Subida
    console.log('Subiendo beat:', { nombre, categoria, notas: Estado.notas });
    
    modalSubida.classList.add('hidden');
    formularioSubida.reset();
    
    // Mostrar Notificación
    notificacion.classList.remove('hidden');
    setTimeout(() => {
        notificacion.classList.add('hidden');
    }, 3000);
});
