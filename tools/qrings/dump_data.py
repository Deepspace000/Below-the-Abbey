"""Dumps every level's people, creatures, items and doors to JSON next to this file (for writing quest ring specs). Needs your own server."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
ids = [i for v in json.load(open(HERE + '/main_ids.json')).values() for i in v]
with sync_playwright() as p:
    b, pg, errs = boot(p)
    pg.wait_for_function("()=>{khLoadAssets();return KH_READY}", timeout=120000)
    pg.add_script_tag(path=HERE + '/qr_page.js')
    pg.evaluate("async()=>{QR.fresh();await QR.goto(44);QR.buildAll()}")
    r = pg.evaluate("""()=>{const o={},po={},it={};for(const lv in LEVELS){const L=LEVELS[lv];if(!L||!L.decor)continue;const a=[];for(const d of L.decor){if(d.npc)a.push([d.npc,(NPCS[d.npc]&&NPCS[d.npc].name)||'',d.x,d.y,d.hidden?1:0,d.cat||0])}
      const en={};for(const e of (L.enemies||[]))en[e.t]=(en[e.t]||0)+1;
      if(a.length||Object.keys(en).length)o[lv]={n:a,en};po[lv]={po:(L.portals||[]).filter(p=>p).map(p=>[p.x,p.y,p.to]),start:L.start&&[L.start.x,L.start.y],w:L.rows&&L.rows[0].length,h:L.rows&&L.rows.length};
      if(L.items&&L.items.length)it[lv]=L.items.map(i=>[i.k||i.id,i.x,i.y])}
      return {o,po,it}}""")
    json.dump(r['o'], open(HERE + '/npcs.json', 'w')); json.dump(r['po'], open(HERE + '/portals.json', 'w')); json.dump(r['it'], open(HERE + '/items.json', 'w'))
    idx = pg.evaluate("()=>QR.npcIdx()")
    out = pg.evaluate("(ids)=>{const idx=QR.npcIdx();return ids.map(i=>QR.info(i,idx))}", ids)
    json.dump(out, open(HERE + '/oracle.json', 'w'), indent=1)
    print('levels', len(r['o']))
    b.close()
