/* ==========================================================================
   THE BLIGHTED ROAD: THE FRAMEWORK (prefix bl / BL). The road west from the open gate of Wenlock to the town of Sale, in ten linked places of rising level (84 up to 90), each its own map.
   Every builder of a place relies on this file and on blight_kit.js (the look, the sounds, the creatures, the level builder). See tools/BLIGHT_NOTES.md.
   BL_ROAD is the one table of the ten places: id, name, rating, links, whether the place is built, and where the party lands in it.
     n  id    name                                           rating  built by
     1  9610  The Toll House of the Road Wardens             84      blight_toll.js
     2  9620  Ashenfold Farm                                  85      blight_ashenfold.js
     3  9630  The Church of the Hollow Saint                  86
     4  9640  Gallowmere                                      86
     5  9650  The Bone Orchard                                87
     6  9660  Lanternrest Waystation                          87
     7  9670  The Vault of Maldrake (9671 and up are its floors) 88 to 89
     8  9680  Hollowbell Abbey                                88
     9  9690  The Rookery Mill                                89
    10  9700  The Pale Bridge and the Gate of Sale            90
   A place owns the ids id to id+9 (9611 to 9619 for the Toll House: interiors, cellars, crypt floors). Sale has its own range, chosen by its builder (set BL_SALE).
   HOW A BUILDER ADDS A PLACE:  blRegister(n, builderFn, {fromE:{x,y,f}, fromW:{x,y,f}, rooms:[ids], names:{id:'name'}, rating:{id:n}}).
     builderFn builds LEVELS[id] (use blRoadLevel in blight_kit.js, or any other way) and returns it. fromE is where the party lands when it comes in from the EAST neighbour (the Wenlock side),
     fromW where it lands when it comes in from the WEST neighbour. blExit(kit,'E'|'W',y) in blight_kit.js puts the gates that use the table. Until a place is registered its id has a stub:
     a short empty stretch of road with a milestone, linked both ways, so that the road can be walked end to end.
   Flags (saved with the game): G.flags.bl = {...}. Jump links: ?town=blight1 ... ?town=blight10 (the east end of that place), lvl defaults to the place's rating.
   ========================================================================== */
const BL={REGION:'The Blighted Lands',builders:{},stubs:{}};
const BL_ROAD=[
  {n:1,id:9610,name:'The Toll House of the Road Wardens',lvl:84,W:72,H:64},
  {n:2,id:9620,name:'Ashenfold Farm',lvl:85,W:80,H:70},
  {n:3,id:9630,name:'The Church of the Hollow Saint',lvl:86,W:72,H:64},
  {n:4,id:9640,name:'Gallowmere',lvl:86,W:72,H:64},
  {n:5,id:9650,name:'The Bone Orchard',lvl:87,W:72,H:64},
  {n:6,id:9660,name:'Lanternrest Waystation',lvl:87,W:72,H:64},
  {n:7,id:9670,name:'The Vault of Maldrake',lvl:88,W:72,H:64},
  {n:8,id:9680,name:'Hollowbell Abbey',lvl:88,W:72,H:64},
  {n:9,id:9690,name:'The Rookery Mill',lvl:89,W:72,H:64},
  {n:10,id:9700,name:'The Pale Bridge and the Gate of Sale',lvl:90,W:72,H:64}];
/* the town at the far end: its builder sets BL_SALE.id (and where the party lands there) */
const BL_SALE={id:null,at:{x:3,y:3,f:1}};
/* Wenlock: where the party lands when it comes back through the west gate (the gate stands at x=2 of level 496, the street runs along y=50) */
const BL_WENLOCK={id:496,at:{x:5,y:50,f:1}};
for(const p of BL_ROAD){
  p.built=false;p.rooms=[];p.sale=10-p.n;
  p.fromE={x:p.W-5,y:p.H>>1,f:3};p.fromW={x:4,y:p.H>>1,f:1};
  p.exitY=p.H>>1;
  LEVEL_NAMES[p.id]=p.name;LEVEL_RATING[p.id]=p.lvl}
