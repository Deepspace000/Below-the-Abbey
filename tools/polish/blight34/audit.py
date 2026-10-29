"""audit levels.json: reachability, chokepoints, duplicate neighbours, props at doors, tight foes. python tools/polish/blight34/audit.py [id...]"""
import json, sys, collections
R = json.load(open('tools/polish/blight34/levels.json'))
ids = [x for x in sys.argv[1:]] or list(R)
for id in ids:
    L = R[id]; W, H = L['W'], L['H']; rows = L['rows']
    wet = L['wet']
    blk = {}
    for d in L['decor']:
        if d['block'] and not d['found']: blk.setdefault((d['x'], d['y']), []).append(d['k'])
    def ok(x, y):
        return 0 <= x < W and 0 <= y < H and rows[y][x] == '.' and (x, y) not in blk and not (wet and wet[y*W+x] == '1')
    def terr(x, y):
        return 0 <= x < W and 0 <= y < H and rows[y][x] == '.' and not (wet and wet[y*W+x] == '1')
    print('=====', id, W, H, 'decor', len(L['decor']), 'foes', len(L['enemies']))
    seeds = [(L['start']['x'], L['start']['y'])]
    if id == '9640': seeds += [(4,38),(50,48),(62,18),(28,18)]
    for d in L['doors']: seeds.append((d['x'], d['y']))
    seen = set(); q = []
    for s in seeds[:1] + ([(4,38),(50,48),(62,18),(28,18)] if id=='9640' else []):
        seen.add(s); q.append(s)
    for (x, y) in q:
        for a, b in ((1,0),(-1,0),(0,1),(0,-1)):
            n = (x+a, y+b)
            if n not in seen and ok(*n): seen.add(n); q.append(n)
    def reach(x, y): return any((x+a, y+b) in seen for a, b in ((0,0),(1,0),(-1,0),(0,1),(0,-1)))
    for d in L['doors']:
        if not reach(d['x'], d['y']): print('DOOR UNREACHED', d)
        # door approach: the cell in front must be open and have a 2 wide approach
    for d in L['decor']:
        if d['npc'] and not d['found'] and not reach(d['x'], d['y']): print('NPC UNREACHED', d['npc'], d['k'], d['x'], d['y'])
    for e in L['enemies']:
        if (e['x'], e['y']) not in seen: print('FOE UNREACHED', e)
    # walkable terrain cells that are open but not reached (islands), count
    tot = sum(1 for y in range(H) for x in range(W) if ok(x, y)); print('walkable', tot, 'reached', len(seen), 'unreached walkable', tot - len(seen))
    # chokepoints among reached cells, due to props
    ch = []
    for (x, y) in seen:
        hz = not ok(x-1, y) and not ok(x+1, y); vt = not ok(x, y-1) and not ok(x, y+1)
        if hz or vt:
            # caused by props?
            hz_t = not terr(x-1, y) and not terr(x+1, y); vt_t = not terr(x, y-1) and not terr(x, y+1)
            prop = (hz and not hz_t) or (vt and not vt_t)
            ch.append((x, y, 'prop' if prop else 'terrain'))
    # only report where it really pinches a through route: both sides blocked AND at least 1 open cell either side along the line
    pinch = []
    for x, y, c in ch:
        hz = not ok(x-1, y) and not ok(x+1, y)
        if hz: along = ok(x, y-1) and ok(x, y+1)
        else: along = ok(x-1, y) and ok(x+1, y)
        if along: pinch.append((x, y, c))
    print('pinch cells (through 1-wide):', len(pinch), 'prop-caused', sum(1 for p in pinch if p[2]=='prop'))
    print(' prop-pinch:', [(x,y) for x,y,c in pinch if c=='prop'][:60])
    print(' terr-pinch:', [(x,y) for x,y,c in pinch if c=='terrain'][:60])
    # duplicates within 2 squares
    items = [d for d in L['decor'] if not d['found'] and not d.get('hidden')]
    dup = collections.defaultdict(list)
    for i, a in enumerate(items):
        for b in items[i+1:]:
            if a['k'] == b['k'] and max(abs(a['x']-b['x']), abs(a['y']-b['y'])) <= 2 and (a['x'],a['y'])!=(b['x'],b['y']):
                dup[a['k']].append(((a['x'],a['y']),(b['x'],b['y'])))
            elif a['k'] == b['k'] and (a['x'],a['y'])==(b['x'],b['y']): dup[a['k']+' SAMECELL'].append(((a['x'],a['y']),))
    for k, v in dup.items(): print(' DUP', k, len(v), v[:4])
    for i, a in enumerate(L['enemies']):
        for b in L['enemies'][i+1:]:
            if a['t']==b['t'] and max(abs(a['x']-b['x']), abs(a['y']-b['y']))<=1: print(' FOEDUP', a, b)
    # props near doors / start / npc
    key = [(d['x'], d['y'], 'door') for d in L['doors']] + [(L['start']['x'], L['start']['y'], 'start')] + [(d['x'], d['y'], 'npc '+d['npc']) for d in L['decor'] if d['npc'] and not d['found']]
    for x, y, nm in key:
        near = [(d['k'], d['x'], d['y']) for d in L['decor'] if d['block'] and not d['found'] and not d['npc'] and max(abs(d['x']-x), abs(d['y']-y)) <= 1 and (d['x'], d['y']) != (x, y)]
        if near and not nm.startswith('npc'): print(' NEAR', nm, x, y, near)
        elif near and nm.startswith('npc'): print(' NEARNPC', nm, x, y, near[:3])
    # tight foes
    for e in L['enemies']:
        n = sum(1 for a, b in ((1,0),(-1,0),(0,1),(0,-1)) if ok(e['x']+a, e['y']+b))
        if n <= 2: print(' TIGHTFOE', e, n)
