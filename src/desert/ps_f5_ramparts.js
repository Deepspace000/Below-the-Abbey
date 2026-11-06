/* ==========================================================================
   THE PALE SPIRE, FIFTH FLOOR: THE RAMPARTS (level 9900, 64 x 64, outdoor, night, rating 111; prefix psf5).
   The stair from the Floor of the Moon comes out on the castle ramparts. A wide flagged walk runs all round, inside a low parapet, and beyond the parapet the ground falls
   away into the dark, so there are views on every side. In the middle, on a high dais, stands the Pale Tower: a thin, narrow, black-green Gothic spire with tall arched
   windows glowing pale yellow-green, rising into the clouds. One thin stair, fenced on both sides, climbs from the south walk to the dais and the door at the foot of the spire.
   Door at the foot of the spire: a link to 9910, the first tiny room of the tower (ps_f6_tower.js).
   ========================================================================== */
const PSF5={ID:9900,W:64,H:64,STAIR:[32,41,32,54],DAIS:[24,24,40,40],DAISH:2.4,DOOR:[32,34],DOWN:[32,58],
  TOWNS:[[.03,70,1],[.11,34,.5],[.19,90,1.2],[.29,46,.7],[.38,110,1.3],[.47,30,.45],[.55,64,.9],[.64,100,1.2],[.72,38,.55],[.8,76,1],[.89,50,.7],[.96,28,.4]]};   // far towns round the horizon: [turns round the compass, width, size]
/* one wall tile of the spire: column k (-2..2 across the face from the middle) of the painted spire, cut from its foot up to the height wh of the step; the whole picture stands 14.5 squares high, 100 pixels to a square */
function psf5SpireTile(k,wh){
  const f=IMG[pspPic('spire_tall')],ok=!!(f&&f.width);
  return gyTile('texBlack_2',wh,{gain:1.05,rgb:[.78,.95,.88],tag:'psf5s'+wh+'_'+k+(ok?'L':'N'),draw:(x,w,h)=>{
    if(!ok)return;const T=14.5,ppc=f.height/T,sw=ppc*(w/128),sy=f.height-wh*ppc,sx=f.width/2+(k-.5)*ppc;
    x.imageSmoothingQuality='high';x.drawImage(f,sx,sy,sw,wh*ppc,0,0,w,h)}})}
