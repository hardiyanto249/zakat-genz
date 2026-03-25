import os

filepath = 'D:/Users/Yan/project/clawdbot/lazharfa-landing/index.html'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

missing_block = """
        <div class="hero-bg">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
        </div>
        <div class="container">
            <div class="badge-pill" id="badge-pill">
                <span class="badge-dot"></span>
                Syawal 1447H · Zakat Sat Set ✨
            </div>
            <h1 class="hero-title">
                Udah tau <span class="gradient-text">zakat lo</span> tahun ini berapa? 🤔
            </h1>
            <p class="hero-sub">
                Zakat itu kewajiban, ngeceknya cukup rebahan aja kok. Hitung dalam <strong>2 menit</strong>, laporan transparan, langsung scan QRIS. Nggak pake ribet!
            </p>
            <div class="hero-cta-group">
                <a href="#kalkulator" class="btn btn-primary btn-lg" id="hero-cta-calc">
                    Hitung Zakatku Sekarang 🧮
                </a>
                <a href="https://t.me/lazharfa_tele_bot?start=BNTN27" target="_blank" class="btn btn-ghost btn-lg"
                    id="hero-cta-bot">
                    Buka Bot Telegram →
                </a>
            </div>

        </div>
    </section>

    <!-- ── TRUST BAR ─────────────────────────────────────────────────────────────── -->
    <div class="trust-bar">
        <div class="trust-inner">
            <span>✅ Terverifikasi BAZNAS</span>
            <span>🔒 100% Tersalurkan (No Potongan Aneh-Aneh)</span>
            <span>📊 Laporan Super Transparan</span>
            <span>⚡ Sat Set Cuma 2 Menit</span>
            <span>📱 Support QRIS, GoPay, OVO</span>
            <!-- duplicate for infinite scroll -->
            <span>✅ Terverifikasi BAZNAS</span>
            <span>🔒 100% Tersalurkan (No Potongan Aneh-Aneh)</span>
            <span>📊 Laporan Super Transparan</span>
            <span>⚡ Sat Set Cuma 2 Menit</span>
            <span>📱 Support QRIS, GoPay, OVO</span>
        </div>
    </div>

    <!-- ── KALKULATOR ────────────────────────────────────────────────────────────── -->
    <section class="section" id="kalkulator">
        <div class="container">
            <div class="section-header">
                <h2>Kalkulator Zakat <span class="gradient-text">Paling Sat Set</span> ⚡</h2>
                <p>Input gaji/aset kamu di bawah — algoritma kami yang ngitungin semuanya</p>
            </div>

            <div class="calc-wrapper">
                <!-- TAB -->
                <div class="calc-tabs" role="tablist">
                    <button class="calc-tab active" id="tab-penghasilan" data-tab="penghasilan" role="tab">
                        💼 Zakat Penghasilan
                    </button>
                    <button class="calc-tab" id="tab-maal" data-tab="maal" role="tab">
                        💰 Zakat Maal
                    </button>
                    <button class="calc-tab" id="tab-fitrah" data-tab="fitrah" role="tab" style="display:none;">
                        🌾 Zakat Fitrah
                    </button>
                </div>

                <!-- PANEL: PENGHASILAN -->
                <div class="calc-panel active" id="panel-penghasilan">
                    <div class="calc-form">
                        <div class="form-group">
                            <label for="gaji">Gaji Bulanan (Gaji Pokok + Bonus / Freelance)</label>
                            <div class="input-wrap">
                                <span class="input-prefix">Rp</span>
                                <input type="text" id="gaji" placeholder="5.000.000" inputmode="numeric" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="tunjangan">Tunjangan & Pendapatan Lain</label>
                            <div class="input-wrap">
                                <span class="input-prefix">Rp</span>
                                <input type="text" id="tunjangan" placeholder="0" inputmode="numeric" />
                            </div>
                        </div>
                        <div class="nisab-info" id="nisab-info-penghasilan">
                            <span class="nisab-label">Nisab Zakat Penghasilan 2026</span>
                            <span class="nisab-value">Rp 7.900.000 / bulan</span>
                            <span class="nisab-note">(85gr emas × harga emas saat ini)</span>
                        </div>
                        <button class="btn btn-primary btn-full" id="hitung-penghasilan">
                            Cek Zakat Penghasilan Gue →
                        </button>
                    </div>
                </div>

                <!-- PANEL: MAAL -->
                <div class="calc-panel" id="panel-maal">
                    <div class="calc-form">
                        <div class="form-group">
                            <label for="tabungan">Total Aset Tabungan, Saham & Investasi</label>
                            <div class="input-wrap">
                                <span class="input-prefix">Rp</span>
                                <input type="text" id="tabungan" placeholder="10.000.000" inputmode="numeric" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="emas">Nilai Emas / Perak yang Dimiliki</label>
                            <div class="input-wrap">
                                <span class="input-prefix">Rp</span>
                                <input type="text" id="emas" placeholder="0" inputmode="numeric" />
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="hutang">Hutang yang Jatuh Tempo</label>
                            <div class="input-wrap">
                                <span class="input-prefix">Rp</span>
                                <input type="text" id="hutang" placeholder="0" inputmode="numeric" />
                            </div>
                        </div>
                        <div class="nisab-info" id="nisab-info-maal">
                            <span class="nisab-label">Nisab Zakat Maal 2026</span>
                            <span class="nisab-value">Rp 94.800.000 / tahun</span>
                            <span class="nisab-note">(85gr emas, sudah haul 1 tahun)</span>
                        </div>
                        <button class="btn btn-primary btn-full" id="hitung-maal">
                            Cek Zakat Maal Gue →
                        </button>
                    </div>
                </div>

                <!-- PANEL: FITRAH -->
                <div class="calc-panel" id="panel-fitrah" style="display:none;">
                    <div class="calc-form">
                        <div class="form-group">
                            <label for="jiwa">Jumlah Jiwa dalam Keluarga</label>
                            <div class="input-counter">
                                <button class="counter-btn" id="minus-jiwa" aria-label="Kurang">−</button>
                                <input type="number" id="jiwa" value="1" min="1" max="20" readonly />
                                <button class="counter-btn" id="plus-jiwa" aria-label="Tambah">+</button>
                            </div>
                        </div>
                        <div class="nisab-info">
                            <span class="nisab-label">Nominal Zakat Fitrah LAZ Harfa 2026</span>
                            <span class="nisab-value">Rp 45.000 / jiwa</span>
                            <span class="nisab-note">(Ditetapkan oleh LAZ Harfa)</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" id="hitung-fitrah">
                        Cek Zakat Fitrah Gue →
                    </button>
                </div>
            </div>

            <!-- HASIL -->
            <div class="calc-result hidden" id="calc-result">
                <div class="result-header">
                    <span class="result-icon">✨</span>
                    <div>
                        <div class="result-label">Zakat Yang Harus Lo Keluarin:</div>
                        <div class="result-amount" id="result-amount">Rp 0</div>
                    </div>
                </div>
                <p class="result-desc" id="result-desc"></p>
                <div class="result-actions">
                    <a href="https://t.me/lazharfa_tele_bot?start=BNTN27" target="_blank"
                        class="btn btn-primary btn-full" id="bayar-sekarang">
                        💚 Bayar Zakat Sekarang via Bot
                    </a>
                    <button class="btn btn-outline btn-full" id="share-result">
                        📤 Share Hasil ke Teman
                    </button>
                </div>
                <div class="result-note">
                    🔍 Tenang aja, dana lo langsung disalurin & laporannya 100% transparan
                </div>
            </div>
        </div>
    </section>

    <!-- ── LIVE TICKER ───────────────────────────────────────────────────────────── -->
    <div class="live-ticker" id="live-ticker">
        <div class="ticker-dot"></div>
        <span class="ticker-label">🔴 LIVE</span>
        <div class="ticker-track" id="ticker-track">
            <div class="ticker-item">Raka dari Jaksel abis checkout Zakat Penghasilan 💸</div>
            <div class="ticker-item">Nadia dari Bandung baru aja sedekah rutin Rp 25.000 ✅</div>
            <div class="ticker-item">Bima (Freelancer) dari Bali nunai-in Zakat Maal-nya 💚</div>
            <div class="ticker-item">Alya abis dapet rezeki, langsung sedekah Rp 50.000 ✨</div>
            <div class="ticker-item">Dimas pakai QRIS GoPay buat bayar Zakat Maal 🔥</div>
        </div>
        <span class="ticker-count" id="ticker-today">47 sedekah hari ini</span>
    </div>

"""

start_str = '    <section class="hero" id="hero">'
end_str = '    <!-- â”€â”€ QUICK SEDEKAH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->'

idx1 = text.find(start_str)
idx2 = text.find(end_str)

if idx1 != -1 and idx2 != -1:
    new_text = text[:idx1 + len(start_str)] + "\n" + missing_block + text[idx2:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Injection successful.")
else:
    print("Could not find injection boundaries.")
