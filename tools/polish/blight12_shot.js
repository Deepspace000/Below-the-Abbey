async () => {
  for(let i=0;i<60&&!(LEVEL===9610||LEVEL===9620);i++) await new Promise(r=>setTimeout(r,500));
  return {lvl:LEVEL,P:G.P}
}
