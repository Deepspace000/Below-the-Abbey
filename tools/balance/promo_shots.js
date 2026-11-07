/* Promo screenshots: loads each level with creatures, stands the party a few squares in front of a group of creatures, and POSTs the canvas to a local receiver (port 8920).
   Use: fetch('tools/balance/promo_shots.js').then(r=>r.text()).then(eval); then await PS.run(ids) in batches of ~10 (the tool call limit is 45 s). */
(function(){
const PS=window.PS={meta:{},busy:false};
PS.cap=async name=>{render3D();ctx.setTransform(2,0,0,2,0,0);try{ui(.016)}catch(e){}ctx.setTransform(1,0,0,1,0,0);const d=ctx.canvas.toDataURL('image/jpeg',.9);await fetch('http://127.0.0.1:8920/'+name+'.txt',{method:'POST',body:d});return d.length};
PS.pose=L=>{const rows=L.rows,open=(x,y)=>rows[y]&&rows[y][x]==='.';
  const list=(L.enemies||[]).map(e=>Array.isArray(e)?{t:e[0],x:e[1],y:e[2]}:e).filter(e=>ENEMY_DEF[e.t]);
  const nb=list.filter(e=>!ENEMY_DEF[e.t].boss),use=nb.length?nb:list,dirs=[[1,0,3],[-1,0,1],[0,1,0],[0,-1,2]],best=[];
  for(const e of use)for(const [dx,dy,f] of dirs)for(const d of [4,5,3,6,2]){let ok=true;for(let k=1;k<=d;k++)if(!open(e.x+dx*k,e.y+dy*k)){ok=false;break}
    if(ok){best.push({x:e.x+dx*d,y:e.y+dy*d,f,t:e.t,n:list.filter(q=>Math.abs(q.x-e.x)+Math.abs(q.y-e.y)<=6).length,d});break}}
  best.sort((a,b)=>(b.n-a.n)||(a.d===4?-1:1));return best[0]||null};
PS.run=async ids=>{for(const id of ids){try{goToLevel(id);await new Promise(r=>setTimeout(r,1800));G.cut=null;G.state='play';
    if(LEVEL!==id){PS.meta[id]={fail:'level '+LEVEL};continue}
    const L=LEVELS[id],p=PS.pose(L);if(p){G.P.x=p.x;G.P.y=p.y;G.P.f=p.f;G.P.angT=(p.f-1)*Math.PI/2;G.C.x=p.x;G.C.y=p.y;G.C.a=G.P.angT}
    await new Promise(r=>setTimeout(r,450));await PS.cap('lv'+id);
    PS.meta[id]={n:L.name||LEVEL_NAMES[id],lab:L.label||'',types:[...new Set((L.enemies||[]).map(e=>Array.isArray(e)?e[0]:e.t))],pose:!!p,t:p&&p.t}}catch(e){PS.meta[id]={fail:String(e).slice(0,80)}}}
  return Object.keys(PS.meta).length};
PS.setup=()=>{drawCompare=function(){};tmApply(60,false,false);G.state='play';G.cut=null};
})();
