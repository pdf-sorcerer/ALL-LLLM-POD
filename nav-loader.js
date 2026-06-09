// nav-loader.js — inlined nav, no fetch
// Usage: <script src="nav-loader.js" data-page="pagename"></script>
(function () {

  // ── ANNOUNCEMENT BANNER ──────────────────────────────────────────────────
  const BANNER_ACTIVE = false;
  const BANNER_MESSAGE = "Work in progress.";
  if (BANNER_ACTIVE) {
    const banner = document.createElement('div');
    banner.id = 'site-banner';
    banner.innerHTML = BANNER_MESSAGE;
    const s = document.createElement('style');
    s.textContent = `#site-banner{position:fixed;top:0;left:0;width:100%;z-index:9999;background:#FF6B00;padding:9px 28px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#fff;}body{padding-top:38px!important;}`;
    document.head.appendChild(s);
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // ── INLINED NAV HTML ─────────────────────────────────────────────────────
  const NAV_HTML = `
<div class="nav-logo">ALL-LLLM POD</div>
<div class="nav-section-label">Pages</div>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/welcome.html" class="nav-item" data-page="welcome">1. Welcome</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/architecture.html" class="nav-item" data-page="architecture">2. Architecture</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/metrics.html" class="nav-item" data-page="performance">3. Model Performance</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/about.html" class="nav-item" data-page="about">4. About</a>
<div class="nav-section-label">Side Quests</div>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/clownfish.html" class="nav-item" data-page="clownfish">• Speaker labeling</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/heuristics.html" class="nav-item" data-page="heuristics">• Transcript Forensics</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/chasing_ghosts.html" class="nav-item" data-page="chasing-ghosts">• Ghost Audio</a>
<a href="https://pdf-sorcerer.github.io/all_lllm_pod/arguments.html" class="nav-item" data-page="argument_pipeline">• Argument Pipeline</a>
`;

  // ── STYLES ───────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Nav base styles (applied via #shared-nav so they work on all pages) */
    #shared-nav {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 220px;
      flex-shrink: 0;
      background: #ffffff;
      border-right: 1px solid #e4e4e4;
      display: flex;
      flex-direction: column;
      padding: 32px 0;
      overflow-y: auto;
    }
    #shared-nav .nav-logo {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #0A84FF;
      padding: 0 24px 28px;
      border-bottom: 1px solid #e4e4e4;
    }
    #shared-nav .nav-section-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #8c8c8c;
      padding: 18px 24px 8px;
    }
    #shared-nav .nav-item {
      display: block;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      color: #6b6b6b;
      text-decoration: none;
      padding: 7px 24px;
      border-left: 2px solid transparent;
      transition: color 0.15s, border-color 0.15s, background 0.15s;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #shared-nav .nav-item:hover {
      color: #1a1a1a;
      background: #f9f9f9;
      border-left-color: #e4e4e4;
    }
    #shared-nav .nav-item.active {
      color: #0A84FF;
      border-left-color: #0A84FF;
      background: rgba(10,132,255,0.12);
    }

    /* ── MOBILE ── */
    @media (max-width: 768px) {
      /* Drawer — off screen by default, override any page display:none */
      #shared-nav,
      nav#shared-nav {
        display: flex !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        height: 100vh !important;
        width: 260px !important;
        z-index: 10001 !important;
        transform: translateX(-100%) !important;
        transition: transform 0.25s ease !important;
        overflow-y: auto !important;
        overflow-x: hidden !important;
        box-shadow: 2px 0 12px rgba(0,0,0,0.12) !important;
        flex-direction: column !important;
        padding: 32px 0 !important;
        /* Must NOT contribute to page width when hidden */
        flex-shrink: 0 !important;
      }
      #shared-nav.open,
      nav#shared-nav.open {
        transform: translateX(0) !important;
      }

      /* Hamburger */
      #nav-hamburger {
        display: flex !important;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 14px;
        left: 14px;
        z-index: 10002;
        width: 36px;
        height: 36px;
        background: #ffffff;
        border: 1px solid #e4e4e4;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      }
      #nav-hamburger span {
        display: block; width: 16px; height: 2px;
        background: #1a1a1a; border-radius: 2px; position: relative;
      }
      #nav-hamburger span::before,
      #nav-hamburger span::after {
        content: ''; display: block; width: 16px; height: 2px;
        background: #1a1a1a; border-radius: 2px;
        position: absolute; left: 0;
      }
      #nav-hamburger span::before { top: -5px; }
      #nav-hamburger span::after  { top: 5px; }

      /* Overlay */
      #nav-overlay {
        display: none;
        position: fixed; inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 10000;
      }
      #nav-overlay.open { display: block; }

      /* Main content: full width, clear hamburger */
      main {
        padding-top: 64px !important;
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
      }

      body { overflow-x: hidden !important; }
    }

    /* Hide hamburger on desktop */
    @media (min-width: 769px) {
      #nav-hamburger { display: none !important; }
      #nav-overlay   { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  // ── INJECT NAV ───────────────────────────────────────────────────────────
  const script = document.currentScript;
  const currentPage = script ? script.getAttribute('data-page') : null;

  const nav = document.getElementById('shared-nav');
  if (nav) {
    nav.innerHTML = NAV_HTML;

    // Mark active page
    if (currentPage) {
      nav.querySelectorAll('.nav-item[data-page]').forEach(function(a) {
        if (a.getAttribute('data-page') === currentPage) {
          a.classList.add('active');
        }
      });
    }

    // On-this-page anchors (opt-in via window.NAV_ANCHORS)
    if (window.NAV_ANCHORS && window.NAV_ANCHORS.length) {
      var label = document.createElement('div');
      label.className = 'nav-section-label';
      label.textContent = 'On This Page';
      nav.appendChild(label);
      window.NAV_ANCHORS.forEach(function(item) {
        var a = document.createElement('a');
        a.href = item.href;
        a.className = 'nav-item';
        a.textContent = item.label;
        nav.appendChild(a);
      });
    }
  }

  // ── MOBILE HAMBURGER ─────────────────────────────────────────────────────
  var hamburger = document.createElement('button');
  hamburger.id = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span></span>';

  var overlay = document.createElement('div');
  overlay.id = 'nav-overlay';

  document.body.appendChild(overlay);
  document.body.insertBefore(hamburger, document.body.firstChild);

  function openNav() {
    if (nav) nav.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    if (nav) nav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function() {
    nav && nav.classList.contains('open') ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  if (nav) {
    nav.querySelectorAll('.nav-item').forEach(function(a) {
      a.addEventListener('click', closeNav);
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeNav();
  });

})();
