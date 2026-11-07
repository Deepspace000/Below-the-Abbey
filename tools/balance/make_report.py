"""Builds the balance report PDF from the JSON files the harness (harness.js) posted to a receiver folder.
Usage: python tools/balance/make_report.py <folder with matrix.json bot.json kills.json xp.json pace.json economy.json gear.json> <out.pdf>
No em dashes anywhere."""
import json, sys, os, statistics
from collections import defaultdict
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.graphics.shapes import Drawing, String, Line
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics.charts.legends import Legend

D, OUT = sys.argv[1], sys.argv[2]
L = lambda n: json.load(open(os.path.join(D, n + '.json')))
M, BOT, K, XP, PACE, ECO, GEAR = L('matrix')['rows'], L('bot'), L('kills'), L('xp'), L('pace'), L('economy'), L('gear')
MODES = [('', 'Best gear'), ('w', 'Weaker party'), ('r', 'Real party')]
ss = getSampleStyleSheet()
H1 = ParagraphStyle('h1', parent=ss['Heading1'], fontSize=17, spaceAfter=6, textColor=colors.HexColor('#2a1c0a'))
H2 = ParagraphStyle('h2', parent=ss['Heading2'], fontSize=12.5, spaceBefore=8, spaceAfter=4, textColor=colors.HexColor('#5a3a10'))
P = ParagraphStyle('p', parent=ss['BodyText'], fontSize=9, leading=12)
SM = ParagraphStyle('sm', parent=P, fontSize=7.5, leading=9.5)
BL = ParagraphStyle('bl', parent=P, leftIndent=10, bulletIndent=0)
def bullets(items): return [Paragraph(t, BL, bulletText='•') for t in items]
def tbl(data, widths=None, fs=7, head=True, zebra=True, extra=None):
    t = Table(data, colWidths=widths, repeatRows=1 if head else 0)
    st = [('FONTSIZE', (0, 0), (-1, -1), fs), ('LEADING', (0, 0), (-1, -1), fs + 1.5), ('GRID', (0, 0), (-1, -1), .25, colors.HexColor('#b8a888')),
          ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('TOPPADDING', (0, 0), (-1, -1), 1.2), ('BOTTOMPADDING', (0, 0), (-1, -1), 1.2)]
    if head: st += [('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#d8c88e')), ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold')]
    if zebra:
        for i in range(1, len(data)):
            if i % 2 == 0: st.append(('BACKGROUND', (0, i), (-1, i), colors.HexColor('#f6f0e0')))
    t.setStyle(TableStyle(st + (extra or [])))
    return t
def fmt(n):
    n = float(n)
    if abs(n) >= 1e6: return '%.2fM' % (n / 1e6)
    if abs(n) >= 1e4: return '%.0fk' % (n / 1e3)
    return '%d' % round(n)
def winc(w): return colors.HexColor('#7fc97f') if w >= .98 else colors.HexColor('#e6e27a') if w >= .9 else colors.HexColor('#f4b06a') if w >= .7 else colors.HexColor('#e86a5a')

def chart(series, title, xl, yl, w=480, h=170, ymax=None, ymin=None, names=None):
    d = Drawing(w, h + 30)
    lp = LinePlot(); lp.x = 40; lp.y = 28; lp.width = w - 60; lp.height = h - 20
    lp.data = series
    cols = ['#2a7a2a', '#c07a10', '#b02a2a', '#3a5fb0', '#808080']
    for i in range(len(series)):
        lp.lines[i].strokeColor = colors.HexColor(cols[i % 5]); lp.lines[i].strokeWidth = 1.2
    if ymax is not None: lp.yValueAxis.valueMax = ymax
    if ymin is not None: lp.yValueAxis.valueMin = ymin
    lp.xValueAxis.labels.fontSize = 6.5; lp.yValueAxis.labels.fontSize = 6.5
    d.add(lp); d.add(String(w / 2, h + 15, title, fontSize=9, textAnchor='middle', fontName='Helvetica-Bold'))
    d.add(String(w / 2, 3, xl, fontSize=7, textAnchor='middle')); d.add(String(6, h / 2 + 10, yl, fontSize=7, textAnchor='middle'))
    if names:
        lg = Legend(); lg.x = w - 150; lg.y = h + 8; lg.fontSize = 6.5; lg.alignment = 'right'; lg.columnMaximum = 5
        lg.colorNamePairs = [(colors.HexColor(cols[i % 5]), n) for i, n in enumerate(names)]; d.add(lg)
    return d

