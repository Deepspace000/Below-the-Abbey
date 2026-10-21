/* ==========================================================================
   BOOKS OF THE FOUR CITIES (prefix HGB). Fifteen books lie in the cities of the Hollow Grasslands (text in hgt_books_text.js).
   - Each book is an ordinary bag item (kind 'quest', type 'Book'). It sells in shops for its price * 0.4. Nothing is equipped.
   - Clicking a book in the bag opens a small panel: pick a hero (that hero reads it) or Read (no hero, no gain) or Cancel.
   - The reader shows one page at a time: Previous / Next / Close, arrow keys and A, D, space also turn pages, B or Escape closes. The pad frame sits on the buttons.
   - Ten books are teaching books: when a hero reaches the LAST page the hero's own strength, dexterity or intelligence rises by 1 for good. This is recorded
     per hero and per book in h.booksRead = {bookId:1} (saved in the hero's save entry as 'bk'), so each hero gains once from each book, and the book stays in the bag.
     Five books are tales only. Level ups and rings do not touch booksRead.
   - Placement: on level entry (update hook) each book is added to G.items at a spot found by code (room corner, tower top, low basin, dead end). The books are
     not part of the per-level saved item list (they are taken out while the level state is saved); G.flags.hgbFound[id] remembers a book that was picked up.
   ========================================================================== */
const HGB_STATN={str:'strength',dex:'dexterity',int:'intelligence'};
const HGB_IDS=Object.keys(HGB_TEXT);
const HGB_TINT={str:[[60,20,12],[236,150,110]],dex:[[14,44,22],[150,226,150]],int:[[16,28,64],[150,190,246]],'':[[40,24,50],[222,190,236]]};
HGB_IDS.forEach((id,i)=>{const b=HGB_TEXT[id],n=b.pages.length,st=b.stat;
  ITEMDEF[id]={n:b.title,k:'quest',t:'Book',ic:'ore',c:'#c8a870',stack:0,price:b.price,sw:.3,book:id,
    d:b.desc+` ${n} pages. Click it in the bag to read it. `+(st?`A hero who reads it to the last page gains 1 ${HGB_STATN[st]}, once for each hero.`:'It is a tale only and gives no bonus.')};
  ITEMDEF[id].id=id});
function hgbIcons(){if(typeof pToneMap!=='function')return;let i=0;for(const id of HGB_IDS){i++;if(IMG['icn_'+id])continue;const base=IMG['icn_hgbook'+(1+(i%4))];if(!base)continue;const t=HGB_TINT[HGB_TEXT[id].stat],im=pToneMap(base,t[0],t[1],1.5,.9,0);IMG['icn_'+id]=im;IMG['ic_'+id]=im;IMG['it_'+id]=im}}
/* ---------- where each book lies: [book, how]. A level number is a city, anything else is a room. how: top, low, nook (outdoors) or room (a corner of the room) ---------- */
const HGB_WHERE={
  481:[['hgbknight','top']],5002:[['hgbghost','room']],4866:[['hgbphil','room']],4863:[['hgbshell','room']],
  482:[['hgbfish','low']],4895:[['hgbmother','room']],4899:[['hgbfrog','room']],5098:[['hgbmap','room']],
  483:[['hgbpick','nook']],4916:[['hgblamp','room']],4906:[['hgbswind','room']],4919:[['hgbhives','room']],
  484:[['hgbpeacock','top']],4934:[['hgbbell','room']],4923:[['hgbheal','room']]};
