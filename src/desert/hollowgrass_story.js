/* ==========================================================================
   THE WAY TO THE HOLLOW GRASSLANDS. When the Hollow Child-King, the last ruler (floor 19 of the Orange Spire), is destroyed, the spell in the walls closes
   round the party. The Child-King's dust rises, laughs and is gone, and the Orange Spire is sealed: no stair goes down, and its gate cannot be opened from the
   Hollow Land. The party is thrown up to the top of the spire, where a portal hangs in the room of the wizard. It is the only way out, and it leads to the
   Hollow Grasslands. From there the spiked gate in the south leads back out onto the high ledge of the Hollow Land.
   ========================================================================== */
const HGS={sealed:()=>!!(G.flags&&G.flags.hlSealed)};
khNpc('hl_banish','The Hollow Child-King','hl_boss3',()=>{
  const n4=say('The whole spire shudders. Every stair below the party turns to solid stone, and the great gate far below closes with a sound like a bell. The Orange Spire is sealed. The spell lifts the party up the last stair, to the room at the top.',[['Go on.',()=>{hgsBanish();return null}]]);
  const n3=say('"A king cannot die in his own tower. You have only killed what I left behind. The wizard at the top, the stairs, the gate, the ledge: all of it is shut now, and I am free. Go down into the Hollow Lands, little heroes. It is the only way out."',[['Go on.',()=>n4]]);
  const n2=say('The Child-King\'s body falls to dust, and the dust rises and laughs. A ring of cold light has closed round the party, and nobody can lift a hand. The voice is the Child-King\'s, and it comes from everywhere.',[['Go on.',()=>n3]]);
  return say('The Hollow Child-King falls, and he is smiling. The walls of the hall begin to hum, and the hum rises into a note that goes through the bones.',[['Go on.',()=>n2]])});
function hgsBanish(){
  const F=G.flags;F.hlSealed=1;try{giveXP(60000)}catch(e){}
  msg('The Orange Spire is sealed.','#e8a8ff');
  const top=HL.BASE+HL.N-1;
  if(!LEVELS[top]&&KH_LAZY[top])KH_LAZY[top]();
  hgsPatchTop();
  const x=HLX[HL.N-1]||{x:2,y:2};
  later(300,()=>{G.cut=null;goToLevel(top,{x:x.x,y:x.y,f:0});msg('The party stands at the top of the spire. Where the wizard stood, dark air turns slowly, and it is the only way out.','#e8a8ff')})}
/* at the top, the wizard is gone and a portal hangs in his place */
khNpc('hg_portal','A portal','tele0',()=>say('A slow wheel of dark air hangs where the wizard stood. It smells of wet grass and cold stone, and a wind comes out of it. Below the wind, very faintly, there is a sound like bees.',[['Step into the portal.',()=>{try{hgBuild()}catch(e){console.error(e)}goToLevel(HG.ID,{x:HG.START.x,y:HG.START.y,f:0});return null}],['Stay.',()=>null]]));
function hgsPatchTop(){
  const L=LEVELS[HL.BASE+HL.N-1];if(!L||L._hgp)return;L._hgp=1;
  for(const d of L.decor)if(d.npc==='hl_wizard'){d.k='tele0';d.npc='hg_portal';d.block=true;d.sc=1.4}
  if(typeof IMG!=='undefined'&&!IMG.tele0)for(const d of L.decor)if(d.npc==='hg_portal')d.k='lamp'}
/* the last ruler's death starts it */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e.hp>0&&e.t==='hlboss3'&&!(G.flags&&G.flags.hlSealed);_he.apply(this,arguments);
  if(was&&e.hp<=0){later(2200,()=>{G.talk=null;G.cut=null;startTalk({npc:'hl_banish',x:e.x,y:e.y})})}}}
/* the last ruler: floor 19 of the spire never got its ruler, so he is put in the hall farthest from the stair up */
function hgsBoss(){
  const id=HL.BASE+18;if(!LEVELS[id]&&KH_LAZY[id])KH_LAZY[id]();const L=LEVELS[id];if(!L||L._hgBoss||L.enemies.some(e=>e.t==='hlboss3'))return;L._hgBoss=1;
  const W=L.rows[0].length,H=L.rows.length,s=L._start||L.start,d=new Int16Array(W*H).fill(-1),q=[s.x+s.y*W],occ=new Set(L.decor.filter(z=>z.block).map(z=>z.x+','+z.y).concat(L.enemies.map(z=>z.x+','+z.y)));d[q[0]]=0;
  for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H||L.rows[ny][nx]!=='.'||d[ny*W+nx]>=0)continue;d[ny*W+nx]=d[c]+1;q.push(ny*W+nx)}}
  let best=null,bd=-1;for(const c of q){const x=c%W,y=(c/W)|0;if(occ.has(x+','+y))continue;if(d[c]>bd){bd=d[c];best=[x,y]}}
  if(best)L.enemies.push({t:'hlboss3',x:best[0],y:best[1]})}
/* the spire is sealed: nothing goes down, and the gate will not open from outside */
{const _g=goToLevel;goToLevel=function(n,entry){
  const F=G.flags;
  if(n===HL.BASE+18)try{hgsBoss()}catch(e){console.error(e)}
  if(F&&F.hlSealed&&!HGS.jump){
    const inSpire=LEVEL>=HL.BASE&&LEVEL<=HL.VIOLET;
    if(inSpire&&(n<LEVEL||n<HL.BASE)&&n!==HG.ID){msg('The way down is solid stone. The spell has sealed the spire.','#e8a8ff');return}
    if(LEVEL===HL.CAV&&n>=HL.BASE&&n<=HL.VIOLET){msg('The gate of the Orange Spire is sealed by a spell. There is no latch and no seam.','#e8a8ff');return}
    if(n===HL.BASE+HL.N-1)try{if(!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n]();hgsPatchTop()}catch(e){}
  }
  return _g.apply(this,arguments)}}
/* the Go to area menu is a way round the seal (it restores a save and jumps), so it is never blocked */
{const _j=jumpToLevel;jumpToLevel=function(n,target,prepped){
  // Go to area first restores the autosave. Whatever level that save is in, the city pictures are loaded first so the restore is never left half done,
  // and if the restore still fails (an old or damaged save), the jump goes ahead with a fresh party instead of doing nothing.
  if(!prepped&&((typeof KH_READY!=='undefined'&&!KH_READY)||(LEVELS[44]&&LEVELS[44].stub))){if(HGS.prep)return;HGS.prep=1;khPrepare().then(()=>{HGS.prep=0;jumpToLevel(n,target,1)}).catch(e=>{console.error(e);HGS.prep=0;jumpToLevel(n,target,1)});return}
  HGS.jump=1;
  try{return _j.call(this,n,target)}
  catch(e){console.error('Go to area: the save could not be restored, starting fresh',e);const rs=readSave;readSave=()=>null;try{return _j.call(this,n,target)}catch(e2){console.error(e2)}finally{readSave=rs}}
  finally{HGS.jump=0}}}
/* the gate between the Hollow Land and the Hollow Grasslands goes both ways: the spiked gate on the east of the Hollow Land's high ledge leads down into the Grasslands, as the Grasslands' southern gate leads back out onto the ledge */
{const _c=hlCavern;hlCavern=function(){const had=!!LEVELS[HL.CAV];_c.apply(this,arguments);const L=LEVELS[HL.CAV];
  if(L&&!had&&!L.decor.some(d=>d.hgGateBack))L.decor.push({k:'hg_gate',x:62,y:57,block:true,hgGateBack:1,enter:{to:HG.ID,x:HG.START.x,y:HG.H-5,f:0}})}}
