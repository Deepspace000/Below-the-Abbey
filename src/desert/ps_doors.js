/* ps_doors.js: every castle link door is a painted door (Pale Spire, levels of PSP.LEVELS). Runs once on every castle level after it is built (after ps_wallart.js).
   The packages (courtyard, halls, wings, dungeon) each drew their own door tiles: code-drawn planks and brass bands, the engine's gatesC_0 and stairFix_0 stand-ins, green glyph panels, a pink gate.
   Here each door tile of a level that is a real door (a link, a locked stair, a sealed gate, a stair, a warp hatch, the dungeon door) is rebuilt from the painted door pieces by function:
     great  door_great    the great doors and gatehouse gates (a pointed stone frame, double iron-banded black oak)
     oak    door_oak      ordinary room doors (lodge, mews, kitchen, guardroom, passages)
     iron   door_ironbound locked doors, the key stairs and warp hatches (black iron studs)
     dungeon door_dungeon the dungeon door with its grille
     igate  cell_door    the barred iron gates (courtyard gate, East Postern, sealed gates)
     stairarch arch_stair a stair going up or down (an open arch with steps)
   Secret doors, niches, closets and the barred audience door are left as they are (they are meant to look like wall or panelling). */
function psdoStyle(id,D,at){
  if(!D)return null;
  if(D.psh==='niche'||D.psh==='closet'||D.psh==='barred'||D.psw==='secret'||D.psd==='secret'||D.psh==='secret')return null;
  if(D.psd==='sealed')return 'igate';
  if(D.psd==='warp')return 'iron';
  if(D.psd==='stair'||D.psw==='stair')return 'stairarch';
  if(D.psw==='dungeon')return 'dungeon';
  if(D.psw==='lock')return 'iron';
  let lk=D.psp||D.link||null;if(!lk&&at&&typeof pspLinkAt==='function')try{lk=pspLinkAt(id,at[0],at[1])||null}catch(e){}
  const nm=String((D.pspName||(lk&&lk.name)||D.name||'')),lock=(D.lock||(lk&&lk.lock));
  if(!lk&&!D.lvl&&D.lvl!==0&&!D.psh)return null;
  if(lock)return 'iron';
  if(D.seal||(lk&&lk.prov)||/postern|courtyard gate|west gate|east gate/i.test(nm))return 'igate';
  if(/stair|steps/i.test(nm))return 'stairarch';
  if(/dungeon/i.test(nm))return 'dungeon';
  if(/great door|great gate|the great|gate of|grand|gallery|audience|banquet|hall|chapel|cloister|library/i.test(nm))return 'great';
  if(D.psc&&D.lvl===9740)return 'great';
  return 'oak'}
function psdoApply(id,L){
  if(!L||L._doored||!L.rows||!L.chars)return L;L._doored=1;const rep={};
  const ch=L.ceilH||4,seen=new Set();
  for(let y=0;y<L.rows.length;y++){const r=L.rows[y];for(let x=0;x<r.length;x++){const c=r[x];if(c==='.')continue;const g=L.chars[c];if(g===undefined||seen.has(g))continue;const D=KH_DOOR[g];if(!D)continue;seen.add(g);
    const st=psdoStyle(id,D,[x,y]);if(!st)continue;
    const wh=id===9730?(st==='great'?6.6:st==='igate'?3.9:4.6):ch;
    try{const base=pspDoorGid(st,wh);if(base!==undefined&&T_TILE[base]!==undefined){T_TILE[g]=T_TILE[base];if(GY.col&&GY.col[base])GY.col[g]=GY.col[base];rep[st]=(rep[st]||0)+1}}catch(e){console.error('ps doors',id,e)}}}
  L._doors=rep;return L}
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._psdo)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{psdoApply(id,L)}catch(e){console.error('ps doors',id,e)}return LEVELS[id]||lv};w._psdo=1;KH_LAZY[id]=w}}
