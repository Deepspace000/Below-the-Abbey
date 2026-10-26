/* ==========================================================================
   THE MAZE OF GARDENS, pictures and wiring (level 490; prefix gm / GM). All the pictures are painted (Gemini) and live in assets/gm (listed in garden_list.js, made by tools/gm_list.py):
   hedge textures gmhedgeA_0..8 and gmhedgeB_0..8, ground textures gmfloor_0..5, sprite sheets gmprops1/2, gmtopi, gmstone, gmanim, gmtrees, gmbldg, gmgates, gmguard, gmwarden.
   The pictures are loaded when the garden is first needed (gmLoad), not at the start of the game. Names for the builder: GMA (alias -> [picture, height in squares]).
   ========================================================================== */
const GM={ID:490,ROOMS:[491,492,493,494,495],ready:false,loading:null,tiles:{},made:false};
const GMA={ // alias: [picture, height of the thing in squares (one square is about a person's height)]
  bench_wood:['gmprops1_0',.55],fountain:['gmprops1_1',1.5],birdbath:['gmprops1_2',.8],bench_stone:['gmprops1_3',.5],sundial:['gmprops1_4',.85],urn:['gmprops1_5',1.2],arbour:['gmprops1_6',1.75],trellis:['gmprops1_7',1.5],
  lamp:['gmprops1_8',1.9],well:['gmprops1_9',1.1],skep:['gmprops1_10',.6],table:['gmprops1_11',.8],
  rose_red:['gmprops2_0',.85],rose_white:['gmprops2_1',.85],hollyhock:['gmprops2_2',1.4],tulips:['gmprops2_3',.42],delphinium:['gmprops2_4',1.1],hydrangea:['gmprops2_5',.9],lavender:['gmprops2_6',.6],lilytub:['gmprops2_7',.5],
  sunflowers:['gmprops2_8',1.3],herbbed:['gmprops2_9',.55],cabbages:['gmprops2_10',.5],pumpkins:['gmprops2_11',.5],
  knight:['gmstone_0',1.7],lady:['gmstone_1',1.7],saint:['gmstone_2',1.7],angel:['gmstone_3',1.8],ruinarch:['gmstone_4',1.9],obelisk:['gmstone_5',1.9],column:['gmstone_6',1.7],lion:['gmstone_7',.9],cross:['gmstone_8',1.5],niche:['gmstone_9',.9],gargoyle:['gmstone_10',.9],pondrim:['gmstone_11',.5],
  peacock:['gmanim_0',.8],peacockfan:['gmanim_1',.95],peahen:['gmanim_2',.7],duck:['gmanim_3',.3],rabbit:['gmanim_4',.32],hedgehog:['gmanim_5',.2],robin:['gmanim_6',.3],frog:['gmanim_7',.2],cat:['gmanim_8',.4],butterfly:['gmanim_9',.22],bee:['gmanim_10',.15],swan:['gmanim_11',.55],
  top_cone:['gmtopi_0',1.2],top_spiral:['gmtopi_1',1.3],top_ball:['gmtopi_2',1.3],top_peacock:['gmtopi_3',1.3],top_swan:['gmtopi_4',1.0],top_rabbit:['gmtopi_5',1.0],top_horse:['gmtopi_6',1.3],top_dragon:['gmtopi_7',1.2],top_stag:['gmtopi_8',1.3],top_hound:['gmtopi_9',1.1],top_crown:['gmtopi_10',1.0],top_balls:['gmtopi_11',1.2],
  yew:['gmtrees_0',2.5],espalier:['gmtrees_1',1.7],magnolia:['gmtrees_2',2.6],laburnum:['gmtrees_3',2.6],birch:['gmtrees_4',3.0],olive:['gmtrees_5',2.2],rosetree:['gmtrees_6',1.6],crab:['gmtrees_7',2.7],
  lych:['gmgates_0',2.3],irongate:['gmgates_1',2.0],signpost:['gmgates_2',1.4],hedgearch:['gmgates_3',2.0],
  gazebo:['gmbldg_0',1.9],wisteriaw:['gmbldg_1',1.9],folly:['gmbldg_2',2.3],theatre:['gmbldg_3',1.9],bowerseat:['gmbldg_4',1.6],moongate:['gmbldg_5',2.1],vinepergola:['gmbldg_6',1.9],steps:['gmbldg_7',1.0]};
