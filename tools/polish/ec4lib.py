import json, time, pathlib, os, sys

Q = pathlib.Path(__file__).resolve().parent / 'ec4_q'
HERE = os.path.dirname(os.path.abspath(__file__))


def run(cmd, timeout=600):
    n = str(time.time_ns())
    (Q / (n + '.tmp')).write_text(json.dumps(cmd), encoding='utf-8')
    os.replace(Q / (n + '.tmp'), Q / (n + '.json'))
    t = time.time()
    while time.time() - t < timeout:
        o = Q / (n + '.out')
        if o.exists():
            time.sleep(.1)
            j = json.loads(o.read_text(encoding='utf-8'))
            o.unlink()
            return j
        time.sleep(.4)
    raise TimeoutError


def ev(jsfile, arg=None):
    return run({'op': 'eval', 'js': open(os.path.join(HERE, jsfile), encoding='utf-8').read(), 'arg': arg})


def evs(js, arg=None):
    return run({'op': 'eval', 'js': js, 'arg': arg})


def shot(name, x, y, f, wait=1200, outdir='shots_ecritic4'):
    d = os.path.join(HERE, outdir)
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name + '.png')
    r = run({'op': 'shot', 'path': p, 'tx': x, 'ty': y, 'f': f, 'wait': wait})
    return r


if __name__ == '__main__':
    # usage: ec4lib.py file.js [json arg] [maxchars]
    r = ev(sys.argv[1], json.loads(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] != '-' else None)
    print(json.dumps(r)[:int(sys.argv[3]) if len(sys.argv) > 3 else 6000])
