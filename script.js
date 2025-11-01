// Enhanced Liquid glass animations + dynamic smooth interactions
document.addEventListener('DOMContentLoaded', () => {
  const learnBtn = document.getElementById('learnBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const moreInfo = document.getElementById('moreInfo');
  const watchBtn = document.getElementById('watchBtn');
  const hero = document.getElementById('hero');
  const home = document.getElementById('home');
  const bg = document.getElementById('bg');

  // SVG turbulence elements for multi-layer liquid
  const turb = document.getElementById('turb');
  const turb2 = document.getElementById('turb2');

  // Mouse/touch position for reactive displacement
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let waveOffsetX = 0;
  let waveOffsetY = 0;

  // Subtle idle wave animation (oscillate baseFrequency) + cursor reactivity
  let start = performance.now();
  function idleWave(t) {
    const elapsed = (t - start) / 1000;
    const bfX = 0.009 + Math.sin(elapsed * 0.6) * 0.002 + (waveOffsetX * 0.001);
    const bfY = 0.018 + Math.cos(elapsed * 0.5) * 0.003 + (waveOffsetY * 0.001);
    if (turb) turb.setAttribute('baseFrequency', bfX.toFixed(4) + ' ' + bfY.toFixed(4));
    if (turb2) turb2.setAttribute('baseFrequency', (0.05 + Math.sin(elapsed * 0.8) * 0.01).toFixed(3) + ' ' + (0.08 + Math.cos(elapsed * 0.7) * 0.015).toFixed(3));
    requestAnimationFrame(idleWave);
  }
  requestAnimationFrame(idleWave);

  // Update wave offsets based on cursor (smooth damping)
  function updateWaveOffsets() {
    waveOffsetX += (mouseX / window.innerWidth - 0.5) * 0.02; // Damped
    waveOffsetY += (mouseY / window.innerHeight - 0.5) * 0.02;
    waveOffsetX *= 0.95; // Decay for smoothness
    waveOffsetY *= 0.95;
  }
  setInterval(updateWaveOffsets, 16); // ~60fps

  // Cursor/touch tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  document.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  // Create ripple inside a glass element at (x,y)
  function createRipple(el, x, y) {
    const rect = el.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 0.25;
    r.style.width = r.style.height = size + 'px';
    r.style.left = (x - rect.left - size / 2) + 'px';
    r.style.top = (y - rect.top - size / 2) + 'px';
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }

  // New: Trigger rainbow glow pulse on dynamic-glass elements
  function triggerGlow(el) {
    el.classList.add('pulse-glow');
    setTimeout(() => el.classList.remove('pulse-glow'), 2000);
  }

  // Run the main transition (hero -> home) with background pulse
  function runTransition() {
    if (hero.classList.contains('transitioning')) return;
    hero.classList.add('transitioning');
    // energetic small pulse to SVG displacement
    if (turb) {
      turb.setAttribute('baseFrequency', '0.03 0.04');
      setTimeout(() => turb.setAttribute('baseFrequency', '0.012 0.02'), 450);
    }
    // background zoom + pulse
    bg.classList.add('bg-animate');
    document.body.classList.add('body-pulse');

    // add ripple to hero glass and trigger glow
    const glass = hero.querySelector('.glass');
    createRipple(glass, window.innerWidth / 2, window.innerHeight / 2 - 60);
    triggerGlow(glass);

    setTimeout(() => {
      home.classList.add('visible');
      home.scrollIntoView({ behavior: 'smooth' });
    }, 650);

    setTimeout(() => {
      bg.classList.remove('bg-animate');
      document.body.classList.remove('body-pulse');
      hero.classList.remove('transitioning');
    }, 1500);
  }

  learnBtn.addEventListener('click', runTransition);
  learnMoreBtn.addEventListener('click', runTransition);

  watchBtn.addEventListener('click', () => {
    alert('Watch pages are coming soon. Site is under development.');
  });

  // wheel / swipe detection
  hero.addEventListener('wheel', (e) => {
    if (e.deltaY > 20) runTransition();
  }, { passive: true });

  let touchStartY = null;
  hero.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, { passive: true });
  hero.addEventListener('touchmove', (e) => {
    if (!touchStartY) return;
    const current = e.touches[0].clientY;
    if (touchStartY - current > 30) {
      runTransition();
      touchStartY = null;
    }
  }, { passive: true });

  // Add hover/interaction ripple to all glass elements (energetic ripple on hover)
  document.querySelectorAll('.glass').forEach(g => {
    g.addEventListener('pointerenter', (ev) => {
      createRipple(g, ev.clientX, ev.clientY);
      // momentarily increase turbulence for a stronger ripple feel
      if (turb) {
        turb.setAttribute('baseFrequency', '0.02 0.03');
        setTimeout(() => turb.setAttribute('baseFrequency', '0.012 0.02'), 380);
      }
      if (g.classList.contains('dynamic-glass')) triggerGlow(g);
    });
    // also create ripple on click/tap
    g.addEventListener('pointerdown', (ev) => {
      createRipple(g, ev.clientX, ev.clientY);
      if (g.classList.contains('dynamic-glass')) triggerGlow(g);
    });
  });

  // Learn More button (navbar) toggles more-info visibility as well
  const navLearn = document.getElementById('learnBtn');
  navLearn.addEventListener('click', () => {
    // if already visible, just scroll
    if (!moreInfo.classList.contains('hidden')) {
      moreInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // show the more-info panel (keeps liquid effect)
      moreInfo.classList.remove('hidden');
      // small ripple on the moreInfo panel
      setTimeout(() => {
        const el = document.getElementById('moreInfo');
        createRipple(el, el.getBoundingClientRect().left + 60, el.getBoundingClientRect().top + 40);
        triggerGlow(el);
      }, 150);
    }
  });
});

