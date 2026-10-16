/* ==========================================================================
   THE HAUNTING OF THE ORANGE TOWER, second part. The level plaques, claw marks and relic icons are painted pictures; the witch strobes the lights;
   a bogeyman waits behind the party whenever it looks into a mirror; some walls are hidden doors that open when the party walks into them (and the
   map shows them); the chests hold real treasure; and the castle has its own hand-drawn map.
   ========================================================================== */
for(let n=1;n<=20;n++){loadImg('hl_plq'+n,'assets/hl_plq'+n+'.png');NPC_H['hl_plq'+n]=1.2}
for(let n=0;n<6;n++){loadImg('hl_claw'+n,'assets/hl_claw'+n+'.png');NPC_H['hl_claw'+n]=.62}
for(let n=0;n<3;n++)loadImg('hl_lever'+n,'assets/hl_lever'+n+'.png'); // the wooden lever: off, halfway, on
loadImg('hl_bogey','assets/hl_bogey.png');loadImg('hl_bogeyA','assets/hl_bogeyA.png');NPC_H.hl_bogey=1.9;
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('crownbreaker','veilpiercer','dukesgavel','hollowscepter'); // their pictures are painted (assets/icn_<id>.png)
const hlIn=()=>LEVEL>=HL.BASE&&LEVEL<HL.BASE+HL.N;

/* ---- treasure: the chests of the castle hold potions, gear, rings and gold, more of it the higher the level ---- */
function hlLootFor(d){
  if(d.k!=='chest'||!hlIn())return null;
  if(d.secret){ // the hidden rooms hold moderate weapons, around the level of the party, never elite
    const plvl=Math.round(G.heroes.reduce((n,h)=>n+h.lvl,0)/Math.max(1,G.heroes.length)),r2=i=>hash2(d.x,d.y,500+i+LEVEL),it2=[];
    let pool=(typeof GEAR!=='undefined'?GEAR:[]).filter(id=>{const t=ITEMDEF[id];return t&&t.k==='weapon'&&t.lvl&&t.lvl<=plvl&&t.lvl>=plvl-9&&!t.rar});
    if(!pool.length)pool=(typeof GEAR!=='undefined'?GEAR:[]).filter(id=>{const t=ITEMDEF[id];return t&&t.k==='weapon'&&t.lvl&&t.lvl<=plvl});
    const types=[...new Set(pool.map(id=>ITEMDEF[id].t))].sort((a,b)=>r2(a.length)-r2(b.length));
    for(const ty of types.slice(0,3)){const c=pool.filter(id=>ITEMDEF[id].t===ty);it2.push({id:c[Math.floor(r2(c.length+ty.length)*c.length)],n:1})}
    for(const id of ['superiorheal','greatermana']){if(ITEMDEF[id])it2.push({id,n:1})}
    it2.push({id:['ringV','ringW','ringS','ringM'][Math.floor(r2(7)*4)],n:1});
    d.gold=150+(LEVEL-HL.BASE)*40+Math.floor(r2(9)*120);return it2}
  const k=LEVEL-HL.BASE,r=i=>hash2(d.x,d.y,300+i+LEVEL*3),items=[],add=(id,n)=>{if(ITEMDEF[id])items.push({id,n:ITEMDEF[id].stack?(n||1):1})};
  const pots=['healdraught','greaterheal','superiorheal','elixir','manadraught','greatermana','supermana'];
  const pick=(a,i)=>a[Math.floor(r(i)*a.length)];
  const hi=Math.min(pots.length-1,2+((k/4)|0));
  for(let q=0;q<3;q++)add(pots[Math.min(hi,Math.floor(r(q)*(hi+1)))],1+(r(q+9)<.4?1:0));
  // gear: something for each level, from the shop tiers (the chest at the top holds the best)
  const gear=(typeof GEAR!=='undefined'?GEAR:[]).filter(id=>ITEMDEF[id]&&ITEMDEF[id].tier&&ITEMDEF[id].tier>=25+k&&ITEMDEF[id].tier<=40+k*1.5);
  if(gear.length){add(pick(gear,20));if(r(21)<.5+k/40)add(pick(gear,22))}
  add(pick(['ringV','ringW','ringS','ringM'],30));
  add(foodFor?foodFor(r(31)):'bread',2);
  d.gold=200+k*55+Math.floor(r(40)*180);
  return items;
}

/* ---- hidden doors ---- */
function secretBump(nx,ny){
  const TS_=G.hlTrap;if(TS_&&TS_.lv===LEVEL&&TS_.st>=1&&TS_.st<7&&TS_.sealed.some(q=>q[0]===nx&&q[1]===ny)){sfx('locked');msg('Solid stone. There is no door here.','#d09a80');return true}
  const L=LEVELS[LEVEL];if(!L||!L._secrets||!hlIn())return false;
  const s=L._secrets.find(q=>q.x===nx&&q.y===ny);if(!s)return false;
  const F=HLF();F.sec=F.sec||{};const key=LEVEL+':'+nx+','+ny;if(F.sec[key])return false;
  F.sec[key]=1;G.grid[ny][nx]=0;sfx('door');G.shake=.3;msg('The wall gives way. A hidden door grinds open.','#ffe9a0');return true;
}

/* ---- the frame: opened secrets stay open, the witch's strobe, the bogeyman in the mirror, the jump scare ---- */
function hlMirrorImg(){
  if(IMG.hl_p_mirror_b)return true;const m=IMG.hl_p_mirror,b=IMG.hl_bogey;if(!m||!b)return false;
  const c=document.createElement('canvas');c.width=m.width;c.height=m.height;const x=c.getContext('2d');x.drawImage(m,0,0);
  // the glass shows a tall figure standing behind the viewer: a pale outline of the bogeyman, and two small white eyes
  const fh=c.height*.7,fw=fh*b.width/b.height,fx=(c.width-fw)/2,fy=c.height*.16;
  const t=document.createElement('canvas');t.width=Math.ceil(fw);t.height=Math.ceil(fh);const tx=t.getContext('2d');tx.drawImage(b,0,0,fw,fh);tx.globalCompositeOperation='source-in';tx.fillStyle='#c2b8e8';tx.fillRect(0,0,fw,fh);
  x.globalCompositeOperation='lighter';x.globalAlpha=.62;x.drawImage(t,fx,fy);x.globalAlpha=1;x.globalCompositeOperation='source-over';
  x.fillStyle='rgba(255,255,255,1)';x.shadowColor='rgba(210,225,255,1)';x.shadowBlur=10;for(const ex of [.455,.545]){x.beginPath();x.arc(fx+fw*ex,fy+fh*.115,Math.max(2.4,c.width*.02),0,TAU);x.fill()}
  IMG.hl_p_mirror_b=c;return true;
}
khNpc('hl_shelfdoor','A bookshelf','hl_p_shelf',d=>{
  if(d.pulled)return say('The shelf has swung aside, and a small room waits behind it.',[BYE]);
  return say('A tall bookshelf, dusty and crowded. One book sits a little out of line: a red spine with no title.',[['Pull the red book.',()=>{hlShelfOpen(d);return null}],['Leave it.',()=>null]])});
