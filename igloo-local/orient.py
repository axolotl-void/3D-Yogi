#!/usr/bin/env python3
"""Tentukan orientasi volume axolotl_64.raw dari data, TANPA butuh file gambar.

Print:
  1. Okupansi per irisan di tiap sumbu (untuk tau sumbu mana yang tipis/lebar).
  2. ASCII art 3 irisan tengah (XY@z32, XZ@y32, YZ@x32) agar bentuk terlihat.
"""
data = open('public/assets/volumes/axolotl_64.raw', 'rb').read()
N = 64
def A(x, y, z):
    return data[((z * N + y) * N + x) * 4 + 3]

def occ(axis, thr):
    out = []
    for s in range(N):
        c = 0
        for a in range(N):
            for b in range(N):
                if axis == 0: x, y, z = s, a, b
                elif axis == 1: x, y, z = a, s, b
                else: x, y, z = a, b, s
                if A(x, y, z) > thr:
                    c += 1
        out.append(c)
    return out

def span(axis, thr=110):
    o = occ(axis, thr)
    nz = [i for i, v in enumerate(o) if v]
    return (nz[0], nz[-1], nz[-1] - nz[0] + 1, sum(o)) if nz else (None, None, 0, 0)

print("== Okupansi (shell, alpha>110): span tiap sumbu ==")
for name, ax in (('X', 0), ('Y', 1), ('Z', 2)):
    lo, hi, sp, s = span(ax)
    print(f"  {name}: slice {lo}..{hi} span={sp} total_voxel={s}")
print("== Okupansi (dalam-dalam, alpha>200): ==")
for name, ax in (('X', 0), ('Y', 1), ('Z', 2)):
    lo, hi, sp, s = span(ax, 200)
    print(f"  {name}: slice {lo}..{hi} span={sp} total_voxel={s}")

def ascii_slice(axis0, axis1, fixed_axis, fixed_val):
    ax = {'x': 0, 'y': 1, 'z': 2}
    a0, a1 = ax[axis0], ax[axis1]
    af = ax[fixed_axis]
    lines = []
    for j in range(N):          # baris = axis1 (j=0 di atas, tampil dari Y/Z besar ke kecil biar "naik" ke atas)
        row = []
        jj = N - 1 - j          # flip: axis1 besar di atas
        for i in range(N):      # kolom = axis0
            c = [0, 0, 0]
            c[af] = fixed_val
            c[a0] = i
            c[a1] = jj
            v = A(*c)
            if v > 200: ch = '@'
            elif v > 150: ch = '#'
            elif v > 130: ch = 'O'
            elif v > 115: ch = '+'
            elif v > 105: ch = '-'
            else: ch = ' '
            row.append(ch)
        lines.append(''.join(row))
    return lines

for fname, label, a0, a1, fx, fv, xlab in (
        ('XY@z32', 'bidang XY  (kolom=X kiri->kanan, baris=Y atas ke bawah-naik)', 'x', 'y', 'z', 32, 'Y up'),
        ('XZ@y32', 'bidang XZ  (kolom=X kiri->kanan, baris=Z atas->=dekat penonton? flip)', 'x', 'z', 'y', 32, 'Z'),
        ('YZ@x32', 'bidang YZ  (kolom=Y, baris=Z)', 'y', 'z', 'x', 32, 'Z')):
    print(f"\n== {fname} — {label}")
    print('   ' + ''.join(str(i % 10) for i in range(N)))  # ruler kolom
    for idx, ln in enumerate(ascii_slice(a0, a1, fx, fv)):
        print(f'{N-1-idx:2d} {ln}')
