#!/usr/bin/env bash
istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec test/**/*.js && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage
