/* ==========================================================================
   THE PALE SPIRE, SECOND FLOOR: THE HALL OF ILLUSIONS (level 9820, 56 x 44, indoor, rating 103; prefix psf2 / PSF2H). See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md.
   A small gothic hall in the style of the Great Halls (9740): the same carved black stone (pshTile), marble chequer, violet runners, columns and a ribbed vault.
     The Stair Landing (south): the Grand Stair comes up at (28,38); the Dreamkeeper stands beside it and gives psq40, "The Sleeper's Pieces".
     The Hall of Illusions (the nave, x 24 to 32): columns down both sides, the Sleeper's table on a dais at the crossing (28,22).
     The Gallery of Doors (north, y 4 to 6): five doors in the north wall (forest, island, snow, waterways, desert); the West Arm and the East Arm lead to the swamp door (2,22) and the nightmare door (53,22).
     Four small side rooms between the gallery and the arms (mirrors, books of dreams, masks, sleepers' beds), the Quiet Chapel (a rest room) and the Gallery of the Sleeper (her story).
   The Sleeper's table: seven hollows; placing a piece takes it from the bag (psf2F().placed). With all seven placed the Sleeper wakes (F.woke), speaks, and the quest is ready;
   the Dreamkeeper hands out the reward (once, by the quest) and F.done is set. A sealed iron stair at the east end of the gallery is the way to the third floor (not open yet).
   ========================================================================== */
const PSF2H={ID:9820,W:56,H:44,WH:3.2,TABLE:[28,22],KEEPER:[28,36],STAIR3:[52,5]};
/* painted pieces wanted (assets/ps/<name>.webp replaces the stand-in with no code change) */
{const P=(n,h,src,o)=>{PSP_PICS[n]=[h,src,o||{}]};
 P('f2_dreamkeeper',1.0,['ps_p_librarian','kh_ohfolk6_0'],{keep:1});
 P('f2_bier',1.0,['ps_altar','hl_p_tomb'],{keep:1});
 P('f2_sleeper',1.1,['hl_p_tomb','ps_altar'],{keep:1});
 P('f2_sleeper_up',1.0,['ps_p_ghost_lady','gyi_banshee'],{keep:1})}
const PSF2_HINT={
  hand:"The Perfect Forest. In the middle of a glade stand four standing stones, each carved with a season, and an old hollow oak. Touch the stones in the order of the year, spring first. The hand is in the oak.",
  foot:"The Island by the Sea. Read the message in the bottle on the shore, then fetch the spade from the fisherman's hut and dig in the sand patch whose shell matches the drawing. The wrong patch has crabs in it.",
  face:"The Cabin in the Snow. The hearth in the cabin is cold. Three logs lie in the snow round the cabin, and the flint is on a post by the woodpile. Lay the logs on the hearth and strike the flint. The fire will melt the ice on the mirror.",
  chest:"The Waterways. A locked palazzo door at the north end has three carnival masks beside it. The plaque says the Doge lets in only the one who watches and says nothing. Choose that mask. The wrong one wakes the eels.",
  legs:"The Desert. In the sunken temple court, the wall frieze shows four symbols in a row. Step on the floor tiles in that order. The wrong tile lets out scorpions. Then the sarcophagus opens.",
  heart:"The Swamp. The witch's note by her cauldron asks for a toadstool, an eel and a clump of marsh moss. All three are out in the swamp, at small marked places. Put them in the pot.",
  brain:"The Nightmare. Four lanterns stand in a ring. Watch them light one after another, then touch them in the same order. Get it wrong and the shadows come. Get it right and the jar opens."};
