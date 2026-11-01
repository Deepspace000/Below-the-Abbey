/* ==========================================================================
   BONES REMAKE (prefix bn / BN). The remains that lie on the floor of the dungeons were a pile drawn in code (IMG.bones). They are replaced by painted
   pieces (Gemini, strict front elevation, cut by tools/bn_ingest.py from ART-HOLD/ep/bones_*.jpg, kept in assets/ep/bn_*.webp and loaded with the
   other early polish pictures by epLoad): skulls, ribcages, long bones, slumped skeletons, wolf and rat skeletons, and so on.
   When a level is loaded, each old 'bones' (and the painted ep_bonepile and ep_skel_slump that early_polish scatters) is given one of the new pieces, chosen
   by a hash of its square and the kind of place (crypt, cave, wolf den, mine, desert), with a mirror image and a little size change. Same square, same
   block flag. A few dungeons get extra pieces on bare floor (never in a passage, never at a door, stair or secret room).
   ========================================================================== */
/* heights in squares (a skull is small, a slumped skeleton is a person) */
Object.assign(EP_H,{ep_bn_skull:.2,ep_bn_ribs:.26,ep_bn_longbones:.2,ep_bn_skullpile:.34,ep_bn_jaw:.14,ep_bn_potshards:.24,ep_bn_buried:.26,ep_bn_rat:.1,ep_bn_swordshield:.32,ep_bn_cloak:.3,ep_bn_wolfskull:.15,ep_bn_skelside:.2,ep_bn_wolfskel:.2,ep_bn_moss:.3,ep_bn_crushed:.16,ep_bn_chain:.38,ep_bn_ribdome:.28,ep_bn_skelcurl:.36,ep_bn_twoskulls:.2,ep_bn_skel_sit:.62});
const BN_DRY=new Set(['skull','ribs','longbones','skullpile','jaw','buried','wolfskull','skelside','wolfskel','crushed','ribdome','skelcurl','twoskulls','skel_sit','potshards']); // bleached in the desert (no moss, no cloak)
const BN_THEME={
  crypt:['skel_sit','skelcurl','ribs','ribdome','skullpile','chain','jaw','longbones','potshards','crushed','buried','swordshield','skelside','longbones','ribs'],
  cave:['longbones','ribs','buried','crushed','skelside','skelcurl','rat','jaw','wolfskull','potshards','skel_sit','ribdome'],
  den:['wolfskel','wolfskull','wolfskel','rat','longbones','ribs','crushed','skelside','buried','jaw','wolfskull','skelcurl'],
  mine:['chain','swordshield','skelcurl','buried','crushed','longbones','rat','ribs','skel_sit','potshards','skelside'],
  dry:['ribs','longbones','skullpile','jaw','buried','wolfskull','skelside','crushed','ribdome','skelcurl','skel_sit','potshards','wolfskel']};
