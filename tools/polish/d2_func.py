import sys, json, pathlib
sys.path.insert(0,'tools/polish')
from d2_load import *
OUT=pathlib.Path('C:/Users/mirko/AppData/Local/Temp/d2shots')
with sync_playwright() as p:
    b,pg,errs=open_level(p,960,720)
    pg.evaluate('()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();G.heroes[0].eq.off=mkItem("torch");G.lightLevel=1}')
    r=pg.evaluate('''()=>{const out={};const L=LEVELS[476];
      const fr=L.decor.filter(d=>d.npc==='wm_orbframe');out.frames=fr.length;
      goToLevel(476,{x:fr[0].x,y:fr[0].y+1,f:0});
      return out}''')
    pg.wait_for_timeout(1500)
    r2=pg.evaluate('''()=>{const out={};const fr=G.decor.filter(d=>/^wm_orbframe\d$/.test(d.k));out.gframes=fr.length;out.flagged=fr.filter(d=>d.orbFrame).length;
      const d=fr[0];const n0=(G.bag||[]).filter(i=>i&&i.k==='glowOrb').length;
      const ok=orbTake(d);const n1=(G.bag||[]).filter(i=>i&&i.k==='glowOrb').length;out.take=[ok,n0,n1,d.k,d.orbTaken,JSON.stringify(G.flags.orbTaken)];
      // second take refused
      out.again=orbTake(d);
      // shrines and boatman
      out.shrines=G.decor.filter(d=>d.npc&&/^bsu_shr/.test(d.npc)).map(d=>[d.k,!!IMG[d.k],d.sc]);
      out.boatman=G.decor.filter(d=>d.npc==='bsu_boatman').map(d=>[d.k,!!IMG[d.k]]);
      out.noImg=[...new Set(G.decor.filter(d=>!IMG[d.k]&&!d.pic&&d.k!=='teleporter').map(d=>d.k))];
      out.picNoImg=[...new Set(G.decor.filter(d=>d.pic&&!IMG[d.k]).map(d=>d.k))];
      // read a sign by bumping its wall
      const sg=G.decor.find(d=>d.pic&&/rune/.test(d.k));out.sign=sg?[sg.x,sg.y,sg.wd]:null;
      if(sg){G.talk=null;const r=desertBump(sg.x+sg.wd[0],sg.y+sg.wd[1],0);out.bump=[r,!!G.talk,G.talk&&G.talk.n&&G.talk.n.name]}
      // map and minimap draw
      try{drawMinimap(0,0,124,124);out.mini='ok'}catch(e){out.mini=String(e)}
      try{G.map=true;drawOverview?0:0;out.map='ok'}catch(e){out.map=String(e)}
      G.map=false;G.talk=null;
      try{const s=snapshot();out.snap=typeof s==='object'?Object.keys(s).length:typeof s;out.snapflags=JSON.stringify(s.flags&&s.flags.orbTaken)}catch(e){out.snap=String(e)}
      return out}''')
    print(json.dumps(r2,indent=0)[:2500])
    print('errors',[e for e in errs if 'Failed to load' not in e][:8]); b.close()
