/* ==========================================================================
   THE DARK OF THE UNDERLEVEL (prefix hgdn / HGDN), level 476. The black water now rolls in slow waves (the water floor is redrawn from a loop of 16 frames), the walls are jagged dark rock (a faceted stone texture made in code,
   cracked and sharp-edged), an occasional line of text describes the oppressive dark, the snarling all round and the party's own dislike of the place (each line is shown once, in a shuffled order, and never repeats),
   there are terrifying stone statues (the demons and sea horrors, turned to stone) in dead ends and rooms, and now and then the Bogeyman stands up behind the party and springs.
   ========================================================================== */
const HGDN={ID:476,N:16,frames:null,fi:-1,said:null};
/* ---------- the water: a loop of waves ---------- */
function hgdnFrames(){
  if(HGDN.frames)return HGDN.frames;const T=Math.PI*2,N=HGDN.N,out=[];
  for(let k=0;k<N;k++){const f=T*k/N,d=new Uint8ClampedArray(128*128*4);
    for(let y=0;y<128;y++)for(let x=0;x<128;x++){
      const a=Math.sin(T*(x*2/128)+f+1.7*Math.sin(T*(y*3/128)+2*f)),b=Math.sin(T*(y*3/128+x/128)-f+1.3*Math.sin(T*(x*2/128)+f)),c=Math.sin(T*(x*4/128-y*2/128)+2*f+Math.sin(T*(y*5/128)-f));
      const h=a*.5+b*.35+c*.25,v=(h+1)*.5,cr=Math.pow(Math.max(0,h),3),o=(y*128+x)*4;
      d[o]=3+v*9+cr*38;d[o+1]=7+v*20+cr*58;d[o+2]=13+v*36+cr*80;d[o+3]=255}
    out.push(d)}
  return HGDN.frames=out}
