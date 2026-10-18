/* ==========================================================================
   GO TO AREA: SEARCH. Type to filter the list of areas by name (the Search button asks for the words on a touch screen). Only the title screen's "Go to area"
   uses this, and that button is not in the itch.io build.
   ========================================================================== */
G.goq='';
{const _l=gotoList;gotoList=function(){const A=_l.apply(this,arguments),q=(G.goq||'').trim().toLowerCase();if(!q)return A;
  const out=[];let head=null;for(const r of A){if(r.h){head=r;continue}if(String(r.name).toLowerCase().includes(q)||String(r.n)===q){if(head){out.push(head);head=null}out.push(r)}}
  if(!out.length)out.push({h:'No area matches "'+G.goq+'"'});return out}}
{const _d=drawGoto;drawGoto=function(){_d.apply(this,arguments);
  ctx.fillStyle='rgb(14,10,8)';ctx.fillRect(30,29,420,17);
  ctx.fillStyle='rgba(60,46,24,.95)';rrect(ctx,36,30,330,15,3);ctx.fill();ctx.lineWidth=1;ctx.strokeStyle='#8a7448';ctx.stroke();
  txt(G.goq?G.goq+(Math.floor(G.time*2)%2?'|':''):'Type to search the areas ...',42,38,8.5,G.goq?'#f0e4b4':'#8a7a58','left',false,undefined,318);
  btnText('go_search','Search',372,30,48,15);if(G.goq)btnText('go_clear','x',424,30,22,15)}}
{const _h=handleBtn;handleBtn=function(id){
  if(G.state==='goto'){
    if(id==='go_search'){let v=null;try{v=prompt('Search the areas by name',G.goq||'')}catch(e){}if(v!==null){G.goq=String(v);G.gs=0}return}
    if(id==='go_clear'){G.goq='';G.gs=0;return}}
  return _h.apply(this,arguments)}}
addEventListener('keydown',e=>{
  if(G.state!=='goto'||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key;let used=true;
  if(k==='Backspace'){G.goq=(G.goq||'').slice(0,-1);G.gs=0}
  else if(k==='Escape'&&G.goq){G.goq='';G.gs=0}
  else if(k.length===1&&(G.goq||'').length<30){G.goq=(G.goq||'')+k;G.gs=0}
  else used=false;
  if(used){e.preventDefault();e.stopImmediatePropagation()}
},true);
