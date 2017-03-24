# yarpm
A CLI tool to run npm scripts with either npm or yarn, depending on how it was started. Useful for setups where
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
unfiltered to the chosen package manager. So *theoretically* you can create the following `package.json` and pass the
`-s` flag to `yarpm` to silence `npm` output:
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
This is due to the fact that `yarn` doesn't understand the `-s` option. This is up to you to write your scripts in
a way that is compatible to both, `npm` and `yarn`.

## Installation

```bash
$ npm install yarpm --save-dev
# or
$ yarn add yarpm --dev
```

- The `yarpm` package introduces 2 CLI commands: `yarpm` and `yarpm-yarn`.

## CLI Commands

This `yarpm` package provides 2 CLI commands.

- [yarpm]
- [yarpm-yarn]

The main command is [yarpm].

### yarpm
This command is an in-place substitute places in `package.json` where `npm` or `yarn` is being explicitly used. It reads
the `npm_execpath` environment variable to determine the path to the currently used package manager. This env var is
only set when running `yarpm` as a script. If `yarpm` is used without being embedded in a script, it will **always**
choose `npm`.

### yarpm-yarn
This command can be used in places where you are not in control of how your script is being started, for example when
using `husky` to run a script as a git hook. This script will **always** prefer `yarn` over `npm` unless `yarn` is not
available. Only then will it fall back to `npm`.


## Node API

The `yarpm` package provides a node API.

- ***TODO***

## Changelog

- ***TODO***

## Contributing

Thank you for contributing!

### Bug Reports or Feature Requests

Please use GitHub Issues.
