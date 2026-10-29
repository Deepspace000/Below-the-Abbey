/* ==========================================================================
   THE PALE SPIRE: THE DUNGEONS (package 5, rebuilt compact and vertical; prefix psd / PSD). Three floors under the kitchens of the Pale Spire, in black wet stone and verdigris, lit green-white:
   9780 The Undercroft Gaols (102): the Gaoler's Hall, Cell Block A (ten cells), the Question Room (the Questioner), the stair down.
   9790 The Deep Cells and the Cistern (103): Cell Block B (half flooded), the Cistern with three valve wheels and the Drowned Gaoler, the stair down.
   9800 The Oubliette (104): the round pit, cells round it, the Hunger in the Hole. No stairs down.
   Nine prisoners, nine quests (psq30 to psq38, area "The Pale Spire"). Every cell has its door as a picture (an iron gate) that opens when the party talks to the prisoner (no key needed).
   This file has its own floor maker psdMake (gyTile, gyFloorTone, torches), because the dungeons need water floors, cell doors, parapets and secret doors. The maps are drawn with rectangles (PSD_PLAN) in 48 x 40, 48 x 40 and 40 x 36; walls are 3.8 to 5.4 high (tall vaults), with slit windows, blind arcades, piers, carved faces, roots and verdigris made in code.
   Flags: G.flags.psp.d = {cell:{key:1}, stone:{n:1}, wheel:[order so far], wheelsDone, gaoler:0|1|2, ghp, pots, framePainted, namesSpoken, ...}. Notes: tools/PALE_SPIRE_NOTES.md (section "Package 5").
   Look (owner, 30 Oct 2026): a demented gothic castle in dark black and green, like the old German churches: black weathered stone, verdigris, corroded iron, sickly green-white light. No warm light in the dungeons.
   ========================================================================== */
const PSD={ids:[9780,9790,9800],SPEC:{},cells:{},S:.85,ready:false,loading:null};
const psdIs=n=>n===9780||n===9790||n===9800;
const psdF=()=>{const F=pspF();return F.d||(F.d={cell:{},stone:{},wheel:[],gaoler:0,pots:0})};
const PSD_WARM=[1.5,1.05,.55];
/* ---------- creatures (the pictures are pspPic stand-ins until painted: ps_c_<id>) ---------- */
Object.assign(ENEMY_DEF,{
  psturnkey:{name:'Pale Turnkey',hp:74,dmg:[7,12],hit:.86,w:.72,ph:1.9,img:'ps_c_psturnkey',xp:30,gold:[0,0],speed:1,verb:'clubs',gy:1},
  psflayed:{name:'Flayed Prisoner',hp:56,dmg:[6,11],hit:.86,w:.6,ph:1.7,img:'ps_c_psflayed',xp:28,gold:[0,0],speed:2,verb:'claws',gy:1,glow:.12},
  psshackle:{name:'Shackled Dead',hp:84,dmg:[7,12],hit:.85,w:.7,ph:1.8,img:'ps_c_psshackle',xp:30,gold:[0,0],speed:1,verb:'pulls at',gy:1,still:1,wake:'The skeleton in the chains lifts its head. The links pull tight, and then the staple comes out of the wall.'},
  psleech:{name:'Cistern Leech',hp:66,dmg:[6,11],hit:.86,w:.9,ph:1.0,img:'ps_c_psleech',xp:30,gold:[0,0],speed:1,verb:'fastens on',gy:1},
  psdrowned:{name:'Drowned Prisoner',hp:76,dmg:[7,11],hit:.85,w:.62,ph:1.7,img:'ps_c_psdrowned',xp:32,gold:[0,0],speed:1,verb:'drags at',gy:1},
  pscellghost:{name:'Cell Ghost',hp:50,dmg:[6,10],hit:.87,w:.6,ph:1.6,img:'ps_c_pscellghost',xp:28,gold:[0,0],speed:1,fly:true,floatH:.1,verb:'chills',gy:1,glow:.5},
  psbonecrawl:{name:'Bone Crawler',hp:68,dmg:[7,12],hit:.86,w:.9,ph:1.5,img:'ps_c_psbonecrawl',xp:32,gold:[0,0],speed:2,fly:true,floatH:.55,verb:'rakes',gy:1},
  psquestioner:{name:'The Questioner',hp:720,dmg:[9,15],hit:.9,w:.8,ph:2.1,img:'ps_c_psquestioner',xp:900,gold:[0,0],speed:1,verb:'burns',boss:true,gy:1,glow:.2,psdb:1},
  psdrowngaoler:{name:'The Drowned Gaoler',hp:950,dmg:[10,16],hit:.9,w:1.1,ph:2.6,img:'ps_c_psdrowngaoler',xp:1100,gold:[0,0],speed:1,verb:'crushes',boss:true,gy:1,glow:.15,psdb:2,noFlee:1},
  pshunger:{name:'The Hunger in the Hole',hp:1500,dmg:[11,18],hit:.9,w:1.6,ph:3.4,img:'ps_c_pshunger',xp:1400,gold:[0,0],speed:1,verb:'devours',boss:true,gy:1,glow:.1,psdb:3,noFlee:1,still:1,wake:'The pale heap in the pit draws itself up. It has no face, only a mouth that opens along its whole front.'}});
for(const t of ['psturnkey','psflayed','psshackle','psleech','psdrowned','pscellghost','psbonecrawl']){const d=ENEMY_DEF[t];if(d){d.hp=Math.round(d.hp*1.4);d.gold=[220,640]}}
for(const t of ['psquestioner','psdrowngaoler','pshunger']){if(typeof NO_VARY!=='undefined')NO_VARY.push(t);if(typeof HUGE_FOES!=='undefined')HUGE_FOES.push(t)}
if(typeof BOSS_GOLD!=='undefined'){BOSS_GOLD.psquestioner=[5000,6200];BOSS_GOLD.psdrowngaoler=[5600,6800];BOSS_GOLD.pshunger=[7000,8400]}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psleech/,'bleeding',.22],[/^psdrowned/,'tomblung',.2],[/^psflayed/,'fever',.15],[/^pscellghost/,'haunted',.2],[/^psquestioner/,'bleeding',.25],[/^psdrowngaoler/,'shaken',.25],[/^pshunger/,'cursed',.25],[/^psbonecrawl/,'bleeding',.15]);

/* ==========================================================================
   THE PLANS (maps drawn with rectangles). Plan characters: # wall, . black flags, , lighter flags, : wet cobbles, = causeway, B bridge (deep water beside it gets a parapet),
   s straw, ~ shallow water, W deep water (blocked), b bone floor, a alcove (an open niche in a wall, holds a statue), g cell gate square, p pier (a stone pillar block),
   w slit window wall, v root and ivy wall, r blind arch wall, f carved face wall, + a secret door square (the doors list opens it).
   ========================================================================== */
const PSD_PLAN={};
const psdWall=(m,x,y,c)=>{if(m.g[y]&&m.g[y][x]==='#')m.g[y][x]=c};
/* 9780: 48 x 40. Entry landing at the top, a pillared hall under it, the cell block west, the Question Room east, a long south passage with its little rooms, the stair at the bottom right. */
PSD_PLAN[9780]=m=>{const {R,P}=m;
  R(22,3,26,7);                                             // the stair landing (the door is at 24,2)
  R(12,8,36,12);for(const x of [16,20,28,32])P(x,10);       // the Gaoler's Hall: a vaulted nave of two aisles divided by piers
  R(14,7,14,7,'a');R(34,7,34,7,'a');                        // statue alcoves in the north wall of the hall
  for(const x of [13,18,30,35])R(x,7,x,7,'w');              // slit windows high in the north wall
  R(38,8,43,12);R(37,10,37,10);                             // the Key Room (arch at 37,10)
  R(5,8,10,12);R(11,10,11,10);                              // the Chain Room (arch at 11,10)
  R(34,13,35,19);                                           // the passage down from the hall
  R(3,20,38,21);                                            // the long passage past the cells
  R(25,15,31,18);R(28,19,28,19);                            // the Gaolers' Mess
  for(const cx of [5,9,13,17,21]){R(cx-1,16,cx+1,18);R(cx,19,cx,19,'g');R(cx-1,23,cx+1,25);R(cx,22,cx,22,'g')}   // ten cells
  R(4,14,22,14,':');R(3,14,3,14,'a');R(21,15,21,15,'+');    // the service crawl behind the north cells, its secret door and the niche at its end
  R(39,14,45,22);R(41,17,43,19,'f');R(38,20,38,21);         // the Question Room: a ring round a block carved with faces
  for(const [x,y] of [[32,19],[37,19],[25,22],[33,22],[10,27],[18,27],[10,30],[18,30]])R(x,y,x,y,'a');
  R(28,22,29,27);                                           // down to the south passage
  R(3,28,37,29);                                            // the south passage
  R(4,31,9,35);R(6,30,6,30);                                // the Guards' Rest
  R(12,31,16,35);R(14,30,14,30);                            // the Latrines
  R(19,31,25,35);R(22,30,22,30);P(22,33);                   // the Quarters
  R(28,31,34,35);R(31,30,31,30);P(31,33);                   // the Store
  R(44,23,44,29);                                           // from the Question Room down to the stair room
  R(37,30,44,35);for(const [x,y] of [[38,32],[38,34],[43,32],[43,34],[41,31]])P(x,y);   // the stair room
  for(const [x,y] of [[8,7],[8,13],[24,13],[40,7],[40,13],[39,16],[45,13]]){if(g0(m,x,y)==='#')R(x,y,x,y,'v')}
  for(let x=13;x<=33;x+=2)psdWall(m,x,13,'r');                       // a blind arcade along the south wall of the hall
  for(const x of [16,20,28,32,24,18,30])psdWall(m,x,7,'r');
  for(const y of [4,6])psdWall(m,21,y,'r');for(const y of [4,6])psdWall(m,27,y,'f');psdWall(m,21,5,'f');psdWall(m,27,5,'r');
  for(const x of [6,14,22,26,30,34])psdWall(m,x,27,'r');
  for(const [x,y] of [[38,16],[38,18],[46,16],[46,19],[42,13],[40,23],[43,23],[46,14],[46,21],[44,13]])psdWall(m,x,y,'f');
  for(const [x,y] of [[9,13],[9,7],[5,7],[11,7],[41,13],[39,7],[43,7],[38,13]])psdWall(m,x,y,'r');
};
function g0(m,x,y){return m.g[y]&&m.g[y][x]}
/* 9790: 48 x 40. Entry landing top right, the cell block along the top (its east half flooded), the drain down to the cistern, a cross of stone bridges over dark water with three wheel platforms, the stair down at the bottom left. */
PSD_PLAN[9790]=m=>{const {R,P}=m;
  R(38,3,44,8);P(43,4);P(43,7);
  R(3,9,44,10);R(16,9,37,10,'~');                           // the cell block passage; the east half stands in water
  for(const cx of [6,10,14,18]){R(cx-1,5,cx+1,7);R(cx,8,cx,8,'g')}
  R(13,5,15,7,'~');R(17,5,19,7,'~');
  for(const x of [8,22,26,33])R(x,4,x,4,'w');               // slit windows over the cell block
  R(28,11,29,15,':');R(27,16,29,16,'=');                    // the drain
  R(5,17,44,31,'W');                                        // the cistern: dark water
  R(28,17,28,21,'B');                                       // the spur from the drain to the cross bridge
  R(12,22,40,22,'B');                                       // the cross bridge
  R(8,20,11,24,'=');R(41,20,44,24,'=');                     // west and east wheel platforms
  R(25,23,25,28,'B');R(22,29,28,31,'=');                    // the south spur and the south wheel platform
  R(7,24,7,31,'=');R(8,25,11,29,'~');                       // the west walkway and the shallows beside it
  R(36,25,44,29,'~');P(39,27);P(42,27);                     // the east shallows
  for(const [x,y] of [[16,19],[20,19],[32,19],[36,19],[16,26],[20,26],[32,26],[14,30],[34,30],[30,18],[26,18]])if(m.g[y][x]==='W')P(x,y);   // tall columns standing in the water
  R(3,11,3,24,':');R(3,24,6,24,':');                        // the old stair down the west wall, a way round the cistern
  R(4,32,12,35,':');for(const [x,y] of [[5,34],[11,34],[10,33]])P(x,y);   // the stair room
  for(const [x,y] of [[12,11],[20,11],[36,11],[24,16],[34,16],[10,16],[20,32]]){if(m.g[y][x]==='#')R(x,y,x,y,'w')}
  for(const [x,y] of [[16,11],[32,11],[14,16],[40,16]]){if(m.g[y][x]==='#')R(x,y,x,y,'r')}
  for(let x=6;x<=44;x+=2)psdWall(m,x,16,'r');for(let y=17;y<=31;y+=2){psdWall(m,45,y,'r');psdWall(m,4,y,'r')}
  for(let x=14;x<=44;x+=2)psdWall(m,x,32,'r');
  for(const [x,y] of [[10,16],[22,16],[38,16],[45,20],[45,26],[4,20],[4,28],[30,32]])psdWall(m,x,y,'f');
  for(const x of [20,24,30,34])psdWall(m,x,11,'r');
  /* break the slab: two arcaded partitions split the cistern into three vaulted chambers (the bridge passes through an arch in each), stone islands beside the bridge, and low parapets along the bridges */
  for(let y=17;y<=31;y++){if(y===22)continue;R(16,y,16,y,'#');R(35,y,35,y,'#')}
  for(let y=17;y<=31;y++){if(y===22)continue;psdWall(m,16,y,y%2?'r':'f');psdWall(m,35,y,y%2?'r':'f')}
  R(19,23,21,25,'=');R(31,19,33,21,'=');R(37,19,39,21,'=');R(26,24,27,26,'=');
  const lowAt=(x,y)=>{if(m.g[y]&&m.g[y][x]==='W')m.g[y][x]='l'};
  for(let x=12;x<=40;x++){lowAt(x,21);lowAt(x,23)}
  for(let y=17;y<=21;y++){lowAt(27,y);lowAt(29,y)}
  for(let y=23;y<=28;y++){lowAt(24,y)}
};
/* 9800: 40 x 36. The shaft foot top left, a stair-ramp winding down to a ring passage round the pit, seven cells on the outside of the ring, a secret chamber. */
PSD_PLAN[9800]=m=>{const {R,P}=m;
  R(4,3,12,8);P(5,7);P(11,7);                                // the shaft foot
  R(8,9,9,10);R(10,10,14,10);                                // the winding way down
  R(13,11,31,31);R(15,13,29,29,'#');                         // the ring passage round an island
  R(18,16,26,26,'b');                                        // the pit
  for(const [x,y] of [[20,18],[24,18],[20,24],[24,24]])P(x,y);   // shackle pillars in the pit
  R(22,13,22,15);R(22,27,22,29);R(15,21,17,21);R(27,21,29,21);   // four narrow arches into the pit
  for(const y of [15,19,23,27]){R(12,y,12,y,'g');R(9,y-1,11,y+1)}   // four cells on the west
  for(const y of [15,19,23]){R(32,y,32,y,'g');R(33,y-1,35,y+1)}      // three cells on the east
  R(33,28,37,31,'b');R(32,29,32,29,'+');R(37,30,37,30,'a');         // the secret chamber behind the east wall
  for(const [x,y] of [[5,3],[8,3],[11,3],[14,12],[30,12],[22,12],[22,30],[14,30],[30,30]]){if(m.g[y][x]==='#')R(x,y,x,y,'w')}
  for(const [x,y] of [[4,5],[12,5],[8,10]]){if(m.g[y][x]==='#')R(x,y,x,y,'v')}
  for(let x=15;x<=29;x++){if(x!==22){psdWall(m,x,13,(x%2)?'r':'#');psdWall(m,x,29,(x%2)?'r':'#')}}
  for(let y=13;y<=29;y++){if(y!==21){psdWall(m,15,y,(y%2)?'r':'#');psdWall(m,29,y,(y%2)?'r':'#')}}
  for(const [x,y] of [[15,13],[29,13],[15,29],[29,29]])psdWall(m,x,y,'f');
  for(let y=16;y<=26;y++){if(y!==21){psdWall(m,17,y,'f');psdWall(m,27,y,'f')}}
  for(let x=18;x<=26;x++){if(x!==22){psdWall(m,x,15,'f');psdWall(m,x,27,'f')}}
  for(const x of [14,18,26,30])psdWall(m,x,10,'r');for(const x of [14,18,26,30])psdWall(m,x,32,'r');
};

