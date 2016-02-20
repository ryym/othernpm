#!/usr/bin/env node

'use strict';

var onpm = require('../build');
var pathOrAlias = process.argv[2];
var command = process.argv.splice(3);

if (onpm.hasOwnProperty(pathOrAlias)) {
  const alias = pathOrAlias;
  onpm[alias](command);
}
else {
  const path = pathOrAlias;
  onpm(path)(command);
}
