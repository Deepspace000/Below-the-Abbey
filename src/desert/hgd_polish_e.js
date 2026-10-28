/* ==========================================================================
   THE DROWNED MAZE, POLISH PASS (prefix hgdwe / HGDWE). Patches the BUILT level 477 after hgd_water.js and hgd_water2.js have made it. It does not move a quest object.
   1. Thins and re-scales the moss, boulders, weed and algae the second pass piled up (261 squares held three or more things; boulders stood taller than a hero; moss cushions filled the screen).
      Nothing identical is left in a clump, and every plant, rock and cushion has a believable height next to a person (a person is 1.0).
   2. Fourteen hand-built places, each with its own props, a coloured pool of light and a short written story: the Drowned Library, the Sunken Bell, the Garden of Saints, the Wreck of the ferry,
      the diver's camp, the smugglers' cache, the pearl grotto, a rune stone, the pond saint's shrine, the scales, the lantern nook, a mirror, the owl, and the Warden's board.
   3. True signposts at the junctions (each says which way the nearest steps up and the Warden's chamber lie) and a note in every dead end that has no other story.
   4. More shoals of fish. Every solid prop is placed only where the maze stays fully connected (flood fill from the first stairs).
   Exposes LEVELS[477]._hgdwe for the audit (tools/polish/e_audit.py).
   ========================================================================== */
const HGDWE={ID:477,lights:[]};
khNpc('hgdw_note','A note on the wall','hl_p_note',()=>{const d=G.talk&&G.talk.d;return say(hgdSay(d&&d.hgdwText?d.hgdwText:'The writing has run in the water. You cannot read it.'),[BYE])});
const HGDWE_N={
  lib:'The archivist moved the abbey library down here when the pond began to rise. She said books should be kept where they cannot burn. She did not say what else the water would keep.',
  lib2:'Pinned to the shelf: Lent to the monks of the lower cloister, one copy of the tide tables. Please return before the next flood. Signed, the archivist. There was no next flood. There was only the one.',
  bell:'Cut into the rim of the bell: I RANG ONCE WHEN THE WATER CAME IN. THE WHOLE VALLEY HEARD ME. NOBODY CAME. I WILL NOT RING AGAIN.',
  garden:'A brass plate at the foot of the statues: The Four Saints of the Garden. Knight, smith, lady, child. They stood on the lawn for three hundred years and the pond has had them for ten.',
  wreck:'Scratched on the boat: The ferry made the crossing every dawn for forty years. The last passenger paid with a button. The ferryman kept it, and the boat, and the pond kept him.',
  diver:'A diver\'s slate: Hest went in for the pearls with one helm between two of us. I held the rope. The rope held. I do not know about the rest. The chest by my knee is his share.',
  cache:'Chalked on a crate: CARGO FOR THE ABBEY. DO NOT OPEN BEFORE LENT. The crates were opened long ago, by the water, and there was only lamp oil inside. It is all still here.',
  grotto:'Scratched on a clam shell: Pearls grow slowly here, one for each year a stranger stays away. This grotto is very rich.',
  rune:'The stone says, in square letters: THE DEEP WEIGHS ALL THINGS. IT HAS NOT YET FOUND ANYTHING LIGHTER THAN A KINDNESS.',
  shrine:'A shrine to the pond saint, who is said to have walked across the water. The water rose, and the saint stayed exactly where she was. The candle in the niche has not gone out.',
  scales:'A small brass plate: Fair measure. Every pearl taken from the deep is weighed here, and the deep takes its tenth. Take what is yours and leave the tenth on the pan.',
  lantern:'A fisher\'s note: I hung three lanterns here so that nobody would be lost in the dark. If you can see this one, you are not lost yet. Follow the glow back to the wide room.',
  mirror:'Written on the frame: It shows this same passage, but dry, with the lamps lit, and a door at the end that is not here. Do not look for long.',
  owl:'Carved at the base: The owl of the abbey sat over the reading room and kept the silence. Nobody has spoken in this corridor since, and it is a good silence still.',
  board:'NOTICE. Beyond this board the water belongs to the Warden of the Deep. Divers who wish to keep their helms should turn back, and divers who do not should at least take someone with them.',
  orb:'Cut into the pedestal: The orb holds one breath of the pond, taken the day the water rose. If it ever clears, the pond will remember how to leave.',
  nets:'Tied to the rack: Nets mended, pots checked, eels counted. Whoever finds this, the pots on the left are mine and the pots on the right are the pond\'s.',
  anem:'Scratched on a stone: The anemones close when a stranger comes near and open again when the stranger leaves. They are the politest things in the maze.',
  candles:'A card with wax stuck to it: One candle for each diver who went in and did not come out. There was room for more. There always is.',
  end:['Scratched small: A dead end. I came all this way for a dead end.','Chalked: Turn back. The reeds are thicker beyond, and there is no beyond.','A child\'s hand: I FOUND THE END OF THE MAZE. IT IS THIS WALL.','Written in oil: Two lefts, one right, and you are here. Two rights, one left, and you are not.','Scratched: Somebody sat here a long time. The weed on the floor is flattened in the shape of a person.','Chalked on the wall: The fish here are not hungry. Please do not make them hungry.','Carved: I counted forty breaths of air on this side of the maze. Spend them on the middle, not on the corners.','A fisher\'s mark, three lines and a hook: Good eels in the weed here. Bad eels in the weed next door.','Scratched: The helm fogs from the inside when you are frightened. Breathe slowly. It helps with the fog, and with the other thing.','Chalked: My brother says the walls are the same green as the water. They are not. The water is greener.','Written small: I left a lantern at the last crossing. If it is gone, someone else is in here.','Carved by a patient hand: The pond came up one finger a year. We said we would move the books next year.','Scratched: All the passages here bend left. I do not trust a maze that has a favourite direction.','Chalked: A turtle sat on my head for a minute. I am very glad nobody saw.','A diver\'s tally: ten steps in, ten steps out, and the weed holds the middle. Never trust the weed.','Pinned with a fishhook: LOST, one glove, left hand, green. Reward: my gratitude, which is all I have.','Scratched: The quiet is not empty. Hold still and you can hear the pond thinking.','Chalked: The old monks said a kind word to the water every morning. It did not help, but it did not hurt.','Carved: Somebody built this wall twice. The second time, they were in a great hurry.','Written in oil: Do not follow the bubbles. They go up. You are going sideways.','Scratched: Count the dead ends. If you reach thirty, you have counted one twice.','A neat hand: I made a map of this maze. It is correct. It was correct before the water moved the sand.','Chalked: There are pearls in the chests, and there is a Warden at the end. One of these is a good reason to come, and one is a good reason to leave.','Scratched: The weed on the floor is the softest thing I have felt in ten years. I am staying a minute.','Carved: Not every wall has a door. Some walls only have a view of the next wall.','Written small: A heron stood on the old roof above us once, a long time ago. Nobody has seen one since.','Scratched: The steps up are never where you left them. They are where you needed them, which is worse.','Chalked: If you can read this, you have a helm. If you have no helm, you cannot read this, so you are not reading it.'
]
};
const HGDWE_TAIL=['The water does not care which you choose.','Someone has scratched out a third line here, and then written it again.','Trust the arrows. Do not trust the weed.','Count your breaths at every crossing.','The fish keep to the left. Do as they do.','Do not stop here. Do not stop anywhere that has a sign.','The ink is the pond\'s. It will not last, so read it now.','Someone has underlined the word nearest, twice.'];
// SCALE SCHEME (read from the engine): a decor picture is drawn with width (NPC_H[k]*ratio, or 0.7 when the kind has no NPC_H) times d.sc, and height = width / ratio. So the height in world units is NPC_H[k]*sc, or 0.7*sc/ratio.
// A person is about 0.9 high, the walls of the Drowned Maze are 2.6. hgweSc(k,h) gives the sc that makes kind k exactly h high; hgweHt(d) reads a height back.
const hgweRatio=k=>{const im=IMG[k];return im&&im.width?im.width/im.height:1};
const hgweSc=(k,h)=>+(NPC_H[k]?h/NPC_H[k]:h*hgweRatio(k)/.7).toFixed(3);
const hgweHt=d=>(NPC_H[d.k]?NPC_H[d.k]:.7/hgweRatio(d.k))*(d.sc||1);
// the proportion table (true heights in world units; a person is about 0.9, the walls here 2.6). [kind pattern, lowest, highest]
const HGDWE_TBL=[[/^art_hgxstat[012367]$/,1.3,1.5],[/^art_hgxstat[45]$/,1.0,1.35],[/bookshelf/,1.0,1.2],[/furn_cabinet/,.75,.95],[/^art_wm_bell$/,.7,.8],[/^art_wm_boat$/,.8,.95],[/^uw_shellchest$/,.4,.5],
  [/^art_wm_(barrel|crate|keg|cask)$/,.35,.5],[/^art_wm_bucket$/,.22,.35],[/^art_wm_skeleton$/,.25,.4],[/^art_hgtb_(lamp_tall|glasspost)$/,1.0,1.4],[/^art_wm_(orb_pedestal|candelabra)$/,.5,.9],[/^art_wm_shrine$/,.9,1.1],[/^art_wm_mirror$/,1.1,1.3],
  [/^art_wm_scale$/,.6,.8],[/^art_wm_rune$/,.7,.95],[/^art_wm_chain$/,.9,1.2],[/^art_wm_crystal_/,.25,.7],[/^uw_amphora$/,.38,.55],[/^uw_clam$/,.25,.4],[/^uw_anemone$/,.22,.4],[/^yar_nets$/,.6,.9],[/^art_hgtb_lantern$/,.6,.85],
  [/^art_hgxprop\d+$/,.08,.55],[/^uw_vent0$/,.4,.55],[/^uw_timber$/,.4,.7],[/^yar_pots$/,.25,.4],[/^art_hgwm_moss/,.18,.36],[/^art_hgwm_rock/,.26,.5],[/^art_hgwm_grass/,.3,.72],[/^art_hgwm_reed/,.45,.85],[/^art_hgwm_algae/,.45,.9],[/^uw_seagrass$/,.25,.5]];