/* ---------- the stone: black weathered walls with verdigris, moss, roots, slit windows, blind arcades, piers, carved faces (all made in code, as walls may be) ----------
   A wall tile is 128 pixels wide and 128 per unit of height; the party only ever sees the lower 2.6 units of a tall wall at close range, so the detail is drawn in that band (VIS). */
const PSD_OPEN='.,:=Bs~Wbag';                        // plan characters that are floor
const PSD_FLOOR={'.':'0',',':'1',':':'2','=':'3','B':'3','s':'4','~':'5','W':'6','b':'1','a':'0','g':'0'};
PSD.tl={};
const PSD_VIS=2.7*128;
function psdPointed(x,x0,x1,top,bot,ap){x.beginPath();x.moveTo(x0,bot);x.lineTo(x0,top+ap);x.quadraticCurveTo(x0,top+ap*.25,(x0+x1)/2,top);x.quadraticCurveTo(x1,top+ap*.25,x1,top+ap);x.lineTo(x1,bot);x.closePath()}
/* the stains every dungeon wall carries: verdigris running down, damp at the foot, moss */
function psdStain(x,w,h,v,id,k){
  const R=(a,b)=>hash2(a,b,v*13+id+k*7),yb=Math.max(0,h-PSD_VIS);
  for(let n=0;n<3;n++){const px=R(n,1)*w,len=PSD_VIS*(.15+R(n,2)*.45),wd=2+R(n,3)*4,gr=x.createLinearGradient(0,yb,0,yb+len);gr.addColorStop(0,'rgba(60,150,110,.2)');gr.addColorStop(1,'rgba(60,170,120,0)');x.fillStyle=gr;x.fillRect(px,yb,wd,len)}
  if(k>=0){x.fillStyle='rgba(70,190,130,.18)';for(let n=0;n<2;n++){const px=R(n,9)*(w-30);x.fillRect(px,yb,30,6+R(n,10)*8)}}
  const dg=x.createLinearGradient(0,h-80,0,h);dg.addColorStop(0,'rgba(0,0,0,0)');dg.addColorStop(1,'rgba(0,12,6,.65)');x.fillStyle=dg;x.fillRect(0,h-80,w,80);
  if(k>=1)for(let n=0;n<(k>1?26:8);n++){const px=R(n,4)*w,py=h-R(n,5)*(k>1?110:44),r=2+R(n,6)*5;x.fillStyle=['#17301c','#1f3a24','#10241a','#284630'][(R(n,7)*4)|0];x.globalAlpha=.9;x.beginPath();x.ellipse(px,py,r,r*.6,R(n,8)*3,0,6.3);x.fill()}
  x.globalAlpha=1}
function psdTile(S,kind,v){
  const key=S.id+kind+v;if(PSD.tl[key]!==undefined)return PSD.tl[key];
  const WH=kind==='l'?1.15:S.WH,id=S.id,ptx=S.pt?pspTex(S.pt,null):null,tex=ptx||(S.brick||'texBlack')+'_'+(v%5),o={gain:ptx?S.pg:S.gain,rgb:ptx?S.prgb:S.rgb,tag:'psdt'+key};let gid;   // painted ashlar, mossy ashlar or dark brick (assets/ps tex_*) when loaded
  const R=(a,b)=>hash2(a,b,v*17+id),Y=hgt=>0;   // (Y unused)
  switch(kind){
    case 'p':o.draw=(x,w,h)=>{const cap=h-2.55*128;x.fillStyle='rgba(0,0,0,.4)';x.fillRect(0,0,w,h);const gr=x.createLinearGradient(30,0,98,0);gr.addColorStop(0,'rgba(0,0,0,.6)');gr.addColorStop(.3,'rgba(120,200,160,.3)');gr.addColorStop(.7,'rgba(70,130,100,.14)');gr.addColorStop(1,'rgba(0,0,0,.7)');x.fillStyle=gr;x.fillRect(30,cap,68,h-cap);
        x.fillStyle='rgba(90,200,150,.7)';x.fillRect(22,cap,84,10);x.fillRect(26,h-20,76,20);x.fillStyle='rgba(60,150,110,.6)';x.fillRect(26,cap+10,76,6);x.fillRect(34,h-150,60,5);
        x.strokeStyle='rgba(120,220,170,.5)';x.lineWidth=2.5;for(const sx of [0,1]){x.beginPath();x.moveTo(sx?106:22,cap);x.quadraticCurveTo(sx?122:6,cap-30,sx?128:0,cap-80);x.stroke()}psdStain(x,w,h,v,id,1)};break;
    case 'w':o.draw=(x,w,h)=>{psdStain(x,w,h,v,id,0);const top=h-2.55*128,bot=h-1.3*128;x.fillStyle='#07100b';psdPointed(x,x,46,82,top-6,bot+6,18);x.fill();
        psdPointed(x,x,52,76,top,bot,15);const gr=x.createLinearGradient(0,top,0,bot);gr.addColorStop(0,'#f4fff8');gr.addColorStop(1,'#8fcba6');x.fillStyle=gr;x.fill();
        x.strokeStyle='#1d2e24';x.lineWidth=3;x.beginPath();x.moveTo(64,top);x.lineTo(64,bot);x.moveTo(52,top+(bot-top)*.5);x.lineTo(76,top+(bot-top)*.5);x.stroke();
        const sp=x.createLinearGradient(0,bot,0,h);sp.addColorStop(0,'rgba(190,255,215,.3)');sp.addColorStop(1,'rgba(190,255,215,0)');x.fillStyle=sp;x.beginPath();x.moveTo(50,bot);x.lineTo(78,bot);x.lineTo(122,h);x.lineTo(6,h);x.closePath();x.fill()};break;
    case 'v':o.draw=(x,w,h)=>{psdStain(x,w,h,v,id,2);const yb=h-PSD_VIS;for(let n=0;n<9;n++){let px=R(n,1)*w,py=yb;x.strokeStyle=n%2?'#150f09':'#231a10';x.lineWidth=2+R(n,2)*3;x.beginPath();x.moveTo(px,py);for(let t=0;t<9;t++){px+=(R(n,t+10)-.5)*16;py+=PSD_VIS*(.07+R(n,t+20)*.09);x.lineTo(px,py)}x.stroke()}
        for(let n=0;n<60;n++){const px=R(n,31)*w,py=yb+PSD_VIS*Math.pow(R(n,32),.75),r=2.5+R(n,33)*4.5;x.fillStyle=['#142a1a','#1c3622','#0e2016','#26422c'][(R(n,34)*4)|0];x.globalAlpha=.92;x.beginPath();x.ellipse(px,py,r,r*.62,R(n,35)*3.1,0,6.3);x.fill()}x.globalAlpha=1};break;
    case 'r':o.draw=(x,w,h)=>{psdStain(x,w,h,v,id,0);const top=h-2.45*128,bot=h-4;x.save();psdPointed(x,x,16,112,top,bot,40);x.fillStyle='#030806';x.fill();x.strokeStyle='#5fb090';x.lineWidth=6;x.stroke();x.restore();psdPointed(x,x,30,98,top+18,bot,32);x.strokeStyle='rgba(95,176,144,.55)';x.lineWidth=2.5;x.stroke();
        x.fillStyle='rgba(80,170,125,.7)';x.fillRect(8,top+44,14,9);x.fillRect(106,top+44,14,9)};break;
    case 'f':o.draw=(x,w,h)=>{psdStain(x,w,h,v,id,1);const cy=h-(1.5+R(1,1)*.5)*128,cx=64;x.fillStyle='rgba(120,170,140,.6)';x.beginPath();x.ellipse(cx,cy,36,46,0,0,6.3);x.fill();x.strokeStyle='rgba(10,30,20,.8)';x.lineWidth=4;x.stroke();
        x.fillStyle='#020604';x.beginPath();x.ellipse(cx-15,cy-11,9,12,.2,0,6.3);x.ellipse(cx+15,cy-11,9,12,-.2,0,6.3);x.fill();x.beginPath();x.moveTo(cx,cy-2);x.lineTo(cx-6,cy+13);x.lineTo(cx+6,cy+13);x.closePath();x.fill();
        x.beginPath();x.ellipse(cx,cy+29,18,(v%2?16:10),0,0,6.3);x.fill();x.fillStyle='rgba(185,215,198,.75)';for(let t=-3;t<=3;t++)x.fillRect(cx+t*4.8-1.5,cy+18,3,7);
        x.strokeStyle='rgba(10,30,20,.85)';x.lineWidth=5;x.beginPath();x.moveTo(cx-28,cy-28);x.lineTo(cx-6,cy-20);x.moveTo(cx+28,cy-28);x.lineTo(cx+6,cy-20);x.stroke();
        x.fillStyle='rgba(60,170,120,.5)';x.fillRect(cx-20,cy-52,40,5)};break;
    case 'l':o.draw=(x,w,h)=>{x.fillStyle='rgba(110,200,160,.25)';x.fillRect(0,0,w,14);x.fillStyle='rgba(0,0,0,.45)';x.fillRect(0,14,w,4);psdStain(x,w,h,v,id,1)};break;
    case 'm':o.draw=(x,w,h)=>psdStain(x,w,h,v,id,2);break;
    default:o.draw=(x,w,h)=>psdStain(x,w,h,v,id,v%3===1?1:0);}
  gid=gyTile(tex,WH,o);return PSD.tl[key]=gid}
/* a green flame for the wall torches (the game has orange, red, purple, blue and yellow): frames 40 to 47 of FLAMES, glow 5 of GLOWS */
function psdFlames(){
  if(typeof gyFlames==='function')try{gyFlames()}catch(e){}
  if(PSD._fl||FLAMES.length!==40||typeof FLAME_FRAMES==='undefined')return;PSD._fl=1;
  const st=[[0,[0,40,12]],[.25,[16,130,50]],[.5,[80,215,110]],[.8,[190,255,190]],[1,[235,255,235]]],
    ramp=I=>{for(let i=1;i<st.length;i++)if(I<=st[i][0]){const t=(I-st[i-1][0])/(st[i][0]-st[i-1][0]),p=st[i-1][1],q=st[i][1];return [p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,p[2]+(q[2]-p[2])*t]}return st[st.length-1][1]};
  for(let f=0;f<FLAME_FRAMES;f++){
    const c=document.createElement('canvas');c.width=64;c.height=96;const x=c.getContext('2d'),id=x.createImageData(64,96),D=id.data,seed=113,ph=hash2(f,3,seed)*6;
    for(let j=0;j<96;j++)for(let i=0;i<64;i++){
      const v=(90-j)/82;if(v>1.02||v<-.08)continue;const vv=Math.max(0,v);
      const sway=Math.sin(f*.8+vv*3.4)*5*vv+(vnoise(i/9+f*.35,j/9-f*1.9,64,seed)-.5)*12*vv,half=26*Math.pow(1-vv,.6)*(1+.4*Math.sin(vv*8-f*1.5+ph))*(v<0?.6+v*4:1),d=Math.abs(i-32-sway)/Math.max(.5,half);
      let I=Math.pow(Math.max(0,1-d),.6)*Math.pow(Math.max(0,1-vv*vv),.8);I*=.74+.5*vnoise(i/4,j/4-f*2.4,64,seed+5);I=Math.max(0,Math.min(1,I));if(I<.03)continue;
      const [r,g,b]=ramp(I),k=(j*64+i)*4;D[k]=r;D[k+1]=g;D[k+2]=b;D[k+3]=Math.min(255,I*330)}
    x.putImageData(id,0,0);FLAMES.push(c)}
  const gc=document.createElement('canvas');gc.width=gc.height=64;const gx=gc.getContext('2d'),gg=gx.createRadialGradient(32,32,2,32,32,32);
  gg.addColorStop(0,'rgba(90,255,140,.8)');gg.addColorStop(.5,'rgba(30,190,80,.3)');gg.addColorStop(1,'rgba(0,0,0,0)');gx.fillStyle=gg;gx.fillRect(0,0,64,64);GLOWS.push(gc)}

