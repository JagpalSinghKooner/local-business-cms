import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const dir = '.next/static/chunks';
const limitKb = 200; // per-chunk budget in KB for public routes
const studioLimitKb = 3000; // Studio chunks can be larger (admin-only)
const big = [];
const studioChunks = [];

if (!existsSync(dir)) {
  console.error('❌ Build directory .next/static/chunks not found. Run `pnpm build` first.');
  process.exit(1);
}

console.log('📦 Checking bundle sizes...\n');

const files = readdirSync(dir);
let totalSize = 0;
let chunkCount = 0;

// Known Studio chunk IDs (these are lazy-loaded for /studio route only)
// Update this list if Studio chunks change after rebuilds
const studioChunkIds = ['82382974', '9310', '6cd9b098', '7914', '84b385d0', '7e87766f'];

for (const f of files) {
  if (!f.endsWith('.js')) continue;

  const filePath = join(dir, f);
  const sizeBytes = readFileSync(filePath).length;
  const kb = Math.round(sizeBytes / 1024);
  totalSize += kb;
  chunkCount++;

  // Check if this is a Studio chunk (lazy-loaded)
  const isStudioChunk = studioChunkIds.some(id => f.startsWith(id));

  if (isStudioChunk) {
    studioChunks.push({ file: f, kb });
    if (kb > studioLimitKb) {
      big.push({ file: f, kb, type: 'studio' });
    }
  } else if (kb > limitKb) {
    big.push({ file: f, kb, type: 'public' });
  }
}

console.log(`✅ Checked ${chunkCount} chunks`);
console.log(`📊 Total bundle size: ${totalSize} KB (${(totalSize/1024).toFixed(2)} MB)\n`);

if (studioChunks.length > 0) {
  const studioTotal = studioChunks.reduce((sum, c) => sum + c.kb, 0);
  console.log(`🏢 Studio chunks (lazy-loaded for /studio only): ${studioChunks.length} chunks, ${studioTotal} KB (${(studioTotal/1024).toFixed(2)} MB)`);
}

const publicChunksBig = big.filter(c => c.type === 'public');
const studioChunksBig = big.filter(c => c.type === 'studio');

if (publicChunksBig.length > 0) {
  console.error('\n❌ PUBLIC route bundle budget exceeded! The following chunks are too large:\n');
  for (const { file, kb } of publicChunksBig) {
    console.error(`   ${file}: ${kb} KB (limit: ${limitKb} KB)`);
  }
  console.error(`\n💡 Consider code splitting or lazy loading to reduce chunk sizes.`);
  process.exit(1);
}

if (studioChunksBig.length > 0) {
  console.error('\n⚠️  STUDIO chunks exceed size limit (admin routes):\n');
  for (const { file, kb } of studioChunksBig) {
    console.error(`   ${file}: ${kb} KB (limit: ${studioLimitKb} KB)`);
  }
  console.error(`\n💡 This is concerning but not critical (admin-only routes).`);
}

console.log(`\n✅ All public chunks are within the ${limitKb} KB budget!\n`);
