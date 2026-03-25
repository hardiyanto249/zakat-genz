# Changelog: LAZ Harfa Landing Page (Gen-Z & Post-Ramadan Optimization)

## Version: 2.0 (Edisi Syawal / Pasca-Ramadhan 1447H)
**Date:** 25 Maret 2026

### 🚀 Fitur & Copywriting Baru (Gen-Z Aesthetic)
*   **Hero Section Remake:** Mengubah pesan utama untuk menghapus miskonsepsi "*Zakat hanya dibayar saat bulan puasa*" menjadi kampanye edukasi bayar Zakat Penghasilan rutin ("Nyangka zakat cuma pas puasa doang? 🤔").
*   **Tone of Voice (ToV):** Merombak 100% copywriting situs (dari *Hero, Kalkulator, Ticker, sampai Testimonial*) menggunakan bahasa *slang* kasual dan bersahabat khas Gen-Z: 
    * "Hitung Zakatmu" ➔ "*Zakat Sat Set*"
    * "Sedekah Sesuai Mood" ➔ "*Checkout Pahala Sekarang*"
    * Penggunaan frasa relevan seperti "*Kaum Rebahan, Sat Set, Gak Pake Ribet, dll.*"
*   **Trust Bar Enhancement:** Menyederhanakan klaim legalitas dan transparansi kelembagaan ("*100% Tersalurkan (No Potongan Aneh-Aneh)*", "*Laporan Super Transparan*").

### 🔧 Fungsionalitas & Kalkulator
*   **Deaktivasi Zakat Fitrah:** Menyembunyikan opsi "Zakat Fitrah" (`<div id="panel-fitrah">` / `<button id="tab-fitrah">`) mengingat pelaksanaannya sudah tidak relevan dan tidak sah dikerjakan pasca-Idul Fitri. Fokus utama landing page dialihkan sepenuhnya ke **Zakat Penghasilan** dan **Zakat Maal**.
*   **Optimasi Form Input:** Label kalkulator diperjelas target pasarnya, contohnya: "Gaji Bulanan (Gaji Pokok + Bonus / Freelance)".

### 💬 Live Ticker & Social Proof Update
*   Memperbarui daftar array `messages` di file `app.js` agar tidak menyinggung/menampilkan teks transaksi Zakat Fitrah.
*   Mengganti contoh transaksi dengan "*Zakat Maal*", "*Zakat Penghasilan*", dan "*Sedekah Subuh*".

### 🐛 Bug Fixes
*   **Encoding & Emoji (Mojibake Fix):** Memperbaiki anomali format `UTF-8` ke `Windows-1252` yang menyebabkan berbagai icon Emoji berubah menjadi *Mojibake* (contoh: `🔍¥`, `ðŸ’³`, dll.). Semua icon dan visual grafis (`🔥`, `💳`, `🌿`, `🏥`) di `index.html` dan `app.js` telah pulih dan berhasil dibaca browser secara otentik.
