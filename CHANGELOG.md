# Changelog: Kuy Zakat (by LAZ Harfa)

## Version: 3.1 (Gamification & Security Update)
**Date:** 29 Maret 2026

### 🚀 Added
*   **Snowball Strategy Infrastructure**: Implementasi `og:image` absolut dan unik untuk preview media sosial premium.
*   **Kindness Streak Challenge**: Fitur gamifikasi penghitung hari berturut-turut (🔥) langsung di header.
*   **Milestone Celebration**: Modal popup otomatis untuk pencapaian streak 3 hari dan 7 hari.
*   **Dynamic Referral Tracking**: Setiap user mendapatkan ID unik otomatis untuk tracking penyebaran organik via `?ref=...`.
*   **Security Obfuscation**: Enkripsi ringan (Base64) pada data lokal untuk mencegah manipulasi streak oleh user awam.

### 🛠 Changed
*   Refaktor total `app.js` untuk mendukung sistem penyimpanan terenkripsi (`k_z_meta_v3`).
*   Update metadata `index.html` untuk tampilan sharing WhatsApp/Telegram yang lebih "Gen-Z Friendly".

## Version: 3.0 (Kuy Zakat Rebranding & Domain Launch)
**Date:** 29 Maret 2026

### 🚀 Launching kuy-zakat.lazmitra.my.id
*   **Official Branding:** Transformasi nama landing page dari "Zakat Sat Set" menjadi **Kuy Zakat**.
*   **Custom Domain:** Deployment ke subdomain resmi `kuy-zakat.lazmitra.my.id`.
*   **CNAME & Nginx:** Penyiapan file `CNAME` untuk GitHub Pages dan konfigurasi virtual host Nginx untuk VPS.

### 🎨 UI & UX Finalization
*   **Branding Sync:** Update `<title>`, `logo-text`, dan `SHARE_TEXT` di seluruh aplikasi agar konsisten dengan nama **Kuy Zakat**.
*   **Bot Deep Linking:** Memastikan semua tombol donasi mengarah ke alur `DONASI_BNTN27` yang super cepat.

### 🔧 Assets & Meta
*   Memperbarui metadata Open Graph untuk tampilan share media sosial yang lebih menarik.
*   Penyederhanaan `app.js` untuk performa *loading* yang lebih ringan.

## Version: 2.1 (Deep Linking & Wording Revision)
**Date:** 28 Maret 2026

### 🔗 Telegram Deep Linking (Bot Sat Set)
*   **Direct-to-Donation Flow:** Memperbarui parameter URL Bot dari `?start=BNTN27` menjadi `?start=DONASI_BNTN27`.
*   **Bot Handler Update:** Memodifikasi `server_files/handlers.go` untuk mendukung parameter `DONASI_`. Bot sekarang otomatis melewati menu Home dan langsung meminta "Nama Muzakki" serta menyimpan kode referral secara otomatis.
*   **Unified Bot Experience:** Menyatukan seluruh alur (Zakat & Sedekah) ke Bot Utama agar data tersentralisasi namun tetap memiliki jalur pintas yang cepat.

### ✍️ Wording & Copywriting Revision
*   **Hero Section:** Mengubah kalimat tanya pembuka dari "Nyangka..." menjadi "**Emang** zakat cuma pas puasa doang? 🤔" agar terdengar lebih lugas.
*   **Service Ease:** Mengubah tagline kemudahan dari "Semudah Nge-chat Ayang" menjadi "**Semudah Nge-chat** 📲" untuk cakupan audiens yang lebih universal.

### ⚙️ Technical Integration
*   Sinkronisasi semua link tombol di `index.html` dan `app.js` agar seragam menggunakan parameter deep linking terbaru.

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
