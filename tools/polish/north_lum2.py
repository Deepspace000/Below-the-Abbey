# usage: A_PORT=8330 python north_lum2.py tag  -> mean luminance of hubs (12 precinct centres, 4 facings) and corridors (36 cells), plus draw time per frame
import sys,os,json,io,statistics as st; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
from PIL import Image
tag=sys.argv[1] if len(sys.argv)>1 else 'x'
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    pg.evaluate("()=>{try{Object.assign(SNDOPT,{combat:0,amb:0,music:0,steps:0})}catch(e){}G.mute=true}")
    hubs=pg.evaluate("()=>LEVELS[475]._hgdm.prec.filter(p=>p.b<4).map(p=>[p.x,p.y,p.name])")
    cors=pg.evaluate("""()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,o=[];for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){if(M.bio[y*W+x]>3||L.rows[y][x]!=='.')continue;if((x*7+y*13)%61!==0)continue;o.push([x,y])}
      o.sort((a,b)=>((a[0]*31+a[1]*17)%101)-((b[0]*31+b[1]*17)%101));return o.slice(0,36)}""")
    def shot(x,y,f):
        pg.evaluate("""([x,y,f])=>{const L=LEVELS[475],ok=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';
          if(f<0){let best=0;f=0;[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],i)=>{let n=0;while(n<12&&ok(x+dx*(n+1),y+dy*(n+1)))n++;if(n>best){best=n;f=i}})}
          G.talk=null;G.cut=null;G.msgs=[];G.clock=12*60;const ang=(f-1)*Math.PI/2;G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=ang;G.C.x=x;G.C.y=y;G.C.a=ang;}""",[x,y,f])
        pg.wait_for_timeout(700)
        pg.evaluate("()=>{G.talk=null;G.msgs=[]}")
        im=Image.open(io.BytesIO(pg.screenshot(clip={'x':40,'y':10,'width':720,'height':350}))).convert('L')
        h=im.histogram();tot=sum(h);return sum(i*v for i,v in enumerate(h))/tot
    out={'hubs':{},'cors':[]}
    for x,y,n in hubs:
        v=[shot(x,y,f) for f in range(4)]
        out['hubs'][n+' %d,%d'%(x,y)]=[round(st.mean(v),1),round(min(v),1)]
    for x,y in cors: out['cors'].append([x,y,round(shot(x,y,-1),1)])
    hm=[a for a,_ in out['hubs'].values()]; cm=[c[2] for c in out['cors']]
    print('HUB mean',round(st.mean(hm),1),'min',min(hm)); 
    for k,v in out['hubs'].items(): print('  ',k,v)
    print('COR mean',round(st.mean(cm),1),'min',min(cm),'below45:',sum(1 for c in cm if c<45))
    json.dump(out,open(os.path.join(os.path.dirname(__file__),'north_lum2_%s.json'%tag),'w'));print(errs[-3:] if [e for e in errs if 'ERR_CONN' not in e] else 'no errors');b.close()
