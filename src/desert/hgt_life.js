/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: LIFE (prefix hgtlf / HGTLF). Townsfolk going about their day and neutral creatures in the terraced cities
   (481 to 484) and their interiors (4860 to 4939). Nothing here is saved: agents are built on level entry from the level (rows, heights,
   decor, doors) with a seed taken from the level id, so every visit starts the same way. They are pictures that move from cell to cell
   by the climb rule (|dh| <= 0.5), stay inside their zone, never stand still on a stair or in a one-cell corridor, and never block the
   party for more than a moment (a bump gives one line and stops the party once; the next step passes through).

   SPEC FORMAT  hgtlfRegister(levelId, spec)    spec = [agent,...]  or  {agents:[agent,...], auto:false | {npc:34,creatures:24,...}}
     agent = { kind:'npc'|'creature',
               sprite:'hg_npc3' | ['frameA','frameB'],     picture key (IMG) or walking frames; the art agent's pose pictures are found by
                                                          name: <sprite>_<mode><n> (mode walk, clean, tend, sit, read, fish, watch; n = 0,1,2..)
               frames:{walk:[keys],clean:[keys],..},       optional explicit pose pictures per mode (HGTLF.poses[sprite] does the same globally)
               name:'Sweeper',  lines:['plain line',..],   shown on a tap or a bump (creatures: one line in the message bar, never a dialogue)
               home:{x,y},                                  where it lives; the start cell
               route:[{x,y,wait},..],                       waypoints it walks in a loop (task 'walk'); wait in seconds
               spots:[{x,y},..],                            cells it moves between for the task (tend, sit, read, fish, watch, clean)
               task:'clean'|'walk'|'tend'|'sit'|'read'|'fish'|'watch'    creatures: mode 'wander'|'sit'
               schedule:{from,to},                          hours it is out (npc default 5 to 22; asleep indoors otherwise); creatures always out
               door:{x,y},                                  the street cell of its house door (it goes there at night and is gone)
               speed:cells per second, zone:radius in cells round home, sc:scale, h:height in cells (creatures), hover:height above floor,
               flee:true (creature steps away from the party), species:key }
   hgtlfAuto(levelId, opts) reads the built level and returns a list of agent specs (about 34 npc and 24 creatures in a city, fewer in rooms).
   Levels 481 to 484 and the room levels 4860 to 4939 are filled automatically on entry (no registration needed); hgtlfRegister adds agents of
   its own and may switch the automatic ones off (auto:false). hgtlfSpecies(key,def) adds or replaces a creature species (see HGTLF.species).
   ========================================================================== */
var HGTLF=(typeof HGTLF==='undefined')?{}:HGTLF;
Object.assign(HGTLF,{specs:{},species:HGTLF.species||{},poses:HGTLF.poses||{},autoCache:{},scans:{},ag:[],lv:-1,grid:null,last:0,S:null,flipC:{}});
function hgtlfRegister(id,spec){HGTLF.specs[id]=Array.isArray(spec)?{agents:spec}:(spec||{});delete HGTLF.autoCache[id];if(HGTLF.lv===id)HGTLF.lv=-1}
function hgtlfSpecies(key,def){HGTLF.species[key]=Object.assign(HGTLF.species[key]||{},def)}
function hgtlfPoses(sprite,obj){HGTLF.poses[sprite]=Object.assign(HGTLF.poses[sprite]||{},obj)}
const hgtlfAutoLevel=id=>(id>=481&&id<=484)||(id>=4860&&id<=4939);
const hgtlfCityKey=id=>{if(typeof HGTCITIES!=='undefined')for(const k in HGTCITIES)if(HGTCITIES[k].level===id)return k;return id>=4860&&id<4880?'exsce':id<4900?'ulb':id<4920?'glorm':id<4940?'nibb':(id===481?'exsce':id===482?'ulb':id===483?'glorm':'nibb')};
function hgtlfRng(seed){let s=seed>>>0;return()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}

/* ---------- creature species (placeholder pictures until the art agent registers its own with hgtlfSpecies) ----------
   sprites: candidate picture keys (the first that exists; or frames), h: height in cells, mode 'wander'|'sit', hover: float height, flee: steps away,
   where: kinds of place it likes (nook, pool, balcony, top, court, landing, any), cities: null = all. lines: plain factual lines for a tap or a bump. */
{const S=HGTLF.species,add=(k,d)=>{if(!S[k])S[k]=d},EX='exsce',UL='ulb',GL='glorm',NB='nibb';
 // painted hgtb_ pets (hgt_art2.js): [key, name, picture, size, mode, hover, glow, where, cities, lines]. Small ones are drawn 1.5 times larger in the streets.
 const L1=['It watches you and does not move.','It folds its fins and settles.'],L2=['It drifts a short way off.','Its fins fold flat and it hangs in the air.'],L3=['It turns its antennae toward you, then away.','It lifts one leg and puts it down again.'],L4=['The sac on its back glows.','It does not move from its place.'];
 const P=[['pinkbulb','Pink bulb','hgtb_pinkbulb',.45,'wander',0,0,['nook','court','landing','bench'],[EX,UL,NB],L3],
  ['lilacmoth','Lilac moth','hgtb_lilacmoth',.75,'wander',.3,0,['balcony','top','court'],[EX,GL,NB],L2],
  ['lanternbeetle','Lantern beetle','hgtb_lanternbeetle',.55,'sit',0,1,['bench','landing','nook','top'],[EX,UL,GL,NB],L4],
  ['pearlslug','Pearl slug','hgtb_pearlslug',.4,'sit',0,0,['pool','nook','landing','bench'],[UL,GL],L1],
  ['aquawhale','Aqua bulb-whale','hgtb_aquawhale',1.5,'sit',0,0,['court'],[GL,NB],['It breathes slowly and does not move.','It looks at you with one eye and then closes it.']],
  ['jadefinmoth','Jade fin-moth','hgtb_jadefinmoth',.8,'wander',.3,0,['top','balcony','pool'],[EX,UL,GL],L2],
  ['spindleray','Spindle ray','hgtb_spindleray',.75,'wander',.1,0,['court','landing'],[EX,GL,NB],L1],
  ['amberpup','Amber shell-pup','hgtb_amberpup',.35,'wander',0,0,['bench','landing','court'],[EX,UL,GL,NB],['It looks up at you and sits.','It steps back from you and waits.']],
  ['fishbeetle','Fish beetle','hgtb_fishbeetle',.8,'wander',0,0,['court','landing'],[UL,NB],L3],
  ['creamjelly','Cream jelly','hgtb_creamjelly',.9,'sit',.35,1,['pool','top','balcony'],[EX,UL,GL,NB],['The lights inside it pulse slowly.','It hangs in the air and does not move.']],
  ['jadeeel','Jade lantern-eel','hgtb_jadeeel',.6,'sit',0,1,['pool','nook'],[UL,GL,NB],L4],
  ['fishfly','Fish fly','hgtb_fishfly',.7,'wander',.35,0,['balcony','top','court'],[NB,EX],L2],
  ['peachwhale','Peach bulb-whale','hgtb_peachwhale',1.9,'sit',0,0,['court'],[EX,UL],['It breathes slowly and does not move.','It settles lower on its legs.']],
  ['creammoth','Cream moth','hgtb_creammoth',.5,'sit',.25,0,['top','bench','nook'],[EX,NB,GL],L2],
  ['pups','Shell pups','hgtb_pups',.4,'wander',0,0,['bench','landing','court'],[UL,GL],['They sit close together and watch you.','They step back together.']],
  ['spindlespider','Spindle spider','hgtb_spindlespider',.7,'wander',0,0,['nook','landing','court'],[EX,NB],L3]];
 for(const [k,n,pic,sz,mode,hover,glow,where,cities,lines] of P)add('p_'+k,{name:n,sprites:[pic],h:sz<1.2?sz*1.5:sz,mode,hover:hover?hover*1.2:0,glow,speed:mode==='sit'?.22:sz>1.2?.2:.4,flee:mode==='wander'&&sz<1.2?1:0,where,cities,lines,big:sz>1.2});
 // older placeholder species (used only when the painted pets are missing)
 add('glassfin',{name:'Glass fin',sprites:['hg_ins2'],h:.8,mode:'wander',hover:.22,speed:.42,flee:1,where:['pool','balcony','court'],cities:null,lines:L1});
 add('bulbgrub',{name:'Bulb grub',sprites:['hg_larva'],h:.5,mode:'sit',speed:.22,where:['nook','pool','landing','court'],cities:null,lines:['It does not react to you.','It ignores you.']});
}
const HGTLF_NPC=['hg_npc1','hg_npc3','hg_npc6','hg_npc0','hg_npc5','hg_npc4'];
const HGTLF_FOLK={clean:['hgtb_sweep'],walk:['hgtb_walk','hgtb_basket','hgtb_jar','hgtb_lantern','hgtb_elder'],tend:['hgtb_plantbed','hgtb_water'],lamp:['hgtb_polish','hgtb_lantern'],sit:['hgtb_elder','hgtb_basket'],read:['hgtb_read'],fish:['hgtb_fisher'],watch:['hgtb_watch']};
const HGTLF_TASK={clean:{name:'Sweeper',lines:['The stones need sweeping every day. Dust comes down from the roof.','I sweep this landing and the steps below it.','Leave the dust where it is and I will have to sweep it again.']},
 walk:{name:'Walker',lines:['I walk this way every day. It takes some time.','The stairs here are not steep. You get used to them.','I am on my way. The road is long.']},
 tend:{name:'Gardener',lines:['The plants here are looked after every day.','The glitter on the leaves comes back each night.','I keep the beds clear of weeds.']},
 lamp:{name:'Lamp tender',lines:['The lamps are trimmed every day. They burn all night.','A lamp that goes out is lit again by morning.','The oil is brought up from the lower town.']},
 sit:{name:'Resident',lines:['I sit here most of the day. The view is good.','This bench is the best one on the street.','It is quiet here.']},
 read:{name:'Reader',lines:['I am reading. It is a short book.','The book is about the roots under the city.','I read here because the light is steady.']},
 fish:{name:'Angler',lines:['Nothing has bitten yet. Something usually does.','I fish here from the edge. The water is deep.','The line is long. It has not reached the bottom.']},
 watch:{name:'Watcher',lines:['I watch the street from here.','You can see a long way from this edge.','Nothing has happened today. That is usual.']}};

