/**
 * game1.js - Juego de partitura interactiva - VERSIÓN FINAL
 * Corrección completa de posición, triángulos outline y sin borrado accidental
 * Play continúa desde donde se paró
 */

class MusicGame {
    constructor() {
        // Estado del juego
        this.isPlaying = false;
        this.speed = 1.0;
        this.playheadPosition = 0;
        this.notes = [];
        this.isDraggingShape = false;
        this.currentDragClone = null;
        this.lastNotePosition = 0;
        this.isDraggingNote = false;
        this.animationFrameId = null;
        
        // Configuración
        this.scoreWidth = 3000;
        this.currentScoreWidth = this.scoreWidth;
        
        // Inicializar
        this.initAudio();
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupImprovedDragAndDrop();
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
        
        this.shapes = document.querySelectorAll('.shape:not(#eraser-tool)');
        this.eraserTool = document.getElementById('eraser-tool');
        
        this.uploadModal = document.getElementById('upload-modal');
        this.btnCancelUpload = document.getElementById('btn-cancel-upload');
        this.btnConfirmUpload = document.getElementById('btn-confirm-upload');
        this.uploadForm = document.getElementById('upload-form');
        this.toast = document.getElementById('toast');
        
        this.modoTeatroBtn = document.getElementById('modoTeatroBtn');
        this.contenedorJuego = document.getElementById('contenedorJuego');
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
        
        // Play continúa desde donde se paró
        this.btnPlay.addEventListener('click', () => this.togglePlayback());
        this.btnStop.addEventListener('click', () => this.stopPlayback());
        this.btnClear.addEventListener('click', () => this.clearAllNotes());
        this.btnUpload.addEventListener('click', () => this.showUploadModal());
        
        this.btnCancelUpload.addEventListener('click', () => this.hideUploadModal());
        this.uploadForm.addEventListener('submit', (e) => this.handleUpload(e));
        
        this.eraserTool.addEventListener('click', (e) => {
            e.stopPropagation();
            this.eraserTool.classList.toggle('active');
        });
        
        this.modoTeatroBtn.addEventListener('click', () => this.toggleModoTeatro());
        
        this.scoreWrapper.addEventListener('wheel', (e) => {
            this.scoreWrapper.scrollLeft += e.deltaY * 0.5;
            e.preventDefault();
        }, { passive: false });
    }
    
