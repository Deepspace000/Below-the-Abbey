async ([up]) => {
  // the gondola ferry, stepped by hand: every bridge plane is drawn alone (the others hidden) and its box on screen measured at each step
  const upd = update, rdy = window.__ready; update = function () {}; window.__ready = false;
  const cv = ctx.canvas, W = cv.width, H = Math.round(cv.height * .7), RX = VW * 2 - 4, BY = VH * 2 - 4;
  const draw = () => { render3D(); ctx.setTransform(2, 0, 0, 2, 0, 0); ui(0); ctx.setTransform(1, 0, 0, 1, 0, 0) };
  const planes = G.decor.filter(d => d.span && /br_foot|br_sighs/.test(String(d.k)));
  const box = pd => { const keep = planes.map(d => d.k); try {
      planes.forEach(d => { d.k = 'brchk_hide' }); window.F2_DBGHIDE = /brchk_hide/; draw(); const A = ctx.getImageData(0, 0, W, H).data;
      pd.k = keep[planes.indexOf(pd)]; draw(); const B = ctx.getImageData(0, 0, W, H).data;
      let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
      for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) { const o = (y * W + x) * 4; if (Math.abs(A[o] - B[o]) + Math.abs(A[o + 1] - B[o + 1]) + Math.abs(A[o + 2] - B[o + 2]) > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y } }
      return x1 < 0 ? null : [x0, y0, x1, y1] } finally { planes.forEach((d, i) => { d.k = keep[i] }); window.F2_DBGHIDE = null } };
  const bad = [], log = [], prev = planes.map(() => null), run = planes.map(() => null);
  const name = (d, j) => String(d.k).replace('ps_f2_', '') + ' ' + j;
  try {
    f2WaterRide(up); let a0 = G.C.a;
    for (let i = 0; i < 400 && F2.ride; i++) {
      f2RideTick(.2); if (!F2.ride) break; const turn = Math.abs(G.C.a - a0) * 180 / Math.PI; a0 = G.C.a; const cx = G.C.x + .5, cy = G.C.y + .5;
      planes.forEach((d, j) => { const b = box(d), p = prev[j]; prev[j] = b; const dn = Math.abs((cx - d.span.x) * d.wd[0] + (cy - d.span.y) * d.wd[1]);
        if (b) log.push([i, j, +G.C.x.toFixed(2), +G.C.y.toFixed(2), +turn.toFixed(1), b[2] - b[0], b[3] - b[1], +dn.toFixed(2)]);
        if (!b || turn > 2) { run[j] = null; return }   // judged only while the boat is not turning and the bridge is seen
        if (p) { const cl = q => q[0] <= 2 || q[2] >= RX, w0 = p[2] - p[0], w1 = b[2] - b[0];   // no jump in width from one step to the next
          if (!cl(p) && !cl(b) && w0 >= 30 && (w1 / w0 > 1.6 || w1 / w0 < .6)) bad.push(name(d, j) + ': width ' + w0 + ' -> ' + w1 + ' at step ' + i) }
        if (b[1] <= 2 || b[3] >= BY || dn < .3) { run[j] = null; return }   // cut by the top or the foot of the picture
        const h = b[3] - b[1]; if (!run[j]) { run[j] = { h, dn, i }; return }
        const R = run[j]; if (Math.abs(R.dn - dn) / R.dn < .08) return;
        const g = (h / R.h) / (R.dn / dn);   // on a straight stretch its height grows as one over its distance; a picture sized by the wrong depth or squashed by the angle does not
        if (g > 1.6 || g < .6) { bad.push(name(d, j) + ': height ' + R.h + ' -> ' + h + ' while the distance went ' + R.dn.toFixed(2) + ' -> ' + dn.toFixed(2) + ' (steps ' + R.i + '..' + i + ')'); run[j] = { h, dn, i } } })
    }
  } finally { update = upd; window.__ready = rdy }
  return { bad, log } }
