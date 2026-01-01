// ═══════════════════════════════════════════════════════════════════════════════════
// BOOT.JS - OYUN BAŞLATMA
// ═══════════════════════════════════════════════════════════════════════════════════
// 
// Bu dosya sayfa yüklendiğinde oyunu başlatır.
//
// BAŞLATMA SIRASI:
// ─────────────────
// 1. init3D()         - Three.js sahnesi, kamera, renderer oluşturulur
// 2. initSettings()   - Ayarlar menüsü event listener'ları bağlanır
// 3. setupMediaPipe() - Webcam ve el takibi başlatılır
// 4. animate()        - Ana render döngüsü başlar
//
// ÖNEMLİ:
// ─────────────────
// • Bu dosya tüm diğer JS dosyalarından SONRA yüklenmelidir
// • setupMediaPipe fonksiyonu input.js'de tanımlıdır
//
// ═══════════════════════════════════════════════════════════════════════════════════

window.addEventListener('load', () => {
    init3D();
    initSettings(); // Ayarları başlat

    // Ensure input.js is loaded
    if (typeof window.setupMediaPipe === 'function') {
        window.setupMediaPipe();
    } else {
        console.error("setupMediaPipe not found! Check input.js for errors.");
    }

    animate();
});
