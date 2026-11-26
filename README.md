# Review Kantin — Full-Stack Web Application

Review Kantin adalah aplikasi web untuk menampilkan dan mengelola informasi warung kantin. Aplikasi ini dikembangkan menggunakan React sebagai frontend, Express.js sebagai backend REST API, serta Microsoft SQL Server sebagai database.

Proyek ini dikembangkan secara bertahap untuk memenuhi tugas Praktikum Rekayasa Sistem Informasi:

- **Tugas 2:** Pengembangan REST API dan integrasi database.
- **Tugas 3:** Validasi data, penanganan error, autentikasi JWT, dan otorisasi.
- **Tugas 4:** Pengembangan frontend React dan integrasi dengan backend.
- **Tugas 5:** Audit Log, pencatatan aktivitas, filter, pagination, detail log, dan keamanan data audit.

## 1. Teknologi yang Digunakan

### Backend

- Node.js
- Express.js
- TypeScript
- Microsoft SQL Server
- Drizzle ORM
- Zod
- JSON Web Token (JWT)
- bcrypt
- Swagger UI

### Frontend

- React
- TypeScript
- Vite
- Fetch API
- CSS

### Tools Pengembangan

- Visual Studio Code
- SQL Server Management Studio (SSMS)
- Postman
- Swagger UI
- Git dan GitHub

## 2. Struktur Proyek

Proyek menggunakan satu repository dengan folder backend dan frontend yang terpisah.

