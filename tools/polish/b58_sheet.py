import sys
from PIL import Image
out=sys.argv[1]; fs=sys.argv[2:]
W,H=500,310
cols=2; rows=(len(fs)+1)//2
S=Image.new('RGB',(W*cols,H*rows))
for i,f in enumerate(fs):
    im=Image.open(f).crop((38,0,848,405)).resize((W,H)); S.paste(im,((i%cols)*W,(i//cols)*H))
S.save(out)
