#!/usr/bin/env python3
"""
Tiga irisan tengah ortogonal dari axolotl_64.raw (RGBA 64^3) -> 3 PNG.
Tujuan: lihat orientasi model di tiap bidang agar bisa memilih rotasi
yang membuatnya tampak front-view.

Konvensi gambar (TIDAK di-flip, agar konsisten dengan ruang data):
  - pixel = channel Alpha (0..255). Objek nyata (yg kamu lihat tadi sebagai
    batang+cabang terang) = TERANG (>128). Kosong = gelap.
  - nama file menunjukkan bidangnya:
      cek_XY_z32.png : kolom = sumbu X (kiri->kanan = X naik),
                       baris = sumbu Y (atas->bawah = Y naik), z dipatok 32
      cek_XZ_y32.png : kolom = sumbu X (kiri->kanan = X naik),
                       baris = sumbu Z (atas->bawah = Z naik), y dipatok 32
      cek_YZ_x32.png : kolom = sumbu Y (kiri->kanan = Y naik),
                       baris = sumbu Z (atas->bawah = Z naik), x dipatok 32
"""
import os, struct, zlib, sys

W = H = D = 64
S = 8

here = os.path.dirname(os.path.abspath(__file__))
raw_path = None
for c in ["public/assets/volumes/axolotl_64.raw",
          "assets/volumes/axolotl_64.raw",
          "axolotl_64.raw",
          os.path.join(here, "public/assets/volumes/axolotl_64.raw")]:
    p = c if os.path.isabs(c) else os.path.join(here, c)
    if os.path.exists(p):
        raw_path = p
        break
if raw_path is None:
    sys.exit("axolotl_64.raw tidak ketemu — jalankan dari igloo-local/ atau public/")

data = open(raw_path, "rb").read()[:W * H * D * 4]
print(f"file : {raw_path}  ({len(data)} bytes)")

def A(x, y, z):
    return data[((z * H + y) * W + x) * 4 + 3]

def alpha_slice(axis0, axis1, fixed_axis, fixed_val):
    """axis0/axis1: nama sumbu ('x'/'y'/'z') untuk kolom & baris gambar."""
    ax = {'x': 0, 'y': 1, 'z': 2}
    a0, a1 = ax[axis0], ax[axis1]
    af = ax[fixed_axis]
    out = [[0] * W for _ in range(H)]
    for i in range(W):      # kolom = axis0
        for j in range(H):  # baris = axis1
            c = [0, 0, 0]
            c[af] = fixed_val
            c[a0] = i
            c[a1] = j
            out[j][i] = A(*c)
    return out

def interior_stats(slc):
    n = sum(1 for row in slc for v in row if v > 128)
    xs = [i for row in slc for i, v in enumerate(row) if v > 128]
    ys = [j for j, row in enumerate(slc) for v in row if v > 128]
    if not xs:
        return n, None
    return n, (min(xs), max(xs), min(ys), max(ys))  # xmin,xmax,ymin,ymax

def write_png(path, slc):
    def chunk(tag, payload):
        return (struct.pack(">I", len(payload)) + tag + payload
                + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF))
    ow, oh = W * S, H * S
    raw = b""
    for r in range(oh):
        y = r // S
        raw += b"\x00" + b"".join(bytes([slc[y][x]]) * S for x in range(W))
    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", ow, oh, 8, 0, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)

def occ(axis):
    out = []
    for s in range(W):
        c = 0
        for a in range(H):
            for b in range(D):
                if axis == 0: x, y, z = s, a, b
                elif axis == 1: x, y, z = a, s, b
                else: x, y, z = a, b, s
                if A(x, y, z) > 128:
                    c += 1
        out.append(c)
    return out

print("\n== Okupansi interior (alpha>128) per irisan, tiap sumbu ==")
for name, o in (('X', occ(0)), ('Y', occ(1)), ('Z', occ(2))):
    nz = [i for i, v in enumerate(o) if v]
    span = nz[-1] - nz[0] + 1 if nz else 0
    peak = max(o) if o else 0
    peak_idx = [i for i, v in enumerate(o) if v == peak]
    print(f"  {name}: span={span} (slice {nz[0] if nz else '-'}..{nz[-1] if nz else '-'}) "
          f"sum={sum(o)} peak={peak}@{peak_idx}")

print("\n== Menulis 3 irisan tengah ==")
jobs = [
    ("cek_XY_z32.png", "XY", 'x', 'y', 'z', 32),
    ("cek_XZ_y32.png", "XZ", 'x', 'z', 'y', 32),
    ("cek_YZ_x32.png", "YZ", 'y', 'z', 'x', 32),
]
for fname, label, a0, a1, fx, fv in jobs:
    slc = alpha_slice(a0, a1, fx, fv)
    n, bb = interior_stats(slc)
    p = os.path.join(here, fname)
    write_png(p, slc)
    bbstr = f"  bbox objek x:{bb[0]}..{bb[1]} y:{bb[2]}..{bb[3]}" if bb else "  (kosong)"
    print(f"  {fname}: objek {n}/{W*H} voxel ({100.0*n/(W*H):.1f}%){bbstr}")
