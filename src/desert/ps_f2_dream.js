/* ==========================================================================
   THE PALE SPIRE, SECOND FLOOR: THE SLEEPER WAKES, AND THE SOVEREIGN'S DREAM (prefix psf2 / psdream).
   When the seventh piece is laid on the table the Sleeper wakes (cutscene psWake). The part of her that kept dreaming for the Sovereign tears loose and rises as a boss, the Sovereign's Dream
   (cutscene psDream, then the fight). Killing it drops the Dreamweave Mantle, brings the Sleeper back, and opens a swirling door where the iron door stood: the way to the third floor (9880, still a stub room).
   State: psf2F().dream  undefined/0 = not woken, 1 = the Dream is loose, 2 = the Dream is dead and the door is open;  psf2F().dreamGot = the mantle was given.
   ========================================================================== */
/* ---------- the two cutscenes ---------- */
CUTS.psWake=()=>[
  {text:'The last piece settles into its hollow. For a moment nothing moves. Then the pale cloth on the black stone rises and falls, once, like a sleeper drawing breath.'},
  {text:'The Sleeper opens her eyes. She sits up slowly, as if every limb had to be introduced to the others, and steps down from the table with one hand on the cold stone.'},
  {who:'The Sleeper',text:'Seven rooms. I heard you in every one of them. The forest, the snow, the water, the sand, the swamp. I heard you in the nightmare, and I was so frightened that you would stop.'},
  {who:hn(0),text:'You are the Sleeper?'},
  {who:'The Sleeper',text:'I was. I dreamed this whole floor for the Sovereign, until the night I would not dream any more. She took me apart and hid me in my own dreams, so that I could never wake and say what I knew. You put me back together. I have no gold to give you. I only have my thanks.'},
  {who:hn(1),text:'Then you can open the way up?'},
  {who:'The Sleeper',text:'The stair is shut by a dream, and every dream has a dreamer. For a very long time the dreamer was me.'},
  {text:'The Sleeper stops. The shadow she throws on the floor has not moved with her. It lies where she was lying, long and black, and the cloth on the table is still moving.'},
  {who:'The Sleeper',text:'Oh. Oh, no. She left a piece of me behind. The part that always did what it was told. Stand back, all of you. Stand back now.'}];
CUTS.psDream=()=>[
  {text:'The shadow on the floor comes away from the stone like a sheet from a line. It rises, and it takes the Sleeper\'s shape, and her face. The eyes are lit from the inside. The hair moves in a wind that is not there.'},
  {who:'The Sovereign\'s Dream',text:'You are in my dream. You have been in it since the stair.'},
  {who:'The Sleeper',text:'She is the part of me that never woke. She holds the way up, and she has held it for me for a hundred years.'},
  {who:'The Sovereign\'s Dream',text:'I built you seven rooms, and you walked through them like guests. Do you know what a guest owes the house?'},
  {who:hn(2),text:'Whatever it is, we are not paying it.'},
  {who:'The Sovereign\'s Dream',text:'Then you will wake nowhere. I was given one task: keep the dreamer asleep, and keep the door shut. I will do both. I am very good at it.'},
  {who:hn(0),text:'She will not let us up.'},
  {who:'The Sleeper',text:'She cannot. She is only a dream, and a dream has to wake if it is hurt enough. Go on. I will not look away.'},
  {text:'The Sleeper steps back into the shadow of a pillar. Seven pale lights, one for each of the rooms, flare in a ring round the bier. The Dream lifts both hands.'}];

/* ---------- the creature ---------- */
{
  const src=()=>pspPic('f2_sleeper_up');
  // the Sleeper's own picture, darkened and turned violet: her shadow
  psf2DreamArt=function(){const s=src();return f2Tint('ps_psdream',s,'brightness(.34) contrast(1.5) saturate(1.8) hue-rotate(250deg)','rgba(70,20,110,.45)')};
  ENEMY_DEF.psdream=pscE('psdream',{img:'ps_psdream',ph:2.5,w:1.15,name:"The Sovereign's Dream",hp:650,dmg:[12,18],hit:.9,verb:'drowns',xp:1250,boss:true,aboveParty:0,gold:[0,0]});
  if(typeof NO_VARY!=='undefined')NO_VARY.push('psdream');
  if(typeof BOSS_GOLD!=='undefined')BOSS_GOLD.psdream=[5000,6500];
  if(typeof AFFL_HITS!=='undefined')AFFL_HITS.push([/^psdream/,'cursed',.2]);
}
var psf2DreamArt;
function psf2DreamFix(){const k=psf2DreamArt(),im=k&&IMG[k];if(im&&im.width){ENEMY_DEF.psdream.w=+(ENEMY_DEF.psdream.ph*im.width/im.height).toFixed(2);if(NPC_H.ps_f2_sleeper_up!==undefined)NPC_H[k]=NPC_H.ps_f2_sleeper_up}return !!k}
const psf2DreamLive=()=>(G.enemies||[]).some(e=>e.t==='psdream'&&e.hp>0);
function psf2DreamSpawn(){psf2DreamFix();return bl3Add('psdream',28,26,104)}

