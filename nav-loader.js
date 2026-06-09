// nav-loader.js
// Usage: <script src="nav-loader.js" data-page="index"></script>
// The data-page attribute on the script tag identifies the current page.
(function () {
  // ── ANNOUNCEMENT BANNER ──────────────────────────────────────────────────
  const BANNER_ACTIVE  = false;
  const BANNER_DATE    = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const BANNER_MESSAGE = "Work in progress — findings from <a href='chasing_ghosts.html' style='color:#ffffff;text-decoration:underline;font-weight:600;'>Chasing Ghosts</a> have opened a deeper investigation into ASR transcription fidelity across audio formats and compression levels. Research and updates are ongoing through the weekend.";

  if (BANNER_ACTIVE) {
    const banner = document.createElement('div');
    banner.id = 'site-banner';
    banner.innerHTML = `
      <span class="banner-date">${BANNER_DATE}</span>
      <span class="banner-divider">—</span>
      <span class="banner-msg">${BANNER_MESSAGE}</span>
    `;
    const style = document.createElement('style');
    style.textContent = `
      #site-banner {
        position: fixed; top: 0; left: 0; width: 100%; z-index: 9999;
        background: #FF6B00; border-bottom: 1px solid #cc5500;
        padding: 9px 28px; display: flex; align-items: baseline; gap: 10px;
        font-family: 'IBM Plex Mono', monospace; font-size: 11px;
        line-height: 1.55; color: #ffffff;
      }
      .banner-date { color: #fff; font-weight: 600; letter-spacing: .06em; white-space: nowrap; flex-shrink: 0; }
      .banner-divider { color: rgba(255,255,255,0.4); flex-shrink: 0; }
      body { padding-top: 38px !important; }
      @media (max-width: 768px) {
        #site-banner { flex-direction: column; gap: 4px; padding: 10px 16px; }
        body { padding-top: 72px !important; }
      }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // ── MOBILE STYLES ────────────────────────────────────────────────────────
  const mobileStyle = document.createElement('style');
  mobileStyle.textContent = `
    @media (max-width: 768px) {
      /* Hamburger button */
      #nav-hamburger {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 14px;
        left: 14px;
        z-index: 10001;
        width: 36px;
        height: 36px;
        background: #ffffff;
        border: 1px solid #e4e4e4;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
      #nav-hamburger span {
        display: block;
        width: 16px;
        height: 2px;
        background: #1a1a1a;
        border-radius: 2px;
        position: relative;
        transition: background 0.2s;
      }
      #nav-hamburger span::before,
      #nav-hamburger span::after {
        content: '';
        display: block;
        width: 16px;
        height: 2px;
        background: #1a1a1a;
        border-radius: 2px;
        position: absolute;
        left: 0;
        transition: transform 0.2s;
      }
      #nav-hamburger span::before { top: -5px; }
      #nav-hamburger span::after  { top: 5px; }

      /* Overlay */
      #nav-overlay {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.35);
        z-index: 10000;
      }
      #nav-overlay.open { display: block; }

      /* Drawer */
      #shared-nav {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        height: 100vh !important;
        width: 260px !important;
        z-index: 10001 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.25s ease !important;
        overflow-y: auto !important;
        box-shadow: 2px 0 12px rgba(0,0,0,0.12) !important;
      }
      #shared-nav.open {
        transform: translateX(0) !important;
      }

      /* Push main content down so it clears the hamburger */
      main {
        padding-top: 60px !important;
      }

      /* Fix tab/content width collapse on mobile */
      body {
        overflow-x: hidden;
      }
      .tab-panels, [role="tabpanel"], .panel-content {
        min-width: 0;
        overflow-x: hidden;
      }
    }

    /* Hide hamburger on desktop */
    @media (min-width: 769px) {
      #nav-hamburger { display: none !important; }
      #nav-overlay { display: none !important; }
    }
  `;
  document.head.appendChild(mobileStyle);

  // ── NAV LOADER ───────────────────────────────────────────────────────────
  const script = document.currentScript;
  const currentPage = script ? script.getAttribute('data-page') : null;

  fetch('nav.html')
    .then(r => r.text())
    .then(html => {
      const nav = document.getElementById('shared-nav');
      if (!nav) return;
      nav.innerHTML = html;

      // Mark the active page link
      if (currentPage) {
        nav.querySelectorAll('.nav-item[data-page]').forEach(a => {
          if (a.getAttribute('data-page') === currentPage) {
            a.classList.add('active');
          }
        });
      }

      // On-this-page anchor links (per-page opt-in via window.NAV_ANCHORS)
      if (window.NAV_ANCHORS && window.NAV_ANCHORS.length) {
        const label = document.createElement('div');
        label.className = 'nav-section-label';
        label.textContent = 'On This Page';
        const footer = nav.querySelector('.nav-footer');
        nav.insertBefore(label, footer || null);
        window.NAV_ANCHORS.forEach(({ href, label: text }) => {
          const a = document.createElement('a');
          a.href = href;
          a.className = 'nav-item';
          a.textContent = text;
          nav.insertBefore(a, footer || null);
        });
      }

      // ── MOBILE HAMBURGER ──────────────────────────────────────────────
      const hamburger = document.createElement('button');
      hamburger.id = 'nav-hamburger';
      hamburger.setAttribute('aria-label', 'Open navigation');
      hamburger.innerHTML = '<span></span>';

      const overlay = document.createElement('div');
      overlay.id = 'nav-overlay';

      document.body.appendChild(overlay);
      document.body.insertBefore(hamburger, document.body.firstChild);

      function openNav() {
        nav.classList.add('open');
        overlay.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
      }

      function closeNav() {
        nav.classList.remove('open');
        overlay.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }

      hamburger.addEventListener('click', function () {
        nav.classList.contains('open') ? closeNav() : openNav();
      });

      overlay.addEventListener('click', closeNav);

      // Close on nav link tap
      nav.querySelectorAll('.nav-item').forEach(a => {
        a.addEventListener('click', closeNav);
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeNav();
      });
    })
    .catch(err => console.warn('nav-loader: could not load nav.html', err));
})();
