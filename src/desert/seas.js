/* ==========================================================================
   THE ISLANDS OF THE VAAST SEA. Five small outdoor levels on the same sea-ground as Yarrim: a heightfield with water painted
   on it, an island that rises out of it, a pier with the Dawn Walker moored at the end, and whatever the story put there.
     300 Saltbarrow (pirates)  301 The Isle of Bells (a drowned abbey)  302 Cinder Isle (a volcano)  303 Last Light (a ruined beacon)
     304 Oldhaven Quay (the harbour of the king's city, where this part of the story ends)
   ========================================================================== */
const yarSea=n=>n===290||(n>=300&&n<=304)||(n>=320&&n<=323)||(n>=330&&n<=349)||(n>=400&&n<=423)||n===430||n===431;
const SEA_TINT={305:[.96,.93,.88],300:[1.05,.98,.9],301:[.8,.9,.82],302:[.55,.5,.52],303:[.85,.88,.96],304:[.96,.93,.88]};
/* the ground of every island is yellow sand: the gold-sand paving washed pale, and a darker one for the rocky slopes */
function isleFloors(){
  if(FLOORS.isleSand)return;const base=FLOORS.goldsand||FLOORS.sand;if(!base)return;
  const mk=(r,g,b,a)=>{const d=new base.constructor(base.length);for(let i=0;i<base.length;i+=4){d[i]=base[i]*(1-a)+r*a;d[i+1]=base[i+1]*(1-a)+g*a;d[i+2]=base[i+2]*(1-a)+b*a;d[i+3]=base[i+3]}return d};
  FLOORS.isleSand=mk(236,214,140,.55);FLOORS.isleSandDk=mk(206,176,104,.55);
  // the edge of the grass: green with sand worked through it in ragged patches (the sines have whole periods, so the tile joins its neighbours)
  const gr=FLOORS.lush,sd=FLOORS.isleSand;
  if(gr){const n=Math.round(Math.sqrt(base.length/4)),e=new base.constructor(base.length),P=Math.PI*2/n;
    for(let y=0;y<n;y++)for(let x=0;x<n;x++){
      const v=Math.sin(x*P*2+Math.sin(y*P*3)*1.6)*.5+Math.sin(y*P*3+Math.sin(x*P*2)*1.4)*.4+Math.sin((x+y)*P*5)*.3+Math.sin((x-2*y)*P*7)*.18,m=Math.max(0,Math.min(1,.5+v*1.3)),i=(y*n+x)*4;
      for(let c=0;c<3;c++)e[i+c]=gr[i+c]*m+sd[i+c]*(1-m);e[i+3]=255}
    FLOORS.isleGrassEdge=e}
}
// a bare island is not one flat colour: ragged patches of its own ground (black ash, white sand, red earth, grey rock) lie over the sand
function isleBarePatch(W,H,fm,h,seed,cx,cy,rx,ry,cov){
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;if(fm[i]!=='0'||h[i]<.2)continue;
    const d=Math.hypot((x-cx)/rx,(y-cy)/ry);if(d>.9)continue;
    const n=tsmooth(x/9,y/9,seed+60)*.55+tsmooth(x/3.5,y/3.5,seed+61)*.3+tsmooth(x/1.6,y/1.6,seed+62)*.15;
    if(n+(.9-d)*.5>1.05-cov*.7)fm[i]='5';
  }
}
// things lying about on the beach and inland: driftwood, shells, crabs, rocks, tufts of sea-grass, in clusters, never in a bare sheet
function isleBeachProps(W,H,fm,h,block,rows,used,scenery,seed,cx,cy,dens,keep){
  const kinds=['yar_driftwood','yar_shells','uw_rocks','uw_seagrass','yar_crab','uw_seagrass','yar_shells','uw_rocks'];
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){
    const i=y*W+x;if(block[i]||rows[y][x]!=='.'||h[i]<.1||used.has(x+','+y)||fm[i]==='2')continue;
    if(keep&&Math.hypot(x-keep[0],y-keep[1])<4)continue;
    const cl=tsmooth(x/6,y/6,seed+70);if(cl<.45)continue;
    const r=hash2(x,y,seed+71);if(r>dens*(.4+cl))continue;
    const k=kinds[(hash2(x,y,seed+72)*kinds.length)|0];if(!IMG[k])continue;
    const small=k==='uw_rocks'?.45:k==='uw_seagrass'?.8:.8;
    scenery.push({k,wx:x+.5+(hash2(x,y,seed+73)-.5)*.7,wy:y+.5+(hash2(x,y,seed+74)-.5)*.7,sc:small*(.7+hash2(x,y,seed+75)*.7),decor:{k,walk:true,x,y}});
  }
}
// the grass of an island, as a map: well inside the island, never near the sea, ragged at the edges; then a ring of the edge floor ('5') round it
function isleGrassMap(W,H,fm,h,seed,GR,cx,cy,rx,ry){
  const g=new Uint8Array(W*H);if(GR<=0)return g;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x;if(fm[i]!=='0'||h[i]<.2)continue;
    const d=Math.hypot((x-cx)/rx,(y-cy)/ry);if(d>.8)continue;   // the outer fifth of the island is beach
    const n=tsmooth(x/10,y/10,seed+30)*.5+tsmooth(x/4.5,y/4.5,seed+31)*.32+tsmooth(x/2,y/2,seed+32)*.18;
    if(n+(.62-d)*1.1>1.0-GR*.5)g[i]=1;
  }
  const ring=new Uint8Array(W*H);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){
    const i=y*W+x;
    let near=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const k=(y+dy)*W+x+dx;if(k>=0&&k<W*H&&g[k])near++}
    if(g[i]){let edge=false;for(let dy=-2;dy<=2&&!edge;dy++)for(let dx=-2;dx<=2;dx++){const k=(y+dy)*W+x+dx;if(!g[k]&&fm[k]==='0'){edge=true;break}}if(edge&&hash2(x,y,seed+41)<.8)ring[i]=1}
    else if(fm[i]==='0'&&h[i]>.2&&near>0&&near<14&&hash2(x,y,seed+42)<.45*near/10)ring[i]=1;
  }
  for(let i=0;i<W*H;i++){if(g[i]&&!ring[i])fm[i]='1';else if(ring[i]){fm[i]='5';g[i]=2}}
  return g;
}
const SEA={
  300:{name:'Saltbarrow',label:'Saltbarrow',cx:50,cy:40,rx:27,ry:20,peak:2.2,pow:1.4,seed:31,diff:17,
    floors:['isleSand','lush','wood','bluesand','bluewater','isleGrassEdge'],green:.4,hills:[[34,30,6,2.8],[68,50,5,2.4]],
    deco:[['yar_tent',-8,4],['yar_tent',-3,8],['yar_tent',4,6],['yar_tent',9,2],['yar_wreck',-14,-6],['yar_bones',14,-8],['yar_palms',6,-10],['yar_palms',-6,-12],['yar_palms',17,6],['yar_crates',-1,5],['yar_crates',2,4],['yar_p_maeve',0,2,{npc:'sb_maeve'}],['uw_buoy',10,15,{npc:'uw_dive_300'}],['peasantW',-5,3,{npc:'sb_cook'}],['fisher',7,8,{npc:'sb_hand'}]],
    sea:[['yar_ship_heron',36,-8]],scatter:[['yar_palms',5,0,0,17],['yar_driftwood',12,0,6,22],['yar_shells',10,0,8,20],['yar_crab',8,0,6,22]],
    enemies:[['bandit',10,14,-4,9],['archer',3,16,-4,8]]},
  301:{name:'The Isle of Bells',label:'Isle of Bells',cx:48,cy:40,rx:25,ry:22,peak:2.6,pow:1.3,seed:41,diff:19,
    floors:['isleSand','lush','wood','bluesand','bluewater','isleGrassEdge'],green:.85,hills:[[60,32,6,3.2]],
    deco:[['yar_arch',-10,-6,{npc:'ib_bell',cat:0}],['yar_arch',10,-6,{npc:'ib_bell',cat:1}],['yar_arch',0,8,{npc:'ib_bell',cat:2}],['yar_altar',0,-1],['yar_p_aldous',0,-3,{npc:'ib_aldous'}],['uw_buoy',10,17,{npc:'uw_dive_301'}],['yar_runestone',-13,5],['yar_runestone',13,4],['yar_wreck',-18,-4],['yar_bones',8,12]],
    scatter:[['yar_bones',6,0,0,18],['yar_driftwood',6,0,6,20],['yar_shells',6,0,8,20]],
    enemies:[['ghost',4,0,-4,16],['spectre',3,0,2,14],['skel',5,0,0,16]]},
  302:{name:'Cinder Isle',label:'Cinder Isle',cx:50,cy:42,rx:23,ry:21,peak:5.4,pow:1.05,seed:51,diff:21,
    floors:['isleSand','tombdark','wood','bluesand','bluewater','tombdark'],pf:1,pc:.8,hills:[],
    deco:[['yar_p_ketra',-6,10,{npc:'ci_ketra'}],['uw_buoy',10,16,{npc:'uw_dive_302'}],['yar_tent',-9,12],['yar_runestone',-4,12],['yar_runestone',-8,8],['yar_crystals',-12,2,{npc:'ci_crystal',cat:0}],['yar_crystals',12,4,{npc:'ci_crystal',cat:1}],['yar_crystals',-14,-8,{npc:'ci_crystal',cat:2}],['yar_crystals',10,-12,{npc:'ci_crystal',cat:3}],['yar_crystals',2,14,{npc:'ci_crystal',cat:4}],['yar_crystals',-3,-14,{npc:'ci_crystal',cat:5}],['yar_bones',9,9]],
    scatter:[['yar_bones',4,0,0,16],['yar_shells',4,0,10,20]],
    enemies:[['cinder',1,0,-5,2],['skel',6,0,2,16],['scorpion',4,0,0,16]]},
  303:{name:'Last Light',label:'Last Light',cx:48,cy:40,rx:21,ry:19,peak:3.2,pow:1.2,seed:61,diff:23,
    floors:['isleSand','lush','wood','bluesand','bluewater','isleGrassEdge'],green:.5,hills:[[48,24,5,4.6]],
    deco:[['yar_p_isolde',-7,6,{npc:'ll_isolde'}],['uw_buoy',10,14,{npc:'uw_dive_303'}],['yar_tent',-10,8],['yar_altar',0,-12,{npc:'ll_altar'}],['yar_runestone',-4,-11],['yar_runestone',4,-11],['yar_wreck',12,6],['yar_bones',-12,-2],['yar_palms',-14,2]],
    scatter:[['yar_driftwood',8,0,6,18],['yar_shells',8,0,8,18],['yar_bones',4,0,0,16]],
    enemies:[['assassin',3,0,2,14],['hitman',3,0,0,15]]},
  304:{name:'Oldhaven Quay',label:'Oldhaven Quay',cx:40,cy:22,rx:42,ry:22,peak:.4,pow:1,seed:71,diff:25,W:100,H:80,
    floors:['cobble','sandpath','wood','bluesand','bluewater','pebA'],hills:[],
    walls:[[20,14,46,15,'C'],[54,14,80,15,'C']],gate:[50,15],
    deco:[['KH:kh_npc3_4',0,0,{npc:'oh_herald'}],['KH:kh_npc3_0',-6,-4,{npc:'oh_guard'}],['KH:kh_npc3_0',6,-4,{npc:'oh_guard'}],['KH:kh_npc3_1',-12,-6,{npc:'oh_guard2'}],['KH:kh_npc3_1',12,-6,{npc:'oh_guard2'}],['yar_crates',-14,2],['yar_crates',14,2]],
    scatter:[['yar_pots',3,0,0,30],['yar_nets',3,0,0,30]],enemies:[]}
};
function SEA_ARRIVE(id){seaBuild(id);const L=LEVELS[id];return {x:L.start.x,y:L.start.y,f:L.start.f}}
function seaBuild(id){
  isleFloors();if(id===304){quayBuild();return}if(LEVELS[id])return;const sp=SEA[id];if(!sp)return;
  const W=sp.W||100,H=sp.H||84,cx=sp.cx,cy=sp.cy,N=W*H;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,d=Math.hypot((x-cx)/sp.rx,(y-cy)/sp.ry)*(1+.28*(tsmooth(x/5,y/5,sp.seed)-.5)),t=1-d;
    let hh=-.2+.03*(tsmooth(x/4,y/4,sp.seed+1)-.5);
    if(t>-.12)hh=t>0?Math.min(.5,.5*Math.min(1,t/.22))-.05+sp.peak*Math.pow(Math.max(0,t-.22),sp.pow)+.12*(tsmooth(x/6,y/6,sp.seed+2)-.4)*Math.min(1,t*4):-.2+(t+.12)/.12*.15;
    for(const [hx,hy,hr,hp] of sp.hills){const dd=Math.hypot(x-hx,y-hy)/hr;if(dd<1)hh=Math.max(hh,hp*Math.pow(1-dd,1.2)+.3)}
    h[i]=hh;rk[i]=clamp((hh-.7)/1.6,0,1);block[i]=(hh<-.06||hh>1.7)?1:0;
    fm[i]=hh>1.2?'0':hh>.1?'0':hh>-.06?'3':(t>-.2?'3':'4');
  }
  // walls and gate (Oldhaven)
  for(const [x0,y0,x1,y1,ch] of sp.walls||[])for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){rows[y][x]=ch;block[y*W+x]=1}
  const portals=[];
  if(sp.gate){rows[sp.gate[1]][sp.gate[0]]='1';block[sp.gate[1]*W+sp.gate[0]]=1;portals[1]={to:305,x:74,y:141,f:0,tex:'citygate',req:'oldhavenOpen',lock:'The great gate of Oldhaven is barred until noon. Speak to the herald.'}}
  const spot=(dx,dy)=>{for(let r=0;r<14;r++)for(let yy=-r;yy<=r;yy++)for(let xx=-r;xx<=r;xx++){if(Math.max(Math.abs(xx),Math.abs(yy))!==r)continue;const x=cx+dx+xx,y=cy+dy+yy;if(x<2||y<2||x>=W-2||y>=H-2)continue;if(!block[y*W+x]&&rows[y][x]==='.')return [x,y]}return null};
  // the pier and the ship
  let sy=-1;for(let y=H-2;y>0;y--)if(!block[y*W+cx]&&h[y*W+cx]>-.06){sy=y;break}
  const plank=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*W+x;block[i]=0;h[i]=.08;rk[i]=0;fm[i]='2'}};
  plank(cx,sy-1,cx+1,sy+4);
  const GR=sp.green||0;
  const GM=isleGrassMap(W,H,fm,h,sp.seed,GR,cx,cy,sp.rx,sp.ry);
  if(sp.pf)isleBarePatch(W,H,fm,h,sp.seed,cx,cy,sp.rx,sp.ry,sp.pc||.5);   // drifts of grass well inland; Cinder Isle stays bare
  const decor=[],scenery=[],used=new Set();
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));used.add(x+','+y)};
  put('yar_ship_dawn',cx,sy+6,{npc:'yr_ship',deco:false});
  for(const [k,dx,dy,o] of sp.deco){const s=spot(dx,dy);if(!s||used.has(s[0]+','+s[1]))continue;put(k.startsWith('KH:')?khFaceKey(k.slice(3)):k,s[0],s[1],o&&o.npc?Object.assign({},o,{npc:o.npc,deco:false}):o)}
  for(const [k,dx,dy] of sp.sea||[])put(k,cx+dx,cy+dy);
  for(const [k,n,dx,dy,r] of sp.scatter){for(let q=0;q<n;q++){const a=hash2(id,q,k.length)*TAU,rr=2+hash2(id,q+9,k.length)*r,s=spot(dx+Math.cos(a)*rr|0,dy+Math.sin(a)*rr*.8|0);if(!s||used.has(s[0]+','+s[1]))continue;
      if(k==='yar_driftwood'||k==='yar_shells'||k==='yar_crab')scenery.push({k,wx:s[0]+.5,wy:s[1]+.5,sc:.8+hash2(id,q,3)*.5,decor:{k,walk:true,x:s[0],y:s[1]}});else put(k,s[0],s[1])}}
  if(GR>0)for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){
    const i=y*W+x;if(block[i]||rows[y][x]!=='.'||used.has(x+','+y)||h[i]<.12||Math.hypot(x-cx,y-(sy-2))<7)continue;const r=hash2(x,y,sp.seed+11),gm=GM[i];
    if(gm&&r<.012+.05*GR*(gm===1?1.4:.5))put((GR>.6&&hash2(x,y,sp.seed+17)<.55)?'ltree'+((hash2(x,y,sp.seed+12)*20)|0):'dpalm'+((hash2(x,y,sp.seed+13)*4)|0),x,y,{sc:.85+hash2(x,y,sp.seed+14)*.45,deco:true});
    else if(!gm&&r<.004*GR)put('dpalm'+((hash2(x,y,sp.seed+13)*4)|0),x,y,{sc:.85+hash2(x,y,sp.seed+14)*.45,deco:true});   // a palm or two on the beach
    else if(gm&&r>.93)scenery.push({k:'lbush0',wx:x+.5,wy:y+.5,sc:.7+hash2(x,y,sp.seed+15)*.5,decor:{k:'lbush0',walk:true,x,y}});
    else if(gm&&r>.4&&r<(gm===1?.78:.62))scenery.push({k:'pgrass'+((hash2(x,y,sp.seed+18)*4)|0),wx:x+.5+(hash2(x,y,sp.seed+22)-.5)*.6,wy:y+.5+(hash2(x,y,sp.seed+23)-.5)*.6,sc:.5+hash2(x,y,sp.seed+19)*.7,decor:{k:'pgrass0',walk:true,x,y}});
    else if(gm&&r>.34&&r<.37)scenery.push({k:'pflw'+((hash2(x,y,sp.seed+20)*6)|0)+'_'+((hash2(x,y,sp.seed+21)*2)|0),wx:x+.5,wy:y+.5,sc:.7,decor:{k:'pflw0_0',walk:true,x,y}});
  }
  isleBeachProps(W,H,fm,h,block,rows,used,scenery,sp.seed,cx,cy,.16,[cx,sy-2]);
  for(let q=0;q<26;q++){const a=hash2(id,q,91)*TAU,rr=sp.rx*(.55+hash2(id,q,92)*.4),x=cx+Math.cos(a)*rr,y=cy+Math.sin(a)*rr*(sp.ry/sp.rx),cxl=x|0,cyl=y|0;
    if(cxl<2||cyl<2||cxl>=W-2||cyl>=H-2||block[cyl*W+cxl]||used.has(cxl+','+cyl))continue;scenery.push({k:'yar_gull_stand',wx:x,wy:y,sc:.8+hash2(id,q,93)*.4,decor:{k:'yar_gull_stand',walk:true,x:cxl,y:cyl}})}
  const enemies=[];
  for(const [t,n,dx,dy,r] of sp.enemies){for(let q=0;q<n;q++){const a=hash2(id,q+40,t.length)*TAU,rr=hash2(id,q+50,t.length)*r,s=spot(dx+Math.cos(a)*rr|0,dy+Math.sin(a)*rr|0);if(s&&Math.abs(s[0]-cx)+Math.abs(s[1]-(sy-2))>12)enemies.push({t,x:s[0],y:s[1]})}}
  const start={x:cx,y:sy-2,f:0};
  const lv={rows:rows.map(r=>r.join('')),start,enemies,items:[],decor,scenery,floorSet:sp.floors,floor:sp.floors[0],ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:sp.name,label:sp.label,noExtras:true,diff:sp.diff,tele:{x:start.x,y:start.y},
    chars:{D:LEVEL41_DATA.chars.D,C:LEVEL41_DATA.chars.C,W:YR.gW},lights:[],portals};
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}
  lv.fmap=fmap;SEA[id].W=W;SEA[id].H=H;
  LEVELS[id]=lv;LEVEL_NAMES[id]=sp.name;TERRS[id]=yarTerrain(W,H,h,rk,block);
}
for(const id in SEA){LEVEL_NAMES[+id]=SEA[id].name;KH_LAZY[+id]=()=>seaBuild(+id)}

