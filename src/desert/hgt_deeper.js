/* ==========================================================================
   THE DEEPER HOLLOW LANDS (prefix hgd / HGD). The Hollow Child-King's corruption is seeping up into the grasslands from a place further down. After the four books,
   Aldous Wend (Exsce) sends the party to the two great flying creatures who can find the way: Old Lilac, the great moth, in Glorm, and Bulb, the great whale, in Nibb.
   Three quests in a row: dh1 find the moth (handed in by speaking to it), dh2 six jars of royal jelly for the moth, dh3 kill eight hive creatures for the whale.
   Then the whale carries the party down through the old gate to level 475, a first stretch of the deeper lands (a winding cavern, hollowed creatures, a warden), which ends at a plaque.
   ========================================================================== */
const HGD={ID:475,DIFF:72,MOTH:{lvl:483,id:'hgd_moth',img:'hgtb_lilacmoth',name:'Old Lilac, the great moth'},WHALE:{lvl:484,id:'hgd_whale',img:'hgtb_aquawhale',name:'Bulb, the great whale'}};
LEVEL_NAMES[HGD.ID]='The Deeper Hollow';LEVEL_RATING[HGD.ID]=HGD.DIFF;
Object.assign(ENEMY_DEF,{
  hgdgrub:{name:'Hollowed Grub',hp:90,dmg:[8,14],hit:.76,w:1.3,img:'hg_larva',xp:130,gold:[0,8],speed:1,verb:'gnaws'},
  hgdguard:{name:'Hollowed Guard',hp:105,dmg:[9,16],hit:.8,w:.85,img:'hg_wasp',xp:170,gold:[4,16],speed:1,verb:'stabs'},
  hgdgolem:{name:'Hollowed Golem',hp:180,dmg:[12,21],hit:.78,w:1.45,img:'hg_golem',xp:230,gold:[6,22],speed:1,verb:'pounds'},
  hgdswarm:{name:'Blackened Swarm',hp:40,dmg:[5,9],hit:.72,w:1.3,img:'hg_swarm1',xp:80,gold:[0,0],speed:2,fly:true,wander:true,verb:'bites',kind:'swarm'},
  hgdwarden:{name:'The Hollowed Warden',hp:650,dmg:[18,30],hit:.86,w:2.3,img:'hg_golem',xp:1500,gold:[200,320],speed:1,verb:'crushes',boss:true,aboveParty:4}});
if(typeof NO_VARY!=='undefined')NO_VARY.push('hgdwarden');
// every hive creature killed is counted for the whale's errand
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);if(was&&e.hp<=0&&/^hg(larva|wasp|golem|swarm|boss|d)/.test(e.t))G.flags.hgKills=(G.flags.hgKills||0)+1}}
/* ---------- the quests ---------- */
const HGD_Q={
  dh1:{title:'The Corruption in the Deep',who:'Aldous Wend',desc:'Aldous Wend says the Hollow Child-King\'s corruption is seeping up from the deeper Hollow Lands. Find Old Lilac, the great moth, in Glorm. The great creatures that fly can find the way down.',need:1,goal:()=>G.flags.hgdMoth?1:0,reward:{gold:200,xp:900}},
  dh2:{title:'Jelly for the Moth',who:'Old Lilac, the great moth',desc:'Old Lilac is weak from the corruption in the air. Bring her 6 jars of royal jelly from the hives and she will tell you who can find the gate.',need:6,goal:()=>bagCount('hgjelly'),take:{hgjelly:6},reward:{gold:400,xp:1400,items:['potion3']}},
  dh3:{title:'The Whale\'s Errand',who:'Bulb, the great whale',desc:'Bulb, the great whale, in Nibb, will carry the party down to the deeper Hollow Lands, but first the hive creatures nearest the gate must be thinned. Kill 8 creatures of the hives.',need:8,cnt:'hgKills',goal:q=>(G.flags.hgKills||0)-(q.base||0),reward:{gold:600,xp:2200,items:['potion3','potion3']}}};
