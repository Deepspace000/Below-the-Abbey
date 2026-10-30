// Quick plan checks without a browser: node tools/nt_node.js [ascii N]   (loads nt_look.js and nt_gen.js with stubs)
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = ['nt_look.js', 'nt_gen.js'].map(f => fs.readFileSync(path.join(__dirname, '..', 'src', 'desert', f), 'utf8')).join('\n');
const ctx = { console, Math, Uint8Array, Int32Array, Uint8ClampedArray, Set, Map, Object, Array, Error, JSON, performance };
vm.createContext(ctx);
vm.runInContext('function addTex(){} const TEX=[],T_TILE={},KH_DOOR={},FLOORS={},CEILS={},GY={tiles:{}};\n' + src +
  '\nthis.api={ntGen,ntLook,ntAscii:ntgAscii,ntKindOf,ntLooksDiffer,ntgBfs,NT};', ctx);
const A = ctx.api;
const mode = process.argv[2] || 'check';
if (mode === 'stats') {
  // dead ends and size statistics over floors 1..N (default 60): node tools/nt_node.js stats [N]
  const N = +process.argv[3] || 60, by = {}; let tot = { fl: 0, area: 0, open: 0, dead: 0, cl: 0, pond: 0, pf: 0 };
  for (let n = 1; n <= N; n++) {
    const look = A.ntLook(n), o = A.ntGen(n, look), W = o.W, H = o.H, a = o.G.a; let open = 0, dead = 0, sp = 0, mx = 0;
    const isO = (x, y) => x >= 0 && y >= 0 && x < W && y < H && (a[y * W + x] === 1 || (o.water && o.water.has(y * W + x)));
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { if (!a[y * W + x]) continue; open++; let c = 0; for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) if (isO(x + dx, y + dy)) c++; if (c === 1) dead++; }
    const k = look.kind; const b = by[k] || (by[k] = { fl: 0, area: 0, open: 0, dead: 0, cl: 0 }); const cl = (o.clearings || []).length;
    for (const t of [b, tot]) { t.fl++; t.area += W * H; t.open += open; t.dead += dead; t.cl += cl; }
    tot.pond += (o.ponds || []).length; if ((o.ponds || []).length) tot.pf++;
  }
  const f = t => 'floors ' + t.fl + ' avgArea ' + (t.area / t.fl).toFixed(0) + ' avgOpen ' + (t.open / t.fl).toFixed(0) + ' avgDeadEnds ' + (t.dead / t.fl).toFixed(1) + ' deadPer100open ' + (100 * t.dead / t.open).toFixed(2) + ' avgClearings ' + (t.cl / t.fl).toFixed(2);
  for (const k in by) console.log(k.padEnd(7), f(by[k]));
  console.log('ALL    ', f(tot), 'floorsWithPond', tot.pf);
} else if (mode === 'ascii') {
  const n = +process.argv[3];
  const look = A.ntLook(n), o = A.ntGen(n, look);
  console.log(look.name, look.kind, o.W + 'x' + o.H, 'maxDist', o.maxDist);
  console.log(A.ntAscii(o));
} else {
  const kinds = {}, bad = [];
  const list = []; for (let n = 1; n <= 200; n++) list.push(n); list.push(1000, 12345, 100000, 99999999, 4294967296 * 3 + 7);
  for (const n of list) {
    const t0 = performance.now(); const look = A.ntLook(n);
    let o; try { o = A.ntGen(n, look); } catch (e) { bad.push(n + ' ' + e.message); continue; }
    const dt = performance.now() - t0; kinds[look.kind] = (kinds[look.kind] || 0) + 1;
    const W = o.W, d = o.dist;
    if (o.W < 25 || o.H < 25 || o.W > 100 || o.H > 100) bad.push(n + ' size ' + o.W + 'x' + o.H);
    if (d[o.up.iy * W + o.up.ix] < 0) bad.push(n + ' up unreachable');
    if (d[o.stone.y * W + o.stone.x] < 0) bad.push(n + ' stone unreachable');
    let open = 0, unreach = 0; for (let i = 0; i < o.G.a.length; i++) if (o.G.a[i]) { open++; if (d[i] < 0) unreach++; }
    if (unreach) bad.push(n + ' unreachable open cells ' + unreach);
    if (open < 150) bad.push(n + ' tiny ' + open);
    if (o.shop) { const sx = o.shop.x0, sy = o.shop.y0; if (d[sy * W + sx] < 0) bad.push(n + ' shop unreachable'); }
    if (dt > 60) bad.push(n + ' slow ' + dt.toFixed(1));
    if (n > 1) { const p = A.ntLook(n - 1); if (p.kind === look.kind) bad.push(n + ' same kind as previous'); }
  }
  console.log('kinds', JSON.stringify(kinds)); console.log('problems', bad.length, bad.slice(0, 30));
}
