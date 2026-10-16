/* ==========================================================================
   OLDHAVEN, ACT 3: THE OAK CROWN. After the siege the east gate opens onto the Oakwood, an old oak forest with six glades. The king's
   granddaughter was raised here by the woodwardens. Nine quests: find the woodwardens, wolves, acorns, a hedge-wizard's herbs, the heir
   herself, the Ash Guard camp, timber for the Oakwrights, the three questions of the Great Oak, and the crowning.
   ========================================================================== */
const OAK={ID:311,W:80,H:72};
ITEMDEF.acorn={n:'Acorn',k:'quest',t:'Quest item',ic:'herb',c:'#a8803c',stack:1,price:1,d:'A fat brown acorn from the Oakwood. The Oakwrights plant these and wait a hundred years.',sw:.1};
ITEMDEF.oakcrown={n:'The Oak Crown',k:'quest',t:'Quest item',ic:'herb',c:'#7ac060',stack:0,price:0,d:'A ring of living oak leaves, woven by the woodwardens. It does not wilt. It is for the true heir of Oldhaven.',sw:.2};
const OAK_GLADES=[ // x, y, radius, what is there
  {id:'gate',x:6,y:36,r:5},{id:'camp',x:22,y:20,r:6},{id:'yard',x:22,y:54,r:6},{id:'house',x:46,y:36,r:6},{id:'ash',x:62,y:12,r:6},{id:'oak',x:68,y:54,r:7}
];
const OAK_PATHS=[['gate','camp'],['gate','yard'],['camp','house'],['yard','house'],['house','ash'],['house','oak'],['camp','ash']];
const OAK_FOLK=[
 {id:'oa_hale',n:'Hale, captain of the woodwardens',face:'kh_ohfolk7_4',glade:'camp',dx:0,dy:0},
 {id:'oa_ward1',n:'A woodwarden',face:'kh_ohfolk7_4',glade:'camp',dx:-3,dy:2},
 {id:'oa_ward2',n:'A woodwarden',face:'kh_ohfolk7_5',glade:'camp',dx:3,dy:2},
 {id:'oa_master',n:'Master Joss, of the Oakwrights',face:'kh_ohfolk4_0',glade:'yard',dx:0,dy:0},
 {id:'oa_wright',n:'An Oakwright',face:'kh_ohfolk4_1',glade:'yard',dx:-3,dy:1},
 {id:'oa_wright2',n:'An Oakwright',face:'kh_ohfolk4_5',glade:'yard',dx:3,dy:1},
 {id:'oa_wizard',n:'Bramwick, the hedge-wizard',face:'kh_ohfolk2_1',glade:'house',dx:0,dy:0},
 {id:'oa_wren',n:'Wren, a young woodwarden',face:'kh_ohfolk7_1',glade:'camp',dx:0,dy:-3},
 {id:'oa_ysolt',n:'Ysolt, keeper of the Great Oak',face:'kh_ohfolk3_1',glade:'oak',dx:0,dy:3}
];
/* ---- the level ---- */
function oakBuild(){
  if(LEVELS[OAK.ID])return;
  if(typeof KH_READY!=='undefined'&&!KH_READY)return;
  ohAlias();ohArt();ohFloors();
  const W=OAK.W,H=OAK.H,hs=(a,b,c)=>hash2(a,b,c),OAKS=['ltree0','ltree4','ltree8','ltree12','ltree19'];
  const rows=[];for(let y=0;y<H;y++)rows.push(new Array(W).fill('T'));
  const G0={};OAK_GLADES.forEach(g=>G0[g.id]=g);
  const carve=(cx,cy,r)=>{for(let y=Math.max(1,cy-r);y<=Math.min(H-2,cy+r);y++)for(let x=Math.max(1,cx-r);x<=Math.min(W-2,cx+r);x++){const d=Math.hypot(x-cx,y-cy)+hs(x,y,7)*1.6-.8;if(d<=r)rows[y][x]='.'}};
  for(const g of OAK_GLADES)carve(g.x,g.y,g.r);
  for(const [a,b] of OAK_PATHS){const A=G0[a],B=G0[b];let x=A.x,y=A.y;while(x!==B.x||y!==B.y){if(x!==B.x&&(y===B.y||hs(x,y,9)<.5))x+=x<B.x?1:-1;else y+=y<B.y?1:-1;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx>0&&yy>0&&xx<W-1&&yy<H-1)rows[yy][xx]='.'}}}
  const open=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&rows[y][x]==='.';
  const carved=new Uint8Array(W*H);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(rows[y][x]==='.')carved[y*W+x]=1;
  const fm=[];for(let y=0;y<H;y++){fm.push(new Array(W).fill('0'))}
  for(const [a,b] of OAK_PATHS){const A=G0[a],B=G0[b];let x=A.x,y=A.y;while(x!==B.x||y!==B.y){if(x!==B.x&&(y===B.y||hs(x,y,9)<.5))x+=x<B.x?1:-1;else y+=y<B.y?1:-1;fm[y][x]='1'}}
  // the gate back to Oldhaven, in the west edge
  rows[36][0]='0';rows[36][1]='.';rows[35][1]='.';rows[37][1]='.'; for(const yy of [35,36,37])carved[yy*W+1]=1;
  const decor=[],items=[],enemies=[],used=new Set();
  const free=(x,y)=>open(x,y)&&!used.has(x+','+y);
  const near=(x,y,rad)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(free(x+dx,y+dy))return [x+dx,y+dy]}return null};
  // the forest: a thick wall of oaks round every glade and path, so the sky stays open above them (no dark wall behind)
  const near2=(x,y,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const xx=x+dx,yy=y+dy;if(xx>0&&yy>0&&xx<W-1&&yy<H-1&&carved[yy*W+xx])return true}return false};
  const wallCells=[];
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(carved[y*W+x])continue;
    const d1=near2(x,y,1),d2=!d1&&near2(x,y,2);
    if(d1||(d2&&hs(x,y,11)<.85)){wallCells.push([x,y]);decor.push({k:OAKS[(hs(x,y,12)*5)|0],x,y,block:true,ox:(hs(x,y,13)-.5)*.5,oy:(hs(x,y,14)-.5)*.5,sc:.8+hs(x,y,15)*.4})}
    else if(!d2&&hs(x,y,17)<.1)decor.push({k:OAKS[(hs(x,y,12)*5)|0],x,y,block:true,ox:(hs(x,y,13)-.5)*.5,oy:(hs(x,y,14)-.5)*.5,sc:.8+hs(x,y,15)*.4});}
  for(const [x,y] of wallCells)used.add(x+','+y);
  // a few oaks and bushes standing in the glades
  for(let n=0;n<120;n++){const x=2+((hs(n,1,16)*(W-4))|0),y=2+((hs(n,2,16)*(H-4))|0);if(!free(x,y))continue;
    const gl=OAK_GLADES.find(g=>Math.hypot(x-g.x,y-g.y)<g.r+1);if(gl&&Math.hypot(x-gl.x,y-gl.y)<3)continue;
    used.add(x+','+y);decor.push({k:hs(n,3,16)<.5?OAKS[(hs(n,4,16)*5)|0]:hs(n,3,16)<.8?'lbush0':'lflora0',x,y,block:hs(n,3,16)<.5,ox:(hs(n,5,16)-.5)*.4,oy:(hs(n,6,16)-.5)*.4,sc:hs(n,3,16)<.5?.8+hs(n,7,16)*.4:1})}
  // the Great Oak: a huge tree in the middle of the last glade
  {const g=G0.oak;used.add(g.x+','+g.y);decor.push({k:'ltree0',x:g.x,y:g.y,block:true,sc:1.9,ox:0,oy:0});used.add((g.x-1)+','+g.y);used.add((g.x+1)+','+g.y);used.add(g.x+','+(g.y-1))}
  // people
  for(const f of OAK_FOLK){const g=G0[f.glade],q=near(g.x+f.dx,g.y+f.dy,3);const kp=KH_KEEPERS[f.id];if(!q||!kp)continue;used.add(q[0]+','+q[1]);decor.push({k:khFaceKey(kp.face),x:q[0],y:q[1],block:false,walk:true,npc:f.id,sc:kp.sc||1})}
  // acorns and herbs lying about, for the Oakwrights and the hedge-wizard
  for(let n=0;n<900&&items.length<24;n++){const x=2+((hs(n,21,17)*(W-4))|0),y=2+((hs(n,22,17)*(H-4))|0);if(!free(x,y))continue;used.add(x+','+y);items.push({k:items.length%2?'acorn':'herb',x,y})}
  items.push({k:'potion',x:8,y:36});
  // wolves in the woods, and the Ash Guard camp
  for(let n=0;n<900&&enemies.filter(e=>e.t==='wolf').length<14;n++){const x=10+((hs(n,31,18)*(W-14))|0),y=2+((hs(n,32,18)*(H-4))|0);if(!free(x,y)||Math.hypot(x-6,y-36)<12)continue;used.add(x+','+y);enemies.push({t:'wolf',x,y})}
  {const g=G0.ash;for(let n=0;n<10;n++){const q=near(g.x+((hs(n,41,19)*7-3.5)|0),g.y+((hs(n,42,19)*7-3.5)|0),3);if(!q)continue;used.add(q[0]+','+q[1]);enemies.push({t:'ashguard',x:q[0],y:q[1]})}}
  for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)rows[y][x]='.';
  const lv={rows:rows.map(r=>r.join('')),start:{x:2,y:36,f:1},enemies,items,decor,fmap:fm.map(r=>r.join('')),floorSet:['ohMeadow','ohGravel','ohLawn','ohMoss'],outdoor:true,day:.98,amb:.9,floor:'ohMeadow',floor2:'ohGravel',ceil:'cloud',name:'The Oakwood',label:'The Oakwood',diff:30,
    portals:[{to:305,x:142,y:73,f:3,tex:'tgate'}]};
  LEVELS[OAK.ID]=lv;LEVEL_NAMES[OAK.ID]='The Oakwood';
  {const N=W*H,hh=new Float32Array(N).fill(.3),rk=new Float32Array(N),bl=new Uint8Array(N);for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x===0||y===0||x===W-1||y===H-1)bl[y*W+x]=1;TERRS[OAK.ID]=yarTerrain(W,H,hh,rk,bl)} // a real blue sky above the oaks, as in Oldhaven
  lv.ceilH=5.2;
}
KH_LAZY[OAK.ID]=oakBuild;LEVEL_NAMES[OAK.ID]='The Oakwood';
{const _f=forestWallFor;forestWallFor=function(n){if(n===OAK.ID&&T_LUSH!==undefined)return T_LUSH;return _f.apply(this,arguments)}}