/* ---- the island people and their quests ---- */
const sv=(id,t,who,desc,need,goal,reward,extra)=>vq(id,t,who,desc,need,goal,reward,extra);
/* Saltbarrow: the pirate queen */
sv('vq1','The Pirate Queen','Sable Maeve','Sable Maeve wants Corvane\'s marines off her island. Kill 10 of them. They are camped along the north and east shore of Saltbarrow.',10,q=>(G.flags.k_bandit||0)-(q.base||0),{gold:600,xp:3000},{cnt:'k_bandit'});
const DV1=khQD('Corvane burned my fleet at anchor, and when I would not tell him where you had gone, he left forty marines on my island to wait for you. They are camped around the shore, and every hour I do not move, more of my crew are fed to the sharks. Kill ten of them. Do that, and I will tell you what I know of Isolde.','Mind the archers. They hide in the dunes. And do not drink from the marines\' flasks, whatever the label says.',(n,m)=>`${n} of ${m} of his marines are dead. There are more along the shore.`,'You did it? Ten? Come, sit down.','Isolde. Corvane\'s scribe. She sheltered on the Isle of Bells, in the drowned abbey, before she went on to the rest. Brother Aldous keeps the first page. He will not give it up to a stranger. Ring his bells, all three, and he will know you are not Corvane\'s.','Brother Aldous on the Isle of Bells has the first page. The chart is marked.');
QUESTS.vq1.spot=()=>{ // the marines: ring the one in the middle of the camp, not Maeve
  if(LEVEL!==300)return null;const es=G.enemies.filter(e=>e.hp>0&&e.t==='bandit');if(!es.length)return null;
  const cx=es.reduce((a,e)=>a+e.x,0)/es.length,cy=es.reduce((a,e)=>a+e.y,0)/es.length;let b=es[0],bd=1e9;for(const e of es){const d=(e.x-cx)**2+(e.y-cy)**2;if(d<bd){bd=d;b=e}}return {x:b.x,y:b.y};
};
khNpc('sb_maeve','Sable Maeve, pirate queen','yar_p_maeve',()=>qNode('vq1',DV1),{q:'vq1'});
khNpc('sb_cook','The pirate cook','peasantW',()=>say('The queen\'s grog is not the problem. The problem is that the marines kicked in the barrel. Shoot the ones on the north shore and the rest will run.',[BYE]));
khNpc('sb_hand','A pirate deckhand','fisher',()=>say('The black ship stood off the reef for two days, sending in small boats. They have a man in grey who does not talk and does not drink. That one frightens me more than all the marines.',[BYE]));
/* The Isle of Bells: the monk */
sv('vq2','The Bells of the Drowned Abbey','Brother Aldous','Brother Aldous says the three bells of the abbey must be rung before he will trust you with the first page. Ring all three, and face what wakes.',3,()=>Object.keys(G.flags.ibBells||{}).length,{gold:900,xp:4500});
const DV2=khQD('Isolde came to us three years ago, grey as ash, and left a page of the ledger with me, sealed in wax. I have kept it. But I have kept it from the wrong sort of person too. Ring the three bells of the abbey, all three. They wake the sleepers. If you can face what rises, you are not afraid of the truth. Then the page is yours.','The bells are in the ruined arches: two to the north, one to the south. Do not ring them if you are hurt.',(n,m)=>`${n} of ${m} bells rung. The dead are not quiet.`,'The bells have rung. Come. Sit by me.','Take it. It is a single sheet. It is lighter than the secret it holds. Isolde went on to the volcano, to Cinder Isle. Ketra the ash-priestess has the second page, and she does not give things away.','The first page is yours. Go to Cinder Isle. Ketra keeps the second.');
khNpc('ib_aldous','Brother Aldous','yar_p_aldous',()=>{
  const F=G.flags;if(qSt('vq2')==='done')F.page1=1;
  return qNode('vq2',DV2)},{q:'vq2'});
