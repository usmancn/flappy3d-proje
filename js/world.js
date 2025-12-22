// --- PERFORMANSLI ASSET OLUŞTURMA FONKSİYONLARI ---

// Ağaç Oluşturma (SADECE GLTF model - procedural ağaçlar kaldırıldı)
function createSimpleTree() {
    // SADECE GLTF model kullan (procedural ağaçlar kaldırıldı)
    if (loadedAssets.tree && typeof loadedAssets.tree.clone === 'function') {
        try {
            const tree = loadedAssets.tree.clone();
            
            // Gölge ayarları
            tree.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            // Scale uygula (Y pozisyonu createRoadSegment içinde ayarlanacak)
            tree.scale.set(15, 15, 15); // Devasa boyut
            
            return tree;
        } catch (error) {
            console.error('Ağaç clone edilirken hata:', error);
            return null; // Hata durumunda null döndür
        }
    }
    
    // GLTF model yoksa hiç ağaç oluşturma
    return null;
}

// Taş Oluşturma (SADECE GLTF model - fallback kaldırıldı)
function createStone() {
    // SADECE GLTF model kullan (fallback kaldırıldı)
    if (loadedAssets.stone && typeof loadedAssets.stone.clone === 'function') {
        try {
            const stone = loadedAssets.stone.clone();
            
            // Gölge ayarları
            stone.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            // Ortama uygun boyut
            stone.scale.set(12, 12, 12); // Bir önceki büyüklük
            
            // Rastgele döndür
            stone.rotation.y = Math.random() * Math.PI * 2;
            stone.rotation.x = (Math.random() - 0.5) * 0.3;
            stone.rotation.z = (Math.random() - 0.5) * 0.3;
            
            // Rastgele ölçekleme
            const stoneScale = 0.9 + Math.random() * 0.3; // 0.9 - 1.2 arası
            stone.scale.multiplyScalar(stoneScale);
            
            return stone;
        } catch (error) {
            console.error('Taş clone edilirken hata:', error);
            return null; // Hata durumunda null döndür
        }
    }
    
    // GLTF model yoksa hiç taş oluşturma
    return null;
}

// Kütük Oluşturma (SADECE GLTF model - fallback kaldırıldı)
function createLog() {
    // SADECE GLTF model kullan
    if (loadedAssets.log && typeof loadedAssets.log.clone === 'function') {
        try {
            const log = loadedAssets.log.clone();
            
            // Gölge ayarları
            log.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            // Ortama uygun boyut - küçük
            log.scale.set(3, 3, 3); // Küçük boyut
            
            // Rastgele döndür (kütükler yerde yatay olabilir)
            log.rotation.y = Math.random() * Math.PI * 2;
            log.rotation.x = (Math.random() - 0.5) * 0.5; // Biraz eğik olabilir
            log.rotation.z = (Math.random() - 0.5) * 0.5;
            
            // Rastgele ölçekleme
            const logScale = 0.8 + Math.random() * 0.4; // 0.8 - 1.2 arası
            log.scale.multiplyScalar(logScale);
            
            return log;
        } catch (error) {
            console.error('Kütük clone edilirken hata:', error);
            return null;
        }
    }
    
    // GLTF model yoksa hiç kütük oluşturma
    return null;
}

// Çimen Oluşturma (SADECE GLTF model)
function createGrass() {
    // SADECE GLTF model kullan
    if (loadedAssets.grass && typeof loadedAssets.grass.clone === 'function') {
        try {
            const grass = loadedAssets.grass.clone();
            
            // Gölge ayarları
            grass.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            // Çimenler çiçeklerden küçük olsun
            grass.scale.set(2.5, 2.5, 2.5); // Çimenler küçük (çiçekler 6x, çimenler 2.5x)
            
            // Rastgele döndür
            grass.rotation.y = Math.random() * Math.PI * 2;
            
            // Rastgele ölçekleme
            const grassScale = 0.8 + Math.random() * 0.4; // 0.8 - 1.2 arası
            grass.scale.multiplyScalar(grassScale);
            
            return grass;
        } catch (error) {
            console.error('Çimen clone edilirken hata:', error);
            return null; // Hata durumunda null döndür
        }
    }
    
    // GLTF model yoksa hiç çimen oluşturma
    return null;
}

