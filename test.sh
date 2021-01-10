#!/bin/bash
set -euxo pipefail

npm link

rm -R test-project 2>/dev/null || true
mkdir test-project
pushd test-project 1>/dev/null

npm init -y
npm link yarpm
jq '.scripts=(.scripts + { "echo": "echo $(ps -p \"$$\" -o ppid= | xargs ps -o command | tail -n -1)", "yarpm-echo": "yarpm run echo", "yarpm-yarn-echo": "yarpm-yarn run echo" })' package.json > package.$$.json && mv package.$$.json package.json
unset npm_execpath

function run_test {
  exe=$1
  npm_script=$2
  test_pattern=$3

  $exe run "$npm_script" foo > "$exe-$npm_script".$$.txt 2>&1
  grep -E "$test_pattern" "$exe-$npm_script".$$.txt 1>/dev/null || { echo 'test for "'"$exe"' run '"$npm_script"'" failed!'; exit 1; }
}

run_test npm yarpm-echo '^npm foo$'
run_test yarn yarpm-echo '^.+/yarn.js run echo foo foo$'
run_test npm yarpm-yarn-echo '^.+/yarn.js run echo foo foo$'

popd 1>/dev/null
