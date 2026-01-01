// GLOBALS.JS - Global Değişkenler ve Sabitler

// Kamera çözünürlüğü
const CAMERA_WIDTH = 320;
const CAMERA_HEIGHT = 240;

// Three.js temel objeleri
let camera, scene, renderer;
let bird, pipes = [];
let roadSegments = [];
let gameActive = false;
let score = 0;
let birdVelocityY = 0;
let targetBirdX = 0;
let lastPipeZ = -20;
let lastRoadZ = 0;

// Delta time sistemi
let lastTime = performance.now();
let deltaTime = 0;
const TARGET_FPS = 60;
const FIXED_TIME_STEP = 1000 / TARGET_FPS;

// FPS sayacı
let frameCount = 0;
let fpsTime = 0;
let currentFPS = 60;

// Fizik sabitleri
let GRAVITY = 18.5;
let JUMP_STRENGTH = 12.0;
let GAME_SPEED = 7.0;
const MAX_FALL_SPEED = -10.0;
const PIPE_DISTANCE = 50;

// UI durumu
let maxScore = localStorage.getItem('flappy3d_maxScore') || 0;
let useCamera = true;
let isHoveringStart = false;
let hoverStartTime = 0;
const HOVER_REQUIRED_TIME = 800;

// UI hover durumları
let isHoveringCameraToggle = false;
let isHoveringSettingsButton = false;
let isHoveringHowToPlayButton = false;
let isHoveringTutorialCloseBtn = false;

// Slider kontrolü
let activeSlider = null;
let sliderStartValue = 0;
let sliderStartX = 0;

// Sol el duraklatma kontrolü
let isGamePaused = false;
let leftHandOpen = false;
let openHandStartTime = 0;
const OPEN_HAND_RESUME_TIME = 2000;
let lastResumeTime = 0;
const PAUSE_COOLDOWN = 3000;

// Slow motion sistemi (devam ettikten sonra yavaşça hızlanma)
let isSlowMotion = false;
let slowMotionStartTime = 0;
const SLOW_MOTION_DURATION = 2000; // 2 saniye
const SLOW_MOTION_MIN_SPEED = 0.2; // Başlangıç hızı (%20)

// Kamera önizleme
let showCameraPreview = true;

// Harita sınırları
const ROAD_WIDTH = 28;
let PLAY_WIDTH = 14.0;

// Power-up sistemi
let powerUps = [];
let shieldActive = false;
let shieldTimer = 0;
let wallBreakerActive = false;
let wallBreakerTimer = 0;
let originalPlayWidth = 14.0;

// Boru boyutları
const WALL_HEIGHT = 15;
const PIPE_WIDTH = 6;
const PIPE_GAP_Y = 9;

// Pinch algılama
let isPinching = false;
let lastPinchTime = 0;
const PINCH_COOLDOWN = 200;
const PINCH_THRESHOLD = 0.04;

// Hareket yumuşatma
let currentBirdOffset = 0;
let cameraCurrentOffset = 0;

// Bulut sistemi
let clouds = [];
let lastCloudZ = 0;

// Bulut geometri ve materyali (paylaşımlı)
const cloudPuffGeo = new THREE.IcosahedronGeometry(3, 1);
const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    emissive: 0xAAAAAA,
    roughness: 1.0,
    metalness: 0.0,
    transparent: true,
    opacity: 0.85,
    flatShading: false
});

// Zemin ve yol materyalleri (paylaşımlı)
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x3e2723,
    roughness: 1,
    flatShading: false,
    side: THREE.DoubleSide
});

const roadMat = new THREE.MeshStandardMaterial({
    color: 0x4e342e,
    roughness: 1.0,
    side: THREE.DoubleSide
});

// Boru geometri ve materyalleri (paylaşımlı)
const pipeGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 2, PIPE_WIDTH / 2, 15, 16);
const pipeCapGeo = new THREE.CylinderGeometry(PIPE_WIDTH / 1.6, PIPE_WIDTH / 1.6, 0.8, 16);
const pipeMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32,
    roughness: 0.6,
    metalness: 0.0
});

// Görünmez duvar materyali
const vWallGeo = new THREE.PlaneGeometry(ROAD_WIDTH * 1.5, 30);
const vWallMat = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide
});

// Power-up geometri ve materyalleri (paylaşımlı)
const shieldGeo = new THREE.SphereGeometry(1.5, 32, 32);
const shieldMat = new THREE.MeshPhongMaterial({
    color: 0x00BFFF,
    emissive: 0x0000AA,
    shininess: 100,
    transparent: true,
    opacity: 0.9
});

const wallBreakerGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
const wallBreakerMat = new THREE.MeshPhongMaterial({
    color: 0xFF0000,
    emissive: 0xFF4500,
    shininess: 100
});

const transparentSphereGeo = new THREE.SphereGeometry(2.0, 16, 16);
const transparentSphereMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
});

// Texture ve GLTF loader
const textureLoader = new THREE.TextureLoader();
let gltfLoader;
if (typeof THREE !== 'undefined' && THREE.GLTFLoader) {
    gltfLoader = new THREE.GLTFLoader();
} else {
    console.warn('GLTFLoader yüklenemedi!');
}

// Asset model URL'leri
const ASSET_MODELS = {
    tree: 'models/tree.glb',
    stone: 'models/stone.glb',
    grass: 'models/grass.glb',
    flowers: [
        'models/flowerkirmizi.glb',
        'models/flowermor.glb',
        'models/flowerpembe.glb',
        'models/flowersari.glb'
    ],
    cloud: 'models/Clouds.glb',
    mushroom: 'models/Mushrooms.glb',
    log: 'models/Log.glb',
    cobblestone: 'models/Cobblestone.glb',
    flower: null,
    bush: null,
    hammer: 'models/Hammer.glb',
    shield: 'models/Shield.glb'
};

// Yüklenen asset cache'leri
const loadedAssets = {
    tree: null,
    stone: null,
    grass: null,
    flowers: [],
    cloud: null,
    mushroom: null,
    log: null,
    cobblestone: null,
    flower: null,
    bush: null,
    hammer: null,
    shield: null
};

// Ağaç geometrileri
const treeTrunkGeo = new THREE.CylinderGeometry(1.2, 1.5, 12, 12);
const treeCrownGeo = new THREE.ConeGeometry(6, 10, 12);
const treeCrownGeo2 = new THREE.ConeGeometry(5, 8, 10);
const treeCrownGeo3 = new THREE.ConeGeometry(4, 6, 8);

// Kaya ve çalı geometrileri
const rockGeo = new THREE.DodecahedronGeometry(3, 0);
const bushGeo = new THREE.SphereGeometry(2.5, 8, 8);

// Ağaç materyalleri
const treeTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x5d4037,
    roughness: 0.9,
    metalness: 0.0
});

const treeCrownMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32,
    roughness: 0.8,
    metalness: 0.0
});

// Kaya ve çalı materyalleri
const rockMat = new THREE.MeshStandardMaterial({
    color: 0x616161,
    roughness: 1.0,
    metalness: 0.0
});

const bushMat = new THREE.MeshStandardMaterial({
    color: 0x388e3c,
    roughness: 0.7,
    metalness: 0.0
});

// Çiçek geometrileri
const flowerStemGeo = new THREE.CylinderGeometry(0.1, 0.12, 2, 6);
const flowerPetalGeo = new THREE.ConeGeometry(0.3, 0.6, 6);
const flowerCenterGeo = new THREE.SphereGeometry(0.15, 8, 8);

// Çiçek materyalleri
const flowerStemMat = new THREE.MeshStandardMaterial({
    color: 0x4caf50,
    roughness: 0.8,
    metalness: 0.0
});

const flowerPetalMat = [
    new THREE.MeshStandardMaterial({ color: 0xffeb3b, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: 0x9c27b0, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: 0xff5722, roughness: 0.6 }),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
];

const flowerCenterMat = new THREE.MeshStandardMaterial({
    color: 0xffc107,
    roughness: 0.5,
    metalness: 0.1
});

// Mantar geometrileri
const mushroomStemGeo = new THREE.CylinderGeometry(0.3, 0.35, 1.5, 8);
const mushroomCapGeo = new THREE.SphereGeometry(0.8, 8, 8);

// Mantar materyalleri
const mushroomStemMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0.0
});

const mushroomCapMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    roughness: 0.7,
    metalness: 0.0
});

const mushroomSpotMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.0
});

// Tuğla blok geometrisi ve materyalleri
const brickBlockGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);

const brickMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f,
    roughness: 0.8,
    metalness: 0.0
});

const questionBlockMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.6,
    metalness: 0.1,
    emissive: 0x444400,
    emissiveIntensity: 0.3
});

const pipePatternMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32,
    roughness: 0.7,
    metalness: 0.0
});

const detailPieceGeo = new THREE.IcosahedronGeometry(0.6, 0);
