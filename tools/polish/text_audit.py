import sys,json;sys.path.insert(0,'tools/polish')
from text_lib import *
with sync_playwright() as p:
    b,pg,errs=start(p)
    r=pg.evaluate('''()=>{const o={};try{hgduBuild()}catch(e){o.e1=String(e)}try{hgdwBuild()}catch(e){o.e2=String(e)}
     try{if(typeof KH_READY!=='undefined'&&!KH_READY){KH_READY=true}hlAll()}catch(e){o.e3=String(e)}for(const id of HGSG.IDS){try{hgsApply(LEVELS[id])}catch(e){o.e4=String(e)}};const lv={};for(const id in LEVELS){const L=LEVELS[id];if(!L||!L.decor)continue;const n=L.decor.filter(d=>d.k==='hl_p_note').length;if(n)lv[id]=n}
     o.hlnote=lv;const l=hgtList();o.n=l.length;o.empty=l.filter(q=>!q.label);o.blankKinds={};for(const q of l)o.blankKinds[q.kind]=(o.blankKinds[q.kind]||0)+1;o.list=l;
     o.byLevel={};for(const q of l)o.byLevel[q.lvl]=(o.byLevel[q.lvl]||0)+1;return o}''')
    json.dump(r['list'],open('tools/polish/text_labels.json','w'),indent=0)
    r.pop('list');print(json.dumps(r)[:1500],errs[:3]);b.close()
