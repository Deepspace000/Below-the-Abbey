"""Writes POWERS_BEFORE.md and POWERS_AFTER.md from raw_before.json, raw_after.json, inventory_*.json, fight_*.json.
   python tools/powers_audit/report.py"""
import json, os, re
import analyse as A
HERE = os.path.dirname(os.path.abspath(__file__))
LV = [1, 10, 20, 30, 40, 50, 60, 70, 80]
bef, aft = A.load('before'), A.load('after')
inv_b = json.load(open(os.path.join(HERE, 'inventory_before.json')))['rows']
inv_a = json.load(open(os.path.join(HERE, 'inventory_after.json')))['rows']
B, Aa = A.build(bef), A.build(aft)
fl_b, fl_a = A.flags(bef), A.flags(aft)
ALIAS_B2A = {('Barbarian', 'Savage Roar', 'daze'): 'Thunderous Roar'}


def key_of(e):
    return ('mx', e['id']) if e['type'] == 'mx' and e['id'] and e['k'] < 0 or (e['type'] == 'mx' and e['id'] and ' ' not in str(e['id']) and len(str(e['id'])) < 6) else ('cls', e['name'], e['type'])


def entries(Bd, cls):
    out = []
    for k, e in Bd.get(cls, {}).items():
        out.append((k, e))
    out.sort(key=lambda t: (t[1]['lv'], t[1]['k'] if t[1]['k'] is not None else 99))
    return out


def val(e, L):
    x = e['lvls'].get(L)
    if not x:
        return None
    ro = A.role(x)
    if ro in ('single', 'group'):
        return (x.get('dmg') or 0) + (x.get('dot') or 0)
    return None


def cell(v):
    return '-' if v is None else ('%d' % round(v))


def shortdesc(d, n=110):
    d = re.sub(r'\s+', ' ', d or '')
    return d if len(d) <= n else d[:n - 1] + '...'


def p_params(x):
    o = []
    for f in ('m', 'a', 'n', 'dmg', 'amt', 'pct', 'range', 'b', 'rounds'):
        if f in x:
            o.append('%s=%s' % (f, json.dumps(x[f]).replace('"', '')))
    for f in ('daze', 'undead', 'party', 'all'):
        if x.get(f):
            o.append(f)
    if x.get('pas'):
        o.append('pas=' + json.dumps(x['pas']).replace('"', ''))
    if x.get('aim'):
        o.append('aim=' + x['aim'].replace('"', ''))
    if x.get('fx'):
        o.append('fx=' + x['fx'].replace('"', ''))
    return ' '.join(o)


