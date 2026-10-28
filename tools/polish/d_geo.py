import sys, json
sys.path.insert(0,'tools/polish')
from d_load import *
JS=r'''()=>{if(!LEVELS[476]&&KH_LAZY[476])KH_LAZY[476]();const L=LEVELS[476],O=L._hgdo,W=201,H=201,rows=L.rows;
const ix=(x,y)=>y*W+x,open=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&rows[y][x]==='.',wat=(x,y)=>O.wm[ix(x,y)]===1,land=(x,y)=>open(x,y)&&!wat(x,y);
const occ={};for(const d of L.decor)(occ[d.x+','+d.y]=occ[d.x+','+d.y]||[]).push(d.k);
const DV=[[0,-1],[1,0],[0,1],[-1,0]];const deg=(x,y)=>DV.filter(d=>land(x+d[0],y+d[1])).length;
const dead=[],junc=[];for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(!land(x,y)||O.isle[ix(x,y)])continue;const g=deg(x,y);if(g===1)dead.push([x,y]);else if(g>=3)junc.push([x,y])}
const near=(x,y,r)=>L.decor.some(d=>Math.abs(d.x-x)<=r&&Math.abs(d.y-y)<=r);
const deadEmpty=dead.filter(([x,y])=>!near(x,y,2)&&!L.enemies.some(e=>Math.abs(e.x-x)<=1&&Math.abs(e.y-y)<=1));
// grid for picture
const g=[];for(let y=0;y<H;y++){let r='';for(let x=0;x<W;x++){r+=!open(x,y)?'#':wat(x,y)?'w':O.isle[ix(x,y)]?'i':'.'}g.push(r)}
return {dead:dead.length,deadEmpty:deadEmpty.length,deadList:deadEmpty,junc:junc.length,docks:O.docks,landings:O.landings,boats:O.boats,islets:O.islets,island:{cx:O.island.cx,cy:O.island.cy},bsw:L._bsw&&{cx:L._bsw.cx,cy:L._bsw.cy,R:L._bsw.R,boat:L._bsw.boat,landing:L._bsw.landing},ladders:L._hgdu.ladders.map(l=>[l.ax,l.ay,l.x,l.y,l.dx,l.dy]),letters:L._hgdu.letters,msgr:L._msgr&&[L._msgr.x,L._msgr.y],lights:L.lights.length,grid:g,shr:L._bsu.shrines,chests:L.decor.filter(d=>d.k==='chest').map(d=>[d.x,d.y]),hz:(L._hgvz||[]).map(z=>[z.x,z.y,z.r,z.name||z.t]),tele:L.portals,names:L.mapNames,juncSample:junc.slice(0,5)}}'''
with sync_playwright() as p:
    b,pg,errs=open_level(p)
    r=pg.evaluate(JS)
    json.dump(r,open('tools/polish/d_geo.json','w'))
    g=r.pop('grid')
    from PIL import Image
    im=Image.new('RGB',(201,201))
    col={'#':(20,20,24),'w':(20,50,120),'i':(150,130,60),'.':(200,200,200)}
    for y,row in enumerate(g):
        for x,c in enumerate(row): im.putpixel((x,y),col[c])
    im=im.resize((804,804),Image.NEAREST); im.save('C:/Users/mirko/AppData/Local/Temp/dshots/map.png')
    for k,v in r.items(): print(k,json.dumps(v)[:500])
    b.close()