# ------------------------------------------------------------ data crunching
ratings = sorted({x['r'] for x in M})
by = defaultdict(dict)
for x in M: by[(x['m'], x['r'])][x['d']] = x
areas_at = defaultdict(set)
for b in BOT: areas_at[b['r']].add(b['name'])
OFFS = [-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10]
def meanby(mode, d, key):
    v = [by[(mode, r)][d][key] for r in ratings if d in by[(mode, r)]]
    return sum(v) / len(v) if v else 0
spikes = {m: [r for r in ratings if 0 in by[(m, r)] and by[(m, r)][0]['win'] < .9] for m, _ in MODES}
miss = [r for r in range(1, 121) if r not in ratings]
# runs of missing ratings of 4 or more
runs, cur = [], []
for r in range(1, 121):
    if r in ratings:
        if len(cur) >= 3: runs.append((cur[0], cur[-1]))
        cur = []
    else: cur.append(r)
if len(cur) >= 3: runs.append((cur[0], cur[-1]))
XR, XQ = XP['rowsNoQ'], XP['rows']
def lvl_at(rows, r):
    c = [x for x in rows if x['r'] <= r]; return c[-1]['levelEnd'] if c else 1
first_over = next((x['r'] for x in XR if x['levelEnd'] >= 111), None)
cum_hours = []; s = 0
for p in PACE: s += p['hours']; cum_hours.append((p['L'], s))
hrs_to = lambda lv: next((h for l, h in cum_hours if l >= lv), cum_hours[-1][1])
gold_total = XQ[-1]['cumGold']
gh_late = (lambda rows: sum(p['goldHour'] * p['hours'] for p in rows) / max(1e-9, sum(p['hours'] for p in rows)))([p for p in PACE if 60 <= p['L'] <= 110])
BOSS = [r for r in K if r['boss']]; ORD = [r for r in K if not r['boss']]
oneshot = sorted([r for r in BOSS if r['hitsToKillAvg'] < 2], key=lambda r: r['hitsToKillAvg'])
slog_b = sorted([r for r in BOSS if r['hitsToKill'] > 100], key=lambda r: -r['hitsToKill'])
dominated = {g: v['dead'] for g, v in GEAR.items()}

# ------------------------------------------------------------ the document
doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=14 * mm, rightMargin=14 * mm, topMargin=14 * mm, bottomMargin=14 * mm,
                        title='Below the Abbey: balance report', author='Claude')
S = []
wipe = defaultdict(float)
for b in BOT:
    if b['m'] in ('w', 'r'): wipe[(b['name'], b['r'])] += b.get('wipes', 0)
hard = sorted([(w, n, r) for (n, r), w in wipe.items() if w > 0], reverse=True)[:7]
band = lambda lo, hi: [x['levelEnd'] - x['r'] for x in XR if lo <= x['r'] <= hi and x['r'] >= 25]
meanlead = lambda lo, hi: (sum(band(lo, hi)) / len(band(lo, hi))) if band(lo, hi) else 0
gaps = {g: [x for x in v['gapsShop'] if x[0] < 110] for g, v in GEAR.items()}
gaps = {g: v for g, v in gaps.items() if v}
S += [Paragraph('Below the Abbey: game balance report', H1),
      Paragraph('Automated checks of difficulty, levelling, economy and gear, run on the current build (version 3.871). Everything here comes from the game\'s own formulas '
                '(enemyStat, enemyHitC, the shop and gear tables, the experience and gold rules), run by a script in the game page. Numbers are model results, not play tests.', P), Spacer(1, 4)]
S += [Paragraph('1. Findings in short', H2)]
f = []
f.append('<b>Difficulty by gear.</b> A best-gear party wins %d%% of ordinary fights on level (%d%% 10 levels below, losing about %d%% of its health on level); the real party wins %d%% on level and %d%% 10 levels below; the weaker party %d%% and %d%%. '
         'So top gear stays strong, and average gear now meets a real challenge, with a clear fall-off below level. Areas where the real party still wins under 90%% on level: ratings %s.'
         % (round(100 * meanby('', 0, 'win')), round(100 * meanby('', -10, 'win')), round(100 * meanby('', 0, 'hp')), round(100 * meanby('r', 0, 'win')), round(100 * meanby('r', -10, 'win')),
            round(100 * meanby('w', 0, 'win')), round(100 * meanby('w', -10, 'win')), ', '.join(str(r) for r in spikes['r'])))
