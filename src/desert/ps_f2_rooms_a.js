/* ==========================================================================
   ps_f2_rooms_a.js: the illusion rooms 1 to 3 of the Hall of Illusions. See tools/PS_F2_SPEC.md and tools/PS_F2_NOTES.md. Built with f2Room (ps_f2_kit.js).
   9821 The Perfect Forest (the hand): four standing stones round a hollow oak; touch them in the order of the year (spring, summer, autumn, winter).
   9822 The Island by the Sea (the foot): the bottle on the shore shows a starfish; the spade is at the fisherman's hut; dig the starfish patch on the north beach.
   9823 The Cabin in the Snow (the face): three logs in the snow, the flint on a post by the woodpile; logs on the hearth, strike the flint, the fire melts the ice on the mirror.
   Every room: arrival (24,35) facing north, the way back (24,38), the puzzle at the north end, two or three clearings with creatures, three chests.
   ========================================================================== */
/* painted pieces wanted (assets/ps/<name>.webp replaces the stand-in) */
{const P=(n,h,src,o)=>{PSP_PICS[n]=[h,src,o||{}]};
 for(const s of ['spring','summer','autumn','winter'])P('f2_stone_'+s,1.6,['hgxrock4','ww_stone'],{keep:1});
 P('f2_hollowoak',3.2,['dtreehole','ww_oakface'],{keep:1});
 P('f2_bottle',.5,['it_bottle','ic_bottle'],{keep:1});
 for(const s of ['conch','scallop','starfish','spiral'])P('f2_patch_'+s,.45,['yar_shells','hgxrock3'],{keep:1});
 P('f2_patch_dug',.4,['hgxrock3','yar_shells'],{keep:1});
 P('f2_spade',1.1,['it_blspade','ic_blspade'],{keep:1});
 P('f2_flintpost',1.2,['ww_stump','ww_sign'],{keep:1});
 P('f2_log',.4,['f2i_snowlog','glogm'],{keep:1});
 P('f2_woodpile',.8,['plog','logm'],{keep:1});
 P('f2_mirror_ice',2.0,['furn_mirror_gothic','hl_p_mirror'],{keep:1});
 P('f2_mirror_face',2.0,['mirror_haunted_b','furn_mirror_gothic'],{keep:1})}
/* the great trees seen over the painted tree line are cut at the top of the wall; the cut fell between two rows of pixels and left a thin line of sky there. In these rooms the cut is drawn two pixels lower, so the leaves overlap the top of the wall. */
{const _sr=sprRun;sprRun=function(SRC,left,ku,tw,th,sh,top,rs,rc,xe){if(typeof LEVEL!=='undefined'&&LEVEL>=9820&&LEVEL<=9823&&rc<top+sh-2)rc=Math.min(top+sh,rc+2.5);return _sr.call(this,SRC,left,ku,tw,th,sh,top,rs,rc,xe)}}
/* groves and gaps: the trees in the band are thinned into bays of open ground where a slow noise is low and grown a little bigger where it is high (groves);
   trees right at the edge of a clearing are the foreground: larger and a shade darker; small plants grow at the feet of trees that face the open */
function f2aGrove(C,rx,o){o=o||{};const W=48,hs=C.hs2,E=C.E,keep=o.keep||(()=>false),under=o.under||[];
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(!d.block||d.npc||d.edgeTree||!rx.test(String(d.k))||keep(d.x,d.y))continue;const g=C.vn(d.x,d.y,o.cs||7,301),e=E[d.y*W+d.x];
    if(e<=(o.gapE||2)&&g<(o.gap||.36)&&hs(d.x,d.y,302)<.8){C.decor.splice(i,1);C.used.delete(d.x+','+d.y);continue}
    if(g>.6)d.sc=+((d.sc||1)*(1.08+(g-.6)*.6)).toFixed(2);
    if(e===1&&hs(d.x,d.y,303)<(o.fg||.3)){d.sc=+((d.sc||1)*1.22).toFixed(2);const dk=f2Soft(String(d.k).replace(/_fl$/,''),{filter:o.dark||'brightness(.74) saturate(1.08)',tag:'dk'});d.k=/_fl$/.test(String(d.k))?f2Flip(dk):dk}}
  if(under.length)for(const d of C.decor.slice()){if(!d.block||d.npc||!rx.test(String(d.k)))continue;const nb=[[0,1],[1,0],[-1,0],[0,-1]].filter(([a,b])=>C.open(d.x+a,d.y+b)&&!C.decor.some(q=>q.block&&q.x===d.x+a&&q.y===d.y+b));if(!nb.length||hs(d.x,d.y,304)>(o.underP||.55))continue;
    const [a,b]=nb[0],u=C.dec(under[(hs(d.x,d.y,305)*under.length)|0],d.x,d.y,{block:false,sc:+((o.underSc||.55)*(.8+hs(d.x,d.y,306)*.4)).toFixed(2)});if(u){u.ox=Math.max(-.45,Math.min(.45,(d.ox||0)+a*.42));u.oy=Math.max(-.45,Math.min(.45,(d.oy||0)+b*.42))}}}
