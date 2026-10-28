import json,time,pathlib,os
H=pathlib.Path(__file__).resolve().parent
Q=H/'r4_q'
def run(cmd,timeout=400):
    n=str(time.time_ns());(Q/(n+'.tmp')).write_text(json.dumps(cmd),encoding='utf-8');os.replace(Q/(n+'.tmp'),Q/(n+'.json'))
    t=time.time()
    while time.time()-t<timeout:
        o=Q/(n+'.out')
        if o.exists():
            time.sleep(.1);j=json.loads(o.read_text(encoding='utf-8'));o.unlink();return j
        time.sleep(.3)
    raise TimeoutError
def ev(js,arg=None):
    r=run({'op':'eval','js':js,'arg':arg})
    if 'err' in r: raise RuntimeError(r['err'])
    return r['r']
def shot(name,lvl,x,y,f=0,wait=1000,back=0):
    return run({'back':back,'op':'shot','path':str(H/'r4_shots'/(name+'.png')),'lvl':lvl,'x':x,'y':y,'f':f,'wait':wait})
