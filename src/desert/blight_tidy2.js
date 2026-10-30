/* ==========================================================================
   TIDY PASS FOR THE EAST HALF OF THE BLIGHTED ROAD (game fix pass, 30 Oct 2026). Prefix bt2.
   Only these levels: Lanternrest 9660 to 9669, Hollowbell Abbey 9680 to 9689, the Rookery Mill 9690 to 9699, the Pale Bridge 9700 to 9709
   (not the Vault of Maldrake 9670s and not the west half of the road). It runs once per level after every other pass (a wrap of KH_LAZY, last in ORDER, flag L._bt2):
   - a web is a picture flat on a wall, high up in the corner, never loose in a room; a web with no wall beside it is taken away;
   - things that hang (shields, tapestries, banners, notice boards, glass windows, painted windows) are pictures flat on the wall beside them,
     no taller than the wall; one that stood inside a wall square is moved out in front of it;
   - hidden blocking squares inside a wall (left by a wide piece standing at the wall) are taken away, and those beside a piece that is now on the wall;
   - books, rings, thimbles and boards lifted over the bare floor (nothing under them) are put down on the floor;
   - the same piece twice in one square: the second one goes.
   Plain literal text, no em dashes.
   ========================================================================== */
const BT2={IDS:id=>(id>=9660&&id<=9669)||(id>=9680&&id<=9709),stats:{}};
/* hanging pieces: key -> height on the wall in squares (a room wall is about 1 square high) */
const BT2_HANG={gy_web:.45,wl2_armour_1:.55,wl2_hall_1:.75,wl2_hall_0:.85,wl2_library_5:.55,wl2_church_2:.8,hl_p_window:.7};
const BT2_DOWN=/^(gy_book|gy_ring|bl_thimble|gy_sign)$/;
/* a picture key with its own height (the engine sizes a wall picture by NPC_H of its key): the picture itself is read from the source key when it is drawn */
function bt2Alias(src,h){
  const k='bt2_'+src+'_'+Math.round(h*100);
  if(!Object.getOwnPropertyDescriptor(IMG,k))Object.defineProperty(IMG,k,{get(){return IMG[src]},set(v){},configurable:true,enumerable:false});
  NPC_H[k]=h;return k}
function bt2Tidy(L,id){
  const W=L.rows[0].length,H=L.rows.length,ch=L.chars||{},st={web:0,webGone:0,hang:0,hidden:0,down:0,dup:0};
  const isDoorC=c=>c==='0'||c==='D'||c==='L'||(ch[c]!==undefined&&!!KH_DOOR[ch[c]])||(typeof ch[c]==='number'&&ch[c]>=30&&ch[c]<100);
  const inb=(x,y)=>x>=0&&y>=0&&x<W&&y<H;
  const open=(x,y)=>inb(x,y)&&L.rows[y][x]==='.';
  const wall=(x,y)=>inb(x,y)&&L.rows[y][x]!=='.'&&!isDoorC(L.rows[y][x]);
  const D4=[[0,-1],[-1,0],[1,0],[0,1]];
  const faces=new Set();for(const d of L.decor)if(d.pic&&d.wd)faces.add(d.x+','+d.y+','+d.wd[0]+','+d.wd[1]);
  const indoor=!L.outdoor;
  const drop=new Set();
  // hidden blocks of a wide wall piece: the squares wlinProp blocked beside it
  const wideCells=d=>{const im=IMG[d.k];if(!im||!im.width||!NPC_H[d.k])return [];const w=NPC_H[d.k]*(d.sc||1)*im.width/im.height,o=[];
    for(let xx=Math.floor(d.x+.5-w/2+.12);xx<=Math.floor(d.x+.5+w/2-.12);xx++)if(xx!==d.x)o.push(xx);return o};
  for(const d of L.decor){
    if(d.pic||drop.has(d))continue;const base=String(d.k);
    if(BT2_HANG[base]===undefined)continue;
    if(d.npc&&base!=='gy_web')continue;   // a piece with something to say stays where it can be pressed
    if(!indoor&&base!=='gy_web')continue;
    // stood inside a wall square: out in front of it
    let x=d.x,y=d.y,fixed=null;
    if(!open(x,y)){const n=D4.find(([a,b])=>open(x+a,y+b));if(!n){drop.add(d);continue}fixed=[-n[0],-n[1]];x+=n[0];y+=n[1]}
    let wd=fixed;
    if(!wd){const cands=D4.filter(([a,b])=>wall(x+a,y+b));wd=cands.find(([a,b])=>!faces.has(x+','+y+','+a+','+b))||(base==='gy_web'?cands[0]:null)}
    if(!wd){if(base==='gy_web'){drop.add(d);st.webGone++}continue}
    const fk=x+','+y+','+wd[0]+','+wd[1];if(faces.has(fk)&&base!=='gy_web')continue;faces.add(fk);
    const cells=/^wl2_/.test(base)&&!d.free?wideCells(d):[],oy=d.y;
    const h=indoor?BT2_HANG[base]:Math.min(1.2,NPC_H[base]||1),k=indoor?bt2Alias(base,h):base;
    d.x=x;d.y=y;d.k=k;d.wd=[wd[0],wd[1]];d.pic=1;d.block=false;d.walk=true;if(!d.npc)d.deco=true;delete d.solid;delete d.sc;delete d.ox;delete d.oy;
    d.bob=base==='gy_web'?(indoor?.97-h:1.15):Math.max(.05,.55-h/2);
    if(base==='gy_web')st.web++;else st.hang++;
    // the squares it blocked beside it, now that it hangs flat on the wall
    for(const xx of cells){const q=L.decor.find(q=>q.hidden&&!q.npc&&q.x===xx&&q.y===oy&&!drop.has(q));if(q){drop.add(q);st.hidden++}}}
  for(const d of L.decor){
    if(drop.has(d))continue;
    if(d.hidden&&!d.npc&&!open(d.x,d.y)){drop.add(d);st.hidden++;continue}   // a hidden block inside a wall
    if(!d.pic&&d.bob>0&&BT2_DOWN.test(String(d.k))){const under=L.decor.some(q=>q!==d&&!drop.has(q)&&!q.pic&&q.x===d.x&&q.y===d.y);if(!under){d.bob=0;if(d.k==='gy_book')d.sc=Math.min(d.sc||1,.55);st.down++}}}   /* a book on the bare floor lies small, not as big as a chest */
  const seen=new Set();
  for(const d of L.decor){if(drop.has(d)||d.npc)continue;const key=d.k+'|'+d.x+'|'+d.y+'|'+(d.wd||'');if(seen.has(key)){drop.add(d);st.dup++}else seen.add(key)}
  if(drop.size)L.decor=L.decor.filter(d=>!drop.has(d));
  BT2.stats[id]=st;return st}
for(let id=9660;id<=9709;id++){if(!BT2.IDS(id))continue;const o=KH_LAZY[id];if(!o)continue;
  KH_LAZY[id]=function(){const r=o.apply(this,arguments);const L=LEVELS[id];if(L&&L.rows&&L.decor&&!L._bt2){L._bt2=1;try{bt2Tidy(L,id)}catch(e){console.error('bt2 '+id,e)}}return r}}
