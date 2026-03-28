/* ═══════════════════════════════════════════════════════════
   LAZ HARFA — Landing Page JavaScript
   Kalkulator Zakat + Lead Generation Interactions
   ═══════════════════════════════════════════════════════════ */

'use strict';

// ── CONSTANTS ─────────────────────────────────────────────────
const NISAB_PENGHASILAN_BULANAN = 7_900_000;   // ~85gr emas / 12 bulan
const NISAB_MAAL_TAHUNAN = 94_800_000;  // 85gr emas
const NISAB_FITRAH_PER_JIWA = 45_000;  // LAZ Harfa 2026
const ZAKAT_RATE = 0.025;        // 2.5%
const BOT_URL = 'https://t.me/lazharfa_tele_bot?start=DONASI_BNTN27';
const SHARE_URL = window.location.href;
const SHARE_TEXT = '🌙 Hitung zakat kamu gratis, langsung bisa bayar via HP!\n\nLAZ Harfa — Amanah & Transparan\n👉 ';

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
  const text = `🎉 Baru hitung zakat pakai LAZ Harfa Bot!\nZakatku: ${amount}\n\nKamu juga bisa hitung di sini: ${SHARE_URL}`;
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
      title: 'LAZ Harfa — Kalkulator Zakat',
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
  // Simpan di localStorage untuk analitik sederhana
  const key = 'harfa_leads';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({
    event,
    data,
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    utm: Object.fromEntries(new URLSearchParams(window.location.search)),
  });
  localStorage.setItem(key, JSON.stringify(existing.slice(-50))); // simpan 50 terbaru

  // Kirim ke analytics jika ada (Google Analytics / Telegram webhook)
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
console.log('%c🌙 LAZ Harfa Landing Page Loaded', 'color: #8B5CF6; font-weight: bold; font-size: 14px;');
trackAction('page_view');

/* 
   GEN Z FEATURES  Interactive Logic
    */

//  LIVE TICKER 
(function initTicker() {
  const messages = [
    'Andi dari Jakarta baru saja sedekah Rp 25.000 ',
    'Siti dari Surabaya membayar Zakat Penghasilan ',
    'Fajar dari Bandung baru saja sedekah Rp 10.000 ',
    'Rahma dari Medan membayar Zakat Penghasilan ',
    'Dimas dari Yogya baru saja sedekah Rp 50.000 ',
    'Laila dari Makassar donasi Rp 15.000 ',
    'Hasan dari Semarang bayar Zakat Maal ',
    'Nisa dari Malang sedekah Rp 5.000 ',
    'Yusuf dari Depok sedekah Rp 100.000 ',
    'Zahra dari Bogor ikutan Sedekah Subuh ',
  ];

  const names = ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Yogya', 'Makassar', 'Semarang', 'Malang', 'Depok', 'Bogor', 'Palembang', 'Aceh', 'Lombok', 'Balikpapan'];
  const amounts = [5000, 10000, 15000, 25000, 50000];
  let idx = 0;
  let count = parseInt(localStorage.getItem('harfa_ticker_count') || '47');

  function nextTick() {
    const track = $('ticker-track');
    if (!track) return;

    // Random occasional new message
    if (Math.random() < 0.4) {
      const city = names[Math.floor(Math.random() * names.length)];
      const amt = amounts[Math.floor(Math.random() * amounts.length)];
      messages.push(`Seseorang dari ${city} baru saja sedekah Rp ${amt.toLocaleString('id-ID')} `);
      count++;
      const counterEl = $('ticker-today');
      if (counterEl) counterEl.textContent = count + ' sedekah hari ini';
      localStorage.setItem('harfa_ticker_count', String(count));
    }

    // Swap active item
    const items = track.querySelectorAll('.ticker-item');
    items.forEach(i => i.classList.remove('active'));

    // Create new item if needed
    const newItem = document.createElement('div');
    newItem.className = 'ticker-item';
    newItem.textContent = messages[idx % messages.length];
    track.innerHTML = '';
    track.appendChild(newItem);
    setTimeout(() => newItem.classList.add('active'), 50);

    idx++;
  }

  nextTick();
  setInterval(nextTick, 4000);
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

//  QUICK SEDEKAH BUTTONS 
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const amount = btn.getAttribute('data-amount') || '0';
    const card = btn.closest('.quick-card');
    const impact = card?.querySelector('.quick-impact')?.textContent || '';
    const amtNum = parseInt(amount);

    // Animasi klik
    btn.textContent = ' Oke!';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Sedekah ';
      btn.disabled = false;
    }, 2000);

    // Konfirmasi & arahkan ke bot dengan pesan
    const msg = encodeURIComponent(`SEDEKAH_${amtNum}`);
    const botUrl = `https://t.me/lazharfa_tele_bot?start=DONASI_BNTN27`;

    // Show mini confirmation
    showToast(` Rp ${amtNum.toLocaleString('id-ID')} ${impact}  Buka bot untuk konfirmasi!`, 3000);

    setTimeout(() => {
      window.open(botUrl, '_blank');
      trackAction('quick_sedekah', { amount: amtNum, impact });
    }, 500);
  });
});

$('quick-custom')?.addEventListener('click', () => {
  window.open('https://t.me/lazharfa_tele_bot?start=DONASI_BNTN27', '_blank');
  trackAction('quick_custom');
});

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
