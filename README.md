# Visual Stock

Aplikasi web untuk laporan stok per jetty dan shift. Satu halaman, tanpa server, jalan offline.

## Isi repositori
- `index.html` : aplikasi utama
- `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png` : agar bisa dipasang di layar utama (PWA) dan jalan offline
- `package.json`, `capacitor.config.json`, `build.js`, `assets/`, `debug.keystore` : pembungkus APK Android (Capacitor)
- `.github/workflows/build-apk.yml` : build APK otomatis di GitHub Actions

## Jalankan sebagai web (GitHub Pages)
Settings > Pages > Branch `main`, folder `/ (root)` > Save.
Buka `https://USERNAME.github.io/NAMA-REPO/`, lalu di Chrome pilih menu > **Pasang aplikasi**.
Buka sekali saat online, tutup, lalu buka lagi agar cache offline terisi.

## Build APK
1. Buka tab **Actions** di repositori.
2. Pilih **Build APK** > **Run workflow**.
3. Setelah selesai (sekitar 5-8 menit), unduh artefak **visual-stock-apk** (zip berisi `app-debug.apk`).
4. Ekstrak, kirim APK ke HP, lalu pasang (izinkan "pasang dari sumber tidak dikenal").

APK bertanda tangan debug (`debug.keystore`), cukup untuk dipasang langsung dan diperbarui di atas versi lama.
Untuk Play Store perlu keystore rilis sendiri. Jangan unggah keystore rilis ke repositori publik.

## Debug
Ketuk tulisan kredit di bagian bawah halaman 5 kali, atau buka `index.html?debug`.
Panel menampilkan status offline, service worker, isi cache, dan log error.

## Memperbarui versi
Ubah `VERSION` di `sw.js` (misalnya `v2`) setiap file aplikasi diganti, agar pengguna web melihat tombol "Muat ulang".
Di dalam APK, service worker tidak dipakai: semua file sudah ada di dalam aplikasi.

## Build di komputer sendiri
Butuh Node 20, JDK 17, dan Android SDK:
```
npm install
npm run build
npx cap add android
npx @capacitor/assets generate --android --assetPath assets
npx cap sync android
cp debug.keystore ~/.android/debug.keystore
cd android && ./gradlew assembleDebug
```
APK ada di `android/app/build/outputs/apk/debug/app-debug.apk`.