/* ---------- the floor maker ---------- */
function psdMake(info){
  try{if(typeof pswFoePics==='function')pswFoePics()}catch(e){}   // the Spire rat and other painted foes of the wings are also met in the dungeons
  const id=info.id;if(LEVELS[id])return LEVELS[id];
  const S=PSD.SPEC[id];if(!S)throw new Error('psd: no plan for '+id);S.id=id;
  try{gyAlias()}catch(e){}
  const W=info.W,H=info.H,WH=S.WH,hs=(a,b,c)=>hash2(a,b,c+id),g=[];
  for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  const mp={g,R:(x0,y0,x1,y1,c)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(g[y]&&x>=0&&x<W)g[y][x]=c||'.'},
    D:(cx,cy,r0,r1,c)=>{for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=Math.hypot(x-cx,y-cy);if(d>=r0&&d<=r1)g[y][x]=c||'.'}},P:(x,y,c)=>{g[y][x]=c||'p'}};
  S.plan(mp);
  /* a parapet stands wherever deep water touches a bridge */
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(g[y][x]==='W'&&(x+y)%3===0&&GYM_D.some(([a,b])=>g[y+b][x+a]==='B'))g[y][x]='l';
  const chars={},chMap=new Map();let nextCh=0x300;const ch=gid=>{let c=chMap.get(gid);if(!c){c=String.fromCharCode(nextCh++);chars[c]=gid;chMap.set(gid,c)}return c};
  const open=(x,y)=>!!(g[y]&&g[y][x]&&PSD_OPEN.includes(g[y][x])),near=(x,y)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(open(x+dx,y+dy))return true;return false};
  const wk=[];for(let y=0;y<H;y++)wk.push(new Array(W).fill(''));
  const rows=[];
  for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++){
    const c=g[y][x];if(PSD_OPEN.includes(c)){s+='.';continue}
    let kind;
    if(c==='#'||c==='+'){
      if(!near(x,y)){s+=ch(psdTile(S,'x',0));continue}
      const r=hs(x,y,5),r2=(hs(x,y,6)*5)|0;
      kind=r<.05&&WH>=3?'f':r<.15?'v':r<.30?'m':'x';wk[y][x]=kind;s+=ch(psdTile(S,kind,r2));continue}
    kind=c==='p'?'p':c==='w'?'w':c==='v'?'v':c==='r'?'r':c==='f'?'f':c==='l'?'l':'x';wk[y][x]=kind;
    s+=ch(psdTile(S,kind,(hs(x,y,9)*3)|0))}rows.push(s)}
  const put=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const decor=[],enemies=[],items=[],lights=[],lcol={},occ=new Set(),keep=new Set(),miss=[],V={lcol,col:S.lcol,torch:S.torch,miss,id,secrets:[],flood:S.flood||[]};
  let start=null;const doorSq=[];
  const inc=PSP.LINKS.find(l=>l.to===id&&l.from!==id);if(inc)start={x:inc.land[0],y:inc.land[1],f:inc.land[2]};
  for(const D of S.doors){
    const dx=D.x,dy=D.y;let gid;
    const inner=[[0,-1],[1,0],[0,1],[-1,0]].map(([a,b])=>[dx+a,dy+b]).find(([x,y])=>open(x,y));
    if(!inner)throw new Error('psd '+id+': door at '+dx+','+dy+' has no floor beside it');
    if(D.kind==='stair'){
      const lk=pspLinkAt(id,dx,dy);if(!lk)throw new Error('psd '+id+': no link at '+dx+','+dy);
      gid=gyTile(S.brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:S.gain,rgb:S.rgb,tag:'psdstair'+id+'_'+dx,emit:.3});
      KH_DOOR[gid]={psd:'stair',lvl:lk.to,at:{x:lk.land[0],y:lk.land[1],f:lk.land[2]}}}
    else if(D.kind==='sealed'){
      gid=gyTile('texGrey_1',WH,{fac:{img:'gatesC_0',i:0,n:1},gain:.95,tag:'psdsealed'+id});
      KH_DOOR[gid]={psd:'sealed',msg:D.msg}}
    else if(D.kind==='warp'){
      gid=gyTile(S.brick+'_0',WH,{fac:{img:'stairFix_0',i:0,n:1},gain:S.gain,rgb:S.rgb,tag:'psdwarp'+id+'_'+dx+'_'+dy,emit:.3});
      KH_DOOR[gid]={psd:'warp',to:D.to,msg:D.msg}}
    else if(D.kind==='secret'){
      gid=gyTile(S.brick+'_2',WH,{gain:S.gain,rgb:S.rgb,tag:'psdsecret'+id+'_'+dx+'_'+dy,draw:(x,w,h)=>psdStain(x,w,h,2,id,1)});
      KH_DOOR[gid]={psd:'secret',psw:'secret',key:D.key,msg:D.msg,x:dx,y:dy};V.secrets.push({x:dx,y:dy,key:D.key})}
    put(dx,dy,ch(gid));doorSq.push([dx,dy,inner[0],inner[1]]);occ.add(inner[0]+','+inner[1]);
    if(D.kind!=='secret')for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)keep.add((inner[0]+a)+','+(inner[1]+b))}
  if(S.keepAt)for(const [kx,ky,r] of S.keepAt)for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)keep.add((kx+a)+','+(ky+b));
  if(start)for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)keep.add((start.x+a)+','+(start.y+b));
  const deepAt=(x,y)=>g[y]&&g[y][x]==='W';
  const free=(x,y)=>open(x,y)&&!deepAt(x,y)&&!occ.has(x+','+y);
  const fm=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push(PSD_FLOOR[g[y][x]]||'0');fm.push(r)}
  const setF=(x0,y0,x1,y1,f)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(open(x,y))fm[y][x]=f};
  const dec=(a,x,y,o)=>{o=o||{};const kk=GYA[a]?'gy_'+a:a;if(!open(x,y)||deepAt(x,y)){miss.push(a+'@'+x+','+y);return null}
    if(!o.force&&(occ.has(x+','+y)||(o.block&&keep.has(x+','+y)))){miss.push('taken '+a+'@'+x+','+y);return null}
    const d={k:kk,x,y,block:!!o.block};if(!o.block){d.walk=true;d.deco=true}d.sc=(o.sc||1)*(o.raw?1:PSD.S);if(o.npc){d.npc=o.npc;d.deco=false;if(o.block)d.solid=1}
    if(o.wd)d.wd=o.wd;if(o.txt)d.txt=o.txt;if(o.goldAmt)d.goldAmt=o.goldAmt;if(o.ox!==undefined){d.ox=o.ox;d.oy=o.oy}decor.push(d);if(!o.over)occ.add(x+','+y);return d};
  const P=(name,x,y,o)=>dec(pspPic(name),x,y,o);          // a painted piece (or its stand-in) by its ps name
  const sign=(x,y,wd,a,b)=>{if(!open(x,y)){miss.push('sign@'+x+','+y);return}decor.push({k:'sign_gy',x,y,block:false,wd,txt:[a,b||''],sc:1})};
  const foe=(t,x,y,lvl)=>{if(!open(x,y)||deepAt(x,y)||occ.has(x+','+y)){miss.push('foe '+t+'@'+x+','+y);return false}enemies.push({t,x,y,lvl:lvl||info.lvl});occ.add(x+','+y);return true};
  const light=(x,y,col)=>{if(!open(x,y)){miss.push('light@'+x+','+y);return}lights.push([x,y]);if(col)lcol[x+','+y]=col};
  const C={id,S,W,H,g,rows,open,free,dec,P,sign,foe,light,setF,decor,enemies,lights,lcol,occ,keep,V,fm,info,rng:(a,b)=>hash2(a,b,id*3)};
  S.dress(C);
  /* cobwebs, candles in the dark, red lanterns and the odd haunted mirror (shared dresser in ps_halls.js) */
  try{const taken=new Set();for(const d of decor)if(d.wd)taken.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);let mi=0;
    pshHaunt({W,H,seed:id,start:start?[start.x,start.y]:null,blocked:()=>decor.filter(d=>d.block).map(d=>d.x+','+d.y),open:(x,y)=>open(x,y)&&!deepAt(x,y),free:(x,y)=>free(x,y)&&!keep.has(x+','+y),wall:(x,y,a,b)=>!open(x+a,y+b)&&rows[y+b]!==undefined&&rows[y+b][x+a]!=='.'&&!doorSq.some(q=>q[0]===x+a&&q[1]===y+b),taken:(x,y,a,b)=>taken.has(x+','+y+','+a+','+b),
      counts:S.haunt||{mirror:3,cobcorner:18,cobthick:8,candles:7,redlamp:7,spider:4},
      wallPic:(k,x,y,wd,o)=>{const oo={wd,raw:true,sc:1};if(o.mirror!==undefined)oo.npc='psh_mir'+((mi++)%12);const d=dec(k,x,y,oo);if(d)taken.add(x+','+y+','+wd[0]+','+wd[1]);return !!d},
      floorProp:(k,x,y,o)=>!!dec(k,x,y,{block:!!o.block,sc:o.sc||1,raw:true}),light:(x,y,c)=>light(x,y,c)})}catch(e){console.error('psd haunt',e)}
  /* ---- wall torches (green-white), candle niches, lamps ---- */
  const torches=[];
  {const blk=new Set();for(const d of decor)if(d.block)blk.add(d.x+','+d.y);const skip=doorSq.map(q=>[q[0],q[1]]),cand=[];
   for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(open(x,y)||rows[y][x]==='.'||wk[y][x]===''||'wlprf'.includes(wk[y][x])||skip.some(q=>Math.hypot(q[0]-x,q[1]-y)<2.2))continue;
     for(let f=0;f<4;f++){const nx=x+GYM_D[f][0],ny=y+GYM_D[f][1];if(!open(nx,ny)||blk.has(nx+','+ny))continue;
       const d4=GYM_D.filter(([a,b])=>open(nx+a,ny+b)).length,nar=(!open(nx-1,ny)&&!open(nx+1,ny))||(!open(nx,ny-1)&&!open(nx,ny+1));
       cand.push({x,y,f,nar,pri:d4>=3?1:d4===2?2:3,h:hs(x,y,f*7)})}}
   cand.sort((a,b)=>a.pri-b.pri||a.h-b.h);
   for(const c of cand){const gp=c.nar?4.2:3.6;if(torches.some(t=>Math.hypot(t[0]-c.x,t[1]-c.y)<gp))continue;torches.push([c.x,c.y,c.f,c.nar?1:0])}}
  V.torches=torches;
  {const tk=new Set(torches.map(t=>t[0]+','+t[1])),NIL=gyTile(S.brick+'_0',WH,{fac:{img:'cryptD_3',i:0,n:1},gain:S.gain*.9,rgb:S.rgb,tag:'psdniche'+id,draw:(x,w,h)=>{
     const c=IMG.gyp_cryptD_2;x.globalCompositeOperation='lighter';const gr=x.createRadialGradient(64,h-62,2,64,h-62,46);gr.addColorStop(0,'rgba(120,255,190,.22)');gr.addColorStop(1,'rgba(90,220,150,0)');x.fillStyle=gr;x.fillRect(0,h-120,w,120);x.globalCompositeOperation='source-over';
     if(c)x.drawImage(c,0,0,c.width,c.height*.5,46,h-84,36,25)}}),cand=[];
   const nearDoor=(x,y)=>doorSq.some(q=>Math.hypot(q[0]-x,q[1]-y)<3.2);
   for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(open(x,y)||rows[y][x]==='.'||tk.has(x+','+y)||nearDoor(x,y)||(wk[y][x]!=='x'&&wk[y][x]!=='m'))continue;
     const ns=GYM_D.filter(([a,b])=>open(x+a,y+b));if(ns.length!==1)continue;const [a,b]=ns[0],nx=x+a,ny=y+b;
     if(torches.some(t=>Math.hypot(t[0]-x,t[1]-y)<1.6)||occ.has(nx+','+ny))continue;cand.push({x,y,nx,ny,h:hs(x,y,95)})}
   cand.sort((p,q)=>p.h-q.h);const nic=[];
   for(const c of cand){if(nic.length>=(S.niches===undefined?6:S.niches))break;if(nic.some(n=>Math.hypot(n.x-c.x,n.y-c.y)<6))continue;nic.push(c);put(c.x,c.y,ch(NIL));light(c.nx,c.ny,[.7,1.25,.9])}}
  {const have=lights.slice();for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!open(x,y))continue;if(have.every(l=>Math.hypot(l[0]-x,l[1]-y)>=(S.lampGap||5.4))){have.push([x,y]);lights.push([x,y]);lcol[x+','+y]=S.lcol}}}
  /* ---- floors: 0 black flags, 1 lighter flags / bones, 2 wet cobbles, 3 causeway and bridge flags, 4 straw, 5 shallow water, 6 deep water (blocked) ---- */
  const T=(out,src,gain,tint)=>{try{return gyFloorTone(out,src,gain,tint)}catch(e){return src}};
  const wat=(out,gain,tint)=>FLOORS.water?T(out,'water',gain,tint):T(out,'gyf_slate',gain*.6,[.4,.8,.7]);
  if(!FLOORS.water&&typeof wlFloors==='function'){}
  const ft=S.ftint||[.7,.95,.8];
  const fb0=T('psf_'+id+'a',GY_FLOORSET[3],S.fgain||.5,ft),fb1=T('psf_'+id+'b',GY_FLOORSET[S.fl1===undefined?5:S.fl1],S.fgain1||.7,ft);
  const fSet=[fb0,fb1,gyFloorWet('psf_'+id+'w',fb0,S.lcol,id%97+3),T('psf_'+id+'c','gyf_flag',.75,[.8,1,.9]),T('psf_straw','gyf_dirt',.8,[1.1,1.1,.7]),wat('psf_shallow',1.7,[.4,1.1,1.05]),wat('psf_deep',.8,[.25,.75,.85])];
  if(S.flood&&G.flags&&G.flags.psp&&G.flags.psp.d&&G.flags.psp.d.wheelsDone)for(const q of S.flood)for(let y=q[1];y<=q[3];y++)for(let x=q[0];x<=q[2];x++)if(fm[y][x]==='5')fm[y][x]='2';
  const fmS=fm.map(r=>r.join(''));
  const L={rows,chars,fmap:fmS,floorSet:fSet,floor:fb0,floor2:fb1,ceil:S.ceil||'gyc_crypt',ceilH:WH,start:start||{x:2,y:2,f:2},enemies,items,decor,lights,portals:[],day:0,amb:S.amb===undefined?.05:S.amb,torchGap:1e9,noTele:true,noExtras:true,
    name:info.name,label:info.name,diff:info.lvl,mapNames:S.names||[],_psd:V};
  V.start=start;V.g=g;LEVELS[id]=L;LEVEL_NAMES[id]=info.name;LEVEL_RATING[id]=info.lvl;
  {let deep=0;const blk=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(g[y][x]==='W'){blk[y*W+x]=1;deep++}}
   if(deep){try{TERRS[id]=yarTerrain(W,H,new Float32Array(W*H).fill(.3),new Float32Array(W*H),blk)}catch(e){console.error('psd terrain',e)}V.deep=blk}}
  if(miss.length&&window.PSD_DEBUG)console.warn('psd '+id+' missed: '+miss.join(' '));
  V.missed=miss;
  return L}
/* the dungeons register themselves; package 6's glue wraps arrival (art loading) the same way, so loading here is a safety net for a jump straight in */
for(const id of PSD.ids)pspRegister(id,psdMake);

/* ---------- loading, lights, doors, deep water ---------- */
const psdReady=()=>PSD.ready||(typeof PSP!=='undefined'&&PSP.ready);   // the glue (ps_glue.js) loads the art first; this is only a safety net
function psdLoad(){
  if(PSD.loading)return PSD.loading;
  PSD.loading=Promise.all([typeof gyLoad==='function'?gyLoad():0,typeof khLoadAssets==='function'?khLoadAssets():0]).then(()=>{try{gyAlias();if(typeof pspPics==='function')pspPics()}catch(e){console.error('psdLoad',e)}PSD.ready=true}).catch(e=>{console.error('psdLoad',e);PSD.ready=true});
  return PSD.loading}
{const _g=goToLevel;goToLevel=function(n,entry){
  if(psdIs(n)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;goToLevel(n,entry)});return}
  if(psdIs(n)&&LEVELS[n]===undefined&&KH_LAZY[n])try{KH_LAZY[n]()}catch(e){console.error(e)}
  if(psdIs(n)&&typeof psdPrep==='function')try{psdPrep(n)}catch(e){console.error('psdPrep',e)}
  const r=_g.call(this,n,entry);
  try{if(psdIs(n)&&typeof psdArrive==='function')psdArrive(n)}catch(e){console.error('psdArrive',e)}
  return r}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(psdIs(n)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;jumpToLevel(n,target)});return}
  if(psdIs(n)&&target<LEVEL_RATING[n])target=LEVEL_RATING[n];
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&psdIs(sv.level)&&!psdReady()&&!PSD._wait){PSD._wait=1;psdLoad().then(()=>{PSD._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);
  try{if(psdIs(LEVEL)&&typeof psdArrive==='function')psdArrive(LEVEL)}catch(e){console.error('psd restore',e)}
  return r}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||psdIs(n)}}
if(typeof CONTAINERS!=='undefined'&&!CONTAINERS.includes('gy_chest'))CONTAINERS.push('gy_chest');
{const _sl=setupLights;setupLights=function(){
  const r=_sl.apply(this,arguments);
  try{if(psdIs(LEVEL)){const L=LEVELS[LEVEL],V=L&&L._psd;if(V){
      for(const l of LIGHTS){if(!l.free||l.lamp)continue;const key=Math.floor(l.x)+','+Math.floor(l.y);l.col=V.lcol[key]||V.col;l.kI=1.4;l.range2=115;l.calm=true}
      if(V.torches&&V.torch){psdFlames();const T=V.torch;
        for(const [x,y,f,nar] of V.torches){const d=GYM_D[f],O=nar?.035:TORCH_OUT;
          LIGHTS.push({x:x+.5+d[0]*(.5+O),y:y+.5+d[1]*(.5+O),ph:hash2(x,y,5)*6.28,key:(y*MW+x)*4+f,taken:false,red:!!T.red,fl:T.fl,col:T.col,o:O,nar:!!nar,range2:150,kI:1.25})}}}}}catch(e){console.error('psd lights',e)}
  return r}}
/* the doors: stairs, the sealed wine cellar door */
{const _k=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psd){
    if(d.psd==='stair'){sfx('door');if(!LEVELS[d.lvl]&&KH_LAZY[d.lvl])try{KH_LAZY[d.lvl]()}catch(e){console.error(e)}goToLevel(d.lvl,d.at);return true}
    if(d.psd==='sealed'){sfx('locked');msg(d.msg,'#c8d0e0');return true}
    return true}
  return _k.apply(this,arguments)}}
/* deep water cannot be waded: the engine's message for blocked terrain is about mountains, so the dungeons say their own */
{const _db=desertBump;desertBump=function(nx,ny,g){
  try{if(psdIs(LEVEL)&&typeof TERR_BLOCK!=='undefined'&&TERR_BLOCK&&TERR_BLOCK[ny*MW+nx]){sfx('bump');msg('The water is too deep and cold to wade. Keep to the stone and the shallows.','#a8c8d8');return true}}catch(e){}
  return _db.apply(this,arguments)}}

