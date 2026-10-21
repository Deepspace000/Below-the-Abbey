"""Headless test of the deathtrap on floor 20 of the Orange Spire (src/desert/hollow_traps.js).

    python -m http.server 8385          (from the repo root, in another terminal)
    python tools/test_deathtrap.py [http://127.0.0.1:8385] [--shots folder]

It builds level 459, checks the maze traps by flood fill, drives the game by hand (the page's own frame() with fixed steps, so the run is the
same every time) and prints PASS or FAIL for every check. --shots saves screenshots.
"""
import sys, time, json, pathlib
from playwright.sync_api import sync_playwright

BASE = next((a for a in sys.argv[1:] if a.startswith('http')), 'http://127.0.0.1:8385')
SHOTS = None
if '--shots' in sys.argv:
    SHOTS = pathlib.Path(sys.argv[sys.argv.index('--shots') + 1]); SHOTS.mkdir(parents=True, exist_ok=True)
D4 = [(0, -1), (1, 0), (0, 1), (-1, 0)]
FAILS = []

def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra) if extra != '' else ''))
    if not ok: FAILS.append(name)

LIB = r'''
window.T={now:performance.now()+5000,
  stop(){window.requestAnimationFrame=()=>0},
  frames(n,ms){ms=ms||16.67;for(let i=0;i<n;i++){T.now+=ms;frame(T.now)}},
  secs(s){T.frames(Math.round(s*60))},
  settle(){let i=0;while(!camSettled()&&i++<400)T.frames(1)},
  place(x,y,f){G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=[-Math.PI/2,0,Math.PI/2,Math.PI][f];G.C.x=x;G.C.y=y;G.C.a=G.P.angT;G.msgs=[];G.cut=null;G.talk=null;G.timers.length=0;T.frames(2)},
  mv(dir){const rel=(dir-G.P.f+4)%4;T.settle();G.timers.length=0;act(['fwd','right','back','left'][rel]);return [G.P.x,G.P.y]},
  hp(){return G.heroes.map(h=>h.hp)},msgs(){return G.msgs.map(m=>m.text)},heal(){G.heroes.forEach(h=>{h.hp=h.max;h.alive=true})},
  quiet(){const F=HLF();F.tr=F.tr||{};F.warn={};for(const s of LEVELS[459]._scares)F.tr['459:'+s.x+','+s.y]=1},
  setCls(i,name,dex){HERO_DEF[i].cls=name;HERO_DEF[i].clsId=CLASSES.findIndex(c=>c.name===name);G.heroes[i].dex=dex;G.heroes[i].alive=true;G.heroes[i].hp=G.heroes[i].max;G.heroes[i].mp=G.heroes[i].mpMax}};0
'''

