/* ==========================================================================
   THE PALE SPIRE: GLUE (package 6; prefix psp / PSP). The registry PSP_REG, lazy stubs for every id 9710 to 9998, arrival wrappers (pictures first), door rules (key lock, sealed far sides),
   rating floors for jumps, the teleport stone of the courtyard, the Go to area rows and the ?town=palespire jump links. Notes: tools/PALE_SPIRE_NOTES.md.
   ========================================================================== */
const PSP_REG=PSP.LEVELS.map(l=>({id:l.id,name:l.name,level:l.lvl,W:l.W,H:l.H,kind:l.kind,pkg:l.pkg,rest:!!l.rest,get built(){return !!l.built},links:PSP.LINKS.filter(k=>k.from===l.id)}));
for(const l of PSP.LEVELS){LEVEL_NAMES[l.id]=l.name;LEVEL_RATING[l.id]=l.lvl}
/* ids that are not a planned map get the rating of the block they sit in and a plain name */
function pspRatingOf(id){const l=pspLevel(id);if(l)return l.lvl;let best=null;for(const q of PSP.LEVELS)if(q.id<=id&&(!best||q.id>best.id))best=q;return best?best.lvl:100}
if(typeof QAREA!=='undefined')for(let n=PSP.LO;n<=PSP.HI;n++)QAREA[n]=PSP.REGION;
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes(PSP.REGION))QAREA_ORDER.push(PSP.REGION);
if(typeof QWORLD!=='undefined')QWORLD[PSP.REGION]='wenlock';
if(typeof TELE_KEEP_HI!=='undefined')TELE_KEEP_HI.add(PSP.TELE.id);
/* ---------- the stub: a small pale room with a cairn, for every id that is not built ---------- */
function pspStubBuild(id){
  if(LEVELS[id])return LEVELS[id];
  const info=pspLevel(id),W=24,H=18,nm=(info&&info.name)||('The Pale Spire, room '+id);
  const C=blKit({id,W,H,name:nm,lvl:pspRatingOf(id),start:{x:12,y:13,f:0}});
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)C.solid(x,y,C.ch(pspWallGid('ash',(x*3+y)%7,2.7)));
  C.carve=(a,b,c,d)=>{for(let y=b;y<=d;y++)for(let x=a;x<=c;x++){C.rows[y][x]='.';C.block[y*W+x]=0}};
  C.carve(4,4,19,14);
  const cairn=C.dec('gy_urn',12,6,{block:true,npc:'psg_stubcairn',sc:1.1});
  if(!NPCS.psg_stubcairn)khNpc('psg_stubcairn','A cairn','gy_urn',()=>say('A cairn of pale stones, with a plain slate on top. Somebody has scratched on it: THIS PART OF THE PALE SPIRE IS NOT OPEN YET.',[BYE]));
  // a way back: the link from this id to the level that leads here (its land square is where the party stands there)
  const back=PSP.LINKS.find(l=>l.to===id&&l.land&&PSP.LINKS.some(t=>t.from===id&&t.to===l.from&&t.land));
  if(back){const tw=PSP.LINKS.find(t=>t.from===id&&t.to===back.from&&t.land);
    const gid=KH_NEXT_GID++;T_TILE[gid]=T_TILE[pspDoorGid('oak',2.7)];KH_DOOR[gid]={get lvl(){return back.from},get at(){return {x:tw.land[0],y:tw.land[1],f:tw.land[2]}}};
    C.solid(12,15,C.ch(gid))}
  C.light(8,8,C.silver);C.light(16,8,C.silver);C.light(12,12,C.silver);
  const lv=C.finish({start:{x:12,y:13,f:0}});
  lv.outdoor=false;lv.ceil='ps_vault';lv.day=0;lv.ceilH=2.7;lv.amb=.45;lv.noTele=true;lv.floorSet=[pspFloor('flag')].concat(Array(6).fill(pspFloor('flag')));lv.floor=lv.floorSet[0];lv._ps={lcol:C.lcol,col:C.silver,safe:[],loops:{},rests:[],out:false,id};
  return lv}
for(let id=PSP.LO;id<=PSP.HI;id++){if(!KH_LAZY[id]){LEVEL_RATING[id]=LEVEL_RATING[id]||pspRatingOf(id);KH_LAZY[id]=((n)=>()=>pspStubBuild(n))(id)}}
/* ---------- arrival: the pictures first (Wenlock's loader brings the graveyard, the witch wood and the Oldhaven folk; then our own manifest), then the level ---------- */
async function pspLoadOwn(){
  try{PSP.man=await (await fetch('assets/ps/manifest.json?v='+VERSION)).json()}catch(e){PSP.man={}}
  await Promise.all(Object.keys(PSP.man||{}).map(k=>{const m=PSP.man[k];return loadImg('ps_'+k,'assets/ps/'+m.file).then(()=>{if(m.h&&m.kind!=='tex')NPC_H['ps_'+k]=m.h;if(/^(arch_|alcove_|door_|gate_|bridge_arch|castle_)/.test(k))pspDePlum('ps_'+k)}).catch(()=>0)}))}
