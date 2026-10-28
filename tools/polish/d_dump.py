import sys, json
sys.path.insert(0,'tools/polish')
from d_load import *
with sync_playwright() as p:
    b,pg,errs=open_level(p)
    r=pg.evaluate('''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476];
      const keys=Object.keys(L);const cnt={};for(const k of keys){const v=L[k];cnt[k]=Array.isArray(v)?'arr'+v.length:typeof v}
      const dk={};for(const d of L.decor){const k=d.t||d.k||d.img||JSON.stringify(Object.keys(d));dk[k]=(dk[k]||0)+1}
      const ek={};for(const e of L.enemies){ek[e.t]=(ek[e.t]||0)+1}
      return {cnt,dk,ek,start:L.start,sample:L.decor.slice(0,5),items:L.items.slice(0,5),npcs:(L.npcs||[]).slice(0,5),sec:Object.keys(L._hgdo||{}),boats:L._hgdo&&L._hgdo.boats,docks:L._hgdo&&L._hgdo.docks,island:L._hgdo&&L._hgdo.island,mapNames:L.mapNames,lights:L.lights&&L.lights.length}}''')
    print(json.dumps(r)[:6000]); print(errs[:5]); b.close()
