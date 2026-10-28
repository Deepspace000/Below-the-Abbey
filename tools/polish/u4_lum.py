import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from u4_load import *
from PIL import Image, ImageStat
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/u4shots/lum'); OUT.mkdir(exist_ok=True,parents=True)
tag=sys.argv[1]; N=int(sys.argv[2]) if len(sys.argv)>2 else 12; M=int(sys.argv[3]) if len(sys.argv)>3 else 8
JS='''([N,M])=>{const L=LEVELS[476],O=L._hgdo,W=201,H=201;const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1&&!O.isle[y*201+x];
const DV=[[0,-1],[1,0],[0,1],[-1,0]];let s=12345;const rnd=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff};
const cor=[],hub=[];for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(!land(x,y))continue;
 for(let f=0;f<4;f++){const d=DV[f];let n=0;while(land(x+d[0]*n,y+d[1]*n)&&n<8)n++;const side=!land(x+d[1],y+d[0])&&!land(x-d[1],y-d[0]);if(side&&n>=7&&land(x-d[0],y-d[1])===false)cor.push([x,y,f]);}
 let r=true;for(let j=-1;j<=1&&r;j++)for(let i=-1;i<=1;i++)if(!land(x+i,y+j)){r=false;break}
 if(r)hub.push([x,y,0])}
const nf=(c)=>!L.enemies.some(e=>Math.abs(e.x-c[0])<=2&&Math.abs(e.y-c[1])<=2);a=>0;const pick=(a,n)=>{a=a.filter(nf);const o=[];const b=a.slice();while(o.length<n&&b.length){const i=Math.floor(rnd()*b.length);const c=b.splice(i,1)[0];if(o.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>7))o.push(c)}return o};
return {cor:pick(cor,N),hub:pick(hub,M)}}'''
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    pts=pg.evaluate(JS,[N,M]); res={'cor':[],'hub':[]}
    for kind in ('cor','hub'):
        for i,(x,y,f) in enumerate(pts[kind]):
            pg.evaluate('([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}',[x,y,f]); pg.wait_for_timeout(1300)
            pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(250)
            fn=OUT/('%s_%s%d.png'%(tag,kind,i)); pg.screenshot(path=str(fn),clip={'x':0,'y':40,'width':840,'height':420})
            im=Image.open(fn).convert('L'); lum=ImageStat.Stat(im.crop((0,50,840,420))).mean[0]; res[kind].append(round(lum,1)); print(kind,x,y,f,round(lum,1),flush=True)
    for k in res: print(k,'mean',round(sum(res[k])/len(res[k]),1),'min',min(res[k]))
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
