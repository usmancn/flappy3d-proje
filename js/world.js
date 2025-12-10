function init3D() {
    const container = document.getElementById('game-container');
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x87CEEB);
            scene.fog = new THREE.FogExp2(0x87CEEB, 0.012);

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
            for(let i=0; i<50; i++) {
        createCloud();
    }

            bird = new THREE.Group();
            const body = new THREE.Mesh(
                new THREE.SphereGeometry(0.7, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 })
            );
            body.castShadow = true;
            bird.add(body);

            const wing = new THREE.Mesh(
                new THREE.BoxGeometry(2.2, 0.1, 0.8),
                new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 })
            );
            wing.castShadow = true;
            bird.add(wing);

            const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
            eyeL.position.set(-0.25, 0.3, 0.5);
            const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
            eyeR.position.set(0.25, 0.3, 0.5);
            bird.add(eyeL);
            bird.add(eyeR);
            scene.add(bird);

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

    // 3. ULTRA SIK ÇİMENLER
    const decorMeshes = []; 
    
    // SIKLIK AYARI: 120 yapıyoruz (Orman gibi olsun)
    const density = 120; 
    
    for(let i=0; i<density; i++) {
        const isLeft = Math.random() < 0.5;
        // Yola çok yakın kısımlara da ot koyuyoruz (0.5 birimden başlasın)
        const dist = 0.5 + Math.random() * 70; 
        const randZ = z - Math.random() * segmentLength;
        const roadXAtZ = getRoadX(randZ);
        const grassX = isLeft ? (roadXAtZ - halfWidth - dist) : (roadXAtZ + halfWidth + dist);
        
        const grass = new THREE.Mesh(grassBladeGeo, grassBladeMat);
        
        // Boyut Varyasyonu: Kısa otlar daha çok olsun
        const scaleY = 0.6 + Math.random() * 1.2; 
        grass.scale.set(1, scaleY, 1);
        
        // Yere oturt
        grass.position.set(grassX, y + (1.75 * scaleY), randZ);
        
        // Doğal dağınıklık
        grass.rotation.y = Math.random() * Math.PI;
        grass.rotation.z = (Math.random() - 0.5) * 0.5; // Biraz daha fazla yatsınlar
        grass.rotation.x = (Math.random() - 0.5) * 0.5;

        scene.add(grass);
        decorMeshes.push(grass);

        // Çiçek Nadirliği: %2 (Çok nadir, yeşilliği bozmasın)
        if (Math.random() < 0.02) {
            const flowerGroup = new THREE.Group();
            const stem = new THREE.Mesh(stemGeo, stemMat);
            stem.position.y = 4; stem.castShadow = true;
            flowerGroup.add(stem);

            const headCenterY = 8;
            const mainColorMat = flowerMaterials[Math.floor(Math.random() * flowerMaterials.length)];
            for(let p=0; p<15; p++) { // Çiçek detayını biraz düşürdük performans için
                const piece = new THREE.Mesh(detailPieceGeo, mainColorMat);
                const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize().multiplyScalar(1.5+Math.random());
                piece.position.set(dir.x, headCenterY + dir.y, dir.z);
                piece.rotation.set(Math.random()*3, Math.random()*3, Math.random()*3);
                flowerGroup.add(piece);
            }
            flowerGroup.position.set(grassX, y + 0.1, randZ);
            flowerGroup.scale.set(1.3, 1.3, 1.3);
            scene.add(flowerGroup);
            decorMeshes.push(flowerGroup);
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

            const pipeMat = new THREE.MeshStandardMaterial({ color: 0x00AA00, roughness: 0.5 });

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

            const capGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 1.8, PIPE_WIDTH / 1.8, 0.5, 16);
            const uCap = new THREE.Mesh(capGeo, pipeMat);
            uCap.position.set(randomX, randomY + PIPE_GAP_Y / 2 + 0.25, pipeZ);
            uCap.castShadow = true;
            uCap.receiveShadow = true;

            const lCap = new THREE.Mesh(capGeo, pipeMat);
            lCap.position.set(randomX, randomY - PIPE_GAP_Y / 2 - 0.25, pipeZ);
            lCap.castShadow = true;
            lCap.receiveShadow = true;

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
