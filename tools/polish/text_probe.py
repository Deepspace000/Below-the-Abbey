import sys;sys.path.insert(0,'tools/polish')
from text_lib import *
with sync_playwright() as p:
    b,pg,errs=start(p)
    print(pg.evaluate('''()=>{try{if(typeof KH_READY!=='undefined'&&!KH_READY){KH_READY=true}hlAll()}catch(e){}for(const id of HGSG.IDS)try{hgsApply(LEVELS[id])}catch(e){};const o0=LEVELS[441].decor.filter(d=>d.hgt).map(d=>[d.npc,d.k,d.hgtBase,d.hgt,d.note]);const o={o0,KH:typeof KH_READY!=='undefined'?KH_READY:'na',ids:HGSG.IDS.length};for(const id of [364,440,441,450,460,39]){const L=LEVELS[id];o[id]=L?[!!L.decor,L.decor?L.decor.filter(d=>d.k==='hl_p_note'||d.hgt).length:0,L.decor?L.decor.filter(d=>d.hgt).length:0]:null}return o}'''),errs[:2]);b.close()
