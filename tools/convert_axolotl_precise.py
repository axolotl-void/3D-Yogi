import numpy as np
import trimesh
import scipy.ndimage as ndi
import os
import struct
import zlib

RES = 64
PITCH = 1.0 / RES

# ============ PENGATURAN ORIENTASI ============
# Hasil diagnostik (setelah Z-up -> Y-up): X tipis (span 9), Y tinggi (47), Z lebar (52).
# [USER] Logo harus: X LEBAR (kiri-kanan), Y TINGGI (atas-bawah), Z tipis/kedalaman.
# Rotasi R_y(+90°) menukar X<->Z: X:9->52, Z:52->9, Y tetap 47. Inilah yang diminta
# "putar 90° di sumbu Y supaya Z jadi X lebar, Y tinggi, X jadi Z kedalaman".
ROT_FACE_DEG = 90.0
ROT_FACE_AXIS = [0, 1, 0]

# [USER] Roll sumbu Z 90° SEARAH JARUM JAM agar logo yang "tidur" berdiri tegak:
# fitur yang kini di kiri (insang) diputar ke atas (jam 12).
# Di render kita X->kanan & Y->atas, jadi CW (kiri->atas) = -90° terhadap sumbu Z.
# Kalau hasilnya malah insang jadi di bawah (6 jam), balik tanda jadi +90.
ROLL_DEG = -90.0
ROLL_AXIS = [0, 0, 1]

# Margin aman: paskan mesh ke 80% grid sebelum voxelization (padding anti-nabrak dinding)
SCALE_GRID_FRAC = 0.8

# GLB sumber: pakai yang dirujuk convert_axolotl_precise.py (model presisi besar).
# Fallback: model di dalam repo.
GLB_CANDIDATES = [
    '/Users/yogiprasetyasadewa/Documents/axolotl-logo.glb',
    '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/images/ui/models/axolotl-logo.glb',
]
glb_path = next((p for p in GLB_CANDIDATES if os.path.exists(p)), None)
if glb_path is None:
    raise SystemExit('Tidak menemukan axolotl-logo.glb di kedua lokasi GLB_CANDIDATES.')

print(f"→ Loading {glb_path} ...")
mesh = trimesh.load(glb_path, force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

# --- Rotasi Z-up -> Y-up (standar) ---
mesh.apply_transform(trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0]))
mesh.apply_translation(-mesh.centroid)

# --- [USER] Rotasi menghadap depan (tuning di sini kalau orientasi kurang pas) ---
print(f"→ Rotasi {ROT_FACE_DEG}° terhadap sumbu {ROT_FACE_AXIS} (agar front-view)")
mesh.apply_transform(trimesh.transformations.rotation_matrix(np.deg2rad(ROT_FACE_DEG), ROT_FACE_AXIS))
mesh.apply_translation(-mesh.centroid)

# --- [USER] Roll sumbu Z 90° CW: supaya logo berdiri tegak (insang ke jam 12) ---
print(f"→ Roll {ROLL_DEG}° terhadap sumbu {ROLL_AXIS} (CW, agar tegak)")
mesh.apply_transform(trimesh.transformations.rotation_matrix(np.deg2rad(ROLL_DEG), ROLL_AXIS))
mesh.apply_translation(-mesh.centroid)

# --- Skala dengan margin aman di kubus 64³ (sebelum dilation) ---
mesh.apply_scale(SCALE_GRID_FRAC / np.max(mesh.extents))

# --- Voxelization solid ---
voxels = mesh.voxelized(pitch=PITCH).fill()
mat = voxels.matrix
sx, sy, sz = mat.shape
if sx >= RES or sy >= RES or sz >= RES:
    raise SystemExit(f'Mesh terlalu besar: {mat.shape} >= {RES} — kecilkan skala.')

# --- DILATION AKTIF: logo axolotl berbentuk ribbon/pita tipis (3.3% okupansi, Z cuma 9 voxel).
# Partikel butuh "daging" buat nempel — volume tipis bikin cuma 20% partikel yang settle di logo.
# Dilation menebalkan bentuk (terutama sumbu Z/depth) tanpa ngerusak siluet depan.
# (Catatan: ktx2 referensi 96% solid tapi ada artefak dinding tepi, jadi regenerate lebih bersih.)
DILATE = 6
if DILATE > 0:
    import scipy.ndimage as ndi2
    # Dilation isotropik 2x tambahan di bawah (setelah Z-dilate) biar permukaan solid
    DILATE_ISO = 2

# --- EKSTRUSI SILUET (mode M/X): volume M/X asli = huruf extruded (siluet sama di tiap Z).
# Axolotl (logo datar) di-extrude sepanjang Z biar punya "daging" kayak X/M — partikel kejebak
# dari semua arah tanpa perlu kode shader khusus. EXTRUDE_Z = tebal Z dalam voxel (0 = matikan).
EXTRUDE_Z = 24