const HGB_PLACES={hgbknight:'the top of a tower in Exsce',hgbghost:'the Reading Room in Exsce',hgbphil:"the Wizard's Study in Exsce",hgbshell:"Elder Ubbo's Tower Room in Exsce",hgbfish:'the low reed basin of Ulb',hgbmother:'the Reed Hall in Ulb',hgbfrog:"the Hermit's Cell in Ulb",hgbmap:'a Map Room in Ulb',hgbpick:'a hidden dead end in Glorm',hgblamp:'the Lookout Keeper in Glorm',hgbswind:"Gruff's Counting House in Glorm",hgbhives:'the Hidden Gallery in Glorm',hgbpeacock:'a tower top in Nibb',hgbbell:"the Ringers' Room in Nibb",hgbheal:"the Healer's House in Nibb"};
function hgbFound(id){return !!((G.flags||{}).hgbFound||{})[id]}
function hgbSpot(L,how,id){
  const W=L.rows[0].length,H=L.rows.length,h=L.terrace&&L.terrace.h,hh=(x,y)=>h?h[y*W+x]:0,st=L.start||{x:W>>1,y:H>>1};
  const occ=new Set((L.decor||[]).filter(d=>!d.deco||d.block).map(d=>Math.floor(d.x)+','+Math.floor(d.y)));
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&L.rows[y][x]==='.';
  const sx=Math.round(st.x),sy=Math.round(st.y),seen=new Uint8Array(W*H),q=[[sx,sy]];seen[sy*W+sx]=1;const reach=[];
  for(let qi=0;qi<q.length;qi++){const [x,y]=q[qi];reach.push([x,y]);for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(!open(nx,ny)||seen[ny*W+nx])continue;if(Math.abs(hh(nx,ny)-hh(x,y))>.55)continue;seen[ny*W+nx]=1;q.push([nx,ny])}}
  const nb=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[x+dx,y+dy]);
  const flat=(x,y)=>nb(x,y).every(([a,b])=>open(a,b)&&Math.abs(hh(a,b)-hh(x,y))<.01);
  const flatL=(x,y)=>nb(x,y).every(([a,b])=>{if(!open(a,b))return true;const d=Math.abs(hh(a,b)-hh(x,y));return d<=.15||d>.55}); // level enough, or a drop the party cannot step down
  const blocked=(x,y)=>typeof hgtnBlocked==='function'&&hgtnBlocked(L,x,y);
  const ok=(x,y)=>!occ.has(x+','+y)&&!blocked(x,y)&&Math.hypot(x-sx,y-sy)>=3;
  const seed=id.length*17+(id.charCodeAt(3)||0);
  let c=[];
  if(how==='room'){ // a corner or an edge of the floor, away from the doors (they stand at the middle of the end walls)
    for(const [x,y] of reach){if(!ok(x,y)||x===(W>>1)||Math.abs(y-sy)<2&&Math.abs(x-sx)<2)continue;const walls=nb(x,y).filter(([a,b])=>!open(a,b)).length;if(walls>=1)c.push([x,y,walls*2+hash2(x,y,seed)])}
  }else if(how==='top'){
    c=reach.filter(([x,y])=>ok(x,y)&&flatL(x,y)).map(([x,y])=>[x,y,hh(x,y)*10+hash2(x,y,seed)]);
  }else if(how==='low'){
    const f=reach.filter(([x,y])=>ok(x,y)&&flat(x,y)&&Math.hypot(x-sx,y-sy)>20);const mn=Math.min(...f.map(([x,y])=>hh(x,y)));c=f.filter(([x,y])=>hh(x,y)<=mn+.3).map(([x,y])=>[x,y,hash2(x,y,seed)]);
  }else{ // a dead end far from the start
    for(const [x,y] of reach){if(!ok(x,y)||Math.hypot(x-sx,y-sy)<30)continue;const o=nb(x,y).filter(([a,b])=>open(a,b));if(o.length<1||o.length>2)continue;if(!o.every(([a,b])=>Math.abs(hh(a,b)-hh(x,y))<.01))continue;c.push([x,y,hash2(x,y,seed)+(o.length===1?1:0)])}
  }
  if(!c.length)return null;c.sort((a,b)=>b[2]-a[2]);return {x:c[0][0],y:c[0][1]};
}
function hgbPlace(){
  const n=LEVEL,sp=HGB_WHERE[n];if(!sp||G.state!=='play'||!G.items||G._hgbFor===G.items)return;
  const L=LEVELS[n];if(!L||!L.rows)return;G._hgbFor=G.items;L._hgbPos=L._hgbPos||{};
  for(const [id,how] of sp){if(hgbFound(id))continue;let p=L._hgbPos[id];if(p===undefined)p=L._hgbPos[id]=hgbSpot(L,how,id);if(!p)continue;G.items.push({k:id,x:p.x,y:p.y,taken:false,hgb:1})}
}
{const _u=update;update=function(dt){try{hgbPlace();if(!G._hgbIc){hgbIcons();if(IMG['icn_'+HGB_IDS[0]])G._hgbIc=1}}catch(e){console.error('hgb',e)}return _u.apply(this,arguments)}}
/* the books are not part of the saved item list of a level: they are taken off the end of G.items while it is written */
function hgbStrip(fn){return function(){let k=0;while(k<G.items.length&&G.items[G.items.length-1-k].hgb)k++;const mine=k?G.items.splice(G.items.length-k,k):[];try{return fn.apply(this,arguments)}finally{for(const m of mine)G.items.push(m)}}}
levelState=hgbStrip(levelState);snapshot=hgbStrip(snapshot);
{const _sn=snapshot;snapshot=function(){const s=_sn.apply(this,arguments);try{s.heroes.forEach((o,i)=>{const b=G.heroes[i]&&G.heroes[i].booksRead;if(b&&Object.keys(b).length)o.bk=Object.assign({},b)})}catch(e){}return s}}
{const _rn=restoreNow;restoreNow=function(sv){const r=_rn.apply(this,arguments);try{(sv.heroes||[]).forEach((s,i)=>{if(G.heroes[i])G.heroes[i].booksRead=Object.assign({},s.bk||{})})}catch(e){console.error('hgb',e)}return r}}
{const _pk=pickup;pickup=function(it){const d=ITEMDEF[it.k];if(!d||!d.book)return _pk.apply(this,arguments);
  if(!bagAdd(mkItem(it.k))){msg('Your bag is full.','#d09a80');return false}
  it.taken=true;G.flags.hgbFound=G.flags.hgbFound||{};G.flags.hgbFound[it.k]=1;sfx('equip');msg(`You pick up: ${d.n}.`,'#9ae0a0');return true}}
