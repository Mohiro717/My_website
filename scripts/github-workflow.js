#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { argv, exit } from 'node:process';

const [, , command = 'help'] = argv;

const commandMap = new Map([
  ['npm', process.platform === 'win32' ? 'npm.cmd' : 'npm'],
]);

const exec = (cmd, args, opts = {}) => {
  const resolvedCmd = commandMap.get(cmd) ?? cmd;
  const result = spawnSync(resolvedCmd, args, {
    stdio: 'inherit',
    ...opts,
  });

  if (result.error) {
    console.error(`\n[github-workflow] Failed to run "${cmd}":`, result.error.message);
    exit(result.status ?? 1);
  }

  if (result.status !== 0) {
    console.error(`\n[github-workflow] Command "${cmd} ${args.join(' ')}" exited with code ${result.status}.`);
    exit(result.status ?? 1);
  }
};

const tasks = {
  help: () => {
    console.log(`\nGitHub Workflow Helper\n======================\n
Usage: node scripts/github-workflow.js <command>\n
Commands:\n  status   Show git status and recent commits\n  summary  Display git status plus diff stat summary\n  prepare  Run production build then show status\n  help     Show this message\n`);
  },
  status: () => {
    exec('git', ['status', '--short', '--branch']);
    console.log('\nRecent commits:');
    exec('git', ['log', '--oneline', '--decorate', '-5']);
  },
  summary: () => {
    tasks.status();
    console.log('\nDiff summary:');
    exec('git', ['diff', '--stat']);
  },
  prepare: () => {
    console.log('[github-workflow] Running production build to verify readiness...');
    exec('npm', ['run', 'build']);
    console.log('\n[github-workflow] Build complete. Repository status:');
    tasks.summary();
  },
};

const task = tasks[command];

if (!task) {
  console.error(`[github-workflow] Unknown command: "${command}"\n`);
  tasks.help();
  exit(1);
}

task();
