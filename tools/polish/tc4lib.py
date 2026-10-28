import json,time,pathlib,os
H=pathlib.Path(__file__).resolve().parent
Q=H/'tc4_q'
def run(cmd,timeout=600):
    n=str(time.time_ns());(Q/(n+'.tmp')).write_text(json.dumps(cmd),encoding='utf-8');os.replace(Q/(n+'.tmp'),Q/(n+'.json'))
    t=time.time()
    while time.time()-t<timeout:
        o=Q/(n+'.out')
        if o.exists():
            time.sleep(.1);j=json.loads(o.read_text(encoding='utf-8'));o.unlink();return j
        time.sleep(.3)
    raise TimeoutError
def ev(jsfile,arg=None):
    p=jsfile if os.path.isabs(jsfile) else str(H/jsfile)
    return run({'op':'eval','js':open(p,encoding='utf-8').read(),'arg':arg})
def evs(js,arg=None):
    for k in range(4):
        r=run({'op':'eval','js':js,'arg':arg})
        if not (r.get('err') and 'Permission' in r['err']):break
        time.sleep(1)
    return r
def shot(name,x,y,f=None,wait=1100):
    for k in range(4):
        r=run({'op':'shot','path':str(H/'tc4_shots'/(name+'.png')),'tx':x,'ty':y,'f':f,'wait':wait})
        if not (r.get('err') and 'Permission' in r['err']):break
        time.sleep(1)
    return r
def shotat(name,x,y,f,wait=1100):
    for k in range(4):
        r=run({'op':'shotat','path':str(H/'tc4_shots'/(name+'.png')),'x':x,'y':y,'f':f,'wait':wait})
        if not (r.get('err') and 'Permission' in r['err']):break
        time.sleep(1)
    return r
