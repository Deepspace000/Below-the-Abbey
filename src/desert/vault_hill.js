/* ==========================================================================
   THE BARROW HILL (level 9670, rated 88; prefix vt / VTH). The outside of the Vault of Maldrake: a big blighted hill of barrows beside the Blighted Road, 64 by 56, under a grey-green mist.
   The road runs east to west along the south (gates in both ends of the boundary lead to Lanternrest and to Hollowbell Abbey); a path winds up the hill in switchbacks between barrows and leaning stones
   to a terrace under the hill, where the front of the Vault stands with a dark door. At the foot of the hill, by the road, is the Garrison's picket: tents, a fire, a wrecked cart, a stone for teleporting,
   and Sergeant Hale of Oldhaven, who gives the quests. South of the road lie the ruins of Underhill, the village the hill belonged to.
   The ground is a gentle slope made with the engine's terrain (heights), the road level at the foot and the terrace at the top.
   ========================================================================== */
const VTH={W:64,H:56,road:{y0:44,y1:46},gateW:{x:1,y:45},gateE:{x:62,y:45},path:[[34,43],[34,37],[46,37],[46,30],[22,30],[22,23],[34,23],[34,13]],front:{x:34,y:12},hale:{x:30,y:41},tele:{x:37,y:42}};
VT.arrive={east:{x:60,y:45,f:3},west:{x:3,y:45,f:1}};VT.hillBack={x:34,y:13,f:2};
/* a floor made from another one with the colour drawn out of it, so that the grass is sick, not lush */
function vtFloorSick(out,src,gain,tint,sat){
  if(FLOORS[out])return out;const b=FLOORS[src];if(!b)return src;const d=new Uint8ClampedArray(b.length);
  for(let i=0;i<d.length;i+=4){const l=b[i]*.3+b[i+1]*.59+b[i+2]*.11;d[i]=Math.min(255,(l+(b[i]-l)*sat)*gain*tint[0]);d[i+1]=Math.min(255,(l+(b[i+1]-l)*sat)*gain*tint[1]);d[i+2]=Math.min(255,(l+(b[i+2]-l)*sat)*gain*tint[2]);d[i+3]=255}
  FLOORS[out]=d;return out}
function vtHillFloors(){
  const dead=vtFloorSick('vtf_dead','gyf_grass',.72,[1.05,1.02,.74],.22),mud=vtFloorSick('vtf_mud','gyf_dirt',.82,[1,.98,.84],.5),grav=vtFloorSick('vtf_grav','gyf_gravel',.9,[.98,1,1.02],.4),
    flag=vtFloorSick('vtf_flag','gyf_flag',.6,[.92,.97,1.04],.5),road=vtFloorSick('vtf_road','gyf_cobble',.74,[1,.98,.88],.4),rub=vtFloorSick('vtf_rub','gyf_slate',.78,[.92,.96,1],.5);
  return [dead,mud,grav,flag,road,rub]}
const VTH_SIGNS=[
 ['THE BARROW HILL','Closed by order of the Garrison at Lanternrest. The dead are up. Go round.'],
 ['WEST: HOLLOWBELL ABBEY','EAST: LANTERNREST. If you can read this, you are still on the Road.'],
 ['UNDERHILL','Twelve households. A good well. Mind the hill.'],
 ['OLDHAVEN GARRISON, FORWARD PICKET','Halt. State your business. If your business is dying, wait your turn.'],
 ['THE VAULT OF MALDRAKE','Barrow-wizard of Underhill, and a good one. Knock, and wait.'],
 ['KEEP TO THE PATH','The hill does not like visitors. Neither does what lives in it.'],
 ["FOUR OF HALE'S MEN",'Allin, Brook, Denny and Price, of the Oldhaven garrison. A helmet hangs on each cross, hung straight. They were sent to find out why the dead walked.'],
 ['UNDERHILL HARVEST FAIR',"Pig racing, a pie contest and the vicar's hat toss. Cancelled this year, on account of the fever. Somebody has written underneath: Next year."]];