// Çalı Oluşturma (GLTF veya fallback)
function createBush() {
    // Eğer GLTF model yüklendiyse kullan
    if (loadedAssets.bush) {
        const bush = loadedAssets.bush.clone();
        bush.scale.set(2, 2, 2);
        bush.traverse(function(node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return bush;
    }
    
    // Fallback: Basit çalı
    const bushGroup = new THREE.Group();
    const mainBush = new THREE.Mesh(bushGeo.clone(), bushMat.clone());
    mainBush.position.y = 2.5;
    mainBush.castShadow = true;
    mainBush.receiveShadow = true;
    bushGroup.add(mainBush);
    
    if (Math.random() < 0.6) {
        const smallBush = new THREE.Mesh(bushGeo.clone(), bushMat.clone());
        smallBush.scale.set(0.6, 0.6, 0.6);
        smallBush.position.set(
            (Math.random() - 0.5) * 3,
            1.5,
            (Math.random() - 0.5) * 3
        );
        smallBush.castShadow = true;
        bushGroup.add(smallBush);
    }
    
    return bushGroup;
}

// Çiçek Oluşturma (4 farklı GLTF modelden rastgele seç)
function createFlower() {
    // 4 farklı çiçek modelinden rastgele birini seç
    if (loadedAssets.flowers && loadedAssets.flowers.length > 0) {
        try {
            // Rastgele bir çiçek modeli seç
            const randomIndex = Math.floor(Math.random() * loadedAssets.flowers.length);
            const selectedFlowerModel = loadedAssets.flowers[randomIndex];
            
            if (selectedFlowerModel && typeof selectedFlowerModel.clone === 'function') {
                const flower = selectedFlowerModel.clone();
                
                // Gölge ayarları
                flower.traverse(function(node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                
                // Her çiçek modeli için farklı scale değerleri
                // flowersari.glb (index 3) çok büyük, diğerleri normal boyut
                let baseScale = 4.5; // Varsayılan scale (normal boyut)
                
                if (randomIndex === 3) { // flowersari.glb (index 3) - küçük
                    baseScale = 1.0; // flowersari küçültüldü (ağaçlardan küçük)
                } else {
                    // Diğer çiçekler (flowerkirmizi, flowermor, flowerpembe) normal boyut
                    baseScale = 4.5;
                }
                
                // Scale'i uygula
                flower.scale.set(baseScale, baseScale, baseScale);
                
                // Rastgele döndür
                flower.rotation.y = Math.random() * Math.PI * 2;
                
                // Rastgele ölçekleme (tüm çiçekler için)
                const flowerScale = 0.9 + Math.random() * 0.2; // 0.9 - 1.1 arası
                flower.scale.multiplyScalar(flowerScale);
                
                return flower;
            }
        } catch (error) {
            console.error('Çiçek clone edilirken hata:', error);
            return null;
        }
    }
    
    // GLTF model yoksa hiç çiçek oluşturma
    return null;
}

// Mantar Oluşturma (GLTF veya fallback)
function createMushroom() {
    // SADECE GLTF model kullan
    if (loadedAssets.mushroom && typeof loadedAssets.mushroom.clone === 'function') {
        try {
            const mushroom = loadedAssets.mushroom.clone();
            
            // Gölge ayarları
            mushroom.traverse(function(node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            
            // Ortama uygun boyut - çok büyük
            mushroom.scale.set(15, 15, 15); // Çok büyük boyut
            
            // Rastgele döndür
            mushroom.rotation.y = Math.random() * Math.PI * 2;
            
            // Rastgele ölçekleme
            const mushroomScale = 0.9 + Math.random() * 0.3; // 0.9 - 1.2 arası
            mushroom.scale.multiplyScalar(mushroomScale);
            
            return mushroom;
        } catch (error) {
            console.error('Mantar clone edilirken hata:', error);
            return null;
        }
    }
    
    // GLTF model yoksa hiç mantar oluşturma
    return null;
}

// Fallback: Basit kuş oluşturma fonksiyonu (çok küçük - borulardan geçebilir)
function createSimpleBird() {
    bird = new THREE.Group();
    
    // Gövde (çok küçük - borulardan geçebilir)
    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ 
            color: 0x4a90e2, // Mavi (değiştirilebilir)
            roughness: 0.5,
            metalness: 0.0
        })
    );
    body.scale.set(1.1, 0.9, 1.3);
    body.castShadow = true;
    body.receiveShadow = true;
    bird.add(body);

    // Kafa (çok küçük)
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        new THREE.MeshStandardMaterial({ 
            color: 0x4a90e2, // Mavi
            roughness: 0.5,
            metalness: 0.0
        })
    );
    head.position.set(0, 0.06, 0.04);
    head.castShadow = true;
    bird.add(head);

    // Kanatlar (çok küçük - farklı renk)
    const wingMat = new THREE.MeshStandardMaterial({ 
        color: 0x5dade2, // Açık mavi kanatlar
        roughness: 0.4,
        metalness: 0.0,
        side: THREE.DoubleSide
    });
    
    const wingL = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 0.11),
        wingMat.clone()
    );
    wingL.position.set(-0.07, 0.007, 0);
    wingL.rotation.z = -0.5;
    wingL.rotation.y = -0.3;
    wingL.rotation.x = 0.2;
    wingL.castShadow = true;
    bird.add(wingL);
    
    const wingR = new THREE.Mesh(
        new THREE.PlaneGeometry(0.15, 0.11),
        wingMat.clone()
    );
    wingR.position.set(0.07, 0.007, 0);
    wingR.rotation.z = 0.5;
    wingR.rotation.y = 0.3;
    wingR.rotation.x = 0.2;
    wingR.castShadow = true;
    bird.add(wingR);
    
    bird.userData.wingL = wingL;
    bird.userData.wingR = wingR;

    // Gaga (çok küçük)
    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.06, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xff6b00,
            roughness: 0.6
        })
    );
    beak.position.set(0, 0.06, 0.08);
    beak.rotation.x = -0.15;
    beak.castShadow = true;
    bird.add(beak);

    // Gözler (çok küçük)
    const eyeGeo = new THREE.SphereGeometry(0.015, 10, 10);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.025, 0.075, 0.06);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.025, 0.075, 0.06);
    bird.add(eyeL);
    bird.add(eyeR);
    
    scene.add(bird);
}