for(const id in HGD_Q){QUESTS[id]=HGD_Q[id];QAREA[id]='The Hollow Grasslands'}
if(typeof MAIN_QUESTS!=='undefined')['dh1','dh2','dh3'].forEach(id=>MAIN_QUESTS.add(id));
const QNEXT_HGD={dh1:'dh2',dh2:'dh3'};
{const _t=qTurnIn;qTurnIn=function(id){const ok=_t.apply(this,arguments);if(ok&&QNEXT_HGD[id]&&qSt(QNEXT_HGD[id])===null){qAccept(QNEXT_HGD[id]);msg('New quest: '+QUESTS[QNEXT_HGD[id]].title+'.','#ffe36a')}return ok}}
const HGD_DESC=[ // the wizard's story, then what each giant says
  'There is a thing I have not told you. Since the Hollow Child-King fell, the corruption has not stopped. It runs from the Orange Spire down into the ground, and it comes up again here: in the wax of the hives, in the pond water, in the way the grubs have started to look at people. It is rising from a place further down, the deeper Hollow Lands, and nobody I know has seen them.',
  'The way down is an old gate that has not been opened since the first king. I do not know where it is. But the great creatures that fly over this cavern can see all of it from above. Old Lilac, the great moth, lives in Glorm, and Bulb, the great whale, drifts over Nibb. Find them. Ask them. They will find the gate, and they can carry you there.'];
const hgdO=(offer,accept,ready,thanks,after)=>({offer,accept,remind:(g,n)=>(offer?offer+' ':'Still waiting. ')+'('+g+' of '+n+' so far.)',ready,thanks,after});
// Aldous: after the four books he tells the party about the deeper lands
{const _a=NPCS.hg_aldous.root,wrap=function(){
  const F=G.flags;
  if(typeof hgLvl==='function'&&hgLvl()>=4){
    const nodeOpts=[];
    if(qSt('dh1')===null)nodeOpts.push(['Is something wrong in the grassland?',()=>say(HGD_DESC[0],[['Go on.',()=>say(HGD_DESC[1],[['We will find them.',()=>{qAccept('dh1');return say('Old Lilac first, in Glorm, in the east. Be polite to her. She is very old, and she is not well.',[BYE])}],['Not now.',()=>null]])]])]);
    else if(qSt('dh1')==='active')nodeOpts.push(['Where do I find the great creatures?',()=>say('Old Lilac, the great moth, is in Glorm, in the east. Bulb, the great whale, is over Nibb, in the north. Start with the moth.',[BYE])]);
    if(nodeOpts.length){const n=_a();n.opts=nodeOpts.concat(n.opts);return n}
  }
  return _a()};
  NPCS.hg_aldous.root=wrap;KH_KEEPERS.hg_aldous.root=wrap}
// the two great creatures
function hgdGiant(g,root){khNpc(g.id,g.name,g.img,root,{q:g.id==='hgd_moth'?['dh2']:['dh3']})}
hgdGiant(HGD.MOTH,()=>{
  const F=G.flags;
  if(qSt('dh1')===null)return say('A moth the size of a house hangs from the roof of the plaza, wings folded. It watches you with one huge dull eye and says nothing you can use. It is waiting for someone to ask the right question.',[BYE]);
  if(qSt('dh1')==='active'){F.hgdMoth=1;qTurnIn('dh1');return say('"So the wizard sent you." The great moth\'s voice is a dry whisper, like paper. "I am Lilac. I am old, and I am sick. The corruption is in the air I breathe. I can find your gate, little ones, but I have not the strength to fly so far. Bring me six jars of royal jelly, from the hives, and I will tell you which of the flying giants can find it."',[['We will bring the jelly.',()=>null]])}
  if(qSt('dh2')==='active'||qSt('dh2')==='done')return qNode('dh2',hgdO('','Thank you.','Royal jelly! Six jars. Oh, that is better. That is much better. Let me breathe a while.','Now listen. The gate is under the bell tower of Nibb, in the north, sealed since the first king. Bulb, the great whale who drifts over Nibb, can find it from above, and she is strong enough to carry you down. Tell her Lilac sent you. And be quick: the corruption grows each day.','Fly well, little ones. Bulb is waiting in Nibb.'));
  return say('The great moth breathes slowly. "Go to Bulb, in Nibb."',[BYE])});