const psf2Placed=()=>PSF2.PARTS.filter(p=>psf2F().placed[p]).length;
/* the bier and the pieces on it: the painting of the Sleeper on her bier is cut into the seven pieces (head to foot); a piece not yet laid there is taken out of the picture (and the hair that hangs over the side goes with the head) */
const PSF2_CUT={brain:[.05,.13],face:[.13,.21],chest:[.21,.3],heart:[.3,.36],hand:[.36,.46],legs:[.46,.86],foot:[.86,1]},PSF2_TOP=.32;
function psf2Blank(){if(!IMG.psf2_blank){const c=document.createElement('canvas');c.width=c.height=4;IMG.psf2_blank=c;NPC_H.psf2_blank=.1}return 'psf2_blank'}
/* the plinth (f2_bier2, round 3): black carved stone with seven silver-ringed sockets under their symbols; a socket shows its piece once that piece is laid on the table. f2_sleeper2 is the Sleeper on that plinth (f2_sleeper2_nh without the hair over the side). Made by tools/f2_bier_make.py. */
const PSF2_SOCK=[.116,.244,.371,.499,.626,.754,.882],PSF2_SOCKY=.70,PSF2_SOCKR=.028,PSF2_ORDER=['hand','foot','face','chest','legs','heart','brain'];
const psf2SlKey=nh=>{const k=pspPic(nh?'f2_sleeper2_nh':'f2_sleeper2');return IMG[k]&&IMG[k].width?k:pspPic('f2_sleeper')};
const psf2PlKey=()=>{const k=pspPic('f2_bier2');return IMG[k]&&IMG[k].width?k:pspPic('f2_bier')};
function psf2BierEnd(){const k='psf2_bierend';if(IMG[k])return k;const im=IMG[psf2SlKey(1)];if(!im||!im.width)return pspPic('f2_bier');const sx=Math.round(im.width*.88),sy=Math.round(im.height*PSF2_TOP),c=document.createElement('canvas');c.width=im.width-sx;c.height=im.height-sy;c.getContext('2d').drawImage(im,sx,sy,c.width,c.height,0,0,c.width,c.height);IMG[k]=c;NPC_H[k]=NPC_H[pspPic('f2_sleeper')]*(1-PSF2_TOP);return k}
function psf2BierKey(){const F=psf2F(),woke=!!F.woke,mask=woke?'w':PSF2.PARTS.map(p=>F.placed[p]?1:0).join(''),k='psf2_bier3_'+mask;if(IMG[k])return k;
  const nh=woke||!F.placed.face||!F.placed.brain,sk=psf2SlKey(nh),im=IMG[sk];if(!im||!im.width)return pspPic('f2_bier');const W=im.width,H=im.height,top=Math.round(H*PSF2_TOP),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(im,0,0);
  const sockets=()=>{if(woke)return;PSF2_ORDER.forEach((p,i)=>{if(!F.placed[p])return;const s=IMG[pspPic('f2_sock_'+p)];if(!s||!s.width)return;const r=PSF2_SOCKR*W;x.drawImage(s,PSF2_SOCK[i]*W-r,PSF2_SOCKY*H-r,2*r,2*r)})};   // a filled socket shows its piece
  const v2=sk!==pspPic('f2_sleeper');
  if(!woke&&!PSF2.PARTS.some(p=>F.placed[p])){const cl=IMG[v2?psf2PlKey():pspPic('f2_bier')];if(cl&&cl.width){x.clearRect(0,0,W,H);if(v2)x.drawImage(cl,0,0,W,H);else x.drawImage(cl,0,top-8,W,H-top+8);IMG[k]=c;NPC_H[k]=NPC_H[sk];return k}}   // the empty bier: the painted plinth with its pale cloth, at the size of the plinth under the Sleeper
  if(v2){x.globalCompositeOperation='destination-out';
    for(const p of PSF2.PARTS){if(!woke&&F.placed[p])continue;const [a,b]=PSF2_CUT[p],x0=a*W,x1=b*W,fe=W*.018,g=x.createLinearGradient(x0-fe,0,x1+fe,0),k0=fe/(x1-x0+2*fe);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(k0,'rgba(0,0,0,1)');g.addColorStop(1-k0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(x0-fe,0,x1-x0+2*fe,top)}
    x.globalCompositeOperation='destination-over';{const pl=IMG[psf2PlKey()];if(pl&&pl.width)x.drawImage(pl,0,0,W,H)}   // where a piece is missing, the plinth and its cloth show
    x.globalCompositeOperation='source-over';sockets();IMG[k]=c;NPC_H[k]=NPC_H[sk];return k}
  x.globalCompositeOperation='destination-out';
  for(const p of PSF2.PARTS){if(!woke&&F.placed[p])continue;const [a,b]=PSF2_CUT[p],x0=a*W,x1=b*W,fe=W*.018,g=x.createLinearGradient(x0-fe,0,x1+fe,0),k0=fe/(x1-x0+2*fe);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(k0,'rgba(0,0,0,1)');g.addColorStop(1-k0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');
    const gv=x.createLinearGradient(0,0,0,top);x.fillStyle=g;x.fillRect(x0-fe,0,x1-x0+2*fe,top-6);x.fillStyle='rgba(0,0,0,1)';x.fillRect(x0+fe*.5,0,x1-x0-fe,top-10)}   // feathered, so the pieces end softly in the cloth
  x.globalCompositeOperation='destination-over';{const cl=IMG[pspPic('f2_bier')];if(cl&&cl.width&&!woke)x.drawImage(cl,cl.width*.2,0,cl.width*.55,cl.height*.12,W*.05,top-Math.round(H*.07),W*.92,Math.round(H*.09))}   // where a piece is missing, the pale cloth on the stone shows
  x.globalCompositeOperation='source-over';
  if(woke||!F.placed.face||!F.placed.brain){   // the hair over the side: the clean stone of the far end is painted over it
    const sx=Math.round(.55*W),sw=Math.round(.31*W);x.drawImage(im,sx,top-2,sw,Math.round(H*.45),Math.round(.02*W),top-2,sw,Math.round(H*.45))}
  if(woke){const cl=IMG[pspPic('f2_bier')];if(cl&&cl.width){x.clearRect(0,0,W,top-2)}}
  IMG[k]=c;NPC_H[k]=NPC_H[pspPic('f2_sleeper')];return k}
/* ---------- the level ---------- */
function psf2HubBuild(info){
  const W=PSF2H.W,H=PSF2H.H,id=PSF2H.ID;
  try{gyAlias();pshPics()}catch(e){}
  const fl=pshFloors();   // marble chequer, flags, violet runner, wood, carpet, dais, black marble (the Great Halls' own floors) and the ribbed vault psc_hall
  const FK={h_chq:fl[0],h_flag:fl[1],h_run:fl[2],h_wood:fl[3],h_carpet:fl[4],h_dais:fl[5],h_black:'psf_black'};
  for(const k in FK)PSPK.floors[k]=FK[k];
  const C=pspMake({id,start:{x:28,y:38,f:0},floor:'h_chq',wh:PSF2H.WH,amb:.36,lcol:PSH_COL.cold,kind:'in'});
  const {rows,block}=C,hs=(a,b,c)=>hash2(a,b,c+id),room=new Int8Array(W*H).fill(-1),ix=(x,y)=>y*W+x;
  const ROOMS=[]; // [name, style]
  const R=(x0,y0,x1,y1,floor,name,style,at)=>{const r=ROOMS.length;ROOMS.push([name,style]);C.room(x0,y0,x1,y1,{floor,name,at});for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)room[ix(x,y)]=r;return r};
  const P=(x0,y0,x1,y1,r,floor)=>{C.carve(x0,y0,x1,y1);C.setFloor(x0,y0,x1,y1,floor||'h_chq');for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)room[ix(x,y)]=r};
  const rG=R(4,4,51,6,'h_flag','The Gallery of Doors','hall',[28,5]);
  const rN=R(24,7,32,33,'h_chq','The Hall of Illusions','hall',[28,13]);
  const rW=R(3,20,23,24,'h_chq','The West Arm','statues',[12,22]);
  const rE=R(33,20,52,24,'h_chq','The East Arm','statues',[44,22]);
  const rS=R(24,34,32,40,'h_flag','The Stair Landing','stair',[28,36]);
  const rQ=R(16,35,21,39,'h_wood','The Quiet Chapel','lady',[18,37]);
  const rY=R(35,35,40,39,'h_flag','The Gallery of the Sleeper','gallery',[37,37]);
  const rM=R(6,9,12,16,'h_chq','The Room of Mirrors','salon',[9,12]);
  const rB=R(15,9,21,16,'h_wood','The Library of Dreams','trophy',[18,12]);
  const rK=R(35,9,41,16,'h_carpet','The Room of Masks','banquet',[38,12]);
  const rD=R(44,9,50,16,'h_wood',"The Sleepers' Beds",'lady',[47,12]);
  // passages: from the gallery south into the side rooms (under the forest, island, waterways and desert doors), from the side rooms into the arms, between the side rooms, the chapel and the Sleeper's gallery
  P(9,7,9,8,rM);P(9,17,9,19,rM);P(19,7,19,8,rB);P(18,17,18,19,rB);P(13,12,14,12,rM);P(22,12,23,12,rB);
  P(39,7,39,8,rK);P(38,17,38,19,rK);P(49,7,49,8,rD);P(47,17,47,19,rD);P(42,12,43,12,rK);P(33,12,34,12,rK);
  P(22,37,23,37,rQ,'h_wood');P(33,37,34,37,rY,'h_flag');
  P(3,22,3,22,rW);P(52,22,52,22,rE);
  // runners and the dais
  C.setFloor(6,5,49,5,'h_run');C.setFloor(28,7,28,17,'h_run');C.setFloor(28,27,28,37,'h_run');C.setFloor(5,22,23,22,'h_run');C.setFloor(33,22,50,22,'h_run');
  C.setFloor(26,19,30,25,'h_run');   // the violet runner cloth under the bier (the pale dais stone looked bare)
  // ---- the links (the contract table): the seven illusion doors and the Grand Stair down; painted doors of the castle ----
  const doorGid=(st)=>{try{return pspDoorGid(st,PSF2H.WH)}catch(e){return null}};
  // every illusion door has its own painted front, in the world it opens into: living oak and ivy, driftwood and shells, frosted oak and icicles, a red and gilded Venetian door, carved sandstone, rotting planks and moss, a door of eyes
  // round 4: each door is a whole painted panel (Gemini, assets/ps/f2_wp_door_*): the carved black stone arch, the door leaf down to the floor and the wall above it up to the cornice, in the same stone as the painted wall panels round it
  const hdPanel=k=>IMG['ps_f2_wp_door_'+k]&&IMG['ps_f2_wp_door_'+k].width?f2PanelGid('door_'+k,PSF2H.WH,{gain:1.3*({island:.74,desert:.6,snow:.86,swamp:1.75,night:1.2,stair:.9}[k]||1),con:1.1,rgb:[.94,.97,1.02],emit:.05}):null;
  const HD={9821:'forest',9822:'island',9823:'snow',9824:'water',9825:'desert',9826:'swamp',9827:'night'},HDRGB={island:[.7,.76,.8],snow:[.72,.76,.82],desert:[.76,.7,.62]},hdGid=k=>hdPanel(k)||(IMG['ps_f2_hd_'+k]&&IMG['ps_f2_hd_'+k].width?(IMG.ps_f2_wp_ashlar&&IMG.ps_f2_wp_ashlar.width?f2Door256('ps_f2_hd_'+k,PSF2H.WH,{rgb:HDRGB[k]||[.86,.86,.88],gain:1.05,emit:.05}):null)||f2FacGid('ps_f2_hd_'+k,0,1,PSF2H.WH,{tex:'texBlack_2',fit:false,emit:.04,rgb:HDRGB[k]||[.86,.86,.88],dtag:HDRGB[k]?'t':''}):null);   // the pale doors (shells, frost, sandstone) are toned down so the hall's lights do not wash them out
  // the glow of a world door: a soft rim of its world's colour along the edges of the door (engine opt-in kd.rim/kd.gcol), not the warm pool over the middle that whited out the pale doors
  const HDGLOW={9821:[60,120,50],9822:[40,95,135],9823:[90,110,140],9824:[130,70,70],9825:[140,100,40],9826:[70,100,40],9827:[140,30,30]};
  for(const l of pspLinksFrom(id)){if(!l.at)continue;const g=pspPortal(C,l,{style:'great'});const st=/Grand Stair/.test(l.name)?'stairarch':'great',b=(HD[l.to]&&hdGid(HD[l.to]))||(st==='stairarch'&&hdPanel('stair'))||doorGid(st);if(st==='stairarch'&&g!=null&&KH_DOOR[g]&&hdPanel('stair')!=null){KH_DOOR[g].rim=1;KH_DOOR[g].gcol=[60,70,95]}/* the open stair arch: a cold rim, not the warm pool that turned its darkness orange */if(g!=null&&b!=null&&T_TILE[b]!==undefined){T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b]}if(g!=null&&KH_DOOR[g]&&HDGLOW[l.to]){KH_DOOR[g].rim=1;KH_DOOR[g].gcol=HDGLOW[l.to]}}
  // the stair to the third floor: an iron door that does not open yet
  {const b=hdGid('iron')||doorGid('iron'),g=KH_NEXT_GID++;T_TILE[g]=T_TILE[b];if(GY.col&&GY.col[b])GY.col[g]=GY.col[b];KH_DOOR[g]={psf2:'stair3'};C.carve(51,5,51,5);C.solid(52,5,C.ch(g));C.used.add('52,5')}
  // keep clear: every landing (3 by 3), the stair arrival, the passages
  for(const l of PSP.LINKS)if(l.to===id&&l.land)C.reserve(l.land[0]-1,l.land[1]-1,l.land[0]+1,l.land[1]+1);
  C.reserve(27,37,29,40);C.reserve(50,4,51,6);
  // ---- the dressing ----
  const pic=(n,x,y,wd,o)=>{const k=pspPic(n);if(!C.isOpen(x,y))return null;const bx=x+wd[0],by=y+wd[1];if(rows[by][bx]==='.')return null;return C.dec(k,x,y,Object.assign({wd,block:false},o||{}))};
  const prop=(n,x,y,o)=>{if(!C.free(x,y))return null;return C.prop(n,x,y,o)};
  const cand=(x,y,col)=>{if(!C.free(x,y))return;C.cand(x,y,col||PSH_COL.cold)};
  // the gallery: a painted name plaque beside every door, banners and mirrors between the doors (the place of illusions: mirrors everywhere)
  const NAMES={9821:'THE PERFECT FOREST',9822:'THE ISLAND BY THE SEA',9823:'THE CABIN IN THE SNOW',9824:'THE WATERWAYS',9825:'THE DESERT',9826:'THE SWAMP',9827:'THE NIGHTMARE'};
  // the name of each door on a small plaque of cream marble in a gilded frame beside it (the castle's black sign boards were too big beside the painted doors)
  const plq=(x,y,wd,id2)=>{const w=NAMES[id2].split(' '),h=Math.ceil(w.length/2),k=IMG.ps_f2_plaque_blank&&IMG.ps_f2_plaque_blank.width?f2Lettered('f2_plaque_blank','f2_hubpl_'+id2,[w.slice(0,h).join(' '),w.slice(h).join(' ')],{h:.62,col:'#100800',box:[.2,.28,.8,.74]}):null;if(!k){C.sign(x,y,wd,NAMES[id2]);return}const d=pic(k.replace(/^ps_/,''),x,y,wd,{bob:1.35,sc:1});if(!d)C.sign(x,y,wd,NAMES[id2])};
  for(const l of pspLinksFrom(id)){if(!NAMES[l.to])continue;const [x,y]=l.at;
    if(y===3){for(const cx2 of [x-1,x+1]){const d=pic('sconce_black',cx2,4,[0,-1],{bob:1.45,sc:1});if(d)C.light(cx2,4,[.62,.52,.4])}plq(x+2,4,[0,-1],l.to);cand(x-2,4)}   // a pair of black iron sconces flanks every door of the gallery
    else if(x===2){plq(4,20,[0,-1],l.to);cand(4,24)}
    else{plq(51,20,[0,-1],l.to);cand(51,24)}}
  // each door throws a little of its own world's light into the hall: green for the forest, sea blue for the island, cold white for the snow, rose for the canals, gold for the desert, bog green for the swamp, red for the nightmare
  {const TINT={9821:[.7,1.5,.6],9822:[.5,1.1,1.6],9823:[1.2,1.3,1.6],9824:[1.5,.9,1.0],9825:[1.7,1.25,.5],9826:[.8,1.2,.5],9827:[1.6,.35,.35]};
   for(const l of pspLinksFrom(id)){if(!TINT[l.to]||!l.at)continue;const [x,y]=l.at,lx=y===3?x:x===2?5:50,ly=y===3?5:22;C.light(lx,ly,TINT[l.to].map(v=>.3+v*.16))}}   // a square out from the door, so it tints the floor and walls round it and does not burn the door itself   // softened: a hint of the world's colour on the stone, not a coloured floor
  for(const [x,n] of [[12,'alcove_weeper'],[22,'alcove_monk'],[32,'alcove_maiden'],[42,'alcove_knight']])pic(n,x,4,[0,-1]);for(const [x,n] of [[11,'alcove_maiden'],[21,'alcove_knight'],[41,'alcove_weeper'],[46,'alcove_monk']])pic(n,x,6,[0,1]);   // statues in niches between the doors, so the long wall is not one run of empty panels
  for(const x of [14,24,34,44]){pic(x===24||x===34?'mirror_haunted_a':'banner_long_a',x,4,[0,-1]);pic('banner_long_b',x,6,[0,1])}
  for(const x of [5,50])pic('window_stained_tall',x,6,[0,1]);
  // the nave: two rows of columns, stained windows high on the side walls, candelabra by the dais
  for(const y of [9,12,15,29,32]){C.column(25,y,y%2?'twist':'fluted');C.column(31,y,y%2?'twist':'fluted')}
  for(const [x,y] of [[25,18],[31,18],[25,26],[31,26]])C.column(x,y,'silver');
  for(const y of [10,14,28,31])for(const [x,wd] of [[24,[-1,0]],[32,[1,0]]])pic(y===14||y===28?'window_stained_tall':'portrait_ancestor_'+(1+((y+x)%8)),x,y,wd);
  for(const [x,y] of [[26,20],[30,20],[26,24],[30,24]])cand(x,y,[.75,.9,1.25]);
  // the Sleeper's table at the crossing
  // the bier: a long plinth of black stone across three squares (27..29); the pieces of the Sleeper appear on it one by one as they are laid there
  for(const x of [27,28,29]){C.used.delete(x+',22');const d=C.dec(psf2Blank(),x,22,{block:true,npc:x===28?'psf2_table':undefined});if(d){d.fly=1;if(x!==28){d.npc='psf2_table';d.solid=1}}}
  {const m=f2Span(C,psf2BierKey(),28.5,22.5,0,1,3.0,0);m.bierMain=1;C.f2x[m.kname].bierMain=1;
   for(const [x,s] of [[27.03,-1],[29.97,1]]){const e=f2Span(C,psf2BierEnd(),x,22.5,1,0,1.0,0);e.bierEnd=s}}
  {const sh=f2Soft(pspPic('f2_fo_shaft'),{filter:'saturate(0) brightness(1.25)',l:.3,r:.3,t:.05,b:.25,a:.32,tag:'hub'});const d=f2Span(C,sh,28.5,21.55,0,1,2.6,0);d.lift=.2;C.f2x[d.kname].lift=.2}   // a pale shaft of light falls on the bier from the vault
  C.light(28,22,[1.2,1.15,1.4]);C.light(28,21,[1.0,.85,1.2]);
  {C.used.delete('28,24');const d=C.dec(pspPic('f2_sleeper_up'),28,24,{block:false,npc:'psf2_sleeper'});if(d)d.hidden=true}
  // the arms: columns in rows (aisles), alcoves with statues, candles
  for(const x of [8,11,14,17,20]){prop('col_fluted',x,20);prop('col_fluted',x,24)}
  for(const x of [36,39,42,45,48]){prop('col_twist',x,20);prop('col_twist',x,24)}
  for(const [x,y,wd,n] of [[6,24,[0,1],'alcove_weeper'],[12,24,[0,1],'alcove_maiden'],[19,24,[0,1],'alcove_monk'],[37,24,[0,1],'alcove_knight'],[43,24,[0,1],'alcove_weeper'],[50,24,[0,1],'alcove_maiden'],
    [13,20,[0,-1],'mirror_haunted_b'],[22,20,[0,-1],'portrait_ancestor_3'],[34,20,[0,-1],'portrait_ancestor_5'],[44,20,[0,-1],'mirror_haunted_c']])pic(n,x,y,wd);
  // the Room of Mirrors: mirrors on every wall, a single candelabra in the middle
  for(const [x,y,wd] of [[7,9,[0,-1]],[11,9,[0,-1]],[6,11,[-1,0]],[6,14,[-1,0]],[12,10,[1,0]],[12,15,[1,0]],[7,16,[0,1]],[11,16,[0,1]]])pic(['mirror_haunted_a','mirror_haunted_b','mirror_haunted_c'][(x+y)%3],x,y,wd);
  cand(9,12);cand(7,14,[.8,.95,1.3]);cand(11,10,[.8,.95,1.3]);   // (the free-standing mirrors showed a blank white glass at close range: the room keeps its wall mirrors only)
  // the Library of Dreams: bookcases along the walls, a reading desk and a lectern with the book of dreams
  for(const [x,y] of [[15,9],[17,9],[21,9],[15,16],[21,16]])prop('bookcase_tall',x,y);
  prop('reading_desk',18,13);C.light(18,11,[1.5,1.15,.7]);C.light(16,14,[1.2,1.0,.7]);C.light(20,14,[1.2,1.0,.7]);if(C.free(16,12)){C.used.delete('16,12');C.dec(pspPic('lectern'),16,12,{block:true,npc:'psf2_book'})}cand(20,11,[1.3,1.0,.6]);
  // the Room of Masks: masks of carnivals painted on the walls (portraits of masked faces), a long table, candles
  for(const [x,y,wd,n] of [[36,9,[0,-1],'f2_mask_plague'],[38,9,[0,-1],'f2_mask_moon'],[40,9,[0,-1],'f2_mask_harlequin'],[35,11,[-1,0],'f2_mask_moon'],[41,14,[1,0],'f2_mask_plague'],[35,14,[-1,0],'f2_mask_harlequin']])pic(n,x,y,wd,{bob:1.1,sc:1.6});   // carnival masks hung on the walls at eye height
  prop('furn_table_long_black',38,13);prop('furn_chair_dining_black',37,13);prop('furn_chair_dining_black',39,13);cand(36,15);cand(40,10);cand(36,10,[1.3,1.0,.6]);C.light(38,12,[1.3,1.0,.7]);
  // the Sleepers' Beds: four canopied beds with cobwebs, people who once slept here and never woke
  for(const [x,y] of [[45,10],[49,10],[45,15],[49,15]])prop((x+y)&1?'furn_bed_canopy':'bed_four',x,y);
  pic('portrait_ancestor_6',47,9,[0,-1]);pic('window_sheeted_a',50,13,[1,0]);pic('window_sheeted_b',44,12,[-1,0]);
  cand(47,12,[.75,.9,1.25]);cand(45,12,[1.3,1.0,.6]);cand(49,13,[1.3,1.0,.6]);C.light(47,10,[1.1,.9,.7]);
  // the Quiet Chapel (rest): a bed, a chest, warm candles; the Gallery of the Sleeper: her portrait and her story
  pspRest(C,{x0:16,y0:35,x1:21,y1:39,bed:[17,36],chest:[20,39],name:'The Quiet Chapel',line:'A small quiet chapel. Warm candles burn here, and nothing that lives in the illusions can come in.'});
  pic('window_stained',18,35,[0,-1]);pic('altar',16,38,[-1,0]);
  for(const [x,y,wd,n] of [[37,35,[0,-1],'pt_isaude'],[40,37,[1,0],'portrait_ancestor_7'],[35,39,[0,1],'portrait_ancestor_2']])pic(n,x,y,wd);
  if(C.free(38,36)){C.used.delete('38,36');C.dec(pspPic('lectern'),38,36,{block:true,npc:'psf2_story'})}
  cand(36,38,[1.3,1.0,.6]);
  // the Stair Landing: the Dreamkeeper beside the stair, candelabra, banners
  C.used.delete(PSF2H.KEEPER.join(','));C.dec(pspPic('f2_dreamkeeper'),PSF2H.KEEPER[0],PSF2H.KEEPER[1],{block:true,npc:'psf2_keeper'});
  C.setFloor(27,35,29,36,'h_run');C.light(28,36,[1.35,1.15,1.3]);cand(26,36);cand(30,36);cand(25,40);cand(31,40);   // he stands on a violet carpet between two candelabra, straight ahead of the stairfor(const x of [25,31])pic('banner_long_a',x,34,[0,-1]);
  pic('window_great',32,36,[1,0]);pic('window_great',24,39,[-1,0]);
  // no creatures on this floor's hub: it is a safe hall
  pspSafeRect(C,2,2,W-3,H-3);
  // ---- the walls: the Great Halls' carved stone, the style of the room beside it ----
  const styleAt=(x,y)=>{for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]]){const xx=x+a,yy=y+b;if(xx>=0&&yy>=0&&xx<W&&yy<H&&rows[yy][xx]==='.'&&room[ix(xx,yy)]>=0)return ROOMS[room[ix(xx,yy)]][1]}return 'hall'};
  // painted panels (Gemini, 256 texels a square): every run of wall is set out in bays, a pilaster between bays, a carved feature panel in the middle of each bay and plain ashlar either side;
  // clustered shafts flank every door; each kind of room has its own feature panels. All panels share one plinth and one cornice, so the courses run on round the hall.
  const isDoor=(x,y)=>{if(x<0||y<0||x>=W||y>=H||rows[y][x]==='.')return false;const g=C.chars[rows[y][x]];return g!==undefined&&!!KH_DOOR[g]};
  const FEAT={hall:['tracery','quatre','frame','twin'],statues:['rosette','niche','frame','rosette'],salon:['twin','frame','quatre'],trophy:['vine','frame','vine'],banquet:['rosette','twin','frame'],lady:['moon','twin','moon'],stair:['quatre','frame','tracery'],gallery:['moon','frame','vine'],closet:['frame'],screens:['frame']};
  const PANEL_OK=!!(IMG.ps_f2_wp_ashlar&&IMG.ps_f2_wp_ashlar.width);
  const panelAt=(x,y,st)=>{const op=(a,b)=>a>=0&&b>=0&&a<W&&b<H&&rows[b][a]==='.';const ns=op(x,y-1)||op(x,y+1),ew=op(x-1,y)||op(x+1,y);
    if(!ns&&!ew)return 'ashlar';const c=ns?x:y,dA=ns?[1,0]:[0,1];
    if(isDoor(x+dA[0],y+dA[1])||isDoor(x-dA[0],y-dA[1]))return 'shafts';   // the door bay: clustered shafts either side of the door
    for(const s2 of [2,3])for(const sg of [1,-1])if(isDoor(x+dA[0]*s2*sg,y+dA[1]*s2*sg)){const DB=['vine','quatre','rosette','twin','moon','tracery','frame'],di=(x*3+y*5)%DB.length;return s2===2?DB[di]:(hs(x,y,7)<.5?'ashlar':'ashlar2')}   // beside the shafts: one carved panel of its own for each door, then plain ashlar before the run's rhythm starts again
    const ph=((st.length*3+(ns?y:x)*7)%4+4)%4,m=((c+ph)%4+4)%4;
    if(m===0)return 'pilaster';
    if(m===2){const f=FEAT[st]||FEAT.hall,b=Math.floor((c+ph)/4);return f[((b+(ns?y:x))%f.length+f.length)%f.length]}
    return hs(x,y,5)<.5?'ashlar':'ashlar2'};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(rows[y][x]==='.')continue;const g=C.chars[rows[y][x]];if(g!==undefined&&KH_DOOR[g])continue;
    const st=styleAt(x,y),edge=x===0||y===0||x===W-1||y===H-1;
    if(PANEL_OK&&!edge){const pn=panelAt(x,y,st),fl=/^ashlar/.test(pn)&&hs(x,y,6)<.5,p=f2PanelGid(pn,PSF2H.WH,{gain:/lady|gallery|banquet|trophy/.test(st)?1.55:1.38,con:1.22,rgb:[.9,.96,1.06],flip:fl,tag:(fl?'f':'')+(/lady|gallery|banquet|trophy/.test(st)?'b':'')});if(p!=null){C.solid(x,y,C.ch(p));continue}}
    let kind='plain';
    if(!edge&&(y===3||y===41)&&x%5===2)kind='win';else if(!edge&&(x===23||x===33)&&y>=8&&y<=32&&y%4===0)kind='pilaster';
    C.solid(x,y,C.ch(pshTile(st,kind,kind==='plain'?(hs(x,y,3)*2)|0:0)))}
  for(const [x,y,c] of [[38,37,[.9,.82,.72]],[50,5,[.62,.68,.88]],[26,11,[.55,.62,.8]],[30,11,[.55,.62,.8]],[26,30,[.5,.56,.74]],[30,30,[.5,.56,.74]],[28,39,[.5,.56,.72]]])C.light(x,y,c);   // a little more light on the carved walls of the nave, the Gallery of the Sleeper and the iron stair door, which read as black
  C.glow(6.5,PSH_COL.cold);
  const lv=C.finish({start:{x:28,y:38,f:0}});if(C.f2x)lv._f2x=C.f2x;
  // painted detail on the floors (drawn in the floor pass, never in the way): dust and cracks, a few dry leaves blown in, broken glass by the mirrors; a star of black and silver marble set in the floor of the Room of Mirrors, a brass moon plate in the Gallery of the Sleeper
  try{lv._f2dec=f2Decals(C,lv,{keys:['leaves','glass','flag','leaves'].map(k=>'f2_dc_nh_'+k),p:.16,sz:[.45,.8],far:12,gain:[.8,.82,.9],keep:(x,y)=>(x>=26&&x<=30&&y>=19&&y<=25)||(x>=27&&x<=29&&y>=35),big:[{k:'f2_dc_nhi_star',x:9.5,y:12.5,sz:2.6,a:.95},{k:'f2_dc_nhi_moonplate',x:37.5,y:38.2,sz:1.3,a:.9}]})}catch(e){console.error('psf2 decals',e)}
  lv.floorSet=C.floorNames.map(n=>FK[n]||pspFloor(n));while(lv.floorSet.length<7)lv.floorSet.push(lv.floorSet[0]);lv.floor=lv.floorSet[0];lv.floor2=lv.floorSet[1];
  lv.ceil='psc_hall';lv.ceilH=PSF2H.WH;
  {const sp=lv.decor.filter(d=>d.span);lv.decor=lv.decor.filter(d=>!d.span);try{if(typeof pswaHang==='function')pswaHang(id,lv)}catch(e){console.error('psf2 wallart',e)}lv.decor.push(...sp)}
  return lv}
