# Dokumentasi Skema Database (Google Sheets)

Aplikasi Kasir ini menggunakan **Google Sheets** sebagai basis data (RDBMS). Setiap lembar (Sheet) di dalam file Spreadsheet bertindak sebagai sebuah **Tabel**, dan setiap kolom mewakili sebuah **Field (Atribut)** dari data tersebut.

Berikut adalah rincian skema database yang telah dirampingkan untuk efisiensi penggunaan:

---

## 1. Sheet `Products` (Daftar Produk)
Menyimpan keseluruhan inventaris produk atau jasa yang tersedia untuk dijual.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `code` | String | Kode unik / SKU produk / Barcode (Primary Key). |
| **B** | `name` | String | Nama produk. |
| **C** | `category` | String | Kategori produk. |
| **D** | `purchasePrice` | Number | Harga Beli (Harga Modal). |
| **E** | `sellingPrice` | Number | Harga Jual. |
| **F** | `stock` | Number | Stok produk saat ini (Terpotong otomatis saat penjualan, bertambah saat pembelian). |

---

## 2. Sheet `Transactions` (Riwayat Transaksi)
Menyimpan segala riwayat transaksi (Penjualan / Pembelian). Kolom Nama Partner otomatis menyesuaikan apakah itu Pelanggan (Penjualan) atau Supplier (Pembelian).

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `date` | DateTime | Waktu transaksi dibuat (Format ISO). |
| **B** | `receiptNo` | String | Nomor unik nota/invoice (Primary Key). |
| **C** | `type` | String | Tipe Transaksi (`Penjualan` / `Pembelian`). |
| **D** | `paymentMethod` | String | Metode pembayaran (`Cash`, `Transfer`, `QRIS`, dll). |
| **E** | `partnerId` | String | ID/Nomor HP partner terkait (Pelanggan atau Supplier). |
| **F** | `partnerName` | String | Nama partner terkait (Pelanggan atau Supplier). |
| **G** | `items` | JSON String | Daftar riwayat barang (Array Objek: `code`, `name`, `qty`, `price`). |
| **H** | `subtotal` | Number | Nilai subtotal sebelum pajak. |
| **I** | `taxAmount` | Number | Nilai Pajak / PPN nominal. |
| **J** | `grandTotal` | Number | Total nilai transaksi akhir. |
| **K** | `pdfLink` | String | URL file PDF di Google Drive. |

---

## 3. Sheet `Quotations` (Penawaran Harga)
Menyimpan rancangan harga yang diajukan ke klien.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `date` | DateTime | Waktu penawaran dibuat (Format ISO). |
| **B** | `quoNo` | String | Nomor unik referensi dokumen penawaran (Primary Key). |
| **C** | `status` | String | Status (`Menunggu`, `Disetujui`, `Ditolak`). |
| **D** | `customerId` | String | ID/Nomor HP Pelanggan. |
| **E** | `customerName` | String | Nama Pelanggan. |
| **F** | `items` | JSON String | Daftar barang yang diajukan (Array Objek). |
| **G** | `subtotal` | Number | Nilai subtotal sebelum pajak. |
| **H** | `taxAmount` | Number | Nilai Pajak nominal. |
| **I** | `grandTotal` | Number | Total penawaran harga. |
| **J** | `notes` | String | Catatan khusus ke klien. |
| **K** | `settings` | JSON String | Konfigurasi tampilan/template yang digunakan. |
| **L** | `pdfLink` | String | URL file PDF di Google Drive. |

---

## 4. Sheet `Customers` (Daftar Pelanggan)
Menyimpan manajemen relasi (CRM) dasar untuk setiap pelanggan.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `phone` | String | Nomor HP sebagai ID unik (Primary Key). |
| **B** | `name` | String | Nama Pelanggan. |
| **C** | `address` | String | Alamat lengkap pelanggan. |

---

## 5. Sheet `Suppliers` (Daftar Pemasok)
Digunakan sebagai referensi alamat saat melakukan kulakan atau nota pembelian (`Purchase Order`).

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `phone` | String | Nomor HP sebagai ID unik (Primary Key). |
| **B** | `name` | String | Nama Person-in-Charge (CP). |
| **C** | `company` | String | Nama Perusahaan / Toko Grosir. |
| **D** | `address` | String | Alamat Gudang/Perusahaan. |

---

## 6. Sheet `Users` (Autentikasi Akun)
Menyimpan kredensial staf yang bisa masuk ke aplikasi.

| Kolom | Nama Field | Tipe Data | Deskripsi |
| :---: | :--- | :--- | :--- |
| **A** | `email` | String | Email Pengguna (Primary Key). |
| **B** | `password` | String | Password / Kata sandi. |
| **C** | `role` | String | Peranan (`Admin` / `Pegawai`). |
| **D** | `name` | String | Nama lengkap pengguna. |

---

## Ringkasan Jumlah Kolom Per Sheet

| Sheet | Jumlah Kolom | Header Kolom (Baris 1) |
| :--- | :---: | :--- |
| **Products** | 6 | `code`, `name`, `category`, `purchasePrice`, `sellingPrice`, `stock` |
| **Transactions** | 11 | `date`, `receiptNo`, `type`, `paymentMethod`, `partnerId`, `partnerName`, `items`, `subtotal`, `taxAmount`, `grandTotal`, `pdfLink` |
| **Quotations** | 12 | `date`, `quoNo`, `status`, `customerId`, `customerName`, `items`, `subtotal`, `taxAmount`, `grandTotal`, `notes`, `settings`, `pdfLink` |
| **Customers** | 3 | `phone`, `name`, `address` |
| **Suppliers** | 4 | `phone`, `name`, `company`, `address` |
| **Users** | 4 | `email`, `password`, `role`, `name` |