# --- Taruh di grid, pivot presisi di tengah [32,32,32] ---
# Center bbox isi ke 31.5 (tengah grid 0..63) dengan clamping agar tidak menabrak dinding.
sx, sy, sz = mat.shape
if max(sx, sy, sz) >= RES:
    raise SystemExit(f'bbox voxel {mat.shape} >= grid {RES} setelah skala {SCALE_GRID_FRAC} — kecilkan SCALE_GRID_FRAC.')

grid = np.zeros((RES, RES, RES), dtype=bool)
grid[(RES - sx) // 2:(RES - sx) // 2 + sx,
     (RES - sy) // 2:(RES - sy) // 2 + sy,
     (RES - sz) // 2:(RES - sz) // 2 + sz] = mat

# Koreksi presisi: geser isi (tanpa membungkus) agar (min+max)/2 tepat 31.5 di tiap sumbu.
def _shift_no_wrap(arr, axis, shift):
    """Geser arr sepanjang `axis` sejauh `shift`; isi yang keluar grid dibuang (tidak melingkar)."""
    if shift == 0:
        return arr
    out = np.zeros_like(arr)
    if shift > 0:
        out[shift:] = np.take(arr, range(0, arr.shape[axis] - shift), axis=axis)
    else:
        s = -shift
        out[:arr.shape[axis] - s] = np.take(arr, range(s, arr.shape[axis]), axis=axis)
    return out

def _center_axis(g, axis):
    idx = np.where(g.any(axis=tuple(a for a in range(3) if a != axis)))[0]
    if idx.size == 0:
        return g
    shift = int(round((RES - 1) / 2.0 - (idx.min() + idx.max()) / 2.0))
    return _shift_no_wrap(g, axis, shift)

grid = _center_axis(grid, 0)
grid = _center_axis(grid, 1)
grid = _center_axis(grid, 2)

# Ekstrusi siluet sepanjang Z (mode X/M: huruf extruded, siluet sama di tiap kedalaman).
# Proyeksikan isi saat ini ke bidang XY (max sepanjang Z) = siluet depan, lalu isi ulang
# slab Z setebal EXTRUDE_Z di tengah. Ini bikin "balok" kayak volume X/M asli.
if EXTRUDE_Z > 0:
    siluet = grid.any(axis=2)  # (x,y) — bentuk depan
    grid[:] = False
    z0 = (RES - EXTRUDE_Z) // 2
    grid[:, :, z0:z0 + EXTRUDE_Z] = siluet[:, :, None]
    print(f"→ Ekstrusi siluet Z: tebal {EXTRUDE_Z} voxel (z{z0}..{z0+EXTRUDE_Z})")

# Terapkan dilation (tebalkan) setelah centering — biar sumbu Z (kedalaman) nggak tipis kertas
if DILATE > 0:
    # Dilation anisotropik: tebalkan SUMBU Z (depth) lebih agresif, X/Y ringan (jaga detail insang)
    dil_struct = np.zeros((3, 3, 3), dtype=bool)
    dil_struct[1, 1, :] = True  # hanya sumbu Z (axis 2 di grid x,y,z)
    grid = ndi2.binary_dilation(grid, structure=dil_struct, iterations=DILATE)
    # tambahan dilation isotropik (DILATE_ISO)x biar permukaan solid, bukan kertas
    grid = ndi2.binary_dilation(grid, iterations=DILATE_ISO)
    # crop isi yang mungkin kebablasan ke tepi setelah dilation
    # (tidak perlu — centering sudah, dilation maks 2 dari isi yang ada margin)

occ = grid.sum()
print(f"📊 Stats: Grid={RES}x{RES}x{RES}, Occupied Voxels={occ} ({occ/(RES**3)*100:.2f}%)")

# --- [USER] Pivot terpaku di tengah grid ---
fill = np.argwhere(grid)
if fill.size:
    c = (fill.min(axis=0) + fill.max(axis=0)) / 2.0
    print(f"→ Pivot bbox objek: {np.round(c, 2)}  (target 31.5/31.5/31.5 = center 64³)")

# --- SDF: dalam = positif, luar = negatif (alpha: dalam >128 = terang) ---
dist_in = ndi.distance_transform_edt(grid) * PITCH
dist_out = ndi.distance_transform_edt(~grid) * PITCH
sdf = dist_in - dist_out

# Normal gradients (sesuai sumbu array x,y,z)
gx, gy, gz = np.gradient(sdf)
norm = np.sqrt(gx * gx + gy * gy + gz * gz) + 1e-8
nx, ny, nz = gx / norm, gy / norm, gz / norm

# Alpha: isosurface (0) -> 128, dalam > 128.
# SDF_DIV: jarak (grid unit) buat mencapai alpha 255. 0.4 = lembut (perlu 25 voxel),
# 0.12 = pekat (interior ~8 voxel langsung 255) — biar partikel yang masuk kejebak kuat.
SDF_DIV = 0.12
alpha = np.clip((sdf / SDF_DIV) * 127.5 + 128.0, 0, 255).astype(np.uint8)
# DEBUG: statistik sdf & alpha sebelum ditulis
print(f"→ DEBUG sdf: min={sdf.min():.3f} max={sdf.max():.3f} mean_in={sdf[sdf>0].mean() if (sdf>0).any() else 0:.3f}")
print(f"→ DEBUG alpha: max={alpha.max()} >200={(alpha>200).sum()} >170={(alpha>170).sum()}")

# --- Pack RGBA (x,y,z,c) lalu transpose ke memori WebGL Data3DTexture (z,y,x,c) ---
rgba = np.zeros((RES, RES, RES, 4), dtype=np.uint8)
rgba[..., 0] = np.clip((nx * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 1] = np.clip((ny * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 2] = np.clip((nz * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 3] = alpha
rgba_webgl = np.transpose(rgba, (2, 1, 0, 3)).copy(order='C')

# --- Tulis ke public & dist ---
pub_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes/axolotl_64.raw'
dist_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/dist/assets/volumes/axolotl_64.raw'
for p in (pub_path, dist_path):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    rgba_webgl.tofile(p)
    print(f"✅ RAW tersimpan: {p} ({os.path.getsize(p)} bytes)")

# ================= VERIFIKASI: cek_bentuk.png + statistik =================
def write_png_gray(path, w, h, rows):
    def chunk(tag, payload):
        return (struct.pack('>I', len(payload)) + tag + payload +
                struct.pack('>I', zlib.crc32(tag + payload) & 0xFFFFFFFF))
    raw = b''.join(b'\x00' + bytes(r) for r in rows)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 0, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)

# ===== Verifikasi orientasi & siluet dari ARRAY ASLI rgba (x,y,z,c) =====
# rgba diindeks [x, y, z] (sumbu fisik), jadi "XY@z=32" = rgba[:, :, 32, 3].
Z = 32
sl = rgba[:, :, Z, 3]  # (x,y) alpha — kolom = x, baris = y
# span per sumbu dari grid (x,y,z)
def span_axis(g, ax):
    o = g.any(axis=tuple(a for a in range(3) if a != ax))
    idx = np.where(o)[0]
    return (idx.min(), idx.max(), idx.max() - idx.min() + 1) if idx.size else (None, None, 0)

sx = span_axis(grid, 0)
sy = span_axis(grid, 1)
sz = span_axis(grid, 2)
print(f"\n== Span voxel grid (x,y,z) ==")
print(f"   X {sx[0]}..{sx[1]} lebar {sx[2]} | Y {sy[0]}..{sy[1]} tinggi {sy[2]} | Z {sz[0]}..{sz[1]} kedalaman {sz[2]}")
print(f"   (harapannya X lebar >30, Y tinggi >30, Z tipis <20 setelah R_y +90°)")
center = ((sx[0] + sx[1]) / 2, (sy[0] + sy[1]) / 2, (sz[0] + sz[1]) / 2)
print(f"   center bbox: {tuple(round(v, 2) for v in center)}  (target 31.5/31.5/31.5)")

interior = int((sl > 128).sum())
xs = np.where((sl > 128).any(axis=1))[0]   # kolom x yang terisi
ys = np.where((sl > 128).any(axis=0))[0]   # baris y yang terisi
print(f"\n== Slice XY@Z={Z}: alpha>128 = {interior}/{RES*RES} ({100.0*interior/(RES*RES):.2f}%)")
if xs.size:
    print(f"   bbox isi di slice -> x {xs[0]}..{xs[-1]} (lebar {xs[-1]-xs[0]+1}), "
          f"y {ys[0]}..{ys[-1]} (tinggi {ys[-1]-ys[0]+1})")

# Gambar XY@Z=32: kolom=X (kiri->kanan), baris=Y (atas gambar = y besar)
UP = 8
rows_v = []
for yy in range(RES - 1, -1, -1):
    row = []
    for xx in range(RES):
        v = int(sl[xx, yy])  # sl[x,y] — pastikan indeks benar
        row.append(v)
    rows_v.extend([np.repeat(np.array(row, dtype=np.uint8), UP)] * UP)
out_png = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/cek_bentuk.png'
write_png_gray(out_png, RES * UP, RES * UP, rows_v)
print(f"✅ cek_bentuk.png -> {out_png}  (XY slice Z={Z}, alpha, upscale x{UP})")
