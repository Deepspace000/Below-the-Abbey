"""World map coverage check.  python tools/worldmap_check.py [--port 8372] [--all]
Lists every level id that has a name (LEVELS, the lazy builders, LEVEL_NAMES) and every id registered in jumpFromUrl's AREAS table, and says whether the
world map shows it: as a symbol (a WORLD_LOCS place whose lv list holds it), in the atlas of mazes and dungeons (maps_world_west.js), or as a room inside
a place that has a symbol. Nothing but names that are missing is an error (exit code 1).  Starts its own http.server on the port if nothing answers there
and stops it by its own process handle at the end."""
import re, sys, time, json, socket, subprocess, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
port = int(sys.argv[sys.argv.index('--port') + 1]) if '--port' in sys.argv else 8372
show_all = '--all' in sys.argv
srv = None
s = socket.socket()
try:
    s.connect(('127.0.0.1', port)); s.close()
except OSError:
    srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(port)], cwd=str(ROOT), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL); time.sleep(1.5)
# AREAS: the table in jumpFromUrl (the first number of each entry is the level); three entries are getters
html = (ROOT / 'index.html').read_text(encoding='utf8')
m = re.search(r"const AREAS=\{(.*?)\};\n", html, re.S)
areas = {k: int(v) for k, v in re.findall(r"(\w+):\[(\d+),", m.group(1))}
areas.update({'deephollow': 475, 'boatdock': 475, 'blackswill': 476})
JS = """()=>{const ids=new Set(Object.keys(LEVELS).map(Number));if(typeof KH_LAZY!=='undefined')Object.keys(KH_LAZY).forEach(k=>ids.add(+k));Object.keys(LEVEL_NAMES).forEach(k=>ids.add(+k));
  const out=[];for(const i of [...ids].sort((a,b)=>a-b)){const nm=LEVEL_NAMES[i]||(LEVELS[i]&&LEVELS[i].name)||null;out.push([i,nm,wmwCoverage(i)])}
  return {rows:out,cov:(a)=>0}}"""
JS2 = """(ids)=>ids.map(i=>[i,wmwCoverage(i)])"""
try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader']); pg = b.new_page(viewport={'width': 960, 'height': 640})
        errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('http://localhost:%d/index.html?v=%d' % (port, time.time()), timeout=90000, wait_until='domcontentloaded')
        pg.wait_for_function('()=>typeof wmwCoverage==="function"&&typeof LEVELS!=="undefined"&&Object.keys(LEVELS).length>50', timeout=90000); pg.wait_for_timeout(3000)
        rows = pg.evaluate("""()=>{const ids=new Set(Object.keys(LEVELS).map(Number));if(typeof KH_LAZY!=='undefined')Object.keys(KH_LAZY).forEach(k=>ids.add(+k));Object.keys(LEVEL_NAMES).forEach(k=>ids.add(+k));
          return [...ids].sort((a,b)=>a-b).map(i=>[i,LEVEL_NAMES[i]||(LEVELS[i]&&LEVELS[i].name)||null,wmwCoverage(i)])}""")
        arows = pg.evaluate(JS2, sorted(set(areas.values())))
        b.close()
finally:
    if srv: srv.terminate()
named = [r for r in rows if r[1]]
shown = [r for r in named if r[2]]
miss = [r for r in named if not r[2]]
print('%-6s %-44s %-5s %s' % ('id', 'name', 'shown', 'how'))
for i, nm, cov in (named if show_all else miss + [r for r in named if r[2] and r[2][0] != 'interior'][:0]):
    print('%-6d %-44s %-5s %s' % (i, nm[:44], 'yes' if cov else 'NO', (cov[0] + ': ' + cov[1]) if cov else ''))
by = {}
for i, nm, cov in shown:
    by.setdefault(cov[0] + ': ' + cov[1], []).append(i)
if show_all is False:
    print('\nshown, grouped by where (use --all for one line per id):')
    for k, v in sorted(by.items(), key=lambda kv: kv[1][0]):
        print('  %-60s %d levels, %d to %d' % (k[:60], len(v), v[0], v[-1]))
print('\nAREAS (jumpFromUrl links):')
amap = dict(arows)
for k, i in sorted(areas.items(), key=lambda kv: kv[1]):
    c = amap.get(i)
    print('  %-14s %-5d %-5s %s' % (k, i, 'yes' if c else 'NO', (c[0] + ': ' + c[1]) if c else ''))
print('\n%d named ids, %d shown, %d NOT shown; %d AREAS entries, %d not shown' % (len(named), len(shown), len(miss), len(areas), sum(1 for k, i in areas.items() if not amap.get(i))))
if errs: print('page errors:', errs[:5])
sys.exit(1 if miss or any(not amap.get(i) for i in areas.values()) else 0)
