/* ==========================================================================
   YARRIM. A small fishing town on the shore of the Vaast Sea, reached by a tunnel through the east wall of Khemetra. The
   sea is real ground: a heightfield under every cell (see terrain.js) with the water painted on it, a beach that slopes into
   it, a pier, moored boats, and islands of rock and sand that rise out of the water. Gulls everywhere.
   Levels: 289 the east tunnel, 290 Yarrim, 291..298 the buildings with doors.
   A chain of quests (yar1..yar6) from Menkaure and the vizier in Khemetra opens the gate, then goes on in Yarrim.
   ========================================================================== */
const YR={ID:290,TUN:289,W:112,H:80,FIRST:291};
for(const n of ['tub','lavender','arch2','washing','olive','boat_fish','boat_row','boat_dhow','gull_stand','gull_up','gull_down','crab','crates','driftwood','nets','pots','shells'])loadImg('yar_'+n,'assets/yar_'+n+'.png');
Object.assign(NPC_H,{yar_boat_fish:1.5,yar_boat_row:.5,yar_boat_dhow:1.75,yar_gull_stand:.24,yar_gull_up:.2,yar_gull_down:.12,yar_crab:.2,yar_crates:.5,yar_driftwood:.32,yar_nets:.95,yar_pots:.5,yar_shells:.2,yar_tub:.55,yar_lavender:.5,yar_arch2:1.55,yar_washing:.8,yar_olive:1.7});

/* ---- wall and door pictures: the painted ones (ds_tex_yarwall ...) replace these plain tiles at start-up ---- */
function makeYarArt(){
  const flat=(r,g,b)=>{const [c,x]=tcv();x.fillStyle=`rgb(${r},${g},${b})`;x.fillRect(0,0,TS,TS);return x.getImageData(0,0,TS,TS).data};
  const mk=(name,col)=>{const id=addTex(flat(col[0],col[1],col[2]));TEX[id].wh=1.7;const gid=TNF++;T_TILE[gid]=id;DS_TEXREG[name]=id;return gid};
  YR.gW=mk('yarwall',[226,222,212]);YR.gN=mk('yarnet',[220,214,200]);YR.gF=mk('yardrift',[140,128,112]);
  T_DOORS.yardoor=addTex(flat(70,100,150));DS_TEXREG.yardoor=T_DOORS.yardoor;
  // the cottages are painted in faded pastels, and every door has its own colour
  YR.gP=mk('yarpink',[200,160,160]);YR.gY=mk('yaryellow',[210,190,130]);YR.gG=mk('yargreen',[160,180,160]);YR.gB=mk('yarblue',[150,170,200]);YR.gR=mk('yarrose',[210,190,180]);YR.gO=mk('yarcoral',[220,150,120]);
  for(let i=2;i<=7;i++){T_DOORS['yardoor'+i]=addTex(flat(90,80,70));DS_TEXREG['yardoor'+i]=T_DOORS['yardoor'+i]}
}

/* ---- the land: where the water starts, and how high the ground is ---- */
const yarCoast=y=>64+5*Math.sin(y*.11)+3*Math.sin(y*.27+1);
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

/* the village itself is built in yarrim_town.js, from the plan in yarrim_layout.js */

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
    portals:[{to:44,x:394,y:200,f:3,tex:'cave'},{to:YR.ID,x:YP.GORGE.x0+1,y:YP.GORGE.y,f:1,tex:'cave'}],diff:15,noExtras:true,chars:{w:LEVEL41_DATA.chars.C}};
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
khNpc('yr_harbour','Tamsin Kell, the harbourmaster','kh_yfolk1_2',()=>{
  const L=[['yar4',D4],['yar5',D5],['yq_crab',typeof D_CRAB!=='undefined'?D_CRAB:null]].filter(x=>x[1]);
  for(const [q,dl] of L)if(qSt(q)==='active'||qReady(q))return qNode(q,dl);      // what she is waiting for comes first
  for(const [q,dl] of L)if(qSt(q)===null&&(q==='yar4'||qSt('yar4')==='done'))return qNode(q,dl);    // then whatever she has not yet asked
  return qNode('yar5',D5)},{q:'yar4'});
QGIVER.yr_harbour=['yar4','yar5','yq_crab'];
khNpc('yr_orsa','Orsa, keeper of the Yarrim Light','kh_yfolk1_1',()=>{
  if(qSt('yar5')!=='done')return say('The lamp is dark, and I am too old to climb for nothing. Tamsin Kell speaks for those she trusts. Do something for her, and then come and see me.',[BYE]);
  return qNode('yar6',D6)},{q:'yar6'});
