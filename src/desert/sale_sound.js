/* ==========================================================================
   THE SOUND OF SALE (prefix sas / SAS). Made in the browser and from the game's own samples: a cold wind (WIND_AMT), the bell of the Belfry tolling by itself (church_bell1 and 2, low and slow), the hour,
   crows cawing from the posts, a low ghostly note now and then, the creak of a gibbet chain in the square. Cellars, the crypt and the belfry: slow drips and a hollow hum.
   ========================================================================== */
WIND_AMT[600]=.36;
const SAS={nextCrow:0,nextBell:0,nextNote:0,nextCreak:0,nextDrip:0,hour:-1};
function sasCaw(vol){
  if(!AC||G.mute)return;const f=360+Math.random()*140,n=2+((Math.random()*3)|0);
  for(let i=0;i<n;i++){const d=i*(.23+Math.random()*.05);tone(f*(1+(Math.random()-.5)*.1),f*.78,.17,'sawtooth',.045*vol,d);nz(.07,.05*vol,'bandpass',1300,900,d)}}
function sasBell(vol){playSmp('church_bell1',.5*vol,.7);setTimeout(()=>playSmp('church_bell2',.4*vol,.68),3000)}
function sasNote(vol){if(!AC||G.mute)return;const b=130+Math.random()*60;tone(b,b*.8,2.6,'sine',.05*vol,0);tone(b*1.5,b*1.2,2.4,'sine',.025*vol,.15);tone(b*2.01,b*1.6,1.8,'sine',.012*vol,.3)}
function sasCreak(vol){if(!AC||G.mute)return;const f=190+Math.random()*60;tone(f,f*1.25,.35,'sawtooth',.03*vol,0);tone(f*1.4,f*1.1,.3,'sawtooth',.02*vol,.45);nz(.1,.03*vol,'bandpass',900,600,.05)}
function sasDrip(vol){if(!AC||G.mute)return;const f=900+Math.random()*500;tone(f,f*.5,.12,'sine',.05*vol,0);tone(f*.7,f*.35,.2,'sine',.015*vol,.09)}
/* ---- the QA pass: more voices, chosen by where the party stands (square, dead quarter, farm, Bell Lane, belfry, crypt, cellar, shops) ---- */
function sasShutter(vol){if(!AC||G.mute)return;nz(.09,.07*vol,'bandpass',700,300,0);tone(160,90,.12,'square',.03*vol,0);nz(.07,.045*vol,'bandpass',900,400,.32);tone(140,80,.1,'square',.02*vol,.32)}
function sasChain(vol){if(!AC||G.mute)return;for(let i=0;i<4;i++){const d=i*(.11+Math.random()*.05);tone(2300+Math.random()*900,1700,.05,'triangle',.03*vol,d);tone(1200+Math.random()*500,900,.07,'sine',.015*vol,d+.02)}}
function sasHum(vol){if(!AC||G.mute)return;const b=[392,349,330,392,294][(Math.random()*5)|0];[[1,0],[1.122,.7],[.89,1.4],[1,2.1]].forEach(([m,d])=>tone(b*m,b*m*.99,.6,'sine',.022*vol,d))}
function sasScratch(vol){if(!AC||G.mute)return;for(let i=0;i<5;i++)nz(.06,.05*vol,'highpass',4200+Math.random()*1500,3500,i*.09+Math.random()*.03)}
function sasBones(vol){if(!AC||G.mute)return;const n=3+((Math.random()*4)|0);for(let i=0;i<n;i++){const d=i*(.05+Math.random()*.06);tone(900+Math.random()*700,600,.04,'square',.025*vol,d);nz(.03,.03*vol,'bandpass',2600,1800,d)}}
function sasGroan(vol){if(!AC||G.mute)return;const f=70+Math.random()*30;tone(f*1.2,f*.8,1.6,'sawtooth',.035*vol,0);nz(1.5,.035*vol,'lowpass',420,180,.1)}
function sasWhisper(vol){if(!AC||G.mute)return;for(let i=0;i<3;i++)nz(.7+Math.random()*.5,.025*vol,'bandpass',1700+Math.random()*900,1100+Math.random()*500,i*.45)}
function sasLow(vol){if(!AC||G.mute)return;tone(98,78,1.4,'sawtooth',.03*vol,0);nz(1.3,.02*vol,'lowpass',320,150,0)}
function sasGust(vol){if(!AC||G.mute)return;nz(3.2,.06*vol,'lowpass',260,720,0);nz(2.6,.03*vol,'bandpass',900,1500,.4)}
function sasWings(vol){if(!AC||G.mute)return;for(let i=0;i<7;i++)nz(.05,.05*vol,'bandpass',1600,1000,i*.07+Math.random()*.02)}
function sasTick(vol){if(!AC||G.mute)return;for(let i=0;i<4;i++)tone(1800,1500,.025,'square',.018*vol,i*.5)}
function sasBoard(vol){if(!AC||G.mute)return;const f=110+Math.random()*50;tone(f,f*1.5,.25,'sawtooth',.025*vol,0);nz(.12,.025*vol,'bandpass',600,350,.05)}
function sasMuffled(vol){playSmp('church_bell1',.18*vol,.6)}
function sasScurry(vol){if(!AC||G.mute)return;for(let i=0;i<9;i++)nz(.025,.035*vol,'highpass',5000,4200,i*.04+Math.random()*.02)}
function sasStone(vol){if(!AC||G.mute)return;nz(1.8,.05*vol,'lowpass',150,70,0);tone(48,40,1.8,'sine',.04*vol,0)}
function saSoundTick(){
  if(!AC||!NB||!MASTER||G.state!=='play'||G.mute||!saIs(LEVEL))return;
  const now=AC.currentTime,amb=SNDOPT.amb,N=SAS.n=SAS.n||{},due=(k,lo,hi)=>{if(N[k]===undefined){N[k]=now+Math.random()*hi;return false}if(!(now>N[k]))return false;N[k]=now+lo+Math.random()*(hi-lo);return true};
  if(LEVEL===SA.ID){
    const px=G.P.x,py=G.P.y,z=saZoneAt(px|0,py|0),sq=px>=29&&px<=41&&py>=29&&py<=43,bell=px>=50&&px<=64&&py<=36;
    if(amb&&now>SAS.nextCrow){SAS.nextCrow=now+7+Math.random()*14;sasCaw(.5+Math.random()*.5)}
    if(amb&&now>SAS.nextBell){SAS.nextBell=now+38+Math.random()*50;sasBell(.8)}
    if(amb&&now>SAS.nextNote){SAS.nextNote=now+14+Math.random()*22;sasNote(.6+Math.random()*.4)}
    if(amb&&now>SAS.nextCreak){const d=Math.hypot(px-38,py-33);SAS.nextCreak=now+4+Math.random()*7;if(d<20)sasCreak(Math.max(.1,1-d/20));if(d<14)sasChain(Math.max(.2,1-d/14))}
    if(amb&&due('gust',20,45))sasGust(.7+Math.random()*.3);
    if(amb&&due('shut',25,60)&&!z)sasShutter(.5+Math.random()*.4);
    if(amb&&sq&&due('hum',30,70))sasHum(.6+Math.random()*.4);
    if(amb&&bell&&due('wing',18,40))sasWings(.6);
    if(amb&&z&&z.k==='dead'){if(due('scr',6,16))sasScratch(.7+Math.random()*.3);if(due('bon',9,22))sasBones(.8);if(due('gro',18,40))sasGroan(.7+Math.random()*.3);if(due('whi',30,70))sasWhisper(.6)}
    if(amb&&z&&z.k==='farm'){if(due('low',20,50))sasLow(.7);if(due('scr2',10,26))sasScratch(.5)}
    const h=Math.floor(G.clock/60)%24;if(SAS.hour<0)SAS.hour=h;else if(h!==SAS.hour){SAS.hour=h;if(amb){const k=Math.max(1,h%12||12);for(let i=0;i<k;i++)setTimeout(()=>playSmp('church_bell1',.45,.72),i*2600)}}
  }else if(LEVEL>=7200){
    if(amb&&due('tick',6,14))sasTick(.8);
    if(amb&&due('board',12,30))sasBoard(.7+Math.random()*.3);
    if(amb&&due('muff',45,100))sasMuffled(1);
    if(amb&&due('scur',30,70))sasScurry(.6);
    if(amb&&now>SAS.nextNote&&LEVEL<7300){SAS.nextNote=now+30+Math.random()*30;sasNote(.2)}
  }else if(LEVEL===SA.BELFRY){
    if(amb&&due('gust',8,20))sasGust(1);
    if(amb&&due('wing',10,24))sasWings(.9);
    if(amb&&due('caw',12,30))sasCaw(.6);
    if(amb&&due('hum',25,50))sasLow(.8);
    if(amb&&due('creak',10,22))sasCreak(.7);
    if(amb&&due('bell',22,40))sasMuffled(2.4);
  }else if(LEVEL===SA.CRYPT){
    if(amb&&now>SAS.nextDrip){SAS.nextDrip=now+2.2+Math.random()*5;sasDrip(.45+Math.random()*.4)}
    if(amb&&due('stone',20,45))sasStone(.9);
    if(amb&&due('whi',25,60))sasWhisper(.7);
    if(amb&&due('bon',14,32))sasBones(.5);
    if(amb&&now>SAS.nextNote){SAS.nextNote=now+16+Math.random()*20;sasNote(.35)}
  }else{
    if(amb&&now>SAS.nextDrip){SAS.nextDrip=now+1.6+Math.random()*4;sasDrip(.5+Math.random()*.5)}
    if(amb&&due('scur',12,30))sasScurry(.8);
    if(amb&&due('scr',20,45))sasScratch(.4);
    if(amb&&due('gro',40,90))sasMuffled(.6);
    if(amb&&now>SAS.nextNote){SAS.nextNote=now+16+Math.random()*20;sasNote(.35)}
  }
}
{const _ys=yarSoundTick;yarSoundTick=function(){_ys.apply(this,arguments);try{saSoundTick()}catch(e){console.error('sas',e)}}}
