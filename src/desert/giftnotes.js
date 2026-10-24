/* ==========================================================================
   GIFTS ARE ANNOUNCED. Whenever the party is handed something (by someone it is talking to, by a quest, in a scene) the screen says what it is: "Received: Antidote." or
   "Received: 40 gold." A quest also shows its reward when it is taken. A thing that was already named in a message of its own (a quest's "Reward: ..." line, "Odda gives you a sealed letter")
   is not said twice. Things picked up off the floor, taken from a chest and bought are not gifts and are left as they were. Last in the injection order.
   ========================================================================== */
const GIFT={depth:0,pending:[],seq:0,recent:[]};
{const _m=msg;msg=function(text,col){GIFT.seq++;GIFT.recent.push([GIFT.seq,String(text).toLowerCase()]);if(GIFT.recent.length>24)GIFT.recent.shift();return _m.apply(this,arguments)}}
{const _ba=bagAdd;bagAdd=function(it){const r=_ba.apply(this,arguments);
  try{if(r&&GIFT.depth>0&&it&&it.id&&ITEMDEF[it.id]){const p=GIFT.pending.find(q=>q.id===it.id);if(p)p.n+=it.n||1;else GIFT.pending.push({id:it.id,n:it.n||1,seq:GIFT.seq})}}catch(e){}
  return r}}
function giftSaid(seq,words){return GIFT.recent.some(([s,t])=>s>seq&&words.some(w=>t.includes(w)))}
function giftFlush(){
  const list=GIFT.pending;GIFT.pending=[];
  for(const p of list){const d=ITEMDEF[p.id];if(!d)continue;const name=d.n||p.id;
    if(giftSaid(p.seq,[name.toLowerCase()]))continue;
    msg(`Received: ${name}${p.n>1?' x'+p.n:''}.`,'#ffe36a')}}
// run fn as a place where things are given: whatever it adds to the bag is announced when it is done
function giftRun(fn,self,args){
  const g0=G.gold,s0=GIFT.seq;GIFT.depth++;
  try{return fn.apply(self,args)}
  finally{GIFT.depth--;if(GIFT.depth===0){try{giftFlush();const dg=G.gold-g0;if(dg>0&&!giftSaid(s0,['gold','coin','crown','pay','paid','reward']))msg(`Received: ${dg} gold.`,'#ffe36a')}catch(e){console.error(e)}}}}
{const _t=talkBtn;talkBtn=function(){return giftRun(_t,this,arguments)}}                 // anything a person hands over while the party talks to them
{const _c=cutAdvance;cutAdvance=function(){return giftRun(_c,this,arguments)}}           // and in a scene
{const _qt=qTurnIn;qTurnIn=function(){return giftRun(_qt,this,arguments)}}               // a quest paid out
{const _qa=qAccept;qAccept=function(id){
  const r=giftRun(_qa,this,arguments);
  try{const q=QUESTS[id],rw=q&&q.reward;if(rw&&(rw.gold||rw.xp||(rw.items&&rw.items.length))){const t=rewardText(id);if(t&&t!=='our thanks')msg(`It pays: ${t}.`,'#ffe36a')}}catch(e){}
  return r}}                                                                                 // a quest taken: what it pays, and any thing it gives