function hlShelfOpen(d){const F=HLF();F.sec=F.sec||{};F.sec['sh'+LEVEL+':'+d.x+','+d.y]=1;d.pulled=true;d.found=true;for(const [x,y] of d.opens||[])if(G.grid[y]&&G.grid[y][x]>0)G.grid[y][x]=0;
  sfx('door');G.shake=.3;msg('The bookshelf swings aside. A hidden room lies behind it.','#ffe9a0')}
function hlFrame(dt){
  if(G.state!=='play'||!hlIn())return;const L=LEVELS[LEVEL];
  // opened hidden doors stay open (the level is rebuilt each visit)
  {const F=HLF();if(F.sec&&L._secrets)for(const s of L._secrets)if(F.sec[LEVEL+':'+s.x+','+s.y]&&G.grid[s.y]&&G.grid[s.y][s.x]!==0)G.grid[s.y][s.x]=0}
  {const F=HLF();if(F.sec)for(const d of G.decor){if(d.npc==='hl_shelfdoor'&&!d.pulled&&F.sec['sh'+LEVEL+':'+d.x+','+d.y]){d.pulled=true;d.found=true;for(const [x,y] of d.opens||[])if(G.grid[y]&&G.grid[y][x]>0)G.grid[y][x]=0}}}
  // the rooms the party has been in (their names are scrambled on the map until then)
  {const F=HLF();F.seenRooms=F.seenRooms||{};(L._roomsInfo||[]).forEach((r,i)=>{if(G.P.x>=r.x0&&G.P.x<=r.x1&&G.P.y>=r.y0&&G.P.y<=r.y1)F.seenRooms[LEVEL+':'+i]=1})}
  // a lever or a picture on a wall that has opened (a hidden door, a secret chamber) goes with the wall
  for(const d of G.decor){if(d.found||!d.wd||!(d.pic||d.k==='lever'))continue;const wx=d.x+d.wd[0],wy=d.y+d.wd[1];if(G.grid[wy]&&G.grid[wy][wx]===0&&!(d.k==='lever'&&d.pullT&&G.time-d.pullT<.7))d.found=true}
  // the screaming witch makes the lights stutter on and off, quickly, while she is awake and near
  const wit=G.enemies.find(e=>e.t==='hlwitch'&&e.hp>0&&e.alert);
  if(wit&&Math.abs(wit.x-G.P.x)+Math.abs(wit.y-G.P.y)<=10){
    const out=hash2(Math.floor(G.time*9),LEVEL,17)>.42;if(out!==!!G.hlOut){hlLights(out);if(!out)G.hlFl=G.time}G.hlStrobe=true}
  else if(G.hlStrobe){G.hlStrobe=undefined;hlLights(false)}
  // the bogeyman
  const M=G.mir&&G.mir.lv===LEVEL?G.mir:(G.mir={lv:LEVEL,cool:0,act:null,last:null,scare:null});
  const v=DIRS[G.P.f];let look=null;
  if(!G.cut&&!G.talk&&!G.menu&&camSettled()){
    for(const d of G.decor){if(d.k!=='hl_p_mirror'||!d.wd||d.found)continue;if(d.wd[0]!==v[0]||d.wd[1]!==v[1])continue;
      const dx=d.x-G.P.x,dy=d.y-G.P.y,n=dx*v[0]+dy*v[1];if(n<0||n>3||dx*v[1]-dy*v[0]!==0)continue;
      let clear=true;for(let i=1;i<n;i++){const cx=G.P.x+v[0]*i,cy=G.P.y+v[1]*i;if(!G.grid[cy]||G.grid[cy][cx]!==0){clear=false;break}}
      if(clear){look=d;break}}
  }
  if(look!==M.last){M.last=look;
    if(look&&!M.act&&G.time>M.cool){
      if(Math.random()<.8&&hlMirrorImg()){ // eight times in ten, he is there
        const bx=G.P.x-v[0],by=G.P.y-v[1];
        if(G.grid[by]&&G.grid[by][bx]===0&&!enemyAt(bx,by)){
          look.lk='hl_p_mirror_b';const bog={k:'hl_bogey',x:bx,y:by,block:false,walk:true,deco:true,sc:1};G.decor.push(bog);
          M.act={d:look,t:G.time,f:G.P.f,bog,done:false};msg('In the mirror, behind your reflection, something tall is standing.','#c8b8e0');sfx('step')}}
      else M.cool=G.time+12}
  }
  if(M.act){const a=M.act,opp=(a.f+2)%4;
    if(!a.done&&G.P.f===opp&&camSettled()&&Math.abs(a.bog.x-G.P.x)+Math.abs(a.bog.y-G.P.y)<=3){ // the party turns round: he is right there
      a.done=true;M.scare={t:G.time};G.shake=.9;sfx('screech');sfx('hit');msg('THE BOGEYMAN IS RIGHT BEHIND YOU!','#ff6a5a');
      const l=hlLive();if(l.length&&Math.random()<.6){try{afflInflict('shaken',l[(Math.random()*l.length)|0],true)}catch(e){}}
      a.d.lk=null;a.bog.found=true;M.cool=G.time+25}
    else if(!a.done&&(G.time-a.t>16||Math.abs(a.d.x-G.P.x)+Math.abs(a.d.y-G.P.y)>9)){a.d.lk=null;a.bog.found=true;M.cool=G.time+15;a.done=true}
    if(a.done&&(!M.scare||G.time-M.scare.t>1.3))M.act=null}
}
/* the screen: the lightning flash when the witch's lights come back, and the bogeyman's jump scare, drawn over everything */
{const _ui3=ui;ui=function(dt){_ui3.apply(this,arguments);
  try{hlFrame(dt);
    if(G.state==='play'&&hlIn()){
      if(G.hlFl&&G.time-G.hlFl<.14){ctx.save();ctx.fillStyle='rgba(205,170,255,'+(.32*(1-(G.time-G.hlFl)/.14)).toFixed(3)+')';ctx.fillRect(0,0,DW,DH);ctx.restore()}
      const M=G.mir;if(M&&M.scare&&IMG.hl_bogeyA){const t=G.time-M.scare.t;if(t<1.2){
        ctx.save();ctx.globalAlpha=Math.min(1,t<.9?.78:.78*(1-(t-.9)/.3));ctx.fillStyle='#000';ctx.fillRect(0,0,DW,DH);ctx.globalAlpha=1;
        if(t<.12){ctx.fillStyle='rgba(255,255,255,'+(.95*(1-t/.12)).toFixed(3)+')';ctx.fillRect(0,0,DW,DH)}
        const im=IMG.hl_bogeyA,sc=(.8+Math.min(t,.3)/.3*.5+t*.12),h=DH*sc,w=h*im.width/im.height;ctx.globalAlpha=t<.9?1:1-(t-.9)/.3;
        ctx.drawImage(im,DW/2-w/2+(Math.random()-.5)*5,DH*.52-h*.5+(Math.random()-.5)*5,w,h);
        ctx.restore()}}
    }
  }catch(e){console.warn('hlFrame',e)}}}

