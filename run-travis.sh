#!/usr/bin/env bash
if [ $COVERAGE ]; then
  istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec test/**/*-test.js
  ./node_modules/coveralls/bin/coveralls.js < ./coverage/lcov.info
  ./node_modules/codeclimate-test-reporter/bin/codeclimate.js < ./coverage/lcov.info
  rm -rf ./coverage
else
  ember try:one $EMBER_TRY_SCENARIO test --skip-cleanup
fi
