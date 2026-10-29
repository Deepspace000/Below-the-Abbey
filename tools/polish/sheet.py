import sys,glob,os
from PIL import Image
pat=sys.argv[1]; out=sys.argv[2]
fs=sorted(glob.glob(pat))
for k in range(0,len(fs),6):
    ims=[Image.open(f).convert('RGB').crop((0,0,790,392)) for f in fs[k:k+6]]
    W,H=ims[0].size
    s=Image.new('RGB',(W*2,H*3))
    for i,im in enumerate(ims): s.paste(im,((i%2)*W,(i//2)*H))
    s.save(out%(k//6))
    print(out%(k//6),[os.path.basename(f)[:-4] for f in fs[k:k+6]])