// Asset modellerini yükle
function loadAssetModels() {
    if (!gltfLoader) {
        console.warn('GLTFLoader mevcut değil, fallback modeller kullanılacak');
        return;
    }
    
    // Ağaç modeli yükle (birden fazla alternatif denenecek)
    if (ASSET_MODELS.tree && gltfLoader) {
        console.log('Ağaç modeli yükleniyor:', ASSET_MODELS.tree);
        
        // Alternatif linkler (eğer ilki çalışmazsa)
        const alternativeUrls = [
            ASSET_MODELS.tree, // İlk denenecek
            'https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/models/gltf/Lowpoly_tree_sample.glb',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/Lowpoly_tree_sample.glb'
        ];
        
        let currentUrlIndex = 0;
        
        function tryLoadTree(urlIndex) {
            if (urlIndex >= alternativeUrls.length) {
                console.warn('Tüm alternatif linkler denendi, fallback kullanılacak');
                return;
            }
            
            const url = alternativeUrls[urlIndex];
            console.log(`Ağaç modeli deneniyor (${urlIndex + 1}/${alternativeUrls.length}):`, url);
            
            gltfLoader.load(
                url,
                function(gltf) {
                    loadedAssets.tree = gltf.scene;
                    console.log('✅ Ağaç modeli başarıyla yüklendi!', gltf.scene);
                    console.log('Yeni segmentlerde detaylı GLTF ağaçlar görünecek');
                    // Debug: Modelin clone edilebilir olduğunu kontrol et
                    if (typeof loadedAssets.tree.clone === 'function') {
                        console.log('✅ Model clone edilebilir - GLTF ağaçlar kullanılacak');
                    } else {
                        console.warn('⚠️ Model clone edilemiyor!', loadedAssets.tree);
                    }
                    // Model yüklendiğinde mevcut segmentleri yeniden oluştur (ağaçlar görünsün)
                    refreshRoadSegments();
                },
                function(progress) {
                    if (progress.total > 0) {
                        const percent = (progress.loaded / progress.total * 100).toFixed(0);
                        if (percent % 25 === 0) { // Her %25'te bir log
                            console.log('Ağaç yükleniyor: ' + percent + '%');
                        }
                    }
                },
                function(error) {
                    console.warn(`❌ Link ${urlIndex + 1} çalışmadı:`, error);
                    // Bir sonraki alternatifi dene
                    tryLoadTree(urlIndex + 1);
                }
            );
        }
        
        tryLoadTree(0);
    } else {
        if (!ASSET_MODELS.tree) {
            console.warn('Ağaç modeli linki yok (null), fallback kullanılacak');
        }
        if (!gltfLoader) {
            console.warn('GLTFLoader mevcut değil, fallback kullanılacak');
        }
    }
    
    // 4 farklı çiçek modeli yükle
    if (ASSET_MODELS.flowers && ASSET_MODELS.flowers.length > 0) {
        let loadedCount = 0;
        const totalFlowers = ASSET_MODELS.flowers.length;
        
        ASSET_MODELS.flowers.forEach(function(flowerUrl, index) {
            gltfLoader.load(
                flowerUrl,
                function(gltf) {
                    loadedAssets.flowers.push(gltf.scene);
                    loadedCount++;
                    console.log(`✅ Çiçek modeli ${index + 1}/${totalFlowers} başarıyla yüklendi!`);
                    
                    // Tüm çiçekler yüklendiğinde segmentleri yeniden oluştur
                    if (loadedCount === totalFlowers) {
                        console.log('✅ Tüm çiçek modelleri yüklendi!');
                        refreshRoadSegments();
                    }
                },
                undefined,
                function(error) {
                    console.warn(`Çiçek modeli ${index + 1} yüklenemedi:`, error);
                    loadedCount++;
                    // Hata olsa bile diğer çiçekler yüklendiyse refresh yap
                    if (loadedCount === totalFlowers && loadedAssets.flowers.length > 0) {
                        refreshRoadSegments();
                    }
                }
            );
        });
    }
    
    // Mantar modeli yükle
    if (ASSET_MODELS.mushroom) {
        gltfLoader.load(
            ASSET_MODELS.mushroom,
            function(gltf) {
                loadedAssets.mushroom = gltf.scene;
                console.log('✅ Mantar modeli başarıyla yüklendi!');
                // Model yüklendiğinde mevcut segmentleri yeniden oluştur (mantarlar görünsün)
                refreshRoadSegments();
            },
            undefined,
            function(error) {
                console.warn('Mantar modeli yüklenemedi:', error);
            }
        );
    }
    
    // Kütük modeli yükle
    if (ASSET_MODELS.log) {
        gltfLoader.load(
            ASSET_MODELS.log,
            function(gltf) {
                loadedAssets.log = gltf.scene;
                console.log('✅ Kütük modeli başarıyla yüklendi!');
                // Model yüklendiğinde mevcut segmentleri yeniden oluştur (kütükler görünsün)
                refreshRoadSegments();
            },
            undefined,
            function(error) {
                console.warn('Kütük modeli yüklenemedi:', error);
            }
        );
    }
    
    // Çakıltaşı modeli yükle (yol yüzeyi)
    if (ASSET_MODELS.cobblestone) {
        gltfLoader.load(
            ASSET_MODELS.cobblestone,
            function(gltf) {
                loadedAssets.cobblestone = gltf.scene;
                console.log('✅ Çakıltaşı modeli başarıyla yüklendi!');
                // Model yüklendiğinde mevcut segmentleri yeniden oluştur (çakıltaşları görünsün)
                refreshRoadSegments();
            },
            undefined,
            function(error) {
                console.warn('Çakıltaşı modeli yüklenemedi:', error);
            }
        );
    }
    
    // Çalı modeli yükle
    if (ASSET_MODELS.bush) {
        gltfLoader.load(
            ASSET_MODELS.bush,
            function(gltf) {
                loadedAssets.bush = gltf.scene;
                console.log('Çalı modeli yüklendi!');
            },
            undefined,
            function(error) {
                console.warn('Çalı modeli yüklenemedi:', error);
            }
        );
    }
    
    // Taş modeli yükle
    if (ASSET_MODELS.stone) {
        gltfLoader.load(
            ASSET_MODELS.stone,
            function(gltf) {
                loadedAssets.stone = gltf.scene;
                console.log('✅ Taş modeli başarıyla yüklendi!');
                // Model yüklendiğinde mevcut segmentleri yeniden oluştur (taşlar görünsün)
                refreshRoadSegments();
            },
            undefined,
            function(error) {
                console.warn('Taş modeli yüklenemedi:', error);
            }
        );
    }
    
    // Çimen modeli yükle
    if (ASSET_MODELS.grass) {
        gltfLoader.load(
            ASSET_MODELS.grass,
            function(gltf) {
                loadedAssets.grass = gltf.scene;
                console.log('✅ Çimen modeli başarıyla yüklendi!');
                // Model yüklendiğinde mevcut segmentleri yeniden oluştur (çimenler görünsün)
                refreshRoadSegments();
            },
            undefined,
            function(error) {
                console.warn('Çimen modeli yüklenemedi:', error);
            }
        );
    }
    
    // Bulutlar artık procedural (assetsiz) - model yükleme kaldırıldı
    // Başlangıç bulutlarını oluştur
    for(let i=0; i<50; i++) {
        createCloud();
    }
}

// Yol segmentlerini yeniden oluştur (modeller yüklendikten sonra)
function refreshRoadSegments() {
    // Sadece modeller yüklendiyse ve segmentler varsa yeniden oluştur
    if (roadSegments.length > 0 && (loadedAssets.tree || loadedAssets.stone)) {
        console.log('Modeller yüklendi, yol segmentleri yeniden oluşturuluyor...');
        // Mevcut segmentleri temizle
        roadSegments.forEach(r => {
            scene.remove(r.mesh);
            scene.remove(r.left);
            scene.remove(r.right);
            scene.remove(r.lGround);
            scene.remove(r.rGround);
            if (r.decors) {
                r.decors.forEach(d => {
                    if (d) scene.remove(d);
                });
            }
        });
        roadSegments = [];
        lastRoadZ = 0;
        // Yeni segmentler oluştur (artık modeller yüklü)
        for (let i = 0; i < 50; i++) {
            createRoadSegment();
        }
    }
}

