/* ==========================================================================
   ps_f2_rooms_b.js: the illusion rooms 4 and 5 of the Hall of Illusions. See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md. Built with f2Room (ps_f2_kit.js).
   9824 The Waterways (the chest): canals, bridges, gondolas, palazzi; the locked palazzo door at the north end of the Campo of the Doge has three carnival masks
        beside it; the plaque says the Doge admits only the one who watches and says nothing: the plague doctor's mask (owl eyes, a beak that never opens). A wrong mask wakes eels.
   9825 The Desert (the legs): the sunken temple court; the frieze on its north wall shows a scarab, an eye, an ankh and a sun, from left to right; the eight carved floor
        plates (two of each symbol) must be stepped on in that order; then the sarcophagus opens. A wrong step lets out scorpions.
   ========================================================================== */
/* ---------- 4. THE WATERWAYS (9824): the chest ---------- */
const F2_WATER={DOOR:[24,3],MASK:[[20,3,'harlequin','a harlequin mask, red and green diamonds, with a wide painted grin'],[21,3,'plague',"a plague doctor's mask, black, with round glass eyes like an owl's and a long beak that cannot open"],[22,3,'moon','a mask shaped like a silver crescent moon, with a smiling open mouth']],ANSWER:'plague',
  // the gondola ferry: from the Riva up the Rio of Sighs to the steps of the Campo of the Doge, and back
  FERRY:{riva:[28,29],campo:[24,11],up:[[28.5,28.9],[25.5,28.1],[24,27.4],[24,12.2]],upLand:[24,10,0],down:[[24.5,11.6],[24,12.4],[24,27.4],[26.5,28.4],[28.5,28.9]],downLand:[28,30,2]}};
/* the map of the waterways, row by row: o paving, h brick herringbone, q chequered marble, c wet cobble, ~ canal, = a walkable bridge deck, b building (a painted front where it faces the open), m mist */
function f2WaterPlan(){
  const W=48,H=40,T=[];for(let y=0;y<H;y++)T.push(new Array(W).fill('b'));
  const R=(x0,y0,x1,y1,t)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)T[y][x]=t};
  R(3,30,41,32,'o');                 // the Riva, the broad quay along the south side of the Grand Canal
  R(19,33,29,37,'q');                // the Campo of the Riva (the way in)
  R(34,33,41,35,'q');R(6,33,11,35,'o');   // the South Quay, the Bakers' Court
  R(3,25,41,26,'o');                 // the fondamenta on the north side of the Grand Canal
  R(3,27,41,29,'~');R(14,27,16,29,'=');   // the Grand Canal, and the stone bridge over it
  R(21,11,22,24,'o');R(26,11,27,24,'o');R(23,11,25,24,'~');R(23,25,25,26,'=');   // the Rio of Sighs with a quay on each side, and the brick footbridge over its mouth
  R(15,3,33,10,'q');                 // the Campo of the Doge
  R(4,12,11,17,'c');                 // the Fish Market (dark wet cobbles)
  R(4,19,20,19,'o');R(8,18,8,24,'o');     // the calle of the fishers
  R(36,12,43,18,'t');                // the Mask Makers' Square (pale flagstones)
  R(28,20,42,20,'o');R(39,19,39,24,'o');  // the calle of the mask makers
  R(5,10,14,10,'o');R(5,11,5,11,'o');R(34,10,42,10,'o');R(42,11,42,11,'o');   // the two calli from the Campo to the squares
  R(23,3,25,3,'b');                 // the portal of the palace stands one square out from its front
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<=2||x>=45||y<=1||y>=38)T[y][x]='m';
  return T}