/* ---- the castle's own hand-drawn map ---- */
function hlDrawMap(cs,ox,oy){
  const L=LEVELS[LEVEL],ink='#2a1c0e',halo='rgba(236,222,176,.9)',W=MW,H=MH;
  const gr=ctx.createLinearGradient(0,0,0,DH);gr.addColorStop(0,'#c8b688');gr.addColorStop(1,'#a89668');ctx.fillStyle=gr;ctx.fillRect(0,0,DW,DH);
  ctx.save();ctx.globalAlpha=.12;for(let i=0;i<120;i++){const a=hash2(i,1,7),b=hash2(i,2,7);ctx.fillStyle=i%3?'#5a4630':'#e8dcb0';ctx.beginPath();ctx.ellipse(a*DW,b*DH,6+hash2(i,3,7)*30,3+hash2(i,4,7)*14,hash2(i,5,7)*3,0,TAU);ctx.fill()}ctx.restore();
  const lab=(t,x,y,sz,col)=>{ctx.save();ctx.font='bold '+sz+'px '+FUI;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.lineWidth=3;ctx.strokeStyle=halo;ctx.strokeText(t,x,y);ctx.fillStyle=col||ink;ctx.fillText(t,x,y);ctx.restore()};
  ctx.save();ctx.beginPath();ctx.rect(0,24,DW,DH-24);ctx.clip();
  const isFloor=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&(G.grid[y][x]===0||(G.grid[y][x]>=30&&G.grid[y][x]<100)),fm=L.fmap;
  // stone and floor
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const X=ox+x*cs,Y=oy+y*cs;if(X>DW||Y>DH||X<-cs||Y<-cs)continue;const f=isFloor(x,y);
    if(!f){let near=false;for(let a=-1;a<=1&&!near;a++)for(let b=-1;b<=1;b++)if(isFloor(x+a,y+b)){near=true;break}
      ctx.fillStyle=near?'#7c6850':'#5e4e3c';ctx.fillRect(X,Y,cs+.5,cs+.5);
      if(near&&cs>=5){ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(X,Y+cs*.5,cs+.5,1);if((x+y)%2){ctx.fillRect(X+cs*.5,Y,1,cs*.5)}}}
    else{const t=fm&&fm[y]?fm[y][x]:'0';ctx.fillStyle=t==='3'?'#8a96a8':t==='1'?'#e4cc90':'#e6d8ae';ctx.fillRect(X,Y,cs+.5,cs+.5);
      if(cs>=5){ctx.fillStyle=((x+y)&1)?'rgba(110,80,40,.06)':'rgba(255,255,255,.05)';ctx.fillRect(X,Y,cs,cs)}
      if(t==='3'&&cs>=5){ctx.strokeStyle='rgba(40,60,90,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X+1,Y+cs-2);ctx.lineTo(X+cs-1,Y+2);ctx.stroke()}}}
  // ink along every wall edge
  ctx.strokeStyle=ink;ctx.lineWidth=Math.max(1.2,cs*.2);ctx.lineCap='round';ctx.beginPath();
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){if(!isFloor(x,y))continue;const X=ox+x*cs,Y=oy+y*cs;
    if(!isFloor(x,y-1)){ctx.moveTo(X,Y);ctx.lineTo(X+cs,Y)}if(!isFloor(x,y+1)){ctx.moveTo(X,Y+cs);ctx.lineTo(X+cs,Y+cs)}
    if(!isFloor(x-1,y)){ctx.moveTo(X,Y);ctx.lineTo(X,Y+cs)}if(!isFloor(x+1,y)){ctx.moveTo(X+cs,Y);ctx.lineTo(X+cs,Y+cs)}}
  ctx.stroke();
  const gs=Math.max(5,Math.min(11,cs*.95));
  // the stairs
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const g=G.grid[y][x];if(g!==30&&g!==31)continue;const cx=ox+(x+.5)*cs,cy=oy+(y+.5)*cs,up=g===31;
    ctx.fillStyle=up?'#e8c870':'#b89868';ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.fillRect(cx-gs*.6,cy-gs*.6,gs*1.2,gs*1.2);ctx.strokeRect(cx-gs*.6,cy-gs*.6,gs*1.2,gs*1.2);
    ctx.beginPath();for(let i=1;i<4;i++){ctx.moveTo(cx-gs*.6,cy-gs*.6+gs*.3*i);ctx.lineTo(cx+gs*.6,cy-gs*.6+gs*.3*i)}ctx.stroke();
    ctx.fillStyle=ink;ctx.beginPath();if(up){ctx.moveTo(cx,cy-gs*.45);ctx.lineTo(cx+gs*.35,cy+gs*.1);ctx.lineTo(cx-gs*.35,cy+gs*.1)}else{ctx.moveTo(cx,cy+gs*.45);ctx.lineTo(cx+gs*.35,cy-gs*.1);ctx.lineTo(cx-gs*.35,cy-gs*.1)}ctx.closePath();ctx.fill()}
  // hidden doors: the map shows what the walls do not
  for(const s of (L._secrets||[])){const cx=ox+(s.x+.5)*cs,cy=oy+(s.y+.5)*cs,w=gs*.95,h=gs*1.15;
    ctx.fillStyle='#b07a3a';ctx.strokeStyle=ink;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(cx-w/2,cy+h/2);ctx.lineTo(cx-w/2,cy-h*.15);ctx.quadraticCurveTo(cx,cy-h*.75,cx+w/2,cy-h*.15);ctx.lineTo(cx+w/2,cy+h/2);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffe9a0';ctx.beginPath();ctx.arc(cx+w*.18,cy+h*.12,Math.max(.9,gs*.1),0,TAU);ctx.fill()}
  // what the rooms hold
  const sz=Math.max(4,gs*.8);
  for(const d of G.decor){if(d.found||d.hidden||d.k==='lp_gap')continue;const cx=ox+(d.x+.5)*cs,cy=oy+(d.y+.5)*cs;if(cx<-10||cx>DW+10||cy<10||cy>DH+10)continue;const k=d.k;
    if(/^hl_pt/.test(k)){ctx.fillStyle='#c8a040';ctx.strokeStyle=ink;ctx.lineWidth=.9;ctx.fillRect(cx-sz*.4,cy-sz*.5,sz*.8,sz);ctx.strokeRect(cx-sz*.4,cy-sz*.5,sz*.8,sz);ctx.fillStyle='#4a3020';ctx.beginPath();ctx.arc(cx,cy,sz*.18,0,TAU);ctx.fill()}
    else if(k==='hl_p_mirror'){ctx.fillStyle='#a8cce4';ctx.strokeStyle=ink;ctx.lineWidth=.9;ctx.beginPath();ctx.ellipse(cx,cy,sz*.32,sz*.5,0,0,TAU);ctx.fill();ctx.stroke()}
    else if(k==='chest'){ctx.fillStyle='#e0b030';ctx.strokeStyle=ink;ctx.lineWidth=1;ctx.fillRect(cx-sz*.5,cy-sz*.3,sz,sz*.6);ctx.strokeRect(cx-sz*.5,cy-sz*.3,sz,sz*.6);ctx.fillStyle=ink;ctx.fillRect(cx-1,cy-sz*.05,2,sz*.2)}
    else if(/^hl_p_(candle|poison|apple|desk|feast)$/.test(k)){ctx.fillStyle='#8a5a30';ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.fillRect(cx-sz*.35,cy-sz*.2,sz*.7,sz*.45);ctx.strokeRect(cx-sz*.35,cy-sz*.2,sz*.7,sz*.45);if(k==='hl_p_candle'){ctx.fillStyle='#ffc040';ctx.beginPath();ctx.arc(cx,cy-sz*.32,sz*.12,0,TAU);ctx.fill()}}
    else if(/^hl_p_(coffin|tomb)$/.test(k)){ctx.fillStyle='#9a98a0';ctx.strokeStyle=ink;ctx.lineWidth=.9;ctx.fillRect(cx-sz*.25,cy-sz*.5,sz*.5,sz);ctx.strokeRect(cx-sz*.25,cy-sz*.5,sz*.5,sz)}
    else if(k==='hl_p_throne'){ctx.fillStyle='#e8c040';ctx.strokeStyle=ink;ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(cx-sz*.45,cy+sz*.3);ctx.lineTo(cx-sz*.45,cy-sz*.2);ctx.lineTo(cx-sz*.2,cy);ctx.lineTo(cx,cy-sz*.35);ctx.lineTo(cx+sz*.2,cy);ctx.lineTo(cx+sz*.45,cy-sz*.2);ctx.lineTo(cx+sz*.45,cy+sz*.3);ctx.closePath();ctx.fill();ctx.stroke()}
    else if(/^hl_p_(shelf|lectern)$/.test(k)){ctx.fillStyle='#7a4a2a';ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.fillRect(cx-sz*.4,cy-sz*.3,sz*.8,sz*.6);ctx.strokeRect(cx-sz*.4,cy-sz*.3,sz*.8,sz*.6);ctx.strokeStyle='#d8c890';ctx.beginPath();ctx.moveTo(cx,cy-sz*.3);ctx.lineTo(cx,cy+sz*.3);ctx.stroke()}
    else if(k==='hl_fire'){ctx.fillStyle='#ff8a30';ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(cx,cy-sz*.5);ctx.quadraticCurveTo(cx+sz*.5,cy,cx,cy+sz*.4);ctx.quadraticCurveTo(cx-sz*.5,cy,cx,cy-sz*.5);ctx.fill();ctx.stroke()}
    else if(k==='lever'){ctx.strokeStyle=ink;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(cx,cy+sz*.3);ctx.lineTo(cx+sz*.3,cy-sz*.4);ctx.stroke();ctx.fillStyle='#d03a2a';ctx.beginPath();ctx.arc(cx+sz*.3,cy-sz*.4,sz*.15,0,TAU);ctx.fill()}
    else if(/^hl_p_(cage|rack|armour)$/.test(k)){ctx.strokeStyle='#4a4038';ctx.lineWidth=1.2;ctx.strokeRect(cx-sz*.3,cy-sz*.3,sz*.6,sz*.6);ctx.beginPath();ctx.moveTo(cx-sz*.3,cy);ctx.lineTo(cx+sz*.3,cy);ctx.stroke()}}
  // the lights on the walls
  for(const l of LIGHTS){if(l.taken||l.free&&l.lamp)continue;const cx=ox+l.x*cs,cy=oy+l.y*cs;if(cx<0||cx>DW||cy<20||cy>DH)continue;ctx.fillStyle=l.red?'#e0402e':'#f0b040';ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(cx,cy,Math.max(1.4,cs*.2),0,TAU);ctx.fill();ctx.stroke()}
  // creatures
  for(const e of G.enemies){if(e.hp<=0)continue;const def=ENEMY_DEF[e.t],cx=ox+(e.x+.5)*cs,cy=oy+(e.y+.5)*cs;ctx.fillStyle='#b8302a';ctx.strokeStyle=def&&def.boss?'#ffd060':'#120c08';ctx.lineWidth=def&&def.boss?2:1;ctx.beginPath();ctx.arc(cx,cy,Math.max(2.2,cs*(def&&def.boss?.5:.3)),0,TAU);ctx.fill();ctx.stroke()}
  // the rooms' names
  {const F=HLF(),seen=F.seenRooms||{};(L._roomsInfo||[]).forEach((r,i)=>{if(!r.n||cs<4)return;const cx=ox+((r.x0+r.x1+1)/2)*cs,cy=oy+(r.y0+.8)*cs,known=!!seen[LEVEL+':'+i];
    lab(known?r.n:hlScramble(r.n,LEVEL*31+i),cx,cy,Math.max(7,Math.min(10,cs*1.2)),known?'#3a1c0c':'#6a5a7a')})}
  ctx.restore();
  // the key
  {const x=8,y=206,w=196,h=70;ctx.save();ctx.fillStyle='rgba(226,212,168,.94)';rrect(ctx,x,y,w,h,5);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1.2;rrect(ctx,x,y,w,h,5);ctx.stroke();ctx.restore();
    const rows=[['#b07a3a','Hidden door: walk into the wall'],['#e8c870','Stairs up'],['#e0b030','Chest'],['#c8a040','Portrait'],['#a8cce4','Mirror'],['#e0402e','Wall torch']];
    rows.forEach(([c,t],i)=>{const rx=x+8+(i%2)*98,ry=y+11+((i/2)|0)*17;ctx.fillStyle=c;ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.fillRect(rx,ry-4,8,9);ctx.strokeRect(rx,ry-4,8,9);txt(t,rx+12,ry,i===0?5.6:6.6,'#2a1c0e','left',true)})}
}
{const _dtb=drawTownBody;drawTownBody=function(cs,ox,oy){if(hlIn()){hlDrawMap(cs,ox,oy);return}return _dtb.apply(this,arguments)}}

/* ==========================================================================
   THE ABOMINATIONS. Every second level from the third, new horrors join the castle's creatures, and the ones that came before keep coming: the mad
   jester (3), chest mimics and raving madmen (5), wights and the murdered peasants (7), the butcher and phantoms (9), the headless knight and
   banshees (11), vampires and demented dukes (13), werewolves and skeleton warlords (15), shape shifters and the writhing choir (17), the flesh
   abomination (19). Each has a painted picture and an attacking picture (assets/hl_<name>.png and hl_<name>A.png).
   ========================================================================== */
const HL_MON=[ // [key, name, picture, width, hp, damage, hit, speed, xp, extras]
  ['hljester','Mad Jester','jester',.65,150,[9,16],.8,2,700,{verb:'stabs'}],
  ['hlmimic','Chest Mimic','mimic',.56,280,[14,26],.85,1,900,{verb:'bites',mimic:1}],
  ['hlmadman','Raving Madman','madman',.44,120,[8,22],.75,1,550,{verb:'hacks'}],
  ['hlwight','Wight','wight',.62,240,[14,24],.82,1,1100,{verb:'drains'}],
  ['hlvictim','Murdered Peasant','victim',.53,90,[6,11],.72,1,350,{verb:'stabs'}],
  ['hlbutcher','The Butcher','butcher',.74,520,[20,34],.82,1,2000,{verb:'cleaves'}],
  ['hlphantom','Phantom','phantom',.45,200,[12,20],.8,1,1000,{verb:'chills',fly:true,floatH:.15,glow:.7}],
  ['hlheadless','Headless Knight','headless',.65,460,[22,34],.82,1,1800,{verb:'flails'}],
  ['hlbanshee','Banshee','banshee',.54,210,[10,18],.85,1,1100,{verb:'wails at',fly:true,floatH:.2,glow:.7,ranged:3,shot:'a wail'}],
  ['hlvampire','Vampire','vampire',.66,400,[16,28],.85,1,1700,{verb:'bites',vamp:1}],
  ['hlduke','Demented Duke','duke',.53,340,[14,26],.8,1,1500,{verb:'strikes'}],
  ['hlwerewolf','Werewolf','werewolf',.73,440,[18,30],.85,2,1900,{verb:'mauls'}],
  ['hlwarlord','Skeleton Warlord','warlord',1.24,620,[24,38],.83,1,2400,{verb:'cleaves'}],
  ['hlshifter','Shape Shifter','shifter',.45,380,[16,28],.85,1,1700,{verb:'tears',shifter:1}],
  ['hlchoir','The Writhing Choir','choir',.69,520,[14,24],.8,1,1900,{verb:'claws'}],
  ['hlabom','Flesh Abomination','abom',1.15,950,[24,40],.84,1,3000,{verb:'hacks',regen:1}]];
for(const m of HL_MON){loadImg('hl_'+m[2],'assets/hl_'+m[2]+'.png');loadImg('hl_'+m[2]+'A','assets/hl_'+m[2]+'A.png');
  const ex=m[9],def={name:m[1],hp:m[4],dmg:m[5],hit:m[6],w:m[3],img:'hl_'+m[2],xp:m[8],gold:[Math.round(m[4]/10),Math.round(m[4]/4)],speed:m[7],verb:ex.verb,aboveParty:1};
  if(ex.fly){def.fly=true;def.floatH=ex.floatH;def.glow=ex.glow}if(ex.ranged){def.ranged=ex.ranged;def.shot=ex.shot}
  if(ex.mimic)def.act=e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=1){if(e.poly){e.poly=null;msg('The chest opens its mouth: it was a mimic!','#ff9a7a');sfx('screech')}enemyAttack(e);return 290}return 250}; // it keeps still, a chest, until someone is beside it
  if(ex.shifter)def.act=e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<=2&&e.poly){e.poly=null;msg('The stranger’s skin splits and ripples. It was a shape shifter!','#ff9a7a');sfx('screech')}return 0};
  if(ex.vamp)def.act=e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1){enemyAttack(e);e.hp=Math.min(e.maxhp,e.hp+Math.round(e.maxhp*.05));return 290}return 0}; // each bite heals it a little
  if(ex.regen)def.act=e=>{if(e.hp>0&&e.hp<e.maxhp)e.hp=Math.min(e.maxhp,e.hp+Math.max(1,Math.round(e.maxhp*.02)));return 0}; // it knits itself back together
  ENEMY_DEF[m[0]]=def}
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^hljester$/,'shaken',.3],[/^hlwight$/,'graverot',.3],[/^hlphantom$/,'haunted',.35],[/^hlbanshee$/,'shaken',.4],[/^hlbutcher$/,'bleeding',.4],[/^hlvampire$/,'bleeding',.3],[/^hlwerewolf$/,'bleeding',.3],[/^hlabom$/,'poisoned',.3],[/^hlvictim$/,'fever',.1],[/^hlmadman$/,'bleeding',.15]);
const HL_NEW=[[2,'hljester'],[4,'hlmimic'],[4,'hlmadman'],[6,'hlwight'],[6,'hlvictim'],[8,'hlbutcher'],[8,'hlphantom'],[10,'hlheadless'],[10,'hlbanshee'],[12,'hlvampire'],[12,'hlduke'],[14,'hlwerewolf'],[14,'hlwarlord'],[16,'hlshifter'],[16,'hlchoir'],[18,'hlabom']];
function hlNewFoes(c){
  const {k,enemies,used,rows,d,W,H,hs,violet}=c;if(violet)return;
  const cells=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(rows[y][x]==='.'&&d[y*W+x]>6&&!used.has(x+','+y))cells.push([x,y]);
  HL_NEW.forEach(([ik,t],n)=>{if(ik>k||!cells.length)return;let cnt=ik===k?3:(hs(k,n,61)<.55?1:0);if(t==='hlvictim'&&cnt)cnt+=ik===k?2:1;
    for(let i=0;i<cnt;i++){const q=cells[Math.floor(hs(k*7+i,n*13,62)*cells.length)];if(q&&!used.has(q[0]+','+q[1])){used.add(q[0]+','+q[1]);enemies.push({t,x:q[0],y:q[1]})}}});
}
/* a mimic looks like a chest and a shape shifter like a stranger, until they are close */
{const _hf=hlFrame;hlFrame=function(dt){
  if(G.state==='play'&&hlIn())for(const e of G.enemies){if(e.hp<=0||e.poly!==undefined)continue;
    if(e.t==='hlmimic')e.poly={img:IMG.chest?'chest':'hl_mimic',w:.56,name:'Old Chest',left:99999};
    else if(e.t==='hlshifter')e.poly={img:'kh_ohfolk2_1',w:.5,name:'A pale stranger',left:99999}}
  return _hf.apply(this,arguments)}}