/* the painted arches and alcoves came with a dark plum fill in their openings (reads as a violet haze in the lane): turn dark purple pixels neutral blue-black */
function pspDePlum(key){try{const im=IMG[key];if(!im||!im.width||im._ps2)return;const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),a=d.data;
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const r=a[i],g=a[i+1],b=a[i+2],mx=Math.max(r,g,b);if(mx<96&&r-g>5&&b-g>5){const l=(r+g+b)/3*.8;a[i]=l*.7;a[i+1]=l*.95;a[i+2]=l*1.1}}x.putImageData(d,0,0);c._ps2=1;IMG[key]=c}catch(e){}}
function pspLoad(then){
  if(PSP._wait)return true;PSP._wait=1;
  try{msg('The Pale Lands come into view...','#d8d4f0')}catch(e){}
  Promise.resolve(wlLoad()).then(()=>pspLoadOwn()).then(()=>{try{gyAlias()}catch(e){}pspPics();PSP.ready=true;PSP._wait=0;then()}).catch(e=>{console.error('psp load',e);PSP._wait=0;PSP.ready=true;try{pspPics()}catch(x){}then()});return true}
const pspNeedArt=()=>!PSP.ready;
{const _g=goToLevel;goToLevel=function(n,entry){
  if(pspIs(n)&&pspNeedArt()&&pspLoad(()=>goToLevel(n,entry)))return;
  if(pspIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('psp build',n,e)}
  const r=_g.call(this,n,entry);
  try{if(pspIs(n))pspArrive(n)}catch(e){console.error('pspArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(pspIs(n)&&pspNeedArt()&&pspLoad(()=>jumpToLevel(n,target)))return;
  if(pspIs(n)){const r=pspRatingOf(n);target=Math.min(115,Math.max(target||0,r))}
  return _j.call(this,n,target)}}
{const _r=restore;restore=function(sv){
  if(sv&&pspIs(sv.level)&&pspNeedArt()&&pspLoad(()=>restore(sv)))return;
  if(sv&&pspIs(sv.level)&&!LEVELS[sv.level]&&KH_LAZY[sv.level])try{KH_LAZY[sv.level]()}catch(e){console.error('psp restore',e)}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(pspIs(LEVEL))pspArrive(LEVEL,true)}catch(e){console.error('psp restoreNow',e)}return r}}
if(typeof wdDoorLevel==='function'){const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||pspIs(n)}}
/* every arrival: the first visit to a place says where the party is; the last place reached is kept; a hook for the builders */
PSP.onArrive=[];
function pspOnArrive(fn){PSP.onArrive.push(fn)}
function pspArrive(n,restored){
  const F=pspF(),l=pspLevel(n);if(l&&!restored&&!F['seen'+n]){F['seen'+n]=1;}
  F.last=n;for(const fn of PSP.onArrive)try{fn(n,restored)}catch(e){console.error('psp onArrive',e)}}
/* ---------- the doors: the key lock, the sealed far side ---------- */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psp){
    const l=d.psp;
    if(d.lock&&!bagCount(d.lock)){sfx('locked');msg('An iron-bound door with a silver lock. It will not move. The key must be somewhere on this floor.','#c8c4e0');try{if(typeof pspKeyBump==='function')pspKeyBump(l)}catch(e){console.error(e)}return true}
    if(l.prov&&!pspLevel(l.to).built){sfx('locked');msg(l.lock?'The silver lock turns, but the stair beyond is blocked by fallen stone. This part of the Pale Spire is not open yet.':(pspDoorSealMsg(l)),'#c8c4e0');return true}
    if(d.lock){msg('The Second Floor Key turns in the silver lock.','#d8d4f0')}
    sfx('door');G.talk=null;goToLevel(l.to,{x:l.land[0],y:l.land[1],f:l.land[2]});return true}
  return _k.apply(this,arguments)}}
function pspDoorSealMsg(l){
  if(l.to===9710)return 'The way back to Sale is far behind you.';
  if(l.to===9850)return 'The wall walk is closed. A grille of black iron bars the stair.';
  return 'This part of the Pale Spire is not open yet.'}
/* ---------- the quest rings, the Go to area rows, the jump links ---------- */
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(!out.some(r=>r.n===PSP.ENTRY.id)){out.push({h:'The Pale Lands: the Pale Spire'});for(const l of PSP.LEVELS)if(l.built)out.push({n:l.id,name:l.name})}}catch(e){console.error(e)}
  return out}}
function pspAreas(AREAS){
  for(const k in PSP.JUMPS){const j=PSP.JUMPS[k];Object.defineProperty(AREAS,k,{enumerable:true,configurable:true,get(){return j.slice()}})}}
/* the story hint after Sale: the Pale Spire is next (only once Sale's road is open and the Spire exists) */
if(typeof storyNext==='function'){const _sn=storyNext;storyNext=function(){try{const F=G.flags;if(F.psp&&F.psp.last&&PSP.LEVELS[1].built)return 'You are in the Pale Spire, the castle of the Pale Sovereign. A tall silver key opens the way up. Ask the porter, the librarian and the prisoners where it is.'}catch(e){}return _sn.apply(this,arguments)}}
/* ---------- items nobody defined get a plain definition, so that every id of PSP_ITEMS exists ---------- */
function pspItemsFill(){for(const id in PSP_ITEMS){if(ITEMDEF[id])continue;const q=PSP_ITEMS[id];ITEMDEF[id]={n:q.n,k:q.k||'quest',t:q.t||'Quest item',ic:q.ic||'ore',c:q.c||'#d0d0e0',stack:q.stack||1,price:0,sw:.2,d:q.d,psfill:1}}}
pspItemsFill();