pspRegister(PSF2H.ID,psf2HubBuild);
/* ---------- the people and the things to touch ---------- */
/* the first time the party comes up the stair, the Dreamkeeper speaks to them at once */
pspOnArrive((n,restored)=>{if(n!==PSF2H.ID||restored)return;const F=psf2F();F.talked=F.talked||{};if(F.talked.keeper)return;F.talked.keeper=1;
  PSF2H.greetAt=G.time+1.2});
/* the greeting waits until any cutscene of the arrival (the party's talk about the doors) has finished, and until no other talk is open */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(PSF2H.greetAt&&typeof LEVEL!=='undefined'){if(LEVEL!==PSF2H.ID)PSF2H.greetAt=0;else if(G.cut||G.talk||G.state!=='play')PSF2H.greetAt=Math.max(PSF2H.greetAt,G.time+.8);else if(G.time>=PSF2H.greetAt){PSF2H.greetAt=0;const d=(G.decor||[]).find(q=>q.npc==='psf2_keeper');if(d)startTalk(d)}}}catch(e){console.error('psf2 keeper',e);PSF2H.greetAt=0}
  return r}}
khNpc('psf2_keeper','The Dreamkeeper','ps_f2_dreamkeeper',()=>say("Welcome to the second floor of the Pale Spire. This is the Hall of Illusions. I am the Dreamkeeper. I keep the doors, and I keep the Sleeper's table.",[
  ['What is this place?',()=>say("The Hall of Illusions. There are seven doors off this hall: five in the gallery to the north, one at the end of the West Arm and one at the end of the East Arm. Each door opens into a world that is not real: a forest, an island, a cabin in the snow, a city of canals, a desert, a swamp and a nightmare. They look real. The creatures in them bite like real creatures. But they are made of mist, and at the edge of each one the mist wall shows the castle stone through the cracks.",[BYE])],
  ['Who is the Sleeper?',()=>say("She was the Sovereign's dreamer. Her dreams were so strong that the castle built rooms for them. One night the Sovereign took her apart, piece by piece, and hid each piece in one of her own dreams, so that she could never wake and tell what she knew. Her table is in the middle of the hall. It is empty.",[BYE])],
  ['Tell me about one of the doors.',()=>say('Which one?',PSF2.PARTS.map(p=>[(psf2Got(p)?'(found) ':'')+'The '+PSF2.WHERE[p]+'.',()=>say(PSF2_HINT[p],[BYE])]).concat([BYE]))],
  BYE]));
