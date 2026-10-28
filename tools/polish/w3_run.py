"""One browser session, many steps. python tools/polish/e2_run.py step step ...   (server 8334)
 step:  js:<file>            run a js file (an arrow function), print json
        go:<lvl>             goToLevel(lvl, start)
        shot:<lvl>:<x>,<y>,<f>:<name>   place party exactly (or nearest free) and screenshot to tools/polish/shots/e2_<name>.png
        look:<lvl>:<x>,<y>:<name>       look AT square x,y from 2-3 squares away
        wait:<ms>"""
import sys, time, pathlib, json
from playwright.sync_api import sync_playwright
OUT=pathlib.Path('tools/polish/shots'); OUT.mkdir(parents=True,exist_ok=True)
SNAP="""([x,y,f])=>{const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));const op=(a,b)=>G.grid[b]&&G.grid[b][a]===0&&!blk.has(a+','+b);let best=null,bd=1e9;for(let yy=1;yy<G.grid.length-1;yy++)for(let xx=1;xx<G.grid[0].length-1;xx++){if(!op(xx,yy))continue;const d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bd){bd=d;best=[xx,yy]}}
 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners&&(G.lvlBanners.length=0);G.msgs=[];G.talk=null;if(G.uw&&G.uw.air!==undefined)G.uw.air=240;return best}"""
LOOK="""([tx,ty])=>{const op=(x,y)=>G.grid[y]&&G.grid[y][x]===0;for(let dist=3;dist>=1;dist--)for(let f=0;f<4;f++){const d=DIRS[f];let ok=true;for(let k=1;k<=dist;k++)if(!op(tx-d[0]*k,ty-d[1]*k))ok=false;if(ok)return [tx-d[0]*dist,ty-d[1]*dist,f]}
 return [tx,ty,0]}"""
GO="""(l)=>{G.heroes.forEach(h=>{h.hp=h.max=9999});(KH_LAZY[l]&&KH_LAZY[l]());const s=LEVELS[l].start;goToLevel(l,{x:s.x,y:s.y,f:0});return LEVEL}"""
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8334/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=420000,polling=1000); pg.wait_for_timeout(8000)
    cur=475
    for st in sys.argv[1:]:
        k,_,rest=st.partition(':')
        try:
            if k=='js': print(json.dumps(pg.evaluate(open(rest).read()))[:12000])
            elif k=='wait': pg.wait_for_timeout(int(rest))
            elif k=='go': cur=int(rest); print('go',pg.evaluate(GO,cur)); pg.wait_for_timeout(2500)
            elif k in('shot','look'):
                lv,pos,name=rest.split(':')
                if int(lv)!=cur: cur=int(lv); pg.evaluate(GO,cur); pg.wait_for_timeout(2500)
                if k=='look':
                    tx,ty=[int(v) for v in pos.split(',')]; x,y,f=pg.evaluate(LOOK,[tx,ty])
                else: x,y,f=[int(v) for v in pos.split(',')]
                r=pg.evaluate(SNAP,[x,y,f]); pg.wait_for_timeout(1100); pg.evaluate("()=>{G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max})}")
                pg.screenshot(path=str(OUT/('e2_%s.png'%name))); print('shot',name,r,f)
        except Exception as e: print('ERR',st,str(e)[:300])
    print('errs',errs[:8]); b.close()
