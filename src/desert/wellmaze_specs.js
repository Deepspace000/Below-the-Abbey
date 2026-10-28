/* ==========================================================================
   THE WELL MAZE: the plan of the four levels (prefix wm / WM). Rooms are blocks of lattice nodes (nw by nh nodes = 2nw-1 by 2nh-1 cells); see wellmaze_gen.js.
   Each level is made once, when the file loads (pure code), so the stairs, the arrival squares and the keys are known before any level is entered.
   ========================================================================== */
WM.SPECS=[
 {seed:49711,rooms:[ // 0: 497 Under the Wenlock Well
  {id:'shaft',kind:'start',nw:3,nh:3,fixed:[9,0],maxDoors:2},
  {id:'down',kind:'stairOut',nw:2,nh:2,zone:[0,1,.62,1],maxDoors:1},
  {id:'camp',kind:'camp',nw:3,nh:2,zone:[.15,.85,.12,.4]},
  {id:'cistern',kind:'cistern',nw:4,nh:3,zone:[0,.45,.3,.75]},
  {id:'cellar',kind:'cellar',nw:4,nh:3,zone:[.4,1,.12,.5]},
  {id:'shrine',kind:'shrine',nw:3,nh:3,zone:[0,1,.35,.8]},
  {id:'mine',kind:'mine',nw:4,nh:4,zone:[.45,1,.4,.85]},
  {id:'island',kind:'island',nw:2,nh:2,sealed:true,noDoor:true,zone:[0,.4,.55,1]},
  {id:'v1',kind:'vault',nw:3,nh:2,sealed:true,vault:'lever1',zone:[0,1,.3,.9]},
  {id:'v2',kind:'vault',nw:3,nh:2,sealed:true,vault:'weights',zone:[0,1,.3,.9]}]},
 {seed:49823,rooms:[ // 1: 498 The Violet Maze
  {id:'arrive',kind:'start',nw:2,nh:2,zone:[.35,.65,.78,1],maxDoors:1},
  {id:'down',kind:'stairOut',nw:2,nh:2,zone:[0,1,0,.3],maxDoors:1},
  {id:'grotto',kind:'grotto',nw:5,nh:4,zone:[0,.5,.05,.45]},
  {id:'library',kind:'library',nw:5,nh:3,zone:[.5,1,.05,.4]},
  {id:'mirror',kind:'mirror',nw:4,nh:4,zone:[.3,.7,.35,.65]},
  {id:'spiders',kind:'spiders',nw:5,nh:4,zone:[.5,1,.45,.85]},
  {id:'fungus',kind:'fungus',nw:5,nh:4,zone:[0,.5,.5,.9]},
  {id:'shrine',kind:'shrine',nw:3,nh:3,zone:[0,1,.2,.8]},
  {id:'cistern',kind:'cistern',nw:4,nh:3,zone:[0,1,.5,.95]},
  {id:'riddle',kind:'riddle',nw:2,nh:1,sealed:true,zone:[0,1,.1,.9]},
  {id:'v3',kind:'vault',nw:3,nh:2,sealed:true,vault:'pair',zone:[0,1,.1,.9]},
  {id:'v4',kind:'vault',nw:3,nh:2,sealed:true,vault:'hidden',zone:[0,1,.1,.9]},
  {id:'v5',kind:'vault',nw:3,nh:2,sealed:true,vault:'mirror',zone:[0,1,.1,.9]}]},
 {seed:49935,rooms:[ // 2: 499 The Bell Vaults
  {id:'arrive',kind:'start',nw:2,nh:2,zone:[0,1,.78,1],maxDoors:1},
  {id:'down',kind:'stairOut',nw:2,nh:2,zone:[0,1,0,.25],maxDoors:1},
  {id:'bells',kind:'bells',nw:5,nh:3,zone:[.2,.8,.3,.6]},
  {id:'library',kind:'library',nw:4,nh:3,zone:[0,.5,.05,.5]},
  {id:'mine',kind:'mine',nw:4,nh:3,zone:[.5,1,.05,.5]},
  {id:'grotto',kind:'grotto',nw:4,nh:3,zone:[.5,1,.5,.9]},
  {id:'cellar',kind:'cellar',nw:4,nh:3,zone:[0,.5,.5,.9]},
  {id:'fungus',kind:'fungus',nw:4,nh:3,zone:[0,1,.3,.8]},
  {id:'shrine',kind:'shrine',nw:3,nh:3,zone:[0,1,.2,.8]},
  {id:'v6',kind:'vault',nw:3,nh:2,sealed:true,vault:'trap',zone:[0,1,.1,.9]},
  {id:'v7',kind:'vault',nw:3,nh:2,sealed:true,vault:'bells',zone:[0,1,.1,.9]}]},
 {seed:50247,rooms:[ // 3: 502 The Amethyst Deep
  {id:'arrive',kind:'start',nw:2,nh:2,zone:[.3,.7,.8,1],maxDoors:1},
  {id:'lanterns',kind:'lanterns',nw:5,nh:3,zone:[.15,.85,.5,.75]},
  {id:'boss',kind:'boss',nw:7,nh:5,zone:[.2,.8,0,.12],maxDoors:2},
  {id:'grotto1',kind:'grotto',nw:5,nh:4,zone:[0,.45,.15,.6]},
  {id:'grotto2',kind:'grotto',nw:5,nh:4,zone:[.55,1,.15,.6]},
  {id:'lake',kind:'lake',nw:5,nh:4,zone:[0,.6,.55,.95]},
  {id:'mine',kind:'mine',nw:4,nh:3,zone:[.5,1,.55,.95]},
  {id:'shrine',kind:'shrine',nw:3,nh:3,zone:[0,1,.2,.8]},
  {id:'v8',kind:'vault',nw:3,nh:2,sealed:true,vault:'chain',zone:[0,1,.1,.9]},
  {id:'v9',kind:'vault',nw:3,nh:2,sealed:true,vault:'lanterns',zone:[0,1,.1,.9]}]}];
