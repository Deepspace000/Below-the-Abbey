import json,time,pathlib,os,sys
Q=pathlib.Path(__file__).resolve().parent/'north_q'
def run(cmd,timeout=300):
    n=str(time.time_ns());(Q/(n+'.tmp')).write_text(json.dumps(cmd),encoding='utf-8');os.replace(Q/(n+'.tmp'),Q/(n+'.json'))
    t=time.time()
    while time.time()-t<timeout:
        o=Q/(n+'.out')
        if o.exists():
            time.sleep(.1);j=json.loads(o.read_text(encoding='utf-8'));o.unlink();return j
        time.sleep(.3)
    raise TimeoutError
def ev(js,arg=None): return run({'op':'eval','js':js,'arg':arg})
def shot(x,y,f=-1,path=None,wait=800): return run({'op':'shot','tx':x,'ty':y,'f':f,'path':path,'wait':wait})['r']
if __name__=='__main__':
    if sys.argv[1]=='ready': print((Q/'ready').exists())
