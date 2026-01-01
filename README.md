# 🐦 3D Flappy Bird

El hareketleri ile kontrol edilen, Three.js tabanlı 3D Flappy Bird oyunu.

![Game Preview](https://img.shields.io/badge/Platform-Web-blue)
![Tech](https://img.shields.io/badge/Three.js-r128-green)
![Control](https://img.shields.io/badge/Control-Hand%20Gestures-orange)

## 🎮 Oyun Hakkında

MediaPipe Hand Tracking kullanarak el hareketlerinizle kontrol edebildiğiniz 3D bir Flappy Bird oyunudur. Kamera üzerinden el hareketlerinizi algılayarak kuşu yönlendirebilirsiniz.

## ✨ Özellikler

- 🎯 **El Hareket Kontrolü**: MediaPipe ile gerçek zamanlı el takibi
- 🌍 **3D Grafik**: Three.js ile oluşturulmuş 3D oyun dünyası
- ⚙️ **Özelleştirilebilir Ayarlar**: Yerçekimi, hız ve zıplama gücü ayarları
- 🛡️ **Güç Artırımları**: Kalkan ve duvar kırıcı power-up'ları
- ⏸️ **Jest ile Duraklat/Devam**: Sol el yumruk ile duraklat, açık el ile devam
- 🖱️ **Fare Modu**: Kamera kullanmadan fare ile de oynanabilir

## 🎮 Kontroller

| Hareket | Açıklama |
|---------|----------|
| 👌 Sağ El Pinch | Kuşu zıplat |
| 👆 İşaret Parmağı | Sola/sağa hareket |
| ✊ Sol El Yumruk | Oyunu duraklat |
| 🖐️ Sol El Açık (2sn) | Oyuna devam et |

## 🛠️ Kullanılan Teknolojiler

- **[Three.js](https://threejs.org/)** - 3D grafik kütüphanesi
- **[MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands.html)** - El takip sistemi
- **HTML5 / CSS3 / JavaScript** - Frontend teknolojileri
- **GLTF/GLB** - 3D model formatı

## 🚀 Kurulum ve Çalıştırma

### Yerel Sunucu ile Çalıştırma

Tarayıcı güvenlik kısıtlamaları nedeniyle, oyunu yerel bir sunucu üzerinden çalıştırmanız gerekmektedir.

#### Python ile:
```bash
# Python 3
python -m http.server 8080

# Tarayıcıda aç
# http://localhost:8080
```

#### Node.js ile:
```bash
# http-server kurulumu (bir kez)
npm install -g http-server

# Sunucuyu başlat
http-server -p 8080

# Tarayıcıda aç
# http://localhost:8080
```

#### VS Code ile:
1. "Live Server" eklentisini yükleyin
2. `index.html` dosyasına sağ tıklayın
3. "Open with Live Server" seçin

### Gereksinimler

- Modern web tarayıcısı (Chrome, Firefox, Edge)
- Webcam (el hareket kontrolü için)
- HTTPS veya localhost (kamera erişimi için gerekli)

## 📁 Proje Yapısı

```
flopi3/
├── index.html          # Ana HTML dosyası
├── style.css           # CSS stilleri
├── js/
│   ├── globals.js      # Global değişkenler ve ayarlar
│   ├── world.js        # 3D dünya ve sahne yönetimi
│   ├── gameLogic.js    # Oyun mantığı ve çarpışma kontrolü
│   ├── input.js        # El takibi ve girdi işleme
│   ├── loop.js         # Oyun döngüsü
│   └── boot.js         # Başlatma scripti
└── models/             # 3D modeller (GLB formatında)
    ├── tree.glb
    ├── stone.glb
    ├── grass.glb
    └── ...
```

## 🎯 Nasıl Oynanır

1. Oyunu tarayıcınızda açın
2. Kamera erişimine izin verin
3. "BAŞLAMAK İÇİN BURADAYIM" alanına imleci getirin ve bekleyin
4. Sağ elinizle pinch yaparak kuşu zıplatın
5. Engellerden kaçının ve 30 puana ulaşarak kazanın!

## ⚙️ Ayarlar

Oyun başlangıç ekranındaki **⚙ Ayarlar** butonundan şunları değiştirebilirsiniz:

- **Yerçekimi**: 10 - 30 arası (varsayılan: 18.5)
- **Oyun Hızı**: 3 - 15 arası (varsayılan: 7.0)
- **Zıplama Gücü**: 8 - 20 arası (varsayılan: 12.0)

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Katkıda bulunmak için pull request gönderebilirsiniz.

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
