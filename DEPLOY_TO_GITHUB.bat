@echo off
echo =======================================================
echo 🚀 MEMULAI DEPLOYMENT KE GITHUB (zakat-genz)
echo =======================================================
echo.

cd /d "D:\Users\Yan\project\clawdbot\lazharfa-landing"

:: Inisialisasi Git khusus untuk folder ini
if not exist ".git" (
    git init
    echo [INFO] Git repository lokal berhasil dibuat.
)

:: Tambahkan semua file perubahan (termasuk update Gen-Z dan Mojibake Fix)
git add .
git commit -m "Deploy Landing Page Gen-Z (Post-Ramadan Update v2.0)"

:: Setel Branch Utama ke 'main'
git branch -M main

:: Cek apakah remote 'origin' sudah ada, jika belum tambahkan URL repo baru
git remote add origin https://github.com/hardiyanto249/zakat-genz.git 2>nul
git remote set-url origin https://github.com/hardiyanto249/zakat-genz.git

:: Dorong paksa kode ke Github
echo.
echo Sedang mengunggah file ke Github Anda...
echo (Jika muncul jendela verifikasi/Login Github, silakan di-KLAIM/Login)
git push -u origin main --force

echo.
echo =======================================================
echo ✅ SELESAI!
echo Jika tidak ada tulisan Error warna merah di atas,
echo Silakan cek Github Anda atau masuk ke Tab 'Settings > Pages'
echo lalu ubah branch ke 'main' untuk mendapatkan link resmi Anda!
echo =======================================================
pause