khNpc('ib_bell','A great green bell','yar_arch',d=>{
  const F=G.flags;F.ibBells=F.ibBells||{};
  if(qSt('vq2')!=='active')return say('A great bronze bell hangs in a ruined arch, green with age. You do not want to ring it for no reason.',[BYE]);
  if(F.ibBells[d.cat])return say('The bell is still. You have already rung it. Somewhere in the mist, something answers.',[BYE]);
  F.ibBells[d.cat]=1;sfx('level');const n=Object.keys(F.ibBells).length;
  for(let q=0;q<2;q++)seaSpawn('ghost',6);
  return say(n>=3?'The third bell rings out across the water, and the whole abbey seems to exhale. Shapes rise from the ground.':'The bell tolls, deep and sad, and the sound goes out across the sea. Pale shapes begin to rise from the ground nearby.',[BYE])});
/* Cinder Isle: the ash-priestess */
sv('vq3','Fire and Ash','Ketra, the ash-priestess','Ketra will give you the second page if you bring her 3 cinder crystals from the slopes of the volcano and destroy the Cinder Guardian that walks them.',4,q=>Math.min(3,Object.keys(G.flags.ciCrystals||{}).length)+(((G.flags.k_cinder||0)-(q.base||0))>0?1:0),{gold:1200,xp:6000},{cnt:'k_cinder'});
const DV3=khQD('You carry a stranger\'s grief. I can smell it. Isolde left me a page and a warning: give it only to those who have been through the fire. Bring me three crystals from the slopes, the black ones with the cracks of red, and destroy the Guardian that walks them. It is a thing the mountain made, and it does not sleep.','The crystals lie round the mountain, six of them. Take three. And the Guardian walks the high path. You will hear it before you see it.',(n,m)=>`${n} of ${m}. Three crystals and the Guardian make four.`,'The crystals are warm. They have been through the fire with you. And the Guardian?','The page is yours. Isolde herself is on Last Light, at the end of the chain. She wrote the ledger for a man she feared, and has lived in fear of the sea ever since. Be gentle with her.','Isolde is on Last Light, at the end of the chain. Take the third page, and take care.');
khNpc('ci_ketra','Ketra, the ash-priestess','yar_p_ketra',()=>{
  const F=G.flags;if(qSt('vq3')==='done')F.page2=1;return qNode('vq3',DV3)},{q:'vq3'});
