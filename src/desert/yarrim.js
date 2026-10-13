/* ==========================================================================
   YARRIM. A small fishing town on the shore of the Vaast Sea, reached by a tunnel through the east wall of Khemetra. The
   sea is real ground: a heightfield under every cell (see terrain.js) with the water painted on it, a beach that slopes into
   it, a pier, moored boats, and islands of rock and sand that rise out of the water. Gulls everywhere.
   Levels: 289 the east tunnel, 290 Yarrim, 291..298 the buildings with doors.
   A chain of quests (yar1..yar6) from Menkaure and the vizier in Khemetra opens the gate, then goes on in Yarrim.
   ========================================================================== */
const YR={ID:290,TUN:289,W:112,H:80,FIRST:291};
for(const n of ['boat_fish','boat_row','boat_dhow','gull_stand','gull_up','gull_down','crab','crates','driftwood','nets','pots','shells'])loadImg('yar_'+n,'assets/yar_'+n+'.png');
Object.assign(NPC_H,{yar_boat_fish:1.5,yar_boat_row:.5,yar_boat_dhow:1.75,yar_gull_stand:.4,yar_gull_up:.34,yar_gull_down:.2,yar_crab:.2,yar_crates:.5,yar_driftwood:.32,yar_nets:.95,yar_pots:.5,yar_shells:.2});

/* ---- wall and door pictures: the painted ones (ds_tex_yarwall ...) replace these plain tiles at start-up ---- */
function makeYarArt(){
  const flat=(r,g,b)=>{const [c,x]=tcv();x.fillStyle=`rgb(${r},${g},${b})`;x.fillRect(0,0,TS,TS);return x.getImageData(0,0,TS,TS).data};
  const mk=(name,col)=>{const id=addTex(flat(col[0],col[1],col[2]));TEX[id].wh=1.7;const gid=TNF++;T_TILE[gid]=id;DS_TEXREG[name]=id;return gid};
  YR.gW=mk('yarwall',[226,222,212]);YR.gN=mk('yarnet',[220,214,200]);YR.gF=mk('yardrift',[140,128,112]);
  T_DOORS.yardoor=addTex(flat(70,100,150));DS_TEXREG.yardoor=T_DOORS.yardoor;
}

/* ---- the land: where the water starts, and how high the ground is ---- */
const yarCoast=y=>64+5*Math.sin(y*.11)+3*Math.sin(y*.27+1);
const YR_ISLANDS=[[82,22,4.5,2.8],[99,26,6.5,4.2],[90,52,5.5,3.4],[103,57,4.5,2.6],[76,58,3.5,1.9],[108,41,5.5,3.6]];
const YR_HOUSES=[ // x0,y0,x1,y1, and the door (portal index, door cell, the cell in front, which way you face leaving)
  {b:[12,30,22,37],p:1,d:[17,37],f:[17,38,2],room:'inn',name:'The Drowned Lantern',keeper:'yr_inn'},
  {b:[26,30,34,37],p:2,d:[30,37],f:[30,38,2],room:'hall',name:"The Harbourmaster's Office",keeper:'yr_harbour'},
  {b:[38,31,46,37],p:3,d:[42,37],f:[42,38,2],room:'shop',name:"Corran's Fish Stall",keeper:'yr_fish'},
  {b:[12,43,20,50],p:4,d:[16,43],f:[16,42,0],room:'shop',name:'Brine and Rope',keeper:'yr_chandler'},
  {b:[24,43,34,52],p:5,d:[29,43],f:[29,42,0],room:'prayer',name:'The Chapel of the Tides',keeper:'yr_priest'},
  {b:[38,43,44,49],p:6,d:[41,43],f:[41,42,0],room:'home',name:"Old Maren's House",keeper:'yr_maren',scene:'fisher'},
  {b:[48,30,54,37],p:7,d:[51,37],f:[51,38,2],room:'hall',name:'The Net Loft',keeper:null},
  {b:[58,22,62,26],p:8,d:[58,24],f:[57,24,3],room:'prayer',name:'The Yarrim Light',keeper:'yr_orsa'}
];
const YR_PLAIN=[[12,20,18,27],[22,20,30,27],[34,20,44,27],[48,20,54,27],[12,54,19,60],[23,55,31,61],[36,54,46,60],[49,43,55,48],[49,54,55,59]];

