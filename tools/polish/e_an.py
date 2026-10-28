import json, sys, collections, statistics
LV=int(sys.argv[1]); d=json.load(open('tools/polish/e_dump_%d.json'%LV))
rows=d['rows']; H=len(rows); W=len(rows[0])
op=lambda x,y: 0<=y<H and 0<=x<W and rows[y][x]=='.'
print('size',W,H,'open',sum(r.count('.') for r in rows))
by=collections.defaultdict(list)
for q in d['decor']: by[q['k']].append(q)
print('PROPORTIONS kind,count,min,max,median sc; fields')
for k,v in sorted(by.items(), key=lambda a:-len(a[1])):
    sc=[q.get('sc',1) for q in v]; f=set()
    for q in v: f|=set(q.keys())
    print(k,len(v),min(sc),max(sc),statistics.median(sc),sorted(f-{'k','x','y'}))
wallc=[(q['k'],q['x'],q['y']) for q in d['decor'] if not op(q['x'],q['y'])]
print('decor on wall cells',len(wallc),wallc[:10])
cell=collections.Counter((q['x'],q['y']) for q in d['decor']); print('stacked cells',sum(1 for c in cell.values() if c>2))
print('enemies',collections.Counter(e['t'] for e in d['enemies']))
print('text decor',[ (q['k'],q['x'],q['y'],q.get('text') or q.get('note') or q.get('sign')) for q in d['decor'] if any(t in q for t in ('text','note','sign','title'))][:20])
print('npcs',len(d['npcs']),'signs',d['signs'][:5],'items',len(d['items']))
# dead ends
de=[(x,y) for y in range(H) for x in range(W) if op(x,y) and sum(op(x+a,y+b) for a,b in((1,0),(-1,0),(0,1),(0,-1)))==1]
occ={(q['x'],q['y']) for q in d['decor'] if q['k'] not in('hgt_reeds','hgt_vine_roundleaf','uw_seagrass') and not q['k'].startswith('art_hgdf_vine')}
print('dead ends',len(de),'bare',[c for c in de if c not in occ])
