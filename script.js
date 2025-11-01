// Liquid glass animations + interactions
document.addEventListener('DOMContentLoaded', () => {
  const learnBtn = document.getElementById('learnBtn');
  const learnMoreBtn = document.getElementById('learnMoreBtn');
  const moreInfo = document.getElementById('moreInfo');
  const watchBtn = document.getElementById('watchBtn');
  const hero = document.getElementById('hero');
  const home = document.getElementById('home');
  const bg = document.getElementById('bg');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  // SVG turbulence element to animate subtle waves
  const turb = document.getElementById('turb');

  // Continuous idle wave animation for home screen
  let start = performance.now();
  let lastUpdate = 0;
  function idleWave(t) {
    const elapsed = (t - start) / 1000;
    if (t - lastUpdate > 100) {
      const bfX = 0.009 + Math.sin(elapsed * 0.8) * 0.003;
      const bfY = 0.018 + Math.cos(elapsed * 0.6) * 0.004;
      if (turb) turb.setAttribute('baseFrequency', bfX.toFixed(4) + ' ' + bfY.toFixed(4));
      lastUpdate = t;
    }
    if (hero.getBoundingClientRect().top <= window.innerHeight) { // Run only when hero is visible
      requestAnimationFrame(idleWave);
    }
  }
  requestAnimationFrame(idleWave);

  // Create ripple inside a glass element at (x,y)
  function createRipple(el, x, y){
    const rect = el.getBoundingClientRect();
    const r = document.createElement('span');
    r.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 0.25;
    r.style.width = r.style.height = size + 'px';
    r.style.left = (x - rect.left - size/2) + 'px';
    r.style.top = (y - rect.top - size/2) + 'px';
    el.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }

  // Run the main transition (hero -> home) with background ripple
  function runTransition(){
    if(hero.classList.contains('transitioning')) return;
    hero.classList.add('transitioning');
    if(turb){
      turb.setAttribute('baseFrequency', '0.03 0.04');
      setTimeout(() => turb.setAttribute('baseFrequency', '0.012 0.02'), 450);
    }
    bg.classList.add('bg-animate');
    document.body.classList.add('body-pulse');

    const glass = hero.querySelector('.glass');
    createRipple(glass, window.innerWidth/2, window.innerHeight/2 - 60);

    setTimeout(() => {
      home.classList.add('visible');
      home.scrollIntoView({behavior:'smooth'});
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

  hero.addEventListener('wheel', e => {
    if(e.deltaY > 20) runTransition();
  }, {passive:true});

  let touchStartY=null;
  hero.addEventListener('touchstart', e => {touchStartY=e.touches[0].clientY;}, {passive:true});
  hero.addEventListener('touchmove', e => {
    if(!touchStartY) return;
    const current = e.touches[0].clientY;
    if(touchStartY - current > 30){
      runTransition();
      touchStartY=null;
    }
  }, {passive:true});

  document.querySelectorAll('.glass').forEach(g => {
    g.addEventListener('pointerenter', (ev) => {
      createRipple(g, ev.clientX, ev.clientY);
      if(turb){
        turb.setAttribute('baseFrequency', '0.02 0.03');
        setTimeout(() => turb.setAttribute('baseFrequency', '0.012 0.02'), 380);
      }
    });
    g.addEventListener('pointerdown', (ev) => createRipple(g, ev.clientX, ev.clientY));
  });

  const navLearn = document.getElementById('learnBtn');
  navLearn.addEventListener('click', () => {
    if(!moreInfo.classList.contains('hidden')){
      moreInfo.scrollIntoView({behavior:'smooth', block:'center'});
    } else {
      moreInfo.classList.remove('hidden');
      setTimeout(() => {
        const el = document.getElementById('moreInfo');
        createRipple(el, el.getBoundingClientRect().left + 60, el.getBoundingClientRect().top + 40);
      }, 150);
    }
  });

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
      } else {
        document.exitFullscreen();
      }
    });
  }
});

/* ---------- Added: cinematic soft animations (particles, parallax, waves, reveal) ---------- */
(function(){
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w=0, h=0, dpi = Math.max(1, window.devicePixelRatio || 1);
    function resize(){
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpi);
      canvas.height = Math.floor(h * dpi);
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    }
    const colors = ['rgba(120,200,255,0.12)','rgba(120,200,255,0.09)','rgba(160,225,255,0.06)'];
    const count = Math.min(40, Math.floor((window.innerWidth*window.innerHeight)/120000));
    const particles = [];
    function initParticles(){
      particles.length = 0;
      for(let i=0;i<count;i++){
        particles.push({
          x: Math.random()*w,
          y: Math.random()*h,
          r: 6 + Math.random()*18,
          vx: (Math.random()-0.5)*0.08,
          vy: (Math.random()-0.2)*0.12,
          color: colors[Math.floor(Math.random()*colors.length)],
          life: 40 + Math.random()*140,
          phase: Math.random()*Math.PI*2
        });
      }
    }
    function draw(){
      if(!ctx) return;
      ctx.clearRect(0,0,w,h);
      particles.forEach(p=>{
        p.x += p.vx;
        p.y += p.vy + Math.sin((p.phase += 0.005))*0.12;
        p.life -= 0.03;
        if(p.x < -50) p.x = w + 50;
        if(p.x > w + 50) p.x = -50;
        if(p.y < -80) p.y = h + 80;
        if(p.y > h + 80) p.y = -80;
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
    }
    let raf = null;
    let lastFrame = 0;
    function animate(t) {
      if (t - lastFrame > 33) {
        draw();
        lastFrame = t;
      }
      if (document.getElementById('hero').getBoundingClientRect().top <= window.innerHeight) { // Run only when hero is visible
        raf = requestAnimationFrame(animate);
      }
    }
    function onResize(){
      resize();
      initParticles();
    }
    window.addEventListener('resize', onResize, {passive:true});
    onResize();
    animate(performance.now());

    document.addEventListener('visibilitychange', () => {
      if(document.hidden){ canvas.style.opacity = 0.45; cancelAnimationFrame(raf); }
      else { canvas.style.opacity = 0.95; animate(performance.now()); }
    });
  }

  (function(){
    const bg = document.getElementById('bg');
    const parallaxEls = Array.from(document.querySelectorAll('.glass, .hero-inner, .card'));
    let cx = window.innerWidth/2, cy = window.innerHeight/2;
    let lastMoveTime = 0;
    function handleMove(e){
      const now = performance.now();
      if (now - lastMoveTime < 16) return;
      lastMoveTime = now;
      const clientX = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX) || cx;
      const clientY = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY) || cy;
      const px = (clientX - cx) / cx;
      const py = (clientY - cy) / cy;
      if(bg){
        const moveX = px * 6;
        const moveY = py * 6;
        bg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(1.02)`;
      }
      parallaxEls.forEach((el, i) => {
        const depth = 6 + (i % 4);
        const tx = px * depth * 0.6;
        const ty = py * depth * 0.45;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    }
    window.addEventListener('pointermove', handleMove, {passive:true});
    window.addEventListener('touchmove', handleMove, {passive:true});
    window.addEventListener('pointerleave', () => {
      if(bg) bg.style.transform = '';
      parallaxEls.forEach(el=> el.style.transform = '');
    });
  })();

  const hero = document.getElementById('hero');
  const heroWave = document.getElementById('hero-wave');
  if(hero && heroWave){
    heroWave.classList.add('wave-animate'); // Start wave immediately
    let up = true;
    setInterval(() => {
      heroWave.style.opacity = (up ? 0.20 : 0.14);
      up = !up;
    }, 4200);
  }
})();