/* ---------- Existing + New: cinematic soft animations (particles, damped parallax, waves, reveal, sakura) ---------- */
(function () {
  // Existing Particles - soft drifting orbs
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpi = Math.max(1, window.devicePixelRatio || 1);
    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpi);
      canvas.height = Math.floor(h * dpi);
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    }
    const colors = ['rgba(120,200,255,0.12)', 'rgba(120,200,255,0.09)', 'rgba(160,225,255,0.06)'];
    const count = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 90000));
    const particles = [];
    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 6 + Math.random() * 18,
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.2) * 0.12,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 40 + Math.random() * 140,
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy + Math.sin((p.phase += 0.005)) * 0.12;
        p.life -= 0.03;
        if (p.x < -50) p.x = w + 50;
        if (p.x > w + 50) p.x = -50;
        if (p.y < -80) p.y = h + 80;
        if (p.y > h + 80) p.y = -80;
        const g = ctx.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r * 1.2);
        g.addColorStop(0, p.color.replace('0.12', '0.35').replace('0.09', '0.28'));
        g.addColorStop(0.6, p.color);
        g.addColorStop(1, 'rgba(120,200,255,0)');
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    let raf = null;
    function animate() {
      draw();
      raf = requestAnimationFrame(animate);
    }
    function onResize() {
      resize();
      initParticles();
    }
    window.addEventListener('resize', onResize, { passive: true });
    onResize();
    animate();

    // gentle fade when switching to mobile/hidden tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { canvas.style.opacity = 0.45; cancelAnimationFrame(raf); }
      else { canvas.style.opacity = 0.95; animate(); }
    });
  }

  // New: Sakura-like floating particles (anime petals/orbs)
  const sakuraCanvas = document.getElementById('sakura-canvas');
  if (sakuraCanvas) {
    const sCtx = sakuraCanvas.getContext('2d');
    let sw = 0, sh = 0, sdpi = Math.max(1, window.devicePixelRatio || 1);
    function sResize() {
      sw = sakuraCanvas.clientWidth;
      sh = sakuraCanvas.clientHeight;
      sakuraCanvas.width = Math.floor(sw * sdpi);
      sakuraCanvas.height = Math.floor(sh * sdpi);
      sCtx.setTransform(sdpi, 0, 0, sdpi, 0, 0);
    }
    const sakuraCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 150000));
    const sakuraParticles = [];
    function initSakura() {
      sakuraParticles.length = 0;
      for (let i = 0; i < sakuraCount; i++) {
        sakuraParticles.push({
          x: Math.random() * sw,
          y: Math.random() * sh - sh, // Start above screen
          r: 3 + Math.random() * 8,
          vx: (Math.random() - 0.5) * 0.3,
          vy: 0.5 + Math.random() * 0.8, // Fall down
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.05,
          color: `hsl(${Math.random() * 60 + 300}, 70%, 80%)`, // Pastel pinks/purples
          life: 200 + Math.random() * 300,
          wave: Math.random() * Math.PI * 2
        });
      }
    }
    function sDraw() {
      if (!sCtx) return;
      sCtx.clearRect(0, 0, sw, sh);
      sakuraParticles.forEach(p => {
        p.x += p.vx + Math.sin(p.wave += 0.02) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life -= 1;
        if (p.y > sh + 50 || p.life <= 0) {
          p.y = -50;
          p.x = Math.random() * sw;
          p.life = 200 + Math.random() * 300;
        }
        sCtx.save();
        sCtx.translate(p.x, p.y);
        sCtx.rotate(p.rotation);
        const g = sCtx.createRadialGradient(0, 0, 0, 0, 0, p.r);
        g.addColorStop(0, p.color);
        g.addColorStop(1, `${p.color}00`);
        sCtx.fillStyle = g;
        sCtx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 2); // Petal shape approx
        sCtx.restore();
      });
    }
    let sRaf = null;
    function sAnimate() {
      sDraw();
      sRaf = requestAnimationFrame(sAnimate);
    }
    function sOnResize() {
      sResize();
      initSakura();
    }
    window.addEventListener('resize', sOnResize, { passive: true });
    sOnResize();
    sAnimate();
  }

  // Enhanced Parallax - damped inertia for smoothness
  (function () {
    const bg = document.getElementById('bg');
    const parallaxEls = Array.from(document.querySelectorAll('.glass, .hero-inner, .card'));
    let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    let velocityX = 0, velocityY = 0; // For damping
    const damping = 0.12; // Smooth inertia

    function handleMove(e) {
      const clientX = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || cx;
      const clientY = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || cy;
      const targetX = (clientX - cx) / cx; // -1 .. 1
      const targetY = (clientY - cy) / cy;
      velocityX += (targetX - velocityX) * damping;
      velocityY += (targetY - velocityY) * damping;
      const px = velocityX;
      const py = velocityY;
      // background gentle translate and scale
      if (bg) {
        const moveX = px * 6;
        const moveY = py * 6;
        bg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.02)`;
      }
      // glass elements slight parallax with inertia
      parallaxEls.forEach((el, i) => {
        const depth = 6 + (i % 4);
        const tx = px * depth * 0.6;
        const ty = py * depth * 0.45;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    }
    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    // reset on leave
    window.addEventListener('pointerleave', () => {
      if (bg) bg.style.transform = '';
      parallaxEls.forEach(el => el.style.transform = '');
      velocityX = velocityY = 0;
    });
  })();

  // Wave animate class toggle
  const heroEl = document.getElementById('hero');
  const heroWave = document.getElementById('hero-wave');
  if (heroEl && heroWave) {
    setTimeout(() => heroWave.classList.add('wave-animate'), 120);
    // slow modulate opacity for cinematic breathing
    let up = true;
    setInterval(() => {
      heroWave.style.opacity = (up ? 0.20 : 0.14);
      up = !up;
    }, 4200);
  }

  // Text reveal on load
  function revealText() {
    const wrapper = document.querySelector('main#hero .hero-inner') || document.body;
    wrapper.classList.add('revealed');
    // also ensure small sheen on glass elements
    document.querySelectorAll('.glass').forEach((g, i) => {
      setTimeout(() => g.classList.add('parallax'), 40 * i);
    });
  }
  // trigger after a short delay so other scripts (like liquid) feel connected
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(revealText, 340);
  } else {
    document.addEventListener('DOMContentLoaded', () => setTimeout(revealText, 340));
  }

})();
