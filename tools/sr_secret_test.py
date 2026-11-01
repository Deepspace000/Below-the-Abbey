"""Test of the secret walls in the mazes and dungeons (src/desert/secret_rooms.js; level 1 has its own four, tools/ep_secret_test.py).
   python tools/sr_secret_test.py        (own server: python -m http.server <port> from the repo root; env PS_PORT, BTA_CHROME)
Whole game (every level that should have rooms is built with reset(n), the rooms are carved with srApply()):
  rooms     every listed level has its rooms, none on level 1; each room: door solid, room squares open, no square touches anything open but its
            own door, none reachable from the start, the open squares of the level outside the rooms are those of the original rows, the chest
            is inside the room
  monsters  the creature share is 25 percent by design (room j of a level has one when j mod 4 equals a number from the level's number)
  potions   no chest of a level of rating R holds a health or mana potion seen from a level below the floor (the best tier allowed, R+10, two steps down)
Samples (a stone well maze, the Deeper Hollow maze, a beehive, the Tomb of Sut, a burrow, a vault, a level with a creature room):
  open      walking forward into the wall (the real move) opens it with the plain message; the other inputs too (W, Up, the arrow, Space, a click)
  chest     walk in, open the chest: potions of both kinds (2 to 4 in all) and one surprise item, sometimes gold; creature rooms: a creature of the
            level's roster stands on a room square (not the chest, not the door) and is awake
  save      a save keeps the doors open and the chests empty; a creature that was killed stays dead
  fog       the map of a maze is under cloud far from the party and clear where it stands
"""
import sys, os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
FAILS = []


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra)[:700] if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


HELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  go: async (n, x, y, f) => { for (let t = 0; t < 6 && LEVEL !== n; t++) { goToLevel(n, {x, y, f}); for (let i = 0; i < 80 && LEVEL !== n; i++) await T.wait(100); await T.wait(900) }
    for (let i = 0; i < 100 && !(EP.ready && SR.lv === n && SR.gd === G.decor); i++) await T.wait(100);
    G.P.x = x; G.P.y = y; G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.C = {x, y, a: G.P.angT}; G.enemies = G.enemies.filter(e => e.srRoom); G.lockT = 0; G.cut = null; G.talk = null; G.loot = null; await T.wait(500) },
  fwd: async () => { G.lockT = 0; doMove(0); await T.wait(450); G.lockT = 0 },
  face: (dx, dy) => [[0,-1],[1,0],[0,1],[-1,0]].findIndex(d => d[0] === dx && d[1] === dy),
  reach: () => { const s = LEVELS[LEVEL].start, seen = new Set([s.x + ',' + s.y]), q = [[s.x, s.y]];
    while (q.length) { const [x, y] = q.pop(); for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, k = nx + ',' + ny;
      const g = G.grid[ny] && G.grid[ny][nx]; if (seen.has(k) || g === undefined || !(g === 0 || g === 3 || g === 4 || g === 8)) continue; seen.add(k); q.push([nx, ny]) } } return seen }
};"""

SEALED = r"""async n => {
  if (!LEVELS[n] && typeof KH_LAZY !== 'undefined' && KH_LAZY[n]) KH_LAZY[n]();
  if (!LEVELS[n]) return {unbuilt: true};
  reset(n); srApply();
  const L = LEVELS[n], out = {n, rooms: (SR_ROOMS[n] || []).length, bad: [], mon: 0, tiers: []};
  if (!SR_ROOMS[n]) return out;
  const R = T.reach(), pg = srGrid(L), rs = SR_ROOMS[n], inRoom = new Set(), rating = srRating(n);
  const floorOf = lad => { const open = lad.filter(([id, m]) => m <= rating + 10 && ITEMDEF[id]); return open.length ? open[Math.max(0, open.length - 2)][1] : 0 };
  const hf = floorOf(POTION_LADDER), mf = floorOf(MANA_LADDER);
  for (const s of rs) { for (const [x, y] of s.cells) inRoom.add(x + ',' + y); if (s.mon) out.mon++ }
  for (const s of rs) { if (s.bad) { out.bad.push(s.id + ' bad'); continue }
    const cs = new Set(s.cells.map(c => c + ''));
    if (G.grid[s.door[1]][s.door[0]] === 0) out.bad.push(s.id + ' door open');
    for (const [x, y] of s.cells) { if (G.grid[y][x] !== 0) out.bad.push(s.id + ' square solid ' + x + ',' + y); if (R.has(x + ',' + y)) out.bad.push(s.id + ' reachable ' + x + ',' + y);
      for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b; if (cs.has([nx, ny] + '') || (nx === s.door[0] && ny === s.door[1])) continue; if (G.grid[ny][nx] === 0) out.bad.push(s.id + ' leak ' + nx + ',' + ny) } }
    if (!R.has(s.from + '')) out.bad.push(s.id + ' corridor square not reachable');
    const ch = G.decor.find(d => d.kname === 'sr_' + s.id); if (!ch || !ch.loot || !s.cells.some(c => c[0] === ch.x && c[1] === ch.y)) out.bad.push(s.id + ' no chest in the room');
    else { const names = (ch.contents || []).map(q => q.id), hl = names.filter(i => ITEMDEF[i] && ITEMDEF[i].heal && ITEMDEF[i].k === 'potion'), ml = names.filter(i => ITEMDEF[i] && ITEMDEF[i].mana && ITEMDEF[i].k === 'potion');
      out.tiers.push([s.id, hl, ml]);
      for (const i of hl) { const m = (POTION_LADDER.find(q => q[0] === i) || [0, 0])[1]; if (m < hf) out.bad.push(s.id + ' weak health potion ' + i) }
      for (const i of ml) { const m = (MANA_LADDER.find(q => q[0] === i) || [0, 0])[1]; if (m < mf) out.bad.push(s.id + ' weak mana potion ' + i) } }
    if (!ch.contents) { reset(n); srApply() }
    if (!SR_CT.has(s.door[1] * MW + s.door[0])) out.bad.push(s.id + ' no sealed face');
    if (G.decor.some(d => d !== ch && !d.srP && !d.epSecC && Math.round(d.x) === s.from[0] && Math.round(d.y) === s.from[1])) out.bad.push(s.id + ' decor on the corridor square');
    if (G.decor.some(d => d.srP === s.id && !d.wd && ch && d.x === ch.x && d.y === ch.y)) out.bad.push(s.id + ' prop on the chest square');
    if (s.mon && G.decor.some(d => d.srP === s.id && !d.wd && d.x === s.mon.x && d.y === s.mon.y)) out.bad.push(s.id + ' prop on the creature square') }
  let diff = 0; for (let y = 0; y < pg.length; y++) for (let x = 0; x < pg[0].length; x++) { if (inRoom.has(x + ',' + y)) continue; if ((pg[y][x] === 0) !== (G.grid[y][x] === 0)) diff++ }
  if (diff) out.bad.push('open squares changed outside the rooms: ' + diff);
  out.ext = LEVELS[n]._srPlan ? LEVELS[n]._srPlan.ext : null; out.rating = rating; return out }"""

CHEST = r"""async s=>{const ch=G.decor.find(d=>d.kname==='sr_'+s.id),open=(x,y)=>G.grid[y]&&G.grid[y][x]===0&&!G.decor.some(d=>d.block&&d.x===x&&d.y===y);
    let st=null;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=ch.x+a,y=ch.y+b;if(open(x,y)&&s.cells.some(c=>c[0]===x&&c[1]===y)){st=[x,y,T.face(-a,-b)];break}}
    if(!st)return {err:'no square beside the chest'};
    const path=[];{const prev={},k=(x,y)=>x+','+y,q=[[s.door[0],s.door[1]]];prev[k(...s.door)]=null;while(q.length){const [x,y]=q.shift();if(x===st[0]&&y===st[1])break;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(prev[k(nx,ny)]!==undefined||!open(nx,ny))continue;prev[k(nx,ny)]=[x,y];q.push([nx,ny])}}
      let c=[st[0],st[1]];while(c&&!(c[0]===s.door[0]&&c[1]===s.door[1])){path.unshift(c);c=prev[k(...c)]}}
    for(const [x,y] of path){const f=T.face(x-G.P.x,y-G.P.y);G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT;await T.fwd()}
    const there=G.P.x===st[0]&&G.P.y===st[1];G.P.f=st[2];G.P.angT=(st[2]-1)*Math.PI/2;G.C.a=G.P.angT;G.msgs=[];const gold0=G.gold;await T.fwd();
    const L=G.loot,c=L&&L.decor===ch?ch.contents.slice():null,glint=(G.msgs||[]).some(m=>/glints at the bottom/.test(m.text||''));
    let hp=0,mp=0,other=[];if(c)for(const q of c){const d=ITEMDEF[q.id]||{};if(d.heal&&d.k==='potion')hp+=q.n||1;else if(d.mana&&d.k==='potion')mp+=q.n||1;else other.push(q.id)}
    if(c){for(const q of c)bagAdd({id:q.id,n:q.n||1});ch.contents=[];G.loot=null}
    return {there,opened:!!c,hp,mp,other,glint,gold:G.gold-gold0,ids:c&&c.map(q=>q.id)}}"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.goto('http://localhost:%s/index.html?town=oldhaven&lvl=34&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'", timeout=150000)
        pg.wait_for_function("()=>LEVEL===305", timeout=120000)
        pg.wait_for_timeout(4000)
        pg.evaluate(HELP)
        pg.evaluate("async()=>{for(let i=0;i<200&&!EP.ready;i++){if(!EP.loading)epLoad();await T.wait(100)}}")
        # ---------------- the whole game ----------------
        ids = pg.evaluate("()=>{const a=[...SR_BIG];for(let n=50;n<=59;n++)a.push(n);for(let n=100;n<=151;n++)a.push(n);return a}")
        res = {n: pg.evaluate("n=>(" + SEALED + ")(n)", n) for n in ids}
        built = {n: r for n, r in res.items() if not r.get('unbuilt')}
        unb = [n for n, r in res.items() if r.get('unbuilt')]
        badl = {n: r['bad'] for n, r in built.items() if r['bad']}
        check('every room of every level is sealed, hidden and leaves the level untouched; no weak potion in a chest', not badl, badl)
        big = pg.evaluate("()=>SR_BIG")
        miss = [n for n in big if n in built and built[n]['rooms'] == 0]
        print('  big levels with no room:', miss, ' not built without a visit to their area:', unb)
        check('every big level that was built has rooms (at most two without)', len(miss) <= 2, miss)
        small = [n for n in ids if n not in big and n in built]
        have = [n for n in small if built[n]['rooms'] > 0]
        print('  small desert dungeons with rooms:', have)
        rooms = sum(r['rooms'] for r in built.values()); mons = sum(r['mon'] for r in built.values())
        print('  levels %d, rooms %d, with a creature %d (%.1f percent)' % (len([1 for r in built.values() if r['rooms']]), rooms, mons, 100.0 * mons / max(1, rooms)))
        check('the creature share is 25 percent by design (22 to 28)', rooms > 0 and 22 <= 100.0 * mons / rooms <= 28, (rooms, mons))
        check('level 1 got no extra rooms', pg.evaluate("()=>!SR_ROOMS[1]"))
        with open(os.path.join(os.environ.get('TEMP', '.'), 'sr_whole.json'), 'w') as f:
            json.dump({str(k): v for k, v in built.items()}, f)
        # ---------------- samples ----------------
        samples = [497, 475, 471, 42, 53, 9674]
        mon_lv = [n for n, r in built.items() if r['mon'] and r['rooms'] and n not in samples]
        if mon_lv:
            samples.append(mon_lv[0])
        samples = [n for n in samples if n in built and built[n]['rooms']]
        gold_seen = []
        for n in samples:
            pg.evaluate("()=>{G.flags.ep_sec={};G.flags.sr_mon={}}")
            rs = pg.evaluate("n=>SR_ROOMS[n].map(s=>({id:s.id,door:s.door,from:s.from,cells:s.cells,chest:s.chest,mon:s.mon}))", n)
            for s in rs:
                r = pg.evaluate("""async a=>{const [n,s]=a;await T.go(n,s.from[0],s.from[1],T.face(s.door[0]-s.from[0],s.door[1]-s.from[1]));
                    const sealed0=G.grid[s.door[1]][s.door[0]]!==0;G.msgs=[];await T.fwd();
                    const opened=G.grid[s.door[1]][s.door[0]]===0,said=(G.msgs||[]).some(m=>/stones here are loose/.test(m.text||''));
                    await T.fwd();const inDoor=G.P.x===s.door[0]&&G.P.y===s.door[1];
                    return {sealed0,opened,said,inDoor,flag:!!(G.flags.ep_sec&&G.flags.ep_sec[s.id])}}""", [n, s])
                check('L%d %s opens by walking into the wall' % (n, s['id']), r['sealed0'] and r['opened'] and r['flag'] and r['inDoor'] and r['said'], r)
                if s['mon']:
                    m = pg.evaluate("""s=>{const e=G.enemies.find(q=>q.srRoom===s.id);if(!e)return null;const roster=(LEVELS[LEVEL].enemies||[]).map(q=>q.t);
                        return {t:e.t,alert:e.alert,inRoom:s.cells.some(c=>c[0]===e.x&&c[1]===e.y),notChest:!(e.x===s.chest[0]&&e.y===s.chest[1]),notDoor:!(e.x===s.door[0]&&e.y===s.door[1]),inRoster:roster.includes(e.t),hp:e.hp,flag:G.flags.sr_mon[s.id]}}""", s)
                    check('L%d %s: a creature of the level wakes in the room, visible, not on the chest' % (n, s['id']), m and m['alert'] and m['inRoom'] and m['notChest'] and m['notDoor'] and m['inRoster'] and m['hp'] > 0 and m['flag'] == 1, m)
                    pg.evaluate("s=>{for(const e of G.enemies)if(e.srRoom===s.id)e.hp=0}", s); pg.wait_for_timeout(700)
                else:
                    check('L%d %s: no creature in a quiet room' % (n, s['id']), pg.evaluate("s=>!G.enemies.some(e=>e.srRoom===s.id)", s))
                r = pg.evaluate("async s=>(" + CHEST + ")(s)", s)
                ok = r.get('there') and r.get('opened') and r['hp'] >= 1 and r['mp'] >= 1 and 2 <= r['hp'] + r['mp'] <= 4 and len(r['other']) == 1 and r['glint']
                check('L%d %s: chest holds potions of both kinds (2 to 4) and one surprise item' % (n, s['id']), ok, r)
                gold_seen.append(r.get('gold', 0) > 0)
            r = pg.evaluate("""async n=>{const ok=writeSave('sr_sectest');const sv=readSave('sr_sectest');restore(sv);await T.wait(900);
                for(let i=0;i<100&&!(EP.ready&&SR.lv===n&&SR.gd===G.decor);i++)await T.wait(100);await T.wait(400);
                const o=[];for(const s of SR_ROOMS[n]){const ch=G.decor.find(d=>d.kname==='sr_'+s.id);o.push([s.id,G.grid[s.door[1]][s.door[0]]===0,!!(G.flags.ep_sec&&G.flags.ep_sec[s.id]),ch&&ch.contents?ch.contents.length:'none',G.enemies.some(e=>e.srRoom===s.id&&e.hp>0)])}
                try{localStorage.removeItem('abbeySave_sr_sectest')}catch(e){}return {ok,o,lv:LEVEL}}""", n)
            check('L%d save and load keep every door open, every chest empty and every killed creature dead' % n, r['ok'] and r['lv'] == n and all(q[1] and q[2] and q[3] == 0 and not q[4] for q in r['o']), r)
        check('some chests hold gold and some do not', any(gold_seen) and not all(gold_seen), gold_seen)
        # ---------------- every input opens a sealed wall (level 497) ----------------
        s_ = pg.evaluate("()=>{const s=SR_ROOMS[497][0];return {id:s.id,door:s.door,from:s.from}}")
        fx, fy = s_['from']; f = [[0, -1], [1, 0], [0, 1], [-1, 0]].index([s_['door'][0] - fx, s_['door'][1] - fy])
        inputs = [('key W', "key:w"), ('key ArrowUp', "key:ArrowUp"), ('on-screen forward arrow', "click:fwd"), ('Space (attack/use)', "key: "), ('click on the wall', "click:view")]
        for label, how in inputs:
            pg.evaluate("s=>{const F=G.flags.ep_sec||{};delete F[s.id];SR.gd=null}", s_)
            pg.evaluate("async a=>{await T.go(497,a[0],a[1],a[2]);G.lockT=0;G.msgs=[]}", [fx, fy, f])
            pg.wait_for_timeout(600)
            if how.startswith('key:'):
                pg.keyboard.press(how[4:])
            elif how == 'click:fwd':
                b_ = pg.evaluate("()=>{const b=(BTNS||[]).find(q=>q.id==='fwd');if(!b)return null;const c=document.querySelector('canvas'),r=c.getBoundingClientRect();return {x:b.x,y:b.y,w:b.w,h:b.h,rw:r.width,rh:r.height,rx:r.left,ry:r.top}}")
                if b_:
                    lw = pg.evaluate("()=>typeof DW!=='undefined'?DW:480"); lh = pg.evaluate("()=>typeof DH!=='undefined'?DH:320")
                    pg.mouse.click(b_['rx'] + (b_['x'] + b_['w'] / 2) * b_['rw'] / lw, b_['ry'] + (b_['y'] + b_['h'] / 2) * b_['rh'] / lh)
                else:
                    pg.evaluate("()=>act('fwd')")
            else:
                c = pg.evaluate("()=>{const r=document.querySelector('canvas').getBoundingClientRect();return [r.left+r.width*.42,r.top+r.height*.3]}")
                pg.mouse.click(c[0], c[1])
            pg.wait_for_timeout(700)
            r = pg.evaluate("s=>({open:G.grid[s.door[1]][s.door[0]]===0,flag:!!(G.flags.ep_sec&&G.flags.ep_sec[s.id]),said:(G.msgs||[]).some(m=>/stones here are loose/.test(m.text||''))})", s_)
            check('497 %s opens with %s' % (s_['id'], label), r['open'] and r['flag'] and r['said'], r)
        # ---------------- the draught hint ----------------
        pg.evaluate("s=>{const F=G.flags.ep_sec=G.flags.ep_sec||{};delete F[s.id];G.grid[s.door[1]][s.door[0]]=1;SR.gd=null;EP.hint={}}", s_)
        pg.evaluate("async a=>{await T.go(497,a[0],a[1],a[2]);G.msgs=[];EP.hint={};EP.hintAt=null}", [fx, fy, f]); pg.wait_for_timeout(2600)
        check('a draught is felt beside a sealed wall', pg.evaluate("()=>(G.msgs||[]).some(m=>/draught/.test(m.text||''))"))
        # ---------------- the map fog ----------------
        pg.evaluate("async()=>{await T.go(497,3,3,0)}")
        r = pg.evaluate("""async()=>{delete G.flags.mplFog;MPLF.arr={};MPLF.flags=null;await T.wait(1200);const L=LEVELS[497],W=L.rows[0].length,a=mplFogArr();
            return {on:mplFogOn(L),near:a[G.P.y*W+G.P.x],far:a[(L.rows.length-3)*W+(W-5)]}}""")
        check('the map of a maze is under cloud far from the party and clear where it stands', r['on'] and r['near'] == 1 and r['far'] == 0, r)
        check('no page errors', not errs, errs[:5])
        b.close()
    print('ALL PASSED' if not FAILS else 'FAILED: ' + ', '.join(FAILS))
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    main()
