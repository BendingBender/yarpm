#!/bin/bash
set -euo pipefail

npm link

rm -R test-project 2>/dev/null || true
mkdir test-project
pushd test-project 1>/dev/null

cat <<'EOF' > package.json
{
  "scripts": {
    "echo": "echo \"$npm_config_user_agent\"",
    "yarpm-echo": "yarpm run echo",
    "yarpm-pnpm-echo": "yarpm-pnpm run echo",
    "yarpm-yarn-echo": "yarpm-yarn run echo"
  }
}
EOF
npm link yarpm
unset npm_execpath

function run_test {
  exe=$1
  npm_script=$2
  test_pattern=$3

  echo 'Testing "'"$exe"' run '"$npm_script"'"'
  $exe run "$npm_script" foo > "$exe-$npm_script".$$.txt 2>&1
  set +e
  grep -E "$test_pattern" "$exe-$npm_script".$$.txt 1>/dev/null
  grep_result=$?
  set -e

  if [[ $grep_result -ne 0 ]]; then
    echo 'test for "'"$exe"' run '"$npm_script failed! Couldn't find pattern $test_pattern in output:"
    cat "$exe-$npm_script".$$.txt
    exit 1
  else
    echo "Success!"
  fi
}

run_test npm yarpm-echo '^npm/.+foo$'
run_test pnpm yarpm-echo '^pnpm/.+foo$'
run_test npm yarpm-pnpm-echo '^pnpm/.+foo$'
run_test yarn yarpm-echo '^yarn/.+foo$'
run_test npm yarpm-yarn-echo '^yarn/.+foo$'

popd 1>/dev/null