hgdGiant(HGD.WHALE,()=>{
  const F=G.flags;
  if(qSt('dh2')!=='done')return say('A great pale whale as big as a house drifts above the plaza on a bulb of warm light, trailing glowing fins. She looks at you gently and does not speak. Perhaps she is waiting for a word from Old Lilac, in Glorm.',[BYE]);
  if(qSt('dh3')==='done'||F.hgdCarry)return say('"Climb on, little ones. Hold the fin and do not look down." Bulb\'s voice is a warm hum. "The gate is open now. Shall I carry you?"',[['Carry us down.',()=>{F.hgdCarry=1;hgdGo();return null}],['Not yet.',()=>null]]);
  return qNode('dh3',hgdO('"Lilac sent you. Good." The great whale hums low. "I can find the gate, and I can carry you down, but the creatures of the hives are thick around it, and I cannot fly through them. Kill eight of them. Any creature of the hives will do. Then come back and I will take you."','"Then I will wait here. Do not take long."','"Eight! Yes. The air is clearer already. Now: climb onto my back."','Bulb rolls slowly in the air, and her fin settles on the ground like a stair. "Hold on. Do not look down."','"The gate is open. Climb on whenever you like."'));
});
// the whale's carry: a short flight, then the first stretch of the deeper lands
function hgdGo(){
  msg('Bulb lifts the party off the ground, higher than the towers, and flies north to the old gate beneath the bell tower. It swings open on its own.','#e8a8ff');
  later(900,()=>{try{hgdBuild()}catch(e){console.error(e)}goToLevel(HGD.ID,{x:LEVELS[HGD.ID].start.x,y:LEVELS[HGD.ID].start.y,f:0});msg('The air is thick and sweet here, and the walls are black with something that moves.','#e8a8ff')})}
