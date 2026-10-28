"""Writes meta.json: title, giver, level names of each stage for every quest id (for the report)."""
import sys, json, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from qlib import *
HERE = os.path.dirname(os.path.abspath(__file__))
ids = [i for v in json.load(open(HERE + '/main_ids.json')).values() for i in v]
with sync_playwright() as p:
    b, pg, errs = boot(p)
    pg.add_script_tag(path=HERE + '/qr_page.js')
    m = pg.evaluate("""(ids)=>{const o={};for(const id of ids){const q=QUESTS[id];if(!q){o[id]=null;continue}
      const st=s=>{const sp=QRF.specs(id,s)||[];return sp.map(x=>({lvl:x.lvl,what:x.npc?x.npc.join('/'):x.en?'creatures '+x.en.source:x.item?'item '+x.item:x.xy?'square':x.ch?'exit':x.fn?'custom':'?',name:(LEVEL_NAMES[x.lvl]||'')}))};
      const g=(QRF.specs(id,'give')||[])[0];let gn='';if(g&&g.npc){const n=NPCS[g.npc[0]];gn=n&&n.name?n.name:g.npc[0]}
      o[id]={title:q.title,who:q.who,giver:gn,give:st('give'),act:st('act'),ready:st('ready')}}return o}""", ids)
    json.dump(m, open(HERE + '/meta.json', 'w'), indent=1)
    print(len(m)); b.close()
