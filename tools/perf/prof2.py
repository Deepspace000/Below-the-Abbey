"""Who calls the expensive canvas functions? One scene, CPU profile, native canvas time grouped by the JS caller (two levels up).
python prof2.py <port> <query>"""
import sys, time, collections
from playwright.sync_api import sync_playwright
PORT, Q = sys.argv[1], sys.argv[2]
NATIVE = {'drawImage', 'getImageData', 'putImageData', 'fillRect', 'fillText', 'strokeText', 'measureText', 'createLinearGradient', 'createRadialGradient', 'fill', 'stroke', 'clip', 'save', 'restore'}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': 960, 'height': 640})
    pg.goto('http://localhost:%s/index.html%s&v=%d' % (PORT, Q, time.time()), timeout=240000)
    pg.wait_for_function('()=>window.__ready===true&&G.state==="play"', timeout=240000); pg.wait_for_timeout(6000)
    cdp = pg.context.new_cdp_session(pg); cdp.send('Profiler.enable'); cdp.send('Profiler.setSamplingInterval', {'interval': 400}); cdp.send('Profiler.start')
    for k in ['a', 'd', 'a', 'd', 'a', 'd', 'a', 'd']:
        pg.keyboard.press(k); pg.wait_for_timeout(900)
    prof = cdp.send('Profiler.stop')['profile']
    calls = pg.evaluate("""()=>{const c={};for(const n of ['drawImage','getImageData','putImageData','fillText'])c[n]=0;const P=CanvasRenderingContext2D.prototype,o={};
      for(const n in c){o[n]=P[n];P[n]=function(){c[n]++;return o[n].apply(this,arguments)}}
      return new Promise(r=>{const f0=window.__fr0||0;let fr=0;const tick=()=>{fr++;if(fr<30)requestAnimationFrame(tick);else{for(const n in o)P[n]=o[n];for(const n in c)c[n]=Math.round(c[n]/30);r(c)}};requestAnimationFrame(tick)})}""")
    b.close()
nodes = {n['id']: n for n in prof['nodes']}; parent = {}
for n in prof['nodes']:
    for ch in n.get('children', []): parent[ch] = n['id']
def name(n):
    cf = n['callFrame']; return '%s:%s' % (cf['functionName'] or '(anon)', cf['lineNumber'] + 1) if cf['url'] else (cf['functionName'] or '(native)')
by = collections.Counter(); tot = 0
for sid, dt in zip(prof['samples'], prof['timeDeltas']):
    n = nodes.get(sid); tot += dt
    if not n or n['callFrame']['functionName'] not in NATIVE or n['callFrame']['url']: continue
    p1 = nodes.get(parent.get(sid)); p2 = nodes.get(parent.get(p1['id'])) if p1 else None
    by['%s <- %s <- %s' % (n['callFrame']['functionName'], name(p1) if p1 else '?', name(p2) if p2 else '?')] += dt
print('total sampled ms', round(tot / 1000))
for k, v in by.most_common(30): print(round(v / 1000), 'ms', round(100 * v / tot, 1), '%', k)
print('canvas calls per frame:', calls)
