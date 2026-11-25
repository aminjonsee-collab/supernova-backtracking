RL.addSprint({
  n: 6,
  title: `Backtracking asoslari`,
  weeks: `1 hafta`,
  goal: `Holatlar daraxti va «choose → explore → unchoose» shablonini oʻzlashtirib, qism toʻplamlar, oʻrin almashtirishlar, kombinatsiyalar va qavslarni generatsiya qilish.`,
  outcomes: [
    `Masalaning holatlar daraxtini chizasiz`,
    `Universal backtracking shablonini xotiradan yozasiz`,
    `Subsets, permutations, combinations ni ikki xil usulda yozasiz`,
    `Natijani saqlashda nusxa olish xatosini oldini olasiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `Holatlar daraxti laboratoriyasida 3 ta rejim koʻrilgan`,
    `Kamida 6 ta masala yechilgan`,
    `Sprint testidan 70%+`
  ],
  labs: ['space'],
  lessons: [
    {
      t: `Backtracking nima?`,
      b: [
        `<strong>Backtracking</strong> (orqaga qaytish) — yechimni qadam-baqadam quradigan va har qadamda «bu yoʻl yechimga olib borishi mumkinmi?» deb tekshiradigan toʻliq qidiruv. Yoʻl berk boʻlsa, <em>oxirgi</em> tanlovni bekor qilib, boshqa variantni sinaymiz.`,
        `Labirintni eslang: har chorrahada bir yoʻlni tanlaysiz; berk koʻchaga kirsangiz, oxirgi chorrahaga qaytib, boshqa yoʻlni tanlaysiz. Hech qachon butun labirintni boshidan boshlamaysiz — faqat bir qadam orqaga.`,
        { h: `Holatlar daraxti (state-space tree)` },
        `Har tugun — qisman yechim (hozirgacha qilingan tanlovlar), har shox — bitta tanlov, barglar — toʻliq yechimlar yoki berk koʻchalar. Backtracking bu daraxtni DFS tartibida aylanadi, lekin uni xotirada <em>qurmaydi</em> — bir vaqtda faqat joriy yoʻl saqlanadi.`,
        { trace: `
                        []
              +1 /               \\ −1
              [1]                  []
          +2 /    \\ −2         +2 /    \\ −2
        [1,2]     [1]         [2]       []
        /   \\    /   \\      /   \\     /   \\
  [1,2,3] [1,2] [1,3] [1]  [2,3] [2]  [3]   []` },
        { note: `Har bir backtracking uch harakatdan iborat: <strong>choose</strong> — tanlash (holatni oʻzgartirish), <strong>explore</strong> — rekursiv chuqurlashish, <strong>unchoose</strong> — tanlovni bekor qilish (holatni tiklash).`, kind: 'key', title: `Choose, explore, unchoose` },
        { table: { head: [``, `Oddiy rekursiya`, `Backtracking`], rows: [
          [`Maqsad`, `Bitta qiymatni hisoblash`, `Barcha (yoki birinchi) yechimni qidirish`],
          [`Holat`, `Parametrlarda, oʻzgarmas`, `Umumiy obyekt (path, used[]) — oʻzgaradi va tiklanadi`],
          [`Natija`, `return orqali`, `Odatda tashqi roʻyxatga qoʻshiladi`]
        ] } }
      ]
    },
    {
      t: `Universal shablon`,
      b: [
        { code: { java: `
static List<List<Integer>> res = new ArrayList<>();
static List<Integer> path = new ArrayList<>();

static void backtrack(State s) {
    if (isSolution(s)) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int c : choices(s)) {
        if (!valid(s, c)) continue;
        path.add(c);                        // choose
        backtrack(next(s, c));              // explore
        path.remove(path.size() - 1);       // unchoose
    }
}`, py: `
res, path = [], []

def backtrack(state):
    if is_solution(state):
        res.append(path[:])
        return
    for c in choices(state):
        if not valid(state, c):
            continue
        path.append(c)            # choose
        backtrack(next_state(state, c))
        path.pop()                # unchoose` }, cap: `Shablon: isSolution, choices, valid — masalaga qarab almashadi` },
        { note: `<code>res.add(path)</code> deb yozsangiz, natijaga <em>bitta va oʻsha</em> roʻyxatga havola qoʻshiladi. Backtracking oxirida <code>path</code> boʻshab qoladi va natija <code>[[], [], [], …]</code> boʻladi. Doim nusxa oling: <code>new ArrayList<>(path)</code> yoki <code>path[:]</code>.`, kind: 'warn', title: `Eng koʻp uchraydigan xato` },
        `Nima uchun <code>remove</code> kerak? <code>path</code> — barcha chaqiruvlar uchun umumiy obyekt. Bir shoxni oʻrganib boʻlgach uni avvalgi holatiga qaytarmasak, keyingi shox «iflos» holatdan boshlanadi.`,
        { h: `Murakkablikni baholash` },
        `Vaqt ≈ (holatlar daraxtidagi tugunlar) × (tugundagi ish). Natijani nusxalash O(n) boʻlgani uchun: subsets — O(n · 2ⁿ), permutations — O(n · n!). Bu «chiqish hajmi»ning oʻzi — undan tezroq boʻlishi mumkin emas.`,
        { table: { head: [`n`, `2ⁿ`, `n!`], rows: [[`10`, `1 024`, `3 628 800`], [`15`, `32 768`, `≈ 1.3·10¹²`], [`20`, `1 048 576`, `≈ 2.4·10¹⁸`]] } }
      ]
    },
    {
      t: `Qism toʻplamlar (subsets)`,
      b: [
        `<strong>1-usul — olish yoki olmaslik.</strong> Har element uchun ikki tanlov. Daraxt balandligi n, barglar 2ⁿ, faqat barglar yechim.`,
        { code: { java: `
static void subsets(int[] a, int i, List<Integer> path, List<List<Integer>> res) {
    if (i == a.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    path.add(a[i]);
    subsets(a, i + 1, path, res);
    path.remove(path.size() - 1);
    subsets(a, i + 1, path, res);
}`, py: `
def subsets(a):
    res, path = [], []
    def go(i):
        if i == len(a):
            res.append(path[:])
            return
        path.append(a[i])
        go(i + 1)
        path.pop()
        go(i + 1)
    go(0)
    return res` } },
        { lab: 'space', q: 'mode=subsets&n=3', text: `«Olish yoki olmaslik» daraxtini qadam-baqadam quring.` },
        `<strong>2-usul — keyingi elementni tanlash.</strong> Har tugun oʻzi yechim, bolalari — <code>start</code> dan keyingi elementlar. Bu usul kombinatsiyalar va dublikatli masalalar uchun asos.`,
        { code: { java: `
static void subsets2(int[] a, int start, List<Integer> path, List<List<Integer>> res) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < a.length; i++) {
        path.add(a[i]);
        subsets2(a, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`, py: `
def subsets2(a):
    res, path = [], []
    def go(start):
        res.append(path[:])
        for i in range(start, len(a)):
            path.append(a[i])
            go(i + 1)
            path.pop()
    go(0)
    return res` } },
        { h: `Bitmask alternativasi` },
        { code: { java: `
for (int mask = 0; mask < (1 << n); mask++) {
    List<Integer> sub = new ArrayList<>();
    for (int j = 0; j < n; j++)
        if ((mask >> j & 1) == 1) sub.add(a[j]);
    res.add(sub);
}`, py: `
for mask in range(1 << n):
    sub = [a[j] for j in range(n) if mask >> j & 1]
    res.append(sub)` }, cap: `Rekursiyasiz: mask ning j-biti — a[j] olinganmi` },
        `n ≤ 20 boʻlganda bitmask ham qulay. Lekin pruning (erta toʻxtash) kerak boʻlsa, rekursiv usul ustun: bitmask har doim barcha 2ⁿ variantni koʻradi.`
      ]
    },
    {
      t: `Oʻrin almashtirishlar (permutations)`,
      b: [
        `Har pozitsiyaga hali ishlatilmagan elementlardan birini qoʻyamiz. Qaysi elementlar band ekanini <code>used[]</code> massivida saqlaymiz.`,
        { code: { java: `
static void permute(int[] a, boolean[] used, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == a.length) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < a.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(a[i]);
        permute(a, used, path, res);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}`, py: `
def permutations(a):
    res, path, used = [], [], [False] * len(a)
    def go():
        if len(path) == len(a):
            res.append(path[:])
            return
        for i in range(len(a)):
            if used[i]:
                continue
            used[i] = True
            path.append(a[i])
            go()
            path.pop()
            used[i] = False
    go()
    return res` } },
        `<code>used[i]</code> ham <code>path</code> kabi tanlanadi va bekor qilinadi. «Unchoose» holatning <em>barcha</em> oʻzgargan qismlarini tiklashi shart.`,
        { lab: 'space', q: 'mode=perm&n=3', text: `[1, 2, 3] permutatsiyalari daraxti: 3 · 2 · 1 = 6 ta barg.` },
        { h: `Swap usuli` },
        `Qoʻshimcha massivsiz: k-pozitsiyaga navbatma-navbat har bir qolgan elementni almashtirib qoʻyamiz.`,
        { code: { java: `
static void permuteSwap(int[] a, int k, List<List<Integer>> res) {
    if (k == a.length) {
        List<Integer> p = new ArrayList<>();
        for (int x : a) p.add(x);
        res.add(p);
        return;
    }
    for (int i = k; i < a.length; i++) {
        int t = a[k]; a[k] = a[i]; a[i] = t;
        permuteSwap(a, k + 1, res);
        t = a[k]; a[k] = a[i]; a[i] = t;
    }
}`, py: `
def permute_swap(a, k, res):
    if k == len(a):
        res.append(a[:])
        return
    for i in range(k, len(a)):
        a[k], a[i] = a[i], a[k]
        permute_swap(a, k + 1, res)
        a[k], a[i] = a[i], a[k]` } }
      ]
    },
    {
      t: `Kombinatsiyalar C(n, k)`,
      b: [
        `1..n dan k ta son tanlash, tartib muhim emas. Takrorlanmaslik uchun har safar faqat oldingi tanlangandan <em>katta</em> sonlarni olamiz — <code>start</code> parametri.`,
        { code: { java: `
static void combine(int n, int k, int start, List<Integer> path, List<List<Integer>> res) {
    if (path.size() == k) {
        res.add(new ArrayList<>(path));
        return;
    }
    for (int i = start; i <= n - (k - path.size()) + 1; i++) {
        path.add(i);
        combine(n, k, i + 1, path, res);
        path.remove(path.size() - 1);
    }
}`, py: `
def combine(n, k):
    res, path = [], []
    def go(start):
        if len(path) == k:
            res.append(path[:])
            return
        for i in range(start, n - (k - len(path)) + 2):
            path.append(i)
            go(i + 1)
            path.pop()
    go(1)
    return res` } },
        { note: `Sikl chegarasi <code>n − (k − size) + 1</code>: qolgan sonlar kerakli miqdordan kam boʻlsa, bu shoxga kirmaymiz. Masalan n = 5, k = 3: birinchi son 4 boʻlsa, undan keyin faqat 5 qoladi — ikkita son kerak edi. Kichik shart daraxtdagi koʻplab foydasiz tugunlarni olib tashlaydi.`, kind: 'key', title: `Birinchi pruning` },
        { lab: 'space', q: 'mode=comb&n=5&k=3', text: `Pruning ni oʻchirib-yoqib, qizil (kesilgan) tugunlar sonini solishtiring.` },
        `Javoblar soni C(n, k) = n! / (k! (n−k)!). C(5, 2) = 10, C(10, 5) = 252, C(20, 10) = 184 756.`
      ]
    },
    {
      t: `Qavslarni generatsiya qilish`,
      b: [
        `n juft qavsdan barcha toʻgʻri ketma-ketliklar. Har qadamda ikki tanlov: <code>(</code> yoki <code>)</code>. Cheklovlar: ochiq qavslar soni n dan oshmasin; yopiq qavslar ochiqlardan oshmasin.`,
        { code: { java: `
static void gen(int open, int close, int n, StringBuilder sb, List<String> res) {
    if (sb.length() == 2 * n) {
        res.add(sb.toString());
        return;
    }
    if (open < n) {
        sb.append('(');
        gen(open + 1, close, n, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
    if (close < open) {
        sb.append(')');
        gen(open, close + 1, n, sb, res);
        sb.deleteCharAt(sb.length() - 1);
    }
}`, py: `
def generate(n):
    res = []
    def go(s, open_, close):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_ < n:
            go(s + "(", open_ + 1, close)
        if close < open_:
            go(s + ")", open_, close + 1)
    go("", 0, 0)
    return res` } },
        `Python versiyasida <code>s + "("</code> yangi satr yaratadi, shuning uchun «unchoose» kerak emas: har chaqiruv oʻz nusxasini oladi. Bu ham toʻgʻri usul, faqat har qadamda O(n) nusxa.`,
        `Javoblar soni — <span class="term">Catalan sonlari</span>: 1, 1, 2, 5, 14, 42, 132 … (n = 0..6). Ular Sprint 3 dagi LeetCode 241 va 894 da ham uchraydi.`,
        { lab: 'space', q: 'mode=paren&n=3', text: `Qaysi shoxlar cheklov tufayli umuman ochilmasligini koʻring.` }
      ]
    }
  ],
  tasks: [
    { title: `Holatlar daraxti lab'ida subsets, permutations va combinations rejimlarini koʻring`, type: 'lab', pts: 2, lab: 'space', link: '#/lab/space' },
    { title: `Universal shablonni qogʻozga xotiradan yozing`, type: 'kod', pts: 1 },
    { title: `subsets (2 usul), permutations (used[] va swap), combine, generateParenthesis ni yozing`, type: 'kod', pts: 5 },
    { title: `res.add(path) xatosini ataylab qilib, natijani koʻring va tuzating`, type: 'kod', pts: 1 }
  ],
  problems: [
    { pl: 'lc', code: '78', slug: 'subsets', name: `Subsets`, lv: 'mid', note: `Ikkala usulda yozing` },
    { pl: 'lc', code: '46', slug: 'permutations', name: `Permutations`, lv: 'mid', note: `used[] massivi bilan` },
    { pl: 'lc', code: '77', slug: 'combinations', name: `Combinations`, lv: 'mid', note: `Pruning bilan va pruningsiz vaqtini solishtiring` },
    { pl: 'lc', code: '22', slug: 'generate-parentheses', name: `Generate Parentheses`, lv: 'mid', note: `open/close cheklovlari` },
    { pl: 'lc', code: '17', slug: 'letter-combinations-of-a-phone-number', name: `Letter Combinations of a Phone Number`, lv: 'mid', note: `Har raqam — bitta daraja` },
    { pl: 'lc', code: '1863', slug: 'sum-of-all-subset-xor-totals', name: `Sum of All Subset XOR Totals`, lv: 'easy', note: `Subsets + XOR` },
    { pl: 'cses', code: '1622', name: `Creating Strings`, lv: 'easy', note: `Takroriy harflar — natijani saralab, dublikatsiz chiqaring` },
    { pl: 'cses', code: '1623', name: `Apple Division`, lv: 'easy', note: `Har olma — ikki guruhdan biriga, 2ⁿ` },
    { pl: 'cf', code: '1097B', name: `Petr and a Combination Lock`, lv: 'easy', note: `Har burilish ± — 2ⁿ variant` },
    { pl: 'cf', code: '476B', name: `Dreamoon and WiFi`, lv: 'easy', note: `'?' larni rekursiv ochib, ehtimollikni hisoblang` },
    { pl: 'cf', code: '550B', name: `Preparing Olympiad`, lv: 'mid', note: `Subsets + shartlarni tekshirish` }
  ],
  quiz: [
    { q: `n elementli toʻplamning qism toʻplamlari soni?`, o: [`n²`, `2ⁿ`, `n!`, `2n`], a: 1, why: `Har element uchun ikki tanlov: olish yoki olmaslik.` },
    { q: `n ta turli elementning permutatsiyalari soni?`, o: [`2ⁿ`, `n²`, `n!`, `nⁿ`], a: 2, why: `Birinchi pozitsiyaga n, ikkinchisiga n−1 … variant.` },
    { q: `Natijaga <code>path</code> ni saqlashda nima uchun nusxa olinadi?`, o: [`Tezlik uchun`, `path keyin oʻzgaradi — havola saqlansa, natijalar ham oʻzgaradi`, `Java talab qiladi`, `Xotirani tejash uchun`], a: 1, why: `Bitta obyektga havola saqlansa, oxirida hammasi boʻsh roʻyxat boʻladi.` },
    { q: `Backtracking'dagi «unchoose» bosqichi nima?`, o: [`Natijani chop etish`, `Oxirgi tanlovni bekor qilib, holatni tiklash`, `Base case ni tekshirish`, `Rekursiyani toʻxtatish`], a: 1, why: `Keyingi shox toza holatdan boshlanishi uchun.` },
    { q: `C(5, 2) nechaga teng?`, o: [`10`, `20`, `5`, `25`], a: 0, why: `5! / (2! · 3!) = 10.` },
    { q: `n = 3 juft qavs uchun toʻgʻri ketma-ketliklar soni?`, o: [`3`, `5`, `6`, `8`], a: 1, why: `Catalan soni C₃ = 5: ((())), (()()), (())(), ()(()), ()()().` },
    { q: `Kombinatsiyalarda <code>i ≤ n − (k − size) + 1</code> sharti nima uchun?`, o: [`Dublikatlarni oʻtkazish`, `Qolgan sonlar yetmaydigan shoxlarni kesish`, `Saralash uchun`, `Overflow oldini olish`], a: 1, why: `Kerakli miqdorga yetib boʻlmaydigan shoxlar ochilmaydi.` },
    { q: `«Olish yoki olmaslik» usulida n = 3 uchun holatlar daraxtida jami nechta tugun bor?`, o: [`8`, `15`, `7`, `16`], a: 1, why: `1 + 2 + 4 + 8 = 15 = 2⁴ − 1.` }
  ]
});
