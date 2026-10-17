/* ==========================================================================
   GEMS, AND THE JEWEL HUNTER PAGE. Forty cut gems of every colour lie about on empty squares in the dungeons, a few to a dungeon, the better ones deeper down.
   Each is worth 40 to 300 gold at a shop. They are little and they lie on their side on the floor; the pictures on the Jewel Hunter page show them front-on.
   The page logs every gem found and sold. The same collection page serves the butterflies (butterflies.js).
   ========================================================================== */
const GEMS=[ // [key, name, value in gold, colour]
 ['garnet','Garnet',60,'#7a1020'],['ruby','Ruby',300,'#d01830'],['carnelian','Carnelian',45,'#d8501c'],['fireopal','Fire Opal',120,'#f07820'],['amber','Amber',50,'#e89a20'],
 ['citrine','Citrine',55,'#f0c830'],['topaz','Topaz',90,'#e8b820'],['yellowsapphire','Yellow Sapphire',150,'#f4e030'],['peridot','Peridot',65,'#a0d830'],['jade','Jade',70,'#80c090'],
 ['emerald','Emerald',280,'#10a050'],['malachite','Malachite',40,'#208048'],['greentourmaline','Green Tourmaline',100,'#208060'],['aquamarine','Aquamarine',110,'#80d8e0'],['turquoise','Turquoise',75,'#30c0b8'],
 ['bluetopaz','Blue Topaz',85,'#50b8f0'],['sapphire','Sapphire',270,'#1838b8'],['lapis','Lapis Lazuli',80,'#2848a8'],['tanzanite','Tanzanite',220,'#5058d0'],['iolite','Iolite',95,'#6070b0'],
 ['amethyst','Amethyst',60,'#8a30c0'],['violetspinel','Violet Spinel',140,'#7030f0'],['sugilite','Sugilite',105,'#8a1a90'],['rosequartz','Rose Quartz',42,'#f0b0c8'],['pinksapphire','Pink Sapphire',190,'#f02890'],
 ['rhodolite','Rhodolite',115,'#b01050'],['morganite','Morganite',130,'#f0b0a0'],['moonstone','Moonstone',100,'#d8e8f8'],['opal','Opal',160,'#f0f0f0'],['whitesapphire','White Sapphire',135,'#e8f0f8'],
 ['diamond','Diamond',300,'#ffffff'],['zircon','Zircon',90,'#c8e8f8'],['onyx','Onyx',48,'#101010'],['obsidian','Obsidian',40,'#303030'],['jet','Jet',44,'#181818'],
 ['blackopal','Black Opal',240,'#282838'],['smokyquartz','Smoky Quartz',46,'#706050'],['tigerseye','Tiger’s Eye',52,'#a06820'],['bloodstone','Bloodstone',68,'#204030'],['alexandrite','Alexandrite',290,'#308860']];
for(const [k,n,v,c] of GEMS)ITEMDEF['gem_'+k]={n,k:'quest',t:'Gem',ic:'ore',c,stack:1,price:Math.ceil(v/.4)+1,d:`A small cut ${n.toLowerCase()}. A shop pays about ${v} gold for it. It is logged in the Jewel Hunter page (Menu, More).`,sw:.2,gem:v};
if(typeof ART_ITEM_IDS!=='undefined')ART_ITEM_IDS.push(...GEMS.map(g=>'gem_'+g[0]));
const GEM_BY_VALUE=GEMS.slice().sort((a,b)=>a[2]-b[2]);
/* on the floor a gem lies on its side, small, with a little shadow: the painted picture squashed flat and tipped */
function gemGround(id){
  const src=IMG['icn_'+id];if(!src||IMG['it_'+id]&&IMG['it_'+id]._gem)return;
  const w=64,h=34,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  x.fillStyle='rgba(0,0,0,.38)';x.beginPath();x.ellipse(w/2,h*.8,w*.36,h*.13,0,0,TAU);x.fill();
  x.save();x.translate(w/2,h*.56);x.rotate(((id.charCodeAt(5)||0)%7-3)*.09);x.scale(1,.5);x.drawImage(src,-w*.42,-w*.42,w*.84,w*.84);x.restore();
  c._gem=1;IMG['it_'+id]=c;
}
function gemPlace(n,late){
  const L=LEVELS[n];if(!L||L._gems||!L.rows||L.outdoor||(L.day>0)||L.khRoom||!(L.enemies||[]).length)return;L._gems=1;
  const H=L.rows.length,W=L.rows[0].length;L.items=L.items||[];
  const taken=new Set();for(const o of [...(L.items||[]),...(L.enemies||[]),...(L.decor||[])])taken.add(o.x+','+o.y);
  const st=L.start||{x:1,y:1};let floor=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(L.rows[y][x]==='.')floor++;
  const cnt=Math.max(1,Math.min(7,Math.round(floor/230))),rating=(typeof LEVEL_RATING!=='undefined'&&LEVEL_RATING[n])||L.diff||n,skew=Math.min(1,rating/90)*.6;
  const near=(x,y)=>{for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++){const c=(L.rows[y+dy]||'')[x+dx];if(c&&c!=='.'&&c!=='#'&&/[0-9]/.test(c))return true}return Math.abs(x-st.x)+Math.abs(y-st.y)<6};
  let placed=0;
  for(let t=0;t<900&&placed<cnt;t++){
    const x=1+Math.floor(hash2(t,n,811)*(W-2)),y=1+Math.floor(hash2(t,n,823)*(H-2));
    if(L.rows[y][x]!=='.'||taken.has(x+','+y)||near(x,y))continue;
    const u=hash2(placed,n,839),u2=u*(1-skew)+skew*hash2(placed,n,853),g=GEM_BY_VALUE[Math.min(39,Math.floor(u2*40))];
    taken.add(x+','+y);const it={k:'gem_'+g[0],x,y};L.items.push(it);if(late&&G.items)G.items.push(Object.assign({taken:false},it));placed++;
  }
}
{const _g=goToLevel;goToLevel=function(n,e){try{if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();gemPlace(n,false)}catch(x){console.error(x)}
  const r=_g.apply(this,arguments);try{if(LEVELS[n]&&!LEVELS[n]._gems)gemPlace(n,true);for(const g of GEMS)gemGround('gem_'+g[0])}catch(x){console.error(x)}return r}}
