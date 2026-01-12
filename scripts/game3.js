class MusicalTouchPad {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Matriz 7x5
        this.GRID_WIDTH = 7;
        this.GRID_HEIGHT = 5;
        
        // Escalas modales basadas en DO
        this.scales = {
            jonico:   ['C', 'D', 'E',  'F',  'G',  'A',  'B'],
            dorico:   ['C', 'D', 'Eb', 'F',  'G',  'A',  'Bb'],
            frigio:   ['C', 'Db','Eb', 'F',  'G',  'Ab', 'Bb'],
            lidio:    ['C', 'D', 'E',  'F#', 'G',  'A',  'B'],
            mixolidio:['C', 'D', 'E',  'F',  'G',  'A',  'Bb'],
            eolico:   ['C', 'D', 'Eb', 'F',  'G',  'Ab', 'Bb'],
            locrio:   ['C', 'Db','Eb', 'F',  'Gb', 'Ab', 'Bb']
        };
        
        // Notas actuales (por defecto Jónico)
        this.notes = [...this.scales.jonico];
        
        // Octavas por fila
        this.octaves = [6, 5, 4, 3, 2];
        
        // Paleta que has pasado, de cálido a frío (izquierda → derecha)
        this.columnColors = [
            '#d6f5b7', // tea-green
            '#baf8de', // aquamarine
            '#8ff4e6', // soft-cyan
            '#63efed', // neon-ice
            '#8ad5fa', // frozen-lake
            '#93bff9', // baby-blue-ice
            '#83b2f7'  // baby-blue-ice-2
        ];
        
        // Partículas
        this.particles = [];
        
        // Audio
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = this.audioContext.createGain();
        this.masterVolume.gain.value = 0.3;
        this.masterVolume.connect(this.audioContext.destination);
        
        // Estado
        this.isMouseDown = false;
        this.lastPlayedNote = null;
        this.lastPlayedOctave = null;
        
        // Selector escala
        this.scaleSelect = document.getElementById('selectorEscala');
        if (this.scaleSelect) {
            this.scaleSelect.addEventListener('change', (e) => this.changeScale(e.target.value));
        }
        
        // Canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Ratón
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.onMouseUp());
        
        // Touch
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.canvas.addEventListener('touchend', () => this.onMouseUp());
        
        // Loop
        this.animate();
    }
    
    changeScale(scaleName) {
        if (this.scales[scaleName]) {
            this.notes = [...this.scales[scaleName]];
            this.lastPlayedNote = null;
            this.lastPlayedOctave = null;
        }
    }
    
    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
    }
    
    getCellFromMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cellWidth = this.canvas.width / this.GRID_WIDTH;
        const cellHeight = this.canvas.height / this.GRID_HEIGHT;
        const cellX = Math.floor(x / cellWidth);
        const cellY = Math.floor(y / cellHeight);
        return {
            x: Math.max(0, Math.min(cellX, this.GRID_WIDTH - 1)),
            y: Math.max(0, Math.min(cellY, this.GRID_HEIGHT - 1))
        };
    }
    
    getCellFromTouch(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const cellWidth = this.canvas.width / this.GRID_WIDTH;
        const cellHeight = this.canvas.height / this.GRID_HEIGHT;
        const cellX = Math.floor(x / cellWidth);
        const cellY = Math.floor(y / cellHeight);
        return {
            x: Math.max(0, Math.min(cellX, this.GRID_WIDTH - 1)),
            y: Math.max(0, Math.min(cellY, this.GRID_HEIGHT - 1))
        };
    }
    
    onMouseDown(e) {
        this.isMouseDown = true;
        const cell = this.getCellFromMouse(e);
        this.playNoteAtCell(cell, e);
    }
    
    onMouseMove(e) {
        if (this.isMouseDown) {
            const cell = this.getCellFromMouse(e);
            this.playNoteAtCell(cell, e);
        }
    }
    
    onMouseUp() {
        this.isMouseDown = false;
        this.lastPlayedNote = null;
        this.lastPlayedOctave = null;
    }
    
    onTouchStart(e) {
        this.isMouseDown = true;
        const touch = e.touches[0];
        const cell = this.getCellFromTouch(touch);
        this.playNoteAtCell(cell, touch);
    }
    
    onTouchMove(e) {
        if (this.isMouseDown) {
            const touch = e.touches[0];
            const cell = this.getCellFromTouch(touch);
            this.playNoteAtCell(cell, touch);
        }
    }
    
    playNoteAtCell(cell, event) {
        const note = this.notes[cell.x];
        const octave = this.octaves[cell.y];
        if (this.lastPlayedNote === note && this.lastPlayedOctave === octave) return;
        
        this.lastPlayedNote = note;
        this.lastPlayedOctave = octave;
        this.playOmnichordNote(note, octave);
        
        const rect = this.canvas.getBoundingClientRect();
        const clientX = event.clientX ?? event.touches[0].clientX;
        const clientY = event.clientY ?? event.touches[0].clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const color = this.columnColors[cell.x]; // color según columna (nota)
        this.createParticles(x, y, color);
    }
    
    getNoteFrequency(note, octave) {
        const baseFrequency = 262;
        const noteOffsets = {
            'C': 0,  'Db': 1, 'D': 2,  'Eb': 3,
            'E': 4,  'F': 5,  'F#': 6, 'Gb': 6,
            'G': 7,  'Ab': 8, 'A': 9,  'Bb': 10,
            'B': 11
        };
        const semitones = noteOffsets[note] + ((octave - 4) * 12);
        return baseFrequency * Math.pow(2, semitones / 12);
    }
    
    playOmnichordNote(note, octave) {
        const frequency = this.getNoteFrequency(note, octave);
        const now = this.audioContext.currentTime;
        
        const osc1 = this.audioContext.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = frequency;
        
        const osc2 = this.audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = frequency * 2;
        
        const gainOsc1 = this.audioContext.createGain();
        const gainOsc2 = this.audioContext.createGain();
        gainOsc1.gain.value = 0.6;
        gainOsc2.gain.value = 0.2;
        
        const envelope = this.audioContext.createGain();
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(1, now + 0.05);
        envelope.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
        
        osc1.connect(gainOsc1);
        osc2.connect(gainOsc2);
        gainOsc1.connect(envelope);
        gainOsc2.connect(envelope);
        envelope.connect(this.masterVolume);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.5);
        osc2.stop(now + 0.5);
    }
    
    // Partículas neón: un solo color por clic, más pequeñas, menos y más juntas
    createParticles(x, y, color) {
        const particleCount = 9; // antes 14 → menos cantidad
        for (let i = 0; i < particleCount; i++) {
            // Ángulo muy concentrado alrededor de un círculo pequeño
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.15;
            const velocity = 1.3 + Math.random() * 1.4; // menos velocidad → se quedan cerca
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 1,
                color,
                size: 5 + Math.random() * 6, // antes 7–15 → ahora 5–11 px
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: 0.035 + Math.random() * 0.03
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;          // un poco menos de gravedad
            p.life -= 0.012;       // desaparecen algo antes
            p.wobble += p.wobbleSpeed;
            p.vx *= 0.99;          // casi sin freno lateral
            p.x += Math.sin(p.wobble) * 0.5; // menos desplazamiento lateral
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }

    
    drawParticles() {
        for (const p of this.particles) {
            const size = p.size * p.life;
            
            // Glow exterior tipo neón
            this.ctx.save();
            this.ctx.shadowBlur = 18;
            this.ctx.shadowColor = p.color;
            
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life * 0.22;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size * 1.25, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Burbuja principal con gradiente
            const gradient = this.ctx.createRadialGradient(
                p.x - 3, p.y - 3, 0,
                p.x,     p.y,     size
            );
            gradient.addColorStop(0, this.adjustBrightness(p.color, 1.8));
            gradient.addColorStop(0.4, this.adjustBrightness(p.color, 1.3));
            gradient.addColorStop(0.8, p.color);
            gradient.addColorStop(1, this.adjustBrightness(p.color, 0.5));
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = p.life * 0.95;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
            
            // Highlight brillante
            const highlight = this.ctx.createRadialGradient(
                p.x - 4, p.y - 4, 0,
                p.x,     p.y,     size * 0.6
            );
            highlight.addColorStop(0, 'rgba(255,255,255,0.9)');
            highlight.addColorStop(0.5, 'rgba(255,255,255,0.4)');
            highlight.addColorStop(1, 'rgba(255,255,255,0)');
            
            this.ctx.fillStyle = highlight;
            this.ctx.globalAlpha = p.life * 0.75;
            this.ctx.beginPath();
            this.ctx.arc(p.x - 3, p.y - 3, size * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.globalAlpha = 1;
        }
    }
    
    adjustBrightness(color, factor) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(255 * (factor - 1) / 2);
        const R = Math.max(0, Math.min(255, (num >> 16) + amt));
        const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
        const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
        return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    }
    
    // Líneas divisorias neón usando la misma paleta por columnas
    drawGridLines() {
        const cellWidth = this.canvas.width / this.GRID_WIDTH;
        for (let i = 1; i < this.GRID_WIDTH; i++) {
            const x = i * cellWidth;
            const color = this.columnColors[i - 1]; // entre columnas i-1 e i
            
            this.ctx.save();
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = color;
            
            // Línea principal
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.globalAlpha = 0.9;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
            
            // Core blanco fino para efecto tubo de neón
            this.ctx.strokeStyle = 'rgba(255,255,255,0.8)';
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 0.9;
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.restore();
            this.ctx.globalAlpha = 1;
        }
    }
    
    animate() {
 const gradient = this.ctx.createRadialGradient(
        this.canvas.width / 2,
        this.canvas.height / 2,
        0,
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.max(this.canvas.width, this.canvas.height)
    );

    gradient.addColorStop(0, '#1a1822');
    gradient.addColorStop(1, '#0e0d13');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawGridLines();
    this.updateParticles();
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MusicalTouchPad();
});
