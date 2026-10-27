/* ==========================================================================
   HOUSING (prefix hs / HS): a real estate agent in each town sells houses and furniture. The data is in housing_data.js.
   How it works
   - HS_TOWNS says which sizes each town sells and where the plots are. On every level load (loadLevel is wrapped) hsStamp() paints the plots into the town:
     a For Sale board on a plot that is still for sale, or the house (walls, a door, a roof, a sign saying Your House) on a plot that the party owns.
     Nothing is removed from the level's decor list: boards and signs are added once and then shown or hidden, so saved decor states keep their place.
   - The door leads into an interior level (HS_BASE + 3 * town number + size number). It is built again on every entry from G.flags.hs, so furniture changes show at once.
   - Stepping inside restores all health and mana and cures every affliction except curses (Cursed, Haunted). The bed is a free rest (like the inn), the table is a free meal.
   - The Home Chest is shared by all the party's houses. It holds as many stacks as the biggest house owned (40, 80 or 160) and is part of the saved game, so nothing can take it.
   - Marker spots in each room hold furniture bought from any agent (placed with a click on the marker) and trophies (a boss's picture on a stone plinth with a name plate).
   - A boss is defeated when the game's own kill counter G.flags.k_<type> is above zero (hurtEnemy counts every kill); hsSlain below adds an achievement line the first time.
   Save data (all in G.flags.hs): own {townLevel:{size:1}}, slots {'townLevel:size':{slot:itemId}}, stock {itemId:count}, chest [{id,n}], tro {'townLevel:size':{slot:trophyId|'none'}}, slain {bossType:1}, intro.
   ========================================================================== */
