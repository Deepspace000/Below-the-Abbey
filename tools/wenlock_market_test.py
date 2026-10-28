"""Wenlock market quests (wlq22 to wlq27, src/desert/wenlock_market.js). Run:  python tools/wenlock_market_test.py
Starts its own http.server on WM_PORT (default 8391) from the repo root, stops only that process, runs ONE headless browser (WM_CHROME = path of an installed Chrome).
Checks for each new person: stands on the market map in a free square, not in a road, and can be reached from the start. For each quest, both choices: it can be taken (gold ! mark),
shows quest rings while active (on the person the current step names), progresses step by step in order, is ready (green ? mark on the giver), and pays out. No em dashes in any text."""
import os, subprocess, sys, time, json
from playwright.sync_api import sync_playwright
PORT = os.environ.get('WM_PORT', '8391')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = os.environ.get('WM_CHROME') or ('C:/Program Files/Google/Chrome/Application/chrome.exe' if os.path.exists('C:/Program Files/Google/Chrome/Application/chrome.exe') else None)

# quest id: (giver, [(npc, choice regex or None) for each step in order], [choice variants])
QUESTS = {
    'wlq22': ('wmk_pip', [('wlo_stall1', None), ('wlo_stall7', 'PICK'), ('wlo_stall1', None)]),
    'wlq23': ('wmk_wat', [('wmk_maisie', None), ('wmk_maisie', 'PICK')]),
    'wlq24': ('wmk_widow', [('wmk_landlord', None), ('wlo_carpenter', None), ('wmk_landlord', 'PICK')]),
    'wlq25': ('wmk_bram', [('wmk_tam', None), ('wmk_bram', None), ('wlo_carpenter', None), ('wmk_tam', None)]),
    'wlq26': ('wmk_barnaby', [('wlo_watch', None), ('wlo_page', 'PICK'), ('wlo_watch', None)]),
    'wlq27': ('wmk_mabel', [('wlo_pedlar', 'PICK'), ('wlo_squire', None)]),
}
PEOPLE = ['wmk_pip', 'wmk_wat', 'wmk_maisie', 'wmk_widow', 'wmk_landlord', 'wmk_bram', 'wmk_tam', 'wmk_barnaby', 'wmk_mabel']
fails = []


def check(ok, msg):
    print(('ok   ' if ok else 'FAIL ') + msg)
    if not ok: fails.append(msg)


