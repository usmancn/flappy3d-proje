# Models Klasörü

Bu klasöre GLTF/GLB formatındaki 3D modellerinizi ekleyin.

## ⚡ Hızlı Kurulum: Ücretsiz Ağaç Modeli

### Adım 1: Model İndir
1. **Pixabay** (Önerilen - Ücretsiz): https://pixabay.com/tr/3d-models/search/tree/
2. Beğendiğiniz bir ağaç modelini seçin
3. "Download" → GLB veya GLTF formatında indirin

### Adım 2: Modeli Buraya Koy
- İndirdiğiniz dosyayı `tree.glb` olarak bu klasöre kaydedin
- Dosya yolu: `models/tree.glb`

### Adım 3: Linki Aktif Et
`js/globals.js` dosyasında:
```javascript
tree: 'models/tree.glb',  // null yerine bu
```

### Adım 4: Test Et
- Sayfayı yenile (Ctrl+F5)
- Console'da "✅ Ağaç modeli yüklendi!" mesajını gör

## 📦 Diğer Ücretsiz Kaynaklar

- **Pixabay**: https://pixabay.com/tr/3d-models/ (Tamamen ücretsiz)
- **Free3D**: https://free3d.com/3d-models/tree (Ücretsiz)
- **Poly Haven**: https://polyhaven.com/models (Ücretsiz, yüksek kalite)

## 🌸 Diğer Modeller

- Çiçek: `models/flower.glb`
- Mantar: `models/mushroom.glb`
- Çalı: `models/bush.glb`
