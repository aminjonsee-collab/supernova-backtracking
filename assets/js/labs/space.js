(function () {
  'use strict';
  const { esc } = RL;
  const fmt = a => `[${a.join(', ')}]`;

  const CODE = {
    subsets: {
      java: [['void go(int i) {', 'head'], ['    if (i == n) {', 'base'], ['        res.add(new ArrayList<>(path));', 'save'], ['        return;'], ['    }'], ['    path.add(a[i]);', 'choose'], ['    go(i + 1);'], ['    path.remove(path.size() - 1);', 'unchoose'], ['    go(i + 1);', 'skip'], ['}', 'end']],
      py: [['def go(i):', 'head'], ['    if i == n:', 'base'], ['        res.append(path[:])', 'save'], ['        return'], ['    path.append(a[i])', 'choose'], ['    go(i + 1)'], ['    path.pop()', 'unchoose'], ['    go(i + 1)', 'skip end']]
    },
    perm: {
      java: [['void go() {', 'head'], ['    if (path.size() == n) {', 'base'], ['        res.add(new ArrayList<>(path));', 'save'], ['        return;'], ['    }'], ['    for (int i = 0; i < n; i++) {', 'end'], ['        if (used[i]) continue;', 'check'], ['        used[i] = true; path.add(a[i]);', 'choose'], ['        go();'], ['        path.remove(path.size() - 1); used[i] = false;', 'unchoose'], ['    }'], ['}']],
      py: [['def go():', 'head'], ['    if len(path) == n:', 'base'], ['        res.append(path[:])', 'save'], ['        return'], ['    for i in range(n):', 'end'], ['        if used[i]:', 'check'], ['            continue'], ['        used[i] = True; path.append(a[i])', 'choose'], ['        go()'], ['        path.pop(); used[i] = False', 'unchoose']]
    },
    comb: {
      java: [['void go(int start) {', 'head'], ['    if (path.size() == k) {', 'base'], ['        res.add(new ArrayList<>(path));', 'save'], ['        return;'], ['    }'], ['    for (int i = start; LIMIT; i++) {', 'loop end'], ['        path.add(i);', 'choose'], ['        go(i + 1);'], ['        path.remove(path.size() - 1);', 'unchoose'], ['    }'], ['}']],
      py: [['def go(start):', 'head'], ['    if len(path) == k:', 'base'], ['        res.append(path[:])', 'save'], ['        return'], ['    for i in range(start, LIMIT):', 'loop end'], ['        path.append(i)', 'choose'], ['        go(i + 1)'], ['        path.pop()', 'unchoose']]
    },
    csum: {
      java: [['void go(int start, int remain) {', 'head'], ['    if (remain == 0) {', 'base'], ['        res.add(new ArrayList<>(path));', 'save'], ['        return;'], ['    }'], ['    for (int i = start; i < a.length; i++) {', 'end'], ['        if (a[i] > remain) break;', 'check'], ['        path.add(a[i]);', 'choose'], ['        go(i, remain - a[i]);'], ['        path.remove(path.size() - 1);', 'unchoose'], ['    }'], ['}']],
      py: [['def go(start, remain):', 'head'], ['    if remain == 0:', 'base'], ['        res.append(path[:])', 'save'], ['        return'], ['    for i in range(start, len(a)):', 'end'], ['        if a[i] > remain:', 'check'], ['            break'], ['        path.append(a[i])', 'choose'], ['        go(i, remain - a[i])'], ['        path.pop()', 'unchoose']]
    },
    paren: {
      java: [['void go(int open, int close) {', 'head'], ['    if (sb.length() == 2 * n) {', 'base'], ['        res.add(sb.toString());', 'save'], ['        return;'], ['    }'], ['    if (open < n) {', 'chkO'], ["        sb.append('(');", 'chooseO'], ['        go(open + 1, close);'], ['        sb.deleteCharAt(sb.length() - 1);', 'unchooseO'], ['    }'], ['    if (close < open) {', 'chkC'], ["        sb.append(')');", 'chooseC'], ['        go(open, close + 1);'], ['        sb.deleteCharAt(sb.length() - 1);', 'unchooseC'], ['    }'], ['}', 'end']],
      py: [['def go(s, open_, close):', 'head'], ['    if len(s) == 2 * n:', 'base'], ['        res.append(s)', 'save'], ['        return'], ['    if open_ < n:', 'chkO'], ['        go(s + "(", open_ + 1, close)', 'chooseO unchooseO'], ['    if close < open_:', 'chkC'], ['        go(s + ")", open_, close + 1)', 'chooseC unchooseC end']]
    }
  };

  const MODES = {
    subsets: { name: `Qism toʻplamlar (olish / olmaslik)`, fields: ['n'], nMax: 4, nDef: 3, cuts: false },
    perm: { name: `Oʻrin almashtirishlar (used[])`, fields: ['n'], nMax: 4, nDef: 3, cuts: false },
    comb: { name: `Kombinatsiyalar C(n, k)`, fields: ['n', 'k', 'prune'], nMax: 6, nDef: 5, cuts: true },
    csum: { name: `Combination Sum`, fields: ['cands', 'target'], cuts: true },
    paren: { name: `Toʻgʻri qavslar`, fields: ['n'], nMax: 4, nDef: 3, cuts: true }
  };

  function build(mode, o) {
    const nodes = [], ev = [], results = [];
    const enter = (parent, label, key, msg, path) => {
      const nd = { id: nodes.length, parent: parent ? parent.id : -1, depth: parent ? parent.depth + 1 : 0, label: String(label), enter: ev.length, exit: null, title: path };
      nodes.push(nd); ev.push({ id: nd.id, key, msg, path, t: 'enter' }); return nd;
    };
    const exit = (nd, key, msg, path) => { nd.exit = ev.length; ev.push({ id: nd.id, key, msg, path, t: 'exit' }); };
    const save = (nd, text, path) => { nd.kind = 'sol'; nd.solAt = ev.length; results.push({ at: ev.length, text }); ev.push({ id: nd.id, key: 'save', msg: `<b>Yechim:</b> ${esc(text)} — nusxasi natijaga qoʻshildi`, path, t: 'save' }); };
    const cut = (parent, label, key, msg, path) => {
      const nd = { id: nodes.length, parent: parent.id, depth: parent.depth + 1, label: String(label), enter: ev.length, exit: ev.length, kind: 'prune', title: msg };
      nodes.push(nd); ev.push({ id: nd.id, key, msg: `<b>Kesildi:</b> ${msg}`, path, t: 'cut' });
    };
    const showCuts = o.cuts;
    let root;
    if (mode === 'subsets') {
      const n = o.n, a = Array.from({ length: n }, (_, i) => i + 1), path = [];
      root = enter(null, '[ ]', 'head', `go(0) chaqirildi: path = []`, fmt(path));
      (function go(i, nd) {
        if (i === n) { save(nd, fmt(path), fmt(path)); return; }
        path.push(a[i]);
        const c1 = enter(nd, `+${a[i]}`, 'choose', `<b>choose:</b> ${a[i]} ni olamiz → path = ${fmt(path)}`, fmt(path));
        go(i + 1, c1);
        path.pop();
        exit(c1, 'unchoose', `<b>unchoose:</b> ${a[i]} ni olib tashlaymiz → path = ${fmt(path)}`, fmt(path));
        const c2 = enter(nd, `−${a[i]}`, 'skip', `${a[i]} ni olmasdan davom etamiz → path = ${fmt(path)}`, fmt(path));
        go(i + 1, c2);
        exit(c2, 'end', `go(${i + 1}) tugadi, ${i}-darajaga qaytamiz`, fmt(path));
      })(0, root);
    } else if (mode === 'perm') {
      const n = o.n, a = Array.from({ length: n }, (_, i) => i + 1), used = new Array(n).fill(false), path = [];
      root = enter(null, '[ ]', 'head', `go() chaqirildi: path = []`, fmt(path));
      (function go(nd) {
        if (path.length === n) { save(nd, fmt(path), fmt(path)); return; }
        for (let i = 0; i < n; i++) {
          if (used[i]) { if (showCuts) cut(nd, a[i], 'check', `${a[i]} allaqachon ishlatilgan (used)`, fmt(path)); continue; }
          used[i] = true; path.push(a[i]);
          const c = enter(nd, a[i], 'choose', `<b>choose:</b> ${a[i]} → path = ${fmt(path)}, used = {${a.filter((_, j) => used[j]).join(', ')}}`, fmt(path));
          go(c);
          path.pop(); used[i] = false;
          exit(c, 'unchoose', `<b>unchoose:</b> ${a[i]} qaytarildi → path = ${fmt(path)}`, fmt(path));
        }
      })(root);
    } else if (mode === 'comb') {
      const n = o.n, k = o.k, path = [];
      root = enter(null, '[ ]', 'head', `go(1) chaqirildi: ${n} tadan ${k} ta tanlaymiz`, fmt(path));
      (function go(start, nd) {
        if (path.length === k) { save(nd, fmt(path), fmt(path)); return; }
        const lim = o.prune ? n - (k - path.length) + 1 : n;
        for (let i = start; i <= lim; i++) {
          path.push(i);
          const c = enter(nd, i, 'choose', `<b>choose:</b> ${i} → path = ${fmt(path)}`, fmt(path));
          go(i + 1, c);
          path.pop();
          exit(c, 'unchoose', `<b>unchoose:</b> ${i} olindi → path = ${fmt(path)}`, fmt(path));
        }
        if (o.prune && showCuts) for (let i = Math.max(start, lim + 1); i <= n; i++) cut(nd, i, 'loop', `${i} dan keyin ${n - i} ta son qoladi, kerak esa ${k - path.length - 1} ta`, fmt(path));
        if (!o.prune && start > n && path.length < k) nd.dead = true;
      })(1, root);
    } else if (mode === 'csum') {
      const a = o.cands.slice().sort((x, y) => x - y), path = [];
      root = enter(null, '[ ]', 'head', `go(0, ${o.target}) chaqirildi; nomzodlar saralangan: ${fmt(a)}`, fmt(path));
      (function go(start, remain, nd) {
        if (remain === 0) { save(nd, fmt(path), fmt(path)); return; }
        for (let i = start; i < a.length; i++) {
          if (a[i] > remain) { if (showCuts) cut(nd, a[i], 'check', `${a[i]} > ${remain} → break: keyingilari ham katta`, fmt(path)); break; }
          path.push(a[i]);
          const c = enter(nd, a[i], 'choose', `<b>choose:</b> ${a[i]} → path = ${fmt(path)}, qoldi ${remain - a[i]}`, fmt(path));
          go(i, remain - a[i], c);
          path.pop();
          exit(c, 'unchoose', `<b>unchoose:</b> ${a[i]} olindi → qoldi ${remain}`, fmt(path));
        }
      })(0, o.target, root);
    } else if (mode === 'paren') {
      const n = o.n; let s = '';
      root = enter(null, '" "', 'head', `go(0, 0) chaqirildi: n = ${n}`, '""');
      (function go(open, close, nd) {
        if (s.length === 2 * n) { save(nd, s, `"${s}"`); return; }
        if (open < n) {
          s += '(';
          const c = enter(nd, '(', 'chooseO', `<b>choose:</b> "(" → "${s}" (open = ${open + 1})`, `"${s}"`);
          go(open + 1, close, c);
          s = s.slice(0, -1);
          exit(c, 'unchooseO', `<b>unchoose:</b> "(" olindi → "${s}"`, `"${s}"`);
        } else if (showCuts) cut(nd, '(', 'chkO', `open = n = ${n}: yana "(" qoʻyib boʻlmaydi`, `"${s}"`);
        if (close < open) {
          s += ')';
          const c = enter(nd, ')', 'chooseC', `<b>choose:</b> ")" → "${s}" (close = ${close + 1})`, `"${s}"`);
          go(open, close + 1, c);
          s = s.slice(0, -1);
          exit(c, 'unchooseC', `<b>unchoose:</b> ")" olindi → "${s}"`, `"${s}"`);
        } else if (showCuts) cut(nd, ')', 'chkC', `close = open = ${open}: ")" balansni buzadi`, `"${s}"`);
      })(0, 0, root);
    }
    exit(root, 'end', `Qidiruv tugadi: ${results.length} ta yechim.`, '');
    return { nodes, ev, results };
  }

  RL.labs.space = {
    title: `Holatlar daraxti`,
    desc: `Subsets, permutations, combinations, combination sum va qavslar uchun backtracking daraxti: choose, explore, unchoose va kesilgan shoxlar.`,
    sprints: [6, 8],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><path class="g-s" stroke-width="1.5" d="M60 11L32 30M60 11L88 30M32 30L20 50M32 30L44 50M88 30L76 50"/><path stroke="var(--rose)" stroke-width="1.5" stroke-dasharray="3 3" d="M88 30L100 50"/><circle class="g-d2" cx="60" cy="11" r="6"/><circle class="g-d3" cx="32" cy="30" r="6"/><circle class="g-sun" cx="88" cy="30" r="6"/><circle class="g-leaf" cx="20" cy="50" r="6"/><circle class="g-leaf" cx="44" cy="50" r="6"/><circle class="g-leaf" cx="76" cy="50" r="6"/><circle class="g-rose" cx="100" cy="50" r="6"/></svg>`,
    mount(root, params) {
      let mode = MODES[params.mode] ? params.mode : 'subsets';
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Masala<select class="input" data-mode>${Object.keys(MODES).map(k => `<option value="${k}"${k === mode ? ' selected' : ''}>${MODES[k].name}</option>`).join('')}</select></label>
          <label class="field" data-f="n">n<input class="input" type="number" data-n style="width:76px"></label>
          <label class="field" data-f="k">k<input class="input" type="number" data-k style="width:76px"></label>
          <label class="field" data-f="cands">Nomzodlar<input class="input" data-cands style="width:120px" value="2, 3, 5"></label>
          <label class="field" data-f="target">Target<input class="input" type="number" data-target min="1" max="12" style="width:76px" value="8"></label>
          <label class="check" data-f="prune"><input type="checkbox" data-prune checked> Pruning</label>
          <label class="check"><input type="checkbox" data-cuts> Kesilgan shoxlarni koʻrsatish</label>
          <label class="check"><input type="checkbox" data-fit checked> Sigʻdirish</label>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage" style="padding:12px"><div class="tree-scroll fit" data-tree></div>
              <div class="legend"><span><i style="background:var(--sun)"></i>joriy tugun</span><span><i style="background:var(--leaf-soft);border:1px solid var(--leaf)"></i>yechim</span><span><i style="background:var(--rose-soft);border:1px dashed var(--rose)"></i>kesilgan shox</span></div>
            </div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Joriy yoʻl (path)</h3><div class="pathbox" data-path>[]</div>
              <div class="stats" style="margin-top:14px">
                <div><b data-s="nodes">0</b>Ochilgan tugunlar</div>
                <div class="leaf"><b data-s="sols">0</b>Yechimlar</div>
                <div class="rose"><b data-s="cuts">0</b>Kesilgan</div>
                <div><b data-s="dead">0</b>Berk barglar</div>
              </div></div>
            <div class="panel"><h3>Topilgan yechimlar</h3><div class="results" data-res></div></div>
            <div class="panel"><h3>Kod</h3><div class="codeview" data-code></div></div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      let B, view, player;

      function fields() {
        const M = MODES[mode];
        root.querySelectorAll('[data-f]').forEach(el => { el.style.display = M.fields.includes(el.dataset.f) ? '' : 'none'; });
        if (M.nMax) {
          const n = $('[data-n]'); n.min = 1; n.max = M.nMax;
          n.value = RL.clamp(parseInt(params.n, 10) || M.nDef, 1, M.nMax);
        }
        const k = $('[data-k]'); k.min = 1; k.max = $('[data-n]').value; k.value = RL.clamp(parseInt(params.k, 10) || 3, 1, +$('[data-n]').value);
        $('[data-cuts]').checked = M.cuts;
      }
      function opts() {
        const M = MODES[mode];
        const o = { cuts: $('[data-cuts]').checked };
        if (M.nMax) { o.n = RL.clamp(parseInt($('[data-n]').value, 10) || M.nDef, 1, M.nMax); $('[data-n]').value = o.n; }
        if (mode === 'comb') { o.k = RL.clamp(parseInt($('[data-k]').value, 10) || 1, 1, o.n); $('[data-k]').value = o.k; $('[data-k]').max = o.n; o.prune = $('[data-prune]').checked; }
        if (mode === 'csum') {
          o.cands = Array.from(new Set($('[data-cands]').value.split(/[^0-9]+/).map(Number).filter(x => x >= 1 && x <= 12))).slice(0, 5);
          if (!o.cands.length) o.cands = [2, 3, 5];
          $('[data-cands]').value = o.cands.join(', ');
          o.target = RL.clamp(parseInt($('[data-target]').value, 10) || 8, 1, 12); $('[data-target]').value = o.target;
        }
        return o;
      }
      function codeLines() {
        const lang = RL.state.lang === 'py' ? 'py' : 'java';
        let lines = CODE[mode][lang];
        if (mode === 'comb') {
          const pr = $('[data-prune]').checked;
          const lim = lang === 'java' ? (pr ? 'i <= n - (k - path.size()) + 1' : 'i <= n') : (pr ? 'n - (k - len(path)) + 2' : 'n + 1');
          lines = lines.map(([t, k]) => [t.replace('LIMIT', lim), k]);
        }
        return { lines, lang };
      }
      function run() {
        const o = opts();
        B = build(mode, o);
        B.hasKid = new Uint8Array(B.nodes.length);
        B.nodes.forEach(x => { if (x.parent >= 0 && x.kind !== 'prune') B.hasKid[x.parent] = 1; });
        if (B.nodes.length > 700) { $('[data-msg]').innerHTML = `Daraxt juda katta (${B.nodes.length} tugun). Kichikroq qiymat tanlang.`; }
        const anyKid = new Uint8Array(B.nodes.length); B.nodes.forEach(x => { if (x.parent >= 0) anyKid[x.parent] = 1; });
        const leaves = B.nodes.filter(x => !anyKid[x.id]).length;
        const fit = leaves <= 30;
        $('[data-fit]').checked = fit; $('[data-tree]').classList.toggle('fit', fit);
        view = RL.TreeView($('[data-tree]'), B.nodes, { w: 36, h: 26, gx: 6, gy: 54 });
        if (!player) player = RL.Player($('[data-player]'), { count: B.ev.length + 1, goto: render, speed: 5 });
        else player.setCount(B.ev.length + 1, 0);
        render(0);
      }
      function render(i) {
        const step = i - 1, e = B.ev[step];
        view.set(step, e ? e.id : -1);
        const { lines, lang } = codeLines();
        const key = e ? e.key : null;
        $('[data-code]').innerHTML = lines.map(([t, k], j) => `<div class="${key && k && k.split(' ').includes(key) ? 'hl' : ''}"><span class="ln">${j + 1}</span><span>${RL.highlight(t, lang)}</span></div>`).join('');
        $('[data-path]').textContent = e && e.path != null && e.path !== '' ? e.path : (mode === 'paren' ? '""' : '[]');
        let nodes = 0, cuts = 0, dead = 0;
        B.nodes.forEach(nd => {
          if (nd.enter > step) return;
          if (nd.kind === 'prune') cuts++; else nodes++;
          if (nd.kind !== 'prune' && nd.kind !== 'sol' && nd.id !== 0 && nd.exit != null && nd.exit <= step && !B.hasKid[nd.id]) dead++;
        });
        const res = B.results.filter(r => r.at <= step);
        $('[data-s=nodes]').textContent = nodes;
        $('[data-s=sols]').textContent = res.length;
        $('[data-s=cuts]').textContent = cuts;
        $('[data-s=dead]').textContent = dead;
        $('[data-res]').innerHTML = res.length ? res.map(r => `<span>${esc(r.text)}</span>`).join('') : `<span style="background:none;color:var(--ink-3)">Hali yoʻq</span>`;
        $('[data-msg]').innerHTML = e ? e.msg : `Daraxt boʻsh. ▶ ni bosing: har qadamda bitta tanlov qilinadi yoki bekor qilinadi.`;
      }

      fields(); run();
      $('[data-mode]').addEventListener('change', e => { mode = e.target.value; params = {}; fields(); run(); });
      root.querySelector('.lab-controls').addEventListener('change', e => {
        if (e.target.matches('[data-mode]')) return;
        if (e.target.matches('[data-fit]')) { $('[data-tree]').classList.toggle('fit', e.target.checked); return; }
        run();
      });
      const offLang = RL.on('lang', () => player && render(player.index));
      return () => { player && player.destroy(); offLang(); };
    },
    explain: {
      text: [
        `Har bir tugun — qisman yechim, har bir qirra — bitta tanlov. Ildizdan joriy tugungacha boʻlgan yoʻl aynan <code>path</code> dagi elementlar. Kod panelida hozir bajarilayotgan qator yoritiladi: <strong>choose</strong>, rekursiv chaqiruv va <strong>unchoose</strong>.`,
        `Yashil barglar — natijaga qoʻshilgan yechimlar. Qizil uzuq tugunlar — sikl yoki shart tufayli umuman ochilmagan shoxlar. Kombinatsiyalarda pruning ni oʻchirsangiz, kesilgan shoxlar oʻrniga «berk barglar» paydo boʻladi — ular hech qanday yechim bermaydigan ortiqcha ish.`,
        `Combination Sum da nomzodlar saralangani uchun birinchi katta son topilishi bilan <code>break</code> qilinadi: undan keyingilar daraxtda umuman koʻrinmaydi.`
      ]
    }
  };
})();