// the whale also offers the ride once the quests are done, even when she is met again
/* ---------- the first stretch of the deeper lands ---------- */
khNpc('hgd_plaque','A plaque','gate',()=>say('THE DEEPER HOLLOW. The road goes on further down. Below the Abbey is in early access, and this is where it ends for now. Thank you for playing.',[BYE]));
function hgdBuild(){
  if(LEVELS[HGD.ID])return;hgWaxTex();
  const W=46,H=70,sd=HGD.ID*13+3,hs=hash2,g=[];for(let y=0;y<H;y++)g.push(new Array(W).fill('#'));
  OH_STY.hgdeep=Object.assign({},OH_STY.castle2||OH_STY.gold,{plain:'hg_wax',door:'hg_wax',win:'hg_wax',alt:'hg_wax',zoom:1,contrast:1.05,tint:[70,30,110,150]});
  const TM=ohTiles(),wall=TM.make('plain','hgdeep',2.7).gid,door=String.fromCharCode(0x2f1),dgid=KH_NEXT_GID++;T_TILE[dgid]=wdExitTile(2.7,'cave',[200,120,255]);KH_DOOR[dgid]={lvl:HG.ID,at:{x:HG.START.x,y:HG.START.y,f:0}};
  const chars={'#':wall};chars[door]=dgid;
  const nodes=[];const nC=8;for(let i=0;i<nC;i++){const sw=i%2?1:-1;nodes.push({x:Math.round(W/2+sw*(5+hs(i,1,sd)*7)),y:H-9-i*8,r:i===nC-1?6.5:3.4+hs(i,2,sd)*2.2})}
  nodes[0].x=W>>1;
  for(const n of nodes)for(let y=Math.floor(n.y-n.r);y<=n.y+n.r;y++)for(let x=Math.floor(n.x-n.r);x<=n.x+n.r;x++)if(x>1&&y>1&&x<W-2&&y<H-2&&Math.hypot(x-n.x,y-n.y)<=n.r)g[y][x]='.';
  for(let i=1;i<nodes.length;i++){const a=nodes[i-1],b=nodes[i];let x=a.x,y=a.y;while(x!==b.x||y!==b.y){if(y!==b.y&&(x===b.x||hs(x,y,sd+3)<.6))y+=Math.sign(b.y-y);else x+=Math.sign(b.x-x);for(const [ox,oy] of [[0,0],[1,0],[0,1],[1,1]]){const xx=x+ox,yy=y+oy;if(xx>1&&yy>1&&xx<W-2&&yy<H-2)g[yy][xx]='.'}}}
  const sx=nodes[0].x,sy=nodes[0].y+Math.ceil(nodes[0].r);let doorY=sy;while(g[doorY+1]&&g[doorY+1][sx]==='.')doorY++;g[doorY+1][sx]=door;
  const used=new Set([sx+','+doorY]),cells=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(g[y][x]==='.'&&Math.hypot(x-sx,y-doorY)>6)cells.push([x,y]);
  const pick=k=>{for(let t=0;t<80;t++){const c=cells[(hs(k,t,sd+4)*cells.length)|0];if(c&&!used.has(c[0]+','+c[1])){used.add(c[0]+','+c[1]);return c}}return null};
  const boss=nodes[nC-1],enemies=[],items=[],decor=[],lights=nodes.map(n=>[n.x,n.y]);
  const kinds=['hgdgrub','hgdguard','hgdgrub','hgdswarm','hgdgolem'];
  for(let k=0;k<30;k++){const c=pick(100+k);if(c&&Math.hypot(c[0]-boss.x,c[1]-boss.y)>boss.r+1)enemies.push({t:kinds[(hs(k,5,sd+5)*kinds.length)|0],x:c[0],y:c[1]})}
  enemies.push({t:'hgdwarden',x:boss.x,y:boss.y+1});
  const kp=KH_KEEPERS.hgd_plaque;if(kp)decor.push({k:khFaceKey(kp.face),x:boss.x,y:boss.y-3,block:false,walk:true,npc:'hgd_plaque',sc:1});
  for(let k=0;k<10;k++){const c=pick(300+k);if(c)items.push({k:['hgjelly','hgcomb','potion3','hggrubs'][k%4],x:c[0],y:c[1]})}
  for(let k=0;k<14;k++){const c=pick(400+k);if(c)decor.push({k:'hg_eggs',x:c[0],y:c[1],block:true,sc:.7+hs(k,3,sd+7)*.4})}
  LEVELS[HGD.ID]={rows:g.map(r=>r.join('')),start:{x:sx,y:doorY-1,f:0},enemies,items,decor,chars,day:0,floor:'wood',name:'The Deeper Hollow',label:'The Deeper Hollow',diff:HGD.DIFF,ceilH:2.7,torchGap:1e9,noTele:true,portals:[],lights,
    mapNames:[{t:'The Deeper Hollow',x:sx,y:H-1,k:'place'},{t:'The Black Hall',x:boss.x,y:boss.y-5,k:'place'}]};
}
KH_LAZY[HGD.ID]=()=>{hgBuild();hgdBuild()};
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||n===HGD.ID}}
/* ---------- the two great creatures stand in the plazas of Glorm and Nibb ---------- */
function hgdPlace(){
  const n=LEVEL,G0=n===HGD.MOTH.lvl?HGD.MOTH:n===HGD.WHALE.lvl?HGD.WHALE:null;if(!G0)return;
  const L=LEVELS[n];if(!L||L._hgdDone||!L.terrace||!L.decor)return;L._hgdDone=1;
  const W=L.rows[0].length,h=L.terrace.h,occ=new Set(L.decor.map(d=>Math.floor(d.x)+','+Math.floor(d.y))),st=L.start||{x:W>>1,y:L.rows.length>>1};
  const flatAt=(x,y)=>{if(x<2||y<2||x>=W-2||y>=L.rows.length-2||L.rows[y][x]!=='.'||occ.has(x+','+y)||Math.hypot(x-st.x,y-st.y)<3)return false;if(typeof hgtnBlocked==='function'&&hgtnBlocked(L,x,y))return false;
    for(const [ax,ay] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+ax,ny=y+ay;if(L.rows[ny][nx]!=='.'||Math.abs(h[ny*W+nx]-h[y*W+x])>.01)return false}return true};
  const sx=Math.round(st.x)-4,sy=Math.round(st.y)+(n===483?5:-5);let best=null;
  for(let r=0;r<24&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r&&!best;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(flatAt(sx+dx,sy+dy))best=[sx+dx,sy+dy]}
  if(!best)return;const d={k:G0.img,x:best[0],y:best[1],block:true,npc:G0.id,sc:2.4,bob:.35};
  L.decor.push(d);if(G.decor&&G.decor!==L.decor)G.decor.push(d);if(typeof buildDecorMap==='function')buildDecorMap()}
{const _u4=update;update=function(dt){try{if(G.state==='play')hgdPlace()}catch(e){console.error('hgd',e)}return _u4.apply(this,arguments)}}
