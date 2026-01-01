// ═══════════════════════════════════════════════════════════════════════════════════
// A/B TEST YAPILANDIRMASI
// ═══════════════════════════════════════════════════════════════════════════════════
//
// AMAÇ: Performans testi için belirli asset'leri geçici olarak devre dışı bırakır
// Purpose: Temporarily disable Mushroom and Log assets to measure impact
// 
// Usage:
// 1. Set DISABLE_MUSHROOMS = true to disable mushrooms
// 2. Set DISABLE_LOGS = true to disable logs
// 3. Reload the game
// 4. Play for 3-5 minutes and record metrics
// 5. Set both to false and repeat
// 6. Compare results
// ═══════════════════════════════════════════════════════════════════

window.AB_TEST_CONFIG = {
    DISABLE_MUSHROOMS: false,  // Set to true to disable mushroom loading & spawning
    DISABLE_LOGS: false         // Set to true to disable log loading & spawning
};

console.log('🧪 A/B Test Configuration Loaded:');
console.log('   DISABLE_MUSHROOMS:', window.AB_TEST_CONFIG.DISABLE_MUSHROOMS);
console.log('   DISABLE_LOGS:', window.AB_TEST_CONFIG.DISABLE_LOGS);
