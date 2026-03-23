/* ========================================
   DSL Hackathon Series — JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Pixel Cursor + Ring Follower + Trail ----------
  const pixelCursor = document.getElementById('cursorPixel');
  const cursor = document.getElementById('cursorFollower');
  const trailContainer = document.getElementById('cursorTrailContainer');
  let cursorX = 0, cursorY = 0;
  let ringX = 0, ringY = 0;
  const trailDots = [];
  const TRAIL_COUNT = 12;
  let trailPositions = [];

  // Create trail dots
  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.width = (3 - i * 0.15) + 'px';
    dot.style.height = (3 - i * 0.15) + 'px';
    trailContainer.appendChild(dot);
    trailDots.push(dot);
    trailPositions.push({ x: 0, y: 0 });
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    cursor.classList.add('active');

    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Pixel cursor follows exactly
      pixelCursor.style.left = cursorX + 'px';
      pixelCursor.style.top = cursorY + 'px';
    });

    function animateCursorSystem() {
      // Ring follows with less lag — more responsive
      ringX += (cursorX - ringX) * 0.25;
      ringY += (cursorY - ringY) * 0.25;
      cursor.style.left = ringX + 'px';
      cursor.style.top = ringY + 'px';

      // Trail dots follow with cascading lag
      for (let i = trailDots.length - 1; i >= 0; i--) {
        const target = i === 0 ? { x: cursorX, y: cursorY } : trailPositions[i - 1];
        trailPositions[i].x += (target.x - trailPositions[i].x) * (0.25 - i * 0.015);
        trailPositions[i].y += (target.y - trailPositions[i].y) * (0.25 - i * 0.015);
        trailDots[i].style.left = trailPositions[i].x + 'px';
        trailDots[i].style.top = trailPositions[i].y + 'px';
        trailDots[i].style.opacity = 0.5 - (i / TRAIL_COUNT) * 0.45;
      }

      requestAnimationFrame(animateCursorSystem);
    }
    animateCursorSystem();

    // Hover effect on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .edition-card, .about__card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        pixelCursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        pixelCursor.classList.remove('hover');
      });
    });

    // Click burst effect
    document.addEventListener('click', (e) => {
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: 3px;
          height: 3px;
          background: #C0AE7F;
          pointer-events: none;
          z-index: 9999;
          image-rendering: pixelated;
          box-shadow: 0 0 6px rgba(192, 174, 127, 0.8);
        `;
        document.body.appendChild(spark);

        const angle = (Math.PI * 2 / 6) * i;
        const speed = 40 + Math.random() * 30;
        const tx = Math.cos(angle) * speed;
        const ty = Math.sin(angle) * speed;

        spark.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], { duration: 500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' })
          .onfinish = () => spark.remove();
      }
    });
  }

  // ---------- Header Scroll ----------
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('scrolled', scrollY > 80);
    lastScroll = scrollY;
  }, { passive: true });

  // ---------- Mobile Menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('.stats__number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }

    requestAnimationFrame(update);
  }

  // ---------- Hero Canvas — Particle Network ----------
  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0, mouseY = 0;
  let animationId;

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 0.5;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Pulsing opacity
      this.currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(performance.now() * this.pulseSpeed + this.pulseOffset));

      // Mouse interaction — stronger repulsion
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.025;
        this.vx -= dx * force;
        this.vy -= dy * force;
      }

      // Damping
      this.vx *= 0.999;
      this.vy *= 0.999;

      // Wrap around
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      // Pixel-style square particles for hacker aesthetic
      const size = this.radius * 2;
      ctx.fillStyle = `rgba(192, 174, 127, ${this.currentOpacity || this.opacity})`;
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), size, size);
      // Glow effect
      ctx.shadowColor = 'rgba(192, 174, 127, 0.3)';
      ctx.shadowBlur = 8;
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), size, size);
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const alpha = 0.12 * (1 - dist / 150);
          ctx.beginPath();
          ctx.moveTo(Math.floor(particles[i].x), Math.floor(particles[i].y));
          ctx.lineTo(Math.floor(particles[j].x), Math.floor(particles[j].y));
          ctx.strokeStyle = `rgba(192, 174, 127, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw connections to mouse position — hacker grid effect
    if (mouseX > 0 && mouseY > 0) {
      particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          ctx.beginPath();
          ctx.moveTo(Math.floor(mouseX), Math.floor(mouseY));
          ctx.lineTo(Math.floor(p.x), Math.floor(p.y));
          ctx.strokeStyle = `rgba(192, 174, 127, ${0.2 * (1 - dist / 200)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  initParticles();
  animate();

  // Reinit particles on resize
  window.addEventListener('resize', () => {
    initParticles();
  });

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Background Music Toggle ----------
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const iconOn = musicToggle?.querySelector('.music-icon-on');
  const iconOff = musicToggle?.querySelector('.music-icon-off');
  let musicPlaying = false;

  function startMusic() {
    if (musicPlaying) return;
    bgMusic.play().then(() => {
      musicPlaying = true;
      iconOn.style.display = 'block';
      iconOff.style.display = 'none';
    }).catch(() => {});
  }

  if (musicToggle && bgMusic) {
    bgMusic.volume = 0.3;

    // Try autoplay immediately
    startMusic();

    // Fallback: play on first user interaction (browser autoplay policy)
    const autoplayEvents = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    function onFirstInteraction() {
      startMusic();
      autoplayEvents.forEach(e => document.removeEventListener(e, onFirstInteraction));
    }
    autoplayEvents.forEach(e => document.addEventListener(e, onFirstInteraction, { once: false }));

    musicToggle.addEventListener('click', () => {
      if (musicPlaying) {
        bgMusic.pause();
        musicPlaying = false;
        iconOn.style.display = 'none';
        iconOff.style.display = 'block';
      } else {
        bgMusic.play();
        musicPlaying = true;
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';
      }
    });
  }

});
