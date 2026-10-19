/* ==========================================================================
   OLDHAVEN (level 305, the city, 150 x 150 cells): one illuminated sheet painted by several section artists, each in their own file, in order.
   A section file does   MPOH.push({order:N, name:'castle', paint(x,L,api,fit){ ... }})   and paints only its own part of the city onto the 480x320 context x
   (cells to sheet: fit.X(cx), fit.Y(cy), fit.s = pixels per cell). Order 0 is the base (sea, coast, wall ring, main roads, title, key, notes, compass); sections are 10 and up.
   ========================================================================== */
const MPOH=[];
mplInstall({name:'oldhaven',levels:[305],foot:'You are the yellow arrow. Oldhaven, the king’s city.',draw(c,x,L,api){
  const fit=api.fit(L.rows[0].length,L.rows.length);MPOH.sort((a,b)=>a.order-b.order);
  for(const s of MPOH){x.save();try{s.paint(x,L,api,fit)}catch(e){console.error('Oldhaven map section '+s.name,e)}x.restore()}}});
