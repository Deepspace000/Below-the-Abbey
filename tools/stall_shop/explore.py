"""Scan towns for stall-like decor (one browser, closed at the end). python -u tools/stall_shop/explore.py 3 13 ..."""
import sys, time, json
from playwright.sync_api import sync_playwright
LV=[int(x) for x in sys.argv[1:]]
JS="""(lv)=>{const L=LEVELS[lv];if(!L||!L.decor)return null;const re=/stall|market|awning|cart|tent|booth|counter|barrow|stand|wagon|canopy|pavilion|kiosk/i;const out={};
 let npcs=0;for(const d of L.decor){if(d.npc)npcs++;const k=d.k||'';if(re.test(k)){const key=k+(d.shop?' [shop]':'')+(d.npc?' [npc '+d.npc+']':'')+(d.loot?' [loot]':'')+(d.block?' B':'');out[key]=(out[key]||0)+1}}
 const h={};for(const d of L.decor){if(d.npc)continue;const k=d.k||'?';h[k]=(h[k]||0)+1}
 const kinds=Object.entries(h).sort((a,b)=>b[1]-a[1]).map(e=>e[0]+':'+e[1]).join(' ');
 return {name:LEVEL_NAMES[lv],n:L.decor.length,npcs,out,kinds}}"""
with sync_playwright() as p:
    b=p.chromium.launch(channel='chrome',args=['--use-gl=swiftshader','--enable-unsafe-swiftshader'])
    try:
        pg=b.new_page(viewport={'width':900,'height':600})
        pg.goto('http://localhost:8352/index.html?town=thornwick&lvl=34&v=%d'%time.time(),wait_until='domcontentloaded',timeout=90000)
        pg.wait_for_function("()=>typeof G!=='undefined'&&G.state==='play'",timeout=120000);pg.wait_for_timeout(1500)
        print('loaded',flush=True)
        for lv in LV:
            t=time.time()
            pg.evaluate("(lv)=>{try{if(lv===44&&LEVELS[44].stub){khEnter(()=>{goToLevel(44,null);G.state='play';G.menu=false});return}}catch(e){}goToLevel(lv,null);G.state='play';G.menu=false}",lv)
            try: pg.wait_for_function("(lv)=>LEVEL===lv&&G.state==='play'&&!TP",arg=lv,timeout=90000)
            except Exception: print(lv,'noload',flush=True);continue
            print(lv,'%.0fs'%(time.time()-t),json.dumps(pg.evaluate(JS,lv)),flush=True)
    finally:
        b.close()
