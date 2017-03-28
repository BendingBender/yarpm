# yarpm
A CLI tool to run npm scripts with either `npm` or `yarn`, depending on how it was started. Useful for setups where
some team members use `npm` while others use `yarn`.

This tool is a helper to run scripts from `package.json`. Just substitute all `npm` or `yarn` calls with `yarpm`
and you're good to go:
```json
{
  "scripts": {
    "start": "yarpm run build",
    "build": "tsc index.ts"
  }
}
```

When running the `start` script with `yarn start`, the dependent `build` script will be spawned with `yarn`:
```bash
yarn run build
```

Running the same script with `npm start` will result in the dependent `build` being run with `npm`:
```bash
npm run build
```

## What this tool is *not*
This tool is not meant to be an abstraction layer for calling `npm` or `yarn`. It will pass **all** arguments it receives
unfiltered to the chosen package manager. So you could create the following `package.json` and pass the `-s` flag to
`yarpm` to silence `npm` output:
```json
{
  "scripts": {
    "start": "yarpm run -s build",
    "build": "tsc index.ts"
  }
}
```
This will work if you invoke the script with `npm start`. Running the script with `yarn start` will result in the 
following error:
```
yarn run v0.21.3
error No command specified.
....
```
This is due to the fact that `yarn` doesn't understand the `-s` option. This is up to you to write your scripts so
 that only commands and options available to both `npm` and `yarn` are used.

## Installation

```bash
$ npm install yarpm --save-dev
# or
$ yarn add yarpm --dev
```

## CLI Commands

This `yarpm` package provides 2 CLI commands.

- [yarpm](#yarpm-1)
- [yarpm-yarn](#yarpm-yarn)

The main command is `yarpm`.

### yarpm
This command is an in-place substitute for places in `package.json` where `npm` or `yarn` is being used explicitly.
It reads the `npm_execpath` environment variable to determine the path to the currently used package manager. This env
var is only set when running `yarpm` as a script. If `yarpm` is used without being embedded in a script, it will
**always** choose `npm`.

### yarpm-yarn
This command can be used in places where you are not in control of how your script is being started, for example when
using `husky` to run a script as a git hook. This script will **always** prefer `yarn` over `npm` unless `yarn` is not
available. Only then will it fall back to `npm`.


## Node API

The `yarpm` package provides a node API.

```js
const yarpm = require('yarpm');
const promise = yarpm(argv, options);
```

- **argv** `string[]` -- The argument list to pass to npm/yarn.
- **options** `object|undefined`
  - **options.npmPath** `string` -
    The path to npm/yarn.
    Default is `process.env.npm_execpath` if set, `npm` otherwise.
  - **options.env** `object` -
    Sets the environment key-value pairs, replaces the default usage of process.env to spawn child process.
  - **options.stdin** `stream.Readable|null` --
    A readable stream to send messages to stdin of child process.
    If this is `null` or `undefined`, ignores it.
    If this is `process.stdin`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stdin` in order to send from stdin.
  - **options.stdout** `stream.Writable|null` --
    A writable stream to receive messages from stdout of child process.
    If this is `null` or `undefined`, cannot send.
    If this is `process.stdout`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stdout` in order to print to stdout.
  - **options.stderr** `stream.Writable|null` --
    A writable stream to receive messages from stderr of child process.
    If this is `null` or `undefined`, cannot send.
    If this is `process.stderr`, inherits it.
    Otherwise, makes a pipe.
    Default is `null`.
    Set to `process.stderr` in order to print to stderr.

`yarpm` returns a promise that will becomes *fulfilled* when the spawned process exits ***regardless of the exit code***.
The promise will become *rejected* when in case of an internal error inside of `yarpm`.

The promise fulfills with an object with the following 2 properties: `argv` and `code`.
The `spawnArgs` property is the array arguments that was passed to spawn the sub-process.
The `code` property is the exit code of the sub-process.

```js
yarpm(['install']).then(result => {
  console.log(`${result.spawnArgs} -- ${result.code}`);
  // if executed as a package.json script via yarn: /usr/share/yarn/bin/yarn.js,install -- 0
});
```

## Changelog

https://github.com/BendingBender/yarpm/blob/master/CHANGELOG.md

## Contributing

Thank you for contributing!

### Bug Reports or Feature Requests

Please use GitHub Issues.

## License
[MIT](https://github.com/BendingBender/yarpm/blob/master/LICENSE)