import sys,json;sys.path.insert(0,'tools/polish')
from text_lib import *
from PIL import Image
KINDS=sys.argv[1].split(',')
JS='''([kind,dist,skip])=>{const L=LEVELS[475],op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
 const bl=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));
 const cand=G.decor.filter(d=>((d.k||'').indexOf('hgt_'+kind+'_')===0||(d.lk||'').indexOf('hgt_'+kind+'_')===0)&&op(d.x,d.y)).map(d=>{let best=null;for(const q of [[0,-1],[1,0],[0,1],[-1,0]]){let r=0;for(let i=1;i<=dist;i++){const x=d.x-q[0]*i,y=d.y-q[1]*i;if(!op(x,y)||bl.has(x+','+y))break;r=i}
   const wdm=d.pic&&d.wd?(q[0]===d.wd[0]&&q[1]===d.wd[1]):1;if(wdm&&(!best||r>best.r))best={r,q}}return {d,best}}).filter(c=>c.best&&c.best.r>=Math.min(dist,3)).sort((a,b)=>b.best.r-a.best.r);
 if(!cand.length)return null;const c=cand[skip%cand.length],d=c.d,q=c.best.q,r=Math.min(dist,c.best.r);
 const fx=d.x-q[0]*r,fy=d.y-q[1]*r,f=q[0]===0?(q[1]<0?0:2):(q[0]>0?1:3);
 G.P.x=fx;G.P.y=fy;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:fx,y:fy,a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [d.x,d.y,d.k,r,cand.length]}'''
with sync_playwright() as p:
    b,pg,errs=start(p)
    for kind in KINDS:
        ims=[]
        for dist in (1,3,5):
            r=pg.evaluate(JS,[kind,dist,0]);pg.wait_for_timeout(1500)
            f='tools/polish/text_shots/%s_%d.png'%(kind,dist);pg.screenshot(path=f)
            im=Image.open(f);W,H=im.size;ims.append(im.crop((W//2-300,H//2-250,W//2+300,H//2+200)));print(kind,dist,r)
        m=Image.new('RGB',(1800,450));[m.paste(a,(i*600,0)) for i,a in enumerate(ims)];m.save('tools/polish/text_shots/m_%s.png'%kind)
    print(errs[:3]);b.close()
