/**
 * Effects Module — Emoji trail, particles, click effects
 * Optimized for performance
 */
const Effects = (() => {
  let canvas, ctx;
  let particles = [];
  let enabled = true;
  let config = {};
  let lastSpawn = 0;
  let rafId = null;
  let isLowPerf = false;

  function init() {
    canvas = document.getElementById('effects-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    // Detect low performance devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
      isLowPerf = true;
    }

    const data = Storage.load();
    config = data.effects || {};
    enabled = config.emojiTrail !== false;

    if (enabled) {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onTouch, { passive: true });
      document.addEventListener('click', onClick);
      document.addEventListener('touchstart', onClick, { passive: true });
      loop();
    }
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function updateConfig(newConfig) {
    config = { ...config, ...newConfig };
    enabled = config.emojiTrail !== false;
  }

  function onMove(e) {
    if (!enabled || isLowPerf) return;
    const now = Date.now();
    if (now - lastSpawn < (isLowPerf ? 80 : 40) / (config.density || 0.6)) return;
    lastSpawn = now;
    spawn(e.clientX, e.clientY);
  }

  function onTouch(e) {
    if (!enabled || !e.touches[0]) return;
    const t = e.touches[0];
    const now = Date.now();
    if (now - lastSpawn < 50) return;
    lastSpawn = now;
    spawn(t.clientX, t.clientY);
  }

  function onClick(e) {
    if (!enabled || config.click === false) return;
    const x = e.clientX || (e.touches && e.touches[0]?.clientX);
    const y = e.clientY || (e.touches && e.touches[0]?.clientY);
    if (x == null) return;
    for (let i = 0; i < 5; i++) {
      spawn(x + (Math.random() - 0.5) * 30, y + (Math.random() - 0.5) * 30, true);
    }
  }

  function spawn(x, y, burst = false) {
    if (particles.length > (isLowPerf ? 40 : 80)) return;
    const emojis = config.emojis || ['❤️', '✨', '⭐'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    particles.push({
      x, y,
      emoji,
      vx: (Math.random() - 0.5) * (burst ? 4 : 1.5),
      vy: -Math.random() * 2 - 1,
      life: 1,
      decay: 0.012 + Math.random() * 0.01 * (config.speed || 1),
      size: (14 + Math.random() * 10) * (config.size || 1),
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6
    });
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy -= 0.02;
      p.life -= p.decay;
      p.rot += p.rotSpeed;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    }
    rafId = requestAnimationFrame(loop);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('touchmove', onTouch);
    document.removeEventListener('click', onClick);
    document.removeEventListener('touchstart', onClick);
  }

  return { init, updateConfig, destroy, spawn };
})();
