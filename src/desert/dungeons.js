/* ==========================================================================
   THE LITTLE DUNGEONS OF THE DESERTS: five to ten in every desert, each with its own way in (a hatch, a mound with a
   door, a hole in a great tree, a small or a larger crypt, a spire, a ruin with stairs, or bare stairs going down), its own
   name, and its own plan: three rooms and a passage or two, five rooms, or a labyrinth. Most hold only a coffin, some a
   creature. They are numbered from DNG_BASE upward, and DNG_INFO says which is which (the Achievements page reads it).
   Also here: the two great creatures that walk the Violet Erg and the White Dunes.
   ========================================================================== */
const DNG_BASE=100;
const DNG_TYPES=['Tomb','Crypt','Vault','Hollow','Sepulchre','Barrow','Catacomb','Shrine','Mausoleum','Ossuary','Reliquary','Undercroft'];
const DNG_EPI=['the Midday Sun','the Weeping Jackal','the Last Pharaoh','Whispering Sands','the Hundred Scarabs','the Drowned Star','the Silent Vizier','Amber Dust','the Sleeping Sphinx','Forgotten Kings',
  'the Burning Moon','the Veiled Queen','Golden Ash','the Thirsty Dead','the Salt Priest','Seven Winds','the Jackal Lord','the Crimson Dawn','the Blind Oracle','Endless Thirst',
  'the Copper Serpent','Dust and Honey','the Mirage Court','the Ninth Hour','Hollow Stars','the Bone Gardener','the Glass Prince','the Shattered Hourglass','the Sand Mother','the Lantern Thief',
  'Cinder Lilies','the Bitter Well','the Moth Saint','the Obsidian Door','the Pale Cartographer','Fallen Obelisks','the Dune Singer','the Ivory Beetle','Sunken Gold','the Wandering Tomb',
  'Red Mercy','the Twin Suns','the Cobalt Scribe','Vanished Caravans','the Amber Heron','Quiet Thunder','the Last Oasis','the Iron Asp','Nightfall Sands','the Violet Pilgrim'];