/* pictures of the old game borrowed for what the new sheets do not hold */
for(let i=0;i<12;i++)GMA['tuft'+i]=['gmtuft_'+i,.3]; // clumps of wildflowers pushing up through cracked paving
const GMX={oak:['ltree0',3.3],willow:['ltree3',3.3],willow2:['ltree11',3.4],cypress:['ltree16',3.3],apple:['ltree17',3.0],cherry:['ltree18',3.0],lime:['ltree19',3.0],flowers0:['lflora0',.55],flowers1:['lflora0_1',.55],flowers2:['lflora0_2',.55],fern:['lbush0',.8],fern2:['lbush0_1',.8]};

/* ---- loading the pictures ---- */
function gmLoad(){
  if(GM.loading)return GM.loading;
  GM.loading=new Promise(res=>{
    const jobs=Object.keys(typeof GM_LIST!=='undefined'?GM_LIST:{}).map(k=>[k,'assets/gm/'+GM_LIST[k][0]]);
    for(const a in GMX){const n=GMX[a][0];if(!IMG[n])jobs.push([n,'assets/'+n+'.png'])} // the few pictures of the old game that the garden borrows (trees, flowers)
    let left=jobs.length;if(!left){GM.ready=true;res();return}
    const done=()=>{if(--left<=0){gmAlias();GM.ready=true;res()}};
    for(const [k,src] of jobs){if(IMG[k]){done();continue}const i=new Image();i.onload=()=>{IMG[k]=i;done()};i.onerror=()=>done();i.src=src+'?v='+(typeof VERSION!=='undefined'?VERSION:'')}
  });
  return GM.loading;
}
/* every alias gets its own key in IMG (decor k is 'gm_<alias>') and its height */
function gmAlias(){
  for(const a in GMA){const [n,h]=GMA[a];if(IMG[n]){IMG['gm_'+a]=IMG[n];NPC_H['gm_'+a]=h}}
  for(const a in GMX){const [n,h]=GMX[a];if(IMG[n]){IMG['gm_'+a]=IMG[n];NPC_H['gm_'+a]=h}}
  // the pictures of the creatures: height from the picture, so the width given to the creature matches
  for(let i=0;i<6;i++)if(IMG['gmguard_'+i])IMG['gmg_'+i]=IMG['gmguard_'+i];
  if(IMG.gmwarden_0)IMG.gmw_0=IMG.gmwarden_0;
  gmFloors();
}
/* the six ground pictures, as floors */
function gmFloors(){
  const F=['gmf_brick','gmf_gravel','gmf_flag','gmf_lawn','gmf_cobble','gmf_petal'];
  F.forEach((nm,i)=>{const im=IMG['gmfloor_'+i];if(im&&!FLOORS[nm])FLOORS[nm]=dsPaintedTex(im)});
  gmWeeds();
  const fb={gmf_brick:'cobble',gmf_gravel:'dirt',gmf_flag:'pale',gmf_lawn:'lush',gmf_cobble:'mosscobble',gmf_petal:'lush'};
  for(const nm of F)if(!FLOORS[nm])FLOORS[nm]=FLOORS[fb[nm]]||FLOORS.cobble;
}
/* hedges with flowers set into them (code-made from the painted hedge swatches and the painted flower sprites): name -> [swatch, flower pictures, how many to a square, how wide in pixels] */
const GM_FW={F0:['gmhedgeA_0',['gmprops2_0','gmprops2_1'],7,34],F1:['gmhedgeA_3',['gmprops2_5','lflora0_1'],5,36],F2:['gmhedgeA_1',['gmprops2_1','lflora0'],7,30],F3:['gmhedgeA_4',['lflora0','lflora0_2','lflora0_1'],6,32],
  F4:['gmhedgeA_2',['gmprops2_6','gmprops2_0'],6,32],F5:['gmhedgeA_5',['lflora0_2','gmprops2_1'],7,30],F6:['gmhedgeA_8',['gmprops2_4','gmprops2_2','lflora0'],4,40],F7:['gmhedgeA_7',['lflora0_2','lflora0_1','lflora0'],7,26]};