f.append('<b>Hard spots (bot clears).</b> The most wipes by the weaker and real bot parties: %s. See section 4.' % '; '.join('%s (rating %s)' % (n, r) for w, n, r in hard))
f.append('<b>Experience.</b> Clearing every creature once in rating order, with the XP gate of 3.870, the party ends each area about %.1f levels above its rating at ratings 25 to 60, %.1f at 61 to 90 and %.1f at 91 and up (before the gate it ran 20 or more levels ahead in the middle game), and is level %d once rating 111 is done. '
         'Areas rated well above their neighbours (the Deeper Hollow, the Blighted Lands) still let the party rise through the whole gap. Section 6.' % (meanlead(25, 60), meanlead(61, 90), meanlead(91, 120), lvl_at(XR, 111)))
f.append('<b>Economy.</b> A full clear of every area earns about %s gold including quests. The three houses cost 1.55M and the six super weapons 600k, together 2.15M, %s the whole story pays. '
         'One Large Mansion (1M) is about %d%% of all the gold in the game. The best full gear set of a level-110 party costs about 322k. Tempering gear at the Last Smith (3.871) adds a sink of about 0.8M per top weapon. Section 7.' % (fmt(gold_total), 'more than' if 2150000>gold_total else 'less than', round(100000000/gold_total)))
f.append('<b>Gear ladder.</b> %s Many items are still beaten by something two levels earlier (Sword %d of %d, Helm %d, Chest %d, Ring %d). Section 8.'
         % ('Weapons now improve every 4 levels up to 110 (past 110 there is nothing to buy, as before), armour sets arrive every 5 levels, and shields reach level 110. Whole numbers of armour limit the small slots, so a better arms, legs or shield piece shows up only about every 10 levels; stretches of 10 or more levels with no better piece: ' + '; '.join('%s %s' % (g.replace('weapon:', ''), ', '.join('%d to %d' % tuple(x) for x in v[:4])) for g, v in gaps.items()) + '.' if gaps else 'No group has a stretch of 10 levels or more without a shop upgrade.',
            dominated['weapon:Sword'], GEAR['weapon:Sword']['count'], dominated['head'], dominated['chest'], dominated['ring']))
f.append('<b>Fight length.</b> An ordinary creature takes about %.0f hits (one hero attacking) at levels under 20 and about %.0f at level 100 and above. No ordinary creature takes more than 20 hits or fewer than 2. '
         '%d bosses can kill an average hero in under 2 of their own hits, the worst being %s (the Pale King was changed in 3.871 to 400 to 600 a hit, from 3,600 to 5,500). Section 5.'
         % (statistics.median([r['hitsToKill'] for r in ORD if r['lv'] < 20]), statistics.median([r['hitsToKill'] for r in ORD if r['lv'] >= 100]), len(oneshot), ', '.join('%s (%.1f)' % (r['name'], r['hitsToKillAvg']) for r in oneshot[:4])))
f.append('<b>Coverage.</b> %d of the 120 ratings have creatures. The longest stretches with none: %s. Eight optional quest dungeons (3.871) now stand at ratings 22, 52, 54, 92, 94, 96 and 98; ratings 112 and up are the Pale Tower boss rooms and the Pale King.'
         % (len(ratings), ', '.join('%d to %d' % r for r in runs[:8])))
