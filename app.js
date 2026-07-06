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
const BOT_URL = 'https://lazharfa.org/campaign/zakat-harta-maal?ref=b9pqi';

// ── PROGRAMS MAP (LazHarfa.org referral URLs BNTN27) ──────────
const PROGRAMS = {
  'zakat-maal':     { name: 'Zakat Maal',               url: 'https://lazharfa.org/campaign/zakat-harta-maal?ref=b9pqi' },
  'zakat-profesi':  { name: 'Zakat Profesi',             url: 'https://lazharfa.org/campaign/zakat-profesi?ref=819ve' },
  'sedekah-subuh':  { name: 'Infak Sedekah Shubuh',      url: 'https://lazharfa.org/campaign/sedekah-subuh?ref=6q11y' },
  'banjir-banten':  { name: 'Darurat Banjir Banten',     url: 'https://lazharfa.org/campaign/darurat-banten-dikepung-banjir?ref=kx901' },
  'palestina':      { name: 'Pulihkan Palestina',         url: 'https://lazharfa.org/campaign/pulihkankembalipalestina?ref=5lbvu' },
  'wakaf-sumur':    { name: 'Wakaf Sumur',                url: 'https://lazharfa.org/campaign/wakafsumur?ref=mrz76' },
  'quran-pelosok':  { name: 'Wakaf Al-Quran Pelosok',    url: 'https://lazharfa.org/campaign/wakaf-al-quran-untuk-penyintas-bencana-dan-pelosok?ref=659fs' },
  'jariyah-quran':  { name: 'Sedekah Jariyah Al-Quran',  url: 'https://lazharfa.org/campaign/sedekah-jariyah-al-qur-39-an-investasi-abadi-untuk-akhirat?ref=sugkx' },
  'sepeda':         { name: 'Harapan di Balik Sepeda',   url: 'https://lazharfa.org/campaign/setiap-kayuhan-sepedanya-adalah-harapan-untuk-keluarga?ref=6ms5h' },
  'pemulung':       { name: 'Bantu Keluarga Pemulung',   url: 'https://lazharfa.org/campaign/satu-keluarga-jadi-pemulung-bantu-mereka-hidup-layak?ref=5qpe7' },
};
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
    $('bayar-sekarang').innerHTML = '<strong>DONASI SEKARANG</strong>';
    $('bayar-qris-direct').style.display = 'block';
  } else {
    $('result-amount').textContent = formatRp(zakat) + ' / bulan';
    $('result-desc').textContent =
      `Dari penghasilan ${formatRp(total)}/bulan, zakatmu adalah 2.5% = ${formatRp(zakat)}/bulan ` +
      `atau ${formatRp(zakat * 12)}/tahun. Alhamdulillah! 🎉`;
    $('bayar-sekarang').innerHTML = '<strong>BAYAR ZAKAT SEKARANG</strong>';
    $('bayar-qris-direct').style.display = 'block';
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
    $('bayar-sekarang').innerHTML = '<strong>DONASI SEKARANG</strong>';
  } else {
    $('result-amount').textContent = formatRp(zakat) + ' / tahun';
    $('result-desc').textContent =
      `Dari harta bersih ${formatRp(total)}, zakatmu adalah 2.5% = ${formatRp(zakat)}/tahun. ` +
      `Segera tunaikan ya, insyaAllah rezekimu semakin berkah! 🌟`;
    $('bayar-sekarang').innerHTML = '<strong>BAYAR ZAKAT SEKARANG</strong>';
  }

  trackAction('hitung_maal', { total, zakat });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// ── QUICK AMOUNT CARDS IMPACT FIRST ──────────────────────────
(function impactFirstCopy() {
    const impactMap = {
        'quick-10k': '🤲 Kirim 2 Porsi Makan →',
        'quick-25k': '🤲 Beri 5 Buku Pelajaran →',
        'quick-50k': '🌊 Bantu Korban Bencana →',
        'quick-100k': '💧 Bangun Wakaf Sumur →',
        'quick-250k': '💧 Alirkan Air Jariyah →'
    };
    for (const [id, text] of Object.entries(impactMap)) {
        const el = $(id);
        if (el) el.textContent = text;
    }
})();

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

  // 2. Kirim ke Firebase (Cloud Analytics)
  if (db) {
    try {
        db.ref('analytics').push({
            event, data, timestamp: time,
            ua: navigator.userAgent.substring(0, 50),
            ref: document.referrer || 'direct'
        });
    } catch(e) { console.warn('Analytics push failed:', e); }
  }
}