/* ---------- the panel and the reader ---------- */
const BK={ui:null};
function hgbOpen(mode,id,hi){BK.ui={mode,id,hi:hi===undefined?-1:hi,page:0};if(typeof PAD!=='undefined'&&PAD.name)PAD.focus=mode==='panel'?'bk_h0':'bk_next';if(mode==='read')hgbSeen()}
function hgbSeen(){ // the last page has been shown: a teaching book gives its gain
  const u=BK.ui,b=HGB_TEXT[u.id];if(!u||u.hi<0||u.page<b.pages.length-1)return;const h=G.heroes[u.hi],nm=HERO_DEF[u.hi].name;if(!h)return;
  if(!b.stat)return;h.booksRead=h.booksRead||{};
  if(h.booksRead[u.id]){u.note=`${nm} has already learned what this book teaches.`;return}
  h.booksRead[u.id]=1;h[b.stat]=(h[b.stat]||0)+1;try{recalcMax(u.hi)}catch(e){}sfx('level');
  u.note=`${nm}'s ${HGB_STATN[b.stat]} rises by 1.`;msg(u.note,'#ffe36a');
}
function hgbPage(d){const u=BK.ui;if(!u||u.mode!=='read')return;const n=HGB_TEXT[u.id].pages.length,p=Math.max(0,Math.min(n-1,u.page+d));if(p===u.page)return;u.page=p;u.note=null;sfx('step');hgbSeen()}
function hgbDraw(){
  const u=BK.ui;if(!u)return;
  if(G.state!=='play'||!HGB_TEXT[u.id]||(u.mode==='panel'&&!G.bag.some(b=>b.id===u.id))){BK.ui=null;return}
  const b=HGB_TEXT[u.id];BTNS=[];ctx.save();ctx.setTransform(2,0,0,2,0,0);
  veil(.72);
  if(u.mode==='panel'){
    const x=90,y=34,w=300,hgt=252;ctx.fillStyle='#120d09';ctx.fillRect(x,y,w,hgt);bigPanel(x,y,w,hgt);
    let ty=y+20;for(const s of wrapText(b.title,w-30,12)){txt(s,x+w/2,ty,12,'#e8d8a8','center',true);ty+=15}
    txt(`${b.pages.length} pages`,x+w/2,ty+1,8.5,'#a89878','center');ty+=14;
    for(const s of wrapText(b.desc,w-30,8.5)){txt(s,x+w/2,ty,8.5,'#c8b898','center');ty+=11}ty+=4;
    const eff=b.stat?`Reading it to the last page gives a hero 1 ${HGB_STATN[b.stat]}, once for each hero.`:'It is a tale only and gives no bonus.';
    for(const s of wrapText(eff,w-30,8.5)){txt(s,x+w/2,ty,8.5,b.stat?'#9ae0a0':'#a89878','center');ty+=11}ty+=6;
    txt('Place it in the off hand of the hero you choose.',x+w/2,ty,9.5,'#ffe9a0','center',true);ty+=12;
    for(let i=0;i<G.heroes.length;i++){const hr=G.heroes[i],bx=x+10+(i%2)*(w/2-5),by=ty+Math.floor(i/2)*26,bw=w/2-15,nm=HERO_DEF[i].name,done=b.stat&&hr.booksRead&&hr.booksRead[u.id];
      if(!hr.alive){panel(bx,by,bw,22,true,false);txt(nm+' (fallen)',bx+bw/2,by+11,9.5,'#6a6050','center');continue}
      btnText('bk_h'+i,done?nm+' (has read it)':nm,bx,by,bw,22)}
    const ry=ty+56;btnText('bk_read','Read, no gain',x+10,ry,w/2-15,22);btnText('bk_cancel','Cancel',x+w/2+5,ry,w/2-15,22);
  }else{
    const x=28,y=8,w=424,hgt=304,n=b.pages.length;ctx.fillStyle='#120d09';ctx.fillRect(x,y,w,hgt);bigPanel(x,y,w,hgt);
    txt(b.title,x+w/2,y+17,12.5,'#e8d8a8','center',true,undefined,w-30);
    txt(`Page ${u.page+1} of ${n}`,x+w/2,y+33,9.5,'#c8b982','center');
    if(u.hi>=0)txt('Read by '+HERO_DEF[u.hi].name,x+14,y+33,8,'#a89878','left');
    let size=10.5,lines=wrapText(b.pages[u.page],w-40,size);while(lines.length*size*1.35>196&&size>7){size-=.5;lines=wrapText(b.pages[u.page],w-40,size)}
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x+12,y+44,w-24,204);
    let ly=y+44+size*.9;for(const s of lines){txt(s,x+20,ly,size,'#e6dcc0','left');ly+=size*1.35}
    if(u.note)txt(u.note,x+w/2,y+257,10,'#ffe36a','center',true,undefined,w-30);
    const by=y+268;
    if(u.page>0)btnText('bk_prev','Previous',x+14,by,110,24);else{panel(x+14,by,110,24,true,false);txt('Previous',x+69,by+12,11,'#6a6050','center',true)}
    if(u.page<n-1)btnText('bk_next','Next',x+w/2-55,by,110,24);else{panel(x+w/2-55,by,110,24,true,false);txt('The end',x+w/2,by+12,11,'#6a6050','center',true)}
    btnText('bk_close','Close',x+w-124,by,110,24);
  }
  ctx.restore();
}
{const _ui=ui;ui=function(dt){const r=_ui.apply(this,arguments);try{if(BK.ui)hgbDraw()}catch(e){console.error('hgb',e);BK.ui=null}return r}}
{const _hb=handleBtn;handleBtn=function(id){
  if(BK.ui&&/^bk_/.test(id)){const u=BK.ui;
    if(id==='bk_cancel'||id==='bk_close'){BK.ui=null;sfx('equip');return}
    if(id==='bk_read'){hgbOpen('read',u.id,-1);return}
    if(/^bk_h\d$/.test(id)){const hi=+id[4];if(G.heroes[hi]&&G.heroes[hi].alive)hgbOpen('read',u.id,hi);return}
    if(id==='bk_prev'){hgbPage(-1);return}if(id==='bk_next'){hgbPage(1);return}return}
  return _hb.apply(this,arguments)}}
addEventListener('keydown',e=>{const u=BK.ui;if(!u)return;
  const k=e.key;if(u.mode==='read'){if(k==='ArrowLeft'||k==='a'||k==='A')hgbPage(-1);else if(k==='ArrowRight'||k==='d'||k==='D'||k===' '||k==='Enter')hgbPage(1)}
  if(k==='Escape'||(u.mode==='panel'&&k==='Enter'&&false)){BK.ui=null;sfx('equip')}
  e.preventDefault();e.stopImmediatePropagation()},true);
/* clicking a book in the bag (or pressing Equip on it) opens the panel */
{const _ib=invBtn;invBtn=function(id){
  const I=G.inv;let bi=-1;
  if(id.startsWith('ibag')&&id!=='ibagarea')bi=+id.slice(4);else if(id==='iequip'&&I.sel&&I.sel.src==='bag')bi=I.sel.i;
  const it=bi>=0&&G.bag[bi];if(it&&ITEMDEF[it.id]&&ITEMDEF[it.id].book){I.sel={src:'bag',i:bi};hgbOpen('panel',it.id);return}
  return _ib.apply(this,arguments)}}