f.append('<b>Changes since the first report</b> (3.870 and 3.871): weapon ladder filled (36 daggers and wands, swords, bows, axes and maces, 51 new armour pieces and shields); ordinary creature damage fitted area by area from level 30; the XP gate; armour sets every 5 levels; tempering; the Pale King; the Ramparts pictures; eight new dungeons.')
S += bullets(f)
S += [Paragraph('2. Method, and what it cannot tell you', H2)]
S += bullets([
    '<b>Areas.</b> Every level in the game was loaded and its creature list read (652 levels, 194 with creatures, 65 distinct ratings). A creature stands at its area\'s rating, an ordinary one 1 below, at or 1 above; bosses and great creatures are never moved.',
    '<b>Parties.</b> Built with the same code as the Testing menu: Warrior, Thief, Mage, Priest at level P. "Best gear" has the best shop gear of the level; "Weaker" has an average weapon; "Real" has cheap and ok pieces, only two good ones, back line cheap.',
    '<b>Fight model.</b> Four heroes against 3 creatures. Heroes use their special power or spell while they have mana, else a plain attack on the front creature; a hero under 35% health drinks a potion; the Priest heals the most hurt ally under 60% while mana lasts. '
    'Creatures strike once a round, the two front heroes drawn three times as often. Hit chances, damage, health, armour and dodge come from the game\'s own functions.',
    '<b>Not modelled.</b> Boss special moves, status effects, fleeing, terrain, ranged positioning, item drops and selling, healing from food and rest in mid-fight, and the exact effects of the many special powers (unknown power types count as 1.5 plain attacks). '
    'The Priest heal here is strong (about 64% of a hero\'s health for 3 mana at level 60), so Priest-light parties are harder than shown. Treat results as relative: a flat curve or a spike is meaningful, the exact percentage is not.',
    '<b>Time.</b> Assumed 5 seconds per fighting round and 25 seconds per fight for walking and menus. Change <i>SEC_ROUND</i> and <i>SEC_FIGHT</i> in tools/balance/harness.js and re-run to see other speeds.',
    '<b>Quests.</b> Quest rewards are placed on the rating of their area. Quests whose area name does not give a level were placed by hand (Khemetra 40, Wandering Monsters 50, Western Kingdoms 80, Deeper Hollow 72, Blighted Lands 90, Pale Lands 100 to 110, Abbey Depths 70). This affects only the "with quests" curves.',
    '<b>Samples.</b> Win-rate matrix: 300 fights per cell. Bot: 10 full runs of every area per party. Re-run any time with tools/balance/harness.js, then tools/balance/make_report.py.'])
S += [PageBreak(), Paragraph('3. Win-rate matrix', H2),
      Paragraph('Each cell is the win rate of a party at rating plus the column offset against 3 creatures of that rating. Green 98%+, yellow 90 to 98, orange 70 to 90, red under 70. '
                'A healthy game shows a smooth fade from green (over-levelled) to red (far under-levelled), the same at every rating. Instead the best-gear party is green almost everywhere, and the weaker and real parties fall off sharply in a few rows.', P), Spacer(1, 3)]
ser = [];
for mm_, nm in MODES: ser.append([(d, 100 * meanby(mm_, d, 'win')) for d in OFFS])
S.append(chart(ser, 'Average win rate by party level relative to the area (all ratings)', 'party level minus area rating', 'win %', ymin=0, ymax=100, names=[n for _, n in MODES]))
ser = []
for mm_, nm in MODES: ser.append([(d, 100 * meanby(mm_, d, 'hp')) for d in OFFS])
S.append(chart(ser, 'Average health lost per fight', 'party level minus area rating', 'health lost %', ymin=0, ymax=100, names=[n for _, n in MODES]))
for mm_, nm in MODES:
    data = [['Rating'] + ['%+d' % d for d in OFFS] + ['Areas (first)']]
    ex = []
    for i, r in enumerate(ratings, 1):
        row = [str(r)]
        for j, d in enumerate(OFFS, 1):
            c = by[(mm_, r)].get(d)
            row.append('%d' % round(100 * c['win']) if c else '')
            if c: ex.append(('BACKGROUND', (j, i), (j, i), winc(c['win'])))
        row.append(', '.join(sorted(areas_at.get(r, []))[:1])[:34])
        data.append(row)
    S += [PageBreak(), Paragraph('Win rate (%%) matrix: %s' % nm, H2), tbl(data, [30] + [24] * 11 + [140], fs=6.4, zebra=False, extra=ex)]
# bot
S += [PageBreak(), Paragraph('4. Autoplay bot: clearing every area', H2),
      Paragraph('A party of level P clears every area with rating from P-2 to P+2, fighting its creatures in groups of up to 3, bosses last. It rests (full health, potions restocked) when average health is under half or someone is down; a wipe costs a retry (3 tries per group, then the area is "failed"). '
                'Totals per party level are summed over the areas of that band; the hours column uses the assumed speed.', P), Spacer(1, 3)]
