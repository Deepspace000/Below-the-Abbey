"""Extended audit of the Drowned Maze (477): true heights, table outliers, creature distance to set pieces, sight lines, light coverage, sign sprites.
python tools/polish/e_dump.py 477 && python tools/polish/e2_audit.py [before]"""
import json, re, math, collections, sys
d=json.load(open('tools/polish/e_dump_477.json')); rows=d['rows']; H=len(rows); W=len(rows[0]); dec=d['decor']; meta=d['meta']
op=lambda x,y:0<=y<H and 0<=x<W and rows[y][x]=='.'
D=[(0,-1),(1,0),(0,1),(-1,0)]; deg=lambda x,y:sum(op(x+a,y+b) for a,b in D)
TBL=[(r'^art_hgxstat[012367]$',1.3,1.5),(r'^art_hgxstat[45]$',1.0,1.35),(r'bookshelf',1.0,1.2),(r'furn_cabinet',.75,.95),(r'^art_wm_bell$',.7,.8),(r'^art_wm_boat$',.8,.95),(r'^uw_shellchest$',.4,.5),(r'^art_wm_(barrel|crate|keg|cask)$',.35,.5),(r'^art_wm_bucket$',.22,.35),(r'^art_wm_skeleton$',.25,.4),(r'^art_hgtb_(lamp_tall|glasspost)$',1.0,1.4),(r'^art_wm_(orb_pedestal|candelabra)$',.5,.9),(r'^art_wm_shrine$',.9,1.1),(r'^art_wm_mirror$',1.1,1.3),(r'^art_wm_scale$',.6,.8),(r'^art_wm_rune$',.7,.95),(r'^art_wm_crystal_',.25,.7),(r'^uw_amphora$',.38,.55),(r'^uw_clam$',.25,.4),(r'^art_hgxprop\d+$',.08,.55),(r'^art_hgwm_moss',.18,.36),(r'^art_hgwm_rock',.26,.5),(r'^art_hgwm_grass',.3,.72),(r'^art_hgwm_reed',.45,.85),(r'^art_hgwm_algae',.45,.9)]
def eff(q):
    h,w,hh=meta.get(q['k'],[None,0,0]); ratio=(w/hh) if hh else 1
    return (h if h is not None else .7/ratio)*q.get('sc',1), ratio
out=[];P=lambda *a:out.append(' '.join(str(x) for x in a))
byk=collections.defaultdict(list)
for q in dec:
    if q.get('pic'): continue
    e,r=eff(q); byk[q['k']].append(e)
P('## TRUE HEIGHTS (world units; a person is 0.9, walls 2.6)'); bad=0
P('| kind | n | min | max | table range |'); P('|---|---|---|---|---|')
for k,l in sorted(byk.items(),key=lambda a:-len(a[1])):
    rg=next(((lo,hi) for pat,lo,hi in TBL if re.search(pat,k)),None)
    flag=''
    if rg and (min(l)<rg[0]-.01 or max(l)>rg[1]+.01): flag=' OUTLIER'; bad+=len([x for x in l if x<rg[0]-.01 or x>rg[1]+.01])
    P('|',k,'|',len(l),'|',round(min(l),2),'|',round(max(l),2),'|',rg,flag,'|')
P('\nOUTLIERS against the table:',bad)
vig=[(v['x'],v['y']) for v in d['info']['vignettes']]+[(q['x'],q['y']) for q in dec if q['k']=='uw_shellchest']+[(i['x'],i['y']) for i in d['items']]
near=[(e['t'],e['x'],e['y']) for e in d['enemies'] if e['t']!='hgfcatfish' and any(math.hypot(a-e['x'],b-e['y'])<3 for a,b in vig)]
P('creatures within 3 squares of a set piece or chest:',len(near),near[:6])
# sight line: a solid prop that cannot be seen from 3 squares along a straight passage
solid=[q for q in dec if q.get('block') and not q.get('walk') and not q.get('pic') and q['k'] not in('uw_shellchest',) and not re.match('art_hgwm|hgt_|uw_vent',q['k'])]
def run(x,y):
    best=0
    for a,b in D:
        n=0
        while n<9 and op(x+a*(n+1),y+b*(n+1)): n+=1
        best=max(best,n)
    return best
hid=[(q['k'],q['x'],q['y'],run(q['x'],q['y'])) for q in solid if run(q['x'],q['y'])<3]
P('solid props with no straight sight line of 3 squares:',len(hid),hid[:8])
# light coverage
L=d['lights']; cov=0; opn=[(x,y) for y in range(H) for x in range(W) if op(x,y)]
for x,y in opn:
    if any((l['x']-x)**2+(l['y']-y)**2<l['r2'] for l in L): cov+=1
P('lights',len(L),'| open squares inside a light pool:',cov,'of',len(opn),'(%d%%)'%(100*cov/len(opn)))
notes=[q for q in dec if q.get('npc')=='hgdw_note']; spr=collections.Counter(q['k'] for q in notes)
P('note carriers',len(notes),dict(spr))
open('tools/polish/e2_audit%s.md'%('_before' if len(sys.argv)>1 else ''),'w',encoding='utf-8').write('\n'.join(out)); print('\n'.join(out[-9:]))
