# Fitur: Lampirkan Link PDF Otomatis pada Pesan WhatsApp

## 💡 Latar Belakang
Saat ini, pesan WhatsApp hanya mengirimkan ringkasan teks. Pelanggan seringkali membutuhkan dokumen resmi (PDF) sebagai lampiran. Karena keterbatasan API WhatsApp Business (non-official), cara terbaik adalah menyertakan **link download/preview PDF** yang disimpan di Google Drive toko.

---

## 🏗️ Alur Teknis (Technical Workflow)

### 1. Backend: Generator PDF (Google Apps Script)
- [ ] **Fungsi `generateQuotationPDF(data)`**:
  - Gunakan `HtmlService` untuk membuat template HTML berdasarkan data Quotation.
  - Gunakan `pdfBlob = htmlContent.getAs('application/pdf')` untuk mengonversi HTML ke PDF.
- [ ] **Penyimpanan di Google Drive**:
  - Simpan Blob PDF ke folder khusus (misal: "PDF_Quotations").
  - Beri nama file sesuai Nomor Quotation: `QT-202604-001.pdf`.
- [ ] **Izin Akses (Sharing)**:
  - Set file permission: `.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)`.
  - Ambil URL-nya: `.getDownloadUrl()` atau `.getWebViewLink()`.
- [ ] **Endpoint API**:
  - Daftarkan aksi `getQuotationPdfLink` di `doPost`.

### 2. Frontend: Integrasi UI (React)
- [ ] **Tombol "Kirim WA" Tingkat Lanjut**:
  - Saat tombol diklik, aplikasi pertama-tama memanggil `api.generatePdfLink(data)`.
  - Munculkan state "Generating PDF..." (Loading).
- [ ] **Konstruksi Pesan**:
  - Setelah link didapat, tambahkan ke teks pesan:
    `Halo, berikut adalah penawaran harga dari {Toko}. \n\n📄 Lihat PDF: {Link_Google_Drive} \n\nTerimakasih.`
- [ ] **Otomatisasi**:
  - Kirim pesan tersebut ke `window.open(waUrl)`.

---

## 📌 Acceptance Criteria
- [ ] File PDF terbuat secara otomatis di Google Drive setiap kali tombol Kirim WA ditekan.
- [ ] Link yang dikirimkan bisa dibuka oleh pelanggan tanpa perlu login ke akun Google (Public Link).
- [ ] Terdapat indikator loading saat sistem sedang menyiapkan dokumen PDF.

---
**Catatan Implementasi**: Fitur ini membutuhkan library `HtmlService` yang kuat di sisi Apps Script agar tampilan PDF konsisten dengan yang ada di layar (CSS-in-JS mungkin perlu dikonversi ke Inline CSS).
