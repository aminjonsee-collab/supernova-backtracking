RL.addSprint({
  n: 5,
  title: `Memoization`,
  weeks: `1 hafta`,
  goal: `Takrorlanuvchi qism masalalarni aniqlash va memoization bilan eksponensial rekursiyani polinomial vaqtga tushirish; top-down va bottom-up yondashuvlarni solishtirish.`,
  outcomes: [
    `Rekursiya daraxtida takrorlanishlarni koʻrasiz`,
    `Holat (state) ni toʻgʻri tanlab, memo jadvalini tuzasiz`,
    `Java'da massiv/HashMap, Python'da @lru_cache bilan memo yozasiz`,
    `Memo qachon yordam bermasligini bilasiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Daraxt laboratoriyasida memo bilan va memosiz farq koʻrilgan`,
    `Kamida 5 ta masala yechilgan`,
    `Sprint testidan 70%+`
  ],
  labs: ['tree'],
  lessons: [
    {
      t: `Takrorlanuvchi qism masalalar`,
      b: [
        `Sprint 3 da koʻrdik: naive <code>fib(30)</code> 2.7 mln chaqiruv qiladi, holbuki turli argumentlar bor-yoʻgʻi 31 ta (0..30). Qolgani — bir xil masalani qayta-qayta yechish. Bu xossa <span class="term">overlapping subproblems</span> (takrorlanuvchi qism masalalar) deyiladi.`,
        { table: { head: [`fib(6) ichida`, `fib(5)`, `fib(4)`, `fib(3)`, `fib(2)`, `fib(1)`, `fib(0)`], rows: [[`necha marta`, `1`, `2`, `3`, `5`, `8`, `5`]] } },
        `Jami 25 chaqiruv, foydali ish esa 7 ta. Yechim oddiy: har argument uchun javobni birinchi marta hisoblaganda saqlab qoʻyamiz, keyingi safar tayyorini qaytaramiz. Bu <span class="term">memoization</span> (eslab qolish).`,
        { lab: 'tree', q: 'fn=fib&n=7&memo=1', text: `Memo yoqilganda daraxt qanday «qirqilishini» koʻring: yashil uzuq chiziqli tugunlar — keshdan olingan javoblar.` },
        { note: `Memo ishlashi uchun ikki shart: 1) qism masalalar takrorlanadi; 2) funksiya natijasi <em>faqat</em> parametrlarga bogʻliq (tashqi oʻzgaruvchan holat yoʻq).`, kind: 'key' }
      ]
    },
    {
      t: `Memoization: top-down DP`,
      b: [
        { code: { java: `
static long[] memo;

static long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n - 1) + fib(n - 2);
}

public static void main(String[] args) {
    int n = 90;
    memo = new long[n + 1];
    Arrays.fill(memo, -1);
    System.out.println(fib(n));
}`, py: `
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(90))` } },
        `Endi har <code>fib(k)</code> faqat bir marta hisoblanadi: vaqt O(n), xotira O(n) (memo + stek). fib(90) bir lahzada. Python 3.9+ da <code>@cache</code> ham bor — <code>@lru_cache(maxsize=None)</code> bilan bir xil.`,
        { h: `Shablon` },
        { ol: [
          `Funksiya natijasi faqat parametrlarga bogʻliqligini tekshiring.`,
          `Parametrlar toʻplami — <strong>holat</strong> (state). Memo: holat → javob (massiv yoki HashMap).`,
          `Base case'dan keyin: memo'da bormi? — bor boʻlsa darhol qaytaring.`,
          `Hisoblang, saqlang, qaytaring.`
        ] },
        { code: { java: `
static HashMap<Long, Long> memo = new HashMap<>();

static long f(long n) {
    if (n <= 1) return n;
    Long c = memo.get(n);
    if (c != null) return c;
    long r = f(n / 2) + f(n / 3);
    memo.put(n, r);
    return r;
}`, py: `
memo = {}

def f(n):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = f(n // 2) + f(n // 3)
    return memo[n]` }, cap: `Holatlar siyrak va katta boʻlsa (n ≤ 10¹⁸) — HashMap/dict` },
        { note: `Java'da <code>-1</code> bilan toʻldirish sababi: 0 haqiqiy javob boʻlishi mumkin, demak «hali hisoblanmagan» uchun alohida belgi kerak. Javob manfiy ham boʻla olsa, <code>boolean[] done</code> massivini qoʻshing.`, kind: 'tip' }
      ]
    },
    {
      t: `Holatni toʻgʻri tanlash`,
      b: [
        `Panjarada (m × n) faqat oʻngga va pastga yurib, chap-yuqori burchakdan oʻng-pastga nechta yoʻl bor? (r, c) katakdan yoʻllar soni = pastdagi katakdan yoʻllar + oʻngdagi katakdan yoʻllar. Holat — (r, c), jami m·n holat.`,
        { code: { java: `
static long[][] memo;

static long paths(int r, int c, int m, int n) {
    if (r == m - 1 && c == n - 1) return 1;
    if (r >= m || c >= n) return 0;
    if (memo[r][c] != -1) return memo[r][c];
    return memo[r][c] = paths(r + 1, c, m, n) + paths(r, c + 1, m, n);
}`, py: `
from functools import lru_cache

def unique_paths(m, n):
    @lru_cache(maxsize=None)
    def paths(r, c):
        if r == m - 1 and c == n - 1:
            return 1
        if r >= m or c >= n:
            return 0
        return paths(r + 1, c) + paths(r, c + 1)
    return paths(0, 0)` } },
        `Murakkablik = (holatlar soni) × (bitta holatdagi ish) = O(m·n) × O(1) = O(m·n). Memosiz esa O(2^(m+n)).`,
        { lab: 'tree', q: 'fn=grid&n=3&memo=1', text: `paths(r, c) daraxtini 3×3 panjara uchun memo bilan va memosiz solishtiring.` },
        { h: `Holatga nima kiradi?` },
        { list: [
          `Javobga taʼsir qiladigan <em>hamma narsa</em>. Masalan, «qolgan tangalar soni» javobni oʻzgartirsa — u holatda.`,
          `Javobga taʼsir qilmaydigan narsa holatga kirmasin — aks holda holatlar soni keraksiz oʻsadi va memo foydasiz boʻladi.`,
          `Oʻzgarmas kirish (massiv, toʻsiqlar) holatga kirmaydi — u barcha chaqiruvlar uchun bir xil.`,
          `Funksiya oʻzgaruvchan global roʻyxatga (masalan, joriy yoʻl) bogʻliq boʻlsa — memo qoʻllab boʻlmaydi. Bu backtracking holati.`
        ] }
      ]
    },
    {
      t: `Top-down va bottom-up`,
      b: [
        `<strong>Top-down</strong>: rekursiya + memo; faqat kerakli holatlar hisoblanadi; yozish oson — rekursiv formulaning oʻzi. <strong>Bottom-up</strong>: jadvalni base case'lardan boshlab sikl bilan toʻldiramiz; stek yoʻq, odatda tezroq, xotirani tejash oson.`,
        { code: { java: `
static int climbTopDown(int n, int[] memo) {
    if (n <= 1) return 1;
    if (memo[n] != 0) return memo[n];
    return memo[n] = climbTopDown(n - 1, memo) + climbTopDown(n - 2, memo);
}

static int climbBottomUp(int n) {
    int a = 1, b = 1;
    for (int i = 2; i <= n; i++) {
        int c = a + b;
        a = b;
        b = c;
    }
    return b;
}`, py: `
from functools import lru_cache

@lru_cache(maxsize=None)
def climb_top_down(n):
    if n <= 1:
        return 1
    return climb_top_down(n - 1) + climb_top_down(n - 2)

def climb_bottom_up(n):
    a, b = 1, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b` }, cap: `Climbing Stairs: 1 yoki 2 pogʻonadan` },
        { table: { head: [`Mezon`, `Top-down`, `Bottom-up`], rows: [
          [`Yozish`, `Rekursiv formulaning oʻzi`, `Hisoblash tartibini oʻylash kerak`],
          [`Hisoblanadigan holatlar`, `Faqat kerakli`, `Hammasi`],
          [`Stek`, `Chuqurlik muammosi boʻlishi mumkin`, `Yoʻq`],
          [`Tezlik`, `Chaqiruv xarajati bor`, `Odatda tezroq`],
          [`Xotirani tejash`, `Qiyin`, `Oson (oxirgi qatorlar)`]
        ] } },
        { note: `Contest strategiyasi: avval top-down yozib, toʻgʻriligini tekshiring. Vaqt yoki chuqurlik yetmasa — bottom-up ga oʻtkazing. Rekursiv formula bir xil qoladi, faqat hisoblash tartibi oʻzgaradi.`, kind: 'tip' }
      ]
    },
    {
      t: `Memo qachon yordam bermaydi`,
      b: [
        { list: [
          `<strong>Qism masalalar takrorlanmaydi.</strong> Merge sort, binary search — har chaqiruv yangi oraliq. Memo faqat xotira sarflaydi.`,
          `<strong>Holatlar juda koʻp.</strong> Holat = «ishlatilgan elementlar toʻplami» boʻlsa, 2ⁿ holat. n = 20 da ~10⁶ — mumkin (bitmask DP), n = 40 da — yoʻq.`,
          `<strong>Natija tashqi oʻzgaruvchan holatga bogʻliq.</strong> Backtracking'da <code>path</code> har qadamda oʻzgaradi — bunday funksiyani memo qilish notoʻgʻri javob beradi.`,
          `<strong>Barcha yechimlarni chiqarish kerak.</strong> Javoblar sonining oʻzi eksponensial boʻlsa (barcha permutatsiyalar), memo yordam bermaydi — chiqish hajmining oʻzi katta. Faqat <em>sanash</em> tezlashadi.`
        ] },
        `Oxirgi ikki holat bizni keyingi sprintga olib boradi: barcha variantlarni tizimli koʻrib chiqish va keraksiz shoxlarni kesish — <strong>backtracking</strong>.`,
        { table: { head: [`Savol`, `Yondashuv`], rows: [
          [`«Nechta usul bor?» / «Eng kichik qiymat?»`, `Memo / DP — holatlar takrorlanadi`],
          [`«Barcha variantlarni chiqaring»`, `Backtracking`],
          [`«Bitta toʻgʻri variant toping» (Sudoku)`, `Backtracking + pruning`],
          [`Masala mustaqil qismlarga boʻlinadi`, `Divide & Conquer`]
        ] } }
      ]
    }
  ],
  tasks: [
    { title: `Daraxt lab'ida fib(7) ni memo bilan va memosiz solishtiring: chaqiruvlar qanchaga kamaydi?`, type: 'lab', pts: 2, lab: 'tree', link: '#/lab/tree?fn=fib&n=7&memo=1' },
    { title: `fib, climbing stairs, unique paths ni top-down va bottom-up shaklda yozing`, type: 'kod', pts: 3 },
    { title: `Python'da @lru_cache va qoʻlda dict memo ni fib(500) da sinang`, type: 'kod', pts: 1 }
  ],
  problems: [
    { pl: 'lc', code: '70', slug: 'climbing-stairs', name: `Climbing Stairs`, lv: 'easy', note: `Eng oddiy memo` },
    { pl: 'lc', code: '62', slug: 'unique-paths', name: `Unique Paths`, lv: 'mid', note: `Holat (r, c)` },
    { pl: 'lc', code: '63', slug: 'unique-paths-ii', name: `Unique Paths II`, lv: 'mid', note: `Toʻsiqli katak → 0` },
    { pl: 'lc', code: '198', slug: 'house-robber', name: `House Robber`, lv: 'mid', note: `olish yoki oʻtkazib yuborish: max(f(i+1), a[i] + f(i+2))` },
    { pl: 'lc', code: '322', slug: 'coin-change', name: `Coin Change`, lv: 'mid', note: `Holat — qolgan summa` },
    { pl: 'lc', code: '139', slug: 'word-break', name: `Word Break`, lv: 'mid', note: `Holat — satrdagi pozitsiya` },
    { pl: 'cses', code: '1633', name: `Dice Combinations`, lv: 'easy', note: `n ≤ 10⁶ — bottom-up ga oʻting` },
    { pl: 'cf', code: '431C', name: `k-Tree`, lv: 'mid', note: `Holat: (qolgan summa, d dan katta qirra boʻldimi)` }
  ],
  quiz: [
    { q: `Memoization qaysi xossa boʻlganda foyda beradi?`, o: [`Optimal tuzilma (optimal substructure)`, `Takrorlanuvchi qism masalalar`, `Massiv saralangan boʻlsa`, `Rekursiya chuqurligi kichik boʻlsa`], a: 1, why: `Bir xil holat koʻp marta hisoblansagina keshdan foyda bor.` },
    { q: `Memo bilan <code>fib(n)</code> ning vaqt murakkabligi?`, o: [`O(log n)`, `O(n)`, `O(n²)`, `O(φⁿ)`], a: 1, why: `n+1 ta holat, har biri O(1) ish.` },
    { q: `Python'da tayyor memo dekoratori qaysi?`, o: [`@staticmethod`, `@functools.lru_cache`, `@property`, `@dataclass`], a: 1, why: `functools.lru_cache(maxsize=None) yoki Python 3.9+ da functools.cache.` },
    { q: `m × n panjarada <code>paths(r, c)</code> uchun memo bilan vaqt?`, o: [`O(m + n)`, `O(m·n)`, `O(2^(m+n))`, `O(m·n·log(mn))`], a: 1, why: `m·n holat, har biri O(1).` },
    { q: `Merge sort ga memo qoʻshish foydalimi?`, o: [`Ha, ikki baravar tezlashadi`, `Yoʻq — qism masalalar takrorlanmaydi`, `Faqat Python'da`, `Ha, xotira kamayadi`], a: 1, why: `Har chaqiruv oʻziga xos oraliq bilan ishlaydi.` },
    { q: `Java'da memo massivini <code>-1</code> bilan toʻldirishdan maqsad?`, o: [`Tezlik uchun`, `«Hisoblanmagan» holatni haqiqiy javob 0 dan ajratish`, `Java talab qiladi`, `Overflow oldini olish`], a: 1, why: `0 — haqiqiy javob boʻlishi mumkin, shuning uchun alohida belgi kerak.` },
    { q: `Top-down va bottom-up ning asosiy farqi?`, o: [`Top-down tezroq`, `Top-down — rekursiya + kesh; bottom-up — jadvalni kichik holatlardan sikl bilan toʻldirish`, `Bottom-up rekursiv`, `Farqi yoʻq`], a: 1, why: `Formula bir xil, faqat hisoblash tartibi va mexanizmi farq qiladi.` }
  ]
});
