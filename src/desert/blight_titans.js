/* ==========================================================================
   THE SIX GIANTS OF THE BLIGHTED ROAD (prefix tt / TT). Six huge, deformed bosses of level 100 wander the road between Wenlock and Sale. Each stands in one of the road's places
   (not Lanternrest, the safe fort) and, as game time passes, walks on to a neighbouring place. They show on the world map (a red mark on the place where each one is) and on the
   mini map (a big pulsing ring, from far off). Slower than the party; one that notices the party chases, and loses it again if the party gets far enough away. People of the road talk
   about them in terror (an extra question on many of their talk screens); Captain Marsh of Lanternrest pays a great reward for all six.
   State: G.flags.tt = {at:{tt0:placeNumber,...}, dead:{tt0:1,...}, t:game minutes at the last hop}. Pictures: stand-ins made from the graveyard's giants until painted pieces arrive
   (assets/tt/, art_tt0..4 if present).
   ========================================================================== */
const TT={
  list:[
    {id:'tt0',n:'Gorsemaw the Many-Mouthed',ph:4.2,verb:'swallows',src:'gyi_giant',wide:1.55,tall:1.0,fx:'hue-rotate(70deg) saturate(1.4) brightness(.78)',
     look:'a bloated giant, as tall as a church tower, with a dozen wet mouths down his belly that all talk at once',rumour:'Gorsemaw. He is as tall as the church tower and he has mouths all down his belly. They are all talking, all the time. I could not tell you what they say, and I would not want to.'},
    {id:'tt1',n:'Mother Sallowtide',ph:5.0,src:'gyi_ghoul',wide:.85,tall:1.3,fx:'hue-rotate(165deg) saturate(.8) brightness(.9)',verb:'drowns',
     look:'a drowned giantess, swollen and blue, dripping, with arms that drag on the ground',rumour:'Mother Sallowtide. You hear her before you see her, because she drips. She is a drowned woman as big as a barn, and she holds you under until you stop. Stay out of the low ground.'},
    {id:'tt2',n:'Hobb Crookspine',ph:4.6,src:'gyi_zombie',wide:1.1,tall:1.0,skew:-.38,fx:'sepia(.7) saturate(1.2) brightness(.7)',verb:'hooks',
     look:'a giant bent double by a spine like a gallows hook, with an iron cage swinging on his back',rumour:'Hobb Crookspine. His back grew into a hook, and he carries a gibbet cage on it, and there is always someone in the cage. I do not want to know whether it is a new one each time.'},
    {id:'tt3',n:'Brannock the Stitched',ph:4.4,src:'gyi_giant',wide:1.2,tall:1.05,split:1,fx:'grayscale(.6) brightness(.8)',verb:'pounds',
     look:'a giant sewn together out of many dead men, with mismatched arms and legs and thick black stitches',rumour:'Brannock. They say he is made of everyone who ever tried to stop the plague. You can see the seams. I saw a face on his shoulder that I knew.'},
    {id:'tt4',n:'Old Nine-Hands',ph:4.8,src:'gyi_zombie',wide:1.3,tall:1.1,arms:1,fx:'grayscale(.5) hue-rotate(310deg) saturate(1.6) brightness(.65)',verb:'rakes',
     look:'a gaunt giant with nine long arms that never stop reaching, and no face at all',rumour:'Old Nine-Hands. Nine arms, and not one of them is ever still. He feels for you in the dark. He has no face, so he cannot be reasoned with, and I have tried.'},
    {id:'tt5',n:'Old White Eyes',ph:4.4,src:'gyi_giant',wide:1.6,tall:1.0,eyes:1,fx:'grayscale(.6) brightness(1.05) contrast(.9)',verb:'smothers',
     look:'a huge, bloated, ancient monster with a pale swollen body and two blank milky white eyes',rumour:'Old White Eyes. A huge swollen thing, pale as a drowned man, with two blank white eyes like boiled eggs. He cannot see you, they say, and he does not need to. You hear him wheezing before anything, and then the fog goes cold. Keep quiet and keep walking.'}],
  path:[1,2,3,4,5,7,8,9,10],            // the places a giant can stand in, in road order (6 is Lanternrest: never)
  hopMin:240,                            // game minutes between steps
  gossip:[
    'Do not go out on the road after dark. The giants walk it. There are six of them, and I have seen three, and I would not say that it was luck.',
    'The giants. Have you seen them? Of course you have not, or you would not be asking. Look for the ring on your little map. If it is near, go the other way, and do not run, they like that.',
    'They are slow. That is the only mercy. A giant cannot catch a man who keeps walking, but a man cannot keep walking for ever, and they know it.',
    'My brother went out to the milestone to fetch a cart wheel. We found the wheel.',
    'I have lived here all my life and I never saw a thing as tall as a tree walk, until the blight. Now I see six of them. Six! And everyone pretends the road is only dangerous.',
    'They keep to the open road, mostly. Indoors you are safe, as far as I know. As far as I know, nobody has ever tested it twice.']};