/* ---------- the log: what has been found and sold, for the gems and the butterflies ---------- */
const COLL={
  gems:{title:'JEWEL HUNTER',noun:'gem',prefix:'gem_',items:()=>GEMS.map(g=>({id:'gem_'+g[0],name:g[1],value:g[2]})),blurb:'Gems lie on the floors of dungeons. Pick one up to log it, and sell it at any shop.'}
};
const COLL_KIND={gem_:'gems',bf_:'bf'};
const collData=k=>{const F=G.flags;F.coll=F.coll||{};return F.coll[k]||(F.coll[k]={})};
function collFound(id){const k=COLL_KIND[id.slice(0,id.indexOf('_')+1)];if(!k)return;const d=collData(k),o=d[id]||(d[id]={f:0,s:0,g:0});o.f++}
function collSold(id,gold){const k=COLL_KIND[id.slice(0,id.indexOf('_')+1)];if(!k)return;const d=collData(k),o=d[id]||(d[id]={f:0,s:0,g:0});o.s++;o.g+=gold}
function drawColl(kind){
  BTNS=[];veil(.8);bigPanel(14,6,452,308);
  const C=COLL[kind],items=C.items(),d=collData(kind);
  let kinds=0,F=0,S=0,Gd=0;for(const it of items){const o=d[it.id];if(o&&(o.f||o.s))kinds++;if(o){F+=o.f;S+=o.s;Gd+=o.g}}
  txt(C.title,240,20,14,'#d8c88e','center',true);
  if(kind==='treasure'){const T=collData('treasure');txt(`${kinds} of ${items.length} finds    ${(T._digs||0)} digs    ${(T._gold||0)} gold in coins dug up`,240,35,8.5,'#e8d890','center',true)}
  else txt(`${kinds} of ${items.length} kinds found    ${F} found    ${S} sold for ${Gd} gold`,240,35,8.5,'#e8d890','center',true);
  const cols=items.length>30?10:items.length>20?8:6,cw=Math.floor(432/cols),ch=items.length>30?44:items.length>20?52:50,x0=24+(432-cw*cols)/2,y0=44;
  items.forEach((it,i)=>{const cx=x0+(i%cols)*cw,cy=y0+Math.floor(i/cols)*ch,o=d[it.id],got=o&&(o.f||o.s),sel=G.collSel===i;
    ctx.fillStyle=sel?'rgba(70,52,18,.9)':'rgba(22,19,16,.82)';rrect(ctx,cx+1,cy,cw-2,ch-3,3);ctx.fill();ctx.lineWidth=sel?1.8:1;ctx.strokeStyle=sel?'#ffe36a':'#5a4a2c';rrect(ctx,cx+1,cy,cw-2,ch-3,3);ctx.stroke();
    const im=IMG['icn_'+it.id];
    if(im){ctx.save();if(!got){ctx.globalAlpha=.22;ctx.filter='brightness(0)'}const s=items.length>30?28:30;ctx.drawImage(im,cx+(cw-s)/2,cy+1,s,s);ctx.restore()}
    else if(ITEMDEF[it.id]||it.glyph){ctx.save();if(!got){ctx.globalAlpha=.22;ctx.filter='brightness(0)'}itemIconOn(ctx,ITEMDEF[it.id]||{ic:it.glyph,c:'#e8c050'},cx+cw/2,cy+16,.9);ctx.restore()}
    txt(got?it.name:'? ? ?',cx+cw/2,cy+(items.length>30?32:34),5.8,got?'#e8dcb4':'#6a5a40','center',false,undefined,cw-4);
    if(got)txt(`found ${o.f}  sold ${o.s}`,cx+cw/2,cy+(items.length>30?39:42),5.3,'#a8d890','center',false,undefined,cw-4);
    btn('coll_'+i,cx,cy,cw,ch)});
  const sel=items[G.collSel];
  if(sel){const o=d[sel.id],got=o&&(o.f||o.s);txt(got?`${sel.name}: worth about ${sel.value} gold.  Found ${o.f}, sold ${o.s}${o.g?' for '+o.g+' gold':''}.`:'Not found yet.',240,274,9,'#e8dcb4','center',true)}
  else txt(C.blurb,240,274,8.5,'#a89878','center');
  btnText('coll_back','Back',190,284,100,24);
  btn('menuclose',0,0,DW,DH);BTNS.unshift(BTNS.pop());
}
function collBtn(id){
  if(id==='cl_back'){G.menu=menuBack();return}
  if(id==='cl_gems'||id==='cl_bf'||id==='cl_herb'||id==='cl_treasure'||id==='cl_shrines'){G.menuBack='collection';G.menu=id.slice(3);G.collSel=undefined;return}
  if(id==='coll_back'||id==='menu'||id==='menuclose'){G.collSel=undefined;G.menu=menuBack();return}
  const m=id.match(/^coll_(\d+)$/);if(m)G.collSel=+m[1];
}
