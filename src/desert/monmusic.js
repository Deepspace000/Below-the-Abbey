/* ==========================================================================
   MONASTERY MUSIC. Inside the buildings of Saint Elen's (church, chapel, refectory, scriptorium, kitchen, guest house, infirmary) a Gregorian chant plays, and serene
   music plays in the grounds. Each fades in and out as the party goes through a door. The chant is "Chant" by christislord (CC0, opengameart.org); the grounds
   music is "Another August" by cynicmusic, The Cynic Project (CC0, cynicmusic.com, pixelsphere.org).
   ========================================================================== */
const MM={chant:null,calm:null,vc:0,vg:0};
function mmEl(src){const a=new Audio(src+'?v='+VERSION);a.loop=true;a.volume=0;a.preload='auto';return a}
function mmTarget(){
  if(G.state!=='play'||G.mute||!SNDOPT.music)return [0,0];
  const n=LEVEL;
  if(n>=MON.ROOM0&&n<=MON.ROOM0+6)return [.6,0];
  if(n===MON.ID)return [0,.5];
  return [0,0];
}
{const _u=ui;ui=function(dt){try{
  const [tc,tg]=mmTarget(),d=Math.min(.1,dt||.016)*.45;
  if(tc>0&&!MM.chant)MM.chant=mmEl('assets/snd/chant.mp3');
  if(tg>0&&!MM.calm)MM.calm=mmEl('assets/snd/august.mp3');
  MM.vc+=clamp(tc-MM.vc,-d,d);MM.vg+=clamp(tg-MM.vg,-d,d);
  for(const [el,v] of [[MM.chant,MM.vc],[MM.calm,MM.vg]]){if(!el)continue;
    if(v>.005){el.volume=clamp(v*(SNDOPT.music||1),0,1);if(el.paused){const p=el.play();if(p&&p.catch)p.catch(()=>{})}}
    else if(!el.paused){el.pause()}}
}catch(e){}return _u.apply(this,arguments)}}