/* ==========================================================================
   THE TRAP ROOMS. On every third level (3, 6, 9, 12, 15, 18) one room shuts behind the party: the doorways turn to wall, the party searches for
   a switch and finds none, a laugh starts, the lights flicker and die, a red light comes up, the walls vanish into a black plane, and a horror
   rises. Kill it and the walls and doors come back. Each room has a different horror and a different conversation.
   ========================================================================== */
ITEMDEF.phantomshroud={n:'Phantom Shroud',k:'chest',t:'Chest',ic:'chest',c:'#9ab0d8',armor:12,price:2600,lvl:12,pas:{dodge:.08,regen:.3},rar:1,gear:1,sw:.46,d:'A shroud of pale, cold cloth that was never woven. Enemies miss 8% more, and wounds close steadily. Needs level 12.'};
for(const [key,name,pic,w,hp,dmg,extra] of [
  ['hlt0','Hideous Phantom','phantom',.7,500,[18,30],{fly:true,floatH:.15,glow:.8,verb:'chills',relic:'phantomshroud'}],
  ['hlt1','The Laughing Fool','jester',.85,450,[16,28],{verb:'stabs',speed:2}],
  ['hlt2','The Red Butcher','butcher',.95,700,[26,42],{verb:'cleaves'}],
  ['hlt3','The Weeping Matron','banshee',.7,500,[18,30],{fly:true,floatH:.2,glow:.8,ranged:3,shot:'a wail',verb:'wails at'}],
  ['hlt4','The Pale Lord','vampire',.8,850,[24,38],{verb:'bites'}],
  ['hlt5','The Singing Horror','choir',.9,1000,[24,40],{verb:'claws'}]])
  ENEMY_DEF[key]=Object.assign({name,hp,dmg,hit:.88,w,img:'hl_'+pic,xp:12000,gold:[300,700],speed:1,aboveParty:3,boss:true},extra);
