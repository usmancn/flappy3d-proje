function setupMediaPipe() {
            const videoElement = document.getElementById('webcam');
            const canvasElement = document.getElementById('output_canvas');
            const canvasCtx = canvasElement.getContext('2d');

            const hands = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });
            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            hands.onResults((results) => {
                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

                if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                    const landmarks = results.multiHandLandmarks[0];
                    // Çizim fonksiyonları (Sadece keypoints)
                    drawLandmarks(canvasCtx, landmarks, {
                        color: '#FF0000',
                        lineWidth: 1,
                        radius: 3
                    });

                    const cursorX = (1 - landmarks[8].x) * canvasElement.width;
                    const cursorY = landmarks[8].y * canvasElement.height;

                    const dist = Math.sqrt(
                        Math.pow(landmarks[4].x - landmarks[8].x, 2) +
                        Math.pow(landmarks[4].y - landmarks[8].y, 2)
                    );
                    const isCurrentPinch = dist < PINCH_THRESHOLD;

                    // Canvas çizimi kaldırıldı, sadece mantık
                    if (isCurrentPinch) {
                        const now = Date.now();
                        if (!isPinching && now - lastPinchTime > PINCH_COOLDOWN) {
                            jump();
                            lastPinchTime = now;
                            isPinching = true;
                        }
                    } else {
                        isPinching = false;
                    }

                    const normalizedX = cursorX / canvasElement.width;

                    // --- INPUT SATURATION FIX ---
                    // Normalde (normalizedX - 0.5) * (PLAY_WIDTH * 2) yapıyorduk.
                    // Şimdi inputu "overdrive" yapmak için daha geniş bir çarpan kullanıyoruz.
                    // 14 birim yol için, input aralığını 20 birim gibi hesaplıyoruz.
                    // Bu sayede el kenara yaklaşmadan kuş kenara yapışıyor (snap feel).
                    const INPUT_RANGE = 22.0;
                    targetBirdX = (normalizedX - 0.5) * (INPUT_RANGE * 2);

                    // Not: targetBirdX burada clamp'lanmıyor! updateGame içinde clamp'lanacak.
                    // Bu sayede "target" dışarıda olsa bile kuş sınırda kalır, bu da hızlı dönüş sağlar.

                    // --- Cursor Güncelleme ---
                    // El koordinatlarını (1 - landmarks[8].x) pencere boyutuna uyarla
                    const screenX = (1 - landmarks[8].x) * window.innerWidth;
                    const screenY = landmarks[8].y * window.innerHeight;

                    const cursorEl = document.getElementById('game-cursor');
                    cursorEl.style.display = 'block';
                    cursorEl.style.left = screenX + 'px';
                    cursorEl.style.top = screenY + 'px';

                    if (isCurrentPinch) {
                        cursorEl.style.backgroundColor = '#00FF00';
                        cursorEl.style.borderColor = '#00FF00';
                        cursorEl.style.boxShadow = '0 0 15px #00FF00';
                    } else {
                        cursorEl.style.backgroundColor = 'transparent';
                        cursorEl.style.borderColor = '#00FFFF';
                        cursorEl.style.boxShadow = '0 0 10px #00FFFF, inset 0 0 10px #00FFFF';
                    }
                }
                canvasCtx.restore();
            });

            const cameraUtils = new Camera(videoElement, {
                onFrame: async () => {
                    await hands.send({ image: videoElement });
                },
                width: CAMERA_WIDTH,
                height: CAMERA_HEIGHT
            });
            cameraUtils.start();
        }