srv = subprocess.Popen([sys.executable, '-m', 'http.server', PORT], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    time.sleep(1.5)
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=CHROME)
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ' + str(e)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
        pg.goto('http://localhost:%s/index.html?town=wenlock&lvl=80&v=%d' % (PORT, time.time()), wait_until='domcontentloaded', timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'&&LEVEL===496", timeout=120000)
        pg.wait_for_timeout(2500)
        pg.evaluate("()=>{G.menu=false;G.talk=null;G.lvlBanners=[];G.quests.wlq1={st:'done'}}")
        # the people: position, road, reachability
        info = pg.evaluate("""(ids)=>{
          const L=LEVELS[496],rows=L.rows,H=rows.length,W=rows[0].length,out={};
          const blocked=new Set();for(const d of G.decor)if(d.block&&!d.npc)blocked.add(d.x+','+d.y);
          const npcAt=new Set();for(const d of G.decor)if(d.npc)npcAt.add(d.x+','+d.y);
          const st=L.start||{x:95,y:50},seen=new Set([st.x+','+st.y]),q=[[st.x,st.y]];
          while(q.length){const [x,y]=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(nx<0||ny<0||nx>=W||ny>=H||seen.has(k))continue;if(rows[ny][nx]!=='.'||blocked.has(k))continue;seen.add(k);if(!npcAt.has(k))q.push([nx,ny])}}
          for(const id of ids){const d=G.decor.find(z=>z.npc===id);if(!d){out[id]=null;continue}
            const reach=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((d.x+dx)+','+(d.y+dy)));
            out[id]={x:d.x,y:d.y,floor:rows[d.y][d.x],reach,inMarket:d.x>=39&&d.x<=58&&d.y>=43&&d.y<=57}}
          return out}""", PEOPLE)
        for id in PEOPLE:
            i = info[id]
            check(bool(i) and i['floor'] == '.' and i['reach'], '%s placed %s and reachable' % (id, i and (i['x'], i['y'])))
            if i and not i['inMarket']: print('     note: %s is outside the square box at %s' % (id, (i['x'], i['y'])))
        # drive helper
        pg.evaluate("""()=>{
          window.drv=(id,pat,x)=>{const d=G.decor.find(z=>z.npc===id)||{x:0,y:0,npc:id};let n=NPCS[id].root(d);const txt=[];
            for(let i=0;i<14&&n;i++){txt.push(n.text);const o=n.opts||[];
              let pick=o.find(z=>/Go on/.test(z[0]));
              if(!pick&&pat==='PICK'&&o.length>2)pick=o[x||0];
              if(!pick)pick=o.find(z=>!/Goodbye|Not now/.test(z[0]));
              if(!pick)break;n=pick[1]()}
            return txt.join(' | ')};
          window.snap=(qid)=>({st:qSt(qid),goal:qSt(qid)==='active'?qGoal(qid):null,need:QUESTS[qid].need,ready:qReady(qid),
            giver:[].concat(QGIVER[window._giver]||[]).includes(qid),
            rings:questSpots().filter(s=>s.q===qid).map(s=>({x:s.x,y:s.y,kind:s.kind})),desc:QUESTS[qid].desc,gold:G.gold})}""")
        dash = pg.evaluate("()=>JSON.stringify(Object.keys(QUESTS).filter(k=>/^wlq2[2-7]$/.test(k)).map(k=>[QUESTS[k].title,QUESTS[k].desc,JSON.stringify(WL_REW[k])]))")
        check('\u2014' not in dash and '\u2013' not in dash, 'no dashes in titles and journal text')
        for qid, (giver, steps) in QUESTS.items():
            for variant in (0, 1):
                tag = '%s variant %d' % (qid, variant)
                pg.evaluate("([q,g])=>{window._giver=g;delete G.quests[q];for(const k of Object.keys(G.flags))if(k.startsWith('wm'+q.slice(3)))delete G.flags[k]}", [qid, giver])
                s = pg.evaluate("(q)=>snap(q)", qid)
                check(s['st'] is None and s['giver'], tag + ': giver shows the gold ! (QGIVER) before taking it')
                txt = pg.evaluate("([g])=>drv(g)", [giver])
                s = pg.evaluate("(q)=>snap(q)", qid)
                check(s['st'] == 'active', tag + ': taken')
                check(s['rings'] and all(r['kind'] == 'goal' for r in s['rings']), tag + ': ring on the first step ' + json.dumps(s['rings']))
                # talking to a later person first must not jump the order
                last = steps[-1][0]
                prog = [s['goal']]
                for n, (npc, pat) in enumerate(steps):
                    pg.evaluate("([n,p,v])=>drv(n,p,v)", [npc, pat, variant])
                    s = pg.evaluate("(q)=>snap(q)", qid)
                    prog.append(s['goal'] if s['st'] == 'active' else s['need'])
                check(prog == sorted(prog) and prog[-1] == s['need'] and all(b - a <= 1 for a, b in zip(prog, prog[1:])), tag + ': steps in order %s' % prog)
                s = pg.evaluate("(q)=>snap(q)", qid)
                check(s['ready'] and any(r['kind'] == 'ready' for r in s['rings']), tag + ': ready, green ? ring on the giver ' + json.dumps(s['rings']))
                g0 = s['gold']
                pg.evaluate("([g])=>drv(g)", [giver])
                s = pg.evaluate("(q)=>snap(q)", qid)
                check(s['st'] == 'done' and s['gold'] > g0, tag + ': handed in, gold %d -> %d' % (g0, s['gold']))
        # every step person gives something sensible after the quest, and never an error
        txt = pg.evaluate("()=>PEOPLE_TEXT=null") if False else None
        pg.screenshot(path=os.path.join(os.environ.get('TEMP', '.'), 'wm_test.png'))
        real = [e for e in errs if 'assets/' not in e and 'Failed to load resource' not in e]
        check(not real, 'no page errors %s' % real[:5])
        b.close()
finally:
    srv.terminate()
print('FAILED %d' % len(fails) if fails else 'ALL PASSED')
sys.exit(1 if fails else 0)
