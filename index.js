#!/usr/bin/env node

const process = require('node:process');
const { execFileSync } = require('node:child_process');

const opts = {
  cwd: process.cwd(),
  stdio: 'inherit'
};

execFileSync('./scripts/build.js', opts);
// execFileSync('./scripts/scrape.js', opts);
