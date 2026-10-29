"""2-wide reachability: which targets can only be reached through a 1-wide gap, and which cells are unreached islands."""
import json, sys, collections
R = json.load(open('tools/polish/blight34/levels.json'))
for id in (sys.argv[1:] or list(R)):
    L = R[id]; W, H = L['W'], L['H']; rows = L['rows']; wet = L['wet']
    blk = set((d['x'], d['y']) for d in L['decor'] if d['block'] and not d['found'])
    ok = lambda x, y: 0 <= x < W and 0 <= y < H and rows[y][x] == '.' and (x, y) not in blk and not (wet and wet[y*W+x] == '1')
    wide = set()
    for y in range(H):
        for x in range(W):
            if ok(x,y) and ((ok(x+1,y) and ok(x,y+1) and ok(x+1,y+1)) or (ok(x-1,y) and ok(x,y+1) and ok(x-1,y+1)) or (ok(x+1,y) and ok(x,y-1) and ok(x+1,y-1)) or (ok(x-1,y) and ok(x,y-1) and ok(x-1,y-1))): wide.add((x,y))
    seeds = [(L['start']['x'], L['start']['y'])]
    if id == '9640': seeds += [(4,38),(50,48),(62,18),(28,18)]
    def flood(allowed, seeds):
        seen = set(s for s in seeds if s in allowed or True); q = list(seen)
        for (x,y) in q:
            for a,b in ((1,0),(-1,0),(0,1),(0,-1)):
                n=(x+a,y+b)
                if n not in seen and n in allowed: seen.add(n); q.append(n)
        return seen
    allc = set((x,y) for y in range(H) for x in range(W) if ok(x,y))
    nar = flood(allc, seeds); wd = flood(wide|set(seeds), seeds)
    print('=====', id, 'narrow-reach', len(nar), 'wide-reach', len(wd & wide), 'open', len(allc))
    isl = sorted(allc - nar)
    if isl: print(' ISLAND cells (not reached by walking):', isl[:40])
    tg = [(d['x'], d['y'], d['npc'] or d['k']) for d in L['decor'] if d['npc'] and not d['found']] + [(d['x'], d['y'], 'door%s' % d['lvl']) for d in L['doors']]
    for x, y, n in tg:
        near = [(x+a, y+b) for a,b in ((0,0),(1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1))]
        if any(c in wd for c in near): continue
        if any(c in nar for c in near): print(' ONLY-NARROW', n, x, y)
        else: print(' UNREACHED', n, x, y)
    # wide-region cells hugging a pinch: list pinch cells on narrow region adjacent to wide ones (route links)
    links = [c for c in nar - wide if sum(1 for a,b in ((1,0),(-1,0),(0,1),(0,-1)) if (c[0]+a,c[1]+b) in wd) >= 1 and sum(1 for a,b in ((1,0),(-1,0),(0,1),(0,-1)) if (c[0]+a,c[1]+b) in wd) <= 2]
    print(' narrow cells touching wide area (candidate gaps):', len(links))
    # components of wide region (separated by narrow gaps)
    comp = []; left = set(wide)
    while left:
        s = left.pop(); c = flood(wide, [s]); left -= c; comp.append(c)
    comp.sort(key=len, reverse=True)
    print(' wide components', [len(c) for c in comp[:12]])
    for c in comp[1:8]:
        if len(c) >= 6:
            xs=[p[0] for p in c]; ys=[p[1] for p in c]; print('  comp size', len(c), 'bbox', min(xs),min(ys),max(xs),max(ys))
