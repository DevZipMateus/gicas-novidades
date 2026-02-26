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

/* Scroll suave ao clicar nos botões */
function getScrollAmount() {
  const item = depTrack.querySelector('.dep-item');
  return item ? item.offsetWidth + 16 : 240;
}

depPrev.addEventListener('click', () => {
  depOuter.scrollBy({ left: -getScrollAmount() * 3, behavior: 'smooth' });
});

depNext.addEventListener('click', () => {
  depOuter.scrollBy({ left: getScrollAmount() * 3, behavior: 'smooth' });
});

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
