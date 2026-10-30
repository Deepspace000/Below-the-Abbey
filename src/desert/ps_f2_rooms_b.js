/* ==========================================================================
   ps_f2_rooms_b.js: the illusion rooms 4 and 5 of the Hall of Illusions. See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md. Built with f2Room (ps_f2_kit.js).
   9824 The Waterways (the chest): canals, bridges, gondolas, palazzi; the locked palazzo door at the north end of the Campo of the Doge has three carnival masks
        beside it; the plaque says the Doge admits only the one who watches and says nothing: the plague doctor's mask (owl eyes, a beak that never opens). A wrong mask wakes eels.
   9825 The Desert (the legs): the sunken temple court; the frieze on its north wall shows a scarab, an eye, an ankh and a sun, from left to right; the eight carved floor
        plates (two of each symbol) must be stepped on in that order; then the sarcophagus opens. A wrong step lets out scorpions.
   ========================================================================== */
/* ---------- 4. THE WATERWAYS (9824): the chest ---------- */
const F2_WATER={DOOR:[24,2],MASK:[[20,3,'harlequin','a harlequin mask, red and green diamonds, with a wide painted grin'],[22,3,'plague',"a plague doctor's mask, black, with round glass eyes like an owl's and a long beak that cannot open"],[27,3,'moon','a mask shaped like a silver crescent moon, with a smiling open mouth']],ANSWER:'plague'};
function f2WaterBuild(){
  const WH=4.0;
  const C=f2Room({id:9824,ground:'pale',path:'pale',noBand:true,wh:WH,rw:0,
    routes:[{p:[[24,37],[24,9]],rw:1},[[5,30],[43,30]],[[5,33],[43,33]],[[5,20],[43,20]],[[5,17],[43,17]],[[7,10],[7,30]],[[41,17],[41,33]],[[15,20],[15,30]],[[33,20],[33,30]]],
    clear:[[15,3,33,10,'wl2f1','The Campo of the Doge'],[3,10,10,15,'wetcobble','The Fish Market'],[36,22,44,28,'wl2f2',"The Mask Makers' Square"],[3,31,44,32,null,null],[3,18,44,19,null,null],[29,34,44,36,'pale','The South Quay']],
    edge:(C,x,y)=>false});
  const W=48,H=40,{rows,block,fm}=C,ix=(x,y)=>y*W+x,hs=C.hs2;
  // the canals: water, except where a street crosses (a bridge with rails)
  const isPath=(x,y)=>!!C.pathM[ix(x,y)];
  for(const [y0,y1] of [[31,32],[18,19]])for(let y=y0;y<=y1;y++)for(let x=3;x<=44;x++){if(isPath(x,y)){C.setFl(x,y,x,y,'wl2f1');for(const dx of [-1,1])if(!isPath(x+dx,y)&&!C.decor.some(d=>d.x===x+dx&&d.y===y)){}continue}C.water(x,y,'canal')}
  for(const [y0,y1] of [[31,32],[18,19]])for(let y=y0;y<=y1;y++)for(let x=3;x<=44;x++)if(isPath(x,y))for(const dx of [-1,1])if(C.rows[y][x+dx]==='.'&&C.block[ix(x+dx,y)]){C.used.delete((x+dx)+','+y);C.prop('bridge_rail',x+dx,y,{block:false,maxW:1})}
  // the palazzi: every wall square that faces a street or a canal is a painted palazzo front; the rest is plain stucco
  const stucco=[C.ch(gyTile('texBone_1',WH,{gain:1.15,rgb:[1.12,.98,.82],tag:'f2stucco0'})),C.ch(gyTile('texBone_2',WH,{gain:1.1,rgb:[1.1,.94,.86],tag:'f2stucco1'}))];
  const facA=[0,1,2].map(i=>f2FacGid('ps_f2_palazzo_a',i,3,WH,{tex:'texBone_1',rgb:[1,1,1]})),facB=[0,1,2].map(i=>f2FacGid('ps_f2_palazzo_b',i,3,WH,{tex:'texBone_1',rgb:[1,1,1]}));
  const openN=(x,y)=>[[0,1],[0,-1],[1,0],[-1,0]].some(([a,b])=>rows[y+b]&&rows[y+b][x+a]==='.');
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(rows[y][x]==='.')continue;const g=C.chars[rows[y][x]];if(g!==undefined&&KH_DOOR[g])continue;if(!openN(x,y))continue;
    if(x<=2||x>=45)continue;   // the far ends of the streets and canals run into the mist wall
    const seg=Math.floor(x/3),useB=hs(seg,y,9)<.5,f=(useB?facB:facA)[x%3];
    C.solid(x,y,f!=null&&(rows[y+1]&&rows[y+1][x]==='.')?C.ch(f):stucco[(x+y)&1])}
  // the palazzo of the Doge: its front along the north side of the campo, the locked door in the middle, three masks on hooks beside it
  for(let x=14;x<=34;x++){const f=(x>=21&&x<=27)?null:facA[x%3];C.solid(x,2,f!=null?C.ch(f):stucco[x&1])}
  {const dg=f2FacGid('ps_f2_palazzo_door',0,1,WH,{tex:'texBone_1',fit:false});const g=KH_NEXT_GID++;T_TILE[g]=T_TILE[dg!=null?dg:pspDoorGid('great',WH)];KH_DOOR[g]={psf2:'palazzo'};C.solid(F2_WATER.DOOR[0],F2_WATER.DOOR[1],C.ch(g))}
  for(const [x,y,k] of F2_WATER.MASK){C.used.delete(x+','+y);C.dec(pspPic('f2_mask_'+k),x,y,{wd:[0,-1],block:false,npc:'f2w_mask_'+k,bob:.9})}
  C.plaque(27,6,'f2_water_plaque',['THE DOGE ADMITS','THE ONE WHO WATCHES','AND SAYS NOTHING'],'f2w_plaque','A plaque of white stone in the campo. The letters read: THE DOGE ADMITS ONLY THE ONE WHO WATCHES AND SAYS NOTHING. HANG YOUR FACE ON THE HOOK BY THE DOOR.');
  for(const x of [18,30])C.prop('urn_big',x,4);
  for(const [x,y] of [[17,9],[31,9],[16,5],[32,5]])if(C.free(x,y)){C.dec(pspPic('f2_lamp_canal'),x,y,{block:false});C.light(x,y,[1.5,1.1,.65])}
  // gondolas on the canals, mooring poles, lamps along the quays
  for(const [x,y] of [[11,31],[30,32],[38,19],[13,18],[35,31]])if(C.rows[y][x]==='.')C.dec(pspPic('f2_gondola'),x,y,{block:false});
  for(const [x,y] of [[9,32],[20,31],[28,31],[17,19],[31,18],[44,32]])if(C.rows[y][x]==='.'&&!C.decor.some(d=>d.x===x&&d.y===y))C.dec(pspPic('f2_pole'),x,y,{block:false,sc:.9});
  for(let x=6;x<=42;x+=6)for(const y of [30,17]){if(C.free(x,y)&&!isPath(x,y-1)){C.dec(pspPic('f2_lamp_canal'),x,y,{block:false,sc:.95});C.light(x,y,[1.5,1.1,.65])}}
  // the fish market and the mask makers' square
  for(const [x,y] of [[4,11],[9,11],[4,14]])C.prop('barrels',x,y);
  for(const [x,y] of [[37,23],[43,23],[43,27]])C.prop('cart_old',x,y);
  pspSafeZone(C,24,35,6);
  C.foes(['f2eel','f2eel','f2cutthroat'],[3,10,10,15],1);
  C.foes(['f2cutthroat','f2cutthroat','f2sprite'],[36,22,44,28],2);
  {const side={path:true,ok:(x,y)=>Math.abs(x-24)>=3&&!C.nearPath(x,y,0)||(Math.abs(x-24)>=3&&(y===17||y===20||y===30||y===33)&&!C.decor.some(d=>d.x===x&&d.y===y))};   // on the quays, never on the main street
   C.foes(['f2gondolier','f2gondolier','f2eel'],[3,17,20,33],3,side);C.foes(['f2gondolier','f2eel'],[28,17,44,21],5,side)}
  C.foes(['f2sprite','f2gondolier','f2sprite'],[29,33,44,36],4);
  for(const [x,y] of [[3,15],[44,22],[44,36]])C.chestAt(x,y,1);
  C.ret();
  return C.done({glow:7})}
