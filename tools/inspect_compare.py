#!/usr/bin/env python3
"""
Bandingkan volume REFERENSI (axolotl_64.ktx2 yang dulu bekerja, uncompressed RGBA8 64^3)
dengan volume BARU (axolotl_64.raw) — statistik alpha + irisan PNG biar kelihatan.

Tulis output ke /tmp/vol_* supaya bisa di-Read.
Cara pakai: python3 tools/inspect_compare.py
"""
import os
import struct
import zlib
import numpy as np

PUB = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public'
REF_KTX = PUB + '/assets/volumes/axolotl_64.ktx2'
CUR_RAW = PUB + '/assets/volumes/axolotl_64.raw'
OUT = '/tmp/vol_out'
os.makedirs(OUT, exist_ok=True)

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

def load_ktx_rgba8(p, res=64):
    d = np.fromfile(p, dtype=np.uint8)
    # payload mulai setelah header+keyvalues+dfd, 8-aligned; file 1048748 = 172 header + 1048576 px
    off = len(d) - res**3 * 4
    return d[off:off + res**3 * 4].reshape(res, res, res, 4)

def load_raw_rgba8(p, res=64):
    d = np.fromfile(p, dtype=np.uint8)
    return d[:res**3 * 4].reshape(res, res, res, 4)

def analyze(name, arr):
    print(f'\n===== {name} =====')
    a = arr[..., 3].astype(int)
    print(f'shape {a.shape}  alpha min/max {a.min()}/{a.max()}  unique {len(np.unique(a))}')
    h = np.bincount(a.ravel(), minlength=256)
    top = np.argsort(h)[::-1][:8]
    print('alpha top:', [(int(v), int(h[v])) for v in top])
    print('a==0 %d | 0<a<128 %d | ==128 %d | 129..254 %d | ==255 %d' % (
        int((a == 0).sum()), int(((a > 0) & (a < 128)).sum()), int((a == 128).sum()),
        int(((a > 128) & (a < 255)).sum()), int((a == 255).sum())))
    # RGB stats di luar vs dalam
    for ch, nm in enumerate('RGB'):
        c = arr[..., ch].astype(int)
        print(f'{nm}: overall min/max {c.min()}/{c.max()} | mean(all) {c.mean():.1f} | mean(a==0) {c[a == 0].mean():.1f} | mean(a>200) {c[a > 200].mean():.1f}')

    def span(ax):
        o = a.any(axis=tuple(i for i in range(3) if i != ax))
        idx = np.where(o)[0]
        return (int(idx.min()), int(idx.max()), int(idx.max() - idx.min() + 1)) if idx.size else None
    print('occupied spans  X(ax0)', span(0), ' Y(ax1)', span(1), ' Z(ax2)', span(2))

    # tulis irisan alpha per-z (gambar XY@z), dan bbox-min alpha terpusat di tengah z
    def slice_png(fname, field, zmid, mirror_rows=True):
        sl = field[:, :, zmid]
        # (x,y) => kolom x, baris y (y besar di atas bila mirror)
        up = 8
        rows = []
        yy = range(64)
        if mirror_rows:
            yy = range(63, -1, -1)
        for y in yy:
            row = []
            for x in range(64):
                row.append(int(sl[x, y]))
            rows.extend([np.repeat(np.array(row, dtype=np.uint8), up)] * up)
        write_png_gray(os.path.join(OUT, fname), 64 * up, 64 * up, rows)
        print('wrote', os.path.join(OUT, fname))

    # z tengah dari okupansi alpha>0, plus 3 irisan
    zs = [0, 16, 32, 48, 63]
    for z in zs:
        slice_png(f'{name}_alpha_z{z:02d}.png', a, z)
    # proyeksi max alpha ke tengah untuk lihat siluet objek (bukan SDF)
    proj = (a > 128).any(axis=2).astype(np.uint8) * 255  # (x,y)
    up = 8
    rows = []
    for y in range(63, -1, -1):
        row = [int(proj[x, y]) for x in range(64)]
        rows.extend([np.repeat(np.array(row, dtype=np.uint8), up)] * up)
    write_png_gray(os.path.join(OUT, f'{name}_occupancy_xy.png'), 64 * up, 64 * up, rows)
    print('wrote', os.path.join(OUT, f'{name}_occupancy_xy.png'))

    # centerline along x at y=32,z=32 and along y at x=32,z=32
    print('alpha x-line@y32,z32:', a[32, 32, :].tolist())
    print('alpha y-line@x32,z32:', a[32, :, 32].tolist())
    print('alpha z-line@x32,y32:', a[:, 32, 32].tolist())

print('loading ref ktx2 ...')
ref = load_ktx_rgba8(REF_KTX)
print('loading cur raw  ...')
cur = load_raw_rgba8(CUR_RAW)
analyze('REF(ktx2)', ref)
analyze('CUR(raw)', cur)
print('\nDONE ->', OUT)
