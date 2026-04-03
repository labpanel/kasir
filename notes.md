# 📋 Catatan Pengembangan — Kasir App

## Perbedaan Penggunaan Lokal vs Deploy di Cloudflare Pages

---

## 🖥️ Mode Lokal (Development)

### Cara Menjalankan
```bash
npm run dev
```
Akses di: `http://localhost:5173`

### Konfigurasi `vite.config.js`
```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base: TIDAK perlu diset, default '/'
})
```

### Konfigurasi Router (`App.jsx`)
```jsx
// Gunakan BrowserRouter untuk URL yang bersih
import { BrowserRouter as Router } from 'react-router-dom';
```

### Konfigurasi `api.js`
| Setting | Nilai | Keterangan |
|---|---|---|
| `MOCK_MODE` | `true` | Autentikasi lokal, tanpa Google Sheets |
| `MOCK_MODE` | `false` | Terhubung ke Google Apps Script |

### Akun Login (Mode Lokal / MOCK_MODE = true)
| Email | Password | Role |
|---|---|---|
| `admin@gmail.com` | `1234` | Admin |
| `kasir@gmail.com` | `1234` | Pegawai |

---

## ☁️ Deploy di Cloudflare Pages

### Cara Build
```bash
npm run build
# Output ada di folder: dist/
```

### Setup di Cloudflare Pages Dashboard
1. Buka [pages.cloudflare.com](https://pages.cloudflare.com)
2. Klik **Create a project → Connect to Git**
3. Pilih repo `labpanel/kasir`
4. Isi pengaturan build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node.js version**: `20`

### Konfigurasi `vite.config.js`
```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Cloudflare Pages pakai domain sendiri, base tetap '/'
})
```

> [!NOTE]
> Berbeda dengan GitHub Pages yang pakai sub-path `/kasir/`, Cloudflare Pages menggunakan domain root sehingga `base: '/'` sudah cukup.

### Konfigurasi Router (`App.jsx`)
```jsx
// Tetap gunakan BrowserRouter — Cloudflare Pages mendukung SPA routing
import { BrowserRouter as Router } from 'react-router-dom';
```

### Menangani Client-Side Routing di Cloudflare Pages
Buat file `public/_redirects` agar semua rute diarahkan ke `index.html`:

```
/* /index.html 200
```

File ini **wajib ada** agar halaman seperti `/login`, `/register` tidak error 404 saat diakses langsung atau di-refresh.

### Konfigurasi `api.js` (Production)
```js
const MOCK_MODE = false; // Wajib false di production
```
Pastikan `SCRIPT_URL` sudah menggunakan URL deployment Google Apps Script yang valid.

---

## 📊 Tabel Perbandingan Lengkap

| Aspek | Lokal (Dev) | Cloudflare Pages |
|---|---|---|
| Perintah | `npm run dev` | `npm run build` |
| URL | `localhost:5173` | `*.pages.dev` atau domain custom |
| `base` di Vite | `/` (default) | `/` |
| Router | `BrowserRouter` | `BrowserRouter` |
| `_redirects` | Tidak perlu | **Wajib** di `public/` |
| `MOCK_MODE` | `true` atau `false` | `false` (gunakan GAS) |
| HTTPS | Tidak | **Ya** (otomatis) |
| Build folder | - | `dist/` |

---

## ⚙️ Perbedaan dengan GitHub Pages

| Aspek | GitHub Pages | Cloudflare Pages |
|---|---|---|
| `base` di Vite | `/kasir/` (nama repo) | `/` |
| Router | `HashRouter` (disarankan) | `BrowserRouter` |
| SPA redirect | Manual (404.html trick) | Otomatis via `_redirects` |
| Deploy otomatis | GitHub Actions | Built-in (connect repo) |
| Custom domain | Perlu konfigurasi DNS | Lebih mudah |

---

## 🚀 Langkah Deploy ke Cloudflare Pages (Ringkas)

1. Buat file `public/_redirects` berisi: `/* /index.html 200`
2. Pastikan `MOCK_MODE = false` di `api.js`
3. Pastikan `vite.config.js` menggunakan `base: '/'`
4. Pastikan `App.jsx` menggunakan `BrowserRouter`
5. Push ke GitHub
6. Connect repo di Cloudflare Pages → Build otomatis berjalan

---

## 🔑 Checklist Sebelum Deploy

- [ ] `MOCK_MODE = false` di `src/services/api.js`
- [ ] `SCRIPT_URL` di `api.js` sudah URL GAS yang valid dan aktif
- [ ] File `public/_redirects` sudah ada
- [ ] `vite.config.js` menggunakan `base: '/'`
- [ ] `App.jsx` menggunakan `BrowserRouter`
- [ ] Sheet `Users` di Google Spreadsheet sudah berisi akun yang valid
- [ ] Google Apps Script dideploy dengan akses **"Anyone"**