function yarTerrain(W,H,h,rk,block){
  const g2=new Float32Array(h),sm=new Float32Array(g2);
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x;sm[i]=(g2[i]*4+g2[i-1]+g2[i+1]+g2[i-W]+g2[i+W])/8}
  const s=new Float32Array(W*H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=y*W+x,hx=(sm[Math.min(W-1,x+1)+y*W]-sm[Math.max(0,x-1)+y*W])*.5,hy=(sm[x+Math.min(H-1,y+1)*W]-sm[x+Math.max(0,y-1)*W])*.5;
    const K=3.4,nl=Math.hypot(hx*K,hy*K,1),dif=(hx*K*.55+hy*K*.35+.76)/nl;
    s[i]=clamp(.18+1.0*dif,.42,1.2);
  }
  return {W,H,h:sm,s,rk,block};
}

function yarBuild(){
  if(LEVELS[YR.ID])return;
  const W=YR.W,H=YR.H,N=W*H;
  const rows=[];for(let y=0;y<H;y++){const r=[];for(let x=0;x<W;x++)r.push((x===0||y===0||x===W-1||y===H-1)?'D':'.');rows.push(r)}
  const h=new Float32Array(N),rk=new Float32Array(N),block=new Uint8Array(N),fm=new Array(N).fill('4');
  const sup=(x,y)=>clamp((Math.hypot(x-8,y-40)-4)/6,0,1);
  for(let y=0;y<H;y++){
    const sx=yarCoast(y);
    for(let x=0;x<W;x++){
      const i=y*W+x,land=x<sx;
      let base=land?Math.min(.5,(sx-x)*.055):-.2+.03*(tsmooth(x/4,y/4,21)-.5);
      if(land)base+=.1*tsmooth(x/9,y/9,22);
      const bn=Math.pow(clamp((17-y)/15,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,3)),bs=Math.pow(clamp((y-(H-18))/15,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,5)),bw=Math.pow(clamp((10-x)/9,0,1),1.2)*4.4*(.75+.5*tsmooth(x/6,y/6,7));
      let hh=base+Math.max(bn,bs,bw)*sup(x,y),isl=false;
      for(const [cx,cy,r,pk] of YR_ISLANDS){
        const d=Math.hypot(x-cx,y-cy)/(r*(1+.35*(tsmooth(x/3,y/3,9)-.5)));
        if(d<1.5){const v=pk*Math.pow(Math.max(0,1-d),1.15)-.2+.35*Math.max(0,1-d/1.5)*(tsmooth(x/2,y/2,11)-.3);if(v>hh){hh=v;if(v>-.1)isl=true}}
      }
      h[i]=hh;rk[i]=clamp((hh-.7)/1.6,0,1);
      block[i]=(!land||hh>1.7)?1:0;
      if(hh>1.2)fm[i]='5';
      else if(isl)fm[i]=hh>.05?'0':'3';
      else if(land)fm[i]=x<sx-3?'0':'3';
      else fm[i]=x<sx+3?'3':'4';
      if(!land&&!isl&&hh<=-.1&&x<sx+3)fm[i]='3';
    }
  }
  // streets and the promenade
  const street=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(!block[y*W+x])fm[y*W+x]='1'};
  street(9,38,56,42);street(35,22,37,58);street(56,22,58,38);street(9,28,56,29);street(9,52,56,53);
  // the passage from the tunnel mouth in the west cliff
  for(let x=1;x<=9;x++)for(let y=38;y<=42;y++){block[y*W+x]=0;fm[y*W+x]='1'}
  rows[40][1]='0';
  // the pier: a plank walk into the sea with a T at the end
  const plank=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*W+x;block[i]=0;h[i]=.08;rk[i]=0;fm[i]='2'}};
  plank(57,40,86,41);plank(84,36,86,45);
  // houses
  const putBlock=(b,doorCell)=>{for(let y=b[1];y<=b[3];y++)for(let x=b[0];x<=b[2];x++){rows[y][x]=((x*3+y*5)%7===0)?'N':((x+y)%11===0)?'F':'W';block[y*W+x]=1}};
  for(const q of YR_HOUSES){putBlock(q.b);rows[q.d[1]][q.d[0]]=String(q.p)}
  for(const b of YR_PLAIN)putBlock(b);
  // decor, scenery, items
  const decor=[],scenery=[],items=[];
  const free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&rows[y][x]==='.'&&!block[y*W+x];
  const dc=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));
  // moored boats and the boats pulled up for mending
  const boats=[['yar_boat_fish',64,35],['yar_boat_fish',67,46],['yar_boat_fish',73,34],['yar_boat_dhow',71,44],['yar_boat_dhow',78,35],['yar_boat_row',62,37],['yar_boat_row',63,44],['yar_boat_row',75,46],['yar_boat_row',80,43],['yar_boat_row',82,34],['yar_boat_row',91,46],['yar_boat_fish',72,28],['yar_boat_dhow',68,52],['yar_boat_row',70,22],['yar_boat_fish',66,60]];
  YR.boats=boats; // drawn each frame by yrSprites, so that they rock on the water
  // gear along the promenade
  for(const [x,y] of [[11,43],[22,44],[36,44],[47,43],[11,37],[24,38],[36,38],[47,38],[55,38]])dc(['yar_pots','yar_nets','yar_crates','yar_pots','yar_nets','yar_crates','yar_pots','yar_nets','yar_crates'][(x+y)%9],x,y);
  dc('yar_ship_dawn',87,40,{npc:'yr_ship',deco:false});dc(khFaceKey('kh_npc6_1'),85,38,{npc:'yr_menkaure',deco:false}); // the Dawn Walker and her captain at the end of the pier
  // washed-up crates for the harbourmaster
  const crateAt=y=>{const x=Math.floor(yarCoast(y))-2;return [x,y]};
  YR.crates=[26,34,47,53].map(yy=>crateAt(yy));
  YR.crates.forEach(([x,y],i)=>{if(free(x,y))decor.push({k:'yar_crates',x,y,block:true,npc:'yr_crate',cat:i})});
  // people
  const people=[['yr_fisher1','fisher',54,36],['yr_fisher2','fisher',59,39],['yr_child','child',33,41],['yr_old','oldman',44,41],['yr_woman','peasantW',20,41],['yr_net','peasantM',57,28]];
  for(const [id,face,x,y] of people)if(free(x,y))decor.push({k:face,x,y,block:true,npc:id,sc:1});
  // the beach: gulls, shells, driftwood and crabs
  const sc=(k,x,y,s)=>scenery.push({k,wx:x,wy:y,sc:s||1,decor:{k,walk:true,x:x|0,y:y|0}});
  for(let n=0;n<420;n++){
    const y=2+((hash2(n,1,31)*(H-4))|0),sx=yarCoast(y),x=sx-1-hash2(n,2,32)*10;
    if(x<12||y<18||y>62)continue;const cx=x|0,cy=y|0;if(!free(cx,cy)||fm[cy*W+cx]==='1')continue;
    const r=hash2(n,3,33),k=r<.34?'yar_gull_stand':r<.5?'yar_shells':r<.66?'yar_driftwood':r<.74?'yar_crab':null;if(!k)continue;
    sc(k,x,y+hash2(n,4,34)*.4-.2,.8+hash2(n,5,35)*.5);
  }
  for(let n=0;n<40;n++){const x=58+hash2(n,6,36)*28,y=40.2+hash2(n,7,37)*1.6;sc('yar_gull_stand',x,y,.9+hash2(n,8,38)*.3)} // gulls on the pier
  for(const [cx,cy,r] of YR_ISLANDS)for(let n=0;n<4;n++){const a=hash2(cx,n,41)*TAU,x=cx+Math.cos(a)*r*.55,y=cy+Math.sin(a)*r*.55,i=(y|0)*W+(x|0);if(h[i]>.05&&h[i]<1)sc('yar_gull_stand',x,y,.9)}
  for(const [x,y] of [[35,34],[44,40],[22,41],[30,48]])items.push({k:'potion',x,y});
  // the level
  const lv={rows:rows.map(r=>r.join('')),start:{x:3,y:40,f:1},enemies:[],items,decor,scenery,
    fmap:null,floorSet:['sand','sandpath','wood','bluesand','bluewater','pebA'],floor:'sand',ceil:'cloud',
    day:.98,outdoor:true,amb:.9,name:'Yarrim',label:'Yarrim',noExtras:true,diff:16,tele:{x:36,y:40},
    chars:{D:LEVEL41_DATA.chars.D,W:YR.gW,N:YR.gN,F:YR.gF},lights:[],portals:[]};
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=fm[y*W+x];fmap.push(s)}
  lv.fmap=fmap;
  lv.portals[0]={to:YR.TUN,x:62,y:12,f:3,tex:'cave'};
  for(const q of YR_HOUSES)lv.portals[q.p]={to:YR.FIRST+q.p-1,x:0,y:0,f:0,tex:'yardoor'};
  LEVELS[YR.ID]=lv;LEVEL_NAMES[YR.ID]='Yarrim';
  TERRS[YR.ID]=yarTerrain(W,H,h,rk,block);
  // the buildings: each room is built when first entered (so the Khemetra pictures are loaded by then); the doors know where in the room you arrive
  const START={inn:[6,7],hall:[5,6],shop:[5,6],prayer:[4,6],home:[4,4]};
  for(const q of YR_HOUSES){
    const id=YR.FIRST+q.p-1,st=START[q.room];
    lv.portals[q.p].x=st[0];lv.portals[q.p].y=st[1];lv.portals[q.p].f=0;
    KH_LAZY[id]=()=>{
      if(LEVELS[id])return;
      const b={id:'yr'+q.p,name:q.name,room:q.room,keeper:q.keeper,scene:q.scene};
      const R=khRoom(b,id,{to:YR.ID,x:q.f[0],y:q.f[1],f:q.f[2]}),L=R.level;
      if(q.room==='hall'&&q.p===7){for(const [x,y] of [[2,4],[8,4],[4,5],[6,5],[3,6],[9,5],[1,5],[9,6]])L.enemies.push({t:'rat',x,y,lvl:5})}
      LEVELS[id]=L;LEVEL_NAMES[id]=q.name;
    };
  }
}
LEVEL_NAMES[YR.ID]='Yarrim';LEVEL_NAMES[YR.TUN]='The Sea Gate Tunnel';YR_HOUSES.forEach(q=>{LEVEL_NAMES[YR.FIRST+q.p-1]=q.name}); // so the area list can name them before they are built
KH_LAZY[YR.ID]=yarBuild;
for(let i=0;i<8;i++){const id=YR.FIRST+i,stub=()=>{yarBuild();if(!LEVELS[id]&&KH_LAZY[id]!==stub)KH_LAZY[id]()};KH_LAZY[id]=stub} // a room asked for before the town exists builds the town first

