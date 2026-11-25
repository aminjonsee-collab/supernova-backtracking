(function () {
  'use strict';
  const { esc } = RL;
  const PEGS = ['A', 'B', 'C'];
  const W = 640, H = 270, BASE_Y = 236, PEG_X = [110, 320, 530], DISK_H = 22;

  function solve(n) {
    const moves = [];
    const chain = [];
    (function h(k, from, to, via) {
      if (k === 0) return;
      chain.push(`hanoi(${k}, ${PEGS[from]}, ${PEGS[to]}, ${PEGS[via]})`);
      h(k - 1, from, via, to);
      moves.push({ disk: k, from, to, chain: chain.slice() });
      h(k - 1, via, to, from);
      chain.pop();
    })(n, 0, 2, 1);
    return moves;
  }

  RL.labs.hanoi = {
    title: `Hanoi minoralari`,
    desc: `n−1 diskni chetga, kattasini maqsadga, n−1 ni ustiga. Avtomatik rejimda rekursiya stekini koʻring yoki oʻzingiz yeching.`,
    sprints: [4],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><rect class="g-ink" x="10" y="54" width="100" height="4" rx="2"/><rect class="g-ink" x="28" y="16" width="3" height="40"/><rect class="g-ink" x="59" y="16" width="3" height="40"/><rect class="g-ink" x="90" y="16" width="3" height="40"/><rect class="g-d2" x="13" y="46" width="33" height="8" rx="3"/><rect class="g-d3" x="17" y="38" width="25" height="8" rx="3"/><rect class="g-sun" x="80" y="46" width="23" height="8" rx="3"/><rect class="g-d4" x="52" y="46" width="17" height="8" rx="3"/></svg>`,
    mount(root, params) {
      let n = RL.clamp(parseInt(params.n, 10) || 3, 1, 8);
      let mode = params.mode === 'manual' ? 'manual' : 'auto';
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Disklar soni<input class="input" type="number" min="1" max="8" value="${n}" data-n style="width:90px"></label>
          <div class="field">Rejim<div class="seg" role="group"><button data-mode="auto">Avtomatik</button><button data-mode="manual">Qoʻlda</button></div></div>
          <button class="btn sm ghost" data-undo hidden>Orqaga qaytarish</button>
          <button class="btn sm ghost" data-reset>Qayta boshlash</button>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage hanoi"><svg viewBox="0 0 ${W} ${H}" data-svg role="img" aria-label="Hanoi minoralari"></svg></div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Hisob</h3><div class="stats">
              <div class="sun"><b data-s="moves">0</b>Yurishlar</div>
              <div><b data-s="opt">0</b>Minimal (2ⁿ − 1)</div>
            </div></div>
            <div class="panel" data-chainbox><h3>Rekursiya steki</h3><div class="callchain" data-chain></div></div>
            <div class="panel"><h3>Kod</h3>${RL.codeBlock({
              java: `void hanoi(int n, char from, char to, char via) {\n    if (n == 0) return;\n    hanoi(n - 1, from, via, to);\n    move(n, from, to);\n    hanoi(n - 1, via, to, from);\n}`,
              py: `def hanoi(n, src, dst, via):\n    if n == 0:\n        return\n    hanoi(n - 1, src, via, dst)\n    move(n, src, dst)\n    hanoi(n - 1, via, dst, src)`
            })}</div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      const svg = $('[data-svg]');
      let moves = [], player = null, pegs, manualHist = [], sel = null;

      function diskW(k) { return 44 + (k - 1) * (150 / Math.max(1, n - 1 || 1)); }
      function diskColor(k) { return `var(--d${Math.min(5, Math.max(1, Math.round(1 + (n - k) * 4 / Math.max(1, n - 1))))})`; }
      function drawBase() {
        let s = `<rect class="base" x="20" y="${BASE_Y}" width="${W - 40}" height="10" rx="4"/>`;
        PEG_X.forEach((x, i) => {
          s += `<rect class="peg" x="${x - 4}" y="40" width="8" height="${BASE_Y - 40}" rx="3"/>`;
          s += `<text class="peg-label" x="${x}" y="${BASE_Y + 30}">${PEGS[i]}</text>`;
        });
        for (let k = n; k >= 1; k--) s += `<rect class="disk" data-d="${k}" height="${DISK_H - 3}" rx="6" width="${diskW(k)}" fill="${diskColor(k)}" stroke="var(--ink)" stroke-width="1.2"/>`;
        PEG_X.forEach((x, i) => { s += `<rect class="peg-hit" data-peg="${i}" x="${x - 100}" y="20" width="200" height="${BASE_Y - 10}" rx="12"/>`; });
        svg.innerHTML = s;
      }
      function place() {
        pegs.forEach((stack, pi) => stack.forEach((k, h) => {
          const r = svg.querySelector(`[data-d="${k}"]`);
          r.setAttribute('x', PEG_X[pi] - diskW(k) / 2);
          r.setAttribute('y', BASE_Y - (h + 1) * DISK_H + 1);
        }));
      }
      function stateAt(i) {
        pegs = [[], [], []];
        for (let k = n; k >= 1; k--) pegs[0].push(k);
        for (let j = 0; j < i; j++) { const m = moves[j]; pegs[m.to].push(pegs[m.from].pop()); }
      }
      function render(i) {
        stateAt(i); place();
        svg.querySelectorAll('.disk').forEach(d => d.removeAttribute('style'));
        $('[data-s=moves]').textContent = i;
        const m = moves[i - 1];
        if (m) svg.querySelector(`[data-d="${m.disk}"]`).style.stroke = 'var(--sun)', svg.querySelector(`[data-d="${m.disk}"]`).style.strokeWidth = '3';
        const ch = m ? m.chain : [];
        $('[data-chain]').innerHTML = ch.length ? ch.map((c, k) => `<div style="--fc:${RL.depthColor(k + 1)}">${esc(c)}</div>`).reverse().join('') : `<div style="--fc:var(--line)">main()</div>`;
        $('[data-msg]').innerHTML = !m ? `${n} ta disk A ustunida. Maqsad — hammasini C ga koʻchirish.` : i === moves.length ? `<b>Tayyor!</b> ${moves.length} yurish — bu 2<sup>${n}</sup> − 1 ga teng va minimal.` : `${i}-yurish: <b>${m.disk}-disk ${PEGS[m.from]} → ${PEGS[m.to]}</b>. Tepadagi chaqiruv: ${esc(m.chain[m.chain.length - 1])}`;
      }
      function setup() {
        n = RL.clamp(parseInt($('[data-n]').value, 10) || 3, 1, 8); $('[data-n]').value = n;
        moves = solve(n);
        $('[data-s=opt]').textContent = moves.length;
        drawBase();
        manualHist = []; sel = null;
        RL.$$('[data-mode]', root).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
        $('[data-undo]').hidden = mode !== 'manual';
        $('[data-player]').style.display = mode === 'auto' ? '' : 'none';
        $('[data-chainbox]').style.display = mode === 'auto' ? '' : 'none';
        if (mode === 'auto') {
          if (!player) player = RL.Player($('[data-player]'), { count: moves.length + 1, goto: render, speed: 4 });
          else player.setCount(moves.length + 1, 0);
          render(0);
        } else {
          if (player) player.pause();
          stateAt(0); place();
          $('[data-s=moves]').textContent = 0;
          $('[data-msg]').innerHTML = `Ustunni bosib diskni tanlang, keyin boshqa ustunni bosib qoʻying. Katta diskni kichigining ustiga qoʻyib boʻlmaydi.`;
        }
      }
      function manualClick(pi) {
        if (mode !== 'manual') return;
        if (sel === null) {
          if (!pegs[pi].length) return;
          sel = pi;
        } else {
          if (pi !== sel) {
            const d = pegs[sel][pegs[sel].length - 1], top = pegs[pi][pegs[pi].length - 1];
            if (top !== undefined && top < d) {
              $('[data-msg]').innerHTML = `<b>Mumkin emas:</b> ${d}-disk ${top}-diskdan katta.`;
            } else {
              pegs[pi].push(pegs[sel].pop()); manualHist.push([sel, pi]);
              place();
              const done = pegs[2].length === n;
              $('[data-s=moves]').textContent = manualHist.length;
              $('[data-msg]').innerHTML = done
                ? `<b>Yechildi!</b> ${manualHist.length} yurish${manualHist.length === moves.length ? ' — minimal natija.' : `. Minimal: ${moves.length}. Yana urinib koʻring.`}`
                : `${manualHist.length}-yurish: ${d}-disk ${PEGS[sel]} → ${PEGS[pi]}`;
              if (done && manualHist.length === moves.length) RL.toast('Minimal yurishlar bilan yechildi');
            }
          }
          sel = null;
        }
        svg.querySelectorAll('.peg-hit').forEach(h => h.classList.toggle('sel', +h.dataset.peg === sel));
      }
      svg.addEventListener('click', e => { const h = e.target.closest('[data-peg]'); if (h) manualClick(+h.dataset.peg); });
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-mode]');
        if (b) { mode = b.dataset.mode; setup(); }
        if (e.target.closest('[data-reset]')) setup();
        if (e.target.closest('[data-undo]') && manualHist.length) {
          const [a, b2] = manualHist.pop(); pegs[a].push(pegs[b2].pop()); place();
          $('[data-s=moves]').textContent = manualHist.length;
        }
      });
      $('[data-n]').addEventListener('change', setup);
      setup();
      return () => { player && player.destroy(); };
    },
    explain: {
      text: [
        `Oʻng paneldagi «Rekursiya steki» har yurish paytida qaysi <code>hanoi(...)</code> chaqiruvlari ochiq turganini koʻrsatadi. Eng tepadagisi diskni koʻchirayotgan chaqiruv.`,
        `Kuzating: eng katta disk (n) faqat bir marta, (n−1)-disk ikki marta, 1-disk esa 2ⁿ⁻¹ marta koʻchadi. Jami 1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1.`,
        `«Qoʻlda» rejimida rekursiv qoidani oʻzingiz qoʻllang: «n−1 ta diskni yordamchi ustunga oʻtkazish uchun nima qilish kerak?» — xuddi shu savolni kichikroq n uchun bering.`
      ]
    }
  };
})();