```text
review-kantin-api/
│
├── backend/
│   ├── src/
│   ├── .env.example
│   ├── drizzle.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

Folder `backend/` berisi REST API, autentikasi, otorisasi, validasi, pencatatan Audit Log, dan akses database.

Folder `frontend/` berisi antarmuka pengguna berbasis React serta service untuk mengakses REST API.

## 3. Fitur Aplikasi

### 3.1. Fitur Publik

Pengunjung dapat:

- Melihat daftar warung kantin.
- Melihat detail informasi warung.
- Mencari warung berdasarkan nama.
- Memfilter warung berdasarkan kategori.
- Menggunakan pagination untuk berpindah halaman.

### 3.2. Autentikasi Pengguna

Aplikasi menyediakan:

- Registrasi akun baru.
- Login menggunakan email dan password.
- Autentikasi menggunakan JWT.
- Menampilkan informasi akun melalui endpoint `/auth/me`.
- Logout dengan menghapus token dari sesi browser.
- Penanganan token tidak valid atau kedaluwarsa.

Akun baru yang didaftarkan melalui fitur registrasi mendapatkan role `customer` secara default.

### 3.3. Manajemen Warung (CRUD)

Aplikasi menyediakan empat operasi utama:

- **CREATE:** Menambahkan warung baru.
- **READ:** Menampilkan daftar dan detail warung.
- **UPDATE:** Memperbarui informasi warung.
- **DELETE:** Menghapus warung dengan konfirmasi.

Akses terhadap operasi CRUD dibatasi berdasarkan role pengguna.

### 3.4. Penanganan Kondisi Antarmuka

Frontend React menyediakan:

- Loading state ketika data sedang dimuat.
- Empty state ketika data tidak ditemukan.
- Error state ketika request gagal.
- Penanganan HTTP 401 Unauthorized.
- Penanganan HTTP 403 Forbidden.
- Notifikasi keberhasilan operasi.
- Konfirmasi sebelum menghapus warung.

### 3.5. Audit Log

Aplikasi menyediakan fitur Audit Log untuk mencatat aktivitas pengguna dan perubahan data yang terjadi dalam sistem.

Audit Log menyimpan informasi aktivitas, meliputi:

- User ID yang melakukan aktivitas.
- Jenis aktivitas (`action`).
- Tabel target aktivitas.
- ID data yang menjadi target.
- Metadata aktivitas.
- IP address.
- User-Agent.
- Waktu aktivitas.

Aktivitas yang dicatat mencakup LOGIN, LOGOUT, serta operasi perubahan data tertentu, seperti CREATE_MENU, UPDATE_MENU, dan DELETE_MENU.

Admin dapat melihat daftar aktivitas, melakukan pencarian menggunakan filter, membuka detail aktivitas, serta menelusuri data melalui pagination.

Audit Log dilindungi dengan autentikasi dan otorisasi Admin. Selain itu, tabel AUDIT_LOGS menerapkan mekanisme append-only untuk menjaga integritas riwayat aktivitas. Catatan audit yang sudah tersimpan tidak dapat diubah atau dihapus melalui operasi UPDATE maupun DELETE karena ditolak oleh trigger database.

## 4. Role dan Hak Akses

Sistem menggunakan Role-Based Access Control (RBAC).

| Fitur | Admin | Owner | Customer | Publik |
|---|---|---|---|---|
| Melihat daftar warung | Ya | Ya | Ya | Ya |
| Melihat detail warung | Ya | Ya | Ya | Ya |
| Pencarian dan filter | Ya | Ya | Ya | Ya |
| Menambahkan warung | Ya | Ya | Tidak | Tidak |
| Mengedit warung sendiri | Ya | Ya | Tidak | Tidak |
| Mengedit warung milik pengguna lain | Ya | Tidak | Tidak | Tidak |
| Menghapus warung | Ya | Tidak | Tidak | Tidak |
| Melihat profil akun | Ya | Ya | Ya | Tidak |
| Melihat daftar Audit Log | Ya | Tidak | Tidak | Tidak |
| Melihat detail Audit Log | Ya | Tidak | Tidak | Tidak |

Frontend menyesuaikan tampilan tombol berdasarkan role pengguna.

Otorisasi utama tetap dilakukan oleh backend untuk mencegah pengguna menjalankan operasi yang tidak diizinkan.

## 5. Database

Aplikasi menggunakan Microsoft SQL Server dengan nama database:

`review_kantin`

Database memiliki tujuh tabel utama:

| Tabel | Fungsi |
|---|---|
| USERS | Menyimpan informasi akun pengguna |
| STALLS | Menyimpan informasi warung kantin |
| MENU_ITEMS | Menyimpan informasi menu makanan dan minuman |
| REVIEWS | Menyimpan rating dan ulasan |
| LIKES | Menyimpan interaksi like pada ulasan |
| FLAGS | Menyimpan data flag |
| AUDIT_LOGS | Menyimpan catatan aktivitas sistem |

Frontend Tugas 4 berfokus pada pengelolaan warung dan autentikasi pengguna. Endpoint untuk tabel lainnya tetap menjadi bagian dari backend.

Tabel `AUDIT_LOGS` digunakan untuk menyimpan riwayat aktivitas pengguna dan perubahan data dalam sistem. Pencatatan audit dilakukan oleh backend, sedangkan informasi pengguna dapat dihubungkan dengan tabel USERS ketika data audit ditampilkan.

Tabel AUDIT_LOGS menerapkan mekanisme append-only untuk menjaga integritas riwayat aktivitas. Operasi UPDATE dan DELETE terhadap catatan audit ditolak oleh trigger database.

Database dan struktur tabel harus sudah tersedia sebelum aplikasi dijalankan.

## 6. Instalasi dan Menjalankan Proyek

### 6.1. Persyaratan

Pastikan perangkat sudah memiliki:

- Node.js dan npm.
- Microsoft SQL Server.
- Database `review_kantin` beserta tabel yang diperlukan.
- Git.
- Browser modern.

### 6.2. Clone Repository

Buka terminal, lalu jalankan:

```bash
git clone https://github.com/fathiasaa/review-kantin-api.git
cd review-kantin-api
```

### 6.3. Menjalankan Backend

Masuk ke folder backend:

```bash
cd backend
```

Instal dependensi:

```bash
npm install
```

Siapkan file `.env` berdasarkan `.env.example`.

Sesuaikan konfigurasi koneksi SQL Server, database, dan JWT secret dengan lingkungan lokal.

Contoh kategori konfigurasi yang diperlukan:

- Server SQL Server.
- Port database.
- Nama database.
- Kredensial koneksi database.
- JWT secret.

**Jangan menyimpan password atau JWT secret asli di repository Git.**

Jalankan backend:

```bash
npm run dev
```

Backend dapat diakses melalui:

http://localhost:3000

Endpoint daftar warung:

http://localhost:3000/api/v1/stalls

Dokumentasi Swagger UI:

http://localhost:3000/docs

### 6.4. Menjalankan Frontend

Buka terminal baru dan masuk ke folder frontend:

```bash
cd frontend
```

Jika terminal masih berada di folder backend, kembali ke folder utama terlebih dahulu:

```bash
cd ..
cd frontend
```

Instal dependensi:

```bash
npm install
```

Jalankan aplikasi React:

```bash
npm run dev
```

Frontend dapat diakses melalui:

http://localhost:5173

Pastikan backend dan frontend berjalan secara bersamaan agar integrasi REST API dapat digunakan.

## 7. Integrasi Frontend dan Backend

Frontend menggunakan Fetch API untuk berkomunikasi dengan backend Express.

Base URL API yang digunakan pada service frontend:

```typescript
const API_BASE_URL = '/api/v1'
```

Pada mode development, Vite menggunakan proxy untuk meneruskan request `/api` ke backend:

```text
Frontend React
localhost:5173
       |
       | Fetch API
       v