/* secret doors: a bump opens the square for good (the opening is kept in G.flags.psp.d.sec) */
{const _k2=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psd==='secret'){const F=psdF();F.sec=F.sec||{};if(!F.sec[d.key]){F.sec[d.key]=1;sfx('door');msg(d.msg,'#c8e8d0')}if(G.grid[ny][nx]!==0)G.grid[ny][nx]=0;return true}
  return _k2.apply(this,arguments)}}
function psdSelfMove(a){G.talk=null;sfx('door');G.P.x=a[0];G.P.y=a[1];G.P.f=a[2];G.P.angT=(a[2]-1)*Math.PI/2;G.C={x:a[0],y:a[1],a:G.P.angT};try{reveal()}catch(e){}}
{const _k3=khBump;khBump=function(nx,ny,g){const d=KH_DOOR[g];
  if(d&&d.psd==='warp'){psdSelfMove(d.to);if(d.msg)msg(d.msg,'#c8e8d0');return true}
  return _k3.apply(this,arguments)}}
function psdApplySecrets(){const L=LEVELS[LEVEL],V=L&&L._psd;if(!V||!G.grid)return;const F=psdF();for(const s of V.secrets||[])if(F.sec&&F.sec[s.key]&&G.grid[s.y])G.grid[s.y][s.x]=0}

/* ==========================================================================
   THE FLOORS: each level's look, names and furnishing (the dress function). Black wet stone, verdigris, sickly green-white light. No warm light anywhere here.
   ========================================================================== */
const PSD_GREEN=[.7,1.2,.85],PSD_FIRE=[.6,1.35,.75],PSD_DIM=[.55,1.0,.75],PSD_FRIEND=[.8,1.3,.9];
/* a cell gate: a picture of an iron gate on the doorway square; talking to it talks to the prisoner inside (and opens the door), an empty cell just opens */
function psdGate(C,key,x,y,who,note){
  const nid='psd_cell'+key;PSD.cells[key]={who,note,x,y,level:C.id};
  if(!NPCS[nid]){const pn=who&&NPCS[who];khNpc(nid,pn?pn.name:'A cell door',pn?pn.img:'gy_igate2',d=>psdGateTalk(key,d))}
  return C.P('cell_door',x,y,{block:true,npc:nid,sc:.7,raw:true})}
/* a living prisoner behind the gate (the picture is p_<name>) */
function psdPerson(C,who,pic,x,y){return C.P('p_'+pic,x,y,{block:true,npc:who,raw:true,sc:1})}
/* a cell furnished. The gate is at (gx,gy); the cell runs three squares away from it in the direction (dx,dy). */
function psdCell(C,key,gx,gy,dx,dy,who,pic,note,extra){
  const px=-dy,py=dx,at=k=>[gx+dx*k,gy+dy*k],mid=at(2),back=at(3);
  psdGate(C,key,gx,gy,who,note);
  C.P('straw_bed',back[0]-px,back[1]-py,{});C.P(['bucket_well','chains','barrels','cage','bones'][((gx*7+gy*3)>>1)%5],back[0]+px,back[1]+py,{sc:.6});
  if(who){psdPerson(C,who,pic,mid[0],mid[1]);C.light(mid[0],mid[1],PSD_FRIEND)}
  if(extra)extra(C,mid[0],mid[1],back,at)}
/* a rest nook for each dungeon floor: a straw pallet, a candle, a warm pool of light, no foe within a few squares; the party sleeps free */
khNpc('psd_bed','A straw pallet','hgtb_furn_bed',()=>say('A pallet of clean straw under a grey blanket, and a stub of candle somebody lit and left. Nothing here means any harm. Rest?',[['Rest, free.',()=>{G.talk=null;restParty(true);return null}],BYE]));
function psdRest(C,cands,name){
  for(const [x,y] of cands){if(!C.free(x,y))continue;
    if(C.P('straw_bed',x,y,{npc:'psd_bed',block:true})){C.P('candelabra_tall',x+1,y,{block:false,sc:.7});C.light(x,y,PSD_WARM);C.light(x+1,y,PSD_WARM);
      const bad=(C.S&&C.S.restNooks)||(C.S.restNooks=[]);bad.push([x,y,name]);return true}}
  return false}
const psdMany=(f,list)=>{for(const a of list)f.apply(null,a)};
/* ====================================================================== 9780 THE UNDERCROFT GAOLS ====================================================================== */
PSD.SPEC[9780]={pt:'ashlar',pg:2.3,prgb:[.82,.95,.88],brick:'texBlack',gain:1.3,rgb:[.5,.85,.64],WH:3.8,lcol:[.74,.97,.82],torch:{fl:5,col:[.45,1.2,.7],name:'green',css:'#5fe090'},fgain:.6,ftint:[.7,.95,.8],fl1:5,ceil:'gyc_crypt',amb:.05,
 keepAt:[[40,33,1]],plan:PSD_PLAN[9780],
 doors:[{x:24,y:2,kind:'stair'},{x:40,y:36,kind:'stair'},
  {x:2,y:28,kind:'sealed',msg:'A heavy oak door bound with corroded iron, barred from the other side. Cold air comes under it, and the sound of water. This way leads to the Wine Cellar, and it cannot be opened from here.'},
  {x:7,y:13,kind:'warp',to:[4,28,2],msg:'The stair winds down inside the wall, round and round, and comes out in the south passage.'},
  {x:4,y:27,kind:'warp',to:[7,12,0],msg:'The stair winds up inside the wall, round and round, and comes out in the Chain Room.'},
  {x:21,y:15,kind:'secret',key:'crawl',msg:'The stone behind the straw is only set in the wall, not mortared. It swings in on a pivot and cold air comes through, smelling of old rope.'}],
 names:[{t:"The Gaoler's Hall",x:24,y:10,k:'place'},{t:'The Key Room',x:41,y:10,k:'place'},{t:'The Chain Room',x:8,y:10,k:'place'},{t:'Cell Block A',x:13,y:20,k:'place'},{t:"The Gaolers' Mess",x:28,y:16,k:'place'},{t:'The Question Room',x:42,y:15,k:'place'},{t:'The Sealed Cellar Door',x:4,y:28,k:'place'},{t:"The Guards' Rest",x:6,y:33,k:'place'},{t:'The Latrines',x:14,y:33,k:'place'},{t:'The Quarters',x:22,y:32,k:'place'},{t:'The Store',x:31,y:32,k:'place'},{t:'The Stair Room',x:40,y:33,k:'place'}],
 dress(C){const {dec,P,sign,foe,light}=C,twig=(x,y,s)=>{if(IMG.ww_twig2&&C.rng(x,y)<.22)dec('ww_twig2',x,y,{sc:s||.8,over:1,force:1})};
  /* the landing: the stair comes down into a cold well of black stone */
  sign(23,3,[0,-1],'THE UNDERCROFT GAOLS','The hall is below the landing');
  psdRest(C,[[38,33],[37,34],[42,33],[41,34],[38,34]],'The south stair');
  P('brazier',22,3,{});P('brazier',26,3,{});light(22,3,PSD_FIRE);light(26,3,PSD_FIRE);P('moss_rock',26,6,{});P('ivy_clump',22,6,{});twig(22,4);twig(26,5,.7);
  /* the Gaoler's Hall: a vaulted nave, two aisles divided by piers, statues in the wall niches, slits of cold light */
  P('st_veiled',14,7,{block:true});P('st_hand',34,7,{block:true});light(14,8,[.9,1.35,1]);light(34,8,[.9,1.35,1]);
  P('table_high',20,12,{block:true});P('table_high',30,12,{block:true});dec('bench',20,11,{sc:.8});dec('bench',30,11,{sc:.8});P('barrels',12,12,{block:true});P('barrels',36,12,{block:true});
  P('brazier',13,9,{block:true});P('brazier',35,9,{block:true});light(13,9,PSD_FIRE);light(35,9,PSD_FIRE);light(24,11,PSD_DIM);
  P('chains',18,8,{});P('chains',26,8,{});P('chains',32,8,{});dec('bones',23,12,{sc:.7});dec('bones',15,11,{sc:.7});dec('web',12,8,{sc:.55});dec('web',36,8,{sc:.55});twig(17,9);twig(31,9);twig(25,11,.7);
  foe('psturnkey',18,9);foe('psturnkey',30,9);foe('psturnkey',24,12);foe('pskrat',14,11);foe('pskrat',34,11);
  /* the Key Room: the gaolers' keys on boards, a cage, a chest */
  P('cage',42,9,{block:true});P('table_high',41,11,{block:true});P('chains',39,8,{});P('chains',43,8,{});P('brazier',39,12,{block:true});light(39,12,PSD_FIRE);dec('chest',43,12,{block:true,goldAmt:2400});dec('bones',40,9,{sc:.7});
  for(const [x,y] of [[39,9],[40,10],[41,9],[43,10]])if(dec('gy_nameplate',x,y,{block:true,npc:'psd_gaolerlog',sc:1,raw:true}))break;
  foe('psturnkey',40,11);
  /* the Chain Room: hooks, a rack, the dead still hanging */
  P('rack',9,8,{block:true});P('shackled_skeleton',6,8,{});P('shackled_skeleton',8,12,{});P('chains',5,10,{});P('chains',10,12,{});dec('bones',7,11,{sc:.8});dec('web',5,8,{sc:.55});light(8,10,PSD_DIM);sign(6,12,[0,1],'THE CHAIN STAIR','Winds down to the south passage');sign(5,28,[0,-1],'THE CHAIN STAIR','Winds up to the Chain Room');
  foe('psflayed',7,10);foe('psshackle',6,12);
  /* Cell Block A: ten cells; the middle squares of the north row hold the prisoners and the dead */
  psdCell(C,'9780_0',5,19,0,-1,'psd_garrick','garrick');
  psdCell(C,'9780_1',9,19,0,-1,null,null,'The lock is rusted through and falls apart in your hand. Inside, a skeleton sits chained to the wall with its head on its chest. Somebody has scratched a tally on the stone beside it, forty strokes, and then a line.',(C,mx,my)=>{foe('psshackle',mx,my)});
  psdCell(C,'9780_2',13,19,0,-1,'psd_isaude','isaude');
  psdCell(C,'9780_3',17,19,0,-1,null,null,'The cell door opens with a groan. Straw, a tin bowl, a heap of old clothes, and a small chest pushed under the bed.',(C,mx,my)=>{dec('chest',mx,my,{block:true})});
  psdCell(C,'9780_4',21,19,0,-1,null,null,'The cell is empty. The straw is fresh, and somebody has been sleeping here. On the wall is scratched: THEY DO NOT FEED YOU AFTER THE THIRD DAY. THAT IS HOW YOU KNOW. One stone of the back wall has a ring of clean mortar round it.');
  psdCell(C,'9780_5',5,22,0,1,'psd_peck','peck');
  psdCell(C,'9780_6',9,22,0,1,null,null,'The door swings open. A man in rags is chained to the back wall. He has been dead a long while, and something in the chains has not got the message.',(C,mx,my)=>{foe('psshackle',mx,my)});
  psdCell(C,'9780_7',13,22,0,1,null,null,'The lock turns by itself. A cold shape stands in the corner of the cell, facing the wall, and does not turn round at once.',(C,mx,my)=>{foe('pscellghost',mx,my)});
  psdCell(C,'9780_8',17,22,0,1,null,null,'The door opens. A guard who stole from his own prison is lying here with his keys still on his belt, and a small chest under his head.',(C,mx,my)=>{dec('chest',mx,my,{block:true})});
  psdCell(C,'9780_9',21,22,0,1,null,null,'The cell is empty except for a bucket and a message on the wall: THE ONES WHO TALK ARE LET OUT. THE ONES WHO DO NOT ARE FORGOTTEN.');
  sign(3,20,[-1,0],'CELL BLOCK A','Speak to the one inside and the door opens');
  /* the passage past the cells */
  psdMany(P,[['chains',8,20,{}],['chains',16,21,{}],['chains',24,20,{}],['chains',34,21,{}]]);
  psdMany(dec,[['bones',12,21,{sc:.7}],['bones',26,21,{sc:.7}],['bones',20,20,{sc:.7}],['web',4,20,{sc:.5}],['web',22,21,{sc:.5}]]);
  twig(7,21);twig(19,20,.7);twig(29,21);light(10,20,PSD_DIM);light(20,21,PSD_DIM);light(30,20,PSD_DIM);
  P('st_hand',32,19,{block:true});P('st_mourners',37,19,{block:true});P('st_bishop',25,22,{block:true});P('st_veiled',33,22,{block:true});light(32,20,[.9,1.35,1]);light(37,20,[.9,1.35,1]);
  foe('psturnkey',15,20);foe('psturnkey',27,21);foe('psflayed',33,20);foe('pskrat',11,20);foe('pskrat',23,21);foe('pskrat',36,21);
  /* the service crawl behind the north cells (secret): a niche at the end, a reward, and a name */
  P('st_headless',3,14,{block:true});dec('chest',4,14,{block:true,goldAmt:3200});P('chains',9,14,{});dec('bones',14,14,{sc:.6});dec('web',18,14,{sc:.5});light(5,14,[.9,1.35,1]);
  /* the Gaolers' Mess */
  P('table_high',28,16,{block:true});dec('bench',27,17,{sc:.8});dec('bench',29,17,{sc:.8});P('barrels',31,15,{block:true});dec('crate',26,18,{block:true,sc:.9});dec('gy_nameplate',25,15,{block:true,npc:'psd_stone0',sc:1,raw:true});
  P('brazier',31,18,{block:true});light(31,18,PSD_FIRE);light(27,15,PSD_DIM);twig(30,15);foe('psturnkey',30,17);foe('pskrat',26,17);
  /* the passage from the hall */
  P('chains',34,15,{});dec('bones',35,17,{sc:.7});light(34,16,PSD_DIM);twig(35,14);foe('pskrat',35,15);
  /* the Question Room: a ring round a block carved with faces; racks, maidens, stocks and four green fires */
  sign(40,14,[0,-1],'THE QUESTION ROOM','Ask politely. It does not help.');
  P('rack',39,16,{block:true});P('iron_maiden',39,18,{block:true});P('iron_maiden',42,14,{block:true});P('iron_maiden',44,14,{block:true});P('stocks',40,14,{block:true});
  P('rack',45,17,{block:true});P('shackled_skeleton',45,19,{});P('stocks',45,21,{block:true});P('butcher_block',42,22,{block:true});P('rack',40,22,{block:true});
  psdMany(P,[['chains',39,15,{}],['chains',45,16,{}],['chains',39,21,{}],['chains',44,22,{}]]);
  for(const [x,y] of [[39,14],[45,15],[41,22],[43,22]]){P('brazier',x,y,{block:true});light(x,y,PSD_FIRE)}
  dec('bones',40,17,{sc:.8});dec('bones',44,19,{sc:.7});dec('bones',43,21,{sc:.7});dec('chest',45,14,{block:true,npc:'psd_tinchest',raw:true,sc:.9});dec('gy_nameplate',39,22,{block:true,npc:'psd_stone1',sc:1,raw:true});
  foe('psquestioner',44,18);foe('psshackle',40,19);foe('psshackle',44,16);foe('psflayed',42,21);foe('psflayed',40,16);foe('pskrat',43,15);
  /* the south passage and its rooms */
  psdMany(P,[['chains',12,28,{}],['chains',30,29,{}],['st_mourners',10,27,{block:true}],['st_hand',18,27,{block:true}],['st_bishop',10,30,{block:true}],['st_headless',18,30,{block:true}]]);
  psdMany(dec,[['bones',7,29,{sc:.65}],['bones',22,28,{sc:.65}],['bones',34,29,{sc:.65}],['web',4,28,{sc:.55}],['web',36,28,{sc:.55}]]);
  twig(14,29);twig(26,28);twig(33,28);for(const x of [8,16,24,32])light(x,28,PSD_DIM);light(10,28,[.9,1.35,1]);light(18,28,[.9,1.35,1]);
  foe('psturnkey',17,28);foe('psflayed',27,29);foe('psturnkey',33,28);foe('pskrat',9,29);foe('pskrat',21,28);foe('pskrat',29,25);
  psdMany(P,[['straw_bed',4,32,{}],['straw_bed',4,34,{}],['straw_bed',9,32,{}],['barrels',9,35,{block:true}]]);dec('bench',7,32,{sc:.8});P('brazier',8,35,{block:true});light(7,34,PSD_DIM);foe('psturnkey',7,34);
  psdMany(P,[['bucket_well',12,32,{block:true}],['bucket_well',12,34,{block:true}],['bucket_well',16,32,{block:true,sc:.7}],['bucket_well',16,34,{block:true}]]);dec('bones',14,34,{sc:.7});light(14,33,PSD_DIM);foe('pskrat',14,33);twig(13,35);
  psdMany(P,[['straw_bed',19,32,{}],['straw_bed',19,34,{}],['straw_bed',25,32,{}],['straw_bed',25,34,{}],['table_high',24,35,{block:true}]]);light(21,33,PSD_DIM);foe('psturnkey',20,34);
  psdMany(P,[['rack',28,32,{block:true}],['rack',34,32,{block:true}],['barrels',28,33,{block:true}],['barrels',34,33,{block:true}]]);dec('chest',29,35,{block:true,goldAmt:2800});dec('chest',33,35,{block:true,goldAmt:3100});dec('crate',32,35,{block:true,sc:.9});light(31,34,PSD_DIM);
  /* the stair room: the way down winds between piers, a fire at each landing */
  sign(42,35,[0,1],'THE STAIR TO THE DEEP CELLS','Below, the cells stand in water');
  dec('bench',38,31,{sc:.8});dec('bench',44,35,{sc:.8});P('brazier',38,35,{block:true});P('brazier',44,31,{block:true});light(38,35,PSD_FIRE);light(44,31,PSD_FIRE);light(41,34,PSD_DIM);
  P('chains',42,30,{});dec('bones',43,33,{sc:.7});twig(37,31);foe('psturnkey',33,30);foe('pskrat',44,26);}};