STATIC = r'''(()=>{
const L=LEVELS[459],rows=L.rows,M=L._maze,out={},key=(x,y)=>x+','+y;
const open=(x,y)=>x>=M.x0&&x<=M.x1&&y>=M.y0-1&&y<=M.y1+1&&rows[y][x]==='.';
const E=L._mazeInfo.E,X=L._mazeInfo.X,dist=new Map(),par=new Map(),q=[E];dist.set(key(...E),0);
for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+a,ny=y+b;if(open(nx,ny)&&!dist.has(key(nx,ny))){dist.set(key(nx,ny),dist.get(key(x,y))+1);par.set(key(nx,ny),[x,y]);q.push([nx,ny])}}}
out.solvable=dist.has(key(X[0],X[1]));out.exitDist=dist.get(key(X[0],X[1]));
const sol=new Set();for(let c=X;c;c=par.get(key(...c)))sol.add(key(...c));
const seen=new Set();out.overlap=0;out.nearEntry=0;
for(const t of L._traps){const k=key(t.x,t.y);if(seen.has(k))out.overlap++;seen.add(k);if((dist.get(k)||99)<=5)out.nearEntry++}
out.nFire=L._traps.filter(t=>t.t==='fire').length;out.nSpike=L._traps.filter(t=>t.t==='spike').length;
out.spikeFloor=L._traps.filter(t=>t.t==='spike').every(t=>L.fmap[t.y][t.x]==='5')&&L.floorSet[5]==='hlspike';
out.fireOnFloor5=L._traps.filter(t=>t.t==='fire').some(t=>L.fmap[t.y][t.x]==='5');
out.onWay=L._traps.filter(t=>sol.has(key(t.x,t.y))).length;
const V=HLT_V,T0=HLT_T0,R=HLT_R,STEP=HLT_STEP;
function sim(t,path,delays){const dir=[-t.u[0],-t.u[1]];
  for(let tm=0;tm<6;tm+=.004){let k=0;if(tm>=R)k=Math.min(path.length-1,1+Math.floor((tm-R)/STEP));const pt=path[k];
    for(const d of delays){const s=V*(tm-(T0+d));if(s<0)continue;const bx=t.S[0]+.5+dir[0]*s,by=t.S[1]+.5+dir[1]*s;
      if((bx-t.end[0]-.5)*dir[0]+(by-t.end[1]-.5)*dir[1]>0)continue;
      if(Math.abs(bx-(pt[0]+.5))<.5&&Math.abs(by-(pt[1]+.5))<.5)return false}}return true}
out.plates=L._traps.filter(t=>t.t==='fire').map(t=>{
  const online=new Set();for(let s=0;s<=t.n+t.m;s++)online.add(key(t.x+t.u[0]*(t.n-s),t.y+t.u[1]*(t.n-s)));
  const paths=[],rec=p=>{const last=p[p.length-1];if(p.length>1&&!online.has(key(...last))){paths.push(p.slice());return}if(p.length>=4)return;
    for(const [a,b] of [[0,-1],[1,0],[0,1],[-1,0]]){const nx=last[0]+a,ny=last[1]+b;if(open(nx,ny)&&!p.some(z=>z[0]===nx&&z[1]===ny))rec(p.concat([[nx,ny]]))}};rec([[t.x,t.y]]);
  const dl=t.two?[0,.95]:[0],good=paths.filter(p=>sim(t,p,dl)&&!p.some(z=>L._traps.some(w=>w.t==='spike'&&w.x===z[0]&&w.y===z[1])));
  return {x:t.x,y:t.y,n:t.n,dodge:good.length>0,steps:good.length?Math.min(...good.map(p=>p.length-1)):null,staysHit:!sim(t,[[t.x,t.y]],dl)}});
const inM=(x,y)=>x>=M.x0-1&&x<=M.x1+1&&y>=M.y0-2&&y<=M.y1+1;
out.enemiesInMaze=L.enemies.filter(e=>inM(e.x,e.y)).length;out.secretsInMaze=(L._secrets||[]).filter(s=>inM(s.x,s.y)).length;out.trigInMaze=(L._trig||[]).filter(s=>inM(s.x,s.y)).length;
out.scareOnTrap=L._scares.filter(s=>L._traps.some(t=>t.x===s.x&&t.y===s.y)).length;out.nScares=L._scares.length;
out.letters=L._letters.map(l=>l.k).join('');out.doors=(L._ldoors||[]).length;
return out})()'''

