import sys
from PIL import Image
d='C:/Users/mirko/AppData/Local/Temp/d2shots/'
tag=sys.argv[1]; ids=sys.argv[2:]
ims=[Image.open(d+'%s_%s.png'%(tag,i)) for i in ids]
w,h=ims[0].size
sh=Image.new('RGB',(w*2,h*((len(ims)+1)//2)))
for k,im in enumerate(ims): sh.paste(im,((k%2)*w,(k//2)*h))
sh.save(d+'sheet_%s_%s.png'%(tag,'_'.join(ids)))
print(d+'sheet_%s_%s.png'%(tag,'_'.join(ids)))
