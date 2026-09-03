#!/usr/bin/env node
// Orientasi volume axolotl_64.raw (64x64x64 RGBA Uint8, alpha=SDF, 128=permukaan)
// tanpa butuh PNG: print span okupansi per sumbu + ASCII 3 irisan tengah.
const fs = require('fs');
const p = 'public/assets/volumes/axolotl_64.raw';
const data = fs.readFileSync(p);
const N = 64;
function A(x, y, z) { return data[((z * N + y) * N + x) * 4 + 3]; }

function occ(axis, thr) {
  const out = [];
  for (let s = 0; s < N; s++) {
    let c = 0;
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) {
      let x, y, z;
      if (axis === 0) { x = s; y = a; z = b; }
      else if (axis === 1) { x = a; y = s; z = b; }
      else { x = a; y = b; z = s; }
      if (A(x, y, z) > thr) c++;
    }
    out.push(c);
  }
  return out;
}
function span(axis, thr) {
  const o = occ(axis, thr);
  let nz = [];
  o.forEach((v, i) => { if (v) nz.push(i); });
  if (!nz.length) return 'empty';
  return `slice ${nz[0]}..${nz[nz.length - 1]} span=${nz[nz.length - 1] - nz[0] + 1} sum=${o.reduce((a, b) => a + b, 0)}`;
}
console.log('== shell occupancy (alpha>110) ==');
console.log(' X:', span(0, 110));
console.log(' Y:', span(1, 110));
console.log(' Z:', span(2, 110));
console.log('== deep interior (alpha>200) ==');
console.log(' X:', span(0, 200));
console.log(' Y:', span(1, 200));
console.log(' Z:', span(2, 200));

function asciiSlice(a0c, a1c, fx, fv) {
  const ax = { x: 0, y: 1, z: 2 };
  const a0 = ax[a0c], a1 = ax[a1c], af = ax[fx];
  const lines = [];
  for (let j = 0; j < N; j++) {
    const jj = N - 1 - j; // flip: axis1 besar di atas
    let row = '';
    for (let i = 0; i < N; i++) {
      const c = [0, 0, 0];
      c[af] = fv; c[a0] = i; c[a1] = jj;
      const v = A(...c);
      let ch = ' ';
      if (v > 200) ch = '@';
      else if (v > 150) ch = '#';
      else if (v > 130) ch = 'O';
      else if (v > 115) ch = '+';
      else if (v > 105) ch = '-';
      row += ch;
    }
    lines.push(row);
  }
  return lines;
}
const jobs = [
  ['XY@z32 (kolom=X->, baris=Y up; flip) ', 'x', 'y', 'z', 32],
  ['XZ@y32 (kolom=X->, baris=Z up; flip) ', 'x', 'z', 'y', 32],
  ['YZ@x32 (kolom=Y->, baris=Z up; flip) ', 'y', 'z', 'x', 32],
];
for (const [label, a0, a1, fx, fv] of jobs) {
  console.log('\n== ' + label + '==');
  const art = asciiSlice(a0, a1, fx, fv);
  for (let r = 0; r < N; r++) {
    console.log(String(N - 1 - r).padStart(2, ' ') + ' ' + art[r]);
  }
}
