function updateGame(dt) {
            if (!gameActive) return;

            // dt saniye cinsinden (örn: 0.0167 = 16.7ms)
            const dtSeconds = dt / 1000;

            // (Keyboard test removed) Input smoothing and mediapipe-based input remain in use.

            // Fizik güncellemeleri - FLAPPY BIRD TARZI
            bird.position.z -= GAME_SPEED * dtSeconds;

            // Yerçekimi her zaman aktif
            birdVelocityY -= GRAVITY * dtSeconds;

            // Maksimum düşüş hızını sınırla
            if (birdVelocityY < MAX_FALL_SPEED) {
                birdVelocityY = MAX_FALL_SPEED;
            }

            bird.position.y += birdVelocityY * dtSeconds;

            // Fizik güncellemeleri - FLAPPY BIRD TARZI
            bird.position.z -= GAME_SPEED * dtSeconds;

            // Yerçekimi her zaman aktif
            birdVelocityY -= GRAVITY * dtSeconds;

            // Maksimum düşüş hızını sınırla
            if (birdVelocityY < MAX_FALL_SPEED) {
                birdVelocityY = MAX_FALL_SPEED;
            }

            bird.position.y += birdVelocityY * dtSeconds;

            const currentRoadX = getRoadX(bird.position.z);

            // --- HAREKET MANTIĞI GÜNCELLEMESİ ---
            // Eski yöntem: Mutlak X pozisyonunu yumuşatıyorduk, bu da yol döndüğünde gecikmeye (lag) sebep oluyordu.
            // Yeni yöntem: Sadece "yola göre ofseti" yumuşatıyoruz. Yolun dönüşünü anlık olarak ekliyoruz.

            // Hedef ofsetimiz (targetBirdX zaten yola göre ofset olarak hesaplanıyor)
            const targetOffset = targetBirdX;

            // Yumuşak geçiş (frame-independent)
            const smoothFactor = 1 - Math.pow(0.85, dtSeconds * 60);

            // Ofseti yumuşat
            currentBirdOffset += (targetOffset - currentBirdOffset) * smoothFactor;

            // Kuşun gerçek pozisyonu = Yolun Merkezi + Yumuşatılmış Ofset
            bird.position.x = currentRoadX + currentBirdOffset;

            // --- MOVEMENT CLAMPING / INPUT SATURATION ---
            // Eğer Wall Breaker aktif DEĞİLSE, kuşu yolda tut.
            // Wall Breaker aktifse, çok daha geniş bir alana (±22) izin ver.
            let clampWidth;
            if (wallBreakerActive) {
                clampWidth = 22.0; // Wall breaker ile dışarı çıkabilir
            } else {
                clampWidth = originalPlayWidth; // Normal sınırlar (14.0)
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
            // Dönüş efektleri - Hedef Değerler
            const targetRotZ = (targetOffset - currentBirdOffset) * 0.3 - roadSlope * 0.5;
            const targetRotY = Math.atan2(roadSlope, -1);
            // Flappy Bird tarzı rotasyon: yukarı bakarken pozitif, düşerken negatif
            const targetRotX = Math.max(-0.5, Math.min(0.5, birdVelocityY * 0.08));

            // Yumuşak geçiş (Lerp)
            const rotSmooth = 0.15;
            bird.rotation.x += (targetRotX - bird.rotation.x) * rotSmooth;
            bird.rotation.y += (targetRotY - bird.rotation.y) * rotSmooth;
            bird.rotation.z += (targetRotZ - bird.rotation.z) * rotSmooth;

            // GLTF animasyonları güncelle (eğer varsa)
            if (bird.userData.mixer) {
                bird.userData.mixer.update(dtSeconds);
            }
            
            // Kanat animasyonu (Flappy Bird tarzı - fallback)
            // Eğer GLTF animasyonu yoksa manuel kanat çırpma
            if (bird.userData.wingL && bird.userData.wingR && !bird.userData.mixer) {
                // Hız ve zaman bazlı kanat çırpma
                const wingSpeed = Math.abs(birdVelocityY) * 2 + 3; // Hız arttıkça daha hızlı çırp
                const wingAngle = Math.sin(Date.now() * 0.01 * wingSpeed) * 0.8; // -0.8 ile 0.8 arası
                
                // Kanatları çırp (z ekseni rotasyonu)
                bird.userData.wingL.rotation.z = -0.3 - wingAngle;
                bird.userData.wingR.rotation.z = 0.3 + wingAngle;
                
                // Zıplama anında daha güçlü çırp
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

            // Kamera da yolu anlık takip etmeli, sadece kuşun sapmasını yumuşak takip etmeli
            // Hedef kamera ofseti (yola göre)
            const targetCamOffset = currentBirdOffset * 0.3;

            const cameraSmoothFactor = 1 - Math.pow(0.95, dtSeconds * 60);
            cameraCurrentOffset += (targetCamOffset - cameraCurrentOffset) * cameraSmoothFactor;

            camera.position.x = roadXAtCamera + cameraCurrentOffset;

            const lookAtZ = bird.position.z - 10;
            const targetLookAtX = getRoadX(lookAtZ);

            // LookAt de yolu takip etmeli
            camera.lookAt(targetLookAtX, 0, lookAtZ);

            
            if (bird.position.y < -2) gameOver();

            if (lastRoadZ > bird.position.z - 100) {
                createRoadSegment();
            }

            // --- SPAWN MANTIĞI ---
            // Her zaman boru (engel) spawn et; power-up ise ekstra olarak spawn olsun.
            if (bird.position.z < lastPipeZ + PIPE_DISTANCE * 2) {
                createPipe();
                // Normal oyun modu: daha nadir power-up (%15 şans)
                if (Math.random() < 0.15) {
                    createPowerUp();
                }
            }

            // --- POWER-UP LOOP ---
            const statusEl = document.getElementById('status-display');
            let statusText = "";

            // Efekt Süreleri Kontrolü
            if (shieldActive) {
                shieldTimer -= dtSeconds;
                statusText = "SHIELD: " + shieldTimer.toFixed(1) + "s";

                // Bird etrafında kalkan efekti var mı? Yoksa ekle
                if (!bird.getObjectByName('shieldSphere')) {
                    const sGeo = new THREE.SphereGeometry(1.2, 16, 16);
                    const sMat = new THREE.MeshBasicMaterial({
                        color: 0x00FFFF,
                        transparent: true,
                        opacity: 0.3,
                        side: THREE.BackSide // İçini de render etmesin, sadece dışı
                    });
                    const sMesh = new THREE.Mesh(sGeo, sMat);
                    sMesh.name = 'shieldSphere';
                    bird.add(sMesh);
                }

                if (shieldTimer <= 0) {
                    shieldActive = false;
                    // Kalkanı kaldır
                    const s = bird.getObjectByName('shieldSphere');
                    if (s) bird.remove(s);
                }
            } else {
                // Kalkan yoksa ve mesh duruyorsa temizle (reset durumları için)
                const s = bird.getObjectByName('shieldSphere');
                if (s) bird.remove(s);
            }

            if (wallBreakerActive) {
                wallBreakerTimer -= dtSeconds;
                if (!shieldActive) statusText = "NO WALLS: " + wallBreakerTimer.toFixed(1) + "s";
                else statusText += "<br>NO WALLS: " + wallBreakerTimer.toFixed(1) + "s";

                // Duvarları ve boruları gizle (wall-breaker aktifken engeller ortadan kalksın)
                roadSegments.forEach(seg => {
                    seg.left.visible = false;
                    seg.right.visible = false;
                });
                pipes.forEach(p => {
                    // Görünmez duvarlar
                    p.leftW.visible = false;
                    p.rightW.visible = false;
                    // Boru gövdelerini ve kapaklarını da gizle
                    if (p.upper) p.upper.visible = false;
                    if (p.lower) p.lower.visible = false;
                    if (p.uCap) p.uCap.visible = false;
                    if (p.lCap) p.lCap.visible = false;
                });

                if (wallBreakerTimer <= 0) {
                    wallBreakerActive = false;
                    PLAY_WIDTH = originalPlayWidth;
                    // Duvarları ve boruları geri getir
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

            // Power-Up Hareketi ve Çarpışma
            for (let i = powerUps.length - 1; i >= 0; i--) {
                const pu = powerUps[i];

                // Rotasyon efekti
                pu.mesh.rotation.y += dtSeconds * 2;
                pu.mesh.rotation.x += dtSeconds;

                // Çarpışma (Basit mesafe kontrolü)
                const dist = bird.position.distanceTo(pu.mesh.position);
                if (dist < 3.0) {
                    // ALINDI!
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


            for (let i = pipes.length - 1; i >= 0; i--) {
                const p = pipes[i];
                if (!p.passed && p.z > bird.position.z) {
                    score++;
                    document.getElementById('scoreVal').innerText = score;
                    p.passed = true;
                    
                    // TEST MODU: Maksimum skor kontrolü kapalı
                    // Maksimum skor 30'a ulaştığında oyunu bitir
                     if (score >= 30) {
                         gameOver();
                    }
                }

                if (Math.abs(p.z - bird.position.z) < 1.0) {
                        // Eğer shield veya wall-breaker aktifleştirilmişse çarpışma yok sayılıyor
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

            if (lastCloudZ > bird.position.z - 100) {
                createCloud();
            }

   // --- GÜNCELLENMİŞ BULUT DÖNGÜSÜ (Fade + Hareket + Silme) ---
    for (let i = clouds.length - 1; i >= 0; i--) {
        const cloud = clouds[i];
        
        // 1. HAREKET (Dönme ve Süzülme)
        cloud.mesh.rotation.y += dtSeconds * 0.05; 
        cloud.mesh.position.y += Math.sin(Date.now() * 0.001 + cloud.z) * 0.02;

        // 2. MESAFE SOLUKLAŞTIRMASI (DISTANCE FADING)
        // Bulut kameradan ne kadar uzakta?
        const dist = Math.abs(cloud.z - camera.position.z);
        
        // Ayarlar: 90 birimden sonra solmaya başla, 140'ta tamamen yok ol
        const fadeStart = 90;
        const fadeEnd = 140;
        let targetOpacity = 0.9; // Orijinal opaklık

        if (dist > fadeStart) {
            // Mesafe arttıkça opaklığı düşür
            const ratio = (dist - fadeStart) / (fadeEnd - fadeStart);
            targetOpacity = 0.9 * (1 - Math.min(1, Math.max(0, ratio)));
        }

        // Bulutun içindeki her küpün materyal opaklığını güncelle
        cloud.mesh.children.forEach(child => {
            child.material.opacity = targetOpacity;
        });

        // 3. SİLME (Kamera arkasında kaldıysa)
        if (cloud.z > camera.position.z + 50) { 
            // Materyalleri bellekten temizle (Performans için önemli)
            cloud.mesh.children.forEach(c => c.material.dispose());
            
            scene.remove(cloud.mesh);
            clouds.splice(i, 1);
        }
    }
        }

        function jump() {
            if (gameActive) {
                // Flappy Bird tarzı: Her tıklamada sabit yukarı hız
                birdVelocityY = JUMP_STRENGTH;
            } else if (document.getElementById('gameOverScreen').style.display === 'block') {
                resetGame();
            } else {
                // Oyun başlatma
                gameActive = true;
                birdVelocityY = JUMP_STRENGTH;
            }
        }

        function gameOver() {
            gameActive = false;
            document.getElementById('gameOverScreen').style.display = 'block';
            document.getElementById('finalScore').innerText = score;
            
            // Kazandı mı yoksa kaybetti mi?
            const gameOverTitle = document.querySelector('#gameOverScreen h1');
            if (score >= 30) {
                gameOverTitle.textContent = '🎉 KAZANDIN!';
                gameOverTitle.style.color = '#27ae60';
            } else {
                gameOverTitle.textContent = 'KAZA!';
                gameOverTitle.style.color = '#e74c3c';
            }
        }

        window.resetGame = function () {
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

            clouds.forEach(c => scene.remove(c.mesh));
    clouds = [];
    lastCloudZ = 0;
    // Yeni başlangıç bulutları üret
    for(let i=0; i<50; i++) createCloud();

            // Power-Up Temizliği
            powerUps.forEach(pu => scene.remove(pu.mesh));
            powerUps = [];
            shieldActive = false;
            wallBreakerActive = false;
            PLAY_WIDTH = originalPlayWidth;
            document.getElementById('status-display').style.display = 'none';
            // Varsa Shield Visual'ı temizle
            const s = bird.getObjectByName('shieldSphere');
            if (s) bird.remove(s);

            // Tüm yol segmentlerini ve dekorasyonlarını temizle
            roadSegments.forEach(r => {
                scene.remove(r.mesh);
                scene.remove(r.left);
                scene.remove(r.right);
                scene.remove(r.lGround);
                scene.remove(r.rGround);
                // Dekorasyonları (ağaçlar, taşlar) temizle
                if (r.decors) {
                    r.decors.forEach(d => {
                        if (d) scene.remove(d);
                    });
                }
                // Geometri ve materyalleri dispose et
                if (r.mesh.geometry) r.mesh.geometry.dispose();
                if (r.mesh.material) r.mesh.material.dispose();
                if (r.lGround && r.lGround.geometry) r.lGround.geometry.dispose();
                if (r.rGround && r.rGround.geometry) r.rGround.geometry.dispose();
            });
            roadSegments = [];
            lastRoadZ = 0;
            // Yeni segmentler oluştur (modeller yüklendikten sonra)
            for (let i = 0; i < 50; i++) createRoadSegment();

            bird.position.set(0, 0, 0);
            birdVelocityY = 0;
            targetBirdX = 0;
            score = 0;
            currentBirdOffset = 0;
            cameraCurrentOffset = 0;
            document.getElementById('scoreVal').innerText = '0';
            document.getElementById('gameOverScreen').style.display = 'none';
            camera.position.set(0, 4, 15);
            createPipe();
            createPipe();
            createPipe();
            gameActive = false;
        }