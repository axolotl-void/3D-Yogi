#!/usr/bin/env node
// Analisis RGBA8 64^3 volume. Arg: file [pixelByteOffset] [label]
const fs = require('fs');
const file = process.argv[2];
const PIXOFF = parseInt(process.argv[3] || '0', 10);
const label = process.argv[4] || file;
const buf = fs.readFileSync(file);
const npix = 64 * 64 * 64;
const p = buf.subarray(PIXOFF, PIXOFF + npix * 4);
if (p.length < npix * 4) { console.log('NOT ENOUGH PIXELS', p.length); process.exit(1); }

const hist = new Array(256).fill(0);
let mn = 255, mx = 0;
const re = { r: 0, g: 0, b: 0, n: 0 }, rs = { r: 0, g: 0, b: 0, n: 0 };
for (let i = 0; i < npix; i++) {
  const a = p[i * 4 + 3]; hist[a]++;
  if (a < mn) mn = a; if (a > mx) mx = a;
  if (a === 0) { re.r += p[i * 4]; re.g += p[i * 4 + 1]; re.b += p[i * 4 + 2]; re.n++; }
  if (a > 200) { rs.r += p[i * 4]; rs.g += p[i * 4 + 1]; rs.b += p[i * 4 + 2]; rs.n++; }
}
console.log(`===== ${label} =====`);
console.log(`file=${file} totalBytes=${buf.length} pixelByteOffset=${PIXOFF} npix=${npix}`);
console.log(`alpha min=${mn} max=${mx} unique=${hist.filter(x => x > 0).length}`);
console.log('top:', [...hist.keys()].map(v => [v, hist[v]]).sort((x, y) => y[1] - x[1]).slice(0, 14).map(x => `${x[0]}:${x[1]}`).join('  '));
const C = (lo, hi) => { let n = 0; for (let i = 0; i < npix; i++) { const a = p[i * 4 + 3]; if (a >= lo && a <= hi) n++; } return n; };
console.log(`a==0:${C(0, 0)}  1..127:${C(1, 127)}  ==128:${C(128, 128)}  129..254:${C(129, 254)}  ==255:${C(255, 255)}`);
if (re.n) console.log(`RGBmean a==0 : R=${(re.r / re.n).toFixed(1)} G=${(re.g / re.n).toFixed(1)} B=${(re.b / re.n).toFixed(1)} n=${re.n}`);
if (rs.n) console.log(`RGBmean a>200: R=${(rs.r / rs.n).toFixed(1)} G=${(rs.g / rs.n).toFixed(1)} B=${(rs.b / rs.n).toFixed(1)} n=${rs.n}`);

function occFastest(fast) { // fast index 0=x,1=y,2=z => linear i counts fastest first
  const order = [fast, (fast + 1) % 3, (fast + 2) % 3];
  const sp = [[], [], []];
  for (let i = 0; i < npix; i++) {
    let r = i; const c = [0, 0, 0];
    for (let k = 0; k < 3; k++) { c[order[k]] = r % 64; r = (r / 64) | 0; }
    if (p[i * 4 + 3] > 128) for (let k = 0; k < 3; k++) sp[k].push(c[k]);
  }
  return sp.map(s => s.length ? `${Math.min(...s)}..${Math.max(...s)}` : 'none');
}
for (const f of [0, 1, 2]) {
  const axes = f === 0 ? 'x-fastest' : f === 1 ? 'y-fastest' : 'z-fastest';
  const names = ['a', 'b', 'c'];
  const o = occFastest(f);
  console.log(`occ(a>128) ${axes}  as order [${names[0]}](fast)=${o[0]}  [${names[1]}]=${o[1]}  [${names[2]}]=${o[2]}`);
}

// line through center varying fast axis, both under (fastest=assume) and print
function lineCenter(fast, varAxis) {
  // coordinate (varAxis varies 0..63), others at 32
  const order = [fast, (fast + 1) % 3, (fast + 2) % 3];
  const out = [];
  for (let v = 0; v < 64; v++) {
    const c = [32, 32, 32]; c[varAxis] = v;
    // linear: count by order
    let lin = 0, mul = 1;
    for (let k = 0; k < 3; k++) { lin += c[order[k]] * mul; mul *= 64; }
    out.push(p[lin * 4 + 3]);
  }
  return out;
}
console.log('alpha along x @y32z32 (fast=x):', lineCenter(0, 0).join(','));
console.log('alpha along x @y32z32 (fast=z):', lineCenter(2, 0).join(','));
console.log('alpha along z @x32y32 (fast=x):', lineCenter(0, 2).join(','));
