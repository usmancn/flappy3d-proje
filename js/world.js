// WORLD.JS - 3D Dünya Oluşturma ve Asset Yönetimi

// Ağaç oluştur (GLTF model)
function createSimpleTree() {
    if (loadedAssets.tree && typeof loadedAssets.tree.clone === 'function') {
        try {
            const tree = loadedAssets.tree.clone();
            tree.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            tree.scale.set(15, 15, 15);
            return tree;
        } catch (error) {
            console.error('Ağaç clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Taş oluştur (GLTF model)
function createStone() {
    if (loadedAssets.stone && typeof loadedAssets.stone.clone === 'function') {
        try {
            const stone = loadedAssets.stone.clone();
            stone.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            stone.scale.set(12, 12, 12);
            stone.rotation.y = Math.random() * Math.PI * 2;
            stone.rotation.x = (Math.random() - 0.5) * 0.3;
            stone.rotation.z = (Math.random() - 0.5) * 0.3;
            const stoneScale = 0.9 + Math.random() * 0.3;
            stone.scale.multiplyScalar(stoneScale);
            return stone;
        } catch (error) {
            console.error('Taş clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Kütük oluştur (GLTF model)
function createLog() {
    if (window.AB_TEST_CONFIG && window.AB_TEST_CONFIG.DISABLE_LOGS) {
        return null;
    }

    if (loadedAssets.log && typeof loadedAssets.log.clone === 'function') {
        try {
            const log = loadedAssets.log.clone();
            log.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            log.scale.set(2.6, 2.4, 2.6);
            log.rotation.y = Math.random() * Math.PI * 2;
            log.rotation.x = (Math.random() - 0.5) * 0.15;
            log.rotation.z = (Math.random() - 0.5) * 0.15;
            const logScale = 0.95 + Math.random() * 0.1;
            log.scale.multiplyScalar(logScale);
            return log;
        } catch (error) {
            console.error('Kütük clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Çimen oluştur (GLTF model)
function createGrass() {
    if (loadedAssets.grass && typeof loadedAssets.grass.clone === 'function') {
        try {
            const grass = loadedAssets.grass.clone();
            grass.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = false;
                    node.receiveShadow = true;
                }
            });
            grass.scale.set(2.5, 2.5, 2.5);
            grass.rotation.y = Math.random() * Math.PI * 2;
            const grassScale = 0.8 + Math.random() * 0.4;
            grass.scale.multiplyScalar(grassScale);
            return grass;
        } catch (error) {
            console.error('Çimen clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Çalı oluştur
function createBush() {
    if (loadedAssets.bush) {
        const bush = loadedAssets.bush.clone();
        bush.scale.set(2, 2, 2);
        bush.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        return bush;
    }

    // Fallback
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

// Çiçek oluştur (4 farklı model)
function createFlower() {
    if (loadedAssets.flowers && loadedAssets.flowers.length > 0) {
        try {
            const randomIndex = Math.floor(Math.random() * loadedAssets.flowers.length);
            const selectedFlowerModel = loadedAssets.flowers[randomIndex];

            if (selectedFlowerModel && typeof selectedFlowerModel.clone === 'function') {
                const flower = selectedFlowerModel.clone();

                flower.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = false;
                        node.receiveShadow = true;
                    }
                });

                let baseScale = 4.5;
                if (randomIndex === 3) {
                    baseScale = 1.0;
                }

                flower.scale.set(baseScale, baseScale, baseScale);
                flower.rotation.y = Math.random() * Math.PI * 2;
                const flowerScale = 0.9 + Math.random() * 0.2;
                flower.scale.multiplyScalar(flowerScale);

                return flower;
            }
        } catch (error) {
            console.error('Çiçek clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Mantar oluştur (GLTF model)
function createMushroom() {
    if (window.AB_TEST_CONFIG && window.AB_TEST_CONFIG.DISABLE_MUSHROOMS) {
        return null;
    }

    if (loadedAssets.mushroom && typeof loadedAssets.mushroom.clone === 'function') {
        try {
            const mushroom = loadedAssets.mushroom.clone();

            mushroom.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = false;
                    node.receiveShadow = true;
                }
            });

            mushroom.scale.set(1.5, 1.5, 1.5);
            mushroom.rotation.y = Math.random() * Math.PI * 2;
            const mushroomScale = 0.9 + Math.random() * 0.3;
            mushroom.scale.multiplyScalar(mushroomScale);

            return mushroom;
        } catch (error) {
            console.error('Mantar clone edilirken hata:', error);
            return null;
        }
    }
    return null;
}

// Basit kuş oluştur (fallback)
function createSimpleBird() {
    bird = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.5, metalness: 0.0 })
    );
    body.scale.set(1.1, 0.9, 1.3);
    body.castShadow = true;
    body.receiveShadow = true;
    bird.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0x4a90e2, roughness: 0.5, metalness: 0.0 })
    );
    head.position.set(0, 0.06, 0.04);
    head.castShadow = true;
    bird.add(head);

    const wingMat = new THREE.MeshStandardMaterial({
        color: 0x5dade2,
        roughness: 0.4,
        metalness: 0.0,
        side: THREE.DoubleSide
    });

    const wingL = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.11), wingMat.clone());
    wingL.position.set(-0.07, 0.007, 0);
    wingL.rotation.z = -0.5;
    wingL.rotation.y = -0.3;
    wingL.rotation.x = 0.2;
    wingL.castShadow = true;
    bird.add(wingL);

    const wingR = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.11), wingMat.clone());
    wingR.position.set(0.07, 0.007, 0);
    wingR.rotation.z = 0.5;
    wingR.rotation.y = 0.3;
    wingR.rotation.x = 0.2;
    wingR.castShadow = true;
    bird.add(wingR);

    bird.userData.wingL = wingL;
    bird.userData.wingR = wingR;

    const beak = new THREE.Mesh(
        new THREE.ConeGeometry(0.015, 0.06, 8),
        new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.6 })
    );
    beak.position.set(0, 0.06, 0.08);
    beak.rotation.x = -0.15;
    beak.castShadow = true;
    bird.add(beak);

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
        console.warn('GLTFLoader mevcut değil');
        return;
    }

    // Ağaç modeli
    if (ASSET_MODELS.tree && gltfLoader) {
        console.log('Ağaç modeli yükleniyor:', ASSET_MODELS.tree);

        const alternativeUrls = [
            ASSET_MODELS.tree,
            'https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/models/gltf/Lowpoly_tree_sample.glb',
            'https://cdn.jsdelivr.net/gh/mrdoob/three.js@r128/examples/models/gltf/Lowpoly_tree_sample.glb'
        ];

        function tryLoadTree(urlIndex) {
            if (urlIndex >= alternativeUrls.length) {
                console.warn('Tüm alternatif linkler denendi');
                return;
            }

            const url = alternativeUrls[urlIndex];
            gltfLoader.load(
                url,
                function (gltf) {
                    loadedAssets.tree = gltf.scene;
                    console.log('✅ Ağaç modeli yüklendi!');
                    if (typeof loadedAssets.tree.clone === 'function') {
                        console.log('✅ Model clone edilebilir');
                    }
                    refreshRoadSegments();
                },
                undefined,
                function (error) {
                    console.warn(`❌ Link ${urlIndex + 1} çalışmadı`);
                    tryLoadTree(urlIndex + 1);
                }
            );
        }

        tryLoadTree(0);
    }

    // Çiçek modelleri
    if (ASSET_MODELS.flowers && ASSET_MODELS.flowers.length > 0) {
        let loadedCount = 0;
        const totalFlowers = ASSET_MODELS.flowers.length;

        ASSET_MODELS.flowers.forEach(function (flowerUrl, index) {
            gltfLoader.load(
                flowerUrl,
                function (gltf) {
                    loadedAssets.flowers.push(gltf.scene);
                    loadedCount++;
                    console.log(`✅ Çiçek modeli ${index + 1}/${totalFlowers} yüklendi!`);
                    if (loadedCount === totalFlowers) {
                        console.log('✅ Tüm çiçek modelleri yüklendi!');
                        refreshRoadSegments();
                    }
                },
                undefined,
                function (error) {
                    console.warn(`Çiçek modeli ${index + 1} yüklenemedi`);
                    loadedCount++;
                    if (loadedCount === totalFlowers && loadedAssets.flowers.length > 0) {
                        refreshRoadSegments();
                    }
                }
            );
        });
    }

    // Mantar modeli
    if (ASSET_MODELS.mushroom && !window.AB_TEST_CONFIG.DISABLE_MUSHROOMS) {
        gltfLoader.load(
            ASSET_MODELS.mushroom,
            function (gltf) {
                loadedAssets.mushroom = gltf.scene;
                console.log('✅ Mantar modeli yüklendi!');
                refreshRoadSegments();
            },
            undefined,
            function (error) { console.warn('Mantar modeli yüklenemedi'); }
        );
    }

    // Kütük modeli
    if (ASSET_MODELS.log && !window.AB_TEST_CONFIG.DISABLE_LOGS) {
        gltfLoader.load(
            ASSET_MODELS.log,
            function (gltf) {
                loadedAssets.log = gltf.scene;
                console.log('✅ Kütük modeli yüklendi!');
                refreshRoadSegments();
            },
            undefined,
            function (error) { console.warn('Kütük modeli yüklenemedi'); }
        );
    }

    // Çakıltaşı modeli
    if (ASSET_MODELS.cobblestone) {
        gltfLoader.load(
            ASSET_MODELS.cobblestone,
            function (gltf) {
                loadedAssets.cobblestone = gltf.scene;
                console.log('✅ Çakıltaşı modeli yüklendi!');
                refreshRoadSegments();
            },
            undefined,
            function (error) { console.warn('Çakıltaşı modeli yüklenemedi'); }
        );
    }

    // Çalı modeli
    if (ASSET_MODELS.bush) {
        gltfLoader.load(
            ASSET_MODELS.bush,
            function (gltf) {
                loadedAssets.bush = gltf.scene;
                console.log('Çalı modeli yüklendi!');
            },
            undefined,
            function (error) { console.warn('Çalı modeli yüklenemedi'); }
        );
    }

    // Taş modeli
    if (ASSET_MODELS.stone) {
        gltfLoader.load(
            ASSET_MODELS.stone,
            function (gltf) {
                loadedAssets.stone = gltf.scene;
                console.log('✅ Taş modeli yüklendi!');
                refreshRoadSegments();
            },
            undefined,
            function (error) { console.warn('Taş modeli yüklenemedi'); }
        );
    }

    // Çimen modeli
    if (ASSET_MODELS.grass) {
        gltfLoader.load(
            ASSET_MODELS.grass,
            function (gltf) {
                loadedAssets.grass = gltf.scene;
                console.log('✅ Çimen modeli yüklendi!');
                refreshRoadSegments();
            },
            undefined,
            function (error) { console.warn('Çimen modeli yüklenemedi'); }
        );
    }

    // Başlangıç bulutları
    for (let i = 0; i < 50; i++) {
        createCloud();
    }

    // Hammer modeli
    if (ASSET_MODELS.hammer) {
        gltfLoader.load(
            ASSET_MODELS.hammer,
            function (gltf) {
                loadedAssets.hammer = gltf.scene;
                console.log('✅ Hammer modeli yüklendi!');
            },
            undefined,
            function (error) { console.warn('Hammer modeli yüklenemedi'); }
        );
    }

    // Shield modeli
    if (ASSET_MODELS.shield) {
        gltfLoader.load(
            ASSET_MODELS.shield,
            function (gltf) {
                loadedAssets.shield = gltf.scene;
                console.log('✅ Shield modeli yüklendi!');
            },
            undefined,
            function (error) { console.warn('Shield modeli yüklenemedi'); }
        );
    }
}