khNpc('psf2_table',"The Sleeper's table",'ps_f2_bier',()=>psf2Table());
khNpc('psf2_book','The book of dreams','ps_lectern',()=>say("A heavy book lies open on the lectern. The pages are lists in a neat hand: THE FOREST, WHERE IT IS ALWAYS SPRING. THE ISLAND, WHERE THE TIDE NEVER TURNS. THE CABIN, WHERE IT IS ALWAYS WINTER. THE CITY OF CANALS. THE DESERT. THE SWAMP. THE LAST ONE HAS NO NAME, ONLY A DRAWING OF AN EYE.",[BYE]));
khNpc('psf2_story','The story of the Sleeper','ps_lectern',()=>say("A plaque on a lectern under the portrait. It reads: THE SLEEPER, DREAMER OF THE PALE SPIRE. SHE DREAMED THE SEVEN ROOMS OF THIS FLOOR. WHEN SHE WOULD NOT DREAM FOR THE SOVEREIGN ANY MORE, HER HAND, HER FOOT, HER FACE, HER CHEST, HER LEGS, HER HEART AND HER BRAIN WERE HIDDEN IN HER OWN DREAMS. SHE SLEEPS UNTIL SHE IS WHOLE.",[BYE]));
/* the table: seven hollows, one for each piece; place what you carry; with all seven the Sleeper wakes */
function psf2Table(){
  const F=psf2F();
  if(F.woke)return say("The Sleeper's table. The pale cloth lies smooth over the black stone, and the seven hollows are empty again. The Sleeper stands beside it.",[BYE]);
  if(psf2Placed()>=7)return say("The Sleeper lies whole on her table, pale and still, with her eyes shut. She is breathing.",[['Wake her.',()=>{psf2Wake();G.talk=null;return null}],BYE]);
  const list=PSF2.PARTS.map(p=>p.toUpperCase()+': '+(F.placed[p]?'in place':'empty')).join('. ');
  const carry=PSF2.PARTS.filter(p=>!F.placed[p]&&bagCount(PSF2.ITEMS[p])>0);
  const opts=[];
  if(carry.length)opts.push(['Place '+(carry.length>1?'every piece you carry':'the '+PSF2.NAMES[carry[0]].replace("The Sleeper's ",'').toLowerCase())+'.',()=>{psf2PlaceAll();G.talk=null;return null}]);
  opts.push(BYE);
  return say("A long table of black stone on a low dais, with a pale cloth over it. Seven hollows are cut in the stone in the shape of a person. "+list+'. ('+psf2Placed()+' of 7.)',opts)}