/* ---------- the walls: jagged dark rock ---------- */
function hgdnRock(seed){
  const S=128,G0=7,C=S/G0,rnd=hgdmRng(seed),pts=[];
  for(let j=0;j<G0;j++)for(let i=0;i<G0;i++){const ang=rnd()*Math.PI*2,tilt=.25+rnd()*.75;pts.push({x:(i+.15+rnd()*.7)*C,y:(j+.15+rnd()*.7)*C,sh:.5+.5*Math.cos(ang-2.2)*tilt,gx:Math.cos(ang)*tilt,gy:Math.sin(ang)*tilt,tone:.8+rnd()*.4})}
  const cv=document.createElement('canvas');cv.width=cv.height=S;const cx=cv.getContext('2d'),id=cx.createImageData(S,S),d=id.data;
  for(let y=0;y<S;y++)for(let x=0;x<S;x++){
    let d1=1e9,d2=1e9,n1=null;const ci=Math.floor(x/C),cj=Math.floor(y/C);
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){const i=(ci+di+G0)%G0,j=(cj+dj+G0)%G0,p=pts[j*G0+i];let px=p.x+(ci+di-i)*0,py=p.y;
      // wrap the point to the nearest copy
      let ddx=x-px,ddy=y-py;if(ddx>S/2)ddx-=S;else if(ddx<-S/2)ddx+=S;if(ddy>S/2)ddy-=S;else if(ddy<-S/2)ddy+=S;
      const dist=Math.hypot(ddx,ddy)*.65+Math.max(Math.abs(ddx),Math.abs(ddy))*.5; // angular facets
      if(dist<d1){d2=d1;d1=dist;n1={p,ddx,ddy}}else if(dist<d2)d2=dist}
    const e=d2-d1,p=n1.p;let lum=40+Math.pow(p.sh,1.4)*175*p.tone+(n1.ddx*p.gx+n1.ddy*p.gy)*-1.6;
    lum+=(Math.sin(x*1.7+y*.9)*Math.sin(y*2.3-x*.6)>.7?-10:0)+(((x*73856093^y*19349663)>>>0)%100)/100*22-11;
    if(e<3)lum*=.12+e*.12; // the cracks between the facets
    else if(e<5.5)lum*=(p.gx+p.gy<0)?1.55:.55; // a lit edge on one side, shadow on the other
    const o=(y*S+x)*4;lum=Math.max(2,lum);d[o]=lum*.97;d[o+1]=lum*.94;d[o+2]=lum*1.08;d[o+3]=255}
  cx.putImageData(id,0,0);return cv}
{const _b=hgduBuild;hgduBuild=function(){try{if(!IMG.hgdn_rock){IMG.hgdn_rock=hgdnRock(476101);IMG.hgdn_rock2=hgdnRock(476202);IMG.art_tex_hgdu_brick=IMG.hgdn_rock;IMG.art_tex_hgdu_brick2=IMG.hgdn_rock2}}catch(e){console.error('hgdn rock',e)}return _b.apply(this,arguments)}}
/* ---------- statues: the demons and the sea horrors, turned to stone ---------- */
const HGDN_ST=['hgdemon0','hgdemon1','hgdemon2','hgdemon3','hgdemon4','hgdemon5','hgdemon6','hgdemon7','hgdemon8','hgdemon9','hgohag','hgoangler','hgoserpent','hgocorpse','hgoleech','hgocrab'];
function hgdnStatImgs(){
  if(HGDN.st)return HGDN.st;const out=[];
  for(const n of HGDN_ST){const s=IMG['art_'+n];if(!s||!s.width){return null}
    const w=s.width,h=s.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(s,0,0);const im=x.getImageData(0,0,w,h),p=im.data;
    for(let k=0;k<p.length;k+=4){if(p[k+3]<8)continue;const px=(k>>2)%w,py=((k>>2)/w)|0;
      const g=p[k]*.3+p[k+1]*.5+p[k+2]*.2,n2=(((px*73856093^py*19349663)>>>0)%100)/100,v=Math.max(0,Math.min(255,(g-70)*1.25+78+n2*16-8));
      p[k]=v*.96;p[k+1]=v*.95;p[k+2]=v*1.02} // grey stone: no colour, a little grain
    x.putImageData(im,0,0);
    // a dark plinth under it
    const o=document.createElement('canvas');o.width=w;o.height=Math.round(h*1.06);const ox=o.getContext('2d');ox.drawImage(c,0,0);
    ox.fillStyle='#3a3836';ox.fillRect(w*.18,h*1.0,w*.64,h*.06);ox.fillStyle='#262424';ox.fillRect(w*.18,h*1.04,w*.64,h*.02);
    out.push(o)}
  return HGDN.st=out}
function hgdnPlace(L){
  if(L._hgdn)return L._hgdn;const ims=hgdnStatImgs();if(!ims)return null;
  ims.forEach((c,i)=>{IMG['hgdn_st'+i]=c;NPC_H['hgdn_st'+i]=1.45});
  const rows=L.rows,H=rows.length,W=rows[0].length,rnd=hgdmRng(476444),open=(x,y)=>rows[y]&&rows[y][x]==='.'&&!(typeof hgoWater==='function'&&hgoWater(x,y)),res=[];
  const lad=(L._hgdu&&L._hgdu.ladders)||[],keep=[].concat(lad.map(l=>[l.ax,l.ay]),(L._hgdu&&L._hgdu.letters||[]).map(l=>[l.x,l.y]),L._msgr?[[L._msgr.x,L._msgr.y]]:[]);
  const occ=new Set(L.enemies.concat(L.decor).map(e=>e.x+','+e.y)),tooNear=(x,y)=>keep.some(k=>Math.hypot(k[0]-x,k[1]-y)<4)||res.some(r=>Math.abs(r.x-x)+Math.abs(r.y-y)<9);
  const DV=[[0,-1],[1,0],[0,1],[-1,0]],cand=[];
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){if(!open(x,y)||occ.has(x+','+y))continue;
    const deg=DV.filter(d=>open(x+d[0],y+d[1])).length;
    // the middle of a room: open all round (a statue there never blocks the way)
    let room=true;for(let j=-1;j<=1&&room;j++)for(let i=-1;i<=1;i++)if(!open(x+i,y+j)){room=false;break}
    if(deg===1)cand.push([x,y,1,rnd()]);else if(room)cand.push([x,y,2,rnd()])}
  cand.sort((a,b)=>a[3]-b[3]);
  for(const c of cand){if(res.length>=70)break;if(tooNear(c[0],c[1]))continue;
    const k='hgdn_st'+((rnd()*ims.length)|0);res.push({k,x:c[0],y:c[1],hx:1,block:true,deco:true,sc:+(.95+rnd()*.25).toFixed(2),face:c[2]})}
  for(const r of res)L.decor.push({k:r.k,x:r.x,y:r.y,hx:1,block:true,deco:true,sc:r.sc});
  return L._hgdn=res}
