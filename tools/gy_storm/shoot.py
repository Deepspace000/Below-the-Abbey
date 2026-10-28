"""Stormcloud test for the Wenlock Graveyard. Run on your OWN server (python -m http.server 8355 from the repo root), ONE browser, closed at the end:
    python tools/gy_storm/shoot.py          # boots once, 8 frames over about 25 s, thunder, frame time, leaving the level, writes results.json and sheet.png here
Needs Playwright and Pillow. GY_CHROME = path of an installed Chrome if Playwright's own is missing. GY_PORT changes the port."""
import sys, time, os, json
from playwright.sync_api import sync_playwright
from PIL import Image
PORT = os.environ.get('GY_PORT', '8355')
OUT = os.path.dirname(os.path.abspath(__file__))
URL = 'http://localhost:%s/index.html?town=graveyard&lvl=84&v=%d' % (PORT, time.time())
VIEW = (0, 0, 784, 392)   # the 3D view inside a 900 x 600 page

GO_JS = """([lv,x,y,f])=>{G.menu=false;G.talk=null;G.cut=null;if(LEVEL!==lv)goToLevel(lv,{x,y,f});else{G.P.x=x;G.P.y=y;G.C.x=x;G.C.y=y}
  G.state='play';G.P.f=f;G.P.angT=(f-1)*Math.PI/2;G.C.a=G.P.angT;G.msgs=[]}"""


def go(pg, lv, x, y, f):
    pg.evaluate(GO_JS, [lv, x, y, f])


def shot(pg, name):
    pg.evaluate("()=>{G.msgs=[];G.talk=null}")
    path = os.path.join(OUT, name + '.png')
    pg.screenshot(path=path, clip={'x': VIEW[0], 'y': VIEW[1], 'width': VIEW[2], 'height': VIEW[3]})
    return path


def luma(path, box=(0, 0, 784, 285)):
    im = Image.open(path).convert('RGB').crop(box)
    px = list(im.getdata()); n = len(px)
    return sum(0.299 * r + 0.587 * g + 0.114 * b for r, g, b in px) / n


