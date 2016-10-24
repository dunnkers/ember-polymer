#!/usr/bin/env bash
if [ $COVERAGE ]; then
  istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec test/**/*-test.js &&
    cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js &&
    rm -rf ./coverage
else
  ember try:one $EMBER_TRY_SCENARIO test --skip-cleanup
fi