/* the Dream is loose: spawn her, hide the Sleeper, then show the second scene */
function psf2Rise(cut){
  if(LEVEL!==PSF2H.ID)return;const F=psf2F();F.dream=1;
  if(!psf2DreamLive())psf2DreamSpawn();
  psf2Apply();
  if(cut){F.dreamCut=1;startCut('psDream')}}
/* waking the Sleeper plays the first scene, and the Dream rises when it ends */
{const _w=psf2Wake;psf2Wake=function(){const F=psf2F(),was=F.woke,r=_w.apply(this,arguments);
  if(r&&!was){F.dream=1;G.talk=null;startCut('psWake',()=>psf2Rise(true))}
  return r}}
/* she keeps her phases: every quarter of her health lost lets something out of the rooms she dreamed */
bl3Hit('psdream',e=>{
  const r=e.hp/e.maxhp,ph=r<.25?3:r<.5?2:r<.75?1:0;if(ph<=(e._ph|0))return;e._ph=ph;
  const T=[null,['f2shadow','f2shadow'],['f2hands','f2horror'],['f2hound','f2hound','f2doll']][ph],M=[null,'The Dream shrieks, and two shadows peel off the walls.','The floor opens in clawing hands, and a many-faced thing climbs out of the cracks.','The Dream falls to her knees and screams, and the hounds of the nightmare come bounding out of the dark.'][ph];
  let n=0;for(const t of T){if(G.enemies.filter(m=>m._kid&&m.hp>0).length>=4)break;const m=bl3Add(t,e.x,e.y,104);if(m){m._kid=1;n++}}
  msg(M,'#c8a8ff')});
/* her death */
bl3Kill('psdream',e=>{
  const F=psf2F();F.dream=2;
  try{f2Chime('open')}catch(x){}
  msg("The Dream comes apart in seven voices, one for each room, and the last one is the Sleeper's own. Where she fell, the dark on the floor is only a floor.",'#d8c8ff');
  if(!F.dreamGot){F.dreamGot=1;bl3Give('pg_dreamweave');msg("A folded robe of silver thread lies where she stood: the Dreamweave Mantle.",'#ffe36a')}
  later(900,()=>{psf2Apply();msg('The iron door at the end of the gallery shudders and swings away. Where it stood, a doorway of swirling light turns slowly in the air.','#e0c8ff')})});

/* ---------- the loot: a piece of the Pale Spire's own gear ---------- */
pgrItem('pg_dreamweave',{n:'Dreamweave Mantle',k:'chest',t:'Chest',ic:'chest',c:PGR_C.vio,armor:88,pas:{ward:32,dodge:.1,regen:1,mpRegen:1,spellPct:.1,dmgPct:.05},sw:.3,
  d:"A robe of silver thread so fine it weighs nothing, woven by the Sleeper in her dreams and left behind when the Sovereign's Dream was undone. Armour 88, every blow on the wearer is 32 lighter, enemies miss 10% more, spells strike 10% harder, all damage +5%, and wounds and tiredness fade steadily."});

/* ---------- the Sleeper afterwards, and the swirling door ---------- */
khNpc('psf2_sleeper','The Sleeper','ps_f2_sleeper_up',()=>{const F=psf2F();
  if(F.dream===2)return say("The Dream is gone, and I am only one person again. It is a very strange thing to be. The way up is open: the Hall of Mirrors, on the third floor. Be careful there. Nothing in it is what it looks like, and the Sovereign knows every trick I ever dreamed. Thank you. Go well.",[BYE]);
  return say("Hurt her! She is only a dream, and she will wake if you hurt her enough!",[BYE])});