/* one tile of the front (0 left, 1 door, 2 right), like a tomb front of the graveyard (gyTombTile) but with the name plaque drawn mirrored: the engine turns the texture of a north-facing wall round, so mirrored text reads right */
function vtFrontTile(st,i){
  const pf=true,mild=st.rgb.map(v=>1+(v-1)*.35);
  return gyTile(st.tex,3.4,{fac:{img:st.img,i,n:3,fit:pf},gain:1.0,rgb:mild,tag:'vtfront'+i,draw:(x,w,h)=>{
    const G=['#2a5a26','#3b7f31','#58a03e','#244c24','#6fb04a'],hs=(a,b,c)=>hash2(a,b,c+9670*3+i*11);
    const nv=Math.round(st.ivy/9);
    for(let k=0;k<nv;k++){const edge=i===0?hs(k,1,1)*.55:i===2?1-hs(k,1,1)*.55:hs(k,1,1),px=edge*w,top=hs(k,2,1)<.5,len=h*(top?(.08+hs(k,3,1)*.28):(.1+hs(k,3,1)*.3));
      let qx=px,qy=top?0:h;x.strokeStyle='#27481f';x.lineWidth=1.3+hs(k,4,1)*1.4;x.beginPath();x.moveTo(qx,qy);
      for(let t=1;t<=6;t++){qx+=(hs(k,t+5,2)-.5)*8;qy+=(top?1:-1)*len/6;x.lineTo(qx,qy)}x.stroke();
      for(let t=0;t<7;t++){x.fillStyle=G[(hs(k,t+9,3)*5)|0];x.beginPath();x.ellipse(px+(hs(k,t+20,4)-.5)*12,top?len*t/7:h-len*t/7,2.5+hs(k,t+30,5)*3.5,2+hs(k,t+40,5)*2,hs(k,t+50,6)*3,0,6.3);x.fill()}}
    if(i===1){const pw=84,ph=17,px=(w-pw)/2,py=h*.905;x.save();x.translate(w,0);x.scale(-1,1);
      x.fillStyle='#24211d';x.fillRect(px,py,pw,ph);x.strokeStyle='#9a8858';x.lineWidth=1.4;x.strokeRect(px+1.5,py+1.5,pw-3,ph-3);
      x.fillStyle='#e0d08e';x.font='bold 12px '+(typeof FTITLE!=='undefined'?FTITLE:'serif');x.textAlign='center';x.textBaseline='middle';x.fillText(st.pl,w/2,py+ph/2+.5);x.restore()}}})}