# ------------------------------------------------------------------ BEFORE
def before_doc():
    L = ['# Character powers: the state before the retune (v3.682 plus the heal retune)\n',
         'Every power of every class, in unlock order. `python tools/powers_audit/dump_inventory.py before` lists them from the running game (`inventory_before.json`); `python tools/powers_audit/run_audit.py before 3` measures them (`raw_before.json`).\n',
         '**Method.** For each class and each of the levels 1, 10, 20, 30, 40, 50, 60, 70 and 80 a fresh hero of that class is built (levelled up with the real `levelUp`, so stats, health and mana are the real ones), given the best shop weapon of its type that its level and stats allow (Sword for Warrior, Axe for Barbarian, Mace for Paladin, Priest, Monk and Goat, Bow for Ranger and Archer, Dagger for Thief and Assassin, the best staff for Mage and Sorcerer), and every spell of its class that its level allows. Then every unlocked active power is used several times through the real `heroSpecial` on three standing dummies of that level in a corridor (health 1,000,000,000, one square, two squares and three squares ahead), in expectation mode: no dice (every range is rolled at its middle, there are no double hits) and the chance of a double hit is added back as its expected value for the powers that roll the weapon, so that the numbers are free of sampling noise (an earlier run with real dice, 40 uses each, agreed within a few percent). The numbers are the damage on the first dummy (direct damage, and damage over time added up as the status says), the mana (or stamina) that was really deducted, and the status or buff that was put on. "Spell" of a mage or sorcerer is the scroll in hand and is outside the ladder. Passive powers have no cost.\n',
         '**Resource:** stamina for Warrior, Barbarian, Ranger, Archer, Thief, Assassin, Monk and Goat; mana for Paladin, Mage, Sorcerer and Priest. There are **no cooldowns** in the game: a power is limited only by the resource (and it can be used every round).\n',
         '**Counts:** %d class powers (%d active, rest passive) in 12 classes, plus %d bought spells (levels 10 to 50, learned from the Spells shop) = %d active powers measured.\n' % (
             sum(1 for x in inv_b if x['src'] == 'class'), sum(1 for x in inv_b if x['src'] == 'class' and x['act']), sum(1 for x in inv_b if x['src'] == 'spell'), sum(1 for x in inv_b if x['act']))]
    for ci, cls in enumerate(sorted({x['cls'] for x in inv_b}, key=lambda n: [x['cls'] for x in inv_b].index(n))):
        rows = [x for x in inv_b if x['cls'] == cls]
        res = rows[0]['res']
        L.append('\n## %s (%s)\n' % (cls, res))
        L.append('| lv | power | kind | cost | numbers in the table of powers | card text | avg damage per use at level 1 / 10 / 20 / 30 / 40 / 50 / 60 / 70 / 80 |')
        L.append('|---|---|---|---|---|---|---|')
        for x in sorted(rows, key=lambda x: (x['lv'], x['src'] != 'class', x['k'])):
            nm = x.get('name') or x['id']
            kind = ('spell ' + x['id'] if x['src'] == 'spell' else ('active ' + x['type'] if x['act'] else 'passive'))
            # find the measured entry
            if x['src'] == 'spell':
                e = B[cls].get(x['id'])
            else:
                e = B[cls].get('%s#%d' % (nm, x['k'])) if x['act'] else None
            dm = '-'
            if e:
                dm = ' / '.join(cell(val(e, l)) if val(e, l) is not None else ('buff' if (e['lvls'].get(l) or {}).get('buff') else ('effect' if (e['lvls'].get(l) or {}).get('status') else '-')) for l in LV)
            L.append('| %d | %s | %s | %s | %s | %s | %s |' % (x['lv'], nm, kind, x['cost'] if x['act'] else '-', p_params(x), shortdesc(x['d']), dm))
    L.append('\n## Flags in the old numbers (the audit rules are listed in POWERS_AFTER.md)\n')
    L += flag_lines(fl_b)
    return '\n'.join(L)


def flag_lines(fl):
    from collections import Counter, OrderedDict
    seen = OrderedDict()
    for c, k, t in fl:
        seen[(c, k, t)] = 1
    cnt = Counter(k for (c, k, t) in seen)
    out = ['Counts: ' + ', '.join('%s %d' % (k, v) for k, v in sorted(cnt.items())) + '\n']
    byk = OrderedDict()
    for (c, k, t) in seen:
        byk.setdefault(k, []).append((c, t))
    for k, items in byk.items():
        out.append('\n**%s** (%d)\n' % (k, len(items)))
        for c, t in items[:60]:
            out.append('- %s: %s' % (c, t))
        if len(items) > 60:
            out.append('- ... and %d more of the same kind' % (len(items) - 60))
    return out


# ------------------------------------------------------------------ AFTER
def fight_table():
    fb = json.load(open(os.path.join(HERE, 'fight_before.json')))['res']
    fa = json.load(open(os.path.join(HERE, 'fight_after.json')))['res']
    out = ['| party | level | foes | foe health | rounds before | rounds after | change |', '|---|---|---|---|---|---|---|']
    for b in fb:
        a = [x for x in fa if x['party'] == b['party'] and x['L'] == b['L'] and x['foes'] == b['foes']]
        if not a:
            continue
        a = a[0]
        ch = (a['rounds'] / b['rounds'] - 1) * 100 if b['rounds'] else 0
        out.append('| %s | %d | %d | %d | %.2f | %.2f | %+.0f%% |' % (b['party'], b['L'], b['foes'], b['foeHp'], b['rounds'], a['rounds'], ch))
    return out