agg = defaultdict(lambda: defaultdict(float)); cnt = defaultdict(int)
for b in BOT:
    a = agg[(b['m'], b['P'])]; cnt[(b['m'], b['P'])] += 1
    for k in ('wipes', 'fallen', 'pots', 'rests', 'hours', 'fails', 'enemies', 'fights', 'rounds', 'xp'): a[k] += b[k]
for mm_, nm in MODES:
    data = [['Party lvl', 'Areas', 'Creatures', 'Fights', 'Wipes', 'Heroes fallen', 'Potions', 'Rests', 'Failed groups', 'Hours', 'XP gained']]
    ex = []
    for P_ in range(5, 116, 5):
        if (mm_, P_) not in agg: continue
        a = agg[(mm_, P_)]
        data.append([P_, cnt[(mm_, P_)], int(a['enemies']), int(a['fights']), '%.1f' % a['wipes'], '%.0f' % a['fallen'], '%.0f' % a['pots'], '%.0f' % a['rests'], '%.1f' % a['fails'], '%.1f' % a['hours'], fmt(a['xp'])])
        if a['wipes'] >= 5: ex.append(('BACKGROUND', (4, len(data) - 1), (4, len(data) - 1), colors.HexColor('#f4b06a')))
        if a['fails'] >= 1: ex.append(('BACKGROUND', (8, len(data) - 1), (8, len(data) - 1), colors.HexColor('#e86a5a')))
    S += [Paragraph('Bot, %s' % nm, H2), tbl(data, [38, 32, 44, 36, 36, 52, 40, 34, 52, 36, 50], fs=7, extra=ex)]
S += [Paragraph('Areas with wipes (any party), worst first', H2)]
bad = [b for b in BOT if b['wipes'] >= 1]; bad.sort(key=lambda b: -b['wipes'])
data = [['Party', 'Lvl', 'Area', 'Rating', 'Wipes', 'Failed', 'Fallen', 'Potions', 'Hours']]
for b in bad[:60]: data.append([dict(MODES)[b['m']], b['P'], b['name'][:34], b['r'], '%.1f' % b['wipes'], '%.1f' % b['fails'], '%.1f' % b['fallen'], '%.0f' % b['pots'], '%.2f' % b['hours']])
S.append(tbl(data, [58, 24, 160, 34, 34, 34, 36, 38, 34], fs=6.8))

# kills
S += [PageBreak(), Paragraph('5. Damage-to-kill: how many hits each creature takes, and how many it needs', H2),
      Paragraph('For every creature at the level it appears, against the best-gear party of that level. "Hits to kill" is one hero attacking (average of the four heroes, accounting for hit chance and crits); "rounds" is all four attacking. '
                '"Hits to kill a hero" is the creature\'s own hits (with its hit chance) to bring down an average hero (front fighters weighted 3 to 1) and the front Warrior. Under 2 hits to kill a hero is deadly; over 20 hits to kill the creature is a slog.', P), Spacer(1, 3)]
data = [['Level band', 'Creatures', 'Median hits to kill', 'Median rounds', 'Median hits to kill a hero', 'Under 3 (deadly)']]
for lo in range(0, 121, 20):
    b = [r for r in ORD if lo <= r['lv'] < lo + 20]
    if b: data.append(['%d-%d' % (lo, lo + 19), len(b), '%.1f' % statistics.median([r['hitsToKill'] for r in b]), '%.1f' % statistics.median([r['roundsToKill'] for r in b]),
                       '%.1f' % statistics.median([r['hitsToKillAvg'] for r in b]), sum(1 for r in b if r['hitsToKillAvg'] < 3)])
