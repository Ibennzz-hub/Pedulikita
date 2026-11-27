'use strict';
(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const btn = (t, cls, fn) => { const b = el('button', cls, t); b.type = 'button'; if (fn) b.onclick = fn; return b; };
  const D = (iso) => { const d = new Date(iso); return isNaN(d) ? '-' : d.toLocaleDateString('id-ID', { dateStyle: 'long' }); };
  const DT = (iso) => { const d = new Date(iso); return isNaN(d) ? '-' : d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }); };
  const today = () => new Date().toISOString().slice(0, 10);
  const uid = (() => { let n = 0; return () => 'f' + (++n); })();
  const kode = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return 'PK-' + a[0].toString(36).toUpperCase().padStart(7, '0').slice(-7); };
  const store = {
    get(k, f) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? f : v; } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  const CATS = { 'Bencana Alam': '🌊', Pendidikan: '📚', Kesehatan: '🩺', Sosial: '🤝', Kemanusiaan: '🕊️' };
  const STATUS = ['Aktif', 'Selesai', 'Ditutup', 'Draf'];
  const AMOUNTS = [10000, 25000, 50000, 100000, 250000];
  const METHODS = ['Transfer Bank (simulasi)', 'E-Wallet (simulasi)', 'QRIS (simulasi)'];

  /* ---------- data awal ---------- */
  const L = (id, tgl, uraian, jumlah) => ({ id, tgl, uraian, jumlah, bukti: null });
  const I = (id, tgl, judul, isi) => ({ id, tgl, judul, isi, foto: null });
  const mk = (id, judul, kategori, ikon, lokasi, target, terkumpul, cerita, penggunaan, laporan, dampak) =>
    ({ id, judul, kategori, ikon, lokasi, target, terkumpul, status: 'Aktif', foto: null, cerita, penggunaan, laporan, dampak });
  const seed = () => [
    mk('k1', 'Bantuan Banjir Bandang Tapanuli', 'Bencana', '🌊', 'Tapanuli, Sumatera Utara', 150000000, 98500000,
      ['Banjir bandang menerjang beberapa desa dalam semalam. Ratusan keluarga kehilangan rumah, pakaian, dan persediaan makanan.', 'Donasi Anda dipakai untuk paket pangan, air bersih, selimut, dan obat-obatan bagi warga di posko pengungsian.'],
      [{ l: 'Logistik pangan', p: 45 }, { l: 'Obat dan kesehatan', p: 25 }, { l: 'Hunian sementara', p: 20 }, { l: 'Operasional', p: 10 }],
      [L('l1', '2026-10-02', 'Paket pangan untuk 1.200 keluarga di posko pengungsian', 35000000), L('l2', '2026-10-09', 'Obat-obatan, air bersih, dan selimut', 25000000)],
      [I('i1', '2026-10-03', 'Paket pangan tiba di posko', 'Relawan membagikan paket pangan kepada 1.200 keluarga. Antrean tertib dan semua paket habis dalam dua hari.'), I('i2', '2026-10-10', 'Air bersih kembali mengalir', 'Tiga titik air bersih darurat berfungsi. Warga tidak perlu lagi berjalan jauh untuk mengambil air.')]),
    mk('k2', 'Pemulihan Pascagempa Cianjur', 'Bencana', '🏚️', 'Cianjur, Jawa Barat', 200000000, 120000000,
      ['Gempa merusak ribuan rumah dan fasilitas umum. Banyak keluarga masih tinggal di tenda terpal.', 'Dana dipakai membangun hunian sementara yang layak, sanitasi, dan layanan pemulihan trauma bagi anak-anak.'],
      [{ l: 'Hunian sementara', p: 50 }, { l: 'Sanitasi dan air', p: 25 }, { l: 'Layanan trauma', p: 15 }, { l: 'Operasional', p: 10 }],
      [L('l3', '2026-10-05', 'Pembangunan 40 unit hunian sementara', 50000000), L('l4', '2026-10-16', 'Sanitasi dan tandon air di tiga dusun', 35000000)],
      [I('i3', '2026-10-17', '40 keluarga pindah ke hunian sementara', 'Keluarga-keluarga yang tadinya di tenda terpal kini menempati hunian berlantai dan beratap kokoh.')]),
    mk('k3', 'Beasiswa Anak Pesisir', 'Pendidikan', '📚', 'Sibolga, Sumatera Utara', 80000000, 32000000,
      ['Banyak anak nelayan terancam putus sekolah karena biaya. Program ini menanggung biaya sekolah, seragam, dan buku.', 'Target kami 40 anak penerima manfaat selama satu tahun ajaran.'],
      [{ l: 'Biaya sekolah', p: 60 }, { l: 'Perlengkapan belajar', p: 30 }, { l: 'Operasional', p: 10 }],
      [L('l5', '2026-10-12', 'Biaya sekolah semester ganjil untuk 40 anak', 20000000)],
      [I('i4', '2026-10-13', 'Semua penerima kembali bersekolah', 'Seluruh 40 anak sudah terdaftar dan menerima seragam serta buku pelajaran.')]),
    mk('k4', 'Operasi Jantung untuk Alya', 'Kesehatan', '🩺', 'Medan, Sumatera Utara', 120000000, 87000000,
      ['Alya (6 tahun) lahir dengan kelainan jantung bawaan dan membutuhkan operasi segera.', 'Dana dibayarkan langsung ke rumah sakit rujukan, bukan ke rekening keluarga.'],
      [{ l: 'Biaya operasi', p: 70 }, { l: 'Rawat inap', p: 20 }, { l: 'Transportasi keluarga', p: 10 }],
      [L('l6', '2026-10-20', 'Uang muka operasi ke rumah sakit rujukan', 45000000)],
      [I('i5', '2026-10-21', 'Jadwal operasi sudah ditetapkan', 'Dokter menjadwalkan operasi Alya. Keluarga mengucapkan terima kasih atas semua doa dan dukungan.')]),
    mk('k5', 'Dapur Umum untuk Lansia', 'Sosial', '🍲', 'Binjai, Sumatera Utara', 40000000, 18500000,
      ['Banyak lansia hidup sendiri dan kesulitan memasak. Dapur umum menyiapkan makan siang bergizi setiap hari.', 'Relawan warga membantu memasak dan mengantar makanan ke rumah lansia yang sulit berjalan.'],
      [{ l: 'Bahan pangan', p: 65 }, { l: 'Relawan dan dapur', p: 25 }, { l: 'Operasional', p: 10 }],
      [L('l7', '2026-10-25', 'Bahan pangan untuk dua bulan', 7000000), L('l8', '2026-11-10', 'Peralatan dapur dan uang transport relawan', 5000000)],
      [I('i6', '2026-11-11', 'Sudah 60 porsi per hari', 'Dapur kini melayani 60 lansia setiap hari, termasuk pengantaran ke rumah.')]),
    mk('k6', 'Sekolah Darurat Pascabanjir', 'Pendidikan', '🏫', 'Langkat, Sumatera Utara', 60000000, 41000000,
      ['Tiga sekolah dasar rusak terendam banjir. Anak-anak sudah dua bulan tidak belajar.', 'Donasi dipakai untuk tenda kelas, papan tulis, meja, dan buku agar belajar bisa berlanjut.'],
      [{ l: 'Tenda dan perabot', p: 40 }, { l: 'Buku dan alat tulis', p: 40 }, { l: 'Operasional', p: 20 }],
      [L('l9', '2026-11-05', 'Tenda kelas dan perabot untuk tiga sekolah darurat', 30000000)],
      [I('i7', '2026-11-06', 'Kelas dibuka kembali', 'Sekitar 180 siswa kembali belajar di tenda kelas pada hari Senin.')])
  ];

  const okCamp = (c) => c && typeof c.id === 'string' && Array.isArray(c.laporan) && Array.isArray(c.dampak) && Array.isArray(c.cerita) && Array.isArray(c.penggunaan);
  let camps = store.get('pk_c2', null);
  if (!Array.isArray(camps) || !camps.every(okCamp)) camps = seed();
  let dons = store.get('pk_d2', []);
  if (!Array.isArray(dons)) dons = [];
  const save = () => {
    const a = store.set('pk_c2', camps);
    const b = store.set('pk_d2', dons);
    if (!(a && b)) toast('Penyimpanan peramban penuh. Gambar atau data terbaru mungkin tidak tersimpan.', true);
  };

  const EXTRA = [mk('k7', 'Air Bersih untuk Dusun Terpencil', 'Kemanusiaan', '💧', 'Deli Serdang, Sumatera Utara', 50000000, 22000000,
    ['Warga satu dusun harus berjalan dua kilometer setiap hari untuk mendapatkan air bersih, terutama saat kemarau.', 'Dana dipakai membangun sumur bor, tandon, dan jaringan pipa sederhana yang dikelola warga.'],
    [{ l: 'Sumur dan pompa', p: 55 }, { l: 'Tandon dan pipa', p: 35 }, { l: 'Operasional', p: 10 }], [], [])];
  const META = {
    k1: { dibuat: '2026-09-20', batas: 14, urgent: true, verified: true, d0: 412, penerima: 1200 },
    k2: { dibuat: '2026-09-25', batas: 35, verified: true, d0: 530, penerima: 160 },
    k3: { dibuat: '2026-10-01', batas: 60, verified: true, d0: 97, penerima: 40 },
    k4: { dibuat: '2026-10-08', batas: 21, urgent: true, verified: true, d0: 268, penerima: 1 },
    k5: { dibuat: '2026-10-15', batas: 45, verified: true, d0: 74, penerima: 60 },
    k6: { dibuat: '2026-10-22', batas: 30, verified: true, d0: 131, penerima: 180 },
    k7: { dibuat: '2026-11-12', batas: 50, d0: 12, penerima: 90 }
  };
  const addDays = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  const norm = (c) => {
    const m = META[c.id] || {};
    if (c.kategori === 'Bencana') c.kategori = 'Bencana Alam';
    if (!c.dibuat) c.dibuat = m.dibuat || today();
    if (!c.batas) c.batas = addDays(m.batas || 30);
    ['urgent', 'verified'].forEach((k) => { if (c[k] === undefined) c[k] = !!m[k]; });
    ['d0', 'penerima'].forEach((k) => { if (typeof c[k] !== 'number') c[k] = m[k] || 0; });
    return c;
  };
  EXTRA.forEach((x) => { if (!camps.some((c) => c.id === x.id)) camps.push(x); });
  camps.forEach(norm);
  let favs = store.get('pk_f', []);
  if (!Array.isArray(favs)) favs = [];
  save();

  /* ---------- helper data ---------- */
  const sal = (c) => c.laporan.reduce((a, x) => a + x.jumlah, 0);
  const sisa = (c) => Math.max(0, c.terkumpul - sal(c));
  const pct = (c) => (c.target ? (c.terkumpul / c.target) * 100 : 0);
  const pubCamps = () => camps.filter((c) => c.status !== 'Draf');
  const pubName = (d) => (d.anon ? 'Anonim' : d.nama);
  const stName = (c) => (STATUS.includes(c.status) ? c.status : 'Draf');
  const byDate = (a, b) => b.tgl.localeCompare(a.tgl);

  /* ---------- komponen UI ---------- */
  const okImg = (s) => typeof s === 'string' && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);
  const media = (foto, ikon, cls, alt) => {
    if (okImg(foto)) { const i = el('img', cls); i.src = foto; i.alt = alt || ''; i.loading = 'lazy'; return i; }
    const p = el('div', cls + ' ph', ikon || '🧾');
    p.setAttribute('aria-hidden', 'true');
    return p;
  };
  const bar = (p) => {
    const w = el('div', 'bar');
    w.setAttribute('role', 'progressbar');
    w.setAttribute('aria-valuenow', String(Math.min(100, Math.round(p))));
    w.setAttribute('aria-valuemin', '0');
    w.setAttribute('aria-valuemax', '100');
    const f = el('div', 'bar-fill');
    f.style.width = Math.min(100, Math.max(0, p)) + '%';
    w.append(f);
    return w;
  };
  const stat = (v, l) => { const s = el('div', 'stat'); s.append(el('b', '', v), el('span', '', l)); return s; };
  const statusBadge = (c) => el('span', 'badge st-' + stName(c), stName(c));
  const panel = (title, ...kids) => { const p = el('div', 'panel'); if (title) p.append(el('h3', '', title)); p.append(...kids); return p; };
  const rowOf = (a, b) => { const r = el('div', 'row'); r.append(a, b); return r; };

  function toast(msg, bad) {
    const t = el('div', 'toast' + (bad ? ' bad' : ''), msg);
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 3800);
  }
  let lastFocus = null;
  function openModal(nodes) {
    lastFocus = document.activeElement;
    $('#modal-body').replaceChildren(...nodes);
    $('#modal').hidden = false;
    $('#modal-x').focus();
  }
  function closeModal() {
    $('#modal').hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function arm(b, label, armed, fn) {
    let on = false, t = 0;
    b.textContent = label;
    b.onclick = () => {
      if (!on) { on = true; b.textContent = armed; t = setTimeout(() => { on = false; b.textContent = label; }, 4000); return; }
      clearTimeout(t); on = false; b.textContent = label; fn();
    };
    return b;
  }

  function field(label, id, kind, max, opts) {
    const wrap = el('div', 'field');
    const lb = el('label', '', label);
    lb.htmlFor = id;
    let input;
    if (kind === 'textarea') { input = el('textarea'); input.rows = 4; }
    else if (kind === 'select') {
      input = el('select');
      (opts || []).forEach(([v, t]) => { const o = el('option', '', t); o.value = v; input.append(o); });
    } else {
      input = el('input');
      input.type = kind;
      if (kind === 'file') input.accept = 'image/jpeg,image/png,image/webp';
    }
    input.id = id;
    if (kind !== 'select' && kind !== 'file') { input.maxLength = max; input.autocomplete = 'off'; }
    const err = el('p', 'err');
    wrap.append(lb, input, err);
    return { wrap, input, err };
  }

  function readImage(file) {
    return new Promise((res, rej) => {
      if (!file) return res(null);
      if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 8e6) return rej(new Error('Gunakan gambar JPG, PNG, atau WebP maksimal 8 MB.'));
      const fr = new FileReader();
      fr.onerror = () => rej(new Error('Gagal membaca file gambar.'));
      fr.onload = () => {
        const im = new Image();
        im.onerror = () => rej(new Error('Gambar tidak dapat dibuka.'));
        im.onload = () => {
          const k = Math.min(1, 800 / Math.max(im.width, im.height));
          const cv = document.createElement('canvas');
          cv.width = Math.max(1, Math.round(im.width * k));
          cv.height = Math.max(1, Math.round(im.height * k));
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          res(cv.toDataURL('image/jpeg', 0.7));
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  function mkForm(defs, label, handler) {
    const f = el('form', 'panel form-grid');
    f.noValidate = true;
    const F = {};
    defs.forEach((d) => {
      const x = field(d.label, uid(), d.kind, d.max || 200, d.opts);
      if (d.min !== undefined) x.input.min = String(d.min);
      if (d.kind === 'textarea' || d.kind === 'file') x.wrap.classList.add('span');
      F[d.key] = x;
      f.append(x.wrap);
    });
    const sb = el('button', 'btn navy', label);
    sb.type = 'submit';
    f.append(sb);
    f.onsubmit = async (e) => {
      e.preventDefault();
      Object.values(F).forEach((x) => { x.err.textContent = ''; });
      let bad = false, thrown = false;
      const bag = {
        err: (k, m) => { F[k].err.textContent = m; bad = true; },
        bad: () => bad,
        v: (k) => F[k].input.value.trim(),
        file: (k) => (F[k].input.files && F[k].input.files[0]) || null
      };
      sb.disabled = true;
      try { await handler(bag); } catch (er) { thrown = true; toast(er.message || 'Terjadi kesalahan.', true); }
      sb.disabled = false;
      if (bad && !thrown) toast('Periksa kembali isian formulir.', true);
    };
    return f;
  }

  /* ---------- navigasi ---------- */
  function show(view, id) {
    if (view !== 'detail') { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* abaikan */ } }
    $$('.view').forEach((s) => { s.hidden = s.id !== 'v-' + view; });
    $$('#nav [data-go]').forEach((b) => b.classList.toggle('on', b.dataset.go === view));
    if (view === 'home') renderHome();
    if (view === 'detail') renderDetail(id);
    if (view === 'confirm') renderConfirm(id);
    if (view === 'history') renderHist();
    if (view === 'admin') renderAdmin();
    $('#nav').classList.remove('open');
    $('#menu-btn').setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
  }
  function goSection(sec) {
    show('home');
    setTimeout(() => { const t = document.getElementById(sec); if (t) t.scrollIntoView({ behavior: 'smooth' }); }, 30);
  }
  const go = (t) => (['kampanye', 'transparansi', 'dampak'].includes(t) ? goSection(t) : show(t));

  /* ---------- beranda ---------- */
  let cat = 'Semua';
  let query = '';
  let sort = 'terbaru';
  const num = (n) => Math.round(n).toLocaleString('id-ID');
  const nDon = (c) => (c.d0 || 0) + dons.filter((d) => d.cid === c.id).length;
  const daysLeft = (c) => Math.ceil((new Date(c.batas) - Date.now()) / 864e5);
  const timeLeft = (c) => { if (c.status !== 'Aktif') return c.status; const n = daysLeft(c); return n > 0 ? n + ' hari lagi' : 'Waktu berakhir'; };
  const labels = (c) => {
    const a = [];
    if (c.urgent && c.status === 'Aktif') a.push(el('span', 'badge urgent', 'Urgent'));
    if (c.verified) a.push(el('span', 'badge verified', '✔ Verified (demo)'));
    return a;
  };
  const isFav = (id) => favs.includes(id);
  const toggleFav = (id) => { favs = isFav(id) ? favs.filter((x) => x !== id) : favs.concat(id); store.set('pk_f', favs); toast(isFav(id) ? 'Ditambahkan ke favorit.' : 'Dihapus dari favorit.'); };
  const pickFeatured = () => { const p = pubCamps().filter((c) => c.status === 'Aktif'); return p.find((c) => c.urgent) || p[0] || null; };
  const SORTS = {
    terbaru: (a, b) => (b.dibuat || '').localeCompare(a.dibuat || ''),
    didukung: (a, b) => nDon(b) - nDon(a),
    hampir: (a, b) => { const f = (c) => (pct(c) >= 100 ? -1 : pct(c)); return f(b) - f(a); }
  };
  const isDemo = (id) => /^[ikl]\d{1,2}$/.test(String(id));

  let io = null;
  function reveal() {
    const items = $$('.reveal:not(.in)');
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { items.forEach((n) => n.classList.add('in')); return; }
    if (!io) io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.1 });
    items.forEach((n) => io.observe(n));
  }
  function countUp(node, to, fmt) {
    if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) { node.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / 1200); node.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  const counter = (v, label, fmt) => { const s = el('div', 'stat'); const b = el('b', '', fmt(0)); s.append(b, el('span', '', label)); countUp(b, v, fmt); return s; };
  const skel = (n) => Array.from({ length: n }, () => el('div', 'skel'));

  function shareBar(c) {
    const url = location.origin + location.pathname + '#c-' + c.id;
    const text = 'Yuk dukung "' + c.judul + '" di PeduliKita: ' + url;
    const copy = (msg) => {
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast(msg), () => toast('Tidak dapat menyalin tautan.', true));
      else toast('Tidak dapat menyalin tautan.', true);
    };
    const fav = btn(isFav(c.id) ? '♥ Favorit' : '♡ Simpan favorit', 'btn ghost', () => { toggleFav(c.id); fav.textContent = isFav(c.id) ? '♥ Favorit' : '♡ Simpan favorit'; });
    const wa = el('a', 'btn ghost', 'WhatsApp');
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(text);
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    const box = el('div', 'share');
    box.append(fav, wa, btn('Instagram', 'btn ghost', () => copy('Tautan disalin. Tempel di story atau bio Instagram Anda.')), btn('Salin tautan', 'btn ghost', () => copy('Tautan disalin.')));
    return box;
  }

  function renderHeroCard() {
    const c = pickFeatured(), box = $('#hero-card');
    box.replaceChildren();
    if (!c) return;
    box.append(el('span', 'badge gold', 'Kampanye pilihan'), el('b', '', c.judul), bar(pct(c)), rowOf(el('b', '', rp(c.terkumpul)), el('span', 'muted', Math.floor(pct(c)) + '%')), el('span', 'muted', timeLeft(c)));
  }
  function renderFeatured() {
    const c = pickFeatured(), box = $('#featured');
    box.replaceChildren();
    if (!c) return;
    const tags = el('div', 'tags');
    tags.append(el('span', 'badge gold', 'Kampanye pilihan'), ...labels(c));
    const body = el('div', 'feat-body');
    body.append(tags, el('h2', '', c.judul), el('p', 'muted', '📍 ' + c.lokasi), el('p', '', c.cerita[0] || ''), bar(pct(c)),
      rowOf(el('b', '', rp(c.terkumpul)), el('span', 'muted', 'target ' + rp(c.target))),
      el('p', 'muted', Math.floor(pct(c)) + '% tercapai · ' + nDon(c) + ' donatur · ' + timeLeft(c)),
      btn('Donasi sekarang', 'btn', () => show('detail', c.id)));
    const f = el('article', 'feat reveal');
    f.append(media(c.foto, c.ikon, 'cover', 'Foto ' + c.judul), body);
    box.append(f);
  }
  function renderCats() {
    const box = $('#cats');
    box.replaceChildren();
    ['Semua', 'Favorit'].concat(Object.keys(CATS)).forEach((k) => {
      const b = btn(k === 'Favorit' ? '♥ Favorit' : k, 'chip', () => { cat = k; renderCats(); renderGrid(); });
      b.setAttribute('aria-pressed', String(k === cat));
      box.append(b);
    });
  }
  function renderGrid() {
    const q = query.toLowerCase();
    const list = pubCamps()
      .filter((c) => (cat === 'Semua' || (cat === 'Favorit' ? isFav(c.id) : c.kategori === cat)) && (c.judul + ' ' + c.lokasi).toLowerCase().includes(q))
      .sort(SORTS[sort] || SORTS.terbaru);
    const grid = $('#grid');
    grid.replaceChildren();
    if (!list.length) {
      const e = el('div', 'empty');
      e.append(el('p', '', cat === 'Favorit' ? 'Belum ada kampanye favorit. Tekan ikon hati pada kampanye yang ingin Anda simpan.' : 'Tidak ada kampanye yang cocok. Coba kata kunci atau kategori lain.'));
      grid.append(e);
      return;
    }
    list.forEach((c) => {
      const card = el('article', 'card reveal');
      const fb = btn(isFav(c.id) ? '♥' : '♡', 'fav', () => { toggleFav(c.id); if (cat === 'Favorit') renderGrid(); else fb.textContent = isFav(c.id) ? '♥' : '♡'; });
      fb.setAttribute('aria-label', 'Simpan favorit: ' + c.judul);
      const mw = el('div', 'mw');
      mw.append(media(c.foto, c.ikon, 'thumb', 'Foto ' + c.judul), fb);
      const tags = el('div', 'tags');
      tags.append(el('span', 'badge', c.kategori), statusBadge(c), ...labels(c));
      const cb = el('div', 'cb');
      cb.append(tags, el('h3', '', c.judul), el('p', 'muted', '📍 ' + c.lokasi), bar(pct(c)),
        rowOf(el('b', '', rp(c.terkumpul)), el('span', 'muted', Math.floor(pct(c)) + '% dari ' + rp(c.target))),
        el('span', 'muted', nDon(c) + ' donatur · ' + timeLeft(c)),
        btn('Lihat detail', 'btn navy', () => show('detail', c.id)));
      card.append(mw, cb);
      grid.append(card);
    });
    reveal();
  }
  function renderImpact() {
    const p = pubCamps();
    $('#impact').replaceChildren(
      counter(p.reduce((a, c) => a + c.terkumpul, 0), 'Total donasi terkumpul (demo)', rp),
      counter(p.reduce((a, c) => a + nDon(c), 0), 'Total donatur', num),
      counter(p.filter((c) => c.status === 'Selesai' || pct(c) >= 100).length, 'Kampanye berhasil', num),
      counter(p.reduce((a, c) => a + (c.penerima || 0), 0), 'Penerima manfaat', num));
  }
  function renderStories() {
    const box = $('#stories');
    box.replaceChildren();
    const all = [];
    pubCamps().forEach((c) => c.dampak.forEach((x) => all.push({ x, c })));
    all.sort((a, b) => byDate(a.x, b.x));
    if (!all.length) { const e = el('div', 'empty'); e.append(el('p', '', 'Belum ada cerita dampak.')); box.append(e); return; }
    all.slice(0, 3).forEach(({ x, c }) => {
      const n = el('article', 'note reveal');
      if (okImg(x.foto)) n.append(media(x.foto, '', 'thumb', 'Dokumentasi: ' + x.judul));
      n.append(el('span', 'muted', c.judul + ' · ' + D(x.tgl)), el('h3', '', x.judul), el('p', '', x.isi));
      if (isDemo(x.id)) n.append(el('span', 'badge', 'Cerita contoh (simulasi)'));
      box.append(n);
    });
  }
  function stackBar(parts) {
    const tot = parts.reduce((a, p) => a + p[1], 0) || 1;
    const w = el('div', 'stack'), lg = el('div', 'legend');
    parts.forEach(([l, v, cl]) => {
      const sp = el('span', cl);
      sp.style.width = (v / tot) * 100 + '%';
      w.append(sp);
      const li = el('span', 'muted');
      li.append(el('i', cl), l + ': ' + rp(v) + ' (' + Math.round((v / tot) * 100) + '%)');
      lg.append(li);
    });
    return [w, lg];
  }
  function renderTransp() {
    const box = $('#transp');
    box.replaceChildren();
    pubCamps().forEach((c) => {
      const it = el('div', 'item');
      const last = c.laporan.slice().sort(byDate)[0];
      it.append(el('b', '', c.judul),
        el('p', 'muted', 'Terkumpul ' + rp(c.terkumpul) + ' · Disalurkan ' + rp(sal(c)) + ' · Sisa ' + rp(sisa(c))),
        bar(c.terkumpul ? (sal(c) / c.terkumpul) * 100 : 0),
        el('p', 'muted', last ? 'Penyaluran terakhir: ' + D(last.tgl) : 'Belum ada penyaluran.'),
        btn('Lihat laporan lengkap', 'btn ghost', () => show('detail', c.id)));
      box.append(it);
    });
  }
  function renderUsage() {
    const box = $('#usage'), p = pubCamps();
    const t = p.reduce((a, c) => a + c.terkumpul, 0), s = p.reduce((a, c) => a + sal(c), 0);
    let ops = 0;
    p.forEach((c) => c.penggunaan.forEach((u) => { if (/operasional/i.test(u.l)) ops += (c.terkumpul * u.p) / 100; }));
    box.replaceChildren(el('h3', '', 'Dana tersalurkan dan tersisa'), ...stackBar([['Disalurkan', s, 'c1'], ['Sisa dana', Math.max(0, t - s), 'c2']]),
      el('h3', 'mt', 'Alokasi program dan operasional'), ...stackBar([['Program dan penyaluran', Math.max(0, t - ops), 'c1'], ['Operasional', ops, 'c3']]));
  }
  const DEMO_WALL = [['Rina', 'Semoga cepat pulih dan kembali ceria, Alya.'], ['Anonim', 'Sedikit dari kami, semoga bermanfaat.'], ['Budi', 'Tetap kuat, saudaraku di Tapanuli.'], ['Sinta', 'Semoga anak-anak bisa terus sekolah.'], ['Anonim', 'Doa terbaik untuk semuanya.'], ['Dimas', 'Kebaikan kecil, semoga berarti besar.']];
  function renderWall() {
    const box = $('#wall');
    box.replaceChildren();
    const real = dons.filter((d) => d.pesan).slice(0, 6).map((d) => ({ n: pubName(d), m: d.pesan, demo: false }));
    real.concat(DEMO_WALL.map(([n, m]) => ({ n, m, demo: true }))).slice(0, 6).forEach((w) => {
      const n = el('div', 'note reveal');
      n.append(el('p', '', w.m), el('span', 'who', w.n));
      if (w.demo) n.append(el('span', 'badge', 'Contoh (simulasi)'));
      box.append(n);
    });
  }
  function renderBoard() {
    const box = $('#board');
    box.replaceChildren();
    const m = new Map();
    dons.forEach((d) => { const k = pubName(d); m.set(k, (m.get(k) || 0) + d.nominal); });
    Array.from(m, ([n, v]) => ({ n, v, demo: false }))
      .concat([{ n: 'Donatur contoh A', v: 2500000, demo: true }, { n: 'Donatur contoh B', v: 1750000, demo: true }, { n: 'Anonim (contoh)', v: 1200000, demo: true }])
      .sort((a, b) => b.v - a.v).slice(0, 5).forEach((r, i) => {
        const it = el('div', 'item rank');
        it.append(el('i', '', String(i + 1)), el('b', '', r.n), el('span', 'muted', r.demo ? 'simulasi' : 'donasi Anda'), el('b', '', rp(r.v)));
        box.append(it);
      });
  }
  function renderHome() {
    const p = pubCamps();
    $('#hero-stats').replaceChildren(
      counter(p.reduce((a, c) => a + c.terkumpul, 0), 'Total donasi (demo)', rp),
      counter(p.reduce((a, c) => a + nDon(c), 0), 'Donatur', num),
      counter(p.reduce((a, c) => a + (c.penerima || 0), 0), 'Penerima manfaat', num));
    renderHeroCard();
    renderFeatured();
    renderCats();
    renderGrid();
    renderImpact();
    renderStories();
    renderTransp();
    renderUsage();
    renderWall();
    renderBoard();
    reveal();
  }

  /* ---------- detail kampanye ---------- */
  function renderDetail(id) {
    const box = $('#detail');
    box.replaceChildren();
    const c = camps.find((x) => x.id === id);
    const back = btn('Kembali ke kampanye', 'btn ghost', () => goSection('kampanye'));
    if (!c || c.status === 'Draf') { box.append(back, el('p', 'muted', 'Kampanye tidak ditemukan.')); return; }

    let focusForm = () => {};
    const aktif = c.status === 'Aktif';
    const badges = el('div', 'row');
    badges.append(el('span', 'badge', c.ikon + ' ' + c.kategori), statusBadge(c), ...labels(c));
    badges.className = 'tags';
    const cta = btn(aktif ? 'Donasi sekarang' : 'Donasi ditutup', 'btn', () => focusForm());
    cta.disabled = !aktif;
    const left = el('div');
    left.append(media(c.foto, c.ikon, 'cover', 'Foto kampanye ' + c.judul), badges, el('h2', '', c.judul), el('p', 'muted', '📍 ' + c.lokasi), bar(pct(c)),
      rowOf(el('b', '', rp(c.terkumpul) + ' terkumpul'), el('span', 'muted', 'target ' + rp(c.target))),
      el('p', 'muted', Math.floor(pct(c)) + '% tercapai · ' + nDon(c) + ' donatur · ' + timeLeft(c)), cta, shareBar(c));
    try { history.replaceState(null, '', '#c-' + c.id); } catch (e) { /* abaikan */ }

    left.append(panel('Cerita kampanye', ...c.cerita.map((t) => el('p', '', t))));

    const use = panel('Rencana penggunaan dana');
    c.penggunaan.forEach((u) => { const it = el('div', 'item'); it.append(rowOf(el('span', '', u.l), el('b', '', u.p + '%')), bar(u.p)); use.append(it); });
    left.append(use);

    const lap = panel('Laporan transparansi dana');
    const st = el('div', 'stats dark');
    st.append(stat(rp(c.terkumpul), 'Dana terkumpul'), stat(rp(sal(c)), 'Dana disalurkan'), stat(rp(sisa(c)), 'Sisa dana'));
    lap.append(st);
    if (!c.laporan.length) lap.append(el('p', 'muted', 'Belum ada penyaluran dana yang dilaporkan.'));
    c.laporan.slice().sort(byDate).forEach((x) => {
      const it = el('div', 'item');
      it.append(rowOf(el('b', '', D(x.tgl)), el('b', '', rp(x.jumlah))), el('p', '', x.uraian));
      it.append(okImg(x.bukti) ? media(x.bukti, '🧾', 'proof', 'Bukti penggunaan dana ' + D(x.tgl)) : el('span', 'badge', 'Bukti belum diunggah'));
      lap.append(it);
    });
    left.append(lap);

    const dam = panel('Update kampanye');
    if (!c.dampak.length) dam.append(el('p', 'muted', 'Belum ada kabar terbaru dari lokasi.'));
    c.dampak.slice().sort(byDate).forEach((x) => {
      const it = el('div', 'item');
      it.append(el('span', 'muted', D(x.tgl)), el('h3', '', x.judul), el('p', '', x.isi));
      if (okImg(x.foto)) it.append(media(x.foto, '', 'cover', 'Dokumentasi: ' + x.judul));
      dam.append(it);
    });
    left.append(dam);

    const doa = panel('Doa dan dukungan');
    const mine = dons.filter((d) => d.cid === c.id).slice(0, 5);
    if (!mine.length) doa.append(el('p', 'muted', 'Belum ada donasi dari peramban ini. Jadilah yang pertama.'));
    mine.forEach((d) => {
      const it = el('div', 'item');
      it.append(rowOf(el('b', '', pubName(d)), el('span', '', rp(d.nominal))));
      if (d.pesan) it.append(el('p', 'muted', d.pesan));
      doa.append(it);
    });
    left.append(doa);

    let right;
    if (!aktif) {
      right = panel('Donasi ditutup', el('p', 'muted', 'Kampanye ini berstatus ' + c.status + ' dan tidak menerima donasi baru. Lihat kampanye aktif lainnya.'), btn('Lihat kampanye lain', 'btn', () => goSection('kampanye')));
    } else {
      let nominal = 0;
      right = el('form', 'panel');
      right.noValidate = true;
      right.append(el('h3', '', 'Berikan donasi'));
      const amts = el('div', 'amounts');
      amts.setAttribute('role', 'group');
      amts.setAttribute('aria-label', 'Pilihan nominal');
      const custom = field('Nominal lain (Rp)', uid(), 'number', 12);
      custom.input.min = '10000';
      custom.input.inputMode = 'numeric';
      const chips = AMOUNTS.map((a) => {
        const b = btn(rp(a), 'chip', () => { nominal = a; custom.input.value = ''; chips.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
        b.setAttribute('aria-pressed', 'false');
        amts.append(b);
        return b;
      });
      custom.input.oninput = () => { nominal = Number(custom.input.value) || 0; chips.forEach((x) => x.setAttribute('aria-pressed', 'false')); };
      const fn = field('Nama donatur', uid(), 'text', 60);
      const fe = field('Email', uid(), 'email', 80);
      const fm = field('Pesan doa (opsional)', uid(), 'textarea', 200);
      const ck = el('label', 'check');
      const cb = el('input');
      cb.type = 'checkbox';
      ck.append(cb, el('span', '', 'Sembunyikan nama saya (donasi anonim)'));
      const ck2 = el('label', 'check');
      const cb2 = el('input');
      cb2.type = 'checkbox';
      ck2.append(cb2, el('span', '', 'Jadikan donasi rutin bulanan (simulasi, tanpa penagihan otomatis)'));
      const sb = el('button', 'btn full', 'Lanjut ke pembayaran');
      sb.type = 'submit';
      right.append(amts, custom.wrap, fn.wrap, fe.wrap, fm.wrap, ck, ck2, sb);
      focusForm = () => { right.scrollIntoView({ behavior: 'smooth' }); fn.input.focus({ preventScroll: true }); };
      right.onsubmit = (e) => {
        e.preventDefault();
        const nama = fn.input.value.trim(), email = fe.input.value.trim(), pesan = fm.input.value.trim();
        let ok = true;
        const setErr = (f, m) => { f.err.textContent = m; if (m) ok = false; };
        setErr(fn, nama.length < 2 || nama.length > 60 ? 'Nama harus 2 sampai 60 karakter.' : '');
        setErr(fe, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Masukkan alamat email yang valid.');
        setErr(fm, pesan.length > 200 ? 'Pesan maksimal 200 karakter.' : '');
        setErr(custom, nominal >= 10000 && nominal <= 100000000 ? '' : 'Pilih nominal antara Rp10.000 dan Rp100.000.000.');
        if (ok) checkout(c, { nama, email, pesan, anon: cb.checked, rutin: cb2.checked, nominal });
        else toast('Periksa kembali isian formulir.', true);
      };
    }
    const layout = el('div', 'detail-grid');
    layout.append(left, right);
    box.append(back, layout);
  }

  /* ---------- checkout & konfirmasi ---------- */
  function checkout(c, d) {
    let method = METHODS[0];
    const title = el('h3', '', 'Simulasi checkout');
    title.id = 'modal-title';
    const sum = el('div', 'panel');
    [['Kampanye', c.judul], ['Donatur', d.anon ? 'Anonim' : d.nama], ['Nominal', rp(d.nominal)]].forEach(([k, v]) => sum.append(rowOf(el('span', 'muted', k), el('b', '', v))));
    const pay = el('div', 'pay');
    pay.setAttribute('role', 'group');
    pay.setAttribute('aria-label', 'Metode pembayaran');
    const bs = METHODS.map((m) => {
      const b = btn(m, '', () => { method = m; bs.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
      b.setAttribute('aria-pressed', String(m === method));
      pay.append(b);
      return b;
    });
    const ok = btn('Bayar sekarang (simulasi)', 'btn full', () => {
      ok.disabled = true;
      ok.textContent = 'Memproses simulasi...';
      setTimeout(() => {
      const don = { id: Date.now(), kode: kode(), cid: c.id, judul: c.judul, nama: d.nama, email: d.email, anon: d.anon, rutin: !!d.rutin, nominal: d.nominal, pesan: d.pesan, metode: method, status: 'Simulasi', waktu: new Date().toISOString() };
      dons.unshift(don);
      c.terkumpul += d.nominal;
      save();
      closeModal();
      show('confirm', don.id);
      }, 800);
    });
    openModal([title, sum, pay, ok, el('p'), btn('Batal', 'btn ghost full', closeModal)]);
  }

  function renderConfirm(id) {
    const box = $('#confirm');
    box.replaceChildren();
    const d = dons.find((x) => x.id === id);
    if (!d) { box.append(el('p', 'muted', 'Data donasi tidak ditemukan.'), btn('Ke beranda', 'btn', () => show('home'))); return; }
    const p = el('div', 'panel receipt');
    p.append(el('p', 'brand-line', 'PeduliKita · Setiap Kebaikan Punya Arti · BUKTI DONASI (SIMULASI)'), el('div', 'ok-ico', '✅'), el('h2', '', 'Donasi simulasi tercatat'),
      el('p', 'muted', 'Terima kasih, ' + pubName(d) + '. Ini simulasi: donasi hanya tercatat di peramban ini dan tidak ada transaksi nyata.'));
    const rows = [['Kode donasi', d.kode], ['Kampanye', d.judul], ['Nominal', rp(d.nominal)], ['Metode', d.metode], ['Waktu', DT(d.waktu)], ['Status', d.status]].concat(d.rutin ? [['Jenis', 'Donasi rutin bulanan (simulasi)']] : []);
    rows.forEach(([k, v]) => { const it = el('div', 'item'); it.append(rowOf(el('span', 'muted', k), el('b', '', v))); p.append(it); });
    if (d.pesan) p.append(el('p', 'muted', 'Pesan doa'), el('blockquote', 'quote', d.pesan));
    const acts = el('div', 'hero-cta no-print');
    acts.append(
      btn('Salin ringkasan', 'btn', () => {
        const t = 'Donasi PeduliKita ' + d.kode + ' - ' + d.judul + ' - ' + rp(d.nominal) + ' - ' + d.status;
        if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('Ringkasan disalin.'), () => toast('Tidak dapat menyalin.', true));
        else toast('Tidak dapat menyalin.', true);
      }),
      btn('Unduh bukti (PDF)', 'btn navy', () => { const t = document.title; document.title = 'Bukti-' + d.kode; window.print(); document.title = t; }),
      btn('Lihat riwayat donasi', 'btn ghost', () => show('history')),
      btn('Kembali ke kampanye', 'btn ghost', () => show('detail', d.cid)));
    p.append(acts, el('p', 'muted', 'Ini simulasi: tidak ada uang sungguhan yang dipindahkan.'));
    box.append(p);
  }

  function renderHist() {
    const box = $('#hist');
    box.replaceChildren();
    if (!dons.length) {
      const e = el('div', 'empty');
      e.append(el('p', '', 'Belum ada riwayat donasi. Pilih kampanye untuk mulai berdonasi.'), btn('Pilih kampanye', 'btn', () => goSection('kampanye')));
      box.append(e);
      return;
    }
    const pn = el('div', 'panel');
    dons.forEach((d) => {
      const it = el('div', 'item');
      it.append(rowOf(el('b', '', d.judul), el('b', '', rp(d.nominal))), el('p', 'muted', d.kode + ' · ' + d.metode + ' · ' + DT(d.waktu) + ' · ' + d.status));
      if (d.pesan) it.append(el('p', '', d.pesan));
      it.append(btn('Lihat bukti donasi', 'btn ghost', () => show('confirm', d.id)));
      pn.append(it);
    });
    box.append(pn);
  }

  /* ---------- dashboard admin ---------- */
  let atab = 'ringkasan';
  let dfilter = 'Semua';
  const ATABS = [['ringkasan', 'Ringkasan'], ['kampanye', 'Kampanye'], ['laporan', 'Laporan dan dampak'], ['donasi', 'Donasi masuk'], ['donatur', 'Data donatur']];
  const campOpts = () => camps.map((c) => [c.id, c.judul]);

  function renderAdmin() {
    const box = $('#admin');
    box.replaceChildren(el('h2', '', 'Dashboard admin'), el('p', 'muted', 'Mode simulasi: data tersimpan di peramban ini saja dan belum memakai login server.'));
    const tabs = el('div', 'chips');
    tabs.setAttribute('role', 'group');
    tabs.setAttribute('aria-label', 'Menu admin');
    ATABS.forEach(([k, l]) => {
      const b = btn(l, 'chip', () => { atab = k; renderAdmin(); });
      b.setAttribute('aria-pressed', String(k === atab));
      tabs.append(b);
    });
    const body = el('div', 'admin-body');
    box.append(tabs, body);
    ({ ringkasan: adminSummary, kampanye: adminCamps, laporan: adminReports, donasi: adminDons, donatur: adminDonors })[atab](body);
  }

  function adminSummary(body) {
    const t = camps.reduce((a, c) => a + c.terkumpul, 0);
    const s = camps.reduce((a, c) => a + sal(c), 0);
    const donors = new Set(dons.filter((d) => d.email).map((d) => d.email.toLowerCase())).size;
    const st = el('div', 'stats dark');
    st.append(stat(rp(t), 'Dana terkumpul'), stat(rp(s), 'Dana disalurkan'), stat(rp(t - s), 'Sisa dana'),
      stat(String(camps.filter((c) => c.status === 'Aktif').length), 'Kampanye aktif'), stat(String(dons.length), 'Donasi tercatat'), stat(String(donors), 'Donatur unik'));
    const p = panel('Progres kampanye');
    camps.forEach((c) => {
      const it = el('div', 'item');
      it.append(rowOf(el('b', '', c.judul), statusBadge(c)), bar(pct(c)), el('p', 'muted', rp(c.terkumpul) + ' dari ' + rp(c.target) + ' · disalurkan ' + rp(sal(c))));
      p.append(it);
    });
    body.append(st, p);
  }

  function adminCamps(body) {
    body.append(mkForm([
      { key: 'judul', label: 'Judul kampanye', kind: 'text', max: 80 },
      { key: 'kat', label: 'Kategori', kind: 'select', opts: Object.keys(CATS).map((k) => [k, k]) },
      { key: 'lok', label: 'Lokasi', kind: 'text', max: 50 },
      { key: 'target', label: 'Target dana (Rp)', kind: 'number', min: 1000000 },
      { key: 'status', label: 'Status awal', kind: 'select', opts: STATUS.map((s) => [s, s]) },
      { key: 'cerita', label: 'Cerita kampanye', kind: 'textarea', max: 1500 },
      { key: 'foto', label: 'Foto sampul (JPG, PNG, atau WebP)', kind: 'file' }
    ], 'Tambah kampanye', async (b) => {
      const judul = b.v('judul'), lok = b.v('lok'), target = Number(b.v('target')), cerita = b.v('cerita');
      if (judul.length < 5 || judul.length > 80) b.err('judul', 'Judul 5 sampai 80 karakter.');
      if (lok.length < 2) b.err('lok', 'Isi lokasi kampanye.');
      if (!(target >= 1e6 && target <= 1e10)) b.err('target', 'Target antara Rp1.000.000 dan Rp10.000.000.000.');
      if (cerita.length < 20) b.err('cerita', 'Ceritakan kampanye minimal 20 karakter.');
      if (b.bad()) return;
      const foto = await readImage(b.file('foto'));
      const kat = CATS[b.v('kat')] ? b.v('kat') : 'Sosial';
      camps.unshift(norm({ id: 'k' + Date.now(), judul, kategori: kat, ikon: CATS[kat], lokasi: lok, target, terkumpul: 0, status: STATUS.includes(b.v('status')) ? b.v('status') : 'Draf', foto, cerita: cerita.split(/\n+/).filter(Boolean), penggunaan: [{ l: 'Penyaluran langsung', p: 85 }, { l: 'Operasional', p: 15 }], laporan: [], dampak: [] }));
      save();
      toast('Kampanye berhasil ditambahkan.');
      renderAdmin();
    }));
    const list = panel('Kelola kampanye');
    camps.forEach((c) => {
      const it = el('div', 'item');
      const sel = el('select');
      sel.setAttribute('aria-label', 'Status ' + c.judul);
      STATUS.forEach((s) => { const o = el('option', '', s); o.value = s; o.selected = s === c.status; sel.append(o); });
      sel.onchange = () => { c.status = sel.value; save(); toast('Status diubah menjadi ' + c.status + '.'); renderAdmin(); };
      const del = arm(el('button', 'btn ghost'), 'Hapus', 'Klik lagi untuk hapus', () => {
        if (dons.some((d) => d.cid === c.id)) { toast('Kampanye ini sudah punya donasi. Ubah statusnya menjadi Ditutup.', true); return; }
        camps = camps.filter((x) => x !== c);
        save();
        toast('Kampanye dihapus.');
        renderAdmin();
      });
      del.type = 'button';
      const act = el('div', 'hero-cta');
      act.append(sel, btn('Lihat halaman', 'btn ghost', () => show('detail', c.id)), del);
      it.append(rowOf(el('b', '', c.judul), statusBadge(c)), el('p', 'muted', rp(c.terkumpul) + ' dari ' + rp(c.target)), act);
      list.append(it);
    });
    body.append(list);
  }

  function adminReports(body) {
    if (!camps.length) { body.append(el('p', 'muted', 'Tambahkan kampanye terlebih dahulu.')); return; }
    body.append(mkForm([
      { key: 'cid', label: 'Kampanye', kind: 'select', opts: campOpts() },
      { key: 'tgl', label: 'Tanggal penyaluran', kind: 'date' },
      { key: 'uraian', label: 'Uraian penggunaan dana', kind: 'textarea', max: 200 },
      { key: 'jumlah', label: 'Jumlah disalurkan (Rp)', kind: 'number', min: 1000 },
      { key: 'bukti', label: 'Bukti penggunaan dana (foto nota atau dokumentasi)', kind: 'file' }
    ], 'Unggah laporan penyaluran', async (b) => {
      const c = camps.find((x) => x.id === b.v('cid'));
      const tgl = b.v('tgl'), uraian = b.v('uraian'), jumlah = Number(b.v('jumlah'));
      if (!c) b.err('cid', 'Pilih kampanye.');
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tgl)) b.err('tgl', 'Pilih tanggal penyaluran.');
      if (uraian.length < 5 || uraian.length > 200) b.err('uraian', 'Uraian 5 sampai 200 karakter.');
      if (c && !(jumlah > 0 && jumlah <= sisa(c))) b.err('jumlah', 'Jumlah harus lebih dari 0 dan tidak melebihi sisa dana ' + rp(sisa(c)) + '.');
      if (b.bad()) return;
      const bukti = await readImage(b.file('bukti'));
      c.laporan.push({ id: 'l' + Date.now(), tgl, uraian, jumlah, bukti });
      save();
      toast('Laporan penyaluran dana ditambahkan.');
      renderAdmin();
    }));
    body.append(mkForm([
      { key: 'cid', label: 'Kampanye', kind: 'select', opts: campOpts() },
      { key: 'judul', label: 'Judul kabar dampak', kind: 'text', max: 80 },
      { key: 'isi', label: 'Isi cerita dampak', kind: 'textarea', max: 500 },
      { key: 'foto', label: 'Foto dokumentasi', kind: 'file' }
    ], 'Publikasikan cerita dampak', async (b) => {
      const c = camps.find((x) => x.id === b.v('cid'));
      const judul = b.v('judul'), isi = b.v('isi');
      if (!c) b.err('cid', 'Pilih kampanye.');
      if (judul.length < 5 || judul.length > 80) b.err('judul', 'Judul 5 sampai 80 karakter.');
      if (isi.length < 20 || isi.length > 500) b.err('isi', 'Isi cerita 20 sampai 500 karakter.');
      if (b.bad()) return;
      const foto = await readImage(b.file('foto'));
      c.dampak.push({ id: 'i' + Date.now(), tgl: today(), judul, isi, foto });
      save();
      toast('Cerita dampak dipublikasikan.');
      renderAdmin();
    }));
    const all = [];
    camps.forEach((c) => {
      c.laporan.forEach((x) => all.push({ tgl: x.tgl, c, t: 'Laporan: ' + x.uraian + ' (' + rp(x.jumlah) + ')' }));
      c.dampak.forEach((x) => all.push({ tgl: x.tgl, c, t: 'Dampak: ' + x.judul }));
    });
    all.sort(byDate);
    const rec = panel('Entri terbaru');
    if (!all.length) rec.append(el('p', 'muted', 'Belum ada laporan atau cerita dampak.'));
    all.slice(0, 8).forEach((x) => { const it = el('div', 'item'); it.append(rowOf(el('b', '', x.c.judul), el('span', 'muted', D(x.tgl))), el('p', '', x.t)); rec.append(it); });
    body.append(rec);
  }

  function exportCsv(list) {
    const esc = (v) => { let s = String(v === undefined || v === null ? '' : v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
    const rows = [['Kode', 'Waktu', 'Kampanye', 'Donatur', 'Email', 'Nominal', 'Metode', 'Status', 'Pesan']].concat(list.map((d) => [d.kode, d.waktu, d.judul, d.nama, d.email, d.nominal, d.metode, d.status, d.pesan]));
    const blob = new Blob(['\ufeff' + rows.map((r) => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const u = URL.createObjectURL(blob);
    const a = el('a');
    a.href = u;
    a.download = 'donasi-pedulikita.csv';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  }

  function adminDons(body) {
    const f = field('Filter kampanye', uid(), 'select', 0, [['Semua', 'Semua kampanye']].concat(campOpts()));
    f.input.value = camps.some((c) => c.id === dfilter) ? dfilter : 'Semua';
    f.input.onchange = () => { dfilter = f.input.value; renderAdmin(); };
    const list = dons.filter((d) => f.input.value === 'Semua' || d.cid === f.input.value);
    const p = panel('Donasi masuk', f.wrap, rowOf(el('b', '', list.length + ' donasi · ' + rp(list.reduce((a, d) => a + d.nominal, 0))), btn('Ekspor CSV', 'btn ghost', () => { if (list.length) exportCsv(list); else toast('Belum ada data untuk diekspor.', true); })));
    if (!list.length) p.append(el('p', 'muted', 'Belum ada donasi masuk.'));
    list.forEach((d) => {
      const it = el('div', 'item');
      it.append(rowOf(el('b', '', d.nama + ' → ' + d.judul), el('b', '', rp(d.nominal))), el('p', 'muted', d.kode + ' · ' + d.metode + ' · ' + DT(d.waktu) + ' · ' + d.status + (d.email ? ' · ' + d.email : '')));
      if (d.pesan) it.append(el('p', '', d.pesan));
      p.append(it);
    });
    body.append(p);
  }

  function adminDonors(body) {
    const m = new Map();
    dons.filter((d) => d.email).forEach((d) => {
      const k = d.email.toLowerCase();
      const g = m.get(k) || { nama: d.nama, email: d.email, n: 0, total: 0, last: d.waktu };
      g.n += 1; g.total += d.nominal;
      if (d.waktu > g.last) g.last = d.waktu;
      m.set(k, g);
    });
    const p = panel('Data donatur', el('p', 'muted', 'Anonimkan data untuk menghapus nama dan email donatur. Nominal tetap masuk ke total dana.'));
    if (!m.size) p.append(el('p', 'muted', 'Belum ada data donatur.'));
    m.forEach((g, k) => {
      const it = el('div', 'item');
      const an = arm(el('button', 'btn ghost'), 'Anonimkan data', 'Klik lagi untuk anonimkan', () => {
        dons.forEach((d) => { if (d.email && d.email.toLowerCase() === k) { d.nama = 'Anonim'; d.email = ''; d.anon = true; } });
        save();
        toast('Data donatur dianonimkan.');
        renderAdmin();
      });
      an.type = 'button';
      it.append(rowOf(el('b', '', g.nama), el('b', '', rp(g.total))), el('p', 'muted', g.email + ' · ' + g.n + ' donasi · terakhir ' + DT(g.last)), an);
      p.append(it);
    });
    body.append(p);
  }

  /* ---------- inisialisasi ---------- */
  document.addEventListener('click', (e) => { const b = e.target.closest('[data-go]'); if (b) go(b.dataset.go); });
  $('#menu-btn').onclick = () => { const o = $('#nav').classList.toggle('open'); $('#menu-btn').setAttribute('aria-expanded', String(o)); };
  $('#q').oninput = (e) => { query = e.target.value.trim().slice(0, 60); renderGrid(); };
  $('#modal-x').onclick = closeModal;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  document.documentElement.classList.add('js');
  $('#sort').onchange = (e) => { sort = SORTS[e.target.value] ? e.target.value : 'terbaru'; renderGrid(); };
  $('#cta-donate').onclick = () => { const c = pickFeatured(); if (c) show('detail', c.id); else goSection('kampanye'); };
  const hm = location.hash.match(/^#c-([\w-]+)$/);
  show(hm ? 'detail' : 'home', hm ? hm[1] : undefined);
  if (!hm) { $('#grid').replaceChildren(...skel(3)); setTimeout(renderGrid, 450); }
})();