for(const t of TT.list){TT[t.id]=t}
Object.assign(ENEMY_DEF,Object.fromEntries(TT.list.map((t,i)=>[t.id,{name:t.n,hp:1150+i*60,dmg:[19+i,30+i*2],hit:.86,w:3.2,img:'art_'+t.id,xp:3400+i*200,gold:[6500+i*500,9500+i*600],speed:1,verb:t.verb,boss:true,tt:1,aboveParty:0,dropMagic:1}])));
if(typeof NO_VARY!=='undefined')for(const t of TT.list)NO_VARY.push(t.id);
const ttPlaceOf=lv=>{const p=typeof BL_ROAD!=='undefined'&&BL_ROAD.find(q=>q.id===lv);return p?p.n:0};
function ttF(){const F=G.flags;if(!F.tt)F.tt={at:{tt0:2,tt1:4,tt2:5,tt3:8,tt4:9,tt5:3},dead:{},t:G.clock||0};if(!F.tt.at)F.tt.at={};if(F.tt.at.tt5===undefined)F.tt.at.tt5=3;if(!F.tt.dead)F.tt.dead={};return F.tt}
/* the giants walk on: one chance in two every four game hours, one place along the road (never the party's own place, and never Lanternrest) */
function ttSync(skipN){
  const F=ttF(),steps=Math.min(30,Math.floor(((G.clock||0)-F.t)/TT.hopMin));if(steps<1){if(((G.clock||0)-F.t)<0)F.t=G.clock||0;return}
  F.t+=steps*TT.hopMin;
  for(let s=0;s<steps;s++)for(const t of TT.list){if(F.dead[t.id])continue;const n=F.at[t.id]||2;if(n===skipN)continue;
    if(Math.random()<.5){const i=Math.max(0,TT.path.indexOf(n)),j=Math.max(0,Math.min(TT.path.length-1,i+(Math.random()<.5?-1:1)));if(TT.path[j]!==skipN)F.at[t.id]=TT.path[j]}}}
/* the pictures: until painted ones arrive, deformed copies of the graveyard's giants (stretched, bent, stitched, many-armed) */
/* painted pieces: assets/tt/tt0.webp .. tt4.webp (straight on, full height) replace the stand-ins when they exist */
function ttLoadPainted(){
  if(TT._painted)return;TT._painted=1;
  for(const t of TT.list){const im=new Image();im.onload=()=>{IMG['art_'+t.id]=im;IMG['art_'+t.id]._painted=1;NPC_H['art_'+t.id]=t.ph;ENEMY_DEF[t.id].w=+(t.ph*im.width/im.height).toFixed(2)};im.onerror=()=>{};im.src='assets/tt/'+t.id+'.webp?v='+VERSION}}