khNpc('ci_crystal','A cinder crystal','yar_crystals',d=>{
  const F=G.flags;F.ciCrystals=F.ciCrystals||{};
  if(qSt('vq3')!=='active')return say('A black crystal with red cracks, warm to the touch. The mountain breathes through it.',[BYE]);
  if(F.ciCrystals[d.cat])return say('You have already taken a crystal from this place.',[BYE]);
  F.ciCrystals[d.cat]=1;d.found=true;d.block=false;sfx('key');const n=Object.keys(F.ciCrystals).length;
  return say(n===1?'You break off a crystal. It is warm, and it hums faintly.':`${n} crystals. `+(n>=3?'That is enough for Ketra.':'Keep going.'),[BYE])});
/* Last Light: the scribe, the altar, and Corvane */
sv('vq4','The Last Page','Isolde','Isolde hid the third page in the altar at the top of Last Light. Fetch it, and be ready for Corvane.',1,khFlag('page3'),{gold:2000,xp:9000,items:['potion4']});
const DV4=khQD('You have the first two pages. I was told you would come. I am Isolde, once of the royal scribes. I wrote his ledger in three copies, because I feared one would be burned. I hid the last page in the altar at the top of the island. He has followed my lamp for two years. If he finds me he will kill me. If he finds you, he will take everything. I will be here, whatever happens.','The altar is at the top of the island, north through the stones. I will pray for you, though I am not sure who listens.',(n,m)=>'The altar is at the top of the island, north through the stones.','You have it? The third page? Come here, and let me see it.','Then the ledger is whole. Every page, in my own hand. I have not touched it in three years. Take it to the king, to Osric. Oldhaven lies at the far end of the chart, where the Narrow Sea meets the western shore. Go home. Go now.','The chart now runs to Oldhaven. Go home.');
khNpc('ll_isolde','Isolde, the exiled scribe','yar_p_isolde',()=>{
  const F=G.flags;if(qSt('vq4')==='done')F.fullLedger=1;return qNode('vq4',DV4)},{q:'vq4'});
