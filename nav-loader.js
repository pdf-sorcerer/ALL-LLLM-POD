// nav-loader.js
// Usage: <script src="nav-loader.js" data-page="index"></script>
// The data-page attribute on the script tag identifies the current page.
(function () {

  // ── ANNOUNCEMENT BANNER ──────────────────────────────────────────────────
  // Full-width top bar injected above all page content.
  // Update BANNER_MESSAGE and BANNER_DATE to change sitewide.
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
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9999;
        background: #FF6B00;
        border-bottom: 1px solid #cc5500;
        padding: 9px 28px;
        display: flex;
        align-items: baseline;
        gap: 10px;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 11px;
        line-height: 1.55;
        color: #ffffff;
      }
      .banner-date {
        color: #ffffff;
        font-weight: 600;
        letter-spacing: .06em;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .banner-divider {
        color: rgba(255,255,255,0.4);
        flex-shrink: 0;
      }
      .banner-msg {
        color: #ffffff;
      }
      body {
        padding-top: 38px !important;
      }
      @media (max-width: 768px) {
        #site-banner {
          flex-direction: column;
          gap: 4px;
          padding: 10px 16px;
        }
        body {
          padding-top: 72px !important;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.insertBefore(banner, document.body.firstChild);
  }

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
        nav.insertBefore(label, nav.querySelector('.nav-footer'));
        window.NAV_ANCHORS.forEach(({ href, label: text }) => {
          const a = document.createElement('a');
          a.href = href;
          a.className = 'nav-item';
          a.textContent = text;
          nav.insertBefore(a, nav.querySelector('.nav-footer'));
        });
      }
    })
    .catch(err => console.warn('nav-loader: could not load nav.html', err));

})();