function ttArt(){
  ttLoadPainted();
  if(TT._art)return;const need=TT.list.filter(t=>!IMG['art_'+t.id]);   // a painted piece that has loaded is never replaced
  for(const t of need){
    const s=IMG[t.src]||IMG.gyi_giant||IMG.gyi_zombie;if(!s||!s.width)continue;
    const W=Math.round(s.width*t.wide*(t.arms?1.7:1)+(t.skew?Math.abs(t.skew)*s.height:0)),H=Math.round(s.height*t.tall),c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
    try{x.filter=t.fx}catch(e){}
    const dw=s.width*t.wide,pad=(W-dw)/2;
    if(t.arms){for(const [ang,sc,dx] of [[-.5,.9,-.28],[.5,.9,.28],[-.28,.96,-.15],[.28,.96,.15]]){x.save();x.translate(W/2+dx*W*.3,H);x.rotate(ang*.5);x.globalAlpha=.8;x.drawImage(s,-dw*sc/2,-H*sc,dw*sc,H*sc);x.restore()}x.globalAlpha=1;x.drawImage(s,pad,0,dw,H)}
    else if(t.split){x.drawImage(s,0,0,s.width/2,s.height,pad,0,dw/2,H);try{x.filter='hue-rotate(150deg) saturate(.9) brightness(.9)'}catch(e){}x.drawImage(s,s.width/2,0,s.width/2,s.height,pad+dw/2,0,dw/2,H);try{x.filter='none'}catch(e){}x.strokeStyle='#10080a';x.lineWidth=3;x.beginPath();for(let y=6;y<H-8;y+=14){x.moveTo(W/2-4,y);x.lineTo(W/2+4,y+5)}x.stroke()}
    else if(t.skew){x.setTransform(1,0,t.skew,1,t.skew<0?-t.skew*H:0,0);x.drawImage(s,pad,0,dw,H)}
    else x.drawImage(s,pad,0,dw,H);
    x.setTransform(1,0,0,1,0,0);try{x.filter='none'}catch(e){}
    if(t.eyes){x.fillStyle='#f4f4ee';x.shadowColor='#ffffff';x.shadowBlur=6;for(const ex of [.43,.57]){x.beginPath();x.ellipse(W*ex,H*.13,W*.026,H*.012,0,0,6.3);x.fill()}x.shadowBlur=0}
    if(t.id==='tt0'){x.fillStyle='#2a0608';x.strokeStyle='#d89a8a';x.lineWidth=1.4;for(let k=0;k<9;k++){const px=W*(.32+.36*((k*37)%10)/10),py=H*(.42+.34*((k*53)%10)/10);x.beginPath();x.ellipse(px,py,W*.035,H*.02,0,0,6.3);x.fill();x.stroke()}}
    IMG['art_'+t.id]=c;NPC_H['art_'+t.id]=t.ph;ENEMY_DEF[t.id].w=+(t.ph*W/H).toFixed(2)}
  TT._art=TT.list.every(t=>IMG['art_'+t.id])}
/* a giant stands in a place: placed when its map is built, far from the arrival square */
function ttPlace(){
  const n=ttPlaceOf(LEVEL);if(!n||n===6||!BL_ROAD.find(q=>q.id===LEVEL))return;
  ttSync(n);const F=ttF();ttArt();
  const here=TT.list.filter(t=>!F.dead[t.id]&&F.at[t.id]===n);if(!here.length)return;
  const cells=wReach(G.P.x,G.P.y,90).filter(c=>c[2]>=24&&c[2]<=80),taken=[];if(cells.length<10)return;
  for(const t of here){let pick=null;for(let k=0;k<200&&!pick;k++){const c=cells[(Math.random()*cells.length)|0];if(taken.every(q=>Math.hypot(q[0]-c[0],q[1]-c[1])>=14))pick=c}
    if(!pick)continue;taken.push(pick);const st=enemyStat(t.id,100);
    G.enemies.push({id:G.enemies.length,t:t.id,lvl:100,x:pick[0],y:pick[1],rx:pick[0],ry:pick[1],hx:pick[0],hy:pick[1],hp:st.hp,maxhp:st.hp,alert:false,chilled:0,flash:0,lunge:0,dying:0,seed:Math.random()*10,sx:210,sy:100})}}
{const _pt=placeTeleporter;placeTeleporter=function(){_pt.apply(this,arguments);try{ttPlace()}catch(e){console.error('tt place',e)}}}
/* the way of these creatures: they wander slowly, notice the party only when close, chase slower than the party walks, and give up when left behind */
{const _ea=enemyAct;enemyAct=function(e){
  const def=ENEMY_DEF[e.t];if(!def||!def.tt||e.chilled>0)return _ea.apply(this,arguments);
  const dist=Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y);if(e.hx===undefined){e.hx=e.x;e.hy=e.y}
  if(!e.alert){
    if(dist<=6&&(hasLOS(e.x,e.y,G.P.x,G.P.y)||dist<=3)){e.alert=true;sfx('growl');msg('The '+def.name+' has noticed you!','#ff7a6a');return 200}
    if(G.rounds%2)return 0;
    const opts=DIRS.map(d=>[e.x+d[0],e.y+d[1]]).filter(([x,y])=>!cellBlocked(x,y)&&!enemyAt(x,y)&&!(x===G.P.x&&y===G.P.y)&&Math.hypot(x-e.hx,y-e.hy)<=42);
    if(!opts.length)return 0;
    let pick=null;if(e.pv){const sx=e.x+e.pv[0],sy=e.y+e.pv[1];if(opts.some(o=>o[0]===sx&&o[1]===sy)&&Math.random()<.88)pick=[sx,sy]}
    if(!pick)pick=opts[(Math.random()*opts.length)|0];e.pv=[pick[0]-e.x,pick[1]-e.y];e.x=pick[0];e.y=pick[1];return dist<=14?150:0}
  if(dist>11){e.alert=false;e.pv=null;return 0}
  if(dist>1&&(G.rounds+e.id)%3===0)return 0;
  return _ea.apply(this,arguments)}}
