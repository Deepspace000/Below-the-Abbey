// node tools/wm_test.js : makes the four mazes of the well dungeon and prints what it finds (no browser)
const fs=require('fs'),vm=require('vm');
const src=['wellmaze_gen.js','wellmaze_specs.js'].map(f=>fs.readFileSync(__dirname+'/../src/desert/'+f,'utf8')).join('\n');
const ctx={console,WM:{},WK:{}};vm.createContext(ctx);
vm.runInContext(src+';this.WM=WM;this.WMG=WMG',ctx);
const WM=ctx.WM;
WM.M.forEach((M,k)=>{console.log('level',k,'seed',M.seedUsed,'floors',M.floors,'reached',M.reached,'rooms',M.rooms.map(r=>r.id).join(','),'up',JSON.stringify(M.up),'down',JSON.stringify(M.down),'arrive',JSON.stringify(M.arrive));
  const g=M.g.map(r=>r.join('').replace(/#/g,'█').replace(/\./g,' '));if(process.argv[2]==='map'||process.argv[2]==String(k))console.log(g.join('\n'))});
