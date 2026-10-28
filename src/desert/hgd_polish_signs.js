/* ==========================================================================
   THE DEEPER HOLLOW, SIGNAGE PASS (prefix hgs / HGSG). Runs last, after hgd_polish_a..e.
   Every note, signpost and wall note in the built Deeper Hollow levels (475 the maze, 476 the under level, 477 the drowned maze)
   used one parchment scrap with a red handprint (hl_p_note). This pass gives each one a sign that fits what it says, from a set of
   twelve painted pictures (assets/hp/signs_*.png, loaded as art_hs_*): arrow signpost, notice board, hanging sign, stone tablet,
   rune stone, brass plaque, scroll on a board, lantern waymarker, parchment page, grave marker, cracked slate, warning board.
   It only changes the picture, the scale and where the thing stands. The text, the click and the quest data are untouched.
   Wall notes stay on the wall. Posts, waymarkers, markers and warning boards stand in the corner of the square next to the wall,
   never in the middle of a corridor. Idempotent (d.hgs marks a finished entry). Exposes LEVELS[n]._hgs for the audit.
   ========================================================================== */
const HGSG={IDS:[475,476,477],KEEP:new Set(),done:{}};
// how tall each picture is next to a person (a person is about 0.95), and the kind: wall = flat on the wall, stand = stands in a square
const HGS_SET={
  page:{h:.55,wall:1},scroll:{h:.62,wall:1},tablet:{h:.62,wall:1},plaque:{h:.46,wall:1},slate:{h:.6,wall:1},board:{h:.82,wall:1},hanging:{h:.72,wall:1},
  post:{h:1.02,sc:.9},waymarker:{h:.66,sc:1},runestone:{h:.78,sc:1},marker:{h:.5,sc:1},warning:{h:.56,sc:1}};
