RL.addSprint({
  n: 2,
  title: `Rekursiv fikrlash: massiv va satrlar`,
  weeks: `1 hafta`,
  goal: `Massiv va satr masalalarini «kichikroq qism» orqali yechish, helper funksiya va akkumulyator usullarini oʻzlashtirish, rekursiyani siklga aylantira olish.`,
  outcomes: [
    `Massiv bilan rekursiyada slicing oʻrniga indeks uzatasiz`,
    `Ikki koʻrsatkichli rekursiya (palindrom, reverse) yozasiz`,
    `Rekursiv binary search ning chuqurligini baholaysiz`,
    `Tail recursion ni sikl yoki explicit stack ga oʻtkazasiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Kamida 5 ta masala yechilgan, shundan 1 tasi Codeforces'dan`,
    `Sprint testidan 70%+`
  ],
  labs: ['stack'],
  lessons: [
    {
      t: `Massivni kichraytirish: indeks bilan`,
      b: [
        `Massiv bilan rekursiyada «kichikroq masala» odatda «qolgan qism» boʻladi: birinchi elementni ajratamiz, qolganini rekursiyaga beramiz. Yangi massiv yaratish (slicing) oʻrniga <strong>indeks</strong> uzatamiz.`,
        { code: { java: `
static int sum(int[] a, int i) {
    if (i == a.length) return 0;
    return a[i] + sum(a, i + 1);
}`, py: `
def total(a, i=0):
    if i == len(a):
        return 0
    return a[i] + total(a, i + 1)` }, cap: `sum(a, 0) — butun massiv yigʻindisi` },
        { note: `Python'da <code>a[0] + total(a[1:])</code> chiroyli koʻrinadi, lekin har <code>a[1:]</code> yangi roʻyxat yaratadi — O(n) nusxa. n ta chaqiruvda jami O(n²). Indeks uzatish esa O(n).`, kind: 'warn', title: `Slicing tuzogʻi` },
        { code: { java: `
static int max(int[] a, int i) {
    if (i == a.length - 1) return a[i];
    return Math.max(a[i], max(a, i + 1));
}

static int count(int[] a, int i, int x) {
    if (i == a.length) return 0;
    return (a[i] == x ? 1 : 0) + count(a, i + 1, x);
}`, py: `
def max_rec(a, i=0):
    if i == len(a) - 1:
        return a[i]
    return max(a[i], max_rec(a, i + 1))

def count(a, x, i=0):
    if i == len(a):
        return 0
    return (1 if a[i] == x else 0) + count(a, x, i + 1)` } },
        `Boshqa variant — massivni ikkiga boʻlish: <code>max(l, r) = max(max(l, m), max(m + 1, r))</code>. Chaqiruvlar soni oʻzgarmaydi (≈ 2n), lekin chuqurlik n emas, log n boʻladi. Bu divide & conquer gʻoyasining birinchi koʻrinishi (Sprint 4).`,
        { code: { java: `
static int maxDC(int[] a, int l, int r) {
    if (l == r) return a[l];
    int m = (l + r) / 2;
    return Math.max(maxDC(a, l, m), maxDC(a, m + 1, r));
}`, py: `
def max_dc(a, l, r):
    if l == r:
        return a[l]
    m = (l + r) // 2
    return max(max_dc(a, l, m), max_dc(a, m + 1, r))` } }
      ]
    },
    {
      t: `Satrlar bilan rekursiya`,
      b: [
        `Satrni teskari aylantirish: qolgan qismni teskari aylantirib, birinchi belgini oxiriga qoʻyamiz.`,
        { code: { java: `
static String reverse(String s) {
    if (s.length() <= 1) return s;
    return reverse(s.substring(1)) + s.charAt(0);
}`, py: `
def reverse(s):
    if len(s) <= 1:
        return s
    return reverse(s[1:]) + s[0]` } },
        `Oʻqish uchun qulay, lekin har chaqiruvda yangi satr yaratiladi — O(n²). Katta satrlar uchun ikki koʻrsatkichli usul yaxshiroq: chap va oʻng belgini almashtirib, ichki qismga oʻtamiz.`,
        { code: { java: `
static void rev(char[] s, int l, int r) {
    if (l >= r) return;
    char t = s[l];
    s[l] = s[r];
    s[r] = t;
    rev(s, l + 1, r - 1);
}`, py: `
def rev(s, l, r):
    if l >= r:
        return
    s[l], s[r] = s[r], s[l]
    rev(s, l + 1, r - 1)` }, cap: `LeetCode 344 aynan shu` },
        { h: `Palindrom` },
        `Ikki uchdan ichkariga qarab: chap va oʻng belgi teng boʻlsa, ichki qismni tekshiramiz.`,
        { code: { java: `
static boolean isPal(String s, int l, int r) {
    if (l >= r) return true;
    if (s.charAt(l) != s.charAt(r)) return false;
    return isPal(s, l + 1, r - 1);
}`, py: `
def is_pal(s, l, r):
    if l >= r:
        return True
    if s[l] != s[r]:
        return False
    return is_pal(s, l + 1, r - 1)` } },
        `Base case <code>l >= r</code>: boʻsh yoki bitta belgili oraliq doim palindrom. Ikkinchi qator — <strong>erta chiqish</strong>: nomuvofiqlik topilishi bilan qaytamiz, qolgan chaqiruvlar umuman boʻlmaydi. Bu gʻoya backtracking'dagi «pruning» ning eng oddiy shakli.`,
        { lab: 'stack', q: 'fn=rev&s=rekur', text: `reverse("rekur") chaqiruvlarini kuzating: satr qanday qisqarib, keyin yigʻilishini koʻring.` }
      ]
    },
    {
      t: `Ikkiga boʻlish: rekursiv binary search`,
      b: [
        `Saralangan massivda qidirish: oʻrtadagi element bilan solishtirib, qidiruv oraligʻini yarmiga qisqartiramiz. Har chaqiruv oraliqni ikki baravar kichraytiradi, shuning uchun chuqurlik ⌈log₂ n⌉ dan oshmaydi: n = 10⁹ boʻlsa ham ~30 ta frame.`,
        { code: { java: `
static int search(int[] a, int lo, int hi, int x) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == x) return mid;
    if (a[mid] < x) return search(a, mid + 1, hi, x);
    return search(a, lo, mid - 1, x);
}`, py: `
def search(a, lo, hi, x):
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if a[mid] == x:
        return mid
    if a[mid] < x:
        return search(a, mid + 1, hi, x)
    return search(a, lo, mid - 1, x)` } },
        { note: `<code>lo + (hi − lo) / 2</code> yozuvi <code>(lo + hi) / 2</code> dagi int toʻlib ketishining oldini oladi (lo va hi ~2·10⁹ ga yaqin boʻlganda). Python'da bu muammo yoʻq.`, kind: 'tip' },
        `Bu yerda base case ikkita: <code>lo > hi</code> (oraliq boʻsh — topilmadi) va <code>a[mid] == x</code> (topildi). Har bir rekursiv chaqiruv faqat bitta yarimga boradi — rekursiya daraxti emas, zanjir.`,
        { table: { head: [`Kichraytirish usuli`, `Chuqurlik`, `Chaqiruvlar`, `Misol`], rows: [
          [`n → n − 1`, `O(n)`, `O(n)`, `sum, fact, reverse`],
          [`n → n / 2 (bitta yarim)`, `O(log n)`, `O(log n)`, `binary search, binpow`],
          [`n → ikkita n / 2`, `O(log n)`, `O(n)`, `maxDC, merge sort`],
          [`n → n − 1 va n − 2`, `O(n)`, `O(1.618ⁿ)`, `naive Fibonachchi`]
        ] } }
      ]
    },
    {
      t: `Helper funksiyalar va akkumulyator`,
      b: [
        `Koʻpincha foydalanuvchiga qulay imzo (<code>sum(a)</code>) bilan rekursiyaga kerakli imzo (<code>sum(a, i)</code>) farq qiladi. Yechim — ochiq (public) funksiya va yopiq yordamchi (helper) rekursiv funksiya.`,
        { code: { java: `
public static int sum(int[] a) {
    return sum(a, 0);
}

private static int sum(int[] a, int i) {
    if (i == a.length) return 0;
    return a[i] + sum(a, i + 1);
}`, py: `
def total(a):
    def go(i):
        if i == len(a):
            return 0
        return a[i] + go(i + 1)
    return go(0)` }, cap: `Python'da helper ichki funksiya sifatida qulay` },
        { h: `Akkumulyator va tail recursion` },
        `Natijani qaytishda yigʻish oʻrniga, uni parametr orqali pastga uzatish mumkin. Bunda rekursiv chaqiruv funksiyaning <em>eng oxirgi</em> amali boʻladi — bu <span class="term">tail recursion</span>.`,
        { code: { java: `
static long factAcc(int n, long acc) {
    if (n == 0) return acc;
    return factAcc(n - 1, acc * n);
}

static int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}`, py: `
def fact_acc(n, acc=1):
    if n == 0:
        return acc
    return fact_acc(n - 1, acc * n)

def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)` }, cap: `factAcc(5, 1) = 120` },
        { trace: `gcd(48, 18) → gcd(18, 12) → gcd(12, 6) → gcd(6, 0) = 6` },
        `Oddiy <code>fact</code> da qaytishda koʻpaytirish qoladi (<code>n * fact(n−1)</code>), shuning uchun u tail emas. <code>factAcc</code> da esa natija pastga yetib boradi va yuqoriga oʻzgarmasdan qaytadi.`,
        { note: `Java ham, Python ham tail call'ni optimallashtirmaydi — tail recursion ham har chaqiruvda frame yaratadi. Ammo tail-rekursiv funksiyani siklga aylantirish juda oson (keyingi dars).`, kind: 'warn' },
        { lab: 'stack', q: 'fn=gcd&a=48&b=18', text: `gcd(48, 18) ni kuzating: qaytish bosqichida hech qanday hisob yoʻq — tail recursion belgisi.` }
      ]
    },
    {
      t: `Rekursiyadan iteratsiyaga`,
      b: [
        `<strong>Tail recursion → sikl.</strong> Parametrlar oʻzgaruvchiga aylanadi, rekursiv chaqiruv esa ularni yangilashga.`,
        { code: { java: `
static int gcd(int a, int b) {
    while (b != 0) {
        int t = a % b;
        a = b;
        b = t;
    }
    return a;
}`, py: `
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a` } },
        `<strong>Tail boʻlmagan rekursiya → explicit stack.</strong> Kompyuter call stack'da saqlayotgan maʼlumotni oʻzimiz <code>ArrayDeque</code> yoki <code>list</code> ga yozamiz.`,
        { code: { java: `
static void up(int n) {
    ArrayDeque<Integer> st = new ArrayDeque<>();
    while (n > 0) {
        st.push(n);
        n--;
    }
    while (!st.isEmpty()) System.out.print(st.pop() + " ");
}`, py: `
def up(n):
    st = []
    while n > 0:
        st.append(n)
        n -= 1
    while st:
        print(st.pop(), end=" ")` }, cap: `Sprint 1 dagi up(n) ning rekursiyasiz shakli` },
        `Birinchi sikl — «chuqurlashish», ikkinchisi — «qaytish». Daraxt va graflarda (DFS) aynan shu usul juda chuqur rekursiyadan qochish uchun ishlatiladi.`,
        { table: { head: [`Mezon`, `Rekursiya`, `Iteratsiya`], rows: [
          [`Kod`, `Qisqa, taʼrifga yaqin`, `Uzunroq`],
          [`Chuqurlik`, `Stek bilan cheklangan`, `Cheklov yoʻq (heap xotirasi)`],
          [`Tezlik`, `Chaqiruv xarajati bor`, `Odatda tezroq`],
          [`Qulay joyi`, `Daraxt, backtracking, D&C`, `Chiziqli jarayon, juda katta n`]
        ] } },
        { note: `Avval rekursiv yozing — toʻgʻriligini tekshirish oson. Chuqurlik yoki tezlik muammo boʻlsagina iteratsiyaga oʻting.`, kind: 'tip' }
      ]
    }
  ],
  tasks: [
    { title: `sum, max, count, reverse, isPal, binary search ni indeksli helper bilan yozing`, type: 'kod', pts: 3 },
    { title: `Python'da a[1:] va indeks usulini n = 900 da vaqt boʻyicha solishtiring`, type: 'kod', pts: 2 },
    { title: `fact va gcd ni akkumulyator, keyin sikl koʻrinishiga oʻtkazing`, type: 'kod', pts: 2 },
    { title: `Call stack lab'da gcd va reverse funksiyalarini kuzating`, type: 'lab', pts: 1, lab: 'stack', link: '#/lab/stack?fn=gcd&a=48&b=18' }
  ],
  problems: [
    { pl: 'lc', code: '344', slug: 'reverse-string', name: `Reverse String`, lv: 'easy', note: `Ikki koʻrsatkichli rekursiya` },
    { pl: 'lc', code: '704', slug: 'binary-search', name: `Binary Search`, lv: 'easy', note: `Rekursiv shaklda yozing` },
    { pl: 'lc', code: '206', slug: 'reverse-linked-list', name: `Reverse Linked List`, lv: 'easy', note: `Qaytishda head.next.next = head` },
    { pl: 'lc', code: '21', slug: 'merge-two-sorted-lists', name: `Merge Two Sorted Lists`, lv: 'easy', note: `Kichik boshni tanlab, qolganini rekursiyaga` },
    { pl: 'lc', code: '24', slug: 'swap-nodes-in-pairs', name: `Swap Nodes in Pairs`, lv: 'mid', note: `Ikki tugunni almashtirib, qolgani rekursiv` },
    { pl: 'lc', code: '779', slug: 'k-th-symbol-in-grammar', name: `K-th Symbol in Grammar`, lv: 'mid', note: `k ni oldingi qatordagi ota-pozitsiyaga keltiring` },
    { pl: 'cf', code: '9C', name: `Hexadecimal's Numbers`, lv: 'easy', note: `Faqat 0 va 1 raqamli sonlarni rekursiv generatsiya qiling` },
    { pl: 'cf', code: '96B', name: `Lucky Numbers (easy)`, lv: 'mid', note: `4 va 7 soni teng boʻlgan (super lucky) sonlarni rekursiv generatsiya qiling` }
  ],
  quiz: [
    { q: `Python'da <code>a[0] + total(a[1:])</code> usulida n elementli roʻyxat yigʻindisining vaqt murakkabligi qanday?`, o: [`O(n)`, `O(n log n)`, `O(n²)`, `O(2ⁿ)`], a: 2, why: `Har slicing O(n) nusxa yaratadi: n + (n−1) + … + 1 = O(n²).` },
    { q: `Rekursiv binary search ning maksimal chuqurligi?`, o: [`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`], a: 1, why: `Har chaqiruvda oraliq ikki baravar qisqaradi.` },
    { q: `<code>isPal(s, l, r)</code> uchun toʻgʻri base case qaysi?`, o: [`l == 0`, `l >= r`, `r == s.length()`, `s.charAt(l) == s.charAt(r)`], a: 1, why: `Oraliq boʻsh yoki bitta belgidan iborat boʻlsa — palindrom.` },
    { q: `Tail recursion nima?`, o: [`Rekursiv chaqiruv funksiyaning eng oxirgi amali boʻlishi`, `Funksiya faqat bir marta chaqirilishi`, `Base case funksiya oxirida turishi`, `Rekursiya chuqurligi O(1) boʻlishi`], a: 0, why: `Chaqiruvdan keyin hech qanday hisob qolmasa (masalan, koʻpaytirish), bu tail call.` },
    { q: `Java tail-rekursiv funksiyani avtomatik siklga aylantiradimi?`, o: [`Ha, har doim`, `Faqat static funksiyalarda`, `Yoʻq`, `Faqat -O flag bilan`], a: 2, why: `JVM tail call optimizatsiyasini qilmaydi — chuqur tail recursion ham StackOverflowError berishi mumkin.` },
    { q: `<code>gcd(48, 18)</code> bajarilganda jami nechta <code>gcd</code> chaqiruvi boʻladi (birinchisi bilan)?`, o: [`3`, `4`, `5`, `6`], a: 1, why: `gcd(48,18), gcd(18,12), gcd(12,6), gcd(6,0).` },
    { q: `Tail boʻlmagan rekursiyani siklga oʻtkazishda odatda nima ishlatiladi?`, o: [`Queue (navbat)`, `Explicit stack`, `HashMap`, `Saralash`], a: 1, why: `Call stack vazifasini oʻzimiz yaratgan stek bajaradi.` },
    { q: `<code>maxDC(a, l, r)</code> (ikkiga boʻlib maksimum) ning chuqurligi va chaqiruvlar soni?`, o: [`Chuqurlik O(log n), chaqiruvlar O(n)`, `Chuqurlik O(n), chaqiruvlar O(n)`, `Chuqurlik O(log n), chaqiruvlar O(log n)`, `Chuqurlik O(n), chaqiruvlar O(2ⁿ)`], a: 0, why: `Daraxt balandligi log n, barglar soni n — jami ~2n tugun.` }
  ]
});
