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

#### 🟣 Sheet: `Suppliers` *(BARU)*
Data pemasok / supplier barang.
| Kolom | Header (Baris 1) | Contoh Data (Baris 2) |
|---|---|---|
| A | `Phone` | `08123456789` |
| B | `Name` | `Budi Supplier` |
| C | `Company` | `PT Maju Jaya` |
| D | `Address` | `Jl. Industri No. 10` |

---

### 3. Pasang Google Apps Script
1. Di Spreadsheet, klik menu **Extensions -> Apps Script**.
2. Hapus semua kode di `Code.gs`.
3. Copy-paste isi file `backend_apps_script.js` ke Apps Script.
4. Klik **Save** (Disket).

> **PENTING**: Jika sebelumnya sudah ada script yang berjalan, Anda cukup **menambahkan handler baru** ke bagian `doPost()` dan fungsi bantu di bawahnya. Lihat section berikut.

### 3b. Kode Handler Supplier (tambahkan ke Apps Script)

Tambahkan case-case berikut ke dalam fungsi `doPost()` Anda:

```javascript
// =============================================
// TAMBAHKAN DI DALAM switch(action) di doPost()
// =============================================

case 'getSuppliers':
  return jsonResponse(getSuppliers());

case 'addSupplier':
  return jsonResponse(addSupplier(data));

case 'editSupplier':
  return jsonResponse(editSupplier(data));

case 'deleteSupplier':
  return jsonResponse(deleteSupplier(data));
```

Lalu tambahkan fungsi-fungsi ini di bawah (di luar doPost):

```javascript
// =============================================
// SUPPLIERS CRUD
// =============================================

function getSuppliers() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Suppliers');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var result = [];
  for (var i = 1; i < data.length; i++) {
    result.push({
      phone: data[i][0],
      name: data[i][1],
      company: data[i][2] || '',
      address: data[i][3] || ''
    });
  }
  return result;
}

function addSupplier(d) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Suppliers');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Suppliers');
    sheet.appendRow(['Phone', 'Name', 'Company', 'Address']);
  }
  sheet.appendRow([d.phone, d.name, d.company || '', d.address || '']);
  return { success: true };
}

function editSupplier(d) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Suppliers');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == d.phone) {
      sheet.getRange(i + 1, 2).setValue(d.name);
      sheet.getRange(i + 1, 3).setValue(d.company || '');
      sheet.getRange(i + 1, 4).setValue(d.address || '');
      return { success: true };
    }
  }
  return { success: false, error: 'Supplier not found' };
}

function deleteSupplier(d) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Suppliers');
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == d.phone) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Supplier not found' };
}
```

### 4. Deployment
1. Klik **Deploy** -> **New Deployment**.
2. Pilih Type: **Web App**.
3. **Execute as**: `Me`.
4. **Who has access**: **Anyone** (Wajib).
5. Copy **Web App URL** yang didapat.

> ⚠️ **Setiap kali menambah/mengubah kode Apps Script, HARUS buat New Deployment baru!** Edit deployment lama tidak akan memperbarui kode.

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
- **Router**: Disarankan `HashRouter` di `App.jsx`.   BrowserRouter
- **Source**: Pilih `GitHub Actions` di settings repo.

---

## 🔑 Checklist SCRIPT_URL
Pastikan di `src/services/api.js`:
```js
const SCRIPT_URL = 'URL_HASIL_DEPLOY_APPS_SCRIPT_DI_SINI';
const MOCK_MODE = false;
```

