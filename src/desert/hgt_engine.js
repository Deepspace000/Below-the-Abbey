/* ==========================================================================
   HOLLOW GRASSLANDS CITIES: THE TERRACED ENGINE (prefix hgte / HGT). Levels 480 to 489 are town levels with REAL HEIGHTS.

   DATA CONTRACT FOR LEVEL BUILDERS (read this before building a city)
   ---------------------------------------------------------------------------------------------------------------------
   1. Register a builder. Call, at file load:   hgtRegister(id, build)       (id 480..489; interiors 4850..4949)
        build(id) must RETURN a level object (do not assign LEVELS yourself). It runs lazily the first time the level is entered,
        after the pictures have loaded (KH_READY), with ohAlias/ohArt/ohFloors/ohStyles already done. It also sets LEVEL_NAMES[id].
        The level object is the normal one, plus the terrace:
          { rows:[string x H], chars:{ch:gid}, start:{x,y,f}, enemies:[], items:[], decor:[], lights:[[x,y],..], portals:[],
            terrace:{ h:Float32Array(W*H) },       // REQUIRED for 480..489. Index y*W+x. Optional: roof (number), s (Float32Array shade), rev (bump to rebuild),
                                               // riser (gid of a wall tile: the picture of the vertical face of every step; default is the floor picture, which looks wrong on tall cliffs),
                                               // rg (Int32Array(W*H) of gids: a different riser picture for single cells, 0 = use riser)
            name, label, mapNames:[], fmap:[strings of '0'..'5'], floorSet:[6 FLOORS names], floor, ceil:'tomb', ceilH,
            day:0, outdoor:true, amb:.58, noExtras:true, noTele:true, diff, sky:[...] }
        The look of level 470 (cold light, haze, purple torch tint, rock roof, cold overlay) is applied to 480..489 and 4850..4949 automatically
        (hgtLook). HGTE.cold.add(id) adds any other level id to the look.
   2. HEIGHTS. Unit = one cell width. Eye height is 0.5 above the ground of the cell, a normal wall is ceilH high. terrace.h[y*W+x] is the height of the
        walking surface of that cell, in the same units; negative = sunken. Every cell is ONE flat step (nearest neighbour, no slopes).
        - Open cells ('.') are walked; they are drawn at their height, and a higher neighbour shows a riser face (the front of the step).
        - A WALL cell is any char other than '.' (and 't'). Its terrace.h value is the height of its FOOT; the wall rises from there by its tile height
          (TEX[T_TILE[gid]].wh). So a tower is a block of wall cells whose foot is the ground height they stand on, and a stairwell wall column of height 8
          on ground 3 reaches 11. Set h for wall cells to the ground height of the building foot (the ground beside it), never 0 by default on a raised site.
        - STEP RULE: the party, creatures and walkers can move between two neighbouring cells only when |h1-h0| <= 0.55 (terrStepOK). Stairs of
          0.2 to 0.3 per cell work; cliffs and pit edges block (message: step too high / drop too steep). Only the four neighbours count (no diagonals).
        - Decor, items, enemies and lights stand at the height of the cell they are in (terrFoot). A decor's x,y must be an open cell.
        - The camera eases between cell heights in about a quarter second. The roof (rock ceiling) is at terrace.roof, default max(top of tallest wall + 2.5, 6).
          Do not make any wall taller than the roof.
        - Walls are drawn far to near, so a tall tower shows over a low house in front of it. At most 24 wall hits per screen column are kept.
   3. WALL TILES. A wall char needs a gid: chars[ch]=gid, where T_TILE[gid]=texture id and TEX[id].wh is the wall height in cells (TEX[id].h = pixel height = 128*wh,
        the picture is mapped 1:1 so 128 pixels = 1 cell of height). Two ways:
          a) painted pictures:  const TM=ohTiles(); const gid=TM.make(kind,styleName,wh).gid;   // kind 'plain','door','window','slit','gwin','window2','plain2'
             styleName is a key of OH_STY (the art agent adds styles: OH_STY.name={plain:'imgKey',win:'imgKey',door:..., zoom, contrast, tint:[r,g,b,a]}).
          b) plain placeholder:  const gid=HGTE.tile(wh,[r,g,b]);                     // flat colour, a faint band per cell of height
        HGTE.doorTile(wh,[r,g,b],toLevel,{x,y,f}) makes a placeholder DOOR tile (see 4).
        Several heights = several gids (a house of 2.7, a tower of 8, a stairwell column of 8 are three gids). A wall of height 8 is a tile 1024 px tall.
   4. DOORS AND PORTALS. Both work exactly as in the Hollow Grasslands hives.
        a) Door in a wall: a wall char whose gid is a door tile: KH_DOOR[gid]={lvl:interiorId, at:{x,y,f}} (f: 0 north, 1 east, 2 south, 3 west = the way the party faces
           on arrival). Walking into the door cell from an open neighbour (that passes the step rule) enters the level. The door cell's foot height is its terrace.h,
           so a doorstep is simply an open cell next to it. The door glows softly (wdDoorLevel is true for these levels).
           In the interior, put the matching door tile (KH_DOOR[gid2]={lvl:cityId, at:{x,y,f}} with x,y the street cell in front of the outside door).
        b) Enter-portal decor: decor:[{k:'hg_hive',x,y,block:true,enter:{to:id,x,y,f}}] : walking into a blocking decor with `enter` goes there.
        c) Digit portals ('0'..'9' chars with L.portals[i]) also work as in other levels.
   5. SAVES. A save made in a level 480..489 or 4850..4949 restores through Continue and through Go to area (hgtAny is in every KH_READY / restore range list).
        Keep builders deterministic (same level every time) because only the party position and the usual level state (items taken, decor found) are saved.
   6. TEST: goToLevel(480) from the console, or the link  ?town=hgtest&lvl=34  (level 480 test level: plaza, straight stair, spiral tower, sunken court with a door to 4850).
   ========================================================================== */