/* dappled light: the shade map of a room gets soft patches of sun and shadow on the open ground, and brighter pools at the given places */
function f2aDapple(id,C,o){o=o||{};const T=TERRS[id];if(!T||!T.s)return;const W=48,H=40;
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;let v=1+(C.vn(x,y,o.cs||2.6,311)-.5)*(o.amp||.32);for(const [px,py,r,k] of o.pools||[]){const dd=Math.hypot(x-px,y-py);if(dd<r)v*=1+k*(1-dd/r)}T.s[i]=Math.max(.45,Math.min(1.4,T.s[i]*v))}}
Object.assign(F2B[9821],{haze:.32,fog:[236,226,188,.012],lcol:[1.36,1.2,.84],amb:1.25});F2B[9821].sky.low=[250,232,190];
const F2_FOREST_TREES=['ltree0','ltree4','ltree8','ltree12','ltree1','ltree5','ltree19','ltree9','ltree0','ltree8'];
/* ---------- 1. THE PERFECT FOREST (9821): the hand ---------- */
const F2_SEASON=[['spring','a bud opening on a twig','SPRING'],['summer','a round sun with straight rays','SUMMER'],['autumn','a single falling leaf','AUTUMN'],['winter','a six-pointed snowflake','WINTER']];
const F2_FOREST={STONES:[[19,4,1],[29,4,3],[22,8,0],[26,8,2]],OAK:[24,6]};   // [x,y,season index]: the order of the year is not the order round the ring
/* small plants cast no oval shadow (the contact shadow is for things that stand): their keys end in _lt, which the shadow pass leaves out */
function f2aNs(k){return f2Soft(pspPic(k),{tag:'_lt'})}
function f2ForestBuild(){
  const FG=f2TexFloor('ps_f2_tex_fograss','f2t_fograss2',1.16,[1.0,1.06,.86])||'lush',FM=f2TexFloor('ps_f2_tex_fomeadow','f2t_fomeadow3',.96,[1.0,1.04,.9])||'grass',FV=f2TexFloor('ps_f2_tex_foleaves','f2t_foleaves3',1.02,[.96,1.0,.88])||'grass';
  const FT=f2TexFloor('ps_f2_tex_fotrail','f2t_fotrail',1.05)||'trail';
  const C=f2Room({id:9821,ground:FG,path:FG,glowK:.55,band:[2,5],softRet:1,rw:0,mistH:.08,shade:{edge:.34,pool:.6,tree:/f2_f[ov]_(oak|beech|fir|maple|birch|lime|ash|hawthorn|hornbeam|yew|cherry)|ltree/},
    routes:[[[24,35],[24,28],[17,24],[17,15],[24,12],[24,10]],[[24,28],[34,25],[38,19]],[[17,19],[8,18]],[[22,32],[10,30]],[[18,8],[9,6]]],
    clear:[[16,2,32,12,FM,'The Glade of the Four Stones',1],[4,13,12,23,FG,'The Wolf Hollow',1],[33,13,43,23,FM,'The Bramble Glade',1],[5,26,13,34,FV,'The Fern Dell',1],[3,2,11,9,FV,'The Old Ring',1]],
    keep:(x,y)=>Math.abs(x-24)<=1&&(y>=36||(y>=11&&y<=17))});
  const S=C.f2;
  // the glade: the hollow oak in the middle, the four stones round it, the plaque at the way in
  const [ox,oy]=F2_FOREST.OAK;C.used.delete(ox+','+oy);C.dec(pspPic('f2_hollowoak'),ox,oy,{block:true,npc:'f2f_oak'});
  F2_FOREST.STONES.forEach(([x,y,si],i)=>{C.used.delete(x+','+y);C.dec(f2Soft(pspPic('f2_stone_'+F2_SEASON[si][0]),{filter:'brightness(1.16) contrast(1.28) saturate(1.12)',tag:'b'}),x,y,{block:true,npc:'f2f_stone'+i});C.light(x,y+1,[1.3,1.12,.8])});
  f2SignPlaque(C,25,12,'f2_fo_sign','f2_forest_sign',['TOUCH THE STONES','IN THE ORDER','OF THE YEAR'],'f2f_plaque','A plaque of grey stone at the edge of the glade. The letters cut in it read: TOUCH THE STONES IN THE ORDER OF THE YEAR. Under it is a small carving of a bud, a sun, a leaf and a snowflake, in that order.');
  for(const [x,y] of [[20,6],[28,6],[19,9],[29,9]])if(C.free(x,y))C.dec(f2aNs(x<24?'f2_fo_foxglove':'f2_fo_rose'),x,y,{block:false,sc:.7});
  C.reserve(22,5,26,7);C.reserve(22,9,22,9);C.reserve(26,9,26,9);
  for(const [x,y,k] of [[15,2,'f2_fo_fir'],[17,2,'f2_fo_beech'],[19,3,'f2_fv_cherry'],[21,2,'f2_fo_fir'],[27,2,'f2_fo_maple'],[29,3,'f2_fv_cherry'],[31,2,'f2_fo_beech'],[33,2,'f2_fo_fir'],[23,2,'f2_fo_birch'],[25,2,'f2_fo_birch']])if(C.free(x,y)){C.used.delete(x+','+y);const d=C.dec(pspPic(k),x,y,{block:true,sc:/birch/.test(k)?.85:1.1});if(d)d.oy=-.35}   // great trees at the back of the glade, in front of the forest wallC.reserve(23,8,25,9);   // nothing grows in front of the oak's door
  // the glade floor in front of the stones stays clean: no tufts, only flowers and a fern at the foot of each stone; two blossom trees stand at the way in, one the mirror of the other (the forest is a little too perfect)
  for(const [x,y] of F2_FOREST.STONES)for(const [k,ox,sc] of [['f2_fo_flowers',-.38,.5],['f2_fo_fern',.4,.48]]){const u=C.dec(f2aNs(k),x,y,{block:false,sc});if(u){u.ox=ox;u.oy=.42}}
  for(const [x,fl] of [[20,0],[28,1]]){C.used.delete(x+',12');if(C.open(x,12)&&!C.nearPath(x,12,0)){const d=C.dec(fl?f2Flip(pspPic('f2_fv_cherry')):pspPic('f2_fv_cherry'),x,12,{block:true,sc:1.0});if(d){d.ox=fl?-.2:.2;d.oy=-.2}}}
  for(const [x,y,k] of [[21,34,'f2_fo_rose'],[27,34,'f2_fo_foxglove'],[21,36,'f2_fo_fern'],[27,36,'f2_fo_flowers']])if(C.free(x,y))C.dec(f2aNs(k),x,y,{block:false,sc:.75});   // a frame of flowers round the arrival
  // the ground: grass, with drifts of fallen leaves and meadow flowers
  f2Patches(C,[[FG,.56],[FV,.18],[FM,.26]],{cs:7,onPath:true,keep:(x,y)=>x>=16&&x<=32&&y>=2&&y<=12});   // no ruled path: the way is open grass with drifts of leaves and flowers
  // the forest: a living tree line at the edges (painted trunks and undergrowth, great trees rising over it), painted trees in the band, ferns, flowers, grass, toadstools and mossy logs
  const TR=['f2_fo_oak','f2_fo_beech','f2_fo_fir','f2_fo_maple','f2_fo_birch','f2_fo_lime','f2_fv_oak','f2_fv_hornbeam','f2_fv_yew','f2_fv_hawthorn','f2_fv_cherry','f2_fv_hornbeam','f2_fv_oak'].map(f2Tree);   // (the ash is left out: its crown is so high that near the way it reads as a bare pole)
  {const TF=TR.slice(1);TF.push(...TF.map(f2Flip));C.fill(TF,{sc:1,p1:.08,p2:.5,p3:.88})}
  // copses: small groves out in the open ground (never within two squares of a way, never in the glade or by the arrival), so there are groves and meadows, not one even ring of trees
  {for(let y=3;y<37;y++)for(let x=3;x<45;x++){if(!C.free(x,y)||!C.open(x,y)||C.nearPath(x,y,2)||(x>=14&&x<=34&&y<=13)||Math.hypot(x-24,y-35)<6||C.E[y*48+x]>0)continue;const g=C.vn(x,y,5,401);if(g>.62&&C.hs2(x,y,402)<.5+(g-.62)*1.6){const d=C.dec(f2PickVar(C,TR,x,y,C.hs2(x,y,403)),x,y,{block:true,sc:+(.95+C.hs2(x,y,404)*.5).toFixed(2)});if(d){d.ox=(C.hs2(x,y,405)-.5)*.7;d.oy=(C.hs2(x,y,406)-.5)*.6}}}}
  C.scrub([f2aNs('f2_fo_grass'),f2aNs('f2_fo_flowers'),f2aNs('f2_fo_fern'),f2aNs('f2_fo_flowers'),f2aNs('f2_fo_flowers')],.22,{sc:.75});
  // a landmark in every clearing: a fallen log with a robin on it, a ring of stumps, an old broken pillar
  for(const [x,y,k] of [[8,17,'f2_fo_log'],[38,18,'f2_fo_ruin'],[9,30,'f2_fo_stump'],[6,6,'f2_fo_ruin'],[10,6,'f2_fo_stump']])if(C.free(x,y)&&!C.nearPath(x,y,0)){C.dec(pspPic(k),x,y,{block:true,sc:k==='f2_fo_ruin'?.75:1.05});if(k==='f2_fo_log'){const r=C.dec(pspPic('f2_fo_robin'),x,y,{block:false,bob:.32,sc:1.2});if(r)r.fly=1}if(k==='f2_fo_ruin'){const q=C.near(x+1,y,1,true);if(q)C.dec(f2aNs('f2_fo_toadstools'),q[0],q[1],{block:false,sc:.9})}}
  C.scrub([f2aNs('f2_fo_toadstools')],.008);
  for(const [x,y] of [[6,15],[10,21],[35,15],[41,21],[7,28],[11,33],[5,4],[9,8],[36,20],[12,30]])if(C.free(x,y)&&!C.nearPath(x,y,0))C.dec(pspPic((x+y)%3?'f2_fo_log':'f2_fo_boulder'),x,y,{block:true,sc:.9});
  for(const d of C.decor)if(/f2_f[ov]_(oak|beech|fir|maple|birch|lime|ash|hawthorn|hornbeam|yew|cherry)|ltree/.test(d.k)&&d.block){d.sc=+((d.sc||1)*(.72+C.hs2(d.x,d.y,171)*.62)).toFixed(2);d.ox=(C.hs2(d.x,d.y,172)-.5)*.85;d.oy=(C.hs2(d.x,d.y,173)-.5)*.7}   // no rows: every tree a little off its square
  f2aGrove(C,/f2_f[ov]_(oak|beech|fir|maple|birch|lime|ash|hawthorn|hornbeam|yew|cherry)/,{keep:(x,y)=>x>=14&&x<=34&&y<=12,under:['f2_fo_fern','f2_fo_grass','f2_fo_fern','f2_fo_foxglove','f2_fo_flowers','f2_fo_grass'].map(f2aNs)});
  C.capTrees(/ltree|f2_f[ov]_(oak|beech|fir|maple|birch|lime|ash|hawthorn|hornbeam|yew|cherry)/,2.4);
  C.scrub([f2aNs('f2_fo_grass'),f2aNs('f2_fo_flowers'),f2aNs('f2_fo_grass')],.05,{onPath:true,sc:.5});   // tufts that break the edge of the leaf path
  // shrubs and flowers at the feet of the trees, a few stumps
  {const S2=['f2_fo_foxglove','f2_fo_fern','f2_fo_rose','f2_fo_grass','f2_fo_flowers'].map(f2aNs);let n=0;
   for(let y=3;y<37;y++)for(let x=3;x<45;x++){if(!C.free(x,y)||C.nearPath(x,y,0)||C.core[y*48+x]&&C.hs2(x,y,151)>.08)continue;if(C.hs2(x,y,152)<.075){C.dec(S2[n%S2.length],x,y,{block:false,sc:.62+C.hs2(x,y,153)*.25});n++}}}
  // the glade: soft shafts of sunlight fall on the hollow oak, fireflies hang in them, butterflies cross the glades, small birds fly over
  {const sh0=f2Compose('f2_fo_shaft_c',IMG.ps_f2_fo_shaft?IMG.ps_f2_fo_shaft.width:10,IMG.ps_f2_fo_shaft?Math.round(IMG.ps_f2_fo_shaft.height*.78):10,[['ps_f2_fo_shaft',0,0,0,Math.round((IMG.ps_f2_fo_shaft||{height:10}).height*.78),0,0,(IMG.ps_f2_fo_shaft||{width:10}).width,Math.round((IMG.ps_f2_fo_shaft||{height:10}).height*.78)]],3.2),sh=f2Soft(sh0,{l:.35,r:.35,t:.05,b:.3,a:.3,tag:'g2'});
   for(const [x,y,w] of [[21.7,8.4,.9],[26.4,8.6,.8]]){const d=f2Span(C,sh,x,y,0,1,w,0);d.lift=.95;C.f2x[d.kname].lift=.95}
   for(const [x,y] of [[24,6],[24,8],[8,18],[38,18],[9,30],[26,25]])C.light(x,y,[1.6,1.4,.9])}
  f2Mover(C,pspPic('f2_fo_butterflies'),[[19,9],[22,4],[29,5],[27,10],[19,9]],.35,{bob:.8}).fly=1;
  f2Mover(C,pspPic('f2_fo_bluefly'),[[6,30],[11,28],[9,33],[6,30]],.3,{bob:.7}).fly=1;
  f2Mover(C,pspPic('f2_fo_butterflies'),[[35,15],[41,18],[37,22],[35,15]],.33,{bob:.9}).fly=1;
  f2Mover(C,pspPic('f2_fo_birds'),[[4,30],[44,8]],1.4,{pingpong:true,bob:3.2}).fly=1;
  for(const P of [[[21,7],[27,7],[27,10],[21,10],[21,7]],[[6,16],[10,18],[8,21],[6,16]],[[36,16],[41,19],[37,21],[36,16]],[[22,26],[27,28],[24,31],[22,26]]])f2Mover(C,f2Soft(pspPic('f2_fo_fireflies'),{a:.7,tag:'m'}),P,.22,{bob:1.1,sc:.38}).fly=1;   // motes of light drifting in the glades
  for(const [x,y,k] of [[20,27,'f2_fo_robin'],[30,13,'f2_fo_robin2'],[11,25,'f2_fo_robin3']])if(C.free(x,y)&&!C.nearPath(x,y,0))C.dec(pspPic(k),x,y,{block:false});
  // creatures (the perfect forest still bites), chests
  pspSafeZone(C,24,35,6);
  C.foes(['f2wolf','f2wolf','f2wolf','f2wasps'],[4,13,12,23],1);
  C.foes(['f2stag','f2treant','f2wolf','f2wasps'],[33,13,43,23],2);
  C.foes(['f2treant','f2stag'],[5,26,13,34],3);
  C.foes(['f2wasps','f2wolf'],[3,2,11,9],4);
  for(const [x,y] of [[5,14],[42,14],[6,33]])C.chestAt(x,y,1);
  C.ret();
  f2Edge(C,{img:f2Soft('ps_f2_fo_wall2',{filter:'contrast(1.35) brightness(.86) saturate(1.25)',tag:'e'}).replace(/^ps_/,''),wh:1.9,veil:.05,pillar:TR,rgb:[1,1.02,.95],tall:['f2_fo_oak','f2_fo_beech','f2_fo_fir','f2_fo_maple','f2_fo_lime','f2_fo_birch','f2_fv_oak','f2_fv_ash','f2_fv_hornbeam','f2_fv_yew'],tallP:.85,tallSc:[1.1,1.55]});
  f2RetGate(C,f2Soft('ps_f2_illgate',{filter:'brightness(.8) contrast(1.15)',tag:'d'}),{one:true,wh:3.0,tex:'texBlack_2',rgb:[.9,.95,1.05]});
  // a row of trees just inside the forest wall (never on a path, never in front of the stones), so the wall is never the last thing in view
  {const T2=TR.slice(1).concat(TR.slice(1).map(f2Flip)),edgeN=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>C.rows[y+b]&&C.rows[y+b][x+a]!=='.');
   for(let y=3;y<37;y++)for(let x=3;x<45;x++){if(!C.free(x,y)||C.nearPath(x,y,1)||!edgeN(x,y)||(x>=15&&x<=33&&y>=3&&y<=11)||Math.hypot(x-24,y-35)<5)continue;if(C.hs2(x,y,161)<.82){const d=C.dec(f2PickVar(C,T2,x,y,C.hs2(x,y,162)),x,y,{block:true,sc:.95+C.hs2(x,y,163)*.35});if(d){d.ox=(C.hs2(x,y,164)-.5)*.6;d.oy=(C.hs2(x,y,165)-.5)*.5}}}}
  for(const [x,k,sc] of [[22,'f2_fo_ruin',.6],[26,'f2_fo_boulder',.7],[21,'f2_fo_foxglove',.8],[27,'f2_fo_fern',.8]]){const d=C.dec(pspPic(k),x,37,{block:!/fox|fern/.test(k),sc});if(d&&/ruin/.test(k)&&x>24)d.k=f2Flip(pspPic(k))}   // old broken stones round the gate
  for(let i=C.decor.length-1;i>=0;i--){const d=C.decor[i];if(!d.block&&!d.npc&&!d.fly&&!d.mv&&d.x>=19&&d.x<=29&&d.y>=7&&d.y<=12&&d.ox===undefined&&/f2_fo_(grass|fern|toadstools)/.test(String(d.k))){C.decor.splice(i,1)}}
  const lv=C.done({glow:8});
  f2aDapple(9821,C,{amp:.34,pools:[[24,7,6,.1],[38,18,3.5,.16],[9,30,3,.14],[24,28,3,.12],[8,18,4.5,-.16]]});   // the wolf hollow lies in shadow
  lv.mapNames.push({t:'The Hollow Oak',x:24,y:6,k:'place'});
  return lv}
