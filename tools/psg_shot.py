import sys,os,json,time
from playwright.sync_api import sync_playwright
# usage: shot.py out_prefix level x y f [x y f ...]  -> screenshots at each stand
PORT=os.environ.get('BL_PORT','8622')
out=sys.argv[1];lvl=int(sys.argv[2]);stands=[tuple(int(v) for v in sys.argv[3+i*3:6+i*3]) for i in range((len(sys.argv)-3)//3)]
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'],executable_path=os.environ.get('BTA_CHROME'))
    pg=b.new_page(viewport={'width':900,'height':600})
    errs=[]
    pg.on('pageerror',lambda e:errs.append('PAGE '+str(e)))
    pg.on('console',lambda m:errs.append('CON '+m.text) if m.type=='error' else None)
    pg.goto('http://localhost:%s/index.html?town=blight1&lvl=84&v=%d'%(PORT,time.time()),wait_until='domcontentloaded',timeout=90000)
    pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&typeof LEVEL!=='undefined'",timeout=60000)
    pg.wait_for_timeout(2000)
    x,y,f=stands[0]
    pg.evaluate("([l,x,y,f])=>goToLevel(l,{x:x,y:y,f:f})",[lvl,x,y,f])
    pg.wait_for_function("(l)=>LEVEL===l&&G.state==='play'",arg=lvl,timeout=90000)
    pg.wait_for_timeout(4000)
    for i,(x,y,f) in enumerate(stands):
        pg.evaluate("([x,y,f])=>{G.P.x=x;G.P.y=y;G.P.f=f;G.enemies.forEach(e=>{e.hp=e.hp});if(typeof reveal==='function')reveal()}",[x,y,f])
        pg.wait_for_timeout(2500)
        pg.screenshot(path='%s_%d.png'%(out,i))
    print('errs',[e for e in errs if 'Failed to load' not in e][:8])
    b.close()
