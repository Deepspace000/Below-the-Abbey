import sys, json, pathlib
sys.path.insert(0,'tools/polish/c3tmp')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/c3shots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    plan=pg.evaluate('''()=>{const L=LEVELS[476],O=L._hgdo,DVS=[[0,-1],[1,0],[0,1],[-1,0]];
     const land=(x,y)=>L.rows[y]&&L.rows[y][x]==='.'&&O.wm[y*201+x]!==1;const out=[];
     const view=(d,tag,n)=>{for(let f=0;f<4;f++){for(const k of [n,n-1,1]){const x=d.x-DVS[f][0]*k,y=d.y-DVS[f][1]*k;if(land(x,y)&&land(x+DVS[f][0],y+DVS[f][1])||(land(x,y)&&k===n)){out.push([x,y,f,tag+'_'+d.x+'_'+d.y]);return}}}};
     const orbs=L.decor.filter(d=>/orbframe/.test(d.k));orbs.slice(0,4).forEach(d=>view(d,'orb',2));
     const signs=L.decor.filter(d=>d.pic&&/rune|board|hook/.test(d.k)).slice(0,30);
     // read-from sign
     const pick=[signs[0],signs[5],signs[9],signs[14],signs[20]].filter(Boolean);
     pick.forEach(d=>{const fx=d.wd?d.wd[0]:0,fy=d.wd?d.wd[1]:0;const f=DVS.findIndex(q=>q[0]===fx&&q[1]===fy);const x=d.x-DVS[f][0]*0,y=d.y;out.push([d.x,d.y,f,'sign_'+d.k+'_'+d.x+'_'+d.y])});
     return out}''')
    for i,(x,y,f,tag) in enumerate(plan):
        pg.evaluate('''([x,y,f])=>{G.cut=null;G.talk=null;G.msgs=[];goToLevel(476,{x,y,f});hgoFace(f)}''',[x,y,f])
        pg.wait_for_timeout(1500)
        pg.evaluate('G.cut=null;G.talk=null;G.msgs=[];')
        pg.wait_for_timeout(300)
        pg.screenshot(path=str(OUT/('x%02d_%s.png'%(i,tag))))
        print(i,tag,x,y,f)
    # perf: time to build level
    t=pg.evaluate('()=>LEVELS[476]._hgpd.ms')
    print('polish ms',t)
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
