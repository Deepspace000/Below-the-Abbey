/* WORLD MAP TWEAKS. The Burial Ground, the Golden Crypt and the Ruby Maze are all in Ironhill, so they stand close round it on the world map, and no road is drawn to them. */
{const gone=r=>r.includes('graves')||r.includes('goldencrypt')||r.includes('rubymaze');
  for(let i=WORLD_ROADS.length-1;i>=0;i--)if(gone(WORLD_ROADS[i]))WORLD_ROADS.splice(i,1);
  const mv=(k,x,y)=>{const l=WORLD_LOCS.find(q=>q.k===k);if(l){l.x=x;l.y=y}};
  mv('graves',214,108);mv('goldencrypt',216,62);mv('rubymaze',262,54)}
