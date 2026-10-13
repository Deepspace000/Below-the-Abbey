/* ==========================================================================
   KHEMETRA: THE CITY. khPrepare() builds level 44 from the map (khemetra_map.js) and the pictures (khemetra_art.js):
   wall tiles, doors, floors, the skyline of roofs, towers, palace and church, and then the buildings, people and
   markets (khemetra_build.js, khemetra_crowd.js).
   ========================================================================== */
const KH_ROOFS_OK=['roofup1_0','roofup1_1','roofup1_2','roofup1_3','roofup1_4','roofup1_5','roofup1_1','roofup1_5','roofup1_2','roofup1_0']; // roofs drawn as seen from the street looking up: the profile against the sky and the underside of the cornice, never the top of a roof
LEVELS[44]={stub:true,rows:['.'],start:{x:0,y:0,f:0},enemies:[],items:[],decor:[],name:'Khemetra, the Golden City',label:'Khemetra',diff:16,outdoor:true,day:.98,ceil:'cloud',floor:'sand',portals:[]};
let KH_CITY=null;
const khHash=(a,b,c)=>hash2(a|0,b|0,c|0);
const KH_CHARS={n:0,map:{},chars:{}};
function khChar(gid){if(KH_CHARS.map[gid]!==undefined)return KH_CHARS.map[gid];const ch=String.fromCharCode(0x100+KH_CHARS.n++);KH_CHARS.map[gid]=ch;KH_CHARS.chars[ch]=gid;return ch}
const KH_SEED_NUM=4321;
/* the palace door: the middle of the palace front facing the court */
function khPalaceDoor(C){
  const P=KH_POOLS,cands=C.modules.filter(m=>m.kind==='palace'&&m.face===1&&m.cells.length===3&&m.cells.some(([x,y])=>y===C.PB.y1&&Math.abs(x-KH.CX)<=2));
  const m=cands.sort((a,b)=>Math.abs(a.cells[1][0]-KH.CX)-Math.abs(b.cells[1][0]-KH.CX))[0];
  if(!m)return null;
  const pool=P.palaceDoor&&P.palaceDoor.length?P.palaceDoor:P.palace;
  m.e=Object.assign({},pool[0],{n:3});m.wh=m.e.wh;
  const mid=m.cells[1];m.doorCells=[mid];m.lvl=KH_PALACE;m.palace=true;
  KH_PALACE_FRONT.x=mid[0];KH_PALACE_FRONT.y=mid[1]+1;
  return m;
}
/* build the level the first time it is needed; returns when the pictures and the map are ready */
async function khPrepare(){
  if(KH_CITY)return KH_CITY;
  await khLoadAssets();
  KH_POOLS=khBuildPools();
  for(const k in KH_PROPS){const p=KH_PROPS[k];if(IMG[p[0]])NPC_H[p[0]]=p[2]}
  for(const k in KH_NPC_H)NPC_H[k]=KH_NPC_H[k];
  const C=khBuild(KH_SEED_NUM);
  const W=C.W,H=C.H,idx=C.idx,L=LEVELS[44];
  const placed=khPlaceBuildings(C),pm=khPalaceDoor(C);
  khBuildWorld(); // the palace, cisterns, study and sea tunnel rooms need the door positions above
  khMakeDoorsAndRooms(C,L,placed);
  khMakeHouseDoors(C); // and a door, with a picture of the room behind it, on every other house that can be walked up to
  if(pm){pm.at=LEVELS[KH_PALACE].start}
  KH_CHARS.n=0;KH_CHARS.map={};KH_CHARS.chars={};
  const rowCodes=new Array(H);for(let y=0;y<H;y++)rowCodes[y]=new Uint16Array(W);
  const WALL_DEFAULT='#'.charCodeAt(0),DOT='.'.charCodeAt(0);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)rowCodes[y][x]=C.solid[idx(x,y)]?WALL_DEFAULT:DOT;
  const gateMod=C.modules.find(m=>m.kind==='castle'&&m.face===0&&m.cells.some(([x,y])=>x===KH.CX&&y===H-KH.WALL));
  const eastMods=C.modules.filter(m=>m.kind==='castle'&&m.cells.some(([x,y])=>x>=W-KH.WALL&&y>=199&&y<=201));
  for(const m of eastMods)m.doorCells=m.cells.filter(([x,y])=>y>=199&&y<=201);
  for(const m of C.modules){
    const tiles=khTileSet(m.e),door=m.doorCells||(m===gateMod?m.cells:null);
    m.cells.forEach(([x,y],i)=>{
      let gid=tiles[Math.min(i,tiles.length-1)].gid;
      if(door&&door.some(c=>c[0]===x&&c[1]===y)){const g2=KH_NEXT_GID++;T_TILE[g2]=eastMods.includes(m)&&T_DOORS.citygate!==undefined?T_DOORS.citygate:T_TILE[gid];KH_DOOR[g2]=m===gateMod?{gate:true}:eastMods.includes(m)?{east:true,lvl:289,at:{x:1,y:10,f:1}}:{lvl:m.lvl,at:m.at,i,n:m.cells.length,lf:m.face===1||m.face===2,sc:m.hscene};gid=g2}
      rowCodes[y][x]=khChar(gid).charCodeAt(0);
    });
  }
  const rows=rowCodes.map(r=>{let s='';for(let i=0;i<r.length;i+=512)s+=String.fromCharCode.apply(null,r.subarray(i,i+512));return s});
  const fmap=[];for(let y=0;y<H;y++){let s='';for(let x=0;x<W;x++)s+=String.fromCharCode(48+C.fl[idx(x,y)]);fmap.push(s)}
  Object.assign(L,{stub:false,rows,fmap,start:{x:KH.CX,y:H-KH.WALL-4,f:0},floor:'kh0',floor2:'kh1',floorSet:['kh0','kh1','kh2','kh3','kh4','kh5'],ceil:'cloud',chars:KH_CHARS.chars,noExtras:true,outdoor:true,day:.98,
    name:'Khemetra, the Golden City',label:'Khemetra',diff:16,portals:[],enemies:[],items:[],decor:[],sky:[]});
  khMakeFloors();
  KH_CITY=C;C.L=L;
  khSkyline(C,L);
  khCrowd(C,L);
  khFreeSheets();
  if(typeof AREA_STATS!=='undefined')delete AREA_STATS[44];
  return C;
}
/* roofs, the palace, the church and tall towers rise over the walls */
function khWallH(L,cells){
  let lo=1e9;
  for(const [x,y] of cells){
    const ti=T_TILE[L.chars[L.rows[y][x]]],h=ti!==undefined&&TEX[ti]?TEX[ti].wh:null;
    if(h===null||h===undefined)return null;
    if(h<lo)lo=h;
  }
  return lo<1e9?lo:null;
}
function khSkyline(C,L){
  const W=C.W,H=C.H,idx=C.idx,rng=khRng(777),sky=L.sky,P=KH_POOLS;
  for(const [src,keep] of [['roof2_0',.52],['roof2_2',.58]]){ // a dome on a flat slab: keep the dome, drop the slab seen from above
    const im=IMG['kh_'+src],m=KH_MAN[src];if(!im||!m)continue;
    const h=Math.round(im.height*keep),c=mkCanvas(im.width,h,(x)=>{x.drawImage(im,0,0,im.width,h,0,0,im.width,h)});
    IMG['kh_'+src+'c']=c;KH_MAN[src+'c']={w:im.width,h};
  }
  const okRoofs=KH_ROOFS_OK.filter(k=>KH_MAN[k]);
  const dirs=KH_DIRS;
  let k=0;
  for(const m of C.modules){
    if(m.kind==='castle'||m.kind==='palace'||!okRoofs.length)continue;
    if((k++&1)&&khHash(m.cells[0][0],m.cells[0][1],5)<.7)continue;
    const cx=m.cells.reduce((a,c)=>a+c[0],0)/m.cells.length+.5,cy=m.cells.reduce((a,c)=>a+c[1],0)/m.cells.length+.5,d=dirs[m.face];
    const key=okRoofs[(khHash(m.cells[0][0],m.cells[0][1],9)*okRoofs.length)|0],im=KH_MAN[key];
    const w=m.n*.95*(m.kind==='temple'||m.kind==='bath'?1.2:1);
    const az=khWallH(L,m.cells);if(az===null)continue;   // the roof sits on the wall that is really there
    sky.push({x:cx-d[0]*1.6,y:cy-d[1]*1.6,k:'kh_'+key,w,z:az-.02,h:w*im.h/im.w});
  }
  const pal=KH_MAN.palace_0;
  if(pal){const w=54,hh=w*pal.h/pal.w;sky.push({x:KH.CX+.5,y:C.PB.y0+9,k:'kh_palace_0',w,z:2.2,h:hh,big:1})}
  const mq=KH_MAN.mosque1_0,mb=KH_BUILDINGS.find(b=>b.id==='mosque');
  if(mq&&mb&&mb.m){const dd=KH_DIRS[mb.m.face],cc=mb.m.cells[1]||mb.m.cells[0],w2=22,hh=w2*mq.h/mq.w;sky.push({x:cc[0]+.5-dd[0]*4,y:cc[1]+.5-dd[1]*4,k:'kh_mosque1_0',w:w2,z:mb.m.wh-.02,h:hh,big:1})}
  const ch=KH_MAN.church_0;
  if(ch){const w=24,hh=w*ch.h/ch.w;sky.push({x:122.5,y:196.5,k:'kh_church_0',w,z:1.9,h:hh,big:1})}
  const tw=P.towers;
  if(tw.length){
    for(let n=0;n<70;n++){
      const x=12+((rng()*(W-24))|0),y=12+((rng()*(H-24))|0);
      if(!C.solid[idx(x,y)])continue;
      if(x>C.PAL.x0-8&&x<C.PAL.x1+8&&y>C.PAL.y0-8&&y<C.PAL.y1+8)continue;
      const key=tw[(rng()*tw.length)|0],im=KH_MAN[key],hgt=6+rng()*9;
      sky.push({x:x+.5,y:y+.5,k:'kh_'+key,w:hgt*im.w/im.h,z:0,h:hgt,big:1});
    }
  }
  L.skyN=sky.length;
}
