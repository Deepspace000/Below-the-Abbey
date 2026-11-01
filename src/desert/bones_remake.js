/* ==========================================================================
   BONES REMAKE (prefix bn / BN). The remains that lie on the floor of the dungeons were a pile drawn in code (IMG.bones). They are replaced by painted
   pieces (Gemini, strict front elevation, cut by tools/bn_ingest.py from ART-HOLD/ep/bones_*.jpg, kept in assets/ep/bn_*.webp and loaded with the
   other early polish pictures by epLoad): skulls, ribcages, long bones, slumped skeletons, wolf and rat skeletons, and so on.
   When a level is loaded, each old 'bones' (and the painted ep_bonepile and ep_skel_slump that early_polish scatters) is given one of the new pieces, chosen
   by a hash of its square and the kind of place (crypt, cave, wolf den, mine, desert), with a mirror image and a little size change. Same square, same
   block flag. A few dungeons get extra pieces on bare floor (never in a passage, never at a door, stair or secret room).
   ========================================================================== */
/* heights in squares (a skull is small, a slumped skeleton is a person) */
Object.assign(EP_H,{ep_bn2_femur_pair: 0.157, ep_bn2_rib_tiny: 0.119, ep_bn2_tibia_vert: 0.099, ep_bn2_rib_snap: 0.105, ep_bn2_cage1: 0.352, ep_bn2_cage2: 0.226, ep_bn2_collar: 0.124, ep_bn2_fingers: 0.102, ep_bn2_femur: 0.112, ep_bn2_tibia_brk: 0.138, ep_bn2_tibia2: 0.113, ep_bn2_skull_chip: 0.186, ep_bn2_skull_jaw: 0.197, ep_bn2_skull_half: 0.185, ep_bn2_skull_front: 0.181, ep_bn2_skull_roll: 0.192, ep_bn2_skel_back: 0.235, ep_bn2_skel_broken: 0.184, ep_bn2_skel_slump: 0.252, ep_bn2_skel_nohead: 0.215, ep_bn2_skel_half: 0.193, ep_bn2_t_finger1: 0.049, ep_bn2_t_knuckle: 0.041, ep_bn2_t_bonelet: 0.028, ep_bn2_t_vert1: 0.073, ep_bn2_t_vert2: 0.067, ep_bn2_t_finger2: 0.054, ep_bn2_t_finger3: 0.039, ep_bn2_t_finger4: 0.069, ep_bn2_t_chip1: 0.035, ep_bn2_t_chip2: 0.05,ep_bn_skull:.2,ep_bn_ribs:.26,ep_bn_longbones:.2,ep_bn_skullpile:.34,ep_bn_jaw:.14,ep_bn_potshards:.24,ep_bn_buried:.26,ep_bn_rat:.1,ep_bn_swordshield:.32,ep_bn_cloak:.3,ep_bn_wolfskull:.15,ep_bn_skelside:.2,ep_bn_wolfskel:.2,ep_bn_moss:.3,ep_bn_crushed:.16,ep_bn_chain:.38,ep_bn_ribdome:.28,ep_bn_skelcurl:.36,ep_bn_twoskulls:.2,ep_bn_skel_sit:.62});
/* THE LOOSE SET (bn2_*, painted 2026-11, ART-HOLD/ep/bones2_*.jpg): single bones, scattered rib cages, chipped skulls, disjointed skeletons, and tiny bones that lie a little way from the big piece.
   The first set (bn_*, heaps on little mounds) is kept on disk but only the wolf and rat skeletons are still picked. */
const BN_OLDKEEP=new Set(['wolfskel','wolfskull','rat']);
const BN_TINY=['t_finger1','t_knuckle','t_bonelet','t_vert1','t_vert2','t_finger2','t_finger3','t_finger4','t_chip1','t_chip2'];
const BN_THEME={
  crypt:['cage1','skull_chip','femur','skel_back','cage2','skull_jaw','tibia_vert','femur_pair','skull_half','rib_snap','skull_roll','collar','skel_broken','tibia_brk','skull_front'],
  cave:['skull_roll','cage2','femur','tibia2','skel_half','rat','skull_front','rib_tiny','wolfskull','cage1','fingers','collar','skull_chip'],
  den:['wolfskel','wolfskull','rat','wolfskel','cage1','femur','skull_chip','collar','tibia_brk','rib_tiny'],
  mine:['skull_half','femur_pair','cage2','rat','tibia_vert','skull_front','tibia_brk','collar','cage1','skull_jaw'],
  dry:['cage1','femur','skull_jaw','skull_roll','rib_snap','wolfskel','tibia2','skull_front','fingers','cage2','wolfskull','skull_chip']};
