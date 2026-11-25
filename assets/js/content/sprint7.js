RL.addSprint({
  n: 7,
  title: `Cheklovli backtracking`,
  weeks: `1 hafta`,
  goal: `Cheklovlarni har qadamda O(1) da tekshirish orqali N-Queens, Sudoku, labirint, Word Search va graf boʻyash masalalarini samarali yechish.`,
  outcomes: [
    `Masalani CSP sifatida koʻrasiz: oʻzgaruvchilar, qiymatlar, cheklovlar`,
    `N-Queens ni ustun va diagonal massivlari bilan O(1) tekshiruvda yozasiz`,
    `Sudoku yechuvchini yozasiz va MRV evristikasini tushuntirasiz`,
    `Grid'da backtracking: visited ni qachon tiklash kerakligini bilasiz`
  ],
  dod: [
    `Barcha darslar oʻqilgan`,
    `N-Queens, Sudoku va Labirint laboratoriyalari ishlatilgan`,
    `Kamida 5 ta masala yechilgan, shundan 1 tasi Qiyin`,
    `Sprint testidan 70%+`
  ],
  labs: ['queens', 'sudoku', 'maze'],
  lessons: [
    {
      t: `Cheklovlar bilan qidiruv`,
      b: [
        `Koʻp masalalarda yechim — bir nechta <span class="term">oʻzgaruvchi</span>ga qiymat berish, shunda barcha <span class="term">cheklov</span>lar bajariladi. N-Queens: oʻzgaruvchi — har qatordagi farzin ustuni; Sudoku: boʻsh kataklar; graf boʻyash: tugun ranglari. Bunday masalalar <strong>CSP</strong> (constraint satisfaction problem) deyiladi.`,
        `Kalit gʻoya — <strong>erta tekshirish</strong>: cheklovni toʻliq yechim tayyor boʻlganda emas, har qadamda tekshiramiz. Notoʻgʻri qisman yechim aniqlanishi bilan butun shox (uning ostidagi minglab tugunlar) kesiladi.`,
        { table: { head: [`8-Queens: yondashuv`, `Koʻriladigan holatlar`], rows: [
          [`64 katakdan istalgan 8 tasi: C(64, 8)`, `≈ 4.4·10⁹`],
          [`Har qatorga bitta farzin: 8⁸`, `≈ 1.7·10⁷`],
          [`Har qatorga bitta, ustunlar takrorlanmaydi: 8!`, `40 320`],
          [`Backtracking + erta tekshirish, barcha 92 yechim`, `2 056 ta joylashtirish`],
          [`Backtracking, birinchi yechimgacha`, `113 ta joylashtirish`]
        ] } },
        { note: `Cheklovni qayerda tekshirish muhim: farzinni qoʻyishdan <em>oldin</em> tekshirsak — notoʻgʻri holat umuman yaratilmaydi. Barg darajasida tekshirsak — butun daraxt aylaniladi.`, kind: 'key' }
      ]
    },
    {
      t: `N-Queens`,
      b: [
        `N×N taxtaga N ta farzinni bir-birini urmaydigan qilib joylashtirish. Har qatorga aynan bitta farzin qoʻyamiz (qator cheklovi avtomatik bajariladi), ustun va diagonallarni tekshiramiz.`,
        `O(1) tekshiruv uchun uch massiv:`,
        { list: [
          `<code>cols[c]</code> — c-ustun band;`,
          `<code>d1[r + c]</code> — «/» diagonal band (bir diagonalda r + c oʻzgarmas, 0..2n−2);`,
          `<code>d2[r − c + n − 1]</code> — «\\» diagonal band (r − c oʻzgarmas; manfiy boʻlmasligi uchun n − 1 qoʻshamiz).`
        ] },
        { code: { java: `
static int n, count = 0;
static boolean[] cols, d1, d2;

static void solve(int r) {
    if (r == n) {
        count++;
        return;
    }
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[r + c] || d2[r - c + n - 1]) continue;
        cols[c] = d1[r + c] = d2[r - c + n - 1] = true;
        solve(r + 1);
        cols[c] = d1[r + c] = d2[r - c + n - 1] = false;
    }
}

public static void main(String[] args) {
    n = 8;
    cols = new boolean[n];
    d1 = new boolean[2 * n - 1];
    d2 = new boolean[2 * n - 1];
    solve(0);
    System.out.println(count);
}`, py: `
def total_n_queens(n):
    cols = [False] * n
    d1 = [False] * (2 * n - 1)
    d2 = [False] * (2 * n - 1)
    count = 0

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
            cols[c] = d1[r + c] = d2[r - c + n - 1] = False

    solve(0)
    return count` } },
        { table: { head: [`N`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `12`], rows: [[`Yechimlar`, `2`, `10`, `4`, `40`, `92`, `352`, `724`, `14 200`]] } },
        `Yechimlarni chiqarish kerak boʻlsa, <code>pos[r] = c</code> massivini qoʻshing va barg darajasida taxtani <code>pos</code> dan quring.`,
        { lab: 'queens', q: 'n=6', text: `n = 6 da barcha 4 yechimni toping; urilgan kataklar koʻrinishini yoqing.` }
      ]
    },
    {
      t: `Sudoku yechuvchi`,
      b: [
        `Boʻsh katakni topamiz, 1..9 raqamlarini sinaymiz; raqam qatorda, ustunda va 3×3 blokda boʻlmasa — qoʻyamiz va keyingi katakka oʻtamiz. Hech bir raqam mos kelmasa — <code>false</code> qaytaramiz; chaqiruvchi esa oʻz raqamini olib tashlab, keyingisini sinaydi.`,
        { code: { java: `
static int[][] g = new int[9][9];
static boolean[][] row = new boolean[9][10], col = new boolean[9][10], box = new boolean[9][10];

static boolean solve(int cell) {
    if (cell == 81) return true;
    int r = cell / 9, c = cell % 9, b = (r / 3) * 3 + c / 3;
    if (g[r][c] != 0) return solve(cell + 1);
    for (int d = 1; d <= 9; d++) {
        if (row[r][d] || col[c][d] || box[b][d]) continue;
        g[r][c] = d;
        row[r][d] = col[c][d] = box[b][d] = true;
        if (solve(cell + 1)) return true;
        row[r][d] = col[c][d] = box[b][d] = false;
        g[r][c] = 0;
    }
    return false;
}`, py: `
def solve_sudoku(g):
    row = [[False] * 10 for _ in range(9)]
    col = [[False] * 10 for _ in range(9)]
    box = [[False] * 10 for _ in range(9)]
    for r in range(9):
        for c in range(9):
            d = g[r][c]
            if d:
                row[r][d] = col[c][d] = box[r // 3 * 3 + c // 3][d] = True

    def solve(cell):
        if cell == 81:
            return True
        r, c = divmod(cell, 9)
        if g[r][c]:
            return solve(cell + 1)
        b = r // 3 * 3 + c // 3
        for d in range(1, 10):
            if row[r][d] or col[c][d] or box[b][d]:
                continue
            g[r][c] = d
            row[r][d] = col[c][d] = box[b][d] = True
            if solve(cell + 1):
                return True
            row[r][d] = col[c][d] = box[b][d] = False
            g[r][c] = 0
        return False

    return solve(0)` }, cap: `Java'da row/col/box ni boshlangʻich raqamlar bilan toʻldirishni unutmang` },
        `Funksiya <code>boolean</code> qaytaradi: birinchi yechim topilishi bilan butun rekursiya <code>true</code> bilan yuqoriga chiqib ketadi va qolgan variantlar koʻrilmaydi. Bu «bitta yechim yetarli» turidagi backtracking.`,
        { h: `MRV evristikasi` },
        `Kataklarni qatorma-qator emas, <strong>eng kam variantga ega</strong> katakdan boshlab toʻldirsak (Minimum Remaining Values), daraxt keskin kichrayadi: varianti bitta katak darhol toʻldiriladi, varianti nol katak esa xatoni juda erta koʻrsatadi.`,
        { table: { head: [`Boshqotirma`, `Qatorma-qator`, `MRV`], rows: [[`Klassik (Wikipedia)`, `4 208 joylashtirish`, `51`], [`«Eng qiyin» (A. Inkala)`, `49 558`, `10 101`]] } },
        { lab: 'sudoku', q: 'p=hard', text: `«Eng qiyin» boshqotirmani oddiy va MRV rejimida yechib, qadamlar sonini solishtiring.` }
      ]
    },
    {
      t: `Grid'da yoʻl qidirish`,
      b: [
        `Labirint: 0 — yoʻl, 1 — devor. (0, 0) dan (n−1, m−1) ga nechta oddiy yoʻl bor (har katak bir martadan)? DFS-backtracking: katakni «tashrif buyurildi» deb belgilaymiz, toʻrt yoʻnalishni sinaymiz, qaytishda belgini olib tashlaymiz.`,
        { code: { java: `
static int n, m;
static int[][] g;
static boolean[][] vis;
static int[] dr = {1, 0, -1, 0}, dc = {0, 1, 0, -1};

static int countPaths(int r, int c) {
    if (r < 0 || c < 0 || r >= n || c >= m || g[r][c] == 1 || vis[r][c]) return 0;
    if (r == n - 1 && c == m - 1) return 1;
    vis[r][c] = true;
    int total = 0;
    for (int k = 0; k < 4; k++) total += countPaths(r + dr[k], c + dc[k]);
    vis[r][c] = false;
    return total;
}`, py: `
def count_paths(g):
    n, m = len(g), len(g[0])
    vis = [[False] * m for _ in range(n)]
    dirs = [(1, 0), (0, 1), (-1, 0), (0, -1)]

    def go(r, c):
        if r < 0 or c < 0 or r >= n or c >= m or g[r][c] == 1 or vis[r][c]:
            return 0
        if r == n - 1 and c == m - 1:
            return 1
        vis[r][c] = True
        total = sum(go(r + dr, c + dc) for dr, dc in dirs)
        vis[r][c] = False
        return total

    return go(0, 0)` } },
        { note: `<strong>Barcha yoʻllarni sanash/chiqarish</strong> uchun — ha, qaytishda <code>vis = false</code> shart: boshqa yoʻl shu katakdan oʻtishi mumkin. <strong>Faqat yetib borish mumkinmi</strong> degan savolda — yoʻq: oddiy DFS/BFS yetarli, katakni qayta ochish ishni eksponensial qiladi.`, kind: 'key', title: `Unmark qachon kerak?` },
        { lab: 'maze', text: `Labirint yarating (u ham rekursiv backtracker bilan quriladi) va DFS qanday berk koʻchalarga kirib-chiqishini kuzating.` }
      ]
    },
    {
      t: `Word Search`,
      b: [
        `Harflar panjarasida soʻz qoʻshni (yuqori, past, chap, oʻng) kataklar zanjiri sifatida bormi? Har katakdan boshlab, soʻzning keyingi harfini qoʻshnilardan qidiramiz. Bitta katak ikki marta ishlatilmasligi uchun uni vaqtincha <code>'#'</code> bilan almashtiramiz.`,
        { code: { java: `
static boolean exist(char[][] b, String w) {
    for (int r = 0; r < b.length; r++)
        for (int c = 0; c < b[0].length; c++)
            if (dfs(b, w, 0, r, c)) return true;
    return false;
}

static boolean dfs(char[][] b, String w, int i, int r, int c) {
    if (i == w.length()) return true;
    if (r < 0 || c < 0 || r >= b.length || c >= b[0].length || b[r][c] != w.charAt(i)) return false;
    char t = b[r][c];
    b[r][c] = '#';
    boolean ok = dfs(b, w, i + 1, r + 1, c) || dfs(b, w, i + 1, r - 1, c)
              || dfs(b, w, i + 1, r, c + 1) || dfs(b, w, i + 1, r, c - 1);
    b[r][c] = t;
    return ok;
}`, py: `
def exist(board, word):
    n, m = len(board), len(board[0])

    def dfs(i, r, c):
        if i == len(word):
            return True
        if r < 0 or c < 0 or r >= n or c >= m or board[r][c] != word[i]:
            return False
        t = board[r][c]
        board[r][c] = "#"
        ok = (dfs(i + 1, r + 1, c) or dfs(i + 1, r - 1, c)
              or dfs(i + 1, r, c + 1) or dfs(i + 1, r, c - 1))
        board[r][c] = t
        return ok

    return any(dfs(0, r, c) for r in range(n) for c in range(m))` } },
        `<code>||</code> / <code>or</code> qisqa tutashuvi (short-circuit) tufayli birinchi muvaffaqiyatli yoʻnalishdan keyin qolganlari tekshirilmaydi. Panjarani oʻzgartirib keyin tiklash — alohida <code>visited</code> massivisiz «unchoose» qilishning tejamkor usuli.`,
        { note: `Tezlashtirish: soʻzdagi biror harf panjarada yetarlicha boʻlmasa, qidiruvni umuman boshlamang. Soʻzning kam uchraydigan uchidan boshlash ham daraxtni kichraytiradi.`, kind: 'tip' }
      ]
    },
    {
      t: `Graf boʻyash (m-coloring)`,
      b: [
        `Grafning har tuguniga m ta rangdan birini berish kerak, qoʻshni tugunlar bir xil rangda boʻlmasin. Tugunlarni ketma-ket boʻyaymiz; har rang uchun qoʻshnilarni tekshiramiz.`,
        { code: { java: `
static boolean color(int v, int m, List<List<Integer>> adj, int[] col) {
    if (v == adj.size()) return true;
    for (int c = 1; c <= m; c++) {
        boolean ok = true;
        for (int u : adj.get(v)) {
            if (col[u] == c) {
                ok = false;
                break;
            }
        }
        if (!ok) continue;
        col[v] = c;
        if (color(v + 1, m, adj, col)) return true;
        col[v] = 0;
    }
    return false;
}`, py: `
def color(v, m, adj, col):
    if v == len(adj):
        return True
    for c in range(1, m + 1):
        if any(col[u] == c for u in adj[v]):
            continue
        col[v] = c
        if color(v + 1, m, adj, col):
            return True
        col[v] = 0
    return False` } },
        { note: `Simmetriyani sindirish: birinchi tugunga doim 1-rangni berish mumkin — ranglar nomi ahamiyatsiz. Bu qidiruvni m baravar qisqartiradi. Pruning turlari haqida batafsil — Sprint 8.`, kind: 'tip' },
        `Tugunlarni darajasi (qoʻshnilar soni) kamayish tartibida boʻyash ham samarali: eng cheklangan tugunlar erta hal boʻladi — bu MRV ning graf varianti.`
      ]
    }
  ],
  tasks: [
    { title: `N-Queens lab'ida n = 6 ning barcha yechimlarini toping`, type: 'lab', pts: 2, lab: 'queens', link: '#/lab/queens?n=6' },
    { title: `Sudoku lab'ida oddiy va MRV rejimidagi qadamlar sonini solishtiring`, type: 'lab', pts: 2, lab: 'sudoku', link: '#/lab/sudoku?p=hard' },
    { title: `Labirint lab'ida oʻzingiz devor chizib, yoʻl yoʻq holatni yarating`, type: 'lab', pts: 1, lab: 'maze', link: '#/lab/maze' },
    { title: `N-Queens (barcha yechimlarni chop etish), Sudoku, Word Search ni yozing`, type: 'kod', pts: 5 }
  ],
  problems: [
    { pl: 'lc', code: '51', slug: 'n-queens', name: `N-Queens`, lv: 'hard', note: `pos[] dan taxta satrlarini quring` },
    { pl: 'lc', code: '52', slug: 'n-queens-ii', name: `N-Queens II`, lv: 'hard', note: `Faqat sanash` },
    { pl: 'lc', code: '37', slug: 'sudoku-solver', name: `Sudoku Solver`, lv: 'hard', note: `row/col/box massivlari` },
    { pl: 'lc', code: '79', slug: 'word-search', name: `Word Search`, lv: 'mid', note: `'#' bilan vaqtinchalik belgilash` },
    { pl: 'lc', code: '980', slug: 'unique-paths-iii', name: `Unique Paths III`, lv: 'hard', note: `Barcha boʻsh kataklardan oʻtuvchi yoʻllar` },
    { pl: 'lc', code: '1219', slug: 'path-with-maximum-gold', name: `Path with Maximum Gold`, lv: 'mid', note: `Grid backtracking + maksimum` },
    { pl: 'cses', code: '1624', name: `Chessboard and Queens`, lv: 'mid', note: `Band kataklar bilan 8-Queens` },
    { pl: 'lc', code: '131', slug: 'palindrome-partitioning', name: `Palindrome Partitioning`, lv: 'mid', note: `Har prefiks palindrom boʻlsa — kesib, davom etamiz` },
    { pl: 'lc', code: '93', slug: 'restore-ip-addresses', name: `Restore IP Addresses`, lv: 'mid', note: `4 ta boʻlak, har biri 0..255, boshida 0 yoʻq` }
  ],
  quiz: [
    { q: `8×8 taxtada N-Queens masalasining yechimlari soni?`, o: [`8`, `64`, `92`, `40 320`], a: 2, why: `Klassik natija: 92 ta yechim (12 tasi simmetriyagacha farqli).` },
    { q: `N-Queens'da <code>r + c</code> qiymati bir xil boʻlgan kataklar…`, o: [`bitta ustunda`, `bitta «/» diagonalda`, `bitta «\\» diagonalda`, `bitta qatorda`], a: 1, why: `Pastga-chapga yurganda r oshadi, c kamayadi — yigʻindi oʻzgarmaydi.` },
    { q: `Sudoku'da (r, c) katak qaysi 3×3 blokka tegishli (0..8)?`, o: [`r / 3 + c / 3`, `(r / 3) * 3 + c / 3`, `r * 3 + c`, `(r + c) / 3`], a: 1, why: `Blok qatori r/3, blok ustuni c/3; ularni 0..8 ga aylantiramiz.` },
    { q: `Grid'da barcha yoʻllarni sanashda <code>vis[r][c] = false</code> nima uchun qaytariladi?`, o: [`Xotirani tejash uchun`, `Boshqa yoʻllar shu katakdan oʻtishi mumkin`, `Cheksiz siklni oldini olish uchun`, `Tezlashtirish uchun`], a: 1, why: `Katak faqat joriy yoʻl uchun band, boshqa yoʻllar uchun ochiq boʻlishi kerak.` },
    { q: `MRV evristikasi nima?`, o: [`Eng koʻp variantli katakni birinchi tanlash`, `Eng kam variantli katakni birinchi tanlash`, `Kataklarni tasodifiy tanlash`, `Raqamlarni kattadan kichikka sinash`], a: 1, why: `Minimum Remaining Values: eng cheklangan oʻzgaruvchi birinchi — xatolar erta chiqadi.` },
    { q: `N-Queens'da har qatorga aynan bitta farzin qoʻyish nimani beradi?`, o: [`Diagonal tekshiruvni keraksiz qiladi`, `Qator cheklovini avtomatik bajaradi va qidiruv fazosini kichraytiradi`, `Faqat bitta yechim topadi`, `Rekursiyani yoʻqotadi`], a: 1, why: `C(64,8) oʻrniga 8⁸, undan keyin ustun/diagonal tekshiruvi yana kesadi.` },
    { q: `Word Search'da katakni vaqtincha <code>'#'</code> qilishdan maqsad?`, o: [`Soʻzni teskari tekshirish`, `Bitta katakni bir soʻzda ikki marta ishlatmaslik`, `Natijani saqlash`, `Panjarani tozalash`], a: 1, why: `Bu visited belgisi; qaytishda asl harf tiklanadi.` },
    { q: `Sudoku yechuvchi <code>boolean</code> qaytarishining sababi?`, o: [`Barcha yechimlarni sanash`, `Birinchi yechim topilishi bilan qidiruvni toʻxtatish`, `Xatolarni chop etish`, `Java talab qiladi`], a: 1, why: `true yuqoriga koʻtariladi va boshqa variantlar sinalmaydi.` }
  ]
});