function init3D() {
    const container = document.getElementById('game-container');
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.FogExp2(0x87CEEB, 0.012);
            
            // Asset modellerini yükle
            loadAssetModels();

            camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 4, 15);
            camera.lookAt(0, 0, -10);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            container.appendChild(renderer.domElement);

            const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
            scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
            dirLight.position.set(50, 80, 30);
            dirLight.castShadow = true;
            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;
            dirLight.shadow.camera.near = 0.1;
            dirLight.shadow.camera.far = 500;
            dirLight.shadow.camera.left = -100;
            dirLight.shadow.camera.right = 100;
            dirLight.shadow.camera.top = 100;
            dirLight.shadow.camera.bottom = -100;
            scene.add(dirLight);

            for (let i = 0; i < 50; i++) {
                createRoadSegment();
            }
            // Bulutlar kaldırıldı
            // for(let i=0; i<50; i++) {
            //     createCloud();
            // }

            // KUŞ MODELİNİ GLTF OLARAK YÜKLE (Animasyonlu)
            const loader = new THREE.GLTFLoader();
            
            // Ücretsiz animasyonlu kuş modeli linkleri (kanatları hareket eden):
            // Alternatif 1: Parrot (Three.js örneği - animasyonlu, sarı/turuncu)
            // Alternatif 2: Flamingo (Three.js örneği - animasyonlu, pembe)
            // Alternatif 3: Stork (Three.js örneği - animasyonlu, beyaz/siyah)
            // Alternatif 4: Kendi modelinizi kullanabilirsiniz
            
            // Ücretsiz model kaynakları: 
            // - Sketchfab: https://sketchfab.com (ücretsiz animasyonlu kuş modelleri)
            // - Poly Haven: https://polyhaven.com/models
            // - Free3D: https://free3d.com
            // - Model linkini değiştirmek için aşağıdaki satırı güncelleyin
            
            // KUŞ MODELİ SEÇİMİ (istediğinizi seçin):
            // 1. Parrot (sarı/turuncu - mevcut)
            // 2. Flamingo (pembe)
            // 3. Stork (beyaz/siyah)
            // 4. Kendi modeliniz
            
            const birdModelUrl = 'https://threejs.org/examples/models/gltf/Parrot.glb';
            
            // Alternatif modeller (yukarıdaki satırı değiştirin):
            // const birdModelUrl = 'https://threejs.org/examples/models/gltf/Flamingo.glb'; // Pembe flamingo
            // const birdModelUrl = 'https://threejs.org/examples/models/gltf/Stork.glb'; // Beyaz/siyah leylek
            // const birdModelUrl = 'models/bird.glb'; // Kendi modeliniz
            
            // Önce geçici kuş oluştur (model yüklenene kadar görünsün)
            createSimpleBird();
            let birdMixer = null; // Animasyon mixer
            
            // Model yüklemeyi dene
            loader.load(
                birdModelUrl,
                function(gltf) {
                    // Model yüklendi - geçici kuşu değiştir
                    const model = gltf.scene;
                    
                    // Modeli ölçekle (borulardan geçebilecek kadar çok küçük)
                    model.scale.set(0.05, 0.05, 0.05);
                    
                    // Modeli döndür (doğru yöne baksın)
                    model.rotation.y = Math.PI;
                    
                    // Gölge ayarları
                    model.traverse(function(node) {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    
                    // Animasyonları yükle (eğer varsa)
                    if (gltf.animations && gltf.animations.length > 0) {
                        birdMixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => {
                            birdMixer.clipAction(clip).play();
                        });
                        model.userData.mixer = birdMixer;
                        console.log('Kuş animasyonları yüklendi:', gltf.animations.length);
                    }
                    
                    // Kanatları bul (manuel animasyon için fallback)
                    model.userData.wingL = model.getObjectByName('WingL') || 
                                         model.getObjectByName('wingL') || 
                                         model.getObjectByName('LeftWing') ||
                                         model.getObjectByName('leftWing');
                    model.userData.wingR = model.getObjectByName('WingR') || 
                                         model.getObjectByName('wingR') || 
                                         model.getObjectByName('RightWing') ||
                                         model.getObjectByName('rightWing');
                    
                    // Eğer kanat isimleri farklıysa, tüm çocukları kontrol et
                    if (!model.userData.wingL || !model.userData.wingR) {
                        model.traverse(function(child) {
                            if (child.name && child.name.toLowerCase().includes('wing')) {
                                if (child.name.toLowerCase().includes('left') || 
                                    child.name.toLowerCase().includes('l') ||
                                    child.name.toLowerCase().startsWith('l')) {
                                    model.userData.wingL = child;
                                } else if (child.name.toLowerCase().includes('right') || 
                                          child.name.toLowerCase().includes('r') ||
                                          child.name.toLowerCase().startsWith('r')) {
                                    model.userData.wingR = child;
                                }
                            }
                        });
                    }
                    
                    // Eski kuşu kaldır, yeni modeli ekle
                    const oldBird = bird;
                    scene.remove(oldBird);
                    bird = model;
            scene.add(bird);
                    
                    console.log('Kuş modeli yüklendi ve değiştirildi!');
                },
                function(progress) {
                    // Yükleme ilerlemesi
                    if (progress.total > 0) {
                        console.log('Yükleniyor: ' + (progress.loaded / progress.total * 100).toFixed(0) + '%');
                    }
                },
                function(error) {
                    // Hata durumunda fallback kuş zaten var, sadece log
                    console.warn('Model yüklenemedi, basit kuş kullanılıyor:', error);
                }
            );
            

            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
}

function getRoadX(z) {
    // AYARLAR
    const pipeDistance = 50; // Borular arası mesafe (kodunuzdaki PIPE_DISTANCE ile aynı olmalı)
    const pipesPerTurn = 6;  // Kaç boruda bir (skorda bir) yön değişsin? (5-6 idealdir)
    const maxOffset = 22.0;  // Yol merkezden ne kadar sağa/sola kaysın?
    const sharpness = 4.0;   // Dönüş ne kadar KESKİN olsun? (Değer arttıkça viraj sertleşir)

    // HESAPLAMA (Düz yol -> Viraj -> Düz yol mantığı)
    // Frekans ayarı: 2 * PI / (Toplam döngü mesafesi)
    const frequency = Math.PI / (pipeDistance * pipesPerTurn);
    
    // Math.sin: Ana dalgayı üretir.
    // Math.tanh: Sinüs dalgasını "kütleştirir", yani tepe noktalarını düzleştirerek düz yol oluşturur.
    // sharpness: Aradaki geçişin (virajın) ne kadar ani olacağını belirler.
    return Math.tanh(Math.sin(z * frequency) * sharpness) * maxOffset;
}



