
window.LOAD={t:0,d:0,req:[],dn:{}};
/* the loading bar goes by megabytes when the size list (assetsizes.json, written by tools/stamp.py) has arrived: 'Loading the pictures: 40%, 33 of 82 MB'. The itch.io build keeps its own counter (its pictures are packed) and has no size list, so it is left alone. */
fetch('assetsizes.json?v='+Date.now()).then(function(r){return r.ok?r.json():null}).then(function(j){if(j){window.__SZ=j;ldUpdate()}}).catch(function(){});
function ldUpdate(){var f=document.getElementById('ldfill'),SZ=window.__SZ;
  if(SZ&&LOAD.req.length){var T=0,D=0;for(var i=0;i<LOAD.req.length;i++){var k=LOAD.req[i],z=SZ[k]||0;T+=z;if(LOAD.dn[k])D+=z}
    if(T>0){var pc=Math.max(3,Math.min(96,Math.round(D/T*100)));if(f)f.style.width=pc+'%';var n=document.getElementById('ldnote');if(n&&!window.__ready)n.innerHTML='Loading the pictures: '+Math.round(D/T*100)+'%, '+(D/1048576).toFixed(1)+' of '+(T/1048576).toFixed(1)+' MB. The first visit downloads everything, so please wait.';return}}
  if(f&&LOAD.t)f.style.width=Math.max(3,Math.min(96,Math.round(LOAD.d/LOAD.t*100)))+'%'}
function ldHide(){var e=document.getElementById('loading');if(!e)return;var f=document.getElementById('ldfill');if(f)f.style.width='100%';e.classList.add('gone');setTimeout(function(){if(e.parentNode)e.parentNode.removeChild(e)},800)}
function ldNote(t){var n=document.getElementById('ldnote');if(n)n.innerHTML=t}
setTimeout(function(){if(!window.__ready)ldNote('Still loading. The first visit downloads all the pictures, so please wait a little.')},12000);
function ldEsc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function ldWhy(m,where,stack){return '<b>Something went wrong while loading:</b><br>'+ldEsc(String(m||'a file would not load').slice(0,160))+'<br><span style="font-size:.8em;opacity:.8">'+ldEsc((where||'')+' '+String(stack||'').split('\n').slice(0,4).join(' | ').slice(0,260))+'</span><br>Try reloading the page.'}
addEventListener('error',function(e){if(window.__ready)return;ldNote(ldWhy(e.message,(e.filename||'').split('/').pop().split('?')[0]+':'+(e.lineno||0)+':'+(e.colno||0),e.error&&e.error.stack))});
addEventListener('unhandledrejection',function(e){if(window.__ready)return;var r=e.reason;ldNote(ldWhy((r&&r.message)||r,'',r&&r.stack))});