/* ---- the tunnel from the east gate of Khemetra ---- */
function yarBuildTunnel(){
  const W=64,H=22,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('w'));
  const cut=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)g[y][x]='.'};
  cut(1,9,6,11);cut(6,9,16,10);cut(14,9,17,17);cut(14,16,28,17);cut(26,5,29,17);cut(26,5,44,6);cut(42,5,45,14);cut(42,13,56,15);cut(54,9,62,15);
  g[10][0]='0';g[12][63]='1';
  const rows=g.map(r=>r.join(''));
  const enemies=[],spots=[[16,10],[15,14],[20,16],[27,12],[28,7],[35,5],[43,9],[48,14],[55,13],[60,11]];
  for(const [x,y] of spots)enemies.push({t:'skel',x,y,lvl:15});
  const decor=[{k:'dbones',x:8,y:9,block:false,walk:true},{k:'dbones',x:27,y:15,block:false,walk:true},{k:'dbones',x:44,y:10,block:false,walk:true},{k:'chest',x:57,y:9,block:true,deco:false},{k:'chest',x:3,y:11,block:true,deco:false}];
  return {rows,start:{x:1,y:10,f:1},enemies,decor,items:[{k:'potion',x:20,y:17},{k:'potion',x:44,y:6}],lights:[[3,10],[15,10],[27,10],[35,6],[43,10],[50,14],[58,12]]};
}
KH_LAZY[YR.TUN]=function(){
  const t=yarBuildTunnel();
  LEVELS[YR.TUN]={rows:t.rows,start:t.start,enemies:t.enemies,items:t.items,decor:t.decor,day:.3,amb:.5,floor:'sand',ceil:'cloud',name:'The Sea Gate Tunnel',label:'Sea Gate Tunnel',lights:t.lights,
    portals:[{to:44,x:394,y:200,f:3,tex:'cave'},{to:YR.ID,x:3,y:40,f:1,tex:'cave'}],diff:15,noExtras:true,chars:{w:LEVEL41_DATA.chars.C}};
  LEVEL_NAMES[YR.TUN]='The Sea Gate Tunnel';
};

