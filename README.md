# Othernpm

[![npm version][npm-badge]][npm-version]
[![Travis Build Status][travis-badge]][travis]
[![App Veyor Build status][appveyor-badge]][appveyor]
[![Coverage Status][coveralls-badge]][coveralls]
[![Dependency Status][david-badge]][david]
[![devDependency Status][david-dev-badge]][david-dev]

[npm-badge]: https://img.shields.io/npm/v/othernpm.svg
[npm-version]: https://www.npmjs.org/package/othernpm
[travis-badge]: https://travis-ci.org/ryym/othernpm.svg?branch=master
[travis]: https://travis-ci.org/ryym/othernpm
[appveyor-badge]: https://ci.appveyor.com/api/projects/status/rgc3vn28sc9robt0/branch/master?svg=true
[appveyor]: https://ci.appveyor.com/project/ryym/othernpm/branch/master
[coveralls-badge]: https://coveralls.io/repos/github/ryym/othernpm/badge.svg?branch=master
[coveralls]: https://coveralls.io/github/ryym/othernpm?branch=master
[david-badge]: https://david-dm.org/ryym/othernpm.svg
[david]: https://david-dm.org/ryym/othernpm
[david-dev-badge]: https://david-dm.org/ryym/othernpm/dev-status.svg
[david-dev]: https://david-dm.org/ryym/othernpm#info=devDependencies

Othernpm provides a way to run npm commands in other directories.
A typical use of this module would be to run npm scripts of subdirectories
that have own `package.json`.

## Usage

### CLI

Othernpm allows you to specify a path where npm commands run.

```sh
# 'cd ./templates && npm install'
% onpm ./templates install
```

You can also define paths in `package.json` and use them to specify
a path.

```json
{
  "name": "package name",
  ...
  "othernpm": {
    "examples": "./examples",
    "site": "./site"
  }
}
```

```sh
# 'cd ./site && npm run build'
% onpm site run build

# 'cd ./examples && npm test'
% onpm examples test
```

For example, this repository defines a npm-script named `eg` in its [package.json][root-pkg].
By this, we can run any npm command in [test/example] from the root directory like:

[root-pkg]: ./package.json
[test/example]: ./test/example

```sh
# Check defined npm-scripts in 'test/example'.
% npm run eg -- run

# Install Mocha as a dev-dependency of 'test/example'.
% npm run eg -- install --save-dev mocha
```

### Node.js API

Othernpm also provides API used in Node.js scripts.
The module loads configurations from `package.json` automatically
so that you can use them as functions.

```javascript
const onpm = require('othernpm');

// Run the 'start' script in the examples directory.
onpm.example('start');

// Run the 'build' script in the site directory.
onpm.site('run build');

// Run npm commands in another directory.
onpm('./templates')('test');
```

The othernpm function returns a [spawn] object.

[spawn]: https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options

```javascript
const build = onpm.examples('run build');
build.on('exit', exitCode => console.log(exitCode));
```

## Installation

```sh
npm install --save-dev othernpm
```

## License

MIT
