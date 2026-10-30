/* ==========================================================================
   THE BLUE DUNES (level 60). A small, low cave in the east wall of the Sand Road leads to a second, quiet desert:
   pale blue sand in long smooth swells, almost nothing living on it, and a tiny oasis in the middle with food and water.
   The edge of the land is the same moving sky as the rest of the desert.
   ========================================================================== */
const BDN={W:220,H:220,OX:110,OY:110};
const DS_BLU=['#dbe8f6','#b4cdea','#86a6d4','#6684ba','#445d94'];
function buildBlueDunes(){
  const W=BDN.W,H=BDN.H,rows=[],fm=[],R=(x,y,k)=>hash2(x,y,k),cx=BDN.OX,cy=BDN.OY;
  for(let y=0;y<H;y++){let row='',fr='';for(let x=0;x<W;x++){
    if(x===0||y===0||x===W-1||y===H-1){row+='D';fr+='0';continue}
    row+='.';const d=Math.hypot(x-cx,(y-cy)*1.1);
    fr+=d<=2.4?'3':d<=4.6?'2':(hash2(x>>3,y>>3,5)<.4?'1':'0');
  }rows.push(row);fm.push(fr)}
  rows[cy]='0'+rows[cy].slice(1);       // the cave back to the Sand Road, in the west wall
  const decor=[],scen=[],items=[],enemies=[];
  const sc=(k,x,y,o)=>scen.push(Object.assign({k,wx:x+.5+((o&&o.ox)||0),wy:y+.5+((o&&o.oy)||0),sc:(o&&o.sc)||1,decor:{k,walk:true,x,y}}));
  const put=(k,x,y,o)=>decor.push(Object.assign({k,x,y,block:false},o||{}));
  const nearOasis=(x,y,r)=>Math.hypot(x-cx,y-cy)<r,nearCave=(x,y)=>x<8&&Math.abs(y-cy)<7;
  // long, smooth, low swells; and a scatter of faint ripples between them. Nothing here blocks the way.
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){
    if(nearOasis(x,y,8.5)||nearCave(x,y))continue;
    const oX=(R(x,y,3)-.5)*.8,oY=(R(x,y,4)-.5)*.8;
    if(DUNE_SPRITES&&R(x,y,20)<.03)put('bdune'+((R(x,y,21)*3)|0),x,y,{block:true,ox:oX*.4,oy:oY*.4,sc:.9+R(x,y,22)*.7});  // low smooth swells you walk round
    else if(DUNE_SPRITES&&R(x,y,26)<.1)sc('bpeb'+((R(x,y,27)*3)|0),x,y,{ox:oX,oy:oY,sc:.8+R(x,y,28)*.9});
  }
  // the oasis: a pool, reeds at its edge, a ring of palms, a few bushes
  for(let a=0;a<14;a++){const r=2.9+R(a,1,40)*.5,x=Math.round(cx+Math.cos(a/14*TAU)*r),y=Math.round(cy+Math.sin(a/14*TAU)*r*.9);if(a%2===0)sc('greeds',x,y,{ox:(R(a,2,41)-.5)*.5,oy:(R(a,3,41)-.5)*.5,sc:.8+R(a,4,41)*.5})}
  for(let a=0;a<6;a++){const r=5.6+R(a,5,42)*1.1,x=Math.round(cx+Math.cos(a/6*TAU+.3)*r),y=Math.round(cy+Math.sin(a/6*TAU+.3)*r*.9);put('dpalm'+(a%4),x,y,{block:true,sc:.9+R(a,6,43)*.35})}
  for(let a=0;a<7;a++){const r=4.8+R(a,7,44)*2.4,x=Math.round(cx+Math.cos(a*1.9)*r),y=Math.round(cy+Math.sin(a*1.9)*r*.9);sc('dshrub'+(a%3),x,y,{ox:(R(a,8,45)-.5)*.6,oy:(R(a,9,45)-.5)*.6,sc:.8+R(a,10,45)*.5})}
  // food and water to be found beside the pool
  const spots=[[0,-4.4],[2.4,-4],[-2.6,-3.9],[4.2,-1.6],[-4.3,-1.2],[4.1,2.2],[-4,2.5],[1.6,4.4],[-1.9,4.3]];
  const solid=new Set(decor.filter(d=>d.block).map(d=>d.x+','+d.y));
  ['dates','water','dates','water','dates','water','apple','bread','water'].forEach((k,i)=>{const [dx,dy]=spots[i];let x=Math.round(cx+dx),y=Math.round(cy+dy);
    if(solid.has(x+','+y)){const n=[[0,0],[-1,0],[1,0],[0,-1],[0,1]].map(([a,b])=>[Math.round(cx+dx*.82)+a,Math.round(cy+dy*.82)+b]).find(([a,b])=>!solid.has(a+','+b)&&!items.some(q=>q.x===a&&q.y===b));if(n)[x,y]=n} // a find under a palm moves a step in towards the pool
    items.push({k,x,y})});
  // a few creatures: three small groups, far from the cave and the oasis
  const camp=(t,x,y,n,lvl)=>{let p=0;for(let k=0;k<n*8&&p<n;k++){const ex=x+Math.round((R(x,y,100+k)*2-1)*3),ey=y+Math.round((R(x,y,160+k)*2-1)*3);if(!enemies.some(e=>e.x===ex&&e.y===ey)&&!items.some(i=>i.x===ex&&i.y===ey)){enemies.push({t,x:ex,y:ey,lvl});p++}}};
  camp('scorpion',50,56,2,16);camp('dwolf',172,76,2,15);camp('scorpion',152,172,2,16);camp('dwolf',56,164,1,15);camp('scorpion',110,40,2,16);camp('dwolf',110,184,2,15);camp('scorpion',190,120,1,16);
  return {rows,fm,decor,scen,enemies,items,start:{x:2,y:cy,f:1}};
}
const BLUEDUNES=buildBlueDunes();
// the way in: a small, low cave in the east wall of the Sand Road
const BLUECAVE=(()=>{
  const rows=LEVEL41_DATA.rows;let best=null;
  for(let y=90;y<200;y++){const r=rows[y];for(let x=r.length-3;x>40;x--){if(r[x]==='.'&&r[x+1]==='D'){if(!best||x>best.x)best={x,y};break}}}
  const {x,y}=best;
  rows[y]=rows[y].slice(0,x+1)+'2'+rows[y].slice(x+2);
  for(const list of [SANDROAD.decor,SANDROAD.scen,SANDROAD.enemies])for(let i=list.length-1;i>=0;i--){const d=list[i],dx=(d.x!==undefined?d.x:Math.floor(d.wx))-x,dy=(d.y!==undefined?d.y:Math.floor(d.wy))-y;if(Math.abs(dx)<=3&&Math.abs(dy)<=3)list.splice(i,1)}
  LEVEL41_DATA.portals[2]={to:60,x:2,y:BDN.OY,f:1,tex:'bluecave'};
  return {x,y,f:3};
})();
const LEVEL60_DATA={rows:BLUEDUNES.rows,start:BLUEDUNES.start,enemies:BLUEDUNES.enemies,items:BLUEDUNES.items,decor:BLUEDUNES.decor,scenery:BLUEDUNES.scen,fmap:BLUEDUNES.fm,outdoor:true,day:.97,floor:'bluesand',
  floorSet:['bluesand','bluesand2','bluegrass','bluewater'],ceil:'cloud',noExtras:true,name:'The Blue Dunes',label:'Blue Dunes',diff:16,
  portals:[{to:41,x:BLUECAVE.x,y:BLUECAVE.y,f:BLUECAVE.f,tex:'bluecave'}]};
