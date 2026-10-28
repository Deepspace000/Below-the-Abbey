/* ---------- boards, vignettes ---------- */
const HGDPC_BOARD=[ // lost, wanted, notice: one board in every town
 ['Lost: one pair of shears, blue handle. Answers to nothing.','Wanted: someone to tell the hedge it is not a door.','The slugs have been seen on the lower path. They have not been seen leaving.'],
 ['Lost: a small grey stone, very dear to me.','Wanted: a mason who can carve a door that stays where it is put.','The cairn is full. Please leave your stone beside it, not on it.'],
 ['Lost: one jar of honey, dark. The finder may keep half.','Wanted: a beekeeper with a steady hand and a short memory.','The honey press is not a ride.'],
 ['Lost: a pearl, lightly used.','Wanted: someone to row the ferry, and someone to tell them where it goes.','Please stop wishing aloud at the fountain. It gets crowded.'],
 ['Lost: a cup of water. Reward: a cup of water.','Wanted: one honest well-digger. Thirsty ones preferred.','The water ration is unchanged. So is our opinion of it.'],
 ['Lost: a blue lamp, still lit, last seen walking away.','Wanted: a third lamplighter who gets on with the first two.','If your lamp goes out, light it again. Do not wait for us. We are not coming.'],
 ['Lost: tile number 1,204, blue, with a small chip.','Wanted: a steady hand for the big mosaic. Steady, I said.','Please do not step on the loud tiles.'],
 ['Lost: one gold leaf, nearly weightless. It may be on you.','Wanted: a buyer for a very shiny statue.','The ember warden is not for hugging.']];
