import struct
import os

raw_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes/axolotl_64.raw'
ktx_path = '/Users/yogiprasetyasadewa/Documents/03_Proyek/webGL/igloo-local/public/assets/volumes/axolotl_64.ktx2'

if not os.path.exists(raw_path):
    print(f"Error: {raw_path} not found. Run convert_axolotl.py first.")
    exit(1)

with open(raw_path, 'rb') as f:
    raw_data = f.read()

width, height, depth = 64, 64, 64
expected_len = width * height * depth * 4
if len(raw_data) != expected_len:
    print(f"Warning: raw data size is {len(raw_data)}, expected {expected_len}")

# KTX2 Identifier (12 bytes)
identifier = b'\xabKTX 20\xbb\r\n\x1a\n'

# Header fields
vkFormat = 37               # VK_FORMAT_R8G8B8A8_UNORM
typeSize = 1                # 1 byte per channel
pixelWidth = width
pixelHeight = height
pixelDepth = depth
layerCount = 0
faceCount = 1
levelCount = 1
supercompressionScheme = 0 # NONE

# DFD (Data Format Descriptor) block
# Total DFD length: 44 bytes (4 bytes total_size + 40 bytes Basic DFD Block)
dfd_bytes = struct.pack(
    '<IIHHBBBB',
    44,         # totalSize
    40,         # vendorId = 0, descriptorType = 0 (Basic DFD)
    2,          # versionNumber = 2
    40,         # descriptorBlockSize
    0,          # model = KHR_DF_MODEL_RGBSDA
    1,          # primaries = KHR_DF_PRIMARIES_BT709
    1,          # transfer = KHR_DF_TRANSFER_SRGB
    0           # flags = 0
) + struct.pack(
    '<B3s',
    0, b'\x00\x00\x00' # texelBlockDimension (1x1x1x1)
) + struct.pack(
    '<BBBB', 0, 0, 0, 0 # bytesPlane 0..3
) + (
    # Channel 0: R (offset 0, size 7, bit 0)
    struct.pack('<HHBBBBBB', 0, 0, 7, 0, 0, 0, 0, 0) +
    # Channel 1: G (offset 1, size 7, bit 0)
    struct.pack('<HHBBBBBB', 1, 0, 7, 0, 1, 0, 0, 0) +
    # Channel 2: B (offset 2, size 7, bit 0)
    struct.pack('<HHBBBBBB', 2, 0, 7, 0, 2, 0, 0, 0) +
    # Channel 3: A (offset 3, size 7, bit 0)
    struct.pack('<HHBBBBBB', 3, 0, 7, 0, 3, 0, 0, 0)
)

# Offsets calculation
# Header: 80 bytes (12 ID + 17*4 fields)
# Level Index (1 level): 24 bytes (byteOffset uint64, byteLength uint64, uncompressedByteLength uint64)
# Header + Level Index = 104 bytes
# DFD follows at offset 104
# Image data follows after DFD (offset 104 + len(dfd_bytes) = 148 bytes)

dfd_offset = 104
dfd_length = len(dfd_bytes)
kvd_offset = 0
kvd_length = 0
sgd_offset = 0
sgd_length = 0

header = struct.pack(
    '<12sIIIIIIIIIIIIQQQ',
    identifier,
    vkFormat,
    typeSize,
    pixelWidth,
    pixelHeight,
    pixelDepth,
    layerCount,
    faceCount,
    levelCount,
    supercompressionScheme,
    dfd_offset,
    dfd_length,
    kvd_offset,
    kvd_length,
    sgd_offset,
    sgd_length
)

image_data_offset = dfd_offset + dfd_length
level_index = struct.pack(
    '<QQQ',
    image_data_offset,
    len(raw_data),
    len(raw_data)
)

with open(ktx_path, 'wb') as f:
    f.write(header)
    f.write(level_index)
    f.write(dfd_bytes)
    f.write(raw_data)

print(f"✅ KTX2 3D Texture created successfully: {ktx_path} ({os.path.getsize(ktx_path)} bytes)")