function psf2Place(p){const F=psf2F();if(F.placed[p]||bagCount(PSF2.ITEMS[p])<=0)return false;bagRemove(PSF2.ITEMS[p],1);F.placed[p]=1;F.got[p]=1;return true}
function psf2PlaceAll(){
  let n=0;for(const p of PSF2.PARTS)if(psf2Place(p))n++;
  if(!n)return 0;
  try{sfx('key')}catch(e){}
  if(psf2Placed()<7)msg('You lay '+(n>1?n+' pieces':'the piece')+' in the hollows of the table. '+psf2Placed()+' of 7 are in place.','#ffe36a');
  else{try{sfx('level')}catch(e){}msg('The last piece settles into its hollow, and the pieces are one body. The Sleeper lies whole on her table, and she is breathing.','#ffe36a')}
  psf2Apply();return n}
function psf2Wake(){const F=psf2F();if(F.woke||psf2Placed()<7)return false;F.woke=1;f2Chime('open');msg('The Sleeper opens her eyes, sits up, and steps down from the table.','#ffe36a');psf2Apply();return true}
khNpc('psf2_sleeper','The Sleeper','ps_f2_sleeper_up',()=>say("Thank you. I was in pieces in my own dreams for a very long time, and I could hear every one of you walking through them. I am the Sleeper. I dreamed the seven rooms of this floor for the Sovereign, until I would not dream for her any more. The stair to the third floor is behind the iron door at the east end of the gallery. It is still shut, and the one who shut it is up there. When it opens, I will show you the way. Now go and tell the Dreamkeeper. He has waited longer than I have.",[BYE]));
/* the live level follows the flags: the empty bier, the whole Sleeper lying on it, then the woken Sleeper standing beside it */
function psf2Apply(){
  if(LEVEL!==PSF2H.ID||!G.decor)return;const F=psf2F(),whole=psf2Placed()>=7;
  for(const d of G.decor){if(d.bierMain){const k=psf2BierKey();if(d.k!==k)d.k=k}
    if(d.npc==='psf2_sleeper'){d.hidden=!F.woke;d.found=!F.woke;d.block=!!F.woke}}}