function createRoadSegment() {
    const segmentLength = 5;
    const z = lastRoadZ;
    const nextZ = z - segmentLength;
    const x = getRoadX(z);
    const nextX = getRoadX(nextZ);
    const halfWidth = ROAD_WIDTH / 2;
    const y = -3;

    // Koordinatlar
    const p1 = new THREE.Vector3(x - halfWidth, y, z);
    const p3 = new THREE.Vector3(nextX - halfWidth, y, nextZ);
    const p2 = new THREE.Vector3(x + halfWidth, y, z);
    const p4 = new THREE.Vector3(nextX + halfWidth, y, nextZ);

    // 1. GERÇEKÇİ TOPRAK YOL
    const roadGeo = new THREE.BufferGeometry();
    const roadVertices = new Float32Array([
        p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z,
        p2.x, p2.y, p2.z, p4.x, p4.y, p4.z, p3.x, p3.y, p3.z
    ]);
    roadGeo.setAttribute('position', new THREE.BufferAttribute(roadVertices, 3));
    roadGeo.computeVertexNormals();
    
    // YOL RENGİ DEĞİŞİKLİĞİ: Koyu Kahve (Gerçek Toprak)
    const roadMat = new THREE.MeshStandardMaterial({ 
        color: 0x4e342e, // Koyu, ıslak toprak tonu
        roughness: 1.0,  
        side: THREE.DoubleSide 
    });
    
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.receiveShadow = true;
    scene.add(road);
    
    // YOL YÜZEYİNE ÇAKILTAŞLARI DÖŞE
    if (loadedAssets.cobblestone && typeof loadedAssets.cobblestone.clone === 'function') {
        // Yol segmentinin üzerine çakıltaşları yerleştir
        // Segment uzunluğu: 5 birim, genişlik: ROAD_WIDTH (28 birim)
        const cobblestoneCountX = Math.ceil(ROAD_WIDTH / 2); // Genişlik boyunca
        const cobblestoneCountZ = Math.ceil(segmentLength / 2); // Uzunluk boyunca
        
        for (let i = 0; i < cobblestoneCountX; i++) {
            for (let j = 0; j < cobblestoneCountZ; j++) {
                try {
                    const cobblestone = loadedAssets.cobblestone.clone();
                    
                    // Gölge ayarları
                    cobblestone.traverse(function(node) {
                        if (node.isMesh) {
                            node.castShadow = false; // Çakıltaşlar gölge düşürmesin
                            node.receiveShadow = true;
                        }
                    });
                    
                    // Çakıltaşı boyutu
                    cobblestone.scale.set(2, 2, 2);
                    
                    // Yolun üzerine yerleştir (yol yüzeyinden biraz yukarıda)
                    const offsetX = (i / cobblestoneCountX - 0.5) * ROAD_WIDTH * 0.9; // Yolun kenarlarından biraz içeride
                    const offsetZ = (j / cobblestoneCountZ - 0.5) * segmentLength * 0.9;
                    
                    // Yolun merkez noktasını hesapla
                    const roadCenterX = (x + nextX) / 2;
                    const roadCenterZ = (z + nextZ) / 2;
                    
                    cobblestone.position.x = roadCenterX + offsetX;
                    cobblestone.position.z = roadCenterZ + offsetZ;
                    cobblestone.position.y = y + 0.05; // Yolun üzerinde (biraz yukarıda)
                    
                    // Rastgele rotasyon (daha doğal görünsün)
                    cobblestone.rotation.y = Math.random() * Math.PI * 2;
                    
                    // Hafif rastgele ölçekleme
                    const cobbleScale = 0.9 + Math.random() * 0.2; // 0.9 - 1.1 arası
                    cobblestone.scale.multiplyScalar(cobbleScale);
                    
                    scene.add(cobblestone);
                    decorMeshes.push(cobblestone);
                } catch (error) {
                    console.error('Çakıltaşı clone edilirken hata:', error);
                }
            }
        }
    }

    // 2. YAN ZEMİNLER (Toprak renginde devam etsin)
    const groundWidth = 120; // Biraz daha genişlettik
    
    // Sol Zemin
    const l_OuterNear = new THREE.Vector3(x - halfWidth - groundWidth, y, z);
    const l_OuterFar = new THREE.Vector3(nextX - halfWidth - groundWidth, y, nextZ);
    const lGeo = new THREE.BufferGeometry();
    const lVertices = new Float32Array([
        l_OuterNear.x, y, z, p1.x, y, z, l_OuterFar.x, y, nextZ,
        p1.x, y, z, p3.x, y, nextZ, l_OuterFar.x, y, nextZ
    ]);
    lGeo.setAttribute('position', new THREE.BufferAttribute(lVertices, 3));
    lGeo.computeVertexNormals();
    // Burada da 'groundMat' (yukarıda koyu toprak yaptık) kullanıyoruz
    const lMesh = new THREE.Mesh(lGeo, groundMat); 
    lMesh.receiveShadow = true;
    scene.add(lMesh);

    // Sağ Zemin
    const r_OuterNear = new THREE.Vector3(x + halfWidth + groundWidth, y, z);
    const r_OuterFar = new THREE.Vector3(nextX + halfWidth + groundWidth, y, nextZ);
    const rGeo = new THREE.BufferGeometry();
    const rVertices = new Float32Array([
        p2.x, y, z, r_OuterNear.x, y, z, p4.x, y, nextZ,
        r_OuterNear.x, y, z, r_OuterFar.x, y, nextZ, p4.x, y, nextZ
    ]);
    rGeo.setAttribute('position', new THREE.BufferAttribute(rVertices, 3));
    rGeo.computeVertexNormals();
    const rMesh = new THREE.Mesh(rGeo, groundMat);
    rMesh.receiveShadow = true;
    scene.add(rMesh);

    // 3. YOL KENARI ASSETLERİ (GLTF Modellerle)
    const decorMeshes = []; 
    
    // Ağaçlar (Minimum mesafe kontrolü ile - iç içe geçmeyi önler)
    const treeCount = 3 + Math.floor(Math.random() * 3); // 3-5 ağaç per segment (3 katına çıkarıldı)
    const minTreeDistance = 20; // Ağaçlar arası minimum mesafe (biraz azaltıldı - daha sık olabilmesi için)
    const treePositions = []; // Yerleştirilen ağaç pozisyonlarını tut
    
    let attempts = 0;
    let placedTrees = 0;
    const maxAttempts = treeCount * 15; // Her ağaç için maksimum deneme sayısı
    
    while (placedTrees < treeCount && attempts < maxAttempts) {
        attempts++;
        
        const isLeft = Math.random() < 0.5;
        // Yoldan 8-50 birim uzaklıkta yerleştir (minimum 8 birim)
        const dist = 8 + Math.random() * 42;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const treeX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Minimum mesafe kontrolü
        let tooClose = false;
        for (let j = 0; j < treePositions.length; j++) {
            const existingPos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(treeX - existingPos.x, 2) + 
                Math.pow(randZ - existingPos.z, 2)
            );
            if (distance < minTreeDistance) {
                tooClose = true;
                break;
            }
        }
        
        // Eğer çok yakınsa, tekrar dene
        if (tooClose) {
            continue;
        }
        
        // Ağaç oluştur
        const tree = createSimpleTree();
        if (tree) {
            // Önce X ve Z pozisyonlarını ayarla
            tree.position.x = treeX;
            tree.position.z = randZ;
            
            // Boyut varyasyonu
            const treeScale = 0.9 + Math.random() * 0.4; // 0.9 - 1.3 arası
            tree.scale.multiplyScalar(treeScale);
            
            // Rastgele döndür
            tree.rotation.y = Math.random() * Math.PI * 2;
            
            // Scale ve rotation uygulandıktan SONRA bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(tree);
            const treeBottom = box.min.y;
            const treeTop = box.max.y;
            const treeHeight = treeTop - treeBottom;
            
            // Ağacı yukarı taşı - altı yolun Y pozisyonuna değsin
            // Eğer treeBottom negatifse, pozitif yapmak için -treeBottom ekle
            // Ekstra güvenlik için biraz daha yukarı taşı (0.5 birim)
            tree.position.y = y - treeBottom + 0.5; // Ağacın altı yolun üstünde
            
            // Debug log (sadece ilk ağaç için)
            if (placedTrees === 0) {
                console.log('Ağaç pozisyonu - Alt:', treeBottom.toFixed(2), 'Yükseklik:', treeHeight.toFixed(2), 'Yol Y:', y.toFixed(2), 'Ağaç Y:', tree.position.y.toFixed(2));
            }
            
            scene.add(tree);
            decorMeshes.push(tree);
            
            // Pozisyonu kaydet
            treePositions.push({ x: treeX, z: randZ });
            placedTrees++;
        }
    }
    
    // Taşlar (ağaçların arasına - sıklık 3 katına çıkarıldı)
    const stoneCount = 2 + Math.floor(Math.random() * 2); // 2-3 taş per segment (3 katına çıkarıldı)
    const minStoneDistance = 15; // Taşlar ve ağaçlar arası minimum mesafe (biraz azaltıldı - daha sık olabilmesi için)
    const stonePositions = []; // Taş pozisyonlarını sakla
    
    let stoneAttempts = 0;
    let placedStones = 0;
    const maxStoneAttempts = stoneCount * 10;
    
    while (placedStones < stoneCount && stoneAttempts < maxStoneAttempts) {
        stoneAttempts++;
        
        const isLeft = Math.random() < 0.5;
        // Hem kenarlara hem de ara bölgelere yerleştir (mesafe aralığı genişletildi)
        const dist = 5 + Math.random() * 40; // Yoldan 5-45 birim uzaklıkta (önceden 6-26 idi)
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const stoneX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Ağaçlara minimum mesafe kontrolü
        let tooCloseToTree = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(stoneX - treePos.x, 2) + 
                Math.pow(randZ - treePos.z, 2)
            );
            if (distance < minStoneDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        
        // Eğer ağaca çok yakınsa, tekrar dene
        if (tooCloseToTree) {
            continue;
        }
        
        // Taş oluştur
        const stone = createStone();
        if (stone) {
            // Scale uygulandıktan sonra bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(stone);
            const stoneBottom = box.min.y;
            
            // Taşı yere yerleştir
            stone.position.x = stoneX;
            stone.position.z = randZ;
            stone.position.y = y - stoneBottom + 0.2; // Biraz yukarıda
            
            scene.add(stone);
            decorMeshes.push(stone);
            
            // Pozisyonu kaydet
            stonePositions.push({ x: stoneX, z: randZ });
            
            placedStones++;
        }
    }
    
    // Çiçekler (ağaçların, taşların ve çimenlerin arasına)
    const flowerCount = 3 + Math.floor(Math.random() * 4); // 3-6 çiçek per segment
    const minFlowerDistance = 5; // Çiçekler arası minimum mesafe
    const flowerPositions = []; // Çiçek pozisyonlarını sakla
    
    let flowerAttempts = 0;
    let placedFlowers = 0;
    const maxFlowerAttempts = flowerCount * 10;
    
    while (placedFlowers < flowerCount && flowerAttempts < maxFlowerAttempts) {
        flowerAttempts++;
        
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35; // Yoldan 4-39 birim uzaklıkta
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const flowerX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Ağaçlara, taşlara minimum mesafe kontrolü
        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(flowerX - treePos.x, 2) + 
                Math.pow(randZ - treePos.z, 2)
            );
            if (distance < minFlowerDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(
                Math.pow(flowerX - stonePos.x, 2) + 
                Math.pow(randZ - stonePos.z, 2)
            );
            if (distance < minFlowerDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;
        
        // Çiçek oluştur
        const flower = createFlower();
        if (flower) {
            // Scale uygulandıktan sonra bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(flower);
            const flowerBottom = box.min.y;
            
            // Çiçeği yere yerleştir
            flower.position.x = flowerX;
            flower.position.z = randZ;
            flower.position.y = y - flowerBottom + 0.1; // Biraz yukarıda
            
            scene.add(flower);
            decorMeshes.push(flower);
            
            // Pozisyonu kaydet
            flowerPositions.push({ x: flowerX, z: randZ });
            
            placedFlowers++;
        }
    }
    
    // Çimenler (ağaçların, taşların ve çiçeklerin arasına - çok sayıda)
    const grassCount = 8 + Math.floor(Math.random() * 7); // 8-14 çimen per segment
    const minGrassDistance = 3; // Çimenler arası minimum mesafe (küçük - çok sayıda olabilir)
    
    let grassAttempts = 0;
    let placedGrass = 0;
    const maxGrassAttempts = grassCount * 10;
    
    while (placedGrass < grassCount && grassAttempts < maxGrassAttempts) {
        grassAttempts++;
        
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35; // Yoldan 4-39 birim uzaklıkta
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const grassX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Ağaçlara, taşlara ve çiçeklere minimum mesafe kontrolü
        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(grassX - treePos.x, 2) + 
                Math.pow(randZ - treePos.z, 2)
            );
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(
                Math.pow(grassX - stonePos.x, 2) + 
                Math.pow(randZ - stonePos.z, 2)
            );
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;
        
        // Çiçeklere minimum mesafe kontrolü
        for (let j = 0; j < flowerPositions.length; j++) {
            const flowerPos = flowerPositions[j];
            const distance = Math.sqrt(
                Math.pow(grassX - flowerPos.x, 2) + 
                Math.pow(randZ - flowerPos.z, 2)
            );
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;
        
        // Çimen oluştur
        const grass = createGrass();
        if (grass) {
            // Scale uygulandıktan sonra bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(grass);
            const grassBottom = box.min.y;
            
            // Çimeni yere yerleştir
            grass.position.x = grassX;
            grass.position.z = randZ;
            grass.position.y = y - grassBottom + 0.1; // Yere yakın

        scene.add(grass);
        decorMeshes.push(grass);

            placedGrass++;
        }
    }
    
    // Mantarlar (ağaçların, taşların, çiçeklerin ve çimenlerin arasına)
    const mushroomCount = 2 + Math.floor(Math.random() * 3); // 2-4 mantar per segment
    const minMushroomDistance = 6; // Mantarlar arası minimum mesafe
    const mushroomPositions = []; // Mantar pozisyonlarını sakla
    
    let mushroomAttempts = 0;
    let placedMushrooms = 0;
    const maxMushroomAttempts = mushroomCount * 10;
    
    while (placedMushrooms < mushroomCount && mushroomAttempts < maxMushroomAttempts) {
        mushroomAttempts++;
        
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35; // Yoldan 4-39 birim uzaklıkta
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const mushroomX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Ağaçlara, taşlara, çiçeklere minimum mesafe kontrolü
        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(mushroomX - treePos.x, 2) + 
                Math.pow(randZ - treePos.z, 2)
            );
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(
                Math.pow(mushroomX - stonePos.x, 2) + 
                Math.pow(randZ - stonePos.z, 2)
            );
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;
        
        for (let j = 0; j < flowerPositions.length; j++) {
            const flowerPos = flowerPositions[j];
            const distance = Math.sqrt(
                Math.pow(mushroomX - flowerPos.x, 2) + 
                Math.pow(randZ - flowerPos.z, 2)
            );
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;
        
        // Mantar oluştur
        const mushroom = createMushroom();
        if (mushroom) {
            // Scale uygulandıktan sonra bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(mushroom);
            const mushroomBottom = box.min.y;
            
            // Mantarı yere yerleştir
            mushroom.position.x = mushroomX;
            mushroom.position.z = randZ;
            mushroom.position.y = y - mushroomBottom + 0.1; // Biraz yukarıda
            
            scene.add(mushroom);
            decorMeshes.push(mushroom);
            
            // Pozisyonu kaydet
            mushroomPositions.push({ x: mushroomX, z: randZ });
            
            placedMushrooms++;
        }
    }
    
    // Kütükler (ağaçların arasına)
    const logCount = 1 + Math.floor(Math.random() * 2); // 1-2 kütük per segment
    const minLogDistance = 18; // Kütükler arası minimum mesafe (ağaçlara yakın olabilir)
    const logPositions = []; // Kütük pozisyonlarını sakla
    
    let logAttempts = 0;
    let placedLogs = 0;
    const maxLogAttempts = logCount * 10;
    
    while (placedLogs < logCount && logAttempts < maxLogAttempts) {
        logAttempts++;
        
        const isLeft = Math.random() < 0.5;
        const dist = 5 + Math.random() * 40; // Yoldan 5-45 birim uzaklıkta
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const logX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        // Ağaçlara minimum mesafe kontrolü (kütükler ağaçlara yakın olabilir ama çok yakın olmasın)
        let tooCloseToTree = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(
                Math.pow(logX - treePos.x, 2) + 
                Math.pow(randZ - treePos.z, 2)
            );
            if (distance < minLogDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        if (tooCloseToTree) continue;
        
        // Taşlara minimum mesafe kontrolü
        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(
                Math.pow(logX - stonePos.x, 2) + 
                Math.pow(randZ - stonePos.z, 2)
            );
            if (distance < minLogDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        if (tooCloseToTree) continue;
        
        // Kütük oluştur
        const log = createLog();
        if (log) {
            // Scale uygulandıktan sonra bounding box'ı hesapla
            const box = new THREE.Box3().setFromObject(log);
            const logBottom = box.min.y;
            
            // Kütüğü yere yerleştir
            log.position.x = logX;
            log.position.z = randZ;
            log.position.y = y - logBottom + 0.2; // Biraz yukarıda
            
            scene.add(log);
            decorMeshes.push(log);
            
            // Pozisyonu kaydet
            logPositions.push({ x: logX, z: randZ });
            
            placedLogs++;
        }
    }

    // 4. GÖRÜNMEZ DUVARLAR
    const wallMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide });
    const h = 15;
    const lwGeo = new THREE.BufferGeometry();
    const lwVerts = new Float32Array([p1.x, p1.y, p1.z, p3.x, p3.y, p3.z, p1.x, p1.y + h, p1.z, p3.x, p3.y, p3.z, p3.x, p3.y + h, p3.z, p1.x, p1.y + h, p1.z]);
    lwGeo.setAttribute('position', new THREE.BufferAttribute(lwVerts, 3));
    const leftWall = new THREE.Mesh(lwGeo, wallMat);
    scene.add(leftWall);

    const rwGeo = new THREE.BufferGeometry();
    const rwVerts = new Float32Array([p2.x, p2.y, p2.z, p4.x, p4.y, p4.z, p2.x, p2.y + h, p2.z, p4.x, p4.y, p4.z, p4.x, p4.y + h, p4.z, p2.x, p2.y + h, p2.z]);
    rwGeo.setAttribute('position', new THREE.BufferAttribute(rwVerts, 3));
    const rightWall = new THREE.Mesh(rwGeo, wallMat);
    scene.add(rightWall);

    roadSegments.push({ mesh: road, left: leftWall, right: rightWall, lGround: lMesh, rGround: rMesh, decors: decorMeshes, z: z });
    lastRoadZ = nextZ;

    if (roadSegments.length > 100) {
        const old = roadSegments.shift();
        scene.remove(old.mesh); scene.remove(old.left); scene.remove(old.right);
        scene.remove(old.lGround); scene.remove(old.rGround);
        if(old.decors) old.decors.forEach(d => scene.remove(d));
        old.mesh.geometry.dispose(); old.mesh.material.dispose();
        old.lGround.geometry.dispose(); old.rGround.geometry.dispose();
    }
}