function hgdnSync(){
  const L=LEVELS[HGDN.ID];if(!L||!L._hgdo)return; // after the sea is cut (hgd_ocean.js)
  const res=hgdnPlace(L);if(!res||G.decor===G._hgdnDecor)return;G._hgdnDecor=G.decor;
  for(const r of res)if(!G.decor.some(d=>d.x===r.x&&d.y===r.y&&d.k===r.k))G.decor.push({k:r.k,x:r.x,y:r.y,hx:1,block:true,deco:true,sc:r.sc});
}
/* ---------- the lines: once each, shuffled ---------- */
const HGDN_LINES=[
 ['a','The dark here is not an empty dark. It presses on the eyes like a wet hand.'],
 ['a','The air is thick and warm and tastes of old copper. Every breath has to be pulled in.'],
 ['a','Somewhere far off, stone grates on stone, very slowly, as if the walls were turning over in their sleep.'],
 ['a','The torchlight shrinks back from the walls. It does not like it here either.'],
 ['a','Water drips in the dark, always just out of sight, always a little closer than the last drip.'],
 ['a','The corridor bends the light until you cannot tell if the end is ten paces away or a hundred.'],
 ['a','The rock sweats. The black beads of it run down the walls in the glow and look like slow tears.'],
 ['a','There is no wind, and yet the dust on the floor lifts and settles, as if the whole place were breathing.'],
 ['a','Nothing here is square or kind. The walls lean in, jagged as broken teeth, and you feel swallowed.'],
 ['a','The silence is not silence. It is the sound of many things holding very still and listening to you.'],
 ['a','A smell of rot and wet fur rolls down the corridor, and the light flickers as it passes.'],
 ['a','The ground is slick and warm underfoot, like the inside of something alive.'],
 ['s','A snarl rises from the dark ahead, wet and low, and is answered from three other directions.'],
 ['s','Claws click on stone behind the walls, keeping pace with the party, and stop when you stop.'],
 ['s','A long, wet hiss slides along the ceiling. Something up there is licking its teeth.'],
 ['s','Far below, something howls like a child and a wolf at the same time. The howl is cut off short.'],
 ['s','Many voices growl together in the distance, a low chant of hunger, and none of them is human.'],
 ['s','Something drags itself through the dark nearby, a heavy body and a rasping breath, then silence.'],
 ['s','A chorus of snarls swells from the sea of black, and ends with one single, patient, clicking tongue.'],
 ['s','Teeth grind in the walls. It is a dry, steady sound, like a mill with nothing left to grind but bone.'],
 ['s','A shriek tears through the tunnels. It sounds hurt, and it sounds delighted about it.'],
 ['s','Something big shifts its weight in the dark. Pebbles rattle down the wall beside you.'],
 ['r','{A} stares into the dark and whispers: "I do not like this place. I do not like it at all."'],
 ['r','{A} keeps a hand on the weapon and says: "Every shadow here is looking back. Let us find that ladder."'],
 ['r','{A} mutters: "We were not made for this. Somebody tell me where the first ladder up is."'],
 ['r','{A} says, trying to laugh: "At least it cannot get any worse." Then something snarls, and nobody laughs.'],
 ['r','{A} whispers: "I can feel it watching the back of my neck. How far to the surface?"'],
 ['r','{A} and {B} walk back to back now. Neither of them says why.'],
 ['r','{B} says in a thin voice: "Please. The first ladder up. Anything with sunlight on it."'],
 ['r','{B} keeps flinching at the noises. "I am fine," {B} says. Nobody believes it.'],
 ['r','{A} says quietly: "If we get out of this, I am never going below a cellar again."'],
 ['r','{A} stops, listens, and goes pale. "Did you hear that? No. Keep walking. Do not look round."'],
 ['r','{B} says: "My torch is shaking, or is it my hand?" The flame leans away from the dark ahead.'],
 ['r','{A} says: "Stay close, all of you. Whatever lives down here has had a long time to get hungry."'],
 ['r','{B} whispers: "I want the sky back. I want one single breath of clean air."'],
 ['r','{A} says: "Remember the ladder we came down. Somewhere there is one that goes up. We find it, we go."'],
 ['r','{A} grips {B} by the shoulder, hard. "Together," {A} says. "Out of this hole, together."'],
 ['r','{B} counts the steps aloud to stay calm, and loses the count every time something growls.'],
 ['r','{A} says bitterly: "Whoever dug this place was not building a home." {B} says: "No. A trap."'],
 ['r','{B} says: "Is it me, or are the statues down here turned to face us?"'],
 ['t','A pale stone figure stands at the end of the corridor, mouth open in a scream. It looks as if it was alive when it was carved.'],
 ['t','You pass a statue with too many teeth. Its eyes have been left unfinished, as though whoever carved them could not stand to.'],
 ['t','{A} stops dead before a stone horror, arms spread wide, claws out. "It is only a statue," {A} says, and does not sound sure.'],
 ['t','The statues down here were put in the dead ends on purpose. Something wanted the lost to see them last.'],
 ['t','A stone face leers from the dark, cracked with age. A smile that wide should not fit on any face.'],
 ['t','{B} refuses to walk past the grinning stone thing in the room ahead. "I will wait," {B} says. "Go round."'],
 ['a','You have lost the sense of time. Hours, minutes, it could be either; the dark does not say.'],
 ['a','Something very large has just stopped breathing nearby. It is waiting for you to move first.'],
 ['a','The corridor narrows. The ceiling lowers. The whole level seems to be closing like a fist.'],
 ['a','A faint red glint hangs in the dark, blinks, and is gone. It has been following for some time.']
];
function hgdnLine(){
  const F=G.flags;F.hgdnSaid=F.hgdnSaid||[];const left=HGDN_LINES.map((l,i)=>i).filter(i=>!F.hgdnSaid.includes(i));if(!left.length)return;
  const live=[];G.heroes.forEach((h,i)=>{if(h.alive!==false&&h.hp>0)live.push(i)});
  const i=left[(Math.random()*left.length)|0],L=HGDN_LINES[i];let t=L[1];
  if(/\{[AB]\}/.test(t)&&!live.length)return;
  const a=live[(Math.random()*live.length)|0];let b=live.filter(q=>q!==a);b=b.length?b[(Math.random()*b.length)|0]:a;
  t=t.replace(/\{A\}/g,HERO_DEF[a].name).replace(/\{B\}/g,HERO_DEF[b].name);
  F.hgdnSaid.push(i);msg(t,{a:'#a498c8',s:'#d88a8a',r:'#e8d29a',t:'#bcbcc4'}[L[0]])}
