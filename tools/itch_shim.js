/* The itch.io build keeps its pictures in a few big pack files (itch.io allows at most 1000 files in an HTML5 zip). This script runs first in the page head:
   it takes over every <img>.src that names assets/..., holds the picture back until the pack that contains it has arrived, then hands the image a blob URL.
   Each pack is used the moment it lands, so the loading bar moves as the packs arrive. Progress and any download error are written on the loading screen. */
(function(){
  var FILES=null,map={},ALLDONE=false,q=[];
  var d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
  function norm(v){if(typeof v!=='string')return null;var s=v.split('?')[0].split('#')[0],i=s.indexOf('assets/');return i>=0?s.slice(i):null}
  function note(t,err){var n=document.getElementById('ldnote');if(n)n.innerHTML=err?'<b>'+t+'</b>':t}
  function bar(pc){var f=document.getElementById('ldfill');if(f)f.style.width=pc+'%'}
  function flush(pred){var rest=[];for(var i=0;i<q.length;i++){var it=q[i];if(pred(it[2]))d.set.call(it[0],map[it[2]]||it[1]);else rest.push(it)}q=rest}
  function finish(){ALLDONE=true;flush(function(){return true})}
  Object.defineProperty(HTMLImageElement.prototype,'src',{configurable:true,enumerable:true,get:function(){return d.get.call(this)},set:function(v){
    var k=norm(v);if(!k||k.indexOf('assets/audio/')===0){d.set.call(this,v);return}
    if(ALLDONE||(FILES&&map[k])){d.set.call(this,map[k]||v);return}
    q.push([this,v,k])}});
  fetch('pack.json').then(function(r){return r.json()}).then(function(P){
    FILES=P.files;var sizes=P.sizes||[],total=0,got=[];for(var i=0;i<sizes.length;i++)total+=sizes[i];
    note('Downloading the pictures. This only happens once, please wait.');
    function prog(){var D=0;for(var i=0;i<got.length;i++)D+=got[i]||0;var T=total||D;if(!T)return;bar(Math.max(3,Math.min(97,Math.round(D/T*100))));
      note('Downloading the pictures: '+Math.round(D/T*100)+'%, '+Math.round(D/1048576)+' of '+Math.round(T/1048576)+' MB. This only happens once, please wait.')}
    // The packs come down a few at a time (a hundred megabytes of blobs all at once is too much for a tablet). A pack that fails is tried again;
    // a problem in opening one is reported with its name, so that it can be told from a problem in the game itself.
    return new Promise(function(done){
      var at=0,active=0,N=P.packs.length;
      function fail(n,why){note('A picture file could not be used: '+n+' ('+why+'). Try reloading the page.',1)}
      function get(n,i,tries,end){
        var x=new XMLHttpRequest();x.open('GET',n);x.responseType='blob';
        x.onprogress=function(e){got[i]=sizes[i]?Math.min(e.loaded,sizes[i]):e.loaded;prog()};
        function retry(why){if(tries<2){setTimeout(function(){get(n,i,tries+1,end)},600*(tries+1))}else{fail(n,why);end()}}
        x.onload=function(){
          try{
            if(x.status>=200&&x.status<300&&x.response){var b=x.response;got[i]=sizes[i]||got[i];
              for(var k in FILES){var f=FILES[k];if(f[0]===i)map[k]=URL.createObjectURL(b.slice(f[1],f[1]+f[2],f[3]))}
              flush(function(k){return !!map[k]});prog();end()}
            else retry('status '+x.status)
          }catch(e){fail(n,'opening it: '+e);console.error('pack',n,e);end()}};
        x.onerror=function(){retry('no connection')};
        x.send()}
      function next(){
        while(active<5&&at<N){(function(i){active++;get(P.packs[i],i,0,function(){active--;if(at>=N&&active===0)done();else next()})})(at++)}
        if(!N)done()}
      next()})}).then(finish).catch(function(e){console.error('pack',e);note('Could not read the picture list: '+e,1);finish()});
})();
