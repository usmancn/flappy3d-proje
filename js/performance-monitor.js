// ============================================================================
// PERFORMANCE MONITOR MODULE
// ============================================================================
// Purpose: Real-time performance diagnostics for 3D Flappy Bird game
// Tracks: FPS, memory, renderer stats, object counts
// Created: 2025-12-24 for performance optimization investigation
// ============================================================================

const PerformanceMonitor = {
    // Configuration
    enabled: true,
    logIntervalSeconds: 5,

    // State
    lastLogTime: 0,
    frameTimes: [],
    maxFrameTimeSamples: 300, // Track last 5 seconds @ 60fps

    // DOM Elements
    overlayElement: null,

    // Stats
    stats: {
        fps: 60,
        worstFrameTime: 0,
        avgFrameTime: 0,
        drawCalls: 0,
        triangles: 0,
        geometries: 0,
        textures: 0,
        materials: 0,
        jsHeapSize: 0,
        jsHeapLimit: 0,
        pipes: 0,
        clouds: 0,
        powerUps: 0,
        roadSegments: 0
    },

    /**
     * Initialize the performance monitor
     */
    init: function () {
        if (!this.enabled) return;

        this.createDebugOverlay();
        console.log('📊 Performance Monitor initialized');
        console.log('📝 Metrics will be logged every ' + this.logIntervalSeconds + ' seconds');
    },

    /**
     * Create the on-screen debug overlay
     */
    createDebugOverlay: function () {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.id = 'debug-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.85);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 12px;
            border-radius: 6px;
            border: 2px solid #00ff00;
            z-index: 10000;
            min-width: 280px;
            box-shadow: 0 4px 12px rgba(0, 255, 0, 0.3);
            pointer-events: none;
            line-height: 1.5;
        `;

        document.body.appendChild(overlay);
        this.overlayElement = overlay;
    },

    /**
     * Update and display all metrics
     * @param {number} deltaTime - Frame delta time in milliseconds
     */
    update: function (deltaTime) {
        if (!this.enabled || !this.overlayElement) return;

        const currentTime = performance.now();

        // Track frame times for worst-case analysis
        this.frameTimes.push(deltaTime);
        if (this.frameTimes.length > this.maxFrameTimeSamples) {
            this.frameTimes.shift();
        }

        // Calculate FPS metrics
        this.stats.fps = currentFPS; // Use global FPS from loop.js
        this.stats.avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        this.stats.worstFrameTime = Math.max(...this.frameTimes);

        // Get renderer info (Three.js renderer stats)
        if (typeof renderer !== 'undefined' && renderer.info) {
            this.stats.drawCalls = renderer.info.render.calls;
            this.stats.triangles = renderer.info.render.triangles;

            // Three.js memory info (geometries, textures, programs)
            if (renderer.info.memory) {
                this.stats.geometries = renderer.info.memory.geometries || 0;
                this.stats.textures = renderer.info.memory.textures || 0;
            }

            // Count materials from scene
            this.stats.materials = this.countMaterials();
        }

        // Get JS heap memory (Chrome only)
        if (performance.memory) {
            this.stats.jsHeapSize = performance.memory.usedJSHeapSize;
            this.stats.jsHeapLimit = performance.memory.totalJSHeapSize;
        }

        // Get game object counts
        this.stats.pipes = typeof pipes !== 'undefined' ? pipes.length : 0;
        this.stats.clouds = typeof clouds !== 'undefined' ? clouds.length : 0;
        this.stats.powerUps = typeof powerUps !== 'undefined' ? powerUps.length : 0;
        this.stats.roadSegments = typeof roadSegments !== 'undefined' ? roadSegments.length : 0;

        // Update display
        this.updateOverlay();

        // Periodic console logging
        if (currentTime - this.lastLogTime >= this.logIntervalSeconds * 1000) {
            this.logToConsole();
            this.lastLogTime = currentTime;
        }
    },

    /**
     * Count all materials in the scene
     */
    countMaterials: function () {
        if (typeof scene === 'undefined') return 0;

        let materialSet = new Set();
        scene.traverse(function (obj) {
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => materialSet.add(m.uuid));
                } else {
                    materialSet.add(obj.material.uuid);
                }
            }
        });
        return materialSet.size;
    },

    /**
     * Update the debug overlay display
     */
    updateOverlay: function () {
        if (!this.overlayElement) return;

        // Color coding for warnings
        const fpsColor = this.stats.fps < 50 ? '#ff4444' : (this.stats.fps < 55 ? '#ffaa00' : '#00ff00');
        const worstFrameColor = this.stats.worstFrameTime > 20 ? '#ff4444' : (this.stats.worstFrameTime > 18 ? '#ffaa00' : '#00ff00');
        const heapPercent = this.stats.jsHeapLimit > 0 ? (this.stats.jsHeapSize / this.stats.jsHeapLimit * 100) : 0;
        const heapColor = heapPercent > 80 ? '#ff4444' : (heapPercent > 60 ? '#ffaa00' : '#00ff00');

        this.overlayElement.innerHTML = `
            <div style="color: #ffffff; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #00ff00; padding-bottom: 4px;">
                ⚡ PERFORMANCE MONITOR
            </div>
            
            <div style="margin-bottom: 6px;">
                <span style="color: #aaaaaa;">FPS:</span> 
                <span style="color: ${fpsColor}; font-weight: bold;">${this.stats.fps}</span>
                <span style="color: #666;"> | Avg: ${this.stats.avgFrameTime.toFixed(1)}ms</span>
            </div>
            
            <div style="margin-bottom: 6px;">
                <span style="color: #aaaaaa;">Worst Frame:</span> 
                <span style="color: ${worstFrameColor}; font-weight: bold;">${this.stats.worstFrameTime.toFixed(1)}ms</span>
            </div>
            
            <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #333;">
                <span style="color: #aaaaaa;">Draw Calls:</span> 
                <span style="color: #00ddff;">${this.stats.drawCalls}</span>
                <span style="color: #666;"> | Tris: ${this.formatNumber(this.stats.triangles)}</span>
            </div>
            
            <div style="margin-bottom: 4px;">
                <span style="color: #aaaaaa;">Geometries:</span> 
                <span style="color: #ffaa00;">${this.stats.geometries}</span>
            </div>
            
            <div style="margin-bottom: 4px;">
                <span style="color: #aaaaaa;">Materials:</span> 
                <span style="color: #ffaa00;">${this.stats.materials}</span>
            </div>
            
            <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #333;">
                <span style="color: #aaaaaa;">Textures:</span> 
                <span style="color: #ffaa00;">${this.stats.textures}</span>
            </div>
            
            <div style="margin-bottom: 4px;">
                <span style="color: #aaaaaa;">Pipes:</span> 
                <span style="color: #ff66ff;">${this.stats.pipes}</span>
            </div>
            
            <div style="margin-bottom: 4px;">
                <span style="color: #aaaaaa;">Clouds:</span> 
                <span style="color: #ff66ff;">${this.stats.clouds}</span>
            </div>
            
            <div style="margin-bottom: 4px;">
                <span style="color: #aaaaaa;">PowerUps:</span> 
                <span style="color: #ff66ff;">${this.stats.powerUps}</span>
            </div>
            
            <div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #333;">
                <span style="color: #aaaaaa;">Road Segs:</span> 
                <span style="color: #ff66ff;">${this.stats.roadSegments}</span>
            </div>
            
            ${this.stats.jsHeapSize > 0 ? `
            <div style="margin-bottom: 2px;">
                <span style="color: #aaaaaa;">JS Heap:</span> 
                <span style="color: ${heapColor}; font-weight: bold;">${this.formatBytes(this.stats.jsHeapSize)}</span>
            </div>
            <div style="color: #666; font-size: 10px;">
                ${heapPercent.toFixed(1)}% of ${this.formatBytes(this.stats.jsHeapLimit)}
            </div>
            ` : ''}
        `;
    },

    /**
     * Log metrics to console
     */
    logToConsole: function () {
        const heapPercent = this.stats.jsHeapLimit > 0 ? (this.stats.jsHeapSize / this.stats.jsHeapLimit * 100).toFixed(1) : 'N/A';

        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 PERFORMANCE METRICS @ ' + new Date().toLocaleTimeString());
        console.log('───────────────────────────────────────────────────────────');
        console.log('🎮 FPS:           ', this.stats.fps, '(Avg:', this.stats.avgFrameTime.toFixed(1) + 'ms', '| Worst:', this.stats.worstFrameTime.toFixed(1) + 'ms)');
        console.log('🎨 Draw Calls:    ', this.stats.drawCalls, '| Triangles:', this.formatNumber(this.stats.triangles));
        console.log('📦 GPU Resources: ', 'Geo:', this.stats.geometries, '| Mat:', this.stats.materials, '| Tex:', this.stats.textures);
        console.log('🎯 Game Objects:  ', 'Pipes:', this.stats.pipes, '| Clouds:', this.stats.clouds, '| PowerUps:', this.stats.powerUps, '| Roads:', this.stats.roadSegments);

        // ENHANCED: Detailed renderer.info breakdown
        if (typeof renderer !== 'undefined' && renderer.info) {
            console.log('───────────────────────────────────────────────────────────');
            console.log('🔍 DETAILED RENDERER INFO:');
            if (renderer.info.memory) {
                console.log('   Memory: Geo:', renderer.info.memory.geometries,
                    '| Tex:', renderer.info.memory.textures);
            }
            if (renderer.info.render) {
                console.log('   Render: Calls:', renderer.info.render.calls,
                    '| Tris:', this.formatNumber(renderer.info.render.triangles),
                    '| Points:', renderer.info.render.points,
                    '| Lines:', renderer.info.render.lines);
            }
            if (renderer.info.programs) {
                console.log('   Programs:', renderer.info.programs ? renderer.info.programs.length : 0);
            }
        }

        if (this.stats.jsHeapSize > 0) {
            console.log('💾 JS Heap:       ', this.formatBytes(this.stats.jsHeapSize), '/', this.formatBytes(this.stats.jsHeapLimit), '(' + heapPercent + '%)');
        }

        // ENHANCED: Array length verification (unbounded growth check)
        console.log('───────────────────────────────────────────────────────────');
        console.log('📋 ARRAY INTEGRITY CHECK:');
        console.log('   pipes.length:        ', typeof pipes !== 'undefined' ? pipes.length : 'N/A');
        console.log('   clouds.length:       ', typeof clouds !== 'undefined' ? clouds.length : 'N/A');
        console.log('   powerUps.length:     ', typeof powerUps !== 'undefined' ? powerUps.length : 'N/A');
        console.log('   roadSegments.length: ', typeof roadSegments !== 'undefined' ? roadSegments.length : 'N/A');

        console.log('═══════════════════════════════════════════════════════════');
    },

    /**
     * Format number with K/M suffix
     */
    formatNumber: function (num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    },

    /**
     * Format bytes to human-readable
     */
    formatBytes: function (bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
    },

    /**
     * Toggle monitor visibility
     */
    toggle: function () {
        this.enabled = !this.enabled;
        if (this.overlayElement) {
            this.overlayElement.style.display = this.enabled ? 'block' : 'none';
        }
        console.log('Performance Monitor:', this.enabled ? 'ENABLED' : 'DISABLED');
    },

    /**
     * Get current stats snapshot (for programmatic access)
     */
    getStats: function () {
        return { ...this.stats };
    }
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PerformanceMonitor.init());
} else {
    PerformanceMonitor.init();
}

// Expose globally for debugging
window.PerfMonitor = PerformanceMonitor;

// Add keyboard shortcut to toggle (P key)
document.addEventListener('keydown', function (e) {
    if (e.key === 'p' || e.key === 'P') {
        PerformanceMonitor.toggle();
    }
});
