import sys,json;sys.path.insert(0,'tools/polish')
from text_lib import *
with sync_playwright() as p:
    b,pg,errs=start(p)
    r=pg.evaluate('''()=>{const out=[];for(const id of [475,476,477]){try{ if(!LEVELS[id]||!LEVELS[id].decor){}}catch(e){}
      const L=LEVELS[id];if(!L||!L.decor){out.push([id,'nolevel']);continue}
      for(const d of L.decor){if(/^art_hs_|^hl_p_note$/.test(d.k))out.push([id,d.k,d.x,d.y,d.npc||'',hgsText(d)])}}return out}''')
    print(len(r),errs[:3]);json.dump(r,open('tools/polish/text_dump.json','w'),indent=0)
    b.close()