function f2WaterBuild(){
  const WH=4.0,W=48,H=40;
  const FL={o:f2TexFloor('ps_f2_tex_masegni','f2t_masegni',1.0)||'pale',h:f2TexFloor('ps_f2_tex_herring','f2t_herring',.95)||'wl2f1',q:f2TexFloor('ps_f2_tex_trachyte','f2t_trachyteq',1.0,[1.02,1.0,.97])||'wl2f2',c:f2TexFloor('ps_f2_tex_cobdark','f2t_cobdark',1.05)||'wetcobble',k:f2TexFloor('ps_f2_tex_curb','f2t_curb',.9)||'pale',t:f2TexFloor('ps_f2_tex_trachyte','f2t_trachyte',.92)||'pale',w:f2TexFloor('ps_f2_tex_water_a','f2t_watera',1.0,[.95,1.0,1.03]),wd:f2TexFloor('ps_f2_tex_water_b','f2t_waterb',1.0,[1,1,1])};
  const C=f2Room({id:9824,ground:FL.o,path:FL.o,noBand:true,wh:WH,rw:0,
    routes:[{p:[[24,35],[24,32],[15,31],[15,25],[21,25],[21,10],[24,9],[24,3]],rw:0},{p:[[24,32],[24,30]],rw:0}],
    clear:[[19,33,29,37,null,null]],edge:()=>false});
  const {rows,block,fm}=C,ix=(x,y)=>y*W+x,hs=C.hs2,T=f2WaterPlan();C.vplan=T;
  const open=(x,y)=>T[y]&&'ohqct='.includes(T[y][x]),wet=(x,y)=>T[y]&&T[y][x]==='~',bld=(x,y)=>T[y]&&T[y][x]==='b';
  // the ground and the water
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){const t=T[y][x];
    if(open(x,y)){rows[y][x]='.';block[ix(x,y)]=0;fm[ix(x,y)]=C.fl(FL[t==='='?'o':t]);C.used.delete(x+','+y)}
    else if(wet(x,y)){rows[y][x]='.';block[ix(x,y)]=1;C.used.add(x+','+y);fm[ix(x,y)]=C.fl(hs(x,y,96)<.3?FL.wd:FL.w)}}   // rippled water with the sky in it, here and there the lamps' gold
  // the edges of the quays are white Istrian stone; the campo of the way in has a white border round its brick
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(open(x,y)&&T[y][x]!=='='&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>wet(x+a,y+b)))fm[ix(x,y)]=C.fl(FL.k);
  
  for(let y=3;y<=10;y++)for(let x=15;x<=33;x++)if(open(x,y)&&((x-15)%4===0||(y-3)%4===0))fm[ix(x,y)]=C.fl(FL.k);
  for(let y=33;y<=37;y++)for(let x=19;x<=29;x++)if(open(x,y)&&((x-20)%4===0||(y-33)%4===0))fm[ix(x,y)]=C.fl(FL.k);
  for(let y=33;y<=35;y++)for(let x=34;x<=41;x++)if(open(x,y)&&((x-34)%3===0||y===33))fm[ix(x,y)]=C.fl(FL.k);
   // the campo: grey trachyte in a grid of white Istrian stone bands
  // ---- the palazzi: every run of building squares that faces the open is cut into lots of two or three squares, each one painted house front (fitted by height, so a wider lot is a taller house) ----
  const LAND=['f2_fa_pinkgoth','f2_fa_ochreloggia','f2_fa_gothbrick','f2_fa_blue','f2_fa_ochrebal','f2_fa_gothcream','f2_fa_rosegoth','f2_fa_ochrebalc','f2_fa_gothpeach','f2_fa_whitebaroque'],WATER=['f2_fw_creamgoth','f2_fw_ochre','f2_fw_pinkloggia'];
  const stucco=C.ch(gyTile('texBone_1',3.0,{gain:1.1,rgb:[1.1,.96,.84],tag:'f2stuccoV'}));
  const done=new Set(),lots=[];let last=[];
  const pick=(list,seed)=>{const c=list.filter(k=>!last.includes(k));const k=c[(hs(seed,7,91)*c.length)|0]||list[0];last=[k].concat(last).slice(0,2);return k};
  const face=(x,y,dx,dy)=>open(x+dx,y+dy)||wet(x+dx,y+dy);
  const putLot=(cells,wetFace,flip,seed,o)=>{o=o||{};const img=o.img||pick(wetFace?WATER:LAND,seed),im=IMG['ps_'+img],n=cells.length;
    let wh=o.wh||(im&&im.width?Math.max(3.3,Math.min(5.8,n*im.height/im.width)):WH);if(n===1&&!o.wh)wh=3.6+hs(seed,3,92)*.8;
    cells.forEach(([x,y],i)=>{const j=(hs(cells[0][0],cells[0][1],95)-.5)*.1,g=f2FacGid('ps_'+img,flip?n-1-i:i,n,+wh.toFixed(2),{tex:o.tex||'texBone_1',rgb:o.rgb||[1.0+j,1,.98-j],emit:o.emit||.1,fit:o.fit});C.solid(x,y,g!=null?C.ch(g):stucco);done.add(x+','+y)});lots.push({img,cells,wh})};
  const cut=(cells,wetFace,flip,seed)=>{let i=0,k=0;while(i<cells.length){const left=cells.length-i;let n=left<=3?left:(left===4?2:(hs(seed,k,93)<.5?2:3));putLot(cells.slice(i,i+n),wetFace,flip,seed*13+k);i+=n;k++}};
  // the Doge's palace along the north side of the campo: arcades of white stone and the pink diamond wall, the great portal in the middle, a bell tower and a church on the sides
  const DW=f2Soft('ps_f2_doge_wing',{filter:'contrast(1.45) saturate(1.38) brightness(.9)',tag:'c2'});
  const PF={filter:'contrast(1.45) saturate(1.38) brightness(.9)',tag:'c2'};
  f2Compose('f2_portal_c',662,706,[[DW,300,42,340,118,0,0,662,196],[f2Soft('ps_f2_portal_wide',PF),0,0,0,0,0,194,662,512]]);
  f2Compose('f2_maskwall_c',350,1120,[[DW,400,42,120,112,0,0,350,330],[f2Soft('ps_f2_maskwall',PF),0,0,0,0,0,328,350,792]]);
  {const bay=(k,crop,fl)=>{const s=f2Soft('ps_'+k,PF),im=IMG[s];if(!im||!im.width)return DW.replace(/^ps_/,'');const h=Math.round(im.height*(1-crop));let o=f2Compose(k+'_cc',im.width,h,[[s,0,im.height-h,im.width,h,0,0,im.width,h]],3.2);if(fl)o=f2Flip(o);return o.replace(/^ps_/,'')};
   const L=(xs,img)=>putLot(xs.map(x=>[x,2]),false,false,xs[0],{img,wh:3.2});   // the wings: a corner with its statues, a balcony bay under Justice, a clock bay, the arcade
   L([15],bay('f2_doge_corner',.12));L([16,17],bay('f2_doge_balcony',.09));L([18,19],bay('f2_doge_clock',.09));
   L([27,28],bay('f2_doge_clock',.09,1));L([29,30],DW.replace(/^ps_/,''));L([31,32],bay('f2_doge_balcony',.09,1));L([33],bay('f2_doge_corner',.12,1));
   for(const x of [20,21,22,26])putLot([[x,2]],false,false,9+x,{img:'f2_maskwall_c',wh:3.2,fit:false,tex:'texBone_1',rgb:[1.06,1.02,.98]});
   putLot([[23,3],[24,3],[25,3]],false,false,3,{img:'f2_portal_c',wh:3.2,fit:false,tex:'texBone_1',rgb:[1.06,1.02,.98],emit:.3})}
  putLot([[42,25],[42,26],[42,27],[42,28],[42,29],[42,30],[42,31],[42,32]].slice(1,6),true,false,65,{img:'f2_church_front',wh:5.6});
  putLot([[14,6]],false,false,61,{img:'f2_campanile',wh:8.2});
  putLot([[34,4],[34,5],[34,6],[34,7],[34,8]],false,false,62,{img:'f2_church_front',wh:5.4});
  // the tall houses either side of the Bridge of Sighs
  putLot([[20,15],[20,16],[20,17]],false,true,63,{img:'f2_fa_whitebaroque',wh:5.6});putLot([[28,15],[28,16],[28,17]],false,false,64,{img:'f2_fa_pinkgoth',wh:5.6});
  for(let y=2;y<H-2;y++){let run=[],wf=false,fl=false;const flush=()=>{if(run.length)cut(run,wf,fl,y*7+run[0][0]);run=[]};
    for(let x=2;x<W-2;x++){const b=bld(x,y)&&!done.has(x+','+y),s=b&&face(x,y,0,1),n=b&&face(x,y,0,-1);
      if(s||n){const w2=(s&&wet(x,y+1))||(!s&&n&&wet(x,y-1)),f2=!s&&n;if(run.length&&(w2!==wf||f2!==fl))flush();if(!run.length){wf=w2;fl=f2}run.push([x,y])}else flush()}flush()}
  for(let x=2;x<W-2;x++){let run=[],wf=false,fl=false;const flush=()=>{if(run.length)cut(run,wf,fl,x*11+run[0][1]+500);run=[]};
    for(let y=2;y<H-2;y++){const b=bld(x,y)&&!done.has(x+','+y),e=b&&face(x,y,1,0),w=b&&face(x,y,-1,0);
      if(e||w){const w2=(w&&wet(x-1,y))||(!w&&e&&wet(x+1,y)),f2=!w&&e;if(run.length&&(w2!==wf||f2!==fl))flush();if(!run.length){wf=w2;fl=f2}run.push([x,y])}else flush()}flush()}
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(bld(x,y)&&!done.has(x+','+y))C.solid(x,y,stucco);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(T[y][x]==='m'&&!(y>=38&&x>=20&&x<=28))C.mist(x,y);
  // over the roofs: the dome of the church and a second bell tower further off
  f2Roof(C,pspPic('f2_church_dome'),37,6,{sc:1.25});
  for(const [k,x,y,b] of [['f2_saint',16,2,3.2],['f2_angel',18,2,3.2],['f2_angel',30,2,3.2],['f2_saint',32,2,3.2]])f2Roof(C,pspPic(k),x,y,{bob:b,sc:.75});   // statues along the roofline of the palace
  for(const L of lots){if(L.cells.length<3||L.wh<3.6)continue;const [x,y]=L.cells[1];if(!(wet(x,y-1)||wet(x,y+1)||wet(x-1,y)||wet(x+1,y)))continue;f2Roof(C,pspPic(hs(x,y,77)<.5?'f2_putto':'f2_saint'),x,y,{bob:L.wh,sc:.6})}f2Roof(C,pspPic('f2_church_dome'),44,28,{sc:1.5});f2Roof(C,pspPic('f2_campanile'),9,6,{sc:1.0});f2Roof(C,pspPic('f2_church_dome'),12,22,{sc:.9});
  // ---- the door of the Doge (locked until the right mask hangs on the hook), the three masks, the plaque ----
  {const dg=f2FacGid('ps_f2_portal_c',1,3,3.2,{tex:'texBone_1',rgb:[1.06,1.02,.98],emit:.4,fit:false});const g=KH_NEXT_GID++;T_TILE[g]=T_TILE[dg!=null?dg:pspDoorGid('great',WH)];KH_DOOR[g]={psf2:'palazzo'};C.solid(F2_WATER.DOOR[0],F2_WATER.DOOR[1],C.ch(g))}
  for(const [x,y,k] of F2_WATER.MASK){C.used.delete(x+','+y);C.dec(pspPic('f2_mask_'+k),x,y,{wd:[0,-1],block:false,npc:'f2w_mask_'+k,bob:.78,sc:k==='harlequin'?2.4:1.75});C.light(x,y,[1.7,1.2,.7])}
  {const pk=f2Lettered('f2_plaque_blank','f2_water_tablet',['THE ONE WHO WATCHES','AND SAYS NOTHING'],{h:1.0,col:'#100800',box:[.2,.28,.8,.74]});{const d=f2Span(C,pk,27.5,3.02,0,-1,1.9,.5);d.npc='f2w_plaque';d.x=27;d.y=3;d.deco=false}C.light(26,3,[1.8,1.3,.75])}
  // the campo: two columns with the winged lion framing the steps of the rio, saints and putti before the palace, lamps, urns of geraniums, banners on the palace
  for(const x of [21,27]){C.used.delete(x+',9');C.dec(pspPic('f2_lioncol'),x,9,{block:true})}
  for(const x of [17,31]){C.dec(pspPic('f2_saint'),x,3,{block:true})}
  for(const [x,y] of [[16,8],[32,8]])C.dec(pspPic('f2_putto'),x,y,{block:true});
  for(const [x,y] of [[20,7],[28,7]]){C.dec(pspPic('f2_lamp3'),x,y,{block:false});C.light(x,y,[2.0,1.35,.7])}
  for(const [x,y] of [[19,6],[29,6]])C.dec(pspPic('f2_flagpole'),x,y,{block:true,sc:.62});
  for(const [x,y,w] of [[27.3,5.6,1.2],[18.6,8.4,1.1],[20.4,30.8,1.1],[30.5,32.4,1.2],[22.7,4.8,1.0],[25.9,33.7,1.0],[21.6,9.6,.9]])f2Span(C,pspPic('f2_pigeons'),x,y,0,1,w,0);
  for(const [x,y,nx,ny] of [[23.15,14.5,1,0],[25.85,19.5,1,0],[23.15,22.5,1,0]])f2Span(C,pspPic('f2_pole_green'),x,y,nx,ny,.3,-.25);   // mooring poles along the rio, passed on the ride
  if(C.isOpen(15,25))C.dec(pspPic('f2_w_balcony2'),15,25,{wd:[0,-1],block:false,bob:.85,sc:.85});

  f2Mover(C,pspPic('f2_pigeons_fly'),[[16,9],[24,5],[32,9],[24,8],[16,9]],.9,{bob:2.6}).fly=1;
  f2Mover(C,pspPic('f2_pigeons_fly'),[[6,30],[40,31]],1.1,{pingpong:true,bob:2.9,sc:.8}).fly=1;
  for(const [x,y] of [[16,5],[32,5]])C.dec(pspPic('f2_wellhead2'),x,y,{block:true,sc:.9});
  for(const [x,y] of [[15,3],[33,3],[15,9],[33,9]])C.dec(pspPic('f2_urn_flowers'),x,y,{block:true,sc:.8});
  C.dec(pspPic('f2_w_lantern2'),29,3,{wd:[0,-1],block:false,bob:1.0});C.light(29,3,[1.9,1.3,.65]);
  for(const [x,y,c] of [[24,4,[2.2,1.5,.7]],[22,8,[1.5,1.1,.65]],[26,8,[1.5,1.1,.65]]])C.light(x,y,c);
  // ---- the bridges: painted planes the party and the boats pass under ----
  f2Span(C,pspPic('f2_br_rialto'),14.0,28.5,1,0,4.5,0).span.deck='hide';f2Span(C,f2Flip(pspPic('f2_br_rialto')),17.0,28.5,1,0,4.5,0).span.deck='hide';
  for(const x of [14.06,16.94])f2Span(C,pspPic('f2_balustrade'),x,28.5,1,0,3.4,0).span.deck='only';   // on the deck the parapets are balustrades     // the grand marble bridge over the Grand Canal (walk over it, row under it)
  f2Span(C,pspPic('f2_br_foot'),24.5,25.0,0,1,5.0,0);f2Span(C,pspPic('f2_br_foot'),24.5,27.0,0,1,5.0,0);       // the brick footbridge over the mouth of the rio
  f2Span(C,pspPic('f2_br_sighs2'),24.5,15.62,0,1,7.0,.75);f2Span(C,pspPic('f2_br_sighs2'),24.5,16.38,0,1,7.0,.75);C.dec(pspPic('lantern_hanging'),24,16,{block:false,bob:1.5,sc:.8});   // the covered Bridge of Sighs, high over the rio and both quays
  C.light(24,25,[1.6,1.1,.55]);C.light(24,16,[1.3,1.0,.7]);
  // ---- the water: gondolas moored and one rowing up and down the Grand Canal, striped poles ----
  const gk=pspPic('f2_gondola2');
  {const a=f2Span(C,gk,28.5,28.95,0,1,3.6,-.2);a.y=29;a.npc='f2w_ferry';a.block=true;a.solid=1;a.deco=false;a.walk=false;const b=f2Span(C,gk,24.5,11.55,0,1,2.9,-.16);b.npc='f2w_ferry2';b.block=true;b.solid=1;b.deco=false;b.walk=false}
  {const ge=pspPic('f2_gondola_e');for(const [x,y] of [[8.5,28.3],[36.5,28.4],[31.4,27.6],[19.6,28.7],[24.5,20.5]]){const rio=x===24.5;const d=f2Span(C,ge,x,y,rio?1:0,rio?0:1,2.7,-.05);if(hs(x|0,y|0,5)<.5)d.k=f2Flip(ge)}}
  for(const [x,y] of [[21.4,29.2],[40.5,27.1]])f2Span(C,pspPic('f2_bricole'),x,y,0,1,.85,-.3);f2Span(C,pspPic('f2_pole_blue'),27.5,29.2,0,1,.32,-.25);
  f2Mover(C,gk,[[19.5,27.6],[40,27.6]],.45,{pingpong:true,bob:-.2,span:[0,1,3.6]});
  {const P=['f2_pole2','f2_pole_blue','f2_pole_green'];[[7,27,0],[9,27,0],[30,27,1],[32,27,1],[36,29,2],[38,29,2],[23,22,1],[25,13,0],[10,29,2],[35,27,0]].forEach(([x,y,i])=>{if(wet(x,y))f2Span(C,pspPic(P[i]),x+.5,y+(y===27?.2:y===29?.8:.5),x===23||x===25?1:0,x===23||x===25?0:1,.3,-.25)})}
  // ---- lamps along the quays, lanterns on the walls ----
  for(const x of [10,18,30,35,40])if(C.free(x,30)){C.dec(pspPic('f2_lamp_canal'),x,30,{block:false});C.light(x,30,[3.0,2.0,.95])}
  for(const x of [11,19,29,35,40])if(C.free(x,25)){C.dec(pspPic(x%2?'f2_lamp1':'f2_lamp_canal'),x,25,{block:false});C.light(x,25,[3.0,2.0,.95])}
  {const fb=f2Soft(pspPic('f2_fogbands'),{l:.38,r:.38,t:.75,b:.45,a:.72,tag:'v4'});f2Span(C,fb,3.06,28.5,1,0,7.4,-.15);f2Span(C,fb,4.3,28.6,1,0,6.4,-.2);f2Span(C,f2Flip(fb),5.6,28.3,1,0,5.0,-.22);f2Span(C,fb,7.0,28.4,1,0,3.4,-.25)}   // the silver mist where the Grand Canal and its quays run out of the illusion
  for(const [x,y] of [[13,32],[17,32]])C.dec(pspPic('f2_obelisk'),x,y,{block:true,sc:.9});
  C.dec(pspPic('f2_lamp1'),14,28,{block:false,sc:.9});C.light(14,28,[2.4,1.6,.8]);   // one lamp on the stone bridge
  for(const [k,x,y] of [['p_ghost_lady',5,19],['p_ghost_gentleman',4,31]])if(C.isOpen(x,y))C.dec(pspPic(k),x,y,{block:false,sc:.95});
  {const fb=f2Soft(pspPic('f2_fogbands'),{l:.22,r:.22,t:.55,b:.35,a:.85,tag:'v2'});f2Span(C,fb,4.15,19.5,1,0,1.6,-.1)}   // the illusion is thin here: a ghost of the castle stands where the street runs into the mist
  for(const x of [5,9,31,36,39])if(C.isOpen(x,32)&&bld(x,33))C.dec(pspPic(x%2?'f2_w_balcony2':'f2_w_flowerbox'),x,32,{wd:[0,1],block:false,bob:1.35,sc:.85});
  for(const [x,y] of [[11,30],[33,30]])C.dec(pspPic('f2_bollards'),x,y,{block:true,sc:.8});
  for(const [x,y] of [[11.4,28.3],[39.3,28.6]])f2Span(C,pspPic('f2_sandolo'),x,y,0,1,2.6,-.06);
  for(const y of [13,20])for(const x of [21,27])if(C.free(x,y)){C.dec(pspPic('f2_w_lantern'),x,y,{wd:[x===21?-1:1,0],block:false,bob:1.25,sc:.9});C.light(x,y,[1.5,1.05,.55])}
  for(const [x,y,wd] of [[8,19,[0,-1]],[12,19,[0,1]],[31,20,[0,-1]],[39,22,[1,0]],[10,10,[0,1]],[38,10,[0,1]]])if(C.isOpen(x,y)&&bld(x+wd[0],y+wd[1])){C.dec(pspPic('f2_w_lantern'),x,y,{wd,block:false,bob:1.2,sc:.85});C.light(x,y,[1.45,1.0,.55])}
  for(const [x,y,wd] of [[16,19,[0,-1]],[33,20,[0,1]]])if(C.isOpen(x,y)&&bld(x+wd[0],y+wd[1]))C.dec(pspPic('f2_w_shrine'),x,y,{wd,block:false,bob:.9,sc:.85});
  // ---- the Fish Market, the Mask Makers' Square, the courts ----
  for(const [x,y] of [[6,12],[11,16]])C.dec(pspPic('f2_fishstall'),x,y,{block:true});
  C.prop('barrels',4,15,{sc:.85});C.prop('barrels',10,12,{sc:.8});
  C.dec(pspPic('f2_maskstall'),37,12,{block:true});C.dec(pspPic('f2_hatstall'),41,12,{block:true,sc:.95});C.dec(pspPic('f2_glassstall'),43,16,{block:true,sc:.95});
  C.dec(pspPic('f2_wellhead2'),39,15,{block:true,sc:.7});C.dec(pspPic('f2_bench'),36,15,{block:true,sc:.85});
  C.dec(pspPic('f2_urn_flowers'),36,18,{block:true,sc:.75});C.dec(pspPic('f2_flowercart'),43,18,{block:true,sc:.9});C.dec(pspPic('f2_flowercart'),38,35,{block:true,sc:.9});
  // laundry on lines strung high across the narrow calli
  for(const [x,y,nx,ny] of [[12.5,19.5,1,0],[17.5,19.5,1,0],[33.5,20.5,1,0],[37.5,20.5,1,0],[8.5,22.5,0,1],[39.5,22.5,0,1],[5.5,10.5,1,0],[38.5,10.5,1,0]])f2Span(C,pspPic('f2_washing'),x,y,nx,ny,1.7,.92);
  for(const [x,y,wd] of [[11,19,[0,-1]],[15,19,[0,1]],[30,20,[0,1]],[35,20,[0,-1]],[8,21,[1,0]],[39,21,[-1,0]],[9,10,[0,-1]],[40,10,[0,1]]])if(C.isOpen(x,y)&&bld(x+wd[0],y+wd[1]))C.dec(pspPic('f2_w_flowerbox'),x,y,{wd,block:false,bob:1.45,sc:.8});
  for(const [x,y] of [[11,33],[34,33],[19,33]])C.dec(pspPic('f2_urn_flowers'),x,y,{block:true,sc:.75});for(const [x,y] of [[6,33],[41,33],[29,33]])C.dec(pspPic('f2_trough'),x,y,{block:true,sc:.9});
  for(const [x,y] of [[20,34],[28,36]]){C.dec(pspPic('f2_lamp3'),x,y,{block:false});C.light(x,y,[2.0,1.35,.7])}
  C.dec(pspPic('f2_wellhead2'),21,36,{block:true,sc:.9});C.dec(pspPic('f2_bench'),27,34,{block:true,sc:.85});
  for(const [x,y,c] of [[3,28,[.8,.95,1.2]],[3,31,[.8,.95,1.2]]])C.light(x,y,c);   // the silver mist where the canal and the Riva run out of the illusion
  for(const [x,y,wd] of [[13,10,[0,1]],[33,15,[0,0]],[22,33,[0,0]],[6,24,[-1,0]],[39,23,[-1,0]]])if(C.isOpen(x,y)&&bld(x+wd[0],y+wd[1]))C.dec(pspPic('f2_w_niche'),x,y,{wd,block:false,bob:.8,sc:.9});
  C.mapNames.push({t:'The Campo of the Doge',x:24,y:6,k:'place'},{t:'The Fish Market',x:7,y:14,k:'place'},{t:"The Mask Makers' Square",x:39,y:15,k:'place'},{t:'The Grand Canal',x:34,y:28,k:'place'},{t:'The Rio of Sighs',x:24,y:18,k:'place'},{t:'The Riva',x:9,y:31,k:'place'},{t:'The South Quay',x:37,y:34,k:'place'});
  // ---- creatures, chests ----
  pspSafeZone(C,24,35,6);pspSafeRect(C,22,3,26,12);
  C.foes(['f2eel','f2eel','f2cutthroat'],[4,13,11,17],1);
  C.foes(['f2cutthroat','f2cutthroat','f2sprite'],[36,13,43,18],2);
  C.foes(['f2gondolier','f2gondolier','f2eel'],[3,18,13,26],3,{pr:1});
  C.foes(['f2sprite','f2gondolier','f2sprite'],[33,32,42,36],4,{pr:1});
  C.foes(['f2gondolier','f2eel'],[28,19,44,26],5,{pr:1});
  for(const [x,y] of [[4,17],[43,13],[41,35]])C.chestAt(x,y,1);
  C.ret();
  // the way back is a palazzo too: house fronts either side, the great door of a palazzo, Venetian lamps instead of the castle's pillars
  putLot([[20,38],[21,38]],false,true,720,{wh:4.0});putLot([[27,38],[28,38]],false,true,727,{wh:4.3});
  putLot([[22,38],[23,38]],false,true,721,{wh:3.5});putLot([[25,38],[26,38]],false,true,725,{wh:3.6});
  f2Compose('f2_illgate_c',266,757,[['ps_f2_illgate',105,0,266,757,0,0,266,757]],NPC_H.ps_f2_illgate);f2RetGate(C,'ps_f2_illgate',{one:true,wh:3.5,tex:'texBone_1',rgb:[.78,.84,.96],emit:.08});
  {const lo=C.ch(f2MistGid(2,.06));for(let y=24;y<=33;y++)for(let x=0;x<=2;x++)C.solid(x,y,lo)}   // the mist at the west end lies low, so the wisps rise against the silver horizon
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(d.y===37&&(d.x===22||d.x===26)&&/pillar_lantern/.test(d.k))C.decor.splice(i,1)}
  C.dec(pspPic('f2_lamp3'),22,37,{block:false});C.dec(pspPic('f2_angel'),20,37,{block:true,sc:.9});C.dec(pspPic('f2_urn_flowers'),26,37,{block:true,sc:.75});
  // a little life on the house fronts: lanterns, flower boxes, balconies, niches and shrines, never the same three times running
  {const PCS=['f2_w_lantern2','f2_w_flowerbox','f2_w_balcony2','f2_w_niche','f2_w_shrine'],taken=new Set(C.decor.filter(d=>d.wd).map(d=>d.x+','+d.y));let n=0;
   for(const L of lots){if(L.cells.length<2||hs(L.cells[0][0],L.cells[0][1],97)>.42)continue;const [bx,by]=L.cells[L.cells.length>>1];
     for(const [a,b] of [[0,1],[0,-1],[1,0],[-1,0]]){const x=bx+a,y=by+b;if(!C.isOpen(x,y)||!open(x,y)||taken.has(x+','+y))continue;const k=PCS[n%PCS.length];n++;taken.add(x+','+y);
       C.dec(pspPic(k),x,y,{wd:[-a,-b],block:false,bob:k==='f2_w_balcony2'?1.3:k==='f2_w_flowerbox'?1.15:.62,sc:.8});if(k==='f2_w_lantern2')C.light(x,y,[2.4,1.6,.8]);break}}}
  for(const d of C.decor)if(/lamp|lantern/.test(String(d.k))&&!d.wd){d.lift=.95;if(d.kname&&C.f2x[d.kname])C.f2x[d.kname].lift=.95;else f2X(C,d,['lift'])}   // the lanterns shine by their own light
  const lv=C.done({glow:6});lv._f2deck=[14,25,16,31];
  return lv}
