RL.ref.glossary = [
  { en: `Recursion`, uz: `Rekursiya`, s: 1, d: `Funksiyaning oʻz-oʻzini masalaning kichikroq nusxasi bilan chaqirishi.` },
  { en: `Base case`, uz: `Asosiy (toʻxtash) holat`, s: 1, d: `Rekursiyasiz, toʻgʻridan-toʻgʻri javob qaytariladigan eng oddiy kirish.` },
  { en: `Recursive case`, uz: `Rekursiv holat`, s: 1, d: `Masalani kichikroq qismga keltirib, funksiya oʻzini chaqiradigan qism.` },
  { en: `Call stack`, uz: `Chaqiruvlar steki`, s: 1, d: `Faol funksiya chaqiruvlari saqlanadigan LIFO tuzilma: oxirgi chaqirilgan birinchi tugaydi.` },
  { en: `Stack frame`, uz: `Stek ramkasi`, s: 1, d: `Bitta chaqiruvning parametrlari, lokal oʻzgaruvchilari va qaytish manzili.` },
  { en: `Stack overflow`, uz: `Stek toʻlishi`, s: 1, d: `Rekursiya chuqurligi stek hajmidan oshganda yuz beradigan xato (Java: StackOverflowError, Python: RecursionError).` },
  { en: `Winding / unwinding`, uz: `Chuqurlashish / qaytish`, s: 1, d: `Chaqiruvlarning base case tomon tushishi va javoblarning yuqoriga koʻtarilishi bosqichlari.` },
  { en: `Tail recursion`, uz: `Dum rekursiya`, s: 2, d: `Rekursiv chaqiruv funksiyaning oxirgi amali boʻlgan holat; siklga oson aylantiriladi.` },
  { en: `Accumulator`, uz: `Akkumulyator`, s: 2, d: `Oraliq natijani pastga uzatuvchi qoʻshimcha parametr.` },
  { en: `Helper function`, uz: `Yordamchi funksiya`, s: 2, d: `Rekursiya uchun qoʻshimcha parametrli ichki funksiya; tashqi imzo sodda qoladi.` },
  { en: `Explicit stack`, uz: `Aniq (qoʻlda boshqariladigan) stek`, s: 2, d: `Call stack oʻrniga ishlatiladigan oʻz stekimiz; chuqur rekursiyadan qochish uchun.` },
  { en: `Recursion tree`, uz: `Rekursiya daraxti`, s: 3, d: `Chaqiruvlarni tugun, ular orasidagi chaqiruvni qirra sifatida tasvirlash.` },
  { en: `Recurrence relation`, uz: `Rekurrent tenglama`, s: 3, d: `T(n) ni kichikroq argumentdagi T orqali ifodalovchi tenglama.` },
  { en: `Master theorem`, uz: `Master teorema`, s: 3, d: `T(n) = aT(n/b) + f(n) koʻrinishidagi tenglamalar uchun tayyor yechim.` },
  { en: `Divide and conquer`, uz: `Boʻl va hukmronlik qil`, s: 4, d: `Masalani mustaqil qismlarga boʻlib, rekursiv yechib, javoblarni birlashtirish.` },
  { en: `Merge`, uz: `Birlashtirish`, s: 4, d: `Ikki saralangan ketma-ketlikni bitta saralanganga O(n) da qoʻshish.` },
  { en: `Partition / pivot`, uz: `Ajratish / tayanch element`, s: 4, d: `Quick sort'da massivni tayanch elementdan kichik va katta qismlarga ajratish.` },
  { en: `Stable sort`, uz: `Barqaror saralash`, s: 4, d: `Teng elementlarning nisbiy tartibini saqlaydigan saralash.` },
  { en: `Binary exponentiation`, uz: `Tez darajaga koʻtarish`, s: 4, d: `aⁿ ni O(log n) koʻpaytirishda hisoblash: aⁿ = (a^(n/2))².` },
  { en: `Inversion`, uz: `Inversiya`, s: 4, d: `i < j va a[i] > a[j] boʻlgan juftlik.` },
  { en: `Overlapping subproblems`, uz: `Takrorlanuvchi qism masalalar`, s: 5, d: `Bir xil qism masala rekursiyada koʻp marta yechilishi.` },
  { en: `Memoization`, uz: `Eslab qolish`, s: 5, d: `Hisoblangan javoblarni holat boʻyicha saqlab, qayta hisoblamaslik.` },
  { en: `State`, uz: `Holat`, s: 5, d: `Qism masalani toʻliq aniqlaydigan parametrlar toʻplami.` },
  { en: `Top-down / bottom-up`, uz: `Yuqoridan pastga / pastdan yuqoriga`, s: 5, d: `Rekursiya + kesh yoki jadvalni kichik holatlardan sikl bilan toʻldirish.` },
  { en: `Backtracking`, uz: `Orqaga qaytish`, s: 6, d: `Yechimni qadam-baqadam qurib, berk holatda oxirgi tanlovni bekor qiladigan toʻliq qidiruv.` },
  { en: `State-space tree`, uz: `Holatlar daraxti`, s: 6, d: `Barcha qisman yechimlar va tanlovlarni ifodalovchi daraxt; backtracking uni DFS bilan aylanadi.` },
  { en: `Choose / explore / unchoose`, uz: `Tanlash / chuqurlashish / bekor qilish`, s: 6, d: `Backtracking'ning uch qadamli sikli.` },
  { en: `Subset`, uz: `Qism toʻplam`, s: 6, d: `Toʻplam elementlarining istalgan tanlovi; n elementda 2ⁿ ta.` },
  { en: `Permutation`, uz: `Oʻrin almashtirish`, s: 6, d: `Elementlarning tartiblangan joylashuvi; n elementda n! ta.` },
  { en: `Combination`, uz: `Kombinatsiya`, s: 6, d: `Tartibsiz k ta tanlov; soni C(n, k).` },
  { en: `Catalan numbers`, uz: `Katalan sonlari`, s: 6, d: `1, 1, 2, 5, 14, 42… — toʻgʻri qavslar, binar daraxtlar soni.` },
  { en: `Pruning`, uz: `Shox kesish`, s: 6, d: `Yechimga olib bormaydigan shoxlarni ochmaslik.` },
  { en: `Constraint satisfaction problem`, uz: `Cheklovlarni qanoatlantirish masalasi`, s: 7, d: `Oʻzgaruvchilarga cheklovlarni buzmaydigan qiymat berish masalasi (Sudoku, N-Queens).` },
  { en: `MRV heuristic`, uz: `Eng kam variant evristikasi`, s: 7, d: `Eng kam mumkin qiymatli oʻzgaruvchini birinchi tanlash.` },
  { en: `Branch and bound`, uz: `Shoxlash va chegaralash`, s: 8, d: `Optimallashtirishda rekorddan yaxshi boʻla olmaydigan shoxlarni kesish.` },
  { en: `Symmetry breaking`, uz: `Simmetriyani sindirish`, s: 8, d: `Bir-biriga teng holatlardan faqat bittasini koʻrish.` },
  { en: `Bitmask`, uz: `Bit maskasi`, s: 8, d: `Toʻplamni butun sonning bitlari orqali ifodalash.` },
  { en: `Meet in the middle`, uz: `Oʻrtada uchrashish`, s: 8, d: `Qidiruvni ikki yarimga boʻlib, 2ⁿ oʻrniga 2·2^(n/2) ish qilish.` },
  { en: `Stress test`, uz: `Stress test`, s: 8, d: `Asosiy yechimni brute force bilan tasodifiy kichik testlarda solishtirish.` },
  { en: `DFS`, uz: `Chuqurlik boʻyicha qidiruv`, s: 7, d: `Har shoxni oxirigacha oʻrganib, keyin qaytadigan aylanish tartibi.` }
];