function createPipe() {
    const pipeZ = lastPipeZ - PIPE_DISTANCE;
            const roadX = getRoadX(pipeZ);
            const limitX = PLAY_WIDTH - 1.5;
            const randomOffset = (Math.random() * (limitX * 2)) - limitX;
            const randomX = roadX + randomOffset;
            const randomY = Math.random() * 5 + 1;

            // Mario tarzı yeşil boru materyali
            const pipeMat = new THREE.MeshStandardMaterial({ 
                color: 0x2e7d32, // Mario yeşili
                roughness: 0.6,
                metalness: 0.0
            });

            // Boru decorations kaldırıldı - sadece temiz boru

            const upperGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 2, PIPE_WIDTH / 2, 15, 16);
            const upperPipe = new THREE.Mesh(upperGeo, pipeMat);
            upperPipe.position.set(randomX, randomY + PIPE_GAP_Y / 2 + 7.5, pipeZ);
            upperPipe.castShadow = true;
            upperPipe.receiveShadow = true;

            const lowerGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 2, PIPE_WIDTH / 2, 15, 16);
            const lowerPipe = new THREE.Mesh(lowerGeo, pipeMat);
            lowerPipe.position.set(randomX, randomY - PIPE_GAP_Y / 2 - 7.5, pipeZ);
            lowerPipe.castShadow = true;
            lowerPipe.receiveShadow = true;

            // Boru başlıkları (daha belirgin, Mario tarzı)
            const capGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 1.6, PIPE_WIDTH / 1.6, 0.8, 16);
            const uCap = new THREE.Mesh(capGeo, pipeMat.clone());
            uCap.position.set(randomX, randomY + PIPE_GAP_Y / 2 + 0.4, pipeZ);
            uCap.castShadow = true;
            uCap.receiveShadow = true;

            const lCap = new THREE.Mesh(capGeo.clone(), pipeMat.clone());
            lCap.position.set(randomX, randomY - PIPE_GAP_Y / 2 - 0.4, pipeZ);
            lCap.castShadow = true;
            lCap.receiveShadow = true;

            // Sadece temiz boru - ekstra bloklar yok

            const vWallGeo = new THREE.PlaneGeometry(ROAD_WIDTH * 1.5, 30);
            // createPipe fonksiyonunun içindeki vWallMat kısmı:
    const vWallMat = new THREE.MeshBasicMaterial({
        color: 0x00FFFF,
        transparent: true,
        opacity: 0.0,       // <-- TAM ŞEFFAF YAPILDI (0.1'den 0.0'a)
        depthWrite: false,  // <-- EKLENDİ: Arkadaki bulutların görünmesini sağlar
        side: THREE.DoubleSide
    });

            const gapSize = PIPE_WIDTH + 2;
            const leftW = new THREE.Mesh(vWallGeo, vWallMat);
            leftW.position.set(randomX - (gapSize / 2 + ROAD_WIDTH * 0.75), 0, pipeZ);

            const rightW = new THREE.Mesh(vWallGeo, vWallMat);
            rightW.position.set(randomX + (gapSize / 2 + ROAD_WIDTH * 0.75), 0, pipeZ);

            scene.add(upperPipe);
            scene.add(lowerPipe);
            scene.add(uCap);
            scene.add(lCap);
            scene.add(leftW);
            scene.add(rightW);

            pipes.push({
                upper: upperPipe,
                lower: lowerPipe,
                uCap: uCap,
                lCap: lCap,
                leftW: leftW,
                rightW: rightW,
                x: randomX,
                offset: randomOffset,
                yCenter: randomY,
                passed: false,
                z: pipeZ
            });
            lastPipeZ = pipeZ;
}

