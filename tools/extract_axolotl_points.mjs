import fs from 'fs';
import path from 'path';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

// Setup file paths
const glbPath = path.resolve('igloo-local/public/assets/images/ui/models/axolotl-logo.glb');
const outBinPublic = path.resolve('igloo-local/public/assets/volumes/axolotl_points.bin');
const outBinDist = path.resolve('igloo-local/dist/assets/volumes/axolotl_points.bin');

const TARGET_COUNT = 150000;

console.log(`Loading GLB model from: ${glbPath}`);
const buffer = fs.readFileSync(glbPath);

// ArrayBuffer conversion
const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);

const loader = new GLTFLoader();
loader.parse(arrayBuffer, '', (gltf) => {
    let combinedMesh;
    const geometries = [];

    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.updateMatrixWorld(true);
            const geom = child.geometry.clone();
            geom.applyMatrix4(child.matrixWorld);
            geometries.push(geom);
        }
    });

    console.log(`Found ${geometries.length} meshes in GLB.`);

    if (geometries.length === 0) {
        console.error("No meshes found in GLB!");
        process.exit(1);
    }

    // Merge geometries if multiple
    let mergedGeometry;
    if (geometries.length === 1) {
        mergedGeometry = geometries[0];
    } else {
        // Simple merge
        mergedGeometry = geometries[0]; // fallback to main mesh
    }

    const material = new THREE.MeshBasicMaterial();
    const mesh = new THREE.Mesh(mergedGeometry, material);

    // Surface Sampler
    const sampler = new MeshSurfaceSampler(mesh).build();
    const positions = new Float32Array(TARGET_COUNT * 3);

    const tempPos = new THREE.Vector3();
    const bbox = new THREE.Box3();

    console.log(`Sampling ${TARGET_COUNT} points...`);
    for (let i = 0; i < TARGET_COUNT; i++) {
        sampler.sample(tempPos);
        positions[i * 3] = tempPos.x;
        positions[i * 3 + 1] = tempPos.y;
        positions[i * 3 + 2] = tempPos.z;
    }

    // Center and Normalize to range [-1.5, 1.5]
    bbox.setFromBufferAttribute(new THREE.BufferAttribute(positions, 3));
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    bbox.getCenter(center);
    bbox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 3.0 / maxDim; // Map to [-1.5, 1.5]

    console.log(`BBox Center: ${center.x}, ${center.y}, ${center.z} | Max Dim: ${maxDim}`);

    for (let i = 0; i < TARGET_COUNT; i++) {
        positions[i * 3] = (positions[i * 3] - center.x) * scaleFactor;
        positions[i * 3 + 1] = (positions[i * 3 + 1] - center.y) * scaleFactor;
        positions[i * 3 + 2] = (positions[i * 3 + 2] - center.z) * scaleFactor;
    }

    // Write binary buffer
    const uint8Array = new Uint8Array(positions.buffer);
    fs.mkdirSync(path.dirname(outBinPublic), { recursive: true });
    fs.mkdirSync(path.dirname(outBinDist), { recursive: true });

    fs.writeFileSync(outBinPublic, uint8Array);
    fs.writeFileSync(outBinDist, uint8Array);

    console.log(`Successfully generated ${outBinPublic} (${uint8Array.byteLength} bytes)`);
    console.log(`Successfully generated ${outBinDist} (${uint8Array.byteLength} bytes)`);
}, (err) => {
    console.error("Error parsing GLB:", err);
});