/* flowers and weeds pushing up through the cracks of the paving: small painted clumps pressed into the brick, gravel, flagstone and cobble floors (the lawn and the petals are left alone) */
function gmWeeds(){
  if(GM._weeds)return;GM._weeds=1;
  const T=[];for(let i=0;i<12;i++)if(IMG['gmtuft_'+i])T.push('gmtuft_'+i);if(!T.length)T.push('lflora0','lflora0_1','lflora0_2','gmanim_9');
  [['gmf_brick',5],['gmf_gravel',4],['gmf_flag',9],['gmf_cobble',7]].forEach(([nm,n],fi)=>{const d=FLOORS[nm];if(!d||d.length!==TS*TS*4)return;
    const c=document.createElement('canvas');c.width=c.height=TS;const x=c.getContext('2d');x.putImageData(new ImageData(new Uint8ClampedArray(d),TS,TS),0,0);
    let sd=977+fi*131;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^(sd>>>15),1|sd);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
    for(let i=0;i<n*2;i++){const f=IMG[T[(rn()*T.length)|0]];if(!f)continue;const w=7+rn()*8,h=w*f.height/f.width,fx=rn()*TS,fy=rn()*TS;
      for(const ox of [0,-TS])for(const oy of [0,-TS])x.drawImage(f,fx+ox,fy+oy,w,h)}
    FLOORS[nm]=x.getImageData(0,0,TS,TS).data})}
const GM_FLOORSET=['gmf_brick','gmf_gravel','gmf_flag','gmf_lawn','gmf_cobble','gmf_petal'];

/* ---- hedge wall tiles: a painted swatch stood up into a tall tile (stacked, each copy slid sideways so the repeat does not show), with the dark foot and the bright top of a clipped hedge ---- */
function gmTile(tex,wh,opt){
  opt=opt||{};const key=tex+'|'+wh+'|'+(opt.gate||'')+'|'+(opt.fid||'');if(GM.tiles[key]!==undefined)return GM.tiles[key];
  const im=IMG[tex],Hp=Math.round(128*wh),c=document.createElement('canvas');c.width=128;c.height=Hp;const x=c.getContext('2d');
  x.fillStyle='#2e4a28';x.fillRect(0,0,128,Hp);
  if(im){const units=Math.ceil(wh);for(let u=0;u<units;u++){const y=Hp-(u+1)*128,sh=((u*.37+(tex.length%5)*.11)%1)*128;
      x.save();if(u%2){x.translate(128,0);x.scale(-1,1)}for(const dx of [-sh,128-sh])x.drawImage(im,0,0,im.width,im.height,dx,y,128,128);x.restore()}}
  if(opt.flowers&&im){ // blossoms set into the hedge itself: painted flower sprites pressed into the foliage, a few to every square of wall
    let sd=0;for(let i=0;i<key.length;i++)sd=(sd*31+key.charCodeAt(i))|0;const rn=()=>{sd=(sd+0x6D2B79F5)|0;let t=Math.imul(sd^(sd>>>15),1|sd);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296};
    const units=Math.ceil(wh);for(let u=0;u<units;u++)for(let n=0;n<opt.n;n++){const k=opt.flowers[(rn()*opt.flowers.length)|0],f=IMG[k];if(!f)continue;
      const w=opt.w*(.7+rn()*.6),h=w*f.height/f.width,fx=rn()*(128-w),fy=Hp-(u+1)*128+rn()*(128-h);x.drawImage(f,fx,fy,w,h)}}
  if(opt.gate&&IMG[opt.gate]){const g=IMG[opt.gate],s=Math.min(124/g.width,(Hp-6)/g.height);x.drawImage(g,(128-g.width*s)/2,Hp-g.height*s-1,g.width*s,g.height*s)}
  // light: warm, brighter high up, darker at the foot where the hedge meets the ground
  x.globalCompositeOperation='multiply';let gr=x.createLinearGradient(0,0,0,Hp);gr.addColorStop(0,'rgb(255,250,230)');gr.addColorStop(.75,'rgb(240,236,214)');gr.addColorStop(1,'rgb(190,186,166)');x.fillStyle=gr;x.fillRect(0,0,128,Hp);
  x.globalCompositeOperation='lighter';x.fillStyle='rgba(34,28,12,1)';x.fillRect(0,0,128,Hp);x.globalCompositeOperation='source-over'; // a little warm light lifted into the shadows
  const d=x.getImageData(0,0,128,Hp).data;
  for(let i=0;i<d.length;i+=4){const l=d[i]*.3+d[i+1]*.59+d[i+2]*.11,k=1.3;d[i]=(l+(d[i]-l)*k)*1.1;d[i+1]=(l+(d[i+1]-l)*k)*1.1;d[i+2]=(l+(d[i+2]-l)*k)*1.08} // a little richer in colour and light
  const id=addTex(d,null);TEX[id].h=Hp;TEX[id].wh=wh;const gid=KH_NEXT_GID++;T_TILE[gid]=id;
  {let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=4*37){r+=d[i];g+=d[i+1];b+=d[i+2];n++}(GM.col=GM.col||{})[gid]=[r/n|0,g/n|0,b/n|0]} // the mean colour, for the map
  return GM.tiles[key]=gid}

