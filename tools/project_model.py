#!/usr/bin/env python3
"""
DIAGNOSTIK ORIENTASI logo axolotl (GLB) — merender 3 proyeksi ortogonal
siluet voxel ke PNG agar orientasi model bisa dilihat, BUKAN ditebak.

Menghasilkan (di folder tools/):
  axo_front.png : dilihat dari depan (kamera di +Z, arah lihat -Z)
                  -> kolom = X (kanan), baris = Y (ATAS gambar = +Y / jam 12)
  axo_side.png  : dilihat dari samping (kamera di +X)
                  -> kolom = Z, baris = Y (atas = +Y)
  axo_top.png   : dilihat dari atas (kamera di +Y)
                  -> kolom = X, baris = Z (atas gambar = +Z)

Transformasi dasar: Blender Z-up -> WebGL Y-up (R_x -90°), center, skala ~0.80.
Belum ada rotasi "hadap depan" — tujuannya justru melihat orientasi natural,
supaya rotasi koreksi bisa dihitung dengan benar.

Cara pakai:  python3 tools/project_model.py
Lalu kirim 3 PNG itu / biarkan saya baca dari folder.
"""
import os, struct, zlib
import numpy as np
import trimesh

RES = 64
PITCH = 1.0 / RES

GLB_CANDIDATES = [
    '/Users/yogiprasetyasadewa/Documents/axolotl-logo.glb',
    '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/images/ui/models/axolotl-logo.glb',
]
glb = next((p for p in GLB_CANDIDATES if os.path.exists(p)), None)
if not glb:
    raise SystemExit('GLB tidak ditemukan.')

here = os.path.dirname(os.path.abspath(__file__))
print(f'→ Load {glb}')
mesh = trimesh.load(glb, force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

# Z-up (Blender) -> Y-up (WebGL)
mesh.apply_transform(trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0]))
mesh.apply_translation(-mesh.centroid)
print(f'  extents (Y-up): {np.round(mesh.extents, 3)}')

# Skala 80% dari grid (margin aman)
mesh.apply_scale(0.80 / np.max(mesh.extents))

# Voxelize solid
vox = mesh.voxelized(pitch=PITCH).fill()
mat = vox.matrix
print(f'  voxel bbox shape: {mat.shape}')

# Taruh di tengah grid 64³ (center bbox di 31.5)
grid = np.zeros((RES, RES, RES), dtype=bool)
sx, sy, sz = mat.shape
if max(sx, sy, sz) > RES:
    print(f'  ⚠ bbox {mat.shape} lebih besar dari grid 64 — turunkan skala 0.80 di atas.')
grid[(RES - sx) // 2:(RES - sx) // 2 + sx,
     (RES - sy) // 2:(RES - sy) // 2 + sy,
     (RES - sz) // 2:(RES - sz) // 2 + sz] = mat

# Okupansi per sumbu
for axis, nm in enumerate('XYZ'):
    o = grid.any(axis=tuple(a for a in range(3) if a != axis))
    idx = np.where(o)[0]
    print(f'  {nm}: okupansi slice {idx.min()}..{idx.max()} span={idx.max()-idx.min()+1} '
          f'(pusat {(idx.min()+idx.max())/2:.1f})')

# ------- render proyeksi -------
def write_gray(path, w, h, rows):
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

UP = 8
def project_and_save(name, axis_keep0, axis_keep1, axis_drop):
    """axis_keep0 = indeks sumbu yang jadi kolom (kanan) gambar,
    axis_keep1 = indeks sumbu yang jadi baris (atas gambar = nilai besar),
    axis_drop = indeks sumbu yang diproyeksikan (di-OR)."""
    img = np.zeros((RES, RES), dtype=np.uint8)
    for a in range(RES):       # kolom = axis_keep0
        for b in range(RES):   # baris  = axis_keep1
            idx = [slice(None)] * 3
            idx[axis_keep0] = a
            idx[axis_keep1] = b
            if grid[tuple(idx)].any():
                img[RES - 1 - b, a] = 255
    big = np.kron(img, np.ones((UP, UP), dtype=np.uint8))
    rows = [big[r, :].tolist() for r in range(big.shape[0])]
    out = os.path.join(here, name)
    write_gray(out, RES * UP, RES * UP, rows)
    print(f'✅ {out}')

# front: lihat dari +Z -> kanan=X(0), atas=Y(1), proyeksi drop Z(2)
project_and_save('axo_front.png', 0, 1, 2)
# side: lihat dari +X -> kanan=Z(2), atas=Y(1), proyeksi drop X(0)
project_and_save('axo_side.png', 2, 1, 0)
# top: lihat dari +Y -> kanan=X(0), atas=Z(2), proyeksi drop Y(1)
project_and_save('axo_top.png', 0, 2, 1)

print('\nSelesai. Kirim axo_front/axo_side/axo_top.png (atau biarkan saya baca dari folder tools/).')
