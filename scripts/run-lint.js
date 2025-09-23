#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { exit } from 'node:process';
import { join } from 'node:path';

const tscPath = join(process.cwd(), 'node_modules', 'typescript', 'bin', 'tsc');

console.log('[lint] Running TypeScript-based lint placeholder (tsc --noEmit)...');
const result = spawnSync(process.execPath, [tscPath, '--noEmit'], { stdio: 'inherit' });

if (result.error) {
  console.error('[lint] Failed to launch TypeScript compiler:', result.error.message);
  exit(result.status ?? 1);
}

if (result.status !== 0) {
  console.error(`[lint] TypeScript checks failed with exit code ${result.status}.`);
  exit(result.status ?? 1);
}

console.log('[lint] Completed. No additional lint rules configured yet.');
