/* ==========================================================================
   FOOTPLATE TRAPS IN THE MAZE (prefix hgdr / HGDR). A few hidden plates in the passages (not in the towns): stepping on one springs spikes, darts, poison gas or a rockfall on the party.
   A Thief, Assassin or Ranger in the party spots a plate up to three squares ahead and says so, once. Once warned, tapping the floor ahead or pressing Attack with nothing to hit
   presses the plate with a weapon from a distance: it springs harmlessly and is safe for good. Springing a plate once spends it for good.
   ========================================================================== */
const HGDR_T=[['spikes','Spikes shoot up out of the floor!'],['darts','A row of darts hisses out of the wall!'],['gas','A plate clicks, and green gas hisses up round the party!'],['rock','A slab drops from the roof!']];
function hgdrBuild(L){
  if(L._hgdr)return;const M=L._hgdm,W=M.W,P=L._hgdp,rows=L.rows,kind=M.kind,open=(x,y)=>rows[y]&&rows[y][x]==='.',rnd=hgdmRng(475031);
  const occ=new Set(L.decor.concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const safe=P.zones.filter(z=>z.type==='safe'),inSafe=(x,y)=>safe.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+3);
  const deg=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
  const out=[];let tries=0;
  while(out.length<40&&tries++<8000){const x=4+((rnd()*(W-8))|0),y=4+((rnd()*(W-8))|0);
    if(!open(x,y)||kind[y*W+x]||!reach.has(x+','+y)||occ.has(x+','+y)||inSafe(x,y)||deg(x,y)!==2)continue;
    if(Math.hypot(x-M.sx,y-M.sy)<22||out.some(o=>Math.hypot(o.x-x,o.y-y)<12))continue;
    out.push({x,y,t:HGDR_T[(rnd()*4)|0][0]});occ.add(x+','+y)}
  L._hgdr={traps:out}}
const hgdrAt=(x,y)=>{const L=LEVELS[HGD.ID];return L&&L._hgdr&&LEVEL===HGD.ID?L._hgdr.traps.find(t=>t.x===x&&t.y===y):null};
const hgdrKey=(x,y)=>x+','+y;
function hgdrSpring(t,harmless){
  const F=G.flags;F.hgdrDone=F.hgdrDone||{};F.hgdrDone[hgdrKey(t.x,t.y)]=1;
  if(harmless){msg('You press the plate with the butt of a weapon. '+(t.t==='spikes'?'Spikes shoot up, harmlessly, and sink away again.':t.t==='darts'?'Darts fly across the empty passage.':t.t==='gas'?'Green gas hisses out and drifts away from the party.':'A slab drops across the passage ahead, and is pushed aside.')+' The plate is safe now.','#ffe9a0');sfx('click');return}
  const live=G.heroes.map((h,i)=>i).filter(i=>G.heroes[i].alive&&G.heroes[i].hp>0);
  const hurt=(i,f)=>{const h=G.heroes[i],d=Math.max(3,Math.round(h.max*f));h.hp=Math.max(1,h.hp-d);h.hurt=.4;try{addFloat(portraitX(i)+19,250,'-'+d,'#ff7060')}catch(e){}};
  G.shake=.7;sfx('hurt');
  if(t.t==='spikes'){msg(HGDR_T[0][1],'#ff9a7a');for(const i of live)hurt(i,i<2?.16:.07);try{afflInflict('bleeding',live[(Math.random()*live.length)|0])}catch(e){}}
  else if(t.t==='darts'){msg(HGDR_T[1][1],'#ff9a7a');for(const i of live)if(Math.random()<.6){hurt(i,.06);try{afflInflict('poisoned',i)}catch(e){}}}
  else if(t.t==='gas'){msg(HGDR_T[2][1],'#b8e878');for(const i of live)hurt(i,.04);try{afflInflict('poisoned',-1,true);afflInflict('shaken',-1,true)}catch(e){}}
  else{msg(HGDR_T[3][1],'#ff9a7a');for(const i of live)hurt(i,i<2?.2:.1)}}
// stepping on a plate, and the warning
{const _u=update;let nextT=0;update=function(dt){
  try{if(LEVEL===HGD.ID&&G.state==='play'&&G.P){const L=LEVELS[HGD.ID];if(L&&L._hgdr){const F=G.flags;F.hgdrDone=F.hgdrDone||{};F.hgdrWarn=F.hgdrWarn||{};
    const t=hgdrAt(G.P.x,G.P.y);if(t&&!F.hgdrDone[hgdrKey(t.x,t.y)]&&!G.cut&&!G.talk)hgdrSpring(t,false);
    if(G.time>=nextT&&!G.cut&&!G.talk&&!G.menu){nextT=G.time+.35;const f=DIRS[G.P.f];
      for(let i=1;i<=3;i++){const x=G.P.x+f[0]*i,y=G.P.y+f[1]*i;if(!L.rows[y]||L.rows[y][x]!=='.')break;const tt=hgdrAt(x,y);if(!tt)continue;const k=hgdrKey(x,y);if(F.hgdrDone[k]||F.hgdrWarn[k])continue;
        const hi=G.heroes.findIndex((h,j)=>h.alive&&h.hp>0&&['Thief','Assassin','Ranger'].includes(HERO_DEF[j].cls));if(hi>=0){F.hgdrWarn[k]=1;msg(HERO_DEF[hi].name+': "Wait. There is a trap plate in the floor ahead. Tap it, or press Attack, and I will set it off from here."','#ffe08a');try{sfx('warn')}catch(e){}}break}}}}}catch(e){}
  return _u.apply(this,arguments)}}
// pressing a warned plate from a distance of one: Attack with nothing to hit, or a tap on the floor ahead
function hgdrPress(how){
  if(LEVEL!==HGD.ID||G.state!=='play'||G.cut||G.talk||G.menu)return false;const L=LEVELS[HGD.ID];if(!L||!L._hgdr)return false;
  const f=DIRS[G.P.f],F=G.flags;F.hgdrDone=F.hgdrDone||{};let t=null,x=0,y=0;for(let i=1;i<=3;i++){x=G.P.x+f[0]*i;y=G.P.y+f[1]*i;if(!L.rows[y]||L.rows[y][x]!=='.')break;const c=hgdrAt(x,y);if(c){t=c;break}}
  if(!t||F.hgdrDone[hgdrKey(x,y)]||!(F.hgdrWarn&&F.hgdrWarn[hgdrKey(x,y)]))return false;
  if(how==='key'&&typeof frontEnemy==='function'&&frontEnemy(1))return false;hgdrSpring(t,true);return true}
{const _act=act;act=function(id){try{if(id==='attack'&&hgdrPress('key'))return}catch(e){}return _act.apply(this,arguments)}}
{const _vt=viewTap;viewTap=function(x,y){try{if(x>=100&&x<=320&&y>=120&&!G.hits.some(h=>h.type!=='torch'&&x>=h.x0&&x<=h.x1&&y>=h.y0&&y<=h.y1)&&hgdrPress('tap'))return}catch(e){}return _vt.apply(this,arguments)}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('There are plates in the floor of some passages. Step on one and the maze bites. A thief, a ranger or an assassin will usually spot them before you do.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdw)try{hgdrBuild(L)}catch(e){console.error('hgdr',e)}}}
