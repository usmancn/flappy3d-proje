// --- DELTA TIME TABANLI AYARLAR ---
const CAMERA_WIDTH = 320;
const CAMERA_HEIGHT = 240;

// Oyun Değişkenleri
let camera, scene, renderer;
let bird, pipes = [];
let roadSegments = [];
let gameActive = false;
let score = 0;
let birdVelocityY = 0;
let targetBirdX = 0;
let lastPipeZ = -20;
let lastRoadZ = 0;

// DELTA TIME için
let lastTime = performance.now();
let deltaTime = 0;
const TARGET_FPS = 60;
const FIXED_TIME_STEP = 1000 / TARGET_FPS; // 16.67ms

// FPS Counter
let frameCount = 0;
let fpsTime = 0;
let currentFPS = 60;

// Fizik sabitleri (saniyede birim olarak) - FLAPPY BIRD TARZI
const GRAVITY = 18.5; // birim/saniye² - Daha hızlı düşüş
const JUMP_STRENGTH = 12.0; // birim/saniye - Net zıplama
const GAME_SPEED = 6.0; // birim/saniye
const MAX_FALL_SPEED = -10.0; // Maksimum düşüş hızı sınırı
const PIPE_DISTANCE = 50;

// Harita Sınırları
const ROAD_WIDTH = 28;
let PLAY_WIDTH = 14.0; // const yerine let yaptık ki değişebilsin

// --- POWER-UP SİSTEMİ ---
let powerUps = [];
let shieldActive = false;
let shieldTimer = 0;
let wallBreakerActive = false;
let wallBreakerTimer = 0;
let originalPlayWidth = 14.0;
const WALL_HEIGHT = 15;
const PIPE_WIDTH = 6;
const PIPE_GAP_Y = 9;

// El Takibi - FLAPPY BIRD TARZI
let isPinching = false;
let lastPinchTime = 0;
const PINCH_COOLDOWN = 200; // Orta seviye cooldown
const PINCH_THRESHOLD = 0.055; // Çimdik hassasiyeti

// Yumuşatma için
let currentBirdOffset = 0;
let cameraCurrentOffset = 0;

// --- BULUT SİSTEMİ DEĞİŞKENLERİ ---
let clouds = [];
let lastCloudZ = 0;

// BULUT PARÇASI GEOMETRİSİ (Pofuduk Küre)
const cloudPuffGeo = new THREE.IcosahedronGeometry(3, 1);

// BULUT MATERYALİ
const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0xAAAAAA,
    roughness: 1.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.85,
    flatShading: false
});

// Zemin Materyali
const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0x3e2723,
    roughness: 1, 
    flatShading: false,
    side: THREE.DoubleSide 
});

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// GLTF Loader (tüm assetler için)
// Not: GLTFLoader index.html'de yükleniyor
let gltfLoader;
if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
    gltfLoader = new THREE.GLTFLoader();
} else {
    console.warn('GLTFLoader yüklenemedi!');
}

// Asset model URL'leri (kendi modellerinizi buraya ekleyebilirsiniz)
// Ücretsiz model kaynakları:
// - Sketchfab: https://sketchfab.com (ücretsiz modeller)
// - Poly Haven: https://polyhaven.com/models
// - Free3D: https://free3d.com
// - TurboSquid: https://www.turbosquid.com (ücretsiz bölümü)
//
// Model dosyalarını 'models/' klasörüne koyun ve linkleri güncelleyin
// Örnek: 'models/tree.glb' veya CDN linki: 'https://example.com/tree.glb'
const ASSET_MODELS = {
    // Ağaç modeli - GLTF linki
    // Ücretsiz ağaç modelleri için:
    // - Sketchfab: https://sketchfab.com (ücretsiz ağaç modelleri)
    // - Poly Haven: https://polyhaven.com/models
    // - Free3D: https://free3d.com
    // - Kenney Assets: https://kenney.nl/assets (ücretsiz)
    // 
    // Not: Ücretsiz çalışan bir model linki bulunamadı
    // Kendi modelinizi eklemek için:
    // 1. Modeli 'models/tree.glb' olarak kaydedin
    // 2. Aşağıdaki satırı değiştirin: tree: 'models/tree.glb'
    //
    // Ağaç modeli - GLTF dosyası
    tree: 'models/tree.glb', // Yerel model dosyası
    stone: 'models/stone.glb', // Taş modeli
    grass: 'models/grass.glb', // Çimen modeli
    // 4 farklı çiçek modeli
    flowers: [
        'models/flowerkirmizi.glb',
        'models/flowermor.glb',
        'models/flowerpembe.glb',
        'models/flowersari.glb' // Bu büyük olan, özel scale gerekli
    ],
    cloud: 'models/Clouds.glb', // Bulut modeli
    mushroom: 'models/Mushrooms.glb', // Mantar modeli
    log: 'models/Log.glb', // Kütük modeli
    cobblestone: 'models/Cobblestone.glb', // Çakıltaşı modeli (yol yüzeyi)
    flower: null, // Eski çiçek modeli (artık kullanılmıyor)
    bush: null // Örnek: 'models/bush.glb' veya CDN linki
};