Vite Proxy (/api)
       |
       v
Backend Express
localhost:3000
       |
       v
Microsoft SQL Server
Database: review_kantin
```

Dengan konfigurasi tersebut, frontend tidak memerlukan file `.env` tersendiri untuk URL API selama menggunakan proxy development yang sudah disiapkan.

Request ke endpoint yang dilindungi menggunakan JWT pada header:

```http
Authorization: Bearer <token>
```

Token JWT disimpan pada Session Storage browser selama sesi login.

## 8. Endpoint REST API

### 8.1. Autentikasi

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/api/v1/auth/register` | Registrasi akun |
| POST | `/api/v1/auth/login` | Login dan mendapatkan JWT |
| GET | `/api/v1/auth/me` | Mengambil informasi pengguna yang login |

### 8.2. Warung Kantin

| Method | Endpoint | Keterangan | Hak Akses |
|---|---|---|---|
| GET | `/api/v1/stalls` | Melihat daftar warung | Publik |
| GET | `/api/v1/stalls/:id` | Melihat detail warung | Publik |
| POST | `/api/v1/stalls` | Menambahkan warung | Admin, Owner |
| PUT | `/api/v1/stalls/:id` | Mengubah warung | Admin, Owner pemilik |
| DELETE | `/api/v1/stalls/:id` | Menghapus warung | Admin |

Endpoint daftar warung mendukung parameter query seperti:

- `search` untuk pencarian nama.
- `category` untuk filter kategori.
- `page` untuk menentukan halaman.
- `limit` untuk membatasi jumlah data.

Contoh request:

```http
GET /api/v1/stalls?page=1&limit=6
GET /api/v1/stalls?search=Bu%20Tini
GET /api/v1/stalls?category=Mie
```

### 8.3. Audit Log

Endpoint Audit Log hanya dapat diakses oleh pengguna dengan role Admin yang telah terautentikasi.

| Method | Endpoint | Keterangan | Hak Akses |
|---|---|---|---|
| GET | `/api/v1/audit-logs` | Mengambil daftar Audit Log | Admin |
| GET | `/api/v1/audit-logs/:id` | Mengambil detail Audit Log berdasarkan ID | Admin |

Endpoint daftar Audit Log mendukung filter dan pagination melalui query parameter:

| Parameter | Keterangan |
|---|---|
| `userId` | Memfilter berdasarkan ID pengguna |
| `targetId` | Memfilter berdasarkan ID data target |
| `action` | Memfilter jenis aktivitas |
| `targetTable` | Memfilter nama tabel target |
| `from` | Menentukan tanggal awal pencarian |
| `to` | Menentukan tanggal akhir pencarian |
| `page` | Menentukan halaman yang ditampilkan |
| `pageSize` | Menentukan jumlah data per halaman |

Contoh request:

```http
GET /api/v1/audit-logs?page=1&pageSize=20

GET /api/v1/audit-logs?userId=1

GET /api/v1/audit-logs?targetId=37

GET /api/v1/audit-logs?action=DELETE_MENU

GET /api/v1/audit-logs?targetTable=MENU_ITEMS

GET /api/v1/audit-logs?from=2026-11-21&to=2026-11-21

GET /api/v1/audit-logs?userId=1&targetId=37&action=UPDATE_MENU
```

