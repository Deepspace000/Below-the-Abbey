import sys
from PIL import Image
d=sys.argv[1];names=sys.argv[3].split(',');out=sys.argv[2];cols=2
ims=[Image.open('%s/%s.png'%(d,n)).crop((0,0,960,490)).resize((640,327)) for n in names]
rows=(len(ims)+cols-1)//cols;sh=Image.new('RGB',(640*cols,327*rows))
for i,a in enumerate(ims): sh.paste(a,((i%cols)*640,(i//cols)*327))
sh.save(out)
