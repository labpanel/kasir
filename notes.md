# 📋 Catatan Pengembangan — Kasir App

---

## 📗 Panduan Setup Google Spreadsheet (Backend)

Ikuti langkah-langkah ini untuk membuat database menggunakan Google Spreadsheet:

### 1. Buat Spreadsheet Baru
1. Buka [sheets.new](https://sheets.new).
2. Beri nama (misal: "Kasir Database").

### 2. Struktur Sheet & Tabel (Wajib Sama Persis)

Buatlah 5 sheet (tab) dengan nama berikut, lalu isi Baris 1 sebagai Header:

#### 🟢 Sheet: `Products`
Digunakan untuk menyimpan stok barang.
| Kolom | Header (Baris 1) | Contoh Data (Baris 2) |
|---|---|---|
| A | `Code` | `BR001` |
| B | `Name` | `Kertas A4` |
| C | `Category` | `ATK` |
| D | `PurchasePrice` | `50000` |
| E | `SellingPrice` | `65000` |
| F | `Stock` | `100` |

#### 🔵 Sheet: `Customers`
Digunakan untuk data pelanggan.
| Kolom | Header (Baris 1) | Contoh Data (Baris 2) |
|---|---|---|
| A | `Name` | `Budi Santoso` |
| B | `Phone` | `08123456789` |
| C | `Address` | `Jl. Mawar No. 5` |
| D | `Notes` | `Pelanggan Setia` |

#### 🟠 Sheet: `Transactions`
Mencatat riwayat penjualan.
| Kolom | Header (Baris 1) | Isi / Keterangan |
|---|---|---|
| A | `ID` | Transaksi ID (otomatis) |
| B | `Date` | Tanggal |
| C | `Customer` | Nama Pelanggan |
| D | `Total` | Total Harga |
| E | `Items` | List barang (Format JSON) |
| F | `Notes` | Catatan Tambahan |

#### 🟡 Sheet: `Quotations`
Mencatat penawaran harga.
| Kolom | Header (Baris 1) | Isi / Keterangan |
|---|---|---|
| A | `ID` | Quotation ID (otomatis) |
| B | `Date` | Tanggal |
| C | `Customer` | Nama Pelanggan |
| D | `Total` | Total Harga |
| E | `Items` | List barang (Format JSON) |
| F | `Notes` | Catatan Tambahan |

#### 🔴 Sheet: `Users`
Data akun untuk login aplikasi.
| Kolom | Header (Baris 1) | Contoh Data (Baris 2) |
|---|---|---|
| A | `Email` | `admin@gmail.com` |
| B | `Password` | `1234` |
| C | `Role` | `Admin` |
| D | `Name` | `Administrator` |

---

### 3. Pasang Google Apps Script
1. Di Spreadsheet, klik menu **Extensions -> Apps Script**.
2. Hapus semua kode di `Code.gs`.
3. Copy-paste isi file `backend_apps_script.js` ke Apps Script.
4. Klik **Save** (Disket).

### 4. Deployment
1. Klik **Deploy** -> **New Deployment**.
2. Pilih Type: **Web App**.
3. **Execute as**: `Me`.
4. **Who has access**: **Anyone** (Wajib).
5. Copy **Web App URL** yang didapat.

---

## 🖥️ Mode Lokal vs Deploy

### 1. Mode Lokal (Development)
- Jalankan: `npm run dev`
- Edit `api.js`: `const MOCK_MODE = true;` (Jika ingin simulasi tanpa internet).

### 2. Deploy Cloudflare Pages
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **_redirects**: Wajib ada di folder `public` berisi `/* /index.html 200`.

### 3. Deploy GitHub Pages
- **base** di `vite.config.js`: `'/kasir/'` (atau nama repo).
- **Router**: Disarankan `HashRouter` di `App.jsx`.
- **Source**: Pilih `GitHub Actions` di settings repo.

---

## 🔑 Checklist SCRIPT_URL
Pastikan di `src/services/api.js`:
```js
const SCRIPT_URL = 'URL_HASIL_DEPLOY_APPS_SCRIPT_DI_SINI';
const MOCK_MODE = false;
```