/* ---- the east gate of Khemetra ---- */
function yarGateBump(nx,ny){
  const F=G.flags;sfx('door');
  if(F.yarOpen){goToLevel(YR.TUN,{x:1,y:10,f:1});return true}
  const hint=qSt('yar2')==='active'?' The warden\'s key is in a chest down in the cisterns, beneath the Potters Market.':F.kingOrder?' The king has ordered it opened. Ask the grand vizier for the key.':' Someone ought to ask why.';
  G.talk={d:{k:'_',x:nx,y:ny},n:{name:'The Sea Gate'},node:say('A great gate of black timber and bronze, and the doorway behind it is bricked up. Salt crust runs down the stones, though the sea is hundreds of miles away. A plaque reads: SEA GATE. SEALED BY ORDER OF THE CROWN.'+hint,[['Leave it.',()=>null]]),t:G.time,btns:[]};
  G.hold=null;G.queued=null;return true;
}

/* ---- the quest chain ---- */
const yq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='Yarrim'};
QAREA_ORDER.splice(QAREA_ORDER.indexOf('Khemetra')+1,0,'Yarrim');
yq('yar2','The Warden\'s Key','Hotep-Ra, the grand vizier','The vizier will unseal the Sea Gate if you bring the old gate warden\'s key. It lies in a chest somewhere in the cisterns beneath the Potters Market.',1,khFlag('yarKey'),{gold:300,xp:1200});
yq('yar3','Salt and Bones','Menkaure, the shipwright','The Sea Gate is open, but the tunnel beyond is full of the drowned dead. Kill 8 skeletons in the tunnel so that honest people can walk it.',8,q=>(G.flags.k_skel||0)-(q.base||0),{gold:500,xp:2200},{cnt:'k_skel'});
yq('yar4','Washed Ashore','Tamsin Kell, the harbourmaster','Four crates from a wrecked trader have washed up along the beach at Yarrim. Find them all and tell Tamsin Kell, the harbourmaster.',4,()=>Object.keys(G.flags.yarCrates||{}).length,{gold:400,xp:1800});
yq('yar5','Rats in the Net Loft','Tamsin Kell, the harbourmaster','Rats have taken over the Net Loft, and the fishermen cannot mend their nets. Kill 6 rats there.',6,q=>(G.flags.k_rat||0)-(q.base||0),{gold:500,xp:2200},{cnt:'k_rat'});
yq('yar6','The Lamp of Yarrim','Orsa, keeper of the Yarrim Light','The lighthouse has been dark for a year because Orsa has no torches for the great lamp. Bring her 3 torches.',3,()=>bagCount('torch'),{gold:900,xp:4000,items:['potion4']},{take:{torch:3}});
const D3=khQD('The gate stands open, but the tunnel behind it has been shut for a hundred years, and the dead have made it their own. Kill 8 of the skeletons that walk it. The king\'s rider said Corvane\'s ship is off Yarrim, and the Dawn Walker is hidden at the far end. We need that road.','Eight, then. Mind the narrow bends.',(n,m)=>`The tunnel to the sea is not safe yet. ${n} of ${m} skeletons are down.`,'You have cleared the tunnel? Then the road to Yarrim is open at last.','Done! Yarrim has a harbourmaster called Tamsin Kell who will be glad of strong arms. Tell her I sent you.','The tunnel is quiet now. Every day a cart goes through.');
const D4=khQD('So you are the four. Menkaure\'s message reached me before you did. The Dawn Walker is hidden in the boathouse, and Corvane\'s men are in every tavern asking for strangers. We need stores for the voyage. A trader was wrecked on the rocks last week and her crates are scattered along the beach. Four of them. Find them for me before the gulls do, or the tide.','Walk the beach, north and south of the pier. They are heavy and square, you cannot miss them.',(n,m)=>`${n} of ${m} crates found so far. Keep walking the beach.`,'All four crates? Wonderful.','Thank you. Half the cargo is spoiled, but half is more than I had. Here is your share.','Those crates fed Yarrim for a month.');
const D5=khQD('The Dawn Walker\'s sails are in the Net Loft, and the rats have got at them. Kill six, and she will have a sail that holds.','The Net Loft is east of the harbourmaster\'s office. They are not big, but there are many.',(n,m)=>`${n} of ${m} rats are dead.`,'Six rats? The loft is quiet.','Splendid! Orsa at the lighthouse has been asking for someone who can be trusted. Go and see her.','The loft is quiet, and the nets are mended.');
const D6=khQD('The Yarrim Light. It has been dark a year, ever since the torches ran out. If you mean to run the reef at night with a black ship on your tail, you will need that lamp. I need three torches for the great lamp. Will you bring them?','Three torches. The general stores in Khemetra sell them, and so do the ships\' chandlers.',(n,m)=>`${n} of ${m} torches. The lamp is waiting.`,'Torches! Give them here.','The lamp is lit. Look out over the water tonight, and you will see it. Yarrim will not forget you.','The lamp burns every night. Ships find the harbour again.');

