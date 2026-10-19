// Menyalin file web ke folder www/ untuk dibungkus Capacitor menjadi APK.
const fs = require('fs');
const path = require('path');
const WAJIB = ['index.html', 'manifest.json', 'sw.js'];
const OPSIONAL = ['icon-192.png', 'icon-512.png']; // hanya untuk PWA, APK memakai assets/
for (const f of WAJIB) {
  if (!fs.existsSync(f)) { console.error('File tidak ditemukan: ' + f); process.exit(1); }
}
fs.rmSync('www', { recursive: true, force: true });
fs.mkdirSync('www', { recursive: true });
for (const f of WAJIB) fs.copyFileSync(f, path.join('www', f));
for (const f of OPSIONAL) {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join('www', f));
  else console.warn('Peringatan: ' + f + ' tidak ada, dilewati');
}
console.log('www/ siap');