var HGT=(typeof HGT==='undefined')?{}:HGT; // other files add to it; never redeclare it
HGT.ID0=480;HGT.IDN=489;HGT.INT0=4850;HGT.INTN=4949;
const HGTE={cold:new Set(),builders:{}};
const hgtAny=n=>(n>=480&&n<=489)||(n>=4850&&n<=4949);
const hgtLook=n=>hgtAny(n)||HGTE.cold.has(n); // the look of level 470 (the cold cavern) without being level 470
const hgtIsTown=n=>n>=480&&n<=489;
function hgtPrep(){hgtPanoLoad();ohAlias();oqAlias();ohArt();ohFloors();ohStyles();isleFloors()}
function hgtRegister(id,build){
  HGTE.builders[id]=build;
  KH_LAZY[id]=()=>{
    if(LEVELS[id])return;
    if(typeof KH_READY!=='undefined'&&!KH_READY)return;
    hgtPrep();
    const L=build(id);if(!L)return;
    if(hgtIsTown(id)&&!L.terrace){console.error('hgt level '+id+' has no terrace');return}
    if(L.terrace&&!(L.terrace.h instanceof Float32Array))L.terrace.h=Float32Array.from(L.terrace.h);
    if(!L.name)L.name=LEVEL_NAMES[id]||('Level '+id);
    LEVELS[id]=L;LEVEL_NAMES[id]=L.name;if(LEVEL_RATING[id]===undefined)LEVEL_RATING[id]=(typeof HG!=='undefined'?HG.DIFF:66);
  };
}
/* ---------- THE LOOK OF THE CITIES (renderer settings per level) ----------
   Every hgtLook level (480..489, 4850..4949 and HGTE.cold ids) is drawn with HGTE.lookDefaults. A city or an interior tunes its own look with
        HGTE.look[483]={haze:.3,hazeCol:[60,50,120]};      // only the keys you name change; the rest stay at the default. Call it at file load.
   Keys (all optional):
     ambient       0..1   base light level (the old level.amb is ignored for the look). Lower = moodier, lamps stand out more. default .56
     haze          0..1   strongest haze mix reached far away. default .42           hazeRate  haze per cell of distance. default .02
     hazeCol       [r,g,b] 0..255 colour of the far air (deep violet-teal, never white). default [150,122,206]     roofHaze  same for the roof
     tint          [r,g,b] multipliers of the cool ambient light. default [.95,1,1.1]
     lamp          [r,g,b] colour multipliers of lamp light (lights list, hg_lamp); warm amber against the cool ambient. default [1,.75,.4]
     wallGain      brightness of walls (1 = painting as is). default .8     wallSat  colour saturation of walls, keeps pink/aqua/cream. default 1.6
     wallAO        0..1   darkness at the foot of every wall. default .3
     floorGain     brightness of floors and step treads. default .7        floorContrast  texture contrast. default 1.7     floorPivot  grey it pivots on. default 130
     floorTint     [r,g,b] multipliers. default [1,.95,.98]                  floorSat  floor colour saturation (1 = as painted). default 1.3
     riserGain     brightness of step risers (the vertical face). default .8
     lipGain / lipW   brightness and depth (cells) of the light edge on the tread of a step up. default 1.5 / .09
     footAO / edgeW   darkness and size (cells) of the shadow at the foot of a riser and under a step down. default .5 / .12
     roofGain      brightness of the rock roof. default .65                   roofTint [r,g,b]. default [.8,.85,1.25]
     starMask      far points of light in the roof: 511 = sparse, 255 = many, 4095 = very few.    starGain  their brightness. default .9
     motes         number of drifting light motes in the air (0 = none). default 46      moteCol  [r,g,b] default [255,226,170]
     pano          1 = paint the far skyline panorama behind the terrain (0 = plain dark roof). panoGain brightness, panoTint [r,g,b], panoDrift slow drift in pixels per second. defaults 1 / 1 / [1,1,1] / 2
     vignette      0..1   darkening of the view corners. default .4          grade  [r,g,b,alpha] multiply overlay colour over the whole view. default [255,244,252,.18]
*/
HGTE.look={};
HGTE.lookDefaults={ambient:.56,haze:.42,hazeRate:.02,hazeCol:[150,122,206],roofHaze:[60,50,110],tint:[.95,1,1.1],lamp:[1.0,.75,.4],wallGain:.8,wallSat:1.6,wallAO:.3,
  floorGain:.7,floorContrast:1.7,floorPivot:130,floorTint:[1,.95,.98],floorSat:1.3,riserGain:.8,lipGain:1.5,lipW:.09,footAO:.5,edgeW:.12,roofGain:.65,roofTint:[.8,.85,1.25],
  starMask:511,starGain:.9,motes:46,moteCol:[255,226,170],vignette:.4,grade:[255,244,252,.18],pano:1,panoGain:1,panoTint:[1,1,1],panoDrift:2};
