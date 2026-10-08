    const $  = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
    const rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
    const arrow = text => `${text} <span class="ar">→</span>`;

    const ST = (key, value) => {
      try {
        if (value === undefined) return JSON.parse(localStorage.getItem(key));
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        return null;
      }
    };

    const toast = msg => {
      const t = $('#toast');
      t.textContent = msg;
      t.classList.add('v');
      setTimeout(() => t.classList.remove('v'), 2600);
    };

   const SV = [
  ['desain-3d-interior', 'Desain 3D Interior', 80000, 'Interior', '◧',
    'Visualisasi 3D interior realistis dengan material dan pencahayaan sesuai konsep Anda.',
    ['Render 3D multi-sudut', 'Moodboard & palet material', 'Revisi 2x', 'Layout furnitur'],
    GALERY.layanan['desain-3d-interior']],
  ['desain-3d-bangunan', 'Desain 3D Bangunan', 50000, 'Arsitektur', '⌂',
    'Desain fasad dan massa bangunan 3D modern yang siap diajukan PBG.',
    ['Denah & tampak', 'Render eksterior', 'Animasi walkthrough singkat', 'Revisi 2x'],
    GALERY.layanan['desain-3d-bangunan']],
  ['bestek-gambar-kerja', 'Bestek / Gambar Kerja', 80000, 'Dokumen', '▤',
    'Gambar kerja DED dan spesifikasi teknis lengkap untuk pelaksanaan.',
    ['Gambar kerja arsitektur', 'Detail konstruksi', 'Spesifikasi material (bestek)', 'Format PDF & DWG'],
    GALERY.layanan['bestek-gambar-kerja']],
  ['analisis-struktur', 'Analisis Struktur', 50000, 'Engineering', '△',
    'Perhitungan struktur mengacu SNI 1726 tahan gempa.',
    ['Model struktur 3D', 'Laporan perhitungan', 'Gambar penulangan', 'Verifikasi SNI 1726'],
    GALERY.layanan['analisis-struktur']],
  ['estimasi-rab', 'Estimasi RAB', 40000, 'Dokumen', '≡',
    'Rincian anggaran biaya transparan per item pekerjaan.',
    ['Volume pekerjaan', 'Analisa harga satuan', 'RAB detail', 'Jadwal kurva-S'],
    GALERY.layanan['estimasi-rab']],
  ['paket-all-in', 'Paket All In', 250000, 'Design & Build', '✦',
    'Paket terpadu dari desain, struktur, RAB hingga dokumen siap izin.',
    ['Semua layanan desain', 'Dokumen PBG', 'Pendampingan konsultasi', 'Prioritas jadwal'],
    GALERY.layanan['paket-all-in']]
];

const PF = [
  ['rumah-tropis-dago', 'Rumah Tropis Dago', 'Desain Arsitektur', 'Bandung', 240, 2, 'Hunian', GALERY.portfolio['rumah-tropis-dago']],
  ['rumah-minimalis-buah-batu', 'Rumah Minimalis Buah Batu', 'Desain Arsitektur', 'Bandung', 150, 2, 'Hunian', GALERY.portfolio['rumah-minimalis-buah-batu']],
  ['ded-villa-lembang', 'DED Villa Lembang', 'Gambar Teknis DED', 'Lembang', 320, 2, 'Villa', GALERY.portfolio['ded-villa-lembang']],
  ['ded-rumah-cibiru', 'DED Rumah 2 Lantai Cibiru', 'Gambar Teknis DED', 'Bandung', 180, 2, 'Hunian', GALERY.portfolio['ded-rumah-cibiru']],
  ['ded-ruko-soreang', 'DED Ruko 3 Lantai Soreang', 'Gambar Teknis DED', 'Soreang', 270, 3, 'Ruko', GALERY.portfolio['ded-ruko-soreang']],
  ['kos-gsh-antapani', 'Kos GSH Antapani', 'Bangunan Jadi', 'Bandung', 480, 3, 'Kos', GALERY.portfolio['kos-gsh-antapani']],
  ['ruko-cimahi', 'Ruko Cimahi', 'Bangunan Jadi', 'Cimahi', 360, 3, 'Ruko', GALERY.portfolio['ruko-cimahi']],
  ['interior-master-suite', 'Master Suite Japandi', 'Interior & Woodworking', 'Bandung', 42, 1, 'Interior', GALERY.portfolio['interior-master-suite']],
  ['kitchen-set-japandi', 'Kitchen Set Japandi', 'Interior & Woodworking', 'Bandung', 18, 1, 'Kitchen Set', GALERY.portfolio['kitchen-set-japandi']],
  ['walk-in-closet', 'Walk-in Closet Woodworking', 'Interior & Woodworking', 'Bandung', 12, 1, 'Woodworking', GALERY.portfolio['walk-in-closet']]
];

  const JR = [
    ['Konsultasi Kebutuhan', 'Diskusi tujuan, budget, dan gaya bangunan bersama tim kami.', '1–2 hari', ['Brief proyek tertulis', 'Gambaran biaya awal', 'Jadwal survei']],
    ['Survey Lahan', 'Pengukuran lahan, kondisi tanah, dan regulasi setempat.', '2–5 hari', ['Data ukur lahan', 'Catatan kondisi tanah', 'Cek GSB/KDB/KLB']],
    ['Konsep & 3D', 'Konsep massa dan render 3D untuk disetujui.', '1–2 minggu', ['Denah & tampak', 'Render 3D eksterior/interior', 'Revisi 2x']],
    ['DED & Struktur', 'Gambar kerja detail dan analisis struktur SNI 1726.', '2–3 minggu', ['Gambar kerja DED', 'Perhitungan struktur', 'Dokumen PBG']],
    ['RAB & Material', 'Rincian biaya dan pemilihan material transparan.', '1 minggu', ['RAB detail', 'Spesifikasi material', 'Jadwal kurva-S']],
    ['Eksekusi', 'Pembangunan dengan pengawasan berkala.', 'sesuai jadwal', ['Laporan progres berkala', 'Pengawasan mutu', 'Dokumentasi foto']],
    ['Serah Terima', 'Inspeksi akhir dan serah terima kunci.', '1–3 hari', ['Daftar periksa akhir (punch list)', 'Gambar as-built', 'Serah terima kunci']]
  ];

    const FQ = [
      ['Berapa lama proses desain?', 'Umumnya 2–4 minggu tergantung luas dan kompleksitas bangunan.'],
      ['Apakah dokumen siap PBG?', 'Ya, kami menjamin kelayakan dokumen PBG 100% sesuai standar.'],
      ['Apakah struktur mengikuti SNI?', 'Analisis struktur mengacu SNI 1726 untuk ketahanan gempa.'],
      ['Bagaimana cara reservasi?', 'Pilih layanan di halaman Reservasi, tentukan jadwal, lalu isi data Anda.'],
      ['Apakah harga sudah termasuk revisi?', 'Ya, tersedia revisi sesuai paket pada halaman detail layanan.'],
      ['Bisa konsultasi via WhatsApp?',
        `Bisa, hubungi <a href='https://wa.me/6285723405913?text=Halo%20Freespace%20Building%2C%20saya%20ingin%20berkonsultasi.' target='_blank' rel='noopener' style='color:var(--ac);font-weight:600'>+62 857-2340-5913</a> pada jam kerja.`],
      ['Apa itu Simulasi Konsultasi?', 'Anda mencentang pilihan kebutuhan, lalu sistem menghitung profil gaya, prioritas, dan estimasi biaya dalam bentuk gambar yang bisa diunduh.'],
      ['Apa saja yang bisa disimulasikan?', 'Desain interior, kitchen set, dan facade bangunan — masing-masing dengan estimasi biaya.'],
      ['Apakah harga di Pricelist sudah final?', 'Harga bersifat estimasi per m². Nilai akhir dipastikan setelah konsultasi dan survei.']
    ];
     
    const TM = [
  ['FARIS MUHAMMAD SIDIQ', 'DIREKTUR UTAMA', '10 thn', 'Arsitektur, Desain', GALERY.tim['FARIS MUHAMMAD SIDIQ']],
  ['MUZQY ZIBRAN IBRANI', 'SITE MANAGER KONSTRUKSI', '15 thn', 'Struktur, SNI 1726', GALERY.tim['MUZQY ZIBRAN IBRANI']],
  ['SASKA DEWINTY', ' PROJECT MANAGER ARSITEK', '12 thn', 'Interior, Japandi', GALERY.tim['SASKA DEWINTY']],
  ['KINANTI RAMADHIANI SUGANDA', 'MANAGER FINANCE', '22 thn', 'Interior, Japandi', GALERY.tim['KINANTI RAMADHIANI SUGANDA']],
  ['SAFEER SAUMI', ' CIVIL ENGINEER AND DRAFTING', '22 thn', 'Interior, Japandi', GALERY.tim['SAFEER SAUMI']],
  ['FAHRI ARDIANSYAH', 'MANAGER PROCUREMENT', '22 thn', 'Interior, Japandi', GALERY.tim['FAHRI ARDIANSYAH']],
  ['RAYHAN KAIRI WIJAYA', 'AHLI MADYA STRUKTUR', '8 thn', 'Desain 3D, Render', GALERY.tim['RAYHAN KAIRI WIJAYA']],
  ['DADANG MULYANA', 'CIVIL ENGINEER', '9 thn', 'RAB, Kurva-S', GALERY.tim['DADANG MULYANA']],
];

const AR = [
  ['cara-menyusun-rab-rumah', 'Cara Menyusun RAB Rumah agar Tidak Membengkak', 'Anggaran', '28 Sep 2026', 5,
    'Langkah praktis menyusun rencana anggaran biaya yang realistis sebelum membangun.',
    ['RAB yang baik dimulai dari gambar kerja yang lengkap. Volume pekerjaan dihitung per item, lalu dikalikan harga satuan yang sesuai kondisi pasar di lokasi proyek.',
     'Sisihkan dana cadangan sekitar 5–10% untuk perubahan di lapangan, dan pisahkan pekerjaan struktur, arsitektur, dan finishing agar mudah dikontrol.',
     'Bandingkan RAB dengan jadwal kurva-S supaya arus kas pembayaran termin tetap terkendali.'],
    GALERY.layanan['estimasi-rab']],
  ['mengenal-sni-1726-tahan-gempa', 'Mengenal SNI 1726: Standar Bangunan Tahan Gempa', 'Struktur', '21 Sep 2026', 6,
    'Mengapa perhitungan struktur wajib mengikuti standar gempa Indonesia.',
    ['SNI 1726 mengatur perencanaan ketahanan gempa untuk struktur bangunan gedung. Wilayah Jawa Barat termasuk daerah dengan aktivitas gempa yang perlu diperhitungkan serius.',
     'Analisis struktur memodelkan beban gempa, beban mati, dan beban hidup, lalu hasilnya menentukan dimensi kolom, balok, dan penulangan.',
     'Hasilnya dituangkan dalam laporan perhitungan dan gambar penulangan yang menjadi dasar pelaksanaan di lapangan.'],
    GALERY.layanan['analisis-struktur']],
  ['gaya-japandi-untuk-hunian-kecil', 'Gaya Japandi untuk Hunian Kecil di Perkotaan', 'Interior', '14 Sep 2026', 4,
    'Perpaduan minimalis Jepang dan kehangatan Skandinavia yang cocok untuk ruang terbatas.',
    ['Japandi menekankan garis bersih, warna netral, dan material alami seperti kayu terang. Ruangan terasa lapang karena furnitur dipilih seperlunya.',
     'Gunakan kitchen set dan lemari built-in agar penyimpanan menyatu dengan dinding, lalu tambahkan satu aksen hangat lewat tekstil atau tanaman.'],
    GALERY.portfolio['kitchen-set-japandi']],
  ['dokumen-pbg-yang-perlu-disiapkan', 'Dokumen PBG yang Perlu Disiapkan Pemilik Rumah', 'Perizinan', '07 Sep 2026', 5,
    'Daftar umum dokumen untuk mengurus Persetujuan Bangunan Gedung.',
    ['PBG menggantikan IMB dan diajukan secara daring. Umumnya Anda perlu bukti kepemilikan tanah, identitas pemilik, gambar arsitektur, dan gambar struktur.',
     'Persyaratan bisa berbeda tiap daerah, jadi pastikan daftar terbaru ke dinas setempat. Paket All In kami membantu menyiapkan dokumen teknisnya.'],
    GALERY.layanan['paket-all-in']],
  ['3d-render-sebelum-membangun', 'Kenapa Perlu Desain 3D Sebelum Membangun', 'Desain', '01 Sep 2026', 4,
    'Visualisasi 3D membantu Anda memutuskan lebih cepat dan mengurangi revisi saat konstruksi.',
    ['Dengan render 3D, pemilik rumah bisa melihat fasad, tata ruang, dan material sebelum satu batu bata pun dipasang.',
     'Perubahan di tahap desain jauh lebih murah dibanding perubahan saat pembangunan berjalan.'],
    GALERY.layanan['desain-3d-bangunan']],
  ['memilih-kontraktor-yang-tepat', 'Tips Memilih Kontraktor yang Tepat', 'Konstruksi', '25 Agu 2026', 5,
    'Hal yang perlu dicek sebelum menandatangani kontrak pembangunan.',
    ['Minta portofolio proyek sejenis dan kunjungi lokasi yang sudah selesai. Pastikan RAB, jadwal, dan spesifikasi material tertulis jelas dalam kontrak.',
     'Cek sistem pembayaran termin dan masa garansi pekerjaan agar hak Anda sebagai pemilik terlindungi.'],
    GALERY.portfolio['rumah-tropis-dago']]
];
const articleCard = (a, i) => `
  <a class="card tilt rvl" href="#/artikel/${a[0]}" data-c="${a[2]}" style="transition-delay:${(i % 3) * 70}ms">
    ${IM(i, a[7])}
    <small class="mu">${a[2]} · ${a[3]}</small>
    <h3>${a[1]}</h3>
    <p class="mu" style="margin:8px 0 14px">${a[5]}</p>
    <b style="color:var(--ac)">${arrow('Baca artikel')}</b>
  </a>`;
