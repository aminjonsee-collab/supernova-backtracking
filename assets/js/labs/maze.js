(function () {
  'use strict';
  const R = 17, C = 29;
  const S = R * 0 + 1 * C + 1, E = (R - 2) * C + (C - 2);
  const CARVE = 0, VISIT = 1, DEAD = 2, FOUND = 3, NONE = 4;

  function genEvents() {
    const ev = [];
    const vis = new Uint8Array(R * C);
    (function carve(r, c) {
      vis[r * C + c] = 1; ev.push(r * C + c);
      for (const [dr, dc] of RL.shuffle([[0, 2], [2, 0], [0, -2], [-2, 0]])) {
        const nr = r + dr, nc = c + dc;
        if (nr < 1 || nc < 1 || nr > R - 2 || nc > C - 2 || vis[nr * C + nc]) continue;
        ev.push((r + dr / 2) * C + (c + dc / 2));
        carve(nr, nc);
      }
    })(1, 1);
    return ev;
  }

  function solveEvents(wall) {
    const T = [], I = [];
    const seen = new Uint8Array(R * C);
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let found = false;
    (function go(i) {
      seen[i] = 1; T.push(VISIT); I.push(i);
      if (i === E) { found = true; T.push(FOUND); I.push(i); return true; }
      const r = (i / C) | 0, c = i % C;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nc < 0 || nr >= R || nc >= C) continue;
        const j = nr * C + nc;
        if (wall[j] || seen[j]) continue;
        if (go(j)) return true;
      }
      T.push(DEAD); I.push(i);
      return false;
    })(S);
    if (!found) { T.push(NONE); I.push(S); }
    return { T, I, found };
  }

  RL.labs.maze = {
    title: `Labirint (DFS)`,
    desc: `Labirint rekursiv backtracker bilan quriladi, keyin DFS-backtracking yoʻl qidiradi. Devorlarni oʻzingiz chizing.`,
    sprints: [7],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><path class="g-s" stroke-width="3" stroke-linecap="square" d="M24 8h72v48H24zM24 20h24M60 8v24M36 32h36M84 20v24M48 44h24M36 44v12"/><path stroke="var(--sun)" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" d="M30 14h24v12h24v-12h12v42"/></svg>`,
    mount(root) {
      root.innerHTML = `
        <div class="panel lab-controls">
          <button class="btn sm" data-gen>Labirint yaratish</button>
          <button class="btn sm ghost" data-open>Boʻsh maydon</button>
          <button class="btn sm ghost" data-rand>Tasodifiy devorlar</button>
          <button class="btn sm" data-solve>Yoʻlni qidirish (DFS)</button>
          <label class="check"><input type="checkbox" data-anim checked> Yaratishni koʻrsatish</label>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage" style="padding:14px"><div class="maze" data-maze style="grid-template-columns:repeat(${C},1fr)"></div>
              <div class="legend"><span><i style="background:var(--sun)"></i>joriy yoʻl (stek)</span><span><i style="background:var(--rose-soft);border:1px solid var(--rose)"></i>berk koʻcha (backtrack)</span><span><i style="background:var(--leaf)"></i>topilgan yoʻl, start va finish</span><span><i style="background:var(--ink)"></i>devor</span></div>
            </div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Hisob</h3><div class="stats">
              <div class="sun"><b data-s="depth">0</b>Yoʻl uzunligi (chuqurlik)</div>
              <div><b data-s="seen">0</b>Koʻrilgan kataklar</div>
              <div class="rose"><b data-s="dead">0</b>Berk kataklar</div>
              <div class="leaf"><b data-s="state">—</b>Holat</div>
            </div></div>
            <div class="panel"><h3>Devor chizish</h3><p class="small muted" style="margin:0">Animatsiya toʻxtagan paytda kataklarni bosing yoki sichqoncha/barmoq bilan torting — devor qoʻyiladi yoki olinadi. Keyin yoʻlni qayta qidiring.</p></div>
            <div class="panel"><h3>Kod</h3>${RL.codeBlock({
              java: `boolean go(int r, int c) {\n    if (out(r, c) || wall[r][c] || seen[r][c]) return false;\n    seen[r][c] = true;\n    path.add(new int[]{r, c});\n    if (r == er && c == ec) return true;\n    for (int k = 0; k < 4; k++)\n        if (go(r + dr[k], c + dc[k])) return true;\n    path.remove(path.size() - 1);\n    return false;\n}`,
              py: `def go(r, c):\n    if out(r, c) or wall[r][c] or seen[r][c]:\n        return False\n    seen[r][c] = True\n    path.append((r, c))\n    if (r, c) == (er, ec):\n        return True\n    for dr, dc in dirs:\n        if go(r + dr, c + dc):\n            return True\n    path.pop()\n    return False`
            })}</div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      const mazeEl = $('[data-maze]');
      mazeEl.innerHTML = Array.from({ length: R * C }, (_, i) => `<i data-i="${i}"></i>`).join('');
      const cells = Array.from(mazeEl.children);
      let wall = new Uint8Array(R * C).fill(1);
      let phase = 'idle', gen = null, sol = null, cur = 0, status = new Uint8Array(R * C), player;
      let stats = { depth: 0, seen: 0, dead: 0 };

      function paintCell(i) {
        const el = cells[i];
        let cls = '';
        if (i === S) cls = 's';
        else if (i === E) cls = 'e';
        else if (wall[i]) cls = 'w';
        else if (status[i] === 1) cls = sol && cur >= sol.foundAt ? 'g' : 'p';
        else if (status[i] === 2) cls = 'x';
        el.className = cls;
      }
      function paintAll() { for (let i = 0; i < R * C; i++) paintCell(i); }
      function setStats(state) {
        $('[data-s=depth]').textContent = stats.depth;
        $('[data-s=seen]').textContent = stats.seen;
        $('[data-s=dead]').textContent = stats.dead;
        $('[data-s=state]').textContent = state;
      }
      function makeOpen() {
        wall = new Uint8Array(R * C);
        for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (r === 0 || c === 0 || r === R - 1 || c === C - 1) wall[r * C + c] = 1;
      }
      function clearSolve() { sol = null; status = new Uint8Array(R * C); stats = { depth: 0, seen: 0, dead: 0 }; }

      function startGen() {
        clearSolve();
        const ev = genEvents();
        if (!$('[data-anim]').checked) {
          wall = new Uint8Array(R * C).fill(1); ev.forEach(i => { wall[i] = 0; });
          phase = 'idle'; paintAll(); player.setCount(1, 0); setStats('—');
          $('[data-msg]').innerHTML = `Labirint tayyor. «Yoʻlni qidirish» ni bosing.`;
          return;
        }
        gen = ev; phase = 'gen'; cur = 0;
        wall = new Uint8Array(R * C).fill(1);
        paintAll();
        player.setCount(gen.length + 1, 0);
        player.play();
      }
      function startSolve() {
        if (phase === 'gen') { gen.forEach(i => { wall[i] = 0; }); }
        phase = 'solve'; clearSolve();
        sol = solveEvents(wall);
        sol.foundAt = sol.T.indexOf(FOUND) + 1 || Infinity;
        cur = 0; paintAll();
        player.setCount(sol.T.length + 1, 0);
        player.play();
      }
      function goto(i) {
        if (phase === 'gen') {
          while (cur < i) { wall[gen[cur]] = 0; paintCell(gen[cur]); cur++; }
          while (cur > i) { cur--; wall[gen[cur]] = 1; paintCell(gen[cur]); }
          const r = cur ? gen[cur - 1] : -1;
          cells.forEach(el => el.classList.remove('head'));
          if (r >= 0) cells[r].classList.add('head');
          $('[data-msg]').innerHTML = cur === gen.length ? `<b>Labirint tayyor.</b> Har katakdan har katakka aynan bitta yoʻl bor. Endi «Yoʻlni qidirish» ni bosing.` : `Rekursiv backtracker: tasodifiy qoʻshniga devorni buzib oʻtadi, boshi berk boʻlsa — orqaga qaytadi.`;
          setStats('qurilmoqda');
          return;
        }
        if (phase !== 'solve' || !sol) return;
        const wasFound = cur >= sol.foundAt;
        while (cur < i) {
          const t = sol.T[cur], c = sol.I[cur];
          if (t === VISIT) { status[c] = 1; stats.depth++; stats.seen++; }
          else if (t === DEAD) { status[c] = 2; stats.depth--; stats.dead++; }
          paintCell(c); cur++;
        }
        while (cur > i) {
          cur--; const t = sol.T[cur], c = sol.I[cur];
          if (t === VISIT) { status[c] = 0; stats.depth--; stats.seen--; }
          else if (t === DEAD) { status[c] = 1; stats.depth++; stats.dead--; }
          paintCell(c);
        }
        if (wasFound !== (cur >= sol.foundAt)) paintAll();
        cells.forEach(el => el.classList.remove('head'));
        const last = cur ? sol.T[cur - 1] : -1, lc = cur ? sol.I[cur - 1] : -1;
        if (last === VISIT && lc !== S && lc !== E) cells[lc].classList.add('head');
        let msg = `Startdan (yuqori-chap) finishga (past-oʻng) DFS: oʻngga, pastga, chapga, yuqoriga tartibida.`;
        if (last === VISIT) msg = `Katakka kirildi — stekka qoʻshildi. Chuqurlik: <b>${stats.depth}</b>.`;
        if (last === DEAD) msg = `<b>Berk koʻcha.</b> Bu katakdan hamma yoʻnalish yopiq — stekdan olinadi (backtrack).`;
        if (last === FOUND) msg = `<b>Yoʻl topildi!</b> Uzunligi ${stats.depth} katak. Yashil yoʻl — aynan rekursiya stekidagi kataklar.`;
        if (last === NONE) msg = `<b>Yoʻl yoʻq.</b> DFS barcha yetib boriladigan kataklarni koʻrib chiqdi.`;
        $('[data-msg]').innerHTML = msg;
        setStats(last === FOUND ? 'topildi' : last === NONE ? 'yoʻq' : cur ? 'qidirilmoqda' : '—');
      }

      let drawing = null;
      function editAt(target) {
        const el = target && target.closest && target.closest('[data-i]');
        if (!el) return;
        const i = +el.dataset.i;
        if (i === S || i === E) return;
        const r = (i / C) | 0, c = i % C;
        if (r === 0 || c === 0 || r === R - 1 || c === C - 1) return;
        if (drawing === null) drawing = wall[i] ? 0 : 1;
        if (wall[i] !== drawing) { wall[i] = drawing; paintCell(i); }
      }
      mazeEl.addEventListener('pointerdown', e => {
        player.pause();
        if (phase === 'gen') { gen.forEach(i => { wall[i] = 0; }); }
        if (phase !== 'idle') { phase = 'idle'; clearSolve(); paintAll(); player.setCount(1, 0); setStats('—'); cells.forEach(el => el.classList.remove('head')); }
        drawing = null; editAt(e.target);
        mazeEl.setPointerCapture && mazeEl.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      mazeEl.addEventListener('pointermove', e => {
        if (drawing === null) return;
        editAt(document.elementFromPoint(e.clientX, e.clientY));
      });
      const stop = () => { drawing = null; };
      mazeEl.addEventListener('pointerup', stop);
      mazeEl.addEventListener('pointercancel', stop);

      $('[data-gen]').addEventListener('click', startGen);
      $('[data-solve]').addEventListener('click', startSolve);
      $('[data-open]').addEventListener('click', () => { player.pause(); phase = 'idle'; clearSolve(); makeOpen(); paintAll(); player.setCount(1, 0); setStats('—'); $('[data-msg]').innerHTML = `Boʻsh maydon: DFS qanday «ilon» yoʻl qilishini koʻring yoki devor chizing.`; });
      $('[data-rand]').addEventListener('click', () => {
        player.pause(); phase = 'idle'; clearSolve(); makeOpen();
        for (let i = 0; i < R * C; i++) { const r = (i / C) | 0, c = i % C; if (r && c && r < R - 1 && c < C - 1 && i !== S && i !== E && Math.random() < 0.3) wall[i] = 1; }
        paintAll(); player.setCount(1, 0); setStats('—');
        $('[data-msg]').innerHTML = `Tasodifiy devorlar: yoʻl boʻlmasligi ham mumkin.`;
      });
      player = RL.Player($('[data-player]'), { count: 1, goto, speed: 8 });
      const ev = genEvents(); wall.fill(1); ev.forEach(i => { wall[i] = 0; });
      paintAll(); setStats('—');
      $('[data-msg]').innerHTML = `Labirint tayyor. «Yoʻlni qidirish» ni bosing yoki yangisini yarating.`;
      return () => { player && player.destroy(); };
    },
    explain: {
      text: [
        `Labirintning oʻzi ham backtracking bilan quriladi: joriy katakdan tasodifiy tashrif buyurilmagan qoʻshniga devorni buzib oʻtamiz; qoʻshni qolmasa — orqaga qaytamiz. Natijada har ikki katak orasida aynan bitta yoʻl boʻladi.`,
        `Yechishda sariq kataklar — rekursiya stekida turgan yoʻl. Berk koʻchaga kirilsa, katak qizil boʻladi va stekdan chiqariladi. Finishga yetilganda stekdagi kataklar yashil — bu topilgan yoʻl.`,
        `Bu yerda «yetib borish mumkinmi?» degan savol, shuning uchun koʻrilgan kataklar qayta ochilmaydi. Barcha yoʻllarni sanash uchun esa qaytishda <code>seen</code> ni tiklash kerak boʻlardi (Sprint 7, 4-dars).`
      ]
    }
  };
})();
