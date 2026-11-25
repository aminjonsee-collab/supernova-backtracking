(function () {
  'use strict';
  const { esc, icon } = RL;
  const main = document.getElementById('main');
  const rail = document.getElementById('rail');
  const crumb = document.getElementById('crumb');
  let cleanup = null, current = null;

  /* ---------- theme ---------- */
  const mq = matchMedia('(prefers-color-scheme: dark)');
  RL.applyTheme = function () {
    const t = RL.state.theme === 'auto' ? (mq.matches ? 'dark' : 'light') : RL.state.theme;
    document.documentElement.dataset.theme = t;
    document.documentElement.dataset.lang = RL.state.lang === 'py' ? 'py' : 'java';
    const b = document.getElementById('themeBtn');
    b.innerHTML = t === 'dark' ? icon.sun : icon.moon;
    b.setAttribute('aria-label', t === 'dark' ? 'Yorugʻ mavzuga oʻtish' : 'Qorongʻi mavzuga oʻtish');
    document.querySelector('meta[name=theme-color]').setAttribute('content', t === 'dark' ? '#0E1428' : '#16203A');
  };
  RL.setTheme = function (t) { RL.state.theme = t; RL.save(); RL.applyTheme(); };
  mq.addEventListener && mq.addEventListener('change', () => { if (RL.state.theme === 'auto') RL.applyTheme(); });

  /* ---------- rail ---------- */
  const NAV = [
    ['Oʻquv reja', [['home', '#/', 'Bosh sahifa', icon.home], ['sprints', '#/sprints', 'Sprintlar xaritasi', icon.map]]],
    ['Amaliyot', [['labs', '#/labs', 'Laboratoriya', icon.flask], ['board', '#/board', 'Sprint board', icon.board], ['problems', '#/problems', 'Masalalar', icon.list], ['exam', '#/exam', 'Imtihon', icon.exam]]],
    ['Maʼlumotnoma', [['cheatsheet', '#/cheatsheet', 'Shpargalka', icon.book], ['glossary', '#/glossary', 'Lugʻat', icon.abc], ['settings', '#/settings', 'Sozlamalar', icon.gear]]]
  ];
  RL.renderRail = function () {
    const tp = RL.totalProgress();
    const r = current || {};
    const link = ([k, href, label, ic]) => `<a class="nav-link" href="${href}"${r.name === k || (k === 'labs' && r.name === 'lab') ? ' aria-current="page"' : ''}>${ic}<span>${label}</span></a>`;
    rail.innerHTML = `
      <a class="brand" href="#/" aria-label="Rekursiya Lab bosh sahifa">
        <svg viewBox="0 0 38 38" aria-hidden="true"><rect x="1" y="1" width="36" height="36" rx="9" fill="none" stroke="#3D5BA8" stroke-width="2"/><rect x="7" y="7" width="24" height="24" rx="6" fill="none" stroke="#6481C5" stroke-width="2"/><rect x="12.5" y="12.5" width="13" height="13" rx="4" fill="none" stroke="#97ACDA" stroke-width="2"/><rect x="16.5" y="16.5" width="5" height="5" rx="1.5" fill="#F0B323"/></svg>
        <div><b>Rekursiya Lab</b><span>rekursiya va backtracking</span></div>
      </a>
      <nav>
        <div class="nav-group"><div class="nav-h">${NAV[0][0]}</div>${NAV[0][1].map(link).join('')}
          <ol class="nav-sprints">${RL.sprints.map(s => {
            const p = RL.sprintProgress(s);
            return `<li><a class="nav-sprint${p.pct === 100 ? ' done' : ''}" href="#/sprint/${s.n}"${r.name === 'sprint' && +r.n === s.n ? ' aria-current="page"' : ''} title="${esc(s.title)}"><span class="ns-n">${p.pct === 100 ? '✓' : s.n}</span><span class="ns-t">${esc(s.title)}</span><span class="ns-bar"><i style="width:${p.pct}%"></i></span></a></li>`;
          }).join('')}</ol>
        </div>
        ${NAV.slice(1).map(([h, items]) => `<div class="nav-group"><div class="nav-h">${h}</div>${items.map(link).join('')}</div>`).join('')}
      </nav>
      <div class="rail-foot"><div class="rf-row"><span>Umumiy progress</span><strong>${tp.pct}%</strong></div><div class="rf-bar"><i style="width:${tp.pct}%"></i></div><div class="rf-row" style="margin:8px 0 0"><span>${tp.done} / ${tp.total} ball</span></div></div>`;
  };

  /* ---------- router ---------- */
  function parse() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const seg = path.split('/').filter(Boolean).map(decodeURIComponent);
    const query = {};
    new URLSearchParams(qs || '').forEach((v, k) => { query[k] = v; });
    const r = { name: seg[0] || 'home', query };
    if (r.name === 'sprint') {
      r.n = +seg[1];
      if (seg[2] === 'lesson') { r.tab = 'lessons'; r.lesson = +seg[3]; }
      else r.tab = seg[2] || 'lessons';
    }
    if (r.name === 'lab') r.id = seg[1];
    if (!RL.pages[r.name] || r.name === 'notfound') r.name = 'notfound';
    return r;
  }
  function route(keepScroll) {
    const r = parse();
    const y = window.scrollY;
    if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
    const page = RL.pages[r.name];
    const sameView = current && current.name === r.name && current.n === r.n && current.tab === r.tab && r.name === 'sprint' && r.lesson != null;
    current = r;
    try {
      main.innerHTML = page.render(r);
      crumb.innerHTML = page.crumb ? page.crumb(r) : '';
      cleanup = page.mount ? page.mount(main, r) || null : null;
    } catch (e) {
      console.error(e);
      main.innerHTML = `<div class="empty"><h1 class="h2">Sahifani ochishda xato</h1><p>${esc(e.message)}</p><a class="btn" href="#/">Bosh sahifaga</a></div>`;
    }
    RL.syncLangButtons();
    RL.renderRail();
    const titleEl = main.querySelector('h1');
    document.title = (titleEl && r.name !== 'home' ? titleEl.textContent + ' — ' : '') + 'Rekursiya Lab';
    if (keepScroll) window.scrollTo(0, y);
    else if (r.lesson == null) window.scrollTo(0, 0);
    if (!keepScroll && !sameView && navigated) main.focus({ preventScroll: true });
    closeMenu();
  }
  let navigated = false;
  RL.rerender = () => route(true);
  window.addEventListener('hashchange', () => { navigated = true; route(false); });

  /* ---------- mobile menu ---------- */
  const scrim = document.getElementById('scrim');
  function closeMenu() { rail.classList.remove('open'); scrim.hidden = true; }
  document.getElementById('menuBtn').innerHTML = icon.menu;
  document.getElementById('menuBtn').addEventListener('click', () => { rail.classList.add('open'); scrim.hidden = false; const a = rail.querySelector('a'); a && a.focus(); });
  scrim.addEventListener('click', closeMenu);

  /* ---------- global delegation ---------- */
  document.addEventListener('click', e => {
    const l = e.target.closest('[data-set-lang]');
    if (l && l.dataset.setLang) { RL.setLang(l.dataset.setLang); return; }
    const c = e.target.closest('[data-copy]');
    if (c) RL.copy(RL.codeText(+c.dataset.copy));
  });
  document.getElementById('themeBtn').addEventListener('click', () => {
    RL.setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  /* ---------- palette ---------- */
  const pal = document.getElementById('palette');
  const pin = document.getElementById('paletteInput');
  const plist = document.getElementById('paletteList');
  document.querySelector('#searchBtn .sb-icon').innerHTML = icon.search;
  let items = null, shown = [], sel = 0, lastFocus = null;
  function index() {
    const out = [];
    NAV.forEach(([, list]) => list.forEach(([, href, label]) => out.push({ t: label, s: 'Sahifa', href })));
    RL.sprints.forEach(s => {
      out.push({ t: `Sprint ${s.n}: ${s.title}`, s: 'Sprint', href: `#/sprint/${s.n}` });
      s.lessons.forEach((l, i) => out.push({ t: l.t, s: `Dars ${s.n}.${i + 1}`, href: `#/sprint/${s.n}/lesson/${i}` }));
    });
    Object.keys(RL.labs).forEach(id => out.push({ t: RL.labs[id].title, s: 'Laboratoriya', href: `#/lab/${id}` }));
    RL.allProblems().forEach(p => out.push({ t: `${p.code ? p.code + '. ' : ''}${p.name}`, s: `${RL.PLATFORMS[p.pl]}, Sprint ${p.sprint}`, href: RL.problemUrl(p), ext: true }));
    RL.ref.glossary.forEach(g => out.push({ t: `${g.en} — ${g.uz}`, s: 'Lugʻat', href: `#/glossary?q=${encodeURIComponent(g.en)}` }));
    RL.ref.cheats.forEach(c => out.push({ t: c.t, s: 'Shpargalka', href: '#/cheatsheet' }));
    return out;
  }
  function openPal() {
    items = items || index();
    lastFocus = document.activeElement;
    pal.hidden = false; pin.value = ''; filter(); pin.focus();
  }
  function closePal() { pal.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function filter() {
    const q = pin.value.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    shown = !q ? items.filter(x => x.s === 'Sahifa' || x.s === 'Sprint' || x.s === 'Laboratoriya') : items
      .map(x => { const hay = (x.t + ' ' + x.s).toLowerCase(); if (!words.every(w => hay.includes(w))) return null; return { x, score: x.t.toLowerCase().startsWith(q) ? 0 : x.t.toLowerCase().includes(q) ? 1 : 2 }; })
      .filter(Boolean).sort((a, b) => a.score - b.score).slice(0, 40).map(o => o.x);
    sel = 0; drawList();
  }
  function drawList() {
    plist.innerHTML = shown.length ? shown.map((x, i) => `<li role="option" data-pi="${i}" aria-selected="${i === sel}"><b>${esc(x.t)}</b><span>${esc(x.s)}${x.ext ? ' ↗' : ''}</span></li>`).join('') : `<li class="pal-empty">Hech narsa topilmadi. Boshqa soʻz bilan urinib koʻring.</li>`;
    const cur = plist.querySelector('[aria-selected=true]'); if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function go(i) {
    const x = shown[i]; if (!x) return;
    closePal();
    if (x.ext) window.open(x.href, '_blank', 'noopener');
    else if (location.hash === x.href) route(false);
    else location.hash = x.href;
  }
  pin.addEventListener('input', filter);
  pin.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(shown.length - 1, sel + 1); drawList(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, sel - 1); drawList(); }
    else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
    else if (e.key === 'Escape') closePal();
  });
  plist.addEventListener('click', e => { const li = e.target.closest('[data-pi]'); if (li) go(+li.dataset.pi); });
  pal.addEventListener('click', e => { if (e.target === pal) closePal(); });
  document.getElementById('searchBtn').addEventListener('click', openPal);
  document.addEventListener('keydown', e => {
    const typing = e.target.closest && e.target.closest('input,textarea,select,[contenteditable]');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPal() : closePal(); }
    else if (e.key === '/' && !typing && pal.hidden) { e.preventDefault(); openPal(); }
    else if (e.key === 'Escape') { if (!pal.hidden) closePal(); else closeMenu(); }
  });

  /* ---------- boot ---------- */
  RL.applyTheme();
  route(false);
})();