ENEMY_DEF.hlt4.act=e=>{if(Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)===1){enemyAttack(e);e.hp=Math.min(e.maxhp,e.hp+Math.round(e.maxhp*.04));return 290}return 0};
const HL_TRAPS=[ // one conversation, one laugh and one horror for each trap room
 {mon:'hlt0',say:['What just happened? The door was right there!','Where is the door? There is only wall.','Everyone search the walls. There has to be a hidden switch.','Nothing here. Nothing here. Nothing.','There is no switch. There is no door. We are shut in.'],
  laugh:'Somewhere in the dark, someone starts to laugh. Soft at first. Then it will not stop.',rise:'Out of the dark rises a Hideous Phantom, its face a ruin of too many mouths.'},
 {mon:'hlt1',say:['That was an open doorway a moment ago.','Nobody touched anything. Did anyone touch anything?','Tap the walls. Listen for a hollow sound.','Solid. All of it solid.','Then how did we get in?'],
  laugh:'A music box starts to play, slow and out of tune, and a high giggle joins it.',rise:'A tall figure in motley unfolds from the shadows: the Laughing Fool.'},
 {mon:'hlt2',say:['Smell that? Like a cold cellar.','The door. Where is the door?','Hands on the wall, everyone. Feel for a catch.','Nothing. It is smooth as glass.','We are not leaving this way.'],
  laugh:'A wet chopping sound starts somewhere in the dark, steady as a heartbeat, and a deep laugh rolls under it.',rise:'A huge shape in a bloody apron steps out of the red dark, dragging a cleaver: the Red Butcher.'},
 {mon:'hlt3',say:['Did the air just get colder?','The door was behind us. It is gone.','Search the walls for a lever or a plate.','I have looked everywhere. There is nothing to find.','Then something wants us in here.'],
  laugh:'Weeping begins, far off and then very near, and the weeping turns into laughter.',rise:'A woman in white drifts out of the dark and opens her mouth to scream: the Weeping Matron.'},
 {mon:'hlt4',say:['This is a trap, and we walked right into it.','A door does not simply vanish.','Check the walls. Sconces, stones, anything that moves.','Nothing moves. Nothing at all.','Then we wait for whoever built this.'],
  laugh:'Slow clapping echoes in the dark, and a cultured voice chuckles.',rise:'A pale lord in a black cloak steps out of nowhere and bows: the Pale Lord.'},
 {mon:'hlt5',say:['Do you hear singing?','The door is gone. The wall is just wall.','Search every stone.','No switch. No seam. No door.','Whatever put us here is listening.'],
  laugh:'A choir of a thousand voices begins to sing out of tune, and under it, a laugh.',rise:'The dark gathers itself into a mound of faces, all of them singing: the Singing Horror.'}];