const BN_FIG={crypt:['skel_sit','skelcurl','chain','swordshield','skelside','buried'],cave:['skel_sit','skelcurl','skelside','buried'],den:['wolfskel','skelside','buried','skelcurl'],mine:['chain','swordshield','skelcurl','skel_sit','buried'],dry:['skel_sit','skelcurl','skelside','buried','wolfskel']}; // whole figures: set against a wall
const BN_LV={1:'crypt',9:'crypt',11:'crypt',12:'crypt',31:'crypt',501:'crypt',8:'cave',25:'cave',23:'den',18:'mine',42:'dry',65:'dry'};
const BN_EXTRA={1:4,8:2,9:1,11:1,12:1,18:2,23:2,25:1,31:1,42:2,65:1,501:2,448:1,456:1};   // used sparingly: the old piles are swapped one for one, and only a few extra pieces go on bare floor
const BN_OLD=new Set(['bones','ep_bonepile','ep_skel_slump']);
function bnTheme(n,L){if(BN_LV[n])return BN_LV[n];if((L.enemies||[]).some(e=>/wolf|bear/.test(e.t||'')))return 'den';if((L.decor||[]).some(d=>d.k==='dbones'))return 'dry';return 'crypt'}
/* a variant of a painted piece: ~f mirrored, ~d bleached (made on first use) */
function bnVar(k){if(IMG[k])return IMG[k];const m=/^(ep_bn_\w+)~([fdg]+)$/.exec(k);if(!m)return null;const b=IMG[m[1]];if(!b||!b.width)return null;
  const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');if(m[2].includes('f')){x.translate(b.width,0);x.scale(-1,1)}x.filter=m[2].includes('d')?'sepia(.3) saturate(.62) brightness(1.08) contrast(.94)':'sepia(.38) saturate(.85) brightness(.7) contrast(1.06)';x.drawImage(b,0,0);x.filter='none';
  const g=x.createLinearGradient(0,b.height*.86,0,b.height);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');x.globalCompositeOperation='destination-out';x.fillStyle=g;x.fillRect(0,b.height*.86,b.width,b.height*.14);x.globalCompositeOperation='source-over';
  if(m[1]==='ep_bn_skel_sit'){const h=b.height,w=b.width,sg=x.createRadialGradient(w*.5,h*.97,2,w*.5,h*.97,w*.5);sg.addColorStop(0,'rgba(0,0,0,.6)');sg.addColorStop(1,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-over';x.save();x.translate(0,h*.97);x.scale(1,.18);x.translate(0,-h*.97);x.fillStyle=sg;x.fillRect(0,h*.5,w,h);x.restore();x.globalCompositeOperation='source-over'} // a contact shadow under the figure that has no mound
  IMG[k]=c;if(NPC_H[m[1]])NPC_H[k]=NPC_H[m[1]];return c}
function bnMake(arr){for(const d of arr||[])if(d.k&&d.k.startsWith('ep_bn_')&&d.k.includes('~'))bnVar(d.k)}
function bnPick(n,x,y,list,dry,near,salt){let pick=list[(hash2(x,y,n*13+7+(salt||0))*list.length)|0];for(let t=0;t<list.length&&near.includes(pick);t++)pick=list[(list.indexOf(pick)+1)%list.length];
  const f=hash2(x,y,n*13+9)<.5,d=dry&&BN_DRY.has(pick);return 'ep_bn_'+pick+'~'+(f?'f':'')+(d?'d':'g')}
function bnSwap(n,L,arr,dry,theme){let c=0;const list=BN_THEME[theme],figs=BN_FIG[theme],prev=[];
  for(const d of arr){const old=d.k==='dbones'?(dry&&((L.rows||[]).length*((L.rows||[''])[0].length)<=8000)):BN_OLD.has(d.k);if(!old)continue;if(d.epSecP||d.npc||d.hidden||d.wd||d.pic||d.secret||d.sr||d.srB)continue;
    const near=prev.filter(p=>Math.abs(p[0]-d.x)+Math.abs(p[1]-d.y)<5).map(p=>p[2].replace(/^ep_bn_|~\w*$/g,''));const k=bnPick(n,d.x,d.y,d.k==='ep_skel_slump'?figs:list,dry,near);
    prev.push([d.x,d.y,k]);d.k=k;delete d.lk;d.sc=+((.92+hash2(d.x,d.y,n*13+11)*.22)*(dry?1.2:1)).toFixed(2);d.deco=true;c++}return c}
/* extra pieces on bare floor: room squares only (never a passage, never beside a door, stair or secret room) */
function bnExtras(n,L,count,theme,dry){const R=L.rows,H=R.length,W=R[0].length,op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&R[y][x]==='.',wall=(x,y)=>x<0||y<0||x>=W||y>=H||R[y][x]==='#'||R[y][x]==='%';
  const used=new Set();for(const a of [L.enemies||[],L.items||[],L.decor||[]])for(const o of a)used.add(Math.round(o.x)+','+Math.round(o.y));
  const keep=[[L.start.x,L.start.y]];for(const s of [...(typeof EP_SECRETS!=='undefined'&&EP_SECRETS[n]||[]),...(typeof SR_ROOMS!=='undefined'&&SR_ROOMS[n]||[])]){keep.push(s.door,s.from);for(const c of s.cells||[])keep.push(c);if(s.chest)keep.push(s.chest)}
  for(const l of L.lights||[])keep.push([Math.floor(l[0]),Math.floor(l[1])]);
  const cands=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!op(x,y)||used.has(x+','+y))continue;let o=0,odd=false;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){if(op(x+a,y+b))o++;else if(!wall(x+a,y+b))odd=true}
    if(o<6||odd)continue;if(keep.some(p=>Math.abs(p[0]-x)<=2&&Math.abs(p[1]-y)<=2))continue;
    const wn=[[0,-1],[0,1],[1,0],[-1,0]].filter(([a,b])=>wall(x+a,y+b));cands.push({x,y,h:hash2(x,y,n*17+5),side:wn.length===1?wn[0]:null})}
  cands.sort((a,b)=>a.h-b.h);const put=[],far=(c,r)=>put.every(p=>Math.abs(p.x-c.x)+Math.abs(p.y-c.y)>=r),list=BN_THEME[theme],figs=BN_FIG[theme];let made=0;
  const add=(c,key,o)=>{put.push(c);made++;L.decor.push(Object.assign({k:key,x:c.x,y:c.y,deco:true,block:false,sc:+((.94+hash2(c.x,c.y,n*17+8)*.2)*(dry?1.2:1)).toFixed(2)},o||{}))};
  if(n===1){let X=null;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(R[y][x]==='X')X=[x,y]; // a ribcage near the way out
    if(X){const c=cands.filter(c=>{const d=Math.abs(c.x-X[0])+Math.abs(c.y-X[1]);return d>=3&&d<=6}).sort((a,b)=>a.h-b.h)[0];if(c){add(c,bnPick(n,c.x,c.y,['ribdome','ribs'],false,[],3),{})}}}
  const nf=Math.round(count*.4);for(const c of cands){if(made>=nf+(n===1?1:0))break;if(!c.side||put.includes(c)||!far(c,5))continue;const k=bnPick(n,c.x,c.y,figs,dry,[],5);add(c,k,{ox:c.side[0]*.2,oy:c.side[1]*.2})}
  for(const c of cands){if(made>=count+(n===1?1:0))break;if(put.includes(c)||!far(c,3))continue;add(c,bnPick(n,c.x,c.y,list,dry,[],9))}
  return made}
