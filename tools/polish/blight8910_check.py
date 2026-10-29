"""Analyse the dump from blight8910_dump.py: reachability, tight spots on routes, duplicates, props in front of doors/NPCs. python tools/polish/blight8910_check.py dump.json [id ...]"""
import sys, json, collections
d = json.load(open(sys.argv[1]))
only = set(sys.argv[2:])
D4 = [(1,0),(-1,0),(0,1),(0,-1)]
for id, L in d.items():
    if only and id not in only: continue
    W, H = L['W'], L['H']; rows = L['rows']
    wet = set(L['wet'])
    bl = set(); 
    for o in L['decor']:
        if o['block'] and not o['found'] and o['npc'] != 'blp_knight': bl.add((o['x'], o['y']))
    def ok(x, y):
        return 0 <= x < W and 0 <= y < H and rows[y][x] == '.' and (y*W+x) not in wet and (x, y) not in bl
    okb = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] == '.' and (y*W+x) not in wet
    st = (L['start']['x'], L['start']['y'])
    def bfs(src, f=ok):
        dist = {src: 0}; prev = {}; q = collections.deque([src])
        while q:
            c = q.popleft()
            for a, b in D4:
                n = (c[0]+a, c[1]+b)
                if n in dist or not f(*n): continue
                dist[n] = dist[c]+1; prev[n] = c; q.append(n)
        return dist, prev
    dist, prev = bfs(st)
    print('=====', id, L['name'], W, H, 'walkable reach', len(dist))
    # key points
    keys = []
    for o in L['decor']:
        if o['npc'] and not o['found']: keys.append(('npc ' + o['npc'], (o['x'], o['y'])))
    for x, y, g in L['doors']: keys.append(('door', (x, y)))
    for p in L['portals']: pass
    paths = collections.defaultdict(set)
    for name, (x, y) in keys:
        best = None
        for a, b in [(0,0)] + D4:
            c = (x+a, y+b)
            if c in dist and (best is None or dist[c] < dist[best]): best = c
        if best is None:
            print('  UNREACHABLE', name, (x, y)); continue
        c = best
        while c in prev: paths[c].add(name); c = prev[c]
    # free 2x2
    def free2(x, y):
        for ox in (0, -1):
            for oy in (0, -1):
                if all(ok(x+ox+i, y+oy+j) for i in (0,1) for j in (0,1)): return True
        return False
    tight = [c for c in paths if not free2(*c)]
    # cluster tight cells
    tset = set(tight); seen = set(); clusters = []
    for c in tight:
        if c in seen: continue
        comp = []; q = [c]; seen.add(c)
        while q:
            u = q.pop(); comp.append(u)
            for a, b in D4:
                n = (u[0]+a, u[1]+b)
                if n in tset and n not in seen: seen.add(n); q.append(n)
        clusters.append(comp)
    for comp in clusters:
        xs = [c[0] for c in comp]; ys = [c[1] for c in comp]
        print('  TIGHT route cells', len(comp), 'x', min(xs), max(xs), 'y', min(ys), max(ys), 'used for', sorted({n for c in comp for n in paths[c]})[:3])
    # enemies in tight spots / unreachable
    for e in L['enemies']:
        c = (e['x'], e['y'])
        if c not in dist: print('  FOE not reachable', e); continue
        if not free2(*c): print('  FOE tight', e)
    # duplicates within 2 squares
    occ = [(o['k'], o['x'], o['y'], o) for o in L['decor']] + [(e['t'], e['x'], e['y'], e) for e in L['enemies']]
    byk = collections.defaultdict(list)
    for k, x, y, o in occ: byk[k].append((x, y))
    dups = collections.Counter()
    for k, pts in byk.items():
        for i, p in enumerate(pts):
            for q in pts[i+1:]:
                if max(abs(p[0]-q[0]), abs(p[1]-q[1])) <= 2: dups[k] += 1
    if dups: print('  DUP pairs within 2:', dict(dups.most_common(40)))
    # non-block props right in front of a door, and any prop on a door approach
    for x, y, g in L['doors']:
        for a, b in D4:
            n = (x+a, y+b)
            if okb(*n):
                inn = [o for o in L['decor'] if (o['x'], o['y']) == n or (abs(o['x']-n[0]) + abs(o['y']-n[1]) == 1 and o['block'])]
                if n in bl or any((o['x'], o['y']) == n for o in L['decor']):
                    print('  DOOR approach occupied', (x, y), n, [o['k'] for o in L['decor'] if (o['x'], o['y']) == n])
    # same-cell decor
    cells = collections.defaultdict(list)
    for o in L['decor']: cells[(o['x'], o['y'])].append(o['k'])
    for c, ks in cells.items():
        if len(ks) > 1 and any(True for _ in ks): 
            if len(set(ks)) < len(ks) : print('  SAME CELL identical', c, ks)
    # npc neighbourhood: quest giver (npc with talk) with fewer than 2 free neighbours
    for o in L['decor']:
        if o['npc'] and not o['found']:
            fr = sum(1 for a, b in D4 if ok(o['x']+a, o['y']+b))
            if fr < 2: print('  NPC cramped', o['npc'], o['k'], o['x'], o['y'], 'free nbrs', fr)