/* ---------- the Bogeyman: from behind, at random ---------- */
function hgdnBogey(){
  const S=G.hgdn=G.hgdn||{};
  if(S.warn){ // the warning has run its time: he springs now
    if(G.time<S.warn)return;S.warn=0;const v=DIRS[G.P.f],bx=G.P.x-v[0],by=G.P.y-v[1];
    if(!(G.grid[by]&&G.grid[by][bx]===0)||enemyAt(bx,by)){S.next=G.time+6;return}
    const plvl=Math.round(G.heroes.reduce((n,h)=>n+h.lvl,0)/Math.max(1,G.heroes.length));
    hlSpawn('hlbogey',bx,by,plvl);const be=G.enemies[G.enemies.length-1];be.alert=true;be.lunge=1;
    S.scare=G.time;G.shake=.9;sfx('screech');sfx('hit');msg('THE BOGEYMAN IS RIGHT BEHIND YOU!','#ff6a5a');
    const l=hlLive();if(l.length&&Math.random()<.5){try{afflInflict('shaken',l[(Math.random()*l.length)|0],true)}catch(e){}}
    S.next=G.time+120+Math.random()*240;return}
  if(!S.next)S.next=G.time+70+Math.random()*120;
  if(G.time<S.next||G.cut||G.talk||G.menu||(G.inv&&G.inv.open)||G.loot||!camSettled())return;
  if(G.enemies.some(e=>e.t==='hlbogey'&&e.hp>0&&!e.dying)){S.next=G.time+60;return}
  if(G.enemies.some(e=>e.hp>0&&e.alert&&Math.abs(e.x-G.P.x)+Math.abs(e.y-G.P.y)<6)){S.next=G.time+10;return} // never in the middle of another fight
  S.warn=G.time+1.6+Math.random()*1.8;sfx('step');
  msg(['The dark behind you has gone very quiet.','Something is breathing, slowly, right at your back.','A cold draught touches the back of your neck.','The torchlight dims, and your shadow is suddenly too long.'][(Math.random()*4)|0],'#9a8fc0')}