S += [Paragraph('Ordinary creatures by level band', H2), tbl(data, [60, 60, 90, 80, 110, 80], fs=7.5)]
S += [Paragraph('Bosses and great creatures (all)', H2)]
data = [['Creature', 'Lvl', 'Health', 'Damage', 'Hits to kill', 'Rounds', 'Hits to kill hero', 'Hits to kill Warrior', 'Flag']]
ex = []
for r in sorted(BOSS, key=lambda r: r['lv']):
    fl = 'one-shots' if r['hitsToKillAvg'] < 2 else ('slog' if r['hitsToKill'] > 100 else '')
    data.append([r['name'][:30], r['lv'], fmt(r['hp']), '%d-%d' % tuple(r['dmg']), '%.0f' % r['hitsToKill'], '%.1f' % r['roundsToKill'], '%.1f' % r['hitsToKillAvg'], '%.1f' % r['hitsToKillFront'], fl])
    if fl == 'one-shots': ex.append(('BACKGROUND', (6, len(data) - 1), (8, len(data) - 1), colors.HexColor('#f4b06a')))
    if fl == 'slog': ex.append(('BACKGROUND', (4, len(data) - 1), (4, len(data) - 1), colors.HexColor('#e6e27a')))
S.append(tbl(data, [118, 24, 38, 56, 40, 36, 52, 62, 48], fs=6.8, extra=ex))
S += [Paragraph('Ordinary creatures: the quickest and the toughest to kill, and the deadliest', H2)]
data = [['Creature', 'Lvl', 'Hits to kill', 'Rounds', 'Hits to kill a hero']]
for r in sorted(ORD, key=lambda r: r['hitsToKill'])[:10] + sorted(ORD, key=lambda r: -r['hitsToKill'])[:10] + sorted(ORD, key=lambda r: r['hitsToKillAvg'])[:10]:
    data.append([r['name'][:34], r['lv'], '%.1f' % r['hitsToKill'], '%.1f' % r['roundsToKill'], '%.1f' % r['hitsToKillAvg']])
S.append(tbl(data, [150, 30, 70, 60, 90], fs=7))

# xp
S += [PageBreak(), Paragraph('6. Experience pacing', H2),
      Paragraph('Two views. <b>Full clear:</b> the best-gear party kills every creature of every area once, in rating order, with the game\'s XP rule (6% less per level the creature is below the party, 6% more above, at most 50% more) and level cost 15 x L x (L+1). '
                '<b>Steady play:</b> a party of level L fights the nearest area of rating about L; kills per level and hours per level at the assumed speed.', P), Spacer(1, 3)]
S.append(chart([[(x['r'], x['levelEnd']) for x in XR], [(x['r'], x['levelEnd']) for x in XQ], [(r, r) for r in range(0, 121, 5)]],
               'Party level after a full clear of each rating', 'area rating', 'party level', ymin=0, names=['monsters only', 'with quests', 'level = rating']))
S.append(chart([[(p['L'], p['xpKill']) for p in PACE if p['L'] <= 120]], 'XP per kill by party level (nearest area)', 'party level', 'XP per kill', ymin=0))
S.append(chart([[(p['L'], p['hours']) for p in PACE if p['L'] <= 120]], 'Hours to gain one level (assumed 5 s per round, 25 s per fight)', 'party level', 'hours', ymin=0))
data = [['Lvl', 'Nearest rating', 'XP / kill', 'Gold / kill', 'Rounds / kill', 'Kills to level', 'Hours to level', 'Total hours']]
ex = []; tot = 0
for p in PACE:
    tot += p['hours']
    if p['L'] % 2 == 1 or p['L'] <= 10 or p['L'] >= 118:
        data.append([p['L'], p['rs'], fmt(p['xpKill']), fmt(p['goldKill']), '%.1f' % p['rpk'], '%.0f' % p['kills'], '%.2f' % p['hours'], '%.1f' % tot])
        if p['gap'] >= 4: ex.append(('BACKGROUND', (1, len(data) - 1), (1, len(data) - 1), colors.HexColor('#f4b06a')))
        if p['hours'] > .3: ex.append(('BACKGROUND', (6, len(data) - 1), (6, len(data) - 1), colors.HexColor('#e6e27a')))
S += [Paragraph('Steady play, every second level (orange: nearest area is 4+ ratings away; yellow: over 0.3 hours per level)', H2), tbl(data, [30, 62, 50, 50, 56, 56, 60, 56], fs=6.6, extra=ex)]
data = [['Rating', 'Kills', 'Monster XP', 'Quest XP', 'Level start', 'Level end', 'Monster gold', 'Chest gold', 'Quest gold', 'Gold so far']]
for x in XQ: data.append([x['r'], x['kills'], fmt(x['xpMonsters']), fmt(x['questXP']), x['levelStart'], x['levelEnd'], fmt(x['goldMonsters']), fmt(x['chest']), fmt(x['questGold']), fmt(x['cumGold'])])
S += [PageBreak(), Paragraph('Full clear, by rating (with quests)', H2), tbl(data, [32, 30, 54, 50, 40, 40, 52, 46, 48, 54], fs=6.6)]

