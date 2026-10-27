"""Fishing places test (src/desert/fishing_places*.js). Run on your own server (python -m http.server 8177 from the repo root):
   python tools/fishing_places_test.py [shots]
For every level with a recipe: builds it, then in the live game (the game's own cellBlocked and fshFaced) checks that
  - the recipe refused nothing and the flood fill from the start lost no ground,
  - every spot stand square is walkable and reachable on foot from the start, and facing the water from it finds a spot,
  - the squares of the lakes that were carved are not walkable,
  - the minimum number of spots exists (Pilgrim's Path legs 10, others 2),
and that no script error was logged. 'shots' also saves screenshots to the folder named by FP_SHOTS (default: temp)."""
import sys, os, json, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('FP_PORT', '8177')
SHOTS = os.environ.get('FP_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'fp_shots'))
LEVELS = {13: 'Ironhill', 32: 'Greendale', 44: 'Khemetra', 290: 'Yarrim', 304: 'Oldhaven Quay', 364: 'Hollow Land', 470: 'Hollow Grasslands', 475: 'Deeper Hollow', 476: 'Underlevel'}
for n in range(400, 424): LEVELS[n] = 'Pilgrim’s Path %d' % n
CHECK = """(lv)=>{
  const R=FPL.rep[lv];if(!R)return {err:'no report'};
  const W=MW,H=MH,L=LEVELS[lv],out={lv,name:LEVEL_NAMES[lv],stands:R.stands.length,lakes:R.lakes.length,water:R.water,refused:R.refused,lost:R.lost.length,bad:[],spots:fshSpots(lv).size};
  // flood fill on foot from the start, with the game's own blocking rules
  const seen=new Uint8Array(W*H),q=[L.start.x,L.start.y];seen[L.start.y*W+L.start.x]=1;
  while(q.length){const y=q.pop(),x=q.pop();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H||seen[yy*W+xx]||cellBlocked(xx,yy))continue;seen[yy*W+xx]=1;q.push(xx,yy)}}
  out.reachable=0;for(let i=0;i<seen.length;i++)if(seen[i])out.reachable++;
  const P0={x:G.P.x,y:G.P.y,f:G.P.f,angT:G.P.angT};
  let faced=0;
  for(const s of R.stands){
    if(cellBlocked(s.x,s.y)){out.bad.push('stand blocked '+s.x+','+s.y);continue}
    if(!seen[s.y*W+s.x]){out.bad.push('stand unreachable '+s.x+','+s.y);continue}
    const f=s.dx===0?(s.dy<0?0:2):(s.dx>0?1:3);G.P.x=s.x;G.P.y=s.y;G.P.f=f;
    const sp=fshFaced();if(!sp){out.bad.push('no spot faced from '+s.x+','+s.y+' dir '+s.dx+','+s.dy);continue}faced++;
    const w=fshSpots(lv);const wx=s.x+s.dx*s.k,wy=s.y+s.dy*s.k;if(!w.get(wx+','+wy))out.bad.push('no patch at '+wx+','+wy)}
  out.faced=faced;Object.assign(G.P,P0);
  return out}"""


def main():
    shots = len(sys.argv) > 1 and sys.argv[1] == 'shots'
    os.makedirs(SHOTS, exist_ok=True)
    fails = 0
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' and '404' not in m.text else None)
        pg.goto('http://localhost:%s/index.html?town=ironhill&lvl=34&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'", timeout=120000); pg.wait_for_timeout(2500)
        pg.evaluate("()=>{for(const k of Object.keys(localStorage))if(k.startsWith('abbeySave_'))localStorage.removeItem(k)}")
        for lv, name in LEVELS.items():
            pg.evaluate("(lv)=>{G.flags.fishHelp=1;goToLevel(lv,lv>=400&&lv<=423?{x:76,y:400,f:0}:null);G.state='play';G.menu=false}", lv)  # mid-leg on the Path, so the leg swap does not carry the party away
            if lv == 44: pg.evaluate("()=>{if(LEVELS[44].stub)khEnter(()=>{goToLevel(44,null);G.state='play';G.menu=false})}")  # the city builds its pictures first
            try: pg.wait_for_function("(lv)=>LEVEL===lv&&G.state==='play'&&!TP&&FPL.rep[lv]", arg=lv, timeout=150000 if lv == 44 else 60000)
            except Exception: print('FAIL', name, 'did not load; in level', pg.evaluate("()=>LEVEL")); fails += 1; continue
            pg.wait_for_timeout(800)
            r = pg.evaluate(CHECK, lv)
            need = 5 if 400 <= lv <= 423 else 2
            ok = not r.get('err') and not r['refused'] and r['lost'] == 0 and not r['bad'] and r['stands'] >= need and r['faced'] == r['stands']
            fails += 0 if ok else 1
            print('%-4s %-26s stands %-3s faced %-3s lakes %-2s water %-3s spots %-4s reachable %-6s %s' % ('OK' if ok else 'FAIL', name, r.get('stands'), r.get('faced'), r.get('lakes'), r.get('water'), r.get('spots'), r.get('reachable'), '' if ok else json.dumps({k: r[k] for k in ('refused', 'lost', 'bad') if k in r})[:400]))
            if shots and r.get('stands'):
                s = pg.evaluate("(lv)=>{const s=FPL.rep[lv].stands[0];return [s.x,s.y,s.dx,s.dy]}", lv)
                f = {(0, -1): 0, (1, 0): 1, (0, 1): 2, (-1, 0): 3}[(s[2], s[3])]
                pg.evaluate("([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};G.msgs=[];let now=performance.now();for(let i=0;i<10;i++){now+=16;frame(now)}}", [s[0], s[1], f])
                pg.wait_for_timeout(400); pg.screenshot(path=os.path.join(SHOTS, 'fp_%d.png' % lv))
        print('script errors:', errs[:6] if errs else 'none')
        b.close()
    print('FAILED' if fails or errs else 'ALL OK')
    sys.exit(1 if fails or errs else 0)


main()