repWrap('kh_captain',()=>true,'About the Sea Gate',()=>{
  const F=G.flags;
  if(F.yarOpen)return qNode('yar3',D3);
  if(F.kingOrder)return say('The king has ordered the Sea Gate unsealed? Then the vizier has the key to find, and I have a tunnel to sweep. Come back when the gate is open and I will tell you what lies behind it.',[BYE]);
  return say('The old Sea Gate in the east wall of the city. Bricked up since my grandfather was a boy. Behind it, they say, is a tunnel, and at the end of the tunnel the Vaast Sea. I have a ship hidden at the far end, and nobody to sail her. Ishkander says the king comes home soon. Ask him. A king can open a gate that a shipwright cannot.',[BYE]);
});
repWrap('kh_vizier',()=>G.flags.kingOrder,'About the Sea Gate',()=>{
  const F=G.flags;
  if(qReady('yar2'))return say('You have the warden\'s key? Show me.',[['Here is the Sea Gate key.',()=>{qTurnIn('yar2');F.yarOpen=1;msg('The Sea Gate in the east wall of Khemetra is open.','#ffe36a');return say('Then the order is signed, and the gate is unsealed. A hundred years it has been shut. The east gate is yours. Do be careful what you let in.',[BYE])}],BYE]);
  if(qSt('yar2')==='active')return say('The key was lost in the cisterns when the old warden died. There is a chest down there that will hold it. Beneath the Potters Market, if you can bear the dark.',[BYE]);
  if(qSt('yar2')==='done')return say('The Sea Gate stands open. Do not make me regret it.',[BYE]);
  return say('The king has ordered the Sea Gate unsealed. I would obey faster if I knew where the key was. It was lost in the cisterns beneath the Potters Market when the old warden died. Bring it to me, and I will have the gate opened by the hour.',[['We will find the key.',()=>{qAccept('yar2');return say('Take a lantern. The cisterns are not kind.',[BYE])}],['Not now.',()=>null]]);
});
/* the warden's key, in a chest in the cisterns */
khNpc('yar_keychest','An old bronze chest','chest',d=>{const F=G.flags;
  if(qSt('yar2')==='active'&&!F.yarKey){F.yarKey=1;sfx('key');return say('Under the green crust, a heavy iron key on a ring, stamped with a wave. This is the Sea Gate key.',[BYE])}
  return say(F.yarKey?'An empty chest. The key is gone.':'An old chest, rusted shut. Nothing inside concerns you yet.',[BYE])});
