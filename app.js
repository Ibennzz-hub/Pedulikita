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
  const fmtDate = (iso) => new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  const store = {
    get(k, f) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? f : v; } catch (e) { return f; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* penyimpanan penuh atau diblokir */ } }
  };

  const CATS = { Bencana: '🌊', Pendidikan: '📚', Kesehatan: '🩺', Sosial: '🤝' };
  const AMOUNTS = [10000, 25000, 50000, 100000, 250000];
  const METHODS = ['Transfer Bank (simulasi)', 'E-Wallet (simulasi)', 'QRIS (simulasi)'];
  const SEED = [
    { id: 'k1', judul: 'Bantuan Banjir Bandang Tapanuli', kategori: 'Bencana', ikon: '🌊', lokasi: 'Sumatera Utara', target: 150000000, terkumpul: 98500000, salur: 60000000, deskripsi: 'Ratusan keluarga kehilangan rumah dan harta akibat banjir bandang. Donasi dipakai untuk pangan, air bersih, selimut, dan obat-obatan.', penggunaan: [{ l: 'Logistik pangan', p: 45 }, { l: 'Obat dan kesehatan', p: 25 }, { l: 'Hunian sementara', p: 20 }, { l: 'Operasional', p: 10 }] },
    { id: 'k2', judul: 'Pemulihan Pascagempa Cianjur', kategori: 'Bencana', ikon: '🏚️', lokasi: 'Jawa Barat', target: 200000000, terkumpul: 120000000, salur: 85000000, deskripsi: 'Membangun kembali tempat tinggal sementara dan fasilitas umum bagi warga terdampak gempa.', penggunaan: [{ l: 'Hunian sementara', p: 50 }, { l: 'Sanitasi dan air', p: 25 }, { l: 'Layanan trauma', p: 15 }, { l: 'Operasional', p: 10 }] },
    { id: 'k3', judul: 'Beasiswa Anak Pesisir', kategori: 'Pendidikan', ikon: '📚', lokasi: 'Sibolga', target: 80000000, terkumpul: 32000000, salur: 20000000, deskripsi: 'Biaya sekolah, seragam, dan buku untuk 40 anak nelayan agar tetap bersekolah.', penggunaan: [{ l: 'Biaya sekolah', p: 60 }, { l: 'Perlengkapan belajar', p: 30 }, { l: 'Operasional', p: 10 }] },
    { id: 'k4', judul: 'Operasi Jantung untuk Alya', kategori: 'Kesehatan', ikon: '🩺', lokasi: 'Medan', target: 120000000, terkumpul: 87000000, salur: 45000000, deskripsi: 'Alya (6 tahun) membutuhkan operasi jantung bawaan. Dana langsung dibayarkan ke rumah sakit rujukan.', penggunaan: [{ l: 'Biaya operasi', p: 70 }, { l: 'Rawat inap', p: 20 }, { l: 'Transportasi keluarga', p: 10 }] },
    { id: 'k5', judul: 'Dapur Umum untuk Lansia', kategori: 'Sosial', ikon: '🍲', lokasi: 'Binjai', target: 40000000, terkumpul: 18500000, salur: 12000000, deskripsi: 'Menyediakan makan siang bergizi setiap hari untuk lansia prasejahtera.', penggunaan: [{ l: 'Bahan pangan', p: 65 }, { l: 'Relawan dan dapur', p: 25 }, { l: 'Operasional', p: 10 }] },
    { id: 'k6', judul: 'Sekolah Darurat Pascabanjir', kategori: 'Pendidikan', ikon: '🏫', lokasi: 'Langkat', target: 60000000, terkumpul: 41000000, salur: 30000000, deskripsi: 'Tenda kelas, papan tulis, dan buku agar anak-anak korban banjir bisa belajar kembali.', penggunaan: [{ l: 'Tenda dan perabot', p: 40 }, { l: 'Buku dan alat tulis', p: 40 }, { l: 'Operasional', p: 20 }] }
  ];

  let camps = store.get('pk_c', null);
  if (!Array.isArray(camps)) camps = JSON.parse(JSON.stringify(SEED));
  let dons = store.get('pk_d', []);
  if (!Array.isArray(dons)) dons = [];
  const save = () => { store.set('pk_c', camps); store.set('pk_d', dons); };

  let cat = 'Semua';
  let query = '';

  /* ---------- komponen kecil ---------- */
  const bar = (pct) => {
    const w = el('div', 'bar');
    w.setAttribute('role', 'progressbar');
    w.setAttribute('aria-valuenow', String(Math.min(100, Math.round(pct))));
    w.setAttribute('aria-valuemin', '0');
    w.setAttribute('aria-valuemax', '100');
    const f = el('div', 'bar-fill');
    f.style.width = Math.min(100, pct) + '%';
    w.append(f);
    return w;
  };
  const pct = (c) => (c.terkumpul / c.target) * 100;
  const stat = (v, l) => { const s = el('div', 'stat'); s.append(el('b', '', v), el('span', '', l)); return s; };

  function toast(msg, bad) {
    const t = el('div', 'toast' + (bad ? ' bad' : ''), msg);
    $('#toasts').append(t);
    setTimeout(() => t.remove(), 3500);
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

  function field(label, id, kind, max) {
    const wrap = el('div', 'field');
    const lb = el('label', '', label);
    lb.htmlFor = id;
    const input = kind === 'textarea' ? el('textarea') : el('input');
    if (kind === 'textarea') input.rows = 3; else input.type = kind;
    input.id = id;
    input.maxLength = max;
    input.autocomplete = 'off';
    const err = el('p', 'err');
    wrap.append(lb, input, err);
    return { wrap, input, err };
  }

  /* ---------- navigasi ---------- */
  function show(view, id) {
    $$('.view').forEach((s) => { s.hidden = s.id !== 'v-' + view; });
    $$('#nav [data-go]').forEach((b) => b.classList.toggle('on', b.dataset.go === view));
    if (view === 'home') renderHome();
    if (view === 'detail') renderDetail(id);
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
  function go(target) {
    if (target === 'kampanye' || target === 'transparansi') goSection(target);
    else show(target);
  }

  /* ---------- beranda ---------- */
  function totals() {
    const total = camps.reduce((a, c) => a + c.terkumpul, 0);
    const donors = dons.length;
    return { total, donors };
  }
  function renderStats(box) {
    const t = totals();
    box.replaceChildren(stat(rp(t.total), 'Dana terkumpul'), stat(String(camps.length), 'Kampanye aktif'), stat(String(dons.length), 'Donasi dari peramban ini'), stat(rp(camps.reduce((a, c) => a + c.salur, 0)), 'Sudah disalurkan'));
  }
  function renderCats() {
    const box = $('#cats');
    box.replaceChildren();
    ['Semua'].concat(Object.keys(CATS)).forEach((k) => {
      const b = el('button', 'chip', k);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(k === cat));
      b.onclick = () => { cat = k; renderCats(); renderGrid(); };
      box.append(b);
    });
  }
  function renderGrid() {
    const q = query.toLowerCase();
    const list = camps.filter((c) => (cat === 'Semua' || c.kategori === cat) && (c.judul + ' ' + c.lokasi).toLowerCase().includes(q));
    const grid = $('#grid');
    grid.replaceChildren();
    if (!list.length) {
      const e = el('div', 'empty');
      e.append(el('p', '', 'Tidak ada kampanye yang cocok. Coba kata kunci atau kategori lain.'));
      grid.append(e);
      return;
    }
    list.forEach((c) => {
      const card = el('article', 'card');
      const row = el('div', 'row');
      row.append(el('span', 'ico', c.ikon), el('span', 'badge', c.kategori));
      const meta = el('div', 'row');
      meta.append(el('b', '', rp(c.terkumpul)), el('span', 'muted', 'target ' + rp(c.target)));
      const btn = el('button', 'btn navy', 'Lihat detail');
      btn.type = 'button';
      btn.onclick = () => show('detail', c.id);
      card.append(row, el('h3', '', c.judul), el('p', 'muted', c.lokasi), bar(pct(c)), meta, el('span', 'muted', Math.floor(pct(c)) + '% tercapai'), btn);
      grid.append(card);
    });
  }
  function renderTransp() {
    const box = $('#transp');
    box.replaceChildren();
    camps.forEach((c) => {
      const it = el('div', 'item');
      const r = el('div', 'row');
      r.append(el('b', '', c.judul), el('span', 'muted', 'Tersalurkan ' + rp(c.salur) + ' dari ' + rp(c.terkumpul)));
      it.append(r, bar(c.terkumpul ? (c.salur / c.terkumpul) * 100 : 0));
      box.append(it);
    });
  }
  function renderHome() {
    renderStats($('#hero-stats'));
    renderCats();
    renderGrid();
    renderTransp();
  }

  /* ---------- detail & donasi ---------- */
  function renderDetail(id) {
    const box = $('#detail');
    box.replaceChildren();
    const c = camps.find((x) => x.id === id);
    const back = el('button', 'btn ghost', 'Kembali ke kampanye');
    back.type = 'button';
    back.onclick = () => goSection('kampanye');
    if (!c) { box.append(back, el('p', 'muted', 'Kampanye tidak ditemukan.')); return; }

    const left = el('div');
    const meta = el('div', 'row');
    meta.append(el('b', '', rp(c.terkumpul) + ' terkumpul'), el('span', 'muted', 'target ' + rp(c.target)));
    left.append(el('span', 'badge', c.ikon + ' ' + c.kategori), el('h2', '', c.judul), el('p', 'muted', c.lokasi), bar(pct(c)), meta, el('p', '', c.deskripsi));

    const use = el('div', 'panel');
    use.append(el('h3', '', 'Rencana penggunaan dana'));
    c.penggunaan.forEach((u) => {
      const it = el('div', 'item');
      const r = el('div', 'row');
      r.append(el('span', '', u.l), el('b', '', u.p + '%'));
      it.append(r, bar(u.p));
      use.append(it);
    });
    left.append(use);

    const donors = el('div', 'panel');
    donors.append(el('h3', '', 'Donatur terbaru'));
    const mine = dons.filter((d) => d.cid === c.id).slice(0, 5);
    if (!mine.length) donors.append(el('p', 'muted', 'Belum ada donasi dari peramban ini. Jadilah yang pertama.'));
    mine.forEach((d) => {
      const it = el('div', 'item');
      const r = el('div', 'row');
      r.append(el('b', '', d.nama), el('span', '', rp(d.nominal)));
      it.append(r);
      if (d.pesan) it.append(el('p', 'muted', d.pesan));
      donors.append(it);
    });
    left.append(donors);

    /* form donasi */
    let nominal = 0;
    const form = el('form', 'panel');
    form.noValidate = true;
    form.append(el('h3', '', 'Berikan donasi'));
    const amts = el('div', 'amounts');
    amts.setAttribute('role', 'group');
    amts.setAttribute('aria-label', 'Pilihan nominal');
    const custom = field('Nominal lain (Rp)', 'f-nom', 'number', 12);
    custom.input.min = '10000';
    custom.input.inputMode = 'numeric';
    const chipBtns = AMOUNTS.map((a) => {
      const b = el('button', 'chip', rp(a));
      b.type = 'button';
      b.setAttribute('aria-pressed', 'false');
      b.onclick = () => {
        nominal = a;
        custom.input.value = '';
        chipBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      };
      amts.append(b);
      return b;
    });
    custom.input.oninput = () => {
      nominal = Number(custom.input.value) || 0;
      chipBtns.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    };
    const fn = field('Nama donatur', 'f-nama', 'text', 60);
    const fe = field('Email', 'f-email', 'email', 80);
    const fm = field('Pesan dukungan (opsional)', 'f-pesan', 'textarea', 200);
    const ck = el('label', 'check');
    const cb = el('input');
    cb.type = 'checkbox';
    ck.append(cb, el('span', '', 'Tampilkan sebagai anonim'));
    const go2 = el('button', 'btn full', 'Lanjut ke pembayaran');
    go2.type = 'submit';
    form.append(amts, custom.wrap, fn.wrap, fe.wrap, fm.wrap, ck, go2);

    form.onsubmit = (e) => {
      e.preventDefault();
      const nama = fn.input.value.trim();
      const email = fe.input.value.trim();
      const pesan = fm.input.value.trim();
      let ok = true;
      const setErr = (f, m) => { f.err.textContent = m; if (m) ok = false; };
      setErr(fn, nama.length < 2 || nama.length > 60 ? 'Nama harus 2 sampai 60 karakter.' : '');
      setErr(fe, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Masukkan alamat email yang valid.');
      setErr(fm, pesan.length > 200 ? 'Pesan maksimal 200 karakter.' : '');
      setErr(custom, nominal >= 10000 && nominal <= 100000000 ? '' : 'Pilih nominal antara Rp10.000 dan Rp100.000.000.');
      if (ok) checkout(c, { nama, pesan, anon: cb.checked, nominal });
      else toast('Periksa kembali isian formulir.', true);
    };

    const layout = el('div', 'detail-grid');
    layout.append(left, form);
    box.append(back, layout);
  }

  function checkout(c, d) {
    let method = METHODS[0];
    const title = el('h3', '', 'Simulasi checkout');
    title.id = 'modal-title';
    const sum = el('div', 'panel');
    [['Kampanye', c.judul], ['Donatur', d.anon ? 'Anonim' : d.nama], ['Nominal', rp(d.nominal)]].forEach(([k, v]) => {
      const r = el('div', 'row');
      r.append(el('span', 'muted', k), el('b', '', v));
      sum.append(r);
    });
    const pay = el('div', 'pay');
    pay.setAttribute('role', 'group');
    pay.setAttribute('aria-label', 'Metode pembayaran');
    const btns = METHODS.map((m) => {
      const b = el('button', '', m);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(m === method));
      b.onclick = () => { method = m; btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); };
      pay.append(b);
      return b;
    });
    const ok = el('button', 'btn full', 'Bayar sekarang (simulasi)');
    ok.type = 'button';
    ok.onclick = () => {
      dons.unshift({ id: Date.now(), cid: c.id, judul: c.judul, nama: d.anon ? 'Anonim' : d.nama, nominal: d.nominal, pesan: d.pesan, metode: method, waktu: new Date().toISOString() });
      c.terkumpul += d.nominal;
      save();
      closeModal();
      toast('Terima kasih! Donasi ' + rp(d.nominal) + ' berhasil dicatat.');
      show('history');
    };
    const cancel = el('button', 'btn ghost full', 'Batal');
    cancel.type = 'button';
    cancel.onclick = closeModal;
    openModal([title, sum, pay, ok, el('p', ''), cancel]);
  }

  /* ---------- riwayat ---------- */
  function renderHist() {
    const box = $('#hist');
    box.replaceChildren();
    if (!dons.length) {
      const e = el('div', 'empty');
      const b = el('button', 'btn', 'Pilih kampanye');
      b.type = 'button';
      b.onclick = () => goSection('kampanye');
      e.append(el('p', '', 'Belum ada riwayat donasi. Pilih kampanye untuk mulai berdonasi.'), b);
      box.append(e);
      return;
    }
    const panel = el('div', 'panel');
    dons.forEach((d) => {
      const it = el('div', 'item');
      const r = el('div', 'row');
      r.append(el('b', '', d.judul), el('b', '', rp(d.nominal)));
      it.append(r, el('p', 'muted', d.nama + ' · ' + d.metode + ' · ' + fmtDate(d.waktu)));
      if (d.pesan) it.append(el('p', '', d.pesan));
      panel.append(it);
    });
    box.append(panel);
  }

  /* ---------- admin ---------- */
  function renderAdmin() {
    const t = totals();
    $('#admin-stats').replaceChildren(stat(rp(t.total), 'Total dana'), stat(String(camps.length), 'Kampanye'), stat(String(dons.length), 'Jumlah donasi'), stat(rp(dons.reduce((a, d) => a + d.nominal, 0)), 'Donasi baru (lokal)'));
    const box = $('#admin-don');
    box.replaceChildren();
    if (!dons.length) { box.append(el('p', 'muted', 'Belum ada donasi masuk.')); return; }
    dons.forEach((d) => {
      const it = el('div', 'item');
      const r = el('div', 'row');
      r.append(el('b', '', d.nama + ' → ' + d.judul), el('b', '', rp(d.nominal)));
      it.append(r, el('p', 'muted', d.metode + ' · ' + fmtDate(d.waktu)));
      box.append(it);
    });
  }

  function initAdminForm() {
    const sel = $('#a-kat');
    Object.keys(CATS).forEach((k) => { const o = el('option', '', k); o.value = k; sel.append(o); });
    $('#add-form').onsubmit = (e) => {
      e.preventDefault();
      const judul = $('#a-judul').value.trim();
      const lok = $('#a-lok').value.trim();
      const target = Number($('#a-target').value);
      let ok = true;
      const setErr = (id, m) => { $(id).textContent = m; if (m) ok = false; };
      setErr('#a-judul-e', judul.length < 5 || judul.length > 80 ? 'Judul 5 sampai 80 karakter.' : '');
      setErr('#a-lok-e', lok.length < 2 ? 'Isi lokasi kampanye.' : '');
      setErr('#a-target-e', target >= 1000000 && target <= 10000000000 ? '' : 'Target antara Rp1.000.000 dan Rp10.000.000.000.');
      if (!ok) { toast('Periksa kembali isian formulir.', true); return; }
      const kat = sel.value;
      camps.unshift({ id: 'k' + Date.now(), judul, kategori: kat, ikon: CATS[kat] || '🤝', lokasi: lok, target, terkumpul: 0, salur: 0, deskripsi: 'Kampanye baru yang dibuat oleh admin PeduliKita.', penggunaan: [{ l: 'Penyaluran langsung', p: 85 }, { l: 'Operasional', p: 15 }] });
      save();
      e.target.reset();
      renderAdmin();
      toast('Kampanye berhasil ditambahkan.');
    };
    let armed = false;
    const rb = $('#reset');
    rb.onclick = () => {
      if (!armed) {
        armed = true;
        rb.textContent = 'Klik lagi untuk konfirmasi reset';
        setTimeout(() => { armed = false; rb.textContent = 'Reset data demo'; }, 4000);
        return;
      }
      camps = JSON.parse(JSON.stringify(SEED));
      dons = [];
      save();
      armed = false;
      rb.textContent = 'Reset data demo';
      renderAdmin();
      toast('Data demo dikembalikan ke awal.');
    };
  }

  /* ---------- inisialisasi ---------- */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (b) go(b.dataset.go);
  });
  $('#menu-btn').onclick = () => {
    const open = $('#nav').classList.toggle('open');
    $('#menu-btn').setAttribute('aria-expanded', String(open));
  };
  $('#q').oninput = (e) => { query = e.target.value.trim().slice(0, 60); renderGrid(); };
  $('#modal-x').onclick = closeModal;
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#modal').hidden) closeModal(); });
  initAdminForm();
  show('home');
})();
