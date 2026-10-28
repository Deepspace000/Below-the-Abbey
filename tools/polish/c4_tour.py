import json,time,pathlib
from playwright.sync_api import sync_playwright
from PIL import Image
import numpy as np
H=pathlib.Path(__file__).resolve().parent
OUT=H/'c4_shots'
GO=open(H/'c2_go.js',encoding='utf-8').read()
A1=open(H/'c2_audit.js',encoding='utf-8').read()
A2=open(H/'c3_audit2.js',encoding='utf-8').read()
SM=open(H/'c3_samples.js',encoding='utf-8').read()
TARGETS="""()=>{const L=LEVELS[475];const T=[];const zs=L._hgdp.zones.filter(z=>z.type==='safe');
for(const z of zs)T.push(['hub_'+z.name.replace(/\W/g,''),z.x,z.y,null]);
for(let t=0;t<8;t++){const q=L.decor.find(d=>d.npc==='hgd_q'+t);if(q)T.push(['q'+t,q.x,q.y,null])}
for(const d of L.decor.filter(d=>/^hgd_church\d$/.test(d.npc)))T.push(['church'+d.npc.slice(-1),d.x,d.y,null]);
const hs=L.decor.filter(d=>d.hs==='hgdpc_house');for(const i of [0,7,14,21,28])if(hs[i])T.push(['house'+i,hs[i].x,hs[i].y,null]);
const sg=L.decor.filter(d=>d.hgt&&zs.some(z=>Math.hypot(d.x-z.x,d.y-z.y)<=z.r+4));
const seen={};for(const d of sg){const k=d.hgtBase;if((seen[k]=(seen[k]||0)+1)<=2)T.push(['sign_'+k.slice(7)+seen[k],d.x,d.y,null])}
for(const d of L.decor.filter(d=>d.kname==='Landmark plaque').slice(0,6))T.push(['plaque_'+d.x+'_'+d.y,d.x,d.y,null]);
return T}"""
errs=[]
def lum(p):
    im=np.asarray(Image.open(p).convert('RGB').crop((8,60,950,480)),dtype=float)
    return round(float((0.2126*im[...,0]+0.7152*im[...,1]+0.0722*im[...,2]).mean()),1)
res={}
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    t0=time.time()
    pg.goto('http://localhost:8362/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=90000);pg.wait_for_timeout(6000)
    pg.wait_for_function('()=>typeof LOAD!=="undefined"&&LOAD.t>0&&LOAD.d>=LOAD.t',timeout=300000);pg.wait_for_timeout(4000)
    res['load_s']=round(time.time()-t0)
    r=pg.evaluate(A1);r.pop('heights',None);res['audit1']=r
    res['audit2']=pg.evaluate(A2)
    try: res['hgt']=pg.evaluate("()=>{const l=hgtList();return {n:l.length,sample:l.filter(x=>x.lvl===475).slice(0,12)}}")
    except Exception as e: res['hgt']=str(e)
    T=pg.evaluate(TARGETS);print(len(T),flush=True)
    res['shots']={}
    for n,x,y,f in T:
        g=pg.evaluate(GO,[x,y,f]);pg.wait_for_timeout(1300);fp=str(OUT/(n+'.png'));pg.screenshot(path=fp)
        res['shots'][n]=[x,y,g,lum(fp)];print(n,x,y,g,res['shots'][n][3],flush=True)
    S=pg.evaluate(SM);L={}
    for s in S:
        for kind in('hubs','cors'):
            for i,(x,y) in enumerate(s[kind]):
                pg.evaluate(GO,[x,y,None]);pg.wait_for_timeout(800);fp=str(OUT/('lum_%s_%s%d.png'%(s['z'].replace(' ',''),kind,i)));pg.screenshot(path=fp)
                L.setdefault(s['z'],{}).setdefault(kind,[]).append(lum(fp))
    res['lum']=L
    # frame time
    res['frame_ms']=pg.evaluate("()=>new Promise(r=>{let n=0,t=performance.now();function f(){if(++n<60)requestAnimationFrame(f);else r((performance.now()-t)/60)}requestAnimationFrame(f)})")
    res['errs']=errs[:10]
    json.dump(res,open(H/'c4_result.json','w'),indent=1)
    b.close()
print('DONE')