/* the mini map: a big pulsing red ring over each giant, from far off */
{const _m=drawMinimap;drawMinimap=function(x,y,w,h){_m.apply(this,arguments);
  try{if(G.state==='play'&&ttPlaceOf(LEVEL)&&ttPlaceOf(LEVEL)!==6){const cs=4.6*MMZ(),ox=x+w/2-(G.C.x+.5)*cs,oy=y+h/2-(G.C.y+.5)*cs,pl=.5+.5*Math.sin(G.time*4);
    ctx.save();ctx.beginPath();ctx.rect(x+2,y+2,w-4,h-4);ctx.clip();
    for(const e of G.enemies){const def=ENEMY_DEF[e.t];if(e.hp<=0||!def||!def.tt)continue;
      const px=ox+(e.rx+.5)*cs,py=oy+(e.ry+.5)*cs;if(px<x-10||px>x+w+10||py<y-10||py>y+h+10)continue;
      ctx.fillStyle='rgba(150,16,24,'+(.55+.25*pl)+')';ctx.strokeStyle='#ffd0c0';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(px,py,cs*(1.5+.25*pl),0,TAU);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#1c0406';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(px,py,cs*.7,0,TAU);ctx.stroke();ctx.fillStyle='#1c0406';ctx.fillRect(px-cs*.2,py-cs*.55,cs*.4,cs*1.1)}
    ctx.restore()}}catch(e){}}}
/* the world map: each living giant is marked on the place where it stands (its picture, small, on a red glow) */
{const _wc=mpWorldCreatures;mpWorldCreatures=function(V,z){_wc.apply(this,arguments);try{ttMapMarks(V,z)}catch(e){}}}
function ttMapMarks(V,z){
  if(typeof WMB_ROAD==='undefined')return;ttSync(ttPlaceOf(LEVEL));ttArt();const F=ttF(),c=ctx,byPlace={};
  for(const t of TT.list){if(F.dead[t.id])continue;const n=F.at[t.id];(byPlace[n]=byPlace[n]||[]).push(t)}
  for(const n in byPlace){const loc=WORLD_LOCS.find(l=>l.k===WMB_ROAD[+n]);if(!loc)continue;const list=byPlace[n],pl=.5+.5*Math.sin(G.time*3);
    list.forEach((t,i)=>{const mx=loc.x+(i-(list.length-1)/2)*9,my=loc.y-20,im=IMG['art_'+t.id],h=10;
      c.save();c.fillStyle='rgba(176,24,30,'+(.28+.2*pl)+')';c.beginPath();c.arc(mx,my-h*.4,h*.6+pl*1.2,0,TAU);c.fill();c.strokeStyle='#5a0a0e';c.lineWidth=1.1;c.stroke();
      if(im&&im.width){const w=h*im.width/im.height;c.shadowColor='rgba(60,0,4,.8)';c.shadowBlur=3;c.drawImage(im,mx-w/2,my-h,w,h)}else{c.fillStyle='#3a0808';c.fillRect(mx-3,my-h,6,h)}
      if(z>=1.6){c.font='italic bold 4px '+FUI;c.textAlign='center';c.textBaseline='middle';c.lineJoin='round';c.lineWidth=1.8;c.strokeStyle='rgba(238,226,190,.95)';c.strokeText(t.n,mx,my+4);c.fillStyle='#6a0c10';c.fillText(t.n,mx,my+4)}
      c.restore()})}}
/* killing one */
{const _he=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;_he.apply(this,arguments);
  if(was&&e.hp<=0&&ENEMY_DEF[e.t]&&ENEMY_DEF[e.t].tt){const F=ttF();F.dead[e.t]=1;const left=TT.list.filter(t=>!F.dead[t.id]).length;
    try{msg(ENEMY_DEF[e.t].name+' falls, and the ground shakes. '+(left?left+' of the six giants still walk the road.':'The last of the six giants is dead.'),'#ffb070');sfx('win')}catch(x){}}}}
