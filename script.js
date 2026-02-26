/* ============================================================
   GICA'S NOVIDADES — SCRIPT.JS
   ============================================================ */

/* ── DEPOIMENTOS ────────────────────────────────────────── */
const depoimentosImgs = [
  'depoimentos/1772058880810_0_whatsapp_image_2026_02_25_at_18_04_44_3_.jpeg',
  'depoimentos/1772058881422_1_whatsapp_image_2026_02_25_at_18_04_44_2_.jpeg',
  'depoimentos/1772058882036_2_whatsapp_image_2026_02_25_at_18_04_44_1_.jpeg',
  'depoimentos/1772058882651_3_whatsapp_image_2026_02_25_at_18_04_44.jpeg',
  'depoimentos/1772058883166_4_whatsapp_image_2026_02_25_at_18_04_43_3_.jpeg',
  'depoimentos/1772058883880_5_whatsapp_image_2026_02_25_at_18_04_43_2_.jpeg',
  'depoimentos/1772058884494_6_whatsapp_image_2026_02_25_at_18_04_43_1_.jpeg',
  'depoimentos/1772058885111_7_whatsapp_image_2026_02_25_at_18_04_43.jpeg',
  'depoimentos/1772058885389_8_whatsapp_image_2026_02_25_at_18_04_42_3_.jpeg',
  'depoimentos/1772058885929_9_whatsapp_image_2026_02_25_at_18_04_42_2_.jpeg',
  'depoimentos/1772058886253_10_whatsapp_image_2026_02_25_at_18_04_42_1_.jpeg',
  'depoimentos/1772058886748_11_whatsapp_image_2026_02_25_at_18_04_42.jpeg',
  'depoimentos/1772058887157_12_whatsapp_image_2026_02_25_at_18_04_41_2_.jpeg',
  'depoimentos/1772058887413_13_whatsapp_image_2026_02_25_at_18_04_41_1_.jpeg',
  'depoimentos/1772058887771_14_whatsapp_image_2026_02_25_at_18_04_41.jpeg',
];

const depTrack     = document.getElementById('depTrack');
const depPrev      = document.getElementById('depPrev');
const depNext      = document.getElementById('depNext');
const depOuter     = document.getElementById('depTrackOuter');

/* Renderiza os itens */
depoimentosImgs.forEach((src, i) => {
  const item = document.createElement('div');
  item.className = 'dep-item';

  const img = document.createElement('img');
  img.src     = src;
  img.alt     = `Depoimento de cliente ${i + 1}`;
  img.loading = 'lazy';

  item.appendChild(img);
  depTrack.appendChild(item);
});

/* Scroll por índice — os listeners dos botões estão na seção de auto-avanço */

/* Arrastar para scroll no desktop */
let isDown = false, startX, scrollLeft;

depOuter.addEventListener('mousedown', e => {
  isDown = true;
  depOuter.style.cursor = 'grabbing';
  startX = e.pageX - depOuter.offsetLeft;
  scrollLeft = depOuter.scrollLeft;
});

depOuter.addEventListener('mouseleave', () => { isDown = false; depOuter.style.cursor = ''; });
depOuter.addEventListener('mouseup',    () => { isDown = false; depOuter.style.cursor = ''; });

depOuter.addEventListener('mousemove', e => {
  if (!isDown) return;
  e.preventDefault();
  const x    = e.pageX - depOuter.offsetLeft;
  const walk = (x - startX) * 1.4;
  depOuter.scrollLeft = scrollLeft - walk;
});

/* ── AUTO-AVANÇO DO CARROSSEL (3 segundos) ──────────────── */
let currentDepIndex = 0;
let autoAdvanceTimer = null;

function getDepItems() {
  return depTrack.querySelectorAll('.dep-item');
}

function scrollToIndex(idx) {
  const items = getDepItems();
  if (!items[idx]) return;
  depOuter.scrollTo({ left: items[idx].offsetLeft - 4, behavior: 'smooth' });
}

function startAutoAdvance() {
  stopAutoAdvance();
  autoAdvanceTimer = setInterval(() => {
    const items = getDepItems();
    currentDepIndex = (currentDepIndex + 1) % items.length;
    scrollToIndex(currentDepIndex);
  }, 3000);
}

function stopAutoAdvance() {
  if (autoAdvanceTimer) { clearInterval(autoAdvanceTimer); autoAdvanceTimer = null; }
}

startAutoAdvance();

/* Pausa no hover e retoma ao sair */
depOuter.addEventListener('mouseenter', stopAutoAdvance);
depOuter.addEventListener('mouseleave', startAutoAdvance);

/* Pausa no toque e retoma ao soltar */
depOuter.addEventListener('touchstart', stopAutoAdvance, { passive: true });
depOuter.addEventListener('touchend', () => {
  setTimeout(startAutoAdvance, 2000);
}, { passive: true });