/* the painted far skyline (assets/hgt_pano.jpg, a seamless panorama of far towers with lit windows under the cavern roof). It replaces the roof and the empty far ground on terraced levels. */
HGTE.pano=null;
function hgtPanoLoad(){if(HGTE._pl)return;HGTE._pl=1;const im=new Image();im.onload=()=>{const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);HGTE.pano={w:im.width,h:im.height,d:x.getImageData(0,0,im.width,im.height).data,hr:190,rs:1.2}};im.src='assets/hgt_pano.jpg'}
function hgtPanoPaint(D,dX,dY,pX,pY,K,t){
  const P=HGTE.pano,w=P.w,h=P.h,d=P.d,g=K.panoGain,tr=K.panoTint[0]*g,tg=K.panoTint[1]*g,tb=K.panoTint[2]*g,off=t*K.panoDrift,rows=new Int32Array(VH);
  for(let y=0;y<VH;y++){let r=(P.hr+(y-HH)*P.rs)|0;rows[y]=(r<0?0:r>=h?h-1:r)*w}
  for(let x=0;x<VW;x++){const cm=2*x/VW-1,u=((((Math.atan2(dY+pY*cm,dX+pX*cm)/TAU)%1)+1)%1*w+off)%w|0;
    for(let y=0,o=x*4;y<VH;y++,o+=VW*4){const i=(rows[y]+u)*4;D[o]=d[i]*tr;D[o+1]=d[i+1]*tg;D[o+2]=d[i+2]*tb}}
}
const hgtLookMem={};
function hgtLookFor(id){const o=HGTE.look[id]||null,m=hgtLookMem[id];if(m&&m.o===o&&m.rev===(o&&o._rev||0))return m.v;const v=Object.assign({},HGTE.lookDefaults,o||{});hgtLookMem[id]={o,rev:o&&o._rev||0,v};return v} // cached; set look._rev++ after editing a look object in place
/* the air of a city: soft grade, vignette, and drifting motes of warm light (particles, drawn over the 3D view) */
{const _w=drawWeatherFx;drawWeatherFx=function(){_w.apply(this,arguments);if(!hgtLook(LEVEL))return;
  const K=hgtLookFor(LEVEL),t=G.time||0;ctx.save();
  if(K.grade[3]>0){ctx.globalCompositeOperation='multiply';ctx.globalAlpha=K.grade[3];ctx.fillStyle='rgb('+K.grade[0]+','+K.grade[1]+','+K.grade[2]+')';ctx.fillRect(0,0,420,210)}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
  if(K.vignette>0){if(!hgtLook.vg){const c=document.createElement('canvas');c.width=420;c.height=210;const x=c.getContext('2d'),g=x.createRadialGradient(210,105,70,210,105,260);g.addColorStop(0,'rgba(8,4,24,0)');g.addColorStop(.6,'rgba(8,4,24,.35)');g.addColorStop(1,'rgba(8,4,24,1)');x.fillStyle=g;x.fillRect(0,0,420,210);hgtLook.vg=c}
    ctx.globalAlpha=K.vignette;ctx.drawImage(hgtLook.vg,0,0);ctx.globalAlpha=1}
  if(K.motes>0){ctx.globalCompositeOperation='lighter';const mc=K.moteCol;
    for(let i=0;i<K.motes;i++){const sp=.6+(i%5)*.35,x=((i*89.3+t*(2+i%4)+Math.sin(t*.5*sp+i)*9)%440+440)%440-10,y=((i*47.7+t*(1.5+(i%3))*(i%2?-1:1)+Math.cos(t*.4*sp+i*2)*7)%230+230)%230-10,tw=.35+.65*Math.max(0,Math.sin(t*(1.1+i%4*.5)+i*1.7)),r=.6+(i%4)*.45;
      ctx.fillStyle='rgba('+mc[0]+','+mc[1]+','+mc[2]+','+(.5*tw).toFixed(3)+')';ctx.fillRect(x,y,r,r);
      if(i%6===0){ctx.fillStyle='rgba('+mc[0]+','+mc[1]+','+mc[2]+','+(.09*tw).toFixed(3)+')';ctx.fillRect(x-1.4,y-1.4,r+2.8,r+2.8)}}}
  ctx.restore()}}
