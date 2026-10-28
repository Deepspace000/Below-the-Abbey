()=>{
const L=LEVELS[477],E=L._hgdwe,open=(x,y)=>L.rows[y]&&L.rows[y][x]==='.';
const far=L._hgdw.far, stairs=(L._hgdw.stairs||[]).map(s=>[s.x,s.y,s.ax,s.ay]);
const V=E.vignettes.map(v=>({n:v.name,x:v.x,y:v.y}));
const out={far,stairs,vig:V.map(v=>[v.n,v.x,v.y]),nEnemiesLevel:L.enemies.length,nEnemiesPlay:(G.enemies||[]).length};
const isFar=e=>Math.abs(e.x-far.x)<=2&&Math.abs(e.y-far.y)<=2;
function check(list,label){
  const res={within6:[],within8seen:[],onAppr:[],farCore:[],minDist:1e9,minWho:null};
  const D4=[[0,-1],[1,0],[0,1],[-1,0]];
  const appr=new Set();
  for(const v of V)for(const d of D4){for(let k=1;k<=6;k++){const x=v.x+d[0]*k,y=v.y+d[1]*k;if(!open(x,y))break;appr.add(x+','+y+'|'+v.n+'|'+k)}}
  const apprSq={};for(const a of appr){const p=a.split('|');(apprSq[p[0]]=apprSq[p[0]]||[]).push(p[1]+'@'+p[2])}
  for(const e of list){
    const ex=Math.round(e.x),ey=Math.round(e.y);
    if(isFar(e)){res.farCore.push([e.t,e.x,e.y]);continue}
    let md=1e9,mn=null;
    for(const v of V){const dd=Math.hypot(v.x-e.x,v.y-e.y);if(dd<md){md=dd;mn=v.n}
      // straight line of sight within 8
      if((ex===v.x||ey===v.y)&&dd<=8.5){const dx=Math.sign(v.x-ex),dy=Math.sign(v.y-ey);let cx=ex,cy=ey,ok=true;while(cx!==v.x||cy!==v.y){cx+=dx;cy+=dy;if(!open(cx,cy)){ok=false;break}}if(ok)res.within8seen.push([e.t,ex,ey,v.n,+dd.toFixed(1)])}}
    if(md<6)res.within6.push([e.t,e.x,e.y,mn,+md.toFixed(2)]);
    if(md<res.minDist){res.minDist=md;res.minWho=[e.t,e.x,e.y,mn]}
    const key=ex+','+ey;if(apprSq[key])res.onAppr.push([e.t,ex,ey,apprSq[key]]);
  }
  res.minDist=+res.minDist.toFixed(2);return res}
out.level=check(L.enemies,'level');
out.play=check(G.enemies||[],'play');
// kinds of creatures
const kinds={};for(const e of L.enemies){kinds[e.t]=(kinds[e.t]||0)+1}out.kinds=kinds;
return out}