pspRegister(9824,f2WaterBuild);
khNpc('f2w_plaque','A plaque','ps_f2_plaque_blank',()=>say('A plaque of cream marble in a gilded frame beside the door. The letters read: THE DOGE ADMITS ONLY THE ONE WHO WATCHES AND SAYS NOTHING. Under them, smaller: HANG YOUR FACE ON THE HOOK BY THE DOOR.',[BYE]));
khNpc('f2w_ferry','A gondolier','ps_f2_gondola2',()=>say('A gondolier in a striped shirt and a straw hat leans on his oar in a long black gondola. "Up the Rio of Sighs to the Campo of the Doge? Step in."',[['Ride up the rio.',()=>{f2WaterRide(true);return null}],BYE]));
khNpc('f2w_ferry2','A gondolier','ps_f2_gondola2',()=>say('The gondolier waits at the steps of the campo. "Back down to the Riva?"',[['Ride down to the Riva.',()=>{f2WaterRide(false);return null}],BYE]));
function f2WaterRide(up){const F=F2_WATER.FERRY,me=(G.decor||[]).find(d=>d.npc===(up?'f2w_ferry':'f2w_ferry2'));G.talk=null;msg(up?'The gondolier pushes off and rows you up the Rio of Sighs.':'The gondolier rows you back down the rio to the Grand Canal.','#e8dcc0');
  f2Ride(up?F.up:F.down,up?F.upLand:F.downLand,{speed:1.5,hide:me,done:()=>{if(me)me.hidden=false;msg(up?'The gondola bumps against the steps of the Campo of the Doge.':'The gondola bumps against the stones of the Riva.','#e8dcc0')}})}
