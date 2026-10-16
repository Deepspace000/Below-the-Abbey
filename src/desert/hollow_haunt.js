/* ==========================================================================
   THE HAUNTING OF THE ORANGE TOWER, second part. The level plaques, claw marks and relic icons are painted pictures; the witch strobes the lights;
   a bogeyman waits behind the party whenever it looks into a mirror; some walls are hidden doors that open when the party walks into them (and the
   map shows them); the chests hold real treasure; and the castle has its own hand-drawn map.
   ========================================================================== */
for(let n=1;n<=20;n++){loadImg('hl_plq'+n,'assets/hl_plq'+n+'.png');NPC_H['hl_plq'+n]=1.2}
for(let n=0;n<6;n++){loadImg('hl_claw'+n,'assets/hl_claw'+n+'.png');NPC_H['hl_claw'+n]=.62}
loadImg('hl_bogey','assets/hl_bogey.png');loadImg('hl_bogeyA','assets/hl_bogeyA.png');NPC_H.hl_bogey=1.9;
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push('crownbreaker','veilpiercer','dukesgavel','hollowscepter'); // their pictures are painted (assets/icn_<id>.png)
const hlIn=()=>LEVEL>=HL.BASE&&LEVEL<HL.BASE+HL.N;

/* ---- treasure: the chests of the castle hold potions, gear, rings and gold, more of it the higher the level ---- */
function hlLootFor(d){
  if(d.k!=='chest'||!hlIn())return null;
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
function hlFrame(dt){
  if(G.state!=='play'||!hlIn())return;const L=LEVELS[LEVEL];
  // opened hidden doors stay open (the level is rebuilt each visit)
  {const F=HLF();if(F.sec&&L._secrets)for(const s of L._secrets)if(F.sec[LEVEL+':'+s.x+','+s.y]&&G.grid[s.y]&&G.grid[s.y][s.x]!==0)G.grid[s.y][s.x]=0}
  // a lever or a picture on a wall that has opened (a hidden door, a secret chamber) goes with the wall
  for(const d of G.decor){if(d.found||!d.wd||!(d.pic||d.k==='lever'))continue;const wx=d.x+d.wd[0],wy=d.y+d.wd[1];if(G.grid[wy]&&G.grid[wy][wx]===0)d.found=true}
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
  for(const r of (L._roomsInfo||[])){if(!r.n||cs<4)continue;const cx=ox+((r.x0+r.x1+1)/2)*cs,cy=oy+(r.y0+.8)*cs;lab(r.n,cx,cy,Math.max(7,Math.min(10,cs*1.2)),'#3a1c0c')}
  ctx.restore();
  // the key
  {const x=8,y=206,w=196,h=70;ctx.save();ctx.fillStyle='rgba(226,212,168,.94)';rrect(ctx,x,y,w,h,5);ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=1.2;rrect(ctx,x,y,w,h,5);ctx.stroke();ctx.restore();
    const rows=[['#b07a3a','Hidden door: walk into the wall'],['#e8c870','Stairs up'],['#e0b030','Chest'],['#c8a040','Portrait'],['#a8cce4','Mirror'],['#e0402e','Wall torch']];
    rows.forEach(([c,t],i)=>{const rx=x+8+(i%2)*98,ry=y+11+((i/2)|0)*17;ctx.fillStyle=c;ctx.strokeStyle=ink;ctx.lineWidth=.8;ctx.fillRect(rx,ry-4,8,9);ctx.strokeRect(rx,ry-4,8,9);txt(t,rx+12,ry,i===0?5.6:6.6,'#2a1c0e','left',true)})}
}
{const _dtb=drawTownBody;drawTownBody=function(cs,ox,oy){if(hlIn()){hlDrawMap(cs,ox,oy);return}return _dtb.apply(this,arguments)}}
