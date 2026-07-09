/**
 * Copies Next.js standalone output into desktop/resources for electron-builder.
 */
const fs = require('fs');
const path = require('path');

const webRoot = path.resolve(__dirname, '../../studio');
const standaloneSrc = path.join(webRoot, '.next/standalone');
const staticSrc = path.join(webRoot, '.next/static');
const publicSrc = path.join(webRoot, 'public');
const dest = path.resolve(__dirname, '../resources/standalone');

function copyRecursive(src, dst) {
  if (!fs.existsSync(src)) {
    console.error(`Missing path: ${src}`);
    process.exit(1);
  }
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

copyRecursive(standaloneSrc, dest);
copyRecursive(staticSrc, path.join(dest, '.next/static'));
if (fs.existsSync(publicSrc)) {
  copyRecursive(publicSrc, path.join(dest, 'public'));
}

console.log(`Standalone bundle prepared at ${dest}`);