function hgweFixScale(L){let n=0;for(const d of L.decor){if(d.pic||!d.k)continue;const r=HGDWE_TBL.find(q=>q[0].test(d.k));if(!r||!IMG[d.k]||!IMG[d.k].width)continue;const h=hgweHt(d);
    if(h<r[1]-.005||h>r[2]+.005){d.sc=hgweSc(d.k,Math.max(r[1],Math.min(r[2],h)));n++}}return n}
const HGDWE_DIR=['north','north east','east','south east','south','south west','west','north west'];
const hgdweDir=(dx,dy)=>HGDWE_DIR[((Math.round(Math.atan2(dx,-dy)/(Math.PI/4))%8)+8)%8];
function hgdweBuild(L){
  if(L._hgdwe||(typeof window!=='undefined'&&window.HGDWE_OFF))return; // HGDWE_OFF: the audit switches this pass off to count the faults it mends
  const S=L.rows.length,rnd=hgdmRng(477900),have=k=>IMG[k]&&IMG[k].width,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.',D=[[0,-1],[1,0],[0,1],[-1,0]];
  const st=L._hgdw.stairs,from=[st[0].ax,st[0].ay],far=L._hgdw.far,rooms=(L._hgdw.roomList||[]);
  const info={thinned:0,vignettes:[],signs:0,props:0,notes:0,lights:[]};
  // ---------- 1. density and scale of the plants ----------
  const isPlant=d=>d.deco&&!d.block&&!d.pic&&!d.hgdtele&&/^(art_hgwm_|hgt_reeds|hgt_vine_roundleaf|uw_seagrass)/.test(d.k);
  const CL={art_hgwm_moss0:[.24,.34],art_hgwm_moss1:[.2,.28],art_hgwm_rock0:[.3,.46],art_hgwm_rock1:[.28,.44],art_hgwm_grass0:[.42,.68],art_hgwm_grass1:[.34,.52],art_hgwm_grass2:[.38,.6],art_hgwm_reed0:[.5,.82],art_hgwm_algae0:[.5,.85],art_hgwm_algae1:[.5,.8]}; // TARGET HEIGHTS in world units (a person is 0.9)
  const byCell=new Map();for(const d of L.decor)if(isPlant(d)){const c=d.x+','+d.y;(byCell.get(c)||byCell.set(c,[]).get(c)).push(d)}
  const drop=new Set(),PRI=k=>/rock/.test(k)?0:/grass|reed0/.test(k)?1:/algae/.test(k)?2:/moss/.test(k)?3:4;
  for(const [c,l] of byCell){l.sort((a,b)=>PRI(a.k)-PRI(b.k)||(rnd()-.5));
    const hasGrass=l.some(d=>/hgwm_(grass|reed)/.test(d.k));
    let n=0;for(const d of l){if(d.k==='hgt_vine_roundleaf'){drop.add(d);continue} // the pale round-leaf vine stood 2 persons tall and hid the notes: gone
      if(hasGrass&&/^(hgt_reeds|hgt_vine_roundleaf|uw_seagrass)/.test(d.k)){drop.add(d);continue}
      if(d.k==='hgt_reeds'){drop.add(d);continue} // the Hollow's pearly reed glows like a feather fan in the green water: the painted green reeds replace it
      if(/moss/.test(d.k)&&rnd()<.55){drop.add(d);continue}
      if(n>=2){drop.add(d);continue}n++}}
  // never more than two of one kind within two squares (three for the grasses, which come in four kinds): drop the most crowded one until none is left
  let keep=L.decor.filter(d=>!drop.has(d));
  for(let pass=0;pass<40;pass++){const pl=keep.filter(isPlant),byk=new Map();for(const d of pl)(byk.get(d.k)||byk.set(d.k,[]).get(d.k)).push(d);let cut=0;
    for(const [k,l] of byk){const lim=/grass|reed0/.test(k)?3:2;for(const d of l){if(drop.has(d))continue;let n=0;for(const e of l)if(!drop.has(e)&&Math.abs(e.x-d.x)<=2&&Math.abs(e.y-d.y)<=2)n++;if(n>lim){drop.add(d);cut++}}}
    keep=keep.filter(d=>!drop.has(d));if(!cut)break}
  L.decor.splice(0,L.decor.length,...keep);info.thinned=drop.size;
  CL.hgt_vine_roundleaf=[.6,.8];CL.hgt_reeds=[.5,.72];CL.uw_seagrass=[.3,.45];
  for(const d of L.decor){const c=CL[d.k];if(c&&d.deco&&!d.hgdwe)d.sc=hgweSc(d.k,c[0]+hash2(d.x,d.y,477)*(c[1]-c[0]));if(d.k==='uw_vent0')d.sc=hgweSc('uw_vent0',.5)} // a vent was wider than its square
  // the four chambers keep their low plants but lose most of the tall ones, so that a set piece can be seen from the door
  {const inR=(x,y)=>rooms.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);const tall=/^(art_hgwm_(reed0|grass0|grass2)|hgt_reeds|hgt_vine_roundleaf)/;
   for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(isPlant(d)&&tall.test(d.k)&&inR(d.x,d.y)&&hash2(d.x,d.y,77)<.75){L.decor.splice(i,1);info.thinned++}}}
  // ---------- helpers for the set pieces ----------
  const nOpen=L.rows.reduce((a,r)=>a+r.split('').filter(c=>c==='.').length,0);
  const blocked=new Set(L.decor.filter(d=>d.block&&!d.walk).map(d=>d.x+','+d.y));
  const occupied=new Set(L.decor.filter(d=>!isPlant(d)&&!/^art_hgdf_vine/.test(d.k)).map(d=>d.x+','+d.y).concat(L.items.map(i=>i.x+','+i.y),L.enemies.map(e=>e.x+','+e.y),st.map(s=>s.ax+','+s.ay)));
  const reachOK=c=>{const b=new Set(blocked);b.add(c);const seen=hgdw2Flood(L,from,b);return seen.size===nOpen-b.size};
  const sc=(k,h)=>hgweSc(k,h);
  const itemCells=new Set(L.items.map(i=>i.x+','+i.y).concat(L.enemies.map(e=>e.x+','+e.y)));
  const prop=(k,x,y,h,o)=>{o=o||{};if(!have(k)||!open(x,y))return false;const c=x+','+y;
    if(o.block){if(blocked.has(c)||itemCells.has(c)||!reachOK(c))return false}
    const e=Object.assign({k,x,y,block:!!o.block,walk:!o.block,deco:!o.npc,sc:+sc(k,h).toFixed(3),hgdwe:1},o);
    // a small thing may share a square with one other small thing, never with a solid one
    L.decor.push(e);if(o.block)blocked.add(c);occupied.add(c);info.props++;
    // a set piece square keeps at most one plant
    let seenP=0;for(let i=0;i<L.decor.length;i++){const d=L.decor[i];if(d.x===x&&d.y===y&&isPlant(d)&&++seenP>0){L.decor.splice(i,1);i--}}
    return true};
  const anyProp=(k,cands,h,o)=>{for(const [x,y] of cands)if(prop(k,x,y,h,o))return true;return false};
  const wallNote=(x,y,txt,o)=>{ // a note or board fixed to a wall of the square (x,y): the first free wall side
    for(const [a,b] of (o&&o.pref?o.pref:D)){if(!L.rows[y+b]||L.rows[y+b][x+a]!=='#')continue;
      if(L.decor.some(d=>d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b&&!/^art_hgdf_vine/.test(d.k)))continue;
      // a vine on this very wall face makes way for the note
      for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b)L.decor.splice(i,1)}
      L.decor.push({k:(o&&o.k)||'hl_p_note',x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,npc:'hgdw_note',hgdwText:txt,bob:(o&&o.bob)||.6,hgdwe:1});info.notes++;return true}return false};
  const light=(x,y,col,kI,r2)=>HGDWE.lights.push({x,y,col,kI:(kI||1.1)*.8,r2:Math.round((r2||36)*.9)}),L_TEAL=[.5,1,.9],L_AMB=[1,.78,.42],L_VIO=[.8,.55,1],L_PINK=[1,.6,.75];
  const free=(x,y)=>open(x,y)&&!occupied.has(x+','+y);
  const done=(name,x,y)=>info.vignettes.push({name,x,y});
  // ---------- 2a. four set pieces in the four ordinary chambers (nearest the steps first) ----------
  const ord=rooms.filter(r=>!(Math.abs(r.cx-far.x)<2&&Math.abs(r.cy-far.y)<2)).sort((a,b)=>Math.hypot(a.cx-from[0],a.cy-from[1])-Math.hypot(b.cx-from[0],b.cy-from[1]));
  const R=(r,dx,dy)=>[r.x+Math.max(0,Math.min(r.w-1,dx<0?r.w+dx:dx)),r.y+Math.max(0,Math.min(r.h-1,dy<0?r.h+dy:dy))];
  const at=(r,dx,dy,f)=>{const [x,y]=R(r,dx,dy);return f(x,y)};
  const THEMES=[
   ['Garden of Saints',r=>{ // four saints in a ring round the vent, each a different height, the ring not even
     const o=[['art_hgxstat0',-2,-1,1.45],['art_hgxstat7',2,1,1.3],['art_hgxstat3',0,-2,1.5],['art_hgxstat6',-1,2,1.35]];
     for(const [k,dx,dy,h] of o){const x=Math.max(r.x,Math.min(r.x+r.w-1,r.cx+dx)),y=Math.max(r.y,Math.min(r.y+r.h-1,r.cy+dy));prop(k,x,y,h,{block:true})}
     at(r,0,-1,(x,y)=>prop('art_hgxprop8',x,y,.2)); at(r,-2,-2,(x,y)=>prop('art_hgxprop9',x,y,.34)); at(r,r.w-1,1,(x,y)=>prop('art_hgdf_plant3',x,y,.45));
     at(r,0,0,(x,y)=>wallNote(x,y,HGDWE_N.garden,{pref:[[0,-1],[-1,0],[1,0],[0,1]]}));
     const [lx,ly]=R(r,-1,-1);light(lx,ly,L_TEAL,1.2,40);return [r.cx,r.cy]}],
   ['Drowned Library',r=>{ // three different pieces of furniture, never three of one kind in a row
     const ks=['art_wm_bookshelf','art_hgtb_furn_cabinet','art_hgtb_furn_bookshelf'],hs=[1.12,.82,1.1];
     for(let i=0;i<3;i++)at(r,1+2*i,0,(x,y)=>prop(ks[i],x,y,hs[i],{block:true}));
     at(r,r.w-2,1,(x,y)=>prop('art_hgxprop3',x,y,.1));at(r,1,r.h-2,(x,y)=>prop('art_hgxprop3',x,y,.09,{ox:.2}));at(r,2,2,(x,y)=>prop('art_hgxprop2',x,y,.24,{ox:-.1}));
     at(r,r.w-1,r.h-1,(x,y)=>prop('art_wm_skeleton',x,y,.34,{block:true}));
     at(r,0,r.h-1,(x,y)=>prop('art_wm_cage_lantern',x,y,.55));
     const [nx,ny]=R(r,0,2);wallNote(nx,ny,HGDWE_N.lib,{pref:[[-1,0],[0,-1]]});const [mx,my]=R(r,r.w-1,3);wallNote(mx,my,HGDWE_N.lib2,{pref:[[1,0],[0,1]]});
     const [lx,ly]=R(r,0,r.h-1);light(lx,ly,L_AMB,1.25,46);return [r.cx,r.cy]}],
   ['Sunken Bell',r=>{ // the bell hangs from its old frame; reading the bell gives its story
     const x=r.cx,y=r.cy-1;prop('art_wm_bell',x,y,.75,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.bell});
     at(r,0,0,(a,b)=>prop('art_wm_crystal_teal',a,b,.55,{block:true}));at(r,r.w-1,r.h-1,(a,b)=>prop('art_wm_crystal_teal',a,b,.34));
     at(r,r.w-1,0,(a,b)=>prop('art_hgxprop10',a,b,.1));at(r,0,r.h-1,(a,b)=>prop('art_hgxprop9',a,b,.36));at(r,r.w-1,2,(a,b)=>prop('art_hgxprop6',a,b,.24));
     const fx=r.cx+1,fy=r.cy-1;prop('art_wm_chain',fx,fy,1.05,{block:true});
     const [lx,ly]=R(r,0,0);light(lx,ly,L_TEAL,1.4,50);return [x,y]}],
   ['Wreck of the Ferry',r=>{
     const x=Math.max(r.x,r.cx-1),y=Math.min(r.y+r.h-1,r.cy+1);anyProp('art_wm_boat',[[x,y],[r.cx+1,r.cy+1],[r.cx-1,r.cy-1],[r.cx+1,r.cy-1],[r.cx,r.cy+2]],.85,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.wreck});
     at(r,r.w-1,r.h-1,(a,b)=>prop('art_wm_skeleton',a,b,.34));at(r,1,1,(a,b)=>prop('art_wm_barrel',a,b,.45,{block:true}));
     at(r,r.w-1,0,(a,b)=>prop('uw_amphora',a,b,.48));at(r,1,0,(a,b)=>prop('art_wm_bucket',a,b,.26,{ox:-.15}));at(r,0,r.h-2,(a,b)=>prop('art_hgxprop12',a,b,.3));
     const [lx,ly]=R(r,-1,-1);light(lx,ly,L_AMB,1.2,40);return [x,y]}]];
  ord.forEach((r,i)=>{const t=THEMES[i];if(!t)return;try{const p=t[1](r);done(t[0],p[0],p[1])}catch(e){console.error('hgdwe',t[0],e)}});
  // ---------- 2b. nooks in dead ends ----------
  const deg=(x,y)=>D.filter(([a,b])=>open(x+a,y+b)).length;
  const dead=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(open(x,y)&&deg(x,y)===1&&!occupied.has(x+','+y)&&Math.hypot(x-from[0],y-from[1])>2&&!st.some(q=>q.ax===x&&q.ay===y))dead.push([x,y]);
  // chests that stood in the middle of a one-square corridor (they blocked half the way) are carried to the nearest dead end that has nothing in it
  {const inRoom=(x,y)=>rooms.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);let moved=0;
   for(const d of L.decor){if(d.k!=='uw_shellchest'||!d.block||deg(d.x,d.y)!==2||inRoom(d.x,d.y)||(far&&Math.abs(d.x-far.x)<=1&&Math.abs(d.y-far.y)<=1))continue;
     const c=dead.filter(q=>!occupied.has(q[0]+','+q[1])&&!blocked.has(q[0]+','+q[1])).sort((a,b)=>Math.hypot(a[0]-d.x,a[1]-d.y)-Math.hypot(b[0]-d.x,b[1]-d.y));
     blocked.delete(d.x+','+d.y);occupied.delete(d.x+','+d.y);
     const t=c.find(q=>reachOK(q[0]+','+q[1]));if(t){d.x=t[0];d.y=t[1];moved++}
     blocked.add(d.x+','+d.y);occupied.add(d.x+','+d.y)}
   for(const d of L.decor)if(d.k==='uw_shellchest'&&d.block){for(let i=L.decor.length-1;i>=0;i--){const e=L.decor[i];if(isPlant(e)&&e.x===d.x&&e.y===d.y)L.decor.splice(i,1)}}
   info.chestsMoved=moved;for(let i=dead.length-1;i>=0;i--)if(occupied.has(dead[i][0]+','+dead[i][1]))dead.splice(i,1)}
  const picked=[];dead.sort((a,b)=>(hash2(a[0],a[1],9)-hash2(b[0],b[1],9)));
  const runOf=c=>{const o=D.find(([a,b])=>open(c[0]+a,c[1]+b));if(!o)return 0;let n=0;while(n<9&&open(c[0]+o[0]*(n+1),c[1]+o[1]*(n+1)))n++;return n}; // how far a prop in this dead end can be seen along a straight passage
  dead.sort((a,b)=>(runOf(b)>=3)-(runOf(a)>=3));
  const spots=[];for(const c of dead){if(Math.hypot(c[0]-from[0],c[1]-from[1])>5&&!rooms.some(r=>c[0]>=r.x-1&&c[0]<=r.x+r.w&&c[1]>=r.y-1&&c[1]<=r.y+r.h)&&spots.every(q=>Math.abs(q[0]-c[0])+Math.abs(q[1]-c[1])>=9))spots.push(c)}
  const endWall=(x,y)=>{const o=D.find(([a,b])=>open(x+a,y+b));return o?[[-o[0],-o[1]]].concat(D):D};
  const clearAt=(x,y)=>{for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.x===x&&d.y===y&&isPlant(d)){L.decor.splice(i,1);info.thinned++}}};
  const NOOKS=[
   ['Saint\'s shrine',(x,y)=>{prop('art_wm_shrine',x,y,1.0,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.shrine});prop('art_hgxprop2',x,y,.22,{ox:-.3,oy:.2});prop('art_hgxprop2',x,y,.16,{ox:.32,oy:.22});light(x,y,L_VIO,1.4,40)}],
   ['Mirror',(x,y)=>{prop('art_wm_mirror',x,y,1.2,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.mirror});light(x,y,L_VIO,1.1,34)}],
   ['Diver\'s camp',(x,y)=>{prop('uw_shellchest',x,y,.45,{block:true,hgdwTier:2});prop('art_wm_skeleton',x,y,.34,{ox:-.25,oy:.12,block:false});prop('art_wm_bucket',x,y,.26,{ox:.3,oy:.2});wallNote(x,y,HGDWE_N.diver,{pref:endWall(x,y)});light(x,y,L_TEAL,1.0,30)}],
   ['Pearl grotto',(x,y)=>{prop('uw_clam',x,y,.38,{block:true,ox:-.1,npc:'hgdw_note',hgdwText:HGDWE_N.grotto});prop('art_hgxprop8',x,y,.2,{ox:.25,oy:.15});prop('art_wm_crystal_teal',x,y,.4,{ox:.28,oy:-.2});light(x,y,L_TEAL,1.3,34)}],
   ['The scales',(x,y)=>{prop('art_wm_scale',x,y,.7,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.scales});prop('art_hgxprop10',x,y,.08,{ox:.3,oy:.2});light(x,y,L_AMB,1.0,30)}],
   ['Smugglers\' cache',(x,y)=>{prop('art_wm_crate',x,y,.42,{block:true,ox:-.15,npc:'hgdw_note',hgdwText:HGDWE_N.cache});prop('art_wm_keg',x,y,.4,{ox:.3,oy:.08});prop('art_wm_crate_lid',x,y,.14,{ox:.05,oy:.3});light(x,y,L_AMB,1.0,30)}],
   ['Lantern nook',(x,y)=>{prop('art_hgtb_lantern',x,y,.72,{ox:-.2,block:true});prop('art_hgxprop2',x,y,.24,{ox:.3,oy:.12});prop('uw_amphora',x,y,.42,{ox:.0,oy:.22});wallNote(x,y,HGDWE_N.lantern,{pref:endWall(x,y)});light(x,y,L_AMB,1.4,46)}],
   ['Rune stone',(x,y)=>{prop('art_wm_rune',x,y,.85,{block:true,npc:'hgdw_note',hgdwText:HGDWE_N.rune,deco:false});light(x,y,L_VIO,1.1,34)}],
   ['The owl',(x,y)=>{prop('art_hgxstat5',x,y,1.3,{block:true});wallNote(x,y,HGDWE_N.owl,{pref:endWall(x,y)});light(x,y,L_TEAL,1.0,30)}],
   ['Orb pedestal',(x,y)=>{prop('art_wm_orb_pedestal',x,y,.8,{block:true});prop('art_hgxprop9',x,y,.3,{ox:-.3,oy:.2});wallNote(x,y,HGDWE_N.orb,{pref:endWall(x,y)});light(x,y,L_VIO,1.4,40)}],
   ['Fisher\'s net rack',(x,y)=>{prop('yar_nets',x,y,.8,{block:true,ox:-.1});prop('yar_pots',x,y,.3,{ox:.3,oy:.2});prop('art_wm_bucket',x,y,.24,{ox:-.3,oy:.25});wallNote(x,y,HGDWE_N.nets,{pref:endWall(x,y)});light(x,y,L_AMB,.9,26)}],
   ['Anemone bed',(x,y)=>{prop('uw_anemone',x,y,.36,{block:true,ox:-.15});prop('uw_anemone',x,y,.26,{ox:.3,oy:.15});prop('art_hgxprop9',x,y,.3,{ox:.05,oy:.3});wallNote(x,y,HGDWE_N.anem,{pref:endWall(x,y)});light(x,y,L_PINK,1.1,30)}],
   ['Candles for the lost',(x,y)=>{prop('art_wm_candelabra',x,y,.8,{block:true});prop('art_hgxprop2',x,y,.2,{ox:.3,oy:.2});prop('art_hgxprop0',x,y,.1,{ox:-.3,oy:.25});wallNote(x,y,HGDWE_N.candles,{pref:endWall(x,y)});light(x,y,L_AMB,1.3,40)}]];
  spots.slice(0,NOOKS.length).forEach((c,i)=>{try{clearAt(c[0],c[1]);for(const [a,b] of D)if(open(c[0]+a,c[1]+b))clearAt(c[0]+a,c[1]+b);NOOKS[i][1](c[0],c[1]);done(NOOKS[i][0],c[0],c[1])}catch(e){console.error('hgdwe nook',e)}});
  // every other dead end that has nothing gets a short note, or a small prop
  let k2=0;for(const [x,y] of dead){if(spots.slice(0,NOOKS.length).some(q=>q[0]===x&&q[1]===y))continue;if(occupied.has(x+','+y))continue;
    if(k2%3===2)prop(['art_hgxprop8','art_hgxprop9','art_hgxprop12'][(k2/3|0)%3],x,y,[.42,.5,.55][(k2/3|0)%3]);
    else if(wallNote(x,y,HGDWE_N.end[k2%HGDWE_N.end.length],{pref:endWall(x,y)}))occupied.add(x+','+y);k2++}
  // ---------- 2c. the Warden's board, on the wall of the last passage before the Warden's chamber ----------
  {const fr=rooms.find(r=>Math.abs(r.cx-far.x)<2&&Math.abs(r.cy-far.y)<2);
   if(fr){let best=null,bd=1e9;for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(!open(x,y)||x>=fr.x&&x<fr.x+fr.w&&y>=fr.y&&y<fr.y+fr.h)continue;const d=Math.max(Math.abs(x-fr.cx)-fr.w/2,Math.abs(y-fr.cy)-fr.h/2);if(d<bd&&d>=0&&deg(x,y)<=2&&D.some(([a,b])=>L.rows[y+b]&&L.rows[y+b][x+a]==='#')){bd=d;best=[x,y]}}
     if(best&&wallNote(best[0],best[1],HGDWE_N.board,{k:have('art_wm_noticeboard')?'art_wm_noticeboard':'hl_p_note',bob:.55})){light(best[0],best[1],L_AMB,.8,22);done('Warden\'s board',best[0],best[1])}}}
  // ---------- 3. signposts at the junctions, each one true: real path lengths and the first turn to take, in eight different voices ----------
  {const dist=(tx,ty)=>{const m=new Map([[tx+','+ty,0]]),q=[[tx,ty]];for(let i=0;i<q.length;i++){const [x,y]=q[i],dd=m.get(x+','+y);for(const [a,b] of D){const nx=x+a,ny=y+b,k=nx+','+ny;if(!m.has(k)&&open(nx,ny)){m.set(k,dd+1);q.push([nx,ny])}}}return m};
   const dS=st.map(s=>dist(s.ax,s.ay)),dF=dist(far.x,far.y),CD=['north','east','south','west'];
   const first=(m,x,y)=>{let best=0,bd=1e9;D.forEach(([a,b],i)=>{const v=m.get((x+a)+','+(y+b));if(v!==undefined&&v<bd){bd=v;best=i}});return CD[best]};
   const VOICE=[
    (n,d1,m,d2)=>'Carved in the wall at the crossing: THE STEPS UP, '+n+' squares on, by the '+d1+' passage. THE WARDEN, '+m+' squares on, by the '+d2+' passage.',
    (n,d1,m,d2)=>'A lantern-maker\'s mark and two lines of chalk: Up and out is '+n+' squares, '+d1+' first. The Warden sleeps '+m+' squares off, '+d2+' first.',
    (n,d1,m,d2)=>'Painted on the stone in fading white: Dry land, '+n+' squares away, start '+d1+'. The big room with the Warden in it, '+m+' squares away, start '+d2+'.',
    (n,d1,m,d2)=>'Scratched with a spoon handle: If you are tired, the steps up are '+n+' squares, '+d1+'. If you are brave, the Warden is '+m+' squares, '+d2+'.',
    (n,d1,m,d2)=>'A ferryman\'s tally, cut deep: Air above, '+n+', leave '+d1+'. Trouble below, '+m+', leave '+d2+'. The numbers are squares.',
    (n,d1,m,d2)=>'Chiselled in neat capitals: STAIRS '+n+' ('+d1.toUpperCase()+'). WARDEN '+m+' ('+d2.toUpperCase()+'). KEEP TO THE MIDDLE OF THE PASSAGE.',
    (n,d1,m,d2)=>'Written in lamp oil on a wet beam: I counted it twice. '+n+' squares to the stairs, going '+d1+'. '+m+' squares to the Warden, going '+d2+'.',
    (n,d1,m,d2)=>'A sailor\'s rhyme, scratched small: '+n+' to the light, '+m+' to the dark. The light lies '+d1+' from here, the dark lies '+d2+'.']; 
   const js=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(open(x,y)&&deg(x,y)>=3&&!occupied.has(x+','+y)&&!rooms.some(r=>x>=r.x-1&&x<=r.x+r.w&&y>=r.y-1&&y<=r.y+r.h))js.push([x,y]);
   js.sort((a,b)=>hash2(a[0],a[1],4)-hash2(b[0],b[1],4));const got=[];
   for(const [x,y] of js){if(got.length>=8)break;if(got.some(q=>Math.abs(q[0]-x)+Math.abs(q[1]-y)<8))continue;
     let bi=0,bd=1e9;dS.forEach((m,i)=>{const v=m.get(x+','+y);if(v!==undefined&&v<bd){bd=v;bi=i}});
     const n=bd,m=dF.get(x+','+y);if(m===undefined||n>=1e9)continue;
     const txt=VOICE[got.length%VOICE.length](n,first(dS[bi],x,y),m,first(dF,x,y))+' '+HGDWE_TAIL[got.length%HGDWE_TAIL.length];
     if(wallNote(x,y,txt,{bob:.7})){got.push([x,y]);info.signs++;occupied.add(x+','+y)}}}
  // ---------- 4. fish: small shoals that swim back and forth along real straight passages, low, each fish facing the way it swims (the old lanes ran through walls at head height) ----------
  try{const U=UWS[HGDWE.ID];if(U&&U.swim&&typeof HGFW!=='undefined'&&HGFW.fish){U.swim.length=0;
    const runs=[];for(let y=1;y<S-1;y++){let x=1;while(x<S-1){if(!open(x,y)){x++;continue}const x0=x;while(open(x,y))x++;if(x-x0>=4)runs.push([x0+.5,y+.5,x-.5,y+.5,0])}}
    for(let x=1;x<S-1;x++){let y=1;while(y<S-1){if(!open(x,y)){y++;continue}const y0=y;while(open(x,y))y++;if(y-y0>=4)runs.push([x+.5,y0+.5,x+.5,y-.5,1])}}
    runs.sort((a,b)=>hash2(a[0]*2,a[1]*2,8)-hash2(b[0]*2,b[1]*2,8));const SP=['fw_carp','fw_perch','fw_trout','fw_goldfish','fw_bream','fw_pike','fw_tench'],fish=[],Rh=(a,b,c)=>hash2(a,b,c+4770);
    runs.slice(0,40).forEach((r,i)=>{const k=i%11===5?'fw_minnows':SP[(i*3+((Rh(i,1,1)*7)|0))%7],n=k==='fw_minnows'?1:(i%4===3?1:2+((Rh(i,2,2)*4)|0)),base=.45+Rh(i,3,3)*.35,len=Math.hypot(r[2]-r[0],r[3]-r[1]);
      for(let m=0;m<n;m++)fish.push({k,A:[r[0],r[1]],B:[r[2],r[3]],vert:r[4],sp:(.55+Rh(i,4,4)*.5)*3/Math.max(3,len)*(.9+Rh(i,m,5)*.2),ph:Rh(i,5,5)*2+m*.045*(1+Rh(i,m,6)),lat:(Rh(i,m,7)-.5)*.5,h:.08+Rh(i,m,8)*.38+(m%2)*.05,sz:k==='fw_minnows'?.4:base*.75*(.8+Rh(i,m,9)*.4)})});
    L._hgdweFish=fish;info.fish=fish.length}}catch(e){console.error('hgdwe fish',e)}
  // ---------- 5. light and bespoke detail: a pool of coloured light every few squares, something small and different along the long passages ----------
  const wallPic=(k,x,y,o)=>{o=o||{}; // a picture hung on the first wall face of the square that has no sign on it (a vine on that face makes way)
    for(const [a,b] of D){if(!L.rows[y+b]||L.rows[y+b][x+a]!=='#')continue;
      if(L.decor.some(d=>d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b&&!/^art_hgdf_vine/.test(d.k)))continue;
      for(let i=L.decor.length-1;i>=0;i--){const d=L.decor[i];if(d.pic&&d.x===x&&d.y===y&&d.wd&&d.wd[0]===a&&d.wd[1]===b)L.decor.splice(i,1)}
      L.decor.push({k,x,y,wd:[a,b],pic:1,block:false,walk:true,deco:true,bob:o.bob||.85,hgdwe:1});info.props++;return true}return false};
  {const L_WARM=[1,.86,.62],L_AQUA=[.45,.95,1],cells=[];for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(open(x,y))cells.push([x,y]);
   cells.sort((a,b)=>hash2(a[0],a[1],31)-hash2(b[0],b[1],31));
   const lit=(x,y,r)=>HGDWE.lights.some(q=>Math.hypot(q.x-x,q.y-y)<r);
   const SRC=[ // kind of light source: [weight, how it is made, colour, strength, reach]
     [3,(x,y)=>wallPic('art_wm_lantern_gold',x,y),L_AMB,1.15,36,1],[1.4,(x,y)=>wallPic('art_wm_lantern_violet',x,y),L_VIO,1.1,34,1],[1.2,(x,y)=>wallPic('art_wm_lantern_lilac',x,y),L_PINK,1.05,34,1],
     [1.6,(x,y)=>prop('art_hgxprop4',x,y,.34),L_AQUA,1,30],[1.4,(x,y)=>prop('art_hgtb_plant_glowshrooms',x,y,.36,{ox:.1}),L_TEAL,1,30],[1.2,(x,y)=>prop('art_wm_crystal_small',x,y,.3,{oy:.1}),L_VIO,1.1,32],
     [1.8,(x,y)=>prop('art_hgtb_lamp_tall',x,y,1.15,{ox:.28}),L_WARM,1.2,40],[.8,(x,y)=>prop('art_hgtb_glasspost',x,y,1.3,{ox:-.3}),L_AQUA,1.1,38],[1,(x,y)=>prop('art_hgdf_plant3',x,y,.5,{ox:-.2}),L_AQUA,.95,28]];
   const TW=SRC.reduce((a,q)=>a+q[0],0),pickSrc=(x,y)=>{let r=hash2(x,y,41)*TW;for(const q of SRC){if((r-=q[0])<=0)return q}return SRC[0]};
   let nl=0;
   for(const pass of [0,1]){for(const [x,y] of cells){if(blocked.has(x+','+y)||itemCells.has(x+','+y))continue;const dg=deg(x,y);if(pass===0&&dg<3)continue;if(lit(x,y,pass===0?4.6:3.7))continue;
       if(L._hgdw&&st.some(q=>Math.hypot(q.ax-x,q.ay-y)<2.5))continue;
       let q=pickSrc(x,y);if(q[5]&&!D.some(([a,b])=>L.rows[y+b]&&L.rows[y+b][x+a]==='#'))q=SRC[3];
       const ok=q[1](x,y);if(ok===false){continue}
       light(x,y,q[2],q[3],q[4]);nl++}}
   info.glow=nl;
   // the stairs up each get a warm landing lamp and a small thing to mark the way
   st.forEach((s,i)=>{if(!lit(s.ax,s.ay,2.5)){light(s.ax,s.ay,L_WARM,1.3,44)}
     const o=D.find(([a,b])=>open(s.ax+a,s.ay+b));prop(['art_hgxprop7','art_hgxprop8','art_hgxprop9','art_hgxprop12'][i%4],s.ax,s.ay,[.18,.2,.3,.3][i%4],{ox:-.3,oy:.25});wallPic('art_wm_lantern_gold',s.ax,s.ay,{bob:.95})});
   // small things in the long passages: no two in a row alike
   const DET=[['art_hgxprop0',.12],['art_hgxprop1',.22],['art_hgxprop6',.24],['art_hgxprop7',.18],['art_hgxprop8',.2],['art_hgxprop9',.34],['art_hgxprop11',.12],['art_hgxprop12',.3],['art_hgxprop15',.2],['art_hgxprop13',.14],['uw_timber',.55],['yar_pots',.3],['uw_clam',.28],['uw_amphora',.42],['art_wm_skeleton',.3],['art_wm_crate_lid',.15],['art_hgxprop5',.4],['art_hgxprop2',.2]];
   const dsh=DET.map((e,i)=>[hash2(i,5,9),e]).sort((a,b)=>a[0]-b[0]).map(q=>q[1]);let di=0,nd=0;const placedD=[];
   const straight=(x,y)=>(open(x-1,y)&&open(x+1,y)&&!open(x,y-1)&&!open(x,y+1))||(open(x,y-1)&&open(x,y+1)&&!open(x-1,y)&&!open(x+1,y));
   for(const [x,y] of cells){if(occupied.has(x+','+y)||!straight(x,y)||placedD.some(q=>Math.abs(q[0]-x)+Math.abs(q[1]-y)<6)||st.some(q=>Math.abs(q.ax-x)+Math.abs(q.ay-y)<3))continue;
     const [k,h]=dsh[di%dsh.length];if(prop(k,x,y,h,{ox:(hash2(x,y,2)-.5)*.5,oy:(hash2(x,y,3)-.5)*.3})){di++;nd++;placedD.push([x,y]);occupied.add(x+','+y)}}
   info.details=nd}
  // ---------- 6. dead ends that still hold nothing, and the barrel that stood in a corridor ----------
  {for(const d of L.decor)if(d.k==='art_wm_barrel'&&d.block&&deg(d.x,d.y)<3&&rooms.some(r=>d.x>=r.x&&d.x<r.x+r.w&&d.y>=r.y&&d.y<r.y+r.h)){const r=rooms.find(r=>d.x>=r.x&&d.x<r.x+r.w&&d.y>=r.y&&d.y<r.y+r.h);
     const c=[];for(let y=r.y+1;y<r.y+r.h-1;y++)for(let x=r.x+1;x<r.x+r.w-1;x++)if(!occupied.has(x+','+y)&&!blocked.has(x+','+y)&&deg(x,y)>=4)c.push([x,y]);
     if(c.length){blocked.delete(d.x+','+d.y);occupied.delete(d.x+','+d.y);const t=c[(hash2(d.x,d.y,6)*c.length)|0];d.x=t[0];d.y=t[1];blocked.add(t[0]+','+t[1]);occupied.add(t[0]+','+t[1])}}
   let n=0;for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++)if(open(x,y)&&deg(x,y)===1&&!L.decor.some(d=>d.x===x&&d.y===y&&!isPlant(d)&&!/^art_hgdf_vine|^uw_vent/.test(d.k))&&!L.items.some(i=>i.x===x&&i.y===y)&&!L.enemies.some(e=>e.x===x&&e.y===y)){
       const ks=[['art_hgxprop12',.3],['art_hgxprop9',.34],['art_wm_skeleton',.3],['art_hgxprop8',.2]][(n++)%4];clearAt(x,y);prop(ks[0],x,y,ks[1],{ox:.1});if(!HGDWE.lights.some(q=>Math.hypot(q.x-x,q.y-y)<3))light(x,y,L_TEAL,.9,24)}}
  // ---------- 7. creatures keep off the set pieces: three squares clear of every prop and sign worth looking at ----------
  {const prot=[];for(const v of info.vignettes)prot.push([v.x,v.y]);
   for(const d of L.decor)if(d.k==='uw_shellchest')prot.push([d.x,d.y]);for(const i of L.items)prot.push([i.x,i.y]);for(const s of st)prot.push([s.ax,s.ay]);
   for(const d of L.decor)if(d.hgdwText&&(d.pic||d.npc))prot.push([d.x,d.y]); // signs and readable things too
   const clear=(x,y)=>prot.every(q=>Math.hypot(q[0]-x,q[1]-y)>=3),isFar=e=>Math.abs(e.x-far.x)<=2&&Math.abs(e.y-far.y)<=2;let moved=0;
   const taken=new Set(L.enemies.map(e=>e.x+','+e.y));
   for(const e of L.enemies){if(isFar(e)||clear(e.x,e.y))continue;let best=null,bd=1e9;
     for(let y=1;y<S-1;y++)for(let x=1;x<S-1;x++){if(!open(x,y)||blocked.has(x+','+y)||taken.has(x+','+y)||!clear(x,y)||isFar({x,y}))continue;const d=Math.hypot(x-e.x,y-e.y);if(d<bd){bd=d;best=[x,y]}}
     if(best){taken.delete(e.x+','+e.y);e.x=best[0];e.y=best[1];taken.add(best[0]+','+best[1]);moved++}}
   info.enemiesMoved=moved}
  // ---------- 8. one scale table for everything solid: any outlier is brought back inside its range (heights in world units, a person is 0.9) ----------
  info.scaleFixed=hgweFixScale(L);
  // final tidy: no square holds more than two things unless it is a set piece, and a plant never shares a square with a vent beyond one
  {const cc=new Map();for(const d of L.decor)if(!d.pic){const c=d.x+','+d.y;(cc.get(c)||cc.set(c,[]).get(c)).push(d)}
   for(const [c,l] of cc){if(l.length<3||l.some(d=>d.hgdwe))continue;let n=l.length;for(const d of l.slice().reverse()){if(n<=2)break;if(isPlant(d)){const i=L.decor.indexOf(d);if(i>=0){L.decor.splice(i,1);n--;info.thinned++}}}}}
  info.lights=HGDWE.lights.length;L._hgdwe=info}
{const _b=hgdwBuild;hgdwBuild=function(){const had=!!LEVELS[HGDW.ID];_b.apply(this,arguments);const L=LEVELS[HGDW.ID];if(!had&&L&&L._hgdw)try{hgdweBuild(L)}catch(e){console.error('hgdwe',e)}}}
// the coloured pools of light: warm lantern glow, teal crystal glow and violet shrine glow (calm, no flicker)
{const _sl=setupLights;setupLights=function(){_sl.apply(this,arguments);try{if(LEVEL===HGDW.ID)for(const q of HGDWE.lights)LIGHTS.push({x:q.x+.5,y:q.y+.5,ph:hash2(q.x,q.y,21)*6.28,key:-6000-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:q.col,kI:q.kI,range2:q.r2})}catch(e){console.error('hgdwe lights',e)}}}

