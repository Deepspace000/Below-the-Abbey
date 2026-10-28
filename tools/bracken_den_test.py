"""Old Bracken's den tests (own server: python -m http.server 8071 from the repo root):  python tools/bracken_den_test.py [shots]
Set BTA_CHROME to an installed Chrome if Playwright's own browser is missing. Screenshots go to BDEN_SHOTS (default %TEMP%/bden_shots)."""
import sys, os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('BDEN_PORT', '8071')
SHOTS = os.environ.get('BDEN_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'bden_shots'))
os.makedirs(SHOTS, exist_ok=True)
URL = 'http://localhost:%s/index.html?town=brackenden&lvl=34&v=%d' % (PORT, time.time())
fails = []


def check(name, ok, info=''):
    print(('PASS ' if ok else 'FAIL ') + name, info)
    if not ok: fails.append(name)


def boot(p):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.goto(URL, wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===496", timeout=120000)
    pg.wait_for_timeout(2500)
    return b, pg, errs


def go(pg, lv, x, y, f, wait=2500):
    pg.evaluate("([lv,x,y,f])=>{G.menu=false;G.talk=null;G.cut=null;G.lvlBanners=[];goToLevel(lv,{x,y,f});G.state='play';setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300)}", [lv, x, y, f])
    pg.wait_for_timeout(wait)
    pg.evaluate("()=>{G.talk=null;G.msgs=[];G.lvlBanners=[]}")
    pg.wait_for_timeout(300)


def shot(pg, name):
    path = os.path.join(SHOTS, name + '.png'); pg.screenshot(path=path); print('shot', path)


with sync_playwright() as p:
    b, pg, errs = boot(p)
    # 1. the entrance: the door cell in town leads to the den, Bracken is not on the way
    r = pg.evaluate("""()=>{const L=LEVELS[496],g=KH_DOOR[Object.keys(KH_DOOR).find(k=>KH_DOOR[k].lvl===7097)];
      const c=L.rows[6][89],gid=L.chars[c];const door=KH_DOOR[gid];
      const bk=L.decor.find(d=>d.npc==='wlo_hermit');
      return {door:!!door&&door.lvl===7097,front:[89,7],bracken:[bk.x,bk.y],frontFree:!L.decor.some(d=>d.x===89&&d.y===7&&d.block),
              frontOpen:L.rows[7][89]==='.'||!L.chars[L.rows[7][89]]}}""")
    check('door cell leads to 7097', r['door'], r)
    check('Bracken does not block the way in', (r['bracken'] != [89, 7]) and r['frontFree'], r['bracken'])
    # 2. the maze is solvable
    r = pg.evaluate("""()=>{if(!LEVELS[7097])KH_LAZY[7097]();const L=LEVELS[7097],rows=L.rows,H=rows.length,W=rows[0].length;
      const blocked=new Set(L.decor.filter(d=>d.block&&!d.hidden||d.hidden).map(d=>d.x+','+d.y));
      const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]!=='w'&&rows[y][x]!=='#';
      const s=L.start,seen=new Map([[s.x+','+s.y,0]]),q=[[s.x,s.y]];
      for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||!open(nx,ny)||blocked.has(k))continue;seen.set(k,seen.get(x+','+y)+1);q.push([nx,ny])}}
      const bk=L.decor.find(d=>d.npc==='wld_book');
      const adj=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>(bk.x+a)+','+(bk.y+b)).filter(k=>seen.has(k));
      const exit=L.portals[0];
      return {W,H,start:s,book:[bk.x,bk.y],reach:adj.length,steps:Math.min(...adj.map(k=>seen.get(k))),portal:exit,doorRow:rows[H-1],openCount:seen.size,
              dead:[...seen.keys()].filter(k=>{const [x,y]=k.split(',').map(Number);return [[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>seen.has((x+a)+','+(y+b))).length===1}).length,enemies:L.enemies.length}}""")
    check('maze 15x15', r['W'] == 15 and r['H'] == 15, r)
    check('book reachable from the entrance by BFS', r['reach'] > 0 and r['steps'] >= 15, 'steps %s dead ends %s' % (r['steps'], r['dead']))
    check('maze has dead ends', r['dead'] >= 3)
    check('exit portal back to Wenlock', r['portal']['to'] == 496 and r['portal']['x'] == 89 and r['portal']['y'] == 7, r['portal'])
    # 3. the book
    r = pg.evaluate("""()=>{G.flags.wldBook=0;const names=HERO_DEF.map(d=>d.name);const t=NPCS.wld_book.root({});
      const t2=t.opts[0][1]();return {names,first:t.text.slice(0,30),prompt:t2.text,btn:t2.opts.map(o=>o[0])}}""")
    check('prompt text exact', r['prompt'] == 'Add 1 Intelligence point. Which character gets the point?', r['prompt'])
    check('prompt lists every hero', all(n in r['btn'] for n in r['names']), r['btn'])
    r = pg.evaluate("""()=>{G.flags.wldBook=0;const before=G.heroes.map(h=>h.int),other=G.heroes.map(h=>[h.str,h.dex,h.max]);
      const t=NPCS.wld_book.root({}).opts[0][1]();const res=t.opts[2][1]();
      return {before,after:G.heroes.map(h=>h.int),others:G.heroes.map(h=>[h.str,h.dex,h.max]),other,used:G.flags.wldBook,res:res.text}}""")
    d = [a - b for a, b in zip(r['after'], r['before'])]
    check('+1 to the chosen hero only', d == [0, 0, 1, 0], d)
    check('other stats untouched', r['others'] == r['other'])
    check('flag set and confirmation shown', r['used'] == 1 and 'gains 1 Intelligence' in r['res'], r['res'])
    # 4. used once
    r = pg.evaluate("()=>{const t=NPCS.wld_book.root({});return {text:t.text,n:t.opts.length}}")
    check('book is used up', 'crumbled' in r['text'] and 'dust' in r['text'], r['text'])
    # 5. persists through save and reload
    r = pg.evaluate("""()=>{const sv=JSON.parse(JSON.stringify(snapshot()));const want=G.heroes.map(h=>h.int);
      G.heroes.forEach(h=>{h.int=1});G.flags.wldBook=0;restoreNow(sv);return {want,got:G.heroes.map(h=>h.int),flag:G.flags.wldBook}}""")
    check('persists in a save', r['want'] == r['got'] and r['flag'] == 1, r)
    # 6. leaving without choosing keeps the book; prompt cancel
    r = pg.evaluate("""()=>{G.flags.wldBook=0;const t=NPCS.wld_book.root({}).opts[0][1]();const c=t.opts[t.opts.length-1][1]();return {flag:G.flags.wldBook,c}}""")
    check('walking away keeps the book', r['flag'] == 0 and r['c'] is None)
    # old save with no flag works
    r = pg.evaluate("()=>{delete G.flags.wldBook;return NPCS.wld_book.root({}).opts.length}")
    check('old save (no flag) works', r == 2)
    if len(sys.argv) > 1 and sys.argv[1] == 'shots':
        pg.evaluate("()=>{G.flags.wldBook=0}")
        go(pg, 496, 89, 9, 0, 3000); shot(pg, '1_den_outside')
        go(pg, 7097, 7, 13, 0); shot(pg, '2_maze_start')
        go(pg, 7097, 3, 13, 0); shot(pg, '3_maze_corridor')
        go(pg, 7097, 7, 4, 0); shot(pg, '4_book_room')
        go(pg, 7097, 7, 3, 0)
        pg.evaluate("()=>{startTalk(G.decor.find(d=>d.npc==='wld_book'));G.talk.node=G.talk.node.opts[0][1]()}"); pg.wait_for_timeout(4000); shot(pg, '5_prompt')
    print('console errors', [e for e in errs][:6])
    check('no page errors', not errs, errs[:3])
    b.close()
print('FAILED' if fails else 'ALL PASSED', fails)
sys.exit(1 if fails else 0)