res = {}
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'], executable_path=os.environ.get('GY_CHROME') or None)
    try:
        pg = b.new_page(viewport={'width': 900, 'height': 600})
        errs = []
        pg.on('pageerror', lambda e: (errs.append('PAGE ' + str(e)), print('  PAGEERROR:', str(e)[:600], flush=True)))
        pg.on('console', lambda m: errs.append('CON ' + m.text) if m.type == 'error' else None)
        pg.on('console', lambda m: print('  console.error: %s @ %s' % (m.text[:700], m.location), flush=True) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
        pg.goto(URL, wait_until='domcontentloaded', timeout=300000)
        t_boot = time.time()
        while True:   # the machine can be very busy: poll and say what we see
            st = pg.evaluate("()=>{try{return {lv:LEVEL,st:G.state,gys:GYS.ready,ready:window.__ready||null}}catch(e){return {lv:null,st:null,gys:null,err:String(e).slice(0,80)}}}")
            print('  boot %ds' % (time.time() - t_boot), st, flush=True)
            if st['lv'] == 530 and st['st'] == 'play' and st['gys']:
                break
            if time.time() - t_boot > int(os.environ.get('GY_BOOT_S', '480')):
                raise SystemExit('boot timed out')
            pg.wait_for_timeout(10000)
        pg.wait_for_timeout(2000)
        res['sanity'] = pg.evaluate("()=>({level:LEVEL,ready:GYS.ready,pan:!!self.GYS_PAN,wx:weatherNow().n,amb:G.amb,reduced:GYS.reduced,mute:G.mute,sndAmb:SNDOPT.amb,cpf:GYS.cpf})")
        # the shape of the flash in time
        res['flash'] = pg.evaluate("()=>{let pk=0,first=-1,last=-1;for(let ms=0;ms<=400;ms++){const v=gysPulse(ms);if(v>.02){if(first<0)first=ms;last=ms}pk=Math.max(pk,v)}return {first,last,peak:pk}}")
        # sound: make the audio context, count the sources the storm makes
        pg.evaluate("()=>{audioInit();window.__src=0;if(AC){const o=AC.createBufferSource.bind(AC);AC.createBufferSource=function(){window.__src++;return o()};try{loadSounds()}catch(e){}}}")
        try:
            pg.wait_for_function("()=>typeof SMP!=='undefined'&&!!SMP.rain_loop", timeout=30000)
        except Exception:
            pass
        res['audio'] = pg.evaluate("()=>({ac:!!AC,state:AC&&AC.state,nb:!!NB,rainSample:typeof SMP!=='undefined'&&!!SMP.rain_loop})")
        # eight frames over about 25 seconds
        frames = [  # name, x, y, facing, rain, flash
            ('f1_plaza_north_calm', 35, 36, 0, -1, None), ('f2_plaza_east_calm', 35, 36, 1, -1, None),
            ('f3_rows_west_rain', 46, 20, 3, 1, None), ('f4_rows_north_rain', 46, 20, 0, 1, None),
            ('f5_FLASH_fork_south', 36, 46, 2, -1, dict(hold=130, fork=True, far=.05)), ('f6_after_east', 36, 46, 1, -1, None),
            ('f7_FLASH_first_flicker_west', 66, 35, 3, -1, dict(hold=50, fork=False, far=.8)), ('f8_gate_south_calm', 36, 46, 2, -1, None)]
        t0 = time.time(); paths = []; stamps = []; strikes0 = pg.evaluate("()=>GYS.strikes")
        for name, x, y, f, rain, fl in frames:
            go(pg, 530, x, y, f)
            pg.evaluate("(r)=>{GYS.force=r}", rain)
            pg.wait_for_timeout(1800)
            if fl:
                pg.evaluate("([h,fk,far])=>{GYS.strike=null;gysStrike({az:G.C.a+.12,far,fork:fk,delay:60});GYS.hold=h}", [fl['hold'], fl['fork'], fl['far']])
                pg.wait_for_timeout(500)
            paths.append(shot(pg, name)); stamps.append(round(time.time() - t0, 1))
            if fl:
                pg.evaluate("()=>{GYS.hold=null;GYS.strike=null}")
        res['frames'] = dict(zip([f[0] for f in frames], stamps)); res['span_s'] = stamps[-1]
        res['natural_strikes_in_span'] = pg.evaluate("(s)=>GYS.strikes-s", strikes0) - 2
        res['luma'] = {os.path.basename(pp)[:-4]: round(luma(pp), 1) for pp in paths}
        base = [os.path.join(OUT, 'base%d.png' % i) for i in range(4)]
        res['luma_before'] = [round(luma(pp), 1) for pp in base if os.path.exists(pp)]
        ims = [Image.open(pp) for pp in paths]; w, h = ims[0].size
        sheet = Image.new('RGB', (w * 2, h * 4))
        for i, im in enumerate(ims):
            sheet.paste(im, ((i % 2) * w, (i // 2) * h))
        sheet.save(os.path.join(OUT, 'sheet.png'))
        # thunder: a strike with a short delay; the audio call must follow
        pg.evaluate("()=>{GYS.force=-1;window.__t0=GYS.thunders;window.__s0=GYS.sounds;window.__a0=window.__src;GYS.strike=null;gysStrike({far:.3,fork:true,delay:.4})}")
        try:
            pg.wait_for_function("()=>GYS.thunders>window.__t0", timeout=40000)
        except Exception:
            pass
        res['thunder'] = pg.evaluate("()=>({thunders:GYS.thunders-window.__t0,rumbleCalls:GYS.sounds-window.__s0,audioSourcesCreated:window.__src-window.__a0,mute:G.mute})")
        # the rain sound starts with rain and stops without it
        pg.evaluate("()=>{GYS.force=1}"); pg.wait_for_timeout(2500)
        res['rainSound_on'] = pg.evaluate("()=>({src:!!GYS.rainSrc,gain:GYS.rainG?+GYS.rainG.gain.value.toFixed(4):null})")
        pg.evaluate("()=>{GYS.force=-1}"); pg.wait_for_timeout(9000)
        res['rainSound_off'] = pg.evaluate("()=>({src:!!GYS.rainSrc})")
        # frame time: the whole 3D view and picture with the storm and with it switched off, alternating
        res['frame_ms'] = pg.evaluate("""()=>{const out={on:[],off:[]},m=ctx.getTransform();
          for(let r=0;r<3;r++)for(const mode of ['on','off']){GYS.off=mode==='off';const t0=performance.now();for(let i=0;i<24;i++){render3D();ctx.setTransform(2,0,0,2,0,0);drawWorld()}out[mode].push((performance.now()-t0)/24)}
          GYS.off=false;ctx.setTransform(m);const f=a=>+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2);return {on:f(out.on),off:f(out.off),panoStepAvg:+GYS.ms.toFixed(2),cpf:GYS.cpf}}""")
        res['fps'] = pg.evaluate("()=>new Promise(r=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<3000)requestAnimationFrame(f);else r(+(n/3).toFixed(1))};requestAnimationFrame(f)})")
        # leaving: the crypt, then Wenlock, then back
        leave = {}
        for lv, x, y, f, nm, wait in ((531, 12, 17, 0, 'crypt', 3500), (496, 12, 31, 3, 'wenlock', 6000), (530, 35, 36, 0, 'back', 4500)):
            go(pg, lv, x, y, f); pg.wait_for_timeout(wait)
            leave[nm] = pg.evaluate("(lv)=>({level:LEVEL,rain:GYS.rain,strike:!!GYS.strike,queue:GYS.thunderQ.length,rainSrc:!!GYS.rainSrc,ambNow:G.amb,ambLevel:(LEVELS[lv]||{}).amb||0,wx:(weatherNow()||{}).n||null,kI0:LIGHTS.filter(l=>l.kI0!==undefined).length})", lv)
            if lv != 530:
                shot(pg, 'leave_' + nm)
        res['leave'] = leave
        res['errors'] = [e for e in errs if 'Failed to load resource' not in e][:12]
        res['resource_errors'] = len([e for e in errs if 'Failed to load resource' in e])
    finally:
        b.close()
json.dump(res, open(os.path.join(OUT, 'results.json'), 'w'), indent=1)
print(json.dumps(res, indent=1))
