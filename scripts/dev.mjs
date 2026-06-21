import { spawn, spawnSync } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';

const publicDir = path.join(repoRoot, 'public');
const aboutUsDir = path.join(repoRoot, 'jsonContent', 'about-us');
const contentSyncScriptPath = path.join(repoRoot, 'scripts', 'content-sync.mjs');
const aboutUsLocaleFiles = new Set(['en.json', 'sv.json']);
const imageExtensions = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);

let syncRunning = false;
let syncQueued = false;
let queuedReason = '';
let debounceTimer = null;
let watchers = [];

function runSync(reason) {
  if (syncRunning) {
    syncQueued = true;
    queuedReason = reason;
    return;
  }

  syncRunning = true;
  console.log(`\n[content-sync] start (${reason})`);

  const child = spawn(process.execPath, [contentSyncScriptPath], {
    cwd: repoRoot,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    syncRunning = false;

    if (code !== 0) {
      console.error(`[content-sync] failed with exit code ${code ?? 1}`);
    } else {
      console.log('[content-sync] complete');
    }

    if (syncQueued) {
      const reasonToRun = queuedReason || 'queued file changes';
      syncQueued = false;
      queuedReason = '';
      runSync(reasonToRun);
    }
  });
}

function scheduleSync(reason) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    runSync(reason);
  }, 350);
}

function startWatchers() {
  try {
    const publicWatcher = watch(publicDir, { recursive: true }, (_eventType, fileName) => {
      if (typeof fileName !== 'string' || !fileName) return;
      const extension = path.extname(fileName).toLowerCase();
      if (!imageExtensions.has(extension)) return;
      scheduleSync(`detected image change: ${fileName.replace(/\\/g, '/')}`);
    });

    watchers.push(publicWatcher);
    console.log('[content-sync] watching public/ for new image files');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[content-sync] public watcher unavailable: ${message}`);
  }

  try {
    const aboutUsWatcher = watch(aboutUsDir, { recursive: false }, (_eventType, fileName) => {
      if (typeof fileName !== 'string' || !fileName) return;
      const normalizedName = path.basename(fileName).toLowerCase();
      if (!aboutUsLocaleFiles.has(normalizedName)) return;
      scheduleSync(`detected about-us locale change: ${normalizedName}`);
    });

    watchers.push(aboutUsWatcher);
    console.log('[content-sync] watching jsonContent/about-us for EN/SV employee updates');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[content-sync] about-us watcher unavailable: ${message}`);
  }
}

function cleanup() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  for (const watcher of watchers) {
    watcher.close();
  }
  watchers = [];
}

const initialSync = spawnSync(process.execPath, [contentSyncScriptPath], {
  cwd: repoRoot,
  stdio: 'inherit',
});

if (initialSync.status !== 0) {
  process.exit(initialSync.status ?? 1);
}

startWatchers();

const devProcess = isWindows
  ? spawn('pnpm exec tinacms dev -c "next dev"', {
      cwd: repoRoot,
      stdio: 'inherit',
      shell: true,
    })
  : spawn('pnpm', ['exec', 'tinacms', 'dev', '-c', 'next dev'], {
      cwd: repoRoot,
      stdio: 'inherit',
    });

process.on('SIGINT', () => {
  cleanup();
  if (!devProcess.killed) devProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  cleanup();
  if (!devProcess.killed) devProcess.kill('SIGTERM');
});

devProcess.on('exit', (code, signal) => {
  cleanup();

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
