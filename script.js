// ============ THEME ============
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('chatalog-theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
else if (window.matchMedia('(prefers-color-scheme: light)').matches) root.setAttribute('data-theme', 'light');

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('chatalog-theme', next);
});

// ============ NAV SCROLL STATE ============
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// active link highlight
const sections = ['product', 'marketplace', 'how', 'pricing', 'faq'].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = document.querySelectorAll('[data-nav]');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// ============ MOBILE MENU ============
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

// ============ CURSOR GLOW ============
const glow = document.getElementById('cursorGlow');
let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
if (window.matchMedia('(hover: hover)').matches) {
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  (function loop() {
    gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
    glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
}

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 6) * 60}ms`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ============ HERO PHONE — AUTOTYPE LOOP ============
const phoneBody = document.getElementById('phoneBody');
const phoneStatus = document.getElementById('phoneStatus');
const heroScript = [
  { side: 'in', text: 'hi! ada dress warna navy gak, size M?' },
  { side: 'out', text: 'Ada — Amara Wrap Dress navy, size M, stok 4 pcs. Mau aku siapin link checkout-nya?' },
  { side: 'in', text: 'boleh, 1 aja' },
  { side: 'out', text: 'Siap, 1x Amara Wrap Dress (Navy, M) — Rp 349,000. Link pembayaran sudah aku kirim ya ✅' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runHeroLoop() {
  while (true) {
    phoneBody.innerHTML = '';
    phoneStatus.textContent = 'mengetik…';
    for (const msg of heroScript) {
      await sleep(900);
      if (msg.side === 'out') {
        const typing = document.createElement('div');
        typing.className = 'typing-dots';
        typing.innerHTML = '<span></span><span></span><span></span>';
        phoneBody.appendChild(typing);
        await sleep(1100);
        typing.remove();
      }
      const b = document.createElement('div');
      b.className = `bubble ${msg.side}`;
      b.innerHTML = msg.text + (msg.side === 'out' ? '<span class="tick">✓✓ dibaca</span>' : '');
      phoneBody.appendChild(b);
      phoneBody.scrollTop = phoneBody.scrollHeight;
    }
    phoneStatus.textContent = 'online';
    await sleep(3200);
  }
}
runHeroLoop();

// ============ INTERACTIVE DEMO CHAT ============
const demoBody = document.getElementById('demoBody');
const demoQuick = document.getElementById('demoQuick');
const demoStatus = document.getElementById('demoStatus');

const demoTree = {
  start: {
    bot: "hai, selamat datang di Amara Studio 👋 mau cari apa hari ini?",
    options: [
      { label: 'Cek stok & ukuran', next: 'stock' },
      { label: 'Saya mau komplain', next: 'escalate' },
      { label: 'Ada jual sepatu gak?', next: 'marketplace' },
    ],
  },
  stock: {
    bot: "Tentu — Amara Wrap Dress tersedia dalam Navy, Black, dan Rust. Navy size M sisa 4 pcs. Mau aku holdkan atau langsung kirim link checkout?",
    options: [
      { label: 'Kirim link checkout', next: 'checkout' },
      { label: 'Lihat warna lain', next: 'colors' },
      { label: '⟵ Kembali ke awal', next: 'start' },
    ],
  },
  colors: {
    bot: "Ini yang masih ready sekarang: Navy (sisa 4), Black (sisa 9), Rust (sisa 2) — semua size M. Mau aku kirim link untuk salah satunya?",
    options: [
      { label: 'Kirim link checkout', next: 'checkout' },
      { label: '⟵ Kembali ke awal', next: 'start' },
    ],
  },
  checkout: {
    bot: "Selesai ✅ — 1x Amara Wrap Dress (Navy, M), Rp 349.000. Ini link pembayarannya: pay.chatalog.demo/amr-3391. Berlaku 30 menit.",
    options: [
      { label: '⟵ Kembali ke awal', next: 'start' },
    ],
  },
  escalate: {
    bot: "Maaf banget soal itu — ini bukan hal yang boleh aku tebak, jadi aku langsung hubungkan ke tim asli sekarang. Mereka akan lanjut di chat yang sama ini, tidak perlu mengulang cerita.",
    system: 'Dieskalasikan ke agen manusia · rata-rata hand-off 40 detik',
    options: [
      { label: '⟵ Kembali ke awal', next: 'start' },
    ],
  },
  marketplace: {
    bot: "Kami sendiri tidak jual sepatu, tapi Ritma Fit — mitra marketplace Chatalog — jual. Mau aku hubungkan ke agen mereka di chat yang sama ini?",
    options: [
      { label: 'Ya, hubungkan', next: 'routed' },
      { label: 'Tidak, makasih', next: 'start' },
    ],
  },
  routed: {
    bot: "Menghubungkan ke Ritma Fit sekarang — agen mereka akan gabung di sini juga, satu thread yang sama. 👟",
    system: 'Hand-off marketplace · Ritma Fit (Fitness & apparel)',
    options: [
      { label: '⟵ Kembali ke awal', next: 'start' },
    ],
  },
};

function addDemoBubble(side, text) {
  const b = document.createElement('div');
  b.className = `bubble ${side}`;
  b.textContent = text;
  demoBody.appendChild(b);
  demoBody.scrollTop = demoBody.scrollHeight;
}

function addSystemNote(text) {
  const s = document.createElement('div');
  s.style.cssText = 'align-self:center;font-family:var(--font-mono);font-size:.68rem;color:var(--text-faint);border:1px dashed var(--border-strong);padding:.35rem .7rem;border-radius:999px;margin:.2rem 0;';
  s.textContent = text;
  demoBody.appendChild(s);
  demoBody.scrollTop = demoBody.scrollHeight;
}

function renderDemoOptions(node) {
  demoQuick.innerHTML = '';
  node.options.forEach(opt => {
    const chip = document.createElement('button');
    chip.className = 'qr-chip';
    chip.textContent = opt.label;
    chip.addEventListener('click', () => goToDemoNode(opt.next, opt.label));
    demoQuick.appendChild(chip);
  });
}

async function goToDemoNode(key, userLabel) {
  const node = demoTree[key];
  const chips = demoQuick.querySelectorAll('.qr-chip');
  chips.forEach(c => c.disabled = true);

  if (key === 'start' && userLabel) {
    demoBody.innerHTML = '';
  } else if (userLabel) {
    addDemoBubble('out', userLabel);
  }

  demoStatus.textContent = 'mengetik…';
  const typing = document.createElement('div');
  typing.className = 'typing-dots';
  typing.innerHTML = '<span></span><span></span><span></span>';
  demoBody.appendChild(typing);
  demoBody.scrollTop = demoBody.scrollHeight;
  await sleep(700 + Math.random() * 500);
  typing.remove();
  demoStatus.textContent = 'online';

  addDemoBubble('in', node.bot);
  if (node.system) addSystemNote(node.system);
  renderDemoOptions(node);
}

goToDemoNode('start');

// ============ PRICING TOGGLE ============
const ptSwitch = document.getElementById('ptSwitch');
const priceNums = document.querySelectorAll('.price-num');
const ptLabels = document.querySelectorAll('.pt-label');
let annual = false;
ptSwitch.addEventListener('click', () => {
  annual = !annual;
  ptSwitch.classList.toggle('on', annual);
  ptLabels[0].dataset.active = String(!annual);
  ptLabels[1].dataset.active = String(annual);
  priceNums.forEach(el => {
    el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
  });
});

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ============ TESTIMONIAL SLIDER ============
const quoteTrack = document.getElementById('quoteTrack');
const quoteDots = document.getElementById('quoteDots');
const quoteCards = quoteTrack.querySelectorAll('.quote-card');
let quoteIndex = 0;

quoteCards.forEach((_, i) => {
  const dot = document.createElement('button');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => setQuote(i));
  quoteDots.appendChild(dot);
});

function setQuote(i) {
  quoteIndex = i;
  quoteTrack.style.transform = `translateX(-${i * 100}%)`;
  quoteTrack.style.transition = 'transform .5s cubic-bezier(.2,.7,.3,1)';
  [...quoteDots.children].forEach((d, idx) => d.classList.toggle('active', idx === i));
}
setInterval(() => setQuote((quoteIndex + 1) % quoteCards.length), 6000);

// ============ STAT COUNT-UP ============
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(target).includes('.');
    let start = 0;
    const duration = 1200;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ============ FLOATING WA WIDGET ============
const waFab = document.getElementById('waFab');
const waPanel = document.getElementById('waPanel');
const waClose = document.getElementById('waClose');
const waBody = document.getElementById('waBody');
const waForm = document.getElementById('waForm');
const waInput = document.getElementById('waInput');
let waOpened = false;

function addWaBubble(side, text) {
  const b = document.createElement('div');
  b.className = `bubble ${side}`;
  b.textContent = text;
  waBody.appendChild(b);
  waBody.scrollTop = waBody.scrollHeight;
}

waFab.addEventListener('click', () => {
  const isOpen = waPanel.classList.toggle('open');
  if (isOpen && !waOpened) {
    waOpened = true;
    setTimeout(() => addWaBubble('in', "Hai 👋 aku agen demo Chatalog. Tanya apa saja soal harga, setup, atau marketplace — atau bilang hai aja dulu."), 400);
  }
});
waClose.addEventListener('click', () => waPanel.classList.remove('open'));

waForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const val = waInput.value.trim();
  if (!val) return;
  addWaBubble('out', val);
  waInput.value = '';
  const typing = document.createElement('div');
  typing.className = 'typing-dots';
  typing.innerHTML = '<span></span><span></span><span></span>';
  waBody.appendChild(typing);
  waBody.scrollTop = waBody.scrollHeight;
  await sleep(900);
  typing.remove();
  addWaBubble('in', "Makasih sudah coba demonya! Chatalog asli akan menjawab langsung dari katalog kamu sendiri — jadwalkan demo di atas dan kami siapkan untuk nomor kamu.");
});
