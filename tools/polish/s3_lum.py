import sys,glob,os
from PIL import Image, ImageStat
d=sys.argv[1];tot=[]
for f in sorted(glob.glob(d+'/*.png')):
    im=Image.open(f).convert('L');w,h=im.size
    l=ImageStat.Stat(im.crop((int(w*.2),int(h*.1),int(w*.8),int(h*.75)))).mean[0];print(os.path.basename(f)[:-4],round(l,1))
