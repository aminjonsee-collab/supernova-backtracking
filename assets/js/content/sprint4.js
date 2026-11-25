RL.addSprint({
  n: 4,
  title: `Divide & Conquer`,
  weeks: `1 hafta`,
  goal: `«Boʻl, yech, birlashtir» sxemasini oʻzlashtirish: merge sort, quick sort, tez darajaga koʻtarish, Hanoi minoralari va inversiyalarni sanash.`,
  outcomes: [
    `Masalada divide, conquer va combine bosqichlarini ajratasiz`,
    `Merge sort va quick sort ni xotiradan yozasiz, farqini tushuntirasiz`,
    `Binpow bilan aⁿ mod m ni O(log n) da hisoblaysiz`,
    `Hanoi yechimini isbotlaysiz: 2ⁿ − 1 yurish`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Hanoi laboratoriyasida n = 4 qoʻlda 15 yurishda yechilgan`,
    `Kamida 5 ta masala yechilgan`,
    `Sprint testidan 70%+`
  ],
  labs: ['hanoi'],
  lessons: [
    {
      t: `Divide & Conquer gʻoyasi`,
      b: [
        `Uch bosqich: <strong>Divide</strong> — masalani bir nechta mustaqil, kichikroq qismga boʻlish; <strong>Conquer</strong> — har qismni rekursiv yechish; <strong>Combine</strong> — qismlar javobidan umumiy javobni yigʻish.`,
        `Oddiy rekursiyadan farqi: qism masalalar odatda <em>ustma-ust tushmaydi</em> (fib dan farqli) va hajmi keskin — yarmiga — kichrayadi. Natijada O(n²) → O(n log n), O(n) → O(log n) kabi yutuqlar.`,
        { table: { head: [`Algoritm`, `Divide`, `Combine`, `Murakkablik`], rows: [
          [`Binary search`, `oʻrtaga qarab bitta yarim`, `yoʻq`, `O(log n)`],
          [`Merge sort`, `ikki teng yarim`, `merge, O(n)`, `O(n log n)`],
          [`Quick sort`, `pivot atrofida partition, O(n)`, `yoʻq`, `oʻrtacha O(n log n)`],
          [`Binpow`, `aⁿ = (a^(n/2))²`, `bitta koʻpaytirish`, `O(log n)`],
          [`Hanoi`, `n−1, 1, n−1`, `yoʻq`, `O(2ⁿ)`],
          [`Inversiyalar`, `ikki yarim`, `merge paytida sanash`, `O(n log n)`]
        ] } },
        { note: `D&C ni koʻrganda soʻrang: 1) qismlar mustaqilmi? 2) combine qancha turadi? Combine O(n) va ikki teng qism boʻlsa — deyarli har doim O(n log n).`, kind: 'key' }
      ]
    },
    {
      t: `Merge sort`,
      b: [
        `Massivni ikkiga boʻlib, har yarmini rekursiv saralaymiz, keyin ikki saralangan qismni bitta saralangan massivga birlashtiramiz (merge). Merge ikki koʻrsatkich bilan O(n) da ishlaydi.`,
        { code: { java: `
static void mergeSort(int[] a, int lo, int hi, int[] tmp) {
    if (hi - lo <= 1) return;
    int mid = (lo + hi) / 2;
    mergeSort(a, lo, mid, tmp);
    mergeSort(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    for (k = lo; k < hi; k++) a[k] = tmp[k];
}
// mergeSort(a, 0, a.length, new int[a.length]);`, py: `
def merge_sort(a):
    if len(a) <= 1:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    res, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res` } },
        `Java versiyasida yarim-ochiq oraliq <code>[lo, hi)</code> ishlatilgan: base case <code>hi − lo ≤ 1</code> (0 yoki 1 element). <code>tmp</code> massivi bir marta yaratiladi — har chaqiruvda yangi massiv ochish sekin.`,
        { list: [
          `Vaqt: T(n) = 2T(n/2) + O(n) = <strong>O(n log n)</strong> — har qanday kirishda (eng yomon holat ham).`,
          `Xotira: O(n) qoʻshimcha massiv + O(log n) stek.`,
          `<code><=</code> belgisi tufayli <span class="term">stable</span>: teng elementlarning nisbiy tartibi saqlanadi.`
        ] }
      ]
    },
    {
      t: `Quick sort`,
      b: [
        `Pivot tanlaymiz va massivni «pivotdan kichik» va «katta yoki teng» qismlarga ajratamiz (partition). Keyin har qismni rekursiv saralaymiz. Combine bosqichi kerak emas — partitiondan keyin pivot oʻz joyida turadi.`,
        { code: { java: `
static Random rnd = new Random();

static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int r = lo + rnd.nextInt(hi - lo + 1);
    int t = a[r]; a[r] = a[hi]; a[hi] = t;
    int p = a[hi], i = lo;
    for (int j = lo; j < hi; j++) {
        if (a[j] < p) {
            t = a[i]; a[i] = a[j]; a[j] = t;
            i++;
        }
    }
    t = a[i]; a[i] = a[hi]; a[hi] = t;
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`, py: `
import random

def quick_sort(a, lo, hi):
    if lo >= hi:
        return
    r = random.randint(lo, hi)
    a[r], a[hi] = a[hi], a[r]
    p, i = a[hi], lo
    for j in range(lo, hi):
        if a[j] < p:
            a[i], a[j] = a[j], a[i]
            i += 1
    a[i], a[hi] = a[hi], a[i]
    quick_sort(a, lo, i - 1)
    quick_sort(a, i + 1, hi)` }, cap: `Lomuto partition, tasodifiy pivot` },
        `Oʻrtacha O(n log n), eng yomon holat O(n²) — agar pivot har safar eng kichik yoki eng katta boʻlsa (masalan, saralangan massivda doim oxirgi elementni olsak). Tasodifiy pivot buni amalda yoʻqotadi. Eng yomon holatda chuqurlik n ga yetadi — Java'da StackOverflowError xavfi ham shundan.`,
        { table: { head: [``, `Merge sort`, `Quick sort`], rows: [
          [`Eng yomon vaqt`, `O(n log n)`, `O(n²)`],
          [`Oʻrtacha vaqt`, `O(n log n)`, `O(n log n), kichik konstanta`],
          [`Qoʻshimcha xotira`, `O(n)`, `O(log n) stek (oʻrtacha)`],
          [`Stable`, `Ha`, `Yoʻq`],
          [`Asosiy ish`, `Combine (merge)`, `Divide (partition)`]
        ] } },
        { note: `Codeforces'da <code>Arrays.sort(int[])</code> (dual-pivot quicksort) ni O(n²) ga tushiradigan maxsus testlar boʻlgan. Xavfsiz usul: <code>Integer[]</code>/<code>Long[]</code> massiv yoki <code>ArrayList</code> + <code>Collections.sort</code> (ular merge-sort asosida), yoki saralashdan oldin massivni aralashtirish.`, kind: 'warn', title: `Java va anti-quicksort testlar` }
      ]
    },
    {
      t: `Tez darajaga koʻtarish (binpow)`,
      b: [
        `aⁿ ni n marta koʻpaytirish — O(n). Lekin aⁿ = (a^(n/2))² (n juft) yoki a · (a^(n/2))² (n toq). Har qadamda n ikki baravar kichrayadi → <strong>O(log n)</strong>. n = 10¹⁸ boʻlsa ham ~60 qadam.`,
        { code: { java: `
static long power(long a, long n, long mod) {
    if (n == 0) return 1 % mod;
    long half = power(a, n / 2, mod);
    long res = half * half % mod;
    if (n % 2 == 1) res = res * (a % mod) % mod;
    return res;
}`, py: `
def power(a, n, mod):
    if n == 0:
        return 1 % mod
    half = power(a, n // 2, mod)
    res = half * half % mod
    if n % 2 == 1:
        res = res * (a % mod) % mod
    return res

# Python'da tayyor: pow(a, n, mod)` } },
        { note: `<code>half</code> ni bir marta hisoblab saqlaymiz. <code>power(a, n/2) * power(a, n/2)</code> deb yozilsa ikki chaqiruv boʻladi: T(n) = 2T(n/2) + O(1) = O(n) — butun foyda yoʻqoladi.`, kind: 'warn', title: `Klassik xato` },
        `mod = 10⁹ + 7 da ikki qoldiqning koʻpaytmasi ~10¹⁸ — <code>long</code> ga sigʻadi (maksimum ≈ 9.2·10¹⁸), <code>int</code> ga esa yoʻq. Shuning uchun Java'da barcha oraliq qiymatlar <code>long</code>.`,
        { h: `Iterativ shakl (bitlar boʻyicha)` },
        { code: { java: `
static long powerIt(long a, long n, long mod) {
    long res = 1 % mod;
    a %= mod;
    while (n > 0) {
        if ((n & 1) == 1) res = res * a % mod;
        a = a * a % mod;
        n >>= 1;
    }
    return res;
}`, py: `
def power_it(a, n, mod):
    res, a = 1 % mod, a % mod
    while n > 0:
        if n & 1:
            res = res * a % mod
        a = a * a % mod
        n >>= 1
    return res` } }
      ]
    },
    {
      t: `Hanoi minoralari`,
      b: [
        `Uchta ustun (A, B, C), A da n ta disk — pastda eng katta. Maqsad: hammasini C ga oʻtkazish. Qoidalar: bir vaqtda bitta disk koʻchadi va katta disk kichigining ustiga qoʻyilmaydi.`,
        `Rekursiv fikr: eng katta diskni koʻchirish uchun uning ustidagi n−1 ta disk yordamchi ustunda turishi kerak. Demak:`,
        { ol: [
          `n−1 diskni A → B ga koʻchirish (C yordamida) — rekursiya;`,
          `eng katta diskni A → C ga koʻchirish — bitta yurish;`,
          `n−1 diskni B → C ga koʻchirish (A yordamida) — rekursiya.`
        ] },
        { code: { java: `
static void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);
    System.out.println(n + "-disk: " + from + " -> " + to);
    hanoi(n - 1, via, to, from);
}
// hanoi(3, 'A', 'C', 'B');`, py: `
def hanoi(n, src, dst, via):
    if n == 0:
        return
    hanoi(n - 1, src, via, dst)
    print(f"{n}-disk: {src} -> {dst}")
    hanoi(n - 1, via, dst, src)

hanoi(3, "A", "C", "B")` } },
        `Yurishlar soni: M(n) = 2·M(n−1) + 1, M(0) = 0 → <strong>M(n) = 2ⁿ − 1</strong>. Bu minimal son: eng katta disk kamida bir marta koʻchishi shart, undan oldin esa n−1 diskli minora toʻliq boshqa ustunga oʻtgan boʻlishi kerak — bu kamida M(n−1) yurish, keyin yana shuncha.`,
        { table: { head: [`n`, `3`, `5`, `10`, `20`, `64`], rows: [[`2ⁿ − 1`, `7`, `31`, `1 023`, `1 048 575`, `≈ 1.8·10¹⁹`]] } },
        { lab: 'hanoi', q: 'n=4', text: `n = 4 ni avtomatik rejimda koʻring, keyin «Qoʻlda» rejimida oʻzingiz 15 yurishda yeching.` }
      ]
    },
    {
      t: `Inversiyalarni sanash`,
      b: [
        `<span class="term">Inversiya</span> — i < j va a[i] > a[j] boʻlgan juftlik. U massiv saralangan holatdan qanchalik uzoqligini koʻrsatadi. Ikki sikl bilan — O(n²). Merge sort ichida esa O(n log n): merge paytida oʻng qismdan element olinsa, u chap qismda qolgan barcha elementlardan kichik — ya'ni <code>mid − i</code> ta yangi inversiya.`,
        { code: { java: `
static long countInv(int[] a, int lo, int hi, int[] tmp) {
    if (hi - lo <= 1) return 0;
    int mid = (lo + hi) / 2;
    long cnt = countInv(a, lo, mid, tmp) + countInv(a, mid, hi, tmp);
    int i = lo, j = mid, k = lo;
    while (i < mid && j < hi) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else {
            cnt += mid - i;
            tmp[k++] = a[j++];
        }
    }
    while (i < mid) tmp[k++] = a[i++];
    while (j < hi) tmp[k++] = a[j++];
    for (k = lo; k < hi; k++) a[k] = tmp[k];
    return cnt;
}`, py: `
def count_inv(a):
    if len(a) <= 1:
        return a, 0
    mid = len(a) // 2
    left, x = count_inv(a[:mid])
    right, y = count_inv(a[mid:])
    res, cnt, i, j = [], x + y, 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            cnt += len(left) - i
            res.append(right[j]); j += 1
    res += left[i:] + right[j:]
    return res, cnt` } },
        { trace: `
[3, 1, 2]  →  inversiyalar: (3,1), (3,2)  →  2
[5, 4, 3, 2, 1]  →  har juftlik inversiya  →  C(5,2) = 10` },
        { note: `Javob n²/2 ga yetishi mumkin: n = 2·10⁵ da ~2·10¹⁰ — <code>int</code> ga sigʻmaydi, <code>long</code> shart.`, kind: 'warn' }
      ]
    }
  ],
  tasks: [
    { title: `Hanoi lab'ida n = 4 ni «Qoʻlda» rejimida 15 yurishda yeching`, type: 'lab', pts: 2, lab: 'hanoi', link: '#/lab/hanoi?n=4' },
    { title: `Merge sort va quick sort ni yozib, 10⁶ tasodifiy son ustida vaqtini solishtiring`, type: 'kod', pts: 3 },
    { title: `binpow ni rekursiv va iterativ shaklda yozing`, type: 'kod', pts: 2 },
    { title: `Inversiyalarni O(n²) va O(n log n) usulda hisoblab, tasodifiy testlarda solishtiring`, type: 'kod', pts: 2 }
  ],
  problems: [
    { pl: 'lc', code: '912', slug: 'sort-an-array', name: `Sort an Array`, lv: 'mid', note: `Merge sort bilan yozing` },
    { pl: 'lc', code: '50', slug: 'powx-n', name: `Pow(x, n)`, lv: 'mid', note: `Manfiy n va n = −2³¹ ga ehtiyot boʻling` },
    { pl: 'cses', code: '1095', name: `Exponentiation`, lv: 'easy', note: `aᵇ mod 10⁹+7, binpow` },
    { pl: 'cses', code: '2165', name: `Tower of Hanoi`, lv: 'easy', note: `Yurishlar sonini va roʻyxatini chiqaring` },
    { pl: 'lc', code: '169', slug: 'majority-element', name: `Majority Element`, lv: 'easy', note: `D&C: chap va oʻng yarim nomzodlarini solishtiring` },
    { pl: 'lc', code: '53', slug: 'maximum-subarray', name: `Maximum Subarray`, lv: 'mid', note: `D&C: chapda, oʻngda yoki oʻrtani kesib oʻtuvchi` },
    { pl: 'cf', code: '1490D', name: `Permutation Transformation`, lv: 'easy', note: `Maksimum — ildiz, chap va oʻng qism rekursiv` },
    { pl: 'cf', code: '1385D', name: `a-Good String`, lv: 'mid', note: `Yarmini c ga aylantirib, ikkinchi yarimga (c+1) rekursiya` },
    { pl: 'cf', code: '448C', name: `Painting Fence`, lv: 'hard', note: `Minimumgacha gorizontal boʻyab, boʻlaklarga ajrating` },
    { pl: 'spoj', code: 'INVCNT', name: `Inversion Count`, lv: 'mid', note: `Merge sort bilan inversiyalar` }
  ],
  quiz: [
    { q: `Merge sort ning eng yomon holatdagi vaqt murakkabligi?`, o: [`O(n)`, `O(n log n)`, `O(n²)`, `O(log n)`], a: 1, why: `Har doim teng ikkiga boʻlinadi va merge O(n) — kirishga bogʻliq emas.` },
    { q: `Quick sort qachon O(n²) ga tushadi?`, o: [`Massiv tasodifiy boʻlsa`, `Pivot doim eng kichik yoki eng katta element boʻlsa`, `Massivda dublikatlar boʻlmasa`, `n juft boʻlsa`], a: 1, why: `Boʻlinish 0 va n−1 boʻlib qoladi: T(n) = T(n−1) + O(n).` },
    { q: `Hanoi minoralarida n = 5 uchun minimal yurishlar soni?`, o: [`25`, `31`, `32`, `15`], a: 1, why: `2⁵ − 1 = 31.` },
    { q: `Toʻgʻri yozilgan binpow nechta koʻpaytirish bajaradi?`, o: [`O(1)`, `O(log n)`, `O(n)`, `O(√n)`], a: 1, why: `Har qadamda daraja ikki baravar kamayadi.` },
    { q: `<code>return power(a, n/2) * power(a, n/2);</code> yozuvining murakkabligi?`, o: [`O(log n)`, `O(n)`, `O(n log n)`, `O(2ⁿ)`], a: 1, why: `T(n) = 2T(n/2) + O(1) = O(n) — rekursiya daraxtida n ta tugun.` },
    { q: `Merge sort qoʻshimcha xotirasi?`, o: [`O(1)`, `O(log n)`, `O(n)`, `O(n log n)`], a: 2, why: `Merge uchun vaqtinchalik massiv kerak.` },
    { q: `<code>[3, 1, 2]</code> massivida nechta inversiya bor?`, o: [`1`, `2`, `3`, `0`], a: 1, why: `(3,1) va (3,2).` },
    { q: `D&C bosqichlarining toʻgʻri tartibi?`, o: [`Combine → Divide → Conquer`, `Divide → Conquer → Combine`, `Conquer → Divide → Combine`, `Divide → Combine → Conquer`], a: 1, why: `Avval boʻlamiz, qismlarni rekursiv yechamiz, keyin birlashtiramiz.` }
  ]
});