function createCloud() {
    const zPos = lastCloudZ - (Math.random() * 15 + 10);
    // Yolu takip etsin ama daha geniş bir alana yayılsın (+-150)
    const xPos = getRoadX(zPos) + (Math.random() * 300 - 150);
    // Daha yüksekte olsunlar (40-80 arası)
    const yPos = 40 + Math.random() * 40;

    const cloudGroup = new THREE.Group();
    cloudGroup.position.set(xPos, yPos, zPos);

    // Materyal Klonlama (Hafif renk varyasyonu için)
    const uniqueMat = cloudMat.clone();
    // %30 ihtimalle hafif grimsi bir bulut olsun (doğallık katar)
    if (Math.random() < 0.3) {
        const grayScale = 0.9 + Math.random() * 0.1; // 0.9 ile 1.0 arası
        uniqueMat.color.multiplyScalar(grayScale);
    }

    // Boyut ve Parça Sayısı Ayarı
    const sizeRoll = Math.random();
    let puffCount, scaleBase;

    // Artık daha fazla parça (küre) kullanarak hacim yaratacağız
    if (sizeRoll < 0.4) {
        puffCount = 7; scaleBase = 1.0; // Küçük bulut
    } else if (sizeRoll < 0.8) {
        puffCount = 15; scaleBase = 1.5; // Orta bulut
    } else {
        puffCount = 25; scaleBase = 2.2; // Büyük, heybetli bulut
    }

    for (let i = 0; i < puffCount; i++) {
        // YENİ GEOMETRİ: Kutu yerine 'cloudPuffGeo' (Küre)
        const mesh = new THREE.Mesh(cloudPuffGeo, uniqueMat);

        // RASTGELE DAĞILIM (Kümeleşme)
        // Bulutun merkezi etrafında rastgele pozisyonlar oluştur.
        // Yatayda geniş, dikeyde daha basık bir dağılım.
        mesh.position.set(
            (Math.random() - 0.5) * 12 * scaleBase, // X Genişliği
            (Math.random() - 0.5) * 5 * scaleBase,  // Y Yüksekliği (Basık)
            (Math.random() - 0.5) * 8 * scaleBase   // Z Derinliği
        );

        // Rastgele döndür ki hepsi aynı durmasın
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        // Rastgele boyut varyasyonu (Her pofuduk parçası farklı boyda)
        const randScale = 0.6 + Math.random() * 0.8;
        mesh.scale.set(randScale, randScale, randScale);

        // Bulutlar gölge düşürmesin (Performans ve estetik için)
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        cloudGroup.add(mesh);
    }

    // Ana grubun ölçeğini ayarla
    cloudGroup.scale.set(scaleBase, scaleBase, scaleBase);
    
    scene.add(cloudGroup);
    clouds.push({ mesh: cloudGroup, z: zPos });
    lastCloudZ = zPos;
}

