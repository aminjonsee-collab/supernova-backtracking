RL.addSprint({
  n: 3,
  title: `Rekursiya daraxti va murakkablik`,
  weeks: `1 hafta`,
  goal: `Bir necha marta oʻzini chaqiradigan funksiyalarni rekursiya daraxti sifatida koʻrish, vaqt va xotirani rekurrent tenglamalar va Master teorema bilan baholash.`,
  outcomes: [
    `Rekursiya daraxtini chizib, tugunlar sonini hisoblaysiz`,
    `Rekurrent tenglamani ochish (unrolling) usuli bilan yechasiz`,
    `Master teoremani qoʻllaysiz va uning chegaralarini bilasiz`,
    `Vaqt (tugunlar soni) va xotira (chuqurlik) ni farqlaysiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Rekursiya daraxti laboratoriyasida fib va grid funksiyalari koʻrilgan`,
    `Kamida 4 ta masala yechilgan`,
    `Sprint testidan 70%+`
  ],
  labs: ['tree'],
  lessons: [
    {
      t: `Rekursiya daraxti`,
      b: [
        `Funksiya oʻzini bir necha marta chaqirsa, chaqiruvlar zanjir emas, <strong>daraxt</strong> hosil qiladi. Har tugun — bitta chaqiruv, bolalari — u qilgan chaqiruvlar, barglar — base case'lar.`,
        { trace: `
                  fib(4)
               /          \\
           fib(3)          fib(2)
          /      \\        /     \\
      fib(2)   fib(1)  fib(1)  fib(0)
      /    \\
  fib(1)  fib(0)` },
        `<code>fib(4)</code> uchun 9 ta chaqiruv. <code>fib(2)</code> ikki marta, <code>fib(1)</code> uch marta hisoblanmoqda — bu takrorlanishlar n oshgan sari portlaydi.`,
        { code: { java: `
static long calls = 0;

static long fib(int n) {
    calls++;
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`, py: `
calls = 0

def fib(n):
    global calls
    calls += 1
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)` }, cap: `Chaqiruvlar hisoblagichi` },
        { table: { head: [`n`, `fib(n)`, `chaqiruvlar`], rows: [
          [`10`, `55`, `177`], [`20`, `6 765`, `21 891`], [`30`, `832 040`, `2 692 537`], [`40`, `102 334 155`, `331 160 281`]
        ] } },
        { note: `Chaqiruvlar soni C(n) = 2·F(n+1) − 1. Ya'ni chaqiruvlar soni javobning oʻzi kabi eksponensial oʻsadi: taxminan 1.618ⁿ (oltin kesim φ).`, title: `Formula` },
        { lab: 'tree', q: 'fn=fib&n=6', text: `fib(6) daraxtini qadam-baqadam quring; oʻng paneldagi «nechta marta chaqirildi» grafigiga qarang.` }
      ]
    },
    {
      t: `Rekurrent tenglamalar`,
      b: [
        `Rekursiv algoritm vaqtini <span class="term">rekurrent tenglama</span> bilan yozamiz: T(n) = (kichik chaqiruvlar vaqti) + (shu chaqiruvning oʻzidagi ish).`,
        { table: { head: [`Kod shakli`, `Tenglama`, `Yechim`, `Misol`], rows: [
          [`bitta f(n−1), O(1) ish`, `T(n) = T(n−1) + O(1)`, `O(n)`, `fact, sum`],
          [`bitta f(n−1), O(n) ish`, `T(n) = T(n−1) + O(n)`, `O(n²)`, `slicing bilan sum, selection sort`],
          [`ikkita f(n−1)`, `T(n) = 2T(n−1) + O(1)`, `O(2ⁿ)`, `Hanoi, subsets`],
          [`f(n−1) + f(n−2)`, `T(n) = T(n−1) + T(n−2) + O(1)`, `O(φⁿ) ≈ O(1.618ⁿ)`, `naive fib`],
          [`bitta f(n/2)`, `T(n) = T(n/2) + O(1)`, `O(log n)`, `binary search, binpow`],
          [`ikkita f(n/2), O(n) ish`, `T(n) = 2T(n/2) + O(n)`, `O(n log n)`, `merge sort`],
          [`ikkita f(n/2), O(1) ish`, `T(n) = 2T(n/2) + O(1)`, `O(n)`, `maxDC`]
        ] } },
        { h: `Ochish (unrolling) usuli` },
        `Tenglamani oʻziga qayta-qayta qoʻyib, umumiy qonuniyatni topamiz:`,
        { trace: `
T(n) = 2T(n−1) + 1
     = 2(2T(n−2) + 1) + 1        = 4T(n−2) + 2 + 1
     = 8T(n−3) + 4 + 2 + 1
     = 2ᵏ · T(n−k) + (2ᵏ − 1)
k = n bo'lganda:  T(n) = 2ⁿ · T(0) + 2ⁿ − 1 = O(2ⁿ)` },
        { h: `Daraxt usuli` },
        `Har darajada nechta tugun va har tugunda qancha ish borligini hisoblab, darajalar boʻyicha yigʻamiz. Merge sort: 0-darajada 1 ta n hajmli tugun, 1-darajada 2 ta n/2 hajmli, … k-darajada 2ᵏ ta n/2ᵏ hajmli. Har darajada jami ish O(n), darajalar soni log₂ n → <strong>O(n log n)</strong>.`,
        { note: `Agar har darajadagi ish geometrik kamaysa — ildiz ustun (javob = ildizdagi ish). Geometrik oʻssa — barglar ustun (javob = barglar soni). Teng boʻlsa — darajalar soniga koʻpaytiriladi. Bu Master teoremaning intuitiv mazmuni.`, kind: 'key' }
      ]
    },
    {
      t: `Master teorema`,
      b: [
        `Koʻrinishi <code>T(n) = a·T(n/b) + f(n)</code> boʻlgan tenglamalar uchun tayyor javob. Bu yerda a — rekursiv chaqiruvlar soni, n/b — har birining hajmi, f(n) — boʻlish va birlashtirish ishi. Asosiy taqqoslash: f(n) ni <strong>n^(log_b a)</strong> bilan solishtiramiz.`,
        { table: { head: [`Holat`, `Shart`, `Javob`, `Mazmuni`], rows: [
          [`1`, `f(n) = O(n^c), c < log_b a`, `Θ(n^(log_b a))`, `Barglar ustun`],
          [`2`, `f(n) = Θ(n^(log_b a))`, `Θ(n^(log_b a) · log n)`, `Teng taqsimlangan`],
          [`3`, `f(n) = Ω(n^c), c > log_b a`, `Θ(f(n))`, `Ildiz ustun`]
        ] } },
        { h: `Misollar` },
        { table: { head: [`Tenglama`, `a, b, log_b a`, `Holat`, `Javob`], rows: [
          [`T(n) = 2T(n/2) + n`, `2, 2, 1`, `2`, `n log n (merge sort)`],
          [`T(n) = T(n/2) + 1`, `1, 2, 0`, `2`, `log n (binary search)`],
          [`T(n) = 4T(n/2) + n`, `4, 2, 2`, `1`, `n²`],
          [`T(n) = 2T(n/2) + n²`, `2, 2, 1`, `3`, `n²`],
          [`T(n) = 3T(n/2) + n`, `3, 2, ≈1.585`, `1`, `n^1.585 (Karatsuba)`],
          [`T(n) = 3T(n/3) + 1`, `3, 3, 1`, `1`, `n`]
        ] } },
        { note: `Master teorema faqat n/b koʻrinishdagi boʻlinish uchun. <code>T(n) = 2T(n−1) + 1</code> kabi «ayirish» tenglamalariga qoʻllanmaydi — ularni ochish usuli bilan yeching.`, kind: 'warn', title: `Chegarasi` }
      ]
    },
    {
      t: `Vaqt va xotira: tugunlar soni va chuqurlik`,
      b: [
        `Ikki asosiy formula:`,
        { list: [
          `<strong>Vaqt</strong> ≈ (daraxtdagi tugunlar soni) × (bitta tugundagi ish).`,
          `<strong>Stek xotirasi</strong> ≈ daraxtning maksimal chuqurligi × (bitta frame hajmi).`
        ] },
        `Naive fib: tugunlar ≈ 1.618ⁿ, chuqurlik esa bor-yoʻgʻi n. Vaqt eksponensial, xotira chiziqli. Sababi: daraxtni DFS tartibida aylanamiz — bir vaqtda faqat ildizdan joriy tugungacha boʻlgan bitta yoʻl stekda turadi.`,
        { table: { head: [`Algoritm`, `Tugunlar`, `Chuqurlik`, `Vaqt`, `Stek`], rows: [
          [`fact(n)`, `n`, `n`, `O(n)`, `O(n)`],
          [`binary search`, `log n`, `log n`, `O(log n)`, `O(log n)`],
          [`merge sort`, `≈ 2n`, `log n`, `O(n log n)`, `O(log n) + massiv O(n)`],
          [`naive fib`, `≈ φⁿ`, `n`, `O(φⁿ)`, `O(n)`],
          [`subsets`, `2ⁿ⁺¹`, `n`, `O(n · 2ⁿ)`, `O(n)`],
          [`permutations`, `≈ e · n!`, `n`, `O(n · n!)`, `O(n)`]
        ] } },
        { lab: 'tree', q: 'fn=grid&n=3', text: `paths(r, c) daraxtida chuqurlik (r + c) va tugunlar soni qanday bogʻlanganini koʻring.` },
        { note: `Contest'da «Memory Limit» xatosini koʻrsangiz, avval rekursiya chuqurligini va memo massiv hajmini tekshiring; «Time Limit» da esa tugunlar sonini.`, kind: 'tip' }
      ]
    },
    {
      t: `Murakkablikni tajribada tekshirish`,
      b: [
        `Nazariy hisobni tekshirishning oddiy usuli — <strong>oʻlchash tajribasi</strong>: n ni oshirib, vaqt qanday oʻzgarishini kuzatish.`,
        { list: [
          `n ni +1 qilganda vaqt ~1.6 baravar oshsa — φⁿ; ~2 baravar — 2ⁿ.`,
          `n ni 2 baravar oshirganda vaqt ~2 baravar oshsa — O(n); 2 dan sal koʻp — O(n log n); ~4 baravar — O(n²).`
        ] },
        { code: { java: `
public static void main(String[] args) {
    for (int n = 25; n <= 40; n += 5) {
        long t = System.nanoTime();
        long r = fib(n);
        double ms = (System.nanoTime() - t) / 1e6;
        System.out.println("n=" + n + "  fib=" + r + "  " + ms + " ms");
    }
}`, py: `
import time

for n in range(20, 33, 4):
    t = time.perf_counter()
    r = fib(n)
    ms = (time.perf_counter() - t) * 1000
    print(f"n={n}  fib={r}  {ms:.1f} ms")` } },
        { note: `Taxminiy qoida: 1 soniyada ~10⁸ oddiy amal (Java/C++), Python'da ~10⁷. Shu bilan n chegarasidan kerakli murakkablikni topasiz — toʻliq jadval Sprint 8 da.`, kind: 'tip' },
        `Java'da birinchi oʻlchovlar JIT «isinishi» sabab sekinroq chiqadi — natijalarni bir necha marta takrorlab oling.`
      ]
    }
  ],
  tasks: [
    { title: `Daraxt lab'ida fib(6) chaqiruvlarini sanang va takrorlanishlar grafigini tahlil qiling`, type: 'lab', pts: 2, lab: 'tree', link: '#/lab/tree?fn=fib&n=6' },
    { title: `fib ga hisoblagich qoʻshib, n = 10..30 uchun chaqiruvlar jadvalini tuzing`, type: 'kod', pts: 2 },
    { title: `Merge sort va Hanoi tenglamalarini ochish usuli bilan qogʻozda yeching`, type: 'kod', pts: 2 },
    { title: `Master teorema: 2T(n/2)+1, 3T(n/3)+n, 4T(n/2)+n², T(n/2)+n, 8T(n/2)+n² ni yeching`, type: 'kod', pts: 2 }
  ],
  problems: [
    { pl: 'lc', code: '104', slug: 'maximum-depth-of-binary-tree', name: `Maximum Depth of Binary Tree`, lv: 'easy', note: `Chuqurlik = 1 + max(chap, oʻng)` },
    { pl: 'lc', code: '110', slug: 'balanced-binary-tree', name: `Balanced Binary Tree`, lv: 'easy', note: `O(n log n) va O(n) yechimlarni solishtiring` },
    { pl: 'lc', code: '241', slug: 'different-ways-to-add-parentheses', name: `Different Ways to Add Parentheses`, lv: 'mid', note: `Har operatorda ikkiga boʻlish — daraxt shaklidagi rekursiya` },
    { pl: 'lc', code: '894', slug: 'all-possible-full-binary-trees', name: `All Possible Full Binary Trees`, lv: 'mid', note: `Chap va oʻng qism daraxtlar kombinatsiyasi` },
    { pl: 'lc', code: '395', slug: 'longest-substring-with-at-least-k-repeating-characters', name: `Longest Substring with At Least K Repeating Characters`, lv: 'mid', note: `Kam uchraydigan harf boʻyicha boʻlib, rekursiya` },
    { pl: 'cf', code: '768B', name: `Code For 1`, lv: 'mid', note: `Uzunlikni oldindan hisoblab, faqat kerakli oraliqqa tushing` }
  ],
  quiz: [
    { q: `<code>T(n) = 2T(n−1) + O(1)</code> tenglamaning yechimi?`, o: [`O(n)`, `O(n²)`, `O(2ⁿ)`, `O(n log n)`], a: 2, why: `Ochish usuli: 2ᵏ·T(n−k) + (2ᵏ−1) → O(2ⁿ).` },
    { q: `<code>T(n) = 2T(n/2) + O(n)</code> yechimi?`, o: [`O(n)`, `O(n log n)`, `O(n²)`, `O(log n)`], a: 1, why: `Master teorema, 2-holat: log₂2 = 1, f(n) = n.` },
    { q: `<code>T(n) = T(n/2) + O(1)</code> yechimi?`, o: [`O(1)`, `O(log n)`, `O(n)`, `O(√n)`], a: 1, why: `Har qadamda n ikki baravar kichrayadi — log₂ n qadam.` },
    { q: `Naive <code>fib(5)</code> jami nechta chaqiruv qiladi?`, o: [`5`, `9`, `15`, `25`], a: 2, why: `C(n) = 2·F(n+1) − 1 = 2·8 − 1 = 15.` },
    { q: `<code>T(n) = 4T(n/2) + n</code> yechimi?`, o: [`O(n log n)`, `O(n²)`, `O(n)`, `O(4ⁿ)`], a: 1, why: `log₂4 = 2 > 1, 1-holat: Θ(n²).` },
    { q: `Naive <code>fib(n)</code> ning stek xotirasi?`, o: [`O(1)`, `O(log n)`, `O(n)`, `O(φⁿ)`], a: 2, why: `Daraxt chuqurligi n, bir vaqtda faqat bitta yoʻl stekda.` },
    { q: `Master teorema qaysi tenglamaga <em>qoʻllanmaydi</em>?`, o: [`T(n) = 2T(n/2) + n`, `T(n) = T(n−1) + n`, `T(n) = 3T(n/3) + 1`, `T(n) = 8T(n/2) + n²`], a: 1, why: `n−1 — boʻlish emas, ayirish. Ochish usuli bilan: O(n²).` },
    { q: `Rekursiv algoritm vaqtini baholashning eng umumiy formulasi?`, o: [`Chuqurlik × frame hajmi`, `Tugunlar soni × har tugundagi ish`, `Base case'lar soni × n`, `Barglar soni × chuqurlik`], a: 1, why: `Har bir chaqiruv oʻz ishini bajaradi — hammasini yigʻamiz.` }
  ]
});
