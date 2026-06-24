/* ════════════════════════════════════════════════════════
   Colegio Real de Santiago · Graduación 2025
   main.js — Partículas, cursor, animaciones, birretes
   ════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR PERSONALIZADO ─────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .detail-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.5)';
      ring.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity   = '0.6';
    });
  });

  /* ── CANVAS PARTÍCULAS ────────────────────────────── */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const NUM_PARTICLES = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }

    reset(init = false) {
      this.x    = Math.random() * canvas.width;
      this.y    = init ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.55 + 0.15;
      this.life = 0;
      this.maxLife = Math.random() * 400 + 200;
      // Gold or blue-white
      this.isGold = Math.random() > 0.45;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      const half = this.maxLife / 2;
      if (this.life < 60)       this.opacity = (this.life / 60) * this.maxOpacity;
      else if (this.life > this.maxLife - 60)
                                 this.opacity = ((this.maxLife - this.life) / 60) * this.maxOpacity;
      else                       this.opacity = this.maxOpacity;
      if (this.life >= this.maxLife) this.reset();
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isGold) {
        ctx.fillStyle = '#c9a84c';
        ctx.shadowColor = '#e8c96a';
        ctx.shadowBlur  = 6;
      } else {
        ctx.fillStyle = 'rgba(180, 200, 255, 0.9)';
        ctx.shadowColor = 'rgba(200,220,255,0.8)';
        ctx.shadowBlur  = 4;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < NUM_PARTICLES; i++) particles.push(new Particle());

  function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(renderParticles);
  }
  renderParticles();

  /* ── BIRRETES CAYENDO EN HERO ─────────────────────── */
  const capsContainer = document.getElementById('caps');
  const CAP_EMOJIS = ['🎓'];

  function spawnCap() {
    const cap = document.createElement('div');
    cap.classList.add('cap');
    cap.textContent = CAP_EMOJIS[0];
    cap.style.left     = Math.random() * 100 + '%';
    cap.style.top      = '-60px';
    cap.style.fontSize = (Math.random() * 20 + 20) + 'px';
    const dur = Math.random() * 6 + 6;
    const delay = Math.random() * 4;
    cap.style.animationDuration = dur + 's';
    cap.style.animationDelay   = delay + 's';
    capsContainer.appendChild(cap);
    setTimeout(() => cap.remove(), (dur + delay) * 1000);
  }

  for (let i = 0; i < 8; i++) spawnCap();
  setInterval(spawnCap, 1800);

  /* ── NAV SCROLL ───────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── NAV BURGER (MOBILE) ──────────────────────────── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /* ── REVEAL ON SCROLL ─────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 3) * 120;
    revealObserver.observe(el);
  });

  /* ── STAGGER PARA DETAIL CARDS ───────────────────── */
  document.querySelectorAll('.details-grid').forEach(grid => {
    grid.querySelectorAll('.detail-card').forEach((card, i) => {
      card.style.transitionDelay = (i * 100) + 'ms';
    });
  });

  /* ── GLITTER en INVITE CARDS ──────────────────────── */
  document.querySelectorAll('.invite-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── EFECTO SHINE en DATE-PILLS ──────────────────── */
  document.querySelectorAll('.date-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.boxShadow = '0 16px 40px rgba(201,168,76,0.35)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.boxShadow = '';
    });
  });

  /* ── COUNTER COUNTDOWN (opcional, días para el 1 julio) ── */
  const target = new Date('2025-07-01T19:00:00');
  function updateCountdown() {
    const now  = new Date();
    const diff = target - now;
    if (diff <= 0) return;
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById('countdown');
    if (el) {
      el.innerHTML =
        `<span>${days}<small>días</small></span>
         <span>${hours}<small>hrs</small></span>
         <span>${mins}<small>min</small></span>
         <span>${secs}<small>seg</small></span>`;
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* ── SMOOTH ANCHOR WITH OFFSET ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

});
