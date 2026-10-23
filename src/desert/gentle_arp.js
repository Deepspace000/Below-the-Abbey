/* ==========================================================================
   GENTLE ARPEGGIO. The "level" sound is a short rising arpeggio. It plays on a level up, when a teleporter wakes or carries the
   party, at a shrine, a found gem, a learned spell, a ringing bell and so on.
   Before: five bright triangle notes. Worse, when a party is built at a high level (the go-to screen, the Testing menu, a start link such as
   the one for Orange Spire level 1) every level gained played its own copy at the same instant, up to 130 copies stacked on top of each
   other. That was a loud, hard-clipped, distorted blast.
   Now: five soft sine notes of an A minor add 9 chord (A C E A B, rising), each with a gentle attack and a long smooth fade, through a light
   lowpass, much quieter than before, and only one arpeggio at a time (a second request within half a second is dropped).
   It replaces the old one by wrapping sfx(), so every place that plays "level" gets it.
   ========================================================================== */
const GA={last:-9,notes:[[440,1],[523.25,.95],[659.25,.9],[880,.85],[987.77,.8]],step:.15,att:.06,hold:.08,tau:.35,ring:2.2,vol:.03,over:.14,lp:3200,gap:.5};
function gentleArp(){
  if(!AC||G.mute)return;
  const t0=AC.currentTime;
  if(t0-GA.last<GA.gap)return; // one arpeggio at a time: a burst of level ups (a whole party built at once) plays a single one
  GA.last=t0;
  const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=GA.lp;lp.Q.value=.4;lp.connect(MASTER);
  GA.notes.forEach(([f,w],i)=>{
    const t=t0+i*GA.step,end=t+GA.att+GA.hold+GA.ring,g=AC.createGain(),o=AC.createOscillator(),o2=AC.createOscillator(),g2=AC.createGain();
    o.type='sine';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2;g2.gain.value=GA.over; // a soft second partial an octave up, for the glassy ring
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(GA.vol*w,t+GA.att); // slow attack
    g.gain.setValueAtTime(GA.vol*w,t+GA.att+GA.hold);g.gain.setTargetAtTime(0,t+GA.att+GA.hold,GA.tau); // then a long exponential release
    o.connect(g);o2.connect(g2);g2.connect(g);g.connect(lp);
    o.start(t);o2.start(t);o.stop(end);o2.stop(end);
  });
}
{const _s=sfx;sfx=function(n){if(n==='level'){gentleArp();return}return _s.apply(this,arguments)}}
