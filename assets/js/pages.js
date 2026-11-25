(function () {
  'use strict';
  const { esc, icon } = RL;
  const P = RL.pages;
  const LAB_ORDER = ['stack', 'tree', 'hanoi', 'space', 'queens', 'sudoku', 'maze'];
  const levelChip = lv => `<span class="chip ${lv}">${RL.LEVELS[lv]}</span>`;
  const sprintLink = n => `<a href="#/sprint/${n}">Sprint ${n}</a>`;
  const fmtDate = d => { const x = new Date(d); return `${String(x.getDate()).padStart(2, '0')}.${String(x.getMonth() + 1).padStart(2, '0')}.${x.getFullYear()}`; };

  /* ================= HOME ================= */
  function drosteHTML(n) {
    function frame(k, d) {
      const isBase = k === 0;
      const style = `--fc:${isBase ? 'var(--leaf)' : RL.depthColor(d + 1)};--fb:color-mix(in srgb, var(--d3) ${d * 5}%, var(--sheet))`;
      if (isBase) return `<div class="df base hidden" data-d="${d}" style="${style}"><div class="df-h"><span class="df-call">fact(0)</span><span class="df-res">base case</span></div></div>`;
      return `<div class="df${d ? ' hidden' : ''}" data-d="${d}" style="${style}"><div class="df-h"><span class="df-call">fact(${k})</span><span class="df-res">${k} × fact(${k - 1})</span></div>${frame(k - 1, d + 1)}</div>`;
    }
    return frame(n, 0);
  }
  function animateDroste(root, n) {
    const frames = RL.$$('.df', root).sort((a, b) => a.dataset.d - b.dataset.d);
    const vals = []; let v = 1; for (let k = 0; k <= n; k++) { vals[k] = v; v *= (k + 1); }
    let timers = [];
    const res = (f, k) => f.querySelector(':scope > .df-h .df-res');
    function finalState() {
      frames.forEach((f, d) => {
        const k = n - d;
        f.classList.remove('hidden', 'active'); f.classList.add('ret');
        res(f, k).textContent = k === 0 ? 'base case: 1' : `${k} × ${vals[k - 1]} = ${vals[k]}`;
      });
      const cap = root.querySelector('[data-droste-msg]'); if (cap) cap.textContent = `fact(5) = 120: chuqurlik 6, qaytishda koʻpaytirildi`;
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      if (RL.reducedMotion()) { finalState(); return; }
      const cap = root.querySelector('[data-droste-msg]');
      frames.forEach((f, d) => {
        const k = n - d;
        f.classList.toggle('hidden', d > 0); f.classList.remove('ret', 'active');
        res(f, k).textContent = k === 0 ? 'base case' : `${k} × fact(${k - 1})`;
      });
      frames[0].classList.add('active');
      let t = 500;
      for (let d = 1; d <= n; d++) {
        timers.push(setTimeout(() => {
          frames[d - 1].classList.remove('active'); frames[d].classList.remove('hidden'); frames[d].classList.add('active');
          if (cap) cap.textContent = d === n ? `Base case: fact(0) = 1` : `Chuqurlashish: fact(${n - d}) chaqirildi`;
        }, t)); t += 420;
      }
      t += 300;
      for (let d = n; d >= 0; d--) {
        timers.push(setTimeout(() => {
          const k = n - d;
          frames[d].classList.remove('active'); frames[d].classList.add('ret');
          res(frames[d], k).textContent = k === 0 ? 'base case: 1' : `${k} × ${vals[k - 1]} = ${vals[k]}`;
          if (d > 0) frames[d - 1].classList.add('active');
          if (cap) cap.textContent = d === 0 ? `Natija: fact(5) = 120` : `Qaytish: fact(${k}) = ${vals[k]}`;
          if (d === 0) timers.push(setTimeout(() => { frames[0].classList.remove('active'); if (cap) cap.textContent = `fact(5) = 120: chuqurlik 6, qaytishda koʻpaytirildi`; }, 900));
        }, t)); t += 460;
      }
    }
    play();
    return { play, stop: () => timers.forEach(clearTimeout) };
  }

  function roadmapHTML() {
    const cur = RL.currentSprint();
    return `<ol class="roadmap">${RL.sprints.map(s => {
      const p = RL.sprintProgress(s);
      const cls = p.pct === 100 ? 'done' : s === cur ? 'current' : '';
      return `<li><a class="rm-item ${cls}" href="#/sprint/${s.n}">
        <span class="rm-n">${s.n}</span>
        <span><span class="rm-t">${esc(s.title)}</span><p class="rm-g">${esc(s.goal)}</p></span>
        <span class="rm-p">${p.done} / ${p.total} ball${p.pct === 100 ? ', yakunlandi' : s === cur ? ', joriy sprint' : ''}<span class="bar${p.pct === 100 ? ' leaf' : ''}"><i style="width:${p.pct}%"></i></span></span>
      </a></li>`;
    }).join('')}</ol>`;
  }
  function labTile(id) {
    const L = RL.labs[id];
    return `<a class="lab-tile${RL.state.labs[id] ? ' seen' : ''}" href="#/lab/${id}">${L.glyph}<h3>${esc(L.title)}</h3><p>${esc(L.desc)}</p><span class="lt-meta">${L.sprints.map(n => `Sprint ${n}`).join(', ')}</span></a>`;
  }

  P.home = {
    crumb: () => `<b>Bosh sahifa</b>`,
    render() {
      const tp = RL.totalProgress();
      const tasks = RL.allTasks();
      const done = tasks.filter(t => RL.taskStatus(t) === 'done').length;
      const probs = RL.allProblems();
      const solved = probs.filter(p => RL.state.solved[p.id]).length;
      const cur = RL.currentSprint();
      const started = tp.done > 0;
      const quizVals = Object.values(RL.state.quiz);
      const qavg = quizVals.length ? Math.round(quizVals.reduce((a, b) => a + b, 0) / quizVals.length) : 0;
      return `
      <section class="hero">
        <div>
          <h1 class="h-display">Rekursiya va backtracking</h1>
          <p class="lead">8 sprintlik oʻquv yoʻli: call stack'dan N-Queens va pruning gacha. Har bir gʻoya — Java va Python kodi, interaktiv laboratoriya, masalalar va test bilan.</p>
          <div class="btn-row">
            <a class="btn" href="#/sprint/${cur.n}">${started ? `Davom ettirish: Sprint ${cur.n}` : 'Sprint 1 dan boshlash'}</a>
            <a class="btn ghost" href="#/labs">Laboratoriyani ochish</a>
          </div>
          <div class="hero-stats">
            <div><b>${tp.pct}%</b>umumiy progress</div>
            <div><b>${done}/${tasks.length}</b>vazifa</div>
            <div><b>${solved}/${probs.length}</b>masala</div>
            <div><b>${qavg}%</b>test oʻrtachasi</div>
          </div>
        </div>
        <div class="droste-wrap">
          <div class="droste" data-droste aria-label="fact(5) ning rekursiv hisoblanishi: har bir chaqiruv oldingisining ichida">${drosteHTML(5)}</div>
          <div class="droste-cap"><span data-droste-msg aria-live="polite">fact(5) chaqirildi</span><button data-replay>Qayta koʻrish</button></div>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="h2">Sprintlar</h2><p>Har sprint — bir hafta: maqsad, darslar, laboratoriya, masalalar va test. Vazifalar sprint board'da kuzatiladi.</p></div><a class="btn ghost sm" href="#/board">Sprint board</a></div>
        ${roadmapHTML()}
      </section>
      <section class="section">
        <div class="section-head"><div><h2 class="h2">Laboratoriya</h2><p>Yettita vizualizator: har birida qadam-baqadam ijro, tezlik va klaviatura boshqaruvi (Space, ←, →).</p></div><a class="btn ghost sm" href="#/labs">Hammasi</a></div>
        <div class="lab-grid">${LAB_ORDER.map(labTile).join('')}</div>
      </section>`;
    },
    mount(root) {
      const d = animateDroste(root, 5);
      root.querySelector('[data-replay]').addEventListener('click', d.play);
      return d.stop;
    }
  };

  /* ================= SPRINTS OVERVIEW ================= */
  P.sprints = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Sprintlar xaritasi</b>`,
    render() {
      const totalL = RL.sprints.reduce((a, s) => a + s.lessons.length, 0);
      const totalP = RL.allProblems().length;
      const totalQ = RL.sprints.reduce((a, s) => a + s.quiz.length, 0);
      return `
      <h1 class="h1">Sprintlar xaritasi</h1>
      <p class="lead" style="margin-top:14px">8 hafta, ${totalL} dars, ${totalP} masala, ${totalQ} test savoli. Har sprint oldingisining ustiga quriladi — tartib bilan boring.</p>
      <div class="section" style="margin-top:36px">${RL.sprints.map(s => {
        const p = RL.sprintProgress(s);
        return `<article class="panel pad" style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:start">
            <div style="flex:1;min-width:260px">
              <div class="sp-num" style="margin:0"><b style="font-size:44px">${s.n}</b><span>${esc(s.weeks)}</span></div>
              <h2 class="h2" style="margin-top:6px"><a href="#/sprint/${s.n}" style="text-decoration:none">${esc(s.title)}</a></h2>
              <p class="muted" style="max-width:70ch">${esc(s.goal)}</p>
            </div>
            ${RL.progressRing(p.pct)}
          </div>
          <ol class="prose" style="font-size:16px;margin:8px 0 0;columns:2 280px;column-gap:32px">${s.lessons.map((l, i) => `<li><a href="#/sprint/${s.n}/lesson/${i}">${esc(l.t)}</a></li>`).join('')}</ol>
          <div class="btn-row" style="margin-top:12px">${s.labs.map(id => `<a class="chip plain" href="#/lab/${id}">${esc(RL.labs[id].title)}</a>`).join('')}<span class="chip plain">${s.problems.length} masala</span><span class="chip plain">${s.quiz.length} savol</span></div>
        </article>`;
      }).join('')}</div>`;
    }
  };

  /* ================= SPRINT ================= */
  const TABS = [['lessons', 'Darslar'], ['tasks', 'Vazifalar'], ['problems', 'Masalalar'], ['quiz', 'Test'], ['retro', 'Retro']];
  function dodItems(s) {
    const allRead = s.lessons.every((_, i) => RL.state.read[RL.lessonId(s, i)]);
    const solved = s.problems.filter(p => RL.state.solved[p.id]).length;
    const quiz = RL.state.quiz[s.n] || 0;
    const labSeen = s.labs.some(id => RL.state.labs[id]);
    const allLabs = s.labs.every(id => RL.state.labs[id]);
    return s.dod.map((t, i) => {
      let auto = null;
      if (/darslar oʻqilgan|dars oʻqilgan/.test(t)) auto = allRead;
      else if (/testidan 70/.test(t)) auto = quiz >= 70;
      else if (/(\d+) ta masala/.test(t)) auto = solved >= +t.match(/(\d+) ta masala/)[1];
      else if (/laboratoriyalari ishlatilgan/.test(t)) auto = allLabs;
      else if (/laboratoriya/i.test(t)) auto = labSeen;
      const key = `s${s.n}d${i}`;
      const ok = auto === true || (auto === null && RL.state.tasks[key] === 'done');
      return { t, ok, auto: auto !== null, key };
    });
  }
  function taskRow(t, withSprint) {
    const st = RL.taskStatus(t);
    const ty = RL.TASK_TYPES[t.type];
    const auto = t.lesson != null ? 'Dars oʻqilganda avtomatik' : t.problem ? 'Masala belgilanganda avtomatik' : t.quiz ? 'Test natijasidan avtomatik' : '';
    const title = t.link ? `<a href="${t.link}">${esc(t.title)}</a>` : t.lesson != null ? `<a href="#/sprint/${t.sprint || ''}/lesson/${t.lesson}">${esc(t.title)}</a>` : esc(t.title);
    return `<li class="task${st === 'done' ? ' done' : ''}">
      <span class="pts" title="Story points">${t.pts}</span>
      <div><div class="task-title">${title}</div><div class="task-sub"><span class="type-dot" style="--tc:${ty.c}">${ty.label}</span>${withSprint ? `<span>Sprint ${t.sprint}</span>` : ''}${auto ? `<span>${auto}</span>` : ''}</div></div>
      <select class="status-sel" data-task="${t.id}" aria-label="Holat">
        <option value="todo"${st === 'todo' ? ' selected' : ''}>Rejada</option>
        <option value="doing"${st === 'doing' ? ' selected' : ''}>Jarayonda</option>
        <option value="done"${st === 'done' ? ' selected' : ''}>Bajarildi</option>
      </select>
    </li>`;
  }
  function problemRows(list, showSprint) {
    return list.map(p => {
      const ok = !!RL.state.solved[p.id];
      return `<tr class="${ok ? 'solved' : ''}">
        <td><input type="checkbox" data-solve="${p.id}" ${ok ? 'checked' : ''} aria-label="${esc(p.name)} yechildi"></td>
        <td><a class="p-name" href="${RL.problemUrl(p)}" target="_blank" rel="noopener">${p.code ? esc(p.code) + '. ' : ''}${esc(p.name)}${icon.ext}</a>${p.note ? `<div class="p-note">${esc(p.note)}</div>` : ''}</td>
        <td class="hide-m"><span class="platform ${p.pl}">${RL.PLATFORMS[p.pl]}</span></td>
        <td>${levelChip(p.lv)}</td>
        ${showSprint ? `<td class="hide-m"><a href="#/sprint/${p.sprint}">${p.sprint}</a></td>` : ''}
      </tr>`;
    }).join('');
  }

  P.sprint = {
    crumb: p => { const s = RL.sprint(p.n); return s ? `<a href="#/sprints">Sprintlar</a><span class="sep">/</span><b>Sprint ${s.n}: ${esc(s.title)}</b>` : ''; },
    render(p) {
      const s = RL.sprint(p.n);
      if (!s) return P.notfound.render();
      const tab = TABS.some(t => t[0] === p.tab) ? p.tab : 'lessons';
      const pr = RL.sprintProgress(s);
      const started = RL.state.started[s.n];
      const day = started ? Math.floor((Date.now() - started) / 86400000) + 1 : 0;
      const counts = { lessons: s.lessons.length, tasks: s.tasks.length, problems: s.problems.length, quiz: s.quiz.length };
      let body = '';
      if (tab === 'lessons') body = `
        <div class="lessons">
          <nav class="toc" aria-label="Darslar"><ol>${s.lessons.map((l, i) => `<li><a href="#/sprint/${s.n}/lesson/${i}" data-toc="${i}" class="${RL.state.read[RL.lessonId(s, i)] ? 'read' : ''}"><span>${s.n}.${i + 1}</span><span>${esc(l.t)}</span></a></li>`).join('')}</ol></nav>
          <div>${s.lessons.map((l, i) => {
            const read = !!RL.state.read[RL.lessonId(s, i)];
            return `<article class="lesson" id="l${i}" data-lesson="${i}">
              <div class="lesson-n">Dars ${s.n}.${i + 1}</div>
              <h2 class="h2" style="margin-bottom:18px">${esc(l.t)}</h2>
              <div class="prose">${RL.renderBlocks(l.b)}</div>
              <div class="lesson-foot">
                <button class="btn sm ${read ? 'done' : 'ghost'}" data-read="${i}">${read ? `${icon.check} Oʻqilgan` : 'Oʻqildi deb belgilash'}</button>
                ${i < s.lessons.length - 1 ? `<a class="btn sm ghost" href="#/sprint/${s.n}/lesson/${i + 1}">Keyingi dars</a>` : `<a class="btn sm ghost" href="#/sprint/${s.n}/quiz">Testga oʻtish</a>`}
              </div>
            </article>`;
          }).join('')}</div>
        </div>`;
      if (tab === 'tasks') {
        const dod = dodItems(s);
        body = `<div class="board-top" style="margin-bottom:10px"><p class="muted" style="margin:0;max-width:62ch">Dars, masala va test vazifalari avtomatik yangilanadi. Qolganlarini holat tugmasi yoki <a href="#/board?s=${s.n}">sprint board</a> orqali oʻzgartiring.</p></div>
          <ul class="task-list">${s.tasks.map(t => taskRow(Object.assign({ sprint: s.n }, t))).join('')}</ul>
          <div class="dod"><h3 class="h3">Definition of Done</h3><ul>${dod.map(d => `<li class="${d.ok ? 'ok' : ''}">${d.auto ? '' : ''}${esc(d.t)}${d.auto ? '' : ` <button class="btn sm ghost" style="height:26px;margin-left:8px" data-dod="${d.key}">${d.ok ? 'Bekor qilish' : 'Bajarildi'}</button>`}</li>`).join('')}</ul></div>`;
      }
      if (tab === 'problems') body = `<div class="tbl-wrap"><table class="tbl prob-table"><thead><tr><th></th><th>Masala</th><th class="hide-m">Platforma</th><th>Daraja</th></tr></thead><tbody>${problemRows(s.problems.map(x => Object.assign({ sprint: s.n }, x)), false)}</tbody></table></div>
        <p class="muted small">Masala sahifasi yangi oynada ochiladi. Yechgach, belgilang — mos vazifa avtomatik bajariladi.</p>`;
      if (tab === 'quiz') {
        const best = RL.state.quiz[s.n];
        body = `<div class="quiz">
          <p class="muted" style="margin:0 0 6px">${s.quiz.length} ta savol. Har javobdan keyin izoh chiqadi. 70% va undan yuqori natija sprint vazifasini yopadi.${best != null ? ` Eng yaxshi natija: <b>${best}%</b>.` : ''}</p>
          <div data-quiz>${RL.quizHTML(s.quiz)}</div>
          <div class="panel quiz-score" data-score hidden></div>
        </div>`;
      }
      if (tab === 'retro') {
        const r = RL.state.retro[s.n] || {};
        body = `<p class="muted" style="margin:0 0 18px;max-width:64ch">Sprint oxirida 10 daqiqa ajrating. Yozganlaringiz faqat shu brauzerda saqlanadi.</p>
          <div class="retro">
            <label>Nima yaxshi boʻldi<span>Qaysi mavzu oson tushundi, qaysi masala zavq berdi</span><textarea class="input" data-retro="good">${esc(r.good || '')}</textarea></label>
            <label>Nima qiyin boʻldi<span>Qayerda adashdingiz, qaysi xatolar takrorlandi</span><textarea class="input" data-retro="hard">${esc(r.hard || '')}</textarea></label>
            <label>Keyingi sprintda<span>Bitta aniq oʻzgarish</span><textarea class="input" data-retro="next">${esc(r.next || '')}</textarea></label>
          </div>`;
      }
      const prev = RL.sprint(s.n - 1), next = RL.sprint(s.n + 1);
      return `
      <header class="sp-head">
        <div>
          <div class="sp-num"><b>${s.n}</b><span>/ ${RL.sprints.length} sprint</span></div>
          <h1 class="h1">${esc(s.title)}</h1>
          <p class="sp-goal"><strong>Sprint maqsadi.</strong> ${esc(s.goal)}</p>
          <div class="sp-meta">
            <div><b>${esc(s.weeks)}</b>davomiyligi</div>
            <div><b>${pr.total}</b>story points</div>
            <div><b>${s.labs.map(id => RL.labs[id].title).join(', ')}</b>laboratoriya</div>
          </div>
        </div>
        <aside class="panel sp-side">
          <div class="sp-progress">${RL.progressRing(pr.pct)}<p><strong>${pr.done} / ${pr.total}</strong> ball bajarildi.<br>${started ? `Boshlangan: ${fmtDate(started)}, ${day}-kun` : 'Sprint hali boshlanmagan'}</p></div>
          ${started ? '' : `<button class="btn sm" data-start style="width:100%;margin-bottom:16px">Sprintni boshlash</button>`}
          <h3>Sprint oxirida siz</h3>
          <ul>${s.outcomes.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
        </aside>
      </header>
      <nav class="tabs" aria-label="Sprint boʻlimlari">${TABS.map(([k, l]) => `<a href="#/sprint/${s.n}/${k}"${k === tab ? ' aria-current="page"' : ''}>${l}${counts[k] != null ? `<span>${counts[k]}</span>` : ''}</a>`).join('')}</nav>
      <section>${body}</section>
      <nav class="pager">${prev ? `<a href="#/sprint/${prev.n}"><span>Oldingi sprint</span><b>${prev.n}. ${esc(prev.title)}</b></a>` : '<span></span>'}${next ? `<a class="next" href="#/sprint/${next.n}"><span>Keyingi sprint</span><b>${next.n}. ${esc(next.title)}</b></a>` : ''}</nav>`;
    },
    mount(root, p) {
      const s = RL.sprint(p.n); if (!s) return;
      const rerender = () => RL.rerender();
      root.addEventListener('click', e => {
        const r = e.target.closest('[data-read]');
        if (r) {
          const i = +r.dataset.read; const val = !RL.state.read[RL.lessonId(s, i)];
          RL.markRead(s, i, val);
          r.className = `btn sm ${val ? 'done' : 'ghost'}`; r.innerHTML = val ? `${icon.check} Oʻqilgan` : 'Oʻqildi deb belgilash';
          const t = root.querySelector(`[data-toc="${i}"]`); if (t) t.classList.toggle('read', val);
          if (val) RL.toast('Dars oʻqilgan deb belgilandi');
          updateHead();
        }
        if (e.target.closest('[data-start]')) { RL.state.started[s.n] = Date.now(); RL.save(); rerender(); }
        const d = e.target.closest('[data-dod]');
        if (d) { const k = d.dataset.dod; RL.state.tasks[k] = RL.state.tasks[k] === 'done' ? 'todo' : 'done'; RL.save(); rerender(); }
        const opt = e.target.closest('.opt');
        if (opt && !opt.disabled) {
          const qEl = opt.closest('.q'); const qi = +qEl.dataset.q;
          RL.answerQuestion(qEl, s.quiz[qi], +opt.dataset.opt);
          qEl.dataset.answered = opt.dataset.opt;
          const all = RL.$$('.q', root);
          if (all.every(x => x.dataset.answered != null)) {
            const right = all.filter(x => +x.dataset.answered === s.quiz[+x.dataset.q].a).length;
            const pct = Math.round(right * 100 / all.length);
            RL.recordQuiz(s, pct);
            const box = root.querySelector('[data-score]');
            box.hidden = false;
            box.innerHTML = `<b>${pct}%</b><div><div style="font-weight:650">${right} / ${all.length} toʻgʻri</div><div class="muted small">${pct >= 70 ? 'Sprint testi topshirildi.' : 'Notoʻgʻri javoblar izohini oʻqib, darsga qayting va qayta urinib koʻring.'}</div></div><button class="btn sm ghost" data-retry>Qayta topshirish</button>`;
            box.scrollIntoView({ behavior: RL.reducedMotion() ? 'auto' : 'smooth', block: 'center' });
            updateHead();
          }
        }
        if (e.target.closest('[data-retry]')) { s.quiz.forEach(q => { delete q._order; }); rerender(); }
      });
      root.addEventListener('change', e => {
        const t = e.target.closest('[data-task]');
        if (t) { RL.setTask(t.dataset.task, t.value); t.closest('.task').classList.toggle('done', t.value === 'done'); updateHead(); }
        const c = e.target.closest('[data-solve]');
        if (c) { RL.markSolved(c.dataset.solve, c.checked); c.closest('tr').classList.toggle('solved', c.checked); updateHead(); }
      });
      let retroTimer;
      root.addEventListener('input', e => {
        const t = e.target.closest('[data-retro]'); if (!t) return;
        const r = RL.state.retro[s.n] = RL.state.retro[s.n] || {};
        r[t.dataset.retro] = t.value;
        clearTimeout(retroTimer); retroTimer = setTimeout(() => { RL.save(); RL.toast('Retro saqlandi'); }, 700);
      });
      function updateHead() {
        const pr = RL.sprintProgress(s);
        const ring = root.querySelector('.sp-side .ring');
        if (ring) { ring.style.setProperty('--p', pr.pct); ring.querySelector('span').textContent = pr.pct + '%'; }
        const strong = root.querySelector('.sp-progress strong'); if (strong) strong.textContent = `${pr.done} / ${pr.total}`;
        RL.renderRail();
      }
      let obs;
      if (p.tab === 'lessons' || !p.tab) {
        const links = RL.$$('[data-toc]', root);
        obs = new IntersectionObserver(entries => {
          entries.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('on', a.dataset.toc === en.target.dataset.lesson)); });
        }, { rootMargin: '-20% 0px -70% 0px' });
        RL.$$('.lesson', root).forEach(l => obs.observe(l));
        if (p.lesson != null) {
          const el = root.querySelector(`#l${p.lesson}`);
          if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
        }
      }
      return () => { obs && obs.disconnect(); clearTimeout(retroTimer); };
    }
  };

  /* ================= LABS ================= */
  P.labs = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Laboratoriya</b>`,
    render() {
      return `<h1 class="h1">Laboratoriya</h1>
        <p class="lead" style="margin:14px 0 32px">Rekursiyani koʻz bilan koʻring. Har laboratoriyada ▶ ijro, qadam-baqadam yurish, tezlik va vaqt chizigʻi bor. Klaviatura: <kbd>Space</kbd> ijro/pauza, <kbd>←</kbd> <kbd>→</kbd> qadam, <kbd>Home</kbd> <kbd>End</kbd>.</p>
        <div class="lab-grid">${LAB_ORDER.map(labTile).join('')}</div>`;
    }
  };
  P.lab = {
    crumb: p => { const L = RL.labs[p.id]; return L ? `<a href="#/labs">Laboratoriya</a><span class="sep">/</span><b>${esc(L.title)}</b>` : ''; },
    render(p) {
      const L = RL.labs[p.id];
      if (!L) return P.notfound.render();
      return `<div class="lab-head"><div><h1 class="h1">${esc(L.title)}</h1><p>${esc(L.desc)}</p></div>
        <div class="btn-row">${L.sprints.map(n => `<a class="btn sm ghost" href="#/sprint/${n}">Sprint ${n} darslari</a>`).join('')}</div></div>
        <div data-lab-root></div>
        <section class="lab-explain"><div><h2 class="h3" style="margin-bottom:12px">Nimaga qarash kerak</h2><div class="prose">${L.explain.text.map(t => `<p>${t}</p>`).join('')}</div></div>
        <div><h2 class="h3" style="margin-bottom:12px">Boshqaruv</h2><div class="prose"><ul><li><kbd>Space</kbd> — ijro yoki pauza</li><li><kbd>←</kbd> <kbd>→</kbd> — bir qadam orqaga yoki oldinga</li><li><kbd>Home</kbd> <kbd>End</kbd> — boshiga yoki oxiriga</li><li>Vaqt chizigʻini sudrab istalgan qadamga oʻting; «Tezlik» ning eng oxirgi qiymati katta qidiruvlarni bir necha soniyada koʻrsatadi.</li></ul></div></div></section>`;
    },
    mount(root, p) {
      const L = RL.labs[p.id]; if (!L) return;
      RL.markLab(p.id);
      const cleanup = L.mount(root.querySelector('[data-lab-root]'), p.query || {});
      RL.syncLangButtons();
      return cleanup;
    }
  };

  /* ================= BOARD ================= */
  const COLS = [['todo', 'Rejada', 'var(--d4)'], ['doing', 'Jarayonda', 'var(--sun)'], ['done', 'Bajarildi', 'var(--leaf)']];
  P.board = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Sprint board</b>`,
    render(p) {
      const sel = p.query && p.query.s ? (p.query.s === 'all' ? 'all' : +p.query.s) : RL.currentSprint().n;
      const tasks = RL.allTasks().filter(t => sel === 'all' || t.sprint === sel);
      const S = sel === 'all' ? null : RL.sprint(sel);
      const cur = RL.currentSprint();
      return `
      <div class="board-top">
        <div><h1 class="h1">Sprint board</h1><p class="muted" style="margin:10px 0 0;max-width:62ch">${S ? `<b>Sprint ${S.n} maqsadi:</b> ${esc(S.goal)}` : 'Barcha sprintlardagi vazifalar.'}</p></div>
        <div class="panel" style="min-width:300px;flex:1;max-width:520px"><div class="velocity" aria-label="Sprintlar boʻyicha bajarilgan ballar">${RL.sprints.map(s => { const pr = RL.sprintProgress(s); return `<a class="vel${s === cur ? ' cur' : ''}" href="#/board?s=${s.n}" title="Sprint ${s.n}: ${pr.done}/${pr.total} ball"><span class="vb" style="height:100%"><i style="height:${pr.pct}%"></i></span><span>${s.n}</span></a>`; }).join('')}</div></div>
      </div>
      <div class="filter-chips" style="margin-bottom:18px" role="group" aria-label="Sprint tanlash">
        <a class="fchip" href="#/board?s=all" aria-pressed="${sel === 'all'}" style="display:inline-grid;place-items:center;text-decoration:none">Hammasi</a>
        ${RL.sprints.map(s => `<a class="fchip" href="#/board?s=${s.n}" aria-pressed="${sel === s.n}" style="display:inline-grid;place-items:center;text-decoration:none">Sprint ${s.n}</a>`).join('')}
      </div>
      <div class="board">${COLS.map(([k, l, c], ci) => {
        const list = tasks.filter(t => RL.taskStatus(t) === k);
        const pts = list.reduce((a, t) => a + t.pts, 0);
        return `<section class="col" data-col="${k}" aria-label="${l}">
          <div class="col-h"><div><i style="background:${c}"></i>${l}</div><span>${list.length} ta, ${pts} ball</span></div>
          ${list.map(t => {
            const ty = RL.TASK_TYPES[t.type];
            return `<article class="card" draggable="true" data-card="${t.id}">
              <div class="card-t">${esc(t.title)}</div>
              <div class="card-m"><span class="type-dot" style="--tc:${ty.c}">${ty.label}${sel === 'all' ? `, S${t.sprint}` : ''}</span>
                <span style="display:flex;gap:8px;align-items:center"><span class="pts">${t.pts}</span><span class="mv"><button data-mv="-1" aria-label="Chapga" ${ci === 0 ? 'disabled' : ''}>${icon.left}</button><button data-mv="1" aria-label="Oʻngga" ${ci === 2 ? 'disabled' : ''}>${icon.right}</button></span></span></div>
            </article>`;
          }).join('') || `<p class="small muted" style="padding:6px">Boʻsh</p>`}
        </section>`;
      }).join('')}</div>`;
    },
    mount(root) {
      const order = COLS.map(c => c[0]);
      let dragId = null;
      root.addEventListener('dragstart', e => { const c = e.target.closest('[data-card]'); if (!c) return; dragId = c.dataset.card; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); });
      root.addEventListener('dragend', e => { const c = e.target.closest('[data-card]'); if (c) c.classList.remove('dragging'); RL.$$('.col', root).forEach(x => x.classList.remove('over')); });
      root.addEventListener('dragover', e => { const col = e.target.closest('[data-col]'); if (!col || !dragId) return; e.preventDefault(); RL.$$('.col', root).forEach(x => x.classList.toggle('over', x === col)); });
      root.addEventListener('drop', e => { const col = e.target.closest('[data-col]'); if (!col || !dragId) return; e.preventDefault(); RL.setTask(dragId, col.dataset.col); dragId = null; RL.rerender(); });
      root.addEventListener('click', e => {
        const b = e.target.closest('[data-mv]'); if (!b) return;
        const id = b.closest('[data-card]').dataset.card;
        const t = RL.allTasks().find(x => x.id === id);
        const i = order.indexOf(RL.taskStatus(t)) + (+b.dataset.mv);
        if (i >= 0 && i < 3) { RL.setTask(id, order[i]); RL.rerender(); }
      });
    }
  };

  /* ================= PROBLEMS ================= */
  P.problems = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Masalalar</b>`,
    render() {
      const all = RL.allProblems();
      return `<h1 class="h1">Masalalar</h1>
        <p class="lead" style="margin:14px 0 28px">${all.length} ta masala LeetCode, CSES, Codeforces va SPOJ dan, sprintlar boʻyicha saralangan. Yechganingizni belgilang.</p>
        <div class="prob-filters">
          <label class="field grow">Qidirish<input class="input" data-pf="q" type="search" placeholder="Nom, raqam yoki izoh"></label>
          <label class="field">Sprint<select class="input" data-pf="s"><option value="">Hammasi</option>${RL.sprints.map(s => `<option value="${s.n}">${s.n}. ${esc(s.title)}</option>`).join('')}</select></label>
          <label class="field">Platforma<select class="input" data-pf="pl"><option value="">Hammasi</option>${Object.keys(RL.PLATFORMS).map(k => `<option value="${k}">${RL.PLATFORMS[k]}</option>`).join('')}</select></label>
          <label class="field">Daraja<select class="input" data-pf="lv"><option value="">Hammasi</option>${Object.keys(RL.LEVELS).map(k => `<option value="${k}">${RL.LEVELS[k]}</option>`).join('')}</select></label>
          <label class="field">Holat<select class="input" data-pf="st"><option value="">Hammasi</option><option value="open">Yechilmagan</option><option value="done">Yechilgan</option></select></label>
        </div>
        <div class="summary-line" data-sum></div>
        <div class="tbl-wrap"><table class="tbl prob-table"><thead><tr><th></th><th>Masala</th><th class="hide-m">Platforma</th><th>Daraja</th><th class="hide-m">Sprint</th></tr></thead><tbody data-rows></tbody></table></div>`;
    },
    mount(root) {
      const all = RL.allProblems();
      const f = {};
      function draw() {
        const q = (f.q || '').toLowerCase();
        const list = all.filter(p => (!f.s || p.sprint === +f.s) && (!f.pl || p.pl === f.pl) && (!f.lv || p.lv === f.lv)
          && (!f.st || (f.st === 'done') === !!RL.state.solved[p.id])
          && (!q || `${p.code} ${p.name} ${p.note || ''}`.toLowerCase().includes(q)));
        root.querySelector('[data-rows]').innerHTML = list.length ? problemRows(list, true) : `<tr><td colspan="5" class="empty">Bu filtrlar boʻyicha masala yoʻq. Filtrlarni yumshating.</td></tr>`;
        const solved = all.filter(p => RL.state.solved[p.id]);
        const by = lv => `${solved.filter(p => p.lv === lv).length}/${all.filter(p => p.lv === lv).length}`;
        root.querySelector('[data-sum]').innerHTML = `<span>Yechilgan: <b>${solved.length}/${all.length}</b></span><span>Oson: <b>${by('easy')}</b></span><span>Oʻrta: <b>${by('mid')}</b></span><span>Qiyin: <b>${by('hard')}</b></span><span>Koʻrsatilmoqda: <b>${list.length}</b></span>`;
      }
      root.addEventListener('input', e => { const el = e.target.closest('[data-pf]'); if (el) { f[el.dataset.pf] = el.value; draw(); } });
      root.addEventListener('change', e => {
        const c = e.target.closest('[data-solve]');
        if (c) { RL.markSolved(c.dataset.solve, c.checked); draw(); RL.renderRail(); }
      });
      draw();
    }
  };

  /* ================= CHEATSHEET ================= */
  P.cheatsheet = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Shpargalka</b>`,
    render() {
      const C = RL.ref.cheats;
      return `<h1 class="h1">Shpargalka</h1>
        <p class="lead" style="margin:14px 0 32px">Contest oldidan bir varaqda: shablonlar, murakkabliklar va usul tanlash jadvali.</p>
        <div class="ref-grid">
          <nav class="toc" aria-label="Boʻlimlar"><ol>${C.map((c, i) => `<li><a href="#/cheatsheet" data-jump="${c.id}"><span>${i + 1}</span><span>${esc(c.t)}</span></a></li>`).join('')}</ol></nav>
          <div>${C.map(c => `<section class="ref-sec" id="c-${c.id}"><h2 class="h2">${esc(c.t)}</h2>${c.p ? `<div class="prose"><p>${c.p}</p></div>` : ''}${c.code ? RL.codeBlock(c.code) : ''}${c.table ? RL.renderBlocks([{ table: c.table }]) : ''}</section>`).join('')}</div>
        </div>`;
    },
    mount(root) {
      root.addEventListener('click', e => {
        const a = e.target.closest('[data-jump]'); if (!a) return;
        e.preventDefault(); const el = root.querySelector('#c-' + a.dataset.jump); if (el) el.scrollIntoView({ behavior: RL.reducedMotion() ? 'auto' : 'smooth' });
      });
    }
  };

  /* ================= GLOSSARY ================= */
  P.glossary = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Lugʻat</b>`,
    render(p) {
      return `<h1 class="h1">Atamalar lugʻati</h1>
        <p class="lead" style="margin:14px 0 24px">${RL.ref.glossary.length} ta atama: inglizcha nomi, oʻzbekcha tarjimasi va qisqa izohi.</p>
        <label class="field" style="max-width:420px;margin-bottom:12px">Qidirish<input class="input" type="search" data-gq value="${esc(p.query && p.query.q || '')}" placeholder="masalan: pruning yoki stek"></label>
        <dl class="gloss" data-gl></dl>`;
    },
    mount(root) {
      const inp = root.querySelector('[data-gq]');
      function draw() {
        const q = inp.value.trim().toLowerCase();
        const list = RL.ref.glossary.filter(g => !q || `${g.en} ${g.uz} ${g.d}`.toLowerCase().includes(q));
        root.querySelector('[data-gl]').innerHTML = list.length ? list.map(g => `<div><dt>${esc(g.en)}<span>${esc(g.uz)}</span></dt><dd>${esc(g.d)} ${sprintLink(g.s)}</dd></div>`).join('') : `<p class="empty">«${esc(q)}» boʻyicha atama topilmadi.</p>`;
      }
      inp.addEventListener('input', draw); draw();
    }
  };

  /* ================= EXAM ================= */
  let exam = null;
  P.exam = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Imtihon</b>`,
    render() {
      const hist = RL.state.exams.slice(-8).reverse();
      return `<h1 class="h1">Imtihon</h1>
        <p class="lead" style="margin:14px 0 28px">Barcha sprintlardan tasodifiy savollar, bittadan. 20 ta savolda 80% va undan yuqori natija Sprint 8 ning yakuniy vazifasini yopadi.</p>
        <div data-exam></div>
        ${hist.length ? `<section class="section" style="margin-top:48px"><h2 class="h3" style="margin-bottom:12px">Oldingi urinishlar</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Sana</th><th>Savollar</th><th>Natija</th><th>Vaqt</th></tr></thead><tbody>${hist.map(h => `<tr><td>${fmtDate(h.at)}</td><td>${h.n}</td><td><b>${h.pct}%</b></td><td>${Math.floor(h.sec / 60)} daq ${h.sec % 60} s</td></tr>`).join('')}</tbody></table></div></section>` : ''}`;
    },
    mount(root) {
      const box = root.querySelector('[data-exam]');
      let timer = null;
      const pool = () => RL.sprints.flatMap(s => s.quiz.map(q => Object.assign({ sprint: s.n }, q)));
      function intro() {
        clearInterval(timer);
        box.innerHTML = `<div class="panel pad" style="max-width:640px">
          <div class="btn-row" style="margin-bottom:18px"><div class="field">Savollar soni<div class="seg" role="group" data-cnt>${[10, 15, 20].map(n => `<button data-n="${n}" aria-pressed="${n === 20}">${n}</button>`).join('')}</div></div>
          <label class="check" style="margin-top:20px"><input type="checkbox" data-timed checked> Vaqt bilan (har savolga 60 soniya)</label></div>
          <button class="btn" data-begin>Imtihonni boshlash</button></div>`;
      }
      function start(n, timed) {
        const qs = RL.shuffle(pool()).slice(0, n).map(q => Object.assign({}, q, { _order: RL.shuffle(q.o.map((_, k) => k)) }));
        exam = { qs, i: 0, ans: [], timed, left: n * 60, t0: Date.now() };
        if (timed) timer = setInterval(() => { exam.left--; const t = box.querySelector('[data-timer]'); if (t) { t.textContent = clock(exam.left); t.classList.toggle('low', exam.left < 60); } if (exam.left <= 0) finish(); }, 1000);
        show();
      }
      const clock = s => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;
      function show() {
        const q = exam.qs[exam.i];
        box.innerHTML = `<div class="quiz">
          <div class="exam-top"><span class="muted">Savol ${exam.i + 1} / ${exam.qs.length}, Sprint ${q.sprint}</span>${exam.timed ? `<span class="timer" data-timer>${clock(exam.left)}</span>` : ''}</div>
          <div class="exam-dots">${exam.qs.map((_, k) => `<i class="${k < exam.ans.length ? (exam.ans[k] === exam.qs[k].a ? 'r' : 'w') : k === exam.i ? 'c' : ''}"></i>`).join('')}</div>
          ${RL.quizHTML([q], 'Savol').replace('Savol 1', `Savol ${exam.i + 1}`)}
          <div class="btn-row" style="margin-top:18px"><button class="btn" data-next hidden>${exam.i === exam.qs.length - 1 ? 'Natijani koʻrish' : 'Keyingi savol'}</button><button class="btn ghost sm" data-quit>Toʻxtatish</button></div>
        </div>`;
      }
      function finish() {
        clearInterval(timer);
        const n = exam.qs.length;
        const right = exam.ans.filter((a, k) => a === exam.qs[k].a).length;
        const pct = Math.round(right * 100 / n);
        const sec = Math.round((Date.now() - exam.t0) / 1000);
        RL.state.exams.push({ at: Date.now(), n, pct, sec });
        if (n >= 20 && pct >= 80) RL.setTask('s8t5', 'done', true);
        RL.save();
        const wrong = exam.qs.map((q, k) => ({ q, a: exam.ans[k] })).filter(x => x.a !== x.q.a);
        box.innerHTML = `<div class="panel quiz-score" style="max-width:760px;margin-top:0"><b>${pct}%</b><div><div style="font-weight:650">${right} / ${n} toʻgʻri, ${Math.floor(sec / 60)} daq ${sec % 60} s</div><div class="muted small">${pct >= 80 ? 'Ajoyib natija.' : 'Xatolar roʻyxatidagi sprintlarga qayting.'}</div></div><button class="btn sm" data-again>Yana topshirish</button></div>
          ${wrong.length ? `<div class="quiz" style="margin-top:24px"><h2 class="h3">Xatolar tahlili</h2>${wrong.map(x => `<div class="q"><div class="q-n"><a href="#/sprint/${x.q.sprint}">Sprint ${x.q.sprint}</a></div><p class="q-text">${x.q.q}</p>${x.q.code ? `<pre>${RL.highlight(x.q.code.replace(/^\n/, ''), 'java')}</pre>` : ''}<div class="why bad"><strong>Toʻgʻri javob: ${x.q.o[x.q.a]}.</strong> ${x.q.why || ''}${x.a == null ? ' <em>(javob berilmagan)</em>' : ''}</div></div>`).join('')}</div>` : ''}`;
        exam = null;
        RL.renderRail();
      }
      box.addEventListener('click', e => {
        const seg = e.target.closest('[data-cnt] [data-n]');
        if (seg) RL.$$('[data-cnt] [data-n]', box).forEach(b => b.setAttribute('aria-pressed', String(b === seg)));
        if (e.target.closest('[data-begin]')) {
          const n = +(box.querySelector('[data-cnt] [aria-pressed=true]') || { dataset: { n: 20 } }).dataset.n;
          start(n, box.querySelector('[data-timed]').checked);
        }
        const opt = e.target.closest('.opt');
        if (opt && !opt.disabled && exam) {
          const q = exam.qs[exam.i];
          RL.answerQuestion(box.querySelector('.q'), q, +opt.dataset.opt);
          exam.ans[exam.i] = +opt.dataset.opt;
          box.querySelector('[data-next]').hidden = false; box.querySelector('[data-next]').focus();
        }
        if (e.target.closest('[data-next]') && exam) { exam.i++; if (exam.i >= exam.qs.length) finish(); else show(); }
        if (e.target.closest('[data-quit]')) { clearInterval(timer); exam = null; intro(); }
        if (e.target.closest('[data-again]')) RL.rerender();
      });
      intro();
      return () => { clearInterval(timer); exam = null; };
    }
  };

  /* ================= SETTINGS ================= */
  P.settings = {
    crumb: () => `<a href="#/">Bosh sahifa</a><span class="sep">/</span><b>Sozlamalar</b>`,
    render() {
      const th = RL.state.theme;
      return `<h1 class="h1">Sozlamalar</h1>
      <div class="settings" style="margin-top:28px">
        <section class="panel"><h2>Mavzu</h2><p>Avto rejim qurilma sozlamasiga ergashadi.</p>
          <div class="seg" role="group" aria-label="Mavzu">${[['auto', 'Avto'], ['light', 'Yorugʻ'], ['dark', 'Qorongʻi']].map(([k, l]) => `<button data-theme-set="${k}" aria-pressed="${th === k}">${l}</button>`).join('')}</div></section>
        <section class="panel"><h2>Kod tili</h2><p>Barcha kod bloklari va laboratoriyalardagi kod shu tilda koʻrsatiladi.</p>
          <div class="seg" role="group" aria-label="Kod tili"><button data-set-lang="java">Java</button><button data-set-lang="py">Python</button></div></section>
        <section class="panel"><h2>Progressni saqlash</h2><p>Progress faqat shu brauzerning localStorage'ida turadi. Boshqa qurilmaga oʻtkazish uchun eksport qiling va u yerda import qiling.</p>
          <div class="btn-row"><button class="btn sm" data-export>JSON eksport</button><label class="btn sm ghost" style="cursor:pointer">JSON import<input type="file" accept="application/json,.json" data-import hidden></label></div></section>
        <section class="panel"><h2>Progressni tozalash</h2><p>Barcha vazifa holatlari, oʻqilgan darslar, masalalar, test natijalari va retro yozuvlari oʻchiriladi.</p>
          <button class="btn sm ghost" data-reset style="border-color:var(--rose);color:var(--rose)">Progressni tozalash</button></section>
        <section class="panel"><h2>Ilova haqida</h2><p style="margin:0">Rekursiya Lab — statik sayt, internet va server talab qilmaydi (shriftlar ichida). GitHub Pages yoki istalgan statik hostingda ishlaydi.</p></section>
      </div>`;
    },
    mount(root) {
      let armed = null;
      root.addEventListener('click', e => {
        const t = e.target.closest('[data-theme-set]');
        if (t) { RL.setTheme(t.dataset.themeSet); RL.$$('[data-theme-set]', root).forEach(b => b.setAttribute('aria-pressed', String(b === t))); }
        if (e.target.closest('[data-export]')) {
          const blob = new Blob([JSON.stringify(RL.state, null, 2)], { type: 'application/json' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `rekursiya-lab-progress-${new Date().toISOString().slice(0, 10)}.json`;
          document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          RL.toast('Progress eksport qilindi');
        }
        const r = e.target.closest('[data-reset]');
        if (r) {
          if (armed) { clearTimeout(armed); armed = null; const theme = RL.state.theme, lang = RL.state.lang; RL.resetState(); RL.state.theme = theme; RL.state.lang = lang; RL.save(); RL.toast('Progress tozalandi'); RL.rerender(); }
          else { r.textContent = 'Tasdiqlash: hammasini oʻchirish'; r.style.background = 'var(--rose)'; r.style.color = '#fff'; armed = setTimeout(() => { armed = null; r.textContent = 'Progressni tozalash'; r.style.background = ''; r.style.color = 'var(--rose)'; }, 4000); }
        }
      });
      root.addEventListener('change', e => {
        const f = e.target.closest('[data-import]'); if (!f || !f.files[0]) return;
        const rd = new FileReader();
        rd.onload = () => {
          try { const obj = JSON.parse(rd.result); if (typeof obj !== 'object' || !obj) throw 0; RL.importState(obj); RL.applyTheme(); RL.toast('Progress import qilindi'); RL.rerender(); }
          catch (err) { RL.toast('Fayl notoʻgʻri: Rekursiya Lab eksport faylini tanlang'); }
        };
        rd.readAsText(f.files[0]);
      });
      return () => armed && clearTimeout(armed);
    }
  };

  P.notfound = {
    crumb: () => `<b>Sahifa topilmadi</b>`,
    render: () => `<div class="empty" style="padding:80px 0"><h1 class="h1">Bunday sahifa yoʻq</h1><p class="lead" style="margin:16px auto 24px">Manzil notoʻgʻri yoki eskirgan boʻlishi mumkin.</p><a class="btn" href="#/">Bosh sahifaga</a></div>`
  };
})();
