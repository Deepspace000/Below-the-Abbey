"""Test of Gandrick's Cave (level 8, src/desert/gandrick_cave.js, secret rooms in secret_rooms.js).
   python tools/gandrick_test.py        (own server: python -m http.server <port> from the repo root; env PS_PORT, BTA_CHROME)
  layout    one-square tunnels (no 2x2 open block outside the halls), six halls, every open square reachable from the start (the iron gate counts as open)
  reach     every hall and Gandrick's hall reachable; the key lies outside Gandrick's hall; Gandrick is in the hall farthest by walking from the start,
            and the farthest square of the whole level is in that hall
  enemies   Gandrick unique, in his hall, with guards; 6 to 10 extra bandits in the tunnels (none in a hall, none in the first 8 squares of the start, none stacked)
  barrels   2 to 4 barrels of stolen goods in every hall, each in a corner against two walls, none blocking (flood fill with every blocker still reaches everything),
            the loot window is titled "Barrel of stolen goods" and holds 2 to 4 things
  secret    3 to 4 secret rooms, sealed, in the tunnels (not in a hall), none reachable, chest inside, barrels inside leave the chest reachable
  quest     killing Gandrick through the real damage code sets gandrickDead and the quest goal
"""
import sys, os, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('PS_PORT', '8801')
FAILS = []


def check(name, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + name + (' ' + str(extra)[:600] if extra and not ok else ''))
    if not ok:
        FAILS.append(name)


