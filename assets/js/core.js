(function () {
  'use strict';
  const RL = window.RL = { sprints: [], labs: {}, pages: {}, ref: {} };
  const KEY = 'rl-state-v1';

  const defaults = () => ({
    theme: 'auto', lang: 'java',
    tasks: {}, read: {}, solved: {}, quiz: {}, exams: [], retro: {}, started: {}, labs: {}
  });
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  RL.state = Object.assign(defaults(), load());
  RL.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(RL.state)); } catch (e) { }
    RL.emit('state');
  };
  RL.resetState = function () { RL.state = defaults(); RL.save(); };
  RL.importState = function (obj) { RL.state = Object.assign(defaults(), obj); RL.save(); };

  const handlers = {};
  RL.on = (ev, fn) => { (handlers[ev] = handlers[ev] || []).push(fn); return () => RL.off(ev, fn); };
  RL.off = (ev, fn) => { handlers[ev] = (handlers[ev] || []).filter(f => f !== fn); };
  RL.emit = (ev, d) => (handlers[ev] || []).slice().forEach(f => f(d));

  RL.$ = (s, r) => (r || document).querySelector(s);
  RL.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  RL.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  RL.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  RL.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  RL.depthColor = d => `var(--d${Math.min(5, d)})`;
  RL.depthTint = d => `var(--t${Math.min(5, d)})`;
  RL.reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  let toastTimer;
  RL.toast = function (msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  };

  RL.copy = function (text) {
    const done = () => RL.toast('Kod nusxalandi');
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallback());
    } else fallback();
    function fallback() {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { RL.toast('Nusxalab boʻlmadi'); }
      ta.remove();
    }
  };

  /* ---------- icons ---------- */
  const I = (p, extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra || ''}>${p}</svg>`;
  RL.icon = {
    play: I('<path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none"/>'),
    pause: I('<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/>'),
    back: I('<path d="M15 5l-7 7 7 7"/>'),
    fwd: I('<path d="M9 5l7 7-7 7"/>'),
    start: I('<path d="M6 5v14"/><path d="M18 5l-8 7 8 7"/>'),
    end: I('<path d="M18 5v14"/><path d="M6 5l8 7-8 7"/>'),
    search: I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
    sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
    moon: I('<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
    copy: I('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
    check: I('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    ext: I('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
    left: I('<path d="M15 5l-7 7 7 7"/>'),
    right: I('<path d="M9 5l7 7-7 7"/>'),
    home: I('<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/>'),
    map: I('<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>'),
    flask: I('<path d="M9 3h6M10 3v6L4.5 18.5A1.6 1.6 0 0 0 6 21h12a1.6 1.6 0 0 0 1.5-2.5L14 9V3"/><path d="M7.5 15h9"/>'),
    list: I('<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'),
    board: I('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>'),
    exam: I('<path d="M9 4h6l1 2h3v14H5V6h3z"/><path d="M9 13l2 2 4-4"/>'),
    book: I('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>'),
    abc: I('<path d="M4 18l4-12 4 12M5.5 14h5"/><path d="M15 6v12h3a3 3 0 0 0 0-6h-3 2.5a3 3 0 0 0 0-6z"/>'),
    gear: I('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
    shuffle: I('<path d="M16 3h5v5"/><path d="M4 20L21 3"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/>'),
    queen: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 31h24l-2.2-13.5-5.6 6.3L20 11l-4.2 12.8-5.6-6.3z" fill="var(--ink)"/><rect x="7" y="32" width="26" height="4" rx="1.5" fill="var(--ink)"/><circle cx="20" cy="8.5" r="2.6" fill="var(--sun)"/><circle cx="9.5" cy="15.5" r="2.2" fill="var(--ink)"/><circle cx="30.5" cy="15.5" r="2.2" fill="var(--ink)"/></svg>`
  };

  /* ---------- syntax highlight ---------- */
  const KW = {
    java: new Set('abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch this throw throws try void while var true false'.split(' ')),
    py: new Set('and as assert break class continue def del elif else except False finally for from global if import in is lambda None nonlocal not or pass raise return True try while with yield'.split(' '))
  };
  const BUILTIN_PY = new Set('print range len list dict set tuple int str min max sum sorted reversed enumerate zip abs map input open pow isinstance'.split(' '));
  const RE = {
    java: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?[lLfFdD]?\b)|(@?[A-Za-z_$][\w$]*)|(\s+|[\s\S])/g,
    py: /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[fr]?"(?:\\.|[^"\\\n])*"|[fr]?'(?:\\.|[^'\\\n])*')|(\b\d[\d_]*(?:\.\d+)?\b)|(@?[A-Za-z_]\w*)|(\s+|[\s\S])/g
  };
  RL.highlight = function (code, lang) {
    lang = lang === 'py' ? 'py' : 'java';
    const re = new RegExp(RE[lang].source, 'g');
    const kw = KW[lang];
    let out = '', m;
    while ((m = re.exec(code))) {
      if (m[1]) out += `<span class="t-c">${RL.esc(m[1])}</span>`;
      else if (m[2]) out += `<span class="t-s">${RL.esc(m[2])}</span>`;
      else if (m[3]) out += `<span class="t-n">${m[3]}</span>`;
      else if (m[4]) {
        const w = m[4];
        let j = re.lastIndex; while (code[j] === ' ') j++;
        if (kw.has(w)) out += `<span class="t-k">${w}</span>`;
        else if (code[j] === '(' && !(lang === 'py' && BUILTIN_PY.has(w))) out += `<span class="t-f">${w}</span>`;
        else if (lang === 'java' && /^[A-Z]/.test(w)) out += `<span class="t-t">${w}</span>`;
        else if (lang === 'py' && BUILTIN_PY.has(w)) out += `<span class="t-k">${w}</span>`;
        else if (w[0] === '@') out += `<span class="t-t">${w}</span>`;
        else out += w;
      } else out += RL.esc(m[5]);
    }
    return out;
  };

  const codeStore = [];
  RL.codeBlock = function (c, cap) {
    const langs = ['java', 'py'].filter(l => c[l]);
    const id = codeStore.push(c) - 1;
    const only = langs.length === 1 ? ' only' : '';
    const tabs = langs.length > 1
      ? `<span class="code-tabs">${langs.map(l => `<button data-set-lang="${l}" aria-pressed="false">${l === 'java' ? 'Java' : 'Python'}</button>`).join('')}</span>`
      : `<span class="code-tabs"><button aria-pressed="true" tabindex="-1">${langs[0] === 'java' ? 'Java' : 'Python'}</button></span>`;
    return `<figure class="code" data-code="${id}"><div class="code-bar">${tabs}<span class="cap">${cap ? RL.esc(cap) : ''}</span><button class="copy-btn" data-copy="${id}" aria-label="Kodni nusxalash">${RL.icon.copy}<span>Nusxa</span></button></div>${langs.map(l => `<pre class="${l}${only}"><code>${RL.highlight(c[l].replace(/^\n/, ''), l)}</code></pre>`).join('')}</figure>`;
  };
  RL.codeText = function (id) {
    const c = codeStore[id]; if (!c) return '';
    const l = c[RL.state.lang] ? RL.state.lang : (c.java ? 'java' : 'py');
    return c[l].replace(/^\n/, '');
  };
  RL.setLang = function (l) {
    RL.state.lang = l; document.documentElement.dataset.lang = l; RL.save(); RL.syncLangButtons(); RL.emit('lang', l);
  };
  RL.syncLangButtons = function () {
    RL.$$('[data-set-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.setLang === RL.state.lang)));
  };

  /* ---------- lesson blocks ---------- */
  RL.labMini = function (id) {
    const lab = RL.labs[id];
    return lab && lab.glyph ? lab.glyph : '<svg></svg>';
  };
  RL.renderBlocks = function (blocks) {
    return blocks.map(b => {
      if (typeof b === 'string') return `<p>${b}</p>`;
      if (b.h) return `<h3>${b.h}</h3>`;
      if (b.code) return RL.codeBlock(b.code, b.cap);
      if (b.list) return `<ul>${b.list.map(x => `<li>${x}</li>`).join('')}</ul>`;
      if (b.ol) return `<ol>${b.ol.map(x => `<li>${x}</li>`).join('')}</ol>`;
      if (b.note) return `<div class="note ${b.kind || ''}">${b.title ? `<b class="nl">${b.title}</b>` : ''}${b.note}</div>`;
      if (b.trace) return `<pre class="trace">${RL.esc(b.trace.replace(/^\n/, ''))}</pre>`;
      if (b.table) return `<div class="tbl-wrap"><table class="tbl"><thead><tr>${b.table.head.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>${b.table.rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      if (b.lab) {
        const lab = RL.labs[b.lab];
        const q = b.q ? '?' + b.q : '';
        return `<a class="lab-cta" href="#/lab/${b.lab}${q}">${RL.labMini(b.lab)}<div><b>${lab ? RL.esc(lab.title) : b.lab} laboratoriyasi</b><span>${b.text || ''}</span></div></a>`;
      }
      if (b.html) return b.html;
      return '';
    }).join('');
  };

  /* ---------- progress model ---------- */
  RL.sprint = n => RL.sprints.find(s => s.n === +n);
  RL.lessonId = (s, i) => `s${s.n}l${i}`;
  RL.problemId = p => p.id;
  RL.taskStatus = t => RL.state.tasks[t.id] || 'todo';
  RL.setTask = function (id, st, silent) {
    if (RL.state.tasks[id] === st) return;
    RL.state.tasks[id] = st; if (!silent) RL.save();
  };
  RL.allTasks = () => RL.sprints.flatMap(s => s.tasks.map(t => Object.assign({ sprint: s.n }, t)));
  RL.allProblems = () => RL.sprints.flatMap(s => s.problems.map(p => Object.assign({ sprint: s.n }, p)));

  RL.markRead = function (sprint, i, val) {
    const id = RL.lessonId(sprint, i);
    if (val) RL.state.read[id] = true; else delete RL.state.read[id];
    sprint.tasks.forEach(t => { if (t.lesson === i) RL.setTask(t.id, val ? 'done' : 'todo', true); });
    RL.save();
  };
  RL.markSolved = function (pid, val) {
    if (val) RL.state.solved[pid] = Date.now(); else delete RL.state.solved[pid];
    RL.sprints.forEach(s => s.tasks.forEach(t => { if (t.problem === pid) RL.setTask(t.id, val ? 'done' : 'todo', true); }));
    RL.save();
  };
  RL.recordQuiz = function (sprint, pct) {
    const prev = RL.state.quiz[sprint.n] || 0;
    if (pct > prev) RL.state.quiz[sprint.n] = pct;
    if (pct >= 70) sprint.tasks.forEach(t => { if (t.quiz) RL.setTask(t.id, 'done', true); });
    RL.save();
  };
  RL.markLab = function (id) {
    if (!RL.state.labs[id]) { RL.state.labs[id] = Date.now(); }
    RL.sprints.forEach(s => s.tasks.forEach(t => { if (t.lab === id && RL.taskStatus(t) === 'todo') RL.setTask(t.id, 'doing', true); }));
    RL.save();
  };
  RL.sprintProgress = function (s) {
    const total = s.tasks.reduce((a, t) => a + t.pts, 0);
    const done = s.tasks.reduce((a, t) => a + (RL.taskStatus(t) === 'done' ? t.pts : 0), 0);
    return { total, done, pct: total ? Math.round(done * 100 / total) : 0 };
  };
  RL.totalProgress = function () {
    let total = 0, done = 0;
    RL.sprints.forEach(s => { const p = RL.sprintProgress(s); total += p.total; done += p.done; });
    return { total, done, pct: total ? Math.round(done * 100 / total) : 0 };
  };
  RL.currentSprint = function () {
    const s = RL.sprints.find(s => RL.sprintProgress(s).pct < 100);
    return s || RL.sprints[RL.sprints.length - 1];
  };

  RL.TASK_TYPES = {
    oqish: { label: 'Oʻqish', c: 'var(--d3)' },
    lab: { label: 'Laboratoriya', c: 'var(--sun)' },
    kod: { label: 'Kod yozish', c: 'var(--d1)' },
    masala: { label: 'Masala', c: 'var(--leaf)' },
    test: { label: 'Test', c: 'var(--rose)' }
  };
  RL.LEVELS = { easy: 'Oson', mid: 'Oʻrta', hard: 'Qiyin' };
  RL.PLATFORMS = { lc: 'LeetCode', cf: 'Codeforces', cses: 'CSES', spoj: 'SPOJ' };
  RL.problemUrl = function (p) {
    if (p.url) return p.url;
    if (p.pl === 'lc') return `https://leetcode.com/problems/${p.slug}/`;
    if (p.pl === 'cf') { const m = String(p.code).match(/^(\d+)([A-Z]\d?)$/); return m ? `https://codeforces.com/problemset/problem/${m[1]}/${m[2]}` : '#'; }
    if (p.pl === 'cses') return `https://cses.fi/problemset/task/${p.code}`;
    if (p.pl === 'spoj') return `https://www.spoj.com/problems/${p.code}/`;
    return '#';
  };

  /* sprint registration helper: builds ids */
  RL.addSprint = function (s) {
    s.problems = (s.problems || []).map(p => Object.assign({ id: `${p.pl}-${p.code || p.slug}` }, p));
    s.tasks = (s.tasks || []).map((t, i) => Object.assign({ id: `s${s.n}t${i + 1}` }, t));
    s.tasks = s.lessons.map((l, i) => ({ id: `s${s.n}r${i + 1}`, title: `Dars: ${l.t}`, type: 'oqish', pts: l.pts || 1, lesson: i })).concat(s.tasks);
    s.problems.forEach(p => { if (p.task !== false) s.tasks.push({ id: `s${s.n}p-${p.id}`, title: `${RL.PLATFORMS[p.pl]} ${p.code ? p.code + ' ' : ''}${p.name}`, type: 'masala', pts: p.lv === 'hard' ? 5 : p.lv === 'mid' ? 3 : 2, problem: p.id }); });
    s.tasks.push({ id: `s${s.n}quiz`, title: `Sprint ${s.n} testidan kamida 70% olish`, type: 'test', pts: 2, quiz: true });
    RL.sprints.push(s);
    RL.sprints.sort((a, b) => a.n - b.n);
  };
})();
