"""Wenlock walk test: flood fill from the arrival over the real level data. python tools/wl_walk.py"""
import sys, time
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8377/index.html?town=wenlock&lvl=80&v=%d' % time.time()
JS = r"""() => {
  const L = LEVELS[496], T = TERRS[496], W = L.rows[0].length, H = L.rows.length;
  const blockDecor = new Set(L.decor.filter(d => d.block && !d.found).map(d => d.x + ',' + d.y));
  const open = (x, y) => x >= 0 && y >= 0 && x < W && y < H && L.rows[y][x] === '.' && !T.block[y * W + x] && !blockDecor.has(x + ',' + y);
  const seen = new Set(), q = [[95, 50]]; seen.add('95,50');
  while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (!seen.has(k) && open(nx, ny)) { seen.add(k); q.push([nx, ny]) } } }
  const road = []; for (const k of WL.street) { const [x, y] = k.split(',').map(Number); if (!seen.has(k)) road.push(k) }
  const roadBlocked = []; for (const k of WL.street) { if (blockDecor.has(k)) roadBlocked.push(k) }
  const frontsBad = WL_DOORS.filter(d => !seen.has(d.front.x + ',' + d.front.y)).map(d => d.id + ':' + d.front.x + ',' + d.front.y);
  const npcOnRoad = L.decor.filter(d => d.npc && WL.street.has(d.x + ',' + d.y)).map(d => d.npc + '@' + d.x + ',' + d.y);
  const npcs = L.decor.filter(d => d.npc).map(d => d.npc), unreachNpc = L.decor.filter(d => d.npc && !seen.size == 0 && ![[1,0],[-1,0],[0,1],[0,-1]].some(([dx, dy]) => seen.has((d.x + dx) + ',' + (d.y + dy)))).map(d => d.npc + '@' + d.x + ',' + d.y);
  const gates = [[96, 50], [3, 50]].map(([x, y]) => seen.has(x + ',' + y));
  const wellEdge = [[45,53]].map(([x,y]) => seen.has(x+','+y));
  return {W, H, reach: seen.size, roadCells: WL.street.size, roadUnreached: road.slice(0, 20), roadUnreachedN: road.length, roadBlocked: roadBlocked.slice(0, 20), frontsBad, npcOnRoad, nNpc: npcs.length, uniqueNpc: new Set(npcs).size, unreachNpc, gates, wellEdge, houses: WL.houses.length};
}"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 900, 'height': 600})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(8000)
    r = pg.evaluate(JS)
    for k, v in r.items(): print(k, v)
    print('errors', errs)
    b.close()