/* ---------- the loop ---------- */
{const _u=update;update=function(dt){
  try{if(LEVEL===HGDN.ID&&G.state==='play'){
      const fr=hgdnFrames(),fi=Math.floor(G.time*6)%HGDN.N;if(fi!==HGDN.fi&&FLOORS.hgo_water){HGDN.fi=fi;FLOORS.hgo_water.set(fr[fi])}
      hgdnSync();
      const S=G.hgdn=G.hgdn||{};if(!S.lt)S.lt=G.time+25+Math.random()*30;
      if(G.time>=S.lt&&!G.cut&&!G.talk&&!G.menu&&!(G.inv&&G.inv.open)){hgdnLine();S.lt=G.time+55+Math.random()*60}
      hgdnBogey()}}catch(e){console.error('hgdn',e)}
  return _u.apply(this,arguments)}}
{const _g=goToLevel;goToLevel=function(){const r=_g.apply(this,arguments);try{G.hgdn=null;G._hgdnDecor=null}catch(e){}return r}}
/* the jump scare, drawn over everything */
{const _ui=ui;ui=function(dt){_ui.apply(this,arguments);
  try{const S=G.hgdn;if(LEVEL===HGDN.ID&&G.state==='play'&&S&&S.scare&&IMG.hl_bogeyA){const t=G.time-S.scare;if(t<1.2){
      ctx.save();ctx.globalAlpha=Math.min(1,t<.9?.78:.78*(1-(t-.9)/.3));ctx.fillStyle='#000';ctx.fillRect(0,0,DW,DH);ctx.globalAlpha=1;
      if(t<.12){ctx.fillStyle='rgba(255,255,255,'+(.95*(1-t/.12)).toFixed(3)+')';ctx.fillRect(0,0,DW,DH)}
      const im=IMG.hl_bogeyA,sc=.8+Math.min(t,.3)/.3*.5+t*.12,h=DH*sc,w=h*im.width/im.height;ctx.globalAlpha=t<.9?1:1-(t-.9)/.3;
      ctx.drawImage(im,DW/2-w/2+(Math.random()-.5)*5,DH*.52-h*.5+(Math.random()-.5)*5,w,h);ctx.restore()}}}catch(e){}}}
