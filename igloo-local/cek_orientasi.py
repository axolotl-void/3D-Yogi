#!/usr/bin/env python3
# Analisis orientasi volume axolotl_64.raw: okupansi interior per irisan tiap sumbu.
data = open('public/assets/volumes/axolotl_64.raw', 'rb').read()
N = 64
def A(x, y, z):
    return data[((z * N + y) * N + x) * 4 + 3]

def occ(axis):
    out = []
    for s in range(N):
        c = 0
        for a in range(N):
            for b in range(N):
                if axis == 0: x, y, z = s, a, b
                elif axis == 1: x, y, z = a, s, b
                else: x, y, z = a, b, s
                if A(x, y, z) > 128:
                    c += 1
        out.append(c)
    return out

for name, o in (('X', occ(0)), ('Y', occ(1)), ('Z', occ(2))):
    nz = [i for i, v in enumerate(o) if v]
    if nz:
        print(f'{name}: min_idx={nz[0]} max_idx={nz[-1]} span={nz[-1] - nz[0] + 1} sum={sum(o)}')
    else:
        print(f'{name}: KOSONG')
    print('   ', o)

# Cari irisan dengan interior terbanyak (untuk ikut ngecek arah menghadap)
for name, o in (('X', occ(0)), ('Y', occ(1)), ('Z', occ(2))):
    mx = max(o)
    idx = [i for i, v in enumerate(o) if v == mx]
    print(f'{name}: irisan terpadat={idx} ({mx} voxel)')