pspOnArrive(n=>{if(n===PSF2H.ID)try{psf2Apply()}catch(e){console.error('psf2Apply',e)}});
/* the stair to the third floor (stub) */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='stair3'){sfx('locked');msg(psf2F().done?'The iron door of the stair to the third floor. The Sleeper has seen the way up, but the door is still shut fast. The third floor is not open yet.':'An iron door with no handle and no keyhole. A stair goes up behind it, to the third floor. It is shut fast.','#c8c4e0');return true}
  return _k.apply(this,arguments)}}
/* ---------- the quest: psq40 The Sleeper's Pieces ---------- */
pgrItem('pg_dreamcrown',{n:"The Sleeper's Circlet",k:'head',t:'Helm',ic:'head',c:PGR_C.bone,armor:34,pas:{dodge:.1,regen:1,mpRegen:1,spellPct:.12,dmgPct:.06},sw:.3,
  d:"A thin circlet of pale silver set with seven grey pearls, one for each piece of the Sleeper. She gave it to the ones who woke her. Armour 34, enemies miss 10% more, spells strike 12% harder, all damage +6%, and wounds and tiredness fade steadily."});
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('pg_dreamcrown',...PSF2.PARTS.map(p=>PSF2.ITEMS[p]));
PGR.PLACE.push(['pg_dreamcrown',9820,'quest','psq40']);
{const S=[['',()=>psf2All(),[]],['',()=>psf2Placed()>=7&&!!psf2F().woke,['psf2_table']]];
 Object.defineProperty(S[0],'0',{get:()=>'Find the seven pieces of the Sleeper in the seven illusion rooms off the Hall of Illusions: the hand, the foot, the face, the chest, the legs, the heart and the brain. '+psf2Count()+' of 7 found.'});
 Object.defineProperty(S[1],'0',{get:()=>psf2Placed()>=7?"Wake the Sleeper: speak to her on her table in the middle of the Hall of Illusions.":"Lay all seven pieces on the Sleeper's table in the middle of the Hall of Illusions. "+psf2Placed()+' of 7 in place.'});
 yrQ('psq40',"The Sleeper's Pieces",'The Dreamkeeper, in the Hall of Illusions',S,{gold:15000,xp:90000,items:['pg_dreamcrown','elixir','elixir','supermana']});
 QAREA.psq40=PSP.REGION}
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids});
  QRF.T.psq40={give:[N(9820,'psf2_keeper')],act:()=>psf2All()?[N(9820,'psf2_table')]:[],ready:[N(9820,'psf2_keeper')]}}