/* ---------- reading the level: heights, passable cells, reach, kinds of place ---------- */
const HGTLF_PLANT=/^hgt_(crystalgrass|pearlbush|bulbflower|fern|shellflower|reeds|shrub|lightvine|mushrooms|giantcap|fairytree|willow)$/,HGTLF_LAMP=/lamp|lantern/;
const HGTLF_D4=[[0,-1],[1,0],[0,1],[-1,0]];
function hgtlfScan(id){
  let S=HGTLF.scans[id];if(S)return S;
  const L=LEVELS[id];if(!L||!L.rows)return null;
  const H=L.rows.length,W=L.rows[0].length,N=W*H,T=L.terrace&&L.terrace.h,h=new Float32Array(N),pass=new Uint8Array(N),avoid=new Uint8Array(N),reach=new Uint8Array(N),deg=new Uint8Array(N),fl=new Uint8Array(N);
  if(T)for(let i=0;i<N;i++)h[i]=T[i];
  for(let y=0;y<H;y++){const r=L.rows[y];for(let x=0;x<W;x++)pass[y*W+x]=r.charCodeAt(x)===46?1:0}
  if(typeof hgtnCells==='function'){for(const k of hgtnCells(L)){const c=k.split(',');const x=+c[0],y=+c[1];if(x>=0&&y>=0&&x<W&&y<H)pass[y*W+x]=0}} // narrow stairs: nothing stands or walks there
  const tall=new Uint8Array(N),cover=new Uint8Array(N),benches=[],plants=[],lamps=[],fountains=[],enters=[];
  for(const d of L.decor||[]){if(d.x<0||d.y<0||d.x>=W||d.y>=H)continue;const i=d.y*W+d.x;
    if(d.block||d.enter)pass[i]=0;
    if(d.enter)enters.push(d);
    if(d.npc){for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=d.x+dx,y=d.y+dy;if(x>=0&&y>=0&&x<W&&y<H)avoid[y*W+x]=1}}
    const k=d.k||'';
    if(!d.hidden&&(NPC_H[k]||(HGTLF_PLANT.test(k)?1:0))>=.55&&!/^hgtb_(bench|chair|table)$|^bench$/.test(k))tall[i]=1;
    if(k==='bench'||k==='hgtb_bench')benches.push(d);else if(HGTLF_PLANT.test(k))plants.push(d);else if(HGTLF_LAMP.test(k))lamps.push(d);else if(/fountain/.test(k))fountains.push(d);}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!tall[y*W+x])continue;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&cover[yy*W+xx]<250)cover[yy*W+xx]++}}
  const ok=(x,y,nx,ny)=>nx>=0&&ny>=0&&nx<W&&ny<H&&pass[ny*W+nx]&&Math.abs(h[ny*W+nx]-h[y*W+x])<=.5;
  const st=L.start||{x:(W/2)|0,y:(H/2)|0};let sx=st.x,sy=st.y;
  if(!pass[sy*W+sx]){let best=1e9;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(pass[y*W+x]){const d=Math.abs(x-sx)+Math.abs(y-sy);if(d<best){best=d;var bx=x,by=y}}if(best<1e9){sx=bx;sy=by}}
  const q=new Int32Array(N);let qh=0,qt=0,count=0;
  if(pass[sy*W+sx]){q[qt++]=sy*W+sx;reach[sy*W+sx]=1}
  while(qh<qt){const i=q[qh++],x=i%W,y=(i/W)|0;count++;for(const [dx,dy] of HGTLF_D4){const nx=x+dx,ny=y+dy;if(ok(x,y,nx,ny)&&!reach[ny*W+nx]){reach[ny*W+nx]=1;q[qt++]=ny*W+nx}}}
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;if(!reach[i])continue;
    let n=0,stair=false,edge=false,nsM=0,ewM=0;
    for(let k=0;k<4;k++){const nx=x+HGTLF_D4[k][0],ny=y+HGTLF_D4[k][1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const j=ny*W+nx;
      if(pass[j]){const dh=h[j]-h[i];if(Math.abs(dh)<=.5){n++;if(k%2===0)nsM++;else ewM++;if(Math.abs(dh)>.08)stair=true}else if(dh<-.9)edge=true}}
    deg[i]=n;let f=0;
    if(stair)f|=1;if(n===1)f|=2;if(n===2&&(nsM===2||ewM===2))f|=4;if(edge)f|=16;if(h[i]<=-.8)f|=64;fl[i]=f}
  // plazas (a flat open patch), landings (flat beside a stair), tower tops (a high cell with nothing higher round it)
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const i=y*W+x;if(!reach[i])continue;
    let same=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const j=(y+dy)*W+x+dx;if(pass[j]&&Math.abs(h[j]-h[i])<.02)same++}
    if(same>=17)fl[i]|=8;
    if(!(fl[i]&1)){for(const [dx,dy] of HGTLF_D4){const j=(y+dy)*W+x+dx;if(reach[j]&&(fl[j]&1)){fl[i]|=128;break}}}
    if(h[i]>=3){let higher=false,sm=0;for(let dy=-4;dy<=4&&!higher;dy++)for(let dx=-4;dx<=4;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const j=yy*W+xx;if(pass[j]&&h[j]>h[i]+.3){higher=true;break}if(pass[j]&&Math.abs(h[j]-h[i])<.02)sm++}
      if(!higher&&sm>=3)fl[i]|=32}}
  // doors: the street cell in front of each door wall and each enter decor
  const doors=[];
  for(let y=0;y<H;y++){const r=L.rows[y];for(let x=0;x<W;x++){const c=r[x];if(c==='.')continue;const gid=L.chars&&L.chars[c];if(!gid||typeof KH_DOOR==='undefined'||!KH_DOOR[gid])continue;
    for(const [dx,dy] of HGTLF_D4){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&reach[ny*W+nx]&&Math.abs(h[ny*W+nx]-h[y*W+x])<=.6){doors.push({x:nx,y:ny,dx:x,dy:y});break}}}}
  for(const d of enters)for(const [dx,dy] of HGTLF_D4){const nx=d.x+dx,ny=d.y+dy;if(nx>=0&&ny>=0&&nx<W&&ny<H&&reach[ny*W+nx]){doors.push({x:nx,y:ny,dx:d.x,dy:d.y});break}}
  S={W,H,N,h,pass,avoid,tall,cover,reach,deg,fl,doors,benches,plants,lamps,fountains,count,start:{x:sx,y:sy},
     q:new Int32Array(N),prev:new Int32Array(N),stamp:new Int32Array(N),sc:0};
  return HGTLF.scans[id]=S;
}
const hgtlfOK=(S,x,y,nx,ny)=>nx>=0&&ny>=0&&nx<S.W&&ny<S.H&&S.pass[ny*S.W+nx]===1&&Math.abs(S.h[ny*S.W+nx]-S.h[y*S.W+x])<=.5;
/* a cell is in open view when no tall decor stands within one cell and a line of two open cells leads away from it in some direction */
function hgtlfView(S,i,maxCover){if(S.cover[i]>(maxCover||0))return false;const x=i%S.W,y=(i/S.W)|0;for(const [dx,dy] of HGTLF_D4){let good=true;for(let k=1;k<=3;k++){const xx=x+dx*k,yy=y+dy*k;if(xx<0||yy<0||xx>=S.W||yy>=S.H||!S.pass[yy*S.W+xx]||S.tall[yy*S.W+xx]){good=false;break}}if(good)return true}return false}
/* breadth-first path (list of [x,y] after the start) inside a square zone; null when none */
function hgtlfPath(S,sx,sy,tx,ty,zx,zy,zr,maxN){
  if(sx===tx&&sy===ty)return[];
  const W=S.W,q=S.q,prev=S.prev,stamp=S.stamp,sc=++S.sc,t=ty*W+tx;let qh=0,qt=0;maxN=maxN||5000;
  q[qt++]=sy*W+sx;stamp[sy*W+sx]=sc;prev[sy*W+sx]=-1;
  while(qh<qt&&qt<maxN){const i=q[qh++],x=i%W,y=(i/W)|0;
    for(const [dx,dy] of HGTLF_D4){const nx=x+dx,ny=y+dy;if(!hgtlfOK(S,x,y,nx,ny))continue;if(zr>=0&&(Math.abs(nx-zx)>zr||Math.abs(ny-zy)>zr))continue;const j=ny*W+nx;if(stamp[j]===sc)continue;stamp[j]=sc;prev[j]=i;
      if(j===t){const out=[];let c=j;while(c!==sy*W+sx){out.push([c%W,(c/W)|0]);c=prev[c]}return out.reverse()}q[qt++]=j}}
  return null;
}
function hgtlfDist(S,sx,sy,max){const W=S.W,d=new Int16Array(S.N).fill(-1),q=S.q;let qh=0,qt=0;q[qt++]=sy*W+sx;d[sy*W+sx]=0;
  while(qh<qt){const i=q[qh++],x=i%W,y=(i/W)|0;if(d[i]>=max)continue;for(const [dx,dy] of HGTLF_D4){const nx=x+dx,ny=y+dy;if(!hgtlfOK(S,x,y,nx,ny))continue;const j=ny*W+nx;if(d[j]>=0)continue;d[j]=d[i]+1;q[qt++]=j}}
  return d}

