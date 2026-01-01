// INPUT.JS - Kullanıcı Girişi ve El Takibi

// Mouse koordinatları
let mouseX = 0;
let mouseY = 0;

// Giriş sistemini başlat
function setupInput() {
    // Mouse hareketi
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!useCamera || !gameActive) {
            updateCursor(mouseX, mouseY);
        }
    });

    // Mouse tıklama
    window.addEventListener('mousedown', () => {
        if (isHoveringCameraToggle && !gameActive) {
            const mainToggle = document.getElementById('camera-toggle');
            const overToggle = document.getElementById('camera-toggle-over');
            const newState = !mainToggle.checked;
            mainToggle.checked = newState;
            if (overToggle) overToggle.checked = newState;
            setCameraToggleState(newState);
            useCamera = newState;
            return;
        }
        if (gameActive) {
            jump();
        }
    });

    // Klavye girişi
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && gameActive) {
            jump();
        }
    });

    // Kamera toggle senkronizasyonu
    const mainToggle = document.getElementById('camera-toggle');
    const overToggle = document.getElementById('camera-toggle-over');

    mainToggle.addEventListener('change', (e) => {
        if (overToggle) overToggle.checked = mainToggle.checked;
        setCameraToggleState(mainToggle.checked);
    });

    if (overToggle) {
        overToggle.addEventListener('change', (e) => {
            mainToggle.checked = overToggle.checked;
            setCameraToggleState(overToggle.checked);
        });
        overToggle.checked = mainToggle.checked;
    }
    setCameraToggleState(mainToggle.checked);
}

// Kamera toggle durumu
function setCameraToggleState(checked) {
    const videoEl = document.getElementById('control-layer');
    const labelMenu = document.getElementById('control-label');
    const labelOver = document.getElementById('control-label-over');

    showCameraPreview = checked;

    if (checked) {
        videoEl.classList.remove('hidden');
        if (labelMenu) labelMenu.innerText = "MOD: KAMERA";
        if (labelOver) labelOver.innerText = "MOD: KAMERA";
    } else {
        videoEl.classList.add('hidden');
        if (labelMenu) labelMenu.innerText = "KAMERA GİZLİ (El izleme aktif)";
        if (labelOver) labelOver.innerText = "KAMERA GİZLİ (El izleme aktif)";
    }
    useCamera = true;
}

// Cursor pozisyonu güncelle
function updateCursor(x, y) {
    const cursorEl = document.getElementById('game-cursor');
    cursorEl.style.left = x + 'px';
    cursorEl.style.top = y + 'px';
    cursorEl.style.display = 'block';

    const normalizedX = x / window.innerWidth;
    const INPUT_RANGE = 22.0;
    targetBirdX = (normalizedX - 0.5) * (INPUT_RANGE * 2);

    checkStartHover(x, y);
    checkCameraToggleHover(x, y);
    checkSettingsButtonHover(x, y);
}

// Start butonu hover kontrolü
function checkStartHover(x, y) {
    const startZone = document.getElementById('start-area');
    if (!startZone || gameActive) return;

    const settingsPanel = document.getElementById('settings-panel');
    const isSettingsOpen = settingsPanel && settingsPanel.classList.contains('visible');
    if (isSettingsOpen) {
        if (isHoveringStart) {
            isHoveringStart = false;
            startZone.classList.remove('hovered');
            startZone.classList.remove('charging');
        }
        return;
    }

    const rect = startZone.getBoundingClientRect();
    const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isInside) {
        if (!isHoveringStart) {
            isHoveringStart = true;
            hoverStartTime = Date.now();
            startZone.classList.add('hovered');
            startZone.classList.add('charging');
        } else {
            const elapsed = Date.now() - hoverStartTime;
            if (elapsed > HOVER_REQUIRED_TIME) {
                startGame();
                isHoveringStart = false;
                startZone.classList.remove('hovered');
                startZone.classList.remove('charging');
            }
        }
    } else {
        isHoveringStart = false;
        startZone.classList.remove('hovered');
        startZone.classList.remove('charging');
    }
}