/* Sincroniza índice ao scrollar manualmente */
depOuter.addEventListener('scroll', () => {
  const items = getDepItems();
  let closestIdx = 0, closestDiff = Infinity;
  items.forEach((item, idx) => {
    const diff = Math.abs(item.offsetLeft - depOuter.scrollLeft);
    if (diff < closestDiff) { closestDiff = diff; closestIdx = idx; }
  });
  currentDepIndex = closestIdx;
}, { passive: true });

/* Atualiza índice ao usar os botões */
depPrev.addEventListener('click', () => {
  const items = getDepItems();
  currentDepIndex = Math.max(0, currentDepIndex - 1);
  scrollToIndex(currentDepIndex);
});

depNext.addEventListener('click', () => {
  const items = getDepItems();
  currentDepIndex = Math.min(items.length - 1, currentDepIndex + 1);
  scrollToIndex(currentDepIndex);
});

/* ── LIGHTBOX ─────────────────────────────────────────────── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxOverlay = document.getElementById('lightboxOverlay');

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  stopAutoAdvance();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  startAutoAdvance();
}

/* Clique em qualquer imagem do carrossel abre o lightbox */
depTrack.addEventListener('click', e => {
  if (isDown) return; /* ignora se estava arrastando */
  const item = e.target.closest('.dep-item');
  if (!item) return;
  const img = item.querySelector('img');
  if (img) openLightbox(img.src, img.alt);
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay.addEventListener('click', closeLightbox);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

/* ── BARRA DE PROGRESSO DO SCROLL ──────────────────────── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.pageYOffset;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
}, { passive: true });

/* ── PARTÍCULAS FLUTUANTES NO HERO ─────────────────────── */
(function createParticles() {
  const hero   = document.querySelector('.hero');
  const colors = [
    'rgba(232,180,200,.55)',
    'rgba(201,163,101,.45)',
    'rgba(253,232,239,.65)',
    'rgba(194,129,154,.4)',
    'rgba(180,165,220,.45)',
  ];

  for (let i = 0; i < 22; i++) {
    const p   = document.createElement('div');
    const size = Math.random() * 7 + 3;
    p.className = 'hero-particle';
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `top:${Math.random() * 100}%`,
      `width:${size}px`,
      `height:${size}px`,
      `background:${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-delay:${(Math.random() * 8).toFixed(2)}s`,
      `animation-duration:${(Math.random() * 7 + 6).toFixed(2)}s`,
    ].join(';');
    hero.appendChild(p);
  }
})();

/* ── CONTADOR ANIMADO NOS BADGES (Sobre) ───────────────── */
(function animateCounters() {
  const badges = document.querySelectorAll('.badge-num');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();

      /* Extrai prefixo, número e sufixo — ex: "+15", "24h", "100%" */
      const match = raw.match(/^([^0-9]*)(\d+)([^0-9]*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseInt(numStr, 10);
      let current  = 0;
      const step   = Math.ceil(target / 40);

      const tick = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = prefix + current + suffix;
        if (current >= target) clearInterval(tick);
      }, 28);

      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  badges.forEach(b => counterObserver.observe(b));
})();

/* ── RIPPLE NOS BOTÕES ──────────────────────────────────── */
(function addRipple() {
  const selectors = [
    '.btn-wpp', '.btn-outline', '.btn-vitrine-hero',
    '.btn-wpp-grande', '.btn-vitrine-header', '.btn-vitrine-banner',
  ];
  document.querySelectorAll(selectors.join(',')).forEach(btn => {
    btn.addEventListener('click', e => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top  - size / 2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
})();

/* ── HEADER SCROLL ──────────────────────────────────────── */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ── MENU MOBILE ────────────────────────────────────────── */
const menuToggle = document.getElementById('menuToggle');
const navMenu    = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');
const navClose   = document.getElementById('navClose');

function openMenu() {
  navMenu.classList.add('open');
  navOverlay.classList.add('active');
  menuToggle.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  navMenu.classList.remove('open');
  navOverlay.classList.remove('active');
  menuToggle.classList.remove('active');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => {
  navMenu.classList.contains('open') ? closeMenu() : openMenu();
});

navClose.addEventListener('click', closeMenu);
navOverlay.addEventListener('click', closeMenu);

/* Fecha menu ao clicar em link */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* ── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ── SMOOTH SCROLL PARA LINKS ÂNCORA ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

/* ── NAV LINK ATIVO ─────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const top    = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id     = section.getAttribute('id');
    if (scrollY >= top && scrollY < bottom) {
      allNavLinks.forEach(l => l.classList.remove('active'));
      allNavLinks.forEach(l => {
        if (l.getAttribute('href') === `#${id}`) l.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
