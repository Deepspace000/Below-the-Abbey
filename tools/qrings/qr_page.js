/* injected into the page by the harness */
window.QR={
 buildAll(){let n=0;for(const k of Object.keys(KH_LAZY)){if(LEVELS[k])continue;try{KH_LAZY[k]();n++}catch(e){}}return n},
 npcIdx(){const o={};for(const lv in LEVELS){const L=LEVELS[lv];if(!L||!L.decor)continue;for(const d of L.decor){if(!d.npc)continue;(o[d.npc]=o[d.npc]||[]).push({lvl:+lv,x:d.x,y:d.y,hid:!!d.hidden})}}return o},
 info(id,idx){const q=QUESTS[id];if(!q)return null;
  const gi=[];for(const n in QGIVER){let v;try{v=QGIVER[n]}catch(e){continue}if([].concat(v||[]).includes(id))gi.push(n)}
  const who=(q.who||'').split(',')[0].trim();
  const byname=[];for(const n in NPCS){if(NPCS[n]&&NPCS[n].name&&NPCS[n].name.split(',')[0].trim()===who&&idx[n])byname.push(n)}
  let tg=[];try{tg=q.targets||[]}catch(e){}
  return {id,title:q.title,who:q.who,need:q.need,gi,byname,tg,hasSpot:typeof q.spot==='function',goalLevel:typeof q.goalLevel==='function'?'fn':q.goalLevel,
   gpos:[].concat(...gi.map(n=>(idx[n]||[]).map(p=>Object.assign({n},p)))),npos:[].concat(...byname.map(n=>(idx[n]||[]).map(p=>Object.assign({n},p)))),
   tpos:[].concat(...tg.map(n=>(idx[n]||[]).map(p=>Object.assign({n},p)))),area:QAREA[id]}}
};
/* ---- recording hooks and the click test ---- */
QR.rec={on:false,ev:[]};QR.geo=null;QR.goalSave={};
(function(){const P=CanvasRenderingContext2D.prototype;
 const ell=P.ellipse,arc=P.arc,ft=P.fillText,st=P.strokeText;
 P.ellipse=function(x,y,rx,ry){if(QR.rec.on&&this===ctx&&this.strokeStyle==='#ffe24a'&&this.lineWidth>3)QR.rec.ev.push({t:'ring',x,y,r:rx,tr:this.getTransform().a});return ell.apply(this,arguments)};
 P.arc=function(x,y,r){if(QR.rec.on&&this===ctx&&this.strokeStyle==='#e0b020'&&Math.abs(this.lineWidth-3.2)<.01)QR.rec.ev.push({t:'wring',x,y,r});return arc.apply(this,arguments)};
 P.fillText=function(s,x,y){if(QR.rec.on&&this===ctx)QR.rec.ev.push({t:'txt',s:String(s),x,y,al:this.textAlign,f:this.font});return ft.apply(this,arguments)};
 P.strokeText=function(s,x,y){if(QR.rec.on&&this===ctx)QR.rec.ev.push({t:'txt',s:String(s),x,y,al:this.textAlign,f:this.font});return st.apply(this,arguments)};
 const dqr=window.drawQuestRings;window.drawQuestRings=function(ox,oy,cs){QR.geo={ox,oy,cs};return dqr.apply(this,arguments)};
})();
QR.sleep=ms=>new Promise(r=>setTimeout(r,ms));
QR.setState=function(id,stage){const q=QUESTS[id];
 if(q.__goal0===undefined)q.__goal0=q.goal;else q.goal=q.__goal0;
 if(stage==='give'){delete G.quests[id];return}
 G.quests[id]={st:'active',ord:(G.flags.qSeq=(G.flags.qSeq|0)+1),base:0};
 if(stage==='ready'){const n=q.need;q.goal=()=>n}else{q.goal=()=>0}};
QR.fresh=function(pre){G.flags={townSeen:1,abbeyIntroSeen:1,gwoodSeen:1};G.quests={};G.lst={};QR.pre=pre||null;};
QR.goto=async function(lvl){if(lvl>=490&&lvl<=499||lvl===7000||(lvl>=7000&&lvl<7100)){try{if(typeof GM!=='undefined'&&!GM.ready)await gmLoad()}catch(e){}if((lvl===496||(lvl>=7000&&lvl<7100))&&!LEVELS[496]){for(let i=0;i<80&&!LEVELS[496];i++){try{if(wlBuild())break}catch(e){break}await QR.sleep(500)}}}
 if((lvl===44||(lvl>=199&&lvl<=270))&&LEVELS[44]&&LEVELS[44].stub){let d=0;khEnter(()=>{d=1});for(let i=0;i<150&&!(d&&!LEVELS[44].stub);i++)await QR.sleep(200)}
 if(!LEVELS[lvl]&&KH_LAZY[lvl])KH_LAZY[lvl]();if(LEVEL===lvl){goToLevel(lvl===1?2:1);G.lst={}}goToLevel(lvl);for(let i=0;i<12&&LEVEL!==lvl;i++){await QR.sleep(400);goToLevel(lvl)}
 G.cut=null;G.talk=null;G.state='play';G.menu=false;G.map=false;G.overview=false;G.world=false;G.qFocus=null;G.inv&&(G.inv.open=false);G.loot=null};
