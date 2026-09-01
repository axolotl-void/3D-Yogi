import numpy as np
import trimesh
import scipy.ndimage as ndi
import os

glb_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/images/ui/models/axolotl-logo.glb'
print(f"-> Loading {glb_path}...")

mesh = trimesh.load(glb_path, force='mesh')
if isinstance(mesh, trimesh.Scene):
    mesh = mesh.dump(concatenate=True)

# 1. Align orientation & center
rot = trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0])
mesh.apply_transform(rot)
mesh.apply_translation(-mesh.centroid)

# 2. Scale dengan padding aman
scale = 0.70 / np.max(mesh.extents)
mesh.apply_scale(scale)

RES = 64
pitch = 1.0 / RES

# 3. Solid Voxelization
voxels = mesh.voxelized(pitch=pitch).fill()
mat = voxels.matrix

grid = np.zeros((RES, RES, RES), dtype=bool)
sx, sy, sz = [min(s, RES) for s in mat.shape]
ox, oy, oz = (RES - sx) // 2, (RES - sy) // 2, (RES - sz) // 2
grid[ox:ox + sx, oy:oy + sy, oz:oz + sz] = mat[:sx, :sy, :sz]

# 4. SDF Calculation (Dalam = positif, Luar = negatif)
dist_in = ndi.distance_transform_edt(grid) * pitch
dist_out = ndi.distance_transform_edt(~grid) * pitch
sdf = dist_in - dist_out

# 5. Normal Gradients (Nx, Ny, Nz)
gx, gy, gz = np.gradient(sdf)
norm = np.sqrt(gx * gx + gy * gy + gz * gz) + 1e-8
nx, ny, nz = gx / norm, gy / norm, gz / norm

# 6. Encoding Alpha: Isosurface (0.0) = 128, Inside > 128, Outside < 128
alpha = np.clip((sdf / 0.4) * 127.5 + 128.0, 0, 255).astype(np.uint8)

# 7. Pack RGBA uint8 (1.048.576 byte)
rgba = np.zeros((RES, RES, RES, 4), dtype=np.uint8)
rgba[..., 0] = np.clip((nx * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 1] = np.clip((ny * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 2] = np.clip((nz * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)
rgba[..., 3] = alpha

# 8. Transpose axis ke (Z, Y, X, C) & order='C' untuk WebGL Data3DTexture memory layout
rgba_webgl = np.transpose(rgba, (2, 1, 0, 3)).copy(order='C')

pub_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes/axolotl_64.raw'
dist_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/dist/assets/volumes/axolotl_64.raw'

os.makedirs(os.path.dirname(pub_path), exist_ok=True)
os.makedirs(os.path.dirname(dist_path), exist_ok=True)

rgba_webgl.tofile(pub_path)
rgba_webgl.tofile(dist_path)

print(f"Generated {pub_path}: {os.path.getsize(pub_path)} bytes (WebGL memory layout applied)")
print(f"Generated {dist_path}: {os.path.getsize(dist_path)} bytes (WebGL memory layout applied)")