/* ---------- the generator ---------- */
function hgtlfAuto(id,opts){
  const L=LEVELS[id];if(!L)return[];opts=opts||{};const cache=!Object.keys(opts).length;if(cache&&HGTLF.autoCache[id])return HGTLF.autoCache[id];
  const S=hgtlfScan(id);if(!S)return[];
  const W=S.W,rng=hgtlfRng(id*7919+13),ck=hgtlfCityKey(id),open=S.count,city=open>=2500;
  const nNpc=opts.npc!==undefined?opts.npc:city?34:Math.max(0,Math.min(3,Math.round(open/50))),nCre=opts.creatures!==undefined?opts.creatures:city?24:Math.max(0,Math.min(3,Math.round(open/60)));
  const used=[],list=[],tooNear=(x,y,r,g)=>{for(const u of used)if(Math.max(Math.abs(u.x-x),Math.abs(u.y-y))<(u.g===g?r:2))return true;return false};
  const cell=i=>({x:i%W,y:(i/W)|0}),shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(rng()*(i+1))|0;const t=a[i];a[i]=a[j];a[j]=t}return a};
  const far=(i)=>{const x=i%W,y=(i/W)|0;return Math.abs(x-S.start.x)+Math.abs(y-S.start.y)>=4};
  const stopOK=i=>S.reach[i]&&!S.avoid[i]&&!(S.fl[i]&7)&&S.deg[i]>=3&&far(i); // a cell where one may stand: not a stair, not a corridor, not a dead end
  const doorOf=(x,y)=>{let b=null,bd=1e9;for(const d of S.doors){const m=Math.abs(d.x-x)+Math.abs(d.y-y);if(m<bd){bd=m;b=d}}return b&&bd<=30?{x:b.x,y:b.y}:null};
  const take=(cands,n,sp,g,score)=>{ // pick n spread-out cells from cands, interesting ones first
    let c=shuffle(cands.slice());if(score){const kk=new Map();for(const i of c)kk.set(i,score(i)*(.6+rng()*.8));c.sort((a,b)=>kk.get(b)-kk.get(a))}const out=[];
    for(const i of c){if(out.length>=n)break;const x=i%W,y=(i/W)|0;if(tooNear(x,y,sp,g))continue;used.push({x,y,g});out.push(i)}return out};
  const all=[],byFl=m=>{const a=[];for(let i=0;i<S.N;i++)if(S.reach[i]&&!S.avoid[i]&&(S.fl[i]&m)&&far(i))a.push(i);return a};
  for(let i=0;i<S.N;i++)if(stopOK(i))all.push(i);
  const interest=i=>1+((S.fl[i]&16)?1:0)+((S.fl[i]&64)?1:0)+(S.h[i]>3?.5:0)+(S.h[i]>8?.5:0);
  const spotsNear=(i,pred,r,n)=>{const x=i%W,y=(i/W)|0,o=[];for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=S.W||yy>=S.H)continue;const j=yy*W+xx;if(pred(j)&&(dx||dy))o.push({x:xx,y:yy})}return shuffle(o).slice(0,n)};
  const npcSpec=(task,i,extra)=>{const c=cell(i),tk=HGTLF_TASK[extra&&extra.lamp?'lamp':task]||HGTLF_TASK.walk,dr=doorOf(c.x,c.y);
    const fk=HGTLF_FOLK[extra&&extra.lamp?'lamp':task]||[],pick=fk.length?fk[(rng()*fk.length)|0]:null;
    return Object.assign({kind:'npc',sprite:HGTLF_NPC[(rng()*HGTLF_NPC.length)|0],sprites:pick?[pick]:null,name:tk.name,task,home:c,door:dr,speed:.5+rng()*.25,lines:tk.lines,zone:5,schedule:city?{from:5,to:22}:{from:0,to:24},auto:1},extra||{})};
  const plantSpot=i=>S.reach[i]&&!S.avoid[i]&&!(S.fl[i]&5)&&S.deg[i]>=2&&S.cover[i]<=2,view=i=>hgtlfView(S,i,0),mk=(n)=>Math.round(nNpc*n/34);
  if(!city){ // a room: a few residents sitting, reading or sweeping, and small creatures in the corners
    const rc=[];for(let i=0;i<S.N;i++)if(S.reach[i]&&!S.avoid[i]&&!(S.fl[i]&1)&&S.deg[i]>=2&&far(i))rc.push(i);
    const tasks=['sit','read','clean'];take(rc,nNpc,3,'room',null).forEach((i,k)=>list.push(npcSpec(tasks[k%3],i,{zone:k%3===2?2:0,door:null,spots:[]})));
    const sp0=Object.keys(HGTLF.species).filter(k=>{const d=HGTLF.species[k];return(!d.cities||d.cities.includes(ck))&&hgtlfSpriteOf(d)&&(d.mode==='sit'||d.speed<=.3)});
    let made0=0;if(sp0.length)for(const i of take(rc,nCre,4,'roomc',null)){const key=sp0[(rng()*sp0.length)|0],d=HGTLF.species[key];list.push({kind:'creature',species:key,name:d.name,home:cell(i),mode:'sit',zone:1,speed:d.speed,flee:false,lines:d.lines,auto:1});made0++}
    if(cache)HGTLF.autoCache[id]=list;HGTLF.stats[id]={npc:list.length-made0,creatures:made0,open};return list}
  // 1. sweepers on plazas and stair landings
  for(const i of take(byFl(8|128).filter(i=>stopOK(i)),mk(8),7,'clean',interest))list.push(npcSpec('clean',i,{zone:3,spots:spotsNear(i,j=>stopOK(j)&&(S.fl[j]&(8|128)),3,4)}));
  // 2. walkers with routes between doors, plazas and gardens
  {const targets=[];for(const d of S.doors)targets.push(d.y*W+d.x);for(const d of S.plants)if(S.reach[d.y*W+d.x])targets.push(d.y*W+d.x);for(const i of byFl(8))if(rng()<.08)targets.push(i);
   const ts=targets.filter(i=>S.reach[i]&&!S.avoid[i]&&!(S.fl[i]&1));
   for(const i of take(all,mk(12),6,'walk',interest)){const c=cell(i),d1=hgtlfDist(S,c.x,c.y,60),b=ts.filter(t=>d1[t]>=12&&d1[t]<=55);if(!b.length){list.push(npcSpec('walk',i,{zone:12}));continue}
     const B=b[(rng()*b.length)|0],bc=cell(B),d2=hgtlfDist(S,bc.x,bc.y,50),c2=ts.filter(t=>d2[t]>=10&&d2[t]<=45&&d1[t]>=8),C=c2.length?c2[(rng()*c2.length)|0]:-1;
     const route=[{x:c.x,y:c.y,wait:2+rng()*3},{x:bc.x,y:bc.y,wait:3+rng()*5}];if(C>=0){const cc=cell(C);route.push({x:cc.x,y:cc.y,wait:3+rng()*5})}
     list.push(npcSpec('walk',i,{route,zone:70,speed:.55+rng()*.2}))}}
  // 3. tenders beside plant beds and lamps (lamp tenders stay out at night)
  {const bedCells=[],lampCells=[];
   for(const d of S.plants){const i=d.y*W+d.x;let near=0;for(const e of S.plants)if(Math.abs(e.x-d.x)<=2&&Math.abs(e.y-d.y)<=2)near++;if(near>=3)for(const [dx,dy] of HGTLF_D4){const j=(d.y+dy)*W+d.x+dx;if(plantSpot(j)&&far(j)&&S.h[j]===S.h[i])bedCells.push(j)}}
   for(const d of S.lamps)for(const [dx,dy] of HGTLF_D4){const j=(d.y+dy)*W+d.x+dx;if(plantSpot(j)&&far(j))lampCells.push(j)}
   for(const i of take(bedCells.filter(i=>hgtlfView(S,i,2)),mk(5),8,'tend',null))list.push(npcSpec('tend',i,{zone:4,spots:spotsNear(i,j=>plantSpot(j),3,3)}));
   for(const i of take(lampCells,mk(3),10,'lamp',null))list.push(npcSpec('tend',i,{lamp:true,zone:6,spots:spotsNear(i,j=>plantSpot(j),4,3),schedule:{from:0,to:24},door:null}))}
  // 4. sitters on benches and platforms, readers
  {const bc=[];for(const d of S.benches)for(const [dx,dy] of HGTLF_D4){const j=(d.y+dy)*W+d.x+dx;if(S.reach[j]&&!S.avoid[j]&&!(S.fl[j]&5)&&far(j))bc.push(j)}
   const plat=byFl(8|16|32).filter(i=>!(S.fl[i]&1)&&S.deg[i]>=2),cands=(bc.length>=4?bc:bc.concat(plat)).filter(view);
   const got=take(cands,mk(5),8,'sit',interest);got.forEach((i,k)=>list.push(npcSpec(k%3===2?'read':'sit',i,{zone:0})))}
  // 5. anglers at pools and fountains, watchers at edges
  {const pc=[];for(const d of S.fountains)for(const [dx,dy] of HGTLF_D4){const j=(d.y+dy)*W+d.x+dx;if(S.reach[j]&&!S.avoid[j]&&far(j))pc.push(j)}
   const sunk=byFl(64).filter(i=>S.deg[i]>=3);
   for(const i of take(pc.concat(sunk).filter(view),mk(2),12,'fish',null))list.push(npcSpec('fish',i,{zone:0}));
   for(const i of take(byFl(16).filter(i=>S.deg[i]>=2&&!(S.fl[i]&1)&&view(i)),mk(2),12,'watch',null))list.push(npcSpec('watch',i,{zone:0}))}
  // creatures: nooks, pools, balconies, tower tops, courts and landings
  let sp=Object.keys(HGTLF.species).filter(k=>{const d=HGTLF.species[k];return(!d.cities||d.cities.includes(ck))&&hgtlfSpriteOf(d)});
  const painted=sp.filter(k=>/^hgtb_/.test(HGTLF.species[k].sprites[0]));if(painted.length>=4)sp=painted; // the painted pets in every city, a different mix in each
  const vw=i=>hgtlfView(S,i,0),benchCells=[];for(const d of S.benches){const i=d.y*W+d.x;if(S.h[i]>-50)benchCells.push(i)}
  const place={nook:()=>byFl(2).concat(byFl(4).filter(()=>rng()<.1)).filter(vw),pool:()=>byFl(64).filter(i=>S.deg[i]>=2&&vw(i)),balcony:()=>byFl(16).filter(vw),top:()=>byFl(32).filter(vw),court:()=>byFl(8).filter(vw),landing:()=>byFl(128).filter(vw),bench:()=>benchCells};
  const mix=city?{bench:4,nook:3,pool:4,balcony:3,top:3,court:3,landing:4}:{nook:1,court:1,landing:1,balcony:1};
  let made=0;const tot=Object.keys(mix).reduce((a,k)=>a+mix[k],0),usedN={};
  const pickSp=(fit)=>{let best=null,bn=1e9;for(const k of shuffle(fit.slice())){const d=HGTLF.species[k],n=(usedN[k]||0)+(d.big&&(usedN[k]||0)>=1?9:0);if(n<bn){bn=n;best=k}}usedN[best]=(usedN[best]||0)+1;if(HGTLF.species[best].big)bigN++;return best};
  let bigN=0;const make=(k,i,perch)=>{const fit=sp.filter(s=>(HGTLF.species[s].where.includes(k)||HGTLF.species[s].where.includes('any'))&&!(HGTLF.species[s].big&&(bigN>=2||perch)));if(!fit.length)return false;
    const key=pickSp(fit),d=HGTLF.species[key],c=cell(i),sit=perch||d.mode==='sit';
    list.push({kind:'creature',species:key,name:d.name,home:c,mode:sit?'sit':'wander',perch:!!perch,zone:perch?0:sit?2:k==='court'?5:3,speed:d.speed,flee:d.flee,lines:d.lines,auto:1});made++;return true};
  for(const k in mix){const n=Math.round(nCre*mix[k]/tot);if(!n)continue;
    for(const i of take(place[k](),n,k==='bench'?3:5,'c'+k,k==='bench'?null:interest))make(k,i,k==='bench')}
  if(made<nCre){const extra=shuffle(byFl(8|128).filter(vw));for(const i of extra){if(made>=nCre)break;const x=i%W,y=(i/W)|0;if(tooNear(x,y,5,'cx'))continue;used.push({x,y,g:'cx'});make(Math.random()<.5?'landing':'court',i,false)}}
  if(city){ // roosts and idle folk on every tower top, belvedere and platform; something moving on every empty plaza
    const seen=new Uint8Array(S.N),comps=[];
    for(let i0=0;i0<S.N;i0++){if(seen[i0]||!S.reach[i0]||(S.fl[i0]&1)||!(S.fl[i0]&(8|16|32)))continue;
      const hi=S.h[i0]>=2.5,q=[i0],cells=[];seen[i0]=1;
      while(q.length){const i=q.pop();cells.push(i);const x=i%W,y=(i/W)|0;for(const [dx,dy] of HGTLF_D4){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=S.H)continue;const j=ny*W+nx;if(seen[j]||!S.reach[j]||(S.fl[j]&1)||!(S.fl[j]&(8|16|32)))continue;if(Math.abs(S.h[j]-S.h[i])>.02||(S.h[j]>=2.5)!==hi)continue;seen[j]=1;q.push(j)}}
      comps.push({cells,hi})}
    const near=(x,y,r)=>list.some(a=>a.home&&Math.max(Math.abs(a.home.x-x),Math.abs(a.home.y-y))<=r);
    const pickIn=(cells,pred)=>{const c=shuffle(cells.filter(pred));return c.length?c[0]:-1};
    let roosts=0,folk=0,plz=0;
    for(const c of comps){const n=c.cells.length;
      if(c.hi&&n>=4){const x0=c.cells[0]%W,y0=(c.cells[0]/W)|0,mid=c.cells[(n/2)|0],mx=mid%W,my=(mid/W)|0;
        if(!near(mx,my,Math.max(3,Math.min(6,Math.sqrt(n))))){const i=pickIn(c.cells,i=>!S.avoid[i]&&S.cover[i]===0&&far(i)&&!(S.fl[i]&7)&&!tooNear(i%W,(i/W)|0,2,'roost'));
          if(i>=0){used.push({x:i%W,y:(i/W)|0,g:'roost'});if(make('top',i,false))roosts++}}
        if(n>=9&&!list.some(a=>a.kind==='npc'&&a.home&&c.cells.includes(a.home.y*W+a.home.x))){const i=pickIn(c.cells,i=>stopOK(i)&&view(i)&&!tooNear(i%W,(i/W)|0,3,'roostf'));
          if(i>=0){used.push({x:i%W,y:(i/W)|0,g:'roostf'});list.push(npcSpec(['watch','sit','read'][folk%3],i,{zone:0}));folk++}}}
      else if(!c.hi&&n>=12){const mid=c.cells[(n/2)|0],mx=mid%W,my=(mid/W)|0;
        if(!near(mx,my,6)){const i=pickIn(c.cells,i=>!S.avoid[i]&&S.cover[i]===0&&far(i)&&!(S.fl[i]&7)&&!tooNear(i%W,(i/W)|0,2,'plz'));
          if(i>=0){used.push({x:i%W,y:(i/W)|0,g:'plz'});if(plz%2===0)list.push(npcSpec('clean',i,{zone:3,spots:spotsNear(i,j=>stopOK(j)&&(S.fl[j]&8),3,4)}));else make('court',i,false);plz++}}}}
    made+=0;HGTLF.roost={roosts,folk,plazas:plz,comps:comps.length};
  }
  if(cache)HGTLF.autoCache[id]=list;
  HGTLF.stats[id]={npc:list.filter(a=>a.kind==='npc').length,creatures:made,open,doors:S.doors.length,plants:S.plants.length,lamps:S.lamps.length,benches:S.benches.length,fountains:S.fountains.length};
  return list;
}
HGTLF.stats={};
function hgtlfSpriteOf(d){if(d.frames&&d.frames.length&&d.frames.every(k=>IMG[k]))return d.frames.slice();if(d.sprites)for(const k of d.sprites)if(IMG[k])return[k];return null}

