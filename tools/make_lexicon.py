"""Builds src/desert/hollowgrass_lex.js: the fixed vocabulary of the grassland tongue.

    python tools/make_lexicon.py

It reads every line the people of the Hollow Grasslands speak (the chats and quest offers in hollowgrass_talk.js, the
`lines:` arrays of the town folk, the room folk and Orrim), counts the words, and gives every word used 3 or more times,
plus a hand-made list of essentials, one fixed hollow word. The party learns words by asking (hollowgrass_talk.js). Run it again after changing the dialogue; the same English word always gets the
same hollow word, so re-running only adds words.
"""
import re, hashlib, json, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src' / 'desert'
STR = r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\""

def strings(text):
    out = []
    for m in re.finditer(STR, text):
        s = m.group(1) if m.group(1) is not None else m.group(2)
        out.append(s.replace("\\'", "'").replace('\\"', '"'))
    return out

def corpus():
    lines = []
    t = (SRC / 'hollowgrass_talk.js').read_text(encoding='utf-8')
    for ln in t.splitlines():                       # quest offers: the 8th string of every hgq(...)
        if ln.startswith('hgq('):
            s = strings(ln)
            if len(s) > 7: lines.append(s[7])
    a = t.index('const HG_FOLK=['); b = t.index('for(const town of HG_FOLK)')
    lines += [s for s in strings(t[a:b]) if re.search(r'[.!?]$', s)]   # the chats (names do not end with a full stop)
    arr = re.compile(r"lines:\s*\[((?:[^\]'\"]|'(?:[^'\\\n]|\\.)*'|\"(?:[^\"\\\n]|\\.)*\")*)\]")
    for f in ['hgt_life.js', 'hgt_rooms.js', 'hgt_town_exsce.js', 'hgt_town_nibb.js', 'hgt_town_glorm.js', 'hgt_town_ulb.js']:
        p = SRC / f
        if not p.exists(): continue
        for ln in p.read_text(encoding='utf-8').splitlines():
            if ln.lstrip().startswith("add('"): continue        # creatures: their lines are plain messages, not speech
            for m in arr.finditer(ln): lines += strings(m.group(1))
            m = re.search(r"\bsw=\[((?:[^\]'\"]|'(?:[^'\\\n]|\\.)*')*)\]", ln)   # Glorm's stair sweepers
            if m: lines += strings(m.group(1))
    tr = (SRC / 'hgt_trader.js').read_text(encoding='utf-8')
    lines += [s for s in strings(' '.join(re.findall(r"hgGarble\((.*?),hgLvl\(\)\)", tr))) if len(s) > 8]
    return lines

def words(line):
    out = []
    for w in re.findall(r"[A-Za-z’']+", line):
        w = w.lower().replace('’', "'").strip("'")
        if w: out.append(w)
    return out

ESSENTIALS = """i you we they me my your our us them he she it the a an and or but not of to in on at with for from by
city town village house home work water pond food friend stranger good bad big small old new yes no go come give take help see find bring
gold quest night day name road hill grass hive book word eat drink sleep walk run kill fight kind thank please sorry hello welcome
where what who why how when here there this that one two three four five six hungry tired afraid safe danger light dark
sun moon star rain wind fire stone door gate wall street square market shop trade buy sell price coin
mother father child man woman people elder guard healer trader baker herder
hand head eye heart voice song story tale long short high low far near fast slow
is are was be have has do does can will must may know want need like love hate fear
very more much many some all every never always again now soon today tomorrow
""".split()

# hand-made first words (they stay as given); everything else is generated
HAND = {'i': 'e', 'a': 'o'}
# words learned from the first book on, whatever their count
CORE1 = """i you we they me my your the a an and of to in it is that this house city town home work water pond food friend stranger
good bad big small yes no go come give take help see find bring gold quest night day name here there what where who""".split()

