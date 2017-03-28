'use strict';

const crossSpawn = require('cross-spawn');
const detectStreamKind = require('./detect-stream-kind');
const path = require('path');

/**
 * Runs either npm or yarn in a child process, depending on whether current process was itself started via
 * `npm run` or `yarn run`. Passes all command line arguments down to the child process.
 *
 * @param {string[]} argv - The argument list to pass to npm/yarn.
 * @param {object|undefined} [options] Optional.
 * @param {stream.Readable|null|undefined} options.stdin -
 *   A readable stream to send messages to stdin of child process.
 *   If this is `null` or `undefined`, ignores it.
 *   If this is `process.stdin`, inherits it.
 *   Otherwise, makes a pipe.
 *   Default is `null`.
 * @param {stream.Writable|null|undefined} options.stdout -
 *   A writable stream to receive messages from stdout of child process.
 *   If this is `null` or `undefined`, cannot send.
 *   If this is `process.stdout`, inherits it.
 *   Otherwise, makes a pipe.
 *   Default is `null`.
 * @param {stream.Writable|null|undefined} options.stderr -
 *   A writable stream to receive messages from stderr of child process.
 *   If this is `null` or `undefined`, cannot send.
 *   If this is `process.stderr`, inherits it.
 *   Otherwise, makes a pipe.
 *   Default is `null`.
 * @param {string} options.npmPath -
 *   The path to npm/yarn.
 *   Default is `process.env.npm_execpath` if set, `npm` otherwise.
 * @param {object} [options.env] -
 *   Environment key-value pairs, replaces the default usage of process.env to spawn child process.
 * @returns {Promise}
 *   A promise object which becomes fulfilled when npm/yarn child process is finished.
 */
module.exports = function yarpm(argv, options) {
  return new Promise((resolve, reject) => {
    options = options || {};

    const stdinKind = detectStreamKind(options.stdin, process.stdin);
    const stdoutKind = detectStreamKind(options.stdout, process.stdout);
    const stderrKind = detectStreamKind(options.stderr, process.stderr);
    const spawnOptions = {stdio: [stdinKind, stdoutKind, stderrKind]};

    if (options.env) {
      spawnOptions.env = options.env;
    }

    let execPath;
    let spawnArgs;
    if (!options.npmPath || path.extname(options.npmPath) === '.js') {
      const npmPath = options.npmPath || process.env.npm_execpath;
      execPath = npmPath ? process.execPath : 'npm';
      spawnArgs = npmPath ? [npmPath].concat(argv) : argv;
    } else {
      execPath = options.npmPath;
      spawnArgs = argv;
    }

    let cp = crossSpawn(execPath, spawnArgs, spawnOptions);

    // Piping stdio.
    if (stdinKind === 'pipe') {
      options.stdin.pipe(cp.stdin)
    }
    if (stdoutKind === 'pipe') {
      cp.stdout.pipe(options.stdout, {end: false});
    }
    if (stderrKind === 'pipe') {
      cp.stderr.pipe(options.stderr, {end: false});
    }

    cp.on('error', err => {
      cp = null;
      reject(err);
    });
    cp.on('close', code => {
      cp = null;
      resolve({spawnArgs, code});
    });
  });
};
