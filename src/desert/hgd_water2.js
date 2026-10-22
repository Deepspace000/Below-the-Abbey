/* ==========================================================================
   THE DROWNED MAZE, SECOND PASS (prefix hgdw2 / HGDW2). Finishes the freshwater look of level 477 and mends two faults:
   1. No chest may block the way. Every shell chest stands on a square whose loss cannot cut the maze in two (a dead end or a chamber), checked by flood fill from the first stairs, and any that blocks is moved. (Before this,
      a chest stood in the one-wide passage out of the first stairs and nobody could get past it.)
   2. A thick green murk: the water is cloudy, yellow-green and you cannot see far.
   3. Moss everywhere (cushions and carpets on the floor, mossy boulders, long hanging green algae), and many more underwater reeds and grasses, all from the painted pictures assets/ds_hgwm_*.png.
   4. About three times as many freshwater creatures: every one of the ten kinds appears all through the maze, the great catfish still alone in the far chamber.
   ========================================================================== */
const HGDW2={AIR:null};
// the murk
if(typeof HGTE!=='undefined'&&HGTE.wetLook)HGTE.wetLook(HGDW.ID,{hazeCol:[58,100,34],roofHaze:[34,60,22],haze:.93,hazeRate:.085,tint:[.8,1.06,.66],grade:[176,222,110,.4],wet:[48,104,34,.46],ambient:.5,vignette:.62,motes:30});
{const _sl=setLightLevel;setLightLevel=function(l){_sl.apply(this,arguments);if(LEVEL===HGDW.ID){RANGE=Math.min(RANGE,4.6+.9*l)}}} // the green water hides what is more than a few squares away
{const _u=update;update=function(dt){if(update._hw!==(LEVEL===HGDW.ID)){update._hw=LEVEL===HGDW.ID;try{setLightLevel(G.lightLevel)}catch(e){}}return _u.apply(this,arguments)}}
/* ---------- helpers ---------- */
const hgdw2Open=(L,x,y)=>L.rows[y]&&L.rows[y][x]==='.';
function hgdw2Flood(L,from,blocked){const seen=new Set([from[0]+','+from[1]]),q=[from];for(let i=0;i<q.length;i++){const [x,y]=q[i];for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+a,ny=y+b,k=nx+','+ny;if(seen.has(k)||!hgdw2Open(L,nx,ny)||blocked.has(k))continue;seen.add(k);q.push([nx,ny])}}return seen}
/* a square is a safe place for something solid when, with it (and the other solid things) in place, every other free square can still be reached */
function hgdw2Safe(L,cell,blocked,from,freeCount){const b=new Set(blocked);b.add(cell[0]+','+cell[1]);return hgdw2Flood(L,from,b).size>=freeCount-1-(blocked.size?0:0)}
function hgdw2Fix(L){
  const st=L._hgdw.stairs[0];if(!st)return;const from=[st.ax,st.ay];
  const solid=new Set(L.decor.filter(d=>d.block&&!/shellchest/.test(d.k)).map(d=>d.x+','+d.y));
  let free=0;for(let y=0;y<L.rows.length;y++)for(let x=0;x<L.rows[0].length;x++)if(hgdw2Open(L,x,y)&&!solid.has(x+','+y))free++;
  const chests=L.decor.filter(d=>/shellchest/.test(d.k)),taken=new Set(L.decor.concat(L.enemies).map(d=>d.x+','+d.y)),done=new Set(solid);
  // the chests are put back one at a time: each must leave every other free square reachable
  const cand=[];for(let y=2;y<L.rows.length-2;y++)for(let x=2;x<L.rows[0].length-2;x++){if(!hgdw2Open(L,x,y)||solid.has(x+','+y))continue;const deg=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>hgdw2Open(L,x+d[0],y+d[1])).length;cand.push([x,y,deg])}
  const rnd=hgdmRng(477311);
  for(const c of chests){
    const ok=(x,y)=>{const k=x+','+y;if(done.has(k))return false;const b=new Set(done);b.add(k);return hgdw2Flood(L,from,b).size>=free-done.size+solid.size-1};
    // keep the place if it is safe, else the nearest safe dead end or chamber square
    const here=ok(c.x,c.y);
    if(!here){const spots=cand.filter(q=>!taken.has(q[0]+','+q[1])&&q[2]<=1||false);let best=null,bd=1e9;
      for(const q of cand.filter(q=>!taken.has(q[0]+','+q[1])&&!done.has(q[0]+','+q[1]))){const d=Math.hypot(q[0]-c.x,q[1]-c.y)+(q[2]<=1?0:6)+rnd()*3;if(d<bd&&ok(q[0],q[1])){bd=d;best=q}}
      if(best){c.x=best[0];c.y=best[1];taken.add(best[0]+','+best[1])}}
    done.add(c.x+','+c.y)}
  L._hgdw2={chestsChecked:chests.length}}