const DNG_ENTRY=[['dhatch','a hatch',.26],['dburrow','a mound with a door',.62],['dtreehole','a hole in a great tree',.95],['dcryptS','a small crypt',.62],['dcryptL','a larger crypt',.9],['dspire','a small spire',1.15],['druinstairs','a ruin with stairs',.62],['dstairs','stairs going down',.3]];
const DNG_DESERTS=[[41,'The Sand Road',14],[43,'The Red Dunes',15],[60,'The Blue Dunes',16],[61,'The Golden Erg',18],[62,'The Violet Erg',21],[63,'The White Dunes',17],[64,'The Flatlands',18]];
const DNG_INFO={};
function buildDng(idx,cls,lvl,entryK){
  const Wd=[21,27,37][cls],Hd=[15,19,29][cls],g=[],fl=[],Rn=(i,m)=>(hash2(idx*17+i,idx*5+3,91)*m)|0;
  for(let y=0;y<Hd;y++){g.push(new Array(Wd).fill('W'));fl.push(new Array(Wd).fill('0'))}
  const rooms=[],cut=(r)=>{for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)g[y][x]='.'};
  const ew=3+Rn(1,3),sx=2+Rn(2,Wd-ew-4);rooms.push({x0:sx,y0:Hd-4,x1:sx+ew-1,y1:Hd-2});
  const want=[3,5,4][cls],big=cls===2?2:0;
  for(let t=0;t<500&&rooms.length<want;t++){
    const w=3+big+Rn(100+t,4),h=3+big+Rn(200+t,2),x0=1+Rn(300+t,Wd-w-2),y0=1+Rn(400+t,Hd-h-2);
    if(rooms.some(r=>x0<=r.x1+2&&x0+w-1>=r.x0-2&&y0<=r.y1+2&&y0+h-1>=r.y0-2))continue;
    rooms.push({x0,y0,x1:x0+w-1,y1:y0+h-1});
  }
  const mid=r=>[(r.x0+r.x1)>>1,(r.y0+r.y1)>>1];
  if(cls===2){ // a labyrinth: a maze of one-cell passages on the odd cells, with a few chambers cut into it
    const seen=new Set(),stack=[[1,1]];g[1][1]='.';seen.add('1,1');
    while(stack.length){
      const [cx,cy]=stack[stack.length-1],nb=[[2,0],[-2,0],[0,2],[0,-2]].map(([a,b])=>[cx+a,cy+b,a,b]).filter(([x,y])=>x>0&&y>0&&x<Wd-1&&y<Hd-1&&!seen.has(x+','+y));
      if(!nb.length){stack.pop();continue}
      const [nx,ny,a,b]=nb[Rn(900+seen.size,nb.length)];g[cy+b/2][cx+a/2]='.';g[ny][nx]='.';seen.add(nx+','+ny);stack.push([nx,ny]);
    }
    rooms.forEach(cut);
  }else{
    rooms.forEach(cut);
    for(let i=1;i<rooms.length;i++){
      let bj=0,bd=1e9;const [ax,ay]=mid(rooms[i]);for(let j=0;j<i;j++){const [bx,by]=mid(rooms[j]),d=Math.abs(ax-bx)+Math.abs(ay-by)+Rn(500+i*9+j,6);if(d<bd){bd=d;bj=j}}
      const [bx,by]=mid(rooms[bj]),hf=Rn(600+i,2)===0;
      const hl=(y,x0,x1)=>{for(let x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)g[y][x]='.'},vl=(x,y0,y1)=>{for(let y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)g[y][x]='.'};
      if(hf){hl(ay,ax,bx);vl(bx,ay,by)}else{vl(ax,ay,by);hl(by,ax,bx)}
    }
  }
  const e0=rooms[0],start={x:mid(e0)[0],y:Hd-2};
  g[Hd-1][start.x]='0';
  const bfs=(blocked)=>{const d=new Int16Array(Wd*Hd).fill(-1),q=[start.x+start.y*Wd];d[q[0]]=0;for(let i=0;i<q.length;i++){const c=q[i],x=c%Wd,y=(c/Wd)|0;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=Wd||ny>=Hd||g[ny][nx]!=='.'||d[ny*Wd+nx]>=0||blocked.has(nx+','+ny))continue;d[ny*Wd+nx]=d[c]+1;q.push(ny*Wd+nx)}}return d};
  const d0=bfs(new Set());let far=0,fd=-1;for(let i=0;i<Wd*Hd;i++)if(d0[i]>fd){fd=d0[i];far=i}
  const fx=far%Wd,fy=(far/Wd)|0;
  for(let y=0;y<Hd;y++)for(let x=0;x<Wd;x++)if(g[y][x]==='.'){fl[y][x]=(Math.abs(x-fx)+Math.abs(y-fy)<=3)?'1':(x>=e0.x0&&x<=e0.x1&&y>=e0.y0&&y<=e0.y1)?'2':'0'}
  const rows=g.map((r,y)=>r.map((c,x)=>c==='W'?(hash2(x,y,60+idx)<.4?'W':'H'):c).join(''));
  const decor=[],enemies=[],items=[],lights=[],blocked=new Set(),used=new Set([start.x+','+start.y]);
  const okBlock=(x,y)=>{const key=x+','+y;if(g[y][x]!=='.'||used.has(key)||blocked.has(key))return false;blocked.add(key);const d=bfs(blocked);let ok=true;for(let yy=0;yy<Hd&&ok;yy++)for(let xx=0;xx<Wd;xx++)if(g[yy][xx]==='.'&&!blocked.has(xx+','+yy)&&d[yy*Wd+xx]<0){ok=false;break}if(!ok)blocked.delete(key);return ok};
  const put=(k,x,y,o)=>{if(o&&o.block&&!okBlock(x,y))return false;used.add(x+','+y);decor.push(Object.assign({k,x,y,block:false},o||{}));return true};
  const mummy=Rn(950,4)===0;
  // the coffin lies at the far end
  if(!put('sarcoph',fx,fy,Object.assign({block:true,goldAmt:90+idx%7*30},mummy?{ambush:['mummy']}:{}))){put('sarcoph',fx,fy-1,{block:true})}
  if(Rn(951,6)===0){const r=rooms[1+Rn(952,rooms.length-1)],cc=[];for(let y=r.y0;y<=r.y1;y++)for(let x=r.x0;x<=r.x1;x++)if(Math.abs(x-fx)+Math.abs(y-fy)>2)cc.push([x,y]);const c=cc.length?cc[Rn(953,cc.length)]:null;if(c)put('chest',c[0],c[1],{block:true,magic:DS_MAGIC_TOMB[(idx*7+3)%DS_MAGIC_TOMB.length],goldAmt:200+idx%5*40})}
  // light: a brazier or two in the first chamber, and unseen lamps along the way
  for(const [x,y] of [[e0.x0,e0.y0],[e0.x1,e0.y0]])if(y<Hd-3&&put('brazier',x,y,{block:true}))lights.push([x,y]);
  rooms.forEach((r,i)=>{if(i){const [mx,my]=mid(r);lights.push([mx,my])}});
  for(let y=1;y<Hd-1;y+=5)for(let x=1;x<Wd-1;x+=5)if(g[y][x]==='.')lights.push([x,y]);
  rooms.forEach((r,i)=>{if(i>0&&Rn(700+i,3)===0){const x=r.x0+Rn(710+i,r.x1-r.x0+1),y=r.y0+Rn(720+i,r.y1-r.y0+1);if(Math.abs(x-fx)+Math.abs(y-fy)>2)put('vase'+(i%4),x,y,{block:true,plain:true})}});
  // now and then something is awake in there
  if(Rn(960,100)<38){
    const T=['scorpion','mummy','nomad','dskeleton','dskeleton'][Rn(961,5)],n=1+(Rn(962,3)===0?1:0);
    for(let i=0;i<n;i++){const cand=[];for(let y=1;y<Hd-1;y++)for(let x=1;x<Wd-1;x++)if(g[y][x]==='.'&&!used.has(x+','+y)&&d0[y*Wd+x]>10)cand.push([x,y]);if(cand.length){const p=cand[Rn(970+i,cand.length)];used.add(p[0]+','+p[1]);enemies.push({t:T,x:p[0],y:p[1],lvl})}}
  }
  return {rows,fm:fl.map(r=>r.join('')),decor,enemies,items,lights,start:{x:start.x,y:start.y,f:0}};
}
(function placeDungeons(){
  let idx=0;
  DNG_DESERTS.forEach(([dl,dname,dlvl],di)=>{
    const L=LEVELS[dl],rows=L.rows,H=rows.length,W=rows[0].length,count=5+((hash2(di,3,901)*6)|0);
    L.decor=L.decor||[];const placed=[];
    for(let k=0;k<2000&&placed.length<count;k++){
      const x=24+((hash2(k,di,811)*(W-48))|0),y=24+((hash2(k,di,812)*(H-48))|0);
      if(rows[y][x]!=='.'||Math.hypot(x-L.start.x,y-L.start.y)<30)continue;
      if(dl===41&&(y>140||Math.abs(x-rdCentre(y))<7))continue;
      if(dl===43&&y<85&&Math.abs(x-rsCentre(y))<7)continue;
      if(placed.some(p=>Math.hypot(p.x-x,p.y-y)<22))continue;
      let bad=false;for(let dy=-4;dy<=4&&!bad;dy++)for(let dx=-4;dx<=4;dx++){const c=L.fmap&&L.fmap[y+dy]&&L.fmap[y+dy][x+dx];if(dl!==41&&(c==='3'||c==='4')){bad=true;break}}
      if(bad)continue;
      if(L.decor.some(d=>Math.abs(d.x-x)<=3&&Math.abs(d.y-y)<=3)||(L.scenery||[]).some(s=>Math.abs(s.wx-x)<2&&Math.abs(s.wy-y)<2))continue;
      // somewhere to come out: a free open cell beside the entrance
      let out=null;for(const [dx,dy,f] of [[0,1,2],[1,0,1],[-1,0,3],[0,-1,0]]){if(rows[y+dy][x+dx]==='.'&&!L.decor.some(d=>d.x===x+dx&&d.y===y+dy)){out={x:x+dx,y:y+dy,f};break}}
      if(!out)continue;
      const lvlN=DNG_BASE+idx,cls=[0,1,0,1,2,0,1,2,0,1][idx%10],entry=DNG_ENTRY[(idx*3+di)%DNG_ENTRY.length];
      const B=buildDng(idx,cls,dlvl,entry[0]);
      const name=DNG_TYPES[(idx*5+3)%12]+' of '+DNG_EPI[idx%DNG_EPI.length];
      LEVELS[lvlN]={rows:B.rows,fmap:B.fm,start:B.start,enemies:B.enemies,items:B.items,decor:B.decor,lights:B.lights,secrets:[],
        amb:.34,ceilH:1.3,floor:'tombslab',floorSet:['tombslab','tombgold','tombsand','tombdark','tomblapis','tombred'],ceil:'tomb',name,label:'Desert Dungeon',diff:dlvl,
        portals:[{to:dl,x:out.x,y:out.y,f:out.f,tex:'tomb'}]};
      LEVEL_NAMES[lvlN]=name;EMBERS_LEVELS.push(lvlN);
      DNG_INFO[lvlN]={name,desert:dname,cls,entry:entry[1]};
      L.decor.push({k:entry[0],x,y,block:true,enter:{to:lvlN,x:B.start.x,y:B.start.y,f:0}});
      placed.push({x,y});idx++;
    }
  });
})();
function makeDngArt(){
  if(typeof makePyramidArt==='function')makePyramidArt();
  if(typeof makeCaravanArt==='function')makeCaravanArt();
  for(const n of Object.keys(DNG_INFO))LEVELS[n].chars=LEVEL42_DATA.chars;
  for(const [k,,h] of DNG_ENTRY)NPC_H[k]=h;
}

