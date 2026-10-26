// node tools/gm_test.js : checks the maze of gardens (src/desert/garden_gen.js) without a browser
const fs=require('fs'),vm=require('vm');
const code=fs.readFileSync(__dirname+'/../src/desert/garden_gen.js','utf8')+';this.GMG=GMG;this.gmgBuild=gmgBuild;this.gmgPick=gmgPick;this.gmgRect=gmgRect;';
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
const {GMG,gmgBuild,gmgPick,gmgRect}=ctx;
// rooms must not overlap and keep a node apart
const R=GMG.ROOMS;let bad=0;
for(let a=0;a<R.length;a++)for(let b=a+1;b<R.length;b++){const p=R[a],q=R[b];if(p.i0<=q.i1+1&&q.i0<=p.i1+1&&p.j0<=q.j1+1&&q.j0<=p.j1+1){console.log('TOO CLOSE',p.id,q.id);bad++}}
for(const r of R){if(r.i0<0||r.j0<0||r.i1>44||r.j1>44){console.log('OUT',r.id);bad++}}
const t0=Date.now();const m=gmgPick();
console.log('seed',m.seed,'pathLen',m.pathLen,'open cells',m.open,'ms',Date.now()-t0,'doors',m.doors.length,'bad',bad);
let open=0;for(const row of m.g)for(const c of row)if(c==='.')open++;console.log('open total',open,'reached',m.open);
const lens=[];for(let s=1;s<=30;s++)lens.push(gmgBuild(s).pathLen);console.log(lens.join(' '));
const perRoom={};for(const d of m.doors){perRoom[R[d.room].id]=(perRoom[R[d.room].id]||0)+1}console.log(JSON.stringify(perRoom));
console.log(m.sdoors.map(s=>R[s.room].id+' '+s.x+','+s.y).join(' '));
fs.writeFileSync(process.env.TEMP+'/gm_maze.txt',m.g.map(r=>r.join('')).join('\n'));
