# Perbaikan sesi login

## Perubahan

- Build production selalu memakai `/api` pada origin website. `vercel.json`
  meneruskan permintaan tersebut ke backend Railway yang digunakan production.
  Rewrite API harus berada sebelum fallback SPA, dan respons API tidak di-cache.
- Seluruh pemanggilan API, termasuk form seller dan halaman admin, menggunakan
  konfigurasi terpusat. `VITE_API_URL` tetap digunakan untuk development saja.
- Login dan registrasi memeriksa sesi cookie sebelum menyimpan data pengguna dan
  mengarahkan ke beranda. Sesi yang gagal dibentuk menampilkan pesan pada form.
- Gangguan jaringan, timeout, rate limit, respons gateway yang bukan JSON, dan
  error server tidak menghapus sesi yang tersimpan. Token invalid/expired tetap
  menghapus sesi dan mengarahkan ke login dengan pesan sesi berakhir.
- Pemeriksaan startup dibatalkan saat unmount dan tidak mengganggu form login.
- Backend tidak lagi menghitung login/registrasi sukses sebagai percobaan gagal
  pada limiter autentikasi. Batas percobaan gagal tetap 10 per 15 menit per IP.

## Deploy

1. Deploy folder `SabangKarsa_New` ke project Vercel website yang sudah ada,
   menyertakan `vercel.json`. Perubahan frontend dan rewrite harus dirilis bersama.
   Tidak perlu membeli atau membuat subdomain baru.
2. Backend tetap pada URL Railway yang tercantum di `vercel.json`. Jika backend
   dipindahkan, perbarui tujuan rewrite tersebut. CORS production harus tetap
   mengizinkan `https://sabangkarsa.com` dan `https://www.sabangkarsa.com`.
3. Deploy perubahan `SabangKarsaBE_New/index.js` untuk penyesuaian limiter.
   Perbaikan inti sesi tidak bergantung pada perubahan limiter ini.
4. Pengguna perlu login kembali satu kali: cookie lama milik host Railway tidak
   tersedia sebagai cookie website. Tidak ada migrasi akun atau password.

## Validasi setelah deploy

- `GET https://www.sabangkarsa.com/api/token` tanpa sesi harus memberi JSON 401,
  bukan HTML halaman website.
- Dengan akun uji, respons login harus memasang cookie `token` pada host website,
  tetap HttpOnly dan Secure. Request `/api/token` berikutnya harus membawa cookie
  tersebut dan menghasilkan `{ active: true }`.
- Uji login, reload, logout, dan fitur akun di Safari serta Chrome, termasuk saat
  cookie pihak ketiga diblokir. Cookie tidak perlu dibaca JavaScript.
- Uji respons 503/429 atau jaringan offline: sesi yang tersimpan tidak dihapus.
- Periksa limiter pada log Railway setelah penambahan proxy. Pastikan konfigurasi
  trusted proxy cocok dengan rantai proxy aktual dan IP pengguna tidak tergabung
  menjadi satu IP proxy. Jangan memperluas trust proxy tanpa memverifikasi header
  yang benar-benar diterima oleh backend.

## Pemeriksaan lokal

```sh
npm run test:auth
npm run build
```

Test otomatis memakai respons dan pengguna tiruan; tidak mengakses akun client,
database production, atau melakukan percobaan login ke production. Vite preview
tidak menjalankan rewrite Vercel, sehingga validasi proxy final memerlukan deploy.

Hasil pemeriksaan lokal pada 16 Oktober 2026:

- 22 tes autentikasi lolos; build TypeScript dan Vite production lolos.
- Lint pada modul sesi, App, form login/registrasi, dan form seller lolos.
  Halaman admin memiliki tiga temuan `no-explicit-any` yang juga ada pada HEAD
  sebelum perubahan ini. Build juga masih memberi warning font Poppins dan
  ukuran bundle yang sudah ada sebelumnya.
- Uji browser dengan server fixture lokal: cookie tidak terbentuk menampilkan
  pesan di form; respons sesi 503 menampilkan pesan layanan sementara gagal;
  login valid tetap aktif setelah reload; logout mengembalikan tombol Masuk.
- Belum dideploy dan belum diverifikasi dengan akun asli melalui proxy Vercel.
