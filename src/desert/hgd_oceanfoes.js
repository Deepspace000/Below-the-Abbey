/* ==========================================================================
   THE HORRORS OF THE BLACK SEA, and the chests of the Underlevel (prefix hgo). Ten kinds of painted horror (assets/ds_hgo*.png, a 5 x 2 sheet) that swim only in the water, near-black bodies with red glowing eyes
   (darkened at load the way hgduArt does it), and the Black Leviathan that guards the island. The great chest on the island holds 5000 gold; five more chests, 1000 gold each, stand at the ends of far dead
   corridors under guard. The core pays chest gold through goldCut (a fifth of the sum above 80), so the sum written into the chest is the one that goldCut turns into exactly 5000 or 1000.
   ========================================================================== */
const HGO_KINDS=[ // id, name, picture, hp, width, xp, verb. Sized like the other creatures of the Underlevel (they used to have 10 to 30 times the health and four times the damage of an ordinary creature, and one bite killed a hero)
 ['hgo0','Toothed Leviathan','hgoleviathan',90,2.8,150,'swallows'],['hgo1','Lure Angler','hgoangler',70,2.2,120,'snaps at'],['hgo2','Kraken Horror','hgokraken',100,3.0,150,'crushes'],
 ['hgo3','Drowned Swimmer','hgocorpse',40,1.5,80,'claws'],['hgo4','Black Eel','hgoeel',55,2.0,100,'bites'],['hgo5','Sea Hag','hgohag',60,1.5,110,'rakes'],
 ['hgo6','Blind Abyssal Crab','hgocrab',75,1.8,130,'pinches'],['hgo7','Bone-Fish Swarm','hgobones',45,1.6,90,'gnaws'],['hgo8','Black Slime Serpent','hgoserpent',80,2.4,140,'strangles'],
 ['hgo9','Hooked Leech','hgoleech',50,1.3,95,'drains']];
for(const [id,name,pic,hp,w,xp,verb] of HGO_KINDS){ENEMY_DEF[id]={name,hp,dmg:hp>=75?[14,26]:[12,22],hit:.85,w,img:'hgo_'+id,xp,gold:[0,0],speed:1,verb,aboveParty:0,glow:.95}} // not in NO_VARY: the balance code sizes their health like any ordinary creature
ENEMY_DEF.hgoboss={name:'The Black Leviathan',hp:6000,dmg:[40,70],hit:.88,w:3.4,img:'hgo_hgoboss',xp:9000,gold:[0,0],speed:1,verb:'devours',aboveParty:0,glow:.95};if(typeof NO_VARY!=='undefined')NO_VARY.push('hgoboss');
AFFL_HITS.push([/^hgo[06]$/,'bleeding',.25],[/^hgo[14]$/,'shaken',.2],[/^hgo[27]$/,'stung',.2],[/^hgo3$/,'graverot',.25],[/^hgo[58]$/,'poisoned',.25],[/^hgo9$/,'fever',.22],[/^hgoboss$/,'bleeding',.3],[/^hgo/,'shaken',.08]);
// the bodies are darkened to near black; the red pixels (the eyes) are kept and made brighter, with a glow
function hgoArt(){const mkOne=(id,src)=>{if(IMG['hgo_'+id]||!src||!src.width)return;try{
    const c=document.createElement('canvas');c.width=src.width;c.height=src.height;const x=c.getContext('2d');x.drawImage(src,0,0);const d=x.getImageData(0,0,c.width,c.height),p=d.data;
    const eye=document.createElement('canvas');eye.width=c.width;eye.height=c.height;const ex=eye.getContext('2d'),ed=ex.createImageData(c.width,c.height),q=ed.data;
    for(let k=0;k<p.length;k+=4){const r=p[k],g=p[k+1],b=p[k+2];if(p[k+3]>40&&r>120&&g<110&&b<110&&r>g*1.7){p[k]=255;p[k+1]=Math.min(70,g);p[k+2]=Math.min(60,b);q[k]=255;q[k+1]=30;q[k+2]=20;q[k+3]=255}else{p[k]*=.3;p[k+1]*=.3;p[k+2]*=.32}}
    x.putImageData(d,0,0);ex.putImageData(ed,0,0);
    x.save();x.globalCompositeOperation='lighter';x.filter='blur('+Math.max(3,c.width/55)+'px)';x.globalAlpha=.9;x.drawImage(eye,0,0);x.filter='blur('+Math.max(8,c.width/22)+'px)';x.globalAlpha=.55;x.drawImage(eye,0,0);x.restore();
    IMG['hgo_'+id]=c}catch(e){console.error('hgoArt',e)}};
  HGO_KINDS.forEach(([id,,pic],i)=>mkOne(id,IMG['art_'+pic]&&IMG['art_'+pic].width?IMG['art_'+pic]:IMG['hgu_hgusl'+i]));
  mkOne('hgoboss',IMG.art_hgoleviathan&&IMG.art_hgoleviathan.width?IMG.art_hgoleviathan:IMG.hgu_hgusl0)}