/* the talk of the road: an extra question on the people's screens, and Captain Marsh's reward for all six */
QUESTS.ttgiants={title:'The Six Giants',who:'Captain Eldred Marsh',desc:'Six huge, deformed giants walk the Blighted Road: Gorsemaw the Many-Mouthed, Mother Sallowtide, Hobb Crookspine, Brannock the Stitched, Old Nine-Hands and Old White Eyes. They show as red marks on the world map and as big red rings on the mini map. Kill all six. Each is level 100.',need:6,goal:()=>Object.keys(ttF().dead).length,reward:{gold:40000,xp:600000}};
QAREA.ttgiants='The Blighted Lands';
function ttMarshQ(){
  const F=ttF();
  return qNode('ttgiants',{offer:'There are six of them, Captain Marsh says, and he counts them on his fingers, and has to start again twice. "Gorsemaw. Sallowtide. Crookspine. Brannock. Old Nine-Hands. And one they call Old White Eyes, who wheezes. Each is the height of a tower and a good deal worse to look at. My scouts do not come back from them. I am told you are a fighting party. Kill all six, and the king will hear of it, and I will pay what the garrison chest can bear, which is more than it ought."',
    accept:'The giants shift along the road as the days go by. Watch the red marks on the world map, and the red rings on your mini map. They are slower than you. Never stand and trade blows unless you must.',
    remind:(g,nn)=>QUESTS.ttgiants.desc+' ('+g+' of '+nn+' dead.)',ready:'All six. All six! I will have to start the count again, because I cannot believe it.',thanks:'The road is a little less terrible. Take this, with the garrison’s thanks.',after:'The road is quiet. Quieter than it has been for years. I do not trust it, but I thank you for it.'})}
function ttAddRumour(id){
  const keep=KH_KEEPERS[id],np=NPCS[id];if(!keep||!keep.root)return;const root=keep.root;if(root._tt)return;
  let h=0;for(const ch of id)h=(h*31+ch.charCodeAt(0))>>>0;const own=TT.list[h%TT.list.length],line=TT.gossip[h%TT.gossip.length];
  const w=function(){const n=root.apply(this,arguments);try{
    if(n&&Array.isArray(n.opts)&&!n.pages&&n.opts.length<6){
      const q=id==='blr_marsh'?['The giants on the road',()=>ttMarshQ()]:['What do you know about the giants?',()=>{const F=ttF();return say(line+' '+(F.dead[own.id]?'': '"'+own.rumour+'"'),[BYE])}];
      n.opts=n.opts.filter(o=>o!==BYE);n.opts.push(q);n.opts.push(BYE)}}catch(e){}return n};
  w._tt=1;keep.root=w;if(np)np.root=w}
{const NOTPERSON=/(table|desk|ledger|log|book|board|slate|husband|diary|slip|note|map|sign|bell|rope|wagon|tent|bench|stocks|stew|dummy|beacon|spyglass|ladder|stair|lever|sack|thimble|nest|wheel|pond|bridge|scarecrow|statue|stone|wall|ballista|toll bar|glove|camp|mirror|coffin|rune|altar|barrow|banner|chapel|cage|shelf|cabinet|memorial|candle|dormitory|infirmary|foundry|lodge|rule|kitchen|tower|ruin|grave|shrine|tree|pauper|niche|well|earth|lean-to|lantern|nets|orders|scratches|post)/i;
  for(const id in KH_KEEPERS){const nm=(KH_KEEPERS[id].name||'');
    const ok=/^(blt|bla|blc|blg|blh|blr|blp|vto)_/.test(id)?(!/^(A|An|The)\s/.test(nm)&&!NOTPERSON.test(nm)&&!/(maldrake|hesper|speaker|queen|rook|knight)/i.test(id+nm)):/^sa_(k_|g_|reg|inn_g)/.test(id);
    if(ok)try{ttAddRumour(id)}catch(e){console.error('tt rumour',id,e)}}
  try{ttAddRumour('blr_marsh')}catch(e){}}
if(typeof HGDP_GOSS!=='undefined')HGDP_GOSS.push('Six giants walk the Blighted Road. They show on the world map and the mini map as red marks.');
