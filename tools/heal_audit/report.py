"""Builds body_after.md and flags_after.txt from raw_after.json (fixed-amount heal ladder).  python tools/heal_audit/report.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'raw_after.json')))
res = D['res']
SINGLE = ['Heal', 'Greater Heal']
GROUP = ['Purify', 'Mend', 'Divine Intervention']
flags = []


def flag(lv, nm, txt):
    flags.append('L%d %s: %s' % (lv, nm, txt))


ab = lambda r: r['detHeal']
byL = {L['level']: {r['name']: r for r in L['rows'] if r.get('avail')} for L in res}
typ = {L['level']: sum(L['maxes']) / len(L['maxes']) for L in res}
costs = {}
for L in res:
    for r in L['rows']:
        if not r.get('avail'):
            continue
        lv, nm = L['level'], r['name']
        if nm == 'Revive':
            if abs(r['deadMana'] - r['listed']) > .01:
                flag(lv, nm, 'cost mismatch')
            continue
        costs.setdefault(nm, set()).add(r['listed'])
        if abs(r['mana'] - r['listed']) > .01:
            flag(lv, nm, 'cost mismatch: listed %s, deducted %.1f' % (r['listed'], r['mana']))
        if r['cardCost'] != r['listed']:
            flag(lv, nm, 'card cost differs from listed cost')
        if r['fullMana'] != 0:
            flag(lv, nm, 'mana deducted (%s) when nobody was hurt' % r['fullMana'])
        if r['lowMana'] != 0 or r['lowCast'] or r['lowHealed']:
            flag(lv, nm, 'cast with too little mana was not cleanly refused')
        if r['deadHealed']:
            flag(lv, nm, 'healed a dead hero')
        if not r['capOk']:
            flag(lv, nm, 'healing above max health')
        if r.get('capShown') is not None and r['capShown'] > r['capGain']:
            flag(lv, nm, 'overheal counted: log/float shows %s but only %s was healed' % (r['capShown'], r['capGain']))
        if nm != 'Resurrection':
            if r.get('descAmt') is None:
                flag(lv, nm, 'description states no amount ("%s")' % r['desc'][:60])
            elif abs(r['descAmt'] - ab(r)) > 1.01:
                flag(lv, nm, 'description says %s health, real heal is %.1f' % (r['descAmt'], ab(r)))
            if abs(r['avgHeal'] - ab(r)) > 1.01:
                flag(lv, nm, 'heal is not a fixed amount: average %.1f, fixed cast %.1f' % (r['avgHeal'], ab(r)))
for nm, c in costs.items():
    if len(c) > 1:
        flag(0, nm, 'mana cost changes with level: %s' % sorted(c))
ratio = {}
for lv, rows in byL.items():
    for names in (SINGLE, GROUP):
        av = [rows[n] for n in names if n in rows]
        for a, b in zip(av, av[1:]):
            if not ab(b) > ab(a):
                flag(lv, b['name'], 'does not heal more hp than %s (%.0f vs %.0f)' % (a['name'], ab(b), ab(a)))
            if not b['listed'] > a['listed']:
                flag(lv, b['name'], 'does not cost more than %s (%s vs %s)' % (a['name'], b['listed'], a['listed']))
    av = [rows[n] for n in SINGLE + GROUP if n in rows]
    rr = {r['name']: r['listed'] / (ab(r) * max(1, round(r['targets']))) for r in av}
    ratio[lv] = rr
    if len(rr) > 1:
        m = sum(rr.values()) / len(rr)
        for n, v in rr.items():
            if abs(v / m - 1) > .15:
                flag(lv, n, 'mana per hp is %.0f percent from the line average (%.4f vs %.4f)' % ((v / m - 1) * 100, v, m))
prev = {}
for L in res:
    for r in L['rows']:
        if not r.get('avail') or r['name'] in ('Revive', 'Resurrection'):
            continue
        p = prev.get(r['name'])
        if p and not ab(r) > ab(p):
            flag(L['level'], r['name'], 'heal did not rise with level (%.0f after %.0f)' % (ab(r), ab(p)))
        prev[r['name']] = r
# the obsolescence targets
h1 = byL[1]['Heal']; p1 = ab(h1) / typ[1] * 100
if not 30 <= p1 <= 60:
    flag(1, 'Heal', 'restores %.0f percent of a typical hero at level 1 (wanted 30 to 60)' % p1)
h70 = byL[70]['Heal']; p70 = ab(h70) / typ[70] * 100
if not 3 <= p70 <= 6:
    flag(70, 'Heal', 'restores %.1f percent of a typical hero at level 70 (wanted 3 to 6)' % p70)
g70 = byL[70]['Greater Heal']; q70 = ab(g70) / typ[70] * 100
if not 35 <= q70 <= 50:
    flag(70, 'Greater Heal', 'restores %.1f percent of a typical hero at level 70 (wanted 35 to 50)' % q70)
out = []
W = out.append
W('Harness: tools/heal_audit/run_audit.py (Playwright, the real heroSpecial, powerNew and mxCast), party levels 1 to 80 set through the real levelUp, priest = Wulfric. Per spell and level: casts with every ally at 1 hp (so the whole heal shows), then cap, full-health, low-mana and dead-hero tests. Heal crits are switched off in the averages (a crit adds three quarters more, one cast in eight).\n')
W('Columns: cost = mana listed on the card = mana deducted; amount = health restored per ally (with Faith and Saint); allies = how many were healed; hp per mana = total health restored divided by cost; typical max = average maximum health of the four heroes at that level; % of typical = amount divided by that. The falling percent of the weaker spells is the intended obsolescence.\n')
W('| level | spell | cost | mana | card amount | amount per ally | allies | hp per mana | typical max hp | % of typical max | cap behaviour |')
W('|---|---|---|---|---|---|---|---|---|---|---|')
for L in res:
    for r in L['rows']:
        if not r.get('avail') or r['name'] == 'Revive':
            continue
        tg = max(1, round(r['targets']))
        cap = 'never above max' if r['capOk'] else 'OVER MAX'
        if r.get('capShown') is not None:
            cap += '; shows %s, real %s' % (r['capShown'], r['capGain'])
        W('| %d | %s | %s | %.1f | %s | %.0f | %d | %.1f | %.0f | %.1f | %s |' % (L['level'], r['name'], r['listed'], r['mana'], r.get('descAmt') or 'none', ab(r), tg, ab(r) * tg / r['listed'], typ[L['level']], ab(r) / typ[L['level']] * 100, cap))
W('\nRevive (power, not a heal) costs 18 at every level, raises one fallen ally at 40 percent, takes its mana once and refuses when nobody has fallen: unchanged. Resurrection (spell) revives everyone at 70 percent and heals the living for half: unchanged.\n')
if flags:
    W('## MISMATCHES (%d)\n' % len(flags))
    for f in flags:
        W('- ' + f)
else:
    W('## MISMATCHES: none (0)\n')
open(os.path.join(HERE, 'flags_after.txt'), 'w').write('\n'.join(flags))
json.dump(ratio, open(os.path.join(HERE, 'ratio_after.json'), 'w'))
open(os.path.join(HERE, 'body_after.md'), 'w').write('\n'.join(out))
print(len(flags), 'flags')