/* ====================================================================== 9790 THE DEEP CELLS AND THE CISTERN ====================================================================== */
PSD.SPEC[9790]={pt:'ashlar_moss',pg:2.4,prgb:[.78,.96,.9],brick:'texBlack',gain:1.35,rgb:[.45,.85,.72],WH:4.6,lcol:[.62,.93,.84],torch:{fl:5,col:[.35,1.25,.85],name:'green',css:'#4fe0b0'},fgain:.55,ftint:[.55,.9,.85],fl1:5,ceil:'gyc_2',amb:.04,
 keepAt:[[8,33,1]],plan:PSD_PLAN[9790],flood:[[16,9,37,10],[13,5,15,7],[17,5,19,7]],
 doors:[{x:40,y:2,kind:'stair'},{x:8,y:36,kind:'stair'}],
 names:[{t:'The Stair Landing',x:41,y:6,k:'place'},{t:'Cell Block B',x:10,y:9,k:'place'},{t:'The Flooded Half',x:26,y:10,k:'place'},{t:'The Drain',x:28,y:13,k:'place'},{t:'The Cistern',x:25,y:25,k:'place'},{t:'The West Wheel',x:10,y:22,k:'place'},{t:'The South Wheel',x:25,y:30,k:'place'},{t:'The East Wheel',x:43,y:22,k:'place'},{t:'The Stair Room',x:8,y:34,k:'place'}],
 dress(C){const {dec,P,sign,foe,light}=C,twig=(x,y,s)=>{if(IMG.ww_twig2&&C.rng(x,y)<.22)dec('ww_twig2',x,y,{sc:s||.8,over:1,force:1})};
  /* the landing */
  psdRest(C,[[42,4],[40,4],[41,5],[42,5]],'The Deep Cells landing');
  sign(39,3,[0,-1],'THE DEEP CELLS','Below the gaols. The water rises here.');
  P('brazier',38,3,{});P('brazier',44,3,{});light(38,3,PSD_FIRE);light(44,3,PSD_FIRE);dec('bench',42,8,{sc:.8});P('barrels',38,8,{block:true});P('chains',44,6,{});twig(38,5);twig(44,8,.7);P('ivy_clump',41,8,{});light(41,7,PSD_DIM);
  /* the landing is a rest nook: no foes */
  /* Cell Block B: two dry cells, two flooded ones; the wall carries the order of the wheels */
  psdCell(C,'9790_0',6,8,0,-1,'psd_calpurnia','calpurnia');
  psdCell(C,'9790_1',10,8,0,-1,'psd_harrow','harrow');
  psdCell(C,'9790_2',14,8,0,-1,'psd_sedge','sedge');
  psdCell(C,'9790_3',18,8,0,-1,null,null,'The door swings open and water runs out over your boots. Two prisoners drowned here, side by side, and one of them is still on his feet. A small chest floats against the back wall.',(C,mx,my)=>{foe('psdrowned',mx,my);dec('chest',mx+1,my,{block:true})});
  sign(8,10,[0,1],'THE VALVES OF THE CISTERN','Turn the wheels in this order: SOUTH, then WEST, then EAST. Never out of turn.');
  dec('gy_nameplate',4,9,{block:true,npc:'psd_stone2',sc:1,raw:true});for(const [x,y] of [[4,10],[5,9],[4,8],[5,10],[6,9]])if(dec('gy_nameplate',x,y,{block:true,npc:'psd_scratch',sc:.8,raw:true}))break;
  
  psdMany(P,[['chains',5,10,{}],['chains',13,9,{}],['chains',24,10,{}],['column',20,9,{block:true}],['column',28,10,{block:true}],['column',34,9,{block:true}]]);
  psdMany(dec,[['bench',8,9,{sc:.8}],['bones',9,10,{sc:.7}],['bones',22,9,{sc:.7}],['bones',31,10,{sc:.7}],['web',3,9,{sc:.5}]]);
  twig(12,9);twig(26,9);twig(36,10);for(const x of [7,14,22,30,37])light(x,9,[.5,1.1,.9]);
  foe('pscellghost',12,10);foe('pscellghost',24,9);foe('psleech',22,10);foe('psleech',32,9);foe('psdrowned',30,10);foe('psdrowned',35,9);foe('psturnkey',16,9);
  /* the drain: a gutter, running water, a way down between black walls */
  dec('bones',28,13,{sc:.7});P('chains',29,12,{});twig(28,14);light(28,12,[.5,1.1,.9]);light(29,15,[.5,1.1,.9]);foe('psleech',28,11);
  /* the stair down the west wall */
  P('st_hand',3,18,{block:false});dec('bones',3,15,{sc:.7});P('chains',3,20,{});twig(3,22);light(3,17,PSD_DIM);light(3,22,PSD_DIM);foe('pscellghost',3,19);
  /* the cistern: three wheels on three platforms, a cross of stone bridges, columns in the dark water */
  P('st_mourners',20,24,{block:true});P('st_headless',32,20,{block:true});P('st_hydra',38,20,{block:true});P('st_weepgiant',27,25,{block:true});P('candelabra_tall',20,23,{block:true,sc:.8});P('candelabra_tall',38,21,{block:true,sc:.8});
  P('valve_wheel',9,21,{block:true,npc:'psd_wheel0',raw:true,sc:.9});P('valve_wheel',25,30,{block:true,npc:'psd_wheel1',raw:true,sc:.9});P('valve_wheel',43,21,{block:true,npc:'psd_wheel2',raw:true,sc:.9});
  dec('gy_nameplate',10,24,{block:true,npc:'psd_stone3',sc:1,raw:true});
  P('brazier',11,20,{block:true});P('brazier',41,24,{block:true});P('brazier',22,31,{block:true});P('brazier',28,31,{block:true});for(const [x,y] of [[11,20],[41,24],[22,31],[28,31]])light(x,y,PSD_FIRE);
  sign(29,16,[0,-1],'THE CISTERN','Three wheels hold back the water');
  psdMany(dec,[['bones',24,29,{sc:.7}],['bones',42,22,{sc:.7}],['bones',9,24,{sc:.7}],['bucket_well',44,20,{sc:.6}]]);
  psdMany(light,[[18,22,[.5,1.1,.9]],[32,22,[.5,1.1,.9]],[25,26,[.5,1.1,.9]],[7,28,[.5,1.1,.9]],[40,27,[.5,1.1,.9]],[25,22,[.55,1.2,.95]]]);
  twig(8,23);twig(44,23);twig(27,31,.9);
  foe('psleech',9,26);foe('psleech',10,28);foe('psleech',38,27);foe('psleech',41,26);foe('psleech',43,28);foe('psdrowned',44,22);foe('psdrowned',11,26);foe('pscellghost',26,29);foe('psdrowned',38,26);
  /* the stair room to the Oubliette */
  sign(11,35,[0,1],'THE STAIR TO THE OUBLIETTE','Nobody was meant to come back up');
  dec('bench',5,32,{sc:.8});P('barrels',12,35,{block:true});P('brazier',12,32,{block:true});light(12,32,PSD_FIRE);light(8,34,PSD_DIM);dec('bones',6,35,{sc:.7});twig(9,35);foe('psdrowned',10,34);}};
/* ====================================================================== 9800 THE OUBLIETTE ====================================================================== */
PSD.SPEC[9800]={pt:'brick_dark',pg:2.4,prgb:[.82,.95,.88],brick:'texBlack',gain:1.15,rgb:[.5,.82,.6],WH:5.2,lcol:[.36,.68,.5],lampGap:7,torch:{fl:5,col:[.4,1.1,.55],name:'green',css:'#6fe080'},fgain:.5,fgain1:.75,ftint:[.55,.85,.7],fl1:4,ceil:'gyc_3',amb:.03,
 keepAt:[],plan:PSD_PLAN[9800],
 doors:[{x:8,y:2,kind:'stair'}],
 names:[{t:'The Shaft Foot',x:8,y:5,k:'place'},{t:'The Winding Way',x:11,y:10,k:'place'},{t:'The Ring Passage',x:22,y:12,k:'place'},{t:'The Pit',x:22,y:21,k:'place'},{t:'The Cells of the Oubliette',x:10,y:21,k:'place'}],
 dress(C){const {dec,P,sign,foe,light}=C,twig=(x,y,s)=>{if(IMG.ww_twig2&&C.rng(x,y)<.22)dec('ww_twig2',x,y,{sc:s||.8,over:1,force:1})};
  /* the shaft foot: far above, one grey shaft of light; roots hang down the walls */
  sign(7,3,[0,-1],'THE OUBLIETTE','What is put down here is forgotten');
  psdRest(C,[[10,5],[6,5],[9,6],[7,6]],'The shaft foot');
  dec('gy_nameplate',5,5,{block:true,npc:'psd_stone4',sc:1,raw:true});dec('bench',11,5,{sc:.8});P('brazier',12,4,{});light(12,4,PSD_FIRE);P('chains',5,3,{});dec('web',4,3,{sc:.55});dec('bones',10,8,{sc:.8});P('moss_rock',6,8,{});twig(9,7,.9);
  light(8,5,[.9,1.4,1.05]);light(8,7,[.8,1.3,1]);P('st_mourners',4,8,{block:true});
  /* the winding way */
  P('chains',8,9,{});dec('bones',9,10,{sc:.7});twig(11,10);light(9,9,PSD_DIM);light(13,10,PSD_DIM);
  /* the ring passage: bones in drifts, shackle posts, green fires at the corners */
  const who=[['psd_gaunt','gaunt'],['psd_stamford','stamford'],['psd_yseult','yseult']];
  const defs=[{who:0},{who:1},{note:'The door opens. A man in the remains of a uniform is sitting against the back wall with his sword across his knees. It is a very good sword, and he has not let go of it. Under him is a small chest.',chest:1},
    {note:'The door opens with a crack of rust. Inside, three skeletons are chained side by side. The middle one gets up.',foe:'psshackle'},
    {who:2},{note:"The door opens on a heap of straw, a woman's shawl and a tin cup full of bone dust. A small chest stands in the straw.",chest:1},{note:'The cell is cold in a way that has nothing to do with the stone. Something in the corner is waiting for you to speak first.',foe:'pscellghost'}];
  const cells=[[12,15,-1],[12,19,-1],[12,23,-1],[12,27,-1],[32,15,1],[32,19,1],[32,23,1]];
  cells.forEach(([gx,gy,dx],i)=>{const cd=defs[i],w=cd.who!==undefined?who[cd.who]:null;
    psdCell(C,'9800_'+i,gx,gy,dx,0,w?w[0]:null,w?w[1]:null,cd.note,(C,mx,my)=>{if(cd.chest)dec('chest',mx,my+1,{block:true});if(cd.foe)foe(cd.foe,mx,my)})});
  for(const [x,y] of [[14,12],[30,12],[14,30],[30,30]]){P('brazier',x,y,{block:true});light(x,y,PSD_FIRE)}
  psdMany(light,[[22,12,PSD_DIM],[22,30,PSD_DIM],[14,21,PSD_DIM],[30,21,PSD_DIM],[17,12,[.9,1.35,1]],[27,12,[.9,1.35,1]],[17,30,[.9,1.35,1]],[27,30,[.9,1.35,1]]]);
  psdMany(P,[['shackled_skeleton',14,17,{}],['shackled_skeleton',30,25,{}],['shackled_skeleton',14,25,{}],['shackled_skeleton',30,17,{}],['chains',22,12,{}],['chains',22,30,{}]]);
  foe('psbonecrawl',20,12);foe('psbonecrawl',26,12);foe('psbonecrawl',14,21);foe('psbonecrawl',30,21);foe('psbonecrawl',22,31);foe('psbonecrawl',17,31);
  foe('psshackle',14,15);foe('psshackle',30,27);foe('psshackle',14,28);foe('pscellghost',18,12);foe('pscellghost',30,15);foe('pscellghost',26,31);
  /* the pit */
  /* the vault of the Second Floor Key: a strongbox on a dais at the north end of the pit, chains, a faint violet glow that can be seen from the ring passage */
  P('dais_steps',22,18,{});P('reliquary_chest',22,17,{block:true,npc:'psd_strongbox',sc:1.15});P('chains',21,17,{});P('chains',23,17,{});P('candelabra_tall',21,18,{block:true,sc:.8});P('candelabra_tall',23,18,{block:true,sc:.8});
  light(22,18,[.9,.75,1.9]);light(22,16,[.7,.6,1.5]);
  foe('pshunger',22,21);dec('chest',22,25,{block:true,goldAmt:9000,sc:1});
  psdMany(P,[['shackled_skeleton',20,22,{}],['shackled_skeleton',24,22,{}],['shackled_skeleton',20,16,{}],['shackled_skeleton',24,16,{}]]);
  for(const [x,y] of [[19,17],[25,17],[19,25],[25,25],[18,21],[26,21]])dec('bones',x,y,{sc:.9});
  psdMany(light,[[22,19,[.7,1.2,.85]],[22,24,[.7,1.2,.85]]]);
  for(let a=0;a<46;a++){const t=C.rng(a,3)*6.283,r=7+C.rng(a,5)*3,x=Math.round(22+Math.cos(t)*r*1.2),y=Math.round(21+Math.sin(t)*r*1.2);dec('bones',x,y,{sc:.6+C.rng(a,7)*.4})}
  for(let a=0;a<24;a++){const t=C.rng(a,13)*6.283,r=7+C.rng(a,15)*3,x=Math.round(22+Math.cos(t)*r*1.2),y=Math.round(21+Math.sin(t)*r*1.2);twig(x,y,.8)}
  /* the secret chamber behind the east wall */
  P('st_bishop',37,30,{block:true});dec('chest',34,28,{block:true,goldAmt:4200});dec('bones',36,29,{sc:.8});dec('web',37,28,{sc:.6});twig(35,31);light(35,30,[.9,1.35,1]);
  psdMany(P,[['moss_rock',33,31,{}]]);}};
