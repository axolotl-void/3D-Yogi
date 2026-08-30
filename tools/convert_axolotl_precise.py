import numpy as np
import trimesh
import scipy.ndimage as ndi
import os

print("→ Loading axolotl-logo.glb...")
glb_path = '/Users/yogiprasetyasadewa/Documents/axolotl-logo.glb'
mesh = trimesh.load(glb_path, force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

# 1. Rotasi Blender Z-Up ke WebGL Y-Up (-90 deg X-axis) & Centering
rot = trimesh.transformations.rotation_matrix(-np.pi/2, [1, 0, 0])
mesh.apply_transform(rot)
mesh.apply_translation(-mesh.centroid)

# Scale simetris dengan margin aman di dalam kubus 64x64x64
scale = 0.75 / np.max(mesh.extents)
mesh.apply_scale(scale)

RES = 64
pitch = 1.0 / RES

# 2. Voxelization
voxels = mesh.voxelized(pitch=pitch).fill()
mat = voxels.matrix

grid = np.zeros((RES, RES, RES), dtype=bool)
sx, sy, sz = [min(s, RES) for s in mat.shape]
ox, oy, oz = (RES-sx)//2, (RES-sy)//2, (RES-sz)//2
grid[ox:ox+sx, oy:oy+sy, oz:oz+sz] = mat[:sx, :sy, :sz]

# Log Distribusi Voxel
print(f"📊 Stats: Grid={RES}x{RES}x{RES}, Occupied Voxels={grid.sum()} ({grid.sum()/(RES**3)*100:.1f}%)")

# 3. Distance Transform (SDF)
dist_out = ndi.distance_transform_edt(~grid) * pitch
dist_in  = ndi.distance_transform_edt(grid) * pitch
sdf = dist_out - dist_in

# Fit SDF ke range [-0.4, 0.4] -> [0.0, 1.0] (0.5 = Permukaan/Surface)
sdf_norm = np.clip(sdf / 0.8 + 0.5, 0.0, 1.0)

# 4. Correct Axis Order Gradient Calculation (gx, gy, gz)
gx, gy, gz = np.gradient(sdf)
norm = np.sqrt(gx*gx + gy*gy + gz*gz) + 1e-8
gx, gy, gz = gx/norm, gy/norm, gz/norm

# 5. Pack RGBA
rgba = np.zeros((RES, RES, RES, 4), dtype=np.uint8)
rgba[..., 0] = np.clip((gx * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 1] = np.clip((gy * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 2] = np.clip((gz * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 3] = np.clip(sdf_norm * 255, 0, 255).astype(np.uint8)

output_dir = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes'
os.makedirs(output_dir, exist_ok=True)
raw_path = os.path.join(output_dir, 'axolotl_64.raw')
rgba.tofile(raw_path)

print(f"✅ RAW Volume Presisi Tersimpan: {raw_path}")