/* ---------- agents ---------- */
function hgtlfMake(sp,S,rng,i){
  const a={id:i,kind:sp.kind==='creature'?'creature':'npc',sp,name:sp.name||'Resident',lines:sp.lines&&sp.lines.length?sp.lines:null,fc:{},seed:rng()*10,x:0,y:0,hz:0,state:'wait',t:rng()*4,path:null,pi:0,vis:true,bumpT:-9,dx:1,dy:0,fleeT:0,ri:0,acc:0,speed:sp.kind==='creature'?(sp.speed||.45):Math.min(.75,sp.speed||.75)}; // townsfolk walk slowly
  const sk=sp.species&&HGTLF.species[sp.species],d=sk||{};
  if(a.kind==='creature'){
    const fr=Array.isArray(sp.sprite)?sp.sprite:sp.sprite?[sp.sprite]:(hgtlfSpriteOf(d)||[]);if(!fr.length)return null;
    a.k=fr[0];a.frames=fr;a.h=sp.h||d.h||.5;a.hover=sp.hover!==undefined?sp.hover:d.hover||0;a.flee=sp.flee!==undefined?!!sp.flee:!!d.flee;a.mode=sp.mode||d.mode||'wander';a.task=a.mode;a.flipDir=sp.flipDir!==undefined?sp.flipDir:d.flipDir!==false;
    a.glow=sp.glow!==undefined?sp.glow:d.glow||0;if(sp.perch)a.hover+=.3;a.lines=a.lines||d.lines||['It does not react to you.'];a.name=sp.name||d.name||'Creature';
  }else{
    let fr=Array.isArray(sp.sprite)?sp.sprite:[sp.sprite||'hg_npc3'];if(sp.sprites){const f=sp.sprites.find(k=>IMG[k]);if(f)fr=[f]}a.k=fr[0];a.frames=fr;a.task=sp.task||'walk';a.sc=sp.sc||1;a.h=(NPC_H[a.k]||(/^hgtb_/.test(a.k)?1.15:1.2))*a.sc;a.hover=sp.hover||0;a.flipDir=false;
    const tk=HGTLF_TASK[a.task]||HGTLF_TASK.walk;a.lines=a.lines||tk.lines;
  }
  const hm=sp.home||(sp.route&&sp.route[0])||{x:0,y:0};let hx=Math.round(hm.x),hy=Math.round(hm.y);
  if(sp.perch)a.fixed=true;
  if(!sp.perch&&!(hx>=0&&hy>=0&&hx<S.W&&hy<S.H&&S.reach[hy*S.W+hx])){let b=null,bd=99;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const x=hx+dx,y=hy+dy;if(x>=0&&y>=0&&x<S.W&&y<S.H&&S.reach[y*S.W+x]&&Math.abs(dx)+Math.abs(dy)<bd){bd=Math.abs(dx)+Math.abs(dy);b=[x,y]}}if(!b)return null;hx=b[0];hy=b[1]}
  a.home={x:hx,y:hy};a.x=hx;a.y=hy;a.hz=S.h[hy*S.W+hx];
  a.zone={x:hx,y:hy,r:sp.zone!==undefined?sp.zone:a.kind==='creature'?4:5};
  if(sp.route&&sp.route.length>1)a.route=sp.route.map(p=>({x:Math.round(p.x),y:Math.round(p.y),wait:p.wait===undefined?3:p.wait}));
  a.spots=(sp.spots||[]).map(p=>({x:Math.round(p.x),y:Math.round(p.y)})).filter(p=>p.x>=0&&p.y>=0&&p.x<S.W&&p.y<S.H&&S.reach[p.y*S.W+p.x]);
  a.sched=a.kind==='npc'?(sp.schedule||{from:5,to:22}):sp.schedule||null;
  a.door=sp.door?{x:Math.round(sp.door.x),y:Math.round(sp.door.y)}:null;
  a.stub={k:a.k,x:hx,y:hy,walk:true,npc:'hgtlf',hgtlf:a};
  a.state=hgtlfActive(a)?'wait':'in';if(a.state==='in')a.vis=false;
  return a;
}
const hgtlfEve=()=>{const h=hgtlfHour();return h>=19||h<6.5?1:h>=16?(h-16)/3:h<7.5?(7.5-h):0}; // the light of the sprites starts to lift from 16:00
const hgtlfNight=()=>Math.max(hgtlfNight0(),hgtlfEve());
const hgtlfNight0=()=>typeof hgtlmNight==='function'?(typeof hgtlmInterior==='function'&&hgtlmInterior(LEVEL)?.6:hgtlmNight()):(()=>{const h=hgtlfHour();return h>=20||h<6?1:0})();
const hgtlfHour=()=>((G.clock||0)%1440)/60;
function hgtlfActive(a){if(!a.sched)return true;const hr=hgtlfHour(),f=a.sched.from,t=a.sched.to;return f<=t?(hr>=f&&hr<t):(hr>=f||hr<t)}
/* ---------- the markets: a stallholder sits beside many of the stalls, and shoppers walk from stall to stall, stopping to look ---------- */
function hgtlfMarket(id,S){
  const L=LEVELS[id];if(!L||!L.decor||!(id>=481&&id<=484))return [];
  const stalls=L.decor.filter(d=>/^hgtb_stall_/.test(d.k));if(!stalls.length)return [];
  const r=hgtlfRng(id*17+3),pickOf=a=>a[(r()*a.length)|0],W=S.W,occ=new Set(L.decor.filter(d=>d.block!==false).map(d=>Math.floor(d.x)+','+Math.floor(d.y)));
  const folk=L.decor.filter(d=>d.npc&&!/^hgtb_stall_/.test(d.k)),ok=(x,y,h0)=>x>=0&&y>=0&&x<S.W&&y<S.H&&S.reach[y*W+x]&&!occ.has(x+','+y)&&Math.abs(S.h[y*W+x]-h0)<.02&&!(S.fl[y*W+x]&1)&&S.deg[y*W+x]>=2&&!folk.some(d=>Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=1); // (the 'avoid' mark round a stall is only the stall's own: it has a shopkeeper's tap)
  const fronts=stalls.map(d=>{const x=Math.floor(d.x),y=Math.floor(d.y),h0=S.h[y*W+x],c=[];for(const [dx,dy] of [[0,1],[0,-1],[1,0],[-1,0]])if(ok(x+dx,y+dy,h0))c.push({x:x+dx,y:y+dy});return {d,c}}).filter(o=>o.c.length);
  for(let i=fronts.length-1;i>0;i--){const j=(r()*(i+1))|0,t=fronts[i];fronts[i]=fronts[j];fronts[j]=t}
  const out=[],used=[],far=(x,y,g)=>!used.some(u=>Math.abs(u.x-x)+Math.abs(u.y-y)<g);
  const base=(task,c,extra)=>Object.assign({kind:'npc',sprite:pickOf(HGTLF_NPC),sprites:(HGTLF_FOLK[task]||[]).length?[pickOf(HGTLF_FOLK[task])]:null,name:task==='sit'?'Stallholder':'Shopper',task,home:c,door:null,speed:.5+r()*.2,zone:2,schedule:{from:6,to:21},auto:1},extra||{});
  const hl=['Fresh today. Look as long as you like.','Everything here came up the terraces this morning.','Take a little of everything.','The best on this row, and I am not just saying that.'];
  const sl=['I am choosing between the figs and the dates.','The stalls on this row are the best.','Mind my basket.','I come here every morning for the greens.'];
  const nH=Math.min(fronts.length,16);let got=0;
  for(const o of fronts){if(got>=nH)break;const c=o.c[(r()*o.c.length)|0];if(!far(c.x,c.y,3))continue;used.push(c);got++;out.push(base('sit',c,{zone:0,lines:hl,spots:[]}))}
  const nS=Math.min(Math.ceil(stalls.length/2)+1,12);let made=0;
  for(let i=0;i<fronts.length&&made<nS;i+=2){const A=fronts[i],pts=[A];for(let j=0;j<fronts.length&&pts.length<3;j++){const B=fronts[j];if(B===A||pts.includes(B))continue;const d=Math.abs(B.d.x-A.d.x)+Math.abs(B.d.y-A.d.y);if(d>=3&&d<=14)pts.push(B)}
    if(pts.length<2)continue;const route=pts.map(o=>{const c=o.c[(r()*o.c.length)|0];return {x:c.x,y:c.y,wait:4+r()*6}});
    out.push(base('walk',{x:route[0].x,y:route[0].y},{route,zone:40,lines:sl,speed:.5+r()*.2}));made++}
  return out}