/* plain placeholder tiles: a flat colour (the art agent supplies the painted shell textures later) */
function hgtTex(wh,rgb,door){
  const Hp=Math.round(128*wh),d=new Uint8ClampedArray(128*Hp*4);
  for(let y=0;y<Hp;y++){const unit=Math.floor((Hp-1-y)/128),k=unit%2?.93:1;
    for(let x=0;x<128;x++){let r=rgb[0]*k,g=rgb[1]*k,b=rgb[2]*k;
      if(door&&unit===0&&x>=36&&x<92&&y>=Hp-100){r=28;g=20;b=14}  // a dark doorway, one cell high
      const o=(y*128+x)*4;d[o]=r;d[o+1]=g;d[o+2]=b;d[o+3]=255}}
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;return id;
}
HGTE.tile=function(wh,rgb){const gid=KH_NEXT_GID++;T_TILE[gid]=hgtTex(wh,rgb||[200,190,180],false);return gid};
HGTE.doorTile=function(wh,rgb,lvl,at){const gid=KH_NEXT_GID++;T_TILE[gid]=hgtTex(wh,rgb||[200,190,180],true);KH_DOOR[gid]={lvl,at};return gid};
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||hgtAny(n)}}
function hgtGotoList(hd,has,nm,out){
  hd('The strange cities of the Hollow Grasslands');
  for(let n=480;n<=489;n++)if(has(n))out.push({n,name:nm(n)});
  for(let n=4850;n<4870;n++)if(has(n))out.push({n,name:nm(n)});
}
LEVEL_NAMES[480]='The Test Terraces';LEVEL_NAMES[4850]='The Sunken Room';