function vtHillBuild(){
  if(LEVELS[VT.ID])return LEVELS[VT.ID];
  gyAlias();vtPics();
  const W=VTH.W,H=VTH.H,hs=(a,b,c)=>hash2(a,b,c+9670),R=gyRng(96700);
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chMap.set(gid,c);chars[c]=gid}return c};
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const block=new Uint8Array(W*H),fm=new Array(W*H).fill('0'),hgt=new Float32Array(W*H).fill(.3),rk=new Float32Array(W*H);
  const solid=(x,y,c)=>{rows[y][x]=c;block[y*W+x]=1};
  const decor=[],enemies=[],lights=[],used=new Set(),path=new Set(),lcol={};
  const inside=(x,y)=>x>=2&&x<=61&&y>=13&&y<=53;
  const isOpen=(x,y)=>inside(x,y)&&rows[y][x]==='.';
  const free=(x,y)=>isOpen(x,y)&&!used.has(x+','+y);
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<W&&y<H)fm[y*W+x]=f};
  const pth=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){path.add(x+','+y);fm[y*W+x]=f||'2'}};
  const dec=(a,x,y,o)=>{o=o||{};const k=GYA[a]?'gy_'+a:a;if(!isOpen(x,y))return null;
    if(used.has(x+','+y)){const j=decor.findIndex(q=>q.x===x&&q.y===y);if(j>=0){if(decor[j].npc)return null;decor.splice(j,1)}}   // a piece put there on purpose takes the place of scenery that was scattered
    const d={k,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}
    if(o.block&&o.npc)d.solid=1;if(o.sc)d.sc=o.sc;if(o.npc){d.npc=o.npc;d.deco=false}if(o.i!==undefined)d.i=o.i;if(o.wd)d.wd=o.wd;if(o.txt)d.txt=o.txt;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy}decor.push(d);used.add(x+','+y);return d};
  const D=(a,x,y,o)=>free(x,y)&&!path.has(x+','+y)?dec(a,x,y,o):null,DB=(a,x,y,o)=>D(a,x,y,Object.assign({block:true},o||{}));
  const foe=(t,x,y)=>{if(!free(x,y))return false;enemies.push({t,x,y,lvl:88});used.add(x+','+y);return true};
  const lamp=(x,y,col)=>{if(isOpen(x,y)){lights.push([x,y]);if(col)lcol[x+','+y]=col}};
  const PALE=[.72,1.12,.9];
  // ---- the ground: dead grass, mud, the road, the path, the terrace ----
  setF(0,0,W-1,H-1,'0');
  pth(2,VTH.road.y0,61,VTH.road.y1,'4');
  for(let i=1;i<VTH.path.length;i++){const [a,b]=VTH.path[i-1],[c,d]=VTH.path[i];pth(Math.min(a,c),Math.min(b,d),Math.max(a,c)+(a===c?1:0),Math.max(b,d)+(b===d?1:0),'2')}
  pth(26,13,42,17,'3');   // the terrace under the front
  setF(22,37,32,43,'1');setF(4,47,24,53,'1');   // bare earth at the picket and in Underhill
  // ---- the heights: level at the road, rising in a long slope to the terrace; rolling a little between the paths ----
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,t=Math.max(0,Math.min(1,(44-y)/31)),s=t*t*(3-2*t);hgt[i]=.3+1.25*s+((hs(x>>1,y>>1,1)-.5)*.08+Math.sin(x*.45+y*.3)*.035)*s}
  for(const k of path){const [x,y]=k.split(',').map(Number);if(y<44){const i=y*W+x;let a=0,n=0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*W+(x+dx);if(j>=0&&j<W*H){a+=hgt[j];n++}}hgt[i]=Math.min(hgt[i],a/n)}}   // a path is worn a little lower than the ground beside it
  for(const [x0,y0,x1,y1] of [[22,37,32,43],[26,13,42,17],[2,44,61,46]]){let m=0,n=0;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){m+=hgt[y*W+x];n++}m/=n;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)hgt[y*W+x]=m}
  // ---- the boundary: the hillside above, a bank of dark thorn and old bark all round, the two road gates, the front of the Vault ----
  const wallH=2.1,wt=v=>ch((typeof wwTile==='function'&&IMG.tex_1)?wwTile(['tex_1','tex_2','tex_1'][v%3],2.6,{gain:.55}):gyTile('texBlack_'+(v%6),wallH,{gain:.7})),WC=[0,0,0,1,3,5,0,3,2].map(wt);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(inside(x,y))continue;solid(x,y,WC[(hs(x,y,7)*WC.length)|0])}
  for(const [dir,g] of [['west',VTH.gateW],['east',VTH.gateE]]){
    const gid=gyTile('texBlack_1',2.6,{fac:{img:'stairFix_2',i:0,n:1},gain:.9,rgb:[1.1,1.1,1.05],tag:'vtroadgate'+dir,draw:(x,w,h)=>{if(dir==='east'){x.translate(w,0);x.scale(-1,1)}   // seen looking east the engine turns a wall's texture round, so the east gate's lettering is drawn mirrored
      x.fillStyle='#24211d';x.fillRect(14,h*.2,100,22);x.strokeStyle='#9a8858';x.lineWidth=1.4;x.strokeRect(15.5,h*.2+1.5,97,19);
      x.fillStyle='#e0d08e';x.font='bold 10px '+(typeof FTITLE!=='undefined'?FTITLE:'serif');x.textAlign='center';x.textBaseline='middle';x.fillText(dir==='east'?'LANTERNREST':'HOLLOWBELL',64,h*.2+11.5)}});KH_DOOR[gid]={vt:'road',dir};rows[g.y][g.x]=ch(gid);block[g.y*W+g.x]=1}
  for(const [x,y] of [[3,43],[3,47],[60,43],[60,47]]){dec('lantern',x,y,{block:true});lamp(x,y,[1.15,1.0,.7])}
  for(const [x,y,t] of [[4,44,0],[59,44,1]]){}
  // the front of the Vault, three tiles wide in the hillside under the terrace, with wings of ivy-grown stone, statues and lanterns
  {const st={tex:'texBlack_1',rgb:[1.25,1.25,1.4],img:'f_vault',ivy:34,pl:'MALDRAKE'},T={id:9670},lg=vtFrontTile(st,0),dg=vtFrontTile(st,1),rg=vtFrontTile(st,2),fy=VTH.front.y;
   KH_DOOR[dg]={vt:'stair',lvl:9671,get at(){vtMake(9671);return LEVELS[9671].start}};
   for(const [x,t] of [[33,lg],[34,dg],[35,rg]]){rows[fy][x]=ch(t);block[fy*W+x]=1}
   for(const x of [28,29,30,31,32,36,37,38,39,40]){const gid=gyTile('texGrey_'+[0,3,5][x%3],3.0,{gain:.8,tag:'vtwing'+x});rows[fy][x]=ch(gid);block[fy*W+x]=1}
   dec('angel',31,13,{block:true,sc:.95});dec('angel',37,13,{block:true,sc:.95});dec('lantern',33,13,{block:true});dec('lantern',35,13,{block:true});lamp(34,13,[.8,1.1,1.5]);lamp(34,15,[.8,1.1,1.5]);
   dec('urn',30,13,{block:true,sc:.9});dec('urn',38,13,{block:true,sc:.9});dec('obelisk',28,14,{block:true,sc:.8});dec('obelisk',40,14,{block:true,sc:.8});
   for(const x of [29,32,36,39])lamp(x,13,[.7,1.05,1.4]);
   dec('ww_sign',32,15,{block:true,npc:'vto_sign',i:4});dec('bench',31,16,{block:false,sc:.8});dec('bench',37,16,{block:false,sc:.8});dec('rose',33,16,{sc:.5});dec('rose',35,16,{sc:.5})}
  // ---- the picket of the Oldhaven garrison, at the foot of the hill: two tents, a fire, barrels, a wrecked cart, the stone for teleporting, Hale ----
  {dec('yar_tent',25,40,{block:true,sc:1.3});dec('yar_tent',31,38,{block:true,sc:1.3});dec('brazier2',28,42,{block:true,sc:1});lamp(28,41,[1.6,1.0,.5]);dec('brazier0',34,38,{block:false});
   dec('barrel',24,43,{block:true,sc:.9});dec('barrel',25,43,{block:true,sc:.9});dec('crate',26,43,{block:true,sc:.9});dec('sacks',23,41,{block:false,sc:.9});
   dec('cart',31,42,{block:true,sc:1.3,npc:'vto_cart'});for(const [x,y] of [[32,43],[30,43]])dec('bones',x,y,{sc:.8});
   dec('banner',27,38,{block:true,sc:.9,npc:'vto_banner'});dec('ww_sign',33,44,{block:true,npc:'vto_sign',i:3});
   dec('bench',27,41,{block:false,sc:.8});
   const kp=KH_KEEPERS.vto_hale;if(kp){const d=dec(khFaceKey(kp.face),VTH.hale.x,VTH.hale.y,{block:false,npc:'vto_hale'});if(d)d.sc=kp.sc||1.05}
   const kw=KH_KEEPERS.vto_wick;if(kw){const d=dec(khFaceKey(kw.face),26,42,{block:false,npc:'vto_wick'});if(d)d.sc=kw.sc||1}
   lamp(30,40,[1.4,1.0,.6]);lamp(25,42,[1.4,1.0,.6]);
   for(const y of [37,39,41,43])dec('wcross',20,y,{block:true,sc:.95,npc:'vto_sign',i:6});lamp(20,40,[1.3,1.0,.7])}
  // ---- the road: signs, milestones, lanterns, the plague cart and its horse (which is a skeleton) ----
  dec('ww_sign',6,43,{block:true,npc:'vto_sign',i:1});dec('ww_sign',57,47,{block:true,npc:'vto_sign',i:1});dec('ww_sign',34,42,{block:true,npc:'vto_sign',i:0});
  for(let x=8;x<=58;x+=9){for(const y of [43,47]){if(free(x,y)&&!path.has(x+','+y)){DB('lantern',x,y);lamp(x,y,[.8,1.05,.8])}}}
  dec('cart',47,47,{block:true,sc:1.2,npc:'vto_plaguecart'});for(const [x,y] of [[46,48],[48,48],[47,48],[49,47]])dec('bones',x,y,{sc:.8});dec('sacks',45,47,{block:false,sc:.8});
  // ---- the hill: barrows, stones, dead trees, lanterns along the path ----
  const BARR=[[40,35,'hatch'],[28,35,'mound'],[52,34,'hatch'],[40,28,'mound'],[28,27,'hatch'],[16,27,'mound'],[50,22,'hatch'],[14,22,'hatch'],[44,18,'mound'],[22,18,'hatch'],[10,30,'mound'],[56,29,'hatch'],[52,16,'mound'],[16,15,'hatch']];
  BARR.forEach(([x,y,k],i)=>{const d=DB(k,x,y,{sc:k==='hatch'?1.5:1.4,npc:'vto_barrow',i});if(d){lamp(x,y+1,[.72,1.1,.86])}});
  for(let k=1;k<VTH.path.length;k++){const [a,b]=VTH.path[k-1],[c,d]=VTH.path[k],len=Math.abs(a-c)+Math.abs(b-d);for(let t=3;t<len;t+=6){const x=a+Math.sign(c-a)*t,y=b+Math.sign(d-b)*t;const ox=a===c?-1:0,oy=b===d?-1:0;if(free(x+ox,y+oy)&&!path.has((x+ox)+','+(y+oy))){DB('lantern',x+ox,y+oy);lamp(x+ox,y+oy,PALE)}}}
  for(let n=0;n<70;n++){const x=3+((hs(n,1,11)*58)|0),y=14+((hs(n,2,11)*38)|0);if(!free(x,y)||path.has(x+','+y)||(y>=44&&y<=46))continue;const r=hs(n,3,11);
    if(r<.5)DB('lean',x,y,{sc:.9+hs(n,4,11)*.3});else if(r<.75)DB('stone1',x,y,{sc:.95});else if(r<.88)DB('wcross',x,y,{sc:.95});else DB('slab',x,y,{sc:.95})}
  const TR=['dead','ltree2'];for(let n=0;n<190;n++){const x=2+((hs(n,1,12)*60)|0),y=13+((hs(n,2,12)*41)|0);if(!free(x,y)||path.has(x+','+y)||(y>=43&&y<=47))continue;if(Math.abs(x-VTH.hale.x)<9&&y>=36)continue;DB(TR[hs(n,3,12)<.7?0:1],x,y,{sc:.85+hs(n,4,12)*.45})}
  for(let n=0;n<24;n++){const x=3+((hs(n,1,13)*58)|0),y=14+((hs(n,2,13)*38)|0);if(free(x,y)&&!path.has(x+','+y))DB('rpost',x,y)}
  for(let n=0;n<22;n++){const x=3+((hs(n,1,14)*58)|0),y=14+((hs(n,2,14)*38)|0);if(free(x,y)&&!path.has(x+','+y))D('bones',x,y,{sc:.8})}
  for(const [x,y] of [[24,16],[44,15],[30,19],[38,19]])D('dead',x,y,{block:true,sc:1.1});
  // a ring of standing stones north west of the path
  for(let a=0;a<8;a++){const x=Math.round(14+Math.cos(a*.785)*4),y=Math.round(36+Math.sin(a*.785)*4);DB(a%2?'column':'obelisk',x,y,{sc:.75})}
  // dead tufts: the grass here is brown, and what is left of it stands in clumps
  {const GR=['pgrass0','pgrass1','pgrass2','pbracken'].filter(k=>IMG[k]);if(GR.length)for(let n=0;n<340;n++){const x=3+((hs(n,1,29)*58)|0),y=14+((hs(n,2,29)*39)|0);if(path.has(x+','+y))continue;const k=GR[(hs(n,3,29)*GR.length)|0],d=D(k,x,y,{block:false,sc:.6+hs(n,4,29)*.7});if(d){d.ox=(hs(n,5,29)-.5)*.7;d.oy=(hs(n,6,29)-.5)*.7}}}
  // ---- Underhill, south of the road: a ruined chapel, three cottages, the well, broken fences ----
  {dec('chapel',14,50,{block:true,npc:'vto_chapel'});dec('hut',7,49,{block:true,npc:'vto_hut',i:0});dec('hut',21,50,{block:true,npc:'vto_hut',i:1});dec('hut',27,50,{block:true,npc:'vto_hut',i:2});
   dec('ww_well',34,51,{block:true,npc:'vto_well'});dec('ww_sign',10,48,{block:true,npc:'vto_sign',i:2});dec('ww_sign',24,48,{block:true,npc:'vto_sign',i:7});
   for(const x of [5,6,8,9,17,18,19,23,24,25,29,30])D('fence',x,53,{block:true,sc:.9});for(const [x,y] of [[12,49],[16,49],[20,52],[26,52]])D('lean',x,y,{block:true});
   for(const [x,y] of [[10,50],[18,52],[30,52],[34,49]])lamp(x,y,[.75,1.0,.8]);for(const [x,y] of [[8,51],[22,52],[32,50]])D('bones',x,y,{sc:.8});
   dec('chest',36,52,{block:true});dec('chest',5,52,{block:true})}
  // ---- the dead: skeletons and ghouls on the terraces, wraiths by the stones, hounds on the road, ravens everywhere ----
  const FOES=[['gyskel',38,36],['gyskel',30,33],['gyskel',44,32],['gyskel',26,29],['gyskel',36,25],['gyskel',16,25],['gyghoul',50,30],['gyghoul',20,27],['gyghoul',30,21],['gyghoul',12,33],['gyghoul',42,20],
    ['gyzombie',48,25],['gyzombie',32,29],['gyzombie',24,21],['gyzombie',40,22],['gywraith',16,37],['gywraith',50,19],['gywraith',26,15],['gyhound',54,44],['gyhound',12,45],['gyraven',36,32],['gyraven',20,19],['gyraven',48,36],['gypike',34,18],['gypike',30,17],['gybmage',38,17],
    ['gyskel',40,47],['gyghoul',55,48],['gyzombie',16,48]];
  for(const [t,x,y] of FOES){if(!foe(t,x,y)){let ok=false;for(let r=1;r<4&&!ok;r++)for(let a=-r;a<=r&&!ok;a++)for(let b=-r;b<=r&&!ok;b++)if(Math.max(Math.abs(a),Math.abs(b))===r&&!path.has((x+a)+','+(y+b)))ok=foe(t,x+a,y+b)}}
  // ---- the level ----
  const rowsS=[],fmS=[];for(let y=0;y<H;y++){rowsS.push(rows[y].join(''));let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmS.push(s)}
  const mapNames=[{t:'The Road to Lanternrest',x:58,y:45,k:'place'},{t:'The Road to Hollowbell Abbey',x:5,y:45,k:'place'},{t:"The Garrison's Picket",x:29,y:40,k:'place'},{t:'Underhill, a ruined village',x:16,y:50,k:'place'},{t:'The Barrow Path',x:40,y:37,k:'place'},{t:'The Standing Stones',x:14,y:36,k:'place'},{t:'The Barrows',x:28,y:27,k:'place'},{t:'The Door of the Vault',x:34,y:14,k:'place'}];
  const fl=vtHillFloors();
  const lv={rows:rowsS,chars,fmap:fmS,floorSet:fl,floor:fl[0],ceil:'cloud',start:{x:VT.arrive.west.x,y:VT.arrive.west.y,f:VT.arrive.west.f},enemies,items:[],decor,lights,portals:[],day:.58,outdoor:true,amb:.86,
    name:VT.NAMES[9670],label:VT.NAMES[9670],noExtras:true,diff:88,ceilH:5.2,tele:{x:VTH.tele.x,y:VTH.tele.y},teleName:'The Barrow Hill',torchGap:1e9,mapNames,
    _vt:{kind:'hill',lcol,col:PALE,kI:1.2,range2:90,locks:{},traps:[]}};
  LEVELS[VT.ID]=lv;
  {for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]!=='.')block[y*W+x]=1;try{TERRS[VT.ID]=yarTerrain(W,H,hgt,rk,block)}catch(e){console.error(e)}}
  // ---- check: everything that can be walked to can be reached from the road; a piece that walls something in is taken away ----
  {const D4=[[1,0],[-1,0],[0,1],[0,-1]];const st={x:VT.arrive.west.x,y:VT.arrive.west.y};
   for(let pass=0;pass<6;pass++){const bs=new Set();for(const d of decor)if(d.block)bs.add(d.x+','+d.y);const seen=new Uint8Array(W*H),q=[st.y*W+st.x];seen[q[0]]=1;
     for(let i=0;i<q.length;i++){const c=q[i],x=c%W,y=(c/W)|0;for(const [a,b] of D4){const nx=x+a,ny=y+b;if(nx<2||ny<13||nx>61||ny>53||rows[ny][nx]!=='.'||seen[ny*W+nx]||bs.has(nx+','+ny))continue;seen[ny*W+nx]=1;q.push(ny*W+nx)}}
     const kill=new Set();for(let y=13;y<=53;y++)for(let x=2;x<=61;x++)if(rows[y][x]==='.'&&!seen[y*W+x]&&!bs.has(x+','+y))for(const [a,b] of D4){const k=(x+a)+','+(y+b);if(bs.has(k))kill.add(k)}
     if(!kill.size)break;for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(d.block&&kill.has(d.x+','+d.y)&&!d.npc)decor.splice(i,1)}}}
  return lv}
KH_LAZY[VT.ID]=vtHillBuild;
