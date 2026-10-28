"""Critic round 4, water zone: persistent browser on port 8363. Drop ec4_q/<n>.json:
  {"op":"eval","js":"()=>...","arg":..}
  {"op":"shot","path":"x.png","tx":..,"ty":..,"f":0..3,"wait":ms}   (snaps to the nearest open square, faces f, saves a 1100x760 shot, returns pos + mean luminance of the 3D view)
  {"op":"shotraw","path":"x.png"}   (no move)
  {"op":"frames","ms":3000}          (counts rAF frames)
  {"op":"reload"}
result goes to ec4_q/<n>.out"""
import json, time, pathlib, io
from PIL import Image, ImageStat
from playwright.sync_api import sync_playwright

HERE = pathlib.Path(__file__).resolve().parent
Q = HERE / 'ec4_q'
Q.mkdir(exist_ok=True)
errs = []
warns = []
fails = []

SNAP = """([x,y,f])=>{const blk=new Set(G.decor.filter(d=>d.block&&!d.found).map(d=>d.x+','+d.y));const op=(a,b)=>G.grid[b]&&G.grid[b][a]===0&&!blk.has(a+','+b);let best=null,bd=1e9;for(let yy=1;yy<G.grid.length-1;yy++)for(let xx=1;xx<G.grid[0].length-1;xx++){if(!op(xx,yy))continue;const d=Math.abs(xx-x)+Math.abs(yy-y);if(d<bd){bd=d;best=[xx,yy]}}
 G.P.x=best[0];G.P.y=best[1];G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x:best[0],y:best[1],a:G.P.angT};G.lvlBanners&&(G.lvlBanners.length=0);G.msgs=[];G.talk=null;if(G.uw&&G.uw.air!==undefined)G.uw.air=240;G.heroes.forEach(h=>{h.hp=h.max=9999});return best}"""


def lum(png, crop=(5, 5, 955, 485)):
    return ImageStat.Stat(Image.open(io.BytesIO(png)).convert('L').crop(crop)).mean[0]


def load(pg):
    errs.clear()
    pg.goto('http://localhost:8363/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=120000)
    pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof G!=="undefined"&&G.state==="play"&&LEVEL===475', timeout=480000)
    pg.wait_for_timeout(8000)


with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e) + ' || ' + str(getattr(e, 'stack', ''))[:900]))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text + ' @ ' + str(m.location)) if m.type == 'error' and 'Failed to load' not in m.text else (warns.append(m.text) if m.type == 'warning' else None))
    pg.on('requestfailed', lambda r: fails.append(r.url[-70:] + ' ' + str(r.failure)))
    load(pg)
    health = pg.evaluate("()=>({miss:DS_PAINTED.filter(n=>!IMG['art_'+n]).length,total:DS_PAINTED.length,fl4:!!G.fl4})")
    (Q / 'ready').write_text(json.dumps({'health': health, 'nfails': len(fails), 'fails': fails[:10]}))
    while True:
        for f in sorted(Q.glob('*.json')):
            try:
                c = json.loads(f.read_text(encoding='utf-8'))
                out = None
                if c['op'] == 'quit':
                    (Q / (f.stem + '.out')).write_text(json.dumps({'r': 'bye'}), encoding='utf-8')
                    f.unlink()
                    b.close()
                    raise SystemExit
                if c['op'] == 'reload':
                    (Q / 'ready').unlink(missing_ok=True)
                    load(pg)
                    (Q / 'ready').write_text('1')
                    out = 'reloaded'
                elif c['op'] == 'eval':
                    out = pg.evaluate(c['js'], c.get('arg'))
                elif c['op'] == 'frames':
                    out = pg.evaluate("(ms)=>new Promise(r=>{let n=0,t0=performance.now(),mx=0,last=t0;function f(t){n++;mx=Math.max(mx,t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else r({n:n,ms:t-t0,fps:n*1000/(t-t0),maxGap:mx})}requestAnimationFrame(f)})", c.get('ms', 3000))
                elif c['op'] == 'shotraw':
                    pg.wait_for_timeout(c.get('wait', 1200))
                    png = pg.screenshot(path=c['path'])
                    out = {'lum': round(lum(png), 1)}
                elif c['op'] == 'shot':
                    r = pg.evaluate(SNAP, [c['tx'], c['ty'], c.get('f', 0)])
                    pg.wait_for_timeout(c.get('wait', 1200))
                    pg.evaluate("()=>{G.msgs=[];G.heroes.forEach(h=>{h.hp=h.max=9999})}")
                    png = pg.screenshot(path=c['path'])
                    out = {'pos': r, 'lum': round(lum(png), 1)}
                (Q / (f.stem + '.out')).write_text(json.dumps({'r': out, 'errs': errs[:12], 'nerr': len(errs), 'nfail': len(fails)}), encoding='utf-8')
            except Exception as e:
                (Q / (f.stem + '.out')).write_text(json.dumps({'err': str(e)[:600], 'errs': errs[:12], 'nerr': len(errs), 'nfail': len(fails)}), encoding='utf-8')
            f.unlink()
        time.sleep(.3)
