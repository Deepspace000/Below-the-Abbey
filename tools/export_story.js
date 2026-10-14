// node tools/export_story.js : writes STORY.md, the whole story of the game so far, from src/desert/story.js
const fs=require('fs');const src=fs.readFileSync(__dirname+'/../src/desert/story.js','utf8');
const a=src.indexOf('const STORY=['),b=src.indexOf('function storyNext');
const G={flags:{}},qSt=()=>null;
const STORY=new Function('G','qSt',src.slice(a,b)+';return STORY')(G,qSt);
let md='# Below the Abbey: the whole story so far\n\nThis is every chapter of the story as it is written in the game (the Story So Far page of the journal shows the same text), in order, so it can be read straight through and the next part worked out.\n\n';
STORY.forEach((e,i)=>{md+='## '+(i+1)+'. '+e.t+'\n\n'+e.x+'\n\n'});
fs.writeFileSync(__dirname+'/../STORY.md',md);console.log(STORY.length+' chapters written to STORY.md');
