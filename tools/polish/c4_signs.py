import json,time,pathlib
from playwright.sync_api import sync_playwright
H=pathlib.Path(__file__).resolve().parent
OUT=H/'c4_shots'
JS="""()=>{const L=LEVELS[475];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
const op=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
const sg=L.decor.filter(d=>d.hgt&&zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+4));
const seen={};const out=[];
for(const d of sg){const k=d.hgtBase+(d.pic?'W':'F');if((seen[k]=(seen[k]||0)+1)>2)continue;out.push({k,x:d.x,y:d.y,wd:d.wd||null,lab:d.hgt,pic:!!d.pic})}
return {n:sg.length,wall:sg.filter(d=>d.pic).length,out}}"""
GO="""([x,y,wd,DD])=>{const L=LEVELS[475],op=(a,b)=>L.rows[b]&&L.rows[b][a]==='.';
const dirs=[[0,-1,0],[1,0,1],[0,1,2],[-1,0,3]];let best=null;
const cand=wd?dirs.filter(d=>d[0]===wd[0]&&d[1]===wd[1]).concat(dirs.filter(d=>!(d[0]===wd[0]&&d[1]===wd[1]))):dirs;
for(const [dx,dy,f] of cand){for(const dist of [DD,1,2,3]){let ok=true;for(let i=1;i<=dist;i++)if(!op(x-dx*i,y-dy*i))ok=false;if(ok){best=[x-dx*dist,y-dy*dist,f];break}}if(best)break}
if(!best)best=[x,y,0];G.P.x=best[0];G.P.y=best[1];G.P.f=best[2];G.P.angT=(best[2]-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners.length=0;G.msgs=[];G.talk=null;return best}"""
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    errs=[];pg.on('pageerror',lambda e:(errs.append(str(e)),print('PAGEERR',str(e)[:200],(getattr(e,'stack','') or '')[:600],flush=True)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8362/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=90000);pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t',timeout=900000);pg.wait_for_timeout(4000)
    print('loaded',flush=True);r=pg.evaluate(JS);print(r['n'],r['wall'],flush=True)
    for i,s in enumerate(r['out']):
        for dist in (2,):
            g=pg.evaluate(GO,[s['x'],s['y'],s['wd'],dist]);pg.wait_for_timeout(1100);fn='s_%02d_%s.png'%(i,s['k']);pg.screenshot(path=str(OUT/fn));print(fn,s['x'],s['y'],s['wd'],g,s['lab'],flush=True)
    # specific
    for n,(x,y,wd,d) in {'dunewell_giver':(42,90,None,3),'hedge_giver':(112,179,None,3),'lantern_giver':(15,11,None,3)}.items():
        pg.evaluate(GO,[x,y,wd,d]);pg.wait_for_timeout(1100);pg.screenshot(path=str(OUT/(n+'.png')))
    print('ERRS',errs[:5]);b.close()
print('DONE')
