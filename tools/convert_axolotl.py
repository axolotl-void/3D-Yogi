import numpy as np
import trimesh
import scipy.ndimage as ndi
import os

print("→ Loading axolotl-logo.glb...")
glb_path = '/Users/yogiprasetyasadewa/Documents/axolotl-logo.glb'
mesh = trimesh.load(glb_path, force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

mesh.apply_translation(-mesh.centroid)
mesh.apply_scale(0.85 / np.max(mesh.extents))

res = 64
voxels = mesh.voxelized(pitch=1.0 / res).fill()
grid = np.zeros((res, res, res), dtype=bool)
mat = voxels.matrix
x, y, z = [min(s, res) for s in mat.shape]
ox, oy, oz = (res-x)//2, (res-y)//2, (res-z)//2
grid[ox:ox+x, oy:oy+y, oz:oz+z] = mat[:x, :y, :z]

print("→ Computing Signed Distance Field (SDF)...")
dist_out = ndi.distance_transform_edt(~grid)
dist_in  = ndi.distance_transform_edt(grid)
sdf = np.clip((dist_out - dist_in) / (res * 0.5), -1.0, 1.0)

print("→ Computing Normals Gradient...")
gy, gx, gz = np.gradient(sdf)
norm = np.sqrt(gx*gx + gy*gy + gz*gz) + 1e-6
gx, gy, gz = gx/norm, gy/norm, gz/norm

rgba = np.zeros((res, res, res, 4), dtype=np.uint8)
rgba[..., 0] = ((gx * 0.5 + 0.5) * 255).astype(np.uint8)
rgba[..., 1] = ((gy * 0.5 + 0.5) * 255).astype(np.uint8)
rgba[..., 2] = ((gz * 0.5 + 0.5) * 255).astype(np.uint8)
rgba[..., 3] = ((sdf * 0.5 + 0.5) * 255).astype(np.uint8)

output_dir = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'axolotl_64.raw')
rgba.tofile(output_path)

print(f"✅ RAW volume generated: {output_path}")
