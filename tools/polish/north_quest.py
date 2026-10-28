import sys,os,json; sys.path.insert(0,os.path.dirname(__file__))
from north_boot import *
with sync_playwright() as p:
    b,pg,errs=boot(p,900,560)
    r=pg.evaluate("""()=>{const L=LEVELS[475],M=L._hgdm,W=M.W,H=M.H,bad=[],ok={n:0};
      const D=L.decor.filter(d=>d.npc&&M.bio[d.y*W+d.x]<4&&!d.pic);
      for(const d of D){ok.n++;try{const c=L.rows[d.y][d.x];if(c==='#'||(c.charCodeAt(0)>=0x2e0&&c.charCodeAt(0)<0x2e8))bad.push(['onwall',d.k,d.x,d.y]);
        if(!NPCS[d.npc]){bad.push(['nonpc',d.npc,d.x,d.y]);continue}
        if(!IMG[d.k]&&!IMG['art_'+d.k])bad.push(['noimg',d.k,d.x,d.y]);
        G.talk=null;startTalk(d);const t=G.talk&&G.talk.node&&G.talk.node.text;if(G.talk&&(!t||/undefined|NaN/.test(t)))bad.push(['badtext',d.npc,d.x,d.y,String(t).slice(0,30)]);G.talk=null}catch(e){bad.push(['err',d.npc,d.x,d.y,String(e).slice(0,60)])}}
      // notes: every note readable
      const N=L.decor.filter(d=>(d.npc==='hgd_note'||d.npc==='hgd_pa_note')&&M.bio[d.y*W+d.x]<4);let nn=0,nb=0;for(const d of N){G.talk=null;startTalk(d);const t=G.talk&&G.talk.node&&G.talk.node.text;nn++;if(!t||t.length<12)nb++;G.talk=null}
      // quest givers keep their marks
      const qg=D.filter(d=>typeof QGIVER!=='undefined'&&QGIVER[d.npc]).length;
      // items reachable
      const items=L.items.filter(i=>M.bio[i.y*W+i.x]<4);
      let save=false;try{save=writeSave('t_north')}catch(e){save='err '+e}
      let rd=null;try{rd=!!readSave('t_north')}catch(e){rd='err'}
      return {npcs:ok.n,bad:bad.slice(0,20),badN:bad.length,notes:nn,notesBad:nb,qgivers:qg,items:items.length,save,rd}}""")
    print(json.dumps(r,indent=0)[:3000]);print([e for e in errs if 'Failed to load' not in e][:5]);b.close()
