import json, sys
R = json.load(open('tools/polish/blight34/levels.json'))
id = sys.argv[1]; L = R[id]; W, H = L['W'], L['H']
x0,y0,x1,y1 = (int(a) for a in sys.argv[2:6]) if len(sys.argv)>5 else (0,0,W-1,H-1)
g = [[('#' if L['rows'][y][x] != '.' else ('~' if L['wet'] and L['wet'][y*W+x]=='1' else '.')) for x in range(W)] for y in range(H)]
for d in L['decor']:
    if d['found']: continue
    if d['npc']: c = 'N'
    elif d['block']: c = 'o'
    else: c = ','
    if g[d['y']][d['x']] in '.~' or c in 'N': 
        if not(c==',' and g[d['y']][d['x']] not in '.~'): g[d['y']][d['x']] = c
for d in L['doors']: g[d['y']][d['x']] = 'D'
for e in L['enemies']: g[e['y']][e['x']] = 'E'
g[L['start']['y']][L['start']['x']] = 'S'
print('   ' + ''.join(str(x%10) for x in range(x0,x1+1)))
for y in range(y0,y1+1): print('%2d '%y + ''.join(g[y][x0:x1+1]))
for d in L['decor']:
    if x0<=d['x']<=x1 and y0<=d['y']<=y1 and len(sys.argv)>6: print(d['k'],d['x'],d['y'],d['block'],d['npc'])
