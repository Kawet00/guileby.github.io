// ===== Année dans le footer =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Nav : fond au scroll =====
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ===== Menu mobile =====
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  links.classList.toggle('open');
  toggle.classList.toggle('open');
});
links.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.classList.remove('open');
  })
);

// ===== Reveal au scroll (sections, projets, cartes) =====
const revealEls = document.querySelectorAll(
  '.section__title, .section__sub, .about__text, .about__cards, .minicard, .skillgroup, .tags, .project, .tl, .contact__cards, .contact__form'
);
revealEls.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${(i % 4) * 80}ms`;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ===== Barres de compétences =====
const bars = document.querySelectorAll('.bar');
const barIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); barIO.unobserve(e.target); }
  });
}, { threshold: 0.4 });
bars.forEach(b => barIO.observe(b));

// ===== Compteurs animés =====
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      n = Math.min(target, n + step);
      el.textContent = n;
      if (n < target) requestAnimationFrame(tick);
    };
    tick();
    countIO.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => countIO.observe(c));

// ===== Formulaire de contact =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', async (ev) => {
  // Si Formspree n'est pas configuré, on évite l'envoi réel
  if (form.action.includes('your-id')) {
    ev.preventDefault();
    note.textContent = '⚠️ Configurez l\'adresse du formulaire (Formspree) pour activer l\'envoi.';
    note.style.color = '#fbbf24';
    return;
  }
  ev.preventDefault();
  note.textContent = 'Envoi en cours...';
  note.style.color = '';
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      note.textContent = '✅ Message envoyé, merci !';
      form.reset();
    } else {
      note.textContent = '❌ Une erreur est survenue. Réessayez.';
    }
  } catch {
    note.textContent = '❌ Erreur réseau. Réessayez plus tard.';
  }
});