/* ---------- the test level 480: a plaza, a straight stair of 12 steps up to a platform, a tower with a spiral stair to a lookout, a stair of 6 steps down into a sunken court with a door ---------- */
function hgtBuildTest(){
  const W=48,H=44,N=W*H,I=(x,y)=>y*W+x,h=new Float32Array(N),rows=[];
  for(let y=0;y<H;y++)rows.push(new Array(W).fill('.'));
  const wallLow=HGTE.tile(3,[150,150,170]),tower=HGTE.tile(8,[225,190,200]),court=HGTE.tile(2.7,[215,150,150]);
  const door=HGTE.doorTile(2.7,[215,150,150],4850,{x:4,y:2,f:2}); // the room beyond is built below; it arrives at its own door
  const chars={'#':wallLow,'W':tower,'c':court,'d':door};
  for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(x<1||y<1||x>=W-1||y>=H-1)rows[y][x]='#';
  // the stair: 12 steps of 0.25 going north from the plaza (x 11 to 13, y 33 down to 22) to a platform at 3.0
  for(let k=1;k<=12;k++)for(let x=11;x<=13;x++)h[I(x,34-k)]=.25*k;
  for(let y=15;y<=21;y++)for(let x=8;x<=16;x++)h[I(x,y)]=3;
  // the tower: 3 by 3 wall cells of height 8 at 29..31, 27..29 (foot 0), and a spiral of steps round it: the outer ring first, then the inner ring
  const cx=30,cy=28,rc=d=>{ // clockwise from the south middle: west along the bottom, north up the west side, east along the top, south down the east side, back to the middle
    const o=[];for(let x=cx;x>=cx-d;x--)o.push([x,cy+d]);for(let y=cy+d-1;y>=cy-d;y--)o.push([cx-d,y]);for(let x=cx-d+1;x<=cx+d;x++)o.push([x,cy-d]);for(let y=cy-d+1;y<=cy+d;y++)o.push([cx+d,y]);for(let x=cx+d-1;x>cx;x--)o.push([x,cy+d]);return o};
  for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)rows[y][x]='W';
  const r3=rc(3).slice(0,23),r2=rc(2);let step=0;
  for(const [x,y] of r3){step++;h[I(x,y)]=.18*step}
  // the inner ring starts beside the last outer cell and goes on climbing; the last four cells are the flat lookout
  const last=r3[r3.length-1];let start=0,bd=1e9;r2.forEach(([x,y],i)=>{const d=Math.abs(x-last[0])+Math.abs(y-last[1]);if(d<bd){bd=d;start=i}});
  const ord=[];for(let i=0;i<14;i++)ord.push(r2[(start+i)%r2.length]);
  ord.forEach(([x,y],i)=>{step++;h[I(x,y)]=.18*(i>=10?step-(i-10):step)});
  // the sunken court: open pit at -1.5 (x 41 to 45, y 10 to 20), six steps down from the east end of the plaza lane (x 35 to 40 at y 14 to 16)
  for(let y=10;y<=20;y++)for(let x=41;x<=45;x++)h[I(x,y)]=-1.5;
  for(let k=1;k<=6;k++)for(let y=14;y<=16;y++)h[I(34+k,y)]=-.25*k;
  for(let y=10;y<=20;y++)h[I(46,y)]=-1.5; // the court wall (foot -1.5)
  for(let y=10;y<=20;y++)rows[y][46]='c';rows[15][46]='d';
  for(let x=41;x<=45;x++){rows[9][x]='c';h[I(x,9)]=-1.5;rows[21][x]='c';h[I(x,21)]=-1.5}
  // a few things that stand on the steps
  const decor=[{k:'hg_pillar',x:12,y:18,block:true},{k:'hg_lamp',x:9,y:16,block:false,walk:true,deco:true},{k:'hg_lamp',x:15,y:16,block:false,walk:true,deco:true},{k:'hg_lamp',x:8,y:36,block:false,walk:true,deco:true},{k:'hg_lamp',x:43,y:12,block:false,walk:true,deco:true},{k:'hg_well',x:43,y:18,block:true}];
  const lights=[[9,16],[15,16],[8,36],[43,12],[12,30],[27,31]];
  const fm=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++)r+=(x>=8&&x<=16&&y>=15&&y<=21)||(h[I(x,y)]<0)?'2':((x>=10&&x<=14&&y>=22&&y<=35)?'1':'0');fm.push(r)}
  const L={rows:rows.map(r=>r.join('')),chars,start:{x:12,y:38,f:0},enemies:[],items:[],decor,lights,portals:[],scenery:[],terrace:{h,riser:HGTE.tile(1,[205,195,175])},fmap:fm,
    floorSet:['ohMeadow','ohGravel','ohLawn','bluesand','bluewater','ohMoss'],floor:'ohMeadow',ceil:'tomb',ceilH:3,day:0,outdoor:true,amb:.58,noExtras:true,noTele:true,diff:66,
    name:'The Test Terraces',label:'The Test Terraces',mapNames:[]};
  return L;
}
hgtRegister(480,hgtBuildTest);
// the room behind the court door: a plain flat room with the door back out
hgtRegister(4850,id=>{
  const wall=HGTE.tile(2.7,[215,150,150]),back=HGTE.doorTile(2.7,[215,150,150],480,{x:45,y:15,f:3}),W=9,Hh=7,g=[];
  for(let y=0;y<Hh;y++)g.push(new Array(W).fill('#'));
  for(let y=1;y<Hh-1;y++)for(let x=1;x<W-1;x++)g[y][x]='.';
  g[0][4]='d';
  return {rows:g.map(r=>r.join('')),chars:{'#':wall,'d':back},start:{x:4,y:2,f:2},enemies:[],items:[],decor:[],lights:[[4,3]],portals:[],floor:'wood',day:0,amb:.2,ceilH:2.7,noTele:true,noExtras:true,name:'The Sunken Room',label:'The Sunken Room',mapNames:[]};
});