// Yüklenen asset cache'leri (otomatik doldurulur - GLTF scene objeleri)
const loadedAssets = {
    tree: null, // GLTF scene olarak yüklenecek
    stone: null, // Taş modeli
    grass: null, // Çimen modeli
    flowers: [], // 4 farklı çiçek modeli array'i
    cloud: null, // Bulut modeli
    mushroom: null, // Mantar modeli
    log: null, // Kütük modeli
    cobblestone: null, // Çakıltaşı modeli
    flower: null, // Eski çiçek modeli (artık kullanılmıyor)
    bush: null
};

// --- YOL KENARI ASSET GEOMETRİLERİ (Performanslı) ---
// Ağaç Geometrileri (Detaylı ve Güzel)
const treeTrunkGeo = new THREE.CylinderGeometry(1.2, 1.5, 12, 12); // Gövde (daha detaylı - 12 segment)
const treeCrownGeo = new THREE.ConeGeometry(6, 10, 12); // Ana yaprak kısmı (daha detaylı)
const treeCrownGeo2 = new THREE.ConeGeometry(5, 8, 10); // İkinci katman yapraklar
const treeCrownGeo3 = new THREE.ConeGeometry(4, 6, 8); // Üçüncü katman yapraklar

// Kaya Geometrileri (Basit ama etkili)
const rockGeo = new THREE.DodecahedronGeometry(3, 0); // 12 yüzlü, büyük kaya

// Çalı Geometrileri
const bushGeo = new THREE.SphereGeometry(2.5, 8, 8); // Büyük çalı

// --- ASSET MATERYALLERİ ---
// Ağaç Materyalleri
const treeTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x5d4037, // Kahverengi gövde
    roughness: 0.9,
    metalness: 0.0
});

const treeCrownMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32, // Koyu yeşil yapraklar
    roughness: 0.8,
    metalness: 0.0
});

// Kaya Materyali
const rockMat = new THREE.MeshStandardMaterial({
    color: 0x616161, // Gri kaya
    roughness: 1.0,
    metalness: 0.0
});

// Çalı Materyali
const bushMat = new THREE.MeshStandardMaterial({
    color: 0x388e3c, // Orta yeşil
    roughness: 0.7,
    metalness: 0.0
});

// --- ÇİÇEK VE MANTAR ASSETLERİ ---
// Çiçek Geometrileri
const flowerStemGeo = new THREE.CylinderGeometry(0.1, 0.12, 2, 6); // İnce gövde
const flowerPetalGeo = new THREE.ConeGeometry(0.3, 0.6, 6); // Yaprak şekli
const flowerCenterGeo = new THREE.SphereGeometry(0.15, 8, 8); // Merkez

// Çiçek Materyalleri
const flowerStemMat = new THREE.MeshStandardMaterial({
    color: 0x4caf50, // Yeşil gövde
    roughness: 0.8,
    metalness: 0.0
});

const flowerPetalMat = [
    new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.6 }), // Sarı
    new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.6 }), // Pembe
    new THREE.MeshStandardMaterial({ color: 0x9c27b0, roughness: 0.6 }), // Mor
    new THREE.MeshStandardMaterial({ color: 0xff5722, roughness: 0.6 }), // Turuncu
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })  // Beyaz
];

const flowerCenterMat = new THREE.MeshStandardMaterial({
    color: 0xffc107, // Sarı merkez
    roughness: 0.5,
    metalness: 0.1
});

// Mantar Geometrileri
const mushroomStemGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.5, 8); // Gövde
const mushroomCapGeo = new THREE.SphereGeometry(0.8, 8, 8); // Şapka

// Mantar Materyalleri
const mushroomStemMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Beyaz gövde
    roughness: 0.9,
    metalness: 0.0
});

const mushroomCapMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f, // Kırmızı şapka
    roughness: 0.7,
    metalness: 0.0
});

const mushroomSpotMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Beyaz benekler
    roughness: 0.8,
    metalness: 0.0
});

// --- MARIO TARZI BORU ASSETLERİ ---
// Tuğla Blok Geometrisi
const brickBlockGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);

// Tuğla Materyali (Kırmızı-turuncu)
const brickMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f, // Kırmızı tuğla
    roughness: 0.8,
    metalness: 0.0
});

// Soru Bloku Materyali (Sarı)
const questionBlockMat = new THREE.MeshStandardMaterial({
    color: 0xffd700, // Altın sarısı
    roughness: 0.6,
    metalness: 0.1,
    emissive: 0x444400,
    emissiveIntensity: 0.3
});

// Boru Desen Materyali (Yeşil çizgili)
const pipePatternMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32, // Koyu yeşil
    roughness: 0.7,
    metalness: 0.0
});

// Eski detailPieceGeo (geriye dönük uyumluluk için)
const detailPieceGeo = new THREE.IcosahedronGeometry(0.6, 0);