function hlVoidGid(){
  if(hlVoidGid.g)return hlVoidGid.g;
  const c=mkCanvas(64,64,(x,w,h)=>{x.fillStyle='#050205';x.fillRect(0,0,w,h);for(let i=0;i<60;i++){x.fillStyle='rgba(60,10,16,'+(.06+hash2(i,3,9)*.08).toFixed(3)+')';x.fillRect(hash2(i,1,9)*w,hash2(i,2,9)*h,2+hash2(i,4,9)*6,1+hash2(i,5,9)*3)}});
  const dd=c.getContext('2d').getImageData(0,0,64,64).data,id=addTex(dd,null);const gid=KH_NEXT_GID++;T_TILE[gid]=id;return hlVoidGid.g=gid}
function hlTrapSay(i,txts){const l=hlLive();if(!l.length)return;msg(HERO_DEF[l[i%l.length]].name+': "'+txts[i]+'"','#c8d8ff')}
function hlTrapTick(){
  const L=LEVELS[LEVEL],tr=L&&L._trap;if(!tr||!hlIn())return;const F=HLF();F.trap=F.trap||{};if(F.trap[LEVEL])return;
  let S=G.hlTrap;if(!S||S.lv!==LEVEL){S=G.hlTrap={lv:LEVEL,st:0,t0:0,old:null,sealed:[],voidCells:[]}}
  const k=LEVEL-HL.BASE,script=HL_TRAPS[((k/3)|0)%HL_TRAPS.length],t=G.time-S.t0,P=G.P;
  if(S.st===0){
    if(P.x>tr.x0&&P.x<tr.x1&&P.y>tr.y0&&P.y<tr.y1&&!G.cut&&!G.talk&&!hostileNear()){ // the party walks in, and the door shuts
      const vg=hlVoidGid();let wall=null;for(let y=0;y<MH&&!wall;y++)for(let x=0;x<MW;x++)if(G.grid[y][x]>=1000&&G.grid[y][x]!==vg){wall=G.grid[y][x];break}
      wall=wall||1012;S.wall=wall;
      for(const [x,y] of tr.doors){if(G.grid[y][x]===0&&!(x===P.x&&y===P.y)){S.sealed.push([x,y]);G.grid[y][x]=wall}}
      S.st=1;S.t0=G.time;G.shake=.7;sfx('door');sfx('hit');msg('The door slams shut behind you!','#ff9a7a');G.hlStrobe=true}
    return}
  if(S.st===1){S.next=S.next||0;const sc=[1.8,4.4,7,9.6,12.4];
    while(S.next<5&&t>=sc[S.next]){hlTrapSay(S.next,script.say);if(S.next===2)later(900,()=>msg('The party feels along every stone of the wall...','#c8c0a0'));S.next++}
    if(t>=15){msg(script.laugh,'#ff9a9a');sfx('screech');G.shake=.5;S.st=2;S.t1=G.time}
    return}
  if(S.st===2){ // the lights flicker, then go out
    const tt=G.time-S.t1;if(tt<4){const out=hash2(Math.floor(G.time*11),LEVEL,23)>.4;if(out!==!!G.hlOut)hlLights(out)}
    else{hlLights(true);S.st=3;S.t2=G.time;msg('The lights die. It is completely dark.','#b8a8d8')}
    return}
  if(S.st===3){ // a red light comes up all around
    if(G.time-S.t2>1.4){S.red={x:P.x+.5,y:P.y+.5,ph:0,key:-9999,taken:false,red:true,free:true,keep:true,kI:3.2,range2:260};LIGHTS.push(S.red);S.st=4;S.t3=G.time;msg('A red light seeps up out of the floor, from all around.','#ff6a5a')}
    return}
  if(S.st===4){ // the walls vanish: a black plane
    if(G.time-S.t3>2.2){const vg=hlVoidGid();S.fm=G.fmap;const rx0=tr.x0-4,rx1=tr.x1+4,ry0=tr.y0-4,ry1=tr.y1+4;
      for(let y=Math.max(0,ry0);y<=Math.min(MH-1,ry1);y++)for(let x=Math.max(0,rx0);x<=Math.min(MW-1,rx1);x++){const g=G.grid[y][x];if(g>=1000&&g!==vg){S.voidCells.push([x,y,g]);G.grid[y][x]=vg}}
      if(G.fmap){const a=G.fmap.split('');for(let y=tr.y0;y<=tr.y1;y++)for(let x=tr.x0;x<=tr.x1;x++)a[y*MW+x]='3';G.fmap=a.join('')}
      S.hid=G.decor.filter(d=>!d.hidden&&d.x>=tr.x0-4&&d.x<=tr.x1+4&&d.y>=tr.y0-4&&d.y<=tr.y1+4);S.hid.forEach(d=>d.hidden=true); // the room's furnishings vanish with its walls
      S.st=5;S.t4=G.time;G.shake=.8;msg('The walls are gone. There is nothing here but a black plane, and the red glow.','#ff6a5a')}
    return}
  if(S.st===5){ // the horror
    if(G.time-S.t4>2){let q=null;const fv=DIRS[P.f];for(const [dx,dy] of [[fv[0]*2,fv[1]*2],[fv[0]*3,fv[1]*3],[fv[0],fv[1]],[0,-2],[2,0],[-2,0],[0,2],[0,-3],[3,0],[-3,0],[0,3]]){const x=P.x+dx,y=P.y+dy;if(x>tr.x0&&x<tr.x1&&y>tr.y0&&y<tr.y1&&!enemyAt(x,y)){q=[x,y];break}}
      q=q||[P.x,P.y-1];hlSpawn(script.mon,q[0],q[1]);S.mon=G.enemies[G.enemies.length-1];S.mon.trapMon=true;S.st=6;sfx('screech');G.shake=.9;msg(script.rise,'#ff8a7a')}
    return}
  if(S.st===6){ // the horror is dead: everything is as it was
    if(S.mon&&S.mon.hp<=0){
      (S.hid||[]).forEach(d=>d.hidden=false);for(const [x,y,g] of S.voidCells)G.grid[y][x]=g;for(const [x,y] of S.sealed)G.grid[y][x]=0;if(S.fm!=null)G.fmap=S.fm;
      const i=LIGHTS.indexOf(S.red);if(i>=0)LIGHTS.splice(i,1);hlLights(false);G.hlStrobe=undefined;F.trap[LEVEL]=1;S.st=7;G.shake=.4;sfx('door');
      msg('The dark peels away. The walls are back, and the door stands open.','#ffe9a0')}
    return}
}
/* the red light follows the party, and the screen glows red while the room is black */
{const _hf2=hlFrame;hlFrame=function(dt){_hf2.apply(this,arguments);try{
  hlTrapTick();const S=G.hlTrap;if(S&&S.lv===LEVEL&&S.red&&S.st>=4&&S.st<7){S.red.x=G.P.x+.5;S.red.y=G.P.y+.5;S.red.out=false}}catch(e){console.warn('trap',e)}}}
{const _ui4=ui;ui=function(dt){_ui4.apply(this,arguments);try{const S=G.hlTrap;if(S&&S.lv===LEVEL&&S.st>=4&&S.st<7&&G.state==='play'){ctx.save();const p=.5+.5*Math.sin(G.time*3);ctx.fillStyle='rgba(150,10,14,'+(.14+.08*p).toFixed(3)+')';ctx.fillRect(0,0,DW,DH);
  const g=ctx.createRadialGradient(DW/2,DH*.5,DH*.2,DW/2,DH*.5,DH*.9);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(40,0,6,.55)');ctx.fillStyle=g;ctx.fillRect(0,0,DW,DH);ctx.restore()}}catch(e){}}}

/* a room's name on the map is its letters mixed up until the party has walked into it */
function hlScramble(name,seed){
  const letters=name.replace(/ /g,'').split(''),n=letters.length;
  for(let tries=0;tries<6;tries++){const a=letters.slice();for(let i=n-1;i>0;i--){const j=Math.floor(hash2(seed+tries*7,i,19)*(i+1));const t=a[i];a[i]=a[j];a[j]=t}
    let out='',k=0;for(const ch of name){out+=ch===' '?' ':a[k++]}
    out=out.toLowerCase().replace(/(^|\s)(\S)/g,(m,sp,c)=>sp+c.toUpperCase());if(out!==name)return out}
  return name.split('').reverse().join('')}

/* ==========================================================================
   THE HOLLOW COURT. Who Vance's masters were. After the Hollow Abbot, Brother Sevrin asks the party to find three letters Vance wrote to the
   dead court, hidden in the secret rooms of the Orange Tower (levels 5, 10, 15). Then the party climbs to the wizard in the spire, who tells
   the truth: the court of the Hollow Land, ruled by the Pale Sovereign, bought Corvane and Vance with silver, and the party opened the door itself.
   ========================================================================== */
const HL_VANCE=[
 'A folded letter, signed only with a V. "My lord. The silver from the Narrow Sea tolls comes up each quarter on Corvane’s ships. Corvane thinks it buys him a crown. He does not know whose servant he has become. Send me more men like him."',
 'A folded letter, signed V. "My lord. The chancellor’s seal is mine. The king signs what I set before him and sees nothing. I have hidden six pieces of the key in six hands across the Eastern Lands, so that only your servants will find them and open the door."',
 'A folded letter, signed V. "My lord. The Abbot grows old and the seal grows thin. When the door opens, send the court’s riders east. I will have the king’s guard sent to the sea gates. Be patient a little longer."'];
HL_VANCE.forEach((t,i)=>khNpc('hl_vance'+i,'A hidden letter','hl_p_note',()=>{const F=HLF();F.hcLet=F.hcLet||{};const first=!F.hcLet[i];F.hcLet[i]=1;if(first)msg('You read the letter, and keep it.','#e8d070');return say(t,[['Put it away.',()=>null]])}));
QUESTS.hc1={title:'Vance’s Letters',who:'Brother Sevrin',desc:'Brother Sevrin says Vance wrote letters to someone in the Hollow Land. Three of them are hidden in secret rooms of the Orange Tower, on levels 5, 10 and 15: look for the wall of the wrong colour with a wooden lever, and the bookshelf with a red book. Read all three.',need:3,goal:()=>{const c=(G.flags.hl&&G.flags.hl.hcLet)||{};return (c[0]?1:0)+(c[1]?1:0)+(c[2]?1:0)},reward:{gold:6000,xp:60000}};
QUESTS.hc2={title:'The Question at the Top',who:'The Wizard at the top of the tower',desc:'Climb the Orange Tower, twenty levels, to the wizard in the spire, and answer his three questions with good will. He knows who Vance served.',need:1,goal:()=>(G.flags.hl&&G.flags.hl.towerOpen)?1:0,reward:{gold:12000,xp:120000}};
QAREA.hc1=QAREA.hc2='Below the Abbey';
{const R=NPCS.ab_sevrin.root,nr=d=>{
  if(qSt('ad4')==='done'&&qSt('hc1')===null)return say('The Abbot kept a lid on something, I think, and now the lid is off. Long ago a court of dead rulers was shut away under the Abbey, in the Hollow Land below. Vance was never the master of Corvane’s silver. Someone below was. Vance must have written to them. Three of his letters lie hidden in the secret rooms of the tower the court built. Will you find them?',[['We will find the letters.',()=>{qAccept('hc1');return say('Look on levels 5, 10 and 15. The rooms are hidden: a wall of the wrong colour with a lever on it, or a bookshelf with one red book out of line. Come back when you have read all three.',[BYE])}],['Not now.',()=>null]]);
  if(qSt('hc1')==='active'){if(qReady('hc1')){const rw=rewardText('hc1');qTurnIn('hc1');qAccept('hc2');return say('So the silver went up to the court, and Vance spent it to open the door from outside. You opened it yourselves instead. That is why it is still a stair and not a flood. Reward: '+rw+'. One more thing. At the top of the tower there is a wizard who knows the rest. Answer his questions with good will.',[BYE])}
    return say('Three letters. Levels 5, 10 and 15 of the tower, in the hidden rooms.',[BYE])}
  if(qSt('hc2')==='active')return say('Go up to the wizard in the spire, and answer him with good will.',[BYE]);
  return R(d)};
  NPCS.ab_sevrin.root=nr;KH_KEEPERS.ab_sevrin.root=nr;QGIVER.ab_sevrin=['ad3','ad4','hc1']}
{const R=NPCS.hl_wizard.root,nr=d=>{const F=HLF();
  if(qSt('hc2')==='active'&&F.towerOpen&&qReady('hc2')){const rw=rewardText('hc2');qTurnIn('hc2');F.hcRevealed=1;
    return say('You answered with good will, so I will tell you the truth. I am the wizard who shut the court of the Hollow Land under the Abbey, long ago. They were ruled by the first king, whom they call the Pale Sovereign. He wanted to rule past his own death, and the others followed him. I made seven locks, and the Abbey kept the last. Vance was the Sovereign’s hand above, and Corvane was Vance’s tool. The silver bought the pieces of the key. You opened the door yourselves, and that is the only reason the court is not loose in the Eastern Lands tonight. The Sovereign waits in the Violet Tower. Reward: '+rw+'.',[BYE])}
  return R(d)};
  NPCS.hl_wizard.root=nr;KH_KEEPERS.hl_wizard.root=nr;QGIVER.hl_wizard='hc2'}
