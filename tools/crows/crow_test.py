"""Crow screenshots on your OWN server (python -m http.server 8354 from the repo root):  python tools/crows/crow_test.py [wood|yard|all]
One browser at a time, closed at the end. Pictures go to _crow_shots/."""
import sys, time, json, pathlib, os
from playwright.sync_api import sync_playwright
PORT = os.environ.get('CROW_PORT', '8354')
OUT = pathlib.Path(__file__).resolve().parent.parent.parent / '_crow_shots'; OUT.mkdir(exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'all'
# stand in a free spot with a clear line of eight squares ahead, put a foe d squares in front, freeze it
SETUP = """([t,d,hurt])=>{
  const blk=new Set(G.decor.filter(q=>(q.block&&!q.found)).map(q=>q.x+','+q.y));
  const free=(x,y)=>G.grid[y]&&G.grid[y][x]===0&&!blk.has(x+','+y);
  const DX=[0,1,0,-1],DY=[-1,0,1,0];
  if(!window.__spot){let best=null;const c=[G.P.x,G.P.y];
    for(let y=2;y<G.grid.length-2&&!best;y++)for(let x=2;x<G.grid[0].length-2&&!best;x++)for(let f=0;f<4;f++){let ok=true;for(let k=0;k<=8;k++){const xx=x+DX[f]*k,yy=y+DY[f]*k;if(!free(xx,yy)){ok=false;break}}if(ok){best=[x,y,f];break}}
    window.__spot=best}
  const [x,y,f]=window.__spot;G.enemies=G.enemies.filter(q=>false);
  G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};
  addEnemy(t,x+DX[f]*d,y+DY[f]*d,false);const e=G.enemies[G.enemies.length-1];e.chilled=99999;e.alert=false;
  if(hurt){e.hp=Math.max(1,Math.round(e.maxhp*hurt))}
  G.msgs=[];G.lvlBanners.length=0;G.talk=null;return [window.__spot,e.t,e.hp,e.maxhp,ENEMY_DEF[t].img,ENEMY_DEF[t].w,ENEMY_DEF[t].floatH,typeof CROW!=='undefined'&&CROW.on]}"""

def boot(p, url):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 640})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.on('response', lambda r: errs.append('HTTP %d %s' % (r.status, r.url)) if r.status >= 400 else None)
    pg.goto(url, wait_until='domcontentloaded', timeout=120000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=500", timeout=180000)
    pg.wait_for_timeout(4000)
    return b, pg, errs

def shot(pg, name):
    path = str(OUT / (name + '.png')); pg.screenshot(path=path); print('shot', name)

def run(url, plan, tag):
    with sync_playwright() as p:
        b, pg, errs = boot(p, url)
        try:
            for name, t, d, hurt, waits in plan:
                r = pg.evaluate(SETUP, [t, d, hurt]); print(name, json.dumps(r))
                for i, w in enumerate(waits):
                    pg.wait_for_timeout(w); shot(pg, '%s_%s%s' % (tag, name, '' if len(waits) == 1 else '_f%d' % i))
        finally:
            print('ERRS', errs[:10]); b.close()

if what in ('wood', 'all'):
    plan = []
    for t in ('wwcrows', 'wwcrow'):
        for d in (2, 4, 6): plan.append(('%s_d%d' % (t, d), t, d, 0, [900]))
    plan.append(('wwcrow_cycle', 'wwcrow', 3, 0, [250, 250, 250]))
    plan.append(('wwcrows_cycle', 'wwcrows', 3, 0, [250, 250, 250]))
    plan.append(('wwcrow_hurt', 'wwcrow', 2, .15, [600]))
    run('http://localhost:%s/index.html?town=witchwood&lvl=82&v=%d' % (PORT, time.time()), plan, 'wood')
if what in ('yard', 'all'):
    plan = [('gyraven_d2', 'gyraven', 2, 0, [900]), ('gyraven_d4', 'gyraven', 4, 0, [900]), ('gyraven_cycle', 'gyraven', 3, 0, [250, 250, 250])]
    run('http://localhost:%s/index.html?town=graveyard&lvl=84&v=%d' % (PORT, time.time()), plan, 'yard')
