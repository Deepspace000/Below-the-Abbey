import json,time,pathlib,sys
from playwright.sync_api import sync_playwright
H=pathlib.Path(__file__).resolve().parent
OUT=H/'towns_critic2_shots'
GO=open(H/'c2_go.js',encoding='utf-8').read()
AUD=open(H/'c2_audit.js',encoding='utf-8').read()
TARGETS="""()=>{const L=LEVELS[475];const T=[];
for(let t=0;t<8;t++){const q=L.decor.find(d=>d.npc==='hgd_q'+t);if(q)T.push(['q'+t,q.x,q.y,null])}
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))T.push(['church'+d.npc.slice(-1),d.x,d.y,null]);
const hs=L.decor.filter(d=>d.hs);for(const i of [0,5,10,15,20,25,30])if(hs[i])T.push(['house'+i,hs[i].x,hs[i].y,null]);
for(const d of L.decor.filter(d=>/^hgdpc_vn/.test(d.k)).filter((d,i)=>i%4===0))T.push(['vign'+d.k.slice(8),d.x,d.y,null]);
return T}"""
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    t0=time.time()
    pg.goto('http://localhost:8372/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=90000);pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t',timeout=180000);pg.wait_for_timeout(4000)
    print('load s',round(time.time()-t0))
    r=pg.evaluate(AUD);r.pop('heights',None);print(json.dumps(r)[:2500])
    T=pg.evaluate(TARGETS);print(len(T))
    for n,x,y,f in T:
        g=pg.evaluate(GO,[x,y,f]);pg.wait_for_timeout(1300);pg.screenshot(path=str(OUT/(n+'.png')));print(n,x,y,g)
    print('ERRS',errs[:8])
    b.close()
