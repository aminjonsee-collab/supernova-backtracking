(function () {
  'use strict';
  const { esc, icon } = RL;

  /* ---------- Player: step-through controls shared by every lab ---------- */
  RL.Player = function (root, opts) {
    let count = Math.max(1, opts.count || 1), i = 0, playing = false, timer = null, speed = opts.speed || 5;
    root.innerHTML = `<div class="player" role="group" aria-label="Animatsiya boshqaruvi">
      <button class="pb" data-p="start" title="Boshiga (Home)" aria-label="Boshiga">${icon.start}</button>
      <button class="pb" data-p="back" title="Bir qadam orqaga (←)" aria-label="Bir qadam orqaga">${icon.back}</button>
      <button class="pb play" data-p="play" title="Ijro yoki pauza (Space)" aria-label="Ijro">${icon.play}</button>
      <button class="pb" data-p="fwd" title="Bir qadam oldinga (→)" aria-label="Bir qadam oldinga">${icon.fwd}</button>
      <button class="pb" data-p="end" title="Oxiriga (End)" aria-label="Oxiriga">${icon.end}</button>
      <input class="scrub" type="range" min="0" max="${count - 1}" value="0" aria-label="Qadam">
      <span class="pcount"></span>
      <label class="speed">Tezlik <input type="range" min="1" max="10" value="${speed}" aria-label="Tezlik"></label>
    </div>`;
    const playBtn = root.querySelector('[data-p=play]');
    const scrub = root.querySelector('.scrub');
    const pcount = root.querySelector('.pcount');
    const speedIn = root.querySelector('.speed input');
    const DELAY = [0, 1100, 800, 560, 380, 250, 160, 95, 50, 22, 10];
    const perTick = () => speed >= 10 ? Math.max(1, Math.ceil(count / 500)) : speed >= 9 ? Math.max(1, Math.ceil(count / 2500)) : 1;

    function go(n) {
      n = RL.clamp(n, 0, count - 1);
      i = n; opts.goto(i); sync();
    }
    function sync() {
      scrub.value = i;
      pcount.textContent = `${i + 1} / ${count}`;
    }
    function tick() {
      if (!playing) return;
      if (i >= count - 1) { pause(); return; }
      go(i + perTick());
      if (i >= count - 1) { pause(); if (opts.onEnd) opts.onEnd(); return; }
      timer = setTimeout(tick, DELAY[speed]);
    }
    function play() {
      if (count <= 1) return;
      if (i >= count - 1) go(0);
      playing = true; playBtn.innerHTML = icon.pause; playBtn.setAttribute('aria-label', 'Pauza');
      clearTimeout(timer); timer = setTimeout(tick, Math.min(250, DELAY[speed]));
    }
    function pause() {
      playing = false; clearTimeout(timer);
      playBtn.innerHTML = icon.play; playBtn.setAttribute('aria-label', 'Ijro');
    }
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-p]'); if (!b) return;
      const p = b.dataset.p;
      if (p === 'play') playing ? pause() : play();
      else { pause(); if (p === 'start') go(0); if (p === 'end') go(count - 1); if (p === 'back') go(i - 1); if (p === 'fwd') go(i + 1); }
    });
    scrub.addEventListener('input', () => { pause(); go(+scrub.value); });
    speedIn.addEventListener('input', () => { speed = +speedIn.value; });
    function onKey(e) {
      const t = e.target;
      if (t && (t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || (t.tagName === 'INPUT' && t.type !== 'range') || t.isContentEditable)) return;
      if (document.getElementById('palette') && !document.getElementById('palette').hidden) return;
      if (e.key === ' ' && !(t && t.tagName === 'BUTTON')) { e.preventDefault(); playing ? pause() : play(); }
      else if (e.key === 'ArrowRight' && t.type !== 'range') { e.preventDefault(); pause(); go(i + 1); }
      else if (e.key === 'ArrowLeft' && t.type !== 'range') { e.preventDefault(); pause(); go(i - 1); }
      else if (e.key === 'Home' && t.type !== 'range') { pause(); go(0); }
      else if (e.key === 'End' && t.type !== 'range') { pause(); go(count - 1); }
    }
    document.addEventListener('keydown', onKey);
    sync();
    return {
      get index() { return i; },
      get count() { return count; },
      setCount(n, idx) { pause(); count = Math.max(1, n); scrub.max = count - 1; go(idx || 0); },
      go, play, pause,
      destroy() { pause(); document.removeEventListener('keydown', onKey); }
    };
  };

  /* ---------- TreeView: tidy recursion / state-space tree ---------- */
  RL.TreeView = function (host, nodes, o) {
    o = Object.assign({ w: 62, h: 30, gx: 10, gy: 66, top: 12 }, o || {});
    const kids = nodes.map(() => []);
    let maxD = 0;
    nodes.forEach(n => { if (n.parent >= 0) kids[n.parent].push(n.id); maxD = Math.max(maxD, n.depth); });
    const X = [], Y = [];
    let leaf = 0;
    const stack = [[0, 0]];
    while (stack.length) {
      const top = stack[stack.length - 1];
      const [id, k] = top;
      if (k < kids[id].length) { top[1]++; stack.push([kids[id][k], 0]); continue; }
      stack.pop();
      if (!kids[id].length) X[id] = leaf++ * (o.w + o.gx) + o.w / 2 + o.gx / 2;
      else X[id] = (X[kids[id][0]] + X[kids[id][kids[id].length - 1]]) / 2;
      Y[id] = nodes[id].depth * o.gy + o.h / 2 + o.top;
    }
    const W = Math.max(leaf, 1) * (o.w + o.gx), H = (maxD + 1) * o.gy + o.top;
    let edges = '', labels = '', gs = '';
    nodes.forEach(n => {
      if (n.parent >= 0) {
        const px = X[n.parent], py = Y[n.parent] + o.h / 2, cx = X[n.id], cy = Y[n.id] - o.h / 2, my = (py + cy) / 2;
        edges += `<path class="edge${n.kind === 'prune' ? ' prune' : ''}" data-i="${n.id}" d="M${px},${py} C${px},${my} ${cx},${my} ${cx},${cy}"/>`;
        if (n.elabel != null) labels += `<text class="elab" data-i="${n.id}" x="${(px + cx) / 2 + (cx === px ? 10 : 0)}" y="${my + 4}" style="paint-order:stroke;stroke:var(--sunk);stroke-width:4px">${esc(n.elabel)}</text>`;
      }
      gs += `<g class="tn${n.kind ? ' k-' + n.kind : ''}" data-i="${n.id}" transform="translate(${X[n.id] - o.w / 2},${Y[n.id] - o.h / 2})" style="--nc:${RL.depthColor(n.depth + 1)}"><title>${esc(n.title || n.label)}</title><rect width="${o.w}" height="${o.h}" rx="7"/><text x="${o.w / 2}" y="${o.h / 2 + 1}">${esc(n.label)}</text>${n.val != null ? `<text class="tv" x="${o.w / 2}" y="${o.h + 11}" style="opacity:0">${esc(n.val)}</text>` : ''}</g>`;
    });
    host.innerHTML = `<svg class="tree-svg" viewBox="0 0 ${W} ${H + 8}" width="${W}" height="${H + 8}" style="max-width:${Math.round(W * 1.15)}px;margin:0 auto" role="img" aria-label="Rekursiya daraxti">${edges}${labels}${gs}</svg>`;
    const G = Array.from(host.querySelectorAll('.tn'));
    const E = {}; host.querySelectorAll('.edge').forEach(e => E[e.dataset.i] = e);
    const L = {}; host.querySelectorAll('.elab').forEach(e => L[e.dataset.i] = e);
    return {
      width: W,
      set(step, active) {
        nodes.forEach((n, k) => {
          const g = G[k];
          const on = n.enter <= step;
          const ret = n.exit != null && n.exit <= step;
          g.classList.toggle('on', on);
          g.classList.toggle('ret', ret);
          g.classList.toggle('act', k === active);
          g.classList.toggle('memo', on && n.kind === 'memo');
          g.classList.toggle('sol', on && n.kind === 'sol' && (n.solAt == null || n.solAt <= step));
          g.classList.toggle('prune', on && n.kind === 'prune');
          const tv = g.querySelector('.tv'); if (tv) tv.style.opacity = ret ? 1 : 0;
          if (E[k]) E[k].classList.toggle('on', on);
          if (L[k]) L[k].classList.toggle('on', on);
        });
        if (active != null && active >= 0 && !host.classList.contains('fit')) {
          const x = X[active] * (host.querySelector('svg').getBoundingClientRect().width / W);
          if (x < host.scrollLeft + 40 || x > host.scrollLeft + host.clientWidth - 40) host.scrollLeft = Math.max(0, x - host.clientWidth / 2);
          const y = Y[active];
          if (y < host.scrollTop + 20 || y > host.scrollTop + host.clientHeight - 40) host.scrollTop = Math.max(0, y - host.clientHeight / 2);
        }
      }
    };
  };

  /* ---------- Quiz ---------- */
  RL.quizHTML = function (qs, prefix) {
    return qs.map((q, qi) => {
      const order = q._order || (q._order = RL.shuffle(q.o.map((_, k) => k)));
      return `<div class="q" data-q="${qi}">
        <div class="q-n">${prefix || 'Savol'} ${qi + 1}</div>
        <p class="q-text">${q.q}</p>
        ${q.code ? `<pre>${RL.highlight(q.code.replace(/^\n/, ''), q.lang || 'java')}</pre>` : ''}
        <div class="opts">${order.map((k, j) => `<button class="opt" data-opt="${k}"><span class="ok-k">${'ABCDEF'[j]}</span><span>${q.o[k]}</span></button>`).join('')}</div>
        <div class="why-slot"></div>
      </div>`;
    }).join('');
  };
  RL.answerQuestion = function (qEl, q, chosen) {
    const right = chosen === q.a;
    qEl.querySelectorAll('.opt').forEach(b => {
      const k = +b.dataset.opt; b.disabled = true;
      if (k === q.a) b.classList.add('right');
      else if (k === chosen) b.classList.add('wrong');
    });
    qEl.querySelector('.why-slot').innerHTML = `<div class="why${right ? '' : ' bad'}"><strong>${right ? 'Toʻgʻri.' : 'Notoʻgʻri.'}</strong> ${q.why || ''}</div>`;
    return right;
  };

  RL.progressRing = function (pct) {
    return `<div class="ring" style="--p:${pct}" role="img" aria-label="${pct}% bajarildi"><span>${pct}%</span></div>`;
  };
})();
