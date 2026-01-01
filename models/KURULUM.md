# Ücretsiz Ağaç Modeli Kurulum Rehberi

## Hızlı Çözüm: Pixabay'dan Ücretsiz Model

### 1. Model İndirme
1. Bu linke gidin: https://pixabay.com/tr/3d-models/search/tree/
2. Beğendiğiniz bir ağaç modelini seçin
3. "Download" butonuna tıklayın
4. GLB veya GLTF formatında indirin

### 2. Modeli Projeye Ekleme
1. İndirdiğiniz dosyayı `models/tree.glb` olarak kaydedin
2. `js/globals.js` dosyasında şu satırı bulun:
   ```javascript
   tree: null,
   ```
3. Şu şekilde değiştirin:
   ```javascript
   tree: 'models/tree.glb',
   ```

### 3. Test
- Sayfayı yenileyin (Ctrl+F5)
- Console'da "Ağaç modeli yüklendi!" mesajını kontrol edin

## Alternatif Kaynaklar

- **Pixabay**: https://pixabay.com/tr/3d-models/search/tree/ (Ücretsiz)
- **Free3D**: https://free3d.com/3d-models/tree (Ücretsiz)
- **Poly Haven**: https://polyhaven.com/models (Ücretsiz, yüksek kalite)

## Not
Eğer model GLB/GLTF formatında değilse, Blender veya online converter kullanarak dönüştürebilirsiniz.