with sync_playwright() as p:
    b = p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('console', lambda m: errs.append(m.text) if (m.type == 'error' and 'Failed to load resource' not in m.text) else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.goto(BASE + '/index.html?town=orangetower&lvl=34&v=%d' % int(time.time()))
    pg.wait_for_function("window.__ready===true && typeof LEVEL!=='undefined' && LEVEL===440", timeout=90000)
    ev = pg.evaluate
    def shot(name):
        if SHOTS: pg.screenshot(path=str(SHOTS / (name + '.png')))
    def go(lvl):
        ev('goToLevel(%d)' % lvl); time.sleep(2.5); ev(LIB); ev('T.stop()'); time.sleep(.2); ev('T.frames(5)')
    go(459)

    # ---- 1. the labyrinth by flood fill
    r = ev(STATIC); plates = r.pop('plates')
    print(json.dumps(r))
    check('maze is solvable and the solution is about 70 steps', r['solvable'] and 60 <= r['exitDist'] <= 80, r['exitDist'])
    check('14 to 20 traps, about half fireball plates and half spike tiles', 14 <= r['nFire'] + r['nSpike'] <= 20 and abs(r['nFire'] - r['nSpike']) <= 2, (r['nFire'], r['nSpike']))
    check('no two traps overlap, none in the first five tiles', r['overlap'] == 0 and r['nearEntry'] == 0)
    check('at least eight traps on the way through', r['onWay'] >= 8, r['onWay'])
    check('spike tiles are the different floor, plates are plain floor', r['spikeFloor'] and not r['fireOnFloor5'])
    check('every fireball plate has a dodge within 3 steps, in time, clear of spikes (and standing still is a hit)', all(pl['dodge'] and pl['staysHit'] and pl['steps'] <= 3 for pl in plates), [(pl['x'], pl['y'], pl['steps']) for pl in plates])
    check('no creatures, hidden doors or old plates in the labyrinth', r['enemiesInMaze'] == 0 and r['secretsInMaze'] == 0 and r['trigInMaze'] == 0)
    check('jump scares: about six, never on a trap', r['nScares'] >= 5 and r['scareOnTrap'] == 0, r['nScares'])
    check('five letters D E A T H and three secret doors', r['letters'] == 'DEATH' and r['doors'] == 3, r['letters'])

    # ---- 2. a fireball plate
    ev('T.quiet()')
    plate = ev('LEVELS[459]._traps.filter(t=>t.t==="fire"&&t.n>=6)[0]'); ux, uy = plate['u']; px, py = plate['x'], plate['y']; f = D4.index((ux, uy))
    def fire():
        ev('T.heal();HLT.fb.length=0;HLT.boom.length=0;HLF().tr={};T.quiet()'); ev('T.place(%d,%d,%d)' % (px - ux, py - uy, f)); ev('T.settle();act("fwd")'); ev('T.frames(2)')
    fire(); ev('T.secs(.9)'); shot('fireball_far')
    b0 = ev('HLT.fb.map(b=>[b.x,b.y,b.t])')
    check('the plate launches a ball that flies toward the party along the passage', b0 and b0[0][2] > 0 and abs(b0[0][1] - (plate['S'][1] + .5)) > .5, b0[0] if b0 else None)
    check('the ball is in the sprite list as a custom sprite', ev('spriteList().filter(s=>s.custom).length') >= 1)
    y1 = ev('HLT.fb[0].y'); ev('T.secs(.5)'); y2 = ev('HLT.fb[0].y')
    check('it moves about four cells a second', abs(abs(y2 - y1) / .5 - 4) < .6, round(abs(y2 - y1) / .5, 2))
    ev('T.secs(4)'); hp = ev('T.hp()'); mx = ev('G.heroes.map(h=>h.max)')
    loss = [round(100 * (m - h) / m) for h, m in zip(hp, mx)]
    balls = 2 if plate.get('two') else 1
    check('standing in the line: the front line loses 25 to 40 percent per ball, the others splash (%d ball(s))' % balls, all(25 * balls - 3 <= l <= 40 * balls + 3 for l in loss[:2]) and all(0 < l <= 14 * balls + 3 for l in loss[2:]), loss)
    check('the hit was announced', any('fireball explodes' in m for m in ev('T.msgs()')))
    fire(); ev('T.secs(.55)')
    dd = ev('LEVELS[459]._traps.filter(t=>t.t==="fire"&&t.n>=6)[0].dod')
    path = [(dd['B'][0], dd['B'][1]), (dd['Q'][0], dd['Q'][1])]
    for (tx, ty) in path:
        if (tx, ty) == (ev('G.P.x'), ev('G.P.y')): continue
        d = D4.index((tx - ev('G.P.x'), ty - ev('G.P.y'))); ev('T.mv(%d)' % d)
    ev('T.settle()'); ev('T.secs(5)')
    check('stepping aside (back, then into the side passage) avoids both balls', ev('T.hp()') == mx and ev('HLT.fb.length') == 0, ev('T.hp()'))
    fire(); ev('T.secs(.7)'); ball = ev('({x:HLT.fb[0].x,y:HLT.fb[0].y})')
    tx, ty = int(ball['x']) - ux * 3, int(ball['y']) - uy * 3
    ev('G.grid[%d][%d]=3' % (ty, tx)); ev('T.secs(2)')
    check('a closed door stops the ball, which explodes on it', ev('HLT.fb.length') == 0 and ev('T.hp()') == mx, ev('T.hp()'))
    ev('G.grid[%d][%d]=0' % (ty, tx))
    fire(); ev('T.secs(1)'); a = ev('HLT.fb[0].y'); ev('G.menu="x"'); ev('T.secs(2)'); bb = ev('HLT.fb[0].y'); ev('G.menu=false')
    check('the ball waits while a menu is open', abs(a - bb) < .01)
    fire(); ev('T.secs(.8)'); go(458)
    check('leaving the floor clears the balls', ev('HLT.fb.length') == 0 and not ev('!!HLT.light'))
    go(459); ev('T.quiet()')

    # ---- 3. spike tiles
    sp = ev('LEVELS[459]._traps.filter(t=>t.t==="spike"&&t.onSol).map(t=>{const sol=LEVELS[459]._mazeInfo.sol,i=sol.findIndex(p=>p[0]===t.x&&p[1]===t.y);return {x:t.x,y:t.y,pv:sol[i-1]}})')
    face = lambda s: D4.index((s['x'] - s['pv'][0], s['y'] - s['pv'][1]))
    s = sp[0]; ev('T.heal();afflList().length=0'); ev('T.place(%d,%d,%d)' % (s['pv'][0], s['pv'][1], face(s))); h0 = ev('T.hp()'); ev('T.settle();act("fwd")'); ev('T.secs(.5)'); h1 = ev('T.hp()')
    lost = [(a - b) for a, b in zip(h0, h1)]
    check('walking onto a spike tile hurts one hero by 25 to 40 percent and makes them bleed', sum(1 for l in lost if l > 0) == 1 and 'bleeding' in ev('afflList().map(e=>e.id)'), lost)
    s = sp[1]; ev('T.heal();afflList().length=0'); ev('T.place(%d,%d,%d)' % (s['pv'][0], s['pv'][1], face(s))); h0 = ev('T.hp()'); ev('act("attack")'); ev('T.secs(.6)'); shot('spikes_pressed')
    check('the Attack key presses a spike tile ahead, harmlessly, and remembers it', ev('!!HLF().tr["459:%d,%d"]' % (s['x'], s['y'])) and ev('HLT.spk.some(k=>k.x==%d&&k.y==%d&&!k.harm)' % (s['x'], s['y'])) and ev('hp_ok=T.hp()') == h0 and 'butt' in ' '.join(ev('T.msgs()')), ev('T.msgs()'))
    ev('T.settle();act("fwd")'); ev('T.secs(.2)'); check('the spikes are still up for a moment: no walking on them', ev('[G.P.x,G.P.y]') == s['pv'])
    ev('T.secs(3)'); ev('T.settle();act("fwd")'); ev('T.secs(.5)'); check('afterwards the tile is safe to cross', ev('[G.P.x,G.P.y]') == [s['x'], s['y']] and ev('T.hp()') == h0)
    s = sp[2]; ev('T.heal()'); ev('T.place(%d,%d,%d)' % (s['pv'][0], s['pv'][1], face(s))); ev('viewTap(210,185)'); ev('T.secs(.6)')
    check('a tap on the floor ahead presses it too', ev('!!HLF().tr["459:%d,%d"]' % (s['x'], s['y'])))
    sv = json.loads(json.dumps(ev('snapshot()'))); ev('window.__sv=' + json.dumps(sv)); ev('restore(window.__sv)'); time.sleep(3.5)
    check('save and load keep the pressed tiles', ev('LEVEL') == 459 and ev('!!HLF().tr["459:%d,%d"]' % (s['x'], s['y'])))
    ev(LIB); ev('T.stop()'); ev('T.frames(5)')

    # ---- 4. noticing
    ev('HLF().tr={};T.quiet()'); traps = ev('LEVELS[459]._traps.map(t=>({x:t.x,y:t.y}))')
    ev('window.noticeRun=(t)=>{const rows=LEVELS[459].rows,M=LEVELS[459]._maze,op=(x,y)=>x>=M.x0&&x<=M.x1&&y>=M.y0&&y<=M.y1&&rows[y][x]===".";for(let f=0;f<4;f++){const d=DIRS[f];if(op(t.x-d[0],t.y-d[1])&&op(t.x-2*d[0],t.y-2*d[1])){HLF().warn={};G.msgs=[];T.place(t.x-2*d[0],t.y-2*d[1],f);T.secs(.3);return G.msgs.filter(m=>/trap ahead/.test(m.text)).map(m=>m.text)}}return null};0')
    for i in range(4): ev('T.setCls(%d,"Warrior",8)' % i)
    n8 = sum(1 for t in traps if ev('noticeRun(%s)' % json.dumps(t)))
    check('DEX 8 warriors notice nothing', n8 == 0, n8)
    ev('T.setCls(1,"Thief",14)'); res = [ev('noticeRun(%s)' % json.dumps(t)) for t in traps]
    res = [r for r in res if r is not None]
    check('a Thief always notices, and speaks by name', len(res) >= 10 and all(res) and res[0][0] == 'Vesna: There might be a trap ahead.', (len(res), res[0]))
    ev('T.setCls(1,"Warrior",8)'); ev('T.setCls(2,"Mage",16)')
    r1 = [bool(ev('noticeRun(%s)' % json.dumps(t))) for t in traps]; r2 = [bool(ev('noticeRun(%s)' % json.dumps(t))) for t in traps]
    check('a DEX 16 hero notices some traps, the same ones every time', 0 < sum(r1) < len(r1) and r1 == r2, '%d of %d' % (sum(r1), len(r1)))
    ev('T.setCls(2,"Priest",8)')

    # ---- 5. Sense Traps
    ev('T.setCls(1,"Thief",14)'); ev('G.heroes[1].powSel=heroPowers(1).findIndex(p=>p.type==="sense")')
    check('the Thief has Sense Traps as an active power and nobody else has it', ev('heroPowers(1).some(p=>p.type==="sense"&&p.act)') and not ev('heroPowers(0).some(p=>p.type==="sense")'))
    ev('T.place(12,18,0);G.sel=1;T.heal()'); exp = ev('hltTrapsHere().filter(t=>Math.hypot(t.x-G.P.x,t.y-G.P.y)<=6).length'); mp0 = ev('G.heroes[1].mp')
    ev('G.msgs=[];T.settle();act("special")'); ev('T.secs(.4)'); shot('sense_traps')
    check('using it names the count and costs 5 stamina', ev('T.msgs()')[-1] == 'Vesna senses %d traps nearby.' % exp and mp0 - ev('G.heroes[1].mp') == 5, (exp, ev('T.msgs()')[-1:]))
    check('the traps within 6 squares glow in the 3D view for about 20 seconds', ev('spriteList().filter(s=>s.custom).length') == exp and 18 < ev('HLT.sense.until-G.time') <= 20)
    ev('G.acted=[false,false,false,false];G.sel=1;G.msgs=[];T.settle();act("special")'); ev('T.secs(.2)')
    check('there is a short cooldown', 'moment' in ev('T.msgs()')[-1])
    ev('T.secs(21)'); check('the glow ends', ev('spriteList().filter(s=>s.custom).length') == 0)
    ev('G.acted=[false,false,false,false];G.sel=1;T.place(20,22,0);G.msgs=[];HLT.sense.until=-1;G.heroes[1]._senseCd=0;T.settle();act("special")'); ev('T.secs(.2)')
    ev('T.setCls(1,"Warrior",8)')

    # ---- 6. letters, secret doors, death
    L = ev('LEVELS[459]._letters'); doors = ev('LEVELS[459]._ldoors'); ev('T.quiet();G.flags.msgrSeen={}')
    for l in L[:2]:
        wd = tuple(l['wd']); ev('T.place(%d,%d,%d)' % (l['x'] - 3 * wd[0], l['y'] - 3 * wd[1], D4.index(wd))); ev('T.secs(.5)')
        if l['k'] == 'D': shot('letter_D')
    check('D and E are painted at corridor ends and are read from a few squares away', set(ev('Object.keys(G.flags.msgrSeen)')) == {'D', 'E'})
    seen_before = set(ev('Object.keys(G.flags.msgrSeen)'))
    for l, dr in zip(L[2:4], doors):
        wd = tuple(l['wd']); ev('T.place(%d,%d,%d)' % (dr['x'] - wd[0], dr['y'] - wd[1], D4.index(wd))); ev('T.secs(.4)'); shot('door_' + l['k'])
        wasclosed = ev('G.grid[%d][%d]' % (dr['y'], dr['x'])) > 0
        ev('G.msgs=[];T.settle();act("fwd")'); ev('T.secs(.6)')
        check('walking into the wall of different stone opens the secret door (%s)' % l['k'], wasclosed and ev('G.grid[%d][%d]' % (dr['y'], dr['x'])) == 0 and l['k'] in ev('Object.keys(G.flags.msgrSeen)'))
        if l['k'] == 'A': shot('alcove_A')
    check('four letters seen: nobody dies', ev('G.state') == 'play' and not ev('!!G.cut') and len(ev('Object.keys(G.flags.msgrSeen)')) == 4)
    l, dr = L[4], doors[2]; wd = tuple(l['wd']); ev('T.place(%d,%d,%d)' % (dr['x'] - wd[0], dr['y'] - wd[1], D4.index(wd))); ev('T.settle();act("fwd")'); ev('T.secs(.3)')
    check('the fifth letter starts the death cutscene', ev('G.cut&&G.cut.id') == 'msgrDeath')
    n = 0
    while ev('!!G.cut') and n < 40: ev('cutAdvance()'); ev('T.frames(2)'); n += 1
    check('and the whole party falls', ev('G.state') == 'dead' and not any(ev('G.heroes.map(h=>h.alive)')))
    go(459); ev('T.quiet()')

    # ---- 7. the lower floors, the Messenger, the scares
    ev('G.flags.msgrSeen={}')
    for lvl, tag in [(455, 'D'), (456, 'E'), (457, 'A')]:
        go(lvl); ev('G.enemies.length=0'); dr = ev('LEVELS[LEVEL]._ldoors[0]'); lt = ev('LEVELS[LEVEL]._letters||[LEVELS[LEVEL]._omen]')[0]; wd = tuple(lt['wd'])
        ev('T.place(%d,%d,%d)' % (dr['x'] - wd[0], dr['y'] - wd[1], D4.index(wd))); ev('T.secs(.3)'); ev('T.settle();act("fwd")'); ev('T.secs(.6)')
        check('floor %d: letter %s behind a secret door' % (lvl - 439, tag), ev('G.grid[%d][%d]' % (dr['y'], dr['x'])) == 0 and tag in ev('Object.keys(G.flags.msgrSeen)'))
    check('the letters seen are one list across the floors', {'D', 'E', 'A'} <= set(ev('Object.keys(G.flags.msgrSeen)')))
    go(458); check('the Messenger of Death is on floor 19', ev('G.enemies.some(e=>e.t==="w_messenger")'))
    counts = {}
    for lvl in range(453, 460):
        go(lvl); counts[lvl] = ev('(LEVELS[LEVEL]._scares||[]).length')
    check('jump scare tiles: 1 or 2 on floors 14 to 18, 2 on floor 19, about 6 on floor 20', all(1 <= counts[l] <= 2 for l in range(453, 458)) and counts[458] == 2 and counts[459] >= 5, counts)
    go(459); ev('HLF().tr={};T.heal();afflList().length=0'); s = ev('LEVELS[459]._scares[3]'); ev('Math.random=()=>0.1')
    free = ev('[0,1,2,3].map(f=>{const d=DIRS[f];let n=0;while(n<3&&!cellBlocked(%d+d[0]*(n+1),%d+d[1]*(n+1)))n++;return n})' % (s['x'], s['y']))
    wall = [i for i, n in enumerate(free) if n < 2][0]; ok = [i for i, n in enumerate(free) if n >= 2][0]
    ev('T.place(%d,%d,%d)' % (s['x'], s['y'], wall)); ev('T.secs(.5)'); w_ = ev('!!HLT.scare')
    ev('G.P.f=%d;G.P.angT=[-Math.PI/2,0,Math.PI/2,Math.PI][%d];G.C.a=G.P.angT' % (ok, ok)); ev('T.secs(.28)'); shot('jump_scare'); mid = ev('!!HLT.scare')
    ev('T.secs(1.5)')
    check('a jump scare waits while the party faces a wall', not w_)
    check('then a figure appears two squares ahead', mid)
    check('it is gone again, with a message', not ev('!!HLT.scare') and 'Something stood there. Now nothing does.' in ev('T.msgs()'), ev('T.msgs()'))
    check('the front hero may be shaken (25 percent, forced here)', 'shaken' in ev('afflList().map(e=>e.id)'), ev('afflList().map(e=>e.id)'))
    ev('T.place(%d,%d,%d)' % (s['x'], s['y'], ok)); ev('T.secs(.5)'); check('it fires once only', not ev('!!HLT.scare'))
    if SHOTS:
        ev('G.inv={open:true,tab:"powers",hero:1,sel:null,scroll:0,pw:heroPowers(1).findIndex(p=>p.type==="sense")}'); ev('T.frames(3)'); shot('powers_page'); ev('G.inv.open=false')

    check('no console errors', not errs, errs[:3])
    b.close()
print('\n%d check(s) failed' % len(FAILS) if FAILS else '\nall checks passed')
sys.exit(1 if FAILS else 0)