/* the secret door of the Oubliette and the crawl of the Gaols open the same way */
PSD.SPEC[9800].doors.push({x:32,y:29,kind:'secret',key:'chamber',msg:'A slab of the wall is on a counterweight. It rolls aside with a sound like a long breath, and a small room of old bone lies behind it.'});

/* ==========================================================================
   THINGS THE PARTY CARRIES (the rewards and the quest items this package owns; the others are in PSP_ITEMS of ps_core.js and are defined by their own package)
   ========================================================================== */
ITEMDEF.pstin={n:"Garrick's Tin",k:'quest',t:'Quest item',ic:'ore',c:'#a8a8a0',stack:1,price:0,sw:.2,d:"A small round tin, dented, with the lid tied down with red string. It rattles with lock picks. Hob Garrick, in the Undercroft Gaols, would like it back."};
ITEMDEF.pspaintbrush={n:"Gaunt's Brush and Palette",k:'quest',t:'Quest item',ic:'dagger',c:'#b8a0d0',stack:1,price:0,sw:.2,d:"A painter's brush and a small wooden palette, lent by Wilhelmina Gaunt. Take them to the empty frame in the Gallery of Portraits and paint it."};
ITEMDEF.pspickset={n:"Garrick's Pick Set",k:'tool',t:'Tool',ic:'lockpick',c:'#c8c0b0',stack:1,price:0,sw:.1,d:"A roll of fine picks and wrenches, better than any shop sells. Hob Garrick made them himself and gave them to you. They open any lock you meet."};
ITEMDEF.pslocket={n:"Isaude's Silver Locket",k:'ring',t:'Ring',ic:'amulet',c:'#d8dcec',price:0,lvl:102,pas:{ward:18,dodge:.07,regen:.7,mpRegen:.5},int:8,hp:90,rar:1,sw:.1,d:"A small silver locket that once held the hair of Lady Isaude's husband. Adds 8 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 7% more, and wounds and tiredness heal steadily. Needs level 102."};
ITEMDEF.psraincharm={n:"Sedge's Rain Charm",k:'ring',t:'Ring',ic:'amulet',c:'#9ac8e8',price:0,lvl:103,pas:{ward:19,dodge:.07,regen:.9,mpRegen:.4},hp:110,rar:1,sw:.1,d:"A knot of blue thread and a small shell, the charm that the wellwives of the Low Street hang over the well. Adds 110 health, every blow on the wearer is 19 lighter, enemies miss 7% more, and wounds close quickly. Needs level 103."};
ITEMDEF.pscandle={n:'Candle of Calpurnia',k:'light',t:'Light',ic:'torch',c:'#f0e8c8',light:3.4,price:0,rar:1,sw:.3,d:"A thick white candle that burns with a steady gold flame, and has never got shorter. Sister Calpurnia kept it all through her years in the cell. It shines further than any lantern, and the dead keep back from its light a little."};
ITEMDEF.psharrowseal={n:"Harrow's Seal",k:'ring',t:'Ring',ic:'ring',c:'#c0c8d8',price:0,lvl:104,pas:{ward:20,dodge:.08,regen:.8,mpRegen:.5},int:8,hp:100,rar:1,sw:.1,d:"The signet of Captain Dyrwen Harrow, last Warden of the Road. It is the twin of the seals the Wardens left in Wenlock, and whoever carries it will be heard at their doors. Adds 8 Intelligence and 100 health, every blow on the wearer is 20 lighter, enemies miss 8% more, and wounds and tiredness heal steadily. Needs level 104."};
ITEMDEF.pspalette={n:"Gaunt's Palette",k:'ring',t:'Ring',ic:'ring',c:'#c8a8e0',price:0,lvl:104,pas:{ward:18,dodge:.08,regen:.7,mpRegen:.7},int:10,hp:90,rar:1,sw:.1,d:"A tiny palette of old walnut with seven dried colours on it, worn on a cord. Wilhelmina Gaunt painted three Sovereigns with it. Adds 10 Intelligence and 90 health, every blow on the wearer is 18 lighter, enemies miss 8% more, and spells recover faster. Needs level 104."};
ITEMDEF.psdawnsword={n:'Dawnwarden',k:'weapon',t:'Sword',ic:'sword',c:'#e8e4f4',dmg:[520,620],hit:.2,req:{str:76},lvl:96,price:0,rar:1,eff:{daze:.2,bleed:[.3,6,45],bossdmg:.4},dbl:.2,sw:.46,d:"Sir Edrik Stamford's sword, a plain blade with a white pommel and a sunrise cut into the guard. It was his father's, and his father's before him. One blow in five leaves the foe dazed, wounds bleed, and bosses take 40% more. Needs level 96."};
ITEMDEF.psantidote={n:'Pale Antidote',k:'potion',t:'Potion',ic:'potion',c:'#d0e8f0',price:0,d:'A pale, bitter antidote made by Yseult Ardent from the silver roses of the courtyard. It cures poison, venom, fever and the silver sickness.',cures:1,sw:.34};
/* ==========================================================================
   THE PRISONERS AND THEIR NINE QUESTS (psq30 to psq38). Premise, task and reward are the plan's; the words are plain.
   ========================================================================== */
if(typeof QAREA_ORDER!=='undefined'&&!QAREA_ORDER.includes(PSP.REGION))QAREA_ORDER.push(PSP.REGION);
const psdStones=()=>Object.keys(psdF().stone).length;
function psdQ(id,title,who,steps,reward,extra){
  const q=Object.assign({title,who,need:steps.length,goal:()=>steps.reduce((n,s)=>n+(s[1]()?1:0),0),reward},extra||{});
  Object.defineProperty(q,'desc',{enumerable:true,configurable:true,get(){const s=steps.find(s=>!s[1]());return s?(typeof s[0]==='function'?s[0]():s[0]):'Go back to '+who.split(',')[0]+'. All is done.'}});
  QUESTS[id]=q;QAREA[id]=PSP.REGION;return q}
const psdHas=(id,n)=>()=>bagCount(id)>=(n||1);
psdQ('psq30',"The Gaoler's Tin",'Hob Garrick, thief, in Cell Block A of the Undercroft Gaols',[["Bring Hob Garrick's tin of lock picks from the chest in the north east corner of the Question Room, in the Undercroft Gaols (below the kitchens). Red string on the lid.",psdHas('pstin')]],{gold:6000,xp:40000,items:['pspickset']},{take:{pstin:1}});
psdQ('psq31','The Signet Behind the Portrait','Lady Isaude Marwen, in Cell Block A of the Undercroft Gaols',[["Find Lady Isaude's portrait in the West Gallery (the Gallery of Portraits, ground floor of the Great Halls) and bring her heron signet ring from behind it.",psdHas('pssignet')]],{gold:7000,xp:45000,items:['pslocket']},{take:{pssignet:1}});
psdQ('psq32',"The Steward's Keys",'Ansel Peck, cook, in Cell Block A of the Undercroft Gaols',[["Kill the Pale Steward in the kitchens (ground floor, west wing).",()=>!!pspF().stewardDead],["Bring Ansel Peck's iron ladle from the kitchens.",psdHas('psladle')]],{gold:6500,xp:42000,items:['psstew']},{take:{psladle:1}});
psdQ('psq33','The Three Wheels','Mother Sedge, wellwife, in the flooded Cell Block B of the Deep Cells',[["Turn the three valve wheels of the Cistern in the order shown on the wall of Cell Block B ("+"south, west, east).",()=>!!psdF().wheelsDone],["Survive the Drowned Gaoler, who rises when the last wheel is turned.",()=>psdF().gaoler===2]],{gold:8000,xp:50000,items:['psraincharm']});
psdQ('psq34','Names on the Wall','Sister Calpurnia, in Cell Block B of the Deep Cells',[[()=>"Read the five Name Stones cut into the walls of the dungeons: two in the Undercroft Gaols, two in the Deep Cells, one in the Oubliette ("+Math.min(5,psdStones())+" of 5).",()=>psdStones()>=5],["Speak the names aloud at the altar of the chapel (ground floor, east wing). Stand close to the altar.",()=>!!psdF().namesSpoken]],{gold:9000,xp:55000,items:['pscandle']});
psdQ('psq35',"The Warden's Horn",'Captain Dyrwen Harrow, in Cell Block B of the Deep Cells',[["Bring the Warden's Horn from the Winch Loft above the Great Gatehouse. Captain Harrow only wants to hold it; you keep it.",psdHas('pshorn')]],{gold:10000,xp:60000,items:['psharrowseal']});
psdQ('psq36','The Empty Frame','Wilhelmina Gaunt, court painter, in the Oubliette',[["Take three pigment pots from the Painters' Closet (behind the Gallery of Portraits, ground floor) to Wilhelmina Gaunt in the Oubliette, and give them to her.",()=>!!psdF().pots],["Take her brush and palette to the empty frame in the Gallery of Portraits and paint it (stand close to the frame).",()=>!!pspF().framePainted]],{gold:10000,xp:60000,items:['pspalette']});
psdQ('psq37','Dawnwarden','Sir Edrik Stamford, in the Oubliette',[["Bring Sir Edrik's sword Dawnwarden from the rack in the Armoury (ground floor, west wing) to the Oubliette.",psdHas('psdawnwarden')]],{gold:12000,xp:70000,items:['psdawnsword']},{take:{psdawnwarden:1}});
psdQ('psq38','The Cup for the Sovereign','Yseult Ardent, cupbearer, in the Oubliette',[["Bring three silver roses from the Rose Garden of the Court of Statues to Yseult Ardent in the Oubliette.",psdHas('psroses',3)]],{gold:11000,xp:65000,items:['psantidote']},{take:{psroses:3}});
QNOTE.psq33='Down in the Deep Cells the water begins to drain, and for the first time in a year Mother Sedge has dry feet.';
function psdGive(id,n){for(let i=0;i<n;i++){if(!bagAdd(mkItem(id)))G.items.push({k:id,x:G.P.x,y:G.P.y,taken:false})}}
/* the talk of a prisoner: first meeting, the offer, the reminder, the hand-in, the thanks. D = the texts. */
function psdOffer(qid,D){return gySay(D.offer,[['We will help.',()=>{qAccept(qid);return gySay(D.accept,[BYE])}],['Not now.',()=>null]])}
function psdHand(qid,D){return gySay(D.ready,[['Here you are.',()=>{const rw=rewardText(qid);qTurnIn(qid);if(D.done)D.done();return gySay(D.thanks+' (Reward: '+rw+'.)',[BYE])}],BYE])}
function psdTalk(qid,D,d){
  const st=qSt(qid);
  if(qReady(qid))return psdHand(qid,D);
  if(st==='done')return gySay(D.after,[BYE]);
  if(st==='active'){if(D.active){const n=D.active(qid,D);if(n)return n}return gySay(D.remind(),[BYE])}
  return gySay(D.intro,[['Is there anything we can do?',()=>psdOffer(qid,D)],['Who else is kept here?',()=>gySay(D.others||"Others are in the cells round about. Speak to each one, and the door opens.",[BYE])],BYE])}
function psdPrisoner(id,name,face,qid,D){khNpc(id,name,face,d=>psdTalk(qid,D,d),{q:[qid]});PSD.people=PSD.people||{};PSD.people[id]=D}
const psdLeft=()=>{const F=psdF();return F.wheel.length};
psdPrisoner('psd_garrick','Hob Garrick, thief','ps_p_ghost_gentleman','psq30',{
  intro:"Hob Garrick, thief, and I will say so before you do. I came in over the kitchen roof for six candlesticks. Six! Silver, mind. The turnkeys caught me on the stairs, and the Questioner took everything off me, my boots included, and my tin.",
  offer:"My tin of picks. Round, dented, the lid tied down with red string. The Questioner keeps what he takes in a chest in the Question Room, the north east corner. I would go myself, but the door is not the only thing in my way. Bring it back and I will make it worth your while. I know something about the Sacristan.",
  accept:"Bless you. Mind the Questioner. He talks to the walls, and I think the walls have started to answer.",
  remind:()=>bagCount('pstin')?"You have the tin! Give it here.":"The tin is in a chest in the north east corner of the Question Room, with red string round the lid.",
  ready:"That is it. Red string and all, and the lid is still tied.",
  thanks:"Wonderful. Those picks have opened better doors than yours. Take the set, I have another in my boot. And since you were kind: the night the guards took the Sacristan, I was in the shaft cell under the stairs, and I heard them go down past me with a ring of long silver keys, down and down, to the oubliette. They came back up without them. That is all I know, and it is not nothing.",
  after:"Hob Garrick, honest man, at your service. If you ever find six silver candlesticks, they are mine.",
  done:()=>{pspF().garrickTold=1;try{pspClue(3)}catch(e){}}});
psdPrisoner('psd_isaude','Lady Isaude Marwen','ps_p_ghost_lady','psq31',{
  intro:"I am Lady Isaude Marwen, and no, you do not have to bow. The Steward wanted my signet, because whoever holds it holds my house, and the house is all I have left. So I hid it where he would never think to look.",
  offer:"Behind my own portrait, in the Gallery of Portraits, the West Gallery on the ground floor of the Great Halls. A gold signet with a heron cut in it. Will you fetch it? I do not ask you to give it to anyone. I only want to hold it once before I am forgotten.",
  accept:"Thank you. My portrait is the one where I look as if I knew a joke. The frame is gold. Lift the frame, not the canvas. The canvas is very old.",
  remind:()=>bagCount('pssignet')?"You have it! Give it here.":"Behind my portrait in the West Gallery, ground floor of the Great Halls. A gold frame, and I am the one who looks as if she knew a joke.",
  ready:"That is my heron. Oh. Give it to me.",
  thanks:"It is warm from your hand. Thank you. Take this locket. It held my husband's hair, and now it can hold your luck.",
  after:"I am still Lady Marwen. I find that is enough."});
psdPrisoner('psd_peck','Ansel Peck, cook','ps_p_ghost_butler','psq32',{
  intro:"Ansel Peck, cook to the Pale Court for thirty one years, and for twenty nine of them the food was fit to eat. Then the Steward told me to cook for the dead. Nobody eats at their feasts. Nobody. So I stopped cooking, and here I am.",
  offer:"The Steward starved the kitchens to make me give in. If you put him down, I will think kindly of you for the rest of my life, which may be short. And my ladle, an iron one, I left it hanging by the great pot. Bring it, and I will give you something that does not taste of ash.",
  accept:"He is a tall thin ghost with a ring of keys, in the kitchens. You cannot miss him, he rattles. Mind the rats, they have been at the flour.",
  remind:()=>!pspF().stewardDead?"The Pale Steward is still in the kitchens on the ground floor. Tall, thin, a ring of keys.":bagCount('psladle')?"You have my ladle! Give it here.":"The Steward is gone, good. Now my ladle, an iron one by the great pot in the kitchens.",
  ready:"My ladle! And the Steward is gone? I can taste the air already.",
  thanks:"Ten bowls of my best, packed for the road. They stay warm, I never found out why. And since you ask about the Sacristan: a sad, careful man. He told me once the upper keys were sent down with the guards, to where the lamps do not burn. Down, I think. Not up.",
  after:"If the kitchens are free, I will be there before the week is out. Somebody has to feed this place properly.",
  done:()=>{psdGive('psstew',9);pspF().peckTold=1;try{pspClue(2)}catch(e){}}});
psdPrisoner('psd_sedge','Mother Sedge, wellwife','ps_p_ghost_maid','psq33',{
  intro:"Mother Sedge, wellwife of the Low Street. I have drawn water for the poor since before the Sovereign, and I know one thing about water: it goes where you let it. Look at my floor.",
  offer:"The cistern is flooded, and my cell with it. Three valve wheels hold the water back, and someone jammed them on purpose. They turn in an order, and the order is written on the wall of this block. Turn them right and the water goes down. The last wheel wakes whatever lives in the tank. Will you do it?",
  accept:"South first, then west, then east, as the wall says. Turn one wrong and every wheel springs back and the pipes scream. The thing in the tank is the old Gaoler. He drowned in there, and he does not know it yet.",
  remind:()=>psdF().wheelsDone?"The Gaoler has risen. Put him down.":"The wheels are in the Cistern, south of here. South, then west, then east. "+(psdLeft()?psdLeft()+' of 3 turned.':'None turned yet.'),
  ready:"The water is going down. I can hear it. Dear heart, you did it.",
  thanks:"Take this. A rain charm, the sort the wellwives hang over the well. It says that whatever comes, it will also stop.",
  after:"My feet are dry for the first time in a year. I shall sit here and enjoy it.",
  others:"Calpurnia is two cells along, she prays. Harrow across from her, he counts. The fourth cell had two men in it, and the water got them."});
