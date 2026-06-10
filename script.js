(function() {
  'use strict';

  // ==========================================
  // PAGE LOADER
  // ==========================================
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
    }, 1800);
  });

  // Fallback — if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      if (loader) loader.classList.add('loaded');
    }, 1800);
  }

  // ==========================================
  // CUSTOM CURSOR
  // ==========================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      followerX += (mouseX - followerX) * 0.08;
      followerY += (mouseY - followerY) * 0.08;

      cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
      follower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .work__card, input, textarea');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor--hover');
        follower.classList.add('cursor-follower--hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor--hover');
        follower.classList.remove('cursor-follower--hover');
      });
    });
  }

  // ==========================================
  // HERO — Interactive Particle System
  // ==========================================
  const heroCanvas = document.getElementById('hero-canvas');

  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height;
    let particles = [];
    const heroMouse = { x: null, y: null };
    const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 70;
    const CONNECTION_DIST = 120;
    const MOUSE_RADIUS = 150;

    function resizeCanvas() {
      const hero = heroCanvas.parentElement;
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      heroCanvas.width = width;
      heroCanvas.height = height;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.15
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Fill background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce at edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Keep in bounds
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        // Mouse repulsion
        if (heroMouse.x !== null) {
          const dx = p.x - heroMouse.x;
          const dy = p.y - heroMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.x += dx * force * 0.03;
            p.y += dy * force * 0.03;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawParticles);
    }

    heroCanvas.addEventListener('mousemove', (e) => {
      const rect = heroCanvas.getBoundingClientRect();
      heroMouse.x = e.clientX - rect.left;
      heroMouse.y = e.clientY - rect.top;
    });

    heroCanvas.addEventListener('mouseleave', () => {
      heroMouse.x = null;
      heroMouse.y = null;
    });

    resizeCanvas();
    createParticles();
    drawParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resizeCanvas();
        createParticles();
      }, 200);
    });
  }

  // ==========================================
  // 3D TILT CARD
  // ==========================================
  const tiltCard = document.getElementById('tilt-card');
  const cardSheen = document.getElementById('card-sheen');

  if (tiltCard) {
    const MAX_TILT = 12; // degrees

    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * MAX_TILT;
      const rotateX = ((centerY - y) / centerY) * MAX_TILT;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      // Move sheen
      if (cardSheen) {
        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;
        cardSheen.style.setProperty('--mouse-x', `${percentX}%`);
        cardSheen.style.setProperty('--mouse-y', `${percentY}%`);
      }
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  }

  // ==========================================
  // MAGNETIC BUTTONS
  // ==========================================
  const magneticElements = document.querySelectorAll('.magnetic');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => {
        el.style.transition = '';
      }, 500);
    });
  });

  // ==========================================
  // SCROLL REVEAL (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // ==========================================
  // COUNT-UP ANIMATION
  // ==========================================
  const statNums = document.querySelectorAll('.stat__num[data-count]');

  if (statNums.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          const duration = 2000;
          const startTime = performance.now();

          function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quint
            const eased = 1 - Math.pow(1 - progress, 5);
            const current = Math.round(eased * target);

            el.textContent = current;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }

          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => countObserver.observe(el));
  }

  // ==========================================
  // HAMBURGER / MOBILE MENU
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // NAV VISIBILITY ON SCROLL
  // ==========================================
  const nav = document.getElementById('nav');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      nav.style.opacity = currentScrollY > lastScrollY ? '0' : '1';
    } else {
      nav.style.opacity = '1';
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // ==========================================
  // SCROLL INDICATOR FADE
  // ==========================================
  const scrollIndicator = document.getElementById('scroll-indicator');

  window.addEventListener('scroll', () => {
    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 300);
    }
  }, { passive: true });

  // ==========================================
  // CONTACT FORM — AJAX + TOAST
  // ==========================================
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  const submitBtn = document.getElementById('form-submit');

  function showToast(message, isError) {
    if (!toast) return;

    toastMessage.textContent = message;
    toast.classList.remove('toast--error');

    if (isError) {
      toast.classList.add('toast--error');
      toastIcon.textContent = '✕';
    } else {
      toastIcon.textContent = '✓';
    }

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4200);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (submitBtn) submitBtn.classList.add('loading');

      const formData = new FormData(form);

      try {
        const response = await fetch('https://formspree.io/f/mykvpnve', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          showToast("Message sent! I'll get back to you soon.", false);
          form.reset();
        } else {
          showToast('Something went wrong. Please try again.', true);
        }
      } catch (error) {
        showToast('Network error. Please check your connection.', true);
      } finally {
        if (submitBtn) submitBtn.classList.remove('loading');
      }
    });
  }

})();