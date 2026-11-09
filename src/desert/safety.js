/* safety.js: keep this file LAST in the list of tools/inject.py, so that its wrappers are the outermost ones.
   A save that will not load must never leave the game half built. Loading is tried inside a guard here. When it fails, the next
   older save is tried (the autosave, the start of the area, the previous run, the older run). When none of them loads, the game
   goes back to the title screen and says so. The save that failed is kept under its own key ("broken") so it can still be looked at.
   The checks themselves (saveOk, saveCleanParty, saveClean) are in index.html, beside restore. */
const RESTORE_TRY={i:0,first:null,busy:false};
const RESTORE_KEYS=[['auto','the autosave'],['area','the save from the start of the area'],['prev','the previous run'],['prev2','the older run']];
function restoreFallback(sv,e){
  const T=RESTORE_TRY;
  try{console.error('this save would not load',e)}catch(x){}
  try{frameFail(e,'load')}catch(x){}
  if(!T.first){T.first=sv||{};T.i=0;T.kept=false;T.raw='';try{T.raw=JSON.stringify(sv)||''}catch(x){}
    try{if(sv&&T.raw){localStorage.setItem(SAVE_PFX+'broken',T.raw);T.kept=true}}catch(x){}}
  while(T.i<RESTORE_KEYS.length){
    const [k,label]=RESTORE_KEYS[T.i++],c=readSave(k);
    let same=false;try{same=!!T.raw&&JSON.stringify(c)===T.raw}catch(x){}
    if(!c||!saveOk(c)||same)continue; // empty, damaged, or the very save that failed
    T.label=label;restore(c);return;
  }
  T.first=null;T.i=0;T.label='';
  try{reset()}catch(x){console.error(x)}
  G.menu=false;G.saves=null;G.cut=null;G.talk=null;G.loot=null;G.state='title';
  noteBox('This save could not be loaded','The save is damaged, or it comes from a version of the game that this one cannot read. It has not been changed.\n\nThe game is back at the title screen. You can load another slot or begin a new game.',[['OK',null]]);
}
{const _rn=restoreNow;restoreNow=function(sv){
  let r;
  try{r=_rn.apply(this,arguments)}catch(e){restoreFallback(sv,e);return}
  const T=RESTORE_TRY;
  if(T.first){const label=T.label,kept=T.kept;T.first=null;T.i=0;T.label='';
    try{msg('That save could not be loaded. '+label[0].toUpperCase()+label.slice(1)+' was loaded in its place.','#e8a070')}catch(x){}
    noteBox('An older save was loaded','The save you chose could not be loaded, so '+label+' was loaded in its place.'+(kept?'\n\nA copy of the save that failed has been kept.':''),[['OK',null]])}
  try{for(const n of SAVE_NOTES)msg(n,'#e8a070');SAVE_NOTES=[]}catch(x){}
  return r}}
{const _r=restore;restore=function(sv){
  if(!saveOk(sv)){restoreFallback(sv,new Error('this is not a save'));return}
  try{return _r.apply(this,arguments)}catch(e){restoreFallback(sv,e)}}}
