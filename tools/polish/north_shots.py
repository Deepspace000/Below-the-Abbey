# usage: python tools/polish/a_shots.py tag "x,y;x,y;..."   (facing = the way with the longest open run unless x,y,f)
import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
tag=sys.argv[1]; places=[[int(v) for v in s.split(',')] for s in sys.argv[2].split(';')]
OUT=os.path.join(os.environ.get('TEMP','.'),'n_shots'); os.makedirs(OUT,exist_ok=True)
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}try{G.mute=true}catch(e){}}")
    for i,pl in enumerate(places):
        x,y=pl[0],pl[1]
        f=pl[2] if len(pl)>2 else None
        pg.evaluate("""([x,y,f])=>{const L=LEVELS[475],ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';
          if(f===8){const DV=[[0,-1],[1,0],[0,1],[-1,0]];let bd=-1,bn=0;DV.forEach(([dx,dy],i)=>{let n=0;while(n<3&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>bn){bn=n;bd=i}});if(bd>=0){const [dx,dy]=DV[bd];x=x+dx*bn;y=y+dy*bn;f=(bd+2)%4}else f=0}else if(f===9){const DV=[[0,-1],[1,0],[0,1],[-1,0]];let dir=0;DV.forEach(([dx,dy],i)=>{if(ok(x+dx,y+dy))dir=i});const [bx,by]=DV[dir];let n=0;while(n<2&&ok(x+bx*(n+2),y+by*(n+2)))n++;x=x+bx*(n+1);y=y+by*(n+1);f=(dir+2)%4}else if(f===null){let best=0;f=0;[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],i)=>{let n=0;while(n<12&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>best){best=n;f=i}})}
          G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang;}""",[x,y,f])
        pg.wait_for_timeout(1400)
        pg.evaluate("()=>{G.talk=null;G.msgs=[]}")
        pg.wait_for_timeout(200)
        path=os.path.join(OUT,'%s_%02d_%d_%d.png'%(tag,i,x,y)); pg.screenshot(path=path); print(path)
    print([e for e in errs if 'Failed to load' not in e][:5]); b.close()
