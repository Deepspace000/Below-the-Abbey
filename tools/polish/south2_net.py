import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1100,'height':760})
    bad=[];err=[];n404=[]
    pg.on('requestfailed',lambda r: bad.append(r.url))
    pg.on('response',lambda r: n404.append(r.url) if r.status>=400 else None)
    pg.on('pageerror',lambda e: err.append(str(e)))
    pg.on('console',lambda m: err.append(m.type+': '+m.text[:150]) if m.type in('error','warning') else None)
    t=time.time()
    pg.goto('http://localhost:8372/index.html?town=deephollow&lvl=34&v=%d'%t,wait_until='commit',timeout=400000)
    pg.wait_for_function('typeof G!=="undefined"&&G.state==="play"&&typeof LEVEL!=="undefined"&&LEVEL===475&&G.grid&&LEVELS[475]._hgpb',timeout=400000)
    print('load s',round(time.time()-t,1))
    pg.wait_for_timeout(3000)
    print(pg.evaluate("()=>({ms:LEVELS[475]._hgpb.ms,decor:G.decor.length,lights:LEVELS[475].lights.length})"))
    fps=pg.evaluate("()=>new Promise(r=>{let n=0,t0=performance.now();const f=()=>{n++;if(performance.now()-t0>3000)r(n/3);else requestAnimationFrame(f)};requestAnimationFrame(f)})")
    print('fps(software GL)',fps)
    print('failed',bad[:5]);print('http>=400',len(n404),n404[:8]);print('errs',err[:8])
    b.close()
