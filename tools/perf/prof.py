"""CPU profile of Below the Abbey in a few scenes: where does the main thread spend its time?
python prof.py [port]  ->  prints per-scene frame rate, long tasks, heap, save size and the top functions by self time."""
import sys, time, json, collections
from playwright.sync_api import sync_playwright
PORT = sys.argv[1] if len(sys.argv) > 1 else '8371'
BASE = 'http://localhost:%s/index.html' % PORT
SCENES = [('wenlock', '?town=wenlock&lvl=80', 496), ('deephollow', '?town=deephollow&lvl=72', 475),
          ('underlevel', '?town=underlevel&lvl=80', 476), ('oldhaven', '?town=oldhaven&lvl=34', None)]
INIT = """window.__lt=[];try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__lt.push([Math.round(e.startTime),Math.round(e.duration)])}).observe({type:'longtask',buffered:true})}catch(e){}
window.__fr=0;(function c(){window.__fr++;requestAnimationFrame(c)})();"""

def agg(profile, top=28):
    nodes = {n['id']: n for n in profile['nodes']}
    self_t = collections.Counter()
    samples, deltas = profile.get('samples', []), profile.get('timeDeltas', [])
    for sid, dt in zip(samples, deltas):
        n = nodes.get(sid)
        if not n: continue
        cf = n['callFrame']
        key = '%s:%s' % (cf['functionName'] or '(anon)', cf['lineNumber'] + 1) if cf['url'] else (cf['functionName'] or '(native)')
        self_t[key] += dt
    tot = sum(self_t.values()) or 1
    return [(k, round(v / 1000), round(100 * v / tot, 1)) for k, v in self_t.most_common(top)], round(tot / 1000)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 640}); pg.add_init_script(INIT)
    cdp = pg.context.new_cdp_session(pg); cdp.send('Profiler.enable'); cdp.send('Profiler.setSamplingInterval', {'interval': 500})
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)[:160]))
    out = {}
    # boot
    cdp.send('Profiler.start'); t0 = time.time()
    pg.goto(BASE + '?v=%d' % time.time(), timeout=180000)
    pg.wait_for_function('()=>window.__ready===true', timeout=180000); boot = time.time() - t0
    prof = cdp.send('Profiler.stop')['profile']; top, tot = agg(prof, 22)
    out['boot'] = {'secs': round(boot, 1), 'cpu_ms': tot, 'long': pg.evaluate('window.__lt.slice()'), 'top': top}
    pg.close()
    for name, q, lv in SCENES:
        pg = b.new_page(viewport={'width': 960, 'height': 640}); pg.add_init_script(INIT)
        cdp = pg.context.new_cdp_session(pg); cdp.send('Profiler.enable'); cdp.send('Profiler.setSamplingInterval', {'interval': 500})
        t0 = time.time(); pg.goto(BASE + q + '&v=%d' % time.time(), timeout=180000)
        try: pg.wait_for_function('(lv)=>typeof LEVEL!=="undefined"&&(lv===null?G.state==="play":LEVEL===lv)', arg=lv, timeout=180000)
        except Exception as e: out[name] = {'err': 'no arrival'}; pg.close(); continue
        arrive = time.time() - t0; pg.wait_for_timeout(4000)
        lt0 = pg.evaluate('window.__lt.length'); f0 = pg.evaluate('window.__fr')
        cdp.send('Profiler.start'); t1 = time.time()
        for k in ['w', 'w', 'd', 'w', 'w', 'a', 'w', 'w', 'd', 'd', 'w', 'w', 'a', 'w']:
            pg.keyboard.press(k); pg.wait_for_timeout(550)
        secs = time.time() - t1
        prof = cdp.send('Profiler.stop')['profile']; top, tot = agg(prof)
        info = pg.evaluate("""()=>{let sv=0,st=0;try{const a=performance.now();sv=JSON.stringify(snapshot()).length;st=performance.now()-a}catch(e){}
          return {lvl:LEVEL,decor:(G.decor||[]).length,enemies:(G.enemies||[]).length,heap:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):0,
                  save_kb:Math.round(sv/1024),save_ms:Math.round(st),spr_cache:(typeof SPR_CACHE!=='undefined'&&SPR_CACHE.size)||0}}""")
        frames = pg.evaluate('window.__fr') - f0
        out[name] = {'arrive_s': round(arrive, 1), 'fps': round(frames / secs, 1), 'cpu_ms': tot, 'wall_ms': round(secs * 1000),
                     'long': pg.evaluate('window.__lt.slice(%d)' % lt0), 'info': info, 'top': top}
        pg.close()
    b.close()
json.dump(out, open('prof_out.json', 'w'), indent=1)
for k, v in out.items():
    print('=====', k, {kk: vv for kk, vv in v.items() if kk not in ('top', 'long')})
    lt = v.get('long', []); print('  long tasks:', len(lt), 'max', max([d for _, d in lt] or [0]), 'ms, total', sum(d for _, d in lt), 'ms')
    for row in v.get('top', [])[:22]: print('   ', row)
print('errors', errs[:5])