// Shield asset oluştur
function createShieldAsset() {
    const group = new THREE.Group();

    const ringGeo = new THREE.TorusGeometry(1.2, 0.2, 8, 24);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x00FFFF, emissive: 0x0088aa, shininess: 100 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const coreGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const coreMat = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8,
        emissive: 0xFFFFFF,
        emissiveIntensity: 0.5
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    group.userData = { type: 'shield', rotSpeed: 2.0 };
    return group;
}

// WallBreaker asset oluştur
function createWallBreakerAsset() {
    const group = new THREE.Group();

    const headGeo = new THREE.BoxGeometry(2, 0.8, 0.8);
    const headMat = new THREE.MeshPhongMaterial({ color: 0xFF4500, metalness: 0.6, roughness: 0.4 });
    const head = new THREE.Mesh(headGeo, headMat);
    group.add(head);

    const handleGeo = new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -1.2;
    group.add(handle);

    group.rotation.z = Math.PI / 4;
    group.userData = { type: 'wallBreaker', rotSpeed: 1.5 };
    return group;
}

// Yol segmentlerini yenile
function refreshRoadSegments() {
    if (roadSegments.length > 0 && (loadedAssets.tree || loadedAssets.stone)) {
        console.log('Modeller yüklendi, segmentler yenileniyor...');
        roadSegments.forEach(r => {
            scene.remove(r.mesh);
            scene.remove(r.left);
            scene.remove(r.right);
            scene.remove(r.lGround);
            scene.remove(r.rGround);
            if (r.decors) r.decors.forEach(d => { if (d) scene.remove(d); });
        });
        roadSegments = [];
        lastRoadZ = 50;
        for (let i = 0; i < 25; i++) {
            createRoadSegment();
        }
    }
}