psdPrisoner('psd_calpurnia','Sister Calpurnia','ps_p_ghost_priest','psq34',{
  intro:"Sister Calpurnia, of the chapel of the Spire. They shut me in here when I would not bless the Sovereign. I said I could not bless a man who had never asked me to. It is a great deal of fuss for a sentence.",
  offer:"Those who were kept here scratched their names on the walls, and nobody has read them since. There are five Name Stones, two in the Gaols above, two here in the Deep Cells, and one in the Oubliette at the bottom. Read them. Then go to the altar of the chapel and say the names aloud. Somebody must. It is the only burial they will have.",
  accept:"Read each stone slowly. The names are all that is left of them. Then the chapel, on the ground floor of the east wing. Stand close to the altar and speak.",
  remind:()=>psdStones()<5?"Name Stones read: "+psdStones()+" of 5. Two in the Gaols, two in the Deep Cells, one in the Oubliette.":"You have read them all. Now the altar of the chapel, east wing, ground floor. Stand close and speak the names.",
  ready:"You have said them. I felt it, even down here, like a bell a long way off. Thank you.",
  thanks:"Take my candle. It has burned for nobody since I was brought here, and it is no shorter. Perhaps it was waiting.",
  after:"I am no longer afraid of the dark. It was never the dark that was the trouble."});
psdPrisoner('psd_harrow','Captain Dyrwen Harrow','ps_p_ghost_soldier','psq35',{
  intro:"Captain Dyrwen Harrow, last Warden of the Road. I held the gate while the others went west. They took me alive, which I regret. Now I tell the rats the news. The rats are not good listeners.",
  offer:"My horn hangs in the Winch Loft above the gatehouse, where they hung it as a trophy. It is battered and tarnished, but it is the horn of the Road Wardens, and I would like to hold it once more. Bring it to me. Then it is yours to keep.",
  accept:"The Great Gatehouse, the east guardroom, the stair up to the loft. Go quietly. The Gate Captain sleeps lightly.",
  remind:()=>bagCount('pshorn')?"You have it! Bring it here.":"The horn hangs in the Winch Loft above the Great Gatehouse. East guardroom, stair up.",
  ready:"That is her. She is cold. She was always cold.",
  thanks:"Keep the horn, I do not need it. Take this seal instead. Wenlock has others like it, and a man who carries one will be heard at the Wardens' doors.",
  after:"Captain Harrow, at ease. For the first time in nine years, at ease."});
psdPrisoner('psd_gaunt','Wilhelmina Gaunt','ps_p_ghost_dancer','psq36',{
  intro:"Wilhelmina Gaunt. Court painter to three Sovereigns, and the only one of them who ever asked me to paint what I saw. That was a mistake, and they shut me down here for it. There is one empty frame in the Gallery of Portraits. Mine. I never filled it.",
  offer:"I would like it painted. I cannot go, you see. Three pots of pigment from the Painters' Closet behind the Gallery, on the ground floor of the Great Halls. Bring them to me, and I will lend you my brush and palette, and you will paint the frame yourself, in my name.",
  accept:"The closet is behind the Gallery, a small room with a brush hanging on the door. The pots are clay, and small. Bring three.",
  remind:()=>"Take the brush and the palette to the empty frame in the Gallery of Portraits, and stand in front of it. Then come back and tell me how it looks.",
  active:(qid,D)=>{const F=psdF();
    if(!F.pots){if(bagCount('pspigment')>=3)return gySay("Three pots. Violet, white and grey, I can smell them from here. Give them to me.",[['Give her the three pots.',()=>{bagRemove('pspigment',3);F.pots=1;psdGive('pspaintbrush',1);return gySay("Good. Here is my brush and my palette. Take them to the Gallery of Portraits, to the empty frame, and stand before it. You will know what to do. Then come back and tell me how it looks.",[BYE])}],BYE]);
      return gySay("Three pots of pigment from the Painters' Closet behind the Gallery of Portraits. You have "+Math.min(2,bagCount('pspigment'))+(bagCount('pspigment')===1?" pot.":" pots."),[BYE])}
    return null},
  ready:"Is it done? Describe it to me. No, do not. I would rather imagine it.",
  thanks:"That is the first frame I ever finished by another's hand. Keep my palette. And you will find the frame has opened something in the Gallery. That was the idea.",
  after:"I can see it from here, if I close my eyes. It is a good frame."});
psdPrisoner('psd_stamford','Sir Edrik Stamford','ps_p_ghost_gentleman','psq37',{
  intro:"Sir Edrik Stamford, knight of King Osric's garrison. We were four on the road when the Pale Guard took us, and I am the one who is still alive, if you call this alive.",
  offer:"They took my sword, Dawnwarden. It was my father's, and his father's. It hangs on a rack in the Armoury now, ground floor, west wing, south of the kitchens. I would like to hold it once more. Bring it here, and afterwards it is yours. A sword is no use to me in a cell.",
  accept:"A plain blade, a white pommel, a sunrise cut into the guard. You will know it when you see it.",
  remind:()=>bagCount('psdawnwarden')?"You have it! Bring it here.":"Dawnwarden hangs on a rack in the Armoury, ground floor, west wing.",
  ready:"Dawnwarden. Gods, it is light.",
  thanks:"It was my father's. Now it is yours, because you carried it through the Spire when I could not. Keep it bright.",
  after:"I held it for a whole minute. That is more than I hoped for."});
psdPrisoner('psd_yseult','Yseult Ardent, cupbearer','ps_p_ghost_maid','psq38',{
  intro:"Yseult Ardent, cupbearer. Forty years I tasted the Sovereign's cup, every morning and every night, and I am still alive. That is the first thing that should tell you something.",
  offer:"I know what is in the cup now, and I can make an antidote. It needs silver roses, from the Rose Garden in the courtyard, the ones with a violet heart. Three of them. Bring them to me and I will make it, and tell you what I know about the Sovereign.",
  accept:"Silver white petals and a violet heart. The Rose Garden of the Court of Statues. Mind the gardener, he does not like them picked.",
  remind:()=>bagCount('psroses')>=3?"You have the roses! Give them here.":"Three silver roses from the Rose Garden in the courtyard. You have "+Math.min(2,bagCount('psroses'))+".",
  ready:"Three silver roses. Give them here, quickly, before they close.",
  thanks:"Five doses of antidote, good against the silver poison and the cold fever. And this. The Sovereign has not drunk from that cup in a hundred years. It is not for drinking, it is for being seen to be drunk from. That is all I will say, and I have said more than I should.",
  after:"I still taste everything before I swallow it. It is a hard habit to lose.",
  done:()=>{psdGive('psantidote',4);pspF().sovereignLore=1}});
/* ---------- the doors of the cells ---------- */
function psdApplyCells(){
  const L=LEVELS[LEVEL];if(!L||!psdIs(LEVEL))return;const F=psdF();
  for(const list of [L.decor,G.decor||[]])for(const d of list)if(d.npc&&d.npc.startsWith('psd_cell')&&F.cell[d.npc.slice(8)]){d.found=true;d.block=false;d.solid=0}}
function psdOpen(key,quiet){const F=psdF();F.cell[key]=1;psdApplyCells();if(!quiet){sfx('door');msg('The cell door swings open.','#d8d0e8')}}
function psdGateTalk(key,d){
  const c=PSD.cells[key],F=psdF();if(!c)return say('A cell door.',[BYE]);
  if(c.who){const n=NPCS[c.who];if(!F.cell[key])psdOpen(key);return n.root({k:khFaceKey(n.img),x:d.x,y:d.y,npc:c.who})}
  if(F.cell[key])return say('The cell door stands open.',[BYE]);
  psdOpen(key);return gySay(c.note||'The cell is empty.',[BYE])}
/* ---------- the chest with the tin, the Name Stones, the valve wheels ---------- */
khNpc('psd_tinchest','The Questioner\'s chest','chest',()=>{const F=psdF();
  if(F.tinTaken||bagCount('pstin'))return gySay("The chest holds the Questioner's things: a roll of cloth with a row of small bright knives in it, a hood, a list of names with most of them struck out. Nothing of Garrick's is left.",[BYE]);
  F.tinTaken=1;psdGive('pstin',1);sfx('key');msg("You take Garrick's tin.",'#ffe36a');
  return gySay("The chest is full of other people's belongings, each tied up in a little cloth with a number. One is a round tin, dented, the lid tied down with red string. It rattles. You take it.",[BYE])});
const PSD_STONE=[
 "A block of stone in the wall, and cut into it with the handle of a spoon: ORRIC TAM, MILLER. NELL ASHE. TOBY, AND TOBY'S DOG. Under it, smaller: THE DOG WAS LET OUT. HE WAS A GOOD DOG.",
 "Names, cut very small: WYN FELLOWES, TINKER. THE TWO BRAND BROTHERS. And one more, scratched over twice: I HAD A NAME ONCE. IT WAS ENOUGH TO GET ME HERE.",
 "Names scratched round a cell window: SISTER AGNES, WHO SANG TO THE OTHERS. MASTER PELL, CLOCKMAKER. JOSS, AGED NINE, WHO IS NOT IN TROUBLE, HE ONLY FELL IN.",
 "Four names in one hand: HOLLIN, MERROW, DANE, KESTREL. Then: WE WERE THE NIGHT WATCH. WE SAID THE KING WAS NOT WELL. WE WERE RIGHT.",
 "NAMES OF THE LOST. Hundreds of names, cut over each other until the stone is nothing but names. Near the bottom, newer and very clear: IF YOU ARE READING THIS, SAY THEM. THEY WERE ALL SOMEBODY."];
for(let i=0;i<5;i++)khNpc('psd_stone'+i,i===4?'The Names of the Lost':'A Name Stone','gy_nameplate',()=>{const F=psdF(),first=!F.stone[i];F.stone[i]=1;
  if(first){sfx('key');msg('You read a Name Stone. '+psdStones()+' of 5.','#ffe36a');if(psdStones()===5)msg('That is all five Name Stones. Speak the names at the altar of the chapel.','#ffe36a')}
  return gySay(PSD_STONE[i]+(first?'':' (Read already.)'),[BYE])});
/* the valve wheels: SOUTH (1), then WEST (0), then EAST (2); the third turned lets the Gaoler rise */
const PSD_WN=['WEST','SOUTH','EAST'],PSD_ORDER=[1,0,2];
for(let i=0;i<3;i++)khNpc('psd_wheel'+i,'A valve wheel','gy_rune',()=>{const F=psdF();
  if(F.wheelsDone)return gySay('The wheel is turned all the way. Far below, water is running away down a drain.',[BYE]);
  if(F.wheel.includes(i))return gySay('The '+PSD_WN[i].toLowerCase()+' wheel is already turned. '+F.wheel.length+' of 3.',[BYE]);
  return gySay('A great iron valve wheel, rusted dull red. A plate under it reads: THE '+PSD_WN[i]+' WHEEL. '+(F.wheel.length?F.wheel.length+' of 3 turned in the right order.':'None has been turned yet.'),[['Turn the wheel.',()=>psdTurn(i)],['Leave it.',()=>null]])});
function psdTurn(i){
  const F=psdF(),want=PSD_ORDER[F.wheel.length];
  if(i===want){F.wheel.push(i);sfx('door');G.shake=.3;
    if(F.wheel.length===3){F.wheelsDone=1;F.gaoler=1;F.ghp=1;msg('The third wheel turns. Every pipe in the cistern groans, and the water begins to move.','#a8d0f0');later(900,psdGaolerRise);
      return gySay('The east wheel turns, stiff, then easy. Far below you the whole cistern draws a long breath. Then the water in the middle of the tank begins to heave.',[BYE])}
    msg('The wheel turns with a long grinding squeal. '+F.wheel.length+' of 3.','#a8d0f0');return gySay('The wheel turns, and somewhere in the pipes something clunks and holds. '+F.wheel.length+' of 3.',[BYE])}
  F.wheel=[];sfx('growl');G.shake=.5;msg('Wrong order. Every wheel springs back, and the pipes scream.','#d09a80');
  const fr=gyFreeAround({x:G.P.x,y:G.P.y},4);for(let n=0;n<2&&n<fr.length;n++){addEnemy('psleech',fr[n][0],fr[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.lvl=LEVELS[LEVEL].diff;m.psdAdd=1}}
  return gySay('That was the wrong wheel. The pipes shriek, every wheel in the cistern spins back to where it began, and two leeches the size of forearms come swimming up the nearest shallows.',[BYE])}
function psdGaolerRise(){
  if(LEVEL!==9790)return;const fr=gyFreeAround({x:G.P.x,y:G.P.y},7).filter(f=>f[2]>=4);if(!fr.length)return;
  const f=fr[Math.min(fr.length-1,3)];addEnemy('psdrowngaoler',f[0],f[1],true);const m=G.enemies[G.enemies.length-1];
  if(m){m.lvl=103;m.base=103;m.fixed=LEVEL;m.maxhp=enemyStat('psdrowngaoler',103).hp;m.hp=m.maxhp;m.psPh=0;m.psSum=0}
  sfx('growl');G.shake=.5;msg('A huge shape stands up out of the water, wrapped in chains, with a ring of keys at its belt. "Nobody leaves," it says, as it has said for a hundred years.','#a8d0f0')}
/* ---------- the Second Floor Key: the strongbox in the Oubliette, and the hints that lead to it ---------- */
khNpc('psd_strongbox','The strongbox','ps_reliquary_chest',()=>{const F=psdF(),P=pspF();
  if(P.key2||bagCount('pskey2'))return say('The strongbox stands open. On the grey velvet lies the print of a long key, and nothing else.',[BYE]);
  if(!F.hungerDead)return say('A black iron strongbox on a dais, chained to the floor. A faint violet light shines through the keyhole and the seams of the lid. The lid will not lift while the Hunger is alive.',[BYE]);
  return say('The chains fall away. In the strongbox, on grey velvet, lies a tall silver key with a violet stone in the bow, glowing very faintly.',[['Take the key.',()=>{
    P.key2=true;if(!bagAdd(mkItem('pskey2')))G.items.push({k:'pskey2',x:Math.round(G.P.x),y:Math.round(G.P.y),taken:false});
    sfx('key');msg('You take the Second Floor Key. It opens the three stair doors to the second floor. Climb back up: the Grand Stair is at the north end of the Great Halls.','#ffe36a');
    try{if(qSt('psq10')==='active')msg('Journal: you have the key.','#ffe36a')}catch(e){}G.talk=null;return null}],BYE])});
khNpc('psd_gaolerlog',"The Gaoler's log",'hl_p_note',()=>{try{pspClue(3)}catch(e){}return say("The Gaoler's log lies open on the table. The last page, in square handwriting: 'Dusk. The Sacristan's receipt for the upper keys, sent down to the oubliette with two guards. Locked in the strongbox on the dais, at the bottom of the pit, where nobody will climb for them. The Hunger sits on it. God help whoever wants them.'",[BYE])});
khNpc('psd_scratch','Scratches on the wall','gy_nameplate',()=>{try{pspClue(2)}catch(e){}return say('Somebody has scratched into the stone with a nail: THEY CARRIED THE LONG KEYS PAST MY DOOR. DOWN. DOWN. NOT UP. I COUNTED THE STEPS.',[BYE])});
/* ---------- the three bosses: moves, helpers at two thirds and one third, what they leave ---------- */
const PSD_BOSS={
 psquestioner:{moves:[{every:3,mult:1.2,near:2,affl:'bleeding',txt:'The Questioner lifts a glowing iron out of the brazier and lays it across the front hero, quite gently. "A few questions," he says, in the voice of a clerk reading a list.',col:'#f0c8c0',verb:'The hot iron burns'},{every:5,all:true,mult:.5,affl:'shaken',txt:'He lets go of a chain, and every hook and weight in the room swings. The screaming that was in the walls comes out all at once.',col:'#e0d0f0',verb:'The screaming hurts'}],help:['psflayed','Two Flayed Prisoners tear loose from the wall chains, wailing.']},
 psdrowngaoler:{moves:[{every:3,mult:1.35,near:2,affl:'shaken',txt:'The Drowned Gaoler swings a chain with a padlock on the end. It has locked a great many doors.',col:'#c0d8f0',verb:'The chain hits'},{every:5,all:true,mult:.6,affl:'tomblung',txt:'He opens his mouth and the cistern comes out of it, cold, in a roar. Every hero is soaked and coughing.',col:'#a8d0f0',verb:'Cold water drowns'}],mend:[8,.03,'Water runs back into the wounds in his chest.'],help:['psdrowned','Two drowned prisoners climb out of the tank, still in their chains.']},
 pshunger:{moves:[{every:3,mult:1.35,near:3,affl:'bleeding',txt:'The Hunger lunges, and the mouth along its front closes on the front hero. It does not chew. It simply takes.',col:'#e8c8f0',verb:'The mouth closes on'},{every:4,all:true,mult:.6,affl:'cursed',txt:'The whole pit breathes in. Every hero feels something go out of them, very small, and not come back.',col:'#e8d0f8',verb:'The hunger drains'}],mend:[9,.03,'The bones of the pit crumble, and the pale mass draws them in.'],help:['psbonecrawl','Bone crawlers pour down out of the walls of the pit to feed it.']}};
for(const t in PSD_BOSS)ENEMY_DEF[t].act=e=>{if(e.hp<=0)return 0;return gyBossAct(e,PSD_BOSS[t])};
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){
  const def=e&&ENEMY_DEF[e.t],isB=!!(def&&def.psdb&&e.hp>0),stew=!!(e&&e.t==='psteward'&&e.hp>0);
  _he.apply(this,arguments);
  try{
    if(stew&&e.hp<=0)pspF().stewardDead=1;
    if(isB){
      if(e.hp>0&&e.t==='psdrowngaoler'){psdF().ghp=e.hp/Math.max(1,e.maxhp)}
      if(e.hp<=0){psdBossDied(e);return}
      const step=Math.min(2,Math.floor((1-e.hp/e.maxhp)*3));if(e.psSum===undefined)e.psSum=Math.min(2,Math.max(0,Math.floor((1-(e.hp+dmg)/e.maxhp)*3)));
      while(e.psSum<step){e.psSum++;const H=PSD_BOSS[e.t].help,fr=gyFreeAround(e,4);if(H&&fr.length){for(let n=0;n<2&&n<fr.length;n++){addEnemy(H[0],fr[n][0],fr[n][1],true);const m=G.enemies[G.enemies.length-1];if(m){m.psdAdd=1;m.lvl=LEVELS[LEVEL].diff}}msg(H[1],'#d8d0e8');sfx('growl')}}}
  }catch(x){console.error('psd boss hurt',x)}}}