function bnPre(n){if(self.EP_OFF||self.BN_OFF)return;if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();const L=LEVELS[n];if(!L||!L.decor||L._bn||!L.rows)return;L._bn=1;
  if(typeof epProps==='function'&&typeof EP_SPEC!=='undefined'&&EP_SPEC[n])epProps(n,EP_SPEC[n]); // its pieces are in the list before we look
  const theme=bnTheme(n,L),dry=theme==='dry';let c=bnSwap(n,L,L.decor,dry,theme);if(BN_EXTRA[n])c+=bnExtras(n,L,BN_EXTRA[n],theme,dry);if(c)L._bnOn=1}
function bnPost(n){if(self.EP_OFF||self.BN_OFF)return;const L=LEVELS[n];if(!L)return;
  if(L._bnOn||(G.decor||[]).some(d=>BN_OLD.has(d.k)||(d.k&&d.k.startsWith('ep_bn_')))){const theme=bnTheme(n,L);bnSwap(n,L,G.decor,theme==='dry',theme); // anything a later hook put in
    try{epLoad().then(()=>{if(LEVEL===n)bnMake(G.decor)})}catch(e){}if(EP.ready)bnMake(G.decor)}}
{const _ll=loadLevel;loadLevel=function(n){try{bnPre(n)}catch(e){console.error('bn pre',e)}const r=_ll.apply(this,arguments);try{bnPost(n)}catch(e){console.error('bn post',e)}return r}}

/* the old code-drawn pile (IMG.bones) is never shown any more: wherever that picture is still asked for (a level the swap did not reach), a painted heap of bones stands in */
{const iv=setInterval(()=>{try{if(typeof IMG!=='undefined'&&IMG.ep_bn_longbones&&IMG.ep_bn_longbones.width){IMG.bones=IMG.ep_bn_longbones;if(typeof NPC_H!=='undefined')NPC_H.bones=.2;clearInterval(iv)}}catch(e){}},1500)}
