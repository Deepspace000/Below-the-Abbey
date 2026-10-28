"""python tools/polish/e_shot.py <level> x,y,f name x,y,f name ...  (server 8364) -> tools/polish/shots/e_<name>.png"""
import sys, time, pathlib, json
from playwright.sync_api import sync_playwright
OUT=pathlib.Path('tools/polish/shots'); OUT.mkdir(parents=True,exist_ok=True)
lv=int(sys.argv[1]); args=sys.argv[2:]; spots=[(args[i],args[i+1]) for i in range(0,len(args),2)]
SNAP="""([x,y,f])=>{G.uw=G.uw||null;const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));let best=null,bd=1e9;for(let yy=1;yy<G.grid.length-1;yy++)for(let xx=1;xx<G.grid[0].length-1;xx++){if(G.grid[yy][xx]!==0||blk.has(xx+','+yy))continue;const d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bd){bd=d;best=[xx,yy]}}
 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners&&(G.lvlBanners.length=0);G.msgs=[];G.talk=null;if(G.uw&&G.uw.air!==undefined)G.uw.air=240;return best}"""
LOOK="""([tx,ty])=>{const op=(x,y)=>G.grid[y]&&G.grid[y][x]===0;for(let dist=2;dist<=3;dist++)for(let f=0;f<4;f++){const d=DIRS[f];let ok=true;for(let k=1;k<=dist;k++)if(!op(tx-d[0]*k,ty-d[1]*k))ok=false;if(ok)return [tx-d[0]*dist,ty-d[1]*dist,f]}
 for(let f=0;f<4;f++){const d=DIRS[f];if(op(tx-d[0],ty-d[1]))return [tx-d[0],ty-d[1],f]}return [tx,ty,0]}"""
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8344/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=240000); pg.wait_for_timeout(12000)
    pg.evaluate("(l)=>{G.heroes.forEach(h=>{h.hp=h.max=9999});(KH_LAZY[l]&&KH_LAZY[l]());const s=LEVELS[l].start;goToLevel(l,{x:s.x,y:s.y,f:0})}",lv); pg.wait_for_timeout(2500)
    for pos,name in spots:
        if pos.startswith('@'):
            tx,ty=[int(v) for v in pos[1:].split(',')]
            x,y,f=pg.evaluate(LOOK,[tx,ty])
        else:
            x,y,f=[int(v) for v in pos.split(',')]
        r=pg.evaluate(SNAP,[x,y,f]); pg.wait_for_timeout(900); pg.evaluate("()=>{G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max})}")
        pg.screenshot(path=str(OUT/('e_%s.png'%name))); print(name,r)
    print('errs',errs[:6]); b.close()