for(const [x,y,k,desc] of F2_WATER.MASK)khNpc('f2w_mask_'+k,'A carnival mask','ps_f2_mask_'+k,()=>{const R=f2S(9824);
  if(R.open)return say('The masks hang quietly on their hooks. The door of the palazzo stands open.',[BYE]);
  return say('Hanging on a hook beside the door: '+desc+'.',[['Hang this mask on the hook by the door.',()=>{f2WaterMask(k,x,y);G.talk=null;return null}],BYE])});
function f2WaterMask(k,x,y){const R=f2S(9824);if(R.open)return;
  if(k===F2_WATER.ANSWER){R.open=1;f2Chime('open');msg('You hang the plague doctor mask on the hook by the door. Somewhere inside, a bell rings once. The lock turns, and the door of the palazzo swings open.','#ffe36a')}
  else{f2Chime('bad');msg('A bell rings, harsh and loud. The water of the canal heaves, and something long and dark slides out onto the stones.','#e0c8a0');f2Release('f2eel',2,x,y+2)}}
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psf2==='palazzo'){const R=f2S(9824);
    if(!R.open){sfx('locked');msg('A heavy door of dark wood, studded with iron, with no handle on this side. A hook for a mask hangs beside it.','#c8c4e0');return true}
    if(!psf2F().got.chest){sfx('door');msg('Inside the door, on a stand of black wood, is a pale chest, wrapped in silk.','#e8dcc0');psf2Give('chest');return true}
    sfx('bump');msg('The hall behind the door is empty. The stand where the chest lay is bare.','#c8c4e0');return true}
  return _k.apply(this,arguments)}}
