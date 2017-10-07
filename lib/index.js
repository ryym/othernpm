import spawn from 'cross-spawn';
import isDir from 'is-directory';
import findConfig from 'find-config';
import othernpm from './othernpm';
import configure from './configure';

/**
 * The interface which accepts a path and commands
 * (Curried function).
 */
module.exports = configure({
  io: {
    spawn,
    isDirectory: isDir.sync.bind(isDir),
    onExit: exitByGivenCode
  },
  config: findOthernpmConfig(),
  othernpm
});

function findOthernpmConfig() {
  const pkg = findConfig.require('package.json', {
    home: false
  });
  return pkg == null ? {} : pkg.othernpm;
}

function exitByGivenCode(code) {
  process.exit(code);
}
