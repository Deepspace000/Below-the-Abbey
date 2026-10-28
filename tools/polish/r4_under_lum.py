import sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import r4lib
from PIL import Image
import numpy as np
H=os.path.dirname(os.path.abspath(__file__))
tag=sys.argv[1]; N=int(sys.argv[2]) if len(sys.argv)>2 else 14; M=int(sys.argv[3]) if len(sys.argv)>3 else 10
r4lib.ev("()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();return 1}")
JS="""([N,M])=>{const L=LEVELS[476],O=L._hgdo,W=201,Hh=201;const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1&&!O.isle[y*201+x];
const DV=[[0,-1],[1,0],[0,1],[-1,0]];let s=777;const rnd=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff};
const cor=[],hub=[];for(let y=4;y<Hh-4;y++)for(let x=4;x<W-4;x++){if(!land(x,y))continue;
 for(let f=0;f<4;f++){const d=DV[f];let n=0;while(land(x+d[0]*n,y+d[1]*n)&&n<8)n++;const side=!land(x+d[1],y+d[0])&&!land(x-d[1],y-d[0]);if(side&&n>=7&&land(x-d[0],y-d[1])===false)cor.push([x,y,f]);}
 let r=true;for(let j=-1;j<=1&&r;j++)for(let i=-1;i<=1;i++)if(!land(x+i,y+j)){r=false;break}
 if(r){let bf=0,bn=0;for(let f=0;f<4;f++){let n=0;while(land(x+DV[f][0]*n,y+DV[f][1]*n)&&n<8)n++;if(n>bn){bn=n;bf=f}}hub.push([x,y,bf])}}
const nf=c=>!L.enemies.some(e=>Math.abs(e.x-c[0])<=2&&Math.abs(e.y-c[1])<=2);
const pick=(a,n)=>{a=a.filter(nf);const o=[];const b=a.slice();while(o.length<n&&b.length){const i=Math.floor(rnd()*b.length);const c=b.splice(i,1)[0];if(o.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>9))o.push(c)}return o};
return {cor:pick(cor,N),hub:pick(hub,M)}}"""
pts=r4lib.ev(JS,[N,M])
def lum(p):
    im=np.asarray(Image.open(p).convert('RGB').crop((8,60,950,480)),dtype=float)
    return round(float((0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]).mean()),1)
res={'cor':[],'hub':[]}
for k in ('cor','hub'):
    for i,(x,y,f) in enumerate(pts[k]):
        fp=os.path.join(H,'r4_shots','u_%s_%s%d.png'%(tag,k,i)); r4lib.shot('u_%s_%s%d'%(tag,k,i),476,x,y,f,700)
        l=lum(fp); res[k].append([x,y,f,l]); print(k,x,y,f,l,flush=True)
for k in res: print(k,'mean',round(np.mean([a[3] for a in res[k]]),1),'min',min(a[3] for a in res[k]))
json.dump(res,open(os.path.join(H,'r4_under_lum_%s.json'%tag),'w'))
