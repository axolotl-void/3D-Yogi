# Rencana: Bikin 150.000 partikel membentuk logo axolotl 3D 100%

## Akar masalah (sudah diverifikasi dari data + GLSL)

Partikel **tidak** di-pre-place di atas logo. Sistem `wF` (`13-entry-scene.js`) itu **simulasi GPU**: 150k partikel lahir **acak di kubus** `cubeSize=.65`, lalu shader komputasi tiap frame menariknya ke permukaan volume. Baca shader-nya:

```glsl
vec3 samplePos = rotMatrix * (currentPos.xyz / uCubeSize) * uVolumeScale + 0.5;
vec4 volData  = texture(tVolume, samplePos);
float dist    = (volData.a * 2.0 - 1.0) * 2.0;   // alpha .5 → 0 (permukaan)

float signForce = mix(0.0, -0.3, sign(dist) + 1.0);   // HANYA kalau dist > 0 (di DALAM)
currentVel.xyz += grad * force2 * signForce * dtRatio * invFluidStrength;
```

`signForce` **nol di luar** (dist<0). Jadi partikel di luar volume **tidak ditarik sama sekali** ke permukaan — hanya tersapu noise + pegas lemah ke posisi acak `tOrig`, lalu **dijepit jadi silinder** kecil. Hasilnya: cuma partikel yang kebetulan lahir di dalam yang nempel → "3%".

Ditambah dua masalah aset:
1. **Volume `.raw` sekarang tipis kertas** — interior (alpha>128) cuma 8.642 voxel dari 262.144 (3.3%), span **X=9 voxel** (27..35), Z=48, Y=52. ASCII memperlihatkan axolotl sedang **miring/edge-on** (profil menghadap X, tipis di Z) → hampir tak ada "dinding" yang bisa ditempeli partikel.
2. Volume **referensi** yang dulu bekerja (`axolotl_64.ktx2`): **96% solid**, shell merata keluar, span penuh di semua sumbu. Ini patokan yang harus dikejar.

## Solusi (2 bagian)

### A. Regenerasi volume — tebal + menghadap kamera (seperti referensi)
Ubah `tools/convert_axolotl_precise.py`:
- Rotasi Z (roll) ±90° supaya sisi **lebar** axolotl menghadap kamera (bukan tipis/edge-on). Di render: X=lebar, Y=tinggi, **Z=kedalaman→jadi sumbu tipis KECIL** … tunggu, saat ini malah **X tipis** (lebarnya salah sumbu). Roll 90° di Z **menukar X dan Y**, bukan memperbaiki. Yang perlu: rotasi supaya X jadi lebar & Z jadi tipis — mirip perlakuan referensi.
- Jadikan volume **solid-tebal** ala `.ktx2`: interior penuh (bukan kontur tipis), shell alpha ~120–135 mengarah keluar. Ini yang bikin banyak voxel permukaan → banyak partikel bisa nempel, dan bentuk 3D-nya kebaca.
- Tulis ulang `axolotl_64.raw` ke `public/` + `dist/`, plus gambar verifikasi (orientasi + kepadatan).

> Catatan penting: karena perubahan orientasi menyentuh sumbu X/Y/Z yang juga dipakai rotasi runtime, kita samakan persis dengan `.ktx2` referensi yang terbukti tampil benar.

### B. Perbaikan shader partikel — tarik partikel dari LUAR ke permukaan
Ubah fragmen komputasi `wF` di `13-entry-scene.js`:
- Ganti `signForce` yang hanya aktif di dalam → gaya **menuju permukaan terdekat dari dua arah**:
  - Partikel **di luar** (dist<0): didorong **ke dalam** menuju alpha 0.5.
  - Partikel **di dalam**: dibiarkan/lemah ke luar ke alpha 0.5.
  - Hasil: semua partikel bermigrasi ke **shell**, lalu berhenti (kesetimbangan di lapisan tipis sekitar isosurface) → logo solid + detail.
- Pertahankan: noise kecil buat "hidup", `uShowNoise` buat animasi assemble awal, `uInteractForce`, fluid push, dan gaya "ke posisi asal" yang lemah.
- Hasil akhir: ~100% partikel di atas permukaan logo (bukan 3%).

### C. Rebuild & verifikasi
- `scripts/assemble-app3d.mjs` → `public/App3D-*.js` (+ index ref kalau beda hash).
- Serve `localhost:3000`, buka section axolotl, screenshot, pastikan logo penuh partikel.

## File yang disentuh
- `tools/convert_axolotl_precise.py` (rotasi + solid tebal + tulis .raw)
- `dist/app3d/13-entry-scene.js` (shader partikel `wF`)
- hasil generate: `public/assets/volumes/axolotl_64.raw`, `dist/assets/volumes/axolotl_64.raw`
- hasil assemble: `public/App3D-*.js` (jangan edit manual)

## Risiko & mitigasi
- Orientasi salah lagi → verifikasi dengan PNG irisan + screenshot sebelum commit.
- Partikel jadi "gumpal" kalau gaya terlalu kuat → tuning konstanta dengan screenshot berulang.
- Tetap jaga animasi masuk (dari noise ke bentuk) biar nggak jadi teleport.
