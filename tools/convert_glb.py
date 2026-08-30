import trimesh
import numpy as np
from scipy import ndimage
import sys

print("→ Loading GLB mesh...")
mesh = trimesh.load('/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/models/gmail-logo.glb', force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

mesh.process(validate=True)
trimesh.repair.fix_normals(mesh)

# Center + normalize scale to fit -0.45..0.45
mesh.apply_translation(-mesh.centroid)
scale = 0.9 / max(mesh.extents)
mesh.apply_scale(scale)
print(f"   Mesh prepped: extents={mesh.extents}")

RES = 64
pitch = 1.0 / RES

print("→ Voxelizing...")
voxels = mesh.voxelized(pitch=pitch).fill()
mat = voxels.matrix

# Pad to exact 64x64x64 cube
m_padded = np.zeros((RES, RES, RES), dtype=bool)
sx, sy, sz = [min(s, RES) for s in mat.shape]
ox, oy, oz = (RES-sx)//2, (RES-sy)//2, (RES-sz)//2
m_padded[ox:ox+sx, oy:oy+sy, oz:oz+sz] = mat[:sx, :sy, :sz]
mat = m_padded

print("→ Computing Signed Distance Field (SDF)...")
# Distance transform inside vs outside using scipy (fast)
dist_out = ndimage.distance_transform_edt(~mat) * pitch
dist_in = ndimage.distance_transform_edt(mat) * pitch
sdf = np.where(mat, -dist_in, dist_out).astype(np.float32)

print("→ Computing Gradient (Normal Surface)...")
gy, gx, gz = np.gradient(sdf)
grad = np.stack([gx, gy, gz], axis=-1)
norm = np.linalg.norm(grad, axis=-1, keepdims=True) + 1e-8
grad /= norm

print("→ Packing RGBA Float32...")
volume = np.zeros(sdf.shape + (4,), dtype=np.float32)
# Map gradient [-1..1] to [0..1] for RGB
volume[..., :3] = grad * 0.5 + 0.5
# Map SDF [-0.5..0.5] to [0..1] for Alpha
volume[..., 3]  = np.clip(sdf * 0.5 + 0.5, 0.0, 1.0)

out_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes/gmail-logo_64.bin'
volume.tofile(out_path)

print(f"✅ SUCCESS: Saved {out_path} ({volume.nbytes / (1024*1024):.2f} MB)")
