"""Deeper Hollow polish B screenshots: python tools/polish/b_shots.py OUTDIR  (server on 8372)"""
import sys, json, time, pathlib
from playwright.sync_api import sync_playwright
OUT = pathlib.Path(sys.argv[1]); OUT.mkdir(parents=True, exist_ok=True)
SET = "([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C={x,y,a:G.P.angT};if(G.lvlBanners)G.lvlBanners.length=0;G.msgs=[];G.talk=null;return [x,y,f]}"
PLAN = """()=>{const L=LEVELS[475],M=L._hgdm,rows=L.rows,D=[[0,-1],[1,0],[0,1],[-1,0]],op=(x,y)=>rows[y]&&rows[y][x]==='.';const out=[];
 const fi=(a,b)=>D.findIndex(d=>d[0]===a&&d[1]===b);
 for(const v of (L._hgpb&&L._hgpb.log.vign||[])){const [n,x,y]=v;const ob=D.find(([a,b])=>op(x+a,y+b));if(!ob)continue;let s=3;while(s>0&&!op(x+ob[0]*s,y+ob[1]*s))s--;out.push(['v_'+n.replace(/[^A-Za-z]/g,''),x+ob[0]*s,y+ob[1]*s,fi(-ob[0],-ob[1])])}
 const posts=L.decor.filter(d=>d.npc==='hgdb_post').slice(0,6);for(const d of posts){let f=-1;for(let i=0;i<4;i++){const [a,b]=D[i];if(op(d.x+a,d.y+b)&&!op(d.x-a,d.y-b)==false){}}
   // face the wall the sign hangs on, standing in the cell
   out.push(['post_'+d.x+'_'+d.y,d.x,d.y,fi(d.wd[0],d.wd[1])])}
 const lamps=L.decor.filter(d=>d.k==='hg_lamp'&&M.bio[d.y*M.W+d.x]>=4).slice(0,40);for(const d of lamps.slice(-3)){const ob=D.find(([a,b])=>op(d.x+a,d.y+b));if(!ob)continue;let s=4;while(s>0&&!op(d.x+ob[0]*s,d.y+ob[1]*s))s--;out.push(['lamp_'+d.x+'_'+d.y,d.x+ob[0]*s,d.y+ob[1]*s,fi(-ob[0],-ob[1])])}
 const top=M.spots.find(s=>s.boss);out.push(['atrium_s',top.x,top.y+8,0],['atrium_mid',top.x,top.y+3,0],['atrium_n',top.x,top.y-2,0],['gate_foot',top.x,3,0]);
 const near=(x,y)=>{for(let r=0;r<8;r++)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(op(x+a,y+b))return [x+a,y+b];return [x,y]};
 const sp=M.spots.filter(s=>s.x>=0&&M.bio[s.y*M.W+s.x]>=4&&!s.boss);const pick=(t,n)=>sp.filter(s=>s.type===t).slice(0,n);
 for(const s of pick(3,3)){const c=near(s.x,s.y);out.push(['spot_atrium_'+s.x+'_'+s.y,c[0],c[1],1])}
 for(const s of pick(2,2)){const c=near(s.x,s.y);out.push(['spot_room_'+s.x+'_'+s.y,c[0],c[1],2])}
 for(const s of pick(1,2)){const c=near(s.x,s.y);out.push(['spot_clear_'+s.x+'_'+s.y,c[0],c[1],3])}
 for(const z of (L._hgdp.zones||[]).filter(z=>z.town!==undefined&&z.town!==null&&M.bio[z.y*M.W+z.x]>=4).slice(0,4)){const c=near(z.x,z.y);out.push(['town_'+z.name.replace(/ /g,''),c[0],c[1],0])}
 return out}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1100, 'height': 760})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8372/index.html?town=deephollow&lvl=34&v=%d' % time.time(), wait_until='commit', timeout=400000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&typeof LEVEL!=="undefined"&&LEVEL===475&&G.grid&&LEVELS[475]._hgpb', timeout=400000)
    pg.wait_for_timeout(4000)
    plan = json.loads(json.dumps(pg.evaluate(PLAN)))
    extra = json.loads(sys.argv[2]) if len(sys.argv) > 2 else []
    for name, x, y, f in plan + extra:
        pg.evaluate(SET, [x, y, f]); pg.wait_for_timeout(2200); st=pg.evaluate('()=>[LEVEL,G.state,G.P.x,G.P.y,G.P.f,Math.round(G.C.x),Math.round(G.C.y),!!G.menu,!!G.cut,!!TP]'); print(st); pg.screenshot(path=str(OUT / ('%s.png' % name))); print(name, x, y, f)
    r = pg.evaluate("()=>{const d=LEVELS[475].decor.find(q=>q.npc==='hgdb_note'&&q.pbt&&/Cold|nineteen/.test(q.pbt));return d?[d.x,d.y]:null}")
    print('note', r)
    if r:
        pg.evaluate(SET, [r[0], r[1], 0]); pg.evaluate("([x,y])=>{startTalk(LEVELS[475].decor.find(q=>q.x===x&&q.y===y&&q.npc==='hgdb_note'))}", r); pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'talk_note.png'))
        pg.evaluate("()=>{G.talk=null}")
    r = pg.evaluate("()=>{const d=LEVELS[475].decor.find(q=>q.npc==='hgdb_post');return d?[d.x,d.y]:null}")
    if r:
        pg.evaluate(SET, [r[0], r[1], 0]); pg.evaluate("([x,y])=>{startTalk(LEVELS[475].decor.find(q=>q.x===x&&q.y===y&&q.npc==='hgdb_post'))}", r); pg.wait_for_timeout(2500); pg.screenshot(path=str(OUT / 'talk_post.png'))
        print(pg.evaluate("()=>LEVELS[475].decor.filter(q=>q.npc==='hgdb_post').map(q=>q.pbt)"))
    print('ERRS', errs[:10]); b.close()