Filter dapat digunakan secara individual maupun dikombinasikan. Pagination diterapkan pada query database sehingga data yang ditampilkan disesuaikan dengan filter dan halaman yang diminta.

Endpoint daftar Audit Log mengembalikan data aktivitas beserta informasi pagination, seperti halaman saat ini, jumlah data per halaman, total data, dan total halaman.

Endpoint detail Audit Log menampilkan informasi aktivitas secara lebih lengkap, termasuk metadata aktivitas dan informasi pendukung seperti IP address serta User-Agent.

Akses endpoint Audit Log dilindungi oleh middleware autentikasi JWT dan otorisasi Admin. Pengguna tanpa autentikasi ditolak, sedangkan pengguna dengan role selain Admin tidak memiliki izin untuk mengakses endpoint tersebut.

## 9. Validasi, Autentikasi, dan Otorisasi

### Validasi Input

Backend menggunakan Zod untuk memvalidasi data yang diterima API.

Validasi dilakukan untuk memastikan data yang masuk sesuai dengan format dan ketentuan yang ditetapkan oleh endpoint.

Pada endpoint Audit Log, validasi juga diterapkan pada query parameter, termasuk ID pengguna, ID target, filter aktivitas, rentang tanggal, serta pagination.

### Autentikasi JWT

Pengguna melakukan login untuk memperoleh token JWT.

Token digunakan saat mengakses endpoint yang memerlukan autentikasi.

Backend memeriksa validitas token sebelum melanjutkan request ke endpoint yang dilindungi.

### Otorisasi

Backend memeriksa role dan kepemilikan data sebelum mengizinkan operasi tertentu.

Contoh penerapan:

- Owner dapat menambahkan warung.
- Owner dapat mengedit warung miliknya sendiri.
- Owner tidak dapat mengedit warung milik Owner lain.
- Owner tidak dapat menghapus warung.
- Admin dapat mengelola seluruh warung.

Selain otorisasi pada fitur manajemen warung, sistem menerapkan pembatasan akses pada Audit Log. Endpoint Audit Log hanya dapat diakses oleh Admin melalui middleware `authenticate` dan `authorize('admin')`.

Backend memastikan pencatatan aktivitas menggunakan identitas pengguna yang telah terautentikasi, sehingga identitas pelaku audit tidak bergantung pada User ID yang dikirim bebas oleh client.

Database juga menerapkan mekanisme append-only pada tabel AUDIT_LOGS untuk mencegah perubahan dan penghapusan catatan audit yang telah tersimpan.

### Penanganan Error

Sistem membedakan respons error, termasuk:

- HTTP 400 — Bad Request.
- HTTP 401 — Unauthorized.
- HTTP 403 — Forbidden.
- HTTP 404 — Not Found.
- HTTP 500 — Internal Server Error.

Frontend menampilkan pesan yang sesuai ketika request gagal.

## 10. Pengujian Aplikasi

Pengujian dilakukan melalui React, Swagger UI, dan SQL Server Management Studio.

### Pengujian Fitur Publik

- Menampilkan daftar warung.
- Menampilkan detail warung.
- Pencarian berdasarkan nama.
- Filter kategori.
- Pagination.
- Empty state ketika hasil tidak ditemukan.

### Pengujian Autentikasi

- Registrasi akun.
- Login.
- Menampilkan informasi akun.
- Logout.
- Penanganan token JWT tidak valid (HTTP 401).

### Pengujian Owner

- CREATE warung berhasil.
- UPDATE warung milik sendiri berhasil.
- UPDATE warung milik pengguna lain ditolak (HTTP 403).
- DELETE warung ditolak (HTTP 403).

### Pengujian Admin

- CREATE warung berhasil.
- UPDATE warung milik Owner lain berhasil.
- DELETE warung berhasil.
- Konfirmasi sebelum penghapusan.
- Notifikasi setelah penghapusan berhasil.

### Pengujian Customer

- Customer dapat melihat daftar dan detail warung.
- Customer tidak ditampilkan tombol CREATE, UPDATE, atau DELETE.

### Pengujian State dan Integrasi