khInn('yr_inn','Bessa, innkeeper of the Drowned Lantern','kh_yfolk1_3','The Drowned Lantern',20,'The Drowned Lantern. Named for the lantern the old skipper dropped overboard, and the lantern is still burning at the bottom of the bay, if you believe the regulars. Beds are 20 gold. Fish stew is free with the bed.');
khShop('yr_fish','Corran, the fishmonger','kh_yfolk1_5',"Corran's Fish Stall",'Herring, dried and smoked, fresh when the boats come in, and a little salt cod for the road. Nothing here is more than a day out of the sea.','food');
khShop('yr_chandler','Pell, the ship\'s chandler','kh_yfolk2_0','Brine and Rope','Rope, tar, lamps, oil, torches and a good sharp knife. Everything a sailor needs and a few things a landsman does not.','general');
khNpc('yr_priest','Brother Haldane, of the Chapel of the Tides','kh_yfolk1_4',()=>say('We pray here for the boats, and for the people on them. The tide is God\'s breathing, and sailors know it. Light a candle if you like. It is a small thing, and the sea likes small things.',[['Ask for a blessing.',()=>{if(typeof afflCureOn==='function'){try{afflCure('cursed',-1,true)}catch(e){}}msg('A calm settles on the party.','#a8d8ff');return say('Go with the tide, friends.',[BYE])}],BYE]));
khNpc('yr_maren','Old Maren','kh_yfolk1_0',()=>say(rumourFor('town'),[['Anything else?',()=>say('I was born in this house, and I will die in it, and the gulls will have the roof. My husband swore there is an island out there with a spring on it that never runs dry. He never found it. He found plenty of rocks.',[BYE])],BYE]));
khNpc('yr_fisher1','Dunmore, a fisherman','kh_yfolk2_3',()=>say('Herring are running thick. A good year, if the weather holds. You are from the city? Through the tunnel? I did not think anyone would come that way again in my lifetime.',[BYE]));
khNpc('yr_fisher2','Finn, a fisherman','kh_yfolk2_4',()=>say('See that dhow? Came in from the south a month ago, no crew on board, nobody ever came to claim it. Tamsin says it is ours to keep. I say it is cursed.',[BYE]));
khNpc('yr_child','Wink, a child','kh_yfolk2_5',()=>say('The gulls steal your fish if you do not watch them. One stole my whole supper yesterday, and then it sat on the roof and ate it in front of me.',[BYE]));
khNpc('yr_old','Old Jory, a sailor','kh_yfolk2_2',()=>say('I remember when the Sea Gate was open. Carts, camels, gold from the city, spices from the south. Then somebody sealed it, and the road went quiet. Funny how a city forgets its own sea.',[BYE]));
khNpc('yr_woman','Nell, a net-mender','kh_yfolk3_0',()=>say('Mind where you walk on the beach. The crabs nip, and the gulls dive. Everything out here wants a little of you.',[BYE]));
khNpc('yr_net','Garrick, a net-mender','kh_yfolk3_1',()=>say('The islands out there are only rocks and sand. Boats keep clear of them. The rocks are sharp and the currents are not kind.',[BYE]));
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
    if(LEVEL!==YR.ID){const S=SEA[LEVEL];if(S){cx=S.cx+Math.cos(i*1.7)*(5+i%6*3);cy=S.cy+Math.sin(i*1.7)*(4+i%5*3)}else if(LEVEL===330){cx=G.P.x+Math.cos(i*1.7+t*.05)*(7+i%6*3);cy=G.P.y+Math.sin(i*1.7+t*.05)*(6+i%5*3)}else return}
    const img=((t*3.4+i)|0)%2?up:dn;
    out.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a*1.1)*r,img,w:.3,bob:1.3+(i%4)*.35+Math.sin(t*1.7+i)*.18,decor:{walk:true,k:'yar_gull_fly'}});
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
    const w=(18+i%3*4)*.6,hh=w*im.height/im.width;
    ctx.globalAlpha=.95;ctx.translate(px,py);ctx.rotate(Math.cos(ph)*.1);ctx.drawImage(im,-w/2,-hh/2,w,hh);ctx.setTransform(1,0,0,1,0,0);
  }
  ctx.restore();
}
