import sys, os, json
sys.argv = ['x', 'none']
exec(open('tools/polish/bgr_test.py', encoding='utf-8').read().split("ok = {'verify'")[0])
id, X, Y = int(os.environ['DID']), int(os.environ['DX']), int(os.environ['DY'])
with sync_playwright() as p:
    b, pg, errs = boot(p)
    pg.evaluate(BUILD, id)
    r = pg.evaluate("""([id,X,Y]) => { const L = LEVELS[id], out = [];
      for (let y = Y-3; y <= Y+3; y++) { let row = ''; for (let x = X-3; x <= X+3; x++) { const ds = L.decor.filter(d => d.x === x && d.y === y && d.block); row += (L.rows[y][x] !== '.' ? '#' : ds.length ? (ds[0]._bgr ? 'B' : 'o') : '.') + ' ' } out.push(row) }
      return out.join('|') }""", [id, X, Y])
    print(r.replace('|', chr(10))); b.close()
