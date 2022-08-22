#!/usr/bin/env node

const { execFileSync } = require('node:child_process');

execFileSync('./scripts/build.js');
execFileSync('./scripts/scrape.js');