khNpc('ll_altar','The old altar','yar_altar',()=>{
  const F=G.flags;
  if(qSt('vq4')!=='active')return say('A weathered stone altar in a ring of broken stones. There is a chest on it, bound in chain. It is locked, and you have no reason to open it yet.',[BYE]);
  if(F.page3)return say('The altar is empty, and the chest is open.',[BYE]);
  if(!F.corvaneMet){F.corvaneMet=1;startCut('corvaneDuel',()=>{seaSpawn('corvane',3,true);seaSpawn('bandit',5,true);seaSpawn('bandit',6,true);msg('Lord Corvane draws his sword.','#ff8a7a')});return null}
  const alive=G.enemies.some(e=>e.t==='corvane'&&e.hp>0);
  if(alive)return say('Corvane is still on his feet. The altar will have to wait.',[BYE]);
  F.page3=1;sfx('key');return say('The chain parts under your hand. Inside the chest, wrapped in oilcloth, is a single sheet in a fine copperplate hand: the last page of the master ledger. It names Corvane\'s tolls, year by year, to the last crown.',[BYE])});
/* Oldhaven Quay: where the story stops, for now */
sv('vq5','Home Waters','Menkaure, the shipwright','Sail the Dawn Walker east across the Narrow Sea to Oldhaven, the king\'s city, on the far shore, with the master ledger. The Kraken waits in the deep water between the two coasts, and the harbour boom will not lift until it is dead. The gate opens at noon.',1,khFlag('oldhavenSeen'),{gold:1000,xp:5000});
khNpc('oh_herald','A harbour herald','kh_npc3_4',()=>{
  const F=G.flags;
  return say('The king\'s court meets at noon. The gate is barred until then. If you carry a ledger, say so to the gate-captain when it opens. Until then, wait on the quay, and do not touch your swords.',[BYE])});