function psdBossDied(e){
  const F=psdF(),t=e.t;for(const q of G.enemies)if(q.hp>0&&q.psdAdd){q.hp=0;q.dying=.4}
  if(t==='psquestioner'){F.questionerDead=1;sfx('win');msg('The Questioner folds up like a coat. The iron rings on the floor, and the room is quiet for the first time in a long while.','#ffe36a')}
  else if(t==='psdrowngaoler'){F.gaoler=2;sfx('win');msg('The Drowned Gaoler goes down in a rush of dark water, and the ring of keys sinks with him. The cistern begins, slowly, to drain.','#ffe36a');later(1400,()=>msg('Somewhere above, Mother Sedge is calling that her cell is dry.','#a8d0f0'))}
  else if(t==='pshunger'){F.hungerDead=1;sfx('win');msg('The Hunger comes apart into pale dust and a great many bones. The pit is only a pit. On a dais at its far end, a strongbox glows faintly.','#ffe36a')}}
/* the chest of the pit and the other chests: potions, mana, gear and gold, better the deeper the floor */
{const _lf=lootFor;lootFor=function(d){
  if(psdIs(LEVEL)&&d&&(d.k==='gy_chest'||d.k==='chest')){
    const r=q=>hash2(d.x,d.y,700+q+LEVEL),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})},k=Math.max(0,LEVEL-9780)/10;
    for(let q=0;q<2+(k>0?1:0);q++)add(potionFor(r(10+q)),1);add('supermana',1+(k>0?1:0));if(r(2)<.6)add('elixir',1);
    for(let q=0;q<1+(k>1?1:0);q++){const a=typeof armourDrop==='function'?armourDrop(r(20+q)):null;if(a)add(a)}
    if(typeof ringFor==='function'&&r(3)<.5)add(ringFor(r(4),102+k));
    d.gold=(d.goldAmt||0)||3000+k*700+Math.floor(r(5)*2600);return items}
  return _lf.apply(this,arguments)}}
/* ---------- arrival: first-visit lines, the cells that were opened, the flood that was drained, a saved fight ---------- */
function psdPrep(n){   // before the level loads: Cell Block B is dry once the wheels are done
  const F=psdF();if(n===9790&&F.wheelsDone&&LEVELS[n]&&!LEVELS[n]._drained){const L=LEVELS[n],fl=(L._psd&&L._psd.flood)||[];L._drained=1;L.fmap=L.fmap.map((r,y)=>r.split('').map((c,x)=>c==='5'&&fl.some(q=>x>=q[0]&&x<=q[2]&&y>=q[1]&&y<=q[3])?'2':c).join(''))}}
function psdArrive(n){
  const F=psdF();psdApplyCells();psdApplySecrets();
  if(!F['seen'+n]){F['seen'+n]=1;const t={9780:'Cold stone, wet cobbles, and somewhere a chain being dragged very slowly.',9790:'The air is cold and smells of old water. Every wall is wet.',9800:'The shaft closes over your head. There is no stair down from here, only the pit.'}[n];later(700,()=>msg(t,'#cfc8e8'))}
  if(n===9790&&F.gaoler===1&&!G.enemies.some(e=>e.t==='psdrowngaoler'&&e.hp>0)){
    const fr=gyFreeAround({x:G.P.x,y:G.P.y},8).filter(f=>f[2]>=4);if(fr.length){const f=fr[0];addEnemy('psdrowngaoler',f[0],f[1],true);const m=G.enemies[G.enemies.length-1];
      if(m){m.lvl=103;m.base=103;m.fixed=LEVEL;m.maxhp=enemyStat('psdrowngaoler',103).hp;m.hp=Math.max(1,Math.ceil(m.maxhp*(F.ghp===undefined?1:F.ghp)));m.psSum=m.psPh=Math.min(2,Math.floor((1-m.hp/m.maxhp)*3))}}}}
/* the altar of the chapel and the empty frame belong to other floors; the dungeon quests only ask the party to stand close and answer a prompt (the owners of those floors may also set the flags: namesSpoken in G.flags.psp.d, framePainted in G.flags.psp) */
{const _u=update;let nt=0;update=function(dt){try{
  if(G.state==='play'&&(nt-=dt)<=0){nt=.6;psdProx()}
  if(psdIs(LEVEL)&&G.state==='play'&&G.decor&&!PSD._ap){PSD._ap=LEVEL;psdApplyCells()}if(PSD._ap&&PSD._ap!==LEVEL)PSD._ap=0}catch(e){console.error('psd update',e)}return _u.apply(this,arguments)}}
function psdNearDecor(rx){return (G.decor||[]).find(d=>rx.test(d.k||'')&&!d.found&&Math.abs(d.x-G.P.x)+Math.abs(d.y-G.P.y)<=2)}
function psdProx(){
  if(G.talk||!G.P)return;const F=psdF(),P=pspF();let alt=false,fr=false;
  if(LEVEL===9760&&qSt('psq34')==='active'&&psdStones()>=5&&!F.namesSpoken){const d=psdNearDecor(/altar/);alt=!!d;if(d&&!PSD.altNear){PSD.altNear=1;
    G.talk={d,n:{name:'The altar'},t:G.time,btns:[],node:say('You have read all five Name Stones, and you know the names. The altar is plain and cold, with a bowl of dry petals on it. This is the place Sister Calpurnia meant.',[['Speak the names aloud.',()=>{F.namesSpoken=1;sfx('win');msg('You speak the names, one after another, and the chapel is very quiet. Down below, a bell seems to ring once.','#ffe36a');return gySay("You say them all. Orric Tam, Nell Ashe, Toby and Toby's dog. Wyn Fellowes. The Brand brothers. Sister Agnes, Master Pell, Joss. Hollin, Merrow, Dane, Kestrel. And the hundreds at the bottom of the Oubliette, which you read as many of as you can. When you stop, the candles on the altar all lean towards you, and then stand straight again.",[BYE])}],['Not yet.',()=>null]])};G.hold=null;G.queued=null}}
  if(!alt)PSD.altNear=0;
  if(LEVEL===9740&&qSt('psq36')==='active'&&F.pots&&!P.framePainted&&bagCount('pspaintbrush')){const d=psdNearDecor(/pt_empty/);fr=!!d;if(d&&!PSD.frameNear){PSD.frameNear=1;
    G.talk={d,n:{name:'The empty frame'},t:G.time,btns:[],node:say('An empty frame, gold, very old, with nothing in it but a little dust on the canvas. Wilhelmina Gaunt left the brush and palette in your hands for this.',[['Paint the frame.',()=>{P.framePainted=1;sfx('win');msg('You paint the frame, slowly, in Gaunt\'s colours.','#ffe36a');try{if(typeof pspFramePainted==='function')pspFramePainted()}catch(e){console.error(e)}return gySay("You mix violet and white and grey, and paint what you see: a small, tired figure in a plain chair, with a crown on the floor beside it. It takes a long time. When you step back the frame is no longer empty, and something clicks behind the wall.",[BYE])}],['Not yet.',()=>null]])};G.hold=null;G.queued=null}}
  if(!fr)PSD.frameNear=0}
/* ---------- sound: drips, a chain, a far moan, rats, running water in the cistern (made with tone and nz) ---------- */
const PSDS={n:{}};
function psdsDrip(v){if(!AC||G.mute)return;const f=800+Math.random()*700;tone(f,f*.6,.12,'sine',.03*v,0);tone(f*.7,f*.5,.14,'sine',.012*v,.1)}
function psdsChain(v){if(!AC||G.mute)return;for(let i=0;i<5;i++){const d=i*(.09+Math.random()*.06);tone(1700+Math.random()*1000,1400,.07,'triangle',.022*v,d)}}
function psdsMoan(v){if(!AC||G.mute)return;const f=150+Math.random()*60;tone(f,f*.75,1.8,'sine',.022*v,0);tone(f*1.5,f*1.2,1.5,'triangle',.009*v,.2);nz(1.5,.004*v,'bandpass',700,400,0)}
function psdsRats(v){if(!AC||G.mute)return;for(let i=0;i<9;i++)nz(.04,.025*v,'highpass',4200,3400,i*.07+Math.random()*.04)}
function psdsWater(v){if(!AC||G.mute)return;nz(2.6,.03*v,'bandpass',500,900,0);nz(2,.015*v,'lowpass',300,200,.4)}
function psdsTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!psdIs(LEVEL)||!SNDOPT.amb)return;
  const now=AC.currentTime,N=PSDS.n,due=(k,lo,hi)=>{if(N[k]===undefined){N[k]=now+Math.random()*hi;return false}if(now<=N[k])return false;N[k]=now+lo+Math.random()*(hi-lo);return true};
  if(due('drip',3,8))psdsDrip(.5+Math.random()*.5);if(due('chain',14,34))psdsChain(.7);if(due('moan',26,60))psdsMoan(.6);if(due('rat',18,40))psdsRats(.7);
  if(LEVEL===9790&&due('wat',6,14))psdsWater(.8);if(LEVEL===9800&&due('deep',30,60))psdsMoan(.9)}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{psdsTick()}catch(e){console.error('psds',e)}}}
/* ---------- the rings of the quest log (gold ! over the giver, circles where to go) ---------- */
if(typeof QRF!=='undefined'){const N=(l,...ids)=>({lvl:l,npc:ids}),E=(l,rx)=>({lvl:l,en:rx}),X=(l,x,y)=>({lvl:l,xy:[x,y]});
  const gv=(l,id)=>[N(l,id,'psd_cell'+Object.keys(PSD.cells).find(k=>PSD.cells[k].who===id))];
  QRF.T.psq30={give:[N(9780,'psd_garrick')],act:()=>psdF().tinTaken?[N(9780,'psd_garrick')]:[N(9780,'psd_tinchest')],ready:[N(9780,'psd_garrick')]};
  QRF.T.psq31={give:[N(9780,'psd_isaude')],act:()=>[N(9780,'psd_isaude')],ready:[N(9780,'psd_isaude')]};
  QRF.T.psq32={give:[N(9780,'psd_peck')],act:()=>[N(9780,'psd_peck')],ready:[N(9780,'psd_peck')]};
  QRF.T.psq33={give:[N(9790,'psd_sedge')],act:()=>{const F=psdF();return !F.wheelsDone?[N(9790,'psd_wheel'+PSD_ORDER[F.wheel.length])]:[E(9790,/^psdrowngaoler$/)]},ready:[N(9790,'psd_sedge')]};
  QRF.T.psq34={give:[N(9790,'psd_calpurnia')],act:()=>{const F=psdF(),o=[];for(let i=0;i<5;i++)if(!F.stone[i])o.push(N(i<2?9780:i<4?9790:9800,'psd_stone'+i));return o.length?o:[N(9790,'psd_calpurnia')]},ready:[N(9790,'psd_calpurnia')]};
  QRF.T.psq35={give:[N(9790,'psd_harrow')],act:()=>[N(9790,'psd_harrow')],ready:[N(9790,'psd_harrow')]};
  QRF.T.psq36={give:[N(9800,'psd_gaunt')],act:()=>[N(9800,'psd_gaunt')],ready:[N(9800,'psd_gaunt')]};
  QRF.T.psq37={give:[N(9800,'psd_stamford')],act:()=>[N(9800,'psd_stamford')],ready:[N(9800,'psd_stamford')]};
  QRF.T.psq38={give:[N(9800,'psd_yseult')],act:()=>[N(9800,'psd_yseult')],ready:[N(9800,'psd_yseult')]}}
/* test helper: the ASCII of a floor (# wall, . floor, D door, o blocked piece, N person, G cell gate, ~ shallow water, W deep water, e creature) and the reach of every square from the arrival with cell gates counted as open */
function psdAscii(id){
  const L=LEVELS[id]||(KH_LAZY[id]&&(KH_LAZY[id](),LEVELS[id]));if(!L)return '';const rows=L.rows.map((r,y)=>r.split('').map((c,x)=>c==='.'?(L.fmap[y][x]==='6'?'W':L.fmap[y][x]==='5'?'~':'.'):'#'));
  for(const [k,gid] of Object.entries(L.chars)){const d=KH_DOOR[gid];if(!d)continue;for(let y=0;y<rows.length;y++)for(let x=0;x<L.rows[y].length;x++)if(L.rows[y][x]===k)rows[y][x]='D'}
  for(const d of L.decor){if(d.k==='sign_gy')continue;const c=d.npc&&d.npc.startsWith('psd_cell')?'G':d.npc?'N':d.block?'o':'-';if(rows[d.y][d.x]==='.'||rows[d.y][d.x]==='~'||rows[d.y][d.x]==='-')rows[d.y][d.x]=c}
  for(const e of L.enemies)rows[e.y][e.x]='e';
  return rows.map(r=>r.join('')).join('\n')}
