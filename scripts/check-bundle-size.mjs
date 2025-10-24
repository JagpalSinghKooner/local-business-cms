import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const dir = '.next/static/chunks';
const limitKb = 200; // per-chunk budget in KB
const big = [];

if (!existsSync(dir)) {
  console.error('❌ Build directory .next/static/chunks not found. Run `pnpm build` first.');
  process.exit(1);
}

console.log('📦 Checking bundle sizes...\n');

const files = readdirSync(dir);
let totalSize = 0;
let chunkCount = 0;

for (const f of files) {
  if (!f.endsWith('.js')) continue;

  const filePath = join(dir, f);
  const sizeBytes = readFileSync(filePath).length;
  const kb = Math.round(sizeBytes / 1024);
  totalSize += kb;
  chunkCount++;

  if (kb > limitKb) {
    big.push({ file: f, kb });
  }
}

console.log(`✅ Checked ${chunkCount} chunks`);
console.log(`📊 Total bundle size: ${totalSize} KB\n`);

if (big.length > 0) {
  console.error('❌ Bundle budget exceeded! The following chunks are too large:\n');
  for (const { file, kb } of big) {
    console.error(`   ${file}: ${kb} KB (limit: ${limitKb} KB)`);
  }
  console.error(`\n💡 Consider code splitting or lazy loading to reduce chunk sizes.`);
  process.exit(1);
}

console.log(`✅ All chunks are within the ${limitKb} KB budget!\n`);