# economy
S += [PageBreak(), Paragraph('7. Economy', H2),
      Paragraph('Gold comes from creature drops (the game\'s own rules, expected value), chest gold lying in the areas, and quest rewards. Item drops and selling items are not counted, so real income is somewhat higher. '
                'Costs are the real prices in the game tables.', P), Spacer(1, 3)]
gear = {r['P']: r['gearSet'] for r in ECO['rows']}
S.append(chart([[(x['r'], x['cumGold']) for x in XQ], [(p['P'], p['gearSet']) for p in ECO['rows']]], 'Gold earned in a full clear (cumulative) against the price of a full best-gear set', 'area rating / party level', 'gold',
               ymin=0, names=['gold earned so far', 'full gear set for 4 heroes']))
data = [['Purchase', 'Price', 'Share of all gold in a full clear', 'Hours of steady play at late-game income']]
late = gh_late
items = [('Small House', ECO['houses'][0]['price']), ('Medium House', ECO['houses'][1]['price']), ('Large Mansion', ECO['houses'][2]['price']),
         ('One super weapon', 100000), ('All six super weapons', 600000), ('Best gear set, party level 50', gear.get(50, 0)), ('Best gear set, party level 80', gear.get(80, 0)), ('Best gear set, party level 110', gear.get(110, 0)),
         ('Top potion', ECO['rows'][-1]['potTop'])]
for n, p in items: data.append([n, fmt(p), '%.0f%%' % (100 * p / gold_total), '%.1f' % (p / late) if late else ''])
S += [tbl(data, [150, 60, 150, 170], fs=7.5), Spacer(1, 3),
      Paragraph('Late-game income while levelling (levels 60 to 110, weighted by time) is about %s gold per hour in this model. The figure swings a lot by area (some late creatures drop nothing; a few pay big), which is itself a flag: '
                'gold per hour at the assumed speed is %s at level 49, %s at 65, %s at 81 and %s at 105.'
                % (fmt(late), *[fmt(next(p['goldHour'] for p in PACE if p['L'] == l)) for l in (49, 65, 81, 105)]), P)]
data = [['Party lvl', 'Full gear set (4 heroes)', 'Top weapon price in last 10 levels', 'Median weapon price', 'Gold so far (full clear, at that rating)']]
for r in ECO['rows']:
    if r['P'] % 10 == 0 or r['P'] in (5, 15):
        cg = [x['cumGold'] for x in XQ if x['r'] <= r['P']]
        wp = next((w for w in ECO['weaponPrice'] if w['P'] == r['P']), None)
        data.append([r['P'], fmt(r['gearSet']), fmt(wp['max']) if wp else '', fmt(wp['med']) if wp else '', fmt(cg[-1]) if cg else '0'])
S += [Paragraph('Gear price against gold on hand', H2), tbl(data, [50, 110, 130, 100, 130], fs=7.5)]
S += [Paragraph('The six super weapons (level 120, 100,000 each) and the most expensive weapons', H2)]
data = [['Weapon', 'Level', 'Price', 'Rare drop?']]
for w in ECO['topw']: data.append([w['n'], w['lvl'], fmt(w['price']), 'yes' if w['rar'] else 'no'])
S.append(tbl(data, [200, 40, 70, 70], fs=7))

# gear
S += [PageBreak(), Paragraph('8. Gear ladder', H2),
      Paragraph('Items are grouped by slot (weapons by type). Power is average damage (with double-hit and accuracy) for weapons, armour plus health bonus for armour. "Shop" means not rare, not a set or quest reward. '
                '<b>Dead ends</b> are items beaten by an item two or more levels earlier. <b>Gaps</b> are stretches of 10 or more levels where no shop upgrade appears (levels shown are the item level, from its level field or its price).', P), Spacer(1, 3)]
