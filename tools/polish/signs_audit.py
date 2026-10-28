import sys, json, os, time
sys.path.insert(0, os.path.dirname(__file__))
os.environ['A_PORT']='8345'
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 1000, 'height': 640})
    bad=[]; errs=[]
    pg.on('response', lambda r: bad.append((r.status, r.url)) if r.status>=400 else None)
    pg.on('requestfailed', lambda r: bad.append(('FAIL', r.url)))
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:8345/index.html?town=deephollow&lvl=34&v=%d'%time.time(), wait_until='domcontentloaded', timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475", timeout=180000)
    pg.wait_for_timeout(9000)
    r = pg.evaluate("""()=>{try{hgduBuild()}catch(e){}try{hgdwBuild()}catch(e){}hgsAll();
      const out={};for(const id of [475,476,477]){const L=LEVELS[id];if(!L){out[id]='none';continue}const c={};let left=0;
        for(const d of L.decor){if(d.hgs)c[d.hgs]=(c[d.hgs]||0)+1;if(d.k==='hl_p_note')left++}out[id]={kinds:c,left,info:L._hgs}}
      return out}""")
    print(json.dumps(r))
    print('BAD', len(bad)); 
    for x in sorted(set(bad)): print(x)
    print('ERRS', errs[:5])
    b.close()
