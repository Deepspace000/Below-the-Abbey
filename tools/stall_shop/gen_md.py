"""Writes tools/stall_shop/BINDINGS.md from the JSON files that run.py wrote.
    python tools/stall_shop/gen_md.py out1.json out2.json ...   (later files replace earlier ones for the same level)"""
import sys, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
levels = {}
for f in sys.argv[1:]:
    d = json.load(open(f))
    for r in d['results']:
        levels[r['lv']] = r

L = ['# Stall shop bindings', '',
     'Written by `tools/stall_shop/gen_md.py` from the live game (`stlTable()` in `src/desert/stall_shop.js`, run by `tools/stall_shop/run.py`).',
     'A stall here is a piece of town decor that did nothing when pressed: a market stall, tent, cart, barrow, wagon or counter that is not a person, chest, shop or door.',
     'Pressing one (click, or the use key and pad button while facing it) opens the shop page of the nearest shopkeeper within six steps on foot, ',
     'the one standing behind it first. With nobody near it shows a short line about the stall. Painted stalls of the Deeper Hollow (hgstall_*) have no decor of their own;',
     'their click area leads to their keeper. Stalls that are people or shops of their own (npc, shop, loot) keep what they do and are only counted under "kept".', '']
tot = {'levels': 0, 'stalls': 0, 'bound': 0, 'deco': 0}
L += ['## By level', '', '| Level | Name | Stalls | Bound | Decorative | Kept (own job) |', '|---|---|---|---|---|---|']
for lv in sorted(levels):
    r = levels[lv]; rows = r['rows']
    nb = sum(1 for x in rows if x['npc']); nd = len(rows) - nb
    kept = ', '.join('%s x%d' % (k, n) for k, n in sorted(r['own'].items())) or '-'
    L.append('| %d | %s | %d | %d | %d | %s |' % (lv, r['name'], len(rows), nb, nd, kept))
    tot['levels'] += 1; tot['stalls'] += len(rows); tot['bound'] += nb; tot['deco'] += nd
L += ['', 'Total: %d levels with a scan, %d stalls found, %d bound to a shopkeeper, %d decorative.' % (tot['levels'], tot['stalls'], tot['bound'], tot['deco']), '']
L += ['## Every binding', '']
for lv in sorted(levels):
    r = levels[lv]
    if not r['rows']: continue
    L += ['### Level %d, %s' % (lv, r['name']), '', '| Stall decor | Position | Shopkeeper | Id | Shop title | Steps |', '|---|---|---|---|---|---|']
    for x in sorted(r['rows'], key=lambda q: (q['y'], q['x'])):
        if x['npc']:
            L.append('| %s (%s) | %s,%s | %s | %s | %s | %s |' % (x['k'], x['kind'], x['x'], x['y'], x['who'].replace('|', '/'), x['npc'], (x['title'] or '').replace('|', '/'), x['dist']))
        else:
            L.append('| %s (%s) | %s,%s | nobody within range | - | flavour line | - |' % (x['k'], x['kind'], x['x'], x['y']))
    L.append('')
open(os.path.join(HERE, 'BINDINGS.md'), 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('written', tot)
