#!/usr/bin/env node
'use strict';

const yarpm = require('../lib');

const argv = process.argv.slice(2);

yarpm(argv, {stdin: process.stdin, stdout: process.stdout, stderr: process.stderr})
// Not sure why, but sometimes the process never exits on Git Bash (MINGW64)
  .then(({code}) => process.exit(code))
  .catch(() => process.exit(1));