// Kamera toggle hover kontrolü
function checkCameraToggleHover(x, y) {
    const toggles = document.querySelectorAll('.control-toggle');
    let isOverAnyToggle = false;

    toggles.forEach(toggle => {
        const rect = toggle.getBoundingClientRect();
        const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

        if (isInside) {
            isOverAnyToggle = true;
            if (!isHoveringCameraToggle) {
                toggle.classList.add('hovered');
            }
        } else {
            toggle.classList.remove('hovered');
        }
    });

    isHoveringCameraToggle = isOverAnyToggle;
}

// Ayarlar butonu hover kontrolü
function checkSettingsButtonHover(x, y) {
    const settingsBtn = document.getElementById('settings-toggle-btn');
    if (!settingsBtn) return;

    const rect = settingsBtn.getBoundingClientRect();
    const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isInside) {
        if (!isHoveringSettingsButton) {
            settingsBtn.classList.add('hovered');
        }
        isHoveringSettingsButton = true;
    } else {
        settingsBtn.classList.remove('hovered');
        isHoveringSettingsButton = false;
    }

    // How to Play button hover check
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    if (howToPlayBtn) {
        const htpRect = howToPlayBtn.getBoundingClientRect();
        const isInsideHtp = x >= htpRect.left && x <= htpRect.right && y >= htpRect.top && y <= htpRect.bottom;

        if (isInsideHtp) {
            if (!isHoveringHowToPlayButton) {
                howToPlayBtn.classList.add('hovered');
            }
            isHoveringHowToPlayButton = true;
        } else {
            howToPlayBtn.classList.remove('hovered');
            isHoveringHowToPlayButton = false;
        }
    }

    // Tutorial close button hover check
    const tutorialCloseBtn = document.getElementById('close-tutorial-btn');
    if (tutorialCloseBtn) {
        const closeRect = tutorialCloseBtn.getBoundingClientRect();
        const isInsideClose = x >= closeRect.left && x <= closeRect.right && y >= closeRect.top && y <= closeRect.bottom;

        if (isInsideClose) {
            if (!isHoveringTutorialCloseBtn) {
                tutorialCloseBtn.classList.add('hovered');
            }
            isHoveringTutorialCloseBtn = true;
        } else {
            tutorialCloseBtn.classList.remove('hovered');
            isHoveringTutorialCloseBtn = false;
        }
    }
}

