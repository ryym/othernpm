#!/usr/bin/env node

'use strict';

if (needHelp(process.argv)) {
  showUsage();
  return;
}

var onpm = require('../build');
var pathOrAlias = process.argv[2];
var command = process.argv.splice(3);
var alias, path;

if (onpm.hasOwnProperty(pathOrAlias)) {
  alias = pathOrAlias;
  onpm[alias](command);
}
else {
  path = pathOrAlias;
  onpm(path)(command);
}

/**
 * Return true if arguments are invalid
 * or it requires help messages.
 */
function needHelp(argv) {
  if (argv.length < 4) {
    return true;
  }
  var command = argv[2];
  switch (command) {
  case '-h':
  case '--help':
    return true;
  default:
    return false;
  }
}

function showUsage() {
  console.log('Usage: onpm [path|alias] [npm command]');
}