QR.click=function(id){G.menu='quests';G.qs=0;let found=false;
 for(let i=0;i<60&&!found;i++){BTNS=[];try{drawQuestLog()}catch(e){return {err:'log '+e}}found=BTNS.some(b=>b.id==='qrow_'+id);if(!found){if(G.qs>=G.qMax)break;G.qs+=60}}
 if(found){handleBtn('qrow_'+id);return {panel:true}}
 G.menu=false;questShow(id);return {panel:false}};
QR.test=async function(id,stage,lvl,pre){
 const out={id,stage,lvl};try{
 QR.fresh(pre);QR.setState(id,stage);if(pre){try{(0,eval)(pre)}catch(e){out.preErr=String(e)}}await QR.goto(lvl);if(pre){try{(0,eval)(pre)}catch(e){}}await QR.sleep((lvl===483||lvl===484)?1300:150);out.level=LEVEL;
 QR.rec.ev=[];QR.geo=null;
 const c=QR.click(id);out.panel=c.panel;out.err=c.err;
 await QR.sleep(60);let got=[];for(let t=0;t<34;t++){QR.rec.ev=[];QR.rec.on=true;await QR.sleep(380);QR.rec.on=false;got=QR.rec.ev;if(got.some(e=>e.t==='ring'||e.t==='wring'))break}QR.rec.ev=got;
 out.overview=!!G.overview;out.world=!!G.world;out.focus=G.qFocus?{id:G.qFocus.id,lvl:G.qFocus.lvl,loc:G.qFocus.loc}:null;out.note=G.qNote?G.qNote.text:null;
 const ev=QR.rec.ev,ring=ev.filter(e=>e.t==='ring'),wr=ev.filter(e=>e.t==='wring');
 if(ring.length&&QR.geo){const e=ring[ring.length-1],g=QR.geo;out.ring={cx:(e.x-g.ox)/g.cs-.5,cy:(e.y-g.oy)/g.cs-.5,px:e.x,py:e.y,pr:e.r};}
 if(wr.length){const e=wr[wr.length-1];out.wring={x:e.x,y:e.y,r:e.r}}
 if(out.ring){try{out.reach=QR.reach(Math.round(out.ring.cx),Math.round(out.ring.cy))}catch(e){}}
 out.goto=ev.some(e=>e.t==='txt'&&/^Go to/.test(e.s));out.texts=[...new Set(ev.filter(e=>e.t==='txt').map(e=>e.s))].slice(0,12);
 let sp=[];try{sp=questSpots().filter(s=>s.q===id)}catch(e){}out.spots=sp.map(s=>({x:s.x,y:s.y,k:s.kind}));
 try{out.target=questTargetLevel(id)}catch(e){out.target='err'}
 try{const specs=QRF.specs(id,QRF.stage(id));out.stg=QRF.stage(id);out.expLevels=QRF.levels(specs);out.exp=[].concat(...specs.map(sp=>QRF.live(sp)));out.door=spotsDoor(id)}catch(e){out.expErr=String(e)}
 try{const l=questWorldLoc(id);out.loc=l?l.k:null}catch(e){}
 }catch(e){out.err=String(e)+(e.stack||'').slice(0,200)}
 return out};

function spotsDoor(id){try{return questSpots().filter(s=>s.q===id&&/^Go to/.test(s.t)).length>0}catch(e){return false}}
QR.reach=function(x,y){if(!G.grid||!G.P)return null;const H=G.grid.length,W=G.grid[0].length,seen=new Uint8Array(W*H),q=[[G.P.x|0,G.P.y|0]];seen[(G.P.y|0)*W+(G.P.x|0)]=1;
 const near=(a,b)=>Math.abs(a-x)+Math.abs(b-y)<=1;
 while(q.length){const [cx,cy]=q.pop();if(near(cx,cy))return true;for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=cx+dx,ny=cy+dy;if(nx<0||ny<0||nx>=W||ny>=H||seen[ny*W+nx])continue;seen[ny*W+nx]=1;const v=G.grid[ny][nx];if(v===0||v===3||v===4||v===5||v===7||v===8)q.push([nx,ny])}}
 return G.decor.some(d=>d.k==='teleporter')?'tele':false};
/* path over doors: the game's own (quest_rings_fix.js) path finder, so the test walks the same way the ring points */
QR.path=function(a,b){QRF.budget=100000;const r=QRF.path(a,b);return r};
QR.starts=function(target){const dist={[target]:0},q=[target];while(q.length){const c=q.shift();if(dist[c]>=3)continue;for(const n of QRF.adj(c))if(!(n in dist)){dist[n]=dist[c]+1;q.push(n)}}return dist};
/* a drawing error must not stop the game loop in the test */
{const _ui=ui;ui=function(){try{return _ui.apply(this,arguments)}catch(e){QR.uiErr=String(e)}}}