/* ---------- make the four mazes now, and find the stairs ---------- */
WM.TRIES=600;
WM.WANT=[{to:'stairOut',lo:105,hi:125,max:190},{to:'stairOut',lo:76,hi:92,max:125},{to:'stairOut',lo:46,hi:62,max:125},{to:'boss',lo:52,hi:66,max:90}]; // about half the old walks (229, 167, 97, 120) and half the old longest walks
WM.M=[];
function wmMakeAll(){ // the four mazes are made the first time anyone asks for one (boot used to spend about 3 s on this)
{const D4=[[0,-1],[1,0],[0,1],[-1,0]];
  const faceOf=(dx,dy)=>D4.findIndex(d=>d[0]===dx&&d[1]===dy);
  WM.SPECS.forEach((sp,k)=>{
    let M=null,seed=sp.seed;
    const isl=sp.rooms.filter(r=>r.noDoor).reduce((n,r)=>n+(2*r.nw-1)*(2*r.nh-1),0);
    // the walk from the arrival to the way down (or to the boss court) and the longest walk in the level are held to the aims in WM.WANT, so each floor stays short
    const want=WM.WANT[k];let bestM=null,bestE=1e9;
    for(let t=0;t<WM.TRIES&&!M;t++){try{const m=wmgBuild(seed+t*7,sp.rooms,{doors:3});if(m.reached<m.floors-isl)continue;
      const tr=m.rooms.find(r=>r.kind===want.to),dd=m.dist[((tr.y0+tr.y1)>>1)*WMG.W+((tr.x0+tr.x1)>>1)];let mx=0;for(let i=0;i<m.dist.length;i++)if(m.dist[i]>mx)mx=m.dist[i];
      const e=Math.max(0,want.lo-dd)+Math.max(0,dd-want.hi)+Math.max(0,mx-want.max)*.5;
      if(e<bestE){bestE=e;bestM=m;m.seedUsed=seed+t*7}
      if(e===0){M=m;break}}catch(e){}}
    if(!M)M=bestM;
    if(!M)throw new Error('The well maze '+k+' could not be made');
    // a door tile for a stair: a wall cell on the rim of the room, with the open square in front of it
    const stairWall=(room,prefer)=>{const cells=[];
      const cx=(room.x0+room.x1)>>1,cy=(room.y0+room.y1)>>1,sd=new Set(M.sdoors.map(q=>q.x+','+q.y));
      for(let x=room.x0;x<=room.x1;x++){cells.push([x,room.y0-1,0,1]);cells.push([x,room.y1+1,0,-1])}
      for(let y=room.y0;y<=room.y1;y++){cells.push([room.x0-1,y,1,0]);cells.push([room.x1+1,y,-1,0])}
      const ok=cells.filter(([x,y,ix,iy])=>x>1&&y>1&&x<WMG.W-2&&y<WMG.H-2&&M.g[y][x]==='#'&&!sd.has(x+','+y)&&
        // nothing open on either side of the wall cell along the room's edge, so the door stands in a plain stretch of wall
        (M.g[y+iy*0+(ix?1:0)]||[])[x+(iy?1:0)]!=='.'&&(M.g[y-(ix?1:0)]||[])[x-(iy?1:0)]!=='.');
      ok.sort((a,b)=>(Math.abs(a[0]-cx)+Math.abs(a[1]-cy))-(Math.abs(b[0]-cx)+Math.abs(b[1]-cy))+(prefer?((b[3]===prefer?1:0)-(a[3]===prefer?1:0))*100:0));
      const [x,y,ix,iy]=ok[0];return {x,y,ax:x+ix,ay:y+iy,f:faceOf(ix,iy)}};
    const R=id=>M.rooms.find(r=>r.id===id);
    M.room=R;
    if(k>0)M.up=stairWall(M.rooms.find(r=>r.kind==='start'),0);
    const dn=M.rooms.find(r=>r.kind==='stairOut');if(dn)M.down=stairWall(dn,0);
    WM.M[k]=M});
  // the shaft: the ladder stands in the north wall of the first room; the party arrives in front of it
  {const sh=WM.M[0].rooms.find(r=>r.kind==='start'),cx=(sh.x0+sh.x1)>>1;WM.M[0].ladder={x:cx,y:sh.y0};WM.M[0].arrive={x:cx,y:sh.y0+1,f:0};
    try{WK.WELLSTART={x:cx,y:sh.y0+1,f:2}}catch(e){}}
  for(let k=1;k<4;k++){const u=WM.M[k].up;WM.M[k].arrive={x:u.ax,y:u.ay,f:u.f}} // facing into the room, away from the door it came through
  for(let k=0;k<3;k++){const d=WM.M[k].down;WM.M[k].back={x:d.ax,y:d.ay,f:d.f}} // where the party stands when it climbs back up from the level below
}
}
let _wmDone=false;
function wmEnsure(){if(_wmDone)return;_wmDone=true;
  Object.defineProperty(WM,'M',{value:[],writable:true,configurable:true,enumerable:true});
  Object.defineProperty(WK,'WELLSTART',{value:null,writable:true,configurable:true,enumerable:true});
  wmMakeAll()}
Object.defineProperty(WM,'M',{configurable:true,enumerable:true,get(){wmEnsure();return WM.M},set(v){Object.defineProperty(WM,'M',{value:v,writable:true,configurable:true,enumerable:true})}});
Object.defineProperty(WK,'WELLSTART',{configurable:true,enumerable:true,get(){wmEnsure();return WK.WELLSTART},set(v){Object.defineProperty(WK,'WELLSTART',{value:v,writable:true,configurable:true,enumerable:true})}});
