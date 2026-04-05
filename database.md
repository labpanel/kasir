# Dokumentasi Skema Database (Google Sheets)

Aplikasi Kasir ini menggunakan **Google Sheets** sebagai basis data (RDBMS). Setiap lembar (Sheet) di dalam file Spreadsheet bertindak sebagai sebuah **Tabel**, dan setiap kolom mewakili sebuah **Field (Atribut)** dari data tersebut.

Berikut adalah rincian skema database yang digunakan saat ini berdasarkan pemetaan yang ada di `backend_apps_script.js`:

---

## 1. Sheet `Products` (Daftar Produk)
Menyimpan keseluruhan inventaris produk atau jasa yang tersedia untuk dijual. Terdapat fitur peringatan stok minimum.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `code` | String | Kode unik / SKU produk / Barcode. |
| **B** | `name` | String | Nama produk. |
| **C** | `category` | String | Kategori produk. |
| **D** | `purchasePrice` | Number | Harga Beli (Harga Modal). |
| **E** | `sellingPrice` | Number | Harga Jual. |
| **F** | `stock` | Number | Stok produk saat ini (Terpotong otomatis saat transaksi). |
| **G** | `minStock` | Number | Batas stok minimum untuk notifikasi peringatan. |
| **H** | `unit` | String | Satuan barang (Misal: Pcs, Kg, Box, dsb). |

---

## 2. Sheet `Transactions` (Riwayat Transaksi)
Menyimpan segala riwayat transaksi (Penjualan / Pembelian) yang berhasil dibayar.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `date` | DateTime | Waktu transaksi dibuat (Format ISO/Locale). |
| **B** | `receiptNo` | String | Nomor unik nota/invoice. |
| **C** | `type` | String | Tipe Transaksi ("Penjualan" / "Pembelian"). |
| **D** | `paymentMethod` | String | Metode pembayaran yang dipakai (Misal: Cash, Transfer). |
| **E** | `customerId` | String | ID/Nomor HP Pelanggan (opsional). |
| **F** | `customerName` | String | Nama target transaksi (Bisa Pelanggan atau Umum). |
| **G** | `items` | JSON String | Daftar riwayat barang yang dibeli pada keranjang (Array Objek). |
| **H** | `subtotal` | Number | Nilai subtotal. |
| **I** | `taxAmount` | Number | Nilai Pajak / PPN nominal. |
| **J** | `grandTotal` | Number | Nilai bersih akhir yang harus di bayarkan. |

---

## 3. Sheet `Quotations` (Penawaran Harga)
Menyimpan rancangan harga yang diajukan ke klien. Berbeda dengan Transaksi, **Quotation tidak memotong angka `stock` pada tabel komoditas `Products`**.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `date` | DateTime | Waktu penawaran dibuat. |
| **B** | `quoNo` | String | Nomor unik referensi dokumen penawaran (Quotation No). |
| **C** | `status` | String | Status pengajuan (Misal: Draft, Sent, Accepted, Rejected). |
| **D** | `customerId` | String | ID/Nomor HP Pelanggan (opsional). |
| **E** | `customerName` | String | Nama Klien/Perusahaan yang dituju. |
| **F** | `items` | JSON String | Daftar barang yang diajukan. |
| **G** | `subtotal` | Number | Nilai subtotal. |
| **H** | `taxAmount` | Number | Nilai Pajak nominal. |
| **I** | `grandTotal` | Number | Total penawaran harga. |
| **J** | `notes` | String | Catatan khusus dari pihak kasir ke klien yang tertera di surat penawaran. |
| **K** | `settings` | JSON String | Konfigurasi tampilan yang dilampirkan (Format Template Quotation). |

---

## 4. Sheet `Customers` (Daftar Pelanggan)
Menyimpan manajemen relasi (CRM) dasar untuk setiap pelanggan.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `phone` | String | Bertindak sebagai ID unik (Primary Entity). |
| **B** | `name` | String | Nama Pelanggan. |
| **C** | `address` | String | Alamat tempat domisili. |
| **D** | `points` | Number | Jumlah poin reward kasir/loyalty point (Bila digunakan). |

---

## 5. Sheet `Suppliers` (Daftar Pemasok)
Digunakan sebagai referensi alamat saat melakukan kulakan atau nota pembelian (`Purchase Order`).

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `phone` | String | Nomor HP/Telepon Sales/Instansi pengirim barang (Primary). |
| **B** | `name` | String | Nama Person-in-Charge (CP). |
| **C** | `company` | String | Nama Perusahaan / Toko Grosir. |
| **D** | `address` | String | Alamat Gudang/Perusahaan. |

---

## 6. Sheet `Users` (Autentikasi Akun)
Menyimpan kredensial staf yang bisa masuk ke aplikasi.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `email` | String | Email Pengguna (sebagai identifier masuk). |
| **B** | `password` | String | Password / Kata sandi (Terkonfigurasi teks biasa/Hash ringan tergantung setup). |
| **C** | `role` | String | Peranan dalam aplikasi (Misal: "Admin", "Staf"). |

---

> **Catatan Alur Backend:** Saat terjadi pemrosesan transaksi berstatus Penjualan di frontend, fungsi `saveTransaction` dari backend secara otomatis akan meloop setiap barang di keranjang dan mencari baris `code` yang bersangkutan pada tabel `Products`, untuk kemudian memperbarui (mengurangi) nilai sel di kolom `F` (`stock`). Namun, aplikasi tidak memiliki tabel riwayat `Stock History` tertulis secara terpisah (Hanya tercatat mutasinya via riwayat transaksi).