/* ---------- 5. THE DESERT (9825): the legs ---------- */
const F2_DESERT={ORDER:['scarab','eye','ankh','sun'],PLATES:[[20,6,'scarab'],[22,6,'sun'],[26,6,'ankh'],[28,6,'eye'],[20,8,'eye'],[22,8,'ankh'],[26,8,'sun'],[28,8,'scarab']],SARC:[24,3]};
function f2DesertBuild(){
  const DS=f2TexFloor('ps_f2_tex_desand','f2t_desand',1.0)||'sand',DC=f2TexFloor('ps_f2_tex_decrack','f2t_decrack',1.0)||'sand',DP=f2TexFloor('ps_f2_tex_depave','f2t_depave2',.72,[.95,.95,1.0])||'tombslab',DB=f2TexFloor('ps_f2_tex_depebble','f2t_depebble2',1.35,[1.08,1.0,.88])||'sand';
  const C=f2Room({id:9825,ground:DS,path:DB,band:[2,5],wh:3.4,softRet:1,rw:0,
    routes:[[[24,35],[24,26],[16,21],[16,15],[24,12],[24,11]],[[24,27],[34,23],[38,19]],[[16,18],[8,18]],[[22,32],[10,30]]],
    clear:[[16,1,32,12,DP,'The Sunken Temple'],[4,13,13,23,DS,'The Oasis',1],[33,14,43,24,DS,'The Fallen King',1],[5,26,14,34,DS,'The Bone Dunes',1]]});
  const W=48,{rows,block,fm}=C,hs=C.hs2;
  // the temple court: sandstone walls round x 18..30, y 3..10, the way in at the south (23..25,11); the frieze on the north wall (x 19..21)
  const tw=f2TexWall(f2Soft('ps_f2_de_wall',{filter:'saturate(.55) brightness(1.1)',tag:'t'}),3.0,{gain:1.08,rgb:[1.16,1.0,.76]}),sand=[0,1,2].map(v=>C.ch(tw!=null?tw:gyTile('texBone_'+(1+v),3.4,{gain:1.2,rgb:[1.18,1.0,.74],tag:'f2sandst'+v})));
  for(let y=2;y<=11;y++)for(let x=17;x<=31;x++){const ring=x===17||x===31||y===2||y===11;if(!ring)continue;if(y===11&&x>=23&&x<=25)continue;C.solid(x,y,sand[(x*3+y)%3])}
  {const fz=f2Soft('ps_f2_frieze',{filter:'contrast(1.6) brightness(.9)',tag:'c'});for(let x=20;x<=22;x++){const f=f2FacGid(fz,x-20,3,3.0,{tex:'texBone_1',rgb:[1.1,1.0,.85],fit:false,emit:.45});if(f!=null)C.solid(x,2,C.ch(f))}
   for(let x=26;x<=28;x++){const f=f2FacGid(fz,x-26,3,3.0,{tex:'texBone_1',rgb:[1.1,1.0,.85],fit:false,emit:.45});if(f!=null)C.solid(x,2,C.ch(f))}}   // the frieze twice, either side of the sarcophagus: the same four signs in the same order
  for(let y=1;y<=1;y++)for(let x=16;x<=32;x++)C.mist(x,y);
  // the floor plates (painted carved tiles) and the sarcophagus
  const TF={};for(const s of ['scarab','eye','ankh','sun']){const k=f2TexFloor(f2Soft('ps_f2_tile_'+s,{filter:'contrast(1.8) saturate(1.3)',tag:'c'}),'f2t6_'+s,1.0,[1.1,.97,.75],1);TF[s]=k?C.fl(k):C.fl('tombslab')}
  for(const [x,y,s] of F2_DESERT.PLATES){fm[y*W+x]=TF[s];C.reserve(x,y,x,y)}
  {const [sx,sy]=F2_DESERT.SARC;C.used.delete(sx+','+sy);C.dec(pspPic('f2_sarc_shut'),sx,sy,{block:true,npc:'f2d_sarc'})}
  C.plaque(19,10,'f2_desert_plaque',['READ THE WALL','AND WALK IT'],'f2d_plaque','A slab of sandstone by the way in. Cut into it: READ THE WALL FROM LEFT TO RIGHT, AND WALK IT. Above you, on the north wall of the court, a frieze is carved: a scarab, an eye, an ankh and a sun disc, in that order from left to right. Eight carved plates are set in the floor.');
  for(const [x,y] of [[18,3],[30,3],[18,9],[30,9]])C.prop('f2_column_lotus',x,y,{sc:.85});
  for(const [x,y] of [[22,4],[26,4]]){const b=IMG.brazier0?C.dec('brazier',x,y,{block:true,sc:1.1}):C.prop('brazier',x,y,{block:true});if(b)b.lift=.95;C.light(x,y,[2.4,1.5,.6])}
  // the dunes: palms at the oasis, rocks, obelisks and a fallen head
  for(const [x,y] of [[8,18],[9,18],[8,19],[9,19]])if(C.free(x,y))C.dec(pspPic('f2_reeds'),x,y,{block:true,sc:1.1});   // reeds round the spring of the oasis
  f2Patches(C,[[DS,.7],[DB,.3]],{cs:6,keep:(x,y)=>x>=17&&x<=31&&y<=11});
  const PALE={filter:'saturate(.55) brightness(1.18) contrast(.95)',tag:'p'},DT=[f2Soft(pspPic('f2_de_pillar'),PALE),f2Soft(pspPic('f2_de_mesa'),PALE),pspPic('f2_de_palm'),f2Soft(pspPic('f2_de_pillar'),PALE),'dpalm1','dpalm3'];DT.push(...DT.map(f2Flip));
  C.fill(DT.concat(['drock0','drock1','drock2']),{p1:.08,p2:.35,p3:.6,sc:.9});
  for(const d of C.decor)if(/f2_de_|drock/.test(d.k)&&d.block){d.sc=+((d.sc||1)*(.8+C.hs2(d.x,d.y,171)*.45)).toFixed(2);d.ox=(C.hs2(d.x,d.y,172)-.5)*.8;d.oy=(C.hs2(d.x,d.y,173)-.5)*.6}
  C.scrub([pspPic('f2_de_shrub'),pspPic('f2_de_cairn'),pspPic('f2_de_shrub'),pspPic('f2_de_shard')],.06,{sc:.75});
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if((!d.block||/drock|f2_de_(pillar|mesa)/.test(d.k))&&!d.npc&&/f2_de_|drock/.test(d.k)&&((d.x>=16&&d.x<=31&&d.y<=11)||Math.hypot(d.x-24,d.y-36)<3)){C.used.delete(d.x+','+d.y);C.decor.splice(i,1)}}   // the temple court and the gate stay clear
  for(const [x,y,k] of [[9,29,'gy_bones'],[12,31,'f2_de_amphora'],[7,27,'gy_bones'],[40,22,'f2_de_amphora'],[36,16,'f2_de_column'],[42,19,'f2_de_column'],[11,14,'f2_de_amphora'],[37,18,'f2_de_shard'],[39,18,'f2_de_shard'],[38,19,'f2_de_column'],[39,16,'f2_de_shard'],[37,16,'f2_de_shard'],[39,17,'f2_de_column'],[37,17,'f2_de_column']])if(C.free(x,y)&&!C.nearPath(x,y,0))C.dec(/^gy_/.test(k)?k:pspPic(k),x,y,{block:/column|shard/.test(k),sc:/^gy_/.test(k)?.55:1});
  for(const [x,y] of [[5,15],[12,16],[6,22],[11,22],[5,19]])if(C.free(x,y))C.dec(['dpalm0','dpalm1','dpalm2','dpalm3'][(x+y)%4],x,y,{block:true});
  C.used.delete('38,17');C.dec(pspPic('f2_de_pharaoh'),38,17,{block:true,sc:1.1});C.used.delete('35,21');C.dec('dobelisk',35,21,{block:true});C.used.delete('41,21');C.dec('dobelisk',41,21,{block:true});
  C.scrub(['drock1','yar_shells'],.02);
  C.capTrees(/dpalm|f2_de_(palm|pillar|mesa|cactus)/,2.6);
  f2Edge(C,{img:f2Soft('ps_f2_de_wall',PALE).replace(/^ps_/,''),wh:2.0,veil:.12,pillar:DT,innerP:.45,innerKeep:(x,y)=>x>=15&&x<=33&&y<=12,tall:[f2Soft(pspPic('f2_de_mesa'),PALE).replace(/^ps_/,''),f2Soft(pspPic('f2_de_pillar'),PALE).replace(/^ps_/,'')],tallP:.35,tallSc:[1.0,1.5]});
  pspSafeZone(C,24,35,6);
  C.foes(['f2scorpion','f2scorpion','f2dustdevil'],[4,13,13,23],1);
  C.foes(['f2mummy','f2mummy','f2sandwraith'],[33,14,43,24],2);
  C.foes(['f2sandwraith','f2dustdevil','f2scorpion'],[5,26,14,34],3);
  C.foes(['f2mummy','f2dustdevil'],[30,26,44,36],4);
  for(const [x,y] of [[12,14],[42,15],[6,33]])C.chestAt(x,y,1);
  C.ret();f2RetGate(C,f2Soft('ps_f2_illgate',{filter:'brightness(.85) contrast(1.15)',tag:'d'}),{one:true,wh:3.0,tex:'texBlack_2',rgb:[.9,.95,1.05]});
  return C.done({glow:8})}