(function(){const _b=khBuildWorld;khBuildWorld=function(){const first=!KH_WORLD_DONE;_b.apply(this,arguments);if(first)yarAfterWorld()}})();
function yarAfterWorld(){
  const L=LEVELS[KH_CISTERN];if(!L)return;
  const used=new Set(L.decor.map(d=>d.x+','+d.y)),W=L.rows[0].length,H=L.rows.length;
  let best=null,bd=-1;
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(L.rows[y][x]!=='.'||used.has(x+','+y))continue;const d=Math.abs(x-L.start.x)+Math.abs(y-L.start.y);if(d>bd&&d<46){bd=d;best=[x,y]}}
  if(best)L.decor.push({k:'chest',x:best[0],y:best[1],block:true,deco:true,npc:'yar_keychest'});
}

/* ---- Yarrim's people ---- */
khNpc('yr_harbour','Tamsin Kell, the harbourmaster','kh_npc6_3',()=>{
  if(qSt('yar4')==='done'||qSt('yar5')!==null)return qNode('yar5',D5);
  return qNode('yar4',D4)},{q:'yar4'});
QGIVER.yr_harbour=['yar4','yar5'];
khNpc('yr_orsa','Orsa, keeper of the Yarrim Light','kh_npc4_5',()=>{
  if(qSt('yar5')!=='done')return say('The lamp is dark, and I am too old to climb for nothing. Tamsin Kell speaks for those she trusts. Do something for her, and then come and see me.',[BYE]);
  return qNode('yar6',D6)},{q:'yar6'});
