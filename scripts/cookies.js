// ESTADÍSTICAS SIMPLES DE GÉNEROS POPULARES
class MusicStats {
    constructor() {
        // CLAVES para localStorage
        this.STORAGE_KEY = 'music_genres_stats';
        this.COOKIE_KEY = 'music_stats_accepted';
        
        // Estadísticas globales (todos los usuarios)
        this.stats = this.getStats();
        
        // Inicializar
        this.init();
    }
    
    init() {
        // Solo mostrar banner si NO ha decidido
        if (!this.hasAccepted()) {
            this.createBanner();
            this.showBanner();
        }
    }
    

    // BANNER SIMPLE (solo aparece una vez)
    createBanner() {
        // Crear contenedor
        const banner = document.createElement('div');
        banner.id = 'music-stats-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #0e0d13;
            color: white;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #a6b54f;
            z-index: 9999;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            display: none;
        `;
        
        // Contenido del banner
        banner.innerHTML = `
            <p style="margin: 0 0 15px 0; font-size: 14px;">
                🎵 <strong>Ayúdanos a ver qué géneros son más populares</strong><br>
                <small>Solo guardamos el género que juegas, nada más.</small>
            </p>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="stats-no" style="
                    padding: 8px 20px;
                    background-color: #ff5555;
                    color: white;
                    border: 1px solid #ff5555;
                    border-radius: 5px;
                    cursor: pointer;
                ">No gracias</button>
                <button id="stats-yes" style="
                    padding: 8px 20px;
                    background: #a6b54f;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">¡Claro!</button>
            </div>
        `;
        
        // Añadir al body
        document.body.appendChild(banner);
        
        // Eventos de los botones
        document.getElementById('stats-yes').addEventListener('click', () => {
            this.accept();
            this.hideBanner();
        });
        
        document.getElementById('stats-no').addEventListener('click', () => {
            this.reject();
            this.hideBanner();
        });
    }
    
    showBanner() {
        const banner = document.getElementById('music-stats-banner');
        if (banner) {
            setTimeout(() => {
                banner.style.display = 'block';
            }, 2000); // Aparece a los 2 segundos
        }
    }
    
    hideBanner() {
        const banner = document.getElementById('music-stats-banner');
        if (banner) {
            banner.style.display = 'none';
            // Eliminar del DOM después de ocultar
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 300);
        }
    }
    
    // ============================================
    // GESTIÓN SIMPLE DE DECISIÓN
    // ============================================
    
    accept() {
        // Guardar que aceptó (esto es todo lo que guardamos de él)
        localStorage.setItem(this.COOKIE_KEY, 'true');
        console.log('✅ Usuario aceptó compartir estadísticas de género');
    }
    
    reject() {
        // Guardar que rechazó
        localStorage.setItem(this.COOKIE_KEY, 'false');
        console.log('❌ Usuario rechazó compartir estadísticas');
    }
    
    hasAccepted() {
        // Verificar si ya tomó decisión
        return localStorage.getItem(this.COOKIE_KEY) !== null;
    }
    
    canTrack() {
        // Solo podemos trackear si aceptó
        return localStorage.getItem(this.COOKIE_KEY) === 'true';
    }
    
    // ============================================
    // ESTADÍSTICAS DE GÉNEROS (LO ÚNICO QUE GUARDAMOS)
    // ============================================
    
    getStats() {
        // Obtener estadísticas de localStorage
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch {
                // Si hay error, devolver objeto vacío
            }
        }
        
        // Inicializar si no existe
        return {
            // Contador por géneros
            genres: {},
            // Total de partidas
            totalPlays: 0,
            // Última actualización
            lastUpdate: null
        };
    }
    
    saveStats() {
        // Guardar estadísticas actualizadas
        this.stats.lastUpdate = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
    }
    
    // ============================================
    // MÉTODO PRINCIPAL: REGISTRAR GÉNERO JUGADO
    // ============================================
    
    recordGenrePlay(genre) {
        // Solo registrar si el usuario aceptó
        if (!this.canTrack()) {
            return false;
        }
        
        // Asegurar que el género es string y limpiarlo
        const cleanGenre = String(genre).trim().toLowerCase();
        
        // Incrementar contador del género
        if (!this.stats.genres[cleanGenre]) {
            this.stats.genres[cleanGenre] = 0;
        }
        this.stats.genres[cleanGenre]++;
        
        // Incrementar total
        this.stats.totalPlays++;
        
        // Guardar
        this.saveStats();
        
        console.log(`📊 Registrado: ${cleanGenre} (Total: ${this.stats.genres[cleanGenre]})`);
        return true;
    }
    
    // ============================================
    // OBTENER ESTADÍSTICAS (para mostrar)
    // ============================================
    
    getTopGenres(limit = 5) {
        // Convertir objeto a array y ordenar
        const genresArray = Object.entries(this.stats.genres)
            .map(([genre, count]) => ({ genre, count }))
            .sort((a, b) => b.count - a.count);
        
        // Limitar resultados
        return genresArray.slice(0, limit);
    }
    
    getGenreStats(genre) {
        const cleanGenre = String(genre).trim().toLowerCase();
        return this.stats.genres[cleanGenre] || 0;
    }
    
    getTotalPlays() {
        return this.stats.totalPlays;
    }
    
    // ============================================
    // MOSTRAR ESTADÍSTICAS EN PÁGINA
    // ============================================
    
    displayStats(elementId) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        const topGenres = this.getTopGenres(10);
        const total = this.getTotalPlays();
        
        if (total === 0) {
            container.innerHTML = `
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                    <h3 style="margin-top: 0;">🎵 Géneros Populares</h3>
                    <p>Aún no hay suficientes datos. ¡Sé el primero en jugar!</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                <h3 style="margin-top: 0;">🎵 Géneros Más Jugados</h3>
                <p><small>Total de partidas registradas: ${total}</small></p>
        `;
        
        topGenres.forEach(({ genre, count }) => {
            const percentage = Math.round((count / total) * 100);
            html += `
                <div style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                        <span style="font-weight: bold; text-transform: capitalize;">${genre}</span>
                        <span>${count} (${percentage}%)</span>
                    </div>
                    <div style="height: 8px; background: #ddd; border-radius: 4px; overflow: hidden;">
                        <div style="height: 100%; width: ${percentage}%; background: #FF6B8B;"></div>
                    </div>
                </div>
            `;
        });
        
        html += `
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
                <small>Estadísticas anónimas de todos los usuarios</small>
            </p>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    // ============================================
    // RESETEAR (solo para testing)
    // ============================================
    
    resetAll() {
        if (confirm('¿Resetear todas las estadísticas?')) {
            localStorage.removeItem(this.STORAGE_KEY);
            localStorage.removeItem(this.COOKIE_KEY);
            this.stats = this.getStats(); // Reiniciar objeto
            console.log('🔄 Estadísticas reseteadas');
        }
    }
}

// ============================================
// USO INMEDIATO Y FÁCIL
// ============================================

// Crear instancia global automáticamente
window.MusicStats = new MusicStats();

// ============================================
// CÓMO USARLO EN TUS JUEGOS (MUY SIMPLE)
// ============================================

/*
// 1. Cuando un usuario juegue un género:
function juegoTerminado(genero) {
    // Registrar el género jugado (solo esto)
    window.MusicStats.recordGenrePlay(genero);
    
    // Tu lógica normal del juego...
    console.log(`Juego terminado: ${genero}`);
}

// 2. Mostrar estadísticas en alguna parte:
function mostrarEstadisticas() {
    window.MusicStats.displayStats('stats-container');
}

// 3. Ver top géneros:
function verTopGeneros() {
    const top = window.MusicStats.getTopGenres(5);
    console.log('Top 5 géneros:', top);
    
    top.forEach((item, index) => {
        console.log(`${index + 1}. ${item.genre}: ${item.count} veces`);
    });
}

// 4. Verificar si el usuario aceptó:
function usuarioAcepto() {
    return window.MusicStats.canTrack();
}
*/