blGiveOpt('psf2_keeper','psq40',()=>true,{
  offer:"The Sleeper's pieces are hidden in the seven rooms off this hall: a hand, a foot, a face, a chest, a pair of legs, a heart and a brain, one in each room. Each piece is behind a small puzzle. Bring all seven back and lay them on her table in the middle of the hall, and she will wake. Will you do it?",
  accept:"Thank you. Ask me about any of the doors and I will tell you what I know about that room. Rest in the Quiet Chapel, west of the stair, whenever you need to. Nothing from the illusions can follow you out of a door.",
  remind:()=>psf2All()?"You have all seven. Lay them on the Sleeper's table in the middle of the hall.":'You have '+psf2Count()+' of the seven pieces. Ask me about a door if you are stuck.',
  ready:"She is awake. I heard her breathe from here. I have kept that table for longer than I can remember.",
  thanks:"Take this. She made it for whoever woke her, a long time ago, before she stopped dreaming for the Sovereign. And take the stores of the hall as well.",
  after:"The Sleeper is awake. She says the stair to the third floor is behind the iron door at the east end of the gallery. It is still shut."});
{const _qt=qTurnIn;qTurnIn=function(id){const r=_qt.apply(this,arguments);try{if(r&&id==='psq40'){psf2F().done=1}}catch(e){}return r}}