function hgtlfEnter(){
  HGTLF.ag=[];HGTLF.lv=LEVEL;HGTLF.grid=G.grid;HGTLF.S=null;HGTLF.last=G.time||0;
  if(!hgtAny(LEVEL)||!LEVELS[LEVEL])return;
  const reg=HGTLF.specs[LEVEL];if(!reg&&!hgtlfAutoLevel(LEVEL))return;
  const S=hgtlfScan(LEVEL);if(!S)return;
  let list=reg&&reg.agents?reg.agents.slice():[];
  if(!reg||reg.auto!==false)list=list.concat(hgtlfAuto(LEVEL,reg&&typeof reg.auto==='object'?reg.auto:undefined));
  try{list=list.concat(hgtlfMarket(LEVEL,S))}catch(e){console.error('hgtlf market',e)}
  const rng=hgtlfRng(LEVEL*31+7),ag=[];
  for(const sp of list){const a=hgtlfMake(sp,S,rng,ag.length);if(a){a.cx=Math.round(a.x);a.cy=Math.round(a.y);ag.push(a)}}
  HGTLF.ag=ag;HGTLF.S=S;
}
function hgtlfPick(a,S){ // a random cell in the zone that can be walked to
  for(let k=0;k<10;k++){const z=a.zone,r=Math.max(1,z.r),x=z.x+(((Math.random()*(2*r+1))|0)-r),y=z.y+(((Math.random()*(2*r+1))|0)-r);
    if(x<0||y<0||x>=S.W||y>=S.H)continue;const i=y*S.W+x;if(!S.reach[i]||S.avoid[i])continue;if(a.kind==='npc'&&(S.fl[i]&7))continue;if(a.kind==='creature'&&((S.fl[i]&1)&&Math.random()<.8||S.cover[i]>0&&Math.random()<.9))continue;
    if(x===Math.round(a.x)&&y===Math.round(a.y))continue;return{x,y}}
  return null}
