/**
 * game2.js - Juego de partitura interactiva
 * Versión completa con arrastre de figuras y sonido funcionando
 */

class MusicGame {
    constructor() {
        this.isPlaying = false;
        this.speed = 1.0;
        this.playheadPosition = 0;
        this.notes = [];
        this.isDraggingShape = false;
        this.currentDragClone = null;
        this.lastNotePosition = 0;
        this.isDraggingNote = false;
        this.animationFrameId = null;
        
        this.scoreWidth = 3000;
        this.currentScoreWidth = this.scoreWidth;
        
        this.initAudio();
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupDragAndDrop();
        this.setupScoreArea();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.activeSounds = new Map();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = 0.4;
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.log("Audio no disponible");
        }
    }
    
    cacheElements() {
        this.gameContainer = document.getElementById('game-container');
        this.scoreContainer = document.getElementById('score-container');
        this.scoreWrapper = document.getElementById('score-container-wrapper');
        this.playhead = document.getElementById('playhead');
        
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.timelineSlider = document.getElementById('timeline-slider');
        this.btnPlay = document.getElementById('btn-play');
        this.btnStop = document.getElementById('btn-stop');
        this.btnClear = document.getElementById('btn-clear');
        this.btnUpload = document.getElementById('btn-upload');
        
        this.uploadModal = document.getElementById('upload-modal');
        this.btnCancelUpload = document.getElementById('btn-cancel-upload');
        this.btnConfirmUpload = document.getElementById('btn-confirm-upload');
        this.uploadForm = document.getElementById('upload-form');
        this.toast = document.getElementById('toast');
    }
    
    bindEvents() {
        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseFloat(e.target.value);
            this.speedValue.textContent = `${this.speed.toFixed(1)}x`;
        });
        
        this.timelineSlider.addEventListener('input', (e) => {
            this.playheadPosition = parseInt(e.target.value);
            this.updatePlayheadPosition();
            this.autoScrollToPlayhead();
        });
        
        this.btnPlay.addEventListener('click', () => this.togglePlayback());
        this.btnStop.addEventListener('click', () => this.stopPlayback());
        this.btnClear.addEventListener('click', () => this.clearAllNotes());
        
        this.scoreWrapper.addEventListener('wheel', (e) => {
            this.scoreWrapper.scrollLeft += e.deltaY * 0.5;
            e.preventDefault();
        }, { passive: false });
    }
    
    setupDragAndDrop() {
        // Agregar eventos directamente a cada figura
        const shapes = document.querySelectorAll('.shape:not(#eraser-tool)');
        
        shapes.forEach(shape => {
            shape.addEventListener('mousedown', (e) => {
                this.startDrag(e, shape);
            });
        });
        
        this.scoreContainer.addEventListener('mousedown', (e) => {
            const note = e.target.closest('.note');
            if (note) this.startNoteDrag(e, note);
        });
        
        document.getElementById('eraser-tool').addEventListener('click', (e) => {
            e.stopPropagation();
            const eraser = document.getElementById('eraser-tool');
            eraser.classList.toggle('active');
        });
    }
    
    startDrag(e, shape) {
        if (e.button !== 0) return;
        
        const type = shape.dataset.type;
        const size = shape.dataset.size;
        
        // Crear clon para arrastrar
        const clone = document.createElement('div');
        clone.className = 'drag-clone';
        clone.style.position = 'fixed';
        clone.style.left = `${e.clientX - 25}px`;
        clone.style.top = `${e.clientY - 25}px`;
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.8';
        
        const noteSize = this.getNoteSize(size);
        
        // Crear la figura visual
        if (type === 'triangle') {
            clone.style.width = `${noteSize}px`;
            clone.style.height = `${noteSize * 0.875}px`;
            clone.style.background = 'none';
            
            const triangleOuter = document.createElement('div');
            triangleOuter.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            `;
            
            const triangleInner = document.createElement('div');
            triangleInner.style.cssText = `
                position: absolute;
                top: 2px;
                left: 2px;
                width: calc(100% - 4px);
                height: calc(100% - 4px);
                background: #0a0a0f;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            `;
            
            clone.appendChild(triangleOuter);
            clone.appendChild(triangleInner);
        } else {
            clone.style.width = `${noteSize}px`;
            clone.style.height = `${noteSize}px`;
            clone.style.border = '2px solid #fff';
            clone.style.borderRadius = type === 'circle' ? '50%' : '3px';
            
            if (size === 'medium' || size === 'large') {
                clone.style.borderWidth = '3px';
            } else if (size === 'xlarge' || size === 'xxlarge') {
                clone.style.borderWidth = '4px';
            }
        }
        
        document.body.appendChild(clone);
        
        // Mover el clon con el mouse
        const moveHandler = (moveEvent) => {
            clone.style.left = `${moveEvent.clientX - 25}px`;
            clone.style.top = `${moveEvent.clientY - 25}px`;
        };
        
        const upHandler = (upEvent) => {
            // Agregar nota a la partitura
            const scoreRect = this.scoreContainer.getBoundingClientRect();
            const scrollLeft = this.scoreWrapper.scrollLeft;
            
            const x = upEvent.clientX - scoreRect.left + scrollLeft;
            const y = upEvent.clientY - scoreRect.top;
            
            this.addNoteToScore(type, size, x, y);
            
            // Limpiar
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
            clone.remove();
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        
        e.preventDefault();
    }
    
    addNoteToScore(type, size, x, y) {
        const containerHeight = this.scoreContainer.clientHeight;
        const noteSize = this.getNoteSize(size);
        
        x = x - (noteSize / 2);
        y = y - (noteSize / 2);
        
        x = Math.max(10, Math.min(x, this.currentScoreWidth - noteSize - 10));
        y = Math.max(10, Math.min(y, containerHeight - noteSize - 10));
        
        const note = document.createElement('div');
        note.className = `note ${type} ${size}`;
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        note.dataset.type = type;
        note.dataset.size = size;
        note.dataset.x = x;
        note.dataset.y = y;
        note.dataset.pitch = this.calculatePitch(y); // Añadir pitch
        
        if (type === 'triangle') {
            note.style.width = `${noteSize}px`;
            note.style.height = `${noteSize * 0.875}px`;
            note.style.position = 'relative';
            note.style.background = 'none';
            
            const triangleOuter = document.createElement('div');
            triangleOuter.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            `;
            
            const triangleInner = document.createElement('div');
            triangleInner.style.cssText = `
                position: absolute;
                top: 2px;
                left: 2px;
                width: calc(100% - 4px);
                height: calc(100% - 4px);
                background: #0a0a0f;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
            `;
            
            note.appendChild(triangleOuter);
            note.appendChild(triangleInner);
        } else {
            note.style.width = `${noteSize}px`;
            note.style.height = `${noteSize}px`;
            note.style.border = '2px solid #fff';
            note.style.borderRadius = type === 'circle' ? '50%' : '3px';
            
            if (size === 'medium' || size === 'large') {
                note.style.borderWidth = '3px';
            } else if (size === 'xlarge' || size === 'xxlarge') {
                note.style.borderWidth = '4px';
            }
        }
        
        this.scoreContainer.appendChild(note);
        this.notes.push(note);
        
        this.animateNoteIn(note);
        this.adjustScoreWidth(x + noteSize + 100);
        
        if (x > this.lastNotePosition) {
            this.lastNotePosition = x;
        }
    }
    
    calculatePitch(y) {
        const containerHeight = this.scoreContainer.clientHeight;
        const normalized = 1 - (y / containerHeight);
        
        const scale = [
            87.31, 98.00, 110.00, 123.47, 130.81, 146.83, 164.81, 196.00,
            220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25
        ];
        
        const index = Math.floor(normalized * (scale.length - 1));
        return scale[index] || scale[0];
    }
    
    calculateDuration(size) {
        const durations = {
            small: 0.2,
            medium: 0.4,
            large: 0.8,
            xlarge: 1.6,
            xxlarge: 3.2
        };
        return durations[size];
    }
    
    getNoteSize(size) {
        const sizes = {
            small: 16,
            medium: 24,
            large: 32,
            xlarge: 40,
            xxlarge: 48
        };
        return sizes[size];
    }
    
    startNoteDrag(e, note) {
        if (e.button !== 0) return;
        
        if (document.getElementById('eraser-tool').classList.contains('active')) {
            this.removeNote(note);
            return;
        }
        
        e.preventDefault();
        this.isDraggingNote = true;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startNoteX = parseInt(note.style.left) || 0;
        const startNoteY = parseInt(note.style.top) || 0;
        
        note.style.opacity = '0.7';
        note.style.zIndex = '100';
        
        const moveHandler = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            let newX = startNoteX + deltaX;
            let newY = startNoteY + deltaY;
            
            const noteSize = this.getNoteSize(note.dataset.size);
            const maxX = this.currentScoreWidth - noteSize;
            const maxY = this.scoreContainer.clientHeight - noteSize;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            note.style.left = `${newX}px`;
            note.style.top = `${newY}px`;
            
            note.dataset.y = newY;
            note.dataset.pitch = this.calculatePitch(newY);
            
            if (newX > this.lastNotePosition) {
                this.lastNotePosition = newX;
            }
        };
        
        const upHandler = () => {
            note.style.opacity = '1';
            note.style.zIndex = '5';
            this.isDraggingNote = false;
            
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }
    
    animateNoteIn(note) {
        note.style.opacity = '0';
        note.style.transform = 'scale(0.3)';
        
        requestAnimationFrame(() => {
            note.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
            note.style.opacity = '1';
            note.style.transform = 'scale(1)';
            
            setTimeout(() => {
                note.style.transition = '';
            }, 300);
        });
    }
    
    removeNote(note) {
        if (this.isDraggingNote) return;
        
        const index = this.notes.indexOf(note);
        if (index > -1) {
            this.notes.splice(index, 1);
        }
        
        note.style.transition = 'all 0.3s ease';
        note.style.opacity = '0';
        note.style.transform = 'scale(0)';
        
        setTimeout(() => note.remove(), 300);
    }
    
    togglePlayback() {
        if (this.isPlaying) {
            this.pausePlayback();
        } else {
            this.startPlayback();
        }
    }
    
    pausePlayback() {
        this.isPlaying = false;
        this.btnPlay.textContent = '▶';
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Detener todos los sonidos
        this.activeSounds.forEach(sound => {
            if (sound.oscillator) {
                sound.oscillator.stop();
            }
        });
        this.activeSounds.clear();
    }
    
    startPlayback() {
        this.isPlaying = true;
        this.btnPlay.textContent = '⏸';
        this.lastTimestamp = performance.now();
        
        // Limpiar sonidos anteriores
        this.activeSounds.forEach(sound => {
            if (sound.oscillator) {
                sound.oscillator.stop();
            }
        });
        this.activeSounds.clear();
        
        // Remover clase active de todas las notas
        this.notes.forEach(note => {
            note.classList.remove('active');
        });
        
        this.animatePlayhead();
    }
    
    stopPlayback() {
        this.isPlaying = false;
        this.playheadPosition = 0;
        this.updatePlayheadPosition();
        this.btnPlay.textContent = '▶';
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Detener todos los sonidos
        this.activeSounds.forEach(sound => {
            if (sound.oscillator) {
                sound.oscillator.stop();
            }
        });
        this.activeSounds.clear();
        
        // Remover clase active de todas las notas
        this.notes.forEach(note => {
            note.classList.remove('active');
        });
    }
    
    animatePlayhead() {
        if (!this.isPlaying) return;
        
        const animate = (timestamp) => {
            if (!this.isPlaying) return;
            
            const deltaTime = timestamp - (this.lastTimestamp || timestamp);
            this.lastTimestamp = timestamp;
            
            this.playheadPosition += (this.speed * deltaTime * 0.05);
            
            // Verificar si llegamos al final
            const margin = 200;
            if (this.notes.length > 0) {
                let maxNoteX = 0;
                this.notes.forEach(note => {
                    const noteX = parseInt(note.style.left);
                    if (noteX > maxNoteX) {
                        maxNoteX = noteX;
                    }
                });
                
                if (this.playheadPosition > maxNoteX + margin) {
                    this.stopPlayback();
                    return;
                }
            }
            
            if (this.playheadPosition > this.currentScoreWidth) {
                this.stopPlayback();
                return;
            }
            
            this.updatePlayheadPosition();
            this.checkNoteCollisions(); // ¡ESTO ES LO IMPORTANTE QUE FALTABA!
            this.autoScrollToPlayhead();
            
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    checkNoteCollisions() {
        const tolerance = 12;
        
        this.notes.forEach(note => {
            const noteX = parseInt(note.style.left);
            const noteWidth = this.getNoteSize(note.dataset.size);
            const noteEnd = noteX + noteWidth;
            
            const isColliding = this.playheadPosition >= noteX && this.playheadPosition <= noteEnd;
            
            if (isColliding && !note.classList.contains('active')) {
                this.activateNote(note);
            } else if (!isColliding && note.classList.contains('active')) {
                note.classList.remove('active');
            }
        });
    }
    
    activateNote(note) {
        note.classList.add('active');
        this.playNoteSound(note);
        
        setTimeout(() => {
            if (note.classList.contains('active')) {
                note.classList.remove('active');
            }
        }, 800);
    }
    
    playNoteSound(note) {
        try {
            if (!this.audioContext) return;
            
            const pitch = parseFloat(note.dataset.pitch);
            const duration = this.calculateDuration(note.dataset.size);
            const type = note.dataset.type;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            switch(type) {
                case 'circle':
                    oscillator.type = 'sine';
                    break;
                case 'triangle':
                    oscillator.type = 'triangle';
                    break;
                case 'square':
                    oscillator.type = 'square';
                    break;
            }
            
            oscillator.frequency.value = pitch;
            
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(0, now);
            
            if (type === 'square') {
                gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);
            } else {
                gainNode.gain.linearRampToValueAtTime(0.25, now + 0.1);
                gainNode.gain.linearRampToValueAtTime(0.15, now + duration * 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
            }
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            const id = `${Date.now()}-${Math.random()}`;
            this.activeSounds.set(id, { oscillator, gainNode });
            
            setTimeout(() => {
                this.activeSounds.delete(id);
            }, duration * 1000);
            
        } catch (error) {
            console.log("Error de audio:", error);
        }
    }
    
    updatePlayheadPosition() {
        this.playhead.style.left = `${this.playheadPosition}px`;
        this.timelineSlider.value = this.playheadPosition;
    }
    
    autoScrollToPlayhead() {
        const scrollWidth = this.scoreWrapper.clientWidth;
        const targetScroll = this.playheadPosition - scrollWidth / 2;
        this.scoreWrapper.scrollLeft = Math.max(0, Math.min(targetScroll, this.currentScoreWidth - scrollWidth));
    }
    
    clearAllNotes() {
        if (!confirm('¿Borrar todas las notas?')) return;
        
        this.notes.forEach(note => {
            note.remove();
        });
        
        this.notes = [];
        this.lastNotePosition = 0;
        this.currentScoreWidth = this.scoreWidth;
        this.scoreContainer.style.width = `${this.currentScoreWidth}px`;
        this.timelineSlider.max = this.currentScoreWidth;
    }
    
    adjustScoreWidth(x) {
        if (x > this.currentScoreWidth - 200) {
            this.currentScoreWidth = Math.max(this.currentScoreWidth + 500, x + 300);
            this.scoreContainer.style.width = `${this.currentScoreWidth}px`;
            this.timelineSlider.max = this.currentScoreWidth;
        }
    }
    
    setupScoreArea() {
        this.scoreContainer.style.width = `${this.scoreWidth}px`;
        this.adjustScoreHeight();
        window.addEventListener('resize', () => this.adjustScoreHeight());
    }
    
    adjustScoreHeight() {
        const wrapperHeight = this.scoreWrapper.clientHeight;
        this.scoreContainer.style.height = `${wrapperHeight}px`;
    }
}

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const game = new MusicGame();
    console.log("Juego inicializado - arrastre de figuras y sonido activado");
    
    // Agregar funcionalidad del modal
    const uploadBtn = document.getElementById('btn-upload');
    const uploadModal = document.getElementById('upload-modal');
    const cancelUploadBtn = document.getElementById('btn-cancel-upload');
    const uploadForm = document.getElementById('upload-form');
    const toast = document.getElementById('toast');
    
    if (uploadBtn && uploadModal) {
        uploadBtn.addEventListener('click', () => {
            uploadModal.classList.remove('hidden');
        });
    }
    
    if (cancelUploadBtn && uploadModal) {
        cancelUploadBtn.addEventListener('click', () => {
            uploadModal.classList.add('hidden');
        });
    }
    
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const beatName = document.getElementById('beat-name').value;
            
            if (!beatName.trim()) {
                alert('Por favor, ingresa un nombre para tu beat');
                return;
            }
            
            console.log('Beat subido:', beatName);
            
            // Mostrar toast
            if (toast) {
                toast.textContent = '¡Beat subido exitosamente!';
                toast.classList.remove('hidden');
                
                setTimeout(() => {
                    toast.classList.add('hidden');
                }, 3000);
            }
            
            uploadModal.classList.add('hidden');
            uploadForm.reset();
        });
    }
    
    // Cerrar modal al hacer clic fuera
    if (uploadModal) {
        uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.classList.add('hidden');
            }
        });
    }
});

const btnHelp = document.getElementById("btnHelp");
  const modal = document.getElementById("helpModal");
  const closeModal = document.getElementById("closeModal");

  btnHelp.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar al hacer clic fuera del modal
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });