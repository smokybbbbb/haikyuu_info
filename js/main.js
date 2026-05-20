/* ─── Navigation ─────────────────────────────────── */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
const mobileMenu = document.querySelector('.nav__mobile-menu');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  const open = mobileMenu?.classList.contains('open');
  if (spans[0]) spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  if (spans[1]) spans[1].style.opacity  = open ? '0' : '1';
  if (spans[2]) spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (!nav?.contains(e.target)) mobileMenu?.classList.remove('open');
});

// Active nav link
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .nav__mobile-link').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* ─── Scroll Reveal ──────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Animate stat bars inside revealed elements
      entry.target.querySelectorAll('.stat-bar__fill').forEach(fill => {
        fill.style.width = fill.dataset.value + '%';
      });
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Stat Bars (standalone) ─────────────────────── */
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-bar__fill[data-value]').forEach(fill => {
        setTimeout(() => { fill.style.width = fill.dataset.value + '%'; }, 200);
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-bar').forEach(bar => statObserver.observe(bar));

/* ─── Counter Animation ──────────────────────────── */
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ─── Modal System ───────────────────────────────── */
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal__close');

function openModal(data) {
  if (!modalOverlay) return;
  populateModal(data);
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function populateModal(char) {
  const team = TEAMS[char.team] || {};
  const teamColor = team.color || char.color || '#F26522';

  // Image side
  const imgSide = document.querySelector('.modal__img-side');
  if (imgSide) {
    imgSide.style.background = `linear-gradient(135deg, ${teamColor}22, ${teamColor}88)`;
    const img = imgSide.querySelector('img');
    const placeholder = imgSide.querySelector('.modal__img-placeholder');
    if (img) {
      img.src = char.image;
      img.alt = char.name;
      img.onerror = () => {
        img.style.display = 'none';
        if (placeholder) { placeholder.style.display = 'flex'; placeholder.textContent = char.emoji || char.name[0]; }
      };
      img.onload = () => {
        img.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      };
      img.style.display = 'none';
      if (placeholder) { placeholder.style.display = 'flex'; placeholder.textContent = char.emoji || char.name[0]; }
      img.src = char.image;
    }
    const numEl = imgSide.querySelector('.modal__img-overlay .num');
    const nameEl = imgSide.querySelector('.modal__img-overlay h2');
    const jpEl   = imgSide.querySelector('.modal__img-overlay p');
    if (numEl) numEl.textContent = char.number !== undefined ? `#${char.number}` : '';
    if (nameEl) nameEl.textContent = char.name;
    if (jpEl) jpEl.textContent = char.name_jp;
  }

  // Content
  const content = document.querySelector('.modal__content');
  if (!content) return;

  const statsHtml = Object.entries(char.stats || {}).map(([key, val]) => `
    <div class="stat-bar__item">
      <div class="stat-bar__label"><span>${statLabel(key)}</span><span>${val}</span></div>
      <div class="stat-bar__track"><div class="stat-bar__fill" data-value="${val}" style="width:${val}%; background:${teamColor}"></div></div>
    </div>
  `).join('');

  const abilitiesHtml = (char.abilities || []).map(a => `<span class="tag tag--orange">${a}</span>`).join('');

  content.innerHTML = `
    <div class="modal__team" style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
      <div style="width:32px;height:32px;border-radius:6px;background:${teamColor};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:0.7rem;">${team.short || '?'}</div>
      <div>
        <div class="label" style="color:${teamColor}">${team.name || char.team}</div>
        <div style="font-size:0.8rem;color:var(--gray)">${team.name_jp || ''}</div>
      </div>
    </div>
    <div class="modal__info-grid">
      <div class="modal__info-item"><div class="key">ตำแหน่ง</div><div class="val">${char.position}</div></div>
      <div class="modal__info-item"><div class="key">หมายเลข</div><div class="val">#${char.number}</div></div>
      <div class="modal__info-item"><div class="key">ส่วนสูง</div><div class="val">${char.height}</div></div>
      <div class="modal__info-item"><div class="key">น้ำหนัก</div><div class="val">${char.weight}</div></div>
      <div class="modal__info-item"><div class="key">วันเกิด</div><div class="val">${char.birthday}</div></div>
      <div class="modal__info-item"><div class="key">กรุ๊ปเลือด</div><div class="val">Type ${char.blood}</div></div>
    </div>
    <p class="modal__desc">${char.desc}</p>
    ${abilitiesHtml ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;">${abilitiesHtml}</div>` : ''}
    <div class="stat-bar">${statsHtml}</div>
    ${char.trivia ? `<div style="margin-top:16px;padding:12px 16px;background:var(--light-gray,#f5f5f7);border-radius:8px;font-size:0.82rem;color:var(--gray-dark)"><strong>💡 ข้อมูลน่าสนใจ:</strong> ${char.trivia}</div>` : ''}
    ${char.quote ? `<div class="modal__quote">${char.quote}</div>` : ''}
  `;
}

function statLabel(key) {
  const map = { power: 'พลัง', speed: 'ความเร็ว', jump: 'การกระโดด', technique: 'เทคนิค', intelligence: 'ไอคิว', stamina: 'ความทน' };
  return map[key] || key;
}

/* ─── Filter System ──────────────────────────────── */
function initFilters(selector = '.filter-btn', targetAttr = 'data-filter', itemAttr = 'data-team') {
  const buttons = document.querySelectorAll(selector);
  const items = document.querySelectorAll(`[${itemAttr}]`);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute(targetAttr);
      items.forEach(item => {
        const match = filter === 'all' || item.getAttribute(itemAttr) === filter;
        item.style.display = match ? '' : 'none';
        if (match) {
          item.style.animation = 'scaleIn 0.3s ease both';
          setTimeout(() => { item.style.animation = ''; }, 400);
        }
      });
    });
  });
}

/* ─── Smooth scroll for anchor links ────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── Lazy load images ───────────────────────────── */
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  });
  images.forEach(img => imgObserver.observe(img));
}

/* ─── Init ───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  lazyLoadImages();
  document.body.classList.add('page-transition');
});
