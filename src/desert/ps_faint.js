/* ps_faint.js: the harmless haunting is faint (owner request, 30 Oct 2026).
   The slow ghosts that float about the castle (the hall ghosts ps_gh_*, the diners, the harp ghost, and the ambient ghosts of the wings) cannot hurt anyone, so they are drawn
   as pale blue-white apparitions: about 40 percent opaque, soft edged, a little glow round them, a veil over the face and body and more mist toward the hem, and a slow bob.
   The fighting ghosts (wraith, officer, bake ghost, cell ghost, chorister...) and the quest folk who share a ghost picture (prisoners, chamberlain, curator, lutenist, the keepers) stay solid,
   so the difference tells the player which ghosts need no fighting.
   Each floating ghost gets its OWN faded canvas (the shared pictures are never touched). Same size as the original, so heights, feet and the grounding audit are unchanged.
   Runs once after each castle level is built (this wraps the scale wrapper, so it runs last). Report in LEVELS[id]._faint. */
function psfMake(src){
  const w=src.width,h=src.height;if(!w||!h)return null;
  const mk=()=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
  const bl=Math.max(1,Math.round(h/260));
  const body=mk(),b=body.getContext('2d');
  try{b.filter='saturate(.12) brightness(1.5) contrast(.85) blur('+bl+'px)'}catch(e){}
  b.drawImage(src,0,0,w,h);b.filter='none';
  b.globalCompositeOperation='source-atop';b.fillStyle='rgba(140,190,255,.5)';b.fillRect(0,0,w,h);          // pale blue-white
  const vg=b.createLinearGradient(0,0,0,h);vg.addColorStop(0,'rgba(230,242,255,.2)');vg.addColorStop(.55,'rgba(214,230,255,.1)');vg.addColorStop(1,'rgba(214,230,255,.3)');
  b.fillStyle=vg;b.fillRect(0,0,w,h);                                                                          // the veil
  const out=mk(),o=out.getContext('2d');
  try{o.filter='blur('+Math.max(3,Math.round(h/60))+'px) brightness(1.7)'}catch(e){}
  o.globalAlpha=.3;o.drawImage(body,0,0);o.filter='none';                                                       // the glow
  o.globalAlpha=.42;o.drawImage(body,0,0);o.globalAlpha=1;                                                       // the body, translucent
  o.globalCompositeOperation='destination-in';
  const fg=o.createLinearGradient(0,0,0,h);fg.addColorStop(0,'rgba(0,0,0,1)');fg.addColorStop(.6,'rgba(0,0,0,.92)');fg.addColorStop(1,'rgba(0,0,0,.62)');
  o.fillStyle=fg;o.fillRect(0,0,w,h);o.globalCompositeOperation='source-over';                                   // more mist toward the feet (never below what the ground audit sees)
  out._faint=1;return out}
function psfLevel(id,L){
  if(!L||!L.decor||L._faint!==undefined)return L;L._faint=0;let n=0;
  for(const d of L.decor){
    if(typeof d.k!=='string'||d.pic||d.hidden)continue;
    if(/^ps_gh_/.test(d.k)){const src=IMG[d.k];if(src&&!src._faint&&src.width){const c=psfMake(src);if(c){IMG[d.k]=c;d._faint=1;n++}}}      // halls: the key is already its own
    else if(d.npc&&/^psw_gh/.test(d.npc)&&!/^psf_/.test(d.k)){const src=IMG[d.k];if(src&&src.width){const c=psfMake(src);if(c){const nk='psf_'+d.npc;IMG[nk]=c;NPC_H[nk]=NPC_H[d.k];d.k=nk;d._faint=1;n++}}}   // wings: a key of its own
  }
  L._faint=n;return L}
{for(const info of PSP.LEVELS){const id=info.id,orig=KH_LAZY[id];if(!orig||orig._psf)continue;
  const w=()=>{const lv=orig();const L=LEVELS[id]||lv;try{psfLevel(id,L)}catch(e){console.error('ps faint',id,e)}return LEVELS[id]||lv};w._psf=1;w._pss=orig._pss;w._pst=orig._pst;w._psc=orig._psc;KH_LAZY[id]=w}}
/* a slow bob for the wings' ghosts (the halls' ghosts already bob in pshGhostTick); runtime only, so the level data and the ground audit are unchanged */
{const _u=update;update=function(dt){const r=_u.apply(this,arguments);
  try{if(G&&G.state==='play'&&G.decor&&LEVEL>=9710&&LEVEL<=9998){const t=G.time||0;for(const d of G.decor)if(d._faint&&d.npc&&/^psw_gh/.test(d.npc))d.bob=.05+.04*Math.sin(t*1.1+(d.x*7+d.y*13)%6.28)}}catch(e){}
  return r}}
