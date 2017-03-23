#!/usr/bin/env node
'use strict';

const commandExists = require('command-exists');
const run = require('./bin-executor').run;

commandExists('yarn')
  .then(
    () => run({fallbackNpmPath: 'yarn', env: Object.assign({}, process.env, {npm_config_loglevel: 'warn'})}),
    () => run()
  );
