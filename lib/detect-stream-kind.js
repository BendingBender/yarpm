'use strict';

/**
 * Converts a given stream to an option for `child_process.spawn`.
 *
 * @param {stream.Readable|stream.Writable|null} stream - An original stream to convert.
 * @param {process.stdin|process.stdout|process.stderr} std - A standard stream for this option.
 * @returns {string|stream.Readable|stream.Writable} An option for `child_process.spawn`.
 */
module.exports = function detectStreamKind(stream, std) {
  let kind = stream;
  if (stream == null) {
    kind = 'ignore';
  } else {
    // `|| !std.isTTY` is needed for the workaround of https://github.com/nodejs/node/issues/5620
    if (stream !== std || !std.isTTY) {
      kind = 'pipe';
    }
  }

  return kind;
};
