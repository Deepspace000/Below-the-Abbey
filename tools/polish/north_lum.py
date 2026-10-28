# usage: north_lum.py tag biome n   -> mean luminance of the 3D view at n sample cells of the biome, lights on vs off
import sys,os,json,io; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
from PIL import Image
bio=int(sys.argv[2]); n=int(sys.argv[3])
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}G.mute=true}")
    cells=pg.evaluate("""([bio,n])=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,o=[];let k=0;for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(M.bio[y*W+x]!==bio||L.rows[y][x]!=='.')continue;if((x*7+y*13)%97!==0)continue;o.push([x,y])}
      o.sort((a,b)=>((a[0]*31+a[1]*17)%101)-((b[0]*31+b[1]*17)%101));return o.slice(0,n)}""",[bio,n])
    def shot(x,y):
        pg.evaluate("""([x,y])=>{const L=LEVELS[475],ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';let best=0,f=0;[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],i)=>{let n=0;while(n<12&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>best){best=n;f=i}});
          G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang;}""",[x,y])
        pg.wait_for_timeout(900)
        pg.evaluate("()=>{G.talk=null;G.msgs=[]}")
        im=Image.open(io.BytesIO(pg.screenshot(clip={'x':40,'y':10,'width':720,'height':350}))).convert('L')
        h=im.histogram();tot=sum(h);m=sum(i*v for i,v in enumerate(h))/tot;dark=sum(h[:25])/tot
        return round(m,1),round(dark,2)
    res={'on':[],'off':[]}
    for mode in ('on','off'):
        pg.evaluate("(m)=>{for(const l of LIGHTS)if(l.hpa){l.out=(m==='off')}}",mode)
        for x,y in cells: res[mode].append(shot(x,y))
    import statistics as st
    for mode in res: print(mode,'mean lum',round(st.mean(a for a,_ in res[mode]),1),'mean share of near-black pixels',round(st.mean(a for _,a in res[mode]),2))
    json.dump(res,open(os.path.join(os.environ['TEMP'],'n_lum_%s.json'%sys.argv[1]),'w'));b.close()