const IM = (i, src) => `
  <div class="img">
    <i><img src="${src || GALERY.placeholder}" alt="" loading="lazy" onerror="this.onerror=null;this.src=GALERY.placeholder"
      style="width:100%;height:100%;object-fit:cover"></i>
  </div>`;
    const ICO = {
      'desain-3d-interior': '<path class="f" d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3z"/><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13.5a2 2 0 0 1 4 0V16h10v-2.5a2 2 0 0 1 4 0V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M6 19v1.8M18 19v1.8"/>',
      'desain-3d-bangunan': '<path class="f" d="M12 2.8 20.2 7.4 12 12 3.8 7.4z"/><path d="M12 2.5l8.5 4.8v9.4L12 21.5l-8.5-4.8V7.3z"/><path d="M3.5 7.3 12 12l8.5-4.7M12 12v9.5"/>',
      'bestek-gambar-kerja': '<rect class="f" x="3" y="3.5" width="18" height="17" rx="2"/><rect x="3" y="3.5" width="18" height="17" rx="2"/><path d="M8 20.5v-7h8M8 13.5V9h5M13 3.5V9M16 13.5V9.5"/><path d="M5.5 7h.01"/>',
      'analisis-struktur': '<path class="f" d="M4 18 12 5l8 13z"/><path d="M4 18 12 5l8 13z"/><path d="M2.5 18h19M7.6 11.5h8.8M12 5v13"/><path d="M5 21h14"/>',
      'estimasi-rab': '<rect class="f" x="5" y="2.5" width="14" height="19" rx="2.2"/><rect x="5" y="2.5" width="14" height="19" rx="2.2"/><rect x="8" y="5.5" width="8" height="3.8" rx="1"/><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.8h.01M12 16.8h.01M15.5 16.8h.01" stroke-width="2.4"/>',
      'paket-all-in': '<path class="f" d="M12 3 21 8l-9 5-9-5z"/><path d="M12 3 21 8l-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 17l9 5 9-5"/>',
      'kontraktor': '<path class="f" d="M4 16a8 8 0 0 1 16 0z"/><path d="M4 16a8 8 0 0 1 16 0"/><rect x="2" y="16" width="20" height="3.6" rx="1.2"/><path d="M12 8.2V16M8.8 9.6 8 16M15.2 9.6 16 16"/>',
      'kitchen': '<rect class="f" x="3.5" y="3" width="17" height="18" rx="2"/><rect x="3.5" y="3" width="17" height="18" rx="2"/><path d="M3.5 12h17M10 7.5h4M10 16.5h4"/>',
      'facade': '<path class="f" d="M5 10.5 12 4l7 6.5V20H5z"/><path d="M3 11.5 12 3.5l9 8"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5.5h4V20"/>'
    };
    ICO.interior = ICO['desain-3d-interior'];
    const ico = k => `<svg class="ci" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICO[k] || ''}</svg>`;

    const serviceCard = (s, i) => `
      <a class="card tilt rvl" href="#/layanan/${s[0]}" data-c="${s[3]}" style="transition-delay:${i * 70}ms">
        <div class="cic">${ico(s[0])}</div>
        <h3>${s[1]}</h3>
        <div class="price">${rp(s[2])}<small style="font-size:.9rem">/m²</small></div>
        <p class="mu" style="margin:8px 0 14px">${s[5]}</p>
        <b style="color:var(--ac)">${arrow('Selengkapnya')}</b>
      </a>`;

    const KONTR = ['kontraktor-arsitek-bangunan', 'Kontraktor Arsitek & Bangunan', 'Konstruksi', '▣',
      'Bukan sekadar studio desain: kami eksekutor lapangan yang membangun rumah, ruko, kos, dan villa sesuai gambar kerja dan RAB yang disepakati.',
      ['Pelaksanaan pembangunan sesuai gambar kerja & bestek', 'Tim lapangan: pelaksana, mandor, dan tukang', 'Pengawasan berkala & laporan progres', 'Pengendalian mutu material dan biaya sesuai RAB', 'Serah terima & masa pemeliharaan'],
      GALERY.layanan['paket-all-in']];

    const NAV = [
      { k: '',          t: 'Home',      h: '#/' },
      { k: 'layanan',   t: 'Layanan',   h: '#/layanan', sub: [
          ['#/layanan', 'Semua Layanan', 'Lihat seluruh paket layanan', '☰'],
          ['#/layanan/' + KONTR[0], KONTR[1], 'Eksekutor lapangan', KONTR[3]],
          ...SV.map(v => ['#/layanan/' + v[0], v[1], v[3] + ' · ' + rp(v[2]) + '/m²', v[4]])
      ]},
      { k: 'portfolio', t: 'Portofolio', h: '#/portfolio' },
      { k: 'hitung',    t: 'Hitung',    sub: [
          ['#/pricelist',  'Pricelist',  'Harga layanan per m²', '≡'],
          ['#/kalkulator', 'Kalkulator', 'Hitung estimasi biaya', '▤'],
          ['#/simulasi',   'Simulasi',   'Simulasi interior & facade', '◧'],
          ['#/konsultasi', 'Konsultasi', 'Atur kebutuhan Anda', '✦']
      ]},
      { k: 'kerjasama', t: 'Kerjasama', h: '#/kerjasama', sub: [
          ['#/kerjasama',                  'Semua Kerjasama',            'Vendor, subkon & marketing', '☰'],
          ['#/kerjasama/vendor',           'Vendor / Subkon',            'Gabung sebagai mitra pelaksana', '▣'],
          ['#/kerjasama/marketing',        'Kerjasama Marketing',        'Skema fee 1% – 3%', '◈'],
          ['#/kerjasama/referensi',        'Referensi (1%)',             'Rekomendasikan klien', '◎'],
          ['#/kerjasama/sales-eksternal',  'Sales Eksternal & Handling (2%)', 'Dampingi klien sampai deal', '◈'],
          ['#/kerjasama/agency-badan',     'Agency / Badan Usaha (3%)',  'Salurkan proyek berkelanjutan', '▣']
      ]},
      { k: 'info',      t: 'Info',      sub: [
          ['#/artikel',           'Artikel',          'Tips desain & anggaran', '▣'],
          ['#/customer-journey',  'Customer Journey', '7 tahap dari ide hingga kunci', '◎'],
          ['#/faq',               'FAQ',              'Pertanyaan yang sering diajukan', '◈']
      ]},
      { k: 'reservasi', t: 'Reservasi', h: '#/reservasi', cta: true }
    ];
    const SUBS = Object.fromEntries(NAV.filter(n => n.sub).map(n => [n.k, n.sub]));
    const navPages = n => new Set([n.k, ...(n.sub || []).map(i => i[0].replace(/^#\/?/, '').split('/')[0])]);

    const contractorCard = (i = 0) => `
      <a class="card tilt rvl kt-card" href="#/layanan/${KONTR[0]}" data-c="${KONTR[2]}" style="transition-delay:${i * 70}ms">
        <div class="cic">${ico('kontraktor')}</div>
        <small class="mu">Eksekutor Lapangan</small>
        <h3>${KONTR[1]}</h3>
        <p class="mu" style="margin:8px 0 14px">${KONTR[4]}</p>
        <b style="color:var(--ac)">${arrow('Selengkapnya')}</b>
      </a>`;

    const serviceCardNoPrice = (s, i) => `
      <a class="card tilt rvl" href="#/layanan/${s[0]}" data-c="${s[3]}" style="transition-delay:${(i + 1) * 70}ms">
        <div class="cic">${ico(s[0])}</div>
        <h3>${s[1]}</h3>
        <p class="mu" style="margin:8px 0 14px">${s[5]}</p>
        <b style="color:var(--ac)">${arrow('Selengkapnya')}</b>
      </a>`;

    const portfolioCard = (p, i) => `
      <a class="card tilt rvl" href="#/portfolio/${p[0]}" data-c="${p[2]}">
       ${IM(i, p[7])}
        <small class="mu">${p[2]}</small>
        <h3>${p[1]}</h3>
        <p class="mu">${p[3]} · ${p[4]} m²</p>
        <b style="color:var(--ac)">${arrow('Lihat Project')}</b>
      </a>`;

    const pageHeader = (title, desc) => `
      <div class="sub">
        <div class="w">
          <h1>${title}</h1>
          <p style="opacity:.85;margin-top:10px;max-width:600px">${desc}</p>
        </div>
      </div>`;

    const chips = list =>
      `<div class="chips" id="fl">${list.map((c, i) => `<button class="chip ${i ? '' : 'on'}">${c}</button>`).join('')}</div>`;

    const R = {
      '': () => `
        <div class="hero home" id="hero">
          <video class="hv" id="hv" muted playsinline autoplay loop preload="auto"
                 poster="images/hero-poster.jpg" aria-hidden="true" tabindex="-1">
            <source src="video/hero.mp4" type="video/mp4">
            <source src="video/hero.webm" type="video/webm">
          </video>
          <div class="hov"></div>
          <div id="glow"></div>
          <div class="w"><div class="hcard">
            <h1>
              <span class="rv"><span>BUILD </span></span>
              <span class="rv"><span>YOUR SPACE.</span></span>
            </h1>
            <p class="fade" style="max-width:520px;margin:20px 0 32px;font-size:1.15rem;opacity:.9">
              Kontraktor arsitek &amp; bangunan, desain, interior, dan Design &amp; Build dari konsep hingga serah terima — transparan dan siap izin.
            </p>
            <div class="fade" style="display:flex;gap:14px;flex-wrap:wrap">
              <a class="btn" href="#/reservasi">${arrow('Reservasi Cepat')}</a>
              <a class="btn o" href="#/kalkulator">${arrow('Hitung Estimasi Biaya')}</a>
            </div>
          </div></div>
          <aside class="hnews" id="hnews" aria-label="Berita terkini">
            <button class="hx" id="hnx" type="button" aria-label="Tutup">&times;</button>
            <div class="hlist" id="hlist">
              ${AR.slice(0, 8).map(a => `
                <a class="hn" href="#/artikel/${a[0]}">
                  <span class="hb">${a[2]} · ${a[3]}</span>
                  <b>${a[1]}</b>
                  <small>${a[5]}</small>
                </a>`).join('')}
            </div>
            <div class="hfoot">
              <span class="hcnt" id="hcnt" aria-live="polite">1 / ${Math.min(AR.length, 8)}</span>
            </div>
          </aside>
        </div>

        <section id="about">
          <div class="w two" style="align-items:center">
            <div>
              <small class="mu rvl" style="letter-spacing:.14em;font-weight:700">ABOUT US</small>
              <h2 class="rvl" style="margin-top:6px">Kontraktor Arsitek &amp; Bangunan yang Mengeksekusi Langsung di Lapangan</h2>
              <p class="mu rvl" style="margin-top:14px">
                PT FREESPACE berbasis di Bandung. Kami bukan sekadar studio desain, melainkan kontraktor yang
                merencanakan sekaligus membangun: dari desain 3D, gambar kerja, struktur, dan RAB, sampai eksekusi
                pembangunan dan serah terima.
              </p>
              <p class="mu rvl" style="margin-top:10px">
                Satu tim dari konsep hingga bangunan jadi, sehingga desain, biaya, dan hasil di lapangan tetap selaras.
              </p>
              <div class="acts rvl" style="margin-top:22px;display:flex;gap:12px;flex-wrap:wrap">
                <a class="btn" href="#/layanan/${KONTR[0]}">${arrow('Layanan Kontraktor')}</a>
                <a class="btn l" href="#/portfolio">Lihat Portofolio</a>
              </div>
            </div>
            <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
              ${[['Perencana', 'Desain, struktur, RAB, dan dokumen PBG'], ['Pelaksana', 'Eksekusi bangunan oleh tim lapangan'],
                 ['Pengawas', 'Kontrol mutu, biaya, dan jadwal'], ['Serah Terima', 'Bangunan jadi, siap huni atau usaha']].map((a, i) => `
                <div class="card rvl" style="transition-delay:${i * 70}ms">
                  <h3>${a[0]}</h3>
                  <p class="mu" style="margin-top:6px">${a[1]}</p>
                </div>`).join('')}
            </div>
          </div>
        </section>

        <section style="background:var(--bg2)">
          <div class="w">
            <h2 class="rvl">Perencanaan Terpadu, Transparan, &amp; Siap Izin</h2>
            <div class="grid" style="margin-top:36px">${contractorCard(0)}${SV.map(serviceCardNoPrice).join('')}</div>
          </div>
        </section>

        <section class="dark">
          <div class="w stats rvl">
            <div><div class="n sv"><span data-c="150">0</span>+</div>Proyek Selesai</div>
            <div><div class="n sv"><span data-c="4.98" data-d="2">0</span>/5</div>Kepuasan Klien</div>
            <div>
              <div class="sv">
                <svg class="ring" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="8"/>
                  <circle class="rg" data-o="13.2" cx="50" cy="50" r="42" fill="none" stroke="#fff" stroke-width="8"
                          stroke-linecap="round" stroke-dasharray="264" stroke-dashoffset="264"
                          transform="rotate(-90 50 50)" style="transition:2s"/>
                  <text x="50" y="56" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">95%</text>
                </svg>
              </div>
              Kelayakan PBG
            </div>
          </div>
        </section>

        <section>
          <div class="w">
            <h2 class="rvl">Coba Simulasi Desain</h2>
            <p class="mu" style="margin-top:8px">Lihat konsep interior, kitchen set, dan facade Anda sebelum memulai proyek.</p>
            <div class="grid simg" style="margin-top:30px">
              ${HOME_SIM.map(h => `
                <a class="card tilt rvl" href="#/simulasi/${h[0]}">
                  <div class="cic">${ico(h[0])}</div>
                  <h3>${h[2]}</h3>
                  <p class="mu" style="margin:8px 0 14px">${h[3]}</p>
                  <b style="color:var(--ac)">${arrow('Coba Sekarang')}</b>
                </a>`).join('')}
            </div>
            <p style="margin-top:30px;display:flex;gap:12px;flex-wrap:wrap">
              <a class="btn" href="#/konsultasi">${arrow('Simulasi Konsultasi')}</a>
              <a class="btn l" href="#/pricelist">Lihat Pricelist</a>
            </p>
          </div>
        </section>

        <section>
          <div class="w">
            <h2 class="rvl">Portofolio Pilihan</h2>
            <div class="grid" style="margin-top:30px">${PF.slice(0, 4).map(portfolioCard).join('')}</div>
            <p style="margin-top:30px"><a class="btn" href="#/portfolio">${arrow('Semua Portofolio')}</a></p>
          </div>
        </section>

        <section style="background:var(--bg2)">
          <div class="w">
            <h2 class="rvl">Tim Kami</h2>
            <div class="grid tim" style="margin-top:30px">
              ${TM.map((t, i) => `
                <div class="card rvl">
                  ${IM(i + 2, t[4])}
                  <h3 style="font-size:1.05rem">${t[0]}</h3>
                  <p style="color:var(--ac);font-weight:600">${t[1]}</p>
                  <p class="mu tm-exp">${t[2]} pengalaman · ${t[3]}</p>
                </div>`).join('')}
            </div>
          </div>
        </section>`,

      layanan: () =>
        pageHeader('LAYANAN KAMI', 'Solusi arsitektur, engineering, dan konstruksi dari konsep hingga serah terima.') + `
        <section>
          <div class="w">
            ${chips(['Semua', 'Konstruksi', 'Arsitektur', 'Interior', 'Engineering', 'Dokumen', 'Design & Build'])}
            <div class="grid" id="fg">${contractorCard(0)}${SV.map(serviceCard).join('')}</div>
          </div>
        </section>`,

      sd: slug => {
        if (slug == KONTR[0]) return pageHeader(KONTR[1], KONTR[2]) + `
        <section>
          <div class="w two">
            <div class="card" style="padding:12px">${IM(6, KONTR[6])}</div>
            <div>
              <div class="price" style="font-size:1.5rem">Sesuai RAB</div>
              <p class="mu" style="margin:10px 0">Biaya pembangunan mengikuti RAB yang disetujui, dengan pengawasan berkala.</p>
              <p>${KONTR[4]}</p>
              <a class="btn" style="margin-top:20px" href="#/reservasi?s=${KONTR[0]}">Reservasi Konsultasi</a>
            </div>
          </div>
          <div class="w" style="margin-top:40px">
            <h2>Ruang Lingkup Pekerjaan</h2>
            ${KONTR[5].map((d, i) => `<p style="margin:8px 0"><span class="ck" style="animation-delay:${i * 150}ms">✓</span>${d}</p>`).join('')}
          </div>
        </section>`;
        const v = SV.find(x => x[0] == slug);
        if (!v) return R.nf();

        return pageHeader(v[1], v[3]) + `
        <section>
          <div class="w two">
            <div class="card" style="padding:12px">${IM(SV.indexOf(v), v[7])}</div>
            <div>
              <div class="price">${rp(v[2])}/m²</div>
              <p class="mu" style="margin:10px 0">Estimasi pengerjaan 7–21 hari kerja.</p>
              <p>${v[5]}</p>
              <a class="btn" style="margin-top:20px" href="#/reservasi?s=${v[0]}">Reservasi Layanan Ini</a>
            </div>
          </div>
          <div class="w" style="margin-top:40px">
            <h2>Deliverables</h2>
            ${v[6].map((d, i) => `<p style="margin:8px 0"><span class="ck" style="animation-delay:${i * 150}ms">✓</span>${d}</p>`).join('')}
          </div>
        </section>`;
      },

      reservasi: () =>
        pageHeader('RESERVASI', 'Booking konsultasi dalam 6 langkah singkat.') + `
        <section><div class="w" style="max-width:640px"><div class="glass card" id="rf"></div></div></section>`,

      booking: () =>
        pageHeader('CEK BOOKING', 'Masukkan Booking ID untuk melihat status.') + `
        <section>
          <div class="w" style="max-width:560px">
            <div class="glass">
              <div id="lk">
                <label for="bid">Booking ID</label>
                <input id="bid" placeholder="FS-XXXXXX">
                <p class="err" id="be"></p>
                <button class="btn" id="bg" style="margin-top:16px">Cek Status</button>
              </div>
              <div id="bs"></div>
            </div>
            <div id="st"></div>
          </div>
        </section>`,

      kalkulator: () =>
        pageHeader('KALKULATOR BIAYA', 'Estimasi realtime berdasarkan luas dan paket layanan.') + `
        <section>
          <div class="w two kalk">
            <div class="glass">
              <label>Tipe bangunan</label>
              <select id="c0"><option>Rumah Tinggal</option><option>Kos / Kontrakan</option><option>Ruko</option><option>Villa</option></select>
              <label>Jumlah lantai</label>
              <input id="c1" type="number" min="1" max="10" value="2">
              <label>Luas per lantai (m²)</label>
              <input id="c2" type="number" min="1" value="100">
              <label>Paket layanan</label>
              <select id="c3">
                ${SV.map(s => `<option value="${s[2]}"${s[0] == 'paket-all-in' ? ' selected' : ''}>${s[1]}${matchMedia('(max-width:600px)').matches ? '' : ' — ' + rp(s[2]) + '/m²'}</option>`).join('')}
              </select>
              <p class="err" id="ce"></p>
            </div>
            <div class="res">
              <div class="rg1"><p>Total luas</p><div class="big" id="r1">200 m²</div></div>
              <div class="rg1"><p>Harga per m²</p><div class="big" id="r2"></div></div>
              <div class="rg1"><p>Total estimasi</p><div class="big" id="r3"></div></div>
              <a class="btn l" id="kr" style="margin-top:20px" href="#/reservasi">Reservasi Sekarang</a>
            </div>
          </div>
        </section>`,

      pd: slug => {
        const i = PF.findIndex(x => x[0] == slug);
        if (i < 0) return R.nf();
        const p = PF[i];

        return `
        <div class="hero" style="min-height:70vh">
          <div class="w">
            <div class="badge">${p[2]}</div>
            <h1>${p[1]}</h1>
            <p class="fade">${p[3]} · ${p[4]} m² · ${p[5]} lantai · ${p[6]}</p>
          </div>
        </div>
        <section>
          <div class="w">
            <h2>Galeri</h2>
            <div class="pv" id="gv" style="margin:16px 0"></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="chip" id="gp">← Sebelumnya</button>
              <button class="chip" id="gn">Berikutnya →</button>
              <button class="chip" id="gf">Layar penuh</button>
            </div>
            <div id="th2" style="display:flex;gap:8px;margin-top:14px"></div>
            <a class="btn" style="margin-top:30px" href="#/portfolio">← Semua Project</a>
          </div>
        </section>`;
      },

      faq: () =>
        pageHeader('FAQ', 'Pertanyaan yang sering diajukan.') + `
        <section>
          <div class="w" style="max-width:760px">
            <input id="fs" placeholder="Cari pertanyaan..." style="margin-bottom:20px">
            <div id="fq"></div>
          </div>
        </section>`,

      artikel: () =>
        pageHeader('ARTIKEL', 'Tips dan wawasan seputar desain, struktur, anggaran, dan perizinan bangunan.') + `
        <section>
          <div class="w">
            ${chips(['Semua', ...new Set(AR.map(a => a[2]))])}
            <div class="grid" id="fg">${AR.map(articleCard).join('')}</div>
          </div>
        </section>`,

      ad: slug => {
        const i = AR.findIndex(x => x[0] == slug);
        if (i < 0) return R.nf();
        const a = AR[i];
        const more = AR.filter((_, j) => j != i).slice(0, 3);
        return pageHeader(a[1], `${a[2]} · ${a[3]} · ${a[4]} menit baca`) + `
        <section>
          <div class="w" style="max-width:760px">
            <div class="card" style="padding:12px">${IM(i, a[7])}</div>
            <div style="margin-top:28px;line-height:1.8">
              ${a[6].map(t => `<p style="margin:0 0 18px">${t}</p>`).join('')}
            </div>
            <a class="btn" href="#/artikel">← Semua Artikel</a>
          </div>
          <div class="w" style="margin-top:50px">
            <h2>Artikel Lainnya</h2>
            <div class="grid" style="margin-top:24px">${more.map(articleCard).join('')}</div>
          </div>
        </section>`;
      },

      nf: () =>
        pageHeader('404', 'Halaman tidak ditemukan.') +
        `<section><div class="w"><a class="btn" href="#/">Kembali ke Home</a></div></section>`
    };

    function form(el, steps, onDone) {
      let current = 0;
      const data = {};

      const draw = () => {
        const step = steps[current];
        const progress = steps.map((_, i) => `<i class="${i <= current ? 'on' : ''}"></i>`).join('');
        const backBtn  = current && !step.nb ? '<button class="btn l" id="fb">Kembali</button>' : '';
        const nextBtn  = step.last === 2 ? '' : `<button class="btn" id="fn">${step.btn || (step.last ? 'Konfirmasi' : 'Lanjut')}</button>`;

        el.innerHTML = `
          <div class="steps">${progress}</div>
          <div class="sl">
            <h3>${step.t}</h3>
            ${step.h(data)}
            <p class="err" id="fe"></p>
          </div>
          <div class="acts ${backBtn && nextBtn ? 'two' : 'one'}">${backBtn}${nextBtn}</div>`;

        if (step.m) step.m(data, el, () => { current++; draw(); }, i => { current = i; draw(); });

        const next = $('#fn');
        if (next) next.onclick = () => {
          const error = step.v(data, el);
          if (error) { $('#fe').textContent = error; return; }
          if (step.last) onDone(data);
          current++;
          draw();
        };

        const back = $('#fb');
        if (back) back.onclick = () => {
          step.v(data, el, true); 
          current--;
          draw();
        };
      };

      draw();
    }

    const validate = (el, data, fields) => {
      for (const [id, message] of fields) {
        const value = ($('#' + id, el) || {}).value;
        data[id] = value;
        if (!value || !value.trim()) return message;
      }
    };

    function initFilter() {
      $$('#fl .chip').forEach(btn => btn.onclick = () => {
        $$('#fl .chip').forEach(x => x.classList.remove('on'));
        btn.classList.add('on');
        $$('#fg .card').forEach(card => {
          const show = btn.textContent == 'Semua' || card.dataset.c == btn.textContent;
          card.style.display = show ? '' : 'none';
        });
      });
    }

    const BOOKING_FEE = 100000;
    const PAY_HOURS = 24;       
    const PAY = [
      ['BCA', 'Transfer BCA', '1234567890', 'a.n. FREESPACE BUILDING'],
      ['Mandiri', 'Transfer Mandiri', '1300012345678', 'a.n. FREESPACE BUILDING'],
      ['E-walet Qris', 'E-walet Qris', '', '', 'qr']
    ];

    const QRIS_PAYLOAD = (id, fee) => `FREESPACE|${id}|${fee}`;
    const qrSvg = text => {
      const q = qrcode(0, 'M'); q.addData(text); q.make();
      const n = q.getModuleCount(); let d = '';
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
      return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges" role="img" aria-label="Kode QRIS"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
    };

    const getB = id => (ST('fsb') || {})[id];
    const saveB = b => { const all = ST('fsb') || {}; all[b.id] = b; ST('fsb', all); ST('fsl', b.id); };
    const STUDIO = 'Studio Freespace, Jl. Jakarta No. 42, Antapani, Kota Bandung';
    const locOf = d => d.a7 == 'proyek' ? 'Lokasi proyek: ' + (d.a8 || '-') : d.a7 == 'online' ? 'Online (link Zoom/Meet dikirim via WhatsApp & email)' : STUDIO;
    const fdate = (d, opt) => new Date(d).toLocaleString('id-ID', opt);
    const fday = d => fdate(d + 'T00:00', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    function copyText(text, btn, label) {
      const done = () => {
        toast((label || 'Teks') + ' disalin');
        if (btn) { const o = btn.dataset.o || btn.textContent; btn.dataset.o = o; btn.textContent = 'Tersalin ✓'; setTimeout(() => btn.textContent = o, 1800); }
      };
      const fallback = () => {
        const t = document.createElement('textarea');
        t.value = text; t.style.position = 'fixed'; t.style.opacity = 0;
        document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast('Gagal menyalin, salin manual'); }
        t.remove();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    }

    const idBox = id => `
      <div class="idbox"><h2>${esc(id)}</h2></div>`;
    const bindCopy = root => $$('[data-copy]', root).forEach(b => b.onclick = () => copyText(b.dataset.copy, b, b.dataset.l));

    const readProof = file => new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onerror = () => rej();
      fr.onload = () => {
        const img = new Image();
        img.onerror = () => rej();
        img.onload = () => {
          const M = 1000, k = Math.min(1, M / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL('image/jpeg', 0.72));
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });

    function askYesNo(msg, onYes) {
      const o = document.createElement('div');
      o.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(3,10,20,.6);display:flex;align-items:center;justify-content:center;padding:16px';
      o.innerHTML = `
        <div role="dialog" aria-modal="true" style="background:var(--card);color:var(--tx);border:1px solid var(--bd);border-radius:18px;padding:24px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(47,140,255,.25)">
          <h3 style="margin:0 0 8px">Konfirmasi</h3>
          <p style="margin:0 0 20px">${esc(msg)}</p>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn" id="yy" style="flex:1;justify-content:center">Ya</button>
            <button type="button" class="btn l" id="yn" style="flex:1;justify-content:center">Tidak</button>
          </div>
        </div>`;
      document.body.appendChild(o);
      const close = () => { o.remove(); document.removeEventListener('keydown', esc_); };
      const esc_ = e => { if (e.key == 'Escape') close(); };
      document.addEventListener('keydown', esc_);
      o.onclick = e => { if (e.target == o) close(); };
      $('#yn', o).onclick = close;
      $('#yy', o).onclick = () => { close(); onYes(); };
      $('#yn', o).focus();
    }

    function payUI(el, id, onPaid, laterLabel, onLater) {
      let sel = 0, view = 'pay', proof = null;
      const b = getB(id);
      const fee = b.fee || BOOKING_FEE;

      const drawPay = () => {
        const m = PAY[sel];
        const isQ = m[4] == 'qr';
        el.innerHTML = `
          <p class="mu" style="margin:0">Total pembayaran reservasi</p>
          <div class="amt">${rp(fee)}</div>
          <p class="mu" style="font-size:.85rem">Bayar sebelum <b>${fdate(b.exp, { dateStyle: 'long', timeStyle: 'short' })}</b></p>
          <label>Metode pembayaran</label>
          <div class="pm">${PAY.map((x, i) => `<button type="button" data-i="${i}" class="${i == sel ? 'on' : ''}">${x[0]}</button>`).join('')}</div>
          ${isQ ? `
          <div class="payinfo">
            <small class="mu">Buka aplikasi E-walet,Shopeepay,Dana,Gopay lalu scan QR ini.</small>
            <div style="margin:10px 0"><div class="qrbox">${qrSvg(QRIS_PAYLOAD(id, fee))}</div></div>
          </div>` : `
          <div class="payinfo">
            <small class="mu">${m[1]} · ${m[3]}</small>
            <div class="no">${m[2]}</div>
            <button type="button" class="btn l cp" data-copy="${m[2]}" data-l="Nomor rekening">Salin Nomor</button>
          </div>
          <p class="mu" style="font-size:.8rem">Cantumkan Booking ID <b>${esc(id)}</b> pada berita transfer.</p>`}
          <div class="acts two">
            <button type="button" class="btn l" id="pl">${laterLabel}</button>
            <button type="button" class="btn" id="ps">Saya Sudah Bayar</button>
          </div>`;
        $$('.pm button', el).forEach(x => x.onclick = () => { sel = +x.dataset.i; drawPay(); });
        bindCopy(el);
        $('#ps', el).onclick = () => { view = 'proof'; drawProof(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
        $('#pl', el).onclick = () => onLater();
      };

      const drawProof = () => {
        el.innerHTML = `
          <h3 style="margin:0 0 4px">Upload Bukti Pembayaran</h3>
          <p class="mu" style="font-size:.9rem;margin-top:0">Unggah screenshot atau foto bukti transfer ${esc(PAY[sel][0])} sebesar <b>${rp(fee)}</b>.</p>
          <label for="pn">Nama pengirim</label>
          <input id="pn" placeholder="Nama sesuai rekening / akun pengirim" value="${esc(b.a4 || '')}">
          <label for="pf">Bukti pembayaran (gambar)</label>
          <input id="pf" class="vh" type="file" accept="image/*">
          <label for="pf" id="dz" class="dz" tabindex="0"></label>
          <p class="mu" id="pe" style="color:#e5484d;font-size:.85rem;margin:8px 0 0"></p>
          <div class="acts two">
            <button type="button" class="btn l" id="pb">Kembali</button>
            <button type="button" class="btn" id="pk">Kirim Bukti</button>
          </div>`;
        const dz = $('#dz', el), pe = $('#pe', el), pf = $('#pf', el);
        let fname = '';
        const showPrev = () => {
          dz.classList.toggle('has', !!proof);
          dz.innerHTML = proof ? `
            <span class="dzp"><img src="${proof}" alt="Pratinjau bukti pembayaran"></span>` : `
            <span class="dzi"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5"/><path d="m7 9 5-5 5 5"/><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"/></svg></span>
            <span class="dzt">Unggah bukti transfer</span>`;
        };
        showPrev();
        const handle = async f => {
          pe.textContent = '';
          if (!f) return;
          if (!f.type.startsWith('image/')) { pe.textContent = 'Pilih file berupa gambar'; return; }
          try { proof = await readProof(f); fname = f.name; showPrev(); }
          catch (_) { pe.textContent = 'Gagal membaca gambar, coba file lain'; }
        };
        pf.onchange = e => handle(e.target.files[0]);
        dz.onkeydown = e => { if (e.key == 'Enter' || e.key == ' ') { e.preventDefault(); pf.click(); } };
        ['dragenter', 'dragover'].forEach(t => dz.addEventListener(t, e => { e.preventDefault(); dz.classList.add('drag'); }));
        ['dragleave', 'drop'].forEach(t => dz.addEventListener(t, e => { e.preventDefault(); dz.classList.remove('drag'); }));
        dz.addEventListener('drop', e => handle(e.dataTransfer.files[0]));
        $('#pb', el).onclick = () => { view = 'pay'; drawPay(); };
        $('#pk', el).onclick = () => {
          const name = $('#pn', el).value.trim();
          if (!name) { pe.textContent = 'Nama pengirim wajib diisi'; return; }
          if (!proof) { pe.textContent = 'Upload bukti pembayaran terlebih dahulu'; return; }
          const cur = getB(id);
          cur.paidAt = Date.now(); cur.method = PAY[sel][1]; cur.payer = name; cur.proof = proof;
          saveB(cur);
          if (!(getB(id) || {}).paidAt) { pe.textContent = 'Gagal menyimpan bukti (penyimpanan penuh). Coba gambar lebih kecil.'; return; }
          toast('Bukti pembayaran terkirim');
          onPaid();
        };
      };

      drawPay();
    }

    const strukHTML = b => {
      const fee = b.fee || BOOKING_FEE;
      const T = d => esc(fdate(d, { dateStyle: 'medium', timeStyle: 'short' }));
      return `
        <div class="struk sl">
          <div class="hd">
            <b>FREESPACE BUILDING</b>
            <small>PT FREESPACE · Jl. Jakarta No. 42, Antapani, Kota Bandung</small>
            <h4>STRUK PEMBAYARAN</h4>
          </div>
          <div class="sep"></div>
          <div class="kv"><span>Booking ID</span><span>${esc(b.id)}</span></div>
          <div class="kv"><span>Dibuat</span><span>${T(b.created || b.paidAt)}</span></div>
          <div class="sep"></div>
          <div class="sh">DETAIL RESERVASI</div>
          <div class="kv"><span>Layanan</span><span>${esc(b.a1)}</span></div>
          <div class="kv"><span>Jadwal</span><span>${esc(fday(b.a2))}, ${esc(b.a3)}</span></div>
          <div class="kv"><span>Lokasi</span><span>${esc(b.loc || STUDIO)}</span></div>
          ${b.concept ? `<div class="sep"></div><div class="sh">KONSEP ${esc((b.concept.from || 'Simulasi ' + b.concept.simLabel).toUpperCase())}</div>${b.concept.rows.map(r => `<div class="kv"><span>${esc(r[0])}</span><span>${esc(r[1])}</span></div>`).join('')}<div class="kv"><span>Estimasi desain</span><span>${rp(b.concept.total)}</span></div>` : ''}
          <div class="sep"></div>
          <div class="sh">DATA CLIENT</div>
          <div class="kv"><span>Nama</span><span>${esc(b.a4)}</span></div>
          <div class="kv"><span>Email</span><span>${esc(b.a5 || '-')}</span></div>
          <div class="kv"><span>WhatsApp</span><span>${esc(b.a6 || '-')}</span></div>
          <div class="sep"></div>
          <div class="sh">RINCIAN PEMBAYARAN</div>
          <div class="kv"><span>Biaya reservasi</span><span>${rp(fee)}</span></div>
          <div class="kv"><span>Metode</span><span>${esc(b.method || '-')}</span></div>
          <div class="kv"><span>Dibayar pada</span><span>${T(b.paidAt)}</span></div>
          ${b.payer ? `<div class="kv"><span>Pengirim</span><span>${esc(b.payer)}</span></div>` : ''}
          <div class="kv sr"><span>Status</span><span><span class="badge ok">LUNAS</span></span></div>
          <div class="kv tot"><span>Total</span><span>${rp(fee)}</span></div>
          ${b.proof ? `<div class="sep"></div><div class="sh">BUKTI PEMBAYARAN</div><div style="text-align:center;margin:8px 0"><img src="${b.proof}" alt="Bukti pembayaran" style="max-width:100%;max-height:260px;border-radius:8px"></div>` : ''}
          <div class="sep"></div>
          <div class="ft">Simpan struk ini sebagai bukti reservasi. Sebutkan Booking ID saat konsultasi.</div>
        </div>`;
    };

    const paidHTML = b => `
      <div style="text-align:center">
        <div style="font-size:4rem" class="ck">✓</div>
        <p>Pembayaran diterima. Reservasi Anda terkonfirmasi!</p>
        <p class="mu" style="font-size:.85rem">Booking ID Anda:</p>
        ${idBox(b.id)}
      </div>
      ${strukHTML(b)}`;

    const conceptHTML = c => !c ? '' : `
      <div class="glass" style="margin:0 0 16px;padding:14px;border-radius:14px">
        <p class="mu" style="margin:0;font-size:.8rem">Konsep dari ${esc(c.from || 'Simulasi ' + c.simLabel)}</p>
        <b>${esc(c.label)}</b>
        <div class="sum" style="margin-top:6px">${c.svc && !c.rows.some(r => r[0] == 'Paket layanan') ? `<div class="row"><span>Layanan</span><b>${esc(c.svc)}</b></div>` : ''}${c.rows.map(r => `<div class="row"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>
        <div class="row" style="display:flex;justify-content:space-between;padding-top:8px"><span>Estimasi biaya desain</span><b>${rp(c.total)}</b></div>
      </div>`;

    function initReservasi() {
      const preselected = (location.hash.match(/[?&]s=([\w-]+)/) || [])[1];
      const concept = /[?&]k=1/.test(location.hash) ? ST('fsc') : null;
      const locked = !!(concept && concept.svc);
      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
      const MIN_LEAD = 2 * 3600000;

      const steps = [
        {
          t: locked ? '1. Konsep Anda' : '1. Pilih layanan',
          h: d => locked ? (d.a1 = concept.svc, conceptHTML(concept)) : conceptHTML(concept) + `
            <label for="a1">Layanan</label>
            <select id="a1">
              ${SV.map(s => `<option value="${s[1]}" ${s[0] == preselected || s[1] == d.a1 ? 'selected' : ''}>${s[1]}</option>`).join('')}
              <option value="${KONTR[1]}" ${KONTR[0] == preselected || KONTR[1] == d.a1 ? 'selected' : ''}>${KONTR[1]}</option>
            </select>`,
          v: (d, e) => locked ? (d.a1 = concept.svc, 0) : validate(e, d, [['a1', 'Pilih layanan']])
        },
        {
          t: '2. Jadwal & lokasi',
          h: d => `
            <label for="a2">Tanggal</label>
            <input id="a2" type="date" min="${today}" value="${d.a2 || ''}">
            <label for="a3">Jam</label>
            <select id="a3">${Array.from({ length: 10 }, (_, i) => String(9 + i).padStart(2, '0') + ':00').map(j => `<option${d.a3 == j ? ' selected' : ''}>${j}</option>`).join('')}</select>
            <label for="a7">Lokasi konsultasi</label>
            <select id="a7">
              <option value="studio"${d.a7 == 'studio' ? ' selected' : ''}>Studio Freespace (Antapani, Bandung)</option>
              <option value="proyek"${d.a7 == 'proyek' ? ' selected' : ''}>Lokasi proyek / rumah saya</option>
              <option value="online"${d.a7 == 'online' ? ' selected' : ''}>Online (Zoom / Google Meet)</option>
            </select>
            <div id="a8w" style="display:none">
              <label for="a8">Alamat lokasi proyek / rumah</label>
              <textarea id="a8" rows="3" placeholder="Jalan, nomor, kelurahan, kota (boleh tambah patokan / link maps)">${esc(d.a8)}</textarea>
            </div>`,
          m: (d, el) => {
            const sync = () => {
              $('#a8w', el).style.display = $('#a7', el).value == 'proyek' ? '' : 'none';
              const date = $('#a2', el).value;
              const sel = $('#a3', el);
              [...sel.options].forEach(o => o.disabled = !!date && new Date(`${date}T${o.value}:00`).getTime() < Date.now() + MIN_LEAD);
              if (sel.selectedOptions[0] && sel.selectedOptions[0].disabled) {
                const ok = [...sel.options].find(o => !o.disabled);
                if (ok) sel.value = ok.value;
              }
            };
            $('#a2', el).onchange = sync;
            $('#a7', el).onchange = sync;
            sync();
          },
          v: (d, e, back) => {
            const err = validate(e, d, [['a2', 'Pilih tanggal'], ['a3', 'Pilih jam'], ['a7', 'Pilih lokasi konsultasi']]);
            d.a8 = ($('#a8', e) || {}).value || '';
            if (back) return 0;
            if (err) return err;
            if (d.a7 == 'proyek' && !d.a8.trim()) return 'Alamat lokasi proyek wajib diisi';
            if (new Date(`${d.a2}T${d.a3}:00`).getTime() < Date.now() + MIN_LEAD) return 'Pilih jadwal minimal 2 jam dari sekarang (jam yang sudah lewat tidak bisa dipilih)';
            return 0;
          }
        },
        {
          t: '3. Informasi client',
          h: d => `
            <label for="a4">Nama</label><input id="a4" value="${esc(d.a4)}">
            <label for="a5">Email</label><input id="a5" type="email" value="${esc(d.a5)}">
            <label for="a6">WhatsApp</label><input id="a6" type="tel" value="${esc(d.a6)}">`,
          v: (d, e, back) => {
            if (back) return 0;
            const empty = validate(e, d, [
              ['a4', 'Nama wajib diisi'],
              ['a5', 'Email wajib diisi'],
              ['a6', 'WhatsApp wajib diisi']
            ]);
            if (empty) return empty;
            if (!/^\S+@\S+\.\S+$/.test(d.a5)) return 'Format email tidak valid';
            if (!/^[+\d][\d\s-]{8,}$/.test(d.a6)) return 'Nomor WhatsApp tidak valid';
            return 0;
          }
        },
        {
          t: '4. Review',
          last: 1,
          btn: 'Lanjutkan Pembayaran',
          h: d => `
            <p>Layanan: <b>${esc(d.a1)}</b></p>
            <p>Jadwal: <b>${esc(fday(d.a2))}, ${esc(d.a3)}</b></p>
            <p>Lokasi: <b>${esc(locOf(d))}</b></p>
            <p>Nama: <b>${esc(d.a4)}</b></p>
            <p>Email: <b>${esc(d.a5)}</b></p>
            <p>WhatsApp: <b>${esc(d.a6)}</b></p>
            ${concept ? conceptHTML(concept) : ''}
            <p>Biaya reservasi: <b>${rp(BOOKING_FEE)}</b></p>`,
          v: () => 0
        },
        {
          t: '5. Pembayaran',
          last: 2,
          nb: 1,
          h: d => `
            <p class="mu" style="margin:0 0 6px">Booking ID Anda</p>
            <div class="idl">${idBox(d.id)}</div>
            <div id="pay"></div>`,
          m: (d, el, next) => {
            bindCopy(el);
            payUI($('#pay', el), d.id, next, 'Bayar Nanti', next);
          }
        },
        {
          t: '6. Konfirmasi',
          last: 2,
          nb: 1,
          h: d => {
            const b = getB(d.id) || d;
            if (b.paidAt) return paidHTML(b) + `
              <div class="acts one">
                <a class="btn" href="#/booking?id=${encodeURIComponent(d.id)}">Lanjut ke Status Booking</a>
              </div>`;
            return `
            <div style="text-align:center">
              <div style="font-size:4rem" class="ck w">⏳</div>
              <p>Reservasi dibuat, namun <b>belum dibayar</b>.</p>
              <p class="mu" style="font-size:.85rem">Booking ID Anda:</p>
              ${idBox(d.id)}
              <p class="mu" style="font-size:.85rem">Selesaikan pembayaran sebelum ${fdate(b.exp, { dateStyle: 'long', timeStyle: 'short' })} agar jadwal Anda tidak dibatalkan.</p>
              <div class="acts two">
                <a class="btn l" href="#/booking?id=${encodeURIComponent(d.id)}">Cek Status</a>
                <button class="btn" id="gp">Bayar Sekarang</button>
              </div>
            </div>`;
          },
          m: (d, el, next, jump) => {
            bindCopy(el);
            const g = $('#gp', el); if (g) g.onclick = () => jump(4);
          }
        }
      ];

      form($('#rf'), steps, d => {
        if (d.id) return;
        const now = Date.now();
        d.id = 'FS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        saveB({ id: d.id, a1: d.a1, a2: d.a2, a3: d.a3, a4: d.a4, a5: d.a5, a6: d.a6, loc: locOf(d), fee: BOOKING_FEE, concept: concept || null, created: now, exp: Math.min(now + PAY_HOURS * 3600000, new Date(`${d.a2}T${d.a3}:00`).getTime()), paidAt: null, doneAt: null, method: null });
        toast('Reservasi dibuat. Silakan lakukan pembayaran');
      });
    }

    function initBooking() {
      const out = $('#bs');
      const st = $('#st');
      const lk = $('#lk');

      const paidScreen = id => {
        out.innerHTML = paidHTML(getB(id)) + `
          <div class="acts one">
            <button class="btn" id="bn">Lanjut ke Status Booking</button>
          </div>`;
        st.innerHTML = '';
        bindCopy(out);
        $('#bn').onclick = () => render(id);
        out.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      const AUTO_DONE_MS = 2 * 3600000; 
      let tmr = null;

      const finish = () => {
        clearTimeout(tmr);
        toast('Konsultasi selesai. Terima kasih!');
        location.hash = '#/';
      };

      const render = raw => {
        clearTimeout(tmr);
        const id = (raw || '').trim().toUpperCase();
        $('#be').textContent = '';
        st.innerHTML = '';
        if (!id) { lk.style.display = ''; $('#be').textContent = 'Booking ID wajib diisi'; return; }
        const b = getB(id);
        if (!b) { lk.style.display = ''; $('#be').textContent = 'Booking ID tidak ditemukan'; out.innerHTML = ''; return; }
        ST('fsl', id);

        const now = Date.now();
        const sched = new Date(`${b.a2}T${b.a3}:00`).getTime();
        const paid = !!b.paidAt;
        const expired = !paid && b.exp && now > b.exp;

        if (paid && !b.doneAt && now >= sched + AUTO_DONE_MS) {
          b.doneAt = sched + AUTO_DONE_MS; b.doneAuto = true; saveB(b);
          return finish();
        }
        const done = !!b.doneAt;
        const started = paid && now >= sched;
        const loc = b.loc || STUDIO;
        const waMsg = `Halo Freespace Building, saya ingin konfirmasi jadwal konsultasi.\nBooking ID: ${b.id}\nNama: ${b.a4}\nLayanan: ${b.a1}\nJadwal: ${fday(b.a2)}, ${b.a3}\nLokasi: ${loc}` + (b.concept ? `\nKonsep ${b.concept.from || 'Simulasi ' + b.concept.simLabel}:\n` + b.concept.rows.map(r => `• ${r[0]}: ${r[1]}`).join('\n') + `\nEstimasi: ${rp(b.concept.total)}` : '');
        const waHref = 'https://wa.me/6285723405913?text=' + encodeURIComponent(waMsg);
        const badge = expired ? ['x', 'Kedaluwarsa'] : !paid ? ['w', 'Menunggu Pembayaran'] : done ? ['ok', 'Konsultasi Selesai'] : started ? ['w', 'Menunggu Konfirmasi Selesai'] : ['ok', 'Terjadwal'];

        const timeline = [
          ['Reservasi Dibuat', 'd', fdate(b.created || now, { dateStyle: 'medium', timeStyle: 'short' })],
          paid ? ['Pembayaran Diterima', 'd', b.method + ' · ' + fdate(b.paidAt, { dateStyle: 'medium', timeStyle: 'short' })]
            : expired ? ['Pembayaran Kedaluwarsa', 'x', 'Batas waktu pembayaran terlewat']
              : ['Menunggu Pembayaran', 'w', 'Bayar sebelum ' + fdate(b.exp, { dateStyle: 'medium', timeStyle: 'short' })],
          ['Jadwal Konsultasi', !paid ? 'p' : done ? 'd' : 'c',
            paid ? fday(b.a2) + ' · pukul ' + b.a3 + '\n' + loc + (started && !done ? '\nWaktu konsultasi sudah tiba / lewat' : '')
              : 'Jam & lokasi ditetapkan setelah pembayaran'],
          ['Konsultasi Selesai', done ? 'd' : 'p', done ? (b.doneAuto ? 'Selesai otomatis ' : 'Dikonfirmasi ') + fdate(b.doneAt, { dateStyle: 'medium', timeStyle: 'short' }) : '']
        ];
        const icon = { d: '✓', c: '●', w: '!', x: '✕', p: '○' };

        out.innerHTML = `
          <div style="margin-top:8px;text-align:center">
            <div><span class="badge ${badge[0]}">${badge[1]}</span></div>
            ${idBox(b.id)}
          </div>
          <div style="margin-top:14px">${timeline.map((s, i) => `
            <div class="tm ${s[1]} sl" style="animation-delay:${i * 150}ms">
              <b>${icon[s[1]]}</b><div>${s[0]}${s[2] ? `<br><small class="mu">${esc(s[2]).replace(/\n/g, '<br>')}</small>` : ''}</div>
            </div>`).join('')}</div>
          <div id="po" class="${paid && !done ? 'duo' : ''}" style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            ${!paid && !expired ? '<button class="btn" id="bp">Bayar Sekarang</button>' : ''}
            ${expired ? '<a class="btn" href="#/reservasi">Buat Reservasi Baru</a>' : ''}
            ${paid && !done ? `<a class="btn" id="bw" href="${waHref}" target="_blank" rel="noopener">Konfirmasi via WhatsApp</a>` : ''}
            ${paid && !done ? '<button class="btn l" id="bd">Konsultasi Selesai</button>' : ''}
          </div>`;

        if (paid && !done) {
          const nextAt = sched + AUTO_DONE_MS;
          tmr = setTimeout(() => { if (out.isConnected) render(id); }, Math.min(nextAt - now + 500, 2147000000));
        }

        bindCopy(out);

        const bd = $('#bd');
        if (bd) bd.onclick = () => askYesNo(
          started ? 'Apakah konsultasi sudah selesai?' : 'Apakah konsultasi anda sudah selesai?',
          () => { const cur = getB(id); cur.doneAt = Date.now(); saveB(cur); finish(); }
        );
        const bp = $('#bp');
        if (bp) bp.onclick = () => {
          clearTimeout(tmr);
          out.innerHTML = `
            <div style="text-align:center"><span class="badge w">Menunggu Pembayaran</span>${idBox(b.id)}</div>
            <div id="pay"></div>`;
          payUI($('#pay'), id, () => paidScreen(id), 'Kembali ke Status', () => render(id));
          out.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      };

      $('#bg').onclick = () => render($('#bid').value);
      $('#bid').onkeydown = e => { if (e.key == 'Enter') render($('#bid').value); };

      const fromLink = (location.hash.match(/[?&]id=([\w-]+)/) || [])[1];
      const last = ST('fsl');
      if (fromLink) { $('#bid').value = fromLink.toUpperCase(); lk.style.display = 'none'; render(fromLink); }
      else if (last) $('#bid').value = last;
    }

    function initKalkulator() {
      let currentTotal = 0;

      const update = () => {
        const floors = +$('#c1').value;
        const area   = +$('#c2').value;
        const price  = +$('#c3').value;

        if (!(floors > 0 && area > 0)) {
          $('#ce').textContent = 'Masukkan angka lebih dari 0';
          return;
        }
        $('#ce').textContent = '';

        const totalArea = floors * area;
        const total = totalArea * price;
        $('#r1').textContent = `${floors} × ${area} = ${totalArea} m²`;
        $('#r2').textContent = rp(price);

        const from = currentTotal;
        const start = performance.now();
        const tick = now => {
          const q = Math.min(1, (now - start) / 500);
          const r3 = $('#r3'); if (!r3) return;
          r3.textContent = rp(from + (total - from) * q);
          if (q < 1) requestAnimationFrame(tick);
        };
        currentTotal = total;
        requestAnimationFrame(tick);
      };

      $$('input,select').forEach(i => i.oninput = update);
      update();

      $('#kr').onclick = e => {
        e.preventDefault();
        const floors = +$('#c1').value, area = +$('#c2').value, price = +$('#c3').value;
        if (!(floors > 0 && area > 0)) { $('#ce').textContent = 'Masukkan angka lebih dari 0'; return; }
        const idx = $('#c3').selectedIndex, sv = SV[idx], totalArea = floors * area;
        askYesNo('Hitungan biaya sudah sesuai. Lanjut ke reservasi dengan data kalkulator ini?', () => {
          ST('fsc', {
            sim: 'kalkulator', simLabel: 'Kalkulator', from: 'Kalkulator Biaya', label: 'Estimasi Biaya Desain', svc: sv[1],
            rows: [['Tipe bangunan', $('#c0').value], ['Jumlah lantai', floors + ' lantai'], ['Luas per lantai', area + ' m²'],
                   ['Total luas', totalArea + ' m²'], ['Paket layanan', sv[1]], ['Tarif', rp(price) + '/m²']],
            total: totalArea * price, at: Date.now()
          });
          location.hash = '#/reservasi?s=' + sv[0] + '&k=1';
        });
      };
    }

    function initFaq() {
      const draw = query => {
        const list = FQ.filter(f => (f[0] + f[1]).toLowerCase().includes(query.toLowerCase()));

        $('#fq').innerHTML = list.length
          ? list.map(f => `
              <div class="faq">
                <button aria-expanded="false">${f[0]}<span class="x">+</span></button>
                <div class="a"><div>${f[1]}</div></div>
              </div>`).join('')
          : '<p class="mu">Tidak ada hasil.</p>';

        $$('.faq button').forEach(b => b.onclick = () => {
          const open = b.parentNode.classList.toggle('on');
          b.setAttribute('aria-expanded', open);
        });
      };

      $('#fs').oninput = e => draw(e.target.value);
      draw('');
    }

    function initPortfolioDetail() {
      const TOTAL = 5;
      let index = 0;

      const gradient = j =>
        `linear-gradient(${135 + j * 30}deg,hsl(${212 + j * 6} 65% ${25 + j * 4}%),hsl(${208 + j * 4} 55% ${60 - j * 3}%))`;

      const show = n => {
        index = (n + TOTAL) % TOTAL;
        $('#gv').style.background = gradient(index);
        $$('#th2 button').forEach((b, j) => b.style.outline = j == index ? '2px solid var(--ac)' : '0');
      };

      $('#th2').innerHTML = Array.from({ length: TOTAL }, (_, j) =>
        `<button style="width:64px;height:44px;border-radius:8px;border:0;cursor:pointer;background:${gradient(j)}" aria-label="Foto ${j + 1}"></button>`
      ).join('');

      $$('#th2 button').forEach((b, j) => b.onclick = () => show(j));
      $('#gp').onclick = () => show(index - 1);
      $('#gn').onclick = () => show(index + 1);
      $('#gf').onclick = () => $('#gv').requestFullscreen && $('#gv').requestFullscreen();
      show(0);
    }

    function pageInit(key) {
      const inits = {
        layanan: initFilter,
        artikel: initFilter,
        portfolio: initPortfolio,
        pricelist: initPricelist,
        reservasi: initReservasi,
        booking: initBooking,
        konsultasi: initKonsultasi,
        simulasi: initSimulasi,
        kalkulator: initKalkulator,
        'customer-journey': initJourney,
        faq: initFaq,
        pd: initPortfolioDetail
      };
      if (inits[key]) inits[key]();
    }

    function animateCounter(el) {
      const target = +el.dataset.c;
      const decimals = +el.dataset.d || 0;
      const start = performance.now();
      const frame = now => {
        const q = Math.min(1, (now - start) / 1600);
        el.textContent = (target * q).toFixed(decimals);
        if (q < 1) requestAnimationFrame(frame);
      };
      frame(start);
    }

    function initEffects() {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        $$('[data-c]:not(a)', el).forEach(animateCounter);
        $$('.rg', el).forEach(r => r.style.strokeDashoffset = r.dataset.o || 0);
        observer.unobserve(el);
      }), { threshold: .15 });
      $$('.rvl').forEach(el => observer.observe(el));

      if (!matchMedia('(pointer:coarse)').matches) {
        $$('.tilt').forEach(card => {
          card.onmousemove = e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
          };
          card.onmouseleave = () => card.style.transform = '';
        });
      }

      const hn = $('#hnews');
      if (hn) {
        let gone = false;
        try { gone = sessionStorage.getItem('fs-news') === '0'; } catch (e) {}
        if (gone) hn.remove();
        else {
          setTimeout(() => hn.classList.add('on'), 1200);
          const hl = $('#hlist'), hc = $('#hcnt');
          if (hl && hc) {
            const items = hl.querySelectorAll('.hn');
            hl.addEventListener('scroll', () => {
              const horiz = hl.scrollWidth > hl.clientWidth + 4;
              const pos = horiz ? hl.scrollLeft / hl.clientWidth : hl.scrollTop / (items[0].offsetHeight || 1);
              const atEnd = horiz ? hl.scrollLeft + hl.clientWidth >= hl.scrollWidth - 4 : hl.scrollTop + hl.clientHeight >= hl.scrollHeight - 4;
              const n = atEnd ? items.length : Math.min(items.length, Math.round(pos) + 1);
              hc.textContent = n + ' / ' + items.length;
            }, { passive: true });
          }
          $('#hnx').onclick = () => {
            hn.classList.remove('on');
            try { sessionStorage.setItem('fs-news', '0'); } catch (e) {}
            setTimeout(() => hn.remove(), 400);
          };
        }
      }

      const hv = $('#hv');
      if (hv) {
        hv.muted = true;
        hv.playbackRate = 1;
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { hv.removeAttribute('autoplay'); hv.pause(); hv.classList.add('on'); }
        else {
          // tampilkan langsung (poster ikut terlihat) agar tidak gelap walau autoplay diblokir
          // (mis. Mode Daya Rendah iPhone / browser dalam aplikasi WhatsApp)
          hv.classList.add('on');
          hv.setAttribute('webkit-playsinline', '');
          // cadangan: jika video diblokir (Mode Daya Rendah iPhone), langsung tampilkan animasi WebP
          // yang tetap berjalan otomatis; dihapus begitu video asli mulai terputar
          let fbImg = null;
          const showFallback = () => {
            if (fbImg) return;
            fbImg = new Image();
            fbImg.alt = ''; fbImg.className = 'hv on';
            fbImg.setAttribute('aria-hidden', 'true');
            fbImg.style.background = 'url(images/hero-poster.jpg) center / cover'; // poster tampil selama animasi dimuat
            const img = fbImg;
            img.onload = () => { if (fbImg === img) hv.style.visibility = 'hidden'; }; // sembunyikan tombol play bawaan iOS
            fbImg.src = 'video/hero-fallback.webp';
            hv.insertAdjacentElement('afterend', fbImg);
          };
          hv.addEventListener('playing', () => {
            hv.style.visibility = '';
            if (fbImg) { fbImg.remove(); fbImg = null; }
          });
          const tryPlay = () => {
            const p = hv.play();
            if (p && p.catch) p.catch(() => showFallback());
          };
          tryPlay();
          setTimeout(() => { if (hv.paused) showFallback(); }, 500);
          // jika diblokir, putar saat sentuhan/klik pertama
          const unlock = () => { if (hv.paused) tryPlay(); };
          ['touchend', 'pointerup', 'click'].forEach(ev => window.addEventListener(ev, unlock, { passive: true }));
          hv.addEventListener('playing', () => {
            ['touchend', 'pointerup', 'click'].forEach(ev => window.removeEventListener(ev, unlock));
          }, { once: true });
          // putar terus tanpa jeda: loop bawaan (tanpa fade/reset), dan otomatis diputar lagi
          // bila berhenti karena sebab apa pun (hemat daya, scroll, interupsi sistem)
          const resume = () => {
            if (!document.body.contains(hv) || document.hidden) return;
            if (hv.paused || hv.ended) { if (hv.ended) hv.currentTime = 0; tryPlay(); }
          };
          ['pause', 'ended', 'stalled', 'suspend', 'waiting'].forEach(ev => hv.addEventListener(ev, () => setTimeout(resume, 120)));
          document.addEventListener('visibilitychange', resume);
          window.addEventListener('pageshow', resume);
          window.addEventListener('focus', resume);
          const watch = setInterval(() => {
            if (!document.body.contains(hv)) { clearInterval(watch); return; }
            resume();
          }, 1200);
        }
      }

      const hero = $('#hero');
      if (hero) hero.onmousemove = e => {
        const glow = $('#glow');
        const r = hero.getBoundingClientRect();
        glow.style.left = e.clientX - r.left + 'px';
        glow.style.top = e.clientY - r.top + 'px';
      };
    }

    function route() {
      const [page, arg] = location.hash.replace(/^#\/?/, '').split('?')[0].split('/');
      let key = page;
      let html;

      if (page == 'layanan' && arg)        html = R.sd(arg);
      else if (page == 'portfolio' && arg) { key = 'pd'; html = R.pd(arg); }
      else if (page == 'artikel' && arg)   { key = 'ad'; html = R.ad(arg); }
      else                                 html = (R[page] || R.nf)(arg);

      if (!R[page] && page != '') key = 'nf';

      $('#app').innerHTML = html;
      closeSub();
      $('#menu').innerHTML = NAV.map(n => {
        const on = navPages(n).has(page) ? 'on' : '';
        if (n.sub) return `<a href="${n.h || n.sub[0][0]}" class="has-sub ${on}" data-sub="${n.k}" aria-haspopup="true" aria-expanded="false">${n.t} <span class="car">▾</span></a>`;
        return `<a href="${n.h}" class="${n.cta ? 'cta' : ''} ${on}">${n.t}</a>`;
      }).join('');
      $('#menu').classList.remove('o');
      $('#nav').classList.remove('mo');
      document.body.dataset.p = key === '' ? 'home' : key == 'pd' ? 'hero' : '';
      document.title = (page ? page[0].toUpperCase() + page.slice(1) + ' — ' : '') + 'FREESPACE BUILDING';

      scrollTo(0, 0);
      pageInit(key);
      initEffects();

      if (page == 'kerjasama' && arg) {
        requestAnimationFrame(() => {
          const t = document.getElementById('ks-' + arg);
          if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }

    const subPanel = document.createElement('div');
    subPanel.id = 'subm';
    subPanel.setAttribute('role', 'menu');
    document.body.appendChild(subPanel);
    let subOpen = null;

    function closeSub() {
      subPanel.classList.remove('o');
      subOpen = null;
      $$('#menu .has-sub').forEach(a => a.setAttribute('aria-expanded', 'false'));
    }

    function openSub(a) {
      const key = a.dataset.sub;
      subPanel.innerHTML = SUBS[key].map((it, i) => `
        <a role="menuitem" href="${it[0]}" style="--i:${i}">
          <span class="sg">${it[3]}</span>
          <span class="st"><b>${it[1]}</b><small>${it[2]}</small></span>
          <span class="sa">→</span>
        </a>`).join('');
      const r = a.getBoundingClientRect();
      const nb = $('#nav').getBoundingClientRect();
      subPanel.classList.remove('o');
      subPanel.style.top = Math.round(nb.bottom + 10) + 'px';
      const w = subPanel.offsetWidth;
      const left = Math.max(12, Math.min(r.left, innerWidth - w - 12));
      const ax = Math.max(22, Math.min(r.left + r.width / 2 - left, w - 22));
      subPanel.style.left = left + 'px';
      subPanel.style.setProperty('--ax', ax + 'px');
      subPanel.style.setProperty('--ox', ax + 'px');
      void subPanel.offsetWidth;            // restart animasi
      subPanel.classList.add('o');
      subOpen = key;
      a.setAttribute('aria-expanded', 'true');
    }

    // sorotan cahaya mengikuti kursor di dalam dropdown
    subPanel.addEventListener('mousemove', e => {
      const it = e.target.closest('a');
      if (!it) return;
      const r = it.getBoundingClientRect();
      it.style.setProperty('--mx', e.clientX - r.left + 'px');
      it.style.setProperty('--my', e.clientY - r.top + 'px');
    });

    // saat satu dropdown terbuka, hover menu lain langsung berpindah
    $('#menu').addEventListener('mouseover', e => {
      const a = e.target.closest('.has-sub');
      if (a && subOpen && subOpen != a.dataset.sub) { closeSub(); openSub(a); }
    });

    document.addEventListener('click', e => {
      const a = e.target.closest('#menu .has-sub');
      if (a) {
        e.preventDefault();
        subOpen == a.dataset.sub ? closeSub() : (closeSub(), openSub(a));
        return;
      }
      if (e.target.closest('#subm')) { closeSub(); return; }
      closeSub();
    });
    addEventListener('keydown', e => { if (e.key == 'Escape') closeSub(); });
    addEventListener('resize', closeSub);
    $('#menu').addEventListener('scroll', closeSub, { passive: true });

    addEventListener('hashchange', route);

    addEventListener('scroll', () => {
      const y = scrollY;
      $('#nav').classList.toggle('s', y > 40);
      $('#pg').style.width = y / (document.body.scrollHeight - innerHeight) * 100 + '%';
      $('#top').classList.toggle('v', y > 500);
    });

    $('#top').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

    $('#ham').onclick = () => {
      const open = $('#menu').classList.toggle('o');
      $('#nav').classList.toggle('mo', open);
    };

    const root = document.documentElement;
    root.dataset.theme = 'light';

    $('#th').onclick = () => {
      const next = root.dataset.theme == 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      ST('fst', next);
    };

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const WAURL = 'https://wa.me/6285723405913';
    const svPrice = id => { const s = SV.find(x => x[0] == id); return s ? s[2] : 0; };

    const PX = {
      interior: svPrice('desain-3d-interior'),  
      facade:   60000,     
      kitchen:  3500000,   
      wood:     2800000    
    };

    const mix = (a, b, t) => {
      const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
      const A = p(a), B = p(b);
      return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
    };
    const dk = (c, t = .25) => mix(c, '#000000', t);
    const lt = (c, t = .25) => mix(c, '#ffffff', t);

    const opts = (name, list, sel, type = 'checkbox') =>
      `<div class="opts">${list.map(o => `
        <label class="opt"><input type="${type}" name="${name}" value="${esc(o)}" ${[].concat(sel || []).includes(o) ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div>`;
    const pick = (el, name) => $$(`input[name="${name}"]:checked`, el).map(i => i.value);
    const grab = (el, d, spec) => spec.forEach(([n, t]) => { const v = pick(el, n); d[n] = t == 'r' ? (v[0] || '') : v; });

    const PL = [
      { t: 'Desain Arsitektur', d: 'Perencanaan desain bangunan dari denah, tampak, hingga render 3D.', rows: [
        ['Desain 3D Bangunan', '/m²', svPrice('desain-3d-bangunan'), 'Denah & tampak, render eksterior, walkthrough singkat, revisi 2x.'],
        ['Desain Facade 3D', '/m² fasad', PX.facade, 'Studi tampak depan, pilihan material & warna, render multi-sudut.', 1],
        ['Analisis Struktur', '/m²', svPrice('analisis-struktur'), 'Model struktur 3D, laporan perhitungan, gambar penulangan, SNI 1726.'],
        ['Estimasi RAB', '/m²', svPrice('estimasi-rab'), 'Volume pekerjaan, analisa harga satuan, RAB detail, kurva-S.']
      ] },
      { t: 'Gambar Teknis DED', d: 'Dokumen teknis lengkap untuk tender dan pelaksanaan di lapangan.', rows: [
        ['Bestek / Gambar Kerja', '/m²', svPrice('bestek-gambar-kerja'), 'Gambar kerja arsitektur, detail konstruksi, spesifikasi material, format PDF & DWG.'],
        ['Dokumen PBG', 'paket', 'Termasuk Paket All In', 'Kelengkapan dokumen perizinan, kelayakan sesuai standar.'],
        ['Shop Drawing Interior & Woodworking', 'paket', 'Sesuai proyek', 'Gambar produksi untuk workshop, dibahas saat konsultasi.']
      ] },
      { t: 'Interior & Woodworking', d: 'Desain interior, kitchen set, dan furnitur custom dari workshop kami.', rows: [
        ['Desain 3D Interior', '/m²', PX.interior, 'Render 3D multi-sudut, moodboard & palet material, revisi 2x, layout furnitur.'],
        ['Kitchen Set Custom', '/meter lari', PX.kitchen, 'Mulai dari. Harga final tergantung layout, warna, dan material countertop.', 1],
        ['Woodworking Custom', '/m²', PX.wood, 'Mulai dari. Lemari, walk-in closet, backdrop TV, panel dinding.', 1]
      ] },
      { t: 'Paket & Bangunan Jadi', d: 'Layanan terpadu dari desain hingga serah terima kunci.', rows: [
        ['Paket All In', '/m²', svPrice('paket-all-in'), 'Semua layanan desain, dokumen PBG, pendampingan konsultasi, prioritas jadwal.'],
        ['Konstruksi / Bangunan Jadi', 'sesuai RAB', 'Sesuai RAB', 'Biaya pembangunan mengikuti RAB yang disetujui, dengan pengawasan berkala.']
      ] }
    ];

    R.pricelist = () =>
      pageHeader('PRICELIST', 'Daftar harga layanan Freespace Building — transparan, per m².') + `
      <section>
        <div class="w">
          ${chips(PL.map(p => p.t))}
          <p class="mu" id="pld" style="margin-bottom:18px"></p>
          <div id="plb"></div>
          <p class="mu" style="margin-top:20px;font-size:.85rem">
            Harga bersifat estimasi dan dapat berubah sesuai kompleksitas proyek. Tanda <span class="tag" style="margin:0">Indikatif</span>
            berarti harga awal yang akan dipastikan setelah konsultasi.
          </p>
          <div class="acts" style="margin-top:26px">
            <a class="btn" href="#/reservasi">${arrow('Reservasi Konsultasi')}</a>
            <a class="btn l" href="#/kalkulator">Hitung Estimasi Biaya</a>
            <a class="btn l" href="#/simulasi">Coba Simulasi Desain</a>
          </div>
        </div>
      </section>`;

    function initPricelist() {
      const draw = i => {
        const p = PL[i];
        $('#pld').textContent = p.d;
        $('#plb').innerHTML = p.rows.map(r => `
          <div class="pr sl">
            <div>
              <h3>${r[0]}${r[4] ? '<span class="tag">Indikatif</span>' : ''}</h3>
              <p class="mu">${r[3]}</p>
            </div>
            <div class="pp">
              ${typeof r[2] == 'number' ? `<div class="price">${rp(r[2])}</div>` : `<div class="price" style="font-size:1.05rem">${r[2]}</div>`}
              <small>${r[1]}</small>
            </div>
          </div>`).join('');
      };
      $$('#fl .chip').forEach((b, i) => b.onclick = () => {
        $$('#fl .chip').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        draw(i);
      });
      draw(0);
    }

    const PFD = {
      'Semua': 'Seluruh karya Freespace — dari desain hingga bangunan jadi.',
      'Desain Arsitektur': 'Konsep massa, denah, tampak, dan render 3D bangunan.',
      'Gambar Teknis DED': 'Gambar kerja detail, struktur, dan spesifikasi siap pelaksanaan.',
      'Bangunan Jadi': 'Proyek yang sudah dibangun dan diserahterimakan kepada klien.',
      'Interior & Woodworking': 'Interior, kitchen set, dan furnitur custom dari workshop kami.'
    };

    R.portfolio = () =>
      pageHeader('PORTOFOLIO', 'Desain arsitektur, gambar teknis DED, bangunan jadi, serta interior & woodworking.') + `
      <section>
        <div class="w">
          ${chips(Object.keys(PFD))}
          <p class="mu" id="pfd" style="margin-bottom:18px">${PFD['Semua']}</p>
          <div class="grid" id="fg">${PF.map(portfolioCard).join('')}</div>
        </div>
      </section>`;

    function initPortfolio() {
      initFilter();
      $$('#fl .chip').forEach(b => b.addEventListener('click', () => {
        $('#pfd').textContent = `${PFD[b.textContent]} (${$$('#fg .card').filter(c => c.style.display != 'none').length} proyek)`;
      }));
    }
      const MUZQY_WA = '62895331504721';
      const MUZQY_TAMPIL = '0895-3315-04721';
      const waKs = txt => `https://wa.me/${MUZQY_WA}?text=${encodeURIComponent(txt)}`;  

    const KS_MKT = [
      ['referensi', 'Referensi', 1, '◎',
        'Anda merekomendasikan klien yang membutuhkan desain atau pembangunan, kami yang menangani sisanya.',
        ['Cukup perkenalkan calon klien ke tim kami', 'Tanpa target penjualan', 'Fee dibayar setelah klien melakukan pembayaran']],
      ['sales-eksternal', 'Sales Eksternal & Handling', 2, '◈',
        'Anda ikut mendampingi calon klien sampai deal: follow-up, presentasi, hingga negosiasi.',
        ['Mendampingi klien dari awal hingga kesepakatan', 'Dibekali materi, pricelist, dan portofolio', 'Dukungan teknis dari tim desain & RAB']],
      ['agency-badan', 'Agency / Badan Usaha', 3, '▣',
        'Untuk agency, konsultan, developer, atau badan usaha yang menyalurkan proyek secara berkelanjutan.',
        ['Kerjasama dalam bentuk badan usaha', 'Prioritas penjadwalan proyek', 'Skema kerjasama tertulis']]
    ];

    R.kerjasama = () =>
      pageHeader('LAYANAN KERJASAMA', 'Bergabung sebagai vendor, subkontraktor, atau mitra marketing bersama Freespace Building.') + `
      <section id="ks-vendor">
        <div class="w">
          <h2 class="rvl">Vendor / Subkon</h2>
          <div class="card ks-box rvl" style="margin-top:20px">
            <div>
              <div class="cic">${ico('kontraktor')}</div>
              <h3>Daftar sebagai Vendor atau Subkontraktor</h3>
              <p class="mu" style="margin:8px 0 0">Punya keahlian di bidang struktur, finishing, MEP, interior, atau pengadaan material? Hubungi Muzqy Zibran Ibrani (Site Manager Konstruksi) untuk membahas kerjasama.</p>
            </div>
            <div class="ks-act">
              <a class="btn" target="_blank" rel="noopener"
                 href="${waKs('Halo Pak Muzqy, saya ingin bergabung sebagai vendor/subkon Freespace Building.')}">${arrow('Hubungi Muzqy')}</a>
              <small class="mu">WhatsApp ${MUZQY_TAMPIL}</small>
            </div>
          </div>
        </div>
      </section>

      <section id="ks-marketing" style="background:var(--bg2)">
        <div class="w">
          <h2 class="rvl">Kerjasama Marketing</h2>
          <p class="mu rvl" style="margin-top:8px;max-width:640px">Skema fee dihitung dari nilai proyek yang berhasil closing.</p>
          <div class="grid ks-grid" style="margin-top:30px">
            ${KS_MKT.map((k, i) => `
              <div class="card tilt rvl" id="ks-${k[0]}" style="transition-delay:${i * 70}ms">
                <div class="cic">${k[3]}</div>
                <h3>${k[1]}</h3>
                <div class="price">${k[2]}%<small style="font-size:.9rem"> fee</small></div>
                <p class="mu" style="margin:8px 0 14px">${k[4]}</p>
                ${k[5].map(d => `<p class="ks-ck"><span class="ck">✓</span>${d}</p>`).join('')}
                <a class="btn" style="margin-top:18px" target="_blank" rel="noopener"
                   href="${waKs('Halo Pak Muzqy, saya tertarik kerjasama marketing skema ' + k[1] + ' (' + k[2] + '%).')}">${arrow('Ajukan Kerjasama')}</a>
              </div>`).join('')}
          </div>
        </div>
      </section>`;

    R['customer-journey'] = () =>
      pageHeader('CUSTOMER JOURNEY', '7 tahap transparan dari ide hingga kunci di tangan.') + `
      <section>
        <div class="w">
          <div class="tl" id="tl">
            <div class="pl"></div>
            ${JR.map((j, i) => `<button class="dot" aria-label="${j[0]}">0${i + 1}</button>`).join('')}
          </div>
          <div class="jwrap">
            <div class="card" id="jc" style="min-height:220px"></div>
            <div class="card jph" id="jph"></div>
          </div>
        </div>
      </section>`;

    function initJourney() {
      let cur = 0;
      const select = i => {
        cur = i;
        $$('.dot').forEach((d, j) => d.classList.toggle('on', j <= i));
        $('.pl').style.width = `calc((100% - 44px) * ${i / (JR.length - 1)})`;
        const j = JR[i];
        $('#jc').innerHTML = `
          <div class="sl">
            <small class="mu">Tahap 0${i + 1} dari 0${JR.length} · Estimasi ${j[2]}</small>
            <h2 style="margin-top:6px">${j[0]}</h2>
            <p class="mu" style="margin-bottom:14px">${j[1]}</p>
            <p style="font-weight:700;margin-bottom:6px">Yang Anda terima</p>
            ${j[3].map((o, k) => `<p style="margin:6px 0"><span class="ck" style="animation-delay:${k * 120}ms">✓</span>${o}</p>`).join('')}
          </div>
          <button type="button" class="jar jl" id="jp" aria-label="Tahap sebelumnya" ${i == 0 ? 'disabled' : ''}>‹</button>
          <button type="button" class="jar jr" id="jn" aria-label="Tahap berikutnya" ${i == JR.length - 1 ? 'disabled' : ''}>›</button>`;
        const foto = (GALERY.proses && GALERY.proses[i]) || GALERY.placeholder;
        $('#jph').innerHTML = `
          <div class="jimg">
            <img src="${foto}" alt="Foto proses: ${esc(j[0])}" onerror="this.onerror=null;this.src=GALERY.placeholder">
            <span class="jcap"><b>Foto Proses</b>Tahap 0${i + 1} · ${esc(j[0])}</span>
          </div>`;
        $('#jp').onclick = () => cur > 0 && select(cur - 1);
        $('#jn').onclick = () => cur < JR.length - 1 && select(cur + 1);
      };
      $$('.dot').forEach((d, i) => d.onclick = () => select(i));
      select(0);
    }

    const IP = {
      'Japandi Zen':   { wall: '#E8DFD0', floor: '#B58B5E', acc: '#6F5B49', fur: '#9C8670', soft: '#D8C9B2' },
      'Tropis Modern': { wall: '#DCE7D6', floor: '#A5763F', acc: '#3F7D4E', fur: '#7A5836', soft: '#BBD3B2' },
      'Minimalist':    { wall: '#F0F2F4', floor: '#C9CFD6', acc: '#1F2937', fur: '#9AA5B1', soft: '#DDE2E8' },
      'Industrial':    { wall: '#8C9096', floor: '#4A4E54', acc: '#D9822B', fur: '#2C3036', soft: '#6F7479' }
    };
    const IL = {
      'Warm 3000K':    { win: '#FFE3A8', ov: 'rgba(255,170,70,.16)', glow: .55, gc: '#FFC46B' },
      'Natural 4000K': { win: '#E3F0FF', ov: 'rgba(255,255,255,.06)', glow: .18, gc: '#FFFFFF' },
      'Moody 2700K':   { win: '#33425E', ov: 'rgba(8,12,30,.38)', glow: .9, gc: '#FFB454' }
    };

    function roomSVG(s) {
      const p = IP[s.style], l = IL[s.light], r = s.room, ind = s.style == 'Industrial';
      let f = `<defs><radialGradient id="rg"><stop offset="0" stop-color="${l.gc}" stop-opacity="${l.glow}"/><stop offset="1" stop-color="${l.gc}" stop-opacity="0"/></radialGradient></defs>`;
      f += `<rect width="400" height="260" fill="${p.wall}"/>`;
      if (ind) {
        for (let y = 0; y < 176; y += 12) f += `<line x1="0" y1="${y}" x2="400" y2="${y}" stroke="${dk(p.wall, .18)}" stroke-width="1" opacity=".6"/>`;
        f += `<rect y="14" width="400" height="6" fill="#1d1f22"/>`;
      }
      f += `<polygon points="0,178 400,178 400,260 0,260" fill="${p.floor}"/>`;
      f += `<rect y="172" width="400" height="8" fill="${dk(p.wall, .14)}"/>`;
      for (let i = 0; i < 7; i++) f += `<line x1="${i * 70 - 60}" y1="260" x2="${i * 62}" y2="180" stroke="${dk(p.floor, .18)}" stroke-width="1" opacity=".55"/>`;

      const fr = ind ? '#14161A' : lt(p.acc, .1);
      f += `<rect x="262" y="34" width="96" height="96" fill="${fr}"/><rect x="267" y="39" width="86" height="86" fill="${l.win}"/>`;
      f += `<line x1="310" y1="39" x2="310" y2="125" stroke="${fr}" stroke-width="3"/><line x1="267" y1="82" x2="353" y2="82" stroke="${fr}" stroke-width="3"/>`;
      if (s.style == 'Japandi Zen') f += `<rect x="248" y="30" width="16" height="104" fill="${p.soft}"/><rect x="356" y="30" width="16" height="104" fill="${p.soft}"/>`;

      const plant = (x, k) =>
        `<rect x="${x - 7 * k}" y="${232 - 22 * k}" width="${14 * k}" height="${22 * k}" rx="3" fill="${dk(p.fur, .1)}"/>` +
        `<ellipse cx="${x}" cy="${210 - 20 * k}" rx="${16 * k}" ry="${22 * k}" fill="#3E8A4F"/>` +
        `<ellipse cx="${x - 10 * k}" cy="${214 - 14 * k}" rx="${9 * k}" ry="${16 * k}" fill="#4FA362"/>` +
        `<ellipse cx="${x + 10 * k}" cy="${214 - 14 * k}" rx="${9 * k}" ry="${16 * k}" fill="#2F7141"/>`;

      const ar = +s.area || 16, k = 1.1 - (ar - 6) / 54 * 0.32, cx0 = 200, cy0 = 230;
      f += `<g transform="translate(${cx0} ${cy0}) scale(${k.toFixed(3)}) translate(${-cx0} ${-cy0})">`;
      let lamp = [300, 150];
      if (r == 'Living Room') {
        f += `<ellipse cx="150" cy="228" rx="122" ry="22" fill="${p.soft}"/>`;
        f += `<rect x="92" y="44" width="96" height="64" fill="${p.soft}" stroke="${p.acc}" stroke-width="4"/>`;
        f += `<circle cx="126" cy="78" r="15" fill="${p.acc}" opacity=".75"/><rect x="146" y="62" width="30" height="30" fill="${p.fur}" opacity=".7"/>`;
        f += `<rect x="52" y="122" width="196" height="54" rx="10" fill="${p.fur}"/>`;
        f += `<rect x="42" y="140" width="28" height="48" rx="8" fill="${dk(p.fur, .15)}"/><rect x="230" y="140" width="28" height="48" rx="8" fill="${dk(p.fur, .15)}"/>`;
        f += `<rect x="64" y="150" width="172" height="38" rx="8" fill="${lt(p.fur, .14)}"/>`;
        f += `<rect x="78" y="136" width="34" height="30" rx="7" fill="${p.acc}"/><rect x="188" y="136" width="34" height="30" rx="7" fill="${lt(p.acc, .3)}"/>`;
        f += `<rect x="98" y="204" width="104" height="14" rx="3" fill="${dk(p.floor, .35)}"/><rect x="106" y="218" width="6" height="12" fill="${dk(p.floor, .35)}"/><rect x="188" y="218" width="6" height="12" fill="${dk(p.floor, .35)}"/>`;
        f += `<rect x="283" y="100" width="4" height="100" fill="${dk(p.fur, .3)}"/><polygon points="268,100 302,100 296,76 274,76" fill="${lt(l.gc, .5)}"/><rect x="274" y="196" width="26" height="6" rx="3" fill="${dk(p.fur, .3)}"/>`;
        lamp = [285, 90];
        f += plant(s.style == 'Tropis Modern' ? 366 : 370, s.style == 'Tropis Modern' ? 1.3 : .9);
      } else {
        const kos = r == 'Kamar Kos', ms = r == 'Master Suite';
        const bx = kos ? 96 : ms ? 56 : 76, bw = kos ? 132 : ms ? 200 : 168;
        f += `<ellipse cx="${bx + bw / 2}" cy="230" rx="${bw / 2 + 36}" ry="20" fill="${p.soft}"/>`;
        f += `<rect x="${bx - 6}" y="${ms ? 70 : 90}" width="${bw + 12}" height="${ms ? 86 : 66}" rx="6" fill="${p.acc}"/>`;
        if (ms) for (let i = 0; i < 5; i++) f += `<rect x="${bx + 8 + i * 38}" y="80" width="24" height="64" fill="${lt(p.acc, .18)}" opacity=".6"/>`;
        f += `<rect x="${bx}" y="138" width="${bw}" height="46" rx="8" fill="${lt(p.soft, .55)}"/>`;
        f += `<rect x="${bx + 10}" y="130" width="${bw / 2 - 16}" height="18" rx="7" fill="#fff"/><rect x="${bx + bw / 2 + 6}" y="130" width="${bw / 2 - 16}" height="18" rx="7" fill="#fff"/>`;
        f += `<rect x="${bx}" y="156" width="${bw}" height="30" rx="6" fill="${p.fur}"/><rect x="${bx}" y="156" width="${bw}" height="7" fill="${lt(p.fur, .25)}"/>`;
        f += `<rect x="${bx - 36}" y="150" width="28" height="34" rx="3" fill="${p.fur}"/><rect x="${bx - 27}" y="130" width="10" height="20" fill="${dk(p.fur, .3)}"/><polygon points="${bx - 33},130 ${bx - 11},130 ${bx - 15},114 ${bx - 29},114" fill="${lt(l.gc, .5)}"/>`;
        lamp = [bx - 22, 124];
        if (!kos) f += `<rect x="${bx + bw + 8}" y="150" width="28" height="34" rx="3" fill="${p.fur}"/>`;
        if (ms) f += `<rect x="${bx + 24}" y="196" width="${bw - 48}" height="16" rx="5" fill="${p.fur}"/>`;
        if (kos) {
          f += `<rect x="262" y="150" width="104" height="8" fill="${dk(p.fur, .1)}"/><rect x="266" y="158" width="6" height="28" fill="${dk(p.fur, .3)}"/><rect x="356" y="158" width="6" height="28" fill="${dk(p.fur, .3)}"/>`;
          f += `<rect x="296" y="138" width="34" height="12" rx="2" fill="#2b2f36"/><rect x="300" y="141" width="26" height="6" fill="${l.win}"/>`;
          f += `<rect x="298" y="166" width="30" height="8" rx="3" fill="${p.acc}"/><rect x="310" y="174" width="6" height="22" fill="${dk(p.acc, .2)}"/>`;
        } else f += plant(372, .8);
      }
      f += `</g>`;
      lamp = [cx0 + (lamp[0] - cx0) * k, cy0 + (lamp[1] - cy0) * k];
      f += `<rect width="400" height="260" fill="${l.ov}"/>`;
      f += `<circle cx="${lamp[0]}" cy="${lamp[1]}" r="86" fill="url(#rg)"/>`;
      return f;
    }

    const KC = { 'Putih Glossy': '#F4F5F7', 'Sage Green': '#9DB09A', 'Navy Blue': '#27456B', 'Walnut Wood': '#7A5133' };
    const KT = { 'Granit Hitam': '#23262B', 'Marmer Putih': '#ECEDEF', 'Solid Surface': '#C9CED3', 'Kayu Butcher': '#C79A64' };
    const KADD = {
      layout: { 'Linear': 0, 'L-Shape': 300000, 'U-Shape': 500000, 'Island': 800000 },
      cab:    { 'Putih Glossy': 0, 'Sage Green': 100000, 'Navy Blue': 100000, 'Walnut Wood': 400000 },
      top:    { 'Granit Hitam': 0, 'Marmer Putih': 600000, 'Solid Surface': 500000, 'Kayu Butcher': 300000 }
    };

    function kitchenSVG(s) {
      const cab = KC[s.cab], top = KT[s.top], X = 30, Y = 14, RW = 340, RH = 176, D = 30, E = 7;
      const rw = Math.round(130 + (s.len - 2) / 8 * 210);
      const topW = s.layout == 'U-Shape' ? RW : rw;
      let o = `<rect width="400" height="300" fill="#F3F0EA"/>`;
      o += `<rect x="${X}" y="${Y}" width="${RW}" height="${RH}" fill="#E9E4DB" stroke="#7d838c" stroke-width="4"/>`;
      const run = (x, y, w, h, fr) => {
        let cx = x, cy = y, cw = w, ch = h;
        if (fr == 'b') ch = h - E;
        if (fr == 'r') cw = w - E;
        if (fr == 'l') { cx = x + E; cw = w - E; }
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cab}" stroke="${dk(cab, .35)}" stroke-width="1"/>` +
               `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="${top}"/>`;
      };
      o += run(X, Y, topW, D, 'b');
      if (s.layout == 'L-Shape' || s.layout == 'U-Shape') o += run(X, Y + D, D, 112, 'r');
      if (s.layout == 'U-Shape') o += run(X + RW - D, Y + D, D, 112, 'l');
      if (s.layout == 'Island') {
        const iw = Math.max(90, Math.min(190, Math.round(rw * .6)));
        o += run(X + 70, Y + 104, iw, 36, 'b');
        for (let i = 0; i < 3; i++) o += `<circle cx="${X + 70 + iw * (i + 1) / 4}" cy="${Y + 158}" r="7" fill="${dk(cab, .1)}" stroke="#6b7078"/>`;
      }
      const sx = X + 36, hx = sx + 46;
      o += `<rect x="${sx}" y="${Y + 5}" width="40" height="${D - 14}" rx="3" fill="#B8C0C8" stroke="#8c949c"/><circle cx="${sx + 20}" cy="${Y + 7}" r="2.5" fill="#6b7078"/>`;
      o += `<rect x="${hx}" y="${Y + 3}" width="46" height="${D - 10}" rx="3" fill="#2b2b2b"/>`;
      [[8, 7], [16, 7], [28, 7], [36, 7]].forEach(([dx, dy], i) => o += `<circle cx="${hx + dx + (i > 1 ? 2 : 0)}" cy="${Y + 3 + dy + (i % 2 ? 3 : 0)}" r="3" fill="none" stroke="#9aa1a8"/>`);
      if (topW >= 200) o += `<rect x="${X + topW - 38}" y="${Y + 1}" width="36" height="${D - 2}" rx="3" fill="#CBD2D9" stroke="#8c949c"/>`;
      o += `<text x="${X + 8}" y="${Y + RH - 8}" font-size="10" fill="#7d838c">DENAH</text>`;

      o += `<line x1="0" y1="200" x2="400" y2="200" stroke="#d6d1c6"/><text x="${X}" y="212" font-size="10" fill="#7d838c">TAMPAK DEPAN</text>`;
      o += `<rect x="${X}" y="218" width="${topW}" height="32" fill="${lt(cab, .06)}" stroke="${dk(cab, .35)}"/>`;
      for (let x = X + 40; x < X + topW; x += 40) o += `<line x1="${x}" y1="218" x2="${x}" y2="250" stroke="${dk(cab, .3)}"/>`;
      o += `<polygon points="${hx - 4},222 ${hx + 50},222 ${hx + 40},244 ${hx + 6},244" fill="#9AA3AD"/>`;
      o += `<rect x="${X}" y="250" width="${topW}" height="8" fill="#DADFE4"/>`;
      o += `<rect x="${X}" y="258" width="${topW}" height="6" fill="${top}"/>`;
      o += `<rect x="${X}" y="264" width="${topW}" height="28" fill="${cab}" stroke="${dk(cab, .35)}"/>`;
      for (let x = X + 40; x < X + topW; x += 40) o += `<line x1="${x}" y1="264" x2="${x}" y2="292" stroke="${dk(cab, .3)}"/>`;
      for (let x = X + 40; x < X + topW; x += 40) o += `<rect x="${x - 14}" y="266" width="10" height="2.5" rx="1" fill="${dk(cab, .45)}"/><rect x="${x + 4}" y="266" width="10" height="2.5" rx="1" fill="${dk(cab, .45)}"/>`;
      o += `<rect x="0" y="292" width="400" height="8" fill="#C9C3B8"/>`;
      return o;
    }

    const FW = { 'Putih': '#F5F5F2', 'Abu-abu': '#A9AEB4', 'Krem': '#E6D8BC', 'Hitam Matte': '#2B2D31' };
    const FA = { 'Kayu': '#A9754A', 'Batu Alam': '#7B7F82', 'Secondary Skin': '#C9CED3', 'Beton Ekspos': '#9B9C9A' };
    const FROOF = { 'Minimalis Modern': '#4A4F57', 'Tropis': '#6B4A32', 'Industrial': '#34373B', 'Klasik Modern': '#7A3B2E' };
    const FDEF = { 'Minimalis Modern': 'Dak Datar', 'Tropis': 'Pelana', 'Industrial': 'Dak Datar', 'Klasik Modern': 'Perisai' };

    function accentPanel(t, x, y, w, h, c) {
      let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
      if (t == 'Kayu') {
        for (let yy = y + 6; yy < y + h; yy += 7) s += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="${dk(c, .3)}" stroke-width="1" opacity=".6"/>`;
      } else if (t == 'Batu Alam') {
        for (let yy = y, r = 0; yy < y + h - 2; yy += 10, r++)
          for (let xx = x + (r % 2 ? 6 : 0); xx < x + w - 2; xx += 14)
            s += `<rect x="${xx}" y="${yy}" width="${Math.min(12, x + w - xx)}" height="${Math.min(8, y + h - yy)}" rx="1.5" fill="${(xx + yy) % 3 ? lt(c, .12) : dk(c, .1)}"/>`;
      } else if (t == 'Secondary Skin') {
        for (let xx = x + 3; xx < x + w; xx += 6) s += `<line x1="${xx}" y1="${y}" x2="${xx}" y2="${y + h}" stroke="${dk(c, .4)}" stroke-width="2.2"/>`;
      } else {
        for (let i = 0; i < 24; i++) s += `<circle cx="${x + (i * 37) % w}" cy="${y + (i * 53) % h}" r="1.4" fill="${dk(c, .25)}" opacity=".7"/>`;
      }
      return s;
    }

    function winSVG(x, y, w, h, o, glass, frame) {
      let t = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${frame}"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="${glass}"/>`;
      if (o.style == 'Industrial') {
        for (let i = 1; i < 3; i++) t += `<line x1="${x + w * i / 3}" y1="${y}" x2="${x + w * i / 3}" y2="${y + h}" stroke="${frame}" stroke-width="1.6"/>`;
        t += `<line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${frame}" stroke-width="1.6"/>`;
      } else if (o.style == 'Klasik Modern') {
        t += `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${frame}" stroke-width="2"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${frame}" stroke-width="2"/>`;
        t += `<rect x="${x - 8}" y="${y}" width="7" height="${h}" fill="#5E6B5A"/><rect x="${x + w + 1}" y="${y}" width="7" height="${h}" fill="#5E6B5A"/>`;
      } else if (o.style == 'Tropis') {
        for (let yy = y + 8; yy < y + h - 3; yy += 6) t += `<line x1="${x + 3}" y1="${yy}" x2="${x + w - 3}" y2="${yy}" stroke="${frame}" stroke-width="1.4"/>`;
      } else {
        t += `<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${frame}" stroke-width="2.5"/>`;
      }
      return t + `<polygon points="${x + 4},${y + h - 4} ${x + w * .45},${y + 4} ${x + w * .6},${y + 4} ${x + 12},${y + h - 4}" fill="#fff" opacity=".18"/>`;
    }

    function treeSVG(x, y, k) {
      return `<rect x="${x - 3 * k}" y="${y - 30 * k}" width="${6 * k}" height="${30 * k}" fill="#6b4a32"/>` +
        `<circle cx="${x}" cy="${y - 44 * k}" r="${22 * k}" fill="#3E8A4F"/><circle cx="${x - 14 * k}" cy="${y - 34 * k}" r="${14 * k}" fill="#4FA362"/><circle cx="${x + 14 * k}" cy="${y - 36 * k}" r="${15 * k}" fill="#2F7141"/>`;
    }

    function facadeSVG(o, uid) {
      uid = uid || 'f';
      const fl = o.floors, bw = Math.round(160 + (o.w - 6) / 14 * 180), bx = Math.round((400 - bw) / 2);
      const gy = 222, fh = fl == 1 ? 104 : fl == 2 ? 76 : 56, bh = fl * fh, top = gy - bh;
      const W = o.wall, trim = dk(W, .22), roofC = FROOF[o.style], acc = o.acc;
      const glass = o.style == 'Minimalis Modern' ? '#5E7C9A' : '#A9CBE8';
      const frame = o.style == 'Industrial' ? '#14161A' : o.style == 'Klasik Modern' ? '#FFFFFF' : o.style == 'Tropis' ? '#7A5230' : '#2B2F36';
      const pw = Math.round(bw * .26);
      let s = `<defs><linearGradient id="${uid}sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CC4EE"/><stop offset="1" stop-color="#EAF3FB"/></linearGradient></defs>`;
      s += `<rect width="400" height="260" fill="url(#${uid}sk)"/>`;
      s += `<circle cx="352" cy="38" r="16" fill="#fff" opacity=".7"/>`;
      s += treeSVG(30, gy, 1.1) + treeSVG(374, gy, .9);
      s += `<rect y="${gy}" width="400" height="38" fill="#7E8B78"/><rect x="${bx - 12}" y="${gy}" width="${bw + 24}" height="7" fill="#BDBBB3"/>`;

      for (let i = 0; i < fl; i++) {
        const y = gy - (i + 1) * fh, set = o.style == 'Minimalis Modern' && i > 0;
        const x = set ? bx + Math.round(bw * .08) : bx, w = set ? bw - Math.round(bw * .08) : bw;
        s += `<rect x="${x}" y="${y}" width="${w}" height="${fh}" fill="${W}"/>`;
      }
      const ph = (fl > 1 && o.style == 'Minimalis Modern') ? fh : bh, py = gy - ph;
      s += accentPanel(o.accName, bx, py, pw, ph, acc);
      for (let i = 1; i < fl; i++) s += `<rect x="${bx}" y="${gy - i * fh - 2}" width="${bw}" height="4" fill="${trim}"/>`;

      const x0 = bx + pw + 12, x1 = bx + bw - 12, n = bw > 250 ? 3 : 2, gap = 10, ww = (x1 - x0 - gap * (n - 1)) / n;
      for (let i = 0; i < fl; i++) {
        const y = gy - (i + 1) * fh, wh = Math.min(fh - 26, 58), wy = y + Math.round((fh - wh) / 2);
        for (let j = 0; j < n; j++) {
          const wx = x0 + j * (ww + gap);
          if (i == 0 && j == 0) {
            const dh = Math.min(fh - 10, 60), dw = Math.min(ww, 30);
            s += `<rect x="${wx}" y="${gy - dh}" width="${dw}" height="${dh}" fill="${dk(acc, .25)}"/><rect x="${wx + dw - 8}" y="${gy - dh / 2}" width="3" height="10" rx="1" fill="#e8d9a8"/>`;
            if (o.style == 'Klasik Modern') {
              s += `<rect x="${wx - 8}" y="${gy - dh - 4}" width="6" height="${dh + 4}" fill="#fff"/><rect x="${wx + dw + 2}" y="${gy - dh - 4}" width="6" height="${dh + 4}" fill="#fff"/>`;
              s += `<polygon points="${wx - 12},${gy - dh - 4} ${wx + dw / 2},${gy - dh - 20} ${wx + dw + 14},${gy - dh - 4}" fill="#fff" stroke="${trim}"/>`;
            }
            if (o.style == 'Industrial') s += `<rect x="${wx - 8}" y="${gy - dh - 6}" width="${dw + 16}" height="4" fill="#14161A"/>`;
            continue;
          }
          s += winSVG(wx, wy, ww, wh, o, glass, frame);
        }
      }

      const roof = o.roof;
      if (roof == 'Dak Datar') s += `<rect x="${bx - 8}" y="${top - 8}" width="${bw + 16}" height="9" fill="${dk(W, .45)}"/><rect x="${bx - 8}" y="${top - 2}" width="${bw + 16}" height="3" fill="${dk(W, .6)}"/>`;
      else if (roof == 'Pelana') s += `<polygon points="${bx - 20},${top + 2} ${bx + bw / 2},${top - 60} ${bx + bw + 20},${top + 2}" fill="${roofC}"/><rect x="${bx - 20}" y="${top - 2}" width="${bw + 40}" height="5" fill="${dk(roofC, .3)}"/>`;
      else s += `<polygon points="${bx - 20},${top + 2} ${bx + 46},${top - 44} ${bx + bw - 46},${top - 44} ${bx + bw + 20},${top + 2}" fill="${roofC}"/><rect x="${bx - 20}" y="${top - 2}" width="${bw + 40}" height="5" fill="${dk(roofC, .3)}"/>`;
      if (o.style == 'Tropis' && fl > 1) s += `<rect x="${bx - 14}" y="${gy - fh - 2}" width="${bw + 28}" height="6" fill="${roofC}"/>`;

      [[bx + 14, gy + 2, 20, 9], [bx + bw * .5, gy + 3, 26, 10], [bx + bw - 18, gy + 2, 20, 9]].forEach(b =>
        s += `<ellipse cx="${b[0]}" cy="${b[1]}" rx="${b[2]}" ry="${b[3]}" fill="${o.style == 'Tropis' ? '#3E8A4F' : '#5E9B62'}"/>`);
      return s;
    }

    const SIMS = {
      interior: {
        t: 'Interior', vb: '0 0 400 260',
        f: [
          { id: 'room', l: 'Tipe ruangan', o: ['Kamar Tidur', 'Living Room', 'Master Suite', 'Kamar Kos'] },
          { id: 'style', l: 'Gaya', o: ['Japandi Zen', 'Tropis Modern', 'Minimalist', 'Industrial'] },
          { id: 'light', l: 'Pencahayaan', o: ['Warm 3000K', 'Natural 4000K', 'Moody 2700K'] },
          { id: 'area', l: 'Luas ruangan', r: [6, 60, 1], u: ' m²', v: 16 }
        ],
        svg: roomSVG,
        sum: s => ({
          label: 'Desain 3D Interior', total: s.area * PX.interior,
          rows: [['Ruangan', s.room], ['Gaya', s.style], ['Pencahayaan', s.light], ['Tarif', rp(PX.interior) + '/m²']],
          cta: '#/reservasi?s=desain-3d-interior'
        })
      },
      kitchen: {
        t: 'Kitchen Set', vb: '0 0 400 300',
        f: [
          { id: 'layout', l: 'Layout', o: ['Linear', 'L-Shape', 'U-Shape', 'Island'] },
          { id: 'cab', l: 'Warna kabinet', o: ['Putih Glossy', 'Sage Green', 'Navy Blue', 'Walnut Wood'] },
          { id: 'top', l: 'Countertop', o: ['Granit Hitam', 'Marmer Putih', 'Solid Surface', 'Kayu Butcher'] },
          { id: 'len', l: 'Panjang total', r: [2, 10, .5], u: ' m lari', v: 4 }
        ],
        svg: kitchenSVG,
        sum: s => {
          const rate = PX.kitchen + KADD.layout[s.layout] + KADD.cab[s.cab] + KADD.top[s.top];
          return {
            label: 'Kitchen Set (indikatif)', total: rate * s.len,
            rows: [['Layout', s.layout], ['Kabinet', s.cab], ['Countertop', s.top], ['Tarif', rp(rate) + '/m lari']],
            cta: '#/reservasi?s=desain-3d-interior'
          };
        }
      },
      facade: {
        t: 'Facade', vb: '0 0 400 260',
        f: [
          { id: 'style', l: 'Gaya fasad', o: ['Minimalis Modern', 'Tropis', 'Industrial', 'Klasik Modern'] },
          { id: 'floors', l: 'Jumlah lantai', o: ['1 Lantai', '2 Lantai', '3 Lantai'] },
          { id: 'wall', l: 'Warna dinding', o: ['Putih', 'Abu-abu', 'Krem', 'Hitam Matte'] },
          { id: 'acc', l: 'Material aksen', o: ['Kayu', 'Batu Alam', 'Secondary Skin', 'Beton Ekspos'] },
          { id: 'roof', l: 'Bentuk atap', o: ['Dak Datar', 'Pelana', 'Perisai'] },
          { id: 'w', l: 'Lebar fasad', r: [6, 20, 1], u: ' m', v: 10 }
        ],
        svg: s => facadeSVG({ style: s.style, floors: parseInt(s.floors), wall: FW[s.wall], acc: FA[s.acc], accName: s.acc, roof: s.roof, w: s.w }, 'sim'),
        sum: s => {
          const fl = parseInt(s.floors), area = Math.round(s.w * fl * 3.5);
          return {
            label: 'Desain 3D Facade (indikatif)', total: area * PX.facade,
            rows: [['Gaya', s.style], ['Lantai & atap', `${fl} lantai · ${s.roof}`], ['Material', `${s.wall} + ${s.acc}`], ['Luas fasad', `±${area} m² × ${rp(PX.facade)}`]],
            cta: '#/reservasi?s=desain-3d-bangunan'
          };
        },
        change: (s, id) => { if (id == 'style') s.roof = FDEF[s.style]; }
      }
    };
    const SS = {};
    Object.keys(SIMS).forEach(k => {
      SS[k] = {};
      SIMS[k].f.forEach(f => SS[k][f.id] = f.r ? f.v : f.o[0]);
    });
    SS.facade.roof = FDEF[SS.facade.style];

    R.simulasi = () =>
      pageHeader('SIMULASI DESAIN', 'Coba kombinasi gaya, warna, dan material — lihat konsepnya langsung dan dapatkan estimasi biayanya.') + `
      <section>
        <div class="w">
          <div class="chips" id="st">
            ${Object.keys(SIMS).map(k => `<button class="chip" data-k="${k}"><span class="pf">Simulasi </span>${SIMS[k].t}</button>`).join('')}
          </div>
          <div class="two simw">
            <div class="glass" id="simc"></div>
            <div>
              <div class="sim-svg" id="sims"></div>
              <div class="res" id="simr"></div>
            </div>
          </div>
        </div>
      </section>`;

    function initSimulasi() {
      let cur = (location.hash.match(/\/simulasi\/(\w+)/) || [])[1];
      if (!SIMS[cur]) cur = 'interior';

      const view = () => {
        const k = cur, sim = SIMS[k], s = SS[k];
        const ok3d = window.SIM3D && SIM3D.show(k, s, $('#sims'), { IP, IL, KC, KT, FW, FA, FROOF });
        if (!ok3d) $('#sims').innerHTML = `<svg viewBox="${sim.vb}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pratinjau ${sim.t}">${sim.svg(s)}</svg>`;
        const m = sim.sum(s);
        const wa = `${WAURL}?text=${encodeURIComponent(`Halo Freespace Building, saya sudah mencoba Simulasi ${sim.t}.\n` + m.rows.map(r => `• ${r[0]}: ${r[1]}`).join('\n') + `\nEstimasi: ${rp(m.total)}\nMohon info lebih lanjut.`)}`;
        $('#simr').innerHTML = `
          <p>${m.label}</p>
          <div class="big">${rp(m.total)}</div>
          <div class="sum">${m.rows.map(r => `<div class="row"><span>${r[0]}</span><b>${esc(r[1])}</b></div>`).join('')}</div>
          <div class="acts kact">
            <button type="button" class="btn l" id="kk">Kunci Konsep</button>
            <a class="btn l" href="${wa}" target="_blank" rel="noopener">Lanjutkan WhatsApp</a>
            <button type="button" class="btn l kback" id="kb">Kembali</button>
          </div>`;
        $('#kk').onclick = () => askYesNo('Konsep sudah dikunci. Lanjut ke reservasi dengan data simulasi ini?', () => {
          const slug = (m.cta.match(/s=([\w-]+)/) || [])[1], sv = SV.find(x => x[0] == slug);
          ST('fsc', { sim: k, simLabel: sim.t, label: m.label, svc: sv ? sv[1] : '', rows: m.rows, total: m.total, at: Date.now() });
          location.hash = m.cta + (m.cta.includes('?') ? '&' : '?') + 'k=1';
        });
        $('#kb').onclick = () => { location.hash = '#/'; };
      };

      const controls = () => {
        const k = cur, s = SS[k];
        $('#simc').innerHTML = SIMS[k].f.map(f => f.r
          ? `<label class="rng" for="r_${f.id}"><span>${f.l}</span><b id="v_${f.id}">${s[f.id]}${f.u}</b></label>
             <input id="r_${f.id}" name="sim_${f.id}" type="range" min="${f.r[0]}" max="${f.r[1]}" step="${f.r[2]}" value="${s[f.id]}">`
          : `<p class="qh">${f.l}</p>${opts('sim_' + f.id, f.o, s[f.id], 'radio')}`).join('');
      };

      const on = e => {
        const t = e.target;
        if (!t.name || t.name.slice(0, 4) != 'sim_') return;
        const id = t.name.slice(4), f = SIMS[cur].f.find(x => x.id == id);
        SS[cur][id] = f.r ? +t.value : t.value;
        if (f.r) $('#v_' + id).textContent = t.value + f.u;
        if (SIMS[cur].change) { SIMS[cur].change(SS[cur], id); if (id == 'style') controls(); }
        view();
      };
      $('#simc').addEventListener('input', on);
      $('#simc').addEventListener('change', on);

      const setTab = k => {
        cur = k;
        $$('#st .chip').forEach(c => c.classList.toggle('on', c.dataset.k == k));
        try { history.replaceState(null, '', '#/simulasi/' + k); } catch (e) {}
        controls();
        view();
      };
      $$('#st .chip').forEach(c => c.onclick = () => setTab(c.dataset.k));
      setTab(cur);
    }

    const Q = {
      jenis:   ['Rumah Tinggal', 'Kos / Kontrakan', 'Ruko', 'Villa', 'Interior Saja', 'Renovasi'],
      tujuan:  ['Dihuni sendiri / keluarga', 'Disewakan (investasi)', 'Usaha / komersial', 'Dijual kembali'],
      lahan:   ['Sudah punya lahan', 'Masih mencari lahan', 'Bangunan sudah ada'],
      lokasi:  ['Bandung', 'Cimahi', 'Lembang', 'Kota lain'],
      luas:    ['< 72 m²', '72 – 120 m²', '120 – 200 m²', '200 – 400 m²', '> 400 m²'],
      lantai:  ['1 Lantai', '2 Lantai', '3 Lantai'],
      kamar:   ['1–2 kamar', '3–4 kamar', '5 kamar atau lebih'],
      fasil:   ['Carport', 'Taman', 'Kolam renang', 'Rooftop', 'Musholla', 'Ruang kerja', 'Kitchen set', 'Ruang usaha'],
      layan:   ['Desain 3D Interior', 'Desain 3D Bangunan', 'Gambar Kerja / DED', 'Analisis Struktur', 'Estimasi RAB', 'Paket All In'],
      gaya:    ['Japandi', 'Tropis Modern', 'Minimalis Modern', 'Industrial', 'Klasik Modern'],
      suasana: ['Hangat & nyaman', 'Terang & lapang', 'Tenang & privat', 'Elegan & mewah', 'Hijau & alami', 'Praktis & efisien'],
      prio:    ['Budget hemat', 'Estetika desain', 'Kecepatan pengerjaan', 'Tahan gempa', 'Hemat energi', 'Privasi'],
      budget:  ['< Rp 250 juta', 'Rp 250 – 500 juta', 'Rp 500 juta – 1 miliar', '> Rp 1 miliar'],
      target:  ['Segera (≤ 1 bulan)', '1 – 3 bulan', '3 – 6 bulan', 'Masih riset'],
      kontak:  ['WhatsApp', 'Telepon', 'Email'],
      waktu:   ['Pagi', 'Siang', 'Sore']
    };
    const LAHAN_M2 = { '< 72 m²': 60, '72 – 120 m²': 96, '120 – 200 m²': 160, '200 – 400 m²': 300, '> 400 m²': 500 };
    const SVMAP = {
      'Desain 3D Interior': 'desain-3d-interior', 'Desain 3D Bangunan': 'desain-3d-bangunan',
      'Gambar Kerja / DED': 'bestek-gambar-kerja', 'Analisis Struktur': 'analisis-struktur',
      'Estimasi RAB': 'estimasi-rab', 'Paket All In': 'paket-all-in'
    };

    const ARCH = {
      japandi: {
        n: 'Zen Craftsman', tag: 'Tenang, hangat, dan jujur pada material.', style: 'Japandi',
        f: { style: 'Minimalis Modern', wall: '#E6D8BC', acc: '#A9754A', accName: 'Kayu', roof: 'Dak Datar' },
        pal: ['#E8DFD0', '#B58B5E', '#6F5B49', '#9C8670', '#2F3A34'],
        mat: ['Kayu oak natural & rotan', 'Dinding krem, tekstur halus', 'Pencahayaan hangat 3000K']
      },
      tropis: {
        n: 'Tropical Haven', tag: 'Teduh, hijau, dan sejuk sepanjang hari.', style: 'Tropis Modern',
        f: { style: 'Tropis', wall: '#F5F5F2', acc: '#A9754A', accName: 'Kayu', roof: 'Pelana' },
        pal: ['#DCE7D6', '#A5763F', '#3F7D4E', '#7A5836', '#F5F5F2'],
        mat: ['Kayu, batu alam & tanaman', 'Overhang lebar, ventilasi silang', 'Taman dalam & bukaan besar']
      },
      minimalis: {
        n: 'Urban Minimalist', tag: 'Rapi, lapang, dan efisien di setiap sudut.', style: 'Minimalis Modern',
        f: { style: 'Minimalis Modern', wall: '#F5F5F2', acc: '#C9CED3', accName: 'Secondary Skin', roof: 'Dak Datar' },
        pal: ['#F0F2F4', '#C9CFD6', '#9AA5B1', '#1F2937', '#3b82f6'],
        mat: ['Putih, abu, aksen kaca', 'Garis bersih, tanpa ornamen', 'Pencahayaan natural 4000K']
      },
      industrial: {
        n: 'Loft Maker', tag: 'Berkarakter, kuat, dan apa adanya.', style: 'Industrial',
        f: { style: 'Industrial', wall: '#A9AEB4', acc: '#9B9C9A', accName: 'Beton Ekspos', roof: 'Dak Datar' },
        pal: ['#8C9096', '#4A4E54', '#2C3036', '#D9822B', '#E8EEF5'],
        mat: ['Beton ekspos & rangka baja', 'Jendela grid hitam', 'Aksen oranye hangat']
      },
      klasik: {
        n: 'Modern Classic', tag: 'Elegan, simetris, dan bernilai jangka panjang.', style: 'Klasik Modern',
        f: { style: 'Klasik Modern', wall: '#F5F5F2', acc: '#7B7F82', accName: 'Batu Alam', roof: 'Perisai' },
        pal: ['#F5F5F2', '#E6D8BC', '#7B7F82', '#7A3B2E', '#5E6B5A'],
        mat: ['Batu alam & molding putih', 'Kolom dan simetri fasad', 'Aksen emas lembut']
      }
    };

    function kCompute(d) {
      const L = a => a || [];
      const sc = { japandi: 0, tropis: 0, minimalis: 0, industrial: 0, klasik: 0 };
      const SM = { 'Japandi': 'japandi', 'Tropis Modern': 'tropis', 'Minimalis Modern': 'minimalis', 'Industrial': 'industrial', 'Klasik Modern': 'klasik' };
      const MD = {
        'Hangat & nyaman': { japandi: 2, tropis: 1 }, 'Terang & lapang': { minimalis: 2, tropis: 1 },
        'Tenang & privat': { japandi: 2, minimalis: 1 }, 'Elegan & mewah': { klasik: 2, minimalis: 1 },
        'Hijau & alami': { tropis: 2, japandi: 1 }, 'Praktis & efisien': { industrial: 2, minimalis: 1 }
      };
      const FC = { 'Taman': { tropis: 1 }, 'Kolam renang': { tropis: 1 }, 'Rooftop': { industrial: 1 }, 'Ruang kerja': { minimalis: 1 }, 'Ruang usaha': { industrial: 1 }, 'Musholla': { japandi: 1 } };
      L(d.gaya).forEach(g => sc[SM[g]] += 3);
      L(d.suasana).forEach(m => Object.entries(MD[m] || {}).forEach(([k, v]) => sc[k] += v));
      L(d.fasil).forEach(m => Object.entries(FC[m] || {}).forEach(([k, v]) => sc[k] += v));
      const key = ['japandi', 'tropis', 'minimalis', 'industrial', 'klasik'].reduce((a, b) => sc[b] > sc[a] ? b : a);

      const has = (arr, v) => L(arr).includes(v);
      const bi = Math.max(0, Q.budget.indexOf(d.budget));
      const fl = parseInt(d.lantai) || 1;
      const clamp = v => Math.max(20, Math.min(100, Math.round(v)));
      const radar = [
        clamp(45 + (has(d.prio, 'Estetika desain') ? 30 : 0) + Math.min(L(d.gaya).length, 3) * 5 + (L(d.suasana).length >= 3 ? 5 : 0)),
        clamp(45 + Math.min(L(d.fasil).length, 5) * 5 + (d.kamar == Q.kamar[2] ? 10 : d.kamar == Q.kamar[1] ? 5 : 0) + (fl >= 2 ? 5 : 0)),
        clamp(48 + (has(d.prio, 'Tahan gempa') ? 28 : 0) + (has(d.layan, 'Analisis Struktur') || has(d.layan, 'Paket All In') ? 14 : 0) + (fl >= 3 ? 8 : 0)),
        clamp(35 + (has(d.prio, 'Budget hemat') ? 35 : 0) + [20, 12, 6, 0][bi] + (has(d.layan, 'Estimasi RAB') ? 8 : 0)),
        clamp(40 + (has(d.prio, 'Hemat energi') ? 30 : 0) + (has(d.suasana, 'Hijau & alami') ? 15 : 0) + (key == 'tropis' ? 10 : 0) + (has(d.fasil, 'Taman') ? 5 : 0)),
        clamp(40 + (has(d.prio, 'Privasi') ? 30 : 0) + (has(d.suasana, 'Tenang & privat') ? 15 : 0) + (has(d.tujuan, 'Dihuni sendiri / keluarga') ? 10 : 0))
      ];

      const kdb = d.jenis == 'Interior Saja' ? .8 : .6;
      const area = Math.round((LAHAN_M2[d.luas] || 100) * kdb * fl);
      const rate = has(d.layan, 'Paket All In') ? svPrice('paket-all-in') : L(d.layan).reduce((t, n) => t + svPrice(SVMAP[n]), 0);
      const fee = area * rate, r5 = v => Math.round(v / 1e5) * 1e5;

      const saran = [];
      if (fl >= 3 && !has(d.layan, 'Analisis Struktur') && !has(d.layan, 'Paket All In')) saran.push('Bangunan 3 lantai: tambahkan Analisis Struktur (SNI 1726).');
      if (bi <= 1 && !has(d.layan, 'Estimasi RAB') && !has(d.layan, 'Paket All In')) saran.push('Budget terbatas: Estimasi RAB membantu menjaga biaya tetap terkendali.');
      if (has(d.fasil, 'Kitchen set')) saran.push('Coba Simulasi Kitchen Set untuk memilih layout & material.');
      if (has(d.tujuan, 'Disewakan (investasi)')) saran.push('Untuk investasi sewa, prioritaskan efisiensi layout & biaya perawatan.');
      if (has(d.prio, 'Kecepatan pengerjaan')) saran.push('Paket All In memberi prioritas jadwal pengerjaan.');
      if (!saran.length) saran.push('Jadwalkan konsultasi untuk memvalidasi hasil ini bersama tim arsitek kami.');

      return { key, sc, arch: ARCH[key], radar, area, fee, lo: r5(fee * .9), hi: r5(fee * 1.1), rate, saran: saran.slice(0, 2), fl };
    }

    const RAXES = ['Estetika', 'Fungsi', 'Ketahanan', 'Hemat Biaya', 'Hemat Energi', 'Privasi'];
    function radarSVG(cx, cy, R, vals) {
      const pt = (i, r) => { const a = -Math.PI / 2 + i * Math.PI / 3; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; };
      const poly = k => vals.map((_, i) => pt(i, R * k).map(n => n.toFixed(1)).join(',')).join(' ');
      let s = '';
      [.25, .5, .75, 1].forEach(k => s += `<polygon points="${poly(k)}" fill="none" stroke="#c9d5e4" stroke-width="1"/>`);
      vals.forEach((_, i) => { const [x, y] = pt(i, R); s += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#d7e0ec"/>`; });
      s += `<polygon points="${vals.map((v, i) => pt(i, R * v / 100).map(n => n.toFixed(1)).join(',')).join(' ')}" fill="#3b82f6" fill-opacity=".28" stroke="#1557A6" stroke-width="3" stroke-linejoin="round"/>`;
      vals.forEach((v, i) => {
        const [x, y] = pt(i, R * v / 100), [lx, ly] = pt(i, R + 20), c = Math.cos(-Math.PI / 2 + i * Math.PI / 3);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="#1557A6"/>`;
        const an = c > .3 ? 'start' : c < -.3 ? 'end' : 'middle';
        s += `<text x="${lx.toFixed(1)}" y="${(ly + 2).toFixed(1)}" font-size="12" font-weight="700" fill="#0B1F3A" text-anchor="${an}">${RAXES[i]}</text>`;
        s += `<text x="${lx.toFixed(1)}" y="${(ly + 16).toFixed(1)}" font-size="11" fill="#1557A6" text-anchor="${an}">${v}/100</text>`;
      });
      return s;
    }

    const cut = (s, n) => { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

    function resultSVG(r, d) {
      const a = r.arch, date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" font-family="Segoe UI, Helvetica, Arial, sans-serif">`;
      s += `<defs><linearGradient id="kh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1F3A"/><stop offset="1" stop-color="#1557A6"/></linearGradient></defs>`;
      s += `<rect width="800" height="1100" fill="#F7F9FC"/><rect width="800" height="180" fill="url(#kh)"/>`;
      s += `<text x="30" y="40" font-size="13" letter-spacing="3" fill="#7db3ff" font-weight="700">FREESPACE BUILDING · HASIL SIMULASI KONSULTASI</text>`;
      s += `<text x="30" y="76" font-size="15" fill="#cfd9e6">TIPE RUANG ANDA</text>`;
      s += `<text x="30" y="126" font-size="46" font-weight="800" fill="#fff">${esc(a.n)}</text>`;
      s += `<text x="30" y="160" font-size="17" fill="#E8EEF5">${esc(a.tag)}</text>`;

      s += `<rect x="28" y="203" width="404" height="264" rx="14" fill="#fff" stroke="#dbe3ee"/>`;
      s += `<svg x="30" y="205" width="400" height="260" viewBox="0 0 400 260">${facadeSVG({ style: a.f.style, floors: Math.min(r.fl, 3), wall: a.f.wall, acc: a.f.acc, accName: a.f.accName, roof: a.f.roof, w: 11 }, 'res')}</svg>`;
      s += `<text x="618" y="218" font-size="13" font-weight="800" letter-spacing="2" fill="#5b6b80" text-anchor="middle">PROFIL PRIORITAS</text>`;
      s += radarSVG(618, 340, 80, r.radar);

      s += `<text x="30" y="505" font-size="13" font-weight="800" letter-spacing="2" fill="#5b6b80">PALET &amp; MATERIAL · GAYA ${esc(a.style.toUpperCase())}</text>`;
      a.pal.forEach((c, i) => {
        s += `<rect x="${30 + i * 72}" y="525" width="62" height="62" rx="12" fill="${c}" stroke="#dbe3ee"/>`;
        s += `<text x="${61 + i * 72}" y="606" font-size="10" fill="#5b6b80" text-anchor="middle">${c.toUpperCase()}</text>`;
      });
      a.mat.forEach((m, i) => s += `<text x="420" y="${545 + i * 30}" font-size="15" fill="#0B1F3A">• ${esc(m)}</text>`);

      s += `<text x="30" y="645" font-size="13" font-weight="800" letter-spacing="2" fill="#5b6b80">DATA PROYEK</text>`;
      const facts = [
        ['Jenis proyek', d.jenis], ['Gaya pilihan', (d.gaya || []).join(', ')],
        ['Luas bangunan (est.)', `±${r.area} m² · ${d.lantai}`], ['Suasana', (d.suasana || []).join(', ') || '—'],
        ['Budget', d.budget], ['Target mulai', d.target]
      ];
      facts.forEach((f, i) => {
        const x = i % 2 ? 420 : 30, y = 672 + Math.floor(i / 2) * 62;
        s += `<text x="${x}" y="${y}" font-size="11" fill="#5b6b80">${f[0]}</text><text x="${x}" y="${y + 22}" font-size="16" font-weight="700" fill="#0B1F3A">${esc(cut(f[1], 38))}</text>`;
      });

      s += `<rect x="30" y="862" width="740" height="104" rx="16" fill="url(#kh)"/>`;
      s += `<text x="52" y="893" font-size="12" letter-spacing="2" fill="#a8c8f5" font-weight="700">ESTIMASI BIAYA DESAIN &amp; PERENCANAAN</text>`;
      s += `<text x="52" y="934" font-size="31" font-weight="800" fill="#fff">${rp(r.lo)} – ${rp(r.hi)}</text>`;
      s += `<text x="52" y="955" font-size="12" fill="#cfd9e6">${esc(cut('Layanan: ' + (d.layan || []).join(', '), 96))}</text>`;

      s += `<text x="30" y="1000" font-size="13" font-weight="800" letter-spacing="2" fill="#5b6b80">SARAN TIM KAMI</text>`;
      r.saran.forEach((t, i) => s += `<text x="30" y="${1026 + i * 24}" font-size="14" fill="#0B1F3A">✓ ${esc(cut(t, 88))}</text>`);

      s += `<rect y="1062" width="800" height="38" fill="#0B1F3A"/>`;
      s += `<text x="30" y="1086" font-size="13" fill="#fff">Hasil konsultasi · ${date}</text>`;
      s += `<text x="770" y="1086" font-size="13" fill="#7db3ff" text-anchor="end" font-weight="700">FREESPACE BUILDING · +62 857-2340-5913</text>`;
      return s + `</svg>`;
    }

    R.konsultasi = () =>
      pageHeader('KONSULTASIKAN KEINGINAN ANDA', 'Centang pilihan Anda — sistem kami menyusun profil gaya, prioritas, dan estimasi biaya dalam bentuk gambar.') + `
      <section><div class="w" style="max-width:780px"><div class="glass" id="kf"></div></div></section>`;

    let KRES = null;

    function initKonsultasi() {
      const q = (title, key, type, hint) => `<p class="qh">${title}${hint ? `<small>${hint}</small>` : ''}</p>${opts(key, Q[key], KRES && KRES.d[key], type)}`;
      const S1 = [['jenis', 'r'], ['tujuan', 'c'], ['lahan', 'r'], ['lokasi', 'r']];
      const S2 = [['luas', 'r'], ['lantai', 'r'], ['kamar', 'r'], ['fasil', 'c'], ['layan', 'c']];
      const S3 = [['gaya', 'c'], ['suasana', 'c'], ['prio', 'c'], ['budget', 'r'], ['target', 'r']];
      const need = (d, list) => { for (const [k, msg] of list) { const v = d[k]; if (!v || !v.length) return msg; } return 0; };

      const steps = [
        {
          t: '1. Data umum',
          h: d => q('Jenis proyek', 'jenis', 'radio') + q('Tujuan bangunan', 'tujuan', 'checkbox', 'boleh lebih dari satu') + q('Status lahan', 'lahan', 'radio') + q('Lokasi proyek', 'lokasi', 'radio'),
          v: (d, e, back) => { grab(e, d, S1); return back ? 0 : need(d, [['jenis', 'Pilih jenis proyek'], ['tujuan', 'Pilih minimal satu tujuan'], ['lahan', 'Pilih status lahan'], ['lokasi', 'Pilih lokasi']]); }
        },
        {
          t: '2. Kebutuhan teknis',
          h: d => q('Luas lahan', 'luas', 'radio') + q('Jumlah lantai', 'lantai', 'radio') + q('Kamar tidur', 'kamar', 'radio') + q('Fasilitas yang diinginkan', 'fasil', 'checkbox', 'opsional') + q('Layanan yang dibutuhkan', 'layan', 'checkbox', 'pilih minimal satu'),
          v: (d, e, back) => { grab(e, d, S2); return back ? 0 : need(d, [['luas', 'Pilih luas lahan'], ['lantai', 'Pilih jumlah lantai'], ['layan', 'Pilih minimal satu layanan']]); }
        },
        {
          t: '3. Gaya & prioritas', last: 1, btn: 'Lihat Hasil Konsultasi',
          h: d => q('Gaya yang Anda sukai', 'gaya', 'checkbox', 'boleh lebih dari satu') + q('Suasana yang diinginkan', 'suasana', 'checkbox', 'opsional') + q('Prioritas utama', 'prio', 'checkbox', 'boleh lebih dari satu') + q('Kisaran budget', 'budget', 'radio') + q('Target mulai', 'target', 'radio'),
          v: (d, e, back) => { grab(e, d, S3); return back ? 0 : need(d, [['gaya', 'Pilih minimal satu gaya'], ['prio', 'Pilih minimal satu prioritas'], ['budget', 'Pilih kisaran budget'], ['target', 'Pilih target mulai']]); }
        },
        {
          t: 'Hasil konsultasi Anda', last: 2, nb: 1,
          m: (d, e, next, go) => { const bk = $('[data-act="back"]', e); if (bk) bk.onclick = () => go(2); },
          h: d => {
            const r = KRES.r;
            const msg = `Halo Freespace Building, saya ingin berkonsultasi.\nHasil simulasi konsultasi saya:\n• Tipe: ${r.arch.n} (${r.arch.style})\n• Proyek: ${d.jenis}, ±${r.area} m², ${d.lantai}\n• Budget: ${d.budget}\n• Estimasi biaya desain: ${rp(r.lo)} – ${rp(r.hi)}\nMohon dijadwalkan konsultasi.`;
            return `
              <div class="rs" id="kres">${resultSVG(r, d)}</div>
              <p class="mu knote">Hasil indikatif berdasarkan jawaban Anda. Luas bangunan = luas lahan × KDB ${d.jenis == 'Interior Saja' ? '80' : '60'}% × jumlah lantai.</p>
              <div class="acts kact">
                <button class="btn" data-act="png">Unduh PNG</button>
                <a class="btn l" href="${WAURL}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Konsultasi WhatsApp</a>
                <button class="btn l kback" data-act="back">Kembali</button>
              </div>`;
          },
          v: () => 0
        }
      ];

      KRES = { d: {}, r: null };
      form($('#kf'), steps.map(st => Object.assign({}, st, { h: d => { KRES.d = d; return st.h(d); } })), d => {
        KRES = { d, r: kCompute(d) };
        ST('fsk', { tipe: KRES.r.arch.n, waktu: Date.now() });
        toast('Analisis selesai');
      });

      $('#kf').onclick = e => {
        const b = e.target.closest('[data-act]');
        if (!b) return;
                if (b.dataset.act == 'png') {
          const svg = $('#kres svg');
          const img = new Image();
          img.onload = () => {
            const c = document.createElement('canvas');
            c.width = 1600; c.height = 2200;
            const x = c.getContext('2d');
            x.drawImage(img, 0, 0, c.width, c.height);
            c.toBlob(bl => {
              const a = document.createElement('a');
              a.href = URL.createObjectURL(bl);
              a.download = 'hasil-konsultasi-freespace.png';
              a.click();
              setTimeout(() => URL.revokeObjectURL(a.href), 2000);
            });
          };
          img.onerror = () => toast('Gagal membuat gambar, coba lagi');
          img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg));
        }
      };
    }
    const HOME_SIM = [
      ['interior', '◧', 'Simulasi Interior', 'Pilih ruang, gaya, dan pencahayaan.'],
      ['kitchen', '▦', 'Simulasi Kitchen Set', 'Atur layout, warna kabinet, dan countertop.'],
      ['facade', '⌂', 'Simulasi Facade', 'Coba gaya, material, dan bentuk atap.']
    ];

    route();

document.addEventListener('pointerdown', e => {
  const btn = e.target.closest && e.target.closest('.acts .btn');
  if (!btn) return;
  const r = btn.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const rip = document.createElement('span');
  rip.className = 'rip';
  rip.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  btn.appendChild(rip);
  setTimeout(() => rip.remove(), 650);
});
