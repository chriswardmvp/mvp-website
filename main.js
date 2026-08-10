/* ── TEAMS DATA ── */
const TEAMS = [
  { age:'9U Black',  coach:'Randy Medeiros',   pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272155&team=1057125&Year=2026' },
  { age:'9U Royal',  coach:'Casey Marques',    pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272156&team=1057126&Year=2026' },
  { age:'10U Black', coach:'Vince Lehman',      pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272157&team=1057129&Year=2026' },
  { age:'10U Royal', coach:'Jim Patierno',      pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272304&team=1057130&Year=2026' },
  { age:'11U Black', coach:'Andrew Ciardelli',  pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272305&team=1057131&Year=2026' },
  { age:'11U Royal', coach:'Chris Lupoli',      pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272306&team=1057132&Year=2026' },
  { age:'12U Black', coach:'Josh McCallister',  pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272309&team=1057133&Year=2026' },
  { age:'12U Royal', coach:'Ryan Pelletier',    pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272310&team=1057134&Year=2026' },
  { age:'12U White', coach:'Mike Gagnon',       pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272312&team=1057135&Year=2026' },
  { age:'13U Black', coach:'Jeff Nichols',      pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272313&team=1057136&Year=2026' },
  { age:'13U Royal', coach:'Rob Smith',         pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272314&team=1057137&Year=2026' },
  { age:'13U White', coach:'Dean Adams',        pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272315&team=1057138&Year=2026' },
  { age:'14U Black', coach:'Jacob Hobart',      pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272399&team=1057140&Year=2026' },
  { age:'14U Royal', coach:'Greg Frink',        pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272316&team=1057139&Year=2026' },
  { age:'15U',       coach:'Jon Juchnevics',    pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272317&Year=2026' },
  { age:'17U',       coach:'Ray DeRusha',       pgUrl:'https://www.perfectgame.org/PGBA/Team/default.aspx?orgid=47156&orgteamid=272318&Year=2026' },
];

function buildTeamsGrid() {
  const grid = document.getElementById('teamsGrid');
  if (!grid) return;
  grid.innerHTML = TEAMS.map((t, i) => `
    <div class="team-card visible" style="animation-delay:${Math.min(i * 0.04, 0.5)}s">
      <div class="team-left">
        <div class="team-age">${t.age}</div>
        <div class="team-coach"><strong>Head Coach:</strong> ${t.coach}</div>
      </div>
      <div class="team-actions">
        <a href="${t.pgUrl}" target="_blank">View Roster &amp; Schedule &nearr;</a>
      </div>
    </div>
  `).join('');
}

function buildTeamsDropdown() {
  const dd = document.getElementById('teamsDropdown');
  if (!dd) return;
  const allTeamsLink = `<a href="teams.html" style="font-weight:600;color:var(--blue);">All Teams</a>`;
  dd.innerHTML = allTeamsLink + TEAMS.map(t =>
    `<a href="${t.pgUrl}" target="_blank">${t.age}</a>`
  ).join('');
}

function buildMobileTeamsSubmenu() {
  var sub = document.getElementById('mobileTeamsSubmenu');
  if (!sub || sub.dataset.built) return;
  TEAMS.forEach(function(t) {
    var a = document.createElement('a');
    a.href = t.pgUrl; a.target = '_blank';
    a.textContent = t.age;
    a.style.cssText = 'display:block;padding:0.6rem 2rem;font-size:0.82rem;color:rgba(255,255,255,0.65);border-bottom:1px solid rgba(255,255,255,0.04);font-family:Oswald,sans-serif;letter-spacing:0.05em;text-transform:uppercase;';
    sub.appendChild(a);
  });
  sub.dataset.built = '1';
}

function toggleMobile() {
  var isOpen = document.getElementById('mobileMenu').classList.toggle('open');
  var btn = document.querySelector('.nav-hamburger.js-only-hamburger');
  if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

function toggleMobileTeams() {
  buildMobileTeamsSubmenu();
  var sub = document.getElementById('mobileTeamsSubmenu');
  var chev = document.getElementById('mobileChevron');
  var isOpen = sub.classList.toggle('open');
  chev.classList.toggle('open');
  document.querySelector('.mobile-teams-toggle').setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

/* Instructor bio read-more toggle (Lessons page) */
function toggleInstructorBio(btn) {
  var card = btn.closest('.instructor-card');
  var bio = card.querySelector('.instructor-bio-clamp');
  var awards = card.querySelector('.instructor-awards');
  var isExpanded = bio.classList.toggle('expanded');
  if (awards) awards.style.display = isExpanded ? 'block' : 'none';
  btn.textContent = isExpanded ? 'Show Less' : 'Read More';
  btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
}

/* Membership tier read-more toggle (Facility page) */
function toggleMembershipBio(btn) {
  var card = btn.closest('.facility-feature');
  var bio = card.querySelector('.instructor-bio-clamp');
  var isExpanded = bio.classList.toggle('expanded');
  btn.textContent = isExpanded ? 'Show Less' : 'Read More';
  btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
}

/* Escape closes the mobile menu, and focus returns to the toggle that opened it */
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Escape') return;
  var menu = document.getElementById('mobileMenu');
  if (!menu || !menu.classList.contains('open')) return;
  toggleMobile();
  var btn = document.querySelector('.nav-hamburger.js-only-hamburger');
  if (btn) btn.focus();
});

/* ── SHARED HEADER/FOOTER: load partials, then wire them up ── */
function loadPartial(url, mountId, callback) {
  var mount = document.getElementById(mountId);
  if (!mount) { if (callback) callback(); return; }
  fetch(url).then(function(r) { return r.text(); }).then(function(html) {
    mount.innerHTML = html;
    if (callback) callback();
  }).catch(function() {
    /* If this fails (e.g. opened via file:// without a server), the page
       still works, it just won't have a nav/footer. See project notes on
       testing via a local server, not by double-clicking the HTML file.
       Still run the callback so page content that depends on it (the
       reveal animations) isn't left stuck at opacity:0. */
    if (callback) callback();
  });
}

function initNav() {
  buildTeamsDropdown();
  var current = document.body.getAttribute('data-page');
  if (current) {
    document.querySelectorAll('[data-page-link]').forEach(function(a) {
      if (a.getAttribute('data-page-link') === current) a.setAttribute('aria-current', 'page');
    });
  }
  var navEl = document.querySelector('.nav');
  var backTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    if (navEl) navEl.classList.toggle('scrolled', y > 10);
    if (backTop) backTop.classList.toggle('show', y > 600);
  }, { passive: true });
  initAnimations();
}

function initFooter() {
  /* COOKIE BANNER */
  var banner = document.getElementById('cookieBanner');
  if (banner) {
    try { if (!localStorage.getItem('mvp_cookie_ok')) banner.style.display = 'flex'; }
    catch(e) {}
  }
  initAnimations();
}

function closeCookieBanner() {
  document.getElementById('cookieBanner').style.display = 'none';
  try { localStorage.setItem('mvp_cookie_ok','1'); } catch(e) {}
}

/* ── FACEBOOK SDK (only loaded on pages that actually embed the feed) ── */
if (document.getElementById('fbPageContainer')) {
  window.fbAsyncInit = function() {
    FB.init({ appId: '', cookie: true, xfbml: true, version: 'v19.0' });
  };
  (function(d, s, id) {
    if (d.getElementById(id)) return;
    var js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    js.onerror = function() {
      var el = document.getElementById('fbFallback');
      if (el) { el.style.display = 'block'; el.previousElementSibling && (el.previousElementSibling.style.display = 'none'); }
    };
    d.getElementsByTagName('head')[0].appendChild(js);
  }(document, 'script', 'facebook-jssdk'));

  function buildFbEmbed() {
    var container = document.getElementById('fbPageContainer');
    if (!container) return;
    var w = Math.min(container.parentElement.offsetWidth || 500, 500);
    if (w < 180) w = 340;
    container.innerHTML = '<div class="fb-page"' +
      ' data-href="https://www.facebook.com/MerrimackValleyProspects/"' +
      ' data-tabs="timeline"' +
      ' data-width="' + w + '"' +
      ' data-height="500"' +
      ' data-small-header="false"' +
      ' data-adapt-container-width="false"' +
      ' data-hide-cover="false"' +
      ' data-show-facepile="false"></div>';
    if (window.FB) { FB.XFBML.parse(container); }
  }
  window.addEventListener('load', buildFbEmbed);
  window.addEventListener('resize', function() {
    clearTimeout(window._fbResizeTimer);
    window._fbResizeTimer = setTimeout(buildFbEmbed, 250);
  });
  setTimeout(function() {
    var container = document.getElementById('fbPageContainer');
    var fallback = document.getElementById('fbFallback');
    if (container && fallback && !container.querySelector('iframe')) {
      fallback.style.display = 'block';
    }
  }, 5000);
}

/* INTERSECTION OBSERVER - fade-in animations.
   .fade-in starts at opacity:0, so if the observer is unavailable the content
   would never appear. Feature-detect and fall back to showing everything
   rather than risking an invisible page. */
var REVEAL_SELECTOR = '.fade-in, .fade-in-left, .fade-in-right, .section-header';
var supportsIO = typeof IntersectionObserver === 'function';
var observer = supportsIO ? new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 }) : null;

function initAnimations() {
  document.querySelectorAll(REVEAL_SELECTOR).forEach(function(el) {
    if (observer) observer.observe(el);
    else el.classList.add('visible');
  });
}

/* STATS COUNT-UP (only on pages with a stats bar) */
var countUpDone = false;
function runCountUp() {
  if (countUpDone) return;
  countUpDone = true;
  document.querySelectorAll('.stat-num[data-target]').forEach(function(el) {
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var start  = el.dataset.start ? parseInt(el.dataset.start) : 0;
    var duration = 1500;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + (target - start) * ease) + (progress >= 1 ? suffix : '');
      if (progress < 1) requestAnimationFrame(step);
      else { el.classList.add('glow'); }
    }
    requestAnimationFrame(step);
  });
}
var statsBar = document.querySelector('.stats-bar');
if (statsBar && !supportsIO) {
  /* Numbers are already in the markup, so just skip straight to the end state. */
  runCountUp();
} else if (statsBar) {
  var statsObs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) { runCountUp(); }
  }, { threshold: 0.4 });
  statsObs.observe(statsBar);
}

/* Init: load the shared header and footer into every page */
loadPartial('partials/nav.html', 'site-header', initNav);
loadPartial('partials/footer.html', 'site-footer', initFooter);
buildTeamsGrid();
/* Reveal page content immediately rather than waiting on the partial fetch,
   so a slow or failed nav/footer request never leaves the body invisible. */
initAnimations();
