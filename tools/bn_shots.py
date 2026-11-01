"""Playwright helper for the bone remains: python tools/bn_shots.py probe|shot ...  (own server on PS_PORT, BTA_CHROME)
   probe L1,L2,..          prints the bone-like decor of each level
   shot  OUTDIR L:x,y,f ... screenshots of the level standing at x,y facing f (0 N,1 E,2 S,3 W); L alone = the first remains
"""
import sys, os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8831')
HELP = r"""
window.T={wait:ms=>new Promise(r=>setTimeout(r,ms)),
 go:async(n,x,y,f)=>{for(let t=0;t<6&&LEVEL!==n;t++){goToLevel(n,x===undefined?undefined:{x,y,f});for(let i=0;i<80&&LEVEL!==n;i++)await T.wait(100);await T.wait(900)}
  if(x!==undefined){G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT}}G.enemies=[];G.lockT=0;G.cut=null;G.talk=null;G.loot=null;await T.wait(1500)},
 bone:d=>/bone|skel|skull|ribs|corpse|^ep_bn2?_/.test(d.k)};
"""
AUTOJS = r"""K=>{const ok=(x,y)=>G.grid[y]&&G.grid[y][x]===0&&!G.decor.some(d=>d.block&&d.x===x&&d.y===y);const L=G.decor.filter(d=>T.bone(d)&&!d.hidden&&!/^(gy_|hpa_|art_)/.test(d.k)),out=[],used=[];
 const step=Math.max(1,Math.floor(L.length/K));for(let i=0;i<L.length&&out.length<K;i+=step){const d=L[i];
  for(const [dx,dy,f] of [[0,2,0],[0,-2,2],[2,0,3],[-2,0,1],[0,3,0],[0,-3,2],[3,0,3],[-3,0,1],[0,1,0],[0,-1,2],[1,0,3],[-1,0,1]]){const x=d.x+dx,y=d.y+dy;if(ok(x,y)&&ok(d.x+dx/2|0,d.y+dy/2|0)){out.push([x,y,f,d.k]);break}}}return out}"""
def boot(p):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    pg.on('pageerror', lambda e: print('PAGEERR', e))
    pg.goto('http://localhost:%s/%s?town=oldhaven&lvl=10&v=%d' % (PORT, os.environ.get('PS_PAGE','index.html'), int(time.time())), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'", timeout=150000)
    pg.wait_for_function("()=>LEVEL===305", timeout=120000)
    pg.wait_for_timeout(3000); pg.evaluate(HELP)
    return b, pg
if __name__ == '__main__':
    mode = sys.argv[1]
    with sync_playwright() as p:
        b, pg = boot(p)
        if mode == 'probe':
            for n in [int(v) for v in sys.argv[2].split(',')]:
                r = pg.evaluate("""async n=>{await T.go(n);const L=LEVELS[n];if(!L)return null;return {w:G.grid[0].length,h:G.grid.length,kind:L.kind,ep:!!EP_SPEC[n],n:G.decor.length,b:G.decor.filter(T.bone).map(d=>[d.k,d.x,d.y,d.block?1:0,d.sc||''].join(' '))}}""", n)
                print(n, json.dumps(r)[:900])
        elif mode == 'shot':
            out = sys.argv[2]; os.makedirs(out, exist_ok=True)
            for a in sys.argv[3:]:
                n, _, rest = a.partition(':'); n = int(n)
                if rest:
                    x, y, f = [int(v) for v in rest.split(',')]
                else:
                    x = y = f = None
                pg.evaluate("async([n,x,y,f])=>{await T.go(n,x===null?undefined:x,y,f)}", [n, x, y, f])
                nm = '%s/%d_%s.png' % (out, n, rest.replace(',', '_') if rest else 'start')
                pg.screenshot(path=nm, clip={'x': 0, 'y': 0, 'width': 780, 'height': 400}); print(nm)
        elif mode == 'scan':
            r = pg.evaluate("""()=>{const ks=new Set([...Object.keys(LEVELS),...(typeof KH_LAZY!=='undefined'?Object.keys(KH_LAZY):[])]);const out={};
              for(const n of ks){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]()}catch(e){}const L=LEVELS[n];if(!L||!L.decor)continue;const c={};for(const d of L.decor)if(/^(bones|dbones|ep_bonepile|ep_skel_slump|coffin)$/.test(d.k))c[d.k]=(c[d.k]||0)+1;if(c.bones||c.dbones||c.ep_bonepile||c.ep_skel_slump)out[n]=[(L.rows||[]).length+'x'+((L.rows||[''])[0].length),c]}return out}""")
            for n in sorted(r, key=int): print(n, json.dumps(r[n]))
        elif mode == 'auto':   # auto OUTDIR LEVEL K [filter]: stands 2 squares from up to K remains of the level, looking at them
            out = sys.argv[2]; os.makedirs(out, exist_ok=True)
            for a in sys.argv[3:]:
                n, K = [int(v) for v in a.split(':')]
                pg.evaluate("async n=>{await T.go(n)}", n)
                spots = pg.evaluate(AUTOJS, K)
                for i, (x, y, f, k) in enumerate(spots):
                    pg.evaluate("async([n,x,y,f])=>{await T.go(n,x,y,f)}", [n, x, y, f])
                    nm = '%s/%d_%d_%s.png' % (out, n, i, k); pg.screenshot(path=nm, clip={'x': 0, 'y': 0, 'width': 780, 'height': 400}); print(nm, x, y, f)
        b.close()