    setupImprovedDragAndDrop() {
        this.shapes.forEach(shape => {
            shape.addEventListener('mousedown', this.startShapeDrag.bind(this));
        });
        
        this.scoreContainer.addEventListener('mousedown', this.startNoteDrag.bind(this));
        
        this.scoreContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const note = e.target.closest('.note');
            if (note && !this.isDraggingNote) {
                this.removeNote(note);
            }
        });
        
        document.querySelectorAll('.shape-preview').forEach(preview => {
            preview.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        });
    }
    
    startShapeDrag(e) {
        if (e.button !== 0) return;
        
        const shape = e.currentTarget;
        const type = shape.dataset.type;
        const size = shape.dataset.size;
        
        this.currentDragClone = this.createDragClone(type, size);
        document.body.appendChild(this.currentDragClone);
        this.isDraggingShape = true;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const cloneStartX = parseInt(this.currentDragClone.style.left) || e.clientX - 25;
        const cloneStartY = parseInt(this.currentDragClone.style.top) || e.clientY - 25;
        
        const moveHandler = (moveEvent) => {
            if (!this.currentDragClone || !this.isDraggingShape) return;
            
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            
            this.currentDragClone.style.left = `${cloneStartX + deltaX}px`;
            this.currentDragClone.style.top = `${cloneStartY + deltaY}px`;
        };
        
        const upHandler = (upEvent) => {
            if (this.isDraggingShape && this.currentDragClone) {
                const scoreRect = this.scoreContainer.getBoundingClientRect();
                const scrollLeft = this.scoreWrapper.scrollLeft;
                
                const cloneRect = this.currentDragClone.getBoundingClientRect();
                const x = cloneRect.left - scoreRect.left + scrollLeft;
                const y = cloneRect.top - scoreRect.top;
                
                this.addNoteToScore(type, size, x, y);
                
                this.isDraggingShape = false;
                this.currentDragClone.remove();
                this.currentDragClone = null;
            }
            
            document.removeEventListener('mousemove', moveHandler);
            document.removeEventListener('mouseup', upHandler);
        };
        
        this.currentDragClone.style.left = `${e.clientX - 25}px`;
        this.currentDragClone.style.top = `${e.clientY - 25}px`;
        
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }
    
    startNoteDrag(e) {
        const note = e.target.closest('.note');
        if (!note || e.button !== 0) return;
        
        if (this.eraserTool.classList.contains('active')) {
            this.removeNote(note);
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDraggingNote = true;
        
        const startX = e.clientX;
        const startY = e.clientY;
        const startNoteX = parseInt(note.style.left) || 0;
        const startNoteY = parseInt(note.style.top) || 0;
        const scrollLeft = this.scoreWrapper.scrollLeft;
        
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
            
            this.autoScrollDuringDrag(newX, noteSize);
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
    
    createDragClone(type, size) {
        const clone = document.createElement('div');
        clone.className = `note ${type} ${size} dragging`;
        clone.style.position = 'fixed';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.8';
        clone.style.transform = 'scale(1.3)';
        
        const noteSize = this.getNoteSize(size);
        
        if (type === 'triangle') {
            clone.style.width = `${noteSize}px`;
            clone.style.height = `${noteSize * 0.875}px`;
            clone.style.background = 'none';
            clone.style.border = 'none';
            
            const triangleOutline = document.createElement('div');
            triangleOutline.style.cssText = `
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
            
            clone.appendChild(triangleOutline);
            clone.appendChild(triangleInner);
        } else {
            clone.style.width = `${noteSize}px`;
            clone.style.height = `${noteSize}px`;
            clone.style.border = '2px solid #fff';
            
            if (type === 'circle') {
                clone.style.borderRadius = '50%';
            } else if (type === 'square') {
                clone.style.borderRadius = '3px';
            }
            
            if (size === 'medium' || size === 'large') {
                clone.style.borderWidth = '3px';
            } else if (size === 'xlarge' || size === 'xxlarge') {
                clone.style.borderWidth = '4px';
            }
        }
        
        return clone;
    }
    
    addNoteToScore(type, size, x, y) {
        const containerHeight = this.scoreContainer.clientHeight;
        const noteSize = this.getNoteSize(size);
        
        x = x - (noteSize / 2);
        y = y - (noteSize / 2);
        
        x = Math.max(10, Math.min(x, this.currentScoreWidth - noteSize - 10));
        y = Math.max(10, Math.min(y, containerHeight - noteSize - 10));
        
        if (x > this.lastNotePosition) {
            this.lastNotePosition = x;
        }
        
        const note = document.createElement('div');
        note.className = `note ${type} ${size}`;
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        note.dataset.type = type;
        note.dataset.size = size;
        note.dataset.x = x;
        note.dataset.y = y;
        note.dataset.pitch = this.calculatePitch(y);
        
        if (type === 'triangle') {
            note.style.width = `${noteSize}px`;
            note.style.height = `${noteSize * 0.875}px`;
            note.style.position = 'relative';
            note.style.background = 'none';
            note.style.border = 'none';
            
            const triangleOuter = document.createElement('div');
            triangleOuter.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #fff;
                clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
                transition: all 0.3s ease;
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
                transition: all 0.3s ease;
            `;
            
            note.appendChild(triangleOuter);
            note.appendChild(triangleInner);
        } else {
            note.style.width = `${noteSize}px`;
            note.style.height = `${noteSize}px`;
            note.style.border = '2px solid #fff';
            
            if (type === 'circle') {
                note.style.borderRadius = '50%';
            } else if (type === 'square') {
                note.style.borderRadius = '3px';
            }
            
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
        this.autoScrollToPosition(x);
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
    
    setupScoreArea() {
        this.scoreContainer.style.width = `${this.scoreWidth}px`;
        this.createNoteGrid();
        this.adjustScoreHeight();
        window.addEventListener('resize', () => this.adjustScoreHeight());
    }
    
    createNoteGrid() {
        const containerHeight = this.scoreContainer.clientHeight;
        
        for (let i = 0; i <= 16; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line';
            line.style.position = 'absolute';
            line.style.left = '0';
            line.style.right = '0';
            line.style.top = `${(i / 16) * 100}%`;
            line.style.height = '1px';
            line.style.background = i % 4 === 0 ? 
                'rgba(0, 255, 255, 0.2)' : 
                'rgba(255, 255, 255, 0.1)';
            line.style.zIndex = '1';
            line.style.pointerEvents = 'none';
            this.scoreContainer.appendChild(line);
        }
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
    
    // ===== CONTROL DE REPRODUCCIÓN =====
    
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
    }
    
    startPlayback() {
        if (this.isPlaying) {
            this.pausePlayback();
            return;
        }
        
        // Detener sonidos activos previos
        this.activeSounds.forEach(sound => {
            if (sound.oscillator) {
                sound.oscillator.stop();
            }
        });
        this.activeSounds.clear();
        
        // Remover clase 'active' de todas las notas
        this.notes.forEach(note => {
            note.classList.remove('active');
            if (note.dataset.type === 'triangle') {
                const inner = note.querySelector('div:nth-child(2)');
                if (inner) inner.style.background = '#0a0a0f';
            }
        });
        
        // Iniciar reproducción desde la posición actual
        this.isPlaying = true;
        this.btnPlay.textContent = '⏸';
        this.lastTimestamp = performance.now();
        this.animatePlayhead();
    }
    
    stopPlayback() {
        this.isPlaying = false;
        this.playheadPosition = 0; // Solo stop reinicia a 0
        this.updatePlayheadPosition();
        this.autoScrollToPlayhead();
        this.btnPlay.textContent = '▶';
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        this.activeSounds.forEach(sound => {
            if (sound.oscillator) {
                sound.oscillator.stop();
            }
        });
        this.activeSounds.clear();
        
        this.notes.forEach(note => {
            note.classList.remove('active');
            if (note.dataset.type === 'triangle') {
                const inner = note.querySelector('div:nth-child(2)');
                if (inner) inner.style.background = '#0a0a0f';
            }
        });
    }
    
    animatePlayhead() {
        if (!this.isPlaying) return;
        
        const animate = (timestamp) => {
            if (!this.isPlaying) return;
            
            const deltaTime = timestamp - (this.lastTimestamp || timestamp);
            this.lastTimestamp = timestamp;
            
            this.playheadPosition += (this.speed * deltaTime * 0.05);
            
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
            this.checkNoteCollisions();
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
                
                if (note.dataset.type === 'triangle') {
                    const inner = note.querySelector('div:nth-child(2)');
                    if (inner) inner.style.background = '#0a0a0f';
                }
            }
        });
    }
    
    activateNote(note) {
        note.classList.add('active');
        this.playNoteSound(note);
        this.createEnhancedSparkEffect(note);
        
        if (note.dataset.type === 'triangle') {
            const inner = note.querySelector('div:nth-child(2)');
            if (inner) inner.style.background = 'rgba(255, 0, 128, 0.4)';
        }
        
        setTimeout(() => {
            if (note.classList.contains('active')) {
                note.classList.remove('active');
                
                if (note.dataset.type === 'triangle') {
                    const inner = note.querySelector('div:nth-child(2)');
                    if (inner) inner.style.background = '#0a0a0f';
                }
            }
        }, 800);
    }
    
    createEnhancedSparkEffect(note) {
        const rect = note.getBoundingClientRect();
        const containerRect = this.gameContainer.getBoundingClientRect();
        
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        
        let sparkColor;
        switch(note.dataset.type) {
            case 'circle': sparkColor = '#00ffff'; break;
            case 'triangle': sparkColor = '#ff0080'; break;
            case 'square': sparkColor = '#ffaa00'; break;
        }
        
        for (let i = 0; i < 35; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.cssText = `
                position: fixed;
                width: ${4 + Math.random() * 6}px;
                height: ${4 + Math.random() * 6}px;
                border-radius: 50%;
                background: ${sparkColor};
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 100;
                box-shadow: 0 0 20px ${sparkColor}, 0 0 40px ${sparkColor};
            `;
            
            this.gameContainer.appendChild(spark);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 75;
            const sparkDuration = 0.6 + Math.random() * 1.0;
            
            spark.animate([
                { 
                    transform: 'translate(0, 0) scale(1) rotate(0deg)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(360deg)`, 
                    opacity: 0 
                }
            ], { 
                duration: sparkDuration * 1000, 
                easing: 'cubic-bezier(0.19, 1, 0.22, 1)' 
            });
            
            setTimeout(() => spark.remove(), sparkDuration * 1000);
        }
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
    
    removeNote(note) {
        if (this.isDraggingNote) return;
        
        const index = this.notes.indexOf(note);
        if (index > -1) {
            this.notes.splice(index, 1);
        }
        
        if (parseInt(note.style.left) >= this.lastNotePosition) {
            this.recalculateLastNotePosition();
        }
        
        note.style.transition = 'all 0.3s ease';
        note.style.opacity = '0';
        note.style.transform = 'scale(0)';
        
        setTimeout(() => note.remove(), 300);
    }
    
    clearAllNotes() {
        if (!confirm('¿Borrar todas las notas?')) return;
        
        this.notes.forEach(note => {
            note.style.transition = 'all 0.3s ease';
            note.style.opacity = '0';
            note.style.transform = 'scale(0)';
            setTimeout(() => note.remove(), 300);
        });
        
        this.notes = [];
        this.lastNotePosition = 0;
        this.currentScoreWidth = this.scoreWidth;
        this.scoreContainer.style.width = `${this.currentScoreWidth}px`;
        this.scoreWrapper.scrollLeft = 0;
        this.timelineSlider.max = this.currentScoreWidth;
        this.timelineSlider.value = 0;
        this.updatePlayheadPosition();
    }
    
    showUploadModal() {
        this.uploadModal.classList.remove('hidden');
    }
    
    hideUploadModal() {
        this.uploadModal.classList.add('hidden');
        this.uploadForm.reset();
    }
    
    handleUpload(e) {
        e.preventDefault();
        
        const beatName = document.getElementById('beat-name').value;
        
        if (!beatName.trim()) {
            alert('Por favor, ingresa un nombre para tu beat');
            return;
        }
        
        console.log('Beat subido:', {
            name: beatName,
            notes: this.notes.length
        });
        
        this.showToast('¡Beat subido exitosamente!');
        this.hideUploadModal();
    }
    
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }
    
    toggleModoTeatro() {
        this.contenedorJuego.classList.toggle('modo-teatro');
        const btn = this.modoTeatroBtn;
        
        if (this.contenedorJuego.classList.contains('modo-teatro')) {
            btn.textContent = 'Salir Teatro';
            btn.style.position = 'fixed';
            btn.style.bottom = '30px';
            btn.style.right = '30px';
            btn.style.zIndex = '10000';
        } else {
            btn.textContent = 'Modo Teatro';
            btn.style.position = 'absolute';
            btn.style.bottom = '20px';
            btn.style.right = '20px';
        }
        
        setTimeout(() => this.adjustScoreHeight(), 100);
    }
    
    adjustScoreHeight() {
        const wrapperHeight = this.scoreWrapper.clientHeight;
        this.scoreContainer.style.height = `${wrapperHeight}px`;
    }
    
    autoScrollToPlayhead() {
        const scrollWidth = this.scoreWrapper.clientWidth;
        const targetScroll = this.playheadPosition - scrollWidth / 2;
        this.scoreWrapper.scrollLeft = Math.max(0, Math.min(targetScroll, this.currentScoreWidth - scrollWidth));
    }
    
    autoScrollToPosition(x) {
        const scrollWidth = this.scoreWrapper.clientWidth;
        const targetScroll = x - scrollWidth / 2;
        this.scoreWrapper.scrollLeft = Math.max(0, Math.min(targetScroll, this.currentScoreWidth - scrollWidth));
    }
    
    autoScrollDuringDrag(x, noteSize) {
        const scrollLeft = this.scoreWrapper.scrollLeft;
        const scrollWidth = this.scoreWrapper.clientWidth;
        const scrollRight = scrollLeft + scrollWidth;
        
        if (x + noteSize > scrollRight - 50) {
            this.scoreWrapper.scrollLeft += 20;
        } else if (x < scrollLeft + 50) {
            this.scoreWrapper.scrollLeft = Math.max(0, scrollLeft - 20);
        }
    }
    
    updatePlayheadPosition() {
        this.playhead.style.left = `${this.playheadPosition}px`;
        this.timelineSlider.value = this.playheadPosition;
    }
    
    recalculateLastNotePosition() {
        this.lastNotePosition = 0;
        this.notes.forEach(note => {
            const noteX = parseInt(note.style.left);
            if (noteX > this.lastNotePosition) {
                this.lastNotePosition = noteX;
            }
        });
    }
    
    adjustScoreWidth(x) {
        if (x > this.currentScoreWidth - 200) {
            this.currentScoreWidth = Math.max(this.currentScoreWidth + 500, x + 300);
            this.scoreContainer.style.width = `${this.currentScoreWidth}px`;
            this.timelineSlider.max = this.currentScoreWidth;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new MusicGame();
    console.log("Juego inicializado - versión final con play que continúa desde donde se paró");
});