JS = r"""async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let t=0;t<6&&LEVEL!==8;t++){goToLevel(8,{x:1,y:18,f:1});for(let i=0;i<80&&LEVEL!==8;i++)await wait(100);await wait(900)}
  for(let i=0;i<100&&!(EP.ready&&SR.lv===8&&SR.gd===G.decor);i++)await wait(100);
  await wait(500);
  const L=LEVELS[8],R=L.rows,H=R.length,W=R[0].length,out={w:W,h:H,errs:[]};
  const st=L.start,halls=GC_HALLS,hn=Object.keys(halls);
  const inHall=(x,y,m)=>hn.find(k=>{const h=halls[k];return x>=h[0]-(m||0)&&x<=h[2]+(m||0)&&y>=h[1]-(m||0)&&y<=h[3]+(m||0)});
  const pass=(x,y)=>{const g=G.grid[y]&&G.grid[y][x];return g===0||g===3||g===4||g===8};
  const secretCells=new Set();for(const s of (SR_ROOMS[8]||[]))for(const c of s.cells)secretCells.add(c+'');
  const flood=(blk)=>{const d=new Map([[st.x+','+st.y,0]]),q=[[st.x,st.y]];let i=0;while(i<q.length){const [x,y]=q[i++];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(d.has(k)||!pass(nx,ny)||(blk&&blk.has(k)))continue;d.set(k,d.get(x+','+y)+1);q.push([nx,ny])}}return d};
  const D=flood(null);
  let open=0,unreached=[],twoByTwo=0;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!pass(x,y)||secretCells.has(x+','+y))continue;open++;if(!D.has(x+','+y))unreached.push(x+','+y);
    if(pass(x+1,y)&&pass(x,y+1)&&pass(x+1,y+1)&&!secretCells.has((x+1)+','+y)&&!secretCells.has(x+','+(y+1))&&!secretCells.has((x+1)+','+(y+1))&&!inHall(x,y,0)&&!inHall(x+1,y+1,0))twoByTwo++}
  out.open=open;out.unreached=unreached.slice(0,5);out.twoByTwo=twoByTwo;
  const hmin={},hmax={};for(const k of hn){const h=halls[k];let mn=1e9,mx=0;for(let y=h[1];y<=h[3];y++)for(let x=h[0];x<=h[2];x++){const d=D.get(x+','+y);if(d===undefined){out.errs.push('hall '+k+' square unreachable '+x+','+y);continue}mn=Math.min(mn,d);mx=Math.max(mx,d)}hmin[k]=mn;hmax[k]=mx}
  out.hmin=hmin;out.hmax=hmax;
  let far=null,fd=-1;for(const [k,v] of D)if(v>fd){fd=v;far=k}
  const [fx,fy]=far.split(',').map(Number);out.far=[fx,fy,fd];out.farHall=inHall(fx,fy,0);
  out.sizes=Object.fromEntries(hn.map(k=>[k,(halls[k][2]-halls[k][0]+1)*(halls[k][3]-halls[k][1]+1)]));
  const key=L.items.find(i=>i.k==='key');out.keyHall=key&&inHall(key.x,key.y,0);out.keyReach=key&&D.has(key.x+','+key.y);
  const noGate=new Map([[st.x+','+st.y,0]]),q2=[[st.x,st.y]];{let i=0;while(i<q2.length){const [x,y]=q2[i++];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(noGate.has(k)||!(G.grid[ny]&&(G.grid[ny][nx]===0||G.grid[ny][nx]===3||G.grid[ny][nx]===8)))continue;noGate.set(k,1);q2.push([nx,ny])}}}
  out.gateSeals=!noGate.has('53,30')&&noGate.has(key.x+','+key.y);
  const E=L.enemies,gand=E.filter(e=>e.t==='gandrick');out.gandN=gand.length;out.gandHall=gand[0]&&inHall(gand[0].x,gand[0].y,0);
  out.guards=E.filter(e=>(e.t==='bandit'||e.t==='archer')&&inHall(e.x,e.y,0)==='gandrick').length;
  const pas=E.filter(e=>(e.t==='bandit'||e.t==='archer')&&!inHall(e.x,e.y,0));out.passage=pas.length;
  out.passNear=pas.filter(e=>(D.get(e.x+','+e.y)||0)<=8||Math.abs(e.x-st.x)+Math.abs(e.y-st.y)<=8).length;
  out.passRoom=pas.filter(e=>inHall(e.x,e.y,1)).length;
  const seen=new Set();let dup=0;for(const e of E){const k=e.x+','+e.y;if(seen.has(k))dup++;seen.add(k)}for(const i of L.items)if(seen.has(i.x+','+i.y))dup++;out.dup=dup;
  out.badSq=E.filter(e=>!pass(e.x,e.y)).map(e=>e.t+e.x+','+e.y);
  const bar=G.decor.filter(d=>d.stolen&&!d.srB);out.barrels=Object.fromEntries(hn.map(k=>[k,bar.filter(d=>inHall(d.x,d.y,0)===k).length]));
  out.barOut=bar.filter(d=>!inHall(d.x,d.y,0)).length;
  const wall=(x,y)=>!(G.grid[y]&&G.grid[y][x]===0);
  out.notCorner=bar.filter(d=>{const h=halls[inHall(d.x,d.y,0)];if(!h)return true;const cx=(d.x===h[0]||d.x===h[2]),cy=(d.y===h[1]||d.y===h[3]);if(!(cx&&cy))return true;const ox=d.x===h[0]?-1:1,oy=d.y===h[1]?-1:1;return !(wall(d.x+ox,d.y)&&wall(d.x,d.y+oy))}).map(d=>d.x+','+d.y);
  const blk=new Set(G.decor.filter(d=>d.block&&!d.hidden).map(d=>d.x+','+d.y));const D2=flood(blk);
  out.blockedLost=[...D].filter(([k])=>!D2.has(k)&&!blk.has(k)&&!secretCells.has(k)).map(a=>a[0]).slice(0,5);
  const b0=bar[0];G.loot=null;openLoot(b0);out.lootName=G.loot&&G.loot.name;out.lootN=G.loot&&G.loot.decor.contents.length;out.lootIds=G.loot&&G.loot.decor.contents.map(q=>q.id);out.lootGold=b0.gold;G.loot=null;
  const rs=SR_ROOMS[8]||[];out.sr=rs.length;out.srInfo=rs.map(s=>({id:s.id,door:s.door,from:s.from,cells:s.cells.length,inHall:!!inHall(s.from[0],s.from[1],1),reach:s.cells.some(c=>D.has(c+'')),sealed:G.grid[s.door[1]][s.door[0]]!==0,chest:!!G.decor.find(d=>d.kname==='sr_'+s.id&&d.loot),bars:G.decor.filter(d=>d.srB===s.id).length,corridorReach:D.has(s.from+'')}));
  out.srBarsOk=true;for(const s of rs){const cells=new Set(s.cells.map(c=>c+'')),bs=new Set(G.decor.filter(d=>d.srB===s.id).map(d=>d.x+','+d.y));const ent=s.cells.find(c=>Math.abs(c[0]-s.door[0])+Math.abs(c[1]-s.door[1])===1),seen2=new Set([ent+'']),q=[ent];while(q.length){const [x,y]=q.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=(x+a)+','+(y+b);if(cells.has(k)&&!bs.has(k)&&!seen2.has(k)){seen2.add(k);q.push([x+a,y+b])}}}
    const ch=G.decor.find(d=>d.kname==='sr_'+s.id);if(!ch||![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>seen2.has((ch.x+a)+','+(ch.y+b)))||[...cells].filter(c=>!bs.has(c)&&c!==ch.x+','+ch.y).some(c=>!seen2.has(c)))out.srBarsOk=false}
  G.flags.gandrickDead=0;const ge=G.enemies.find(e=>e.t==='gandrick');out.geFound=!!ge;
  if(ge){G.cut=null;hurtEnemy(ge,99999);await wait(300);out.dead=!!G.flags.gandrickDead;out.ledger=!!G.flags.ledger;out.goal=QUESTS.gandrick.goal();G.cut=null}
  return out}"""


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('BTA_CHROME') or None)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.goto('http://localhost:%s/index.html?town=thornwick&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'", timeout=150000)
        pg.wait_for_timeout(2500)
        o = pg.evaluate(JS)
        print(json.dumps(o)[:3000])
        check('one-square tunnels: no 2x2 open block outside the halls', o['twoByTwo'] == 0, o['twoByTwo'])
        check('every open square is reachable from the start (gate open)', not o['unreached'] and not o['errs'], (o['unreached'], o['errs']))
        check('six big halls, each at least 40 squares', len(o['sizes']) == 6 and min(o['sizes'].values()) >= 40, o['sizes'])
        check('the level is much bigger than before (over 700 open squares)', o['open'] > 700, o['open'])
        check("Gandrick is in his own hall, one Gandrick only", o['gandN'] == 1 and o['gandHall'] == 'gandrick', (o['gandN'], o['gandHall']))
        gmin = o['hmin']['gandrick']
        check("Gandrick's hall is the farthest hall by walking", all(gmin > v for k, v in o['hmin'].items() if k != 'gandrick'), o['hmin'])
        check("the farthest square of the level is in Gandrick's hall", o['farHall'] == 'gandrick', o['far'])
        check("the key is reachable and lies outside Gandrick's hall; the iron gate seals the hall", o['keyReach'] and o['keyHall'] != 'gandrick' and o['gateSeals'], (o['keyHall'], o['gateSeals']))
        check("Gandrick's hall has 3 or more guards", o['guards'] >= 3, o['guards'])
        check('6 to 10 extra bandits in the tunnels', 6 <= o['passage'] <= 10, o['passage'])
        check('no tunnel bandit within 8 squares of the start, none in a hall, none stacked, all on floor', o['passNear'] == 0 and o['passRoom'] == 0 and o['dup'] == 0 and not o['badSq'], o)
        check('2 to 4 barrels of stolen goods in every hall', all(2 <= v <= 4 for v in o['barrels'].values()) and o['barOut'] == 0, o['barrels'])
        check('every barrel stands in a corner against two walls', not o['notCorner'], o['notCorner'])
        check('no blocker cuts anything off', not o['blockedLost'], o['blockedLost'])
        check('the loot window says Barrel of stolen goods and holds 2 to 4 things', o['lootName'] == 'Barrel of stolen goods' and 2 <= (o['lootN'] or 0) <= 4 and (o['lootGold'] or 0) > 0, (o['lootName'], o['lootIds']))
        check('3 or 4 secret rooms', 3 <= o['sr'] <= 4, o['sr'])
        check('secret rooms: sealed, chest inside, not in a hall, not reachable, door reached from a tunnel', all(s['sealed'] and s['chest'] and not s['inHall'] and not s['reach'] and s['corridorReach'] for s in o['srInfo']), o['srInfo'])
        check('secret rooms: barrels of stolen goods inside (at least 2 in all), chest still reachable', sum(s['bars'] for s in o['srInfo']) >= 2 and o['srBarsOk'], o['srInfo'])
        check('killing Gandrick sets the flag, the ledger and the quest goal', o.get('geFound') and o.get('dead') and o.get('ledger') and o.get('goal') == 1, o)
        check('no page errors', not errs, errs[:5])
        b.close()
    print('ALL PASSED' if not FAILS else 'FAILED: ' + ', '.join(FAILS))
    sys.exit(1 if FAILS else 0)


if __name__ == '__main__':
    main()
