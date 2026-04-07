/* ═══════════════════════════════════════════════════════════
   LAZ HARFA — Landing Page JavaScript
   Kalkulator Zakat + Lead Generation Interactions
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── FIREBASE CONFIG (ACTIVE) ──────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCgQfAAMy_tcmbiKF6FHWbRIjtRN-5CnsI",
  authDomain: "kuy-zakat.firebaseapp.com",
  databaseURL: "https://kuy-zakat-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kuy-zakat",
  storageBucket: "kuy-zakat.firebasestorage.app",
  messagingSenderId: "615145899574",
  appId: "1:615145899574:web:98a808517b92bcd605ba97",
  measurementId: "G-0YD3ZV4J4Z"
};

// Initialize Firebase
let firebaseApp, db;
try {
  if (typeof firebase !== 'undefined' && firebaseConfig.apiKey) {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    console.log('✅ Firebase LIVE: Database connected for Real-time Ticker');
  }
} catch (e) { console.error('Firebase failing:', e); }

// ── CONSTANTS ─────────────────────────────────────────────────
const NISAB_PENGHASILAN_BULANAN = 7_900_000;   // ~85gr emas / 12 bulan
const NISAB_MAAL_TAHUNAN = 94_800_000;  // 85gr emas
const NISAB_FITRAH_PER_JIWA = 45_000;  // LAZ Harfa 2026
const ZAKAT_RATE = 0.025;        // 2.5%
const BOT_URL = 'https://t.me/lazharfa_tele_bot?start=DONASI_BNTN27';
const SHARE_URL = window.location.origin + window.location.pathname;
const USER_ID = (function() {
  let id = localStorage.getItem('k_z_uid');
  if (!id) {
    id = 'U' + Math.random().toString(36).substring(2, 7).toUpperCase();
    localStorage.setItem('k_z_uid', id);
  }
  return id;
})();
const SHARE_TEXT = `🌙 Kuy Zakat! Kalkulator zakat paling sat set buat kaum rebahan.\n\nIkuti challenge-nya Bareng gue: `;

// ── HELPERS ───────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const formatRp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const parseRpInput = id => {
  const raw = ($(id)?.value || '').replace(/\D/g, '');
  return parseInt(raw) || 0;
};

// ── NAVBAR SCROLL ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');

  // Show floating CTA setelah scroll 400px
  const cta = $('floating-cta');
  if (window.scrollY > 400) cta.classList.remove('hidden');
  else cta.classList.add('hidden');
});

// ── COUNTER ANIMATION ─────────────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '') {
  const duration = 2000;
  const start = Date.now();
  const update = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Observe hero stats
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('[data-target]').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      animateCounter(el, target, prefix, suffix);
    });
    statsObserver.disconnect();
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── SCROLL ANIMATIONS ─────────────────────────────────────────
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
  '.program-card, .step-card, .testi-card, .calc-wrapper, .share-box'
).forEach(el => {
  el.classList.add('animate-on-scroll');
  scrollObserver.observe(el);
});

// ── INPUT FORMATTING (Rupiah) ──────────────────────────────────
function setupRpInput(inputId) {
  const input = $(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const raw = input.value.replace(/\D/g, '');
    const num = parseInt(raw) || 0;
    input.value = num ? num.toLocaleString('id-ID') : '';
  });
}
['gaji', 'tunjangan', 'tabungan', 'emas', 'hutang'].forEach(setupRpInput);

// ── TABS ──────────────────────────────────────────────────────
document.querySelectorAll('.calc-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    // Reset tabs & panels
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    $(`panel-${target}`)?.classList.add('active');

    // Hide result when switching tabs
    $('calc-result').classList.add('hidden');
  });
});

// ── HITUNG ZAKAT PENGHASILAN ───────────────────────────────────
$('hitung-penghasilan')?.addEventListener('click', () => {
  const gaji = parseRpInput('gaji');
  const tunjangan = parseRpInput('tunjangan');
  const total = gaji + tunjangan;
  const zakat = total * ZAKAT_RATE;

  const result = $('calc-result');
  result.classList.remove('hidden');

  if (total < NISAB_PENGHASILAN_BULANAN) {
    $('result-amount').textContent = 'Belum Wajib Zakat';
    $('result-desc').textContent =
      `Penghasilanmu ${formatRp(total)}/bulan belum mencapai nisab (${formatRp(NISAB_PENGHASILAN_BULANAN)}/bulan). ` +
      `Tapi kamu tetap bisa bersedekah melalui bot kami! 💚`;
    $('bayar-sekarang').textContent = '💚 Donasi / Sedekah via Bot';
  } else {
    $('result-amount').textContent = formatRp(zakat) + ' / bulan';
    $('result-desc').textContent =
      `Dari penghasilan ${formatRp(total)}/bulan, zakatmu adalah 2.5% = ${formatRp(zakat)}/bulan ` +
      `atau ${formatRp(zakat * 12)}/tahun. Alhamdulillah! 🎉`;
    $('bayar-sekarang').textContent = '💚 Bayar Zakat Sekarang via Bot';
  }

  // Simpan ke local storage untuk tracking
  trackAction('hitung_penghasilan', { total, zakat });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── HITUNG ZAKAT MAAL ─────────────────────────────────────────
$('hitung-maal')?.addEventListener('click', () => {
  const tabungan = parseRpInput('tabungan');
  const emas = parseRpInput('emas');
  const hutang = parseRpInput('hutang');
  const total = Math.max(0, tabungan + emas - hutang);
  const zakat = total * ZAKAT_RATE;

  const result = $('calc-result');
  result.classList.remove('hidden');

  if (total < NISAB_MAAL_TAHUNAN) {
    $('result-amount').textContent = 'Belum Wajib Zakat';
    $('result-desc').textContent =
      `Total hartamu ${formatRp(total)} belum mencapai nisab maal (${formatRp(NISAB_MAAL_TAHUNAN)}). ` +
      `Terus berusaha ya, dan jangan lupa infaq/sedekah! 💪`;
    $('bayar-sekarang').textContent = '💚 Infaq / Sedekah via Bot';
  } else {
    $('result-amount').textContent = formatRp(zakat) + ' / tahun';
    $('result-desc').textContent =
      `Dari harta bersih ${formatRp(total)}, zakatmu adalah 2.5% = ${formatRp(zakat)}/tahun. ` +
      `Segera tunaikan ya, insyaAllah rezekimu semakin berkah! 🌟`;
    $('bayar-sekarang').textContent = '💚 Bayar Zakat Maal via Bot';
  }

  trackAction('hitung_maal', { total, zakat });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── HITUNG ZAKAT FITRAH ────────────────────────────────────────
let jiwaCount = 1;
$('plus-jiwa')?.addEventListener('click', () => {
  jiwaCount = Math.min(jiwaCount + 1, 20);
  $('jiwa').value = jiwaCount;
});
$('minus-jiwa')?.addEventListener('click', () => {
  jiwaCount = Math.max(jiwaCount - 1, 1);
  $('jiwa').value = jiwaCount;
});

$('hitung-fitrah')?.addEventListener('click', () => {
  const total = jiwaCount * NISAB_FITRAH_PER_JIWA;
  const result = $('calc-result');
  result.classList.remove('hidden');

  $('result-amount').textContent = formatRp(total);
  $('result-desc').textContent =
    `Zakat fitrah untuk ${jiwaCount} jiwa × ${formatRp(NISAB_FITRAH_PER_JIWA)} = ${formatRp(total)}. ` +
    `Wajib dibayar sebelum sholat Idul Fitri! ⏰`;
  $('bayar-sekarang').textContent = '💚 Bayar Zakat Fitrah via Bot';

  trackAction('hitung_fitrah', { jiwa: jiwaCount, total });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── SHARE RESULT ──────────────────────────────────────────────
$('share-result')?.addEventListener('click', () => {
  const amount = $('result-amount')?.textContent || '';
  const text = `🎉 Baru hitung zakat pakai Kuy Zakat (LAZ Harfa)!\nZakatku: ${amount}\n\nKuy, hitung punya lo di sini: ${SHARE_URL}?ref=${USER_ID}`;
  shareContent(text);
  trackAction('share_result', { amount });
});

// ── SHARE BUTTONS ─────────────────────────────────────────────
$('share-wa')?.addEventListener('click', () => {
  const text = encodeURIComponent(SHARE_TEXT + SHARE_URL);
  window.open(`https://wa.me/?text=${text}`, '_blank');
  trackAction('share_wa');
});

$('share-tg')?.addEventListener('click', () => {
  const text = encodeURIComponent(SHARE_TEXT + SHARE_URL);
  window.open(`https://t.me/share/url?url=${encodeURIComponent(SHARE_URL)}&text=${text}`, '_blank');
  trackAction('share_tg');
});

$('share-link')?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(SHARE_URL);
    showToast('Link berhasil disalin! 🎉');
    trackAction('share_link');
  } catch {
    showToast('Salin link: ' + SHARE_URL);
  }
});

// ── SHARE HELPER ──────────────────────────────────────────────
function shareContent(text) {
  if (navigator.share) {
    navigator.share({
      title: 'Kuy Zakat — Kalkulator Sat Set',
      text,
      url: SHARE_URL,
    }).catch(() => { });
  } else {
    navigator.clipboard?.writeText(text).then(() => showToast('Teks disalin! Paste di mana saja 📋'));
  }
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, duration = 3000) {
  const toast = $('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

// ── UTM TRACKING ──────────────────────────────────────────────
function trackAction(event, data = {}) {
  const time = new Date().toISOString();
  
  // 1. Simpan di localStorage (Local)
  const key = 'harfa_leads';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({ event, data, timestamp: time });
  localStorage.setItem(key, JSON.stringify(existing.slice(-20)));

  // 2. Kirim ke Firebase (Cloud Analytics - Via REST API for max bypass)
  const dbUrl = "https://kuy-zakat-default-rtdb.asia-southeast1.firebasedatabase.app/recent_donations.json";
  try {
      fetch(dbUrl, {
          method: 'POST',
          body: JSON.stringify({
              type: 'event', // Pembeda untuk Analytics
              event,
              data,
              timestamp: time,
              ua: navigator.userAgent.substring(0, 50),
              ref: document.referrer || 'direct'
          })
      });
  } catch(e) { console.warn('Analytics push failed:', e); }

  // 3. Google Analytics (If loaded)
  if (typeof gtag !== 'undefined') {
    gtag('event', event, { ...data });
  }
}

// ── UTM REFERRAL LINK ─────────────────────────────────────────
(function appendUTM() {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || '';
  const utm = params.get('utm_source') || '';

  // Tambahkan referral ke semua link bot
  if (ref || utm) {
    const startParam = ref ? `REF_${ref}` : `UTM_${utm}`;
    document.querySelectorAll(`a[href*="t.me/lazharfa_tele_bot"]`).forEach(a => {
      const url = new URL(a.href);
      url.searchParams.set('start', startParam);
      a.href = url.toString();
    });
  }
})();

// ── PROGRESS BAR ANIMATION ────────────────────────────────────
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.progress-fill').forEach(bar => {
      const width = bar.style.width;
      bar.style.width = '0%';
      setTimeout(() => { bar.style.width = width; }, 100);
    });
  });
}, { threshold: 0.3 });
document.querySelectorAll('.program-grid').forEach(g => progressObserver.observe(g));

// ── SMOOTH SCROLL NAV ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── INIT ──────────────────────────────────────────────────────
console.log('%c🌙 Kuy Zakat Landing Page Loaded', 'color: #8B5CF6; font-weight: bold; font-size: 14px;');
trackAction('page_view');

/* 
   GEN Z FEATURES  Interactive Logic
    */