// pieces: [dx,dy,key,scale,flags]  flags: b = blocks (a statue, a well), l = gives light, c = reward chest, n = the note
const HGDPC_VIG=[
 {title:'The Gardener\'s Rest',text:'Here stands Orrin Hedge, who trimmed the hedge of Hedgefoot for forty years. He was last seen trimming it from the inside. We think he is still at it.',p:[[0,0,'wm_statue',1,'b'],[-2,1,'hgtb_bench',1.1],[2,1,'urn',1],[-2,-1,'hgt_gardenlantern',1,'l'],[2,-1,'hgt_gardenlantern',1,'l'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Bell of the Lost',text:'Ring once for every one the maze has kept. It has been rung 211 times. The rope wore through, so we ring it with a spoon. A scratch beside the bell says: the cairn pays its tithe to whoever kneels at the bell.',p:[[0,0,'wm_bell',1,'b'],[-2,0,'wm_brazier',1,'l'],[2,0,'wm_brazier',1,'l'],[-1,2,'hgtb_bench',1.1],[2,2,'urn',1],[0,-2,'hg_chestwax',1,'c'],[1,2,'noticeboard',.9,'n']]},
 {title:'The Honey Press',text:'Sticky, loud and strictly no tasting. A smaller notice beneath says: whoever tasted is still stuck.',p:[[0,0,'hgtb_stall_orange_pottery',.85],[-2,1,'wm_barrel_tall',1],[2,1,'hg_waxbarrel',1],[-1,2,'hg_jar',1],[2,-1,'hg_jar',.9],[-2,-1,'hl_p_candle',1,'l'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Pearl Fountain',text:'Throw one coin for luck. The keeper collects on Thursdays, whatever day it is.',p:[[0,0,'hgtb_deco_fountain',.95,'b'],[-2,1,'hgtb_bench',1.1],[2,1,'hgtb_bench',1.1],[-2,-1,'hgtb_deco_lanterns',.75,'l'],[1,-2,'hgt_pearlbush',1],[0,2,'noticeboard',.9,'n']]},
 {title:'The Old Well',text:'Forty fathoms deep. Do not drop anything you want back, and do not drop anything you do not. A mark by the stones says: look below the second crate.',p:[[0,0,'well',1,'b'],[-1,1,'wm_bucket',1],[-2,0,'wm_crate',1],[2,0,'wm_crate',1],[2,2,'sacks',1],[0,-2,'hg_chestwax',1,'c'],[0,2,'noticeboard',.9,'n']]},
 {title:'The Lamplighters\' Post',text:'Two lamplighters, one ladder and forty years of disagreement. The ladder is winning.',p:[[0,0,'hgt_lamppost',.8,'bl'],[-2,1,'wm_lantern_gold',1,'l'],[2,1,'hgtb_lantern',.9,'l'],[-2,-1,'wm_crate',1],[2,-1,'hgtb_bench',1.1],[0,2,'noticeboard',.9,'n']]},
 {title:'The Mosaic Corner',text:'The great mosaic was smashed on this spot. The tile-trader has the pieces he can find. He is looking for the rest, and for whatever did it.',p:[[0,0,'hgtb_table',1],[-1,1,'hgtb_chair',1],[1,1,'hgtb_chair',1],[2,-1,'vase0',1],[-2,-1,'hgtb_deco_banner',.8],[2,2,'hgtb_bench',1.1],[0,-2,'noticeboard',.9,'n']]},
 {title:'The Gilder\'s Bench',text:'Everything here is gold leaf. Please do not lick it. The Gilder has had complaints. A bead of gold behind the bench is a gift, if you are quick.',p:[[0,0,'hgtb_stall_rose_lanterns',.85],[-2,1,'hgtb_bench',1.1],[2,1,'urn',1],[-2,-1,'wm_lantern_gold',1,'l'],[2,-1,'hgtb_deco_banner',.8],[0,-2,'hg_chestwax',1,'c'],[0,2,'noticeboard',.9,'n']]}];
const HGDPC_ENC=[ // the ten enclaves, in zone order
 {title:'Silence Notice',text:'Silence is kept in this room by order of the Warden. Anyone caught whispering will be shushed by the clock.',p:[[0,0,'hgtb_furn_table_chairs',1],[2,0,'hgtb_furn_clock',.65],[-2,0,'hl_p_candle',1,'l'],[0,2,'urn',1],[-2,2,'noticeboard',.9,'n']]},
 {title:'The Lamplighter\'s Plaque',text:'Tuck the Lamplighter lit these lamps himself, one a night, to see how long the dark would let him. It is still letting him.',p:[[0,0,'hgt_lamppost',.8,'bl'],[3,0,'hgt_lamppost',.8,'bl'],[1,1,'hgtb_bench',1.1],[-1,-1,'hgt_hanglamp',1,'l'],[1,3,'noticeboard',.9,'n']]},
 {title:'A Frog\'s Warning',text:'The water is clean and the frogs are rude. Please do not ask the frogs for directions. They will give them.',p:[[0,0,'hgt_fountain',1,'b'],[-2,1,'hgtb_bench',1.1],[2,-1,'hgt_reeds',.8],[2,2,'hgt_pearlbush',1],[-2,-2,'hgt_reeds',.7],[0,3,'noticeboard',.9,'n']]},
 {title:'Reading Room Rules',text:'Most of the books here are about the maze. One is about cheese. The cheese one is the most worn.',p:[[0,0,'wm_bookshelf',.95],[-2,0,'hgtb_furn_bookshelf',.8],[2,0,'hg_lectern',1],[0,2,'hgtb_furn_books_globe',1],[2,2,'hl_p_candle',1,'l'],[-2,2,'noticeboard',.9,'n']]},
 {title:'Tea Notice',text:'Rest Stop. Free sitting, cheap tea, no questions. Please wash your own cup. The cups are all the same cup.',p:[[0,0,'yar_tent',1],[-2,1,'wm_brazier',1,'l'],[2,1,'hgtb_bench',1.1],[2,-1,'sacks',1],[-2,-1,'hgtb_plant_barrel',1],[0,3,'noticeboard',.9,'n']]},
 {title:'Do Not Wake',text:'Please do not wake the sleeper. He has been here three days. We checked. He is asleep. He snores in the key of the corridor.',p:[[0,0,'hgtb_furn_bed',1],[-3,0,'hgtb_furn_bunk',.7],[3,0,'sack2',1],[-2,2,'hl_p_candle',1,'l'],[2,2,'urn',1],[0,3,'noticeboard',.9,'n']]},
 {title:'Lantern Landing Rule',text:'Lost lamps end up here. Leave one, take one. Do not take the one that is still warm. It belongs to someone.',p:[[0,0,'hgtb_deco_lanterns',.8,'l'],[-2,1,'wm_lantern_gold',1,'l'],[2,1,'wm_lantern_hang',1,'l'],[-2,-1,'wm_crate',1],[2,-1,'wm_cage_lantern',1,'l'],[0,3,'noticeboard',.9,'n']]},
 {title:'Mossy Corner',text:'The moss here has been growing since before the maze. Please do not pet it. It has started to purr.',p:[[0,0,'hgtb_plant_barrel',1],[-2,1,'hgt_fern',1],[2,1,'hgtb_plant_spiralfern',1],[2,-1,'hgtb_bench',1.1],[-2,-1,'hgt_mushrooms',1],[0,3,'noticeboard',.9,'n']]},
 {title:'The Waiting Card',text:'The Waiting Room. For whom, nobody remembers. A card on the table says: back in five minutes. The card is old.',p:[[0,0,'hgtb_table',1],[-1,1,'hgtb_chair',1],[1,1,'hgtb_chair',1],[3,0,'hgtb_furn_clock',.65],[-3,0,'hgtb_bench',1.1],[0,3,'noticeboard',.9,'n']]},
 {title:'A Torn Journal',text:'Day 9. Safe here. Day 10. Still safe. Day 11. Very hungry, but safe. Day 12. Found a box under the crates. The box was not empty. Neither am I.',p:[[0,0,'wm_crate',1],[2,0,'wm_crate',1],[-2,1,'wm_barrel',1],[2,2,'wm_brazier',1,'l'],[-2,-1,'dbones',1],[0,-2,'hg_chestwax',1,'c'],[0,3,'noticeboard',.9,'n']]}];
function hgdpcBuild(L){
  if(L._hgdpc)return;const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const occ=new Map(),itm=new Set(L.items.map(i=>i.x+','+i.y)),ene=new Set(L.enemies.map(e=>e.x+','+e.y));
  const reg=d=>{const k=d.x+','+d.y;if(!occ.has(k))occ.set(k,[]);occ.get(k).push(d)};
  const unreg=d=>{const k=d.x+','+d.y,a=occ.get(k);if(a){const i=a.indexOf(d);if(i>=0)a.splice(i,1);if(!a.length)occ.delete(k)}};
  L.decor.forEach(reg);
  const busy=(x,y)=>occ.has(x+','+y)||itm.has(x+','+y)||ene.has(x+','+y);
  const isBlk=(x,y,ex)=>{const a=occ.get(x+','+y);return !!a&&a.some(d=>d.block&&d!==ex)};
  const n4=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>open(x+a,y+b)).length;
  const n8=(x,y)=>{let c=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if((a||b)&&open(x+a,y+b))c++;return c};
  function canBlock(x,y,ex){ // would a blocking prop in this cell cut a corridor?
    const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>open(a,b)&&!isBlk(a,b,ex));
    if(nb.length<=1)return true;const seen=new Set([nb[0].join()]),st=[nb[0]];
    while(st.length){const [cx,cy]=st.pop();for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+a,ny=cy+b,k=nx+','+ny;if(seen.has(k)||(nx===x&&ny===y)||Math.abs(nx-x)>5||Math.abs(ny-y)>5||!open(nx,ny)||isBlk(nx,ny,ex))continue;seen.add(k);st.push([nx,ny])}}
    return nb.every(c=>seen.has(c.join()))}
  const reserved=new Set(),put=d=>{L.decor.push(d);reg(d);return d};
  const ok=(x,y,blk,room)=>open(x,y)&&!busy(x,y)&&!reserved.has(x+','+y)&&(!blk||(n4(x,y)>=3&&canBlock(x,y)))&&(!room||n8(x,y)>=room);
  function spot(tx,ty,R,blk,room){for(let r=0;r<=R;r++){let best=null,bd=1e9;for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=tx+dx,y=ty+dy;if(!ok(x,y,blk,room))continue;const dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=[x,y]}}if(best)return best}return null}
  const zs=L._hgdp.zones,towns=zs.filter(z=>z.type==='safe'&&z.town!==undefined).sort((a,b)=>a.town-b.town),encl=zs.filter(z=>z.type==='safe'&&z.town===undefined&&z.name!=='The Foot of the Maze');
  const inZone=d=>zs.some(z=>z.type==='safe'&&Math.hypot(d.x-z.x,d.y-z.y)<=z.r);
  const st=HGDPC.stats;
  /* 1. one scale for people, a different picture where we can */
  const NPCRE=/^hgd_(q\d+|shop\d|vill\d+|rest\d|s2_[a-z]+\d|church\d|fwsexton|fwcook|diver|cinder)$/;
  const people=L.decor.filter(d=>d.npc&&NPCRE.test(d.npc));
  const roleOf=n=>/s2_magic/.test(n)?'mage':/church/.test(n)?'priest':/s2_arms/.test(n)?'arms':/s2_armour/.test(n)?'armour':/s2_inn/.test(n)?'inn':/s2_trader/.test(n)?'trader':/shop/.test(n)?'shop':/_q\d/.test(n)?'quest':/vill/.test(n)?'vill':/rest/.test(n)?'rest':'other';
  const PREF={mage:['hg_wizard'],priest:['hg_npc0','hg_npc6'],arms:['hg_npc4','hg_npc3'],armour:['hg_npc5','hg_npc4'],inn:['hg_npc1','hg_npc6'],trader:['hg_npc3','hg_npc5'],shop:['hg_npc1','hg_npc3','hg_npc6'],quest:['hg_npc0','hg_npc5','hg_npc4','hg_npc6','hg_npc3','hg_npc1'],other:['hg_npc6','hg_npc0','hg_npc5','hg_npc3'],vill:['hg_npc2','hg_npc6','hg_npc3','hg_npc0','hg_npc4','hg_npc5','hg_npc1'],rest:['hg_npc6','hg_npc0','hg_npc1','hg_npc3','hg_npc5','hg_npc4']};
  const ORDER=['mage','priest','arms','armour','inn','trader','shop','quest','other','vill','rest'],ALL=['hg_npc0','hg_npc1','hg_npc3','hg_npc4','hg_npc5','hg_npc6','hg_wizard'];
  const byTown={};for(const d of people){const t=hgdpcTownOf(d);const key=t.z?t.z.name:'T'+t.t;(byTown[key]=byTown[key]||[]).push(d)}
  let swapped=0;
  for(const key in byTown){const cnt={};let boy=0;for(const r of ORDER)for(const d of byTown[key].filter(d=>roleOf(d.npc)===r)){
    const pref=PREF[r];let best=null,bc=1e9;for(const p of pref){if(p==='hg_npc2'&&boy>=1)continue;const c=(cnt[p]||0)*10+pref.indexOf(p);if(c<bc){bc=c;best=p}}
    if(!best)best=ALL.slice().sort((a,b)=>(cnt[a]||0)-(cnt[b]||0))[0];
    cnt[best]=(cnt[best]||0)+1;if(best==='hg_npc2')boy++;
    if(d.k!==best)swapped++;d.k=best;d.sc=HGDPC_PIC[best]/NPC_H[best];
    for(const tb of [KH_KEEPERS,NPCS]){const e=tb[d.npc];if(e){if('face' in e)e.face=best;if('img' in e)e.img=best}}}}
  st.peopleRescaled=people.length;st.peopleSwapped=swapped;
  /* 2. thin the identical groves and plaques, separate stacked props */
  const FLORA=['hgt_fairytree','hgtb_plant_belltree','hgt_bulbflower','hgt_fern','hgt_mushrooms','hgt_shellflower','hgt_reeds'],ALT=['hgtb_plant_spiralfern','hgt_bulbflower','hgt_shellflower','hgt_fern','hgt_pearlbush','hgt_mushrooms','hgtb_plantbed'];
  const wallFam=k=>/^art_hgdf_(shield|wsym|vine)\d+$/.exec(k),fam={};
  for(const d of L.decor){const m=wallFam(d.k);if(m){(fam[m[1]]=fam[m[1]]||new Set()).add(d.k)}}
  const cand=L.decor.filter(d=>!d.npc&&inZone(d)&&(FLORA.includes(d.k)||wallFam(d.k)||/^art_hgdf_plant\d+$/.test(d.k))).sort((a,b)=>a.y-b.y||a.x-b.x);
  const near=(d,k)=>cand.filter(e=>e!==d&&e.k===k&&Math.abs(e.x-d.x)<=4&&Math.abs(e.y-d.y)<=4&&e.__ok).length;
  let swappedDecor=0,removedDecor=0;
  for(const d of cand){d.__ok=0;if(near(d,d.k)<2){d.__ok=1;continue}
    if(FLORA.includes(d.k)){const alt=ALT.map(k=>[k,near(d,k)]).sort((a,b)=>a[1]-b[1])[0][0];d.k=alt;delete d.sc;if(d.block){d.block=false;d.walk=true}d.__ok=1;swappedDecor++}
    else{const m=wallFam(d.k);if(m){const alt=[...fam[m[1]]].map(k=>[k,near(d,k)]).sort((a,b)=>a[1]-b[1])[0];if(alt[1]<2){d.k=alt[0];d.__ok=1;swappedDecor++;continue}}
      if(near(d,d.k)>=3){unreg(d);L.decor.splice(L.decor.indexOf(d),1);removedDecor++}else d.__ok=1}}
  for(const d of cand)delete d.__ok;
  const PRI=d=>d.npc?9:(/chest|teleporter|lamp/.test(d.k)?8:d.block?6:d.pic?3:1);
  let unstacked=0;
  for(const [k,a] of [...occ]){const fl=a.filter(d=>!d.pic&&!d.npc&&!/chest|teleporter|lamp|moth|beetle/.test(d.k)&&d.deco!==false);if(fl.length<2)continue;fl.sort((p,q)=>PRI(q)-PRI(p));
    for(const d of fl.slice(1)){const i=L.decor.indexOf(d);if(i>=0){L.decor.splice(i,1);unreg(d);unstacked++}}}
  st.groveSwapped=swappedDecor;st.groveRemoved=removedDecor;st.stackedRemoved=unstacked;
  /* 3. props that blocked a corridor: move to the nearest wide place */
  let moved=0,freed=0;
  for(const d of L.decor.slice()){if(!d.block||d.npc||!inZone(d)||!n4(d.x,d.y)||canBlock(d.x,d.y,d))continue;
    unreg(d);const p=spot(d.x,d.y,6,true);if(p){d.x=p[0];d.y=p[1];moved++}else{d.block=false;d.walk=true;freed++}reg(d)}
  st.movedBlockers=moved;st.freedBlockers=freed;
  /* 4. a sign at every shop and church; people stand where they stood */
  const SIGN={arms:['sign_smith',1.4],armour:['sign_smith',1.4],magic:['greensign',1.1],trader:['sign_store',1.4],inn:['sign_inn',1.4],general:['sign_store',1.4],church:['sign_church',1.45]};
  let signs=0;
  const firstName=id=>{const n=NPCS[id];return n?n.name.split(',')[0]:'The keeper'};
  const addSign=(keeper,kind,t)=>{let p=null;
    for(const [R,room] of [[3,8],[4,6],[5,0]]){p=spot(keeper.x,keeper.y,R,false,room);if(p&&(p[0]!==keeper.x||p[1]!==keeper.y))break;p=null}
    if(!p)return;reserved.add(p.join());const [k,sc]=SIGN[kind];const T=HGDPC_TOWN[t];
    const nm=firstName(keeper.npc),txt=kind==='church'?'THE CHURCH OF '+T.toUpperCase()+'. '+HGDPC_CHURCH[t]+' Healing, mending and a quiet prayer, for a small gift.':HGDPC_KIND_ROLE[kind].toUpperCase()+'. '+nm+', of '+T+'. '+HGDPC_TAG[kind][t];
    put({k,x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt,kname:kind==='church'?'Church sign':HGDPC_KIND_ROLE[kind]+' sign',sc});signs++};
  for(const d of people){let m=/^hgd_s2_([a-z]+)(\d)$/.exec(d.npc);if(m){addSign(d,m[1],+m[2]);continue}m=/^hgd_church(\d)$/.exec(d.npc);if(m){addSign(d,'church',+m[1]);continue}m=/^hgd_shop(\d)$/.exec(d.npc);if(m)addSign(d,'general',+m[1])}
  st.shopSigns=signs;
  /* 5. a notice board and a signpost with true directions in every town */
  const top=zs.find(z=>z.boss)||{x:100,y:5,name:'The Black Hall'};
  const dirName=(dx,dy)=>{const a=Math.atan2(dy,dx)*180/Math.PI;return ['east','south-east','south','south-west','west','north-west','north','north-east'][(Math.round(a/45)+8)%8]};
  let boards=0,posts=0;
  towns.forEach(z=>{const t=z.town;
    let p=spot(z.x,z.y,7,false,8);if(p){reserved.add(p.join());put({k:'wm_noticeboard',x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:'NOTICES OF '+HGDPC_TOWN[t].toUpperCase()+'. Lost: '+HGDPC_BOARD[t][0].replace(/^Lost: /,'')+' Wanted: '+HGDPC_BOARD[t][1].replace(/^Wanted: /,'')+' '+HGDPC_BOARD[t][2],kname:'Notice board',sc:1});boards++}
    p=spot(z.x+2,z.y-3,8,false,8);if(p){reserved.add(p.join());
      const others=towns.filter(q=>q!==z).map(q=>[q,Math.hypot(q.x-z.x,q.y-z.y)]).sort((a,b)=>a[1]-b[1]).slice(0,3);
      const lines=others.map(([q,dd])=>HGDPC_TOWN[q.town]+': '+dirName(q.x-z.x,q.y-z.y)+', about '+Math.round(dd)+' squares').concat(['The Great Atrium: '+dirName(top.x-z.x,top.y-z.y)+', about '+Math.round(Math.hypot(top.x-z.x,top.y-z.y))+' squares']);
      put({k:'wm_signpost',x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:'THE ROAD FROM '+HGDPC_TOWN[t].toUpperCase()+'. '+lines.join('. ')+'. The maze does not run in straight lines, so walk with patience.',kname:'Signpost',sc:1});posts++}});
  st.boards=boards;st.signposts=posts;
  /* 6. the vignettes */
  let vign=0,pieces=0,chests=0;
  const LIGHTKEY=/lamp|lantern|brazier|candle/;
  const build=(z,V)=>{ // find a place with room, plan every piece, then commit
    const cands=[];for(let dy=-9;dy<=9;dy++)for(let dx=-9;dx<=9;dx++){const x=z.x+dx,y=z.y+dy;if(!open(x,y)||Math.hypot(dx,dy)>z.r)continue;let free=0;for(let a=-3;a<=3;a++)for(let b=-3;b<=3;b++)if(open(x+a,y+b)&&!busy(x+a,y+b))free++;cands.push([x,y,free-Math.hypot(dx,dy)*.6])}
    cands.sort((a,b)=>b[2]-a[2]);
    for(const [ax,ay] of cands.slice(0,40)){const plan=[],res=[];let good=true;
      for(const [dx,dy,k,sc,fl] of V.p){const f=fl||'',blk=/[bc]/.test(f);const p=spot(ax+dx,ay+dy,2,blk,0);if(!p){if(/n/.test(f)||blk){good=false;break}continue}reserved.add(p.join());res.push(p.join());plan.push([p,k,sc,f])}
      for(const r of res)reserved.delete(r);
      if(!good||plan.length<Math.ceil(V.p.length*.7)||!plan.some(q=>/n/.test(q[3])))continue;
      for(const [p,k,sc,fl] of plan){if(/n/.test(fl))put({k:'noticeboard',x:p[0],y:p[1],block:false,walk:true,npc:'hgdpc_text',txt:V.title.toUpperCase()+'. '+V.text,kname:V.title,sc});
        else if(/c/.test(fl)){put({k,x:p[0],y:p[1],block:true,hgdTier:3,hgdGive:[],sc:1});chests++}
        else put({k,x:p[0],y:p[1],block:/b/.test(fl),walk:!/b/.test(fl),deco:true,sc});
        if(/l/.test(fl))L.lights.push([p[0],p[1]]);reserved.add(p.join());pieces++}
      vign++;return true}
    return false};
  towns.forEach((z,i)=>{if(!build(z,HGDPC_VIG[i]))console.warn('hgdpc: no room for vignette',HGDPC_VIG[i].title)});
  encl.slice(0,10).forEach((z,i)=>{if(!build(z,HGDPC_ENC[i]))console.warn('hgdpc: no room for vignette',HGDPC_ENC[i].title)});
  st.vignettes=vign;st.vignettePieces=pieces;st.vignetteChests=chests;
  L._hgdpc={stats:st}}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdp&&L.decor)try{hgdpcBuild(L)}catch(e){console.error('hgdpc',e)}}}