pspRegister(9821,f2ForestBuild);
F2_FOREST.STONES.forEach(([x,y,si],i)=>khNpc('f2f_stone'+i,'A standing stone','ps_f2_stone_'+F2_SEASON[si][0],()=>{
  const R=f2S(9821);if(R.solved)return say('A mossy standing stone carved with '+F2_SEASON[si][1]+'. It is warm to the touch now, and quiet.',[BYE]);
  return say('A mossy standing stone, taller than a man. It is carved with '+F2_SEASON[si][1]+'.',[['Touch the stone.',()=>{f2ForestTouch(si);G.talk=null;return null}],BYE])}));
function f2ForestTouch(si){
  const R=f2S(9821);if(R.solved)return;R.seq=R.seq||[];
  if(si===R.seq.length){R.seq.push(si);f2Chime('ok',si);msg('The '+F2_SEASON[si][2].toLowerCase()+' stone hums under your hand, and its carving glows faintly. ('+R.seq.length+' of 4.)','#d8f0c8');
    if(R.seq.length===4){R.solved=1;R.seq=[];f2Chime('open');msg('All four stones ring together. The bark door of the hollow oak creaks open.','#ffe36a');f2ForestApply()}}
  else{R.seq=[];f2Chime('bad');msg('The stone gives a dull, low note, and the glow fades from every carving. Start again.','#c8c8b0')}}
