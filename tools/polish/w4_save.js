()=>{const L=LEVELS[477];const ch=G.decor.filter(d=>d.k==='uw_shellchest'&&d.hgdwTier);const moved=ch.filter(d=>d.hgdwOrig);

 const r={chests:ch.length,moved:moved.length};

 // old save: only the flag list, keyed by the OLD position of a moved chest

 const m=moved[0];if(m){G.flags.hgdwOpened={};G.flags.hgdwOpened[m.hgdwOrig[0]+','+m.hgdwOrig[1]]=1;m.contents=null;m.goldTaken=false;openLoot(m);r.oldSaveOpensEmpty=(m.contents&&m.contents.length===0)&&m.goldTaken===true;G.loot=null}

 // new save: position record round trip

 const o=ch.find(d=>!d.hgdwOrig)||ch[0];o.contents=[{id:'pearl',n:1}];o.goldTaken=true;const sd=sparseDecor();r.keys=Object.keys(sd).filter(k=>k.indexOf('hgw3:')===0).length;

 o.contents=null;o.goldTaken=false;applySparseDecor(sd);r.newSaveRestored=!!(o.contents&&o.contents.length===1)&&o.goldTaken===true;

 // old index-keyed save must not mark random decor

 const bad={};bad[5]={contents:null,gold:0,goldTaken:false,found:true,opened:false,ambushed:false};const before=L.decor.filter(d=>d.found).length;applySparseDecor(bad);r.indexIgnored=L.decor.filter(d=>d.found).length===before;

 o.contents=null;o.goldTaken=false;G.flags.hgdwOpened={};return r}