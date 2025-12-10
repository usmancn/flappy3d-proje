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

// Çimen geometri/mat
const grassBladeGeo = new THREE.CylinderGeometry(0.0, 0.5, 3.5, 3);
const grassBladeMat = new THREE.MeshStandardMaterial({
    color: 0x228B22,
    roughness: 1,
    flatShading: true 
});

// Çiçek gövdesi ve başı
const stemGeo = new THREE.CylinderGeometry(0.2, 0.25, 8, 8);
const stemMat = new THREE.MeshStandardMaterial({ 
    color: 0x4A6B3C,
    roughness: 0.9
});

const detailPieceGeo = new THREE.IcosahedronGeometry(0.6, 0); 

const flowerColors = [0xFFD700, 0xFFFFFF, 0xFF4500, 0xDA70D6, 0xDC143C];
const flowerMaterials = flowerColors.map(c => new THREE.MeshStandardMaterial({ 
    color: c,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true
}));