/* ---- the great creatures: a fire lizard in the south of the Violet Erg, a patrolling cyclops over the White Dunes ---- */
Object.assign(ENEMY_DEF,{
  firelizard:{name:'Cinderback, the Fire Lizard',hp:70,dmg:[6,10],hit:.8,w:1.7,img:'firelizard',xp:160,gold:[0,0],goldFixed:400,dropMagic:1,aboveParty:3,speed:1,verb:'scorches',ranged:3,shot:'a gout of flame',boss:true},
  cyclops:{name:'The Wandering Cyclops',hp:90,dmg:[6,10],hit:.78,w:1.35,img:'cyclops',xp:220,gold:[0,0],goldFixed:500,dropMagic:2,aboveParty:10,speed:1,verb:'clubs',patrol:true,boss:true}});
(function placeBosses(){
  const V=LEVELS[62],cx=VER.CX,cy=262;
  for(const list of [V.enemies,V.items,V.decor])for(let i=list.length-1;i>=0;i--)if(Math.hypot(list[i].x-cx,list[i].y-cy)<18)list.splice(i,1);
  for(let a=0;a<10;a++){const x=Math.round(cx+Math.cos(a/10*TAU)*10),y=Math.round(cy+Math.sin(a/10*TAU)*10);if(a!==5&&a!==4)V.decor.push({k:'dpillar'+(a%2),x,y,block:true})} // a ring of broken pillars, open to the north
  V.decor.push({k:'dbones',x:cx-3,y:cy+3,block:false},{k:'dbones',x:cx+4,y:cy-2,block:false});
  V.enemies.push({t:'firelizard',x:cx,y:cy,lvl:40});
  const W=LEVELS[63],px=125,py=95;
  for(let i=W.enemies.length-1;i>=0;i--)if(Math.hypot(W.enemies[i].x-px,W.enemies[i].y-py)<14)W.enemies.splice(i,1);
  W.enemies.push({t:'cyclops',x:px,y:py,lvl:44,home:{x:px,y:py}});
})();

