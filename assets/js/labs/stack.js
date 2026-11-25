(function () {
  'use strict';
  const { esc } = RL;

  const FNS = {
    fact: {
      name: `Faktorial`, sig: p => `fact(${p.n})`,
      inputs: [{ k: 'n', label: 'n', type: 'number', min: 0, max: 10, def: 5 }],
      lines: {
        java: [`static long fact(int n) {`, `    if (n == 0)`, `        return 1;`, `    return n * fact(n - 1);`, `}`],
        py: [`def fact(n):`, `    if n == 0:`, `        return 1`, `    return n * fact(n - 1)`]
      },
      key: { head: 0, test: 1, base: 2, rec: 3 },
      run(T, p) {
        function f(n) {
          const fr = T.push(`fact(${n})`, { n });
          T.at('head', `<b>fact(${n})</b> chaqirildi — stekka yangi frame qoʻshildi`, 'call');
          T.at('test', `n == 0 ? → ${n === 0 ? 'ha' : 'yoʻq'}`);
          if (n === 0) { T.at('base', `Base case: <b>1</b> qaytariladi`, 'ret', 1); return T.pop(1); }
          fr.locals['fact(n−1)'] = '?';
          T.at('rec', `fact(${n - 1}) chaqirilmoqda; ${n} × ? natijani kutadi`);
          const r = f(n - 1);
          fr.locals['fact(n−1)'] = r;
          T.at('rec', `fact(${n - 1}) = ${r} qaytdi → ${n} × ${r} = <b>${n * r}</b>`, 'ret', n * r);
          return T.pop(n * r);
        }
        f(p.n);
      }
    },
    sum: {
      name: `1..n yigʻindisi`, sig: p => `sum(${p.n})`,
      inputs: [{ k: 'n', label: 'n', type: 'number', min: 0, max: 10, def: 4 }],
      lines: {
        java: [`static int sum(int n) {`, `    if (n == 0)`, `        return 0;`, `    return n + sum(n - 1);`, `}`],
        py: [`def sum_to(n):`, `    if n == 0:`, `        return 0`, `    return n + sum_to(n - 1)`]
      },
      key: { head: 0, test: 1, base: 2, rec: 3 },
      run(T, p) {
        function f(n) {
          const fr = T.push(`sum(${n})`, { n });
          T.at('head', `<b>sum(${n})</b> chaqirildi`, 'call');
          T.at('test', `n == 0 ? → ${n === 0 ? 'ha' : 'yoʻq'}`);
          if (n === 0) { T.at('base', `Base case: <b>0</b>`, 'ret', 0); return T.pop(0); }
          fr.locals['sum(n−1)'] = '?';
          T.at('rec', `sum(${n - 1}) chaqirilmoqda`);
          const r = f(n - 1);
          fr.locals['sum(n−1)'] = r;
          T.at('rec', `${n} + ${r} = <b>${n + r}</b>`, 'ret', n + r);
          return T.pop(n + r);
        }
        f(p.n);
      }
    },
    fib: {
      name: `Fibonachchi (ikki chaqiruv)`, sig: p => `fib(${p.n})`,
      inputs: [{ k: 'n', label: 'n', type: 'number', min: 0, max: 6, def: 4 }],
      lines: {
        java: [`static int fib(int n) {`, `    if (n <= 1)`, `        return n;`, `    int a = fib(n - 1);`, `    int b = fib(n - 2);`, `    return a + b;`, `}`],
        py: [`def fib(n):`, `    if n <= 1:`, `        return n`, `    a = fib(n - 1)`, `    b = fib(n - 2)`, `    return a + b`]
      },
      key: { head: 0, test: 1, base: 2, a: 3, b: 4, ret: 5 },
      run(T, p) {
        function f(n) {
          const fr = T.push(`fib(${n})`, { n });
          T.at('head', `<b>fib(${n})</b> chaqirildi`, 'call');
          T.at('test', `n <= 1 ? → ${n <= 1 ? 'ha' : 'yoʻq'}`);
          if (n <= 1) { T.at('base', `Base case: <b>${n}</b>`, 'ret', n); return T.pop(n); }
          fr.locals.a = '?'; fr.locals.b = '?';
          T.at('a', `Chap shox: fib(${n - 1})`);
          const a = f(n - 1); fr.locals.a = a;
          T.at('b', `a = ${a}. Oʻng shox: fib(${n - 2})`);
          const b = f(n - 2); fr.locals.b = b;
          T.at('ret', `${a} + ${b} = <b>${a + b}</b>`, 'ret', a + b);
          return T.pop(a + b);
        }
        f(p.n);
      }
    },
    pow: {
      name: `Tez daraja (binpow)`, sig: p => `pow(${p.a}, ${p.n})`,
      inputs: [{ k: 'a', label: 'a', type: 'number', min: 1, max: 9, def: 2 }, { k: 'n', label: 'n', type: 'number', min: 0, max: 40, def: 13 }],
      lines: {
        java: [`static long pow(long a, int n) {`, `    if (n == 0)`, `        return 1;`, `    long half = pow(a, n / 2);`, `    if (n % 2 == 0)`, `        return half * half;`, `    return half * half * a;`, `}`],
        py: [`def pow(a, n):`, `    if n == 0:`, `        return 1`, `    half = pow(a, n // 2)`, `    if n % 2 == 0:`, `        return half * half`, `    return half * half * a`]
      },
      key: { head: 0, test: 1, base: 2, half: 3, even: 4, reteven: 5, retodd: 6 },
      run(T, p) {
        const a = p.a;
        function f(n) {
          const fr = T.push(`pow(${a}, ${n})`, { n });
          T.at('head', `<b>pow(${a}, ${n})</b> chaqirildi`, 'call');
          T.at('test', `n == 0 ? → ${n === 0 ? 'ha' : 'yoʻq'}`);
          if (n === 0) { T.at('base', `Base case: <b>1</b>`, 'ret', 1); return T.pop(1); }
          fr.locals.half = '?';
          T.at('half', `pow(${a}, ${Math.floor(n / 2)}) — daraja ikki baravar kichraydi`);
          const h = f(Math.floor(n / 2)); fr.locals.half = h;
          T.at('even', `n % 2 == 0 ? → ${n % 2 === 0 ? 'ha' : 'yoʻq'}`);
          const r = n % 2 === 0 ? h * h : h * h * a;
          if (n % 2 === 0) T.at('reteven', `${h} × ${h} = <b>${r}</b>`, 'ret', r);
          else T.at('retodd', `${h} × ${h} × ${a} = <b>${r}</b>`, 'ret', r);
          return T.pop(r);
        }
        f(p.n);
      }
    },
    rev: {
      name: `Satrni teskari aylantirish`, sig: p => `rev("${p.s}")`,
      inputs: [{ k: 's', label: 's', type: 'text', maxlength: 8, def: 'rekur' }],
      lines: {
        java: [`static String rev(String s) {`, `    if (s.length() <= 1)`, `        return s;`, `    String r = rev(s.substring(1));`, `    return r + s.charAt(0);`, `}`],
        py: [`def rev(s):`, `    if len(s) <= 1:`, `        return s`, `    r = rev(s[1:])`, `    return r + s[0]`]
      },
      key: { head: 0, test: 1, base: 2, rec: 3, ret: 4 },
      run(T, p) {
        function f(s) {
          const fr = T.push(`rev("${s}")`, { s: `"${s}"` });
          T.at('head', `<b>rev("${esc(s)}")</b> chaqirildi`, 'call');
          T.at('test', `uzunlik ${s.length} <= 1 ? → ${s.length <= 1 ? 'ha' : 'yoʻq'}`);
          if (s.length <= 1) { T.at('base', `Base case: <b>"${esc(s)}"</b>`, 'ret', `"${s}"`); return T.pop(s); }
          fr.locals.r = '?';
          T.at('rec', `rev("${esc(s.slice(1))}") — birinchi harfsiz qism`);
          const r = f(s.slice(1)); fr.locals.r = `"${r}"`;
          T.at('ret', `"${esc(r)}" + '${esc(s[0])}' = <b>"${esc(r + s[0])}"</b>`, 'ret', `"${r + s[0]}"`);
          return T.pop(r + s[0]);
        }
        f(p.s || 'abc');
      }
    },
    gcd: {
      name: `EKUB (tail recursion)`, sig: p => `gcd(${p.a}, ${p.b})`,
      inputs: [{ k: 'a', label: 'a', type: 'number', min: 0, max: 1000000, def: 48 }, { k: 'b', label: 'b', type: 'number', min: 0, max: 1000000, def: 18 }],
      lines: {
        java: [`static int gcd(int a, int b) {`, `    if (b == 0)`, `        return a;`, `    return gcd(b, a % b);`, `}`],
        py: [`def gcd(a, b):`, `    if b == 0:`, `        return a`, `    return gcd(b, a % b)`]
      },
      key: { head: 0, test: 1, base: 2, rec: 3 },
      run(T, p) {
        function f(a, b) {
          T.push(`gcd(${a}, ${b})`, { a, b });
          T.at('head', `<b>gcd(${a}, ${b})</b> chaqirildi`, 'call');
          T.at('test', `b == 0 ? → ${b === 0 ? 'ha' : 'yoʻq'}`);
          if (b === 0) { T.at('base', `Base case: <b>${a}</b>`, 'ret', a); return T.pop(a); }
          T.at('rec', `gcd(${b}, ${a} % ${b} = ${a % b}) — chaqiruv oxirgi amal (tail)`);
          const r = f(b, a % b);
          T.at('rec', `Natija oʻzgarmasdan yuqoriga uzatiladi: <b>${r}</b>`, 'ret', r);
          return T.pop(r);
        }
        f(p.a, p.b);
      }
    },
    broken: {
      name: `Base case siz faktorial`, sig: p => `fact(${p.n})`,
      inputs: [{ k: 'n', label: 'n', type: 'number', min: 0, max: 6, def: 3 }],
      lines: {
        java: [`static long fact(int n) {`, `    // base case yoʻq`, `    return n * fact(n - 1);`, `}`],
        py: [`def fact(n):`, `    # base case yo'q`, `    return n * fact(n - 1)`]
      },
      key: { head: 0, rec: 2 },
      run(T, p) {
        const LIMIT = 13;
        function f(n) {
          T.push(`fact(${n})`, { n });
          T.at('head', `<b>fact(${n})</b> chaqirildi — chuqurlik ${T.stack.length}`, 'call');
          if (T.stack.length >= LIMIT) { T.error(`StackOverflowError: stek toʻldi (bu demoda chegara ${LIMIT} frame; Java'da odatda ~10⁴)`); throw T.OVERFLOW; }
          T.at('rec', `fact(${n - 1}) chaqirilmoqda — n hech qachon toʻxtamaydi`);
          f(n - 1);
        }
        try { f(p.n); } catch (e) { if (e !== T.OVERFLOW) throw e; }
      }
    }
  };

  function Tracer(fn) {
    const T = { steps: [], stack: [], calls: 0, maxDepth: 0, OVERFLOW: {} };
    T.push = (label, locals) => {
      const fr = { label, locals: Object.assign({}, locals), line: 'head', ret: undefined };
      T.stack.push(fr); T.calls++; T.maxDepth = Math.max(T.maxDepth, T.stack.length); return fr;
    };
    T.at = (key, msg, kind, retVal) => {
      const top = T.stack[T.stack.length - 1];
      if (top) top.line = key;
      T.steps.push({
        line: key, msg, kind: kind || 'line', calls: T.calls, maxDepth: T.maxDepth,
        frames: T.stack.map((f, i) => ({ label: f.label, locals: Object.assign({}, f.locals), returning: kind === 'ret' && i === T.stack.length - 1, ret: kind === 'ret' && i === T.stack.length - 1 ? retVal : undefined }))
      });
    };
    T.pop = v => { T.stack.pop(); return v; };
    T.error = msg => {
      T.steps.push({ line: 'rec', msg: `<b>${msg}</b>`, kind: 'err', calls: T.calls, maxDepth: T.maxDepth, error: msg, frames: T.stack.map(f => ({ label: f.label, locals: Object.assign({}, f.locals) })) });
    };
    return T;
  }

  function fmtLocals(l) {
    return Object.keys(l).map(k => `${k} = ${esc(l[k])}`).join(', ');
  }

  RL.labs.stack = {
    title: `Chaqiruvlar steki`,
    desc: `Har bir chaqiruv frame yaratadi. Kod qatori, stek va lokal oʻzgaruvchilarni qadam-baqadam kuzating.`,
    sprints: [1, 2],
    glyph: `<svg class="glyph" viewBox="0 0 120 64" aria-hidden="true"><rect class="g-bg" width="120" height="64"/><rect class="g-d4" x="26" y="46" width="68" height="10" rx="3"/><rect class="g-d3" x="30" y="33" width="60" height="10" rx="3"/><rect class="g-d2" x="34" y="20" width="52" height="10" rx="3"/><rect class="g-sun" x="38" y="7" width="44" height="10" rx="3"/></svg>`,
    mount(root, params) {
      let fnKey = FNS[params.fn] ? params.fn : 'fact';
      let p = {};
      root.innerHTML = `
        <div class="panel lab-controls">
          <label class="field">Funksiya
            <select class="input" data-fn>${Object.keys(FNS).map(k => `<option value="${k}"${k === fnKey ? ' selected' : ''}>${FNS[k].name}</option>`).join('')}</select>
          </label>
          <span data-inputs style="display:contents"></span>
          <button class="btn sm" data-run>Ishga tushirish</button>
        </div>
        <div class="lab-body">
          <div>
            <div class="panel stage">
              <div class="stack-wrap">
                <div><div class="codeview" data-code></div></div>
                <div>
                  <div class="stackview" data-stack aria-live="off"></div>
                </div>
              </div>
            </div>
            <div data-player></div>
            <div class="player-msg" data-msg></div>
          </div>
          <aside class="side">
            <div class="panel"><h3>Holat</h3><div class="stats">
              <div class="sun"><b data-s="depth">0</b>Joriy chuqurlik</div>
              <div><b data-s="max">0</b>Maks. chuqurlik</div>
              <div><b data-s="calls">0</b>Chaqiruvlar</div>
              <div class="leaf"><b data-s="res">—</b>Natija</div>
            </div>
            <div class="legend"><span><i style="background:var(--sun)"></i>ishlayotgan frame</span><span><i style="background:var(--leaf)"></i>qaytmoqda</span><span><i style="background:var(--d3)"></i>kutmoqda</span></div></div>
            <div class="panel"><h3>Voqealar</h3><ol class="log" data-log></ol></div>
          </aside>
        </div>`;
      const $ = s => root.querySelector(s);
      let steps = [], player;

      function renderInputs() {
        const F = FNS[fnKey];
        p = {};
        $('[data-inputs]').innerHTML = F.inputs.map(inp => {
          let v = params[inp.k] != null ? params[inp.k] : inp.def;
          if (inp.type === 'number') v = RL.clamp(parseInt(v, 10) || 0, inp.min, inp.max);
          else v = String(v).slice(0, inp.maxlength || 8);
          p[inp.k] = v;
          return `<label class="field">${inp.label}<input class="input" style="width:${inp.type === 'text' ? 130 : 90}px" data-k="${inp.k}" type="${inp.type}" ${inp.type === 'number' ? `min="${inp.min}" max="${inp.max}"` : `maxlength="${inp.maxlength}"`} value="${esc(v)}"></label>`;
        }).join('');
      }
      function readInputs() {
        const F = FNS[fnKey];
        F.inputs.forEach(inp => {
          const el = $(`[data-k="${inp.k}"]`);
          if (inp.type === 'number') { p[inp.k] = RL.clamp(parseInt(el.value, 10) || 0, inp.min, inp.max); el.value = p[inp.k]; }
          else { p[inp.k] = el.value.slice(0, inp.maxlength || 8) || 'a'; }
        });
      }
      function build() {
        const F = FNS[fnKey];
        const T = Tracer(F);
        T.steps.push({ line: null, msg: `<b>${esc(F.sig(p))}</b> chaqirilishiga tayyor. ▶ ni bosing yoki → bilan qadamlang.`, kind: 'start', calls: 0, maxDepth: 0, frames: [] });
        F.run(T, p);
        steps = T.steps;
        if (!player) player = RL.Player($('[data-player]'), { count: steps.length, goto: render });
        else player.setCount(steps.length, 0);
        render(0);
      }
      function renderCode(lineKey) {
        const F = FNS[fnKey];
        const lang = RL.state.lang === 'py' ? 'py' : 'java';
        const idx = lineKey != null ? F.key[lineKey] : -1;
        $('[data-code]').innerHTML = F.lines[lang].map((l, i) => `<div class="${i === idx ? 'hl' : ''}"><span class="ln">${i + 1}</span><span>${RL.highlight(l, lang)}</span></div>`).join('');
      }
      function render(i) {
        const s = steps[i]; if (!s) return;
        renderCode(s.line);
        const n = s.frames.length;
        const frames = [`<div class="frame mainf"><span class="fn">main()</span><span class="loc">${esc(FNS[fnKey].sig(p))} ni chaqirdi</span></div>`]
          .concat(s.frames.map((f, k) => {
            const top = k === n - 1;
            const cls = (s.kind === 'err' && top ? 'err' : f.returning ? 'returning' : top ? 'top' : '') + (top && s.kind === 'call' ? ' enter' : '');
            const state = f.returning ? `→ ${esc(f.ret)}` : top ? (s.kind === 'err' ? 'toʻldi' : 'ishlamoqda') : 'kutmoqda';
            return `<div class="frame ${cls}" style="--fc:${RL.depthColor(k + 1)}"><div><div class="fn">${esc(f.label)}</div><div class="loc">${fmtLocals(f.locals)}</div></div><span class="loc">${state}</span></div>`;
          }));
        if (s.error) frames.push(`<div class="err-banner">${esc(s.error)}</div>`);
        $('[data-stack]').innerHTML = frames.join('');
        $('[data-s=depth]').textContent = n;
        $('[data-s=max]').textContent = s.maxDepth;
        $('[data-s=calls]').textContent = s.calls;
        const last = steps[steps.length - 1];
        const resStep = i === steps.length - 1 && last.frames.length && last.frames[0].ret !== undefined ? last.frames[0].ret : null;
        $('[data-s=res]').textContent = s.kind === 'err' ? 'xato' : resStep != null ? resStep : '—';
        $('[data-msg]').innerHTML = s.msg;
        const from = Math.max(0, i - 40);
        $('[data-log]').innerHTML = steps.slice(from, i + 1).map((x, k) => `<li class="${x.kind === 'call' ? 'call' : x.kind === 'ret' ? 'ret' : x.kind === 'err' ? 'back' : ''}${from + k === i ? ' cur' : ''}">${x.msg}</li>`).join('');
        const log = $('[data-log]'); log.scrollTop = log.scrollHeight;
      }

      renderInputs(); build();
      $('[data-fn]').addEventListener('change', e => { fnKey = e.target.value; params = {}; renderInputs(); build(); });
      $('[data-run]').addEventListener('click', () => { readInputs(); build(); player.play(); });
      root.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-k]')) { readInputs(); build(); } });
      const offLang = RL.on('lang', () => render(player.index));
      return () => { player && player.destroy(); offLang(); };
    },
    explain: {
      text: [
        `Har qadamda chap tomonda <strong>hozir bajarilayotgan qator</strong>, oʻngda esa stekdagi barcha frame'lar koʻrinadi. Pastdagi frame eng birinchi chaqirilgan, tepadagisi — hozir ishlayotgani.`,
        `Kutayotgan frame'lar oʻz lokal oʻzgaruvchilarini saqlab turadi: <code>?</code> belgisi «natija hali qaytmagan» degani. Qaytishda (yashil) qiymat chaqiruvchi frame'ga beriladi.`,
        `<strong>Fibonachchi</strong> ni tanlang: stek balandligi n dan oshmaydi, lekin chaqiruvlar soni tez oʻsadi — xotira va vaqt farqi aynan shu. <strong>Base case siz</strong> variantda stek toʻlishini koʻrasiz.`
      ]
    }
  };
})();