function psf5Build(info){
  const W=PSF5.W,H=PSF5.H,id=PSF5.ID;
  const C=pspMake({id,start:{x:32,y:56,f:0},walled:true,wall:'dark',wh:1.3,floor:'flag',amb:.72,wind:.45,lcol:PSP_PAL.silver,terrace:true});
  const {rows,block,hgt}=C,ix=(x,y)=>y*W+x,hs=C.hs;
  const wt=(style,wh,x,y)=>C.ch(pspWallGid(style,(hs(x,y,3)*4)|0,wh));
  const wall=(x,y,style,wh)=>{if(x>=0&&y>=0&&x<W&&y<H)C.solid(x,y,wt(style,wh,x,y))};
  /* the ground outside the parapet falls away into the dark: nothing there but low wall far below the walk */
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)hgt[ix(x,y)]=-7;
  /* the walk: one wide flagged floor inside the parapet, with a dark band of flagstones round the edge */
  C.carve(6,6,57,57);C.setFloor(6,6,57,57,'flag');
  for(let y=6;y<=57;y++)for(let x=6;x<=57;x++){hgt[ix(x,y)]=.3;if(x<=8||x>=55||y<=8||y>=55)C.setFloorCell(x,y,'flagdark')}
  /* the parapet: a low stone wall all round, with a taller block at each corner */
  for(let i=5;i<=58;i++)for(const [x,y] of [[i,5],[i,58],[5,i],[58,i]]){hgt[ix(x,y)]=.3;wall(x,y,'dark',1.35)}
  for(const [cx,cy] of [[5,5],[58,5],[5,58],[58,58]])for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=cx+dx,y=cy+dy;if(x<5||y<5||x>58||y>58)continue;hgt[ix(x,y)]=.3;wall(x,y,'dark',3.2)}
  /* the dais: a high platform in the middle with a retaining wall; the spire stands on it */
  const [dx0,dy0,dx1,dy1]=PSF5.DAIS,DH=PSF5.DAISH;
  C.setFloor(dx0,dy0,dx1,dy1,'marble');
  for(let y=dy0;y<=dy1;y++)for(let x=dx0;x<=dx1;x++)hgt[ix(x,y)]=DH;
  for(let i=dx0-1;i<=dx1+1;i++)for(const [x,y] of [[i,dy0-1],[i,dy1+1],[dx0-1,i],[dx1+1,i]]){if(x===PSF5.STAIR[0]&&y===PSF5.STAIR[1])continue;hgt[ix(x,y)]=.3;wall(x,y,'dark',DH-.3)}
  /* the thin stair: one square wide, from the south walk up to the dais, with a fence both sides that nobody can pass */
  const [sx,sy0,,sy1]=PSF5.STAIR;
  C.rise(sx,sy0,sx,sy1,DH,.3,'y');
  /* nothing built beside the stair: the cells at its sides are simply blocked, so you cannot step off it */
  for(let y=sy0+1;y<=sy1;y++){C.setFloorCell(sx,y,'marble');for(const x of [sx-1,sx+1])block[ix(x,y)]=1}
  /* the spire: a solid tower built of tall wall squares in three steps (5 x 5 base 3.6 high, 3 x 3 body 8.5 high, a single square of 14.5 at the core, so it narrows as it rises); every face is the matching slice of the painted spire,
     100 picture pixels to a square both ways, so the arched windows line up from every side. You can walk all the way round it. Its door is in the middle of the south face. */
  const [px,py]=PSF5.DOOR,cx=px,cy=py-2;
  const tiers=[[2,3.6],[1,8.5],[0,14.5]];
  for(const [r,wh] of tiers)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(r&&Math.max(Math.abs(dx),Math.abs(dy))<r)continue;
    const x=cx+dx,y=cy+dy,k=Math.abs(dx)===r&&Math.abs(dy)===r?dx:Math.abs(dy)===r?dx:dy;hgt[ix(x,y)]=DH;C.solid(x,y,C.ch(psf5SpireTile(k,wh)))}
  C.light(px,py+2,[1.1,1.35,.8]);C.light(px+3,py+1,[.9,1.2,.7]);C.light(px-3,py+1,[.9,1.2,.7]);
  /* red candelabras in two rings round the foot of the spire, with low clusters of candles between them, all throwing red light up its black-green walls */
  const RED=[1.7,.5,.3],cand=(name,x,y,sc)=>{if(C.free(x,y)){C.prop(name,x,y,{block:true,sc});return true}return false};
  const ring1=[[29,29],[31,29],[33,29],[35,29],[29,31],[29,33],[35,31],[35,33],[29,35],[35,35],[30,35],[34,35]],
        ring2=[[27,27],[32,27],[37,27],[27,32],[37,32],[27,37],[37,37],[30,37],[34,37],[27,30],[27,34],[37,30],[37,34],[30,27],[34,27]];
  ring1.forEach(([x,y],i)=>{if(cand(i%2?'candelabra_red2':'candelabra_red',x,y,.85)&&i%4===0)C.light(x,y,RED)});
  ring2.forEach(([x,y],i)=>{if(cand(i%2?'candelabra_red':'candelabra_red2',x,y,1)&&i%5===0)C.light(x,y,RED)});
  /* gothic lampstands in an outer ring: black iron posts with red lanterns, and triple-lamp standards at the corners and the middle of each side */
  for(const [x,y] of [[26,26],[32,26],[38,26],[26,32],[38,32],[26,38],[38,38]])if(cand('f2_lamp3',x,y,1))C.light(x,y,[1.5,.7,.45]);
  for(const [x,y] of [[28,26],[30,26],[34,26],[36,26],[26,28],[26,30],[26,34],[26,36],[38,28],[38,30],[38,34],[38,36],[28,38],[30,38],[34,38],[36,38]])if(cand('lantern_red_b',x,y,1)&&(x+y)%8===0)C.light(x,y,RED);
  /* the way down, in the middle of the south parapet */
  C.links({style:{'the stair down':'stair'}});
  /* lamps and braziers along the walk, banners, statues */
  const braz=(x,y)=>{if(C.free(x,y)){C.prop('brazier',x,y,{block:true,sc:.9});C.light(x,y,PSP_PAL.warm.map(v=>v*.9))}};
  for(const x of [12,22,42,52]){braz(x,7);braz(x,56)}
  for(const y of [12,22,42,52]){braz(7,y);braz(56,y)}
  for(const [x,y] of [[28,44],[36,44],[28,52],[36,52]])braz(x,y);
  for(const [x,y] of [[10,10],[53,10],[10,53],[53,53]])if(C.free(x,y))C.prop('st_saint2',x,y,{block:true,sc:1});
  for(const [x,y] of [[17,30],[46,30],[17,34],[46,34]])if(C.free(x,y))C.prop('st_headless',x,y,{block:true,sc:1});
  /* a watch nook in the south-west corner: bed, chest, and nothing from the floor comes in */
  pspRest(C,{x0:9,y0:50,x1:15,y1:55,bed:[11,52],chest:[14,54],name:'The Watch Nook',line:'A lean-to against the parapet, with a narrow bed, a brass lamp and a stove. Warm candles burn here, and nothing from the floor can come in.'});
  pspSafeRect(C,9,50,15,55);pspSafeRect(C,27,50,37,57);
  /* the creatures: statues that wake beside the stair, and the walkers of the ramparts */
  pspStatueWake(C,'psgargoyle',30,43);pspStatueWake(C,'psgargoyle',34,43);
  const foes=['psgargoyle','pswraith','psstarwraith','psmirrorshade','psfiend','pssentinel'];
  const spots=[];for(let y=8;y<=55;y++)for(let x=8;x<=55;x++){const near=x>=dx0-2&&x<=dx1+2&&y>=dy0-2&&y<=dy1+2;if(!near&&C.free(x,y)&&!(x>=27&&x<=37&&y>=50)&&!(x>=9&&x<=15&&y>=50))spots.push([x,y])}
  let n=18;while(n-->0&&spots.length){const i=(hs(n,77,5)*spots.length)|0,[x,y]=spots.splice(i,1)[0];pspFoe(C,foes[n%foes.length],x,y,{lvl:111})}
  /* chests: one in each corner, and two beside the dais */
  for(const [x,y] of [[8,8],[55,8],[55,55],[26,26],[38,26]])if(C.free(x,y))C.chest(x,y,{gold:2600+((hs(x,y,9)*1400)|0),tier:1});
  C.mapNames.push({t:'The Ramparts',x:32,y:48,k:'place'},{t:'The Pale Tower',x:32,y:33,k:'place'},{t:'The North Walk',x:32,y:10,k:'place'},{t:'The Watch Nook',x:12,y:52,k:'place'});
  C.glow(8,PSP_PAL.silver);
  const lv=C.finish({start:{x:32,y:56,f:0}});
  if(lv._ps)lv._ps.towns=PSF5.TOWNS;
  return lv}
pspRegister(PSF5.ID,psf5Build);
/* ---------- the links ---------- */
PSP_L(9900,PSF5.DOWN,9890,[36,5,2],{name:'the stair down'});
PSP_L(9900,PSF5.DOOR,9910,[7,9,0],{name:'the door at the foot of the Pale Tower'});
pspOnArrive(n=>{if(n!==PSF5.ID)return;try{for(const L of LIGHTS)L.calm=true;   // steady candle light, no strong flicker, so nothing flashes as you walk
    const F=psf4F();if(!F.ramp){F.ramp=1;msg('The stair ends in the open air. You stand on the ramparts of the castle, at night, and the wind pulls at you. Far below, the dark land runs out on every side. In the middle, a thin black-green spire rises out of sight into the clouds, with tall windows glowing pale green.','#d8e4ff')}}catch(e){console.error('psf5 arrive',e)}});
