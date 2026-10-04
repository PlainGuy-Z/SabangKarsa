# 🔧 Laporan Maintenance SabangKarsa

## Ringkasan

Setelah audit menyeluruh terhadap kode **Backend** (Express/Node.js) dan **Frontend** (React/Vite), ditemukan **13 masalah** yang dikelompokkan menjadi 3 kategori: **KRITIS** (menyebabkan gagal booking), **PENTING**, dan **MINOR**.

---

## 🔴 MASALAH KRITIS — Penyebab Gagal Booking

### BUG #1: Cookie `sameSite: 'strict'` memblokir autentikasi cross-origin (AKAR MASALAH UTAMA)

> [!CAUTION]
> Ini adalah penyebab utama mengapa pemesanan gagal walaupun sudah login.

**File:** [authController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/authController.js#L35-L40) & [authRoutes.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/routes/authRoutes.js#L35-L40)

**Masalah:** Backend di-deploy di domain berbeda (API server) sedangkan frontend di `sabangkarsa.com`. Cookie dikirim dengan `sameSite: 'strict'`, yang berarti **cookie TIDAK akan dikirim pada cross-origin request**. Ketika frontend memanggil API booking dengan `credentials: "include"`, cookie token tidak pernah sampai ke backend, sehingga middleware `verifyToken` mengembalikan `401 - Token tidak ditemukan`.

```javascript
// SEBELUM (SALAH) — di 3 tempat: login, register, google callback
res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',  // ❌ Memblokir cookie pada cross-site request
  maxAge: 24 * 60 * 60 * 1000
});
```

```diff
// SESUDAH (BENAR)
res.cookie('token', token, {
  httpOnly: true,
- secure: process.env.NODE_ENV === 'production',
- sameSite: 'strict',
+ secure: true,
+ sameSite: 'none',  // ✅ Diperlukan untuk cross-origin cookie
  maxAge: 24 * 60 * 60 * 1000
});
```

> [!IMPORTANT]
> `sameSite: 'none'` **wajib** dipasangkan dengan `secure: true`. Perubahan ini perlu dilakukan di **3 tempat**: `authController.js` (login & register) dan `authRoutes.js` (Google OAuth callback).

---

### BUG #2: `CORS_ORIGIN` hanya berisi 1 domain, tidak mencakup domain API

**File:** [index.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/index.js#L33-L41) & [.env](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/.env#L27)

**Masalah:** `CORS_ORIGIN=https://sabangkarsa.com` hanya satu origin. Jika ada variasi domain (www, staging, dll.) request akan diblokir CORS.

```diff
# .env
- CORS_ORIGIN=https://sabangkarsa.com
+ CORS_ORIGIN=https://sabangkarsa.com,https://www.sabangkarsa.com
```

---

### BUG #3: Xendit API digunakan dengan cara yang salah (deprecated API pattern)

**File:** [bookingPenginapanController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/bookingPenginapanController.js#L62-L76) & [paymentController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/paymentController.js#L1-L8)

**Masalah:** Kode menggunakan pola `new Xendit({...})` lalu `new Invoice(...)` yang merupakan **API lama dari `xendit-node` v3**. Versi terbaru `xendit-node` (v4+) menggunakan pola berbeda. Jika package yang terinstall adalah v4+, ini akan **crash saat runtime**.

```javascript
// POLA LAMA (v3) — kemungkinan error
const xendit = new Xendit({ secretKey: '...' });
const { Invoice } = xendit;
const i = new Invoice({});
const invoice = await i.createInvoice({...});

// POLA BARU (v4+) — yang seharusnya digunakan
const { Xendit } = require('xendit-node');
const xenditClient = new Xendit({ secretKey: '...' });
const invoice = await xenditClient.Invoice.createInvoice({...});
```

> [!WARNING]
> Perlu cek `package.json` untuk versi `xendit-node` yang terinstall, lalu sesuaikan kode.

---

### BUG #4: `BookingRentalPage` dan `PesananPage` membaca `token` dari `localStorage` yang tidak pernah di-set

**File:** [BoookingRentalPage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/booking/BoookingRentalPage.tsx#L71-L72) & [PesananPage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/pemesanan/PesananPage.tsx#L66)

**Masalah:** Login menyimpan `user` ke localStorage tapi **tidak pernah menyimpan `token`** (karena token hanya disimpan sebagai httpOnly cookie). Namun, `BookingRentalPage` melakukan:
```javascript
const token = localStorage.getItem('token'); // ❌ Selalu null!
if (!token) throw new Error("Login required");
```

Hal yang sama di `PesananPage.tsx` dan `PemesananPage.tsx`:
```javascript
const token = localStorage.getItem('token'); // ❌ Selalu null!
if (!token) { setError(...); return; }
```

**Fix:** Hapus pengecekan `token` dari localStorage. Cukup gunakan `credentials: "include"` saja dan cek berdasarkan `userData.id`.

---

## 🟠 MASALAH PENTING

### BUG #5: Booking model Penginapan menggunakan field `jumlah_kamar` tapi frontend mengirim dari field schema `jumlahKamarTersedia`

**File:** [Penginapan.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/models/Penginapan.js#L47-L50) vs [bookingPenginapanController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/bookingPenginapanController.js#L37)

**Masalah:** Penginapan model memiliki field `jumlahKamarTersedia`, tapi controller booking mengecek ketersediaan dengan `penginapanData.jumlah_kamar`:
```javascript
if (totalKamarTerbooking + jumlah_kamar > penginapanData.jumlah_kamar) {
  // ❌ penginapanData.jumlah_kamar akan undefined!
```

Seharusnya:
```diff
- if (totalKamarTerbooking + jumlah_kamar > penginapanData.jumlah_kamar) {
+ if (totalKamarTerbooking + jumlah_kamar > penginapanData.jumlahKamarTersedia) {
```

---

### BUG #6: Google OAuth token JWT tidak menyertakan `email` dan `name`

**File:** [authRoutes.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/routes/authRoutes.js#L30-L33)

**Masalah:** Login biasa meng-encode `{ id, role, email, name }` dalam token JWT. Tapi Google OAuth callback hanya encode `{ id, role }`:
```javascript
const token = jwt.sign(
  { id: req.user._id, role: req.user.role }, // ❌ Tidak ada email & name
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
```

Ini menyebabkan `req.user.email` bernilai `undefined` saat booking penginapan (untuk Xendit `payerEmail`), yang bisa menyebabkan error payment.

```diff
const token = jwt.sign(
-  { id: req.user._id, role: req.user.role },
+  { id: req.user._id, role: req.user.role, email: req.user.email, name: req.user.name },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);
```

---

### BUG #7: Rate limiter terlalu ketat — 100 request per 15 menit untuk SEMUA API

**File:** [index.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/index.js#L57-L71)

**Masalah:** Global rate limit 100 request/15 menit per IP terlalu rendah. Satu kali load halaman bisa membuat 5-10 API call. Pengguna bisa kehabisan limit dalam beberapa menit, menyebabkan booking gagal dengan error `429 Too Many Requests`.

```diff
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
- max: 100,
+ max: 500,
  message: { error: 'Terlalu banyak request, coba lagi nanti' }
});
```

---

### BUG #8: `navigate()` dipanggil saat rendering (bukan di effect/callback)

**File:** Semua booking pages ([BookingPenginapanPage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/booking/BookingPenginapanPage.tsx#L19-L25), [BoookingRentalPage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/booking/BoookingRentalPage.tsx#L19-L25), [BookingTourguidePage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/booking/BookingTourguidePage.tsx#L30-L36))

**Masalah:** Memanggil `navigate()` langsung di body component (bukan dalam `useEffect`) menyebabkan React warning dan perilaku tidak konsisten:
```javascript
// ❌ SALAH — navigate dipanggil selama render
if (userData.role !== "buyer") {
  navigate(-1);
}
```

```javascript
// ✅ BENAR — navigate dalam useEffect
useEffect(() => {
  if (userData.role !== "buyer") navigate(-1);
  if (!userData.id) navigate("/login");
}, []);
```

---

## 🟡 MASALAH MINOR

### BUG #9: Logout handler tidak membersihkan `sameSite` cookie dengan benar

**File:** [authController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/authController.js#L86-L93)

Saat `clearCookie`, opsi `sameSite` dan `secure` harus **sama persis** dengan saat cookie di-set, atau cookie tidak akan terhapus.

---

### BUG #10: Nama file typo `BoookingRentalPage.tsx` (3 huruf 'o')

**File:** [BoookingRentalPage.tsx](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsa_New/src/pages/layanan/booking/BoookingRentalPage.tsx)

Nama file memiliki typo (Booooking — tiga 'o'). Sebaiknya di-rename jadi `BookingRentalPage.tsx`.

---

### BUG #11: `BookingPaket` tidak memiliki integrasi payment (Midtrans/Xendit)

**File:** [bookingPaketController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/bookingPaketController.js)

Booking paket wisata tidak memiliki integrasi payment gateway sama sekali — booking langsung disimpan tanpa proses pembayaran.

---

### BUG #12: `BookingPaket` model tidak punya field `status_pembayaran` dan `payment_id`

**File:** [BookingPaket.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/models/BookingPaket.js)

Model ini tidak konsisten dengan model booking lain yang memiliki tracking status pembayaran.

---

### BUG #13: Webhook Xendit mencari `BookingRental` dan `BookingTourGuide` by `_id`, padahal mereka menggunakan `payment_id` custom (bukan MongoDB `_id`)

**File:** [paymentController.js](file:///c:/Users/Azlan/OneDrive/Documents/SabangKarsa/SabangKarsaBE_New/controllers/paymentController.js#L74-L77)

```javascript
// Booking Penginapan: external_id = booking._id ✅ (cocok dengan findById)
// BookingRental: external_id = "ORDER-xxx" ❌ (bukan ObjectId, findById akan gagal)
// BookingTourGuide: external_id = "ORDER-TG-xxx" ❌ (bukan ObjectId, findById akan gagal)

let booking = await Booking.findById(external_id);        // ✅ untuk Penginapan
if (!booking) booking = await BookingRental.findById(external_id);    // ❌ Selalu gagal
if (!booking) booking = await BookingTourGuide.findById(external_id); // ❌ Selalu gagal
```

Untuk Rental & TourGuide, harusnya pakai `findOne({ payment_id: external_id })`.

---

## 📋 Prioritas Perbaikan

| # | Bug | Severity | Impact |
|---|-----|----------|--------|
| 1 | Cookie `sameSite: 'strict'` | 🔴 KRITIS | Semua booking gagal (401) |
| 4 | localStorage `token` null | 🔴 KRITIS | Rental booking & pesanan error |
| 5 | `jumlah_kamar` vs `jumlahKamarTersedia` | 🟠 PENTING | Validasi kamar selalu lolos |
| 3 | Xendit API deprecated | 🟠 PENTING | Payment bisa crash |
| 6 | Google OAuth JWT incomplete | 🟠 PENTING | Booking gagal setelah login Google |
| 13 | Webhook findById salah | 🟠 PENTING | Status Rental/TG tidak update |
| 8 | navigate() di render body | 🟠 PENTING | React error & redirect gagal |
| 7 | Rate limiter ketat | 🟠 PENTING | Users terkena rate limit |
| 2 | CORS single origin | 🟡 MINOR | Hanya masalah jika multi-domain |
| 9 | Logout clearCookie mismatch | 🟡 MINOR | Logout mungkin tidak clear cookie |
| 10 | Typo filename | 🟡 MINOR | Readability |
| 11-12 | BookingPaket no payment | 🟡 MINOR | Fitur belum lengkap |

Apakah Anda ingin saya langsung perbaiki semua bug ini?