Object.keys(HGS_SET).forEach(k=>{NPC_H['art_hs_'+k]=HGS_SET[k].h});
const HGS_PLACEHOLDER=new Set(['hl_p_note']);
function hgsText(d){
  if(d.text)return String(d.text);if(d.pbt)return String(d.pbt);if(d.hgdwText)return String(d.hgdwText);
  try{if(d.npc==='hgd_note'&&typeof HGDF_NOTES!=='undefined'){const i=d.note!==undefined?d.note:0;return String(HGDF_NOTES[i%HGDF_NOTES.length]||'')}}catch(e){}
  return String(d.txt||'');
}
function hgsPick(d,list){return list[Math.floor(hash2(d.x,d.y,4711)*list.length)%list.length]}
function hgsKind(d,txt){
  const t=txt.toLowerCase(),npc=d.npc||'';
  if(npc==='hgdb_post')return hgsPick(d,['post','post','waymarker']);
  if(/^hl_vance|letter/.test(npc)||/\bdear\b|\byours\b|\bsincerely\b/.test(t))return 'page';
  if(/\bcarved|\betched|\bchis+elled|\bengraved/.test(t))return /\brune|glyph|runic/.test(t)?hgsPick(d,['runestone','tablet']):hgsPick(d,['tablet','plaque']);
  if(/\bnotice\b|\bwanted\b|\breward\b|\bmissing\b|\bby order\b|\brules\b|\bannounce|\bposted\b|\bboard\b/.test(t)||/board|notice/.test(npc))return 'board';
  if(/\bshop\b|\bstall\b|\bsells?\b|\bfor sale\b|\bwares\b|\binn\b|\btavern\b|\btrader\b|\bbakery\b|\bsmith\b|\bprices?\b|\bopen (from|until|daily)\b/.test(t))return 'hanging';
  if(/\bhere lies\b|\bin memory\b|\brest in\b|\bbeloved\b|\bepitaph\b|\bdied\b|\bgrave\b|\bburied\b|\btomb\b|\bmourn/.test(t))return hgsPick(d,['marker','tablet','plaque']);
  if(/\bbeware\b|\bdanger\b|\bwarning\b|\bdo not\b|\bdon't\b|\bnever\b|\bkeep out\b|\bturn back\b|\btrap\b|\bstay away\b|\bforbidden\b/.test(t))return hgsPick(d,['warning','slate','slate']);
  if(/\brune\b|\brunes\b|\bglyph|\bsigil/.test(t))return hgsPick(d,['runestone','tablet','slate']);
  if(/\b(turn|go|head|path|way|steps|stairs|ladder|exit|door|gate)\b.*\b(north|south|east|west|left|right|up|down|ahead|behind)\b|\bthis way\b|\blies to the\b|→|←|↑|↓/.test(t))return hgsPick(d,['post','waymarker','plaque']);
  if(/\bdiary\b|\bjournal\b|\bi (have|was|am|saw|heard|found|think|left|wrote)\b|\bmy (wife|husband|friend|lantern|boots|pack|notes|candle)\b|\blast night\b|\bday \d/.test(t))return hgsPick(d,['page','scroll']);
  return hgsPick(d,['page','scroll','slate','plaque','tablet','page','scroll']);
}
function hgsOne(L,d){
  if(d.hgs||!HGS_PLACEHOLDER.has(d.k))return false;
  const txt=hgsText(d),kind=hgsKind(d,txt),S=HGS_SET[kind],img='art_hs_'+kind;
  if(typeof IMG!=='undefined'&&!(IMG[img]&&IMG[img].width)){return false} // picture not loaded yet: try again later
  d.hgsOld=d.k;d.k=img;d.hgs=kind;
  if(S.wall){d.pic=1;d.bob=Math.max(.12,.56-S.h/2)} // centred at about chest height whatever its size
  else{ // a standing sign: in the corner of the square beside the wall, never in the middle of the way
    const wd=d.wd||[0,0];d.hgsWd=wd.slice?wd.slice():wd;d.pic=0;d.ox=wd[0]*.3;d.oy=wd[1]*.3;
    if(wd[0]===0&&wd[1]!==0)d.ox=(hash2(d.x,d.y,17)<.5?-1:1)*.14;else if(wd[1]===0&&wd[0]!==0)d.oy=(hash2(d.x,d.y,19)<.5?-1:1)*.14;
    d.sc=S.sc*(.94+hash2(d.x,d.y,23)*.12);d.bob=0;d.block=false;d.walk=true;d.deco=true}
  return true;
}
function hgsApply(L){
  if(!L||!L.decor)return null;
  const info=L._hgs||(L._hgs={n:0,kinds:{},left:0});
  for(const d of L.decor){if(hgsOne(L,d)){info.n++;info.kinds[d.hgs]=(info.kinds[d.hgs]||0)+1}}
  info.left=L.decor.filter(d=>HGS_PLACEHOLDER.has(d.k)).length;
  return info;
}
function hgsAll(){for(const id of HGSG.IDS){try{hgsApply(LEVELS[id])}catch(e){console.error('hgs',id,e)}}}
{const _b=hgdBuild;hgdBuild=function(){const r=_b.apply(this,arguments);try{hgsAll()}catch(e){console.error('hgs',e)}return r}}
{const _b=hgduBuild;hgduBuild=function(){const r=_b.apply(this,arguments);try{hgsAll()}catch(e){console.error('hgs',e)}return r}}
{const _b=hgdwBuild;hgdwBuild=function(){const r=_b.apply(this,arguments);try{hgsAll()}catch(e){console.error('hgs',e)}return r}}
// a safety net for notes that a later pass adds, and for pictures that had not finished loading at build time
{const _sl=setupLights;setupLights=function(){const r=_sl.apply(this,arguments);try{hgsAll();if(G&&G.decor&&HGSG.IDS.includes(LEVEL))for(const d of G.decor)hgsOne(LEVELS[LEVEL],d)}catch(e){console.error('hgs',e)}return r}}
// NO 404s ON LOAD: the game asks for an icon file for every item id, but many items (food, bows, rings, axes) have no file and are made in code
// from a base icon. Ask only for the icon and spell pictures that exist (tools/inject.py writes the list as ICN_FILES).
{const _li=loadImg,have=new Set(ICN_FILES);loadImg=function(name,src){const m=/^assets\/((?:icn_|sp_)[^/]+)\.png$/.exec(src||'');if(m&&!have.has(m[1]))return Promise.resolve();return _li.apply(this,arguments)}}
