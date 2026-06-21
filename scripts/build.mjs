import { spawnSync } from 'node:child_process';
import path from 'node:path';

for (const envFileName of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(envFileName);
  } catch {
    // File is optional; rely on already-exported env vars.
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runPackageManager(args) {
  const packageManagerEntrypoint = process.env.npm_execpath;

  if (packageManagerEntrypoint) {
    const extension = path.extname(packageManagerEntrypoint).toLowerCase();
    const isJavaScriptEntrypoint = extension === '.js' || extension === '.cjs' || extension === '.mjs';

    if (isJavaScriptEntrypoint) {
      run(process.execPath, [packageManagerEntrypoint, ...args]);
      return;
    }

    run(packageManagerEntrypoint, args);
    return;
  }

  const packageManagerCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  run(packageManagerCommand, args);
}

const explicitlyDisableTinaBuild = process.env.TINA_BUILD === 'false' || process.env.SKIP_TINA_BUILD === 'true';
const hasTinaCloudCredentials = Boolean(process.env.NEXT_PUBLIC_TINA_CLIENT_ID && process.env.TINA_TOKEN);
const enforceCloudChecks = process.env.TINA_REQUIRE_CLOUD_CHECKS === 'true';
const skipCloudChecks = process.env.TINA_SKIP_CLOUD_CHECKS === 'true' || !enforceCloudChecks;
const tinaBuildPort = process.env.TINA_BUILD_PORT || '4002';
const tinaDatalayerPort = process.env.TINA_DATALAYER_PORT || '9001';

console.log('Syncing localized content before build');
run(process.execPath, ['scripts/content-sync.mjs']);

if (!explicitlyDisableTinaBuild) {
  const tinaBuildArgs = ['exec', 'tinacms', 'build', '--port', tinaBuildPort, '--datalayer-port', tinaDatalayerPort];

  if (!hasTinaCloudCredentials) {
    tinaBuildArgs.push('--local', '--skip-cloud-checks', '--skip-indexing');
    console.log('Running Tina build in local mode before Next build (cloud credentials not found)');
  } else if (skipCloudChecks) {
    tinaBuildArgs.push('--skip-cloud-checks', '--skip-indexing');
    console.log('Running Tina build before Next build (skip cloud checks/indexing enabled)');
  } else {
    console.log('Running Tina build before Next build (with TinaCloud checks/indexing)');
  }

  runPackageManager(tinaBuildArgs);
} else {
  console.log('Skipping Tina build (TINA_BUILD=false or SKIP_TINA_BUILD=true was set).');
}

runPackageManager(['exec', 'next', 'build']);