data = [['Group', 'Items', 'Shop', 'Item levels', 'Dead ends', 'Gaps with no shop upgrade (10+ levels)']]
for g, v in GEAR.items():
    data.append([g.replace('weapon:', ''), v['count'], v['shop'], '%d-%d' % (v['minL'], v['maxL']), v['dead'], ', '.join('%d-%d' % tuple(x) for x in v['gapsShop'][:6]) or 'none'])
S.append(tbl(data, [70, 36, 36, 56, 56, 260], fs=7.2))
S += [Paragraph('Best shop item power by level (every tenth level)', H2)]
lv = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130]
data = [['Group'] + [str(x) for x in lv]]
for g, v in GEAR.items(): data.append([g.replace('weapon:', '')] + [fmt(x) for x in v['bestShop']])
S.append(tbl(data, [50] + [34] * 13, fs=6.6))
S += [Paragraph('Best item power by level including rare drops', H2)]
data = [['Group'] + [str(x) for x in lv]]
for g, v in GEAR.items(): data.append([g.replace('weapon:', '')] + [fmt(x) for x in v['bestAll']])
S.append(tbl(data, [50] + [34] * 13, fs=6.6))
S += [Paragraph('Worst dead ends (item, its level, its power, the power it is beaten by)', H2)]
data = [['Group', 'Item', 'Level', 'Power', 'Beaten by', 'Rare?']]
for g, v in GEAR.items():
    for d in v['deadList'][:3]: data.append([g.replace('weapon:', ''), d['n'][:36], d['L'], d['p'], d['beatenBy'], 'yes' if d['rar'] else ''])
S.append(tbl(data, [60, 180, 40, 50, 60, 40], fs=6.8))

# appendix
S += [PageBreak(), Paragraph('9. What to look at first, and how to re-run this', H2)]
S += bullets([
    'Smooth the rating ladder: 55 of 120 ratings have no creatures, and the Orange Spire (ratings 59 to 66) pays enough XP to jump the party past most of the later areas. Cutting its XP or moving some of it later flattens the race.',
    'Decide what the late game is for: after rating 77 creatures pay about a sixth of the XP per kill, so levelling nearly stops. If that is intended (the party is meant to stop levelling near 110), the Testing party levels 105 to 115 are the right range; if not, raise late creature XP.',
    'Rebuild the spikes: Deeper Hollow (72), Underlevel (80), Blackbriar Wood (82), Drowned Maze (74), Pale areas (100) and the Stone Planet (108) beat parties that handle their neighbours. Lowering their damage or health one notch evens the curve, or give those areas a clearer level warning.',
    'The best-gear party is untouched almost everywhere: it wins 100% even 10 levels down. If you want gear and level to matter more, creature damage should rise faster per level than hero health, or armour should cut fewer hits.',
    'Fill the gear holes: a shop Dagger and Staff for levels 40 to 120, Sword, Bow and Mace steps for the long gaps, shields past 60, armour past 100.',
    'The super weapons and houses together are 2.15M, against %s that a full clear pays (a gear set for the party costs another 0.3M). That is fine as a post-game goal if intended; if not, scale prices or add a gold source after the story.' % fmt(gold_total),
    'Re-run: start the game page on a local server, open the browser console, load <i>tools/balance/harness.js</i>, call <i>BALH.harvest()</i> then <i>await BALH.stage(\'matrix\', 300)</i> and the same for <i>bot, kills, xp, pace, economy, gear</i>, with a receiver on port 8914 saving the JSON; then run <i>make_report.py</i> on that folder.'])
S += [PageBreak(), Paragraph('Appendix: every creature (ordinary and boss)', H2),
      Paragraph('Hits to kill the creature (one hero) and hits it needs to kill an average hero, for the best-gear party of the creature\'s level. n is how many stand in the game.', SM)]
data = [['Creature', 'Lvl', 'n', 'Health', 'Damage', 'Hits to kill', 'Hits to kill hero', 'Boss']]
for r in sorted(K, key=lambda r: (r['lv'], r['name'])):
    data.append([r['name'][:30], r['lv'], r['n'], fmt(r['hp']), '%d-%d' % tuple(r['dmg']), '%.1f' % r['hitsToKill'], '%.1f' % r['hitsToKillAvg'], 'boss' if r['boss'] else ''])
S.append(tbl(data, [150, 30, 30, 50, 70, 55, 70, 35], fs=6.2))
doc.build(S)
print('written', OUT, len(S))