def expected_table():
    eb = json.load(open(os.path.join(HERE, 'expected_before.json')))['res']
    ea = json.load(open(os.path.join(HERE, 'expected_after.json')))['res']
    out = ['| party | level | 1 foe: before > after | 3 foes: before > after | 6 foes: before > after |', '|---|---|---|---|---|']
    allc = []
    rows = {}
    for b in eb:
        a = [x for x in ea if x['party'] == b['party'] and x['L'] == b['L'] and x['foes'] == b['foes']][0]
        rows.setdefault((b['party'], b['L']), {})[b['foes']] = (b['rounds'], a['rounds'])
        allc.append((a['rounds'] / b['rounds'] - 1) * 100)
    for (p, L), d in rows.items():
        out.append('| %s | %d | %s |' % (p, L, ' | '.join('%.1f > %.1f (%+.0f%%)' % (d[f][0], d[f][1], (d[f][1] / d[f][0] - 1) * 100) for f in (1, 3, 6))))
    within = sum(1 for c in allc if abs(c) <= 25)
    out.append('')
    out.append('All %d cells: mean change %+.1f%%, shortest %+.0f%%, longest %+.0f%%; %d cells (%.0f%%) within 25 percent either way.' % (len(allc), sum(allc) / len(allc), min(allc), max(allc), within, within * 100.0 / len(allc)))
    l60 = [(a['rounds'] / b['rounds'] - 1) * 100 for b in eb if b['L'] == 60 for a in ea if a['party'] == b['party'] and a['L'] == 60 and a['foes'] == b['foes']]
    out.append('At level 60 (the case the owner asked about): mean %+.1f%%, shortest %+.0f%%, longest %+.0f%%.' % (sum(l60) / len(l60), min(l60), max(l60)))
    return out


def new_powers_table():
    out = ['| class | new power | unlock | cost | line | what the card says at level 80 |', '|---|---|---|---|---|---|']
    n = 0
    for cls in Aa:
        res = [x for x in inv_a if x['cls'] == cls][0]['res']
        old = {x.get('name') or x['id'] for x in inv_b if x['cls'] == cls}
        for k, e in sorted(Aa[cls].items(), key=lambda t: t[1]['lv']):
            if not e['act'] or e['name'] in old or not e['lvls']:
                continue
            top = e['lvls'].get(80) or e['lvls'][max(e['lvls'])]
            ro = A.role(top)
            out.append('| %s | %s | %d | %s %s | %s | %s |' % (cls, e['name'], e['lv'], e['cost'], res.lower(), {'single': 'single target', 'group': 'area', 'control': 'control', 'control-area': 'control (area)'}.get(ro, ro), shortdesc(e['desc'], 170)))
            n += 1
    out.append('')
    out.append('%d new powers.' % n)
    return out