// ── LIVE TICKER (REAL-TIME CLOUD ENABLED) ──────────────────────
window.pushTickerItem = null;

(function initTicker() {
  const names = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogya', 'Makassar', 'Semarang', 'Malang', 'Depok', 'Bogor'];
  const amounts = [5000, 10000, 15000, 25000, 50000, 100000];
  let count = parseInt(localStorage.getItem('harfa_ticker_count') || '148');

  function updateTickerDisplay(msg, isHighlight = false) {
    const track = $('ticker-track');
    if (!track) return;
    track.innerHTML = `<div class="ticker-item active ${isHighlight ? 'highlight' : ''}">${msg}</div>`;
  }

  // 1. DENGARKAN DATA REAL DARI FIREBASE (Real-time antar User)
  if (db) {
    const donationsRef = db.ref('recent_donations');
    donationsRef.limitToLast(1).on('child_added', (snapshot) => {
      const data = snapshot.val();
      const timeElapsed = Date.now() - data.timestamp;
      
      // Jika data baru (bukan data lama saat web baru buka)
      if (timeElapsed < 5000) {
        // HANYA TAMPILKAN JIKA INI DONASI ASLI (BUKAN LOG ANALYTICS)
        if (data.type === 'event' && !data.amount) return;

        let msg = data.msg;
        if (!msg) {
          msg = `🌟 <strong>LIVE:</strong> Donatur dari ${data.city} baru saja sedekah Rp ${data.amount.toLocaleString('id-ID')} via QRIS! 📸`;
        } else {
          msg = msg.replace('GUE:', 'LIVE:');
        }
        
        updateTickerDisplay(msg, true);
        
        // Update Counter (Real)
        count++;
        localStorage.setItem('harfa_ticker_count', String(count));
        const counterEl = $('ticker-today');
        if (counterEl) counterEl.textContent = count + ' sedekah hari ini';
      }
    });
  }

  // 2. SIMULASI PINTAR (Jika sedang sepi atau Firebase belum siap)
  const messages = [
    '🔥 BARU: Sekarang Sedekah Makin Sat Set via QRIS! ✅ ',
    '📸 Info: Gak pake ribet, scan QRIS untuk bantu sesama!',
    '🚨 Update: Sedekah kini makin mudah pakai QRIS Harfa!',
  ];

  let simIdx = 0;
  function nextSimulationTick() {
    let msg = '';
    if (simIdx % 3 === 0) {
      msg = messages[0];
    } else {
      const city = names[Math.floor(Math.random() * names.length)];
      const amt = amounts[Math.floor(Math.random() * amounts.length)];
      const method = Math.random() > 0.4 ? 'via QRIS 📸' : 'via Bot 🔥';
      msg = `Donatur dari ${city} baru saja sedekah Rp ${amt.toLocaleString('id-ID')} ${method}`;
    }
    updateTickerDisplay(msg);
    simIdx++;
  }

  // Hook untuk kirim data ke Firebase
  window.pushTickerItem = function(amount, customMessage = null) {
    const cityName = names[Math.floor(Math.random() * names.length)];
    const timeNow = Date.now();
    
    // Kirim ke Firebase (Gunakan Jalur yang sudah terbukti terbuka: recent_donations)
    try {
      if (db) {
        db.ref('recent_donations').push({
          type: 'donation', // Pembeda untuk Ticker
          amount,
          city: cityName,
          timestamp: timeNow,
          msg: customMessage
        });
      }
    } catch (e) { console.warn('Cloud update delayed:', e); }

    // Tampilkan di layar bapak sendiri langsung
    const finalMsg = customMessage || `🌟 <strong>GUE:</strong> Baru saja sedekah Rp ${amount.toLocaleString('id-ID')} via QRIS Sat Set! 🚀`;
    updateTickerDisplay(finalMsg, true);
    
    // PAUSE SIMULASI
    clearInterval(tickerInterval);
    setTimeout(() => {
      tickerInterval = setInterval(nextSimulationTick, 4000);
    }, 10000); // Tampilkan pesan selama 10 detik
  };

  let tickerInterval = setInterval(nextSimulationTick, 4000);
  nextSimulationTick();
})();