const hgoGoldFor=g=>{for(let x=g;x<g*8;x+=5)if(goldCut(x)===g)return x;return g}; // the sum that goldCut pays out as g
{const _lf=lootFor;lootFor=function(d){if(LEVEL===HGO.ID&&d&&d.k==='chest'&&d.goldAmt>=1000){d.gold=hgoGoldFor(d.goldAmt);return []}return _lf.apply(this,arguments)}}
/* ---------- they swim only in the water, and the dark crawlers keep out of it ---------- */
let HGO_CUR=null;
const hgoOk=e=>/^hgo/.test(e.t)?hgoWater(e.x,e.y):!hgoWater(e.x,e.y);
{const _ea=enemyAct;enemyAct=function(e){if(LEVEL!==HGO.ID||!hgoL())return _ea.apply(this,arguments);
  const px=e.x,py=e.y;HGO_CUR=e;let r;try{r=_ea.apply(this,arguments)}finally{HGO_CUR=null}
  if((e.x!==px||e.y!==py)&&!hgoOk(e)){e.x=px;e.y=py}return r}}
{const _t=terrStepOK;terrStepOK=function(x0,y0,x1,y1){if(HGO_CUR&&(/^hgo/.test(HGO_CUR.t)?!hgoWater(x1,y1):hgoWater(x1,y1)))return false;return _t.apply(this,arguments)}}
/* ---------- placing them, and the chests ---------- */
function hgoPopulate(L){
  hgoArt();const O=L._hgdo,W=HGO.W,H=HGO.H,rnd=hgdmRng(476888),U=L._hgdu,DV=[[1,0],[-1,0],[0,1],[0,-1]],ix=(x,y)=>y*W+x;
  const land=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&L.rows[y][x]==='.'&&!O.wm[ix(x,y)];
  const occ=new Set(L.enemies.map(e=>e.x+','+e.y));for(const d of L.decor)occ.add(d.x+','+d.y);
  const lad=U.ladders,nearLad=(x,y,m)=>lad.some(l=>Math.hypot(l.ax-x,l.ay-y)<m),keepAt=(x,y,m)=>O.keep.some(k=>Math.hypot(k.x-x,k.y-y)<m);
  // every land cell (the labyrinth is one piece)
  const cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(land(x,y))cells.push([x,y]);
  // the creatures that stood where the water is now go to the corridors
  const spare=cells.filter(c=>!nearLad(c[0],c[1],9)&&!occ.has(c[0]+','+c[1])&&L.fmap[c[1]][c[0]]==='0').sort(()=>rnd()-.5);
  for(const e of O.moved){const c=spare.pop();if(!c)break;e.x=c[0];e.y=c[1];occ.add(c[0]+','+c[1]);L.enemies.push(e)}
  const ids=HGO_KINDS.map(k=>k[0]);
  // the horrors: about 120 spread over the sea, 8 in every river section, never within 7 of a boat, a dock or the island; 6 more round the island with the Black Leviathan
  const ic=O.island,islD=(x,y)=>Math.hypot(x-ic.cx,y-ic.cy)-ic.r,boats=O.boats;
  const farBoat=(x,y,m)=>boats.every(b=>Math.hypot(b[0]-x,b[1]-y)>=m)&&O.docks.every(d=>Math.hypot(d.wx-x,d.wy-y)>=m);
  const seaC=[],rivC={};for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!O.wm[ix(x,y)])continue;if(O.reg[ix(x,y)]&&!O.riv[ix(x,y)])seaC.push([x,y]);else{const s=O.sec[ix(x,y)];(rivC[s]||(rivC[s]=[])).push([x,y])}}
  const spread=(cs,n,gap,minD)=>{const got=[];for(const c of cs.sort(()=>rnd()-.5)){if(got.length>=n)break;const k=c[0]+','+c[1];if(occ.has(k)||!farBoat(c[0],c[1],minD)||keepAt(c[0],c[1],5))continue;if(got.every(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])>=gap))got.push(c)}return got};
  const seaG=spread(seaC.filter(c=>islD(c[0],c[1])>=7),120,5,7);let ii=0;
  for(const c of seaG){L.enemies.push({t:ids[ii++%10],x:c[0],y:c[1]});occ.add(c[0]+','+c[1])}
  let rivN=0;{const rc=[];for(const s2 in rivC)for(const c of rivC[s2])rc.push(c);const g=spread(rc,40,8,7);for(const c of g){L.enemies.push({t:ids[ii++%10],x:c[0],y:c[1]});occ.add(c[0]+','+c[1]);rivN++}}
  const ring=seaC.filter(c=>{const d=islD(c[0],c[1]);return d>=2.5&&d<=5&&!occ.has(c[0]+','+c[1])});let nr=0;
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2+.4;let b=null,bd=1e9;for(const c of ring){const aa=Math.atan2(c[1]-ic.cy,c[0]-ic.cx),dd=Math.abs(Math.atan2(Math.sin(aa-a),Math.cos(aa-a)));if(dd<bd&&!occ.has(c[0]+','+c[1])){bd=dd;b=c}}
    if(b){L.enemies.push({t:k===0?'hgoboss':ids[(k*3+1)%10],x:b[0],y:b[1]});occ.add(b[0]+','+b[1]);nr++}}
  if(!L.enemies.some(e=>e.t==='hgoboss')){const b=ring.find(c=>!occ.has(c[0]+','+c[1]));if(b)L.enemies.push({t:'hgoboss',x:b[0],y:b[1]})}
  const nearRiv=(x,y,m)=>{for(let dy=-m;dy<=m;dy++)for(let dx=-m;dx<=m;dx++){const k=ix(x+dx,y+dy);if(O.riv[k]&&Math.hypot(dx,dy)<=m+.2)return true}return false};
  // five chests of 1000 gold beside the rivers (the end of a corridor that runs up to a river bank), far apart, each with two or three guards
  const dead=cells.filter(c=>{const k=c[0]+','+c[1];return !occ.has(k)&&!nearLad(c[0],c[1],14)&&!keepAt(c[0],c[1],6)&&nearRiv(c[0],c[1],7)&&!O.reg[ix(c[0],c[1])]&&DV.filter(d=>land(c[0]+d[0],c[1]+d[1])).length===1&&L.fmap[c[1]][c[0]]==='0'}).sort(()=>rnd()-.5);
  const chests=[];for(const gap of [55,42,32,24,14]){for(const c of dead){if(chests.length>=5)break;if(chests.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=gap))chests.push(c)}if(chests.length>=5)break}
  if(chests.length<5){const more=cells.filter(c=>!occ.has(c[0]+','+c[1])&&!nearLad(c[0],c[1],14)&&!keepAt(c[0],c[1],6)&&!O.reg[ix(c[0],c[1])]&&!O.isle[ix(c[0],c[1])]&&DV.filter(d=>land(c[0]+d[0],c[1]+d[1])).length===1&&L.fmap[c[1]][c[0]]==='0'&&chests.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=1)).sort(()=>rnd()-.5);for(const gap of [45,32,22,12]){for(const c of more){if(chests.length>=5)break;if(chests.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=gap))chests.push(c)}if(chests.length>=5)break}}
  const kinds=[];for(let i=0;i<10;i++)kinds.push('hgusl'+i,'hguyk'+i);
  for(const c of chests){L.decor.push({k:'chest',x:c[0],y:c[1],block:true,goldAmt:1000});occ.add(c[0]+','+c[1]);
    const dist=new Map([[c[0]+','+c[1],0]]),q=[c];for(let i=0;i<q.length;i++){const [a,b]=q[i],dd=dist.get(a+','+b);if(dd>=9)continue;for(const d of DV){const nx=a+d[0],ny=b+d[1],kk=nx+','+ny;if(land(nx,ny)&&!dist.has(kk)){dist.set(kk,dd+1);q.push([nx,ny])}}}
    const ring2=q.filter(p=>{const dd=dist.get(p[0]+','+p[1]);return dd>=3&&dd<=9&&!occ.has(p[0]+','+p[1])&&!DV.some(d=>O.wm[ix(p[0]+d[0],p[1]+d[1])])}),gs=[];const n=2+((rnd()*2)|0);
    for(const p of ring2.sort(()=>rnd()-.5)){if(gs.length>=n)break;if(gs.every(g=>Math.hypot(g[0]-p[0],g[1]-p[1])>=3)){gs.push(p);L.enemies.push({t:kinds[(rnd()*kinds.length)|0],x:p[0],y:p[1]});occ.add(p[0]+','+p[1])}}}
  O.chests=chests;O.seaCount=seaG.length;O.riverCount=rivN;O.bossRing=nr}