// the fish of the Drowned Maze: drawn by this pass (the maze's own lanes were emptied above); each one faces the way it swims
const hgweFlipC=new Map();
function hgweFlip(im){let c=hgweFlipC.get(im);if(!c){c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(im.width,0);x.scale(-1,1);x.drawImage(im,0,0);hgweFlipC.set(im,c)}return c}
{const _u=uwSprites;uwSprites=function(out){if(LEVEL===HGDWE.ID&&UWS[LEVEL]&&UWS[LEVEL].swim&&LEVELS[LEVEL]&&LEVELS[LEVEL]._hgdweFish)UWS[LEVEL].swim.length=0; // the maze's own lanes (overhead, through walls) are replaced by the fish below
  _u.apply(this,arguments);
  try{if(LEVEL!==HGDWE.ID)return;const L=LEVELS[HGDWE.ID],F=L&&L._hgdweFish;if(!F||!G.C)return;const t=G.time,a=G.C.a,dX=Math.cos(a),dY=Math.sin(a),px=G.P.x+.5,py=G.P.y+.5;
    for(let i=0;i<F.length;i++){const f=F[i],ph=(t*f.sp+f.ph)%2,u=ph<1?ph:2-ph,dir=ph<1?1:-1,x=f.A[0]+(f.B[0]-f.A[0])*u+(f.vert?f.lat*.5:0),y=f.A[1]+(f.B[1]-f.A[1])*u+(f.vert?0:f.lat*.5);
      if(Math.abs(x-px)>13||Math.abs(y-py)>13)continue;const fr=((t*3.4+i)|0)&1,im=IMG['uw_'+f.k+'_'+fr];if(!im)continue;
      const vx=(f.B[0]-f.A[0])*dir,vy=(f.B[1]-f.A[1])*dir,right=(dX*vy-dY*vx)>0,hh=(NPC_H['uw_'+f.k+'_0']||.4)*f.sz,w=hh*im.width/im.height;
      out.push({x,y,img:right?hgweFlip(im):im,w,bob:f.h+Math.sin(t*.9+i)*.04,decor:{walk:true,k:'uw_sw'+(i%9)}})}}catch(e){}}}