khNpc('psf2_portal','The swirling door','psf2_swirl',()=>{const l=PSP.LINKS.find(k=>k.from===PSF2H.ID&&k.to===9880);
  return say("A doorway of swirling violet light stands where the iron door was. It turns slowly, and it hums very quietly, like a bell that has just been struck. The stair to the third floor is behind it. Cold air breathes out of it, and it smells of polished glass.",[
    ['Step through.',()=>{G.talk=null;const q=l?pspLandOf(l):[12,13,0];sfx('door');goToLevel(9880,{x:q[0],y:q[1],f:q[2]});return null}],BYE])});
PSP_L(9820,null,9880,[56,80,0],{name:'the swirling door to the Third Floor',prov:1});
PSP_L(9880,null,9820,[50,5,3],{name:'back through the swirling door',prov:1});

/* the door's picture: a stone arch round a slow vortex, drawn from the painted rune circles and bursts of the spell art (fx_paint.js), redrawn while it is on screen */
function psf2SwirlDraw(t){
  const c=IMG.psf2_swirl;if(!c)return;const g=c.getContext('2d'),W=c.width,H=c.height,cx=W/2,cy=H*.56;
  g.clearRect(0,0,W,H);
  const arch=()=>{g.beginPath();g.moveTo(22,H-4);g.lineTo(22,H*.4);g.arc(cx,H*.4,cx-22,Math.PI,0);g.lineTo(W-22,H-4);g.closePath()};
  g.save();arch();g.clip();
  const gr=g.createRadialGradient(cx,cy,4,cx,cy,H*.55);gr.addColorStop(0,'#b894ff');gr.addColorStop(.2,'#7a50d8');gr.addColorStop(.55,'#331870');gr.addColorStop(1,'#0e0620');g.fillStyle=gr;g.fillRect(0,0,W,H);
  g.globalCompositeOperation='lighter';
  for(let i=0;i<3;i++){const im=IMG[i===1?'fx_burst':'fx_runecircle'];if(!im||!im.width)continue;
    g.save();g.translate(cx,cy);g.rotate(t*(i%2?-1:1)*(.5+.25*i));const s=W*(1.25-.22*i);g.globalAlpha=.3+.08*Math.sin(t*2+i);g.drawImage(im,-s/2,-s/2,s,s);g.restore()}
  for(let a=0;a<5;a++){g.beginPath();for(let k=0;k<=40;k++){const u=k/40,r=4+u*H*.5,an=a*Math.PI*2/5+u*3.4+t*1.1;const x=cx+Math.cos(an)*r*.8,y=cy+Math.sin(an)*r;k?g.lineTo(x,y):g.moveTo(x,y)}
    g.strokeStyle='rgba(200,170,255,.4)';g.lineWidth=2.2;g.stroke()}
  g.restore();
  arch();g.strokeStyle='#bdb4d8';g.lineWidth=7;g.stroke();g.strokeStyle='#6c6388';g.lineWidth=2;g.stroke()}
{const c=document.createElement('canvas');c.width=192;c.height=288;IMG.psf2_swirl=c;NPC_H.psf2_swirl=2.5;psf2SwirlDraw(0)}
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(typeof LEVEL!=='undefined'&&LEVEL===PSF2H.ID){const F=psf2F();
    if(F.dream===2)psf2SwirlDraw(G.time);
    // the Dream is loose but not on the floor (a level left mid-fight, or a Sleeper woken before this existed): she rises again once the party is free to see it
    if(F.woke&&F.dream===1&&!psf2DreamLive()&&G.state==='play'&&!G.cut&&!G.talk&&G.enemies){PSF2H.riseAt=PSF2H.riseAt||G.time+.8;if(G.time>=PSF2H.riseAt){PSF2H.riseAt=0;psf2Rise(!F.dreamCut)}}}}catch(e){console.error('psf2 dream',e)}
  return r}}

/* ---------- the level follows the flags ---------- */
{const _a=psf2Apply;psf2Apply=function(){_a.apply(this,arguments);
  if(LEVEL!==PSF2H.ID||!G.decor)return;const F=psf2F();
  for(const d of G.decor){
    if(d.npc==='psf2_sleeper'&&F.dream===1){d.hidden=true;d.found=true;d.block=false}
    if(d.npc==='psf2_portal'){const on=F.dream===2;d.hidden=!on;d.found=!on;d.block=on}}}}
/* a Sleeper woken before this update (or a level left mid-fight): the Dream is loose again when the party comes back */
pspOnArrive(n=>{if(n!==PSF2H.ID)return;const F=psf2F();PSF2H.riseAt=0;if(F.woke&&F.dream!==2&&F.dream===undefined)F.dream=1;psf2Apply()});