const BN_FIG={crypt:['skel_back','skel_broken','skel_slump','skel_nohead','skel_half'],cave:['skel_slump','skel_half','skel_back','skel_nohead'],den:['wolfskel','skel_half','skel_nohead','skel_broken'],mine:['skel_slump','skel_broken','skel_half','skel_back'],dry:['skel_nohead','skel_back','skel_broken','wolfskel','skel_half']}; // whole figures: lying broken, set against a wall
const BN_LV={1:'crypt',9:'crypt',11:'crypt',12:'crypt',31:'crypt',501:'crypt',8:'cave',25:'cave',23:'den',18:'mine',42:'dry',65:'dry'};
const BN_EXTRA={1:4,8:2,9:1,11:1,12:1,18:2,23:2,25:1,31:1,42:2,65:1,501:2,448:1,456:1};   // used sparingly: the old piles are swapped one for one, and only a few extra pieces go on bare floor
const BN_OLD=new Set(['bones','ep_bonepile','ep_skel_slump']);
function bnTheme(n,L){if(BN_LV[n])return BN_LV[n];if((L.enemies||[]).some(e=>/wolf|bear/.test(e.t||'')))return 'den';if((L.decor||[]).some(d=>d.k==='dbones'))return 'dry';return 'crypt'}
/* a variant of a painted piece: ~f mirrored, ~d bleached (made on first use) */
function bnVar(k){if(IMG[k])return IMG[k];const m=/^(ep_bn2?_\w+)~([fdg]+)$/.exec(k);if(!m)return null;const b=IMG[m[1]];if(!b||!b.width)return null;
  const c=document.createElement('canvas');c.width=b.width;c.height=b.height;const x=c.getContext('2d');if(m[2].includes('f')){x.translate(b.width,0);x.scale(-1,1)}x.filter=m[2].includes('d')?'sepia(.3) saturate(.62) brightness(1.08) contrast(.94)':m[1].startsWith('ep_bn2_')?'sepia(.38) saturate(.85) brightness(.6) contrast(1.08)':'sepia(.38) saturate(.85) brightness(.7) contrast(1.06)';x.drawImage(b,0,0);x.filter='none';
  if(m[1].startsWith('ep_bn_')){const g=x.createLinearGradient(0,b.height*.86,0,b.height);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');x.globalCompositeOperation='destination-out';x.fillStyle=g;x.fillRect(0,b.height*.86,b.width,b.height*.14);x.globalCompositeOperation='source-over'} // (the first set sat on mounds that faded out; the loose set lies on the floor line as it is)
  if(m[1]==='ep_bn_skel_sit'){const h=b.height,w=b.width,sg=x.createRadialGradient(w*.5,h*.97,2,w*.5,h*.97,w*.5);sg.addColorStop(0,'rgba(0,0,0,.6)');sg.addColorStop(1,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-over';x.save();x.translate(0,h*.97);x.scale(1,.18);x.translate(0,-h*.97);x.fillStyle=sg;x.fillRect(0,h*.5,w,h);x.restore();x.globalCompositeOperation='source-over'} // a contact shadow under the figure that has no mound
  if(m[1].startsWith('ep_bn2_')){const h=b.height,w=b.width,sg=x.createRadialGradient(w*.5,h*.97,2,w*.5,h*.97,w*.5);sg.addColorStop(0,'rgba(0,0,0,.55)');sg.addColorStop(1,'rgba(0,0,0,0)');x.globalCompositeOperation='destination-over';x.save();x.translate(0,h*.97);x.scale(1,.12);x.translate(0,-h*.97);x.fillStyle=sg;x.fillRect(0,h*.5,w,h);x.restore();x.globalCompositeOperation='source-over'} // a soft contact shadow on the floor line (the loose bones have no mound)
  IMG[k]=c;if(NPC_H[m[1]])NPC_H[k]=NPC_H[m[1]];return c}
function bnMake(arr){for(const d of arr||[])if(d.k&&/^ep_bn2?_/.test(d.k)&&d.k.includes('~'))bnVar(d.k)}
function bnKey(pick,f,dry){return (BN_OLDKEEP.has(pick)?'ep_bn_':'ep_bn2_')+pick+'~'+(f?'f':'')+(dry?'d':'g')}
function bnPick(n,x,y,list,dry,near,salt){let pick=list[(hash2(x,y,n*13+7+(salt||0))*list.length)|0];for(let t=0;t<list.length&&near.includes(pick);t++)pick=list[(list.indexOf(pick)+1)%list.length];
  return bnKey(pick,hash2(x,y,n*13+9)<.5,dry)}
/* tiny bones a short way from a big piece ("a bone here, a tiny bone next to it"): about 0.6 of the pieces get one, a few get two; offsets inside the same square, never in a regular spacing */
function bnTinies(n,arr,d,dry,salt){const r=hash2(d.x,d.y,n*19+3+(salt||0));if(r>(/skull/.test(d.k)?.9:.6))return 0;let c=1+(hash2(d.x,d.y,n*19+4)<.3?1:0),made=0,side=hash2(d.x,d.y,n*19+5)<.5?-1:1;
  for(let i=0;i<c;i++){const h1=hash2(d.x,d.y,n*19+10+i),h2=hash2(d.x,d.y,n*19+20+i),h3=hash2(d.x,d.y,n*19+30+i),pick=BN_TINY[(h1*BN_TINY.length)|0];
    const dx=side*(.25+h2*.25),dy=(h3-.5)*.5;if(i)side=-side;
    arr.push({k:bnKey(pick,h2<.5,dry),x:d.x,y:d.y,ox:+Math.max(-.46,Math.min(.46,(d.ox||0)+dx)).toFixed(2),oy:+Math.max(-.4,Math.min(.4,(d.oy||0)+dy)).toFixed(2),deco:true,block:false,sc:+(.85+h3*.3).toFixed(2)});made++}return made}
function bnSwap(n,L,arr,dry,theme){let c=0;const tiny=[];const list=BN_THEME[theme],figs=BN_FIG[theme],prev=[];
  for(const d of arr){const old=d.k==='dbones'?(dry&&((L.rows||[]).length*((L.rows||[''])[0].length)<=8000)):BN_OLD.has(d.k);if(!old)continue;if(d.epSecP||d.npc||d.hidden||d.wd||d.pic||d.secret||d.sr||d.srB)continue;
    const near=prev.filter(p=>Math.abs(p[0]-d.x)+Math.abs(p[1]-d.y)<5).map(p=>p[2].replace(/^ep_bn2?_|~\w*$/g,''));const k=bnPick(n,d.x,d.y,d.k==='ep_skel_slump'?figs:list,dry,near);
    prev.push([d.x,d.y,k]);d.k=k;delete d.lk;d.sc=+((.85+hash2(d.x,d.y,n*13+11)*.3)*(dry?1.2:1)*(/skel_/.test(k)?.88:1)).toFixed(2);d.deco=true;if(d.ox===undefined){d.ox=+((hash2(d.x,d.y,n*13+12)-.5)*.5).toFixed(2);d.oy=+((hash2(d.x,d.y,n*13+13)-.5)*.36).toFixed(2)} // never dead centre on its square
  c++;tiny.push(d)}
  for(const d of tiny)bnTinies(n,arr,d,dry);return c}
/* extra pieces on bare floor: room squares only (never a passage, never beside a door, stair or secret room) */
function bnExtras(n,L,count,theme,dry){const R=L.rows,H=R.length,W=R[0].length,op=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&R[y][x]==='.',wall=(x,y)=>x<0||y<0||x>=W||y>=H||R[y][x]==='#'||R[y][x]==='%';
  const used=new Set();for(const a of [L.enemies||[],L.items||[],L.decor||[]])for(const o of a)used.add(Math.round(o.x)+','+Math.round(o.y));
  const keep=[[L.start.x,L.start.y]];for(const s of [...(typeof EP_SECRETS!=='undefined'&&EP_SECRETS[n]||[]),...(typeof SR_ROOMS!=='undefined'&&SR_ROOMS[n]||[])]){keep.push(s.door,s.from);for(const c of s.cells||[])keep.push(c);if(s.chest)keep.push(s.chest)}
  for(const l of L.lights||[])keep.push([Math.floor(l[0]),Math.floor(l[1])]);
  const cands=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!op(x,y)||used.has(x+','+y))continue;let o=0,odd=false;for(let b=-1;b<=1;b++)for(let a=-1;a<=1;a++){if(op(x+a,y+b))o++;else if(!wall(x+a,y+b))odd=true}
    if(o<6||odd)continue;if(keep.some(p=>Math.abs(p[0]-x)<=2&&Math.abs(p[1]-y)<=2))continue;
    const wn=[[0,-1],[0,1],[1,0],[-1,0]].filter(([a,b])=>wall(x+a,y+b));cands.push({x,y,h:hash2(x,y,n*17+5),side:wn.length===1?wn[0]:null})}
  cands.sort((a,b)=>a.h-b.h);const put=[],far=(c,r)=>put.every(p=>Math.abs(p.x-c.x)+Math.abs(p.y-c.y)>=r),list=BN_THEME[theme],figs=BN_FIG[theme];let made=0;
  const add=(c,key,o)=>{put.push(c);made++;const e=Object.assign({k:key,x:c.x,y:c.y,deco:true,block:false,sc:+((.85+hash2(c.x,c.y,n*17+8)*.3)*(dry?1.2:1)).toFixed(2)},o||{});L.decor.push(e);bnTinies(n,L.decor,e,dry,7)};
  if(n===1){let X=null;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(R[y][x]==='X')X=[x,y]; // a ribcage near the way out
    if(X){const c=cands.filter(c=>{const d=Math.abs(c.x-X[0])+Math.abs(c.y-X[1]);return d>=3&&d<=6}).sort((a,b)=>a.h-b.h)[0];if(c){add(c,bnPick(n,c.x,c.y,['cage1','cage2'],false,[],3),{})}}}
  const nf=Math.round(count*.4);for(const c of cands){if(made>=nf+(n===1?1:0))break;if(!c.side||put.includes(c)||!far(c,5))continue;const k=bnPick(n,c.x,c.y,figs,dry,[],5);add(c,k,{ox:c.side[0]*.2,oy:c.side[1]*.2})}
  for(const c of cands){if(made>=count+(n===1?1:0))break;if(put.includes(c)||!far(c,3))continue;add(c,bnPick(n,c.x,c.y,list,dry,[],9))}
  return made}
function bnPre(n){if(self.EP_OFF||self.BN_OFF)return;if(!LEVELS[n]&&typeof KH_LAZY!=='undefined'&&KH_LAZY[n])KH_LAZY[n]();const L=LEVELS[n];if(!L||!L.decor||L._bn||!L.rows)return;L._bn=1;
  if(typeof epProps==='function'&&typeof EP_SPEC!=='undefined'&&EP_SPEC[n])epProps(n,EP_SPEC[n]); // its pieces are in the list before we look
  const theme=bnTheme(n,L),dry=theme==='dry';let c=bnSwap(n,L,L.decor,dry,theme);if(BN_EXTRA[n])c+=bnExtras(n,L,BN_EXTRA[n],theme,dry);if(c)L._bnOn=1}
function bnPost(n){if(self.EP_OFF||self.BN_OFF)return;const L=LEVELS[n];if(!L)return;
  if(L._bnOn||(G.decor||[]).some(d=>BN_OLD.has(d.k)||(d.k&&/^ep_bn2?_/.test(d.k)))){const theme=bnTheme(n,L);bnSwap(n,L,G.decor,theme==='dry',theme); // anything a later hook put in
    try{epLoad().then(()=>{if(LEVEL===n)bnMake(G.decor)})}catch(e){}if(EP.ready)bnMake(G.decor)}}
{const _ll=loadLevel;loadLevel=function(n){try{bnPre(n)}catch(e){console.error('bn pre',e)}const r=_ll.apply(this,arguments);try{bnPost(n)}catch(e){console.error('bn post',e)}return r}}

/* the old code-drawn pile (IMG.bones) is never shown any more: wherever that picture is still asked for (a level the swap did not reach), a single painted loose bone stands in */
{const iv=setInterval(()=>{try{if(typeof IMG!=='undefined'&&IMG.ep_bn2_femur&&IMG.ep_bn2_femur.width){IMG.bones=IMG.ep_bn2_femur;if(typeof NPC_H!=='undefined')NPC_H.bones=.112;clearInterval(iv)}}catch(e){}},1500)}
