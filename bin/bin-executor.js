'use strict';

const yarpm = require('../lib');

const argv = process.argv.slice(2);

exports.run = function run(options) {
  yarpm(argv, {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
    ...options
  })
    // Not sure why, but sometimes the process never exits on Git Bash (MINGW64)
    .then(({ code }) => process.exit(code))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};