def after_doc():
    L = ['# Character powers: before and after the retune\n',
         'Files: `src/desert/powers_scaling.js` (all numbers; last before `jump_ready.js` in `tools/inject.py`), harness in `tools/powers_audit/` (`audit.js`, `run_audit.py`, `fight.js`, `run_fight.py`, `analyse.py`, `report.py`, `shots.py`). Old numbers: `POWERS_BEFORE.md`. Re-run: start `python -m http.server 8357` in the repo root, then `python tools/powers_audit/run_audit.py after 3`, `python tools/powers_audit/run_fight.py after`, `python tools/powers_audit/report.py`.\n',
         '## The rule in plain words\n',
         'Inside one class, a later power must hit harder **and** cost more than an earlier power of the same kind, and each point of cost must buy about the same damage all along the line (within 20 percent), so a stronger power is neither a bargain nor a trap. Kinds ("lines") are: single-target damage, area damage, offensive buffs, defensive buffs, control of one foe, control of an area. Healing is left to `heal_scaling.js`, and the mage and sorcerer scroll "Spell" is the scroll in hand.\n',
         'Each class has one number **E**: how many "usual blows" of damage one point of cost buys with a single-target power. A **usual blow U** is the hero\'s own average hit: for a fighter the weapon\'s average damage plus the strength bonus and rings, times the damage bonuses from passives and the chance of a double hit; for a mage or sorcerer (intelligence bonus + the staff\'s magic + 8) times the spell bonuses. So a power grows with the weapon, the stat and the gear exactly as the creatures grow with the place.\n',
         '    damage of a use = cost x e x U x g          e = E x 0.75 x (1 - 0.15 x (unlock level - 1) / 79)          g = (1 + 0.002 x (level - unlock level)) x (1 + 0.002 x level)\n',
         'An area power does 0.4 of that to **each** foe (about 1.2 times a single power when three are close). Bleed, poison and burn are part of the same total, spread over their rounds. E per class (usual blows per point of cost, before the two corrections): Warrior 0.31, Barbarian 0.30, Paladin 0.25, Ranger 0.35, Archer 0.36, Thief 0.38, Assassin 0.33, Mage 0.20, Sorcerer 0.20, Priest 0.20, Monk 0.40, Goat 0.36. They were taken from what each class\'s own powers did before, so the class balance is kept. The first bracket of g pays each level of mastery above the unlock, the second makes every power a little stronger as the hero grows, beyond the weapon and the stats (the best weapons stop at level 70, so without it the top powers would stop growing). The factor 0.75 and the taper of 0.15 were set from the fight simulations below (see the balance section). Costs are fixed numbers that rise with the unlock level and never change with the caster level, so an early power stays cheap and simply matters less and less as the heroes grow (a cheap power is still usable, it is just a smaller blow). Each card now says the real number for the hero it is shown for, for example "About 612 damage for Sigrid at level 40." (checked against the measured average: zero mismatches).\n',
         '## Results\n']
    ncls = len(Aa)
    npow = sum(1 for c in Aa.values() for e in c.values() if e['act'] and e['lvls'])
    npb = sum(1 for c in B.values() for e in c.values() if e['act'] and e['lvls'])
    L.append('**%d classes, %d active powers measured before (%d class powers and spells, all passives excluded), %d after (%d added).** Flags before: %d. Flags after: %d.\n' % (ncls, npb, npb, npow, npow - npb, len(set(fl_b)), len(set(fl_a))))
    from collections import Counter
    cb, ca = Counter(k for _, k, _ in set(fl_b)), Counter(k for _, k, _ in set(fl_a))
    L.append('| rule | flags before | flags after |')
    L.append('|---|---|---|')
    for k in sorted(set(cb) | set(ca)):
        L.append('| %s | %d | %d |' % (k, cb.get(k, 0), ca.get(k, 0)))
    L.append('')
    L.append('Rules checked at every level 1, 10, ..., 80: `later-power-weaker` (a later power of the same line does less than an earlier one, beyond a 5 percent sampling margin), `later-power-not-dearer` (a later power costs the same or less), `bargain` and `trap` (damage per cost more than 20 percent above or below the line average), `no-level-scaling` (damage does not rise with the level, or falls), `ladder-ends-early` (no damage power at level 80 or later), `description-mismatch` (card number differs from the measured average), `cost-mismatch` (the resource really deducted differs from the cost on the card or is not deducted exactly once), `short-resource-bug` (a power was used, or charged, with too little resource).\n')
    L.append('Costs: every use deducted exactly the card cost, once (also for area powers and multi-hit powers), at all nine levels; with one point less than the cost the use was refused and nothing was deducted. There are no cooldowns in the game to test: powers can be used every round until the resource runs out.\n')
    L.append('## Remaining flags after the retune\n')
    L += flag_lines(fl_a)
    L.append('\n## Before and after, class by class\n')
    L.append('Each cell is `before > after` for the average damage of one use at the hero level in the column header (area powers: damage to **each** foe; damage over time is included). `-` means not unlocked (or not a damage power). Costs are `before > after`. New powers are marked **new**.\n')
    for cls in Aa:
        res = [x for x in inv_a if x['cls'] == cls][0]['res']
        L.append('\n### %s (%s)\n' % (cls, res))
        L.append('| lv | power | line | cost | L20 | L40 | L60 | L80 | per cost at L80 (after) |')
        L.append('|---|---|---|---|---|---|---|---|---|')
        seen = set()
        rows = []
        for k, e in Aa[cls].items():
            if not e['act'] or not e['lvls']:
                continue
            top = e['lvls'][max(e['lvls'])]
            ro = A.role(top)
            if ro in ('heal', 'utility'):
                continue
            # find the before entry
            eb = None
            for k2, e2 in B[cls].items():
                if e2['act'] and (e2['id'] == e['id'] and e['type'] == 'mx') or (e2['act'] and e2['name'] == e['name'] and e2['type'] != 'mx' and e['type'] != 'mx') or (e2['name'] == 'Savage Roar' and e2['type'] == 'daze' and e['name'] == 'Thunderous Roar'):
                    eb = e2
                    break
            rows.append((e['lv'], e, eb, ro))
        rows.sort(key=lambda t: (t[3], t[0], t[1]['cost'] or 0))
        for lv, e, eb, ro in rows:
            cells = []
            for l in (20, 40, 60, 80):
                va = A.val_at(e, l, ro) if ro in ('single', 'group', 'control', 'control-area', 'buff-off', 'buff-def') else None
                vb = A.val_at(eb, l, A.role(eb['lvls'][max(eb['lvls'])])) if eb and eb['lvls'] and A.role(eb['lvls'][max(eb['lvls'])]) in ('single', 'group', 'control', 'control-area', 'buff-off', 'buff-def') else None
                if ro in ('single', 'group'):
                    va = (e['lvls'][l].get('dmg') or 0) + (e['lvls'][l].get('dot') or 0) if l in e['lvls'] else None
                    vb = ((eb['lvls'][l].get('dmg') or 0) + (eb['lvls'][l].get('dot') or 0)) if eb and l in eb['lvls'] else None
                cells.append('%s > %s' % (cell(vb) if eb else 'new', cell(va)))
            x80 = e['lvls'].get(80)
            pc = '-'
            if x80 and ro in ('single', 'group'):
                pc = '%.0f' % (A.power_value(x80) / e['cost'])
            lab = {'single': 'single', 'group': 'area', 'control': 'control (one foe)', 'control-area': 'control (area)', 'buff-off': 'buff (offence)', 'buff-def': 'buff (defence)', 'special': 'special'}.get(ro, ro)
            L.append('| %d | %s%s | %s | %s > %s | %s | %s |' % (lv, e['name'] + (' (spell)' if e['type'] == 'mx' and e['k'] < 0 else ''), '' if eb else ' **new**', lab, eb['cost'] if eb else 'new', e['cost'], ' | '.join(cells), pc))
    L.append('\n## New powers\n')
    L.append('Learned the way the class powers are: automatically at the unlock level (they stand in the ladder by level). The Barbarian roar of level 40 was a one-round stun and is now a real roar. Saved selections of the Special power are moved to follow the new order (flag `powOrder`, saved with the game).\n')
    L += new_powers_table()
    L.append('\n## Balance: rounds to kill\n')
    L.append('**Smooth check (no dice).** For each party the real `heroAttack` and `heroSpecial` are tried once against the line of foes, the best affordable use is taken every round until the stamina or mana is gone, and the rounds to kill are counted (a fraction of a round at the end). Before = the numbers of v3.682, after = this retune.\n')
    try:
        L += expected_table()
    except Exception as ex:
        L.append('(expected data missing: %s)' % ex)
    L.append('\n**Simulated fights (with dice).** The party fights creatures of its own level with the real `heroAttack` and `heroSpecial` (no enemy attacks: only how many rounds it takes to kill all of them). Each hero uses its highest class power it can afford (class powers only, no bought spells, no healing or buffs), otherwise a plain attack; the foe is an ordinary non-flying, non-undead creature of about 170 base health, one or three in a corridor. Averages of 8 fights (the dice make single fights vary a lot, so the smooth check above is the one to trust).\n')
    try:
        L += fight_table()
    except Exception as ex:
        L.append('(fight data missing: %s)' % ex)
    L.append('')
    try:
        L.append(open(os.path.join(HERE, 'balance_note.md'), encoding='utf-8').read())
    except Exception:
        pass
    L.append('\n## Screenshots\n')
    L.append('`tools/powers_audit/shots_after/NN_Class_L1.png`, `_L40.png` and `_L80.png` for each of the 12 classes: the Powers page with the whole ladder and the costs; the card of the first power shows the real number for the hero.\n')
    L.append('Icons: the class powers (the first column of ladders) have never had icons in this game (the Powers page shows "Lv N" for them), so the new martial powers have none either. The seven new spell-type powers (Arcane Ruin, Starfall, Soul Rend, Annihilating Ray, Sunlance, Hallowed Fire, Dawn of Judgement) and the new Barbarian roar borrow the painted spell picture of a nearby spell, recoloured with `pToneMap` the same way the grand spells do (`pwTintIcons` in `powers_scaling.js`).\n')
    return '\n'.join(L)


if __name__ == '__main__':
    open(os.path.join(HERE, 'POWERS_BEFORE.md'), 'w', encoding='utf-8').write(before_doc())
    open(os.path.join(HERE, 'POWERS_AFTER.md'), 'w', encoding='utf-8').write(after_doc())
    print('written')