// skeletons: now and then in the tombs, and a few wandering the open sand
(function placeSkeletons(){
  const tomb=LEVELS[42];let n=0;
  for(const e of tomb.enemies)if((e.t==='mummy'||e.t==='scorpion')&&n<2&&hash2(e.x,e.y,555)<.5){e.t='dskeleton';n++}
  if(n<2)for(const e of tomb.enemies)if(e.t==='scorpion'&&n<2){e.t='dskeleton';n++}
  for(let k=0;k<BURROW_N;k++)if(k%3===1){const L=LEVELS[BURROW_BASE+k];if(L&&L.enemies.length)L.enemies[0].t='dskeleton'}
  for(const [lv,cnt] of [[41,4],[43,5],[60,4],[61,6],[62,6],[63,5],[64,5]]){
    const L=LEVELS[lv],rows=L.rows,H=rows.length,W=rows[0].length;let p=0;
    for(let k=0;k<500&&p<cnt;k++){
      const x=14+((hash2(k,lv,821)*(W-28))|0),y=14+((hash2(k,lv,822)*(H-28))|0);
      if(lv===41&&y>140)continue;
      if(rows[y][x]!=='.'||Math.hypot(x-L.start.x,y-L.start.y)<30)continue;
      if(L.enemies.some(e=>Math.abs(e.x-x)+Math.abs(e.y-y)<6)||L.items.some(i=>i.x===x&&i.y===y)||(L.decor||[]).some(d=>Math.abs(d.x-x)<=1&&Math.abs(d.y-y)<=1))continue;
      L.enemies.push({t:'dskeleton',x,y,lvl:lv===62?20:lv===61?18:lv===60?16:lv===43?15:14});p++;
    }
  }
})();