const BL_IDS=[];for(let n=9610;n<=9709;n++)BL_IDS.push(n);
const blIs=n=>n>=9610&&n<=9709;
const blPlaceOf=n=>BL_ROAD.find(p=>n>=p.id&&n<=p.id+9)||null;
const blPlaceN=n=>{const p=blPlaceOf(n);return p?p.n:0};
const blF=()=>{const F=G.flags;if(!F.bl)F.bl={};return F.bl};
/* where the east exit of place n leads, and where the west exit leads: {lvl, at} (read when the door is used, so a builder may change the table later) */
function blEastDest(p){
  if(p.n===1)return {lvl:BL_WENLOCK.id,at:BL_WENLOCK.at};
  const q=BL_ROAD[p.n-2];return {lvl:q.id,at:q.fromW}}
function blWestDest(p){
  if(p.n===10)return BL_SALE.id?{lvl:BL_SALE.id,at:BL_SALE.at}:null;
  const q=BL_ROAD[p.n];return {lvl:q.id,at:q.fromE}}
/* a builder registers its place: the level builder, where the party lands, the extra ids it owns */
function blRegister(n,fn,o){
  const p=BL_ROAD[n-1];if(!p)throw new Error('blRegister: no place '+n);o=o||{};
  BL.builders[p.id]=fn;p.built=true;
  if(o.fromE)p.fromE=o.fromE;if(o.fromW)p.fromW=o.fromW;if(o.exitY!==undefined)p.exitY=o.exitY;
  for(const id of o.rooms||[]){if(!p.rooms.includes(id))p.rooms.push(id)}
  for(const id in (o.names||{})){LEVEL_NAMES[id]=o.names[id]}
  for(const id in (o.rating||{})){LEVEL_RATING[id]=o.rating[id]}
  if(o.lvl){p.lvl=o.lvl;LEVEL_RATING[p.id]=o.lvl}
  KH_LAZY[p.id]=()=>blBuildMain(p)}
function blBuildMain(p){
  if(LEVELS[p.id])return LEVELS[p.id];
  const f=BL.builders[p.id];
  return f?f(p):blStubBuild(p)}
/* every id of the road has a lazy builder, so that a save made in any of them loads (a place that is not built yet gets its stub) */
for(const p of BL_ROAD){
  KH_LAZY[p.id]=()=>blBuildMain(p);
  for(let k=1;k<=9;k++){const id=p.id+k;if(!KH_LAZY[id])KH_LAZY[id]=()=>{if(!LEVELS[id]&&typeof blRoomStub==='function')blRoomStub(id,p);return LEVELS[id]}}}
/* ---------- arrival: the pictures are loaded first (Wenlock's loader also brings the graveyard and the witch wood), then the level ---------- */
const blNeedArt=()=>!(typeof WLART!=='undefined'&&WLART.ready&&(typeof KH_READY==='undefined'||KH_READY)&&(typeof GY==='undefined'||GY.ready)&&(typeof WW==='undefined'||WW.ready));
function blWait(then){if(BL._wait)return true;BL._wait=1;try{msg('The Blighted Lands come into view...','#b8d0a8')}catch(e){}wlLoad().then(()=>{BL._wait=0;then()}).catch(e=>{BL._wait=0;console.error('bl load',e)});return true}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(blIs(n)&&blNeedArt()&&blWait(()=>goToLevel(n,entry)))return;
  if(blIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error('bl build',n,e)}
  const r=_g.call(this,n,entry);
  try{if(blIs(n)&&typeof blArrive==='function')blArrive(n)}catch(e){console.error('blArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(blIs(n)&&blNeedArt()&&blWait(()=>jumpToLevel(n,target)))return;
  if(blIs(n)){const p=blPlaceOf(n);if(p&&target<p.lvl)target=p.lvl}
  return _j.call(this,n,target)}}
{const _r=restore;restore=function(sv){
  if(sv&&blIs(sv.level)&&blNeedArt()&&blWait(()=>restore(sv)))return;
  if(sv&&blIs(sv.level)&&!LEVELS[sv.level]&&KH_LAZY[sv.level])try{KH_LAZY[sv.level]()}catch(e){console.error('bl restore',e)}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{if(blIs(LEVEL)&&typeof blArrive==='function')blArrive(LEVEL)}catch(e){console.error('bl restoreNow',e)}return r}}