/* ---------- the rest of the finish ---------- */
const HGDW2_GRASS=['art_hgwm_grass0','art_hgwm_grass1','art_hgwm_grass2','art_hgwm_reed0'],HGDW2_MOSS=['art_hgwm_moss0','art_hgwm_moss1'],HGDW2_ROCK=['art_hgwm_rock0','art_hgwm_rock1'],HGDW2_ALGAE=['art_hgwm_algae0','art_hgwm_algae1'];
function hgdw2Finish(L){
  if(L._hgdw2done)return;L._hgdw2done=1;
  const rnd=hgdmRng(477512),S=L.rows.length,have=k=>IMG[k]&&IMG[k].width,pick=a=>a.filter(have);
  const gr=pick(HGDW2_GRASS),mo=pick(HGDW2_MOSS),rk=pick(HGDW2_ROCK),al=pick(HGDW2_ALGAE);
  const heights={art_hgwm_grass0:1.15,art_hgwm_grass1:.8,art_hgwm_grass2:1.05,art_hgwm_reed0:1.5,art_hgwm_moss0:.5,art_hgwm_moss1:.42,art_hgwm_rock0:.85,art_hgwm_rock1:1.05,art_hgwm_algae0:1.35,art_hgwm_algae1:1.25};
  for(const k in heights)NPC_H[k]=heights[k];
  const free=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(hgdw2Open(L,x,y))free.push([x,y]);
  const occ=new Set(L.decor.filter(d=>d.block||d.hgdtele).map(d=>d.x+','+d.y).concat(L._hgdw.stairs.map(s=>s.ax+','+s.ay)));
  const add=(k,x,y,o)=>L.decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true},o||{}));
  const nearWall=(x,y)=>!hgdw2Open(L,x+1,y)||!hgdw2Open(L,x-1,y)||!hgdw2Open(L,x,y+1)||!hgdw2Open(L,x,y-1);
  for(const [x,y] of free){if(occ.has(x+','+y))continue;
    if(gr.length&&rnd()<.55)add(gr[(rnd()*gr.length)|0],x,y,{sc:.7+rnd()*.55});          // grass and reeds on over half the squares
    if(mo.length&&rnd()<.5)add(mo[(rnd()*mo.length)|0],x,y,{sc:.8+rnd()*.6});             // moss on half of them
    if(rk.length&&nearWall(x,y)&&rnd()<.16)add(rk[(rnd()*rk.length)|0],x,y,{sc:.8+rnd()*.4}); // mossy boulders against the walls (walk through: never in the way)
    if(al.length&&rnd()<.22)add(al[(rnd()*al.length)|0],x,y,{sc:.8+rnd()*.5,bob:.7+rnd()*.35})} // hanging green algae
  // creatures: three times as many, all ten kinds spread through the maze (not near the stairs); the great catfish stays alone in the far chamber
  const kinds=HGFW.enemies.filter(e=>e!=='hgfcatfish'),stairs=L._hgdw.stairs,tk=new Set(L.enemies.map(e=>e.x+','+e.y));
  const cells=free.filter(c=>!occ.has(c[0]+','+c[1])&&!tk.has(c[0]+','+c[1])&&!stairs.some(s=>Math.hypot(s.ax-c[0],s.ay-c[1])<9)).sort(()=>rnd()-.5);
  const placed=[];let n=0;for(const c of cells){if(n>=62)break;if(placed.some(p=>Math.abs(p[0]-c[0])+Math.abs(p[1]-c[1])<5))continue;placed.push(c);L.enemies.push({t:kinds[n%kinds.length],x:c[0],y:c[1]});n++}
  L._hgdw2.enemies=n;L._hgdw2.decor=L.decor.length}
{const _b=hgdwBuild;hgdwBuild=function(){const had=!!LEVELS[HGDW.ID];_b.apply(this,arguments);const L=LEVELS[HGDW.ID];if(!had&&L&&L._hgdw)try{hgdw2Fix(L);hgdw2Finish(L)}catch(e){console.error('hgdw2',e)}}}