// the Sand Road and the Red Dunes carry about sixty creatures each: thin the crowds evenly across the land
(function thinCrowds(){
  const thin=(lv,cut)=>{
    const L=LEVELS[lv];
    for(const [t,r] of Object.entries(cut)){
      const idx=[];L.enemies.forEach((e,i)=>{if(e.t===t)idx.push(i)});
      const kill=new Set();for(let i=0;i<r&&i<idx.length;i++)kill.add(idx[Math.floor(i*idx.length/r)]);
      L.enemies=L.enemies.filter((e,i)=>!kill.has(i));
    }
  };
  thin(41,{dwolf:12,nomad:18});
  thin(43,{scorpion:12,nomad2:5,nomad:6,mummy:4,dwolf:3});
})();

// more skeletons, fewer wolves: every second desert wolf in the open deserts becomes a skeleton, and a few more skeletons walk the tomb
(function wolvesToSkeletons(){
  for(const lv of [41,43,60,61,62,63,64]){let i=0;for(const e of LEVELS[lv].enemies)if(e.t==='dwolf'){if(i++%2===0)e.t='dskeleton'}}
  let n=0;for(const e of LEVELS[42].enemies)if(e.t==='scorpion'&&n<3&&hash2(e.x,e.y,556)<.35){e.t='dskeleton';n++}
  for(const e of LEVELS[42].enemies)if(e.t==='scorpion'&&n<3){e.t='dskeleton';n++}
})();

// six of the Tomb of Sut's scorpions give way to cobras
(function cobrasInTomb(){
  const idx=[];LEVELS[42].enemies.forEach((e,i)=>{if(e.t==='scorpion')idx.push(i)});
  for(let k=0;k<6&&k<idx.length;k++)LEVELS[42].enemies[idx[Math.floor(k*idx.length/6)]].t='cobra';
})();

// the small desert dungeons play the Egyptian music, streamed: change this list to change the tracks.
// options: music_sands_tomb (2:51), music_sands_forgotten (2:33), music_sands_holycity (8:11), music_sands_goldenkey (9:16), music_sands_vibration (13:03)
const DNG_MUSIC=['music_sands_vibration'];
(function dungeonMusic(){
  const lv=Object.keys(DNG_INFO).map(Number);for(let k=0;k<BURROW_N;k++)lv.push(BURROW_BASE+k);
  for(const n of lv){STREAM_LISTS[n]=DNG_MUSIC;const i=EMBERS_LEVELS.indexOf(n);if(i>=0)EMBERS_LEVELS.splice(i,1)}
})();