khNpc('oh_guard','A harbour guard','kh_npc3_0',()=>say('Four named persons, wanted by the Crown. Twenty thousand crowns on each. I have not seen them. I certainly have not seen four people who look like you. Please keep your hands where I can see them.',[BYE]));
khNpc('oh_guard2','A harbour guard','kh_npc3_1',()=>say('Whatever happens at noon, I have not seen you, and you have not seen me.',[BYE]));
function seaSpawn(t,r,alert){ // a creature appears a few cells from the party
  const P=G.P;
  for(let i=0;i<60;i++){
    const a=Math.random()*TAU,d=3+Math.random()*r,x=Math.round(P.x+Math.cos(a)*d),y=Math.round(P.y+Math.sin(a)*d);
    if(x<2||y<2||x>=MW-2||y>=MH-2)continue;
    if(G.grid[y][x]!==0||cellBlocked(x,y)||enemyAt(x,y))continue;
    addEnemy(t,x,y,alert!==false);return true;
  }
  return false;
}
function seaEnter(n){
  const F=G.flags;
  if(n===304&&!F.oldhavenSeen){F.oldhavenSeen=1;startCut('oldhavenArrive',()=>{if(qSt('vq5')===null)qAccept('vq5');if(qReady('vq5'))qTurnIn('vq5');F.act3=1;msg('The gate of Oldhaven stays shut until noon. Speak to the herald.','#ffe36a')})}
  if(typeof ohEnter==='function')ohEnter(n);
  else if(n>=300&&n<=303&&!(F.seaArr&&F.seaArr[n])){(F.seaArr=F.seaArr||{})[n]=1;msg({300:'Saltbarrow. A pirate haven of sand, wrecks and canvas tents. Gulls cry over the water.',301:'The Isle of Bells. Mist over a drowned abbey. Somewhere in the grey, a bell is moving in the wind.',302:'Cinder Isle. Black rock and red glow. The mountain breathes.',303:'Last Light. A scrap of rock at the end of the chart. A small lamp burns in a hut on the shore.'}[n],'#a8d8ff')}
}