CONS = 'xcsrngd'; CONS2 = 'xcsrngdxcsrngdltmz'; VOW = 'aeoeaeio'
ENDS = ['cn', 'sx', 'ene', 'rx', 'gd', 'xn', 'nc', 'sc', 'ex', 'dx', 'ce']
SHORT3 = set("""the and but for are was not you all any can her had has him his how its let may new now old one our out she two use who why yes yet
see say saw sit set run put pay one off own odd nor mad low lot key kid job joy ink ice hot hit her guy gun got god fun fly fit few fat far eye eat dry dog die did cut cry cow cry big bed bad bag bar bat bay bee bit box boy bus buy cab car cat day dig ear end era fan fee fig fix fox gap gas gem hat hen hid hip hut jar jaw jet joy lap law lay leg lid lie lip map mix mud net nod nut oak oil pan pen pet pie pig pin pit pot rat raw red rib rid rob rod row rub rug sad sea sir sky son sun tan tap tax tea ten tie tin tip toe ton top toy try tub van vet war wax web wet win wow zip zoo""".split())
SHORT3 |= set("dad doc ted sex nan dan sac sig tad gad rad mad cod god nod rod sod xxx".split())
SHORT2 = set("ad ah am an as at ax be by do eh ex go ha he hi if in is it me my no of oh ok on or ox so to uh um up us we ye yo".split())

def rnd(word, k):
    h = hashlib.md5(('%s|%d' % (word, k)).encode()).digest()
    return [b / 255.0 for b in h]

def make(word, n, k):
    r = rnd(word, k); ri = iter(r * 4)
    nx = lambda: next(ri)
    pick = lambda s: s[int(nx() * len(s)) % len(s)]
    if n == 1: return pick('eou')
    if n == 2: return pick([c + v for c in CONS for v in 'eao'] + [v + c for c in CONS for v in 'eao'] + ['sc', 'xc', 'rn', 'gd'])
    ends = [e for e in ENDS if len(e) <= n - 1]
    end = pick(ends) if (n >= 4 or nx() < .5) and ends else ''
    body = ''; need = n - len(end)
    while len(body) < need:
        vv = body and body[-1] in 'aeio'
        if vv: body += pick(CONS2)
        else:
            nc = 0
            for ch in reversed(body):
                if ch in 'aeio': break
                nc += 1
            body += pick(VOW) if (nc >= 2 or (nc == 1 and nx() < .34) or (not body and nx() < .2)) else pick(CONS2)
    w = body + end
    if n >= 3 and not re.search('[aeio]', w): w = w[:1] + pick('aeo') + w[2:]
    return w

def main():
    lines = corpus()
    cnt = collections.Counter(w for l in lines for w in words(l))
    chosen = {w for w, c in cnt.items() if c >= 3} | set(ESSENTIALS)
    english = set(cnt) | set(ESSENTIALS) | SHORT3 | SHORT2 | {'a', 'i'}
    lex = {}; used = set()
    def assign(w, h):
        lex[w] = h; used.add(h)
    for w, h in HAND.items():
        if w in chosen: assign(w, h)
    for w in sorted(chosen, key=lambda x: (len(x), x)):
        if w in lex: continue
        n = max(1, min(9, len(w)))
        for k in range(400):
            if k and k % 60 == 0: n = min(9, n + 1)
            h = make(w, n, k)
            if h not in used and h not in english and h != w: break
        else: raise SystemExit('no word for ' + w)
        assign(w, h)
    keys = sorted(lex)
    js = ('/* written by tools/make_lexicon.py: the fixed words of the grassland tongue. HG_LEX: English word -> hollow word. */' + chr(10) +
          'const HG_LEX=' + json.dumps({w: lex[w] for w in keys}, ensure_ascii=False, separators=(',', ':')) + ';' + chr(10))
    (SRC / 'hollowgrass_lex.js').write_text(js, encoding='utf-8')
    print('%d lines, %d distinct words, %d chosen' % (len(lines), len(cnt), len(lex)))

main()
