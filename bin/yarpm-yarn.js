#!/usr/bin/env node
'use strict';

const commandExists = require('command-exists');
const { run } = require('./bin-executor');

commandExists('yarn').then(
  () =>
    run({
      npmPath: 'yarn',
      env: { ...process.env, npm_config_loglevel: 'warn' }
    }),
  () => run()
);