pspRegister(9825,f2DesertBuild);
F2.step[9825]=(x,y)=>{
  const p=F2_DESERT.PLATES.find(q=>q[0]===x&&q[1]===y);if(!p)return;const R=f2S(9825);if(R.solved)return;R.seq=R.seq||[];
  const want=F2_DESERT.ORDER[R.seq.length];
  if(p[2]===want){R.seq.push(p[2]);f2Chime('ok',R.seq.length-1);msg('The '+p[2]+' plate sinks a finger deep under your feet with a click. ('+R.seq.length+' of 4.)','#f0e0b0');
    if(R.seq.length===4){R.solved=1;R.seq=[];f2Chime('open');msg('Stone grinds on stone. The lid of the sarcophagus slides aside.','#ffe36a');f2DesertApply()}}
  else{R.seq=[];f2Chime('bad');msg('The '+p[2]+' plate grinds down, and sand pours out of the cracks round it. Scorpions come with the sand. Every plate rises back up.','#e0c8a0');f2Release('f2scorpion',2,x,y)}};
khNpc('f2d_sarc','A sarcophagus','ps_f2_sarc_shut',()=>{const R=f2S(9825);
  if(!R.solved)return say('A tall stone sarcophagus stands against the north wall, carved with the face of a king. The lid is sealed tight with old pitch.',[BYE]);
  if(!psf2F().got.legs)return say('The lid of the sarcophagus has slid aside. Inside, wrapped in pale linen, is a pair of legs.',[["Take the Sleeper's Legs.",()=>{psf2Give('legs');G.talk=null;return null}],BYE]);
  return say('The sarcophagus stands open and empty.',[BYE])});
function f2DesertApply(){if(LEVEL!==9825)return;const R=f2S(9825);if(!R.solved)R.seq=[];for(const d of G.decor||[])if(d.npc==='f2d_sarc')d.k=pspPic(R.solved?'f2_sarc_open':'f2_sarc_shut')}
f2OnArrive(9825,()=>f2DesertApply());
