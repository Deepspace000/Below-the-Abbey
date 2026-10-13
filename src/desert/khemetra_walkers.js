/* ==========================================================================
   KHEMETRA: THE WALKERS. The city is never still: guards patrol the streets (most of them the quiet ones), citizens go about their
   day, donkeys with baskets plod along, goats and cats wander, a few dogs trot. They are only pictures that move from square to
   square along the open streets; they are not blocked by, and do not block, the party, and they fade when the party stands beside them.
   ========================================================================== */
const KH_WALK={guards:170,people:300,donkeys:50,goats:50,cats:70,dogs:24};
const KH_FLIP={};
function khFlip(k){ // the animals face left in their pictures: a mirrored copy is used when one walks to the right
  let c=KH_FLIP[k];if(c)return c;const im=IMG[k];if(!im)return null;
  c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.translate(im.width,0);x.scale(-1,1);x.drawImage(im,0,0);
  return KH_FLIP[k]=c;
}
function khMakeWalkers(C,L,rng,open,run){
  const W=C.W,H=C.H,idx=C.idx,blk=new Uint8Array(W*H),ok=new Uint8Array(W*H),quiet=new Uint8Array(W*H);
  for(const d of L.decor)if(d.block||d.enter)blk[idx(d.x,d.y)]=1;
  const okC=[],quietC=[];
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    const i=idx(x,y);if(!open(x,y)||!C.reach[i]||blk[i])continue;
    ok[i]=1;
    if(C.zone[i]===0&&Math.min(run[i*2],run[i*2+1])<=4&&!khInPQ(x,y)){quiet[i]=1;quietC.push(i)}else if(!khInPQ(x,y))okC.push(i);
  }
  L.khWalkOK=ok;L.khWalkQuiet=quiet;L.khWalkW=W;
  const F=KH_FACES,pick=a=>a[(rng()*a.length)|0],ws=[];
  const spawn=(n,cells,make)=>{for(let k=0;k<n&&cells.length;k++){const i=cells[(rng()*cells.length)|0];make(i%W,(i/W)|0)}};
  const add=(kind,key,x,y,sp,sc,an,extra)=>{
    if(!IMG[key])return;
    ws.push(Object.assign({t:kind,k:key,x,y,tx:x,ty:y,dx:rng()<.5?1:-1,dy:0,sp:sp*(.85+rng()*.3),sc,an,pause:rng()*3,seed:rng()*10,stub:{walk:true,k:key}},extra||{}));
  };
  const faceK=f=>khFaceKey(f);
  // guards: mostly in the narrow quiet streets, a few in the busy parts
  spawn(Math.round(KH_WALK.guards*.8),quietC,(x,y)=>add('guard',faceK(pick(['kh_npc3_0','kh_npc3_0','kh_npc3_2','kh_npc3_1'])),x,y,.8,1,false,{guard:true}));
  spawn(Math.round(KH_WALK.guards*.2),okC,(x,y)=>add('guard',faceK(pick(['kh_npc3_0','kh_npc3_2','kh_npc3_1'])),x,y,.8,1,false,{guard:true}));
  // citizens of every sort, the traffic of the streets
  spawn(KH_WALK.people,okC.concat(quietC),(x,y)=>{const r=rng(),f=r<.08?pick(F.kids):r<.55?pick(F.men):pick(F.women);add('person',faceK(f),x,y,.95,.95+rng()*.1,false)});
  spawn(KH_WALK.donkeys,okC.concat(quietC),(x,y)=>add('donkey','kh_anim1_4',x,y,.75,1,true));
  spawn(KH_WALK.goats,okC.concat(quietC),(x,y)=>add('goat','kh_anim1_3',x,y,.9,1,true));
  spawn(KH_WALK.cats,quietC.concat(okC),(x,y)=>add('cat','kh_anim1_0',x,y,1.15,.8,false));
  spawn(KH_WALK.dogs,okC.concat(quietC),(x,y)=>add('dog','kh_anim1_1',x,y,1.3,1,true));
  for(const w of ws)khWalkNext(L,w,true);
  L.walkers=ws;
}
/* pick the next square to walk to: carry on straight most of the time, seldom turn back, and guards stay in the quiet streets */
function khWalkNext(L,w,first){
  const W=L.khWalkW,ok=L.khWalkOK,cx=Math.round(w.x),cy=Math.round(w.y);
  w.x=cx;w.y=cy;
  let best=null,tot=0;const opts=[];
  for(const [dx,dy] of KH_DIRS){
    const nx=cx+dx,ny=cy+dy,i=ny*W+nx;if(!ok[i])continue;
    let wt=1;
    if(dx===w.dx&&dy===w.dy)wt=5;else if(dx===-w.dx&&dy===-w.dy)wt=.15;
    if(w.guard&&!L.khWalkQuiet[i])wt*=.2;
    opts.push([dx,dy,wt]);tot+=wt;
  }
  if(!opts.length){w.pause=2;return}
  let r=Math.random()*tot;for(const o of opts){r-=o[2];if(r<=0){best=o;break}}
  best=best||opts[opts.length-1];
  w.dx=best[0];w.dy=best[1];w.tx=cx+best[0];w.ty=cy+best[1];
  if(!first){const p=w.guard?.2:w.t==='cat'?.3:.1;if(Math.random()<p)w.pause=1+Math.random()*(w.guard?5:w.t==='cat'?6:3)}
}
function khWalkTick(dt){
  const L=LEVELS[44],ws=L&&L.walkers;if(!ws)return;
  dt=Math.min(dt,.1);
  for(const w of ws){
    if(w.pause>0){w.pause-=dt;continue}
    const ex=w.tx-w.x,ey=w.ty-w.y,d=Math.hypot(ex,ey),st=w.sp*dt;
    if(d<=st){w.x=w.tx;w.y=w.ty;khWalkNext(L,w)}else{w.x+=ex/d*st;w.y+=ey/d*st}
  }
}
function khWalkSprites(L,cx,cy,out){
  const sp=G._spr,dX=sp?sp[2]:1,dY=sp?sp[3]:0;
  for(const w of L.walkers){
    const rx=w.x-cx,ry=w.y-cy;if(rx*rx+ry*ry>700)continue;
    let img=IMG[w.k];if(!img)continue;
    if(w.an&&(-dY*w.dx+dX*w.dy)>0)img=khFlip(w.k)||img;
    const moving=!(w.pause>0);
    out.push({x:w.x+.5,y:w.y+.5,img,w:(NPC_H[w.k]?NPC_H[w.k]*img.width/img.height:.8)*w.sc,bob:moving?Math.abs(Math.sin(G.time*(w.t==='cat'||w.t==='dog'?10:7)+w.seed))*.03:0,decor:w.stub});
  }
}
