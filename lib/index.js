import spawn from 'cross-spawn';
import fs from 'fs';
import findConfig from 'find-config';
import othernpm from './othernpm';
import configure from './configure';

/**
 * The interface which accepts a path and commands
 * (Curried function).
 */
module.exports = configure({
  io: { spawn, isDirectory },
  config: findOthernpmConfig(),
  othernpm
});

function isDirectory(path) {
  try {
    const stat = fs.statSync(path);
    return stat.isDirectory();
  } catch(e) {
    return false;
  }
}

function findOthernpmConfig() {
  const pkg = findConfig.require('package.json', {
    home: false
  });
  return pkg == null ? {} : pkg.othernpm;
}
