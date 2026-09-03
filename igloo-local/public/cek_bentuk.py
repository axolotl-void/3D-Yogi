#!/usr/bin/env python3
"""
One-shot: baca public/assets/volumes/axolotl_64.raw (RGBA 64x64x64, Uint8),
ambil irisan tengah Z=32, simpan channel Alpha sebagai cek_bentuk.png (grayscale 8-bit).

Alpha = signed distance ternormalisasi [0,1] (byte 0..255):
  permukaan SDF (dist=0)  -> a = 0.5  -> byte ~128 (abu-abu tengah)
  di dalam bentuk (dist<0) -> a > 0.5  -> byte > 128 (terang)
  di luar bentuk (dist>0)  -> a < 0.5  -> byte < 128 (gelap)

Jadi kalau raw berisi bentuk axolotl yang valid, irisan ini akan tampak seperti
siluet berisi (terang) dengan tepi abu-abu. Kalau raw noise, gambarnya statis/acak.
"""
import os, struct, zlib, sys

W = H = D = 64  # resolusi volume
S = 8           # faktor upscale nearest-neighbor untuk output (64 -> 512) agar gampang dilihat
Z_SLICE = 32

# --- cari file raw (tahan dipindah-pindah folder) ---
here = os.path.dirname(os.path.abspath(__file__))
cands = [
    "assets/volumes/axolotl_64.raw",                 # kalau script di .../public
    "public/assets/volumes/axolotl_64.raw",          # kalau script di akar proyek
    "axolotl_64.raw",
]
path = None
for c in cands:
    p = os.path.join(here, c)
    if os.path.exists(p):
        path = p
        break
if path is None:
    for c in cands:
        if os.path.exists(c):
            path = c
            break
if path is None:
    sys.exit("Tidak ketemu axolotl_64.raw — jalankan skrip dari folder proyek.")

data = open(path, "rb").read()
need = W * H * D * 4  # 1.048.576
print(f"file : {path}")
print(f"size : {len(data)} bytes  (diharapkan {need})")
if len(data) < need:
    sys.exit(f"ERROR: file terlalu kecil ({len(data)} < {need}).")
data = data[:need]

# --- indeks voxel RGBA: idx = ((z*64 + y)*64 + x)*4 + channel ---
def voxel(x, y, z):
    b = ((z * H + y) * W + x) * 4
    return data[b], data[b + 1], data[b + 2], data[b + 3]  # R,G,B,A

# --- ambil irisan Z = Z_SLICE, alpha per (x,y); dunia +y = atas gambar ---
slice_a = [[0] * W for _ in range(H)]
interior = 0
minx = miny = 64
maxx = maxy = -1
for y in range(H):
    for x in range(W):
        a = voxel(x, y, Z_SLICE)[3]
        slice_a[y][x] = a
        if a > 128:  # di dalam bentuk
            interior += 1
            minx, maxx = min(minx, x), max(maxx, x)
            miny, maxy = min(miny, y), max(maxy, y)

print(f"slice Z={Z_SLICE}: voxel dalam-bentuk (alpha>128): {interior}/{W*H} "
      f"({100.0*interior/(W*H):.1f}%)")
if interior:
    print(f"bbox isi (x: {minx}..{maxx}, y: {miny}..{maxy})  "
          f"lebar {maxx-minx+1}, tinggi {maxy-miny+1}")
    print("(kalau bbox hampir penuh 0..63 -> data menyebar merata, bukan bentuk padat)")

# --- encoder PNG grayscale 8-bit murni stdlib (tanpa Pillow) ---
def chunk(tag, payload):
    return (struct.pack(">I", len(payload)) + tag + payload
            + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF))

out_w, out_h = W * S, H * S
raw = b""
for r in range(out_h):
    y = H - 1 - (r // S)        # flip vertikal: baris gambar paling atas = world y=63
    row = b"".join(bytes([slice_a[y][x]]) * S for x in range(W))
    raw += b"\x00" + row        # filter None per scanline

png = b"\x89PNG\r\n\x1a\n"
png += chunk(b"IHDR", struct.pack(">IIBBBBB", out_w, out_h, 8, 0, 0, 0, 0))
png += chunk(b"IDAT", zlib.compress(raw, 9))
png += chunk(b"IEND", b"")

out = os.path.join(here, "cek_bentuk.png")
with open(out, "wb") as f:
    f.write(png)
print(f"OK -> {out}  ({out_w}x{out_h}, grayscale, nearest x{S})")
