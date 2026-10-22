/* ==========================================================================
   A MORE NATURAL FLOOR (prefix hgdna / HGDNA). The small things lying on the floor of the Deeper Hollow maze were too many and too odd:
   - the open books (assets/ds_hgxprop3) and the melted candles (ds_hgxprop2) are taken off the floor altogether: nothing would leave them there;
   - in the passages (squares with at most two ways on) the small props are thinned out so that each stretch of passage is bare, or holds one thing, or a few (never two within four squares), and in the wider places a quarter of them go too.
   Runs last of all the maze builders, so it sees everything they placed. Deterministic (hgdmRng 475777).
   ========================================================================== */
const HGDNA={GONE:/^art_hgxprop(2|3)$/,SMALL:/^art_hgxprop\d+$/};
const hgdnaHash=(x,y,k)=>{let h=(x*374761393+y*668265263+String(k||'').length*2147483647)|0;h=(h^(h>>>13))*1274126177|0;return (h^(h>>>16))>>>0};
// the offset of a loose item lying on the floor: always to one side, never dead centre
function hgdnaOff(it){const h=hgdnaHash(it.x,it.y,it.k),sg=h&1?1:-1,mag=.16+((h>>>1)%14)/100,o=((h>>>6)%9-4)/40;return (h>>5)&1?[o,sg*mag]:[sg*mag,o]}
function hgdnaThin(L){
  if(L._hgdna)return;const rows=L.rows,rnd=hgdmRng(475777),open=(x,y)=>rows[y]&&rows[y][x]==='.',before=L.decor.length;
  const ways=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>open(x+d[0],y+d[1])).length;
  // 
  const seg={get:(k)=>{const [x,y]=k.split(',').map(Number);return (y>>3)*40+(x>>3)}},cap=[];
  for(let b=0;b<40*40;b++){const h=hgdnaHash(b,b*7+3,'blk'),r=h%10;cap.push(r<3?0:r<6?1:3+((h>>4)&1))} // each 8 by 8 stretch of passages: bare (3 in 10), one thing (3 in 10), or a few (4 in 10: three or four)
  const used=new Array(cap.length).fill(0);
  let books=0,candles=0,thinned=0;const kept=[];
  L.decor=L.decor.filter(d=>{
    if(HGDNA.GONE.test(d.k||'')){if(d.k.endsWith('3'))books++;else candles++;return false}
    if(!HGDNA.SMALL.test(d.k||'')||d.block||d.npc||d.loot||d.wd)return true; // only loose small props on the floor
    const hall=ways(d.x,d.y)<=2;
    if(hall){const sid=seg.get(d.x+','+d.y);if(sid!==undefined&&used[sid]>=cap[sid]){thinned++;return false}if(kept.some(q=>Math.abs(q.x-d.x)+Math.abs(q.y-d.y)<4)){thinned++;return false}if(sid!==undefined)used[sid]++}
    else if(rnd()<.25){thinned++;return false}
    // never in the middle of the square: pushed to one side of the passage, left or right
    {const h=hgdnaHash(d.x,d.y,d.k),sg=h&1?1:-1,mag=.18+((h>>>1)%13)/100,hx=open(d.x+1,d.y)||open(d.x-1,d.y),vy=open(d.x,d.y+1)||open(d.x,d.y-1),lateralY=hx&&!vy?true:vy&&!hx?false:!!((h>>5)&1);
     if(lateralY){d.ox=((h>>>6)%9-4)/40;d.oy=sg*mag}else{d.oy=((h>>>6)%9-4)/40;d.ox=sg*mag}}
    kept.push(d);return true});
  // anything loose that still sits dead centre is pushed aside too
  for(const d of L.decor){if(!HGDNA.SMALL.test(d.k||'')||d.block||d.npc||d.loot||d.wd)continue;if(Math.abs(d.ox||0)>=.15||Math.abs(d.oy||0)>=.15)continue;const h=hgdnaHash(d.x,d.y,d.k),sg=h&1?1:-1,mag=.18+((h>>>1)%13)/100;if((h>>5)&1){d.oy=sg*mag;d.ox=((h>>>6)%9-4)/40}else{d.ox=sg*mag;d.oy=((h>>>6)%9-4)/40}}
  L._hgdna={books,candles,thinned,before,after:L.decor.length}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L.decor)try{hgdnaThin(L)}catch(e){console.error('hgdna',e)}}}
// everything small that lies on the floor of the maze is 15 percent smaller (the pictures of the little props and rocks; floor items are drawn smaller in the sprite list itself)
{for(let i=0;i<16;i++){const k='art_hgxprop'+i;if(NPC_H[k]&&!NPC_H[k+'_s']){NPC_H[k]*=.85;NPC_H[k+'_s']=1}}
 for(let i=0;i<8;i++){const k='art_hgxrock'+i;if(NPC_H[k]&&!NPC_H[k+'_s']){NPC_H[k]*=.85;NPC_H[k+'_s']=1}}}
// the same sweep on the live decor when the maze is entered, for anything added after the build
function hgdnaSweep(list){for(const d of list){if(!HGDNA.SMALL.test(d.k||'')||d.block||d.npc||d.loot||d.wd)continue;if(Math.abs(d.ox||0)>=.15||Math.abs(d.oy||0)>=.15)continue;const h=hgdnaHash(d.x,d.y,d.k),sg=h&1?1:-1,mag=.18+((h>>>1)%13)/100;if((h>>5)&1){d.oy=sg*mag;d.ox=((h>>>6)%9-4)/40}else{d.ox=sg*mag;d.oy=((h>>>6)%9-4)/40}}}
{const _u=update;update=function(dt){try{if(LEVEL===HGD.ID&&G.decor&&G._hgdnaDec!==G.decor){G._hgdnaDec=G.decor;hgdnaSweep(G.decor);const L=LEVELS[HGD.ID];if(L&&L.decor)hgdnaSweep(L.decor)}}catch(e){}return _u.apply(this,arguments)}}
