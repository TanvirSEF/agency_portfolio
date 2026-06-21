import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const syncScripts = [
  'scripts/about-us-employees-sync.mjs',
];

for (const scriptRelativePath of syncScripts) {
  console.log(`[content-sync] running ${scriptRelativePath}`);
  const result = spawnSync(process.execPath, [scriptRelativePath], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('[content-sync] complete');