// MediaPipe el takibi başlat
window.setupMediaPipe = function () {
    setupInput();

    const videoElement = document.getElementById('webcam');
    const canvasElement = document.getElementById('output_canvas');

    if (!videoElement || !canvasElement) {
        console.error("Kamera veya Canvas elementi bulunamadı!");
        alert("Kamera elementleri bulunamadı! Sayfayı yenileyin.");
        return;
    }

    const canvasCtx = canvasElement.getContext('2d');

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults((results) => {
        if (showCameraPreview) {
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.restore();
        }

        if (results.multiHandLandmarks && results.multiHandedness) {
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                const landmarks = results.multiHandLandmarks[i];
                const handedness = results.multiHandedness[i];
                // Kamera aynalı - "Left" = Kullanıcının SAĞ eli
                const isUserLeftHand = handedness.label === "Right";

                // El iskelet çizimi
                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                    color: '#00FFFF',
                    lineWidth: 2
                });
                drawLandmarks(canvasCtx, landmarks, {
                    color: '#00FFFF',
                    lineWidth: 1,
                    radius: 4,
                    fillColor: '#00FFFF'
                });

                if (isUserLeftHand) {
                    // SOL EL - Duraklatma kontrolü
                    const wrist = landmarks[0];
                    const indexTip = landmarks[8], indexMCP = landmarks[5];
                    const middleTip = landmarks[12], middleMCP = landmarks[9];
                    const ringTip = landmarks[16], ringMCP = landmarks[13];
                    const pinkyTip = landmarks[20], pinkyMCP = landmarks[17];

                    const distTipToWrist = (tip) => Math.sqrt(
                        Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2)
                    );
                    const distMCPToWrist = (mcp) => Math.sqrt(
                        Math.pow(mcp.x - wrist.x, 2) + Math.pow(mcp.y - wrist.y, 2)
                    );

                    // Yumruk algılama
                    const indexCurled = distTipToWrist(indexTip) < distMCPToWrist(indexMCP) * 1.2;
                    const middleCurled = distTipToWrist(middleTip) < distMCPToWrist(middleMCP) * 1.2;
                    const ringCurled = distTipToWrist(ringTip) < distMCPToWrist(ringMCP) * 1.2;
                    const pinkyCurled = distTipToWrist(pinkyTip) < distMCPToWrist(pinkyMCP) * 1.2;
                    const isFist = indexCurled && middleCurled && ringCurled && pinkyCurled;

                    // Açık el algılama
                    const indexExtended = distTipToWrist(indexTip) > distMCPToWrist(indexMCP) * 1.2;
                    const middleExtended = distTipToWrist(middleTip) > distMCPToWrist(middleMCP) * 1.2;
                    const ringExtended = distTipToWrist(ringTip) > distMCPToWrist(ringMCP) * 1.2;
                    const isOpenHand = indexExtended && middleExtended && ringExtended;

                    // Sol el pinch algılama
                    const thumbTip = landmarks[4];
                    const leftPinchDist = Math.sqrt(
                        Math.pow(thumbTip.x - indexTip.x, 2) +
                        Math.pow(thumbTip.y - indexTip.y, 2)
                    );
                    const isLeftPinching = leftPinchDist < PINCH_THRESHOLD;

                    if (Math.random() < 0.03) {
                        console.log('LEFT: isFist=' + isFist + ' gameActive=' + gameActive);
                    }

                    const canPause = (Date.now() - lastResumeTime) > PAUSE_COOLDOWN;

                    // Yumruk ile duraklat
                    if (isFist && gameActive && !isGamePaused && canPause) {
                        pauseGame();
                        console.log('🛑 SOL YUMRUK - Oyun duraklatıldı');
                    } else if (isGamePaused) {
                        // Açık el ile devam
                        if (isOpenHand) {
                            if (!leftHandOpen) {
                                leftHandOpen = true;
                                openHandStartTime = Date.now();
                                console.log('🖐️ Açık el algılandı, zamanlayıcı başladı...');
                            }

                            const elapsed = Date.now() - openHandStartTime;
                            const progress = Math.min(100, (elapsed / OPEN_HAND_RESUME_TIME) * 100);

                            const progressFill = document.getElementById('resume-progress-fill');
                            if (progressFill) {
                                progressFill.style.width = progress + '%';
                            }

                            if (elapsed >= OPEN_HAND_RESUME_TIME) {
                                resumeGame();
                                console.log('✅ SOL AÇIK EL - 2 saniye sonra devam');
                            }
                        } else {
                            if (leftHandOpen) {
                                leftHandOpen = false;
                                openHandStartTime = 0;
                                const progressFill = document.getElementById('resume-progress-fill');
                                if (progressFill) {
                                    progressFill.style.width = '0%';
                                }
                            }
                        }
                    }
                } else {
                    // SAĞ EL - Oyun kontrolü
                    const screenX = (1 - landmarks[8].x) * window.innerWidth;
                    const screenY = landmarks[8].y * window.innerHeight;

                    if (isGamePaused) {
                        console.log('👉 SAĞ EL algılandı (duraklatılmış) screenX=' + Math.round(screenX));
                    }

                    updateCursor(screenX, screenY);

                    // Slider kontrolü
                    const settingsPanel = document.getElementById('settings-panel');
                    const isPanelOpen = settingsPanel && settingsPanel.classList.contains('visible');

                    if (isPanelOpen) {
                        const sliders = document.querySelectorAll('#settings-panel input[type="range"]');
                        let hoveringSlider = null;

                        sliders.forEach(slider => {
                            const rect = slider.getBoundingClientRect();
                            if (screenX >= rect.left && screenX <= rect.right &&
                                screenY >= rect.top && screenY <= rect.bottom) {
                                hoveringSlider = slider;
                            }
                        });

                        // Reset butonu hover kontrolü
                        const resetBtn = document.getElementById('resetSettingsBtn');
                        let hoveringResetBtn = false;
                        if (resetBtn) {
                            const resetRect = resetBtn.getBoundingClientRect();
                            hoveringResetBtn = screenX >= resetRect.left && screenX <= resetRect.right &&
                                screenY >= resetRect.top && screenY <= resetRect.bottom;

                            // Hover efekti
                            if (hoveringResetBtn) {
                                resetBtn.classList.add('hovered');
                            } else {
                                resetBtn.classList.remove('hovered');
                            }
                        }

                        const dist = Math.sqrt(
                            Math.pow(landmarks[4].x - landmarks[8].x, 2) +
                            Math.pow(landmarks[4].y - landmarks[8].y, 2)
                        );
                        const isCurrentPinch = dist < PINCH_THRESHOLD;

                        // Reset butonuna pinch ile tıklama
                        if (isCurrentPinch && hoveringResetBtn && !isPinching) {
                            const now = Date.now();
                            if (now - lastPinchTime > PINCH_COOLDOWN) {
                                resetBtn.click();
                                lastPinchTime = now;
                                console.log('🔄 Ayarlar sıfırlandı (pinch ile)');
                            }
                        }

                        if (isCurrentPinch && hoveringSlider && !activeSlider) {
                            activeSlider = hoveringSlider;
                            sliderStartValue = parseFloat(activeSlider.value);
                            sliderStartX = landmarks[8].x;
                        } else if (!isCurrentPinch && activeSlider) {
                            activeSlider = null;
                        }

                        if (activeSlider && isCurrentPinch) {
                            const currentX = landmarks[8].x;
                            const deltaX = currentX - sliderStartX;
                            const min = parseFloat(activeSlider.min);
                            const max = parseFloat(activeSlider.max);
                            const range = max - min;
                            const sensitivity = range * 2;
                            let newValue = sliderStartValue + (deltaX * sensitivity);
                            newValue = Math.max(min, Math.min(max, newValue));
                            activeSlider.value = newValue;
                            activeSlider.dispatchEvent(new Event('input'));
                        }
                    }

                    // Pinch algılama (zıplama)
                    const dist = Math.sqrt(
                        Math.pow(landmarks[4].x - landmarks[8].x, 2) +
                        Math.pow(landmarks[4].y - landmarks[8].y, 2)
                    );
                    const isCurrentPinch = dist < PINCH_THRESHOLD;

                    if (isGamePaused && Math.random() < 0.05) {
                        console.log('SAĞ EL: pinch=' + isCurrentPinch + ', isPinching=' + isPinching);
                    }

                    // Duraklatılmışken sağ pinch ile devam
                    if (isCurrentPinch && isGamePaused) {
                        const now = Date.now();
                        if (!isPinching && now - lastPinchTime > PINCH_COOLDOWN) {
                            if (!window.resumeCountdownActive) {
                                window.resumeCountdownActive = true;
                                window.resumeStartTime = Date.now();
                                console.log('⏱️ SAĞ PINCH - 2 saniye geri sayım başladı...');
                            }
                        }

                        if (window.resumeCountdownActive) {
                            const elapsed = Date.now() - window.resumeStartTime;
                            const progress = Math.min(100, (elapsed / 2000) * 100);

                            const progressFill = document.getElementById('resume-progress-fill');
                            if (progressFill) {
                                progressFill.style.width = progress + '%';
                            }

                            if (elapsed >= 2000) {
                                window.resumeCountdownActive = false;
                                resumeGame();
                                console.log('✅ 2 saniye sonra oyun devam etti');
                            }
                        }

                        lastPinchTime = now;
                        isPinching = true;
                    }
                    else if (window.resumeCountdownActive && isGamePaused) {
                        window.resumeCountdownActive = false;
                        const progressFill = document.getElementById('resume-progress-fill');
                        if (progressFill) {
                            progressFill.style.width = '0%';
                        }
                        console.log('❌ Pinch bırakıldı - geri sayım iptal');
                    }
                    else if (isCurrentPinch) {
                        const now = Date.now();
                        if (!isPinching && now - lastPinchTime > PINCH_COOLDOWN) {
                            const settingsPanel = document.getElementById('settings-panel');
                            const isPanelOpen = settingsPanel && settingsPanel.classList.contains('visible');
                            const settingsBtn = document.getElementById('settings-toggle-btn');
                            const isPinchingOnSettings = settingsBtn && isHoveringSettingsButton;

                            let isPinchingInsidePanel = false;
                            if (isPanelOpen && settingsPanel) {
                                const panelRect = settingsPanel.getBoundingClientRect();
                                const cursorEl = document.getElementById('game-cursor');
                                if (cursorEl) {
                                    const cursorRect = cursorEl.getBoundingClientRect();
                                    const cursorX = cursorRect.left + cursorRect.width / 2;
                                    const cursorY = cursorRect.top + cursorRect.height / 2;
                                    isPinchingInsidePanel = cursorX >= panelRect.left && cursorX <= panelRect.right &&
                                        cursorY >= panelRect.top && cursorY <= panelRect.bottom;
                                }
                            }

                            // Ayarlar butonu toggle
                            if (isPinchingOnSettings && !gameActive) {
                                if (settingsPanel) {
                                    settingsPanel.classList.toggle('hidden');
                                    settingsPanel.classList.toggle('visible');
                                }
                            }
                            // Panel dışında pinch ile paneli kapat
                            else if (isPanelOpen && !gameActive && !isPinchingOnSettings && !isPinchingInsidePanel) {
                                settingsPanel.classList.add('hidden');
                                settingsPanel.classList.remove('visible');
                            }
                            // Kamera toggle
                            else if (isHoveringCameraToggle && !gameActive && !isPanelOpen) {
                                const mainToggle = document.getElementById('camera-toggle');
                                const overToggle = document.getElementById('camera-toggle-over');
                                const newState = !mainToggle.checked;
                                mainToggle.checked = newState;
                                if (overToggle) overToggle.checked = newState;
                                setCameraToggleState(newState);
                                console.log('📷 Kamera toggle değiştirildi (pinch ile): ' + newState);
                            }
                            // How to Play butonu - modal aç
                            else if (isHoveringHowToPlayButton && !gameActive) {
                                const tutorialModal = document.getElementById('how-to-play-modal');
                                if (tutorialModal) {
                                    tutorialModal.classList.remove('hidden');
                                    console.log('📖 Tutorial modal açıldı (pinch ile)');
                                }
                            }
                            // Tutorial close butonu - modal kapat
                            else if (isHoveringTutorialCloseBtn) {
                                const tutorialModal = document.getElementById('how-to-play-modal');
                                if (tutorialModal) {
                                    tutorialModal.classList.add('hidden');
                                    console.log('📖 Tutorial modal kapatıldı (pinch ile)');
                                }
                            }
                            // Tutorial modal dışında pinch - modal kapat
                            else if (!gameActive) {
                                const tutorialModal = document.getElementById('how-to-play-modal');
                                if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
                                    const modalContent = tutorialModal.querySelector('.tutorial-modal');
                                    if (modalContent) {
                                        const modalRect = modalContent.getBoundingClientRect();
                                        const cursorEl = document.getElementById('game-cursor');
                                        if (cursorEl) {
                                            const cursorRect = cursorEl.getBoundingClientRect();
                                            const cursorX = cursorRect.left + cursorRect.width / 2;
                                            const cursorY = cursorRect.top + cursorRect.height / 2;
                                            const isInsideModal = cursorX >= modalRect.left && cursorX <= modalRect.right &&
                                                cursorY >= modalRect.top && cursorY <= modalRect.bottom;

                                            if (!isInsideModal) {
                                                tutorialModal.classList.add('hidden');
                                                console.log('📖 Tutorial modal kapatıldı (dışarı pinch)');
                                            }
                                        }
                                    }
                                }
                            }
                            // Oyun sırasında zıpla
                            else if (gameActive && !isGamePaused) {
                                jump();
                            }

                            lastPinchTime = now;
                            isPinching = true;
                        }
                        // Pinch görsel geri bildirimi
                        const cursorEl = document.getElementById('game-cursor');
                        cursorEl.style.backgroundColor = '#00FF00';
                        cursorEl.style.boxShadow = '0 0 15px #00FF00';
                    } else {
                        isPinching = false;
                        const cursorEl = document.getElementById('game-cursor');
                        cursorEl.style.backgroundColor = 'transparent';
                        cursorEl.style.boxShadow = '0 0 10px #00FFFF, inset 0 0 10px #00FFFF';
                    }
                }
            }
        }
    });

    const cameraUtils = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: CAMERA_WIDTH,
        height: CAMERA_HEIGHT
    });
    cameraUtils.start()
        .then(() => {
            console.log("Kamera başarıyla başlatıldı!");
        })
        .catch((err) => {
            console.error("Kamera başlatılamadı:", err);
            alert("Kamera başlatılamadı! Lütfen kamera izni verdiğinizden emin olun.");
        });
}