function createPowerUp() {
     // Power-Up'ı borudan biraz daha ileri koy
            const itemZ = lastPipeZ - 30; // 30 birim ileri
            const roadX = getRoadX(itemZ);

            // Yolun ortalarında spawn olsun
            const limitX = 8.0;
            const randomOffset = (Math.random() * (limitX * 2)) - limitX;
            const itemX = roadX + randomOffset;
            const itemY = Math.random() * 5 + 3;

            const type = Math.random() < 0.5 ? 'shield' : 'wallBreaker';
            let mesh;

            if (type === 'shield') {
                // SHIELD: Mavi, Transparan Küre
                const geo = new THREE.SphereGeometry(1.5, 32, 32);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x00BFFF,
                    emissive: 0x0000AA,
                    shininess: 100,
                    transparent: true,
                    opacity: 0.9
                });
                mesh = new THREE.Mesh(geo, mat);
            } else {
                // WALL BREAKER: Kırmızı, Parlak Küp
                const geo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
                const mat = new THREE.MeshPhongMaterial({
                    color: 0xFF0000,
                    emissive: 0xFF4500,
                    shininess: 100
                });
                mesh = new THREE.Mesh(geo, mat);
            }

            mesh.position.set(itemX, itemY, itemZ);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            // Dönüş için başlangıç rotasyonu
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;

            scene.add(mesh);

            powerUps.push({
                mesh: mesh,
                type: type,
                x: itemX,
                z: itemZ,
                passed: false
            });

        }
