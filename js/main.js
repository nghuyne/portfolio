    /* CURSOR */
    const cur = document.getElementById('cursor');
    let cx = -100, cy = -100;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cur.style.left = cx + 'px';
      cur.style.top  = cy + 'px';
    });
    document.querySelectorAll('a, button, .proj-panel, .clink').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('big'));
      el.addEventListener('mouseleave', () => cur.classList.remove('big'));
    });

    /* HERO NAME — character-by-character reveal */
    (function animHeroName() {
      const el = document.querySelector('.hero-name');
      if (!el) return;
      const fullText = 'Trần Ngọc Huy';
      el.innerHTML = '';
      // Wrap each char
      [...fullText].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00a0' : ch;
        span.style.animationDelay = (0.05 + i * 0.045) + 's';
        el.appendChild(span);
      });
      // Period
      const period = document.createElement('span');
      period.className = 'char period';
      period.textContent = '.';
      period.style.animationDelay = (0.05 + fullText.length * 0.045 + 0.08) + 's';
      el.appendChild(period);
    })();

    /* HERO EYEBROW — fade in after name */
    (function() {
      const ey = document.querySelector('.hero-eyebrow');
      const sub = document.querySelector('.hero-subtitle');
      if (ey) { ey.style.opacity = '0'; ey.style.transition = 'opacity 0.8s'; setTimeout(() => ey.style.opacity = '', 800); }
      if (sub) { sub.style.opacity = '0'; sub.style.transition = 'opacity 0.8s'; setTimeout(() => sub.style.opacity = '', 1200); }
    })();

    /* MINI NAV */
    const miniNav = document.getElementById('mini-nav');
    window.addEventListener('scroll', () => {
      miniNav.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
    }, { passive: true });

    /* SCROLL REVEAL */
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    /* PROJECT PANEL TOGGLE */
    function togglePanel(detailId, panelId) {
      const detail = document.getElementById(detailId);
      const isOpen = detail.classList.contains('open');
      // Close all
      document.querySelectorAll('.proj-detail').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.proj-panel').forEach(p => p.style.borderBottom = '');
      // Open clicked (if wasn't open)
      if (!isOpen) {
        detail.classList.add('open');
      }
    }

    /* CONTACT FORM — Formspree */
    const ENDPOINT = 'https://formspree.io/f/xeevndrn';

    document.getElementById('cf-btn').addEventListener('click', async () => {
      const name  = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg   = document.getElementById('cf-msg').value.trim();
      const btn   = document.getElementById('cf-btn');
      const ok    = document.getElementById('cf-ok');

      if (!name || !email || !msg) {
        [['cf-name', name], ['cf-email', email], ['cf-msg', msg]].forEach(([id, val]) => {
          if (!val) {
            const el = document.getElementById(id);
            el.style.color = '#f87171';
            setTimeout(() => el.style.color = '', 2000);
          }
        });
        return;
      }

      btn.textContent = 'Sending...'; btn.disabled = true;

      try {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message: msg }),
        });
        if (res.ok) {
          btn.style.display = 'none';
          ok.style.display = 'block';
          document.getElementById('cf-name').value = '';
          document.getElementById('cf-email').value = '';
          document.getElementById('cf-msg').value = '';
        } else throw new Error();
      } catch {
        btn.textContent = 'Send →'; btn.disabled = false;
        ok.textContent = '✕ Failed. Email me directly.';
        ok.style.color = '#f87171'; ok.style.display = 'block';
        setTimeout(() => { ok.style.display = 'none'; ok.style.color = ''; ok.textContent = '✓ Message sent — I\'ll reply shortly.'; }, 3500);
      }
    });
