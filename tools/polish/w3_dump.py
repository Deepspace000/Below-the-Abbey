import sys, json, time
from playwright.sync_api import sync_playwright
LV = int(sys.argv[1]) if len(sys.argv)>1 else 477
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width':1100,'height':760})
    errs=[]
    OFF=len(sys.argv)>2 and sys.argv[2]=='off'
    if OFF: pg.add_init_script('window.HGDWE_OFF=1')
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' and 'Failed to load' not in m.text else None)
    pg.goto('http://localhost:8334/index.html?town=deephollow&lvl=34&v=%d'%time.time(),wait_until='commit',timeout=120000); pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'&&LEVEL===475",timeout=420000,polling=1000); pg.wait_for_timeout(12000)
    r = pg.evaluate("""(lv)=>{try{if(KH_LAZY[lv])KH_LAZY[lv]();}catch(e){return {err:String(e)}}
      const L=LEVELS[lv];if(!L)return {err:'nolevel'};
      const meta={};for(const d of L.decor){const k=d.k;if(!meta[k]){const im=IMG[k];meta[k]=[NPC_H[k]===undefined?null:NPC_H[k],im&&im.width?im.width:0,im&&im.width?im.height:0]}}
      return {meta,lights:(typeof HGDWE!=='undefined'&&lv===477)?HGDWE.lights:[],info:L._hgdwe||null,rows:L.rows,start:L.start,decor:L.decor,enemies:L.enemies,items:L.items,npcs:L.npcs||[],signs:L.signs||[],keys:Object.keys(L)}}""", LV)
    json.dump(r, open('tools/polish/e_dump_%d%s.json'%(LV,'_before' if OFF else ''),'w'))
    print(r.get('err'), r.get('keys'), len(r.get('decor',[])), len(r.get('enemies',[])), 'errs', errs[:5])
    b.close()