- Loading state.
- Error state ketika backend tidak tersedia.
- Empty state.
- Verifikasi data CREATE di SQL Server.
- Verifikasi data UPDATE di SQL Server.
- Verifikasi data DELETE di SQL Server.

### Pengujian Audit Log

Pengujian Audit Log dilakukan melalui Swagger UI, frontend, dan SQL Server Management Studio.

#### Pengujian Pencatatan Aktivitas

- Audit LOGIN berhasil tercatat.
- Audit LOGOUT berhasil tercatat.
- Metadata aktivitas mencakup informasi pendukung seperti IP address dan User-Agent.
- Aktivitas CREATE_MENU, UPDATE_MENU, dan DELETE_MENU tercatat pada Audit Log.

#### Pengujian Endpoint dan Hak Akses

- Admin dapat mengakses daftar Audit Log.
- Admin dapat mengakses detail Audit Log.
- Detail Audit Log dengan ID yang tidak ditemukan mengembalikan HTTP 404.
- Pengguna dengan role non-admin ditolak ketika mengakses endpoint Audit Log.
- Endpoint Audit Log memerlukan autentikasi JWT.

#### Pengujian Filter dan Pagination

- Filter berdasarkan userId.
- Filter berdasarkan targetId.
- Filter berdasarkan action.
- Filter berdasarkan targetTable.
- Filter rentang tanggal.
- Kombinasi beberapa filter.
- Pagination dan perhitungan total data.
- Urutan data berdasarkan aktivitas terbaru.

#### Pengujian Frontend

- Menampilkan daftar Audit Log.
- Filter berdasarkan User ID dan Target ID.
- Reset filter.
- Berpindah halaman melalui pagination.
- Membuka detail Audit Log melalui modal.
- Menampilkan metadata aktivitas.
- Menampilkan informasi IP address dan User-Agent.
- Menangani loading ketika mengambil detail Audit Log.
- Menampilkan pesan error ketika request detail gagal.

#### Pengujian Append-Only Database

- Trigger append-only pada tabel AUDIT_LOGS aktif.
- Operasi UPDATE terhadap AUDIT_LOGS ditolak oleh trigger.
- Operasi DELETE terhadap AUDIT_LOGS ditolak oleh trigger.

Pengujian dilakukan dengan memastikan operasi UPDATE dan DELETE menghasilkan pesan penolakan dari trigger database yang menyatakan bahwa AUDIT_LOGS bersifat append-only.

## 11. Build Frontend

Masuk ke folder frontend:

```bash
cd frontend
```

Jalankan:

```bash
npm run build
```

Perintah tersebut menjalankan pemeriksaan TypeScript dan proses build Vite.

Jika berhasil, hasil build akan tersedia di:

```text
frontend/dist/
```

Folder `dist` tidak perlu diunggah ke GitHub karena dapat dibuat ulang dengan menjalankan proses build.

## 12. Keamanan Repository

Repository menggunakan `.gitignore` untuk menghindari pengunggahan file sensitif dan file hasil instalasi.

File yang tidak boleh diunggah antara lain:

- `.env` yang berisi konfigurasi rahasia.
- Folder `node_modules`.
- Folder `dist`.
- File log.

File `.env.example` boleh disertakan sebagai panduan konfigurasi, tetapi tidak boleh berisi password, token, atau JWT secret asli.

Akun dan password pengujian juga tidak dicantumkan dalam README.

Data Audit Log dilindungi melalui autentikasi dan otorisasi backend. Selain itu, trigger append-only pada database menolak operasi UPDATE dan DELETE terhadap tabel AUDIT_LOGS.

## 13. Repository GitHub

Repository proyek:

https://github.com/fathiasaa/review-kantin-api

Repository yang sama digunakan untuk pengembangan Tugas 2, Tugas 3, Tugas 4, dan Tugas 5 agar riwayat perubahan proyek tetap terdokumentasi.

## 14. Keterangan

Proyek Review Kantin dikembangkan untuk memenuhi tugas Praktikum Rekayasa Sistem Informasi.

Pengembangan mencakup perancangan REST API, integrasi database, validasi, autentikasi, otorisasi, pengembangan frontend React, pencatatan aktivitas melalui Audit Log, perlindungan integritas data audit, serta pengujian komunikasi antara frontend dan backend.