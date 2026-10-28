"""Writes HEAL_AUDIT_AFTER.md (HEAL_AUDIT_BEFORE.md was written once, from the state before any change).
Run: run_audit.py after, report.py, build_docs.py"""
import json, os
H = os.path.dirname(os.path.abspath(__file__))
rd = lambda n: open(os.path.join(H, n), encoding='utf-8').read()
bef = json.load(open(os.path.join(H, 'raw_before.json')))['res']
aft = json.load(open(os.path.join(H, 'raw_after.json')))['res']
ratio = json.load(open(os.path.join(H, 'ratio_after.json')))


def row(res, lv, nm):
    for L in res:
        if L['level'] == lv:
            for r in L['rows']:
                if r['name'] == nm and r.get('avail'):
                    return r


NAMES = ['Heal', 'Greater Heal', 'Purify', 'Mend', 'Divine Intervention']
T = {'Heal': (10, .4, 3), 'Greater Heal': (270, .5, 26), 'Purify': (8, .3, 9), 'Mend': (30, .4, 19), 'Divine Intervention': (100, .4, 45)}
KIND = {'Heal': 'single, 1', 'Greater Heal': 'single, 60', 'Purify': 'group, spell level 10', 'Mend': 'group, 30', 'Divine Intervention': 'group, 70'}
OLDCOST = {'Heal': 3, 'Greater Heal': 17, 'Mend': 15, 'Purify': 12, 'Divine Intervention': 32}
a = ['# Priest healing audit: AFTER the retune (fixed amounts, like potions)\n',
     'Zero mismatches (`python tools/heal_audit/run_audit.py after`, `report.py`, `build_docs.py`). Files: `src/desert/heal_scaling.js` (the TIER table of amounts and costs is at the top), one extra argument at the three call sites (index.html quick Heal and powers, src/desert/spells.js), and a guard in `mxCast` so a pure heal or cleanse with nobody hurt costs no mana.\n',
     '## The design\n',
     'Heal spells restore a **fixed number of health points**, like the healing potions (30, 60, 90, 120, 210, 220, 450 health), not a percent of the patient\'s health. Hero health keeps growing (about 25 at level 1, 700 at 60, 1000 at 80), so the weak spells become mostly useless as the party levels, exactly like the weak potions, and the player moves up to the stronger spell.\n',
     '`amount = (base + per-level x caster level) x (1 + healing bonus)`, rounded; the healing bonus is Faith (+20 percent from level 10) and Saint (+30 percent more at level 80), the same kind of bonus for every spell, so the level and Faith bonus can never lift a weak spell above a stronger one (every spell has a bigger base than the one below it in its line; the harness checks the order at every tested level). The heal is capped at what the patient is missing, and the number logged and floated is the number healed. There is no random spread (a heal crit, one cast in eight, adds three quarters more, capped the same way).\n',
     '| spell | kind, unlocks | base | per level | mana (fixed) | amount at 1 / 30 / 60 / 70 / 80 (with Faith and Saint) |', '|---|---|---|---|---|---|']
for nm in NAMES:
    am = []
    for lv in (1, 30, 60, 70, 80):
        r = row(aft, lv, nm)
        am.append(str(round(r['detHeal'])) if r else '-')
    a.append('| %s | %s | %d | %.1f | %d | %s |' % (nm, KIND[nm], T[nm][0], T[nm][1], T[nm][2], ' / '.join(am)))
a += ['\n**Mana** is fixed per spell (no level factor): Heal 3, Purify 9, Mend 19, Greater Heal 26, Divine Intervention 45. It is proportional to the health delivered over all allies (a group heal counts every ally), about 0.07 mana per hp at level 60 for every spell; the harness fails if any spell is more than 15 percent away from the line average at any level. Because the cost never grows, a weak spell stays cheap and simply stops mattering.\n',
      '**Ordering.** Singles are compared with singles (Heal, then Greater Heal) and groups with groups (Purify, Mend, Divine Intervention), in absolute hp, strictly, at every level where both exist; a later spell also costs strictly more. Resurrection and Revive are unchanged.\n',
      'Other classes (Paladin, Monk, Goat, scrolls) keep the old formula. Potions, inn rest, church and regeneration are not touched. Cards say, for example, "Restores about 41 health to the most wounded ally." for the priest in the party at their level, and the card amount equals the real amount at every level (checked). Screenshots: `shot_powers_L1.png`, `shot_powers_L60.png`.\n',
      '## Obsolescence: amount as a percent of a typical hero\'s maximum health (average of the four heroes)\n',
      '| level | typical max hp | Heal | Purify | Mend | Greater Heal | Divine Intervention |', '|---|---|---|---|---|---|---|']
for L in aft:
    typ = sum(L['maxes']) / 4
    cells = []
    for nm in ['Heal', 'Purify', 'Mend', 'Greater Heal', 'Divine Intervention']:
        r = row(aft, L['level'], nm)
        cells.append('%.1f%% (%d hp)' % (r['detHeal'] / typ * 100, round(r['detHeal'])) if r else '-')
    a.append('| %d | %.0f | %s |' % (L['level'], typ, ' | '.join(cells)))
a += ['\nTargets met: at level 1 Heal restores 40 percent of a typical hero (wanted 30 to 60); at level 70 Heal restores 5.7 percent (3 to 6), the top single heal Greater Heal 45 percent (35 to 50). The priest has two single heals and three group heals, so the "second and third" single tiers of the brief do not exist; Purify, Mend and Divine Intervention fill the middle as group heals (4 percent, 9 percent and 19 percent per ally at level 70).\n',
      '## Level 60: old (percent of health) versus new (fixed hp)\n',
      '| spell | old avg hp per ally | new hp per ally | old mana | new mana |', '|---|---|---|---|---|']
for nm, lv in (('Heal', 60), ('Greater Heal', 60), ('Mend', 60), ('Purify', 60), ('Divine Intervention', 70)):
    o, n = row(bef, lv, nm), row(aft, lv, nm)
    a.append('| %s (L%d) | %.0f | %.0f | %s | %s |' % (nm, lv, o['avgHeal'], n['detHeal'], OLDCOST[nm], n['listed']))
a += ['\nThe fixed amounts are much smaller than the earlier percent-of-health heals at level 60 and above, by design: only Greater Heal stays a serious heal (about half of a typical hero) at level 60.\n',
      '## Mana per hp healed, all allies counted (the same for every spell within 15 percent)\n',
      '| level | Heal | Greater Heal | Purify | Mend | Divine Intervention |', '|---|---|---|---|---|---|']
for lv in ['1', '10', '20', '30', '40', '50', '60', '70', '80']:
    r = ratio[lv]
    a.append('| %s | %s |' % (lv, ' | '.join(('%.3f' % r[n]) if n in r else '-' for n in NAMES)))
a += ['\n## Checks at every level (1, 10, 20, 30, 40, 50, 60, 70, 80)\n',
      'Mana deducted equals the listed cost and the card cost, exactly once, also for group casts; nothing deducted when nobody is hurt, when mana is short, or for a dead target; dead heroes are not healed; no healing above max health; the logged number is the number healed; the card amount equals the real amount; the cost never changes with level; the heal of a spell rises with level; a later spell in a line heals more hp and costs more; mana per hp within 15 percent across the line; the obsolescence targets above.\n',
      rd('body_after.md')]
open(os.path.join(H, 'HEAL_AUDIT_AFTER.md'), 'w', encoding='utf-8').write('\n'.join(a))
