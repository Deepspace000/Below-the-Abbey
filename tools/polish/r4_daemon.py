"""Round 4 persistent browser. Queue dir r4_q: {"op":"eval","js":..,"arg":..} | {"op":"shot","path":..,"lvl":475,"x":..,"y":..,"f":..,"wait":..} | {"op":"reload"}"""
import json, time, pathlib, os
from playwright.sync_api import sync_playwright
H = pathlib.Path(__file__).resolve().parent
Q = H / 'r4_q'
PORT = int(os.environ.get('R4PORT', '8340'))
errs = []
GO = """([lvl,x,y,f,back])=>{if(!LEVELS[lvl]&&KH_LAZY[lvl])KH_LAZY[lvl]();G.cut=null;G.talk=null;G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max=9999});
 if(G.heroes[0]&&!G.heroes[0].eq.off)G.heroes[0].eq.off=mkItem("torch");
 if(LEVEL!==lvl)goToLevel(lvl,{x,y,f});
 const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));const op=(a,b)=>G.grid[b]&&G.grid[b][a]===0&&!blk.has(a+','+b);
 let best=null,bd=1e9;for(let yy=Math.max(1,y-6);yy<Math.min(G.grid.length-1,y+7);yy++)for(let xx=Math.max(1,x-6);xx<Math.min(G.grid[0].length-1,x+7);xx++){if(!op(xx,yy))continue;const d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bd){bd=d;best=[xx,yy]}}
 if(!best)best=[x,y];
 const DD=[[0,-1],[1,0],[0,1],[-1,0]][f%4];for(let k=back||0;k>=1;k--){let ok=true;for(let i=1;i<=k;i++)if(!op(x-DD[0]*i,y-DD[1]*i))ok=false;if(ok){best=[x-DD[0]*k,y-DD[1]*k];break}}
 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};if(G.lvlBanners)G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [LEVEL,best]}"""
def load(pg):
    errs.clear()
    pg.goto('http://localhost:%d/index.html?town=deephollow&lvl=34&v=%d' % (PORT, time.time()), wait_until='commit', timeout=90000); pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof G!=="undefined"&&G.state==="play"&&LEVEL===475', timeout=420000); pg.wait_for_timeout(6000)
with sync_playwright() as p:
    exe = os.environ.get('BTA_CHROME')
    kw = {'executable_path': exe} if exe else {}
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], **kw)
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    load(pg); (Q / 'ready').write_text('1')
    while True:
        for f in sorted(Q.glob('*.json')):
            try:
                c = json.loads(f.read_text(encoding='utf-8')); out = None
                if c['op'] == 'reload': (Q / 'ready').unlink(missing_ok=True); load(pg); (Q / 'ready').write_text('1'); out = 'reloaded'
                elif c['op'] == 'eval': out = pg.evaluate(c['js'], c.get('arg'))
                elif c['op'] == 'shot':
                    r = pg.evaluate(GO, [c.get('lvl', 475), c['x'], c['y'], c.get('f', 0), c.get('back', 0)]); pg.wait_for_timeout(c.get('wait', 1200)); pg.screenshot(path=c['path']); out = r
                (Q / (f.stem + '.out')).write_text(json.dumps({'r': out, 'errs': errs[:8]}), encoding='utf-8')
            except Exception as e:
                (Q / (f.stem + '.out')).write_text(json.dumps({'err': str(e)[:500], 'errs': errs[:8]}), encoding='utf-8')
            f.unlink()
        time.sleep(.4)
