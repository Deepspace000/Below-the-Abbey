import sys,os,json
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import r4lib
from PIL import Image
import numpy as np
H=os.path.dirname(os.path.abspath(__file__))
tag=sys.argv[1]
JS="""()=>{const L=LEVELS[475],rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';const bl=new Set(L.decor.filter(d=>d.block).map(d=>d.x+','+d.y));
const DV=[[0,-1],[1,0],[0,1],[-1,0]];const out=[];
for(const z of L._hgdp.zones){ // best hub cell: most open neighbours within r*.7, nearest the zone centre
 let best=null,bs=-1;for(let dy=-6;dy<=6;dy++)for(let dx=-6;dx<=6;dx++){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||bl.has(x+','+y))continue;let c=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(open(x+a,y+b))c++;const s=c*10-Math.hypot(dx,dy);if(s>bs){bs=s;best=[x,y]}}
 if(!best)continue;let bf=0,bn=-1;for(let f=0;f<4;f++){let n=0;while(open(best[0]+DV[f][0]*n,best[1]+DV[f][1]*n)&&n<8)n++;if(n>bn){bn=n;bf=f}}
 out.push([z.name,z.type,best[0],best[1],bf])}
return out}"""
pts=r4lib.ev(JS)
def lum(p):
    im=np.asarray(Image.open(p).convert('RGB').crop((8,60,950,480)),dtype=float)
    return round(float((0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]).mean()),1)
res=[]
for n,t,x,y,f in pts:
    nm='n_%s_%s'%(tag,''.join(c for c in n if c.isalnum()))
    r4lib.shot(nm,475,x,y,f,600)
    l=lum(os.path.join(H,'r4_shots',nm+'.png'));res.append([n,t,x,y,f,l]);print(n,t,x,y,f,l,flush=True)
json.dump(res,open(os.path.join(H,'r4_north_lum_%s.json'%tag),'w'))
for t in ('safe','danger'):
    v=[r[5] for r in res if r[1]==t];print(t,'mean',round(np.mean(v),1),'min',min(v),'under50',sum(a<50 for a in v))
