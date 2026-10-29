"""ASCII view: python blight8910_ascii.py dump.json id x0 y0 x1 y1  (# wall/block, ~ water, letters props: B blocking, o walk-through, N npc, E enemy, D door)"""
import sys, json
d = json.load(open(sys.argv[1])); id = sys.argv[2]; x0, y0, x1, y1 = map(int, sys.argv[3:7]); L = d[id]; W = L['W']
wet = set(L['wet']); g = {}
for o in L['decor']:
    c = 'N' if o['npc'] else ('B' if o['block'] else 'o'); 
    if (o['x'], o['y']) not in g or c in 'NB': g[(o['x'], o['y'])] = c
for e in L['enemies']: g[(e['x'], e['y'])] = 'E'
dr = {(x, y) for x, y, _ in L['doors']}
print('    ' + ''.join(str(x % 10) for x in range(x0, x1+1)))
for y in range(y0, y1+1):
    s = ''
    for x in range(x0, x1+1):
        ch = L['rows'][y][x]
        if (x, y) in dr: s += 'D'
        elif ch != '.': s += '#'
        elif y*W+x in wet: s += '~'
        else: s += g.get((x, y), '.')
    print('%3d ' % y + s)
