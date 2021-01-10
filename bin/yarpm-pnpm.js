#!/usr/bin/env node
'use strict';

const commandExists = require('command-exists');
const run = require('./bin-executor').run;

commandExists('pnpm').then(
  () => run({ npmPath: 'pnpm' }),
  () => run()
);
