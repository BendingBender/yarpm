# Change Log

## v1.2.0

- improve compatibility with Windows (thanks @luy19) (#7)
- upgrade dev dependencies
- update tests to run only on supported node versions

## v1.1.1

- fix permission flags for `yarpm-pnpm` binary, add tests

## v1.1.0

- add `yarpm-pnpm` binary to prefer `pnpm` over `npm` when run outside of a script

## v1.0.1

- upgrade dependencies

**BREAKING**:

- drop support for Node < 8

## v0.2.1

- fix script to run on Node 4

## v0.2.0

- add Node API to readme
- `yarpm` now resolves the promise with the argument list passed to spawn instead of the list passed to `yarpm`
