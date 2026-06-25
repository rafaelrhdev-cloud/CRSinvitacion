/* ════════════════════════════════════════════════════════
   Colegio Real de Santiago · Graduación 2025
   main.js
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

  (function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .detail-card, .rsvp-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(2.2)';
      ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
      ring.style.opacity   = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      ring.style.transform = 'translate(-50%,-50%) scale(1)';
      ring.style.opacity   = '0.6';
    });
  });

  /* ── CANVAS PARTÍCULAS (fixed = toda la página) ────── */
  const canvas = document.getElementById('particles');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor(init) { this.reset(init); }
    reset(init = false) {
      this.x          = Math.random() * canvas.width;
      this.y          = init ? Math.random() * canvas.height : canvas.height + 10;
      this.size       = Math.random() * 2.2 + 0.4;
      this.speedY     = -(Math.random() * 0.38 + 0.12);
      this.speedX     = (Math.random() - 0.5) * 0.28;
      this.opacity    = 0;
      this.maxOpacity = Math.random() * 0.5 + 0.14;
      this.life       = 0;
      this.maxLife    = Math.random() * 420 + 180;
      this.isGold     = Math.random() > 0.42;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      const fade = 70;
      if (this.life < fade)
        this.opacity = (this.life / fade) * this.maxOpacity;
      else if (this.life > this.maxLife - fade)
        this.opacity = ((this.maxLife - this.life) / fade) * this.maxOpacity;
      else
        this.opacity = this.maxOpacity;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.isGold) {
        ctx.fillStyle   = '#c9a84c';
        ctx.shadowColor = '#e8c96a';
        ctx.shadowBlur  = 5;
      } else {
        ctx.fillStyle   = 'rgba(180,200,255,0.9)';
        ctx.shadowColor = 'rgba(200,220,255,0.7)';
        ctx.shadowBlur  = 3;
      }
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const particles = Array.from({ length: 65 }, (_, i) => new Particle(i < 30));

  (function renderParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(renderParticles);
  })();

  /* ══════════════════════════════════════════════════════
     BIRRETES — Caída real por toda la VIEWPORT (fixed)
     Se crean en el <body>, position:fixed, coordenadas
     de pantalla. Sin overflow:hidden que los corte.
     ══════════════════════════════════════════════════════ */
  function spawnCap() {
    const cap = document.createElement('div');

    // Posición inicial: X aleatoria en toda la pantalla, Y fuera del top
    const startX  = Math.random() * window.innerWidth;
    const size    = Math.random() * 20 + 16;           // 16–36px
    const dur     = Math.random() * 6 + 7;             // 7–13s
    const rotEnd  = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 300 + 120);
    const drift   = (Math.random() - 0.5) * 120;       // deriva horizontal px

    cap.textContent = '🎓';

    Object.assign(cap.style, {
      position:   'fixed',
      top:        '-50px',
      left:       startX + 'px',
      fontSize:   size + 'px',
      opacity:    '0',
      zIndex:     '3',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
      transition: 'none',
    });

    document.body.appendChild(cap);

    // Animación con requestAnimationFrame para caída suave
    const startTime = performance.now();
    const totalDist = window.innerHeight + 80; // px a recorrer

    function fall(now) {
      const elapsed = (now - startTime) / 1000; // segundos
      const progress = elapsed / dur;            // 0 → 1

      if (progress >= 1) {
        cap.remove();
        return;
      }

      // Easing suave (ease-in ligero)
      const eased = progress * progress * 0.3 + progress * 0.7;

      const y   = -50 + eased * totalDist;
      const rot = eased * rotEnd;
      const x   = startX + eased * drift;

      // Fade in primero 10%, fade out último 10%
      let alpha;
      if (progress < 0.10)       alpha = progress / 0.10 * 0.8;
      else if (progress > 0.85)  alpha = (1 - progress) / 0.15 * 0.8;
      else                       alpha = 0.8;

      cap.style.opacity   = alpha;
      cap.style.transform = `translate(${x - startX}px, ${y}px) rotate(${rot}deg)`;

      requestAnimationFrame(fall);
    }

    requestAnimationFrame(fall);
  }

  // Lanza los primeros 12 con delays escalonados para que no aparezcan todos juntos
  for (let i = 0; i < 12; i++) {
    setTimeout(spawnCap, i * 400);
  }
  // Continúa lanzando uno nuevo cada 1.4s
  setInterval(spawnCap, 1400);

  /* ── NAV SCROLL ───────────────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── NAV BURGER (MOBILE) ──────────────────────────── */
  const burger   = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  /* ── REVEAL ON SCROLL ─────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.revealDelay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.revealDelay = (i % 4) * 100;
    revealObserver.observe(el);
  });

  /* ── TILT 3D EN INVITE CARDS ──────────────────────── */
  document.querySelectorAll('.invite-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 12;
      card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.015)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── SMOOTH ANCHOR CON OFFSET ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── COUNTDOWN AL 1 JULIO 2025 ────────────────────── */
  const targetDate = new Date('2025-07-01T19:00:00');
  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const diff = targetDate - new Date();
    const el   = document.getElementById('countdown');
    if (!el) return;

    if (diff <= 0) {
      el.innerHTML = '<span style="min-width:auto;padding:12px 24px;font-size:1.2rem">🎓 ¡Hoy es el gran día!</span>';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    el.innerHTML =
      `<span>${pad(days)}<small>días</small></span>
       <span>${pad(hours)}<small>hrs</small></span>
       <span>${pad(mins)}<small>min</small></span>
       <span>${pad(secs)}<small>seg</small></span>`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

});