pspRegister(9824,f2WaterBuild);
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
  const C=f2Room({id:9825,ground:'sand',path:'sandpath',band:[2,5],wh:3.4,
    routes:[[[24,35],[24,26],[16,21],[16,15],[24,12],[24,11]],[[24,27],[34,23],[38,19]],[[16,18],[8,18]],[[22,32],[10,30]]],
    clear:[[16,1,32,12,'tombslab','The Sunken Temple'],[4,13,13,23,'sand','The Oasis',1],[33,14,43,24,'sand','The Fallen King',1],[5,26,14,34,'sand','The Bone Dunes',1]]});
  const W=48,{rows,block,fm}=C,hs=C.hs2;
  // the temple court: sandstone walls round x 18..30, y 3..10, the way in at the south (23..25,11); the frieze on the north wall (x 19..21)
  const sand=[0,1,2].map(v=>C.ch(gyTile('texBone_'+(1+v),3.4,{gain:1.2,rgb:[1.18,1.0,.74],tag:'f2sandst'+v})));
  for(let y=2;y<=11;y++)for(let x=17;x<=31;x++){const ring=x===17||x===31||y===2||y===11;if(!ring)continue;if(y===11&&x>=23&&x<=25)continue;C.solid(x,y,sand[(x*3+y)%3])}
  for(let x=19;x<=21;x++){const f=f2FacGid('ps_f2_frieze',x-19,3,3.4,{tex:'texBone_1',rgb:[1.1,1.0,.85],fit:false});if(f!=null)C.solid(x,2,C.ch(f))}
  for(let y=1;y<=1;y++)for(let x=16;x<=32;x++)C.mist(x,y);
  // the floor plates (painted carved tiles) and the sarcophagus
  const TF={};for(const s of ['scarab','eye','ankh','sun']){const k=f2TexFloor('ps_f2_tile_'+s,'f2t_'+s,1.0);TF[s]=k?C.fl(k):C.fl('tombslab')}
  for(const [x,y,s] of F2_DESERT.PLATES){fm[y*W+x]=TF[s];C.reserve(x,y,x,y)}
  {const [sx,sy]=F2_DESERT.SARC;C.used.delete(sx+','+sy);C.dec(pspPic('f2_sarc_shut'),sx,sy,{block:true,npc:'f2d_sarc'})}
  C.plaque(19,10,'f2_desert_plaque',['READ THE WALL','AND WALK IT'],'f2d_plaque','A slab of sandstone by the way in. Cut into it: READ THE WALL FROM LEFT TO RIGHT, AND WALK IT. Above you, on the north wall of the court, a frieze is carved: a scarab, an eye, an ankh and a sun disc, in that order from left to right. Eight carved plates are set in the floor.');
  for(const [x,y] of [[18,3],[30,3],[18,9],[30,9]])C.prop('f2_column_lotus',x,y,{sc:.85});
  for(const [x,y] of [[22,4],[26,4]]){C.prop('brazier',x,y,{block:true});C.light(x,y,[1.5,1.0,.5])}
  // the dunes: palms at the oasis, rocks, obelisks and a fallen head
  for(const [x,y] of [[8,18],[9,18],[8,19],[9,19]])if(C.free(x,y))C.dec(pspPic('f2_reeds'),x,y,{block:true,sc:1.1});   // reeds round the spring of the oasis
  C.fill(['drock0','drock1','drock2','drock1','dpalm2','drock0',pspPic('f2_column_lotus')],{p1:.1,p2:.4,p3:.7,sc:.9});
  for(const [x,y] of [[5,15],[12,16],[6,22],[11,22],[5,19]])if(C.free(x,y))C.dec(['dpalm0','dpalm1','dpalm2','dpalm3'][(x+y)%4],x,y,{block:true});
  C.used.delete('38,17');C.dec(pspPic('f2_statue_head'),38,17,{block:true});C.used.delete('35,21');C.dec('dobelisk',35,21,{block:true});C.used.delete('41,21');C.dec('dobelisk',41,21,{block:true});
  C.scrub(['drock1','yar_shells'],.02);
  C.capTrees(/dpalm/,2.6);
  pspSafeZone(C,24,35,6);
  C.foes(['f2scorpion','f2scorpion','f2dustdevil'],[4,13,13,23],1);
  C.foes(['f2mummy','f2mummy','f2sandwraith'],[33,14,43,24],2);
  C.foes(['f2sandwraith','f2dustdevil','f2scorpion'],[5,26,14,34],3);
  C.foes(['f2mummy','f2dustdevil'],[30,26,44,36],4);
  for(const [x,y] of [[12,14],[42,15],[6,33]])C.chestAt(x,y,1);
  C.ret();
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
