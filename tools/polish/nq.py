import sys,json,os,time,glob
Q=os.path.join(os.path.dirname(os.path.abspath(__file__)),'north_q')
def call(c,timeout=300):
    n=str(int(time.time()*1000)); open(os.path.join(Q,n+'.tmp'),'w').write(json.dumps(c)); os.rename(os.path.join(Q,n+'.tmp'),os.path.join(Q,n+'.json'))
    o=os.path.join(Q,n+'.out'); t=time.time()
    while not os.path.exists(o):
        time.sleep(.3)
        if time.time()-t>timeout: return 'TIMEOUT'
    time.sleep(.1); r=json.load(open(o)); os.remove(o); return r
def wait_ready():
    while not os.path.exists(os.path.join(Q,'ready')): time.sleep(1)
if __name__=='__main__':
    wait_ready()
    if sys.argv[1]=='eval': print(json.dumps(call({'op':'eval','js':open(sys.argv[2]).read()})))
    elif sys.argv[1]=='shot':
        for s in sys.argv[3:]:
            v=[int(a) for a in s.split(',')]; r=call({'op':'shot','path':sys.argv[2]+'_%d_%d.png'%(v[0],v[1]),'tx':v[0],'ty':v[1],'f':v[2] if len(v)>2 else -1}); print(v,r['r'] if 'r' in r else r)
