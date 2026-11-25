(function () {
  'use strict';
  const START = 5, TRY = 0, CONF = 1, PLACE = 2, REMOVE = 3, SOL = 4;
  const CAP = 150000;

  function generate(n, firstOnly, tries) {
    const T = [], R = [], C = [];
    const cols = new Uint8Array(n), d1 = new Uint8Array(2 * n), d2 = new Uint8Array(2 * n);
    let stop = false, capped = false;
    const push = (t, r, c) => { if (T.length >= CAP) { capped = true; stop = true; return; } T.push(t); R.push(r); C.push(c); };
    push(START, -1, -1);
    (function go(r) {
      if (stop) return;
      if (r === n) { push(SOL, -1, -1); if (firstOnly) stop = true; return; }
      for (let c = 0; c < n && !stop; c++) {
        const bad = cols[c] || d1[r + c] || d2[r - c + n];
        if (tries) push(bad ? CONF : TRY, r, c);
        if (bad) continue;
        cols[c] = d1[r + c] = d2[r - c + n] = 1;
        push(PLACE, r, c);
        go(r + 1);
        if (stop) return;
        cols[c] = d1[r + c] = d2[r - c + n] = 0;
        push(REMOVE, r, c);
      }
    })(0);
    return { T, R, C, capped, tries };
  }

  RL.labs.queens = {
    title: `N-Queens`,
    desc: `Farzinlarni qatorma-qator qoʻyish, urilish tekshiruvi va backtrack. Barcha yechimlarni toping va galereyada koʻring.`,
    sprints: [7],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/>${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(c => `<rect class="${(r + c) % 2 ? 'g-d4' : 'g-sheet'}" x="${36 + c * 12}" y="${8 + r * 12}" width="12" height="12"/>`).join('')).join('')}<circle class="g-ink" cx="54" cy="14" r="4"/><circle class="g-ink" cx="78" cy="26" r="4"/><circle class="g-ink" cx="42" cy="38" r="4"/><circle class="g-sun" cx="66" cy="50" r="4"/></svg>`,
    mount(root, params) {
      let n = RL.clamp(parseInt(params.n, 10) || 6, 4, 10);
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Taxta oʻlchami (n)<select class="input" data-n>${[4, 5, 6, 7, 8, 9, 10].map(k => `<option${k === n ? ' selected' : ''}>${k}</option>`).join('')}</select></label>
          <label class="check"><input type="checkbox" data-first> Birinchi yechimda toʻxtash</label>
          <label class="check"><input type="checkbox" data-tries checked> Urinishlarni koʻrsatish</label>
          <label class="check"><input type="checkbox" data-att> Urilgan kataklar</label>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage"><div class="chess" data-board></div></div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Hisob</h3><div class="stats">
              <div><b data-s="tries">0</b>Urinishlar</div>
              <div class="sun"><b data-s="place">0</b>Joylashtirish</div>
              <div class="rose"><b data-s="back">0</b>Backtrack</div>
              <div class="leaf"><b data-s="sol">0</b>Yechimlar</div>
            </div><p class="small muted" data-note style="margin:12px 0 0"></p></div>
            <div class="panel"><h3>Topilgan yechimlar</h3><div class="sols" data-sols><span class="small muted">Hali yoʻq</span></div></div>
            <div class="panel"><h3>Kod</h3>${RL.codeBlock({
              java: `void solve(int r) {\n    if (r == n) { count++; return; }\n    for (int c = 0; c < n; c++) {\n        if (cols[c] || d1[r + c] || d2[r - c + n - 1]) continue;\n        cols[c] = d1[r + c] = d2[r - c + n - 1] = true;\n        solve(r + 1);\n        cols[c] = d1[r + c] = d2[r - c + n - 1] = false;\n    }\n}`,
              py: `def solve(r):\n    if r == n:\n        found.append(pos[:])\n        return\n    for c in range(n):\n        if cols[c] or d1[r + c] or d2[r - c + n - 1]:\n            continue\n        cols[c] = d1[r + c] = d2[r - c + n - 1] = True\n        pos[r] = c\n        solve(r + 1)\n        cols[c] = d1[r + c] = d2[r - c + n - 1] = False`
            })}</div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      let G, player, cur = 0, q, cnt, cells, solIdx;

      function buildBoard() {
        const b = $('[data-board]');
        b.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        b.style.gridTemplateRows = `repeat(${n}, 1fr)`;
        let h = '';
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) h += `<div class="${(r + c) % 2 ? 'dk' : 'lt'}" data-r="${r}" data-c="${c}"></div>`;
        b.innerHTML = h;
        cells = Array.from(b.children);
      }
      function setup() {
        n = +$('[data-n]').value;
        G = generate(n, $('[data-first]').checked, $('[data-tries]').checked);
        q = new Int8Array(n).fill(-1);
        cnt = [0, 0, 0, 0, 0];
        cur = 0;
        solIdx = [];
        for (let i = 0; i < G.T.length; i++) if (G.T[i] === SOL) solIdx.push(i);
        buildBoard();
        if (!player) player = RL.Player($('[data-player]'), { count: G.T.length, goto, speed: 6 });
        else player.setCount(G.T.length, 0);
        $('[data-note]').textContent = G.capped ? `Koʻrsatish ${CAP.toLocaleString()} qadam bilan cheklangan. «Urinishlarni koʻrsatish» ni oʻchiring yoki birinchi yechimda toʻxtating.` : `Jami ${G.T.length.toLocaleString()} qadam.`;
        goto(0);
      }
      function apply(i, dir) {
        const t = G.T[i], r = G.R[i], c = G.C[i];
        if (t === PLACE) q[r] = dir > 0 ? c : -1;
        if (t === REMOVE) q[r] = dir > 0 ? -1 : c;
        if (t <= SOL) cnt[t] += dir;
      }
      function goto(i) {
        while (cur < i) { cur++; apply(cur, 1); }
        while (cur > i) { apply(cur, -1); cur--; }
        render();
      }
      function attacker(r, c) {
        for (let rr = 0; rr < n; rr++) {
          const cc = q[rr]; if (cc < 0 || rr === r) continue;
          if (cc === c || rr + cc === r + c || rr - cc === r - c) return [rr, cc];
        }
        return null;
      }
      function render() {
        const t = G.T[cur], r = G.R[cur], c = G.C[cur];
        const showAtt = $('[data-att]').checked;
        const att = showAtt ? new Uint8Array(n * n) : null;
        if (showAtt) for (let rr = 0; rr < n; rr++) if (q[rr] >= 0) for (let r2 = 0; r2 < n; r2++) for (let c2 = 0; c2 < n; c2++) {
          const cc = q[rr]; if (r2 === rr && c2 === cc) continue;
          if (r2 === rr || c2 === cc || r2 + c2 === rr + cc || r2 - c2 === rr - cc) att[r2 * n + c2] = 1;
        }
        const hit = t === CONF ? attacker(r, c) : null;
        cells.forEach((el, k) => {
          const rr = (k / n) | 0, cc = k % n;
          const isQ = q[rr] === cc;
          el.classList.toggle('q', isQ);
          el.classList.toggle('att', !!(att && att[k] && !isQ));
          el.classList.toggle('try', (t === TRY || t === PLACE) && rr === r && cc === c);
          el.classList.toggle('conf', (t === CONF && rr === r && cc === c) || (hit && hit[0] === rr && hit[1] === cc));
          const want = isQ ? 1 : 0;
          if ((el.firstChild ? 1 : 0) !== want) el.innerHTML = isQ ? RL.icon.queen : '';
        });
        $('[data-s=tries]').textContent = (G.tries ? cnt[TRY] + cnt[CONF] : cnt[PLACE]).toLocaleString();
        $('[data-s=place]').textContent = cnt[PLACE].toLocaleString();
        $('[data-s=back]').textContent = cnt[REMOVE].toLocaleString();
        $('[data-s=sol]').textContent = cnt[SOL];
        const R1 = r + 1, C1 = c + 1;
        const msgs = {
          [START]: `${n}×${n} taxta. Har qatorga bitta farzin: 1-qatordan boshlaymiz.`,
          [TRY]: `${R1}-qator, ${C1}-ustun: xavfsizmi?`,
          [CONF]: hit ? `${R1}-qator, ${C1}-ustun — <b>urilmoqda</b>: ${hit[0] + 1}-qatordagi farzin ${hit[1] === c ? 'shu ustunda' : 'shu diagonalda'}.` : `${R1}-qator, ${C1}-ustun — urilmoqda.`,
          [PLACE]: `Farzin <b>${R1}-qator, ${C1}-ustun</b>ga qoʻyildi → ${R1 < n ? `${R1 + 1}-qatorga oʻtamiz` : 'hamma qator toʻldi'}.`,
          [REMOVE]: `<b>Backtrack:</b> ${R1}-qatordagi farzin olindi, keyingi ustunni sinaymiz.`,
          [SOL]: `<b>Yechim #${cnt[SOL]} topildi!</b> Qidiruv davom etadi.`
        };
        $('[data-msg]').innerHTML = msgs[t] || '';
        renderSols();
      }
      let lastSolCount = -1;
      function renderSols() {
        const k = cnt[SOL];
        if (k === lastSolCount) return; lastSolCount = k;
        if (!k) { $('[data-sols]').innerHTML = `<span class="small muted">Hali yoʻq</span>`; return; }
        const show = solIdx.slice(0, Math.min(k, 120));
        $('[data-sols]').innerHTML = show.map((ei, j) => {
          const pos = solutionAt(ei);
          let cellsH = '';
          for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cellsH += `<i class="${pos[r] === c ? 'q' : (r + c) % 2 ? 'dk' : 'lt'}"></i>`;
          return `<button data-sol="${ei}" title="Yechim #${j + 1}" aria-label="Yechim ${j + 1}"><span class="minib" style="grid-template-columns:repeat(${n},1fr)">${cellsH}</span></button>`;
        }).join('') + (k > 120 ? `<span class="small muted">… va yana ${k - 120}</span>` : '');
      }
      const solCache = new Map();
      function solutionAt(ei) {
        if (solCache.has(ei)) return solCache.get(ei);
        const pos = new Int8Array(n).fill(-1);
        for (let i = 0; i <= ei; i++) { if (G.T[i] === PLACE) pos[G.R[i]] = G.C[i]; else if (G.T[i] === REMOVE) pos[G.R[i]] = -1; }
        solCache.set(ei, pos); return pos;
      }
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-sol]');
        if (b) { player.pause(); player.go(+b.dataset.sol); }
      });
      root.addEventListener('change', e => {
        if (e.target.matches('[data-n],[data-first],[data-tries]')) { solCache.clear(); lastSolCount = -1; setup(); }
        if (e.target.matches('[data-att]')) render();
      });
      setup();
      return () => { player && player.destroy(); };
    },
    explain: {
      text: [
        `Har qatorga bitta farzin qoʻyiladi. Sariq ramka — sinalayotgan katak, qizil — urilayotgan katak va unga hujum qilayotgan farzin. Qator oxirigacha mos ustun topilmasa — <strong>backtrack</strong>: oldingi qatordagi farzin olinadi va keyingi ustun sinaladi.`,
        `«Urilgan kataklar» ni yoqsangiz, qoʻyilgan farzinlar nazorat qiladigan barcha kataklar boʻyaladi — ular aynan <code>cols</code>, <code>d1</code>, <code>d2</code> massivlari saqlayotgan maʼlumot.`,
        `n = 8 da barcha 92 yechim uchun 2 056 ta joylashtirish va 15 720 ta urinish kerak; birinchi yechimgacha esa atigi 113 ta joylashtirish.`
      ]
    }
  };
})();
