// GAMELOGIC.JS - Oyun Mantık ve Fizik Sistemi

// Ana oyun güncelleme döngüsü
function updateGame(dt) {
    if (!gameActive) return;
    if (isGamePaused) return;

    let dtSeconds = dt / 1000;

    // Slow motion sistemi - devam ettikten sonra yavaşça hızlan
    let slowMotionMultiplier = 1.0;
    if (isSlowMotion) {
        const elapsed = Date.now() - slowMotionStartTime;
        if (elapsed >= SLOW_MOTION_DURATION) {
            // Slow motion bitti
            isSlowMotion = false;
            slowMotionMultiplier = 1.0;
            const slowMoOverlay = document.getElementById('slowmo-overlay');
            if (slowMoOverlay) slowMoOverlay.classList.add('hidden');
        } else {
            // Yavaşça hızlan: 0.2 -> 1.0 arası
            const progress = elapsed / SLOW_MOTION_DURATION;
            // easeOutQuad: Başta yavaş, sona doğru hızlanır
            const easeProgress = 1 - Math.pow(1 - progress, 2);
            slowMotionMultiplier = SLOW_MOTION_MIN_SPEED + (1 - SLOW_MOTION_MIN_SPEED) * easeProgress;

            // UI güncelle
            const slowMoProgress = document.getElementById('slowmo-progress');
            if (slowMoProgress) {
                slowMoProgress.style.width = (progress * 100) + '%';
            }
        }
        dtSeconds *= slowMotionMultiplier;
    }

    // Fizik güncellemeleri
    bird.position.z -= GAME_SPEED * dtSeconds;
    birdVelocityY -= GRAVITY * dtSeconds;

    if (birdVelocityY < MAX_FALL_SPEED) {
        birdVelocityY = MAX_FALL_SPEED;
    }

    bird.position.y += birdVelocityY * dtSeconds;
    bird.position.z -= GAME_SPEED * dtSeconds;
    birdVelocityY -= GRAVITY * dtSeconds;

    if (birdVelocityY < MAX_FALL_SPEED) {
        birdVelocityY = MAX_FALL_SPEED;
    }

    bird.position.y += birdVelocityY * dtSeconds;

    const currentRoadX = getRoadX(bird.position.z);
    const targetOffset = targetBirdX;
    const smoothFactor = 1 - Math.pow(0.85, dtSeconds * 60);
    currentBirdOffset += (targetOffset - currentBirdOffset) * smoothFactor;
    bird.position.x = currentRoadX + currentBirdOffset;

    // Hareket sınırlaması
    let clampWidth;
    if (wallBreakerActive) {
        clampWidth = 22.0;
    } else {
        clampWidth = originalPlayWidth;
    }

    const minX = currentRoadX - clampWidth;
    const maxX = currentRoadX + clampWidth;

    if (bird.position.x > maxX) {
        bird.position.x = maxX;
        currentBirdOffset = maxX - currentRoadX;
    }
    if (bird.position.x < minX) {
        bird.position.x = minX;
        currentBirdOffset = minX - currentRoadX;
    }

    const nextRoadX = getRoadX(bird.position.z - 1);
    const roadSlope = nextRoadX - currentRoadX;

    // Dönüş efektleri
    const targetRotZ = (targetOffset - currentBirdOffset) * 0.3 - roadSlope * 0.5;
    const targetRotY = Math.atan2(roadSlope, -1);
    const targetRotX = Math.max(-0.5, Math.min(0.5, birdVelocityY * 0.08));

    const rotSmooth = 0.15;
    bird.rotation.x += (targetRotX - bird.rotation.x) * rotSmooth;
    bird.rotation.y += (targetRotY - bird.rotation.y) * rotSmooth;
    bird.rotation.z += (targetRotZ - bird.rotation.z) * rotSmooth;

    // GLTF animasyonları
    if (bird.userData.mixer) {
        bird.userData.mixer.update(dtSeconds);
    }

    // Kanat animasyonu (fallback)
    if (bird.userData.wingL && bird.userData.wingR && !bird.userData.mixer) {
        const wingSpeed = Math.abs(birdVelocityY) * 2 + 3;
        const wingAngle = Math.sin(Date.now() * 0.01 * wingSpeed) * 0.8;

        bird.userData.wingL.rotation.z = -0.3 - wingAngle;
        bird.userData.wingR.rotation.z = 0.3 + wingAngle;

        if (birdVelocityY > 5) {
            const jumpBoost = Math.min(0.5, birdVelocityY * 0.1);
            bird.userData.wingL.rotation.z -= jumpBoost;
            bird.userData.wingR.rotation.z += jumpBoost;
        }
    }

    // Kamera takibi
    const cameraOffsetZ = 15;
    const cameraTargetZ = bird.position.z + cameraOffsetZ;
    camera.position.z = cameraTargetZ;

    const roadXAtCamera = getRoadX(cameraTargetZ);
    const targetCamOffset = currentBirdOffset * 0.3;
    const cameraSmoothFactor = 1 - Math.pow(0.95, dtSeconds * 60);
    cameraCurrentOffset += (targetCamOffset - cameraCurrentOffset) * cameraSmoothFactor;
    camera.position.x = roadXAtCamera + cameraCurrentOffset;

    const lookAtZ = bird.position.z - 10;
    const targetLookAtX = getRoadX(lookAtZ);
    camera.lookAt(targetLookAtX, 0, lookAtZ);

    // Yere düşme kontrolü
    if (bird.position.y < -2) gameOver();

    // Yol segmenti spawn
    if (lastRoadZ > bird.position.z - 100) {
        createRoadSegment();
    }

    // Boru ve power-up spawn
    if (bird.position.z < lastPipeZ + PIPE_DISTANCE * 2) {
        createPipe();
        if (Math.random() < 0.15) {
            createPowerUp();
        }
    }

    // Power-up durum güncelleme
    const statusEl = document.getElementById('status-display');
    let statusText = "";

    if (shieldActive) {
        shieldTimer -= dtSeconds;
        statusText = "KALKAN: " + shieldTimer.toFixed(1) + "s";

        if (!bird.getObjectByName('shieldSphere')) {
            const sGeo = new THREE.SphereGeometry(1.0, 32, 32);
            const sMat = new THREE.MeshBasicMaterial({
                color: 0x00FFFF,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide
            });
            const sMesh = new THREE.Mesh(sGeo, sMat);
            sMesh.name = 'shieldSphere';

            if (bird.scale.x < 0.1) {
                sMesh.scale.set(25, 25, 25);
            } else {
                sMesh.scale.set(1.5, 1.5, 1.5);
            }

            bird.add(sMesh);
        } else {
            const s = bird.getObjectByName('shieldSphere');
            if (s) {
                s.material.opacity = 0.4 + Math.sin(Date.now() * 0.01) * 0.2;
                s.rotation.y += dtSeconds;
                s.rotation.z += dtSeconds * 0.5;
            }
        }

        if (shieldTimer <= 0) {
            shieldActive = false;
            const s = bird.getObjectByName('shieldSphere');
            if (s) bird.remove(s);
        }
    } else {
        const s = bird.getObjectByName('shieldSphere');
        if (s) bird.remove(s);
    }

    if (wallBreakerActive) {
        wallBreakerTimer -= dtSeconds;
        if (!shieldActive) statusText = "DUVAR YOK: " + wallBreakerTimer.toFixed(1) + "s";
        else statusText += "<br>DUVAR YOK: " + wallBreakerTimer.toFixed(1) + "s";

        // Duvarları gizle
        roadSegments.forEach(seg => {
            seg.left.visible = false;
            seg.right.visible = false;
        });
        pipes.forEach(p => {
            p.leftW.visible = false;
            p.rightW.visible = false;
            if (p.upper) p.upper.visible = false;
            if (p.lower) p.lower.visible = false;
            if (p.uCap) p.uCap.visible = false;
            if (p.lCap) p.lCap.visible = false;
        });

        if (wallBreakerTimer <= 0) {
            wallBreakerActive = false;
            PLAY_WIDTH = originalPlayWidth;
            // Duvarları göster
            roadSegments.forEach(seg => {
                seg.left.visible = true;
                seg.right.visible = true;
            });
            pipes.forEach(p => {
                p.leftW.visible = true;
                p.rightW.visible = true;
                if (p.upper) p.upper.visible = true;
                if (p.lower) p.lower.visible = true;
                if (p.uCap) p.uCap.visible = true;
                if (p.lCap) p.lCap.visible = true;
            });
        }
    }

    if (statusText !== "") {
        statusEl.innerHTML = statusText;
        statusEl.style.display = "block";
    } else {
        statusEl.style.display = "none";
    }

    // Power-up hareketi ve çarpışma
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const pu = powerUps[i];

        pu.mesh.rotation.y += dtSeconds * 2;
        pu.mesh.rotation.x += dtSeconds;

        const dist = bird.position.distanceTo(pu.mesh.position);
        if (dist < 3.0) {
            if (pu.type === 'shield') {
                shieldActive = true;
                shieldTimer = 5.0;
            } else if (pu.type === 'wallBreaker') {
                wallBreakerActive = true;
                wallBreakerTimer = 4.0;
                PLAY_WIDTH = 20.0;
            }

            scene.remove(pu.mesh);
            powerUps.splice(i, 1);
            continue;
        }

        if (pu.z > camera.position.z + 10) {
            scene.remove(pu.mesh);
            powerUps.splice(i, 1);
        }
    }

    // Boru çarpışma ve skor
    for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        if (!p.passed && p.z > bird.position.z) {
            score++;
            document.getElementById('scoreVal').innerText = score;
            p.passed = true;

            if (score >= 30) {
                gameOver();
            }
        }

        if (Math.abs(p.z - bird.position.z) < 1.0) {
            if (!shieldActive && !wallBreakerActive) {
                const corridorHalfWidth = PIPE_WIDTH / 2 + 0.6;
                const dx = Math.abs(currentBirdOffset - p.offset);

                if (dx > corridorHalfWidth) {
                    gameOver();
                } else {
                    const gapTop = p.yCenter + PIPE_GAP_Y / 2;
                    const gapBottom = p.yCenter - PIPE_GAP_Y / 2;
                    const hitY = (bird.position.y + 0.4 > gapTop) || (bird.position.y - 0.4 < gapBottom);

                    if (hitY) gameOver();
                }
            }
        }

        // Geçilen boruları temizle
        if (p.z > camera.position.z + 10) {
            scene.remove(p.upper);
            scene.remove(p.lower);
            scene.remove(p.uCap);
            scene.remove(p.lCap);
            scene.remove(p.leftW);
            scene.remove(p.rightW);
            pipes.splice(i, 1);
        }
    }

    // Bulut spawn
    if (lastCloudZ > bird.position.z - 100) {
        createCloud();
    }

    // Bulut güncelleme
    for (let i = clouds.length - 1; i >= 0; i--) {
        const cloud = clouds[i];

        cloud.mesh.rotation.y += dtSeconds * 0.05;
        cloud.mesh.position.y += Math.sin(Date.now() * 0.001 + cloud.z) * 0.02;

        const dist = Math.abs(cloud.z - camera.position.z);
        const fadeStart = 90;
        const fadeEnd = 140;
        let targetOpacity = 0.9;

        if (dist > fadeStart) {
            const ratio = (dist - fadeStart) / (fadeEnd - fadeStart);
            targetOpacity = 0.9 * (1 - Math.min(1, Math.max(0, ratio)));
        }

        cloud.mesh.children.forEach(child => {
            child.material.opacity = targetOpacity;
        });

        if (cloud.z > camera.position.z + 50) {
            scene.remove(cloud.mesh);
            clouds.splice(i, 1);
        }
    }
}