//  MOOD FILTER 
document.querySelectorAll('.mood-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.mood-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const mood = chip.getAttribute('data-mood');
    document.querySelectorAll('.quick-card').forEach(card => {
      const cardMoods = card.getAttribute('data-mood') || 'all';
      if (mood === 'all' || cardMoods.includes(mood)) {
        card.style.display = '';
        card.style.animation = 'fadeInUp 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── QRIS MODAL SYSTEM ──────────────────────────────────────────
let qrisTimerInterval = null;
let qrisTimeLeft = 20;

function openQrisModal(amount) {
  const modal = $('qris-modal');
  const amountDisplay = $('qris-amount-display');
  const doneBtn = $('qris-done-btn');
  const progressBox = $('qris-progress-container');
  const progressFill = $('qris-progress-fill');
  const timerSec = $('qris-timer-sec');

  if (modal && amountDisplay) {
    amountDisplay.textContent = formatRp(amount);
    modal.classList.add('active');
    modal.style.display = 'flex';
    
    // Reset UI State
    if (doneBtn) {
        doneBtn.style.display = 'none';
        doneBtn.classList.remove('fade-in');
    }
    if (progressBox) progressBox.style.display = 'block';
    if (progressFill) progressFill.style.width = '0%';
    if (timerSec) timerSec.textContent = '20';

    // CLEAR OLD TIMER
    if (qrisTimerInterval) clearInterval(qrisTimerInterval);
    qrisTimeLeft = 20;

    // JALANKAN TIMER LUXURY
    qrisTimerInterval = setInterval(() => {
        qrisTimeLeft--;
        if (timerSec) timerSec.textContent = qrisTimeLeft;
        
        const percent = ((20 - qrisTimeLeft) / 20) * 100;
        if (progressFill) progressFill.style.width = percent + '%';

        if (qrisTimeLeft <= 0) {
            clearInterval(qrisTimerInterval);
            if (progressBox) progressBox.style.display = 'none';
            if (doneBtn) {
                doneBtn.classList.add('fade-in');
            }
        }
    }, 1000);

    trackAction('open_qris', { amount });
  }
}

function handleQrisSuccess() {
    const amtRaw = $('qris-amount-display')?.textContent.replace(/\D/g, '') || '0';
    const amount = parseInt(amtRaw) || 0;
    
    showToast('Alhamdulillah, sedekahmu sedang kami proses! 💚');
    updateStreak();
    if (window.pushTickerItem) window.pushTickerItem(amount);
    trackAction('qris_success_auto', { amount });
}

function closeQrisModal() {
    // Jika user tutup modal setelah >15 detik (sudah scan), asumsikan SUKSES
    if (qrisTimeLeft <= 5 && qrisTimerInterval) {
        handleQrisSuccess();
    }
    
    if (qrisTimerInterval) clearInterval(qrisTimerInterval);
    $('qris-modal')?.classList.remove('active');
    if ($('qris-modal')) $('qris-modal').style.display = 'none';
}

// Global Delegation for Sedekah & QRIS
document.body.addEventListener('click', (e) => {
    // Cari target terdekat yang memiliki class/ID yang kita cari
    const quickBtn = e.target.closest('.quick-btn');
    const impactBtn = e.target.closest('#impact-cta-btn');
    const payBtn = e.target.closest('#bayar-sekarang');
    
    // 1. Quick Sedekah Buttons
    if (quickBtn) {
        // Jika ini tombol "Nominal Bebas" (link jangkar), jangan buka modal
        if (quickBtn.classList.contains('btn-smooth-scroll')) {
            const targetSection = $('impact-viz');
            const sliderBox = document.querySelector('.impact-slider-box');
            
            if (targetSection) {
                targetSection.classList.add('glow-focus');
                if (sliderBox) sliderBox.classList.add('highlight');
                
                setTimeout(() => {
                    targetSection.classList.remove('glow-focus');
                    if (sliderBox) sliderBox.classList.remove('highlight');
                }, 2500);
            }
            return; // Biarkan browser melakukan smooth scroll bawaan
        }

        const amount = quickBtn.getAttribute('data-amount') || '0';
        const amtNum = parseInt(amount);
        if (amtNum > 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            openQrisModal(amtNum);
            return;
        }
    }

    // 2. Impact CTA (from slider)
    if (impactBtn) {
        const amount = parseInt($('impact-slider')?.value) || 0;
        if (amount > 0) {
            e.preventDefault();
            e.stopImmediatePropagation();
            openQrisModal(amount);
            return;
        }
    }

    // 3. Calculator result / Custom Pay Button
    if (payBtn) {
        const text = payBtn.textContent.toLowerCase();
        // Cek apakah tombol ini adalah untuk zakat (kalkulator)
        if (text.includes('zakat')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            const amtRaw = $('result-amount')?.textContent.replace(/\D/g, '') || '0';
            const amount = parseInt(amtRaw) || 0;
            
            // Broadcast ke Live Ticker (Motivasi Gen-Z)
            if (window.pushTickerItem) {
                const zakatMsg = `🕌 GUE: Sedang memproses Zakat Maal via Bot Telegram! ⚡`;
                // Panggil fungsi ticker dengan pesan custom (jika didukung) atau gunakan default logic
                window.pushTickerItem(amount, zakatMsg);
            }
            
            // Nyalakan Bintang Emas
            updateStreak();
            
            // Notifikasi Perayaan
            showToast('Niat Zakatmu tercatat & disaksikan dunia! 🕌✨');
            
            // Jeda sebentar biar kelihatan keren, lalu pindah ke Telegram
            setTimeout(() => {
                window.open(payBtn.href, '_blank');
            }, 1200);
            return;
        }

        // Jalankan QRIS Sedekah untuk tombol non-zakat lainnya
        const triggers = ['sedekah', 'infaq', 'donasi', 'bayar'];
        const isMatch = triggers.some(t => text.includes(t));
        if (isMatch) {
            const amtRaw = $('result-amount')?.textContent.replace(/\D/g, '') || '0';
            const amount = parseInt(amtRaw) || 0;
            if (amount > 0) {
                e.preventDefault();
                e.stopImmediatePropagation();
                openQrisModal(amount);
                return;
            }
        }
    }

    // Modal close triggers
    if (e.target.id === 'close-qris' || e.target.id === 'qris-modal') {
        closeQrisModal();
    }
    
    const qrisBtn = e.target.closest('#qris-done-btn');
    if (qrisBtn) {
        const amtRaw = $('qris-amount-display')?.textContent.replace(/\D/g, '') || '0';
        const amount = parseInt(amtRaw) || 0;
        
        closeQrisModal();
        showToast('Alhamdulillah, sedekahmu sedang kami proses! 💚');
        updateStreak();
        
        // PUSH KE TICKER (Real Data for this user)
        if (window.pushTickerItem) window.pushTickerItem(amount);
        
        trackAction('qris_done', { amount });
    }
}, true); // Use capture phase

//  STREAK TRACKER 
(function initStreak() {
  const KEY = 'harfa_streak';
  const data = JSON.parse(localStorage.getItem(KEY) || '{"streak":0,"lastDate":"","days":[]}');

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 864e5).toISOString().split('T')[0];

  // Auto-simulate: tambah hari jika belum hari ini (untuk demo)
  // Di production: cek via API apakah user sudah transaksi hari ini
  if (data.lastDate === yesterday) {
    // Mungkin streak lanjut (tidak auto-tambah, tunggu aksi user)
  } else if (data.lastDate !== today && data.lastDate !== yesterday) {
    // Streak putus
    data.streak = 0;
    data.days = [];
  }

  renderStreak(data);

  function renderStreak(d) {
    const streakNumEl = $('streak-num');
    const streakMsgEl = $('streak-msg');
    const daysEl = $('streak-days');
    if (!daysEl) return;

    if (streakNumEl) streakNumEl.textContent = d.streak;

    // Render 7 kotak hari
    daysEl.innerHTML = '';
    const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    for (let i = 0; i < 7; i++) {
      const el = document.createElement('div');
      el.className = 'streak-day';
      el.textContent = dayNames[i];
      if (i < d.streak && d.streak > 0) el.classList.add('done');
      if (i === Math.min(d.streak, 6)) el.classList.add('today');
      daysEl.appendChild(el);
    }

    // Pesan motivasi
    const msgs = {
      0: 'Mulai streakmu hari ini! ',
      1: 'Hari pertama! Awal yang baik ',
      2: 'Keren! 2 hari berturut-turut ',
      3: 'Kamu dapat badge Starter ',
      5: 'Sudah setengah jalan menuju 7 hari! ',
      7: 'LUAR BIASA! Kamu raih badge On Fire! ',
    };
    if (streakMsgEl) {
      streakMsgEl.textContent = msgs[d.streak] || `${d.streak} hari! Terus semangat `;
    }

    // Badge unlock
    if (d.streak >= 3) $('badge-3')?.classList.add('unlocked');
    if (d.streak >= 7) $('badge-7')?.classList.add('unlocked');
    if (d.streak >= 30) $('badge-30')?.classList.add('unlocked');
    if (d.streak >= 100) $('badge-100')?.classList.add('unlocked');
  }
})();

//  IMPACT VISUALIZER 
const IMPACT_DATA = [
  { emoji: '', label: 'porsi makan anak yatim', cost: 5000 },
  { emoji: '', label: 'hari buku pelajaran', cost: 10000 },
  { emoji: '', label: 'kunjungan periksa dokter', cost: 25000 },
  { emoji: '', label: 'paket obat 1 minggu', cost: 20000 },
  { emoji: '', label: 'hari tempat tinggal layak', cost: 15000 },
];

function renderImpactCards(amount) {
  const container = $('impact-cards-row');
  if (!container) return;
  container.innerHTML = '';

  IMPACT_DATA.forEach(item => {
    const count = Math.max(0, Math.floor(amount / item.cost));
    if (count === 0) return;
    const card = document.createElement('div');
    card.className = 'impact-card';
    card.innerHTML = `
      <div class="impact-card-emoji">${item.emoji}</div>
      <div class="impact-card-count">${count}</div>
      <div class="impact-card-label">${item.label}</div>
    `;
    container.appendChild(card);
  });
}

const slider = $('impact-slider');
if (slider) {
  slider.addEventListener('input', () => {
    const val = parseInt(slider.value);
    const display = $('impact-amount-display');
    if (display) display.textContent = 'Rp ' + val.toLocaleString('id-ID');
    renderImpactCards(val);
  });
  renderImpactCards(50000); // default
}

//  CTA NOTE update (hapus angka tidak update) 
const ctaNote = document.querySelector('.cta-note');
if (ctaNote) ctaNote.innerHTML = 'Proses <strong>2 menit</strong>  Langsung via Telegram  100% Tersalurkan ';

// ── STREAK TRACKER SYSTEM (WITH OBFUSCATION) ─────────────────
const STK_KEY = 'k_z_meta_v3';

function getStkData() {
  try {
    const raw = localStorage.getItem(STK_KEY);
    if (!raw) return { c: 0, d: null };
    // Simple Decrypt (Base64)
    const decoded = JSON.parse(atob(raw));
    return decoded;
  } catch (e) {
    return { c: 0, d: null };
  }
}

function setStkData(count, date) {
  const data = { c: count, d: date };
  const encoded = btoa(JSON.stringify(data));
  localStorage.setItem(STK_KEY, encoded);
}

function initStreak() {
  const data = getStkData();
  const streakCountEl = $('streak-count');
  const starDone = $('star-done');
  const today = new Date().toISOString().split('T')[0];
  
  if (streakCountEl) streakCountEl.textContent = data.c || 0;
  
  // Tampilkan badge bintang jika sudah sedekah hari ini
  if (starDone) {
    if (data.d === today) {
      starDone.style.display = 'flex';
    } else {
      starDone.style.display = 'none';
    }
  }
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const data = getStkData();

  // Jika sudah sedekah hari ini, tetap panggil init agar badge menyala
  if (data.d === today) {
    initStreak();
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newCount = data.c || 0;
  if (data.d === yesterdayStr) {
    newCount++; // Streak berlanjut
  } else {
    newCount = 1; // Mulai baru atau reset
  }

  setStkData(newCount, today);
  initStreak();
  checkMilestone(newCount);
}

function checkMilestone(count) {
  if (count === 3 || count === 7) {
    const modal = $('streak-modal');
    const daysEl = $('milestone-days');
    if (modal && daysEl) {
      daysEl.textContent = count;
      modal.style.display = 'flex';
    }
  }
}

$('close-streak')?.addEventListener('click', () => {
  $('streak-modal').style.display = 'none';
});

$('share-streak-btn')?.addEventListener('click', () => {
  const data = getStkData();
  const text = `🔥 Gue baru aja tembus ${data.c}-Day Kindness Streak di Kuy Zakat! ✨\n\nIkutan challenge-nya di sini: ${SHARE_URL}?ref=${USER_ID}`;
  shareContent(text);
});

// Attach streak to all donation buttons
document.querySelectorAll('a[href*="t.me/lazharfa_tele_bot"]').forEach(btn => {
  btn.addEventListener('click', updateStreak);
});

initStreak();

