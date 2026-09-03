#!/usr/bin/env python3
"""
INSPEKSI ENCODING FILE VOLUME REFERENSI yang terbukti bekerja.

Tujuan: ketahui SEMANTIK byte RGBA yang dipakai runtime agar generator axolotl
bisa menyamai 100%.

Cara pakai:  python3 tools/inspect_volume_ref.py <file.ktx2|file.raw|file.bin> [dims]
Dimensi default 64x64x64. Untuk .bin gmail (RGBA16?) lewatkan — kita cek raw & ktx2 dulu.
"""
import struct
import sys
import numpy as np

KTX2_SS = {0: 'NONE', 1: 'ETC1S', 2: 'ZSTD', 3: 'ZLIB'}

def parse_ktx2_header(d):
    if d[:12] != b'\xabKTX 20\xbb\r\n\x1a\n':
        return None
    (vk, tw, pw, ph, pd, lay, face, lvl, ss) = struct.unpack_from('<IIIIIIIII', d, 12)
    (dfdo, dfdl, kvdo, kvdl) = struct.unpack_from('<IIII', d, 48)
    return dict(vk=vk, tw=tw, dims=(pw, ph, pd), lay=lay, face=face, lvl=lvl,
                ss=ss, dfdo=dfdo, dfdl=dfdl, kvdo=kvdo, kvdl=kvdl)

def report(name, arr3d, label):
    """arr3d: numpy uint8 (X,Y,Z,4) sudah dalam urutan array numpy apa pun — kita analisis per kanal."""
    print(f"\n########## {label}  ({name}) ##########")
    a = arr3d[..., 3]  # alpha channel
    r = arr3d[..., 0]
    g = arr3d[..., 1]
    b = arr3d[..., 2]
    print(f"shape={a.shape}  min/max alpha = {a.min()}/{a.max()}")
    # histogram alpha (contoh)
    hist = np.bincount(a.ravel(), minlength=256)
    top = np.argsort(hist)[::-1][:6]
    print("alpha histogram top values:", [(int(v), int(hist[v])) for v in top])

    # nilai di sudut grid (luar/empty)
    for c in [(0, 0, 0), (63, 63, 63), (0, 63, 0), (31, 31, 31)]:
        x, y, z = c
        print(f"  alpha at {c} = {int(a[x, y, z])}")

    # distribusi: persen <128 (luar), ==128 (batas), >128 (dalam)
    tot = a.size
    lt = int((a < 128).sum())
    eq = int((a == 128).sum())
    gt = int((a > 128).sum())
    print(f"alpha<128 (luar): {lt} ({100*lt/tot:.2f}%)   ==128: {eq} ({100*eq/tot:.2f}%)   >128 (dalam): {gt} ({100*gt/tot:.2f}%)")

    # isosurface transisi: di sekitar nilai berapa ada kenaikan terbesar? cukup lihat histogram di 124..132
    band = [(int(v), int(hist[v])) for v in range(120, 136)]
    print("alpha hist 120..135:", band)

    # RGB: lihat beberapa voxel solid vs kosong
    mask_in = a > 128
    mask_out = a < 128
    if mask_in.any():
        print("RGB pada voxel dalam (>128):")
        idx = np.argwhere(mask_in)
        for c in idx[np.linspace(0, len(idx)-1, 6).astype(int)]:
            x, y, z = c
            print(f"   pos {tuple(c)}: R={r[x,y,z]} G={g[x,y,z]} B={b[x,y,z]}  (as normal: "
                  f"{r[x,y,z]/255*2-1:.2f},{g[x,y,z]/255*2-1:.2f},{b[x,y,z]/255*2-1:.2f})")
    if mask_out.any():
        print("RGB pada voxel luar (<128):")
        idx = np.argwhere(mask_out)
        for c in idx[np.linspace(0, len(idx)-1, 6).astype(int)]:
            x, y, z = c
            print(f"   pos {tuple(c)}: R={r[x,y,z]} G={g[x,y,z]} B={b[x,y,z]}  (as normal: "
                  f"{r[x,y,z]/255*2-1:.2f},{g[x,y,z]/255*2-1:.2f},{b[x,y,z]/255*2-1:.2f})")

    # arah normal relatif terhadap pusat massa (uji apakah normal menunjuk keluar/dalam)
    coords = np.indices(a.shape).astype(np.float32)
    cm = np.array([coords[i][mask_in].mean() for i in range(3)]) if mask_in.any() else None
    if cm is not None:
        print(f"pusat massa voxel dalam: {np.round(cm,1)}")
        # sampel voxel permukaan (transisi 124..132) dan rata2 dot(normal, pos-cm)
        shell = (a >= 124) & (a <= 132)
        if shell.any():
            idx = np.argwhere(shell)
            sel = idx[np.linspace(0, len(idx)-1, 2000).astype(int)]
            to_cm = sel.astype(np.float32) - cm
            norm = np.stack([r[tuple(sel.T)], g[tuple(sel.T)], b[tuple(sel.T)]], -1).astype(np.float32)/255*2-1
            dots = np.einsum('ij,ij->i', norm, to_cm)
            print(f"shell voxels sampel={len(sel)}: mean dot(normal, r-cm) = {dots.mean():.3f}  (>0 => normal keluar)")

def load_raw(p, dims=(64, 64, 64)):
    n = np.prod(dims) * 4
    d = np.fromfile(p, dtype=np.uint8, count=n)
    return d.reshape(dims[0], dims[1], dims[2], 4)

def main():
    for p in sys.argv[1:]:
        data = open(p, 'rb').read()
        if data[:12] == b'\xabKTX 20\xbb\r\n\x1a\n':
            h = parse_ktx2_header(data)
            print(f"== {p} -> KTX2 header: vkFormat={h['vk']} typeSize={h['tw']} "
                  f"dims={h['dims']} levels={h['lvl']} supercompression={KTX2_SS.get(h['ss'], h['ss'])} "
                  f"dfd@ {h['dfdo']}+{h['dfdl']}")
            if h['ss'] == 0 and h['dfdl'] >= 44 and h['vk'] in (37, 38):
                # uncompressed R8G8B8A8 / R8G8B8A8_SRGB; cari payload level 0 setelah kv + align
                # header 80 + kv* + dfd (dfdo==80 biasanya? coba)
                base = h['kvdo'] + h['kvdl']
                # align to 8
                base = (base + 7) & ~7
                stride = np.prod(h['dims']) * 4
                px = data[base:base+stride]
                arr = np.frombuffer(px, dtype=np.uint8).reshape(h['dims'][0], h['dims'][1], h['dims'][2], 4)
                report(p, arr, 'UNCOMPRESSED RGBA8 (dari ktx2 level0)')
            else:
                print("   -> PIXEL TERKOMPRESI / tak didukung, lewati analisis pixel.")
        elif len(data) == 64*64*64*4:
            report(p, load_raw(p), 'RAW 64^3 RGBA8')
        else:
            print(f"== {p} -> bukan raw 64^3 RGBA8 ({len(data)} bytes), lewati.")

if __name__ == '__main__':
    main()
