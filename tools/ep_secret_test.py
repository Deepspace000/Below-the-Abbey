"""Test of the secret rooms in the crypts below the Abbey (level 1; src/desert/early_polish.js, EP_SECRETS).
   python tools/ep_secret_test.py        (own server: python -m http.server <port> from the repo root; env PS_PORT, BTA_CHROME)
Checks, from fresh flags:
  sealed    every room is closed: its door square is solid, the room touches nothing open but its door, and no square of it
            (nor its chest) can be reached from the start without opening a door
  open      walking forward into the door from the corridor square opens it (the real move, doMove), with the plain message
  walk      the party walks in (doMove) to the square beside the chest, opens the chest by walking into it, finds 2 to 4
            healing potions and takes them
  save      a save made after all four are opened and emptied loads again with every door open and every chest empty
"""
import sys, os, time
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8621')
FAILS = []


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra) if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


HELP = r"""
window.T = {
  wait: ms => new Promise(r => setTimeout(r, ms)),
  go: async (x, y, f) => { for (let t = 0; t < 6 && LEVEL !== 1; t++) { goToLevel(1, {x, y, f}); for (let i = 0; i < 60 && LEVEL !== 1; i++) await T.wait(100); await T.wait(1200) } // the jump town may still be arriving: try again until the crypts stay
    G.P.x = x; G.P.y = y; G.P.f = f; G.P.angT = (f - 1) * Math.PI / 2; G.C = {x, y, a: G.P.angT}; G.enemies = []; G.lockT = 0; G.cut = null; G.talk = null; G.loot = null; await T.wait(700) },
  fwd: async () => { G.lockT = 0; doMove(0); await T.wait(450); G.lockT = 0 },
  face: (dx, dy) => [[0,-1],[1,0],[0,1],[-1,0]].findIndex(d => d[0] === dx && d[1] === dy),
  reach: () => { const s = LEVELS[1].start, seen = new Set([s.x + ',' + s.y]), q = [[s.x, s.y]];
    while (q.length) { const [x, y] = q.pop(); for (const [a, b] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + a, ny = y + b, k = nx + ',' + ny;
      const g = G.grid[ny] && G.grid[ny][nx]; if (seen.has(k) || g === undefined || !(g === 0 || g === 3 || g === 4 || g === 8)) continue; seen.add(k); q.push([nx, ny]) } } return seen }
};"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.goto('http://localhost:%s/index.html?town=oldhaven&lvl=10&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'", timeout=150000)
        pg.wait_for_function("()=>LEVEL===305", timeout=120000)   # let the jump to Oldhaven finish first, so it cannot land after our move
        pg.wait_for_timeout(4000)
        pg.evaluate(HELP)
        pg.evaluate("async()=>{delete G.flags.ep_sec;G.bag=[];await T.go(3,18,0);for(let i=0;i<200;i++){if(LEVEL===1&&typeof EP!=='undefined'&&EP.ready&&EP_SECRETS[1].every(s=>s.cells.every(([x,y])=>G.grid[y][x]===0)))break;await T.wait(100)}await T.wait(500)}")  # the polish pictures load, the rooms are hollowed out
        secs = pg.evaluate("()=>EP_SECRETS[1]")
        check('four secret rooms are listed', len(secs) == 4, len(secs))
        r = pg.evaluate("""()=>{const out=[],R=T.reach();for(const s of EP_SECRETS[1]){const cells=new Set(s.cells.map(c=>c+'')),bad=[];
            if(G.grid[s.door[1]][s.door[0]]===0)bad.push('door open');
            for(const [x,y] of s.cells){if(G.grid[y][x]!==0)bad.push('room square '+x+','+y+' solid');if(R.has(x+','+y))bad.push('room square '+x+','+y+' reachable');
              for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(cells.has([nx,ny]+'')||(nx===s.door[0]&&ny===s.door[1]))continue;if(G.grid[ny][nx]===0)bad.push('leak at '+nx+','+ny)}}
            if(!R.has(s.from+''.replace(/,/,',')))bad.push('corridor square not reachable');
            const ch=G.decor.find(d=>d.kname==='epsec_'+s.id);if(!ch||!ch.loot)bad.push('no chest');
            if(bad.length)bad.push('LEVEL '+LEVEL+' ready '+EP.ready);out.push([s.id,bad])}return out}""")
        for sid, bad in r:
            check('room %s is sealed and hidden' % sid, not bad, bad)
        for s in secs:
            sid = s['id']; fx, fy = s['from']; dx, dy = s['door'][0] - fx, s['door'][1] - fy
            r = pg.evaluate("""async s=>{const [fx,fy]=s.from,dx=s.door[0]-fx,dy=s.door[1]-fy;await T.go(fx,fy,T.face(dx,dy));G.msgs=[];await T.fwd();
                const opened=G.grid[s.door[1]][s.door[0]]===0,said=(G.msgs||[]).some(m=>/stones here are loose/.test(m.text||''));
                await T.fwd(); const inDoor=G.P.x===s.door[0]&&G.P.y===s.door[1];
                return {opened,said,inDoor,flag:!!(G.flags.ep_sec&&G.flags.ep_sec[s.id])}}""", s)
            check('room %s opens from the corridor (walk into the wall)' % sid, r['opened'] and r['flag'] and r['inDoor'], r)
            check('room %s opening message' % sid, r['said'], r)
            r = pg.evaluate("""async s=>{const ch=G.decor.find(d=>d.kname==='epsec_'+s.id),open=(x,y)=>G.grid[y]&&G.grid[y][x]===0&&!G.decor.some(d=>d.block&&d.x===x&&d.y===y);
                let st=null;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=ch.x+a,y=ch.y+b;if(open(x,y)&&(s.cells.some(c=>c[0]===x&&c[1]===y)||(x===s.door[0]&&y===s.door[1]))){st=[x,y,T.face(-a,-b)];break}}
                if(!st)return {err:'no square beside the chest'};
                // walk there square by square from the door with the real move
                const path=[];{const prev={},k=(x,y)=>x+','+y,q=[[s.door[0],s.door[1]]];prev[k(...s.door)]=null;while(q.length){const [x,y]=q.shift();if(x===st[0]&&y===st[1])break;for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b;if(prev[k(nx,ny)]!==undefined||!open(nx,ny))continue;prev[k(nx,ny)]=[x,y];q.push([nx,ny])}}
                  let c=[st[0],st[1]];while(c&&!(c[0]===s.door[0]&&c[1]===s.door[1])){path.unshift(c);c=prev[k(...c)]}}
                for(const [x,y] of path){const f=T.face(x-G.P.x,y-G.P.y);G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT;await T.fwd()}
                const there=G.P.x===st[0]&&G.P.y===st[1];G.P.f=st[2];G.P.angT=(st[2]-1)*Math.PI/2;G.C.a=G.P.angT;const before=bagCount('potion');await T.fwd();
                const L=G.loot,c=L&&L.decor===ch?ch.contents.slice():null,pots=c?c.filter(q=>q.id==='potion').reduce((a,q)=>a+(q.n||1),0):0;
                if(c){for(const q of c)bagAdd({id:q.id,n:q.n||1});ch.contents=[];G.loot=null}
                return {there,opened:!!c,pots,taken:bagCount('potion')-before}}""", s)
            check('room %s: walk in, open the chest, 2 to 4 healing potions taken' % sid, r.get('there') and r.get('opened') and 2 <= r.get('pots', 0) <= 4 and r.get('taken') == r.get('pots'), r)
        r = pg.evaluate("""async()=>{const ok=writeSave('ep_sectest');const sv=readSave('ep_sectest');restore(sv);await T.wait(800);await T.go(3,18,0);await T.wait(800);
            const o=[];for(const s of EP_SECRETS[1]){const ch=G.decor.find(d=>d.kname==='epsec_'+s.id);o.push([s.id,G.grid[s.door[1]][s.door[0]]===0,!!(G.flags.ep_sec&&G.flags.ep_sec[s.id]),ch&&ch.contents?ch.contents.length:'none'])}
            try{localStorage.removeItem('abbeySave_ep_sectest')}catch(e){}return {ok,o}}""")
        check('save and load keep every door open and every chest empty', r['ok'] and all(q[1] and q[2] and q[3] == 0 for q in r['o']), r)
        check('no page errors', not errs, errs[:5])
        b.close()
    print('ALL PASSED' if not FAILS else 'FAILED: ' + ', '.join(FAILS))
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    main()
