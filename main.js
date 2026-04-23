/* main.js — portfolio interactions */

(function () {
  'use strict';

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
