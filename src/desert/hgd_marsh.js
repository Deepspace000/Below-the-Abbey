/* ==========================================================================
   THE MARSHES OF THE MAZE (prefix hgdmr / HGDMR). Eight stretches of the maze, away from the towns and the danger zones, lie under shallow water (the same walkable water as the ponds in the clearings, so they
   show light blue on the maps), thick with reeds, lilies and tall grass that the party walks straight through. Walking in the shallows splashes: while the party stands in shallow water its footsteps are
   splashes instead of scuffs.
   ========================================================================== */
const HGDMR_NAMES=['The Marsh Maze','The Reed Flats','Lily Shallows','The Wading Rows','Heron Marsh','The Sedge Fens','Mudwater Court','The Rush Beds'];
const HGDMR_PLANTS=['hgt_reeds','hgt_reeds','hgt_reeds','art_hgdf_plant0','art_hgdf_plant0','art_hgdf_plant1','hgt_vine_roundleaf','art_hgdf_plant5'];
function hgdmrBuild(L){
  if(L._hgdmr)return;const M=L._hgdm,W=M.W,H=M.H,P=L._hgdp,rows=L.rows,kind=M.kind,rnd=hgdmRng(475060),open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Set(L.decor.filter(d=>d.block||d.npc||d.loot).concat(L.items,L.enemies).map(d=>d.x+','+d.y));
  const reach=new Set([L.start.x+','+L.start.y]),q=[[L.start.x,L.start.y]];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(reach.has(k)||!open(nx,ny))continue;reach.add(k);q.push([nx,ny])}}
  const zones=P.zones,bad=(x,y,pad)=>zones.some(z=>Math.hypot(z.x-x,z.y-y)<=z.r+pad);
  if(!L.fmap)return;const fm=L.fmap.map(r=>r.split?r.split(''):r.slice());
  const cx0=[],centers=[],cells=[...reach];let t=0;
  while(centers.length<8&&t++<8000){const c=cells[(rnd()*cells.length)|0].split(',').map(Number);if(bad(c[0],c[1],9)||Math.hypot(c[0]-L.start.x,c[1]-L.start.y)<30||centers.some(o=>Math.hypot(o[0]-c[0],o[1]-c[1])<42))continue;centers.push([c[0],c[1],centers.length?7+((rnd()*4)|0):13])}
  let nw=0,np=0;const wet=new Map();
  centers.forEach(([cx,cy,r],mi)=>{
    for(let y=cy-r-1;y<=cy+r+1;y++)for(let x=cx-r-1;x<=cx+r+1;x++){if(!open(x,y)||!reach.has(x+','+y))continue;
      const d=Math.hypot(x-cx,y-cy)+(rnd()-.5)*3.2; // a ragged edge
      if(d>r||bad(x,y,2)||fm[y][x]==='6')continue;
      fm[y][x]='5';wet.set(x+','+y,mi);nw++;
      if(!occ.has(x+','+y)&&rnd()<.55){occ.add(x+','+y);L.decor.push({k:HGDMR_PLANTS[(rnd()*HGDMR_PLANTS.length)|0],x,y,block:false,walk:true,deco:true,sc:.5+rnd()*.28});np++}}});
  // marsh vermin (see hgd_marshfoes.js): locusts, mosquitoes, horseflies, dragonflies, hornets, crickets, bog toads and mire beetles, more in the big marsh
  let ne=0;if(typeof HGMR!=='undefined'&&HGMR.enemies){const free=centers.map(()=>[]);for(const [k,mi] of wet)if(!occ.has(k)||true){const [x,y]=k.split(',').map(Number);if(!L.decor.some(d=>d.block&&d.x===x&&d.y===y)&&!L.enemies.some(e=>e.x===x&&e.y===y))free[mi].push([x,y])}
    centers.forEach((c,mi)=>{const want=mi?5:11,f=free[mi];for(let k=0;k<want&&f.length;k++){const p2=f.splice((rnd()*f.length)|0,1)[0];L.enemies.push({t:HGMR.enemies[(rnd()*HGMR.enemies.length)|0],x:p2[0],y:p2[1]});ne++}})}
  L.fmap=fm.map(r=>r.join?r.join(''):r);L._hgdmr={centers,wet:nw,plants:np,foes:ne,cells:wet,names:HGDMR_NAMES}}
// splashes: shallow water under the party's feet
const hgdmrWet=()=>{const L=LEVELS[HGD.ID];return LEVEL===HGD.ID&&L&&L.fmap&&G.P&&L.fmap[G.P.y]&&L.fmap[G.P.y][G.P.x]==='5'};
{const _s=sfx;sfx=function(n){
  if(n==='step'&&AC&&!G.mute&&SNDOPT.steps&&G.state==='play'&&hgdmrWet()){
    G.bumpT=0;SFXM=SNDOPT.steps;const v=.85+Math.random()*.3,p=(G.stepAlt=!G.stepAlt)?1:.88;
    // soft and hissy: broad white noise, no thump and no pitched blips
    const sw=SNDOPT.steps;nz(.26+Math.random()*.1,.11*v*sw,'lowpass',4200*v,1500,0);nz(.2+Math.random()*.08,.08*v*sw,'highpass',2200*v,4200,.015);nz(.14,.05*v*sw,'bandpass',1500*v*p,900,.07);
    return}
  return _s.apply(this,arguments)}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Some stretches of the maze lie under a hand of warm water, thick with reeds. You can wade through them. Your boots will be wet, and everyone will know you are coming.');
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdf2)try{hgdmrBuild(L)}catch(e){console.error('hgdmr',e)}}}

{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID&&G.state==='play'){const L=LEVELS[HGD.ID],M=L&&L._hgdmr;if(M){const mi=M.cells.get(G.P.x+','+G.P.y);if(mi!==undefined){const F=G.flags,k='hgdmrSeen'+mi;if(!F[k]){F[k]=1;msg('You wade into '+M.names[mi]+'. The water is warm and shallow, the reeds close round you, and every step splashes.','#a8e0c8')}}}}}catch(e){}return _u.apply(this,arguments)}}
// the marshes have names on the maze map
{const _n=hgdmpNames;hgdmpNames=function(vi){const out=_n.apply(this,arguments);try{const L=LEVELS[HGD.ID],M=L&&L._hgdmr;if(M&&vi<5){const V=HGDMP.views[vi],[,,vx,vy,vw,vh]=V;M.centers.forEach((c,i)=>{if(c[0]>=vx-2&&c[0]<=vx+vw+2&&c[1]>=vy-2&&c[1]<=vy+vh+2)out.push({t:M.names[i],x:c[0]+.5,y:c[1]+.5,dy:0,k:'marsh'})})}}catch(e){}return out}}