/* ---- the people and the quests ---- */
const oaq=(id,t,who,desc,need,goal,reward,extra)=>{QUESTS[id]=Object.assign({title:t,who,desc,need,goal,reward},extra||{});QAREA[id]='The Oakwood'};
if(QAREA_ORDER.indexOf('The Oakwood')<0)QAREA_ORDER.splice(QAREA_ORDER.indexOf('Elsewhere'),0,'The Oakwood');
const OAKF=()=>{const F=G.flags;return F.oak||(F.oak={q:{}})};
oaq('oa1','Through the East Gate','Captain Aldwyn, of the Gate','The east gate is open again. Aldwyn says the woodwardens of the Oakwood know where the old king’s heir was hidden. Go through the east gate and speak to Hale, captain of the woodwardens.',1,()=>OAKF().metHale?1:0,{gold:500,xp:5000});
oaq('oa2','Wolves at the Glade','Hale, captain of the woodwardens','Wolves have come down from the north and the woodwardens cannot patrol. Kill 6 wolves in the Oakwood.',6,q=>(G.flags.k_wolf||0)-(q.base||0),{gold:600,xp:6000},{cnt:'k_wolf'});
oaq('oa3','Acorns for the Oakwrights','Master Joss, of the Oakwrights','The Oakwrights plant an oak for every one they cut. Gather 6 acorns from the ground in the Oakwood and bring them to Master Joss.',6,()=>Math.min(6,bagCount('acorn')),{gold:500,xp:5000});
oaq('oa4','Herbs for the Hedge-Wizard','Bramwick, the hedge-wizard','Bramwick’s hedge walks about on its own, and so does his supper. He needs 5 herbs from the Oakwood to keep the hedge calm.',5,()=>Math.min(5,bagCount('herb')),{gold:600,xp:6000});
oaq('oa5','The Heir in the Woods','Wren, a young woodwarden','A young woodwarden called Wren says she has something to show you. Speak to her at the woodwarden camp.',1,()=>OAKF().heir?1:0,{gold:800,xp:8000});
oaq('oa6','Ash in the Oakwood','Hale, captain of the woodwardens','Vance’s Ash Guard have a camp in the north-east glade. Clear it. Kill 8 Ash Guard.',8,q=>(G.flags.k_ashguard||0)-(q.base||0),{gold:1200,xp:12000},{cnt:'k_ashguard'});
oaq('oa7','Timber for the Oakwrights','Master Joss, of the Oakwrights','The Oakwrights’ charter needs a roof, and the guild hall has none. Bring Master Joss 4 pieces of wood.',4,()=>Math.min(4,bagCount('wood')),{gold:700,xp:7000});
oaq('oa8','Three Questions of the Great Oak','Ysolt, keeper of the Great Oak','Before a ruler may wear the Oak Crown, someone must answer three questions at the Great Oak, honestly. Ysolt will ask them. Answer all three.',3,()=>Object.keys(OAKF().q).length,{gold:1500,xp:14000});
oaq('oa9','The Oak Crown','Ysolt, keeper of the Great Oak','The questions are answered. Bring Wren to the Great Oak and have Ysolt crown her. Then tell Captain Aldwyn.',1,()=>OAKF().crowned?1:0,{gold:3000,xp:25000,items:['oakcrown']});
const OAKD={
 oa1:khQD('The east gate is open, and for the first time in a month I can say something useful. The woodwardens of the Oakwood know the old king’s family. Go through the east gate and ask for Hale, their captain.','Through the east gate, into the Oakwood. Hale is in the camp in the first big glade.',()=>'Hale is in the camp in the first glade north-east of the gate.','You have met Hale? Good.','Good. The woodwardens will tell you the rest.','You are in the Oakwood.','I met Hale.'),
 oa2:khQD('Wolves, from the north. They have been pushing into our glades. If you can kill six, we can patrol again.','Six wolves. They are in the woods around the glades.',(g,n)=>`Six wolves, and you have killed ${g} of ${n}.`,'The woods are quieter. Take this, from the woodwardens.','Six wolves, and a glade safe again.','The wolves are fewer.','Six wolves are dead.'),
 oa3:khQD('We plant an oak for every oak we cut. It is the rule of the guild. I need six acorns for the nursery. They lie on the ground in the Oakwood, on the edge of the glades.','Six acorns. Look on the ground near the trees.',(g,n)=>`Six acorns, and you have ${g}.`,'Six acorns. That is a forest, in a hundred years. Thank you.','Six acorns. Take your pay.','The nursery is planted.','Here are six acorns.'),
 oa4:khQD('Come in, come in, mind the hedge. It walks. Five herbs, from the forest floor, would keep it calm. It sulks when it is hungry, and it is very heavy.','Five herbs. Look on the ground in the Oakwood.',(g,n)=>`Five herbs, and you have ${g}.`,'Five herbs! The hedge is purring. Take this.','Five herbs, and a calm hedge.','The hedge is calm.','Here are five herbs.'),
 oa6:khQD('The Ash Guard have a camp in the north-east glade. They have been cutting trees and burning them. Clear them out. There are about eight.','Eight Ash Guard, in the north-east glade.',(g,n)=>`Eight Ash Guard, and you have beaten ${g} of ${n}.`,'The glade is clear. Take this.','Eight Ash Guard, and the oaks safe.','The glade is clear.','The Ash Guard camp is cleared.'),
 oa7:khQD('The guild charter is written, but we have no roof for the hall. Four pieces of wood would do. We have plenty of oak, but it is not for cutting. Can you buy some?','Four pieces of wood. General stores sell them.',(g,n)=>`Four pieces of wood, and you have ${g}.`,'Four pieces of wood. The hall is roofed. Take this.','Four pieces of wood, and a roof for the guild.','The hall has a roof.','Here is the wood.')
};
// the woodwardens: Hale gives the first two quests and the camp one
khNpc('oa_hale','Hale, captain of the woodwardens','kh_ohfolk7_4',()=>{
  const F=G.flags,O=OAKF();
  if(!O.metHale){O.metHale=1;return say('You have come through the east gate? Then you have seen the city under siege and survived. I am Hale, captain of the woodwardens. We keep the Oakwood. Ask me about work, or about the old king’s family.',[BYE])}
  const nodes=[];
  if(qSt('oa2')!=='done')nodes.push(['About the wolves',()=>qNode('oa2',OAKD.oa2)]);
  if(qSt('oa2')==='done'&&qSt('oa6')!=='done')nodes.push(['About the Ash Guard camp',()=>qNode('oa6',OAKD.oa6)]);
  nodes.push(['About the old king’s family',()=>say('The king has a granddaughter. She was raised here, with us, because the chancellor was not safe to trust. Her name is Wren. Speak to her, and ask her to show you what she keeps.',[BYE])]);
  return say('Hale, captain of the woodwardens. The oaks are old and the wolves are hungry. What can I do for you?',[...nodes,BYE]);
},{q:['oa2','oa6']});
khNpc('oa_ward1','A woodwarden','kh_ohfolk7_4',()=>say('Quiet, please. The oaks listen.',[BYE]));
khNpc('oa_ward2','A woodwarden','kh_ohfolk7_5',()=>say('I walk the same path every day. The oaks have never once told me it was the wrong path.',[BYE]));
khNpc('oa_master','Master Joss, of the Oakwrights','kh_ohfolk4_0',()=>{
  const nodes=[];
  if(qSt('oa3')!=='done')nodes.push(['About the acorns',()=>qNode('oa3',OAKD.oa3)]);
  if(qSt('oa3')==='done'&&qSt('oa7')!=='done')nodes.push(['About the guild roof',()=>qNode('oa7',OAKD.oa7)]);
  return say('Master Joss of the Oakwrights. We build with oak that has fallen, and we plant for oak that has not. What brings you?',[...nodes,BYE]);
},{q:['oa3','oa7']});
khNpc('oa_wright','An Oakwright','kh_ohfolk4_1',()=>say('Fallen oak is the best oak. It has already said what it wants to be.',[BYE]));
khNpc('oa_wright2','An Oakwright','kh_ohfolk4_5',()=>say('A good joint needs no nail. A bad joint needs a lot of nails and a lot of excuses.',[BYE]));
khNpc('oa_wizard','Bramwick, the hedge-wizard','kh_ohfolk2_1',()=>qNode('oa4',OAKD.oa4),{q:'oa4'});
khNpc('oa_wren','Wren, a young woodwarden','kh_ohfolk7_1',()=>{
  const O=OAKF();
  if(qSt('oa5')===null)qAccept('oa5');
  if(qReady('oa5')){const rw=rewardText('oa5');qTurnIn('oa5');return say('You believe me? Then that is a start. Reward: '+rw+'. Ysolt keeps the Great Oak, in the far south-east glade. She will ask the three questions.',[BYE])}
  if(!O.heir){O.heir=1;return say('You have been asking about the old king’s family, yes? Hale told me. I am Wren. I am the king’s granddaughter. I have a ring that came with me when I was a baby, with the oak sign of the royal house. I did not want it. I wanted to be a woodwarden. But the city is in trouble, and the king is old. I will do what is needed.',[BYE])}
  if(O.crowned)return say('The Oak Crown is on my head, and it is heavier than I thought. But it is the right weight.',[BYE]);
  if(qSt('oa8')==='done')return say('The Oak is satisfied. I am ready for the crowning. Let us go to the Great Oak.',[BYE]);
  return say('I am still a woodwarden. I am also, it seems, a princess. Neither is very comfortable.',[BYE]);
},{q:'oa5'});
khNpc('oa_ysolt','Ysolt, keeper of the Great Oak','kh_ohfolk3_1',()=>{
  const O=OAKF(),F=G.flags;
  if(O.crowned)return say('The Oak has seen a crowning. It does not forget.',[BYE]);
  if(!O.heir)return say('The Great Oak. Nobody is crowned under it without a heir to be crowned. Find the old king’s granddaughter first. Ask the woodwardens.',[BYE]);
  if(qSt('oa8')===null)qAccept('oa8');
  if(qSt('oa8')==='active'||qSt('oa8')===null){
    const qs=[
     ['A hungry stranger asks you for bread. You have one loaf. What do you do?',[['Share it.',1],['Keep it.',0],['Sell it.',0]]],
     ['A friend breaks a rule to protect you, and it causes some harm. What do you do?',[['Thank them and help put the harm right.',1],['Say nothing.',0],['Blame them.',0]]],
     ['You could win by a lie that harms nobody you know. What do you do?',[['Tell the truth and lose.',1],['Lie. Nobody is hurt.',0],['Let someone else lie for you.',0]]]
    ];
    const n=Object.keys(O.q).length;
    if(n>=3){if(qReady('oa8'))qTurnIn('oa8');return say('All three are answered. The Oak is satisfied. Bring Wren here, and I will crown her.',[BYE])}
    const [text,opts]=qs[n];
    return say(`Question ${n+1}. ${text}`,opts.map(([label,ok])=>[label,()=>{
      if(ok){O.q[n]=1;if(Object.keys(O.q).length>=3){qTurnIn('oa8');return say('That is the third. The Oak is satisfied. Bring Wren to me, and I will crown her.',[BYE])}return say('The Oak hears that, and likes it. Ask me again for the next question.',[BYE])}
      return say('The Oak waits. Think again. There is no hurry. It is a very old tree.',[BYE])}]));
  }
  if(qSt('oa8')==='done'&&qSt('oa9')===null)qAccept('oa9');
  if(qSt('oa9')==='active'&&!O.crowned)return say('Wren has not come yet? Make sure she is here. Speak to her first at the camp, and tell her the Oak is ready.',[['Wren is here. Crown her.',()=>{O.crowned=1;G.flags.heirCrowned=1;qTurnIn('oa9');return say('By oak and by root, Wren is crowned. Take the crown’s leaf with you. It will not wilt. Go to Captain Aldwyn and tell the king his granddaughter is alive and ready.',[BYE])}],BYE]);
  return say('The Oak has nothing more to ask of you.',[BYE]);
},{q:['oa8','oa9']});
// the questions, and the heir, close their quests when answered (the quests are handed in at the people who gave them)
repWrap('oh_cap',()=>qSt('sg8')==='done'&&qSt('oa1')!=='done','About the Oakwood',()=>qNode('oa1',OAKD.oa1));
repWrap('oh_cap',()=>!!G.flags.heirCrowned&&!G.flags.heirReported,'About the heir',()=>say('Wren is crowned? Then the king will have his granddaughter, and the city a ruler it can trust. Go to the palace and tell him. He will want to see that ring, and Ishkander’s letter, the one with the unbroken seal.',[['We will tell him.',()=>{G.flags.heirReported=1;msg('The Oak Crown has been told to the king. Act 4 will follow.','#a8e8a0');return say('Thank you. I will see that the doors are open. The device you carry, the six pieces, is in Ishkander’s letter. The king can read it now.',[BYE])}],BYE]));
