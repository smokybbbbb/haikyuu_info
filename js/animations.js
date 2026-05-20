/* ─── Canvas Particle System ─────────────────────── */
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
  }

  resize() {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      type: Math.random() > 0.8 ? 'ball' : 'dot',
    };
  }

  init(count = 40) {
    this.particles = Array.from({ length: count }, () => this.createParticle());
    this.animate();
  }

  drawBall(x, y, r, alpha) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    // Main circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#F26522';
    ctx.fill();
    // Volleyball lines
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - r, y);
    ctx.lineTo(x + r, y);
    ctx.stroke();
    ctx.restore();
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = this.canvas.width + 10;
      if (p.x > this.canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = this.canvas.height + 10;
      if (p.y > this.canvas.height + 10) p.y = -10;

      if (p.type === 'ball') {
        this.drawBall(p.x, p.y, p.r * 3, p.alpha);
      } else {
        this.ctx.save();
        this.ctx.globalAlpha = p.alpha;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fillStyle = '#F26522';
        this.ctx.fill();
        this.ctx.restore();
      }
    });
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}

/* ─── Volleyball SVG Hero ────────────────────────── */
function createVolleyballSVG(size = 200) {
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="hero__volleyball">
    <defs>
      <radialGradient id="vbGrad" cx="35%" cy="30%">
        <stop offset="0%" stop-color="#FF9A5C"/>
        <stop offset="100%" stop-color="#D4520E"/>
      </radialGradient>
      <clipPath id="vbClip">
        <circle cx="100" cy="100" r="95"/>
      </clipPath>
    </defs>
    <!-- Main ball -->
    <circle cx="100" cy="100" r="95" fill="url(#vbGrad)"/>
    <!-- Panel lines -->
    <g clip-path="url(#vbClip)" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" fill="none">
      <!-- Horizontal curved line -->
      <path d="M 5 100 Q 50 70 100 100 Q 150 130 195 100"/>
      <path d="M 5 100 Q 50 130 100 100 Q 150 70 195 100"/>
      <!-- Vertical curved line -->
      <path d="M 100 5 Q 70 50 100 100 Q 130 150 100 195"/>
      <path d="M 100 5 Q 130 50 100 100 Q 70 150 100 195"/>
      <!-- Diagonal -->
      <path d="M 20 20 Q 60 100 20 180"/>
      <path d="M 180 20 Q 140 100 180 180"/>
    </g>
    <!-- Highlight -->
    <ellipse cx="72" cy="68" rx="24" ry="16" fill="rgba(255,255,255,0.18)" transform="rotate(-30 72 68)"/>
    <!-- Subtle shadow ring -->
    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
  </svg>`;
}

/* ─── Net SVG ────────────────────────────────────── */
function createNetSVG(width = 600, height = 80) {
  const lines = [];
  const cols = 20;
  const rows = 4;
  const cw = width / cols;
  const rh = height / rows;

  // Vertical lines
  for (let i = 0; i <= cols; i++) {
    lines.push(`<line x1="${i * cw}" y1="0" x2="${i * cw}" y2="${height}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`);
  }
  // Horizontal lines
  for (let j = 0; j <= rows; j++) {
    lines.push(`<line x1="0" y1="${j * rh}" x2="${width}" y2="${j * rh}" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>`);
  }

  return `
  <svg width="${width}" height="${height + 12}" viewBox="0 0 ${width} ${height + 12}" xmlns="http://www.w3.org/2000/svg" class="net-svg">
    <rect x="0" y="0" width="${width}" height="10" rx="5" fill="#1a1a1a"/>
    <g transform="translate(0, 10)">${lines.join('')}</g>
    <rect x="0" y="${height + 2}" width="${width}" height="10" rx="5" fill="#1a1a1a"/>
  </svg>`;
}

/* ─── Hero Section ───────────────────────────────── */
function initHero() {
  const heroVball = document.querySelector('#hero-volleyball');
  if (heroVball) heroVball.innerHTML = createVolleyballSVG(220);

  const netEl = document.querySelector('#hero-net');
  if (netEl) netEl.innerHTML = createNetSVG(netEl.offsetWidth || 600, 70);

  const canvas = document.querySelector('#particles-canvas');
  if (canvas) {
    const ps = new ParticleSystem(canvas);
    ps.init(50);
  }
}

/* ─── Parallax ───────────────────────────────────── */
function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const vball = hero.querySelector('.hero__volleyball');
    const orbs  = hero.querySelectorAll('.bg-orb');
    if (vball) vball.style.transform = `translateY(${y * 0.2}px)`;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${y * (0.1 + i * 0.05)}px)`;
    });
  }, { passive: true });
}

/* ─── Typing Effect ──────────────────────────────── */
function typewrite(el, text, speed = 60) {
  el.textContent = '';
  let i = 0;
  const cursor = document.createElement('span');
  cursor.style.cssText = 'border-right:2px solid var(--orange);animation:pulse 1s infinite;margin-left:2px;';
  el.appendChild(cursor);

  const type = () => {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, speed + Math.random() * 30);
    } else {
      setTimeout(() => cursor.remove(), 1000);
    }
  };
  setTimeout(type, 600);
}

/* ─── Initialize ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHero();
  initParallax();

  const typeEl = document.querySelector('[data-typewrite]');
  if (typeEl) typewrite(typeEl, typeEl.dataset.typewrite);
});