// ── STREAK TRACKER SYSTEM ────────────────────────────────────
const STK_KEY = 'k_z_meta_v3';
function getStkData() {
  try {
    const raw = localStorage.getItem(STK_KEY);
    if (!raw) return { c: 0, d: null };
    return JSON.parse(atob(raw));
  } catch (e) { return { c: 0, d: null }; }
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
  if (starDone) starDone.style.display = (data.d === today) ? 'flex' : 'none';
}
function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const data = getStkData();
  if (data.d === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  let newCount = (data.d === yesterdayStr) ? (data.c + 1) : 1;
  setStkData(newCount, today);
  initStreak();
  if (newCount === 3 || newCount === 7) {
    const modal = $('streak-modal');
    if (modal) {
        $('milestone-days').textContent = newCount;
        modal.style.display = 'flex';
    }
  }
}

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
    
    if (progressBox) progressBox.style.display = 'block';
    if (progressFill) progressFill.style.width = '0%';
    if (timerSec) timerSec.textContent = '20';

    if (qrisTimerInterval) clearInterval(qrisTimerInterval);
    qrisTimeLeft = 20;

    qrisTimerInterval = setInterval(() => {
        qrisTimeLeft--;
        if (timerSec) timerSec.textContent = qrisTimeLeft;
        const percent = ((20 - qrisTimeLeft) / 20) * 100;
        if (progressFill) progressFill.style.width = percent + '%';

        if (qrisTimeLeft <= 0) {
            clearInterval(qrisTimerInterval);
            if (progressBox) progressBox.style.display = 'none';
            if (doneBtn) {
                doneBtn.style.display = 'block';
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
    if (qrisTimeLeft <= 5 && qrisTimerInterval) handleQrisSuccess();
    if (qrisTimerInterval) clearInterval(qrisTimerInterval);
    $('qris-modal')?.classList.remove('active');
    if ($('qris-modal')) $('qris-modal').style.display = 'none';
}

// Global Delegation for Sedekah & QRIS
document.body.addEventListener('click', (e) => {
    const quickBtn = e.target.closest('.quick-btn');
    const impactBtn = e.target.closest('#impact-cta-btn');
    const payBtn = e.target.closest('#bayar-sekarang');
    const qrisDirectBtn = e.target.closest('#bayar-qris-direct');
    
    if (qrisDirectBtn) {
        const amtRaw = $('result-amount')?.textContent.replace(/\D/g, '') || '0';
        const amount = parseInt(amtRaw) || 0;
        if (amount > 0) openQrisModal(amount);
    }
    else if (quickBtn) {
        const amount = quickBtn.getAttribute('data-amount') || '0';
        const amtNum = parseInt(amount);
        if (amtNum > 0) openQrisModal(amtNum);
    }
    else if (impactBtn) {
        const amount = parseInt($('impact-slider')?.value) || 0;
        if (amount > 0) openQrisModal(amount);
    }
    else if (payBtn) {
        // Smart redirect: detect active calc tab → correct LazHarfa ref URL
        const activeTab = document.querySelector('.calc-tab.active');
        const tabKey = activeTab ? activeTab.getAttribute('data-tab') : 'penghasilan';
        let targetUrl = PROGRAMS['zakat-maal'].url; // default: Zakat Maal
        if (tabKey === 'profesi') targetUrl = PROGRAMS['zakat-profesi'].url;
        else if (tabKey === 'fitrah') targetUrl = PROGRAMS['sedekah-subuh'].url;
        updateStreak();
        window.open(targetUrl, '_blank');
        trackAction('bayar_kalkulator', { tab: tabKey, url: targetUrl });
    }

    if (e.target.id === 'close-qris' || e.target.id === 'qris-modal') closeQrisModal();
});

// ── TICKER SIMULATION ─────────────────────────────────────────
(function initTicker() {
    const names = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogya'];
    const amounts = [10000, 25000, 50000];
    function updateTickerDisplay(msg) {
        const track = $('ticker-track');
        if (track) track.innerHTML = `<div class="ticker-item active">${msg}</div>`;
    }
    setInterval(() => {
        const city = names[Math.floor(Math.random() * names.length)];
        const amt = amounts[Math.floor(Math.random() * amounts.length)];
        updateTickerDisplay(`Donatur dari ${city} baru saja sedekah Rp ${amt.toLocaleString('id-ID')} via QRIS 📸`);
    }, 5000);
    
    window.pushTickerItem = function(amount) {
        updateTickerDisplay(`🌟 <strong>GUE:</strong> Baru saja sedekah Rp ${amount.toLocaleString('id-ID')} via QRIS Sat Set! 🚀`);
    };
})();

// Initial Setup
initStreak();
