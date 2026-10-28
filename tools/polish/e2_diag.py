import time
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg=b.new_page(viewport={'width':1100,'height':760}); errs=[]
    pg.on('pageerror',lambda e:errs.append('PE '+str(e)[:300]))
    pg.on('console',lambda m:errs.append(m.type+' '+m.text[:200]) if m.type in('error','warning') else None)
    pg.goto('http://localhost:8344/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000)
    pg.wait_for_timeout(45000)
    print(pg.evaluate("()=>typeof G==='undefined'?'noG':[G.state,LEVEL]"))
    print(len(errs)); print('\n'.join([e for e in errs if '404' not in e and 'Failed to load' not in e][:10])); b.close()
