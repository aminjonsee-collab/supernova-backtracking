# Rekursiya Lab

Rekursiya va backtracking boʻyicha 8 sprintlik interaktiv oʻquv ilovasi. Statik sayt: server, build yoki internet talab qilmaydi (shriftlar ham ichida).

## Ichida nima bor

- **8 sprint** (har biri 1 hafta): maqsad, natijalar, 44 ta batafsil dars, Java va Python kodlari, vazifalar (story points), masalalar, test, Definition of Done, retro.
- **7 laboratoriya**: Chaqiruvlar steki, Rekursiya daraxti (memo bilan), Hanoi minoralari (avtomatik va qoʻlda), Holatlar daraxti (subsets / permutations / combinations / combination sum / qavslar), N-Queens, Sudoku (oddiy va MRV), Labirint (DFS).
- **Sprint board**: Rejada / Jarayonda / Bajarildi, drag-and-drop, sprintlar boʻyicha ballar grafigi.
- **67 masala** (LeetCode, CSES, Codeforces, SPOJ) filtrlar bilan.
- **Imtihon** rejimi (vaqt bilan), **shpargalka**, **lugʻat** (40 atama), `Ctrl K` qidiruv, yorugʻ va qorongʻi mavzu.
- Progress brauzerning `localStorage` ida saqlanadi; Sozlamalar sahifasida JSON eksport/import bor.

## GitHub Pages'ga joylash

1. GitHub'da yangi repozitoriy oching (masalan `rekursiya-lab`).
2. Shu papkadagi **hamma narsani** repozitoriy ildiziga yuklang (`index.html` ildizda boʻlsin, `.nojekyll` fayli ham).
   ```bash
   git init
   git add .
   git commit -m "Rekursiya Lab"
   git branch -M main
   git remote add origin https://github.com/<login>/rekursiya-lab.git
   git push -u origin main
   ```
3. Repozitoriy → **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main`, papka: `/ (root)` → Save.
4. 1–2 daqiqadan keyin sayt `https://<login>.github.io/rekursiya-lab/` manzilida ochiladi.

Lokal ishga tushirish: `index.html` ni brauzerda toʻgʻridan-toʻgʻri ochish mumkin, yoki `python -m http.server` bilan.

## Tuzilma

```
index.html
assets/css/style.css
assets/fonts/            Archivo, Source Serif 4, JetBrains Mono (SIL OFL)
assets/js/core.js        holat, kod rang berish, progress modeli
assets/js/components.js  Player (ijro paneli), TreeView, test
assets/js/content/       sprint1.js … sprint8.js, reference.js (lugʻat, shpargalka)
assets/js/labs/          7 ta laboratoriya
assets/js/pages.js       sahifalar
assets/js/app.js         router, navigatsiya, qidiruv, mavzu
```

## Kontent qoʻshish

Yangi dars, masala yoki savol qoʻshish uchun tegishli `assets/js/content/sprintN.js` faylini tahrirlang. Masala formati:

```js
{ pl: 'lc', code: '78', slug: 'subsets', name: `Subsets`, lv: 'mid', note: `...` }
```

`pl`: `lc` | `cf` | `cses` | `spoj`; `lv`: `easy` | `mid` | `hard`. Har bir masala uchun board'da vazifa avtomatik yaratiladi.