// 3D sahne başlat
function init3D() {
    const container = document.getElementById('game-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.012);

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

    for (let i = 0; i < 25; i++) {
        createRoadSegment();
    }

    // Kuş modeli yükle
    const loader = new THREE.GLTFLoader();
    const birdModelUrl = 'https://threejs.org/examples/models/gltf/Parrot.glb';

    createSimpleBird();
    let birdMixer = null;

    loader.load(
        birdModelUrl,
        function (gltf) {
            const model = gltf.scene;
            model.scale.set(0.05, 0.05, 0.05);
            model.rotation.y = Math.PI;

            model.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });

            if (gltf.animations && gltf.animations.length > 0) {
                birdMixer = new THREE.AnimationMixer(model);
                gltf.animations.forEach((clip) => {
                    birdMixer.clipAction(clip).play();
                });
                model.userData.mixer = birdMixer;
                console.log('Kuş animasyonları yüklendi:', gltf.animations.length);
            }

            model.userData.wingL = model.getObjectByName('WingL') ||
                model.getObjectByName('wingL') ||
                model.getObjectByName('LeftWing') ||
                model.getObjectByName('leftWing');
            model.userData.wingR = model.getObjectByName('WingR') ||
                model.getObjectByName('wingR') ||
                model.getObjectByName('RightWing') ||
                model.getObjectByName('rightWing');

            if (!model.userData.wingL || !model.userData.wingR) {
                model.traverse(function (child) {
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

            const oldBird = bird;
            scene.remove(oldBird);
            bird = model;
            scene.add(bird);

            console.log('Kuş modeli yüklendi!');
        },
        undefined,
        function (error) {
            console.warn('Kuş modeli yüklenemedi, basit kuş kullanılıyor');
        }
    );

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Yol X pozisyonu (düz yol)
function getRoadX(z) {
    return 0;
}

// Yol segmenti oluştur
function createRoadSegment() {
    const segmentLength = 5;
    const z = lastRoadZ;
    const nextZ = z - segmentLength;
    const x = getRoadX(z);
    const nextX = getRoadX(nextZ);
    const halfWidth = ROAD_WIDTH / 2;
    const y = -3;

    const p1 = new THREE.Vector3(x - halfWidth, y, z);
    const p3 = new THREE.Vector3(nextX - halfWidth, y, nextZ);
    const p2 = new THREE.Vector3(x + halfWidth, y, z);
    const p4 = new THREE.Vector3(nextX + halfWidth, y, nextZ);

    // Yol geometrisi
    const roadGeo = new THREE.BufferGeometry();
    const roadVertices = new Float32Array([
        p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z,
        p2.x, p2.y, p2.z, p4.x, p4.y, p4.z, p3.x, p3.y, p3.z
    ]);
    roadGeo.setAttribute('position', new THREE.BufferAttribute(roadVertices, 3));
    roadGeo.computeVertexNormals();

    const road = new THREE.Mesh(roadGeo, roadMat);
    road.receiveShadow = true;
    scene.add(road);

    const decorMeshes = [];

    // Çakıltaşları
    if (loadedAssets.cobblestone && typeof loadedAssets.cobblestone.clone === 'function') {
        const cobblestoneCountX = Math.ceil(ROAD_WIDTH / 4);
        const cobblestoneCountZ = Math.ceil(segmentLength / 1);

        for (let i = 0; i < cobblestoneCountX; i++) {
            for (let j = 0; j < cobblestoneCountZ; j++) {
                try {
                    const cobblestone = loadedAssets.cobblestone.clone();
                    cobblestone.traverse(function (node) {
                        if (node.isMesh) {
                            node.castShadow = false;
                            node.receiveShadow = true;
                        }
                    });
                    cobblestone.scale.set(2, 2, 2);

                    const offsetX = (i / cobblestoneCountX - 0.5) * ROAD_WIDTH * 0.95;
                    const offsetZ = (j / cobblestoneCountZ - 0.5) * segmentLength * 0.95;
                    const roadCenterX = (x + nextX) / 2;
                    const roadCenterZ = (z + nextZ) / 2;

                    cobblestone.position.x = roadCenterX + offsetX;
                    cobblestone.position.z = roadCenterZ + offsetZ;
                    cobblestone.position.y = y + 0.05;
                    cobblestone.rotation.y = Math.random() * Math.PI * 2;
                    const cobbleScale = 0.9 + Math.random() * 0.2;
                    cobblestone.scale.multiplyScalar(cobbleScale);

                    scene.add(cobblestone);
                    decorMeshes.push(cobblestone);
                } catch (error) {
                    console.error('Çakıltaşı clone edilirken hata:', error);
                }
            }
        }
    }

    // Yan zeminler
    const groundWidth = 120;

    const l_OuterNear = new THREE.Vector3(x - halfWidth - groundWidth, y, z);
    const l_OuterFar = new THREE.Vector3(nextX - halfWidth - groundWidth, y, nextZ);
    const lGeo = new THREE.BufferGeometry();
    const lVertices = new Float32Array([
        l_OuterNear.x, y, z, p1.x, y, z, l_OuterFar.x, y, nextZ,
        p1.x, y, z, p3.x, y, nextZ, l_OuterFar.x, y, nextZ
    ]);
    lGeo.setAttribute('position', new THREE.BufferAttribute(lVertices, 3));
    lGeo.computeVertexNormals();
    const lMesh = new THREE.Mesh(lGeo, groundMat);
    lMesh.receiveShadow = true;
    scene.add(lMesh);

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

    // Ağaçlar
    const treeCount = 1 + Math.floor(Math.random() * 2);
    const minTreeDistance = 20;
    const treePositions = [];
    let attempts = 0;
    let placedTrees = 0;
    const maxAttempts = treeCount * 15;

    while (placedTrees < treeCount && attempts < maxAttempts) {
        attempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 8 + Math.random() * 42;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const treeX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooClose = false;
        for (let j = 0; j < treePositions.length; j++) {
            const existingPos = treePositions[j];
            const distance = Math.sqrt(Math.pow(treeX - existingPos.x, 2) + Math.pow(randZ - existingPos.z, 2));
            if (distance < minTreeDistance) {
                tooClose = true;
                break;
            }
        }
        if (tooClose) continue;

        const tree = createSimpleTree();
        if (tree) {
            tree.position.x = treeX;
            tree.position.z = randZ;
            const treeScale = 0.9 + Math.random() * 0.4;
            tree.scale.multiplyScalar(treeScale);
            tree.rotation.y = Math.random() * Math.PI * 2;

            const box = new THREE.Box3().setFromObject(tree);
            const treeBottom = box.min.y;
            tree.position.y = y - treeBottom + 0.5;

            scene.add(tree);
            decorMeshes.push(tree);
            treePositions.push({ x: treeX, z: randZ });
            placedTrees++;
        }
    }

    // Taşlar
    const stoneCount = Math.random() < 0.5 ? 1 : 0;
    const minStoneDistance = 15;
    const stonePositions = [];
    let stoneAttempts = 0;
    let placedStones = 0;
    const maxStoneAttempts = stoneCount * 10;

    while (placedStones < stoneCount && stoneAttempts < maxStoneAttempts) {
        stoneAttempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 5 + Math.random() * 40;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const stoneX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooCloseToTree = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(Math.pow(stoneX - treePos.x, 2) + Math.pow(randZ - treePos.z, 2));
            if (distance < minStoneDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        if (tooCloseToTree) continue;

        const stone = createStone();
        if (stone) {
            const box = new THREE.Box3().setFromObject(stone);
            const stoneBottom = box.min.y;
            stone.position.x = stoneX;
            stone.position.z = randZ;
            stone.position.y = y - stoneBottom + 0.2;

            scene.add(stone);
            decorMeshes.push(stone);
            stonePositions.push({ x: stoneX, z: randZ });
            placedStones++;
        }
    }

    // Çiçekler
    const flowerCount = 1 + Math.floor(Math.random() * 2);
    const minFlowerDistance = 5;
    const flowerPositions = [];
    let flowerAttempts = 0;
    let placedFlowers = 0;
    const maxFlowerAttempts = flowerCount * 10;

    while (placedFlowers < flowerCount && flowerAttempts < maxFlowerAttempts) {
        flowerAttempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const flowerX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(Math.pow(flowerX - treePos.x, 2) + Math.pow(randZ - treePos.z, 2));
            if (distance < minFlowerDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(Math.pow(flowerX - stonePos.x, 2) + Math.pow(randZ - stonePos.z, 2));
            if (distance < minFlowerDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        const flower = createFlower();
        if (flower) {
            const box = new THREE.Box3().setFromObject(flower);
            const flowerBottom = box.min.y;
            flower.position.x = flowerX;
            flower.position.z = randZ;
            flower.position.y = y - flowerBottom + 0.1;

            scene.add(flower);
            decorMeshes.push(flower);
            flowerPositions.push({ x: flowerX, z: randZ });
            placedFlowers++;
        }
    }

    // Çimenler
    const grassCount = 3 + Math.floor(Math.random() * 3);
    const minGrassDistance = 3;
    let grassAttempts = 0;
    let placedGrass = 0;
    const maxGrassAttempts = grassCount * 10;

    while (placedGrass < grassCount && grassAttempts < maxGrassAttempts) {
        grassAttempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const grassX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(Math.pow(grassX - treePos.x, 2) + Math.pow(randZ - treePos.z, 2));
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(Math.pow(grassX - stonePos.x, 2) + Math.pow(randZ - stonePos.z, 2));
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < flowerPositions.length; j++) {
            const flowerPos = flowerPositions[j];
            const distance = Math.sqrt(Math.pow(grassX - flowerPos.x, 2) + Math.pow(randZ - flowerPos.z, 2));
            if (distance < minGrassDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        const grass = createGrass();
        if (grass) {
            const box = new THREE.Box3().setFromObject(grass);
            const grassBottom = box.min.y;
            grass.position.x = grassX;
            grass.position.z = randZ;
            grass.position.y = y - grassBottom + 0.1;

            scene.add(grass);
            decorMeshes.push(grass);
            placedGrass++;
        }
    }

    // Mantarlar
    const mushroomCount = Math.random() < 0.3 ? 1 : 0;
    const minMushroomDistance = 6;
    const mushroomPositions = [];
    let mushroomAttempts = 0;
    let placedMushrooms = 0;
    const maxMushroomAttempts = mushroomCount * 10;

    while (placedMushrooms < mushroomCount && mushroomAttempts < maxMushroomAttempts) {
        mushroomAttempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 4 + Math.random() * 35;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const mushroomX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooCloseToOther = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(Math.pow(mushroomX - treePos.x, 2) + Math.pow(randZ - treePos.z, 2));
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(Math.pow(mushroomX - stonePos.x, 2) + Math.pow(randZ - stonePos.z, 2));
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        for (let j = 0; j < flowerPositions.length; j++) {
            const flowerPos = flowerPositions[j];
            const distance = Math.sqrt(Math.pow(mushroomX - flowerPos.x, 2) + Math.pow(randZ - flowerPos.z, 2));
            if (distance < minMushroomDistance) {
                tooCloseToOther = true;
                break;
            }
        }
        if (tooCloseToOther) continue;

        const mushroom = createMushroom();
        if (mushroom) {
            const box = new THREE.Box3().setFromObject(mushroom);
            const mushroomBottom = box.min.y;
            mushroom.position.x = mushroomX;
            mushroom.position.z = randZ;
            mushroom.position.y = y - mushroomBottom + 0.1;

            scene.add(mushroom);
            decorMeshes.push(mushroom);
            mushroomPositions.push({ x: mushroomX, z: randZ });
            placedMushrooms++;
        }
    }

    // Kütükler
    const logCount = Math.random() < 0.2 ? 1 : 0;
    const minLogDistance = 18;
    const logPositions = [];
    let logAttempts = 0;
    let placedLogs = 0;
    const maxLogAttempts = logCount * 10;

    while (placedLogs < logCount && logAttempts < maxLogAttempts) {
        logAttempts++;
        const isLeft = Math.random() < 0.5;
        const dist = 5 + Math.random() * 40;
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const logX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);

        let tooCloseToTree = false;
        for (let j = 0; j < treePositions.length; j++) {
            const treePos = treePositions[j];
            const distance = Math.sqrt(Math.pow(logX - treePos.x, 2) + Math.pow(randZ - treePos.z, 2));
            if (distance < minLogDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        if (tooCloseToTree) continue;

        for (let j = 0; j < stonePositions.length; j++) {
            const stonePos = stonePositions[j];
            const distance = Math.sqrt(Math.pow(logX - stonePos.x, 2) + Math.pow(randZ - stonePos.z, 2));
            if (distance < minLogDistance) {
                tooCloseToTree = true;
                break;
            }
        }
        if (tooCloseToTree) continue;

        const log = createLog();
        if (log) {
            const box = new THREE.Box3().setFromObject(log);
            const logBottom = box.min.y;
            log.position.x = logX;
            log.position.z = randZ;
            log.position.y = y - logBottom + 0.2;

            scene.add(log);
            decorMeshes.push(log);
            logPositions.push({ x: logX, z: randZ });
            placedLogs++;
        }
    }

    // Görünmez duvarlar
    const h = 15;
    const lwGeo = new THREE.BufferGeometry();
    const lwVerts = new Float32Array([p1.x, p1.y, p1.z, p3.x, p3.y, p3.z, p1.x, p1.y + h, p1.z, p3.x, p3.y, p3.z, p3.x, p3.y + h, p3.z, p1.x, p1.y + h, p1.z]);
    lwGeo.setAttribute('position', new THREE.BufferAttribute(lwVerts, 3));
    const leftWall = new THREE.Mesh(lwGeo, vWallMat);
    scene.add(leftWall);

    const rwGeo = new THREE.BufferGeometry();
    const rwVerts = new Float32Array([p2.x, p2.y, p2.z, p4.x, p4.y, p4.z, p2.x, p2.y + h, p2.z, p4.x, p4.y, p4.z, p4.x, p4.y + h, p4.z, p2.x, p2.y + h, p2.z]);
    rwGeo.setAttribute('position', new THREE.BufferAttribute(rwVerts, 3));
    const rightWall = new THREE.Mesh(rwGeo, vWallMat);
    scene.add(rightWall);

    roadSegments.push({ mesh: road, left: leftWall, right: rightWall, lGround: lMesh, rGround: rMesh, decors: decorMeshes, z: z });
    lastRoadZ = nextZ;

    // Eski segmentleri temizle
    if (roadSegments.length > 25) {
        const old = roadSegments.shift();

        scene.remove(old.mesh);
        scene.remove(old.left);
        scene.remove(old.right);
        scene.remove(old.lGround);
        scene.remove(old.rGround);

        if (old.decors && old.decors.length > 0) {
            old.decors.forEach(decor => {
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

        if (old.mesh && old.mesh.geometry) old.mesh.geometry.dispose();
        if (old.left && old.left.geometry) old.left.geometry.dispose();
        if (old.right && old.right.geometry) old.right.geometry.dispose();
        if (old.lGround && old.lGround.geometry) old.lGround.geometry.dispose();
        if (old.rGround && old.rGround.geometry) old.rGround.geometry.dispose();
    }
}

// Boru oluştur
function createPipe() {
    const pipeZ = lastPipeZ - PIPE_DISTANCE;
    const roadX = getRoadX(pipeZ);
    const limitX = PLAY_WIDTH - 1.5;
    const randomOffset = (Math.random() * (limitX * 2)) - limitX;
    const randomX = roadX + randomOffset;
    const randomY = Math.random() * 5 + 1;

    const upperPipe = new THREE.Mesh(pipeGeo, pipeMat);
    upperPipe.position.set(randomX, randomY + PIPE_GAP_Y / 2 + 7.5, pipeZ);
    upperPipe.castShadow = true;
    upperPipe.receiveShadow = true;

    const lowerPipe = new THREE.Mesh(pipeGeo, pipeMat);
    lowerPipe.position.set(randomX, randomY - PIPE_GAP_Y / 2 - 7.5, pipeZ);
    lowerPipe.castShadow = true;
    lowerPipe.receiveShadow = true;

    const uCap = new THREE.Mesh(pipeCapGeo, pipeMat);
    uCap.position.set(randomX, randomY + PIPE_GAP_Y / 2 + 0.4, pipeZ);
    uCap.castShadow = true;
    uCap.receiveShadow = true;

    const lCap = new THREE.Mesh(pipeCapGeo, pipeMat);
    lCap.position.set(randomX, randomY - PIPE_GAP_Y / 2 - 0.4, pipeZ);
    lCap.castShadow = true;
    lCap.receiveShadow = true;

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

// Bulut oluştur
function createCloud() {
    const zPos = lastCloudZ - (Math.random() * 15 + 10);
    const xPos = getRoadX(zPos) + (Math.random() * 300 - 150);
    const yPos = 40 + Math.random() * 40;

    const cloudGroup = new THREE.Group();
    cloudGroup.position.set(xPos, yPos, zPos);

    const sizeRoll = Math.random();
    let puffCount, scaleBase;

    if (sizeRoll < 0.4) {
        puffCount = 7; scaleBase = 1.0;
    } else if (sizeRoll < 0.8) {
        puffCount = 15; scaleBase = 1.5;
    } else {
        puffCount = 25; scaleBase = 2.2;
    }

    for (let i = 0; i < puffCount; i++) {
        const mesh = new THREE.Mesh(cloudPuffGeo, cloudMat);

        mesh.position.set(
            (Math.random() - 0.5) * 12 * scaleBase,
            (Math.random() - 0.5) * 5 * scaleBase,
            (Math.random() - 0.5) * 8 * scaleBase
        );

        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        const randScale = 0.6 + Math.random() * 0.8;
        mesh.scale.set(randScale, randScale, randScale);
        mesh.castShadow = false;
        mesh.receiveShadow = false;

        cloudGroup.add(mesh);
    }

    cloudGroup.scale.set(scaleBase, scaleBase, scaleBase);
    scene.add(cloudGroup);
    clouds.push({ mesh: cloudGroup, z: zPos });
    lastCloudZ = zPos;
}

// Power-up oluştur
function createPowerUp() {
    const itemZ = lastPipeZ - 30;
    const roadX = getRoadX(itemZ);
    const limitX = 8.0;
    const randomOffset = (Math.random() * (limitX * 2)) - limitX;
    const itemX = roadX + randomOffset;
    const itemY = Math.random() * 5 + 3;

    const type = Math.random() < 0.5 ? 'shield' : 'wallBreaker';
    let mesh;

    if (type === 'shield') {
        const group = new THREE.Group();
        let modelMesh;
        if (loadedAssets.shield && typeof loadedAssets.shield.clone === 'function') {
            modelMesh = loadedAssets.shield.clone();
            modelMesh.scale.set(1.0, 1.0, 1.0);
        } else {
            modelMesh = new THREE.Mesh(shieldGeo, shieldMat);
        }
        group.add(modelMesh);
        const transparentSphere = new THREE.Mesh(transparentSphereGeo, transparentSphereMat);
        group.add(transparentSphere);
        mesh = group;
    } else {
        const group = new THREE.Group();
        let modelMesh;
        if (loadedAssets.hammer && typeof loadedAssets.hammer.clone === 'function') {
            modelMesh = loadedAssets.hammer.clone();
            modelMesh.scale.set(2.5, 2.5, 2.5);
        } else {
            modelMesh = new THREE.Mesh(wallBreakerGeo, wallBreakerMat);
        }
        group.add(modelMesh);
        const transparentSphere = new THREE.Mesh(transparentSphereGeo, transparentSphereMat);
        group.add(transparentSphere);
        mesh = group;
    }

    mesh.position.set(itemX, itemY, itemZ);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
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
