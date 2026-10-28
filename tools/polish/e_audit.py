"""Audit of the Drowned Maze (level 477). python tools/polish/e_audit.py  (after e_dump.py 477) -> prints and writes tools/polish/e_audit.md"""
import json, collections, statistics, re, sys
LV=477; SUF='_before' if len(sys.argv)>1 and sys.argv[1]=='before' else ''; d=json.load(open('tools/polish/e_dump_%d%s.json'%(LV,SUF))); rows=d['rows']; H=len(rows); W=len(rows[0])
op=lambda x,y: 0<=y<H and 0<=x<W and rows[y][x]=='.'
D=[(1,0),(-1,0),(0,1),(0,-1)]
deg=lambda x,y: sum(op(x+a,y+b) for a,b in D)
out=[]; P=lambda *a: out.append(' '.join(str(x) for x in a))
dec=d['decor']; meta=d['meta']
plant=lambda q: bool(re.match(r'art_hgwm_|hgt_reeds|hgt_vine_roundleaf|uw_seagrass',q['k']))
vine=lambda q: q['k'].startswith('art_hgdf_vine')
P('# Drowned Maze audit (level 477)'); P('open cells',sum(r.count('.') for r in rows),'decor',len(dec),'enemies',len(d['enemies']),'items',len(d['items']))
# 1 signs and notes
notes=[q for q in dec if q.get('npc')=='hgdw_note']; empty=[(q['k'],q['x'],q['y']) for q in notes if not q.get('hgdwText')]
oldnotes=[q for q in dec if q.get('npc') and q.get('npc')!='hgdw_note']
P('notes/signs/plaques',len(notes),'| empty text',len(empty),empty[:5],'| other talkers',len(oldnotes))
txts=[q.get('hgdwText','') for q in notes]; bad=[t for t in txts if re.search('\u2014|\u2013|TODO|lorem|undefined|placeholder',t,re.I)]
P('placeholder or dash text',len(bad)); dup=[t for t,c in collections.Counter(txts).items() if c>1]; P('duplicate note texts',len(dup))
# 2 walls, stacking
onwall=[(q['k'],q['x'],q['y']) for q in dec if not q.get('pic') and not op(q['x'],q['y'])]; P('decor on wall cells',len(onwall),onwall[:5])
cell=collections.defaultdict(list)
for q in dec:
    if not q.get('pic'): cell[(q['x'],q['y'])].append(q)
dense=[c for c,l in cell.items() if len(l)>=3]; P('squares with 3 or more things',len(dense))
# 3 identical clusters (same kind, 5x5)
cl=0; byk=collections.defaultdict(list)
for q in dec:
    if not q.get('pic'): byk[q['k']].append((q['x'],q['y']))
clusters=[]
for k,l in byk.items():
    lim=3 if re.search('grass|reed0',k) else 2
    if k=='uw_vent0': continue
    for (x,y) in set(l):
        n=sum(1 for (a,b) in l if abs(a-x)<=2 and abs(b-y)<=2)
        if n>lim: clusters.append((k,x,y,n))
P('over-dense identical clusters (more than %s within 2 squares)'%'2 (3 for grasses)',len(clusters),clusters[:4])
# 4 blocking props and reachability
blk={(q['x'],q['y']) for q in dec if q.get('block') and not q.get('walk') and not q.get('pic')}
st=[(1,1)]
for s in [(0,0)]: pass
start=(d['start']['x'],d['start']['y'])
seen={start}; qd=[start]
for x,y in qd:
    for a,b in D:
        n=(x+a,y+b)
        if n in seen or not op(*n) or n in blk: continue
        seen.add(n); qd.append(n)
openset={(x,y) for y in range(H) for x in range(W) if op(x,y)}
unreach=openset-seen-blk; P('open squares cut off by solid props',len(unreach),sorted(unreach)[:6])
corr=[(x,y) for (x,y) in blk if deg(x,y)==2]; P('solid props in a one-square corridor (deg 2)',len(corr),[(q['k'],q['x'],q['y']) for q in dec if (q['x'],q['y']) in corr and q.get('block') and not q.get('walk')][:10])
items=[(i['k'],i['x'],i['y']) for i in d['items'] if (i['x'],i['y']) not in seen and (i['x'],i['y']) not in blk]; P('items/chests unreachable',len([i for i in d['items'] if (i['x'],i['y']) not in seen]) )
chests=[(q['x'],q['y']) for q in dec if q['k']=='uw_shellchest']; P('shell chests',len(chests),'unreachable',sum(1 for c in chests if not any((c[0]+a,c[1]+b) in seen for a,b in D)))
# 5 dead ends
de=[(x,y) for (x,y) in openset if deg(x,y)==1]
story={(q['x'],q['y']) for q in dec if not plant(q) and not vine(q) and not q['k'].startswith('uw_vent')}|{(i['x'],i['y']) for i in d['items']}|{(e['x'],e['y']) for e in d['enemies']}
bare=[c for c in de if c not in story]; P('dead ends',len(de),'with nothing but weed',len(bare),bare[:8])
# 6 proportions
P('\n## PROPORTIONS (person = 1.0; effective height = NPC_H x scale; width = height x picture ratio)')
P('| kind | count | NPC_H | ratio w/h | min eff h | max eff h | median eff h | note |'); P('|---|---|---|---|---|---|---|---|')
byc=collections.defaultdict(list)
for q in dec: byc[q['k']].append(q)
for k,l in sorted(byc.items(), key=lambda a:-len(a[1])):
    h,w,hh=meta.get(k,[None,0,0]); base=h if h is not None else .6; ar=(w/hh) if hh else 0
    e=[base*q.get('sc',1) for q in l]; wide=max(e)*ar if ar else 0
    note=''
    if not q.get('pic') and wide>1.05 and not plant(l[0]) and k not in('uw_vent0',): note='wider than a square'
    if max(e)>1.9 and not vine(l[0]) and k!='art_hgwm_algae0': note+=' tall'
    P('|',k,'|',len(l),'|',h,'|',round(ar,2),'|',round(min(e),2),'|',round(max(e),2),'|',round(statistics.median(e),2),'|',note,'|')
P('\n## SET PIECES',len((d.get('info') or {}).get('vignettes',[])),(d.get('info') or {}).get('vignettes'))
P('signposts',(d.get('info') or {}).get('signs'),'lights',len(d.get('lights',[])))
open('tools/polish/e_audit%s.md'%SUF,'w',encoding='utf-8').write('\n'.join(out)); print('\n'.join(out[:14]))
