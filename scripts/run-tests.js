#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { exit } from 'node:process';

const testTargets = ['tests', '__tests__'];
const hasTests = testTargets.some((target) => existsSync(target));

if (!hasTests) {
  console.log('[test] No test suite detected (expected directories: tests/ or __tests__/). Skipping.');
  exit(0);
}

console.log('[test] Running Node test runner...');
const result = spawnSync(process.execPath, ['--test', ...testTargets.filter((target) => existsSync(target))], {
  stdio: 'inherit',
});

if (result.error) {
  console.error('[test] Failed to launch Node test runner:', result.error.message);
  exit(result.status ?? 1);
}

if (result.status !== 0) {
  console.error(`[test] Tests failed with exit code ${result.status}.`);
  exit(result.status ?? 1);
}

console.log('[test] Tests completed successfully.');
