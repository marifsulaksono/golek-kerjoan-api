# Golek Kerjoan API
Golek Kerjoan API adalah RESTful API yang dibangun menggunakan NestJS, sebuah framework progresif untuk Node.js yang ditulis dalam TypeScript. Proyek ini dirancang untuk menyediakan backend yang efisien dan skalabel untuk Hiring Management.​

## 🧰 Tech Stack
- Bahasa Pemrograman: TypeScript
- Framework: NestJS
- Runtime: Node.js
- Manajer Paket: npm
- Linting & Formatting: ESLint, Prettier
- Manajemen Konfigurasi: dotenv (.env)​
- Authentication: JWT
- ORM: TypeORM
- Caching: Redis
- Database: MySQL

## 📂 Struktur Direktori
```bash
golek-kerjoan-api/
├── src/                # Kode sumber utama
├── test/               # Folder Pengujian
├── .env.example        # Contoh file konfigurasi lingkungan
├── package.json        # Manajemen dependensi dan skrip
├── tsconfig.json       # Konfigurasi TypeScript
├── nest-cli.json       # Konfigurasi CLI NestJS
├── .eslintrc.js        # Konfigurasi ESLint
├── .prettierrc         # Konfigurasi Prettier
└── README.md           # Dokumentasi proyek
```

## 🚀 Cara Menjalankan Proyek
1. Kloning Repositori
```bash
git clone https://github.com/marifsulaksono/golek-kerjoan-api.git
cd golek-kerjoan-api
```
2. Instalasi Dependensi
```bash
npm install
```
3. Konfigurasi Lingkungan
Buat file .env berdasarkan .env.example dan sesuaikan nilai-nilainya sesuai kebutuhan Anda.​

4. Menjalankan Aplikasi
Mode Dev:

```bash
npm run start:dev
```

Mode Production:
```bash
npm run build
npm run start:prod
```
5. Menjalankan Pengujian
```bash
npm run test
```

## 📬 Dokumentasi API
Untuk melihat dokumentasi API, silakan kunjungi link [berikut](https://documenter.getpostman.com/view/30332593/2sB2izCYMi)
