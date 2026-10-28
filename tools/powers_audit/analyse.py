"""Shared analysis of raw_<tag>.json: lines, order checks, flags.  Imported by report.py"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80]
TOL = 0.95  # sampling noise allowed when comparing averages (averages of 40 uses)
CASTERS = ('Mage', 'Sorcerer')
HEAL_WORDS = re.compile(r'heal|mend|restor|purify|revive|resurrect|lay on hands|divine intervention|eat anything|wholeness', re.I)
SPECIAL = ('Rift of Banishing', 'Wild Surge', 'Master Heist', 'Pickpocket', 'Turn Undead', 'Spell')
W_BUFF_OFF = {'dmgPct': 100, 'crit': 100, 'hitPct': 50}
W_BUFF_DEF = {'armor': 1, 'dodge': 40, 'regen': 2}
W_CTL = {'hold': 3, 'sleep': 2, 'fear': 2.5, 'confuse': 3, 'poly': 3.5, 'blind': 1.5, 'slow': 1.5, 'vuln': 2, 'curse': 1.5, 'stun': 1}


def load(tag):
    return json.load(open(os.path.join(HERE, 'raw_%s.json' % tag)))['res']


def U(r):
    return r['Um'] if r['cls'] in CASTERS else r['Uw']


def buff_score(s):
    off = de = 0
    for part in (s or '').split(';'):
        m = re.match(r'(\w+)\+([\d.]+)x(\d+)( party)?', part)
        if not m:
            continue
        k, a, n, party = m.group(1), float(m.group(2)), int(m.group(3)), 4 if m.group(4) else 1
        if k in W_BUFF_OFF:
            off += W_BUFF_OFF[k] * a * n * party / 100
        elif k in W_BUFF_DEF:
            de += W_BUFF_DEF[k] * a * n * party
    return off, de


def ctl_score(row):
    st = row.get('status') or ''
    sc = 0
    for part in st.split(','):
        m = re.match(r'([a-z]+)(\d+)$', part)
        if m and m.group(1) in W_CTL:
            sc += W_CTL[m.group(1)] * int(m.group(2))
        elif part == 'stun':
            sc += 1
        elif part.startswith('poly'):
            sc += 3.5 * 8
    return sc * max(1, round(row.get('tgStat') or 1)) if sc else 0


def role(row):
    n = row['name']
    if HEAL_WORDS.search(n) and row['type'] in ('heal', 'healx', 'revive', 'mx') and not row.get('dmg'):
        return 'heal'
    if n in SPECIAL:
        return 'special'
    if (row.get('dmg') or 0) > 0 or (row.get('dot') or 0) > 0:
        return 'group' if (row.get('targets') or 0) > 1.5 else 'single'
    if row.get('buff'):
        first = row['buff'].split(';')[0].split('+')[0]
        return 'buff-off' if first in W_BUFF_OFF else 'buff-def'
    if ctl_score(row) > 0:
        return 'control-area' if (row.get('tgStat') or 0) > 1.5 else 'control'
    return 'utility'


def power_value(row):
    """damage of a use on the targets hit plus damage over time, normalised to three foes for area powers"""
    per = (row.get('dmg') or 0) + (row.get('dot') or 0)
    return per * (3 if role(row) == 'group' else 1)


def build(res):
    out = {}
    for r in res:
        for x in r['rows']:
            nm = x['id'] if x.get('type') == 'mx' else '%s#%d' % (x['name'], x['k'])
            e = out.setdefault(r['cls'], {}).setdefault(nm, {'name': x['name'], 'lv': x['lv'], 'cost': x['cost'], 'act': x['act'], 'type': x['type'], 'desc': x['desc'], 'id': x['id'], 'lvls': {}, 'k': x['k']})
            e['cost'] = x['cost'] if x['cost'] is not None else e['cost']
            e['desc'] = x['desc']
            if x.get('avail') and x['act'] and 'spent' in x:
                e['lvls'][r['level']] = dict(x, U=U(r))
    return out


def lines(clsd):
    L = {}
    for key, e in clsd.items():
        if not e['act'] or not e['lvls']:
            continue
        top = e['lvls'][max(e['lvls'])]
        ro = role(top)
        if ro in ('heal', 'utility'):
            continue
        L.setdefault(ro, []).append((key, e))
    for ro in L:
        L[ro].sort(key=lambda t: (t[1]['lv'], t[1]['cost'] or 0))
    return L


def val_at(e, lv, ro):
    x = e['lvls'].get(lv)
    if not x:
        return None
    if ro in ('single', 'group'):
        return power_value(x)
    if ro == 'buff-off':
        return buff_score(x['buff'])[0]
    if ro == 'buff-def':
        return buff_score(x['buff'])[1]
    if ro in ('control', 'control-area'):
        return ctl_score(x)
    return None


def flags(res, tol=.2):
    A = build(res)
    F = []
    for cls, clsd in A.items():
        acts = [e for e in clsd.values() if e['act'] and e['lvls'] and role(e['lvls'][max(e['lvls'])]) in ('single', 'group', 'special')]
        mx = max([e['lv'] for e in acts] or [0])
        if mx < 80:
            F.append((cls, 'ladder-ends-early', 'last damage power unlocks at level %d (the game goes to level 87)' % mx))
        for ro, items in lines(clsd).items():
            if ro == 'special':
                continue
            for i in range(1, len(items)):
                (ka, a), (kb, b) = items[i - 1], items[i]
                for lv in LEVELS:
                    va, vb = val_at(a, lv, ro), val_at(b, lv, ro)
                    if va is None or vb is None:
                        continue
                    if vb < va * TOL:
                        F.append((cls, 'later-power-weaker', '%s line: %s (lv%d) is %.0f at level %d, earlier %s (lv%d) is %.0f' % (ro, b['name'], b['lv'], vb, lv, a['name'], a['lv'], va)))
                        break
                if (b['cost'] or 0) <= (a['cost'] or 0):
                    F.append((cls, 'later-power-not-dearer', '%s line: %s (lv%d) costs %s, earlier %s (lv%d) costs %s' % (ro, b['name'], b['lv'], b['cost'], a['name'], a['lv'], a['cost'])))
            if ro in ('single', 'group'):
                for lv in LEVELS:
                    effs = []
                    for k, e in items:
                        v = val_at(e, lv, ro)
                        if v is not None and e['cost']:
                            effs.append((e, v / e['cost']))
                    if len(effs) >= 2:
                        avg = sum(f for _, f in effs) / len(effs)
                        for e, f in effs:
                            if abs(f / avg - 1) > tol:
                                F.append((cls, 'bargain' if f > avg else 'trap', '%s line at level %d: %s does %.1f per cost, line average %.1f (%+.0f%%)' % (ro, lv, e['name'], f, avg, (f / avg - 1) * 100)))
        for key, e in clsd.items():
            if not e['act'] or not e['lvls']:
                continue
            ro = role(e['lvls'][max(e['lvls'])])
            if ro not in ('single', 'group'):
                continue
            ls = sorted(e['lvls'])
            vs = [val_at(e, l, ro) for l in ls]
            if len(ls) >= 2 and (vs[-1] < vs[0] * 1.02 or any(vs[i + 1] < vs[i] * 0.94 for i in range(len(vs) - 1))):
                F.append((cls, 'no-level-scaling', '%s: %.0f at level %d, %.0f at level %d' % (e['name'], vs[0], ls[0], vs[-1], ls[-1])))
        for key, e in clsd.items():
            if not e['act'] or not e['lvls']:
                continue
            x = e['lvls'][max(e['lvls'])]
            d = e['desc']
            per = (x.get('dmg') or 0) + (x.get('dot') or 0)
            m = re.search(r'About (\d+) damage', d)
            direct = x.get('dmg') or 0
            if m and abs(int(m.group(1)) - direct) > max(10, direct * .15):
                F.append((cls, 'description-mismatch', '%s card says about %s damage, real average %.0f' % (e['name'], m.group(1), direct)))
            m = re.search(r'about (\d+) more over', d, re.I)
            if m and abs(int(m.group(1)) - (x.get('dot') or 0)) > max(10, (x.get('dot') or 0) * .2):
                F.append((cls, 'description-mismatch', '%s card says about %s more over time, real %.0f' % (e['name'], m.group(1), x.get('dot') or 0)))
            m = re.search(r'(\d+)\s*-\s*(\d+) damage', d)
            if m and per:
                lo, hi = int(m.group(1)), int(m.group(2))
                if per < lo * 0.5 or per > hi * 2:
                    F.append((cls, 'description-mismatch', '%s card says %d-%d damage, real average %.0f at level %d' % (e['name'], lo, hi, per, max(e['lvls']))))
            if x.get('spent') is not None and e['cost'] is not None and abs(x['spent'] - e['cost']) > .01 and e['cost'] > 0 and role(x) != 'heal':
                F.append((cls, 'cost-mismatch', '%s card cost %s, real cost deducted %.2f' % (e['name'], e['cost'], x['spent'])))
            if x.get('lowOk') or x.get('lowSpent'):
                F.append((cls, 'short-resource-bug', '%s was used or charged with too little resource' % e['name']))
    return F


if __name__ == '__main__':
    import sys
    from collections import Counter
    f = flags(load(sys.argv[1]))
    print(Counter(k for _, k, _ in f))
    seen = set()
    for c, k, t in f:
        if (c, k, t) in seen:
            continue
        seen.add((c, k, t))
        print(c, k, t)