RL.ref.cheats = [
  {
    id: 'rec', t: `Rekursiya shabloni`,
    p: `Base case birinchi. Har chaqiruv base case ga yaqinlashsin. Kichik javoblardan kattasini yigʻing.`,
    code: { java: `
static long f(int n) {
    if (n == 0) return 1;
    long sub = f(n - 1);
    return combine(n, sub);
}`, py: `
def f(n):
    if n == 0:
        return 1
    sub = f(n - 1)
    return combine(n, sub)` }
  },
  {
    id: 'bt', t: `Backtracking shabloni`,
    p: `Choose → explore → unchoose. Natijani nusxa sifatida saqlang.`,
    code: { java: `
static void backtrack(int start) {
    if (done()) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i < n; i++) {
        if (!valid(i)) continue;
        path.add(a[i]);
        backtrack(i + 1);
        path.remove(path.size() - 1);
    }
}`, py: `
def backtrack(start):
    if done():
        res.append(path[:])
        return
    for i in range(start, n):
        if not valid(i):
            continue
        path.append(a[i])
        backtrack(i + 1)
        path.pop()` }
  },
  {
    id: 'trio', t: `Subsets, permutations, combinations`,
    p: `Uchalasi bitta shablonning variantlari: farqi — sikl qayerdan boshlanadi va yechim qachon saqlanadi.`,
    table: { head: [`Masala`, `Sikl`, `Saqlash`, `Rekursiya`], rows: [
      [`Subsets`, `i = start..n−1`, `har tugunda`, `go(i + 1)`],
      [`Combinations C(n,k)`, `i = start..n−(k−size)`, `size == k`, `go(i + 1)`],
      [`Permutations`, `i = 0..n−1, used[i] emas`, `size == n`, `go()`],
      [`Combination Sum`, `i = start..n−1, a[i] ≤ remain`, `remain == 0`, `go(i)`],
      [`Subsets II / Comb. Sum II`, `+ i > start && a[i] == a[i−1] → skip`, `—`, `go(i + 1)`],
      [`Permutations II`, `+ a[i] == a[i−1] && !used[i−1] → skip`, `size == n`, `go()`]
    ] }
  },
  {
    id: 'queens', t: `N-Queens (massivlar)`,
    p: `cols[c], d1[r + c], d2[r − c + n − 1] — O(1) tekshiruv.`,
    code: { java: `
static void solve(int r) {
    if (r == n) { count++; return; }
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[r + c] || d2[r - c + n - 1]) continue;
        cols[c] = d1[r + c] = d2[r - c + n - 1] = true;
        solve(r + 1);
        cols[c] = d1[r + c] = d2[r - c + n - 1] = false;
    }
}`, py: `
def solve(r):
    nonlocal count
    if r == n:
        count += 1
        return
    for c in range(n):
        if cols[c] or d1[r + c] or d2[r - c + n - 1]:
            continue
        cols[c] = d1[r + c] = d2[r - c + n - 1] = True
        solve(r + 1)
        cols[c] = d1[r + c] = d2[r - c + n - 1] = False` }
  },
  {
    id: 'grid', t: `Grid backtracking`,
    p: `Chegaralar, devor va visited — bitta shartda. Barcha yoʻllar uchun visited ni qaytishda tiklang.`,
    code: { java: `
static int[] dr = {1, 0, -1, 0}, dc = {0, 1, 0, -1};

static void go(int r, int c) {
    if (r < 0 || c < 0 || r >= n || c >= m || g[r][c] == 1 || vis[r][c]) return;
    vis[r][c] = true;
    for (int k = 0; k < 4; k++) go(r + dr[k], c + dc[k]);
    vis[r][c] = false;
}`, py: `
def go(r, c):
    if r < 0 or c < 0 or r >= n or c >= m or g[r][c] == 1 or vis[r][c]:
        return
    vis[r][c] = True
    for dr, dc in ((1, 0), (0, 1), (-1, 0), (0, -1)):
        go(r + dr, c + dc)
    vis[r][c] = False` }
  },
  {
    id: 'memo', t: `Memoization`,
    p: `Holat → javob. Java'da −1 bilan toʻldirilgan massiv yoki HashMap, Python'da @lru_cache.`,
    code: { java: `
static long[] memo;

static long f(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = f(n - 1) + f(n - 2);
}`, py: `
from functools import lru_cache

@lru_cache(maxsize=None)
def f(n):
    if n <= 1:
        return n
    return f(n - 1) + f(n - 2)` }
  },
  {
    id: 'binpow', t: `Tez darajaga koʻtarish`,
    p: `half ni bir marta hisoblang. mod bilan ishlaganda Java'da long.`,
    code: { java: `
static long power(long a, long n, long mod) {
    if (n == 0) return 1 % mod;
    long half = power(a, n / 2, mod);
    long res = half * half % mod;
    return n % 2 == 1 ? res * (a % mod) % mod : res;
}`, py: `
pow(a, n, mod)` }
  },
  {
    id: 'deep', t: `Chuqur rekursiya`,
    p: `Java: katta stekli thread. Python: recursionlimit + threading.stack_size.`,
    code: { java: `
public static void main(String[] args) {
    new Thread(null, () -> solve(), "main", 1 << 26).start();
}`, py: `
import sys, threading
sys.setrecursionlimit(1 << 25)
threading.stack_size(1 << 27)
threading.Thread(target=main).start()` }
  },
  {
    id: 'cx', t: `Murakkabliklar`,
    table: { head: [`Algoritm`, `Vaqt`, `Stek`], rows: [
      [`fact, sum (n → n−1)`, `O(n)`, `O(n)`],
      [`Binary search, binpow`, `O(log n)`, `O(log n)`],
      [`Merge sort`, `O(n log n)`, `O(log n) + O(n)`],
      [`Quick sort`, `O(n log n) oʻrtacha, O(n²) eng yomon`, `O(log n) … O(n)`],
      [`Naive fib`, `O(1.618ⁿ)`, `O(n)`],
      [`Hanoi`, `O(2ⁿ)`, `O(n)`],
      [`Subsets`, `O(n · 2ⁿ)`, `O(n)`],
      [`Permutations`, `O(n · n!)`, `O(n)`],
      [`N-Queens`, `O(n!) dan ancha kam (pruning)`, `O(n)`],
      [`Meet in the middle`, `O(n · 2^(n/2))`, `O(2^(n/2))`]
    ] }
  },
  {
    id: 'limits', t: `n chegarasi → murakkablik`,
    table: { head: [`n`, `Murakkablik`, `Usul`], rows: [
      [`≤ 10`, `O(n! · n)`, `Permutations`],
      [`≤ 20`, `O(2ⁿ · n)`, `Subsets, bitmask`],
      [`≤ 40`, `O(2^(n/2) · n)`, `Meet in the middle`],
      [`≤ 500`, `O(n³)`, `DP`],
      [`≤ 5000`, `O(n²)`, `DP`],
      [`≤ 10⁶`, `O(n log n)`, `Saralash, D&C`],
      [`≤ 10¹⁸`, `O(log n)`, `Binpow, binary search`]
    ] }
  },
  {
    id: 'which', t: `Qaysi usul?`,
    table: { head: [`Masala soʻraydi`, `Usul`], rows: [
      [`Bitta qiymat, taʼrif rekursiv`, `Oddiy rekursiya`],
      [`Mustaqil yarimlarga boʻlinadi`, `Divide & conquer`],
      [`«Nechta usul?», «minimal/maksimal», holatlar takrorlanadi`, `Memo / DP`],
      [`«Barcha variantlarni chiqaring»`, `Backtracking`],
      [`«Bitta toʻgʻri joylashuv toping», cheklovlar koʻp`, `Backtracking + pruning + MRV`],
      [`Optimal taqsimot, n ≤ 15..20`, `Branch & bound yoki bitmask DP`],
      [`n ≈ 40, qism toʻplam yigʻindisi`, `Meet in the middle`]
    ] }
  }
];
