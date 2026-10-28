()=>{const L=LEVELS[477],E=L._hgdwe,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
const P=E.vignettes.map(v=>[v.x,v.y]);const far=L._hgdw.far;
const bad=L.enemies.filter(e=>!(Math.abs(e.x-far.x)<=2&&Math.abs(e.y-far.y)<=2)).map(e=>[e.t,e.x,e.y,+Math.min(...P.map(q=>Math.hypot(q[0]-e.x,q[1]-e.y))).toFixed(1)]).filter(e=>e[3]<6);
// approach squares: up to 4 open squares straight from every piece
const appr=[];for(const q of P)for(const d of [[0,-1],[1,0],[0,1],[-1,0]]){for(let k=1;k<=4;k++){const x=q[0]+d[0]*k,y=q[1]+d[1]*k;if(!open(x,y))break;appr.push([x,y,q[0],q[1]])}}
const onAppr=L.enemies.filter(e=>appr.some(a=>a[0]===e.x&&a[1]===e.y)).map(e=>[e.t,e.x,e.y]);
const notes=L.decor.filter(d=>d.hgdwText!==undefined||d.npc==='hgdw_note');
const titles=notes.map(d=>d.label);const badT=titles.filter(t=>!t||/\.\.\.|^Note$|[-–—]/.test(t)||t.split(' ').length>4);
const dupT={};titles.forEach(t=>dupT[t]=(dupT[t]||0)+1);const dups=Object.keys(dupT).filter(t=>dupT[t]>1);
const hs=G.decor.filter(d=>d.hgtBase||d.hgt).map(d=>[d.x,d.y,d.hgt]);const wrong=G.decor.filter(d=>(d.hgdwText!==undefined)&&(d.hgtBase||d.hgt)&&d.hgt!==d.label).map(d=>[d.x,d.y,d.hgt,d.label]);
const unlettered=G.decor.filter(d=>d.hgdwText!==undefined&&!d.hgt&&/^art_hs_/.test(d.k)).map(d=>[d.x,d.y,d.k]);
// chest counting
const ch=G.decor.filter(d=>d.k==='uw_shellchest'&&d.hgdwTier);const moved=ch.filter(d=>d.hgdwOrig);
G.flags.hgdwOpened={};const steps=[];let n=0;for(const d of ch){d.contents=null;d.goldTaken=false;try{openLoot(d)}catch(e){}try{lootFor(d)}catch(e){}G.loot=null;n++;steps.push(QUESTS.wq4.goal())}
const quest={chests:ch.length,moved:moved.length,steps,keys:Object.keys(G.flags.hgdwOpened).length};G.flags.hgdwOpened={};
// quest only with moved chests
const q2=[];for(const d of moved){try{lootFor(d)}catch(e){}q2.push(QUESTS.wq4.goal())}G.flags.hgdwOpened={};
// old save: both keys for one moved chest
const m0=moved[0];let oldBoth=null;if(m0){G.flags.hgdwOpened={};G.flags.hgdwOpened[m0.x+','+m0.y]=1;G.flags.hgdwOpened[m0.hgdwOrig[0]+','+m0.hgdwOrig[1]]=1;oldBoth=QUESTS.wq4.goal()}G.flags.hgdwOpened={};
// runs: gaps without a tall prop on the line
const tallOn=d=>!d.pic&&!/^art_hgwm_|^uw_seagrass|^art_hgdf_|^uw_vent|^uw_sw|^ltree/.test(d.k)&&hgweHt(d)>=.8;const S=L.rows.length;let gaps=0,runsN=0,worst=0;
const chk=(cells)=>{runsN++;const on=cells.map(c=>L.decor.some(d=>d.x===c[0]&&d.y===c[1]&&(tallOn(d)||(d.hgdwText&&d.pic))));for(const side of [1,-1]){let last=side>0?-1:cells.length;for(let s=0;s<cells.length;s++){const i=side>0?s:cells.length-1-s;if(on[i])last=i;else if(Math.abs(i-last)>worst)worst=Math.abs(i-last)}}};
for(let y=1;y<S-1;y++){let x=1;while(x<S-1){if(!open(x,y)){x++;continue}const x0=x;while(open(x,y))x++;if(x-x0>=8){const c=[];for(let i=x0;i<x;i++)c.push([i,y]);chk(c)}}}
for(let x=1;x<S-1;x++){let y=1;while(y<S-1){if(!open(x,y)){y++;continue}const y0=y;while(open(x,y))y++;if(y-y0>=8){const c=[];for(let i=y0;i<y;i++)c.push([x,i]);chk(c)}}}
const hts={};for(const d of L.decor){if(/yar_nets|art_wm_barrel/.test(d.k))hts[d.k]=(hts[d.k]||[]).concat(+hweH(d))}
function hweH(d){return hgweHt(d).toFixed(2)}
return {info:L._hgw4,badEnemies:bad,onAppr,notes:notes.length,badT,dups,wrong,unlettered,quest,q2,oldBoth,runsN,worstGap:worst,hts,flagsMoved:Object.keys(G.flags.hgdwMoved||{}).length,hsn:hs.length}}
