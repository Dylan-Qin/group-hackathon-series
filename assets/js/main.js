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
      const light = isLightTheme();
      const color = light ? '#9a8a5a' : '#C0AE7F';
      const glowColor = light ? 'rgba(154, 138, 90, 0.8)' : 'rgba(192, 174, 127, 0.8)';
      for (let i = 0; i < 6; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          width: 3px;
          height: 3px;
          background: ${color};
          pointer-events: none;
          z-index: 9999;
          image-rendering: pixelated;
          box-shadow: 0 0 6px ${glowColor};
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
  if (canvas) {
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
      const light = isLightTheme();
      const r = light ? 140 : 192, g = light ? 120 : 174, b = light ? 80 : 127;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.currentOpacity || this.opacity})`;
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), size, size);
      // Glow effect
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
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
    const light = isLightTheme();
    const r = light ? 140 : 192, g = light ? 120 : 174, b = light ? 80 : 127;
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
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.2 * (1 - dist / 200)})`;
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
  } // end if (canvas)

  // ---------- Smooth anchor scroll ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href.startsWith('#')) return; // skip cross-page links
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Theme Toggle ----------
  const themeToggle = document.getElementById('themeToggle');

  function getPreferredTheme() {
    return localStorage.getItem('theme') || 'dark';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  function isLightTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

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

  // ---------- Submit Project Modal ----------
  const submitBtn = document.getElementById('submitProjectBtn');
  const submitModal = document.getElementById('submitModal');
  const submitForm = document.getElementById('submitForm');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const toast = document.getElementById('toast');

  if (submitBtn && submitModal) {
    function openModal() {
      submitModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      submitModal.classList.remove('active');
      document.body.style.overflow = '';
      clearErrors();
    }

    function clearErrors() {
      submitForm.querySelectorAll('.form-input').forEach(el => el.classList.remove('error'));
    }

    function showToast(msg, isError) {
      toast.textContent = msg;
      toast.className = 'toast visible' + (isError ? ' error' : '');
      setTimeout(() => { toast.className = 'toast'; }, 3000);
    }

    submitBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);
    submitModal.addEventListener('click', (e) => {
      if (e.target === submitModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && submitModal.classList.contains('active')) closeModal();
    });

    submitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      const githubUrl = document.getElementById('githubUrl');
      const projectLead = document.getElementById('projectLead');
      const participants = document.getElementById('participants');
      const projectDesc = document.getElementById('projectDesc');
      let valid = true;

      // Validate GitHub URL
      const urlValue = githubUrl.value.trim();
      if (!urlValue || !urlValue.includes('github.com')) {
        githubUrl.classList.add('error');
        valid = false;
      } else {
        try { new URL(urlValue); } catch { githubUrl.classList.add('error'); valid = false; }
      }

      // Validate project lead
      if (!projectLead.value.trim()) {
        projectLead.classList.add('error');
        valid = false;
      }

      if (!valid) return;

      // Build GitHub Issue
      const title = `[Project Submission] ${projectLead.value.trim()} - Hackathon #1`;
      const bodyParts = [
        `## Project Submission`,
        ``,
        `**GitHub Repository:** ${urlValue}`,
        `**Project Lead:** ${projectLead.value.trim()}`,
      ];
      if (participants.value.trim()) {
        bodyParts.push(`**Participants:** ${participants.value.trim()}`);
      }
      if (projectDesc.value.trim()) {
        bodyParts.push(``, `### Description`, projectDesc.value.trim());
      }

      const issueUrl = `https://github.com/Dylan-Qin/group-hackathon-series/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(bodyParts.join('\n'))}`;

      window.open(issueUrl, '_blank');
      showToast('Redirected to GitHub — please confirm and submit the issue.');
      submitForm.reset();
      closeModal();
    });
  }

  // ---------- Project Carousel ----------
  const carouselTrack = document.getElementById('carouselTrack');
  const carouselFallback = document.getElementById('carouselFallback');

  if (carouselTrack) {
    fetch('../data/editions/1/submissions.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(submissions => {
        if (!submissions || submissions.length === 0) {
          carouselFallback.style.display = '';
          carouselTrack.style.display = 'none';
          return;
        }

        function cardHTML(s) {
          // Derive avatar from github_url owner if not enriched yet
          const urlParts = s.github_url.replace(/\/+$/, '').split('/');
          const owner = urlParts[urlParts.length - 2] || '';
          const avatarSrc = s.avatar_url || (owner ? `https://github.com/${owner}.png?size=72` : '');
          const repoName = s.repo_name || urlParts[urlParts.length - 1] || 'Project';
          const stars = s.stars != null ? s.stars : '--';
          const forks = s.forks != null ? s.forks : '--';
          const avatarEl = avatarSrc
            ? `<img class="project-card__avatar" src="${avatarSrc}" alt="" loading="lazy">`
            : '';

          return `
            <a class="project-card" href="${s.github_url}" target="_blank" rel="noopener">
              <div class="project-card__header">
                ${avatarEl}
                <div>
                  <div class="project-card__name">${repoName}</div>
                  <div class="project-card__lead">${s.project_lead}</div>
                </div>
              </div>
              ${s.participants ? `<div class="project-card__participants">${s.participants}</div>` : ''}
              <div class="project-card__stats">
                <span class="project-card__stat project-card__stat--gold">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>
                  ${stars}
                </span>
                <span class="project-card__stat">
                  <svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0zM5 3.25a.75.75 0 10-1.5 0 .75.75 0 001.5 0zm6.75.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z"/></svg>
                  ${forks}
                </span>
              </div>
            </a>`;
        }

        // Build cards — only scroll if more than 3 projects
        const cardsMarkup = submissions.map(cardHTML).join('');
        const shouldScroll = submissions.length > 3;

        if (shouldScroll) {
          carouselTrack.innerHTML = cardsMarkup + cardsMarkup;
          const duration = submissions.length * 8;
          carouselTrack.style.animationDuration = duration + 's';
        } else {
          carouselTrack.innerHTML = cardsMarkup;
          carouselTrack.style.animation = 'none';
          carouselTrack.style.justifyContent = 'center';
        }

        // Register cursor hover for dynamically added cards
        if (pixelCursor && cursor) {
          carouselTrack.querySelectorAll('.project-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
              cursor.classList.add('hover');
              pixelCursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
              cursor.classList.remove('hover');
              pixelCursor.classList.remove('hover');
            });
          });
        }
      })
      .catch(err => {
        console.warn('Could not load submissions:', err);
        if (carouselFallback) carouselFallback.style.display = '';
        carouselTrack.style.display = 'none';
      });
  }

});