function hgtlfGo(a,S,tx,ty,maxN){const z=a.zone,p=hgtlfPath(S,Math.round(a.x),Math.round(a.y),tx,ty,a.homing?-1:z.x,z.y,a.homing?-1:z.r,maxN||(z.r>20?6000:900));if(p&&p.length){a.path=p;a.pi=0;a.state='move';return true}return false}
function hgtlfDecide(a,S){
  if(a.fixed){a.state='wait';a.t=8+Math.random()*20;return}
  const waitFor=(lo,hi)=>lo+Math.random()*(hi-lo);let ok=false;
  if(a.route){a.ri=(a.ri+1)%a.route.length;const r=a.route[a.ri];ok=hgtlfGo(a,S,r.x,r.y);a.t=ok?0:2;a.nextWait=r.wait;if(!ok){a.state='wait';a.t=3}return}
  if(a.kind==='creature'){
    if(a.mode==='sit'){if(Math.random()<.25){const p=hgtlfPick(a,S);if(p)ok=hgtlfGo(a,S,p.x,p.y)}if(!ok){a.state='wait';a.t=waitFor(6,20)}else a.nextWait=waitFor(8,25);return}
    const p=hgtlfPick(a,S);if(p)ok=hgtlfGo(a,S,p.x,p.y);if(!ok){a.state='wait';a.t=waitFor(2,6)}else a.nextWait=waitFor(1,7);return}
  const T=a.task;
  if((T==='clean'||T==='tend')&&(a.spots.length&&Math.random()<(T==='tend'?.7:.35))){const p=a.spots[(Math.random()*a.spots.length)|0];ok=hgtlfGo(a,S,p.x,p.y);a.nextWait=waitFor(8,20)}
  else if((T==='sit'||T==='read'||T==='fish'||T==='watch')&&a.spots.length&&Math.random()<.3){const p=a.spots[(Math.random()*a.spots.length)|0];ok=hgtlfGo(a,S,p.x,p.y);a.nextWait=waitFor(30,80)}
  else if(T==='walk'){const p=hgtlfPick(a,S);if(p){ok=hgtlfGo(a,S,p.x,p.y);a.nextWait=waitFor(2,8)}}
  else if((T==='clean'||T==='tend')&&Math.random()<.5){const p=hgtlfPick(a,S);if(p&&Math.abs(p.x-a.home.x)+Math.abs(p.y-a.home.y)<=a.zone.r*2){ok=hgtlfGo(a,S,p.x,p.y);a.nextWait=waitFor(8,20)}}
  if(!ok){a.state='wait';a.t=T==='sit'||T==='read'||T==='fish'||T==='watch'?waitFor(25,70):waitFor(6,16)}
}
function hgtlfArrive(a,S){
  a.path=null;a.cx=Math.round(a.x);a.cy=Math.round(a.y);
  if(a.homing){a.state='in';a.vis=false;a.homing=false;return}
  a.state='wait';a.t=a.nextWait!==undefined?a.nextWait:3;a.nextWait=undefined;
}
function hgtlfStep(a,S,dt,px,py){
  if(a.kind==='creature'&&a.flee&&a.state!=='in'){
    const dx=a.x-px,dy=a.y-py;
    if(a.fleeT>0)a.fleeT-=dt;
    else if(dx*dx+dy*dy<5.5){ // the party is within two cells: step two to four cells away
      let best=null,bd=dx*dx+dy*dy;for(let k=0;k<12;k++){const p=hgtlfPick(a,S);if(!p)continue;const d=(p.x-px)*(p.x-px)+(p.y-py)*(p.y-py);if(d>bd+3&&Math.abs(p.x-a.x)+Math.abs(p.y-a.y)<=5&&Math.abs(p.x-a.x)+Math.abs(p.y-a.y)>=2){bd=d;best=p}}
      if(best&&hgtlfGo(a,S,best.x,best.y,500)){a.fleeT=3;a.nextWait=3+Math.random()*5}else a.fleeT=1.5}
  }
  if(a.state==='in'){if(hgtlfActive(a)){const d=a.door||a.home;a.x=d.x;a.y=d.y;a.cx=d.x;a.cy=d.y;a.vis=true;a.state='wait';a.t=1+Math.random()*3;a.hz=S.h[Math.round(a.y)*S.W+Math.round(a.x)]}return}
  if(!hgtlfActive(a)&&!a.homing){ // out of hours: walk to the door and go in
    const d=a.door||a.home;a.homing=true;a.nextWait=0;
    if(Math.round(a.x)===d.x&&Math.round(a.y)===d.y){a.state='in';a.vis=false;a.homing=false;return}
    if(!hgtlfGo(a,S,d.x,d.y,6000)){a.state='in';a.vis=false;a.homing=false;return}
  }
  if(a.state==='wait'){a.t-=dt;if(a.t<=0)hgtlfDecide(a,S);return}
  if(a.state==='move'&&a.path){
    let step=a.speed*(a.fleeT>0?2.3:1)*dt;
    while(step>0&&a.path){const p=a.path[a.pi],ex=p[0]-a.x,ey=p[1]-a.y,d=Math.hypot(ex,ey);
      if(d<=step){a.x=p[0];a.y=p[1];step-=d;a.dx=ex?Math.sign(ex):0;a.dy=ey?Math.sign(ey):0;a.pi++;if(a.pi>=a.path.length){hgtlfArrive(a,S);break}}
      else{a.x+=ex/d*step;a.y+=ey/d*step;a.dx=Math.sign(ex);a.dy=Math.sign(ey);step=0}}
  }
}
function hgtlfTick(dt){
  const S=HGTLF.S;if(!S)return;const P=G.P||{x:0,y:0},px=P.x,py=P.y;
  for(const a of HGTLF.ag){
    const ddx=a.x-px,ddy=a.y-py;
    if(ddx*ddx+ddy*ddy>1600){a.acc+=dt;if(a.acc<.3)continue;var d=a.acc;a.acc=0}else d=dt;
    try{hgtlfStep(a,S,d,px,py)}catch(e){console.error(e);a.state='wait';a.t=5;a.path=null}
    // the picture rides the step it is on, with an eased height so a stair is climbed and not jumped
    const j=Math.floor(a.x+.5),k=Math.floor(a.y+.5),tg=S.h[Math.max(0,Math.min(S.H-1,k))*S.W+Math.max(0,Math.min(S.W-1,j))];
    a.hz+=(tg-a.hz)*Math.min(1,dt*10);a.stub.x=j;a.stub.y=k;
  }
}
/* ---------- drawing ---------- */
function hgtlfFlip(k){let c=HGTLF.flipC[k];if(c)return c;const im=IMG[k];if(!im)return null;c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(im.width,0);x.scale(-1,1);x.drawImage(im,0,0);return HGTLF.flipC[k]=c}
function hgtlfFrames(a,mode){
  let c=a.fc[mode];if(c)return c;
  const find=()=>{const sp=a.sp,e=sp.frames&&sp.frames[mode],P=HGTLF.poses[a.k]&&HGTLF.poses[a.k][mode];
    for(const L of [e,P]){if(L&&L.length&&L.every(k=>IMG[k]))return L.slice()}
    const o=[];for(let i=0;i<8;i++){const k=a.k+'_'+mode+i;if(IMG[k])o.push(k);else break}return o.length?o:null};
  c=find();
  if(!c){if(mode==='walk'||mode==='idle')c=a.frames;else c=hgtlfFrames(a,'walk')}
  return a.fc[mode]=c;
}
function hgtlfSprites(out){
  if(HGTLF.lv!==LEVEL||HGTLF.grid!==G.grid)hgtlfEnter();
  if(!HGTLF.ag.length||G.state!=='play')return;
  HGTLF.night=hgtlfNight();
  const t=G.time||0;let dt=t-HGTLF.last;HGTLF.last=t;if(dt<0)dt=0;if(dt>.1)dt=.1;
  if(dt>0)hgtlfTick(dt);
  const S=HGTLF.S,cam=G.C||{x:0,y:0},sp=G._spr,dX=sp?sp[2]:1,dY=sp?sp[3]:0;
  for(const a of HGTLF.ag){
    if(!a.vis)continue;const rx=a.x-cam.x,ry=a.y-cam.y;if(rx*rx+ry*ry>900)continue;
    const moving=a.state==='move',mode=moving?'walk':a.task==='wander'?'walk':a.task==='sit'&&a.kind==='creature'?'walk':a.task;
    const fr=hgtlfFrames(a,mode),n=fr.length,key=fr[n>1?((t*(moving?6:3)+a.seed*7)|0)%n:0],base=IMG[key];if(!base)continue;
    let img=base,flip=false;
    if(a.kind==='npc'){
      if(a.task==='clean'&&!moving)flip=(((t/1.4+a.seed)|0)&1)===1;
      else if(!moving&&(a.task==='sit'||a.task==='read'||a.task==='fish'||a.task==='watch'))flip=((a.seed*7|0)&1)===1; // someone sitting or watching keeps facing one way: no glancing about, no mirror swaps
      else if(moving)flip=(((t*.9+a.seed)|0)&1)===1;
      else if(!moving&&a.task!=='clean'&&a.task!=='watch')flip=(((t/(5+a.seed%4)+a.seed)|0)&1)===1; // an idle figure glances the other way now and then // a walking figure swaps its mirror image with each step
    }else{if(a.flipDir&&(a.dx||a.dy))flip=(-dY*a.dx+dX*a.dy)>0;if(moving&&!a.hover)flip=flip!==((((t*1.0+a.seed)|0)&1)===1)} // a walking pet also swaps its mirror image with each stride
    const pdx=(G.P?G.P.x:cam.x)-a.x,pdy=(G.P?G.P.y:cam.y)-a.y,pd2=pdx*pdx+pdy*pdy,near=!moving&&pd2<20; // standing still and the party is within four cells: turn to face it
    if(near&&a.kind==='creature'&&a.flipDir)flip=(-dY*Math.sign(pdx)+dX*Math.sign(pdy))>0;
    else if(near&&a.kind==='npc'&&a.task!=='clean'&&a.task!=='read'&&a.task!=='fish')flip=(-dY*Math.sign(pdx)+dX*Math.sign(pdy))>0&&false;
    if(flip)img=hgtlfFlip(key)||base;
    let bob=a.hz-S.h[Math.max(0,Math.min(S.H-1,Math.floor(a.y+.5)))*S.W+Math.max(0,Math.min(S.W-1,Math.floor(a.x+.5)))]+a.hover;
    if(a.kind==='creature'){bob+=a.hover?Math.sin(t*(moving?1.6:.9)+a.seed*3)*(moving?.07:.06):moving?Math.abs(Math.sin(t*2.6+a.seed))*.06:0}
    else if(moving)bob+=Math.abs(Math.sin(t*2.6+a.seed))*.04;
    else if(a.task==='clean')bob+=Math.abs(Math.sin(t*2.2+a.seed))*.02;
    else if(a.task==='tend')bob-=.035*(.5+.5*Math.sin(t*1.3+a.seed));
    else bob+=Math.sin(t*1.1+a.seed)*.008;
    if(near&&a.hover)bob+=.12*(1-pd2/20); // a hovering pet rises a little when the party comes close
    const night=HGTLF.night,lift=Math.max(a.glow?.4+.45*night:0,.64*night);
    // walk cycle without new pictures: a squash and stretch in step with the bob, and a gentle sway across the view
    const ph=t*(a.kind==='creature'?2.8:2.6)+a.seed*3,rx2=-dY,ry2=dX;let lunge,sway;
    if(moving){lunge=-.3*Math.cos(2*ph);sway=Math.sin(ph)*.06}
    else{lunge=.09*Math.sin(t*.8+a.seed*2);sway=a.hover?Math.sin(t*.55+a.seed)*.04:a.task==='clean'?Math.sin(t*2.2+a.seed)*.04:Math.sin(t*.45+a.seed)*.02}
    if(a.hover&&a.kind==='creature')lunge=.55*Math.sin(t*(moving?4.5:2.2)+a.seed*2); // hovering pets beat their fins: the width pulses
    const o={x:a.x+.5+rx2*sway,y:a.y+.5+ry2*sway,img,w:a.h*img.width/img.height,bob,lunge,decor:a.stub};if(lift>0)o.lift=lift;out.push(o);
  }
}
/* ---------- taps and bumps ---------- */
function hgtlfLine(a){const L=a.lines;a.li=((a.li===undefined?(a.id*7)%L.length:a.li+1))%L.length;return L[a.li]}
function hgtlfTalk(a){
  const line=hgtlfLine(a);
  if(a.kind==='creature'){msg(line,'#c8d8e8');return}
  const lv=typeof hgLvl==='function'?hgLvl():4,said=lv>=4?line:hgGarble(line,lv)+hgFoot(lv); // until all four books are in, the people of the grassland are heard as gibberish
  G.talk={d:a.stub,n:{name:a.name},node:(typeof hgAskAdd==='function'&&lv<4?hgAskAdd(say(said,[BYE])):say(said,[BYE])),t:G.time,btns:[]};G.hold=null;G.queued=null;
}
function hgtlfBump(rel){
  if(!HGTLF.ag.length||G.state!=='play'||!G.P)return false;
  const dir=DIRS[(G.P.f+rel)%4],nx=G.P.x+dir[0],ny=G.P.y+dir[1];
  for(const a of HGTLF.ag){if(!a.vis||Math.floor(a.x+.5)!==nx||Math.floor(a.y+.5)!==ny)continue;
    if(G.time-a.bumpT>1.6){a.bumpT=G.time;sfx('bump');hgtlfTalk(a);return true}return false} // the first step stops, the next one passes through
  return false;
}
{const _s=startTalk;startTalk=function(d){if(d&&d.hgtlf){hgtlfTalk(d.hgtlf);return}return _s.apply(this,arguments)}}
{const _m=doMove;doMove=function(rel){try{if(hgtlfBump(rel))return}catch(e){console.error(e)}return _m.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(){HGTLF.ag=[];HGTLF.lv=-1;return _g.apply(this,arguments)}}
{const _p=petSprites;petSprites=function(out){_p.apply(this,arguments);try{hgtlfSprites(out)}catch(e){if(!HGTLF._err){HGTLF._err=1;console.error(e)}}}}