LEVELS[60]=LEVEL60_DATA;LEVEL_NAMES[60]=LEVEL60_DATA.name;
function dsLowCave(){ // a small, low cave mouth at the foot of a sand-blue face
  const [c,x]=tcv();
  const g=x.createLinearGradient(0,0,0,TS);g.addColorStop(0,'#cfe0f4');g.addColorStop(.5,'#9db8dc');g.addColorStop(1,'#6a86b8');x.fillStyle=g;x.fillRect(0,0,TS,TS);
  for(let i=0;i<14;i++){const yy=6+i*8;x.strokeStyle=i%2?'rgba(255,255,255,.25)':'rgba(40,60,110,.2)';x.lineWidth=1.5;x.beginPath();x.moveTo(0,yy);for(let k=1;k<=8;k++)x.lineTo(TS*k/8,yy+Math.sin(k*1.3+i)*3);x.stroke()}
  x.fillStyle='#10131c';x.beginPath();x.moveTo(36,TS);x.lineTo(36,86);x.quadraticCurveTo(64,66,92,86);x.lineTo(92,TS);x.closePath();x.fill();      // low and small: the opening only reaches up a third of the wall
  x.strokeStyle='#4a5f8c';x.lineWidth=5;x.stroke();
  const sg=x.createLinearGradient(0,TS-24,0,TS);sg.addColorStop(0,'rgba(184,206,236,0)');sg.addColorStop(1,'rgba(184,206,236,.95)');x.fillStyle=sg;x.beginPath();x.moveTo(36,TS);x.lineTo(44,TS-22);x.lineTo(84,TS-18);x.lineTo(92,TS);x.fill();
  return addTex(pix(c));
}
function makeBlueArt(ydune,ycl){
  FLOORS.bluesand=dsSand([186,208,238],[130,156,206],301,1.1);
  FLOORS.bluesand2=dsSand([170,194,230],[118,144,198],311,.9);
  FLOORS.bluegrass=dsFloor((x,y)=>{const n=dsNoise(x,y,5,321)*.6+dsNoise(x,y,10,322)*.4,k=.86+.3*(n-.5);return [118*k,170*k,92*k]}); // green round the pool
  FLOORS.bluewater=dsFloor((x,y)=>{const n=dsNoise(x,y,4,331),r=Math.sin(TAU*(2*x/TS+y/TS+n))*.5+.5,k=.86+.2*r;return [66*k,128*k,184*k]});
  for(let i=0;i<3;i++){
    IMG['bdune'+i]=dsDune(380+i*40,76+i*12,700+i*9,DS_BLU);NPC_H['bdune'+i]=.55+i*.1;
    IMG['bpeb'+i]=dsDune(150,26,800+i*7,DS_BLU);NPC_H['bpeb'+i]=.16;
  }
  LEVEL60_DATA.chars={D:ydune,C:ycl};
  T_DOORS.bluecave=dsLowCave();DS_TEXREG.bluecave=T_DOORS.bluecave;
}