if(typeof wdDoorLevel==='function'){const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||blIs(n)}}
/* ---------- the open west gate of Wenlock leads to the Toll House (once it is built) ---------- */
{const _up=usePortal;usePortal=function(i){const p=G.portals&&G.portals[i];
  if(LEVEL===BL_WENLOCK.id&&p&&p.wsWest&&G.flags.wsGate&&BL_ROAD[0].built){
    sfx('door');G.talk=null;const q=BL_ROAD[0];
    goToLevel(q.id,q.fromE);
    try{msg('You walk out through the open west gate, and the hedges on either side of the road are dead.','#b8d0a8')}catch(e){}
    return}
  return _up.apply(this,arguments)}}
/* the story says where the road goes once it is built */
function blTextFix(){
  const hint='The west gate of Wenlock is open. Take the road west through the Blighted Lands, place by place, to the town of Sale. Ten milestones count the stages down.';
  if(typeof QNOTE!=='undefined'&&QNOTE.wk8!==undefined)QNOTE.wk8='The west gate of Wenlock stands open. The road west runs through the Blighted Lands to the town of Sale.';
  if(typeof STORY!=='undefined'){const s=STORY.find(e=>e&&e.id==='wsgate');if(s&&s.x)s.x=s.x.replace('The road west lies beyond the gate. The next part of the story is not written yet.','The road west lies beyond the gate, and it leads through the Blighted Lands to the town of Sale.')}
  if(typeof storyNext==='function'){const _sn=storyNext;storyNext=function(){const F=G.flags;
    if(F.wsGate&&BL_ROAD[0].built){
      const bf=F.bl||{};
      if(bf.last&&bf.last>1)return 'Follow the Blighted Road west. You have reached '+(BL_ROAD[Math.min(9,bf.last-1)].name)+'. Sale is '+BL_ROAD[Math.min(9,bf.last-1)].sale+' stages on.';
      return hint}
    return _sn.apply(this,arguments)}}}
blTextFix();
/* ---------- the quest region, the Go to area list, the test links ---------- */
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes(BL.REGION))QAREA_ORDER.push(BL.REGION);
if(typeof QWORLD!=='undefined')QWORLD[BL.REGION]='wenlock';
{const _gl=gotoListRaw;gotoListRaw=function(){const out=_gl.apply(this,arguments);
  try{if(!out.some(r=>r.n===9610)){out.push({h:'The Blighted Lands, west of Wenlock'});for(const p of BL_ROAD)if(p.built){out.push({n:p.id,name:p.name});for(const id of p.rooms)out.push({n:id,name:LEVEL_NAMES[id]||('Room '+id)})}}}catch(e){console.error(e)}
  return out}}
/* ?town=blight1 to ?town=blight10: the party at the east end of that place (called from jumpFromUrl in index.html) */
function blAreas(AREAS){
  for(const p of BL_ROAD)Object.defineProperty(AREAS,'blight'+p.n,{enumerable:true,configurable:true,get(){return [p.id,p.fromE.x,p.fromE.y,p.fromE.f]}});
  Object.defineProperty(AREAS,'blight',{enumerable:true,configurable:true,get(){const p=BL_ROAD[0];return [p.id,p.fromE.x,p.fromE.y,p.fromE.f]}})}