khNpc('f2f_oak','The hollow oak','ps_f2_hollowoak',()=>{const R=f2S(9821);
  if(!R.solved)return say('A huge old oak with a hollow trunk. A small door of bark is set into the hollow, fitted so close that you cannot get a finger into the edge. Four seasons are carved round its frame.',[BYE]);
  if(!psf2F().got.hand)return say('The bark door stands open. Inside the hollow, on a bed of dry leaves, lies a pale hand.',[["Take the Sleeper's Hand.",()=>{psf2Give('hand');G.talk=null;return null}],BYE]);
  return say('The bark door stands open. The hollow is empty except for dry leaves.',[BYE])});
function f2ForestApply(){const R=f2S(9821);if(!R.solved)R.seq=[]}
f2OnArrive(9821,()=>f2ForestApply());
/* ---------- 2. THE ISLAND BY THE SEA (9822): the foot ---------- */
const F2_ISLAND={PATCH:[[17,5,'conch','a conch shell'],[21,3,'scallop','a scallop shell'],[27,3,'starfish','a starfish'],[31,5,'spiral','a spiral snail shell']],ANSWER:'starfish',BOTTLE:[20,32],SPADE:[37,28]};
function f2IslandBuild(){
  const IS=f2TexFloor('ps_f2_tex_issand','f2t_issand',1.0)||'sand',IW=f2TexFloor('ps_f2_tex_iswet','f2t_iswet',1.0)||'seabed1',IG=f2TexFloor('ps_f2_tex_isgrass','f2t_isgrass',1.0)||'sand',ISE=f2TexFloor('ps_f2_tex_issea','f2t_issea',1.0)||'seawater';
  const C=f2Room({id:9822,ground:ISE,path:IG,band:[0,2],softRet:1,rw:0,mistH:.08,
    routes:[[[24,35],[24,26],[16,22],[16,12],[24,8],[24,6]],[[24,30],[33,29]],[[16,18],[9,18]],[[24,8],[37,13]]],
    clear:[[14,2,34,8,IS,'The North Beach',1],[29,24,40,31,IS,"The Fisherman's Hut",1],[6,14,12,22,IS,'The Siren Rocks',1],[32,10,40,17,IS,'The Gull Cove',1],[19,31,29,37,IS,null,1]],
    edge:(C,x,y)=>{C.water(x,y,ISE);return true}});
  const W=48,H=40;
  // the shore: wet sand next to the water
  {const wet=C.fl(IW);for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++)if(C.open(x,y)&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>C.block[(y+b)*W+x+a]&&C.rows[y+b][x+a]==='.'))C.fm[y*W+x]=wet}
  // the fisherman's hut (a small timber hut with a thatched roof; the door is shut), nets, the spade by the door
  C.house({x0:34,y0:25,x1:36,y1:26,face:'S',sty:'flint',roof:'thatch2',wh:2.3,lit:false});
  {const lw=f2TexWall('ps_f2_tex_logwall',2.3,{gain:1.2,rgb:[1.08,1.0,.9]});if(lw!=null)for(let y=25;y<=26;y++)for(let x=34;x<=36;x++){const g=C.chars[C.rows[y][x]];if(C.rows[y][x]!=='.'&&!(g!==undefined&&KH_DOOR[g]))C.solid(x,y,C.ch(lw))}}   // a hut of driftwood logs, not castle flint
  const [sx,sy]=F2_ISLAND.SPADE;C.used.delete(sx+','+sy);C.dec(pspPic('f2_spade'),sx,sy,{block:true,npc:'f2i_spade'});
  {let n=0;for(let r=1;r<8&&n<2;r++)for(const [x,y] of [[42+r,30],[42+r,27],[40,33+r]]){if(n<2&&C.rows[y]&&C.rows[y][x]==='.'&&C.block[y*48+x]&&!C.decor.some(d=>d.x===x&&d.y===y)){C.dec('yar_boat_row',x,y,{block:false,sc:.9});n++}}}   // two rowing boats drawn up in the shallows by the hut
  // the bottle on the south shore, the four sand patches on the north beach
  {const [bx,by]=F2_ISLAND.BOTTLE;C.used.delete(bx+','+by);C.dec(pspPic('f2_bottle'),bx,by,{block:true,npc:'f2i_bottle',sc:1.8});C.light(bx,by,[1.4,1.3,1.0])}
  F2_ISLAND.PATCH.forEach(([x,y,s],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_patch_'+s),x,y,{block:true,npc:'f2i_patch'+i,sc:1.7})});
  // palms, dune grass and rocks
  f2Patches(C,[[IS,.8],[IG,.2]],{cs:5,onPath:true});   // the ground of the map itself is the sea (it runs on past the edge to the horizon); every square of land is sand or grass
  const PT=[pspPic('f2_is_palm'),pspPic('f2_is_palm2'),'dpalm0','dpalm2'];PT.push(...PT.map(f2Flip));
  C.fill(PT.concat([pspPic('f2_is_rock'),'hgxrock1']),{p1:.12,p2:.4,p3:.6});for(const d of C.decor)if(/f2_is_rock/.test(d.k))d.sc=.7;
  for(const d of C.decor)if(d.block&&/palm|f2_is_rock/.test(d.k)){d.sc=+((d.sc||1)*(.8+C.hs2(d.x,d.y,171)*.45)).toFixed(2);d.ox=(C.hs2(d.x,d.y,172)-.5)*.8;d.oy=(C.hs2(d.x,d.y,173)-.5)*.6}
  C.scrub(['yar_shells',pspPic('f2_is_shrub'),'yar_shells'],.04,{sc:.8});
  for(const [x,y] of [[38,27],[33,28],[36,31]])if(C.free(x,y))C.dec(pspPic('f2_is_nets'),x,y,{block:false});
  f2Mover(C,'yar_gull_fly0'in IMG?'yar_gull_fly0':pspPic('f2_fo_birds'),[[4,6],[44,6]],1.2,{pingpong:true,bob:3}).fly=1;
  for(const [x,y] of [[7,16],[8,21],[11,15],[6,19]])if(C.free(x,y))C.dec('hgxrock1',x,y,{block:true,sc:1.1});
  C.capTrees(/dpalm|yar_palms|f2_is_palm|f2_is_rock/,2.6);
  f2Edge(C,{img:'f2_is_wall',wh:2.8,veil:.1,rgb:[1.2,1.1,.92],only:(x,y)=>x<=2||x>=45||y>=37});
  for(let y=0;y<40;y++)for(let x=0;x<48;x++)if(C.rows[y][x]!=='.')C.fm[y*48+x]=C.fl(ISE);   // under the low mist of the edge lies the sea, out to the horizon   // sea cliffs at the two ends of the island; to the north the sea runs to the horizon
  pspSafeZone(C,24,35,6);
  C.foes(['f2crab','f2crab'],[14,2,34,8],1);
  C.foes(['f2siren','f2siren','f2spawn'],[5,13,13,23],2);
  C.foes(['f2gull','f2gull','f2gull','f2crab'],[31,9,41,18],3);
  C.foes(['f2spawn','f2crab','f2spawn'],[29,24,41,33],4);
  for(const [x,y] of [[6,15],[39,11],[39,30]])C.chestAt(x,y,1);
  C.ret();f2RetGate(C,f2Soft('ps_f2_illgate',{filter:'brightness(.85) contrast(1.15)',tag:'d'}),{one:true,wh:3.0,tex:'texBlack_2',rgb:[.9,.95,1.05]});
  return C.done({glow:8})}
pspRegister(9822,f2IslandBuild);
khNpc('f2i_bottle','A bottle on the shore','ps_f2_bottle',()=>{const R=f2S(9822);R.read=1;
  return say('A green glass bottle lies half in the wet sand, corked with wax. Inside is a rolled note. It reads: DIG WHERE THE TIDE LEAVES THE FIRST FOOTPRINT OF THE DAY. Under the words is a small drawing of a starfish, and an arrow pointing north.',[BYE])});
khNpc('f2i_spade',"A spade by the hut",'ps_f2_spade',()=>{const R=f2S(9822);
  if(R.spade)return say('The place by the door where the spade leaned. You have the spade.',[BYE]);
  return say("A fisherman's spade leans against the wall of the hut, its blade crusted with dry sand.",[['Take the spade.',()=>{R.spade=1;try{sfx('key')}catch(e){}msg('You take the spade.','#ffe36a');f2IslandApply();G.talk=null;return null}],BYE])});
F2_ISLAND.PATCH.forEach(([x,y,s,desc],i)=>khNpc('f2i_patch'+i,'A patch of sand','ps_f2_patch_'+s,()=>{
  const R=f2S(9822);R.dug=R.dug||{};
  if(R.dug[s])return say(s===F2_ISLAND.ANSWER?'The hole you dug. It is empty now.':'A hole full of seawater. Nothing else is in it.',[BYE]);
  const opts=R.spade?[['Dig here.',()=>{f2IslandDig(i);G.talk=null;return null}],BYE]:[BYE];
  return say('A patch of smooth sand, with '+desc+' pressed into it.'+(R.spade?'':' You would need a spade to dig here. The fisherman left one by his hut.'),opts)}));
function f2IslandDig(i){
  const R=f2S(9822),[x,y,s]=F2_ISLAND.PATCH[i];R.dug=R.dug||{};if(R.dug[s])return;R.dug[s]=1;
  if(s===F2_ISLAND.ANSWER){f2Chime('open');msg('The spade strikes something smooth under the sand. You dig out a pale foot, wrapped in sailcloth.','#ffe36a');psf2Give('foot')}
  else{f2Chime('bad');msg('The sand caves in, and the hole fills with seawater. Something with claws comes up out of it.','#e0c8a0');f2Release('f2crab',2,x,y)}
  f2IslandApply()}
function f2IslandApply(){const R=f2S(9822);if(LEVEL!==9822)return;
  if(R.spade){const [sx,sy]=F2_ISLAND.SPADE;f2Hide(pspPic('f2_spade'),sx,sy,true)}
  for(const [x,y,s] of F2_ISLAND.PATCH)if(R.dug&&R.dug[s])for(const d of G.decor||[])if(d.npc&&Math.round(d.x)===x&&Math.round(d.y)===y)d.k=pspPic('f2_patch_dug')}
f2OnArrive(9822,()=>f2IslandApply());
/* ---------- 3. THE CABIN IN THE SNOW (9823): the face ---------- */
const F2_SNOW={LOGS:[[8,23],[40,22],[10,31]],FLINT:[28,10],HEARTH:[41,4],MIRROR:[43,4],IN:[41,7,0],OUT:[24,9,2]};
function f2SnowBuild(){
  const SD=f2TexFloor('ps_f2_tex_sndrift','f2t_sndrift',1.0)||'snow',SP=f2TexFloor('ps_f2_tex_snpath','f2t_snpath',.98)||'snowpath',SR=f2TexFloor('ps_f2_tex_snrock','f2t_snrock',1.0)||'snow',SI=f2TexFloor('ps_f2_tex_snice','f2t_snice2',1.3,[.92,1.0,1.12])||'canal',PL=f2TexFloor('ps_f2_tex_planks','f2t_planks',1.0)||'wl2f0';
  const C=f2Room({id:9823,ground:SD,path:SP,band:[2,5],wh:3.2,softRet:1,rw:0,
    routes:[[[24,35],[24,26],[30,21],[30,14],[24,12],[24,9]],[[24,29],[12,28],[10,31]],[[30,18],[40,20]],[[24,24],[12,23],[8,23]]],
    clear:[[14,3,34,13,SD,'The Cabin',1],[4,15,13,24,SD,'The Frozen Pond',1],[35,16,44,26,SD,"The Bear's Den",1],[5,27,15,34,SD,'The Birch Stand',1]],
    keep:(x,y)=>x>=37&&y<=10&&false});
  const W=48,{rows,block,fm}=C;
  // the cabin: a small timber house with a snowy roof; its door opens into the room inside (built in the north-east corner, walled all round)
  try{pspDefringe('ps_f2_cabin')}catch(e){}
  if(IMG.ps_f2_cabin&&IMG.ps_f2_cabin.width&&!IMG.ps_f2_cabin._ps){C.picHouse({img:'ps_f2_cabin',x0:22,y0:5,x1:26,y1:8,w:5.4,door:[24,8],wh:2.6});const lw=f2TexWall('ps_f2_tex_logwall',2.6,{gain:1.25,rgb:[1.05,1.0,.95]}),wd=C.ch(lw!=null?lw:C.TM.make('plain',(WL.sty&&WL.sty.black)||'timber',2.6).gid);for(let y=5;y<=8;y++)for(let x=22;x<=26;x++)if(!(x===24&&y===8)&&!(y===8&&x>=22&&x<=26))C.solid(x,y,wd)}   // the sides of the cabin are dark boardselse C.house({x0:21,y0:5,x1:27,y1:8,face:'S',sty:'timber',roof:'thatch2',wh:2.6,col:[1.5,1.05,.55]});
  for(const x of [22,26])C.light(x,9,[1.5,1.05,.55]);
  {const [dx,dy]=[24,8],g=C.chars[rows[dy][dx]];KH_DOOR[g]={psf2:'warp',psh:'warp',to:F2_SNOW.IN,A:F2_SNOW.IN,B:F2_SNOW.IN,lvl:9823,at:{x:F2_SNOW.IN[0],y:F2_SNOW.IN[1],f:0},msg:'You step inside the cabin. The hearth is cold, and the room is dim and quiet.'};(C.warpTo=C.warpTo||[]).push(F2_SNOW.IN)}
  // inside: walls of timber round x 38..43, y 4..7; the hearth on the north wall, the mirror beside it, a bed, a table
  {const TM=C.TM,sty=(WL.sty&&WL.sty.black)||'timber',lw=f2TexWall('ps_f2_tex_logwall',2.4),wall=C.ch(lw!=null?lw:TM.make('plain',sty,3.0).gid),win=wall;
   for(let y=2;y<=9;y++)for(let x=38;x<=45;x++){const inner=x>=40&&x<=43&&y>=4&&y<=7;if(inner){rows[y][x]='.';block[y*W+x]=0;fm[y*W+x]=C.fl(PL);C.used.delete(x+','+y)}else if(x>=39&&x<=44&&y>=3&&y<=8){C.solid(x,y,(x===42&&y===3)?win:wall)}else C.mist(x,y)}   // timber inside, mist outside (the room is only reached through the cabin door)
   C.warp(41,8,'oak',F2_SNOW.OUT,'You step out into the snow.')}
  {const g=C.chars[rows[8][41]],dg=f2FacGid('ps_f2_cb_door',0,1,2.4,{tex:'texBlack_2',fit:false,emit:.2});if(g!==undefined&&dg!=null)T_TILE[g]=T_TILE[dg]}   // a plank door in the log wall
  {const [hx,hy]=F2_SNOW.HEARTH;C.dec(pspPic('f2_cb_hearth'),hx,hy,{block:true,npc:'f2s_hearth',sc:.75});
   C.dec(pspPic('f2_cb_mirror'),F2_SNOW.MIRROR[0],F2_SNOW.MIRROR[1],{block:false,wd:[0,-1],npc:'f2s_mirror',bob:.7,sc:.9});
   C.dec(pspPic('bed_four'),43,7,{block:true,sc:.62});C.dec(pspPic('f2_cb_chair'),40,5,{block:true,sc:.9});C.dec(pspPic('f2_cb_barrel'),40,7,{block:true,sc:.85});C.dec(pspPic('f2_cb_stool'),42,6,{block:false,sc:.9});
   C.dec(pspPic('f2_cb_shelf'),43,5,{wd:[1,0],block:false,bob:.8,sc:.9});C.dec(pspPic('f2_cb_snowshoes'),40,6,{wd:[-1,0],block:false,bob:.6,sc:.9});C.dec(pspPic('trophy_stag'),42,7,{wd:[0,1],block:false,bob:1.2,sc:.8});
   C.light(41,5,[1.6,1.2,.8]);C.light(42,6,[1.5,1.15,.8]);C.light(40,7,[1.3,1.0,.7])}
  // snowy pines close round the sides of the cabin; the woodpile and the flint post (lit) beside it, the three logs out in the snow
  for(const [x,y,k] of [[21,6,'f2_sn_spruce'],[21,8,'f2_sn_pine'],[27,6,'f2_sn_fir'],[27,8,'f2_sn_spruce'],[21,4,'f2_sn_fir'],[27,4,'f2_sn_pine']])if(C.free(x,y)){C.used.delete(x+','+y);const d=C.dec(pspPic(k),x,y,{block:true,sc:.75});if(d)d.ox=x<24?.25:-.25}
  C.light(28,10,[1.8,1.25,.6]);for(const [x,y] of [[29,10],[29,11]])if(C.free(x,y)){C.used.delete(x+','+y);C.dec(pspPic('f2_sn_woodpile'),x,y,{block:true,sc:1.1})}
  C.used.delete('30,9');C.dec(pspPic('f2_log'),30,9,{block:true,sc:1.6});C.used.delete('31,9');C.dec(pspPic('f2_log'),31,9,{block:true,sc:1.4});
  {const [fx,fy]=F2_SNOW.FLINT;C.used.delete(fx+','+fy);C.dec(pspPic('f2_flintpost'),fx,fy,{block:true,npc:'f2s_flint'})}
  F2_SNOW.LOGS.forEach(([x,y],i)=>{C.used.delete(x+','+y);C.dec(pspPic('f2_log'),x,y,{block:true,npc:'f2s_log'+i,sc:1.3})});
  // the ground: deep drifts, trampled snow by the cabin, rocks and frozen grass showing through here and there
  f2Patches(C,[[SD,.88],[SR,.12]],{cs:5,keep:(x,y)=>x>=38&&y<=9});
  // the frozen pond: ice you walk round, reeds of frozen grass and rocks on its banks
  for(let y=17;y<=21;y++)for(let x=6;x<=11;x++)if(Math.hypot((x-8.5)/3,(y-19)/2.4)<1&&C.free(x,y))C.water(x,y,SI);
  // the snowbound forest: painted snowy pines, firs, spruces and frosted birches, never in rows; bushes, frozen grass, snowy boulders
  const TS=['f2_sn_pine','f2_sn_spruce','f2_sn_fir','f2_sn_birch','f2_sn_pine','f2_sn_fir'].map(pspPic);TS.push(...TS.map(f2Flip));
  C.fill(TS,{});
  for(const d of C.decor)if(/f2_sn_/.test(d.k)&&d.block){d.sc=+((d.sc||1)*(.8+C.hs2(d.x,d.y,171)*.5)).toFixed(2);d.ox=(C.hs2(d.x,d.y,172)-.5)*.85;d.oy=(C.hs2(d.x,d.y,173)-.5)*.7}
  C.scrub([pspPic('f2_sn_bush'),pspPic('f2_sn_grass'),pspPic('f2_sn_grass'),pspPic('f2_sn_boulder'),pspPic('f2_sn_sapling')],.1,{sc:.8});
  C.capTrees(/f2_sn_(pine|spruce|fir|birch)/,2.6);
  // life and dressing: a fox, an owl, finches; a sled of firewood and a sign by the cabin; lanterns on posts along the way
  for(const [x,y,k] of [[12,25,'f2_sn_fox'],[37,19,'f2_sn_owl'],[18,30,'f2_sn_finches'],[33,10,'f2_sn_sled'],[6,30,'f2_sn_owl'],[42,24,'f2_sn_fox']])if(C.free(x,y)&&!C.nearPath(x,y,0))C.dec(pspPic(k),x,y,{block:k==='f2_sn_sled'});
  for(const [x,y] of [[23,30],[25,22],[29,17],[26,10],[22,10]])if(C.free(x,y)){C.dec(pspPic('f2_sn_lantern'),x,y,{block:false,sc:.85});C.light(x,y,[1.6,1.1,.6])}
  for(const [x,y] of [[20,9],[28,9]])if(C.free(x,y))C.dec(pspPic('f2_sn_fence'),x,y,{block:false,sc:.9});
  f2Edge(C,{img:'f2_sn_wall',wh:1.9,veil:.15,pillar:TS,innerP:.6,innerKeep:(x,y)=>x>=15&&x<=33&&y<=12,tall:['f2_sn_pine','f2_sn_spruce','f2_sn_fir','f2_sn_spire','f2_sn_pine'],tallP:.8,tallSc:[1.0,1.5]});
  pspSafeZone(C,24,35,6);
  C.foes(['f2snowwolf','f2snowwolf','f2frostwraith'],[4,15,13,24],1);
  C.foes(['f2snowbear','f2snowwolf','f2frostwraith'],[35,16,44,26],2);
  C.foes(['f2frostwraith','f2snowwolf'],[5,27,15,34],3);
  C.foes(['f2iceelem','f2snowwolf'],[14,3,34,13],4);
  for(const [x,y] of [[12,16],[43,25],[6,33]])C.chestAt(x,y,1);
  C.ret();f2RetGate(C,f2Soft('ps_f2_illgate',{filter:'brightness(.85) contrast(1.15)',tag:'d'}),{one:true,wh:3.0,tex:'texBlack_2',rgb:[.9,.95,1.05]});
  const lv=C.done({glow:8});
  return lv}
pspRegister(9823,f2SnowBuild);
/* inside the cabin: a roof of dark planks and beams overhead instead of the sky, no snow falling, warm air */
F2.inside[9823]=[40,4,43,7,'ps_f2_tex_roof'];
F2_SNOW.LOGS.forEach(([x,y],i)=>khNpc('f2s_log'+i,'A log in the snow','ps_f2_log',()=>{const R=f2S(9823);R.logs=R.logs||{};
  if(R.logs[i])return say('Only a dent in the snow where the log lay.',[BYE]);
  return say('A split log of firewood, half buried in the snow. It is dry under the bark.',[['Take the log.',()=>{R.logs[i]=1;try{sfx('key')}catch(e){}msg('You take the log. ('+f2SnowLogs()+' of 3.)','#ffe36a');f2SnowApply();G.talk=null;return null}],BYE])}));
const f2SnowLogs=()=>Object.keys(f2S(9823).logs||{}).length;
khNpc('f2s_flint','A post by the woodpile','ps_f2_flintpost',()=>{const R=f2S(9823);
  if(R.flint)return say('A post by the woodpile. The flint and steel that sat on top of it are in your pack.',[BYE]);
  return say('A short post stands by the woodpile. On top of it lie a flint and a steel, out of the snow.',[['Take the flint and steel.',()=>{R.flint=1;try{sfx('key')}catch(e){}msg('You take the flint and steel.','#ffe36a');G.talk=null;return null}],BYE])});
khNpc('f2s_hearth','The hearth','ps_furn_fireplace_tall',()=>{const R=f2S(9823);
  if(R.lit)return say('A fire burns high in the hearth. The cabin is warm at last.',[BYE]);
  const n=f2SnowLogs(),laid=!!R.laid,opts=[];
  if(!laid&&n>=3)opts.push(['Lay the three logs on the hearth.',()=>{R.laid=1;try{sfx('door')}catch(e){}msg('You stack the three logs on the cold hearth.','#ffe36a');G.talk=null;return null}]);
  if(laid&&R.flint)opts.push(['Strike the flint.',()=>{f2SnowLight();G.talk=null;return null}]);
  opts.push(BYE);
  return say(laid?'Three logs lie stacked on the hearth, ready to burn.'+(R.flint?'':' You need something to light them. There was a flint on a post by the woodpile.'):'A stone hearth with a cold, empty grate. A fire would need three logs. You have '+n+'.',opts)});
function f2SnowLight(){const R=f2S(9823);if(R.lit||!R.laid||!R.flint)return;R.lit=1;f2Chime('open');
  msg('Sparks catch, and the logs burn up bright. The heat fills the cabin, and the thick ice on the mirror runs down the glass in streams.','#ffe36a');f2SnowApply()}
khNpc('f2s_mirror','A mirror over the mantel','ps_f2_mirror_ice',()=>{const R=f2S(9823);
  if(!R.lit)return say('A tall mirror beside the hearth, covered in ice as thick as a hand. Something pale is behind the ice, but you cannot see what.',[BYE]);
  if(!psf2F().got.face)return say('The ice has melted off the mirror. A pale face looks out of the glass with its eyes shut, and you can reach into the mirror as if it were water.',[["Take the Sleeper's Face.",()=>{psf2Give('face');f2SnowApply();G.talk=null;return null}],BYE]);
  return say('The mirror shows the warm cabin and the fire. Only your own faces look back.',[BYE])});
function f2SnowApply(){if(LEVEL!==9823)return;const R=f2S(9823);
  F2_SNOW.LOGS.forEach(([x,y],i)=>{if(R.logs&&R.logs[i])f2Hide(pspPic('f2_log'),x,y,true)});
  for(const d of G.decor||[])if(d.npc==='f2s_hearth')d.k=pspPic(R.lit?'f2_cb_hearth_lit':'f2_cb_hearth');
  for(const d of G.decor||[])if(d.npc==='f2s_mirror')d.k=pspPic(R.lit&&psf2F().got.face?'furn_mirror_gothic':R.lit?'f2_mirror_face':'f2_cb_mirror');
  if(R.lit)for(const l of LIGHTS||[])if(Math.abs(l.x-41.5)<1.2&&Math.abs(l.y-5.5)<1.2){l.col=[1.6,1.0,.45];l.kI=1.8}}
f2OnArrive(9823,()=>f2SnowApply());
