/* node tools/vault_check.js : compiles every <script> block of index.html (a syntax check) and, with 'src', each vault_*.js file on its own. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let m, n = 0, bad = 0;
while ((m = re.exec(html))) {
  n++;
  try { new vm.Script(m[1], { filename: 'index.html#script' + n }); } catch (e) { bad++; console.log('SYNTAX script ' + n + ': ' + e.message); const ln = (e.stack.match(/index\.html#script\d+:(\d+)/) || [])[1]; if (ln) { const L = m[1].split('\n'); console.log('  line ' + ln + ': ' + L[ln - 1].slice(0, 200)); } }
}
for (const f of fs.readdirSync(path.join(root, 'src', 'desert')).filter(f => /^vault_.*\.js$/.test(f))) {
  try { new vm.Script(fs.readFileSync(path.join(root, 'src', 'desert', f), 'utf8'), { filename: f }); } catch (e) { bad++; console.log('SYNTAX ' + f + ': ' + e.message + '\n' + (e.stack.split('\n').slice(0, 3).join('\n'))); }
}
console.log(n + ' script blocks, ' + bad + ' errors');
process.exit(bad ? 1 : 0);
