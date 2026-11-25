RL.addSprint({
  n: 8,
  title: `Pruning, optimallashtirish va contest`,
  weeks: `1 hafta`,
  goal: `Pruning turlarini tizimli qoʻllash, dublikatlarni toʻgʻri oʻtkazish, branch & bound, bitmask va meet-in-the-middle bilan backtracking'ni contest darajasiga olib chiqish.`,
  outcomes: [
    `Pruning turini masalaga qarab tanlaysiz: feasibility, bound, simmetriya, tartib`,
    `Subsets II / Permutations II dagi dublikat shartini toʻgʻri yozasiz`,
    `Bitmask N-Queens va meet-in-the-middle ni yozasiz`,
    `n chegarasidan kerakli murakkablikni aniqlaysiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Kamida 6 ta masala yechilgan, shundan 2 tasi Qiyin`,
    `Contest shabloni (Java yoki Python) tayyor`,
    `Sprint testidan 70%+, imtihonda 80%+`
  ],
  labs: ['space'],
  lessons: [
    {
      t: `Pruning turlari`,
      b: [
        `<span class="term">Pruning</span> (shox kesish) — yechimga olib bormasligi aniq boʻlgan shoxlarni ochmaslik. Toʻgʻri pruning javobni oʻzgartirmaydi, faqat ishni kamaytiradi.`,
        { table: { head: [`Tur`, `Gʻoya`, `Misol`], rows: [
          [`Feasibility`, `Qisman yechim cheklovni buzsa — toʻxtash`, `N-Queens diagonallari`],
          [`Bound`, `Eng yaxshi mumkin natija rekorddan yomon boʻlsa — toʻxtash`, `Branch & bound, minimal xarajat`],
          [`Resurs hisobi`, `Qolgan resurs yetmasa — toʻxtash`, `Kombinatsiyalar: qolgan sonlar < kerakli`],
          [`Saralash + break`, `Saralangan tanlovlarda bittasi oshsa, keyingilari ham oshadi`, `Combination Sum`],
          [`Dublikatlar`, `Bir darajada bir xil qiymatni ikki marta sinamaslik`, `Subsets II, Permutations II`],
          [`Simmetriya`, `Teng holatlardan faqat bittasini koʻrish`, `Graf boʻyash, boʻsh qutilar`],
          [`Tartib`, `Eng cheklangan tanlov birinchi`, `MRV, kattadan kichikka saralash`]
        ] } },
        `Yaxshi pruning eksponensial daraxtni bir necha tartibga kichraytiradi, lekin eng yomon holat murakkabligini odatda oʻzgartirmaydi. Shuning uchun avval cheklovlarni baholang (6-dars jadvali), keyin pruning bilan «zaxira» yarating.`,
        { lab: 'space', q: 'mode=comb&n=6&k=3', text: `Pruning oʻchiq va yoqiq holatdagi tugunlar sonini solishtiring.` }
      ]
    },
    {
      t: `Combination Sum va dublikatlar`,
      b: [
        `<strong>Combination Sum</strong>: har son cheksiz marta olinishi mumkin, yigʻindi target boʻlsin. Massiv saralangan boʻlsa, <code>a[i] > remain</code> boʻlganda keyingi barcha sonlar ham katta — <code>break</code>.`,
        { code: { java: `
static void comb(int[] a, int start, int remain, List<Integer> path, List<List<Integer>> res) {
    if (remain == 0) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i < a.length; i++) {
        if (a[i] > remain) break;
        path.add(a[i]);
        comb(a, i, remain - a[i], path, res);
        path.remove(path.size() - 1);
    }
}
// Arrays.sort(a); comb(a, 0, target, new ArrayList<>(), res);`, py: `
def combination_sum(a, target):
    a.sort()
    res, path = [], []
    def go(start, remain):
        if remain == 0:
            res.append(path[:])
            return
        for i in range(start, len(a)):
            if a[i] > remain:
                break
            path.append(a[i])
            go(i, remain - a[i])
            path.pop()
    go(0, target)
    return res` } },
        `<code>comb(a, i, …)</code> — <code>i + 1</code> emas: bir xil sonni qayta olish mumkin. Combination Sum II da har son bir marta → <code>i + 1</code>.`,
        { lab: 'space', q: 'mode=csum', text: `Combination Sum daraxtida break qaysi shoxlarni kesishini koʻring.` },
        { h: `Dublikatlarni oʻtkazib yuborish` },
        `Kirishda takroriy qiymatlar boʻlsa ([1, 2, 2]), oddiy subsets bir xil toʻplamlarni bir necha marta chiqaradi. Saralab, <em>bir daraja ichida</em> bir xil qiymatni faqat birinchi marta olamiz:`,
        { code: { java: `
static void subsetsDup(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < a.length; i++) {
        if (i > start && a[i] == a[i - 1]) continue;
        path.add(a[i]);
        subsetsDup(a, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`, py: `
def subsets_with_dup(a):
    a.sort()
    res, path = [], []
    def go(start):
        res.append(path[:])
        for i in range(start, len(a)):
            if i > start and a[i] == a[i - 1]:
                continue
            path.append(a[i])
            go(i + 1)
            path.pop()
    go(0)
    return res` } },
        `<code>i > start</code> sharti muhim: chuqurroq darajada [2, 2] ni olish mumkin (birinchi 2 bir darajada, ikkinchisi keyingisida). Faqat <em>bir darajada</em> ikkita «2» shoxini ochmaymiz.`,
        { code: { java: `
for (int i = 0; i < a.length; i++) {
    if (used[i]) continue;
    if (i > 0 && a[i] == a[i - 1] && !used[i - 1]) continue;
    used[i] = true;
    path.add(a[i]);
    permuteUnique(a, used, path, res);
    path.remove(path.size() - 1);
    used[i] = false;
}`, py: `
for i in range(len(a)):
    if used[i]:
        continue
    if i > 0 and a[i] == a[i - 1] and not used[i - 1]:
        continue
    used[i] = True
    path.append(a[i])
    go()
    path.pop()
    used[i] = False` }, cap: `Permutations II: teng elementlar faqat chapdan oʻngga tartibda ishlatiladi (a saralangan)` }
      ]
    },
    {
      t: `Branch & Bound`,
      b: [
        `Optimallashtirish masalalarida (minimal yoki maksimal qiymat) eng yaxshi topilgan natijani <code>best</code> da saqlaymiz. Joriy qisman yechim allaqachon <code>best</code> dan yaxshi boʻla olmasa — davom ettirish befoyda.`,
        `Misol — LeetCode 2305 (Fair Distribution of Cookies): pechenye paketlarini k bolaga taqsimlash, eng koʻp olgan bolaning yigʻindisini minimallashtirish.`,
        { code: { java: `
static int best = Integer.MAX_VALUE;

static void dist(int[] a, int i, int[] kids) {
    if (i == a.length) {
        int mx = 0;
        for (int x : kids) mx = Math.max(mx, x);
        best = Math.min(best, mx);
        return;
    }
    for (int j = 0; j < kids.length; j++) {
        if (kids[j] + a[i] >= best) continue;
        kids[j] += a[i];
        dist(a, i + 1, kids);
        kids[j] -= a[i];
        if (kids[j] == 0) break;
    }
}`, py: `
def distribute(a, k):
    a.sort(reverse=True)
    kids = [0] * k
    best = float("inf")

    def go(i):
        nonlocal best
        if i == len(a):
            best = min(best, max(kids))
            return
        for j in range(k):
            if kids[j] + a[i] >= best:
                continue
            kids[j] += a[i]
            go(i + 1)
            kids[j] -= a[i]
            if kids[j] == 0:
                break

    go(0)
    return best` } },
        { list: [
          `<code>kids[j] + a[i] >= best</code> — <strong>bound</strong>: bu bola allaqachon rekordga yetdi, bu shox yaxshiroq javob bermaydi.`,
          `<code>if (kids[j] == 0) break</code> — <strong>simmetriya</strong>: boʻsh bolalar bir-biridan farqsiz, bittasini sinash yetarli.`,
          `Paketlarni kamayish tartibida saralash — <strong>tartib</strong>: katta paketlar erta joylashadi, bound tezroq ishga tushadi.`
        ] },
        { note: `Xuddi shu uch usul LeetCode 698 (k ta teng yigʻindili toʻplam) va 473 (Matchsticks to Square) da ham ishlaydi. U yerda bound: qutining yigʻindisi target dan oshmasin.`, kind: 'tip' }
      ]
    },
    {
      t: `Bitmask bilan backtracking`,
      b: [
        `N-Queens ni bitlar bilan: ustunlar va diagonallar bandligini uchta butun sonda saqlaymiz. Boʻsh pozitsiyalar: <code>free = ~(cols | d1 | d2) & full</code>. Har qadamda eng past bitni olamiz: <code>bit = free & -free</code>.`,
        { code: { java: `
static int full, count;

static void solve(int cols, int d1, int d2) {
    if (cols == full) {
        count++;
        return;
    }
    int free = ~(cols | d1 | d2) & full;
    while (free != 0) {
        int bit = free & -free;
        free -= bit;
        solve(cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1);
    }
}
// full = (1 << n) - 1; solve(0, 0, 0);`, py: `
def total_n_queens(n):
    full = (1 << n) - 1
    count = 0

    def solve(cols, d1, d2):
        nonlocal count
        if cols == full:
            count += 1
            return
        free = ~(cols | d1 | d2) & full
        while free:
            bit = free & -free
            free -= bit
            solve(cols | bit, (d1 | bit) << 1 & full, (d2 | bit) >> 1)

    solve(0, 0, 0)
    return count` } },
        `Diagonal maskalar har qatorda bir pozitsiyaga siljiydi: biri chapga (<code><< 1</code>), biri oʻngga (<code>>> 1</code>). Massivli versiyadan bir necha baravar tez — n = 14..15 gacha soniyalarda.`,
        { h: `Qism toʻplamlar ustida maska` },
        { code: { java: `
for (int s = mask; s > 0; s = (s - 1) & mask) {
    // s — mask ning boʻsh boʻlmagan qism toʻplami
}`, py: `
s = mask
while s > 0:
    # s — mask ning bo'sh bo'lmagan qism to'plami
    s = (s - 1) & mask` }, cap: `Barcha submaskalarni aylanish` },
        { note: `Barcha maskalarning barcha submaskalari boʻyicha umumiy aylanish O(3ⁿ) — har element «maskada yoʻq», «maskada bor, submaskada yoʻq», «ikkalasida bor» holatlaridan birida.`, title: `Nima uchun 3ⁿ?` }
      ]
    },
    {
      t: `Meet in the middle`,
      b: [
        `n = 40 ta son: yigʻindisi x ga teng qism toʻplamlar nechta? 2⁴⁰ ≈ 10¹² — juda koʻp. Gʻoya: massivni ikki yarimga boʻlamiz, har yarmi uchun barcha 2²⁰ ≈ 10⁶ yigʻindini hisoblaymiz. Keyin chap yarimdagi har bir s uchun oʻng yarimda <code>x − s</code> nechta ekanini binary search bilan topamiz.`,
        { code: { java: `
static void gen(long[] a, int i, int end, long s, List<Long> out) {
    if (i == end) {
        out.add(s);
        return;
    }
    gen(a, i + 1, end, s, out);
    gen(a, i + 1, end, s + a[i], out);
}

static int lower(List<Long> v, long t) {
    int lo = 0, hi = v.size();
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        if (v.get(mid) < t) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

static long countSubsets(long[] a, long x) {
    int n = a.length, h = n / 2;
    List<Long> left = new ArrayList<>(), right = new ArrayList<>();
    gen(a, 0, h, 0, left);
    gen(a, h, n, 0, right);
    Collections.sort(right);
    long cnt = 0;
    for (long s : left) cnt += lower(right, x - s + 1) - lower(right, x - s);
    return cnt;
}`, py: `
from bisect import bisect_left, bisect_right

def sums(a):
    res = [0]
    for x in a:
        res += [s + x for s in res]
    return res

def count_subsets(a, x):
    h = len(a) // 2
    left, right = sums(a[:h]), sorted(sums(a[h:]))
    return sum(bisect_right(right, x - s) - bisect_left(right, x - s) for s in left)` } },
        `Murakkablik: O(2^(n/2) · n). n = 40 uchun ~2·10⁷ amal — 2⁴⁰ dan millionlab baravar kam.`,
        { note: `CSES 1628 da Java'da <code>List&lt;Long&gt;</code> sekin boʻlishi mumkin — <code>long[]</code> massiv va <code>Arrays.sort</code> ishlating. Python'da esa PyPy kerak boʻladi.`, kind: 'warn' }
      ]
    },
    {
      t: `Contest uchun maslahatlar`,
      b: [
        { h: `n chegarasidan murakkablikni topish` },
        { table: { head: [`n chegarasi`, `Kerakli murakkablik`, `Tipik usul`], rows: [
          [`n ≤ 10`, `O(n! · n)`, `Permutations brute force`],
          [`n ≤ 20`, `O(2ⁿ · n)`, `Subsets, bitmask backtracking`],
          [`n ≤ 40`, `O(2^(n/2) · n)`, `Meet in the middle`],
          [`n ≤ 500`, `O(n³)`, `DP`],
          [`n ≤ 5000`, `O(n²)`, `DP, ikki sikl`],
          [`n ≤ 10⁶`, `O(n log n) yoki O(n)`, `Saralash, D&C`],
          [`n ≤ 10¹⁸`, `O(log n)`, `Binpow, binary search`]
        ] } },
        { h: `Java: chuqur rekursiya` },
        { code: { java: `
import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Thread t = new Thread(null, () -> {
            try {
                solve();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }, "main", 1 << 26);
        t.start();
    }

    static void solve() throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(br.readLine());
        int n = Integer.parseInt(st.nextToken());
        StringBuilder out = new StringBuilder();
        // ...
        System.out.print(out);
    }
}` }, cap: `1 << 26 = 64 MB stek; chuqurligi 10⁵ va undan katta rekursiya uchun` },
        { h: `Python: chuqur rekursiya` },
        { code: { py: `
import sys
import threading

def main():
    data = sys.stdin.buffer.read().split()
    n = int(data[0])
    # ...

sys.setrecursionlimit(1 << 25)
threading.stack_size(1 << 27)
t = threading.Thread(target=main)
t.start()
t.join()` }, cap: `Chegara va thread stek hajmi birga oshiriladi` },
        { list: [
          `Chuqurlik 10⁵ dan oshsa — avval iterativ variantni (explicit stack) oʻylang.`,
          `Python'da rekursiya sekin: koʻp chaqiruvli backtracking uchun PyPy yoki iterativ yozuv.`,
          `Koʻp natija chiqarishda <code>StringBuilder</code> / <code>sys.stdout.write("\\n".join(...))</code> ishlating — har qatorni alohida print qilish sekin.`,
          `<strong>Stress test</strong>: kichik n uchun brute force yozib, asosiy yechim bilan tasodifiy testlarda solishtiring. Backtracking brute force uchun ideal.`
        ] }
      ]
    }
  ],
  tasks: [
    { title: `Holatlar daraxti lab'ida Combination Sum rejimini koʻring`, type: 'lab', pts: 1, lab: 'space', link: '#/lab/space?mode=csum' },
    { title: `Combination Sum I/II, Subsets II, Permutations II ni yozing`, type: 'kod', pts: 3 },
    { title: `N-Queens ni massiv va bitmask bilan yozib, n = 12 da vaqtini solishtiring`, type: 'kod', pts: 3 },
    { title: `Java yoki Python contest shablonini (chuqur rekursiya + tez I/O) tayyorlab saqlang`, type: 'kod', pts: 1 },
    { title: `Imtihon rejimida 20 savollik testdan 80%+ oling`, type: 'test', pts: 2, link: '#/exam' }
  ],
  problems: [
    { pl: 'lc', code: '39', slug: 'combination-sum', name: `Combination Sum`, lv: 'mid', note: `Saralash + break` },
    { pl: 'lc', code: '40', slug: 'combination-sum-ii', name: `Combination Sum II`, lv: 'mid', note: `i + 1 va dublikat sharti` },
    { pl: 'lc', code: '90', slug: 'subsets-ii', name: `Subsets II`, lv: 'mid', note: `i > start && a[i] == a[i−1]` },
    { pl: 'lc', code: '47', slug: 'permutations-ii', name: `Permutations II`, lv: 'mid', note: `!used[i−1] sharti` },
    { pl: 'lc', code: '698', slug: 'partition-to-k-equal-sum-subsets', name: `Partition to K Equal Sum Subsets`, lv: 'mid', note: `Saralash, bound, boʻsh qutilar simmetriyasi` },
    { pl: 'lc', code: '473', slug: 'matchsticks-to-square', name: `Matchsticks to Square`, lv: 'mid', note: `k = 4 boʻlgan k-partition` },
    { pl: 'lc', code: '2305', slug: 'fair-distribution-of-cookies', name: `Fair Distribution of Cookies`, lv: 'mid', note: `Branch & bound` },
    { pl: 'lc', code: '282', slug: 'expression-add-operators', name: `Expression Add Operators`, lv: 'hard', note: `Koʻpaytirishda oxirgi qoʻshiluvchini saqlang` },
    { pl: 'cses', code: '1625', name: `Grid Path Description`, lv: 'hard', note: `Kuchli pruning: devorga tegib, ikki tomon ochiq boʻlsa — toʻxtash` },
    { pl: 'cses', code: '1628', name: `Meet in the Middle`, lv: 'hard', note: `2·2²⁰ yigʻindi + binary search yoki ikki koʻrsatkich` }
  ],
  quiz: [
    { q: `n ≤ 20 boʻlsa, odatda qaysi murakkablik vaqtga sigʻadi?`, o: [`O(n!)`, `O(2ⁿ · n)`, `O(nⁿ)`, `O(3ⁿ · n²)`], a: 1, why: `2²⁰·20 ≈ 2·10⁷ — bemalol.` },
    { q: `Subsets II da dublikatlarni oʻtkazib yuborish sharti?`, o: [`a[i] == a[i − 1]`, `i > start && a[i] == a[i − 1]`, `i > 0 && a[i] == a[i + 1]`, `used[i − 1]`], a: 1, why: `Faqat bir daraja ichida takrorni oʻtkazamiz; i > start chuqurroq darajada takroriy qiymatni olishga ruxsat beradi.` },
    { q: `Bound pruning nima?`, o: [`Cheklov buzilganda toʻxtash`, `Joriy shox rekorddan yaxshiroq natija bera olmasa, toʻxtash`, `Dublikatlarni oʻtkazish`, `Simmetrik holatlarni oʻtkazish`], a: 1, why: `Optimallashtirish masalalarida best bilan solishtirish.` },
    { q: `Meet-in-the-middle n = 40 uchun taxminan nechta yigʻindi hisoblaydi?`, o: [`40`, `2·2²⁰ ≈ 2·10⁶`, `2⁴⁰ ≈ 10¹²`, `40² = 1600`], a: 1, why: `Har yarim uchun 2²⁰ ta yigʻindi.` },
    { q: `Bitmask'da <code>x & -x</code> nimani beradi?`, o: [`Eng yuqori 1-bitni`, `Eng past 1-bitni`, `Bitlar sonini`, `x ning teskarisini`], a: 1, why: `Ikkilik toʻldiruvchi kod xossasi: faqat eng oʻngdagi 1-bit qoladi.` },
    { q: `Java'da chuqur rekursiya uchun stek hajmini qanday oshirish mumkin?`, o: [`System.setStackSize()`, `new Thread(null, r, "main", 1 << 26)`, `-Xmx flag bilan kodda`, `Imkonsiz`], a: 1, why: `Thread konstruktorining 4-parametri — stek hajmi baytlarda.` },
    { q: `k-partition masalasida elementlarni kamayish tartibida saralash nima beradi?`, o: [`Javobni oʻzgartiradi`, `Katta elementlar erta joylashib, xatolar tezroq aniqlanadi`, `Faqat Python'da foydali`, `Dublikatlarni yoʻqotadi`], a: 1, why: `Eng cheklangan qadamlar birinchi — daraxt yuqori qismida kesiladi.` },
    { q: `Combination Sum (cheksiz takror) da rekursiv chaqiruv qaysi?`, o: [`comb(a, i + 1, …)`, `comb(a, i, …)`, `comb(a, 0, …)`, `comb(a, start + 1, …)`], a: 1, why: `i dan boshlash — shu sonni yana olish mumkin, lekin oldingilarga qaytmaymiz.` }
  ]
});
