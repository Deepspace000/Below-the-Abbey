/* ==========================================================================
   THE RED DUNES (level 43). Through the door that Sut's fall opens, a second desert: red sand, red rock, old ruins,
   and creatures that have lived on it a long time. Far ahead to the north a city rises over the horizon: Khemetra.
   ========================================================================== */
const RS={W:168,H:190,NORTH:7};
const rsCentre=y=>84+13*Math.sin(y/23)+9*Math.sin(y/57+2);
const rsHalf=y=>56+16*Math.sin(y/31+1)+8*Math.sin(y/13);
function buildRedDunes(){
  const W=RS.W,H=RS.H,rows=[],fm=[],open=new Uint8Array(W*H),idx=(x,y)=>y*W+x;
  const R=(x,y,k)=>hash2(x,y,k);
  for(let y=RS.NORTH;y<H-1;y++)for(let x=1;x<W-1;x++){const hw=rsHalf(y)+(hash2(x>>1,y>>1,9)-.5)*2.4;if(Math.abs(x-rsCentre(y))<=hw)open[idx(x,y)]=1}
  const roadFrom=70; // the last stretch of the way is an old paved road
  const onRoad=(x,y)=>y<roadFrom&&Math.abs(x-Math.round(rsCentre(y)))<=1;
  for(let y=0;y<H;y++){let row='',fr='';for(let x=0;x<W;x++){
    if(!open[idx(x,y)]){row+=y<RS.NORTH?'Y':'D';fr+='0';continue}
    row+='.';const n=hash2(x>>3,y>>3,5);fr+=onRoad(x,y)?'2':(n<.34?'1':'0')}
    rows.push(row);fm.push(fr)}
  const setc=(x,y,c)=>{rows[y]=rows[y].slice(0,x)+c+rows[y].slice(x+1)};
  const cxN=Math.round(rsCentre(RS.NORTH+2)),cxS=Math.round(rsCentre(H-3));
  setc(cxS,H-1,'0');open[idx(cxS,H-2)]=1;setc(cxS,H-2,'.');
  setc(cxN,RS.NORTH-1,'1');   // the gate of the city
  for(let dx=-3;dx<=3;dx++){setc(cxN+dx,RS.NORTH,'.');open[idx(cxN+dx,RS.NORTH)]=1}
  const decor=[],scen=[],occ=new Set(),dunes=new Set();
  const put=(k,x,y,o)=>{const d=Object.assign({k,x,y,block:false},o||{});decor.push(d);if(d.block)occ.add(x+','+y);return d};
  const sc=(k,x,y,o)=>scen.push(Object.assign({k,wx:x+.5+((o&&o.ox)||0),wy:y+.5+((o&&o.oy)||0),sc:(o&&o.sc)||1,decor:{k,walk:true,x,y}}));
  const nearDune=(x,y)=>{for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(dunes.has((x+dx)+','+(y+dy)))return true;return false};
  for(let y=RS.NORTH+1;y<H-3;y++)for(let x=1;x<W-1;x++){
    if(!open[idx(x,y)])continue;
    const road=Math.abs(x-Math.round(rsCentre(y)))<=3&&y<roadFrom+10,oX=(R(x,y,3)-.5)*.7,oY=(R(x,y,4)-.5)*.7;
    if(road)continue;
    if(DUNE_SPRITES&&R(x,y,20)<.055&&!nearDune(x,y)){dunes.add(x+','+y);put('rdune'+((R(x,y,21)*3)|0),x,y,{block:true,ox:oX*.4,oy:oY*.3,sc:.95+R(x,y,22)*.8})}
    else if(R(x,y,23)<.016)put('rrock'+((R(x,y,24)*3)|0),x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.9+R(x,y,25)*.7});
    else if(R(x,y,26)<.006)put('dcactus',x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.9+R(x,y,27)*.4});
    else if(R(x,y,28)<.007)put('ddead',x,y,{block:true,ox:oX*.5,oy:oY*.5,sc:.9+R(x,y,29)*.5});
    else if(R(x,y,30)<.04)sc('dshrub'+((R(x,y,31)*3)|0),x,y,{ox:oX,oy:oY,sc:.8+R(x,y,32)*.7});
    else if(R(x,y,33)<.004)sc('dbones',x,y,{ox:oX,oy:oY,sc:.9+R(x,y,34)*.4});
    if(DUNE_SPRITES&&R(x,y,35)<.18)sc('rpeb'+((R(x,y,36)*3)|0),x,y,{ox:(R(x,y,37)-.5)*.9,oy:(R(x,y,38)-.5)*.9,sc:.8+R(x,y,39)*.8});
  }
  // ruins: rings of broken pillars with a chest at the heart of each
  const ruins=[];
  for(let k=0;k<9;k++){
    for(let t=0;t<80;t++){
      const y=20+((R(k,t,60)*(H-60))|0),c=Math.round(rsCentre(y)),x=clamp(c+Math.round((R(k,t,61)-.5)*rsHalf(y)*1.4),8,W-9);
      let clear=true;for(let dy=-4;dy<=4&&clear;dy++)for(let dx=-4;dx<=4;dx++)if(!open[idx(x+dx,y+dy)])clear=false;
      if(!clear||Math.abs(x-c)<5||ruins.some(r=>Math.hypot(r.x-x,r.y-y)<22))continue;
      for(let i=decor.length-1;i>=0;i--){const d=decor[i];if(Math.abs(d.x-x)<=4&&Math.abs(d.y-y)<=4){occ.delete(d.x+','+d.y);decor.splice(i,1)}}
      for(let a=0;a<8;a++){const px=Math.round(x+Math.cos(a/8*TAU)*3.2),py=Math.round(y+Math.sin(a/8*TAU)*3.2);if(a!==2)put('dpillar'+(a%2),px,py,{block:true,sc:.7+.3*R(px,py,62)})}
      put('chest',x,y,{block:true,magic:DS_MAGIC_TOMB[(k*5+3)%DS_MAGIC_TOMB.length],goldAmt:320+k*40});
      put('dbones',x+1,y+1,{walk:true});ruins.push({x,y});break;
    }
  }
  // the old road: obelisks on both sides every twelve cells, then the guardians at the city gate
  for(let y=roadFrom-4;y>RS.NORTH+10;y-=12){const c=Math.round(rsCentre(y));put('dobelisk',c-4,y,{block:true});put('dobelisk',c+4,y,{block:true})}
  put('dsphinx',cxN-5,RS.NORTH+4,{block:true});put('dsphinx',cxN+5,RS.NORTH+4,{block:true});
  // the city itself stands behind its wall: only the part above the wall can be seen, from a long way off
  put('dcity',cxN,RS.NORTH-3,{block:false,deco:true,sc:1});
  // ---- the creatures ----
  const enemies=[];
  const free=(x,y)=>x>0&&y>0&&x<W-1&&y<H-1&&open[idx(x,y)]&&!occ.has(x+','+y)&&!enemies.some(e=>e.x===x&&e.y===y);
  const spawn=(t,x,y,lvl)=>{if(free(x,y))enemies.push({t,x,y,lvl})};
  // creatures live in camps with open sand between them, not scattered everywhere
  const camp=(t,cx,cy,n,lvl,spread)=>{let placed=0;for(let k=0;k<n*8&&placed<n;k++){const x=cx+Math.round((R(cx,cy,100+k)*2-1)*spread),y=cy+Math.round((R(cx,cy,160+k)*2-1)*spread);if(free(x,y)){enemies.push({t:typeof t==='function'?t(x,y):t,x,y,lvl});placed++}}};
  for(let gy=0;gy<H;gy+=24)for(let gx=0;gx<W;gx+=24){
    const x=gx+4+((R(gx,gy,70)*16)|0),y=gy+4+((R(gx,gy,71)*16)|0);if(!open[idx(x,y)]||y>H-22||y<RS.NORTH+8)continue;
    const r=R(gx,gy,72);
    if(r>.62)continue; // many stretches are empty
    if(r<.16)camp('scorpion',x,y,5,16,3);
    else if(r<.30)camp('dwolf',x,y,4,15,3);
    else if(r<.44)camp((px,py)=>'nomad'+(R(px,py,73)<.5?'':'2'),x,y,5,15,3);
    else camp('mummy',x,y,4,17,2);
  }
  const items=[];
  for(let k=0;k<12;k++)for(let t=0;t<20;t++){const x=4+((R(k,t,80)*(W-8))|0),y=20+((R(k,t,81)*(H-50))|0);if(free(x,y)&&!enemies.some(e=>Math.abs(e.x-x)+Math.abs(e.y-y)<4)){items.push({k:['potion','bread','cheese','potion','apple'][k%5],x,y});break}}
  return {rows,fm,decor,scen,enemies,items,start:{x:cxS,y:H-3,f:0},cxN,cxS};
}
const REDDUNES=buildRedDunes();
const LEVEL43_DATA={rows:REDDUNES.rows,start:REDDUNES.start,enemies:REDDUNES.enemies,items:REDDUNES.items,decor:REDDUNES.decor,scenery:REDDUNES.scen,fmap:REDDUNES.fm,outdoor:true,day:.97,floor:'redsand',
  floorSet:['redsand','redsand2','redpath','sandpath'],ceil:'cloud',noExtras:true,name:'The Red Dunes',label:'Red Dunes',diff:16,
  portals:[{to:42,x:48,y:2,f:2,tex:'sutdoor'},{to:44,x:0,y:0,f:0,tex:'citygate',req:'cityOpen',lock:'The great gates of Khemetra are shut, barred with beams of cedar as thick as a man. Beyond them the city waits. (The journey on from here comes in a later chapter.)'}]};
LEVELS[43]=LEVEL43_DATA;
LEVEL42_DATA.portals[1]={to:43,x:REDDUNES.cxS,y:REDDUNES.start.y,f:0,tex:'sutdoor'};
