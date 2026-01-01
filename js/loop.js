// LOOP.JS - Ana Animasyon Döngüsü

function animate(currentTime) {
    requestAnimationFrame(animate);

    // Delta time hesaplama
    deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // FPS hesaplama
    frameCount++;
    fpsTime += deltaTime;
    if (fpsTime >= 1000) {
        currentFPS = Math.round((frameCount * 1000) / fpsTime);
        document.getElementById('fpsVal').innerText = currentFPS;
        frameCount = 0;
        fpsTime = 0;
    }

    // Performans monitör güncelleme
    if (typeof PerformanceMonitor !== 'undefined') {
        PerformanceMonitor.update(deltaTime);
    }

    // Oyun güncelleme ve render
    updateGame(deltaTime);
    renderer.render(scene, camera);
}