// Zıplama
function jump() {
    if (gameActive) {
        birdVelocityY = JUMP_STRENGTH;
    } else if (document.getElementById('gameOverScreen').style.display === 'block') {
        resetGame();
    } else {
        if (typeof startGame === 'function') {
            startGame();
        } else {
            gameActive = true;
            birdVelocityY = JUMP_STRENGTH;
        }
    }
}

// Oyunu duraklat
window.pauseGame = function () {
    if (!gameActive || isGamePaused) return;
    isGamePaused = true;

    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

// Oyundan devam et
window.resumeGame = function () {
    if (!isGamePaused) return;
    isGamePaused = false;
    leftHandOpen = false;
    openHandStartTime = 0;
    lastResumeTime = Date.now();

    // Slow motion başlat
    isSlowMotion = true;
    slowMotionStartTime = Date.now();

    // Slow motion overlay'i göster
    const slowMoOverlay = document.getElementById('slowmo-overlay');
    if (slowMoOverlay) {
        slowMoOverlay.classList.remove('hidden');
        const slowMoProgress = document.getElementById('slowmo-progress');
        if (slowMoProgress) slowMoProgress.style.width = '0%';
    }

    const overlay = document.getElementById('pause-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }

    const progressFill = document.getElementById('resume-progress-fill');
    if (progressFill) {
        progressFill.style.width = '0%';
    }

    console.log('🐢 Slow motion başladı - 2 saniye içinde tam hıza ulaşılacak');
}

// Oyun sonu
function gameOver() {
    gameActive = false;

    if (score > maxScore) {
        maxScore = score;
        localStorage.setItem('flappy3d_maxScore', maxScore);
        document.getElementById('maxScoreVal').innerText = maxScore;
    }

    const kazaScoreDisplay = document.getElementById('kaza-score-display');
    const kazaFinalScore = document.getElementById('kaza-final-score');
    if (kazaScoreDisplay && kazaFinalScore) {
        kazaFinalScore.innerText = score;
        kazaScoreDisplay.classList.remove('hidden');
        kazaScoreDisplay.classList.add('visible');
    }

    resetGame();
}

// Oyunu sıfırla
window.resetGame = function () {
    console.log('🔄 RESTART - Scene children:', scene.children.length);

    // Boruları temizle
    pipes.forEach(p => {
        scene.remove(p.upper);
        scene.remove(p.lower);
        scene.remove(p.uCap);
        scene.remove(p.lCap);
        scene.remove(p.leftW);
        scene.remove(p.rightW);
    });
    pipes = [];
    lastPipeZ = -20;

    // Bulutları temizle
    clouds.forEach(c => scene.remove(c.mesh));
    clouds = [];
    lastCloudZ = 0;
    for (let i = 0; i < 50; i++) createCloud();

    // Power-up'ları temizle
    powerUps.forEach(pu => scene.remove(pu.mesh));
    powerUps = [];
    shieldActive = false;
    wallBreakerActive = false;
    PLAY_WIDTH = originalPlayWidth;
    document.getElementById('status-display').style.display = 'none';
    const s = bird.getObjectByName('shieldSphere');
    if (s) bird.remove(s);

    // Yol segmentlerini temizle
    roadSegments.forEach(r => {
        scene.remove(r.mesh);
        scene.remove(r.left);
        scene.remove(r.right);
        scene.remove(r.lGround);
        scene.remove(r.rGround);

        if (r.decors && r.decors.length > 0) {
            r.decors.forEach(decor => {
                if (decor) {
                    scene.remove(decor);
                    decor.traverse(function (node) {
                        if (node.geometry) {
                            node.geometry.dispose();
                        }
                        if (node.material) {
                            if (Array.isArray(node.material)) {
                                node.material.forEach(mat => {
                                    if (mat.map) mat.map.dispose();
                                    mat.dispose();
                                });
                            } else {
                                if (node.material.map) node.material.map.dispose();
                                node.material.dispose();
                            }
                        }
                    });
                }
            });
        }

        if (r.mesh && r.mesh.geometry) r.mesh.geometry.dispose();
        if (r.left && r.left.geometry) r.left.geometry.dispose();
        if (r.right && r.right.geometry) r.right.geometry.dispose();
        if (r.lGround && r.lGround.geometry) r.lGround.geometry.dispose();
        if (r.rGround && r.rGround.geometry) r.rGround.geometry.dispose();
    });
    roadSegments = [];
    lastRoadZ = 50;
    for (let i = 0; i < 25; i++) createRoadSegment();

    // Kuş pozisyonunu sıfırla
    bird.position.set(0, 0, 0);
    birdVelocityY = 0;
    targetBirdX = 0;
    score = 0;
    currentBirdOffset = 0;
    cameraCurrentOffset = 0;

    // UI güncelle
    document.getElementById('scoreVal').innerText = '0';
    document.getElementById('maxScoreVal').innerText = maxScore;
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('hud').style.display = 'none';

    isHoveringStart = false;
    hoverStartTime = 0;

    camera.position.set(0, 4, 15);
    createPipe();
    createPipe();
    createPipe();
    gameActive = false;
}

// Oyunu başlat
window.startGame = function () {
    if (gameActive) return;

    gameActive = true;
    birdVelocityY = JUMP_STRENGTH;

    const kazaScoreDisplay = document.getElementById('kaza-score-display');
    if (kazaScoreDisplay) {
        kazaScoreDisplay.classList.remove('visible');
        kazaScoreDisplay.classList.add('hidden');
    }

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';
}

// Ayarları slider'larla senkronize et
function syncSettingsWithSliders() {
    const gravSlider = document.getElementById('gravRange');
    const speedSlider = document.getElementById('speedRange');
    const jumpSlider = document.getElementById('jumpRange');
    if (gravSlider) {
        GRAVITY = parseFloat(gravSlider.value);
        document.getElementById('gravVal').innerText = GRAVITY.toFixed(1);
    }
    if (speedSlider) {
        GAME_SPEED = parseFloat(speedSlider.value);
        document.getElementById('speedVal').innerText = GAME_SPEED.toFixed(1);
    }
    if (jumpSlider) {
        JUMP_STRENGTH = parseFloat(jumpSlider.value);
        document.getElementById('jumpVal').innerText = JUMP_STRENGTH.toFixed(1);
    }
}

// Ayarları başlat
function initSettings() {
    const gravSlider = document.getElementById('gravRange');
    const speedSlider = document.getElementById('speedRange');
    const jumpSlider = document.getElementById('jumpRange');
    const resetBtn = document.getElementById('resetSettingsBtn');

    if (gravSlider) {
        gravSlider.addEventListener('input', (e) => {
            GRAVITY = parseFloat(e.target.value);
            document.getElementById('gravVal').innerText = GRAVITY.toFixed(1);
        });
    }

    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            GAME_SPEED = parseFloat(e.target.value);
            document.getElementById('speedVal').innerText = GAME_SPEED.toFixed(1);
        });
    }

    if (jumpSlider) {
        jumpSlider.addEventListener('input', (e) => {
            JUMP_STRENGTH = parseFloat(e.target.value);
            document.getElementById('jumpVal').innerText = JUMP_STRENGTH.toFixed(1);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            GRAVITY = 18.5;
            GAME_SPEED = 7.0;
            JUMP_STRENGTH = 12.0;
            gravSlider.value = 18.5;
            speedSlider.value = 7.0;
            jumpSlider.value = 12.0;
            document.getElementById('gravVal').innerText = "18.5";
            document.getElementById('speedVal').innerText = "7.0";
            document.getElementById('jumpVal').innerText = "12.0";
        });
    }

    if (gravSlider) {
        GRAVITY = parseFloat(gravSlider.value);
        document.getElementById('gravVal').innerText = GRAVITY.toFixed(1);
    }
    if (speedSlider) {
        GAME_SPEED = parseFloat(speedSlider.value);
        document.getElementById('speedVal').innerText = GAME_SPEED.toFixed(1);
    }
    if (jumpSlider) {
        JUMP_STRENGTH = parseFloat(jumpSlider.value);
        document.getElementById('jumpVal').innerText = JUMP_STRENGTH.toFixed(1);
    }
}

window.initSettings = initSettings;