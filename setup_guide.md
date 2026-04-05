# Panduan Instalasi & Menjalankan Aplikasi Kasir

Dokumen ini adalah panduan langkah demi langkah (step-by-step) mulai dari melakukan kloning repository (mengunduh kode sumber) hingga aplikasi bisa berjalan di komputer Anda sendiri secara penuh (Klien & Server).

---

## TAHAP 1: Kloning & Persiapan Frontend (Lokal)

Aplikasi ini menggunakan ekosistem Node.js (Vite + React). Pastikan Anda sudah menginstal **Node.js** di komputer Anda.

**1. Kloning Repository**
Buka Terminal / Command Prompt Anda dan jalankan perintah berikut:
```bash
git clone https://github.com/username/kasir.git
cd kasir
```
*(Catatan: Sesuaikan URL Github di atas dengan URL reponya Jika sudah berada dalam mode Private/Organisasi)*

**2. Instalasi Dependensi (Package)**
Unduh semua pustaka pendukung (library seperti React, TailwindCSS, Zustand) dengan menjalankan:
```bash
npm install
```

---

## TAHAP 2: Pembuatan Database Google Sheets (Backend)

Karena aplikasi ini bersifat _Serverless_, backend dan database berada di infrastruktur Google Workspace.

**1. Buat Spreadsheet Baru**
- Buka [Google Sheets](https://sheets.new/) dan buat Spreadsheet kosong baru.
- Beri nama spreadsheet (misal: "Database Kasir").

**2. Siapkan Tabel Lembar Kerja (Sheets)**
Ubah nama tab terbawah (Sheet1) dan tambahkan tab baru hingga Anda memiliki **6 Sheet (Lembar Kerja)** dengan nama **PERSIS** berikut (perhatikan huruf kapital):
1. `Products`
2. `Transactions`
3. `Quotations`
4. `Customers`
5. `Suppliers`
6. `Users`

**3. Pembuatan Header Kolom (Wajib)**
Buka setiap _sheet_ dan tuliskan struktur kolom berikut (**Hanya di Baris ke 1 / Row 1**):
- **Products**: (A) `code`, (B) `name`, (C) `category`, (D) `purchasePrice`, (E) `sellingPrice`, (F) `stock`, (G) `minStock`, (H) `unit`
- **Transactions**: (A) `date`, (B) `receiptNo`, (C) `type`, (D) `paymentMethod`, (E) `customerId`, (F) `customerName`, (G) `items`, (H) `subtotal`, (I) `taxAmount`, (J) `grandTotal`
- **Quotations**: (A) `date`, (B) `quoNo`, (C) `status`, (D) `customerId`, (E) `customerName`, (F) `items`, (G) `subtotal`, (H) `taxAmount`, (I) `grandTotal`, (J) `notes`, (K) `settings`
- **Customers**: (A) `phone`, (B) `name`, (C) `address`, (D) `points`
- **Suppliers**: (A) `phone`, (B) `name`, (C) `company`, (D) `address`
- **Users**: (A) `email`, (B) `password`, (C) `role`

*(Jika Anda ingin memiliki user admin, silakan isikan email dan kata sandi Anda langsung di baris kedua pada sheet `Users`)*.

---

## TAHAP 3: Pemasangan Google Apps Script

**1. Salin Kode Backend**
Buka kode aplikasi kita dari Visual Studio Code, lalu cari file **`backend_apps_script.js`**. **Buka, lalu Copy (Salin)** seluruh isinya dari baris pertama hingga baris paling akhir.

**2. Terapkan di Apps Script**
- Kembali ke jendela Google Sheets Anda tadi.
- Pada menu di paling atas, Klik tab **Ektensi (Extensions) > Apps Script**.
- Akan terbuka sebuah Text Editor online bernama `Code.gs`.
- Hapus template kode bawaan, lalu **Paste (Tempel)** isi dari `backend_apps_script.js` yang baru Anda salin.
- Simpan dengan menekan logo disket atau menekan **Ctrl+S**.

**3. Penerapan Akses API (Deployment)**
- Setelah tersimpan, tekan tombol biru **Terapkan (Deploy)** di ujung kanan atas, pilih **Deployment Baru (New deployment)**.
- Tekan roda gigi (Select type) dan pastikan mencentang **Aplikasi Web (Web App)**.
- Isi Formulirnya:
  - Deskripsi: Bebas diisi (misal: "Init API V1")
  - Jalankan sebagai (Execute as): **SAYA (Me)**
  - Siapa yang memiliki akses (Who has access): **Semua Orang (Anyone)** _<- Sangat penting agar aplikasi react bisa tersambung._
- Tekan **Terapkan (Deploy)**. Google mungkin akan meminta otorisasi akun (Advanced > Lanjutkan/Unsafe), ikuti saja dan berikan izin agar web app dapat membaca Google Drive & Sheets Anda.
- Setelah berhasil, Google akan memberikan **URL Aplikasi Web (Web App URL)**.  **SALIN (COPY) URL PANJANG TERSEBUT**. (URL akan berakhiran `/exec`).

---

## TAHAP 4: Sinkronisasi Backend & Frontend

Frontend lokal yang tadi kita pasang belum tahu di mana database barunya berada.

**1. Ganti Endpoint URL**
- Buka Visual Studio Code yang memuat project React Anda.
- Buka file **`src/services/api.js`**.
- Pada baris paling pertama (`Line 1`), Anda akan menemukan baris:
  ```javascript
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
  ```
- **Hapus alamat web lama di dalam tanda petik**, lalu **Paste / Tempelkan** URL Aplikasi Web (`Web App URL`) Anda yang telah disalin dari langkah TAHAP 3.

---

## TAHAP 5: Menjalankan Aplikasi Web

Semuanya sudah siap! Sekarang waktunya menyalakan aplikasi di browser lokal Anda.

**1. Nyalakan Development Server**
Buka kembali Terminal Visual Studio Code Anda, lalu jalankan:
```bash
npm run dev
```

**2. Buka di Browser Lokal**
Terminal akan memberitahu Anda sebuah tautan `localhost` (biasanya `http://localhost:5173/`). Buka link tersebut di Google Chrome atau web browser pilihan Anda.

✨ **Selamat! Anda berhasil menjalankan program Kasir!** ✨

> **Tambahan (Mock Mode):**
> Jika Anda dalam kondisi luring (tanpa koneksi internet) dan sedang ingin men-debug desain atau UI halaman aplikasi, Anda dapat ke file `src/services/api.js` dan ubah variabel `const MOCK_MODE = false;` menjadi `const MOCK_MODE = true;`. Dalam mode ini, frontend *TIDAK AKAN* mengirim data ke Google Sheets, dan hanya bekerja sebatas simulasi di memori lokal.