khInn('yr_inn','Bessa, innkeeper of the Drowned Lantern','kh_npc6_2','The Drowned Lantern',20,'The Drowned Lantern. Named for the lantern the old skipper dropped overboard, and the lantern is still burning at the bottom of the bay, if you believe the regulars. Beds are 20 gold. Fish stew is free with the bed.');
khShop('yr_fish','Corran, the fishmonger','kh_npc2_0',"Corran's Fish Stall",'Herring, dried and smoked, fresh when the boats come in, and a little salt cod for the road. Nothing here is more than a day out of the sea.','food');
khShop('yr_chandler','Pell, the ship\'s chandler','kh_npc5_4','Brine and Rope','Rope, tar, lamps, oil, torches and a good sharp knife. Everything a sailor needs and a few things a landsman does not.','general');
khNpc('yr_priest','Brother Haldane, of the Chapel of the Tides','kh_npc4_2',()=>say('We pray here for the boats, and for the people on them. The tide is God\'s breathing, and sailors know it. Light a candle if you like. It is a small thing, and the sea likes small things.',[['Ask for a blessing.',()=>{if(typeof afflCureOn==='function'){try{afflCure('cursed',-1,true)}catch(e){}}msg('A calm settles on the party.','#a8d8ff');return say('Go with the tide, friends.',[BYE])}],BYE]));
khNpc('yr_maren','Old Maren','peasantW',()=>say(rumourFor('town'),[['Anything else?',()=>say('I was born in this house, and I will die in it, and the gulls will have the roof. My husband swore there is an island out there with a spring on it that never runs dry. He never found it. He found plenty of rocks.',[BYE])],BYE]));
khNpc('yr_fisher1','A fisherman','fisher',()=>say('Herring are running thick. A good year, if the weather holds. You are from the city? Through the tunnel? I did not think anyone would come that way again in my lifetime.',[BYE]));
khNpc('yr_fisher2','A fisherman','fisher',()=>say('See that dhow? Came in from the south a month ago, no crew on board, nobody ever came to claim it. Tamsin says it is ours to keep. I say it is cursed.',[BYE]));
khNpc('yr_child','A child','child',()=>say('The gulls steal your fish if you do not watch them. One stole my whole supper yesterday, and then it sat on the roof and ate it in front of me.',[BYE]));
khNpc('yr_old','An old sailor','oldman',()=>say('I remember when the Sea Gate was open. Carts, camels, gold from the city, spices from the south. Then somebody sealed it, and the road went quiet. Funny how a city forgets its own sea.',[BYE]));
khNpc('yr_woman','A net-mender','peasantW',()=>say('Mind where you walk on the beach. The crabs nip, and the gulls dive. Everything out here wants a little of you.',[BYE]));
khNpc('yr_net','A net-mender','peasantM',()=>say('The islands out there are only rocks and sand. Boats keep clear of them. The rocks are sharp and the currents are not kind.',[BYE]));
khNpc('yr_crate','A washed-up crate','yar_crates',d=>{
  const F=G.flags;F.yarCrates=F.yarCrates||{};
  if(qSt('yar4')!=='active')return say('A square crate, swollen with water, stamped with a trader\'s mark. It is not your business yet.',[BYE]);
  if(F.yarCrates[d.cat])return say('You have already marked this crate for the harbourmaster.',[BYE]);
  F.yarCrates[d.cat]=1;d.found=true;d.block=false;sfx('key');
  const n=Object.keys(F.yarCrates).length;return say(n>=4?'You tie a rag to the fourth crate. That is all four. Tamsin Kell will be pleased.':`You tie a rag to the crate, so that the harbourmaster's men can find it. ${n} of 4 found.`,[BYE])});

