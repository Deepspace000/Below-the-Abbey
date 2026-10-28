p = 'src/desert/blight58_polish.js'
s = open(p, encoding='utf-8').read()
# sign for the wall stairs
sign = '''/* the wall stairs of Lanternrest lead up to a wall walk that is closed: a board says so, so that nobody looks for a way up */
khNpc('b58_wallsign','Notice at the wall stair','greensign',()=>say('A board nailed above the wall stair: WALL WALK. SENTRIES ONLY. BY ORDER OF CAPT. MARSH. The stair is chained shut at the top, and a sentry stands guard at the foot.',[BYE]));
'''
s = s.replace("/* ----- the Bone Orchard ----- */", sign + "/* ----- the Bone Orchard ----- */", 1)
s = s.replace("  // stores and carts:", """  for(const [x,y] of [[22,15],[66,15],[22,40],[66,40]]){const sx=x+(x<40?2:-2);if(L.rows[y][sx]==='.'&&!occ.has(sx+','+y)){L.decor.push({k:'greensign',x:sx,y,block:true,solid:1,npc:'b58_wallsign',deco:false,sc:.8});occ.add(sx+','+y)}}
  // stores and carts:""", 1)
# lit window pools in front of the buildings
s = s.replace("  b58Wheel(L,occ,", "  for(const [x,y] of [[38,23],[42,23],[62,28],[66,28],[70,15],[72,15]])b58Light(L,x,y,[1.5,1.0,.5]);\n  b58Wheel(L,occ,", 1)
s = s.replace("  for(const [x,y] of [[39,30],[43,30],[39,26],[43,26]])", "  for(const [x,y] of [[53,22],[56,22],[21,46],[23,46],[24,16],[28,16]])b58Light(L,x,y,[1.4,1.05,.6]);\n  for(const [x,y] of [[39,30],[43,30],[39,26],[43,26]])", 1)
open(p, 'w', encoding='utf-8').write(s)
