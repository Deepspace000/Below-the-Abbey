import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
from PIL import Image
import numpy as np
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots')
tag=sys.argv[1]; orb='orb' in sys.argv
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem(%s);G.lightLevel=1}'%("'glowOrb'" if orb else "'torch'"))
    pts=pg.evaluate('''()=>{const L=LEVELS[476],O=L._hgdo,W=201,land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*W+x]!==1;const DV=[[0,-1],[1,0],[0,1],[-1,0]];
      const ks=Object.keys(HGPD.cl).filter(k=>(!HGPD.lamp||k!==HGPD.lamp.join(','))&&!L.decor.some(d=>d.npc==='wm_orbframe'&&d.x+','+d.y===k)).map(k=>k.split(',').map(Number));const out=[];
      for(let i=0;i<ks.length&&out.length<14;i+=Math.max(1,Math.floor(ks.length/14))){const [x,y]=ks[i];
        let best=null;for(let f=0;f<4&&!best;f++)for(const n of [4,3,5,2]){const px=x-DV[f][0]*n,py=y-DV[f][1]*n;let ok=true;for(let m=1;m<=n;m++)if(!land(x-DV[f][0]*m,y-DV[f][1]*m))ok=false;if(ok){best=[px,py,f];break}}
        if(best)out.push(best.concat([x,y]))}return out}''')
    stats=[]
    for i,(x,y,f,lx,ly) in enumerate(pts):
        pg.evaluate('''([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}''',[x,y,f])
        pg.wait_for_timeout(1500); pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];'); pg.wait_for_timeout(300)
        fp=str(OUT/('%s_w%d.png'%(tag,i)))
        pg.screenshot(path=fp,clip={'x':0,'y':40,'width':840,'height':420})
        a=np.array(Image.open(fp).convert('L')).astype(float)
        stats.append((i,round(a.mean(),1),round((a<14).mean()*100,1)))
        print(i,(x,y,f),'light',(lx,ly),'mean',stats[-1][1],'black%',stats[-1][2])
    print('MEAN lum',round(np.mean([s[1] for s in stats]),1),'black%',round(np.mean([s[2] for s in stats]),1))
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
