"""Pale Spire dungeons (package 5): headless tests on your OWN server (python -m http.server 8626 from the repo root).
    python tools/psd_test.py struct   builds, BFS reach from every entry, doors, links, NPCs, duplicates, corridor widths, people and quests exist
    python tools/psd_test.py quests   every quest taken, done and handed in with the reward; cell doors; wheels right and wrong; names; save and load
    python tools/psd_test.py shots    screenshots into %TEMP%/psd_shots
Env: PSD_PORT (8626), BTA_CHROME. Exit code is the number of FAIL lines plus console errors."""
import sys, time, os, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PSD_PORT', '8626')
CHROME = os.environ.get('BTA_CHROME') or 'C:/Program Files/Google/Chrome/Application/chrome.exe'
SHOTS = os.environ.get('PSD_SHOTS', os.path.join(os.environ.get('TEMP', '.'), 'psd_shots'))
HERE = os.path.dirname(os.path.abspath(__file__))
os.makedirs(SHOTS, exist_ok=True)
what = sys.argv[1] if len(sys.argv) > 1 else 'struct'
NOISE = ('assets/sp_', 'assets/icn_', 'Failed to load resource', 'hgtm model', 'willReadFrequently', 'assets/ps/', 'assets/kh/')


def boot(p, query='town=palespire6', w=900, h=600):
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=CHROME)
    pg = b.new_page(viewport={'width': w, 'height': h})
    errs = []
    pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
    pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
    pg.goto('http://localhost:%s/index.html?%s&v=%d' % (PORT, query, time.time()), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL>=9780&&LEVEL<=9800", timeout=150000)
    pg.wait_for_timeout(2500)
    return b, pg, errs


def clean(errs):
    return [e for e in errs if not any(n in e for n in NOISE)]


STRUCT = r"""()=>{
const log=[],ok=(c,m)=>log.push((c?'ok   ':'FAIL ')+m);
const D4=[[1,0],[-1,0],[0,1],[0,-1]];
for(const id of [9780,9790,9800]){
  if(!LEVELS[id])KH_LAZY[id]();
  const L=LEVELS[id],W=L.rows[0].length,H=L.rows.length,V=L._psd,name=LEVEL_NAMES[id];
  const rect=L.rows.every(r=>r.length===W);ok(rect,id+' '+name+' rows rectangular '+W+'x'+H);
  const inf=PSP.LEVELS.find(l=>l.id===id);ok(inf.W===W&&inf.H===H,id+' size matches the contract '+inf.W+'x'+inf.H);
  const gates=new Set(),blk=new Set(),dup=new Map();
  for(const d of L.decor){const k=d.x+','+d.y;if(d.k==='sign_gy')continue;if(d.npc&&d.npc.startsWith('psd_cell'))gates.add(k);else if(d.block||d.solid)blk.add(k);
    if(d.block){if(dup.has(k))dup.set(k,dup.get(k)+1);else dup.set(k,1)}}
  const deep=(x,y)=>L.fmap[y][x]==='6';
  const passable=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.'&&!blk.has(x+','+y)&&!deep(x,y);
  const seen=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];
  for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of D4){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||!passable(nx,ny))continue;seen.add(k);q.push([nx,ny])}}
  ok(passable(L.start.x,L.start.y),id+' start is open');
  const un=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(passable(x,y)&&!seen.has(x+','+y))un.push(x+','+y);
  ok(un.length===0,id+' every open square is reachable from the start ('+un.length+' not): '+un.slice(0,10).join(' '));
  // doors: every door tile has a reached neighbour
  let doors=0,bad=[];for(const [c,gid] of Object.entries(L.chars)){const d=KH_DOOR[gid];if(!d||!d.psd)continue;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]===c){doors++;if(!D4.some(([a,b])=>seen.has((x+a)+','+(y+b))))bad.push(x+','+y)}}
  ok(doors>=1&&bad.length===0,id+' doors reachable ('+doors+') bad: '+bad.join(' '));
  // links: stair squares are doors, land squares open with a clear 3x3, twins agree
  for(const l of PSP.LINKS.filter(l=>l.from===id)){const [ax,ay]=l.at,c=L.rows[ay][ax],gid=c!=='.'&&L.chars[c],d=gid&&KH_DOOR[gid];ok(!!d&&d.psd==='stair'&&d.lvl===l.to&&d.at.x===l.land[0]&&d.at.y===l.land[1],id+' link '+l.name+' at '+l.at+' is a stair door to '+l.to)}
  for(const l of PSP.LINKS.filter(l=>l.to===id)){const [lx,ly]=l.land;let clear=true;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(!passable(lx+a,ly+b))clear=false;ok(clear&&seen.has(lx+','+ly),id+' landing '+l.land+' from '+l.from+' is open with a clear 3x3 and reachable')}
  // blocked props never on top of one another, creatures not on props or walls or water, not two on a square
  ok([...dup.values()].every(n=>n===1),id+' no two blocking pieces on one square');
  const es=new Set(),eb=[];for(const e of L.enemies){const k=e.x+','+e.y;if(es.has(k)||blk.has(k)||gates.has(k)||L.rows[e.y][e.x]!=='.'||deep(e.x,e.y)||!seen.has(k)&&!D4.some(([a,b])=>gates.has((e.x+a)+','+(e.y+b))||seen.has((e.x+a)+','+(e.y+b))))eb.push(e.t+'@'+k);es.add(k)}
  ok(eb.length===0,id+' creatures placed cleanly ('+L.enemies.length+') bad: '+eb.join(' '));
  // people and props that talk have a reachable square beside them
  const nb=[];for(const d of L.decor){if(!d.npc||d.npc.startsWith('psd_cell'))continue;if(!NPCS[d.npc]){nb.push('NOROOT '+d.npc);continue}if(!D4.some(([a,b])=>seen.has((d.x+a)+','+(d.y+b))||gates.has((d.x+a)+','+(d.y+b))))nb.push(d.npc+'@'+d.x+','+d.y)}
  ok(nb.length===0,id+' every talkable piece can be reached ('+L.decor.filter(d=>d.npc).length+' with npc) bad: '+nb.join(' '));
  // every cell gate: a reachable square in front of it, and the cell inside is not reachable until it is opened
  let gb=[];for(const d of L.decor)if(d.npc&&d.npc.startsWith('psd_cell')){if(!D4.some(([a,b])=>seen.has((d.x+a)+','+(d.y+b))))gb.push(d.x+','+d.y)}
  ok(gb.length===0,id+' cell gates ('+gates.size+') can be reached from outside: '+gb.join(' '));
  // corridor width: every reached square lies in a free 2x2 block (cell doorways, room doorways and door fronts are the known 1-wide squares)
  const free=(x,y)=>passable(x,y)||gates.has(x+','+y),thin=[];
  for(const k of seen){const [x,y]=k.split(',').map(Number);let okw=false;for(const [a,b] of [[0,0],[-1,0],[0,-1],[-1,-1]])if(free(x+a,y+b)&&free(x+a+1,y+b)&&free(x+a,y+b+1)&&free(x+a+1,y+b+1))okw=true;if(!okw)thin.push(k)}
  const thinOK=thin.filter(k=>{const [x,y]=k.split(',').map(Number);return !(gates.has(k)||D4.some(([a,b])=>gates.has((x+a)+','+(y+b))))});
  log.push('info '+id+' squares not in a free 2x2 block: '+thin.length+', excluding cell doorways: '+thinOK.length+' '+thinOK.slice(0,40).join(' '));
  log.push('info '+id+' reach '+seen.size+' open, '+L.decor.length+' decor, '+L.enemies.length+' creatures, '+(V.missed.length)+' missed placements: '+V.missed.slice(0,12).join(' | '));
}
for(let i=30;i<=38;i++){const id='psq'+i;ok(!!QUESTS[id]&&QAREA[id]==='The Pale Spire'&&QUESTS[id].reward&&QUESTS[id].reward.gold>0,id+' exists '+(QUESTS[id]&&QUESTS[id].title));ok(!!QRF.T[id],id+' has a quest ring entry')}
for(const n of ['psd_garrick','psd_isaude','psd_peck','psd_sedge','psd_calpurnia','psd_harrow','psd_gaunt','psd_stamford','psd_yseult']){ok(!!NPCS[n]&&!!KH_KEEPERS[n]&&Array.isArray(QGIVER[n]),n+' talks and gives a quest')}
for(const it of ['pstin','pspaintbrush','pspickset','pslocket','psraincharm','pscandle','psharrowseal','pspalette','psdawnsword','psantidote'])ok(!!ITEMDEF[it],'item '+it+' defined')
for(const t of ['psturnkey','psflayed','psshackle','psleech','psdrowned','pscellghost','psbonecrawl','psquestioner','psdrowngaoler','pshunger'])ok(!!ENEMY_DEF[t]&&ENEMY_DEF[t].img.startsWith('ps_c_'),'creature '+t);
return log}"""


def run_struct():
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        log = pg.evaluate(STRUCT)
        for l in log:
            print(l)
        bad = [l for l in log if l.startswith('FAIL')]
        print('--- struct: %d lines, %d FAIL' % (len(log), len(bad)))
        print('console errors:', clean(errs)[:12])
        b.close()
        return len(bad) + len(clean(errs))


PLACES = [  # name, level, x, y, facing
    ('01_gaols_arrival', 9780, 40, 6, 2), ('02_hall_south', 9780, 40, 9, 2), ('03_hall_west', 9780, 36, 8, 3), ('04_cellblockA_west', 9780, 40, 25, 3), ('05_cellblockA_east', 9780, 14, 25, 1),
    ('06_garrick_gate', 9780, 15, 24, 0), ('07_question_room', 9780, 45, 25, 1), ('08_question_east', 9780, 60, 26, 1), ('09_south_corridor', 9780, 12, 37, 1), ('10_stair_room', 9780, 66, 57, 2),
    ('11_deep_arrival', 9790, 66, 6, 2), ('12_cellblockB_west', 9790, 40, 16, 3), ('13_cellblockB_flood', 9790, 14, 16, 1), ('14_cistern_entry', 9790, 29, 35, 2), ('15_cistern_west', 9790, 24, 40, 1),
    ('16_cistern_south', 9790, 40, 46, 2), ('17_cistern_east', 9790, 57, 44, 0), ('18_drain', 9790, 29, 25, 2), ('19_obl_arrival', 9800, 14, 6, 2), ('20_obl_shaft', 9800, 14, 12, 2),
    ('21_obl_ring', 9800, 20, 33, 0), ('22_obl_pit', 9800, 36, 28, 2), ('23_obl_cells_e', 9800, 52, 28, 1)]


def shot(pg, name):
    path = os.path.join(SHOTS, name + '.png')
    pg.screenshot(path=path)
    print('shot', path)


def run_shots(only=None):
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        for name, lv, x, y, f in PLACES:
            if only and not any(o in name for o in only):
                continue
            pg.evaluate("([lv,x,y,f]) => { G.menu=false; G.talk=null; G.cut=null; goToLevel(lv,{x,y,f}); G.state='play'; setTimeout(()=>{G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT},300); }", [lv, x, y, f])
            pg.wait_for_timeout(3500)
            pg.evaluate("() => { G.talk=null; G.msgs=[]; }")
            pg.wait_for_timeout(300)
            shot(pg, name)
        print('errors', clean(errs)[:10])
        b.close()


def run_quests():
    js = open(os.path.join(HERE, 'psd_qtest.js'), encoding='utf-8').read()
    with sync_playwright() as p:
        b, pg, errs = boot(p)
        log = pg.evaluate(js)
        for l in log:
            print(l)
        bad = [l for l in log if l.startswith('FAIL')]
        print('--- quests: %d lines, %d FAIL' % (len(log), len(bad)))
        print('console errors:', clean(errs)[:12])
        b.close()
        return len(bad) + len(clean(errs))


if what == 'quests':
    sys.exit(min(run_quests(), 100))
elif what == 'shots':
    run_shots(sys.argv[2:] or None)
elif what == 'struct':
    sys.exit(min(run_struct(), 100))
else:
    print('unknown mode', what)