/* ---- gulls ---- */
function yarEnter(n){
  const F=G.flags;
  if(n===YR.ID&&!F.yarSeen){F.yarSeen=1;msg('Salt wind and the cry of gulls. Beyond the beach, the Vaast Sea runs to the sky.','#a8d8ff')}
  if(n===YR.ID)F.khSeaSeen=1;
  if(typeof mqEnter==='function')mqEnter(n);
  if(typeof seaEnter==='function')seaEnter(n);
}
function yrSprites(out){
  if(!yarSea(LEVEL))return;
  const t=G.time,up=IMG.yar_gull_up,dn=IMG.yar_gull_down;if(!up||!dn)return;
  if(LEVEL===YR.ID)(YR.boats||[]).forEach(([k,x,y],i)=>{const im=IMG[k];if(!im)return;
    const ph=t*(.8+(i%3)*.15)+i*2.1;
    out.push({x:x+.5+Math.sin(ph*.6)*.07,y:y+.5+Math.cos(ph*.5)*.07,img:im,w:NPC_H[k]*im.width/im.height,bob:-.07+Math.sin(ph)*.035,decor:{k:'yar_boat_s'+i}});
  });
  for(let i=0;i<18;i++){
    let cx=[56,60,66,70,76,50,84,62,72,90,58,68,80,64,74,52,88,66][i],cy=[30,44,38,48,36,52,42,26,40,34,56,30,50,58,26,40,46,32][i];const r=2.5+i%5*1.1,sp=.5+(i%4)*.12,a=t*sp+i*1.7;
    if(LEVEL!==YR.ID){const S=SEA[LEVEL];cx=S.cx+Math.cos(i*1.7)*(5+i%6*3);cy=S.cy+Math.sin(i*1.7)*(4+i%5*3)}
    const img=((t*3.4+i)|0)%2?up:dn;
    out.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a*1.1)*r,img,w:.5,bob:1.3+(i%4)*.35+Math.sin(t*1.7+i)*.18,decor:{walk:true,k:'yar_gull_fly'}});
  }
}
function yarGulls(){ // the high ones, wheeling over the water
  const V=SKYV,hr=(G.clock%1440)/60;if(!V||hr<5.5||hr>20||!IMG.yar_gull_up)return;
  const sx=420/V.VW,sy=210/V.VH;
  ctx.save();ctx.beginPath();ctx.rect(0,0,420,210);ctx.clip();
  for(let i=0;i<16;i++){
    const ph=G.time*(.2+i*.012)+i*.9,az=(i*.41+.55*Math.cos(ph*.7))%TAU,el=.34+.22*Math.sin(ph+i)+i%4*.05,mx=Math.cos(az),my=Math.sin(az);
    const a=(mx*V.dX+my*V.dY)/(V.dX*V.dX+V.dY*V.dY),b=(mx*V.pX+my*V.pY)/(V.pX*V.pX+V.pY*V.pY);if(a<=.05)continue;
    const px=((b/a+1)*V.VW/2)*sx,py=(V.HH-24-el*V.HH*.8)*sy,im=IMG[(Math.floor(G.time*3+i)%2)?'yar_gull_up':'yar_gull_down'];if(!im||px<-20||px>440)continue;
    const w=18+i%3*4,hh=w*im.height/im.width;
    ctx.globalAlpha=.95;ctx.translate(px,py);ctx.rotate(Math.cos(ph)*.1);ctx.drawImage(im,-w/2,-hh/2,w,hh);ctx.setTransform(1,0,0,1,0,0);
  }
  ctx.restore();
}