const HS={tried:{},door:{},wg:{},TM:null,art:false,_rf:null,agentFace:null};
HS_TOWNS.forEach((t,i)=>{t.i=i;t.ids={};HS_SIZE_IDS.forEach((s,j)=>{t.ids[s]=HS_BASE+i*3+j})});
const hsTownAt=n=>HS_TOWNS.find(t=>t.lvl===n)||null;
const hsHouseAt=n=>{if(n<HS_BASE||n>=HS_BASE+HS_TOWNS.length*3)return null;const t=HS_TOWNS[((n-HS_BASE)/3)|0],s=HS_SIZE_IDS[(n-HS_BASE)%3];return t&&t.sizes.includes(s)?{T:t,size:s}:null};
const hsF=()=>{const F=HS._rf||G.flags;return F.hs||(F.hs={own:{},slots:{},stock:{},chest:[],tro:{},slain:{}})};
const hsOwned=(T,s)=>!!(hsF().own[T.lvl]&&hsF().own[T.lvl][s]);
const hsKey=(T,s)=>T.lvl+':'+s;
const hsMoney=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const hsOwnedList=()=>{const o=[];for(const T of HS_TOWNS)for(const s of T.sizes)if(hsOwned(T,s))o.push({T,size:s,key:hsKey(T,s)});return o};
const hsCap=()=>{let c=0;for(const h of hsOwnedList())c=Math.max(c,HS_SIZES[h.size].cap);return c};
/* ---- the pictures: the painted wall and roof sheets are loaded when a town with plots is first entered, the furniture when a house is first entered ---- */
async function hsLoadSheets(sheets){
  let man={};try{man=await (await fetch('assets/kh/manifest.json?v='+VERSION)).json()}catch(e){}
  const want=Object.keys(man).filter(k=>!IMG['kh_'+k]&&sheets.some(s=>k.startsWith(s+'_')&&/^\d+$/.test(k.slice(s.length+1))));
  await Promise.all(want.map(k=>loadImg('kh_'+k,'assets/kh/'+man[k].file)));
}
function hsLoad(T){ // the pieces for the outside of one town
  const key='t_'+(T?T.key:'');if(HS[key])return HS[key];
  return HS[key]=(async()=>{try{await hsLoadSheets(HS_SHEETS_TOWN.concat((T&&T.sheets)||[]));try{ohStyles()}catch(e){console.error(e)}hsMakeArt()}catch(e){console.error('hsLoad',e)}})();
}
function hsLoadHome(){ // the pieces for the inside of a house
  if(HS.home)return HS.home;
  return HS.home=(async()=>{try{await hsLoadSheets(HS_SHEETS_HOME);if(typeof wlinLoad==='function')try{await wlinLoad()}catch(e){console.error(e)}try{ohStyles()}catch(e){}hsMakeArt()}catch(e){console.error('hsLoadHome',e)}})();
}
const hsDone={};
function hsNeed(n){ // a promise for the pictures that this town or house still needs, or null when they are all there
  const T=hsTownAt(n),H=hsHouseAt(n);if(!T&&!H)return null;
  const TT=T||H.T,tk='t_'+TT.key,jobs=[];
  if(!hsDone[tk])jobs.push(hsLoad(TT).then(()=>{hsDone[tk]=1}));
  if(H&&!hsDone.home)jobs.push(hsLoadHome().then(()=>{hsDone.home=1}));
  return jobs.length?Promise.all(jobs):null;
}
/* the boards, markers and plinths are drawn here: they are signs and floor marks, the same kind of thing as the plates that shopSign() draws */
function hsMakeArt(){
  if(HS.art)return;HS.art=true;
  for(const s of HS_SIZE_IDS){ // a For Sale board on a post
    const z=HS_SIZES[s];IMG['hs_sale_'+s]=mkCanvas(96,128,(x,w,h)=>{
      x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(48,122,26,5,0,0,6.3);x.fill();
      x.fillStyle='#4a3420';x.fillRect(44,50,8,74);x.fillStyle='#3a2816';x.fillRect(44,50,3,74);
      x.fillStyle='#c9b27c';x.fillRect(8,6,80,56);x.strokeStyle='#4a3420';x.lineWidth=3;x.strokeRect(8,6,80,56);
      x.strokeStyle='rgba(74,52,32,.35)';x.lineWidth=1;for(let i=1;i<5;i++){x.beginPath();x.moveTo(9,6+i*11);x.lineTo(87,6+i*11);x.stroke()}
      x.textAlign='center';x.textBaseline='middle';x.fillStyle='#7a1c14';x.font='bold 13px Georgia,serif';x.fillText('FOR SALE',48,19);
      x.fillStyle='#2a1a0c';x.font='bold 9px Georgia,serif';x.fillText(z.name,48,34);x.font='9px Georgia,serif';x.fillText(hsMoney(z.price)+' gold',48,48)});
    NPC_H['hs_sale_'+s]=.95;
  }
  for(let n=1;n<=14;n++){ // a numbered marker for a piece of furniture
    IMG['hs_m'+n]=mkCanvas(48,56,(x)=>{
      x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(24,50,15,4,0,0,6.3);x.fill();
      x.fillStyle='#5a4326';x.fillRect(20,22,8,28);x.fillStyle='#b89a50';x.fillRect(6,6,36,24);x.strokeStyle='#4a3216';x.lineWidth=2;x.strokeRect(6,6,36,24);
      x.fillStyle='#2a1a0c';x.font='bold 16px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),24,19)});
    NPC_H['hs_m'+n]=.42;
  }
  IMG.hs_office=mkCanvas(96,128,(x)=>{
    x.fillStyle='rgba(0,0,0,.28)';x.beginPath();x.ellipse(48,122,26,5,0,0,6.3);x.fill();
    x.fillStyle='#4a3420';x.fillRect(44,50,8,74);x.fillStyle='#3a2816';x.fillRect(44,50,3,74);
    x.fillStyle='#d8c690';x.fillRect(8,6,80,56);x.strokeStyle='#4a3420';x.lineWidth=3;x.strokeRect(8,6,80,56);
    x.textAlign='center';x.textBaseline='middle';x.fillStyle='#1c3a62';x.font='bold 11px Georgia,serif';x.fillText('REAL ESTATE',48,19);
    x.fillStyle='#2a1a0c';x.font='9px Georgia,serif';x.fillText('Houses for sale',48,34);x.fillText('Furniture and',48,45);x.fillText('decorations',48,55)});NPC_H.hs_office=.95;
  IMG.hs_tm=mkCanvas(48,56,(x)=>{x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(24,50,15,4,0,0,6.3);x.fill();
    x.fillStyle='#5a4326';x.fillRect(20,22,8,28);x.fillStyle='#8fa6b8';x.fillRect(6,6,36,24);x.strokeStyle='#2a3a4a';x.lineWidth=2;x.strokeRect(6,6,36,24);
    x.fillStyle='#1c2a38';x.font='bold 14px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('T',24,19)});NPC_H.hs_tm=.42;
  IMG.hs_plinth=mkCanvas(64,84,(x)=>{ // a stone plinth seen straight on
    x.fillStyle='rgba(0,0,0,.3)';x.beginPath();x.ellipse(32,79,26,4,0,0,6.3);x.fill();
    const g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'#8c8a84');g.addColorStop(.5,'#c9c6bc');g.addColorStop(1,'#7a7870');
    x.fillStyle=g;x.fillRect(6,66,52,10);x.fillRect(12,18,40,48);x.fillRect(4,8,56,10);
    x.strokeStyle='#3a3a36';x.lineWidth=1.5;x.strokeRect(6,66,52,10);x.strokeRect(12,18,40,48);x.strokeRect(4,8,56,10)});NPC_H.hs_plinth=.5;
}
/* ---- the pieces of a house wall ---- */
function hsWallGid(key){
  if(HS.wg[key]!==undefined)return HS.wg[key];const im=IMG[key];if(!im)return HS.wg[key]=1;
  const [c,x]=tcv();x.drawImage(im,0,0,TS,TS);const id=addTex(pix(c)),gid=KH_NEXT_GID++;T_TILE[gid]=id;return HS.wg[key]=gid;
}
const hsLook=(T,s)=>Object.assign({},HS_SIZES[s],(T.skin&&T.skin[s])||{});
const hsFit=(key,h)=>{if(!NPC_H[key])NPC_H[key]=h;return NPC_H[key]===h?1:h/NPC_H[key]}; // the scale that makes a picture h cells high
/* ---- the plots in the towns ---- */
const hsFaceOut={S:2,N:0,E:1,W:3},hsFaceVec={S:[0,1],N:[0,-1],E:[1,0],W:[-1,0]};
function hsPlot(T,s){
  const p=T.plots[s],f=p.face;let door;
  if(f==='S')door=[p.x0+((p.w-1)>>1),p.y0+p.d-1];else if(f==='N')door=[p.x0+((p.w-1)>>1),p.y0];else if(f==='E')door=[p.x0+p.w-1,p.y0+((p.d-1)>>1)];else door=[p.x0,p.y0+((p.d-1)>>1)];
  const v=hsFaceVec[f],front=[door[0]+v[0],door[1]+v[1]];
  return {p,door,front,out:hsFaceOut[f],cx:p.x0+p.w/2,cy:p.y0+p.d/2,span:(f==='S'||f==='N')?p.w:p.d};
}
function hsDoorGid(T,s){
  const k=T.lvl+'|'+s;if(HS.door[k])return HS.door[k];
  const z=hsLook(T,s),tm=HS.TM.make('door',OH_STY[z.sty]?z.sty:'honey',z.wh),gid=KH_NEXT_GID++,R=HS_ROOMS[s],id=T.ids[s];
  T_TILE[gid]=tm.tex;KH_DOOR[gid]={lvl:id,at:{x:R.door,y:R.h-2,f:0},hs:1};
  return HS.door[k]=gid;
}
function hsWallSet(T,s){
  const k=T.lvl+'|W|'+s;if(HS.door[k])return HS.door[k];
  const z=hsLook(T,s),sty=OH_STY[z.sty]?z.sty:'honey',m=kind=>HS.TM.make(kind,sty,z.wh).gid;
  return HS.door[k]={plain:m('plain'),plain2:m('plain2'),win:m('window'),shop:m('shopfront'),gwin:m('gwin')};
}
/* put the plots into a town level: the level is changed in place, and changed back first if the flags say a house is not owned any more */
function hsStamp(L,T){
  if(!L||L.stub||!L.rows)return;
  if(!HS.TM)HS.TM=ohTiles();
  const U=L._hs||(L._hs={n:0,rows:[],plots:{},agent:null,sky:[]});
  L.chars=L.chars||{};L.decor=L.decor||[];L.sky=L.sky||[];
  const setCh=(x,y,c)=>{const r=L.rows[y];if(r[x]===c)return;L.rows[y]=r.slice(0,x)+c+r.slice(x+1)};
  const chFor=gid=>{let c=U['c'+gid];if(!c){c=String.fromCharCode(0x1e00+(U.n++));U['c'+gid]=c;L.chars[c]=gid}return c};
  if(!U.agent){ // the agent, his sign, and the boards of every plot are added once
    const face=IMG[T.face]?T.face:T.alt;if(face&&!NPC_H[face])NPC_H[face]=(typeof KH_NPC_H!=='undefined'&&KH_NPC_H[face])||.98;
    U.agent={k:face,x:T.agent.x,y:T.agent.y,block:true,npc:'hs_agent',sc:1};L.decor.push(U.agent);
    if(T.agent.sign){const s=T.agent.sign;U.sign={k:'hs_office',x:s.x,y:s.y,block:false,walk:true,deco:true,sc:1};L.decor.push(U.sign)}
    for(const s of T.sizes){const P=hsPlot(T,s);
      for(const d of L.decor){if(d.block&&!d.npc&&d.x>=P.p.x0&&d.x<P.p.x0+P.p.w&&d.y>=P.p.y0&&d.y<P.p.y0+P.p.d&&d!==U.agent){d._hsTree=true;d.block=false;d.hidden=true}} // trees on a plot are cleared for good
      const board={k:'hs_sale_'+s,x:P.door[0],y:P.door[1],block:true,solid:1,npc:'hs_b_'+s,sc:1};L.decor.push(board);
      const v=hsFaceVec[P.p.face]; // the sign beside the door: the cell next to the one in front of it, which has the house wall behind it
      const side=v[1]?[P.front[0]-1,P.front[1]]:[P.front[0],P.front[1]-1];
      const own={k:'sign_hsown',x:side[0],y:side[1],block:false,wd:[-v[0],-v[1]],txt:['YOUR HOUSE',HS_SIZES[s].name],sc:.8,bob:.3,hidden:true};
      L.decor.push(own);
      U.plots[s]={P,board,own,roof:null};
    }
  }
  for(const s of T.sizes){
    const u=U.plots[s],P=u.P,p=P.p,z=hsLook(T,s),owned=hsOwned(T,s);
    u.board.hidden=owned;u.board.block=!owned;u.own.hidden=!owned;
    if(owned&&hsDoorGid(T,s)){
      const W=hsWallSet(T,s),dg=hsDoorGid(T,s);
      for(let y=p.y0;y<p.y0+p.d;y++)for(let x=p.x0;x<p.x0+p.w;x++){
        if(!u.orig)u.orig={};const key=x+','+y;if(u.orig[key]===undefined)u.orig[key]=L.rows[y][x];
        let g;const isDoor=x===P.door[0]&&y===P.door[1],front=(p.face==='S'&&y===p.y0+p.d-1)||(p.face==='N'&&y===p.y0)||(p.face==='E'&&x===p.x0+p.w-1)||(p.face==='W'&&x===p.x0);
        if(isDoor)g=dg;else if(front)g=((x+y)%2?W.shop:W.win);else g=((x+y)%3===0?W.gwin:((x*5+y*3)%5===1?W.plain2:W.plain));
        setCh(x,y,chFor(g));
      }
      if(!u.roof&&IMG[z.roof]){u.roof={x:P.cx,y:P.cy,k:z.roof,w:P.span+z.roofW,z:z.wh-.03};L.sky.push(u.roof)}
    }else{
      if(u.orig)for(const key in u.orig){const [x,y]=key.split(',').map(Number);setCh(x,y,u.orig[key])}
      if(u.roof){const i=L.sky.indexOf(u.roof);if(i>=0)L.sky.splice(i,1);u.roof=null}
    }
  }
  L._hsOn=true;
}
/* sprites in the sky list are drawn only on some levels: the engine asks this */
const hsSkyOn=n=>!!(hsTownAt(n)||hsHouseAt(n));
/* ---- the level of a house inside ---- */
const hsInfoAt=n=>hsHouseAt(n);
function hsTrophyList(){ // everything the party has earned a trophy for, in the order of HS_BOSSES and HS_FEATS
  const F=(HS._rf||G.flags)||{},out=[];
  for(const [t,file,alt] of HS_BOSSES){const d=ENEMY_DEF[t];if(!d)continue;let a=false;try{a=!!(alt&&alt(F))}catch(e){}out.push({id:t,kind:'boss',name:d.name,img:d.img,file,got:((F['k_'+t]|0)>0)||!!(F.hs&&F.hs.slain&&F.hs.slain[t])||a})}
  for(const [id,name,fn] of HS_FEATS){let got=false;try{got=!!fn(F)}catch(e){}out.push({id,kind:'feat',name,got})}
  return out;
}
const hsEarned=()=>hsTrophyList().filter(t=>t.got);
function hsTrophyPlan(h,R,list){ // which trophy stands on which trophy marker of this house: [{slot index in R.slots, trophy}]
  const F=hsF(),man=(F.tro[h.key]||(F.tro[h.key]={})),slotsT=[];R.slots.forEach((s,i)=>{if(s[2]==='t')slotsT.push(i)});
  const plan={},used=new Set();
  if(h.size!=='large'){for(const i of slotsT){const m=man[i];if(m&&m!=='none'&&list.find(t=>t.id===m)){plan[i]=list.find(t=>t.id===m);used.add(m)}}}
  const rest=list.filter(t=>!used.has(t.id));let j=0;
  for(const i of slotsT){if(plan[i]||(h.size!=='large'&&man[i]==='none'))continue;if(j<rest.length)plan[i]=rest[j++]}
  return plan;
}
/* the pictures of the bosses that have been beaten are loaded when a house is entered (those with a file on disk; the others show a banner) */
function hsLoadTrophyImgs(){
  const need=[];for(const t of hsEarned()){if(t.kind==='boss'&&t.img&&!IMG[t.img]&&t.file&&!HS.tried[t.img]){HS.tried[t.img]=1;need.push(loadImg(t.img,t.file))}}
  return need.length?Promise.all(need):null;
}
function hsBuildHouse(T,s){
  const R=HS_ROOMS[s],z=HS_SIZES[s],look=HS_LOOK[R.look],W=R.w,H=R.h,key=hsKey(T,s),h={T,size:s,key},F=hsF();
  const grid=[];for(let y=0;y<H;y++){grid.push([]);for(let x=0;x<W;x++)grid[y].push(y===0||y===H-1||x===0||x===W-1?'w':'.')}
  for(const [x0,y0,x1,y1] of R.walls)for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)grid[y][x]='w';
  for(const [x,y] of (R.gaps||[]))grid[y][x]='.';
  for(const [x,y] of R.win)if(grid[y]&&grid[y][x]==='w')grid[y][x]='u';
  grid[H-1][R.door]='0';
  const rows=grid.map(r=>r.join('')),decor=[];
  const wall=hsWallGid(look.wall),win=IMG['wl2_ww_'+look.ww]?hsWallGid('wl2_ww_'+look.ww):wall;
  const P=hsPlot(T,s);
  const put=(k,x,y,o)=>{decor.push(Object.assign({k,x,y,block:true,deco:true},o||{}));return decor[decor.length-1]};
  const npcAt=(pic,x,y,id,hh,o)=>{const sc=hsFit(pic,hh);return put(pic,x,y,Object.assign({npc:id,solid:1,sc},o||{}))};
  const fixed=R.fixed;
  // the fixed furniture: hearth (glows), table (a free meal), bed (a free rest), chest (the Home Chest)
  {const pic=IMG.wl2_trades_3?'wl2_trades_3':'wl2_inn_0';const sc=hsFit(pic,1.0);put('lamp',fixed.hearth[0],fixed.hearth[1],{lk:pic,glow:[0,.45],npc:'hs_hearth',solid:1,sc,deco:false});if(!NPC_H.lamp)NPC_H.lamp=1}
  npcAt(IMG.wl2_home_0?'wl2_home_0':'kh_int3_1',fixed.table[0],fixed.table[1],'hs_table',.75);
  npcAt(IMG.wl2_trades_4?'wl2_trades_4':'kh_int3_3',fixed.bed[0],fixed.bed[1],'hs_bed',.85);
  npcAt(IMG.chest?'chest':'kh_int3_5',fixed.chest[0],fixed.chest[1],'hs_chest',.55);
  // the marker spots
  const slots=F.slots[key]||{},list=hsTrophyList().filter(t=>t.got),plan=hsTrophyPlan(h,R,list);let nd=0;
  R.slots.forEach((sl,i)=>{
    const [x,y,kind]=sl;
    if(kind==='d'){
      nd++;const itemId=slots[i],it=itemId&&HS_CATALOGUE.find(c=>c.id===itemId);
      if(it&&(IMG[it.pic])){const sc=hsFit(it.pic,it.h);const o={npc:'hs_s'+i,solid:1,sc,bob:it.bob||0,kname:it.name};if(it.glow)put('lamp',x,y,Object.assign(o,{lk:it.pic,glow:[0,.4]}));else put(it.pic,x,y,o)}
      else if(it){put('hs_m'+Math.min(14,nd),x,y,{npc:'hs_s'+i,solid:1,sc:hsFit('hs_m'+Math.min(14,nd),.42),kname:it.name})}
      else put('hs_m'+Math.min(14,nd),x,y,{npc:'hs_s'+i,solid:1,sc:hsFit('hs_m'+Math.min(14,nd),.42),kname:'Marker '+nd});
    }else{
      const tr=plan[i];
      if(tr){
        const ak='hst_'+tr.id,src=tr.kind==='boss'&&tr.img&&IMG[tr.img]?IMG[tr.img]:null;
        if(src){IMG[ak]=src;NPC_H[ak]=1}
        put('hs_plinth',x,y,{npc:'hs_t'+i,solid:1,sc:hsFit('hs_plinth',.5),kname:tr.kind==='boss'?'Slayer of '+tr.name.split(',')[0]:tr.name});
        if(src){put(ak,x,y,{block:false,walk:true,bob:.46,sc:.7*Math.min(1.25,Math.max(.6,src.height/src.width)),hidden:false,deco:true})}
        else{const bk=IMG.wl2_hall_0?'wl2_hall_0':'kh_throne1_1';put(bk,x,y,{block:false,walk:true,bob:.46,sc:hsFit(bk,.55),deco:true})}
        decor.push({k:'sign_hstro',x,y,block:false,wd:y<=2?[0,-1]:[0,1],txt:[tr.name.split(',')[0].slice(0,28),tr.kind==='boss'?'Defeated':'Achieved'],sc:.5,bob:.12});
      }else if(h.size!=='large'){put('hs_tm',x,y,{npc:'hs_t'+i,solid:1,sc:hsFit('hs_tm',.42),kname:'Plinth'})}
    }
  });
  const chars={w:wall,u:win};
  const lv={rows,start:{x:R.door,y:H-2,f:0},enemies:[],items:[],decor,day:0,amb:R.amb,floor:FLOORS[look.floor]?look.floor:'wood',ceil:'beam',name:z.name+', '+T.name,label:z.name+', '+T.name,lights:R.lights.slice(),
    portals:[{to:T.lvl,x:P.front[0],y:P.front[1],f:P.out,tex:'in'}],diff:1,noExtras:true,peaceful:true,chars,tele:{x:R.tele[0],y:R.tele[1]},hs:{town:T.lvl,size:s,key}};
  return lv;
}
for(const T of HS_TOWNS)for(const s of T.sizes){const id=T.ids[s];KH_LAZY[id]=()=>{LEVELS[id]=hsBuildHouse(T,s)};LEVEL_NAMES[id]=HS_SIZES[s].name+', '+T.name;LEVEL_RATING[id]=1}
/* ---- on every level load: the plots of a town are painted in, and a house is built fresh from the saved furniture ---- */
{const _ll=loadLevel;loadLevel=function(n){
  try{
    const T=hsTownAt(n);
    if(T){if(!LEVELS[n]&&KH_LAZY[n])KH_LAZY[n]();hsStamp(LEVELS[n],T)}
    const H=hsHouseAt(n);if(H&&KH_LAZY[n])KH_LAZY[n]();
  }catch(e){console.error('hs loadLevel',e)}
  return _ll.apply(this,arguments)}}
/* the towns and houses wait for their pictures; flags are passed on because reset() clears them while the level is built */
{const _g=goToLevel;goToLevel=function(n,entry){
  {const w=hsNeed(n);if(w){if(!G._hsWait){G._hsWait=1;w.then(()=>{G._hsWait=0;goToLevel(n,entry)}).catch(()=>{G._hsWait=0})}return}}
  if(hsHouseAt(n)){const w=hsLoadTrophyImgs();if(w){if(!G._hsWait){G._hsWait=1;w.then(()=>{G._hsWait=0;goToLevel(n,entry)}).catch(()=>{G._hsWait=0})}return}}
  if(hsTownAt(n)&&!HS.TM)HS.TM=ohTiles();
  const was=LEVEL;HS._rf=G.flags;let r;try{r=_g.apply(this,arguments)}finally{HS._rf=null}
  if(LEVEL===n&&was!==n&&hsHouseAt(n)&&!G._hsQuiet)hsEnter(n);
  return r}}
if(typeof restore==='function'){const _r=restore;restore=function(sv){const l=sv&&sv.level;
  {const w=hsNeed(l);if(w){w.then(()=>restore(sv));return}}
  if(!HS.TM)HS.TM=ohTiles();
  if(hsHouseAt(l)&&!HS._tw){HS._rf=sv.flags;let w=null;try{w=hsLoadTrophyImgs()}finally{HS._rf=null}if(w){HS._tw=1;w.then(()=>{HS._tw=0;restore(sv)});return}}
  HS._rf=sv&&sv.flags;try{return _r.apply(this,arguments)}finally{HS._rf=null}}}
{const _rn=restoreNow;restoreNow=function(sv){const prev=HS._rf;HS._rf=(sv&&sv.flags)||prev;try{return _rn.apply(this,arguments)}finally{HS._rf=prev}}} // the engine may run this later (after the golden city is built), so the saved flags are passed on here too
if(typeof jumpToLevel==='function'){const _j=jumpToLevel;jumpToLevel=function(n,t){{const w=hsNeed(n);if(w){w.then(()=>jumpToLevel(n,t));return}}return _j.apply(this,arguments)}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||!!hsTownAt(n)||!!hsHouseAt(n)}}
/* ---- arriving home: all health and mana back, every ill cured but the curses ---- */
const HS_CURSES=['cursed','haunted'];
function hsEnter(n){
  const H=hsHouseAt(n);if(!H)return;
  let healed=false;G.heroes.forEach(h=>{if(h.alive&&(h.hp<h.max||h.mp<h.mpMax)){h.hp=h.max;h.mp=h.mpMax;healed=true}});
  let cured=0;try{for(const e of afflList().slice()){const A=AFFL[e.id];if(A&&A.kind==='bad'&&!HS_CURSES.includes(e.id)){afflRemove(e,false);cured++}}}catch(e){console.error(e)}
  const keep=(()=>{try{return afflList().some(e=>HS_CURSES.includes(e.id))}catch(e){return false}})();
  msg('Home. '+(healed||cured?'Your wounds close, your strength returns, and every ill but a curse leaves you.':'It is quiet and warm.')+(keep?' The curse stays: only a church can lift it.':''),'#b8e8a0');
  if(healed||cured)sfx('heal');
}
/* ---- the agent in the street ---- */
const hsNpc=(id,name,root)=>{NPCS[id]={name,img:null,root}};
const hsHere=()=>hsTownAt(LEVEL)||(hsHouseAt(LEVEL)&&hsHouseAt(LEVEL).T);
function hsPaged(text,items,page,per,back){ // a menu with pages: items [[label,fn]]
  const n=Math.ceil(items.length/per),p=Math.max(0,Math.min(page,n-1)),opts=items.slice(p*per,p*per+per).slice();
  if(p>0)opts.push(['Earlier choices',()=>hsPaged(text,items,p-1,per,back)]);
  if(p<n-1)opts.push(['More choices',()=>hsPaged(text,items,p+1,per,back)]);
  if(back)opts.push(back);else opts.push(BYE);
  return say(text,opts);
}
function hsAgentRoot(){
  const T=hsHere();if(!T)return null;
  const mine=hsOwnedList();
  const top=()=>say('Good day. I sell houses in '+T.name+' and I sell furniture for every house in the land. Everything is dear, and everything is worth it. What can I do for you?',[
    ['See the houses for sale',()=>hsList(T)],
    ['Buy furniture and decorations',()=>hsShop(T,0)],
    ['Your houses and how they work',()=>hsHelp(T)],
    BYE]);
  return top();
}
function hsHelp(T){
  const mine=hsOwnedList(),back=['Back',()=>hsAgentRoot()];
  const txt=mine.length?'You own '+mine.map(h=>'the '+HS_SIZES[h.size].name+' in '+h.T.name).join(', and ')+'. ':'You own no house yet. ';
  return say(txt+'Walk through the door of your house to be healed in full and cured of every ill but a curse. Inside, the bed is a free rest, the table is a free meal, and the chest keeps your things safe. Furniture goes on the numbered markers; trophies of the bosses you defeat go on the stone plinths.',[back]);
}
function hsList(T){
  const opts=T.sizes.map(s=>{const z=HS_SIZES[s],own=hsOwned(T,s);return [z.name+', '+hsMoney(z.price)+' gold'+(own?' (yours)':''),()=>hsOffer(T,s)]});
  opts.push(['Back',()=>hsAgentRoot()]);
  return say('Here is what '+T.name+' has to offer. The plots are marked with boards: the town has one place for each.',opts);
}
function hsOffer(T,s){
  const z=HS_SIZES[s],back=['Back',()=>hsList(T)];
  if(hsOwned(T,s))return say('The '+z.name+' in '+T.name+' is already yours. '+z.blurb+' Its chest holds '+z.cap+' stacks.',[back]);
  return say(z.name+': '+hsMoney(z.price)+' gold. '+z.blurb+' The chest holds '+z.cap+' stacks, and the chest is shared by all your houses. You have '+hsMoney(G.gold)+' gold.',[
    ['Buy it for '+hsMoney(z.price)+' gold',()=>hsBuyHouse(T,s)],back]);
}
function hsBuyHouse(T,s){
  const z=HS_SIZES[s];
  if(hsOwned(T,s))return hsList(T);
  if(G.gold<z.price)return say('That is '+hsMoney(z.price)+' gold and you have '+hsMoney(G.gold)+'. Come back when you have the rest.',[['Back',()=>hsList(T)]]);
  G.gold-=z.price;const F=hsF();(F.own[T.lvl]=F.own[T.lvl]||{})[s]=1;sfx('key');
  const P=hsPlot(T,s),where={S:'south',N:'north',E:'east',W:'west'}[P.p.face];
  const first=!F.intro;F.intro=1;
  msg('You bought the '+z.name+' in '+T.name+' for '+hsMoney(z.price)+' gold. It stands on its plot, with the door on the '+where+' side.','#ffe9a0');
  if(first)msg('Your house heals the party and cures every ill except curses. Inside: a free bed, a free meal and a chest. Buy furniture here to fill the markers.','#b8e8a0');
  G._hsDirty=1;
  return say('Done. The '+z.name+' is yours: look for the house with the sign Your House at the plot where the board stood. Its door is on the '+where+' side. Go in and see.',[['Thank you.',()=>null],['More business',()=>hsAgentRoot()]]);
}
/* furniture on sale */
function hsShop(T,page){
  const items=HS_CATALOGUE.slice().sort((a,b)=>a.price-b.price).map(c=>[c.name+', '+hsMoney(c.price),()=>hsItem(T,c,page)]);
  return hsPaged('Furniture and decorations. Pieces stay yours, and can be moved between your houses. You have '+hsMoney(G.gold)+' gold.',items,page,6,['Back',()=>hsAgentRoot()]);
}
function hsItem(T,c,page){
  const own=hsF().stock[c.id]|0,back=['Back',()=>hsShop(T,Math.floor(HS_CATALOGUE.slice().sort((a,b)=>a.price-b.price).findIndex(q=>q.id===c.id)/6))];
  return say(c.name+': '+hsMoney(c.price)+' gold.'+(own?' You have '+own+' in storage.':'')+' You have '+hsMoney(G.gold)+' gold.',[['Buy it',()=>hsBuyItem(T,c)],back]);
}
function hsEmptyDeco(h){const R=HS_ROOMS[h.size],sl=hsF().slots[h.key]||{};for(let i=0;i<R.slots.length;i++)if(R.slots[i][2]==='d'&&!sl[i])return i;return -1}
function hsBuyItem(T,c){
  if(G.gold<c.price)return say('That is '+hsMoney(c.price)+' gold and you have '+hsMoney(G.gold)+'.',[['Back',()=>hsShop(T,0)]]);
  G.gold-=c.price;const F=hsF();F.stock[c.id]=(F.stock[c.id]|0)+1;sfx('key');
  const opts=[];
  for(const h of hsOwnedList())if(hsEmptyDeco(h)>=0)opts.push(['Put it in your '+HS_SIZES[h.size].name+' in '+h.T.name+' now',()=>{hsPlace(h,hsEmptyDeco(h),c.id);G._hsDirty=1;msg('The '+c.name.toLowerCase()+' is placed in your '+HS_SIZES[h.size].name+' in '+h.T.name+'.','#b8e8a0');return say('It is on its way to your '+HS_SIZES[h.size].name+' in '+h.T.name+', and will be on its marker when you step inside.',[['Anything else',()=>hsShop(T,0)],BYE])}]);
  opts.push(['Keep it in storage',()=>say('It is yours. At any marker in your house you can choose it from your storage.',[['Anything else',()=>hsShop(T,0)],BYE])]);
  return say('Sold: the '+c.name.toLowerCase()+' for '+hsMoney(c.price)+' gold.'+(hsOwnedList().length?' Where shall it go?':' You have no house yet, so it waits in storage until you do.'),opts);
}
function hsPlace(h,slot,id){
  const F=hsF(),sl=(F.slots[h.key]=F.slots[h.key]||{});
  if(sl[slot])F.stock[sl[slot]]=(F.stock[sl[slot]]|0)+1;
  if((F.stock[id]|0)<=0)return false;
  F.stock[id]--;sl[slot]=id;return true;
}
function hsRemoveSlot(h,slot){const F=hsF(),sl=F.slots[h.key]||{};if(sl[slot]){F.stock[sl[slot]]=(F.stock[sl[slot]]|0)+1;delete sl[slot]}}
/* ---- the signs and boards ---- */
for(const s of HS_SIZE_IDS)hsNpc('hs_b_'+s,'For Sale',()=>{const T=hsTownAt(LEVEL);if(!T||!T.sizes.includes(s))return null;const z=HS_SIZES[s];
  return say('FOR SALE: a '+z.name+', '+hsMoney(z.price)+' gold. '+z.blurb+' Ask at the real estate office in '+T.name+'.',[BYE])});
hsNpc('hs_agent','The estate agent',hsAgentRoot);
/* ---- inside: the bed, the table, the chest ---- */
hsNpc('hs_bed','Your bed',()=>say('A good bed with clean sheets. Sleeping here costs nothing.',[
  ['Sleep until morning (free)',()=>{G.talk=null;if(!restParty(true))return null;try{afflCure('hangover',-1,true)}catch(e){}msg('You sleep in your own bed, and wake mended and fed.','#b8e8a0');return null}],BYE]));
hsNpc('hs_hearth','The hearth',()=>{
  const cook=hsCookable();
  return say('A fire burns in the hearth, and the kettle is always warm.'+(cook.length?' Something in your bag could be cooked.':''),[
    ...(cook.length?[['Cook what you can ('+cook.reduce((a,c)=>a+c.n,0)+')',()=>{hsCook(cook);return null}]]:[]),BYE])});
hsNpc('hs_table','Your table',()=>{
  const H=hsHouseAt(LEVEL),big=H&&H.size!=='small';
  return say('A hot meal is laid out: bread, stew, cheese and a jug of water. It costs nothing, and every hero eats his fill.'+(big?' A meal like this at a good table leaves the party well fed and learning a little faster for half a day.':''),[
    ['Eat a meal (free)',()=>{G.heroes.forEach(h=>{if(h.alive)h.food=100});sfx('potion');
      if(big){try{afflInflict('wellfed',-1,true)}catch(e){}hsF().xpUntil=G.clock+720;msg('A hearty meal. The party is well fed and learns a little faster for half a day.','#b8e8a0')}else msg('The party eats its fill. Nobody is hungry.','#b8e8a0');return null}],BYE])});
/* what the hearth can cook: an item with a cook field, or a pair in HS_COOK (raw id : cooked id) */
const HS_COOK={};
function hsCookable(){const o=[];for(const it of G.bag){const d=ITEMDEF[it.id];const to=d&&(d.cook||HS_COOK[it.id]);if(to&&ITEMDEF[to])o.push({it,to,n:it.n||1})}return o}
function hsCook(list){let n=0;for(const c of list){const i=G.bag.indexOf(c.it);if(i<0)continue;const k=c.n;G.bag.splice(i,1);bagAdd({id:c.to,n:k});n+=k}if(n){sfx('potion');msg('You cook '+n+' item'+(n>1?'s':'')+' over the fire.','#b8e8a0')}}
/* the Home Chest: the loot window of the game, with the stash as its container */
hsNpc('hs_chest','Your chest',()=>{
  const F=hsF(),cap=hsCap(),n=F.chest.length,all=hsTrophyList(),got=all.filter(t=>t.got).length;
  return say('The Home Chest, shared by all your houses. It holds '+n+' of '+cap+' stacks. Trophies: '+got+' of '+all.length+' bosses and feats.',[
    ['Open the chest',()=>{hsChestOpen();return null}],
    ['See the trophies',()=>hsTrophyBook(0)],BYE])});
function hsChestOpen(){
  const F=hsF(),cap=hsCap()||HS_SIZES.small.cap;
  G.loot={decor:{k:'chest',contents:F.chest,hs:1},shop:false,cap,get name(){return 'Home Chest, '+F.chest.length+' of '+cap},sel:null,sl:0,sr:0,t:G.time};G.hold=null;sfx('equip');
}
function hsDeposit(i){ // from the bag into the chest: stackable things join the stack that is already there
  const L=G.loot;if(!L||!L.cap)return;const box=L.decor.contents,it=G.bag[i];if(!it)return;
  const d=ITEMDEF[it.id],at=d&&d.stack?box.find(b=>b.id===it.id):null;
  if(!at&&box.length>=L.cap){msg('The chest is full.','#d09a80');return}
  const t=bagTake(i);if(at)at.n+=t.n||1;else box.push({id:t.id,n:t.n||1});
  L.sel=null;sfx('equip');
}
function hsTrophyBook(page){
  const all=hsTrophyList(),per=8,np=Math.ceil(all.length/per),p=Math.max(0,Math.min(page,np-1)),got=all.filter(t=>t.got).length;
  const lines=all.slice(p*per,p*per+per).map(t=>(t.got?'Done: ':'Not yet: ')+(t.got?(t.kind==='boss'?'Slayer of '+t.name:t.name):'?'));
  const opts=[];if(p>0)opts.push(['Earlier',()=>hsTrophyBook(p-1)]);if(p<np-1)opts.push(['More',()=>hsTrophyBook(p+1)]);opts.push(['Back',()=>hsNpcRoot('hs_chest')]);
  return say('Trophies: '+got+' of '+all.length+' defeated or achieved ('+(p+1)+'/'+np+'). '+lines.join('. ')+'.',opts);
}
const hsNpcRoot=id=>NPCS[id].root();
/* ---- marker spots ---- */
const HS_MAXSLOT=80;
for(let i=0;i<HS_MAXSLOT;i++){
  hsNpc('hs_s'+i,'Marker',()=>hsSlotMenu(i));
  hsNpc('hs_t'+i,'Trophy',()=>hsTroMenu(i));
}
function hsCurrent(){const H=hsHouseAt(LEVEL);return H?{T:H.T,size:H.size,key:hsKey(H.T,H.size)}:null}
function hsStockItems(){const F=hsF();return HS_CATALOGUE.filter(c=>(F.stock[c.id]|0)>0)}
function hsSlotMenu(i){
  const h=hsCurrent();if(!h)return null;const F=hsF(),sl=F.slots[h.key]||{},cur=sl[i]&&HS_CATALOGUE.find(c=>c.id===sl[i]);
  const R=HS_ROOMS[h.size],num=R.slots.slice(0,i+1).filter(s=>s[2]==='d').length;
  const choose=()=>{const st=hsStockItems();
    if(!st.length)return say('You have no furniture in storage. A real estate agent sells it in every town.',[BYE]);
    return hsPaged('Marker '+num+'. Choose a piece to put here.',st.map(c=>['Place: '+c.name+(F.stock[c.id]>1?' ('+F.stock[c.id]+')':''),()=>{hsPlace(h,i,c.id);G._hsDirty=1;msg('You put the '+c.name.toLowerCase()+' on marker '+num+'.','#b8e8a0');return null}]),0,6,['Back',()=>hsSlotMenu(i)])};
  if(!cur)return say('Marker '+num+': nothing stands here. You can place a piece of furniture from your storage.',[['Choose a piece',choose],BYE]);
  return say(cur.name+' (marker '+num+').',[['Choose another piece',choose],['Take it away (into storage)',()=>{hsRemoveSlot(h,i);G._hsDirty=1;msg('The '+cur.name.toLowerCase()+' goes back into storage.','#b8e8a0');return null}],BYE]);
}
function hsTroMenu(i){
  const h=hsCurrent();if(!h)return null;const R=HS_ROOMS[h.size],list=hsEarned(),plan=hsTrophyPlan(h,R,list),tr=plan[i],F=hsF();
  const back=['Back',()=>hsTroMenu(i)];
  if(h.size==='large')return tr?say(tr.kind==='boss'?'Slayer of '+tr.name+'.':tr.name+'.',[BYE]):null;
  const pick=()=>{const used=new Set(Object.values(plan).map(t=>t.id));const free=list.filter(t=>t.id===(tr&&tr.id)||!used.has(t.id));
    if(!free.length)return say('Every trophy you have earned is already on show.',[BYE]);
    return hsPaged('Which trophy goes here?',free.map(t=>[(t.kind==='boss'?'Slayer of ':'')+t.name,()=>{(F.tro[h.key]=F.tro[h.key]||{})[i]=t.id;G._hsDirty=1;msg('The trophy is set on its plinth.','#b8e8a0');return null}]),0,6,back)};
  if(!tr)return say(list.length?'An empty plinth. You have earned '+list.length+' trophies, and they appear on the plinths by themselves; you can also choose one for this place.':'An empty plinth. When the party defeats a boss, its trophy can stand here. Bosses defeated so far: 0.',[...(list.length?[['Choose a trophy',pick]]:[]),BYE]);
  return say((tr.kind==='boss'?'Slayer of '+tr.name+'.':tr.name+'.')+' A trophy of the party.',[['Show a different trophy',pick],['Take it down (leave this plinth empty)',()=>{(F.tro[h.key]=F.tro[h.key]||{})[i]='none';G._hsDirty=1;return null}],BYE]);
}
/* ---- bosses: the first kill is an achievement; the achievements page lists them all ---- */
{const _h=hurtEnemy;hurtEnemy=function(e,dmg){const was=e&&e.hp>0;const r=_h.apply(this,arguments);
  try{if(was&&e.hp<=0&&HS_BOSSES.some(b=>b[0]===e.t)){const F=hsF();if(!F.slain[e.t]){F.slain[e.t]=1;const d=ENEMY_DEF[e.t];msg('Achievement: Slayer of '+(d?d.name:e.t)+'. A trophy for your house.','#ffe36a')}}}catch(x){console.error(x)}
  return r}}
{const _al=achList;achList=function(){const r=_al.apply(this,arguments);
  try{const all=hsTrophyList(),got=all.filter(t=>t.got).length;r.out.push({h:'Bosses and feats ('+got+' of '+all.length+')'});for(const t of all)r.out.push({n:t.kind==='boss'?'Slayer of '+t.name:t.name,s:t.got})}catch(e){console.error(e)}
  return r}}
/* a good meal at a good table brings a little more experience for half a day */
{const _gx=giveXP;giveXP=function(a){try{const F=G.flags.hs;if(F&&F.xpUntil>G.clock)a=Math.round(a*1.1)}catch(e){}return _gx.call(this,a)}}
/* a change made in a house or a town (a purchase, a placed piece) is shown by entering the same level again, once the talk window is closed */
setInterval(()=>{try{if(G&&G._hsDirty&&!G.talk&&!G.cut&&!G.loot&&G.state==='play'&&(hsTownAt(LEVEL)||hsHouseAt(LEVEL))){G._hsDirty=0;G._hsQuiet=1;try{goToLevel(LEVEL,{x:G.P.x,y:G.P.y,f:G.P.f})}finally{G._hsQuiet=0}}}catch(e){console.error(e)}},250);
/* a start link for trying the houses: ?estate=1 gives the party 300,000 gold once, as soon as the game has started (try it with ?town=wenlock&lvl=34&estate=1) */
try{if(new URLSearchParams(location.search).get('estate')){const iv=setInterval(()=>{if(typeof G!=='undefined'&&G.state==='play'&&G.flags){clearInterval(iv);if(!G.flags.hsEstate){G.flags.hsEstate=1;G.gold+=300000;msg('The real estate agents are waiting. You have 300,000 gold to spend on houses and furniture.','#ffe9a0')}}},400)}}catch(e){}
