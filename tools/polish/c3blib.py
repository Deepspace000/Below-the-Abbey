import json,time,pathlib,os
Q=pathlib.Path(__file__).resolve().parent/'c3b_q'
def run(cmd,timeout=300):
    n=str(time.time_ns());(Q/(n+'.tmp')).write_text(json.dumps(cmd),encoding='utf-8');os.replace(Q/(n+'.tmp'),Q/(n+'.json'))
    t=time.time()
    while time.time()-t<timeout:
        o=Q/(n+'.out')
        if o.exists():
            time.sleep(.1);j=json.loads(o.read_text(encoding='utf-8'));o.unlink();return j
        time.sleep(.4)
    raise TimeoutError
def ev(jsfile,arg=None):
    return run({'op':'eval','js':open(os.path.join(os.path.dirname(__file__),jsfile),encoding='utf-8').read(),'arg':arg})
