(function () {
  'use strict';
  const { esc } = RL;

  const FNS = {
    fib: {
      name: `Fibonachchi fib(n)`, nLabel: 'n', min: 1, max: 9, def: 6,
      key: n => `${n}`, label: n => `f(${n})`,
      code: {
        java: `long fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}`,
        py: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)`
      },
      start: n => [n],
      base: n => n <= 1 ? n : null,
      kids: n => [[n - 1], [n - 2]],
      combine: v => v[0] + v[1]
    },
    climb: {
      name: `Zinapoya ways(n)`, nLabel: 'n', min: 1, max: 9, def: 5,
      key: n => `${n}`, label: n => `w(${n})`,
      code: {
        java: `int ways(int n) {\n    if (n <= 1) return 1;\n    return ways(n - 1) + ways(n - 2);\n}`,
        py: `def ways(n):\n    if n <= 1:\n        return 1\n    return ways(n - 1) + ways(n - 2)`
      },
      start: n => [n],
      base: n => n <= 1 ? 1 : null,
      kids: n => [[n - 1], [n - 2]],
      combine: v => v[0] + v[1]
    },
    grid: {
      name: `Panjara yoʻllari paths(r, c)`, nLabel: 'oʻlcham', min: 2, max: 4, def: 3,
      key: (r, c) => `${r},${c}`, label: (r, c) => `(${r},${c})`,
      code: {
        java: `long paths(int r, int c) {\n    if (r == m - 1 && c == m - 1) return 1;\n    long s = 0;\n    if (r + 1 < m) s += paths(r + 1, c);\n    if (c + 1 < m) s += paths(r, c + 1);\n    return s;\n}`,
        py: `def paths(r, c):\n    if r == m - 1 and c == m - 1:\n        return 1\n    s = 0\n    if r + 1 < m:\n        s += paths(r + 1, c)\n    if c + 1 < m:\n        s += paths(r, c + 1)\n    return s`
      },
      start: m => [0, 0],
      base: (r, c, m) => (r === m - 1 && c === m - 1) ? 1 : null,
      kids: (r, c, m) => { const k = []; if (r + 1 < m) k.push([r + 1, c]); if (c + 1 < m) k.push([r, c + 1]); return k; },
      combine: v => v.reduce((a, b) => a + b, 0)
    },
    binom: {
      name: `Binomial C(n, k)`, nLabel: 'n', min: 2, max: 7, def: 5, hasK: true,
      key: (n, k) => `${n},${k}`, label: (n, k) => `C(${n},${k})`,
      code: {
        java: `long C(int n, int k) {\n    if (k == 0 || k == n) return 1;\n    return C(n - 1, k - 1) + C(n - 1, k);\n}`,
        py: `def C(n, k):\n    if k == 0 or k == n:\n        return 1\n    return C(n - 1, k - 1) + C(n - 1, k)`
      },
      start: (n, k) => [n, k],
      base: (n, k) => (k === 0 || k === n) ? 1 : null,
      kids: (n, k) => [[n - 1, k - 1], [n - 1, k]],
      combine: v => v[0] + v[1]
    }
  };

  function build(F, args, extra, memoOn) {
    const nodes = [], ev = [];
    const memo = new Map();
    let step = 0;
    function call(a, parent, depth) {
      const key = F.key.apply(null, a);
      const node = { id: nodes.length, parent, depth, label: F.label.apply(null, a), key, enter: step, exit: null, val: null };
      nodes.push(node);
      if (memoOn && memo.has(key)) {
        node.kind = 'memo';
        ev[step++] = { id: node.id, t: 'memo' };
        node.val = memo.get(key);
        node.exit = step; ev[step++] = { id: node.id, t: 'exit' };
        return node.val;
      }
      ev[step++] = { id: node.id, t: 'enter' };
      const b = F.base.apply(null, a.concat(extra));
      let v;
      if (b !== null) v = b;
      else v = F.combine(F.kids.apply(null, a.concat(extra)).map(k => call(k, node.id, depth + 1)));
      node.val = v; node.exit = step; ev[step++] = { id: node.id, t: 'exit' };
      if (memoOn) memo.set(key, v);
      return v;
    }
    const result = call(args, -1, 0);
    return { nodes, ev, result };
  }

  RL.labs.tree = {
    title: `Rekursiya daraxti`,
    desc: `Bir necha marta oʻzini chaqiradigan funksiyalar daraxti. Memoization yoqilganda takroriy shoxlar qanday kesilishini koʻring.`,
    sprints: [3, 5],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><path class="g-s" stroke-width="1.6" d="M60 13L36 32M60 13L84 32M36 32L24 51M36 32L48 51M84 32L96 51"/><rect class="g-d2" x="51" y="6" width="18" height="12" rx="3"/><rect class="g-d3" x="27" y="26" width="18" height="12" rx="3"/><rect class="g-sun" x="75" y="26" width="18" height="12" rx="3"/><rect class="g-d4" x="15" y="45" width="18" height="12" rx="3"/><rect class="g-d4" x="39" y="45" width="18" height="12" rx="3"/><rect class="g-leaf" x="87" y="45" width="18" height="12" rx="3"/></svg>`,
    mount(root, params) {
      let fnKey = FNS[params.fn] ? params.fn : 'fib';
      let memoOn = params.memo === '1';
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Funksiya<select class="input" data-fn>${Object.keys(FNS).map(k => `<option value="${k}"${k === fnKey ? ' selected' : ''}>${FNS[k].name}</option>`).join('')}</select></label>
          <label class="field"><span data-nlabel>n</span><input class="input" type="number" data-n style="width:80px"></label>
          <label class="field" data-kwrap>k<input class="input" type="number" data-k style="width:80px"></label>
          <label class="check"><input type="checkbox" data-memo ${memoOn ? 'checked' : ''}> Memoization</label>
          <label class="check"><input type="checkbox" data-fit checked> Ekranga sigʻdirish</label>
          <button class="btn sm" data-run>Qurish</button>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage" style="padding:12px"><div class="tree-scroll fit" data-tree></div>
              <div class="legend"><span><i style="background:var(--sun)"></i>joriy chaqiruv</span><span><i style="border:2px dashed var(--leaf)"></i>keshdan olindi</span><span><i style="background:var(--t0);border:1px solid var(--d3)"></i>qaytgan (qiymati pastida)</span></div>
            </div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Hisob</h3><div class="stats">
              <div class="sun"><b data-s="calls">0</b>Chaqiruvlar</div>
              <div><b data-s="uniq">0</b>Turli holatlar</div>
              <div class="leaf"><b data-s="hits">0</b>Kesh hitlari</div>
              <div><b data-s="depth">0</b>Chuqurlik</div>
            </div><p class="small muted" data-total style="margin:12px 0 0"></p></div>
            <div class="panel"><h3>Har bir holat necha marta chaqirildi</h3><div class="count-bars" data-bars></div></div>
            <div class="panel"><h3>Kod</h3><div data-code></div></div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      let T, view, player;

      function setInputs() {
        const F = FNS[fnKey];
        $('[data-nlabel]').textContent = F.nLabel;
        const n = $('[data-n]'); n.min = F.min; n.max = F.max;
        n.value = RL.clamp(parseInt(params.n, 10) || F.def, F.min, F.max);
        $('[data-kwrap]').style.display = F.hasK ? '' : 'none';
        const k = $('[data-k]'); k.min = 0; k.max = n.value; k.value = RL.clamp(parseInt(params.k, 10) || 2, 0, +n.value);
      }
      function codeHTML() {
        const F = FNS[fnKey];
        return RL.codeBlock({ java: F.code.java, py: F.code.py });
      }
      function run(autoplay) {
        const F = FNS[fnKey];
        const n = RL.clamp(parseInt($('[data-n]').value, 10) || F.def, F.min, F.max); $('[data-n]').value = n;
        const k = RL.clamp(parseInt($('[data-k]').value, 10) || 0, 0, n); $('[data-k]').value = k;
        memoOn = $('[data-memo]').checked;
        const args = fnKey === 'grid' ? [0, 0] : fnKey === 'binom' ? [n, k] : [n];
        const extra = fnKey === 'grid' ? [n] : [];
        T = build(F, args, extra, memoOn);
        const other = build(F, args, extra, !memoOn);
        const anyKid = new Uint8Array(T.nodes.length); T.nodes.forEach(x => { if (x.parent >= 0) anyKid[x.parent] = 1; });
        const wide = T.nodes.filter(x => !anyKid[x.id]).length > 26;
        $('[data-fit]').checked = !wide;
        $('[data-tree]').classList.toggle('fit', !wide);
        view = RL.TreeView($('[data-tree]'), T.nodes, { w: fnKey === 'binom' ? 60 : 50, h: 28, gx: 10, gy: 62 });
        const steps = T.ev.length + 1;
        if (!player) player = RL.Player($('[data-player]'), { count: steps, goto: render });
        else player.setCount(steps, 0);
        $('[data-code]').innerHTML = codeHTML(); RL.syncLangButtons();
        $('[data-total]').innerHTML = `Natija: <b>${T.result}</b>. Jami chaqiruvlar: <b>${T.nodes.length}</b> ${memoOn ? 'memo bilan' : 'memosiz'}; ${memoOn ? 'memosiz' : 'memo bilan'} esa <b>${other.nodes.length}</b> boʻlardi.`;
        render(0);
        if (autoplay) player.play();
      }
      function render(i) {
        const step = i - 1;
        const e = T.ev[step];
        view.set(step, e ? e.id : -1);
        const counts = new Map();
        let calls = 0, hits = 0, depth = 0;
        T.nodes.forEach(nd => {
          if (nd.enter <= step) {
            calls++;
            if (nd.kind === 'memo') hits++;
            counts.set(nd.key, (counts.get(nd.key) || 0) + 1);
            if (nd.exit == null || nd.exit > step) depth = Math.max(depth, nd.depth + 1);
          }
        });
        $('[data-s=calls]').textContent = calls;
        $('[data-s=uniq]').textContent = counts.size;
        $('[data-s=hits]').textContent = hits;
        $('[data-s=depth]').textContent = depth;
        const F = FNS[fnKey];
        const keys = Array.from(new Set(T.nodes.map(x => x.key)));
        const max = Math.max(1, ...keys.map(k => counts.get(k) || 0));
        $('[data-bars]').innerHTML = keys.map(kk => {
          const c = counts.get(kk) || 0;
          const lab = F.label.apply(null, kk.split(',').map(Number));
          return `<div><span>${esc(lab)}</span><i class="${c > 1 ? 'many' : ''}" style="width:${c ? Math.max(4, c / max * 100) : 0}%"></i><span>${c}</span></div>`;
        }).join('');
        let msg;
        if (!e) msg = `<b>${esc(T.nodes[0].label)}</b> ni hisoblaymiz. Har qadamda bitta chaqiruv ochiladi yoki yopiladi.`;
        else {
          const nd = T.nodes[e.id];
          if (e.t === 'enter') msg = `<b>${esc(nd.label)}</b> chaqirildi (chuqurlik ${nd.depth})`;
          else if (e.t === 'memo') msg = `<b>${esc(nd.label)}</b> keshda bor: ${nd.val} — qayta hisoblanmaydi`;
          else msg = `<b>${esc(nd.label)} = ${nd.val}</b> qaytdi`;
        }
        $('[data-msg]').innerHTML = msg;
      }

      setInputs(); run(false);
      $('[data-fn]').addEventListener('change', e => { fnKey = e.target.value; params = {}; setInputs(); run(false); });
      $('[data-run]').addEventListener('click', () => run(true));
      $('[data-memo]').addEventListener('change', () => run(false));
      $('[data-fit]').addEventListener('change', e => { $('[data-tree]').classList.toggle('fit', e.target.checked); });
      $('[data-n]').addEventListener('change', () => { const k = $('[data-k]'); k.max = $('[data-n]').value; run(false); });
      $('[data-k]').addEventListener('change', () => run(false));
      return () => { player && player.destroy(); };
    },
    explain: {
      text: [
        `Daraxtdagi har tugun — bitta funksiya chaqiruvi. Tugun ostidagi yashil son — u qaytargan qiymat. Oʻng paneldagi grafik har bir holat (argument) necha marta hisoblanganini koʻrsatadi: qizil chiziqlar — takroriy ish.`,
        `<strong>Memoization</strong> ni yoqing: holat birinchi marta hisoblangandan keyin keshga yoziladi, keyingi chaqiruvlar (uzuq yashil chegara) bolasiz barg boʻlib qoladi. fib(n) uchun chaqiruvlar ≈ 1.618ⁿ dan 2n − 1 ga tushadi.`,
        `<strong>Panjara yoʻllari</strong> da tugun nomi (r, c) — holat. Binomial C(n, k) da esa Paskal uchburchagi oʻz-oʻzidan paydo boʻladi.`
      ]
    }
  };
})();
