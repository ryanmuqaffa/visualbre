// Menyalin file web ke folder www/ untuk dibungkus Capacitor menjadi APK.
const fs = require('fs');
const path = require('path');
const FILES = ['index.html', 'manifest.json', 'sw.js', 'icon-192.png', 'icon-512.png'];
for (const f of FILES) {
  if (!fs.existsSync(f)) { console.error('File tidak ditemukan: ' + f); process.exit(1); }
}
fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www', { recursive: true });
for (const f of FILES) fs.copyFileSync(f, path.join('www', f));
console.log('www/ siap');
