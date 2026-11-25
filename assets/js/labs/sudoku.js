(function () {
  'use strict';
  const PUZZLES = {
    easy: { name: `Klassik (Wikipedia)`, s: `53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79` },
    hard: { name: `«Eng qiyin» (A. Inkala)`, s: `8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..` },
    random: { name: `Tasodifiy (≈30 ta raqam)` },
    empty: { name: `Boʻsh panjara` }
  };
  const CAP = 400000;
  const pc = m => { let c = 0; while (m) { m &= m - 1; c++; } return c; };
  const BOX = i => ((i / 27) | 0) * 3 + (((i % 9) / 3) | 0);

  function parse(s) { return Array.from(s).map(ch => (ch >= '1' && ch <= '9') ? +ch : 0); }

  function randomFull() {
    const g = new Array(81).fill(0);
    const row = new Int32Array(9), col = new Int32Array(9), box = new Int32Array(9);
    (function go(i) {
      if (i === 81) return true;
      const r = (i / 9) | 0, c = i % 9, b = BOX(i);
      for (const d of RL.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        const bit = 1 << d;
        if ((row[r] | col[c] | box[b]) & bit) continue;
        g[i] = d; row[r] |= bit; col[c] |= bit; box[b] |= bit;
        if (go(i + 1)) return true;
        g[i] = 0; row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
      }
      return false;
    })(0);
    return g;
  }
  function randomPuzzle() {
    const g = randomFull();
    RL.shuffle(Array.from({ length: 81 }, (_, i) => i)).slice(0, 51).forEach(i => { g[i] = 0; });
    return g;
  }

  function conflicts(g) {
    const bad = new Set();
    for (let i = 0; i < 81; i++) {
      if (!g[i]) continue;
      for (let j = i + 1; j < 81; j++) {
        if (g[j] !== g[i]) continue;
        if (((i / 9) | 0) === ((j / 9) | 0) || i % 9 === j % 9 || BOX(i) === BOX(j)) { bad.add(i); bad.add(j); }
      }
    }
    return bad;
  }

  function trace(grid, mrv) {
    const g = grid.slice();
    const row = new Int32Array(9), col = new Int32Array(9), box = new Int32Array(9);
    for (let i = 0; i < 81; i++) if (g[i]) { const b = 1 << g[i]; row[(i / 9) | 0] |= b; col[i % 9] |= b; box[BOX(i)] |= b; }
    const T = [], I = [], D = [];
    let capped = false, solved = false;
    const free = i => ~(row[(i / 9) | 0] | col[i % 9] | box[BOX(i)]) & 0x3FE;
    function pick() {
      if (!mrv) { for (let i = 0; i < 81; i++) if (!g[i]) return i; return -1; }
      let best = -1, bc = 10;
      for (let i = 0; i < 81; i++) if (!g[i]) {
        const c = pc(free(i));
        if (c < bc) { best = i; bc = c; if (c === 0) break; }
      }
      return best;
    }
    (function go() {
      const i = pick();
      if (i < 0) { solved = true; return true; }
      const m = free(i), r = (i / 9) | 0, c = i % 9, b = BOX(i);
      for (let d = 1; d <= 9; d++) {
        if (!(m >> d & 1)) continue;
        if (T.length >= CAP) { capped = true; return true; }
        const bit = 1 << d;
        g[i] = d; row[r] |= bit; col[c] |= bit; box[b] |= bit;
        T.push(0); I.push(i); D.push(d);
        if (go()) return true;
        g[i] = 0; row[r] ^= bit; col[c] ^= bit; box[b] ^= bit;
        T.push(1); I.push(i); D.push(d);
      }
      return false;
    })();
    return { T, I, D, capped, solved: solved && !capped };
  }

  RL.labs.sudoku = {
    title: `Sudoku yechuvchi`,
    desc: `Boʻsh katakka raqam qoʻyish, tekshirish va qaytish. Qatorma-qator va MRV rejimlarini qadamlar soni boʻyicha solishtiring.`,
    sprints: [7],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><rect class="g-sheet" x="33" y="5" width="54" height="54"/><path class="g-s" stroke-width="2" d="M33 5h54v54H33zM51 5v54M69 5v54M33 23h54M33 41h54"/><rect class="g-sun" x="52" y="24" width="16" height="16"/><rect class="g-ink" x="38" y="10" width="8" height="8" rx="2"/><rect class="g-d3" x="74" y="46" width="8" height="8" rx="2"/><rect class="g-ink" x="74" y="10" width="8" height="8" rx="2"/><rect class="g-d3" x="38" y="46" width="8" height="8" rx="2"/></svg>`,
    mount(root, params) {
      let pkey = PUZZLES[params.p] ? params.p : 'easy';
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Boshqotirma<select class="input" data-p>${Object.keys(PUZZLES).map(k => `<option value="${k}"${k === pkey ? ' selected' : ''}>${PUZZLES[k].name}</option>`).join('')}</select></label>
          <label class="field">Katak tanlash<select class="input" data-mode><option value="naive">Qatorma-qator</option><option value="mrv">MRV (eng kam variant)</option></select></label>
          <button class="btn sm" data-solve>Yechish</button>
          <button class="btn sm ghost" data-instant>Darhol natija</button>
          <button class="btn sm ghost" data-clear>Yechimni tozalash</button>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage"><div class="sudoku" data-grid></div></div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Hisob</h3><div class="stats">
              <div class="sun"><b data-s="place">0</b>Joylashtirish</div>
              <div class="rose"><b data-s="back">0</b>Backtrack</div>
              <div><b data-s="filled">0</b>Toʻlgan kataklar</div>
              <div><b data-s="depth">0</b>Rekursiya chuqurligi</div>
            </div></div>
            <div class="panel"><h3>Rejimlarni solishtirish</h3><div data-compare class="small muted">Bir xil boshqotirmani ikki rejimda yeching — natijalar shu yerda chiqadi.</div></div>
            <div class="panel"><h3>Qanday kiritish</h3><p class="small muted" style="margin:0">Katakni bosib 1–9 raqamini yozing, oʻchirish uchun Backspace. Oʻzgartirilgan panjara yangi boshqotirma sifatida yechiladi.</p></div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      const gridEl = $('[data-grid]');
      let given = new Array(81).fill(0), g, tr = null, cur = 0, player, lastHi = [], cmp = {};
      let cnt = [0, 0];

      gridEl.innerHTML = Array.from({ length: 81 }, (_, i) => `<input inputmode="numeric" maxlength="1" aria-label="${((i / 9) | 0) + 1}-qator, ${i % 9 + 1}-ustun" data-i="${i}" class="${((i / 9) | 0) % 3 === 2 && i < 72 ? 'rb' : ''}">`).join('');
      const inputs = Array.from(gridEl.children);

      function load(k) {
        pkey = k;
        given = k === 'random' ? randomPuzzle() : k === 'empty' ? new Array(81).fill(0) : parse(PUZZLES[k].s);
        cmp = {};
        reset();
      }
      function reset() {
        tr = null; g = given.slice(); cur = 0; cnt = [0, 0];
        if (player) player.setCount(1, 0);
        paintAll();
        $('[data-msg]').innerHTML = `Panjarada ${given.filter(Boolean).length} ta boshlangʻich raqam. «Yechish» ni bosing.`;
        stats();
        renderCompare();
      }
      function paintAll() {
        const bad = conflicts(g);
        inputs.forEach((el, i) => {
          el.value = g[i] ? g[i] : '';
          el.className = (((i / 9) | 0) % 3 === 2 && i < 72 ? 'rb ' : '') + (given[i] ? 'given' : '') + (bad.has(i) ? ' bad' : '');
          el.readOnly = false;
        });
      }
      function stats() {
        $('[data-s=place]').textContent = cnt[0].toLocaleString();
        $('[data-s=back]').textContent = cnt[1].toLocaleString();
        $('[data-s=filled]').textContent = g.filter(Boolean).length;
        $('[data-s=depth]').textContent = cnt[0] - cnt[1];
      }
      function renderCompare() {
        const rows = [['naive', 'Qatorma-qator'], ['mrv', 'MRV']].filter(([k]) => cmp[k] != null);
        $('[data-compare]').innerHTML = rows.length ? `<table class="tbl"><tbody>${rows.map(([k, l]) => `<tr><td>${l}</td><td style="text-align:right"><b>${cmp[k].toLocaleString()}</b> joylashtirish</td></tr>`).join('')}</tbody></table>` : `Bir xil boshqotirmani ikki rejimda yeching — natijalar shu yerda chiqadi.`;
      }
      function solve(autoplay) {
        g = given.slice();
        const bad = conflicts(g);
        if (bad.size) { paintAll(); $('[data-msg]').innerHTML = `<b>Panjarada ziddiyat bor</b> — qizil kataklarni tuzating.`; return; }
        const mode = $('[data-mode]').value;
        tr = trace(given, mode === 'mrv');
        const places = tr.T.reduce((a, t) => a + (t === 0 ? 1 : 0), 0);
        if (!tr.capped && tr.solved) { cmp[mode] = places; renderCompare(); }
        cur = 0; cnt = [0, 0];
        inputs.forEach(el => { el.readOnly = true; });
        if (!player) player = RL.Player($('[data-player]'), { count: tr.T.length + 1, goto, speed: 8 });
        else player.setCount(tr.T.length + 1, 0);
        goto(0);
        if (autoplay === 'end') player.go(tr.T.length);
        else if (autoplay) player.play();
      }
      function goto(i) {
        if (!tr) return;
        const dirty = new Set();
        while (cur < i) {
          const k = cur, t = tr.T[k], c = tr.I[k];
          g[c] = t === 0 ? tr.D[k] : 0; cnt[t]++; dirty.add(c); cur++;
        }
        while (cur > i) {
          cur--; const k = cur, t = tr.T[k], c = tr.I[k];
          g[c] = t === 0 ? 0 : tr.D[k]; cnt[t]--; dirty.add(c);
        }
        lastHi.forEach(c => dirty.add(c));
        const done = cur === tr.T.length && tr.solved;
        dirty.forEach(c => {
          const el = inputs[c];
          el.value = g[c] ? g[c] : '';
          el.classList.remove('cur', 'back');
          el.classList.toggle('solved', done && !given[c]);
        });
        lastHi = [];
        if (cur > 0) {
          const k = cur - 1, c = tr.I[k];
          inputs[c].classList.add(tr.T[k] === 0 ? 'cur' : 'back');
          lastHi.push(c);
        }
        if (done) inputs.forEach((el, c) => el.classList.toggle('solved', !given[c]));
        stats();
        let msg;
        if (cur === 0) msg = `Boshlangʻich holat. ${$('[data-mode]').value === 'mrv' ? 'Har qadamda eng kam variantli katak tanlanadi.' : 'Kataklar chapdan oʻngga, yuqoridan pastga toʻldiriladi.'}`;
        else {
          const k = cur - 1, c = tr.I[k], r1 = ((c / 9) | 0) + 1, c1 = c % 9 + 1;
          msg = tr.T[k] === 0 ? `(${r1}, ${c1}) katakka <b>${tr.D[k]}</b> qoʻyildi.` : `<b>Backtrack:</b> (${r1}, ${c1}) dagi ${tr.D[k]} olib tashlandi — davomida yechim yoʻq.`;
          if (cur === tr.T.length) msg = tr.capped ? `<b>Qadamlar chegarasiga yetildi</b> (${CAP.toLocaleString()}). MRV rejimini sinab koʻring.` : tr.solved ? `<b>Yechildi!</b> ${cnt[0].toLocaleString()} joylashtirish, ${cnt[1].toLocaleString()} backtrack.` : `<b>Yechim yoʻq</b> — boshqotirma ziddiyatli.`;
        }
        $('[data-msg]').innerHTML = msg;
      }

      gridEl.addEventListener('input', e => {
        const el = e.target; const i = +el.dataset.i;
        if (tr) return;
        const v = el.value.replace(/[^1-9]/g, '').slice(-1);
        el.value = v;
        given[i] = v ? +v : 0;
        cmp = {}; g = given.slice(); paintAll(); stats(); renderCompare();
      });
      gridEl.addEventListener('keydown', e => {
        const i = +e.target.dataset.i; if (isNaN(i)) return;
        const mv = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 9, ArrowUp: -9 }[e.key];
        if (mv && tr === null) { e.preventDefault(); e.stopPropagation(); const j = i + mv; if (j >= 0 && j < 81) inputs[j].focus(); }
      });
      gridEl.addEventListener('click', e => {
        if (tr && e.target.matches('input')) $('[data-msg]').innerHTML = `Tahrirlash uchun avval «Yechimni tozalash» ni bosing.`;
      });
      $('[data-p]').addEventListener('change', e => load(e.target.value));
      $('[data-mode]').addEventListener('change', () => { if (tr) solve(false); });
      $('[data-solve]').addEventListener('click', () => solve(true));
      $('[data-instant]').addEventListener('click', () => solve('end'));
      $('[data-clear]').addEventListener('click', reset);
      player = RL.Player($('[data-player]'), { count: 1, goto, speed: 8 });
      load(pkey);
      return () => { player && player.destroy(); };
    },
    explain: {
      text: [
        `Sariq katak — hozir raqam qoʻyilgan joy, qizil — backtrack (raqam olib tashlangan). Har bir raqam qator, ustun va 3×3 blokdagi bitmask orqali O(1) da tekshiriladi.`,
        `<strong>Qatorma-qator</strong> rejimida kataklar oddiy tartibda toʻldiriladi. <strong>MRV</strong> rejimida esa har qadamda eng kam varianti qolgan katak tanlanadi: bitta varianti bor kataklar darhol yopiladi, varianti nol katak esa xatoni erta koʻrsatadi.`,
        `«Eng qiyin» boshqotirmada farq: ~49.5 ming va ~10 ming joylashtirish. Klassikda — 4 208 va 51.`
      ]
    }
  };
})();