/* ---- the creatures: stone guardians, two garden creatures and the Hedge Warden. w is the width in squares; the heights follow from the pictures ---- */
function gmW(img,h){const e=typeof GM_LIST!=='undefined'&&GM_LIST[img];return e?+(h*e[1]/e[2]).toFixed(2):h*.7}
Object.assign(ENEMY_DEF,{
  gmknight:{name:'Stone Knight',hp:300,dmg:[15,25],hit:.84,w:gmW('gmguard_0',1.7),img:'gmg_0',xp:1100,gold:[0,0],speed:1,verb:'cleaves',aboveParty:0,gm:1,wake:'The stone knight turns its head.'},
  gmhound:{name:'Stone Hound',hp:210,dmg:[13,22],hit:.84,w:gmW('gmguard_1',1.35),img:'gmg_1',xp:950,gold:[0,0],speed:2,verb:'tears',aboveParty:0,gm:1,wake:'The stone hound lifts its head and growls.'},
  gmgargoyle:{name:'Gargoyle',hp:260,dmg:[14,24],hit:.84,w:gmW('gmguard_2',1.3),img:'gmg_2',xp:1050,gold:[0,0],speed:1,fly:true,floatH:.05,verb:'rakes',aboveParty:0,gm:1,wake:'The gargoyle unfolds its wings.'},
  gmlion:{name:'Stone Lion',hp:350,dmg:[16,27],hit:.84,w:gmW('gmguard_3',1.35),img:'gmg_3',xp:1150,gold:[0,0],speed:1,verb:'mauls',aboveParty:0,gm:1,wake:'The stone lion stands up from its plinth.'},
  gmbriar:{name:'Briar Beast',hp:280,dmg:[14,24],hit:.82,w:gmW('gmguard_4',1.5),img:'gmg_4',xp:1000,gold:[0,10],speed:1,verb:'lashes',aboveParty:0,gm:1,wake:'The briars rustle and a shape rises out of them.'},
  gmtrap:{name:'Snapjaw Plant',hp:240,dmg:[16,26],hit:.82,w:gmW('gmguard_5',1.5),img:'gmg_5',xp:950,gold:[0,10],speed:1,verb:'snaps at',aboveParty:0,gm:1,wake:'The great flower turns towards the party and opens its jaws.'},
  gmwarden:{name:'The Hedge Warden',hp:900,dmg:[26,42],hit:.88,w:gmW('gmwarden_0',3.0),img:'gmw_0',xp:9000,gold:[300,600],speed:1,verb:'clips',boss:true,aboveParty:2,gm:1,wake:'The hedge shears creak. The Hedge Warden straightens up and the leaves rustle like a wind.'}
});
if(typeof NO_VARY!=='undefined')NO_VARY.push('gmwarden');
if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^gmbriar/,'bleeding',.3],[/^gmtrap/,'poisoned',.25],[/^gmwarden/,'bleeding',.3]);

/* ---- the garden is built only when its pictures are here: the doors, the jump and the saved game wait for them ---- */
{const _g=goToLevel;goToLevel=function(n,entry){
  if(n===GM.ID&&!GM.ready&&!GM._wait){GM._wait=1;gmLoad().then(()=>{GM._wait=0;goToLevel(n,entry)});return}
  const from=LEVEL;
  try{if(from===GM.ID&&n===WK.WENLOCK){if(!GM._met||Date.now()-GM._met>4000){GM._met=Date.now();try{wkMet('garden')}catch(e){console.error(e)}}if(!entry)entry=WK.WSTART||{x:2,y:2,f:0}}}catch(e){}
  return _g.call(this,n,entry)}}
{const _j=jumpToLevel;jumpToLevel=function(n,target){
  if(n===GM.ID&&!GM.ready&&!GM._wait){GM._wait=1;gmLoad().then(()=>{GM._wait=0;jumpToLevel(n,target)});return}
  return _j.apply(this,arguments)}}
{const _r=restore;restore=function(sv){
  if(sv&&sv.level===GM.ID&&!GM.ready&&!GM._wait){GM._wait=1;gmLoad().then(()=>{GM._wait=0;restore(sv)});return}
  return _r.apply(this,arguments)}}
{const _wd=wdDoorLevel;wdDoorLevel=function(n){return _wd.apply(this,arguments)||n===GM.ID}}
