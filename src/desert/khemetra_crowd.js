/* ==========================================================================
   KHEMETRA: THE CROWD. Markets with stalls and sellers, gardens and fountains, palms along the wide streets, vases and
   urns, lamps, cats in the alleys, the people of the streets, and the few who mean harm.
   ========================================================================== */
khNpc('kh_citizen','A citizen','kh_npc1_0',d=>{
  const F=G.flags,k='kc_'+d.x+'_'+d.y,i=(F[k]||0),L=d.kl||[0,1,2];
  F[k]=i+1;
  return say(KH_GOSSIP[L[i%L.length]%KH_GOSSIP.length],[BYE]);
});
function khCrowd(C,L){
  const W=C.W,H=C.H,idx=C.idx,rng=khRng(31337);
  const open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&!C.solid[idx(x,y)];
  const d3=new Uint8Array(W*H),d5=new Uint8Array(W*H);
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    if(!open(x,y))continue;
    let a=true;for(let dy=-1;dy<=1&&a;dy++)for(let dx=-1;dx<=1;dx++)if(!open(x+dx,y+dy)){a=false;break}
    if(!a)continue;d3[idx(x,y)]=1;
    let b=true;for(let dy=-2;dy<=2&&b;dy++)for(let dx=-2;dx<=2;dx++)if(!open(x+dx,y+dy)){b=false;break}
    if(b)d5[idx(x,y)]=1;
  }
  const occ=new Uint8Array(W*H);        // decor, people or a reserved cell
  const reserve=(x,y,r)=>{for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H)occ[idx(xx,yy)]=1}};
  // doors, the palace gate, the gate of the city and the hatch keep clear
  for(const m of C.modules)if(m.doorCells&&m.lvl!==undefined){for(const [x,y] of m.doorCells){const d=KH_DIRS[m.face];reserve(x+d[0],y+d[1],2)}}
  reserve(KH_PALACE_FRONT.x,KH_PALACE_FRONT.y,3);reserve(KH.CX,H-KH.WALL-4,6);reserve(KH_HATCH.x,KH_HATCH.y,2);
  const decor=L.decor,enemies=L.enemies;
  const add=(o)=>{decor.push(o);occ[idx(o.x,o.y)]=1;return o};
  const freeAt=(x,y,need3)=>open(x,y)&&C.reach[idx(x,y)]&&!occ[idx(x,y)]&&(!need3||d3[idx(x,y)]);
  const near=(x,y,rad,need3)=>{for(let r=0;r<=rad;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;if(freeAt(x+dx,y+dy,need3))return [x+dx,y+dy]}return null};
  const prop=(role,x,y,o)=>{const k=khProp(role);if(IMG[k]&&k.startsWith('kh_'))NPC_H[k]=khPropH(role);return add(Object.assign({k,x,y,block:true,deco:true},o||{}))};
  const vases=['vase0','vase1','vase2','vase3'];
  // ---- the squares: a fountain or an obelisk in the middle, stalls in the markets ----
  for(const p of C.plazas){
    const cx=(p.x0+p.x1)>>1,cy=(p.y0+p.y1)>>1;
    reserve(cx,cy,0);
    if(p.z===2){prop('fountain',cx,cy);for(const [dx,dy] of [[-3,0],[3,0],[0,-3],[0,3]]){const q=near(cx+dx,cy+dy,1,true);if(q)prop('bench',q[0],q[1],{walk:true,block:false})}}
    else if(p.z===4){prop('obelisk',cx,cy);for(const [dx,dy] of [[-4,0],[4,0]]){const q=near(cx+dx,cy+dy,1,true);if(q)prop('statue',q[0],q[1])}}
    else if(p.z===5){prop('fountain',cx,cy)}
    else if(p.z===3){prop('well',cx,cy)}
    else if(p.z===1){
      // rows of stalls with aisles between them, and a seller at each
      const roles=['stallA','stallB','stallC','stallD','stallE','stallF'],goods=['melons','amphorae','hay','veg','carpets','copper'];
      let n=0;
      for(let y=p.y0+3;y<=p.y1-3;y+=5)for(let x=p.x0+3;x<=p.x1-3;x+=5){
        if(Math.abs(x-cx)<2&&Math.abs(y-cy)<2)continue;
        if(!freeAt(x,y,true))continue;
        prop(roles[(n+((x*7+y)>>3))%6],x,y);
        const sx=freeAt(x,y+1,true)?[x,y+1]:near(x,y+1,1,true);
        if(sx&&n%2===0)khAddCitizen(decor,occ,idx,sx[0],sx[1],'market',rng);
        if(n%3===0){const q=near(x+2,y,1,true);if(q)prop(goods[n%6],q[0],q[1],{walk:true,block:false})}
        n++;
      }
    }
  }
  // ---- the hatch to the cisterns, hidden behind the potters stalls ----
  const hq=near(KH_HATCH.x,KH_HATCH.y,2,false)||[KH_HATCH.x,KH_HATCH.y];
  KH_HATCH.x=hq[0];KH_HATCH.y=hq[1];
  decor.push({k:'dhatch',x:hq[0],y:hq[1],block:true,enter:{to:KH_CISTERN,x:1,y:29,f:0},hatch:true});occ[idx(hq[0],hq[1])]=1;
  // ---- palms, vases and lamps along the streets: how wide a street is decides how much stands in it ----
  const run=new Uint8Array(W*H*2);
  for(let y=0;y<H;y++){let x=0;while(x<W){if(!open(x,y)){x++;continue}let e=x;while(e<W&&open(e,y))e++;for(let k=x;k<e;k++)run[idx(k,y)*2]=Math.min(255,e-x);x=e}}
  for(let x=0;x<W;x++){let y=0;while(y<H){if(!open(x,y)){y++;continue}let e=y;while(e<H&&open(x,e))e++;for(let k=y;k<e;k++)run[idx(x,k)*2+1]=Math.min(255,e-y);y=e}}
  const width=i=>Math.min(run[i*2],run[i*2+1]);
  const wallNear=(x,y)=>KH_DIRS.some(([a,b])=>!open(x+a,y+b));
  for(let y=4;y<H-4;y++)for(let x=4;x<W-4;x++){
    const i=idx(x,y);if(occ[i]||!open(x,y)||!C.reach[i])continue;
    const r=khHash(x,y,11),wd=width(i),z=C.zone[i];
    if(z===0&&wd<5){ // a narrow street: a few things along the walls, the middle kept free
      if(!d3[i]&&wd<3)continue;
      if(!wallNear(x,y))continue;
      if(r<.02)add({k:'dpalm'+((x+y)&3),x,y,block:true,sc:.8+khHash(x,y,12)*.3});
      else if(r<.07)add({k:vases[(x+y)&3],x,y,block:false,walk:true,sc:.9+khHash(x,y,13)*.3});
      else if(r<.075)add({k:'urn',x,y,block:false,walk:true});
      continue;
    }
    if(d3[i]&&!d5[i]){ // a cell one in from the wall of a wide street
      if(r<.16){add({k:['dpalm0','dpalm1','dpalm2','dpalm3'][((x*3+y)>>1)&3],x,y,block:true,sc:.9+khHash(x,y,12)*.4})}
      else if(r<.22){add({k:vases[(x+y)&3],x,y,block:false,walk:true,sc:.9+khHash(x,y,13)*.3})}
      else if(r<.235){add({k:'urn',x,y,block:false,walk:true})}
    }else if(d5[i]){
      if(z===2&&r<.05)add({k:['dpalm0','dpalm1','dpalm2','dpalm3'][(x+y)&3],x,y,block:true,sc:.9+khHash(x,y,12)*.5});
      else if(z===6&&r<.03)add({k:['dpalm0','dpalm2'][(x+y)&1],x,y,block:true,sc:1.1});
      else if(z===0&&r<.012)add({k:'dpalm'+((x+y)&3),x,y,block:true});
      else if(r<.01)add({k:vases[(x*5+y)&3],x,y,block:false,walk:true});
      else if(r>.995)add({k:'lamp',x,y,block:false,walk:true});
    }
  }
  // lamps down the great avenue
  for(let y=250;y<H-10;y+=10)for(const x of [KH.CX-5,KH.CX+5]){const q=near(x,y,1,false);if(q)add({k:'lamp',x:q[0],y:q[1],block:false,walk:true})}
  // ---- cats in the alleys ----
  const cats=[[40,180],[330,120],[190,60],[240,350]];
  cats.forEach(([cx,cy],ci)=>{
    let best=null;for(let r=0;r<40&&!best;r++)for(let dy=-r;dy<=r&&!best;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;const x=cx+dx,y=cy+dy;if(!freeAt(x,y,false))continue;
      let w=0;for(const [a,b] of KH_DIRS)if(!open(x+a,y+b))w++;if(w>=1&&!occ[idx(x,y)]){best=[x,y];break}}
    if(best)add({k:khFaceKey('kh_anim1_0'),x:best[0],y:best[1],block:true,npc:'kh_cat',cat:ci,sc:.8});
  });
  // ---- the named people of the quests, each in their own corner ----
  const anchors={kh_sabah:[60,330],kh_hapi:[196,102],kh_dalila:[288,110],kh_cheops:[196,322],kh_rami:[203,386],kh_eman:[104,106],kh_usi:[196,250],kh_yara:[300,196],kh_pia:[108,298],kh_anuket:[204,104],kh_meryt:[204,246],kh_nadia:[286,298]};
  for(const [id,[ax,ay]] of Object.entries(anchors)){
    const q=near(ax,ay,8,true);if(!q)continue;const kp=KH_KEEPERS[id];if(!kp)continue;
    add({k:khFaceKey(kp.face),x:q[0],y:q[1],block:true,npc:id,sc:kp.sc||1});
  }
  { // the granary keeper waits outside the granary
    const b=KH_BUILDINGS.find(x=>x.id==='granary');if(b&&b.front){const q=near(b.front[0],b.front[1],6,true);if(q){const kp=KH_KEEPERS.kh_gebu;add({k:khFaceKey(kp.face),x:q[0],y:q[1],block:true,npc:'kh_gebu',sc:1})}}
  }
  // ---- the gate guards, the palace guards ----
  for(const [x,y] of [[196,388],[204,388]]){const q=near(x,y,2,true);if(q)add({k:'kh_npc3_0',x:q[0],y:q[1],block:true,npc:'kh_gateguard',sc:1})}
  for(const [x,y] of [[196,236],[204,236],[196,241],[204,241]]){const q=near(x,y,2,true);if(q)add({k:'kh_npc3_1',x:q[0],y:q[1],block:true,npc:'kh_gateguard',sc:1})}
  // ---- the people of the streets ----
  let crowd=0;const want=520;
  for(let tries=0;tries<400000&&crowd<want;tries++){
    const x=6+((rng()*(W-12))|0),y=6+((rng()*(H-12))|0),i=idx(x,y);
    if(!d3[i]||occ[i]||!C.reach[i])continue;
    if(C.zone[i]===6&&rng()<.7)continue;
    khAddCitizen(decor,occ,idx,x,y,(rng()<.12)?'guard':'street',rng);crowd++;
  }
  // ---- those who mean harm: a thief in the Old Square, wild dogs and the restless dead in the old quarter ----
  const enemyAt=(cx,cy,rad,t,lvl)=>{const q=near(cx,cy,rad,true);if(q&&Math.abs(q[0]-KH.CX)+Math.abs(q[1]-H)>60){enemies.push({t,x:q[0],y:q[1],lvl:lvl||16});occ[idx(q[0],q[1])]=1}};
  khKeepOpen(C,L);
  enemyAt(60,60,6,'nomad2',17);
  for(const [x,y] of [[70,90],[40,100],[90,60],[30,40],[100,100],[56,120]])enemyAt(x,y,12,'dwolf',16);
  for(const [x,y] of [[80,40],[50,80],[110,70],[34,60],[96,92],[64,100]])enemyAt(x,y,12,'dskeleton',16);
}
/* nothing the crowd or the markets place may seal off a part of the city: blocking things that wall off reachable ground are made walk-through */
function khKeepOpen(C,L){
  const W=C.W,H=C.H,idx=C.idx,blk=new Uint8Array(W*H),by=new Map();
  for(const d of L.decor)if(d.block){blk[idx(d.x,d.y)]=1;by.set(idx(d.x,d.y),d)}
  for(let pass=0;pass<60;pass++){
    const seen=new Uint8Array(W*H),q=[idx(KH.CX,H-KH.WALL-4)];seen[q[0]]=1;
    while(q.length){const c=q.pop(),x=c%W,y=(c/W)|0;for(const [dx,dy] of KH_DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const i=idx(nx,ny);if(seen[i]||C.solid[i]||blk[i])continue;seen[i]=1;q.push(i)}}
    let fixed=0;
    for(const [i,d] of by){
      if(!blk[i])continue;
      const x=i%W,y=(i/W)|0;let a=false,b=false;
      for(const [dx,dy] of KH_DIRS){const j=idx(x+dx,y+dy);if(C.solid[j])continue;if(seen[j])a=true;else if(C.reach[j]&&!blk[j])b=true}
      if(a&&b){blk[i]=0;d.block=false;d.walk=true;by.delete(i);fixed++}
    }
    if(!fixed)break;
  }
  // anything still unreachable: free every blocker in sight of it
  const seen=new Uint8Array(W*H),q=[idx(KH.CX,H-KH.WALL-4)];seen[q[0]]=1;
  while(q.length){const c=q.pop(),x=c%W,y=(c/W)|0;for(const [dx,dy] of KH_DIRS){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W||ny>=H)continue;const i=idx(nx,ny);if(seen[i]||C.solid[i]||blk[i])continue;seen[i]=1;q.push(i)}}
  let lost=0;for(let i=0;i<W*H;i++)if(C.reach[i]&&!seen[i]&&!blk[i])lost++;
  L.khLost=lost;
}
/* a person of the street: a face, a name, and three things they have to say */
function khAddCitizen(decor,occ,idx,x,y,kind,rng){
  const F=KH_FACES,pick=a=>a[(rng()*a.length)|0];
  const face=kind==='guard'?pick(F.guards):kind==='market'?pick(F.men.concat(F.women)):rng()<.1?pick(F.kids):rng()<.06?pick(F.poor):rng()<.5?pick(F.men):pick(F.women);
  const nm=KH_NAMES[(rng()*KH_NAMES.length)|0]+(kind==='market'?' the seller':kind==='guard'?' of the watch':' '+KH_TITLES[(rng()*KH_TITLES.length)|0]);
  const kl=[(rng()*KH_GOSSIP.length)|0,(rng()*KH_GOSSIP.length)|0,(rng()*KH_GOSSIP.length)|0];
  decor.push({k:khFaceKey(face),x,y,block:true,npc:'kh_citizen',kname:nm,kl,sc:(KH_NPC_H[face]?KH_NPC_H[face]/.82:1)*(.95+rng()*.1)});
  occ[idx(x,y)]=1;
}
khNpc('kh_gateguard','A guard of the watch','kh_npc3_0',()=>say('Welcome to Khemetra, the Golden City. Keep your blades sheathed in the streets, and your purses close. The palace is at the north end of the great avenue.',[BYE]));
/* what the city looks like after what the party has done */
function khApplyState(){
  const F=G.flags;
  for(const d of G.decor){
    if(d.hatch)d.found=!F.khWizardKnown;
    if(d.npc==='kh_cat'&&F.khCats&&F.khCats[d.cat]){d.found=true;d.block=false}
  }
  buildDecorMap();
}
