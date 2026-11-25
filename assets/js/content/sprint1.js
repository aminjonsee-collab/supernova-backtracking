RL.addSprint({
  n: 1,
  title: `Rekursiya asoslari`,
  weeks: `1 hafta`,
  goal: `Rekursiya nima ekanini tushunish, base case va recursive case ni ajrata olish, call stack orqali kodni qoʻlda kuzatish.`,
  outcomes: [
    `Har qanday rekursiv funksiyada base case va recursive case ni topasiz`,
    `Call stack qanday oʻsib-qisqarishini qogʻozda chiza olasiz`,
    `StackOverflowError va RecursionError sababini tushuntira olasiz`,
    `Oddiy rekursiv funksiyalarni Java va Python'da yozasiz`
  ],
  dod: [
    `Barcha 5 dars oʻqilgan`,
    `Call stack laboratoriyasida kamida 2 funksiya kuzatilgan`,
    `Kamida 4 ta masala yechilgan`,
    `Sprint testidan 70% dan yuqori ball`
  ],
  labs: ['stack'],
  lessons: [
    {
      t: `Rekursiya nima?`,
      b: [
        `<strong>Rekursiya</strong> — funksiya oʻz-oʻzini chaqirib, masalani <em>oʻsha masalaning kichikroq nusxasi</em> orqali yechishi. Matryoshkani eslang: har qoʻgʻirchoq ichida xuddi shunday, lekin kichikroq qoʻgʻirchoq bor, eng kichigi esa ochilmaydi. Ana shu eng kichik qoʻgʻirchoq — <span class="term">base case</span>.`,
        `Har qanday rekursiv yechim uchta savolga javob beradi:`,
        { ol: [
          `Eng oddiy holat qaysi va uning javobi nima? — <strong>base case</strong>`,
          `Katta masalani qanday qilib bir qadam kichikroq masalaga keltiraman? — <strong>recursive case</strong>`,
          `Kichik masalaning javobidan kattasining javobini qanday yigʻaman? — <strong>combine</strong>`
        ] },
        { h: `Ishonch sakrashi (leap of faith)` },
        `Rekursiv funksiya yozayotganda butun chaqiruvlar zanjirini boshda tasavvur qilishga urinmang. Buning oʻrniga shunday savol bering: «<code>f(n-1)</code> toʻgʻri ishlaydi deb faraz qilaman — shu javobdan <code>f(n)</code> ni qanday olaman?». Bu matematik induksiyaning aynan oʻzi: base case — induksiya asosi, recursive case — induksiya qadami.`,
        { code: { java: `
static void countdown(int n) {
    if (n == 0) {
        System.out.println("Start!");
        return;
    }
    System.out.println(n);
    countdown(n - 1);
}`, py: `
def countdown(n):
    if n == 0:
        print("Start!")
        return
    print(n)
    countdown(n - 1)` }, cap: `countdown(3) → 3, 2, 1, Start!` },
        `Har chaqiruvda <code>n</code> bittaga kamayadi, shuning uchun u 0 ga albatta yetib boradi. Bu <strong>progress</strong> sharti: har chaqiruv base case ga yaqinlashishi shart.`,
        { note: `1) Base case boʻlsin. 2) Har chaqiruv base case ga yaqinlashsin. 3) Kichik javoblardan kattasini toʻgʻri yigʻing.`, kind: 'key', title: `Rekursiyaning uch qoidasi` },
        { h: `Rekursiya qachon qulay?` },
        { list: [
          `Tuzilma tabiatan ichma-ich boʻlsa: daraxtlar, papkalar, JSON, ifodalar.`,
          `«Barcha variantlarni sanash» kerak boʻlsa — backtracking (Sprint 6–8).`,
          `Masalani teng qismlarga boʻlish mumkin boʻlsa — divide & conquer (Sprint 4).`,
          `Matematik taʼrifning oʻzi rekursiv boʻlsa: faktorial, Fibonachchi, EKUB.`
        ] },
        `Oddiy chiziqli jarayon (1 dan n gacha yigʻish) yoki juda katta chuqurlik (10⁶ qadam) boʻlsa, sikl odatda yaxshiroq.`
      ]
    },
    {
      t: `Base case va recursive case`,
      b: [
        `Faktorial taʼrifi: <code>0! = 1</code>, <code>n! = n · (n−1)!</code>. Taʼrifning oʻzi rekursiv — kodga deyarli soʻzma-soʻz koʻchadi.`,
        { code: { java: `
static long fact(int n) {
    if (n == 0) return 1;
    return n * fact(n - 1);
}`, py: `
def fact(n):
    if n == 0:
        return 1
    return n * fact(n - 1)` }, cap: `1-qator: base case, 2-qator: recursive case` },
        { note: `<code>long</code> ishlating: 20! ≈ 2.4·10¹⁸ hali <code>long</code> ga sigʻadi, 21! esa sigʻmaydi. Python'da butun sonlar chegarasiz.`, kind: 'tip' },
        { h: `Bir nechta base case` },
        `Fibonachchi: <code>F(0) = 0</code>, <code>F(1) = 1</code>, <code>F(n) = F(n−1) + F(n−2)</code>. Bu yerda ikki chaqiruv bor va ikkalasi ham base case ga yetishi kerak. <code>fib(1)</code> dan <code>fib(-1)</code> chaqirilmasligi uchun ikkita base case kerak — yoki ixcham shakli <code>n <= 1 → return n</code>.`,
        { code: { java: `
static int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}`, py: `
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)` } },
        `Yana ikki klassik misol — 1 dan n gacha yigʻindi va darajaga koʻtarish:`,
        { code: { java: `
static int sumTo(int n) {
    if (n == 0) return 0;
    return n + sumTo(n - 1);
}

static long power(long a, int n) {
    if (n == 0) return 1;
    return a * power(a, n - 1);
}`, py: `
def sum_to(n):
    if n == 0:
        return 0
    return n + sum_to(n - 1)

def power(a, n):
    if n == 0:
        return 1
    return a * power(a, n - 1)` } },
        { h: `Tipik xatolar` },
        { table: { head: [`Xato`, `Natija`, `Tuzatish`], rows: [
          [`Base case yoʻq`, `Cheksiz chaqiruv → stek toʻladi`, `Eng kichik kirish uchun javobni alohida qaytaring`],
          [`Argument kichraymaydi: <code>fact(n)</code> ichida <code>fact(n)</code>`, `Cheksiz chaqiruv`, `Har chaqiruvda argument base case ga yaqinlashsin`],
          [`Base case <code>n == 1</code>, lekin <code>fact(0)</code> chaqirildi`, `0 → −1 → −2 … cheksiz`, `<code>n <= 1</code> yoki <code>n == 0</code>`],
          [`Manfiy kirish`, `Base case ga yetmaydi`, `Kirishni tekshiring yoki <code>n <= 0</code> ni base qiling`],
          [`<code>return</code> unutilgan`, `Java: kompilyatsiya xatosi, Python: <code>None</code>`, `Rekursiv natijani qaytaring`]
        ] } }
      ]
    },
    {
      t: `Call stack: kompyuter ichida nima boʻladi`,
      b: [
        `Har bir funksiya chaqiruvi xotirada <span class="term">stack frame</span> (stek ramkasi) yaratadi. Unda parametrlar, lokal oʻzgaruvchilar va «ish tugagach qayerga qaytish kerak» degan manzil (return address) saqlanadi.`,
        `Frame'lar stek tuzilmasida turadi: yangi chaqiruv tepaga qoʻshiladi (<strong>push</strong>), funksiya <code>return</code> qilganda tepadagi frame olib tashlanadi (<strong>pop</strong>). Doim faqat eng tepadagi frame ishlaydi, qolganlari kutib turadi.`,
        { trace: `
fact(4) chaqirildi                stek: main, fact(4)
  fact(3) chaqirildi              stek: main, fact(4), fact(3)
    fact(2) chaqirildi            stek: ..., fact(3), fact(2)
      fact(1) chaqirildi
        fact(0) → 1               ← base case, eng chuqur nuqta
      fact(1) = 1 × 1 = 1
    fact(2) = 2 × 1 = 2
  fact(3) = 3 × 2 = 6
fact(4) = 4 × 6 = 24` },
        `Ikki bosqich bor. <strong>Chuqurlashish</strong> (winding) — chaqiruvlar base case ga qarab tushib boradi, koʻpaytirish hali bajarilmagan, har frame «javobni kutyapti». <strong>Qaytish</strong> (unwinding) — base case javobi yuqoriga koʻtariladi va har bosqichda koʻpaytiriladi.`,
        { note: `Bir vaqtda stekda turgan frame'lar soni = rekursiya chuqurligi. <code>fact(n)</code> uchun chuqurlik n + 1, demak xotira O(n). Vaqt esa chaqiruvlarning <em>umumiy</em> soniga bogʻliq — bu ikkisini adashtirmang (Sprint 3).`, title: `Xotira va chuqurlik` },
        { lab: 'stack', q: 'fn=fact&n=5', text: `fact(5) ni qadam-baqadam ishga tushiring: har frame qachon paydo boʻlib, qachon yoʻqolishini kuzating.` },
        { h: `Stek qancha chuqur boʻla oladi?` },
        { list: [
          `<strong>Java</strong>: har thread uchun stek hajmi odatda 512 KB – 1 MB. Oddiy funksiya uchun bu taxminan 10⁴ chaqiruv chuqurligi demak.`,
          `<strong>Python</strong>: <code>sys.getrecursionlimit()</code> standart qiymati 1000. Undan chuqurroq rekursiya <code>RecursionError</code> beradi.`,
          `Shuning uchun n = 10⁵ boʻlgan masalada chiziqli rekursiya xavfli. Yechimlari — 5-darsda va Sprint 8 da.`
        ] }
      ]
    },
    {
      t: `Rekursiyani qoʻlda kuzatish (tracing)`,
      b: [
        `Rekursiyani tushunishning eng ishonchli yoʻli — qogʻozda trace qilish. Usul oddiy: har chaqiruv uchun alohida qator yozing, chekinish bilan chuqurlikni koʻrsating, qaytgan qiymatni oʻng tomonga yozing.`,
        { h: `Print qayerda turgani muhim` },
        { code: { java: `
static void down(int n) {
    if (n == 0) return;
    System.out.print(n + " ");
    down(n - 1);
}

static void up(int n) {
    if (n == 0) return;
    up(n - 1);
    System.out.print(n + " ");
}`, py: `
def down(n):
    if n == 0:
        return
    print(n, end=" ")
    down(n - 1)

def up(n):
    if n == 0:
        return
    up(n - 1)
    print(n, end=" ")` } },
        `<code>down(3)</code> → <code>3 2 1</code>: chop etish chaqiruvdan <em>oldin</em>, ya'ni chuqurlashish paytida bajariladi. <code>up(3)</code> → <code>1 2 3</code>: chop etish chaqiruvdan <em>keyin</em>, qaytish paytida. Bu oddiy farq keyinchalik daraxtlarda preorder/postorder ga, backtracking'da esa «tanlash va bekor qilish» tartibiga aylanadi.`,
        { h: `Mashq: raqamlar yigʻindisi` },
        { code: { java: `
static int sumDigits(int n) {
    if (n < 10) return n;
    return n % 10 + sumDigits(n / 10);
}`, py: `
def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)` } },
        { trace: `
sumDigits(1234) = 4 + sumDigits(123)
                      = 3 + sumDigits(12)
                            = 2 + sumDigits(1)
                                  = 1            ← base case
                            = 2 + 1 = 3
                      = 3 + 3 = 6
                = 4 + 6 = 10` },
        { note: `Debug uchun funksiyaga <code>depth</code> parametrini qoʻshing va chop etishda chekinish bering — trace oʻzi chiziladi.`, kind: 'tip' },
        { code: { java: `
static long fact(int n, int depth) {
    System.out.println("  ".repeat(depth) + "fact(" + n + ")");
    long r = (n == 0) ? 1 : n * fact(n - 1, depth + 1);
    System.out.println("  ".repeat(depth) + "= " + r);
    return r;
}`, py: `
def fact(n, depth=0):
    print("  " * depth + f"fact({n})")
    r = 1 if n == 0 else n * fact(n - 1, depth + 1)
    print("  " * depth + f"= {r}")
    return r` }, cap: `Avtomatik trace` }
      ]
    },
    {
      t: `StackOverflowError va RecursionError`,
      b: [
        `Rekursiya base case ga yetmasa yoki juda chuqur boʻlsa, stek toʻlib qoladi. Java'da bu <code>java.lang.StackOverflowError</code>, Python'da <code>RecursionError: maximum recursion depth exceeded</code>.`,
        { list: [
          `Base case yoʻq yoki unga hech qachon yetib boʻlmaydi.`,
          `Argument kamaymaydi (yoki notoʻgʻri tomonga oʻzgaradi).`,
          `Kirish juda katta: masalan, n = 10⁶ boʻlganda chiziqli rekursiya.`
        ] },
        { lab: 'stack', q: 'fn=broken&n=4', text: `Base case olib tashlangan faktorialni ishga tushiring va stek qanday toʻlishini koʻring.` },
        { h: `Diagnostika tartibi` },
        { ol: [
          `Base case funksiyaning eng boshidami?`,
          `Har bir yoʻlda argument base case tomon kichrayadimi?`,
          `Eng kichik kirishlar bilan (0, 1, boʻsh satr, boʻsh massiv) qoʻlda sinab koʻring.`,
          `Chuqurlik n ga teng boʻlsa, n ning maksimal qiymatini tekshiring.`
        ] },
        `Chuqurlik muammosining uch yechimi bor: rekursiyani siklga aylantirish (Sprint 2), stek hajmini oshirish (Sprint 8 dagi contest shabloni) yoki chuqurlikni log n ga tushiradigan algoritm tanlash (binary search, divide & conquer).`,
        { code: { py: `
import sys
sys.setrecursionlimit(10**6)` }, cap: `Faqat chegarani oshiradi; haqiqiy stek yetmasa, dastur baribir yiqiladi` },
        { note: `Python'da <code>setrecursionlimit</code> ni haddan tashqari oshirish «Segmentation fault» bilan jim yiqilishga olib kelishi mumkin. Toʻgʻri usul — chegarani oshirish bilan birga thread stek hajmini ham kattalashtirish (Sprint 8).`, kind: 'warn' }
      ]
    }
  ],
  tasks: [
    { title: `Call stack laboratoriyasida fact(5) va fib(4) ni qadam-baqadam kuzating`, type: 'lab', pts: 2, lab: 'stack', link: '#/lab/stack' },
    { title: `countdown, fact, sumTo, power, sumDigits funksiyalarini oʻzingiz yozing`, type: 'kod', pts: 3 },
    { title: `down(4) va up(4) natijasini kod ishlatmasdan qogʻozda toping, keyin tekshiring`, type: 'kod', pts: 1 },
    { title: `Base case siz funksiyani ishga tushirib, xato xabarini oʻqing va izohlang`, type: 'kod', pts: 1 }
  ],
  problems: [
    { pl: 'lc', code: '509', slug: 'fibonacci-number', name: `Fibonacci Number`, lv: 'easy', note: `Toʻgʻridan-toʻgʻri rekursiya; n ≤ 30` },
    { pl: 'lc', code: '231', slug: 'power-of-two', name: `Power of Two`, lv: 'easy', note: `Juft boʻlsa n/2 ga rekursiya` },
    { pl: 'lc', code: '326', slug: 'power-of-three', name: `Power of Three`, lv: 'easy', note: `3 ga boʻlinsa n/3 ga rekursiya` },
    { pl: 'lc', code: '1137', slug: 'n-th-tribonacci-number', name: `N-th Tribonacci Number`, lv: 'easy', note: `Naive rekursiya nima uchun sekin? (javob Sprint 3–5 da)` },
    { pl: 'cses', code: '1068', name: `Weird Algorithm`, lv: 'easy', note: `Collatz ketma-ketligini rekursiv chop eting` }
  ],
  quiz: [
    { q: `Rekursiv funksiyada base case nima uchun kerak?`, o: [`Rekursiyani toʻxtatish uchun`, `Funksiyani tezlashtirish uchun`, `Xotirani tozalash uchun`, `Parametrlarni tekshirish uchun`], a: 0, why: `Base case boʻlmasa, chaqiruvlar cheksiz davom etadi va stek toʻladi.` },
    { q: `<code>fact(0) = 1</code> base case boʻlsa, <code>fact(4)</code> bajarilayotganda stekda bir vaqtda eng koʻpi bilan nechta <code>fact</code> frame boʻladi?`, o: [`4`, `5`, `3`, `24`], a: 1, why: `fact(4), fact(3), fact(2), fact(1), fact(0) — jami 5 ta frame, eng chuqur nuqtada hammasi stekda.` },
    { q: `<code>f(3)</code> nimani chop etadi?`, code: `
static void f(int n) {
    if (n == 0) return;
    f(n - 1);
    System.out.print(n + " ");
}`, o: [`3 2 1`, `1 2 3`, `3 2 1 0`, `0 1 2 3`], a: 1, why: `Chop etish rekursiv chaqiruvdan keyin, ya'ni qaytish bosqichida bajariladi: avval eng chuqur f(1), keyin f(2), f(3).` },
    { q: `Python'da standart rekursiya chegarasi taxminan qancha?`, o: [`100`, `1000`, `10 000`, `Chegara yoʻq`], a: 1, why: `sys.getrecursionlimit() standart holatda 1000 qaytaradi.` },
    { q: `Rekursiv funksiyaning stek xotirasi asosan nimaga bogʻliq?`, o: [`Chaqiruvlarning umumiy soniga`, `Maksimal rekursiya chuqurligiga`, `Kod qatorlari soniga`, `Base case'lar soniga`], a: 1, why: `Bir vaqtda faqat joriy yoʻldagi frame'lar stekda turadi, shuning uchun xotira chuqurlikka proporsional.` },
    { q: `<code>sum(n) = n + sum(n − 1)</code>, <code>sum(0) = 0</code>. <code>sum(5)</code> nechaga teng?`, o: [`10`, `15`, `5`, `120`], a: 1, why: `5 + 4 + 3 + 2 + 1 + 0 = 15.` },
    { q: `Quyidagi funksiya <code>g(4)</code> uchun nima qaytaradi?`, code: `
static int g(int n) {
    if (n <= 1) return 1;
    return g(n - 1) + g(n - 1);
}`, o: [`4`, `8`, `16`, `7`], a: 1, why: `g(1)=1, g(2)=2, g(3)=4, g(4)=8 — har qadamda ikki baravar.` },
    { q: `<code>fact(-1)</code> chaqirilsa (base case <code>n == 0</code>) nima boʻladi?`, o: [`1 qaytaradi`, `0 qaytaradi`, `Stek toʻlib, xato beradi`, `Kompilyatsiya xatosi`], a: 2, why: `−1, −2, −3 … hech qachon 0 ga teng boʻlmaydi — cheksiz rekursiya.` }
  ]
});
