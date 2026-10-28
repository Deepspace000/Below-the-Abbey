import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from u4_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/u4shots'); OUT.mkdir(exist_ok=True,parents=True)
tag=sys.argv[1]; N=int(sys.argv[2]) if len(sys.argv)>2 else 8; DIST=int(sys.argv[3]) if len(sys.argv)>3 else 2
JS='''([N,D])=>{const L=LEVELS[476];const DV=[[0,-1],[1,0],[0,1],[-1,0]];const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&L._hgdo.wm[y*201+x]!==1;
const sg=L.decor.filter(d=>d.pic&&d.wd&&/hgpd_(board|rune)/.test(d.hgtBase||d.k));const out=[];
for(const d of sg){const f=DV.findIndex(v=>v[0]===d.wd[0]&&v[1]===d.wd[1]);let n=0;while(n<D&&land(d.x-d.wd[0]*(n+1),d.y-d.wd[1]*(n+1)))n++;out.push({x:d.x-d.wd[0]*n,y:d.y-d.wd[1]*n,f,k:d.hgtBase||d.k,lk:d.lk||null,hgt:d.hgt||null,label:d.label})}
return {out,total:sg.length,withText:sg.filter(d=>d.hgt).length}}'''
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    pg.evaluate('()=>{goToLevel(476,{x:LEVELS[476].start.x,y:LEVELS[476].start.y,f:0})}'); pg.wait_for_timeout(1500)
    r=pg.evaluate(JS,[N,DIST]); print('total',r['total'],'withText',r['withText'])
    seen=set(); i=0
    for s in r['out']:
        key=s['k']+(s['label'] or '')
        if key in seen: continue
        seen.add(key)
        if i>=N: break
        pg.evaluate('([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}',[s['x'],s['y'],s['f']]); pg.wait_for_timeout(1300)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(250)
        fn=OUT/('%s_%d.png'%(tag,i)); pg.screenshot(path=str(fn),clip={'x':0,'y':40,'width':840,'height':420}); print(i,s,fn,flush=True); i+=1
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
