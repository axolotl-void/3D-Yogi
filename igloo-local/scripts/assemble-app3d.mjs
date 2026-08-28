import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const hostRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectRoot = path.resolve(hostRoot, '..');
const partsRoot = path.join(hostRoot, 'public', 'app3d');
const manifestPath = path.join(partsRoot, 'parts.json');
const archivePath = path.join(projectRoot, 'hasil-inspekc', 'app3D-original-before-split.js');
const indexSourcePath = path.join(projectRoot, 'index.js');
const publicPath = path.join(hostRoot, 'public', 'App3D-f554a111.js');
const indexPublicPath = path.join(hostRoot, 'public', 'index-2eb69c09.js');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const indexSource = fs.readFileSync(indexSourcePath, 'utf8');

function lineStarts(text) {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) starts.push(index + 1);
  }
  return starts;
}

function lineCount(text, starts) {
  return text.endsWith('\n') ? starts.length - 1 : starts.length;
}

function sliceLines(text, starts, startLine, endLine) {
  const start = starts[startLine - 1];
  const end = endLine < lineCount(text, starts) ? starts[endLine] : text.length;
  return text.slice(start, end);
}

function validateManifest(totalLines) {
  let expectedStart = 1;

  for (const part of manifest.parts) {
    if (part.startLine !== expectedStart) {
      throw new Error(`Invalid range before ${part.file}: expected line ${expectedStart}`);
    }
    if (part.endLine < part.startLine || part.endLine > totalLines) {
      throw new Error(`Invalid range in ${part.file}`);
    }
    expectedStart = part.endLine + 1;
  }

  if (expectedStart !== totalLines + 1) {
    throw new Error(`Manifest ends at line ${expectedStart - 1}, source has ${totalLines} lines`);
  }
}

function readParts() {
  return manifest.parts.map((part) => {
    const filePath = path.join(partsRoot, part.file);
    if (!fs.existsSync(filePath)) throw new Error(`Missing part: ${part.file}`);
    return fs.readFileSync(filePath, 'utf8');
  });
}

function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf8') === content) return false;
  fs.writeFileSync(filePath, content);
  return true;
}

if (process.argv.includes('--extract')) {
  if (!fs.existsSync(archivePath)) throw new Error(`Missing archive: ${archivePath}`);
  const source = fs.readFileSync(archivePath, 'utf8');
  const sourceStarts = lineStarts(source);
  validateManifest(lineCount(source, sourceStarts));
  for (const part of manifest.parts) {
    const content = sliceLines(source, sourceStarts, part.startLine, part.endLine);
    fs.writeFileSync(path.join(partsRoot, part.file), content);
  }
  console.log(`Extracted ${manifest.parts.length} App3D parts from ${archivePath}`);
}

const assembled = readParts().join('');

if (process.argv.includes('--verify')) {
  if (!fs.existsSync(publicPath) || fs.readFileSync(publicPath, 'utf8') !== assembled) {
    throw new Error('Public App3D bundle differs from the assembled parts');
  }
  if (!fs.existsSync(indexPublicPath) || fs.readFileSync(indexPublicPath, 'utf8') !== indexSource) {
    throw new Error('Public loader differs from the root index.js');
  }
  console.log('Verified: parts, App3D bundle, and public loader are synchronized.');
} else {
  const publicChanged = writeIfChanged(publicPath, assembled);
  const indexChanged = writeIfChanged(indexPublicPath, indexSource);
  console.log(`Assembled App3D (${manifest.parts.length} parts); App3D=${publicChanged ? 'updated' : 'unchanged'}, loader=${indexChanged ? 'restored' : 'unchanged'}`);
}
