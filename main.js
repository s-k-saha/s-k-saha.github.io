async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}
 
/* ── 2. RENDER: RESEARCH ──────────────────────────────────────────────────── */
 
function renderResearch(items) {
  const grid = document.querySelector('.research-grid');
  if (!grid) return;
 
  grid.innerHTML = items.map(item => `
    <article class="research-card">
      <span class="card-num">${escHtml(item.number)}</span>
      <h3>${escHtml(item.title)}</h3>
      <p>${escHtml(item.description)}</p>
    </article>
  `).join('');
}

/* ── 2. RENDER: SOFTWARES ──────────────────────────────────────────────────── */
 
function renderSoftwares(items) {
  const grid = document.querySelector('.softwares-grid');
  if (!grid) return;
 
  grid.innerHTML = items.map(item => `
    <a href=${escHtml(item.links)} target="_blank" class="article-link">
    <article class="softwares-card">
      <span class="card-num">${escHtml(item.number)}</span>
      <h3>${escHtml(item.title)}</h3>
      <p>${escHtml(item.description)}</p>
    </article>
    </a>
  `).join('');
}
 
/* ── 3. RENDER: PUBLICATIONS ──────────────────────────────────────────────── */
 
function renderPublications(items) {
  const list = document.getElementById('pubList');
  if (!list) return;
 
  // Sort newest first (descending year)
  const sorted = [...items].sort((a, b) => b.year - a.year);
 
  list.innerHTML = sorted.map(pub => {
    const isPreprint = pub.type === 'preprint';
 
    // Venue: italicise journal name for journal articles
    const venueHtml = isPreprint
      ? `${escHtml(pub.venue)} <span class="preprint-badge">Preprint</span>`
      : `<em>${escHtml(pub.venue)}</em>`;
 
    // Links
    const linksHtml = Object.entries(pub.links)
      .map(([label, url]) => `<a href="${escAttr(url)}">${escHtml(label)}</a>`)
      .join('');
 
    return `
      <li class="pub-item" data-type="${escAttr(pub.type)}">
        <span class="pub-year">${escHtml(String(pub.year))}</span>
        <div class="pub-body">
          <p class="pub-title">${escHtml(pub.title)}</p>
          <p class="pub-authors">${escHtml(pub.authors)}</p>
          <p class="pub-venue">${venueHtml}</p>
          <div class="pub-links">${linksHtml}</div>
        </div>
      </li>
    `;
  }).join('');
 
  // Re-apply any active filter after re-render
  applyFilter(document.querySelector('.filter-btn.active')?.dataset.filter ?? 'all');
}
 
/* ── 4. PUBLICATION FILTER ────────────────────────────────────────────────── */
 
function applyFilter(filter) {
  document.querySelectorAll('.pub-item').forEach(item => {
    item.style.display =
      filter === 'all' || item.dataset.type === filter ? '' : 'none';
  });
}
 
function initFilter() {
  document.getElementById('pubFilter')?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
}


/* ── 5. NAV TOGGLE ────────────────────────────────────────────────────────── */
 
function initNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  
  // Close menu when a link is clicked (mobile)
  links?.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
}
 
/* ── 6. DARK / LIGHT THEME TOGGLE ─────────────────────────────────────────── */
 
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');
  if (stored === 'dark') document.documentElement.classList.add('dark');
 
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

 
/* ── 7. HELPERS ───────────────────────────────────────────────────────────── */
 
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escAttr(str) { return escHtml(str); }
 
/* ── 8. BOOT ──────────────────────────────────────────────────────────────── */
 
document.addEventListener('DOMContentLoaded', async () => {
  initNav();
  initTheme();
  initFilter();
 
  try {
    const [research, publications, softwares] = await Promise.all([
      loadJSON('research.json'),
      loadJSON('publications.json'),
      loadJSON('softwares.json'),
    ]);
    renderResearch(research);
    renderPublications(publications);
    renderSoftwares(softwares);
  } catch (err) {
    console.error('Could not load data files:', err);
  }
});


/* main.js — portfolio interactions */

(function () {
  'use strict';

  /* ── Dark mode (persisted) ─────────────────────────────── */
  const root        = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  // Apply saved preference immediately (before paint)
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    const next   = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ── NAV scroll shadow ─────────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu toggle ────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  /* ── Active nav link on scroll ─────────────────────────── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAs    = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAs.forEach(a => {
            a.style.color = a.getAttribute('href') === '#' + entry.target.id
              ? 'var(--ink)'
              : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ── Publication filter ────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubItems   = document.querySelectorAll('.pub-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const f = btn.dataset.filter;
      pubItems.forEach(item => {
        const show = f === 'all' || item.dataset.type === f;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  /* ── Scroll reveal ─────────────────────────────────────── */
  // Add reveal class to target elements
  const revealTargets = [
    '.section-title',
    '.about-grid',
    '.research-card',
    '.pub-item',
    '.cv-entry',
    '.cv-heading',
    '.cv-download',
    '.contact-intro',
    '.contact-item',
  ];
  revealTargets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // stagger siblings slightly
      el.style.transitionDelay = `${(i % 4) * 0.07}s`;
    });
  });

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

})();