/* ==========================================================================
   THE THREE BOAT LAKES OF THE MAZE (level 475), each given its own look: a coloured light over the water, its own jetty details at both docks, its own landmark standing in the open water
   (with a faded upside-down copy under it, the reflection), and its own small life along the shore. Runs after hgd_lakes.js has filled the lakes (hgdBuild wrapper), so nothing here is swept away:
   everything that stands on water carries hgdl:1. Lights are kept in HGDWL.lights and added by the setupLights wrapper at the end of the file.
   ========================================================================== */
const HGDWL={lights:[],refl:new Map(),n:0};
// a faded, upside-down, water-tinted copy of a picture, hung under it at the water line
function hgweRefl(k,h,col){const im=IMG[k];if(!im||!im.width)return null;const id=k+'|'+Math.round(h*100);let key=HGDWL.refl.get(id);
  if(!key){key='ltree7'+(HGDWL.n++); // a name the engine draws without a ground shadow
    const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(0,im.height);x.scale(1,-1);x.drawImage(im,0,0);
    x.globalCompositeOperation='source-atop';x.globalAlpha=.4;x.fillStyle=col||'#2a6a70';x.fillRect(0,0,c.width,c.height);
    x.globalCompositeOperation='destination-in';x.globalAlpha=1;const g=x.createLinearGradient(0,im.height,0,0);g.addColorStop(0,'rgba(0,0,0,.5)');g.addColorStop(.7,'rgba(0,0,0,.12)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
    IMG[key]=c;HGDWL.refl.set(id,key)}
  NPC_H[key]=h;return key}
const HGDWL_T=[ // one theme per lake (index = lake number): colour of the light on the water, reflection tint, the lamp at the docks, what stands on the landings, the landmark, the shore life
  {name:'Lantern Lake',col:[1,.78,.4],rcol:'#c8863a',lamp:['art_hgtb_lamp_tall',1.15],land:[['yar_nets',.8],['yar_pots',.3],['art_wm_barrel',.42],['art_wm_bucket',.26]],mark:['art_hgt_lamppost',1.9],mark2:null,shore:[['yar_gull_stand',.3],['uw_buoy',.45]]},
  {name:'Statue Lake',col:[.45,.95,.95],rcol:'#3a9aa0',lamp:['art_hgt_gardenlantern',1.0],land:[['uw_clam',.3],['art_hgxprop8',.2],['art_hgxprop9',.34],['art_hgdf_plant3',.5]],mark:['art_hgtb_deco_shellstatue',1.35],mark2:['art_hgtb_tank_ruinarch',1.5],shore:[['uw_clam',.28],['art_hgxprop9',.34],['art_hgdf_plant3',.5]]},
  {name:'Crystal Lake',col:[.78,.55,1],rcol:'#7a50b8',lamp:['art_wm_lamp_post',1.1],land:[['art_wm_crystal_small',.35],['art_wm_crate',.4],['art_wm_crystal_teal',.4],['art_hgxprop2',.22]],mark:['art_wm_crystal_tall',1.5],mark2:['art_wm_crystal_pillar',1.35],shore:[['art_hgfturtle',.4],['art_wm_crystal_small',.3]]}];
function hgdweLakes(L){
  if(L._hgdwl||!L._hgdl||!L._hgdlDone)return;const M=L._hgdm,W=M.W,m=hgdlMask(L),water=(x,y)=>m[y*W+x]===1,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
  const info=L._hgdwl={lakes:[],boats:0};
  const dec=(k,x,y,h,o)=>{if(!IMG[k]||!IMG[k].width)return false;L.decor.push(Object.assign({k,x,y,block:false,walk:true,deco:true,hgdl:1,hgdwl:1,sc:hgweSc(k,h)},o||{}));return true};
  const refl=(k,x,y,h,col,o)=>{const rk=hgweRefl(k,h,col);if(rk)L.decor.push(Object.assign({k:rk,x,y,block:false,walk:true,deco:true,hgdl:1,hgdwl:1,bob:-h*.97},o||{}))};
  const lt=(x,y,col,kI,r2)=>HGDWL.lights.push({x,y,col,kI,r2});
  for(const k of L._hgdl.lakes){if(k.wm||!k.docks)continue;const T=HGDWL_T[k.i%HGDWL_T.length],rec={name:T.name,lake:k.i,props:0};info.lakes.push(rec);
    const cells=[];for(let y=k.y0;y<=k.y1;y++)for(let x=k.x0;x<=k.x1;x++)if(water(x,y))cells.push([x,y]);
    const dist=new Map(),q=[];for(const [x,y] of cells){let edge=false;for(let a=-1;a<=1&&!edge;a++)for(let b=-1;b<=1;b++)if(!water(x+a,y+b)){edge=true;break}if(edge){dist.set(x+','+y,1);q.push([x,y])}}
    for(let i=0;i<q.length;i++){const [x,y]=q[i],dd=dist.get(x+','+y);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const nx=x+a,ny=y+b,kk=nx+','+ny;if(water(nx,ny)&&!dist.has(kk)){dist.set(kk,dd+1);q.push([nx,ny])}}}
    const docks=[k.docks.dep,k.docks.far],nearDock=(x,y,r)=>docks.some(d=>Math.abs(d.wx-x)<=r&&Math.abs(d.wy-y)<=r);
    const usedBlock=new Set(L.decor.filter(d=>d.block&&water(d.x,d.y)).map(d=>d.x+','+d.y));
    const connected=ex=>{const b=new Set(usedBlock);for(const c of ex)b.add(c);const s=[docks[0].wx,docks[0].wy],seen=new Set([s.join(',')]),qq=[s];for(let i=0;i<qq.length;i++){const [x,y]=qq[i];for(const [a,b2] of [[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+a,ny=y+b2,kk=nx+','+ny;if(!seen.has(kk)&&water(nx,ny)&&!b.has(kk)){seen.add(kk);qq.push([nx,ny])}}}return seen.has(docks[1].wx+','+docks[1].wy)};
    // the pearly feather-reed that stood in the middle of every landing (the same one at all the docks) is taken away
    {const pz=(k.plaza||[]).map(c=>c[0]+','+c[1]).concat(docks.map(d=>d.ax+','+d.ay));for(let i=L.decor.length-1;i>=0;i--){const e=L.decor[i];if(e.k==='hgt_reeds'&&!e.block&&pz.includes(e.x+','+e.y))L.decor.splice(i,1)}}
    const cx=(k.x0+k.x1)/2,cy=(k.y0+k.y1)/2;
    // 1. the landmark: in the open water, away from the docks, never cutting the way between them
    let lm=null,bs=-1e9;for(const [x,y] of cells){const dd=dist.get(x+','+y)||0;if(dd<4||nearDock(x,y,6)||usedBlock.has(x+','+y))continue;const sc=dd*10-Math.hypot(x-cx,y-cy)+hash2(x,y,5);if(sc>bs&&connected([x+','+y])){bs=sc;lm=[x,y]}}
    if(lm){const [x,y]=lm,[mk,mh]=T.mark;if(dec(mk,x,y,mh,{block:true,walk:false,deco:false,hgdwm:1})){rec.landmark=[mk,x,y];rec.props++;refl(mk,x,y,mh,T.rcol);usedBlock.add(x+','+y);lt(x,y,T.col,1.5,90)}
      if(T.mark2){const sp=[[2,0],[-2,1],[1,2],[0,-2],[-1,-2],[2,2]].map(([a,b])=>[x+a,y+b]).find(([a,b])=>water(a,b)&&(dist.get(a+','+b)||0)>=3&&!usedBlock.has(a+','+b)&&!nearDock(a,b,3)&&!L.decor.some(d=>d.x===a&&d.y===b&&d.block));
        if(sp){const [a,b]=sp,[k2,h2]=T.mark2;if(dec(k2,a,b,h2,{block:false,walk:true,hgdwm:1})){rec.props++;refl(k2,a,b,h2,T.rcol);lt(a,b,T.col,.9,40)}}}}
    // 2. lights over the open water, so every part of the lake takes the colour of the lake
    const lc=cells.filter(([x,y])=>(dist.get(x+','+y)||0)>=2).sort((a,b)=>hash2(a[0],a[1],12)-hash2(b[0],b[1],12)),placedL=[];
    for(const [x,y] of lc){if(placedL.length>=9)break;if(placedL.some(p=>Math.hypot(p[0]-x,p[1]-y)<6.5))continue;placedL.push([x,y]);lt(x,y,T.col,.95,52)}
    rec.lights=placedL.length+1;
    // 3. both docks: pilings and a lamp on the water side with its reflection, a buoy, and something of the lake on the landing
    docks.forEach((d,di)=>{const px=-d.dy,py=d.dx,W0=[d.wx,d.wy],fl=[[W0[0]+px,W0[1]+py],[W0[0]-px,W0[1]-py]];
      fl.forEach(([x,y],i)=>{if(!water(x,y)||usedBlock.has(x+','+y))return;
        if(i===0){const [lk,lh]=T.lamp;if(dec(lk,x,y,lh,{hgdwm:1})){rec.props++;refl(lk,x,y,lh,T.rcol)}}
        else if(dec('uw_timber',x,y,.62)){rec.props++;if(T.shore[0][0]==='yar_gull_stand')dec('yar_gull_stand',x,y,.28,{bob:.58,oy:.05});else refl('uw_timber',x,y,.62,T.rcol)}});
      const bx=W0[0]+d.dx*2+px*(di?-1:1),by=W0[1]+d.dy*2+py*(di?-1:1);if(water(bx,by)&&!usedBlock.has(bx+','+by)&&dec('uw_buoy',bx,by,.5,{bob:-.08}))rec.props++;
      lt(W0[0],W0[1],T.col,.9,30);
      // the landing: things beside the way, not in it
      const land=[[d.ax+px,d.ay+py],[d.ax-px,d.ay-py]].filter(([x,y])=>open(x,y)&&!water(x,y));
      land.forEach(([x,y],i)=>{const [lk,lh]=T.land[(i+di*2)%T.land.length];if(!L.decor.some(e=>e.x===x&&e.y===y&&e.block)&&dec(lk,x,y,lh,{ox:(i?.12:-.12),oy:.1,hgdl:0}))rec.props++});
      lt(d.ax,d.ay,T.col,.6,22)});
    // 4. the landing of the departure dock: a few more things along the two edges of the way, never the middle, no two in a row alike
    (k.plaza||[]).filter(c=>c[3]!==0&&c[2]>=2&&c[2]%2===0&&open(c[0],c[1])).forEach((c,i)=>{const [lk,lh]=T.land[(i+1)%T.land.length];if(!L.decor.some(e=>e.x===c[0]&&e.y===c[1]&&e.block)&&dec(lk,c[0],c[1],lh,{ox:c[3]*.2,hgdl:0}))rec.props++});
    // 5. the life along the shore: seven small things at the edge, each different
    let ns=0;for(const [x,y] of cells.filter(([x,y])=>dist.get(x+','+y)===1&&!nearDock(x,y,3)).sort((a,b)=>hash2(a[0],a[1],14)-hash2(b[0],b[1],14))){if(ns>=7)break;if(usedBlock.has(x+','+y)||L.decor.some(d=>d.x===x&&d.y===y&&(d.block||/uw_|art_hgxprop|yar_|art_hgfturtle|art_wm|art_hgdf_plant3/.test(d.k))))continue;
      const [sk,sh]=T.shore[ns%T.shore.length];if(sk==='art_hgfturtle'){if(dec('uw_timber',x,y,.28)&&dec(sk,x,y,sh,{bob:.16}))ns++}else if(dec(sk,x,y,sh,{ox:(hash2(x,y,3)-.5)*.4})){ns++;if(ns%3===0)lt(x,y,T.col,.8,22)}}
    rec.props+=ns}
  info.props=info.lakes.reduce((a,l)=>a+l.props,0)}
{const _b=hgdBuild;hgdBuild=function(){const had=!!LEVELS[HGD.ID];const r=_b.apply(this,arguments);const L=LEVELS[HGD.ID];if(!had&&L&&L._hgdl&&L._hgdlDone)try{hgdweLakes(L)}catch(e){console.error('hgdwe lakes',e)}return r}}
// the boats at anchor are drawn smaller (they were wider than the landing)
{const _s=hgdbSync;hgdbSync=function(){const r=_s.apply(this,arguments);try{if(G.decor)for(const d of G.decor)if(d.hgdBoatSpr&&d.sc!==.82){d.sc=.82;d.bob=-.14}}catch(e){}return r}}
// the coloured pools of light on the lakes
{const _sl=setupLights;setupLights=function(){_sl.apply(this,arguments);try{if(LEVEL===HGD.ID)for(const q of HGDWL.lights)LIGHTS.push({x:q.x+.5,y:q.y+.5,ph:hash2(q.x,q.y,22)*6.28,key:-6500-LIGHTS.length,taken:false,red:false,free:true,calm:true,col:q.col,kI:q.kI,range2:q.r2})}catch(e){console.error('hgdwl lights',e)}}}
// the sea fish drawn over the viewer's head (reef fish, angelfish, rays, a shark) do not belong in a freshwater pond maze, and they hung at head height: the maze has its own carp, perch and trout in the passages
{const _sf=uwSkyFish;uwSkyFish=function(){if(LEVEL===HGDWE.ID)return;return _sf.apply(this,arguments)}}
